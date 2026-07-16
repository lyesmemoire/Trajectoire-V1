import { useState, useEffect, useCallback } from "react";
import { CandidateGraph, LiveScores } from "./CandidateIntelligenceGraph";
import { CandidateGraphService } from "../../../lib/intelligence/application/CandidateGraphService";

/**
 * Hook for managing CandidateGraph
 *
 * Responsibilities:
 * - Provide React state management for CandidateGraph
 * - Delegate all business logic to CandidateGraphService
 * - Handle loading and error states
 * 
 * NOTE: This is a pure React hook. No business logic here.
 * All business logic is in CandidateGraphService.
 */

export interface UseCandidateGraphResult {
  graph: CandidateGraph | null;
  loading: boolean;
  error: string | null;
  updateGraph: (updates: Partial<CandidateGraph>) => Promise<void>;
  updateScores: (scores: LiveScores) => Promise<void>;
  createSnapshot: (context?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useCandidateGraph(userId: string): UseCandidateGraphResult {
  const [graph, setGraph] = useState<CandidateGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load graph from service on mount
  useEffect(() => {
    loadGraph();
  }, [userId]);

  const loadGraph = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loadedGraph = await CandidateGraphService.loadGraph(userId);
      setGraph(loadedGraph);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidate graph");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateGraph = useCallback(async (updates: Partial<CandidateGraph>) => {
    try {
      const updated = await CandidateGraphService.updateGraph(userId, updates);
      setGraph(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update candidate graph");
    }
  }, [userId]);

  const updateScores = useCallback(async (scores: LiveScores) => {
    try {
      const updated = await CandidateGraphService.updateScores(userId, graph, scores);
      setGraph(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update scores");
    }
  }, [userId, graph]);

  const createSnapshot = useCallback(async (context?: string) => {
    if (!graph) return false;

    try {
      return await CandidateGraphService.createSnapshot(userId, graph, context);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create snapshot");
      return false;
    }
  }, [userId, graph]);

  const refresh = useCallback(async () => {
    await loadGraph();
  }, [loadGraph]);

  return {
    graph,
    loading,
    error,
    updateGraph,
    updateScores,
    createSnapshot,
    refresh,
  };
}
