const fs = require('fs');
const path = require('path');

const reportsDir = 'C:/Trajectoire/reports/runtime';

// Scan for all certification files
const certFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-certification.json'))
  .map(f => ({
    filename: f,
    component: f.replace('-certification.json', ''),
    path: path.join(reportsDir, f)
  }));

// Extract data from each certification file
const certifications = certFiles.map(file => {
  try {
    const data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
    return {
      component: file.component,
      filename: file.filename,
      status: data.status || 'UNKNOWN',
      coverage: data.metrics?.after || null,
      date: data.certificationDate || data.auditDate || null,
      source: 'certification-report'
    };
  } catch (error) {
    return {
      component: file.component,
      filename: file.filename,
      status: 'ERROR',
      error: error.message,
      source: 'certification-report'
    };
  }
});

const result = {
  auditDate: new Date().toISOString(),
  totalCertificationFiles: certFiles.length,
  certifications
};

console.log(JSON.stringify(result, null, 2));
