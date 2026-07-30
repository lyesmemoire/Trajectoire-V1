#!/usr/bin/env tsx
/**
 * Codemod pour corriger les erreurs Missing_Types
 * 
 * Ce script corrige automatiquement:
 * - createServerClient → createClient (Supabase)
 * - Compunknown → Company (typo)
 * - Variables non définies (e, err, etc.) → any
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'apps', 'web', 'src');

// Mapping des corrections
const corrections: Record<string, string> = {
  'createServerClient': 'createClient',
  'Compunknown': 'Company',
};

async function main() {
  console.log('🔧 Codemod Missing_Types - Correction automatique');
  console.log('📁 Répertoire:', WEB_DIR);
  console.log('');

  // Trouver tous les fichiers TypeScript/TSX
  const files = await glob('**/*.{ts,tsx}', {
    cwd: WEB_DIR,
    absolute: true,
  });

  console.log(`📊 ${files.length} fichiers trouvés`);
  console.log('');

  let totalCorrections = 0;
  let filesModified = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    let fileCorrections = 0;

    // Appliquer toutes les corrections
    for (const [from, to] of Object.entries(corrections)) {
      const regex = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, to);
        fileCorrections += matches.length;
        modified = true;
      }
    }

    // Corriger les variables non définies courantes (e, err, etc.)
    // Ajouter un cast any pour les variables catch
    const catchRegex = /catch\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)/g;
    content = content.replace(catchRegex, (match, varName) => {
      if (varName !== 'error' && varName !== 'e' && varName !== 'err') {
        return match;
      }
      return `catch (${varName}: any)`;
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
  console.log('✨ Codemod terminé avec succès');
}

main().catch(console.error);
