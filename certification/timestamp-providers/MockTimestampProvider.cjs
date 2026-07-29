const TimestampProvider = require('./TimestampProvider.cjs');
const crypto = require('crypto');

class MockTimestampProvider extends TimestampProvider {
  async generateEvidence(request) {
    return [
      {
        evidenceId: `urn:trajectoire:timestamp:rfc3161:v1:${crypto.randomBytes(4).toString('hex')}`,
        type: 'trusted-time',
        provider: 'mock',
        status: 'collected',
        generatedAt: new Date().toISOString(),
        subject: {
          algorithm: request.digest.algorithm,
          digest: request.digest.value
        },
        evidence: {
          tokenBase64: Buffer.from("MOCK_RFC3161_TOKEN_" + request.digest.value).toString('base64')
        }
      },
      {
        evidenceId: `urn:trajectoire:timestamp:rekor:v1:${crypto.randomBytes(4).toString('hex')}`,
        type: 'transparency',
        provider: 'mock',
        status: 'collected',
        entryUUID: crypto.randomUUID(),
        logIndex: Math.floor(Math.random() * 100000),
        integratedTime: new Date().toISOString(),
        logID: "mock-log-id-001",
        inclusionProof: {
          treeSize: 1000,
          rootHash: crypto.randomBytes(32).toString('hex'),
          hashes: []
        }
      }
    ];
  }
}

module.exports = MockTimestampProvider;
