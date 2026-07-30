const fs = require('fs');
const path = require('path');

const metrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'real-metrics.json'), 'utf8'));
const dependencyMatrix = JSON.parse(fs.readFileSync(path.join(__dirname, 'dependency-matrix.json'), 'utf8'));
const coverageAnalysis = JSON.parse(fs.readFileSync(path.join(__dirname, 'coverage-analysis.json'), 'utf8'));
const realCoverage = JSON.parse(fs.readFileSync(path.join(__dirname, 'real-coverage.json'), 'utf8'));

// Formule exacte du score de criticité
/*
Score de Criticité (sur 100) =
  25% Complexité cyclomatique normalisée
  25% Nombre de dépendants normalisé
  20% Surface publique normalisée (méthodes publiques)
  15% Nombre de branches normalisé
  15% Position dans le graphe (niveau de dépendance)

Normalisation = valeur / valeur_max_du_système
*/

function calculateCriticalityScore(comp, depData) {
  const maxComplexity = 40;
  const maxDependents = 20;
  const maxPublicMethods = 30;
  const maxBranches = 40;
  const maxLevel = 5;
  
  const normalizedComplexity = Math.min(comp.cyclomaticComplexity / maxComplexity, 1);
  const normalizedDependents = Math.min(depData.dependents / maxDependents, 1);
  const normalizedPublicMethods = Math.min(comp.methods.public / maxPublicMethods, 1);
  const normalizedBranches = Math.min(comp.branches / maxBranches, 1);
  const normalizedLevel = Math.min(depData.level / maxLevel, 1);
  
  const score = (normalizedComplexity * 25) + 
                (normalizedDependents * 25) + 
                (normalizedPublicMethods * 20) + 
                (normalizedBranches * 15) + 
                (normalizedLevel * 15);
  
  return Math.round(score);
}

// Calculer les tests supplémentaires nécessaires
function calculateAdditionalTests(comp, coverageData, realCov) {
  const targetCoverage = 95; // 95% target
  const currentCoverage = realCov.statements;
  
  if (currentCoverage >= targetCoverage) {
    return 0;
  }
  
  const coverageGap = targetCoverage - currentCoverage;
  const additionalTests = Math.ceil((coverageGap / 100) * comp.functions * 1.5);
  
  return Math.max(0, additionalTests);
}

// Générer les données V3
const v3Data = {
  cvm: {},
  cpr: {},
  formula: {
    description: "Score de Criticité (sur 100)",
    components: [
      { name: "Complexité cyclomatique", weight: 25, description: "Normalisée sur 40" },
      { name: "Nombre de dépendants", weight: 25, description: "Normalisé sur 20" },
      { name: "Surface publique", weight: 20, description: "Méthodes publiques normalisées sur 30" },
      { name: "Nombre de branches", weight: 15, description: "Normalisé sur 40" },
      { name: "Position dans le graphe", weight: 15, description: "Niveau de dépendance normalisé sur 5" }
    ]
  }
};

// CVM components
for (const comp of metrics.cvm.filter(c => !c.file.includes('index.ts'))) {
  const name = path.basename(comp.file, '.ts');
  const depData = dependencyMatrix.cvm.scores[name];
  const coverageData = coverageAnalysis.cvm[name];
  const realCov = realCoverage.cvm[name];
  
  const criticalityScore = calculateCriticalityScore(comp, depData);
  const additionalTests = calculateAdditionalTests(comp, coverageData, realCov);
  const totalTarget = coverageData.testCount + additionalTests;
  
  v3Data.cvm[name] = {
    file: comp.file,
    lines: comp.lines,
    complexity: comp.cyclomaticComplexity,
    branches: comp.branches,
    functions: comp.functions,
    publicMethods: comp.methods.public,
    privateMethods: comp.methods.private,
    dependents: depData.dependents,
    level: depData.level,
    criticalityScore: criticalityScore,
    coverage: {
      statements: realCov.statements,
      branches: realCov.branches,
      functions: realCov.functions,
      lines: realCov.lines
    },
    tests: {
      existing: coverageData.testCount,
      additional: additionalTests,
      totalTarget: totalTarget
    },
    dependencies: {
      upstream: dependencyMatrix.cvm.graph[name].imports,
      downstream: dependencyMatrix.cvm.graph[name].dependents
    }
  };
}

// CPR components
for (const comp of metrics.cpr.filter(c => !c.file.includes('index.ts'))) {
  const name = path.basename(comp.file, '.ts');
  const depData = dependencyMatrix.cpr.scores[name];
  const coverageData = coverageAnalysis.cpr[name];
  const realCov = realCoverage.cpr[name];
  
  const criticalityScore = calculateCriticalityScore(comp, depData);
  const additionalTests = calculateAdditionalTests(comp, coverageData, realCov);
  const totalTarget = coverageData.testCount + additionalTests;
  
  v3Data.cpr[name] = {
    file: comp.file,
    lines: comp.lines,
    complexity: comp.cyclomaticComplexity,
    branches: comp.branches,
    functions: comp.functions,
    publicMethods: comp.methods.public,
    privateMethods: comp.methods.private,
    dependents: depData.dependents,
    level: depData.level,
    criticalityScore: criticalityScore,
    coverage: {
      statements: realCov.statements,
      branches: realCov.branches,
      functions: realCov.functions,
      lines: realCov.lines
    },
    tests: {
      existing: coverageData.testCount,
      additional: additionalTests,
      totalTarget: totalTarget
    },
    dependencies: {
      upstream: dependencyMatrix.cpr.graph[name].imports,
      downstream: dependencyMatrix.cpr.graph[name].dependents
    }
  };
}

fs.writeFileSync(
  path.join(__dirname, 'v3-audit-data.json'),
  JSON.stringify(v3Data, null, 2)
);

console.log('V3 audit data saved to v3-audit-data.json');
