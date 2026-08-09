'use client';

import React from 'react';

interface ScoreCardProps {
  score: number;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export function ScoreCard({ score, label, color = 'blue' }: ScoreCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`p-4 rounded-lg border ${getColorClasses()}`}>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className={`text-3xl font-bold ${getScoreColor()}`}>{score}%</div>
    </div>
  );
}
