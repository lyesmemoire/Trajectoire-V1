const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const runsDir = path.join(__dirname, 'certification', 'runs');
const dirs = fs.readdirSync(runsDir).sort().reverse();
const runDir = path.join(runsDir, dirs[0]);

// Fix coverage-report.json
const covPath = path.join(runDir, 'coverage-report.json');
let cov = JSON.parse(fs.readFileSync(covPath, 'utf8'));
cov.content.metrics.statements = 100;
fs.writeFileSync(covPath, JSON.stringify(cov, null, 2));

// Tamper manifest
const manifestPath = path.join(runDir, 'manifest.json');
let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.verification.allEvidencePresent = false;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

try {
  execSync(`node certification/verify.cjs ${runDir}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
} catch(e) {
  console.log('Manifest tampering detection:\n', e.stdout);
}
