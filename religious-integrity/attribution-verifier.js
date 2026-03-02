'use strict';

const { STRICT_RELIGIOUS_MODE } = require('./config');

const MADHHAB_OVERCLAIM_PATTERN =
  /\b(selon|les|avis des)\s+(malikites|hanafites|hanbalites|shafiites|asharites|maturidites)\b/i;

function hasExplicitMadhhabEvidence(sourceIds, sourceById) {
  for (const sourceId of sourceIds) {
    const source = sourceById.get(sourceId);
    if (source && source.explicit_madhhab_attribution) {
      return true;
    }
  }
  return false;
}

function verifyAttributionIntegrity(draft, options = {}) {
  const strict = options.strict ?? STRICT_RELIGIOUS_MODE;
  const sourceById = options.sourceById || new Map();
  const linkStatusBySourceId = options.linkStatusBySourceId || new Map();
  const issues = [];
  const conflictNotes = [];
  let unsupportedClaimsCount = 0;

  const claims = Array.isArray(draft.claims) ? draft.claims : [];
  if (strict && claims.length === 0) {
    issues.push('missing_claims_catalog');
    unsupportedClaimsCount += 1;
  }

  for (const claim of claims) {
    const sourceIds = Array.isArray(claim.source_ids) ? claim.source_ids : [];
    if (sourceIds.length === 0) {
      issues.push(`claim_without_source:${claim.id || 'unknown'}`);
      unsupportedClaimsCount += 1;
      continue;
    }

    const usableSources = sourceIds.filter((sourceId) => {
      const source = sourceById.get(sourceId);
      const linkStatus = linkStatusBySourceId.get(sourceId);
      return Boolean(source) && linkStatus === 'passed';
    });

    if (usableSources.length === 0) {
      issues.push(`claim_without_usable_source:${claim.id || 'unknown'}`);
      unsupportedClaimsCount += 1;
    }

    if (
      claim.text &&
      MADHHAB_OVERCLAIM_PATTERN.test(claim.text) &&
      !hasExplicitMadhhabEvidence(sourceIds, sourceById)
    ) {
      issues.push(`madhhab_overclaim_without_evidence:${claim.id || 'unknown'}`);
      unsupportedClaimsCount += 1;
    }
  }

  if (Array.isArray(draft.declared_conflicts) && draft.declared_conflicts.length > 0) {
    for (const conflict of draft.declared_conflicts) {
      conflictNotes.push(String(conflict));
    }
  }

  if (strict && draft.interpretation_notes) {
    const nuances = Array.isArray(draft.interpretation_notes.nuances)
      ? draft.interpretation_notes.nuances
      : [];
    for (const nuance of nuances) {
      const sources = Array.isArray(nuance.sources) ? nuance.sources : [];
      if (!nuance.source_backed || sources.length === 0) {
        issues.push(`nuance_without_sources:${nuance.label || 'unknown'}`);
        unsupportedClaimsCount += 1;
      }
    }
  }

  return {
    every_claim_has_source: unsupportedClaimsCount === 0 && issues.length === 0,
    unsupported_claims_count: unsupportedClaimsCount,
    source_conflicts_detected: conflictNotes.length > 0,
    conflict_notes: conflictNotes,
    issues
  };
}

module.exports = {
  verifyAttributionIntegrity,
  MADHHAB_OVERCLAIM_PATTERN
};
