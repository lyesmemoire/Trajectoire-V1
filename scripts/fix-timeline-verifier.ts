#!/usr/bin/env tsx
/**
 * Script pour ajouter l'import Timeline manquant dans timeline-verifier.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const TARGET_FILE = path.join(ROOT, 'apps', 'web', 'src', 'core', 'p5', 'timeline', 'timeline-verifier.ts');

function main() {
  console.log('🔧 Correction de timeline-verifier.ts');
  console.log('📁 Fichier:', TARGET_FILE);
  console.log('');

  let content = fs.readFileSync(TARGET_FILE, 'utf-8');
  
  // Ajouter l'import au début du fichier
  const importLine = 'import { Timeline } from "./timeline-contract.js";\n';
  
  if (!content.includes('import { Timeline }')) {
    content = importLine + content;
    fs.writeFileSync(TARGET_FILE, content, 'utf-8');
    console.log('✅ Import Timeline ajouté avec succès');
  } else {
    console.log('ℹ️  Import Timeline déjà présent');
  }
}

main();
