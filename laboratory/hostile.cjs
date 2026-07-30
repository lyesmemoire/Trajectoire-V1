const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const runsParentDir = path.join(ROOT, 'certification', 'runs');
let RUN_DIR = '';

console.log('[LAB] Lancement de la campagne hostile (Tests de fraude)');

function runVerify() {
  try {
    execSync('node certification/verify.cjs ' + RUN_DIR, { cwd: ROOT, stdio: 'ignore' });
    return true; // Passed
  } catch (e) {
    return false; // Failed
  }
}

// Ensure clean state
execSync('node certification/certify.cjs full', { cwd: ROOT, stdio: 'ignore' });
RUN_DIR = path.join(runsParentDir, fs.readdirSync(runsParentDir).sort().reverse()[0]);

const frauds = [
  {
    name: 'Modification du Coverage (Statements)',
    apply: () => {
      const p = path.join(RUN_DIR, 'coverage-report.json');
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      data.content.statements = 100;
      fs.writeFileSync(p, JSON.stringify(data, null, 2));
      return { file: p, original: data };
    }
  },
  {
    name: 'Altération du hash dans le Manifest',
    apply: () => {
      const p = path.join(RUN_DIR, 'manifest.json');
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (data.artifacts && data.artifacts.length > 0) {
        data.artifacts[0].contentSha256 = '0000000000000000000000000000000000000000000000000000000000000000';
      }
      fs.writeFileSync(p, JSON.stringify(data, null, 2));
      return { file: p, original: data };
    }
  },
  {
    name: 'Suppression d\'une preuve primaire',
    apply: () => {
      const p = path.join(RUN_DIR, 'coverage-final.json');
      const original = fs.readFileSync(p, 'utf8');
      fs.unlinkSync(p);
      return { file: p, originalContent: original };
    }
  },
  {
    name: 'Inversion de deux JSON',
    apply: () => {
      const p = path.join(RUN_DIR, 'mutation-report.json');
      const original = fs.readFileSync(p, 'utf8');
      fs.writeFileSync(p, '{"fake": true}');
      return { file: p, originalContent: original };
    }
  }
];

let successCount = 0;

for (const fraud of frauds) {
  console.log(`[LAB] Fraude: ${fraud.name}`);
  const state = fraud.apply();
  
  const passed = runVerify();
  if (passed) {
    console.error(`[LAB] ÉCHEC: Le pipeline a accepté la fraude '${fraud.name}'`);
  } else {
    console.log(`[LAB] DÉTECTÉ: Le pipeline a correctement rejeté la fraude.`);
    successCount++;
  }

  // Restore
  if (state.originalContent) {
    fs.writeFileSync(state.file, state.originalContent);
  } else if (state.original) {
    execSync('node certification/certify.cjs full', { cwd: ROOT, stdio: 'ignore' });
    RUN_DIR = path.join(runsParentDir, fs.readdirSync(runsParentDir).sort().reverse()[0]);
  }
}

const results = {
  total: frauds.length,
  detected: successCount,
  success: successCount === frauds.length
};

fs.writeFileSync(path.join(__dirname, 'reports', 'fraud-tests.json'), JSON.stringify(results, null, 2));
console.log(`[LAB] Bilan des fraudes: ${successCount}/${frauds.length} détectées.`);
