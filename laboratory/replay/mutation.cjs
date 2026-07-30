const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseVitestResults } = require('../parsers/vitest.cjs');
const { buildCatalog } = require('../independent-ast-mutator.cjs');

/**
 * Run independent mutation testing using the lab's own AST mutator.
 * Does NOT import anything from certification/.
 * @param {string} projectRoot - Project root directory
 * @param {string} _mutsFile - DEPRECATED, ignored. Kept for API compat.
 * @param {string} sourceFile - Source file to mutate
 * @param {string} testFile - Test files to run
 */
function runIndependentMutations(projectRoot, _mutsFile, sourceFile, testFile) {
  // Generate mutations dynamically via the lab's own AST engine
  const catalog = buildCatalog(sourceFile);
  const muts = catalog.filter(c => c.category === 'Mutation');

  const originalSource = fs.readFileSync(sourceFile, 'utf8');
  const results = { total: muts.length, killed: 0, survived: 0, invalid: 0, mutations: [], catalogSize: catalog.length };

  for (const mut of muts) {
    let status = 'UNKNOWN';
    let duration = 0;
    const start = Date.now();

    try {
      // Apply mutation via AST offset (no line numbers)
      const mutatedContent = originalSource.substring(0, mut.sourceSpan.start) + mut.replacement + originalSource.substring(mut.sourceSpan.end);
      fs.writeFileSync(sourceFile, mutatedContent);

      const resultsFile = path.join(projectRoot, `lab-vitest-M${mut.id}.json`);
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
                status = 'KILLED';
              } else {
                status = 'SURVIVED';
              }
            } else {
              status = 'INVALID';
            }
          } else {
            status = 'INVALID';
          }
        } catch (err) {
          status = 'INVALID';
        }
      }
      if (fs.existsSync(resultsFile)) fs.unlinkSync(resultsFile);
    } finally {
      fs.writeFileSync(sourceFile, originalSource);
      duration = Date.now() - start;
    }

    results.mutations.push({ id: mut.id, status, duration });
    if (status === 'KILLED') results.killed++;
    else if (status === 'SURVIVED') results.survived++;
    else results.invalid++;
  }

  results.mutationScore = results.killed + results.survived > 0 
    ? Math.floor((results.killed / (results.killed + results.survived)) * 100)
    : 0;
  
  return results;
}

module.exports = { runIndependentMutations };
