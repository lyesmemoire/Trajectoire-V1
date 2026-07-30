#!/usr/bin/env tsx
/**
 * Script pour corriger les variables err non définies dans les blocs catch
 * Remplace err par error si error est déjà défini, sinon ajoute : any
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
  console.log('🔧 Correction des variables err non définies dans les blocs catch');
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

    // Corriger les variables err non définies dans les blocs catch
    // Pattern: catch (error) { ... err }
    const catchErrorRegex = /catch\s*\(\s*error\s*\)\s*\{[^}]*\berr\b/g;
    content = content.replace(catchErrorRegex, (match) => {
      fileCorrections++;
      modified = true;
      return match.replace(/\berr\b/g, 'error');
    });

    // Corriger les variables e non définies dans les blocs catch
    // Pattern: catch (error) { ... e }
    const catchErrorERegex = /catch\s*\(\s*error\s*\)\s*\{[^}]*\be\b/g;
    content = content.replace(catchErrorERegex, (match) => {
      fileCorrections++;
      modified = true;
      return match.replace(/\be\b/g, 'error');
    });

    // Corriger les catch sans type: catch (err) -> catch (err: any)
    const catchNoTypeRegex = /catch\s*\(\s*err\s*\)/g;
    content = content.replace(catchNoTypeRegex, () => {
      fileCorrections++;
      modified = true;
      return 'catch (err: any)';
    });

    // Corriger les catch sans type: catch (e) -> catch (e: any)
    const catchENoTypeRegex = /catch\s*\(\s*e\s*\)/g;
    content = content.replace(catchENoTypeRegex, () => {
      fileCorrections++;
      modified = true;
      return 'catch (e: any)';
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
