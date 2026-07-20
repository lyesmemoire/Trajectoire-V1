/**
 * scripts/find-dead-hooks.ts
 * Détecte les hooks custom morts (non utilisés)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface HookInfo {
  path: string;
  name: string;
  isInAppsWeb: boolean;
  isUsedInAppsWeb: boolean;
  usedBy: string[];
}

function findDeadHooks() {
  console.log('\n=== ANALYSE DES HOOKS ===\n');

  // Trouver tous les hooks
  const allHooks = getAllFiles('.', ['.ts', '.tsx'])
    .filter(f => f.match(/use[A-Z]/) && !f.includes('node_modules') && !f.includes('.next') && !f.includes('dist'));

  const webSourceFiles = getAllFiles('apps/web/src', ['.ts', '.tsx']);
  const webContent = webSourceFiles
    .map(f => readFileSync(f, 'utf-8'))
    .join('\n');

  const hooksInfo: HookInfo[] = [];

  for (const hook of allHooks) {
    const hookName = getHookName(hook);
    if (!hookName) continue;

    const isInAppsWeb = hook.startsWith('apps/web');
    const isUsedInAppsWeb = webContent.includes(hookName);

    // Trouver qui l'utilise
    const usedBy: string[] = [];
    if (isUsedInAppsWeb) {
      for (const sourceFile of webSourceFiles) {
        const content = readFileSync(sourceFile, 'utf-8');
        if (content.includes(hookName)) {
          usedBy.push(sourceFile.replace('apps/web/src/', ''));
        }
      }
    }

    hooksInfo.push({
      path: hook,
      name: hookName,
      isInAppsWeb,
      isUsedInAppsWeb,
      usedBy,
    });
  }

  // Afficher les résultats
  const activeInAppsWeb = hooksInfo.filter(h => h.isInAppsWeb && h.isUsedInAppsWeb);
  const deadInAppsWeb = hooksInfo.filter(h => h.isInAppsWeb && !h.isUsedInAppsWeb);
  const externalUsed = hooksInfo.filter(h => !h.isInAppsWeb && h.isUsedInAppsWeb);
  const externalDead = hooksInfo.filter(h => !h.isInAppsWeb && !h.isUsedInAppsWeb);

  console.log('✅ ACTIFS (apps/web, utilisé) :');
  for (const hook of activeInAppsWeb) {
    console.log(`  ${hook.name}`);
    console.log(`    Chemin: ${hook.path}`);
    console.log(`    Utilisé par: ${hook.usedBy.length} fichiers`);
  }

  console.log('\n⚠️  MORTS (apps/web, non utilisé) :');
  for (const hook of deadInAppsWeb) {
    console.log(`  ${hook.name}`);
    console.log(`    Chemin: ${hook.path}`);
  }

  console.log('\n🔴 PROBLÈME (hors apps/web, mais utilisé par apps/web) :');
  for (const hook of externalUsed) {
    console.log(`  ${hook.name}`);
    console.log(`    Chemin: ${hook.path}`);
    console.log(`    Utilisé par: ${hook.usedBy.length} fichiers`);
  }

  console.log('\n❌ MORTS (hors apps/web, non utilisé par apps/web) :');
  for (const hook of externalDead) {
    console.log(`  ${hook.name}`);
    console.log(`    Chemin: ${hook.path}`);
  }

  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Total hooks: ${hooksInfo.length}`);
  console.log(`Actifs (apps/web): ${activeInAppsWeb.length}`);
  console.log(`Morts (apps/web): ${deadInAppsWeb.length}`);
  console.log(`Externes utilisés: ${externalUsed.length}`);
  console.log(`Externes morts: ${externalDead.length}`);
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
        if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(item)) {
          files.push(...getAllFiles(fullPath, extensions));
        }
      } else if (stat.isFile()) {
        const ext = item.split('.').pop();
        if (extensions.includes(`.${ext}`)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Dossier n'existe pas
  }
  
  return files;
}

function getHookName(filePath: string): string | null {
  const fileName = filePath.split(/[/\\]/).pop();
  if (!fileName) return null;
  
  const nameWithoutExt = fileName.replace(/\.(ts|tsx)$/, '');
  
  // Vérifier si c'est un hook (commence par "use" suivi d'une majuscule)
  if (!nameWithoutExt.match(/^use[A-Z]/)) {
    return null;
  }
  
  // Ignorer les fichiers de test
  if (nameWithoutExt.includes('.test') || nameWithoutExt.includes('.spec')) {
    return null;
  }
  
  return nameWithoutExt;
}

findDeadHooks();
