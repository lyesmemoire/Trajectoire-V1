# COMPILATION-003: Type Checking

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the type checking stage in the compilation pipeline

---

## Purpose

The type checking stage verifies type correctness of the AST, ensuring that all operations are type-safe and consistent.

---

## Type System

### Primitive Types
```
enum Type {
    Void,
    Boolean,
    Integer,
    Float,
    String,
    Observation,
    Perception,
    Reasoning,
    Decision,
    Knowledge,
    Memory,
    Function(Box<Type>, Box<Type>),
    Pipeline(Box<Type>),
    Array(Box<Type>),
    Struct(HashMap<String, Type>),
}
```

### Type Inference
```
infer_type(ast_node, type_environment) -> Type {
    match ast_node.node_type {
        ASTNodeType::Literal => {
            infer_literal_type(ast_node)
        }
        ASTNodeType::Identifier => {
            type_environment.lookup(ast_node.identifier)
        }
        ASTNodeType::Expression => {
            infer_expression_type(ast_node, type_environment)
        }
        ASTNodeType::Function => {
            infer_function_type(ast_node, type_environment)
        }
        _ => {
            Type::Void
        }
    }
}
```

---

## Type Checking Operations

### Type Checking
```
check_types(ast) -> TypedAST {
    mut type_environment = TypeEnvironment::new();
    mut type_checker = TypeChecker::new(type_environment);
    typed_ast = type_checker.check(ast);
    return typed_ast;
}
```

### Expression Type Checking
```
check_expression_type(expression, type_environment) -> Type {
    match expression.operator {
        Operator::Plus => {
            left_type = check_expression_type(expression.left, type_environment);
            right_type = check_expression_type(expression.right, type_environment);
            
            if (left_type == Type::Integer && right_type == Type::Integer) {
                Type::Integer
            } else if (left_type == Type::Float && right_type == Type::Float) {
                Type::Float
            } else {
                report_error(TypeMismatch, expression);
                Type::Void
            }
        }
        Operator::Equal => {
            left_type = check_expression_type(expression.left, type_environment);
            right_type = check_expression_type(expression.right, type_environment);
            
            if (left_type == right_type) {
                Type::Boolean
            } else {
                report_error(TypeMismatch, expression);
                Type::Void
            }
        }
        _ => {
            Type::Void
        }
    }
}
```

### Function Type Checking
```
check_function_type(function, type_environment) -> Type {
    // Create new scope for function
    type_environment.push_scope();
    
    // Add parameters to type environment
    for parameter in function.parameters {
        type_environment.insert(parameter.name, parameter.type);
    }
    
    // Check return type
    return_type = check_expression_type(function.body, type_environment);
    
    // Pop scope
    type_environment.pop_scope();
    
    Type::Function(Box::new(parameter_types), Box::new(return_type))
}
```

---

## Type Coercion

### Type Coercion Rules
```
coerce_type(from_type, to_type) -> bool {
    match (from_type, to_type) {
        (Type::Integer, Type::Float) => true,
        (Type::Float, Type::Integer) => false,
        (Type::Integer, Type::Boolean) => true,
        (Type::Boolean, Type::Integer) => true,
        (from, to) if from == to => true,
        _ => false,
    }
}
```

### Type Coercion Application
```
apply_coercion(expression, target_type) -> CoercedExpression {
    if (expression.type != target_type) {
        if (can_coerce(expression.type, target_type)) {
            CoercedExpression {
                expression: expression,
                coercion: Coercion::new(expression.type, target_type),
            }
        } else {
            report_error(CannotCoerce, expression);
            expression
        }
    } else {
        expression
    }
}
```

---

## Type Checking Errors

### Type Mismatch
```
report_type_mismatch(expected_type, actual_type, node) {
    error = CompilationError {
        error_type: TypeMismatch,
        message: format!("Expected type {:?}, found type {:?}", expected_type, actual_type),
        line: node.metadata.line,
        column: node.metadata.column,
        source_line: get_source_line(node),
    };
    errors.push(error);
}
```

### Undefined Type
```
report_undefined_type(type_name, node) {
    error = CompilationError {
        error_type: UndefinedType,
        message: format!("Undefined type: {}", type_name),
        line: node.metadata.line,
        column: node.metadata.column,
        source_line: get_source_line(node),
    };
    errors.push(error);
}
```

---

## Type Checking Statistics

### Metrics
- Type checking time (time to check types)
- Type inference rate (inferred types / total types)
- Type coercion rate (coerced types / total types)

### Counters
- Types checked
- Types inferred
- Type coercions applied
- Type errors detected
