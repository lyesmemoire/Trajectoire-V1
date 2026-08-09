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
    if (result.score >= 80) return 'text-green-600';
    if (result.score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = () => {
    if (result.score >= 80) return 'bg-green-50 border-green-200';
    if (result.score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 border cursor-pointer hover:shadow-md transition-shadow ${getScoreBg()}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`text-2xl font-bold ${getScoreColor()}`}>
            {result.score}%
          </div>
          <div className="ml-3">
            <div className="text-sm text-gray-600">Confiance</div>
            <div className="text-sm font-medium">{Math.round(result.confidence)}%</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {type === 'candidate' ? 'Candidat' : 'Poste'}
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-3">
        {result.explanation}
      </div>

      <div className="space-y-1">
        {result.justification.slice(0, 3).map((justification, index) => (
          <div key={index} className="text-xs text-gray-600 flex items-start">
            <span className="mr-2">•</span>
            <span>{justification}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
