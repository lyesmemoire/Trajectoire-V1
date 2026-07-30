import { bench, describe } from 'vitest';
import { Lexer } from '../../compiler/lexer/lexer';
import { Parser } from '../../compiler/parser/parser';
import { BytecodeGenerator } from '../../compiler/bytecode/bytecode-generator';

describe('Compiler Benchmarks', () => {
  const dslCode = 'module test { function main() { return 42; } }';
  
  bench('Lexer - tokenize simple code', () => {
    const lexer = new Lexer();
    lexer.tokenize(dslCode);
  });

  bench('Parser - parse simple code', () => {
    const lexer = new Lexer();
    const tokens = lexer.tokenize(dslCode);
    const parser = new Parser();
    parser.parse(tokens);
  });

  bench('Bytecode Generator - generate bytecode', () => {
    const lexer = new Lexer();
    const tokens = lexer.tokenize(dslCode);
    const parser = new Parser();
    const ast = parser.parse(tokens);
    const generator = new BytecodeGenerator();
    generator.generate(ast);
  });

  bench('Full compilation pipeline', () => {
    const lexer = new Lexer();
    const tokens = lexer.tokenize(dslCode);
    const parser = new Parser();
    const ast = parser.parse(tokens);
    const generator = new BytecodeGenerator();
    generator.generate(ast);
  });
});
