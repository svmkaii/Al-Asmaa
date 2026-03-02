'use strict';

const config = require('./config');
const domainValidator = require('./domain-validator');
const scholarValidator = require('./scholar-validator');
const sourceCollector = require('./source-collector');
const linkVerifier = require('./link-verifier');
const attributionVerifier = require('./attribution-verifier');
const publicationGuard = require('./publication-guard');
const { NameEntryGenerator, createInsufficientEvidenceFallback } = require('./entry-generator');
const { AuditTrail } = require('./audit-trail');
const { EntryRepository } = require('./entry-repository');
const { applyHumanReview, REVIEW_STATUS } = require('./review-service');

module.exports = {
  ...config,
  ...domainValidator,
  ...scholarValidator,
  ...sourceCollector,
  ...linkVerifier,
  ...attributionVerifier,
  ...publicationGuard,
  NameEntryGenerator,
  createInsufficientEvidenceFallback,
  AuditTrail,
  EntryRepository,
  applyHumanReview,
  REVIEW_STATUS
};
