const fs = require('fs');
const path = require('path');

const cvmDir = 'C:/Trajectoire/compiler/cvm';
const reportsDir = 'C:/Trajectoire/reports/runtime';
const testsDir = 'C:/Trajectoire/tests';

// Get all TypeScript files in compiler/cvm (excluding index.ts)
const cvmFiles = fs.readdirSync(cvmDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .map(f => ({
    name: f.replace('.ts', ''),
    path: path.join(cvmDir, f)
  }));

// Get certification reports
const certificationReports = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-certification.json'))
  .map(f => f.replace('-certification.json', ''));

// Get audit reports
const auditReports = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-audit.json'))
  .map(f => f.replace('-audit.json', ''));

// Get test files
const testFiles = fs.readdirSync(testsDir, { recursive: true })
  .filter(f => f.endsWith('.test.ts'))
  .map(f => {
    const parts = f.split(path.sep);
    const testName = parts[parts.length - 1].replace('.test.ts', '');
    return testName;
  });

// Analyze remaining components
const remaining = cvmFiles.filter(f => !certificationReports.includes(f.name));

const analysis = remaining.map(f => {
  const hasAudit = auditReports.includes(f.name);
  const hasCertification = certificationReports.includes(f.name);
  const hasTest = testFiles.includes(f.name);
  
  return {
    name: f.name,
    hasAudit,
    hasCertification,
    hasTest,
    status: hasCertification ? 'CERTIFIED' : (hasAudit ? 'AUDITED' : (hasTest ? 'TESTED' : 'NOT STARTED'))
  };
});

const result = {
  auditDate: new Date().toISOString(),
  totalComponents: cvmFiles.length,
  certifiedCount: certificationReports.length,
  remainingCount: remaining.length,
  neverAudited: analysis.filter(a => !a.hasAudit && !a.hasCertification),
  withoutCertification: analysis.filter(a => !a.hasCertification),
  withoutTests: analysis.filter(a => !a.hasTest),
  withoutReports: analysis.filter(a => !a.hasAudit && !a.hasCertification),
  analysis
};

console.log(JSON.stringify(result, null, 2));
