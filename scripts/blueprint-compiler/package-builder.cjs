#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Package Builder
 * 
 * Phase 11: Build official package containing Canonical Model, Symbol Table, AST, Contracts, Runtime, Generated Interfaces, Documentation, Checksums, Metadata, Manifest
 */

const { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, createReadStream, createWriteStream } = require('fs');
const { join, dirname } = require('path');
const { createHash } = require('crypto');
const { execSync } = require('child_process');

class BlueprintPackageBuilder {
  constructor(rootPath, outputPath) {
    this.rootPath = rootPath;
    this.outputPath = outputPath;
    this.packageContents = new Map();
    this.checksums = new Map();
    this.metadata = {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      buildId: createHash('md5').update(Date.now().toString()).digest('hex')
    };
  }

  /**
   * Add file to package
   */
  addFile(sourcePath, packagePath) {
    const content = readFileSync(sourcePath);
    const checksum = createHash('sha256').update(content).digest('hex');
    
    this.packageContents.set(packagePath, {
      sourcePath,
      checksum,
      size: content.length
    });
    
    this.checksums.set(packagePath, checksum);
  }

  /**
   * Add directory to package
   */
  addDirectory(sourceDir, packageDir) {
    const items = readdirSync(sourceDir);
    
    for (const item of items) {
      const sourcePath = join(sourceDir, item);
      const stat = statSync(sourcePath);
      
      if (stat.isDirectory()) {
        this.addDirectory(sourcePath, join(packageDir, item));
      } else if (stat.isFile()) {
        this.addFile(sourcePath, join(packageDir, item));
      }
    }
  }

  /**
   * Build package
   */
  build() {
    console.log('Building Blueprint Package...\n');

    // Add Canonical Model
    console.log('Adding Canonical Model...');
    const canonicalModelPath = join(this.rootPath, 'BLUEPRINT_CANONICAL_MODEL.md');
    if (existsSync(canonicalModelPath)) {
      this.addFile(canonicalModelPath, 'canonical-model/BLUEPRINT_CANONICAL_MODEL.md');
    }

    // Add Symbol Table
    console.log('Adding Symbol Table...');
    const symbolTablePath = join(this.rootPath, 'BLUEPRINT_SYMBOL_TABLE.json');
    if (existsSync(symbolTablePath)) {
      this.addFile(symbolTablePath, 'symbol-table/BLUEPRINT_SYMBOL_TABLE.json');
    }

    // Add AST
    console.log('Adding AST...');
    const astPath = join(this.rootPath, 'BLUEPRINT_CANONICAL_AST.json');
    if (existsSync(astPath)) {
      this.addFile(astPath, 'ast/BLUEPRINT_CANONICAL_AST.json');
    }

    // Add Semantic Graph
    console.log('Adding Semantic Graph...');
    const semanticGraphPath = join(this.rootPath, 'BLUEPRINT_SEMANTIC_GRAPH.json');
    if (existsSync(semanticGraphPath)) {
      this.addFile(semanticGraphPath, 'semantic-graph/BLUEPRINT_SEMANTIC_GRAPH.json');
    }

    // Add Contracts
    console.log('Adding Contracts...');
    const contractsDir = join(this.rootPath, 'BLUEPRINT_GENERATED', 'contracts');
    if (existsSync(contractsDir)) {
      this.addDirectory(contractsDir, 'contracts');
    }

    // Add Generated Interfaces
    console.log('Adding Generated Interfaces...');
    const interfacesDir = join(this.rootPath, 'BLUEPRINT_GENERATED', 'generated-interfaces');
    if (existsSync(interfacesDir)) {
      this.addDirectory(interfacesDir, 'generated-interfaces');
    }

    // Add Runtime
    console.log('Adding Runtime...');
    const runtimeDir = join(this.rootPath, 'BLUEPRINT_GENERATED');
    if (existsSync(runtimeDir)) {
      this.addDirectory(runtimeDir, 'runtime');
    }

    // Add Documentation
    console.log('Adding Documentation...');
    const docsDir = join(this.rootPath, 'BLUEPRINT_GENERATED', 'documentation');
    if (existsSync(docsDir)) {
      this.addDirectory(docsDir, 'documentation');
    }

    // Add Multi-Language Generated Files
    console.log('Adding Multi-Language Generated Files...');
    const multiLangDir = join(this.rootPath, 'BLUEPRINT_MULTI_LANG_GENERATED');
    if (existsSync(multiLangDir)) {
      this.addDirectory(multiLangDir, 'multi-lang');
    }

    // Add Reports
    console.log('Adding Reports...');
    const reports = [
      'BLUEPRINT_ANALYSIS_INDEX.json',
      'BLUEPRINT_SMART_DETECTION_REPORT.json',
      'BLUEPRINT_MODIFICATION_REPORT.json',
      'BLUEPRINT_CONTRACT_CLEANUP_REPORT.json',
      'BLUEPRINT_TYPESCRIPT_CLEANUP_REPORT.json',
      'BLUEPRINT_OWNERSHIP_REPORT.json',
      'BLUEPRINT_DEPENDENCY_REPORT.json',
      'BLUEPRINT_NORMALIZATION_REPORT.json',
      'BLUEPRINT_LINTER_REPORT.json',
      'BLUEPRINT_VALIDATOR_REPORT.json',
      'BLUEPRINT_SELF_HEALING_REPORT.json',
      'BLUEPRINT_REFACTORING_REPORT.json',
      'BLUEPRINT_OPTIMIZATION_REPORT.json',
      'BLUEPRINT_INCREMENTAL_COMPILATION_REPORT.json',
      'BLUEPRINT_ENTERPRISE_VALIDATION_REPORT.json'
    ];

    for (const report of reports) {
      const reportPath = join(this.rootPath, report);
      if (existsSync(reportPath)) {
        this.addFile(reportPath, `reports/${report}`);
      }
    }

    console.log(`\nPackage contains ${this.packageContents.size} files`);
  }

  /**
   * Generate manifest
   */
  generateManifest() {
    const manifest = {
      version: this.metadata.version,
      buildId: this.metadata.buildId,
      createdAt: this.metadata.createdAt,
      totalFiles: this.packageContents.size,
      totalSize: Array.from(this.packageContents.values()).reduce((sum, f) => sum + f.size, 0),
      contents: Array.from(this.packageContents.entries()).map(([path, meta]) => ({
        path,
        checksum: meta.checksum,
        size: meta.size
      })),
      checksums: Object.fromEntries(this.checksums)
    };

    return manifest;
  }

  /**
   * Write package to output directory
   */
  writePackage() {
    console.log('\nWriting package to output directory...');

    // Create output directory
    mkdirSync(this.outputPath, { recursive: true });

    // Write all files
    for (const [packagePath, meta] of this.packageContents) {
      const outputPath = join(this.outputPath, packagePath);
      mkdirSync(dirname(outputPath), { recursive: true });
      
      const content = readFileSync(meta.sourcePath);
      writeFileSync(outputPath, content);
    }

    // Write manifest
    const manifest = this.generateManifest();
    const manifestPath = join(this.outputPath, 'BLUEPRINT_PACKAGE_MANIFEST.json');
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`Package written to ${this.outputPath}`);
    console.log(`Manifest written to ${manifestPath}`);
  }

  /**
   * Create archive (tar.gz)
   */
  createArchive() {
    console.log('\nCreating archive...');
    
    try {
      const archiveName = `blueprint-package-${this.metadata.buildId}.tar.gz`;
      const archivePath = join(this.rootPath, archiveName);
      
      // Use tar command if available, otherwise skip
      try {
        execSync(`cd ${this.outputPath} && tar -czf ${archivePath} .`, { stdio: 'inherit' });
        console.log(`Archive created: ${archivePath}`);
        return archivePath;
      } catch (e) {
        console.log('tar command not available, skipping archive creation');
        return null;
      }
    } catch (e) {
      console.error(`Error creating archive: ${e.message}`);
      return null;
    }
  }

  /**
   * Generate package report
   */
  generateReport() {
    const manifest = this.generateManifest();

    const report = {
      timestamp: new Date().toISOString(),
      buildId: this.metadata.buildId,
      summary: {
        version: manifest.version,
        totalFiles: manifest.totalFiles,
        totalSize: manifest.totalSize,
        outputDirectory: this.outputPath
      },
      contents: {
        byType: {
          canonicalModel: 0,
          symbolTable: 0,
          ast: 0,
          semanticGraph: 0,
          contracts: 0,
          interfaces: 0,
          runtime: 0,
          documentation: 0,
          reports: 0,
          multiLang: 0
        }
      }
    };

    // Categorize files
    for (const [path, meta] of this.packageContents) {
      if (path.includes('canonical-model')) {
        report.contents.byType.canonicalModel++;
      } else if (path.includes('symbol-table')) {
        report.contents.byType.symbolTable++;
      } else if (path.includes('ast')) {
        report.contents.byType.ast++;
      } else if (path.includes('semantic-graph')) {
        report.contents.byType.semanticGraph++;
      } else if (path.includes('contracts')) {
        report.contents.byType.contracts++;
      } else if (path.includes('generated-interfaces')) {
        report.contents.byType.interfaces++;
      } else if (path.includes('runtime')) {
        report.contents.byType.runtime++;
      } else if (path.includes('documentation')) {
        report.contents.byType.documentation++;
      } else if (path.includes('reports')) {
        report.contents.byType.reports++;
      } else if (path.includes('multi-lang')) {
        report.contents.byType.multiLang++;
      }
    }

    return report;
  }

  /**
   * Save report
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`Package report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_PACKAGE');
  const reportPath = process.argv[4] || join(rootPath, 'BLUEPRINT_PACKAGE_REPORT.json');
  
  const builder = new BlueprintPackageBuilder(rootPath, outputPath);

  builder.build();
  builder.writePackage();
  builder.createArchive();

  console.log('\n=== PACKAGE SUMMARY ===');
  const report = builder.generateReport();
  console.log(`Build ID: ${report.buildId}`);
  console.log(`Total Files: ${report.summary.totalFiles}`);
  console.log(`Total Size: ${report.summary.totalSize} bytes`);
  console.log(`Output Directory: ${report.summary.outputPath}`);
  console.log('\nContents by Type:');
  for (const [type, count] of Object.entries(report.contents.byType)) {
    console.log(`  ${type}: ${count}`);
  }

  console.log('\nGenerating report...');
  builder.saveReport(reportPath);

  console.log('\n✅ PACKAGE BUILD COMPLETED');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BlueprintPackageBuilder };
