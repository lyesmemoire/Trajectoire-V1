#!/usr/bin/env tsx
/**
 * Script pour corriger les erreurs de la famille Duplicates
 * Supprime les imports en double créés par les corrections automatiques
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
  console.log('🔧 Correction des erreurs de la famille Duplicates');
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

    // Détecter et supprimer les imports en double
    const lines = content.split('\n');
    const seenImports = new Map<string, number>();
    const linesToRemove = new Set<number>();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const importMatch = line.match(/^import\s+\{[^}]+\}\s+from\s+['"]([^'"]+)['"]/);
      if (importMatch) {
        const modulePath = importMatch[1];
        const importKey = line.trim();
        
        if (seenImports.has(importKey)) {
          linesToRemove.add(i);
          fileCorrections++;
          modified = true;
        } else {
          seenImports.set(importKey, i);
        }
      }
    }

    if (modified) {
      const newLines = lines.filter((_, index) => !linesToRemove.has(index));
      content = newLines.join('\n');
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
