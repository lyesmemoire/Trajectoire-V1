// apps/realtime-gateway/src/interview/runtime/visual/renderer/renderNode.tsx

import React from "react";
import type { StableHash } from "../../types/StableHash";
import type { LayoutNode } from "./renderGraphLayout";

export interface RenderNodeProps {
  node: LayoutNode;
  isActive?: boolean | undefined;
  isSelected?: boolean | undefined;
  onClick?: ((id: StableHash) => void) | undefined;
  className?: string | undefined;
}

/**
 * Pure presentational component rendering a single node as an SVG <g>.
 * No layout logic here – x/y are expected to be pre‑computed.
 */
export function RenderNodeComponent({
  node,
  isActive,
  isSelected,
  onClick,
  className,
}: RenderNodeProps) {
  const { id, x, y, status } = node;
  const radius = 20;
  const fillColor = (() => {
    switch (status) {
      case "active":
        return "#ffeb3b";
      case "executed":
        return "#4caf50";
      case "forked":
        return "#2196f3";
      case "merged":
        return "#9c27b0";
      case "conflicted":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  })();

  return (
    <g
      id={id}
      className={className}
      transform={`translate(${x}, ${y})`}
      onClick={() => onClick?.(id as StableHash)}
      style={{
        cursor: onClick ? "pointer" : "default",
        opacity: isSelected ? 1 : 0.8,
      }}
    >
      <circle
        r={radius}
        fill={fillColor}
        stroke={isActive ? "#ffeb3b" : "#222"}
        strokeWidth={isActive ? 4 : 2}
      />
      <text
        x={0}
        y={5}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize={12}
        fill="#fff"
      >
        {id}
      </text>
    </g>
  );
}
