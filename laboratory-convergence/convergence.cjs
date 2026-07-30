const fs = require('fs');
const path = require('path');

function runConvergence(snapshotDir) {
  console.log(`\n[CONVERGENCE] ⚖️  Démarrage du moteur de convergence N-Version...`);

  const convergenceReport = {
    protocolVersion: "qualification-protocol-2.0",
    engine: "Trajectoire Convergence Engine V2.1",
    timestamp: new Date().toISOString(),
    snapshotDir: snapshotDir,
    expectedLaboratories: [],
    receivedLaboratories: [],
    quorum: { required: 0, total: 0, achieved: false },
    decision: "UNKNOWN",
    controls: []
  };

  const addControl = (id, passed, description) => {
    convergenceReport.controls.push({ id, status: passed ? 'PASS' : 'FAIL', description });
    if (passed) {
      console.log(`  ✅ ${id}: ${description}`);
    } else {
      console.log(`  ❌ ${id}: ${description}`);
    }
  };

  // 1. Scan for reports
  const files = fs.readdirSync(snapshotDir);
  const reportFiles = files.filter(f => f.endsWith('-audit-report.json') && !f.endsWith('.dsse.json') && !f.startsWith('convergence-'));
  
  const reports = {};
  let activeProfile = null;

  for (const file of reportFiles) {
    try {
      const rep = JSON.parse(fs.readFileSync(path.join(snapshotDir, file), 'utf8'));
      reports[rep.laboratoryId] = rep;
      convergenceReport.receivedLaboratories.push(rep.laboratoryId);
      if (!activeProfile && rep.profile) activeProfile = rep.profile;
    } catch(e) {
      console.log(`  ⚠️ Impossible de lire le rapport ${file} : ${e.message}`);
    }
  }

  // 2. Load Governance Profile
  if (!activeProfile) activeProfile = 'Q1.0'; // fallback
  const profilePath = path.join(__dirname, '..', 'laboratory', 'profiles', `${activeProfile}.json`);
  let governance = null;
  if (fs.existsSync(profilePath)) {
    governance = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
  } else {
    // Default fallback if profile missing
    governance = {
      protocolVersion: "qualification-protocol-2.0",
      expectedLaboratories: ["lab-a-node", "lab-b-python"],
      quorum: { required: 2, total: 2 }
    };
  }

  convergenceReport.expectedLaboratories = governance.expectedLaboratories;
  convergenceReport.quorum.required = governance.quorum.required;
  convergenceReport.quorum.total = governance.quorum.total;

  // 3. Quorum Check
  let validReports = 0;
  for (const lab of governance.expectedLaboratories) {
    if (reports[lab]) {
      validReports++;
    } else {
      addControl('L-068', false, `Missing expected laboratory report: ${lab}`);
    }
  }

  convergenceReport.quorum.achieved = validReports >= governance.quorum.required;

  // 4. Verification Logic (Hierarchy of Decisions)
  
  // (A) Check Signatures (REPORT_SIGNATURE_FAILURE)
  let missingSignatures = false;
  for (const labId of convergenceReport.receivedLaboratories) {
    // Find the file name from the reports list
    const repFile = reportFiles.find(f => f.includes(labId) || reports[labId].laboratoryId === labId);
    if (repFile) {
      const dsseFile = repFile.replace('.json', '.dsse.json');
      if (!fs.existsSync(path.join(snapshotDir, dsseFile))) {
        missingSignatures = true;
        addControl('L-071', false, `Missing DSSE signature for laboratory: ${labId}`);
      }
    }
  }

  // (B) Check Schemas (REPORT_SCHEMA_MISMATCH)
  let schemaMismatch = false;
  for (const labId of convergenceReport.receivedLaboratories) {
    const rep = reports[labId];
    if (rep.protocolVersion !== governance.protocolVersion) {
      schemaMismatch = true;
      addControl('L-072', false, `Protocol mismatch for ${labId}: expected ${governance.protocolVersion}, got ${rep.protocolVersion}`);
    }
  }

  // (C) Check Quorum (LAB_FAILURE)
  if (!convergenceReport.quorum.achieved) {
    addControl('L-067', false, `Quorum not achieved: ${validReports}/${governance.quorum.required}`);
  } else {
    addControl('L-067', true, `Quorum achieved: ${validReports}/${governance.quorum.required}`);
  }

  // (D) N-Way Comparison (DIVERGENCE)
  let divergence = false;
  let referenceCriticals = null;
  let allMatch = true;
  let anyDiff = false;
  let anyAbstain = false;

  const labsToCompare = Object.values(reports).filter(r => governance.expectedLaboratories.includes(r.laboratoryId));

  if (labsToCompare.length > 0) {
    referenceCriticals = {
      snapshotDigest: labsToCompare[0].snapshotDigest,
      qualificationId: labsToCompare[0].qualificationId,
      decisionScope: JSON.stringify(labsToCompare[0].decisionScope)
    };

    for (const rep of labsToCompare) {
      if (rep.snapshotDigest !== referenceCriticals.snapshotDigest ||
          rep.qualificationId !== referenceCriticals.qualificationId ||
          JSON.stringify(rep.decisionScope) !== referenceCriticals.decisionScope) {
        divergence = true;
        addControl('L-070', false, `Divergence on critical fields or decisionScope for ${rep.laboratoryId}`);
      }

      if (rep.decision === 'DIFF') anyDiff = true;
      if (rep.decision === 'ABSTAIN') anyAbstain = true;
      if (rep.decision !== 'MATCH') allMatch = false;
    }
  }

  // Determine final decision based on hierarchy
  if (missingSignatures) {
    convergenceReport.decision = "REPORT_SIGNATURE_FAILURE";
  } else if (schemaMismatch) {
    convergenceReport.decision = "REPORT_SCHEMA_MISMATCH";
  } else if (!convergenceReport.quorum.achieved) {
    convergenceReport.decision = "LAB_FAILURE";
  } else if (divergence) {
    convergenceReport.decision = "DIVERGENCE";
  } else if (anyDiff) {
    convergenceReport.decision = "CONSENSUS_DIFF";
  } else if (allMatch) {
    convergenceReport.decision = "CONSENSUS_MATCH";
  } else {
    // If there's an ABSTAIN but no DIFF and not all MATCH (e.g. all ABSTAIN)
    convergenceReport.decision = "CONSENSUS_ABSTAIN";
  }

  if (!divergence && convergenceReport.quorum.achieved) {
    addControl('L-070', true, 'Consensus achieved on all critical fields');
  }

  const reportPath = path.join(snapshotDir, 'convergence-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(convergenceReport, null, 2));

  // Sign convergence report
  try {
    const { signForLab } = require('../laboratory/lib/crypto.cjs');
    const dsse = signForLab(convergenceReport);
    fs.writeFileSync(path.join(snapshotDir, 'convergence-report.dsse.json'), JSON.stringify(dsse, null, 2));
    console.log(`\n[CONVERGENCE] 🔐 Signed Convergence Report (convergence-report.dsse.json)`);
  } catch (e) {
    console.log(`\n[CONVERGENCE] ⚠️ Could not sign convergence report: ${e.message}`);
  }

  console.log(`\n[CONVERGENCE] FINAL DECISION: ${convergenceReport.decision}`);
  return convergenceReport;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  console.log('[CONVERGENCE] Starting N-Version Convergence Engine');
  
  if (args.length < 1) {
    console.error('Usage: node convergence.cjs <snapshot_dir>');
    process.exit(1);
  }

  const snapshotDir = path.resolve(args[0]);
  runConvergence(snapshotDir);
}

module.exports = { runConvergence };
