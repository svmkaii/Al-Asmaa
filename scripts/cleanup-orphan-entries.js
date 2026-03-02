'use strict';

const fs = require('fs');
const path = require('path');

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const candidatesDir = path.join(projectRoot, 'data', 'encyclopedia', 'candidates');
  const entriesDir = path.join(projectRoot, 'data', 'encyclopedia', 'entries');

  if (!fs.existsSync(candidatesDir) || !fs.existsSync(entriesDir)) {
    process.stdout.write('Candidates or entries directory missing.\n');
    return;
  }

  const candidateSlugs = new Set(
    fs.readdirSync(candidatesDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/i, ''))
  );

  let removed = 0;
  for (const file of fs.readdirSync(entriesDir)) {
    if (!file.endsWith('.json')) continue;
    const slug = file.replace(/\.json$/i, '');
    if (!candidateSlugs.has(slug)) {
      fs.unlinkSync(path.join(entriesDir, file));
      removed += 1;
    }
  }

  process.stdout.write(`Removed ${removed} orphan entry files.\n`);
}

main();
