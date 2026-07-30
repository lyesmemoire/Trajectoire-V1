const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseVitestResults } = require('../parsers/vitest.cjs');
const { buildCatalog } = require('../independent-ast-mutator.cjs');

/**
 * Run independent regression testing using the lab's own AST mutator.
 * Does NOT import anything from certification/.
 * @param {string} projectRoot - Project root directory
 * @param {string} _regsFile - DEPRECATED, ignored. Kept for API compat.
 * @param {string} sourceFile - Source file to mutate
 * @param {string} testFile - Test files to run
 */
function runIndependentRegressions(projectRoot, _regsFile, sourceFile, testFile) {
  // Generate regressions dynamically via the lab's own AST engine
  const catalog = buildCatalog(sourceFile);
  const regs = catalog.filter(c => c.category === 'Regression');

  const originalSource = fs.readFileSync(sourceFile, 'utf8');
  const results = { total: regs.length, detected: 0, missed: 0, invalid: 0, regressions: [], catalogSize: catalog.length };

  for (const reg of regs) {
    let status = 'UNKNOWN';
    let duration = 0;
    const start = Date.now();

    try {
      // Apply regression via AST offset (no line numbers)
      const mutatedContent = originalSource.substring(0, reg.sourceSpan.start) + reg.replacement + originalSource.substring(reg.sourceSpan.end);
      fs.writeFileSync(sourceFile, mutatedContent);

      const resultsFile = path.join(projectRoot, `lab-vitest-R${reg.id}.json`);
      try {
        execSync(`npx vitest run ${testFile} --no-coverage --reporter=json --outputFile=${resultsFile}`, {
          cwd: projectRoot,
          stdio: 'ignore',
          timeout: 30000
        });
      } catch (e) {
        if (e.killed || e.signal === 'SIGTERM') {
          status = 'TIMEOUT';
        }
      }

      if (status !== 'TIMEOUT') {
        try {
          if (fs.existsSync(resultsFile)) {
            const vitest = parseVitestResults(resultsFile);
            if (vitest.numTotalTests > 0) {
              if (vitest.numFailedTests > 0) {
                status = 'REGRESSION_DETECTED';
              } else {
                status = 'REGRESSION_MISSED';
              }
            } else {
              status = 'BUILD_ERROR';
            }
          } else {
            status = 'BUILD_ERROR';
          }
        } catch (err) {
          status = 'BUILD_ERROR';
        }
      }
      if (fs.existsSync(resultsFile)) fs.unlinkSync(resultsFile);
    } finally {
      fs.writeFileSync(sourceFile, originalSource);
      duration = Date.now() - start;
    }

    results.regressions.push({ id: reg.id, status, duration });
    if (status === 'REGRESSION_DETECTED') results.detected++;
    else if (status === 'REGRESSION_MISSED') results.missed++;
    else results.invalid++;
  }

  results.detectionRate = results.detected + results.missed > 0 
    ? Math.floor((results.detected / (results.detected + results.missed)) * 100)
    : 0;
  
  return results;
}

module.exports = { runIndependentRegressions };
