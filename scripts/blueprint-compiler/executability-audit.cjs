#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Executability Audit
 * 
 * MISSION 1: Audit d'exécutabilité - Identifier tout ce qui est statique, décrit, non utilisé, non compilé, redondant
 */

const { readFileSync, existsSync, readdirSync, statSync } = require('fs');
const { join, extname } = require('path');

class ExecutabilityAudit {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.files = new Map();
    this.categories = {
      static: new Set(),
      compilable: new Set(),
      executable: new Set(),
      documentary: new Set(),
      unused: new Set(),
      redundant: new Set(),
      generated: new Set()
    };
    this.scores = {
      executability: 0,
      compilation: 0,
      runtime: 0,
      cognitive: 0,
      orchestration: 0,
      observability: 0,
      determinism: 0
    };
  }

  /**
   * Scan all files
   */
  scanFiles() {
    console.log('Scanning files...');
    this.scanDirectory(this.rootPath, '');
    console.log(`Scanned ${this.files.size} files`);
  }

  /**
   * Scan directory recursively
   */
  scanDirectory(dirPath, relativePath) {
    try {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = join(dirPath, item);
        const itemRelativePath = join(relativePath, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules, .git, .next, etc.
          if (!item.startsWith('.') && item !== 'node_modules' && item !== 'dist' && item !== 'build') {
            this.scanDirectory(fullPath, itemRelativePath);
          }
        } else if (stat.isFile()) {
          this.files.set(itemRelativePath, {
            path: fullPath,
            relativePath: itemRelativePath,
            extension: extname(item),
            size: stat.size,
            category: null
          });
        }
      }
    } catch (e) {
      // Skip directories we can't read
    }
  }

  /**
   * Categorize files
   */
  categorizeFiles() {
    console.log('Categorizing files...');
    
    for (const [path, file] of this.files) {
      const category = this.categorizeFile(path, file);
      file.category = category;
      this.categories[category].add(path);
    }
    
    console.log('File categories:');
    for (const [category, files] of Object.entries(this.categories)) {
      console.log(`  ${category}: ${files.size}`);
    }
  }

  /**
   * Categorize individual file
   */
  categorizeFile(path, file) {
    // Documentary files
    if (file.extension === '.md') {
      // Check if it's in architecture or docs
      if (path.includes('architecture/') || path.includes('docs/') || path.includes('BCM/') || path.includes('BSC/') || path.includes('BRM/') || path.includes('COS/') || path.includes('CVM/') || path.includes('CPR/') || path.includes('BEA/')) {
        return 'documentary';
      }
      // Check if it's a report
      if (path.includes('AUDIT') || path.includes('REPORT') || path.includes('ANALYSE')) {
        return 'documentary';
      }
      return 'static';
    }
    
    // Generated files
    if (path.includes('BLUEPRINT_GENERATED') || path.includes('BLUEPRINT_MULTI_LANG_GENERATED')) {
      return 'generated';
    }
    
    // Compilable files
    if (['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.rs', '.go', '.java', '.kt', '.cs', '.py'].includes(file.extension)) {
      // Check if it's in scripts - likely executable
      if (path.includes('scripts/') || path.includes('bin/')) {
        return 'executable';
      }
      // Check if it's in tests
      if (path.includes('tests/') || path.includes('__tests__') || path.includes('.test.') || path.includes('.spec.')) {
        return 'compilable';
      }
      // Check if it's in source
      if (path.includes('src/') || path.includes('lib/') || path.includes('apps/')) {
        return 'compilable';
      }
      return 'executable';
    }
    
    // Configuration files
    if (['.json', '.yaml', '.yml', '.toml', '.ini', '.conf', '.config'].includes(file.extension)) {
      return 'static';
    }
    
    // Schema files
    if (['.graphql', '.proto', '.avsc'].includes(file.extension)) {
      return 'compilable';
    }
    
    // Build files
    if (['.dockerfile', 'Dockerfile', 'Makefile', 'CMakeLists.txt'].includes(file.extension) || file.extension === '') {
      return 'executable';
    }
    
    return 'static';
  }

  /**
   * Detect unused files
   */
  detectUnused() {
    console.log('Detecting unused files...');
    
    // Simple heuristic: files not imported/referenced
    const imports = new Map();
    
    for (const [path, file] of this.files) {
      if (file.category === 'compilable' || file.category === 'executable') {
        try {
          const content = readFileSync(file.path, 'utf-8');
          
          // Extract imports
          const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
          let match;
          while ((match = importRegex.exec(content)) !== null) {
            const importedPath = match[1];
            if (!imports.has(importedPath)) {
              imports.set(importedPath, new Set());
            }
            imports.get(importedPath).add(path);
          }
          
          // Extract requires
          const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
          while ((match = requireRegex.exec(content)) !== null) {
            const requiredPath = match[1];
            if (!imports.has(requiredPath)) {
              imports.set(requiredPath, new Set());
            }
            imports.get(requiredPath).add(path);
          }
        } catch (e) {
          // Skip files we can't read
        }
      }
    }
    
    // Files not imported by anything
    for (const [path, file] of this.files) {
      if (file.category === 'compilable' && !imports.has(path) && !imports.has('./' + path)) {
        this.categories.unused.add(path);
      }
    }
    
    console.log(`Detected ${this.categories.unused.size} potentially unused files`);
  }

  /**
   * Detect redundant files
   */
  detectRedundant() {
    console.log('Detecting redundant files...');
    
    // Check for duplicate file names
    const nameMap = new Map();
    
    for (const [path, file] of this.files) {
      const name = path.split('/').pop();
      if (!nameMap.has(name)) {
        nameMap.set(name, []);
      }
      nameMap.get(name).push(path);
    }
    
    // Mark files with duplicate names as potentially redundant
    for (const [name, paths] of nameMap) {
      if (paths.length > 1) {
        for (const path of paths) {
          this.categories.redundant.add(path);
        }
      }
    }
    
    console.log(`Detected ${this.categories.redundant.size} potentially redundant files`);
  }

  /**
   * Calculate scores
   */
  calculateScores() {
    console.log('Calculating scores...');
    
    const total = this.files.size;
    
    // Executability: ratio of executable + compilable files
    const executableCount = this.categories.executable.size + this.categories.compilable.size;
    this.scores.executability = total > 0 ? (executableCount / total * 100).toFixed(2) : 0;
    
    // Compilation: ratio of compilable files
    this.scores.compilation = total > 0 ? (this.categories.compilable.size / total * 100).toFixed(2) : 0;
    
    // Runtime: ratio of executable files
    this.scores.runtime = total > 0 ? (this.categories.executable.size / total * 100).toFixed(2) : 0;
    
    // Cognitive: presence of cognitive components
    const cognitiveFiles = Array.from(this.files.keys()).filter(path => 
      path.includes('cognitive') || 
      path.includes('reasoning') || 
      path.includes('knowledge') || 
      path.includes('memory') || 
      path.includes('CVM') || 
      path.includes('CPR')
    ).length;
    this.scores.cognitive = total > 0 ? (cognitiveFiles / total * 100).toFixed(2) : 0;
    
    // Orchestration: presence of orchestration components
    const orchestrationFiles = Array.from(this.files.keys()).filter(path => 
      path.includes('orchestrator') || 
      path.includes('workflow') || 
      path.includes('pipeline') || 
      path.includes('scheduler') ||
      path.includes('CPR')
    ).length;
    this.scores.orchestration = total > 0 ? (orchestrationFiles / total * 100).toFixed(2) : 0;
    
    // Observability: presence of tracing/logging/metrics
    const observabilityFiles = Array.from(this.files.keys()).filter(path => 
      path.includes('trace') || 
      path.includes('log') || 
      path.includes('metric') || 
      path.includes('monitor') ||
      path.includes('debug')
    ).length;
    this.scores.observability = total > 0 ? (observabilityFiles / total * 100).toFixed(2) : 0;
    
    // Determinism: presence of validation/verification
    const determinismFiles = Array.from(this.files.keys()).filter(path => 
      path.includes('validat') || 
      path.includes('verif') || 
      path.includes('check') || 
      path.includes('assert') ||
      path.includes('determin')
    ).length;
    this.scores.determinism = total > 0 ? (determinismFiles / total * 100).toFixed(2) : 0;
    
    console.log('Scores calculated:');
    for (const [key, value] of Object.entries(this.scores)) {
      console.log(`  ${key}: ${value}%`);
    }
  }

  /**
   * Generate report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.files.size,
        byCategory: {}
      },
      categories: {},
      scores: this.scores,
      findings: []
    };
    
    // Category summary
    for (const [category, files] of Object.entries(this.categories)) {
      report.summary.byCategory[category] = files.size;
      report.categories[category] = Array.from(files);
    }
    
    // Findings
    if (this.categories.documentary.size > 50) {
      report.findings.push({
        type: 'warning',
        message: `High number of documentary files (${this.categories.documentary.size}) - consider converting to executable specifications`
      });
    }
    
    if (this.categories.static.size > 100) {
      report.findings.push({
        type: 'warning',
        message: `High number of static files (${this.categories.static.size}) - consider making them compilable`
      });
    }
    
    if (this.categories.unused.size > 10) {
      report.findings.push({
        type: 'error',
        message: `${this.categories.unused.size} potentially unused files detected`
      });
    }
    
    if (this.categories.redundant.size > 20) {
      report.findings.push({
        type: 'error',
        message: `${this.categories.redundant.size} potentially redundant files detected`
      });
    }
    
    if (parseFloat(this.scores.executability) < 50) {
      report.findings.push({
        type: 'critical',
        message: `Low executability score (${this.scores.executability}%) - need more executable/compilable files`
      });
    }
    
    if (parseFloat(this.scores.compilation) < 30) {
      report.findings.push({
        type: 'critical',
        message: `Low compilation score (${this.scores.compilation}%) - need more compilable files`
      });
    }
    
    if (parseFloat(this.scores.runtime) < 20) {
      report.findings.push({
        type: 'critical',
        message: `Low runtime score (${this.scores.runtime}%) - need more executable runtime components`
      });
    }
    
    return report;
  }

  /**
   * Save markdown report
   */
  saveMarkdownReport(outputPath) {
    const report = this.generateReport();
    
    let md = `# Blueprint V3 Enterprise Executability Audit\n\n`;
    md += `**Date**: ${report.timestamp}\n`;
    md += `**Total Files**: ${report.summary.totalFiles}\n\n`;
    
    md += `## Scores\n\n`;
    md += `| Metric | Score | Status |\n`;
    md += `|--------|-------|--------|\n`;
    
    const scoreStatus = (score) => {
      const val = parseFloat(score);
      if (val >= 80) return '✅ Excellent';
      if (val >= 60) return '⚠️ Good';
      if (val >= 40) return '❌ Fair';
      return '🔴 Poor';
    };
    
    for (const [key, value] of Object.entries(report.scores)) {
      md += `| ${key} | ${value}% | ${scoreStatus(value)} |\n`;
    }
    
    md += `\n## File Categories\n\n`;
    for (const [category, count] of Object.entries(report.summary.byCategory)) {
      md += `- **${category}**: ${count} files\n`;
    }
    
    md += `\n## Findings\n\n`;
    for (const finding of report.findings) {
      const icon = finding.type === 'critical' ? '🔴' : finding.type === 'error' ? '❌' : '⚠️';
      md += `${icon} **${finding.type.toUpperCase()}**: ${finding.message}\n`;
    }
    
    md += `\n## Detailed File Lists\n\n`;
    
    for (const [category, files] of Object.entries(report.categories)) {
      md += `### ${category.toUpperCase()} (${files.length} files)\n\n`;
      if (files.length > 50) {
        md += `Showing first 50 of ${files.length} files:\n\n`;
        files.slice(0, 50).forEach(file => md += `- ${file}\n`);
      } else {
        files.forEach(file => md += `- ${file}\n`);
      }
      md += `\n`;
    }
    
    const { writeFileSync } = require('fs');
    writeFileSync(outputPath, md, 'utf-8');
    console.log(`Markdown report saved to ${outputPath}`);
  }

  /**
   * Run audit
   */
  run() {
    console.log('Starting Executability Audit...\n');
    
    this.scanFiles();
    this.categorizeFiles();
    this.detectUnused();
    this.detectRedundant();
    this.calculateScores();
    
    const report = this.generateReport();
    
    console.log('\n=== AUDIT SUMMARY ===');
    console.log(`Total Files: ${report.summary.totalFiles}`);
    console.log('\nScores:');
    for (const [key, value] of Object.entries(report.scores)) {
      console.log(`  ${key}: ${value}%`);
    }
    
    console.log('\nFindings:');
    for (const finding of report.findings) {
      console.log(`  [${finding.type.toUpperCase()}] ${finding.message}`);
    }
    
    return report;
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const outputPath = process.argv[3] || join(rootPath, 'EXECUTABILITY_AUDIT.md');
  
  const audit = new ExecutabilityAudit(rootPath);
  
  const report = audit.run();
  
  console.log('\nGenerating markdown report...');
  audit.saveMarkdownReport(outputPath);
  
  console.log('\n✅ EXECUTABILITY AUDIT COMPLETED');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ExecutabilityAudit };
