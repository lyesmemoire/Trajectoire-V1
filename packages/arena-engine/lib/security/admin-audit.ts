import prisma from "@/lib/prisma";

/**
 * Advanced Admin Audit Logging for internal security.
 */
export async function logAdminAction(params: {
  adminId: string;
  action:
    | "VIEW_SESSION"
    | "EXPORT_DATA"
    | "CHANGE_PROMPT"
    | "UPDATE_USER_PLAN"
    | "DELETE_USER";
  targetId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  return await prisma.adminAuditLog.create({
    data: {
      adminId: params.adminId,
      action: params.action,
      targetId: params.targetId,
      metadata: params.metadata || {},
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    },
  });
}
