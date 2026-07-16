/**
 * OpenAI Realtime Provider Implementation
 *
 * Responsibilities:
 * - Implement RealtimeConversationProvider interface for OpenAI
 * - Use existing OpenAIRealtimeWebSocketTransport for connection
 * - Use existing OpenAIRealtimeAuthManager for authentication
 * - Use existing OpenAIRealtimeSessionManager for session management
 * - Use existing OpenAIRealtimeEventMapper for event mapping
 * - Use existing OpenAIRealtimeErrorHandler for error handling
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY OpenAI Realtime API integration
 */

import {
  Provider
} from "../ProviderAbstractionLayer";
import {
  OpenAIRealtimeWebSocketTransportImpl
} from "./OpenAIRealtimeWebSocketTransport";
import {
  OpenAIRealtimeAuthManagerImpl
} from "./OpenAIRealtimeAuthManager";
import {
  OpenAIRealtimeSessionManagerImpl
} from "./OpenAIRealtimeSessionManagerImpl";
import {
  OpenAIRealtimeEventMapperImpl
} from "./OpenAIRealtimeEventMapperImpl";
import {
  OpenAIRealtimeErrorHandlerImpl
} from "./OpenAIRealtimeErrorHandler";
import {
  OpenAIRealtimeConfiguration
} from "./OpenAIRealtimeConversationProvider";

// ============================================================================
// PROVIDER IMPLEMENTATION INTERFACE
// ============================================================================

export interface ProviderImplementation {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  startSession(config: Record<string, unknown>): Promise<string>;
  stopSession(sessionId: string): Promise<void>;
  send(data: Record<string, unknown>): Promise<void>;
  receive(): AsyncGenerator<Record<string, unknown>>;
  close(): Promise<void>;
}

// ============================================================================
// OPENAI REALTIME PROVIDER IMPLEMENTATION
// ============================================================================

export class OpenAIRealtimeProviderImpl implements ProviderImplementation {
  private provider: Provider;
  private webSocketTransport: OpenAIRealtimeWebSocketTransportImpl;
  private authManager: OpenAIRealtimeAuthManagerImpl;
  private sessionManager: OpenAIRealtimeSessionManagerImpl;
  private eventMapper: OpenAIRealtimeEventMapperImpl;
  private errorHandler: OpenAIRealtimeErrorHandlerImpl;
  private connected: boolean = false;
  private sessionId: string | null = null;

  constructor(
    webSocketTransport: OpenAIRealtimeWebSocketTransportImpl,
    authManager: OpenAIRealtimeAuthManagerImpl,
    sessionManager: OpenAIRealtimeSessionManagerImpl,
    eventMapper: OpenAIRealtimeEventMapperImpl,
    errorHandler: OpenAIRealtimeErrorHandlerImpl,
    provider: Provider
  ) {
    this.webSocketTransport = webSocketTransport;
    this.authManager = authManager;
    this.sessionManager = sessionManager;
    this.eventMapper = eventMapper;
    this.errorHandler = errorHandler;
    this.provider = provider;
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    const config: OpenAIRealtimeConfiguration = {
      apiKey: this.provider.configuration.apiKey || "",
      model: this.provider.configuration.model || "gpt-4o-realtime-preview",
      endpoint: this.provider.configuration.endpoint || "wss://api.openai.com/v1/realtime",
      options: {}
    };

    await this.webSocketTransport.connect(config);
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    await this.webSocketTransport.disconnect();
    this.connected = false;
  }

  async startSession(config: Record<string, unknown>): Promise<string> {
    if (!this.connected) {
      throw new Error("Provider not connected");
    }

    const openaiConfig: OpenAIRealtimeConfiguration = {
      apiKey: this.provider.configuration.apiKey || "",
      model: this.provider.configuration.model || "gpt-4o-realtime-preview",
      endpoint: this.provider.configuration.endpoint || "wss://api.openai.com/v1/realtime",
      options: (config.options as Record<string, unknown>) || {}
    };

    const sessionId = await this.sessionManager.createSession(openaiConfig);
    this.sessionId = sessionId;
    return sessionId;
  }

  async stopSession(sessionId: string): Promise<void> {
    if (!this.sessionId || this.sessionId !== sessionId) {
      return;
    }

    await this.sessionManager.closeSession(sessionId);
    this.sessionId = null;
  }

  async send(data: Record<string, unknown>): Promise<void> {
    if (!this.connected) {
      throw new Error("Provider not connected");
    }

    const mappedData = this.eventMapper.mapFromRuntime(data);
    await this.webSocketTransport.send(mappedData);
  }

  async *receive(): AsyncGenerator<Record<string, unknown>> {
    if (!this.connected) {
      throw new Error("Provider not connected");
    }

    for await (const data of this.webSocketTransport.receive()) {
      const mappedData = this.eventMapper.mapToRuntime(data);
      yield mappedData;
    }
  }

  async close(): Promise<void> {
    if (this.sessionId) {
      await this.stopSession(this.sessionId);
    }
    await this.disconnect();
  }

  getProvider(): Provider {
    return this.provider;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}
