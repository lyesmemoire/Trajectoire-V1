import React, { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export interface TranscriptLineProps {
  text: string;
  speaker: "ai" | "user";
}

export const TranscriptLine = memo(function TranscriptLine({ text, speaker }: TranscriptLineProps) {
  const isAI = speaker === "ai";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex w-full mb-6",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] rounded-2xl px-6 py-4",
          isAI 
            ? "bg-white border border-slate-200 text-slate-800" 
            : "bg-slate-100 text-slate-700"
        )}
      >
        <p className="text-lg leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
});
