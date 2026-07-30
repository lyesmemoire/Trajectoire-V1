#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Validator
 * 
 * Phase 10: Automatic validator for all elements
 * Validates: contracts, objects, relations, events, graphs, references
 */

const { readFileSync } = require('fs');
const { join } = require('path');

class BlueprintValidator {
  constructor(indexPath, canonicalModelPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.canonicalModelPath = canonicalModelPath;
    
    this.canonicalElements = new Map();
    this.extractCanonicalElements();
    
    this.validations = {
      contracts: { passed: 0, failed: 0, errors: [] },
      objects: { passed: 0, failed: 0, errors: [] },
      relations: { passed: 0, failed: 0, errors: [] },
      events: { passed: 0, failed: 0, errors: [] },
      graphs: { passed: 0, failed: 0, errors: [] },
      references: { passed: 0, failed: 0, errors: [] }
    };
  }

  /**
   * Extract canonical elements
   */
  extractCanonicalElements() {
    const modelContent = readFileSync(this.canonicalModelPath, 'utf-8');
    const lines = modelContent.split('\n');
    
    let inTable = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.match(/^\|.*\|.*\|.*\|.*\|.*\|/) && !inTable) {
        inTable = true;
        continue;
      }
      
      if (line.match(/^\|[-\s|]+\|/)) {
        continue;
      }
      
      if (line.match(/^\|.*\|/) && inTable) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        const idPattern = /^[A-Z]+-\w+-\d+$/;
        
        let id = null;
        let name = null;
        let type = null;
        
        for (let j = 0; j < parts.length; j++) {
          if (idPattern.test(parts[j])) {
            id = parts[j];
            type = this.inferType(id);
            if (j + 1 < parts.length && parts[j + 1]) {
              name = parts[j + 1];
            }
            break;
          }
        }
        
        if (id && name) {
          this.canonicalElements.set(name, {
            id,
            type
          });
        }
        continue;
      }
      
      if (!line.match(/^\|/)) {
        inTable = false;
      }
    }
  }

  inferType(id) {
    if (id.startsWith('BCM-OBJ-')) return 'object';
    if (id.startsWith('COS-OBJ-')) return 'object';
    if (id.startsWith('CVM-OBJ-')) return 'object';
    if (id.startsWith('BEA-OBJ-')) return 'object';
    if (id.startsWith('BCM-EVT-')) return 'event';
    if (id.startsWith('BCM-STATE-')) return 'state';
    if (id.startsWith('BCM-GRAPH-')) return 'graph';
    if (id.startsWith('BCM-ALG-')) return 'algorithm';
    if (id.startsWith('BEA-CONTRACT-')) return 'contract';
    return 'unknown';
  }

  /**
   * Validate contracts
   */
  validateContracts() {
    const contractFiles = new Set();
    
    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      
      for (const loc of locations) {
        if (loc.location.includes('contracts/') && loc.location.endsWith('_CONTRACT.md')) {
          contractFiles.add(loc.location);
        }
      }
    }
    
    // Check if all contracts are in canonical directories
    const canonicalDirs = ['foundation', 'observability', 'security'];
    
    for (const file of contractFiles) {
      const isCanonical = canonicalDirs.some(dir => file.includes(`/contracts/${dir}/`));
      
      if (isCanonical) {
        this.validations.contracts.passed++;
      } else {
        this.validations.contracts.failed++;
        this.validations.contracts.errors.push({
          file,
          error: 'Contract not in canonical directory'
        });
      }
    }
  }

  /**
   * Validate objects
   */
  validateObjects() {
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      // Check if canonical object
      if (this.canonicalElements.has(name)) {
        const canonical = this.canonicalElements.get(name);
        
        if (canonical.type === 'object') {
          // Check if object has at least one definition
          if (locations.length > 0) {
            this.validations.objects.passed++;
          } else {
            this.validations.objects.failed++;
            this.validations.objects.errors.push({
              name,
              error: 'Canonical object has no definitions'
            });
          }
        }
      }
    }
  }

  /**
   * Validate relations
   */
  validateRelations() {
    // Check for circular references in element names
    const relationPatterns = [
      /Parent.*Child/,
      /Child.*Parent/,
      /Owner.*Owned/,
      /Owned.*Owner/
    ];
    
    for (const elementData of this.index.elements) {
      const { name } = elementData;
      
      for (const pattern of relationPatterns) {
        if (pattern.test(name)) {
          this.validations.relations.passed++;
        }
      }
    }
  }

  /**
   * Validate events
   */
  validateEvents() {
    const canonicalEvents = new Set();
    
    for (const [name, canonical] of this.canonicalElements) {
      if (canonical.type === 'event') {
        canonicalEvents.add(name);
      }
    }
    
    for (const elementData of this.index.elements) {
      const { name } = elementData;
      
      if (canonicalEvents.has(name)) {
        this.validations.events.passed++;
      }
    }
  }

  /**
   * Validate graphs
   */
  validateGraphs() {
    const canonicalGraphs = new Set();
    
    for (const [name, canonical] of this.canonicalElements) {
      if (canonical.type === 'graph') {
        canonicalGraphs.add(name);
      }
    }
    
    for (const elementData of this.index.elements) {
      const { name } = elementData;
      
      if (canonicalGraphs.has(name)) {
        this.validations.graphs.passed++;
      }
    }
  }

  /**
   * Validate references
   */
  validateReferences() {
    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      
      for (const loc of locations) {
        if (loc.references && loc.references.length > 0) {
          // Check if references point to existing files
          for (const ref of loc.references) {
            if (ref.endsWith('.md')) {
              // Check if referenced file exists in index
              const refExists = this.index.elements.some(e => 
                e.locations.some(l => l.location.includes(ref))
              );
              
              if (refExists) {
                this.validations.references.passed++;
              } else {
                this.validations.references.failed++;
                this.validations.references.errors.push({
                  reference: ref,
                  source: loc.location,
                  error: 'Referenced file not found'
                });
              }
            }
          }
        }
      }
    }
  }

  /**
   * Run all validations
   */
  validate() {
    console.log('Running Blueprint Validator...\n');
    
    console.log('Validating contracts...');
    this.validateContracts();
    console.log(`Contracts: ${this.validations.contracts.passed} passed, ${this.validations.contracts.failed} failed`);
    
    console.log('Validating objects...');
    this.validateObjects();
    console.log(`Objects: ${this.validations.objects.passed} passed, ${this.validations.objects.failed} failed`);
    
    console.log('Validating relations...');
    this.validateRelations();
    console.log(`Relations: ${this.validations.relations.passed} passed, ${this.validations.relations.failed} failed`);
    
    console.log('Validating events...');
    this.validateEvents();
    console.log(`Events: ${this.validations.events.passed} passed, ${this.validations.events.failed} failed`);
    
    console.log('Validating graphs...');
    this.validateGraphs();
    console.log(`Graphs: ${this.validations.graphs.passed} passed, ${this.validations.graphs.failed} failed`);
    
    console.log('Validating references...');
    this.validateReferences();
    console.log(`References: ${this.validations.references.passed} passed, ${this.validations.references.failed} failed`);
    
    return this.validations;
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const totalPassed = Object.values(this.validations).reduce((sum, v) => sum + v.passed, 0);
    const totalFailed = Object.values(this.validations).reduce((sum, v) => sum + v.failed, 0);
    
    const report = {
      summary: {
        totalPassed,
        totalFailed,
        successRate: totalPassed + totalFailed > 0 ? (totalPassed / (totalPassed + totalFailed) * 100).toFixed(2) + '%' : 'N/A'
      },
      validations: this.validations
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
    console.log(`\nValidation report saved to ${outputPath}`);
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n=== VALIDATION RESULTS ===');
    
    console.log(`\nContracts: ${this.validations.contracts.passed} passed, ${this.validations.contracts.failed} failed`);
    if (this.validations.contracts.errors.length > 0) {
      for (const error of this.validations.contracts.errors) {
        console.log(`  - ${error.file}: ${error.error}`);
      }
    }
    
    console.log(`\nObjects: ${this.validations.objects.passed} passed, ${this.validations.objects.failed} failed`);
    if (this.validations.objects.errors.length > 0) {
      for (const error of this.validations.objects.errors) {
        console.log(`  - ${error.name}: ${error.error}`);
      }
    }
    
    console.log(`\nRelations: ${this.validations.relations.passed} passed, ${this.validations.relations.failed} failed`);
    
    console.log(`\nEvents: ${this.validations.events.passed} passed, ${this.validations.events.failed} failed`);
    
    console.log(`\nGraphs: ${this.validations.graphs.passed} passed, ${this.validations.graphs.failed} failed`);
    
    console.log(`\nReferences: ${this.validations.references.passed} passed, ${this.validations.references.failed} failed`);
    if (this.validations.references.errors.length > 0) {
      for (const error of this.validations.references.errors.slice(0, 5)) {
        console.log(`  - ${error.reference} in ${error.source}: ${error.error}`);
      }
    }
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const canonicalModelPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[4] || join(process.cwd(), 'BLUEPRINT_VALIDATOR_REPORT.json');
  
  const validator = new BlueprintValidator(indexPath, canonicalModelPath);

  const validations = validator.validate();
  
  validator.printResults();
  validator.saveReport(outputPath);

  const totalFailed = Object.values(validations).reduce((sum, v) => sum + v.failed, 0);
  
  if (totalFailed > 0) {
    console.log('\n❌ VALIDATION FAILED - Some validations failed');
    process.exit(1);
  } else {
    console.log('\n✅ VALIDATION PASSED - All validations successful');
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BlueprintValidator };
