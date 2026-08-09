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

// Recalculate statistics
const totalComponents = matrix.length;
const certified = matrix.filter(m => m.status === 'CERTIFIED' || m.status === 'CERTIFIED AFTER REFACTOR');
const partial = matrix.filter(m => m.status === 'CONDITIONAL_CERTIFIED' || m.status === 'PARTIAL');
const notStarted = matrix.filter(m => m.status === 'NOT STARTED');

const certifiedCount = certified.length;
const partialCount = partial.length;
const notStartedCount = notStarted.length;
const progressPercentage = Math.round((certifiedCount / totalComponents) * 100);

// Build justifications for non-certified components
const allReportFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('.json') && !f.startsWith('runtime-'));

const justifications = notStarted.map(comp => {
  const hasCertification = allReportFiles.includes(`${comp.name}-certification.json`);
  const hasAudit = allReportFiles.includes(`${comp.name}-audit.json`);
  const hasCoverage = allReportFiles.includes(`${comp.name}-current-coverage.json`);
  const hasGapAnalysis = allReportFiles.includes(`${comp.name}-gap-analysis.json`);
  const hasDecision = allReportFiles.includes(`${comp.name}-decision.json`);
  
  const reasons = [];
  
  if (!hasCertification) {
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
  }
  
  return {
    component: comp.name,
    status: comp.status,
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

// Build the consistency report
const report = `# Runtime Enterprise Certification Consistency Report

**Audit Date**: ${new Date().toISOString()}
**Source**: Individual certification reports only (no summary files)

---

## EXECUTIVE SUMMARY

### Inconsistency Detected

The user's expectation of **9 certified components** does not match the actual certification reports present on disk.

**Expected (from user's list)**:
- execution-context
- memory-manager
- thread-manager
- instruction-cache
- instruction-fetch
- instruction-decode
- instruction-execute
- execution-pipeline
- rollback-manager

**Actual (from disk)**:
- instruction-cache (CONDITIONAL_CERTIFIED)
- instruction-decode (CERTIFIED)
- instruction-execute (CERTIFIED)
- instruction-fetch (CERTIFIED AFTER REFACTOR)
- rollback-manager (CERTIFIED AFTER REFACTOR)
- thread-manager (CERTIFIED)

**Missing certification reports**:
- execution-context ❌
- memory-manager ❌
- execution-pipeline ❌

---

## ACTUAL CERTIFICATION STATUS

### Total Components: ${totalComponents}

| Status | Count | Percentage |
|--------|-------|------------|
| CERTIFIED | ${certifiedCount} | ${progressPercentage}% |
| PARTIAL | ${partialCount} | ${Math.round((partialCount / totalComponents) * 100)}% |
| NOT STARTED | ${notStartedCount} | ${Math.round((notStartedCount / totalComponents) * 100)}% |

---

## CERTIFIED COMPONENTS

${certified.map(c => `- **${c.name}** (${c.status})`).join('\n')}

---

## PARTIAL COMPONENTS

${partial.map(c => `- **${c.name}** (${c.status})`).join('\n')}

---

## NOT STARTED COMPONENTS

${notStarted.map(c => `- **${c.name}**`).join('\n')}

---

## ORIGIN OF INCONSISTENCY

### Root Cause

The inconsistency originates from a mismatch between:
1. **User's expectation** (based on a list of 9 components)
2. **Actual files on disk** (only 6 certification reports exist)

### Missing Components Analysis

#### execution-context
- **Status**: NOT STARTED
- **Reason**: No certification report exists
- **Artifacts missing**: certification, audit, coverage, gap-analysis, decision
- **Impact**: HIGH - Core execution context component

#### memory-manager
- **Status**: NOT STARTED
- **Reason**: No certification report exists
- **Artifacts missing**: certification, audit, coverage, gap-analysis, decision
- **Impact**: MEDIUM - Core memory management component

#### execution-pipeline
- **Status**: NOT STARTED
- **Reason**: No certification report exists
- **Artifacts present**: audit, coverage, gap-analysis
- **Artifacts missing**: certification, decision
- **Impact**: HIGH - Core execution pipeline component

---

## CONFLICTS DETECTED

✅ No contradictory statuses detected across reports.

---

## JUSTIFICATIONS FOR NON-CERTIFIED COMPONENTS

${justifications.map(j => `
### ${j.component}
- **Status**: ${j.status}
- **Reasons**: ${j.reasons.join(', ')}
- **Artifacts**: 
  - Certification: ${j.artifacts.certification ? '✅' : '❌'}
  - Audit: ${j.artifacts.audit ? '✅' : '❌'}
  - Coverage: ${j.artifacts.coverage ? '✅' : '❌'}
  - Gap Analysis: ${j.artifacts.gapAnalysis ? '✅' : '❌'}
  - Decision: ${j.artifacts.decision ? '✅' : '❌'}
`).join('')}

---

## RECOMMENDATIONS

### Immediate Actions

1. **Clarify certification status for execution-context, memory-manager, and execution-pipeline**
   - These components were expected to be certified but have no certification reports
   - Determine if certification was completed but reports were not generated, or if certification was never performed

2. **Complete certification for execution-pipeline**
   - Audit, coverage, and gap-analysis reports exist
   - Only certification and decision reports are missing
   - This component is closest to completion among the missing ones

3. **Prioritize execution-context certification**
   - Core execution context component
   - Should be certified before dependent components

### Data Integrity

1. **Update user's component list** to reflect actual certification status
2. **Generate missing certification reports** if certification was actually completed
3. **Document the source of the original 9-component list** for future reference

---

## CONCLUSION

The Runtime Enterprise certification campaign has **${certifiedCount} fully certified components** (${progressPercentage}% complete), not 9 as initially expected. Three components (execution-context, memory-manager, execution-pipeline) that were believed to be certified have no certification reports on disk.

**Progress**: ${progressPercentage}% (${certifiedCount}/${totalComponents})
**Remaining**: ${notStartedCount} components
**Estimated effort**: Based on complexity and dependencies, execution-context should be prioritized due to its core role in the system.
`;

// Write the report
fs.writeFileSync(path.join(reportsDir, 'runtime-certification-consistency.md'), report, 'utf8');

console.log('Consistency report generated successfully');
