const fs = require('fs');
const path = require('path');

const coverageFile = 'C:/Trajectoire/reports/cli/coverage/coverage-final.json';
const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: node analyze-uncovered-branches.cjs <component-name>');
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

const branchMap = componentCoverage.branchMap;
const b = componentCoverage.b || {};

// Analyze uncovered branches
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

console.log(`\n=== UNCOVERED BRANCHES ANALYSIS FOR ${componentName} ===\n`);
console.log(`Total branches: ${Object.keys(branchMap).length}`);
console.log(`Uncovered branches: ${uncoveredBranches.length}`);
console.log(`Covered branches: ${Object.keys(branchMap).length - uncoveredBranches.length}\n`);

uncoveredBranches.forEach(branch => {
  console.log(`Branch ${branch.id} (line ${branch.line}, type: ${branch.type})`);
  branch.locations.forEach((loc, idx) => {
    console.log(`  Location ${idx}: line ${loc.line}, column ${loc.column}`);
  });
});
