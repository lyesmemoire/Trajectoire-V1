/**
 * replay.cjs — Replay certification and compare with a reference run
 * Usage: node certification/replay.cjs [reference-run-dir]
 */
const fs = require('fs');
const path = require('path');
const { certify } = require('./certify.cjs');
const { sha256File } = require('./hash.cjs');

function replay(referenceRunDir) {
  console.log('[REPLAY] === Replay & Compare ===\n');

  if (!referenceRunDir) {
    const runsDir = path.join(__dirname, 'runs');
    if (fs.existsSync(runsDir)) {
      const dirs = fs.readdirSync(runsDir).sort().reverse();
      if (dirs.length > 0) referenceRunDir = path.join(runsDir, dirs[0]);
    }
  }

  if (!referenceRunDir || !fs.existsSync(referenceRunDir)) {
    console.log('[REPLAY] No reference run found. Running fresh certification...');
    const result = certify();
    console.log(`[REPLAY] Fresh run: ${result.runId} → ${result.decision}`);
    return;
  }

  // Load reference manifest
  const refManifest = JSON.parse(fs.readFileSync(path.join(referenceRunDir, 'manifest.json'), 'utf8'));
  console.log(`[REPLAY] Reference: ${path.basename(referenceRunDir)}`);
  console.log(`[REPLAY] Reference SHA: ${refManifest.metadata.gitSha}\n`);

  // Run new certification
  const result = certify();
  const newRunDir = result.runDir;

  // Compare
  console.log('\n[REPLAY] === Comparison ===\n');
  const diffs = [];

  // Compare artifacts
  const artifactNames = ['coverage-report.json', 'mutation-report.json', 'regression-report.json', 'certification.json'];
  for (const name of artifactNames) {
    const refPath = path.join(referenceRunDir, name);
    const newPath = path.join(newRunDir, name);

    if (!fs.existsSync(refPath)) { console.log(`  ⚠️  ${name}: missing in reference`); continue; }
    if (!fs.existsSync(newPath)) { console.log(`  ⚠️  ${name}: missing in new run`); continue; }

    const refData = JSON.parse(fs.readFileSync(refPath, 'utf8'));
    const newData = JSON.parse(fs.readFileSync(newPath, 'utf8'));

    // Compare structural metrics (not timestamps or durations)
    if (name === 'coverage-report.json') {
      const refM = refData.content?.metrics || {};
      const newM = newData.content?.metrics || {};
      const match = refM.statements === newM.statements && refM.branches === newM.branches && refM.functions === newM.functions && refM.lines === newM.lines;
      if (match) console.log(`  ✅ ${name}: metrics identical`);
      else { console.log(`  ❌ ${name}: metrics differ`); diffs.push({ file: name, ref: refM, new: newM }); }
    }

    if (name === 'mutation-report.json') {
      const refS = refData.content?.summary || {};
      const newS = newData.content?.summary || {};
      const match = refS.killed === newS.killed && refS.survived === newS.survived && refS.invalid === newS.invalid;
      if (match) console.log(`  ✅ ${name}: summary identical`);
      else { console.log(`  ❌ ${name}: summary differs`); diffs.push({ file: name, ref: refS, new: newS }); }
    }

    if (name === 'regression-report.json') {
      const refS = refData.content?.summary || {};
      const newS = newData.content?.summary || {};
      const match = refS.detected === newS.detected && refS.missed === newS.missed && refS.buildErrors === newS.buildErrors;
      if (match) console.log(`  ✅ ${name}: summary identical`);
      else { console.log(`  ❌ ${name}: summary differs`); diffs.push({ file: name, ref: refS, new: newS }); }
    }

    if (name === 'certification.json') {
      const refD = refData.decision?.level;
      const newD = newData.decision?.level;
      if (refD === newD) console.log(`  ✅ ${name}: decision identical (${refD})`);
      else { console.log(`  ❌ ${name}: decision differs (${refD} vs ${newD})`); diffs.push({ file: name, ref: refD, new: newD }); }
    }
  }

  const reproducible = diffs.length === 0;
  console.log(`\n[REPLAY] Result: ${reproducible ? 'REPRODUCIBLE ✅' : 'NOT REPRODUCIBLE ❌'}`);
  if (diffs.length > 0) {
    console.log(`[REPLAY] ${diffs.length} differences found:`);
    for (const d of diffs) console.log(`  - ${d.file}`);
  }

  // Write comparison report
  fs.writeFileSync(path.join(newRunDir, 'replay-comparison.json'), JSON.stringify({
    referenceRun: path.basename(referenceRunDir),
    newRun: result.runId,
    reproducible,
    diffs,
    comparedAt: new Date().toISOString()
  }, null, 2));

  return { reproducible, diffs, newRunId: result.runId };
}

module.exports = { replay };
if (require.main === module) {
  const ref = process.argv[2];
  replay(ref);
}
