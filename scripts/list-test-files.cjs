const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/cli/tests/vitest-results.json', 'utf8'));

console.log('=== ALL TEST FILES ===');
data.testResults.forEach(result => {
  console.log(result.name);
});
