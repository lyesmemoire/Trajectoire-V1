/**
 * Idempotency Service
 * Prevents duplicate execution of operations using idempotency keys
 * Ensures that the same request with the same key produces the same result
 */

import { createClient } from "@/lib/supabase/server";
import { AppError, ErrorCode } from "@/core/errors";
import { logger } from "@/lib/logger/Logger";

export interface IdempotencyRecord {
  id: string;
  idempotency_key: string;
  user_id: string;
  operation: string;
  request_params: string; // JSON stringified
  response_data: string; // JSON stringified
  status: "pending" | "completed" | "failed";
  created_at: string;
  completed_at?: string;
  expires_at: string;
}

export interface IdempotencyResult<T> {
  isCached: boolean;
  data?: T;
  error?: Error;
}

export class IdempotencyService {
  private static readonly TABLE_NAME = "idempotency";
  private static readonly EXPIRY_HOURS = 24; // 24 hours

  /**
   * Check if an operation with the given idempotency key has already been executed
   * @param idempotencyKey - Unique key for the operation
   * @param userId - User ID
   * @param operation - Operation name
   * @returns Result with cached data if exists
   */
  async check<T>(
    idempotencyKey: string,
    userId: string,
    operation: string
  ): Promise<IdempotencyResult<T>> {
    const supabase = await createClient();

    // Check for existing record
    const { data, error } = await supabase
      .from(IdempotencyService.TABLE_NAME)
      .select("*")
      .eq("idempotency_key", idempotencyKey)
      .eq("user_id", userId)
      .eq("operation", operation)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (error && error.code !== "PGRST116") {
      throw new AppError(
        `Failed to check idempotency: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    if (!data) {
      // No existing record, operation can proceed
      return { isCached: false };
    }

    // Record exists, return cached result
    if (data.status === "completed") {
      logger.info("Returning cached idempotency result", {
        idempotencyKey,
        operation,
        userId,
      });

      try {
        const responseData = JSON.parse(data.response_data);
        return { isCached: true, data: responseData as T };
      } catch (parseError) {
        throw new AppError(
          "Failed to parse cached response",
          ErrorCode.INTERNAL_ERROR,
          500
        );
      }
    }

    // Operation is still pending
    throw new AppError(
      "Operation is already in progress",
      ErrorCode.CONFLICT,
      409
    );
  }

  /**
   * Create a new idempotency record for an operation
   * @param idempotencyKey - Unique key for the operation
   * @param userId - User ID
   * @param operation - Operation name
   * @param requestParams - Request parameters (will be JSON stringified)
   */
  async create(
    idempotencyKey: string,
    userId: string,
    operation: string,
    requestParams: unknown
  ): Promise<void> {
    const supabase = await createClient();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + IdempotencyService.EXPIRY_HOURS);

    const { error } = await supabase.from(IdempotencyService.TABLE_NAME).insert({
      idempotency_key: idempotencyKey,
      user_id: userId,
      operation,
      request_params: JSON.stringify(requestParams),
      status: "pending",
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      // If duplicate key, it means another request is already processing
      if (error.code === "23505") {
        throw new AppError(
          "Operation is already in progress",
          ErrorCode.CONFLICT,
          409
        );
      }
      throw new AppError(
        `Failed to create idempotency record: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    logger.info("Created idempotency record", {
      idempotencyKey,
      operation,
      userId,
    });
  }

  /**
   * Mark an operation as completed with the result
   * @param idempotencyKey - Unique key for the operation
   * @param userId - User ID
   * @param operation - Operation name
   * @param responseData - Response data (will be JSON stringified)
   */
  async complete<T>(
    idempotencyKey: string,
    userId: string,
    operation: string,
    responseData: T
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(IdempotencyService.TABLE_NAME)
      .update({
        response_data: JSON.stringify(responseData),
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("idempotency_key", idempotencyKey)
      .eq("user_id", userId)
      .eq("operation", operation);

    if (error) {
      logger.error("Failed to complete idempotency record", {
        idempotencyKey,
        operation,
        userId,
        error: error.message,
      });
      // Don't throw error here, as the operation already succeeded
      return;
    }

    logger.info("Completed idempotency record", {
      idempotencyKey,
      operation,
      userId,
    });
  }

  /**
   * Mark an operation as failed
   * @param idempotencyKey - Unique key for the operation
   * @param userId - User ID
   * @param operation - Operation name
   * @param error - Error that occurred
   */
  async fail(
    idempotencyKey: string,
    userId: string,
    operation: string,
    error: Error
  ): Promise<void> {
    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from(IdempotencyService.TABLE_NAME)
      .update({
        response_data: JSON.stringify({ error: error.message }),
        status: "failed",
        completed_at: new Date().toISOString(),
      })
      .eq("idempotency_key", idempotencyKey)
      .eq("user_id", userId)
      .eq("operation", operation);

    if (updateError) {
      logger.error("Failed to mark idempotency record as failed", {
        idempotencyKey,
        operation,
        userId,
        error: updateError.message,
      });
      return;
    }

    logger.info("Marked idempotency record as failed", {
      idempotencyKey,
      operation,
      userId,
    });
  }

  /**
   * Execute a function with idempotency protection
   * @param idempotencyKey - Unique key for the operation
   * @param userId - User ID
   * @param operation - Operation name
   * @param requestParams - Request parameters
   * @param fn - Function to execute
   * @returns Function result (cached or fresh)
   */
  async execute<T>(
    idempotencyKey: string,
    userId: string,
    operation: string,
    requestParams: unknown,
    fn: () => Promise<T>
  ): Promise<T> {
    // Check if operation was already executed
    const cachedResult = await this.check<T>(idempotencyKey, userId, operation);
    if (cachedResult.isCached && cachedResult.data) {
      return cachedResult.data;
    }

    // Create idempotency record
    await this.create(idempotencyKey, userId, operation, requestParams);

    try {
      // Execute the operation
      const result = await fn();

      // Mark as completed
      await this.complete(idempotencyKey, userId, operation, result);

      return result;
    } catch (error) {
      // Mark as failed
      await this.fail(
        idempotencyKey,
        userId,
        operation,
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * Clean up expired idempotency records
   * Should be called periodically (e.g., via cron job)
   */
  async cleanup(): Promise<number> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(IdempotencyService.TABLE_NAME)
      .delete()
      .lt("expires_at", new Date().toISOString());

    if (error) {
      logger.error("Failed to cleanup idempotency records", { error: error.message });
      return 0;
    }

    logger.info("Cleaned up expired idempotency records");
    return 1;
  }
}
