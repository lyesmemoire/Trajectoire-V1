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

  const assertionAnalysis = {
    totalExpect: 0,
    businessValidation: 0,
    internalValidation: 0,
    mockValidation: 0,
    coverageValidation: 0,
    errorValidation: 0
  };

  lines.forEach((line) => {
    if (line.includes('expect(')) {
      assertionAnalysis.totalExpect++;
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes('mock') || lowerLine.includes('spy')) {
        assertionAnalysis.mockValidation++;
      } else if (lowerLine.includes('error') || lowerLine.includes('throw') || lowerLine.includes('invalid')) {
        assertionAnalysis.errorValidation++;
      } else if (lowerLine.includes('coverage') || lowerLine.includes('branch') || lowerLine.includes('hit') || lowerLine.includes('miss')) {
        assertionAnalysis.coverageValidation++;
      } else if (lowerLine.includes('tobedefined') || lowerLine.includes('tobenull') || lowerLine.includes('tobetruthy')) {
        assertionAnalysis.internalValidation++;
      } else if (lowerLine.includes('.tobe(') || lowerLine.includes('.toequal(') || lowerLine.includes('.tocontain(')) {
        assertionAnalysis.businessValidation++;
      } else {
        assertionAnalysis.businessValidation++;
      }
    }
  });

  results[component] = assertionAnalysis;
});

console.log(JSON.stringify(results, null, 2));
