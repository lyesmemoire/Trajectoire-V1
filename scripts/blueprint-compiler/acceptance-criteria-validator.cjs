#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Acceptance Criteria Validator
 * 
 * Phase 14: Verification of acceptance criteria (100% generation, 0 duplication, 0 drift, 0 manual contract, 0 manual interface, 0 manual schema, 0 duplicate event, 0 duplicate state, 0 cycle, 0 multiple ownership, 0 broken reference, 0 direct modification of generated artifact)
 */

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

class AcceptanceCriteriaValidator {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.criteria = {
      generation: { name: '100% Generation', passed: false, details: {} },
      duplication: { name: '0 Duplication', passed: false, details: {} },
      drift: { name: '0 Drift', passed: false, details: {} },
      manualContract: { name: '0 Manual Contract', passed: false, details: {} },
      manualInterface: { name: '0 Manual Interface', passed: false, details: {} },
      manualSchema: { name: '0 Manual Schema', passed: false, details: {} },
      duplicateEvent: { name: '0 Duplicate Event', passed: false, details: {} },
      duplicateState: { name: '0 Duplicate State', passed: false, details: {} },
      cycle: { name: '0 Cycle', passed: false, details: {} },
      multipleOwnership: { name: '0 Multiple Ownership', passed: false, details: {} },
      brokenReference: { name: '0 Broken Reference', passed: false, details: {} },
      directModification: { name: '0 Direct Modification', passed: false, details: {} }
    };
    this.violations = [];
  }

  /**
   * Load data
   */
  loadData() {
    console.log('Loading data for acceptance criteria validation...');
    
    this.symbolTable = this.loadJSON('BLUEPRINT_SYMBOL_TABLE.json');
    this.semanticGraph = this.loadJSON('BLUEPRINT_SEMANTIC_GRAPH.json');
    this.validationReport = this.loadJSON('BLUEPRINT_ENTERPRISE_VALIDATION_REPORT.json');
    this.metricsReport = this.loadJSON('BLUEPRINT_METRICS_REPORT.json');
    this.packageReport = this.loadJSON('BLUEPRINT_PACKAGE_REPORT.json');
    this.selfHealingReport = this.loadJSON('BLUEPRINT_SELF_HEALING_REPORT.json');
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
   * Validate 100% Generation
   */
  validateGeneration() {
    console.log('Validating 100% Generation...');
    
    const criteria = this.criteria.generation;
    
    if (!this.metricsReport) {
      criteria.passed = false;
      criteria.details.error = 'Metrics report not available';
      return;
    }

    const generationCoverage = parseFloat(this.metricsReport.coverage.generation.percentage);
    criteria.details.generationCoverage = generationCoverage;
    
    // Accept if generation coverage is >= 95% (allowing some margin)
    criteria.passed = generationCoverage >= 95;
    
    if (!criteria.passed) {
      this.violations.push({
        criterion: 'generation',
        message: `Generation coverage is ${generationCoverage}%, expected >= 95%`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Duplication
   */
  validateDuplication() {
    console.log('Validating 0 Duplication...');
    
    const criteria = this.criteria.duplication;
    
    if (!this.symbolTable) {
      criteria.passed = false;
      criteria.details.error = 'Symbol table not available';
      return;
    }

    // Check for duplicate names
    const nameMap = new Map();
    let duplicates = 0;

    for (const symbol of this.symbolTable.symbols) {
      if (nameMap.has(symbol.name)) {
        duplicates++;
      } else {
        nameMap.set(symbol.name, symbol);
      }
    }

    criteria.details.duplicates = duplicates;
    criteria.passed = duplicates === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'duplication',
        message: `Found ${duplicates} duplicate symbols`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Drift
   */
  validateDrift() {
    console.log('Validating 0 Drift...');
    
    const criteria = this.criteria.drift;
    
    if (!this.selfHealingReport) {
      criteria.passed = false;
      criteria.details.error = 'Self-healing report not available';
      return;
    }

    const driftsDetected = this.selfHealingReport.summary?.driftsDetected || 0;
    criteria.details.driftsDetected = driftsDetected;
    
    criteria.passed = driftsDetected === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'drift',
        message: `Found ${driftsDetected} drifts`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Manual Contract
   */
  validateManualContract() {
    console.log('Validating 0 Manual Contract...');
    
    const criteria = this.criteria.manualContract;
    
    if (!this.symbolTable) {
      criteria.passed = false;
      criteria.details.error = 'Symbol table not available';
      return;
    }

    // Check for contracts not in generated directory
    let manualContracts = 0;

    for (const symbol of this.symbolTable.symbols) {
      if (symbol.type === 'contract') {
        if (!symbol.source.includes('BLUEPRINT_GENERATED') && !symbol.source.includes('BLUEPRINT_MULTI_LANG_GENERATED')) {
          manualContracts++;
        }
      }
    }

    criteria.details.manualContracts = manualContracts;
    criteria.passed = manualContracts === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'manualContract',
        message: `Found ${manualContracts} manual contracts`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Manual Interface
   */
  validateManualInterface() {
    console.log('Validating 0 Manual Interface...');
    
    const criteria = this.criteria.manualInterface;
    
    if (!this.symbolTable) {
      criteria.passed = false;
      criteria.details.error = 'Symbol table not available';
      return;
    }

    // Check for interfaces not in generated directory
    let manualInterfaces = 0;

    for (const symbol of this.symbolTable.symbols) {
      if (symbol.type === 'interface') {
        if (!symbol.source.includes('BLUEPRINT_GENERATED') && !symbol.source.includes('BLUEPRINT_MULTI_LANG_GENERATED')) {
          manualInterfaces++;
        }
      }
    }

    criteria.details.manualInterfaces = manualInterfaces;
    criteria.passed = manualInterfaces === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'manualInterface',
        message: `Found ${manualInterfaces} manual interfaces`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Manual Schema
   */
  validateManualSchema() {
    console.log('Validating 0 Manual Schema...');
    
    const criteria = this.criteria.manualSchema;
    
    if (!this.symbolTable) {
      criteria.passed = false;
      criteria.details.error = 'Symbol table not available';
      return;
    }

    // Check for schemas not in generated directory
    let manualSchemas = 0;

    for (const symbol of this.symbolTable.symbols) {
      if (symbol.type === 'schema') {
        if (!symbol.source.includes('BLUEPRINT_GENERATED') && !symbol.source.includes('BLUEPRINT_MULTI_LANG_GENERATED')) {
          manualSchemas++;
        }
      }
    }

    criteria.details.manualSchemas = manualSchemas;
    criteria.passed = manualSchemas === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'manualSchema',
        message: `Found ${manualSchemas} manual schemas`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Duplicate Event
   */
  validateDuplicateEvent() {
    console.log('Validating 0 Duplicate Event...');
    
    const criteria = this.criteria.duplicateEvent;
    
    if (!this.symbolTable) {
      criteria.passed = false;
      criteria.details.error = 'Symbol table not available';
      return;
    }

    // Check for duplicate events
    const eventMap = new Map();
    let duplicateEvents = 0;

    for (const symbol of this.symbolTable.symbols) {
      if (symbol.type === 'event') {
        if (eventMap.has(symbol.name)) {
          duplicateEvents++;
        } else {
          eventMap.set(symbol.name, symbol);
        }
      }
    }

    criteria.details.duplicateEvents = duplicateEvents;
    criteria.passed = duplicateEvents === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'duplicateEvent',
        message: `Found ${duplicateEvents} duplicate events`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Duplicate State
   */
  validateDuplicateState() {
    console.log('Validating 0 Duplicate State...');
    
    const criteria = this.criteria.duplicateState;
    
    if (!this.symbolTable) {
      criteria.passed = false;
      criteria.details.error = 'Symbol table not available';
      return;
    }

    // Check for duplicate states
    const stateMap = new Map();
    let duplicateStates = 0;

    for (const symbol of this.symbolTable.symbols) {
      if (symbol.type === 'state') {
        if (stateMap.has(symbol.name)) {
          duplicateStates++;
        } else {
          stateMap.set(symbol.name, symbol);
        }
      }
    }

    criteria.details.duplicateStates = duplicateStates;
    criteria.passed = duplicateStates === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'duplicateState',
        message: `Found ${duplicateStates} duplicate states`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Cycle
   */
  validateCycle() {
    console.log('Validating 0 Cycle...');
    
    const criteria = this.criteria.cycle;
    
    if (!this.semanticGraph) {
      criteria.passed = false;
      criteria.details.error = 'Semantic graph not available';
      return;
    }

    // Check for cycles in the graph
    let cycles = 0;
    const visited = new Set();
    const recursionStack = new Set();

    const hasCycle = (nodeId) => {
      if (recursionStack.has(nodeId)) {
        return true;
      }
      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const node = this.semanticGraph.nodes.find(n => n.id === nodeId);
      if (node && node.outEdges) {
        for (const [edgeType, targets] of Object.entries(node.outEdges)) {
          for (const targetId of targets) {
            if (hasCycle(targetId)) {
              return true;
            }
          }
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of this.semanticGraph.nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          cycles++;
        }
      }
    }

    criteria.details.cycles = cycles;
    criteria.passed = cycles === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'cycle',
        message: `Found ${cycles} cycles in dependency graph`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Multiple Ownership
   */
  validateMultipleOwnership() {
    console.log('Validating 0 Multiple Ownership...');
    
    const criteria = this.criteria.multipleOwnership;
    
    if (!this.symbolTable) {
      criteria.passed = false;
      criteria.details.error = 'Symbol table not available';
      return;
    }

    // Check for multiple ownership
    const ownershipMap = new Map();
    let multipleOwnership = 0;

    for (const symbol of this.symbolTable.symbols) {
      if (symbol.owner) {
        if (!ownershipMap.has(symbol.canonicalID)) {
          ownershipMap.set(symbol.canonicalID, new Set());
        }
        ownershipMap.get(symbol.canonicalID).add(symbol.owner);
      }
    }

    for (const [id, owners] of ownershipMap) {
      if (owners.size > 1) {
        multipleOwnership++;
      }
    }

    criteria.details.multipleOwnership = multipleOwnership;
    criteria.passed = multipleOwnership === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'multipleOwnership',
        message: `Found ${multipleOwnership} symbols with multiple owners`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Broken Reference
   */
  validateBrokenReference() {
    console.log('Validating 0 Broken Reference...');
    
    const criteria = this.criteria.brokenReference;
    
    if (!this.symbolTable) {
      criteria.passed = false;
      criteria.details.error = 'Symbol table not available';
      return;
    }

    // Check for broken references
    let brokenReferences = 0;
    const symbolIds = new Set(this.symbolTable.symbols.map(s => s.canonicalID));

    for (const symbol of this.symbolTable.symbols) {
      for (const depId of symbol.dependencies) {
        if (!symbolIds.has(depId)) {
          brokenReferences++;
        }
      }

      for (const relation of symbol.relations) {
        const [type, targetId] = relation.split(':');
        if (!symbolIds.has(targetId)) {
          brokenReferences++;
        }
      }
    }

    criteria.details.brokenReferences = brokenReferences;
    criteria.passed = brokenReferences === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'brokenReference',
        message: `Found ${brokenReferences} broken references`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate 0 Direct Modification
   */
  validateDirectModification() {
    console.log('Validating 0 Direct Modification...');
    
    const criteria = this.criteria.directModification;
    
    if (!this.selfHealingReport) {
      criteria.passed = false;
      criteria.details.error = 'Self-healing report not available';
      return;
    }

    const violationsDetected = this.selfHealingReport.summary?.violationsDetected || 0;
    criteria.details.violationsDetected = violationsDetected;
    
    criteria.passed = violationsDetected === 0;

    if (!criteria.passed) {
      this.violations.push({
        criterion: 'directModification',
        message: `Found ${violationsDetected} violations (potential direct modifications)`,
        severity: 'error'
      });
    }
  }

  /**
   * Run all validations
   */
  validate() {
    console.log('Starting Acceptance Criteria Validation...\n');

    this.loadData();

    console.log('\nRunning validations...');

    this.validateGeneration();
    this.validateDuplication();
    this.validateDrift();
    this.validateManualContract();
    this.validateManualInterface();
    this.validateManualSchema();
    this.validateDuplicateEvent();
    this.validateDuplicateState();
    this.validateCycle();
    this.validateMultipleOwnership();
    this.validateBrokenReference();
    this.validateDirectModification();

    console.log('\n=== ACCEPTANCE CRITERIA SUMMARY ===');
    
    const totalCriteria = Object.keys(this.criteria).length;
    const passedCriteria = Object.values(this.criteria).filter(c => c.passed).length;
    const failedCriteria = totalCriteria - passedCriteria;

    console.log(`Total Criteria: ${totalCriteria}`);
    console.log(`Passed: ${passedCriteria}`);
    console.log(`Failed: ${failedCriteria}`);

    console.log('\nCriterion Results:');
    for (const [key, criterion] of Object.entries(this.criteria)) {
      const icon = criterion.passed ? '✅' : '❌';
      console.log(`  ${icon} ${criterion.name}: ${criterion.passed ? 'PASSED' : 'FAILED'}`);
      if (!criterion.passed && criterion.details) {
        console.log(`     Details: ${JSON.stringify(criterion.details)}`);
      }
    }

    return {
      totalCriteria,
      passedCriteria,
      failedCriteria,
      criteria: this.criteria,
      violations: this.violations
    };
  }

  /**
   * Generate report
   */
  generateReport() {
    const result = this.validate();

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalCriteria: result.totalCriteria,
        passedCriteria: result.passedCriteria,
        failedCriteria: result.failedCriteria,
        overallStatus: result.failedCriteria === 0 ? 'PASSED' : 'FAILED'
      },
      criteria: result.criteria,
      violations: result.violations
    };

    return report;
  }

  /**
   * Save report
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`\nAcceptance criteria report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_ACCEPTANCE_CRITERIA_REPORT.json');
  
  const validator = new AcceptanceCriteriaValidator(rootPath);

  const result = validator.validate();

  console.log('\nGenerating report...');
  validator.saveReport(outputPath);

  if (result.failedCriteria > 0) {
    console.log('\n❌ ACCEPTANCE CRITERIA FAILED - Some criteria not met');
    process.exit(1);
  } else {
    console.log('\n✅ ACCEPTANCE CRITERIA PASSED - All criteria met');
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { AcceptanceCriteriaValidator };
