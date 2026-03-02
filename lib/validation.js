'use strict';

/**
 * Al-Asmaa — Shared validation & sanitization helpers
 * Extracted from server.js for testability.
 */

function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeForValidation(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[-\s\u2019\u2018''`\u02BC]/g, '')
    .replace(/^(ash|adh|dhul|al|ar|as|at|az|ad|an)/, '')
    .trim();
}

function normalizeArabicForValidation(str) {
  return str
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function normalizeCollapsed(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[-\s\u2019\u2018''`\u02BC]/g, '')
    .replace(/(.)\1+/g, '$1')
    .trim();
}

/**
 * Validate a player answer against the 99 names list.
 * @param {string} input - The player's answer
 * @param {number[]} usedNames - Array of already-used name IDs
 * @param {Array} namesList - The ASMA_UL_HUSNA array
 * @returns {{ valid: boolean, nameId: number|null, canonicalName?: string, message: string }}
 */
function serverValidateAnswer(input, usedNames, namesList) {
  if (!input || input.trim().length === 0) {
    return { valid: false, nameId: null, message: 'empty' };
  }
  const normalizedInput = normalizeForValidation(input);
  const arabicInput = normalizeArabicForValidation(input);

  // Phase 1: exact match
  for (const name of namesList) {
    if (normalizeForValidation(name.transliteration) === normalizedInput ||
        normalizeArabicForValidation(name.arabic) === arabicInput) {
      if (usedNames.includes(name.id)) return { valid: false, nameId: name.id, message: 'already-used' };
      return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
    }
    if (name.variants) {
      for (const v of name.variants) {
        if (normalizeForValidation(v) === normalizedInput || normalizeArabicForValidation(v) === arabicInput) {
          if (usedNames.includes(name.id)) return { valid: false, nameId: name.id, message: 'already-used' };
          return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
        }
      }
    }
  }

  // Phase 2: collapsed match (tolerates double letters, spacing, dashes)
  const collapsedInput = normalizeCollapsed(input);
  for (const name of namesList) {
    if (normalizeCollapsed(name.transliteration) === collapsedInput) {
      if (usedNames.includes(name.id)) return { valid: false, nameId: name.id, message: 'already-used' };
      return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
    }
    if (name.variants) {
      for (const v of name.variants) {
        if (normalizeCollapsed(v) === collapsedInput) {
          if (usedNames.includes(name.id)) return { valid: false, nameId: name.id, message: 'already-used' };
          return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
        }
      }
    }
  }

  return { valid: false, nameId: null, message: 'unknown' };
}

module.exports = {
  sanitizeHtml,
  normalizeForValidation,
  normalizeArabicForValidation,
  normalizeCollapsed,
  serverValidateAnswer
};
