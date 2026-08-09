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
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preferred':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'soft':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
