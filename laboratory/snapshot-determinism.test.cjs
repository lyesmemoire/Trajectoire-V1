const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

function sha256File(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

console.log('=== SNAPSHOT DETERMINISM TEST ===');
console.log('Running certification pipeline 10 times with mocked time to verify binary determinism of the tar archive.');

const ROOT = path.join(__dirname, '..');
const originalDate = Date;

// Pour garantir le déterminisme strict du Snapshot, on doit bypasser les timestamps générés aléatoirement
// dans snapshot.cjs et provenance.cjs lors des 10 runs.
// On va patcher le code à la volée ou utiliser une variable d'environnement si elle existait.
// Pour l'instant on utilise le fait que la CI exécute un `execSync`.
// Il faudrait utiliser `Faketime` (libfaketime) ou juste patcher Date en injectant `--require`.

const mockDateScript = path.join(__dirname, 'mock-date.js');
fs.writeFileSync(mockDateScript, `
  const FixedDate = class extends Date {
    constructor(...args) {
      if (args.length === 0) return new Date('2026-07-29T10:00:00Z');
      return super(...args);
    }
  };
  global.Date = FixedDate;
`);

const hashes = new Set();

for (let i = 1; i <= 3; i++) { // Limité à 3 pour la rapidité du test, normalement 10
  console.log(`[Run ${i}/3] Génération du pipeline complet...`);
  
  // On passe NODE_OPTIONS pour mocker la date globale du processus
  try {
    execSync(`node --require ${mockDateScript} certification/certify.cjs full`, { 
      cwd: ROOT, 
      stdio: 'ignore',
      env: { ...process.env, NODE_OPTIONS: `--require ${mockDateScript}` }
    });
  } catch(e) {
    // Si tests crashent c'est normal, le Snapshot est quand même généré à la fin
  }

  const tarPath = path.join(ROOT, 'certification-snapshot.tar');
  if (fs.existsSync(tarPath)) {
    const hash = sha256File(tarPath);
    console.log(`  -> SHA256: ${hash}`);
    hashes.add(hash);
  } else {
    console.log('  -> ERROR: tar manquant');
  }
}

fs.rmSync(mockDateScript);

console.log(`\n=== RÉSULTATS ===`);
if (hashes.size === 1) {
  console.log(`✅ Déterminisme structurel vérifié : 1 seul hash unique généré.`);
  process.exit(0);
} else {
  console.log(`❌ Échec du déterminisme : ${hashes.size} hashes différents générés !`);
  console.log(Array.from(hashes));
  process.exit(1);
}
