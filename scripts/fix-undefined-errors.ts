#!/usr/bin/env tsx
/**
 * Script pour corriger les erreurs de la famille Undefined
 * Corrige les variables non définies (createClient, GovernorDecision, RuntimeDecision, etc.)
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
  console.log('🔧 Correction des erreurs de la famille Undefined');
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

    // Corriger createClient non défini (remplacer par createClient de @supabase/supabase-js)
    const createClientRegex = /\bcreateClient\b/g;
    const createClientMatches = content.match(createClientRegex);
    if (createClientMatches) {
      // Vérifier si l'import est déjà présent
      if (!content.includes('import { createClient } from')) {
        // Ajouter l'import au début du fichier
        const importLine = "import { createClient } from '@supabase/supabase-js';";
        content = importLine + '\n' + content;
        fileCorrections++;
        modified = true;
      }
    }

    // Corriger GovernorDecision non défini (ajouter import)
    const governorDecisionRegex = /\bGovernorDecision\b/g;
    const governorDecisionMatches = content.match(governorDecisionRegex);
    if (governorDecisionMatches) {
      if (!content.includes('GovernorDecision')) {
        // Ajouter l'import depuis le bon fichier
        const importLine = "import { GovernorDecision } from '@/core/p5/contracts/governor.contract';";
        content = importLine + '\n' + content;
        fileCorrections++;
        modified = true;
      }
    }

    // Corriger RuntimeDecision non défini (ajouter import)
    const runtimeDecisionRegex = /\bRuntimeDecision\b/g;
    const runtimeDecisionMatches = content.match(runtimeDecisionRegex);
    if (runtimeDecisionMatches) {
      if (!content.includes('RuntimeDecision')) {
        const importLine = "import { RuntimeDecision } from '@/core/p5/contracts/runtime.contract';";
        content = importLine + '\n' + content;
        fileCorrections++;
        modified = true;
      }
    }

    // Corriger les variables 'e' non définies dans les blocs catch
    const catchERegex = /catch\s*\(\s*e\s*\)/g;
    content = content.replace(catchERegex, () => {
      fileCorrections++;
      modified = true;
      return 'catch (e: any)';
    });

    // Corriger _BillingState non défini (remplacer par BillingState)
    const billingStateRegex = /\b_BillingState\b/g;
    content = content.replace(billingStateRegex, () => {
      fileCorrections++;
      modified = true;
      return 'BillingState';
    });

    // Corriger _undefined non défini (remplacer par undefined)
    const undefinedRegex = /\b_undefined\b/g;
    content = content.replace(undefinedRegex, () => {
      fileCorrections++;
      modified = true;
      return 'undefined';
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
