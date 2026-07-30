#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Canonical Symbol Table Builder
 * 
 * Phase 2: Build global symbol table with CanonicalID, Owner, Namespace, Version, Layer, Dependencies, Relations, Lifecycle, Runtime, Source, GeneratedFiles, Aliases, Checksums
 */

const { readFileSync, createWriteStream } = require('fs');
const { join } = require('path');
const { createHash } = require('crypto');

class Symbol {
  constructor(name, type, source) {
    this.canonicalID = this.generateCanonicalID(name, type);
    this.name = name;
    this.type = type;
    this.owner = null;
    this.namespace = this.extractNamespace(source);
    this.version = '1.0.0';
    this.layer = this.extractLayer(source);
    this.dependencies = new Set();
    this.relations = new Set();
    this.lifecycle = 'active';
    this.runtime = null;
    this.source = source;
    this.generatedFiles = new Set();
    this.aliases = new Set();
    this.checksum = null;
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
  }

  generateCanonicalID(name, type) {
    const typePrefix = {
      'object': 'OBJ',
      'interface': 'IFC',
      'class': 'CLS',
      'function': 'FN',
      'contract': 'CTR',
      'event': 'EVT',
      'state': 'ST',
      'graph': 'GR',
      'algorithm': 'ALG',
      'variable': 'VAR',
      'section': 'SEC',
      'json': 'JSON',
      'yaml': 'YAML',
      'struct': 'STR',
      'enum': 'ENM',
      'type': 'TYP',
      'method': 'MTH',
      'input': 'INP'
    }[type] || 'UNK';

    const nameHash = createHash('md5').update(name).digest('hex').substring(0, 8).toUpperCase();
    return `BLUEPRINT-${typePrefix}-${nameHash}`;
  }

  extractNamespace(source) {
    // Extract namespace from file path
    const parts = source.split(/\\/);
    
    // Look for layer directories
    const layerIndex = parts.findIndex(p => 
      ['BEA', 'BCM', 'BSC', 'BRM', 'COS', 'CVM', 'CPR', 'contracts', 'domain', 'types'].includes(p)
    );
    
    if (layerIndex >= 0 && layerIndex + 1 < parts.length) {
      return parts.slice(layerIndex, layerIndex + 3).join('.');
    }
    
    return 'global';
  }

  extractLayer(source) {
    const parts = source.split(/\\/);
    
    for (const part of parts) {
      if (['BEA', 'BCM', 'BSC', 'BRM', 'COS', 'CVM', 'CPR'].includes(part)) {
        return part;
      }
    }
    
    if (source.includes('contracts')) {
      return 'CONTRACTS';
    }
    
    if (source.includes('domain')) {
      return 'DOMAIN';
    }
    
    if (source.includes('types')) {
      return 'TYPES';
    }
    
    return 'UNKNOWN';
  }

  addDependency(symbolID) {
    this.dependencies.add(symbolID);
  }

  addRelation(relation, targetID) {
    this.relations.add(`${relation}:${targetID}`);
  }

  addGeneratedFile(filePath) {
    this.generatedFiles.add(filePath);
  }

  addAlias(alias) {
    this.aliases.add(alias);
  }

  calculateChecksum() {
    const data = JSON.stringify({
      name: this.name,
      type: this.type,
      owner: this.owner,
      namespace: this.namespace,
      version: this.version,
      layer: this.layer
    });
    this.checksum = createHash('sha256').update(data).digest('hex');
  }

  toJSON() {
    return {
      canonicalID: this.canonicalID,
      name: this.name,
      type: this.type,
      owner: this.owner,
      namespace: this.namespace,
      version: this.version,
      layer: this.layer,
      dependencies: Array.from(this.dependencies),
      relations: Array.from(this.relations),
      lifecycle: this.lifecycle,
      runtime: this.runtime,
      source: this.source,
      generatedFiles: Array.from(this.generatedFiles),
      aliases: Array.from(this.aliases),
      checksum: this.checksum,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

class CanonicalSymbolTableBuilder {
  constructor(astPath, canonicalModelPath) {
    this.astPath = astPath;
    this.canonicalModelPath = canonicalModelPath;
    this.symbolTable = new Map();
    this.canonicalElements = new Map();
    
    this.loadCanonicalElements();
  }

  /**
   * Load canonical elements from canonical model
   */
  loadCanonicalElements() {
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
        let owner = null;
        
        for (let j = 0; j < parts.length; j++) {
          if (idPattern.test(parts[j])) {
            id = parts[j];
            if (j + 1 < parts.length && parts[j + 1]) {
              name = parts[j + 1];
            }
            if (j + 4 < parts.length) {
              owner = parts[j + 4];
            }
            break;
          }
        }
        
        if (id && name && owner) {
          this.canonicalElements.set(name, {
            id,
            owner
          });
        }
        continue;
      }
      
      if (!line.match(/^\|/)) {
        inTable = false;
      }
    }
  }

  /**
   * Build symbol table from AST
   */
  build() {
    console.log('Loading AST...');
    const astData = JSON.parse(readFileSync(this.astPath, 'utf-8'));
    
    console.log(`Processing ${astData.nodes.length} AST nodes...`);
    
    for (const node of astData.nodes) {
      const key = `${node.type}:${node.name}`;
      
      if (this.symbolTable.has(key)) {
        // Update existing symbol
        const symbol = this.symbolTable.get(key);
        symbol.source = node.source;
        symbol.updatedAt = new Date().toISOString();
      } else {
        // Create new symbol
        const symbol = new Symbol(node.name, node.type, node.source);
        
        // Apply canonical owner if available
        if (this.canonicalElements.has(node.name)) {
          const canonical = this.canonicalElements.get(node.name);
          symbol.owner = canonical.owner;
          symbol.canonicalID = canonical.id;
        }
        
        // Apply properties from node metadata
        if (node.metadata) {
          if (node.metadata.owner) {
            symbol.owner = node.metadata.owner;
          }
          if (node.metadata.version) {
            symbol.version = node.metadata.version;
          }
        }
        
        symbol.calculateChecksum();
        this.symbolTable.set(key, symbol);
      }
    }

    console.log(`Built symbol table with ${this.symbolTable.size} symbols`);
    return this.symbolTable;
  }

  /**
   * Build dependency graph from symbol table
   */
  buildDependencies() {
    console.log('Building dependency graph...');
    
    // Analyze symbol names to infer dependencies
    for (const [key, symbol] of this.symbolTable) {
      // Look for references to other symbols in generated files
      for (const file of symbol.generatedFiles) {
        for (const [otherKey, otherSymbol] of this.symbolTable) {
          if (key !== otherKey) {
            // Check if symbol name appears in file
            if (file.includes(otherSymbol.name)) {
              symbol.addDependency(otherSymbol.canonicalID);
            }
          }
        }
      }
    }
  }

  /**
   * Build relations from symbol table
   */
  buildRelations() {
    console.log('Building relations...');
    
    // Infer relations based on types and namespaces
    for (const [key, symbol] of this.symbolTable) {
      // Interface implementation relations
      if (symbol.type === 'class') {
        for (const [otherKey, otherSymbol] of this.symbolTable) {
          if (otherSymbol.type === 'interface' && symbol.name.includes(otherSymbol.name)) {
            symbol.addRelation('implements', otherSymbol.canonicalID);
          }
        }
      }
      
      // Extension relations
      if (symbol.type === 'class' || symbol.type === 'interface') {
        for (const [otherKey, otherSymbol] of this.symbolTable) {
          if (symbol.name.includes(otherSymbol.name) && symbol.name !== otherSymbol.name) {
            symbol.addRelation('extends', otherSymbol.canonicalID);
          }
        }
      }
    }
  }

  /**
   * Export symbol table to JSON
   */
  async exportSymbolTable(outputPath) {
    const stream = createWriteStream(outputPath);
    
    stream.write('{\n');
    stream.write('  "metadata": {\n');
    stream.write(`    "totalSymbols": ${this.symbolTable.size},\n`);
    stream.write(`    "generatedAt": "${new Date().toISOString()}"\n`);
    stream.write('  },\n');
    stream.write('  "symbols": [\n');
    
    let first = true;
    for (const [key, symbol] of this.symbolTable) {
      if (!first) {
        stream.write(',\n');
      }
      first = false;
      stream.write('    ' + JSON.stringify(symbol.toJSON()));
    }
    
    stream.write('\n  ]\n');
    stream.write('}\n');
    stream.end();
    
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    
    console.log(`Symbol table saved to ${outputPath}`);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const stats = {
      totalSymbols: this.symbolTable.size,
      byType: {},
      byLayer: {},
      byOwner: {},
      withDependencies: 0,
      withRelations: 0,
      withGeneratedFiles: 0,
      withAliases: 0
    };

    for (const [key, symbol] of this.symbolTable) {
      // By type
      if (!stats.byType[symbol.type]) {
        stats.byType[symbol.type] = 0;
      }
      stats.byType[symbol.type]++;
      
      // By layer
      if (!stats.byLayer[symbol.layer]) {
        stats.byLayer[symbol.layer] = 0;
      }
      stats.byLayer[symbol.layer]++;
      
      // By owner
      if (symbol.owner) {
        if (!stats.byOwner[symbol.owner]) {
          stats.byOwner[symbol.owner] = 0;
        }
        stats.byOwner[symbol.owner]++;
      }
      
      // With dependencies
      if (symbol.dependencies.size > 0) {
        stats.withDependencies++;
      }
      
      // With relations
      if (symbol.relations.size > 0) {
        stats.withRelations++;
      }
      
      // With generated files
      if (symbol.generatedFiles.size > 0) {
        stats.withGeneratedFiles++;
      }
      
      // With aliases
      if (symbol.aliases.size > 0) {
        stats.withAliases++;
      }
    }

    return stats;
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const astPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CANONICAL_AST.json');
  const canonicalModelPath = process.argv[4] || join(rootPath, 'BLUEPRINT_CANONICAL_MODEL.md');
  const outputPath = process.argv[5] || join(rootPath, 'BLUEPRINT_SYMBOL_TABLE.json');
  
  const builder = new CanonicalSymbolTableBuilder(astPath, canonicalModelPath);

  console.log('Building Canonical Symbol Table...');
  builder.build();
  
  console.log('Building dependencies...');
  builder.buildDependencies();
  
  console.log('Building relations...');
  builder.buildRelations();

  console.log('Exporting symbol table...');
  await builder.exportSymbolTable(outputPath);

  console.log('\n=== SYMBOL TABLE STATISTICS ===');
  const stats = builder.getStatistics();
  console.log(`Total Symbols: ${stats.totalSymbols}`);
  console.log('\nBy Type:');
  for (const [type, count] of Object.entries(stats.byType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('\nBy Layer:');
  for (const [layer, count] of Object.entries(stats.byLayer)) {
    console.log(`  ${layer}: ${count}`);
  }
  console.log('\nBy Owner:');
  for (const [owner, count] of Object.entries(stats.byOwner)) {
    console.log(`  ${owner}: ${count}`);
  }
  console.log(`\nWith Dependencies: ${stats.withDependencies}`);
  console.log(`With Relations: ${stats.withRelations}`);
  console.log(`With Generated Files: ${stats.withGeneratedFiles}`);
  console.log(`With Aliases: ${stats.withAliases}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CanonicalSymbolTableBuilder, Symbol };
