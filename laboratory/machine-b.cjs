const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
// 1. Get Machine A Hash
try { execSync('node certification/certify.cjs full', { cwd: ROOT, stdio: 'ignore' }); } catch(e) {}
const runsParentDir = path.join(ROOT, 'certification', 'runs');
const latestRunName = fs.readdirSync(runsParentDir).sort().reverse()[0];
const RUN_DIR = path.join(runsParentDir, latestRunName);

const manifestA = JSON.parse(fs.readFileSync(path.join(RUN_DIR, 'manifest.json'), 'utf8'));
const hashA = manifestA.integrity.manifestContentSha256;
console.log(`[LAB] Hash Machine A: ${hashA}`);

// 2. Clone to Machine B (Temp dir)
const machineBDir = path.join(os.tmpdir(), 'Trajectoire-MachineB-' + Date.now());
fs.mkdirSync(machineBDir, { recursive: true });

try {
  // Use robust copy in Windows
  execSync(`xcopy "${ROOT}" "${machineBDir}" /E /I /H /Y /EXCLUDE:laboratory\\exclude.txt`, { stdio: 'ignore' });
} catch (e) {
  // Ignore xcopy minor errors if any
}

// 3. Install and run in Machine B
try {
  console.log('[LAB] Installation sur Machine B...');
  execSync('npm install -g pnpm', { cwd: machineBDir, stdio: 'ignore' });
  execSync('pnpm install', { cwd: machineBDir, stdio: 'ignore' });
  
  console.log('[LAB] Exécution de cert:full sur Machine B...');
  try { execSync('node certification/certify.cjs full', { cwd: machineBDir, stdio: 'ignore' }); } catch(e) {}
  
  const bRunsDir = path.join(machineBDir, 'certification', 'runs');
  const bLatestRun = fs.readdirSync(bRunsDir).sort().reverse()[0];
  const manifestB = JSON.parse(fs.readFileSync(path.join(bRunsDir, bLatestRun, 'manifest.json'), 'utf8'));
  const hashB = manifestB.integrity.manifestContentSha256;
  
  console.log(`[LAB] Hash Machine B: ${hashB}`);
  
  if (hashA === hashB) {
    console.log('[LAB] SUCCÈS: Reproductibilité inter-machines prouvée.');
  } else {
    console.error('[LAB] ÉCHEC: Divergence de hash inter-machines.');
  }
} finally {
  try {
    fs.rmSync(machineBDir, { recursive: true, force: true });
  } catch(e) {}
}
