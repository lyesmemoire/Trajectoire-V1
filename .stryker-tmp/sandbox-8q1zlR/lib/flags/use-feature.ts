// @ts-nocheck
"use client";

import { useFeatureFlagEnabled } from "posthog-js/react";

export const FLAGS = {
  ENABLE_DNA: "enable-dna",
  ENABLE_REPLAY: "enable-replay",
  ENABLE_INTERRUPTION_ENGINE: "enable-interruption-engine",

  // AI Behavior Kill Switches
  DISABLE_STRESS_PERSONA: "disable-stress-persona",
  DISABLE_HIGH_PRESSURE: "disable-high-pressure",
  DISABLE_FOLLOWUPS: "disable-followups",

  ENABLE_VOICE_ANALYSIS: "enable-voice-analysis",
  ENABLE_CHALLENGES: "enable-challenges",
};

/**
 * Hook to check if a feature is enabled for the current user.
 */
export function useFeature(flag: string) {
  return useFeatureFlagEnabled(flag);
}
