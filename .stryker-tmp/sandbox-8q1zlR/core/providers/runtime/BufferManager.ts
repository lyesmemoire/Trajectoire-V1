/**
 * Provider Runtime Buffer Manager
 *
 * Responsibilities:
 * - Queue management for audio buffers
 * - Guaranteed order
 * - Memory cleanup
 * - Backpressure handling
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY technical buffer management
 */
// @ts-nocheck


import { AudioBuffer } from "./AudioStreaming";

// ============================================================================
// BUFFER MANAGER CONFIG
// ============================================================================

export interface BufferManagerConfig {
  maxBufferSize: number;
  maxQueueSize: number;
  backpressureThreshold: number;
  cleanupInterval: number;
}

// ============================================================================
// BUFFER MANAGER INTERFACE
// ============================================================================

export interface BufferManager {
  enqueue(buffer: AudioBuffer): Promise<boolean>;
  dequeue(): AudioBuffer | null;
  peek(): AudioBuffer | null;
  clear(): void;
  getQueueSize(): number;
  getMemoryUsage(): number;
  isUnderBackpressure(): boolean;
  startCleanup(): void;
  stopCleanup(): void;
}

// ============================================================================
// BUFFER MANAGER IMPLEMENTATION
// ============================================================================

export class BufferManagerImpl implements BufferManager {
  private queue: AudioBuffer[] = [];
  private config: BufferManagerConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private totalMemory: number = 0;

  constructor(config: BufferManagerConfig = {
    maxBufferSize: 1024 * 1024, // 1MB
    maxQueueSize: 1000,
    backpressureThreshold: 800,
    cleanupInterval: 5000 // 5 seconds
  }) {
    this.config = config;
  }

  enqueue(buffer: AudioBuffer): Promise<boolean> {
    // Check if buffer exceeds max size
    if (buffer.data.length > this.config.maxBufferSize) {
      return Promise.reject(new Error("Buffer size exceeds maximum"));
    }

    // Check backpressure
    if (this.isUnderBackpressure()) {
      return Promise.resolve(false);
    }

    // Check queue size
    if (this.queue.length >= this.config.maxQueueSize) {
      return Promise.resolve(false);
    }

    // Add to queue
    this.queue.push(buffer);
    this.totalMemory += buffer.data.length;

    return Promise.resolve(true);
  }

  dequeue(): AudioBuffer | null {
    if (this.queue.length === 0) {
      return null;
    }

    const buffer = this.queue.shift();
    if (buffer) {
      this.totalMemory -= buffer.data.length;
    }
    return buffer ?? null;
  }

  peek(): AudioBuffer | null {
    if (this.queue.length === 0) {
      return null;
    }
    return this.queue[0];
  }

  clear(): void {
    this.queue = [];
    this.totalMemory = 0;
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getMemoryUsage(): number {
    return this.totalMemory;
  }

  isUnderBackpressure(): boolean {
    return this.queue.length >= this.config.backpressureThreshold;
  }

  startCleanup(): void {
    if (this.cleanupTimer) {
      return;
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  private cleanup(): void {
    // Remove old buffers based on timestamp
    const now = Date.now();
    const maxAge = 30000; // 30 seconds

    const initialSize = this.queue.length;
    this.queue = this.queue.filter(buffer => {
      const age = now - buffer.timestamp;
      if (age > maxAge) {
        this.totalMemory -= buffer.data.length;
        return false;
      }
      return true;
    });

    // Log cleanup if buffers were removed
    if (this.queue.length < initialSize) {
      console.log(`BufferManager: Cleaned up ${initialSize - this.queue.length} old buffers`);
    }
  }
}
