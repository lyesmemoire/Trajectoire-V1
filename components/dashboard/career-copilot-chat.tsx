"use client";

import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const chatTransport = new DefaultChatTransport({
  api: "/api/career-copilot/chat",
});

export function CareerCopilotChat() {
  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = () => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  /** Extraire le texte visible d'un UIMessage.parts */
  const getTextContent = (parts: Array<{ type: string; text?: string }>): string => {
    return parts
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text!)
      .join("");
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm h-[600px] flex flex-col">
      <CardHeader className="border-b border-gray-200/60">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Career Copilot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <AnimatePresence>
            {messages.length === 0 && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-gray-500 py-8"
              >
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">
                  Posez-moi vos questions sur votre carrière, vos progrès, ou vos objectifs.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Exemples: &quot;Pourquoi mon score a diminué ?&quot;, &quot;Que dois-je travailler cette semaine ?&quot;
                </p>
              </m.div>
            )}
            {messages.map((message) => {
              const textContent = getTextContent(message.parts as Array<{ type: string; text?: string }>);
              return (
                <m.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{textContent}</p>
                  </div>
                </m.div>
              );
            })}
            {isLoading && (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-2xl p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
              </m.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={onSubmit}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
