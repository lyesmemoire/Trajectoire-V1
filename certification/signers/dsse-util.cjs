const { canonicalize } = require('json-canonicalize');

function createPae(payloadObject, payloadType = 'application/vnd.in-toto+json') {
  const payloadStr = canonicalize(payloadObject);
  const payloadB64 = Buffer.from(payloadStr, 'utf8').toString('base64');
  const pae = `DSSEv1 ${payloadType.length} ${payloadType} ${Buffer.byteLength(payloadStr, 'utf8')} ${payloadStr}`;
  
  return { payloadB64, pae };
}

module.exports = { createPae };
