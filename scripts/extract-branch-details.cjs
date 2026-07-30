const fs = require('fs');
const coverageFile = 'C:/Trajectoire/reports/cli/coverage/coverage-final.json';
const targetFile = 'C:\\Trajectoire\\compiler\\cvm\\instruction-fetch.ts';

const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
const fileCoverage = coverage[targetFile];

if (!fileCoverage) {
  console.log('File not found in coverage');
  process.exit(1);
}

console.log('=== Branch Details ===');
const branchCounts = Object.values(fileCoverage.b);
const totalBranches = branchCounts.length;

// Parse branch counts - they appear to be arrays
let coveredBranches = 0;
let uncoveredBranches = 0;

Object.entries(fileCoverage.b).forEach(([branchId, count]) => {
  const countArray = Array.isArray(count) ? count : [count];
  const totalHits = countArray.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
  if (totalHits > 0) {
    coveredBranches++;
  } else {
    uncoveredBranches++;
  }
});

console.log('Total branches:', totalBranches);
console.log('Covered branches:', coveredBranches);
console.log('Uncovered branches:', uncoveredBranches);
console.log('Coverage %:', ((coveredBranches / totalBranches) * 100).toFixed(2));

console.log('\n=== Uncovered Branches ===');
Object.entries(fileCoverage.b).forEach(([branchId, count]) => {
  const countArray = Array.isArray(count) ? count : [count];
  const totalHits = countArray.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
  if (totalHits === 0) {
    const branchInfo = fileCoverage.branchMap[branchId];
    console.log(`Branch ${branchId}:`);
    console.log(`  Location: line ${branchInfo.loc.start.line}`);
    console.log(`  Type: ${branchInfo.type}`);
    console.log(`  Locations: ${JSON.stringify(branchInfo.locations)}`);
    console.log(`  Count: ${JSON.stringify(count)}`);
  }
});

console.log('\n=== All Branch Map ===');
Object.entries(fileCoverage.branchMap).forEach(([branchId, branchInfo]) => {
  const count = fileCoverage.b[branchId];
  const countArray = Array.isArray(count) ? count : [count];
  const totalHits = countArray.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
  const status = totalHits > 0 ? 'COVERED' : 'NOT COVERED';
  console.log(`Branch ${branchId} (line ${branchInfo.loc.start.line}): ${status} (${totalHits} hits)`);
  console.log(`  Type: ${branchInfo.type}`);
  console.log(`  Count array: ${JSON.stringify(count)}`);
});
