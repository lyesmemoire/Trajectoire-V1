/**
 * Blueprint DSL IR Visitor
 * 
 * Visitor pattern for traversing and manipulating IR nodes.
 */

import { IRModule, IRFunction, IRBasicBlock, IRInstruction, IRNode, IRNodeType } from './ir-generator';

export interface IRVisitor {
  visitModule(module: IRModule): void;
  visitFunction(irFunction: IRFunction): void;
  visitBasicBlock(block: IRBasicBlock): void;
  visitInstruction(instruction: IRInstruction): void;
  visitNode(node: IRNode): void;
}

export class BaseIRVisitor implements IRVisitor {
  /**
   * Visit a module
   */
  public visitModule(module: IRModule): void {
    for (const func of module.functions) {
      this.visitFunction(func);
    }
  }

  /**
   * Visit a function
   */
  public visitFunction(irFunction: IRFunction): void {
    for (const block of irFunction.basicBlocks) {
      this.visitBasicBlock(block);
    }
  }

  /**
   * Visit a basic block
   */
  public visitBasicBlock(block: IRBasicBlock): void {
    for (const instruction of block.instructions) {
      this.visitInstruction(instruction);
    }
  }

  /**
   * Visit an instruction
   */
  public visitInstruction(instruction: IRInstruction): void {
    // Base implementation does nothing
  }

  /**
   * Visit a node
   */
  public visitNode(node: IRNode): void {
    switch (node.type) {
      case IRNodeType.FUNCTION:
        this.visitFunction(node as unknown);
        break;
      case IRNodeType.BASIC_BLOCK:
        this.visitBasicBlock(node as unknown);
        break;
      case IRNodeType.INSTRUCTION:
        this.visitInstruction(node as unknown);
        break;
      default:
        break;
    }
  }
}

export class IRTraverser {
  private visitor: IRVisitor;

  constructor(visitor: IRVisitor) {
    this.visitor = visitor;
  }

  /**
   * Traverse an IR module
   */
  public traverse(module: IRModule): void {
    this.visitor.visitModule(module);
  }

  /**
   * Traverse an IR function
   */
  public traverseFunction(irFunction: IRFunction): void {
    this.visitor.visitFunction(irFunction);
  }

  /**
   * Traverse an IR basic block
   */
  public traverseBlock(block: IRBasicBlock): void {
    this.visitor.visitBasicBlock(block);
  }

  /**
   * Traverse an IR instruction
   */
  public traverseInstruction(instruction: IRInstruction): void {
    this.visitor.visitInstruction(instruction);
  }
}

export class IRTransformer extends BaseIRVisitor {
  private transformations: Map<string, (node: IRNode) => IRNode> = new Map();

  /**
   * Register a transformation for a node type
   */
  public registerTransformation(nodeType: IRNodeType, transform: (node: IRNode) => IRNode): void {
    this.transformations.set(nodeType, transform);
  }

  /**
   * Visit a node and apply transformations
   */
  public visitNode(node: IRNode): void {
    const transform = this.transformations.get(node.type);
    if (transform) {
      const transformed = transform(node);
      // Apply transformation recursively
      super.visitNode(transformed);
    } else {
      super.visitNode(node);
    }
  }

  /**
   * Clear all transformations
   */
  public clearTransformations(): void {
    this.transformations.clear();
  }
}

export class IRAnalyzer extends BaseIRVisitor {
  private metrics: Map<string, number> = new Map();
  private instructionCounts: Map<string, number> = new Map();

  /**
   * Visit an instruction and count it
   */
  public visitInstruction(instruction: IRInstruction): void {
    const instructionType = instruction.instructionType;
    const count = this.instructionCounts.get(instructionType) || 0;
    this.instructionCounts.set(instructionType, count + 1);

    super.visitInstruction(instruction);
  }

  /**
   * Visit a function and count its blocks
   */
  public visitFunction(irFunction: IRFunction): void {
    const blockCount = irFunction.basicBlocks.length;
    this.metrics.set('basicBlocks', (this.metrics.get('basicBlocks') || 0) + blockCount);

    super.visitFunction(irFunction);
  }

  /**
   * Get metrics
   */
  public getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  /**
   * Get instruction counts
   */
  public getInstructionCounts(): Map<string, number> {
    return new Map(this.instructionCounts);
  }

  /**
   * Get total instruction count
   */
  public getTotalInstructionCount(): number {
    let total = 0;
    for (const count of this.instructionCounts.values()) {
      total += count;
    }
    return total;
  }

  /**
   * Clear metrics
   */
  public clearMetrics(): void {
    this.metrics.clear();
    this.instructionCounts.clear();
  }
}

export class IRValidator extends BaseIRVisitor {
  private errors: string[] = [];
  private warnings: string[] = [];

  /**
   * Visit a module and validate it
   */
  public visitModule(module: IRModule): void {
    if (!module.metadata.version) {
      this.errors.push('Module missing version');
    }

    if (module.functions.length === 0) {
      this.warnings.push('Module has no functions');
    }

    super.visitModule(module);
  }

  /**
   * Visit a function and validate it
   */
  public visitFunction(irFunction: IRFunction): void {
    if (!irFunction.name) {
      this.errors.push('Function missing name');
    }

    if (irFunction.basicBlocks.length === 0) {
      this.errors.push(`Function ${irFunction.name} has no basic blocks`);
    }

    if (irFunction.parameters.length > 0 && !irFunction.returnType) {
      this.warnings.push(`Function ${irFunction.name} has parameters but no return type`);
    }

    super.visitFunction(irFunction);
  }

  /**
   * Visit a basic block and validate it
   */
  public visitBasicBlock(block: IRBasicBlock): void {
    if (!block.name) {
      this.errors.push('Basic block missing name');
    }

    if (block.instructions.length === 0) {
      this.warnings.push(`Basic block ${block.name} has no instructions`);
    }

    // Check that the last instruction is a terminator
    if (block.instructions.length > 0) {
      const lastInstruction = block.instructions[block.instructions.length - 1];
      const isTerminator = this.isTerminatorInstruction(lastInstruction);
      if (!isTerminator) {
        this.errors.push(`Basic block ${block.name} does not end with a terminator`);
      }
    }

    super.visitBasicBlock(block);
  }

  /**
   * Visit an instruction and validate it
   */
  public visitInstruction(instruction: IRInstruction): void {
    if (!instruction.id) {
      this.errors.push('Instruction missing id');
    }

    if (!instruction.instructionType) {
      this.errors.push('Instruction missing type');
    }

    super.visitInstruction(instruction);
  }

  /**
   * Check if an instruction is a terminator
   */
  private isTerminatorInstruction(instruction: IRInstruction): boolean {
    const terminators = ['BR', 'BR_COND', 'RET'];
    return terminators.includes(instruction.instructionType);
  }

  /**
   * Get errors
   */
  public getErrors(): string[] {
    return [...this.errors];
  }

  /**
   * Get warnings
   */
  public getWarnings(): string[] {
    return [...this.warnings];
  }

  /**
   * Check if validation passed
   */
  public isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * Clear errors and warnings
   */
  public clear(): void {
    this.errors = [];
    this.warnings = [];
  }
}

export class IRPrinter extends BaseIRVisitor {
  private output: string[] = [];
  private indent: number = 0;

  /**
   * Visit a module and print it
   */
  public visitModule(module: IRModule): void {
    this.output.push(`Module (version: ${module.metadata.version})`);
    this.output.push(`Source: ${module.metadata.sourceFile}`);
    this.output.push('');

    super.visitModule(module);
  }

  /**
   * Visit a function and print it
   */
  public visitFunction(irFunction: IRFunction): void {
    this.output.push(`${this.getIndent()}Function: ${irFunction.name}`);
    this.output.push(`${this.getIndent()}  Parameters: ${irFunction.parameters.map(p => p.name).join(', ')}`);
    this.output.push(`${this.getIndent()}  Return Type: ${irFunction.returnType}`);
    this.output.push('');

    this.indent += 2;
    super.visitFunction(irFunction);
    this.indent -= 2;
  }

  /**
   * Visit a basic block and print it
   */
  public visitBasicBlock(block: IRBasicBlock): void {
    this.output.push(`${this.getIndent()}Block: ${block.name}`);
    this.output.push(`${this.getIndent()}  Predecessors: ${Array.from(block.predecessors).join(', ')}`);
    this.output.push(`${this.getIndent()}  Successors: ${Array.from(block.successors).join(', ')}`);
    this.output.push('');

    this.indent += 2;
    super.visitBasicBlock(block);
    this.indent -= 2;
  }

  /**
   * Visit an instruction and print it
   */
  public visitInstruction(instruction: IRInstruction): void {
    const operands = instruction.operands.map(op => String(op)).join(', ');
    const result = instruction.result ? `${instruction.result} = ` : '';
    this.output.push(`${this.getIndent()}${result}${instruction.instructionType} ${operands}`);
  }

  /**
   * Get current indentation
   */
  private getIndent(): string {
    return '  '.repeat(this.indent);
  }

  /**
   * Get output
   */
  public getOutput(): string {
    return this.output.join('\n');
  }

  /**
   * Clear output
   */
  public clear(): void {
    this.output = [];
    this.indent = 0;
  }
}
