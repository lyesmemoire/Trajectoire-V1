import { useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { HaloState } from "./HaloState";
import { HaloPhysics } from "./HaloPhysics";

export function useHaloAnimation(state: HaloState, microphoneLevel: number) {
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0.1);
  const physicsRef = useRef<HaloPhysics | null>(null);

  useEffect(() => {
    if (!physicsRef.current) {
      physicsRef.current = new HaloPhysics(scale, opacity);
    }
  }, [scale, opacity]);

  useEffect(() => {
    if (physicsRef.current) {
      physicsRef.current.applyState(state);
    }
  }, [state]);

  useEffect(() => {
    if (physicsRef.current && state === "candidateSpeaking") {
      physicsRef.current.applyAudioVolume(microphoneLevel, true);
    }
  }, [microphoneLevel, state]);

  return { scale, opacity };
}
