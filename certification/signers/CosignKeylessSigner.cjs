const crypto = require('crypto');
const { createPae } = require('./dsse-util.cjs');

function sign(statement) {
  const payloadType = 'application/vnd.in-toto+json';
  const { payloadB64, pae } = createPae(statement, payloadType);
  
  // MOCK: En réalité, on appellerait `@sigstore/sign` ou `cosign sign-blob --identity-token`
  // Pour le laboratoire, nous simulons la création d'une signature OIDC + Fulcio + Rekor
  
  const mockSignature = crypto.randomBytes(64).toString('base64');
  
  const dsseEnvelope = {
    payloadType,
    payload: payloadB64,
    signatures: [
      {
        keyid: "https://sigstore.dev/rekor/mock",
        sig: mockSignature
      }
    ]
  };

  const metadata = {
    algorithm: 'ECDSA-P256', // Typique pour Sigstore
    provider: 'cosign-keyless',
    certificate: '-----BEGIN CERTIFICATE-----\nMOCK_FULCIO_CERT\n-----END CERTIFICATE-----',
    transparencyLog: {
      provider: 'Rekor',
      entryUUID: crypto.randomUUID()
    },
    supports: {
      dsse: true,
      keyless: true,
      transparencyLog: true,
      certificateChain: true
    },
    execution: {
      mode: 'mock'
    }
  };

  return { dsseEnvelope, metadata };
}

module.exports = { sign };
