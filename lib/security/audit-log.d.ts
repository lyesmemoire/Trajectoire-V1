import "server-only";
export type AuditAction = "CV_UPLOAD" | "CV_REWRITE" | "DOCX_EXPORT" | "ATS_SCORE" | "INTERVIEW_START" | "INTERVIEW_CONTINUE" | "INTERVIEW_END" | "PREMIUM_UNLOCK" | "LOGIN" | "LOGOUT" | "RATE_LIMIT_HIT" | "STREAM_ABORT" | "STREAM_ERROR" | "AI_ERROR";
export interface AuditDetails {
    [key: string]: unknown;
}
export declare function logEvent(userId: string, action: AuditAction, details?: AuditDetails, ip?: string, userAgent?: string, requestId?: string): Promise<void>;
//# sourceMappingURL=audit-log.d.ts.map