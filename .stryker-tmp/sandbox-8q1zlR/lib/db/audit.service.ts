// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { getServerDb } from "@/lib/db/client";
import { LoggerProvider } from "@/lib/core/observability/logger";
import { envServer } from "@/lib/env.server";

/**
 * Anti-Chaos Layer: Audit Domain
 * 
 * STRANGLER FIG PATTERN - PHASE 1:
 * - Reads: Routed via Feature Flag (Prisma OR Supabase)
 * - Writes: Supabase ONLY (prevent divergence)
 */

const USE_PRISMA_READS = envServer.USE_PRISMA_AUDIT === true;

export const AuditService = {
  /**
   * Fetch audit logs
   */
  async getLogs(options?: { adminId?: string; limit?: number }) {
    if (USE_PRISMA_READS) {
      LoggerProvider.getLogger().debug("[AuditService] READ via Prisma");
      return prisma.adminAuditLog.findMany({
        where: options?.adminId ? { adminId: options.adminId } : undefined,
        take: options?.limit || 50,
        orderBy: { createdAt: "desc" },
      });
    }

    LoggerProvider.getLogger().debug("[AuditService] READ via Supabase SDK");
    const supabase = await getServerDb();
    
    let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false });
    
    if (options?.adminId) {
      query = query.eq("user_id", options.adminId);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map((log: any) => ({
      id: log.id,
      adminId: log.user_id || "", // Mapping user_id to adminId
      action: log.action,
      targetId: null, // targetId doesn't exist in Supabase schema
      metadata: log.metadata,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      createdAt: log.created_at ? new Date(log.created_at) : new Date(),
    }));
  },

  /**
   * WRITE: Supabase ONLY (Phase 1 rule)
   */
  async createLog(payload: {
    adminId: string;
    action: string;
    targetId?: string | null;
    metadata?: any;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    LoggerProvider.getLogger().debug("[AuditService] WRITE via Supabase SDK (Phase 1 Lock)");
    const supabase = await getServerDb();
    const { data, error } = await supabase
      .from("audit_logs")
      .insert({
        user_id: payload.adminId, // Mapping adminId to user_id
        action: payload.action,
        metadata: payload.metadata || null,
        ip_address: payload.ipAddress || null,
        user_agent: payload.userAgent || null,
        // note: targetId is dropped here as it's not in the Supabase schema
      })
      .select()
      .single();

    if (error) throw error;

    return data ? {
      id: data.id,
      adminId: data.user_id || "",
      action: data.action,
      targetId: null,
      metadata: data.metadata,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    } : null;
  },
};
