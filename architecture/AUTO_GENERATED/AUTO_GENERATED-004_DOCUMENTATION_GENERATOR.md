# AUTO_GENERATED-004: Documentation Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the documentation generator in Auto-Generated Components system

---

## Purpose

The documentation generator generates API documentation for all contracts.

---

## Documentation Generation

### Documentation Generation
```
generate_documentation(contract) -> Documentation {
    Documentation {
        title: contract.name,
        description: contract.description,
        version: contract.version,
        sections: generate_documentation_sections(contract),
        examples: generate_documentation_examples(contract),
    }
}
```

### Section Generation
```
generate_documentation_sections(contract) -> Vec<DocumentationSection> {
    mut sections = Vec::new();
    
    // Overview section
    sections.push(DocumentationSection {
        title: "Overview",
        content: generate_overview(contract),
    });
    
    // Types section
    sections.push(DocumentationSection {
        title: "Types",
        content: generate_types_documentation(contract),
    });
    
    // Methods section
    sections.push(DocumentationSection {
        title: "Methods",
        content: generate_methods_documentation(contract),
    });
    
    sections
}
```

### Types Documentation
```
generate_types_documentation(contract) -> String {
    mut content = String::new();
    
    for type_def in contract.types {
        content.push_str(&format!("## {}\n\n", type_def.name));
        content.push_str(&type_def.documentation);
        content.push_str("\n\n");
        
        for field in type_def.fields {
            content.push_str(&format!("### {}\n\n", field.name));
            content.push_str(&format!("Type: {}\n\n", field.field_type));
            content.push_str(&field.documentation);
            content.push_str("\n\n");
        }
    }
    
    content
}
```

### Methods Documentation
```
generate_methods_documentation(contract) -> String {
    mut content = String::new();
    
    for method in contract.methods {
        content.push_str(&format!("## {}\n\n", method.name));
        content.push_str(&method.documentation);
        content.push_str("\n\n");
        
        content.push_str("### Parameters\n\n");
        for param in method.parameters {
            content.push_str(&format!("- {}: {}\n", param.name, param.param_type));
        }
        content.push_str("\n\n");
        
        content.push_str(&format!("### Returns\n\n{}\n\n", method.return_type));
    }
    
    content
}
```

---

## Example Generation

### Example Generation
```
generate_documentation_examples(contract) -> Vec<DocumentationExample> {
    mut examples = Vec::new();
    
    for method in contract.methods {
        example = generate_method_example(method);
        examples.push(example);
    }
    
    examples
}
```

### Method Example
```
generate_method_example(method) -> DocumentationExample {
    DocumentationExample {
        title: format!("Example: {}", method.name),
        code: generate_example_code(method),
        description: generate_example_description(method),
    }
}
```

---

## Documentation Statistics

### Metrics
- Documentation generation time (time to generate documentation)
- Documentation size (bytes)
- Example coverage (methods with examples / total methods)

### Counters
- Documentation generated
- Examples generated
