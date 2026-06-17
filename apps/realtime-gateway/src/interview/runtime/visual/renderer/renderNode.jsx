"use strict";
// apps/realtime-gateway/src/interview/runtime/visual/renderer/renderNode.tsx
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderNodeComponent = RenderNodeComponent;
const react_1 = __importDefault(require("react"));
/**
 * Pure presentational component rendering a single node as an SVG <g>.
 * No layout logic here – x/y are expected to be pre‑computed.
 */
function RenderNodeComponent({ node, isActive, isSelected, onClick, className, }) {
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
    return (<g id={id} className={className} transform={`translate(${x}, ${y})`} onClick={() => onClick?.(id)} style={{
            cursor: onClick ? "pointer" : "default",
            opacity: isSelected ? 1 : 0.8,
        }}>
      <circle r={radius} fill={fillColor} stroke={isActive ? "#ffeb3b" : "#222"} strokeWidth={isActive ? 4 : 2}/>
      <text x={0} y={5} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={12} fill="#fff">
        {id}
      </text>
    </g>);
}
