/**
 * HIIOS v4 Enterprise — RBAC Middleware
 */

import type { Context, Next } from "hono";
import { createMiddleware }   from "hono/factory";

// ─────────────────────────────────────────────
// PERMISSIONS PAR RÔLE
// ─────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    "interviews:create", "interviews:read", "interviews:update",
    "interviews:decide", "interviews:audit", "interviews:delete",
    "candidates:create", "candidates:read", "candidates:update",
    "users:create", "users:read", "users:update",
    "organization:manage", "analytics:read",
  ],
  recruiter: [
    "interviews:create", "interviews:read", "interviews:update",
    "interviews:decide", "interviews:audit",
    "candidates:create", "candidates:read",
    "analytics:read",
  ],
  hiring_manager: [
    "interviews:read", "interviews:audit",
    "candidates:read",
    "analytics:read",
  ],
  viewer: [
    "interviews:read",
    "candidates:read",
  ],
  api: [
    "interviews:create", "interviews:read", "interviews:update",
    "interviews:decide",
    "candidates:create", "candidates:read",
  ],
};

export function requirePermission(permission: string) {
  return createMiddleware(async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const rolePermissions = ROLE_PERMISSIONS[user.role] ?? [];
    const hasPermission   = rolePermissions.includes(permission) ||
                            user.permissions.includes(permission);

    if (!hasPermission) {
      return c.json({
        error:      "Forbidden",
        required:   permission,
        yourRole:   user.role,
      }, 403);
    }

    await next();
  });
}
