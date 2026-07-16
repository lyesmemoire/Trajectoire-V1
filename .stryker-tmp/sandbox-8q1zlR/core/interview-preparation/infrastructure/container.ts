/**
 * Composition Root (container.ts)
 *
 * Central dependency injection container for the infrastructure layer.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY object composition and dependency wiring.
 *
 * This is the ONLY place where 'new' calls should be made in infrastructure.
 * All other components receive dependencies through constructor injection.
 */
// @ts-nocheck


import { ConfigurationService } from "./configuration/ConfigurationService";
import { OpenAIClient } from "./clients/OpenAIClient";
import { SupabaseClient } from "./clients/SupabaseClient";
import { ClockProvider, FixedClockProvider } from "./providers/ClockProvider";
import { UUIDProvider, DeterministicUUIDProvider } from "./providers/UUIDProvider";
import { OpenAIProvider } from "./providers/OpenAIProvider";
import { SupabaseProvider } from "./providers/SupabaseProvider";
import { PromptBuilder } from "./ai/PromptBuilder";
import { ResponseParser } from "./ai/ResponseParser";
import { LoggerAdapter } from "./adapters/LoggerAdapter";
import { TelemetryAdapter } from "./adapters/TelemetryAdapter";
import { AnalyticsAdapter } from "./adapters/AnalyticsAdapter";
import { SupabaseInterviewPersistenceAdapter } from "./adapters/SupabaseInterviewPersistenceAdapter";
import { OpenAIInterviewGenerationAdapter } from "./adapters/OpenAIInterviewGenerationAdapter";
import { InterviewPlanMapper } from "./mappers/InterviewPlanMapper";

/**
 * Infrastructure container
 * Provides all infrastructure dependencies
 */
export class InfrastructureContainer {
  private static instance: InfrastructureContainer;

  private configurationService!: ConfigurationService;
  private openAIClient!: OpenAIClient;
  private supabaseClient!: SupabaseClient;
  private clockProvider!: ClockProvider;
  private uuidProvider!: UUIDProvider;
  private openAIProvider!: OpenAIProvider;
  private supabaseProvider!: SupabaseProvider;
  private promptBuilder!: PromptBuilder;
  private responseParser!: ResponseParser;
  private loggerAdapter!: LoggerAdapter;
  private telemetryAdapter!: TelemetryAdapter;
  private analyticsAdapter!: AnalyticsAdapter;
  private interviewPersistenceAdapter!: SupabaseInterviewPersistenceAdapter;
  private interviewGenerationAdapter!: OpenAIInterviewGenerationAdapter;
  private interviewPlanMapper!: InterviewPlanMapper;

  private constructor() {
    this.initialize();
  }

  static getInstance(): InfrastructureContainer {
    if (!InfrastructureContainer.instance) {
      InfrastructureContainer.instance = new InfrastructureContainer();
    }
    return InfrastructureContainer.instance;
  }

  private initialize(): void {
    this.configurationService = ConfigurationService.getInstance();

    const openAIConfig = this.configurationService.getOpenAIConfig();
    const supabaseConfig = this.configurationService.getSupabaseConfig();

    this.openAIClient = new OpenAIClient(openAIConfig);
    this.supabaseClient = new SupabaseClient(supabaseConfig);

    this.clockProvider = new ClockProvider();
    this.uuidProvider = new UUIDProvider();

    this.openAIProvider = new OpenAIProvider(this.configurationService);
    this.supabaseProvider = new SupabaseProvider(this.configurationService);

    this.promptBuilder = new PromptBuilder();
    this.responseParser = new ResponseParser();

    this.loggerAdapter = new LoggerAdapter(this.configurationService);
    this.telemetryAdapter = new TelemetryAdapter(this.configurationService);
    this.analyticsAdapter = new AnalyticsAdapter(this.configurationService);

    this.interviewPersistenceAdapter = new SupabaseInterviewPersistenceAdapter(
      this.supabaseClient
    );

    this.interviewGenerationAdapter = new OpenAIInterviewGenerationAdapter(
      this.openAIClient,
      this.promptBuilder,
      this.responseParser
    );

    this.interviewPlanMapper = new InterviewPlanMapper();
  }

  getConfigurationService(): ConfigurationService {
    return this.configurationService;
  }

  getOpenAIClient(): OpenAIClient {
    return this.openAIClient;
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabaseClient;
  }

  getClockProvider(): ClockProvider {
    return this.clockProvider;
  }

  getUUIDProvider(): UUIDProvider {
    return this.uuidProvider;
  }

  getOpenAIProvider(): OpenAIProvider {
    return this.openAIProvider;
  }

  getSupabaseProvider(): SupabaseProvider {
    return this.supabaseProvider;
  }

  getPromptBuilder(): PromptBuilder {
    return this.promptBuilder;
  }

  getResponseParser(): ResponseParser {
    return this.responseParser;
  }

  getLoggerAdapter(): LoggerAdapter {
    return this.loggerAdapter;
  }

  getTelemetryAdapter(): TelemetryAdapter {
    return this.telemetryAdapter;
  }

  getAnalyticsAdapter(): AnalyticsAdapter {
    return this.analyticsAdapter;
  }

  getInterviewPersistenceAdapter(): SupabaseInterviewPersistenceAdapter {
    return this.interviewPersistenceAdapter;
  }

  getInterviewGenerationAdapter(): OpenAIInterviewGenerationAdapter {
    return this.interviewGenerationAdapter;
  }

  getInterviewPlanMapper(): InterviewPlanMapper {
    return this.interviewPlanMapper;
  }

  /**
   * Create test container with fixed providers for deterministic testing
   */
  static createTestContainer(fixedDate?: Date): InfrastructureContainer {
    InfrastructureContainer.instance = new InfrastructureContainer();
    const container = InfrastructureContainer.instance;

    if (fixedDate) {
      container.clockProvider = new FixedClockProvider(fixedDate);
    }

    container.uuidProvider = new DeterministicUUIDProvider();

    return container;
  }

  /**
   * Reset container (useful for testing)
   */
  static reset(): void {
    InfrastructureContainer.instance = new InfrastructureContainer();
  }
}

/**
 * Export singleton instance for convenience
 */
export const infrastructureContainer = InfrastructureContainer.getInstance();
