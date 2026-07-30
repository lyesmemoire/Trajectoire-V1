/**
 * AST Node Type Definitions
 * 
 * This file contains TypeScript interface declarations for AST nodes.
 * These are compile-time only type definitions and are excluded from coverage analysis.
 */

export interface ASTNode {
  type: string;
  line: number;
  column: number;
}

export interface ModuleNode extends ASTNode {
  type: string;
  name: string;
  imports: ImportNode[];
  exports: ExportNode[];
  functions: FunctionNode[];
}

export interface ImportNode extends ASTNode {
  type: string;
  module: string;
  alias?: string;
}

export interface ExportNode extends ASTNode {
  type: string;
  name: string;
}

export interface FunctionNode extends ASTNode {
  type: string;
  name: string;
  parameters: ParameterNode[];
  returnType: TypeNode;
  body: BlockNode;
}

export interface ParameterNode extends ASTNode {
  type: string;
  name: string;
  paramType: TypeNode;
  optional: boolean;
}

export interface TypeNode extends ASTNode {
  type: string;
  name: string;
  generic?: TypeNode;
}

export interface BlockNode extends ASTNode {
  type: string;
  statements: StatementNode[];
}

export type StatementNode = ReturnNode | IfNode | ForNode | WhileNode | AssignmentNode | ExpressionNode;

export interface ExpressionNode extends ASTNode {
  type: string;
  value?: unknown;
  operator?: string;
  left?: ExpressionNode;
  right?: ExpressionNode;
  operand?: ExpressionNode;
  callee?: ExpressionNode;
  arguments?: ExpressionNode[];
  object?: ExpressionNode;
  property?: string;
}

export interface BinaryExpressionNode extends ASTNode {
  type: string;
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface UnaryExpressionNode extends ASTNode {
  type: string;
  operator: string;
  operand: ExpressionNode;
}

export interface CallExpressionNode extends ASTNode {
  type: string;
  callee: ExpressionNode;
  arguments: ExpressionNode[];
}

export interface MemberExpressionNode extends ASTNode {
  type: string;
  object: ExpressionNode;
  property: string;
}

export interface AssignmentNode extends ASTNode {
  type: string;
  name: string;
  value: ExpressionNode;
}

export interface ReturnNode extends ASTNode {
  type: string;
  value?: ExpressionNode;
}

export interface IfNode extends ASTNode {
  type: string;
  condition: ExpressionNode;
  thenBlock: BlockNode;
  elseBlock?: BlockNode;
}

export interface ForNode extends ASTNode {
  type: string;
  init?: StatementNode;
  condition?: ExpressionNode;
  update?: ExpressionNode;
  body: BlockNode;
}

export interface WhileNode extends ASTNode {
  type: string;
  condition: ExpressionNode;
  body: BlockNode;
}
