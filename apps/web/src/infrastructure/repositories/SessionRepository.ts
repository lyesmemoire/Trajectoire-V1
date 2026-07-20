/**
 * SessionRepository
 * Repository for interview_sessions table
 * Handles all database operations for sessions
 */

import { createClient } from "@/lib/supabase/server";
import { IRepository, QueryOptions } from "@/core/interfaces/IRepository";
import { AppError, ErrorCode, ConflictError } from "@/core/errors";
import { ITransaction } from "@/core/database/Transaction";

export interface InterviewSession {
  id: string;
  user_id: string;
  job_title: string;
  level: string;
  interview_type: "RH" | "Technique" | "Manager";
  duration_seconds: number;
  status: "in_progress" | "completed" | "cancelled";
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export class	SessionRepository implements IRepository<InterviewSession> {
  // Colonnes optimisées pour éviter SELECT *
  private readonly SESSION_COLUMNS = [
    "id",
    "user_id",
    "job_title",
    "level",
    "interview_type",
    "duration_seconds",
    "status",
    "started_at",
    "completed_at",
    "created_at",
    "updated_at",
    "version",
  ].join(",");

  /**
   * Find session by ID
   */
  async findById(id: string): Promise<InterviewSession | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("interview_sessions")
      .select(this.SESSION_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      throw new AppError(
        `Failed to fetch session: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data as unknown as InterviewSession;
  }

  /**
   * Find sessions matching criteria
   */
  async find(criteria: Partial<InterviewSession>, options?: QueryOptions): Promise<InterviewSession[]> {
    const supabase = await createClient();
    let query = supabase.from("interview_sessions").select(this.SESSION_COLUMNS);

    // Apply filters
    if (criteria.user_id) {
      query = query.eq("user_id", criteria.user_id);
    }
    if (criteria.status) {
      query = query.eq("status", criteria.status);
    }
    if (criteria.interview_type) {
      query = query.eq("interview_type", criteria.interview_type);
    }

    // Apply ordering
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }

    // Apply pagination (default limit 50)
    const limit = options?.limit || 50;
    query = query.limit(limit);

    if (options?.offset) {
      query = query.range(options.offset, options.offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(
        `Failed to fetch sessions: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return (data as unknown as InterviewSession[]) || [];
  }

  /**
   * Find one session matching criteria
   */
  async findOne(criteria: Partial<InterviewSession>): Promise<InterviewSession | null> {
    const sessions = await this.find(criteria, { limit: 1 });
    return sessions[0] || null;
  }

  /**
   * Create a new session
   * @param entity - Session data
   * @param transaction - Optional transaction
   */
  async create(
    entity: Omit<InterviewSession, "id" | "created_at" | "updated_at" | "version">,
    transaction?: ITransaction
  ): Promise<InterviewSession> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("interview_sessions")
      .insert({
        ...entity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
      })
      .select()
      .single();

    if (error) {
      throw new AppError(
        `Failed to create session: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Update a session with optimistic locking
   * @param id - Session ID
   * @param updates - Updates to apply
   * @param transaction - Optional transaction
   */
  async update(
    id: string,
    updates: Partial<InterviewSession>,
    transaction?: ITransaction
  ): Promise<InterviewSession> {
    const supabase = await createClient();
    
    // Get current version if not provided
    const currentVersion = updates.version;
    if (currentVersion === undefined) {
      const { data: current } = await supabase
        .from("interview_sessions")
        .select("version")
        .eq("id", id)
        .single();
      
      if (!current) {
        throw new AppError("Session not found", ErrorCode.NOT_FOUND, 404);
      }
      
      updates.version = current.version;
    }

    // Increment version for update
    const newVersion = (updates.version || 0) + 1;

    const { data, error } = await supabase
      .from("interview_sessions")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        version: newVersion,
      })
      .eq("id", id)
      .eq("version", updates.version)
      .select()
      .single();

    if (error) {
      // Check if it's a conflict (0 rows updated due to version mismatch)
      if (error.code === "PGRST116") {
        throw new ConflictError(
          "Session was modified by another user. Please refresh and try again.",
          { sessionId: id, expectedVersion: updates.version }
        );
      }
      throw new AppError(
        `Failed to update session: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Delete a session
   * @param id - Session ID
   * @param transaction - Optional transaction
   */
  async delete(id: string, transaction?: ITransaction): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from("interview_sessions").delete().eq("id", id);

    if (error) {
      throw new AppError(
        `Failed to delete session: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return true;
  }

  /**
   * Count sessions matching criteria
   */
  async count(criteria?: Partial<InterviewSession>): Promise<number> {
    const supabase = await createClient();
    let query = supabase.from("interview_sessions").select("*", { count: "exact", head: true });

    if (criteria?.user_id) {
      query = query.eq("user_id", criteria.user_id);
    }
    if (criteria?.status) {
      query = query.eq("status", criteria.status);
    }

    const { count, error } = await query;

    if (error) {
      throw new AppError(
        `Failed to count sessions: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return count || 0;
  }

  /**
   * Get total duration for a user
   */
  async getTotalDuration(userId: string): Promise<number> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("duration_seconds")
      .eq("user_id", userId)
      .eq("status", "completed");

    if (error) {
      throw new AppError(
        `Failed to fetch duration: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data?.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) || 0;
  }
}
