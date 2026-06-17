"use strict";
// src/interview/runtime/visual/renderer/renderEdge.tsx
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderEdgeComponent = void 0;
const react_1 = __importDefault(require("react"));
const RenderEdgeComponent = ({ id, fromX, fromY, toX, toY, label, }) => (<g key={id}>
    <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#6B7280" strokeWidth={2}/>
    {label && (<text x={(fromX + toX) / 2} y={(fromY + toY) / 2}>
        {label}
      </text>)}
  </g>);
exports.RenderEdgeComponent = RenderEdgeComponent;
