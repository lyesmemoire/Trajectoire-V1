# SDK-001: TypeScript Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the TypeScript SDK generator

---

## Purpose

The TypeScript generator generates idiomatic TypeScript SDKs from canonical contracts.

---

## Type Mapping

### Primitive Types
- `string` → `string`
- `integer` → `number`
- `float` → `number`
- `boolean` → `boolean`
- `bytes` → `Uint8Array`

### Complex Types
- `enum` → `enum`
- `struct` → `interface`
- `list` → `Array<T>`
- `map` → `Map<K, V>`
- `optional` → `T | null`

---

## Code Generation

### Type Definition Generation
```
generate_type_definition(contract) -> TypeScriptCode {
    match contract.contract_type {
        ContractType::Struct => {
            generate_interface(contract)
        }
        ContractType::Enum => {
            generate_enum(contract)
        }
        ContractType::Service => {
            generate_service_class(contract)
        }
    }
}
```

### Interface Generation
```
generate_interface(struct_contract) -> TypeScriptCode {
    mut code = String::new();
    
    code.push_str("export interface ");
    code.push_str(&struct_contract.name);
    code.push_str(" {\n");
    
    for field in struct_contract.fields {
        code.push_str("  ");
        code.push_str(&field.name);
        code.push_str(": ");
        code.push_str(&map_type(field.field_type));
        code.push_str(";\n");
    }
    
    code.push_str("}\n");
    
    code
}
```

### Enum Generation
```
generate_enum(enum_contract) -> TypeScriptCode {
    mut code = String::new();
    
    code.push_str("export enum ");
    code.push_str(&enum_contract.name);
    code.push_str(" {\n");
    
    for variant in enum_contract.variants {
        code.push_str("  ");
        code.push_str(&variant.name);
        code.push_str(" = ");
        code.push_str(&variant.value.to_string());
        code.push_str(",\n");
    }
    
    code.push_str("}\n");
    
    code
}
```

### Service Class Generation
```
generate_service_class(service_contract) -> TypeScriptCode {
    mut code = String::new();
    
    code.push_str("export class ");
    code.push_str(&service_contract.name);
    code.push_str("Client {\n");
    
    // Constructor
    code.push_str("  constructor(private config: ");
    code.push_str(&service_contract.name);
    code.push_str("Config) {}\n\n");
    
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
generate_method(method) -> TypeScriptCode {
    mut code = String::new();
    
    code.push_str("  async ");
    code.push_str(&method.name);
    code.push_str("(");
    
    // Parameters
    for (i, param) in method.parameters.iter().enumerate() {
        if (i > 0) {
            code.push_str(", ");
        }
        code.push_str(&param.name);
        code.push_str(": ");
        code.push_str(&map_type(param.param_type));
    }
    
    code.push_str("): Promise<");
    code.push_str(&map_type(method.return_type));
    code.push_str("> {\n");
    
    // Method body
    code.push_str("    // Implementation\n");
    code.push_str("  }\n\n");
    
    code
}
```

---

## Async Support

### Async/Await
All service methods are async and return Promises.

### Error Handling
Errors are thrown as exceptions with proper error types.

---

## TypeScript Statistics

### Metrics
- Generation time (time to generate TypeScript SDK)
- Type coverage (types mapped / total types)
- Method coverage (methods generated / total methods)

### Counters
- Interfaces generated
- Enums generated
- Service classes generated
- Methods generated
