// @ts-nocheck
export interface SecurityAuditRecord {
  tenantId: string;
  sessionId?: string;
  eventId: string;
  reason: string;
  timestamp: number;
  sourceIp?: string;
}

export interface SecurityAuditStore {
  logRejection(record: SecurityAuditRecord): Promise<void>;
}
