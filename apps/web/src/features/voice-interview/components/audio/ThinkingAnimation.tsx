import React, { memo } from "react";
import { useInterview } from "../../hooks";
import { motion, AnimatePresence } from "framer-motion";

export const ThinkingAnimation = memo(function ThinkingAnimation() {
  const { currentState } = useInterview();
  const isThinking = currentState === "WaitingAI";

  return (
    <div className="h-8 flex justify-center items-center">
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-sky-400 rounded-full"
                animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
