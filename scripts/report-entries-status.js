'use strict';

const fs = require('fs');
const path = require('path');

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const entriesDir = path.join(projectRoot, 'data', 'encyclopedia', 'entries');
  const outputPath = path.join(projectRoot, 'data', 'encyclopedia', 'audit', 'entries-status.json');

  if (!fs.existsSync(entriesDir)) {
    process.stdout.write('Entries directory not found.\n');
    return;
  }

  const files = fs.readdirSync(entriesDir).filter((f) => f.endsWith('.json'));
  const statuses = [];

  let totalLinks = 0;
  let passed = 0;
  let failed = 0;
  let manual = 0;
  let needsHumanReview = 0;

  for (const file of files) {
    const entry = JSON.parse(fs.readFileSync(path.join(entriesDir, file), 'utf8'));
    const links = Array.isArray(entry.link_verification) ? entry.link_verification : [];
    totalLinks += links.length;

    for (const link of links) {
      if (link.status === 'passed') passed += 1;
      else if (link.status === 'failed') failed += 1;
      else if (link.status === 'manual_check_required') manual += 1;
    }

    if (entry.editorial_review?.status === 'needs_human_review') {
      needsHumanReview += 1;
    }

    statuses.push({
      slug: entry.slug,
      links: links.length,
      blockers: entry.publication_blockers || [],
      editorial_status: entry.editorial_review?.status || 'unknown'
    });
  }

  const summary = {
    generated_at: new Date().toISOString(),
    entries: files.length,
    link_stats: {
      total: totalLinks,
      passed,
      failed,
      manual_check_required: manual
    },
    editorial_stats: {
      needs_human_review: needsHumanReview
    },
    by_entry: statuses
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  process.stdout.write(`${outputPath}\n`);
}

main();
