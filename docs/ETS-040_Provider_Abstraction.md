# ETS-040 Provider Abstraction

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie la couche d'abstraction des providers AI qui permet de changer de provider sans modifier le code. Il définit une interface unifiée pour OpenAI, Anthropic, Google, Azure, AWS, et d'autres providers.

---

## Architecture du Provider Abstraction

### Provider Abstraction

```typescript
interface ProviderAbstraction {
  providers: Map<string, AIProvider>;
  providerRegistry: ProviderRegistry;
  providerSelector: ProviderSelector;
  providerAdapter: ProviderAdapter;
  providerMonitor: ProviderMonitor;
  providerFallback: ProviderFallback;
}
```

---

## Provider Interface

### AI Provider Interface

```typescript
interface AIProvider {
  id: string;
  name: string;
  type: ProviderType;
  capabilities: ProviderCapabilities;
  config: ProviderConfig;
  initialize(config: ProviderConfig): Promise<void>;
  generateText(prompt: string, options: GenerationOptions): Promise<TextGenerationResult>;
  generateChat(messages: ChatMessage[], options: ChatOptions): Promise<ChatGenerationResult>;
  streamText(prompt: string, options: GenerationOptions): AsyncIterable<TextStreamChunk>;
  streamChat(messages: ChatMessage[], options: ChatOptions): AsyncIterable<ChatStreamChunk>;
  validateConfig(config: ProviderConfig): ValidationResult;
  healthCheck(): Promise<HealthCheckResult>;
  getMetrics(): ProviderMetrics;
  shutdown(): Promise<void>;
}

type ProviderType = 
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'azure'
  | 'aws'
  | 'cohere'
  | 'huggingface'
  | 'custom';

interface ProviderCapabilities {
  textGeneration: boolean;
  chatCompletion: boolean;
  streaming: boolean;
  functionCalling: boolean;
  imageGeneration: boolean;
  audioProcessing: boolean;
  maxTokens: number;
  supportedModels: string[];
}

interface ProviderConfig {
  apiKey: string;
  apiEndpoint?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  timeout?: number;
  retryConfig?: RetryConfig;
  rateLimitConfig?: RateLimitConfig;
}

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

interface RateLimitConfig {
  requestsPerMinute: number;
  tokensPerMinute: number;
  burstSize: number;
}

interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  seed?: number;
}

interface ChatOptions extends GenerationOptions {
  functions?: FunctionDefinition[];
  functionCall?: 'auto' | 'none' | { name: string };
}

interface TextGenerationResult {
  text: string;
  finishReason: FinishReason;
  usage: Usage;
  model: string;
  provider: string;
  latency: number;
}

interface ChatGenerationResult {
  message: ChatMessage;
  finishReason: FinishReason;
  usage: Usage;
  model: string;
  provider: string;
  latency: number;
  functionCall?: FunctionCall;
}

type FinishReason = 
  | 'stop'
  | 'length'
  | 'content_filter'
  | 'function_call'
  | 'error';

interface Usage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  functionCall?: FunctionCall;
}

interface FunctionDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

interface FunctionCall {
  name: string;
  arguments: string;
}

interface TextStreamChunk {
  text: string;
  finishReason?: FinishReason;
  usage?: Usage;
}

interface ChatStreamChunk {
  delta: ChatMessageDelta;
  finishReason?: FinishReason;
  usage?: Usage;
}

interface ChatMessageDelta {
  role?: 'assistant';
  content?: string;
  functionCall?: FunctionCall;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface HealthCheckResult {
  isHealthy: boolean;
  latency: number;
  error?: string;
}

interface ProviderMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  tokenUsage: TokenUsageMetrics;
  uptime: number;
}
```

---

## Provider Implementations

### OpenAI Provider

```typescript
class OpenAIProvider implements AIProvider {
  id = 'openai';
  name = 'OpenAI';
  type: ProviderType = 'openai';
  capabilities: ProviderCapabilities = {
    textGeneration: true,
    chatCompletion: true,
    streaming: true,
    functionCalling: true,
    imageGeneration: true,
    audioProcessing: true,
    maxTokens: 128000,
    supportedModels: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o']
  };
  config!: ProviderConfig;

  async initialize(config: ProviderConfig): Promise<void> {
    this.config = config;
  }

  async generateText(prompt: string, options: GenerationOptions): Promise<TextGenerationResult> {
    const startTime = Date.now();
    
    // Appeler l'API OpenAI
    const response = await this.callOpenAI('completions', {
      prompt,
      model: this.config.model,
      ...options
    });

    const latency = Date.now() - startTime;

    return {
      text: response.choices[0].text,
      finishReason: response.choices[0].finish_reason,
      usage: response.usage,
      model: response.model,
      provider: this.id,
      latency
    };
  }

  async generateChat(messages: ChatMessage[], options: ChatOptions): Promise<ChatGenerationResult> {
    const startTime = Date.now();
    
    // Appeler l'API OpenAI
    const response = await this.callOpenAI('chat/completions', {
      messages,
      model: this.config.model,
      ...options
    });

    const latency = Date.now() - startTime;

    return {
      message: response.choices[0].message,
      finishReason: response.choices[0].finish_reason,
      usage: response.usage,
      model: response.model,
      provider: this.id,
      latency,
      functionCall: response.choices[0].message.function_call
    };
  }

  async *streamText(prompt: string, options: GenerationOptions): AsyncIterable<TextStreamChunk> {
    // Streaming implementation
    yield { text: 'chunk' };
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions): AsyncIterable<ChatStreamChunk> {
    // Streaming implementation
    yield { delta: { content: 'chunk' } };
  }

  validateConfig(config: ProviderConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!config.apiKey) {
      errors.push({
        type: 'missing_api_key',
        message: 'API key is required',
        severity: 'error'
      });
    }

    if (!config.model) {
      errors.push({
        type: 'missing_model',
        message: 'Model is required',
        severity: 'error'
      });
    }

    if (!this.capabilities.supportedModels.includes(config.model)) {
      warnings.push({
        type: 'unsupported_model',
        message: `Model ${config.model} is not supported`,
        severity: 'warning'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      await this.callOpenAI('models', {});
      const latency = Date.now() - startTime;
      
      return {
        isHealthy: true,
        latency
      };
    } catch (error) {
      return {
        isHealthy: false,
        latency: Date.now() - startTime,
        error: String(error)
      };
    }
  }

  getMetrics(): ProviderMetrics {
    return {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      averageLatency: 0,
      p50Latency: 0,
      p95Latency: 0,
      p99Latency: 0,
      tokenUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      uptime: 1
    };
  }

  async shutdown(): Promise<void> {
    // Cleanup
  }

  private async callOpenAI(endpoint: string, data: any): Promise<any> {
    // Implementation de l'appel API
    return {};
  }
}

interface TokenUsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
```

---

### Anthropic Provider

```typescript
class AnthropicProvider implements AIProvider {
  id = 'anthropic';
  name = 'Anthropic';
  type: ProviderType = 'anthropic';
  capabilities: ProviderCapabilities = {
    textGeneration: true,
    chatCompletion: true,
    streaming: true,
    functionCalling: false,
    imageGeneration: false,
    audioProcessing: false,
    maxTokens: 200000,
    supportedModels: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
  };
  config!: ProviderConfig;

  async initialize(config: ProviderConfig): Promise<void> {
    this.config = config;
  }

  async generateText(prompt: string, options: GenerationOptions): Promise<TextGenerationResult> {
    const startTime = Date.now();
    
    // Appeler l'API Anthropic
    const response = await this.callAnthropic('messages', {
      messages: [{ role: 'user', content: prompt }],
      model: this.config.model,
      ...options
    });

    const latency = Date.now() - startTime;

    return {
      text: response.content[0].text,
      finishReason: response.stop_reason,
      usage: response.usage,
      model: response.model,
      provider: this.id,
      latency
    };
  }

  async generateChat(messages: ChatMessage[], options: ChatOptions): Promise<ChatGenerationResult> {
    const startTime = Date.now();
    
    // Appeler l'API Anthropic
    const response = await this.callAnthropic('messages', {
      messages,
      model: this.config.model,
      ...options
    });

    const latency = Date.now() - startTime;

    return {
      message: {
        role: 'assistant',
        content: response.content[0].text
      },
      finishReason: response.stop_reason,
      usage: response.usage,
      model: response.model,
      provider: this.id,
      latency
    };
  }

  async *streamText(prompt: string, options: GenerationOptions): AsyncIterable<TextStreamChunk> {
    yield { text: 'chunk' };
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions): AsyncIterable<ChatStreamChunk> {
    yield { delta: { content: 'chunk' } };
  }

  validateConfig(config: ProviderConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!config.apiKey) {
      errors.push({
        type: 'missing_api_key',
        message: 'API key is required',
        severity: 'error'
      });
    }

    if (!config.model) {
      errors.push({
        type: 'missing_model',
        message: 'Model is required',
        severity: 'error'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      await this.callAnthropic('messages', { messages: [{ role: 'user', content: 'test' }] });
      const latency = Date.now() - startTime;
      
      return {
        isHealthy: true,
        latency
      };
    } catch (error) {
      return {
        isHealthy: false,
        latency: Date.now() - startTime,
        error: String(error)
      };
    }
  }

  getMetrics(): ProviderMetrics {
    return {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      averageLatency: 0,
      p50Latency: 0,
      p95Latency: 0,
      p99Latency: 0,
      tokenUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      uptime: 1
    };
  }

  async shutdown(): Promise<void> {
    // Cleanup
  }

  private async callAnthropic(endpoint: string, data: any): Promise<any> {
    // Implementation de l'appel API
    return {};
  }
}
```

---

### Google Provider

```typescript
class GoogleProvider implements AIProvider {
  id = 'google';
  name = 'Google';
  type: ProviderType = 'google';
  capabilities: ProviderCapabilities = {
    textGeneration: true,
    chatCompletion: true,
    streaming: true,
    functionCalling: true,
    imageGeneration: false,
    audioProcessing: false,
    maxTokens: 32000,
    supportedModels: ['gemini-pro', 'gemini-pro-vision']
  };
  config!: ProviderConfig;

  async initialize(config: ProviderConfig): Promise<void> {
    this.config = config;
  }

  async generateText(prompt: string, options: GenerationOptions): Promise<TextGenerationResult> {
    const startTime = Date.now();
    
    // Appeler l'API Google
    const response = await this.callGoogle('generateContent', {
      contents: [{ parts: [{ text: prompt }] }],
      model: this.config.model,
      ...options
    });

    const latency = Date.now() - startTime;

    return {
      text: response.candidates[0].content.parts[0].text,
      finishReason: response.candidates[0].finishReason,
      usage: response.usageMetadata,
      model: this.config.model,
      provider: this.id,
      latency
    };
  }

  async generateChat(messages: ChatMessage[], options: ChatOptions): Promise<ChatGenerationResult> {
    const startTime = Date.now();
    
    // Appeler l'API Google
    const response = await this.callGoogle('generateContent', {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      model: this.config.model,
      ...options
    });

    const latency = Date.now() - startTime;

    return {
      message: {
        role: 'assistant',
        content: response.candidates[0].content.parts[0].text
      },
      finishReason: response.candidates[0].finishReason,
      usage: response.usageMetadata,
      model: this.config.model,
      provider: this.id,
      latency
    };
  }

  async *streamText(prompt: string, options: GenerationOptions): AsyncIterable<TextStreamChunk> {
    yield { text: 'chunk' };
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions): AsyncIterable<ChatStreamChunk> {
    yield { delta: { content: 'chunk' } };
  }

  validateConfig(config: ProviderConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!config.apiKey) {
      errors.push({
        type: 'missing_api_key',
        message: 'API key is required',
        severity: 'error'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      await this.callGoogle('generateContent', { contents: [{ parts: [{ text: 'test' }] }] });
      const latency = Date.now() - startTime;
      
      return {
        isHealthy: true,
        latency
      };
    } catch (error) {
      return {
        isHealthy: false,
        latency: Date.now() - startTime,
        error: String(error)
      };
    }
  }

  getMetrics(): ProviderMetrics {
    return {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      averageLatency: 0,
      p50Latency: 0,
      p95Latency: 0,
      p99Latency: 0,
      tokenUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      uptime: 1
    };
  }

  async shutdown(): Promise<void> {
    // Cleanup
  }

  private async callGoogle(endpoint: string, data: any): Promise<any> {
    // Implementation de l'appel API
    return {};
  }
}
```

---

## Provider Registry

### Provider Registry Interface

```typescript
interface ProviderRegistry {
  registerProvider(provider: AIProvider): void;
  unregisterProvider(providerId: string): void;
  getProvider(providerId: string): AIProvider | undefined;
  getAllProviders(): AIProvider[];
  getProvidersByType(type: ProviderType): AIProvider[];
  getProvidersByCapability(capability: keyof ProviderCapabilities): AIProvider[];
  getDefaultProvider(): AIProvider | undefined;
  setDefaultProvider(providerId: string): void;
}
```

---

### Provider Registry Implementation

```typescript
class ProviderRegistryImpl implements ProviderRegistry {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProviderId?: string;

  registerProvider(provider: AIProvider): void {
    this.providers.set(provider.id, provider);
  }

  unregisterProvider(providerId: string): void {
    this.providers.delete(providerId);
    if (this.defaultProviderId === providerId) {
      this.defaultProviderId = undefined;
    }
  }

  getProvider(providerId: string): AIProvider | undefined {
    return this.providers.get(providerId);
  }

  getAllProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  getProvidersByType(type: ProviderType): AIProvider[] {
    return Array.from(this.providers.values()).filter(p => p.type === type);
  }

  getProvidersByCapability(capability: keyof ProviderCapabilities): AIProvider[] {
    return Array.from(this.providers.values()).filter(p => p.capabilities[capability]);
  }

  getDefaultProvider(): AIProvider | undefined {
    if (this.defaultProviderId) {
      return this.providers.get(this.defaultProviderId);
    }
    return this.providers.values().next().value;
  }

  setDefaultProvider(providerId: string): void {
    if (this.providers.has(providerId)) {
      this.defaultProviderId = providerId;
    }
  }
}
```

---

## Provider Selector

### Provider Selector Interface

```typescript
interface ProviderSelector {
  selectProvider(request: ProviderRequest): AIProvider;
  selectProviderByCapability(capability: keyof ProviderCapabilities): AIProvider;
  selectProviderByCost(request: ProviderRequest): AIProvider;
  selectProviderByLatency(request: ProviderRequest): AIProvider;
  selectProviderByQuality(request: ProviderRequest): AIProvider;
  selectProviderByAvailability(request: ProviderRequest): AIProvider;
}

interface ProviderRequest {
  type: 'text' | 'chat' | 'stream';
  capability: keyof ProviderCapabilities;
  maxTokens?: number;
  priority?: 'low' | 'medium' | 'high';
  budget?: number;
  maxLatency?: number;
  minQuality?: number;
}
```

---

### Provider Selector Implementation

```typescript
class ProviderSelectorImpl implements ProviderSelector {
  constructor(private registry: ProviderRegistry) {}

  selectProvider(request: ProviderRequest): AIProvider {
    // Sélectionner le provider par défaut
    const provider = this.registry.getDefaultProvider();
    
    if (!provider) {
      throw new Error('No provider available');
    }

    return provider;
  }

  selectProviderByCapability(capability: keyof ProviderCapabilities): AIProvider {
    const providers = this.registry.getProvidersByCapability(capability);
    
    if (providers.length === 0) {
      throw new Error(`No provider with capability ${capability}`);
    }

    return providers[0];
  }

  selectProviderByCost(request: ProviderRequest): AIProvider {
    const providers = this.registry.getAllProviders();
    
    // Sélectionner le provider le moins cher
    // (implémentation simplifiée)
    return providers[0];
  }

  selectProviderByLatency(request: ProviderRequest): AIProvider {
    const providers = this.registry.getAllProviders();
    
    // Sélectionner le provider avec la latence la plus faible
    let bestProvider = providers[0];
    let bestLatency = Infinity;

    for (const provider of providers) {
      const metrics = provider.getMetrics();
      if (metrics.averageLatency < bestLatency) {
        bestLatency = metrics.averageLatency;
        bestProvider = provider;
      }
    }

    return bestProvider;
  }

  selectProviderByQuality(request: ProviderRequest): AIProvider {
    const providers = this.registry.getAllProviders();
    
    // Sélectionner le provider avec la meilleure qualité
    // (implémentation simplifiée)
    return providers[0];
  }

  selectProviderByAvailability(request: ProviderRequest): AIProvider {
    const providers = this.registry.getAllProviders();
    
    // Sélectionner le provider avec la meilleure disponibilité
    let bestProvider = providers[0];
    let bestUptime = 0;

    for (const provider of providers) {
      const metrics = provider.getMetrics();
      if (metrics.uptime > bestUptime) {
        bestUptime = metrics.uptime;
        bestProvider = provider;
      }
    }

    return bestProvider;
  }
}
```

---

## Provider Adapter

### Provider Adapter Interface

```typescript
interface ProviderAdapter {
  adaptRequest(request: UnifiedRequest, provider: AIProvider): ProviderSpecificRequest;
  adaptResponse(response: ProviderSpecificResponse, provider: AIProvider): UnifiedResponse;
  adaptError(error: ProviderSpecificError, provider: AIProvider): UnifiedError;
  normalizeConfig(config: any, provider: AIProvider): ProviderConfig;
}

interface UnifiedRequest {
  type: 'text' | 'chat' | 'stream';
  prompt?: string;
  messages?: ChatMessage[];
  options: GenerationOptions | ChatOptions;
}

interface ProviderSpecificRequest {
  provider: string;
  data: any;
}

interface UnifiedResponse {
  text?: string;
  message?: ChatMessage;
  finishReason: FinishReason;
  usage: Usage;
  model: string;
  provider: string;
  latency: number;
}

interface ProviderSpecificResponse {
  provider: string;
  data: any;
}

interface UnifiedError {
  code: string;
  message: string;
  provider: string;
  details?: any;
}

interface ProviderSpecificError {
  provider: string;
  error: any;
}
```

---

### Provider Adapter Implementation

```typescript
class ProviderAdapterImpl implements ProviderAdapter {
  adaptRequest(request: UnifiedRequest, provider: AIProvider): ProviderSpecificRequest {
    const providerSpecificData: any = {
      model: provider.config.model,
      ...request.options
    };

    if (request.type === 'text' && request.prompt) {
      providerSpecificData.prompt = request.prompt;
    } else if (request.type === 'chat' && request.messages) {
      providerSpecificData.messages = request.messages;
    }

    return {
      provider: provider.id,
      data: providerSpecificData
    };
  }

  adaptResponse(response: ProviderSpecificResponse, provider: AIProvider): UnifiedResponse {
    if (provider.type === 'openai') {
      return this.adaptOpenAIResponse(response, provider);
    } else if (provider.type === 'anthropic') {
      return this.adaptAnthropicResponse(response, provider);
    } else if (provider.type === 'google') {
      return this.adaptGoogleResponse(response, provider);
    }

    throw new Error(`Unsupported provider: ${provider.type}`);
  }

  adaptError(error: ProviderSpecificError, provider: AIProvider): UnifiedError {
    return {
      code: 'PROVIDER_ERROR',
      message: String(error.error),
      provider: provider.id,
      details: error.error
    };
  }

  normalizeConfig(config: any, provider: AIProvider): ProviderConfig {
    return {
      apiKey: config.apiKey || '',
      model: config.model || provider.capabilities.supportedModels[0],
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      topP: config.topP,
      frequencyPenalty: config.frequencyPenalty,
      presencePenalty: config.presencePenalty,
      timeout: config.timeout,
      retryConfig: config.retryConfig,
      rateLimitConfig: config.rateLimitConfig
    };
  }

  private adaptOpenAIResponse(response: ProviderSpecificResponse, provider: AIProvider): UnifiedResponse {
    const data = response.data;
    
    if (data.choices && data.choices[0]) {
      return {
        text: data.choices[0].text,
        message: data.choices[0].message,
        finishReason: data.choices[0].finish_reason,
        usage: data.usage,
        model: data.model,
        provider: provider.id,
        latency: 0
      };
    }

    throw new Error('Invalid OpenAI response');
  }

  private adaptAnthropicResponse(response: ProviderSpecificResponse, provider: AIProvider): UnifiedResponse {
    const data = response.data;
    
    if (data.content && data.content[0]) {
      return {
        text: data.content[0].text,
        message: {
          role: 'assistant',
          content: data.content[0].text
        },
        finishReason: data.stop_reason,
        usage: data.usage,
        model: data.model,
        provider: provider.id,
        latency: 0
      };
    }

    throw new Error('Invalid Anthropic response');
  }

  private adaptGoogleResponse(response: ProviderSpecificResponse, provider: AIProvider): UnifiedResponse {
    const data = response.data;
    
    if (data.candidates && data.candidates[0]) {
      return {
        text: data.candidates[0].content.parts[0].text,
        message: {
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text
        },
        finishReason: data.candidates[0].finishReason,
        usage: data.usageMetadata,
        model: data.model,
        provider: provider.id,
        latency: 0
      };
    }

    throw new Error('Invalid Google response');
  }
}
```

---

## Provider Monitor

### Provider Monitor Interface

```typescript
interface ProviderMonitor {
  monitorProvider(provider: AIProvider): void;
  getProviderStatus(providerId: string): ProviderStatus;
  getAllProviderStatuses(): Map<string, ProviderStatus>;
  getProviderMetrics(providerId: string): ProviderMetrics;
  getAllProviderMetrics(): Map<string, ProviderMetrics>;
  getProviderAlerts(providerId: string): ProviderAlert[];
  getAllProviderAlerts(): ProviderAlert[];
  setAlertThreshold(providerId: string, threshold: AlertThreshold): void;
}

interface ProviderStatus {
  providerId: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: Date;
  uptime: number;
  errorRate: number;
  averageLatency: number;
}

interface ProviderAlert {
  id: string;
  providerId: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

type AlertType = 
  | 'high_latency'
  | 'high_error_rate'
  | 'low_uptime'
  | 'rate_limit_exceeded'
  | 'quota_exceeded'
  | 'api_key_invalid';

interface AlertThreshold {
  maxLatency?: number;
  maxErrorRate?: number;
  minUptime?: number;
}
```

---

### Provider Monitor Implementation

```typescript
class ProviderMonitorImpl implements ProviderMonitor {
  private statuses: Map<string, ProviderStatus> = new Map();
  private metrics: Map<string, ProviderMetrics> = new Map();
  private alerts: Map<string, ProviderAlert[]> = new Map();
  private thresholds: Map<string, AlertThreshold> = new Map();
  private monitoringInterval?: NodeJS.Timeout;

  constructor(private registry: ProviderRegistry) {
    this.startMonitoring();
  }

  monitorProvider(provider: AIProvider): void {
    // Health check periodique
    setInterval(async () => {
      const healthCheck = await provider.healthCheck();
      const metrics = provider.getMetrics();

      this.updateStatus(provider.id, healthCheck, metrics);
      this.checkAlerts(provider.id, healthCheck, metrics);
    }, 60000); // Toutes les minutes
  }

  getProviderStatus(providerId: string): ProviderStatus {
    return this.statuses.get(providerId) || {
      providerId,
      status: 'unhealthy',
      lastCheck: new Date(),
      uptime: 0,
      errorRate: 1,
      averageLatency: 0
    };
  }

  getAllProviderStatuses(): Map<string, ProviderStatus> {
    return new Map(this.statuses);
  }

  getProviderMetrics(providerId: string): ProviderMetrics {
    return this.metrics.get(providerId) || {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      averageLatency: 0,
      p50Latency: 0,
      p95Latency: 0,
      p99Latency: 0,
      tokenUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      uptime: 0
    };
  }

  getAllProviderMetrics(): Map<string, ProviderMetrics> {
    return new Map(this.metrics);
  }

  getProviderAlerts(providerId: string): ProviderAlert[] {
    return this.alerts.get(providerId) || [];
  }

  getAllProviderAlerts(): ProviderAlert[] {
    const allAlerts: ProviderAlert[] = [];
    this.alerts.forEach(alerts => {
      allAlerts.push(...alerts);
    });
    return allAlerts;
  }

  setAlertThreshold(providerId: string, threshold: AlertThreshold): void {
    this.thresholds.set(providerId, threshold);
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.registry.getAllProviders().forEach(provider => {
        this.monitorProvider(provider);
      });
    }, 60000);
  }

  private updateStatus(providerId: string, healthCheck: HealthCheckResult, metrics: ProviderMetrics): void {
    const currentStatus = this.statuses.get(providerId);
    
    const status: ProviderStatus = {
      providerId,
      status: healthCheck.isHealthy ? 'healthy' : 'unhealthy',
      lastCheck: new Date(),
      uptime: metrics.uptime,
      errorRate: metrics.errorCount / (metrics.requestCount || 1),
      averageLatency: metrics.averageLatency
    };

    this.statuses.set(providerId, status);
    this.metrics.set(providerId, metrics);
  }

  private checkAlerts(providerId: string, healthCheck: HealthCheckResult, metrics: ProviderMetrics): void {
    const threshold = this.thresholds.get(providerId);
    const providerAlerts = this.alerts.get(providerId) || [];

    // Vérifier la latence
    if (threshold?.maxLatency && metrics.averageLatency > threshold.maxLatency) {
      providerAlerts.push({
        id: `alert-${Date.now()}`,
        providerId,
        type: 'high_latency',
        severity: 'warning',
        message: `High latency detected: ${metrics.averageLatency}ms`,
        timestamp: new Date(),
        resolved: false
      });
    }

    // Vérifier le taux d'erreur
    const errorRate = metrics.errorCount / (metrics.requestCount || 1);
    if (threshold?.maxErrorRate && errorRate > threshold.maxErrorRate) {
      providerAlerts.push({
        id: `alert-${Date.now()}`,
        providerId,
        type: 'high_error_rate',
        severity: 'error',
        message: `High error rate detected: ${errorRate}`,
        timestamp: new Date(),
        resolved: false
      });
    }

    // Vérifier l'uptime
    if (threshold?.minUptime && metrics.uptime < threshold.minUptime) {
      providerAlerts.push({
        id: `alert-${Date.now()}`,
        providerId,
        type: 'low_uptime',
        severity: 'critical',
        message: `Low uptime detected: ${metrics.uptime}`,
        timestamp: new Date(),
        resolved: false
      });
    }

    this.alerts.set(providerId, providerAlerts);
  }
}
```

---

## Provider Fallback

### Provider Fallback Interface

```typescript
interface ProviderFallback {
  setFallbackStrategy(strategy: FallbackStrategy): void;
  executeFallback(request: UnifiedRequest, failedProvider: AIProvider): Promise<UnifiedResponse>;
  getFallbackChain(): AIProvider[];
  setFallbackChain(providers: AIProvider[]): void;
  addFallbackProvider(provider: AIProvider): void;
  removeFallbackProvider(providerId: string): void;
}

type FallbackStrategy = 
  | 'sequential'
  | 'parallel'
  | 'weighted'
  | 'adaptive';

interface FallbackConfig {
  strategy: FallbackStrategy;
  maxRetries: number;
  timeout: number;
  fallbackChain: string[];
}
```

---

### Provider Fallback Implementation

```typescript
class ProviderFallbackImpl implements ProviderFallback {
  private strategy: FallbackStrategy = 'sequential';
  private fallbackChain: AIProvider[] = [];
  private maxRetries = 3;
  private timeout = 30000;

  constructor(private registry: ProviderRegistry, private selector: ProviderSelector) {
    this.initializeFallbackChain();
  }

  setFallbackStrategy(strategy: FallbackStrategy): void {
    this.strategy = strategy;
  }

  async executeFallback(request: UnifiedRequest, failedProvider: AIProvider): Promise<UnifiedResponse> {
    switch (this.strategy) {
      case 'sequential':
        return this.executeSequentialFallback(request, failedProvider);
      case 'parallel':
        return this.executeParallelFallback(request, failedProvider);
      case 'weighted':
        return this.executeWeightedFallback(request, failedProvider);
      case 'adaptive':
        return this.executeAdaptiveFallback(request, failedProvider);
      default:
        throw new Error(`Unsupported fallback strategy: ${this.strategy}`);
    }
  }

  getFallbackChain(): AIProvider[] {
    return [...this.fallbackChain];
  }

  setFallbackChain(providers: AIProvider[]): void {
    this.fallbackChain = providers;
  }

  addFallbackProvider(provider: AIProvider): void {
    this.fallbackChain.push(provider);
  }

  removeFallbackProvider(providerId: string): void {
    this.fallbackChain = this.fallbackChain.filter(p => p.id !== providerId);
  }

  private initializeFallbackChain(): void {
    // Initialiser la chaîne de fallback avec tous les providers
    this.fallbackChain = this.registry.getAllProviders();
  }

  private async executeSequentialFallback(request: UnifiedRequest, failedProvider: AIProvider): Promise<UnifiedResponse> {
    const providers = this.fallbackChain.filter(p => p.id !== failedProvider.id);

    for (const provider of providers) {
      try {
        const response = await this.executeWithProvider(request, provider);
        return response;
      } catch (error) {
        console.error(`Provider ${provider.id} failed:`, error);
        continue;
      }
    }

    throw new Error('All fallback providers failed');
  }

  private async executeParallelFallback(request: UnifiedRequest, failedProvider: AIProvider): Promise<UnifiedResponse> {
    const providers = this.fallbackChain.filter(p => p.id !== failedProvider.id);

    const promises = providers.map(provider => 
      this.executeWithProvider(request, provider).catch(error => {
        console.error(`Provider ${provider.id} failed:`, error);
        return null;
      })
    );

    const results = await Promise.all(promises);
    const successfulResult = results.find(r => r !== null);

    if (successfulResult) {
      return successfulResult;
    }

    throw new Error('All fallback providers failed');
  }

  private async executeWeightedFallback(request: UnifiedRequest, failedProvider: AIProvider): Promise<UnifiedResponse> {
    // Implémentation avec pondération basée sur les métriques
    const providers = this.fallbackChain.filter(p => p.id !== failedProvider.id);
    
    // Trier par uptime
    providers.sort((a, b) => {
      const metricsA = a.getMetrics();
      const metricsB = b.getMetrics();
      return metricsB.uptime - metricsA.uptime;
    });

    for (const provider of providers) {
      try {
        const response = await this.executeWithProvider(request, provider);
        return response;
      } catch (error) {
        console.error(`Provider ${provider.id} failed:`, error);
        continue;
      }
    }

    throw new Error('All fallback providers failed');
  }

  private async executeAdaptiveFallback(request: UnifiedRequest, failedProvider: AIProvider): Promise<UnifiedResponse> {
    // Implémentation adaptative basée sur le type de requête
    const providers = this.fallbackChain.filter(p => p.id !== failedProvider.id);

    if (request.type === 'chat') {
      // Préférer les providers avec chat completion
      const chatProviders = providers.filter(p => p.capabilities.chatCompletion);
      for (const provider of chatProviders) {
        try {
          const response = await this.executeWithProvider(request, provider);
          return response;
        } catch (error) {
          console.error(`Provider ${provider.id} failed:`, error);
          continue;
        }
      }
    }

    // Fallback séquentiel
    return this.executeSequentialFallback(request, failedProvider);
  }

  private async executeWithProvider(request: UnifiedRequest, provider: AIProvider): Promise<UnifiedResponse> {
    const adapter = new ProviderAdapterImpl();

    if (request.type === 'text' && request.prompt) {
      const result = await provider.generateText(request.prompt, request.options as GenerationOptions);
      return {
        text: result.text,
        finishReason: result.finishReason,
        usage: result.usage,
        model: result.model,
        provider: result.provider,
        latency: result.latency
      };
    } else if (request.type === 'chat' && request.messages) {
      const result = await provider.generateChat(request.messages, request.options as ChatOptions);
      return {
        message: result.message,
        finishReason: result.finishReason,
        usage: result.usage,
        model: result.model,
        provider: result.provider,
        latency: result.latency
      };
    }

    throw new Error('Invalid request type');
  }
}
```

---

## Conclusion

Le Provider Abstraction spécifie la couche d'abstraction des providers AI avec :

1. **AI Provider Interface** : interface unifiée pour tous les providers (OpenAI, Anthropic, Google, etc.)
2. **Provider Implementations** : OpenAIProvider, AnthropicProvider, GoogleProvider avec implémentations spécifiques
3. **Provider Registry** : registerProvider, unregisterProvider, getProvider, getAllProviders, getProvidersByType, getProvidersByCapability, getDefaultProvider, setDefaultProvider
4. **Provider Selector** : selectProvider, selectProviderByCapability, selectProviderByCost, selectProviderByLatency, selectProviderByQuality, selectProviderByAvailability
5. **Provider Adapter** : adaptRequest, adaptResponse, adaptError, normalizeConfig
6. **Provider Monitor** : monitorProvider, getProviderStatus, getAllProviderStatuses, getProviderMetrics, getAllProviderMetrics, getProviderAlerts, getAllProviderAlerts, setAlertThreshold
7. **Provider Fallback** : setFallbackStrategy, executeFallback, getFallbackChain, setFallbackChain, addFallbackProvider, removeFallbackProvider

Ce document fournit une spécification exécutable pour implémenter la couche d'abstraction des providers AI.
