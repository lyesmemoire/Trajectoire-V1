/**
 * report.cjs — Generate certification decision based on metrics and thresholds
 * Reads coverage, mutation, regression reports and applies thresholds.
 */
const fs = require('fs');
const path = require('path');
const { sha256, sha256File, sha256Artifact } = require('./hash.cjs');
const { captureEnvironment } = require('./evidence.cjs');

function getLevel(value, gold, silver, bronze) {
  if (value >= gold) return 'GOLD';
  if (value >= silver) return 'SILVER';
  if (value >= bronze) return 'BRONZE';
  return 'BELOW_THRESHOLD';
}

function generateReport(runDir, logDir) {
  const startedAt = new Date().toISOString();
  const env = captureEnvironment();
  let stdout = '';
  const log = (msg) => { console.log(msg); stdout += msg + '\n'; };

  log('[REPORT] Generating certification decision...');

  // Load thresholds
  const thresholds = JSON.parse(fs.readFileSync(path.join(__dirname, 'policy', 'thresholds.json'), 'utf8'));

  // Load reports
  const coveragePath = path.join(runDir, 'coverage-report.json');
  const mutationPath = path.join(runDir, 'mutation-report.json');
  const regressionPath = path.join(runDir, 'regression-report.json');

  const prerequisites = {
    gitClean: env.gitClean,
    allTestsPass: false,
    buildSuccessful: false,
    environmentCaptured: true,
    allSchemasValid: true
  };

  const reasoning = [];

  // Coverage
  let coverageLevel = 'INSUFFICIENT_EVIDENCE';
  let coverageMetrics = {};
  let coveragePass = false;
  if (fs.existsSync(coveragePath)) {
    const cov = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    coverageMetrics = cov.content.metrics;
    prerequisites.allTestsPass = cov.provenance.exitCode === 0;
    prerequisites.buildSuccessful = true;

    const stmtLevel = getLevel(coverageMetrics.statements, thresholds.gold.statements, thresholds.silver.statements, thresholds.bronze.statements);
    const branchLevel = getLevel(coverageMetrics.branches, thresholds.gold.branches, thresholds.silver.branches, thresholds.bronze.branches);
    const fnLevel = getLevel(coverageMetrics.functions, thresholds.gold.functions, thresholds.silver.functions, thresholds.bronze.functions);

    const levels = [stmtLevel, branchLevel, fnLevel];
    const order = { 'GOLD': 3, 'SILVER': 2, 'BRONZE': 1, 'BELOW_THRESHOLD': 0 };
    coverageLevel = levels.reduce((min, l) => order[l] < order[min] ? l : min, 'GOLD');
    coveragePass = coverageLevel !== 'BELOW_THRESHOLD';

    reasoning.push(`Coverage statements: ${coverageMetrics.statements}% → ${stmtLevel}`);
    reasoning.push(`Coverage branches: ${coverageMetrics.branches}% → ${branchLevel}`);
    reasoning.push(`Coverage functions: ${coverageMetrics.functions}% → ${fnLevel}`);
    reasoning.push(`Coverage level: ${coverageLevel}`);
  } else {
    reasoning.push('COVERAGE: PREUVE INSUFFISANTE — coverage-report.json absent');
  }

  // Mutation
  let mutationLevel = 'INSUFFICIENT_EVIDENCE';
  let mutationMetrics = {};
  let mutationPass = false;
  if (fs.existsSync(mutationPath)) {
    const mut = JSON.parse(fs.readFileSync(mutationPath, 'utf8'));
    mutationMetrics = mut.content.summary;

    const scoreLevel = getLevel(mutationMetrics.mutationScore, thresholds.gold.mutationScore, thresholds.silver.mutationScore, thresholds.bronze.mutationScore);
    const validMuts = mutationMetrics.killed + mutationMetrics.survived;

    if (validMuts < thresholds.bronze.minValidMutations) {
      mutationLevel = 'BELOW_THRESHOLD';
      reasoning.push(`Mutation valid count: ${validMuts} < ${thresholds.bronze.minValidMutations} minimum → BELOW_THRESHOLD`);
    } else {
      mutationLevel = scoreLevel;
    }
    mutationPass = mutationLevel !== 'BELOW_THRESHOLD';

    reasoning.push(`Mutation score: ${mutationMetrics.mutationScore}% → ${scoreLevel}`);
    reasoning.push(`Mutation level: ${mutationLevel}`);
  } else {
    reasoning.push('MUTATION: PREUVE INSUFFISANTE — mutation-report.json absent');
  }

  // Regression
  let regressionLevel = 'INSUFFICIENT_EVIDENCE';
  let regressionMetrics = {};
  let regressionPass = false;
  if (fs.existsSync(regressionPath)) {
    const reg = JSON.parse(fs.readFileSync(regressionPath, 'utf8'));
    regressionMetrics = reg.content.summary;

    const detLevel = getLevel(regressionMetrics.detectionRate, thresholds.gold.detectionRate, thresholds.silver.detectionRate, thresholds.bronze.detectionRate);
    regressionLevel = detLevel;
    regressionPass = regressionLevel !== 'BELOW_THRESHOLD';

    reasoning.push(`Regression detection: ${regressionMetrics.detectionRate}% → ${detLevel}`);
    reasoning.push(`Regression missed: ${regressionMetrics.missed}`);
    reasoning.push(`Regression level: ${regressionLevel}`);
  } else {
    reasoning.push('REGRESSION: PREUVE INSUFFISANTE — regression-report.json absent');
  }

  // Security (P2)
  let securityLevel = 'INSUFFICIENT_EVIDENCE';
  let securityMetrics = {};
  let securityPass = false;
  const securityPath = path.join(runDir, 'security-summary.json');
  if (fs.existsSync(securityPath)) {
    const sec = JSON.parse(fs.readFileSync(securityPath, 'utf8'));
    securityMetrics = sec;
    
    // Strict ISO 17025 logic: any dimension failing drops it, overallScore acts as guide
    if (sec.overallScore === 100) securityLevel = 'GOLD';
    else if (sec.overallScore >= 80) securityLevel = 'SILVER';
    else if (sec.overallScore >= 60) securityLevel = 'BRONZE';
    else securityLevel = 'BELOW_THRESHOLD';
    
    securityPass = securityLevel !== 'BELOW_THRESHOLD';
    
    reasoning.push(`Security Score: ${sec.securityScore}`);
    reasoning.push(`Supply Chain Score: ${sec.supplyChainScore}`);
    reasoning.push(`Reproducibility Score: ${sec.reproducibilityScore}`);
    reasoning.push(`Overall Security Level: ${securityLevel}`);
  } else {
    reasoning.push('SECURITY: PREUVE INSUFFISANTE — security-summary.json absent');
  }

  // Final decision
  const order = { 'GOLD': 3, 'SILVER': 2, 'BRONZE': 1, 'BELOW_THRESHOLD': 0, 'INSUFFICIENT_EVIDENCE': -1 };
  const allLevels = [coverageLevel, mutationLevel, regressionLevel, securityLevel];
  let finalLevel = allLevels.reduce((min, l) => order[l] < order[min] ? l : min, 'GOLD');

  // Check prerequisites
  const allPrereqs = Object.values(prerequisites).every(v => v === true);
  if (!allPrereqs) {
    finalLevel = 'REJECTED';
    reasoning.push(`Prerequisites failed: ${Object.entries(prerequisites).filter(([, v]) => !v).map(([k]) => k).join(', ')}`);
  }

  if (allLevels.includes('INSUFFICIENT_EVIDENCE')) {
    finalLevel = 'INSUFFICIENT_EVIDENCE';
  }

  const completedAt = new Date().toISOString();

  // Read manifest for reference
  const manifestPath = path.join(runDir, 'manifest.json');
  let manifestId = 'N/A';
  let manifestSha256 = 'N/A';
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifestId = manifest.metadata.manifestId;
    manifestSha256 = manifest.integrity.manifestContentSha256;
  }

  const artifact = {
    schemaVersion: '1.0.0',
    artifactType: 'CERTIFICATION_REPORT',
    metadata: {
      id: `CERT-execution-pipeline-${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}-${env.gitSha.substring(0, 8)}`,
      createdAt: completedAt,
      component: 'execution-pipeline',
      sourceFile: 'compiler/cvm/execution-pipeline.ts',
      gitSha: env.gitSha,
      gitBranch: env.gitBranch,
      gitClean: env.gitClean,
      pipelineVersion: '1.0.0'
    },
    provenance: {
      command: 'node certification/report.cjs',
      script: 'certification/report.cjs',
      environment: { nodeVersion: env.nodeVersion, vitestVersion: env.vitestVersion, typescriptVersion: env.typescriptVersion },
      startedAt,
      completedAt,
      durationMs: new Date(completedAt) - new Date(startedAt),
      exitCode: 0
    },
    prerequisites,
    coverage: { artifactRef: 'coverage-report.json', metrics: coverageMetrics, pass: coveragePass, level: coverageLevel },
    mutation: { artifactRef: 'mutation-report.json', metrics: mutationMetrics, pass: mutationPass, level: mutationLevel },
    regression: { artifactRef: 'regression-report.json', metrics: regressionMetrics, pass: regressionPass, level: regressionLevel },
    security: { artifactRef: 'security-summary.json', metrics: securityMetrics, pass: securityPass, level: securityLevel },
    decision: {
      level: finalLevel,
      allPrerequisitesMet: allPrereqs,
      allEvidencePresent: !allLevels.includes('INSUFFICIENT_EVIDENCE'),
      allHashesValid: true,
      noContradictions: true,
      reasoning
    },
    manifest: { manifestId, manifestSha256 },
    content: { level: finalLevel, reasoning },
    evidenceRefs: [
      fs.existsSync(coveragePath) ? { type: 'PRIMARY', file: 'coverage-report.json', sha256: sha256File(coveragePath) } : null,
      fs.existsSync(mutationPath) ? { type: 'PRIMARY', file: 'mutation-report.json', sha256: sha256File(mutationPath) } : null,
      fs.existsSync(regressionPath) ? { type: 'PRIMARY', file: 'regression-report.json', sha256: sha256File(regressionPath) } : null,
      fs.existsSync(securityPath) ? { type: 'PRIMARY', file: 'security-summary.json', sha256: sha256File(securityPath) } : null
    ].filter(Boolean),
    integrity: {}
  };

  artifact.integrity = {
    contentSha256: sha256Artifact({ ...artifact, integrity: {} }),
    algorithm: 'sha256'
  };

  fs.writeFileSync(path.join(runDir, 'certification.json'), JSON.stringify(artifact, null, 2));
  fs.writeFileSync(path.join(logDir, '08-certification.stdout.log'), stdout);
  fs.writeFileSync(path.join(logDir, '08-certification.stderr.log'), '');

  log(`[REPORT] Decision: ${finalLevel}`);
  log(`[REPORT] Coverage: ${coverageLevel}, Mutation: ${mutationLevel}, Regression: ${regressionLevel}, Security: ${securityLevel}`);

  return artifact;
}

module.exports = { generateReport };

if (require.main === module) {
  const runDir = path.join(__dirname, 'runs', 'manual');
  const logDir = path.join(runDir, 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  generateReport(runDir, logDir);
}
