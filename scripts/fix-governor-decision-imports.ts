#!/usr/bin/env tsx
/**
 * Script pour corriger tous les imports GovernorDecision incorrects
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
  console.log('🔧 Correction des imports GovernorDecision');
  console.log('📁 Répertoire:', WEB_DIR);
  console.log('');

  const files = await glob('**/*.{ts,tsx}', {
    cwd: WEB_DIR,
    absolute: true,
  });

  let totalCorrections = 0;
  let filesModified = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    let fileCorrections = 0;

    // Corriger les imports GovernorDecision incorrects
    const wrongImportRegex = /from\s+['"]@\/core\/p5\/contracts\/governor\.contract['"]/g;
    const matches = content.match(wrongImportRegex);
    if (matches) {
      // Vérifier si le fichier est dans le répertoire bridge
      if (file.includes('bridge')) {
        content = content.replace(wrongImportRegex, () => {
          fileCorrections++;
          modified = true;
          return "from './normalization-contract.js'";
        });
      } else if (file.includes('integration')) {
        content = content.replace(wrongImportRegex, () => {
          fileCorrections++;
          modified = true;
          return "from '../bridge/normalization-contract.js'";
        });
      } else if (file.includes('tests')) {
        content = content.replace(wrongImportRegex, () => {
          fileCorrections++;
          modified = true;
          return "from '../../bridge/normalization-contract.js'";
        });
      }
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
