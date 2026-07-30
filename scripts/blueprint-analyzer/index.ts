#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Architecture Analyzer
 * 
 * Phase 1: Complete validation - Scan, parse, analyze, index, build document AST
 */

import {  readFileSync, readdirSync, statSync  } from 'fs';
import {  join, extname  } from 'path';

interface DocumentElement {
  type: 'object' | 'interface' | 'contract' | 'event' | 'state' | 'graph' | 'rule' | 'invariant' | 'guarantee' | 'metric' | 'budget' | 'identifier' | 'algorithm';
  name: string;
  id?: string;
  uuid?: string;
  semanticId?: string;
  owner?: string;
  version?: string;
  location: string;
  lineNumber: number;
  definition: string;
  references: string[];
}

interface DocumentAST {
  filePath: string;
  type: 'markdown' | 'typescript' | 'tsx';
  elements: DocumentElement[];
  references: string[];
  imports: string[];
  exports: string[];
}

interface GlobalIndex {
  documents: Map<string, DocumentAST>;
  elements: Map<string, DocumentElement[]>;
  byType: Map<string, DocumentElement[]>;
  byOwner: Map<string, DocumentElement[]>;
  byLocation: Map<string, DocumentElement[]>;
}

class BlueprintAnalyzer {
  private rootPath: string;
  private globalIndex: GlobalIndex;

  constructor(rootPath: string) {
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
  async scan(): Promise<string[]> {
    const files: string[] = [];
    const extensions = ['.md', '.ts', '.tsx'];

    const scanDirectory = (dir: string) => {
      const entries = readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules, .git, etc.
          if (!entry.startsWith('.') && entry !== 'node_modules' && entry !== 'dist' && entry !== 'build') {
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
  parseDocument(filePath: string): DocumentAST {
    const content = readFileSync(filePath, 'utf-8');
    const ext = extname(filePath);
    
    const ast: DocumentAST = {
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
  private parseMarkdown(content: string, ast: DocumentAST): void {
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

      // Detect object definitions
      const objectMatch = line.match(/^###?\s*(\w+)\s*[:=]\s*(.+)/);
      if (objectMatch) {
        const [, type, definition] = objectMatch;
        ast.elements.push({
          type: this.mapType(type),
          name: this.extractName(definition),
          location: ast.filePath,
          lineNumber: i + 1,
          definition: definition.trim(),
          references: this.extractReferences(definition)
        });
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
          references: this.extractReferences(line)
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
  private parseTypeScript(content: string, ast: DocumentAST): void {
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
  private mapType(type: string): DocumentElement['type'] {
    const typeMap: Record<string, DocumentElement['type']> = {
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
  private extractName(definition: string): string {
    const match = definition.match(/^(\w+)/);
    return match ? match[1] : definition;
  }

  /**
   * Extract references from line
   */
  private extractReferences(line: string): string[] {
    const references: string[] = [];
    
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

    return references;
  }

  /**
   * Build global index from parsed documents
   */
  buildIndex(documents: DocumentAST[]): GlobalIndex {
    for (const doc of documents) {
      this.globalIndex.documents.set(doc.filePath, doc);

      for (const element of doc.elements) {
        // Index by name
        if (!this.globalIndex.elements.has(element.name)) {
          this.globalIndex.elements.set(element.name, []);
        }
        this.globalIndex.elements.get(element.name)!.push(element);

        // Index by type
        if (!this.globalIndex.byType.has(element.type)) {
          this.globalIndex.byType.set(element.type, []);
        }
        this.globalIndex.byType.get(element.type)!.push(element);

        // Index by owner
        if (element.owner) {
          if (!this.globalIndex.byOwner.has(element.owner)) {
            this.globalIndex.byOwner.set(element.owner, []);
          }
          this.globalIndex.byOwner.get(element.owner)!.push(element);
        }

        // Index by location
        if (!this.globalIndex.byLocation.has(element.location)) {
          this.globalIndex.byLocation.set(element.location, []);
        }
        this.globalIndex.byLocation.get(element.location)!.push(element);
      }
    }

    return this.globalIndex;
  }

  /**
   * Get statistics
   */
  getStatistics(): Record<string, unknown> {
    const stats: Record<string, unknown> = {
      totalDocuments: this.globalIndex.documents.size,
      totalElements: 0,
      byType: {} as Record<string, number>,
      byOwner: {} as Record<string, number>
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
   * Export index to JSON
   */
  exportIndex(): string {
    const exportData = {
      statistics: this.getStatistics(),
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
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
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

  console.log('Exporting index...');
  const indexJson = analyzer.exportIndex();
  console.log(indexJson);
}

if (require.main === module) {
  main().catch(console.error);
}

export { BlueprintAnalyzer, DocumentElement, DocumentAST, GlobalIndex };
