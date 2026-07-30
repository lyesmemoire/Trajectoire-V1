/**
 * Blueprint DSL IR Serializer
 * 
 * Serializes IR to JSON format.
 */

import { IRModule, IRFunction, IRBasicBlock, IRInstruction, IRNodeType, IRInstructionType } from './ir-generator';

export interface SerializedIR {
  version: string;
  module: SerializedModule;
}

export interface SerializedModule {
  functions: SerializedFunction[];
  globals: SerializedGlobal[];
  metadata: SerializedMetadata;
}

export interface SerializedFunction {
  id: string;
  name: string;
  parameters: SerializedParameter[];
  basicBlocks: SerializedBasicBlock[];
  returnType: string;
}

export interface SerializedBasicBlock {
  id: string;
  name: string;
  instructions: SerializedInstruction[];
  predecessors: string[];
  successors: string[];
}

export interface SerializedInstruction {
  id: string;
  instructionType: string;
  operands: (string | SerializedConstant)[];
  result?: string;
}

export interface SerializedParameter {
  id: string;
  name: string;
  paramType: string;
}

export interface SerializedGlobal {
  id: string;
  name: string;
  valueType: string;
  initialValue?: unknown;
}

export interface SerializedMetadata {
  version: string;
  sourceFile: string;
  compilationTime: number;
  optimizations: string[];
}

export interface SerializedConstant {
  value: unknown;
  valueType: string;
}

export class IRSerializer {
  /**
   * Serialize IR module to JSON
   */
  public serialize(module: IRModule): string {
    const serialized = this.serializeModule(module);
    return JSON.stringify(serialized, null, 2);
  }

  /**
   * Serialize IR module
   */
  private serializeModule(module: IRModule): SerializedModule {
    return {
      functions: module.functions.map(func => this.serializeFunction(func)),
      globals: module.globals.map(global => this.serializeGlobal(global)),
      metadata: this.serializeMetadata(module.metadata),
    };
  }

  /**
   * Serialize IR function
   */
  private serializeFunction(irFunction: IRFunction): SerializedFunction {
    return {
      id: irFunction.id,
      name: irFunction.name,
      parameters: irFunction.parameters.map(param => this.serializeParameter(param)),
      basicBlocks: irFunction.basicBlocks.map(block => this.serializeBasicBlock(block)),
      returnType: irFunction.returnType,
    };
  }

  /**
   * Serialize IR basic block
   */
  private serializeBasicBlock(block: IRBasicBlock): SerializedBasicBlock {
    return {
      id: block.id,
      name: block.name,
      instructions: block.instructions.map(inst => this.serializeInstruction(inst)),
      predecessors: block.predecessors,
      successors: block.successors,
    };
  }

  /**
   * Serialize IR instruction
   */
  private serializeInstruction(instruction: IRInstruction): SerializedInstruction {
    return {
      id: instruction.id,
      instructionType: instruction.instructionType,
      operands: instruction.operands.map(op => this.serializeOperand(op)),
      result: instruction.result,
    };
  }

  /**
   * Serialize IR operand
   */
  private serializeOperand(operand: unknown): string | SerializedConstant {
    if (typeof operand === 'string') {
      return operand;
    } else if (typeof operand === 'object' && operand !== null) {
      return {
        value: operand.value,
        valueType: operand.valueType,
      };
    }
    return String(operand);
  }

  /**
   * Serialize IR parameter
   */
  private serializeParameter(parameter: unknown): SerializedParameter {
    return {
      id: parameter.id,
      name: parameter.name,
      paramType: parameter.paramType,
    };
  }

  /**
   * Serialize IR global
   */
  private serializeGlobal(global: unknown): SerializedGlobal {
    return {
      id: global.id,
      name: global.name,
      valueType: global.valueType,
      initialValue: global.initialValue,
    };
  }

  /**
   * Serialize IR metadata
   */
  private serializeMetadata(metadata: unknown): SerializedMetadata {
    return {
      version: metadata.version,
      sourceFile: metadata.sourceFile,
      compilationTime: metadata.compilationTime,
      optimizations: metadata.optimizations,
    };
  }

  /**
   * Deserialize JSON to IR module
   */
  public deserialize(json: string): IRModule {
    const serialized: SerializedIR = JSON.parse(json);
    return this.deserializeModule(serialized.module);
  }

  /**
   * Deserialize IR module
   */
  private deserializeModule(serialized: SerializedModule): IRModule {
    return {
      functions: serialized.functions.map(func => this.deserializeFunction(func)),
      globals: serialized.globals.map(global => this.deserializeGlobal(global)),
      metadata: this.deserializeMetadata(serialized.metadata),
    };
  }

  /**
   * Deserialize IR function
   */
  private deserializeFunction(serialized: SerializedFunction): IRFunction {
    return {
      id: serialized.id,
      type: IRNodeType.FUNCTION,
      name: serialized.name,
      parameters: serialized.parameters.map(param => this.deserializeParameter(param)),
      basicBlocks: serialized.basicBlocks.map(block => this.deserializeBasicBlock(block)),
      returnType: serialized.returnType,
      line: 0,
      column: 0,
    };
  }

  /**
   * Deserialize IR basic block
   */
  private deserializeBasicBlock(serialized: SerializedBasicBlock): IRBasicBlock {
    return {
      id: serialized.id,
      type: IRNodeType.BASIC_BLOCK,
      name: serialized.name,
      instructions: serialized.instructions.map(inst => this.deserializeInstruction(inst)),
      predecessors: serialized.predecessors,
      successors: serialized.successors,
      line: 0,
      column: 0,
    };
  }

  /**
   * Deserialize IR instruction
   */
  private deserializeInstruction(serialized: SerializedInstruction): IRInstruction {
    return {
      id: serialized.id,
      type: IRNodeType.INSTRUCTION,
      instructionType: serialized.instructionType as IRInstructionType,
      operands: serialized.operands.map(op => this.deserializeOperand(op)),
      result: serialized.result,
      line: 0,
      column: 0,
    };
  }

  /**
   * Deserialize IR operand
   */
  private deserializeOperand(operand: unknown): unknown {
    if (typeof operand === 'string') {
      return operand;
    } else if (typeof operand === 'object' && operand !== null) {
      return {
        value: operand.value,
        valueType: operand.valueType,
      };
    }
    return operand;
  }

  /**
   * Deserialize IR parameter
   */
  private deserializeParameter(serialized: SerializedParameter): unknown {
    return {
      id: serialized.id,
      type: IRNodeType.PARAMETER,
      name: serialized.name,
      paramType: serialized.paramType,
      line: 0,
      column: 0,
    };
  }

  /**
   * Deserialize IR global
   */
  private deserializeGlobal(serialized: SerializedGlobal): unknown {
    return {
      id: serialized.id,
      type: IRNodeType.GLOBAL,
      name: serialized.name,
      valueType: serialized.valueType,
      initialValue: serialized.initialValue,
      line: 0,
      column: 0,
    };
  }

  /**
   * Deserialize IR metadata
   */
  private deserializeMetadata(serialized: SerializedMetadata): unknown {
    return {
      version: serialized.version,
      sourceFile: serialized.sourceFile,
      compilationTime: serialized.compilationTime,
      optimizations: serialized.optimizations,
    };
  }
}
