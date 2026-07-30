/**
 * archive.cjs — Clean old runs or export a run for external transfer
 */
const fs = require('fs');
const path = require('path');

const RUNS_DIR = path.join(__dirname, 'runs');

function cleanRuns() {
  if (!fs.existsSync(RUNS_DIR)) { console.log('[ARCHIVE] No runs directory'); return; }
  const dirs = fs.readdirSync(RUNS_DIR).sort();
  console.log(`[ARCHIVE] Found ${dirs.length} runs`);
  for (const d of dirs) {
    const fp = path.join(RUNS_DIR, d);
    if (fs.statSync(fp).isDirectory()) {
      fs.rmSync(fp, { recursive: true, force: true });
      console.log(`[ARCHIVE] Deleted: ${d}`);
    }
  }
  console.log('[ARCHIVE] All runs cleaned');
}

function listRuns() {
  if (!fs.existsSync(RUNS_DIR)) { console.log('[ARCHIVE] No runs'); return; }
  const dirs = fs.readdirSync(RUNS_DIR).sort();
  for (const d of dirs) {
    const certPath = path.join(RUNS_DIR, d, 'certification.json');
    let decision = 'N/A';
    if (fs.existsSync(certPath)) {
      const cert = JSON.parse(fs.readFileSync(certPath, 'utf8'));
      decision = cert.decision?.level || 'N/A';
    }
    console.log(`  ${d} → ${decision}`);
  }
}

module.exports = { cleanRuns, listRuns };
if (require.main === module) {
  const action = process.argv[2] || 'list';
  if (action === 'clean') cleanRuns();
  else listRuns();
}
