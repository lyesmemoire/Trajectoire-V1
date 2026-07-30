# SDK-005: Java Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Java SDK generator

---

## Purpose

The Java generator generates idiomatic Java SDKs from canonical contracts.

---

## Type Mapping

### Primitive Types
- `string` → `String`
- `integer` → `long`
- `float` → `double`
- `boolean` → `boolean`
- `bytes` → `byte[]`

### Complex Types
- `enum` → `enum`
- `struct` → `class`
- `list` → `List<T>`
- `map` → `Map<K, V>`
- `optional` → `Optional<T>`

---

## Code Generation

### Type Definition Generation
```
generate_type_definition(contract) -> JavaCode {
    match contract.contract_type {
        ContractType::Struct => {
            generate_class(contract)
        }
        ContractType::Enum => {
            generate_enum(contract)
        }
        ContractType::Service => {
            generate_service_interface(contract)
        }
    }
}
```

### Class Generation
```
generate_class(struct_contract) -> JavaCode {
    mut code = String::new();
    
    code.push_str("public class ");
    code.push_str(&struct_contract.name);
    code.push_str(" {\n");
    
    for field in struct_contract.fields {
        code.push_str("    private ");
        code.push_str(&map_type(field.field_type));
        code.push_str(" ");
        code.push_str(&to_pascal_case(&field.name));
        code.push_str(";\n");
    }
    
    // Getters and setters
    for field in struct_contract.fields {
        code.push_str(&generate_getter(field));
        code.push_str(&generate_setter(field));
    }
    
    code.push_str("}\n");
    
    code
}
```

### Enum Generation
```
generate_enum(enum_contract) -> JavaCode {
    mut code = String::new();
    
    code.push_str("public enum ");
    code.push_str(&enum_contract.name);
    code.push_str(" {\n");
    
    for (i, variant) in enum_contract.variants.iter().enumerate() {
        code.push_str("    ");
        code.push_str(&variant.name);
        if (i < enum_contract.variants.len() - 1) {
            code.push_str(",");
        }
        code.push_str("\n");
    }
    
    code.push_str("}\n");
    
    code
}
```

### Service Interface Generation
```
generate_service_interface(service_contract) -> JavaCode {
    mut code = String::new();
    
    code.push_str("public interface ");
    code.push_str(&service_contract.name);
    code.push_str("Client {\n");
    
    // Methods
    for method in service_contract.methods {
        code.push_str(&generate_method(method));
    }
    
    code.push_str("}\n");
    
    code
}
```

### Method Generation
```
generate_method(method) -> JavaCode {
    mut code = String::new();
    
    code.push_str("    CompletableFuture<");
    code.push_str(&map_type(method.return_type));
    code.push_str("> ");
    code.push_str(&method.name);
    code.push_str("(");
    
    // Parameters
    for (i, param) in method.parameters.iter().enumerate() {
        if (i > 0) {
            code.push_str(", ");
        }
        code.push_str(&map_type(param.param_type));
        code.push_str(" ");
        code.push_str(&param.name);
    }
    
    code.push_str(");\n");
    
    code
}
```

---

## Async Support

### CompletableFuture
All service methods return CompletableFuture for async operations.

### Error Handling
Errors are handled via CompletableFuture's exception handling.

---

## Java Statistics

### Metrics
- Generation time (time to generate Java SDK)
- Type coverage (types mapped / total types)
- Method coverage (methods generated / total methods)

### Counters
- Classes generated
- Enums generated
- Service interfaces generated
- Methods generated
