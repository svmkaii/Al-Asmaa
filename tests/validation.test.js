'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const {
  sanitizeHtml,
  normalizeForValidation,
  normalizeArabicForValidation,
  normalizeCollapsed,
  serverValidateAnswer
} = require('../lib/validation');

// Load the actual 99 names data
let ASMA_UL_HUSNA = [];
const namesCode = fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'names.js'), 'utf-8');
const fn = new Function(namesCode + '; return ASMA_UL_HUSNA;');
ASMA_UL_HUSNA = fn();

// ==========================================================================
// sanitizeHtml
// ==========================================================================

test('sanitizeHtml — escapes HTML entities', () => {
  assert.equal(sanitizeHtml('<script>alert("xss")</script>'),
    '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
});

test('sanitizeHtml — escapes single quotes', () => {
  assert.equal(sanitizeHtml("it's"), "it&#39;s");
});

test('sanitizeHtml — returns empty string for non-string input', () => {
  assert.equal(sanitizeHtml(null), '');
  assert.equal(sanitizeHtml(undefined), '');
  assert.equal(sanitizeHtml(123), '');
});

test('sanitizeHtml — preserves normal text', () => {
  assert.equal(sanitizeHtml('hello world'), 'hello world');
});

// ==========================================================================
// normalizeForValidation
// ==========================================================================

test('normalizeForValidation — strips Arabic article prefix', () => {
  const result = normalizeForValidation('Ar-Rahman');
  assert.ok(!result.startsWith('ar'), `Expected no "ar" prefix, got: ${result}`);
});

test('normalizeForValidation — lowercases and removes diacritics', () => {
  assert.equal(normalizeForValidation('Résumé'), normalizeForValidation('resume'));
});

test('normalizeForValidation — removes hyphens and spaces', () => {
  const a = normalizeForValidation('Al-Malik');
  const b = normalizeForValidation('almalik');
  assert.equal(a, b);
});

// ==========================================================================
// normalizeArabicForValidation
// ==========================================================================

test('normalizeArabicForValidation — removes tashkeel', () => {
  // الرَّحْمَنُ → الرحمن
  const withTashkeel = '\u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u064F';
  const without = '\u0627\u0644\u0631\u062D\u0645\u0646';
  assert.equal(normalizeArabicForValidation(withTashkeel), normalizeArabicForValidation(without));
});

test('normalizeArabicForValidation — removes whitespace', () => {
  assert.equal(normalizeArabicForValidation('ال رحمن'), 'الرحمن');
});

// ==========================================================================
// normalizeCollapsed
// ==========================================================================

test('normalizeCollapsed — collapses double letters', () => {
  assert.equal(normalizeCollapsed('arrahman'), normalizeCollapsed('arahman'));
});

test('normalizeCollapsed — normalizes spacing and case', () => {
  assert.equal(normalizeCollapsed('AL MALIK'), normalizeCollapsed('almalik'));
});

// ==========================================================================
// serverValidateAnswer — exact match
// ==========================================================================

test('serverValidateAnswer — accepts exact transliteration', () => {
  const result = serverValidateAnswer('Ar-Rahman', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, true);
  assert.equal(result.nameId, 1);
  assert.equal(result.message, 'correct');
  assert.equal(result.canonicalName, 'Ar-Rahman');
});

test('serverValidateAnswer — accepts case-insensitive transliteration', () => {
  const result = serverValidateAnswer('ar-rahman', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, true);
  assert.equal(result.nameId, 1);
});

test('serverValidateAnswer — accepts Arabic input', () => {
  const result = serverValidateAnswer('\u0627\u0644\u0631\u062D\u0645\u0646', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, true);
  assert.equal(result.nameId, 1);
});

test('serverValidateAnswer — accepts variant spelling', () => {
  const result = serverValidateAnswer('rahman', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, true);
  assert.equal(result.nameId, 1);
});

test('serverValidateAnswer — rejects already-used name', () => {
  const result = serverValidateAnswer('Ar-Rahman', [1], ASMA_UL_HUSNA);
  assert.equal(result.valid, false);
  assert.equal(result.nameId, 1);
  assert.equal(result.message, 'already-used');
});

test('serverValidateAnswer — rejects empty input', () => {
  assert.equal(serverValidateAnswer('', [], ASMA_UL_HUSNA).message, 'empty');
  assert.equal(serverValidateAnswer('   ', [], ASMA_UL_HUSNA).message, 'empty');
  assert.equal(serverValidateAnswer(null, [], ASMA_UL_HUSNA).message, 'empty');
});

test('serverValidateAnswer — rejects unknown name', () => {
  const result = serverValidateAnswer('NotAName', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, false);
  assert.equal(result.message, 'unknown');
});

// ==========================================================================
// serverValidateAnswer — collapsed match (Phase 2)
// ==========================================================================

test('serverValidateAnswer — tolerates double letters via collapsed match', () => {
  const result = serverValidateAnswer('arrrahmaan', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, true);
  assert.equal(result.nameId, 1);
});

// ==========================================================================
// serverValidateAnswer — multiple names
// ==========================================================================

test('serverValidateAnswer — validates Al-Malik (name 3)', () => {
  const result = serverValidateAnswer('Al-Malik', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, true);
  assert.equal(result.nameId, 3);
});

test('serverValidateAnswer — validates As-Salam (name 5)', () => {
  const result = serverValidateAnswer('As-Salam', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, true);
  assert.equal(result.nameId, 5);
});

test('serverValidateAnswer — validates Al-Quddus (name 4)', () => {
  const result = serverValidateAnswer('quddus', [], ASMA_UL_HUSNA);
  assert.equal(result.valid, true);
  assert.equal(result.nameId, 4);
});

// ==========================================================================
// Data integrity
// ==========================================================================

test('names data — loads 99 names', () => {
  assert.equal(ASMA_UL_HUSNA.length, 99);
});

test('names data — each name has required fields', () => {
  for (const name of ASMA_UL_HUSNA) {
    assert.ok(name.id, `Missing id for ${name.transliteration}`);
    assert.ok(name.arabic, `Missing arabic for ${name.transliteration}`);
    assert.ok(name.transliteration, `Missing transliteration for id ${name.id}`);
    assert.ok(name.french, `Missing french for ${name.transliteration}`);
  }
});

test('names data — IDs are unique and sequential 1-99', () => {
  const ids = ASMA_UL_HUSNA.map(n => n.id).sort((a, b) => a - b);
  for (let i = 0; i < 99; i++) {
    assert.equal(ids[i], i + 1, `Expected id ${i + 1}, got ${ids[i]}`);
  }
});
