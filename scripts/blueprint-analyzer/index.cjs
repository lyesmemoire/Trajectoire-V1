#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Architecture Analyzer
 * 
 * Phase 1: Complete validation - Scan, parse, analyze, index, build document AST
 */

const { readFileSync, readdirSync, statSync, writeFileSync } = require('fs');
const { join, extname } = require('path');

class BlueprintAnalyzer {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.globalIndex = {
      documents: new Map(),
      elements: new Map(),
      byType: new Map(),
      byOwner: new Map(),
      byLocation: new Map()
    };
  }

  /**
   * Scan all files in the repository
   */
  async scan() {
    const files = [];
    const extensions = ['.md', '.ts', '.tsx'];

    const scanDirectory = (dir) => {
      const entries = readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules, .git, etc.
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
   * Parse a document and extract elements
   */
  parseDocument(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const ext = extname(filePath);
    
    const ast = {
      filePath,
      type: ext === '.md' ? 'markdown' : ext === '.ts' ? 'typescript' : 'tsx',
      elements: [],
      references: [],
      imports: [],
      exports: []
    };

    if (ext === '.md') {
      this.parseMarkdown(content, ast);
    } else {
      this.parseTypeScript(content, ast);
    }

    return ast;
  }

  /**
   * Parse markdown document
   */
  parseMarkdown(content, ast) {
    const lines = content.split('\n');
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
        continue;
      }

      // Detect object definitions (various patterns)
      const patterns = [
        { regex: /^###?\s*(\w+)\s*[:=]\s*(.+)/, type: 'object' },
        { regex: /^\*\*(\w+)\*\*\s*[:=]\s*(.+)/, type: 'object' },
        { regex: /^-\s*\*\*(\w+)\*\*:\s*(.+)/, type: 'object' }
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern.regex);
        if (match) {
          const [, typeName, definition] = match;
          ast.elements.push({
            type: this.mapType(typeName),
            name: this.extractName(definition),
            location: ast.filePath,
            lineNumber: i + 1,
            definition: definition.trim(),
            references: this.extractReferences(definition),
            section: currentSection
          });
          break;
        }
      }

      // Detect interface definitions
      const interfaceMatch = line.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        ast.elements.push({
          type: 'interface',
          name: interfaceMatch[1],
          location: ast.filePath,
          lineNumber: i + 1,
          definition: line.trim(),
          references: this.extractReferences(line),
          section: currentSection
        });
      }

      // Detect contract references
      const contractMatch = line.match(/Contract:\s*(\S+)/);
      if (contractMatch) {
        ast.references.push(contractMatch[1]);
      }

      // Detect ID patterns
      const idMatch = line.match(/ID:\s*(\S+)/);
      if (idMatch) {
        const lastElement = ast.elements[ast.elements.length - 1];
        if (lastElement) {
          lastElement.id = idMatch[1];
        }
      }

      // Detect UUID patterns
      const uuidMatch = line.match(/UUID:\s*([0-9a-f-]{36})/i);
      if (uuidMatch) {
        const lastElement = ast.elements[ast.elements.length - 1];
        if (lastElement) {
          lastElement.uuid = uuidMatch[1];
        }
      }

      // Detect semantic ID patterns
      const semanticIdMatch = line.match(/Semantic ID:\s*(\S+)/);
      if (semanticIdMatch) {
        const lastElement = ast.elements[ast.elements.length - 1];
        if (lastElement) {
          lastElement.semanticId = semanticIdMatch[1];
        }
      }

      // Detect owner patterns
      const ownerMatch = line.match(/Owner:\s*(.+)/);
      if (ownerMatch) {
        const lastElement = ast.elements[ast.elements.length - 1];
        if (lastElement) {
          lastElement.owner = ownerMatch[1].trim();
        }
      }

      // Detect version patterns
      const versionMatch = line.match(/Version:\s*(\S+)/);
      if (versionMatch) {
        const lastElement = ast.elements[ast.elements.length - 1];
        if (lastElement) {
          lastElement.version = versionMatch[1];
        }
      }
    }
  }

  /**
   * Parse TypeScript document
   */
  parseTypeScript(content, ast) {
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect interface definitions
      const interfaceMatch = line.match(/export\s+(?:interface|type)\s+(\w+)/);
      if (interfaceMatch) {
        ast.elements.push({
          type: 'interface',
          name: interfaceMatch[1],
          location: ast.filePath,
          lineNumber: i + 1,
          definition: line.trim(),
          references: this.extractReferences(line)
        });
      }

      // Detect class definitions
      const classMatch = line.match(/export\s+class\s+(\w+)/);
      if (classMatch) {
        ast.elements.push({
          type: 'object',
          name: classMatch[1],
          location: ast.filePath,
          lineNumber: i + 1,
          definition: line.trim(),
          references: this.extractReferences(line)
        });
      }

      // Detect imports
      const importMatch = line.match(/import\s+.*from\s+['"](.+)['"]/);
      if (importMatch) {
        ast.imports.push(importMatch[1]);
      }

      // Detect exports
      const exportMatch = line.match(/export\s+(?:default\s+)?\w+/);
      if (exportMatch) {
        ast.exports.push(line.trim());
      }
    }
  }

  /**
   * Map type string to element type
   */
  mapType(type) {
    const typeMap = {
      'Object': 'object',
      'Interface': 'interface',
      'Contract': 'contract',
      'Event': 'event',
      'State': 'state',
      'Graph': 'graph',
      'Rule': 'rule',
      'Invariant': 'invariant',
      'Guarantee': 'guarantee',
      'Metric': 'metric',
      'Budget': 'budget',
      'Identifier': 'identifier',
      'Algorithm': 'algorithm'
    };
    return typeMap[type] || 'object';
  }

  /**
   * Extract name from definition
   */
  extractName(definition) {
    const match = definition.match(/^(\w+)/);
    return match ? match[1] : definition;
  }

  /**
   * Extract references from line
   */
  extractReferences(line) {
    const references = [];
    
    // Extract file references
    const fileRefs = line.match(/[\w-]+\.md/g);
    if (fileRefs) {
      references.push(...fileRefs);
    }

    // Extract contract references
    const contractRefs = line.match(/[A-Z]+-CONTRACT-\d+/g);
    if (contractRefs) {
      references.push(...contractRefs);
    }

    // Extract ID references
    const idRefs = line.match(/[A-Z]+-OBJ-\d+/g);
    if (idRefs) {
      references.push(...idRefs);
    }

    // Extract BCM references
    const bcmRefs = line.match(/BCM-\d+/g);
    if (bcmRefs) {
      references.push(...bcmRefs);
    }

    return references;
  }

  /**
   * Build global index from parsed documents
   */
  buildIndex(documents) {
    for (const doc of documents) {
      this.globalIndex.documents.set(doc.filePath, doc);

      for (const element of doc.elements) {
        // Index by name
        if (!this.globalIndex.elements.has(element.name)) {
          this.globalIndex.elements.set(element.name, []);
        }
        this.globalIndex.elements.get(element.name).push(element);

        // Index by type
        if (!this.globalIndex.byType.has(element.type)) {
          this.globalIndex.byType.set(element.type, []);
        }
        this.globalIndex.byType.get(element.type).push(element);

        // Index by owner
        if (element.owner) {
          if (!this.globalIndex.byOwner.has(element.owner)) {
            this.globalIndex.byOwner.set(element.owner, []);
          }
          this.globalIndex.byOwner.get(element.owner).push(element);
        }

        // Index by location
        if (!this.globalIndex.byLocation.has(element.location)) {
          this.globalIndex.byLocation.set(element.location, []);
        }
        this.globalIndex.byLocation.get(element.location).push(element);
      }
    }

    return this.globalIndex;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const stats = {
      totalDocuments: this.globalIndex.documents.size,
      totalElements: 0,
      byType: {},
      byOwner: {}
    };

    for (const [type, elements] of this.globalIndex.byType) {
      stats.byType[type] = elements.length;
      stats.totalElements += elements.length;
    }

    for (const [owner, elements] of this.globalIndex.byOwner) {
      stats.byOwner[owner] = elements.length;
    }

    return stats;
  }

  /**
   * Find duplications
   */
  findDuplications() {
    const duplications = [];

    for (const [name, elements] of this.globalIndex.elements) {
      if (elements.length > 1) {
        duplications.push({
          name,
          count: elements.length,
          locations: elements.map(e => ({
            type: e.type,
            location: e.location,
            lineNumber: e.lineNumber,
            owner: e.owner,
            id: e.id,
            uuid: e.uuid,
            semanticId: e.semanticId
          }))
        });
      }
    }

    return duplications;
  }

  /**
   * Export index to JSON
   */
  exportIndex() {
    const exportData = {
      statistics: this.getStatistics(),
      duplications: this.findDuplications(),
      elements: Array.from(this.globalIndex.elements.entries()).map(([name, elements]) => ({
        name,
        count: elements.length,
        locations: elements.map(e => ({
          type: e.type,
          location: e.location,
          lineNumber: e.lineNumber,
          owner: e.owner,
          id: e.id,
          uuid: e.uuid,
          semanticId: e.semanticId
        }))
      })),
      byType: Array.from(this.globalIndex.byType.entries()).map(([type, elements]) => ({
        type,
        count: elements.length,
        elements: elements.map(e => ({
          name: e.name,
          location: e.location,
          lineNumber: e.lineNumber,
          owner: e.owner
        }))
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Save index to file
   */
  saveIndex(outputPath) {
    const indexJson = this.exportIndex();
    writeFileSync(outputPath, indexJson, 'utf-8');
    console.log(`Index saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const outputPath = process.argv[3] || join(rootPath, 'BLUEPRINT_ANALYSIS_INDEX.json');
  
  const analyzer = new BlueprintAnalyzer(rootPath);

  console.log('Scanning repository...');
  const files = await analyzer.scan();
  console.log(`Found ${files.length} files`);

  console.log('Parsing documents...');
  const documents = files.map(file => analyzer.parseDocument(file));
  console.log(`Parsed ${documents.length} documents`);

  console.log('Building index...');
  analyzer.buildIndex(documents);

  console.log('Statistics:');
  const stats = analyzer.getStatistics();
  console.log(JSON.stringify(stats, null, 2));

  console.log('Finding duplications...');
  const duplications = analyzer.findDuplications();
  console.log(`Found ${duplications.length} duplications`);

  console.log('Saving index...');
  analyzer.saveIndex(outputPath);

  console.log('\n=== DUPLICATIONS ===');
  for (const dup of duplications) {
    console.log(`\n${dup.name} (${dup.count} occurrences):`);
    for (const loc of dup.locations) {
      console.log(`  - ${loc.location}:${loc.lineNumber} (${loc.type}, owner: ${loc.owner || 'N/A'})`);
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BlueprintAnalyzer };
