import { CandidateGraph, LiveScores } from "../../../core/intelligence/profile/CandidateIntelligenceGraph";
import { CandidateGraphBuilder } from "../../../core/intelligence/profile/CandidateGraphBuilder";
import { CandidateGraphRepository } from "../infrastructure/repositories/CandidateGraphRepository";
import { CandidateGraphDataLoader } from "../../../core/intelligence/profile/CandidateGraphDataLoader";
import { CandidateGraphSnapshot } from "../../../core/intelligence/profile/CandidateGraphSnapshot";
import { CandidateIntelligenceGraph } from "../../../core/intelligence/profile/CandidateIntelligenceGraph";

/**
 * Candidate Graph Service
 *
 * Responsibilities:
 * - Business logic for CandidateGraph operations
 * - Orchestrate repository, builder, and data loader
 * - Handle graph updates and snapshots
 * 
 * This is the application layer. It contains business logic.
 * The hook (useCandidateGraph) only handles React state.
 */

export class CandidateGraphService {
  /**
   * Load candidate graph for user
   * - First try to load existing graph from repository
   * - If not found, load real data and build new graph
   */
  static async loadGraph(userId: string): Promise<CandidateGraph | null> {
    // Try to load existing graph from repository
    const loadedGraph = await CandidateGraphRepository.findByUserId(userId);
    
    if (loadedGraph) {
      return loadedGraph;
    }

    // If no graph exists, load real data and build new graph
    const inputData = await CandidateGraphDataLoader.loadFromRealData(userId);
    
    if (inputData) {
      const newGraph = CandidateGraphBuilder.build(inputData);
      const saved = await CandidateGraphRepository.save(userId, newGraph);
      
      if (saved) {
        return newGraph;
      } else {
        throw new Error("Failed to save new candidate graph");
      }
    } else {
      throw new Error("Failed to load candidate data");
    }
  }

  /**
   * Update candidate graph with partial updates
   */
  static async updateGraph(userId: string, updates: Partial<CandidateGraph>): Promise<CandidateGraph> {
    const existing = await CandidateGraphRepository.findByUserId(userId);
    
    if (!existing) {
      throw new Error("Candidate graph not found");
    }

    const updated = { ...existing, ...updates };
    const success = await CandidateGraphRepository.save(userId, updated);

    if (!success) {
      throw new Error("Failed to save candidate graph");
    }

    return updated;
  }

  /**
   * Update candidate graph with new scores
   * Uses CandidateIntelligenceGraph to update scores properly
   */
  static async updateScores(userId: string, graph: CandidateGraph | null, scores: LiveScores): Promise<CandidateGraph> {
    if (!graph) {
      throw new Error("Candidate graph not loaded");
    }

    const updated = CandidateIntelligenceGraph.updateWithScores(graph, scores);
    const success = await CandidateGraphRepository.save(userId, updated);

    if (!success) {
      throw new Error("Failed to save candidate graph");
    }

    return updated;
  }

  /**
   * Create snapshot for history tracking
   */
  static async createSnapshot(userId: string, graph: CandidateGraph, context?: string): Promise<boolean> {
    const snapshot = CandidateGraphSnapshot.create(graph, context);
    return await CandidateGraphRepository.createSnapshot(userId, snapshot.graph, context);
  }

  /**
   * Get snapshots for user
   */
  static async getSnapshots(userId: string, limit: number = 10): Promise<CandidateGraph[]> {
    return await CandidateGraphRepository.getSnapshots(userId, limit);
  }

  /**
   * Delete candidate graph for user
   */
  static async deleteGraph(userId: string): Promise<boolean> {
    return await CandidateGraphRepository.delete(userId);
  }
}
