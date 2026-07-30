# AUTO_GENERATED-002: SDK Generator

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the SDK generator in Auto-Generated Components system

---

## Purpose

The SDK generator generates SDKs for multiple languages from canonical contracts.

---

## SDK Generation

### SDK Generation
```
generate_sdk(contract, language) -> SDK {
    match language {
        Language::TypeScript => {
            generate_typescript_sdk(contract)
        }
        Language::Rust => {
            generate_rust_sdk(contract)
        }
        Language::Go => {
            generate_go_sdk(contract)
        }
        Language::Python => {
            generate_python_sdk(contract)
        }
        Language::Java => {
            generate_java_sdk(contract)
        }
        Language::Kotlin => {
            generate_kotlin_sdk(contract)
        }
        Language::CSharp => {
            generate_csharp_sdk(contract)
        }
    }
}
```

### SDK Structure
```
struct SDK {
    language: Language,
    contract_id: ContractID,
    version: Version,
    types: Vec<TypeDefinition>,
    client: ClientDefinition,
    documentation: Documentation,
}
```

---

## Client Generation

### Client Generation
```
generate_client(contract, language) -> ClientDefinition {
    ClientDefinition {
        name: format!("{}Client", contract.name),
        methods: generate_client_methods(contract, language),
        configuration: generate_client_configuration(contract, language),
    }
}
```

### Method Generation
```
generate_client_methods(contract, language) -> Vec<ClientMethod> {
    mut methods = Vec::new();
    
    for method in contract.methods {
        client_method = ClientMethod {
            name: method.name,
            parameters: generate_method_parameters(method, language),
            return_type: generate_method_return_type(method, language),
            implementation: generate_method_implementation(method, language),
        };
        methods.push(client_method);
    }
    
    methods
}
```

---

## SDK Statistics

### Metrics
- SDK generation time (time to generate SDK)
- SDK size (bytes)
- Language coverage (languages supported / total languages)

### Counters
- SDKs generated
- Languages supported
