// @ts-nocheck
"use client";

import { useCallback, useRef } from "react";

/**
 * Hook de Fingerprinting UX (Session DNA).
 * Collecte les signaux de micro-comportements (vitesse, hésitation, friction).
 */
export function useUXFingerprint(sessionId: string) {
  const clickTimes = useRef<number[]>([]);
  const keyTimes = useRef<number[]>([]);
  const lastScrollPos = useRef(0);
  const scrollEntropy = useRef(0);

  const recordClick = useCallback(() => {
    clickTimes.current.push(Date.now());
  }, []);

  const recordKey = useCallback(() => {
    keyTimes.current.push(Date.now());
  }, []);

  const recordScroll = useCallback((pos: number) => {
    const diff = Math.abs(pos - lastScrollPos.current);
    if (diff > 0) scrollEntropy.current += 1;
    lastScrollPos.current = pos;
  }, []);

  const buildFingerprint = useCallback(() => {
    const clicks = clickTimes.current;
    const keys = keyTimes.current;

    // Calcul de la vitesse de frappe moyenne (clics par sec)
    const typingSpeed =
      keys.length > 1
        ? (keys.length / (keys[keys.length - 1]! - keys[0]!)) * 1000
        : 0;

    // Calcul de l'hésitation moyenne entre clics
    let totalDelay = 0;
    for (let i = 1; i < clicks.length; i++) {
      totalDelay += clicks[i]! - clicks[i - 1]!;
    }
    const clickDelayAvg =
      clicks.length > 1 ? totalDelay / (clicks.length - 1) : 0;

    return {
      sessionId,
      typingSpeed: Math.round(typingSpeed * 10) / 10,
      clickDelayAvg: Math.round(clickDelayAvg),
      hesitationIndex: clickDelayAvg > 2000 ? 0.8 : 0.2, // Simple index de stress
      scrollEntropy: scrollEntropy.current,
      timestamp: new Date().toISOString(),
    };
  }, [sessionId]);

  return { recordClick, recordKey, recordScroll, buildFingerprint };
}
