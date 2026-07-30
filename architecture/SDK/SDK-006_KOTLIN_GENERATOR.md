# SDK-006: Kotlin Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Kotlin SDK generator

---

## Purpose

The Kotlin generator generates idiomatic Kotlin SDKs from canonical contracts.

---

## Type Mapping

### Primitive Types
- `string` → `String`
- `integer` → `Long`
- `float` → `Double`
- `boolean` → `Boolean`
- `bytes` → `ByteArray`

### Complex Types
- `enum` → `enum class`
- `struct` → `data class`
- `list` → `List<T>`
- `map` → `Map<K, V>`
- `optional` → `T?`

---

## Code Generation

### Type Definition Generation
```
generate_type_definition(contract) -> KotlinCode {
    match contract.contract_type {
        ContractType::Struct => {
            generate_dataclass(contract)
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

### Dataclass Generation
```
generate_dataclass(struct_contract) -> KotlinCode {
    mut code = String::new();
    
    code.push_str("data class ");
    code.push_str(&struct_contract.name);
    code.push_str("(\n");
    
    for (i, field) in struct_contract.fields.iter().enumerate() {
        code.push_str("    val ");
        code.push_str(&to_pascal_case(&field.name));
        code.push_str(": ");
        code.push_str(&map_type(field.field_type));
        if (i < struct_contract.fields.len() - 1) {
            code.push_str(",");
        }
        code.push_str("\n");
    }
    
    code.push_str(")\n");
    
    code
}
```

### Enum Generation
```
generate_enum(enum_contract) -> KotlinCode {
    mut code = String::new();
    
    code.push_str("enum class ");
    code.push_str(&enum_contract.name);
    code.push_str("(val value: Int) {\n");
    
    for variant in enum_contract.variants {
        code.push_str("    ");
        code.push_str(&variant.name);
        code.push_str("(");
        code.push_str(&variant.value.to_string());
        code.push_str("),\n");
    }
    
    code.push_str("}\n");
    
    code
}
```

### Service Interface Generation
```
generate_service_interface(service_contract) -> KotlinCode {
    mut code = String::new();
    
    code.push_str("interface ");
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
generate_method(method) -> KotlinCode {
    mut code = String::new();
    
    code.push_str("    suspend fun ");
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
    
    code.push_str("): ");
    code.push_str(&map_type(method.return_type));
    code.push_str("\n");
    
    code
}
```

---

## Async Support

### Coroutines
All service methods are suspend functions for coroutine support.

### Error Handling
Errors are handled via coroutine exception handling.

---

## Kotlin Statistics

### Metrics
- Generation time (time to generate Kotlin SDK)
- Type coverage (types mapped / total types)
- Method coverage (methods generated / total methods)

### Counters
- Dataclasses generated
- Enums generated
- Service interfaces generated
- Methods generated
