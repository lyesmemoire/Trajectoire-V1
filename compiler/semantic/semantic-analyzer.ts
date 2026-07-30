/**
 * Blueprint DSL Semantic Analyzer
 * 
 * Performs semantic analysis on the AST to check for semantic errors.
 */

import { ASTNode, ModuleNode, FunctionNode, TypeNode, ExpressionNode } from '../parser/parser';

export interface SemanticError {
  message: string;
  line: number;
  column: number;
  severity: 'error' | 'warning';
}

export interface SemanticAnalysisResult {
  errors: SemanticError[];
  warnings: SemanticError[];
  success: boolean;
}

export class SemanticAnalyzer {
  private errors: SemanticError[] = [];
  private warnings: SemanticError[] = [];
  private symbolTable: Map<string, TypeNode> = new Map();
  private currentFunction: FunctionNode | null = null;

  /**
   * Analyze the entire AST for semantic errors
   */
  public analyze(node: ASTNode): SemanticAnalysisResult {
    this.errors = [];
    this.warnings = [];
    this.symbolTable = new Map();
    this.currentFunction = null;

    this.analyzeNode(node);

    return {
      errors: this.errors,
      warnings: this.warnings,
      success: this.errors.length === 0,
    };
  }

  /**
   * Analyze a node
   */
  private analyzeNode(node: ASTNode): void {
    switch (node.type) {
      case 'MODULE':
        this.analyzeModule(node as ModuleNode);
        break;
      case 'FUNCTION':
        this.analyzeFunction(node as FunctionNode);
        break;
      case 'BLOCK':
        this.analyzeBlock(node as unknown);
        break;
      case 'ASSIGNMENT':
        this.analyzeAssignment(node as unknown);
        break;
      case 'RETURN':
        this.analyzeReturn(node as unknown);
        break;
      case 'IF':
        this.analyzeIf(node as unknown);
        break;
      case 'FOR':
        this.analyzeFor(node as unknown);
        break;
      case 'WHILE':
        this.analyzeWhile(node as unknown);
        break;
      default:
        this.analyzeExpression(node as ExpressionNode);
    }
  }

  /**
   * Analyze a module
   */
  private analyzeModule(module: ModuleNode): void {
    // Check for duplicate imports
    const importNames = new Set<string>();
    for (const importNode of module.imports) {
      if (importNames.has(importNode.module)) {
        this.addError(`Duplicate import: ${importNode.module}`, importNode.line, importNode.column);
      }
      importNames.add(importNode.module);
    }

    // Check for duplicate exports
    const exportNames = new Set<string>();
    for (const exportNode of module.exports) {
      if (exportNames.has(exportNode.name)) {
        this.addError(`Duplicate export: ${exportNode.name}`, exportNode.line, exportNode.column);
      }
      exportNames.add(exportNode.name);
    }

    // Check for duplicate functions
    const functionNames = new Set<string>();
    for (const functionNode of module.functions) {
      if (functionNames.has(functionNode.name)) {
        this.addError(`Duplicate function: ${functionNode.name}`, functionNode.line, functionNode.column);
      }
      functionNames.add(functionNode.name);

      // Add function to symbol table
      this.symbolTable.set(functionNode.name, functionNode.returnType);

      // Analyze function
      this.analyzeFunction(functionNode);
    }
  }

  /**
   * Analyze a function
   */
  private analyzeFunction(functionNode: FunctionNode): void {
    const previousFunction = this.currentFunction;
    this.currentFunction = functionNode;

    // Create new scope for function parameters
    const localSymbolTable = new Map(this.symbolTable);

    // Add parameters to symbol table
    for (const param of functionNode.parameters) {
      if (localSymbolTable.has(param.name)) {
        this.addError(`Duplicate parameter: ${param.name}`, param.line, param.column);
      }
      localSymbolTable.set(param.name, param.paramType);
    }

    this.symbolTable = localSymbolTable;

    // Analyze function body
    this.analyzeNode(functionNode.body);

    // Restore previous scope
    this.symbolTable = new Map(localSymbolTable);
    this.currentFunction = previousFunction;
  }

  /**
   * Analyze a block
   */
  private analyzeBlock(block: unknown): void {
    // Create new scope for block
    const localSymbolTable = new Map(this.symbolTable);
    this.symbolTable = localSymbolTable;

    // Analyze statements
    for (const statement of block.statements) {
      this.analyzeNode(statement);
    }

    // Restore previous scope
    this.symbolTable = new Map(localSymbolTable);
  }

  /**
   * Analyze an assignment
   */
  private analyzeAssignment(assignment: unknown): void {
    // Analyze the value expression
    this.analyzeExpression(assignment.value);

    // Check if the variable is already declared
    if (!this.symbolTable.has(assignment.name)) {
      this.addWarning(`Variable '${assignment.name}' used without declaration`, assignment.line, assignment.column);
    }
  }

  /**
   * Analyze a return statement
   */
  private analyzeReturn(returnNode: unknown): void {
    if (this.currentFunction) {
      if (returnNode.value) {
        this.analyzeExpression(returnNode.value);

        // Check if return type matches function return type
        if (this.currentFunction.returnType.name !== 'void') {
          // Type checking would be done here
        }
      } else if (this.currentFunction.returnType.name !== 'void') {
        this.addError(`Function '${this.currentFunction.name}' must return a value`, returnNode.line, returnNode.column);
      }
    } else {
      this.addError('Return statement outside function', returnNode.line, returnNode.column);
    }
  }

  /**
   * Analyze an if statement
   */
  private analyzeIf(ifNode: unknown): void {
    this.analyzeExpression(ifNode.condition);
    this.analyzeNode(ifNode.thenBlock);
    if (ifNode.elseBlock) {
      this.analyzeNode(ifNode.elseBlock);
    }
  }

  /**
   * Analyze a for loop
   */
  private analyzeFor(forNode: unknown): void {
    if (forNode.init) {
      this.analyzeNode(forNode.init);
    }
    if (forNode.condition) {
      this.analyzeExpression(forNode.condition);
    }
    if (forNode.update) {
      this.analyzeExpression(forNode.update);
    }
    this.analyzeNode(forNode.body);
  }

  /**
   * Analyze a while loop
   */
  private analyzeWhile(whileNode: unknown): void {
    this.analyzeExpression(whileNode.condition);
    this.analyzeNode(whileNode.body);
  }

  /**
   * Analyze an expression
   */
  private analyzeExpression(expression: ExpressionNode): void {
    switch (expression.type) {
      case 'IDENTIFIER':
        this.analyzeIdentifier(expression);
        break;
      case 'BINARY_EXPRESSION':
        this.analyzeBinaryExpression(expression);
        break;
      case 'UNARY_EXPRESSION':
        this.analyzeUnaryExpression(expression);
        break;
      case 'CALL_EXPRESSION':
        this.analyzeCallExpression(expression);
        break;
      case 'MEMBER_EXPRESSION':
        this.analyzeMemberExpression(expression);
        break;
      default:
        // Literals don't need analysis
        break;
    }
  }

  /**
   * Analyze an identifier
   */
  private analyzeIdentifier(expression: ExpressionNode): void {
    if (!this.symbolTable.has(expression.value)) {
      this.addWarning(`Undefined identifier: ${expression.value}`, expression.line, expression.column);
    }
  }

  /**
   * Analyze a binary expression
   */
  private analyzeBinaryExpression(expression: ExpressionNode): void {
    if (expression.left) {
      this.analyzeExpression(expression.left);
    }
    if (expression.right) {
      this.analyzeExpression(expression.right);
    }

    // Type checking would be done here
  }

  /**
   * Analyze a unary expression
   */
  private analyzeUnaryExpression(expression: ExpressionNode): void {
    if (expression.operand) {
      this.analyzeExpression(expression.operand);
    }
  }

  /**
   * Analyze a call expression
   */
  private analyzeCallExpression(expression: ExpressionNode): void {
    if (expression.callee) {
      this.analyzeExpression(expression.callee);
    }
    if (expression.arguments) {
      for (const arg of expression.arguments) {
        this.analyzeExpression(arg);
      }
    }
  }

  /**
   * Analyze a member expression
   */
  private analyzeMemberExpression(expression: ExpressionNode): void {
    if (expression.object) {
      this.analyzeExpression(expression.object);
    }
  }

  /**
   * Add an error
   */
  private addError(message: string, line: number, column: number): void {
    this.errors.push({
      message,
      line,
      column,
      severity: 'error',
    });
  }

  /**
   * Add a warning
   */
  private addWarning(message: string, line: number, column: number): void {
    this.warnings.push({
      message,
      line,
      column,
      severity: 'warning',
    });
  }
}
