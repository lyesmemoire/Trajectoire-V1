/**
 * certify.cjs — Main orchestrator for the certification pipeline
 * 
 * Usage: node certification/certify.cjs
 * 
 * This is the SINGLE COMMAND that produces a complete certification run.
 * It executes all steps sequentially, captures all evidence, and produces
 * a cryptographic manifest as the root of trust.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { sha256File } = require('./hash.cjs');
const { captureEnvironment } = require('./evidence.cjs');
const { runCoverage } = require('./coverage.cjs');
const { runMutations } = require('./mutation.cjs');
const { runRegressions } = require('./regression.cjs');
const { generateManifest } = require('./manifest.cjs');
const { generateReport } = require('./report.cjs');
const { verify } = require('./verify.cjs');

const ROOT = path.resolve(__dirname, '..');

async function certify() {
  const pipelineStart = new Date().toISOString();
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     CERTIFICATION PIPELINE v1.0.0               ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`Started: ${pipelineStart}\n`);

  // ─── Step 0: Environment ────────────────────────────────────
  console.log('━━━ Step 0: Capture Environment ━━━');
  const env = captureEnvironment();
  console.log(`  Node: ${env.nodeVersion}`);
  console.log(`  Vitest: ${env.vitestVersion}`);
  console.log(`  TypeScript: ${env.typescriptVersion}`);
  console.log(`  Git SHA: ${env.gitSha}`);
  console.log(`  Git branch: ${env.gitBranch}`);
  console.log(`  Git clean: ${env.gitClean}`);
  console.log();

  // Create run directory
  const shortSha = env.gitSha.substring(0, 8);
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z');
  const runId = `${shortSha}-${timestamp}`;
  const runDir = path.join(__dirname, 'runs', runId);
  const logDir = path.join(runDir, 'logs');
  fs.mkdirSync(logDir, { recursive: true });

  console.log(`  Run ID: ${runId}`);
  console.log(`  Run dir: ${runDir}`);
  console.log();

  // Write environment
  const envArtifact = {
    schemaVersion: '1.0.0',
    artifactType: 'ENVIRONMENT_SNAPSHOT',
    metadata: {
      id: `ENV-${timestamp}`,
      createdAt: new Date().toISOString(),
      component: 'execution-pipeline',
      gitSha: env.gitSha,
      gitBranch: env.gitBranch,
      gitClean: env.gitClean
    },
    provenance: {
      command: 'node certification/certify.cjs',
      script: 'certification/evidence.cjs',
      environment: { nodeVersion: env.nodeVersion, vitestVersion: env.vitestVersion, typescriptVersion: env.typescriptVersion },
      startedAt: pipelineStart,
      completedAt: new Date().toISOString(),
      durationMs: 0,
      exitCode: 0
    },
    content: env,
    evidenceRefs: [{ type: 'PRIMARY', file: 'environment.json', sha256: 'self' }],
    integrity: {}
  };
  const { sha256: sha256Fn } = require('./hash.cjs');
  envArtifact.integrity = {
    contentSha256: sha256Fn(JSON.stringify({ ...envArtifact, integrity: {} }, null, 2)),
    algorithm: 'sha256'
  };
  fs.writeFileSync(path.join(runDir, 'environment.json'), JSON.stringify(envArtifact, null, 2));
  fs.writeFileSync(path.join(logDir, '00-environment.stdout.log'), JSON.stringify(env, null, 2));
  fs.writeFileSync(path.join(logDir, '00-environment.stderr.log'), '');

  // ─── Step 1: Build Verification ─────────────────────────────
  console.log('━━━ Step 1: Build Verification ━━━');
  let buildExitCode = 0;
  let buildStdout = '';
  let buildStderr = '';
  try {
    buildStdout = execSync('npx tsc --noEmit', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 60000, maxBuffer: 10 * 1024 * 1024 });
    console.log('  Build: PASS');
  } catch (e) {
    buildExitCode = e.status || 1;
    buildStdout = e.stdout || '';
    buildStderr = e.stderr || '';
    console.log(`  Build: FAIL (exit code ${buildExitCode})`);
  }
  fs.writeFileSync(path.join(logDir, '01-build.stdout.log'), buildStdout);
  fs.writeFileSync(path.join(logDir, '01-build.stderr.log'), buildStderr);
  console.log();

  // ─── Step 2: Test Execution ─────────────────────────────────
  console.log('━━━ Step 2: Test Execution ━━━');
  let testExitCode = 0;
  let testStdout = '';
  let testStderr = '';
  try {
    testStdout = execSync(
      'npx vitest run tests/vm/advanced/execution-pipeline.test.ts tests/vm/advanced/execution-pipeline-r5-minimal.test.ts --reporter=verbose',
      { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 120000, maxBuffer: 10 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: '--no-warnings' } }
    );
    console.log('  Tests: PASS');
  } catch (e) {
    testExitCode = e.status || 1;
    testStdout = e.stdout || '';
    testStderr = e.stderr || '';
    console.log(`  Tests: FAIL (exit code ${testExitCode})`);
  }
  fs.writeFileSync(path.join(logDir, '02-tests.stdout.log'), testStdout);
  fs.writeFileSync(path.join(logDir, '02-tests.stderr.log'), testStderr);
  console.log();

  // ─── Step 3-4: Coverage ─────────────────────────────────────
  console.log('━━━ Step 3-4: Coverage Generation & Extraction ━━━');
  const coverageResult = runCoverage(runDir, logDir);
  console.log();

  // ─── Step 5: Security & Supply Chain Audit ────────────────────
  console.log('━━━ Step 5: Security Audit ━━━');
  try {
    const { runAudit } = require('./audit.cjs');
    runAudit(runDir);
  } catch (err) {
    console.error(`[FATAL] General Security Audit Failed: ${err.message}`);
  }
  
  try {
    const { runCveAudit } = require('./cve-audit.cjs');
    runCveAudit(runDir);
  } catch (err) {
    console.error(`\n[FATAL] CVE Audit Failed: ${err.message}`);
    process.exit(1);
  }
  console.log();

  // ─── Step 5b: SBOM Generation ─────────────────────────────────
  console.log('━━━ Step 5b: SBOM Generation ━━━');
  try {
    const { generateSbom } = require('./sbom.cjs');
    generateSbom(runDir, logDir);
  } catch (err) {
    console.error(`[FATAL] SBOM Generation Failed: ${err.message}`);
    process.exit(1); // Fail immediately as requested
  }
  console.log();

  // ─── Step 6: Mutation Testing ───────────────────────────────
  console.log('━━━ Step 6: Mutation Testing ━━━');
  const mutationResult = runMutations(runDir, logDir);
  console.log();

  // ─── Step 7: Regression Testing ─────────────────────────────
  console.log('━━━ Step 7: Regression Testing ━━━');
  const regressionResult = runRegressions(runDir, logDir);
  console.log();

  // ─── Step 7b: Fuzzing Qualification ──────────────────────────
  console.log('━━━ Step 7b: Fuzzing Qualification ━━━');
  let fuzzingExitCode = 0;
  let fuzzingStdout = '';
  let fuzzingStderr = '';
  try {
    fuzzingStdout = execSync(
      'npx tsx tests/fuzzing/run.ts qualification',
      { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 3600000, maxBuffer: 10 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: '--no-warnings' } }
    );
    console.log('  Fuzzing: PASS');
  } catch (e) {
    fuzzingExitCode = e.status || 1;
    fuzzingStdout = e.stdout || '';
    fuzzingStderr = e.stderr || '';
    console.log(`  Fuzzing: FAIL (exit code ${fuzzingExitCode})`);
  }
  fs.writeFileSync(path.join(logDir, '07b-fuzzing.stdout.log'), fuzzingStdout);
  fs.writeFileSync(path.join(logDir, '07b-fuzzing.stderr.log'), fuzzingStderr);
  
  // Copy the fuzz-report.json to runDir/reports/
  const fuzzReportPath = path.join(ROOT, 'tests', 'fuzzing', 'reports', 'fuzz-report.json');
  if (fs.existsSync(fuzzReportPath)) {
    const runReportsDir = path.join(runDir, 'reports');
    if (!fs.existsSync(runReportsDir)) fs.mkdirSync(runReportsDir, { recursive: true });
    fs.copyFileSync(fuzzReportPath, path.join(runReportsDir, 'fuzz-report.json'));
  }
  console.log();

  // ─── Step 7c: Chaos Engineering Qualification ───────────────
  console.log('━━━ Step 7c: Chaos Engineering Qualification ━━━');
  let chaosExitCode = 0;
  let chaosStdout = '';
  let chaosStderr = '';
  try {
    chaosStdout = execSync(
      'node --import tsx/esm tests/chaos/run.ts qualification',
      { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 3600000, maxBuffer: 10 * 1024 * 1024, env: { ...process.env, NODE_OPTIONS: '--no-warnings' } }
    );
    console.log('  Chaos: PASS');
  } catch (e) {
    chaosExitCode = e.status || 1;
    chaosStdout = e.stdout || '';
    chaosStderr = e.stderr || '';
    console.log(`  Chaos: FAIL (exit code ${chaosExitCode})`);
  }
  fs.writeFileSync(path.join(logDir, '07c-chaos.stdout.log'), chaosStdout);
  fs.writeFileSync(path.join(logDir, '07c-chaos.stderr.log'), chaosStderr);
  
  // Copy the chaos-report.json to runDir/reports/
  const chaosReportPath = path.join(ROOT, 'tests', 'chaos', 'reports', 'chaos-report.json');
  if (fs.existsSync(chaosReportPath)) {
    const runReportsDir = path.join(runDir, 'reports');
    if (!fs.existsSync(runReportsDir)) fs.mkdirSync(runReportsDir, { recursive: true });
    fs.copyFileSync(chaosReportPath, path.join(runReportsDir, 'chaos-report.json'));
  }
  console.log();

  // ─── Step 8: Build Provenance (SLSA in-toto) ─────────────────
  console.log('━━━ Step 8: Build Provenance ━━━');
  try {
    const { generateProvenance } = require('./provenance.cjs');
    generateProvenance(runDir, pipelineStart);
  } catch (err) {
    console.error(`[FATAL] Provenance Generation Failed: ${err.message}`);
    process.exit(1);
  }
  console.log();

  // ─── Step 9: Root Cause Analysis ─────────────────────────────
  console.log('━━━ Step 9: Root Cause Analysis ━━━');
  const { analyzeRootCauses } = require('./root-cause.cjs');
  analyzeRootCauses(runDir, logDir);
  console.log();

  // ─── Step 10: Certification Decision ─────────────────────────
  console.log('━━━ Step 10: Certification Decision ━━━');
  const reportResult = generateReport(runDir, logDir);
  console.log();

  // ─── Step 11: Manifest Generation (final — after all artifacts exist) ────
  console.log('━━━ Step 11: Manifest Generation ━━━');
  const manifest = generateManifest(runDir, logDir);

  // ─── Step 12: Sign Artifacts ──────────────────────────────────
  console.log('\n━━━ Step 12: Sign Artifacts ━━━');
  let signaturePath = null;
  let verification = { verdict: 'UNKNOWN', passed: 0, totalChecks: 0 };
  try {
    const { signFile } = require('./sign.cjs');
    
    // Sign individual security artifacts first for independent distribution
    ['sbom.json', 'provenance.attestation.json', 'security-summary.json', 'reports/fuzz-report.json', 'reports/chaos-report.json'].forEach(f => {
       const fp = path.join(runDir, f);
       if (fs.existsSync(fp)) signFile(fp, runDir);
    });

    // Sign manifest last
    signaturePath = require('./sign.cjs').signFile(path.join(runDir, 'manifest.json'), runDir);
    console.log(`[CERTIFY] Étape 12 terminée : Manifeste signé (manifest.dsse.json).`);

    // Etape 13 : Timestamping
    console.log(`\n[CERTIFY] === Étape 13 : Horodatage ===`);
    await require('./timestamp.cjs').generateTimestamps(signaturePath, runDir);
    
    // ─── Step 14: Certification Snapshot ────────────────────────
    console.log('\n━━━ Step 14: Certification Snapshot ━━━');
    const { generateSnapshot } = require('./snapshot.cjs');
    generateSnapshot(runDir);
    
    // Etape 15 : Publication
    console.log(`\n[CERTIFY] === Étape 15 : Publication ===`);
    require('./publish.cjs').generatePublicationManifest(runDir);
    console.log(`[CERTIFY] Étape 15 terminée : Manifeste de publication généré.`);

    // ─── Step 16: Verification ──────────────────────────────────
    console.log('\n━━━ Step 16: Self-Verification ━━━');
    verification = verify(runDir);
    console.log();
    
    // ─── Step 16.5: Dual-Lab Independent Verification ────────────
    console.log('\n━━━ Step 16.5: Dual-Lab Independent Verification ━━━');
    try {
      const { execSync } = require('child_process');
      console.log('[DUAL-LAB] Running Laboratory A (Node.js)...');
      execSync(`node laboratory/independent-lab.cjs ${runDir}`, { cwd: ROOT, stdio: 'inherit' });
      
      console.log('[DUAL-LAB] Running Laboratory B (Python)...');
      execSync(`python laboratory-b/independent_lab.py ${runDir}`, { cwd: ROOT, stdio: 'inherit' });
      
      console.log('[DUAL-LAB] Running Convergence Engine...');
      execSync(`node laboratory-convergence/convergence.cjs ${runDir}`, { cwd: ROOT, stdio: 'inherit' });
    } catch (e) {
      console.log(`[DUAL-LAB] Warning: Dual-Lab Verification failed: ${e.message}`);
    }
    
    // ─── Step 17: Release Evidence ──────────────────────────────
    console.log('\n━━━ Step 17: Release Evidence ━━━');
    try {
      const { generateReleaseEvidence } = require('./release.cjs');
      generateReleaseEvidence(runDir, '1.0.0');
    } catch (e) {
      console.log(`[CERTIFY] Warning: Release Evidence generation failed: ${e.message}`);
    }

    console.log(`\n✅ [CERTIFY] Pipeline de certification terminé avec succès.`);
  } catch (err) {
    console.warn(`[WARNING] Manifest signing skipped or failed: ${err.message}`);
  }

  // ─── Summary ───────────────────────────────────────────────
  const pipelineEnd = new Date().toISOString();
  const totalDuration = new Date(pipelineEnd) - new Date(pipelineStart);

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     CERTIFICATION COMPLETE                      ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Run ID:      ${runId}`);
  console.log(`  Run dir:     ${runDir}`);
  console.log(`  Duration:    ${(totalDuration / 1000).toFixed(1)}s`);
  console.log(`  Git SHA:     ${env.gitSha}`);
  console.log();

  if (coverageResult) {
    console.log(`  Coverage:    ${coverageResult.content.metrics.statements}% stmt, ${coverageResult.content.metrics.branches}% branch, ${coverageResult.content.metrics.functions}% fn`);
  }
  if (mutationResult) {
    console.log(`  Mutation:    ${mutationResult.content.summary.mutationScore}% (${mutationResult.content.summary.killed}/${mutationResult.content.summary.killed + mutationResult.content.summary.survived} killed)`);
  }
  if (regressionResult) {
    console.log(`  Regression:  ${regressionResult.content.summary.detectionRate}% (${regressionResult.content.summary.detected}/${regressionResult.content.summary.total} detected)`);
  }

  const decision = reportResult ? reportResult.decision.level : 'UNKNOWN';
  console.log();
  console.log(`  ┌─────────────────────────────────────┐`);
  console.log(`  │  DECISION: ${decision.padEnd(25)}│`);
  console.log(`  └─────────────────────────────────────┘`);
  console.log();
  console.log(`  Verification: ${verification.verdict} (${verification.passed}/${verification.totalChecks})`);
  console.log(`  Manifest:     ${manifest.integrity.manifestContentSha256}`);
  console.log();

  // Return for programmatic use
  return { runId, runDir, decision, verification: verification.verdict, manifest: manifest.integrity.manifestContentSha256 };
}

// Execute
if (require.main === module) {
  certify().then(result => {
    process.exit(result.verification === 'VERIFIED' ? 0 : 1);
  }).catch(e => {
    console.error('[FATAL]', e.message);
    process.exit(1);
  });
}

module.exports = { certify };
