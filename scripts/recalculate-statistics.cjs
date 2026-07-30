const fs = require('fs');
const path = require('path');

const cvmDir = 'C:/Trajectoire/compiler/cvm';
const reportsDir = 'C:/Trajectoire/reports/runtime';

// Get all TypeScript files in compiler/cvm (excluding index.ts)
const cvmFiles = fs.readdirSync(cvmDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .map(f => ({
    name: f.replace('.ts', ''),
    path: path.join(cvmDir, f)
  }));

// Calculate complexity (LOC)
const complexity = {};
for (const file of cvmFiles) {
  const content = fs.readFileSync(file.path, 'utf8');
  const lines = content.split('\n').length;
  complexity[file.name] = lines;
}

// Read certification data directly from individual reports
const certificationData = {};
const certFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-certification.json'));

certFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
    const componentName = file.replace('-certification.json', '');
    certificationData[componentName] = data;
  } catch (error) {
    // Ignore parse errors
  }
});

// Build certification matrix from scratch
const matrix = cvmFiles.map(comp => {
  const cert = certificationData[comp.name];
  
  let status = 'NOT STARTED';
  let coverage = { statements: 0, branches: 0, functions: 0, lines: 0 };
  let tests = 0;
  let branches = 0;
  let refactoring = false;
  let debt = 0;
  
  if (cert) {
    status = cert.status || 'NOT STARTED';
    
    // Extract coverage
    if (cert.metrics && cert.metrics.after) {
      const cov = cert.metrics.after;
      coverage = {
        statements: parseFloat(cov.statements?.percentage || 0),
        branches: parseFloat(cov.branches?.percentage || 0),
        functions: parseFloat(cov.functions?.percentage || 0),
        lines: parseFloat(cov.lines?.percentage || 0)
      };
      branches = cov.branches?.total || 0;
    }
    
    // Extract tests
    if (cert.summary && typeof cert.summary.totalTests === 'number') {
      tests = cert.summary.totalTests;
    }
    
    // Extract refactoring info
    if (cert.summary && cert.summary.refactoringRequired) {
      refactoring = true;
      debt = 1;
    }
  }
  
  return {
    name: comp.name,
    status,
    coverage,
    tests,
    branches,
    complexity: complexity[comp.name],
    loc: complexity[comp.name],
    refactoring,
    debt,
    report: cert ? `${comp.name}-certification.json` : null
  };
});

// Recalculate statistics from scratch
const totalComponents = matrix.length;
const certified = matrix.filter(m => m.status === 'CERTIFIED' || m.status === 'CERTIFIED AFTER REFACTOR');
const partial = matrix.filter(m => m.status === 'CONDITIONAL_CERTIFIED' || m.status === 'PARTIAL');
const notStarted = matrix.filter(m => m.status === 'NOT STARTED');

const certifiedCount = certified.length;
const partialCount = partial.length;
const notStartedCount = notStarted.length;
const progressPercentage = Math.round((certifiedCount / totalComponents) * 100);

// Calculate total debt
const totalDebt = matrix.reduce((sum, m) => sum + m.debt, 0);

// Calculate average coverage for certified components
const certifiedWithCoverage = certified.filter(m => m.coverage.statements > 0);
const avgCoverage = certifiedWithCoverage.length > 0 ? {
  statements: Math.round(certifiedWithCoverage.reduce((sum, m) => sum + m.coverage.statements, 0) / certifiedWithCoverage.length),
  branches: Math.round(certifiedWithCoverage.reduce((sum, m) => sum + m.coverage.branches, 0) / certifiedWithCoverage.length),
  functions: Math.round(certifiedWithCoverage.reduce((sum, m) => sum + m.coverage.functions, 0) / certifiedWithCoverage.length),
  lines: Math.round(certifiedWithCoverage.reduce((sum, m) => sum + m.coverage.lines, 0) / certifiedWithCoverage.length)
} : { statements: 0, branches: 0, functions: 0, lines: 0 };

const result = {
  auditDate: new Date().toISOString(),
  source: 'individual-certification-reports-only',
  statistics: {
    totalComponents,
    certifiedCount,
    partialCount,
    notStartedCount,
    progressPercentage,
    totalDebt,
    avgCoverage
  },
  certifiedComponents: certified.map(m => m.name),
  partialComponents: partial.map(m => m.name),
  notStartedComponents: notStarted.map(m => m.name),
  matrix
};

console.log(JSON.stringify(result, null, 2));
