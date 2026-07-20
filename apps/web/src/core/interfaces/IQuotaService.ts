/**
 * IQuotaService Interface
 * Defines the contract for quota management implementations
 * Following Dependency Inversion Principle
 */

export interface QuotaCheck {
  allowed: boolean;
  remaining: number;
  limit: number;
  period: "daily" | "monthly";
}

export interface IQuotaService {
  /**
   * Check if a user has quota available for a resource type
   * @param userId - User ID
   * @param resourceType - Type of resource (simulations, messages, reports, tokens)
   * @returns Quota check result
   */
  checkQuota(userId: string, resourceType: string): Promise<QuotaCheck>;

  /**
   * Increment quota usage for a user
   * @param userId - User ID
   * @param resourceType - Type of resource
   * @param amount - Amount to increment (default 1)
   * @returns Updated quota
   */
  incrementQuota(userId: string, resourceType: string, amount?: number): Promise<QuotaCheck>;

  /**
   * Get user's current quota usage
   * @param userId - User ID
   * @param resourceType - Type of resource
   * @returns Current quota
   */
  getQuota(userId: string, resourceType: string): Promise<QuotaCheck>;

  /**
   * Reset quota for a user (typically for testing or admin)
   * @param userId - User ID
   * @param resourceType - Type of resource
   */
  resetQuota(userId: string, resourceType: string): Promise<void>;
}
