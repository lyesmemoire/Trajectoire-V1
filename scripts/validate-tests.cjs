const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/cli/tests/vitest-results.json', 'utf8'));

console.log('=== TEST RESULTS SUMMARY ===');
console.log(`Total Test Suites: ${data.numTotalTestSuites}`);
console.log(`Passed Test Suites: ${data.numPassedTestSuites}`);
console.log(`Failed Test Suites: ${data.numFailedTestSuites}`);
console.log(`Total Tests: ${data.numTotalTests}`);
console.log(`Passed Tests: ${data.numPassedTests}`);
console.log(`Failed Tests: ${data.numFailedTests}`);
console.log(`Pending Tests: ${data.numPendingTests}`);
console.log(`Success: ${data.success}`);

console.log('\n=== TARGET TEST FILES ===');
data.testResults.forEach(result => {
  const fileName = result.name;
  if (fileName.includes('execution-context') || fileName.includes('memory-manager') || fileName.includes('execution-pipeline')) {
    console.log(`\nFile: ${fileName}`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Tests: ${result.assertionResults.length}`);
    console.log(`  Duration: ${result.duration}ms`);
    const passed = result.assertionResults.filter(r => r.status === 'passed').length;
    const failed = result.assertionResults.filter(r => r.status === 'failed').length;
    console.log(`  Passed: ${passed}, Failed: ${failed}`);
  }
});
