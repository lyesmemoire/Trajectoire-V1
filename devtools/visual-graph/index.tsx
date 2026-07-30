import React from 'react';
import { Graph } from 'react-d3-graph';

interface VisualGraphProps {
  data: {
    nodes: { id: string; label: string }[];
    links: { source: string; target: string }[];
  };
}

export const VisualGraph: React.FC<VisualGraphProps> = ({ data }) => {
  const graphConfig = {
    node: {
      color: '#6366f1',
      size: 200,
      highlightStrokeColor: '#818cf8',
    },
    link: {
      color: '#94a3b8',
      highlightColor: '#64748b',
    },
    d3: {
      gravity: -300,
      linkLength: 100,
    },
  };

  return (
    <div className="visual-graph">
      <Graph data={data} config={graphConfig} />
    </div>
  );
};
