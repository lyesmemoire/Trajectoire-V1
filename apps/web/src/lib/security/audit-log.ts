import "server-only";
import { createAdminClient } from "@/lib/supabase/service";
import { logError } from "@/lib/logger/Logger";

export type AuditAction =
  | "CV_UPLOAD"
  | "CV_REWRITE"
  | "DOCX_EXPORT"
  | "ATS_SCORE"
  | "INTERVIEW_START"
  | "INTERVIEW_CONTINUE"
  | "INTERVIEW_END"
  | "PREMIUM_UNLOCK"
  | "LOGIN"
  | "LOGOUT"
  | "RATE_LIMIT_HIT"
  | "STREAM_ABORT"
  | "STREAM_ERROR"
  | "AI_ERROR";

export interface AuditDetails {
  [key: string]: any;
}

export async function logEvent(userId: string, action: AuditAction, details: AuditDetails = {}, ip?: string, userAgent?: string, requestId?: string, ): Promise<void> {
  try {
    const supabase = createAdminClient();
    await (supabase  as any).from("audit_logs").insert({
      user_id: userId,
      action,
      details,
      ip,
      user_agent: userAgent,
      request_id: requestId,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    logError("[AUDIT_LOG_ERROR]", error);
  }
}
