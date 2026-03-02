'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  collectCandidateSources,
  NameEntryGenerator,
  createInsufficientEvidenceFallback,
  applyHumanReview
} = require('../religious-integrity');

function makeFetch(responses = {}) {
  return async (url, init = {}) => {
    const method = String(init.method || 'GET').toUpperCase();
    const key = `${method} ${url}`;
    const response = responses[key] || responses[url] || { status: 200, final_url: url };
    const status = Number(response.status || 200);
    return {
      status,
      ok: status >= 200 && status < 300,
      url: response.final_url || url
    };
  };
}

function buildBaseCandidate() {
  return {
    slug: 'test-name',
    arabic: 'الاختبار',
    transliteration: 'Test',
    french_name: 'Test',
    short_meaning: 'Test',
    canonical_status: {
      in_99_list: false,
      note: 'Test fixture'
    },
    primary_evidence: {
      quran: [
        {
          source_id: 'quran-1',
          surah: 1,
          ayah: 1,
          reference_label: 'Al-Fatiha 1:1',
          source_url: 'https://quran.com/1:1'
        }
      ],
      hadith: []
    },
    scholarly_explanations: [],
    interpretation_notes: {
      consensus_core: 'Test consensus',
      nuances: [],
      prohibited_overclaims: []
    },
    claims: [
      {
        id: 'claim-1',
        text: 'Le nom est atteste dans le Quran.',
        source_ids: ['quran-1']
      }
    ],
    sources: [
      {
        id: 'quran-1',
        url: 'https://quran.com/1:1',
        level: 1,
        source_type: 'quran',
        precise_locator: 'Surah 1 Ayah 1',
        claim_ids: ['claim-1']
      }
    ]
  };
}

test('rejects source outside allowlist', () => {
  const result = collectCandidateSources([
    {
      id: 'bad-1',
      url: 'https://example.com/fake',
      level: 1,
      source_type: 'quran'
    }
  ]);

  assert.equal(result.accepted.length, 0);
  assert.equal(result.rejected.length, 1);
  assert.equal(result.rejected[0].reason, 'domain_not_allowlisted');
});

test('rejects scholar outside allowlist', () => {
  const result = collectCandidateSources([
    {
      id: 'tafsir-1',
      url: 'https://shamela.ws/book/123',
      level: 2,
      source_type: 'tafsir',
      scholar_name: 'Unknown Scholar'
    }
  ]);

  assert.equal(result.accepted.length, 0);
  assert.equal(result.rejected.length, 1);
  assert.equal(result.rejected[0].reason, 'scholar_not_allowlisted');
});

test('broken link blocks publication', async () => {
  const candidate = buildBaseCandidate();
  const generator = new NameEntryGenerator({
    linkVerifier: {
      verifyMany: async () => [
        {
          source: candidate.sources[0],
          verification: {
            url: candidate.sources[0].url,
            status: 'failed',
            http_status: 404,
            checked_at: new Date().toISOString(),
            reason: 'not_found'
          }
        }
      ]
    }
  });

  const entry = await generator.generateFromCandidate(candidate);
  assert.equal(entry.public_display_allowed, false);
  assert.ok(
    entry.publication_blockers.includes('INSUFFICIENT_EVIDENCE') ||
    entry.publication_blockers.includes('link_verification_failed_or_pending')
  );
});

test('unsupported claim blocks publication', async () => {
  const candidate = buildBaseCandidate();
  candidate.claims = [{ id: 'claim-1', text: 'Texte sans source', source_ids: [] }];
  candidate.sources[0].claim_ids = [];

  const generator = new NameEntryGenerator({
    linkVerifier: {
      verifyMany: async (sources) =>
        sources.map((source) => ({
          source,
          verification: {
            url: source.url,
            status: 'passed',
            http_status: 200,
            final_url: source.url,
            checked_at: new Date().toISOString()
          }
        }))
    }
  });

  const entry = await generator.generateFromCandidate(candidate);
  assert.equal(entry.public_display_allowed, false);
  assert.ok(entry.attribution_integrity.unsupported_claims_count > 0);
  assert.ok(entry.publication_blockers.includes('unsupported_claims_detected'));
});

test('madhhab overclaim without explicit evidence is rejected', async () => {
  const candidate = buildBaseCandidate();
  candidate.claims = [
    {
      id: 'claim-1',
      text: 'Selon les malikites, ce sens est obligatoire.',
      source_ids: ['quran-1']
    }
  ];

  const generator = new NameEntryGenerator({
    linkVerifier: {
      verifyMany: async (sources) =>
        sources.map((source) => ({
          source,
          verification: {
            url: source.url,
            status: 'passed',
            http_status: 200,
            final_url: source.url,
            checked_at: new Date().toISOString()
          }
        }))
    }
  });

  const entry = await generator.generateFromCandidate(candidate);
  assert.equal(entry.public_display_allowed, false);
  assert.ok(
    entry.attribution_integrity.issues.some((issue) =>
      issue.startsWith('madhhab_overclaim_without_evidence')
    )
  );
});

test('content is never displayed before human approval', async () => {
  const candidate = buildBaseCandidate();
  const generator = new NameEntryGenerator({
    linkVerifier: {
      verifyMany: async (sources) =>
        sources.map((source) => ({
          source,
          verification: {
            url: source.url,
            status: 'passed',
            http_status: 200,
            final_url: source.url,
            checked_at: new Date().toISOString()
          }
        }))
    }
  });

  const entry = await generator.generateFromCandidate(candidate);
  assert.equal(entry.editorial_review.status, 'needs_human_review');
  assert.equal(entry.public_display_allowed, false);

  const reviewed = applyHumanReview(entry, {
    status: 'approved',
    reviewer_id: 'reviewer-001',
    notes: 'Validation religieuse effectuee.'
  });
  assert.equal(reviewed.public_display_allowed, true);
});

test('fallback INSUFFICIENT_EVIDENCE is returned for uncertain content', async () => {
  const candidate = buildBaseCandidate();
  candidate.sources = [];
  candidate.primary_evidence.quran = [];
  candidate.claims = [];

  const generator = new NameEntryGenerator({
    linkVerifier: {
      verifyMany: async () => []
    }
  });

  const entry = await generator.generateFromCandidate(candidate);
  assert.equal(entry.public_display_allowed, false);
  assert.equal(entry.interpretation_notes.consensus_core, 'INSUFFICIENT_EVIDENCE');

  const fallback = createInsufficientEvidenceFallback(candidate, 'INSUFFICIENT_EVIDENCE');
  assert.equal(fallback.public_display_allowed, false);
  assert.ok(fallback.publication_blockers.includes('INSUFFICIENT_EVIDENCE'));
});

test('link verifier fallback mock works', async () => {
  const fetchImpl = makeFetch({
    'HEAD https://quran.com/1:1': { status: 200, final_url: 'https://quran.com/1:1' }
  });
  const generator = new NameEntryGenerator({
    linkVerifier: new (require('../religious-integrity').LinkVerifier)({
      fetchImpl
    })
  });
  const entry = await generator.generateFromCandidate(buildBaseCandidate());
  assert.equal(entry.link_verification[0].status, 'passed');
});
