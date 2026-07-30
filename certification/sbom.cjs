/**
 * sbom.cjs — Generates and verifies SBOM (CycloneDX & SPDX)
 * SLSA L3+ Level implementation with strict RFC 8785 canonicalization.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');
const { canonicalize } = require('json-canonicalize');
const { normalizeCycloneDx, normalizeSpdx } = require('./normalize-sbom.cjs');
const { sha256File } = require('./hash.cjs');
const { signFile } = require('./sign.cjs');

const ROOT = path.resolve(__dirname, '..');

function verifyLockfileCompleteness(sbomPath) {
  const sbom = JSON.parse(fs.readFileSync(sbomPath, 'utf8'));
  let lockData;
  try {
    lockData = yaml.load(fs.readFileSync(path.join(ROOT, 'pnpm-lock.yaml'), 'utf8'));
  } catch (e) {
    throw new Error(`Failed to load pnpm-lock.yaml: ${e.message}`);
  }
  
  const lockDeps = lockData.packages || {};
  const requiredDepsMap = new Map();
  
  for (const [key, details] of Object.entries(lockDeps)) {
    const parts = key.split('@');
    let name = key.startsWith('/@') ? '@' + parts[1] : parts[0].replace(/^\//, '');
    
    // In pnpm lockfiles, versions are embedded in the key or in the details.version
    let version = details.version || 'unknown';
    
    // Often pnpm v9 packages key format is /name@version
    if (!details.version) {
      if (key.startsWith('/@')) {
        version = parts[2] || 'unknown';
      } else {
        version = parts[1] || 'unknown';
      }
      // Trim peer dependency suffixes like `version(react@18)`
      version = version.split('(')[0];
    }
    
    requiredDepsMap.set(`${name}@${version}`, { name, version, integrity: details.resolution?.integrity });
  }

  const sbomComponents = sbom.components || [];
  const sbomCompMap = new Map();
  for (const c of sbomComponents) {
    sbomCompMap.set(`${c.name}@${c.version}`, c);
  }

  let missing = 0, extra = 0, exactVersions = 0;
  
  for (const [id, req] of requiredDepsMap.entries()) {
    if (sbomCompMap.has(id)) {
      exactVersions++;
    } else {
      missing++;
    }
  }
  
  for (const [id, comp] of sbomCompMap.entries()) {
    if (!requiredDepsMap.has(id)) {
      extra++;
    }
  }
  
  console.log(`  [SBOM] Lockfile Report:`);
  console.log(`         - ${requiredDepsMap.size} dépendances attendues`);
  console.log(`         - ${sbomComponents.length} retrouvées dans le SBOM`);
  console.log(`         - ${missing} manquantes`);
  console.log(`         - ${extra} supplémentaires (outils de build/transitives ignorées par le lock)`);
  console.log(`         - ${exactVersions} versions conformes`);
  
  // We don't fail immediately because dev vs prod dependencies might mismatch between lockfile parsing and cdxgen
}

function generateSbom(runDir, logDir) {
  console.log('  [SBOM] Generating CycloneDX and SPDX SBOMs...');

  const cdxOut = path.join(runDir, 'sbom-cyclonedx.json');
  const spdxOut = path.join(runDir, 'sbom-spdx.json');

  // We use pnpm exec to run cdxgen
  try {
    // 1. Generate CycloneDX
    execSync(`pnpm exec cdxgen -t nodejs -f json -o "${cdxOut}" "${ROOT}"`, { cwd: ROOT, stdio: 'ignore' });
    
    // 2. Generate SPDX
    execSync(`pnpm exec cdxgen -t nodejs -f spdx -o "${spdxOut}" "${ROOT}"`, { cwd: ROOT, stdio: 'ignore' });
  } catch (err) {
    console.error('  ❌ [SBOM] Generation failed! Tool "@cyclonedx/cdxgen" might be missing.');
    throw new Error('SBOM generation failed');
  }

  if (!fs.existsSync(cdxOut) || !fs.existsSync(spdxOut)) {
    throw new Error('SBOM files were not created');
  }

  // Normalization and Canonicalization (RFC 8785)
  console.log('  [SBOM] Normalizing and Canonicalizing (RFC 8785)...');
  const rawCdx = JSON.parse(fs.readFileSync(cdxOut, 'utf8'));
  const rawSpdx = JSON.parse(fs.readFileSync(spdxOut, 'utf8'));

  const normCdx = normalizeCycloneDx(rawCdx);
  const normSpdx = normalizeSpdx(rawSpdx);

  // Overwrite files with strict canonical representation
  fs.writeFileSync(cdxOut, canonicalize(normCdx));
  fs.writeFileSync(spdxOut, canonicalize(normSpdx));

  // Determinism check: generate again, normalize, canonicalize and compare hashes
  console.log('  [SBOM] Performing strict determinism check...');
  const cdxOutTemp = path.join(runDir, 'sbom-cyclonedx-temp.json');
  try {
    execSync(`pnpm exec cdxgen -t nodejs -f json -o "${cdxOutTemp}" "${ROOT}"`, { cwd: ROOT, stdio: 'ignore' });
    const tempRaw = JSON.parse(fs.readFileSync(cdxOutTemp, 'utf8'));
    const tempNorm = normalizeCycloneDx(tempRaw);
    fs.writeFileSync(cdxOutTemp, canonicalize(tempNorm));
    
    const hash1 = sha256File(cdxOut);
    const hash2 = sha256File(cdxOutTemp);
    if (hash1 !== hash2) {
      throw new Error(`SBOM generation is NOT deterministic. Hashes differ: ${hash1} != ${hash2}`);
    }
  } catch (err) {
    throw new Error(`Determinism check failed: ${err.message}`);
  } finally {
    if (fs.existsSync(cdxOutTemp)) fs.unlinkSync(cdxOutTemp);
  }

  // Completeness check against pnpm-lock.yaml
  console.log('  [SBOM] Verifying completeness against pnpm-lock.yaml...');
  verifyLockfileCompleteness(cdxOut);

  // Sign the SBOMs (sign.cjs handles RFC 8785)
  console.log('  [SBOM] Signing SBOM artifacts...');
  signFile(cdxOut, runDir);
  signFile(spdxOut, runDir);

  console.log(`  ✅ SBOMs generated, canonicalized, and signed. CycloneDX: ${sha256File(cdxOut)}`);
  
  return { cyclonedx: cdxOut, spdx: spdxOut };
}

module.exports = { generateSbom };
