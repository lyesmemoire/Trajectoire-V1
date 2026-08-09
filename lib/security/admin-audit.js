import prisma from "@/lib/prisma";
/**
 * Advanced Admin Audit Logging for internal security.
 */
export async function logAdminAction(params) {
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
//# sourceMappingURL=admin-audit.js.map