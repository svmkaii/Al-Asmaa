'use strict';

const path = require('path');
const {
  NameEntryGenerator,
  AuditTrail,
  EntryRepository
} = require('../religious-integrity');

async function main() {
  const repository = new EntryRepository({
    baseDir: path.join(__dirname, '..', 'data', 'encyclopedia', 'entries'),
    candidatesDir: path.join(__dirname, '..', 'data', 'encyclopedia', 'candidates')
  });
  const auditTrail = new AuditTrail({
    filePath: path.join(__dirname, '..', 'data', 'encyclopedia', 'audit', 'audit-trail.jsonl')
  });
  const generator = new NameEntryGenerator({ auditTrail });

  const slugs = repository.listCandidates();
  if (slugs.length === 0) {
    process.stdout.write('No candidate files found.\n');
    return;
  }

  const results = [];
  for (const slug of slugs) {
    const candidate = repository.loadCandidate(slug);
    if (!candidate) {
      results.push({ slug, status: 'failed', reason: 'candidate_not_found' });
      continue;
    }
    try {
      const entry = await generator.generateFromCandidate(candidate);
      repository.saveEntry(entry);
      results.push({
        slug,
        status: entry.public_display_allowed ? 'public' : 'blocked',
        blockers: entry.publication_blockers || []
      });
    } catch (error) {
      results.push({ slug, status: 'failed', reason: error.message });
    }
  }

  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
