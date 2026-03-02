'use strict';

const { STRICT_RELIGIOUS_MODE } = require('./config');
const { validateDomain } = require('./domain-validator');
const { validateScholar } = require('./scholar-validator');

const SOURCE_LEVELS = new Set([1, 2, 3, 4]);
const PRIMARY_SOURCE_TYPES = new Set(['quran', 'hadith']);

function normalizeSource(source) {
  return {
    id: source.id,
    url: source.url,
    level: Number(source.level || 0),
    source_type: String(source.source_type || '').toLowerCase(),
    scholar_name: source.scholar_name || null,
    precise_locator: source.precise_locator || '',
    claim_ids: Array.isArray(source.claim_ids) ? source.claim_ids.slice() : [],
    explicit_madhhab_attribution: Boolean(source.explicit_madhhab_attribution)
  };
}

function collectCandidateSources(sources, options = {}) {
  const strict = options.strict ?? STRICT_RELIGIOUS_MODE;
  const accepted = [];
  const rejected = [];

  for (const rawSource of Array.isArray(sources) ? sources : []) {
    const source = normalizeSource(rawSource);

    if (!source.id || !source.url) {
      rejected.push({
        source,
        reason: 'missing_source_id_or_url'
      });
      continue;
    }

    if (!SOURCE_LEVELS.has(source.level)) {
      rejected.push({
        source,
        reason: 'invalid_source_level'
      });
      continue;
    }

    const domainValidation = validateDomain(source.url);
    if (!domainValidation.valid) {
      rejected.push({
        source,
        reason: domainValidation.reason
      });
      continue;
    }

    if (strict && source.level === 1 && !PRIMARY_SOURCE_TYPES.has(source.source_type)) {
      rejected.push({
        source,
        reason: 'invalid_primary_source_type'
      });
      continue;
    }

    const scholarValidation = validateScholar(source);
    if (!scholarValidation.valid) {
      rejected.push({
        source,
        reason: scholarValidation.reason
      });
      continue;
    }

    accepted.push({
      ...source,
      scholar: scholarValidation.scholar
    });
  }

  return { accepted, rejected };
}

module.exports = {
  SOURCE_LEVELS,
  PRIMARY_SOURCE_TYPES,
  normalizeSource,
  collectCandidateSources
};
