#!/usr/bin/env tsx
/**
 * Script pour corriger les erreurs de la famille ObjectLiteral
 * Corrige les erreurs d'objets littéraux avec des propriétés excessives
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
  console.log('🔧 Correction des erreurs de la famille ObjectLiteral');
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

    // Corriger les objets littéraux avec des propriétés excessives
    // Pattern: { prop: value, _prop: value }
    const underscorePropertyRegex = /,\s*_\w+\s*:/g;
    content = content.replace(underscorePropertyRegex, (match) => {
      fileCorrections++;
      modified = true;
      return '';
    });

    // Corriger les types _ComponentProps en ComponentProps
    const underscorePropsRegex = /_\w+Props/g;
    const matches = content.match(underscorePropsRegex);
    if (matches) {
      content = content.replace(underscorePropsRegex, (match) => {
        const corrected = match.substring(1);
        fileCorrections++;
        modified = true;
        return corrected;
      });
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
