/**
 * Corrections finales des accents dans tous les fichiers JSON
 */

const fs = require('fs');
const path = require('path');

const DIRS = [
  path.join(__dirname, '..', 'data', 'encyclopedia', 'entries'),
  path.join(__dirname, '..', 'data', 'encyclopedia', 'candidates')
];

// Corrections supplémentaires
const FIXES = [
  // Participes passés manquants
  ['Il a enseigne', 'Il a enseigné'],
  ['a enseigne', 'a enseigné'],
  ['accepte par', 'accepté par'],
  ['atteste dans', 'attesté dans'],
  ['cite avec', 'cité avec'],
  ['cite dans', 'cité dans'],
  ['considere comme', 'considéré comme'],
  ['derive des', 'dérivé des'],
  ['mentionne dans', 'mentionné dans'],
  ['rapporte que', 'rapporté que'],
  ['revele a', 'révélé à'],
  ['utilise pour', 'utilisé pour'],
  ['verifie le', 'vérifié le'],
  
  // À avec accent
  ['dediee a', 'dédiée à'],
  ['dedié à', 'dédié à'],
  ['dedié a', 'dédié à'],
  ['aupres de', 'auprès de'],
  ['apres ', 'après '],
  [' a travers', ' à travers'],
  [' a Allah', ' à Allah'],
  [' a ce Nom', ' à ce Nom'],
  [' a cette', ' à cette'],
  [' a cet', ' à cet'],
  [' a la ', ' à la '],
  [' a le ', ' à le '],
  [' a l\'', ' à l\''],
  [' a un ', ' à un '],
  [' a une ', ' à une '],
  [' a Sa', ' à Sa'],
  [' a Ses', ' à Ses'],
  [' a Son', ' à Son'],
  [' a aucune', ' à aucune'],
  [' a aucun', ' à aucun'],
  [' a chaque', ' à chaque'],
  [' a tout', ' à tout'],
  [' a toute', ' à toute'],
  [' a tous', ' à tous'],
  [' a toutes', ' à toutes'],
  
  // Autres accents
  ['aupres', 'auprès'],
  ['apres', 'après'],
  ['tres ', 'très '],
  ['Tres ', 'Très '],
  ['dediee', 'dédiée'],
  ['dedié', 'dédié'],
  ['enseigne ', 'enseigné '],
  ['accepte ', 'accepté '],
  ['revele ', 'révélé '],
  ['atteste ', 'attesté '],
  ['prouve ', 'prouvé '],
  ['approuve ', 'approuvé '],
  ['cite ', 'cité '],
  ['mentionne ', 'mentionné '],
  ['interprete ', 'interprété '],
  ['represente ', 'représenté '],
  ['considere ', 'considéré '],
  ['verifie ', 'vérifié '],
  ['identifie ', 'identifié '],
  
  // Où avec accent (contexte relationnel)
  [' ou le Nom', ' où le Nom'],
  [' ou ce Nom', ' où ce Nom'],
  [' ou son sens', ' où son sens'],
  [' ou il est', ' où il est'],
  [' ou elle est', ' où elle est'],
  [' ou Allah', ' où Allah'],
  
  // Corriger le "où" dans les citations du Coran
  ['où invoquez', 'ou invoquez'],
  
  // Termes islamiques
  ['createur', 'créateur'],
  ['Createur', 'Créateur'],
  ['eternel', 'éternel'],
  ['eternite', 'éternité'],
  ['misericorde', 'miséricorde'],
  ['misericordieux', 'miséricordieux'],
  ['Misericordieux', 'Miséricordieux'],
  
  // Autres corrections
  ['precis', 'précis'],
  ['precise', 'précise'],
  ['preciser', 'préciser'],
  ['veritable', 'véritable'],
  ['veritables', 'véritables'],
  ['general', 'général'],
  ['generale', 'générale'],
  ['generalement', 'généralement'],
  ['specifique', 'spécifique'],
  ['specifiques', 'spécifiques'],
  ['particulier', 'particulier'],
  ['particuliere', 'particulière'],
  ['regulier', 'régulier'],
  ['reguliere', 'régulière'],
  ['superieur', 'supérieur'],
  ['superieure', 'supérieure'],
  ['inferieur', 'inférieur'],
  ['inferieure', 'inférieure']
];

let totalFixes = 0;

for (const dir of DIRS) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    for (const [wrong, correct] of FIXES) {
      // Créer une regex sensible à la casse
      const regex = new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, correct);
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalFixes++;
      console.log(`Fixed: ${file}`);
    }
  }
}

console.log(`\n✅ ${totalFixes} fichiers corrigés`);
