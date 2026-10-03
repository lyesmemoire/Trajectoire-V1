'use client';

import React from 'react';
import { RankedResult } from '@/types/search.types';

interface SearchResultCardProps {
  result: RankedResult;
  type: 'candidate' | 'job';
  onClick?: () => void;
}

export function SearchResultCard({ result, type, onClick }: SearchResultCardProps) {
  const getScoreColor = () => {
    if (result.score >= 80) return 'text-calm-accent-deep';
    if (result.score >= 60) return 'text-calm-warn';
    return 'text-calm-warn';
  };

  const getScoreBg = () => {
    if (result.score >= 80) return 'bg-calm-accent-soft border-calm-accent-line';
    if (result.score >= 60) return 'bg-calm-warn-soft border-calm-warn-line';
    return 'bg-calm-warn-soft border-calm-warn-line';
  };

  return (
    <div
      className={`bg-calm-surface rounded-lg shadow p-4 border cursor-pointer hover:shadow-md transition-shadow ${getScoreBg()}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`text-2xl font-bold ${getScoreColor()}`}>
            {result.score}%
          </div>
          <div className="ml-3">
            <div className="text-sm text-calm-tertiary">Confiance</div>
            <div className="text-sm font-medium">{Math.round(result.confidence)}%</div>
          </div>
        </div>
        <div className="text-xs text-calm-tertiary">
          {type === 'candidate' ? 'Candidat' : 'Poste'}
        </div>
      </div>

      <div className="text-sm text-calm-ink mb-3">
        {result.explanation}
      </div>

      <div className="space-y-1">
        {result.justification.slice(0, 3).map((justification, index) => (
          <div key={index} className="text-xs text-calm-tertiary flex items-start">
            <span className="mr-2">•</span>
            <span>{justification}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
