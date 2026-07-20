/**
 * MessageRepository
 * Repository for interview_messages table
 * Handles all database operations for messages
 */

import { createClient } from "@/lib/supabase/server";
import { IRepository, QueryOptions } from "@/core/interfaces/IRepository";
import { AppError, ErrorCode, ConflictError } from "@/core/errors";
import { ITransaction } from "@/core/database/Transaction";

export interface InterviewMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  version: number;
}

export class MessageRepository implements IRepository<InterviewMessage> {
  // Colonnes optimisées pour éviter SELECT *
  private readonly MESSAGE_COLUMNS = [
    "id",
    "session_id",
    "role",
    "content",
    "created_at",
    "version",
  ].join(",");

  /**
   * Find message by ID
   */
  async findById(id: string): Promise<InterviewMessage | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("interview_messages")
      .select(this.MESSAGE_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      throw new AppError(
        `Failed to fetch message: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data as unknown as InterviewMessage;
  }

  /**
   * Find messages matching criteria
   */
  async find(criteria: Partial<InterviewMessage>, options?: QueryOptions): Promise<InterviewMessage[]> {
    const supabase = await createClient();
    let query = supabase.from("interview_messages").select(this.MESSAGE_COLUMNS);

    if (criteria.session_id) {
      query = query.eq("session_id", criteria.session_id);
    }
    if (criteria.role) {
      query = query.eq("role", criteria.role);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }

    // Apply pagination (default limit 20 for messages)
    const limit = options?.limit || 20;
    query = query.limit(limit);

    if (options?.offset) {
      query = query.range(options.offset, options.offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(
        `Failed to fetch messages: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return (data as unknown as InterviewMessage[]) || [];
  }

  /**
   * Find one message matching criteria
   */
  async findOne(criteria: Partial<InterviewMessage>): Promise<InterviewMessage | null> {
    const messages = await this.find(criteria, { limit: 1 });
    return messages[0] || null;
  }

  /**
   * Create a new message
   * @param entity - Message data
   * @param transaction - Optional transaction
   */
  async create(
    entity: Omit<InterviewMessage, "id" | "created_at" | "version">,
    transaction?: ITransaction
  ): Promise<InterviewMessage> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("interview_messages")
      .insert({
        ...entity,
        created_at: new Date().toISOString(),
        version: 1,
      })
      .select()
      .single();

    if (error) {
      throw new AppError(
        `Failed to create message: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Update a message with optimistic locking
   * @param id - Message ID
   * @param updates - Updates to apply
   * @param transaction - Optional transaction
   */
  async update(
    id: string,
    updates: Partial<InterviewMessage>,
    transaction?: ITransaction
  ): Promise<InterviewMessage> {
    const supabase = await createClient();
    
    // Get current version if not provided
    const currentVersion = updates.version;
    if (currentVersion === undefined) {
      const { data: current } = await supabase
        .from("interview_messages")
        .select("version")
        .eq("id", id)
        .single();
      
      if (!current) {
        throw new AppError("Message not found", ErrorCode.NOT_FOUND, 404);
      }
      
      updates.version = current.version;
    }

    // Increment version for update
    const newVersion = (updates.version || 0) + 1;

    const { data, error } = await supabase
      .from("interview_messages")
      .update({
        ...updates,
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
          "Message was modified by another user. Please refresh and try again.",
          { messageId: id, expectedVersion: updates.version }
        );
      }
      throw new AppError(
        `Failed to update message: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Delete a message
   * @param id - Message ID
   * @param transaction - Optional transaction
   */
  async delete(id: string, transaction?: ITransaction): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from("interview_messages").delete().eq("id", id);

    if (error) {
      throw new AppError(
        `Failed to delete message: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return true;
  }

  /**
   * Count messages matching criteria
   */
  async count(criteria?: Partial<InterviewMessage>): Promise<number> {
    const supabase = await createClient();
    // Optimisation: utiliser "id" au lieu de "*" pour le count
    let query = supabase.from("interview_messages").select("id", { count: "exact", head: true });

    if (criteria?.session_id) {
      query = query.eq("session_id", criteria.session_id);
    }
    if (criteria?.role) {
      query = query.eq("role", criteria.role);
    }

    const { count, error } = await query;

    if (error) {
      throw new AppError(
        `Failed to count messages: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return count || 0;
  }

  /**
   * Get all messages for a session
   */
  async getBySessionId(sessionId: string): Promise<InterviewMessage[]> {
    return this.find({ session_id: sessionId }, { orderBy: "created_at", ascending: true });
  }

  /**
   * Delete all messages for a session
   */
  async deleteBySessionId(sessionId: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from("interview_messages").delete().eq("session_id", sessionId);

    if (error) {
      throw new AppError(
        `Failed to delete messages: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return true;
  }
}
