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
    <div className="bg-calm-surface rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">Sources et Raisonnement</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-calm-tertiary">Confiance</span>
          <span className="text-sm font-bold text-calm-accent-deep">{Math.round(confidence)}%</span>
        </div>
        <div className="w-full bg-calm-line-soft rounded-full h-2">
          <div
            className="bg-calm-accent h-2 rounded-full transition-all"
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-calm-tertiary mb-2">Sources utilisées</h4>
        <div className="flex flex-wrap gap-2">
          {sources.map((source, index) => (
            <span
              key={index}
              className="text-xs bg-calm-accent-soft text-calm-accent-deep px-3 py-1 rounded-full border border-calm-accent-line"
            >
              ✓ {source}
            </span>
          ))}
        </div>
      </div>

      {reasoning && reasoning.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-calm-tertiary mb-2">Raisonnement</h4>
          <ul className="text-xs text-calm-ink space-y-1">
            {reasoning.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-calm-secondary">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
