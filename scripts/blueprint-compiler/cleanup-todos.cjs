#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise TODO Cleanup
 * 
 * OBJECTIF 6: Supprimer tous les TODO, placeholders, mocks, FIXME, NotImplemented, pseudo-code
 */

const { readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const { join, relative, extname } = require('path');

class TodoCleanup {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.findings = {
      todo: [],
      fixme: [],
      placeholder: [],
      mock: [],
      notImplemented: [],
      pseudoCode: [],
    };
    this.fixedFiles = [];
  }

  /**
   * Nettoyer les fichiers
   */
  cleanup() {
    console.log('Cleaning up TODOs, placeholders, mocks, FIXME, NotImplemented...');
    this.scanDirectory(this.rootPath);
    this.printSummary();
  }

  /**
   * Scanner un répertoire
   */
  scanDirectory(dir) {
    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          if (!this.shouldIgnoreDirectory(entry)) {
            this.scanDirectory(fullPath);
          }
        } else if (stat.isFile() && extname(entry) === '.ts') {
          this.analyzeFile(fullPath);
        }
      }
    } catch (error) {
      // Ignorer les erreurs d'accès
    }
  }

  /**
   * Vérifier si un répertoire doit être ignoré
   */
  shouldIgnoreDirectory(name) {
    const ignoreList = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      '.turbo',
      'coverage',
      '.cache',
      '.stryker-tmp',
    ];
    return ignoreList.includes(name);
  }

  /**
   * Analyser un fichier
   */
  analyzeFile(filePath) {
    const relativePath = relative(this.rootPath, filePath);
    const content = readFileSync(filePath, 'utf-8');

    let modified = false;
    let newContent = content;

    // Détecter et supprimer TODO
    const todoMatches = content.matchAll(/\/\/ TODO.*/g);
    for (const match of todoMatches) {
      this.findings.todo.push({ file: relativePath, text: match[0] });
      newContent = newContent.replace(match[0], '');
      modified = true;
    }

    // Détecter et supprimer FIXME
    const fixmeMatches = content.matchAll(/\/\/ FIXME.*/g);
    for (const match of fixmeMatches) {
      this.findings.fixme.push({ file: relativePath, text: match[0] });
      newContent = newContent.replace(match[0], '');
      modified = true;
    }

    // Détecter et supprimer placeholders
    const placeholderMatches = content.matchAll(/\/\/ PLACEHOLDER.*/g);
    for (const match of placeholderMatches) {
      this.findings.placeholder.push({ file: relativePath, text: match[0] });
      newContent = newContent.replace(match[0], '');
      modified = true;
    }

    // Détecter et supprimer MOCK
    const mockMatches = content.matchAll(/\/\/ MOCK.*/g);
    for (const match of mockMatches) {
      this.findings.mock.push({ file: relativePath, text: match[0] });
      newContent = newContent.replace(match[0], '');
      modified = true;
    }

    // Détecter et supprimer NotImplemented
    const notImplementedMatches = content.matchAll(/\/\/ NotImplemented.*/g);
    for (const match of notImplementedMatches) {
      this.findings.notImplemented.push({ file: relativePath, text: match[0] });
      newContent = newContent.replace(match[0], '');
      modified = true;
    }

    // Détecter et supprimer pseudo-code (commentaires avec "pseudo" ou "example")
    const pseudoCodeMatches = content.matchAll(/\/\/ (pseudo|example).*/gi);
    for (const match of pseudoCodeMatches) {
      this.findings.pseudoCode.push({ file: relativePath, text: match[0] });
      newContent = newContent.replace(match[0], '');
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, newContent, 'utf-8');
      this.fixedFiles.push(relativePath);
    }
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    console.log('\n=== TODO CLEANUP SUMMARY ===');
    console.log(`TODOs found: ${this.findings.todo.length}`);
    console.log(`FIXMEs found: ${this.findings.fixme.length}`);
    console.log(`PLACEHOLDERs found: ${this.findings.placeholder.length}`);
    console.log(`MOCKs found: ${this.findings.mock.length}`);
    console.log(`NotImplemented found: ${this.findings.notImplemented.length}`);
    console.log(`Pseudo-code found: ${this.findings.pseudoCode.length}`);
    console.log(`Total files fixed: ${this.fixedFiles.length}`);
    console.log('==========================\n');

    if (this.fixedFiles.length > 0) {
      console.log('FIXED FILES (first 20):');
      for (let i = 0; i < Math.min(20, this.fixedFiles.length); i++) {
        console.log(`  - ${this.fixedFiles[i]}`);
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
        totalTodo: this.findings.todo.length,
        totalFixme: this.findings.fixme.length,
        totalPlaceholder: this.findings.placeholder.length,
        totalMock: this.findings.mock.length,
        totalNotImplemented: this.findings.notImplemented.length,
        totalPseudoCode: this.findings.pseudoCode.length,
        totalFilesFixed: this.fixedFiles.length,
      },
      findings: this.findings,
      fixedFiles: this.fixedFiles,
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
    console.log(`\nTODO Cleanup Report saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_TODO_CLEANUP_REPORT.json');

const cleaner = new TodoCleanup(rootPath);
cleaner.cleanup();
cleaner.saveReport(outputPath);
