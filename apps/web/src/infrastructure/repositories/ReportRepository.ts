/**
 * ReportRepository
 * Repository for reports table
 * Handles all database operations for reports
 */

import { createClient } from "@/lib/supabase/server";
import { IRepository, QueryOptions } from "@/core/interfaces/IRepository";
import { AppError, ErrorCode, ConflictError } from "@/core/errors";
import { ITransaction } from "@/core/database/Transaction";

export interface Report {
  id: string;
  session_id: string;
  overall_score: number;
  communication: number;
  technical: number;
  confidence: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  recommendation: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export class ReportRepository implements IRepository<Report> {
  // Colonnes optimisées pour éviter SELECT *
  private readonly REPORT_COLUMNS = [
    "id",
    "session_id",
    "overall_score",
    "communication",
    "technical",
    "confidence",
    "strengths",
    "improvements",
    "summary",
    "recommendation",
    "created_at",
    "updated_at",
    "version",
  ].join(",");

  /**
   * Find report by ID
   */
  async findById(id: string): Promise<Report | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reports")
      .select(this.REPORT_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      throw new AppError(
        `Failed to fetch report: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data as unknown as Report;
  }

  /**
   * Find reports matching criteria
   */
  async find(criteria: Partial<Report>, options?: QueryOptions): Promise<Report[]> {
    const supabase = await createClient();
    let query = supabase.from("reports").select(this.REPORT_COLUMNS);

    if (criteria.session_id) {
      query = query.eq("session_id", criteria.session_id);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }

    // Apply pagination (default limit 20 for reports)
    const limit = options?.limit || 20;
    query = query.limit(limit);

    if (options?.offset) {
      query = query.range(options.offset, options.offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(
        `Failed to fetch reports: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return (data as unknown as Report[]) || [];
  }

  /**
   * Find one report matching criteria
   */
  async findOne(criteria: Partial<Report>): Promise<Report | null> {
    const reports = await this.find(criteria, { limit: 1 });
    return reports[0] || null;
  }

  /**
   * Create a new report with UPSERT (INSERT ON CONFLICT DO NOTHING)
   * Prevents duplicate reports for the same session
   * @param entity - Report data
   * @param transaction - Optional transaction
   */
  async create(
    entity: Omit<Report, "id" | "created_at" | "updated_at" | "version">,
    transaction?: ITransaction
  ): Promise<Report> {
    const supabase = await createClient();
    
    // Try to insert, if conflict on session_id, return existing report
    const { data, error } = await supabase
      .from("reports")
      .insert({
        ...entity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
      })
      .select()
      .single();

    if (error) {
      // If duplicate key error, fetch existing report
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("reports")
          .select("*")
          .eq("session_id", entity.session_id)
          .single();
        
        if (existing) {
          return existing;
        }
      }
      
      throw new AppError(
        `Failed to create report: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Update a report with optimistic locking
   * @param id - Report ID
   * @param updates - Updates to apply
   * @param transaction - Optional transaction
   */
  async update(
    id: string,
    updates: Partial<Report>,
    transaction?: ITransaction
  ): Promise<Report> {
    const supabase = await createClient();
    
    // Get current version if not provided
    const currentVersion = updates.version;
    if (currentVersion === undefined) {
      const { data: current } = await supabase
        .from("reports")
        .select("version")
        .eq("id", id)
        .single();
      
      if (!current) {
        throw new AppError("Report not found", ErrorCode.NOT_FOUND, 404);
      }
      
      updates.version = current.version;
    }

    // Increment version for update
    const newVersion = (updates.version || 0) + 1;

    const { data, error } = await supabase
      .from("reports")
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
          "Report was modified by another user. Please refresh and try again.",
          { reportId: id, expectedVersion: updates.version }
        );
      }
      throw new AppError(
        `Failed to update report: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Delete a report
   * @param id - Report ID
   * @param transaction - Optional transaction
   */
  async delete(id: string, transaction?: ITransaction): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from("reports").delete().eq("id", id);

    if (error) {
      throw new AppError(
        `Failed to delete report: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return true;
  }

  /**
   * Count reports matching criteria
   */
  async count(criteria?: Partial<Report>): Promise<number> {
    const supabase = await createClient();
    let query = supabase.from("reports").select("*", { count: "exact", head: true });

    if (criteria?.session_id) {
      query = query.eq("session_id", criteria.session_id);
    }

    const { count, error } = await query;

    if (error) {
      throw new AppError(
        `Failed to count reports: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return count || 0;
  }

  /**
   * Get report by session ID
   */
  async getBySessionId(sessionId: string): Promise<Report | null> {
    return this.findOne({ session_id: sessionId });
  }
}
