const fs = require('fs');
const path = require('path');

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

  const categories = {
    A: 0, // Test fonctionnel réel
    B: 0, // Test de scénario métier
    C: 0, // Test d'intégration
    D: 0, // Test de robustesse
    E: 0, // Test de régression
    F: 0, // Test de couverture
    G: 0  // Test utilisant principalement des mocks
  };

  let totalTests = 0;
  let hasMocks = false;
  let hasTryCatch = false;
  let hasValidation = false;
  let hasErrorTests = false;
  let hasEdgeCases = false;
  let hasStressTests = false;

  lines.forEach((line, index) => {
    if (line.includes("it('should")) {
      totalTests++;
      const lowerLine = line.toLowerCase();

      // Classification heuristique
      if (lowerLine.includes('mock') || lowerLine.includes('spy')) {
        categories.G++;
        hasMocks = true;
      } else if (lowerLine.includes('stress') || lowerLine.includes('hundreds') || lowerLine.includes('rapid')) {
        categories.D++;
        hasStressTests = true;
      } else if (lowerLine.includes('error') || lowerLine.includes('throw') || lowerLine.includes('invalid')) {
        categories.D++;
        hasErrorTests = true;
      } else if (lowerLine.includes('edge') || lowerLine.includes('zero') || lowerLine.includes('negative') || lowerLine.includes('empty')) {
        categories.D++;
        hasEdgeCases = true;
      } else if (lowerLine.includes('validate') || lowerLine.includes('detect')) {
        categories.F++;
        hasValidation = true;
      } else if (lowerLine.includes('coverage') || lowerLine.includes('branch')) {
        categories.F++;
      } else if (lowerLine.includes('should add') || lowerLine.includes('should push') || lowerLine.includes('should set') || lowerLine.includes('should get')) {
        categories.A++;
      } else if (lowerLine.includes('should handle') || lowerLine.includes('should manage')) {
        categories.A++;
      } else {
        categories.A++; // Par défaut: fonctionnel
      }
    }

    if (line.includes('vi.') || line.includes('mock')) {
      hasMocks = true;
    }
    if (line.includes('try') || line.includes('catch')) {
      hasTryCatch = true;
    }
  });

  results[component] = {
    totalTests,
    categories,
    percentages: Object.fromEntries(
      Object.entries(categories).map(([k, v]) => [k, totalTests > 0 ? ((v / totalTests) * 100).toFixed(1) : 0])
    ),
    hasMocks,
    hasTryCatch,
    hasValidation,
    hasErrorTests,
    hasEdgeCases,
    hasStressTests
  };
});

console.log(JSON.stringify(results, null, 2));
