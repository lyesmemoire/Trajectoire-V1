#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Smart Detection
 * 
 * Phase 2: Smart detection using canonical model as reference
 */

const { readFileSync } = require('fs');
const { join } = require('path');

class SmartDetector {
  constructor(indexPath, canonicalModelPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.canonicalModelPath = canonicalModelPath;
    
    // Extract canonical elements from the model
    this.canonicalElements = new Map();
    this.extractCanonicalElements();
    
    this.issues = {
      duplications: [],
      ownershipIssues: [],
      missingCanonicalReferences: [],
      nonCanonicalDefinitions: []
    };
  }

  /**
   * Extract canonical elements from canonical model
   */
  extractCanonicalElements() {
    // Parse the canonical model markdown to extract elements
    const modelContent = readFileSync(this.canonicalModelPath, 'utf-8');
    const lines = modelContent.split('\n');
    
    let inTable = false;
    let tableHeaders = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect table header
      if (line.match(/^\|.*\|.*\|.*\|.*\|.*\|/) && !inTable) {
        inTable = true;
        tableHeaders = line.split('|').map(p => p.trim()).filter(p => p);
        continue;
      }
      
      // Detect table separator
      if (line.match(/^\|[-\s|]+\|/)) {
        continue;
      }
      
      // Detect table row
      if (line.match(/^\|.*\|/) && inTable) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        
        // Try to match ID pattern
        const idPattern = /^[A-Z]+-\w+-\d+$/;
        
        // Find ID in the row
        let id = null;
        let name = null;
        let uuid = null;
        let semanticId = null;
        let owner = null;
        
        for (let j = 0; j < parts.length; j++) {
          if (idPattern.test(parts[j])) {
            id = parts[j];
            // Name is usually next to ID
            if (j + 1 < parts.length && parts[j + 1]) {
              name = parts[j + 1];
            }
            // UUID is usually after name
            if (j + 2 < parts.length && parts[j + 2].match(/[0-9a-f-]{36}/i)) {
              uuid = parts[j + 2];
            }
            // Semantic ID is usually after UUID
            if (j + 3 < parts.length && parts[j + 3].startsWith('blueprint.')) {
              semanticId = parts[j + 3];
            }
            // Owner is usually after semantic ID
            if (j + 4 < parts.length) {
              owner = parts[j + 4];
            }
            break;
          }
        }
        
        if (id && name) {
          this.canonicalElements.set(name, {
            id,
            uuid,
            semanticId,
            owner,
            type: this.inferType(id)
          });
        }
        
        continue;
      }
      
      // Exit table if line doesn't start with |
      if (!line.match(/^\|/)) {
        inTable = false;
        tableHeaders = [];
      }
    }
  }

  /**
   * Infer type from ID
   */
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
    if (id.startsWith('BEA-INV-')) return 'invariant';
    if (id.startsWith('BCM-INV-')) return 'invariant';
    if (id.startsWith('COS-INV-')) return 'invariant';
    if (id.startsWith('CVM-INV-')) return 'invariant';
    return 'unknown';
  }

  /**
   * Detect non-canonical definitions
   */
  detectNonCanonicalDefinitions() {
    const nonCanonical = [];

    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      // Skip if this is a canonical element
      if (this.canonicalElements.has(name)) {
        continue;
      }
      
      // Check if it looks like an architectural element
      const isArchitectural = locations.some(loc => 
        loc.location.includes('BEA-') ||
        loc.location.includes('BCM-') ||
        loc.location.includes('COS-') ||
        loc.location.includes('CVM-') ||
        loc.location.includes('CPR-') ||
        loc.location.includes('contracts/') ||
        loc.location.includes('domain/')
      );

      if (isArchitectural) {
        // Check if it's a real object name (not a common word)
        const isRealObject = /^[A-Z][a-zA-Z]+$/.test(name) && 
                          !['All', 'Not', 'State', 'High', 'Unique', 'Contract', 'Emitted', 'Type'].includes(name);
        
        if (isRealObject) {
          nonCanonical.push({
            name,
            count: locations.length,
            locations: locations.map(e => ({
              location: e.location,
              lineNumber: e.lineNumber,
              type: e.type,
              owner: e.owner
            }))
          });
        }
      }
    }

    this.issues.nonCanonicalDefinitions = nonCanonical;
    return nonCanonical;
  }

  /**
   * Detect duplications of canonical elements
   */
  detectCanonicalDuplications() {
    const canonicalDups = [];

    for (const [name, canonical] of this.canonicalElements) {
      const elementData = this.index.elements.find(e => e.name === name);
      
      if (elementData && elementData.locations.length > 1) {
        canonicalDups.push({
          name,
          canonical: canonical,
          count: elementData.locations.length,
          locations: elementData.locations
        });
      }
    }

    this.issues.duplications = canonicalDups;
    return canonicalDups;
  }

  /**
   * Detect ownership issues for canonical elements
   */
  detectOwnershipIssues() {
    const ownershipIssues = [];

    for (const [name, canonical] of this.canonicalElements) {
      const elementData = this.index.elements.find(e => e.name === name);
      
      if (elementData) {
        for (const loc of elementData.locations) {
          // Check if owner matches canonical
          if (loc.owner !== canonical.owner) {
            ownershipIssues.push({
              name,
              canonicalOwner: canonical.owner,
              actualOwner: loc.owner || 'N/A',
              location: loc.location,
              lineNumber: loc.lineNumber
            });
          }
          
          // Check if owner is missing
          if (!loc.owner || loc.owner === 'N/A') {
            ownershipIssues.push({
              name,
              canonicalOwner: canonical.owner,
              actualOwner: 'MISSING',
              location: loc.location,
              lineNumber: loc.lineNumber
            });
          }
        }
      }
    }

    this.issues.ownershipIssues = ownershipIssues;
    return ownershipIssues;
  }

  /**
   * Detect missing canonical references
   */
  detectMissingCanonicalReferences() {
    const missingRefs = [];

    // Check if canonical elements are referenced in other documents
    for (const [name, canonical] of this.canonicalElements) {
      const elementData = this.index.elements.find(e => e.name === name);
      
      if (!elementData) {
        // Canonical element not found in any document
        missingRefs.push({
          name,
          canonical,
          status: 'NOT_FOUND_IN_INDEX'
        });
      }
    }

    this.issues.missingCanonicalReferences = missingRefs;
    return missingRefs;
  }

  /**
   * Generate smart detection report
   */
  generateReport() {
    const report = {
      summary: {
        totalCanonicalElements: this.canonicalElements.size,
        totalCanonicalDuplications: this.issues.duplications.length,
        totalOwnershipIssues: this.issues.ownershipIssues.length,
        totalNonCanonicalDefinitions: this.issues.nonCanonicalDefinitions.length,
        totalMissingReferences: this.issues.missingCanonicalReferences.length
      },
      canonicalDuplications: this.issues.duplications,
      ownershipIssues: this.issues.ownershipIssues,
      nonCanonicalDefinitions: this.issues.nonCanonicalDefinitions,
      missingCanonicalReferences: this.issues.missingCanonicalReferences
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
    console.log(`Smart detection report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const canonicalModelPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[4] || join(process.cwd(), 'BLUEPRINT_SMART_DETECTION_REPORT.json');
  
  const detector = new SmartDetector(indexPath, canonicalModelPath);

  console.log(`Loaded ${detector.canonicalElements.size} canonical elements`);

  console.log('Detecting canonical duplications...');
  detector.detectCanonicalDuplications();
  console.log(`Found ${detector.issues.duplications.length} canonical duplications`);

  console.log('Detecting ownership issues...');
  detector.detectOwnershipIssues();
  console.log(`Found ${detector.issues.ownershipIssues.length} ownership issues`);

  console.log('Detecting non-canonical definitions...');
  detector.detectNonCanonicalDefinitions();
  console.log(`Found ${detector.issues.nonCanonicalDefinitions.length} non-canonical definitions`);

  console.log('Detecting missing canonical references...');
  detector.detectMissingCanonicalReferences();
  console.log(`Found ${detector.issues.missingCanonicalReferences.length} missing references`);

  console.log('Generating report...');
  const report = detector.generateReport();

  console.log('\n=== SUMMARY ===');
  console.log(`Canonical Elements: ${report.summary.totalCanonicalElements}`);
  console.log(`Canonical Duplications: ${report.summary.totalCanonicalDuplications}`);
  console.log(`Ownership Issues: ${report.summary.totalOwnershipIssues}`);
  console.log(`Non-Canonical Definitions: ${report.summary.totalNonCanonicalDefinitions}`);
  console.log(`Missing References: ${report.summary.totalMissingReferences}`);

  if (report.summary.totalCanonicalDuplications > 0) {
    console.log('\n=== CANONICAL DUPLICATIONS ===');
    for (const dup of detector.issues.duplications) {
      console.log(`\n${dup.name} (${dup.count} occurrences):`);
      console.log(`  Canonical Owner: ${dup.canonical.owner}`);
      console.log(`  Canonical ID: ${dup.canonical.id}`);
      for (const loc of dup.locations) {
        console.log(`  - ${loc.location}:${loc.lineNumber} (owner: ${loc.owner || 'N/A'})`);
      }
    }
  }

  if (report.summary.totalOwnershipIssues > 0) {
    console.log('\n=== OWNERSHIP ISSUES ===');
    for (const issue of detector.issues.ownershipIssues.slice(0, 10)) {
      console.log(`\n${issue.name}:`);
      console.log(`  Canonical Owner: ${issue.canonicalOwner}`);
      console.log(`  Actual Owner: ${issue.actualOwner}`);
      console.log(`  Location: ${issue.location}:${issue.lineNumber}`);
    }
    if (detector.issues.ownershipIssues.length > 10) {
      console.log(`... and ${detector.issues.ownershipIssues.length - 10} more`);
    }
  }

  if (report.summary.totalNonCanonicalDefinitions > 0) {
    console.log('\n=== NON-CANONICAL DEFINITIONS ===');
    for (const def of detector.issues.nonCanonicalDefinitions.slice(0, 10)) {
      console.log(`\n${def.name} (${def.count} occurrences):`);
      for (const loc of def.locations.slice(0, 2)) {
        console.log(`  - ${loc.location}:${loc.lineNumber} (${loc.type})`);
      }
    }
    if (detector.issues.nonCanonicalDefinitions.length > 10) {
      console.log(`... and ${detector.issues.nonCanonicalDefinitions.length - 10} more`);
    }
  }

  console.log('\nSaving report...');
  detector.saveReport(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SmartDetector };
