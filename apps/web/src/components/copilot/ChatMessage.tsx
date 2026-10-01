'use client';

import React from 'react';
import { CopilotMessage } from '@/types/copilot.types';

interface ChatMessageProps {
  message: CopilotMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-2xl rounded-lg p-4 ${
          isUser
            ? 'bg-calm-accent text-white'
            : 'bg-calm-surface border border-calm-line text-calm-ink'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {isUser ? (
              <div className="w-8 h-8 bg-calm-accent rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-calm-accent rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-calm-line">
                <div className="text-xs font-medium text-calm-tertiary mb-2">Sources:</div>
                <div className="flex flex-wrap gap-1">
                  {message.sources.map((source, index) => (
                    <span
                      key={index}
                      className="text-xs bg-calm-line-soft text-calm-ink px-2 py-1 rounded"
                    >
                      ✓ {source}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {message.reasoning && message.reasoning.length > 0 && (
              <details className="mt-3">
                <summary className="text-xs font-medium text-calm-tertiary cursor-pointer hover:text-calm-ink">
                  Voir le raisonnement
                </summary>
                <ul className="mt-2 text-xs text-calm-tertiary space-y-1">
                  {message.reasoning.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div className="mt-2 text-xs text-calm-tertiary">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
