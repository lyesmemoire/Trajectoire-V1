/**
 * evidence.cjs — Capture environment, git state, and tool versions
 * Produces the foundational evidence for the certification run.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { sha256File } = require('./hash.cjs');

const ROOT = path.resolve(__dirname, '..');

function captureCmd(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 10 * 1024 * 1024 }).trim();
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

function captureEnvironment() {
  const nodeVersion = captureCmd('node --version');
  const vitestVersion = captureCmd('npx vitest --version');
  const tscVersion = captureCmd('npx tsc --version');

  let pnpmVersion;
  try { pnpmVersion = captureCmd('pnpm --version'); } catch { pnpmVersion = 'N/A'; }
  
  let fastCheckVersion = 'N/A';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    fastCheckVersion = pkg.devDependencies['fast-check'] || pkg.dependencies['fast-check'] || 'N/A';
  } catch(e) {}

  const gitSha = captureCmd('git rev-parse HEAD');
  const gitBranch = captureCmd('git branch --show-current');
  const gitStatusRaw = captureCmd('git status --porcelain');
  const gitClean = gitStatusRaw === '' || gitStatusRaw.startsWith('ERROR');

  const pnpmLockPath = path.join(ROOT, 'pnpm-lock.yaml');
  const packageJsonPath = path.join(ROOT, 'package.json');
  const pnpmLockSha256 = fs.existsSync(pnpmLockPath) ? sha256File(pnpmLockPath) : 'N/A';
  const packageJsonSha256 = sha256File(packageJsonPath);

  return {
    nodeVersion,
    pnpmVersion,
    vitestVersion,
    typescriptVersion: tscVersion.replace('Version ', ''),
    fastCheckVersion: fastCheckVersion.replace(/[\^~]/g, ''),
    os: `${process.platform} ${process.arch}`,
    arch: process.arch,
    cpuModel: require('os').cpus()[0]?.model || 'unknown',
    totalMemoryMB: Math.round(require('os').totalmem() / (1024 * 1024)),
    gitSha,
    gitBranch,
    gitClean,
    pnpmLockSha256,
    packageJsonSha256
  };
}

module.exports = { captureEnvironment };

// Direct execution
if (require.main === module) {
  const env = captureEnvironment();
  console.log(JSON.stringify(env, null, 2));
}
