const fs = require('fs');

const coverageFile = 'C:/Trajectoire/reports/cli/coverage/coverage-final.json';
const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: node inspect-branch-data.cjs <component-name>');
  process.exit(1);
}

const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
const componentPath = `C:\\Trajectoire\\compiler\\cvm\\${componentName}.ts`;
const componentCoverage = coverageData[componentPath];

if (!componentCoverage) {
  console.error(`Component ${componentName} not found in coverage data`);
  process.exit(1);
}

console.log(`\n=== BRANCH DATA STRUCTURE FOR ${componentName} ===\n`);
console.log(`Branch map keys: ${Object.keys(componentCoverage.branchMap).length}`);
console.log(`Branch coverage keys: ${Object.keys(componentCoverage.b || {}).length}\n`);

// Show first few branches in detail
const branchIds = Object.keys(componentCoverage.branchMap).slice(0, 5);
branchIds.forEach(id => {
  const branch = componentCoverage.branchMap[id];
  const coverage = componentCoverage.b[id];
  console.log(`Branch ${id}:`);
  console.log(`  Type: ${branch.type}`);
  console.log(`  Line: ${branch.loc.start.line}`);
  console.log(`  Coverage data: ${JSON.stringify(coverage)}`);
  console.log(`  Locations: ${branch.locations.length}`);
});
