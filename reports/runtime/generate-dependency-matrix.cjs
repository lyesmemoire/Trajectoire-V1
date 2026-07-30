const fs = require('fs');
const path = require('path');

const metrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'real-metrics.json'), 'utf8'));

function buildDependencyGraph(components) {
  const graph = {};
  
  for (const comp of components) {
    const fileName = path.basename(comp.file, '.ts');
    graph[fileName] = {
      file: comp.file,
      imports: comp.imports.map(imp => {
        // Extract the base name from the import path
        const parts = imp.split('/');
        const baseName = parts[parts.length - 1].replace('.ts', '');
        return baseName;
      }),
      dependents: []
    };
  }
  
  // Build dependents (reverse dependencies)
  for (const [name, data] of Object.entries(graph)) {
    for (const imp of data.imports) {
      if (graph[imp]) {
        graph[imp].dependents.push(name);
      }
    }
  }
  
  return graph;
}

function calculateDependencyLevels(graph) {
  const levels = {};
  const visited = new Set();
  
  function getLevel(name, currentLevel = 0) {
    if (visited.has(name)) return levels[name] || 0;
    visited.add(name);
    
    let maxDepLevel = 0;
    for (const dep of graph[name].imports) {
      if (graph[dep]) {
        const depLevel = getLevel(dep, currentLevel + 1);
        maxDepLevel = Math.max(maxDepLevel, depLevel + 1);
      }
    }
    
    levels[name] = maxDepLevel;
    return maxDepLevel;
  }
  
  for (const name of Object.keys(graph)) {
    if (!visited.has(name)) {
      getLevel(name);
    }
  }
  
  return levels;
}

function calculateCriticalityScore(comp, dependentsCount, complexity) {
  // Score = (complexity * 0.3) + (dependents * 0.4) + (publicMethods * 0.2) + (branches * 0.1)
  const normalizedComplexity = Math.min(complexity / 40, 1);
  const normalizedDependents = Math.min(dependentsCount / 10, 1);
  const normalizedPublicMethods = Math.min(comp.methods.public / 30, 1);
  const normalizedBranches = Math.min(comp.branches / 40, 1);
  
  const score = (normalizedComplexity * 0.3) + 
                (normalizedDependents * 0.4) + 
                (normalizedPublicMethods * 0.2) + 
                (normalizedBranches * 0.1);
  
  return Math.round(score * 100);
}

// Build dependency graphs
const cvmGraph = buildDependencyGraph(metrics.cvm.filter(c => !c.file.includes('index.ts')));
const cprGraph = buildDependencyGraph(metrics.cpr.filter(c => !c.file.includes('index.ts')));

// Calculate dependency levels
const cvmLevels = calculateDependencyLevels(cvmGraph);
const cprLevels = calculateDependencyLevels(cprGraph);

// Calculate criticality scores
const cvmScores = {};
for (const comp of metrics.cvm.filter(c => !c.file.includes('index.ts'))) {
  const name = path.basename(comp.file, '.ts');
  const dependentsCount = cvmGraph[name].dependents.length;
  cvmScores[name] = {
    score: calculateCriticalityScore(comp, dependentsCount, comp.cyclomaticComplexity),
    dependents: dependentsCount,
    complexity: comp.cyclomaticComplexity,
    level: cvmLevels[name]
  };
}

const cprScores = {};
for (const comp of metrics.cpr.filter(c => !c.file.includes('index.ts'))) {
  const name = path.basename(comp.file, '.ts');
  const dependentsCount = cprGraph[name].dependents.length;
  cprScores[name] = {
    score: calculateCriticalityScore(comp, dependentsCount, comp.cyclomaticComplexity),
    dependents: dependentsCount,
    complexity: comp.cyclomaticComplexity,
    level: cprLevels[name]
  };
}

const result = {
  cvm: {
    graph: cvmGraph,
    levels: cvmLevels,
    scores: cvmScores
  },
  cpr: {
    graph: cprGraph,
    levels: cprLevels,
    scores: cprScores
  }
};

fs.writeFileSync(
  path.join(__dirname, 'dependency-matrix.json'),
  JSON.stringify(result, null, 2)
);

console.log('Dependency matrix saved to dependency-matrix.json');
