/**
 * QuotaLimits Value Object
 * Defines quota limits for different resources and plans
 */

export type ResourceType = "simulations" | "messages" | "reports" | "tokens";
export type PlanType = "free" | "premium";

export interface QuotaLimit {
  resource: ResourceType;
  dailyLimit: number;
  monthlyLimit: number;
}

export class QuotaLimits {
  private static readonly FREE_LIMITS: Record<ResourceType, QuotaLimit> = {
    simulations: { resource: "simulations", dailyLimit: 10, monthlyLimit: 300 },
    messages: { resource: "messages", dailyLimit: 50, monthlyLimit: 1500 },
    reports: { resource: "reports", dailyLimit: 5, monthlyLimit: 150 },
    tokens: { resource: "tokens", dailyLimit: 100000, monthlyLimit: 3000000 },
  };

  private static readonly PREMIUM_LIMITS: Record<ResourceType, QuotaLimit> = {
    simulations: { resource: "simulations", dailyLimit: Infinity, monthlyLimit: Infinity },
    messages: { resource: "messages", dailyLimit: Infinity, monthlyLimit: Infinity },
    reports: { resource: "reports", dailyLimit: Infinity, monthlyLimit: Infinity },
    tokens: { resource: "tokens", dailyLimit: Infinity, monthlyLimit: Infinity },
  };

  /**
   * Get quota limit for a resource and plan
   */
  static getLimit(resource: ResourceType, plan: PlanType = "free"): QuotaLimit {
    const limits = plan === "premium" ? this.PREMIUM_LIMITS : this.FREE_LIMITS;
    return limits[resource];
  }

  /**
   * Check if usage is within limits
   */
  static isWithinLimit(
    resource: ResourceType,
    currentUsage: number,
    plan: PlanType = "free",
    period: "daily" | "monthly" = "daily"
  ): boolean {
    const limit = this.getLimit(resource, plan);
    const limitValue = period === "daily" ? limit.dailyLimit : limit.monthlyLimit;
    return currentUsage < limitValue;
  }

  /**
   * Get remaining quota
   */
  static getRemaining(
    resource: ResourceType,
    currentUsage: number,
    plan: PlanType = "free",
    period: "daily" | "monthly" = "daily"
  ): number {
    const limit = this.getLimit(resource, plan);
    const limitValue = period === "daily" ? limit.dailyLimit : limit.monthlyLimit;
    return Math.max(0, limitValue - currentUsage);
  }
}
