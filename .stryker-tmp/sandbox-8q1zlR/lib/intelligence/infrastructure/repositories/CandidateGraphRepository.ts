// @ts-nocheck
import { CandidateGraph } from "../../../../core/intelligence/profile/CandidateIntelligenceGraph";
import { supabase } from "../../../../lib/supabase/client";

/**
 * Candidate Graph Repository
 *
 * Responsibilities:
 * - Persist CandidateGraph to Supabase
 * - Retrieve CandidateGraph from Supabase
 * - Update CandidateGraph on user actions
 * - Create snapshots for history
 * 
 * NOTE: This is an infrastructure layer component.
 * The domain (core/intelligence) should not know about Supabase.
 */

export interface CandidateGraphStorage {
  id: string;
  user_id: string;
  graph: CandidateGraph;
  created_at: string;
  updated_at: string;
}

export class CandidateGraphRepository {
  private static readonly TABLE_NAME = "candidate_graphs";

  /**
   * Find candidate graph by user ID
   */
  static async findByUserId(userId: string): Promise<CandidateGraph | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("graph")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching candidate graph:", error);
      return null;
    }

    return data?.graph || null;
  }

  /**
   * Save candidate graph for user
   */
  static async save(userId: string, graph: CandidateGraph): Promise<boolean> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .upsert({
        user_id: userId,
        graph,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error saving candidate graph:", error);
      return false;
    }

    return true;
  }

  /**
   * Update candidate graph for user
   */
  static async update(userId: string, updates: Partial<CandidateGraph>): Promise<boolean> {
    const existing = await this.findByUserId(userId);
    if (!existing) {
      return false;
    }

    const updated = { ...existing, ...updates };
    return await this.save(userId, updated);
  }

  /**
   * Delete candidate graph for user
   */
  static async delete(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting candidate graph:", error);
      return false;
    }

    return true;
  }

  /**
   * Create snapshot for history
   */
  static async createSnapshot(userId: string, graph: CandidateGraph, context?: string): Promise<boolean> {
    const { error } = await supabase
      .from("candidate_graph_snapshots")
      .insert({
        user_id: userId,
        graph,
        context,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error creating snapshot:", error);
      return false;
    }

    return true;
  }

  /**
   * Get snapshots for user
   */
  static async getSnapshots(userId: string, limit: number = 10): Promise<CandidateGraph[]> {
    const { data, error } = await supabase
      .from("candidate_graph_snapshots")
      .select("graph")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching snapshots:", error);
      return [];
    }

    return data?.map((s: any) => s.graph) || [];
  }
}
