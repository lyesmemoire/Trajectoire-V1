const crypto = require('crypto');
const fs = require('fs');

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function sha256File(filePath) {
  return sha256(fs.readFileSync(filePath));
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

function clean(obj, exclusions) {
  const cleaned = JSON.parse(JSON.stringify(obj));
  for (const pathStr of exclusions) {
    const parts = pathStr.split('.');
    
    function applyPath(current, partIndex) {
      if (current == null) return;
      if (partIndex === parts.length - 1) {
        const lastPart = parts[partIndex];
        if (lastPart === '*' && Array.isArray(current)) {
           // Not deleting array elements
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

function sha256Json(obj, exclusions = []) {
  const cleaned = clean(obj, exclusions);
  const sorted = sortKeys(cleaned);
  return sha256(JSON.stringify(sorted, null, 2));
}

module.exports = { sha256, sha256File, sha256Json };
