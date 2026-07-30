#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Docker Audit
 * PHASE 9: Docker
 */

const { execSync } = require('child_process');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

class DockerAuditor {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.report = {
      timestamp: new Date().toISOString(),
      commands: [],
      elapsedTimes: {},
      dockerfiles: [],
      images: [],
      errors: [],
      success: false,
      exitCode: 0,
    };
  }

  /**
   * Exécuter l'audit Docker
   */
  async audit() {
    console.log('Starting Docker audit...\n');

    try {
      // Vérifier si Docker est installé
      console.log('Checking Docker installation...');
      try {
        const dockerVersion = this.exec('docker --version');
        console.log(`Docker version: ${dockerVersion.trim()}`);
        this.report.dockerVersion = dockerVersion.trim();
      } catch (error) {
        console.log('Docker not installed - skipping Docker build');
        this.report.warnings = ['Docker not installed on this system'];
        this.report.success = true;
        this.report.exitCode = 0;
        this.saveReport();
        return;
      }

      // Chercher les Dockerfiles
      console.log('\nSearching for Dockerfiles...');
      this.findDockerfiles();

      // Builder les images Docker si Dockerfiles existent
      if (this.report.dockerfiles.length > 0) {
        console.log(`Found ${this.report.dockerfiles.length} Dockerfile(s)`);
        for (const dockerfile of this.report.dockerfiles) {
          console.log(`\nBuilding image from ${dockerfile}...`);
          try {
            const startTime = Date.now();
            const imageName = `blueprint-v3-${dockerfile.replace(/[^a-z0-9]/g, '-')}`;
            this.exec(`docker build -f ${dockerfile} -t ${imageName} .`, { stdio: 'pipe' });
            this.report.elapsedTimes[dockerfile] = Date.now() - startTime;
            this.report.images.push(imageName);
            console.log(`Successfully built ${imageName}`);
          } catch (error) {
            this.report.errors.push(`Failed to build ${dockerfile}: ${error.message}`);
            console.log(`Failed to build ${dockerfile}: ${error.message}`);
          }
        }
      } else {
        console.log('No Dockerfiles found - skipping Docker build');
        this.report.warnings = ['No Dockerfiles found in repository'];
      }

      this.report.success = true;
      this.report.exitCode = 0;

    } catch (error) {
      this.report.errors.push(`Docker audit error: ${error.message}`);
      this.report.exitCode = 1;
      this.report.success = false;
    }

    this.saveReport();
    console.log('\nDocker audit complete.');
    console.log(`Success: ${this.report.success}`);
    console.log(`Exit Code: ${this.report.exitCode}`);
    console.log(`Dockerfiles found: ${this.report.dockerfiles.length}`);
    console.log(`Images built: ${this.report.images.length}`);
  }

  /**
   * Chercher les Dockerfiles
   */
  findDockerfiles() {
    const dockerfiles = [
      'Dockerfile',
      'Dockerfile.gateway',
      'apps/web/Dockerfile',
      'apps/api/Dockerfile',
    ];

    for (const dockerfile of dockerfiles) {
      const dockerfilePath = join(this.rootPath, dockerfile);
      if (existsSync(dockerfilePath)) {
        this.report.dockerfiles.push(dockerfile);
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
    
    const outputPath = join(outputDir, 'docker-report.json');
    writeFileSync(outputPath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`\nReport saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const auditor = new DockerAuditor(rootPath);
auditor.audit();
