// src/interview/runtime/visual/renderer/renderGraphLayout.ts

export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface LayoutNode extends GraphNode {
  status?: "active" | "executed" | "forked" | "merged" | "conflicted" | "default";
}

export interface GraphLayout {
  nodes: GraphNode[];
  width: number;
  height: number;
}

/**
 * Deterministic layout: place nodes in a simple grid.
 */
export function renderGraphLayout(
  nodes: Omit<GraphNode, "x" | "y">[],
): GraphLayout {
  const spacing = 150;
  const cols = Math.ceil(Math.sqrt(nodes.length));

  const positionedNodes: GraphNode[] = nodes.map((node, index) => ({
    ...node,
    x: (index % cols) * spacing + spacing / 2,
    y: Math.floor(index / cols) * spacing + spacing / 2,
  }));

  return {
    nodes: positionedNodes,
    width: cols * spacing,
    height: Math.ceil(nodes.length / cols) * spacing,
  };
}
