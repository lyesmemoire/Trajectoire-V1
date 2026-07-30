/**
 * Audit Service
 * Logs sensitive operations for compliance and security
 * Tracks who, when, IP, action, result, before, after
 */

import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger/Logger";

export interface AuditLogEntry {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  result: "success" | "failure" | "partial";
  errorMessage?: string;
  beforeValue?: any;
  afterValue?: any;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  private static instance: AuditService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  /**
   * Log an audit entry
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase.from("audit_logs").insert({
        user_id: entry.userId,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        result: entry.result,
        error_message: entry.errorMessage,
        before_value: entry.beforeValue,
        after_value: entry.afterValue,
        metadata: entry.metadata,
      });
    } catch (error) {
      logError("Failed to log audit entry", error);
      // Don't throw - audit logging failure shouldn't break the application
    }
  }

  /**
   * Log a successful action
   */
  async logSuccess(entry: Omit<AuditLogEntry, "result">): Promise<void> {
    await this.log({ ...entry, result: "success" });
  }

  /**
   * Log a failed action
   */
  async logFailure(
    entry: Omit<AuditLogEntry, "result" | "errorMessage">,
    errorMessage: string
  ): Promise<void> {
    await this.log({ ...entry, result: "failure", errorMessage });
  }

  /**
   * Log a partial success action
   */
  async logPartial(
    entry: Omit<AuditLogEntry, "result" | "errorMessage">,
    errorMessage?: string
  ): Promise<void> {
    await this.log({ ...entry, result: "partial", errorMessage });
  }

  /**
   * Get audit logs for a user
   */
  async getUserAuditLogs(
    userId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<unknown[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      logError("Failed to get audit logs", error);
      return [];
    }
  }

  /**
   * Get audit logs for an entity
   */
  async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    limit: number = 100
  ): Promise<unknown[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      logError("Failed to get entity audit logs", error);
      return [];
    }
  }

  /**
   * Get audit logs by action
   */
  async getAuditLogsByAction(
    action: string,
    limit: number = 100
  ): Promise<unknown[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("action", action)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      logError("Failed to get audit logs by action", error);
      return [];
    }
  }

  /**
   * Mask sensitive data in audit logs
   */
  maskSensitiveData(data: any): any {
    if (!data) return data;

    const sensitiveFields = [
      "password",
      "token",
      "apiKey",
      "secret",
      "creditCard",
      "ssn",
      "email",
      "phone",
    ];

    if (typeof data === "object") {
      const masked = { ...data };
      for (const field of sensitiveFields) {
        if (field in masked) {
          masked[field] = "***MASKED***";
        }
      }
      return masked;
    }

    return data;
  }
}

// Export singleton instance
export const auditService = AuditService.getInstance();
