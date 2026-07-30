#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Dependency Graph Builder
 * 
 * OBJECTIF 2: Construire le Dependency Graph
 * 
 * Analyse les dépendances pour:
 * - Détecter les cycles
 * - Établir l'ownership unique
 * - Déterminer l'ordre de compilation
 * - Déterminer l'ordre de génération
 * - Déterminer l'ordre de chargement
 * - Déterminer l'ordre d'initialisation
 * - Déterminer l'ordre d'exécution
 */

const { readFileSync, writeFileSync } = require('fs');
const { join, dirname, relative, isAbsolute } = require('path');

class DependencyGraphBuilder {
  constructor(rootPath, masterIndexPath) {
    this.rootPath = rootPath;
    this.masterIndex = JSON.parse(readFileSync(masterIndexPath, 'utf-8'));
    this.graph = new Map();
    this.reverseGraph = new Map();
    this.cycles = [];
    this.topologicalOrder = [];
    this.ownershipMap = new Map();
  }

  /**
   * Construire le graphe de dépendances
   */
  build() {
    console.log('Building dependency graph...');
    
    // Initialiser les nœuds
    for (const file of this.masterIndex.files) {
      this.graph.set(file.path, {
        path: file.path,
        dependencies: [],
        dependents: [],
        depth: 0,
        isContract: file.path.includes('.contract.ts'),
        isCompiler: file.path.startsWith('compiler/'),
        isDomain: file.path.startsWith('domain/'),
      });
      this.reverseGraph.set(file.path, []);
    }

    // Ajouter les arêtes
    for (const file of this.masterIndex.files) {
      for (const importPath of file.imports) {
        this.addEdge(file.path, importPath);
      }
    }

    // Calculer les profondeurs
    this.calculateDepths();

    // Détecter les cycles
    this.detectCycles();

    // Ordonnancement topologique
    this.topologicalSort();

    // Établir l'ownership
    this.establishOwnership();

    console.log(`Found ${this.cycles.length} cycles`);
    console.log(`Topological order: ${this.topologicalOrder.length} files`);
  }

  /**
   * Ajouter une arête de dépendance
   */
  addEdge(from, to) {
    // Résoudre le chemin d'import relatif
    const resolvedTo = this.resolveImportPath(from, to);
    
    const fromNode = this.graph.get(from);
    const toNode = this.graph.get(resolvedTo);

    if (fromNode && toNode) {
      fromNode.dependencies.push(resolvedTo);
      toNode.dependents.push(from);
      this.reverseGraph.get(resolvedTo).push(from);
    }
  }

  /**
   * Résoudre le chemin d'import relatif
   */
  resolveImportPath(fromFile, importPath) {
    // Ignorer les imports externes (node_modules, etc.)
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      // Import relatif
      const fromDir = dirname(fromFile);
      const resolved = join(fromDir, importPath);
      
      // Essayer avec .ts
      if (this.graph.has(resolved + '.ts')) {
        return resolved + '.ts';
      }
      
      // Essayer avec /index.ts
      if (this.graph.has(join(resolved, 'index.ts'))) {
        return join(resolved, 'index.ts');
      }
      
      // Essayer sans extension
      if (this.graph.has(resolved)) {
        return resolved;
      }
    }
    
    // Pour les imports absolus ou non résolus, retourner le chemin tel quel
    return importPath;
  }

  /**
   * Calculer les profondeurs des nœuds
   */
  calculateDepths() {
    const visited = new Set();
    const stack = [];

    for (const [path, node] of this.graph) {
      if (node.dependencies.length === 0) {
        stack.push(path);
      }
    }

    while (stack.length > 0) {
      const current = stack.pop();
      if (visited.has(current)) continue;

      visited.add(current);
      const currentNode = this.graph.get(current);

      for (const dependent of currentNode.dependents) {
        const dependentNode = this.graph.get(dependent);
        dependentNode.depth = Math.max(dependentNode.depth, currentNode.depth + 1);
        stack.push(dependent);
      }
    }
  }

  /**
   * Détecter les cycles dans le graphe
   */
  detectCycles() {
    const visited = new Set();
    const recursionStack = new Set();

    for (const [path] of this.graph) {
      if (!visited.has(path)) {
        this.detectCyclesDFS(path, visited, recursionStack, []);
      }
    }
  }

  /**
   * DFS pour détecter les cycles
   */
  detectCyclesDFS(node, visited, recursionStack, path) {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const nodeData = this.graph.get(node);

    for (const dependency of nodeData.dependencies) {
      if (!visited.has(dependency)) {
        if (this.detectCyclesDFS(dependency, visited, recursionStack, path)) {
          return true;
        }
      } else if (recursionStack.has(dependency)) {
        // Cycle détecté
        const cycleStart = path.indexOf(dependency);
        const cycle = path.slice(cycleStart);
        cycle.push(dependency);
        this.cycles.push(cycle);
        return true;
      }
    }

    recursionStack.delete(node);
    path.pop();
    return false;
  }

  /**
   * Ordonnancement topologique
   */
  topologicalSort() {
    const visited = new Set();
    const temp = new Set();

    const visit = (node) => {
      if (temp.has(node)) return;
      if (visited.has(node)) return;

      temp.add(node);

      const nodeData = this.graph.get(node);
      for (const dependency of nodeData.dependencies) {
        visit(dependency);
      }

      temp.delete(node);
      visited.add(node);
      this.topologicalOrder.push(node);
    };

    for (const [path] of this.graph) {
      if (!visited.has(path)) {
        visit(path);
      }
    }

    this.topologicalOrder.reverse();
  }

  /**
   * Établir l'ownership unique
   */
  establishOwnership() {
    for (const [path, node] of this.graph) {
      let owner = 'unknown';

      if (path.startsWith('compiler/')) {
        owner = 'compiler';
      } else if (path.startsWith('domain/')) {
        owner = 'domain';
      } else if (path.startsWith('apps/')) {
        owner = 'apps';
      } else if (path.startsWith('lib/')) {
        owner = 'lib';
      } else if (path.startsWith('core/')) {
        owner = 'core';
      } else if (path.startsWith('services/')) {
        owner = 'services';
      } else if (path.startsWith('gateway/')) {
        owner = 'gateway';
      } else if (path.startsWith('runtime/')) {
        owner = 'runtime';
      }

      this.ownershipMap.set(path, owner);
    }
  }

  /**
   * Générer le rapport
   */
  generateReport() {
    const report = {
      summary: {
        totalNodes: this.graph.size,
        totalEdges: Array.from(this.graph.values()).reduce((sum, n) => sum + n.dependencies.length, 0),
        totalCycles: this.cycles.length,
        maxDepth: Math.max(...Array.from(this.graph.values()).map(n => n.depth)),
      },
      cycles: this.cycles,
      topologicalOrder: this.topologicalOrder,
      ownership: Array.from(this.ownershipMap.entries()).map(([path, owner]) => ({ path, owner })),
      compilationOrder: this.getCompilationOrder(),
      loadOrder: this.getLoadOrder(),
      initializationOrder: this.getInitializationOrder(),
      executionOrder: this.getExecutionOrder(),
    };

    return report;
  }

  /**
   * Obtenir l'ordre de compilation
   */
  getCompilationOrder() {
    // Ordonner par profondeur croissante
    return Array.from(this.graph.entries())
      .sort((a, b) => a[1].depth - b[1].depth)
      .map(([path]) => path);
  }

  /**
   * Obtenir l'ordre de chargement
   */
  getLoadOrder() {
    // Contrats d'abord, puis compiler, puis le reste
    return this.topologicalOrder.filter(p => p.includes('.contract.ts'))
      .concat(this.topologicalOrder.filter(p => p.startsWith('compiler/')))
      .concat(this.topologicalOrder.filter(p => !p.includes('.contract.ts') && !p.startsWith('compiler/')));
  }

  /**
   * Obtenir l'ordre d'initialisation
   */
  getInitializationOrder() {
    // Utilitaires d'abord, puis services, puis runtime
    return this.topologicalOrder.filter(p => p.includes('/lib/'))
      .concat(this.topologicalOrder.filter(p => p.includes('/services/')))
      .concat(this.topologicalOrder.filter(p => p.includes('/runtime/')))
      .concat(this.topologicalOrder.filter(p => !p.includes('/lib/') && !p.includes('/services/') && !p.includes('/runtime/')));
  }

  /**
   * Obtenir l'ordre d'exécution
   */
  getExecutionOrder() {
    // Compiler → CIR → CBS → CVM → CPR
    const order = [];
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/lexer/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/parser/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/ast/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/semantic/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/type-system/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/constraint/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/cir/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/cbs/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/cvm/')));
    order.push(...this.topologicalOrder.filter(p => p.startsWith('compiler/cpr/')));
    return order;
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const json = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, json, 'utf-8');
    console.log(`\nDependency Graph saved to ${outputPath}`);
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    const report = this.generateReport();
    console.log('\n=== DEPENDENCY GRAPH SUMMARY ===');
    console.log(`Total Nodes: ${report.summary.totalNodes}`);
    console.log(`Total Edges: ${report.summary.totalEdges}`);
    console.log(`Total Cycles: ${report.summary.totalCycles}`);
    console.log(`Max Depth: ${report.summary.maxDepth}`);
    console.log('===============================\n');

    if (report.cycles.length > 0) {
      console.log('CYCLES DETECTED:');
      for (const cycle of report.cycles) {
        console.log(`  ${cycle.join(' -> ')}`);
      }
      console.log('');
    }
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const masterIndexPath = process.argv[3] || join(rootPath, 'BLUEPRINT_MASTER_INDEX.json');
const outputPath = process.argv[4] || join(rootPath, 'BLUEPRINT_DEPENDENCY_GRAPH.json');

const builder = new DependencyGraphBuilder(rootPath, masterIndexPath);
builder.build();
builder.printSummary();
builder.saveReport(outputPath);
