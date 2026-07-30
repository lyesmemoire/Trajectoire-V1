/**
 * Blueprint DSL Type Checker
 * 
 * Performs type checking on the AST to ensure type safety.
 */

import { ASTNode, ModuleNode, FunctionNode, TypeNode, ExpressionNode } from '../parser/parser';

export enum PrimitiveType {
  STRING = "string",
  INTEGER = "integer",
  FLOAT = "float",
  BOOLEAN = "boolean",
  VOID = "void",
}

export enum ComplexType {
  LIST = "list",
  MAP = "map",
  OPTIONAL = "optional",
  FUNCTION = "function",
}

export interface TypeInfo {
  name: string;
  primitive?: PrimitiveType;
  complex?: ComplexType;
  generic?: TypeInfo;
  parameters?: TypeInfo[];
}

export interface TypeError {
  message: string;
  line: number;
  column: number;
  severity: 'error' | 'warning';
}

export interface TypeCheckResult {
  errors: TypeError[];
  warnings: TypeError[];
  success: boolean;
}

export class TypeChecker {
  private errors: TypeError[] = [];
  private warnings: TypeError[] = [];
  private typeTable: Map<string, TypeInfo> = new Map();
  private currentFunction: FunctionNode | null = null;

  constructor() {
    this.initializePrimitiveTypes();
  }

  /**
   * Initialize primitive types
   */
  private initializePrimitiveTypes(): void {
    this.typeTable.set('string', { name: 'string', primitive: PrimitiveType.STRING });
    this.typeTable.set('integer', { name: 'integer', primitive: PrimitiveType.INTEGER });
    this.typeTable.set('float', { name: 'float', primitive: PrimitiveType.FLOAT });
    this.typeTable.set('boolean', { name: 'boolean', primitive: PrimitiveType.BOOLEAN });
    this.typeTable.set('void', { name: 'void', primitive: PrimitiveType.VOID });
  }

  /**
   * Type check the entire AST
   */
  public typeCheck(node: ASTNode): TypeCheckResult {
    this.errors = [];
    this.warnings = [];
    this.typeTable = new Map();
    this.currentFunction = null;

    this.initializePrimitiveTypes();
    this.typeCheckNode(node);

    return {
      errors: this.errors,
      warnings: this.warnings,
      success: this.errors.length === 0,
    };
  }

  /**
   * Type check a node
   */
  private typeCheckNode(node: ASTNode): void {
    switch (node.type) {
      case 'MODULE':
        this.typeCheckModule(node as ModuleNode);
        break;
      case 'FUNCTION':
        this.typeCheckFunction(node as FunctionNode);
        break;
      case 'BLOCK':
        this.typeCheckBlock(node as unknown);
        break;
      case 'ASSIGNMENT':
        this.typeCheckAssignment(node as unknown);
        break;
      case 'RETURN':
        this.typeCheckReturn(node as unknown);
        break;
      case 'IF':
        this.typeCheckIf(node as unknown);
        break;
      case 'FOR':
        this.typeCheckFor(node as unknown);
        break;
      case 'WHILE':
        this.typeCheckWhile(node as unknown);
        break;
      default:
        this.typeCheckExpression(node as ExpressionNode);
    }
  }

  /**
   * Type check a module
   */
  private typeCheckModule(module: ModuleNode): void {
    for (const functionNode of module.functions) {
      this.typeCheckFunction(functionNode);
    }
  }

  /**
   * Type check a function
   */
  private typeCheckFunction(functionNode: FunctionNode): void {
    const previousFunction = this.currentFunction;
    this.currentFunction = functionNode;

    // Create new scope for function parameters
    const localTypeTable = new Map(this.typeTable);

    // Add parameters to type table
    for (const param of functionNode.parameters) {
      const paramType = this.resolveType(param.paramType);
      localTypeTable.set(param.name, paramType);
    }

    this.typeTable = localTypeTable;

    // Type check function body
    this.typeCheckNode(functionNode.body);

    // Restore previous scope
    this.typeTable = new Map(localTypeTable);
    this.currentFunction = previousFunction;
  }

  /**
   * Type check a block
   */
  private typeCheckBlock(block: unknown): void {
    const localTypeTable = new Map(this.typeTable);
    this.typeTable = localTypeTable;

    for (const statement of block.statements) {
      this.typeCheckNode(statement);
    }

    this.typeTable = new Map(localTypeTable);
  }

  /**
   * Type check an assignment
   */
  private typeCheckAssignment(assignment: unknown): void {
    const valueType = this.typeCheckExpression(assignment.value);

    if (this.typeTable.has(assignment.name)) {
      const declaredType = this.typeTable.get(assignment.name)!;
      if (!this.isTypeCompatible(valueType, declaredType)) {
        this.addError(
          `Type mismatch: cannot assign ${valueType.name} to ${declaredType.name}`,
          assignment.line,
          assignment.column
        );
      }
    } else {
      // Infer type from value
      this.typeTable.set(assignment.name, valueType);
    }
  }

  /**
   * Type check a return statement
   */
  private typeCheckReturn(returnNode: unknown): void {
    if (this.currentFunction) {
      const returnType = this.resolveType(this.currentFunction.returnType);

      if (returnNode.value) {
        const valueType = this.typeCheckExpression(returnNode.value);

        if (!this.isTypeCompatible(valueType, returnType)) {
          this.addError(
            `Return type mismatch: expected ${returnType.name}, got ${valueType.name}`,
            returnNode.line,
            returnNode.column
          );
        }
      } else if (returnType.name !== 'void') {
        this.addError(
          `Function '${this.currentFunction.name}' must return a value of type ${returnType.name}`,
          returnNode.line,
          returnNode.column
        );
      }
    }
  }

  /**
   * Type check an if statement
   */
  private typeCheckIf(ifNode: unknown): void {
    const conditionType = this.typeCheckExpression(ifNode.condition);

    if (conditionType.name !== 'boolean') {
      this.addWarning(
        `Condition should be boolean, got ${conditionType.name}`,
        ifNode.condition.line,
        ifNode.condition.column
      );
    }

    this.typeCheckNode(ifNode.thenBlock);
    if (ifNode.elseBlock) {
      this.typeCheckNode(ifNode.elseBlock);
    }
  }

  /**
   * Type check a for loop
   */
  private typeCheckFor(forNode: unknown): void {
    if (forNode.init) {
      this.typeCheckNode(forNode.init);
    }
    if (forNode.condition) {
      const conditionType = this.typeCheckExpression(forNode.condition);
      if (conditionType.name !== 'boolean') {
        this.addWarning(
          `Condition should be boolean, got ${conditionType.name}`,
          forNode.condition.line,
          forNode.condition.column
        );
      }
    }
    if (forNode.update) {
      this.typeCheckExpression(forNode.update);
    }
    this.typeCheckNode(forNode.body);
  }

  /**
   * Type check a while loop
   */
  private typeCheckWhile(whileNode: unknown): void {
    const conditionType = this.typeCheckExpression(whileNode.condition);

    if (conditionType.name !== 'boolean') {
      this.addWarning(
        `Condition should be boolean, got ${conditionType.name}`,
        whileNode.condition.line,
        whileNode.condition.column
      );
    }

    this.typeCheckNode(whileNode.body);
  }

  /**
   * Type check an expression and return its type
   */
  private typeCheckExpression(expression: ExpressionNode): TypeInfo {
    switch (expression.type) {
      case 'IDENTIFIER':
        return this.typeCheckIdentifier(expression);
      case 'STRING_LITERAL':
        return this.typeTable.get('string')!;
      case 'NUMBER_LITERAL':
        return this.typeTable.get('integer')!;
      case 'BOOLEAN_LITERAL':
        return this.typeTable.get('boolean')!;
      case 'BINARY_EXPRESSION':
        return this.typeCheckBinaryExpression(expression);
      case 'UNARY_EXPRESSION':
        return this.typeCheckUnaryExpression(expression);
      case 'CALL_EXPRESSION':
        return this.typeCheckCallExpression(expression);
      case 'MEMBER_EXPRESSION':
        return this.typeCheckMemberExpression(expression);
      default:
        return this.typeTable.get('void')!;
    }
  }

  /**
   * Type check an identifier
   */
  private typeCheckIdentifier(expression: ExpressionNode): TypeInfo {
    if (this.typeTable.has(expression.value)) {
      return this.typeTable.get(expression.value)!;
    }
    this.addError(
      `Undefined identifier: ${expression.value}`,
      expression.line,
      expression.column
    );
    return this.typeTable.get('void')!;
  }

  /**
   * Type check a binary expression
   */
  private typeCheckBinaryExpression(expression: ExpressionNode): TypeInfo {
    if (!expression.left || !expression.right) {
      return this.typeTable.get('void')!;
    }

    const leftType = this.typeCheckExpression(expression.left);
    const rightType = this.typeCheckExpression(expression.right);

    // Type checking based on operator
    if (['+', '-', '*', '/'].includes(expression.operator!)) {
      if (leftType.name !== 'integer' && leftType.name !== 'float') {
        this.addError(
          `Operator '${expression.operator}' requires numeric type, got ${leftType.name}`,
          expression.line,
          expression.column
        );
      }
      if (rightType.name !== 'integer' && rightType.name !== 'float') {
        this.addError(
          `Operator '${expression.operator}' requires numeric type, got ${rightType.name}`,
          expression.line,
          expression.column
        );
      }
      return leftType;
    }

    if (['==', '!=', '<', '>', '<=', '>='].includes(expression.operator!)) {
      return this.typeTable.get('boolean')!;
    }

    if (['&&', '||'].includes(expression.operator!)) {
      if (leftType.name !== 'boolean') {
        this.addError(
          `Operator '${expression.operator}' requires boolean type, got ${leftType.name}`,
          expression.line,
          expression.column
        );
      }
      if (rightType.name !== 'boolean') {
        this.addError(
          `Operator '${expression.operator}' requires boolean type, got ${rightType.name}`,
          expression.line,
          expression.column
        );
      }
      return this.typeTable.get('boolean')!;
    }

    return this.typeTable.get('void')!;
  }

  /**
   * Type check a unary expression
   */
  private typeCheckUnaryExpression(expression: ExpressionNode): TypeInfo {
    if (!expression.operand) {
      return this.typeTable.get('void')!;
    }

    const operandType = this.typeCheckExpression(expression.operand);

    if (expression.operator === '!') {
      if (operandType.name !== 'boolean') {
        this.addError(
          `Operator '!' requires boolean type, got ${operandType.name}`,
          expression.line,
          expression.column
        );
      }
      return this.typeTable.get('boolean')!;
    }

    if (expression.operator === '-') {
      if (operandType.name !== 'integer' && operandType.name !== 'float') {
        this.addError(
          `Operator '-' requires numeric type, got ${operandType.name}`,
          expression.line,
          expression.column
        );
      }
      return operandType;
    }

    return this.typeTable.get('void')!;
  }

  /**
   * Type check a call expression
   */
  private typeCheckCallExpression(expression: ExpressionNode): TypeInfo {
    if (!expression.callee) {
      return this.typeTable.get('void')!;
    }

    const calleeType = this.typeCheckExpression(expression.callee);

    if (calleeType.complex === ComplexType.FUNCTION) {
      // Check argument count
      if (calleeType.parameters && expression.arguments) {
        if (calleeType.parameters.length !== expression.arguments.length) {
          this.addError(
            `Argument count mismatch: expected ${calleeType.parameters.length}, got ${expression.arguments.length}`,
            expression.line,
            expression.column
          );
        }

        // Check argument types
        if (expression.arguments) {
          for (let i = 0; i < expression.arguments.length; i++) {
            const argType = this.typeCheckExpression(expression.arguments[i]);
            const paramType = calleeType.parameters[i];

            if (!this.isTypeCompatible(argType, paramType)) {
              this.addError(
                `Argument ${i + 1} type mismatch: expected ${paramType.name}, got ${argType.name}`,
                expression.arguments[i].line,
                expression.arguments[i].column
              );
            }
          }
        }
      }

      return calleeType.generic || this.typeTable.get('void')!;
    }

    return this.typeTable.get('void')!;
  }

  /**
   * Type check a member expression
   */
  private typeCheckMemberExpression(expression: ExpressionNode): TypeInfo {
    if (!expression.object) {
      return this.typeTable.get('void')!;
    }

    return this.typeCheckExpression(expression.object);
  }

  /**
   * Resolve a type from a type node
   */
  private resolveType(typeNode: TypeNode): TypeInfo {
    if (this.typeTable.has(typeNode.name)) {
      const baseType = this.typeTable.get(typeNode.name)!;

      if (typeNode.generic) {
        const genericType = this.resolveType(typeNode.generic);
        return {
          name: typeNode.name,
          complex: ComplexType.LIST,
          generic: genericType,
        };
      }

      return baseType;
    }

    // Try to resolve as complex type
    if (typeNode.name === 'list') {
      if (typeNode.generic) {
        const genericType = this.resolveType(typeNode.generic);
        return {
          name: 'list',
          complex: ComplexType.LIST,
          generic: genericType,
        };
      }
      return {
        name: 'list',
        complex: ComplexType.LIST,
      };
    }

    if (typeNode.name === 'map') {
      return {
        name: 'map',
        complex: ComplexType.MAP,
      };
    }

    if (typeNode.name === 'optional') {
      if (typeNode.generic) {
        const genericType = this.resolveType(typeNode.generic);
        return {
          name: 'optional',
          complex: ComplexType.OPTIONAL,
          generic: genericType,
        };
      }
      return {
        name: 'optional',
        complex: ComplexType.OPTIONAL,
      };
    }

    this.addError(
      `Unknown type: ${typeNode.name}`,
      typeNode.line,
      typeNode.column
    );

    return this.typeTable.get('void')!;
  }

  /**
   * Check if two types are compatible
   */
  private isTypeCompatible(source: TypeInfo, target: TypeInfo): boolean {
    // Same type
    if (source.name === target.name) {
      return true;
    }

    // Numeric compatibility
    if (source.primitive === PrimitiveType.INTEGER && target.primitive === PrimitiveType.FLOAT) {
      return true;
    }

    // Void compatibility
    if (target.name === 'void') {
      return true;
    }

    return false;
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
