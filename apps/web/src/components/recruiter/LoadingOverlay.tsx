'use client';

import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Chargement...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-calm-bg bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-calm-surface rounded-lg p-8 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-calm-accent mb-4"></div>
        <p className="text-calm-ink">{message}</p>
      </div>
    </div>
  );
}
