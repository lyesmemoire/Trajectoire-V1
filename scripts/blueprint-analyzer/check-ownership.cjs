#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Ownership Checker
 * 
 * Phase 6: Verify exactly one owner per element
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

class OwnershipChecker {
  constructor(indexPath, canonicalModelPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.canonicalModelPath = canonicalModelPath;
    
    this.canonicalElements = new Map();
    this.extractCanonicalElements();
    
    this.issues = {
      missingOwners: [],
      incorrectOwners: [],
      multipleOwners: []
    };
  }

  /**
   * Extract canonical elements with their owners
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
        let owner = null;
        
        for (let j = 0; j < parts.length; j++) {
          if (idPattern.test(parts[j])) {
            id = parts[j];
            if (j + 1 < parts.length && parts[j + 1]) {
              name = parts[j + 1];
            }
            if (j + 4 < parts.length) {
              owner = parts[j + 4];
            }
            break;
          }
        }
        
        if (id && name && owner) {
          this.canonicalElements.set(name, {
            id,
            owner
          });
        }
        continue;
      }
      
      if (!line.match(/^\|/)) {
        inTable = false;
      }
    }
  }

  /**
   * Check ownership issues
   */
  checkOwnership() {
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      // Skip if not a canonical element
      if (!this.canonicalElements.has(name)) {
        continue;
      }
      
      const canonical = this.canonicalElements.get(name);
      
      for (const loc of locations) {
        // Check if owner is missing
        if (!loc.owner || loc.owner === 'N/A') {
          this.issues.missingOwners.push({
            name,
            canonicalOwner: canonical.owner,
            location: loc.location,
            lineNumber: loc.lineNumber,
            type: loc.type
          });
        }
        
        // Check if owner is incorrect
        else if (loc.owner !== canonical.owner) {
          this.issues.incorrectOwners.push({
            name,
            canonicalOwner: canonical.owner,
            actualOwner: loc.owner,
            location: loc.location,
            lineNumber: loc.lineNumber,
            type: loc.type
          });
        }
      }
    }

    return this.issues;
  }

  /**
   * Generate ownership report
   */
  generateReport() {
    const report = {
      summary: {
        totalCanonicalElements: this.canonicalElements.size,
        missingOwners: this.issues.missingOwners.length,
        incorrectOwners: this.issues.incorrectOwners.length,
        multipleOwners: this.issues.multipleOwners.length
      },
      missingOwners: this.issues.missingOwners,
      incorrectOwners: this.issues.incorrectOwners,
      multipleOwners: this.issues.multipleOwners
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
    console.log(`Ownership report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const canonicalModelPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[4] || join(process.cwd(), 'BLUEPRINT_OWNERSHIP_REPORT.json');
  
  const checker = new OwnershipChecker(indexPath, canonicalModelPath);

  console.log(`Loaded ${checker.canonicalElements.size} canonical elements`);

  console.log('Checking ownership...');
  checker.checkOwnership();

  console.log('Generating report...');
  const report = checker.generateReport();

  console.log('\n=== SUMMARY ===');
  console.log(`Canonical Elements: ${report.summary.totalCanonicalElements}`);
  console.log(`Missing Owners: ${report.summary.missingOwners}`);
  console.log(`Incorrect Owners: ${report.summary.incorrectOwners}`);
  console.log(`Multiple Owners: ${report.summary.multipleOwners}`);

  if (report.summary.missingOwners > 0) {
    console.log('\n=== MISSING OWNERS (first 10) ===');
    for (const issue of checker.issues.missingOwners.slice(0, 10)) {
      console.log(`\n${issue.name}:`);
      console.log(`  Canonical Owner: ${issue.canonicalOwner}`);
      console.log(`  Location: ${issue.location}:${issue.lineNumber}`);
    }
    if (checker.issues.missingOwners.length > 10) {
      console.log(`... and ${checker.issues.missingOwners.length - 10} more`);
    }
  }

  if (report.summary.incorrectOwners > 0) {
    console.log('\n=== INCORRECT OWNERS (first 10) ===');
    for (const issue of checker.issues.incorrectOwners.slice(0, 10)) {
      console.log(`\n${issue.name}:`);
      console.log(`  Canonical Owner: ${issue.canonicalOwner}`);
      console.log(`  Actual Owner: ${issue.actualOwner}`);
      console.log(`  Location: ${issue.location}:${issue.lineNumber}`);
    }
    if (checker.issues.incorrectOwners.length > 10) {
      console.log(`... and ${checker.issues.incorrectOwners.length - 10} more`);
    }
  }

  console.log('\nSaving report...');
  checker.saveReport(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { OwnershipChecker };
