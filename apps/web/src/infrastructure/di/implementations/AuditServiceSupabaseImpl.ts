/**
 * AuditServiceSupabase Implementation
 * Implements IAuditService interface using Supabase
 */

import { IAuditService, AuditLogEntry } from "@/core/interfaces";
import { auditLog } from "@/lib/security/auditService";

export class AuditServiceSupabaseImpl implements IAuditService {
  async log(entry: AuditLogEntry): Promise<void> {
    await auditLog(
      entry.userId,
      entry.action as any,
      entry.resourceType as any,
      entry.resourceId,
      entry.metadata as Record<string, unknown>
    );
  }

  async getUserHistory(userId: string, limit: number = 100, offset: number = 0): Promise<AuditLogEntry[]> {
    // Legacy audit service doesn't have getUserHistory, implement if needed
    // For now, return empty array
    return [];
  }

  async detectAnomaly(userId: string): Promise<boolean> {
    // Legacy audit service doesn't have detectAnomaly, implement if needed
    // For now, return false
    return false;
  }
}
