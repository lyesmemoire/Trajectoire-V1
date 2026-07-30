#!/usr/bin/env tsx
/**
 * Script pour corriger les interfaces et enums invalides créés par le codemod
 * Remplace `export interface any` et `export enum any` par des noms appropriés
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'apps', 'web', 'src');

// Mapping basé sur le nom du fichier
const interfaceNameMap: Record<string, string> = {
  'IWorldModelEngine.ts': 'Job',
  'ConversationState.ts': 'ConversationPhase',
  'answer-analysis.ts': 'AnswerAnalysis',
  'risk-score.ts': 'RiskScoreInput',
  'pressure.types.ts': 'PressureSignal',
  'jobs.ts': 'Job',
  'identity-card.ts': 'IdentityCardData',
  'premium-interview.ts': 'PremiumInterviewSession',
};

async function main() {
  console.log('🔧 Correction des interfaces et enums invalides');
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

    const fileName = path.basename(file);
    
    // Déterminer le nom approprié basé sur le fichier
    let interfaceName = interfaceNameMap[fileName];
    
    // Si pas dans le mapping, utiliser un nom générique basé sur le fichier
    if (!interfaceName) {
      const baseName = fileName.replace(/\.(ts|tsx)$/, '');
      interfaceName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    }

    // Corriger les interfaces invalides
    const interfaceRegex = /export interface any \{/g;
    const interfaceMatches = content.match(interfaceRegex);
    if (interfaceMatches) {
      content = content.replace(interfaceRegex, `export interface ${interfaceName} {`);
      fileCorrections += interfaceMatches.length;
      modified = true;
    }

    // Corriger les enums invalides
    const enumRegex = /export enum any \{/g;
    const enumMatches = content.match(enumRegex);
    if (enumMatches) {
      content = content.replace(enumRegex, `export enum ${interfaceName} {`);
      fileCorrections += enumMatches.length;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      filesModified++;
      totalCorrections += fileCorrections;
      console.log(`✅ ${path.relative(WEB_DIR, file)}: ${fileCorrections} corrections (${interfaceName})`);
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
