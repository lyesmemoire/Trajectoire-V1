#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Lint Audit
 * PHASE 4: Lint
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class LintAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      linterVersions: {},
      elapsedTimes: {},
      errors: [],
      warnings: [],
      fixesApplied: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter le lint
   */
  async lint() {
    console.log('Starting lint audit...\n');

    try {
      // Exécuter lint
      console.log('Running ESLint...');
      const startTime = Date.now();
      this.report.commands.push('pnpm lint');
      
      try {
        const output = this.exec('pnpm lint', { stdio: 'pipe' });
        this.report.elapsedTimes.lint = Date.now() - startTime;
        console.log(`Lint completed in ${this.report.elapsedTimes.lint}ms`);
        console.log(output);
        this.report.success = true;
        this.report.exitCode = 0;
      } catch (error) {
        this.report.errors.push(`Lint failed: ${error.message}`);
        this.report.exitCode = 1;
        console.log(`Lint errors found: ${error.message}`);

        // Tenter de réparer automatiquement
        console.log('\nAttempting to fix lint errors automatically...');
        try {
          this.exec('pnpm lint:fix', { stdio: 'pipe' });
          this.report.fixesApplied.push('Auto-fixed lint errors');
          console.log('Lint errors fixed automatically');

          // Réexécuter lint après réparation
          console.log('\nRe-running lint after fixes...');
          const fixStartTime = Date.now();
          const fixedOutput = this.exec('pnpm lint', { stdio: 'pipe' });
          this.report.elapsedTimes.lintAfterFix = Date.now() - fixStartTime;
          console.log(fixedOutput);
          this.report.success = true;
          this.report.exitCode = 0;
        } catch (fixError) {
          this.report.errors.push(`Auto-fix failed: ${fixError.message}`);
          console.log(`Auto-fix failed: ${fixError.message}`);
        }
      }

    } catch (error) {
      this.report.errors.push(`Lint error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nLint audit complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
  }

  /**
   * Exécuter une commande
   */
  exec(command, options = {}) {
    try {
      const result = execSync(command, {
        cwd: this.rootPath,
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
    
    const outputPath = join(outputDir, 'lint-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new LintAuditor(rootPath);
auditor.lint();
