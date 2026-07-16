// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import { ReplayAnalytics } from "@/lib/replay-analytics/track-replay-engagement";
import { track } from "@/lib/analytics";

interface Props {
  sessionId: string;
  score: number;
}

export function ReplayTracker({ sessionId, score }: Props) {
  const startTime = useRef(Date.now());
  const hasSentReturn = useRef(false);

  useEffect(() => {
    const storageKey = `replay_seen_${sessionId}`;
    const isFirstTime = !sessionStorage.getItem(storageKey);

    ReplayAnalytics.opened(sessionId, isFirstTime);

    if (isFirstTime) {
      sessionStorage.setItem(storageKey, "true");

      // Track "Time to Wow" (Approximation based on first results view)
      // If score is high or it's a first completed session
      if (score > 70) {
        track("wow_moment_hit", {
          sessionId,
          type: "high_score_reveal",
          timestamp: Date.now(),
        });
      }
    } else {
      hasSentReturn.current = true;
    }

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      if (timeSpent > 30) {
        ReplayAnalytics.completed(sessionId, timeSpent);
      } else {
        ReplayAnalytics.abandoned(sessionId, 0);
      }
    };
  }, [sessionId, score]);

  return null;
}
