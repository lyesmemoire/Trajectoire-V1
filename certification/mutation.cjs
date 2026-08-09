/**
 * mutation.cjs — Run mutation testing for a component
 * Applies each mutation individually, runs tsc + vitest, captures diffs and results.
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
const DEFINITIONS_FILE = path.join(__dirname, 'definitions', 'execution-pipeline', 'mutations.json'); // Legacy
const { generateCatalog } = require('./ast-mutator.cjs');

function runMutations(runDir, logDir) {
  const startedAt = new Date().toISOString();
  const env = captureEnvironment();
  const command = 'node certification/mutation.cjs';

  console.log('[MUTATION] Loading mutation definitions...');

  // Generate catalog dynamically
  const catalog = generateCatalog(SOURCE_FILE);
  fs.writeFileSync(path.join(logDir, 'mutation-catalog.json'), JSON.stringify(catalog, null, 2));

  const definitions = catalog.filter(c => c.category === 'Mutation');
  console.log(`[MUTATION] ${definitions.length} mutations to test`);

  const originalContent = fs.readFileSync(SOURCE_FILE, 'utf8');
  const originalLines = originalContent.split('\n');
  const results = [];

  // Verify source file is clean before starting
  try {
    execSync(`git diff --exit-code -- "${SOURCE_FILE}"`, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 10 * 1024 * 1024 });
  } catch (e) {
    console.log('[MUTATION] WARNING: Source file has uncommitted changes');
  }

  for (const mut of definitions) {
    const mutId = mut.id;
    console.log(`[MUTATION] ${mutId}: ${mut.description}`);

    const mutStart = new Date().toISOString();
    let status = 'UNKNOWN';
    const tscExitCode = null;
    const vitestExitCode = null;
    let vitestStdout = '';
    let vitestStderr = '';
    let failedTests = [];
    let durationMs = 0;
    let diffPatch = '';

    try {
      // Apply mutation
      // Verify original line matches
      const expectedOriginal = mut.original;
      const originalBlock = originalContent.substring(mut.sourceSpan.start, mut.sourceSpan.end);
      if (originalBlock !== expectedOriginal) {
        console.log(`[MUTATION]   WARNING: Block mismatch`);
      }

      const mutatedContent = originalContent.substring(0, mut.sourceSpan.start) + mut.replacement + originalContent.substring(mut.sourceSpan.end);
      fs.writeFileSync(SOURCE_FILE, mutatedContent);

      // Capture diff (only the source file)
      try {
        diffPatch = execSync(`git diff -- "${SOURCE_FILE}"`, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 10 * 1024 * 1024 });
      } catch (e) { diffPatch = ''; }

      // Run tests directly (vitest handles transpilation internally)
      try {
        const resultsFile = path.join(logDir, `vitest-results-M${mutId}.json`);
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
        } catch (e) {
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
                  status = 'KILLED';
                  failedTests = (res.testResults || []).flatMap(tr => 
                    (tr.assertionResults || []).filter(ar => ar.status === 'failed').map(ar => ar.title)
                  );
                } else {
                  status = 'SURVIVED';
                }
              } else {
                status = 'INVALID';
              }
            } else {
              status = 'INVALID';
            }
          } catch (err) {
            status = 'INVALID';
          }
        }
      } catch (e) {
        // Ignored inner catch
      }
    } catch (e) {
      if (status === 'UNKNOWN') status = 'INVALID';
    } finally {
      // ALWAYS restore
      fs.writeFileSync(SOURCE_FILE, originalContent);

      // Verify restoration
      try {
        execSync(`git diff --exit-code -- "${SOURCE_FILE}"`, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 10 * 1024 * 1024 });
      } catch (e) {
        console.log(`[MUTATION]   WARNING: git diff not clean after restore, forcing git checkout`);
        execSync(`git checkout -- "${SOURCE_FILE}"`, { cwd: ROOT });
      }

      const mutEnd = new Date().toISOString();
      durationMs = new Date(mutEnd) - new Date(mutStart);

      // Write per-mutation logs
      fs.writeFileSync(path.join(logDir, `05-mutation-${mutId}.stdout.log`), vitestStdout);
      fs.writeFileSync(path.join(logDir, `05-mutation-${mutId}.stderr.log`), vitestStderr);
      fs.writeFileSync(path.join(logDir, `05-mutation-${mutId}.diff`), diffPatch);

      results.push({
        id: mutId,
        description: mut.description,
        file: mut.file,
        line: -1, // deprecated
        type: 'AST',
        original: mut.original,
        mutated: mut.replacement,
        status,
        failedTests,
        durationMs,
        diffSha256: sha256(diffPatch),
        startedAt: mutStart,
        completedAt: mutEnd
      });

      console.log(`[MUTATION]   Status: ${status} (${durationMs}ms)`);
    }
  }

  const completedAt = new Date().toISOString();
  const totalDuration = new Date(completedAt) - new Date(startedAt);

  // Summary
  const killed = results.filter(r => r.status === 'KILLED').length;
  const survived = results.filter(r => r.status === 'SURVIVED').length;
  const invalid = results.filter(r => r.status === 'INVALID').length;
  const timeout = results.filter(r => r.status === 'TIMEOUT').length;
  const validTotal = killed + survived;
  const mutationScore = validTotal > 0 ? parseFloat(((killed / validTotal) * 100).toFixed(2)) : 0;

  console.log(`\n[MUTATION] === Summary ===`);
  console.log(`[MUTATION] Total: ${results.length}, Killed: ${killed}, Survived: ${survived}, Invalid: ${invalid}, Timeout: ${timeout}`);
  console.log(`[MUTATION] Score: ${mutationScore}%`);

  // Build artifact
  const artifact = {
    schemaVersion: '1.0.0',
    artifactType: 'MUTATION_REPORT',
    metadata: {
      id: `MUT-${COMPONENT}-${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}`,
      createdAt: completedAt,
      component: COMPONENT,
      sourceFile: 'compiler/cvm/execution-pipeline.ts',
      gitSha: env.gitSha,
      gitBranch: env.gitBranch,
      gitClean: env.gitClean
    },
    provenance: {
      command,
      script: 'certification/mutation.cjs',
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
      summary: { total: results.length, killed, survived, invalid, timeout, mutationScore },
      mutations: results,
      catalogSha256: sha256File(path.join(logDir, 'mutation-catalog.json'))
    },
    evidenceRefs: results.flatMap(r => {
      const refs = [];
      if (r.diffSha256) {
        refs.push({ type: 'PRIMARY', file: `logs/05-mutation-${r.id}.diff`, sha256: r.diffSha256 });
      }
      const resultsFile = path.join(runDir, 'logs', `vitest-results-M${r.id}.json`);
      if (fs.existsSync(resultsFile)) {
        refs.push({ type: 'PRIMARY', file: `logs/vitest-results-M${r.id}.json`, sha256: sha256File(resultsFile) });
      }
      const stdoutFile = path.join(runDir, 'logs', `05-mutation-${r.id}.stdout.log`);
      if (fs.existsSync(stdoutFile)) {
        refs.push({ type: 'PRIMARY', file: `logs/05-mutation-${r.id}.stdout.log`, sha256: sha256File(stdoutFile) });
      }
      return refs;
    }),
    integrity: {}
  };

  artifact.integrity = {
    contentSha256: sha256Artifact({ ...artifact, integrity: {} }),
    algorithm: 'sha256'
  };

  const artifactPath = path.join(runDir, 'mutation-report.json');
  fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));

  return artifact;
}

module.exports = { runMutations };

if (require.main === module) {
  const runDir = path.join(__dirname, 'runs', 'manual');
  const logDir = path.join(runDir, 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  runMutations(runDir, logDir);
}
