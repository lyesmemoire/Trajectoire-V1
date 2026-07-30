const fs = require('fs');
const path = require('path');

const cvmDir = 'C:/Trajectoire/compiler/cvm';
const reportsDir = 'C:/Trajectoire/reports/runtime';

// Get all TypeScript files in compiler/cvm (excluding index.ts)
const cvmFiles = fs.readdirSync(cvmDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .map(f => f.replace('.ts', ''));

// Get all report files
const allReportFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('.json') && !f.startsWith('runtime-'));

// Build artifact map
const artifactMap = {};
cvmFiles.forEach(comp => {
  artifactMap[comp] = {
    audit: allReportFiles.includes(`${comp}-audit.json`),
    gapAnalysis: allReportFiles.includes(`${comp}-gap-analysis.json`),
    coverage: allReportFiles.includes(`${comp}-current-coverage.json`),
    certification: allReportFiles.includes(`${comp}-certification.json`),
    decision: allReportFiles.includes(`${comp}-decision.json`),
    branchAnalysis: allReportFiles.includes(`${comp}-branch-analysis.json`),
    architecturalAnalysis: allReportFiles.includes(`${comp}-architectural-analysis.json`),
    deadCodeAnalysis: allReportFiles.includes(`${comp}-dead-code-analysis.json`)
  };
});

// Check completeness
const traceability = cvmFiles.map(comp => {
  const artifacts = artifactMap[comp];
  const presentArtifacts = Object.entries(artifacts).filter(([k, v]) => v).map(([k]) => k);
  const missingArtifacts = Object.entries(artifacts).filter(([k, v]) => !v).map(([k]) => k);
  
  return {
    component: comp,
    artifacts: {
      ...artifacts
    },
    presentCount: presentArtifacts.length,
    missingCount: missingArtifacts.length,
    presentArtifacts,
    missingArtifacts,
    isComplete: missingArtifacts.length === 0
  };
});

// Summary
const complete = traceability.filter(t => t.isComplete);
const incomplete = traceability.filter(t => !t.isComplete);

const result = {
  auditDate: new Date().toISOString(),
  totalComponents: cvmFiles.length,
  completeCount: complete.length,
  incompleteCount: incomplete.length,
  traceability
};

console.log(JSON.stringify(result, null, 2));
