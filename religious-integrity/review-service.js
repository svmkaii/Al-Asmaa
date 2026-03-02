'use strict';

const { applyPublicationDecision } = require('./publication-guard');

const REVIEW_STATUS = new Set(['needs_human_review', 'approved', 'rejected']);

function applyHumanReview(entry, review, options = {}) {
  if (!review || !REVIEW_STATUS.has(review.status)) {
    throw new Error('INVALID_REVIEW_STATUS');
  }

  if (review.status === 'approved' && !review.reviewer_id) {
    throw new Error('REVIEWER_ID_REQUIRED_FOR_APPROVAL');
  }

  const updated = {
    ...entry,
    editorial_review: {
      status: review.status,
      reviewer_id: review.reviewer_id || null,
      notes: review.notes || ''
    }
  };

  return applyPublicationDecision(updated, options);
}

module.exports = {
  REVIEW_STATUS,
  applyHumanReview
};
