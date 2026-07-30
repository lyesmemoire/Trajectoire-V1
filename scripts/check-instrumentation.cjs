const fs = require('fs');
const path = require('path');

const coverageFile = 'C:/Trajectoire/reports/cli/coverage/coverage-final.json';
const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: node check-instrumentation.cjs <component-name>');
  process.exit(1);
}

const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));

// Find the component in coverage data
const componentPath = `C:\\Trajectoire\\compiler\\cvm\\${componentName}.ts`;
const componentCoverage = coverageData[componentPath];

if (!componentCoverage) {
  console.log(`Component ${componentName} NOT FOUND in coverage data`);
  console.log(`This means the file was NOT instrumented during coverage collection`);
  process.exit(0);
}

console.log(`Component ${componentName} FOUND in coverage data`);
console.log(`This means the file WAS instrumented during coverage collection`);
console.log(`\nInstrumentation details:`);
console.log(`- Statements: ${Object.keys(componentCoverage.statementMap).length}`);
console.log(`- Branches: ${Object.keys(componentCoverage.branchMap).length}`);
console.log(`- Functions: ${Object.keys(componentCoverage.fnMap).length}`);
console.log(`\nCoverage details:`);
console.log(`- Statements covered: ${Object.values(componentCoverage.s || {}).filter(s => s > 0).length}`);
console.log(`- Branches covered: ${Object.values(componentCoverage.b || {}).filter(b => b > 0).length}`);
console.log(`- Functions covered: ${Object.values(componentCoverage.f || {}).filter(f => f > 0).length}`);
