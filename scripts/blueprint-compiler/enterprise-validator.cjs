#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Validator
 * 
 * Phase 10: Validator operating on AST (Objects, Contracts, Relations, Ownership, Dependencies, Events, States, Runtime, Knowledge, Execution)
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

class EnterpriseValidator {
  constructor(astPath, symbolTablePath, semanticGraphPath) {
    this.astPath = astPath;
    this.symbolTablePath = symbolTablePath;
    this.semanticGraphPath = semanticGraphPath;
    this.ast = null;
    this.symbolTable = null;
    this.semanticGraph = null;
    this.violations = [];
  }

  /**
   * Load AST
   */
  loadAST() {
    const data = JSON.parse(readFileSync(this.astPath, 'utf-8'));
    this.ast = new Map(data.nodes.map(n => [`${n.type}:${n.name}`, n]));
    console.log(`Loaded AST with ${this.ast.size} nodes`);
  }

  /**
   * Load symbol table
   */
  loadSymbolTable() {
    const data = JSON.parse(readFileSync(this.symbolTablePath, 'utf-8'));
    this.symbolTable = new Map(data.symbols.map(s => [s.canonicalID, s]));
    console.log(`Loaded symbol table with ${this.symbolTable.size} symbols`);
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
    console.log(`Loaded semantic graph with ${this.semanticGraph.nodes.size} nodes and ${this.semanticGraph.edges.size} edges`);
  }

  /**
   * Validate Objects
   */
  validateObjects() {
    console.log('Validating Objects...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      if (symbol.type === 'object') {
        // Check if object has required properties
        if (!symbol.name) {
          this.violations.push({
            type: 'object_validation',
            id,
            message: 'Object missing name',
            severity: 'error'
          });
          violations++;
        }

        // Check if object has owner
        if (!symbol.owner) {
          this.violations.push({
            type: 'object_validation',
            id,
            message: 'Object missing owner',
            severity: 'warning'
          });
          violations++;
        }

        // Check if object has layer
        if (!symbol.layer || symbol.layer === 'UNKNOWN') {
          this.violations.push({
            type: 'object_validation',
            id,
            message: 'Object missing valid layer',
            severity: 'warning'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} object violations`);
    return violations;
  }

  /**
   * Validate Contracts
   */
  validateContracts() {
    console.log('Validating Contracts...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      if (symbol.type === 'contract') {
        // Check if contract has required properties
        if (!symbol.name) {
          this.violations.push({
            type: 'contract_validation',
            id,
            message: 'Contract missing name',
            severity: 'error'
          });
          violations++;
        }

        // Check if contract has owner
        if (!symbol.owner) {
          this.violations.push({
            type: 'contract_validation',
            id,
            message: 'Contract missing owner',
            severity: 'error'
          });
          violations++;
        }

        // Check if contract is in canonical directory
        if (!symbol.source.includes('contracts/')) {
          this.violations.push({
            type: 'contract_validation',
            id,
            message: 'Contract not in canonical directory',
            severity: 'error'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} contract violations`);
    return violations;
  }

  /**
   * Validate Relations
   */
  validateRelations() {
    console.log('Validating Relations...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      // Check for circular relations
      for (const relation of symbol.relations) {
        const [type, targetId] = relation.split(':');
        
        if (this.hasCircularRelation(id, targetId)) {
          this.violations.push({
            type: 'relation_validation',
            id,
            relation,
            message: 'Circular relation detected',
            severity: 'error'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} relation violations`);
    return violations;
  }

  /**
   * Check for circular relation
   */
  hasCircularRelation(sourceId, targetId) {
    if (sourceId === targetId) {
      return true;
    }

    const targetSymbol = this.symbolTable.get(targetId);
    if (!targetSymbol) {
      return false;
    }

    for (const relation of targetSymbol.relations) {
      const [type, nextTargetId] = relation.split(':');
      if (nextTargetId === sourceId) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate Ownership
   */
  validateOwnership() {
    console.log('Validating Ownership...');
    let violations = 0;

    const ownershipMap = new Map();

    for (const [id, symbol] of this.symbolTable) {
      if (symbol.owner) {
        if (!ownershipMap.has(symbol.owner)) {
          ownershipMap.set(symbol.owner, new Set());
        }
        ownershipMap.get(symbol.owner).add(id);
      }
    }

    // Check for multiple ownership (should not happen with canonical model)
    for (const [id, symbol] of this.symbolTable) {
      if (symbol.owner) {
        const owners = [];
        for (const [owner, ids] of ownershipMap) {
          if (ids.has(id)) {
            owners.push(owner);
          }
        }

        if (owners.length > 1) {
          this.violations.push({
            type: 'ownership_validation',
            id,
            owners,
            message: 'Multiple owners detected',
            severity: 'error'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} ownership violations`);
    return violations;
  }

  /**
   * Validate Dependencies
   */
  validateDependencies() {
    console.log('Validating Dependencies...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      for (const depId of symbol.dependencies) {
        // Check if dependency exists
        if (!this.symbolTable.has(depId)) {
          this.violations.push({
            type: 'dependency_validation',
            id,
            dependency: depId,
            message: 'Dependency does not exist',
            severity: 'error'
          });
          violations++;
        }

        // Check for circular dependencies
        if (this.hasCircularDependency(id, depId)) {
          this.violations.push({
            type: 'dependency_validation',
            id,
            dependency: depId,
            message: 'Circular dependency detected',
            severity: 'error'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} dependency violations`);
    return violations;
  }

  /**
   * Check for circular dependency
   */
  hasCircularDependency(sourceId, targetId, visited = new Set()) {
    if (sourceId === targetId) {
      return true;
    }

    if (visited.has(sourceId)) {
      return false;
    }

    visited.add(sourceId);

    const targetSymbol = this.symbolTable.get(targetId);
    if (!targetSymbol) {
      return false;
    }

    for (const depId of targetSymbol.dependencies) {
      if (this.hasCircularDependency(targetId, depId, visited)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate Events
   */
  validateEvents() {
    console.log('Validating Events...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      if (symbol.type === 'event') {
        // Check if event has required properties
        if (!symbol.name) {
          this.violations.push({
            type: 'event_validation',
            id,
            message: 'Event missing name',
            severity: 'error'
          });
          violations++;
        }

        // Check if event name follows convention
        if (!symbol.name.endsWith('Event') && !symbol.name.endsWith('Evt')) {
          this.violations.push({
            type: 'event_validation',
            id,
            message: 'Event name does not follow convention',
            severity: 'warning'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} event violations`);
    return violations;
  }

  /**
   * Validate States
   */
  validateStates() {
    console.log('Validating States...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      if (symbol.type === 'state') {
        // Check if state has required properties
        if (!symbol.name) {
          this.violations.push({
            type: 'state_validation',
            id,
            message: 'State missing name',
            severity: 'error'
          });
          violations++;
        }

        // Check if state name follows convention
        if (!symbol.name.endsWith('State') && !symbol.name.endsWith('Status')) {
          this.violations.push({
            type: 'state_validation',
            id,
            message: 'State name does not follow convention',
            severity: 'warning'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} state violations`);
    return violations;
  }

  /**
   * Validate Runtime
   */
  validateRuntime() {
    console.log('Validating Runtime...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      // Check if symbol has runtime metadata
      if (symbol.runtime) {
        // Validate runtime properties
        if (!symbol.runtime.version) {
          this.violations.push({
            type: 'runtime_validation',
            id,
            message: 'Runtime missing version',
            severity: 'warning'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} runtime violations`);
    return violations;
  }

  /**
   * Validate Knowledge
   */
  validateKnowledge() {
    console.log('Validating Knowledge...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      if (symbol.type === 'object' && symbol.name.includes('Knowledge')) {
        // Check if knowledge object has required properties
        if (!symbol.dependencies || symbol.dependencies.length === 0) {
          this.violations.push({
            type: 'knowledge_validation',
            id,
            message: 'Knowledge object missing dependencies',
            severity: 'warning'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} knowledge violations`);
    return violations;
  }

  /**
   * Validate Execution
   */
  validateExecution() {
    console.log('Validating Execution...');
    let violations = 0;

    for (const [id, symbol] of this.symbolTable) {
      if (symbol.type === 'algorithm') {
        // Check if algorithm has required properties
        if (!symbol.name) {
          this.violations.push({
            type: 'execution_validation',
            id,
            message: 'Algorithm missing name',
            severity: 'error'
          });
          violations++;
        }

        // Check if algorithm has dependencies
        if (!symbol.dependencies || symbol.dependencies.length === 0) {
          this.violations.push({
            type: 'execution_validation',
            id,
            message: 'Algorithm missing dependencies',
            severity: 'warning'
          });
          violations++;
        }
      }
    }

    console.log(`Found ${violations} execution violations`);
    return violations;
  }

  /**
   * Run all validations
   */
  validate() {
    console.log('Starting Enterprise Validator...\n');

    this.loadAST();
    this.loadSymbolTable();
    this.loadSemanticGraph();

    console.log('\nRunning validations...');

    this.validateObjects();
    this.validateContracts();
    this.validateRelations();
    this.validateOwnership();
    this.validateDependencies();
    this.validateEvents();
    this.validateStates();
    this.validateRuntime();
    this.validateKnowledge();
    this.validateExecution();

    console.log('\n=== VALIDATION SUMMARY ===');
    console.log(`Total Violations: ${this.violations.length}`);

    const byType = {};
    const bySeverity = { error: 0, warning: 0 };

    for (const violation of this.violations) {
      if (!byType[violation.type]) {
        byType[violation.type] = 0;
      }
      byType[violation.type]++;
      bySeverity[violation.severity]++;
    }

    console.log('\nBy Type:');
    for (const [type, count] of Object.entries(byType)) {
      console.log(`  ${type}: ${count}`);
    }

    console.log('\nBy Severity:');
    console.log(`  Error: ${bySeverity.error}`);
    console.log(`  Warning: ${bySeverity.warning}`);

    return {
      totalViolations: this.violations.length,
      byType,
      bySeverity,
      violations: this.violations
    };
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const result = this.validate();

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalViolations: result.totalViolations,
        byType: result.byType,
        bySeverity: result.bySeverity
      },
      violations: result.violations
    };

    return report;
  }

  /**
   * Save report to file
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`\nValidation report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const astPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CANONICAL_AST.json');
  const symbolTablePath = process.argv[4] || join(rootPath, 'BLUEPRINT_SYMBOL_TABLE.json');
  const semanticGraphPath = process.argv[5] || join(rootPath, 'BLUEPRINT_SEMANTIC_GRAPH.json');
  const outputPath = process.argv[6] || join(rootPath, 'BLUEPRINT_ENTERPRISE_VALIDATION_REPORT.json');
  
  const validator = new EnterpriseValidator(astPath, symbolTablePath, semanticGraphPath);

  const result = validator.validate();

  console.log('\nSaving report...');
  validator.saveReport(outputPath);

  if (result.totalViolations > 0) {
    console.log('\n❌ VALIDATION FAILED - Violations detected');
    process.exit(1);
  } else {
    console.log('\n✅ VALIDATION PASSED - No violations');
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { EnterpriseValidator };
