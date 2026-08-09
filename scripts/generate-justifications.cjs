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

// Build justifications for non-certified components
const justifications = cvmFiles.map(comp => {
  const hasCertification = allReportFiles.includes(`${comp}-certification.json`);
  const hasAudit = allReportFiles.includes(`${comp}-audit.json`);
  const hasCoverage = allReportFiles.includes(`${comp}-current-coverage.json`);
  const hasGapAnalysis = allReportFiles.includes(`${comp}-gap-analysis.json`);
  const hasDecision = allReportFiles.includes(`${comp}-decision.json`);
  
  let status = 'NOT STARTED';
  const reasons = [];
  
  if (!hasCertification) {
    status = 'NOT STARTED';
    reasons.push('No certification report found');
    
    if (!hasAudit) {
      reasons.push('No audit report');
    }
    if (!hasCoverage) {
      reasons.push('No coverage report');
    }
    if (!hasGapAnalysis) {
      reasons.push('No gap analysis');
    }
    if (!hasDecision) {
      reasons.push('No decision report');
    }
  } else {
    // Has certification but might be partial
    try {
      const certData = JSON.parse(fs.readFileSync(path.join(reportsDir, `${comp}-certification.json`), 'utf8'));
      status = certData.status || 'UNKNOWN';
      
      if (status === 'CONDITIONAL_CERTIFIED') {
        reasons.push('Conditional certification - conditions not fully met');
      } else if (status === 'PARTIAL') {
        reasons.push('Partial certification - coverage incomplete');
      } else if (status === 'CERTIFIED AFTER REFACTOR') {
        reasons.push('Certified after refactoring - code changes required');
      }
    } catch (error) {
      reasons.push('Certification report exists but cannot be parsed');
    }
  }
  
  return {
    component: comp,
    status,
    reasons,
    artifacts: {
      certification: hasCertification,
      audit: hasAudit,
      coverage: hasCoverage,
      gapAnalysis: hasGapAnalysis,
      decision: hasDecision
    }
  };
});

// Filter to non-certified components only
const nonCertified = justifications.filter(j => j.status === 'NOT STARTED');

const result = {
  auditDate: new Date().toISOString(),
  totalNonCertified: nonCertified.length,
  justifications: nonCertified
};

console.log(JSON.stringify(result, null, 2));
