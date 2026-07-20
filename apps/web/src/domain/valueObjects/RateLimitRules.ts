/**
 * RateLimitRules Value Object
 * Defines rate limit rules for different endpoints
 */

export type EndpointType = "simulation_create" | "simulation_message" | "report_generate" | "account_delete" | "account_export";

export interface RateLimitRule {
  endpoint: EndpointType;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
}

export class RateLimitRules {
  private static readonly RULES: Record<EndpointType, RateLimitRule> = {
    simulation_create: {
      endpoint: "simulation_create",
      requestsPerMinute: 30,
      requestsPerHour: 100,
      requestsPerDay: 500,
    },
    simulation_message: {
      endpoint: "simulation_message",
      requestsPerMinute: 10,
      requestsPerHour: 200,
      requestsPerDay: 1000,
    },
    report_generate: {
      endpoint: "report_generate",
      requestsPerMinute: 10,
      requestsPerHour: 50,
      requestsPerDay: 200,
    },
    account_delete: {
      endpoint: "account_delete",
      requestsPerMinute: 1,
      requestsPerHour: 5,
      requestsPerDay: 10,
    },
    account_export: {
      endpoint: "account_export",
      requestsPerMinute: 5,
      requestsPerHour: 20,
      requestsPerDay: 50,
    },
  };

  /**
   * Get rate limit rule for an endpoint
   */
  static getRule(endpoint: EndpointType): RateLimitRule {
    return this.RULES[endpoint];
  }

  /**
   * Check if request is allowed based on current usage
   */
  static isAllowed(
    endpoint: EndpointType,
    currentMinuteCount: number,
    currentHourCount: number,
    currentDayCount: number
  ): boolean {
    const rule = this.getRule(endpoint);
    return (
      currentMinuteCount < rule.requestsPerMinute &&
      currentHourCount < rule.requestsPerHour &&
      currentDayCount < rule.requestsPerDay
    );
  }
}
