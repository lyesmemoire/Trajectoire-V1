const fs = require('fs');

function parseVitestResults(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier introuvable: ${filePath}`);
  }
  
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const numTotalTests = raw.numTotalTests || 0;
  const numFailedTests = raw.numFailedTests || 0;
  const numPassedTests = raw.numPassedTests || 0;
  const success = raw.success;

  const failedTestTitles = [];
  
  if (raw.testResults) {
    for (const tr of raw.testResults) {
      if (tr.assertionResults) {
        for (const ar of tr.assertionResults) {
          if (ar.status === 'failed') {
            failedTestTitles.push(ar.title);
          }
        }
      }
    }
  }

  return {
    numTotalTests,
    numFailedTests,
    numPassedTests,
    success,
    failedTestTitles
  };
}

module.exports = { parseVitestResults };
