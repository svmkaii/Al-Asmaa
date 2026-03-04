/**
 * Correction des sur-corrections dans les fichiers JSON
 */

const fs = require('fs');
const path = require('path');

const DIRS = [
  path.join(__dirname, '..', 'data', 'encyclopedia', 'entries'),
  path.join(__dirname, '..', 'data', 'encyclopedia', 'candidates')
];

// Corrections de verbes au présent sur-corrigés
const FIXES = [
  // Verbes au présent qui ont été sur-corrigés en participes passés
  ['qui exprimé', 'qui exprime'],
  ['qui indiqué', 'qui indique'],
  ['il indiqué', 'il indique'],
  ['qui impliqué', 'qui implique'],
  ['qui signifié', 'qui signifie'],
  ['qui désigné', 'qui désigne'],
  ['qui énuméré', 'qui énumère'],
  ['qui affirmé', 'qui affirme'],
  ['qui considéré', 'qui considère'],
  ['qui manifesté', 'qui manifeste'],
  ['qui révélé', 'qui révèle'],
  ['qui précisé', 'qui précise'],
  ['qui souligné', 'qui souligne'],
  ['qui représenté', 'qui représente'],
  ['qui vérifié', 'qui vérifie'],
  ['dérivé de la racine', 'dérive de la racine'],
  ['Rahman dérivé', 'Rahman dérive'],
  ['Il indiqué', 'Il indique'],
  ['Cela indiqué', 'Cela indique'],
  ['Ce qui indiqué', 'Ce qui indique'],
  ['On indiqué', 'On indique'],
  
  // Corrections supplémentaires
  ['etablissant', 'établissant'],
  ['etablir', 'établir'],
  [' a personne', ' à personne'],
  ['beneficie', 'bénéficie'],
];

let totalFixes = 0;

for (const dir of DIRS) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let fileFixed = false;
    
    for (const [wrong, correct] of FIXES) {
      if (content.includes(wrong)) {
        content = content.split(wrong).join(correct);
        fileFixed = true;
        totalFixes++;
      }
    }
    
    if (fileFixed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${file}`);
    }
  }
}

console.log(`\n✅ Total corrections: ${totalFixes}`);
