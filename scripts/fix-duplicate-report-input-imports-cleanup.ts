#!/usr/bin/env tsx
/**
 * Script pour nettoyer les imports en double de ReportInput
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
  console.log('🔧 Nettoyage des imports en double de ReportInput');
  console.log('📁 Répertoire:', WEB_DIR);
  console.log('');

  const files = await glob('core/p7/report/**/*.ts', {
    cwd: WEB_DIR,
    absolute: true,
  });

  let totalCorrections = 0;
  let filesModified = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    let fileCorrections = 0;

    // Supprimer les imports en double de ReportInput
    const importRegex = /import\s+{([^}]+)}\s+from\s+["']\.\/report-contract\.js["'];?\n?/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        full: match[0],
        items: match[1].split(',').map(s => s.trim())
      });
    }
    
    if (imports.length > 1) {
      // Fusionner tous les imports en un seul
      const allItems = new Set();
      imports.forEach(imp => {
        imp.items.forEach(item => allItems.add(item));
      });
      
      const mergedImport = `import { ${Array.from(allItems).join(', ')} } from "./report-contract.js";\n`;
      
      // Supprimer tous les imports existants
      content = content.replace(importRegex, '');
      
      // Insérer le fusionné au début
      content = mergedImport + content;
      
      fileCorrections = 1;
      modified = true;
    }

    // Nettoyer les lignes vides multiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

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
  console.log('✨ Nettoyage terminé avec succès');
}

main().catch(console.error);
