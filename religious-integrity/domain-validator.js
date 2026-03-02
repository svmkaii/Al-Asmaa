'use strict';

const { APPROVED_DOMAINS } = require('./config');

function extractHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch (_) {
    return '';
  }
}

function normalizeHost(hostname) {
  return String(hostname || '')
    .toLowerCase()
    .replace(/^www\./, '')
    .trim();
}

function isHostInAllowlist(hostname, allowlist = APPROVED_DOMAINS) {
  const normalizedHost = normalizeHost(hostname);
  if (!normalizedHost) {
    return false;
  }
  return allowlist.some((domain) => {
    const normalizedDomain = normalizeHost(domain);
    return (
      normalizedHost === normalizedDomain ||
      normalizedHost.endsWith(`.${normalizedDomain}`)
    );
  });
}

function validateDomain(url, allowlist = APPROVED_DOMAINS) {
  const hostname = extractHostname(url);
  if (!hostname) {
    return {
      valid: false,
      reason: 'invalid_url',
      hostname: ''
    };
  }

  if (!isHostInAllowlist(hostname, allowlist)) {
    return {
      valid: false,
      reason: 'domain_not_allowlisted',
      hostname
    };
  }

  return {
    valid: true,
    reason: null,
    hostname
  };
}

module.exports = {
  extractHostname,
  normalizeHost,
  isHostInAllowlist,
  validateDomain
};
