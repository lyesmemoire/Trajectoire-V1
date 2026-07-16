import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview, useAudio } from "../../../hooks";
import { HaloState } from "./HaloState";
import { useHaloAnimation } from "./useHaloAnimation";
import { haloPresets } from "./HaloPresets";

export const VoiceHalo = memo(function VoiceHalo() {
  const { currentState } = useInterview();
  const { microphoneLevel } = useAudio();

  let haloState: HaloState = "waiting";
  
  if (currentState === "Listening") haloState = "candidateSpeaking";
  if (currentState === "WaitingAI") haloState = "thinking";
  if (currentState === "PlayingTTS") haloState = "aiSpeaking";
  if (currentState === "WaitingInterview" || currentState === "Paused") haloState = "listening"; // default gentle breathing

  const { scale, opacity } = useHaloAnimation(haloState, microphoneLevel);
  const blur = haloPresets[haloState]?.blur || 24;

  const baseSize = 140;

  return (
    <div className="flex justify-center items-center h-[240px] w-full my-12" aria-hidden="true">
      <div className="relative flex justify-center items-center">
        <AnimatePresence>
          {/* Halo externe très diffus */}
          <motion.div
            className="absolute rounded-full bg-primary-soft pointer-events-none"
            style={{ 
              width: baseSize * 1.8, 
              height: baseSize * 1.8,
              scale,
              opacity,
              filter: `blur(${blur}px)`
            }}
          />
          {/* Halo interne moins diffus */}
          <motion.div
            className="absolute rounded-full bg-primary pointer-events-none"
            style={{ 
              width: baseSize * 1.2, 
              height: baseSize * 1.2,
              scale,
              opacity: opacity, // will be driven by motion value
              filter: `blur(${blur * 0.75}px)`
            }}
          />
          {/* Cœur */}
          <motion.div 
            className="relative rounded-full bg-surface shadow-primary-hover pointer-events-none"
            style={{ 
              width: baseSize * 0.45, 
              height: baseSize * 0.45,
            }}
            animate={{ 
              opacity: haloState === "aiSpeaking" || haloState === "candidateSpeaking" ? 0.95 : 0.7 
            }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
});
