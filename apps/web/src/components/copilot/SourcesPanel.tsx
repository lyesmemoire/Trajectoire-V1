'use client';

import React from 'react';

interface SourcesPanelProps {
  sources: string[];
  reasoning?: string[];
  confidence: number;
}

export function SourcesPanel({ sources, reasoning, confidence }: SourcesPanelProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">Sources et Raisonnement</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Confiance</span>
          <span className="text-sm font-bold text-blue-600">{Math.round(confidence)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Sources utilisées</h4>
        <div className="flex flex-wrap gap-2">
          {sources.map((source, index) => (
            <span
              key={index}
              className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-300"
            >
              ✓ {source}
            </span>
          ))}
        </div>
      </div>

      {reasoning && reasoning.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Raisonnement</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            {reasoning.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-gray-400">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
