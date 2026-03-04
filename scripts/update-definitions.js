const fs = require('fs');
const path = require('path');

// Définitions améliorées pour les 99 noms d'Allah
const improvedDefinitions = {
  "allah": {
    french_name: "Dieu",
    short_meaning: "Le nom suprême d'Allah qui rassemble tous Ses attributs de perfection."
  },
  "ar-rahman": {
    french_name: "Le Tout Miséricordieux",
    short_meaning: "Celui dont la miséricorde s'étend à toute la création, croyants comme non-croyants."
  },
  "ar-rahim": {
    french_name: "Le Très Miséricordieux",
    short_meaning: "Celui dont la miséricorde particulière est réservée aux croyants dans l'au-delà."
  },
  "al-malik": {
    french_name: "Le Souverain",
    short_meaning: "Le Roi absolu qui possède et gouverne toute la création."
  },
  "al-quddus": {
    french_name: "Le Saint",
    short_meaning: "Celui qui est pur et exempt de tout défaut et de toute imperfection."
  },
  "as-salam": {
    french_name: "La Paix",
    short_meaning: "La source de toute paix, exempt de tout défaut et qui accorde la sécurité."
  },
  "al-mumin": {
    french_name: "Le Garant de la Foi",
    short_meaning: "Celui qui accorde la sécurité à Ses serviteurs et confirme leur foi."
  },
  "al-muhaymin": {
    french_name: "Le Protecteur Suprême",
    short_meaning: "Celui qui veille sur toute chose et protège Sa création avec vigilance."
  },
  "al-aziz": {
    french_name: "Le Tout Puissant",
    short_meaning: "L'Invincible que rien ne peut vaincre ni affaiblir."
  },
  "al-jabbar": {
    french_name: "Le Contraignant",
    short_meaning: "Celui dont la volonté s'impose à toute chose et qui répare les cœurs brisés."
  },
  "al-mutakabbir": {
    french_name: "Le Majestueux",
    short_meaning: "Celui à qui appartient toute grandeur, élevé au-dessus de toute la création."
  },
  "al-khaliq": {
    french_name: "Le Créateur",
    short_meaning: "Celui qui a créé toute chose à partir du néant selon Sa volonté."
  },
  "al-bari": {
    french_name: "Le Producteur",
    short_meaning: "Celui qui fait exister les créatures à partir du néant, sans modèle préalable."
  },
  "al-musawwir": {
    french_name: "Le Façonneur",
    short_meaning: "Celui qui donne à chaque créature sa forme et son apparence uniques."
  },
  "al-ghaffar": {
    french_name: "Le Grand Pardonneur",
    short_meaning: "Celui qui pardonne sans cesse et de manière répétée les péchés de Ses serviteurs."
  },
  "al-qahhar": {
    french_name: "Le Dominateur Suprême",
    short_meaning: "Celui qui domine toute Sa création par Sa puissance absolue."
  },
  "al-wahhab": {
    french_name: "Le Donateur Suprême",
    short_meaning: "Celui qui donne généreusement sans attendre de contrepartie."
  },
  "ar-razzaq": {
    french_name: "Le Pourvoyeur",
    short_meaning: "Celui qui accorde la subsistance à toutes Ses créatures."
  },
  "al-fattah": {
    french_name: "Celui qui ouvre",
    short_meaning: "Celui qui ouvre les portes de la miséricorde et de la subsistance."
  },
  "al-alim": {
    french_name: "L'Omniscient",
    short_meaning: "Celui dont le savoir englobe toute chose, visible et invisible."
  },
  "al-qabid": {
    french_name: "Celui qui retient",
    short_meaning: "Celui qui resserre la subsistance selon Sa sagesse."
  },
  "al-basit": {
    french_name: "Celui qui étend",
    short_meaning: "Celui qui élargit la subsistance et répand Ses bienfaits avec générosité."
  },
  "al-khafid": {
    french_name: "Celui qui abaisse",
    short_meaning: "Celui qui abaisse les orgueilleux et les injustes."
  },
  "ar-rafi": {
    french_name: "Celui qui élève",
    short_meaning: "Celui qui élève en rang Ses serviteurs pieux et sincères."
  },
  "al-muizz": {
    french_name: "Celui qui honore",
    short_meaning: "Celui qui accorde l'honneur et la dignité à qui Il veut."
  },
  "al-mudhill": {
    french_name: "Celui qui humilie",
    short_meaning: "Celui qui humilie les arrogants et les oppresseurs."
  },
  "as-sami": {
    french_name: "L'Audient",
    short_meaning: "Celui qui entend toute chose, le secret comme le public."
  },
  "al-basir": {
    french_name: "Le Clairvoyant",
    short_meaning: "Celui qui voit toute chose, rien n'échappe à Son regard."
  },
  "al-hakam": {
    french_name: "Le Juge",
    short_meaning: "Le Juge suprême dont les décisions sont sans appel et parfaitement justes."
  },
  "al-adl": {
    french_name: "Le Juste",
    short_meaning: "Celui qui est parfaitement équitable et ne commet jamais d'injustice."
  },
  "al-latif": {
    french_name: "Le Subtil Bienveillant",
    short_meaning: "Celui qui connaît les secrets les plus fins et accorde Ses bienfaits avec douceur."
  },
  "al-khabir": {
    french_name: "Le Parfaitement Informé",
    short_meaning: "Celui qui connaît la réalité profonde et les secrets de toute chose."
  },
  "al-halim": {
    french_name: "Le Très Indulgent",
    short_meaning: "Celui qui fait preuve d'une grande patience et ne se hâte pas de punir."
  },
  "al-azim": {
    french_name: "Le Magnifique",
    short_meaning: "Celui dont la grandeur dépasse toute compréhension humaine."
  },
  "al-ghafur": {
    french_name: "Le Pardonneur",
    short_meaning: "Celui qui pardonne abondamment et couvre les fautes de Ses serviteurs."
  },
  "ash-shakur": {
    french_name: "Le Très Reconnaissant",
    short_meaning: "Celui qui récompense généreusement même les plus petits actes de bien."
  },
  "al-ali": {
    french_name: "Le Très Haut",
    short_meaning: "Celui qui est élevé au-dessus de toute Sa création par Son rang et Ses attributs."
  },
  "al-kabir": {
    french_name: "Le Très Grand",
    short_meaning: "Celui dont la grandeur est sans limite, supérieur à toute chose."
  },
  "al-hafiz": {
    french_name: "Le Préservateur",
    short_meaning: "Celui qui préserve et protège toute Sa création."
  },
  "al-muqit": {
    french_name: "Le Nourricier",
    short_meaning: "Celui qui nourrit, soutient et sustente toutes Ses créatures."
  },
  "al-hasib": {
    french_name: "Celui qui compte",
    short_meaning: "Celui qui tient compte de tout et qui suffit à Ses serviteurs."
  },
  "al-jalil": {
    french_name: "Le Majestueux",
    short_meaning: "Celui qui possède la majesté et la splendeur suprêmes."
  },
  "al-karim": {
    french_name: "Le Généreux",
    short_meaning: "Le Très Généreux dont les dons sont sans limite et sans condition."
  },
  "ar-raqib": {
    french_name: "Le Vigilant",
    short_meaning: "Celui qui observe et surveille toute chose sans distraction."
  },
  "al-mujib": {
    french_name: "Celui qui exauce",
    short_meaning: "Celui qui répond aux invocations de Ses serviteurs."
  },
  "al-wasi": {
    french_name: "Le Vaste",
    short_meaning: "Celui dont la miséricorde et le savoir englobent toute chose."
  },
  "al-hakim": {
    french_name: "Le Sage",
    short_meaning: "Celui qui agit avec sagesse parfaite dans tout ce qu'Il fait et décrète."
  },
  "al-wadud": {
    french_name: "Le Bien-Aimant",
    short_meaning: "Celui qui aime Ses serviteurs pieux et qui est aimé par eux."
  },
  "al-majid-48": {
    french_name: "Le Glorieux",
    short_meaning: "Celui qui possède toute la gloire, noble et magnifique."
  },
  "al-baith": {
    french_name: "Celui qui ressuscite",
    short_meaning: "Celui qui ressuscitera les morts le Jour du Jugement."
  },
  "ash-shahid": {
    french_name: "Le Témoin",
    short_meaning: "Celui qui est témoin de toute chose, rien ne Lui échappe."
  },
  "al-haqq": {
    french_name: "La Vérité",
    short_meaning: "Celui qui est la Vérité absolue et dont l'existence est certaine."
  },
  "al-wakil": {
    french_name: "Le Garant",
    short_meaning: "Celui à qui on confie ses affaires et qui gère tout avec perfection."
  },
  "al-qawi": {
    french_name: "Le Très Fort",
    short_meaning: "Celui dont la force est infinie et qui ne connaît aucune faiblesse."
  },
  "al-matin": {
    french_name: "Le Ferme",
    short_meaning: "Celui dont la puissance est inébranlable et constante."
  },
  "al-wali-55": {
    french_name: "L'Allié Protecteur",
    short_meaning: "L'allié et le protecteur de Ses serviteurs croyants."
  },
  "al-hamid": {
    french_name: "Le Digne de Louange",
    short_meaning: "Celui qui mérite toute la louange pour Ses attributs et Ses actes."
  },
  "al-muhsi": {
    french_name: "Celui qui dénombre",
    short_meaning: "Celui qui connaît le nombre exact de toute chose dans Sa création."
  },
  "al-mubdi": {
    french_name: "Celui qui commence",
    short_meaning: "Celui qui a initié la création pour la première fois, sans modèle."
  },
  "al-muid": {
    french_name: "Celui qui renouvelle",
    short_meaning: "Celui qui ramène la création à la vie après la mort."
  },
  "al-muhyi": {
    french_name: "Celui qui donne la vie",
    short_meaning: "Celui qui donne la vie à toute chose selon Sa volonté."
  },
  "al-mumit": {
    french_name: "Celui qui donne la mort",
    short_meaning: "Celui qui décrète la mort de toute créature vivante."
  },
  "al-hayy": {
    french_name: "Le Vivant",
    short_meaning: "Le Vivant éternel qui ne meurt jamais et dont la vie est parfaite."
  },
  "al-qayyum": {
    french_name: "Le Subsistant par Lui-même",
    short_meaning: "Celui qui subsiste par Lui-même et par qui toute chose existe."
  },
  "al-wajid": {
    french_name: "L'Opulent",
    short_meaning: "Celui qui possède tout et qui trouve tout ce qu'Il veut."
  },
  "al-majid-65": {
    french_name: "Le Noble",
    short_meaning: "Celui dont la noblesse et la gloire sont immenses et absolues."
  },
  "al-wahid": {
    french_name: "L'Unique",
    short_meaning: "L'Unique dans Son essence, Ses attributs et Ses actes, sans égal."
  },
  "as-samad": {
    french_name: "Le Soutien Universel",
    short_meaning: "Celui vers qui toute la création se tourne pour ses besoins."
  },
  "al-qadir": {
    french_name: "Le Capable",
    short_meaning: "Celui qui a le pouvoir absolu de faire tout ce qu'Il veut."
  },
  "al-muqtadir": {
    french_name: "Le Tout-Puissant",
    short_meaning: "Celui dont la puissance s'exerce sur toute chose sans effort."
  },
  "al-muqaddim": {
    french_name: "Celui qui avance",
    short_meaning: "Celui qui fait avancer ce qu'Il veut parmi Ses créatures."
  },
  "al-muakhkhir": {
    french_name: "Celui qui retarde",
    short_meaning: "Celui qui retarde ce qu'Il veut selon Sa sagesse parfaite."
  },
  "al-awwal": {
    french_name: "Le Premier",
    short_meaning: "Le Premier, avant qui rien n'existait. Éternel sans commencement."
  },
  "al-akhir": {
    french_name: "Le Dernier",
    short_meaning: "Le Dernier, après qui rien ne sera. Éternel sans fin."
  },
  "az-zahir": {
    french_name: "L'Apparent",
    short_meaning: "Celui dont l'existence est évidente par Ses signes dans la création."
  },
  "al-batin": {
    french_name: "Le Caché",
    short_meaning: "Celui qui est caché aux sens mais connu par la foi et la réflexion."
  },
  "al-wali-76": {
    french_name: "Le Maître",
    short_meaning: "Celui qui gère et administre toute Sa création."
  },
  "al-mutaali": {
    french_name: "Le Très Élevé",
    short_meaning: "Celui qui est exalté au-dessus de toute chose et de tout attribut créé."
  },
  "al-barr": {
    french_name: "Le Bienfaisant",
    short_meaning: "Celui dont la bonté et la bienveillance touchent toute Sa création."
  },
  "at-tawwab": {
    french_name: "Celui qui accepte le repentir",
    short_meaning: "Celui qui accepte le repentir de Ses serviteurs et les accueille avec clémence."
  },
  "al-muntaqim": {
    french_name: "Le Vengeur",
    short_meaning: "Celui qui tire vengeance des oppresseurs et fait justice aux opprimés."
  },
  "al-afuw": {
    french_name: "L'Indulgent",
    short_meaning: "Celui qui efface complètement les péchés et pardonne avec grande indulgence."
  },
  "ar-rauf": {
    french_name: "Le Très Compatissant",
    short_meaning: "Celui dont la compassion envers Ses serviteurs est immense."
  },
  "malik-ul-mulk": {
    french_name: "Le Possesseur du Royaume",
    short_meaning: "Le Possesseur absolu de toute royauté et de tout pouvoir."
  },
  "dhul-jalali-wal-ikram": {
    french_name: "Le Plein de Majesté et de Générosité",
    short_meaning: "Celui qui réunit la majesté suprême et la générosité parfaite."
  },
  "al-muqsit": {
    french_name: "L'Équitable",
    short_meaning: "Celui qui agit avec une équité parfaite envers toute Sa création."
  },
  "al-jami": {
    french_name: "Celui qui rassemble",
    short_meaning: "Celui qui rassemblera toute la création le Jour du Jugement."
  },
  "al-ghani": {
    french_name: "Le Riche par Lui-même",
    short_meaning: "Celui qui n'a besoin de rien ni de personne, totalement indépendant."
  },
  "al-mughni": {
    french_name: "Celui qui enrichit",
    short_meaning: "Celui qui enrichit Ses serviteurs et comble leurs besoins."
  },
  "al-mani": {
    french_name: "Celui qui empêche",
    short_meaning: "Celui qui empêche ce qui pourrait nuire à Ses serviteurs."
  },
  "ad-darr": {
    french_name: "Celui qui peut nuire",
    short_meaning: "Celui qui décrète l'épreuve par Sa sagesse comme test pour Ses serviteurs."
  },
  "an-nafi": {
    french_name: "Celui qui profite",
    short_meaning: "Celui qui accorde le bienfait et le profit à Ses créatures."
  },
  "an-nur": {
    french_name: "La Lumière",
    short_meaning: "La Lumière des cieux et de la terre, qui guide vers la vérité."
  },
  "al-hadi": {
    french_name: "Le Guide",
    short_meaning: "Celui qui guide Ses serviteurs vers le droit chemin."
  },
  "al-badi": {
    french_name: "Le Créateur Originel",
    short_meaning: "Celui qui a créé les cieux et la terre de manière inédite, sans modèle."
  },
  "al-baqi": {
    french_name: "L'Éternel",
    short_meaning: "Celui qui demeure éternellement, après la disparition de toute chose."
  },
  "al-warith": {
    french_name: "L'Héritier",
    short_meaning: "Celui qui hérite de tout après la fin de toute la création."
  },
  "ar-rashid": {
    french_name: "Le Guide Bien-Dirigeant",
    short_meaning: "Celui qui dirige toute chose vers sa finalité avec sagesse parfaite."
  },
  "as-sabur": {
    french_name: "Le Patient",
    short_meaning: "Celui dont la patience est sans limite et qui ne précipite pas la punition."
  }
};

const entriesDir = path.join(__dirname, '..', 'data', 'encyclopedia', 'entries');

// Lire et mettre à jour chaque fichier
const files = fs.readdirSync(entriesDir).filter(f => f.endsWith('.json'));

let updatedCount = 0;
let unchangedCount = 0;

files.forEach(file => {
  const filePath = path.join(entriesDir, file);
  const slug = file.replace('.json', '');
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (improvedDefinitions[slug]) {
    const newDef = improvedDefinitions[slug];
    let changed = false;
    
    // Mettre à jour short_meaning
    if (newDef.short_meaning && data.short_meaning !== newDef.short_meaning) {
      data.short_meaning = newDef.short_meaning;
      changed = true;
    }
    
    // Mettre à jour french_name si fourni
    if (newDef.french_name && data.french_name !== newDef.french_name) {
      data.french_name = newDef.french_name;
      changed = true;
    }
    
    // Mettre à jour aussi consensus_core pour cohérence
    if (data.interpretation_notes && data.interpretation_notes.consensus_core !== newDef.short_meaning) {
      data.interpretation_notes.consensus_core = newDef.short_meaning;
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✓ Mis à jour: ${slug}`);
      updatedCount++;
    } else {
      console.log(`- Inchangé: ${slug}`);
      unchangedCount++;
    }
  } else {
    console.log(`⚠ Pas de définition améliorée pour: ${slug}`);
    unchangedCount++;
  }
});

console.log(`\nRésumé:`);
console.log(`- Fichiers mis à jour: ${updatedCount}`);
console.log(`- Fichiers inchangés: ${unchangedCount}`);
console.log(`- Total: ${files.length}`);
