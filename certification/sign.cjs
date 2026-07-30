const fs = require('fs');
const path = require('path');

function getSigner(provider) {
  switch (provider) {
    case 'local-ed25519': return require('./signers/Ed25519Signer.cjs');
    case 'cosign-keyless': return require('./signers/CosignProvider.cjs');
    case 'aws-kms': return require('./signers/AwsKmsSigner.cjs');
    case 'gpg': return require('./signers/GpgSigner.cjs');
    default: throw new Error(`Unknown signature provider: ${provider}`);
  }
}

function getPolicy() {
  const policyPath = path.join(__dirname, 'policy', 'signature.json');
  if (fs.existsSync(policyPath)) {
    return JSON.parse(fs.readFileSync(policyPath, 'utf8')).signaturePolicy;
  }
  // Default fallback if policy is missing
  return { requiredSignatures: ['local-ed25519'], optionalSignatures: [] };
}

function createDsseEnvelope(payloadObject, payloadType = 'application/vnd.in-toto+json') {
  const policy = getPolicy();
  const reqSigs = policy.requiredSignatures || [];
  const optSigs = policy.optionalSignatures || [];
  
  const providers = [...reqSigs.map(s => s.provider), ...optSigs.map(s => s.provider)];
  
  if (providers.length === 0) {
    throw new Error('No signature providers configured in policy.');
  }

  // We take the first provider as the primary one that generates the base DSSE
  const primaryProvider = providers[0];
  const primarySigner = getSigner(primaryProvider);
  
  let { dsseEnvelope, metadata } = primarySigner.sign(payloadObject);
  
  // Inject metadata into the first signature for laboratory trace
  dsseEnvelope.signatures[0].metadata = metadata;

  // Add additional signatures if required/optional
  for (let i = 1; i < providers.length; i++) {
    const signer = getSigner(providers[i]);
    const result = signer.sign(payloadObject);
    result.dsseEnvelope.signatures[0].metadata = result.metadata;
    dsseEnvelope.signatures.push(result.dsseEnvelope.signatures[0]);
  }

  return dsseEnvelope;
}

function signFile(filePath, runDir) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at ${filePath}`);
  }
  
  const fileRaw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(fileRaw);
  
  // Strict Schema Validation for manifest
  if (filePath.endsWith('manifest.json')) {
    const { validateManifest } = require('./validate.cjs');
    const validation = validateManifest(parsed);
    if (!validation.valid) {
      throw new Error(`[L-023] Schema validation failed for ${filePath}: ${validation.errors.join(', ')}`);
    }
  }
  
  // Note: createDsseEnvelope will handle canonicalization and digest internally.
  const dsseEnvelope = createDsseEnvelope(parsed, 'application/json');
  
  const basename = path.basename(filePath, '.json');
  // Check if it's already a .dsse.json, don't double it
  let outName = basename.endsWith('.dsse') ? `${basename}.json` : `${basename}.dsse.json`;
  
  // Wait, if filePath is `manifest.json`, basename is `manifest`.
  // Out should be `manifest.dsse.json`.
  // If filePath is `provenance.dsse.json`, basename is `provenance.dsse`.
  if (basename.endsWith('.dsse')) {
    outName = basename + '.json';
  } else {
    outName = basename + '.dsse.json';
  }
  
  const signaturePath = path.join(runDir, outName);
  
  const { canonicalSortObject } = require('./deterministic.cjs');
  fs.writeFileSync(signaturePath, JSON.stringify(canonicalSortObject(dsseEnvelope), null, 2), 'utf8');
  console.log(`[SIGNATURE] ${path.basename(filePath)} signed successfully with DSSE -> ${outName}`);
  
  return signaturePath;
}

if (require.main === module) {
  const runDir = process.argv[2];
  if (!runDir) {
    console.error('Usage: node sign.cjs <run_dir>');
    process.exit(1);
  }
  
  try {
    signFile(path.join(runDir, 'manifest.json'), runDir);
  } catch (err) {
    console.error(`[SIGNATURE ERROR] ${err.message}`);
    process.exit(1);
  }
}

module.exports = { signFile, createDsseEnvelope };
