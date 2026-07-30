const crypto = require('crypto');
const { createPae } = require('./dsse-util.cjs');

function sign(statement) {
  const payloadType = 'application/vnd.in-toto+json';
  const { payloadB64, pae } = createPae(statement, payloadType);
  
  // MOCK: En réalité, on appellerait `@aws-sdk/client-kms` 
  // const client = new KMSClient({ region: "eu-west-3" });
  // const command = new SignCommand({ KeyId: "alias/trajectoire-slsa", Message: pae, SigningAlgorithm: "RSASSA_PSS_SHA_256" });
  
  const mockSignature = crypto.randomBytes(256).toString('base64');
  
  const dsseEnvelope = {
    payloadType,
    payload: payloadB64,
    signatures: [
      {
        keyid: "arn:aws:kms:eu-west-3:123456789012:key/mock-kms-key",
        sig: mockSignature
      }
    ]
  };

  const metadata = {
    algorithm: 'RSASSA_PSS_SHA_256',
    provider: 'aws-kms',
    keyId: "arn:aws:kms:eu-west-3:123456789012:key/mock-kms-key",
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
