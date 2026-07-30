# SDK-004: Python Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the Python SDK generator

---

## Purpose

The Python generator generates idiomatic Python SDKs from canonical contracts.

---

## Type Mapping

### Primitive Types
- `string` → `str`
- `integer` → `int`
- `float` → `float`
- `boolean` → `bool`
- `bytes` → `bytes`

### Complex Types
- `enum` → `enum.Enum`
- `struct` → `dataclass`
- `list` → `List[T]`
- `map` → `Dict[K, V]`
- `optional` → `Optional[T]`

---

## Code Generation

### Type Definition Generation
```
generate_type_definition(contract) -> PythonCode {
    match contract.contract_type {
        ContractType::Struct => {
            generate_dataclass(contract)
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

### Dataclass Generation
```
generate_dataclass(struct_contract) -> PythonCode {
    mut code = String::new();
    
    code.push_str("from dataclasses import dataclass\n");
    code.push_str("from typing import *\n\n");
    
    code.push_str("@dataclass\n");
    code.push_str("class ");
    code.push_str(&struct_contract.name);
    code.push_str(":\n");
    
    for field in struct_contract.fields {
        code.push_str("    ");
        code.push_str(&field.name);
        code.push_str(": ");
        code.push_str(&map_type(field.field_type));
        code.push_str("\n");
    }
    
    code
}
```

### Enum Generation
```
generate_enum(enum_contract) -> PythonCode {
    mut code = String::new();
    
    code.push_str("from enum import Enum\n\n");
    
    code.push_str("class ");
    code.push_str(&enum_contract.name);
    code.push_str("(Enum):\n");
    
    for variant in enum_contract.variants {
        code.push_str("    ");
        code.push_str(&variant.name);
        code.push_str(" = ");
        code.push_str(&variant.value.to_string());
        code.push_str("\n");
    }
    
    code
}
```

### Service Class Generation
```
generate_service_class(service_contract) -> PythonCode {
    mut code = String::new();
    
    code.push_str("from typing import *\n");
    code.push_str("import asyncio\n\n");
    
    code.push_str("class ");
    code.push_str(&service_contract.name);
    code.push_str("Client:\n");
    
    // Constructor
    code.push_str("    def __init__(self, config: ");
    code.push_str(&service_contract.name);
    code.push_str("Config):\n");
    code.push_str("        self.config = config\n\n");
    
    // Methods
    for method in service_contract.methods {
        code.push_str(&generate_method(method));
    }
    
    code
}
```

### Method Generation
```
generate_method(method) -> PythonCode {
    mut code = String::new();
    
    code.push_str("    async def ");
    code.push_str(&method.name);
    code.push_str("(self");
    
    // Parameters
    for param in method.parameters {
        code.push_str(", ");
        code.push_str(&param.name);
        code.push_str(": ");
        code.push_str(&map_type(param.param_type));
    }
    
    code.push_str(") -> ");
    code.push_str(&map_type(method.return_type));
    code.push_str(":\n");
    
    // Method body
    code.push_str("        # Implementation\n");
    code.push_str("        pass\n\n");
    
    code
}
```

---

## Async Support

### Async/Await
All service methods are async and use asyncio.

### Error Handling
Errors are raised as exceptions.

---

## Python Statistics

### Metrics
- Generation time (time to generate Python SDK)
- Type coverage (types mapped / total types)
- Method coverage (methods generated / total methods)

### Counters
- Dataclasses generated
- Enums generated
- Service classes generated
- Methods generated
