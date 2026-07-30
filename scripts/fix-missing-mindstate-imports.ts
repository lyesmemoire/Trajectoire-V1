#!/usr/bin/env tsx
/**
 * Script pour ajouter les imports MindState manquants dans les fichiers transaction
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'apps', 'web', 'src');

async function main() {
  console.log('🔧 Correction des imports MindState manquants');
  console.log('📁 Répertoire:', WEB_DIR);
  console.log('');

  const files = await glob('core/p5/transaction/*.ts', {
    cwd: WEB_DIR,
    absolute: true,
  });

  let totalCorrections = 0;
  let filesModified = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    let fileCorrections = 0;

    // Vérifier si MindState est utilisé mais non importé
    if (content.includes('MindState') && !content.includes('import { MindState }')) {
      // Ajouter l'import après les autres imports ou au début
      const importLine = 'import { MindState } from "../execution-contract.js";\n';
      
      // Trouver la position après les imports existants
      const importEndMatch = content.match(/^import .*?;$/gm);
      if (importEndMatch && importEndMatch.length > 0) {
        // Insérer après le dernier import
        const lastImportIndex = content.lastIndexOf(importEndMatch[importEndMatch.length - 1]);
        const insertPosition = lastImportIndex + importEndMatch[importEndMatch.length - 1].length;
        content = content.slice(0, insertPosition) + '\n' + importLine + content.slice(insertPosition);
      } else {
        // Insérer au début
        content = importLine + content;
      }
      
      fileCorrections = 1;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      filesModified++;
      totalCorrections += fileCorrections;
      console.log(`✅ ${path.relative(WEB_DIR, file)}: ${fileCorrections} corrections`);
    }
  }

  console.log('');
  console.log('📈 Résumé:');
  console.log(`   Fichiers modifiés: ${filesModified}`);
  console.log(`   Corrections totales: ${totalCorrections}`);
  console.log('');
  console.log('✨ Correction terminée avec succès');
}

main().catch(console.error);
