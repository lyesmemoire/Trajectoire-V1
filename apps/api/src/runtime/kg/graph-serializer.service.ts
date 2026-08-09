/**
 * Knowledge Graph RH Runtime v2
 * Graph Serializer Service
 * Serializes graph to various formats (JSON, GraphML, Neo4j)
 */

import {
  Graph,
  Node,
  Edge,
  SerializedGraph,
  SerializationFormat,
} from './graph-types';

export class GraphSerializerService {
  constructor() {}

  /**
   * Serialize graph to specified format
   */
  serialize(
    graph: Graph,
    format: SerializationFormat = 'JSON',
  ): SerializedGraph {
    switch (format) {
      case 'JSON':
        return this.serializeToJSON(graph);
      case 'GRAPHML':
        return this.serializeToGraphML(graph);
      case 'NEO4J':
        return this.serializeToNeo4j(graph);
      default:
        throw new Error(`Unsupported serialization format: ${format}`);
    }
  }

  /**
   * Deserialize graph from specified format
   */
  deserialize(data: unknown, format: SerializationFormat = 'JSON'): Graph {
    switch (format) {
      case 'JSON':
        return this.deserializeFromJSON(data);
      case 'GRAPHML':
        return this.deserializeFromGraphML(data);
      case 'NEO4J':
        return this.deserializeFromNeo4j(data);
      default:
        throw new Error(`Unsupported deserialization format: ${format}`);
    }
  }

  /**
   * Serialize to JSON
   */
  private serializeToJSON(graph: Graph): SerializedGraph {
    const nodesArray = Array.from(graph.nodes.values());
    const edgesArray = Array.from(graph.edges.values());

    return {
      format: 'JSON',
      version: '2.0.0',
      data: {
        id: graph.id,
        nodes: nodesArray.map((node) => ({
          id: node.id,
          type: node.type,
          label: node.label,
          normalizedLabel: node.normalizedLabel,
          confidence: node.confidence,
          source: node.source,
          metadata: node.metadata,
          embeddingPlaceholder: node.embeddingPlaceholder,
          timestamps: {
            createdAt: node.timestamps.createdAt.toISOString(),
            updatedAt: node.timestamps.updatedAt.toISOString(),
            deletedAt: node.timestamps.deletedAt?.toISOString(),
          },
        })),
        edges: edgesArray.map((edge) => ({
          id: edge.id,
          type: edge.type,
          sourceNode: edge.sourceNode,
          targetNode: edge.targetNode,
          weight: edge.weight,
          confidence: edge.confidence,
          reason: edge.reason,
          metadata: edge.metadata,
          timestamps: {
            createdAt: edge.timestamps.createdAt.toISOString(),
            updatedAt: edge.timestamps.updatedAt.toISOString(),
          },
        })),
        metadata: {
          ...graph.metadata,
          createdAt: graph.metadata.createdAt.toISOString(),
          updatedAt: graph.metadata.updatedAt.toISOString(),
        },
      },
      serializedAt: new Date(),
    };
  }

  /**
   * Deserialize from JSON
   */
  private deserializeFromJSON(data: unknown): Graph {
    const graphData = data as {
      id: string;
      nodes: Node[];
      edges: Edge[];
      metadata: any;
    };

    const nodes = new Map<string, Node>();
    const edges = new Map<string, Edge>();

    graphData.nodes.forEach((node) => {
      nodes.set(node.id, {
        ...node,
        timestamps: {
          createdAt: new Date(node.timestamps.createdAt),
          updatedAt: new Date(node.timestamps.updatedAt),
          deletedAt: node.timestamps.deletedAt
            ? new Date(node.timestamps.deletedAt)
            : undefined,
        },
      });
    });

    graphData.edges.forEach((edge) => {
      edges.set(edge.id, {
        ...edge,
        timestamps: {
          createdAt: new Date(edge.timestamps.createdAt),
          updatedAt: new Date(edge.timestamps.updatedAt),
        },
      });
    });

    return {
      id: graphData.id,
      nodes,
      edges,
      metadata: {
        ...graphData.metadata,
        createdAt: new Date(graphData.metadata.createdAt),
        updatedAt: new Date(graphData.metadata.updatedAt),
      },
    };
  }

  /**
   * Serialize to GraphML
   */
  private serializeToGraphML(graph: Graph): SerializedGraph {
    const nodesArray = Array.from(graph.nodes.values());
    const edgesArray = Array.from(graph.edges.values());

    let graphml = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
    http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <key id="d0" for="node" attr.name="type" attr.type="string"/>
  <key id="d1" for="node" attr.name="label" attr.type="string"/>
  <key id="d2" for="node" attr.name="confidence" attr.type="double"/>
  <key id="d3" for="edge" attr.name="type" attr.type="string"/>
  <key id="d4" for="edge" attr.name="weight" attr.type="double"/>
  <key id="d5" for="edge" attr.name="confidence" attr.type="double"/>
  <graph id="${graph.id}" edgedefault="directed">
`;

    nodesArray.forEach((node) => {
      graphml += `    <node id="${node.id}">
      <data key="d0">${node.type}</data>
      <data key="d1">${node.label}</data>
      <data key="d2">${node.confidence}</data>
    </node>
`;
    });

    edgesArray.forEach((edge) => {
      graphml += `    <edge id="${edge.id}" source="${edge.sourceNode}" target="${edge.targetNode}">
      <data key="d3">${edge.type}</data>
      <data key="d4">${edge.weight}</data>
      <data key="d5">${edge.confidence}</data>
    </edge>
`;
    });

    graphml += `  </graph>
</graphml>`;

    return {
      format: 'GRAPHML',
      version: '2.0.0',
      data: graphml,
      serializedAt: new Date(),
    };
  }

  /**
   * Deserialize from GraphML
   */
  private deserializeFromGraphML(data: unknown): Graph {
    // Note: Full GraphML parsing would require an XML parser
    // This is a simplified implementation
    const graphml = data as string;

    const nodes = new Map<string, Node>();
    const edges = new Map<string, Edge>();

    // Helper function to safely convert to number
    const safeToNumber = (value: string): number => {
      if (value === null || value === '') return 1;
      const num = parseFloat(value);
      return isNaN(num) ? 1 : num;
    };

    // Parse nodes (simplified regex-based parsing)
    const nodeRegex =
      /<node id="([^"]+)">\s*<data key="d0">([^<]+)<\/data>\s*<data key="d1">([^<]*)<\/data>\s*<data key="d2">([^<]*)<\/data>\s*<\/node>/g;
    let match;
    while ((match = nodeRegex.exec(graphml)) !== null) {
      const nodeId: string = match[1]!;
      const nodeType: string = match[2]!;
      const label = match[3] !== undefined ? match[3] : '';
      const nodeLabel = label;
      const confidenceStr = match[4] ?? '1';
      const finalConfidence: number = safeToNumber(confidenceStr);
      const node: Node = {
        id: nodeId,
        type: nodeType as any,
        label: nodeLabel,
        normalizedLabel: nodeLabel ? nodeLabel.toLowerCase().trim() : '',
        confidence: finalConfidence,
        source: 'GRAPHML',
        metadata: {},
        timestamps: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        provenance: {
          createdBy: 'GRAPHML',
          algorithmVersion: '1.0.0',
        },
      };
      nodes.set(nodeId, node);
    }

    // Parse edges (simplified regex-based parsing)
    const edgeRegex =
      /<edge id="([^"]+)" source="([^"]+)" target="([^"]+)">\s*<data key="d3">([^<]*)<\/data>\s*<data key="d4">([^<]*)<\/data>\s*<data key="d5">([^<]*)<\/data>\s*<\/edge>/g;
    while ((match = edgeRegex.exec(graphml)) !== null) {
      const edgeId: string = match[1]!;
      const source: string = match[2]!;
      const target: string = match[3]!;
      const type = match[4] !== undefined ? match[4] : '';
      const weightStr = match[5] ?? '1';
      const confidenceStr = match[6] ?? '1';
      const finalWeight: number = safeToNumber(weightStr);
      const finalConfidence: number = safeToNumber(confidenceStr);
      const edge: Edge = {
        id: edgeId,
        type: type as any,
        sourceNode: source,
        targetNode: target,
        weight: finalWeight,
        confidence: finalConfidence,
        metadata: {},
        timestamps: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        provenance: {
          createdBy: 'GRAPHML',
          algorithmVersion: '1.0.0',
        },
      };
      edges.set(edgeId, edge);
    }

    return {
      id: 'deserialized_graph',
      nodes,
      edges,
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'GRAPHML',
      },
    };
  }

  /**
   * Serialize to Neo4j compatible JSON
   */
  private serializeToNeo4j(graph: Graph): SerializedGraph {
    const nodesArray = Array.from(graph.nodes.values());
    const edgesArray = Array.from(graph.edges.values());

    const neo4jNodes = nodesArray.map((node) => ({
      identity: node.id,
      labels: [node.type],
      properties: {
        id: node.id,
        label: node.label,
        normalizedLabel: node.normalizedLabel,
        confidence: node.confidence,
        source: node.source,
        ...node.metadata,
      },
    }));

    const neo4jEdges = edgesArray.map((edge) => ({
      identity: edge.id,
      start: edge.sourceNode,
      end: edge.targetNode,
      type: edge.type,
      properties: {
        weight: edge.weight,
        confidence: edge.confidence,
        reason: edge.reason,
        ...edge.metadata,
      },
    }));

    return {
      format: 'NEO4J',
      version: '2.0.0',
      data: {
        nodes: neo4jNodes,
        edges: neo4jEdges,
        metadata: {
          graphId: graph.id,
          ...graph.metadata,
        },
      },
      serializedAt: new Date(),
    };
  }

  /**
   * Deserialize from Neo4j compatible JSON
   */
  private deserializeFromNeo4j(data: unknown): Graph {
    const neo4jData = data as {
      nodes: Array<{
        identity: string;
        labels: string[];
        properties: any;
      }>;
      edges: Array<{
        identity: string;
        start: string;
        end: string;
        type: string;
        properties: any;
      }>;
      metadata: any;
    };

    const nodes = new Map<string, Node>();
    const edges = new Map<string, Edge>();

    neo4jData.nodes.forEach((node) => {
      const { identity, labels, properties } = node;
      const { id, label, normalizedLabel, confidence, source, ...rest } =
        properties;

      const nodeLabel = label || properties.label || '';
      const nodeNormalizedLabel =
        normalizedLabel || nodeLabel.toLowerCase().trim();

      nodes.set(identity, {
        id: identity,
        type: labels[0] as any,
        label: nodeLabel,
        normalizedLabel: nodeNormalizedLabel,
        confidence: confidence ?? 1.0,
        source: source ?? 'NEO4J',
        metadata: rest,
        timestamps: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        provenance: {
          createdBy: source ?? 'NEO4J',
          algorithmVersion: '1.0.0',
        },
      });
    });

    neo4jData.edges.forEach((edge) => {
      const { identity, start, end, type, properties } = edge;
      const { weight, confidence, reason, ...rest } = properties;

      edges.set(identity, {
        id: identity,
        type: type as any,
        sourceNode: start,
        targetNode: end,
        weight: weight ?? 1.0,
        confidence: confidence ?? 1.0,
        reason,
        metadata: rest,
        timestamps: {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        provenance: {
          createdBy: 'NEO4J',
          algorithmVersion: '1.0.0',
        },
      });
    });

    return {
      id: neo4jData.metadata.graphId || 'deserialized_graph',
      nodes,
      edges,
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'NEO4J',
        ...neo4jData.metadata,
      },
    };
  }

  /**
   * Export graph to file (Node.js environment)
   */
  async exportToFile(
    graph: Graph,
    filePath: string,
    format: SerializationFormat = 'JSON',
  ): Promise<void> {
    const serialized = this.serialize(graph, format);
    const fs = await import('fs/promises');
    await fs.writeFile(filePath, JSON.stringify(serialized.data, null, 2), 'utf-8');
  }

  /**
   * Import graph from file (Node.js environment)
   */
  async importFromFile(
    filePath: string,
    format: SerializationFormat = 'JSON',
  ): Promise<Graph> {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return this.deserialize({ format, data, metadata: { version: '1.0', timestamp: new Date().toISOString() } });
  }

  /**
   * Download graph as file (browser environment)
   */
  downloadAsFile(
    graph: Graph,
    filename: string,
    format: SerializationFormat = 'JSON',
  ): void {
    const serialized = this.serialize(graph, format);
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'JSON':
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'GRAPHML':
        mimeType = 'application/xml';
        extension = 'graphml';
        break;
      case 'NEO4J':
        mimeType = 'application/json';
        extension = 'json';
        break;
      default:
        mimeType = 'application/json';
        extension = 'json';
    }

    const blob = new Blob([JSON.stringify(serialized.data, null, 2)], {
      type: mimeType,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
