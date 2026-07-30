#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Contract Single Source of Truth Transformer
 * 
 * OBJECTIF 5: Transformer tous les contrats en Single Source of Truth
 * 
 * Stratégie:
 * - domain/ est la source de vérité
 * - apps/web/src/domain/ importe depuis domain/
 * - Suppression des définitions dupliquées
 */

const { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync } = require('fs');
const { join } = require('path');

class ContractSSTTransformer {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.domainPath = join(rootPath, 'domain');
    this.appsDomainPath = join(rootPath, 'apps/web/src/domain');
    this.transformedFiles = [];
    this.removedFiles = [];
  }

  /**
   * Transformer les contrats
   */
  transform() {
    console.log('Transforming contracts to Single Source of Truth...');
    
    if (!existsSync(this.domainPath)) {
      console.log('  No domain/ directory found, skipping');
      return;
    }

    if (!existsSync(this.appsDomainPath)) {
      console.log('  No apps/web/src/domain/ directory found, skipping');
      return;
    }

    const domainContracts = this.getContractFiles(this.domainPath);
    const appsDomainContracts = this.getContractFiles(this.appsDomainPath);

    console.log(`  Found ${domainContracts.length} contracts in domain/`);
    console.log(`  Found ${appsDomainContracts.length} contracts in apps/web/src/domain/`);

    for (const contractFile of appsDomainContracts) {
      const contractName = contractFile.replace('.contract.ts', '');
      const domainContract = domainContracts.find(c => c.replace('.contract.ts', '') === contractName);

      if (domainContract) {
        // Remplacer par un import
        this.replaceWithImport(contractFile, domainContract);
      } else {
        // Supprimer si pas de correspondance
        this.removeContract(contractFile);
      }
    }

    this.printSummary();
  }

  /**
   * Obtenir les fichiers de contrats
   */
  getContractFiles(dir) {
    try {
      const files = readdirSync(dir);
      return files.filter(f => f.endsWith('.contract.ts'));
    } catch (error) {
      return [];
    }
  }

  /**
   * Remacer un contrat par un import
   */
  replaceWithImport(contractFile, domainContract) {
    const appsContractPath = join(this.appsDomainPath, contractFile);
    const content = readFileSync(appsContractPath, 'utf-8');

    const importStatement = `// Re-export from canonical source\nexport * from '../../../domain/${domainContract}';\n`;

    writeFileSync(appsContractPath, importStatement, 'utf-8');
    this.transformedFiles.push(contractFile);
    console.log(`  Transformed: ${contractFile}`);
  }

  /**
   * Supprimer un contrat
   */
  removeContract(contractFile) {
    const appsContractPath = join(this.appsDomainPath, contractFile);
    unlinkSync(appsContractPath);
    this.removedFiles.push(contractFile);
    console.log(`  Removed: ${contractFile}`);
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    console.log('\n=== CONTRACT SST TRANSFORMATION SUMMARY ===');
    console.log(`Total Files Transformed: ${this.transformedFiles.length}`);
    console.log(`Total Files Removed: ${this.removedFiles.length}`);
    console.log('==========================================\n');

    if (this.transformedFiles.length > 0) {
      console.log('TRANSFORMED FILES:');
      for (const file of this.transformedFiles) {
        console.log(`  - ${file}`);
      }
      console.log('');
    }

    if (this.removedFiles.length > 0) {
      console.log('REMOVED FILES:');
      for (const file of this.removedFiles) {
        console.log(`  - ${file}`);
      }
      console.log('');
    }
  }

  /**
   * Générer le rapport
   */
  generateReport() {
    const report = {
      summary: {
        totalFilesTransformed: this.transformedFiles.length,
        totalFilesRemoved: this.removedFiles.length,
      },
      transformedFiles: this.transformedFiles,
      removedFiles: this.removedFiles,
    };

    return report;
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const json = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, json, 'utf-8');
    console.log(`\nSST Transformation Report saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_SST_REPORT.json');

const transformer = new ContractSSTTransformer(rootPath);
transformer.transform();
transformer.saveReport(outputPath);
