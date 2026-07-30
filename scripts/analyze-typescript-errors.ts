#!/usr/bin/env tsx
/**
 * Script pour analyser les erreurs TypeScript et générer les rapports structurés
 * selon le protocole strict d'industrialisation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'reports', 'typescript');
const LOG_FILE = path.join(REPORTS_DIR, 'latest.log');

interface TypeScriptError {
  file: string;
  line: number;
  column: number;
  code: string;
  category: string;
  severity: string;
  message: string;
}

interface ErrorCategory {
  name: string;
  count: number;
  percentage: number;
}

interface Progress {
  before: number;
  after: number;
  fixed: number;
  remaining: number;
  percentage: number;
}

function parseErrorLine(line: string): TypeScriptError | null {
  const match = line.match(/(.+)\((\d+),(\d+)\): error (TS\d+): (.+)/);
  if (!match) return null;

  const [, file, lineStr, columnStr, code, message] = match;
  const category = categorizeError(code, message);

  return {
    file: file.trim(),
    line: parseInt(lineStr),
    column: parseInt(columnStr),
    code,
    category,
    severity: getSeverity(code),
    message: message.trim(),
  };
}

function categorizeError(code: string, message: string): string {
  if (code === 'TS2304') return 'Undefined';
  if (code === 'TS2305') return 'Imports';
  if (code === 'TS2307') return 'Imports';
  if (code === 'TS2300') return 'Duplicates';
  if (code === 'TS2339') return 'Properties';
  if (code === 'TS2345') return 'Types';
  if (code === 'TS2339') return 'Properties';
  if (code === 'TS2457') return 'Invalid';
  if (code === 'TS2578') return 'Directives';
  if (code === 'TS2693') return 'TypeUsage';
  if (code === 'TS2769') return 'Overload';
  if (code === 'TS7006') return 'Implicit';
  if (code === 'TS7053') return 'Indexing';
  if (code === 'TS18046') return 'Unknown';
  if (code === 'TS2353') return 'ObjectLiteral';
  if (code === 'TS2427') return 'Interface';
  if (code === 'TS2431') return 'Enum';
  if (code === 'TS1232') return 'Import';
  if (code === 'TS1109') return 'Expression';
  if (code === 'TS2571') return 'Unknown';
  if (message.includes('any')) return 'Any';
  if (message.includes('unknown')) return 'Unknown';
  if (message.includes('Props')) return 'Props';
  if (message.includes('import')) return 'Imports';
  if (message.includes('property')) return 'Properties';
  return 'Other';
}

function getSeverity(code: string): string {
  if (code.startsWith('TS23')) return 'Error';
  if (code.startsWith('TS24')) return 'Error';
  if (code.startsWith('TS25')) return 'Error';
  if (code.startsWith('TS26')) return 'Error';
  if (code.startsWith('TS27')) return 'Error';
  if (code.startsWith('TS70')) return 'Warning';
  if (code.startsWith('TS71')) return 'Warning';
  return 'Error';
}

async function main() {
  console.log('🔧 Analyse des erreurs TypeScript');
  console.log('📁 Fichier:', LOG_FILE);
  console.log('');

  const logContent = fs.readFileSync(LOG_FILE, 'utf-8');
  const lines = logContent.split('\n');

  const errors: TypeScriptError[] = [];
  const categories = new Map<string, number>();

  for (const line of lines) {
    const error = parseErrorLine(line);
    if (error) {
      errors.push(error);
      categories.set(error.category, (categories.get(error.category) || 0) + 1);
    } else if (line.includes('error TS')) {
      console.log('❌ Ligne non parsée:', line);
    }
  }

  const totalErrors = errors.length;
  console.log(`📊 Total erreurs: ${totalErrors}`);

  // Générer errors.json
  const errorsJson = {
    timestamp: new Date().toISOString(),
    command: 'pnpm --filter web exec tsc --noEmit',
    exit_code: 2,
    total_errors: totalErrors,
    errors: errors,
  };

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'errors.json'),
    JSON.stringify(errorsJson, null, 2),
    'utf-8'
  );
  console.log('✅ errors.json généré');

  // Générer categories.json
  const categoryArray: ErrorCategory[] = [];
  for (const [name, count] of categories.entries()) {
    categoryArray.push({
      name,
      count,
      percentage: (count / totalErrors) * 100,
    });
  }

  categoryArray.sort((a, b) => b.count - a.count);

  const categoriesJson = {
    timestamp: new Date().toISOString(),
    total_categories: categoryArray.length,
    categories: categoryArray,
  };

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'categories.json'),
    JSON.stringify(categoriesJson, null, 2),
    'utf-8'
  );
  console.log('✅ categories.json généré');

  // Générer progress.json
  const progress: Progress = {
    before: totalErrors,
    after: totalErrors,
    fixed: 0,
    remaining: totalErrors,
    percentage: 0,
  };

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'progress.json'),
    JSON.stringify(progress, null, 2),
    'utf-8'
  );
  console.log('✅ progress.json généré');

  console.log('');
  console.log('📈 Résumé des catégories:');
  for (const category of categoryArray.slice(0, 10)) {
    console.log(`   ${category.name}: ${category.count} (${category.percentage.toFixed(1)}%)`);
  }

  console.log('');
  console.log('✨ Analyse terminée avec succès');
}

main().catch(console.error);
