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

// Calculate statistics
const certified = matrix.filter(m => m.status === 'CERTIFIED' || m.status === 'CERTIFIED AFTER REFACTOR');
const partial = matrix.filter(m => m.status === 'CONDITIONAL_CERTIFIED' || m.status === 'PARTIAL');
const notStarted = matrix.filter(m => m.status === 'NOT STARTED');

const certifiedCount = certified.length;
const partialCount = partial.length;
const notStartedCount = notStarted.length;
const progressPercentage = Math.round((certifiedCount / cvmFiles.length) * 100);

const result = {
  auditDate: new Date().toISOString(),
  source: 'individual-certification-reports-only',
  totalComponents: cvmFiles.length,
  certifiedCount,
  partialCount,
  notStartedCount,
  progressPercentage,
  matrix
};

console.log(JSON.stringify(result, null, 2));
