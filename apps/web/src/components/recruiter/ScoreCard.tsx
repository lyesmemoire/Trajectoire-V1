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
        return 'bg-calm-accent-soft border-calm-accent-line text-calm-accent-deep';
      case 'green':
        return 'bg-calm-accent-soft border-calm-accent-line text-calm-accent-deep';
      case 'yellow':
        return 'bg-calm-warn-soft border-calm-warn-line text-calm-warn';
      case 'red':
        return 'bg-calm-warn-soft border-calm-warn-line text-calm-warn';
      default:
        return 'bg-calm-accent-wash border-calm-line text-calm-ink';
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-calm-accent-deep';
    if (score >= 60) return 'text-calm-warn';
    return 'text-calm-warn';
  };

  return (
    <div className={`p-4 rounded-lg border ${getColorClasses()}`}>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className={`text-3xl font-bold ${getScoreColor()}`}>{score}%</div>
    </div>
  );
}
