const fs = require('fs');
const path = require('path');

const cvmDir = 'C:/Trajectoire/compiler/cvm';
const reportsDir = 'C:/Trajectoire/reports/runtime';

// Get all certification files directly
const certFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-certification.json'))
  .map(f => ({
    component: f.replace('-certification.json', ''),
    path: path.join(reportsDir, f)
  }));

// Read certification data directly
const certifiedMap = {};
certFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
    certifiedMap[file.component] = {
      status: data.status || 'UNKNOWN',
      date: data.certificationDate || data.auditDate || null
    };
  } catch (error) {
    certifiedMap[file.component] = {
      status: 'ERROR',
      error: error.message
    };
  }
});

// Get all TypeScript files in compiler/cvm (excluding index.ts)
const cvmFiles = fs.readdirSync(cvmDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .map(f => ({
    name: f.replace('.ts', ''),
    path: path.join(cvmDir, f)
  }));

// Classify components
const classification = cvmFiles.map(comp => {
  const cert = certifiedMap[comp.name];
  
  let status = 'NOT_STARTED';
  let reason = 'No certification report found';
  
  if (cert) {
    if (cert.status === 'CERTIFIED' || cert.status === 'CERTIFIED AFTER REFACTOR') {
      status = 'CERTIFIED';
      reason = 'Has valid certification report';
    } else if (cert.status === 'CONDITIONAL_CERTIFIED') {
      status = 'PARTIAL';
      reason = 'Conditional certification';
    } else {
      status = 'PARTIAL';
      reason = `Status: ${cert.status}`;
    }
  }
  
  return {
    component: comp.name,
    status,
    reason,
    hasCertification: !!cert,
    certificationStatus: cert ? cert.status : null,
    certificationDate: cert ? cert.date : null
  };
});

// Count by status
const counts = {
  total: cvmFiles.length,
  certified: classification.filter(c => c.status === 'CERTIFIED').length,
  partial: classification.filter(c => c.status === 'PARTIAL').length,
  notStarted: classification.filter(c => c.status === 'NOT_STARTED').length,
  noReport: classification.filter(c => !c.hasCertification).length
};

const result = {
  auditDate: new Date().toISOString(),
  counts,
  classification
};

console.log(JSON.stringify(result, null, 2));
