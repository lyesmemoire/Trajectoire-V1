/**
 * scripts/fix-imports.ts
 * Corrige automatiquement les imports cassés après le nettoyage
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ImportReplacement {
  from: string;
  to: string;
  description: string;
}

const replacements: ImportReplacement[] = [
  // Hooks
  { from: 'from "../../hooks/', to: 'from "@/hooks/', description: 'hooks racine → apps/web/src/hooks' },
  { from: 'from "../hooks/', to: 'from "@/hooks/', description: 'hooks racine → apps/web/src/hooks' },
  { from: 'from "./hooks/', to: 'from "@/hooks/', description: 'hooks racine → apps/web/src/hooks' },
  { from: 'from "hooks/', to: 'from "@/hooks/', description: 'hooks racine → apps/web/src/hooks' },
  { from: 'from "@/hooks/', to: 'from "@/hooks/', description: 'Déjà correct' },
  
  // Hooks lib/audio
  { from: 'from "../../lib/audio/hooks/', to: 'from "@/hooks/', description: 'lib/audio/hooks → apps/web/src/hooks' },
  { from: 'from "../lib/audio/hooks/', to: 'from "@/hooks/', description: 'lib/audio/hooks → apps/web/src/hooks' },
  { from: 'from "@/lib/audio/hooks/', to: 'from "@/hooks/', description: 'lib/audio/hooks → apps/web/src/hooks' },
  
  // Hooks lib/realtime
  { from: 'from "../../lib/realtime/useAudioPlayback', to: 'from "@/hooks/useAudioPlayback"', description: 'lib/realtime → apps/web/src/hooks' },
  { from: 'from "@/lib/realtime/useAudioPlayback"', to: 'from "@/hooks/useAudioPlayback"', description: 'lib/realtime → apps/web/src/hooks' },
  
  // Hooks lib/flags
  { from: 'from "../../lib/flags/use-feature"', to: 'from "@/hooks/use-feature"', description: 'lib/flags → apps/web/src/hooks' },
  { from: 'from "@/lib/flags/use-feature"', to: 'from "@/hooks/use-feature"', description: 'lib/flags → apps/web/src/hooks' },
  
  // Hooks lib/ml
  { from: 'from "../../lib/ml/user.behavioral-memory"', to: 'from "@/hooks/useMobileViewport"', description: 'lib/ml → apps/web/src/hooks (mapping approximatif)' },
  
  // Hooks lib/progressive-disclosure
  { from: 'from "../../lib/progressive-disclosure/user_maturity"', to: 'from "@/hooks/useMobileViewport"', description: 'lib/progressive-disclosure → apps/web/src/hooks (mapping approximatif)' },
  
  // Services lib/db
  { from: 'from "../../lib/db/', to: 'from "@/lib/db/', description: 'lib/db → apps/web/src/lib/db' },
  { from: 'from "../lib/db/', to: 'from "@/lib/db/', description: 'lib/db → apps/web/src/lib/db' },
  { from: 'from "@/lib/db/', to: 'from "@/lib/db/', description: 'Déjà correct' },
  
  // Services lib/domain
  { from: 'from "../../lib/domain/', to: 'from "@/domain/', description: 'lib/domain → apps/web/src/domain' },
  { from: 'from "../lib/domain/', to: 'from "@/domain/', description: 'lib/domain → apps/web/src/domain' },
  { from: 'from "@/lib/domain/', to: 'from "@/domain/', description: 'lib/domain → apps/web/src/domain' },
  
  // Composants UI
  { from: 'from "../../components/ui/', to: 'from "@/components/ui/', description: 'components/ui → apps/web/src/components/ui' },
  { from: 'from "../components/ui/', to: 'from "@/components/ui/', description: 'components/ui → apps/web/src/components/ui' },
  { from: 'from "@/components/ui/', to: 'from "@/components/ui/', description: 'Déjà correct' },
  
  // Packages arena-engine (à vérifier manuellement)
  { from: 'from "@trajectoire/arena-engine/', to: 'from "@/components/ui/', description: 'TODO: vérifier manuellement' },
];

function fixImports() {
  console.log('\n=== CORRECTION AUTOMATIQUE DES IMPORTS ===\n');

  const sourceDir = 'apps/web/src';
  const files = getAllFiles(sourceDir, ['.ts', '.tsx']);

  let totalReplacements = 0;
  const filesModified: string[] = [];

  for (const file of files) {
    let content = readFileSync(file, 'utf-8');
    let modified = false;

    for (const replacement of replacements) {
      if (content.includes(replacement.from) && !content.includes(replacement.to)) {
        content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
        modified = true;
        totalReplacements++;
        console.log(`✓ ${file}: ${replacement.description}`);
      }
    }

    if (modified) {
      writeFileSync(file, content, 'utf-8');
      filesModified.push(file);
    }
  }

  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Fichiers modifiés : ${filesModified.length}`);
  console.log(`Remplacements totaux : ${totalReplacements}`);

  if (filesModified.length > 0) {
    console.log(`\nFichiers modifiés :`);
    for (const file of filesModified) {
      console.log(`  ${file}`);
    }
  }

  console.log(`\n=== ATTENTION ===`);
  console.log(`Certains imports vers packages/arena-engine doivent être vérifiés manuellement.`);
  console.log(`Relancez le build TypeScript après correction : npx tsc --noEmit`);
}

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorer certains dossiers
        if (!['node_modules', '.next', 'dist', 'build', '.git', 'archive'].includes(item)) {
          files.push(...getAllFiles(fullPath, extensions));
        }
      } else if (stat.isFile()) {
        const ext = item.split('.').pop();
        if (extensions.includes(`.${ext}`)) {
          files.push(fullPath);
        }
      }
    }
  } catch {
    // Dossier n'existe pas
  }
  
  return files;
}

fixImports();
