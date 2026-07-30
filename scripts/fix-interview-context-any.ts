#!/usr/bin/env tsx
/**
 * Script pour corriger les utilisations de 'any.' par 'InterviewPhase.' dans InterviewContext.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'apps', 'web', 'src');
const INTERVIEW_CONTEXT_FILE = path.join(WEB_DIR, 'application', 'orchestration', 'InterviewContext.ts');

async function main() {
  console.log('🔧 Correction des utilisations de any. dans InterviewContext.ts');
  console.log('📁 Fichier:', INTERVIEW_CONTEXT_FILE);
  console.log('');

  let content = fs.readFileSync(INTERVIEW_CONTEXT_FILE, 'utf-8');
  let modified = false;
  let corrections = 0;

  // Corriger toutes les utilisations de any. par InterviewPhase.
  const anyUsageRegex = /\bany\./g;
  const matches = content.match(anyUsageRegex);
  if (matches) {
    content = content.replace(anyUsageRegex, 'InterviewPhase.');
    corrections = matches.length;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(INTERVIEW_CONTEXT_FILE, content, 'utf-8');
    console.log(`✅ ${corrections} corrections appliquées`);
  } else {
    console.log('ℹ️  Aucune correction nécessaire');
  }

  console.log('');
  console.log('✨ Correction terminée avec succès');
}

main().catch(console.error);
