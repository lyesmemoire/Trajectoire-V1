const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { canonicalSortObject } = require('./canonical.cjs');

function captureCmd(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 1024 * 1024 }).trim();
  } catch (e) {
    return `N/A`;
  }
}

function captureLabEnvironment(rootPath) {
  const nodeVersion = process.versions.node;
  const vitestVersion = captureCmd('npx vitest --version', rootPath).replace('vitest/', '').trim();
  const tscVersion = captureCmd('npx tsc --version', rootPath).replace('Version ', '').trim();
  
  const pnpmVersion = captureCmd('pnpm --version', rootPath);
  
  let fastCheckVersion = 'N/A';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootPath, 'package.json'), 'utf8'));
    const fc = pkg.devDependencies['fast-check'] || pkg.dependencies['fast-check'];
    if (fc) fastCheckVersion = fc.replace(/[\^~]/g, '');
  } catch(e) {}
  
  return {
    node: nodeVersion,
    pnpm: pnpmVersion,
    typescript: tscVersion,
    vitest: vitestVersion,
    fastCheck: fastCheckVersion,
    os: `${process.platform} ${process.arch}`,
    architecture: process.arch
  };
}

function sha256Json(obj) {
  const sorted = canonicalSortObject(obj);
  return crypto.createHash('sha256').update(JSON.stringify(sorted)).digest('hex');
}

module.exports = { captureLabEnvironment, sha256Json };
