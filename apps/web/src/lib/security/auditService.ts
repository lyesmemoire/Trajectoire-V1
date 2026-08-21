/**
 * Security audit service.
 *
 * Legacy Supabase table removed:
 *   audit_log
 *
 * Canonical persistence:
 *   Prisma AdminAuditLog
 *
 * Public API is preserved for existing callers.
 */

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger/Logger";

export type AuditAction =
  | "user_login"
  | "user_logout"
  | "user_signup"
  | "account_delete"
  | "account_export"
  | "simulation_create"
  | "simulation_message"
  | "simulation_end"
  | "report_generate"
  | "quota_exceeded"
  | "rate_limit_exceeded"
  | "admin_action";

export type ResourceType =
  | "user"
  | "session"
  | "message"
  | "report"
  | "quota"
  | "system";

interface AuditMetadata {
  resourceType: ResourceType;
  details: Record<string, unknown>;
}

export interface AuditHistoryEntry {
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface RecentAuditEntry
  extends AuditHistoryEntry {
  user_id: string;
}


function parseMetadata(
  value: Prisma.JsonValue
): AuditMetadata {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const metadata =
      value as Record<
        string,
        unknown
      >;

    const resourceType =
      typeof metadata.resourceType ===
      "string"
        ? metadata.resourceType
        : "system";

    const details =
      metadata.details &&
      typeof metadata.details ===
        "object" &&
      !Array.isArray(metadata.details)
        ? (
            metadata.details as Record<
              string,
              unknown
            >
          )
        : {};

    return {
      resourceType:
        resourceType as ResourceType,
      details,
    };
  }

  return {
    resourceType: "system",
    details: {},
  };
}


export async function auditLog(
  userId: string,
  action: AuditAction,
  resourceType: ResourceType,
  resourceId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const auditMetadata = {
      resourceType,
      details: metadata ?? {},
    } as Prisma.InputJsonObject;

    await prisma.adminAuditLog.create({
      data: {
        adminId: userId,
        action,
        targetId:
          resourceId ?? null,
        metadata: auditMetadata,
      },
    });
  } catch (error) {
    logError(
      "Audit log error",
      error
    );
  }
}


export async function getUserAuditHistory(
  userId: string,
  limit: number = 100
): Promise<AuditHistoryEntry[]> {
  try {
    const rows =
      await prisma.adminAuditLog.findMany({
        where: {
          adminId: userId,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: limit,
      });

    return rows.map((row) => {
      const metadata =
        parseMetadata(row.metadata);

      return {
        action: row.action,
        resource_type:
          metadata.resourceType,
        resource_id:
          row.targetId,
        metadata:
          metadata.details,
        created_at:
          row.createdAt.toISOString(),
      };
    });
  } catch (error) {
    logError(
      "Get audit history error",
      error
    );

    return [];
  }
}


export async function getRecentAuditLogs(
  limit: number = 100
): Promise<RecentAuditEntry[]> {
  try {
    const rows =
      await prisma.adminAuditLog.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: limit,
      });

    return rows.map((row) => {
      const metadata =
        parseMetadata(row.metadata);

      return {
        user_id: row.adminId,
        action: row.action,
        resource_type:
          metadata.resourceType,
        resource_id:
          row.targetId,
        metadata:
          metadata.details,
        created_at:
          row.createdAt.toISOString(),
      };
    });
  } catch (error) {
    logError(
      "Get recent audit logs error",
      error
    );

    return [];
  }
}


export async function getActionCounts(
  userId: string,
  days: number = 7
): Promise<Record<string, number>> {
  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - days
  );

  try {
    const rows =
      await prisma.adminAuditLog.findMany({
        where: {
          adminId: userId,

          createdAt: {
            gte: startDate,
          },
        },

        select: {
          action: true,
        },
      });

    const counts: Record<
      string,
      number
    > = {};

    for (const row of rows) {
      counts[row.action] =
        (counts[row.action] ?? 0) +
        1;
    }

    return counts;
  } catch (error) {
    logError(
      "Get action counts error",
      error
    );

    return {};
  }
}


export async function detectAnomalousBehavior(
  userId: string
): Promise<{
  anomalous: boolean;
  reason?: string;
}> {
  const actionCounts =
    await getActionCounts(
      userId,
      1
    );

  if (
    (actionCounts[
      "simulation_create"
    ] ?? 0) > 20
  ) {
    return {
      anomalous: true,
      reason:
        "Too many simulations in 1 hour",
    };
  }

  if (
    (actionCounts[
      "simulation_message"
    ] ?? 0) > 100
  ) {
    return {
      anomalous: true,
      reason:
        "Too many messages in 1 hour",
    };
  }

  if (
    (actionCounts[
      "rate_limit_exceeded"
    ] ?? 0) > 10
  ) {
    return {
      anomalous: true,
      reason:
        "Too many rate limit violations",
    };
  }

  return {
    anomalous: false,
  };
}


