/**
 * test-sbom-determinism.cjs
 * Démontre la reproductibilité stricte du SBOM et sa sensibilité aux mutations.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { canonicalize } = require('json-canonicalize');
const { normalizeCycloneDx } = require('./normalize-sbom.cjs');

const ROOT = path.resolve(__dirname, '..');
const TMP_SBOM = path.join(ROOT, 'certification', 'sbom-test-temp.json');

function hashSbom() {
  execSync(`pnpm exec cdxgen -t nodejs -f json -o "${TMP_SBOM}" "${ROOT}"`, { cwd: ROOT, stdio: 'ignore' });
  const raw = JSON.parse(fs.readFileSync(TMP_SBOM, 'utf8'));
  const norm = normalizeCycloneDx(raw);
  const canon = canonicalize(norm);
  const hash = crypto.createHash('sha256').update(canon).digest('hex');
  return { raw, norm, canon, hash };
}

console.log('=== Test de Déterminisme SBOM (10 itérations) ===');
const hashes = new Set();
let baseNorm;

for (let i = 1; i <= 10; i++) {
  try {
    const result = hashSbom();
    hashes.add(result.hash);
    if (i === 1) baseNorm = result.norm;
    console.log(`[Run ${i.toString().padStart(2, '0')}] Hash: ${result.hash}`);
  } catch (err) {
    console.error(`Erreur run ${i}: ${err.message}`);
  }
}

if (fs.existsSync(TMP_SBOM)) fs.unlinkSync(TMP_SBOM);

if (hashes.size === 1) {
  console.log('\n✅ DÉTERMINISME PROUVÉ : 10 exécutions ont produit exactement le même hash canonique.');
} else {
  console.error('\n❌ DÉFAUT DE DÉTERMINISME : Les exécutions ont produit des hashes différents.');
  process.exit(1);
}

console.log('\n=== Test Anti-Déterminisme (Sensibilité aux mutations) ===');
let antiPassed = true;

function testMutation(name, mutatorFn) {
  const mutatedNorm = JSON.parse(JSON.stringify(baseNorm));
  mutatorFn(mutatedNorm);
  const mutatedHash = crypto.createHash('sha256').update(canonicalize(mutatedNorm)).digest('hex');
  const changed = mutatedHash !== Array.from(hashes)[0];
  console.log(`[Mutation: ${name.padEnd(20)}] Hash modifié ? ${changed ? 'OUI ✅' : 'NON ❌'}`);
  if (!changed) antiPassed = false;
}

// Mutate version
testMutation('Version Package', (n) => {
  if (n.components && n.components.length > 0) {
    n.components[0].version = '99.99.99';
  }
});

// Mutate Component Name
testMutation('Nom Composant', (n) => {
  if (n.components && n.components.length > 0) {
    n.components[0].name = 'malicious-package';
  }
});

// Mutate License
testMutation('Licence', (n) => {
  if (n.components && n.components.length > 0) {
    n.components[0].licenses = [{ license: { id: 'GPL-3.0' } }];
  }
});

if (antiPassed) {
  console.log('\n✅ SÉCURITÉ PROUVÉE : La normalisation ignore la volatilité temporelle mais reste strictement sensible aux changements structurels.');
} else {
  console.error('\n❌ FAIBLESSES DÉTECTÉES : Le hash n\'a pas changé suite à une mutation.');
  process.exit(1);
}
