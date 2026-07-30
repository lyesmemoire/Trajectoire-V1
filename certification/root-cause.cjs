/**
 * root-cause.cjs — Automated root cause analysis for failed/survived mutations
 */
const fs = require('fs');
const path = require('path');
const { sha256, sha256Artifact } = require('./hash.cjs');
const { captureEnvironment } = require('./evidence.cjs');

function analyzeRootCauses(runDir, logDir) {
  const startedAt = new Date().toISOString();
  const env = captureEnvironment();

  const mutPath = path.join(runDir, 'mutation-report.json');
  const regPath = path.join(runDir, 'regression-report.json');
  const causes = [];

  if (fs.existsSync(mutPath)) {
    const mut = JSON.parse(fs.readFileSync(mutPath, 'utf8'));
    for (const m of (mut.content.mutations || [])) {
      if (m.status === 'SURVIVED') {
        causes.push({ source: 'mutation', id: m.id, description: m.description, status: m.status, rootCause: `Mutation at line ${m.line} (${m.description}) survived — no test detects the difference between "${m.original}" and "${m.mutated}"`, recommendation: `Add a test that asserts the exact behavior affected by line ${m.line}` });
      }
    }
  }

  if (fs.existsSync(regPath)) {
    const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    for (const r of (reg.content.regressions || [])) {
      if (r.status === 'REGRESSION_MISSED') {
        causes.push({ source: 'regression', id: r.id, description: r.description, status: r.status, rootCause: `Regression ${r.id} (${r.description}) not detected — tests pass even with the destructive change`, recommendation: `Add assertion covering the behavior of line ${r.line}` });
      }
    }
  }

  const completedAt = new Date().toISOString();
  const artifact = {
    schemaVersion: '1.0.0',
    artifactType: 'ROOT_CAUSE_REPORT',
    metadata: { id: `RC-${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}`, createdAt: completedAt, component: 'execution-pipeline', sourceFile: 'compiler/cvm/execution-pipeline.ts', gitSha: env.gitSha, gitBranch: env.gitBranch, gitClean: env.gitClean },
    provenance: { command: 'node certification/root-cause.cjs', script: 'certification/root-cause.cjs', environment: { nodeVersion: env.nodeVersion }, startedAt, completedAt, durationMs: new Date(completedAt) - new Date(startedAt), exitCode: 0 },
    content: { totalCauses: causes.length, causes },
    evidenceRefs: [
      { type: 'SECONDARY', file: 'mutation-report.json', sha256: fs.existsSync(mutPath) ? require('./hash.cjs').sha256File(mutPath) : 'N/A' },
      { type: 'SECONDARY', file: 'regression-report.json', sha256: fs.existsSync(regPath) ? require('./hash.cjs').sha256File(regPath) : 'N/A' }
    ],
    integrity: {}
  };
  artifact.integrity = { contentSha256: sha256Artifact({ ...artifact, integrity: {} }), algorithm: 'sha256' };

  fs.writeFileSync(path.join(runDir, 'root-cause-report.json'), JSON.stringify(artifact, null, 2));
  if (logDir) {
    fs.writeFileSync(path.join(logDir, '08b-rootcause.stdout.log'), JSON.stringify(causes, null, 2));
    fs.writeFileSync(path.join(logDir, '08b-rootcause.stderr.log'), '');
  }

  console.log(`[ROOT-CAUSE] ${causes.length} root causes identified`);
  return artifact;
}

module.exports = { analyzeRootCauses };
if (require.main === module) {
  const runDir = process.argv[2] || path.join(__dirname, 'runs', 'manual');
  const logDir = path.join(runDir, 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  analyzeRootCauses(runDir, logDir);
}
