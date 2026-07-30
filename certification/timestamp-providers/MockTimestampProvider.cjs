const TimestampProvider = require('./TimestampProvider.cjs');
const crypto = require('crypto');
const { getBuildTime, getDeterministicUUID, canonicalSortObject } = require('../deterministic.cjs');

class MockTimestampProvider extends TimestampProvider {
  async generateEvidence(request) {
    const buildTime = getBuildTime();
    
    // Instead of completely random, hash the request digest to make it deterministic
    const seedRfc = crypto.createHash('sha256').update(request.digest.value + 'rfc3161').digest('hex').substring(0, 8);
    const seedRekor = crypto.createHash('sha256').update(request.digest.value + 'rekor').digest('hex').substring(0, 8);
    
    const evidence = [
      {
        evidenceId: `urn:trajectoire:timestamp:rfc3161:v1:${seedRfc}`,
        type: 'trusted-time',
        provider: 'mock',
        status: 'collected',
        generatedAt: buildTime,
        subject: {
          algorithm: request.digest.algorithm,
          digest: request.digest.value
        },
        evidence: {
          tokenBase64: Buffer.from("MOCK_RFC3161_TOKEN_" + request.digest.value).toString('base64')
        }
      },
      {
        evidenceId: `urn:trajectoire:timestamp:rekor:v1:${seedRekor}`,
        type: 'transparency',
        provider: 'mock',
        status: 'collected',
        entryUUID: getDeterministicUUID('trajectoire', `timestamp:rekor:${request.digest.value}`),
        // A deterministic index based on the hash string
        logIndex: parseInt(seedRekor, 16) % 100000,
        integratedTime: buildTime,
        logID: "mock-log-id-001",
        inclusionProof: {
          treeSize: 1000,
          rootHash: crypto.createHash('sha256').update(request.digest.value + 'root').digest('hex'),
          hashes: []
        }
      }
    ];
    return canonicalSortObject(evidence);
  }
}

module.exports = MockTimestampProvider;
