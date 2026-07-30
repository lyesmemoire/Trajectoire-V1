#!/usr/bin/env tsx
/**
 * Script pour corriger les imports et utilisations d'interfaces renommées
 * Remplace les imports de 'any' par les noms corrects des interfaces
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'apps', 'web', 'src');

// Mapping basé sur le fichier d'import
const importNameMap: Record<string, string> = {
  'IWorldModelEngine': 'Job',
  'InterviewContext': 'InterviewPhase',
  'ConversationState': 'ConversationPhase',
  'answer-analysis': 'AnswerAnalysis',
  'risk-score': 'RiskScoreInput',
  'pressure.types': 'PressureSignal',
  'jobs': 'Job',
  'identity-card': 'IdentityCardData',
  'premium-interview': 'PremiumInterviewSession',
};

async function main() {
  console.log('🔧 Correction des imports et utilisations d\'interfaces');
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

    // Corriger les imports de 'any' depuis des fichiers spécifiques
    for (const [importFile, interfaceName] of Object.entries(importNameMap)) {
      // Import: import { any } from './...'
      const importRegex = new RegExp(`import\\s*\\{\\s*any\\s*\\}\\s*from\\s*['"].*${importFile}['"]`, 'g');
      const importMatches = content.match(importRegex);
      if (importMatches) {
        content = content.replace(importRegex, `import { ${interfaceName} } from`);
        fileCorrections += importMatches.length;
        modified = true;
      }

      // Utilisation: any. (comme any.INTRODUCTION)
      const usageRegex = new RegExp(`\\bany\\.`, 'g');
      // On ne remplace que si c'est dans un fichier qui importe de InterviewContext
      if (content.includes(`from './InterviewContext'`) || content.includes(`from './interview-context'`)) {
        const usageMatches = content.match(usageRegex);
        if (usageMatches) {
          content = content.replace(usageRegex, 'InterviewPhase.');
          fileCorrections += usageMatches.length;
          modified = true;
        }
      }
    }

    // Corriger les imports génériques de 'any'
    const genericImportRegex = /import\s*\{\s*any\s*\}\s*from\s*['"].*['"]/g;
    const genericMatches = content.match(genericImportRegex);
    if (genericMatches) {
      // Pour les imports génériques, on essaie de deviner le bon nom basé sur le contexte
      // Si le fichier est dans le même répertoire que l'interface, on utilise le nom de l'interface
      const filePath = path.relative(WEB_DIR, file);
      const dirPath = path.dirname(filePath);
      
      for (const [importFile, interfaceName] of Object.entries(importNameMap)) {
        if (dirPath.includes(importFile) || filePath.includes(importFile)) {
          content = content.replace(genericImportRegex, `import { ${interfaceName} } from`);
          fileCorrections += genericMatches.length;
          modified = true;
          break;
        }
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
  console.log('✨ Correction terminée avec succès');
}

main().catch(console.error);
