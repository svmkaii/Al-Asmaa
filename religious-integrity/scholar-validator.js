'use strict';

const { getApprovedScholar } = require('./config');

const SCHOLAR_REQUIRED_LEVELS = new Set([2, 4]);

function validateScholar(source) {
  const level = Number(source.level || 0);
  const scholarName = source.scholar_name || source.scholarName || null;

  if (!SCHOLAR_REQUIRED_LEVELS.has(level)) {
    return {
      valid: true,
      reason: null,
      scholar: null
    };
  }

  if (!scholarName) {
    return {
      valid: false,
      reason: 'missing_scholar_attribution',
      scholar: null
    };
  }

  const approvedScholar = getApprovedScholar(scholarName);
  if (!approvedScholar) {
    return {
      valid: false,
      reason: 'scholar_not_allowlisted',
      scholar: null
    };
  }

  return {
    valid: true,
    reason: null,
    scholar: approvedScholar
  };
}

module.exports = {
  SCHOLAR_REQUIRED_LEVELS,
  validateScholar
};
