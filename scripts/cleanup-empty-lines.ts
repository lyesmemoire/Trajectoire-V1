#!/usr/bin/env tsx
/**
 * Script pour nettoyer les lignes vides et les imports en double après les corrections automatiques
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
  console.log('🔧 Nettoyage des lignes vides et imports en double');
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

    // Nettoyer les lignes vides après les imports
    const originalContent = content;
    content = content.replace(/;\n;\n;\n/g, '\n\n');
    content = content.replace(/;\n;\n/g, '\n\n');
    content = content.replace(/;\n/g, '\n');

    // Nettoyer les lignes vides multiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Supprimer les lignes vides au début du fichier
    content = content.replace(/^\n+/, '');

    if (content !== originalContent) {
      modified = true;
      fileCorrections = 1;
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
  console.log('✨ Nettoyage terminé avec succès');
}

main().catch(console.error);
