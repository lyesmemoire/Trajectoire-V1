#!/usr/bin/env tsx
/**
 * Script pour corriger les imports cassés (sans chemin d'import)
 * Ajoute les chemins d'import manquants basés sur le nom de l'interface
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'apps', 'web', 'src');

// Mapping basé sur le nom de l'interface vers le fichier d'import
const interfaceToFileMap: Record<string, string> = {
  'IdentityCardData': './identity-card',
  'PressureSignal': './pressure.types',
  'AnswerAnalysis': './answer-analysis',
  'Job': './jobs',
  'InterviewPhase': './interview-context',
  'ConversationPhase': './conversation-state',
  'RiskScoreInput': './risk-score',
  'PremiumInterviewSession': './premium-interview',
};

async function main() {
  console.log('🔧 Correction des imports cassés');
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

    // Corriger les imports cassés: import { InterfaceName } from;
    const brokenImportRegex = /import\s*\{\s*([A-Z][a-zA-Z0-9_]*)\s*\}\s*from\s*;/g;
    content = content.replace(brokenImportRegex, (match, interfaceName) => {
      const importPath = interfaceToFileMap[interfaceName];
      if (importPath) {
        fileCorrections++;
        modified = true;
        return `import { ${interfaceName} } from '${importPath}';`;
      }
      return match;
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
