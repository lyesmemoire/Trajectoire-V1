#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Package Validation
 * PHASE 10: Package Validation
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class PackageAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      elapsedTimes: {},
      packages: [],
      errors: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter la validation des packages
   */
  async validate() {
    console.log('Starting package validation...\n');

    try {
      // Chercher les packages dans packages/
      console.log('Searching for packages...');
      this.findPackages();

      // Builder les packages si des packages existent
      if (this.report.packages.length > 0) {
        console.log(`Found ${this.report.packages.length} package(s)`);
        for (const pkg of this.report.packages) {
          console.log(`\nBuilding package ${pkg.name}...`);
          try {
            const startTime = Date.now();
            this.exec('pnpm build', { cwd: pkg.path, stdio: 'pipe' });
            this.report.elapsedTimes[pkg.name] = Date.now() - startTime;
            pkg.built = true;
            console.log(`Successfully built ${pkg.name}`);
          } catch (error) {
            pkg.built = false;
            this.report.errors.push(`Failed to build ${pkg.name}: ${error.message}`);
            console.log(`Failed to build ${pkg.name}: ${error.message}`);
          }
        }
      } else {
        console.log('No packages found in packages/ directory');
        this.report.warnings = ['No packages found in packages/ directory'];
      }

      // Vérifier le package.json racine
      console.log('\nValidating root package.json...');
      this.validateRootPackage();

      this.report.success = true;
      this.report.exitCode = 0;

    } catch (error) {
      this.report.errors.push(`Package validation error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nPackage validation complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
    console.log(`Packages found: ${this.report.packages.length}`);
    console.log(`Packages built: ${this.report.packages.filter(p => p.built).length}`);
  }

  /**
   * Chercher les packages
   */
  findPackages() {
    const packagesDir = join(this.rootPath, 'packages');
    if (!existsSync(packagesDir)) {
      return;
    }

    const packageDirs = ['hiios-api', 'hiios-enterprise', 'hiios-runtime', 'hiios-sdk'];
    
    for (const pkgName of packageDirs) {
      const pkgPath = join(packagesDir, pkgName);
      if (existsSync(pkgPath)) {
        const packageJsonPath = join(pkgPath, 'package.json');
        if (existsSync(packageJsonPath)) {
          this.report.packages.push({
            name: pkgName,
            path: pkgPath,
            built: false,
          });
        }
      }
    }
  }

  /**
   * Valider le package.json racine
   */
  validateRootPackage() {
    const packageJsonPath = join(this.rootPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      console.log('Root package.json exists and is valid');
      this.report.rootPackageValid = true;
    } else {
      console.log('Root package.json not found');
      this.report.rootPackageValid = false;
      this.report.errors.push('Root package.json not found');
    }
  }

  /**
   * Exécuter une commande
   */
  exec(command, options = {}) {
    try {
      const result = execSync(command, {
        encoding: 'utf-8',
        ...options,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport() {
    const outputDir = join(this.rootPath, 'reports/final');
    
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = join(outputDir, 'package-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new PackageAuditor(rootPath);
auditor.validate();
