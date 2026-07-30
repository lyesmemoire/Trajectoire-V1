#!/usr/bin/env tsx
/**
 * Codemod pour corriger les erreurs Prisma_Database
 * 
 * Ce script corrige automatiquement:
 * - _data → data (PostgrestResponse)
 * - interviewAnalyticsProjection → interviewAnalytics (PrismaClient)
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
  '_data': 'data',
  'interviewAnalyticsProjection': 'interviewAnalytics',
};

async function main() {
  console.log('🔧 Codemod Prisma_Database - Correction automatique');
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
