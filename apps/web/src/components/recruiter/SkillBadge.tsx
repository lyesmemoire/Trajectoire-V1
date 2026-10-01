'use client';

import React from 'react';

interface SkillBadgeProps {
  skill: string;
  type?: 'required' | 'preferred' | 'soft';
  confidence?: number;
}

export function SkillBadge({ skill, type = 'preferred', confidence }: SkillBadgeProps) {
  const getColor = () => {
    switch (type) {
      case 'required':
        return 'bg-calm-accent-soft text-calm-accent-deep border-calm-accent-line';
      case 'preferred':
        return 'bg-calm-accent-soft text-calm-accent-deep border-calm-accent-line';
      case 'soft':
        return 'bg-calm-accent-soft text-calm-accent-deep border-calm-accent-line';
      default:
        return 'bg-calm-line-soft text-calm-ink border-calm-line';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getColor()}`}>
      {skill}
      {confidence !== undefined && (
        <span className="ml-2 text-xs opacity-70">{Math.round(confidence * 100)}%</span>
      )}
    </span>
  );
}
