const fs = require('fs');
const path = require('path');

const cvmDir = 'C:/Trajectoire/compiler/cvm';
const reportsDir = 'C:/Trajectoire/reports/runtime';

// Get all TypeScript files in compiler/cvm
const cvmFiles = fs.readdirSync(cvmDir)
  .filter(f => f.endsWith('.ts'))
  .map(f => ({
    name: f.replace('.ts', ''),
    path: path.join(cvmDir, f)
  }));

// Get all certification reports
const reportFiles = fs.readdirSync(reportsDir)
  .filter(f => f.endsWith('-certification.json'))
  .map(f => ({
    name: f.replace('-certification.json', ''),
    path: path.join(reportsDir, f)
  }));

// Certified components
const certified = [
  'execution-context',
  'memory-manager',
  'thread-manager',
  'instruction-cache',
  'instruction-fetch',
  'instruction-decode',
  'instruction-execute',
  'execution-pipeline',
  'rollback-manager'
];

// Build dependency graph
const dependencies = {};
const callGraph = {};

// Analyze each file for dependencies
for (const file of cvmFiles) {
  const content = fs.readFileSync(file.path, 'utf8');
  const imports = content.match(/import.*from\s+['"]\.\/(.*)['"]/g) || [];
  const deps = imports.map(imp => {
    const match = imp.match(/from\s+['"]\.\/(.*)['"]/);
    return match ? match[1] : null;
  }).filter(Boolean);

  dependencies[file.name] = deps;

  // Build call graph (simplified)
  const classMatch = content.match(/export class (\w+)/);
  if (classMatch) {
    const className = classMatch[1];
    const methods = content.match(/public (\w+)\(/g) || [];
    const methodNames = methods.map(m => m.match(/public (\w+)\(/)[1]);
    callGraph[file.name] = {
      class: className,
      methods: methodNames
    };
  }
}

// Topological sort (Kahn's algorithm)
const topologicalOrder = [];
const inDegree = {};
const queue = [];

// Initialize in-degrees
for (const comp of cvmFiles) {
  inDegree[comp.name] = 0;
}

for (const comp of cvmFiles) {
  for (const dep of dependencies[comp.name] || []) {
    if (inDegree[dep] !== undefined) {
      inDegree[comp.name]++;
    }
  }
}

// Find nodes with in-degree 0
for (const comp of cvmFiles) {
  if (inDegree[comp.name] === 0) {
    queue.push(comp.name);
  }
}

// Process queue
while (queue.length > 0) {
  const node = queue.shift();
  topologicalOrder.push(node);

  for (const comp of cvmFiles) {
    if ((dependencies[comp.name] || []).includes(node)) {
      inDegree[comp.name]--;
      if (inDegree[comp.name] === 0) {
        queue.push(comp.name);
      }
    }
  }
}

// Identify remaining components
const remaining = cvmFiles
  .filter(f => !certified.includes(f.name))
  .map(f => f.name);

// Dependencies to non-certified components
const depsToNonCertified = {};
for (const comp of cvmFiles) {
  const deps = dependencies[comp.name] || [];
  const nonCertifiedDeps = deps.filter(d => !certified.includes(d));
  if (nonCertifiedDeps.length > 0) {
    depsToNonCertified[comp.name] = nonCertifiedDeps;
  }
}

// Check for cycles
const visited = new Set();
const recursionStack = new Set();
const cycles = [];

function hasCycle(node) {
  if (recursionStack.has(node)) {
    cycles.push(node);
    return true;
  }
  if (visited.has(node)) {
    return false;
  }

  visited.add(node);
  recursionStack.add(node);

  for (const dep of dependencies[node] || []) {
    if (hasCycle(dep)) {
      return true;
    }
  }

  recursionStack.delete(node);
  return false;
}

for (const comp of cvmFiles) {
  if (!visited.has(comp.name)) {
    hasCycle(comp.name);
  }
}

// Synchronization points (components that manage shared state)
const syncPoints = cvmFiles
  .filter(f => {
    const content = fs.readFileSync(f.path, 'utf8');
    return content.includes('lock') || 
           content.includes('mutex') || 
           content.includes('synchronize') ||
           content.includes('atomic') ||
           content.includes('concurrent');
  })
  .map(f => f.name);

const result = {
  auditDate: new Date().toISOString(),
  totalComponents: cvmFiles.length,
  certifiedCount: certified.length,
  remainingCount: remaining.length,
  components: cvmFiles.map(f => ({
    name: f.name,
    certified: certified.includes(f.name),
    dependencies: dependencies[f.name] || [],
    inDegree: inDegree[f.name] || 0
  })),
  dependencyGraph: dependencies,
  callGraph: callGraph,
  topologicalOrder: topologicalOrder,
  remainingComponents: remaining,
  dependenciesToNonCertified: depsToNonCertified,
  cycles: cycles,
  synchronizationPoints: syncPoints
};

console.log(JSON.stringify(result, null, 2));
