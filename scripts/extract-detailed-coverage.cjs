const fs = require('fs');
const path = require('path');

const coverageFile = 'C:/Trajectoire/reports/cli/coverage/coverage-final.json';
const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: node extract-detailed-coverage.cjs <component-name>');
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

// Calculate coverage metrics with detailed line information
const statementMap = componentCoverage.statementMap;
const branchMap = componentCoverage.branchMap;
const fnMap = componentCoverage.fnMap;
const s = componentCoverage.s || {};
const b = componentCoverage.b || {};
const f = componentCoverage.f || {};

const totalStatements = Object.keys(statementMap).length;
const coveredStatements = Object.values(s).filter(s => s > 0).length;

const totalFunctions = Object.keys(fnMap).length;
const coveredFunctions = Object.values(f).filter(f => f > 0).length;

const totalBranches = Object.keys(branchMap).length;
const coveredBranches = Object.values(b).filter(b => b > 0).length;

const statementPercentage = totalStatements > 0 ? ((coveredStatements / totalStatements) * 100).toFixed(2) : '0.00';
const functionPercentage = totalFunctions > 0 ? ((coveredFunctions / totalFunctions) * 100).toFixed(2) : '0.00';
const branchPercentage = totalBranches > 0 ? ((coveredBranches / totalBranches) * 100).toFixed(2) : '0.00';

// Detailed uncovered statements with line numbers
const uncoveredStatements = [];
Object.entries(statementMap).forEach(([id, stmt]) => {
  const line = stmt.start.line;
  const isCovered = s[id] > 0;
  if (!isCovered) {
    uncoveredStatements.push({
      id,
      line,
      column: stmt.start.column,
      endLine: stmt.end.line,
      endColumn: stmt.end.column
    });
  }
});

// Detailed uncovered branches with line numbers
const uncoveredBranches = [];
Object.entries(branchMap).forEach(([id, branch]) => {
  const line = branch.loc.start.line;
  const isCovered = b[id] && b[id].some(h => h > 0);
  if (!isCovered) {
    uncoveredBranches.push({
      id,
      line,
      type: branch.type,
      locations: branch.locations.map(loc => ({
        line: loc.start.line,
        column: loc.start.column
      }))
    });
  }
});

// Detailed uncovered functions with line numbers
const uncoveredFunctions = [];
Object.entries(fnMap).forEach(([id, fn]) => {
  const line = fn.loc.start.line;
  const isCovered = f[id] > 0;
  if (!isCovered) {
    uncoveredFunctions.push({
      id,
      line,
      name: fn.name,
      column: fn.loc.start.column
    });
  }
});

const result = {
  component: componentName,
  file: `compiler/cvm/${componentName}.ts`,
  auditDate: new Date().toISOString(),
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
  uncoveredStatements,
  uncoveredBranches,
  uncoveredFunctions,
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
