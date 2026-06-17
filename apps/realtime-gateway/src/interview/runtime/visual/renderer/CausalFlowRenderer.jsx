"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CausalFlowRenderer = void 0;
const react_1 = __importDefault(require("react"));
const renderGraphLayout_1 = require("./renderGraphLayout");
const renderEdge_1 = require("./renderEdge");
const CausalFlowRenderer = ({ nodes, edges, }) => {
    const layout = (0, renderGraphLayout_1.renderGraphLayout)(nodes);
    return (<svg width={layout.width} height={layout.height}>
      {/* Définition de la flèche */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#555"/>
        </marker>
      </defs>

      {/* Rendu des arêtes */}
      {edges.map((n) => (<renderEdge_1.RenderEdgeComponent key={n.id} {...n}/>))}

      {/* Rendu des nœuds */}
      {layout.nodes.map((node) => (<g key={node.id}>
          <circle transform={`translate(${node.x ?? 0}, ${node.y ?? 0})`} r={20} fill="#4A90E2"/>
          <text x={node.x ?? 0} y={(node.y ?? 0) + 35} textAnchor="middle" fontSize={12}>
            {node.label}
          </text>
        </g>))}
    </svg>);
};
exports.CausalFlowRenderer = CausalFlowRenderer;
