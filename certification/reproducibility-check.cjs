const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256File(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function runReproducibilityCheck(artifactsDir) {
  console.log(`\n[REPRODUCIBILITY] 🔍 Démarrage du contrôle de reproductibilité stricte...`);
  
  if (!fs.existsSync(artifactsDir)) {
    console.error(`[FATAL] Répertoire des artefacts introuvable: ${artifactsDir}`);
    process.exit(1);
  }

  // Find all run directories
  const runDirs = fs.readdirSync(artifactsDir).filter(d => fs.statSync(path.join(artifactsDir, d)).isDirectory());
  
  // Group by node version
  const groups = {};
  
  for (const dir of runDirs) {
    // Expected format: run-{os}-node{version}
    const match = dir.match(/run-(.*)-node(\d+)/);
    if (!match) continue;
    
    const os = match[1];
    const nodeVersion = match[2];
    
    if (!groups[nodeVersion]) groups[nodeVersion] = {};
    groups[nodeVersion][os] = path.join(artifactsDir, dir);
  }

  const report = {
    reproducibility: {
      sourceDateEpoch: process.env.SOURCE_DATE_EPOCH || 'UNKNOWN',
      gitCommit: 'UNKNOWN',
      gitTree: 'UNKNOWN',
      matchedJobs: [],
      mismatchedJobs: [],
      groups: {}
    }
  };

  let hasMismatch = false;

  for (const [nodeVersion, osMap] of Object.entries(groups)) {
    console.log(`\n━━━ Vérification pour Node.js ${nodeVersion} ━━━`);
    const osList = Object.keys(osMap);
    console.log(`OS détectés: ${osList.join(', ')}`);
    
    let referenceReleaseEvidenceDigest = null;
    let referenceConvergenceDigest = null;
    let referenceOs = null;
    
    report.reproducibility.groups[nodeVersion] = {
      referenceOs: null,
      manifestDigest: null,
      releaseEvidenceDigest: null,
      convergenceDigest: null,
      matched: [],
      mismatched: []
    };

    for (const os of osList) {
      const dir = osMap[os];
      const releaseEvidencePath = path.join(dir, 'release-evidence-v1.0.0.dsse.json');
      const convergencePath = path.join(dir, 'convergence-report.dsse.json');
      const manifestPath = path.join(dir, 'manifest.dsse.json');
      
      const releaseDigest = sha256File(releaseEvidencePath);
      const convergenceDigest = sha256File(convergencePath);
      const manifestDigest = sha256File(manifestPath);
      
      console.log(`\n[${os}]`);
      console.log(`  Release Evidence: ${releaseDigest || 'MISSING'}`);
      console.log(`  Convergence Rep:  ${convergenceDigest || 'MISSING'}`);
      console.log(`  Manifest:         ${manifestDigest || 'MISSING'}`);
      
      if (!releaseDigest || !convergenceDigest) {
        console.error(`  ❌ Artefacts manquants pour ${os}`);
        report.reproducibility.mismatchedJobs.push(`${os}-node${nodeVersion}`);
        report.reproducibility.groups[nodeVersion].mismatched.push(os);
        hasMismatch = true;
        continue;
      }
      
      if (referenceOs === null) {
        referenceOs = os;
        referenceReleaseEvidenceDigest = releaseDigest;
        referenceConvergenceDigest = convergenceDigest;
        
        report.reproducibility.groups[nodeVersion].referenceOs = os;
        report.reproducibility.groups[nodeVersion].releaseEvidenceDigest = releaseDigest;
        report.reproducibility.groups[nodeVersion].convergenceDigest = convergenceDigest;
        report.reproducibility.groups[nodeVersion].manifestDigest = manifestDigest;
        
        // Try to extract git metadata from the manifest
        if (fs.existsSync(manifestPath)) {
          try {
             const manifestObj = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
             if (manifestObj.metadata) {
               if (manifestObj.metadata.gitSha) report.reproducibility.gitCommit = manifestObj.metadata.gitSha;
               if (manifestObj.metadata.gitTree) report.reproducibility.gitTree = manifestObj.metadata.gitTree;
               if (manifestObj.metadata.timestamp) report.reproducibility.sourceDateEpoch = manifestObj.metadata.timestamp;
             }
          } catch(e) {}
        }
        
        report.reproducibility.matchedJobs.push(`${os}-node${nodeVersion}`);
        report.reproducibility.groups[nodeVersion].matched.push(os);
        console.log(`  ✅ Définition comme référence pour Node ${nodeVersion}`);
      } else {
        let match = true;
        if (releaseDigest !== referenceReleaseEvidenceDigest) {
          console.error(`  ❌ DIVERGENCE: Release Evidence hash ne correspond pas à la référence (${referenceOs})`);
          match = false;
        }
        if (convergenceDigest !== referenceConvergenceDigest) {
          console.error(`  ❌ DIVERGENCE: Convergence Report hash ne correspond pas à la référence (${referenceOs})`);
          match = false;
        }
        
        if (match) {
          console.log(`  ✅ Correspondance bit-à-bit stricte avec ${referenceOs}`);
          report.reproducibility.matchedJobs.push(`${os}-node${nodeVersion}`);
          report.reproducibility.groups[nodeVersion].matched.push(os);
        } else {
          hasMismatch = true;
          report.reproducibility.mismatchedJobs.push(`${os}-node${nodeVersion}`);
          report.reproducibility.groups[nodeVersion].mismatched.push(os);
        }
      }
    }
  }

  // Export report
  const reportPath = path.join(process.cwd(), 'reproducibility-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n[REPRODUCIBILITY] Rapport généré: ${reportPath}`);

  if (hasMismatch) {
    console.error(`\n[FATAL] La vérification de reproductibilité stricte a échoué. Des divergences inter-plateformes ont été détectées.`);
    process.exit(1);
  } else {
    console.log(`\n[SUCCESS] La reproductibilité inter-plateformes est garantie (100% MATCH).`);
    process.exit(0);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node reproducibility-check.cjs <artifacts_directory>');
    process.exit(1);
  }
  runReproducibilityCheck(path.resolve(args[0]));
}

module.exports = { runReproducibilityCheck };
