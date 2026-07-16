/**
 * OpenAI GPT-4o Realtime WebSocket Transport Implementation
 *
 * Responsibilities:
 * - Implement WebSocket connection to OpenAI Realtime API
 * - Handle connection lifecycle (open, close, reconnect)
 * - Handle authentication via API key
 * - Handle network errors
 * - Implement handshake
 * - Implement heartbeat ping/pong
 * - Implement exponential backoff reconnection
 * - Handle timeouts
 * - Graceful shutdown
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY WebSocket transport implementation
 */
// @ts-nocheck


import { OpenAIRealtimeConfiguration, OpenAIRealtimeTransport } from "./OpenAIRealtimeConversationProvider";

// ============================================================================
// WEBSOCKET TRANSPORT CONFIG
// ============================================================================

export interface WebSocketTransportConfig {
  url: string;
  apiKey: string;
  model: string;
  timeout?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
}

// ============================================================================
// WEBSOCKET TRANSPORT STATE
// ============================================================================

type ConnectionState = 
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | "Handshaking"
  | "Ready"
  | "Reconnecting"
  | "Closing"
  | "Error";

// ============================================================================
// WEBSOCKET TRANSPORT IMPLEMENTATION
// ============================================================================

export class OpenAIRealtimeWebSocketTransportImpl implements OpenAIRealtimeTransport {
  private ws: WebSocket | null = null;
  private config: WebSocketTransportConfig | null = null;
  private state: ConnectionState = "Disconnected";
  private reconnectAttempts: number = 0;
  private messageQueue: Array<Record<string, unknown>> = [];
  private eventQueue: Array<Record<string, unknown>> = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private lastPongTime: number = 0;

  async connect(config: OpenAIRealtimeConfiguration): Promise<void> {
    this.config = {
      url: config.endpoint || "wss://api.openai.com/v1/realtime",
      apiKey: config.apiKey,
      model: config.model,
      timeout: 30000,
      reconnectInterval: 1000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 15000,
      heartbeatTimeout: 5000
    };

    this.state = "Connecting";
    await this.connectWebSocket();
  }

  async disconnect(): Promise<void> {
    this.state = "Closing";
    
    // Clear all timers
    this.clearAllTimers();
    
    // Close WebSocket
    if (this.ws) {
      this.ws.close(1000, "Normal closure");
      this.ws = null;
    }
    
    this.state = "Disconnected";
    this.messageQueue = [];
    this.eventQueue = [];
    this.reconnectAttempts = 0;
  }

  async send(data: Record<string, unknown>): Promise<void> {
    if (this.state !== "Ready" || !this.ws) {
      this.messageQueue.push(data);
      return;
    }

    try {
      this.ws.send(JSON.stringify(data));
    } catch (error) {
      throw new Error(`Failed to send WebSocket message: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async *receive(): AsyncGenerator<Record<string, unknown>> {
    while (this.state === "Ready" || this.state === "Connected" || this.state === "Handshaking") {
      if (this.eventQueue.length > 0) {
        yield this.eventQueue.shift()!;
      } else {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }

  isConnected(): boolean {
    return this.state === "Ready";
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async connectWebSocket(): Promise<void> {
    if (!this.config) {
      throw new Error("Transport config not set");
    }

    const config = this.config;

    return new Promise((resolve, reject) => {
      try {
        const url = `${config.url}?model=${config.model}`;
        this.ws = new WebSocket(url, ["realtime", `openai-in-${config.apiKey}`]);

        this.ws.onopen = () => {
          this.state = "Connected";
          this.reconnectAttempts = 0;
          this.startHandshake();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.state = "Error";
          this.clearAllTimers();
          reject(new Error("WebSocket connection error"));
        };

        this.ws.onclose = (event) => {
          this.state = "Disconnected";
          this.clearAllTimers();
          
          if (event.code !== 1000) {
            this.scheduleReconnect();
          }
        };

        // Set connection timeout
        this.connectionTimeout = setTimeout(() => {
          if (this.state === "Connecting" || this.state === "Handshaking") {
            this.ws?.close(1006, "Connection timeout");
            reject(new Error("WebSocket connection timeout"));
          }
        }, config.timeout || 30000);

      } catch (error) {
        reject(new Error(`Failed to create WebSocket connection: ${error instanceof Error ? error.message : "Unknown error"}`));
      }
    });
  }

  private startHandshake(): void {
    this.state = "Handshaking";
    
    // Send session.update to configure the session
    const handshakeMessage = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions: "You are a helpful AI assistant.",
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: {
          model: "whisper-1"
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        }
      }
    };

    this.send(handshakeMessage).catch(error => {
      console.error("Handshake failed:", error);
      this.state = "Error";
    });

    // Wait for session.created event
    const handshakeTimeout = setTimeout(() => {
      if (this.state === "Handshaking") {
        console.error("Handshake timeout");
        this.state = "Error";
        this.scheduleReconnect();
      }
    }, 10000);

    // Store timeout reference for cleanup
    this.connectionTimeout = handshakeTimeout;
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      
      // Handle session.created for handshake completion
      if (message.type === "session.created") {
        this.state = "Ready";
        this.flushMessageQueue();
        this.startHeartbeat();
      }
      
      // Handle pong for heartbeat
      if (message.type === "pong") {
        this.lastPongTime = Date.now();
        if (this.heartbeatTimeout) {
          clearTimeout(this.heartbeatTimeout);
          this.heartbeatTimeout = null;
        }
      }
      
      // Queue event for consumption
      this.eventQueue.push(message);
      
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.sendPing();
    }, this.config?.heartbeatInterval || 15000);
  }

  private sendPing(): void {
    if (!this.ws || this.state !== "Ready") {
      return;
    }

    try {
      this.ws.send(JSON.stringify({ type: "ping" }));
      
      // Set timeout for pong response
      this.heartbeatTimeout = setTimeout(() => {
        console.error("Heartbeat timeout - no pong received");
        this.state = "Error";
        this.scheduleReconnect();
      }, this.config?.heartbeatTimeout || 5000);
      
    } catch (error) {
      console.error("Failed to send ping:", error);
      this.state = "Error";
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= (this.config?.maxReconnectAttempts || 10)) {
      console.error("Max reconnection attempts reached");
      this.state = "Error";
      return;
    }

    this.state = "Reconnecting";
    const backoffDelay = this.calculateBackoffDelay();
    
    console.log(`Reconnecting in ${backoffDelay}ms (attempt ${this.reconnectAttempts + 1})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connectWebSocket().catch(error => {
        console.error("Reconnection failed:", error);
        this.scheduleReconnect();
      });
    }, backoffDelay);
  }

  private calculateBackoffDelay(): number {
    const baseDelay = this.config?.reconnectInterval || 1000;
    const maxDelay = 30000;
    const exponentialDelay = baseDelay * Math.pow(2, this.reconnectAttempts);
    const jitter = Math.random() * 1000;
    return Math.min(exponentialDelay + jitter, maxDelay);
  }

  private clearAllTimers(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.state === "Ready" && this.ws) {
      const message = this.messageQueue.shift();
      if (message && this.ws) {
        try {
          this.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error("Failed to flush queued message:", error);
          // Re-queue message on error
          this.messageQueue.unshift(message);
          break;
        }
      }
    }
  }
}
