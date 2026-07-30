#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Contract Cleanup
 * 
 * Phase 4: Ensure unique contract definitions - remove duplicate contracts
 */

const { readFileSync, writeFileSync, unlinkSync, existsSync } = require('fs');
const { join } = require('path');

class ContractCleaner {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.canonicalDirs = ['foundation', 'observability', 'security'];
    this.removals = [];
    this.errors = [];
  }

  /**
   * Get all contract files
   */
  getContractFiles() {
    const { readdirSync, statSync } = require('fs');
    const contracts = [];
    
    const scanDirectory = (dir) => {
      try {
        const entries = readdirSync(dir);
        
        for (const entry of entries) {
          const fullPath = join(dir, entry);
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (stat.isFile() && entry.endsWith('_CONTRACT.md')) {
            contracts.push(fullPath);
          }
        }
      } catch (e) {
        // Ignore errors
      }
    };

    const contractsDir = join(this.rootPath, 'contracts');
    if (existsSync(contractsDir)) {
      scanDirectory(contractsDir);
    }

    return contracts;
  }

  /**
   * Check if a contract is in a canonical directory
   */
  isCanonical(filePath) {
    const relativePath = filePath.replace(this.rootPath, '').replace(/\\/g, '/');
    
    for (const dir of this.canonicalDirs) {
      if (relativePath.includes(`/contracts/${dir}/`)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get contract name from file path
   */
  getContractName(filePath) {
    const fileName = filePath.split(/\\/).pop();
    return fileName.replace('_CONTRACT.md', '');
  }

  /**
   * Check if a canonical version exists for a duplicate
   */
  hasCanonicalVersion(duplicatePath) {
    const contractName = this.getContractName(duplicatePath);
    
    for (const dir of this.canonicalDirs) {
      const canonicalPath = join(this.rootPath, 'contracts', dir, `${contractName}_CONTRACT.md`);
      if (existsSync(canonicalPath)) {
        return canonicalPath;
      }
    }
    
    return null;
  }

  /**
   * Clean up duplicate contracts
   */
  cleanup() {
    const contractFiles = this.getContractFiles();
    
    console.log(`Found ${contractFiles.length} contract files`);

    for (const filePath of contractFiles) {
      if (this.isCanonical(filePath)) {
        // Keep canonical contracts
        continue;
      }

      // Check if there's a canonical version
      const canonicalPath = this.hasCanonicalVersion(filePath);
      
      if (canonicalPath) {
        // This is a duplicate, remove it
        try {
          unlinkSync(filePath);
          this.removals.push({
            duplicate: filePath,
            canonical: canonicalPath,
            contractName: this.getContractName(filePath)
          });
          console.log(`Removed duplicate: ${filePath}`);
        } catch (e) {
          this.errors.push({
            file: filePath,
            error: e.message
          });
          console.error(`Error removing ${filePath}: ${e.message}`);
        }
      } else {
        // No canonical version found, might need to move it
        console.log(`No canonical version found for: ${filePath}`);
      }
    }
  }

  /**
   * Generate cleanup report
   */
  generateReport() {
    const report = {
      summary: {
        totalRemoved: this.removals.length,
        totalErrors: this.errors.length
      },
      removals: this.removals,
      errors: this.errors
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
    console.log(`Cleanup report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CONTRACT_CLEANUP_REPORT.json');
  
  const cleaner = new ContractCleaner(rootPath);

  console.log('Cleaning up duplicate contracts...');
  cleaner.cleanup();

  console.log('Generating report...');
  const report = cleaner.generateReport();

  console.log('\n=== SUMMARY ===');
  console.log(`Contracts Removed: ${report.summary.totalRemoved}`);
  console.log(`Errors: ${report.summary.totalErrors}`);

  if (report.summary.totalRemoved > 0) {
    console.log('\n=== REMOVED CONTRACTS ===');
    for (const removal of cleaner.removals) {
      console.log(`  - ${removal.contractName}`);
      console.log(`    Duplicate: ${removal.duplicate}`);
      console.log(`    Canonical: ${removal.canonical}`);
    }
  }

  if (report.summary.totalErrors > 0) {
    console.log('\n=== ERRORS ===');
    for (const error of cleaner.errors) {
      console.log(`  - ${error.file}: ${error.error}`);
    }
  }

  console.log('\nSaving report...');
  cleaner.saveReport(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ContractCleaner };
