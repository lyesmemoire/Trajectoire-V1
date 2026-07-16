import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Message } from "../../types/interview";
import { ConversationMessage } from "./ConversationMessage";

interface ConversationPanelProps {
  messages: Message[];
  transcription?: string;
}

export function ConversationPanel({ messages, transcription }: ConversationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 font-semibold">Conversation</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Relire
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {messages.map((message, index) => (
            <ConversationMessage key={index} message={message} />
          ))}
          
          {transcription && (
            <div className="flex gap-3 justify-end">
              <div className="flex-1 max-w-lg">
                <div className="bg-gray-900 rounded-2xl rounded-tr-none p-4">
                  <p className="text-sm text-white">{transcription}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1 mr-2 text-right">Il y a 5 secondes</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
          
          {!transcription && messages.length > 0 && (
            <div className="flex gap-3 justify-end">
              <div className="flex-1 max-w-lg">
                <div className="bg-gray-50 rounded-2xl rounded-tr-none p-4 border border-gray-200 border-dashed">
                  <p className="text-sm text-gray-400 italic">
                    Votre réponse apparaîtra ici...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
