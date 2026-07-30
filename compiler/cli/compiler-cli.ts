/**
 * Blueprint Compiler CLI
 * 
 * Command-line interface for the Blueprint compiler.
 */

import { Lexer } from '../lexer/lexer';
import { Parser } from '../parser/parser';
import { SemanticAnalyzer } from '../semantic/semantic-analyzer';
import { TypeChecker } from '../type-system/type-checker';
import { ConstraintSolver } from '../constraint/constraint-solver';
import { SymbolTable } from '../ast/symbol-table';
import { ReferenceResolver } from '../ast/reference-resolver';
import { Diagnostics } from '../ast/diagnostics';
import { OptimizationPassManager } from '../passes/optimization-pass-manager';
import { IRGenerator } from '../cir/ir-generator';
import { BytecodeGenerator } from '../bytecode/bytecode-generator';
import { BytecodeVerifier } from '../bytecode/bytecode-verifier';
import { PackageBuilder, PackageMetadata } from '../packager/package-builder';

export interface CompilerOptions {
  input: string;
  output?: string;
  optimize: boolean;
  verbose: boolean;
  emitIR: boolean;
  emitBytecode: boolean;
  emitPackage: boolean;
  target?: string;
}

export interface CompilerResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  output?: string;
  timeMs: number;
}

export class CompilerCLI {
  /**
   * Compile a Blueprint DSL file
   */
  public async compile(options: CompilerOptions): Promise<CompilerResult> {
    const startTime = performance.now();
    const diagnostics = new Diagnostics();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Read input file
      const source = await this.readFile(options.input);

      if (options.verbose) {
        console.log(`[1/15] Lexing ${options.input}...`);
      }

      // Step 1: Lexing
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();

      if (options.verbose) {
        console.log(`[2/15] Parsing ${options.input}...`);
      }

      // Step 2: Parsing
      const parser = new Parser(tokens);
      const ast = parser.parse();

      if (options.verbose) {
        console.log(`[3/15] Semantic analysis...`);
      }

      // Step 3: Semantic Analysis
      const semanticAnalyzer = new SemanticAnalyzer();
      const semanticResult = semanticAnalyzer.analyze(ast);

      for (const error of semanticResult.errors) {
        diagnostics.addError(
          'SEMANTIC' as unknown,
          error.message,
          options.input,
          error.line,
          error.column
        );
        errors.push(error.message);
      }

      for (const warning of semanticResult.warnings) {
        diagnostics.addWarning(
          'SEMANTIC' as unknown,
          warning.message,
          options.input,
          warning.line,
          warning.column
        );
        warnings.push(warning.message);
      }

      if (options.verbose) {
        console.log(`[4/15] Type checking...`);
      }

      // Step 4: Type Checking
      const typeChecker = new TypeChecker();
      const typeCheckResult = typeChecker.typeCheck(ast);

      for (const error of typeCheckResult.errors) {
        diagnostics.addError(
          'TYPE',
          error.message,
          options.input,
          error.line,
          error.column
        );
        errors.push(error.message);
      }

      for (const warning of typeCheckResult.warnings) {
        diagnostics.addWarning(
          'TYPE',
          warning.message,
          options.input,
          warning.line,
          warning.column
        );
        warnings.push(warning.message);
      }

      if (options.verbose) {
        console.log(`[5/15] Constraint solving...`);
      }

      // Step 5: Constraint Solving
      const constraintSolver = new ConstraintSolver();
      const constraintResult = constraintSolver.solve(ast);

      for (const violation of constraintResult.violations) {
        diagnostics.addError(
          'CONSTRAINT',
          violation.message,
          options.input,
          violation.line,
          violation.column
        );
        errors.push(violation.message);
      }

      if (options.verbose) {
        console.log(`[6/15] Symbol table building...`);
      }

      // Step 6: Symbol Table
      const symbolTable = new SymbolTable();
      // Symbol table is populated during semantic analysis

      if (options.verbose) {
        console.log(`[7/15] Reference resolution...`);
      }

      // Step 7: Reference Resolution
      const referenceResolver = new ReferenceResolver(symbolTable);
      const referenceResult = referenceResolver.resolve(ast);

      for (const unresolved of referenceResult.unresolved) {
        diagnostics.addError(
          'REFERENCE',
          `Unresolved reference: ${unresolved.name}`,
          options.input,
          unresolved.line,
          unresolved.column
        );
        errors.push(`Unresolved reference: ${unresolved.name}`);
      }

      if (options.verbose) {
        console.log(`[8/15] Optimization...`);
      }

      // Step 8: Optimization
      if (options.optimize) {
        const optimizer = new OptimizationPassManager();
        const optimizationResult = optimizer.runOptimizations(ast);

        if (options.verbose) {
          console.log(`  Optimizations: ${optimizationResult.totalTransformations} transformations`);
          console.log(`  Time: ${optimizationResult.totalTimeMs.toFixed(2)}ms`);
        }
      }

      if (options.verbose) {
        console.log(`[9/15] IR generation...`);
      }

      // Step 9: IR Generation
      const irGenerator = new IRGenerator();
      const irResult = irGenerator.generate(ast);

      for (const error of irResult.errors) {
        diagnostics.addError(
          'IR',
          error,
          options.input,
          0,
          0
        );
        errors.push(error);
      }

      if (options.emitIR && options.output) {
        const irPath = options.output.replace('.bp', '.ir.json');
        await this.writeFile(irPath, JSON.stringify(irResult.ir, null, 2));
        if (options.verbose) {
          console.log(`  IR written to ${irPath}`);
        }
      }

      if (options.verbose) {
        console.log(`[10/15] Bytecode generation...`);
      }

      // Step 10: Bytecode Generation
      const bytecodeGenerator = new BytecodeGenerator();
      const bytecodeResult = bytecodeGenerator.generate(irResult.ir);

      for (const error of bytecodeResult.errors) {
        diagnostics.addError(
          'BYTECODE',
          error,
          options.input,
          0,
          0
        );
        errors.push(error);
      }

      if (options.emitBytecode && options.output) {
        const bytecodePath = options.output.replace('.bp', '.bc');
        const binaryBytecode = bytecodeGenerator.serializeToBinary(bytecodeResult.bytecode);
        await this.writeFile(bytecodePath, Buffer.from(binaryBytecode));
        if (options.verbose) {
          console.log(`  Bytecode written to ${bytecodePath}`);
        }
      }

      if (options.verbose) {
        console.log(`[11/15] Bytecode verification...`);
      }

      // Step 11: Bytecode Verification
      const bytecodeVerifier = new BytecodeVerifier();
      const verificationResult = bytecodeVerifier.verify(bytecodeResult.bytecode);

      for (const error of verificationResult.errors) {
        diagnostics.addError(
          'VERIFICATION',
          error.message,
          options.input,
          0,
          0
        );
        errors.push(error.message);
      }

      for (const warning of verificationResult.warnings) {
        diagnostics.addWarning(
          'VERIFICATION',
          warning.message,
          options.input,
          0,
          0
        );
        warnings.push(warning.message);
      }

      if (options.verbose) {
        console.log(`[12/15] Package building...`);
      }

      // Step 12: Package Building
      if (options.emitPackage) {
        const packageBuilder = new PackageBuilder();
        const metadata: PackageMetadata = {
          name: this.getPackageName(options.input),
          version: '1.0.0',
          description: 'Blueprint package',
          author: 'Blueprint Compiler',
          license: 'MIT',
          dependencies: [],
          exports: [],
        };

        const packageResult = packageBuilder.build(bytecodeResult.bytecode, metadata);

        for (const error of packageResult.errors) {
          diagnostics.addError(
            'PACKAGE',
            error,
            options.input,
            0,
            0
          );
          errors.push(error);
        }

        if (options.output) {
          const packagePath = options.output.replace('.bp', '.bpp');
          await this.writeFile(packagePath, Buffer.from(packageResult.package.bytecode));
          if (options.verbose) {
            console.log(`  Package written to ${packagePath}`);
          }
        }
      }

      if (options.verbose) {
        console.log(`[13/15] Diagnostics...`);
      }

      // Step 13: Diagnostics
      const diagnosticReport = diagnostics.generateReport();

      if (options.verbose) {
        console.log(`  Errors: ${diagnosticReport.errorCount}`);
        console.log(`  Warnings: ${diagnosticReport.warningCount}`);
      }

      if (options.verbose) {
        console.log(`[14/15] Output generation...`);
      }

      // Step 14: Output Generation
      if (options.output) {
        const output = JSON.stringify({
          ast,
          ir: irResult.ir,
          bytecode: bytecodeResult.bytecode,
          diagnostics: diagnosticReport,
        }, null, 2);
        await this.writeFile(options.output, output);
      }

      if (options.verbose) {
        console.log(`[15/15] Compilation complete.`);
      }

      const endTime = performance.now();

      return {
        success: errors.length === 0,
        errors,
        warnings,
        output: options.output,
        timeMs: endTime - startTime,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      
      const endTime = performance.now();

      return {
        success: false,
        errors,
        warnings,
        timeMs: endTime - startTime,
      };
    }
  }

  /**
   * Read a file
   */
  private async readFile(path: string): Promise<string> {
    // In a real implementation, this would use fs.readFile
    return '';
  }

  /**
   * Write a file
   */
  private async writeFile(path: string, content: Buffer | string): Promise<void> {
    // In a real implementation, this would use fs.writeFile
  }

  /**
   * Get package name from file path
   */
  private getPackageName(path: string): string {
    const basename = path.split(/[/\\]/).pop() || '';
    return basename.replace('.bp', '');
  }

  /**
   * Print help message
   */
  public printHelp(): void {
    console.log('Blueprint Compiler v1.0.0');
    console.log('');
    console.log('Usage: blueprint build [options] <input>');
    console.log('');
    console.log('Options:');
    console.log('  -o, --output <file>    Output file');
    console.log('  -O, --optimize         Enable optimizations');
    console.log('  -v, --verbose          Verbose output');
    console.log('  --emit-ir              Emit IR');
    console.log('  --emit-bytecode        Emit bytecode');
    console.log('  --emit-package         Emit package');
    console.log('  -h, --help             Show this help message');
  }
}

/**
 * Main entry point
 */
export async function main(args: string[]): Promise<void> {
  const cli = new CompilerCLI();

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    cli.printHelp();
    return;
  }

  const options: CompilerOptions = {
    input: args[args.length - 1],
    optimize: args.includes('--optimize') || args.includes('-O'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    emitIR: args.includes('--emit-ir'),
    emitBytecode: args.includes('--emit-bytecode'),
    emitPackage: args.includes('--emit-package'),
  };

  const outputIndex = args.indexOf('--output') !== -1 ? args.indexOf('--output') : args.indexOf('-o');
  if (outputIndex !== -1 && outputIndex + 1 < args.length) {
    options.output = args[outputIndex + 1];
  }

  const result = await cli.compile(options);

  if (result.success) {
    console.log(`Compilation successful (${result.timeMs.toFixed(2)}ms)`);
    if (result.warnings.length > 0) {
      console.log(`Warnings: ${result.warnings.length}`);
    }
  } else {
    console.error(`Compilation failed (${result.timeMs.toFixed(2)}ms)`);
    console.error(`Errors: ${result.errors.length}`);
    for (const error of result.errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }
}
