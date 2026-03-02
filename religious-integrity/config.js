'use strict';

const STRICT_RELIGIOUS_MODE = true;

const SOURCE_ALLOWLIST = Object.freeze([
  'quran.com',
  'sunnah.com',
  'shamela.ws',
  'al-maktaba.org',
  'altafsir.com',
  'dorar.net',
  'islamhouse.com',
  'archive.org'
]);

const APPROVED_DOMAINS = SOURCE_ALLOWLIST;

const APPROVED_SCHOLARS = Object.freeze([
  {
    key: 'al-ghazali',
    canonical: 'Abu Hamid Al-Ghazali',
    aliases: ['al-ghazali', 'abu hamid al-ghazali', 'imam al-ghazali'],
    period: 'classical'
  },
  {
    key: 'al-qurtubi',
    canonical: 'Abu Abdillah Al-Qurtubi',
    aliases: ['al-qurtubi', 'abu abdillah al-qurtubi', 'imam al-qurtubi'],
    period: 'classical'
  },
  {
    key: 'ibn-al-qayyim',
    canonical: 'Ibn al-Qayyim',
    aliases: ['ibn al-qayyim', 'ibn qayyim', 'ibnul qayyim'],
    period: 'classical'
  },
  {
    key: 'ibn-taymiyyah',
    canonical: 'Ibn Taymiyyah',
    aliases: ['ibn taymiyyah', 'ibn taymiyya', 'ibn taymiyah'],
    period: 'classical'
  },
  {
    key: 'az-zajjaj',
    canonical: 'Abu Ishaq Az-Zajjaj',
    aliases: ['az-zajjaj', 'al-zajjaj', 'abu ishaq az-zajjaj'],
    period: 'classical'
  },
  {
    key: 'al-bayhaqi',
    canonical: 'Abu Bakr Al-Bayhaqi',
    aliases: ['al-bayhaqi', 'abu bakr al-bayhaqi'],
    period: 'classical'
  },
  {
    key: 'al-khattabi',
    canonical: 'Abu Sulayman Al-Khattabi',
    aliases: ['al-khattabi', 'abu sulayman al-khattabi'],
    period: 'classical'
  },
  {
    key: 'al-baghawi',
    canonical: 'Al-Baghawi',
    aliases: ['al-baghawi', 'baghawi', 'al-baghawy'],
    period: 'classical'
  },
  {
    key: 'al-nasafi',
    canonical: 'Abu al-Barakat Al-Nasafi',
    aliases: ['al-nasafi', 'abu al-barakat al-nasafi', 'nasafi'],
    period: 'classical'
  },
  {
    key: 'ibn-al-jawzi',
    canonical: 'Ibn al-Jawzi',
    aliases: ['ibn al-jawzi', 'ibn jawzi', 'ibn al-jawziy'],
    period: 'classical'
  }
]);

function normalizeScholarName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const APPROVED_SCHOLAR_LOOKUP = (() => {
  const lookup = new Map();
  for (const scholar of APPROVED_SCHOLARS) {
    lookup.set(normalizeScholarName(scholar.canonical), scholar);
    for (const alias of scholar.aliases) {
      lookup.set(normalizeScholarName(alias), scholar);
    }
  }
  return lookup;
})();

function getApprovedScholar(name) {
  if (!name) {
    return null;
  }
  return APPROVED_SCHOLAR_LOOKUP.get(normalizeScholarName(name)) || null;
}

function isScholarApproved(name) {
  return Boolean(getApprovedScholar(name));
}

module.exports = {
  STRICT_RELIGIOUS_MODE,
  SOURCE_ALLOWLIST,
  APPROVED_DOMAINS,
  APPROVED_SCHOLARS,
  normalizeScholarName,
  getApprovedScholar,
  isScholarApproved
};
