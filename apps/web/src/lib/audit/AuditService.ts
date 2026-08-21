/**
 * Audit Service
 *
 * Logs sensitive operations for compliance and security.
 *
 * Canonical persistence:
 * Prisma AdminAuditLog -> public."AdminAuditLog"
 *
 * Legacy Supabase `audit_logs` persistence has been removed.
 */

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger/Logger";

export interface AuditLogEntry {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  result: "success" | "failure" | "partial";
  errorMessage?: string;
  beforeValue?: unknown;
  afterValue?: unknown;
  metadata?: Record<string, unknown>;
}

export interface PersistedAuditLogEntry extends AuditLogEntry {
  id: string;
  createdAt: Date;
}

export class AuditService {
  private static instance: AuditService;

  private constructor() {}

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }

    return AuditService.instance;
  }

  /**
   * AdminAuditLog.adminId is mandatory and references User.
   *
   * Entries without a user cannot safely be persisted into the
   * canonical table, so they are logged and ignored rather than
   * creating invalid relational data.
   */
  async log(entry: AuditLogEntry): Promise<void> {
    if (!entry.userId) {
      logError(
        "Failed to log audit entry: userId is required by AdminAuditLog",
        new Error("Missing audit userId")
      );

      return;
    }

    try {
      const metadata: Prisma.InputJsonValue = {
        entityType: entry.entityType,
        result: entry.result,

        ...(entry.errorMessage
          ? { errorMessage: entry.errorMessage }
          : {}),

        ...(entry.beforeValue !== undefined
          ? {
              beforeValue:
                entry.beforeValue as Prisma.InputJsonValue,
            }
          : {}),

        ...(entry.afterValue !== undefined
          ? {
              afterValue:
                entry.afterValue as Prisma.InputJsonValue,
            }
          : {}),

        ...(entry.metadata ?? {}),
      };

      await prisma.adminAuditLog.create({
        data: {
          adminId: entry.userId,
          action: entry.action,
          targetId: entry.entityId ?? null,
          metadata,
          ipAddress: entry.ipAddress ?? null,
          userAgent: entry.userAgent ?? null,
        },
      });
    } catch (error) {
      logError("Failed to log audit entry", error);

      /**
       * Audit failure must not break the business operation.
       */
    }
  }

  async logSuccess(
    entry: Omit<AuditLogEntry, "result">
  ): Promise<void> {
    await this.log({
      ...entry,
      result: "success",
    });
  }

  async logFailure(
    entry: Omit<
      AuditLogEntry,
      "result" | "errorMessage"
    >,
    errorMessage: string
  ): Promise<void> {
    await this.log({
      ...entry,
      result: "failure",
      errorMessage,
    });
  }

  async logPartial(
    entry: Omit<
      AuditLogEntry,
      "result" | "errorMessage"
    >,
    errorMessage?: string
  ): Promise<void> {
    await this.log({
      ...entry,
      result: "partial",
      errorMessage,
    });
  }

  async getUserAuditLogs(
    userId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<PersistedAuditLogEntry[]> {
    try {
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

      return logs.map((log) =>
        this.toAuditLogEntry(log)
      );
    } catch (error) {
      logError(
        "Failed to get audit logs",
        error
      );

      return [];
    }
  }

  async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    limit: number = 100
  ): Promise<PersistedAuditLogEntry[]> {
    try {
      const logs =
        await prisma.adminAuditLog.findMany({
          where: {
            targetId: entityId,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: limit,
        });

      return logs
        .map((log) =>
          this.toAuditLogEntry(log)
        )
        .filter(
          (log) =>
            log.entityType === entityType
        );
    } catch (error) {
      logError(
        "Failed to get entity audit logs",
        error
      );

      return [];
    }
  }

  async getAuditLogsByAction(
    action: string,
    limit: number = 100
  ): Promise<PersistedAuditLogEntry[]> {
    try {
      const logs =
        await prisma.adminAuditLog.findMany({
          where: {
            action,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: limit,
        });

      return logs.map((log) =>
        this.toAuditLogEntry(log)
      );
    } catch (error) {
      logError(
        "Failed to get audit logs by action",
        error
      );

      return [];
    }
  }

  maskSensitiveData(data: unknown): unknown {
    if (!data) {
      return data;
    }

    const sensitiveFields = [
      "password",
      "token",
      "apiKey",
      "secret",
      "creditCard",
      "ssn",
      "email",
      "phone",
    ];

    if (
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      const masked = {
        ...(data as Record<string, unknown>),
      };

      for (const field of sensitiveFields) {
        if (field in masked) {
          masked[field] = "***MASKED***";
        }
      }

      return masked;
    }

    return data;
  }

  private toAuditLogEntry(log: {
    id: string;
    adminId: string;
    action: string;
    targetId: string | null;
    metadata: Prisma.JsonValue;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  }): PersistedAuditLogEntry {
    const metadata =
      log.metadata &&
      typeof log.metadata === "object" &&
      !Array.isArray(log.metadata)
        ? (
            log.metadata as Record<
              string,
              unknown
            >
          )
        : {};

    const entityType =
      typeof metadata.entityType === "string"
        ? metadata.entityType
        : "unknown";

    const result =
      metadata.result === "failure" ||
      metadata.result === "partial"
        ? metadata.result
        : "success";

    const errorMessage =
      typeof metadata.errorMessage === "string"
        ? metadata.errorMessage
        : undefined;

    const beforeValue =
      metadata.beforeValue;

    const afterValue =
      metadata.afterValue;

    const {
      entityType: _entityType,
      result: _result,
      errorMessage: _errorMessage,
      beforeValue: _beforeValue,
      afterValue: _afterValue,
      ...customMetadata
    } = metadata;

    return {
      id: log.id,
      userId: log.adminId,
      action: log.action,
      entityType,
      entityId: log.targetId ?? undefined,
      ipAddress: log.ipAddress ?? undefined,
      userAgent: log.userAgent ?? undefined,
      result,
      errorMessage,
      beforeValue,
      afterValue,
      metadata: customMetadata,
      createdAt: log.createdAt,
    };
  }
}

export const auditService =
  AuditService.getInstance();
