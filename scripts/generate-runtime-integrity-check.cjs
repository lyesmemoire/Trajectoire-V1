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

// Get all report files
const auditReports = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-audit.json'))
  .map(f => f.replace('-audit.json', ''));

const certificationReports = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-certification.json'))
  .map(f => f.replace('-certification.json', ''));

const coverageReports = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-current-coverage.json'))
  .map(f => f.replace('-current-coverage.json', ''));

// Integrity checks
const issues = [];
const warnings = [];

// Check for missing reports
const missingAudits = cvmFiles.filter(f => !auditReports.includes(f.name));
if (missingAudits.length > 0) {
  issues.push({
    type: 'MISSING_AUDIT',
    components: missingAudits.map(f => f.name)
  });
}

const missingCertifications = cvmFiles.filter(f => !certificationReports.includes(f.name));
if (missingCertifications.length > 0) {
  warnings.push({
    type: 'MISSING_CERTIFICATION',
    components: missingCertifications.map(f => f.name)
  });
}

const missingCoverage = cvmFiles.filter(f => !coverageReports.includes(f.name));
if (missingCoverage.length > 0) {
  warnings.push({
    type: 'MISSING_COVERAGE',
    components: missingCoverage.map(f => f.name)
  });
}

// Check for orphaned certifications (certification without audit)
const orphanedCertifications = certificationReports.filter(name => !auditReports.includes(name));
if (orphanedCertifications.length > 0) {
  issues.push({
    type: 'ORPHANED_CERTIFICATION',
    components: orphanedCertifications
  });
}

// Check for duplicate reports (same report type for same component)
const auditDuplicates = auditReports.filter((name, index) => auditReports.indexOf(name) !== index);
const certDuplicates = certificationReports.filter((name, index) => certificationReports.indexOf(name) !== index);
const coverageDuplicates = coverageReports.filter((name, index) => coverageReports.indexOf(name) !== index);

if (auditDuplicates.length > 0 || certDuplicates.length > 0 || coverageDuplicates.length > 0) {
  issues.push({
    type: 'DUPLICATE_REPORTS',
    components: {
      audit: [...new Set(auditDuplicates)],
      certification: [...new Set(certDuplicates)],
      coverage: [...new Set(coverageDuplicates)]
    }
  });
}

// Check for deleted components (reports for non-existent files)
// Filter out runtime-global, runtime, and other non-component names from reports
const deletedComponents = [...auditReports, ...certificationReports, ...coverageReports]
  .filter(name => !cvmFiles.find(f => f.name === name) && !name.startsWith('runtime-') && name !== 'runtime');
if (deletedComponents.length > 0) {
  issues.push({
    type: 'DELETED_COMPONENT',
    components: [...new Set(deletedComponents)]
  });
}

// Check for missing JSON files (required for certification)
const requiredJsons = ['runtime-global-audit.json', 'runtime-certification-matrix.json', 'runtime-remaining-components.json', 'runtime-priority-v2.json', 'runtime-final-roadmap.json'];
const missingJsons = requiredJsons.filter(json => !fs.existsSync(path.join(reportsDir, json)));
if (missingJsons.length > 0) {
  issues.push({
    type: 'MISSING_JSON',
    files: missingJsons
  });
}

const result = {
  auditDate: new Date().toISOString(),
  status: issues.length === 0 ? 'PASSED' : 'FAILED',
  summary: {
    totalComponents: cvmFiles.length,
    auditReports: auditReports.length,
    certificationReports: certificationReports.length,
    coverageReports: coverageReports.length,
    issues: issues.length,
    warnings: warnings.length
  },
  issues,
  warnings,
  components: cvmFiles.map(f => ({
    name: f.name,
    hasAudit: auditReports.includes(f.name),
    hasCertification: certificationReports.includes(f.name),
    hasCoverage: coverageReports.includes(f.name)
  }))
};

console.log(JSON.stringify(result, null, 2));
