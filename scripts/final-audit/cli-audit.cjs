#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise CLI Validation
 * PHASE 11: CLI Validation
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class CLIAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      elapsedTimes: {},
      cliCommands: [],
      errors: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter la validation CLI
   */
  async validate() {
    console.log('Starting CLI validation...\n');

    try {
      // Vérifier les commandes CLI disponibles
      console.log('Checking available CLI commands...');
      this.checkCLICommands();

      // Tester les commandes CLI
      console.log('\nTesting CLI commands...');
      this.testCLICommands();

      this.report.success = true;
      this.report.exitCode = 0;

    } catch (error) {
      this.report.errors.push(`CLI validation error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nCLI validation complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
    console.log(`CLI commands tested: ${this.report.cliCommands.length}`);
  }

  /**
   * Vérifier les commandes CLI disponibles
   */
  checkCLICommands() {
    const packageJsonPath = join(this.rootPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);
      if (packageJson.scripts) {
        console.log('Available npm scripts:');
        for (const scriptName of Object.keys(packageJson.scripts)) {
          console.log(`  - ${scriptName}`);
          this.report.cliCommands.push({
            name: scriptName,
            command: `pnpm ${scriptName}`,
            tested: false,
            exitCode: null,
          });
        }
      }
    }
  }

  /**
   * Tester les commandes CLI
   */
  testCLICommands() {
    // Tester quelques commandes de base
    const basicCommands = ['--version', 'build', 'lint'];
    
    for (const cmd of basicCommands) {
      console.log(`Testing pnpm ${cmd}...`);
      try {
        const startTime = Date.now();
        this.exec(`pnpm ${cmd}`, { stdio: 'pipe' });
        this.report.elapsedTimes[cmd] = Date.now() - startTime;
        
        // Marquer la commande comme testée
        const cliCmd = this.report.cliCommands.find(c => c.name === cmd);
        if (cliCmd) {
          cliCmd.tested = true;
          cliCmd.exitCode = 0;
        }
        console.log(`Successfully tested pnpm ${cmd}`);
      } catch (error) {
        const cliCmd = this.report.cliCommands.find(c => c.name === cmd);
        if (cliCmd) {
          cliCmd.tested = true;
          cliCmd.exitCode = 1;
        }
        console.log(`Failed to test pnpm ${cmd}: ${error.message}`);
      }
    }
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
    
    const outputPath = join(outputDir, 'cli-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new CLIAuditor(rootPath);
auditor.validate();
