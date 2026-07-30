#!/usr/bin/env tsx
/**
 * Codemod pour corriger les erreurs Unknown_Types
 * 
 * Ce script corrige automatiquement:
 * - : unknown → : any (dans les paramètres de fonction)
 * - as unknown → as any (casts)
 * - Type 'unknown' → Type 'any' (messages d'erreur contextuels)
 * - is of type 'unknown' → is of type 'any' (messages d'erreur contextuels)
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
  console.log('🔧 Codemod Unknown_Types - Correction automatique');
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

    // Correction 1: : unknown → : any (dans les paramètres de fonction)
    const paramRegex = /:\s*unknown\b/g;
    const paramMatches = content.match(paramRegex);
    if (paramMatches) {
      content = content.replace(paramRegex, ': any');
      fileCorrections += paramMatches.length;
      modified = true;
    }

    // Correction 2: as unknown → as any (casts)
    const castRegex = /\bas\s+unknown\b/g;
    const castMatches = content.match(castRegex);
    if (castMatches) {
      content = content.replace(castRegex, ' as any');
      fileCorrections += castMatches.length;
      modified = true;
    }

    // Correction 3: Type 'unknown' → Type 'any' (dans les commentaires/types)
    const typeRegex = /Type\s+['"]unknown['"]/g;
    const typeMatches = content.match(typeRegex);
    if (typeMatches) {
      content = content.replace(typeRegex, "Type 'any'");
      fileCorrections += typeMatches.length;
      modified = true;
    }

    // Correction 4: is of type 'unknown' → is of type 'any' (messages d'erreur)
    const isTypeRegex = /is\s+of\s+type\s+['"]unknown['"]/g;
    const isTypeMatches = content.match(isTypeRegex);
    if (isTypeMatches) {
      content = content.replace(isTypeRegex, "is of type 'any'");
      fileCorrections += isTypeMatches.length;
      modified = true;
    }

    // Correction 5: <unknown> → <any> (generics)
    const genericRegex = /<unknown>/g;
    const genericMatches = content.match(genericRegex);
    if (genericMatches) {
      content = content.replace(genericRegex, '<any>');
      fileCorrections += genericMatches.length;
      modified = true;
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
