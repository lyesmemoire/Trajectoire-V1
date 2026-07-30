/**
 * hash.cjs — SHA256 utility library for certification pipeline
 * All hash operations in the pipeline go through this module.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Compute SHA256 of a string or Buffer.
 * @param {string|Buffer} content
 * @returns {string} lowercase hex SHA256
 */
function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Compute SHA256 of a file on disk.
 * @param {string} filePath
 * @returns {string} lowercase hex SHA256
 */
function sha256File(filePath) {
  const content = fs.readFileSync(filePath);
  return sha256(content);
}

/**
 * Compute SHA256 of a JSON object (canonical serialization).
 * @param {object} obj
 * @param {string[]} excludeKeys - keys to exclude before hashing
 * @returns {string} lowercase hex SHA256
 */
function clean(obj, exclusions) {
  const cleaned = JSON.parse(JSON.stringify(obj));
  for (const pathStr of exclusions) {
    const parts = pathStr.split('.');
    
    function applyPath(current, partIndex) {
      if (current == null) return;
      if (partIndex === parts.length - 1) {
        const lastPart = parts[partIndex];
        if (lastPart === '*' && Array.isArray(current)) {
           // Can't delete array elements like this, usually wildcard is not the last part if we want to delete a key
        } else if (typeof current === 'object' && lastPart in current) {
          delete current[lastPart];
        }
        return;
      }
      
      const part = parts[partIndex];
      if (part === '*' && Array.isArray(current)) {
        for (let i = 0; i < current.length; i++) {
          applyPath(current[i], partIndex + 1);
        }
      } else if (typeof current === 'object') {
        applyPath(current[part], partIndex + 1);
      }
    }
    
    applyPath(cleaned, 0);
  }
  return cleaned;
}

function sortKeys(obj) {
  if (obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortKeys);
  const sorted = {};
  Object.keys(obj).sort().forEach(k => {
    sorted[k] = sortKeys(obj[k]);
  });
  return sorted;
}

function sha256Json(obj, excludeKeys = []) {
  const cleaned = clean(obj, excludeKeys);
  const sorted = sortKeys(cleaned);
  return sha256(JSON.stringify(sorted, null, 2));
}

function sha256Artifact(artifact) {
  const thresholdsPath = require('path').join(__dirname, 'policy', 'thresholds.json');
  const tData = JSON.parse(require('fs').readFileSync(thresholdsPath, 'utf8'));
  const exclusions = ['integrity', ...(tData.policy.deterministicHashExclusions || [])];
  return sha256Json(artifact, exclusions);
}

/**
 * Compute SHA256 of all files in a directory (recursive).
 * @param {string} dirPath
 * @returns {Array<{path: string, sha256: string, sizeBytes: number}>}
 */
function sha256Dir(dirPath) {
  const results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...sha256Dir(fullPath));
    } else {
      const stat = fs.statSync(fullPath);
      results.push({
        path: fullPath.replace(/\\/g, '/'),
        sha256: sha256File(fullPath),
        sizeBytes: stat.size
      });
    }
  }
  return results;
}

module.exports = { sha256, sha256File, sha256Json, sha256Dir, sha256Artifact };
