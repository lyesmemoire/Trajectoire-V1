/**
 * Provider Abstraction Layer
 * 
 * Responsibilities:
 * - Abstract all AI providers (OpenAI, Deepgram, ElevenLabs, Azure, Gemini, etc.)
 * - Enable provider replacement without modifying cognitive engines
 * - NO direct dependencies on external SDKs
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY data transport between runtime and AI providers
 */

// ============================================================================
// PROVIDER INTERFACES
// ============================================================================

export interface SpeechToTextProvider {
  transcribe(audio: Uint8Array, language?: string): Promise<string>;
  transcribeStream(audioChunks: Uint8Array[]): AsyncGenerator<string>;
  getCapabilities(): SpeechToTextCapabilities;
}

export interface TextToSpeechProvider {
  synthesize(text: string, voice?: string): Promise<Uint8Array>;
  synthesizeStream(text: string): AsyncGenerator<Uint8Array>;
  getCapabilities(): TextToSpeechCapabilities;
}

export interface RealtimeConversationProvider {
  startConversation(config: RealtimeConfig): Promise<string>;
  sendMessage(message: string): Promise<string>;
  sendAudio(audio: Uint8Array): Promise<string>;
  endConversation(sessionId: string): Promise<void>;
  getCapabilities(): RealtimeCapabilities;
}

export interface LLMProvider {
  generate(prompt: string, options?: LLMOptions): Promise<string>;
  generateStream(prompt: string, options?: LLMOptions): AsyncGenerator<string>;
  getCapabilities(): LLMCapabilities;
}

export interface VisionProvider {
  analyze(image: Uint8Array, prompt?: string): Promise<string>;
  analyzeStream(imageChunks: Uint8Array[], prompt?: string): AsyncGenerator<string>;
  getCapabilities(): VisionCapabilities;
}

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
  getCapabilities(): EmbeddingCapabilities;
}

export interface ModerationProvider {
  moderate(text: string): Promise<ModerationResult>;
  moderateImage(image: Uint8Array): Promise<ModerationResult>;
  getCapabilities(): ModerationCapabilities;
}

export interface AudioStreamingProvider {
  startStream(config: AudioStreamConfig): Promise<string>;
  sendChunk(chunk: Uint8Array): Promise<void>;
  receiveChunk(): Promise<Uint8Array>;
  endStream(streamId: string): Promise<void>;
  getCapabilities(): AudioStreamingCapabilities;
}

export interface ConversationMemoryProvider {
  storeMemory(sessionId: string, memory: ConversationMemory): Promise<void>;
  retrieveMemory(sessionId: string): Promise<ConversationMemory>;
  searchMemory(query: string): Promise<ConversationMemory[]>;
  getCapabilities(): ConversationMemoryCapabilities;
}

export interface TokenUsageProvider {
  getTokenUsage(sessionId: string): Promise<TokenUsage>;
  getTokenUsageHistory(sessionId: string): Promise<TokenUsage[]>;
  getCapabilities(): TokenUsageCapabilities;
}

export interface ProviderHealthProvider {
  checkHealth(providerId: string): Promise<HealthStatus>;
  checkAllHealth(): Promise<Map<string, HealthStatus>>;
  getCapabilities(): ProviderHealthCapabilities;
}

export interface ProviderMetricsProvider {
  getMetrics(providerId: string): Promise<ProviderMetrics>;
  getMetricsHistory(providerId: string): Promise<ProviderMetrics[]>;
  getCapabilities(): ProviderMetricsCapabilities;
}

// ============================================================================
// PROVIDER CAPABILITIES
// ============================================================================

export interface SpeechToTextCapabilities {
  languages: string[];
  streaming: boolean;
  realtime: boolean;
  maxAudioLength: number;
  supportedFormats: string[];
}

export interface TextToSpeechCapabilities {
  voices: string[];
  languages: string[];
  streaming: boolean;
  realtime: boolean;
  maxTextLength: number;
  supportedFormats: string[];
}

export interface RealtimeCapabilities {
  streaming: boolean;
  audio: boolean;
  text: boolean;
  maxSessionDuration: number;
  supportedLanguages: string[];
}

export interface LLMCapabilities {
  models: string[];
  maxTokens: number;
  streaming: boolean;
  functionCalling: boolean;
  supportedLanguages: string[];
}

export interface VisionCapabilities {
  imageFormats: string[];
  maxImageSize: number;
  streaming: boolean;
  supportedAnalyses: string[];
}

export interface EmbeddingCapabilities {
  dimensions: number;
  maxTextLength: number;
  batchSize: number;
  supportedLanguages: string[];
}

export interface ModerationCapabilities {
  categories: string[];
  streaming: boolean;
  realtime: boolean;
}

export interface AudioStreamingCapabilities {
  sampleRates: number[];
  channels: number[];
  formats: string[];
  realtime: boolean;
}

export interface ConversationMemoryCapabilities {
  maxMemorySize: number;
  searchEnabled: boolean;
  indexingEnabled: boolean;
}

export interface TokenUsageCapabilities {
  trackingEnabled: boolean;
  realtime: boolean;
  historyRetention: number;
}

export interface ProviderHealthCapabilities {
  healthChecks: boolean;
  latencyMonitoring: boolean;
  errorTracking: boolean;
}

export interface ProviderMetricsCapabilities {
  latencyMetrics: boolean;
  costMetrics: boolean;
  usageMetrics: boolean;
  errorMetrics: boolean;
}

// ============================================================================
// PROVIDER MANAGEMENT OBJECTS
// ============================================================================

export interface ProviderRegistry {
  register(provider: ProviderRegistration): void;
  unregister(providerId: string): void;
  get(providerId: string): Provider | null;
  getAll(): Provider[];
  getByType(type: ProviderType): Provider[];
  getAvailable(): Provider[];
}

export interface ProviderFactory {
  create(type: ProviderType, config: ProviderConfiguration): Provider;
  createFromRegistration(registration: ProviderRegistration): Provider;
  destroy(providerId: string): void;
}

export interface ProviderResolver {
  resolve(type: ProviderType, requirements: ProviderRequirements): Provider;
  resolveBest(type: ProviderType, requirements: ProviderRequirements): Provider;
  resolveAll(type: ProviderType, requirements: ProviderRequirements): Provider[];
}

export interface ProviderConfiguration {
  providerId: string;
  type: ProviderType;
  apiKey?: string;
  endpoint?: string;
  region?: string;
  model?: string;
  options: Record<string, unknown>;
}

export interface ProviderMetadata {
  id: string;
  name: string;
  type: ProviderType;
  version: string;
  description: string;
  capabilities: Record<string, unknown>;
  priority: number;
  enabled: boolean;
}

export interface ProviderPriority {
  providerId: string;
  priority: number;
  weight: number;
  conditions: PriorityCondition[];
}

export interface PriorityCondition {
  type: "latency" | "cost" | "availability" | "quality";
  operator: "lt" | "lte" | "gt" | "gte" | "eq";
  value: number;
}

export interface ProviderSelector {
  select(type: ProviderType, strategy: SelectionStrategy): Provider;
  selectMultiple(type: ProviderType, strategy: SelectionStrategy, count: number): Provider[];
  setStrategy(strategy: SelectionStrategy): void;
  getStrategy(): SelectionStrategy;
}

export interface ProviderLifecycle {
  initialize(providerId: string): Promise<void>;
  start(providerId: string): Promise<void>;
  stop(providerId: string): Promise<void>;
  restart(providerId: string): Promise<void>;
  shutdown(providerId: string): Promise<void>;
  getStatus(providerId: string): LifecycleStatus;
}

export interface ProviderContext {
  providerId: string;
  sessionId: string;
  userId?: string;
  metadata: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface ProviderHealthStatus {
  providerId: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  lastCheck: number;
  uptime: number;
  errorRate: number;
  latency: number;
}

export interface ProviderStatistics {
  providerId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  totalCost: number;
  totalTokens: number;
  lastUsed: number;
}

export interface ProviderLogger {
  log(providerId: string, level: LogLevel, message: string, data?: Record<string, unknown>): void;
  logRequest(providerId: string, request: ProviderRequest): void;
  logResponse(providerId: string, response: ProviderResponse): void;
  logError(providerId: string, error: ProviderError): void;
  getLogs(providerId: string): ProviderLog[];
}

export interface ProviderErrorHandler {
  handle(error: ProviderError): ProviderErrorHandling;
  registerHandler(errorType: string, handler: ErrorHandler): void;
  unregisterHandler(errorType: string): void;
}

// ============================================================================
// PROVIDER STRATEGIES
// ============================================================================

export interface FallbackStrategy {
  fallback(providerId: string, error: ProviderError): Provider;
  setFallbackChain(chain: string[]): void;
  getFallbackChain(): string[];
}

export interface RetryStrategy {
  retry(request: ProviderRequest, error: ProviderError): Promise<ProviderResponse>;
  setMaxAttempts(attempts: number): void;
  setBackoff(backoff: BackoffStrategy): void;
  getMaxAttempts(): number;
}

export interface FailoverStrategy {
  failover(providerId: string): Provider;
  setFailoverProvider(primary: string, fallback: string): void;
  getFailoverProvider(primary: string): string;
}

export interface RoundRobinStrategy {
  select(providers: Provider[]): Provider;
  setProviders(providers: Provider[]): void;
  getProviders(): Provider[];
}

export interface PriorityStrategy {
  select(providers: Provider[], requirements: ProviderRequirements): Provider;
  setPriorities(priorities: ProviderPriority[]): void;
  getPriorities(): ProviderPriority[];
}

export interface CostStrategy {
  select(providers: Provider[], requirements: ProviderRequirements): Provider;
  setCostThreshold(threshold: number): void;
  getCostThreshold(): number;
}

export interface LatencyStrategy {
  select(providers: Provider[], requirements: ProviderRequirements): Provider;
  setLatencyThreshold(threshold: number): void;
  getLatencyThreshold(): number;
}

export interface AvailabilityStrategy {
  select(providers: Provider[], requirements: ProviderRequirements): Provider;
  setAvailabilityThreshold(threshold: number): void;
  getAvailabilityThreshold(): number;
}

// ============================================================================
// DATA MODELS
// ============================================================================

export interface ProviderRequest {
  id: string;
  providerId: string;
  type: ProviderType;
  timestamp: number;
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface ProviderResponse {
  id: string;
  requestId: string;
  providerId: string;
  type: ProviderType;
  timestamp: number;
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
  success: boolean;
  error?: ProviderError;
}

export interface StreamingRequest {
  id: string;
  providerId: string;
  type: ProviderType;
  timestamp: number;
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
  stream: boolean;
}

export interface StreamingResponse {
  id: string;
  requestId: string;
  providerId: string;
  type: ProviderType;
  timestamp: number;
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
  chunkIndex: number;
  isLast: boolean;
}

export interface AudioChunk {
  id: string;
  data: Uint8Array;
  timestamp: number;
  sequence: number;
  isLast: boolean;
  metadata: {
    sampleRate?: number;
    channels?: number;
    format?: string;
  };
}

export interface TranscriptChunk {
  id: string;
  text: string;
  timestamp: number;
  confidence: number;
  isFinal: boolean;
  metadata: {
    language?: string;
    speaker?: string;
  };
}

export interface ConversationChunk {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  timestamp: number;
}

export interface LatencyMetrics {
  providerId: string;
  type: "request" | "response" | "total";
  latency: number;
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface CostMetrics {
  providerId: string;
  cost: number;
  tokens: number;
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface HealthMetrics {
  providerId: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  uptime: number;
  errorRate: number;
  latency: number;
  timestamp: number;
}

export interface ProviderError {
  id: string;
  providerId: string;
  type: string;
  message: string;
  timestamp: number;
  code?: string;
  details?: Record<string, unknown>;
  recoverable: boolean;
}

// ============================================================================
// PROVIDER EVENTS
// ============================================================================

export type ProviderEventType =
  | "ProviderRegistered"
  | "ProviderUnregistered"
  | "ProviderReady"
  | "ProviderUnavailable"
  | "ProviderRecovered"
  | "ProviderSelected"
  | "ProviderSwitched"
  | "ProviderFailed"
  | "ProviderTimeout"
  | "ProviderHealthChanged";

export interface ProviderEvent {
  id: string;
  type: ProviderEventType;
  timestamp: number;
  providerId: string;
  data: Record<string, unknown>;
  metadata: {
    source: string;
    correlationId?: string;
  };
}

// ============================================================================
// MONITORING INTERFACES
// ============================================================================

export interface HealthMonitor {
  checkHealth(providerId: string): Promise<HealthStatus>;
  checkAllHealth(): Promise<Map<string, HealthStatus>>;
  subscribeToHealthChanges(callback: (status: HealthStatus) => void): void;
  unsubscribeFromHealthChanges(callback: (status: HealthStatus) => void): void;
}

export interface MetricsCollector {
  collectMetrics(providerId: string): Promise<ProviderMetrics>;
  collectAllMetrics(): Promise<Map<string, ProviderMetrics>>;
  subscribeToMetricsChanges(callback: (metrics: ProviderMetrics) => void): void;
  unsubscribeFromMetricsChanges(callback: (metrics: ProviderMetrics) => void): void;
}

export interface LatencyCollector {
  collectLatency(providerId: string): Promise<LatencyMetrics[]>;
  collectAllLatency(): Promise<Map<string, LatencyMetrics[]>>;
  subscribeToLatencyChanges(callback: (metrics: LatencyMetrics) => void): void;
  unsubscribeFromLatencyChanges(callback: (metrics: LatencyMetrics) => void): void;
}

export interface CostCollector {
  collectCost(providerId: string): Promise<CostMetrics[]>;
  collectAllCost(): Promise<Map<string, CostMetrics[]>>;
  subscribeToCostChanges(callback: (metrics: CostMetrics) => void): void;
  unsubscribeFromCostChanges(callback: (metrics: CostMetrics) => void): void;
}

export interface AvailabilityCollector {
  collectAvailability(providerId: string): Promise<AvailabilityMetrics>;
  collectAllAvailability(): Promise<Map<string, AvailabilityMetrics>>;
  subscribeToAvailabilityChanges(callback: (metrics: AvailabilityMetrics) => void): void;
  unsubscribeFromAvailabilityChanges(callback: (metrics: AvailabilityMetrics) => void): void;
}

export interface UsageCollector {
  collectUsage(providerId: string): Promise<UsageMetrics>;
  collectAllUsage(): Promise<Map<string, UsageMetrics>>;
  subscribeToUsageChanges(callback: (metrics: UsageMetrics) => void): void;
  unsubscribeFromUsageChanges(callback: (metrics: UsageMetrics) => void): void;
}

// ============================================================================
// TYPES AND ENUMS
// ============================================================================

export type ProviderType =
  | "SpeechToText"
  | "TextToSpeech"
  | "RealtimeConversation"
  | "LLM"
  | "Vision"
  | "Embedding"
  | "Moderation"
  | "AudioStreaming"
  | "ConversationMemory"
  | "TokenUsage"
  | "ProviderHealth"
  | "ProviderMetrics";

export type SelectionStrategy =
  | "Fallback"
  | "Retry"
  | "Failover"
  | "RoundRobin"
  | "Priority"
  | "Cost"
  | "Latency"
  | "Availability";

export type BackoffStrategy = "linear" | "exponential" | "fixed";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LifecycleStatus = "initialized" | "started" | "stopped" | "shutdown" | "error";

// ============================================================================
// COMPOSITE TYPES
// ============================================================================

export interface Provider {
  id: string;
  metadata: ProviderMetadata;
  configuration: ProviderConfiguration;
  capabilities: Record<string, unknown>;
  healthStatus: ProviderHealthStatus;
  statistics: ProviderStatistics;
}

export interface ProviderRegistration {
  provider: Provider;
  priority: number;
  enabled: boolean;
}

export interface ProviderRequirements {
  type: ProviderType;
  capabilities: string[];
  maxLatency?: number;
  maxCost?: number;
  minAvailability?: number;
}

export interface RealtimeConfig {
  sessionId: string;
  userId?: string;
  language?: string;
  model?: string;
  options: Record<string, unknown>;
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  functions?: Array<Record<string, unknown>>;
}

export interface AudioStreamConfig {
  sampleRate: number;
  channels: number;
  format: string;
  realtime: boolean;
}

export interface ModerationResult {
  flagged: boolean;
  categories: Record<string, boolean>;
  scores: Record<string, number>;
}

export interface ConversationMemory {
  sessionId: string;
  messages: ConversationChunk[];
  metadata: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface HealthStatus {
  providerId: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  lastCheck: number;
  uptime: number;
  errorRate: number;
  latency: number;
}

export interface ProviderMetrics {
  providerId: string;
  latency: LatencyMetrics[];
  cost: CostMetrics[];
  usage: UsageMetrics;
  availability: AvailabilityMetrics;
  errors: ProviderError[];
}

export interface AvailabilityMetrics {
  providerId: string;
  availability: number;
  uptime: number;
  downtime: number;
  lastDowntime: number;
  timestamp: number;
}

export interface UsageMetrics {
  providerId: string;
  requests: number;
  tokens: number;
  cost: number;
  timestamp: number;
}

export interface ProviderLog {
  id: string;
  providerId: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface ProviderErrorHandling {
  action: "retry" | "fallback" | "fail" | "ignore";
  retryCount?: number;
  fallbackProvider?: string;
  error?: ProviderError;
}

export interface ErrorHandler {
  handle(error: ProviderError): ProviderErrorHandling;
}
