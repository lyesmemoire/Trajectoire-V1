#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Multi-Language Generator
 * 
 * Phase 5: Generate multiple languages from single definition
 * Supports: TypeScript, Rust, Go, Java, Kotlin, C#, JSON Schema, YAML, Markdown, OpenAPI, AsyncAPI, GraphQL, Mermaid, PlantUML
 */

const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, dirname } = require('path');
const { createHash } = require('crypto');

class MultiLanguageGenerator {
  constructor(canonicalModelPath, outputPath) {
    this.canonicalModelPath = canonicalModelPath;
    this.outputPath = outputPath;
    this.canonicalElements = new Map();
    this.generatedFiles = new Map();
    
    this.loadCanonicalModel();
  }

  /**
   * Load canonical model
   */
  loadCanonicalModel() {
    const content = readFileSync(this.canonicalModelPath, 'utf-8');
    const lines = content.split('\n');
    
    let inTable = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.match(/^\|.*\|.*\|.*\|.*\|.*\|/) && !inTable) {
        inTable = true;
        continue;
      }
      
      if (line.match(/^\|[-\s|]+\|/)) {
        continue;
      }
      
      if (line.match(/^\|.*\|/) && inTable) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        const idPattern = /^[A-Z]+-\w+-\d+$/;
        
        let id = null;
        let name = null;
        let uuid = null;
        let semanticId = null;
        let owner = null;
        let type = null;
        
        for (let j = 0; j < parts.length; j++) {
          if (idPattern.test(parts[j])) {
            id = parts[j];
            type = this.inferType(id);
            if (j + 1 < parts.length && parts[j + 1]) {
              name = parts[j + 1];
            }
            if (j + 2 < parts.length && parts[j + 2].match(/[0-9a-f-]{36}/i)) {
              uuid = parts[j + 2];
            }
            if (j + 3 < parts.length && parts[j + 3].startsWith('blueprint.')) {
              semanticId = parts[j + 3];
            }
            if (j + 4 < parts.length) {
              owner = parts[j + 4];
            }
            break;
          }
        }
        
        if (id && name) {
          this.canonicalElements.set(name, {
            id,
            uuid,
            semanticId,
            owner,
            type,
            layer: this.inferLayer(id)
          });
        }
        continue;
      }
      
      if (!line.match(/^\|/)) {
        inTable = false;
      }
    }
    
    console.log(`Loaded ${this.canonicalElements.size} canonical elements`);
  }

  inferType(id) {
    if (id.startsWith('BCM-OBJ-')) return 'object';
    if (id.startsWith('COS-OBJ-')) return 'object';
    if (id.startsWith('CVM-OBJ-')) return 'object';
    if (id.startsWith('BEA-OBJ-')) return 'object';
    if (id.startsWith('BCM-EVT-')) return 'event';
    if (id.startsWith('BCM-STATE-')) return 'state';
    if (id.startsWith('BCM-GRAPH-')) return 'graph';
    if (id.startsWith('BCM-ALG-')) return 'algorithm';
    if (id.startsWith('BEA-CONTRACT-')) return 'contract';
    return 'unknown';
  }

  inferLayer(id) {
    if (id.startsWith('BCM-')) return 'BCM';
    if (id.startsWith('COS-')) return 'COS';
    if (id.startsWith('CVM-')) return 'CVM';
    if (id.startsWith('CPR-')) return 'CPR';
    if (id.startsWith('BSC-')) return 'BSC';
    if (id.startsWith('BRM-')) return 'BRM';
    if (id.startsWith('BEA-')) return 'BEA';
    return 'UNKNOWN';
  }

  /**
   * Generate all languages
   */
  generateAll() {
    console.log('Starting multi-language generation...');
    
    this.generateTypeScript();
    this.generateRust();
    this.generateGo();
    this.generateJava();
    this.generateKotlin();
    this.generateCSharp();
    this.generateJSONSchema();
    this.generateYAML();
    this.generateMarkdown();
    this.generateOpenAPI();
    this.generateAsyncAPI();
    this.generateGraphQL();
    this.generateMermaid();
    this.generatePlantUML();
    
    console.log(`Generation complete. Generated ${this.generatedFiles.size} files`);
    return this.generatedFiles;
  }

  /**
   * Generate TypeScript
   */
  generateTypeScript() {
    console.log('Generating TypeScript...');
    const tsDir = join(this.outputPath, 'typescript');
    this.ensureDirectory(tsDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateTypeScriptContent(elem);
      const filePath = join(tsDir, `${name}.ts`);
      this.writeFile(filePath, content);
    }
  }

  generateTypeScriptContent(elem) {
    return `// Canonical Reference: ${elem.id} (${elem.semanticId})
// Owner: ${elem.owner}
// UUID: ${elem.uuid}
// Layer: ${elem.layer}
// Type: ${elem.type}

export interface ${elem.name} {
  id: string;
  name: string;
  owner: string;
  version: string;
  [key: string]: any;
}

export type ${elem.name}Input = Omit<${elem.name}, 'id'>;

export type ${elem.name}Update = Partial<${elem.name}Input>;

export class ${elem.name} implements ${elem.name} {
  id: string;
  name: string;
  owner: string;
  version: string;

  constructor(input: ${elem.name}Input) {
    this.id = crypto.randomUUID();
    this.name = input.name;
    this.owner = input.owner || '${elem.owner}';
    this.version = input.version || '1.0.0';
  }

  update(input: ${elem.name}Update): void {
    Object.assign(this, input);
  }
}

/*
 * This file is auto-generated by the Blueprint Multi-Language Generator.
 * Do not edit manually. All changes will be overwritten.
 */
`;
  }

  /**
   * Generate Rust
   */
  generateRust() {
    console.log('Generating Rust...');
    const rustDir = join(this.outputPath, 'rust');
    this.ensureDirectory(rustDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateRustContent(elem);
      const filePath = join(rustDir, `${name}.rs`);
      this.writeFile(filePath, content);
    }
  }

  generateRustContent(elem) {
    const structName = this.toPascalCase(elem.name);
    return `// Canonical Reference: ${elem.id} (${elem.semanticId})
// Owner: ${elem.owner}
// UUID: ${elem.uuid}
// Layer: ${elem.layer}
// Type: ${elem.type}

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ${structName} {
    pub id: Uuid,
    pub name: String,
    pub owner: String,
    pub version: String,
    #[serde(flatten)]
    pub extra: std::collections::HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ${structName}Input {
    pub name: String,
    pub owner: Option<String>,
    pub version: Option<String>,
    #[serde(flatten)]
    pub extra: std::collections::HashMap<String, serde_json::Value>,
}

impl ${structName} {
    pub fn new(input: ${structName}Input) -> Self {
        Self {
            id: Uuid::new_v4(),
            name: input.name,
            owner: input.owner.unwrap_or_else(|| "${elem.owner}".to_string()),
            version: input.version.unwrap_or_else(|| "1.0.0".to_string()),
            extra: input.extra,
        }
    }
}

/*
 * This file is auto-generated by the Blueprint Multi-Language Generator.
 * Do not edit manually. All changes will be overwritten.
 */
`;
  }

  /**
   * Generate Go
   */
  generateGo() {
    console.log('Generating Go...');
    const goDir = join(this.outputPath, 'go');
    this.ensureDirectory(goDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateGoContent(elem);
      const filePath = join(goDir, `${name}.go`);
      this.writeFile(filePath, content);
    }
  }

  generateGoContent(elem) {
    const structName = this.toPascalCase(elem.name);
    return `// Canonical Reference: ${elem.id} (${elem.semanticId})
// Owner: ${elem.owner}
// UUID: ${elem.uuid}
// Layer: ${elem.layer}
// Type: ${elem.type}

package blueprint

import (
    "github.com/google/uuid"
)

type ${structName} struct {
    ID      string                 \`json:"id"\`
    Name    string                 \`json:"name"\`
    Owner   string                 \`json:"owner"\`
    Version string                 \`json:"version"\`
    Extra   map[string]interface{} \`json:"extra"\`
}

type ${structName}Input struct {
    Name    string                 \`json:"name"\`
    Owner   *string                \`json:"owner,omitempty"\`
    Version *string                \`json:"version,omitempty"\`
    Extra   map[string]interface{} \`json:"extra,omitempty"\`
}

func New${structName}(input ${structName}Input) *${structName} {
    owner := "${elem.owner}"
    if input.Owner != nil {
        owner = *input.Owner
    }
    
    version := "1.0.0"
    if input.Version != nil {
        version = *input.Version
    }
    
    return &${structName}{
        ID:      uuid.New().String(),
        Name:    input.Name,
        Owner:   owner,
        Version: version,
        Extra:   input.Extra,
    }
}

/*
 * This file is auto-generated by the Blueprint Multi-Language Generator.
 * Do not edit manually. All changes will be overwritten.
 */
`;
  }

  /**
   * Generate Java
   */
  generateJava() {
    console.log('Generating Java...');
    const javaDir = join(this.outputPath, 'java');
    this.ensureDirectory(javaDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateJavaContent(elem);
      const filePath = join(javaDir, `${name}.java`);
      this.writeFile(filePath, content);
    }
  }

  generateJavaContent(elem) {
    const className = this.toPascalCase(elem.name);
    return `// Canonical Reference: ${elem.id} (${elem.semanticId})
// Owner: ${elem.owner}
// UUID: ${elem.uuid}
// Layer: ${elem.layer}
// Type: ${elem.type}

package com.blueprint.${elem.layer.toLowerCase()};

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class ${className} {
    private String id;
    private String name;
    private String owner;
    private String version;
    private Map<String, Object> extra;

    public ${className}() {
        this.extra = new HashMap<>();
    }

    public ${className}(String name, String owner, String version) {
        this();
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.owner = owner != null ? owner : "${elem.owner}";
        this.version = version != null ? version : "1.0.0";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public Map<String, Object> getExtra() { return extra; }
    public void setExtra(Map<String, Object> extra) { this.extra = extra; }
}

/*
 * This file is auto-generated by the Blueprint Multi-Language Generator.
 * Do not edit manually. All changes will be overwritten.
 */
`;
  }

  /**
   * Generate Kotlin
   */
  generateKotlin() {
    console.log('Generating Kotlin...');
    const kotlinDir = join(this.outputPath, 'kotlin');
    this.ensureDirectory(kotlinDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateKotlinContent(elem);
      const filePath = join(kotlinDir, `${name}.kt`);
      this.writeFile(filePath, content);
    }
  }

  generateKotlinContent(elem) {
    const className = this.toPascalCase(elem.name);
    return `// Canonical Reference: ${elem.id} (${elem.semanticId})
// Owner: ${elem.owner}
// UUID: ${elem.uuid}
// Layer: ${elem.layer}
// Type: ${elem.type}

package com.blueprint.${elem.layer.toLowerCase()}

import java.util.UUID

data class ${className}(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val owner: String = "${elem.owner}",
    val version: String = "1.0.0",
    val extra: Map<String, Any> = emptyMap()
)

/*
 * This file is auto-generated by the Blueprint Multi-Language Generator.
 * Do not edit manually. All changes will be overwritten.
 */
`;
  }

  /**
   * Generate C#
   */
  generateCSharp() {
    console.log('Generating C#...');
    const csharpDir = join(this.outputPath, 'csharp');
    this.ensureDirectory(csharpDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateCSharpContent(elem);
      const filePath = join(csharpDir, `${name}.cs`);
      this.writeFile(filePath, content);
    }
  }

  generateCSharpContent(elem) {
    const className = this.toPascalCase(elem.name);
    return `// Canonical Reference: ${elem.id} (${elem.semanticId})
// Owner: ${elem.owner}
// UUID: ${elem.uuid}
// Layer: ${elem.layer}
// Type: ${elem.type}

using System;
using System.Collections.Generic;

namespace Blueprint.${elem.layer}
{
    public class ${className}
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string Version { get; set; }
        public Dictionary<string, object> Extra { get; set; }

        public ${className}()
        {
            Id = Guid.NewGuid().ToString();
            Owner = "${elem.owner}";
            Version = "1.0.0";
            Extra = new Dictionary<string, object>();
        }

        public ${className}(string name)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
            Owner = "${elem.owner}";
            Version = "1.0.0";
            Extra = new Dictionary<string, object>();
        }
    }
}

/*
 * This file is auto-generated by the Blueprint Multi-Language Generator.
 * Do not edit manually. All changes will be overwritten.
 */
`;
  }

  /**
   * Generate JSON Schema
   */
  generateJSONSchema() {
    console.log('Generating JSON Schema...');
    const jsonSchemaDir = join(this.outputPath, 'json-schema');
    this.ensureDirectory(jsonSchemaDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateJSONSchemaContent(elem);
      const filePath = join(jsonSchemaDir, `${name}.schema.json`);
      this.writeFile(filePath, content);
    }
  }

  generateJSONSchemaContent(elem) {
    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: `https://blueprint.enterprise/schemas/${elem.id}.json`,
      title: elem.name,
      description: `Canonical schema for ${elem.name}`,
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Canonical ID"
        },
        name: {
          type: "string",
          description: "Object name"
        },
        owner: {
          type: "string",
          description: "Owner"
        },
        version: {
          type: "string",
          description: "Version"
        }
      },
      required: ["id", "name", "owner"],
      additionalProperties: true,
      _metadata: {
        canonicalId: elem.id,
        uuid: elem.uuid,
        semanticId: elem.semanticId,
        owner: elem.owner,
        layer: elem.layer,
        type: elem.type,
        generatedBy: "Blueprint Multi-Language Generator"
      }
    };
  }

  /**
   * Generate YAML
   */
  generateYAML() {
    console.log('Generating YAML...');
    const yamlDir = join(this.outputPath, 'yaml');
    this.ensureDirectory(yamlDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateYAMLContent(elem);
      const filePath = join(yamlDir, `${name}.yaml`);
      this.writeFile(filePath, content);
    }
  }

  generateYAMLContent(elem) {
    return `# Canonical Reference: ${elem.id} (${elem.semanticId})
# Owner: ${elem.owner}
# UUID: ${elem.uuid}
# Layer: ${elem.layer}
# Type: ${elem.type}

id: ${elem.id}
name: ${elem.name}
owner: ${elem.owner}
version: "1.0.0"
extra: {}

# This file is auto-generated by the Blueprint Multi-Language Generator.
# Do not edit manually. All changes will be overwritten.
`;
  }

  /**
   * Generate Markdown
   */
  generateMarkdown() {
    console.log('Generating Markdown...');
    const markdownDir = join(this.outputPath, 'markdown');
    this.ensureDirectory(markdownDir);
    
    for (const [name, elem] of this.canonicalElements) {
      const content = this.generateMarkdownContent(elem);
      const filePath = join(markdownDir, `${name}.md`);
      this.writeFile(filePath, content);
    }
  }

  generateMarkdownContent(elem) {
    return `# ${elem.name}

**Canonical ID**: ${elem.id}  
**UUID**: ${elem.uuid}  
**Semantic ID**: ${elem.semanticId}  
**Owner**: ${elem.owner}  
**Type**: ${elem.type}  
**Layer**: ${elem.layer}

## Definition

This object is part of the Blueprint V3 Enterprise canonical model.

## Properties

- \`id\`: Canonical identifier
- \`name\`: Object name
- \`owner\`: Owner team
- \`version\`: Version number

## Generated Implementations

- TypeScript
- Rust
- Go
- Java
- Kotlin
- C#
- JSON Schema
- YAML

---
*This file is auto-generated by the Blueprint Multi-Language Generator. Do not edit manually.*
`;
  }

  /**
   * Generate OpenAPI
   */
  generateOpenAPI() {
    console.log('Generating OpenAPI...');
    const openAPIDir = join(this.outputPath, 'openapi');
    this.ensureDirectory(openAPIDir);
    
    const openAPISpec = {
      openapi: "3.0.0",
      info: {
        title: "Blueprint V3 Enterprise API",
        version: "1.0.0",
        description: "Auto-generated OpenAPI specification from Canonical Model"
      },
      paths: {},
      components: {
        schemas: {}
      }
    };

    for (const [name, elem] of this.canonicalElements) {
      const schema = {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          owner: { type: "string" },
          version: { type: "string" }
        },
        required: ["id", "name", "owner"]
      };
      
      openAPISpec.components.schemas[name] = schema;
      
      // Add basic CRUD paths
      openAPISpec.paths[`/${elem.layer.toLowerCase()}/${name.toLowerCase()}`] = {
        get: {
          summary: `Get ${name}`,
          responses: {
            200: {
              description: "Success",
              content: {
                "application/json": {
                  schema: { $ref: `#/components/schemas/${name}` }
                }
              }
            }
          }
        },
        post: {
          summary: `Create ${name}`,
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: `#/components/schemas/${name}` }
              }
            }
          },
          responses: {
            201: {
              description: "Created"
            }
          }
        }
      };
    }

    const filePath = join(openAPIDir, 'blueprint-openapi.yaml');
    this.writeFile(filePath, JSON.stringify(openAPISpec, null, 2));
  }

  /**
   * Generate AsyncAPI
   */
  generateAsyncAPI() {
    console.log('Generating AsyncAPI...');
    const asyncAPIDir = join(this.outputPath, 'asyncapi');
    this.ensureDirectory(asyncAPIDir);
    
    const asyncAPISpec = {
      asyncapi: "2.6.0",
      info: {
        title: "Blueprint V3 Enterprise Events",
        version: "1.0.0",
        description: "Auto-generated AsyncAPI specification from Canonical Model"
      },
      channels: {},
      components: {
        schemas: {}
      }
    };

    for (const [name, elem] of this.canonicalElements) {
      if (elem.type === 'event') {
        const schema = {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            owner: { type: "string" },
            version: { type: "string" }
          }
        };
        
        asyncAPISpec.components.schemas[name] = schema;
        asyncAPISpec.channels[`${name.toLowerCase()}`] = {
          publish: {
            message: {
              name: name,
              payload: {
                $ref: `#/components/schemas/${name}`
              }
            }
          }
        };
      }
    }

    const filePath = join(asyncAPIDir, 'blueprint-asyncapi.yaml');
    this.writeFile(filePath, JSON.stringify(asyncAPISpec, null, 2));
  }

  /**
   * Generate GraphQL
   */
  generateGraphQL() {
    console.log('Generating GraphQL...');
    const graphqlDir = join(this.outputPath, 'graphql');
    this.ensureDirectory(graphqlDir);
    
    let schema = `# Auto-generated GraphQL schema from Canonical Model\n\n`;
    
    // Generate types
    for (const [name, elem] of this.canonicalElements) {
      schema += `type ${name} {\n`;
      schema += `  id: ID!\n`;
      schema += `  name: String!\n`;
      schema += `  owner: String!\n`;
      schema += `  version: String!\n`;
      schema += `}\n\n`;
    }
    
    // Generate queries
    schema += `type Query {\n`;
    for (const [name, elem] of this.canonicalElements) {
      schema += `  ${this.toCamelCase(name)}(id: ID!): ${name}\n`;
    }
    schema += `}\n\n`;
    
    // Generate mutations
    schema += `type Mutation {\n`;
    for (const [name, elem] of this.canonicalElements) {
      schema += `  create${name}(input: ${name}Input!): ${name}\n`;
      schema += `  update${name}(id: ID!, input: ${name}Update!): ${name}\n`;
      schema += `  delete${name}(id: ID!): Boolean\n`;
    }
    schema += `}\n\n`;
    
    // Generate input types
    for (const [name, elem] of this.canonicalElements) {
      schema += `input ${name}Input {\n`;
      schema += `  name: String!\n`;
      schema += `  owner: String\n`;
      schema += `  version: String\n`;
      schema += `}\n\n`;
      
      schema += `input ${name}Update {\n`;
      schema += `  name: String\n`;
      schema += `  owner: String\n`;
      schema += `  version: String\n`;
      schema += `}\n\n`;
    }

    const filePath = join(graphqlDir, 'blueprint.graphql');
    this.writeFile(filePath, schema);
  }

  /**
   * Generate Mermaid
   */
  generateMermaid() {
    console.log('Generating Mermaid...');
    const mermaidDir = join(this.outputPath, 'mermaid');
    this.ensureDirectory(mermaidDir);
    
    let mermaid = `graph TD\n`;
    mermaid += `    %% Auto-generated Mermaid diagram from Canonical Model\n\n`;
    
    const nodesByLayer = {
      BEA: [],
      BCM: [],
      BSC: [],
      BRM: [],
      COS: [],
      CVM: [],
      CPR: []
    };

    for (const [name, elem] of this.canonicalElements) {
      if (nodesByLayer[elem.layer]) {
        nodesByLayer[elem.layer].push({ name, elem });
      }
    }

    for (const [layer, elements] of Object.entries(nodesByLayer)) {
      mermaid += `    subgraph ${layer}\n`;
      for (const { name, elem } of elements) {
        mermaid += `        ${elem.id}[${name}]\n`;
      }
      mermaid += `    end\n\n`;
    }

    const filePath = join(mermaidDir, 'blueprint-architecture.mmd');
    this.writeFile(filePath, mermaid);
  }

  /**
   * Generate PlantUML
   */
  generatePlantUML() {
    console.log('Generating PlantUML...');
    const plantumlDir = join(this.outputPath, 'plantuml');
    this.ensureDirectory(plantumlDir);
    
    let plantuml = `@startuml BlueprintArchitecture\n`;
    plantuml += `!theme plain\n`;
    plantuml += `skinparam componentStyle rectangle\n\n`;
    plantuml += `title Blueprint V3 Enterprise Architecture\n`;
    plantuml += `note right: Auto-generated from Canonical Model\n\n`;

    for (const [layer, elements] of Object.entries({
      BEA: Array.from(this.canonicalElements.entries()).filter(([n, e]) => e.layer === 'BEA'),
      BCM: Array.from(this.canonicalElements.entries()).filter(([n, e]) => e.layer === 'BCM'),
      COS: Array.from(this.canonicalElements.entries()).filter(([n, e]) => e.layer === 'COS'),
      CVM: Array.from(this.canonicalElements.entries()).filter(([n, e]) => e.layer === 'CVM'),
      CPR: Array.from(this.canonicalElements.entries()).filter(([n, e]) => e.layer === 'CPR')
    })) {
      if (elements.length > 0) {
        plantuml += `package "${layer}" {\n`;
        for (const [name, elem] of elements) {
          plantuml += `  [${name}]\n`;
        }
        plantuml += `}\n\n`;
      }
    }

    plantuml += `@enduml\n`;

    const filePath = join(plantumlDir, 'blueprint-architecture.puml');
    this.writeFile(filePath, plantuml);
  }

  /**
   * Helper: Convert to PascalCase
   */
  toPascalCase(str) {
    if (!str) return '';
    return str.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c.toUpperCase());
  }

  /**
   * Helper: Convert to camelCase
   */
  toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  /**
   * Ensure directory exists
   */
  ensureDirectory(dirPath) {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Write file with checksum
   */
  writeFile(filePath, content) {
    this.ensureDirectory(dirname(filePath));
    
    let contentStr;
    if (typeof content === 'object') {
      contentStr = JSON.stringify(content, null, 2);
    } else {
      contentStr = content;
    }
    
    const checksum = createHash('sha256').update(contentStr).digest('hex');
    
    // Add checksum comment to generated files
    if (typeof content === 'string' && (filePath.endsWith('.ts') || filePath.endsWith('.rs') || filePath.endsWith('.go') || filePath.endsWith('.java') || filePath.endsWith('.kt') || filePath.endsWith('.cs') || filePath.endsWith('.md'))) {
      contentStr = `// Checksum: ${checksum}\n\n${contentStr}`;
    }
    
    writeFileSync(filePath, contentStr, 'utf-8');
    
    this.generatedFiles.set(filePath, {
      checksum,
      generatedAt: new Date().toISOString()
    });
  }

  /**
   * Generate manifest
   */
  generateManifest() {
    const manifest = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalFiles: this.generatedFiles.size,
      canonicalElements: this.canonicalElements.size,
      languages: ['TypeScript', 'Rust', 'Go', 'Java', 'Kotlin', 'C#', 'JSON Schema', 'YAML', 'Markdown', 'OpenAPI', 'AsyncAPI', 'GraphQL', 'Mermaid', 'PlantUML'],
      files: Array.from(this.generatedFiles.entries()).map(([path, meta]) => ({
        path,
        checksum: meta.checksum,
        generatedAt: meta.generatedAt
      }))
    };

    const manifestPath = join(this.outputPath, 'MULTI_LANG_MANIFEST.json');
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    
    console.log(`Manifest saved to ${manifestPath}`);
    return manifest;
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const canonicalModelPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[4] || join(rootPath, 'BLUEPRINT_MULTI_LANG_GENERATED');
  
  const generator = new MultiLanguageGenerator(canonicalModelPath, outputPath);

  console.log('Starting Multi-Language Generation...');
  generator.generateAll();

  console.log('Generating manifest...');
  const manifest = generator.generateManifest();

  console.log('\n=== GENERATION SUMMARY ===');
  console.log(`Canonical Elements: ${generator.canonicalElements.size}`);
  console.log(`Generated Files: ${generator.generatedFiles.size}`);
  console.log(`Languages: ${manifest.languages.join(', ')}`);
  console.log(`Output Path: ${outputPath}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MultiLanguageGenerator };
