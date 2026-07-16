// @ts-nocheck
import "server-only";
import { createAdminClientSupabase } from "@/lib/supabase/admin";

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
  [key: string]: unknown;
}

export async function logEvent(
  userId: string,
  action: AuditAction,
  details: AuditDetails = {},
  ip?: string,
  userAgent?: string,
  requestId?: string,
): Promise<void> {
  try {
    const supabase = createAdminClientSupabase();
    await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      details,
      ip,
      user_agent: userAgent,
      request_id: requestId,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
}
