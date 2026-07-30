const fs = require('fs');
const path = require('path');

const cvmDir = 'C:/Trajectoire/compiler/cvm';
const reportsDir = 'C:/Trajectoire/reports/runtime';

// Get all TypeScript files in compiler/cvm (excluding index.ts)
const cvmFiles = fs.readdirSync(cvmDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .map(f => ({
    name: f.replace('.ts', ''),
    path: path.join(cvmDir, f)
  }));

// Get certification reports
const certificationFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-certification.json'))
  .map(f => ({
    name: f.replace('-certification.json', ''),
    path: path.join(reportsDir, f)
  }));

// Build dependency graph directly
const dependencies = {};
for (const file of cvmFiles) {
  const content = fs.readFileSync(file.path, 'utf8');
  const imports = content.match(/import.*from\s+['"]\.\/(.*)['"]/g) || [];
  const deps = imports.map(imp => {
    const match = imp.match(/from\s+['"]\.\/(.*)['"]/);
    return match ? match[1] : null;
  }).filter(Boolean);
  dependencies[file.name] = deps;
}

// Calculate complexity (LOC / 10)
const complexity = {};
for (const file of cvmFiles) {
  const content = fs.readFileSync(file.path, 'utf8');
  const lines = content.split('\n').length;
  complexity[file.name] = Math.floor(lines / 10);
}

// Get remaining components (not certified)
const certifiedNames = certificationFiles.map(f => f.name);
const remaining = cvmFiles.filter(f => !certifiedNames.includes(f.name));

// Calculate priority scores
const priorities = remaining.map(comp => {
  const depGraph = dependencies[comp.name] || [];
  const compComplexity = complexity[comp.name] || 0;
  
  // Count components that depend on this one
  const dependents = Object.values(dependencies)
    .filter(deps => deps.includes(comp.name))
    .length;
  
  // Count public API methods (from class definition)
  const content = fs.readFileSync(comp.path, 'utf8');
  const publicMethods = (content.match(/public (\w+)\(/g) || []).length;
  
  // Calculate scores (normalized 0-100)
  const dependencyScore = Math.min((dependents / 10) * 100, 100); // 30% weight
  const complexityScore = Math.min((compComplexity / 50) * 100, 100); // 25% weight
  const coverageScore = 100; // 20% weight (no coverage = highest priority)
  const impactScore = Math.min((dependents / 5) * 100, 100); // 15% weight
  const apiScore = Math.min((publicMethods / 20) * 100, 100); // 10% weight
  
  // Weighted score
  const finalScore = 
    (dependencyScore * 0.30) +
    (complexityScore * 0.25) +
    (coverageScore * 0.20) +
    (impactScore * 0.15) +
    (apiScore * 0.10);
  
  return {
    name: comp.name,
    scores: {
      dependency: Math.round(dependencyScore),
      complexity: Math.round(complexityScore),
      coverage: Math.round(coverageScore),
      impact: Math.round(impactScore),
      api: Math.round(apiScore)
    },
    finalScore: Math.round(finalScore * 100) / 100,
    metrics: {
      dependencies: depGraph.length,
      dependents,
      complexity: compComplexity,
      publicMethods
    }
  };
});

// Sort by final score (descending)
priorities.sort((a, b) => b.finalScore - a.finalScore);

// Load certification matrix for status info
const certStatus = {};
for (const certFile of certificationFiles) {
  const data = JSON.parse(fs.readFileSync(certFile.path, 'utf8'));
  certStatus[certFile.name] = data.status;
}

// Build roadmap with lots (one component per lot)
const roadmap = priorities.map((comp, index) => {
  const status = certStatus[comp.name] || 'NOT STARTED';
  
  return {
    lot: index + 1,
    component: comp.name,
    priority: comp.finalScore,
    estimatedEffort: Math.ceil(comp.metrics.complexity / 5), // Simplified effort estimation
    dependencies: comp.metrics.dependencies,
    dependents: comp.metrics.dependents,
    complexity: comp.metrics.complexity,
    publicMethods: comp.metrics.publicMethods,
    status: status,
    currentCoverage: { statements: 0, branches: 0, functions: 0, lines: 0 }
  };
});

const result = {
  auditDate: new Date().toISOString(),
  totalLots: roadmap.length,
  totalComponents: roadmap.length,
  roadmap
};

console.log(JSON.stringify(result, null, 2));
