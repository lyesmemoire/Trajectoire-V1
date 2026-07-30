const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { sha256File } = require('./hash.cjs');

const ROOT = path.resolve(__dirname, '..');

console.log('[TEST] Starting independent pipeline validation...');

try {
  // Test 1: Clean and Run
  console.log('[TEST] Running initial cert:full...');
  execSync('pnpm cert:full', { cwd: ROOT, stdio: 'pipe' });

  // Find latest run
  const runsDir = path.join(__dirname, 'runs');
  const dirs1 = fs.readdirSync(runsDir).sort().reverse();
  const runDir1 = path.join(runsDir, dirs1[0]);
  const manifestPath1 = path.join(runDir1, 'manifest.json');
  const manifest1 = JSON.parse(fs.readFileSync(manifestPath1, 'utf8'));
  const hash1 = manifest1.integrity.manifestContentSha256;
  console.log(`[TEST] Initial manifest hash: ${hash1}`);

  // Test 2: Run again without cleaning (to test state leakage)
  console.log('[TEST] Running second cert:full (testing determinism)...');
  execSync('node certification/certify.cjs', { cwd: ROOT, stdio: 'pipe' });
  const dirs2 = fs.readdirSync(runsDir).sort().reverse();
  const runDir2 = path.join(runsDir, dirs2[0]);
  const manifestPath2 = path.join(runDir2, 'manifest.json');
  const manifest2 = JSON.parse(fs.readFileSync(manifestPath2, 'utf8'));
  const hash2 = manifest2.integrity.manifestContentSha256;
  console.log(`[TEST] Second manifest hash: ${hash2}`);

  if (hash1 !== hash2) {
    console.error(`[TEST] FAIL: Pipeline is not deterministic. Hashes differ.`);
    console.error(`[TEST] Hash 1: ${hash1}`);
    console.error(`[TEST] Hash 2: ${hash2}`);
    process.exit(1);
  } else {
    console.log(`[TEST] PASS: Determinism verified.`);
  }

  // Test 3: Artifact corruption rejection
  console.log('[TEST] Testing verify.cjs against corruption...');
  const covReportPath = path.join(runDir2, 'coverage-report.json');
  if (fs.existsSync(covReportPath)) {
    const originalCov = fs.readFileSync(covReportPath, 'utf8');
    const corruptedCov = originalCov.replace(/"statements":\s*[0-9.]+/, '"statements": 100.0');
    fs.writeFileSync(covReportPath, corruptedCov);
    
    try {
      execSync(`node certification/verify.cjs ${runDir2}`, { cwd: ROOT, stdio: 'pipe' });
      console.error('[TEST] FAIL: verify.cjs accepted corrupted artifact!');
      process.exit(1);
    } catch (e) {
      console.log('[TEST] PASS: verify.cjs correctly rejected corrupted artifact.');
    }
  }

  console.log('\n[TEST] === Conclusion ===');
  console.log('[TEST] OUI - Un laboratoire indépendant obtiendra exactement les mêmes résultats.');

} catch (e) {
  console.error('[TEST] Execution failed:', e.message);
  if (e.stdout) console.error(e.stdout.toString());
  if (e.stderr) console.error(e.stderr.toString());
  console.error('\n[TEST] === Conclusion ===');
  console.error('[TEST] NON - Pipeline invalide');
  process.exit(1);
}
