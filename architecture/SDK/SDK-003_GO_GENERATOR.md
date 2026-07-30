# SDK-003: Go Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Go SDK generator

---

## Purpose

The Go generator generates idiomatic Go SDKs from canonical contracts.

---

## Type Mapping

### Primitive Types
- `string` → `string`
- `integer` → `int64`
- `float` → `float64`
- `boolean` → `bool`
- `bytes` → `[]byte`

### Complex Types
- `enum` → `const` + `iota`
- `struct` → `struct`
- `list` → `[]T`
- `map` → `map[K]V`
- `optional` → `*T`

---

## Code Generation

### Type Definition Generation
```
generate_type_definition(contract) -> GoCode {
    match contract.contract_type {
        ContractType::Struct => {
            generate_struct(contract)
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

### Struct Generation
```
generate_struct(struct_contract) -> GoCode {
    mut code = String::new();
    
    code.push_str("type ");
    code.push_str(&struct_contract.name);
    code.push_str(" struct {\n");
    
    for field in struct_contract.fields {
        code.push_str("    ");
        code.push_str(&to_pascal_case(&field.name));
        code.push_str(" ");
        code.push_str(&map_type(field.field_type));
        code.push_str(" `json:\"");
        code.push_str(&field.name);
        code.push_str("\"`\n");
    }
    
    code.push_str("}\n");
    
    code
}
```

### Enum Generation
```
generate_enum(enum_contract) -> GoCode {
    mut code = String::new();
    
    code.push_str("type ");
    code.push_str(&enum_contract.name);
    code.push_str(" int\n\nconst (\n");
    
    for (i, variant) in enum_contract.variants.iter().enumerate() {
        code.push_str("    ");
        code.push_str(&to_pascal_case(&variant.name));
        code.push_str(" ");
        code.push_str(&enum_contract.name);
        code.push_str(" = iota + ");
        code.push_str(&i.to_string());
        code.push_str("\n");
    }
    
    code.push_str(")\n");
    
    code
}
```

### Service Interface Generation
```
generate_service_interface(service_contract) -> GoCode {
    mut code = String::new();
    
    code.push_str("type ");
    code.push_str(&service_contract.name);
    code.push_str("Client struct {\n");
    code.push_str("    config *");
    code.push_str(&service_contract.name);
    code.push_str("Config\n");
    code.push_str("}\n\n");
    
    code.push_str("func New");
    code.push_str(&service_contract.name);
    code.push_str("Client(config *");
    code.push_str(&service_contract.name);
    code.push_str("Config) *");
    code.push_str(&service_contract.name);
    code.push_str("Client {\n");
    code.push_str("    return &");
    code.push_str(&service_contract.name);
    code.push_str("Client{config: config}\n");
    code.push_str("}\n\n");
    
    // Methods
    for method in service_contract.methods {
        code.push_str(&generate_method(method));
    }
    
    code
}
```

### Method Generation
```
generate_method(method) -> GoCode {
    mut code = String::new();
    
    code.push_str("func (c *");
    code.push_str(&method.service_name);
    code.push_str("Client) ");
    code.push_str(&to_pascal_case(&method.name));
    code.push_str("(");
    
    // Parameters
    for (i, param) in method.parameters.iter().enumerate() {
        if (i > 0) {
            code.push_str(", ");
        }
        code.push_str(&param.name);
        code.push_str(" ");
        code.push_str(&map_type(param.param_type));
    }
    
    code.push_str(") (");
    code.push_str(&map_type(method.return_type));
    code.push_str(", error) {\n");
    
    // Method body
    code.push_str("    // Implementation\n");
    code.push_str("}\n\n");
    
    code
}
```

---

## Async Support

### Goroutines
Service methods can be called concurrently using goroutines.

### Channels
Results can be returned via channels for async operations.

---

## Go Statistics

### Metrics
- Generation time (time to generate Go SDK)
- Type coverage (types mapped / total types)
- Method coverage (methods generated / total methods)

### Counters
- Structs generated
- Enums generated
- Service interfaces generated
- Methods generated
