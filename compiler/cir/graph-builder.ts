/**
 * Blueprint DSL IR Graph Builder
 * 
 * Builds graph representations of IR for visualization.
 */

import { IRModule, IRFunction, IRBasicBlock } from './ir-generator';
import { ControlFlowGraph } from './cfg-builder';

export interface GraphNode {
  id: string;
  label: string;
  shape: string;
  color: string;
  style: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  color: string;
  style: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
}

export interface GraphMetadata {
  name: string;
  type: string;
  version: string;
}

export class GraphBuilder {
  /**
   * Build a graph from a CFG
   */
  public buildCFGGraph(cfg: ControlFlowGraph, name: string): Graph {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    for (const [nodeId, node] of cfg.nodes) {
      const graphNode: GraphNode = {
        id: nodeId,
        label: this.formatBlockLabel(node),
        shape: node.isEntry ? 'box' : node.isExit ? 'box' : 'ellipse',
        color: node.isEntry ? '#00ff00' : node.isExit ? '#ff0000' : '#0000ff',
        style: 'filled',
      };
      nodes.push(graphNode);
    }

    for (const edge of cfg.edges) {
      const graphEdge: GraphEdge = {
        from: edge.from,
        to: edge.to,
        label: edge.condition,
        color: edge.type === 'conditional' ? '#ff8800' : '#000000',
        style: edge.type === 'conditional' ? 'dashed' : 'solid',
      };
      edges.push(graphEdge);
    }

    return {
      nodes,
      edges,
      metadata: {
        name,
        type: 'CFG',
        version: '1.0',
      },
    };
  }

  /**
   * Build a graph from an IR function
   */
  public buildFunctionGraph(irFunction: IRFunction): Graph {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    for (const block of irFunction.basicBlocks) {
      const graphNode: GraphNode = {
        id: block.name,
        label: this.formatBlockLabel({ id: block.name, basicBlock: block, predecessors: block.predecessors, successors: block.successors, isEntry: block.predecessors.length === 0, isExit: this.isExitBlock(block) }),
        shape: 'ellipse',
        color: '#0000ff',
        style: 'filled',
      };
      nodes.push(graphNode);

      for (const successor of block.successors) {
        const graphEdge: GraphEdge = {
          from: block.name,
          to: successor,
          color: '#000000',
          style: 'solid',
        };
        edges.push(graphEdge);
      }
    }

    return {
      nodes,
      edges,
      metadata: {
        name: irFunction.name,
        type: 'IR_FUNCTION',
        version: '1.0',
      },
    };
  }

  /**
   * Build a graph from an IR module
   */
  public buildModuleGraph(module: IRModule): Graph {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    for (const func of module.functions) {
      const graphNode: GraphNode = {
        id: func.name,
        label: `Function: ${func.name}\\nReturn: ${func.returnType}`,
        shape: 'box',
        color: '#0088ff',
        style: 'filled',
      };
      nodes.push(graphNode);
    }

    for (const global of module.globals) {
      const graphNode: GraphNode = {
        id: global.name,
        label: `Global: ${global.name}\\nType: ${global.valueType}`,
        shape: 'parallelogram',
        color: '#ff00ff',
        style: 'filled',
      };
      nodes.push(graphNode);
    }

    return {
      nodes,
      edges,
      metadata: {
        name: 'Module',
        type: 'IR_MODULE',
        version: '1.0',
      },
    };
  }

  /**
   * Build a call graph from an IR module
   */
  public buildCallGraph(module: IRModule): Graph {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Create nodes for all functions
    for (const func of module.functions) {
      const graphNode: GraphNode = {
        id: func.name,
        label: func.name,
        shape: 'box',
        color: '#0088ff',
        style: 'filled',
      };
      nodes.push(graphNode);
    }

    // Create edges for function calls
    for (const func of module.functions) {
      for (const block of func.basicBlocks) {
        for (const instruction of block.instructions) {
          if (instruction.instructionType === 'CALL' && instruction.operands.length > 0) {
            const calleeName = String(instruction.operands[0]);
            const graphEdge: GraphEdge = {
              from: func.name,
              to: calleeName,
              color: '#ff8800',
              style: 'solid',
            };
            edges.push(graphEdge);
          }
        }
      }
    }

    return {
      nodes,
      edges,
      metadata: {
        name: 'CallGraph',
        type: 'CALL_GRAPH',
        version: '1.0',
      },
    };
  }

  /**
   * Build a dominance tree graph
   */
  public buildDominanceTreeGraph(dominators: Map<string, Set<string>>, name: string): Graph {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    for (const [nodeId, doms] of dominators) {
      const graphNode: GraphNode = {
        id: nodeId,
        label: nodeId,
        shape: 'ellipse',
        color: '#00ff00',
        style: 'filled',
      };
      nodes.push(graphNode);

      for (const dom of doms) {
        if (dom !== nodeId) {
          const graphEdge: GraphEdge = {
            from: dom,
            to: nodeId,
            color: '#0000ff',
            style: 'solid',
          };
          edges.push(graphEdge);
        }
      }
    }

    return {
      nodes,
      edges,
      metadata: {
        name,
        type: 'DOMINANCE_TREE',
        version: '1.0',
      },
    };
  }

  /**
   * Format block label for graph
   */
  private formatBlockLabel(node: any): string {
    const block = node.basicBlock;
    let label = `${node.id}\\n`;

    for (const instruction of block.instructions) {
      const operands = instruction.operands.map((op: any) => String(op)).join(', ');
      const result = instruction.result ? `${instruction.result} = ` : '';
      label += `${result}${instruction.instructionType} ${operands}\\n`;
    }

    return label;
  }

  /**
   * Check if a block is an exit block
   */
  private isExitBlock(block: IRBasicBlock): boolean {
    if (block.instructions.length === 0) {
      return false;
    }

    const lastInstruction = block.instructions[block.instructions.length - 1];
    return lastInstruction.instructionType === 'RET';
  }

  /**
   * Export graph to DOT format (Graphviz)
   */
  public exportToDOT(graph: Graph): string {
    let dot = `digraph ${graph.metadata.name} {\n`;
    dot += `  // ${graph.metadata.type}\n`;
    dot += `  // version: ${graph.metadata.version}\n\n`;

    for (const node of graph.nodes) {
      dot += `  ${node.id} [label="${node.label}", shape="${node.shape}", color="${node.color}", style="${node.style}"];\n`;
    }

    dot += '\n';

    for (const edge of graph.edges) {
      if (edge.label) {
        dot += `  ${edge.from} -> ${edge.to} [label="${edge.label}", color="${edge.color}", style="${edge.style}"];\n`;
      } else {
        dot += `  ${edge.from} -> ${edge.to} [color="${edge.color}", style="${edge.style}"];\n`;
      }
    }

    dot += '}\n';
    return dot;
  }

  /**
   * Export graph to JSON format
   */
  public exportToJSON(graph: Graph): string {
    return JSON.stringify(graph, null, 2);
  }

  /**
   * Export graph to Mermaid format
   */
  public exportToMermaid(graph: Graph): string {
    let mermaid = `graph TD\n`;
    mermaid += `  %% ${graph.metadata.type}\n`;
    mermaid += `  %% version: ${graph.metadata.version}\n\n`;

    for (const node of graph.nodes) {
      mermaid += `  ${node.id}["${node.label}"]\n`;
    }

    mermaid += '\n';

    for (const edge of graph.edges) {
      if (edge.label) {
        mermaid += `  ${edge.from} -->|${edge.label}| ${edge.to}\n`;
      } else {
        mermaid += `  ${edge.from} --> ${edge.to}\n`;
      }
    }

    return mermaid;
  }
}
