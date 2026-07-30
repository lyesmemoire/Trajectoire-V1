/**
 * Blueprint DSL Reference Resolver
 * 
 * Resolves references in the AST to ensure all references are valid.
 */

import { ASTNode, ModuleNode, FunctionNode, ExpressionNode } from '../parser/parser';
import { SymbolTable, Symbol } from './symbol-table';

export interface Reference {
  name: string;
  line: number;
  column: number;
  symbol?: Symbol;
  resolved: boolean;
}

export interface ReferenceResolutionResult {
  references: Reference[];
  unresolved: Reference[];
  success: boolean;
}

export class ReferenceResolver {
  private symbolTable: SymbolTable;
  private references: Reference[] = [];

  constructor(symbolTable: SymbolTable) {
    this.symbolTable = symbolTable;
  }

  /**
   * Resolve references in the AST
   */
  public resolve(node: ASTNode): ReferenceResolutionResult {
    this.references = [];

    this.resolveNode(node);

    const unresolved = this.references.filter(ref => !ref.resolved);

    return {
      references: this.references,
      unresolved,
      success: unresolved.length === 0,
    };
  }

  /**
   * Resolve references in a node
   */
  private resolveNode(node: ASTNode): void {
    switch (node.type) {
      case 'MODULE':
        this.resolveModule(node as ModuleNode);
        break;
      case 'FUNCTION':
        this.resolveFunction(node as FunctionNode);
        break;
      case 'BLOCK':
        this.resolveBlock(node as unknown);
        break;
      case 'ASSIGNMENT':
        this.resolveAssignment(node as unknown);
        break;
      case 'RETURN':
        this.resolveReturn(node as unknown);
        break;
      case 'IF':
        this.resolveIf(node as unknown);
        break;
      case 'FOR':
        this.resolveFor(node as unknown);
        break;
      case 'WHILE':
        this.resolveWhile(node as unknown);
        break;
      default:
        this.resolveExpression(node as ExpressionNode);
    }
  }

  /**
   * Resolve references in a module
   */
  private resolveModule(module: ModuleNode): void {
    // Resolve import references
    for (const importNode of module.imports) {
      const reference: Reference = {
        name: importNode.module,
        line: importNode.line,
        column: importNode.column,
        resolved: true, // Imports are resolved by the package manager
      };
      this.references.push(reference);
    }

    // Resolve function references
    for (const functionNode of module.functions) {
      this.resolveFunction(functionNode);
    }
  }

  /**
   * Resolve references in a function
   */
  private resolveFunction(functionNode: FunctionNode): void {
    // Enter function scope
    const functionScopeId = this.symbolTable.getCurrentScopeId();

    // Resolve parameter references
    for (const param of functionNode.parameters) {
      const reference: Reference = {
        name: param.name,
        line: param.line,
        column: param.column,
        resolved: true, // Parameters are in scope
      };
      this.references.push(reference);
    }

    // Resolve body references
    this.resolveNode(functionNode.body);

    // Exit function scope
    this.symbolTable.exitScope();
  }

  /**
   * Resolve references in a block
   */
  private resolveBlock(block: unknown): void {
    // Enter block scope
    const blockScopeId = this.symbolTable.getCurrentScopeId();

    // Resolve statement references
    for (const statement of block.statements) {
      this.resolveNode(statement);
    }

    // Exit block scope
    this.symbolTable.exitScope();
  }

  /**
   * Resolve references in an assignment
   */
  private resolveAssignment(assignment: unknown): void {
    // Resolve value references
    this.resolveExpression(assignment.value);

    // Check if the variable is declared
    const symbol = this.symbolTable.getSymbol(assignment.name);
    const reference: Reference = {
      name: assignment.name,
      line: assignment.line,
      column: assignment.column,
      symbol: symbol || undefined,
      resolved: symbol !== null,
    };
    this.references.push(reference);
  }

  /**
   * Resolve references in a return statement
   */
  private resolveReturn(returnNode: unknown): void {
    if (returnNode.value) {
      this.resolveExpression(returnNode.value);
    }
  }

  /**
   * Resolve references in an if statement
   */
  private resolveIf(ifNode: unknown): void {
    this.resolveExpression(ifNode.condition);
    this.resolveNode(ifNode.thenBlock);
    if (ifNode.elseBlock) {
      this.resolveNode(ifNode.elseBlock);
    }
  }

  /**
   * Resolve references in a for loop
   */
  private resolveFor(forNode: unknown): void {
    if (forNode.init) {
      this.resolveNode(forNode.init);
    }
    if (forNode.condition) {
      this.resolveExpression(forNode.condition);
    }
    if (forNode.update) {
      this.resolveExpression(forNode.update);
    }
    this.resolveNode(forNode.body);
  }

  /**
   * Resolve references in a while loop
   */
  private resolveWhile(whileNode: unknown): void {
    this.resolveExpression(whileNode.condition);
    this.resolveNode(whileNode.body);
  }

  /**
   * Resolve references in an expression
   */
  private resolveExpression(expression: ExpressionNode): void {
    switch (expression.type) {
      case 'IDENTIFIER':
        this.resolveIdentifier(expression);
        break;
      case 'BINARY_EXPRESSION':
        this.resolveBinaryExpression(expression);
        break;
      case 'UNARY_EXPRESSION':
        this.resolveUnaryExpression(expression);
        break;
      case 'CALL_EXPRESSION':
        this.resolveCallExpression(expression);
        break;
      case 'MEMBER_EXPRESSION':
        this.resolveMemberExpression(expression);
        break;
      default:
        // Literals don't have references
        break;
    }
  }

  /**
   * Resolve an identifier reference
   */
  private resolveIdentifier(expression: ExpressionNode): void {
    const symbol = this.symbolTable.getSymbol(expression.value);
    const reference: Reference = {
      name: expression.value,
      line: expression.line,
      column: expression.column,
      symbol: symbol || undefined,
      resolved: symbol !== null,
    };
    this.references.push(reference);
  }

  /**
   * Resolve references in a binary expression
   */
  private resolveBinaryExpression(expression: ExpressionNode): void {
    if (expression.left) {
      this.resolveExpression(expression.left);
    }
    if (expression.right) {
      this.resolveExpression(expression.right);
    }
  }

  /**
   * Resolve references in a unary expression
   */
  private resolveUnaryExpression(expression: ExpressionNode): void {
    if (expression.operand) {
      this.resolveExpression(expression.operand);
    }
  }

  /**
   * Resolve references in a call expression
   */
  private resolveCallExpression(expression: ExpressionNode): void {
    if (expression.callee) {
      this.resolveExpression(expression.callee);
    }
    if (expression.arguments) {
      for (const arg of expression.arguments) {
        this.resolveExpression(arg);
      }
    }
  }

  /**
   * Resolve references in a member expression
   */
  private resolveMemberExpression(expression: ExpressionNode): void {
    if (expression.object) {
      this.resolveExpression(expression.object);
    }
  }
}
