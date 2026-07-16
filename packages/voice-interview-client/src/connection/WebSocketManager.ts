/**
 * WebSocket lifecycle manager.
 * Handles connect, reconnect, heartbeat, send, and close.
 */

import type { ConnectionConfig } from "../types/config.js";
import type { OutboundMessage } from "../types/protocol.js";
import { MessageParser } from "../protocol/MessageParser.js";
import { MessageSequencer } from "../protocol/MessageSequencer.js";
import { HEARTBEAT_MESSAGE, MAX_MESSAGE_SIZE_BYTES } from "../protocol/ProtocolConstants.js";
import { BackoffStrategy } from "./BackoffStrategy.js";
import { ConnectionMonitor } from "./ConnectionMonitor.js";
import { ConnectionError } from "../errors/ConnectionError.js";

export type WebSocketStatus = "disconnected" | "connecting" | "connected" | "reconnecting" | "closed";

export interface WebSocketManagerCallbacks {
  readonly onMessage: (message: OutboundMessage) => void;
  readonly onOpen: () => void;
  readonly onClose: (code: number, reason: string) => void;
  readonly onError: (error: ConnectionError) => void;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private connectionTimer: ReturnType<typeof setTimeout> | null = null;
  private _status: WebSocketStatus = "disconnected";
  private readonly config: ConnectionConfig;
  private readonly callbacks: WebSocketManagerCallbacks;
  private readonly backoff: BackoffStrategy;
  private readonly monitor: ConnectionMonitor;
  private readonly sequencer: MessageSequencer;

  constructor(
    config: ConnectionConfig,
    callbacks: WebSocketManagerCallbacks,
    monitor: ConnectionMonitor,
    sequencer: MessageSequencer
  ) {
    this.config = config;
    this.callbacks = callbacks;
    this.backoff = new BackoffStrategy(
      config.initialBackoffMs,
      config.maxBackoffMs,
      config.backoffMultiplier
    );
    this.monitor = monitor;
    this.sequencer = sequencer;
  }

  get status(): WebSocketStatus {
    return this._status;
  }

  get retryCount(): number {
    return this.backoff.currentAttempt;
  }

  connect(ticket: string): void {
    this.cleanup();
    this._status = "connecting";

    const url = `${this.config.wsUrl}?ticket=${encodeURIComponent(ticket)}`;

    try {
      this.ws = new WebSocket(url);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "WebSocket construction failed";
      this.callbacks.onError(ConnectionError.websocketFailed(this.backoff.currentAttempt, message));
      return;
    }

    this.ws.binaryType = "arraybuffer";

    // Connection timeout
    this.connectionTimer = setTimeout(() => {
      if (this._status === "connecting") {
        this.ws?.close(4008, "Connection timeout");
        this.callbacks.onError(ConnectionError.timeout(this.config.connectionTimeoutMs));
      }
    }, this.config.connectionTimeoutMs);

    this.ws.onopen = () => {
      this.clearConnectionTimer();
      this._status = "connected";
      this.backoff.reset();
      this.startHeartbeat();
      this.drainQueue();
      this.callbacks.onOpen();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      try {
        const message = MessageParser.parse(event.data);
        if (message.type === "PONG") {
          this.monitor.recordPongReceived();
          return;
        }
        this.callbacks.onMessage(message);
      } catch (error: unknown) {
        // Malformed message — log but don't crash
        if (error instanceof Error) {
          this.callbacks.onError(
            ConnectionError.websocketFailed(0, error.message)
          );
        }
      }
    };

    this.ws.onclose = (event: CloseEvent) => {
      this.clearConnectionTimer();
      this.stopHeartbeat();
      this._status = "disconnected";
      this.callbacks.onClose(event.code, event.reason);
    };

    this.ws.onerror = () => {
      // The error event doesn't carry useful info; onclose will follow.
    };
  }

  send(payload: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }
    if (payload.length > MAX_MESSAGE_SIZE_BYTES) {
      return false;
    }
    this.ws.send(payload);
    return true;
  }

  disconnect(code: number = 1000, reason: string = "Client disconnect"): void {
    this._status = "closed";
    this.cleanup();
    this.ws?.close(code, reason);
    this.ws = null;
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.monitor.recordPingSent();
        this.ws.send(HEARTBEAT_MESSAGE);
      }
    }, this.config.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private clearConnectionTimer(): void {
    if (this.connectionTimer !== null) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }
  }

  private drainQueue(): void {
    const queued = this.sequencer.drain();
    for (const msg of queued) {
      this.send(msg);
    }
  }

  private cleanup(): void {
    this.stopHeartbeat();
    this.clearConnectionTimer();
  }

  destroy(): void {
    this.cleanup();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onclose = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, "Client destroyed");
      }
      this.ws = null;
    }
    this._status = "disconnected";
    this.monitor.reset();
    this.sequencer.reset();
  }
}
