/**
 * QuotaServiceSupabase Implementation
 * Implements IQuotaService interface using Supabase
 */

import { IQuotaService, QuotaCheck } from "@/core/interfaces";
import { checkQuota, incrementQuota, QUOTA_CONFIGS, QuotaType } from "@/lib/security/quotaService";

export class QuotaServiceSupabaseImpl implements IQuotaService {
  async checkQuota(userId: string, resourceType: string): Promise<QuotaCheck> {
    const result = await checkQuota(userId, resourceType as QuotaType);
    const config = QUOTA_CONFIGS.free[resourceType as QuotaType] || QUOTA_CONFIGS.free.simulations;

    return {
      allowed: result.allowed,
      remaining: result.remaining,
      limit: config.limit,
      period: config.period,
    };
  }

  async incrementQuota(userId: string, resourceType: string, amount: number = 1): Promise<QuotaCheck> {
    await incrementQuota(userId, resourceType as QuotaType, amount);

    // Return updated quota
    return this.checkQuota(userId, resourceType);
  }

  async getQuota(userId: string, resourceType: string): Promise<QuotaCheck> {
    return this.checkQuota(userId, resourceType);
  }

  async resetQuota(userId: string, resourceType: string): Promise<void> {
    // Legacy quota service doesn't have reset, implement if needed
    // For now, this is a no-op
  }
}
