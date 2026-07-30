const fs = require('fs');
const path = require('path');

const cvmDir = 'C:/Trajectoire/compiler/cvm';
const reportsDir = 'C:/Trajectoire/reports/runtime';

// Get all TypeScript files in compiler/cvm
const cvmFiles = fs.readdirSync(cvmDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .map(f => ({
    name: f.replace('.ts', ''),
    path: path.join(cvmDir, f)
  }));

// Get actual certification reports
const certificationFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-certification.json'))
  .map(f => ({
    name: f.replace('-certification.json', ''),
    path: path.join(reportsDir, f)
  }));

// Read certification reports
const certificationData = {};
for (const comp of certificationFiles) {
  const data = JSON.parse(fs.readFileSync(comp.path, 'utf8'));
  certificationData[comp.name] = data;
}

// Calculate complexity (simplified: LOC / 10)
const complexity = {};
for (const file of cvmFiles) {
  const content = fs.readFileSync(file.path, 'utf8');
  const lines = content.split('\n').length;
  complexity[file.name] = Math.floor(lines / 10);
}

// Build certification matrix
const matrix = cvmFiles.map(f => {
  const certData = certificationData[f.name];
  const isCertified = !!certData;
  
  let status = 'NOT STARTED';
  let coverage = { statements: 0, branches: 0, functions: 0, lines: 0 };
  let tests = 0;
  let branches = 0;
  let refactoring = false;
  let debt = 0;
  
  if (isCertified && certData) {
    status = certData.status || 'CERTIFIED';
    coverage = {
      statements: parseFloat(certData.metrics?.after?.statements?.percentage || 0),
      branches: parseFloat(certData.metrics?.after?.branches?.percentage || 0),
      functions: parseFloat(certData.metrics?.after?.functions?.percentage || 0),
      lines: parseFloat(certData.metrics?.after?.lines?.percentage || 0)
    };
    tests = typeof certData.summary?.totalTests === 'number' ? certData.summary.totalTests : 0;
    branches = certData.metrics?.after?.branches?.total || 0;
    refactoring = certData.summary?.refactoringRequired || false;
    debt = refactoring ? 1 : 0;
  }
  
  return {
    name: f.name,
    status,
    coverage,
    tests,
    branches,
    complexity: complexity[f.name],
    loc: complexity[f.name] * 10,
    refactoring,
    debt,
    report: isCertified ? `${f.name}-certification.json` : null
  };
});

const result = {
  auditDate: new Date().toISOString(),
  totalComponents: cvmFiles.length,
  certifiedCount: certificationFiles.length,
  remainingCount: cvmFiles.length - certificationFiles.length,
  matrix
};

console.log(JSON.stringify(result, null, 2));
