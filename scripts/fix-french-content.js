/**
 * Script de correction du contenu français des entrées encyclopédiques
 * - Corrige les accents manquants
 * - Élimine les répétitions
 * - Reformule les phrases génériques
 * - Vérifie et complète les glossaires
 */

const fs = require('fs');
const path = require('path');

const ENTRIES_DIR = path.join(__dirname, '..', 'data', 'encyclopedia', 'entries');
const CANDIDATES_DIR = path.join(__dirname, '..', 'data', 'encyclopedia', 'candidates');

// ============================================================================
// CORRECTIONS D'ACCENTS FRANÇAIS
// ============================================================================
const ACCENT_FIXES = {
  // Mots courants sans accents
  'misericorde': 'miséricorde',
  'Misericorde': 'Miséricorde',
  'misericordieux': 'miséricordieux',
  'Misericordieux': 'Miséricordieux',
  'Tres ': 'Très ',
  'tres ': 'très ',
  'etait': 'était',
  'etaient': 'étaient',
  'ete': 'été',
  'etant': 'étant',
  'etre': 'être',
  'meme': 'même',
  'deja': 'déjà',
  'designe': 'désigne',
  'desirer': 'désirer',
  'desire': 'désiré',
  'decrete': 'décrète',
  'decreter': 'décréter',
  'decret': 'décret',
  'verite': 'vérité',
  'realite': 'réalité',
  'eternite': 'éternité',
  'eternel': 'éternel',
  'eternelle': 'éternelle',
  'revele': 'révélé',
  'revelation': 'révélation',
  'Revelation': 'Révélation',
  'generale': 'générale',
  'general': 'général',
  'generaliser': 'généraliser',
  'specifique': 'spécifique',
  'speciale': 'spéciale',
  'special': 'spécial',
  'reservee': 'réservée',
  'reserve': 'réservé',
  'createur': 'créateur',
  'Createur': 'Créateur',
  'creation': 'création',
  'creature': 'créature',
  'creatures': 'créatures',
  'cree': 'crée',
  'crea': 'créa',
  'eleve': 'élevé',
  'elevee': 'élevée',
  'elever': 'élever',
  'epreuve': 'épreuve',
  'epreuves': 'épreuves',
  'element': 'élément',
  'elements': 'éléments',
  'energie': 'énergie',
  'evangile': 'évangile',
  'evenement': 'événement',
  'evenements': 'événements',
  'evidence': 'évidence',
  'evidence_type': 'evidence_type', // Ne pas changer les clés JSON
  'explique': 'expliqué',
  'expliquee': 'expliquée',
  'detaille': 'détaillé',
  'detaillee': 'détaillée',
  'methodologie': 'méthodologie',
  'hebreux': 'hébreux',
  'hebreu': 'hébreu',
  'syriaque': 'syriaque',
  'semitique': 'sémitique',
  'semitiques': 'sémitiques',
  'pre-islamique': 'pré-islamique',
  'islamique': 'islamique',
  'encyclopedie': 'encyclopédie',
  'Encyclopedie': 'Encyclopédie',
  'categorise': 'catégorisé',
  'categorisee': 'catégorisée',
  'categorie': 'catégorie',
  'reference': 'référence',
  'references': 'références',
  'refere': 'réfère',
  'systeme': 'système',
  'systematique': 'systématique',
  'probleme': 'problème',
  'problemes': 'problèmes',
  'phenomene': 'phénomène',
  'phenomenes': 'phénomènes',
  'theologie': 'théologie',
  'theologique': 'théologique',
  'theologiques': 'théologiques',
  'metaphysique': 'métaphysique',
  'genealogie': 'généalogie',
  'genealogique': 'généalogique',
  'etymologie': 'étymologie',
  'etymologique': 'étymologique',
  'superieur': 'supérieur',
  'superieure': 'supérieure',
  'inferieur': 'inférieur',
  'inferieure': 'inférieure',
  'anterieur': 'antérieur',
  'anterieure': 'antérieure',
  'posterieur': 'postérieur',
  'posterieure': 'postérieure',
  'exterieur': 'extérieur',
  'exterieure': 'extérieure',
  'interieur': 'intérieur',
  'interieure': 'intérieure',
  'premiere': 'première',
  'premier': 'premier',
  'derniere': 'dernière',
  'dernier': 'dernier',
  'entiere': 'entière',
  'entier': 'entier',
  'particulier': 'particulier',
  'particuliere': 'particulière',
  'regulier': 'régulier',
  'reguliere': 'régulière',
  'singulier': 'singulier',
  'singuliere': 'singulière',
  'a travers': 'à travers',
  'au-dela': 'au-delà',
  'deja': 'déjà',
  'la ou': 'là où',
  'voila': 'voilà',
  'plutot': 'plutôt',
  'aussitot': 'aussitôt',
  'bientot': 'bientôt',
  'tot': 'tôt',
  'controle': 'contrôle',
  'controler': 'contrôler',
  'role': 'rôle',
  'roles': 'rôles',
  ' ou ': ' où ', // Attention: contexte important
  'interpreation': 'interprétation',
  'interpretation': 'interprétation',
  'interpretations': 'interprétations',
  'interpreter': 'interpréter',
  'interprete': 'interprète',
  'interpretes': 'interprètes',
  'exegese': 'exégèse',
  'exegetique': 'exégétique',
  'heretique': 'hérétique',
  'heresie': 'hérésie',
  'heterodoxe': 'hétérodoxe',
  'orthodoxe': 'orthodoxe',
  'lecon': 'leçon',
  'lecons': 'leçons',
  'facon': 'façon',
  'facons': 'façons',
  'recoit': 'reçoit',
  'recoivent': 'reçoivent',
  'recu': 'reçu',
  'recue': 'reçue',
  'decu': 'déçu',
  'decue': 'déçue',
  'apercu': 'aperçu',
  'apercue': 'aperçue',
  'concu': 'conçu',
  'concue': 'conçue',
  'ca': 'ça',
  'grace a': 'grâce à',
  'Grace a': 'Grâce à',
  'acheve': 'achevé',
  'achevee': 'achevée',
  'achever': 'achever',
  'eleve': 'élève',
  'eleves': 'élèves',
  'celebre': 'célèbre',
  'celebres': 'célèbres',
  'fidele': 'fidèle',
  'fideles': 'fidèles',
  'modele': 'modèle',
  'modeles': 'modèles',
  'parallele': 'parallèle',
  'paralleles': 'parallèles',
  'revele': 'révèle',
  'revelent': 'révèlent',
  'complete': 'complète',
  'completer': 'compléter',
  'completes': 'complètes',
  'concrete': 'concrète',
  'concretes': 'concrètes',
  'discrete': 'discrète',
  'discretes': 'discrètes',
  'secrete': 'secrète',
  'secretes': 'secrètes',
  'inquiete': 'inquiète',
  'inquietes': 'inquiètes',
  'propriete': 'propriété',
  'proprietes': 'propriétés',
  'societe': 'société',
  'societes': 'sociétés',
  'variete': 'variété',
  'varietes': 'variétés',
  'anxiete': 'anxiété',
  'piete': 'piété',
  'notoriete': 'notoriété',
  'sobriete': 'sobriété',
  'purete': 'pureté',
  'surete': 'sûreté',
  'securite': 'sécurité',
  'sincerite': 'sincérité',
  'severite': 'sévérité',
  'prosperite': 'prospérité',
  'posterite': 'postérité',
  'anteriorite': 'antériorité',
  'priorite': 'priorité',
  'superiorite': 'supériorité',
  'inferiorite': 'infériorité',
  'exteriorite': 'extériorité',
  'interiorite': 'intériorité',
  'totalite': 'totalité',
  'finalite': 'finalité',
  'banalite': 'banalité',
  'fatalite': 'fatalité',
  'legalite': 'légalité',
  'moralite': 'moralité',
  'normalite': 'normalité',
  'qualite': 'qualité',
  'egalite': 'égalité',
  'realite': 'réalité',
  'fidelite': 'fidélité',
  'humilite': 'humilité',
  'possibilite': 'possibilité',
  'responsabilite': 'responsabilité',
  'capacite': 'capacité',
  'incapacite': 'incapacité',
  'activite': 'activité',
  'passivite': 'passivité',
  'creativite': 'créativité',
  'objectivite': 'objectivité',
  'subjectivite': 'subjectivité',
  'sensibilite': 'sensibilité',
  'susceptibilite': 'susceptibilité',
  'compatibilite': 'compatibilité',
  'disponibilite': 'disponibilité',
  'credibilite': 'crédibilité',
  'visibilite': 'visibilité',
  'invisibilite': 'invisibilité',
  'possibilite': 'possibilité',
  'impossibilite': 'impossibilité',
  'probabilite': 'probabilité',
  'improbabilite': 'improbabilité',
  'stabilite': 'stabilité',
  'instabilite': 'instabilité',
  'mobilite': 'mobilité',
  'immobilite': 'immobilité',
  'nobilite': 'nobilité',
  'abilite': 'abilité',
  'habilete': 'habileté',
  'utilite': 'utilité',
  'inutilite': 'inutilité',
  'futilite': 'futilité',
  'fertilite': 'fertilité',
  'sterilite': 'stérilité',
  'virilite': 'virilité',
  'hostilite': 'hostilité',
  'docilite': 'docilité',
  'facilite': 'facilité',
  'difficulte': 'difficulté',
  'faculte': 'faculté',
  'autorite': 'autorité',
  'majorite': 'majorité',
  'minorite': 'minorité',
  'notabilite': 'notabilité',
  'personnalite': 'personnalité',
  'originalite': 'originalité',
  'nationalite': 'nationalité',
  'rationalite': 'rationalité',
  'spiritualite': 'spiritualité',
  'materialite': 'matérialité',
  'immortalite': 'immortalité',
  'mortalite': 'mortalité',
  'brutalite': 'brutalité',
  'neutralite': 'neutralité',
  'dualite': 'dualité',
  'sexualite': 'sexualité',
  'sensualite': 'sensualité',
  'actualite': 'actualité',
  'eventualite': 'éventualité',
  'mutualite': 'mutualité',
  'ponctualite': 'ponctualité',
  'individualite': 'individualité',
  'criminalite': 'criminalité',
  'anormalite': 'anormalité',
  'formalite': 'formalité',
  'informalite': 'informalité',
  'mentalite': 'mentalité',
  'sentimentalite': 'sentimentalité',
  'instrumentalite': 'instrumentalité',
  'horizontalite': 'horizontalité',
  'verticalite': 'verticalité',
  'frontalite': 'frontalité',
  'densite': 'densité',
  'intensite': 'intensité',
  'immensite': 'immensité',
  'diversite': 'diversité',
  'universite': 'université',
  'adversite': 'adversité',
  'perversite': 'perversité',
  'curiosite': 'curiosité',
  'generosite': 'générosité',
  'luminosite': 'luminosité',
  'religiosite': 'religiosité',
  'animosite': 'animosité',
  'nervosite': 'nervosité',
  'virtuosite': 'virtuosité',
  'complexite': 'complexité',
  'simplicite': 'simplicité',
  'duplicite': 'duplicité',
  'complicite': 'complicité',
  'publicite': 'publicité',
  'electricite': 'électricité',
  'authenticite': 'authenticité',
  'veracite': 'véracité',
  'tenacite': 'ténacité',
  'vivacite': 'vivacité',
  'efficacite': 'efficacité',
  'perspicacite': 'perspicacité',
  'sagacite': 'sagacité',
  'loquacite': 'loquacité',
  'rapacite': 'rapacité',
  'capacite': 'capacité',
  'incapacite': 'incapacité',
  'opacite': 'opacité',
  'specificite': 'spécificité',
  'toxicite': 'toxicité',
  'ferocite': 'férocité',
  'velocite': 'vélocité',
  'atrocite': 'atrocité',
  'precocite': 'précocité',
  'reciprocite': 'réciprocité',
  'periodicite': 'périodicité',
  'historicite': 'historicité',
  'chronicite': 'chronicité',
  'elasticite': 'élasticité',
  'plasticite': 'plasticité',
  'domesticite': 'domesticité',
  'rusticite': 'rusticité',
  'eccentricite': 'excentricité',
  'centricite': 'centricité',
  'electricite': 'électricité'
};

// Patterns spécifiques à corriger
const PATTERN_FIXES = [
  // Répétitions dans les tafsir
  {
    pattern: /Tafsir de (\d+:\d+) ou le Nom [A-Za-z\-']+ est mentionn[ée]+ ou son sens est expliqu[ée]+\.?/gi,
    replacement: (match, ref) => `Explication détaillée du verset ${ref} en lien avec ce Nom divin.`
  },
  // "quran_dérivéd" typo
  {
    pattern: /quran_d[ée]riv[ée]d/gi,
    replacement: 'quran_derived'
  },
  // Double espaces
  {
    pattern: /  +/g,
    replacement: ' '
  },
  // "ou" relationnel sans accent quand il devrait en avoir
  {
    pattern: / ou ([A-Z])/g,
    replacement: (match, letter) => ` où ${letter}`
  }
];

// Termes techniques qui doivent être dans le glossaire
const REQUIRED_GLOSSARY_TERMS = {
  'Ahl al-Sunnah': "Les gens de la Sunnah, désignant les musulmans sunnites qui suivent la voie prophétique et le consensus des compagnons.",
  'madhab': "École juridique islamique. Les quatre principales sont : hanafite, malikite, chafiite et hanbalite.",
  'madhhab': "Variante orthographique de madhab : école juridique islamique.",
  'tafsir': "Exégèse coranique, science de l'interprétation du Coran.",
  'hadith': "Parole, acte ou approbation attribués au Prophète Muhammad ﷺ.",
  'Sahih': "Authentique. Grade le plus élevé pour un hadith, signifiant qu'il répond à tous les critères d'authenticité.",
  "Da'if": "Faible. Grade d'un hadith dont la chaîne de transmission présente une faiblesse.",
  'isnad': "Chaîne de transmission d'un hadith, listant les rapporteurs successifs.",
  'sifa': "Attribut (divin). Pluriel : sifat.",
  'sifat': "Attributs (divins). Singulier : sifa.",
  'dhatiyya': "Relatif à l'Essence (dhat). Un attribut dhatiyya est un attribut d'Essence, inhérent et éternel.",
  "fi'liyya": "Relatif aux actes (fi'l). Un attribut fi'liyya est un attribut d'action, lié aux actes divins.",
  'Ash\'ari': "École théologique fondée par Abu al-Hasan al-Ash'ari (m. 324 H), majoritaire chez les malikites et chafiites.",
  'Maturidi': "École théologique fondée par Abu Mansur al-Maturidi (m. 333 H), majoritaire chez les hanafites.",
  'Athari': "École théologique privilégiant le texte littéral sans interprétation figurative, courante chez les hanbalites.",
  'ta\'wil': "Interprétation figurative ou métaphorique d'un texte religieux.",
  'tafwid': "Délégation du sens à Allah sans chercher à l'interpréter.",
  'bila kayf': "Sans demander 'comment'. Méthode d'affirmation des attributs divins sans les modaliser.",
  'wahm': "Illusion, imagination. Ce qu'Allah transcende.",
  'tanzih': "Transcendance. Affirmer qu'Allah est au-delà de toute ressemblance avec Ses créatures.",
  'tashbih': "Anthropomorphisme. Comparer Allah à Ses créatures (interdit).",
  'ta\'til': "Négation des attributs divins (interdit).",
  'fiqh': "Jurisprudence islamique, science des règles pratiques de l'Islam.",
  'usul al-fiqh': "Fondements de la jurisprudence islamique, méthodologie d'extraction des règles.",
  'ijma\'': "Consensus des savants musulmans sur une question.",
  'qiyas': "Raisonnement analogique en jurisprudence islamique.",
  'ijtihad': "Effort d'interprétation juridique par un savant qualifié.",
  'mujtahid': "Savant qualifié pour pratiquer l'ijtihad.",
  'fatwa': "Avis juridique rendu par un savant musulman qualifié.",
  'mufti': "Savant habilité à émettre des fatwas.",
  'Basmala': "La formule 'Bismillah ar-Rahman ar-Rahim' (Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux).",
  'Istiwa\'': "L'établissement d'Allah sur le Trône, mentionné dans le Coran.",
  'rahma': "Miséricorde en arabe. Racine des noms Ar-Rahman et Ar-Rahim.",
  'rahim': "Utérus en arabe, partageant la même racine que rahma (miséricorde).",
  'sighat al-mubalaghah': "Forme d'intensification en grammaire arabe, exprimant l'abondance ou l'intensité d'un attribut.",
  'fa\'lan': "Schème morphologique arabe (فَعْلَان) exprimant la plénitude et l'intensité.",
  'fa\'il': "Schème morphologique arabe (فَاعِل) exprimant l'agent ou la continuité.",
  'wazn': "Schème ou patron morphologique en grammaire arabe.",
  'hukm': "Jugement ou statut légal en Islam.",
  'halal': "Licite, permis selon la loi islamique.",
  'haram': "Illicite, interdit selon la loi islamique.",
  'makruh': "Déconseillé, répréhensible mais non interdit.",
  'mubah': "Permis, ni recommandé ni déconseillé.",
  'mustahabb': "Recommandé, méritoire mais non obligatoire.",
  'wajib': "Obligatoire selon la loi islamique.",
  'fard': "Obligation religieuse. Synonyme de wajib chez la plupart des écoles.",
  'sunna': "Tradition prophétique ; aussi : acte recommandé.",
  'bid\'a': "Innovation (en matière religieuse). Peut être blâmable ou acceptable selon les savants.",
  'shirk': "Associationnisme, le fait d'associer des partenaires à Allah.",
  'tawhid': "Unicité divine, monothéisme pur.",
  'kufr': "Mécréance, rejet de la foi.",
  'iman': "Foi, croyance.",
  'islam': "Soumission à Allah ; la religion musulmane.",
  'ihsan': "Excellence dans l'adoration, le fait d'adorer Allah comme si on Le voyait.",
  'taqwa': "Piété, crainte révérencielle d'Allah.",
  'khushu\'': "Humilité et concentration dans l'adoration.",
  'du\'a': "Invocation, supplication adressée à Allah.",
  'dhikr': "Rappel d'Allah, mention de Son nom.",
  'wird': "Litanie, ensemble de formules de dhikr récitées régulièrement.",
  'wird': "Litanie, ensemble de formules de dhikr récitées régulièrement.",
  'wird': "Litanie, ensemble de formules de dhikr récitées régulièrement.",
  'Quraysh': "Tribu arabe à laquelle appartenait le Prophète Muhammad ﷺ.",
  'Ahl al-Kitab': "Gens du Livre, désignant les juifs et les chrétiens dans le Coran.",
  'munafiq': "Hypocrite, celui qui prétend être musulman sans l'être vraiment.",
  'kafir': "Mécréant, celui qui rejette la foi. Pluriel : kuffar.",
  'mushrik': "Polythéiste, celui qui pratique le shirk.",
  'mu\'min': "Croyant. Pluriel : mu'minun.",
  'muslim': "Musulman, celui qui se soumet à Allah.",
  'salaf': "Prédécesseurs pieux, les trois premières générations de musulmans.",
  'khalaf': "Successeurs, générations postérieures au salaf.",
  'sahabi': "Compagnon du Prophète ﷺ. Pluriel : sahaba.",
  'tabi\'i': "Successeur des compagnons. Pluriel : tabi'in.",
  'tabi\' al-tabi\'in': "Successeur des successeurs, troisième génération."
};

/**
 * Applique les corrections d'accents à un texte
 */
function fixAccents(text) {
  if (typeof text !== 'string') return text;
  
  let result = text;
  
  // Appliquer les remplacements de mots
  for (const [wrong, correct] of Object.entries(ACCENT_FIXES)) {
    // Créer une regex qui respecte les limites de mots
    const regex = new RegExp(`\\b${escapeRegex(wrong)}\\b`, 'g');
    result = result.replace(regex, correct);
  }
  
  // Appliquer les patterns
  for (const fix of PATTERN_FIXES) {
    result = result.replace(fix.pattern, fix.replacement);
  }
  
  return result;
}

/**
 * Échappe les caractères spéciaux pour regex
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parcourt récursivement un objet et corrige les textes français
 */
function fixObjectAccents(obj, path = '') {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return fixAccents(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item, i) => fixObjectAccents(item, `${path}[${i}]`));
  }
  
  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Ne pas modifier les URLs, les clés techniques, et certains champs
      const skipKeys = ['source_url', 'url', 'link', 'final_url', 'checked_at', 'generated_at', 'slug', 'evidence_type'];
      if (skipKeys.includes(key) || key.endsWith('_url') || key.endsWith('_link')) {
        result[key] = value;
      } else {
        result[key] = fixObjectAccents(value, `${path}.${key}`);
      }
    }
    return result;
  }
  
  return obj;
}

/**
 * Complète le glossaire avec les termes manquants
 */
function ensureGlossaryComplete(entry) {
  if (!entry.glossary) {
    entry.glossary = [];
  }
  
  const existingTerms = new Set(entry.glossary.map(g => g.term.toLowerCase()));
  
  // Chercher les termes techniques dans le contenu
  const contentStr = JSON.stringify(entry);
  
  for (const [term, definition] of Object.entries(REQUIRED_GLOSSARY_TERMS)) {
    // Vérifier si le terme apparaît dans le contenu
    const termRegex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i');
    if (termRegex.test(contentStr) && !existingTerms.has(term.toLowerCase())) {
      entry.glossary.push({ term, definition });
      existingTerms.add(term.toLowerCase());
    }
  }
  
  // Trier le glossaire alphabétiquement
  entry.glossary.sort((a, b) => a.term.localeCompare(b.term, 'fr'));
  
  return entry;
}

/**
 * Reformule les descriptions génériques des tafsir
 */
function reformulateTafsirDescriptions(entry) {
  if (!entry.scholarly_explanations) return entry;
  
  const nameArabic = entry.arabic || '';
  const nameFrench = entry.french_name || entry.transliteration || '';
  
  entry.scholarly_explanations = entry.scholarly_explanations.map(exp => {
    if (exp.category === 'tafsir' && exp.summary_fr) {
      // Détecter les descriptions génériques
      if (exp.summary_fr.match(/Tafsir de \d+:\d+ o[uù] le Nom .* est mentionn/i)) {
        // Reformuler selon le savant
        const scholarReformulations = {
          'Al-Nasafi': `Explication hanafite du verset par l'imam Al-Nasafi dans Madarik al-Tanzil, avec analyse grammaticale et juridique du Nom ${nameFrench}.`,
          'Al-Qurtubi': `Commentaire malikite de l'imam Al-Qurtubi dans Al-Jami' li-Ahkam al-Quran, explorant les implications juridiques et théologiques du Nom ${nameFrench}.`,
          'Al-Baghawi': `Exégèse chafiite de l'imam Al-Baghawi dans Ma'alim al-Tanzil, présentant les avis des prédécesseurs sur le sens du Nom ${nameFrench}.`,
          'Ibn al-Jawzi': `Analyse hanbalite d'Ibn al-Jawzi dans Zad al-Masir, synthétisant les différentes interprétations du Nom ${nameFrench}.`
        };
        
        for (const [scholar, reformulation] of Object.entries(scholarReformulations)) {
          if (exp.scholar_name && exp.scholar_name.includes(scholar)) {
            exp.summary_fr = reformulation;
            break;
          }
        }
      }
    }
    return exp;
  });
  
  return entry;
}

/**
 * Traite un fichier d'entrée
 */
function processEntryFile(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Retirer le BOM si présent
    const cleanContent = content.replace(/^\uFEFF/, '');
    let entry = JSON.parse(cleanContent);
    
    // 1. Corriger les accents
    entry = fixObjectAccents(entry);
    
    // 2. Reformuler les descriptions génériques
    entry = reformulateTafsirDescriptions(entry);
    
    // 3. Compléter le glossaire
    entry = ensureGlossaryComplete(entry);
    
    // 4. Ajouter une note de mise à jour
    entry.content_fixed_at = new Date().toISOString();
    
    // Sauvegarder
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf8');
    
    return { success: true, file: path.basename(filePath) };
  } catch (error) {
    return { success: false, file: path.basename(filePath), error: error.message };
  }
}

/**
 * Traite tous les fichiers d'un dossier
 */
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  const results = { success: [], failed: [] };
  
  for (const file of files) {
    const result = processEntryFile(path.join(dirPath, file));
    if (result.success) {
      results.success.push(result.file);
    } else {
      results.failed.push(result);
    }
  }
  
  return results;
}

// ============================================================================
// MAIN
// ============================================================================
console.log('='.repeat(60));
console.log('Correction du contenu français des entrées encyclopédiques');
console.log('='.repeat(60));

// Traiter les entrées validées
console.log('\n📁 Traitement des entrées (entries/)...');
const entriesResults = processDirectory(ENTRIES_DIR);
console.log(`✅ ${entriesResults.success.length} fichiers corrigés`);
if (entriesResults.failed.length > 0) {
  console.log(`❌ ${entriesResults.failed.length} erreurs:`);
  entriesResults.failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
}

// Traiter les candidats
console.log('\n📁 Traitement des candidats (candidates/)...');
const candidatesResults = processDirectory(CANDIDATES_DIR);
console.log(`✅ ${candidatesResults.success.length} fichiers corrigés`);
if (candidatesResults.failed.length > 0) {
  console.log(`❌ ${candidatesResults.failed.length} erreurs:`);
  candidatesResults.failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
}

console.log('\n' + '='.repeat(60));
console.log('Terminé !');
console.log('='.repeat(60));
