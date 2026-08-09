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

  const mutationRisk = {
    score: 0,
    factors: {
      hasBusinessLogicTests: false,
      hasEdgeCaseTests: false,
      hasErrorHandlingTests: false,
      hasIntegrationTests: false,
      hasStateValidation: false,
      hasMockDependency: false,
      hasTryCatchSwallowing: false
    },
    justification: []
  };

  // Analyse des facteurs de résistance aux mutations
  lines.forEach((line) => {
    const lowerLine = line.toLowerCase();

    // Tests de logique métier réelle
    if (lowerLine.includes('should add') || lowerLine.includes('should multiply') || 
        lowerLine.includes('should divide') || lowerLine.includes('should calculate')) {
      mutationRisk.factors.hasBusinessLogicTests = true;
    }

    // Tests de cas limites
    if (lowerLine.includes('zero') || lowerLine.includes('negative') || 
        lowerLine.includes('empty') || lowerLine.includes('boundary')) {
      mutationRisk.factors.hasEdgeCaseTests = true;
    }

    // Tests de gestion d'erreurs
    if (lowerLine.includes('error') || lowerLine.includes('throw') || 
        lowerLine.includes('invalid') || lowerLine.includes('exception')) {
      mutationRisk.factors.hasErrorHandlingTests = true;
    }

    // Tests d'intégration
    if (lowerLine.includes('integration') || lowerLine.includes('context') || 
        lowerLine.includes('pipeline') || lowerLine.includes('workflow')) {
      mutationRisk.factors.hasIntegrationTests = true;
    }

    // Validation d'état
    if (lowerLine.includes('validate') || lowerLine.includes('verify') || 
        lowerLine.includes('check') || lowerLine.includes('assert')) {
      mutationRisk.factors.hasStateValidation = true;
    }

    // Dépendance aux mocks
    if (lowerLine.includes('mock') || lowerLine.includes('spy')) {
      mutationRisk.factors.hasMockDependency = true;
    }

    // Try-catch qui masque des erreurs
    if (lowerLine.includes('try') && lowerLine.includes('catch') && 
        !lowerLine.includes('expect')) {
      mutationRisk.factors.hasTryCatchSwallowing = true;
    }
  });

  // Calcul du score de résistance aux mutations (0-100)
  let score = 50; // Score de base

  if (mutationRisk.factors.hasBusinessLogicTests) score += 15;
  if (mutationRisk.factors.hasEdgeCaseTests) score += 15;
  if (mutationRisk.factors.hasErrorHandlingTests) score += 10;
  if (mutationRisk.factors.hasIntegrationTests) score += 10;
  if (mutationRisk.factors.hasStateValidation) score += 10;

  // Pénalités
  if (mutationRisk.factors.hasMockDependency) score -= 20;
  if (mutationRisk.factors.hasTryCatchSwallowing) score -= 10;

  // Clamp entre 0 et 100
  mutationRisk.score = Math.max(0, Math.min(100, score));

  // Justification
  if (mutationRisk.factors.hasBusinessLogicTests) {
    mutationRisk.justification.push('Tests de logique métier présents');
  } else {
    mutationRisk.justification.push('Absence de tests de logique métier significative');
  }

  if (mutationRisk.factors.hasEdgeCaseTests) {
    mutationRisk.justification.push('Tests de cas limites présents');
  } else {
    mutationRisk.justification.push('Tests de cas limites insuffisants');
  }

  if (mutationRisk.factors.hasMockDependency) {
    mutationRisk.justification.push('Dépendance aux mocks réduit la confiance');
  }

  if (mutationRisk.factors.hasTryCatchSwallowing) {
    mutationRisk.justification.push('Try-catch sans assertions peut masquer des erreurs');
  }

  results[component] = mutationRisk;
});

console.log(JSON.stringify(results, null, 2));
