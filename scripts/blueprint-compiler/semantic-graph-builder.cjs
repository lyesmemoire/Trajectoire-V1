#!/usr/bin/env node

/**
 * Blueprint V3 Enterprise Semantic Graph Builder
 * 
 * Phase 3: Build global semantic graph with nodes and edges
 * Nodes: Objects, Contracts, Events, States, Graphs, Algorithms, Interfaces
 * Edges: owns, extends, depends_on, implements, publishes, subscribes, executes, creates, updates, invalidates, uses, references
 */

const { readFileSync, createWriteStream } = require('fs');
const { join } = require('path');

class GraphNode {
  constructor(id, type, name, metadata = {}) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.metadata = metadata;
    this.inEdges = new Map(); // edgeType -> Set of source node IDs
    this.outEdges = new Map(); // edgeType -> Set of target node IDs
  }

  addInEdge(edgeType, sourceId) {
    if (!this.inEdges.has(edgeType)) {
      this.inEdges.set(edgeType, new Set());
    }
    this.inEdges.get(edgeType).add(sourceId);
  }

  addOutEdge(edgeType, targetId) {
    if (!this.outEdges.has(edgeType)) {
      this.outEdges.set(edgeType, new Set());
    }
    this.outEdges.get(edgeType).add(targetId);
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      metadata: this.metadata,
      inEdges: Object.fromEntries(
        Array.from(this.inEdges.entries()).map(([k, v]) => [k, Array.from(v)])
      ),
      outEdges: Object.fromEntries(
        Array.from(this.outEdges.entries()).map(([k, v]) => [k, Array.from(v)])
      )
    };
  }
}

class SemanticGraphBuilder {
  constructor(symbolTablePath) {
    this.symbolTablePath = symbolTablePath;
    this.nodes = new Map();
    this.edges = new Map();
    
    this.nodeTypes = {
      'object': 'object',
      'contract': 'contract',
      'event': 'event',
      'state': 'state',
      'graph': 'graph',
      'algorithm': 'algorithm',
      'interface': 'interface',
      'class': 'object',
      'function': 'algorithm',
      'struct': 'object',
      'enum': 'object',
      'type': 'object'
    };
    
    this.edgeTypes = [
      'owns',
      'extends',
      'depends_on',
      'implements',
      'publishes',
      'subscribes',
      'executes',
      'creates',
      'updates',
      'invalidates',
      'uses',
      'references'
    ];
  }

  /**
   * Load symbol table
   */
  loadSymbolTable() {
    const data = JSON.parse(readFileSync(this.symbolTablePath, 'utf-8'));
    return data.symbols;
  }

  /**
   * Build semantic graph from symbol table (memory-optimized)
   */
  build() {
    console.log('Loading symbol table...');
    const symbols = this.loadSymbolTable();
    
    console.log(`Processing ${symbols.length} symbols...`);
    
    // Process in batches to reduce memory pressure
    const batchSize = 1000;
    let processed = 0;
    
    // Create nodes from symbols
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      
      for (const symbol of batch) {
        const nodeType = this.nodeTypes[symbol.type] || symbol.type;
        
        if (!this.nodes.has(symbol.canonicalID)) {
          const node = new GraphNode(
            symbol.canonicalID,
            nodeType,
            symbol.name,
            {
              owner: symbol.owner,
              namespace: symbol.namespace,
              version: symbol.version,
              layer: symbol.layer,
              source: symbol.source
            }
          );
          this.nodes.set(symbol.canonicalID, node);
        }
      }
      
      processed += batch.length;
      if (processed % 5000 === 0) {
        console.log(`Processed ${processed}/${symbols.length} symbols for nodes...`);
      }
    }

    console.log(`Created ${this.nodes.size} nodes`);

    // Build edges from symbol relations (also in batches)
    processed = 0;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      
      for (const symbol of batch) {
        const sourceId = symbol.canonicalID;
        
        // Parse relations
        for (const relation of symbol.relations) {
          const [edgeType, targetId] = relation.split(':');
          
          if (this.edgeTypes.includes(edgeType) && this.nodes.has(targetId)) {
            this.addEdge(sourceId, targetId, edgeType);
          }
        }
        
        // Build edges from dependencies (limit to first 100 per symbol to reduce edges)
        for (let j = 0; j < Math.min(symbol.dependencies.length, 100); j++) {
          const depId = symbol.dependencies[j];
          if (this.nodes.has(depId)) {
            this.addEdge(sourceId, depId, 'depends_on');
          }
        }
      }
      
      processed += batch.length;
      if (processed % 5000 === 0) {
        console.log(`Processed ${processed}/${symbols.length} symbols for edges...`);
      }
    }

    console.log(`Built ${this.edges.size} edges`);
    return { nodes: this.nodes, edges: this.edges };
  }

  /**
   * Add edge to graph
   */
  addEdge(sourceId, targetId, edgeType) {
    const edgeKey = `${sourceId}:${targetId}:${edgeType}`;
    
    if (!this.edges.has(edgeKey)) {
      this.edges.set(edgeKey, {
        source: sourceId,
        target: targetId,
        type: edgeType
      });
      
      // Update node edge sets
      if (this.nodes.has(sourceId)) {
        this.nodes.get(sourceId).addOutEdge(edgeType, targetId);
      }
      if (this.nodes.has(targetId)) {
        this.nodes.get(targetId).addInEdge(edgeType, sourceId);
      }
    }
  }

  /**
   * Detect cycles using DFS
   */
  detectCycles() {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];

    const dfs = (nodeId, path) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        const cycle = path.slice(cycleStart).concat([nodeId]);
        cycles.push(cycle);
        return;
      }

      if (visited.has(nodeId)) {
        return;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const node = this.nodes.get(nodeId);
      if (node) {
        for (const [edgeType, targets] of node.outEdges) {
          if (edgeType === 'depends_on' || edgeType === 'extends') {
            for (const targetId of targets) {
              dfs(targetId, [...path, nodeId]);
            }
          }
        }
      }

      recursionStack.delete(nodeId);
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId, []);
      }
    }

    return cycles;
  }

  /**
   * Calculate graph statistics
   */
  getStatistics() {
    const stats = {
      totalNodes: this.nodes.size,
      totalEdges: this.edges.size,
      nodesByType: {},
      edgesByType: {},
      nodesByLayer: {},
      cycles: this.detectCycles().length
    };

    for (const [id, node] of this.nodes) {
      // By type
      if (!stats.nodesByType[node.type]) {
        stats.nodesByType[node.type] = 0;
      }
      stats.nodesByType[node.type]++;
      
      // By layer
      const layer = node.metadata.layer || 'UNKNOWN';
      if (!stats.nodesByLayer[layer]) {
        stats.nodesByLayer[layer] = 0;
      }
      stats.nodesByLayer[layer]++;
    }

    for (const [key, edge] of this.edges) {
      if (!stats.edgesByType[edge.type]) {
        stats.edgesByType[edge.type] = 0;
      }
      stats.edgesByType[edge.type]++;
    }

    return stats;
  }

  /**
   * Export semantic graph to JSON
   */
  async exportGraph(outputPath) {
    const stream = createWriteStream(outputPath);
    
    stream.write('{\n');
    stream.write('  "metadata": {\n');
    stream.write(`    "totalNodes": ${this.nodes.size},\n`);
    stream.write(`    "totalEdges": ${this.edges.size},\n`);
    stream.write(`    "generatedAt": "${new Date().toISOString()}"\n`);
    stream.write('  },\n');
    stream.write('  "nodes": [\n');
    
    let first = true;
    for (const [id, node] of this.nodes) {
      if (!first) {
        stream.write(',\n');
      }
      first = false;
      stream.write('    ' + JSON.stringify(node.toJSON()));
    }
    
    stream.write('\n  ],\n');
    stream.write('  "edges": [\n');
    
    first = true;
    for (const [key, edge] of this.edges) {
      if (!first) {
        stream.write(',\n');
      }
      first = false;
      stream.write('    ' + JSON.stringify(edge));
    }
    
    stream.write('\n  ]\n');
    stream.write('}\n');
    stream.end();
    
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    
    console.log(`Semantic graph saved to ${outputPath}`);
  }

  /**
   * Export graph to Graphviz DOT format
   */
  async exportDOT(outputPath) {
    const stream = createWriteStream(outputPath);
    
    stream.write('digraph BlueprintSemanticGraph {\n');
    stream.write('  rankdir=LR;\n');
    stream.write('  node [shape=box];\n\n');
    
    // Write nodes with type-based colors
    const typeColors = {
      'object': 'lightblue',
      'contract': 'lightgreen',
      'event': 'orange',
      'state': 'yellow',
      'graph': 'purple',
      'algorithm': 'pink',
      'interface': 'cyan'
    };
    
    for (const [id, node] of this.nodes) {
      const color = typeColors[node.type] || 'white';
      stream.write(`  "${id}" [label="${node.name}", fillcolor="${color}", style=filled];\n`);
    }
    
    stream.write('\n');
    
    // Write edges
    for (const [key, edge] of this.edges) {
      stream.write(`  "${edge.source}" -> "${edge.target}" [label="${edge.type}"];\n`);
    }
    
    stream.write('}\n');
    stream.end();
    
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    
    console.log(`Graph exported to ${outputPath}`);
  }
}

// Main execution
async function main() {
  const rootPath = process.argv[2] || process.cwd();
  const symbolTablePath = process.argv[3] || join(rootPath, 'BLUEPRINT_SYMBOL_TABLE.json');
  const outputPath = process.argv[4] || join(rootPath, 'BLUEPRINT_SEMANTIC_GRAPH.json');
  const dotPath = process.argv[5] || join(rootPath, 'BLUEPRINT_SEMANTIC_GRAPH.dot');
  
  const builder = new SemanticGraphBuilder(symbolTablePath);

  console.log('Building Semantic Graph...');
  builder.build();

  console.log('Detecting cycles...');
  const cycles = builder.detectCycles();
  console.log(`Found ${cycles.length} cycles`);

  console.log('Exporting graph...');
  await builder.exportGraph(outputPath);

  console.log('Exporting DOT...');
  await builder.exportDOT(dotPath);

  console.log('\n=== SEMANTIC GRAPH STATISTICS ===');
  const stats = builder.getStatistics();
  console.log(`Total Nodes: ${stats.totalNodes}`);
  console.log(`Total Edges: ${stats.totalEdges}`);
  console.log(`Cycles: ${stats.cycles}`);
  console.log('\nNodes By Type:');
  for (const [type, count] of Object.entries(stats.nodesByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('\nEdges By Type:');
  for (const [type, count] of Object.entries(stats.edgesByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('\nNodes By Layer:');
  for (const [layer, count] of Object.entries(stats.nodesByLayer)) {
    console.log(`  ${layer}: ${count}`);
  }

  if (cycles.length > 0) {
    console.log('\n=== CYCLES DETECTED ===');
    for (const cycle of cycles.slice(0, 5)) {
      console.log(`Cycle: ${cycle.join(' -> ')}`);
    }
    if (cycles.length > 5) {
      console.log(`... and ${cycles.length - 5} more`);
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SemanticGraphBuilder, GraphNode };
