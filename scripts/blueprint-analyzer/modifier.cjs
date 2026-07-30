#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Document Modifier
 * 
 * Phase 3: Modify documents to replace local definitions with canonical references
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

class DocumentModifier {
  constructor(indexPath, canonicalModelPath) {
    this.index = JSON.parse(readFileSync(indexPath, 'utf-8'));
    this.canonicalModelPath = canonicalModelPath;
    
    // Extract canonical elements
    this.canonicalElements = new Map();
    this.extractCanonicalElements();
    
    this.modifications = {
      filesModified: [],
      definitionsReplaced: [],
      ownersAdded: [],
      referencesAdded: []
    };
  }

  /**
   * Extract canonical elements from canonical model
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
            owner,
            type: this.inferType(id)
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
   * Modify a TypeScript file to add canonical references
   */
  modifyTypeScriptFile(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const modifiedLines = [...lines];
    let modified = false;

    for (const [name, canonical] of this.canonicalElements) {
      // Look for interface/class definitions
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if this line defines the canonical element
        const interfaceMatch = line.match(new RegExp(`export\\s+(interface|type|class)\\s+${name}\\b`));
        
        if (interfaceMatch) {
          // Add comment with canonical reference
          const comment = `// Canonical Reference: ${canonical.id} (${canonical.semanticId})`;
          const ownerComment = `// Owner: ${canonical.owner}`;
          
          // Check if comment already exists
          if (!lines[i - 1] || !lines[i - 1].includes('Canonical Reference')) {
            modifiedLines.splice(i, 0, comment, ownerComment);
            modified = true;
            this.modifications.definitionsReplaced.push({
              name,
              file: filePath,
              line: i + 1,
              canonicalId: canonical.id
            });
          }
          break;
        }
      }
    }

    if (modified) {
      writeFileSync(filePath, modifiedLines.join('\n'), 'utf-8');
      this.modifications.filesModified.push(filePath);
    }

    return modified;
  }

  /**
   * Modify a markdown file to add canonical references
   */
  modifyMarkdownFile(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const modifiedLines = [...lines];
    let modified = false;

    for (const [name, canonical] of this.canonicalElements) {
      // Look for object definitions in markdown
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for various definition patterns
        const patterns = [
          new RegExp(`^###?\\s*\\*\\*${name}\\*\\*`),
          new RegExp(`^###?\\s*${name}\\s*[:=]`),
          new RegExp(`^-\\s*\\*\\*${name}\\*\\*:`)
        ];

        for (const pattern of patterns) {
          if (pattern.test(line)) {
            // Check if canonical reference already exists nearby
            let hasReference = false;
            for (let j = Math.max(0, i - 3); j < Math.min(lines.length, i + 3); j++) {
              if (lines[j].includes('Canonical Reference') || lines[j].includes(canonical.id)) {
                hasReference = true;
                break;
              }
            }

            if (!hasReference) {
              // Add canonical reference after the definition
              const referenceLine = `> **Canonical Reference**: ${canonical.id} (${canonical.semanticId})`;
              const ownerLine = `> **Owner**: ${canonical.owner}`;
              
              modifiedLines.splice(i + 1, 0, referenceLine, ownerLine);
              modified = true;
              this.modifications.definitionsReplaced.push({
                name,
                file: filePath,
                line: i + 1,
                canonicalId: canonical.id
              });
            }
            break;
          }
        }
      }
    }

    if (modified) {
      writeFileSync(filePath, modifiedLines.join('\n'), 'utf-8');
      this.modifications.filesModified.push(filePath);
    }

    return modified;
  }

  /**
   * Modify all files in the index
   */
  modifyAllFiles() {
    const processedFiles = new Set();

    for (const elementData of this.index.elements) {
      const { locations } = elementData;
      
      for (const loc of locations) {
        if (processedFiles.has(loc.location)) {
          continue;
        }

        processedFiles.add(loc.location);

        if (loc.location.endsWith('.ts') || loc.location.endsWith('.tsx')) {
          this.modifyTypeScriptFile(loc.location);
        } else if (loc.location.endsWith('.md')) {
          // Only modify architectural markdown files
          if (loc.location.includes('BEA-') || 
              loc.location.includes('BCM-') || 
              loc.location.includes('COS-') || 
              loc.location.includes('CVM-') || 
              loc.location.includes('CPR-') ||
              loc.location.includes('contracts/')) {
            this.modifyMarkdownFile(loc.location);
          }
        }
      }
    }
  }

  /**
   * Generate modification report
   */
  generateReport() {
    const report = {
      summary: {
        totalCanonicalElements: this.canonicalElements.size,
        filesModified: this.modifications.filesModified.length,
        definitionsReplaced: this.modifications.definitionsReplaced.length
      },
      filesModified: this.modifications.filesModified,
      definitionsReplaced: this.modifications.definitionsReplaced
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
    console.log(`Modification report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const indexPath = process.argv[2] || join(process.cwd(), 'BLUEPRINT_ANALYSIS_INDEX.json');
  const canonicalModelPath = process.argv[3] || join(process.cwd(), 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[4] || join(process.cwd(), 'BLUEPRINT_MODIFICATION_REPORT.json');
  
  const modifier = new DocumentModifier(indexPath, canonicalModelPath);

  console.log(`Loaded ${modifier.canonicalElements.size} canonical elements`);

  console.log('Modifying files...');
  modifier.modifyAllFiles();

  console.log('Generating report...');
  const report = modifier.generateReport();

  console.log('\n=== SUMMARY ===');
  console.log(`Canonical Elements: ${report.summary.totalCanonicalElements}`);
  console.log(`Files Modified: ${report.summary.filesModified}`);
  console.log(`Definitions Replaced: ${report.summary.definitionsReplaced}`);

  if (report.summary.filesModified > 0) {
    console.log('\n=== FILES MODIFIED ===');
    for (const file of modifier.modifications.filesModified) {
      console.log(`  - ${file}`);
    }
  }

  if (report.summary.definitionsReplaced > 0) {
    console.log('\n=== DEFINITIONS REPLACED (first 10) ===');
    for (const def of modifier.modifications.definitionsReplaced.slice(0, 10)) {
      console.log(`  - ${def.name} in ${def.file}:${def.line} -> ${def.canonicalId}`);
    }
    if (modifier.modifications.definitionsReplaced.length > 10) {
      console.log(`  ... and ${modifier.modifications.definitionsReplaced.length - 10} more`);
    }
  }

  console.log('\nSaving report...');
  modifier.saveReport(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DocumentModifier };
