import React, { memo } from "react";
import { Mic } from "lucide-react";
import { useInterview } from "../../hooks";
import { motion } from "framer-motion";

export const RecordingIndicator = memo(function RecordingIndicator() {
  const { currentState } = useInterview();
  const isRecording = currentState === "Listening";

  if (!isRecording) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 text-sm text-slate-500"
    >
      <motion.div
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Mic className="w-4 h-4 text-emerald-500" />
      </motion.div>
      <span>Microphone actif</span>
    </motion.div>
  );
});
