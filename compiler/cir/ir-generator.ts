/**
 * Blueprint DSL IR Generator
 * 
 * Generates Cognitive Intermediate Representation (CIR) from the AST.
 */

import { ASTNode, ModuleNode, FunctionNode, ExpressionNode } from '../parser/parser';

export enum IRNodeType {
  FUNCTION = "FUNCTION",
  BASIC_BLOCK = "BASIC_BLOCK",
  INSTRUCTION = "INSTRUCTION",
  PHI = "PHI",
  CONSTANT = "CONSTANT",
  PARAMETER = "PARAMETER",
  GLOBAL = "GLOBAL",
}

export enum IRInstructionType {
  ADD = "ADD",
  SUB = "SUB",
  MUL = "MUL",
  DIV = "DIV",
  MOD = "MOD",
  AND = "AND",
  OR = "OR",
  XOR = "XOR",
  NOT = "NOT",
  SHL = "SHL",
  SHR = "SHR",
  LOAD = "LOAD",
  STORE = "STORE",
  CALL = "CALL",
  RET = "RET",
  BR = "BR",
  BR_COND = "BR_COND",
  PHI = "PHI",
  COGNITIVE_REASONING = "COGNITIVE_REASONING",
  COGNITIVE_INFERENCE = "COGNITIVE_INFERENCE",
  COGNITIVE_HYPOTHESIS = "COGNITIVE_HYPOTHESIS",
  COGNITIVE_KNOWLEDGE = "COGNITIVE_KNOWLEDGE",
  COGNITIVE_MEMORY = "COGNITIVE_MEMORY",
  PROVIDER_CALL = "PROVIDER_CALL",
}

export interface IRNode {
  id: string;
  type: IRNodeType;
  line: number;
  column: number;
}

export interface IRFunction extends IRNode {
  type: IRNodeType.FUNCTION;
  name: string;
  parameters: IRParameter[];
  basicBlocks: IRBasicBlock[];
  returnType: string;
}

export interface IRBasicBlock extends IRNode {
  type: IRNodeType.BASIC_BLOCK;
  name: string;
  instructions: IRInstruction[];
  predecessors: string[];
  successors: string[];
}

export interface IRInstruction extends IRNode {
  type: IRNodeType.INSTRUCTION;
  instructionType: IRInstructionType;
  operands: IROperand[];
  result?: string;
}

export interface IRPhi extends IRNode {
  type: IRNodeType.PHI;
  result: string;
  incoming: Map<string, string>;
}

export interface IRConstant extends IRNode {
  type: IRNodeType.CONSTANT;
  value: unknown;
  valueType: string;
}

export interface IRParameter extends IRNode {
  type: IRNodeType.PARAMETER;
  name: string;
  paramType: string;
}

export interface IRGlobal extends IRNode {
  type: IRNodeType.GLOBAL;
  name: string;
  valueType: string;
  initialValue?: unknown;
}

export type IROperand = string | IRConstant;

export interface IRModule {
  functions: IRFunction[];
  globals: IRGlobal[];
  metadata: IRMetadata;
}

export interface IRMetadata {
  version: string;
  sourceFile: string;
  compilationTime: number;
  optimizations: string[];
}

export interface IRGenerationResult {
  ir: IRModule;
  success: boolean;
  errors: string[];
}

export class IRGenerator {
  private counter: number = 0;
  private currentFunction: IRFunction | null = null;
  private currentBlock: IRBasicBlock | null = null;
  private errors: string[] = [];

  /**
   * Generate IR from the AST
   */
  public generate(node: ASTNode): IRGenerationResult {
    this.counter = 0;
    this.currentFunction = null;
    this.currentBlock = null;
    this.errors = [];

    const ir: IRModule = {
      functions: [],
      globals: [],
      metadata: {
        version: '1.0.0',
        sourceFile: 'unknown',
        compilationTime: Date.now(),
        optimizations: [],
      },
    };

    if (node.type === 'MODULE') {
      this.generateModule(node as ModuleNode, ir);
    }

    return {
      ir,
      success: this.errors.length === 0,
      errors: this.errors,
    };
  }

  /**
   * Generate IR from a module
   */
  private generateModule(module: ModuleNode, ir: IRModule): void {
    for (const functionNode of module.functions) {
      const irFunction = this.generateFunction(functionNode);
      ir.functions.push(irFunction);
    }
  }

  /**
   * Generate IR from a function
   */
  private generateFunction(functionNode: FunctionNode): IRFunction {
    const previousFunction = this.currentFunction;
    this.currentFunction = {
      id: this.generateId(),
      type: IRNodeType.FUNCTION,
      name: functionNode.name,
      line: functionNode.line,
      column: functionNode.column,
      parameters: [],
      basicBlocks: [],
      returnType: functionNode.returnType.name,
    };

    // Generate parameters
    for (const param of functionNode.parameters) {
      const irParam: IRParameter = {
        id: this.generateId(),
        type: IRNodeType.PARAMETER,
        name: param.name,
        paramType: param.paramType.name,
        line: param.line,
        column: param.column,
      };
      this.currentFunction.parameters.push(irParam);
    }

    // Generate entry block
    const entryBlock = this.createBasicBlock('entry');
    this.currentFunction.basicBlocks.push(entryBlock);

    // Generate body
    this.generateBlock(functionNode.body);

    // Add return instruction if not present
    if (this.currentBlock && !this.hasReturnInstruction(this.currentBlock)) {
      this.addInstruction(IRInstructionType.RET, []);
    }

    const irFunction = this.currentFunction;
    this.currentFunction = previousFunction;

    return irFunction;
  }

  /**
   * Generate IR from a block
   */
  private generateBlock(block: unknown): void {
    const previousBlock = this.currentBlock;
    const blockName = `block_${this.counter++}`;
    const blockNode = this.createBasicBlock(blockName);

    if (previousBlock && this.currentFunction) {
      previousBlock.successors.push(blockName);
      blockNode.predecessors.push(previousBlock.name);
    }

    this.currentBlock = blockNode;
    if (this.currentFunction) {
      this.currentFunction.basicBlocks.push(blockNode);
    }

    for (const statement of block.statements) {
      this.generateStatement(statement);
    }

    this.currentBlock = previousBlock;
  }

  /**
   * Generate IR from a statement
   */
  private generateStatement(statement: unknown): void {
    switch (statement.type) {
      case 'ASSIGNMENT':
        this.generateAssignment(statement);
        break;
      case 'RETURN':
        this.generateReturn(statement);
        break;
      case 'IF':
        this.generateIf(statement);
        break;
      case 'FOR':
        this.generateFor(statement);
        break;
      case 'WHILE':
        this.generateWhile(statement);
        break;
      default:
        this.generateExpression(statement);
    }
  }

  /**
   * Generate IR from an assignment
   */
  private generateAssignment(assignment: unknown): void {
    const valueResult = this.generateExpression(assignment.value);
    this.addInstruction(IRInstructionType.STORE, [assignment.name, valueResult]);
  }

  /**
   * Generate IR from a return statement
   */
  private generateReturn(returnNode: unknown): void {
    if (returnNode.value) {
      const valueResult = this.generateExpression(returnNode.value);
      this.addInstruction(IRInstructionType.RET, [valueResult]);
    } else {
      this.addInstruction(IRInstructionType.RET, []);
    }
  }

  /**
   * Generate IR from an if statement
   */
  private generateIf(ifNode: unknown): void {
    const conditionResult = this.generateExpression(ifNode.condition);
    
    const thenBlock = this.createBasicBlock(`then_${this.counter++}`);
    const elseBlock = this.createBasicBlock(`else_${this.counter++}`);
    const mergeBlock = this.createBasicBlock(`merge_${this.counter++}`);

    if (this.currentFunction) {
      this.currentFunction.basicBlocks.push(thenBlock, elseBlock, mergeBlock);
    }

    // Add conditional branch
    this.addInstruction(IRInstructionType.BR_COND, [conditionResult, thenBlock.name, elseBlock.name]);

    // Generate then block
    this.currentBlock = thenBlock;
    this.generateBlock(ifNode.thenBlock);
    this.addInstruction(IRInstructionType.BR, [mergeBlock.name]);

    // Generate else block
    this.currentBlock = elseBlock;
    if (ifNode.elseBlock) {
      this.generateBlock(ifNode.elseBlock);
    }
    this.addInstruction(IRInstructionType.BR, [mergeBlock.name]);

    // Set merge block as current
    this.currentBlock = mergeBlock;
  }

  /**
   * Generate IR from a for loop
   */
  private generateFor(forNode: unknown): void {
    // Simplified implementation
    // In a real implementation, this would generate proper loop IR
    if (forNode.init) {
      this.generateStatement(forNode.init);
    }

    const loopCondition = this.createBasicBlock(`loop_cond_${this.counter++}`);
    const loopBody = this.createBasicBlock(`loop_body_${this.counter++}`);
    const loopExit = this.createBasicBlock(`loop_exit_${this.counter++}`);

    if (this.currentFunction) {
      this.currentFunction.basicBlocks.push(loopCondition, loopBody, loopExit);
    }

    this.addInstruction(IRInstructionType.BR, [loopCondition.name]);

    this.currentBlock = loopCondition;
    if (forNode.condition) {
      const conditionResult = this.generateExpression(forNode.condition);
      this.addInstruction(IRInstructionType.BR_COND, [conditionResult, loopBody.name, loopExit.name]);
    }

    this.currentBlock = loopBody;
    this.generateBlock(forNode.body);
    if (forNode.update) {
      this.generateExpression(forNode.update);
    }
    this.addInstruction(IRInstructionType.BR, [loopCondition.name]);

    this.currentBlock = loopExit;
  }

  /**
   * Generate IR from a while loop
   */
  private generateWhile(whileNode: unknown): void {
    const loopCondition = this.createBasicBlock(`while_cond_${this.counter++}`);
    const loopBody = this.createBasicBlock(`while_body_${this.counter++}`);
    const loopExit = this.createBasicBlock(`while_exit_${this.counter++}`);

    if (this.currentFunction) {
      this.currentFunction.basicBlocks.push(loopCondition, loopBody, loopExit);
    }

    this.addInstruction(IRInstructionType.BR, [loopCondition.name]);

    this.currentBlock = loopCondition;
    const conditionResult = this.generateExpression(whileNode.condition);
    this.addInstruction(IRInstructionType.BR_COND, [conditionResult, loopBody.name, loopExit.name]);

    this.currentBlock = loopBody;
    this.generateBlock(whileNode.body);
    this.addInstruction(IRInstructionType.BR, [loopCondition.name]);

    this.currentBlock = loopExit;
  }

  /**
   * Generate IR from an expression and return the result operand
   */
  private generateExpression(expression: ExpressionNode): string {
    switch (expression.type) {
      case 'IDENTIFIER':
        return expression.value;
      case 'STRING_LITERAL':
      case 'NUMBER_LITERAL':
      case 'BOOLEAN_LITERAL':
        return this.generateConstant(expression.value);
      case 'BINARY_EXPRESSION':
        return this.generateBinaryExpression(expression);
      case 'UNARY_EXPRESSION':
        return this.generateUnaryExpression(expression);
      case 'CALL_EXPRESSION':
        return this.generateCallExpression(expression);
      case 'MEMBER_EXPRESSION':
        return this.generateMemberExpression(expression);
      default:
        return '';
    }
  }

  /**
   * Generate IR from a binary expression
   */
  private generateBinaryExpression(expression: ExpressionNode): string {
    if (!expression.left || !expression.right) {
      return '';
    }

    const left = this.generateExpression(expression.left);
    const right = this.generateExpression(expression.right);
    const result = this.generateId();

    let instructionType: IRInstructionType;
    switch (expression.operator) {
      case '+':
        instructionType = IRInstructionType.ADD;
        break;
      case '-':
        instructionType = IRInstructionType.SUB;
        break;
      case '*':
        instructionType = IRInstructionType.MUL;
        break;
      case '/':
        instructionType = IRInstructionType.DIV;
        break;
      case '%':
        instructionType = IRInstructionType.MOD;
        break;
      case '&&':
        instructionType = IRInstructionType.AND;
        break;
      case '||':
        instructionType = IRInstructionType.OR;
        break;
      default:
        instructionType = IRInstructionType.ADD;
    }

    this.addInstruction(instructionType, [result, left, right]);
    return result;
  }

  /**
   * Generate IR from一个 unary expression
   */
  private generateUnaryExpression(expression: ExpressionNode): string {
    if (!expression.operand) {
      return '';
    }

    const operand = this.generateExpression(expression.operand);
    const result = this.generateId();

    let instructionType: IRInstructionType;
    switch (expression.operator) {
      case '!':
        instructionType = IRInstructionType.NOT;
        break;
      case '-':
        instructionType = IRInstructionType.SUB;
        break;
      default:
        instructionType = IRInstructionType.NOT;
    }

    this.addInstruction(instructionType, [result, operand]);
    return result;
  }

  /**
   * Generate IR from a call expression
   */
  private generateCallExpression(expression: ExpressionNode): string {
    if (!expression.callee) {
      return '';
    }

    const callee = this.generateExpression(expression.callee);
    const result = this.generateId();
    const args: string[] = [result, callee];

    if (expression.arguments) {
      for (const arg of expression.arguments) {
        args.push(this.generateExpression(arg));
      }
    }

    this.addInstruction(IRInstructionType.CALL, args);
    return result;
  }

  /**
   * Generate IR from a member expression
   */
  private generateMemberExpression(expression: ExpressionNode): string {
    if (!expression.object) {
      return '';
    }

    const object = this.generateExpression(expression.object);
    const result = this.generateId();

    this.addInstruction(IRInstructionType.LOAD, [result, object, expression.property || '']);
    return result;
  }

  /**
   * Generate a constant
   */
  private generateConstant(value: unknown): string {
    const constantId = this.generateId();
    const constant: IRConstant = {
      id: constantId,
      type: IRNodeType.CONSTANT,
      value,
      valueType: typeof value,
      line: 0,
      column: 0,
    };
    return constantId;
  }

  /**
   * Create a basic block
   */
  private createBasicBlock(name: string): IRBasicBlock {
    return {
      id: this.generateId(),
      type: IRNodeType.BASIC_BLOCK,
      name,
      line: 0,
      column: 0,
      instructions: [],
      predecessors: [],
      successors: [],
    };
  }

  /**
   * Add an instruction to the current block
   */
  private addInstruction(instructionType: IRInstructionType, operands: IROperand[]): void {
    if (!this.currentBlock) {
      return;
    }

    const instruction: IRInstruction = {
      id: this.generateId(),
      type: IRNodeType.INSTRUCTION,
      instructionType,
      operands,
      line: 0,
      column: 0,
    };

    this.currentBlock.instructions.push(instruction);
  }

  /**
   * Check if a block has a return instruction
   */
  private hasReturnInstruction(block: IRBasicBlock): boolean {
    return block.instructions.some(
      inst => inst.instructionType === IRInstructionType.RET
    );
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `ir_${this.counter++}`;
  }
}
