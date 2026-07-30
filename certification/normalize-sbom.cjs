/**
 * normalize-sbom.cjs
 * Normalization Profile v1 for SBOM (CycloneDX & SPDX)
 * 
 * Rules:
 * - Purges non-deterministic timestamps and serial numbers.
 * - Stabilizes UUIDs if generated randomly by the tool.
 * - Sorts the components arrays (if not sorted by canonicalize, we sort them by name/version).
 */

const { getBuildTime, getDeterministicUUID, stableCompare, canonicalSortObject } = require('./deterministic.cjs');

function normalizeCycloneDx(sbom) {
  const norm = JSON.parse(JSON.stringify(sbom));
  
  norm.serialNumber = `urn:uuid:${getDeterministicUUID('trajectoire', 'sbom:cyclonedx')}`;
  
  if (norm.metadata) {
    norm.metadata.timestamp = getBuildTime();
  }

  if (Array.isArray(norm.components)) {
    norm.components.sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      if (nameA === nameB) {
        return stableCompare(a.version || '', b.version || '');
      }
      return stableCompare(nameA, nameB);
    });
  }
  
  if (Array.isArray(norm.dependencies)) {
    norm.dependencies.sort((a, b) => stableCompare(a.ref || '', b.ref || ''));
    for (const dep of norm.dependencies) {
      if (Array.isArray(dep.dependsOn)) {
        dep.dependsOn.sort(stableCompare);
      }
    }
  }

  return canonicalSortObject(norm);
}

function normalizeSpdx(sbom) {
  const norm = JSON.parse(JSON.stringify(sbom));
  
  if (norm.creationInfo) {
    norm.creationInfo.created = getBuildTime();
    if (Array.isArray(norm.creationInfo.creators)) {
      norm.creationInfo.creators = norm.creationInfo.creators.filter(c => !c.startsWith('Tool: cdxgen'));
      norm.creationInfo.creators.sort(stableCompare);
    }
  }

  norm.documentNamespace = `http://spdx.org/spdxdocs/trajectoire-${getDeterministicUUID('trajectoire', 'sbom:spdx')}`;

  if (Array.isArray(norm.packages)) {
    norm.packages.sort((a, b) => stableCompare(a.name || '', b.name || ''));
  }
  
  if (Array.isArray(norm.relationships)) {
    norm.relationships.sort((a, b) => {
      const spdxA = a.spdxElementId || '';
      const spdxB = b.spdxElementId || '';
      if (spdxA === spdxB) {
        return stableCompare(a.relatedSpdxElement || '', b.relatedSpdxElement || '');
      }
      return stableCompare(spdxA, spdxB);
    });
  }

  return canonicalSortObject(norm);
}

module.exports = {
  normalizeCycloneDx,
  normalizeSpdx,
  profile: 'SBOM Normalization Profile v1'
};
