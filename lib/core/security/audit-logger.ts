export enum AuditEventType {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_FAILED = "REGISTER_FAILED",
  LOGOUT = "LOGOUT",
  PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS",
  EMAIL_VERIFICATION_SENT = "EMAIL_VERIFICATION_SENT",
}

interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  timestamp: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export class AuditLogger {
  private static instance: AuditLogger;

  private constructor() {}

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  log(entry: AuditLogEntry): void {
    // Structured log output
    const logEntry = {
      level: "AUDIT",
      event: entry.eventType,
      userId: entry.userId || "anonymous",
      email: this.sanitizeEmail(entry.email),
      ip: entry.ip,
      userAgent: this.sanitizeUserAgent(entry.userAgent),
      timestamp: entry.timestamp,
      correlationId: entry.correlationId,
      metadata: entry.metadata,
    };

    console.log(JSON.stringify(logEntry));
  }

  private sanitizeEmail(email?: string): string | undefined {
    if (!email) return undefined;
    const [localPart, domain] = email.split("@");
    if (domain && localPart) {
      // Show first 2 chars of local part + domain
      return `${localPart.substring(0, 2)}***@${domain}`;
    }
    return "***@***";
  }

  private sanitizeUserAgent(userAgent?: string): string | undefined {
    if (!userAgent) return undefined;
    // Truncate to 100 chars to avoid overly long logs
    return userAgent.substring(0, 100);
  }

  logLoginSuccess(userId: string, email: string, ip?: string, userAgent?: string, correlationId?: string): void {
    this.log({
      eventType: AuditEventType.LOGIN_SUCCESS,
      userId,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }

  logLoginFailed(email: string, ip?: string, userAgent?: string, correlationId?: string, reason?: string): void {
    this.log({
      eventType: AuditEventType.LOGIN_FAILED,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      correlationId,
      metadata: { reason },
    });
  }

  logRegisterSuccess(userId: string, email: string, ip?: string, userAgent?: string, correlationId?: string): void {
    this.log({
      eventType: AuditEventType.REGISTER_SUCCESS,
      userId,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }

  logRegisterFailed(email: string, ip?: string, userAgent?: string, correlationId?: string, reason?: string): void {
    this.log({
      eventType: AuditEventType.REGISTER_FAILED,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      correlationId,
      metadata: { reason },
    });
  }

  logLogout(userId: string, email?: string, ip?: string, userAgent?: string, correlationId?: string): void {
    this.log({
      eventType: AuditEventType.LOGOUT,
      userId,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }

  logPasswordResetRequest(email: string, ip?: string, userAgent?: string, correlationId?: string): void {
    this.log({
      eventType: AuditEventType.PASSWORD_RESET_REQUEST,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }

  logPasswordResetSuccess(userId: string, email: string, ip?: string, userAgent?: string, correlationId?: string): void {
    this.log({
      eventType: AuditEventType.PASSWORD_RESET_SUCCESS,
      userId,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }

  logEmailVerificationSent(email: string, ip?: string, userAgent?: string, correlationId?: string): void {
    this.log({
      eventType: AuditEventType.EMAIL_VERIFICATION_SENT,
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }
}

export const auditLogger = AuditLogger.getInstance();
