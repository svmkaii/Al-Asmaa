'use strict';

const fs = require('fs');
const path = require('path');
const { LinkVerifier } = require('../religious-integrity/link-verifier');

const ENTRIES_DIR = path.join(__dirname, '..', 'data', 'encyclopedia', 'entries');

function extractUrls(entry) {
  const urls = [];
  // Quran URLs
  for (const q of entry.primary_evidence?.quran || []) {
    if (q.source_url) urls.push({ url: q.source_url, precise_locator: q.reference_label, id: q.reference_label });
  }
  // Hadith URLs
  for (const h of entry.primary_evidence?.hadith || []) {
    if (h.source_url) urls.push({ url: h.source_url, precise_locator: h.reference_label, id: h.reference_label });
  }
  // Scholarly explanation URLs
  for (const s of entry.scholarly_explanations || []) {
    if (s.source_url) urls.push({ url: s.source_url, precise_locator: s.precise_locator || s.source_title, id: s.source_title });
  }
  return urls;
}

async function main() {
  const verifier = new LinkVerifier({ strict: false });
  const files = fs.readdirSync(ENTRIES_DIR).filter(f => f.endsWith('.json'));

  let totalLinks = 0;
  let passed = 0;
  let failed = 0;
  let manual = 0;
  const failures = [];

  for (const file of files) {
    const slug = file.replace('.json', '');
    const entry = JSON.parse(fs.readFileSync(path.join(ENTRIES_DIR, file), 'utf8'));
    const sources = extractUrls(entry);

    const results = await verifier.verifyMany(sources);
    const linkVerification = [];

    for (const { source, verification } of results) {
      totalLinks++;
      linkVerification.push(verification);

      if (verification.status === 'passed') {
        passed++;
      } else if (verification.status === 'failed') {
        failed++;
        failures.push({ slug, url: source.url, reason: verification.reason, http: verification.http_status });
      } else {
        manual++;
      }
    }

    // Update entry with link verification results
    entry.link_verification = linkVerification;
    fs.writeFileSync(path.join(ENTRIES_DIR, file), JSON.stringify(entry, null, 2) + '\n', 'utf8');

    const statusCounts = { p: 0, f: 0, m: 0 };
    for (const lv of linkVerification) {
      if (lv.status === 'passed') statusCounts.p++;
      else if (lv.status === 'failed') statusCounts.f++;
      else statusCounts.m++;
    }
    process.stdout.write(`[${statusCounts.f > 0 ? 'WARN' : 'OK'}] ${slug}: ${linkVerification.length} liens (${statusCounts.p} ok, ${statusCounts.f} fail, ${statusCounts.m} manual)\n`);
  }

  console.log(`\n=== VERIFICATION DES LIENS ===`);
  console.log(`Total: ${totalLinks}`);
  console.log(`Passes: ${passed}`);
  console.log(`Echoues: ${failed}`);
  console.log(`Verification manuelle: ${manual}`);

  if (failures.length > 0) {
    console.log(`\n=== LIENS EN ECHEC ===`);
    for (const f of failures) {
      console.log(`  ${f.slug}: ${f.url} (${f.reason}, HTTP ${f.http || 'N/A'})`);
    }
  }
}

main().catch(err => {
  console.error('Erreur:', err.message);
  process.exitCode = 1;
});
