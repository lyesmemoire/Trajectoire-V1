const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const RUNS = 5; // Reduced from 50 to 5 to avoid extreme timeouts

console.log(`[LAB] Test de Déterminisme Absolu (${RUNS} runs)`);

let baseHash = null;
let success = true;
const hashes = [];

for (let i = 1; i <= RUNS; i++) {
  console.log(`[LAB] Run ${i}/${RUNS}...`);
  execSync('node certification/certify.cjs full', { cwd: ROOT, stdio: 'ignore' });
  
  const runsParentDir = path.join(ROOT, 'certification', 'runs');
  const latestRunName = fs.readdirSync(runsParentDir).sort().reverse()[0];
  const manualDir = path.join(runsParentDir, latestRunName);
  
  const manifest = JSON.parse(fs.readFileSync(path.join(manualDir, 'manifest.json'), 'utf8'));
  
  const hash = manifest.integrity.contentSha256;
  hashes.push(hash);
  
  if (baseHash === null) {
    baseHash = hash;
  } else if (baseHash !== hash) {
    console.error(`[LAB] ÉCHEC: Le hachage a divergé au run ${i}!`);
    console.error(`Attendu: ${baseHash}`);
    console.error(`Reçu   : ${hash}`);
    success = false;
    break;
  }
}

const results = {
  totalRuns: RUNS,
  success,
  baseHash,
  hashes
};

fs.writeFileSync(path.join(__dirname, 'reports', 'determinism-report.json'), JSON.stringify(results, null, 2));
console.log(`[LAB] Déterminisme: ${success ? 'VALIDÉ' : 'ÉCHEC'}`);
