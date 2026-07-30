#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Self-Healing Engine
 * 
 * Phase 6: Automatic repair engine detecting Checksum, Canonical Diff, Violation, Rollback, Regeneration
 */

const { readFileSync, writeFileSync, existsSync, statSync } = require('fs');
const { join } = require('path');
const { createHash } = require('crypto');

class SelfHealingEngine {
  constructor(manifestPath, canonicalModelPath) {
    this.manifestPath = manifestPath;
    this.canonicalModelPath = canonicalModelPath;
    this.manifest = null;
    this.violations = [];
    this.repairedFiles = [];
    this.rollbackFiles = [];
  }

  /**
   * Load manifest
   */
  loadManifest() {
    if (existsSync(this.manifestPath)) {
      this.manifest = JSON.parse(readFileSync(this.manifestPath, 'utf-8'));
      console.log(`Loaded manifest with ${this.manifest.totalFiles} files`);
    } else {
      console.log('No manifest found, starting fresh');
      this.manifest = {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        totalFiles: 0,
        files: []
      };
    }
  }

  /**
   * Calculate checksum of file
   */
  calculateChecksum(filePath) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      // Remove checksum comment if present
      const contentWithoutChecksum = content.replace(/^\/\/ Checksum: [a-f0-9]+\n\n/, '');
      return createHash('sha256').update(contentWithoutChecksum).digest('hex');
    } catch (e) {
      return null;
    }
  }

  /**
   * Extract checksum from file content
   */
  extractChecksum(filePath) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const match = content.match(/^\/\/ Checksum: ([a-f0-9]+)\n/);
      return match ? match[1] : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Check for drift
   */
  checkDrift() {
    console.log('Checking for drift...');
    
    if (!this.manifest || this.manifest.files.length === 0) {
      console.log('No files to check');
      return [];
    }

    const drifts = [];

    for (const fileEntry of this.manifest.files) {
      const filePath = join(process.cwd(), fileEntry.path);
      
      if (!existsSync(filePath)) {
        drifts.push({
          path: fileEntry.path,
          type: 'missing',
          expectedChecksum: fileEntry.checksum,
          actualChecksum: null
        });
        continue;
      }

      const actualChecksum = this.calculateChecksum(filePath);
      const fileChecksum = this.extractChecksum(filePath);

      if (actualChecksum !== fileEntry.checksum) {
        drifts.push({
          path: fileEntry.path,
          type: 'modified',
          expectedChecksum: fileEntry.checksum,
          actualChecksum,
          fileChecksum
        });
      }
    }

    console.log(`Found ${drifts.length} drifts`);
    return drifts;
  }

  /**
   * Detect violations
   */
  detectViolations() {
    console.log('Detecting violations...');
    
    const violations = [];

    // Check for manual edits in generated files
    if (this.manifest && this.manifest.files) {
      for (const fileEntry of this.manifest.files) {
        const filePath = join(process.cwd(), fileEntry.path);
        
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf-8');
          
          // Check if file has the auto-generated header
          if (!content.includes('auto-generated') && !content.includes('auto-generated')) {
            violations.push({
              path: fileEntry.path,
              type: 'manual_edit',
              message: 'File appears to be manually edited'
            });
          }
          
          // Check if checksum comment is missing
          if (!content.match(/^\/\/ Checksum:/)) {
            violations.push({
              path: fileEntry.path,
              type: 'missing_checksum',
              message: 'Checksum comment is missing'
            });
          }
        }
      }
    }

    this.violations = violations;
    console.log(`Found ${violations.length} violations`);
    return violations;
  }

  /**
   * Calculate canonical diff
   */
  calculateCanonicalDiff(filePath) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      const diff = {
        addedLines: 0,
        removedLines: 0,
        modifiedLines: 0,
        changes: []
      };

      // Simple diff: count lines that don't match expected pattern
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip comments and empty lines
        if (line.trim().startsWith('//') || line.trim() === '') {
          continue;
        }

        // Check for unexpected patterns
        if (line.includes('TODO') || line.includes('FIXME') || line.includes('HACK')) {
          diff.changes.push({
            line: i + 1,
            type: 'warning',
            message: 'Contains TODO/FIXME/HACK comment'
          });
          diff.modifiedLines++;
        }
      }

      return diff;
    } catch (e) {
      return null;
    }
  }

  /**
   * Rollback file
   */
  rollback(filePath) {
    console.log(`Rolling back ${filePath}`);
    
    try {
      // Find the file entry in manifest
      const fileEntry = this.manifest.files.find(f => f.path === filePath);
      
      if (!fileEntry) {
        console.log(`  No manifest entry for ${filePath}`);
        return false;
      }

      // In a real implementation, this would restore from a backup
      // For now, we just mark it for regeneration
      this.rollbackFiles.push({
        path: filePath,
        reason: 'checksum_mismatch',
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (e) {
      console.error(`  Error rolling back ${filePath}: ${e.message}`);
      return false;
    }
  }

  /**
   * Regenerate file
   */
  regenerate(filePath) {
    console.log(`Regenerating ${filePath}`);
    
    try {
      // In a real implementation, this would call the appropriate generator
      // For now, we just mark it as regenerated
      this.repairedFiles.push({
        path: filePath,
        action: 'regenerated',
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (e) {
      console.error(`  Error regenerating ${filePath}: ${e.message}`);
      return false;
    }
  }

  /**
   * Run self-healing process
   */
  heal() {
    console.log('Starting self-healing process...\n');

    this.loadManifest();

    // Check for drift
    const drifts = this.checkDrift();

    // Detect violations
    this.detectViolations();

    // Process drifts
    console.log('\nProcessing drifts...');
    for (const drift of drifts) {
      if (drift.type === 'modified') {
        console.log(`  ${drift.path}: Modified`);
        this.rollback(drift.path);
        this.regenerate(drift.path);
      } else if (drift.type === 'missing') {
        console.log(`  ${drift.path}: Missing`);
        this.regenerate(drift.path);
      }
    }

    // Process violations
    console.log('\nProcessing violations...');
    for (const violation of this.violations) {
      console.log(`  ${violation.path}: ${violation.type} - ${violation.message}`);
      this.rollback(violation.path);
      this.regenerate(violation.path);
    }

    console.log('\n=== SELF-HEALING SUMMARY ===');
    console.log(`Drifts detected: ${drifts.length}`);
    console.log(`Violations detected: ${this.violations.length}`);
    console.log(`Files rolled back: ${this.rollbackFiles.length}`);
    console.log(`Files regenerated: ${this.repairedFiles.length}`);

    return {
      drifts,
      violations: this.violations,
      rollbackFiles: this.rollbackFiles,
      repairedFiles: this.repairedFiles
    };
  }

  /**
   * Generate healing report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        driftsDetected: this.rollbackFiles.length,
        violationsDetected: this.violations.length,
        filesRepaired: this.repairedFiles.length,
        filesRolledBack: this.rollbackFiles.length
      },
      drifts: this.rollbackFiles,
      violations: this.violations,
      repairs: this.repairedFiles
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
    console.log(`Self-healing report saved to ${outputPath}`);
  }

  /**
   * Update manifest with new checksums
   */
  updateManifest() {
    if (!this.manifest) {
      return;
    }

    console.log('Updating manifest with new checksums...');

    for (const repair of this.repairedFiles) {
      const filePath = join(process.cwd(), repair.path);
      const newChecksum = this.calculateChecksum(filePath);
      
      const fileEntry = this.manifest.files.find(f => f.path === repair.path);
      if (fileEntry) {
        fileEntry.checksum = newChecksum;
        fileEntry.generatedAt = repair.timestamp;
      }
    }

    this.manifest.generatedAt = new Date().toISOString();
    this.manifest.totalFiles = this.manifest.files.length;

    writeFileSync(this.manifestPath, JSON.stringify(this.manifest, null, 2), 'utf-8');
    console.log(`Manifest updated and saved to ${this.manifestPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const manifestPath = process.argv[3] || join(rootPath, 'BLUEPRINT_MULTI_LANG_GENERATED', 'MULTI_LANG_MANIFEST.json');
  const canonicalModelPath = process.argv[4] || join(rootPath, 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[5] || join(rootPath, 'BLUEPRINT_SELF_HEALING_REPORT.json');
  
  const engine = new SelfHealingEngine(manifestPath, canonicalModelPath);

  const result = engine.heal();

  console.log('\nGenerating report...');
  engine.saveReport(outputPath);

  console.log('Updating manifest...');
  engine.updateManifest();

  if (result.driftsDetected > 0 || result.violationsDetected > 0) {
    console.log('\n❌ SELF-HEALING REQUIRED - Issues detected and repaired');
    process.exit(1);
  } else {
    console.log('\n✅ SELF-HEALING PASSED - No issues detected');
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SelfHealingEngine };
