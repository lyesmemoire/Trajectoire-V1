'use client';

import React, { useState, useRef, useEffect } from 'react';
import { copilotService } from '@/services/copilot.service';
import { CopilotMessage, CopilotResponse } from '@/types/copilot.types';
import { ChatMessage } from './ChatMessage';
import { ThinkingIndicator } from './ThinkingIndicator';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ConversationHistory } from './ConversationHistory';
import { SourcesPanel } from './SourcesPanel';

export function ChatWorkspace() {
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<CopilotResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: CopilotMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await copilotService.processMessage(sessionId, input);
      
      const assistantMessage: CopilotMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        sources: response.sources,
        reasoning: response.reasoning,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLastResponse(response);
    } catch (error) {
      const errorMessage: CopilotMessage = {
        role: 'assistant',
        content: 'Erreur lors du traitement de votre message. Veuillez réessayer.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = (question: string) => {
    setInput(question);
  };

  const handleClearConversation = async () => {
    try {
      await copilotService.clearConversation(sessionId);
      setMessages([]);
      setLastResponse(null);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Copilot</h1>
          <p className="text-gray-600 mt-2">Votre assistant conversationnel RH propulsé par le Knowledge Graph</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Conversation</h2>
                <button
                  onClick={handleClearConversation}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Nouvelle conversation
                </button>
              </div>

              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <p>Bonjour ! Je suis votre assistant RH.</p>
                    <p className="mt-2">Comment puis-je vous aider aujourd'hui ?</p>
                    <p className="mt-4 text-sm">
                      Exemples: "Trouve un Data Engineer senior" ou "Pourquoi ce score ?"
                    </p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                
                {loading && <ThinkingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {lastResponse && lastResponse.suggestedQuestions && lastResponse.suggestedQuestions.length > 0 && (
                <SuggestedQuestions
                  questions={lastResponse.suggestedQuestions}
                  onSelectQuestion={handleSelectQuestion}
                />
              )}

              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {lastResponse && (
              <SourcesPanel
                sources={lastResponse.sources}
                reasoning={lastResponse.reasoning}
                confidence={lastResponse.confidence}
              />
            )}

            <ConversationHistory messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
}
