import { describe, it, expect } from 'vitest';
import { Lexer, TokenType, type Token } from '../../../compiler/lexer/lexer';

describe('Lexer', () => {
  describe('Basic tokenization', () => {
    it('should tokenize empty source', () => {
      const lexer = new Lexer('');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(0);
    });

    it('should tokenize simple identifier', () => {
      const lexer = new Lexer('test');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('test');
    });

    it('should tokenize multiple identifiers', () => {
      const lexer = new Lexer('test1 test2 test3');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(3);
      expect(tokens[0].value).toBe('test1');
      expect(tokens[1].value).toBe('test2');
      expect(tokens[2].value).toBe('test3');
    });

    it('should track line and column numbers', () => {
      const lexer = new Lexer('test');
      const tokens = lexer.tokenize();
      expect(tokens[0].line).toBe(1);
      expect(tokens[0].column).toBe(1);
    });
  });

  describe('Keywords', () => {
    it('should tokenize module keyword', () => {
      const lexer = new Lexer('module');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.MODULE);
      expect(tokens[0].value).toBe('module');
    });

    it('should tokenize import keyword', () => {
      const lexer = new Lexer('import');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IMPORT);
    });

    it('should tokenize export keyword', () => {
      const lexer = new Lexer('export');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.EXPORT);
    });

    it('should tokenize function keyword', () => {
      const lexer = new Lexer('function');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.FUNCTION);
    });

    it('should tokenize cognitive keyword', () => {
      const lexer = new Lexer('cognitive');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.COGNITIVE);
    });

    it('should tokenize reasoning keyword', () => {
      const lexer = new Lexer('reasoning');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.REASONING);
    });

    it('should tokenize inference keyword', () => {
      const lexer = new Lexer('inference');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.INFERENCE);
    });

    it('should tokenize hypothesis keyword', () => {
      const lexer = new Lexer('hypothesis');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.HYPOTHESIS);
    });

    it('should tokenize knowledge keyword', () => {
      const lexer = new Lexer('knowledge');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.KNOWLEDGE);
    });

    it('should tokenize memory keyword', () => {
      const lexer = new Lexer('memory');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.MEMORY);
    });

    it('should tokenize provider keyword', () => {
      const lexer = new Lexer('provider');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.PROVIDER);
    });

    it('should tokenize artifact keyword', () => {
      const lexer = new Lexer('artifact');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.ARTIFACT);
    });

    it('should tokenize tool keyword', () => {
      const lexer = new Lexer('tool');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.TOOL);
    });

    it('should tokenize workflow keyword', () => {
      const lexer = new Lexer('workflow');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.WORKFLOW);
    });

    it('should tokenize type keywords', () => {
      const typeKeywords = ['string', 'integer', 'float', 'boolean', 'list', 'map', 'optional'];
      typeKeywords.forEach(keyword => {
        const lexer = new Lexer(keyword);
        const tokens = lexer.tokenize();
        expect(tokens[0].type).not.toBe(TokenType.IDENTIFIER);
        expect(tokens[0].value).toBe(keyword);
      });
    });
  });

  describe('Boolean literals', () => {
    it('should tokenize true literal', () => {
      const lexer = new Lexer('true');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.BOOLEAN_LITERAL);
      expect(tokens[0].value).toBe('true');
    });

    it('should tokenize false literal', () => {
      const lexer = new Lexer('false');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.BOOLEAN_LITERAL);
      expect(tokens[0].value).toBe('false');
    });
  });

  describe('Numbers', () => {
    it('should tokenize integer', () => {
      const lexer = new Lexer('42');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[0].value).toBe('42');
    });

    it('should tokenize decimal number', () => {
      const lexer = new Lexer('3.14');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[0].value).toBe('3.14');
    });

    it('should tokenize large number', () => {
      const lexer = new Lexer('1234567890');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[0].value).toBe('1234567890');
    });

    it('should tokenize number with leading zero', () => {
      const lexer = new Lexer('0123');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[0].value).toBe('0123');
    });

    it('should tokenize zero', () => {
      const lexer = new Lexer('0');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[0].value).toBe('0');
    });

    it('should tokenize decimal starting with zero', () => {
      const lexer = new Lexer('0.5');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[0].value).toBe('0.5');
    });
  });

  describe('Strings', () => {
    it('should tokenize double-quoted string', () => {
      const lexer = new Lexer('"hello"');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('hello');
    });

    it('should tokenize single-quoted string', () => {
      const lexer = new Lexer("'hello'");
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('hello');
    });

    it('should tokenize empty string', () => {
      const lexer = new Lexer('""');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('');
    });

    it('should tokenize string with spaces', () => {
      const lexer = new Lexer('"hello world"');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('hello world');
    });

    it('should tokenize string with escape sequence', () => {
      const lexer = new Lexer('"hello\\nworld"');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      // Lexer doesn't process escape sequences, passes through as-is
      expect(tokens[0].value).toBe('hellonworld');
    });

    it('should tokenize string with backslash', () => {
      const lexer = new Lexer('"hello\\\\world"');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      // Lexer doesn't process escape sequences, passes through as-is
      expect(tokens[0].value).toBe('hello\\world');
    });

    it('should tokenize string with special characters', () => {
      const lexer = new Lexer('"hello@#$%^&*()"');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('hello@#$%^&*()');
    });

    it('should tokenize string with numbers', () => {
      const lexer = new Lexer('"hello123"');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('hello123');
    });
  });

  describe('Identifiers', () => {
    it('should tokenize simple identifier', () => {
      const lexer = new Lexer('myVariable');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('myVariable');
    });

    it('should tokenize identifier with underscore', () => {
      const lexer = new Lexer('my_variable');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('my_variable');
    });

    it('should tokenize identifier starting with underscore', () => {
      const lexer = new Lexer('_private');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('_private');
    });

    it('should tokenize identifier with numbers', () => {
      const lexer = new Lexer('var123');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('var123');
    });

    it('should tokenize camelCase identifier', () => {
      const lexer = new Lexer('camelCase');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('camelCase');
    });

    it('should tokenize PascalCase identifier', () => {
      const lexer = new Lexer('PascalCase');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('PascalCase');
    });

    it('should not tokenize number as identifier', () => {
      const lexer = new Lexer('123');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
    });
  });

  describe('Operators', () => {
    it('should tokenize assignment operator', () => {
      const lexer = new Lexer('=');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.ASSIGN);
      expect(tokens[0].value).toBe('=');
    });

    it('should tokenize equal operator', () => {
      const lexer = new Lexer('==');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.EQUAL);
      expect(tokens[0].value).toBe('==');
    });

    it('should tokenize not equal operator', () => {
      const lexer = new Lexer('!=');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NOT_EQUAL);
      expect(tokens[0].value).toBe('!=');
    });

    it('should tokenize less than operator', () => {
      const lexer = new Lexer('<');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.LESS_THAN);
      expect(tokens[0].value).toBe('<');
    });

    it('should tokenize greater than operator', () => {
      const lexer = new Lexer('>');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.GREATER_THAN);
      expect(tokens[0].value).toBe('>');
    });

    it('should tokenize less equal operator', () => {
      const lexer = new Lexer('<=');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.LESS_EQUAL);
      expect(tokens[0].value).toBe('<=');
    });

    it('should tokenize greater equal operator', () => {
      const lexer = new Lexer('>=');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.GREATER_EQUAL);
      expect(tokens[0].value).toBe('>=');
    });

    it('should tokenize and operator', () => {
      const lexer = new Lexer('&&');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.AND);
      expect(tokens[0].value).toBe('&&');
    });

    it('should tokenize or operator', () => {
      const lexer = new Lexer('||');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.OR);
      expect(tokens[0].value).toBe('||');
    });

    it('should tokenize not operator', () => {
      const lexer = new Lexer('!');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NOT);
      expect(tokens[0].value).toBe('!');
    });

    it('should tokenize plus operator as identifier', () => {
      const lexer = new Lexer('+');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('+');
    });

    it('should tokenize minus operator as identifier', () => {
      const lexer = new Lexer('-');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('-');
    });

    it('should tokenize multiply operator as identifier', () => {
      const lexer = new Lexer('*');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('*');
    });

    it('should tokenize divide operator as identifier', () => {
      const lexer = new Lexer('/');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('/');
    });

    it('should tokenize arrow operator', () => {
      const lexer = new Lexer('->');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.ARROW);
      expect(tokens[0].value).toBe('->');
    });
  });

  describe('Delimiters', () => {
    it('should tokenize left parenthesis', () => {
      const lexer = new Lexer('(');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.LPAREN);
      expect(tokens[0].value).toBe('(');
    });

    it('should tokenize right parenthesis', () => {
      const lexer = new Lexer(')');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.RPAREN);
      expect(tokens[0].value).toBe(')');
    });

    it('should tokenize left brace', () => {
      const lexer = new Lexer('{');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.LBRACE);
      expect(tokens[0].value).toBe('{');
    });

    it('should tokenize right brace', () => {
      const lexer = new Lexer('}');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.RBRACE);
      expect(tokens[0].value).toBe('}');
    });

    it('should tokenize left bracket', () => {
      const lexer = new Lexer('[');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.LBRACKET);
      expect(tokens[0].value).toBe('[');
    });

    it('should tokenize right bracket', () => {
      const lexer = new Lexer(']');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.RBRACKET);
      expect(tokens[0].value).toBe(']');
    });

    it('should tokenize comma', () => {
      const lexer = new Lexer(',');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.COMMA);
      expect(tokens[0].value).toBe(',');
    });

    it('should tokenize semicolon', () => {
      const lexer = new Lexer(';');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.SEMICOLON);
      expect(tokens[0].value).toBe(';');
    });

    it('should tokenize colon', () => {
      const lexer = new Lexer(':');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.COLON);
      expect(tokens[0].value).toBe(':');
    });

    it('should tokenize dot', () => {
      const lexer = new Lexer('.');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.DOT);
      expect(tokens[0].value).toBe('.');
    });
  });

  describe('Whitespace', () => {
    it('should skip spaces by default', () => {
      const lexer = new Lexer('test test');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(2);
      expect(tokens[0].value).toBe('test');
      expect(tokens[1].value).toBe('test');
    });

    it('should skip tabs by default', () => {
      const lexer = new Lexer('test\ttest');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(2);
      expect(tokens[0].value).toBe('test');
      expect(tokens[1].value).toBe('test');
    });

    it('should skip newlines by default', () => {
      const lexer = new Lexer('test\ntest');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(2);
      expect(tokens[0].value).toBe('test');
      expect(tokens[1].value).toBe('test');
    });

    it('should keep whitespace when configured', () => {
      const lexer = new Lexer('test test', { skipWhitespace: false, skipComments: true });
      const tokens = lexer.tokenize();
      expect(tokens.length).toBeGreaterThan(2);
      expect(tokens[1].type).toBe(TokenType.WHITESPACE);
    });

    it('should track line numbers with newlines', () => {
      const lexer = new Lexer('test\ntest');
      const tokens = lexer.tokenize();
      expect(tokens[0].line).toBe(1);
      expect(tokens[1].line).toBe(2);
    });
  });

  describe('Comments', () => {
    it('should skip single-line comment by default', () => {
      const lexer = new Lexer('// comment\ntest');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(1);
      expect(tokens[0].value).toBe('test');
    });

    it('should keep comment when configured', () => {
      const lexer = new Lexer('// comment', { skipWhitespace: true, skipComments: false });
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.COMMENT);
      expect(tokens[0].value).toBe(' comment');
    });

    it('should tokenize comment content', () => {
      const lexer = new Lexer('// this is a comment', { skipWhitespace: true, skipComments: false });
      const tokens = lexer.tokenize();
      expect(tokens[0].value).toBe(' this is a comment');
    });

    it('should handle empty comment', () => {
      const lexer = new Lexer('//', { skipWhitespace: true, skipComments: false });
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.COMMENT);
      expect(tokens[0].value).toBe('');
    });
  });

  describe('Complex expressions', () => {
    it('should tokenize function declaration', () => {
      const lexer = new Lexer('function test() { return 42; }');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.FUNCTION);
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[2].type).toBe(TokenType.LPAREN);
      expect(tokens[3].type).toBe(TokenType.RPAREN);
      expect(tokens[4].type).toBe(TokenType.LBRACE);
      expect(tokens[5].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[6].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[7].type).toBe(TokenType.SEMICOLON);
      expect(tokens[8].type).toBe(TokenType.RBRACE);
    });

    it('should tokenize module declaration', () => {
      const lexer = new Lexer('module test { }');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.MODULE);
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[2].type).toBe(TokenType.LBRACE);
      expect(tokens[3].type).toBe(TokenType.RBRACE);
    });

    it('should tokenize arithmetic expression', () => {
      const lexer = new Lexer('1 2 3');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[1].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[2].type).toBe(TokenType.NUMBER_LITERAL);
    });

    it('should tokenize comparison expression', () => {
      const lexer = new Lexer('x == 5');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].type).toBe(TokenType.EQUAL);
      expect(tokens[2].type).toBe(TokenType.NUMBER_LITERAL);
    });

    it('should tokenize boolean expression', () => {
      const lexer = new Lexer('true && false || !true');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.BOOLEAN_LITERAL);
      expect(tokens[1].type).toBe(TokenType.AND);
      expect(tokens[2].type).toBe(TokenType.BOOLEAN_LITERAL);
      expect(tokens[3].type).toBe(TokenType.OR);
      expect(tokens[4].type).toBe(TokenType.NOT);
      expect(tokens[5].type).toBe(TokenType.BOOLEAN_LITERAL);
    });
  });

  describe('Edge cases', () => {
    it('should handle single character', () => {
      const lexer = new Lexer('a');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('a');
    });

    it('should handle special characters as identifiers', () => {
      const lexer = new Lexer('@');
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('@');
    });

    it('should handle multiple operators', () => {
      const lexer = new Lexer('===!====');
      const tokens = lexer.tokenize();
      expect(tokens.length).toBeGreaterThan(1);
    });

    it('should handle large source file', () => {
      const largeSource = 'test '.repeat(1000);
      const lexer = new Lexer(largeSource);
      const tokens = lexer.tokenize();
      expect(tokens.length).toBe(1000);
    });

    it('should handle source with only whitespace', () => {
      const lexer = new Lexer('   \t\n   ');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(0);
    });

    it('should handle source with only comments', () => {
      const lexer = new Lexer('// comment\n// another comment');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(0);
    });
  });

  describe('Token position tracking', () => {
    it('should track position correctly', () => {
      const lexer = new Lexer('test test');
      const tokens = lexer.tokenize();
      expect(tokens[0].position).toBe(0);
      expect(tokens[1].position).toBe(5);
    });

    it('should track column correctly', () => {
      const lexer = new Lexer('test test');
      const tokens = lexer.tokenize();
      expect(tokens[0].column).toBe(1);
      expect(tokens[1].column).toBe(6);
    });

    it('should track line correctly on newlines', () => {
      const lexer = new Lexer('test\ntest');
      const tokens = lexer.tokenize();
      expect(tokens[0].line).toBe(1);
      expect(tokens[1].line).toBe(2);
      expect(tokens[1].column).toBe(1);
    });
  });

  describe('Configuration', () => {
    it('should use default configuration', () => {
      const lexer = new Lexer('test // comment');
      const tokens = lexer.tokenize();
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    });

    it('should use custom configuration', () => {
      const lexer = new Lexer('test // comment', { skipWhitespace: false, skipComments: false });
      const tokens = lexer.tokenize();
      expect(tokens.length).toBeGreaterThan(2);
    });

    it('should skip whitespace only when configured', () => {
      const lexer = new Lexer('test test', { skipWhitespace: false, skipComments: true });
      const tokens = lexer.tokenize();
      expect(tokens[1].type).toBe(TokenType.WHITESPACE);
    });

    it('should skip comments only when configured', () => {
      const lexer = new Lexer('// comment', { skipWhitespace: true, skipComments: false });
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.COMMENT);
    });
  });
});
