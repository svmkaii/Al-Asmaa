'use strict';

const fs = require('fs');
const path = require('path');

class EntryRepository {
  constructor(options = {}) {
    this.baseDir =
      options.baseDir || path.join(process.cwd(), 'data', 'encyclopedia', 'entries');
    this.candidatesDir =
      options.candidatesDir || path.join(process.cwd(), 'data', 'encyclopedia', 'candidates');
  }

  ensureDirectories() {
    fs.mkdirSync(this.baseDir, { recursive: true });
    fs.mkdirSync(this.candidatesDir, { recursive: true });
  }

  entryPath(slug) {
    return path.join(this.baseDir, `${slug}.json`);
  }

  candidatePath(slug) {
    return path.join(this.candidatesDir, `${slug}.json`);
  }

  loadEntry(slug) {
    const filePath = this.entryPath(slug);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  saveEntry(entry) {
    this.ensureDirectories();
    const filePath = this.entryPath(entry.slug);
    fs.writeFileSync(filePath, `${JSON.stringify(entry, null, 2)}\n`, 'utf8');
    return filePath;
  }

  loadCandidate(slug) {
    const filePath = this.candidatePath(slug);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  listCandidates() {
    if (!fs.existsSync(this.candidatesDir)) {
      return [];
    }
    return fs
      .readdirSync(this.candidatesDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace(/\.json$/i, ''));
  }
}

module.exports = {
  EntryRepository
};
