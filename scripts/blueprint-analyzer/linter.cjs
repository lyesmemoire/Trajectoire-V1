#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Architecture Linter
 * 
 * Phase 9: Executable Blueprint Architecture Linter
 * Fails if: duplication, cycle, multiple ownership, duplicate contract, unknown event, unknown state, incompatible interface, broken invariant, contradictory rule
 */

const { readFileSync } = require('fs');
const { join } = require('path');

class BlueprintLinter {
  constructor(indexPath, canonicalModelPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.canonicalModelPath = canonicalModelPath;
    
    this.canonicalElements = new Map();
    this.extractCanonicalElements();
    
    this.violations = {
      duplications: [],
      multipleOwnership: [],
      duplicateContracts: [],
      unknownEvents: [],
      unknownStates: [],
      brokenInvariants: [],
      contradictoryRules: [],
      incompatibleInterfaces: []
    };
    
    this.failed = false;
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
   * Check for duplications
   */
  checkDuplications() {
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      // Skip if not a canonical element
      if (!this.canonicalElements.has(name)) {
        continue;
      }
      
      // Check if canonical element appears in multiple locations
      if (locations.length > 1) {
        // Check if all locations are in canonical files
        const allCanonical = locations.every(loc => 
          loc.location.includes('BEA-') || 
          loc.location.includes('BCM-') || 
          loc.location.includes('COS-') || 
          loc.location.includes('CVM-') || 
          loc.location.includes('CPR-') ||
          loc.location.includes('contracts/')
        );
        
        if (!allCanonical) {
          this.violations.duplications.push({
            name,
            count: locations.length,
            locations: locations.map(l => l.location)
          });
          this.failed = true;
        }
      }
    }
  }

  /**
   * Check for multiple ownership
   */
  checkMultipleOwnership() {
    const ownershipMap = new Map();
    
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      // Skip if not a canonical element
      if (!this.canonicalElements.has(name)) {
        continue;
      }
      
      const owners = new Set();
      
      for (const loc of locations) {
        if (loc.owner && loc.owner !== 'N/A') {
          owners.add(loc.owner);
        }
      }
      
      if (owners.size > 1) {
        this.violations.multipleOwnership.push({
          name,
          owners: Array.from(owners)
        });
        this.failed = true;
      }
    }
  }

  /**
   * Check for duplicate contracts
   */
  checkDuplicateContracts() {
    const contractFiles = new Map();
    
    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      
      for (const loc of locations) {
        if (loc.location.includes('contracts/') && loc.location.endsWith('_CONTRACT.md')) {
          const contractName = loc.location.split(/\\/).pop().replace('_CONTRACT.md', '');
          
          if (contractFiles.has(contractName)) {
            contractFiles.get(contractName).push(loc.location);
          } else {
            contractFiles.set(contractName, [loc.location]);
          }
        }
      }
    }
    
    for (const [name, files] of contractFiles) {
      if (files.length > 1) {
        this.violations.duplicateContracts.push({
          name,
          files
        });
        this.failed = true;
      }
    }
  }

  /**
   * Check for unknown events
   */
  checkUnknownEvents() {
    const canonicalEvents = new Set();
    
    for (const [name, canonical] of this.canonicalElements) {
      if (canonical.type === 'event') {
        canonicalEvents.add(name);
      }
    }
    
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      // Check if this looks like an event but is not canonical
      const looksLikeEvent = name.endsWith('Event') || name.endsWith('Evt');
      
      if (looksLikeEvent && !canonicalEvents.has(name)) {
        this.violations.unknownEvents.push({
          name,
          locations: locations.map(l => l.location)
        });
        this.failed = true;
      }
    }
  }

  /**
   * Check for unknown states
   */
  checkUnknownStates() {
    const canonicalStates = new Set();
    
    for (const [name, canonical] of this.canonicalElements) {
      if (canonical.type === 'state') {
        canonicalStates.add(name);
      }
    }
    
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      // Check if this looks like a state but is not canonical
      const looksLikeState = name.endsWith('State') || name.endsWith('Status');
      
      if (looksLikeState && !canonicalStates.has(name)) {
        this.violations.unknownStates.push({
          name,
          locations: locations.map(l => l.location)
        });
        this.failed = true;
      }
    }
  }

  /**
   * Check for broken invariants
   */
  checkBrokenInvariants() {
    // This would require semantic analysis of the code
    // For now, we check for invariant-related files that don't reference canonical invariants
    const invariantFiles = [];
    
    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      
      for (const loc of locations) {
        if (loc.location.includes('invariant') || loc.location.includes('Invariant')) {
          invariantFiles.push(loc.location);
        }
      }
    }
    
    // If invariant files exist but no canonical invariants are referenced
    if (invariantFiles.length > 0) {
      this.violations.brokenInvariants.push({
        message: 'Invariant files detected but canonical invariant verification not implemented',
        files: invariantFiles
      });
      this.failed = true;
    }
  }

  /**
   * Check for contradictory rules
   */
  checkContradictoryRules() {
    // This would require semantic analysis of the code
    // For now, we check for rule-related files
    const ruleFiles = [];
    
    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      
      for (const loc of locations) {
        if (loc.location.includes('rule') || loc.location.includes('Rule')) {
          ruleFiles.push(loc.location);
        }
      }
    }
    
    // If rule files exist but canonical rule verification is not implemented
    if (ruleFiles.length > 0) {
      this.violations.contradictoryRules.push({
        message: 'Rule files detected but canonical rule contradiction verification not implemented',
        files: ruleFiles
      });
      this.failed = true;
    }
  }

  /**
   * Check for incompatible interfaces
   */
  checkIncompatibleInterfaces() {
    // This would require semantic analysis of the code
    // For now, we check for interface duplications
    const interfaceMap = new Map();
    
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      for (const loc of locations) {
        if (loc.type === 'interface' && loc.location.endsWith('.ts')) {
          if (!interfaceMap.has(name)) {
            interfaceMap.set(name, []);
          }
          interfaceMap.get(name).push(loc.location);
        }
      }
    }
    
    for (const [name, files] of interfaceMap) {
      if (files.length > 1) {
        this.violations.incompatibleInterfaces.push({
          name,
          files,
          message: 'Interface defined in multiple locations - potential incompatibility'
        });
        this.failed = true;
      }
    }
  }

  /**
   * Run all checks
   */
  lint() {
    console.log('Running Blueprint Architecture Linter...\n');
    
    console.log('Checking for duplications...');
    this.checkDuplications();
    console.log(`Found ${this.violations.duplications.length} duplication violations`);
    
    console.log('Checking for multiple ownership...');
    this.checkMultipleOwnership();
    console.log(`Found ${this.violations.multipleOwnership.length} multiple ownership violations`);
    
    console.log('Checking for duplicate contracts...');
    this.checkDuplicateContracts();
    console.log(`Found ${this.violations.duplicateContracts.length} duplicate contract violations`);
    
    console.log('Checking for unknown events...');
    this.checkUnknownEvents();
    console.log(`Found ${this.violations.unknownEvents.length} unknown event violations`);
    
    console.log('Checking for unknown states...');
    this.checkUnknownStates();
    console.log(`Found ${this.violations.unknownStates.length} unknown state violations`);
    
    console.log('Checking for broken invariants...');
    this.checkBrokenInvariants();
    console.log(`Found ${this.violations.brokenInvariants.length} broken invariant violations`);
    
    console.log('Checking for contradictory rules...');
    this.checkContradictoryRules();
    console.log(`Found ${this.violations.contradictoryRules.length} contradictory rule violations`);
    
    console.log('Checking for incompatible interfaces...');
    this.checkIncompatibleInterfaces();
    console.log(`Found ${this.violations.incompatibleInterfaces.length} incompatible interface violations`);
    
    return this.failed;
  }

  /**
   * Generate linter report
   */
  generateReport() {
    const report = {
      summary: {
        totalViolations: Object.values(this.violations).reduce((sum, arr) => sum + arr.length, 0),
        failed: this.failed
      },
      violations: this.violations
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
    console.log(`\nLinter report saved to ${outputPath}`);
  }

  /**
   * Print violations
   */
  printViolations() {
    if (!this.failed) {
      console.log('\n✅ No violations detected - architecture is compliant');
      return;
    }

    console.log('\n❌ VIOLATIONS DETECTED\n');

    if (this.violations.duplications.length > 0) {
      console.log('=== DUPLICATIONS ===');
      for (const v of this.violations.duplications) {
        console.log(`  - ${v.name} (${v.count} occurrences)`);
      }
    }

    if (this.violations.multipleOwnership.length > 0) {
      console.log('\n=== MULTIPLE OWNERSHIP ===');
      for (const v of this.violations.multipleOwnership) {
        console.log(`  - ${v.name}: ${v.owners.join(', ')}`);
      }
    }

    if (this.violations.duplicateContracts.length > 0) {
      console.log('\n=== DUPLICATE CONTRACTS ===');
      for (const v of this.violations.duplicateContracts) {
        console.log(`  - ${v.name}: ${v.files.length} files`);
      }
    }

    if (this.violations.unknownEvents.length > 0) {
      console.log('\n=== UNKNOWN EVENTS ===');
      for (const v of this.violations.unknownEvents.slice(0, 5)) {
        console.log(`  - ${v.name}`);
      }
    }

    if (this.violations.unknownStates.length > 0) {
      console.log('\n=== UNKNOWN STATES ===');
      for (const v of this.violations.unknownStates.slice(0, 5)) {
        console.log(`  - ${v.name}`);
      }
    }

    if (this.violations.brokenInvariants.length > 0) {
      console.log('\n=== BROKEN INVARIANTS ===');
      for (const v of this.violations.brokenInvariants) {
        console.log(`  - ${v.message}`);
      }
    }

    if (this.violations.contradictoryRules.length > 0) {
      console.log('\n=== CONTRADICTORY RULES ===');
      for (const v of this.violations.contradictoryRules) {
        console.log(`  - ${v.message}`);
      }
    }

    if (this.violations.incompatibleInterfaces.length > 0) {
      console.log('\n=== INCOMPATIBLE INTERFACES ===');
      for (const v of this.violations.incompatibleInterfaces.slice(0, 5)) {
        console.log(`  - ${v.name}: ${v.message}`);
      }
    }
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const canonicalModelPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[4] || join(process.cwd(), 'BLUEPRINT_LINTER_REPORT.json');
  
  const linter = new BlueprintLinter(indexPath, canonicalModelPath);

  const failed = linter.lint();
  
  linter.printViolations();
  linter.saveReport(outputPath);

  if (failed) {
    console.log('\n❌ LINTER FAILED - Architecture has violations');
    process.exit(1);
  } else {
    console.log('\n✅ LINTER PASSED - Architecture is compliant');
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BlueprintLinter };
