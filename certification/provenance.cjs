const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');
const { canonicalize } = require('json-canonicalize');
const { signFile } = require('./sign.cjs');
const { getBuildTime, getDeterministicUUID, getQualificationId, canonicalSortObject, stableCompare } = require('./deterministic.cjs');

const ROOT = path.resolve(__dirname, '..');

function getGitData() {
  try {
    const commit = execSync('git log -1 --format=%H', { cwd: ROOT }).toString().trim();
    const tree = execSync('git log -1 --format=%T', { cwd: ROOT }).toString().trim();
    let branch = 'unknown';
    try {
      branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
    } catch (e) {}
    
    // Check if dirty
    let isDirty = false;
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT }).toString().trim();
      isDirty = status.length > 0;
    } catch (e) {}

    return { commit, tree, branch, isDirty };
  } catch (e) {
    return { commit: 'unknown', tree: 'unknown', branch: 'unknown', isDirty: false };
  }
}

function getFileDigest(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function generateProvenance(runDir) {
  console.log('  [PROVENANCE] Génération de l\'attestation SLSA in-toto (DSSE)...');
  
  const gitData = getGitData();
  const buildTime = getBuildTime();
  
  // Artifacts to include in the subject
  const artifacts = [
    'manifest.json', 'manifest.dsse.json',
    'sbom-cyclonedx.json', 'sbom-cyclonedx.dsse.json', 'sbom-spdx.json',
    'audit-cve.json', 'audit-cve.dsse.json',
    'coverage-final.json', 'coverage-report.json',
    'vitest-results-M1.json', 'mutation-report.json',
    'vitest-results-R1.json', 'regression-report.json'
  ];

  const subjects = [];
  for (const art of artifacts) {
    const p = path.join(runDir, art);
    const digest = getFileDigest(p);
    if (digest) {
      subjects.push({
        name: art,
        digest: { sha256: digest }
      });
    }
  }
  subjects.sort((a, b) => stableCompare(a.name, b.name));

  const builderId = 'urn:trajectoire:builder:v1';
  const invocationId = getDeterministicUUID('trajectoire', `provenance:invocation:${gitData.commit}`);

  const provenance = {
    _type: 'https://in-toto.io/Statement/v1',
    subject: subjects,
    predicateType: 'https://slsa.dev/provenance/v1',
    predicate: {
      buildDefinition: {
        buildType: 'urn:trajectoire:buildtype:hermetic-node-pnpm:v1',
        externalParameters: {
          source: {
            uri: 'git+https://github.com/org/repo.git',
            commit: { algorithm: 'git-sha1', value: gitData.commit },
            tree: { algorithm: 'git-sha1', value: gitData.tree },
            branch: gitData.branch,
            isDirty: gitData.isDirty
          },
          command: 'bash certification/docker/run-certification.sh'
        }
      },
      runDetails: {
        builder: {
          id: builderId
        },
        metadata: {
          schemaVersion: '1.0',
          invocationId: invocationId,
          qualificationId: getQualificationId(),
          startedOn: buildTime,
          finishedOn: buildTime
        },
        environment: {
          profiles: {
            provenance: "trajectoire-provenance-v1",
            snapshot: "trajectoire-snapshot-v1",
            hermeticity: "trajectoire-hermetic-v1",
            laboratory: "trajectoire-laboratory-v1"
          },
          builderConfigurationDigest: {
            "Dockerfile": getFileDigest(path.join(ROOT, 'certification', 'docker', 'Dockerfile')),
            "docker-compose.yml": getFileDigest(path.join(ROOT, 'certification', 'docker', 'docker-compose.yml')),
            "hermeticity.json": getFileDigest(path.join(ROOT, 'certification', 'policy', 'hermeticity.json'))
          },
          runtimeEvidence: {
            imageDigest: process.env.IMAGE_DIGEST || 'sha256:unknown',
            networkMode: "none",
            isRootFilesystemReadOnly: true
          }
        }
      }
    },
    cryptoPolicy: {
      digest: 'SHA-256',
      canonicalization: 'RFC8785',
      signature: 'Ed25519',
      dsse: 'v1'
    }
  };

  const { createDsseEnvelope } = require('./sign.cjs');
  const { validateInTotoStatement, validateSlsaProvenance } = require('./validate.cjs');
  
  const slsaValidation = validateSlsaProvenance(provenance.predicate);
  if (!slsaValidation.valid) {
    throw new Error(`[L-023] SLSA v1.0 Schema validation failed: ${slsaValidation.errors.join(', ')}`);
  }
  
  const intotoValidation = validateInTotoStatement(provenance);
  if (!intotoValidation.valid) {
    throw new Error(`[L-023] in-toto Statement Schema validation failed: ${intotoValidation.errors.join(', ')}`);
  }

  const dsseEnvelope = createDsseEnvelope(provenance);
  
  const provPath = path.join(runDir, 'provenance.dsse.json');
  fs.writeFileSync(provPath, JSON.stringify(canonicalSortObject(dsseEnvelope), null, 2));
  
  console.log(`  ✅ [PROVENANCE] Attestation générée avec succès pour ${subjects.length} artefacts (Enveloppe DSSE).`);
  return provPath;
}

module.exports = { generateProvenance };
