const fs = require('fs');
const path = require('path');

const metrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'real-metrics.json'), 'utf8'));
const dependencyMatrix = JSON.parse(fs.readFileSync(path.join(__dirname, 'dependency-matrix.json'), 'utf8'));
const coverageAnalysis = JSON.parse(fs.readFileSync(path.join(__dirname, 'coverage-analysis.json'), 'utf8'));
const riskMatrix = JSON.parse(fs.readFileSync(path.join(__dirname, 'risk-matrix.json'), 'utf8'));

function createFineGrainedLots() {
  const lots = [];
  let lotId = 1;
  
  // CVM components - sorted by dependency level then by risk priority
  const cvmComponents = metrics.cvm
    .filter(c => !c.file.includes('index.ts'))
    .map(comp => {
      const name = path.basename(comp.file, '.ts');
      const depData = dependencyMatrix.cvm.scores[name];
      const coverageData = coverageAnalysis.cvm[name];
      const riskData = riskMatrix.cvm[name];
      
      return {
        name,
        file: comp.file,
        lines: comp.lines,
        level: depData.level,
        priority: riskData.priority,
        hasTests: coverageData.hasTests,
        testCount: coverageData.testCount,
        complexity: comp.cyclomaticComplexity,
        branches: comp.branches,
        functions: comp.functions,
        publicMethods: comp.methods.public,
        dependents: depData.dependents
      };
    })
    .sort((a, b) => {
      // First by dependency level (lower first)
      if (a.level !== b.level) return a.level - b.level;
      // Then by priority (higher first)
      return b.priority - a.priority;
    });
  
  // CPR components - sorted by dependency level then by risk priority
  const cprComponents = metrics.cpr
    .filter(c => !c.file.includes('index.ts'))
    .map(comp => {
      const name = path.basename(comp.file, '.ts');
      const depData = dependencyMatrix.cpr.scores[name];
      const coverageData = coverageAnalysis.cpr[name];
      const riskData = riskMatrix.cpr[name];
      
      return {
        name,
        file: comp.file,
        lines: comp.lines,
        level: depData.level,
        priority: riskData.priority,
        hasTests: coverageData.hasTests,
        testCount: coverageData.testCount,
        complexity: comp.cyclomaticComplexity,
        branches: comp.branches,
        functions: comp.functions,
        publicMethods: comp.methods.public,
        dependents: depData.dependents
      };
    })
    .sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return b.priority - a.priority;
    });
  
  // Create lots for CVM components
  for (const comp of cvmComponents) {
    lots.push({
      id: lotId++,
      name: comp.name,
      category: 'CVM',
      file: comp.file,
      lines: comp.lines,
      level: comp.level,
      priority: comp.priority,
      hasTests: comp.hasTests,
      testCount: comp.testCount,
      complexity: comp.complexity,
      branches: comp.branches,
      functions: comp.functions,
      publicMethods: comp.publicMethods,
      dependents: comp.dependents,
      estimatedTests: Math.max(comp.functions, comp.branches),
      estimatedEffort: Math.ceil(comp.complexity / 5),
      dependencies: dependencyMatrix.cvm.graph[comp.name].imports
    });
  }
  
  // Create lots for CPR components
  for (const comp of cprComponents) {
    lots.push({
      id: lotId++,
      name: comp.name,
      category: 'CPR',
      file: comp.file,
      lines: comp.lines,
      level: comp.level,
      priority: comp.priority,
      hasTests: comp.hasTests,
      testCount: comp.testCount,
      complexity: comp.complexity,
      branches: comp.branches,
      functions: comp.functions,
      publicMethods: comp.publicMethods,
      dependents: comp.dependents,
      estimatedTests: Math.max(comp.functions, comp.branches),
      estimatedEffort: Math.ceil(comp.complexity / 5),
      dependencies: dependencyMatrix.cpr.graph[comp.name].imports
    });
  }
  
  return lots;
}

const lots = createFineGrainedLots();

// Calculate summary
const summary = {
  totalLots: lots.length,
  cvmLots: lots.filter(l => l.category === 'CVM').length,
  cprLots: lots.filter(l => l.category === 'CPR').length,
  totalEstimatedTests: lots.reduce((sum, l) => sum + l.estimatedTests, 0),
  totalEstimatedEffort: lots.reduce((sum, l) => sum + l.estimatedEffort, 0),
  lotsWithoutTests: lots.filter(l => !l.hasTests).length,
  lotsWithTests: lots.filter(l => l.hasTests).length
};

const result = {
  lots,
  summary
};

fs.writeFileSync(
  path.join(__dirname, 'fine-grained-lots.json'),
  JSON.stringify(result, null, 2)
);

console.log('Fine-grained lots saved to fine-grained-lots.json');
