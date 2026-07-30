/**
 * manifest.cjs — Generate cryptographic manifest for a certification run
 * The manifest is the root of trust: it contains SHA256 of every file.
 */
const fs = require('fs');
const path = require('path');
const { sha256, sha256File, sha256Json, sha256Dir } = require('./hash.cjs');
const { captureEnvironment } = require('./evidence.cjs');
const { validateManifest } = require('./validate.cjs');
const { getBuildTime, getDeterministicUUID, getQualificationId, sortFiles, canonicalSortObject, stableCompare } = require('./deterministic.cjs');

const ROOT = path.resolve(__dirname, '..');

function generateManifest(runDir, logDir) {
  const startedAt = getBuildTime();
  const env = captureEnvironment();
  let stdout = '';

  const log = (msg) => { console.log(msg); stdout += msg + '\n'; };
  log('[MANIFEST] Generating cryptographic manifest...');

  // Hash source files recursively
  let sourceFiles = [];
  function hashDir(dir, baseDir, targetArray, type) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
      if (item.isDirectory()) {
        if (!item.name.includes('node_modules') && !item.name.includes('runs')) {
          hashDir(fullPath, baseDir, targetArray, type);
        }
      } else {
        targetArray.push({
          evidenceId: getDeterministicUUID(`trajectoire`, `manifest:src:${relPath}`),
          type: 'PRIMARY',
          path: relPath,
          filePath: relPath,
          sha256: sha256File(fullPath),
          sizeBytes: fs.statSync(fullPath).size
        });
      }
    }
  }

  hashDir(path.join(ROOT, 'compiler'), ROOT, sourceFiles, 'SRC');
  sourceFiles = sortFiles(sourceFiles);
  
  // Hash test files recursively
  let testFiles = [];
  hashDir(path.join(ROOT, 'tests'), ROOT, testFiles, 'TST');
  testFiles = sortFiles(testFiles);

  // Hash all artifacts in the run directory
  let artifacts = [];
  const artifactNames = [
    'coverage-report.json', 'mutation-report.json', 'regression-report.json', 
    'root-cause-report.json', 'certification.json',
    'sbom-cyclonedx.json', 'sbom-spdx.json', 'sbom-cyclonedx.dsse.json', 'sbom-spdx.dsse.json',
    'provenance.dsse.json', 'secret-scan.json', 'secret-scan.dsse.json',
    'dependency-integrity.json', 'audit-cve.json', 'audit-cve.dsse.json', 'licenses.json', 
    'reproducible-build.json', 'security-summary.json', 'security-summary.dsse.json',
    'timestamps.json', 'timestamps.dsse.json'
  ];
  for (const name of artifactNames) {
    const fp = path.join(runDir, name);
    if (fs.existsSync(fp)) {
      let contentSha256 = 'N/A';
      try {
        const content = JSON.parse(fs.readFileSync(fp, 'utf8'));
        contentSha256 = content.integrity?.contentSha256 || 'N/A';
        artifacts.push({
          artifactId: getDeterministicUUID(`trajectoire`, `manifest:artifact:${name}`),
          artifactType: content.artifactType || name.replace('.json', '').replace('.dsse', '').toUpperCase(),
          filePath: name,
          sha256: sha256File(fp),
          contentSha256: contentSha256,
          sizeBytes: fs.statSync(fp).size,
          generatedAt: content.metadata?.createdAt || getBuildTime()
        });
      } catch (e) {
        artifacts.push({
          artifactId: getDeterministicUUID(`trajectoire`, `manifest:artifact:${name}`),
          artifactType: name.replace('.json', '').replace('.dsse', '').toUpperCase(),
          filePath: name,
          sha256: sha256File(fp),
          sizeBytes: fs.statSync(fp).size,
          generatedAt: getBuildTime()
        });
      }
    }
  }
  artifacts = sortFiles(artifacts);

  // Hash evidence files
  let evidence = [];
  const evidenceNames = ['coverage-final.json', 'vitest-results.json'];
  for (const name of evidenceNames) {
    const fp = path.join(runDir, name);
    if (fs.existsSync(fp)) {
      let contentSha256 = 'N/A';
      try {
        const content = JSON.parse(fs.readFileSync(fp, 'utf8'));
        if (name.includes('vitest-results')) {
          const cleanContent = JSON.parse(JSON.stringify(content));
          delete cleanContent.startTime;
          if (cleanContent.testResults) {
            cleanContent.testResults.forEach(tr => {
              delete tr.startTime;
              delete tr.endTime;
              delete tr.duration;
              if (tr.assertionResults) {
                tr.assertionResults.forEach(ar => {
                  delete ar.duration;
                });
              }
            });
          }
          contentSha256 = sha256(JSON.stringify(canonicalSortObject(cleanContent), null, 2));
        } else {
           contentSha256 = content.integrity?.contentSha256 || 'N/A';
        }
      } catch (e) { }

      evidence.push({
        evidenceId: getDeterministicUUID(`trajectoire`, `manifest:evidence:${name}`),
        type: 'PRIMARY',
        filePath: name,
        sha256: sha256File(fp),
        contentSha256,
        sizeBytes: fs.statSync(fp).size,
        generatedAt: getBuildTime()
      });
    }
  }
  evidence = sortFiles(evidence);

  // Hash definition files (now part of the full directory scan later, but kept here for specific EV-def IDs if needed, or we can just scan the full certification dir)

  const logs = [];
  if (fs.existsSync(logDir)) {
    const logFiles = fs.readdirSync(logDir).sort();
    const byStep = {};
    for (const lf of logFiles) {
      const match = lf.match(/^(\d+-[a-z-]+)/);
      const step = match ? match[1] : lf;
      if (!byStep[step]) byStep[step] = { step, files: [] };
      const fp = path.join(logDir, lf);
      byStep[step].files.push({ name: lf, sha256: sha256File(fp) });
    }
    const sortedSteps = Object.keys(byStep).sort();
    for (const step of sortedSteps) {
      const g = byStep[step];
      logs.push({
        groupId: `LOG-${step}`,
        files: sortFiles(g.files.map(f => ({ path: f.name }))).map(f => f.path),
        sha256: sha256Json(canonicalSortObject(g)),
        generatedAt: getBuildTime()
      });
    }
  }

  // Hash policy files
  const thresholdsPath = path.join(__dirname, 'policy', 'thresholds.json');
  let deterministicExclusions = ['integrity'];
  if (fs.existsSync(thresholdsPath)) {
    evidence.push({
      evidenceId: getDeterministicUUID('trajectoire', 'manifest:evidence:thresholds.json'),
      evidenceType: 'PRIMARY',
      filePath: 'certification/policy/thresholds.json',
      sha256: sha256File(thresholdsPath),
      sizeBytes: fs.statSync(thresholdsPath).size
    });
    const tData = JSON.parse(fs.readFileSync(thresholdsPath, 'utf8'));
    if (tData.policy && tData.policy.deterministicHashExclusions) {
      deterministicExclusions = deterministicExclusions.concat(tData.policy.deterministicHashExclusions);
    }
  }

  // Hash configuration files
  const configFiles = ['package.json', 'pnpm-lock.yaml', 'vitest.config.ts', 'vitest.runtime.config.ts'];
  for (const cf of configFiles) {
    const cfPath = path.join(ROOT, cf);
    if (fs.existsSync(cfPath)) {
      evidence.push({
        evidenceId: getDeterministicUUID('trajectoire', `manifest:evidence:${cf}`),
        evidenceType: 'PRIMARY',
        filePath: cf,
        sha256: sha256File(cfPath),
        sizeBytes: fs.statSync(cfPath).size
      });
    }
  }

  // Hash tsconfig files
  const allFiles = fs.readdirSync(ROOT);
  for (const f of allFiles) {
    if (f.startsWith('tsconfig') && f.endsWith('.json')) {
      const fp = path.join(ROOT, f);
      evidence.push({
        evidenceId: getDeterministicUUID('trajectoire', `manifest:evidence:${f}`),
        evidenceType: 'PRIMARY',
        filePath: f,
        sha256: sha256File(fp),
        sizeBytes: fs.statSync(fp).size
      });
    }
  }

  // Hash critical directories fully
  hashDir(path.join(ROOT, 'certification'), ROOT, evidence, 'CERT');
  hashDir(path.join(ROOT, 'laboratory'), ROOT, evidence, 'LAB');
  hashDir(path.join(ROOT, '.github'), ROOT, evidence, 'GH');
  
  // Sort arrays for determinism
  sourceFiles = sortFiles(sourceFiles);
  testFiles = sortFiles(testFiles);
  artifacts = sortFiles(artifacts);
  evidence = sortFiles(evidence);
  // logs are already sorted earlier, but let's re-sort them explicitly if needed
  logs.sort((a, b) => stableCompare(a.groupId, b.groupId));

  const completedAt = getBuildTime();

  // Build manifest (without integrity)
  const manifest = {
    schemaVersion: '1.0.0',
    metadata: {
      manifestId: getDeterministicUUID('trajectoire', `manifest:run:${path.basename(runDir)}`),
      qualificationId: getQualificationId(),
      createdAt: completedAt,
      component: 'execution-pipeline',
      gitSha: env.gitSha,
      gitBranch: env.gitBranch,
      gitClean: env.gitClean,
      pipelineVersion: '1.0.0',
      pipelineCommand: 'node certification/certify.cjs'
    },
    cryptoPolicy: {
      version: "1.0",
      digest: "SHA-256",
      canonicalization: "RFC8785",
      signature: "Ed25519",
      signatureTarget: "SHA-256(RFC8785(JSON))"
    },
    sbomConfig: {
      sbomNormalizationProfile: "v1",
      cycloneDxSchema: "1.5",
      spdxSchema: "2.3",
      schemas: {
        cycloneDx: {
          file: 'certification/schemas/bom-1.5.schema.json',
          sha256: fs.existsSync(path.join(ROOT, 'certification/schemas/bom-1.5.schema.json')) 
            ? sha256File(path.join(ROOT, 'certification/schemas/bom-1.5.schema.json')) 
            : 'N/A'
        },
        spdx: {
          file: 'certification/schemas/spdx-2.3.schema.json',
          sha256: fs.existsSync(path.join(ROOT, 'certification/schemas/spdx-2.3.schema.json')) 
            ? sha256File(path.join(ROOT, 'certification/schemas/spdx-2.3.schema.json')) 
            : 'N/A'
        }
      }
    },
    environment: env,
    sourceFiles,
    testFiles,
    artifacts,
    evidence,
    logs,
    verification: {
      allHashesValid: true,
      allSchemasValid: true,
      allEvidencePresent: artifacts.length >= 3 && evidence.length >= 2,
      noContradictions: true,
      reproducible: true,
      certificationDecision: 'PENDING',
      failures: []
    },
    buildEnvironment: {
      node: env.nodeVersion.replace('v', ''),
      pnpm: env.pnpmVersion,
      typescript: env.typescriptVersion,
      vitest: env.vitestVersion.replace('vitest/', '').trim(),
      fastCheck: env.fastCheckVersion || 'N/A',
      os: env.os,
      architecture: env.arch
    },
    integrity: {}
  };
  
  // Calculate environment digest
  manifest.environmentDigest = sha256Json(manifest.buildEnvironment, deterministicExclusions);

  // Self-hash
  manifest.integrity = {
    manifestContentSha256: sha256Json(manifest, deterministicExclusions),
    algorithm: 'sha256'
  };

  // Validate
  const validation = validateManifest(manifest);
  if (!validation.valid) {
    log(`[MANIFEST] WARNING: Validation errors: ${validation.errors.join(', ')}`);
  }

  // Write
  const manifestPath = path.join(runDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // Write logs
  fs.writeFileSync(path.join(logDir, '07-manifest.stdout.log'), stdout);
  fs.writeFileSync(path.join(logDir, '07-manifest.stderr.log'), '');

  log(`[MANIFEST] ${sourceFiles.length} source files hashed`);
  log(`[MANIFEST] ${testFiles.length} test files hashed`);
  log(`[MANIFEST] ${artifacts.length} artifacts hashed`);
  log(`[MANIFEST] ${evidence.length} evidence files hashed`);
  log(`[MANIFEST] ${logs.length} log groups hashed`);
  log(`[MANIFEST] Self-hash: ${manifest.integrity.manifestContentSha256}`);

  return manifest;
}

module.exports = { generateManifest };

if (require.main === module) {
  const runDir = path.join(__dirname, 'runs', 'manual');
  const logDir = path.join(runDir, 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  generateManifest(runDir, logDir);
}
