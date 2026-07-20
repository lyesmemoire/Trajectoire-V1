/**
 * IAuditService Interface
 * Defines the contract for audit logging implementations
 * Following Dependency Inversion Principle
 */

export interface AuditLogEntry {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface IAuditService {
  /**
   * Log an audit event
   * @param entry - Audit log entry
   */
  log(entry: AuditLogEntry): Promise<void>;

  /**
   * Get audit history for a user
   * @param userId - User ID
   * @param limit - Maximum number of entries
   * @param offset - Offset for pagination
   * @returns Audit log entries
   */
  getUserHistory(userId: string, limit?: number, offset?: number): Promise<AuditLogEntry[]>;

  /**
   * Detect anomalous behavior for a user
   * @param userId - User ID
   * @returns Whether anomalous behavior was detected
   */
  detectAnomaly(userId: string): Promise<boolean>;
}
