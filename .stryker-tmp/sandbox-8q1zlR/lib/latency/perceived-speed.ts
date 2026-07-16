// @ts-nocheck
"use client";

import { useState } from "react";

/**
 * Moteur de Présence Conversationnelle (Perceived Speed Layer)
 * Masque la latence LLM avec des signaux de pensée humains.
 */
export const THINKING_CUES = [
  "Je réfléchis à votre point...",
  "D'accord, je vois. Laissez-moi analyser...",
  "C'est un point intéressant. Hm...",
  "Je prends note. Par rapport à cela...",
  "Entendu. Une seconde...",
];

export function getRandomThinkingCue() {
  return THINKING_CUES[Math.floor(Math.random() * THINKING_CUES.length)]!;
}

/**
 * Gère l'état de "Vitesse Perçue"
 */
export function usePerceivedSpeed() {
  const [isThinking, setIsThinking] = useState(false);
  const [currentCue, setCurrentCue] = useState("");

  const startThinking = () => {
    setCurrentCue(getRandomThinkingCue());
    setIsThinking(true);
  };

  const stopThinking = () => {
    setIsThinking(false);
  };

  return { isThinking, currentCue, startThinking, stopThinking };
}
