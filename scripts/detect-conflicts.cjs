const fs = require('fs');
const path = require('path');

const reportsDir = 'C:/Trajectoire/reports/runtime';

// Get all report files
const allReportFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('.json') && !f.startsWith('runtime-'))
  .map(f => {
    // Extract component name by removing the last suffix (e.g., -certification.json)
    const match = f.match(/^(.+)-([a-z-]+)\.json$/);
    if (match) {
      return {
        filename: f,
        component: match[1],
        type: match[2],
        path: path.join(reportsDir, f)
      };
    }
    return null;
  })
  .filter(Boolean);

// Group reports by component
const reportsByComponent = {};
allReportFiles.forEach(file => {
  if (!reportsByComponent[file.component]) {
    reportsByComponent[file.component] = [];
  }
  reportsByComponent[file.component].push(file);
});

// Detect conflicts
const conflicts = [];
Object.keys(reportsByComponent).forEach(component => {
  const reports = reportsByComponent[component];
  
  // Check for multiple certification reports
  const certReports = reports.filter(r => r.type === 'certification.json');
  if (certReports.length > 1) {
    conflicts.push({
      component,
      type: 'MULTIPLE_CERTIFICATION_REPORTS',
      reports: certReports.map(r => r.filename)
    });
  }
  
  // Check for contradictory statuses across different report types
  const statuses = [];
  reports.forEach(report => {
    try {
      const data = JSON.parse(fs.readFileSync(report.path, 'utf8'));
      if (data.status) {
        statuses.push({
          report: report.filename,
          status: data.status
        });
      }
    } catch (error) {
      // Ignore parse errors
    }
  });
  
  // Check if same component has different statuses
  const uniqueStatuses = [...new Set(statuses.map(s => s.status))];
  if (uniqueStatuses.length > 1) {
    conflicts.push({
      component,
      type: 'CONTRADICTORY_STATUSES',
      statuses
    });
  }
});

// Check for components mentioned as certified in summary files but without certification report
const summaryFiles = fs.readdirSync(reportsDir)
  .filter(f => f.startsWith('runtime-') && f.endsWith('.json'));

const missingCertifications = [];
summaryFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
    
    // Check if this summary mentions certified components
    if (data.certifiedCount || data.certifiedComponents) {
      const certifiedList = data.certifiedComponents || [];
      certifiedList.forEach(comp => {
        const hasCertReport = allReportFiles.some(r => 
          r.component === comp && r.type === 'certification.json'
        );
        if (!hasCertReport) {
          missingCertifications.push({
            component: comp,
            mentionedIn: file,
            missingReport: true
          });
        }
      });
    }
  } catch (error) {
    // Ignore parse errors
  }
});

const result = {
  auditDate: new Date().toISOString(),
  totalReportFiles: allReportFiles.length,
  totalComponents: Object.keys(reportsByComponent).length,
  conflicts,
  missingCertifications
};

console.log(JSON.stringify(result, null, 2));
