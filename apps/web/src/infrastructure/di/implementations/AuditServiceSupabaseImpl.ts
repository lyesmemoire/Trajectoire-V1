/**
 * Audit service implementation for the application DI layer.
 *
 * Historical note:
 * This class keeps its original name to avoid unnecessary DI/import churn.
 * It no longer uses the legacy Supabase `audit_log` / `audit_logs` tables.
 *
 * Canonical persistence:
 * Prisma AdminAuditLog -> public."AdminAuditLog"
 */

import { Prisma } from "@prisma/client";

import type {
  IAuditService,
  AuditLogEntry,
} from "@/core/interfaces";

import { prisma } from "@/lib/prisma";

export class AuditServiceSupabaseImpl implements IAuditService {
  async log(entry: AuditLogEntry): Promise<void> {
    const metadata: Prisma.InputJsonValue = {
      resourceType: entry.resourceType,
      ...(entry.metadata ?? {}),
    };

    await prisma.adminAuditLog.create({
      data: {
        adminId: entry.userId,
        action: entry.action,
        targetId: entry.resourceId ?? null,
        metadata,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
      },
    });
  }

  async getUserHistory(
    userId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<AuditLogEntry[]> {
    const logs = await prisma.adminAuditLog.findMany({
      where: {
        adminId: userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip: offset,
      take: limit,
    });

    return logs.map((log) => {
      const metadata =
        log.metadata &&
        typeof log.metadata === "object" &&
        !Array.isArray(log.metadata)
          ? (log.metadata as Record<string, unknown>)
          : {};

      const resourceType =
        typeof metadata.resourceType === "string"
          ? metadata.resourceType
          : "unknown";

      const {
        resourceType: _resourceType,
        ...restMetadata
      } = metadata;

      return {
        userId: log.adminId,
        action: log.action,
        resourceType,
        resourceId: log.targetId ?? undefined,
        metadata: restMetadata,
        ipAddress: log.ipAddress ?? undefined,
        userAgent: log.userAgent ?? undefined,
      };
    });
  }

  async detectAnomaly(userId: string): Promise<boolean> {
    /**
     * No canonical anomaly rule currently exists in IAuditService.
     *
     * Preserve the previous behavior instead of inventing
     * a security heuristic during persistence migration.
     */
    void userId;

    return false;
  }
}
