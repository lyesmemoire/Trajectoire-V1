const fs = require('fs');
const path = require('path');

const coverageFile = 'C:/Trajectoire/reports/cli/coverage/coverage-final.json';
const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: node extract-component-coverage.cjs <component-name>');
  process.exit(1);
}

const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));

// Find the component in coverage data
const componentPath = `C:\\Trajectoire\\compiler\\cvm\\${componentName}.ts`;
const componentCoverage = coverageData[componentPath];

if (!componentCoverage) {
  console.error(`Component ${componentName} not found in coverage data`);
  process.exit(1);
}

// Calculate coverage metrics
const statementMap = componentCoverage.statementMap;
const branchMap = componentCoverage.branchMap;
const fnMap = componentCoverage.fnMap;

const totalStatements = Object.keys(statementMap).length;
const coveredStatements = Object.values(componentCoverage.s || {}).filter(s => s > 0).length;

const totalFunctions = Object.keys(fnMap).length;
const coveredFunctions = Object.values(componentCoverage.f || {}).filter(f => f > 0).length;

const totalBranches = Object.keys(branchMap).length;
const coveredBranches = Object.values(componentCoverage.b || {}).filter(b => b > 0).length;

const statementPercentage = totalStatements > 0 ? ((coveredStatements / totalStatements) * 100).toFixed(2) : '0.00';
const functionPercentage = totalFunctions > 0 ? ((coveredFunctions / totalFunctions) * 100).toFixed(2) : '0.00';
const branchPercentage = totalBranches > 0 ? ((coveredBranches / totalBranches) * 100).toFixed(2) : '0.00';

// Find uncovered lines
const uncoveredLines = [];
Object.entries(statementMap).forEach(([id, stmt]) => {
  const line = stmt.start.line;
  if (!componentCoverage.s || !componentCoverage.s[id]) {
    uncoveredLines.push(line);
  }
});

const result = {
  component: componentName,
  file: `compiler/cvm/${componentName}.ts`,
  coverageDate: new Date().toISOString(),
  coverageSource: 'coverage-final.json',
  provider: 'Vitest with V8 coverage',
  metrics: {
    statements: {
      total: totalStatements,
      covered: coveredStatements,
      uncovered: totalStatements - coveredStatements,
      percentage: statementPercentage,
      target: '≥95%',
      status: parseFloat(statementPercentage) >= 95 ? 'PASSED' : 'NOT_PASSED',
      gap: parseFloat(statementPercentage) >= 95 ? '0%' : (95 - parseFloat(statementPercentage)).toFixed(2) + '%'
    },
    branches: {
      total: totalBranches,
      covered: coveredBranches,
      uncovered: totalBranches - coveredBranches,
      percentage: branchPercentage,
      target: '≥97%',
      status: parseFloat(branchPercentage) >= 97 ? 'PASSED' : 'NOT_PASSED',
      gap: parseFloat(branchPercentage) >= 97 ? '0%' : (97 - parseFloat(branchPercentage)).toFixed(2) + '%'
    },
    functions: {
      total: totalFunctions,
      covered: coveredFunctions,
      uncovered: totalFunctions - coveredFunctions,
      percentage: functionPercentage,
      target: '100%',
      status: parseFloat(functionPercentage) >= 100 ? 'PASSED' : 'NOT_PASSED',
      gap: parseFloat(functionPercentage) >= 100 ? '0%' : (100 - parseFloat(functionPercentage)).toFixed(2) + '%'
    },
    lines: {
      total: totalStatements,
      covered: coveredStatements,
      uncovered: totalStatements - coveredStatements,
      percentage: statementPercentage,
      target: '≥95%',
      status: parseFloat(statementPercentage) >= 95 ? 'PASSED' : 'NOT_PASSED',
      gap: parseFloat(statementPercentage) >= 95 ? '0%' : (95 - parseFloat(statementPercentage)).toFixed(2) + '%'
    }
  },
  uncoveredLines: [...new Set(uncoveredLines)].sort((a, b) => a - b),
  certificationCriteria: {
    statements: {
      required: '≥95%',
      achieved: statementPercentage + '%',
      status: parseFloat(statementPercentage) >= 95 ? 'PASSED' : 'NOT_PASSED'
    },
    branches: {
      required: '≥97%',
      achieved: branchPercentage + '%',
      status: parseFloat(branchPercentage) >= 97 ? 'PASSED' : 'NOT_PASSED'
    },
    functions: {
      required: '100%',
      achieved: functionPercentage + '%',
      status: parseFloat(functionPercentage) >= 100 ? 'PASSED' : 'NOT_PASSED'
    },
    lines: {
      required: '≥95%',
      achieved: statementPercentage + '%',
      status: parseFloat(statementPercentage) >= 95 ? 'PASSED' : 'NOT_PASSED'
    }
  },
  overallStatus: (parseFloat(statementPercentage) >= 95 && parseFloat(branchPercentage) >= 97 && parseFloat(functionPercentage) >= 100) ? 'CERTIFIED' : 'NOT_CERTIFIED'
};

console.log(JSON.stringify(result, null, 2));
