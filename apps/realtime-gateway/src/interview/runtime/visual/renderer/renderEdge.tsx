// src/interview/runtime/visual/renderer/renderEdge.tsx

import React from "react";

export interface EdgeRenderProps {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  label?: string;
}

export const RenderEdgeComponent: React.FC<EdgeRenderProps> = ({
  id,
  fromX,
  fromY,
  toX,
  toY,
  label,
}) => (
  <g key={id}>
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke="#6B7280"
      strokeWidth={2}
    />
    {label && (
      <text x={(fromX + toX) / 2} y={(fromY + toY) / 2}>
        {label}
      </text>
    )}
  </g>
);
