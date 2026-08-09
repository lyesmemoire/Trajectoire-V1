/**
 * Blueprint DSL Parser
 * 
 * Parses tokens into an Abstract Syntax Tree (AST).
 */

import { Token, TokenType } from '../lexer/lexer';
import {
  ModuleNode,
  ImportNode,
  ExportNode,
  FunctionNode,
  ParameterNode,
  TypeNode,
  BlockNode,
  StatementNode,
  ExpressionNode,
  AssignmentNode,
  ReturnNode,
  IfNode,
  ForNode,
  WhileNode,
} from './ast-types';

export enum NodeType {
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
  
  IDENTIFIER = "IDENTIFIER",
  STRING_LITERAL = "STRING_LITERAL",
  NUMBER_LITERAL = "NUMBER_LITERAL",
  BOOLEAN_LITERAL = "BOOLEAN_LITERAL",
  
  TYPE = "TYPE",
  PARAMETER = "PARAMETER",
  BLOCK = "BLOCK",
  STATEMENT = "STATEMENT",
  EXPRESSION = "EXPRESSION",
  
  BINARY_EXPRESSION = "BINARY_EXPRESSION",
  UNARY_EXPRESSION = "UNARY_EXPRESSION",
  CALL_EXPRESSION = "CALL_EXPRESSION",
  MEMBER_EXPRESSION = "MEMBER_EXPRESSION",
  
  ASSIGNMENT = "ASSIGNMENT",
  RETURN = "RETURN",
  IF = "IF",
  FOR = "FOR",
  WHILE = "WHILE",
}

export class Parser {
  private tokens: Token[];
  private position: number;
  private currentToken: Token;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.position = 0;
    this.currentToken = this.tokens[0];
  }

  /**
   * Parse the entire token stream into an AST
   */
  public parse(): ModuleNode {
    return this.parseModule();
  }

  /**
   * Parse a module
   */
  private parseModule(): ModuleNode {
    const module: ModuleNode = {
      type: NodeType.MODULE,
      line: this.currentToken.line,
      column: this.currentToken.column,
      name: "",
      imports: [],
      exports: [],
      functions: [],
    };

    // Parse module declaration
    this.expect(TokenType.MODULE);
    module.name = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.LBRACE);

    // Parse module body
    while (this.currentToken.type !== TokenType.RBRACE && this.currentToken.type !== TokenType.EOF) {
      switch (this.currentToken.type) {
        case TokenType.IMPORT:
          module.imports.push(this.parseImport());
          break;
        case TokenType.EXPORT:
          module.exports.push(this.parseExport());
          break;
        case TokenType.FUNCTION:
          module.functions.push(this.parseFunction());
          break;
        default:
          this.advance();
      }
    }

    this.expect(TokenType.RBRACE);

    return module;
  }

  /**
   * Parse an import statement
   */
  private parseImport(): ImportNode {
    const importNode: ImportNode = {
      type: NodeType.IMPORT,
      line: this.currentToken.line,
      column: this.currentToken.column,
      module: "",
    };

    this.expect(TokenType.IMPORT);
    importNode.module = this.expect(TokenType.STRING_LITERAL).value;

    // Check for alias
    if (this.currentToken.type === TokenType.AS) {
      this.advance();
      importNode.alias = this.expect(TokenType.IDENTIFIER).value;
    }

    this.expect(TokenType.SEMICOLON);

    return importNode;
  }

  /**
   * Parse an export statement
   */
  private parseExport(): ExportNode {
    const exportNode: ExportNode = {
      type: NodeType.EXPORT,
      line: this.currentToken.line,
      column: this.currentToken.column,
      name: "",
    };

    this.expect(TokenType.EXPORT);
    exportNode.name = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.SEMICOLON);

    return exportNode;
  }

  /**
   * Parse a function
   */
  private parseFunction(): FunctionNode {
    const functionNode: FunctionNode = {
      type: NodeType.FUNCTION,
      line: this.currentToken.line,
      column: this.currentToken.column,
      name: "",
      parameters: [],
      returnType: { type: NodeType.TYPE, name: "void", line: 0, column: 0 },
      body: { type: NodeType.BLOCK, statements: [], line: 0, column: 0 },
    };

    this.expect(TokenType.FUNCTION);
    functionNode.name = this.expect(TokenType.IDENTIFIER).value;

    // Parse parameters
    this.expect(TokenType.LPAREN);
    functionNode.parameters = this.parseParameters();
    this.expect(TokenType.RPAREN);

    // Parse return type
    if (this.currentToken.type === TokenType.COLON) {
      this.advance();
      functionNode.returnType = this.parseType();
    }

    // Parse body
    functionNode.body = this.parseBlock();

    return functionNode;
  }

  /**
   * Parse parameters
   */
  private parseParameters(): ParameterNode[] {
    const parameters: ParameterNode[] = [];

    while (this.currentToken.type !== TokenType.RPAREN && this.currentToken.type !== TokenType.EOF) {
      parameters.push(this.parseParameter());

      if (this.currentToken.type === TokenType.COMMA) {
        this.advance();
      } else {
        break;
      }
    }

    return parameters;
  }

  /**
   * Parse a parameter
   */
  private parseParameter(): ParameterNode {
    const parameter: ParameterNode = {
      type: NodeType.PARAMETER,
      line: this.currentToken.line,
      column: this.currentToken.column,
      name: this.expect(TokenType.IDENTIFIER).value,
      paramType: this.parseType(),
      optional: false,
    };

    return parameter;
  }

  /**
   * Parse a type
   */
  private parseType(): TypeNode {
    const typeNode: TypeNode = {
      type: NodeType.TYPE,
      line: this.currentToken.line,
      column: this.currentToken.column,
      name: this.expect(TokenType.IDENTIFIER).value,
    };

    return typeNode;
  }

  /**
   * Parse a block
   */
  private parseBlock(): BlockNode {
    const block: BlockNode = {
      type: NodeType.BLOCK,
      line: this.currentToken.line,
      column: this.currentToken.column,
      statements: [],
    };

    this.expect(TokenType.LBRACE);

    while (this.currentToken.type !== TokenType.RBRACE && this.currentToken.type !== TokenType.EOF) {
      block.statements.push(this.parseStatement());
    }

    this.expect(TokenType.RBRACE);

    return block;
  }

  /**
   * Parse a statement
   */
  private parseStatement(): StatementNode {
    switch (this.currentToken.type) {
      case TokenType.RETURN:
        return this.parseReturn();
      case TokenType.IF:
        return this.parseIf();
      case TokenType.FOR:
        return this.parseFor();
      case TokenType.WHILE:
        return this.parseWhile();
      case TokenType.IDENTIFIER:
        return this.parseAssignment();
      default:
        return this.parseExpressionStatement();
    }
  }

  /**
   * Parse a return statement
   */
  private parseReturn(): ReturnNode {
    const returnNode: ReturnNode = {
      type: NodeType.RETURN,
      line: this.currentToken.line,
      column: this.currentToken.column,
    };

    this.expect(TokenType.RETURN);

    if (this.currentToken.type !== TokenType.SEMICOLON) {
      returnNode.value = this.parseExpression();
    }

    this.expect(TokenType.SEMICOLON);

    return returnNode;
  }

  /**
   * Parse an if statement
   */
  private parseIf(): IfNode {
    const ifNode: IfNode = {
      type: NodeType.IF,
      line: this.currentToken.line,
      column: this.currentToken.column,
      condition: null as any,
      thenBlock: null as any,
    };

    this.expect(TokenType.IF);
    this.expect(TokenType.LPAREN);
    ifNode.condition = this.parseExpression();
    this.expect(TokenType.RPAREN);
    ifNode.thenBlock = this.parseBlock();

    // Parse else block
    if (this.currentToken.type === TokenType.ELSE) {
      this.advance();
      ifNode.elseBlock = this.parseBlock();
    }

    return ifNode;
  }

  /**
   * Parse a for loop
   */
  private parseFor(): ForNode {
    const forNode: ForNode = {
      type: NodeType.FOR,
      line: this.currentToken.line,
      column: this.currentToken.column,
      body: null as any,
    };

    this.expect(TokenType.FOR);
    this.expect(TokenType.LPAREN);

    // Parse init
    if (this.currentToken.type !== TokenType.SEMICOLON) {
      forNode.init = this.parseStatement();
    } else {
      this.advance();
    }

    // Parse condition
    this.expect(TokenType.SEMICOLON);

    // Parse update
    if (this.currentToken.type !== TokenType.RPAREN) {
      forNode.update = this.parseExpression();
    }

    this.expect(TokenType.RPAREN);
    forNode.body = this.parseBlock();

    return forNode;
  }

  /**
   * Parse a while loop
   */
  private parseWhile(): WhileNode {
    const whileNode: WhileNode = {
      type: NodeType.WHILE,
      line: this.currentToken.line,
      column: this.currentToken.column,
      condition: null as any,
      body: null as any,
    };

    this.expect(TokenType.WHILE);
    this.expect(TokenType.LPAREN);
    whileNode.condition = this.parseExpression();
    this.expect(TokenType.RPAREN);
    whileNode.body = this.parseBlock();

    return whileNode;
  }

  /**
   * Parse an assignment
   */
  private parseAssignment(): AssignmentNode {
    const assignmentNode: AssignmentNode = {
      type: NodeType.ASSIGNMENT,
      line: this.currentToken.line,
      column: this.currentToken.column,
      name: this.expect(TokenType.IDENTIFIER).value,
      value: null as any,
    };

    this.expect(TokenType.ASSIGN);
    assignmentNode.value = this.parseExpression();
    this.expect(TokenType.SEMICOLON);

    return assignmentNode;
  }

  /**
   * Parse an expression statement
   */
  private parseExpressionStatement(): StatementNode {
    const expression = this.parseExpression();
    this.expect(TokenType.SEMICOLON);
    return expression as StatementNode;
  }

  /**
   * Parse an expression
   */
  private parseExpression(): ExpressionNode {
    return this.parseBinaryExpression();
  }

  /**
   * Parse a binary expression
   */
  private parseBinaryExpression(): ExpressionNode {
    let left = this.parseUnaryExpression();

    while (this.isBinaryOperator(this.currentToken.type)) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseUnaryExpression();

      left = {
        type: NodeType.BINARY_EXPRESSION,
        line: left.line,
        column: left.column,
        operator,
        left,
        right,
      };
    }

    return left;
  }

  /**
   * Parse a unary expression
   */
  private parseUnaryExpression(): ExpressionNode {
    return this.parseCallExpression();
  }

  /**
   * Parse a call expression
   */
  private parseCallExpression(): ExpressionNode {
    let expression = this.parsePrimaryExpression();

    while (this.currentToken.type === TokenType.LPAREN || this.currentToken.type === TokenType.DOT) {
      if (this.currentToken.type === TokenType.LPAREN) {
        this.advance();
        const args: ExpressionNode[] = [];

        while (this.currentToken.type !== TokenType.RPAREN && this.currentToken.type !== TokenType.EOF) {
          args.push(this.parseExpression());

          if (this.currentToken.type === TokenType.COMMA) {
            this.advance();
          } else {
            break;
          }
        }

        this.expect(TokenType.RPAREN);

        expression = {
          type: NodeType.CALL_EXPRESSION,
          line: expression.line,
          column: expression.column,
          callee: expression,
          arguments: args,
        };
      } else if (this.currentToken.type === TokenType.DOT) {
        this.advance();
        const property = this.expect(TokenType.IDENTIFIER).value;

        expression = {
          type: NodeType.MEMBER_EXPRESSION,
          line: expression.line,
          column: expression.column,
          object: expression,
          property,
        };
      }
    }

    return expression;
  }

  /**
   * Parse a primary expression
   */
  private parsePrimaryExpression(): ExpressionNode {
    switch (this.currentToken.type) {
      case TokenType.IDENTIFIER:
        return {
          type: NodeType.IDENTIFIER,
          line: this.currentToken.line,
          column: this.currentToken.column,
          value: this.advance().value,
        };
      case TokenType.STRING_LITERAL:
        return {
          type: NodeType.STRING_LITERAL,
          line: this.currentToken.line,
          column: this.currentToken.column,
          value: this.advance().value,
        };
      case TokenType.NUMBER_LITERAL:
        return {
          type: NodeType.NUMBER_LITERAL,
          line: this.currentToken.line,
          column: this.currentToken.column,
          value: this.advance().value,
        };
      case TokenType.BOOLEAN_LITERAL:
        return {
          type: NodeType.BOOLEAN_LITERAL,
          line: this.currentToken.line,
          column: this.currentToken.column,
          value: this.advance().value,
        };
      case TokenType.LPAREN:
        {
          this.advance();
          const expression = this.parseExpression();
          this.expect(TokenType.RPAREN);
          return expression;
        }
      default:
        throw new Error(`Unexpected token: ${this.currentToken.type}`);
    }
  }

  /**
   * Check if token is a binary operator
   */
  private isBinaryOperator(tokenType: TokenType): boolean {
    return [
      TokenType.EQUAL,
      TokenType.NOT_EQUAL,
      TokenType.LESS_THAN,
      TokenType.GREATER_THAN,
      TokenType.LESS_EQUAL,
      TokenType.GREATER_EQUAL,
      TokenType.AND,
      TokenType.OR,
      TokenType.ASSIGN,
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.MULTIPLY,
      TokenType.DIVIDE,
    ].includes(tokenType);
  }

  /**
   * Expect a specific token type
   */
  private expect(tokenType: TokenType): Token {
    if (this.currentToken.type === tokenType) {
      return this.advance();
    }
    throw new Error(`Expected ${tokenType}, got ${this.currentToken.type}`);
  }

  /**
   * Advance to the next token
   */
  private advance(): Token {
    const token = this.currentToken;
    this.position++;
    this.currentToken = this.tokens[this.position] || {
      type: TokenType.EOF,
      value: "",
      line: 0,
      column: 0,
      position: 0,
    };
    return token;
  }
}
