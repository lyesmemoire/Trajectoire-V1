#!/usr/bin/env tsx
/**
 * Script pour corriger les imports en double créés par les corrections automatiques
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
  console.log('🔧 Correction des imports en double');
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

    // Détecter les imports en double avec le même module
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
    const importsByModule = new Map<string, Set<string>>();
    const importLines: Array<{ line: string; module: string; imports: string[]; fullMatch: string }> = [];

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const imports = match[1].split(',').map(s => s.trim());
      const module = match[2];
      
      if (!importsByModule.has(module)) {
        importsByModule.set(module, new Set());
      }
      
      for (const imp of imports) {
        if (importsByModule.get(module)!.has(imp)) {
          // Import en double détecté
          fileCorrections++;
          modified = true;
        } else {
          importsByModule.get(module)!.add(imp);
        }
      }
      
      importLines.push({ line: fullMatch, module, imports, fullMatch });
    }

    if (modified) {
      // Reconstruire les imports sans doublons
      const newImports: string[] = [];
      const seenModules = new Set<string>();
      
      for (const imp of importLines) {
        if (!seenModules.has(imp.module)) {
          seenModules.add(imp.module);
          const uniqueImports = Array.from(importsByModule.get(imp.module)!).join(', ');
          newImports.push(`import { ${uniqueImports} } from '${imp.module}';`);
        }
      }
      
      // Remplacer tous les imports par les imports uniques
      const importSection = newImports.join('\n');
      content = content.replace(/import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"][;\s]*/g, '');
      
      // Ajouter les imports uniques au début du fichier
      const firstNonImportLine = content.split('\n').findIndex(line => 
        !line.trim().startsWith('import') && line.trim() !== ''
      );
      
      if (firstNonImportLine > 0) {
        const lines = content.split('\n');
        lines.splice(0, firstNonImportLine, ...newImports);
        content = lines.join('\n');
      } else {
        content = newImports.join('\n') + '\n' + content;
      }
      
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
