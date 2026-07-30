/**
 * DI Bootstrap
 * Registers all services in the DI container
 */

import { Container, ServiceTokens } from "./Container";
import {
  SessionRepository,
  MessageRepository,
  ReportRepository,
  ProfileRepository,
} from "../repositories";
import {
  OpenAIProviderImpl,
  SecureLoggerImpl,
  RateLimiterSupabaseImpl,
  QuotaServiceSupabaseImpl,
  AuditServiceSupabaseImpl,
} from "./implementations";
import { SimulationService, ConversationService, ReportService, AccountService } from "@/application/services";
import { SupabaseTransactionManager } from "../transactions/SupabaseTransactionManager";

export function bootstrapContainer(): void {
  // Register repositories (transient - new instance per request)
  Container.register(ServiceTokens.SessionRepository, () => new SessionRepository(), "transient");
  Container.register(ServiceTokens.MessageRepository, () => new MessageRepository(), "transient");
  Container.register(ServiceTokens.ReportRepository, () => new ReportRepository(), "transient");
  Container.register(ServiceTokens.ProfileRepository, () => new ProfileRepository(), "transient");

  // Register infrastructure services (singleton)
  Container.register(ServiceTokens.AIProvider, () => new OpenAIProviderImpl(), "singleton");
  Container.register(ServiceTokens.Logger, () => new SecureLoggerImpl(), "singleton");
  Container.register(ServiceTokens.RateLimiter, () => new RateLimiterSupabaseImpl(), "singleton");
  Container.register(ServiceTokens.QuotaService, () => new QuotaServiceSupabaseImpl(), "singleton");
  Container.register(ServiceTokens.AuditService, () => new AuditServiceSupabaseImpl(), "singleton");
  Container.register(ServiceTokens.TransactionManager, () => SupabaseTransactionManager.getInstance(), "singleton");

  // Register application services (transient - new instance per request)
  Container.register(
    ServiceTokens.SimulationService,
    async () => {
      const sessionRepository = new SessionRepository();
      const rateLimiter = await Container.resolve(ServiceTokens.RateLimiter);
      const quotaService = await Container.resolve(ServiceTokens.QuotaService);
      const auditService = await Container.resolve(ServiceTokens.AuditService);
      const logger = await Container.resolve(ServiceTokens.Logger);
      const transactionManager = await Container.resolve(ServiceTokens.TransactionManager);

      return new SimulationService(
        sessionRepository,
        rateLimiter  as any,
        quotaService  as any,
        auditService  as any,
        logger  as any,
        transactionManager  as any
      );
    },
    "transient"
  );

  Container.register(
    ServiceTokens.ConversationService,
    async () => {
      const sessionRepository = new SessionRepository();
      const messageRepository = new MessageRepository();
      const rateLimiter = await Container.resolve(ServiceTokens.RateLimiter);
      const quotaService = await Container.resolve(ServiceTokens.QuotaService);
      const auditService = await Container.resolve(ServiceTokens.AuditService);
      const logger = await Container.resolve(ServiceTokens.Logger);
      const aiProvider = await Container.resolve(ServiceTokens.AIProvider);

      return new ConversationService(
        sessionRepository,
        messageRepository,
        rateLimiter  as any,
        quotaService  as any,
        auditService  as any,
        logger  as any,
        aiProvider  as any
      );
    },
    "transient"
  );

  Container.register(
    ServiceTokens.ReportService,
    async () => {
      const sessionRepository = new SessionRepository();
      const reportRepository = new ReportRepository();
      const messageRepository = new MessageRepository();
      const rateLimiter = await Container.resolve(ServiceTokens.RateLimiter);
      const quotaService = await Container.resolve(ServiceTokens.QuotaService);
      const auditService = await Container.resolve(ServiceTokens.AuditService);
      const logger = await Container.resolve(ServiceTokens.Logger);

      return new ReportService(
        sessionRepository,
        reportRepository,
        messageRepository,
        rateLimiter  as any,
        quotaService  as any,
        auditService  as any,
        logger  as any
      );
    },
    "transient"
  );

  Container.register(
    ServiceTokens.AccountService,
    async () => {
      const sessionRepository = new SessionRepository();
      const reportRepository = new ReportRepository();
      const messageRepository = new MessageRepository();
      const profileRepository = new ProfileRepository();
      const auditService = await Container.resolve(ServiceTokens.AuditService);
      const logger = await Container.resolve(ServiceTokens.Logger);

      return new AccountService(
        sessionRepository,
        reportRepository,
        messageRepository,
        profileRepository,
        auditService  as any,
        logger  as any
      );
    },
    "transient"
  );
}

/**
 * Initialize the container (call this at app startup)
 */
export function initializeContainer(): void {
  if (!Container.isRegistered(ServiceTokens.Logger)) {
    bootstrapContainer();
  }
}
