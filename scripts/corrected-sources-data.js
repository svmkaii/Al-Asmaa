'use strict';

// ============================================================
// CORRECTED SOURCES DATA FOR THE 99 NAMES OF ALLAH
// ============================================================
// Each entry contains verified Quran references, correct hadith
// citations with grading, and proper scholarly attributions.
//
// evidence_type:
//   "quran_direct"  = Name appears as a divine attribute in Quran
//   "quran_derived" = Root/concept in Quran but not the exact Name form
//   "hadith_primary"= Name comes primarily from hadith tradition
//
// For quran[]: name_in_verse indicates whether the exact Name form appears
// For tafsir_verse: the verse to use for altafsir.com links (or null)
// ============================================================

const COMMON_HADITH = {
  tirmidhi_99_names: {
    collection: 'Tirmidhi',
    number: '3507',
    grading: "Da'if (isnad), contenu largement accepte par les savants",
    note_fr: "Hadith listant les 99 noms d'Allah."
  },
  bukhari_99_concept: {
    collection: 'Sahih Bukhari',
    number: '2736',
    grading: 'Sahih',
    note_fr: "\"Allah a 99 noms, cent moins un, quiconque les recense entrera au Paradis.\""
  }
};

const SCHOLARLY_WORKS = {
  ghazali: {
    scholar_name: 'Abu Hamid Al-Ghazali',
    madhab: 'shafii',
    source_title: 'Al-Maqsad al-Asna fi Sharh Asma Allah al-Husna',
    source_url: 'https://shamela.ws/book/6465',
    category: 'specialized_work'
  },
  ibn_qayyim: {
    scholar_name: 'Ibn al-Qayyim',
    madhab: 'hanbali',
    source_title: "Bada'i al-Fawa'id",
    source_url: 'https://shamela.ws/book/145410',
    category: 'specialized_work'
  },
  bayhaqi: {
    scholar_name: 'Abu Bakr Al-Bayhaqi',
    madhab: 'shafii',
    source_title: "Al-Asma' wa al-Sifat",
    source_url: 'https://shamela.ws/book/9270',
    category: 'specialized_work'
  }
};

// altafsir.com tafsir IDs
const TAFSIR = {
  nasafi:  { tMadhNo: 2, tTafsirNo: 17, scholar: 'Abu al-Barakat Al-Nasafi', title: 'Madarik al-Tanzil', madhab: 'hanafi' },
  qurtubi: { tMadhNo: 1, tTafsirNo: 5,  scholar: 'Abu Abdillah Al-Qurtubi', title: 'Al-Jami li-Ahkam al-Quran', madhab: 'maliki' },
  baghawi: { tMadhNo: 2, tTafsirNo: 13, scholar: 'Al-Baghawi', title: 'Maalim al-Tanzil', madhab: 'shafii' },
  jawzi:   { tMadhNo: 2, tTafsirNo: 15, scholar: 'Ibn al-Jawzi', title: 'Zad al-Masir fi Ilm al-Tafsir', madhab: 'hanbali' }
};

const DATA = {
  // ===================== ALLAH =====================
  'allah': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 112, ayah: 1, name_in_verse: true, note_fr: "\"Dis : Il est Allah, l'Unique.\"" },
      { surah: 59, ayah: 22, name_in_verse: true, note_fr: "\"C'est Lui Allah, nulle divinite autre que Lui.\"" },
      { surah: 2, ayah: 255, name_in_verse: true, note_fr: "Ayat al-Kursi : \"Allah ! Nulle divinite autre que Lui.\"" }
    ],
    hadith: [
      { collection: 'Sahih Bukhari', number: '2736', grading: 'Sahih', note_fr: "\"Allah a 99 noms... quiconque les recense entrera au Paradis.\"" },
      { collection: 'Sahih Muslim', number: '2677', grading: 'Sahih', note_fr: "Variante du hadith des 99 noms." }
    ],
    tafsir_verse: { surah: 112, ayah: 1 },
    scholarly_note_fr: "Ism al-Jalala, le Nom supreme qui englobe tous les autres attributs de perfection. Al-Ghazali explique qu'il designe l'Etre dont l'existence est necessaire, digne de toute adoration. Ibn al-Qayyim precise qu'il est le seul Nom dont tous les autres sont des attributs."
  },

  // ===================== AR-RAHMAN =====================
  'ar-rahman': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 1, ayah: 1, name_in_verse: true, note_fr: "\"Au nom d'Allah, le Tout Misericordieux (Ar-Rahman), le Tres Misericordieux.\"" },
      { surah: 55, ayah: 1, name_in_verse: true, note_fr: "\"Ar-Rahman. Il a enseigne le Coran.\" Sourate entiere dediee a ce Nom." },
      { surah: 59, ayah: 22, name_in_verse: true, note_fr: "\"C'est Lui Allah... Ar-Rahman, Ar-Rahim.\"" },
      { surah: 17, ayah: 110, name_in_verse: true, note_fr: "\"Invoquez Allah ou invoquez Ar-Rahman, quel que soit le nom...\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '2752', grading: 'Sahih', note_fr: "\"Allah a cree la misericorde en 100 parts, Il en a retenu 99 aupres de Lui.\"" }
    ],
    tafsir_verse: { surah: 55, ayah: 1 },
    scholarly_note_fr: "Al-Ghazali distingue Ar-Rahman de Ar-Rahim : Ar-Rahman designe la misericorde universelle englobant toute la creation (croyants et non-croyants), tandis que Ar-Rahim est specifique aux croyants dans l'au-dela. Ce Nom est exclusif a Allah et ne peut etre attribue a aucune creature."
  },

  // ===================== AR-RAHIM =====================
  'ar-rahim': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 1, ayah: 1, name_in_verse: true, note_fr: "\"Au nom d'Allah, Ar-Rahman, Ar-Rahim.\"" },
      { surah: 2, ayah: 163, name_in_verse: true, note_fr: "\"Votre Dieu est un Dieu unique... Ar-Rahman, Ar-Rahim.\"" },
      { surah: 59, ayah: 22, name_in_verse: true, note_fr: "\"C'est Lui Allah... Ar-Rahman, Ar-Rahim.\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '2752', grading: 'Sahih', note_fr: "La misericorde d'Allah divisee en 100 parts." }
    ],
    tafsir_verse: { surah: 2, ayah: 163 },
    scholarly_note_fr: "Ar-Rahim designe la misericorde specifique d'Allah envers Ses serviteurs croyants, les guidant vers la foi et les recompensant dans l'au-dela. Al-Qurtubi note que Ar-Rahman est un nom de majestic (jalal) et Ar-Rahim est un nom de beaute (jamal)."
  },

  // ===================== AL-MALIK =====================
  'al-malik': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 23, name_in_verse: true, note_fr: "\"C'est Lui Allah... Al-Malik, Al-Quddus, As-Salam...\"" },
      { surah: 20, ayah: 114, name_in_verse: true, note_fr: "\"Exalte soit Allah, le Roi (Al-Malik), le Vrai.\"" },
      { surah: 23, ayah: 116, name_in_verse: true, note_fr: "\"Exalte soit Allah, le vrai Souverain (Al-Malik).\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 23 },
    scholarly_note_fr: "Al-Malik est le Souverain absolu de toute chose. Al-Ghazali explique que la royaute veritable n'appartient qu'a Allah car Il est le seul a ne dependre de rien et dont tout depend. Ibn al-Qayyim distingue Al-Malik (le Roi), Al-Maalik (le Possesseur) et Malik al-Mulk (le Detenteur de la royaute)."
  },

  // ===================== AL-QUDDUS =====================
  'al-quddus': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 23, name_in_verse: true, note_fr: "\"C'est Lui Allah... Al-Malik, Al-Quddus...\"" },
      { surah: 62, ayah: 1, name_in_verse: true, note_fr: "\"Tout ce qui est dans les cieux glorifie Allah, Al-Malik, Al-Quddus.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 23 },
    scholarly_note_fr: "Al-Quddus signifie le Pur, le Saint, exempt de tout defaut et de toute imperfection. Al-Ghazali explique qu'Il est au-dessus de tout attribut perceptible par les sens ou concevable par l'imagination. Al-Bayhaqi rapporte que ce Nom implique la transcendance absolue."
  },

  // ===================== AS-SALAM =====================
  'as-salam': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 23, name_in_verse: true, note_fr: "\"C'est Lui Allah... Al-Quddus, As-Salam...\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '592', grading: 'Sahih', note_fr: "\"O Allah, Tu es As-Salam, et de Toi vient la paix (salam).\" (invocation apres la priere)" }
    ],
    tafsir_verse: { surah: 59, ayah: 23 },
    scholarly_note_fr: "As-Salam signifie Celui qui est exempt de tout defaut, la Source de la paix et de la securite. Al-Khattabi explique qu'Il est Celui qui a preserve Sa creation de Son injustice. Al-Ghazali ajoute qu'Il est Celui de qui provient toute paix dans l'univers."
  },

  // ===================== AL-MU'MIN =====================
  'al-mumin': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 23, name_in_verse: true, note_fr: "\"C'est Lui Allah... As-Salam, Al-Mu'min...\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 23 },
    scholarly_note_fr: "Al-Mu'min designe Celui qui accorde la securite, qui confirme la veracite de Ses messagers par les miracles. Al-Ghazali explique deux sens : Celui qui donne la securite (aman) a Ses serviteurs, et Celui qui Se confirme Lui-meme dans Son unicite (tasdiq)."
  },

  // ===================== AL-MUHAYMIN =====================
  'al-muhaymin': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 23, name_in_verse: true, note_fr: "\"C'est Lui Allah... Al-Mu'min, Al-Muhaymin...\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 23 },
    scholarly_note_fr: "Al-Muhaymin signifie le Vigilant supreme, le Protecteur, le Temoin de toute chose. Al-Khattabi explique qu'il derive de haymana (veiller sur), designant Celui qui observe et preserve toute chose. Al-Qurtubi ajoute qu'il signifie le Gardien fidele."
  },

  // ===================== AL-AZIZ =====================
  'al-aziz': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 23, name_in_verse: true, note_fr: "\"C'est Lui Allah... Al-Aziz, Al-Jabbar, Al-Mutakabbir.\"" },
      { surah: 3, ayah: 6, name_in_verse: true, note_fr: "\"Nulle divinite autre que Lui, Al-Aziz, Al-Hakim.\"" },
      { surah: 14, ayah: 4, name_in_verse: true, note_fr: "Mentionne dans de nombreux versets comme attribut divin." }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 23 },
    scholarly_note_fr: "Al-Aziz signifie l'Invincible, le Tout-Puissant que rien ne peut vaincre. Ibn al-Qayyim explique trois sens : l'invincibilite (al-ghalaba), la rarete supreme (ne peut etre atteint), et la force absolue. Ce Nom est mentionne plus de 90 fois dans le Coran."
  },

  // ===================== AL-JABBAR =====================
  'al-jabbar': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 23, name_in_verse: true, note_fr: "\"C'est Lui Allah... Al-Aziz, Al-Jabbar, Al-Mutakabbir.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 23 },
    scholarly_note_fr: "Al-Jabbar a trois sens selon les savants : Celui qui repare (yajburu) les coeurs brises, Celui dont la volonte s'impose a toute chose (irrésistible), et le Tres-Haut inaccessible. Al-Khattabi privilegie le sens de Celui qui contraint toute la creation a Sa volonte."
  },

  // ===================== AL-MUTAKABBIR =====================
  'al-mutakabbir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 23, name_in_verse: true, note_fr: "\"C'est Lui Allah... Al-Jabbar, Al-Mutakabbir.\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '2620', grading: 'Sahih', note_fr: "\"La grandeur (kibriya) est Mon manteau...\" (hadith qudsi)" }
    ],
    tafsir_verse: { surah: 59, ayah: 23 },
    scholarly_note_fr: "Al-Mutakabbir signifie Celui a qui appartient exclusivement la grandeur supreme. Al-Ghazali explique que la kibriya (grandeur) n'est legitime que pour Allah. Quand un humain se montre orgueilleux, c'est blame ; pour Allah, c'est un attribut de perfection car Lui seul merite cette grandeur absolue."
  },

  // ===================== AL-KHALIQ =====================
  'al-khaliq': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 24, name_in_verse: true, note_fr: "\"C'est Lui Allah, Al-Khaliq, Al-Bari', Al-Musawwir.\"" },
      { surah: 36, ayah: 81, name_in_verse: true, note_fr: "\"Celui qui a cree les cieux et la terre n'est-Il pas capable de creer leurs semblables ? Oui, Il est Al-Khallaq, Al-Alim.\"" },
      { surah: 15, ayah: 86, name_in_verse: true, note_fr: "\"Ton Seigneur est Al-Khallaq, Al-Alim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 24 },
    scholarly_note_fr: "Al-Khaliq signifie le Createur qui determine la mesure de chaque chose avant de la creer. Al-Ghazali distingue Al-Khaliq (qui determine/planifie), Al-Bari' (qui fait exister a partir du neant) et Al-Musawwir (qui donne la forme). Ces trois noms decrivent les etapes de la creation."
  },

  // ===================== AL-BARI' =====================
  'al-bari': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 24, name_in_verse: true, note_fr: "\"C'est Lui Allah, Al-Khaliq, Al-Bari', Al-Musawwir.\"" },
      { surah: 2, ayah: 54, name_in_verse: true, note_fr: "\"Revenez a votre Createur (Bari'ikum).\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 24 },
    scholarly_note_fr: "Al-Bari' signifie Celui qui fait exister les creatures a partir du neant, sans modele prealable. Al-Ghazali explique que ce Nom designe l'acte de production de l'existence, distinct de la planification (khalq) et du façonnage (taswir)."
  },

  // ===================== AL-MUSAWWIR =====================
  'al-musawwir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 59, ayah: 24, name_in_verse: true, note_fr: "\"C'est Lui Allah, Al-Khaliq, Al-Bari', Al-Musawwir.\"" },
      { surah: 40, ayah: 64, name_in_verse: true, note_fr: "\"Il vous a donne forme (sawwarakum) et a perfectionne vos formes.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 24 },
    scholarly_note_fr: "Al-Musawwir est Celui qui façonne chaque creature avec une forme unique et distincte. Al-Ghazali explique qu'apres avoir determine (khalq) et fait exister (bar'), Allah donne a chaque etre sa forme particuliere, et aucune creature ne ressemble exactement a une autre."
  },

  // ===================== AL-GHAFFAR =====================
  'al-ghaffar': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 38, ayah: 66, name_in_verse: true, note_fr: "\"Seigneur des cieux et de la terre... Al-Aziz, Al-Ghaffar.\"" },
      { surah: 39, ayah: 5, name_in_verse: true, note_fr: "\"N'est-Il pas Al-Aziz, Al-Ghaffar ?\"" },
      { surah: 71, ayah: 10, name_in_verse: true, note_fr: "\"Implorez le pardon de votre Seigneur, car Il est Al-Ghaffar.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 39, ayah: 5 },
    scholarly_note_fr: "Al-Ghaffar (forme intensive de Ghafir) signifie Celui qui pardonne abondamment et de maniere repetee. Al-Ghazali explique qu'Allah couvre les peches et ne les devoile pas, meme s'il les connait. La difference avec Al-Ghafur est que Al-Ghaffar insiste sur la repetition du pardon."
  },

  // ===================== AL-QAHHAR =====================
  'al-qahhar': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 13, ayah: 16, name_in_verse: true, note_fr: "\"Dis : Allah est le Createur de toute chose, et Il est Al-Wahid, Al-Qahhar.\"" },
      { surah: 38, ayah: 65, name_in_verse: true, note_fr: "\"Dis : Je suis un avertisseur. Il n'y a de divinite qu'Allah, Al-Wahid, Al-Qahhar.\"" },
      { surah: 39, ayah: 4, name_in_verse: true, note_fr: "\"Il est Allah, Al-Wahid, Al-Qahhar.\"" },
      { surah: 40, ayah: 16, name_in_verse: true, note_fr: "\"A qui appartient la royaute aujourd'hui ? A Allah, Al-Wahid, Al-Qahhar.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 39, ayah: 4 },
    scholarly_note_fr: "Al-Qahhar signifie Celui dont la domination est irresistible et qui soumet toute chose a Sa volonte. Al-Ghazali explique que tout ce qui existe est soumis a Son pouvoir et ne peut Lui resister. Ce Nom est souvent associe a Al-Wahid dans le Coran."
  },

  // ===================== AL-WAHHAB =====================
  'al-wahhab': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 3, ayah: 8, name_in_verse: true, note_fr: "\"Notre Seigneur... accorde-nous de Ta part une misericorde. C'est Toi Al-Wahhab.\"" },
      { surah: 38, ayah: 9, name_in_verse: true, note_fr: "\"Possedent-ils les tresors de la misericorde de ton Seigneur, Al-Aziz, Al-Wahhab ?\"" },
      { surah: 38, ayah: 35, name_in_verse: true, note_fr: "\"Pardonne-moi et accorde-moi un royaume... Tu es Al-Wahhab.\" (invocation de Sulayman)" }
    ],
    hadith: [],
    tafsir_verse: { surah: 38, ayah: 35 },
    scholarly_note_fr: "Al-Wahhab signifie le Donateur genereux qui accorde sans contrepartie ni attente de retour. Al-Ghazali explique que le don veritable est celui fait sans but d'interet, et seul Allah donne de maniere absolument gratuite."
  },

  // ===================== AR-RAZZAQ =====================
  'ar-razzaq': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 51, ayah: 58, name_in_verse: true, note_fr: "\"C'est Allah qui est Ar-Razzaq, le Detenteur de la force, Al-Matin.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 51, ayah: 58 },
    scholarly_note_fr: "Ar-Razzaq signifie le Pourvoyeur absolu, Celui qui cree la subsistance et la fait parvenir a chaque creature. Al-Ghazali distingue le rizq apparent (nourriture, biens) du rizq cache (science, foi, guidee). Tout ce dont profite un etre vivant est un rizq d'Allah."
  },

  // ===================== AL-FATTAH =====================
  'al-fattah': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 34, ayah: 26, name_in_verse: true, note_fr: "\"Notre Seigneur nous reunira puis jugera entre nous en verite. C'est Lui Al-Fattah, Al-Alim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 34, ayah: 26 },
    scholarly_note_fr: "Al-Fattah signifie Celui qui ouvre (les portes de la misericorde, de la subsistance, de la victoire). Al-Ghazali explique deux sens : le Juge supreme (qui tranche - fath signifie aussi jugement) et Celui qui ouvre ce qui est ferme aux creatures."
  },

  // ===================== AL-ALIM =====================
  'al-alim': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 29, name_in_verse: true, note_fr: "\"Il est de toute chose Omniscient (Alim).\"" },
      { surah: 6, ayah: 13, name_in_verse: true, note_fr: "\"A Lui appartient ce qui habite la nuit et le jour. Il est As-Sami', Al-Alim.\"" },
      { surah: 59, ayah: 22, name_in_verse: true, note_fr: "\"C'est Lui Allah... le Connaisseur de l'invisible et du visible (Alim al-ghaybi wa ash-shahada).\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 59, ayah: 22 },
    scholarly_note_fr: "Al-Alim signifie l'Omniscient dont la science englobe toute chose : le passe, le present, le futur, le visible et l'invisible. Al-Ghazali explique que Sa science est eternelle, ne s'acquiert pas et ne change pas. Ce Nom est mentionne plus de 150 fois dans le Coran."
  },

  // ===================== AL-QABID =====================
  'al-qabid': {
    evidence_type: 'hadith_primary',
    quran: [
      { surah: 2, ayah: 245, name_in_verse: false, note_fr: "\"Allah restreint (yaqbidu) et etend (yabsutu)\" - forme verbale, non le Nom." }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Qabid figure dans la liste des 99 noms." },
      { collection: 'Tirmidhi', number: '1314', grading: 'Sahih', note_fr: "\"Allah est Al-Qabid, Al-Basit, Al-Musa'ir (Celui qui fixe les prix).\"" }
    ],
    tafsir_verse: { surah: 2, ayah: 245 },
    scholarly_note_fr: "Al-Qabid signifie Celui qui restreint la subsistance, les coeurs ou les ames selon Sa sagesse. Al-Ghazali explique qu'Il restreint parfois pour eprouver et parfois pour eduquer. Ce Nom est generalement cite avec son oppose Al-Basit."
  },

  // ===================== AL-BASIT =====================
  'al-basit': {
    evidence_type: 'hadith_primary',
    quran: [
      { surah: 2, ayah: 245, name_in_verse: false, note_fr: "\"Allah restreint (yaqbidu) et etend (yabsutu)\" - forme verbale." },
      { surah: 13, ayah: 26, name_in_verse: false, note_fr: "\"Allah etend (yabsutu) la subsistance a qui Il veut.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '1314', grading: 'Sahih', note_fr: "\"Allah est Al-Qabid, Al-Basit...\"" }
    ],
    tafsir_verse: { surah: 2, ayah: 245 },
    scholarly_note_fr: "Al-Basit signifie Celui qui etend et deploie la subsistance, la joie et la misericorde. Al-Ghazali explique qu'Il deploie les ames par la joie et la subsistance par la generosite. Associe a Al-Qabid, ces deux Noms montrent qu'Allah gere l'abondance et la restriction."
  },

  // ===================== AL-KHAFID =====================
  'al-khafid': {
    evidence_type: 'hadith_primary',
    quran: [
      { surah: 56, ayah: 3, name_in_verse: false, note_fr: "\"(Le Jour du Jugement) abaissant (khafida), elevant (rafi'a)\" - adjectifs verbaux, non des Noms divins dans ce contexte." }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Khafid figure dans la liste des 99 noms." }
    ],
    tafsir_verse: null,
    scholarly_note_fr: "Al-Khafid signifie Celui qui abaisse les orgueilleux et les tyrans. Ce Nom n'apparait pas directement dans le Coran comme attribut divin mais est atteste dans les listes de hadiths. Al-Ghazali explique qu'Il abaisse les incredules et les arrogants par Son decret."
  },

  // ===================== AR-RAFI' =====================
  'ar-rafi': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 6, ayah: 83, name_in_verse: false, note_fr: "\"Nous elevons (narfa'u) en degre qui Nous voulons\" - forme verbale." },
      { surah: 3, ayah: 55, name_in_verse: false, note_fr: "\"Je vais... t'elever (rafi'uka) vers Moi\" - a propos de 'Isa." },
      { surah: 58, ayah: 11, name_in_verse: false, note_fr: "\"Allah eleve (yarfa'i) ceux d'entre vous qui ont cru et ceux qui ont recu la science.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Ar-Rafi' figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 6, ayah: 83 },
    scholarly_note_fr: "Ar-Rafi' signifie Celui qui eleve en rang Ses serviteurs. Al-Ghazali explique qu'Il eleve les croyants par la foi et la science, et abaisse les incredules par l'ignorance et l'egarement. Cite avec Al-Khafid comme paire complementaire."
  },

  // ===================== AL-MU'IZZ =====================
  'al-muizz': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 3, ayah: 26, name_in_verse: false, note_fr: "\"Tu honores (tu'izzu) qui Tu veux et Tu humilies (tudhillu) qui Tu veux\" - forme verbale." }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Mu'izz figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 3, ayah: 26 },
    scholarly_note_fr: "Al-Mu'izz signifie Celui qui accorde l'honneur et la puissance a qui Il veut. Al-Ghazali explique que la vraie 'izza (honneur) vient de la foi et de l'obeissance a Allah. Ce Nom est derive du verset 3:26 ou il apparait sous forme verbale."
  },

  // ===================== AL-MUDHILL =====================
  'al-mudhill': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 3, ayah: 26, name_in_verse: false, note_fr: "\"Tu honores (tu'izzu) qui Tu veux et Tu humilies (tudhillu) qui Tu veux\" - forme verbale." }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Mudhill figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 3, ayah: 26 },
    scholarly_note_fr: "Al-Mudhill signifie Celui qui humilie et abaisse les orgueilleux et les rebelles. Al-Ghazali explique que l'humiliation veritable est celle de l'ame eloignee d'Allah. Ce Nom est cite avec Al-Mu'izz comme paire complementaire."
  },

  // ===================== AS-SAMI' =====================
  'as-sami': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 127, name_in_verse: true, note_fr: "\"Accepte de nous, Tu es As-Sami', Al-Alim.\" (invocation d'Ibrahim)" },
      { surah: 17, ayah: 1, name_in_verse: true, note_fr: "\"Gloire a Celui qui... Il est As-Sami', Al-Basir.\"" },
      { surah: 42, ayah: 11, name_in_verse: true, note_fr: "\"Rien ne Lui est semblable, et Il est As-Sami', Al-Basir.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 42, ayah: 11 },
    scholarly_note_fr: "As-Sami' signifie Celui qui entend tout sans exception, les paroles secretes comme les invocations silencieuses. Al-Ghazali explique que Son ouie est sans organe ni instrument, englobant tous les sons de l'univers sans qu'aucun ne Lui echappe."
  },

  // ===================== AL-BASIR =====================
  'al-basir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 17, ayah: 1, name_in_verse: true, note_fr: "\"Il est As-Sami', Al-Basir.\"" },
      { surah: 42, ayah: 11, name_in_verse: true, note_fr: "\"Il est As-Sami', Al-Basir.\"" },
      { surah: 40, ayah: 20, name_in_verse: true, note_fr: "\"Allah juge en verite... Il est As-Sami', Al-Basir.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 42, ayah: 11 },
    scholarly_note_fr: "Al-Basir signifie Celui qui voit tout, les choses visibles et invisibles, les atomes les plus infimes comme les astres les plus lointains. Al-Ghazali explique que Sa vue est sans organe, eternelle et englobante. Souvent associe a As-Sami' dans le Coran."
  },

  // ===================== AL-HAKAM =====================
  'al-hakam': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 6, ayah: 114, name_in_verse: true, note_fr: "\"Chercherai-je un autre juge (hakam) qu'Allah ?\"" }
    ],
    hadith: [
      { collection: 'Abu Dawud', number: '4955', grading: 'Sahih', note_fr: "\"Allah est Al-Hakam, et a Lui appartient le jugement.\"" }
    ],
    tafsir_verse: { surah: 6, ayah: 114 },
    scholarly_note_fr: "Al-Hakam signifie le Juge supreme dont le jugement est sans appel. Al-Ghazali explique que le vrai jugement n'appartient qu'a Allah car Lui seul connait la verite absolue de chaque situation. Le Prophete a interdit de se nommer 'Al-Hakam' car ce titre est reserve a Allah."
  },

  // ===================== AL-'ADL =====================
  'al-adl': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 6, ayah: 115, name_in_verse: false, note_fr: "\"La parole de ton Seigneur s'est accomplie en toute verite et justice ('adlan)\" - concept, non le Nom." },
      { surah: 16, ayah: 90, name_in_verse: false, note_fr: "\"Allah ordonne la justice (al-'adl) et la bienfaisance.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-'Adl figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 6, ayah: 115 },
    scholarly_note_fr: "Al-'Adl signifie le Juste absolu qui ne commet aucune injustice envers Ses creatures. Al-Ghazali explique qu'Il place chaque chose a sa juste place et accorde a chacun ce qu'il merite. Son injustice est impossible par nature, non par contrainte."
  },

  // ===================== AL-LATIF =====================
  'al-latif': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 6, ayah: 103, name_in_verse: true, note_fr: "\"Les regards ne peuvent L'atteindre, et Il atteint tous les regards. Il est Al-Latif, Al-Khabir.\"" },
      { surah: 42, ayah: 19, name_in_verse: true, note_fr: "\"Allah est Al-Latif envers Ses serviteurs.\"" },
      { surah: 67, ayah: 14, name_in_verse: true, note_fr: "\"Ne connaitrait-Il pas ce qu'Il a cree ? Il est Al-Latif, Al-Khabir.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 6, ayah: 103 },
    scholarly_note_fr: "Al-Latif a deux sens : le Subtil (dont l'essence echappe aux perceptions) et le Bienveillant (qui fait parvenir le bien a Ses serviteurs par des voies qu'ils ne percoivent pas). Al-Ghazali explique qu'Il connait les details les plus fins et agit avec une delicatesse imperceptible."
  },

  // ===================== AL-KHABIR =====================
  'al-khabir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 6, ayah: 18, name_in_verse: true, note_fr: "\"Il est Al-Qahir au-dessus de Ses serviteurs, et Il est Al-Hakim, Al-Khabir.\"" },
      { surah: 6, ayah: 103, name_in_verse: true, note_fr: "\"Il est Al-Latif, Al-Khabir.\"" },
      { surah: 31, ayah: 16, name_in_verse: true, note_fr: "\"Allah est Al-Latif, Al-Khabir.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 6, ayah: 103 },
    scholarly_note_fr: "Al-Khabir signifie Celui qui connait les realites profondes et cachees de toute chose. Al-Ghazali explique que ce Nom va au-dela de Al-Alim : il designe une connaissance des realites interieures, des secrets et des subtilites."
  },

  // ===================== AL-HALIM =====================
  'al-halim': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 225, name_in_verse: true, note_fr: "\"Allah est Al-Ghafur, Al-Halim.\"" },
      { surah: 2, ayah: 263, name_in_verse: true, note_fr: "\"Allah est Al-Ghani, Al-Halim.\"" },
      { surah: 17, ayah: 44, name_in_verse: true, note_fr: "\"Il est Al-Halim, Al-Ghafur.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 225 },
    scholarly_note_fr: "Al-Halim signifie le Tres-Indulgent qui ne se hate pas de punir les pecheurs malgre Sa puissance. Al-Ghazali explique que Sa patience n'est pas due a l'impuissance mais a la sagesse : Il donne du temps au pecheur pour se repentir."
  },

  // ===================== AL-AZIM =====================
  'al-azim': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 255, name_in_verse: true, note_fr: "\"...et Il est Al-'Ali, Al-'Azim.\" (Ayat al-Kursi)" },
      { surah: 42, ayah: 4, name_in_verse: true, note_fr: "\"Il est Al-'Ali, Al-'Azim.\"" },
      { surah: 56, ayah: 74, name_in_verse: true, note_fr: "\"Glorifie le Nom de ton Seigneur, Al-'Azim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 255 },
    scholarly_note_fr: "Al-'Azim signifie le Tres-Grand, dont la grandeur depasse toute comprehension. Al-Ghazali explique que personne ne peut saisir la realite de Sa grandeur, ni les sens ni l'intellect. Seul Lui Se connait veritablement."
  },

  // ===================== AL-GHAFUR =====================
  'al-ghafur': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 173, name_in_verse: true, note_fr: "\"Allah est Al-Ghafur, Ar-Rahim.\"" },
      { surah: 15, ayah: 49, name_in_verse: true, note_fr: "\"Informe Mes serviteurs que c'est Moi Al-Ghafur, Ar-Rahim.\"" },
      { surah: 39, ayah: 53, name_in_verse: true, note_fr: "\"Ne desesperez pas de la misericorde d'Allah. Allah pardonne tous les peches. C'est Lui Al-Ghafur, Ar-Rahim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 39, ayah: 53 },
    scholarly_note_fr: "Al-Ghafur signifie Celui qui pardonne abondamment et couvre les peches. Al-Ghazali explique que ce Nom exprime la qualite de celui qui voit le peche et a le pouvoir de punir, mais choisit de pardonner. Mentionne plus de 70 fois dans le Coran."
  },

  // ===================== ASH-SHAKUR =====================
  'ash-shakur': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 35, ayah: 30, name_in_verse: true, note_fr: "\"Il est Al-Ghafur, Ash-Shakur.\"" },
      { surah: 35, ayah: 34, name_in_verse: true, note_fr: "\"Notre Seigneur est Al-Ghafur, Ash-Shakur.\"" },
      { surah: 42, ayah: 23, name_in_verse: true, note_fr: "\"Allah est Al-Ghafur, Ash-Shakur.\"" },
      { surah: 64, ayah: 17, name_in_verse: true, note_fr: "\"Allah est Ash-Shakur, Al-Halim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 35, ayah: 30 },
    scholarly_note_fr: "Ash-Shakur signifie Celui qui reconnait et recompense genereusement le peu de bien que font Ses serviteurs. Al-Ghazali explique que malgre l'infimite de nos actes face a Ses bienfaits, Allah les multiplie et les recompense abondamment."
  },

  // ===================== AL-'ALI =====================
  'al-ali': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 255, name_in_verse: true, note_fr: "\"Il est Al-'Ali, Al-'Azim.\" (Ayat al-Kursi)" },
      { surah: 42, ayah: 4, name_in_verse: true, note_fr: "\"Il est Al-'Ali, Al-'Azim.\"" },
      { surah: 42, ayah: 51, name_in_verse: true, note_fr: "\"Il est Al-'Ali, Al-Hakim.\"" },
      { surah: 4, ayah: 34, name_in_verse: true, note_fr: "\"Allah est Al-'Ali, Al-Kabir.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 255 },
    scholarly_note_fr: "Al-'Ali signifie le Tres-Haut, au-dessus de toute la creation par Son essence, Ses attributs et Son pouvoir. Al-Ghazali explique trois aspects de cette elevation : l'elevation du rang, l'elevation du pouvoir, et l'elevation de l'essence."
  },

  // ===================== AL-KABIR =====================
  'al-kabir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 13, ayah: 9, name_in_verse: true, note_fr: "\"Le Connaisseur de l'invisible et du visible, Al-Kabir, Al-Muta'ali.\"" },
      { surah: 22, ayah: 62, name_in_verse: true, note_fr: "\"Allah est Al-'Ali, Al-Kabir.\"" },
      { surah: 34, ayah: 23, name_in_verse: true, note_fr: "\"Il est Al-'Ali, Al-Kabir.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 22, ayah: 62 },
    scholarly_note_fr: "Al-Kabir signifie le Tres-Grand, Celui qui possede la grandeur absolue (kibriya'). Al-Ghazali explique que Sa grandeur est au-dela de toute comparaison et de toute mesure humaine. Ce Nom est souvent associe a Al-'Ali dans le Coran."
  },

  // ===================== AL-HAFIZ =====================
  'al-hafiz': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 11, ayah: 57, name_in_verse: true, note_fr: "\"Mon Seigneur est Al-Hafiz sur toute chose.\"" },
      { surah: 34, ayah: 21, name_in_verse: true, note_fr: "\"Et ton Seigneur est Al-Hafiz sur toute chose.\"" },
      { surah: 42, ayah: 6, name_in_verse: true, note_fr: "\"Allah est Al-Hafiz sur eux.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 11, ayah: 57 },
    scholarly_note_fr: "Al-Hafiz signifie le Protecteur, le Gardien qui preserve Sa creation du neant et de la destruction. Al-Ghazali distingue deux aspects : la preservation de l'existence (rien ne perit sans Sa permission) et la preservation des actes (tout est enregistre)."
  },

  // ===================== AL-MUQIT =====================
  'al-muqit': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 4, ayah: 85, name_in_verse: true, note_fr: "\"Allah est sur toute chose Al-Muqit (garant/nourricier).\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 4, ayah: 85 },
    scholarly_note_fr: "Al-Muqit signifie Celui qui nourrit et sustente toute creature, ou selon une autre lecture, Celui qui est garant et temoin de toute chose. Al-Baghawi et Al-Qurtubi mentionnent les deux sens : le nourricier (muqit de qut/nourriture) et le puissant temoin."
  },

  // ===================== AL-HASIB =====================
  'al-hasib': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 4, ayah: 6, name_in_verse: true, note_fr: "\"Allah suffit comme Hasib (comptable).\"" },
      { surah: 4, ayah: 86, name_in_verse: true, note_fr: "\"Allah est sur toute chose Hasib.\"" },
      { surah: 33, ayah: 39, name_in_verse: true, note_fr: "\"Allah suffit comme Hasib.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 4, ayah: 86 },
    scholarly_note_fr: "Al-Hasib a deux sens : Celui qui compte et enregistre tout (de hisab, le compte), et Celui qui suffit a Ses serviteurs (de hasb, suffisance). Al-Qurtubi retient les deux sens comme valides."
  },

  // ===================== AL-JALIL =====================
  'al-jalil': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 55, ayah: 27, name_in_verse: false, note_fr: "\"Seule subsistera la Face de ton Seigneur, plein de majeste (dhul-jalal) et de generosite\" - le concept de jalal, non le Nom Al-Jalil directement." },
      { surah: 7, ayah: 143, name_in_verse: false, note_fr: "\"Quand son Seigneur Se manifesta (tajalla) au mont\" - la racine j-l-l." }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Jalil figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 55, ayah: 27 },
    scholarly_note_fr: "Al-Jalil signifie le Majestueux, possesseur de toute grandeur et majeste. Al-Ghazali explique que la jalala (majeste) combine la perfection des attributs et la transcendance absolue. Le concept apparait dans le Coran sous la forme 'dhul-jalal' (55:27)."
  },

  // ===================== AL-KARIM =====================
  'al-karim': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 82, ayah: 6, name_in_verse: true, note_fr: "\"O homme, qu'est-ce qui t'a trompe au sujet de ton Seigneur Al-Karim ?\"" },
      { surah: 27, ayah: 40, name_in_verse: true, note_fr: "\"Mon Seigneur est Al-Ghani, Al-Karim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 82, ayah: 6 },
    scholarly_note_fr: "Al-Karim signifie le Tres-Genereux, noble dans Son essence et Ses actes. Al-Ghazali explique qu'Il est Celui qui pardonne quand Il peut punir, qui tient Ses promesses, qui donne sans qu'on Lui demande, et dont la generosite n'a aucune limite."
  },

  // ===================== AR-RAQIB =====================
  'ar-raqib': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 5, ayah: 117, name_in_verse: true, note_fr: "\"Et Tu es le Temoin (Ar-Raqib) de toute chose.\" (parole de 'Isa)" },
      { surah: 4, ayah: 1, name_in_verse: true, note_fr: "\"Allah est Ar-Raqib sur vous.\"" },
      { surah: 33, ayah: 52, name_in_verse: true, note_fr: "\"Allah est Ar-Raqib sur toute chose.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 5, ayah: 117 },
    scholarly_note_fr: "Ar-Raqib signifie le Vigilant, Celui qui observe toute chose en permanence sans que rien ne Lui echappe. Al-Ghazali explique que Sa vigilance est eternelle et totale, englobant les actes, les paroles et meme les pensees."
  },

  // ===================== AL-MUJIB =====================
  'al-mujib': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 11, ayah: 61, name_in_verse: true, note_fr: "\"Mon Seigneur est proche et Al-Mujib (Celui qui repond).\" (parole de Salih)" }
    ],
    hadith: [],
    tafsir_verse: { surah: 11, ayah: 61 },
    scholarly_note_fr: "Al-Mujib signifie Celui qui repond aux invocations et exauce les prieres de Ses serviteurs. Al-Ghazali explique qu'Il repond a la necessite de chaque creature, que ce soit par la parole (invocation) ou par l'etat (besoin)."
  },

  // ===================== AL-WASI' =====================
  'al-wasi': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 115, name_in_verse: true, note_fr: "\"Allah est Al-Wasi', Al-'Alim.\"" },
      { surah: 2, ayah: 247, name_in_verse: true, note_fr: "\"Allah est Al-Wasi', Al-'Alim.\"" },
      { surah: 2, ayah: 268, name_in_verse: true, note_fr: "\"Allah est Al-Wasi', Al-'Alim.\"" },
      { surah: 5, ayah: 54, name_in_verse: true, note_fr: "\"C'est la grace d'Allah qu'Il donne a qui Il veut. Allah est Al-Wasi', Al-'Alim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 115 },
    scholarly_note_fr: "Al-Wasi' signifie l'Immense dont la science, la misericorde et la generosite englobent toute chose. Al-Ghazali explique que Sa capacite n'est limitee par rien, que ce soit en science, en pouvoir ou en generosite."
  },

  // ===================== AL-HAKIM =====================
  'al-hakim': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 129, name_in_verse: true, note_fr: "\"Tu es Al-'Aziz, Al-Hakim.\" (invocation d'Ibrahim)" },
      { surah: 2, ayah: 32, name_in_verse: true, note_fr: "\"Gloire a Toi ! Nous ne savons que ce que Tu nous as appris. Tu es Al-'Alim, Al-Hakim.\"" },
      { surah: 3, ayah: 6, name_in_verse: true, note_fr: "\"Nulle divinite autre que Lui, Al-'Aziz, Al-Hakim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 32 },
    scholarly_note_fr: "Al-Hakim signifie le Tres-Sage qui place chaque chose a sa juste place. Al-Ghazali explique deux sens : le Sage dans Ses actes (rien n'est vain dans Sa creation) et Celui qui possede la sagesse (hikma) absolue. Mentionne plus de 90 fois dans le Coran."
  },

  // ===================== AL-WADUD =====================
  'al-wadud': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 11, ayah: 90, name_in_verse: true, note_fr: "\"Mon Seigneur est Al-Ghafur, Al-Wadud.\"" },
      { surah: 85, ayah: 14, name_in_verse: true, note_fr: "\"Et Il est Al-Ghafur, Al-Wadud.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 85, ayah: 14 },
    scholarly_note_fr: "Al-Wadud signifie le Tres-Aimant, Celui qui aime Ses serviteurs pieux et qui est aime d'eux. Al-Ghazali explique qu'Il veut le bien pour toute la creation et manifeste Son amour par Ses bienfaits. Ibn al-Qayyim distingue l'amour divin actif (Il traite Ses serviteurs avec bonte) de l'amour qu'Il inspire."
  },

  // ===================== AL-MAJID (48) =====================
  'al-majid-48': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 11, ayah: 73, name_in_verse: true, note_fr: "\"La misericorde d'Allah et Ses benedictions soient sur vous, gens de cette maison ! Il est Al-Hamid, Al-Majid.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 11, ayah: 73 },
    scholarly_note_fr: "Al-Majid signifie le Glorieux, Celui dont la noblesse et la generosite sont au-dessus de tout. Al-Ghazali explique qu'Al-Majid combine la grandeur (jalala) et la generosite (karam) : il est noble dans Son essence et genereux dans Ses actes."
  },

  // ===================== AL-MAJID (65) =====================
  'al-majid-65': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 85, ayah: 15, name_in_verse: true, note_fr: "\"Le Possesseur du Trone, Al-Majid.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 85, ayah: 15 },
    scholarly_note_fr: "Al-Majid dans ce contexte est lu avec kasra (Majid) comme attribut du Trone ou de son Possesseur. Al-Qurtubi mentionne les deux lectures (Majid/Majid) et les deux sens qui en decoulent."
  },

  // ===================== AL-BA'ITH =====================
  'al-baith': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 22, ayah: 7, name_in_verse: false, note_fr: "\"L'Heure viendra... et Allah ressuscitera (yab'athu) ceux qui sont dans les tombes\" - forme verbale." },
      { surah: 16, ayah: 36, name_in_verse: false, note_fr: "\"Nous avons envoye (ba'athna) dans chaque communaute un Messager.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Ba'ith figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 22, ayah: 7 },
    scholarly_note_fr: "Al-Ba'ith signifie Celui qui ressuscite les morts et envoie les messagers. Al-Ghazali explique deux sens : Celui qui eveille les morts pour le Jugement, et Celui qui suscite les prophetes pour guider l'humanite."
  },

  // ===================== ASH-SHAHID =====================
  'ash-shahid': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 4, ayah: 166, name_in_verse: true, note_fr: "\"Allah est Temoin (Shahid) de ce qu'Il t'a revele.\"" },
      { surah: 5, ayah: 117, name_in_verse: true, note_fr: "\"Et Tu es Temoin (Shahid) de toute chose.\"" },
      { surah: 22, ayah: 17, name_in_verse: true, note_fr: "\"Allah est Temoin (Shahid) de toute chose.\"" },
      { surah: 58, ayah: 6, name_in_verse: true, note_fr: "\"Allah est Temoin (Shahid) de toute chose.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 5, ayah: 117 },
    scholarly_note_fr: "Ash-Shahid signifie le Temoin de toute chose, Celui a qui rien n'echappe. Al-Ghazali explique la difference avec Al-Alim : Ash-Shahid implique une connaissance de ce qui est present et manifeste, tandis que Al-Alim englobe aussi le cache."
  },

  // ===================== AL-HAQQ =====================
  'al-haqq': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 22, ayah: 6, name_in_verse: true, note_fr: "\"C'est parce qu'Allah est Al-Haqq (la Verite).\"" },
      { surah: 22, ayah: 62, name_in_verse: true, note_fr: "\"C'est parce qu'Allah est Al-Haqq, et ce qu'ils invoquent en dehors de Lui est le faux.\"" },
      { surah: 23, ayah: 116, name_in_verse: true, note_fr: "\"Exalte soit Allah, le Souverain, Al-Haqq.\"" },
      { surah: 24, ayah: 25, name_in_verse: true, note_fr: "\"Ils sauront que c'est Allah Al-Haqq, Al-Mubin.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 22, ayah: 62 },
    scholarly_note_fr: "Al-Haqq signifie la Verite absolue, Celui dont l'existence est la plus reelle et la plus certaine. Al-Ghazali explique que tout autre que Lui peut cesser d'exister, mais Son existence est necessaire et eternelle. Ibn al-Qayyim ajoute que Sa parole, Ses actes et Sa rencontre sont tous 'haqq'."
  },

  // ===================== AL-WAKIL =====================
  'al-wakil': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 3, ayah: 173, name_in_verse: true, note_fr: "\"Allah nous suffit, Il est le meilleur Al-Wakil (garant).\"" },
      { surah: 33, ayah: 3, name_in_verse: true, note_fr: "\"Fais confiance a Allah. Allah suffit comme Wakil.\"" },
      { surah: 73, ayah: 9, name_in_verse: true, note_fr: "\"Prends-Le comme Wakil.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 3, ayah: 173 },
    scholarly_note_fr: "Al-Wakil signifie Celui a qui on peut confier toutes ses affaires, le Garant supreme. Al-Ghazali explique que le tawakkul (confiance en Allah) est la consequence directe de la connaissance de ce Nom : celui qui sait qu'Allah est Al-Wakil s'en remet entierement a Lui."
  },

  // ===================== AL-QAWI =====================
  'al-qawi': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 22, ayah: 40, name_in_verse: true, note_fr: "\"Allah est Al-Qawi, Al-'Aziz.\"" },
      { surah: 57, ayah: 25, name_in_verse: true, note_fr: "\"Allah est Al-Qawi, Al-'Aziz.\"" },
      { surah: 58, ayah: 21, name_in_verse: true, note_fr: "\"Allah est Al-Qawi, Al-'Aziz.\"" },
      { surah: 42, ayah: 19, name_in_verse: true, note_fr: "\"Il est Al-Qawi, Al-'Aziz.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 22, ayah: 40 },
    scholarly_note_fr: "Al-Qawi signifie le Tout-Puissant dont la force est absolue et parfaite. Al-Ghazali explique que Sa puissance ne diminue jamais et ne connait aucune faiblesse, contrairement a la force des creatures qui s'epuise. Souvent associe a Al-'Aziz dans le Coran."
  },

  // ===================== AL-MATIN =====================
  'al-matin': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 51, ayah: 58, name_in_verse: true, note_fr: "\"C'est Allah qui est Ar-Razzaq, le Detenteur de la force, Al-Matin.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 51, ayah: 58 },
    scholarly_note_fr: "Al-Matin signifie le Tres-Ferme, Celui dont la force est inepuisable et ne souffre d'aucune fatigue. Al-Ghazali explique que ce Nom renforce Al-Qawi : non seulement Il est fort, mais Sa force est immuable et ne connait ni changement ni affaiblissement."
  },

  // ===================== AL-WALI (55) =====================
  'al-wali-55': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 42, ayah: 28, name_in_verse: true, note_fr: "\"C'est Lui Al-Wali (le Protecteur), Al-Hamid.\"" },
      { surah: 2, ayah: 257, name_in_verse: true, note_fr: "\"Allah est le Wali (Protecteur) de ceux qui ont cru.\"" },
      { surah: 3, ayah: 68, name_in_verse: true, note_fr: "\"Allah est le Wali des croyants.\"" },
      { surah: 45, ayah: 19, name_in_verse: true, note_fr: "\"Allah est le Wali des pieux.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 42, ayah: 28 },
    scholarly_note_fr: "Al-Wali signifie le Protecteur, l'Allie de Ses serviteurs croyants. Al-Ghazali explique qu'Il prend en charge les affaires de Ses serviteurs, les guide, les soutient et les defend. La wilaya (protection divine) est le fruit de la foi et de l'obeissance."
  },

  // ===================== AL-WALI (76) =====================
  'al-wali-76': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 13, ayah: 11, name_in_verse: false, note_fr: "\"Ils n'ont en dehors d'Allah aucun protecteur (wali)\" - concept de wilaya/autorite." }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Wali figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 13, ayah: 11 },
    scholarly_note_fr: "Al-Wali au sens de Celui qui gouverne et administre toutes les affaires de la creation. Se distingue du sens precedent (Protecteur des croyants) par l'aspect d'autorite et d'administration universelle sur l'ensemble de la creation."
  },

  // ===================== AL-HAMID =====================
  'al-hamid': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 14, ayah: 1, name_in_verse: true, note_fr: "\"Le chemin d'Allah... Al-'Aziz, Al-Hamid.\"" },
      { surah: 42, ayah: 28, name_in_verse: true, note_fr: "\"C'est Lui Al-Wali, Al-Hamid.\"" },
      { surah: 31, ayah: 26, name_in_verse: true, note_fr: "\"Allah est Al-Ghani, Al-Hamid.\"" },
      { surah: 85, ayah: 8, name_in_verse: true, note_fr: "\"Allah Al-'Aziz, Al-Hamid.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 14, ayah: 1 },
    scholarly_note_fr: "Al-Hamid signifie Celui qui est digne de toute louange par Son essence, Ses attributs et Ses actes. Al-Ghazali explique qu'Il est loue meme si personne ne Le loue, car la louange Lui est due par Sa perfection meme."
  },

  // ===================== AL-MUHSI =====================
  'al-muhsi': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 72, ayah: 28, name_in_verse: false, note_fr: "\"Il a denombre (ahsa) toute chose en nombre.\"" },
      { surah: 78, ayah: 29, name_in_verse: false, note_fr: "\"Et toute chose, Nous l'avons denombree (ahsaynahu) en ecrit.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Muhsi figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 72, ayah: 28 },
    scholarly_note_fr: "Al-Muhsi signifie Celui qui denombre et connait precisement le nombre de toute chose dans la creation, sans que rien ne Lui echappe. Al-Ghazali explique que Sa connaissance englobe le nombre des gouttes de pluie, des grains de sable et des feuilles des arbres."
  },

  // ===================== AL-MUBDI' =====================
  'al-mubdi': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 10, ayah: 4, name_in_verse: false, note_fr: "\"C'est Lui qui commence (yabda'u) la creation puis la refait.\"" },
      { surah: 85, ayah: 13, name_in_verse: false, note_fr: "\"C'est Lui qui commence (yubdi'u) et refait.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Mubdi' figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 85, ayah: 13 },
    scholarly_note_fr: "Al-Mubdi' signifie Celui qui a initie la creation a partir du neant, sans modele prealable. Al-Ghazali explique qu'Il est l'Initiateur absolu, et que la premiere creation est la preuve de Sa capacite a la refaire (resurrection)."
  },

  // ===================== AL-MU'ID =====================
  'al-muid': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 10, ayah: 4, name_in_verse: false, note_fr: "\"C'est Lui qui commence la creation puis la refait (yu'iduha).\"" },
      { surah: 85, ayah: 13, name_in_verse: false, note_fr: "\"C'est Lui qui commence et refait (yu'idu).\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Mu'id figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 85, ayah: 13 },
    scholarly_note_fr: "Al-Mu'id signifie Celui qui recree apres l'aneantissement, ramenant les creatures a l'existence pour le Jugement. Al-Ghazali lie ce Nom a la resurrection : comme Il a cree la premiere fois, Il recreera pour le Jour Dernier."
  },

  // ===================== AL-MUHYI =====================
  'al-muhyi': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 30, ayah: 50, name_in_verse: false, note_fr: "\"Regarde les traces de la misericorde d'Allah, comment Il redonne la vie (yuhyi) a la terre apres sa mort.\"" },
      { surah: 41, ayah: 39, name_in_verse: false, note_fr: "\"Celui qui l'a vivifiee (ahyaha) est Celui qui redonne la vie aux morts.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Muhyi figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 30, ayah: 50 },
    scholarly_note_fr: "Al-Muhyi signifie Celui qui donne la vie, tant physique (creation des etres vivants) que spirituelle (guidee des coeurs). Al-Ghazali explique qu'Il vivifie les corps par les ames et les coeurs par la connaissance."
  },

  // ===================== AL-MUMIT =====================
  'al-mumit': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 7, ayah: 158, name_in_verse: false, note_fr: "\"C'est Lui qui donne la vie et donne la mort (yumitu).\"" },
      { surah: 57, ayah: 2, name_in_verse: false, note_fr: "\"A Lui la royaute des cieux et de la terre. Il donne la vie et donne la mort (yumitu).\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Mumit figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 57, ayah: 2 },
    scholarly_note_fr: "Al-Mumit signifie Celui qui cause la mort. Al-Ghazali explique que la mort n'est pas un aneantissement mais un transfert d'un etat a un autre. Il donne la vie et la reprend selon Son decret, et personne ne meurt sans Sa permission."
  },

  // ===================== AL-HAYY =====================
  'al-hayy': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 255, name_in_verse: true, note_fr: "\"Allah ! Nulle divinite autre que Lui, Al-Hayy, Al-Qayyum.\" (Ayat al-Kursi)" },
      { surah: 3, ayah: 2, name_in_verse: true, note_fr: "\"Allah ! Nulle divinite autre que Lui, Al-Hayy, Al-Qayyum.\"" },
      { surah: 20, ayah: 111, name_in_verse: true, note_fr: "\"Les visages s'humilieront devant Al-Hayy, Al-Qayyum.\"" },
      { surah: 25, ayah: 58, name_in_verse: true, note_fr: "\"Mets ta confiance en Al-Hayy qui ne meurt pas.\"" },
      { surah: 40, ayah: 65, name_in_verse: true, note_fr: "\"C'est Lui Al-Hayy. Nulle divinite autre que Lui.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3524', grading: 'Hasan', note_fr: "\"Ya Hayyu ya Qayyum, par Ta misericorde j'implore le secours.\"" }
    ],
    tafsir_verse: { surah: 2, ayah: 255 },
    scholarly_note_fr: "Al-Hayy signifie le Vivant eternel dont la vie est parfaite, sans debut ni fin. Al-Ghazali explique que c'est un des deux Noms pivots (avec Al-Qayyum) sur lesquels reposent tous les autres attributs : la science, la puissance, la volonte presupposent la vie."
  },

  // ===================== AL-QAYYUM =====================
  'al-qayyum': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 255, name_in_verse: true, note_fr: "\"Allah ! Nulle divinite autre que Lui, Al-Hayy, Al-Qayyum.\" (Ayat al-Kursi)" },
      { surah: 3, ayah: 2, name_in_verse: true, note_fr: "\"Allah ! Nulle divinite autre que Lui, Al-Hayy, Al-Qayyum.\"" },
      { surah: 20, ayah: 111, name_in_verse: true, note_fr: "\"Les visages s'humilieront devant Al-Hayy, Al-Qayyum.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3524', grading: 'Hasan', note_fr: "\"Ya Hayyu ya Qayyum...\"" }
    ],
    tafsir_verse: { surah: 2, ayah: 255 },
    scholarly_note_fr: "Al-Qayyum signifie Celui qui subsiste par Lui-meme et par qui toute chose subsiste. Ibn al-Qayyim considere que Al-Hayy Al-Qayyum est le plus grand Nom d'Allah (Ism Allah al-A'zam). Al-Ghazali explique qu'Il maintient l'existence de toute la creation a chaque instant."
  },

  // ===================== AL-WAJID =====================
  'al-wajid': {
    evidence_type: 'hadith_primary',
    quran: [],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Wajid figure dans la liste des 99 noms." }
    ],
    tafsir_verse: null,
    scholarly_note_fr: "Al-Wajid signifie Celui qui possede tout et ne manque de rien (de wujud/abondance), ou Celui qui trouve tout ce qu'Il veut sans difficulte. Al-Ghazali explique qu'aucun besoin ne Lui echappe et qu'Il n'est jamais dans le manque."
  },

  // ===================== AL-WAHID =====================
  'al-wahid': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 163, name_in_verse: true, note_fr: "\"Votre Dieu est un Dieu unique (wahid). Nulle divinite autre que Lui.\"" },
      { surah: 13, ayah: 16, name_in_verse: true, note_fr: "\"Dis : Allah est le Createur de toute chose, Il est Al-Wahid, Al-Qahhar.\"" },
      { surah: 38, ayah: 65, name_in_verse: true, note_fr: "\"Il n'y a de divinite qu'Allah, Al-Wahid, Al-Qahhar.\"" },
      { surah: 14, ayah: 48, name_in_verse: true, note_fr: "\"Et comparaitront devant Allah, Al-Wahid, Al-Qahhar.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 163 },
    scholarly_note_fr: "Al-Wahid signifie l'Unique, Celui qui n'a aucun associe, aucun semblable et aucun egal. Al-Ghazali explique que Son unicite est absolue : dans Son essence (pas de parties), dans Ses attributs (rien de semblable) et dans Ses actes (aucun partenaire)."
  },

  // ===================== AS-SAMAD =====================
  'as-samad': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 112, ayah: 2, name_in_verse: true, note_fr: "\"Allah, As-Samad.\" Sourate Al-Ikhlas." }
    ],
    hadith: [],
    tafsir_verse: { surah: 112, ayah: 2 },
    scholarly_note_fr: "As-Samad signifie Celui vers qui toute la creation se tourne dans ses besoins, et qui ne depend de rien ni de personne. Al-Qurtubi rapporte qu'Ibn 'Abbas l'a defini comme le Maitre parfait en seigneurie, le Noble parfait en noblesse, le Grand parfait en grandeur."
  },

  // ===================== AL-QADIR =====================
  'al-qadir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 6, ayah: 65, name_in_verse: true, note_fr: "\"Dis : Il est Al-Qadir (Capable) de vous envoyer un chatiment.\"" },
      { surah: 17, ayah: 99, name_in_verse: true, note_fr: "\"N'ont-ils pas vu qu'Allah qui a cree les cieux et la terre est Al-Qadir pour creer leurs semblables ?\"" },
      { surah: 46, ayah: 33, name_in_verse: true, note_fr: "\"N'ont-ils pas vu qu'Allah qui a cree les cieux et la terre... est Al-Qadir pour redonner la vie aux morts ?\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 6, ayah: 65 },
    scholarly_note_fr: "Al-Qadir signifie le Tout-Puissant qui peut faire tout ce qu'Il veut. Al-Ghazali explique que Sa puissance est liee a Sa volonte : tout ce qu'Il veut se realise, et rien ne peut L'empecher d'accomplir ce qu'Il decide."
  },

  // ===================== AL-MUQTADIR =====================
  'al-muqtadir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 18, ayah: 45, name_in_verse: true, note_fr: "\"Allah est sur toute chose Al-Muqtadir.\"" },
      { surah: 54, ayah: 42, name_in_verse: true, note_fr: "\"Nous les avons saisis d'une prise d'un Al-'Aziz, Al-Muqtadir.\"" },
      { surah: 54, ayah: 55, name_in_verse: true, note_fr: "\"Aupres d'un Souverain Al-Muqtadir.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 54, ayah: 42 },
    scholarly_note_fr: "Al-Muqtadir est une forme intensive de Al-Qadir, signifiant Celui dont la puissance est absolue et qui l'exerce pleinement. Al-Ghazali note que la forme ifti'al (muqtadir) indique une puissance activement deployee."
  },

  // ===================== AL-MUQADDIM =====================
  'al-muqaddim': {
    evidence_type: 'hadith_primary',
    quran: [],
    hadith: [
      { collection: 'Sahih Bukhari', number: '1120', grading: 'Sahih', note_fr: "\"Tu es Al-Muqaddim et Al-Mu'akhkhir\" - dans l'invocation nocturne du Prophete." },
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Muqaddim figure dans la liste des 99 noms." }
    ],
    tafsir_verse: null,
    scholarly_note_fr: "Al-Muqaddim signifie Celui qui avance ce qu'Il veut en rang, en temps ou en merite. Al-Ghazali explique qu'Il avance certaines creatures sur d'autres par la noblesse, la science ou la vertu. Cite toujours avec son oppose Al-Mu'akhkhir."
  },

  // ===================== AL-MU'AKHKHIR =====================
  'al-muakhkhir': {
    evidence_type: 'hadith_primary',
    quran: [],
    hadith: [
      { collection: 'Sahih Bukhari', number: '1120', grading: 'Sahih', note_fr: "\"Tu es Al-Muqaddim et Al-Mu'akhkhir\" - dans l'invocation nocturne du Prophete." },
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Mu'akhkhir figure dans la liste des 99 noms." }
    ],
    tafsir_verse: null,
    scholarly_note_fr: "Al-Mu'akhkhir signifie Celui qui retarde ce qu'Il veut par Sa sagesse. Al-Ghazali explique qu'Il retarde les incredules et les desobeissants, et que chaque chose a un terme fixe qu'elle ne peut ni devancer ni retarder."
  },

  // ===================== AL-AWWAL =====================
  'al-awwal': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 57, ayah: 3, name_in_verse: true, note_fr: "\"C'est Lui Al-Awwal et Al-Akhir, Az-Zahir et Al-Batin.\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '2713', grading: 'Sahih', note_fr: "\"Tu es Al-Awwal, rien n'est avant Toi ; Tu es Al-Akhir, rien n'est apres Toi.\"" }
    ],
    tafsir_verse: { surah: 57, ayah: 3 },
    scholarly_note_fr: "Al-Awwal signifie le Premier, Celui qui existe avant toute chose sans commencement. Le Prophete a explique ce Nom dans le hadith de Muslim : 'Tu es Al-Awwal, rien n'est avant Toi.' Ibn al-Qayyim explique que Son anteriorite est absolue et eternelle."
  },

  // ===================== AL-AKHIR =====================
  'al-akhir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 57, ayah: 3, name_in_verse: true, note_fr: "\"C'est Lui Al-Awwal et Al-Akhir, Az-Zahir et Al-Batin.\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '2713', grading: 'Sahih', note_fr: "\"Tu es Al-Akhir, rien n'est apres Toi.\"" }
    ],
    tafsir_verse: { surah: 57, ayah: 3 },
    scholarly_note_fr: "Al-Akhir signifie le Dernier, Celui qui subsiste apres la disparition de toute chose. Comme l'explique le hadith de Muslim, rien ne subsistera apres Lui. Ibn Taymiyyah explique que Sa posteriorite n'est pas temporelle mais essentielle."
  },

  // ===================== AZ-ZAHIR =====================
  'az-zahir': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 57, ayah: 3, name_in_verse: true, note_fr: "\"C'est Lui Al-Awwal et Al-Akhir, Az-Zahir et Al-Batin.\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '2713', grading: 'Sahih', note_fr: "\"Tu es Az-Zahir, rien n'est au-dessus de Toi.\"" }
    ],
    tafsir_verse: { surah: 57, ayah: 3 },
    scholarly_note_fr: "Az-Zahir signifie le Manifeste, Celui qui est au-dessus de toute chose. Le hadith de Muslim explique : 'rien n'est au-dessus de Toi.' Al-Ghazali note que Sa manifestation se voit dans les signes de la creation, bien que Son essence echappe aux regards."
  },

  // ===================== AL-BATIN =====================
  'al-batin': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 57, ayah: 3, name_in_verse: true, note_fr: "\"C'est Lui Al-Awwal et Al-Akhir, Az-Zahir et Al-Batin.\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '2713', grading: 'Sahih', note_fr: "\"Tu es Al-Batin, rien n'est en dessous de Toi (plus proche que Toi).\"" }
    ],
    tafsir_verse: { surah: 57, ayah: 3 },
    scholarly_note_fr: "Al-Batin signifie le Cache, Celui dont l'essence echappe aux perceptions. Le hadith de Muslim explique : 'rien n'est plus proche que Toi.' Al-Ghazali reconcilie Az-Zahir et Al-Batin : Il est manifeste par Ses signes mais cache dans Son essence."
  },

  // ===================== AL-MUTA'ALI =====================
  'al-mutaali': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 13, ayah: 9, name_in_verse: true, note_fr: "\"Le Connaisseur de l'invisible et du visible, Al-Kabir, Al-Muta'ali.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 13, ayah: 9 },
    scholarly_note_fr: "Al-Muta'ali signifie le Tres-Exalte, Celui qui est au-dessus de tout ce que les creatures peuvent imaginer ou decrire. Al-Ghazali explique qu'Il transcende toute description, toute comparaison et toute limitation humaine."
  },

  // ===================== AL-BARR =====================
  'al-barr': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 52, ayah: 28, name_in_verse: true, note_fr: "\"Nous L'invoquions avant. C'est Lui Al-Barr, Ar-Rahim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 52, ayah: 28 },
    scholarly_note_fr: "Al-Barr signifie le Bienfaisant, Celui dont la bonte et la bienfaisance s'etendent a toute la creation. Al-Ghazali explique qu'Il est Celui qui fait le bien (ihsan) a Ses creatures de maniere continue et dont la generosite ne tarit jamais."
  },

  // ===================== AT-TAWWAB =====================
  'at-tawwab': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 37, name_in_verse: true, note_fr: "\"Il accepta son repentir (taba 'alayhi). C'est Lui At-Tawwab, Ar-Rahim.\" (a propos d'Adam)" },
      { surah: 2, ayah: 128, name_in_verse: true, note_fr: "\"Accepte notre repentir. Tu es At-Tawwab, Ar-Rahim.\" (invocation d'Ibrahim)" },
      { surah: 9, ayah: 104, name_in_verse: true, note_fr: "\"N'ont-ils pas su qu'Allah accepte le repentir... et qu'Allah est At-Tawwab, Ar-Rahim ?\"" },
      { surah: 9, ayah: 118, name_in_verse: true, note_fr: "\"Puis Il accepta leur repentir... Allah est At-Tawwab, Ar-Rahim.\"" },
      { surah: 110, ayah: 3, name_in_verse: true, note_fr: "\"Il est At-Tawwab.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 37 },
    scholarly_note_fr: "At-Tawwab signifie Celui qui accepte le repentir de maniere repetee et abondante. Al-Ghazali explique un double sens : Il inspire d'abord le repentir au pecheur (tawba initiale), puis accepte ce repentir (tawba en reponse). La forme fa''al indique l'intensite et la repetition."
  },

  // ===================== AL-MUNTAQIM =====================
  'al-muntaqim': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 32, ayah: 22, name_in_verse: true, note_fr: "\"Nous nous vengerons (muntaqimun) des criminels.\"" },
      { surah: 43, ayah: 41, name_in_verse: true, note_fr: "\"Nous nous vengerons (muntaqimun) d'eux.\"" },
      { surah: 44, ayah: 16, name_in_verse: true, note_fr: "\"Le jour ou Nous saisirons avec la plus grande violence, Nous serons certes Muntaqimun.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 32, ayah: 22 },
    scholarly_note_fr: "Al-Muntaqim signifie Celui qui chatie les pecheurs et les oppresseurs avec justice. Al-Ghazali explique que Sa vengeance n'est pas motivee par la colere comme chez les humains, mais par la justice et la sagesse. C'est un attribut de rigueur (jalal)."
  },

  // ===================== AL-'AFUW =====================
  'al-afuw': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 4, ayah: 43, name_in_verse: true, note_fr: "\"Allah est Al-'Afuw, Al-Ghafur.\"" },
      { surah: 4, ayah: 149, name_in_verse: true, note_fr: "\"Allah est Al-'Afuw, Al-Qadir.\"" },
      { surah: 22, ayah: 60, name_in_verse: true, note_fr: "\"Allah est Al-'Afuw, Al-Ghafur.\"" },
      { surah: 58, ayah: 2, name_in_verse: true, note_fr: "\"Allah est Al-'Afuw, Al-Ghafur.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3513', grading: 'Sahih', note_fr: "\"O Allah, Tu es 'Afuw, Tu aimes le pardon, alors pardonne-moi.\" (invocation de Laylat al-Qadr)" }
    ],
    tafsir_verse: { surah: 4, ayah: 149 },
    scholarly_note_fr: "Al-'Afuw signifie Celui qui efface les peches completement. Al-Ghazali explique la difference avec Al-Ghafur : Al-Ghafur couvre le peche (il reste dans le registre), tandis que Al-'Afuw l'efface totalement comme s'il n'avait jamais existe."
  },

  // ===================== AR-RA'UF =====================
  'ar-rauf': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 143, name_in_verse: true, note_fr: "\"Allah est envers les gens Ra'uf, Rahim.\"" },
      { surah: 3, ayah: 30, name_in_verse: true, note_fr: "\"Allah est Ra'uf envers les serviteurs.\"" },
      { surah: 9, ayah: 117, name_in_verse: true, note_fr: "\"Il est envers eux Ra'uf, Rahim.\"" },
      { surah: 59, ayah: 10, name_in_verse: true, note_fr: "\"Tu es Ra'uf, Rahim.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 143 },
    scholarly_note_fr: "Ar-Ra'uf signifie le Tres-Compatissant, dont la compassion va au-dela de la misericorde ordinaire. Al-Qurtubi explique que Ar-Ra'uf est plus intense que Ar-Rahim dans l'aspect d'attendrissement et de douceur. C'est la misericorde teintee de tendresse."
  },

  // ===================== MALIK AL-MULK =====================
  'malik-ul-mulk': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 3, ayah: 26, name_in_verse: true, note_fr: "\"Dis : O Allah, Maitre de la royaute (Malik al-Mulk), Tu donnes la royaute a qui Tu veux...\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 3, ayah: 26 },
    scholarly_note_fr: "Malik al-Mulk signifie le Possesseur de la royaute absolue, Celui a qui appartient toute souverainete. Al-Ghazali explique qu'Il distribue la royaute comme Il veut et la retire a qui Il veut, et que toute royaute terrestre n'est qu'un pret temporaire."
  },

  // ===================== DHUL-JALALI WAL-IKRAM =====================
  'dhul-jalali-wal-ikram': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 55, ayah: 27, name_in_verse: true, note_fr: "\"Seule subsistera la Face de ton Seigneur, Dhul-Jalali wal-Ikram.\"" },
      { surah: 55, ayah: 78, name_in_verse: true, note_fr: "\"Beni soit le Nom de ton Seigneur, Dhul-Jalali wal-Ikram.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3524', grading: 'Hasan', note_fr: "\"Perseverez avec 'Ya Dhal-Jalali wal-Ikram'.\"" }
    ],
    tafsir_verse: { surah: 55, ayah: 27 },
    scholarly_note_fr: "Dhul-Jalali wal-Ikram signifie le Possesseur de la majeste et de la generosite. Al-Ghazali explique que jalal (majeste) renvoie aux attributs de grandeur et de transcendance, tandis que ikram (generosite) renvoie aux attributs de beaute et de bienveillance."
  },

  // ===================== AL-MUQSIT =====================
  'al-muqsit': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 3, ayah: 18, name_in_verse: false, note_fr: "\"Qa'iman bil-qist (Maintenant la justice)\" - concept de qist, non le Nom directement." },
      { surah: 21, ayah: 47, name_in_verse: false, note_fr: "\"Nous placerons les balances de la justice (al-qist) pour le Jour de la Resurrection.\"" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '2588', grading: 'Sahih', note_fr: "\"Les equitables (al-muqsitun) seront sur des chaires de lumiere aupres d'Allah.\"" },
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Muqsit figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 3, ayah: 18 },
    scholarly_note_fr: "Al-Muqsit signifie le Tres-Equitable, Celui qui juge avec une justice parfaite. Al-Ghazali explique que ce Nom est lie au Jour du Jugement ou aucune injustice ne sera commise, meme du poids d'un atome."
  },

  // ===================== AL-JAMI' =====================
  'al-jami': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 3, ayah: 9, name_in_verse: true, note_fr: "\"Notre Seigneur, Tu es Jami' (le Rassembleur) des gens pour un Jour au sujet duquel il n'y a pas de doute.\"" },
      { surah: 4, ayah: 140, name_in_verse: true, note_fr: "\"Allah est Jami' (le Rassembleur) des hypocrites et des incredules en Enfer.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 3, ayah: 9 },
    scholarly_note_fr: "Al-Jami' signifie le Rassembleur, Celui qui rassemblera toutes les creatures pour le Jugement Dernier. Al-Ghazali ajoute un sens plus large : Celui qui reunit les contraires dans Sa creation (la nuit et le jour, le chaud et le froid), harmonisant l'ensemble."
  },

  // ===================== AL-GHANI =====================
  'al-ghani': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 263, name_in_verse: true, note_fr: "\"Allah est Al-Ghani, Al-Halim.\"" },
      { surah: 3, ayah: 97, name_in_verse: true, note_fr: "\"Allah est Al-Ghani vis-a-vis des mondes.\"" },
      { surah: 35, ayah: 15, name_in_verse: true, note_fr: "\"O gens, vous etes les pauvres envers Allah, et Allah est Al-Ghani, Al-Hamid.\"" },
      { surah: 47, ayah: 38, name_in_verse: true, note_fr: "\"Allah est Al-Ghani et vous etes les pauvres.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 35, ayah: 15 },
    scholarly_note_fr: "Al-Ghani signifie le Riche par essence, Celui qui n'a besoin de rien ni de personne, tandis que toute la creation a besoin de Lui. Al-Ghazali explique que la vraie richesse est l'absence totale de besoin, et seul Allah possede cette qualite de maniere absolue."
  },

  // ===================== AL-MUGHNI =====================
  'al-mughni': {
    evidence_type: 'hadith_primary',
    quran: [
      { surah: 9, ayah: 28, name_in_verse: false, note_fr: "\"Allah vous enrichira (yughnikum) de Sa grace\" - forme verbale." },
      { surah: 4, ayah: 130, name_in_verse: false, note_fr: "\"Allah enrichira (yughni) chacun de Sa largesse.\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Mughni figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 9, ayah: 28 },
    scholarly_note_fr: "Al-Mughni signifie Celui qui enrichit Ses creatures et les rend autonomes. Al-Ghazali explique qu'Il enrichit les corps par la nourriture, les ames par la connaissance, et les coeurs par la foi. L'enrichissement veritable est celui de l'ame."
  },

  // ===================== AL-MANI' =====================
  'al-mani': {
    evidence_type: 'hadith_primary',
    quran: [],
    hadith: [
      { collection: 'Sahih Muslim', number: '713', grading: 'Sahih', note_fr: "\"Nul ne donne ce que Tu empeches (mana'ta) et nul n'empeche ce que Tu donnes\" (invocation apres la priere)." },
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Mani' figure dans la liste des 99 noms." }
    ],
    tafsir_verse: null,
    scholarly_note_fr: "Al-Mani' signifie Celui qui empeche et retient selon Sa sagesse. Al-Ghazali explique que parfois Il empeche une chose en apparence bonne pour proteger Son serviteur d'un mal cache, et que Son empechement est en realite un don deguise."
  },

  // ===================== AD-DARR =====================
  'ad-darr': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 6, ayah: 17, name_in_verse: false, note_fr: "\"Si Allah te touche d'un malheur (bi-durr), nul ne peut le dissiper sauf Lui\" - concept, non le Nom." },
      { surah: 48, ayah: 11, name_in_verse: false, note_fr: "\"Qui peut pour vous quelque chose contre Allah, s'Il veut un mal (darr) pour vous ?\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Ad-Darr figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 6, ayah: 17 },
    scholarly_note_fr: "Ad-Darr signifie Celui qui decrete l'epreuve comme test pour Ses serviteurs. Al-Ghazali note que ce Nom est toujours cite avec An-Nafi' (Celui qui profite) : le bien et le mal viennent tous deux d'Allah par Sa sagesse, et l'epreuve peut etre un bienfait deguise."
  },

  // ===================== AN-NAFI' =====================
  'an-nafi': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 10, ayah: 49, name_in_verse: false, note_fr: "\"Je ne possede pour moi-meme ni profit (naf') ni nuisance (darr) sauf ce qu'Allah veut.\"" },
      { surah: 48, ayah: 11, name_in_verse: false, note_fr: "\"Ou s'Il veut un bien (naf') pour vous\" - concept lie." }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom An-Nafi' figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 10, ayah: 49 },
    scholarly_note_fr: "An-Nafi' signifie Celui qui accorde le benefice et le profit. Al-Ghazali explique que tout bien qui atteint une creature provient d'Allah, et que personne ne peut procurer de veritable bienfait independamment de Sa volonte."
  },

  // ===================== AN-NUR =====================
  'an-nur': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 24, ayah: 35, name_in_verse: true, note_fr: "\"Allah est la Lumiere (Nur) des cieux et de la terre.\" (Ayat an-Nur)" }
    ],
    hadith: [
      { collection: 'Sahih Muslim', number: '179', grading: 'Sahih', note_fr: "\"Son voile est la lumiere (nur). S'Il le levait, les splendeurs de Sa Face bruleraient toute chose.\"" }
    ],
    tafsir_verse: { surah: 24, ayah: 35 },
    scholarly_note_fr: "An-Nur signifie la Lumiere, Celui par qui tout est eclaire et rendu visible. Al-Ghazali explique qu'Il est la Lumiere veritable par laquelle toute chose devient visible, et que toute lumiere dans l'univers n'est qu'un reflet de Sa lumiere."
  },

  // ===================== AL-HADI =====================
  'al-hadi': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 22, ayah: 54, name_in_verse: true, note_fr: "\"Allah est certes Al-Hadi (le Guide) de ceux qui ont cru vers un droit chemin.\"" },
      { surah: 25, ayah: 31, name_in_verse: true, note_fr: "\"Ton Seigneur suffit comme Hadi (Guide) et Secoureur.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 22, ayah: 54 },
    scholarly_note_fr: "Al-Hadi signifie le Guide, Celui qui montre le chemin de la verite et y conduit Ses serviteurs. Al-Ghazali distingue la guidee generale (montrer le chemin a tous) et la guidee specifique (accorder le succes aux croyants pour suivre le chemin)."
  },

  // ===================== AL-BADI' =====================
  'al-badi': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 2, ayah: 117, name_in_verse: true, note_fr: "\"Badi' (le Createur originel) des cieux et de la terre.\"" },
      { surah: 6, ayah: 101, name_in_verse: true, note_fr: "\"Badi' des cieux et de la terre.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 2, ayah: 117 },
    scholarly_note_fr: "Al-Badi' signifie le Createur originel qui a produit les cieux et la terre sans modele prealable. Al-Ghazali explique que ce Nom implique une originalite absolue : Il invente de maniere inedite, sans copier ni imiter."
  },

  // ===================== AL-BAQI =====================
  'al-baqi': {
    evidence_type: 'quran_derived',
    quran: [
      { surah: 55, ayah: 27, name_in_verse: false, note_fr: "\"Et subsiste (yabqa) la Face de ton Seigneur, plein de majeste et de generosite\" - forme verbale." },
      { surah: 20, ayah: 73, name_in_verse: false, note_fr: "\"Et Allah est meilleur et plus durable (abqa).\"" }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Al-Baqi figure dans la liste des 99 noms." }
    ],
    tafsir_verse: { surah: 55, ayah: 27 },
    scholarly_note_fr: "Al-Baqi signifie l'Eternel, Celui qui subsiste sans fin. Al-Ghazali explique que toute chose est perissable sauf Lui. Sa permanence est essentielle : Il ne peut cesser d'exister, contrairement aux creatures dont l'existence est contingente."
  },

  // ===================== AL-WARITH =====================
  'al-warith': {
    evidence_type: 'quran_direct',
    quran: [
      { surah: 15, ayah: 23, name_in_verse: true, note_fr: "\"C'est Nous qui donnons la vie et donnons la mort, et c'est Nous les Heritiers (al-warithun).\"" },
      { surah: 19, ayah: 40, name_in_verse: true, note_fr: "\"C'est Nous qui heriterons (narithu) de la terre et de tout ce qui s'y trouve.\"" }
    ],
    hadith: [],
    tafsir_verse: { surah: 15, ayah: 23 },
    scholarly_note_fr: "Al-Warith signifie l'Heritier, Celui a qui revient toute chose apres la disparition de ses possesseurs temporaires. Al-Ghazali explique que la possession des creatures est ephemere ; apres leur mort, tout revient a son Proprietaire veritable."
  },

  // ===================== AR-RASHID =====================
  'ar-rashid': {
    evidence_type: 'hadith_primary',
    quran: [
      { surah: 11, ayah: 87, name_in_verse: false, note_fr: "ATTENTION : le mot 'ar-rashid' dans ce verset est prononce par les mecreants de Madyan pour se moquer de Shu'ayb. Ce N'EST PAS un attribut divin dans ce contexte." }
    ],
    hadith: [
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom Ar-Rashid figure dans la liste des 99 noms." }
    ],
    tafsir_verse: null,
    scholarly_note_fr: "Ar-Rashid signifie le Guide par excellence, Celui dont la sagesse dirige toute chose vers sa finalite parfaite. Ce Nom ne figure PAS dans le Coran comme attribut divin direct (11:87 est une parole moqueuse des mecreants). Il est atteste uniquement dans les listes de hadiths. Al-Ghazali l'explique comme Celui dont les actes atteignent toujours leur but sans aucun defaut."
  },

  // ===================== AS-SABUR =====================
  'as-sabur': {
    evidence_type: 'hadith_primary',
    quran: [
      { surah: 2, ayah: 153, name_in_verse: false, note_fr: "\"O croyants, cherchez secours dans la patience (sabr)\" - le concept de patience est mentionne pour les croyants, non comme Nom divin." }
    ],
    hadith: [
      { collection: 'Sahih Bukhari', number: '6099', grading: 'Sahih', note_fr: "\"Personne n'est plus patient (asbaru) qu'Allah : on Lui attribue un fils et malgre cela Il les nourrit et leur accorde la sante.\"" },
      { collection: 'Tirmidhi', number: '3507', grading: "Da'if (isnad)", note_fr: "Le nom As-Sabur figure dans la liste des 99 noms." }
    ],
    tafsir_verse: null,
    scholarly_note_fr: "As-Sabur signifie le Tres-Patient, Celui qui ne se hate pas de punir les pecheurs. Ce Nom n'est PAS dans le Coran comme attribut divin direct mais est solidement atteste dans Sahih Bukhari. Al-Ghazali explique que Sa patience n'est pas due a l'impuissance mais a la sagesse et a la misericorde."
  }
};

// ============================================================
// PER-NAME DIRECT URLs - Links that go directly to the
// discussion of each specific Name, not book-level pages
// ============================================================

// dorar.net - Encyclopedie Aqeeda (multi-madhab, pages individuelles par Nom)
// URL: valeur directe (la plupart: /aqeeda/{id}, quelques-uns: /aqadia/{id})
const DORAR_URLS = {
  'allah': 'https://dorar.net/aqeeda/551',
  'ar-rahman': 'https://dorar.net/aqeeda/667',
  'ar-rahim': 'https://dorar.net/aqeeda/667',
  'al-malik': 'https://dorar.net/aqeeda/849',
  'al-quddus': 'https://dorar.net/aqeeda/781',
  'as-salam': 'https://dorar.net/aqeeda/697',
  'al-mumin': 'https://dorar.net/aqeeda/819',
  'al-muhaymin': 'https://dorar.net/aqeeda/875',
  'al-aziz': 'https://dorar.net/aqeeda/737',
  'al-jabbar': 'https://dorar.net/aqeeda/603',
  'al-mutakabbir': 'https://dorar.net/aqeeda/795',
  'al-khaliq': 'https://dorar.net/aqadia/556',
  'al-bari': 'https://dorar.net/aqeeda/567',
  'al-musawwir': 'https://dorar.net/aqeeda/837',
  'al-ghaffar': 'https://dorar.net/aqeeda/841',
  'al-ghafur': 'https://dorar.net/aqeeda/841',
  'al-qahhar': 'https://dorar.net/aqeeda/785',
  'al-wahhab': 'https://dorar.net/aqeeda/895',
  'ar-razzaq': 'https://dorar.net/aqeeda/669',
  'al-fattah': 'https://dorar.net/aqeeda/769',
  'al-alim': 'https://dorar.net/aqeeda/747',
  'al-qabid': 'https://dorar.net/aqeeda/777',
  'al-basit': 'https://dorar.net/aqeeda/577',
  'al-khafid': null,
  'ar-rafi': null,
  'al-muizz': 'https://dorar.net/aqadia/1307',
  'al-mudhill': 'https://dorar.net/aqadia/1307',
  'as-sami': 'https://dorar.net/aqeeda/701',
  'al-basir': 'https://dorar.net/aqeeda/581',
  'al-hakam': 'https://dorar.net/aqeeda/611',
  'al-adl': 'https://dorar.net/aqeeda/735',
  'al-latif': 'https://dorar.net/aqeeda/815',
  'al-khabir': 'https://dorar.net/aqeeda/643',
  'al-halim': 'https://dorar.net/aqeeda/631',
  'al-azim': 'https://dorar.net/aqeeda/743',
  'ash-shakur': 'https://dorar.net/aqeeda/709',
  'al-ali': 'https://dorar.net/aqeeda/749',
  'al-kabir': 'https://dorar.net/aqeeda/797',
  'al-hafiz': 'https://dorar.net/aqeeda/623',
  'al-muqit': 'https://dorar.net/aqeeda/845',
  'al-hasib': 'https://dorar.net/aqeeda/621',
  'al-jalil': 'https://dorar.net/aqeeda/605',
  'al-karim': 'https://dorar.net/aqeeda/801',
  'ar-raqib': 'https://dorar.net/aqeeda/675',
  'al-mujib': 'https://dorar.net/aqeeda/519',
  'al-wasi': 'https://dorar.net/aqeeda/881',
  'al-hakim': 'https://dorar.net/aqeeda/629',
  'al-wadud': 'https://dorar.net/aqeeda/887',
  'al-majid-48': 'https://dorar.net/aqeeda/827',
  'al-majid-65': 'https://dorar.net/aqeeda/827',
  'ash-shahid': 'https://dorar.net/aqeeda/711',
  'al-haqq': 'https://dorar.net/aqeeda/627',
  'al-wakil': 'https://dorar.net/aqeeda/891',
  'al-qawi': 'https://dorar.net/aqeeda/789',
  'al-matin': 'https://dorar.net/aqeeda/825',
  'al-wali-55': 'https://dorar.net/aqeeda/893',
  'al-wali-76': 'https://dorar.net/aqeeda/893',
  'al-hamid': 'https://dorar.net/aqeeda/633',
  'al-muhsi': null,
  'al-mubdi': 'https://dorar.net/aqeeda/515',
  'al-muid': 'https://dorar.net/aqeeda/515',
  'al-muhyi': 'https://dorar.net/aqeeda/831',
  'al-mumit': 'https://dorar.net/aqeeda/831',
  'al-hayy': 'https://dorar.net/aqeeda/641',
  'al-qayyum': 'https://dorar.net/aqeeda/791',
  'al-wajid': null,
  'al-wahid': 'https://dorar.net/aqeeda/877',
  'as-samad': 'https://dorar.net/aqeeda/717',
  'al-qadir': 'https://dorar.net/aqeeda/779',
  'al-muqtadir': 'https://dorar.net/aqeeda/779',
  'al-muqaddim': 'https://dorar.net/aqeeda/597',
  'al-muakhkhir': 'https://dorar.net/aqeeda/597',
  'al-awwal': 'https://dorar.net/aqeeda/561',
  'al-akhir': 'https://dorar.net/aqeeda/513',
  'az-zahir': 'https://dorar.net/aqeeda/729',
  'al-batin': 'https://dorar.net/aqeeda/569',
  'al-mutaali': 'https://dorar.net/aqeeda/749',
  'al-barr': 'https://dorar.net/aqeeda/573',
  'at-tawwab': 'https://dorar.net/aqeeda/601',
  'al-muntaqim': 'https://dorar.net/aqeeda/559',
  'al-afuw': 'https://dorar.net/aqeeda/745',
  'ar-rauf': 'https://dorar.net/aqeeda/657',
  'malik-ul-mulk': 'https://dorar.net/aqeeda/849',
  'dhul-jalali-wal-ikram': 'https://dorar.net/aqeeda/605',
  'al-muqsit': 'https://dorar.net/aqeeda/735',
  'al-jami': null,
  'al-ghani': 'https://dorar.net/aqeeda/763',
  'al-mughni': 'https://dorar.net/aqeeda/763',
  'al-mani': 'https://dorar.net/aqeeda/741',
  'ad-darr': null,
  'an-nafi': null,
  'an-nur': 'https://dorar.net/aqeeda/869',
  'al-hadi': 'https://dorar.net/aqeeda/871',
  'al-badi': 'https://dorar.net/aqeeda/571',
  'al-baqi': 'https://dorar.net/aqeeda/587',
  'al-warith': 'https://dorar.net/aqeeda/879',
  'ar-rashid': null,
  'as-sabur': 'https://dorar.net/aqeeda/713'
};

// islamweb.net - Articles individuels par Nom (serie "Min Asma Allah al-Husna")
// URL: https://www.islamweb.net/ar/article/{ID}
const ISLAMWEB_IDS = {
  'allah': 175061,
  'al-malik': 235801,
  'as-salam': 180813,
  'al-mumin': 176039,
  'al-muhaymin': 180659,
  'al-aziz': 234172,
  'al-jabbar': 229009,
  'al-bari': 180933,
  'al-musawwir': 175889,
  'al-ghaffar': 234517,
  'al-qahhar': 229708,
  'ar-razzaq': 175063,
  'al-fattah': 229432,
  'al-halim': 237157,
  'al-azim': 233974,
  'ash-shakur': null,
  'al-kabir': 232909,
  'al-karim': 235360,
  'ar-raqib': 230659,
  'al-wadud': 236884,
  'al-majid-48': 237595,
  'al-majid-65': 237595,
  'al-wakil': 175455,
  'al-hamid': 238657,
  'al-latif': 233161,
  'al-afuw': 233833,
  'at-tawwab': 232675,
  'al-wahid': 233527,
  'as-samad': 232036,
  'as-sami': 235147,
  'al-hakim': 234643,
  'al-barr': 175231,
  'al-ghani': 175451
};

// islamqa.info - Reponses savantes (perspective hanbali, Ibn Uthaymeen/Ibn Baz)
// URL: https://islamqa.info/ar/answers/{ID}
const ISLAMQA_IDS = {
  'al-aziz': 288103,
  'al-jabbar': 130718,
  'al-halim': 22210,
  'al-hafiz': 22192,
  'al-hasib': 11278,
  'al-muqit': 11220,
  'al-wasi': 11186,
  'al-hakim': 260383,
  'al-latif': 214374,
  'al-matin': 11391,
  'al-qabid': 218084,
  'al-qadir': 205715,
  'al-qayyum': 393714,
  'al-adl': 104488,
  'al-muqsit': 330932,
  'al-majid-48': 328445,
  'al-majid-65': 328445,
  'an-nur': 226255,
  'as-sabur': 191329,
  'ar-rashid': 5457,
  'ad-darr': 84270,
  'an-nafi': 84270,
  'al-mani': 531203,
  'dhul-jalali-wal-ikram': 295726
};

// Fallback: page encyclopedique generale pour les Noms sans page individuelle
const ISLAMQA_GENERAL = 'https://islamqa.info/ar/answers/2594';
const DORAR_GENERAL = 'https://dorar.net/aqadia/523';

// Export everything
module.exports = {
  DATA, COMMON_HADITH, SCHOLARLY_WORKS, TAFSIR,
  DORAR_URLS, ISLAMWEB_IDS, ISLAMQA_IDS,
  ISLAMQA_GENERAL, DORAR_GENERAL
};
