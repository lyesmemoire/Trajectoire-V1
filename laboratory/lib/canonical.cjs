const crypto = require('crypto');
const { execSync } = require('child_process');

let cachedBuildTime = null;
let cachedCommitSha = null;

function getBuildTime() {
  if (cachedBuildTime) return cachedBuildTime;
  if (process.env.SOURCE_DATE_EPOCH) {
    const epoch = parseInt(process.env.SOURCE_DATE_EPOCH, 10);
    cachedBuildTime = new Date(epoch * 1000).toISOString();
    return cachedBuildTime;
  }
  try {
    const gitTime = execSync('git log -1 --format=%cI', { stdio: 'pipe' }).toString().trim();
    if (gitTime) {
      cachedBuildTime = new Date(gitTime).toISOString();
      return cachedBuildTime;
    }
  } catch (e) {}
  throw new Error("REPRODUCIBLE BUILD ERROR: Cannot determine deterministic build time.");
}

function getCommitSha() {
  if (cachedCommitSha) return cachedCommitSha;
  try {
    cachedCommitSha = execSync('git rev-parse HEAD', { stdio: 'pipe' }).toString().trim();
    return cachedCommitSha;
  } catch (e) {
    return 'UNKNOWN_COMMIT';
  }
}

function stableCompare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function canonicalSortObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(canonicalSortObject);
  }
  const sorted = {};
  const keys = Object.keys(obj).sort(stableCompare);
  for (const k of keys) {
    sorted[k] = canonicalSortObject(obj[k]);
  }
  return sorted;
}

module.exports = {
  getBuildTime,
  getCommitSha,
  stableCompare,
  canonicalSortObject
};
