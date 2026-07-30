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

// Load certification data
const certData = {};
for (const certFile of certificationFiles) {
  const data = JSON.parse(fs.readFileSync(certFile.path, 'utf8'));
  certData[certFile.name] = data;
}

// Calculate priority scores
const priorities = cvmFiles.map(comp => {
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
  const coverageScore = certData[comp.name] ? 0 : 100; // 20% weight (inverse - lower coverage = higher priority)
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
    finalScore: Math.round(finalScore * 100) / 100,
    estimatedEffort: Math.ceil(compComplexity / 5)
  };
});

// Sort by final score (descending)
priorities.sort((a, b) => b.finalScore - a.finalScore);

// Calculate statistics
const totalComponents = cvmFiles.length;
const certifiedComponents = certificationFiles.length;
const remainingComponents = totalComponents - certifiedComponents;
const progressPercentage = Math.round((certifiedComponents / totalComponents) * 100);

// Estimate remaining effort
const remainingEffort = priorities.filter(p => !certData[p.name]).reduce((sum, p) => sum + p.estimatedEffort, 0);

// Get next components (from priorities, ordered by priority)
const nextComponents = priorities.filter(p => !certData[p.name]).map(p => p.name);

const result = {
  auditDate: new Date().toISOString(),
  decision: {
    totalComponents,
    certifiedComponents,
    remainingComponents,
    progressPercentage,
    estimatedRemainingEffort: remainingEffort,
    nextComponents
  },
  certifiedDetails: certificationFiles.map(f => ({
    nom: f.name,
    statut: certData[f.name]?.status || 'UNKNOWN',
    priorite: priorities.find(p => p.name === f.name)?.finalScore || 0
  })),
  remainingDetails: priorities.filter(p => !certData[p.name]).map(p => ({
    nom: p.name,
    priorite: p.finalScore
  }))
};

console.log(JSON.stringify(result, null, 2));
