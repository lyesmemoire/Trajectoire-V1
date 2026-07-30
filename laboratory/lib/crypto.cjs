const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { canonicalSortObject } = require('./canonical.cjs');

// PAE (Pre-Authentication Encoding) formatting
function createPae(statement, payloadType = 'application/vnd.in-toto+json') {
  const payloadStr = JSON.stringify(canonicalSortObject(statement));
  const payloadB64 = Buffer.from(payloadStr, 'utf8').toString('base64');
  
  // PAE format: "DSSEv1" + " " + length(payloadType) + " " + payloadType + " " + length(payloadB64) + " " + payloadB64
  const pae = `DSSEv1 ${payloadType.length} ${payloadType} ${payloadB64.length} ${payloadB64}`;
  
  return { payloadStr, payloadB64, pae };
}

function getLabPrivateKey() {
  const keyPath = path.join(__dirname, '..', 'keys', 'lab_private.pem');
  if (!fs.existsSync(keyPath)) {
    throw new Error('Lab private key not found');
  }
  return fs.readFileSync(keyPath, 'utf8');
}

// Validation logic for DSSE Envelope
function validateDsseSignature(dsseEnvelope, expectedPublicKeyPem) {
  if (!dsseEnvelope || !dsseEnvelope.signatures || dsseEnvelope.signatures.length === 0) {
    return { valid: false, errors: ['Missing signatures array'] };
  }
  
  const payloadType = dsseEnvelope.payloadType;
  const payloadB64 = dsseEnvelope.payload;
  
  const pae = `DSSEv1 ${payloadType.length} ${payloadType} ${payloadB64.length} ${payloadB64}`;
  const paeBuffer = Buffer.from(pae, 'utf8');
  
  let validSigs = 0;
  for (const sigInfo of dsseEnvelope.signatures) {
    const signatureBuffer = Buffer.from(sigInfo.sig, 'base64');
    try {
      const pubKey = crypto.createPublicKey(expectedPublicKeyPem);
      const isVerified = crypto.verify(null, paeBuffer, pubKey, signatureBuffer);
      if (isVerified) {
        validSigs++;
      }
    } catch (e) {
      // Signature verify failed or key format invalid
    }
  }
  
  if (validSigs > 0) {
    return { valid: true, errors: [] };
  }
  
  return { valid: false, errors: ['No valid signatures found matching the provided public key'] };
}

// Signing logic for Lab
function signForLab(payloadObject) {
  const payloadType = 'application/vnd.in-toto+json';
  const { payloadB64, pae } = createPae(payloadObject, payloadType);
  
  const privateKeyPem = getLabPrivateKey();
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signatureBuffer = crypto.sign(null, Buffer.from(pae, 'utf8'), privateKey);
  const signatureBase64 = signatureBuffer.toString('base64');
  
  const dsseEnvelope = {
    payloadType,
    payload: payloadB64,
    signatures: [
      {
        keyid: "urn:trajectoire:keys:lab:v1",
        sig: signatureBase64,
        metadata: {
          algorithm: 'Ed25519',
          provider: 'laboratory-ed25519',
          execution: { mode: 'audit' }
        }
      }
    ]
  };
  
  return dsseEnvelope;
}

module.exports = {
  createPae,
  validateDsseSignature,
  signForLab
};
