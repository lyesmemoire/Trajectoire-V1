/**
 * independent-normalize-sbom.cjs
 * Clean-room implementation of SBOM Normalization Profile v1.
 * Must NOT import from the pipeline.
 */

function independentNormalizeCdx(sbom) {
  const data = JSON.parse(JSON.stringify(sbom));
  
  if (data.serialNumber) delete data.serialNumber;
  if (data.metadata && data.metadata.timestamp) delete data.metadata.timestamp;
  
  if (Array.isArray(data.components)) {
    data.components.sort((a, b) => {
      const n1 = a.name || '';
      const n2 = b.name || '';
      if (n1 !== n2) return n1.localeCompare(n2);
      return (a.version || '').localeCompare(b.version || '');
    });
  }
  return data;
}

function independentNormalizeSpdx(sbom) {
  const data = JSON.parse(JSON.stringify(sbom));
  
  if (data.documentNamespace) delete data.documentNamespace;
  if (data.creationInfo) {
    if (data.creationInfo.created) delete data.creationInfo.created;
    if (Array.isArray(data.creationInfo.creators)) {
      data.creationInfo.creators = data.creationInfo.creators.filter(c => c.indexOf('Tool: cdxgen') === -1);
    }
  }
  
  if (Array.isArray(data.packages)) {
    data.packages.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }
  return data;
}

module.exports = {
  independentNormalizeCdx,
  independentNormalizeSpdx,
  profile: 'SBOM Normalization Profile v1'
};
