const crypto = require('crypto');
const { createPae } = require('./dsse-util.cjs');

function sign(statement) {
  const payloadType = 'application/vnd.in-toto+json';
  const { payloadB64, pae } = createPae(statement, payloadType);
  
  // MOCK: En réalité, on appellerait `gpg --detach-sign --armor`
  
  const mockSignature = crypto.randomBytes(128).toString('base64');
  
  const dsseEnvelope = {
    payloadType,
    payload: payloadB64,
    signatures: [
      {
        keyid: "mock-gpg-fingerprint",
        sig: mockSignature
      }
    ]
  };

  const metadata = {
    algorithm: 'RSA',
    provider: 'gpg',
    keyId: "mock-gpg-fingerprint",
    assuranceLevel: "LOWER_ASSURANCE_NO_TRANSPARENCY",
    supports: {
      dsse: true,
      keyless: false,
      transparencyLog: false,
      certificateChain: false
    },
    execution: {
      mode: 'mock'
    }
  };

  return { dsseEnvelope, metadata };
}

module.exports = { sign };
