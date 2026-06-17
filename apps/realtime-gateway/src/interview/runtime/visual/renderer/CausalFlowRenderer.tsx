import React from "react";
import { renderGraphLayout, GraphNode, GraphLayout } from "./renderGraphLayout";
import { RenderEdgeComponent, EdgeRenderProps } from "./renderEdge";

interface CausalFlowRendererProps {
  nodes: GraphNode[];
  edges: EdgeRenderProps[];
}

export const CausalFlowRenderer: React.FC<CausalFlowRendererProps> = ({
  nodes,
  edges,
}) => {
  const layout: GraphLayout = renderGraphLayout(nodes);

  return (
    <svg width={layout.width} height={layout.height}>
      {/* Définition de la flèche */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
        </marker>
      </defs>

      {/* Rendu des arêtes */}
      {edges.map((n) => (
        <RenderEdgeComponent key={n.id} {...n} />
      ))}

      {/* Rendu des nœuds */}
      {layout.nodes.map((node) => (
        <g key={node.id}>
          <circle transform={`translate(${node.x ?? 0}, ${node.y ?? 0})`} r={20} fill="#4A90E2" />
          <text x={node.x ?? 0} y={(node.y ?? 0) + 35} textAnchor="middle" fontSize={12}>
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
