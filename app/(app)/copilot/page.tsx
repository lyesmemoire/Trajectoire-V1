"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatInterface } from "@/components/copilot/ChatInterface";
import { Conversation } from "@/modules/copilot/domain/entities/conversation.entity";

export default function CopilotPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/copilot/conversations");
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login?redirect=/copilot");
          return;
        }
        throw new Error(result.message || "Failed to load conversations");
      }

      if (result.success && result.data) {
        setConversations(result.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    loadConversations();
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/copilot/conversations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      if (selectedConversationId === id) {
        setSelectedConversationId(undefined);
      }

      loadConversations();
    } catch (err: any) {
      setError(err.message || "Failed to delete conversation");
    }
  };

  const handleNewChat = () => {
    setSelectedConversationId(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleNewChat}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nouvelle conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedConversationId === conversation.id
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-900 text-sm flex-1">
                  {conversation.title}
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conversation.id);
                  }}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(conversation.updatedAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}

          {conversations.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Aucune conversation
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 p-6">
        <ChatInterface
          conversationId={selectedConversationId}
          onNewConversation={handleNewConversation}
        />
      </div>
    </div>
  );
}
