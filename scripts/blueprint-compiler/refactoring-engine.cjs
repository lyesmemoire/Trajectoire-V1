#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Canonical Refactoring Engine
 * 
 * Phase 7: Automatic refactoring engine (merge, rename, move, delete, reference, normalize, update)
 */

const { readFileSync, writeFileSync, existsSync, unlinkSync, renameSync } = require('fs');
const { join, dirname, basename } = require('path');
const { createHash } = require('crypto');

class RefactoringEngine {
  constructor(symbolTablePath, semanticGraphPath) {
    this.symbolTablePath = symbolTablePath;
    this.semanticGraphPath = semanticGraphPath;
    this.symbolTable = null;
    this.semanticGraph = null;
    this.operations = [];
    this.appliedOperations = [];
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
   * Merge duplicate symbols
   */
  mergeDuplicates() {
    console.log('Merging duplicate symbols...');
    
    const nameMap = new Map();
    const duplicates = [];

    for (const [id, symbol] of this.symbolTable) {
      if (nameMap.has(symbol.name)) {
        duplicates.push({
          primary: nameMap.get(symbol.name),
          duplicate: symbol,
          id
        });
      } else {
        nameMap.set(symbol.name, symbol);
      }
    }

    console.log(`Found ${duplicates.length} potential duplicates`);

    for (const dup of duplicates) {
      this.operations.push({
        type: 'merge',
        primaryId: dup.primary.canonicalID,
        duplicateId: dup.id,
        reason: 'duplicate_name',
        timestamp: new Date().toISOString()
      });
    }

    return duplicates;
  }

  /**
   * Rename symbol
   */
  renameSymbol(oldId, newName) {
    console.log(`Renaming ${oldId} to ${newName}`);
    
    const symbol = this.symbolTable.get(oldId);
    if (!symbol) {
      console.log(`Symbol ${oldId} not found`);
      return false;
    }

    const oldName = symbol.name;
    symbol.name = newName;
    symbol.updatedAt = new Date().toISOString();

    this.operations.push({
      type: 'rename',
      id: oldId,
      oldName,
      newName,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  /**
   * Move symbol to different layer
   */
  moveSymbol(id, newLayer) {
    console.log(`Moving ${id} to ${newLayer}`);
    
    const symbol = this.symbolTable.get(id);
    if (!symbol) {
      console.log(`Symbol ${id} not found`);
      return false;
    }

    const oldLayer = symbol.layer;
    symbol.layer = newLayer;
    symbol.updatedAt = new Date().toISOString();

    this.operations.push({
      type: 'move',
      id,
      oldLayer,
      newLayer,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  /**
   * Delete unused symbol
   */
  deleteSymbol(id) {
    console.log(`Deleting ${id}`);
    
    const symbol = this.symbolTable.get(id);
    if (!symbol) {
      console.log(`Symbol ${id} not found`);
      return false;
    }

    // Check if symbol has dependencies
    const hasDependencies = symbol.dependencies.length > 0;
    
    if (hasDependencies) {
      console.log(`Cannot delete ${id}: has ${symbol.dependencies.length} dependencies`);
      return false;
    }

    this.symbolTable.delete(id);

    this.operations.push({
      type: 'delete',
      id,
      reason: 'unused',
      timestamp: new Date().toISOString()
    });

    return true;
  }

  /**
   * Update references
   */
  updateReferences(oldId, newId) {
    console.log(`Updating references from ${oldId} to ${newId}`);
    
    let updatedCount = 0;

    for (const [id, symbol] of this.symbolTable) {
      if (symbol.dependencies.includes(oldId)) {
        symbol.dependencies = symbol.dependencies.map(d => d === oldId ? newId : d);
        symbol.updatedAt = new Date().toISOString();
        updatedCount++;
      }

      symbol.relations = symbol.relations.map(r => {
        const [type, target] = r.split(':');
        if (target === oldId) {
          return `${type}:${newId}`;
        }
        return r;
      });

      if (symbol.relations.some(r => r.includes(newId))) {
        symbol.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    }

    this.operations.push({
      type: 'update_references',
      oldId,
      newId,
      updatedCount,
      timestamp: new Date().toISOString()
    });

    return updatedCount;
  }

  /**
   * Normalize identifiers
   */
  normalizeIdentifiers() {
    console.log('Normalizing identifiers...');
    
    let normalizedCount = 0;

    for (const [id, symbol] of this.symbolTable) {
      const oldName = symbol.name;
      const newName = this.toPascalCase(symbol.name);
      
      if (oldName !== newName) {
        symbol.name = newName;
        symbol.updatedAt = new Date().toISOString();
        normalizedCount++;

        this.operations.push({
          type: 'normalize',
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
   * Normalize namespaces
   */
  normalizeNamespaces() {
    console.log('Normalizing namespaces...');
    
    let normalizedCount = 0;

    for (const [id, symbol] of this.symbolTable) {
      const oldNamespace = symbol.namespace;
      const newNamespace = this.normalizeNamespace(symbol.namespace);
      
      if (oldNamespace !== newNamespace) {
        symbol.namespace = newNamespace;
        symbol.updatedAt = new Date().toISOString();
        normalizedCount++;

        this.operations.push({
          type: 'normalize_namespace',
          id,
          oldNamespace,
          newNamespace,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`Normalized ${normalizedCount} namespaces`);
    return normalizedCount;
  }

  /**
   * Normalize namespace string
   */
  normalizeNamespace(ns) {
    if (!ns) return 'global';
    return ns.toLowerCase().replace(/[^a-z0-9.]/g, '.');
  }

  /**
   * Update versions
   */
  updateVersions() {
    console.log('Updating versions...');
    
    let updatedCount = 0;

    for (const [id, symbol] of this.symbolTable) {
      const oldVersion = symbol.version;
      const newVersion = this.incrementVersion(oldVersion);
      
      if (oldVersion !== newVersion) {
        symbol.version = newVersion;
        symbol.updatedAt = new Date().toISOString();
        updatedCount++;

        this.operations.push({
          type: 'update_version',
          id,
          oldVersion,
          newVersion,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`Updated ${updatedCount} versions`);
    return updatedCount;
  }

  /**
   * Increment version
   */
  incrementVersion(version) {
    if (!version) return '1.0.0';
    
    const parts = version.split('.').map(Number);
    if (parts.length === 3) {
      parts[2]++; // Increment patch version
      return parts.join('.');
    }
    
    return '1.0.0';
  }

  /**
   * Apply refactoring operations
   */
  applyOperations() {
    console.log('Applying refactoring operations...');
    
    for (const op of this.operations) {
      try {
        switch (op.type) {
          case 'merge':
            this.applyMerge(op);
            break;
          case 'rename':
            // Already applied in renameSymbol
            break;
          case 'move':
            // Already applied in moveSymbol
            break;
          case 'delete':
            // Already applied in deleteSymbol
            break;
          case 'update_references':
            // Already applied in updateReferences
            break;
          case 'normalize':
            // Already applied in normalizeIdentifiers
            break;
          case 'normalize_namespace':
            // Already applied in normalizeNamespaces
            break;
          case 'update_version':
            // Already applied in updateVersions
            break;
        }
        
        this.appliedOperations.push(op);
      } catch (e) {
        console.error(`Error applying operation ${op.type}: ${e.message}`);
      }
    }

    console.log(`Applied ${this.appliedOperations.length} operations`);
  }

  /**
   * Apply merge operation
   */
  applyMerge(op) {
    const primary = this.symbolTable.get(op.primaryId);
    const duplicate = this.symbolTable.get(op.duplicateId);
    
    if (!primary || !duplicate) {
      return;
    }

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

    // Remove duplicate
    this.symbolTable.delete(op.duplicateId);
  }

  /**
   * Helper: Convert to PascalCase
   */
  toPascalCase(str) {
    if (!str) return '';
    return str.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c.toUpperCase());
  }

  /**
   * Generate refactoring report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalOperations: this.operations.length,
        appliedOperations: this.appliedOperations.length,
        byType: {}
      },
      operations: this.operations,
      appliedOperations: this.appliedOperations
    };

    for (const op of this.operations) {
      if (!report.summary.byType[op.type]) {
        report.summary.byType[op.type] = 0;
      }
      report.summary.byType[op.type]++;
    }

    return report;
  }

  /**
   * Save refactored symbol table
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

    console.log(`Refactored symbol table saved to ${outputPath}`);
  }

  /**
   * Save report to file
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`Refactoring report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const symbolTablePath = process.argv[3] || join(rootPath, 'BLUEPRINT_SYMBOL_TABLE.json');
  const semanticGraphPath = process.argv[4] || join(rootPath, 'BLUEPRINT_SEMANTIC_GRAPH.json');
  const outputPath = process.argv[5] || join(rootPath, 'BLUEPRINT_REFACTORED_SYMBOL_TABLE.json');
  const reportPath = process.argv[6] || join(rootPath, 'BLUEPRINT_REFACTORING_REPORT.json');
  
  const engine = new RefactoringEngine(symbolTablePath, semanticGraphPath);

  console.log('Starting Refactoring Engine...');
  engine.loadSymbolTable();
  engine.loadSemanticGraph();

  console.log('\nRunning refactoring operations...');
  
  // Normalize identifiers
  engine.normalizeIdentifiers();
  
  // Normalize namespaces
  engine.normalizeNamespaces();
  
  // Update versions
  engine.updateVersions();
  
  // Merge duplicates
  engine.mergeDuplicates();

  console.log('\nApplying operations...');
  engine.applyOperations();

  console.log('\nSaving refactored symbol table...');
  await engine.saveSymbolTable(outputPath);

  console.log('Generating report...');
  engine.saveReport(reportPath);

  console.log('\n=== REFACTORING SUMMARY ===');
  const report = engine.generateReport();
  console.log(`Total Operations: ${report.summary.totalOperations}`);
  console.log(`Applied Operations: ${report.summary.appliedOperations}`);
  console.log('\nBy Type:');
  for (const [type, count] of Object.entries(report.summary.byType)) {
    console.log(`  ${type}: ${count}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RefactoringEngine };
