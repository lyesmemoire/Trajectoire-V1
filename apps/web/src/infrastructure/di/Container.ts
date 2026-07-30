/**
 * DI Container
 * Lightweight dependency injection container
 * Manages service registration and resolution
 */

import { InfrastructureError } from "@/core/errors";

type ServiceFactory<T> = () => T | Promise<T>;
type ServiceLifetime = "singleton" | "transient";

interface ServiceRegistration<T> {
  factory: ServiceFactory<T>;
  lifetime: ServiceLifetime;
  instance?: T;
}

export class Container {
  private static registrations = new Map<string, ServiceRegistration<any>>();

  /**
   * Register a service
   * @param token - Service identifier
   * @param factory - Factory function to create the service
   * @param lifetime - Service lifetime (singleton or transient)
   */
  static register<T>(
    token: string,
    factory: ServiceFactory<T>,
    lifetime: ServiceLifetime = "singleton"
  ): void {
    this.registrations.set(token, { factory, lifetime });
  }

  /**
   * Resolve a service
   * @param token - Service identifier
   * @returns Service instance
   */
  static async resolve<T>(token: string): Promise<T> {
    const registration = this.registrations.get(token);

    if (!registration) {
      throw new InfrastructureError(`Service not registered: ${token}`, "DIContainer");
    }

    // Return singleton instance if available
    if (registration.lifetime === "singleton" && registration.instance) {
      return registration.instance as T;
    }

    // Create new instance
    const instance = await registration.factory();

    // Store singleton instance
    if (registration.lifetime === "singleton") {
      registration.instance = instance;
    }

    return instance as T;
  }

  /**
   * Check if a service is registered
   * @param token - Service identifier
   * @returns Whether service is registered
   */
  static isRegistered(token: string): boolean {
    return this.registrations.has(token);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  static clear(): void {
    this.registrations.clear();
  }
}

/**
 * Service tokens
 * Used to identify services in the container
 */
export const ServiceTokens = {
  // Repositories
  SessionRepository: "SessionRepository",
  MessageRepository: "MessageRepository",
  ReportRepository: "ReportRepository",
  ProfileRepository: "ProfileRepository",

  // Services
  RateLimiter: "RateLimiter",
  QuotaService: "QuotaService",
  AuditService: "AuditService",
  Logger: "Logger",
  AIProvider: "AIProvider",
  TransactionManager: "TransactionManager",

  // Application Services
  SimulationService: "SimulationService",
  ConversationService: "ConversationService",
  ReportService: "ReportService",
  AccountService: "AccountService",
} as const;
