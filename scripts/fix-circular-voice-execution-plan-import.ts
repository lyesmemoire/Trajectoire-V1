#!/usr/bin/env tsx
/**
 * Script pour supprimer l'import circulaire de VoiceExecutionPlan dans voice-contract.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const TARGET_FILE = path.join(ROOT, 'apps', 'web', 'src', 'core', 'p6', 'voice', 'voice-contract.ts');

function main() {
  console.log('🔧 Correction de voice-contract.ts');
  console.log('📁 Fichier:', TARGET_FILE);
  console.log('');

  let content = fs.readFileSync(TARGET_FILE, 'utf-8');
  
  // Supprimer l'import circulaire
  const circularImportRegex = /import\s+{\s*VoiceExecutionPlan\s*}\s+from\s+["']\.\/voice-contract\.js["'];?\n?/;
  const originalContent = content;
  content = content.replace(circularImportRegex, '');
  
  if (content !== originalContent) {
    fs.writeFileSync(TARGET_FILE, content, 'utf-8');
    console.log('✅ Import circulaire supprimé avec succès');
  } else {
    console.log('ℹ️  Import circulaire non trouvé');
  }
}

main();
