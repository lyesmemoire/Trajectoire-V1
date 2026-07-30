#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Duplication Remover
 * 
 * OBJECTIF 4: Supprimer automatiquement les duplications
 * 
 * Stratégie:
 * - Une définition unique
 * - Les autres deviennent des références (imports)
 * - Suppression des fichiers vides
 * - Suppression des duplications de fichiers générés
 */

const { readFileSync, writeFileSync, unlinkSync, existsSync } = require('fs');
const { join } = require('path');

class DuplicationRemover {
  constructor(rootPath, duplicationReportPath) {
    this.rootPath = rootPath;
    this.duplicationReport = JSON.parse(readFileSync(duplicationReportPath, 'utf-8'));
    this.removedFiles = [];
    this.replacedFiles = [];
  }

  /**
   * Supprimer les duplications
   */
  remove() {
    console.log('Removing duplications...');
    
    this.removeEmptyFiles();
    this.removeGeneratedDuplicates();
    this.removeLibDuplicates();
    
    this.printSummary();
  }

  /**
   * Supprimer les fichiers vides
   */
  removeEmptyFiles() {
    console.log('Removing empty files...');
    
    // Chercher les fichiers avec très peu de contenu (taille <= 11)
    const emptyDup = this.duplicationReport.contentDuplications.find(d => d.hash === '0');
    
    if (emptyDup) {
      // Garder les fichiers dans lib/, supprimer ceux dans apps/web/src/lib
      for (const occ of emptyDup.occurrences) {
        const normalizedPath = occ.path.replace(/\\/g, '/');
        if (normalizedPath.startsWith('apps/web/src/lib')) {
          const fullPath = join(this.rootPath, normalizedPath);
          if (existsSync(fullPath)) {
            unlinkSync(fullPath);
            this.removedFiles.push(normalizedPath);
            console.log(`  Removed: ${normalizedPath}`);
          }
        }
      }
    }
  }

  /**
   * Supprimer les duplications de fichiers générés
   */
  removeGeneratedDuplicates() {
    console.log('Removing generated file duplicates...');
    
    // Pour chaque duplication de contenu
    for (const dup of this.duplicationReport.contentDuplications) {
      if (dup.occurrences.length < 2) continue;
      
      // Normaliser les chemins
      const normalizedOccurrences = dup.occurrences.map(o => ({
        ...o,
        normalizedPath: o.path.replace(/\\/g, '/')
      }));
      
      // Vérifier si ce sont des fichiers générés
      const generatedFiles = normalizedOccurrences.filter(o => 
        o.normalizedPath.includes('BLUEPRINT_GENERATED') || 
        o.normalizedPath.includes('BLUEPRINT_PACKAGE/generated-interfaces')
      );
      
      if (generatedFiles.length > 1) {
        // Garder BLUEPRINT_PACKAGE/runtime/generated-interfaces, supprimer les autres
        const canonical = generatedFiles.find(o => o.normalizedPath.includes('BLUEPRINT_PACKAGE/runtime/generated-interfaces'));
        
        if (canonical) {
          for (const occ of generatedFiles) {
            if (occ.normalizedPath !== canonical.normalizedPath) {
              const fullPath = join(this.rootPath, occ.normalizedPath);
              if (existsSync(fullPath)) {
                unlinkSync(fullPath);
                this.removedFiles.push(occ.normalizedPath);
                console.log(`  Removed: ${occ.normalizedPath}`);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Supprimer les duplications entre apps/web/src/lib et lib
   */
  removeLibDuplicates() {
    console.log('Removing lib duplicates...');
    
    for (const dup of this.duplicationReport.contentDuplications) {
      if (dup.occurrences.length < 2) continue;
      
      // Normaliser les chemins
      const normalizedOccurrences = dup.occurrences.map(o => ({
        ...o,
        normalizedPath: o.path.replace(/\\/g, '/')
      }));
      
      const appsLibFiles = normalizedOccurrences.filter(o => o.normalizedPath.startsWith('apps/web/src/lib'));
      const libFiles = normalizedOccurrences.filter(o => o.normalizedPath.startsWith('lib/') && !o.normalizedPath.startsWith('apps/'));
      
      if (appsLibFiles.length > 0 && libFiles.length > 0) {
        // Garder lib/, supprimer apps/web/src/lib
        for (const occ of appsLibFiles) {
          const fullPath = join(this.rootPath, occ.normalizedPath);
          if (existsSync(fullPath)) {
            unlinkSync(fullPath);
            this.removedFiles.push(occ.normalizedPath);
            console.log(`  Removed: ${occ.normalizedPath}`);
          }
        }
      }
    }
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    console.log('\n=== DUPLICATION REMOVAL SUMMARY ===');
    console.log(`Total Files Removed: ${this.removedFiles.length}`);
    console.log('===================================\n');

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
        totalFilesRemoved: this.removedFiles.length,
        totalFilesReplaced: this.replacedFiles.length,
      },
      removedFiles: this.removedFiles,
      replacedFiles: this.replacedFiles,
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
    console.log(`\nRemoval Report saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const duplicationReportPath = process.argv[3] || join(rootPath, 'BLUEPRINT_DUPLICATION_REPORT.json');
const outputPath = process.argv[4] || join(rootPath, 'BLUEPRINT_REMOVAL_REPORT.json');

const remover = new DuplicationRemover(rootPath, duplicationReportPath);
remover.remove();
remover.saveReport(outputPath);
