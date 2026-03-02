'use strict';

const fs = require('fs');
const path = require('path');

const { validateDomain } = require('../religious-integrity/domain-validator');

const MADHHAB_TAFSIR_LINKS = [
  {
    school: 'hanafi',
    scholar_name: 'Abu al-Barakat Al-Nasafi',
    source_title: 'Madarik al-Tanzil wa Haqaiq al-Tawil',
    tMadhNo: 2,
    tTafsirNo: 17
  },
  {
    school: 'maliki',
    scholar_name: 'Abu Abdillah Al-Qurtubi',
    source_title: 'Al-Jami li-Ahkam al-Quran',
    tMadhNo: 1,
    tTafsirNo: 5
  },
  {
    school: 'shafii',
    scholar_name: 'Al-Baghawi',
    source_title: 'Maalim al-Tanzil',
    tMadhNo: 2,
    tTafsirNo: 13
  },
  {
    school: 'hanbali',
    scholar_name: 'Ibn al-Jawzi',
    source_title: 'Zad al-Masir fi Ilm al-Tafsir',
    tMadhNo: 2,
    tTafsirNo: 15
  }
];

function toSlug(transliteration) {
  return String(transliteration || '')
    .toLowerCase()
    .replace(/[''`\u2019\u2018]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function parseQuranVerseReference(raw) {
  if (!raw) return null;
  const match = String(raw).match(/(\d+)\s*:\s*(\d+)/);
  if (!match) return null;
  return {
    surah: Number(match[1]),
    ayah: Number(match[2])
  };
}

function parseSunnahNumber(url) {
  const match = String(url || '').match(/sunnah\.com\/([^:\/]+):([^/?#]+)/i);
  if (!match) return null;
  return {
    collection: match[1],
    number: match[2]
  };
}

function altafsirUrl(tMadhNo, tTafsirNo, surah, ayah) {
  return `https://www.altafsir.com/Tafasir.asp?tMadhNo=${tMadhNo}&tTafsirNo=${tTafsirNo}&tSoraNo=${surah}&tAyahNo=${ayah}&tDisplay=yes&UserProfile=0&LanguageId=1`;
}

function allowlistedOrNull(url) {
  const result = validateDomain(url);
  return result.valid ? url : null;
}

function loadLegacyData(projectRoot) {
  const namesCode = fs.readFileSync(path.join(projectRoot, 'public', 'data', 'names.js'), 'utf8');
  const encyclopediaCode = fs.readFileSync(
    path.join(projectRoot, 'public', 'data', 'encyclopedia.js'),
    'utf8'
  );

  const names = new Function(`${namesCode}; return ASMA_UL_HUSNA;`)();
  const encyclopedia = new Function(
    'ASMA_UL_HUSNA',
    `${encyclopediaCode}; return ENCYCLOPEDIA_DATA;`
  )(names);

  return { names, encyclopedia };
}

function makeCandidate(name, legacyEntry, slug) {
  const sources = [];
  const quranEvidence = [];
  const hadithEvidence = [];
  const scholarlyExplanations = [];
  const claims = [];
  const nuances = [];
  const addedSourceIds = new Set();
  function pushSource(source) {
    if (!source || !source.id || addedSourceIds.has(source.id)) {
      return;
    }
    addedSourceIds.add(source.id);
    sources.push(source);
  }

  const legacyQuranVerses = Array.isArray(legacyEntry?.quranVerses) ? legacyEntry.quranVerses : [];
  const fallbackQuran = parseQuranVerseReference(name.quranVerse);

  const normalizedQuranSet = new Set();
  for (const verse of legacyQuranVerses) {
    const surah = Number(verse.surahNumber || verse.surah || 0);
    const ayah = Number(verse.ayah || 0);
    if (!surah || !ayah) continue;
    const key = `${surah}:${ayah}`;
    if (normalizedQuranSet.has(key)) continue;
    normalizedQuranSet.add(key);
  }
  if (normalizedQuranSet.size === 0 && fallbackQuran) {
    normalizedQuranSet.add(`${fallbackQuran.surah}:${fallbackQuran.ayah}`);
  }

  for (const key of normalizedQuranSet) {
    const [surahStr, ayahStr] = key.split(':');
    const surah = Number(surahStr);
    const ayah = Number(ayahStr);
    const sourceId = `quran-${surah}-${ayah}`;
    const sourceUrl = allowlistedOrNull(`https://quran.com/${surah}:${ayah}`);
    if (!sourceUrl) continue;

    quranEvidence.push({
      source_id: sourceId,
      surah,
      ayah,
      reference_label: `Quran ${surah}:${ayah}`,
      source_url: sourceUrl
    });

    pushSource({
      id: sourceId,
      url: sourceUrl,
      level: 1,
      source_type: 'quran',
      precise_locator: `Surah ${surah}, Ayah ${ayah}`,
      claim_ids: [`claim-${sourceId}`]
    });

    claims.push({
      id: `claim-${sourceId}`,
      text: `Le nom est documente dans le Quran (${surah}:${ayah}).`,
      source_ids: [sourceId]
    });
  }

  const legacyHadith = Array.isArray(legacyEntry?.hadithReferences) ? legacyEntry.hadithReferences : [];
  for (const hadith of legacyHadith) {
    const parsed = parseSunnahNumber(hadith.link);
    if (!parsed) continue;
    const sourceUrl = allowlistedOrNull(hadith.link);
    if (!sourceUrl) continue;

    const sourceId = `hadith-${parsed.collection}-${parsed.number}`.toLowerCase();
    hadithEvidence.push({
      source_id: sourceId,
      collection: hadith.collection || parsed.collection,
      number: String(parsed.number),
      grading: hadith.grading || '',
      reference_label: `${hadith.collection || parsed.collection} ${parsed.number}`,
      source_url: sourceUrl
    });

    pushSource({
      id: sourceId,
      url: sourceUrl,
      level: 1,
      source_type: 'hadith',
      precise_locator: `${hadith.collection || parsed.collection} #${parsed.number}`,
      claim_ids: [`claim-${sourceId}`]
    });

    claims.push({
      id: `claim-${sourceId}`,
      text: `Un hadith de reference est associe a ce nom (${hadith.collection || parsed.collection} ${parsed.number}).`,
      source_ids: [sourceId]
    });
  }

  const firstQuran = quranEvidence[0];
  if (firstQuran) {
    for (const source of MADHHAB_TAFSIR_LINKS) {
      const tafsirSourceId = `tafsir-${source.school}-${firstQuran.surah}-${firstQuran.ayah}`;
      const url = allowlistedOrNull(
        altafsirUrl(source.tMadhNo, source.tTafsirNo, firstQuran.surah, firstQuran.ayah)
      );
      if (!url) continue;

      pushSource({
        id: tafsirSourceId,
        url,
        level: 2,
        source_type: 'tafsir',
        scholar_name: source.scholar_name,
        precise_locator: `TafsirNo ${source.tTafsirNo} / Surah ${firstQuran.surah} Ayah ${firstQuran.ayah}`,
        claim_ids: [`claim-${tafsirSourceId}`],
        explicit_madhhab_attribution: true
      });

      scholarlyExplanations.push({
        source_id: tafsirSourceId,
        category: 'tafsir',
        scholar_name: source.scholar_name,
        source_title: source.source_title,
        source_url: url,
        precise_locator: `Surah ${firstQuran.surah}, Ayah ${firstQuran.ayah}, tafsir ${source.source_title}`,
        summary_fr: `Voir l'explication de ${source.scholar_name} pour ${firstQuran.surah}:${firstQuran.ayah}.`
      });

      claims.push({
        id: `claim-${tafsirSourceId}`,
        text: `Nuance de tafsir (${source.school}) documentee par ${source.scholar_name} sur ${firstQuran.surah}:${firstQuran.ayah}.`,
        source_ids: [tafsirSourceId]
      });

      nuances.push({
        label: `nuance de tafsir ${source.school}`,
        description: `Attribution explicite au corpus ${source.source_title}.`,
        source_backed: true,
        sources: [tafsirSourceId]
      });
    }
  }

  return {
    slug,
    arabic: name.arabic,
    transliteration: name.transliteration,
    french_name: name.french,
    short_meaning: name.description || '',
    canonical_status: {
      in_99_list: true,
      note: 'Retenu dans la liste de reference du projet (a verifier par revue humaine).'
    },
    primary_evidence: {
      quran: quranEvidence,
      hadith: hadithEvidence
    },
    scholarly_explanations: scholarlyExplanations,
    interpretation_notes: {
      consensus_core: name.description || 'INSUFFICIENT_EVIDENCE',
      nuances,
      prohibited_overclaims: [
        "Ne pas generaliser 'les malikites/hanafites/shafiites/hanbalites disent' sans texte explicite.",
        'Ne pas affirmer une divergence de madhhab sans preuve primaire/secondaire verifiable.'
      ]
    },
    claims,
    sources
  };
}

function writeCandidates(projectRoot, candidates) {
  const targetDir = path.join(projectRoot, 'data', 'encyclopedia', 'candidates');
  fs.mkdirSync(targetDir, { recursive: true });
  for (const fileName of fs.readdirSync(targetDir)) {
    if (fileName.endsWith('.json')) {
      fs.unlinkSync(path.join(targetDir, fileName));
    }
  }

  for (const candidate of candidates) {
    const outputPath = path.join(targetDir, `${candidate.slug}.json`);
    fs.writeFileSync(outputPath, `${JSON.stringify(candidate, null, 2)}\n`, 'utf8');
  }
}

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const { names, encyclopedia } = loadLegacyData(projectRoot);
  const slugCounts = new Map();
  for (const name of names) {
    const baseSlug = toSlug(name.transliteration);
    slugCounts.set(baseSlug, (slugCounts.get(baseSlug) || 0) + 1);
  }

  const candidates = names.map((name) => {
    const baseSlug = toSlug(name.transliteration);
    const slug = slugCounts.get(baseSlug) > 1 ? `${baseSlug}-${name.id}` : baseSlug;
    return makeCandidate(name, encyclopedia[name.id], slug);
  });
  writeCandidates(projectRoot, candidates);
  process.stdout.write(`Generated ${candidates.length} candidate files.\n`);
}

main();
