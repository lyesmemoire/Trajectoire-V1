// @ts-nocheck
import { User, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { Message } from "../../types/interview";

interface ConversationMessageProps {
  message: Message;
}

export function ConversationMessage({ message }: ConversationMessageProps) {
  const isRecruiter = message.role === "recruiter";
  const timeAgo = Math.floor((Date.now() - message.timestamp) / 1000);
  const timeText = timeAgo < 60 ? `Il y a ${timeAgo} secondes` : `Il y a ${Math.floor(timeAgo / 60)} minutes`;

  return (
    <motion.div
      initial={{ opacity: 0, x: isRecruiter ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 ${isRecruiter ? "" : "justify-end"}`}
    >
      {isRecruiter && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-blue-600" />
        </div>
      )}
      <div className={`flex-1 ${isRecruiter ? "" : "max-w-lg"}`}>
        <div
          className={`${
            isRecruiter
              ? "bg-blue-50 rounded-2xl rounded-tl-none border border-blue-100"
              : "bg-gray-900 rounded-2xl rounded-tr-none"
          } p-4`}
        >
          <p className={`text-sm ${isRecruiter ? "text-gray-700" : "text-white"}`}>
            {message.content}
          </p>
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isRecruiter ? "ml-2" : "mr-2 text-right"}`}>
          {timeText}
        </p>
      </div>
      {!isRecruiter && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <Mic className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}
