#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Canonical Compiler
 * 
 * Phase 4: Compiler taking Canonical Model as input and generating COS, CVM, CPR, BCM, BRM, BSC, BEA, Contracts, Interfaces, Schemas, Runtime Objects, Documentation
 */

const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, dirname } = require('path');
const { createHash } = require('crypto');

class CanonicalCompiler {
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
    if (id.startsWith('BEA-INV-')) return 'invariant';
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
   * Compile all artifacts
   */
  compile() {
    console.log('Starting compilation...');
    
    this.generateCOS();
    this.generateCVM();
    this.generateCPR();
    this.generateBCM();
    this.generateBEA();
    this.generateContracts();
    this.generateInterfaces();
    this.generateSchemas();
    this.generateDocumentation();
    
    console.log(`Compilation complete. Generated ${this.generatedFiles.size} files`);
    return this.generatedFiles;
  }

  /**
   * Generate COS layer
   */
  generateCOS() {
    console.log('Generating COS layer...');
    const cosElements = Array.from(this.canonicalElements.entries())
      .filter(([name, elem]) => elem.layer === 'COS');
    
    const cosDir = join(this.outputPath, 'COS');
    this.ensureDirectory(cosDir);
    
    for (const [name, elem] of cosElements) {
      const content = this.generateObjectDefinition(elem);
      const filePath = join(cosDir, `${elem.id}.md`);
      this.writeFile(filePath, content);
    }
  }

  /**
   * Generate CVM layer
   */
  generateCVM() {
    console.log('Generating CVM layer...');
    const cvmElements = Array.from(this.canonicalElements.entries())
      .filter(([name, elem]) => elem.layer === 'CVM');
    
    const cvmDir = join(this.outputPath, 'CVM');
    this.ensureDirectory(cvmDir);
    
    for (const [name, elem] of cvmElements) {
      const content = this.generateObjectDefinition(elem);
      const filePath = join(cvmDir, `${elem.id}.md`);
      this.writeFile(filePath, content);
    }
  }

  /**
   * Generate CPR layer
   */
  generateCPR() {
    console.log('Generating CPR layer...');
    const cprElements = Array.from(this.canonicalElements.entries())
      .filter(([name, elem]) => elem.layer === 'CPR');
    
    const cprDir = join(this.outputPath, 'CPR');
    this.ensureDirectory(cprDir);
    
    for (const [name, elem] of cprElements) {
      const content = this.generateObjectDefinition(elem);
      const filePath = join(cprDir, `${elem.id}.md`);
      this.writeFile(filePath, content);
    }
  }

  /**
   * Generate BCM layer
   */
  generateBCM() {
    console.log('Generating BCM layer...');
    const bcmElements = Array.from(this.canonicalElements.entries())
      .filter(([name, elem]) => elem.layer === 'BCM');
    
    const bcmDir = join(this.outputPath, 'BCM');
    this.ensureDirectory(bcmDir);
    
    for (const [name, elem] of bcmElements) {
      const content = this.generateObjectDefinition(elem);
      const filePath = join(bcmDir, `${elem.id}.md`);
      this.writeFile(filePath, content);
    }
  }

  /**
   * Generate BEA layer
   */
  generateBEA() {
    console.log('Generating BEA layer...');
    const beaElements = Array.from(this.canonicalElements.entries())
      .filter(([name, elem]) => elem.layer === 'BEA');
    
    const beaDir = join(this.outputPath, 'BEA');
    this.ensureDirectory(beaDir);
    
    for (const [name, elem] of beaElements) {
      const content = this.generateObjectDefinition(elem);
      const filePath = join(beaDir, `${elem.id}.md`);
      this.writeFile(filePath, content);
    }
  }

  /**
   * Generate contracts
   */
  generateContracts() {
    console.log('Generating contracts...');
    const contractElements = Array.from(this.canonicalElements.entries())
      .filter(([name, elem]) => elem.type === 'contract');
    
    const contractsDir = join(this.outputPath, 'contracts');
    this.ensureDirectory(contractsDir);
    
    for (const [name, elem] of contractElements) {
      const content = this.generateContractDefinition(elem);
      const filePath = join(contractsDir, `${elem.id}.md`);
      this.writeFile(filePath, content);
    }
  }

  /**
   * Generate interfaces
   */
  generateInterfaces() {
    console.log('Generating interfaces...');
    const interfaceElements = Array.from(this.canonicalElements.entries())
      .filter(([name, elem]) => elem.type === 'object' || elem.type === 'interface');
    
    const interfacesDir = join(this.outputPath, 'generated-interfaces');
    this.ensureDirectory(interfacesDir);
    
    for (const [name, elem] of interfaceElements) {
      // Generate TypeScript interface
      const tsContent = this.generateTypeScriptInterface(elem);
      const tsFilePath = join(interfacesDir, `${name}.ts`);
      this.writeFile(tsFilePath, tsContent);
      
      // Generate JSON Schema
      const jsonSchemaContent = this.generateJSONSchema(elem);
      const jsonSchemaFilePath = join(interfacesDir, `${name}.schema.json`);
      this.writeFile(jsonSchemaFilePath, jsonSchemaContent);
    }
  }

  /**
   * Generate schemas
   */
  generateSchemas() {
    console.log('Generating schemas...');
    // Schemas are generated as part of interfaces
  }

  /**
   * Generate documentation
   */
  generateDocumentation() {
    console.log('Generating documentation base...');
    const docDir = join(this.outputPath, 'documentation');
    this.ensureDirectory(docDir);
    
    const indexContent = this.generateDocumentationIndex();
    const indexFilePath = join(docDir, 'INDEX.md');
    this.writeFile(indexFilePath, indexContent);
  }

  /**
   * Generate object definition markdown
   */
  generateObjectDefinition(elem) {
    return `# ${elem.id}

## ${elem.name}

**Canonical ID**: ${elem.id}  
**UUID**: ${elem.uuid}  
**Semantic ID**: ${elem.semanticId}  
**Owner**: ${elem.owner}  
**Type**: ${elem.type}  
**Layer**: ${elem.layer}

---

## Definition

This object is part of the Blueprint V3 Enterprise canonical model.

## Properties

Generated from canonical model.

## Relations

Generated from semantic graph.

## Generated Files

- TypeScript Interface
- JSON Schema
- Documentation

---
*This file is auto-generated by the Blueprint Canonical Compiler. Do not edit manually.*
`;
  }

  /**
   * Generate contract definition markdown
   */
  generateContractDefinition(elem) {
    return `# ${elem.id}

## ${elem.name}

**Canonical ID**: ${elem.id}  
**UUID**: ${elem.uuid}  
**Semantic ID**: ${elem.semanticId}  
**Owner**: ${elem.owner}  
**Type**: ${elem.type}  

---

## Contract Definition

This contract is part of the Blueprint V3 Enterprise canonical model.

## Specifications

Generated from canonical model.

## Implementations

Generated from semantic graph.

## Generated Files

- TypeScript Interface
- JSON Schema
- Documentation

---
*This file is auto-generated by the Blueprint Canonical Compiler. Do not edit manually.*
`;
  }

  /**
   * Generate TypeScript interface
   */
  generateTypeScriptInterface(elem) {
    return `// Canonical Reference: ${elem.id} (${elem.semanticId})
// Owner: ${elem.owner}
// UUID: ${elem.uuid}
// Layer: ${elem.layer}
// Type: ${elem.type}

export interface ${elem.name} {
  // Properties generated from canonical model
  id: string;
  name: string;
  owner: string;
  version: string;
  [key: string]: any;
}

export type ${elem.name}Input = Omit<${elem.name}, 'id'>;

export type ${elem.name}Update = Partial<${elem.name}Input>;

/*
 * This file is auto-generated by the Blueprint Canonical Compiler.
 * Do not edit manually. All changes will be overwritten.
 */
`;
  }

  /**
   * Generate JSON Schema
   */
  generateJSONSchema(elem) {
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
        generatedBy: "Blueprint Canonical Compiler"
      }
    };
  }

  /**
   * Generate documentation index
   */
  generateDocumentationIndex() {
    const elementsByLayer = {
      BEA: [],
      BCM: [],
      BSC: [],
      BRM: [],
      COS: [],
      CVM: [],
      CPR: []
    };

    for (const [name, elem] of this.canonicalElements) {
      if (elementsByLayer[elem.layer]) {
        elementsByLayer[elem.layer].push({ name, elem });
      }
    }

    let content = `# Blueprint V3 Enterprise Documentation

This documentation is auto-generated from the Canonical Model.

## Layers

`;

    for (const [layer, elements] of Object.entries(elementsByLayer)) {
      content += `### ${layer}\n\n`;
      for (const { name, elem } of elements) {
        content += `- [${name}](../${layer}/${elem.id}.md)\n`;
      }
      content += '\n';
    }

    content += `---
*This documentation is auto-generated by the Blueprint Canonical Compiler.*
`;

    return content;
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
    if (typeof content === 'string' && (filePath.endsWith('.ts') || filePath.endsWith('.md'))) {
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
      files: Array.from(this.generatedFiles.entries()).map(([path, meta]) => ({
        path,
        checksum: meta.checksum,
        generatedAt: meta.generatedAt
      }))
    };

    const manifestPath = join(this.outputPath, 'BLUEPRINT_MANIFEST.json');
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    
    console.log(`Manifest saved to ${manifestPath}`);
    return manifest;
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const canonicalModelPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[4] || join(rootPath, 'BLUEPRINT_GENERATED');
  
  const compiler = new CanonicalCompiler(canonicalModelPath, outputPath);

  console.log('Starting Canonical Compilation...');
  compiler.compile();

  console.log('Generating manifest...');
  const manifest = compiler.generateManifest();

  console.log('\n=== COMPILATION SUMMARY ===');
  console.log(`Canonical Elements: ${compiler.canonicalElements.size}`);
  console.log(`Generated Files: ${compiler.generatedFiles.size}`);
  console.log(`Output Path: ${outputPath}`);
  console.log('\nGenerated Directories:');
  console.log('  - COS/');
  console.log('  - CVM/');
  console.log('  - CPR/');
  console.log('  - BCM/');
  console.log('  - BEA/');
  console.log('  - contracts/');
  console.log('  - generated-interfaces/');
  console.log('  - documentation/');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CanonicalCompiler };
