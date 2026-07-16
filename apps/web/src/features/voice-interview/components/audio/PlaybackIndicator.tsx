import React, { memo } from "react";
import { Volume2 } from "lucide-react";
import { useInterview } from "../../hooks";
import { motion } from "framer-motion";

export const PlaybackIndicator = memo(function PlaybackIndicator() {
  const { currentState } = useInterview();
  const isPlaying = currentState === "PlayingTTS";

  if (!isPlaying) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 text-sm text-slate-500"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Volume2 className="w-4 h-4 text-sky-500" />
      </motion.div>
      <span>L'IA parle...</span>
    </motion.div>
  );
});
