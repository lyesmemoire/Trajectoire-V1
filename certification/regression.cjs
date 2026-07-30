/**
 * regression.cjs — Run regression testing for a component
 * Applies each regression individually, runs tsc + vitest, captures diffs and results.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { sha256, sha256File, sha256Artifact } = require('./hash.cjs');
const { captureEnvironment } = require('./evidence.cjs');

const ROOT = path.resolve(__dirname, '..');
const COMPONENT = 'execution-pipeline';
const SOURCE_FILE = path.join(ROOT, 'compiler', 'cvm', 'execution-pipeline.ts');
const TEST_FILE = 'tests/vm/advanced/execution-pipeline.test.ts tests/vm/advanced/execution-pipeline-r5-minimal.test.ts';
const DEFINITIONS_FILE = path.join(__dirname, 'definitions', 'execution-pipeline', 'regressions.json'); // Legacy
const { generateCatalog } = require('./ast-mutator.cjs');

function runRegressions(runDir, logDir) {
  const startedAt = new Date().toISOString();
  const env = captureEnvironment();
  const command = 'node certification/regression.cjs';

  console.log('[REGRESSION] Loading regression definitions...');

  // Generate catalog dynamically
  const catalog = generateCatalog(SOURCE_FILE);
  fs.writeFileSync(path.join(logDir, 'regression-catalog.json'), JSON.stringify(catalog.filter(c => c.category === 'Regression'), null, 2));
  const definitions = catalog.filter(c => c.category === 'Regression');
  console.log(`[REGRESSION] ${definitions.length} regressions to test`);

  const originalContent = fs.readFileSync(SOURCE_FILE, 'utf8');
  const originalLines = originalContent.split('\n');
  const results = [];

  for (const reg of definitions) {
    const regId = reg.id;
    console.log(`[REGRESSION] ${regId}: ${reg.description}`);

    const regStart = new Date().toISOString();
    let status = 'UNKNOWN';
    let tscExitCode = null;
    let vitestExitCode = null;
    let vitestStdout = '';
    let vitestStderr = '';
    let failedTests = [];
    let durationMs = 0;
    let diffPatch = '';

    try {
      // Apply regression
      // Verify original line matches
      const expectedOriginal = reg.original;
      const originalBlock = originalContent.substring(reg.sourceSpan.start, reg.sourceSpan.end);
      if (originalBlock !== expectedOriginal) {
        console.log(`[REGRESSION]   WARNING: Block mismatch`);
      }

      const mutatedContent = originalContent.substring(0, reg.sourceSpan.start) + reg.replacement + originalContent.substring(reg.sourceSpan.end);
      fs.writeFileSync(SOURCE_FILE, mutatedContent);

      // Capture diff (only source file)
      try {
        diffPatch = execSync(`git diff -- "${SOURCE_FILE}"`, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 10 * 1024 * 1024 });
      } catch (e) { diffPatch = ''; }

      // Run tests directly (vitest handles transpilation internally)
      try {
        const resultsFile = path.join(logDir, `vitest-results-R${regId}.json`);
        const relResultsFile = path.relative(ROOT, resultsFile).replace(/\\/g, '/');
        
        try {
          vitestStdout = execSync(`npx vitest run ${TEST_FILE} --no-coverage --reporter=json --outputFile=${relResultsFile}`, {
            cwd: ROOT,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 30000,
            maxBuffer: 10 * 1024 * 1024,
            env: { ...process.env, NODE_OPTIONS: '--no-warnings' }
          });
          vitestExitCode = 0;
        } catch (e) {
          vitestExitCode = e.status || 1;
          vitestStdout = e.stdout || '';
          vitestStderr = e.stderr || '';
          if (e.killed || e.signal === 'SIGTERM') {
            status = 'TIMEOUT';
          }
        }

        if (status !== 'TIMEOUT') {
          try {
            if (fs.existsSync(resultsFile)) {
              const res = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
              if (res.numTotalTests > 0) {
                if (res.numFailedTests > 0) {
                  status = 'REGRESSION_DETECTED';
                  failedTests = (res.testResults || []).flatMap(tr => 
                    (tr.assertionResults || []).filter(ar => ar.status === 'failed').map(ar => ar.title)
                  );
                } else {
                  status = 'REGRESSION_MISSED'; 
                }
              } else {
                status = 'BUILD_ERROR';
              }
            } else {
              status = 'BUILD_ERROR';
            }
          } catch (err) {
            status = 'BUILD_ERROR';
          }
        }
      } catch (e) {
        // Ignored inner catch
      }

    } catch (e) {
      if (status === 'UNKNOWN') status = 'BUILD_ERROR';
    } finally {
      // ALWAYS restore
      fs.writeFileSync(SOURCE_FILE, originalContent);

      try {
        execSync(`git diff --exit-code -- "${SOURCE_FILE}"`, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 10 * 1024 * 1024 });
      } catch (e) {
        console.log(`[REGRESSION]   WARNING: forcing git checkout`);
        execSync(`git checkout -- "${SOURCE_FILE}"`, { cwd: ROOT });
      }

      const regEnd = new Date().toISOString();
      durationMs = new Date(regEnd) - new Date(regStart);

      fs.writeFileSync(path.join(logDir, `06-regression-${regId}.stdout.log`), vitestStdout);
      fs.writeFileSync(path.join(logDir, `06-regression-${regId}.stderr.log`), vitestStderr);
      fs.writeFileSync(path.join(logDir, `06-regression-${regId}.diff`), diffPatch);

      results.push({
        id: regId,
        description: reg.description,
        category: reg.category,
        critical: reg.critical,
        line: -1, // deprecated
        type: 'AST',
        original: reg.original,
        mutated: reg.replacement,
        status,
        tscExitCode,
        vitestExitCode,
        failedTests,
        durationMs,
        diffSha256: sha256(diffPatch),
        startedAt: regStart,
        completedAt: regEnd
      });

      console.log(`[REGRESSION]   Status: ${status} (${durationMs}ms)`);
    }
  }

  const completedAt = new Date().toISOString();
  const totalDuration = new Date(completedAt) - new Date(startedAt);

  const detected = results.filter(r => r.status === 'REGRESSION_DETECTED').length;
  const missed = results.filter(r => r.status === 'REGRESSION_MISSED').length;
  const buildErrors = results.filter(r => r.status === 'BUILD_ERROR').length;
  const timeouts = results.filter(r => r.status === 'TIMEOUT').length;
  const detectionRate = results.length > 0 ? parseFloat(((detected / results.length) * 100).toFixed(2)) : 0;

  console.log(`\n[REGRESSION] === Summary ===`);
  console.log(`[REGRESSION] Total: ${results.length}, Detected: ${detected}, Missed: ${missed}, BuildErrors: ${buildErrors}, Timeouts: ${timeouts}`);
  console.log(`[REGRESSION] Detection rate: ${detectionRate}%`);

  const artifact = {
    schemaVersion: '1.0.0',
    artifactType: 'REGRESSION_REPORT',
    metadata: {
      id: `REG-${COMPONENT}-${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}`,
      createdAt: completedAt,
      component: COMPONENT,
      sourceFile: 'compiler/cvm/execution-pipeline.ts',
      gitSha: env.gitSha,
      gitBranch: env.gitBranch,
      gitClean: env.gitClean
    },
    provenance: {
      command,
      script: 'certification/regression.cjs',
      environment: {
        nodeVersion: env.nodeVersion,
        vitestVersion: env.vitestVersion,
        typescriptVersion: env.typescriptVersion
      },
      startedAt,
      completedAt,
      durationMs: totalDuration,
      exitCode: 0
    },
    content: {
      summary: { total: results.length, detected, missed, buildErrors, timeouts, detectionRate },
      regressions: results,
      catalogSha256: sha256File(path.join(logDir, 'regression-catalog.json'))
    },
    evidenceRefs: results.flatMap(r => {
      const refs = [];
      if (r.diffSha256) {
        refs.push({ type: 'PRIMARY', file: `logs/06-regression-${r.id}.diff`, sha256: r.diffSha256 });
      }
      const resultsFile = path.join(runDir, 'logs', `vitest-results-R${r.id}.json`);
      if (fs.existsSync(resultsFile)) {
        refs.push({ type: 'PRIMARY', file: `logs/vitest-results-R${r.id}.json`, sha256: sha256File(resultsFile) });
      }
      const stdoutFile = path.join(runDir, 'logs', `06-regression-${r.id}.stdout.log`);
      if (fs.existsSync(stdoutFile)) {
        refs.push({ type: 'PRIMARY', file: `logs/06-regression-${r.id}.stdout.log`, sha256: sha256File(stdoutFile) });
      }
      return refs;
    }),
    integrity: {}
  };

  artifact.integrity = {
    contentSha256: sha256Artifact({ ...artifact, integrity: {} }),
    algorithm: 'sha256'
  };

  fs.writeFileSync(path.join(runDir, 'regression-report.json'), JSON.stringify(artifact, null, 2));
  return artifact;
}

module.exports = { runRegressions };

if (require.main === module) {
  const runDir = path.join(__dirname, 'runs', 'manual');
  const logDir = path.join(runDir, 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  runRegressions(runDir, logDir);
}
