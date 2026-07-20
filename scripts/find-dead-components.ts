/**
 * scripts/find-dead-components.ts
 * Détecte les composants UI morts (non utilisés)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ComponentInfo {
  path: string;
  name: string;
  isUsed: boolean;
  usedBy: string[];
}

function findDeadComponents() {
  console.log('\n=== ANALYSE DES COMPOSANTS UI ===\n');

  // Dossiers de composants à analyser
  const componentDirs = [
    'components/ui',
    'apps/web/src/components/ui',
    'packages/arena-engine/components/ui',
  ];

  const allComponents: ComponentInfo[] = [];

  // Tout le code source de apps/web
  const sourceFiles = getAllFiles('apps/web/src', ['.ts', '.tsx']);
  const allSourceContent = sourceFiles
    .map(f => readFileSync(f, 'utf-8'))
    .join('\n');

  for (const dir of componentDirs) {
    try {
      const files = getAllFiles(dir, ['.ts', '.tsx']);
      
      for (const file of files) {
        const componentName = getComponentName(file);
        if (!componentName) continue;

        // Chercher si ce composant est importé quelque part dans apps/web
        const isUsed = allSourceContent.includes(componentName);
        
        // Trouver qui l'utilise
        const usedBy: string[] = [];
        if (isUsed) {
          for (const sourceFile of sourceFiles) {
            const content = readFileSync(sourceFile, 'utf-8');
            if (content.includes(componentName)) {
              usedBy.push(sourceFile.replace('apps/web/src/', ''));
            }
          }
        }

        allComponents.push({
          path: file,
          name: componentName,
          isUsed,
          usedBy,
        });
      }
    } catch (error) {
      // Dossier n'existe pas
    }
  }

  // Afficher les résultats
  const used = allComponents.filter(c => c.isUsed);
  const dead = allComponents.filter(c => !c.isUsed);

  console.log('✅ COMPOSANTS UTILISÉS (à garder) :');
  for (const comp of used) {
    console.log(`  ${comp.name}`);
    console.log(`    Chemin: ${comp.path}`);
    console.log(`    Utilisé par: ${comp.usedBy.length} fichiers`);
  }

  console.log('\n❌ COMPOSANTS MORTS (à archiver) :');
  for (const comp of dead) {
    console.log(`  ${comp.name}`);
    console.log(`    Chemin: ${comp.path}`);
  }

  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Total: ${allComponents.length} composants`);
  console.log(`Utilisés: ${used.length}`);
  console.log(`Morts: ${dead.length}`);
}

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, extensions));
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

function getComponentName(filePath: string): string | null {
  const fileName = filePath.split(/[/\\]/).pop();
  if (!fileName) return null;
  
  const nameWithoutExt = fileName.replace(/\.(ts|tsx)$/, '');
  
  // Ignorer les fichiers de test, index, etc.
  if (nameWithoutExt.includes('.test') || 
      nameWithoutExt.includes('.spec') ||
      nameWithoutExt === 'index') {
    return null;
  }
  
  return nameWithoutExt;
}

findDeadComponents();
