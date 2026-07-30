const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createPae } = require('./dsse-util.cjs');

function getPrivateKey() {
  if (process.env.CERT_PRIVATE_KEY) {
    return process.env.CERT_PRIVATE_KEY;
  }
  const localKeyPath = path.join(__dirname, '..', 'keys', 'pipeline_private.pem');
  if (fs.existsSync(localKeyPath)) {
    return fs.readFileSync(localKeyPath, 'utf8');
  }
  throw new Error('CERT_PRIVATE_KEY environment variable is not set and no local lab key found. Cannot sign artifact.');
}

function sign(statement) {
  const payloadType = 'application/vnd.in-toto+json';
  const { payloadB64, pae } = createPae(statement, payloadType);
  
  const privateKeyPem = getPrivateKey();
  let signatureBase64;
  try {
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const signatureBuffer = crypto.sign(null, Buffer.from(pae, 'utf8'), privateKey);
    signatureBase64 = signatureBuffer.toString('base64');
  } catch (e) {
    throw new Error(`Failed to sign DSSE PAE with local Ed25519: ${e.message}`);
  }

  const dsseEnvelope = {
    payloadType,
    payload: payloadB64,
    signatures: [
      {
        keyid: "urn:trajectoire:keys:ed25519:v1",
        sig: signatureBase64
      }
    ]
  };

  const metadata = {
    algorithm: 'Ed25519',
    provider: 'local-ed25519',
    keyId: "urn:trajectoire:keys:ed25519:v1",
    supports: {
      dsse: true,
      keyless: false,
      transparencyLog: false,
      certificateChain: false
    },
    execution: {
      mode: 'production' // Le signataire local Ed25519 est l'identité "production" du labo
    }
  };

  return { dsseEnvelope, metadata };
}

module.exports = { sign };
