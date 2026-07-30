#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Canonical AST Builder
 * 
 * Phase 1: Build global AST from multiple languages
 * Supports: Markdown, YAML, JSON, TypeScript, Rust, Go, Java, Kotlin, C#, OpenAPI, AsyncAPI, GraphQL, JSON Schema
 */

const { readFileSync, readdirSync, statSync } = require('fs');
const { join, extname } = require('path');

class ASTNode {
  constructor(type, name, source, metadata = {}) {
    this.type = type;
    this.name = name;
    this.source = source;
    this.metadata = metadata;
    this.children = [];
    this.properties = new Map();
    this.references = [];
    this.checksum = null;
  }

  addChild(node) {
    this.children.push(node);
  }

  addProperty(key, value) {
    this.properties.set(key, value);
  }

  addReference(ref) {
    this.references.push(ref);
  }

  toJSON() {
    return {
      type: this.type,
      name: this.name,
      source: this.source,
      metadata: this.metadata,
      children: this.children.map(c => c.toJSON()),
      properties: Object.fromEntries(this.properties),
      references: this.references,
      checksum: this.checksum
    };
  }
}

class CanonicalASTBuilder {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.ast = new Map();
    this.parsers = {
      '.md': this.parseMarkdown.bind(this),
      '.yaml': this.parseYAML.bind(this),
      '.yml': this.parseYAML.bind(this),
      '.json': this.parseJSON.bind(this),
      '.ts': this.parseTypeScript.bind(this),
      '.tsx': this.parseTypeScript.bind(this),
      '.rs': this.parseRust.bind(this),
      '.go': this.parseGo.bind(this),
      '.java': this.parseJava.bind(this),
      '.kt': this.parseKotlin.bind(this),
      '.cs': this.parseCSharp.bind(this),
      '.graphql': this.parseGraphQL.bind(this),
      '.gql': this.parseGraphQL.bind(this)
    };
  }

  /**
   * Scan all files
   */
  scan() {
    const files = [];
    const extensions = Object.keys(this.parsers);

    const scanDirectory = (dir) => {
      const entries = readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!entry.startsWith('.') && entry !== 'node_modules' && entry !== 'dist' && entry !== 'build' && entry !== '.next') {
            scanDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = extname(fullPath);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    };

    scanDirectory(this.rootPath);
    return files;
  }

  /**
   * Build AST from all files
   */
  build() {
    const files = this.scan();
    console.log(`Found ${files.length} files to parse`);

    for (const file of files) {
      const ext = extname(file);
      const parser = this.parsers[ext];
      
      if (parser) {
        try {
          const nodes = parser(file);
          for (const node of nodes) {
            const key = `${node.type}:${node.name}`;
            if (this.ast.has(key)) {
              this.ast.get(key).addChild(node);
            } else {
              this.ast.set(key, node);
            }
          }
        } catch (e) {
          console.error(`Error parsing ${file}: ${e.message}`);
        }
      }
    }

    console.log(`Built AST with ${this.ast.size} unique nodes`);
    return this.ast;
  }

  /**
   * Parse Markdown
   */
  parseMarkdown(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const nodes = [];
    let currentSection = '';
    let inCodeBlock = false;
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          codeBlockLanguage = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        continue;
      }

      // Detect headers
      if (line.startsWith('#')) {
        currentSection = line.replace(/^#+\s*/, '').trim();
        const node = new ASTNode('section', currentSection, filePath, {
          lineNumber: i + 1,
          level: line.match(/^#+/)[0].length
        });
        nodes.push(node);
        continue;
      }

      // Detect object definitions
      const objectMatch = line.match(/^###?\s*\*\*(\w+)\*\*\s*[:=]\s*(.+)/);
      if (objectMatch) {
        const [, name, definition] = objectMatch;
        const node = new ASTNode('object', name, filePath, {
          lineNumber: i + 1,
          definition: definition.trim(),
          section: currentSection
        });
        nodes.push(node);
      }

      // Detect interface definitions
      const interfaceMatch = line.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        const node = new ASTNode('interface', interfaceMatch[1], filePath, {
          lineNumber: i + 1,
          section: currentSection
        });
        nodes.push(node);
      }

      // Detect contract references
      const contractMatch = line.match(/Contract:\s*(\S+)/);
      if (contractMatch) {
        const node = new ASTNode('contract', contractMatch[1], filePath, {
          lineNumber: i + 1,
          section: currentSection
        });
        nodes.push(node);
      }

      // Detect ID patterns
      const idMatch = line.match(/ID:\s*(\S+)/);
      if (idMatch) {
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          lastNode.addProperty('id', idMatch[1]);
        }
      }

      // Detect UUID patterns
      const uuidMatch = line.match(/UUID:\s*([0-9a-f-]{36})/i);
      if (uuidMatch) {
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          lastNode.addProperty('uuid', uuidMatch[1]);
        }
      }

      // Detect semantic ID patterns
      const semanticIdMatch = line.match(/Semantic ID:\s*(\S+)/);
      if (semanticIdMatch) {
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          lastNode.addProperty('semanticId', semanticIdMatch[1]);
        }
      }

      // Detect owner patterns
      const ownerMatch = line.match(/Owner:\s*(.+)/);
      if (ownerMatch) {
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          lastNode.addProperty('owner', ownerMatch[1].trim());
        }
      }

      // Detect version patterns
      const versionMatch = line.match(/Version:\s*(\S+)/);
      if (versionMatch) {
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          lastNode.addProperty('version', versionMatch[1]);
        }
      }
    }

    return nodes;
  }

  /**
   * Parse YAML
   */
  parseYAML(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const nodes = [];
    
    // Simple YAML parser - extract top-level keys
    const lines = content.split('\n');
    let currentKey = null;
    let currentValue = [];
    
    for (const line of lines) {
      if (line.match(/^[a-zA-Z_][a-zA-Z0-9_]*:/)) {
        if (currentKey) {
          const node = new ASTNode('yaml', currentKey, filePath, {
            value: currentValue.join('\n')
          });
          nodes.push(node);
        }
        currentKey = line.split(':')[0];
        currentValue = [];
      } else if (currentKey && line.trim()) {
        currentValue.push(line);
      }
    }
    
    if (currentKey) {
      const node = new ASTNode('yaml', currentKey, filePath, {
        value: currentValue.join('\n')
      });
      nodes.push(node);
    }
    
    return nodes;
  }

  /**
   * Parse JSON
   */
  parseJSON(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const nodes = [];
    
    try {
      const json = JSON.parse(content);
      const traverse = (obj, prefix = '') => {
        if (typeof obj === 'object' && obj !== null) {
          for (const key of Object.keys(obj)) {
            const value = obj[key];
            const node = new ASTNode('json', key, filePath, {
              path: prefix ? `${prefix}.${key}` : key,
              type: typeof value
            });
            nodes.push(node);
            
            if (typeof value === 'object' && value !== null) {
              traverse(value, prefix ? `${prefix}.${key}` : key);
            }
          }
        }
      };
      
      traverse(json);
    } catch (e) {
      console.error(`Error parsing JSON ${filePath}: ${e.message}`);
    }
    
    return nodes;
  }

  /**
   * Parse TypeScript
   */
  parseTypeScript(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const nodes = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect interface definitions
      const interfaceMatch = line.match(/export\s+(?:interface|type)\s+(\w+)/);
      if (interfaceMatch) {
        const node = new ASTNode('interface', interfaceMatch[1], filePath, {
          lineNumber: i + 1,
          kind: line.includes('interface') ? 'interface' : 'type'
        });
        nodes.push(node);
      }
      
      // Detect class definitions
      const classMatch = line.match(/export\s+class\s+(\w+)/);
      if (classMatch) {
        const node = new ASTNode('class', classMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect function definitions
      const functionMatch = line.match(/export\s+(?:async\s+)?function\s+(\w+)/);
      if (functionMatch) {
        const node = new ASTNode('function', functionMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect const definitions
      const constMatch = line.match(/export\s+(?:const|let|var)\s+(\w+)/);
      if (constMatch) {
        const node = new ASTNode('variable', constMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  /**
   * Parse Rust (stub)
   */
  parseRust(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const nodes = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect struct definitions
      const structMatch = line.match(/pub\s+struct\s+(\w+)/);
      if (structMatch) {
        const node = new ASTNode('struct', structMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect enum definitions
      const enumMatch = line.match(/pub\s+enum\s+(\w+)/);
      if (enumMatch) {
        const node = new ASTNode('enum', enumMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect function definitions
      const functionMatch = line.match(/pub\s+fn\s+(\w+)/);
      if (functionMatch) {
        const node = new ASTNode('function', functionMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  /**
   * Parse Go (stub)
   */
  parseGo(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const nodes = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect struct definitions
      const structMatch = line.match(/type\s+(\w+)\s+struct/);
      if (structMatch) {
        const node = new ASTNode('struct', structMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect interface definitions
      const interfaceMatch = line.match(/type\s+(\w+)\s+interface/);
      if (interfaceMatch) {
        const node = new ASTNode('interface', interfaceMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect function definitions
      const functionMatch = line.match(/func\s+(\w+)/);
      if (functionMatch) {
        const node = new ASTNode('function', functionMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  /**
   * Parse Java (stub)
   */
  parseJava(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const nodes = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect class definitions
      const classMatch = line.match(/public\s+class\s+(\w+)/);
      if (classMatch) {
        const node = new ASTNode('class', classMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect interface definitions
      const interfaceMatch = line.match(/public\s+interface\s+(\w+)/);
      if (interfaceMatch) {
        const node = new ASTNode('interface', interfaceMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect method definitions
      const methodMatch = line.match(/public\s+\w+\s+(\w+)\s*\(/);
      if (methodMatch) {
        const node = new ASTNode('method', methodMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  /**
   * Parse Kotlin (stub)
   */
  parseKotlin(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const nodes = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect class definitions
      const classMatch = line.match(/class\s+(\w+)/);
      if (classMatch) {
        const node = new ASTNode('class', classMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect interface definitions
      const interfaceMatch = line.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        const node = new ASTNode('interface', interfaceMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect function definitions
      const functionMatch = line.match(/fun\s+(\w+)/);
      if (functionMatch) {
        const node = new ASTNode('function', functionMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  /**
   * Parse C# (stub)
   */
  parseCSharp(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const nodes = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect class definitions
      const classMatch = line.match(/public\s+class\s+(\w+)/);
      if (classMatch) {
        const node = new ASTNode('class', classMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect interface definitions
      const interfaceMatch = line.match(/public\s+interface\s+(\w+)/);
      if (interfaceMatch) {
        const node = new ASTNode('interface', interfaceMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect method definitions
      const methodMatch = line.match(/public\s+\w+\s+(\w+)\s*\(/);
      if (methodMatch) {
        const node = new ASTNode('method', methodMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  /**
   * Parse GraphQL (stub)
   */
  parseGraphQL(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const nodes = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect type definitions
      const typeMatch = line.match(/type\s+(\w+)/);
      if (typeMatch) {
        const node = new ASTNode('type', typeMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect interface definitions
      const interfaceMatch = line.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        const node = new ASTNode('interface', interfaceMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
      
      // Detect input definitions
      const inputMatch = line.match(/input\s+(\w+)/);
      if (inputMatch) {
        const node = new ASTNode('input', inputMatch[1], filePath, {
          lineNumber: i + 1
        });
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  /**
   * Export AST to JSON (streaming for large ASTs)
   */
  exportAST(outputPath) {
    const { createWriteStream } = require('fs');
    const stream = createWriteStream(outputPath);
    
    stream.write('{\n');
    stream.write('  "metadata": {\n');
    stream.write(`    "totalNodes": ${this.ast.size},\n`);
    stream.write(`    "generatedAt": "${new Date().toISOString()}"\n`);
    stream.write('  },\n');
    stream.write('  "nodes": [\n');
    
    let first = true;
    for (const [key, node] of this.ast.entries()) {
      if (!first) {
        stream.write(',\n');
      }
      first = false;
      stream.write('    ' + JSON.stringify(node.toJSON()));
    }
    
    stream.write('\n  ]\n');
    stream.write('}\n');
    stream.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  /**
   * Save AST to file
   */
  async saveAST(outputPath) {
    const { createWriteStream } = require('fs');
    const stream = createWriteStream(outputPath);
    
    stream.write('{\n');
    stream.write('  "metadata": {\n');
    stream.write(`    "totalNodes": ${this.ast.size},\n`);
    stream.write(`    "generatedAt": "${new Date().toISOString()}"\n`);
    stream.write('  },\n');
    stream.write('  "nodes": [\n');
    
    let first = true;
    for (const [key, node] of this.ast.entries()) {
      if (!first) {
        stream.write(',\n');
      }
      first = false;
      stream.write('    ' + JSON.stringify(node.toJSON()));
    }
    
    stream.write('\n  ]\n');
    stream.write('}\n');
    stream.end();
    
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    
    console.log(`AST saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CANONICAL_AST.json');
  
  const builder = new CanonicalASTBuilder(rootPath);

  console.log('Building Canonical AST...');
  builder.build();

  console.log('Exporting AST...');
  builder.saveAST(outputPath);

  console.log('\n=== AST STATISTICS ===');
  const stats = {
    byType: {}
  };

  for (const [key, node] of builder.ast) {
    if (!stats.byType[node.type]) {
      stats.byType[node.type] = 0;
    }
    stats.byType[node.type]++;
  }

  console.log(`Total Nodes: ${builder.ast.size}`);
  console.log('\nBy Type:');
  for (const [type, count] of Object.entries(stats.byType)) {
    console.log(`  ${type}: ${count}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CanonicalASTBuilder, ASTNode };
