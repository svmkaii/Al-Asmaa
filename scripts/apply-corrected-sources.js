'use strict';

const fs = require('fs');
const path = require('path');
const {
  DATA, COMMON_HADITH, TAFSIR,
  DORAR_URLS, ISLAMWEB_IDS, ISLAMQA_IDS,
  ISLAMQA_GENERAL, DORAR_GENERAL
} = require('./corrected-sources-data');

const ENTRIES_DIR = path.join(__dirname, '..', 'data', 'encyclopedia', 'entries');

// Build altafsir.com URL for a specific tafsir + verse
function altafsirUrl(tafsirKey, surah, ayah) {
  const t = TAFSIR[tafsirKey];
  return `https://www.altafsir.com/Tafasir.asp?tMadhNo=${t.tMadhNo}&tTafsirNo=${t.tTafsirNo}&tSoraNo=${surah}&tAyahNo=${ayah}&tDisplay=yes&UserProfile=0&LanguageId=1`;
}

// Build quran.com URL
function quranUrl(surah, ayah) {
  return `https://quran.com/${surah}:${ayah}`;
}

// Build sunnah.com URL
function sunnahUrl(collection, number) {
  const collMap = {
    'Sahih Bukhari': 'bukhari',
    'Sahih Muslim': 'muslim',
    'Tirmidhi': 'tirmidhi',
    'Abu Dawud': 'abudawud',
    'Nasai': 'nasai',
    'Ibn Majah': 'ibnmajah'
  };
  const slug = collMap[collection] || collection.toLowerCase().replace(/\s+/g, '');
  return `https://sunnah.com/${slug}:${number}`;
}

function applyCorrections(slug, existingEntry, correction) {
  const now = new Date().toISOString();
  const entry = JSON.parse(JSON.stringify(existingEntry));

  // 1. Update canonical_status with evidence_type
  entry.canonical_status = {
    in_99_list: true,
    evidence_type: correction.evidence_type,
    note: correction.evidence_type === 'quran_direct'
      ? "Nom atteste directement dans le Coran comme attribut divin."
      : correction.evidence_type === 'quran_derived'
        ? "Concept/racine atteste dans le Coran; Nom sous cette forme derive des hadiths."
        : "Nom atteste principalement dans la tradition du hadith (Tirmidhi 3507, etc.)."
  };

  // 2. Correct Quran references
  entry.primary_evidence = {
    quran: correction.quran.map(q => ({
      surah: q.surah,
      ayah: q.ayah,
      name_in_verse: q.name_in_verse,
      reference_label: `Quran ${q.surah}:${q.ayah}`,
      source_url: quranUrl(q.surah, q.ayah),
      relevance_note: q.note_fr
    })),
    hadith: []
  };

  // Add specific hadiths from correction
  if (correction.hadith && correction.hadith.length > 0) {
    for (const h of correction.hadith) {
      entry.primary_evidence.hadith.push({
        collection: h.collection,
        number: h.number,
        grading: h.grading,
        reference_label: `${h.collection} ${h.number}`,
        source_url: sunnahUrl(h.collection, h.number),
        relevance_note: h.note_fr
      });
    }
  }

  // Add common hadiths (Bukhari 2736 + Tirmidhi 3507) if not already present
  const hasHadith = (coll, num) =>
    entry.primary_evidence.hadith.some(h => h.collection === coll && h.number === String(num));

  if (!hasHadith('Sahih Bukhari', '2736')) {
    entry.primary_evidence.hadith.push({
      collection: COMMON_HADITH.bukhari_99_concept.collection,
      number: COMMON_HADITH.bukhari_99_concept.number,
      grading: COMMON_HADITH.bukhari_99_concept.grading,
      reference_label: `Sahih Bukhari 2736`,
      source_url: sunnahUrl('Sahih Bukhari', '2736'),
      relevance_note: COMMON_HADITH.bukhari_99_concept.note_fr
    });
  }

  if (!hasHadith('Tirmidhi', '3507')) {
    entry.primary_evidence.hadith.push({
      collection: COMMON_HADITH.tirmidhi_99_names.collection,
      number: COMMON_HADITH.tirmidhi_99_names.number,
      grading: COMMON_HADITH.tirmidhi_99_names.grading,
      reference_label: `Tirmidhi 3507`,
      source_url: sunnahUrl('Tirmidhi', '3507'),
      relevance_note: COMMON_HADITH.tirmidhi_99_names.note_fr
    });
  }

  // 3. Build scholarly explanations with DIRECT per-Name links
  entry.scholarly_explanations = [];

  // 3a. dorar.net - Encyclopedie savante (page individuelle par Nom)
  const dorarUrl = DORAR_URLS[slug];
  if (dorarUrl) {
    entry.scholarly_explanations.push({
      category: 'encyclopedia',
      scholar_name: 'Al-Durar al-Saniyyah (multi-madhab)',
      madhab: 'multi',
      source_title: 'Al-Mawsu\'ah al-\'Aqadiyyah - Dorar.net',
      source_url: dorarUrl,
      precise_locator: `Page dediee au Nom ${entry.transliteration} dans l'encyclopedie Aqeeda`,
      summary_fr: correction.scholarly_note_fr
    });
  } else {
    // Fallback: general section on Names
    entry.scholarly_explanations.push({
      category: 'encyclopedia',
      scholar_name: 'Al-Durar al-Saniyyah (multi-madhab)',
      madhab: 'multi',
      source_title: 'Al-Mawsu\'ah al-\'Aqadiyyah - Dorar.net',
      source_url: DORAR_GENERAL,
      precise_locator: `Section generale Asma Allah al-Husna (pas de page individuelle pour ${entry.transliteration})`,
      summary_fr: correction.scholarly_note_fr
    });
  }

  // 3b. islamweb.net - Article savant individuel (si disponible)
  const islamwebId = ISLAMWEB_IDS[slug];
  if (islamwebId) {
    entry.scholarly_explanations.push({
      category: 'encyclopedia',
      scholar_name: 'IslamWeb.net',
      madhab: 'multi',
      source_title: `Min Asma\' Allah al-Husna: ${entry.transliteration}`,
      source_url: `https://www.islamweb.net/ar/article/${islamwebId}`,
      precise_locator: `Article dedie au Nom ${entry.transliteration}`,
      summary_fr: `Article savant detaille sur le Nom ${entry.transliteration} avec analyse linguistique, preuves coraniques et implications pour la foi.`
    });
  }

  // 3c. islamqa.info - Explication hanbali (si disponible)
  const islamqaId = ISLAMQA_IDS[slug];
  if (islamqaId) {
    entry.scholarly_explanations.push({
      category: 'fatwa',
      scholar_name: 'IslamQA.info (Ibn Uthaymeen / Comite Permanent)',
      madhab: 'hanbali',
      source_title: `Explication du Nom ${entry.transliteration}`,
      source_url: `https://islamqa.info/ar/answers/${islamqaId}`,
      precise_locator: `Reponse savante sur le Nom ${entry.transliteration}`,
      summary_fr: `Explication du Nom ${entry.transliteration} selon la methodologie des Ahl al-Sunnah (perspective hanbali).`
    });
  }

  // 3d. Tafsir references per madhab (only if there's a Quran verse to reference)
  if (correction.tafsir_verse) {
    const tv = correction.tafsir_verse;
    for (const [key, tafsir] of Object.entries(TAFSIR)) {
      entry.scholarly_explanations.push({
        category: 'tafsir',
        scholar_name: tafsir.scholar,
        madhab: tafsir.madhab,
        source_title: tafsir.title,
        source_url: altafsirUrl(key, tv.surah, tv.ayah),
        precise_locator: `Tafsir de Sourate ${tv.surah}, Ayah ${tv.ayah} - ${tafsir.title}`,
        summary_fr: `Tafsir de ${tv.surah}:${tv.ayah} ou le Nom ${entry.transliteration} est mentionne ou son sens est explique.`
      });
    }
  }

  // 4. Update interpretation notes
  entry.interpretation_notes = {
    consensus_core: entry.short_meaning || correction.scholarly_note_fr.split('.')[0] + '.',
    evidence_type_note: correction.evidence_type === 'quran_direct'
      ? "Ce Nom apparait directement dans le Coran comme attribut divin."
      : correction.evidence_type === 'quran_derived'
        ? "La racine/concept de ce Nom est dans le Coran mais le Nom sous cette forme precise est derive des hadiths."
        : "Ce Nom est atteste dans la tradition du hadith. Il n'apparait pas dans le Coran sous cette forme.",
    scholarly_summary: correction.scholarly_note_fr,
    nuances: buildNuances(slug, entry, correction),
    prohibited_overclaims: [
      "Ne pas generaliser 'les malikites/hanafites/shafiites/hanbalites disent' sans texte explicite.",
      "Ne pas affirmer une divergence de madhhab sans preuve primaire/secondaire verifiable."
    ]
  };

  // 5. Reset link verification (needs re-running)
  entry.link_verification = [];

  // 6. Update metadata
  entry.editorial_review = {
    status: 'needs_human_review',
    notes: 'Sources corrigees avec liens directs par Nom - validation humaine religieuse obligatoire'
  };
  entry.public_display_allowed = false;
  entry.publication_blockers = ['human_review_not_approved'];
  entry.sources_corrected_at = now;

  return entry;
}

function buildNuances(slug, entry, correction) {
  const nuances = [];

  // dorar.net nuance
  if (DORAR_URLS[slug]) {
    nuances.push({
      label: "Encyclopedie Aqeeda (multi-madhab)",
      description: `Page dediee dans l'encyclopedie Dorar.net avec preuves du Coran et de la Sunnah.`,
      source_backed: true,
      source_type: 'encyclopedia',
      sources: [`dorar-${slug}`]
    });
  }

  // islamqa.info nuance (hanbali)
  if (ISLAMQA_IDS[slug]) {
    nuances.push({
      label: "Explication hanbali (IslamQA)",
      description: `Explication detaillee selon la methodologie d'Ibn Uthaymeen et du Comite Permanent.`,
      source_backed: true,
      source_type: 'fatwa',
      sources: [`islamqa-${slug}`]
    });
  }

  // Tafsir nuances per madhab
  if (correction.tafsir_verse) {
    const tv = correction.tafsir_verse;
    nuances.push({
      label: "Tafsir hanafi (Al-Nasafi)",
      description: `Explication de ${tv.surah}:${tv.ayah} dans Madarik al-Tanzil.`,
      source_backed: true,
      source_type: 'tafsir',
      sources: [`tafsir-nasafi-${tv.surah}-${tv.ayah}`]
    });
    nuances.push({
      label: "Tafsir maliki (Al-Qurtubi)",
      description: `Explication de ${tv.surah}:${tv.ayah} dans Al-Jami li-Ahkam al-Quran.`,
      source_backed: true,
      source_type: 'tafsir',
      sources: [`tafsir-qurtubi-${tv.surah}-${tv.ayah}`]
    });
    nuances.push({
      label: "Tafsir shafi'i (Al-Baghawi)",
      description: `Explication de ${tv.surah}:${tv.ayah} dans Ma'alim al-Tanzil.`,
      source_backed: true,
      source_type: 'tafsir',
      sources: [`tafsir-baghawi-${tv.surah}-${tv.ayah}`]
    });
    nuances.push({
      label: "Tafsir hanbali (Ibn al-Jawzi)",
      description: `Explication de ${tv.surah}:${tv.ayah} dans Zad al-Masir.`,
      source_backed: true,
      source_type: 'tafsir',
      sources: [`tafsir-jawzi-${tv.surah}-${tv.ayah}`]
    });
  }

  return nuances;
}

// Main execution
function main() {
  const entryFiles = fs.readdirSync(ENTRIES_DIR).filter(f => f.endsWith('.json'));
  let updated = 0;
  let skipped = 0;
  let errors = [];

  for (const file of entryFiles) {
    const slug = file.replace('.json', '');
    const correction = DATA[slug];

    if (!correction) {
      console.log(`[SKIP] ${slug}: pas de donnees corrigees`);
      skipped++;
      continue;
    }

    try {
      const filePath = path.join(ENTRIES_DIR, file);
      const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const corrected = applyCorrections(slug, existing, correction);
      fs.writeFileSync(filePath, JSON.stringify(corrected, null, 2) + '\n', 'utf8');

      // Count sources
      const srcCount = corrected.scholarly_explanations.length;
      const dorarOk = DORAR_URLS[slug] ? 'dorar' : '';
      const iwOk = ISLAMWEB_IDS[slug] ? 'islamweb' : '';
      const iqOk = ISLAMQA_IDS[slug] ? 'islamqa' : '';
      const tafsirOk = correction.tafsir_verse ? '4-tafsir' : '';
      const sources = [dorarOk, iwOk, iqOk, tafsirOk].filter(Boolean).join('+');

      console.log(`[OK] ${slug}: ${srcCount} sources savantes (${sources})`);
      updated++;
    } catch (err) {
      console.error(`[ERR] ${slug}: ${err.message}`);
      errors.push(slug);
    }
  }

  console.log(`\n=== RESULTAT ===`);
  console.log(`Mis a jour: ${updated}`);
  console.log(`Ignores: ${skipped}`);
  console.log(`Erreurs: ${errors.length}`);
  if (errors.length > 0) {
    console.log(`Noms en erreur: ${errors.join(', ')}`);
  }
}

main();
