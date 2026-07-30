#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise TypeScript Cleanup
 * 
 * Phase 5: Remove duplicate interfaces, events, types from TypeScript files
 */

const { readFileSync } = require('fs');
const { join } = require('path');

class TypeScriptCleaner {
  constructor(indexPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.duplications = [];
    this.suggestions = [];
  }

  /**
   * Find interface/type duplications in TypeScript files
   */
  findTypeScriptDuplications() {
    const interfaceMap = new Map();
    const typeMap = new Map();

    for (const elementData of this.index.elements) {
      const { name, locations } = elementData;
      
      for (const loc of locations) {
        if (loc.type === 'interface' && loc.location.endsWith('.ts')) {
          if (!interfaceMap.has(name)) {
            interfaceMap.set(name, []);
          }
          interfaceMap.get(name).push(loc);
        }
        
        if (loc.type === 'object' && loc.location.endsWith('.ts')) {
          // This could be a type alias
          if (!typeMap.has(name)) {
            typeMap.set(name, []);
          }
          typeMap.get(name).push(loc);
        }
      }
    }

    // Find duplications
    for (const [name, locations] of interfaceMap) {
      if (locations.length > 1) {
        this.duplications.push({
          name,
          type: 'interface',
          count: locations.length,
          locations
        });
      }
    }

    for (const [name, locations] of typeMap) {
      if (locations.length > 1) {
        this.duplications.push({
          name,
          type: 'type',
          count: locations.length,
          locations
        });
      }
    }

    return this.duplications;
  }

  /**
   * Generate suggestions for cleanup
   */
  generateSuggestions() {
    for (const dup of this.duplications) {
      // Find the most likely canonical location
      const canonical = this.findCanonicalLocation(dup);
      
      if (canonical) {
        const duplicates = dup.locations.filter(loc => loc.location !== canonical.location);
        
        this.suggestions.push({
          name: dup.name,
          type: dup.type,
          canonical: canonical.location,
          duplicates: duplicates.map(d => d.location),
          action: 'REMOVE_DUPLICATES'
        });
      }
    }

    return this.suggestions;
  }

  /**
   * Find the most likely canonical location
   */
  findCanonicalLocation(duplication) {
    // Priority order for canonical locations
    const priority = [
      'contracts/',
      'domain/',
      'types/',
      'core/',
      'lib/'
    ];

    let bestLocation = null;
    let bestPriority = -1;

    for (const loc of duplication.locations) {
      for (let i = 0; i < priority.length; i++) {
        if (loc.location.includes(priority[i])) {
          if (i > bestPriority) {
            bestPriority = i;
            bestLocation = loc;
          }
          break;
        }
      }
    }

    // If no priority location found, use the first one
    if (!bestLocation && duplication.locations.length > 0) {
      bestLocation = duplication.locations[0];
    }

    return bestLocation;
  }

  /**
   * Generate cleanup report
   */
  generateReport() {
    const report = {
      summary: {
        totalDuplications: this.duplications.length,
        totalSuggestions: this.suggestions.length
      },
      duplications: this.duplications,
      suggestions: this.suggestions
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
    console.log(`TypeScript cleanup report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const outputPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_TYPESCRIPT_CLEANUP_REPORT.json');
  
  const cleaner = new TypeScriptCleaner(indexPath);

  console.log('Finding TypeScript duplications...');
  cleaner.findTypeScriptDuplications();
  console.log(`Found ${cleaner.duplications.length} TypeScript duplications`);

  console.log('Generating cleanup suggestions...');
  cleaner.generateSuggestions();
  console.log(`Generated ${cleaner.suggestions.length} cleanup suggestions`);

  console.log('Generating report...');
  const report = cleaner.generateReport();

  console.log('\n=== SUMMARY ===');
  console.log(`TypeScript Duplications: ${report.summary.totalDuplications}`);
  console.log(`Cleanup Suggestions: ${report.summary.totalSuggestions}`);

  if (report.summary.totalDuplications > 0) {
    console.log('\n=== TOP DUPLICATIONS ===');
    const topDups = cleaner.duplications
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    for (const dup of topDups) {
      console.log(`\n${dup.name} (${dup.type}, ${dup.count} occurrences):`);
      for (const loc of dup.locations.slice(0, 3)) {
        console.log(`  - ${loc.location}:${loc.lineNumber}`);
      }
      if (dup.locations.length > 3) {
        console.log(`  ... and ${dup.locations.length - 3} more`);
      }
    }
  }

  if (report.summary.totalSuggestions > 0) {
    console.log('\n=== CLEANUP SUGGESTIONS (first 10) ===');
    for (const suggestion of cleaner.suggestions.slice(0, 10)) {
      console.log(`\n${suggestion.name} (${suggestion.type}):`);
      console.log(`  Canonical: ${suggestion.canonical}`);
      console.log(`  Duplicates to remove: ${suggestion.duplicates.length}`);
      for (const dup of suggestion.duplicates.slice(0, 2)) {
        console.log(`    - ${dup}`);
      }
      if (suggestion.duplicates.length > 2) {
        console.log(`    ... and ${suggestion.duplicates.length - 2} more`);
      }
    }
  }

  console.log('\nSaving report...');
  cleaner.saveReport(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TypeScriptCleaner };
