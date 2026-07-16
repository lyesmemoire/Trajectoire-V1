import React, { memo } from "react";
import { useInterview } from "../../hooks";
import { MicrophoneButton } from "./MicrophoneButton";
import { PauseButton } from "./PauseButton";
import { ResumeButton } from "./ResumeButton";
import { motion, AnimatePresence } from "framer-motion";

export const Controls = memo(function Controls() {
  const { currentState, startInterview, pause, resume } = useInterview();

  if (currentState === "Completed" || currentState === "Disconnected" || currentState === "Connecting") {
    return null;
  }

  // Seule une action principale est affichée à la fois.
  // - En attente : Commencer
  // - Actif (Listening/Playing) : Pause
  // - Pause : Reprendre
  // (Stop est caché, on pourrait le mettre discrètement dans le header)

  let controlNode = null;
  if (currentState === "WaitingInterview") {
    controlNode = (
      <MicrophoneButton key="start" onStart={() => startInterview("candidate-id", "Software Engineer")} />
    );
  } else if (currentState === "Paused") {
    controlNode = (
      <ResumeButton key="resume" onResume={resume} />
    );
  } else if (currentState === "Listening" || currentState === "PlayingTTS") {
    controlNode = (
      <PauseButton key="pause" onPause={pause} />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {controlNode && (
        <motion.div
          key={currentState}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center"
        >
          {controlNode}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
