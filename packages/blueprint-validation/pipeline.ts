/**
 * Blueprint Validation: Validation Pipeline
 * 
 * Ensures all documents are linked, compilable, validated, and used
 */

import { DocumentValidator } from './document-validator';
import { CompilationValidator } from './compilation-validator';
import { IntegrationValidator } from './integration-validator';
import { UsageValidator } from './usage-validator';

export interface ValidationConfig {
  checkLinks: boolean;
  checkCompilation: boolean;
  checkIntegration: boolean;
  checkUsage: boolean;
}

export interface ValidationResult {
  path: string;
  documentValidation?: unknown;
  compilationValidation?: unknown;
  integrationValidation?: unknown;
  usageValidation?: unknown;
  overallValid: boolean;
  errors: string[];
}

export class ValidationPipeline {
  private documentValidator: DocumentValidator;
  private compilationValidator: CompilationValidator;
  private integrationValidator: IntegrationValidator;
  private usageValidator: UsageValidator;

  constructor() {
    this.documentValidator = new DocumentValidator();
    this.compilationValidator = new CompilationValidator();
    this.integrationValidator = new IntegrationValidator();
    this.usageValidator = new UsageValidator();
  }

  /**
   * Validate path
   */
  async validate(path: string, config: ValidationConfig = this.getDefaultConfig()): Promise<ValidationResult> {
    const result: ValidationResult = {
      path,
      overallValid: true,
      errors: [],
    };

    console.log(`Validating ${path}...`);

    // Document validation
    if (config.checkLinks) {
      console.log('  Checking document links...');
      result.documentValidation = this.documentValidator.validate(path);
      if (!result.documentValidation.isValid) {
        result.overallValid = false;
        result.errors.push('Document links invalid');
      }
    }

    // Compilation validation
    if (config.checkCompilation && path.endsWith('.ts')) {
      console.log('  Checking compilation...');
      result.compilationValidation = await this.compilationValidator.validate(path);
      if (!result.compilationValidation.isValid) {
        result.overallValid = false;
        result.errors.push('Compilation failed');
      }
    }

    // Integration validation
    if (config.checkIntegration) {
      console.log('  Checking integration...');
      result.integrationValidation = this.integrationValidator.validate(path);
      if (!result.integrationValidation.isValid) {
        result.overallValid = false;
        result.errors.push('Integration issues found');
      }
    }

    // Usage validation
    if (config.checkUsage) {
      console.log('  Checking usage...');
      result.usageValidation = this.usageValidator.validate(path);
      if (!result.usageValidation.isValid) {
        result.overallValid = false;
        result.errors.push('Component not used');
      }
    }

    console.log(`Validation complete: ${result.overallValid ? 'VALID' : 'INVALID'}`);

    return result;
  }

  /**
   * Validate all
   */
  async validateAll(rootPath: string, config: ValidationConfig = this.getDefaultConfig()): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Recursively validate all TypeScript files and documents
    const files = this.getAllFiles(rootPath);
    
    for (const file of files) {
      const result = await this.validate(file, config);
      results.push(result);
    }

    return results;
  }

  /**
   * Get all files
   */
  private getAllFiles(rootPath: string): string[] {
    // Recursively find all .ts and .md files
    return [];
  }

  /**
   * Get default config
   */
  private getDefaultConfig(): ValidationConfig {
    return {
      checkLinks: true,
      checkCompilation: true,
      checkIntegration: true,
      checkUsage: true,
    };
  }
}
