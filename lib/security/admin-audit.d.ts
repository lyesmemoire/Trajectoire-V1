/**
 * Advanced Admin Audit Logging for internal security.
 */
export declare function logAdminAction(params: {
    adminId: string;
    action: "VIEW_SESSION" | "EXPORT_DATA" | "CHANGE_PROMPT" | "UPDATE_USER_PLAN" | "DELETE_USER";
    targetId?: string;
    metadata?: unknown;
    ipAddress?: string;
    userAgent?: string;
}): Promise<any>;
//# sourceMappingURL=admin-audit.d.ts.map