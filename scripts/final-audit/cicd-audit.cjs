#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise CI/CD Validation
 * PHASE 12: CI/CD
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync, readFileSync } = require('fs');
const { join } = require('path');

class CICDAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      elapsedTimes: {},
      workflows: [],
      errors: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter la validation CI/CD
   */
  async validate() {
    console.log('Starting CI/CD validation...\n');

    try {
      // Chercher les workflows GitHub Actions
      console.log('Searching for GitHub Actions workflows...');
      this.findWorkflows();

      // Valider les workflows
      console.log(`\nFound ${this.report.workflows.length} workflow(s)`);
      this.validateWorkflows();

      this.report.success = true;
      this.report.exitCode = 0;

    } catch (error) {
      this.report.errors.push(`CI/CD validation error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nCI/CD validation complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
    console.log(`Workflows found: ${this.report.workflows.length}`);
    console.log(`Workflows valid: ${this.report.workflows.filter(w => w.valid).length}`);
  }

  /**
   * Chercher les workflows
   */
  findWorkflows() {
    const workflowsDir = join(this.rootPath, '.github/workflows');
    if (!existsSync(workflowsDir)) {
      console.log('No .github/workflows directory found');
      return;
    }

    const workflowFiles = [
      'ci-cd.yml',
      'ci.yml',
      'ai-quality-validation.yml',
    ];

    for (const workflowFile of workflowFiles) {
      const workflowPath = join(workflowsDir, workflowFile);
      if (existsSync(workflowPath)) {
        try {
          const content = readFileSync(workflowPath, 'utf-8');
          this.report.workflows.push({
            name: workflowFile,
            path: workflowPath,
            valid: true,
            content: content.substring(0, 500) + '...', // Truncate for report
          });
          console.log(`Found workflow: ${workflowFile}`);
        } catch (error) {
          this.report.workflows.push({
            name: workflowFile,
            path: workflowPath,
            valid: false,
            error: error.message,
          });
          console.log(`Error reading workflow ${workflowFile}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Valider les workflows
   */
  validateWorkflows() {
    for (const workflow of this.report.workflows) {
      if (workflow.content) {
        // Basic validation: check for required fields
        const hasName = workflow.content.includes('name:');
        const hasOn = workflow.content.includes('on:');
        const hasJobs = workflow.content.includes('jobs:');

        if (hasName && hasOn && hasJobs) {
          workflow.valid = true;
          console.log(`Workflow ${workflow.name} is valid`);
        } else {
          workflow.valid = false;
          workflow.errors = [];
          if (!hasName) workflow.errors.push('Missing name field');
          if (!hasOn) workflow.errors.push('Missing on field');
          if (!hasJobs) workflow.errors.push('Missing jobs field');
          console.log(`Workflow ${workflow.name} is invalid: ${workflow.errors.join(', ')}`);
        }
      }
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
    
    const outputPath = join(outputDir, 'cicd-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new CICDAuditor(rootPath);
auditor.validate();
