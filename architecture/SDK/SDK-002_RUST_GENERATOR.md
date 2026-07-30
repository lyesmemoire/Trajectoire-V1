# SDK-002: Rust Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Rust SDK generator

---

## Purpose

The Rust generator generates idiomatic Rust SDKs from canonical contracts.

---

## Type Mapping

### Primitive Types
- `string` → `String`
- `integer` → `i64`
- `float` → `f64`
- `boolean` → `bool`
- `bytes` → `Vec<u8>`

### Complex Types
- `enum` → `enum`
- `struct` → `struct`
- `list` → `Vec<T>`
- `map` → `HashMap<K, V>`
- `optional` → `Option<T>`

---

## Code Generation

### Type Definition Generation
```
generate_type_definition(contract) -> RustCode {
    match contract.contract_type {
        ContractType::Struct => {
            generate_struct(contract)
        }
        ContractType::Enum => {
            generate_enum(contract)
        }
        ContractType::Service => {
            generate_service_impl(contract)
        }
    }
}
```

### Struct Generation
```
generate_struct(struct_contract) -> RustCode {
    mut code = String::new();
    
    code.push_str("#[derive(Debug, Clone, Serialize, Deserialize)]\n");
    code.push_str("pub struct ");
    code.push_str(&struct_contract.name);
    code.push_str(" {\n");
    
    for field in struct_contract.fields {
        code.push_str("    pub ");
        code.push_str(&field.name);
        code.push_str(": ");
        code.push_str(&map_type(field.field_type));
        code.push_str(",\n");
    }
    
    code.push_str("}\n");
    
    code
}
```

### Enum Generation
```
generate_enum(enum_contract) -> RustCode {
    mut code = String::new();
    
    code.push_str("#[derive(Debug, Clone, Copy, Serialize, Deserialize)]\n");
    code.push_str("pub enum ");
    code.push_str(&enum_contract.name);
    code.push_str(" {\n");
    
    for variant in enum_contract.variants {
        code.push_str("    ");
        code.push_str(&variant.name);
        code.push_str(",\n");
    }
    
    code.push_str("}\n");
    
    code
}
```

### Service Implementation Generation
```
generate_service_impl(service_contract) -> RustCode {
    mut code = String::new();
    
    code.push_str("pub struct ");
    code.push_str(&service_contract.name);
    code.push_str("Client {\n");
    code.push_str("    config: ");
    code.push_str(&service_contract.name);
    code.push_str("Config,\n");
    code.push_str("}\n\n");
    
    code.push_str("impl ");
    code.push_str(&service_contract.name);
    code.push_str("Client {\n");
    
    // Constructor
    code.push_str("    pub fn new(config: ");
    code.push_str(&service_contract.name);
    code.push_str("Config) -> Self {\n");
    code.push_str("        Self { config }\n");
    code.push_str("    }\n\n");
    
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
generate_method(method) -> RustCode {
    mut code = String::new();
    
    code.push_str("    pub async fn ");
    code.push_str(&method.name);
    code.push_str("(&self");
    
    // Parameters
    for param in method.parameters {
        code.push_str(", ");
        code.push_str(&param.name);
        code.push_str(": ");
        code.push_str(&map_type(param.param_type));
    }
    
    code.push_str(") -> Result<");
    code.push_str(&map_type(method.return_type));
    code.push_str(", Error> {\n");
    
    // Method body
    code.push_str("        // Implementation\n");
    code.push_str("    }\n\n");
    
    code
}
```

---

## Async Support

### Async/Await
All service methods are async and return Results.

### Error Handling
Errors are returned as Result<T, Error>.

---

## Rust Statistics

### Metrics
- Generation time (time to generate Rust SDK)
- Type coverage (types mapped / total types)
- Method coverage (methods generated / total methods)

### Counters
- Structs generated
- Enums generated
- Service implementations generated
- Methods generated
