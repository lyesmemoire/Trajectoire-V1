#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Real Detection
 * 
 * Phase 2: Real detection - Recalculate duplications, contradictions, conflicts, broken references
 */

const { readFileSync } = require('fs');
const { join } = require('path');

class BlueprintDetector {
  constructor(indexPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.issues = {
      duplications: [],
      contradictions: [],
      conflicts: [],
      brokenReferences: [],
      ownershipIssues: [],
      cycleCandidates: []
    };
  }

  /**
   * Filter out false positives from duplications
   */
  filterRealDuplications() {
    const realDuplications = [];
    
    // Patterns that indicate false positives
    const falsePositivePatterns = [
      /^\d+$/, // Numbers only
      /^✅/, /^❌/, /^⚠️/, /^⏳/, // Status emojis
      /^Completed$/, /^Week$/, /^Comment$/, // Common words
      /^Import$/, /^Fusionner$/, /^Afficher$/, // French verbs
      /^Racine$/, /^Consolidation$/, // French nouns
      /RÉSOLU|ATTEINT|COMPLETÉ|CORRIGÉ/, // Status words
      /TOUS LES PRÉREQUIS VALIDÉS|READY FOR QA/, // Status phrases
      /Cycle non prouvé/, // Status phrases
      /Non documenté|Temporaire|Obsolète/, // Status phrases
      /Pas de doublons/, // Status phrases
    ];

    for (const dup of this.index.duplications) {
      // Skip if name matches false positive pattern
      const isFalsePositive = falsePositivePatterns.some(pattern => pattern.test(dup.name));
      
      if (isFalsePositive) {
        continue;
      }

      // Skip if all locations are in report files
      const allInReports = dup.locations.every(loc => 
        loc.location.includes('RAPPORT_') || 
        loc.location.includes('AUDIT_') ||
        loc.location.includes('ANALYSE_') ||
        loc.location.includes('PHASE1_') ||
        loc.location.includes('P0_') ||
        loc.location.includes('P1_') ||
        loc.location.includes('P2_') ||
        loc.location.includes('P3_') ||
        loc.location.includes('P4_') ||
        loc.location.includes('REFACTORING_') ||
        loc.location.includes('SPRINT') ||
        loc.location.includes('REGISTRE_')
      );

      if (allInReports && dup.count < 5) {
        continue;
      }

      // Check if it's a real architectural element
      const isArchitectural = dup.locations.some(loc => 
        loc.location.includes('BEA-') ||
        loc.location.includes('BCM-') ||
        loc.location.includes('COS-') ||
        loc.location.includes('CVM-') ||
        loc.location.includes('CPR-') ||
        loc.location.includes('contracts/') ||
        loc.location.includes('domain/') ||
        loc.location.includes('types/')
      );

      if (isArchitectural || dup.count >= 5) {
        realDuplications.push(dup);
      }
    }

    this.issues.duplications = realDuplications;
    return realDuplications;
  }

  /**
   * Detect ownership issues
   */
  detectOwnershipIssues() {
    const ownershipIssues = [];

    // Elements without owner
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      const withoutOwner = locations.filter(e => !e.owner || e.owner === 'N/A');
      
      if (withoutOwner.length > 0) {
        // Only flag if it's in an architectural file
        const inArchFile = withoutOwner.some(e => 
          e.location.includes('BEA-') ||
          e.location.includes('BCM-') ||
          e.location.includes('COS-') ||
          e.location.includes('CVM-') ||
          e.location.includes('CPR-') ||
          e.location.includes('contracts/')
        );

        if (inArchFile) {
          ownershipIssues.push({
            name,
            withoutOwner: withoutOwner.length,
            locations: withoutOwner.map(e => ({
              location: e.location,
              lineNumber: e.lineNumber,
              type: e.type
            }))
          });
        }
      }
    }

    this.issues.ownershipIssues = ownershipIssues;
    return ownershipIssues;
  }

  /**
   * Detect contract duplications
   */
  detectContractDuplications() {
    const contractDuplications = [];

    for (const dup of this.issues.duplications) {
      const isContract = dup.name.includes('CONTRACT') || 
                       dup.name.includes('Contract') ||
                       dup.locations.some(loc => loc.location.includes('contracts/'));

      if (isContract) {
        contractDuplications.push(dup);
      }
    }

    return contractDuplications;
  }

  /**
   * Detect interface duplications
   */
  detectInterfaceDuplications() {
    const interfaceDuplications = [];

    for (const dup of this.issues.duplications) {
      const isInterface = dup.locations.some(loc => loc.type === 'interface');

      if (isInterface) {
        interfaceDuplications.push(dup);
      }
    }

    return interfaceDuplications;
  }

  /**
   * Detect broken references
   */
  detectBrokenReferences() {
    const brokenRefs = [];
    const allFiles = new Set();

    // Collect all file paths
    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      for (const element of locations) {
        allFiles.add(element.location);
      }
    }

    // Check references
    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      for (const element of locations) {
        if (element.references) {
          for (const ref of element.references) {
            // Check if reference file exists
            if (ref.endsWith('.md')) {
              const refPath = join(this.rootPath || '', ref);
              if (!allFiles.has(refPath) && !allFiles.has(ref)) {
                brokenRefs.push({
                  reference: ref,
                  source: element.location,
                  lineNumber: element.lineNumber,
                  elementName: name
                });
              }
            }
          }
        }
      }
    }

    this.issues.brokenReferences = brokenRefs;
    return brokenRefs;
  }

  /**
   * Detect potential cycles (based on file references)
   */
  detectCycleCandidates() {
    const cycleCandidates = [];

    // Look for circular reference patterns in document names
    for (const dup of this.issues.duplications) {
      if (dup.count >= 3) {
        const hasCircularPattern = dup.locations.some(loc => 
          loc.location.includes('DEPENDENCY') ||
          loc.location.includes('GRAPH') ||
          loc.location.includes('REFERENCE')
        );

        if (hasCircularPattern) {
          cycleCandidates.push(dup);
        }
      }
    }

    this.issues.cycleCandidates = cycleCandidates;
    return cycleCandidates;
  }

  /**
   * Generate detection report
   */
  generateReport() {
    const report = {
      summary: {
        totalDuplications: this.issues.duplications.length,
        totalOwnershipIssues: this.issues.ownershipIssues.length,
        totalBrokenReferences: this.issues.brokenReferences.length,
        totalCycleCandidates: this.issues.cycleCandidates.length,
        contractDuplications: this.detectContractDuplications().length,
        interfaceDuplications: this.detectInterfaceDuplications().length
      },
      duplications: this.issues.duplications,
      ownershipIssues: this.issues.ownershipIssues,
      brokenReferences: this.issues.brokenReferences,
      cycleCandidates: this.issues.cycleCandidates,
      contractDuplications: this.detectContractDuplications(),
      interfaceDuplications: this.detectInterfaceDuplications()
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
    console.log(`Detection report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const outputPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_DETECTION_REPORT.json');
  
  const detector = new BlueprintDetector(indexPath);

  console.log('Filtering real duplications...');
  detector.filterRealDuplications();
  console.log(`Found ${detector.issues.duplications.length} real duplications`);

  console.log('Detecting ownership issues...');
  detector.detectOwnershipIssues();
  console.log(`Found ${detector.issues.ownershipIssues.length} ownership issues`);

  console.log('Detecting broken references...');
  detector.detectBrokenReferences();
  console.log(`Found ${detector.issues.brokenReferences.length} broken references`);

  console.log('Detecting cycle candidates...');
  detector.detectCycleCandidates();
  console.log(`Found ${detector.issues.cycleCandidates.length} cycle candidates`);

  console.log('Generating report...');
  const report = detector.generateReport();

  console.log('\n=== SUMMARY ===');
  console.log(`Total Duplications: ${report.summary.totalDuplications}`);
  console.log(`Contract Duplications: ${report.summary.contractDuplications}`);
  console.log(`Interface Duplications: ${report.summary.interfaceDuplications}`);
  console.log(`Ownership Issues: ${report.summary.totalOwnershipIssues}`);
  console.log(`Broken References: ${report.summary.totalBrokenReferences}`);
  console.log(`Cycle Candidates: ${report.summary.totalCycleCandidates}`);

  console.log('\n=== TOP DUPLICATIONS ===');
  const topDups = detector.issues.duplications
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  for (const dup of topDups) {
    console.log(`\n${dup.name} (${dup.count} occurrences):`);
    for (const loc of dup.locations.slice(0, 3)) {
      console.log(`  - ${loc.location}:${loc.lineNumber} (${loc.type})`);
    }
    if (dup.locations.length > 3) {
      console.log(`  ... and ${dup.locations.length - 3} more`);
    }
  }

  console.log('\n=== CONTRACT DUPLICATIONS ===');
  const contractDups = detector.detectContractDuplications();
  for (const dup of contractDups) {
    console.log(`\n${dup.name} (${dup.count} occurrences):`);
    for (const loc of dup.locations) {
      console.log(`  - ${loc.location}:${loc.lineNumber}`);
    }
  }

  console.log('\n=== INTERFACE DUPLICATIONS ===');
  const interfaceDups = detector.detectInterfaceDuplications();
  for (const dup of interfaceDups.slice(0, 5)) {
    console.log(`\n${dup.name} (${dup.count} occurrences):`);
    for (const loc of dup.locations.slice(0, 3)) {
      console.log(`  - ${loc.location}:${loc.lineNumber}`);
    }
  }

  console.log('\nSaving report...');
  detector.saveReport(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BlueprintDetector };
