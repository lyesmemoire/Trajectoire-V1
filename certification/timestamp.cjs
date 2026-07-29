/**
 * timestamp.cjs
 * Génère les évidences d'horodatage pour un artefact donné.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const MockTimestampProvider = require('./timestamp-providers/MockTimestampProvider.cjs');
const { signFile } = require('./sign.cjs');

async function generateTimestamps(artifactPath, runDir) {
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`File not found: ${artifactPath}`);
  }

  const rawFile = fs.readFileSync(artifactPath, 'utf8');
  const artifactId = path.basename(artifactPath);
  
  const digestValue = crypto.createHash('sha256').update(rawFile).digest('hex');
  let sigDigestValue = digestValue;

  try {
    const parsed = JSON.parse(rawFile);
    if (parsed.signatures && parsed.signatures.length > 0) {
      // Pour une enveloppe DSSE, le TSA horodate typiquement la signature brute
      const sigBase64 = parsed.signatures[0].sig;
      sigDigestValue = crypto.createHash('sha256').update(Buffer.from(sigBase64, 'base64')).digest('hex');
    }
  } catch (e) {
    // Not JSON or not DSSE, fallback to file digest
  }

  const request = {
    artifactId,
    digest: { algorithm: "sha256", value: digestValue },
    signatureDigest: { algorithm: "sha256", value: sigDigestValue }
  };

  // En fonction de la CI, on choisit le provider
  // Pour v1.0, on utilise Mock en dev, mais l'architecture permet d'injecter RFC3161/Rekor réels
  const provider = new MockTimestampProvider();
  
  const evidences = await provider.generateEvidence(request);

  const trustedTime = evidences.filter(e => e.type === 'trusted-time');
  const transparency = evidences.filter(e => e.type === 'transparency');

  const timestampDoc = {
    _type: "https://in-toto.io/Statement/v1",
    subject: [
      {
        name: artifactId,
        digest: {
          sha256: digestValue
        }
      }
    ],
    predicateType: "https://trajectoire.ai/predicate/timestamp/v1",
    predicate: {
      profile: "trajectoire-timestamp-v1",
      schemaVersion: "1.0",
      trustedTime,
      transparency
    }
  };

  const tsPath = path.join(runDir, 'timestamps.json');
  fs.writeFileSync(tsPath, JSON.stringify(timestampDoc, null, 2));

  // On encapsule timestamps.json dans une DSSE -> timestamps.dsse.json
  const dssePath = signFile(tsPath, runDir);
  
  console.log(`[TIMESTAMP] Evidences temporelles générées et signées -> ${path.basename(dssePath)}`);
  return dssePath;
}

if (require.main === module) {
  const artifactPath = process.argv[2];
  const runDir = process.argv[3];
  if (!artifactPath || !runDir) {
    console.error('Usage: node timestamp.cjs <artifact_path> <run_dir>');
    process.exit(1);
  }
  generateTimestamps(artifactPath, runDir).catch(err => {
    console.error(`[TIMESTAMP ERROR] ${err.message}`);
    process.exit(1);
  });
}

module.exports = { generateTimestamps };
