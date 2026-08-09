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

  const weakValidation = {
    mockOnlyZones: [],
    indirectAssertionZones: [],
    stateWithoutBehavior: [],
    details: []
  };

  // Analyse des zones validées uniquement via mocks ou assertions indirectes
  let inMockTest = false;
  const mockTestLines = [];

  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();

    // Détection de tests avec mocks
    if (lowerLine.includes('vi.fn()') || lowerLine.includes('mockreturnvalue') || lowerLine.includes('mockimplementation')) {
      inMockTest = true;
      mockTestLines.push(index + 1);
    }

    if (inMockTest && line.includes('it(')) {
      inMockTest = false;
    }

    // Détection d'assertions indirectes (vérification d'état sans vérification de comportement)
    if (line.includes('expect(') && 
        (line.includes('.toBeDefined()') || line.includes('.toBeNull()') || line.includes('.toBeTruthy()'))) {
      weakValidation.indirectAssertionZones.push(index + 1);
    }

    // Détection de validation d'état sans comportement réel
    if (line.includes('validate') && !line.includes('should')) {
      weakValidation.stateWithoutBehavior.push(index + 1);
    }
  });

  if (mockTestLines.length > 0) {
    weakValidation.mockOnlyZones = mockTestLines.slice(0, 5); // Limiter à 5 exemples
  }

  results[component] = {
    hasMockOnlyZones: weakValidation.mockOnlyZones.length > 0,
    hasIndirectAssertions: weakValidation.indirectAssertionZones.length > 0,
    hasStateWithoutBehavior: weakValidation.stateWithoutBehavior.length > 0,
    mockOnlyZoneCount: weakValidation.mockOnlyZones.length,
    indirectAssertionCount: weakValidation.indirectAssertionZones.length,
    stateWithoutBehaviorCount: weakValidation.stateWithoutBehavior.length,
    riskLevel: weakValidation.mockOnlyZones.length > 5 ? 'HIGH' : 
                weakValidation.mockOnlyZones.length > 0 ? 'MEDIUM' : 'LOW'
  };
});

console.log(JSON.stringify(results, null, 2));
