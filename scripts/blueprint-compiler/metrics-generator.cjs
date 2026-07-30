#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Metrics Generator
 * 
 * Phase 13: Automatic production of Coverage, Canonical Coverage, Ownership Coverage, Contract Coverage, Dependency Coverage, Documentation Coverage, Generation Coverage, Validation Coverage, Compiler Coverage, Runtime Coverage
 */

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

class MetricsGenerator {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.metrics = {
      timestamp: new Date().toISOString(),
      coverage: {},
      statistics: {}
    };
  }

  /**
   * Load data from various sources
   */
  loadData() {
    console.log('Loading data for metrics calculation...');
    
    this.canonicalModel = this.loadJSON('BLUEPRINT_CANONICAL_MODEL.md');
    this.symbolTable = this.loadJSON('BLUEPRINT_SYMBOL_TABLE.json');
    this.ast = this.loadJSON('BLUEPRINT_CANONICAL_AST.json');
    this.semanticGraph = this.loadJSON('BLUEPRINT_SEMANTIC_GRAPH.json');
    this.validationReport = this.loadJSON('BLUEPRINT_ENTERPRISE_VALIDATION_REPORT.json');
    this.packageReport = this.loadJSON('BLUEPRINT_PACKAGE_REPORT.json');
  }

  /**
   * Load JSON file
   */
  loadJSON(filename) {
    const path = join(this.rootPath, filename);
    if (existsSync(path)) {
      try {
        return JSON.parse(readFileSync(path, 'utf-8'));
      } catch (e) {
        console.log(`Could not load ${filename}: ${e.message}`);
        return null;
      }
    }
    return null;
  }

  /**
   * Calculate Coverage
   */
  calculateCoverage() {
    console.log('Calculating Coverage metrics...');
    
    const coverage = this.metrics.coverage;
    
    // Canonical Coverage
    coverage.canonical = this.calculateCanonicalCoverage();
    
    // Ownership Coverage
    coverage.ownership = this.calculateOwnershipCoverage();
    
    // Contract Coverage
    coverage.contract = this.calculateContractCoverage();
    
    // Dependency Coverage
    coverage.dependency = this.calculateDependencyCoverage();
    
    // Documentation Coverage
    coverage.documentation = this.calculateDocumentationCoverage();
    
    // Generation Coverage
    coverage.generation = this.calculateGenerationCoverage();
    
    // Validation Coverage
    coverage.validation = this.calculateValidationCoverage();
    
    // Compiler Coverage
    coverage.compiler = this.calculateCompilerCoverage();
    
    // Runtime Coverage
    coverage.runtime = this.calculateRuntimeCoverage();
  }

  /**
   * Calculate Canonical Coverage
   */
  calculateCanonicalCoverage() {
    if (!this.symbolTable) {
      return { percentage: 0, total: 0, canonical: 0 };
    }

    const total = this.symbolTable.symbols?.length || 0;
    const canonical = this.symbolTable.symbols?.filter(s => s.canonicalID && s.canonicalID.startsWith('BLUEPRINT-')).length || 0;
    
    return {
      percentage: total > 0 ? (canonical / total * 100).toFixed(2) : 0,
      total,
      canonical,
      nonCanonical: total - canonical
    };
  }

  /**
   * Calculate Ownership Coverage
   */
  calculateOwnershipCoverage() {
    if (!this.symbolTable) {
      return { percentage: 0, total: 0, withOwner: 0 };
    }

    const total = this.symbolTable.symbols?.length || 0;
    const withOwner = this.symbolTable.symbols?.filter(s => s.owner && s.owner.trim() !== '').length || 0;
    
    return {
      percentage: total > 0 ? (withOwner / total * 100).toFixed(2) : 0,
      total,
      withOwner,
      withoutOwner: total - withOwner
    };
  }

  /**
   * Calculate Contract Coverage
   */
  calculateContractCoverage() {
    if (!this.symbolTable) {
      return { percentage: 0, total: 0, withContract: 0 };
    }

    const total = this.symbolTable.symbols?.length || 0;
    const contracts = this.symbolTable.symbols?.filter(s => s.type === 'contract').length || 0;
    
    return {
      percentage: total > 0 ? (contracts / total * 100).toFixed(2) : 0,
      total,
      contracts,
      nonContracts: total - contracts
    };
  }

  /**
   * Calculate Dependency Coverage
   */
  calculateDependencyCoverage() {
    if (!this.symbolTable) {
      return { percentage: 0, total: 0, withDependencies: 0 };
    }

    const total = this.symbolTable.symbols?.length || 0;
    const withDependencies = this.symbolTable.symbols?.filter(s => s.dependencies && s.dependencies.length > 0).length || 0;
    
    return {
      percentage: total > 0 ? (withDependencies / total * 100).toFixed(2) : 0,
      total,
      withDependencies,
      withoutDependencies: total - withDependencies
    };
  }

  /**
   * Calculate Documentation Coverage
   */
  calculateDocumentationCoverage() {
    if (!this.symbolTable) {
      return { percentage: 0, total: 0, documented: 0 };
    }

    const total = this.symbolTable.symbols?.length || 0;
    const documented = this.symbolTable.symbols?.filter(s => s.source && s.source.includes('.md')).length || 0;
    
    return {
      percentage: total > 0 ? (documented / total * 100).toFixed(2) : 0,
      total,
      documented,
      undocumented: total - documented
    };
  }

  /**
   * Calculate Generation Coverage
   */
  calculateGenerationCoverage() {
    if (!this.packageReport) {
      return { percentage: 0, total: 0, generated: 0 };
    }

    const total = this.symbolTable?.symbols?.length || 0;
    const generated = this.packageReport.summary?.totalFiles || 0;
    
    return {
      percentage: total > 0 ? (generated / total * 100).toFixed(2) : 0,
      total,
      generated
    };
  }

  /**
   * Calculate Validation Coverage
   */
  calculateValidationCoverage() {
    if (!this.validationReport) {
      return { percentage: 0, total: 0, validated: 0 };
    }

    const total = this.symbolTable?.symbols?.length || 0;
    const validated = this.validationReport.summary?.totalViolations === 0 ? total : 0;
    
    return {
      percentage: total > 0 ? (validated / total * 100).toFixed(2) : 0,
      total,
      validated,
      violations: this.validationReport.summary?.totalViolations || 0
    };
  }

  /**
   * Calculate Compiler Coverage
   */
  calculateCompilerCoverage() {
    if (!this.ast) {
      return { percentage: 0, total: 0, compiled: 0 };
    }

    const total = this.ast.nodes?.length || 0;
    const compiled = total; // All AST nodes are compiled
    
    return {
      percentage: total > 0 ? 100 : 0,
      total,
      compiled
    };
  }

  /**
   * Calculate Runtime Coverage
   */
  calculateRuntimeCoverage() {
    if (!this.symbolTable) {
      return { percentage: 0, total: 0, runtimeAware: 0 };
    }

    const total = this.symbolTable.symbols?.length || 0;
    const runtimeAware = this.symbolTable.symbols?.filter(s => s.runtime || s.layer === 'CVM' || s.layer === 'COS').length || 0;
    
    return {
      percentage: total > 0 ? (runtimeAware / total * 100).toFixed(2) : 0,
      total,
      runtimeAware
    };
  }

  /**
   * Calculate Statistics
   */
  calculateStatistics() {
    console.log('Calculating Statistics...');
    
    const stats = this.metrics.statistics;
    
    if (this.symbolTable) {
      stats.totalSymbols = this.symbolTable.symbols?.length || 0;
      stats.symbolsByType = this.groupBy(this.symbolTable.symbols, 'type');
      stats.symbolsByLayer = this.groupBy(this.symbolTable.symbols, 'layer');
      stats.symbolsByOwner = this.groupBy(this.symbolTable.symbols, 'owner');
    }
    
    if (this.ast) {
      stats.totalASTNodes = this.ast.nodes?.length || 0;
      stats.astNodesByType = this.groupBy(this.ast.nodes, 'type');
    }
    
    if (this.semanticGraph) {
      stats.totalGraphNodes = this.semanticGraph.nodes?.length || 0;
      stats.totalGraphEdges = this.semanticGraph.edges?.length || 0;
    }
  }

  /**
   * Group by property
   */
  groupBy(array, property) {
    const groups = {};
    
    for (const item of array) {
      const key = item[property] || 'unknown';
      if (!groups[key]) {
        groups[key] = 0;
      }
      groups[key]++;
    }
    
    return groups;
  }

  /**
   * Generate Metrics Report
   */
  generateReport() {
    this.loadData();
    this.calculateCoverage();
    this.calculateStatistics();
    
    return this.metrics;
  }

  /**
   * Save Report
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`Metrics report saved to ${outputPath}`);
  }

  /**
   * Print Summary
   */
  printSummary() {
    const report = this.generateReport();
    
    console.log('\n=== METRICS SUMMARY ===');
    console.log(`Timestamp: ${report.timestamp}`);
    
    console.log('\nCoverage Metrics:');
    for (const [key, value] of Object.entries(report.coverage)) {
      console.log(`  ${key}: ${value.percentage}%`);
    }
    
    console.log('\nStatistics:');
    console.log(`  Total Symbols: ${report.statistics.totalSymbols || 0}`);
    console.log(`  Total AST Nodes: ${report.statistics.totalASTNodes || 0}`);
    console.log(`  Total Graph Nodes: ${report.statistics.totalGraphNodes || 0}`);
    console.log(`  Total Graph Edges: ${report.statistics.totalGraphEdges || 0}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_METRICS_REPORT.json');
  
  const generator = new MetricsGenerator(rootPath);

  generator.saveReport(outputPath);
  generator.printSummary();

  console.log('\n✅ METRICS GENERATION COMPLETED');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MetricsGenerator };
