import React, { memo } from "react";
import { useInterview } from "../../hooks";
import { motion, AnimatePresence } from "framer-motion";

export const CurrentQuestionCard = memo(function CurrentQuestionCard() {
  const { currentQuestion, currentState } = useInterview();

  if (currentState === "Disconnected" || currentState === "Connecting" || currentState === "Completed") {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-8 flex justify-center min-h-[120px] items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion || "greeting"}
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl leading-relaxed text-text-primary font-light tracking-wide">
            {currentQuestion || "Bonjour Thomas. Prenons quelques secondes."}
          </h2>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
