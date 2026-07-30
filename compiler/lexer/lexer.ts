/**
 * Blueprint DSL Lexer
 * 
 * Tokenizes the Blueprint DSL source code into tokens for parsing.
 */

export enum TokenType {
  // Keywords
  MODULE = "MODULE",
  IMPORT = "IMPORT",
  EXPORT = "EXPORT",
  FUNCTION = "FUNCTION",
  COGNITIVE = "COGNITIVE",
  REASONING = "REASONING",
  INFERENCE = "INFERENCE",
  HYPOTHESIS = "HYPOTHESIS",
  KNOWLEDGE = "KNOWLEDGE",
  MEMORY = "MEMORY",
  PROVIDER = "PROVIDER",
  ARTIFACT = "ARTIFACT",
  TOOL = "TOOL",
  WORKFLOW = "WORKFLOW",
  
  // Types
  STRING = "STRING",
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  BOOLEAN = "BOOLEAN",
  LIST = "LIST",
  MAP = "MAP",
  OPTIONAL = "OPTIONAL",
  
  // Literals
  IDENTIFIER = "IDENTIFIER",
  STRING_LITERAL = "STRING_LITERAL",
  NUMBER_LITERAL = "NUMBER_LITERAL",
  BOOLEAN_LITERAL = "BOOLEAN_LITERAL",
  
  // Operators
  ASSIGN = "ASSIGN",
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN = "GREATER_THAN",
  LESS_EQUAL = "LESS_EQUAL",
  GREATER_EQUAL = "GREATER_EQUAL",
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
  PLUS = "PLUS",
  MINUS = "MINUS",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
  AS = "AS",
  QUESTION = "QUESTION",
  LT = "LT",
  GT = "GT",
  RETURN = "RETURN",
  IF = "IF",
  ELSE = "ELSE",
  FOR = "FOR",
  WHILE = "WHILE",
  
  // Delimiters
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  LBRACE = "LBRACE",
  RBRACE = "RBRACE",
  LBRACKET = "LBRACKET",
  RBRACKET = "RBRACKET",
  COMMA = "COMMA",
  SEMICOLON = "SEMICOLON",
  COLON = "COLON",
  DOT = "DOT",
  ARROW = "ARROW",
  
  // Special
  EOF = "EOF",
  WHITESPACE = "WHITESPACE",
  COMMENT = "COMMENT",
  NEWLINE = "NEWLINE",
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  position: number;
}

export interface LexerConfig {
  skipWhitespace: boolean;
  skipComments: boolean;
}

export class Lexer {
  private source: string;
  private position: number;
  private line: number;
  private column: number;
  private config: LexerConfig;

  constructor(source: string, config: LexerConfig = { skipWhitespace: true, skipComments: true }) {
    this.source = source;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.config = config;
  }

  /**
   * Tokenize the entire source code
   */
  public tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.position < this.source.length) {
      const token = this.nextToken();
      
      if (this.config.skipWhitespace && token.type === TokenType.WHITESPACE) {
        continue;
      }
      
      if (this.config.skipComments && token.type === TokenType.COMMENT) {
        continue;
      }
      
      tokens.push(token);
      
      if (token.type === TokenType.EOF) {
        break;
      }
    }
    
    return tokens;
  }

  /**
   * Get the next token
   */
  private nextToken(): Token {
    if (this.position >= this.source.length) {
      return this.createToken(TokenType.EOF, "");
    }

    const char = this.source[this.position];

    // Skip whitespace
    if (this.isWhitespace(char)) {
      return this.tokenizeWhitespace();
    }

    // Skip comments
    if (char === '/' && this.peek() === '/') {
      return this.tokenizeComment();
    }

    // Tokenize identifiers and keywords
    if (this.isLetter(char) || char === '_') {
      return this.tokenizeIdentifier();
    }

    // Tokenize numbers
    if (this.isDigit(char)) {
      return this.tokenizeNumber();
    }

    // Tokenize strings
    if (char === '"' || char === "'") {
      return this.tokenizeString();
    }

    // Tokenize operators and delimiters
    return this.tokenizeOperator();
  }

  /**
   * Tokenize whitespace
   */
  private tokenizeWhitespace(): Token {
    const start = this.position;
    let value = "";
    
    while (this.position < this.source.length && this.isWhitespace(this.source[this.position])) {
      if (this.source[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
      value += this.source[this.position - 1];
    }
    
    return this.createToken(TokenType.WHITESPACE, value, start);
  }

  /**
   * Tokenize comment
   */
  private tokenizeComment(): Token {
    const start = this.position;
    let value = "";
    
    // Skip // for single-line comment
    this.position += 2;
    this.column += 2;
    
    while (this.position < this.source.length && this.source[this.position] !== '\n') {
      value += this.source[this.position];
      this.position++;
      this.column++;
    }
    
    return this.createToken(TokenType.COMMENT, value, start);
  }

  /**
   * Tokenize identifier or keyword
   */
  private tokenizeIdentifier(): Token {
    const start = this.position;
    let value = "";
    
    while (this.position < this.source.length && (this.isLetterOrDigit(this.source[this.position]) || this.source[this.position] === '_')) {
      value += this.source[this.position];
      this.position++;
      this.column++;
    }
    
    // Check if it's a keyword
    const keyword = this.getKeyword(value);
    if (keyword) {
      return this.createToken(keyword, value, start);
    }
    
    return this.createToken(TokenType.IDENTIFIER, value, start);
  }

  /**
   * Tokenize number
   */
  private tokenizeNumber(): Token {
    const start = this.position;
    let value = "";
    
    while (this.position < this.source.length && this.isDigit(this.source[this.position])) {
      value += this.source[this.position];
      this.position++;
      this.column++;
    }
    
    // Check for decimal point
    if (this.position < this.source.length && this.source[this.position] === '.') {
      value += this.source[this.position];
      this.position++;
      this.column++;
      
      while (this.position < this.source.length && this.isDigit(this.source[this.position])) {
        value += this.source[this.position];
        this.position++;
        this.column++;
      }
    }
    
    return this.createToken(TokenType.NUMBER_LITERAL, value, start);
  }

  /**
   * Tokenize string
   */
  private tokenizeString(): Token {
    const start = this.position;
    const quote = this.source[this.position];
    let value = "";
    
    this.position++;
    this.column++;
    
    while (this.position < this.source.length && this.source[this.position] !== quote) {
      if (this.source[this.position] === '\\') {
        this.position++;
        this.column++;
        
        if (this.position < this.source.length) {
          value += this.source[this.position];
          this.position++;
          this.column++;
        }
      } else {
        value += this.source[this.position];
        this.position++;
        this.column++;
      }
    }
    
    if (this.position < this.source.length) {
      this.position++;
      this.column++;
    }
    
    return this.createToken(TokenType.STRING_LITERAL, value, start);
  }

  /**
   * Tokenize operator or delimiter
   */
  private tokenizeOperator(): Token {
    const start = this.position;
    const char = this.source[this.position];
    
    // Two-character operators
    if (this.position + 1 < this.source.length) {
      const twoChar = char + this.source[this.position + 1];
      
      if (twoChar === '==') {
        this.position += 2;
        this.column += 2;
        return this.createToken(TokenType.EQUAL, twoChar, start);
      }
      
      if (twoChar === '!=') {
        this.position += 2;
        this.column += 2;
        return this.createToken(TokenType.NOT_EQUAL, twoChar, start);
      }
      
      if (twoChar === '<=') {
        this.position += 2;
        this.column += 2;
        return this.createToken(TokenType.LESS_EQUAL, twoChar, start);
      }
      
      if (twoChar === '>=') {
        this.position += 2;
        this.column += 2;
        return this.createToken(TokenType.GREATER_EQUAL, twoChar, start);
      }
      
      if (twoChar === '&&') {
        this.position += 2;
        this.column += 2;
        return this.createToken(TokenType.AND, twoChar, start);
      }
      
      if (twoChar === '||') {
        this.position += 2;
        this.column += 2;
        return this.createToken(TokenType.OR, twoChar, start);
      }
      
      if (twoChar === '->') {
        this.position += 2;
        this.column += 2;
        return this.createToken(TokenType.ARROW, twoChar, start);
      }
    }
    
    // Single-character operators and delimiters
    this.position++;
    this.column++;
    
    switch (char) {
      case '=':
        return this.createToken(TokenType.ASSIGN, char, start);
      case '<':
        return this.createToken(TokenType.LESS_THAN, char, start);
      case '>':
        return this.createToken(TokenType.GREATER_THAN, char, start);
      case '!':
        return this.createToken(TokenType.NOT, char, start);
      case '(':
        return this.createToken(TokenType.LPAREN, char, start);
      case ')':
        return this.createToken(TokenType.RPAREN, char, start);
      case '{':
        return this.createToken(TokenType.LBRACE, char, start);
      case '}':
        return this.createToken(TokenType.RBRACE, char, start);
      case '[':
        return this.createToken(TokenType.LBRACKET, char, start);
      case ']':
        return this.createToken(TokenType.RBRACKET, char, start);
      case ',':
        return this.createToken(TokenType.COMMA, char, start);
      case ';':
        return this.createToken(TokenType.SEMICOLON, char, start);
      case ':':
        return this.createToken(TokenType.COLON, char, start);
      case '.':
        return this.createToken(TokenType.DOT, char, start);
      default:
        return this.createToken(TokenType.IDENTIFIER, char, start);
    }
  }

  /**
   * Check if character is a letter
   */
  private isLetter(char: string): boolean {
    return /[a-zA-Z]/.test(char);
  }

  /**
   * Check if character is a digit
   */
  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  /**
   * Check if character is a letter or digit
   */
  private isLetterOrDigit(char: string): boolean {
    return this.isLetter(char) || this.isDigit(char);
  }

  /**
   * Check if character is whitespace
   */
  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  /**
   * Peek at the next character
   */
  private peek(): string {
    if (this.position + 1 < this.source.length) {
      return this.source[this.position + 1];
    }
    return "";
  }

  /**
   * Get keyword from identifier
   */
  private getKeyword(value: string): TokenType | null {
    const keywords: { [key: string]: TokenType } = {
      "module": TokenType.MODULE,
      "import": TokenType.IMPORT,
      "export": TokenType.EXPORT,
      "function": TokenType.FUNCTION,
      "cognitive": TokenType.COGNITIVE,
      "reasoning": TokenType.REASONING,
      "inference": TokenType.INFERENCE,
      "hypothesis": TokenType.HYPOTHESIS,
      "knowledge": TokenType.KNOWLEDGE,
      "memory": TokenType.MEMORY,
      "provider": TokenType.PROVIDER,
      "artifact": TokenType.ARTIFACT,
      "tool": TokenType.TOOL,
      "workflow": TokenType.WORKFLOW,
      "string": TokenType.STRING,
      "integer": TokenType.INTEGER,
      "float": TokenType.FLOAT,
      "boolean": TokenType.BOOLEAN,
      "list": TokenType.LIST,
      "map": TokenType.MAP,
      "optional": TokenType.OPTIONAL,
      "true": TokenType.BOOLEAN_LITERAL,
      "false": TokenType.BOOLEAN_LITERAL,
      "as": TokenType.AS,
      "return": TokenType.RETURN,
      "if": TokenType.IF,
      "else": TokenType.ELSE,
      "for": TokenType.FOR,
      "while": TokenType.WHILE,
    };
    
    return keywords[value] || null;
  }

  /**
   * Create a token
   */
  private createToken(type: TokenType, value: string, start?: number): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column - value.length,
      position: start !== undefined ? start : this.position,
    };
  }
}
