# AUTO_GENERATED-003: Schema Generators

**Version**: 1.0.0  
**Status**: Specification  
**Purpose**: Define the schema generators in Auto-Generated Components system

---

## Purpose

The schema generators generate schemas in various formats (JSON Schema, OpenAPI, GraphQL, Protobuf) from canonical contracts.

---

## JSON Schema Generation

### JSON Schema Generation
```
generate_json_schema(contract) -> JSONSchema {
    mut schema = JSONSchema {
        schema: "http://json-schema.org/draft-07/schema#",
        title: contract.name,
        type: SchemaType::Object,
        properties: HashMap::new(),
        required: Vec::new(),
    };
    
    // Generate properties
    for field in contract.fields {
        property = generate_json_schema_property(field);
        schema.properties.insert(field.name, property);
        
        if (field.required) {
            schema.required.push(field.name);
        }
    }
    
    schema
}
```

### Property Generation
```
generate_json_schema_property(field) -> JSONSchemaProperty {
    JSONSchemaProperty {
        type: map_type_to_json_schema_type(field.field_type),
        description: field.documentation,
        default: field.default_value,
    }
}
```

---

## OpenAPI Generation

### OpenAPI Generation
```
generate_openapi(contract) -> OpenAPISpec {
    mut spec = OpenAPISpec {
        openapi: "3.0.0",
        info: Info {
            title: contract.name,
            version: contract.version.to_string(),
        },
        paths: HashMap::new(),
        components: Components {
            schemas: HashMap::new(),
        },
    };
    
    // Generate paths
    for method in contract.methods {
        path = generate_openapi_path(method);
        spec.paths.insert(format!("/{}", method.name), path);
    }
    
    // Generate schemas
    for type_def in contract.types {
        schema = generate_openapi_schema(type_def);
        spec.components.schemas.insert(type_def.name, schema);
    }
    
    spec
}
```

### Path Generation
```
generate_openapi_path(method) -> PathItem {
    PathItem {
        operation: Operation {
            summary: method.documentation,
            request_body: generate_request_body(method),
            responses: generate_responses(method),
        },
    }
}
```

---

## GraphQL Generation

### GraphQL Generation
```
generate_graphql(contract) -> GraphQLSchema {
    mut schema = GraphQLSchema {
        types: Vec::new(),
        queries: Vec::new(),
        mutations: Vec::new(),
    };
    
    // Generate types
    for type_def in contract.types {
        graphql_type = generate_graphql_type(type_def);
        schema.types.push(graphql_type);
    }
    
    // Generate queries
    for method in contract.methods {
        if (method.method_type == MethodType::Query) {
            query = generate_graphql_query(method);
            schema.queries.push(query);
        }
    }
    
    // Generate mutations
    for method in contract.methods {
        if (method.method_type == MethodType::Mutation) {
            mutation = generate_graphql_mutation(method);
            schema.mutations.push(mutation);
        }
    }
    
    schema
}
```

### Type Generation
```
generate_graphql_type(type_def) -> GraphQLType {
    GraphQLType {
        name: type_def.name,
        fields: generate_graphql_fields(type_def),
        description: type_def.documentation,
    }
}
```

---

## Protobuf Generation

### Protobuf Generation
```
generate_protobuf(contract) -> ProtobufSchema {
    mut schema = ProtobufSchema {
        syntax: "proto3",
        package: contract.package,
        messages: Vec::new(),
        services: Vec::new(),
    };
    
    // Generate messages
    for type_def in contract.types {
        message = generate_protobuf_message(type_def);
        schema.messages.push(message);
    }
    
    // Generate services
    for service in contract.services {
        protobuf_service = generate_protobuf_service(service);
        schema.services.push(protobuf_service);
    }
    
    schema
}
```

### Message Generation
```
generate_protobuf_message(type_def) -> ProtobufMessage {
    mut fields = Vec::new();
    
    for (i, field) in type_def.fields.iter().enumerate() {
        protobuf_field = ProtobufField {
            number: i as u32 + 1,
            name: field.name,
            type: map_type_to_protobuf_type(field.field_type),
        };
        fields.push(protobuf_field);
    }
    
    ProtobufMessage {
        name: type_def.name,
        fields: fields,
    }
}
```

---

## Schema Statistics

### Metrics
- JSON Schema generation time (time to generate JSON Schema)
- OpenAPI generation time (time to generate OpenAPI)
- GraphQL generation time (time to generate GraphQL)
- Protobuf generation time (time to generate Protobuf)

### Counters
- JSON Schemas generated
- OpenAPI specs generated
- GraphQL schemas generated
- Protobuf schemas generated
