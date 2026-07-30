import { describe, it, expect, beforeEach } from 'vitest';
import { Diagnostics, DiagnosticSeverity, DiagnosticCategory, type Diagnostic } from '../../../compiler/ast/diagnostics';

describe('Diagnostics', () => {
  let diagnostics: Diagnostics;

  beforeEach(() => {
    diagnostics = new Diagnostics();
  });

  describe('Initialization', () => {
    it('should initialize with empty diagnostics', () => {
      expect(diagnostics.getDiagnostics()).toHaveLength(0);
    });

    it('should start with no errors', () => {
      expect(diagnostics.hasErrors()).toBe(false);
    });

    it('should start with no warnings', () => {
      expect(diagnostics.hasWarnings()).toBe(false);
    });
  });

  describe('Adding diagnostics', () => {
    it('should add a diagnostic', () => {
      const diagnostic: Diagnostic = {
        id: 'test',
        severity: DiagnosticSeverity.ERROR,
        category: DiagnosticCategory.SYNTAX,
        message: 'Test error',
        file: 'test.bp',
        line: 1,
        column: 1,
        source: 'Test',
      };

      diagnostics.addDiagnostic(diagnostic);
      expect(diagnostics.getDiagnostics()).toHaveLength(1);
    });

    it('should assign unique ID to diagnostic', () => {
      const diagnostic: Diagnostic = {
        id: '',
        severity: DiagnosticSeverity.ERROR,
        category: DiagnosticCategory.SYNTAX,
        message: 'Test error',
        file: 'test.bp',
        line: 1,
        column: 1,
        source: 'Test',
      };

      diagnostics.addDiagnostic(diagnostic);
      const added = diagnostics.getDiagnostics()[0];
      expect(added.id).toMatch(/^diag_\d+$/);
    });

    it('should add an error diagnostic', () => {
      diagnostics.addError(
        DiagnosticCategory.SYNTAX,
        'Syntax error',
        'test.bp',
        1,
        1
      );

      expect(diagnostics.hasErrors()).toBe(true);
      expect(diagnostics.getErrors()).toHaveLength(1);
    });

    it('should add a warning diagnostic', () => {
      diagnostics.addWarning(
        DiagnosticCategory.SEMANTIC,
        'Semantic warning',
        'test.bp',
        1,
        1
      );

      expect(diagnostics.hasWarnings()).toBe(true);
      expect(diagnostics.getWarnings()).toHaveLength(1);
    });

    it('should add an info diagnostic', () => {
      diagnostics.addInfo(
        DiagnosticCategory.TYPE,
        'Info message',
        'test.bp',
        1,
        1
      );

      expect(diagnostics.getInfo()).toHaveLength(1);
    });

    it('should add a hint diagnostic', () => {
      diagnostics.addHint(
        DiagnosticCategory.OPTIMIZATION,
        'Optimization hint',
        'test.bp',
        1,
        1
      );

      expect(diagnostics.getHints()).toHaveLength(1);
    });

    it('should add multiple diagnostics', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error 1', 'test.bp', 1, 1);
      diagnostics.addWarning(DiagnosticCategory.SEMANTIC, 'Warning 1', 'test.bp', 2, 1);
      diagnostics.addInfo(DiagnosticCategory.TYPE, 'Info 1', 'test.bp', 3, 1);

      expect(diagnostics.getDiagnostics()).toHaveLength(3);
    });
  });

  describe('Retrieving diagnostics', () => {
    beforeEach(() => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Syntax error', 'test.bp', 1, 1, 'E001');
      diagnostics.addWarning(DiagnosticCategory.SEMANTIC, 'Semantic warning', 'test.bp', 2, 1, 'W001');
      diagnostics.addInfo(DiagnosticCategory.TYPE, 'Type info', 'test.bp', 3, 1, 'I001');
      diagnostics.addHint(DiagnosticCategory.OPTIMIZATION, 'Optimization hint', 'test.bp', 4, 1, 'H001');
    });

    it('should get all diagnostics', () => {
      expect(diagnostics.getDiagnostics()).toHaveLength(4);
    });

    it('should get diagnostics by severity', () => {
      const errors = diagnostics.getDiagnosticsBySeverity(DiagnosticSeverity.ERROR);
      expect(errors).toHaveLength(1);
      expect(errors[0].severity).toBe(DiagnosticSeverity.ERROR);
    });

    it('should get diagnostics by category', () => {
      const syntax = diagnostics.getDiagnosticsByCategory(DiagnosticCategory.SYNTAX);
      expect(syntax).toHaveLength(1);
      expect(syntax[0].category).toBe(DiagnosticCategory.SYNTAX);
    });

    it('should get diagnostics by file', () => {
      const fileDiagnostics = diagnostics.getDiagnosticsByFile('test.bp');
      expect(fileDiagnostics).toHaveLength(4);
    });

    it('should get error diagnostics', () => {
      const errors = diagnostics.getErrors();
      expect(errors).toHaveLength(1);
      expect(errors[0].severity).toBe(DiagnosticSeverity.ERROR);
    });

    it('should get warning diagnostics', () => {
      const warnings = diagnostics.getWarnings();
      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe(DiagnosticSeverity.WARNING);
    });

    it('should get info diagnostics', () => {
      const info = diagnostics.getInfo();
      expect(info).toHaveLength(1);
      expect(info[0].severity).toBe(DiagnosticSeverity.INFO);
    });

    it('should get hint diagnostics', () => {
      const hints = diagnostics.getHints();
      expect(hints).toHaveLength(1);
      expect(hints[0].severity).toBe(DiagnosticSeverity.HINT);
    });
  });

  describe('Error checking', () => {
    it('should return true when there are errors', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      expect(diagnostics.hasErrors()).toBe(true);
    });

    it('should return false when there are no errors', () => {
      diagnostics.addWarning(DiagnosticCategory.SEMANTIC, 'Warning', 'test.bp', 1, 1);
      expect(diagnostics.hasErrors()).toBe(false);
    });

    it('should return true when there are warnings', () => {
      diagnostics.addWarning(DiagnosticCategory.SEMANTIC, 'Warning', 'test.bp', 1, 1);
      expect(diagnostics.hasWarnings()).toBe(true);
    });

    it('should return false when there are no warnings', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      expect(diagnostics.hasWarnings()).toBe(false);
    });
  });

  describe('Report generation', () => {
    it('should generate a diagnostic report', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      diagnostics.addWarning(DiagnosticCategory.SEMANTIC, 'Warning', 'test.bp', 2, 1);

      const report = diagnostics.generateReport();

      expect(report.diagnostics).toHaveLength(2);
      expect(report.errorCount).toBe(1);
      expect(report.warningCount).toBe(1);
      expect(report.infoCount).toBe(0);
      expect(report.hintCount).toBe(0);
      expect(report.success).toBe(false);
    });

    it('should report success when no errors', () => {
      diagnostics.addWarning(DiagnosticCategory.SEMANTIC, 'Warning', 'test.bp', 1, 1);

      const report = diagnostics.generateReport();
      expect(report.success).toBe(true);
    });

    it('should report failure when there are errors', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);

      const report = diagnostics.generateReport();
      expect(report.success).toBe(false);
    });
  });

  describe('Clearing diagnostics', () => {
    it('should clear all diagnostics', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      diagnostics.addWarning(DiagnosticCategory.SEMANTIC, 'Warning', 'test.bp', 1, 1);

      diagnostics.clear();

      expect(diagnostics.getDiagnostics()).toHaveLength(0);
      expect(diagnostics.hasErrors()).toBe(false);
      expect(diagnostics.hasWarnings()).toBe(false);
    });

    it('should reset diagnostic counter', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      const firstId = diagnostics.getDiagnostics()[0].id;

      diagnostics.clear();
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      const secondId = diagnostics.getDiagnostics()[0].id;

      expect(firstId).toBe(secondId); // Counter resets to 0
    });
  });

  describe('Formatting diagnostics', () => {
    it('should format diagnostics as string', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Syntax error', 'test.bp', 1, 1, 'E001');

      const formatted = diagnostics.formatDiagnostics();

      expect(formatted).toContain('test.bp:1:1');
      expect(formatted).toContain('[ERROR]');
      expect(formatted).toContain('SYNTAX');
      expect(formatted).toContain('Syntax error');
      expect(formatted).toContain('Code: E001');
    });

    it('should format diagnostics with related information', () => {
      const diagnostic: Diagnostic = {
        id: '',
        severity: DiagnosticSeverity.ERROR,
        category: DiagnosticCategory.SYNTAX,
        message: 'Syntax error',
        file: 'test.bp',
        line: 1,
        column: 1,
        source: 'Test',
        relatedInformation: [
          {
            message: 'Related issue',
            file: 'other.bp',
            line: 5,
            column: 10,
          },
        ],
      };

      diagnostics.addDiagnostic(diagnostic);
      const formatted = diagnostics.formatDiagnostics();

      expect(formatted).toContain('Related: other.bp:5:10');
      expect(formatted).toContain('Related issue');
    });

    it('should format diagnostics as JSON', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);

      const json = diagnostics.toJSON();
      const parsed = JSON.parse(json);

      expect(parsed).toHaveProperty('diagnostics');
      expect(parsed).toHaveProperty('errorCount');
      expect(parsed).toHaveProperty('warningCount');
      expect(parsed).toHaveProperty('infoCount');
      expect(parsed).toHaveProperty('hintCount');
      expect(parsed).toHaveProperty('success');
    });
  });

  describe('Diagnostic categories', () => {
    it('should handle SYNTAX category', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      const syntax = diagnostics.getDiagnosticsByCategory(DiagnosticCategory.SYNTAX);
      expect(syntax).toHaveLength(1);
    });

    it('should handle SEMANTIC category', () => {
      diagnostics.addError(DiagnosticCategory.SEMANTIC, 'Error', 'test.bp', 1, 1);
      const semantic = diagnostics.getDiagnosticsByCategory(DiagnosticCategory.SEMANTIC);
      expect(semantic).toHaveLength(1);
    });

    it('should handle TYPE category', () => {
      diagnostics.addError(DiagnosticCategory.TYPE, 'Error', 'test.bp', 1, 1);
      const type = diagnostics.getDiagnosticsByCategory(DiagnosticCategory.TYPE);
      expect(type).toHaveLength(1);
    });

    it('should handle CONSTRAINT category', () => {
      diagnostics.addError(DiagnosticCategory.CONSTRAINT, 'Error', 'test.bp', 1, 1);
      const constraint = diagnostics.getDiagnosticsByCategory(DiagnosticCategory.CONSTRAINT);
      expect(constraint).toHaveLength(1);
    });

    it('should handle REFERENCE category', () => {
      diagnostics.addError(DiagnosticCategory.REFERENCE, 'Error', 'test.bp', 1, 1);
      const reference = diagnostics.getDiagnosticsByCategory(DiagnosticCategory.REFERENCE);
      expect(reference).toHaveLength(1);
    });

    it('should handle OPTIMIZATION category', () => {
      diagnostics.addError(DiagnosticCategory.OPTIMIZATION, 'Error', 'test.bp', 1, 1);
      const optimization = diagnostics.getDiagnosticsByCategory(DiagnosticCategory.OPTIMIZATION);
      expect(optimization).toHaveLength(1);
    });
  });

  describe('Diagnostic severity', () => {
    it('should handle ERROR severity', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      const errors = diagnostics.getDiagnosticsBySeverity(DiagnosticSeverity.ERROR);
      expect(errors).toHaveLength(1);
    });

    it('should handle WARNING severity', () => {
      diagnostics.addWarning(DiagnosticCategory.SEMANTIC, 'Warning', 'test.bp', 1, 1);
      const warnings = diagnostics.getDiagnosticsBySeverity(DiagnosticSeverity.WARNING);
      expect(warnings).toHaveLength(1);
    });

    it('should handle INFO severity', () => {
      diagnostics.addInfo(DiagnosticCategory.TYPE, 'Info', 'test.bp', 1, 1);
      const info = diagnostics.getDiagnosticsBySeverity(DiagnosticSeverity.INFO);
      expect(info).toHaveLength(1);
    });

    it('should handle HINT severity', () => {
      diagnostics.addHint(DiagnosticCategory.OPTIMIZATION, 'Hint', 'test.bp', 1, 1);
      const hints = diagnostics.getDiagnosticsBySeverity(DiagnosticSeverity.HINT);
      expect(hints).toHaveLength(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle diagnostic with end position', () => {
      const diagnostic: Diagnostic = {
        id: '',
        severity: DiagnosticSeverity.ERROR,
        category: DiagnosticCategory.SYNTAX,
        message: 'Error',
        file: 'test.bp',
        line: 1,
        column: 1,
        endLine: 5,
        endColumn: 10,
        source: 'Test',
      };

      diagnostics.addDiagnostic(diagnostic);
      const added = diagnostics.getDiagnostics()[0];

      expect(added.endLine).toBe(5);
      expect(added.endColumn).toBe(10);
    });

    it('should handle diagnostic with code', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1, 'E001');
      const error = diagnostics.getErrors()[0];
      expect(error.code).toBe('E001');
    });

    it('should handle diagnostic without code', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      const error = diagnostics.getErrors()[0];
      expect(error.code).toBeUndefined();
    });

    it('should handle multiple files', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error 1', 'file1.bp', 1, 1);
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error 2', 'file2.bp', 1, 1);

      const file1 = diagnostics.getDiagnosticsByFile('file1.bp');
      const file2 = diagnostics.getDiagnosticsByFile('file2.bp');

      expect(file1).toHaveLength(1);
      expect(file2).toHaveLength(1);
    });

    it('should handle empty file filter', () => {
      diagnostics.addError(DiagnosticCategory.SYNTAX, 'Error', 'test.bp', 1, 1);
      const empty = diagnostics.getDiagnosticsByFile('nonexistent.bp');
      expect(empty).toHaveLength(0);
    });
  });
});
