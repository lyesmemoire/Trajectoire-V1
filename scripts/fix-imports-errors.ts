#!/usr/bin/env tsx
/**
 * Script pour corriger les erreurs de la famille Imports
 * Corrige les imports cassés et manquants
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
  console.log('🔧 Correction des erreurs de la famille Imports');
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

    // Corriger les imports manquants de types Core P5/P6/P7
    const coreTypes = [
      'GovernorDecision',
      'RuntimeDecision',
      'MindState',
      'MindSnapshot',
      'Timeline',
      'Transaction',
      'VoiceExecutionPlan',
      'ExplanationGraph',
      'ReportInput',
      'ReportSummary'
    ];

    for (const type of coreTypes) {
      const typeRegex = new RegExp(`\\b${type}\\b`, 'g');
      const matches = content.match(typeRegex);
      if (matches && matches.length > 0 && !content.includes(`import.*${type}`)) {
        // Ajouter l'import approprié
        let importLine = '';
        if (type === 'GovernorDecision') {
          importLine = "import { GovernorDecision } from '@/core/p5/contracts/governor.contract';";
        } else if (type === 'RuntimeDecision') {
          importLine = "import { RuntimeDecision } from '@/core/p5/contracts/runtime.contract';";
        } else if (type === 'MindState' || type === 'MindSnapshot') {
          importLine = `import { ${type} } from '@/core/p6/contracts/mind.contract';`;
        } else if (type === 'Timeline' || type === 'Transaction') {
          importLine = `import { ${type} } from '@/core/p6/contracts/timeline.contract';`;
        } else if (type === 'VoiceExecutionPlan') {
          importLine = "import { VoiceExecutionPlan } from '@/core/p7/contracts/voice.contract';";
        } else if (type === 'ExplanationGraph') {
          importLine = "import { ExplanationGraph } from '@/core/p7/contracts/explanation.contract';";
        } else if (type === 'ReportInput' || type === 'ReportSummary') {
          importLine = `import { ${type} } from '@/core/p7/contracts/report.contract';`;
        }

        if (importLine) {
          content = importLine + '\n' + content;
          fileCorrections++;
          modified = true;
        }
      }
    }

    // Corriger les imports cassés avec 'any'
    const anyImportRegex = /import\s*\{\s*any\s*\}\s*from\s*['"]([^'"]+)['"]/g;
    content = content.replace(anyImportRegex, (match, modulePath) => {
      fileCorrections++;
      modified = true;
      return `import * as ${modulePath.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '')} from '${modulePath}';`;
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
