/**
 * publish.cjs — Publication manifest generator
 * Generates a unified manifest for external consumers (GitHub Releases, registries).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256File(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function generatePublicationManifest(runDir) {
  const manifestPath = path.join(runDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Cannot publish: manifest.json not found in ${runDir}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  const publication = {
    schemaVersion: "https://trajectoire.com/schema/publication/v1",
    metadata: {
      gitSha: manifest.metadata.gitSha,
      version: manifest.metadata.version || "1.0.0",
      publishedAt: new Date().toISOString()
    },
    artifacts: manifest.artifacts.map(art => ({
      name: art.filePath.split('/').pop(),
      digest: {
        sha256: art.sha256
      }
    })),
    provenance: {
      uri: "provenance.dsse.json",
      digest: {
        sha256: sha256File(path.join(runDir, 'provenance.dsse.json')) || "MISSING"
      }
    },
    sbom: {
      uri: "sbom.json", // Usually generated separately
      digest: {
        sha256: "MOCK_SBOM_DIGEST"
      }
    }
  };

  const publishPath = path.join(runDir, 'publication-manifest.json');
  fs.writeFileSync(publishPath, JSON.stringify(publication, null, 2));
  
  console.log(`  📦 [PUBLISH] Publication manifest generated: ${publishPath}`);
  return publishPath;
}

if (require.main === module) {
  const runDir = process.argv[2];
  if (!runDir) {
    console.error('Usage: node publish.cjs <run_dir>');
    process.exit(1);
  }
  generatePublicationManifest(runDir);
}

module.exports = { generatePublicationManifest };
