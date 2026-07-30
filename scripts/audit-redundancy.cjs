const fs = require('fs');

const testFiles = {
  'execution-context': 'c:/Trajectoire/tests/vm/core/execution-context.test.ts',
  'memory-manager': 'c:/Trajectoire/tests/vm/memory/memory-manager.test.ts',
  'execution-pipeline': 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts',
  'instruction-cache': 'c:/Trajectoire/tests/vm/performance/instruction-cache.test.ts',
  'instruction-fetch': 'c:/Trajectoire/tests/vm/loader/instruction-fetch.test.ts',
  'instruction-decode': 'c:/Trajectoire/tests/vm/decoder/instruction-decode.test.ts',
  'instruction-execute': 'c:/Trajectoire/tests/vm/executor/instruction-execute.test.ts',
  'rollback-manager': 'c:/Trajectoire/tests/vm/advanced/rollback-manager.test.ts',
  'thread-manager': 'c:/Trajectoire/tests/vm/advanced/thread-manager.test.ts'
};

const results = {};

Object.entries(testFiles).forEach(([component, filePath]) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const redundancyAnalysis = {
    duplicateTests: 0,
    duplicateAssertions: 0,
    similarScenarios: 0,
    potentialGain: 0,
    details: []
  };

  // Analyse des patterns de répétition
  const testPatterns = {};
  const assertionPatterns = {};

  lines.forEach((line, index) => {
    if (line.includes("it('should")) {
      const testPattern = line.replace(/'.*'/g, "'X'").replace(/\d+/g, 'N');
      testPatterns[testPattern] = (testPatterns[testPattern] || 0) + 1;
    }

    if (line.includes('expect(')) {
      const assertionPattern = line.replace(/'.*'/g, "'X'").replace(/\d+/g, 'N');
      assertionPatterns[assertionPattern] = (assertionPatterns[assertionPattern] || 0) + 1;
    }
  });

  // Compter les duplications
  Object.entries(testPatterns).forEach(([pattern, count]) => {
    if (count > 1) {
      redundancyAnalysis.duplicateTests += count - 1;
    }
  });

  Object.entries(assertionPatterns).forEach(([pattern, count]) => {
    if (count > 1) {
      redundancyAnalysis.duplicateAssertions += count - 1;
    }
  });

  // Scénarios similaires (basés sur les describe blocks)
  const describeBlocks = content.match(/describe\('[^']+'/g) || [];
  if (describeBlocks.length > 5) {
    redundancyAnalysis.similarScenarios = Math.floor(describeBlocks.length / 3);
  }

  // Estimation du gain potentiel (en pourcentage de tests pouvant être éliminés)
  const totalTests = content.match(/it\(/g) || [];
  const totalTestCount = totalTests.length;
  
  if (totalTestCount > 0) {
    const redundantCount = redundancyAnalysis.duplicateTests + redundancyAnalysis.similarScenarios;
    redundancyAnalysis.potentialGain = Math.min(30, Math.floor((redundantCount / totalTestCount) * 100));
  }

  results[component] = redundancyAnalysis;
});

console.log(JSON.stringify(results, null, 2));
