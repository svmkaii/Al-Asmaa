'use strict';

const fs = require('fs');
const path = require('path');

class AuditTrail {
  constructor(options = {}) {
    this.filePath =
      options.filePath ||
      path.join(process.cwd(), 'data', 'encyclopedia', 'audit', 'audit-trail.jsonl');
    this.now = options.now || (() => new Date().toISOString());
  }

  ensureDirectory() {
    const dir = path.dirname(this.filePath);
    fs.mkdirSync(dir, { recursive: true });
  }

  log(event) {
    this.ensureDirectory();
    const record = {
      checked_at: this.now(),
      ...event
    };
    fs.appendFileSync(this.filePath, `${JSON.stringify(record)}\n`, 'utf8');
    return record;
  }

  logMany(events) {
    return events.map((event) => this.log(event));
  }
}

module.exports = {
  AuditTrail
};
