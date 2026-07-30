const fs = require('fs');
const path = require('path');

const coverageFile = path.join(process.cwd(), 'reports/cli/coverage/coverage-final.json');
const targetFile = process.argv[2];

if (!targetFile) {
  console.error('Usage: node scripts/extract-coverage.cjs <target-file>');
  console.error('Example: node scripts/extract-coverage.cjs compiler/cvm/execution-context.ts');
  process.exit(1);
}

if (!fs.existsSync(coverageFile)) {
  console.error(`Coverage file not found: ${coverageFile}`);
  process.exit(1);
}

const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));

// Find the target file in coverage data
const targetKey = Object.keys(coverageData).find(key => key.includes(targetFile));

if (!targetKey) {
  console.error(`Target file not found in coverage data: ${targetFile}`);
  console.error('Available files:', Object.keys(coverageData).slice(0, 10));
  process.exit(1);
}

const fileCoverage = coverageData[targetKey];

// Calculate coverage metrics
const statements = Object.values(fileCoverage.s);
const functions = Object.values(fileCoverage.f);
const branches = Object.values(fileCoverage.b).flat();

const totalStatements = statements.length;
const coveredStatements = statements.filter(s => s > 0).length;
const statementCoverage = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0;

const totalFunctions = functions.length;
const coveredFunctions = functions.filter(f => f > 0).length;
const functionCoverage = totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0;

const totalBranches = branches.length;
const coveredBranches = branches.filter(b => b > 0).length;
const branchCoverage = totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0;

// Lines coverage (same as statements for V8 provider)
const lineCoverage = statementCoverage;

// Find uncovered lines
const uncoveredLines = [];
Object.entries(fileCoverage.s).forEach(([key, count]) => {
  if (count === 0) {
    const statementIndex = parseInt(key);
    const statement = fileCoverage.statementMap[statementIndex];
    if (statement) {
      uncoveredLines.push(statement.start.line);
    }
  }
});

const result = {
  file: targetKey,
  metrics: {
    statements: {
      total: totalStatements,
      covered: coveredStatements,
      percentage: statementCoverage.toFixed(2)
    },
    branches: {
      total: totalBranches,
      covered: coveredBranches,
      percentage: branchCoverage.toFixed(2)
    },
    functions: {
      total: totalFunctions,
      covered: coveredFunctions,
      percentage: functionCoverage.toFixed(2)
    },
    lines: {
      total: totalStatements,
      covered: coveredStatements,
      percentage: lineCoverage.toFixed(2)
    }
  },
  uncoveredLines: [...new Set(uncoveredLines)].sort((a, b) => a - b)
};

console.log(JSON.stringify(result, null, 2));
