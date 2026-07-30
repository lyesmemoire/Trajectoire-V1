#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Compiler Pipeline Validator
 * 
 * OBJECTIF 7: Valider l'intégration du pipeline du compilateur
 * 
 * Pipeline: DSL → Lexer → Parser → AST → Semantic Graph → Optimizer → CIR → 
 * Optimization Passes → CBS Bytecode → Verifier → Package → Loader → CVM → CPR → Execution
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

class CompilerPipelineValidator {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.compilerPath = join(rootPath, 'compiler');
    this.components = {
      lexer: null,
      parser: null,
      ast: null,
      semantic: null,
      typeSystem: null,
      constraint: null,
      cir: null,
      cbs: null,
      cvm: null,
      cpr: null,
      bytecode: null,
      builder: null,
      cli: null,
    };
    this.validationResults = [];
  }

  /**
   * Valider le pipeline
   */
  validate() {
    console.log('Validating compiler pipeline...');
    
    this.checkComponent('lexer', 'lexer/lexer.ts');
    this.checkComponent('parser', 'parser/parser.ts');
    this.checkComponent('ast', 'ast/index.ts');
    this.checkComponent('semantic', 'semantic/index.ts');
    this.checkComponent('typeSystem', 'type-system/index.ts');
    this.checkComponent('constraint', 'constraint/constraint-solver.ts');
    this.checkComponent('cir', 'cir/index.ts');
    this.checkComponent('cbs', 'cbs/index.ts');
    this.checkComponent('cvm', 'cvm/index.ts');
    this.checkComponent('cpr', 'cpr/index.ts');
    this.checkComponent('bytecode', 'bytecode/index.ts');
    this.checkComponent('builder', 'builder/index.ts');
    this.checkComponent('cli', 'cli/compiler-cli.ts');

    this.checkPipelineIntegration();
    this.printSummary();
  }

  /**
   * Vérifier un composant
   */
  checkComponent(name, path) {
    const fullPath = join(this.compilerPath, path);
    const exists = existsSync(fullPath);
    
    this.components[name] = {
      path,
      exists,
      exports: exists ? this.extractExports(fullPath) : [],
    };

    if (exists) {
      this.validationResults.push({ component: name, status: 'OK', path });
      console.log(`  ✓ ${name}: ${path}`);
    } else {
      this.validationResults.push({ component: name, status: 'MISSING', path });
      console.log(`  ✗ ${name}: ${path} (MISSING)`);
    }
  }

  /**
   * Extraire les exports d'un fichier
   */
  extractExports(filePath) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const exports = [];
      const exportMatches = content.matchAll(/export\s+(?:class|interface|type|enum|function|const|let|var)\s+(\w+)/g);
      
      for (const match of exportMatches) {
        exports.push(match[1]);
      }

      const reExportMatches = content.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g);
      for (const match of reExportMatches) {
        exports.push(`* from ${match[1]}`);
      }

      return exports;
    } catch (error) {
      return [];
    }
  }

  /**
   * Vérifier l'intégration du pipeline
   */
  checkPipelineIntegration() {
    console.log('\nChecking pipeline integration...');

    // Vérifier que Lexer exporte les types nécessaires
    if (this.components.lexer.exists) {
      const lexerExports = this.components.lexer.exports;
      if (lexerExports.includes('Token') && lexerExports.includes('TokenType')) {
        console.log('  ✓ Lexer exports Token and TokenType');
      } else {
        console.log('  ✗ Lexer missing required exports');
      }
    }

    // Vérifier que Parser importe Lexer
    if (this.components.parser.exists) {
      const parserPath = join(this.compilerPath, 'parser/parser.ts');
      const parserContent = readFileSync(parserPath, 'utf-8');
      if (parserContent.includes('../lexer/lexer')) {
        console.log('  ✓ Parser imports from Lexer');
      } else {
        console.log('  ✗ Parser does not import from Lexer');
      }
    }

    // Vérifier que CIR existe et exporte les composants nécessaires
    if (this.components.cir.exists) {
      const cirExports = this.components.cir.exports;
      if (cirExports.length > 0) {
        console.log(`  ✓ CIR exports ${cirExports.length} items`);
      } else {
        console.log('  ✗ CIR has no exports');
      }
    }

    // Vérifier que CBS existe et exporte les composants nécessaires
    if (this.components.cbs.exists) {
      const cbsExports = this.components.cbs.exports;
      if (cbsExports.length > 0) {
        console.log(`  ✓ CBS exports ${cbsExports.length} items`);
      } else {
        console.log('  ✗ CBS has no exports');
      }
    }

    // Vérifier que CVM existe et exporte les composants nécessaires
    if (this.components.cvm.exists) {
      const cvmExports = this.components.cvm.exports;
      if (cvmExports.length > 0) {
        console.log(`  ✓ CVM exports ${cvmExports.length} items`);
      } else {
        console.log('  ✗ CVM has no exports');
      }
    }

    // Vérifier que CPR existe et exporte les composants nécessaires
    if (this.components.cpr.exists) {
      const cprExports = this.components.cpr.exports;
      if (cprExports.length > 0) {
        console.log(`  ✓ CPR exports ${cprExports.length} items`);
      } else {
        console.log('  ✗ CPR has no exports');
      }
    }
  }

  /**
   * Afficher le résumé
   */
  printSummary() {
    const okCount = this.validationResults.filter(r => r.status === 'OK').length;
    const missingCount = this.validationResults.filter(r => r.status === 'MISSING').length;

    console.log('\n=== COMPILER PIPELINE VALIDATION SUMMARY ===');
    console.log(`Total Components: ${this.validationResults.length}`);
    console.log(`OK: ${okCount}`);
    console.log(`MISSING: ${missingCount}`);
    console.log('==========================================\n');

    if (missingCount > 0) {
      console.log('MISSING COMPONENTS:');
      for (const result of this.validationResults.filter(r => r.status === 'MISSING')) {
        console.log(`  - ${result.component}: ${result.path}`);
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
        totalComponents: this.validationResults.length,
        okCount: this.validationResults.filter(r => r.status === 'OK').length,
        missingCount: this.validationResults.filter(r => r.status === 'MISSING').length,
      },
      components: this.components,
      validationResults: this.validationResults,
    };

    return report;
  }

  /**
   * Sauvegarder le rapport
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const json = JSON.stringify(report, null, 2);
    const { writeFileSync } = require('fs');
    writeFileSync(outputPath, json, 'utf-8');
    console.log(`\nCompiler Pipeline Validation Report saved to ${outputPath}`);
  }
}

// Exécution
const rootPath = process.argv[2] || process.cwd();
const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_COMPILER_VALIDATION_REPORT.json');

const validator = new CompilerPipelineValidator(rootPath);
validator.validate();
validator.saveReport(outputPath);
