import React, { memo } from "react";
import { useInterview } from "../../hooks";
import { motion, AnimatePresence } from "framer-motion";

export const InterviewStatusBadge = memo(function InterviewStatusBadge() {
  const { currentState } = useInterview();

  let label = "";
  switch (currentState) {
    case "WaitingAI":
      label = "Je prépare votre prochaine question.";
      break;
    case "Listening":
      label = "Je vous écoute.";
      break;
    case "PlayingTTS":
      label = "L'IA vous répond.";
      break;
    case "Paused":
      label = "L'entretien est en pause.";
      break;
    case "WaitingInterview":
      label = "Lorsque vous êtes prêt, nous commencerons.";
      break;
    default:
      return null;
  }

  return (
    <div className="flex justify-center h-12 my-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentState}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.8 }}
          className="text-lg text-text-muted font-light tracking-wide"
        >
          {label}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
