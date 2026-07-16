import { useCallback, useState } from "react";
import type { LiveScores } from "../types/interview";

const INITIAL_SCORES: LiveScores = {
  communication: 50,
  leadership: 50,
  structure: 50,
  confidence: 50,
  impact: 50,
  stressManagement: 50,
  synthesis: 50,
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

export function useInterviewEvaluation() {
  const [liveScores, setLiveScores] = useState<LiveScores>(INITIAL_SCORES);

  const updateScore = useCallback((key: keyof LiveScores, delta: number) => {
    setLiveScores((previous) => ({
      ...previous,
      [key]: clampScore(previous[key] + delta),
    }));
  }, []);

  const updateScoresBasedOnResponse = useCallback(
    (responseLength: number, quality: "short" | "good" | "long" | "excellent") => {
      const delta = quality === "excellent" ? 5 : quality === "good" ? 3 : quality === "long" ? 1 : -2;

      setLiveScores((previous) => ({
        ...previous,
        communication: clampScore(previous.communication + delta + (responseLength < 50 ? -3 : 0)),
        confidence: clampScore(previous.confidence + delta),
        structure: clampScore(previous.structure + delta),
        leadership: clampScore(previous.leadership + (quality === "excellent" ? 3 : 0)),
        impact: clampScore(previous.impact + (quality === "excellent" ? 3 : 0) + (responseLength < 50 ? -2 : 0)),
        synthesis: clampScore(previous.synthesis + (responseLength > 500 ? -2 : 0)),
      }));
    },
    [],
  );

  const incrementDifficulty = useCallback(() => {
    setLiveScores((previous) => ({
      ...previous,
      stressManagement: clampScore(previous.stressManagement + 2),
    }));
  }, []);

  const resetScores = useCallback(() => setLiveScores(INITIAL_SCORES), []);

  return {
    liveScores,
    updateScore,
    updateScoresBasedOnResponse,
    incrementDifficulty,
    resetScores,
  };
}

