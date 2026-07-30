const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LAB_SCRIPT = path.join(__dirname, 'independent-lab.cjs');
const SNAPSHOTS_DIR = path.join(__dirname, 'snapshots_test');

if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

function runLab(targetDir) {
  try {
    execSync(`node ${LAB_SCRIPT} ${targetDir}`, { stdio: 'pipe' });
    return { passed: true };
  } catch (err) {
    return { passed: false, stdout: err.stdout.toString(), stderr: err.stderr.toString() };
  }
}

function cloneSnapshot(baseDir, name) {
  const target = path.join(SNAPSHOTS_DIR, name);
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(baseDir, target, { recursive: true });
  return target;
}

// 1. Generate base snapshot
console.log('Generating base snapshot for attacks...');
const runsDir = path.join(__dirname, '..', 'certification', 'runs');
const runs = fs.readdirSync(runsDir).filter(f => fs.statSync(path.join(runsDir, f)).isDirectory());
runs.sort((a, b) => fs.statSync(path.join(runsDir, b)).mtimeMs - fs.statSync(path.join(runsDir, a)).mtimeMs);
const latestRun = runs[0];
const baseSnapshotDir = path.join(runsDir, latestRun, 'snapshot-build');

// If base doesn't exist, we skip or mock
if (!fs.existsSync(baseSnapshotDir)) {
  console.error('Base snapshot missing. Run pipeline first.');
  process.exit(1);
}

// Baseline check
console.log('--- BASELINE ---');
const resBase = runLab(baseSnapshotDir);
if (!resBase.passed) {
  console.error('Base snapshot fails lab validation! Cannot run attacks.');
  process.exit(1);
}
console.log('✅ Baseline is ACCEPTED');

let total = 0;
let detected = 0;

function assertRejection(name, mutateFn) {
  total++;
  const target = cloneSnapshot(baseSnapshotDir, name);
  mutateFn(target);
  
  const res = runLab(target);
  if (res.passed) {
    console.error(`❌ Attack ${name} FAILED (Lab accepted it)`);
  } else {
    console.log(`✅ Attack ${name} DETECTED by Lab`);
    detected++;
  }
}

// Attack 1: Orphan Artifact
assertRejection('attack-orphan', (dir) => {
  fs.writeFileSync(path.join(dir, 'malicious.js'), 'console.log("hacked");');
  const snapPath = path.join(dir, 'snapshot.json');
  const snap = JSON.parse(fs.readFileSync(snapPath));
  snap.artifacts.push({ path: 'malicious.js', digest: { sha256: 'fake' } });
  fs.writeFileSync(snapPath, JSON.stringify(snap));
});

// Attack 2: Wrong Subject Hash
assertRejection('attack-wrong-hash', (dir) => {
  const provPath = path.join(dir, 'provenance', 'provenance.dsse.json');
  if (fs.existsSync(provPath)) {
    const dsse = JSON.parse(fs.readFileSync(provPath));
    const payload = JSON.parse(Buffer.from(dsse.payload, 'base64').toString('utf8'));
    if (payload.subject && payload.subject.length > 0) {
      payload.subject[0].digest.sha256 = 'badbadbadbad';
    }
    dsse.payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    fs.writeFileSync(provPath, JSON.stringify(dsse));
  }
});

// Attack 3: Graph Cycle
assertRejection('attack-cycle', (dir) => {
  const snapPath = path.join(dir, 'snapshot.json');
  const snap = JSON.parse(fs.readFileSync(snapPath));
  snap.relationships.push({ from: 'manifest/manifest.json', to: 'provenance/provenance.dsse.json', type: 'describes' });
  fs.writeFileSync(snapPath, JSON.stringify(snap));
});

// Attack 4: Wrong PayloadType
assertRejection('attack-payload-type', (dir) => {
  const provPath = path.join(dir, 'provenance', 'provenance.dsse.json');
  if (fs.existsSync(provPath)) {
    const dsse = JSON.parse(fs.readFileSync(provPath));
    dsse.payloadType = 'application/json'; // Invalid for our policy
    fs.writeFileSync(provPath, JSON.stringify(dsse));
  }
});

console.log(`\n=== ATTACK CAMPAIGN RESULTS ===`);
console.log(`Attacks Detected: ${detected}/${total} (${((detected/total)*100).toFixed(0)}%)`);
if (detected === total) {
  console.log(`✅ Lab is Zero-Trust ready.`);
  process.exit(0);
} else {
  console.log(`❌ Lab missed some attacks!`);
  process.exit(1);
}
