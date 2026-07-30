#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Normalization
 * 
 * Phase 8: Normalize IDs, prefixes, versions, namespaces, conventions
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

class Normalizer {
  constructor(indexPath, canonicalModelPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.canonicalModelPath = canonicalModelPath;
    
    this.canonicalElements = new Map();
    this.extractCanonicalElements();
    
    this.issues = {
      nonStandardIDs: [],
      nonStandardSemanticIDs: [],
      nonStandardVersions: [],
      nonStandardNames: []
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
        let uuid = null;
        let semanticId = null;
        let owner = null;
        
        for (let j = 0; j < parts.length; j++) {
          if (idPattern.test(parts[j])) {
            id = parts[j];
            if (j + 1 < parts.length && parts[j + 1]) {
              name = parts[j + 1];
            }
            if (j + 2 < parts.length && parts[j + 2].match(/[0-9a-f-]{36}/i)) {
              uuid = parts[j + 2];
            }
            if (j + 3 < parts.length && parts[j + 3].startsWith('blueprint.')) {
              semanticId = parts[j + 3];
            }
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
   * Check ID format compliance
   */
  checkIDFormat() {
    const idPattern = /^[A-Z]+-\w+-\d{3}$/;
    
    for (const [name, canonical] of this.canonicalElements) {
      if (!idPattern.test(canonical.id)) {
        this.issues.nonStandardIDs.push({
          name,
          id: canonical.id,
          expectedFormat: 'PREFIX-NAME-NNN'
        });
      }
    }

    return this.issues.nonStandardIDs;
  }

  /**
   * Check semantic ID format compliance
   */
  checkSemanticIDFormat() {
    const semanticIdPattern = /^blueprint\.[a-z]+\.[a-z]+\.[a-z]+$/;
    
    for (const [name, canonical] of this.canonicalElements) {
      if (canonical.semanticId && !semanticIdPattern.test(canonical.semanticId)) {
        this.issues.nonStandardSemanticIDs.push({
          name,
          semanticId: canonical.semanticId,
          expectedFormat: 'blueprint.layer.category.name'
        });
      }
    }

    return this.issues.nonStandardSemanticIDs;
  }

  /**
   * Check version format compliance
   */
  checkVersionFormat() {
    const versionPattern = /^\d+\.\d+\.\d+$/;
    
    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      
      for (const loc of locations) {
        if (loc.version && !versionPattern.test(loc.version)) {
          this.issues.nonStandardVersions.push({
            name: elementData.name,
            version: loc.version,
            location: loc.location,
            expectedFormat: 'MAJOR.MINOR.PATCH'
          });
        }
      }
    }

    return this.issues.nonStandardVersions;
  }

  /**
   * Check naming convention compliance
   */
  checkNamingConvention() {
    // PascalCase pattern
    const pascalCasePattern = /^[A-Z][a-zA-Z0-9]*$/;
    
    for (const [name, canonical] of this.canonicalElements) {
      if (!pascalCasePattern.test(name)) {
        this.issues.nonStandardNames.push({
          name,
          expectedFormat: 'PascalCase'
        });
      }
    }

    return this.issues.nonStandardNames;
  }

  /**
   * Generate normalization report
   */
  generateReport() {
    const report = {
      summary: {
        totalCanonicalElements: this.canonicalElements.size,
        nonStandardIDs: this.issues.nonStandardIDs.length,
        nonStandardSemanticIDs: this.issues.nonStandardSemanticIDs.length,
        nonStandardVersions: this.issues.nonStandardVersions.length,
        nonStandardNames: this.issues.nonStandardNames.length
      },
      nonStandardIDs: this.issues.nonStandardIDs,
      nonStandardSemanticIDs: this.issues.nonStandardSemanticIDs,
      nonStandardVersions: this.issues.nonStandardVersions,
      nonStandardNames: this.issues.nonStandardNames
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
    console.log(`Normalization report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const canonicalModelPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[4] || join(process.cwd(), 'BLUEPRINT_NORMALIZATION_REPORT.json');
  
  const normalizer = new Normalizer(indexPath, canonicalModelPath);

  console.log(`Loaded ${normalizer.canonicalElements.size} canonical elements`);

  console.log('Checking ID format...');
  normalizer.checkIDFormat();
  console.log(`Found ${normalizer.issues.nonStandardIDs.length} non-standard IDs`);

  console.log('Checking semantic ID format...');
  normalizer.checkSemanticIDFormat();
  console.log(`Found ${normalizer.issues.nonStandardSemanticIDs.length} non-standard semantic IDs`);

  console.log('Checking version format...');
  normalizer.checkVersionFormat();
  console.log(`Found ${normalizer.issues.nonStandardVersions.length} non-standard versions`);

  console.log('Checking naming convention...');
  normalizer.checkNamingConvention();
  console.log(`Found ${normalizer.issues.nonStandardNames.length} non-standard names`);

  console.log('Generating report...');
  const report = normalizer.generateReport();

  console.log('\n=== SUMMARY ===');
  console.log(`Canonical Elements: ${report.summary.totalCanonicalElements}`);
  console.log(`Non-Standard IDs: ${report.summary.nonStandardIDs}`);
  console.log(`Non-Standard Semantic IDs: ${report.summary.nonStandardSemanticIDs}`);
  console.log(`Non-Standard Versions: ${report.summary.nonStandardVersions}`);
  console.log(`Non-Standard Names: ${report.summary.nonStandardNames}`);

  if (report.summary.nonStandardIDs > 0) {
    console.log('\n=== NON-STANDARD IDs ===');
    for (const issue of normalizer.issues.nonStandardIDs) {
      console.log(`  - ${issue.name}: ${issue.id} (expected: ${issue.expectedFormat})`);
    }
  }

  if (report.summary.nonStandardSemanticIDs > 0) {
    console.log('\n=== NON-STANDARD SEMANTIC IDs ===');
    for (const issue of normalizer.issues.nonStandardSemanticIDs) {
      console.log(`  - ${issue.name}: ${issue.semanticId} (expected: ${issue.expectedFormat})`);
    }
  }

  if (report.summary.nonStandardVersions > 0) {
    console.log('\n=== NON-STANDARD VERSIONS ===');
    for (const issue of normalizer.issues.nonStandardVersions.slice(0, 10)) {
      console.log(`  - ${issue.name}: ${issue.version} at ${issue.location} (expected: ${issue.expectedFormat})`);
    }
    if (normalizer.issues.nonStandardVersions.length > 10) {
      console.log(`  ... and ${normalizer.issues.nonStandardVersions.length - 10} more`);
    }
  }

  if (report.summary.nonStandardNames > 0) {
    console.log('\n=== NON-STANDARD NAMES ===');
    for (const issue of normalizer.issues.nonStandardNames) {
      console.log(`  - ${issue.name} (expected: ${issue.expectedFormat})`);
    }
  }

  if (report.summary.nonStandardIDs === 0 && 
      report.summary.nonStandardSemanticIDs === 0 && 
      report.summary.nonStandardVersions === 0 && 
      report.summary.nonStandardNames === 0) {
    console.log('\n✅ All naming conventions are compliant');
  }

  console.log('\nSaving report...');
  normalizer.saveReport(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { Normalizer };
