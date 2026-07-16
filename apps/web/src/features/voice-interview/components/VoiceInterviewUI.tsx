import React, { memo } from "react";
import { useInterview } from "../hooks";

import { InterviewShell } from "./layout";
import { 
  CurrentQuestionCard, 
  InterviewStatusBadge, 
  CompletionCard 
} from "./interview";
import { 
  VoiceHalo, 
  Controls 
} from "./audio";
import { PermissionDialog, ErrorDialog } from "./dialogs";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";

const VoiceInterviewUIBase = memo(function VoiceInterviewUIBase() {
  const { currentState } = useInterview();

  return (
    <InterviewShell>
      {/* Absolute Overlays */}
      <PermissionDialog />
      <ErrorDialog />
      {/* <TelemetryPanel /> Masqué pour réduire la charge cognitive */}

      <AnimatePresence mode="wait">
        {currentState === "Completed" ? (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 1 }}
            className="flex-1 flex"
          >
            <CompletionCard />
          </motion.div>
        ) : (
          <motion.div 
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex-1 flex flex-col pt-12"
          >
            
            {/* The space is mostly empty. We show the status text, then the halo, then the single action button */}
            
            <div className="flex-1 flex flex-col justify-center items-center">
              <CurrentQuestionCard />
              <InterviewStatusBadge />
              <VoiceHalo />
            </div>

            <div className="h-32 flex items-center justify-center">
              <Controls />
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </InterviewShell>
  );
});

export const VoiceInterviewUI = memo(function VoiceInterviewUIRoot() {
  return (
    <LazyMotion features={domAnimation}>
      <VoiceInterviewUIBase />
    </LazyMotion>
  );
});
