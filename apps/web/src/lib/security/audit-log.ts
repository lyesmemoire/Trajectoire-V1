import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
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
  [key: string]: unknown;
}

export async function logEvent(
  userId: string,
  action: AuditAction,
  details: AuditDetails = {},
  ip?: string,
  userAgent?: string,
  requestId?: string
): Promise<void> {
  try {
    const metadata = {
      resourceType: "system",
      details,
      ...(requestId
        ? {
            requestId,
          }
        : {}),
    } as Prisma.InputJsonObject;

    await prisma.adminAuditLog.create({
      data: {
        adminId: userId,
        action,
        targetId: null,
        metadata,
        ipAddress: ip ?? null,
        userAgent:
          userAgent ?? null,
      },
    });
  } catch (error) {
    logError(
      "[AUDIT_LOG_ERROR]",
      error
    );
  }
}


