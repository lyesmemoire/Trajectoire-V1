const crypto = require('crypto');
const { execSync } = require('child_process');
const path = require('path');

let cachedBuildTime = null;
let cachedCommitSha = null;

/**
 * Returns a deterministic build time.
 * Hierarchy: SOURCE_DATE_EPOCH -> git commit timestamp -> throws error
 */
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
  } catch (e) {
    // ignore and fall through
  }

  throw new Error("REPRODUCIBLE BUILD ERROR: Cannot determine deterministic build time. Set SOURCE_DATE_EPOCH or run in a Git repository.");
}

/**
 * Gets the current commit SHA to use as a seed for UUIDs.
 */
function getCommitSha() {
  if (cachedCommitSha) return cachedCommitSha;
  try {
    cachedCommitSha = execSync('git rev-parse HEAD', { stdio: 'pipe' }).toString().trim();
    return cachedCommitSha;
  } catch (e) {
    return 'UNKNOWN_COMMIT';
  }
}

/**
 * Generates a deterministic UUID (truncated SHA-256 formatted as UUID)
 * @param {string} namespace 
 * @param {string} name 
 */
function getDeterministicUUID(namespace, name) {
  const commit = getCommitSha();
  const seed = `${namespace}:${commit}:${name}`;
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  
  // Format as UUID: 8-4-4-4-12
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

/**
 * Normalizes paths to use forward slashes.
 */
function normalizePath(p) {
  if (!p) return p;
  return p.replace(/\\/g, '/');
}

/**
 * Normalizes line endings to LF.
 */
function normalizeLineEndings(text) {
  if (!text) return text;
  return text.replace(/\r\n/g, '\n');
}

/**
 * A stable compare function for strings.
 */
function stableCompare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Recursively sorts an object's keys for canonical JSON serialization.
 */
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

/**
 * Sorts an array of file objects by their `path` or `filePath` property.
 */
function sortFiles(files) {
  return files.sort((a, b) => {
    const pathA = normalizePath(a.path || a.filePath || a.name || '');
    const pathB = normalizePath(b.path || b.filePath || b.name || '');
    return stableCompare(pathA, pathB);
  });
}

/**
 * Normalizes tar metadata for reproducible archives.
 */
function getNormalizedTarMetadata() {
  const buildTime = new Date(getBuildTime());
  return {
    mtime: buildTime,
    uid: 0,
    gid: 0,
    uname: '',
    gname: '',
    mode: 0o644,
    dirMode: 0o755
  };
}

/**
 * Generates a deterministic Qualification ID.
 * Format: TRAJECTOIRE-{profile}-{year}-{shortHash}
 * Derived from: releaseVersion + profile + commit SHA + SOURCE_DATE_EPOCH
 * @param {string} releaseVersion - e.g. "1.0.0"
 * @param {string} profile - e.g. "Q1.0"
 * @returns {string} e.g. "TRAJECTOIRE-Q1.0-2026-a3b7c9d1"
 */
function getQualificationId(releaseVersion = '1.0.0', profile = 'Q1.0') {
  const commit = getCommitSha();
  const buildTime = getBuildTime();
  const year = new Date(buildTime).getFullYear();
  const seed = `qualification:${releaseVersion}:${profile}:${commit}:${buildTime}`;
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  return `TRAJECTOIRE-${profile}-${year}-${hash.slice(0, 8)}`;
}

module.exports = {
  getBuildTime,
  getCommitSha,
  getDeterministicUUID,
  getQualificationId,
  normalizePath,
  normalizeLineEndings,
  stableCompare,
  canonicalSortObject,
  sortFiles,
  getNormalizedTarMetadata
};
