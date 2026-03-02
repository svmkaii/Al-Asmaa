/**
 * Liens directs par Nom d'Allah vers des pages dediees
 * Sources verifiees — fevrier 2026
 *
 * dorar.net  — Encyclopedie Aqeeda (page individuelle par Nom)
 * islamweb.net — Articles savants individuels (serie "Min Asma Allah al-Husna")
 * islamqa.info — Reponses savantes (Ibn Uthaymeen / Comite Permanent)
 */

(function injectDirectLinks() {
  if (typeof ENCYCLOPEDIA_DATA === 'undefined') return;

  // Mapping: id -> { dorar, islamweb, islamqa }
  // dorar: URL directe | islamweb/islamqa: ID d'article/reponse
  var LINKS = {
    1:  { dorar: 'https://dorar.net/aqeeda/667', islamweb: null, islamqa: null },       // Ar-Rahman
    2:  { dorar: 'https://dorar.net/aqeeda/667', islamweb: null, islamqa: null },       // Ar-Rahim
    3:  { dorar: 'https://dorar.net/aqeeda/849', islamweb: 235801, islamqa: null },     // Al-Malik
    4:  { dorar: 'https://dorar.net/aqeeda/781', islamweb: null, islamqa: null },       // Al-Quddus
    5:  { dorar: 'https://dorar.net/aqeeda/697', islamweb: 180813, islamqa: null },     // As-Salam
    6:  { dorar: 'https://dorar.net/aqeeda/819', islamweb: 176039, islamqa: null },     // Al-Mu'min
    7:  { dorar: 'https://dorar.net/aqeeda/875', islamweb: 180659, islamqa: null },     // Al-Muhaymin
    8:  { dorar: 'https://dorar.net/aqeeda/737', islamweb: 234172, islamqa: 288103 },   // Al-Aziz
    9:  { dorar: 'https://dorar.net/aqeeda/603', islamweb: 229009, islamqa: 130718 },   // Al-Jabbar
    10: { dorar: 'https://dorar.net/aqeeda/795', islamweb: null, islamqa: null },       // Al-Mutakabbir
    11: { dorar: 'https://dorar.net/aqeeda/556', islamweb: null, islamqa: null },       // Al-Khaliq
    12: { dorar: 'https://dorar.net/aqeeda/567', islamweb: 180933, islamqa: null },     // Al-Bari
    13: { dorar: 'https://dorar.net/aqeeda/837', islamweb: 175889, islamqa: null },     // Al-Musawwir
    14: { dorar: 'https://dorar.net/aqeeda/841', islamweb: 234517, islamqa: null },     // Al-Ghaffar
    15: { dorar: 'https://dorar.net/aqeeda/785', islamweb: 229708, islamqa: null },     // Al-Qahhar
    16: { dorar: 'https://dorar.net/aqeeda/895', islamweb: null, islamqa: null },       // Al-Wahhab
    17: { dorar: 'https://dorar.net/aqeeda/669', islamweb: 175063, islamqa: null },     // Ar-Razzaq
    18: { dorar: 'https://dorar.net/aqeeda/769', islamweb: 229432, islamqa: null },     // Al-Fattah
    19: { dorar: 'https://dorar.net/aqeeda/747', islamweb: null, islamqa: null },       // Al-Alim
    20: { dorar: 'https://dorar.net/aqeeda/777', islamweb: null, islamqa: 218084 },     // Al-Qabid
    21: { dorar: 'https://dorar.net/aqeeda/577', islamweb: null, islamqa: null },       // Al-Basit
    22: { dorar: null, islamweb: null, islamqa: null },                                  // Al-Khafid
    23: { dorar: null, islamweb: null, islamqa: null },                                  // Ar-Rafi
    24: { dorar: 'https://dorar.net/aqeeda/1307', islamweb: null, islamqa: null },      // Al-Mu'izz
    25: { dorar: 'https://dorar.net/aqeeda/1307', islamweb: null, islamqa: null },      // Al-Mudhill
    26: { dorar: 'https://dorar.net/aqeeda/701', islamweb: 235147, islamqa: null },     // As-Sami
    27: { dorar: 'https://dorar.net/aqeeda/581', islamweb: null, islamqa: null },       // Al-Basir
    28: { dorar: 'https://dorar.net/aqeeda/611', islamweb: null, islamqa: null },       // Al-Hakam
    29: { dorar: 'https://dorar.net/aqeeda/735', islamweb: null, islamqa: 104488 },     // Al-Adl
    30: { dorar: 'https://dorar.net/aqeeda/815', islamweb: 233161, islamqa: 214374 },   // Al-Latif
    31: { dorar: 'https://dorar.net/aqeeda/643', islamweb: null, islamqa: null },       // Al-Khabir
    32: { dorar: 'https://dorar.net/aqeeda/631', islamweb: 237157, islamqa: 22210 },    // Al-Halim
    33: { dorar: 'https://dorar.net/aqeeda/743', islamweb: 233974, islamqa: null },     // Al-Azim
    34: { dorar: 'https://dorar.net/aqeeda/841', islamweb: null, islamqa: null },       // Al-Ghafur
    35: { dorar: 'https://dorar.net/aqeeda/709', islamweb: null, islamqa: null },       // Ash-Shakur
    36: { dorar: 'https://dorar.net/aqeeda/749', islamweb: null, islamqa: null },       // Al-Ali
    37: { dorar: 'https://dorar.net/aqeeda/797', islamweb: 232909, islamqa: null },     // Al-Kabir
    38: { dorar: 'https://dorar.net/aqeeda/623', islamweb: null, islamqa: 22192 },      // Al-Hafiz
    39: { dorar: 'https://dorar.net/aqeeda/845', islamweb: null, islamqa: 11220 },      // Al-Muqit
    40: { dorar: 'https://dorar.net/aqeeda/621', islamweb: null, islamqa: 11278 },      // Al-Hasib
    41: { dorar: 'https://dorar.net/aqeeda/605', islamweb: null, islamqa: null },       // Al-Jalil
    42: { dorar: 'https://dorar.net/aqeeda/801', islamweb: 235360, islamqa: null },     // Al-Karim
    43: { dorar: 'https://dorar.net/aqeeda/675', islamweb: 230659, islamqa: null },     // Ar-Raqib
    44: { dorar: 'https://dorar.net/aqeeda/519', islamweb: null, islamqa: null },       // Al-Mujib
    45: { dorar: 'https://dorar.net/aqeeda/881', islamweb: null, islamqa: 11186 },      // Al-Wasi
    46: { dorar: 'https://dorar.net/aqeeda/629', islamweb: 234643, islamqa: 260383 },   // Al-Hakim
    47: { dorar: 'https://dorar.net/aqeeda/887', islamweb: 236884, islamqa: null },     // Al-Wadud
    48: { dorar: 'https://dorar.net/aqeeda/827', islamweb: 237595, islamqa: 328445 },   // Al-Majid
    49: { dorar: null, islamweb: null, islamqa: null },                                  // Al-Ba'ith
    50: { dorar: 'https://dorar.net/aqeeda/711', islamweb: null, islamqa: null },       // Ash-Shahid
    51: { dorar: 'https://dorar.net/aqeeda/627', islamweb: null, islamqa: null },       // Al-Haqq
    52: { dorar: 'https://dorar.net/aqeeda/891', islamweb: 175455, islamqa: null },     // Al-Wakil
    53: { dorar: 'https://dorar.net/aqeeda/789', islamweb: null, islamqa: null },       // Al-Qawi
    54: { dorar: 'https://dorar.net/aqeeda/825', islamweb: null, islamqa: 11391 },      // Al-Matin
    55: { dorar: 'https://dorar.net/aqeeda/893', islamweb: null, islamqa: null },       // Al-Wali
    56: { dorar: 'https://dorar.net/aqeeda/633', islamweb: 238657, islamqa: null },     // Al-Hamid
    57: { dorar: null, islamweb: null, islamqa: null },                                  // Al-Muhsi
    58: { dorar: 'https://dorar.net/aqeeda/515', islamweb: null, islamqa: null },       // Al-Mubdi
    59: { dorar: 'https://dorar.net/aqeeda/515', islamweb: null, islamqa: null },       // Al-Mu'id
    60: { dorar: 'https://dorar.net/aqeeda/831', islamweb: null, islamqa: null },       // Al-Muhyi
    61: { dorar: 'https://dorar.net/aqeeda/831', islamweb: null, islamqa: null },       // Al-Mumit
    62: { dorar: 'https://dorar.net/aqeeda/641', islamweb: null, islamqa: null },       // Al-Hayy
    63: { dorar: 'https://dorar.net/aqeeda/791', islamweb: null, islamqa: 393714 },     // Al-Qayyum
    64: { dorar: null, islamweb: null, islamqa: null },                                  // Al-Wajid
    65: { dorar: 'https://dorar.net/aqeeda/827', islamweb: 237595, islamqa: 328445 },   // Al-Majid (2)
    66: { dorar: 'https://dorar.net/aqeeda/877', islamweb: 233527, islamqa: null },     // Al-Wahid
    67: { dorar: 'https://dorar.net/aqeeda/717', islamweb: 232036, islamqa: null },     // As-Samad
    68: { dorar: 'https://dorar.net/aqeeda/779', islamweb: null, islamqa: 205715 },     // Al-Qadir
    69: { dorar: 'https://dorar.net/aqeeda/779', islamweb: null, islamqa: null },       // Al-Muqtadir
    70: { dorar: 'https://dorar.net/aqeeda/597', islamweb: null, islamqa: null },       // Al-Muqaddim
    71: { dorar: 'https://dorar.net/aqeeda/597', islamweb: null, islamqa: null },       // Al-Mu'akhkhir
    72: { dorar: 'https://dorar.net/aqeeda/561', islamweb: null, islamqa: null },       // Al-Awwal
    73: { dorar: 'https://dorar.net/aqeeda/513', islamweb: null, islamqa: null },       // Al-Akhir
    74: { dorar: 'https://dorar.net/aqeeda/729', islamweb: null, islamqa: null },       // Az-Zahir
    75: { dorar: 'https://dorar.net/aqeeda/569', islamweb: null, islamqa: null },       // Al-Batin
    76: { dorar: 'https://dorar.net/aqeeda/893', islamweb: null, islamqa: null },       // Al-Wali (2)
    77: { dorar: 'https://dorar.net/aqeeda/749', islamweb: null, islamqa: null },       // Al-Muta'ali
    78: { dorar: 'https://dorar.net/aqeeda/573', islamweb: 175231, islamqa: null },     // Al-Barr
    79: { dorar: 'https://dorar.net/aqeeda/601', islamweb: 232675, islamqa: null },     // At-Tawwab
    80: { dorar: 'https://dorar.net/aqeeda/559', islamweb: null, islamqa: null },       // Al-Muntaqim
    81: { dorar: 'https://dorar.net/aqeeda/745', islamweb: 233833, islamqa: null },     // Al-Afuw
    82: { dorar: 'https://dorar.net/aqeeda/657', islamweb: null, islamqa: null },       // Ar-Ra'uf
    83: { dorar: 'https://dorar.net/aqeeda/849', islamweb: null, islamqa: null },       // Malik-ul-Mulk
    84: { dorar: 'https://dorar.net/aqeeda/605', islamweb: null, islamqa: 295726 },     // Dhul-Jalali wal-Ikram
    85: { dorar: 'https://dorar.net/aqeeda/735', islamweb: null, islamqa: 330932 },     // Al-Muqsit
    86: { dorar: null, islamweb: null, islamqa: null },                                  // Al-Jami
    87: { dorar: 'https://dorar.net/aqeeda/763', islamweb: 175451, islamqa: null },     // Al-Ghani
    88: { dorar: 'https://dorar.net/aqeeda/763', islamweb: null, islamqa: null },       // Al-Mughni
    89: { dorar: 'https://dorar.net/aqeeda/741', islamweb: null, islamqa: 531203 },     // Al-Mani
    90: { dorar: null, islamweb: null, islamqa: 84270 },                                 // Ad-Darr
    91: { dorar: null, islamweb: null, islamqa: 84270 },                                 // An-Nafi
    92: { dorar: 'https://dorar.net/aqeeda/869', islamweb: null, islamqa: 226255 },     // An-Nur
    93: { dorar: 'https://dorar.net/aqeeda/871', islamweb: null, islamqa: null },       // Al-Hadi
    94: { dorar: 'https://dorar.net/aqeeda/571', islamweb: null, islamqa: null },       // Al-Badi
    95: { dorar: 'https://dorar.net/aqeeda/587', islamweb: null, islamqa: null },       // Al-Baqi
    96: { dorar: 'https://dorar.net/aqeeda/879', islamweb: null, islamqa: null },       // Al-Warith
    97: { dorar: null, islamweb: null, islamqa: 5457 },                                  // Ar-Rashid
    98: { dorar: 'https://dorar.net/aqeeda/713', islamweb: null, islamqa: 191329 },     // As-Sabur
    99: { dorar: 'https://dorar.net/aqeeda/551', islamweb: 175061, islamqa: null }      // Allah
  };

  for (var id in LINKS) {
    if (!LINKS.hasOwnProperty(id)) continue;
    var entry = ENCYCLOPEDIA_DATA[id];
    if (!entry) continue;

    var L = LINKS[id];
    if (!entry.sources) entry.sources = [];

    // 1. Ajouter les liens directs dans la section "Sources et references"
    if (L.dorar) {
      entry.sources.push({ label: 'Dorar.net \u2014 Page d\u00e9di\u00e9e \u00e0 ce Nom', url: L.dorar });
    }
    if (L.islamweb) {
      entry.sources.push({ label: 'IslamWeb.net \u2014 Article d\u00e9di\u00e9 \u00e0 ce Nom', url: 'https://www.islamweb.net/fr/article/' + L.islamweb });
    }
    if (L.islamqa) {
      entry.sources.push({ label: 'IslamQA.info \u2014 Explication savante (hanbali)', url: 'https://islamqa.info/fr/answers/' + L.islamqa });
    }

    // 2. Ajouter des commentaires savants supplementaires avec liens directs
    if (!entry.scholarComments) entry.scholarComments = [];

    if (L.dorar) {
      entry.scholarComments.push({
        scholar: 'Encyclop\u00e9die Aqeeda (Dorar.net)',
        title: 'Al-Mawsu\u2019ah al-\u2019Aqadiyyah',

        text: 'Page d\u00e9di\u00e9e \u00e0 ce Nom dans l\u2019encyclop\u00e9die de la croyance de Dorar.net, avec preuves du Coran et de la Sunnah, et avis des savants de diff\u00e9rentes \u00e9coles.',
        links: [{ label: 'Page d\u00e9di\u00e9e', url: L.dorar, lang: 'fr' }]
      });
    }

    if (L.islamweb) {
      entry.scholarComments.push({
        scholar: 'IslamWeb.net',
        title: 'Min Asm\u0101\u2019 All\u0101h al-\u1e24usn\u0101',

        text: 'Article savant d\u00e9taill\u00e9 avec analyse linguistique, preuves coraniques et implications pour la foi.',
        links: [{ label: 'Article d\u00e9di\u00e9 (fran\u00e7ais)', url: 'https://www.islamweb.net/fr/article/' + L.islamweb, lang: 'fr' }]
      });
    }

    if (L.islamqa) {
      entry.scholarComments.push({
        scholar: 'IslamQA.info (Comit\u00e9 Permanent / Ibn Uthaymeen)',
        title: 'Explication savante',
        text: 'R\u00e9ponse savante d\u00e9taill\u00e9e sur ce Nom selon la m\u00e9thodologie des Ahl al-Sunnah.',
        links: [{ label: 'R\u00e9ponse savante (fran\u00e7ais)', url: 'https://islamqa.info/fr/answers/' + L.islamqa, lang: 'fr' }]
      });
    }
  }
})();
