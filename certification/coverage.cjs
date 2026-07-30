/**
 * coverage.cjs — Run coverage for a component and extract metrics
 * Executes vitest --coverage, extracts per-component metrics from coverage-final.json
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { sha256, sha256File, sha256Artifact } = require('./hash.cjs');
const { captureEnvironment } = require('./evidence.cjs');

const ROOT = path.resolve(__dirname, '..');
const COMPONENT = 'execution-pipeline';
const SOURCE_FILE = 'compiler/cvm/execution-pipeline.ts';
const TEST_FILES = [
  'tests/vm/advanced/execution-pipeline.test.ts',
  'tests/vm/advanced/execution-pipeline-r5-minimal.test.ts'
];

function runCoverage(runDir, logDir) {
  const startedAt = new Date().toISOString();
  const env = captureEnvironment();
  const relRunDir = path.relative(ROOT, runDir).replace(/\\/g, '/');
  const command = `npx vitest run ${TEST_FILES.join(' ')} --coverage --reporter=verbose --reporter=json --outputFile=${relRunDir}/vitest-results.json --coverage.reporter=json --coverage.reportsDirectory=${relRunDir}/coverage`;

  console.log('[COVERAGE] Running vitest with coverage...');
  console.log(`[COVERAGE] Command: ${command}`);

  let exitCode = 0;
  let stdout = '';
  let stderr = '';

  try {
    stdout = execSync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 120000,
      env: { ...process.env, NODE_OPTIONS: '--no-warnings' }
    });
  } catch (e) {
    exitCode = e.status || 1;
    stdout = e.stdout || '';
    stderr = e.stderr || '';
  }

  const completedAt = new Date().toISOString();
  const durationMs = new Date(completedAt) - new Date(startedAt);

  // Write logs
  fs.writeFileSync(path.join(logDir, '03-coverage.stdout.log'), stdout);
  fs.writeFileSync(path.join(logDir, '03-coverage.stderr.log'), stderr);

  const coverageFinalSrc = path.join(runDir, 'coverage', 'coverage-final.json');
  const coverageFinalDst = path.join(runDir, 'coverage-final.json');
  
  if (exitCode !== 0) {
    console.log('[COVERAGE] WARNING: Tests failed during coverage generation.');
  }

  if (fs.existsSync(coverageFinalSrc)) {
    fs.copyFileSync(coverageFinalSrc, coverageFinalDst);
  }

  if (!fs.existsSync(coverageFinalDst)) {
    console.log('[COVERAGE] ERROR: coverage-final.json not found in run directory');
    return null;
  }

  // Extract metrics for the target component
  const coverageData = JSON.parse(fs.readFileSync(coverageFinalDst, 'utf8'));
  const sourceKey = Object.keys(coverageData).find(k => k.includes(SOURCE_FILE.replace(/\//g, path.sep)) || k.includes(SOURCE_FILE));

  let metrics = { statements: 0, branches: 0, functions: 0, lines: 0 };
  let uncoveredLines = [];
  let uncoveredBranches = [];

  if (sourceKey) {
    const fileCov = coverageData[sourceKey];
    // Statements
    const stKeys = Object.keys(fileCov.statementMap || {});
    const stmtTotal = stKeys.length;
    let stmtCovered = 0;
    for (const k of stKeys) {
      if (fileCov.s[k] > 0) stmtCovered++;
    }

    // Branches
    const brKeys = Object.keys(fileCov.branchMap || {});
    let branchTotal = 0;
    let branchCovered = 0;
    for (const k of brKeys) {
      const locations = fileCov.branchMap[k].locations || [];
      const hits = fileCov.b[k] || [];
      branchTotal += locations.length;
      for (let i = 0; i < locations.length; i++) {
        if (hits[i] > 0) {
          branchCovered++;
        } else {
          uncoveredBranches.push(k);
        }
      }
    }

    // Functions
    const fnKeys = Object.keys(fileCov.fnMap || {});
    const fnTotal = fnKeys.length;
    let fnCovered = 0;
    for (const k of fnKeys) {
      if (fileCov.f[k] > 0) fnCovered++;
    }

    // Lines
    const lineMap = fileCov.statementMap || {};
    const allLines = new Set();
    const coveredLines = new Set();
    for (const [id, range] of Object.entries(lineMap)) {
      for (let l = range.start.line; l <= range.end.line; l++) {
        allLines.add(l);
        if (fileCov.s[id] > 0) coveredLines.add(l);
      }
    }
    const lineTotal = allLines.size || 1;
    const lineCovered = coveredLines.size;
    uncoveredLines = [...allLines].filter(l => !coveredLines.has(l)).sort((a, b) => a - b);

    const pct = (cov, tot) => tot === 0 ? 100 : Math.floor((cov / tot) * 100);

    metrics = {
      statements: pct(stmtCovered, stmtTotal),
      branches: pct(branchCovered, branchTotal),
      functions: pct(fnCovered, fnTotal),
      lines: pct(lineCovered, lineTotal),
      details: {
        statementsTotal: stmtTotal, statementsCovered: stmtCovered,
        branchesTotal: branchTotal, branchesCovered: branchCovered,
        functionsTotal: fnTotal, functionsCovered: fnCovered,
        linesTotal: lineTotal, linesCovered: lineCovered
      }
    };
  } else {
    console.log('[COVERAGE] WARNING: Component not found in coverage-final.json');
    console.log('[COVERAGE] Available keys:', Object.keys(coverageData).slice(0, 5));
  }

  // Build artifact
  const artifact = {
    schemaVersion: '1.0.0',
    artifactType: 'COVERAGE_REPORT',
    metadata: {
      id: `COV-${COMPONENT}-${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}`,
      createdAt: completedAt,
      component: COMPONENT,
      sourceFile: SOURCE_FILE,
      gitSha: env.gitSha,
      gitBranch: env.gitBranch,
      gitClean: env.gitClean
    },
    provenance: {
      command,
      script: 'certification/coverage.cjs',
      environment: {
        nodeVersion: env.nodeVersion,
        vitestVersion: env.vitestVersion,
        typescriptVersion: env.typescriptVersion
      },
      startedAt,
      completedAt,
      durationMs,
      exitCode
    },
    content: {
      metrics,
      uncoveredLines,
      uncoveredBranches,
      coverageFinalSha256: sha256File(coverageFinalDst),
      sourceFileFound: !!sourceKey
    },
    evidenceRefs: [
      { type: 'PRIMARY', file: 'coverage-final.json', sha256: sha256File(coverageFinalDst) },
      { type: 'PRIMARY', file: 'logs/03-coverage.stdout.log', sha256: sha256File(path.join(logDir, '03-coverage.stdout.log')) }
    ],
    integrity: {}
  };

  // Self-hash (without integrity field)
  artifact.integrity = {
    contentSha256: sha256Artifact({ ...artifact, integrity: {} }),
    algorithm: 'sha256'
  };

  // Write artifact
  const artifactPath = path.join(runDir, 'coverage-report.json');
  fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));

  console.log(`[COVERAGE] Statements: ${metrics.statements}%`);
  console.log(`[COVERAGE] Branches: ${metrics.branches}%`);
  console.log(`[COVERAGE] Functions: ${metrics.functions}%`);
  console.log(`[COVERAGE] Lines: ${metrics.lines}%`);
  console.log(`[COVERAGE] Exit code: ${exitCode}`);

  return artifact;
}

module.exports = { runCoverage };

if (require.main === module) {
  const runDir = path.join(__dirname, 'runs', 'manual');
  const logDir = path.join(runDir, 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  runCoverage(runDir, logDir);
}
