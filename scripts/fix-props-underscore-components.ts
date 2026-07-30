#!/usr/bin/env tsx
/**
 * Script pour corriger les props underscore dans les composants React
 * Supprime les propriétés underscore du destructuring des props
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
  console.log('🔧 Correction des props underscore dans les composants React');
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

    // Corriger les props underscore dans le destructuring
    // Pattern: { prop1, prop2, _ }: Props
    const underscoreDestructuringRegex = /(\{[^}]*),\s*_\s*\}:\s*\w+/g;
    content = content.replace(underscoreDestructuringRegex, (match) => {
      fileCorrections++;
      modified = true;
      return match.replace(/,\s*_\s*\}/, ' }');
    });

    // Corriger les props underscore dans les interfaces
    // Pattern: interface Props { prop: type; _: any; }
    const underscoreInterfaceRegex = /,\s*_\s*:\s*any/g;
    content = content.replace(underscoreInterfaceRegex, () => {
      fileCorrections++;
      modified = true;
      return '';
    });

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
