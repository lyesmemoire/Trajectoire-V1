/**
 * Blueprint DSL Diagnostics
 * 
 * Provides diagnostic information about errors, warnings, and hints.
 */

export enum DiagnosticSeverity {
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO",
  HINT = "HINT",
}

export enum DiagnosticCategory {
  SYNTAX = "SYNTAX",
  SEMANTIC = "SEMANTIC",
  TYPE = "TYPE",
  CONSTRAINT = "CONSTRAINT",
  REFERENCE = "REFERENCE",
  OPTIMIZATION = "OPTIMIZATION",
}

export interface Diagnostic {
  id: string;
  severity: DiagnosticSeverity;
  category: DiagnosticCategory;
  message: string;
  file: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  source: string;
  code?: string;
  relatedInformation?: DiagnosticRelatedInformation[];
}

export interface DiagnosticRelatedInformation {
  message: string;
  file: string;
  line: number;
  column: number;
}

export interface DiagnosticReport {
  diagnostics: Diagnostic[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
  hintCount: number;
  success: boolean;
}

export class Diagnostics {
  private diagnostics: Diagnostic[] = [];
  private diagnosticCounter: number = 0;

  /**
   * Add a diagnostic
   */
  public addDiagnostic(diagnostic: Diagnostic): void {
    diagnostic.id = `diag_${this.diagnosticCounter++}`;
    this.diagnostics.push(diagnostic);
  }

  /**
   * Add an error diagnostic
   */
  public addError(
    category: DiagnosticCategory,
    message: string,
    file: string,
    line: number,
    column: number,
    code?: string
  ): void {
    this.addDiagnostic({
      id: '',
      severity: DiagnosticSeverity.ERROR,
      category,
      message,
      file,
      line,
      column,
      source: 'Blueprint Compiler',
      code,
    });
  }

  /**
   * Add a warning diagnostic
   */
  public addWarning(
    category: DiagnosticCategory,
    message: string,
    file: string,
    line: number,
    column: number,
    code?: string
  ): void {
    this.addDiagnostic({
      id: '',
      severity: DiagnosticSeverity.WARNING,
      category,
      message,
      file,
      line,
      column,
      source: 'Blueprint Compiler',
      code,
    });
  }

  /**
   * Add an info diagnostic
   */
  public addInfo(
    category: DiagnosticCategory,
    message: string,
    file: string,
    line: number,
    column: number,
    code?: string
  ): void {
    this.addDiagnostic({
      id: '',
      severity: DiagnosticSeverity.INFO,
      category,
      message,
      file,
      line,
      column,
      source: 'Blueprint Compiler',
      code,
    });
  }

  /**
   * Add a hint diagnostic
   */
  public addHint(
    category: DiagnosticCategory,
    message: string,
    file: string,
    line: number,
    column: number,
    code?: string
  ): void {
    this.addDiagnostic({
      id: '',
      severity: DiagnosticSeverity.HINT,
      category,
      message,
      file,
      line,
      column,
      source: 'Blueprint Compiler',
      code,
    });
  }

  /**
   * Get all diagnostics
   */
  public getDiagnostics(): Diagnostic[] {
    return this.diagnostics;
  }

  /**
   * Get diagnostics by severity
   */
  public getDiagnosticsBySeverity(severity: DiagnosticSeverity): Diagnostic[] {
    return this.diagnostics.filter(d => d.severity === severity);
  }

  /**
   * Get diagnostics by category
   */
  public getDiagnosticsByCategory(category: DiagnosticCategory): Diagnostic[] {
    return this.diagnostics.filter(d => d.category === category);
  }

  /**
   * Get diagnostics by file
   */
  public getDiagnosticsByFile(file: string): Diagnostic[] {
    return this.diagnostics.filter(d => d.file === file);
  }

  /**
   * Get error diagnostics
   */
  public getErrors(): Diagnostic[] {
    return this.getDiagnosticsBySeverity(DiagnosticSeverity.ERROR);
  }

  /**
   * Get warning diagnostics
   */
  public getWarnings(): Diagnostic[] {
    return this.getDiagnosticsBySeverity(DiagnosticSeverity.WARNING);
  }

  /**
   * Get info diagnostics
   */
  public getInfo(): Diagnostic[] {
    return this.getDiagnosticsBySeverity(DiagnosticSeverity.INFO);
  }

  /**
   * Get hint diagnostics
   */
  public getHints(): Diagnostic[] {
    return this.getDiagnosticsBySeverity(DiagnosticSeverity.HINT);
  }

  /**
   * Check if there are any errors
   */
  public hasErrors(): boolean {
    return this.getErrors().length > 0;
  }

  /**
   * Check if there are any warnings
   */
  public hasWarnings(): boolean {
    return this.getWarnings().length > 0;
  }

  /**
   * Generate a diagnostic report
   */
  public generateReport(): DiagnosticReport {
    return {
      diagnostics: this.diagnostics,
      errorCount: this.getErrors().length,
      warningCount: this.getWarnings().length,
      infoCount: this.getInfo().length,
      hintCount: this.getHints().length,
      success: !this.hasErrors(),
    };
  }

  /**
   * Clear all diagnostics
   */
  public clear(): void {
    this.diagnostics = [];
    this.diagnosticCounter = 0;
  }

  /**
   * Format diagnostics as a string
   */
  public formatDiagnostics(): string {
    let output = '';

    for (const diagnostic of this.diagnostics) {
      output += `${diagnostic.file}:${diagnostic.line}:${diagnostic.column} - `;
      output += `[${diagnostic.severity}] ${diagnostic.category}: `;
      output += `${diagnostic.message}\n`;

      if (diagnostic.code) {
        output += `  Code: ${diagnostic.code}\n`;
      }

      if (diagnostic.relatedInformation) {
        for (const related of diagnostic.relatedInformation) {
          output += `  Related: ${related.file}:${related.line}:${related.column} - ${related.message}\n`;
        }
      }

      output += '\n';
    }

    return output;
  }

  /**
   * Format diagnostics as JSON
   */
  public toJSON(): string {
    return JSON.stringify(this.generateReport(), null, 2);
  }
}
