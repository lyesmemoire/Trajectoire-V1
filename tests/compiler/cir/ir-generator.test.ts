import { describe, it, expect, beforeEach } from 'vitest';
import { IRGenerator } from '../../../compiler/cir/ir-generator';
import { NodeType } from '../../../compiler/parser/parser';

describe('IRGenerator', () => {
  let irGenerator: IRGenerator;

  beforeEach(() => {
    irGenerator = new IRGenerator();
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [],
      } as any);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.ir).toBeDefined();
    });

    it('should create empty IR module', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [],
      } as any);

      expect(result.ir.functions).toHaveLength(0);
      expect(result.ir.globals).toHaveLength(0);
      expect(result.ir.metadata).toBeDefined();
    });

    it('should set metadata', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [],
      } as any);

      expect(result.ir.metadata.version).toBe('1.0.0');
      expect(result.ir.metadata.compilationTime).toBeGreaterThan(0);
      expect(result.ir.metadata.optimizations).toEqual([]);
    });
  });

  describe('Function generation', () => {
    it('should generate function IR', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      expect(result.ir.functions).toHaveLength(1);
      expect(result.ir.functions[0].name).toBe('testFunc');
    });

    it('should generate function with parameters', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [
              {
                type: NodeType.PARAMETER,
                name: 'param1',
                line: 1,
                column: 1,
                paramType: { type: NodeType.TYPE, name: 'int', line: 1, column: 1 },
              },
            ],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      expect(result.ir.functions[0].parameters).toHaveLength(1);
      expect(result.ir.functions[0].parameters[0].name).toBe('param1');
    });

    it('should generate function with return type', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'string', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      expect(result.ir.functions[0].returnType).toBe('string');
    });

    it('should generate entry block for function', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      expect(result.ir.functions[0].basicBlocks.length).toBeGreaterThan(0);
      expect(result.ir.functions[0].basicBlocks[0].name).toBe('entry');
    });
  });

  describe('Basic block generation', () => {
    it('should create basic block with unique ID', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      const block = result.ir.functions[0].basicBlocks[0];
      expect(block.id).toMatch(/^ir_\d+$/);
    });

    it('should initialize block with empty instructions', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      const block = result.ir.functions[0].basicBlocks[0];
      expect(block.instructions).toHaveLength(0);
    });

    it('should initialize block with empty predecessors and successors', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      const block = result.ir.functions[0].basicBlocks[0];
      expect(block.predecessors).toHaveLength(0);
      expect(block.successors).toHaveLength(0);
    });
  });

  describe('Multiple functions', () => {
    it('should generate IR for multiple functions', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'func1',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
          {
            type: NodeType.FUNCTION,
            name: 'func2',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      expect(result.ir.functions).toHaveLength(2);
      expect(result.ir.functions[0].name).toBe('func1');
      expect(result.ir.functions[1].name).toBe('func2');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty module', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [],
      } as any);

      expect(result.success).toBe(true);
      expect(result.ir.functions).toHaveLength(0);
    });

    it('should handle function with no body', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      expect(result.success).toBe(true);
    });

    it('should handle function with multiple parameters', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'testFunc',
            line: 1,
            column: 1,
            parameters: [
              {
                type: NodeType.PARAMETER,
                name: 'param1',
                line: 1,
                column: 1,
                paramType: { type: NodeType.TYPE, name: 'int', line: 1, column: 1 },
              },
              {
                type: NodeType.PARAMETER,
                name: 'param2',
                line: 1,
                column: 1,
                paramType: { type: NodeType.TYPE, name: 'string', line: 1, column: 1 },
              },
            ],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      expect(result.ir.functions[0].parameters).toHaveLength(2);
    });

    it('should generate unique IDs for each node', () => {
      const result = irGenerator.generate({
        type: NodeType.MODULE,
        line: 1,
        column: 1,
        functions: [
          {
            type: NodeType.FUNCTION,
            name: 'func1',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
          {
            type: NodeType.FUNCTION,
            name: 'func2',
            line: 1,
            column: 1,
            parameters: [],
            returnType: { type: NodeType.TYPE, name: 'void', line: 1, column: 1 },
            body: { type: NodeType.BLOCK, statements: [], line: 1, column: 1 },
          },
        ],
      } as any);

      const id1 = result.ir.functions[0].id;
      const id2 = result.ir.functions[1].id;
      expect(id1).not.toBe(id2);
    });
  });
});
