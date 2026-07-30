#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Repository Audit
 * PHASE 1: Repository Audit
 */

const { readFileSync, writeFileSync, existsSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

class RepositoryAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.stats = {
      totalFiles: 0,
      sourceFiles: 0,
      generatedFiles: 0,
      duplicatedFiles: 0,
      generatedContracts: 0,
      packages: 0,
      sdks: 0,
      compilerModules: 0,
      runtimeModules: 0,
      cvmModules: 0,
      cprModules: 0,
    };
  }

  /**
   * Exécuter l'audit
   */
  async audit() {
    console.log('Starting repository audit...\n');

    this.countFiles();
    this.analyzePackages();
    this.analyzeCompiler();
    this.analyzeRuntime();
    this.analyzeCVM();
    this.analyzeCPR();
    this.analyzeContracts();
    this.analyzeGenerated();

    const report = this.generateReport();
    this.saveReport(report);

    console.log('\nRepository audit complete.');
    console.log(`Total files: ${this.stats.totalFiles}`);
    console.log(`Source files: ${this.stats.sourceFiles}`);
    console.log(`Generated files: ${this.stats.generatedFiles}`);
    console.log(`Packages: ${this.stats.packages}`);
    console.log(`Compiler modules: ${this.stats.compilerModules}`);
    console.log(`CVM modules: ${this.stats.cvmModules}`);
    console.log(`CPR modules: ${this.stats.cprModules}`);
  }

  /**
   * Compter les fichiers
   */
  countFiles() {
    const countDir = (dir) => {
      if (!existsSync(dir)) return;
      
      const items = readdirSync(dir);
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (item !== 'node_modules' && item !== '.git' && item !== '.next' && item !== 'dist' && item !== 'build') {
            countDir(fullPath);
          }
        } else {
          this.stats.totalFiles++;
          
          if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx')) {
            this.stats.sourceFiles++;
          }
          
          if (item.includes('.generated.') || item.includes('GENERATED')) {
            this.stats.generatedFiles++;
          }
        }
      }
    };

    countDir(this.rootPath);
  }

  /**
   * Analyser les packages
   */
  analyzePackages() {
    const packagesDir = join(this.rootPath, 'packages');
    const appsDir = join(this.rootPath, 'apps');

    if (existsSync(packagesDir)) {
      const items = readdirSync(packagesDir);
      for (const item of items) {
        const fullPath = join(packagesDir, item);
        if (statSync(fullPath).isDirectory()) {
          this.stats.packages++;
          if (item.includes('sdk')) {
            this.stats.sdks++;
          }
        }
      }
    }

    if (existsSync(appsDir)) {
      const items = readdirSync(appsDir);
      for (const item of items) {
        const fullPath = join(appsDir, item);
        if (statSync(fullPath).isDirectory()) {
          this.stats.packages++;
        }
      }
    }
  }

  /**
   * Analyser le compilateur
   */
  analyzeCompiler() {
    const compilerDir = join(this.rootPath, 'compiler');
    if (!existsSync(compilerDir)) return;

    const countModules = (dir) => {
      if (!existsSync(dir)) return 0;
      
      const items = readdirSync(dir);
      let count = 0;
      
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          count++;
          count += countModules(fullPath);
        }
      }
      
      return count;
    };

    this.stats.compilerModules = countModules(compilerDir);
  }

  /**
   * Analyser le runtime
   */
  analyzeRuntime() {
    const runtimeDir = join(this.rootPath, 'runtime');
    if (!existsSync(runtimeDir)) return;

    const countModules = (dir) => {
      if (!existsSync(dir)) return 0;
      
      const items = readdirSync(dir);
      let count = 0;
      
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          count++;
          count += countModules(fullPath);
        }
      }
      
      return count;
    };

    this.stats.runtimeModules = countModules(runtimeDir);
  }

  /**
   * Analyser CVM
   */
  analyzeCVM() {
    const cvmDir = join(this.rootPath, 'compiler/cvm');
    if (!existsSync(cvmDir)) return;

    const items = readdirSync(cvmDir);
    for (const item of items) {
      const fullPath = join(cvmDir, item);
      if (statSync(fullPath).isDirectory()) {
        this.stats.cvmModules++;
      } else if (item.endsWith('.ts')) {
        this.stats.cvmModules++;
      }
    }
  }

  /**
   * Analyser CPR
   */
  analyzeCPR() {
    const cprDir = join(this.rootPath, 'compiler/cpr');
    if (!existsSync(cprDir)) return;

    const items = readdirSync(cprDir);
    for (const item of items) {
      const fullPath = join(cprDir, item);
      if (statSync(fullPath).isDirectory()) {
        this.stats.cprModules++;
      } else if (item.endsWith('.ts')) {
        this.stats.cprModules++;
      }
    }
  }

  /**
   * Analyser les contrats
   */
  analyzeContracts() {
    const domainDir = join(this.rootPath, 'domain');
    if (!existsSync(domainDir)) return;

    const items = readdirSync(domainDir);
    for (const item of items) {
      if (item.endsWith('.contract.ts')) {
        this.stats.generatedContracts++;
      }
    }
  }

  /**
   * Analyser les fichiers générés
   */
  analyzeGenerated() {
    // Compter les fichiers dans les répertoires générés
    const generatedDirs = [
      'compiler/ast',
      'compiler/semantic',
      'compiler/type-system',
      'compiler/bytecode',
      'compiler/builder',
      'compiler/optimizer',
      'packages/blueprint-pm',
      'packages/blueprint-healing',
      'packages/blueprint-validation',
      'tests/unit',
      'tests/integration',
      'benchmarks',
      'devtools',
      'schemas',
      'api',
    ];

    for (const dir of generatedDirs) {
      const fullPath = join(this.rootPath, dir);
      if (existsSync(fullPath)) {
        const count = this.countFilesInDir(fullPath);
        this.stats.generatedFiles += count;
      }
    }
  }

  /**
   * Compter les fichiers dans un répertoire
   */
  countFilesInDir(dir) {
    if (!existsSync(dir)) return 0;
    
    let count = 0;
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        count += this.countFilesInDir(fullPath);
      } else {
        count++;
      }
    }
    
    return count;
  }

  /**
   * Générer le rapport
   */
  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      repository: this.rootPath,
      stats: this.stats,
      details: {
        packageManager: 'pnpm',
        nodeVersion: '>=18',
        pnpmVersion: '>=8',
        monorepo: true,
        workspaces: ['apps', 'packages'],
      },
    };
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport(report) {
    const outputDir = join(this.rootPath, 'reports/final');
    const { mkdirSync } = require('fs');
    
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = join(outputDir, 'repository-audit.json');
    writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new RepositoryAuditor(rootPath);
auditor.audit();
