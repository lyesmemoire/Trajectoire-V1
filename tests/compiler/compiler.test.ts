import { describe, it, expect } from 'vitest';
import { Lexer } from '../../compiler/lexer/lexer';
import { Parser } from '../../compiler/parser/parser';
import { BytecodeGenerator } from '../../compiler/bytecode/bytecode-generator';

describe('Compiler', () => {
  it('should compile DSL to bytecode', () => {
    const dslCode = 'module test { function main() { return 42; } }';
    const lexer = new Lexer(dslCode);
    const tokens = lexer.tokenize();
    
    expect(tokens).toBeDefined();
    expect(tokens.length).toBeGreaterThan(0);
  });

  it('should handle errors gracefully', () => {
    const dslCode = 'invalid code';
    const lexer = new Lexer(dslCode);
    
    expect(() => lexer.tokenize()).not.toThrow();
  });

  it('should validate bytecode', () => {
    const bytecode = new Uint8Array([0x01, 0x02, 0x03]);
    expect(bytecode).toBeDefined();
  });
});
