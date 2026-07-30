# COMPILATION-001: Lexing & Parsing

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the lexing and parsing stages in the compilation pipeline

---

## Purpose

The lexing and parsing stages convert source code into a structured Abstract Syntax Tree (AST) that can be analyzed and transformed.

---

## Lexing Stage

### Lexer Purpose
Convert source code into a stream of tokens for parsing.

### Token Types
```
enum TokenType {
    // Keywords
    FUNCTION, PIPELINE, OBSERVE, PERCEIVE, REASON, DECIDE,
    KNOWLEDGE, MEMORY, PLAN, VALIDATE, LEARN,
    
    // Identifiers
    IDENTIFIER,
    
    // Literals
    STRING, NUMBER, BOOLEAN,
    
    // Operators
    PLUS, MINUS, MULTIPLY, DIVIDE,
    EQUAL, NOT_EQUAL, LESS, LESS_EQUAL, GREATER, GREATER_EQUAL,
    AND, OR, NOT,
    
    // Punctuation
    LPAREN, RPAREN, LBRACE, RBRACE, LBRACKET, RBRACKET,
    COMMA, SEMICOLON, COLON, DOT,
    
    // Special
    EOF, WHITESPACE, COMMENT,
}
```

### Token Structure
```
struct Token {
    token_type: TokenType;
    lexeme: String;
    line: u32;
    column: u32;
}
```

### Lexing Process
```
lex(source_code) -> Vec<Token> {
    mut tokens = Vec::new();
    mut lexer = Lexer::new(source_code);
    
    while (lexer.has_more()) {
        token = lexer.next_token();
        tokens.push(token);
    }
    
    tokens.push(Token { token_type: EOF, lexeme: "", line: lexer.line, column: lexer.column });
    
    return tokens;
}
```

---

## Parsing Stage

### Parser Purpose
Convert token stream into a parse tree according to the grammar.

### Grammar Rules
```
program → (function | pipeline)*

function → FUNCTION IDENTIFIER LPAREN parameters RPAREN LBRACE statements RBRACE
pipeline → PIPELINE IDENTIFIER LBRACE stages RBRACE

parameters → (IDENTIFIER (COMMA IDENTIFIER)*)?
statements → (statement)*

statement → expression_statement
           | cognitive_statement
           | control_statement
           | declaration_statement

expression → IDENTIFIER
            | literal
            | expression operator expression
            | LPAREN expression RPAREN

cognitive_statement → OBSERVE LPAREN expression RPAREN
                    | PERCEIVE LPAREN expression RPAREN
                    | REASON LPAREN expression RPAREN
                    | DECIDE LPAREN expression RPAREN

control_statement → IF LPAREN expression RPAREN LBRACE statements RBRACE
                   | WHILE LPAREN expression RPAREN LBRACE statements RBRACE
                   | RETURN expression SEMICOLON

declaration_statement → LET IDENTIFIER EQUAL expression SEMICOLON
```

### Parse Tree Structure
```
struct ParseTree {
    root: ParseNode,
}

struct ParseNode {
    node_type: NodeType,
    children: Vec<ParseNode>,
    token: Option<Token>,
}
```

### Parsing Process
```
parse(tokens) -> ParseTree {
    mut parser = Parser::new(tokens);
    root = parser.parse_program();
    return ParseTree { root };
}
```

---

## AST Generation Stage

### AST Purpose
Transform parse tree into a simplified Abstract Syntax Tree.

### AST Node Types
```
enum ASTNodeType {
    Program,
    Function,
    Pipeline,
    Parameter,
    Statement,
    Expression,
    CognitiveOperation,
    ControlFlow,
    Declaration,
}
```

### AST Structure
```
struct ASTNode {
    node_type: ASTNodeType,
    children: Vec<ASTNode>,
    value: Option<ASTValue>,
    metadata: ASTMetadata,
}

struct ASTValue {
    identifier: Option<String>,
    literal: Option<Literal>,
    operator: Option<Operator>,
}

struct ASTMetadata {
    line: u32,
    column: u32,
    type_annotation: Option<Type>,
}
```

### AST Generation Process
```
generate_ast(parse_tree) -> ASTNode {
    mut ast_generator = ASTGenerator::new();
    ast_node = ast_generator.generate(parse_tree.root);
    return ast_node;
}
```

### AST Transformations
- Remove syntactic sugar
- Simplify structure
- Normalize expressions
- Flatten nested structures

---

## Error Handling

### Lexical Errors
- Invalid character
- Unterminated string
- Invalid number format

### Syntax Errors
- Unexpected token
- Missing token
- Invalid syntax

### Error Reporting
```
struct CompilationError {
    error_type: ErrorType,
    message: String,
    line: u32,
    column: u32,
    source_line: String,
}
```

---

## Lexing & Parsing Statistics

### Metrics
- Lexing time (time to tokenize)
- Parsing time (time to parse)
- AST generation time (time to generate AST)
- Token count (number of tokens)
- AST node count (number of AST nodes)

### Counters
- Tokens processed
- Parse nodes generated
- AST nodes generated
- Errors detected
