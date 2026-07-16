// @ts-nocheck
import { useState, useCallback } from "react";
import { LiveScores } from "../types/interview";
import { ScoreEngine } from "@/core/intelligence/engines/scoreEngine";

const INITIAL_SCORES: LiveScores = {
  communication: 50,
  leadership: 50,
  structure: 50,
  confidence: 50,
  impact: 50,
  stressManagement: 50,
  synthesis: 50,
};

export function useInterviewEvaluation() {
  const [liveScores, setLiveScores] = useState<LiveScores>(INITIAL_SCORES);

  const updateScore = useCallback((key: keyof LiveScores, delta: number) => {
    setLiveScores((prev) => ({
      ...prev,
      [key]: ScoreEngine.clampScore(prev[key] + delta),
    }));
  }, []);

  const updateScoresBasedOnResponse = useCallback((responseLength: number, responseQuality: "short" | "good" | "long" | "excellent") => {
    const deltas = ScoreEngine.calculateResponseImpact(responseLength, responseQuality);
    
    setLiveScores((prev) => {
      const updated = { ...prev };
      Object.entries(deltas).forEach(([key, delta]) => {
        if (delta !== undefined) {
          updated[key as keyof LiveScores] = ScoreEngine.clampScore(prev[key as keyof LiveScores] + delta);
        }
      });
      return updated;
    });
  }, []);

  const incrementDifficulty = useCallback(() => {
    setLiveScores((prev) => ScoreEngine.adjustDifficulty(prev));
  }, []);

  const resetScores = useCallback(() => {
    setLiveScores(INITIAL_SCORES);
  }, []);

  return {
    liveScores,
    updateScore,
    updateScoresBasedOnResponse,
    incrementDifficulty,
    resetScores,
  };
}
