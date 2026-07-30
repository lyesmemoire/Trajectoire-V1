#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Master Index Builder
 * 
 * OBJECTIF 1: Scanner le dépôt et construire le MASTER INDEX
 * 
 * Scan tous les fichiers TypeScript et extrait:
 * - Composants
 * - Interfaces
 * - Contrats
 * - Types
 * - Objets
 * - États
 * - Événements
 * - Graphes
 * - Algorithmes
 * - APIs
 * - Packages
 * - Dépendances
 * - Modules
 */

const { readFileSync, readdirSync, statSync, existsSync } = require('fs');
const { join, relative, extname } = require('path');

class MasterIndexBuilder {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.index = {
      components: new Map(),
      interfaces: new Map(),
      contracts: new Map(),
      types: new Map(),
      enums: new Map(),
      classes: new Map(),
      functions: new Map(),
      variables: new Map(),
      modules: new Map(),
      dependencies: new Map(),
      exports: new Map(),
      imports: new Map(),
      files: new Map(),
    };
    this.fileCount = 0;
  }

  /**
   * Scan le dépôt complet
   */
  scan() {
    console.log('Scanning repository...');
    this.scanDirectory(this.rootPath);
    console.log(`Scanned ${this.fileCount} TypeScript files`);
  }

  /**
   * Scan un répertoire récursivement
   */
  scanDirectory(dir) {
    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Ignorer node_modules, .git, etc.
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
    ];
    return ignoreList.includes(name);
  }

  /**
   * Analyser un fichier TypeScript
   */
  analyzeFile(filePath) {
    this.fileCount++;
    const relativePath = relative(this.rootPath, filePath);
    const content = readFileSync(filePath, 'utf-8');

    const fileInfo = {
      path: relativePath,
      size: content.length,
      interfaces: [],
      types: [],
      enums: [],
      classes: [],
      functions: [],
      variables: [],
      exports: [],
      imports: [],
    };

    // Extraire les interfaces
    const interfaceMatches = content.matchAll(/export\s+(?:interface|type)\s+(\w+)/g);
    for (const match of interfaceMatches) {
      const name = match[1];
      fileInfo.interfaces.push(name);
      this.index.interfaces.set(name, {
        name,
        file: relativePath,
        type: 'interface',
      });
    }

    // Extraire les types
    const typeMatches = content.matchAll(/export\s+type\s+(\w+)/g);
    for (const match of typeMatches) {
      const name = match[1];
      fileInfo.types.push(name);
      this.index.types.set(name, {
        name,
        file: relativePath,
        type: 'type',
      });
    }

    // Extraire les enums
    const enumMatches = content.matchAll(/export\s+enum\s+(\w+)/g);
    for (const match of enumMatches) {
      const name = match[1];
      fileInfo.enums.push(name);
      this.index.enums.set(name, {
        name,
        file: relativePath,
        type: 'enum',
      });
    }

    // Extraire les classes
    const classMatches = content.matchAll(/export\s+class\s+(\w+)/g);
    for (const match of classMatches) {
      const name = match[1];
      fileInfo.classes.push(name);
      this.index.classes.set(name, {
        name,
        file: relativePath,
        type: 'class',
      });
    }

    // Extraire les fonctions
    const functionMatches = content.matchAll(/export\s+(?:async\s+)?function\s+(\w+)/g);
    for (const match of functionMatches) {
      const name = match[1];
      fileInfo.functions.push(name);
      this.index.functions.set(name, {
        name,
        file: relativePath,
        type: 'function',
      });
    }

    // Extraire les exports
    const exportMatches = content.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g);
    for (const match of exportMatches) {
      const module = match[1];
      fileInfo.exports.push(module);
      this.index.exports.set(module, {
        module,
        file: relativePath,
        type: 'export',
      });
    }

    // Extraire les imports
    const importMatches = content.matchAll(/import\s+\{[^}]+\}\s+from\s+['"]([^'"]+)['"]/g);
    for (const match of importMatches) {
      const module = match[1];
      fileInfo.imports.push(module);
      
      if (!this.index.imports.has(module)) {
        this.index.imports.set(module, []);
      }
      this.index.imports.get(module).push(relativePath);
    }

    this.index.files.set(relativePath, fileInfo);
  }

  /**
   * Générer le rapport
   */
  generateReport() {
    const report = {
      summary: {
        totalFiles: this.fileCount,
        totalInterfaces: this.index.interfaces.size,
        totalTypes: this.index.types.size,
        totalEnums: this.index.enums.size,
        totalClasses: this.index.classes.size,
        totalFunctions: this.index.functions.size,
        totalExports: this.index.exports.size,
        totalImports: this.index.imports.size,
      },
      interfaces: Array.from(this.index.interfaces.entries()).map(([name, info]) => ({ name, ...info })),
      types: Array.from(this.index.types.entries()).map(([name, info]) => ({ name, ...info })),
      enums: Array.from(this.index.enums.entries()).map(([name, info]) => ({ name, ...info })),
      classes: Array.from(this.index.classes.entries()).map(([name, info]) => ({ name, ...info })),
      functions: Array.from(this.index.functions.entries()).map(([name, info]) => ({ name, ...info })),
      exports: Array.from(this.index.exports.entries()).map(([name, info]) => ({ name, ...info })),
      imports: Array.from(this.index.imports.entries()).map(([module, files]) => ({ module, files })),
      files: Array.from(this.index.files.entries()).map(([path, info]) => ({ path, ...info })),
    };

    return report;
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const json = JSON.stringify(report, null, 2);
    require('fs').writeFileSync(outputPath, json, 'utf-8');
    console.log(`\nMaster Index saved to ${outputPath}`);
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    const report = this.generateReport();
    console.log('\n=== MASTER INDEX SUMMARY ===');
    console.log(`Total Files: ${report.summary.totalFiles}`);
    console.log(`Total Interfaces: ${report.summary.totalInterfaces}`);
    console.log(`Total Types: ${report.summary.totalTypes}`);
    console.log(`Total Enums: ${report.summary.totalEnums}`);
    console.log(`Total Classes: ${report.summary.totalClasses}`);
    console.log(`Total Functions: ${report.summary.totalFunctions}`);
    console.log(`Total Exports: ${report.summary.totalExports}`);
    console.log(`Total Imports: ${report.summary.totalImports}`);
    console.log('============================\n');
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_MASTER_INDEX.json');

const builder = new MasterIndexBuilder(rootPath);
builder.scan();
builder.printSummary();
builder.saveReport(outputPath);
