#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Dependency Checker
 * 
 * Phase 7: Reconstruct dependency graphs, ensure no cycles
 */

const { readFileSync } = require('fs');
const { join, dirname, relative } = require('path');

class DependencyChecker {
  constructor(indexPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.dependencyGraph = new Map();
    this.cycles = [];
    this.dependencies = [];
  }

  /**
   * Build dependency graph from imports
   */
  buildDependencyGraph() {
    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      
      for (const loc of locations) {
        if (loc.imports && loc.imports.length > 0) {
          const sourceFile = loc.location;
          
          for (const imp of loc.imports) {
            // Resolve the import to a file path
            const targetFile = this.resolveImport(sourceFile, imp);
            
            if (targetFile) {
              if (!this.dependencyGraph.has(sourceFile)) {
                this.dependencyGraph.set(sourceFile, new Set());
              }
              this.dependencyGraph.get(sourceFile).add(targetFile);
              
              this.dependencies.push({
                source: sourceFile,
                target: targetFile,
                type: 'import'
              });
            }
          }
        }
      }
    }

    return this.dependencyGraph;
  }

  /**
   * Resolve import path to file path
   */
  resolveImport(sourceFile, importPath) {
    const sourceDir = dirname(sourceFile);
    const rootPath = process.cwd();
    
    // Try to resolve relative imports
    if (importPath.startsWith('.')) {
      const resolvedPath = join(sourceDir, importPath);
      
      // Try different extensions
      const extensions = ['.ts', '.tsx', '.js', '.json'];
      for (const ext of extensions) {
        const fullPath = resolvedPath + ext;
        if (this.fileExists(fullPath)) {
          return fullPath;
        }
      }
      
      // Try index files
      const indexPath = join(resolvedPath, 'index.ts');
      if (this.fileExists(indexPath)) {
        return indexPath;
      }
    }
    
    // Try absolute imports from root
    const absolutePath = join(rootPath, importPath);
    const extensions = ['.ts', '.tsx', '.js', '.json'];
    for (const ext of extensions) {
      const fullPath = absolutePath + ext;
      if (this.fileExists(fullPath)) {
        return fullPath;
      }
    }
    
    return null;
  }

  /**
   * Check if file exists
   */
  fileExists(filePath) {
    try {
      const { statSync } = require('fs');
      return statSync(filePath).isFile();
    } catch (e) {
      return false;
    }
  }

  /**
   * Detect cycles using DFS
   */
  detectCycles() {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];

    const dfs = (node, path) => {
      if (recursionStack.has(node)) {
        // Found a cycle
        const cycleStart = path.indexOf(node);
        const cycle = path.slice(cycleStart).concat([node]);
        cycles.push(cycle);
        return;
      }

      if (visited.has(node)) {
        return;
      }

      visited.add(node);
      recursionStack.add(node);

      const neighbors = this.dependencyGraph.get(node) || new Set();
      for (const neighbor of neighbors) {
        dfs(neighbor, [...path, node]);
      }

      recursionStack.delete(node);
    };

    for (const node of this.dependencyGraph.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    this.cycles = cycles;
    return cycles;
  }

  /**
   * Generate dependency report
   */
  generateReport() {
    const report = {
      summary: {
        totalDependencies: this.dependencies.length,
        totalNodes: this.dependencyGraph.size,
        totalCycles: this.cycles.length
      },
      dependencies: this.dependencies,
      cycles: this.cycles
    };

    return report;
  }

  /**
   * Save report to file
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    const { writeFileSync } = require('fs');
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`Dependency report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const outputPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_DEPENDENCY_REPORT.json');
  
  const checker = new DependencyChecker(indexPath);

  console.log('Building dependency graph...');
  checker.buildDependencyGraph();
  console.log(`Built graph with ${checker.dependencyGraph.size} nodes and ${checker.dependencies.length} dependencies`);

  console.log('Detecting cycles...');
  checker.detectCycles();
  console.log(`Found ${checker.cycles.length} cycles`);

  console.log('Generating report...');
  const report = checker.generateReport();

  console.log('\n=== SUMMARY ===');
  console.log(`Total Dependencies: ${report.summary.totalDependencies}`);
  console.log(`Total Nodes: ${report.summary.totalNodes}`);
  console.log(`Total Cycles: ${report.summary.totalCycles}`);

  if (report.summary.totalCycles > 0) {
    console.log('\n=== CYCLES DETECTED ===');
    for (const cycle of checker.cycles) {
      console.log('\nCycle:');
      for (const node of cycle) {
        console.log(`  - ${node}`);
      }
    }
  } else {
    console.log('\n✅ No cycles detected - dependency graph is acyclic');
  }

  console.log('\nSaving report...');
  checker.saveReport(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DependencyChecker };
