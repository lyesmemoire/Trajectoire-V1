#!/usr/bin/env tsx
/**
 * Script pour corriger tous les imports incorrects créés par les corrections automatiques
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
  console.log('🔧 Correction de tous les imports incorrects');
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

    // Supprimer tous les imports depuis @/core/p6/contracts/* qui n'existent pas
    const wrongP6Imports = [
      '@/core/p6/contracts/mind.contract',
      '@/core/p6/contracts/timeline.contract',
      '@/core/p6/contracts/voice.contract',
    ];

    for (const wrongImport of wrongP6Imports) {
      const regex = new RegExp(`import\\s+\\{[^}]+\\}\\s+from\\s+['"]${wrongImport}['"]`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, '');
        fileCorrections += matches.length;
        modified = true;
      }
    }

    // Supprimer tous les imports depuis @/core/p5/contracts/* qui n'existent pas
    const wrongP5Imports = [
      '@/core/p5/contracts/governor.contract',
      '@/core/p5/contracts/runtime.contract',
    ];

    for (const wrongImport of wrongP5Imports) {
      const regex = new RegExp(`import\\s+\\{[^}]+\\}\\s+from\\s+['"]${wrongImport}['"]`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, '');
        fileCorrections += matches.length;
        modified = true;
      }
    }

    // Nettoyer les lignes vides multiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

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
