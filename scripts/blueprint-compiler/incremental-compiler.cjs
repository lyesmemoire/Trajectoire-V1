#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Incremental Compiler
 * 
 * Phase 9: Incremental compiler recompiling only impacted contracts
 */

const { readFileSync, writeFileSync, statSync, existsSync } = require('fs');
const { join } = require('path');
const { createHash } = require('crypto');

class IncrementalCompiler {
  constructor(canonicalModelPath, symbolTablePath, outputPath) {
    this.canonicalModelPath = canonicalModelPath;
    this.symbolTablePath = symbolTablePath;
    this.outputPath = outputPath;
    this.canonicalElements = new Map();
    this.symbolTable = null;
    this.buildCache = new Map();
    this.impactedSymbols = new Set();
    this.recompiledFiles = new Map();
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
        
        for (let j = 0; j < parts.length; j++) {
          if (idPattern.test(parts[j])) {
            id = parts[j];
            if (j + 1 < parts.length && parts[j + 1]) {
              name = parts[j + 1];
            }
            break;
          }
        }
        
        if (id && name) {
          this.canonicalElements.set(name, { id, name });
        }
        continue;
      }
      
      if (!line.match(/^\|/)) {
        inTable = false;
      }
    }
    
    console.log(`Loaded ${this.canonicalElements.size} canonical elements`);
  }

  /**
   * Load symbol table
   */
  loadSymbolTable() {
    const data = JSON.parse(readFileSync(this.symbolTablePath, 'utf-8'));
    this.symbolTable = new Map(data.symbols.map(s => [s.canonicalID, s]));
    console.log(`Loaded ${this.symbolTable.size} symbols`);
  }

  /**
   * Load build cache
   */
  loadBuildCache() {
    const cachePath = join(this.outputPath, '.build-cache.json');
    
    if (existsSync(cachePath)) {
      const data = JSON.parse(readFileSync(cachePath, 'utf-8'));
      this.buildCache = new Map(Object.entries(data));
      console.log(`Loaded build cache with ${this.buildCache.size} entries`);
    } else {
      console.log('No build cache found, starting fresh');
    }
  }

  /**
   * Save build cache
   */
  saveBuildCache() {
    const cachePath = join(this.outputPath, '.build-cache.json');
    const cacheData = Object.fromEntries(this.buildCache);
    writeFileSync(cachePath, JSON.stringify(cacheData, null, 2), 'utf-8');
    console.log(`Build cache saved to ${cachePath}`);
  }

  /**
   * Calculate file checksum
   */
  calculateChecksum(filePath) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      return createHash('sha256').update(content).digest('hex');
    } catch (e) {
      return null;
    }
  }

  /**
   * Detect changed files
   */
  detectChangedFiles() {
    console.log('Detecting changed files...');
    
    const changedFiles = new Set();

    for (const [name, elem] of this.canonicalElements) {
      const canonicalChecksum = this.calculateChecksum(this.canonicalModelPath);
      const cachedChecksum = this.buildCache.get(name);

      if (!cachedChecksum || cachedChecksum.checksum !== canonicalChecksum) {
        changedFiles.add(name);
        console.log(`  Changed: ${name}`);
      }
    }

    console.log(`Found ${changedFiles.size} changed files`);
    return changedFiles;
  }

  /**
   * Calculate impact graph
   */
  calculateImpact(changedFiles) {
    console.log('Calculating impact graph...');
    
    const impacted = new Set();

    for (const changedFile of changedFiles) {
      // Find symbol for changed file
      for (const [id, symbol] of this.symbolTable) {
        if (symbol.name === changedFile) {
          impacted.add(id);
          
          // Add all dependents
          this.addDependents(id, impacted);
        }
      }
    }

    console.log(`Impacted ${impacted.size} symbols`);
    this.impactedSymbols = impacted;
    return impacted;
  }

  /**
   * Recursively add dependents
   */
  addDependents(symbolId, impacted) {
    for (const [id, symbol] of this.symbolTable) {
      if (symbol.dependencies.includes(symbolId)) {
        if (!impacted.has(id)) {
          impacted.add(id);
          this.addDependents(id, impacted);
        }
      }
    }
  }

  /**
   * Recompile impacted symbols
   */
  recompileImpacted() {
    console.log('Recompiling impacted symbols...');
    
    let recompiledCount = 0;

    for (const symbolId of this.impactedSymbols) {
      const symbol = this.symbolTable.get(symbolId);
      if (!symbol) {
        continue;
      }

      // Generate all artifacts for this symbol
      this.generateTypeScript(symbol);
      this.generateRust(symbol);
      this.generateGo(symbol);
      this.generateJava(symbol);
      this.generateKotlin(symbol);
      this.generateCSharp(symbol);
      this.generateJSONSchema(symbol);
      this.generateYAML(symbol);
      this.generateMarkdown(symbol);

      // Update build cache
      this.buildCache.set(symbol.name, {
        checksum: this.calculateChecksum(this.canonicalModelPath),
        timestamp: new Date().toISOString()
      });

      recompiledCount++;
    }

    console.log(`Recompiled ${recompiledCount} symbols`);
    return recompiledCount;
  }

  /**
   * Generate TypeScript
   */
  generateTypeScript(symbol) {
    const content = `// Canonical Reference: ${symbol.canonicalID}
// Owner: ${symbol.owner}
// UUID: ${symbol.uuid}
// Layer: ${symbol.layer}
// Type: ${symbol.type}

export interface ${symbol.name} {
  id: string;
  name: string;
  owner: string;
  version: string;
  [key: string]: any;
}

/*
 * This file is auto-generated by the Blueprint Incremental Compiler.
 * Do not edit manually. All changes will be overwritten.
 */
`;

    const filePath = join(this.outputPath, 'typescript', `${symbol.name}.ts`);
    this.writeFile(filePath, content);
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'TypeScript' });
  }

  /**
   * Generate Rust
   */
  generateRust(symbol) {
    const content = `// Canonical Reference: ${symbol.canonicalID}
// Owner: ${symbol.owner}

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ${this.toPascalCase(symbol.name)} {
    pub id: String,
    pub name: String,
    pub owner: String,
    pub version: String,
}

/*
 * This file is auto-generated by the Blueprint Incremental Compiler.
 */
`;

    const filePath = join(this.outputPath, 'rust', `${this.toPascalCase(symbol.name)}.rs`);
    this.writeFile(filePath, content);
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'Rust' });
  }

  /**
   * Generate Go
   */
  generateGo(symbol) {
    const content = `// Canonical Reference: ${symbol.canonicalID}
// Owner: ${symbol.owner}

package blueprint

type ${this.toPascalCase(symbol.name)} struct {
    ID      string \`json:"id"\`
    Name    string \`json:"name"\`
    Owner   string \`json:"owner"\`
    Version string \`json:"version"\`
}

/*
 * This file is auto-generated by the Blueprint Incremental Compiler.
 */
`;

    const filePath = join(this.outputPath, 'go', `${this.toPascalCase(symbol.name)}.go`);
    this.writeFile(filePath, content);
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'Go' });
  }

  /**
   * Generate Java
   */
  generateJava(symbol) {
    const content = `// Canonical Reference: ${symbol.canonicalID}
// Owner: ${symbol.owner}

package com.blueprint.${symbol.layer.toLowerCase()};

public class ${this.toPascalCase(symbol.name)} {
    private String id;
    private String name;
    private String owner;
    private String version;

    public ${this.toPascalCase(symbol.name)}() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
}

/*
 * This file is auto-generated by the Blueprint Incremental Compiler.
 */
`;

    const filePath = join(this.outputPath, 'java', `${this.toPascalCase(symbol.name)}.java`);
    this.writeFile(filePath, content);
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'Java' });
  }

  /**
   * Generate Kotlin
   */
  generateKotlin(symbol) {
    const content = `// Canonical Reference: ${symbol.canonicalID}
// Owner: ${symbol.owner}

package com.blueprint.${symbol.layer.toLowerCase()}

data class ${this.toPascalCase(symbol.name)}(
    val id: String,
    val name: String,
    val owner: String,
    val version: String
)

/*
 * This file is auto-generated by the Blueprint Incremental Compiler.
 */
`;

    const filePath = join(this.outputPath, 'kotlin', `${this.toPascalCase(symbol.name)}.kt`);
    this.writeFile(filePath, content);
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'Kotlin' });
  }

  /**
   * Generate C#
   */
  generateCSharp(symbol) {
    const content = `// Canonical Reference: ${symbol.canonicalID}
// Owner: ${symbol.owner}

using System;

namespace Blueprint.${symbol.layer}
{
    public class ${this.toPascalCase(symbol.name)}
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string Version { get; set; }
    }
}

/*
 * This file is auto-generated by the Blueprint Incremental Compiler.
 */
`;

    const filePath = join(this.outputPath, 'csharp', `${this.toPascalCase(symbol.name)}.cs`);
    this.writeFile(filePath, content);
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'C#' });
  }

  /**
   * Generate JSON Schema
   */
  generateJSONSchema(symbol) {
    const content = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: `https://blueprint.enterprise/schemas/${symbol.canonicalID}.json`,
      title: symbol.name,
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        owner: { type: "string" },
        version: { type: "string" }
      },
      required: ["id", "name", "owner"],
      _metadata: {
        canonicalId: symbol.canonicalID,
        owner: symbol.owner,
        layer: symbol.layer,
        generatedBy: "Blueprint Incremental Compiler"
      }
    };

    const filePath = join(this.outputPath, 'json-schema', `${symbol.name}.schema.json`);
    this.writeFile(filePath, JSON.stringify(content, null, 2));
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'JSON Schema' });
  }

  /**
   * Generate YAML
   */
  generateYAML(symbol) {
    const content = `# Canonical Reference: ${symbol.canonicalID}
# Owner: ${symbol.owner}

id: ${symbol.canonicalID}
name: ${symbol.name}
owner: ${symbol.owner}
version: "1.0.0"

# This file is auto-generated by the Blueprint Incremental Compiler.
`;

    const filePath = join(this.outputPath, 'yaml', `${symbol.name}.yaml`);
    this.writeFile(filePath, content);
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'YAML' });
  }

  /**
   * Generate Markdown
   */
  generateMarkdown(symbol) {
    const content = `# ${symbol.name}

**Canonical ID**: ${symbol.canonicalID}  
**Owner**: ${symbol.owner}  
**Layer**: ${symbol.layer}  
**Type**: ${symbol.type}

## Definition

This object is part of the Blueprint V3 Enterprise canonical model.

---
*This file is auto-generated by the Blueprint Incremental Compiler.*
`;

    const filePath = join(this.outputPath, 'markdown', `${symbol.name}.md`);
    this.writeFile(filePath, content);
    this.recompiledFiles.set(filePath, { symbolId: symbol.canonicalID, language: 'Markdown' });
  }

  /**
   * Helper: Convert to PascalCase
   */
  toPascalCase(str) {
    if (!str) return '';
    return str.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c.toUpperCase());
  }

  /**
   * Write file
   */
  writeFile(filePath, content) {
    const { mkdirSync } = require('fs');
    const { dirname } = require('path');
    
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Run incremental compilation
   */
  compile() {
    console.log('Starting Incremental Compilation...\n');

    this.loadCanonicalModel();
    this.loadSymbolTable();
    this.loadBuildCache();

    // Detect changed files
    const changedFiles = this.detectChangedFiles();

    if (changedFiles.size === 0) {
      console.log('\nNo changes detected, skipping compilation');
      return {
        changedFiles: 0,
        impactedSymbols: 0,
        recompiledFiles: 0
      };
    }

    // Calculate impact
    this.calculateImpact(changedFiles);

    // Recompile impacted symbols
    const recompiledCount = this.recompileImpacted();

    // Save build cache
    this.saveBuildCache();

    console.log('\n=== INCREMENTAL COMPILATION SUMMARY ===');
    console.log(`Changed Files: ${changedFiles.size}`);
    console.log(`Impacted Symbols: ${this.impactedSymbols.size}`);
    console.log(`Recompiled Files: ${this.recompiledFiles.size}`);

    return {
      changedFiles: changedFiles.size,
      impactedSymbols: this.impactedSymbols.size,
      recompiledFiles: this.recompiledFiles.size,
      recompiledFilesList: Array.from(this.recompiledFiles.entries())
    };
  }

  /**
   * Generate report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        changedFiles: 0,
        impactedSymbols: this.impactedSymbols.size,
        recompiledFiles: this.recompiledFiles.size
      },
      impactedSymbols: Array.from(this.impactedSymbols),
      recompiledFiles: Array.from(this.recompiledFiles.entries())
    };

    return report;
  }

  /**
   * Save report
   */
  saveReport(outputPath) {
    const report = this.generateReport();
    const reportJson = JSON.stringify(report, null, 2);
    writeFileSync(outputPath, reportJson, 'utf-8');
    console.log(`Incremental compilation report saved to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const canonicalModelPath = process.argv[3] || join(rootPath, 'BLUEPRINT_CANONICAL_MODEL.md');
  const symbolTablePath = process.argv[4] || join(rootPath, 'BLUEPRINT_SYMBOL_TABLE.json');
  const outputPath = process.argv[5] || join(rootPath, 'BLUEPRINT_INCREMENTAL_GENERATED');
  const reportPath = process.argv[6] || join(rootPath, 'BLUEPRINT_INCREMENTAL_COMPILATION_REPORT.json');
  
  const compiler = new IncrementalCompiler(canonicalModelPath, symbolTablePath, outputPath);

  const result = compiler.compile();

  console.log('\nGenerating report...');
  compiler.saveReport(reportPath);

  if (result.changedFiles > 0) {
    console.log('\n✅ INCREMENTAL COMPILATION COMPLETED - Changes processed');
  } else {
    console.log('\n✅ INCREMENTAL COMPILATION SKIPPED - No changes');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { IncrementalCompiler };
