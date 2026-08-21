import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger/Logger"

/**
 * Audit persistence.
 *
 * Canonical storage:
 * Prisma AdminAuditLog -> public."AdminAuditLog"
 *
 * The former Supabase table `audit_logs` no longer exists.
 */
export const AuditService = {
  /**
   * Fetch audit logs.
   */
  async getLogs(options?: {
    adminId?: string
    limit?: number
  }) {
    logger.debug("[AuditService] READ via Prisma", {
      adminId: options?.adminId,
      limit: options?.limit,
    })

    return prisma.adminAuditLog.findMany({
      where: options?.adminId
        ? {
            adminId: options.adminId,
          }
        : undefined,

      take: options?.limit ?? 50,

      orderBy: {
        createdAt: "desc",
      },
    })
  },

  /**
   * Create an audit record.
   */
  async createLog(payload: {
    adminId: string
    action: string
    targetId?: string | null
    metadata?: Prisma.InputJsonValue | null
    ipAddress?: string | null
    userAgent?: string | null
  }) {
    logger.debug("[AuditService] WRITE via Prisma", {
      adminId: payload.adminId,
      action: payload.action,
      targetId: payload.targetId,
    })

    return prisma.adminAuditLog.create({
      data: {
        adminId: payload.adminId,
        action: payload.action,
        targetId: payload.targetId ?? null,

        metadata:
          payload.metadata === null
            ? Prisma.JsonNull
            : payload.metadata,

        ipAddress: payload.ipAddress ?? null,
        userAgent: payload.userAgent ?? null,
      },
    })
  },
}
