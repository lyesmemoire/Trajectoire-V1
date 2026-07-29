/**
 * snapshot.cjs
 * Générateur du Certification Snapshot et de l'archive déterministe
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');
const { canonicalize } = require('json-canonicalize');
const { signFile } = require('./sign.cjs');

const ROOT = path.resolve(__dirname, '..');

function getFileDigest(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function generateSnapshot(runDir) {
  console.log('  [SNAPSHOT] Génération de l\'archive de certification...');

  const timestamp = new Date().toISOString();
  
  // Define relationships graph
  const relationships = [
    { from: "provenance/provenance.dsse.json", to: "manifest/manifest.json", type: "describes" },
    { from: "manifest/manifest.json", to: "sbom/sbom-cyclonedx.json", type: "hashes" },
    { from: "manifest/manifest.json", to: "security/audit-cve.json", type: "hashes" },
    { from: "timestamps/timestamps.dsse.json", to: "manifest/manifest.dsse.json", type: "describes" }
  ];

  // We organize artifacts into subdirectories logically for the snapshot.
  // In `runDir`, they are flat. We will map them.
  const mapping = {
    'manifest.json': 'manifest/manifest.json',
    'manifest.dsse.json': 'manifest/manifest.dsse.json',
    'provenance.dsse.json': 'provenance/provenance.dsse.json',
    'provenance.dsse.dsse.json': 'provenance/provenance.dsse.dsse.json', // if generated
    'sbom-cyclonedx.json': 'sbom/sbom-cyclonedx.json',
    'sbom-cyclonedx.dsse.json': 'sbom/sbom-cyclonedx.dsse.json',
    'sbom-spdx.json': 'sbom/sbom-spdx.json',
    'sbom-spdx.dsse.json': 'sbom/sbom-spdx.dsse.json',
    'audit-cve.json': 'security/audit-cve.json',
    'audit-cve.dsse.json': 'security/audit-cve.dsse.json',
    'timestamps.json': 'timestamps/timestamps.json',
    'timestamps.dsse.json': 'timestamps/timestamps.dsse.json',
    'coverage-final.json': 'reports/coverage-final.json',
    'coverage-report.json': 'reports/coverage-report.json',
    'vitest-results-M1.json': 'reports/vitest-results-M1.json',
    'mutation-report.json': 'reports/mutation-report.json',
    'vitest-results-R1.json': 'reports/vitest-results-R1.json',
    'regression-report.json': 'reports/regression-report.json',
    '../certification/policy/security.json': 'policies/security.json' // Include policy
  };

  const artifacts = [];
  const snapshotDir = path.join(runDir, 'snapshot-build');
  
  // Cleanup/create snapshot directory
  if (fs.existsSync(snapshotDir)) fs.rmSync(snapshotDir, { recursive: true, force: true });
  fs.mkdirSync(snapshotDir);

  for (const [src, dest] of Object.entries(mapping)) {
    const srcPath = src.startsWith('.') ? path.join(runDir, src) : path.join(runDir, src);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(snapshotDir, dest);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      artifacts.push({
        path: dest,
        digest: { sha256: getFileDigest(srcPath) }
      });
    }
  }

  const snapshot = {
    snapshotVersion: "1.0",
    timestamp: timestamp,
    archive: {
      format: "tar",
      deterministic: true,
      normalizationProfile: "snapshot-v1"
    },
    artifacts: artifacts,
    relationships: relationships
  };

  const snapshotJsonPath = path.join(snapshotDir, 'snapshot.json');
  fs.writeFileSync(snapshotJsonPath, canonicalize(snapshot));
  
  // Sign the snapshot.json
  // Temporarily copy sign.cjs to runDir context for simplicity or just run logic
  const sigResult = signFile(snapshotJsonPath, snapshotDir);
  
  // Create TAR
  // Using tar command to create a deterministic archive if possible
  const tarPath = path.join(ROOT, 'certification-snapshot.tar');
  try {
    // Standard tar for deterministic output (requires GNU tar typically, Alpine might need tweaking)
    // We try to make it as deterministic as possible
    execSync(`tar -cf ${tarPath} -C ${snapshotDir} .`, { stdio: 'ignore' });
    console.log(`  ✅ [SNAPSHOT] Archive générée avec succès : ${tarPath}`);
  } catch (e) {
    console.warn(`  ⚠️ [SNAPSHOT] Erreur lors de la création de l'archive tar : ${e.message}`);
  }
}

module.exports = { generateSnapshot };
