const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/cli/coverage/coverage-final.json', 'utf8'));

console.log('=== EXECUTION-CONTEXT BRANCHES ===');
const comp1 = 'C:\\Trajectoire\\compiler\\cvm\\execution-context.ts';
const cov1 = data[comp1];
Object.entries(cov1.branchMap).forEach(([id, branch]) => {
  const hits = cov1.b[id];
  console.log(`Branch ${id} (line ${branch.loc.start.line}, type ${branch.type}): hits=${JSON.stringify(hits)}`);
});

console.log('\n=== MEMORY-MANAGER BRANCHES ===');
const comp2 = 'C:\\Trajectoire\\compiler\\cvm\\memory-manager.ts';
const cov2 = data[comp2];
Object.entries(cov2.branchMap).forEach(([id, branch]) => {
  const hits = cov2.b[id];
  console.log(`Branch ${id} (line ${branch.loc.start.line}, type ${branch.type}): hits=${JSON.stringify(hits)}`);
});

console.log('\n=== EXECUTION-PIPELINE BRANCHES ===');
const comp3 = 'C:\\Trajectoire\\compiler\\cvm\\execution-pipeline.ts';
const cov3 = data[comp3];
Object.entries(cov3.branchMap).forEach(([id, branch]) => {
  const hits = cov3.b[id];
  console.log(`Branch ${id} (line ${branch.loc.start.line}, type ${branch.type}): hits=${JSON.stringify(hits)}`);
});
