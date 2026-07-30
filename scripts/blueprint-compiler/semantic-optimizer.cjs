#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Semantic Optimizer
 * 
 * Phase 8: LLVM-style optimizer (Contract Fusion, Dead Contract Elimination, Duplicate Type Elimination, Graph Simplification, Namespace Optimization, Dependency Minimization, Reference Compression, Event Deduplication, State Normalization, Identifier Normalization)
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

class SemanticOptimizer {
  constructor(symbolTablePath, semanticGraphPath) {
    this.symbolTablePath = symbolTablePath;
    this.semanticGraphPath = semanticGraphPath;
    this.symbolTable = null;
    this.semanticGraph = null;
    this.optimizations = [];
    this.appliedOptimizations = [];
  }

  /**
   * Load symbol table
   */
  loadSymbolTable() {
    const data = JSON.parse(readFileSync(this.symbolTablePath, 'utf-8'));
    this.symbolTable = new Map(data.symbols.map(s => [s.canonicalID, s]));
    console.log(`Loaded ${this.symbolTable.size} symbols`);
  }

  /**
   * Load semantic graph
   */
  loadSemanticGraph() {
    const data = JSON.parse(readFileSync(this.semanticGraphPath, 'utf-8'));
    this.semanticGraph = {
      nodes: new Map(data.nodes.map(n => [n.id, n])),
      edges: new Map(data.edges.map((e, i) => [i, e]))
    };
    console.log(`Loaded ${this.semanticGraph.nodes.size} nodes and ${this.semanticGraph.edges.size} edges`);
  }

  /**
   * Contract Fusion - Merge similar contracts
   */
  contractFusion() {
    console.log('Running Contract Fusion...');
    let fusedCount = 0;

    const contracts = Array.from(this.symbolTable.values())
      .filter(s => s.type === 'contract');

    // Group contracts by similar properties
    const contractGroups = new Map();

    for (const contract of contracts) {
      const signature = this.getContractSignature(contract);
      if (!contractGroups.has(signature)) {
        contractGroups.set(signature, []);
      }
      contractGroups.get(signature).push(contract);
    }

    // Fuse contracts in each group
    for (const [signature, group] of contractGroups) {
      if (group.length > 1) {
        const primary = group[0];
        const duplicates = group.slice(1);

        for (const dup of duplicates) {
          this.mergeContracts(primary, dup);
          this.symbolTable.delete(dup.canonicalID);
          fusedCount++;

          this.optimizations.push({
            type: 'contract_fusion',
            primaryId: primary.canonicalID,
            duplicateId: dup.canonicalID,
            signature,
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    console.log(`Fused ${fusedCount} contracts`);
    return fusedCount;
  }

  /**
   * Get contract signature for comparison
   */
  getContractSignature(contract) {
    return `${contract.layer}:${contract.type}:${contract.dependencies.length}`;
  }

  /**
   * Merge two contracts
   */
  mergeContracts(primary, duplicate) {
    // Merge dependencies
    for (const dep of duplicate.dependencies) {
      if (!primary.dependencies.includes(dep)) {
        primary.dependencies.push(dep);
      }
    }

    // Merge relations
    for (const rel of duplicate.relations) {
      if (!primary.relations.includes(rel)) {
        primary.relations.push(rel);
      }
    }
  }

  /**
   * Dead Contract Elimination - Remove unused contracts
   */
  deadContractElimination() {
    console.log('Running Dead Contract Elimination...');
    let eliminatedCount = 0;

    const contracts = Array.from(this.symbolTable.values())
      .filter(s => s.type === 'contract');

    for (const contract of contracts) {
      if (!this.isContractUsed(contract.canonicalID)) {
        this.symbolTable.delete(contract.canonicalID);
        eliminatedCount++;

        this.optimizations.push({
          type: 'dead_contract_elimination',
          id: contract.canonicalID,
          reason: 'unused',
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`Eliminated ${eliminatedCount} dead contracts`);
    return eliminatedCount;
  }

  /**
   * Check if contract is used
   */
  isContractUsed(contractId) {
    for (const [id, symbol] of this.symbolTable) {
      if (symbol.dependencies.includes(contractId)) {
        return true;
      }
      if (symbol.relations.some(r => r.includes(contractId))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Duplicate Type Elimination - Remove duplicate type definitions
   */
  duplicateTypeElimination() {
    console.log('Running Duplicate Type Elimination...');
    let eliminatedCount = 0;

    const types = Array.from(this.symbolTable.values())
      .filter(s => s.type === 'object' || s.type === 'interface');

    const typeMap = new Map();

    for (const type of types) {
      const signature = this.getTypeSignature(type);
      if (typeMap.has(signature)) {
        const primary = typeMap.get(signature);
        this.mergeTypes(primary, type);
        this.symbolTable.delete(type.canonicalID);
        eliminatedCount++;

        this.optimizations.push({
          type: 'duplicate_type_elimination',
          primaryId: primary.canonicalID,
          duplicateId: type.canonicalID,
          signature,
          timestamp: new Date().toISOString()
        });
      } else {
        typeMap.set(signature, type);
      }
    }

    console.log(`Eliminated ${eliminatedCount} duplicate types`);
    return eliminatedCount;
  }

  /**
   * Get type signature
   */
  getTypeSignature(type) {
    return `${type.layer}:${type.type}:${type.name}`;
  }

  /**
   * Merge two types
   */
  mergeTypes(primary, duplicate) {
    for (const dep of duplicate.dependencies) {
      if (!primary.dependencies.includes(dep)) {
        primary.dependencies.push(dep);
      }
    }
  }

  /**
   * Graph Simplification - Remove redundant edges
   */
  graphSimplification() {
    console.log('Running Graph Simplification...');
    let simplifiedCount = 0;

    const edgesToRemove = [];

    for (const [key, edge] of this.semanticGraph.edges) {
      // Check if edge is redundant (transitive)
      if (this.isRedundantEdge(edge)) {
        edgesToRemove.push(key);
        simplifiedCount++;

        this.optimizations.push({
          type: 'graph_simplification',
          edgeKey: key,
          source: edge.source,
          target: edge.target,
          edgeType: edge.type,
          reason: 'transitive',
          timestamp: new Date().toISOString()
        });
      }
    }

    for (const key of edgesToRemove) {
      this.semanticGraph.edges.delete(key);
    }

    console.log(`Simplified ${simplifiedCount} edges`);
    return simplifiedCount;
  }

  /**
   * Check if edge is redundant (transitive)
   */
  isRedundantEdge(edge) {
    if (edge.type !== 'depends_on' && edge.type !== 'extends') {
      return false;
    }

    // Check if there's a path from source to target through other nodes
    return this.hasPath(edge.source, edge.target, [edge.source]);
  }

  /**
   * Check if there's a path between two nodes
   */
  hasPath(source, target, visited) {
    if (source === target) {
      return true;
    }

    const node = this.semanticGraph.nodes.get(source);
    if (!node) {
      return false;
    }

    // Handle outEdges as object or map
    const outEdges = node.outEdges || {};
    const edgeEntries = typeof outEdges.entries === 'function' ? outEdges.entries() : Object.entries(outEdges);

    for (const [edgeType, targets] of edgeEntries) {
      const targetArray = Array.isArray(targets) ? targets : [];
      for (const targetId of targetArray) {
        if (!visited.includes(targetId)) {
          if (this.hasPath(targetId, target, [...visited, targetId])) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Namespace Optimization - Consolidate namespaces
   */
  namespaceOptimization() {
    console.log('Running Namespace Optimization...');
    let optimizedCount = 0;

    const namespaceMap = new Map();

    for (const [id, symbol] of this.symbolTable) {
      const oldNamespace = symbol.namespace;
      const newNamespace = this.optimizeNamespace(symbol);

      if (oldNamespace !== newNamespace) {
        symbol.namespace = newNamespace;
        symbol.updatedAt = new Date().toISOString();
        optimizedCount++;

        this.optimizations.push({
          type: 'namespace_optimization',
          id,
          oldNamespace,
          newNamespace,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`Optimized ${optimizedCount} namespaces`);
    return optimizedCount;
  }

  /**
   * Optimize namespace
   */
  optimizeNamespace(symbol) {
    // Consolidate similar namespaces
    const parts = symbol.namespace.split('.');
    if (parts.length > 3) {
      return parts.slice(0, 3).join('.');
    }
    return symbol.namespace;
  }

  /**
   * Dependency Minimization - Remove unnecessary dependencies
   */
  dependencyMinimization() {
    console.log('Running Dependency Minimization...');
    let minimizedCount = 0;

    for (const [id, symbol] of this.symbolTable) {
      const originalDeps = [...symbol.dependencies];
      const minimizedDeps = this.minimizeDependencies(symbol);

      if (originalDeps.length !== minimizedDeps.length) {
        symbol.dependencies = minimizedDeps;
        symbol.updatedAt = new Date().toISOString();
        minimizedCount++;

        this.optimizations.push({
          type: 'dependency_minimization',
          id,
          originalCount: originalDeps.length,
          minimizedCount: minimizedDeps.length,
          removed: originalDeps.length - minimizedDeps.length,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`Minimized ${minimizedCount} dependency sets`);
    return minimizedCount;
  }

  /**
   * Minimize dependencies (remove transitive dependencies)
   */
  minimizeDependencies(symbol) {
    const minimized = [];
    const transitive = new Set();

    for (const dep of symbol.dependencies) {
      const depSymbol = this.symbolTable.get(dep);
      if (depSymbol) {
        // Add transitive dependencies
        for (const transDep of depSymbol.dependencies) {
          transitive.add(transDep);
        }
      }
    }

    for (const dep of symbol.dependencies) {
      if (!transitive.has(dep)) {
        minimized.push(dep);
      }
    }

    return minimized;
  }

  /**
   * Reference Compression - Compress repeated references
   */
  referenceCompression() {
    console.log('Running Reference Compression...');
    let compressedCount = 0;

    for (const [id, symbol] of this.symbolTable) {
      const originalRelations = [...symbol.relations];
      const compressedRelations = this.compressRelations(symbol);

      if (originalRelations.length !== compressedRelations.length) {
        symbol.relations = compressedRelations;
        symbol.updatedAt = new Date().toISOString();
        compressedCount++;

        this.optimizations.push({
          type: 'reference_compression',
          id,
          originalCount: originalRelations.length,
          compressedCount: compressedRelations.length,
          removed: originalRelations.length - compressedRelations.length,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`Compressed ${compressedCount} reference sets`);
    return compressedCount;
  }

  /**
   * Compress relations (remove duplicates)
   */
  compressRelations(symbol) {
    return Array.from(new Set(symbol.relations));
  }

  /**
   * Event Deduplication - Remove duplicate events
   */
  eventDeduplication() {
    console.log('Running Event Deduplication...');
    let deduplicatedCount = 0;

    const events = Array.from(this.symbolTable.values())
      .filter(s => s.type === 'event');

    const eventMap = new Map();

    for (const event of events) {
      const signature = this.getEventSignature(event);
      if (eventMap.has(signature)) {
        const primary = eventMap.get(signature);
        this.symbolTable.delete(event.canonicalID);
        deduplicatedCount++;

        this.optimizations.push({
          type: 'event_deduplication',
          primaryId: primary.canonicalID,
          duplicateId: event.canonicalID,
          signature,
          timestamp: new Date().toISOString()
        });
      } else {
        eventMap.set(signature, event);
      }
    }

    console.log(`Deduplicated ${deduplicatedCount} events`);
    return deduplicatedCount;
  }

  /**
   * Get event signature
   */
  getEventSignature(event) {
    return `${event.layer}:${event.name}`;
  }

  /**
   * State Normalization - Normalize state definitions
   */
  stateNormalization() {
    console.log('Running State Normalization...');
    let normalizedCount = 0;

    const states = Array.from(this.symbolTable.values())
      .filter(s => s.type === 'state');

    for (const state of states) {
      const oldName = state.name;
      const newName = this.normalizeStateName(state.name);

      if (oldName !== newName) {
        state.name = newName;
        state.updatedAt = new Date().toISOString();
        normalizedCount++;

        this.optimizations.push({
          type: 'state_normalization',
          id: state.canonicalID,
          oldName,
          newName,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`Normalized ${normalizedCount} states`);
    return normalizedCount;
  }

  /**
   * Normalize state name
   */
  normalizeStateName(name) {
    // Ensure state names end with 'State'
    if (!name.endsWith('State')) {
      return name + 'State';
    }
    return name;
  }

  /**
   * Identifier Normalization - Normalize all identifiers
   */
  identifierNormalization() {
    console.log('Running Identifier Normalization...');
    let normalizedCount = 0;

    for (const [id, symbol] of this.symbolTable) {
      const oldName = symbol.name;
      const newName = this.normalizeIdentifier(symbol.name);

      if (oldName !== newName) {
        symbol.name = newName;
        symbol.updatedAt = new Date().toISOString();
        normalizedCount++;

        this.optimizations.push({
          type: 'identifier_normalization',
          id,
          oldName,
          newName,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`Normalized ${normalizedCount} identifiers`);
    return normalizedCount;
  }

  /**
   * Normalize identifier
   */
  normalizeIdentifier(name) {
    // Convert to PascalCase
    return name.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c.toUpperCase());
  }

  /**
   * Run all optimizations
   */
  optimize() {
    console.log('Starting Semantic Optimizer...\n');

    this.loadSymbolTable();
    this.loadSemanticGraph();

    console.log('\nRunning optimizations...');
    
    this.contractFusion();
    this.deadContractElimination();
    this.duplicateTypeElimination();
    this.graphSimplification();
    this.namespaceOptimization();
    this.dependencyMinimization();
    this.referenceCompression();
    this.eventDeduplication();
    this.stateNormalization();
    this.identifierNormalization();

    console.log('\n=== OPTIMIZATION SUMMARY ===');
    console.log(`Total Optimizations: ${this.optimizations.length}`);

    const byType = {};
    for (const opt of this.optimizations) {
      if (!byType[opt.type]) {
        byType[opt.type] = 0;
      }
      byType[opt.type]++;
    }

    console.log('\nBy Type:');
    for (const [type, count] of Object.entries(byType)) {
      console.log(`  ${type}: ${count}`);
    }

    return this.optimizations;
  }

  /**
   * Generate optimization report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalOptimizations: this.optimizations.length,
        byType: {}
      },
      optimizations: this.optimizations
    };

    for (const opt of this.optimizations) {
      if (!report.summary.byType[opt.type]) {
        report.summary.byType[opt.type] = 0;
      }
      report.summary.byType[opt.type]++;
    }

    return report;
  }

  /**
   * Save optimized symbol table
   */
  saveSymbolTable(outputPath) {
    const { createWriteStream } = require('fs');
    const stream = createWriteStream(outputPath);
    
    stream.write('{\n');
    stream.write('  "metadata": {\n');
    stream.write(`    "totalSymbols": ${this.symbolTable.size},\n`);
    stream.write(`    "generatedAt": "${new Date().toISOString()}"\n`);
    stream.write('  },\n');
    stream.write('  "symbols": [\n');
    
    let first = true;
    for (const [id, symbol] of this.symbolTable) {
      if (!first) {
        stream.write(',\n');
      }
      first = false;
      stream.write('    ' + JSON.stringify(symbol));
    }
    
    stream.write('\n  ]\n');
    stream.write('}\n');
    stream.end();

    console.log(`Optimized symbol table saved to ${outputPath}`);
  }

  /**
   * Save report to file
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`Optimization report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const symbolTablePath = process.argv[3] || join(rootPath, 'BLUEPRINT_SYMBOL_TABLE.json');
  const semanticGraphPath = process.argv[4] || join(rootPath, 'BLUEPRINT_SEMANTIC_GRAPH.json');
  const outputPath = process.argv[5] || join(rootPath, 'BLUEPRINT_OPTIMIZED_SYMBOL_TABLE.json');
  const reportPath = process.argv[6] || join(rootPath, 'BLUEPRINT_OPTIMIZATION_REPORT.json');
  
  const optimizer = new SemanticOptimizer(symbolTablePath, semanticGraphPath);

  optimizer.optimize();

  console.log('\nSaving optimized symbol table...');
  await optimizer.saveSymbolTable(outputPath);

  console.log('Generating report...');
  optimizer.saveReport(reportPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SemanticOptimizer };
