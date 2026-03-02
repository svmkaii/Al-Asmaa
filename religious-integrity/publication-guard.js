'use strict';

const { STRICT_RELIGIOUS_MODE } = require('./config');

function evaluatePublication(entry, options = {}) {
  const strict = options.strict ?? STRICT_RELIGIOUS_MODE;
  const blockers = [];

  if (strict) {
    const quranCount = entry?.primary_evidence?.quran?.length || 0;
    const hadithCount = entry?.primary_evidence?.hadith?.length || 0;
    if (quranCount + hadithCount === 0) {
      blockers.push('missing_primary_evidence');
    }
  }

  const linkChecks = Array.isArray(entry?.link_verification) ? entry.link_verification : [];
  const failedLinks = linkChecks.filter((item) => item.status !== 'passed');
  if (failedLinks.length > 0) {
    blockers.push('link_verification_failed_or_pending');
  }

  const integrity = entry?.attribution_integrity;
  if (!integrity?.every_claim_has_source) {
    blockers.push('attribution_missing_sources');
  }
  if ((integrity?.unsupported_claims_count || 0) > 0) {
    blockers.push('unsupported_claims_detected');
  }
  if (integrity?.source_conflicts_detected) {
    blockers.push('source_conflicts_detected');
  }

  if (entry?.editorial_review?.status !== 'approved') {
    blockers.push('human_review_not_approved');
  }

  return {
    blockers,
    public_display_allowed: blockers.length === 0
  };
}

function applyPublicationDecision(entry, options = {}) {
  const decision = evaluatePublication(entry, options);
  return {
    ...entry,
    public_display_allowed: decision.public_display_allowed,
    publication_blockers: decision.blockers
  };
}

module.exports = {
  evaluatePublication,
  applyPublicationDecision
};
