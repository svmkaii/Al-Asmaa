'use strict';

const { STRICT_RELIGIOUS_MODE } = require('./config');
const { collectCandidateSources } = require('./source-collector');
const { LinkVerifier } = require('./link-verifier');
const { verifyAttributionIntegrity } = require('./attribution-verifier');
const { applyPublicationDecision } = require('./publication-guard');

function createInsufficientEvidenceFallback(input = {}, reason = 'INSUFFICIENT_EVIDENCE', now = null) {
  const timestamp = now || new Date().toISOString();
  return {
    slug: input.slug || 'unknown',
    arabic: input.arabic || '',
    transliteration: input.transliteration || '',
    french_name: input.french_name || '',
    short_meaning: '',
    canonical_status: input.canonical_status || {
      in_99_list: false,
      note: 'INSUFFICIENT_EVIDENCE'
    },
    primary_evidence: {
      quran: [],
      hadith: []
    },
    scholarly_explanations: [],
    interpretation_notes: {
      consensus_core: 'INSUFFICIENT_EVIDENCE',
      nuances: [],
      prohibited_overclaims: [
        'Ne pas publier de sens sans preuve primaire/secondaire approuvee.',
        'Ne pas attribuer une nuance de madhhab sans source explicite.'
      ]
    },
    attribution_integrity: {
      every_claim_has_source: false,
      unsupported_claims_count: 1,
      source_conflicts_detected: false,
      conflict_notes: [reason]
    },
    link_verification: [],
    editorial_review: {
      status: 'needs_human_review',
      notes: `Blocage automatique: ${reason}`
    },
    public_display_allowed: false,
    publication_blockers: [reason],
    generated_at: timestamp
  };
}

function createRejectedLinkRecord(rejectedSource, now) {
  return {
    url: rejectedSource.source.url,
    status: 'failed',
    checked_at: now,
    reason: rejectedSource.reason
  };
}

function mergeEvidenceWithLinkStatus(items, linkBySourceId) {
  return (Array.isArray(items) ? items : []).map((item) => {
    const sourceId = item.source_id;
    const linkStatus = sourceId ? linkBySourceId.get(sourceId) : null;
    const { source_id, ...rest } = item;
    return {
      ...rest,
      deep_link_verified: Boolean(linkStatus && linkStatus.status === 'passed')
    };
  });
}

class NameEntryGenerator {
  constructor(options = {}) {
    this.strict = options.strict ?? STRICT_RELIGIOUS_MODE;
    this.auditTrail = options.auditTrail || null;
    this.linkVerifier = options.linkVerifier || new LinkVerifier({ strict: this.strict });
    this.now = options.now || (() => new Date().toISOString());
  }

  log(event) {
    if (this.auditTrail && typeof this.auditTrail.log === 'function') {
      this.auditTrail.log(event);
    }
  }

  async generateFromCandidate(candidate) {
    const now = this.now();
    if (!candidate || !candidate.slug) {
      throw new Error('INVALID_CANDIDATE_INPUT');
    }

    const collection = collectCandidateSources(candidate.sources || [], {
      strict: this.strict
    });

    for (const rejected of collection.rejected) {
      this.log({
        slug: candidate.slug,
        stage: 'source_collection',
        url_original: rejected.source.url,
        status: 'rejected',
        reason: rejected.reason
      });
    }

    if (this.strict && collection.accepted.length === 0) {
      this.log({
        slug: candidate.slug,
        stage: 'synthesis',
        status: 'blocked',
        reason: 'INSUFFICIENT_EVIDENCE:no_accepted_sources'
      });
      return createInsufficientEvidenceFallback(candidate, 'INSUFFICIENT_EVIDENCE', now);
    }

    const linkVerificationPairs = await this.linkVerifier.verifyMany(collection.accepted);
    const linkBySourceId = new Map();
    const linkStatusBySourceId = new Map();
    const linkVerification = [];

    for (const pair of linkVerificationPairs) {
      linkBySourceId.set(pair.source.id, pair.verification);
      linkStatusBySourceId.set(pair.source.id, pair.verification.status);
      linkVerification.push(pair.verification);
      this.log({
        slug: candidate.slug,
        stage: 'link_verification',
        url_original: pair.source.url,
        url_final: pair.verification.final_url || pair.source.url,
        status: pair.verification.status,
        reason: pair.verification.reason || null,
        http_status: pair.verification.http_status || null
      });
    }

    for (const rejected of collection.rejected) {
      linkVerification.push(createRejectedLinkRecord(rejected, now));
    }

    const sourceById = new Map();
    for (const source of collection.accepted) {
      sourceById.set(source.id, source);
    }

    const attributionIntegrity = verifyAttributionIntegrity(candidate, {
      strict: this.strict,
      sourceById,
      linkStatusBySourceId
    });

    const primaryEvidence = {
      quran: mergeEvidenceWithLinkStatus(candidate.primary_evidence?.quran, linkBySourceId),
      hadith: mergeEvidenceWithLinkStatus(candidate.primary_evidence?.hadith, linkBySourceId)
    };

    const passedQuran = primaryEvidence.quran.filter((item) => item.deep_link_verified).length;
    const passedHadith = primaryEvidence.hadith.filter((item) => item.deep_link_verified).length;

    if (this.strict && passedQuran + passedHadith === 0) {
      this.log({
        slug: candidate.slug,
        stage: 'content_verification',
        status: 'blocked',
        reason: 'INSUFFICIENT_EVIDENCE:no_verified_primary_evidence'
      });
      return createInsufficientEvidenceFallback(candidate, 'INSUFFICIENT_EVIDENCE', now);
    }

    const entry = {
      slug: candidate.slug,
      arabic: candidate.arabic,
      transliteration: candidate.transliteration,
      french_name: candidate.french_name,
      short_meaning: candidate.short_meaning,
      canonical_status: candidate.canonical_status || {
        in_99_list: false,
        note: 'Statut canonique non documente'
      },
      primary_evidence: primaryEvidence,
      scholarly_explanations: mergeEvidenceWithLinkStatus(
        candidate.scholarly_explanations,
        linkBySourceId
      ).map((explanation) => ({
        ...explanation,
        scholar_status: 'approved'
      })),
      interpretation_notes: candidate.interpretation_notes || {
        consensus_core: 'INSUFFICIENT_EVIDENCE',
        nuances: [],
        prohibited_overclaims: []
      },
      attribution_integrity: attributionIntegrity,
      link_verification: linkVerification,
      editorial_review: {
        status: 'needs_human_review',
        notes: 'Validation humaine religieuse obligatoire'
      },
      public_display_allowed: false,
      generated_at: now
    };

    const securedEntry = applyPublicationDecision(entry, {
      strict: this.strict
    });

    this.log({
      slug: candidate.slug,
      stage: 'publication_guard',
      status: securedEntry.public_display_allowed ? 'allowed' : 'blocked',
      reason: securedEntry.public_display_allowed
        ? null
        : securedEntry.publication_blockers.join(',')
    });

    return securedEntry;
  }
}

module.exports = {
  NameEntryGenerator,
  createInsufficientEvidenceFallback
};
