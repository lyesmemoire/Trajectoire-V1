# AUTO_GENERATED-001: Interface & Type Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the interface and type generator in Auto-Generated Components system

---

## Purpose

The interface and type generator generates interface definitions and type definitions from canonical contracts.

---

## Interface Generation

### Interface Generation
```
generate_interface(contract) -> InterfaceDefinition {
    mut interface = InterfaceDefinition {
        name: contract.name,
        methods: Vec::new(),
        types: Vec::new(),
    };
    
    // Generate methods
    for method in contract.methods {
        interface_method = generate_interface_method(method);
        interface.methods.push(interface_method);
    }
    
    // Generate types
    for type_def in contract.types {
        interface_type = generate_interface_type(type_def);
        interface.types.push(interface_type);
    }
    
    interface
}
```

### Method Generation
```
generate_interface_method(method) -> InterfaceMethod {
    InterfaceMethod {
        name: method.name,
        parameters: generate_parameters(method.parameters),
        return_type: generate_return_type(method.return_type),
        documentation: generate_method_documentation(method),
    }
}
```

---

## Type Generation

### Type Generation
```
generate_type(type_def) -> TypeDefinition {
    match type_def.type_type {
        TypeType::Struct => {
            generate_struct_type(type_def)
        }
        TypeType::Enum => {
            generate_enum_type(type_def)
        }
        TypeType::Union => {
            generate_union_type(type_def)
        }
        TypeType::Alias => {
            generate_alias_type(type_def)
        }
    }
}
```

### Struct Type Generation
```
generate_struct_type(struct_def) -> StructType {
    mut fields = Vec::new();
    
    for field in struct_def.fields {
        field_type = generate_field_type(field.field_type);
        fields.push(StructField {
            name: field.name,
            field_type: field_type,
            documentation: field.documentation,
        });
    }
    
    StructType {
        name: struct_def.name,
        fields: fields,
        documentation: struct_def.documentation,
    }
}
```

### Enum Type Generation
```
generate_enum_type(enum_def) -> EnumType {
    mut variants = Vec::new();
    
    for variant in enum_def.variants {
        variants.push(EnumVariant {
            name: variant.name,
            value: variant.value,
            documentation: variant.documentation,
        });
    }
    
    EnumType {
        name: enum_def.name,
        variants: variants,
        documentation: enum_def.documentation,
    }
}
```

---

## Generation Statistics

### Metrics
- Interface generation time (time to generate interfaces)
- Type generation time (time to generate types)
- Generation success rate (successful / total)

### Counters
- Interfaces generated
- Types generated
