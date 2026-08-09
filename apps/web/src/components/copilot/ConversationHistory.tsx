'use client';

import React from 'react';
import { CopilotMessage } from '@/types/copilot.types';

interface ConversationHistoryProps {
  messages: CopilotMessage[];
  onSelectMessage?: (message: CopilotMessage) => void;
}

export function ConversationHistory({ messages, onSelectMessage }: ConversationHistoryProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Historique de conversation</h3>
        <p className="text-sm text-gray-500">Aucun message</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">Historique de conversation</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            onClick={() => onSelectMessage?.(message)}
            className={`p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors ${
              message.role === 'user' ? 'bg-blue-50' : 'bg-green-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{message.role === 'user' ? '👤' : '🤖'}</span>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm text-gray-700 line-clamp-2">
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
