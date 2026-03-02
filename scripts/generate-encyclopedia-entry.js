'use strict';

const path = require('path');
const {
  NameEntryGenerator,
  AuditTrail,
  EntryRepository
} = require('../religious-integrity');

function readSlugArg(argv) {
  const explicit = argv.find((arg) => arg.startsWith('--slug='));
  if (explicit) {
    return explicit.split('=').slice(1).join('=').trim();
  }
  const index = argv.indexOf('--slug');
  if (index !== -1 && argv[index + 1]) {
    return String(argv[index + 1]).trim();
  }
  const positional = argv.find((arg) => !arg.startsWith('--'));
  if (positional) {
    return String(positional).trim();
  }
  if (process.env.npm_config_slug && process.env.npm_config_slug !== 'true') {
    return String(process.env.npm_config_slug).trim();
  }
  return '';
}

async function main() {
  const slug = readSlugArg(process.argv.slice(2));
  if (!slug) {
    throw new Error('MISSING_SLUG_ARGUMENT');
  }

  const repository = new EntryRepository({
    baseDir: path.join(__dirname, '..', 'data', 'encyclopedia', 'entries'),
    candidatesDir: path.join(__dirname, '..', 'data', 'encyclopedia', 'candidates')
  });
  const candidate = repository.loadCandidate(slug);
  if (!candidate) {
    throw new Error(`CANDIDATE_NOT_FOUND:${slug}`);
  }

  const auditTrail = new AuditTrail({
    filePath: path.join(__dirname, '..', 'data', 'encyclopedia', 'audit', 'audit-trail.jsonl')
  });
  const generator = new NameEntryGenerator({ auditTrail });
  const entry = await generator.generateFromCandidate(candidate);
  const outputPath = repository.saveEntry(entry);

  const summary = {
    slug: entry.slug,
    editorial_status: entry.editorial_review.status,
    public_display_allowed: entry.public_display_allowed,
    blockers: entry.publication_blockers || [],
    output_path: outputPath
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
