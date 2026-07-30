const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { canonicalize } = require('json-canonicalize');

function getPrivateKey() {
  const localKeyPath = path.join(__dirname, 'keys', 'lab_private.pem');
  if (fs.existsSync(localKeyPath)) {
    return fs.readFileSync(localKeyPath, 'utf8');
  }
  throw new Error('No local lab key found. Cannot sign report.');
}

function signLabReport(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at ${filePath}`);
  }

  const privateKeyPem = getPrivateKey();
  const fileRaw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(fileRaw);
  
  const canonicalContent = canonicalize(parsed);
  const hashToSign = crypto.createHash('sha256').update(canonicalContent).digest('hex');

  let signatureBase64;
  try {
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const signatureBuffer = crypto.sign(null, Buffer.from(hashToSign, 'utf8'), privateKey);
    signatureBase64 = signatureBuffer.toString('base64');
  } catch (e) {
    throw new Error(`Failed to sign with provided private key: ${e.message}`);
  }

  const signatureData = {
    schemaVersion: '1.0.0',
    signatureAlgorithm: 'Ed25519',
    timestamp: new Date().toISOString(),
    hashSigned: hashToSign,
    signature: signatureBase64,
    fileSigned: path.basename(filePath)
  };

  const basename = path.basename(filePath, '.json');
  const signaturePath = path.join(path.dirname(filePath), `${basename}.sig.json`);
  fs.writeFileSync(signaturePath, JSON.stringify(signatureData, null, 2), 'utf8');
  
  return signaturePath;
}

module.exports = { signLabReport };
