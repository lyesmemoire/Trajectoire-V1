const fs = require('fs');

const coverageFile = 'C:/Trajectoire/reports/cli/coverage/coverage-final.json';
const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: node calculate-branch-coverage.cjs <component-name>');
  process.exit(1);
}

const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
const componentPath = `C:\\Trajectoire\\compiler\\cvm\\${componentName}.ts`;
const componentCoverage = coverageData[componentPath];

if (!componentCoverage) {
  console.error(`Component ${componentName} not found in coverage data`);
  process.exit(1);
}

const branchMap = componentCoverage.branchMap;
const b = componentCoverage.b || {};

// Calculate branch coverage correctly (V8 style)
let totalBranchLocations = 0;
let coveredBranchLocations = 0;

Object.entries(branchMap).forEach(([id, branch]) => {
  const coverage = b[id] || [];
  branch.locations.forEach((loc, idx) => {
    totalBranchLocations++;
    if (coverage[idx] > 0) {
      coveredBranchLocations++;
    }
  });
});

const percentage = totalBranchLocations > 0 ? ((coveredBranchLocations / totalBranchLocations) * 100).toFixed(2) : '0.00';

console.log(`\n=== BRANCH COVERAGE CALCULATION FOR ${componentName} ===\n`);
console.log(`Total branch locations: ${totalBranchLocations}`);
console.log(`Covered branch locations: ${coveredBranchLocations}`);
console.log(`Branch coverage: ${percentage}%`);
console.log(`Target: ≥97%`);
console.log(`Status: ${parseFloat(percentage) >= 97 ? 'PASSED' : 'NOT_PASSED'}`);
