/**
 * Correction des accents dans encyclopedia-v2.js
 */

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'public', 'data', 'encyclopedia-v2.js');

// Remplacements simples (mot -> mot avec accent)
const REPLACEMENTS = [
  // Miséricorde
  ['misericorde', 'miséricorde'],
  ['Misericorde', 'Miséricorde'],
  ['misericordieux', 'miséricordieux'],
  ['Misericordieux', 'Miséricordieux'],
  
  // Être, état
  ['etait', 'était'],
  ['etaient', 'étaient'],
  ['ete ', 'été '],
  ['etant', 'étant'],
  ['etre', 'être'],
  
  // Accents é
  ['meme', 'même'],
  ['deja', 'déjà'],
  ['designe', 'désigne'],
  ['desirer', 'désirer'],
  ['desire', 'désiré'],
  ['decrete', 'décrète'],
  ['decreter', 'décréter'],
  ['decret', 'décret'],
  ['verite', 'vérité'],
  ['realite', 'réalité'],
  ['eternite', 'éternité'],
  ['eternel', 'éternel'],
  ['eternelle', 'éternelle'],
  ['revele', 'révélé'],
  ['revelation', 'révélation'],
  ['Revelation', 'Révélation'],
  ['generale', 'générale'],
  ['general', 'général'],
  ['generaliser', 'généraliser'],
  ['specifique', 'spécifique'],
  ['speciale', 'spéciale'],
  ['special', 'spécial'],
  ['reservee', 'réservée'],
  ['reserve', 'réservé'],
  ['createur', 'créateur'],
  ['Createur', 'Créateur'],
  ['creation', 'création'],
  ['creature', 'créature'],
  ['creatures', 'créatures'],
  ['cree', 'crée'],
  ['crea', 'créa'],
  ['eleve', 'élevé'],
  ['elevee', 'élevée'],
  ['elever', 'élever'],
  ['epreuve', 'épreuve'],
  ['epreuves', 'épreuves'],
  ['element', 'élément'],
  ['elements', 'éléments'],
  ['energie', 'énergie'],
  ['evenement', 'événement'],
  ['evenements', 'événements'],
  ['evidence', 'évidence'],
  ['explique', 'expliqué'],
  ['expliquee', 'expliquée'],
  ['detaille', 'détaillé'],
  ['detaillee', 'détaillée'],
  ['methodologie', 'méthodologie'],
  ['hebreux', 'hébreux'],
  ['hebreu', 'hébreu'],
  ['semitique', 'sémitique'],
  ['semitiques', 'sémitiques'],
  ['pre-islamique', 'pré-islamique'],
  ['encyclopedie', 'encyclopédie'],
  ['Encyclopedie', 'Encyclopédie'],
  ['categorise', 'catégorisé'],
  ['categorie', 'catégorie'],
  ['reference', 'référence'],
  ['references', 'références'],
  ['refere', 'réfère'],
  ['systeme', 'système'],
  ['systematique', 'systématique'],
  ['probleme', 'problème'],
  ['problemes', 'problèmes'],
  ['phenomene', 'phénomène'],
  ['phenomenes', 'phénomènes'],
  ['theologie', 'théologie'],
  ['theologique', 'théologique'],
  ['theologiques', 'théologiques'],
  ['metaphysique', 'métaphysique'],
  ['genealogie', 'généalogie'],
  ['etymologie', 'étymologie'],
  ['etymologique', 'étymologique'],
  
  // Supérieur/inférieur
  ['superieur', 'supérieur'],
  ['superieure', 'supérieure'],
  ['inferieur', 'inférieur'],
  ['inferieure', 'inférieure'],
  ['anterieur', 'antérieur'],
  ['anterieure', 'antérieure'],
  ['posterieur', 'postérieur'],
  ['posterieure', 'postérieure'],
  ['exterieur', 'extérieur'],
  ['exterieure', 'extérieure'],
  ['interieur', 'intérieur'],
  ['interieure', 'intérieure'],
  
  // Premier/dernier
  ['premiere', 'première'],
  ['derniere', 'dernière'],
  ['entiere', 'entière'],
  ['particuliere', 'particulière'],
  ['reguliere', 'régulière'],
  ['singuliere', 'singulière'],
  
  // Accents divers
  ['au-dela', 'au-delà'],
  ['plutot', 'plutôt'],
  ['aussitot', 'aussitôt'],
  ['bientot', 'bientôt'],
  ['controle', 'contrôle'],
  ['controler', 'contrôler'],
  [' role', ' rôle'],
  [' roles', ' rôles'],
  
  // Interprétation
  ['interpretation', 'interprétation'],
  ['interpretations', 'interprétations'],
  ['interpreter', 'interpréter'],
  ['interprete', 'interprète'],
  ['exegese', 'exégèse'],
  ['exegetique', 'exégétique'],
  
  // Cédille
  ['lecon', 'leçon'],
  ['lecons', 'leçons'],
  ['facon', 'façon'],
  ['facons', 'façons'],
  ['recoit', 'reçoit'],
  ['recoivent', 'reçoivent'],
  ['recu', 'reçu'],
  ['recue', 'reçue'],
  
  // Grâce
  ['grace a', 'grâce à'],
  ['Grace a', 'Grâce à'],
  
  // Autres
  ['acheve', 'achevé'],
  ['achevee', 'achevée'],
  ['celebre', 'célèbre'],
  ['celebres', 'célèbres'],
  ['fidele', 'fidèle'],
  ['fideles', 'fidèles'],
  ['modele', 'modèle'],
  ['modeles', 'modèles'],
  ['parallele', 'parallèle'],
  ['paralleles', 'parallèles'],
  ['plenitude', 'plénitude'],
  ['integralement', 'intégralement'],
  ['integralite', 'intégralité'],
  ['pleniere', 'plénière'],
  ['abondante', 'abondante'],
  ['debordante', 'débordante'],
  ['permanente', 'permanente'],
  ['inherente', 'inhérente'],
  
  // Mots avec è
  ['critere', 'critère'],
  ['criteres', 'critères'],
  ['caractere', 'caractère'],
  ['caracteres', 'caractères'],
  ['mystere', 'mystère'],
  ['mysteres', 'mystères'],
  ['atmosphere', 'atmosphère'],
  ['sincere', 'sincère'],
  ['sinceres', 'sincères'],
  ['severe', 'sévère'],
  ['severes', 'sévères'],
  
  // Participes/adjectifs
  ['etabli', 'établi'],
  ['etablie', 'établie'],
  ['etablir', 'établir'],
  ['etablissement', 'établissement'],
  ['evoque', 'évoqué'],
  ['evoquee', 'évoquée'],
  ['evoquer', 'évoquer'],
  ['etudie', 'étudié'],
  ['etudiee', 'étudiée'],
  ['etudier', 'étudier'],
  ['evalue', 'évalué'],
  ['evaluee', 'évaluée'],
  ['evaluer', 'évaluer'],
  ['ecoute', 'écoute'],
  ['ecoutee', 'écoutée'],
  ['ecouter', 'écouter'],
  
  // Très
  ['Tres ', 'Très '],
  ['tres ', 'très '],
  
  // A avec accent
  [' a travers', ' à travers'],
  [' la ou ', ' là où '],
  [' ou il', ' où il'],
  [' ou elle', ' où elle'],
  [' ou le ', ' où le '],
  [' ou la ', ' où la '],
  [' ou les ', ' où les '],
  [' ou l\'', ' où l\''],
  [' ou ce', ' où ce'],
  [' ou cette', ' où cette'],
  
  // Termes islamiques avec accents
  ['misericorde', 'miséricorde'],
  ['piete', 'piété'],
  ['purete', 'pureté'],
  ['divinite', 'divinité'],
  ['unicite', 'unicité'],
  ['eternite', 'éternité'],
  ['souverainete', 'souveraineté'],
  ['majeste', 'majesté'],
  ['bonte', 'bonté'],
  ['beaute', 'beauté'],
  ['sagesse', 'sagesse'],
  ['veracite', 'véracité'],
  
  // Qualités avec -té
  ['qualite', 'qualité'],
  ['quantite', 'quantité'],
  ['realite', 'réalité'],
  ['totalite', 'totalité'],
  ['finalite', 'finalité'],
  ['moralite', 'moralité'],
  ['egalite', 'égalité'],
  ['fidelite', 'fidélité'],
  ['humilite', 'humilité'],
  ['possibilite', 'possibilité'],
  ['capacite', 'capacité'],
  ['activite', 'activité'],
  ['creativite', 'créativité'],
  ['intensite', 'intensité'],
  ['densite', 'densité'],
  ['diversite', 'diversité'],
  ['universite', 'université'],
  ['generosite', 'générosité'],
  ['simplicite', 'simplicité'],
  ['complexite', 'complexité'],
  ['authenticite', 'authenticité'],
  ['specificite', 'spécificité'],
  ['efficacite', 'efficacité'],
  ['necessite', 'nécessité'],
  ['securite', 'sécurité'],
  ['societe', 'société'],
  ['propriete', 'propriété'],
  ['variete', 'variété'],
  ['autorite', 'autorité'],
  ['superiorite', 'supériorité'],
  ['inferiorite', 'infériorité'],
  ['priorite', 'priorité'],
  ['anteriorite', 'antériorité']
];

let content = fs.readFileSync(FILE_PATH, 'utf8');
let changeCount = 0;

for (const [wrong, correct] of REPLACEMENTS) {
  // Créer une regex avec frontières de mot
  const regex = new RegExp(`\\b${wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
  const matches = content.match(regex);
  if (matches) {
    changeCount += matches.length;
    content = content.replace(regex, correct);
  }
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log(`✅ Fichier encyclopedia-v2.js corrigé (${changeCount} remplacements)`);
