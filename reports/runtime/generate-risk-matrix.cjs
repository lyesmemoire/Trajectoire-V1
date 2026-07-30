const fs = require('fs');
const path = require('path');

const metrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'real-metrics.json'), 'utf8'));
const dependencyMatrix = JSON.parse(fs.readFileSync(path.join(__dirname, 'dependency-matrix.json'), 'utf8'));
const coverageAnalysis = JSON.parse(fs.readFileSync(path.join(__dirname, 'coverage-analysis.json'), 'utf8'));

function calculateRisk(comp, depData, coverageData) {
  // Impact = (complexity * 0.3) + (dependents * 0.4) + (publicMethods * 0.2) + (debtScore * 0.1)
  const normalizedComplexity = Math.min(comp.cyclomaticComplexity / 40, 1);
  const normalizedDependents = Math.min(depData.dependents / 10, 1);
  const normalizedPublicMethods = Math.min(comp.methods.public / 30, 1);
  const normalizedDebt = Math.min(coverageData.debt.debtScore / 2, 1);
  
  const impact = (normalizedComplexity * 0.3) + 
                (normalizedDependents * 0.4) + 
                (normalizedPublicMethods * 0.2) + 
                (normalizedDebt * 0.1);
  
  // Probability = (untestedBranches / totalBranches) * 0.5 + (untestedFunctions / totalFunctions) * 0.5
  const branchProbability = coverageData.debt.untestedBranches / Math.max(comp.branches, 1);
  const functionProbability = coverageData.debt.untestedFunctions / Math.max(comp.functions, 1);
  const probability = (branchProbability * 0.5) + (functionProbability * 0.5);
  
  // Priority = Impact * Probability
  const priority = impact * probability;
  
  return {
    impact: Math.round(impact * 100),
    probability: Math.round(probability * 100),
    priority: Math.round(priority * 100)
  };
}

const riskMatrix = {
  cvm: {},
  cpr: {}
};

// CVM components
for (const comp of metrics.cvm.filter(c => !c.file.includes('index.ts'))) {
  const name = path.basename(comp.file, '.ts');
  const depData = dependencyMatrix.cvm.scores[name];
  const coverageData = coverageAnalysis.cvm[name];
  
  riskMatrix.cvm[name] = {
    ...calculateRisk(comp, depData, coverageData),
    complexity: comp.cyclomaticComplexity,
    dependents: depData.dependents,
    debtScore: coverageData.debt.debtScore,
    hasTests: coverageData.hasTests
  };
}

// CPR components
for (const comp of metrics.cpr.filter(c => !c.file.includes('index.ts'))) {
  const name = path.basename(comp.file, '.ts');
  const depData = dependencyMatrix.cpr.scores[name];
  const coverageData = coverageAnalysis.cpr[name];
  
  riskMatrix.cpr[name] = {
    ...calculateRisk(comp, depData, coverageData),
    complexity: comp.cyclomaticComplexity,
    dependents: depData.dependents,
    debtScore: coverageData.debt.debtScore,
    hasTests: coverageData.hasTests
  };
}

fs.writeFileSync(
  path.join(__dirname, 'risk-matrix.json'),
  JSON.stringify(riskMatrix, null, 2)
);

console.log('Risk matrix saved to risk-matrix.json');
