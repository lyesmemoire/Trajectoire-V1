/**
 * Integration Tests for Audio Streaming
 */
// @ts-nocheck


import { AudioStreamingImpl, AudioBuffer, AudioStreamingOptions } from "../AudioStreaming";
import { AudioStreamingProvider, AudioStreamConfig } from "../../ProviderAbstractionLayer";

// Mock AudioStreamingProvider
class MockAudioStreamingProvider implements AudioStreamingProvider {
  private chunksSent: Uint8Array[] = [];
  private chunksReceived: Uint8Array[] = [];

  async startStream(_config: AudioStreamConfig): Promise<string> {
    return "mock_stream_id";
  }

  async sendChunk(chunk: Uint8Array): Promise<void> {
    this.chunksSent.push(chunk);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1));
  }

  async receiveChunk(): Promise<Uint8Array> {
    if (this.chunksReceived.length > 0) {
      return this.chunksReceived.shift()!;
    }
    return new Uint8Array([1, 2, 3, 4]);
  }

  async endStream(_streamId: string): Promise<void> {
    this.chunksSent = [];
    this.chunksReceived = [];
  }

  getCapabilities() {
    return {
      sampleRates: [48000],
      channels: [1],
      formats: ["pcm16"],
      realtime: true
    };
  }

  getChunksSent() {
    return this.chunksSent;
  }

  setChunksReceived(chunks: Uint8Array[]) {
    this.chunksReceived = chunks;
  }
}

describe("AudioStreaming - Integration Tests", () => {
  let audioStreaming: AudioStreamingImpl;
  let mockProvider: MockAudioStreamingProvider;

  beforeEach(() => {
    audioStreaming = new AudioStreamingImpl();
    mockProvider = new MockAudioStreamingProvider();
  });

  afterEach(async () => {
    // Cleanup all streams
    const streams = audioStreaming as any;
    if (streams.streams) {
      for (const streamId of streams.streams.keys()) {
        await audioStreaming.stopStream(streamId);
      }
    }
  });

  describe("Real-time Conversation", () => {
    test("should handle bidirectional audio streaming", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      // Send multiple chunks
      for (let i = 0; i < 10; i++) {
        const chunk = new Uint8Array([i, i + 1, i + 2, i + 3]);
        await audioStreaming.sendAudioChunk(streamId, chunk);
      }

      // Receive multiple chunks
      for (let i = 0; i < 10; i++) {
        const buffer = await audioStreaming.receiveAudioChunk(streamId);
        expect(buffer).toBeDefined();
      }

      const metrics = audioStreaming.getStreamingMetrics(streamId);
      expect(metrics.chunksSent).toBe(10);
      expect(metrics.chunksReceived).toBe(10);
    });

    test("should maintain low latency during streaming", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      const startTime = Date.now();
      
      // Send and receive chunks rapidly
      for (let i = 0; i < 50; i++) {
        const chunk = new Uint8Array([i, i + 1, i + 2, i + 3]);
        await audioStreaming.sendAudioChunk(streamId, chunk);
        await audioStreaming.receiveAudioChunk(streamId);
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should complete 50 round trips in reasonable time (< 1 second)
      expect(totalTime).toBeLessThan(1000);
    });

    test("should handle concurrent send and receive", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      // Concurrent operations
      const sendPromises: Promise<void>[] = [];
      const receivePromises: Promise<AudioBuffer | null>[] = [];

      for (let i = 0; i < 20; i++) {
        const chunk = new Uint8Array([i, i + 1, i + 2, i + 3]);
        sendPromises.push(audioStreaming.sendAudioChunk(streamId, chunk));
        receivePromises.push(audioStreaming.receiveAudioChunk(streamId));
      }

      await Promise.all(sendPromises);
      await Promise.all(receivePromises);

      const metrics = audioStreaming.getStreamingMetrics(streamId);
      expect(metrics.chunksSent).toBe(20);
      expect(metrics.chunksReceived).toBe(20);
    });
  });

  describe("Backpressure", () => {
    test("should trigger backpressure when buffer threshold reached", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const options: AudioStreamingOptions = {
        maxBufferSize: 10,
        backpressureThreshold: 5,
        enableBackpressure: true
      };

      let backpressureTriggered = false;
      audioStreaming.subscribeToEvents((event) => {
        if (event === "BackpressureTriggered") {
          backpressureTriggered = true;
        }
      });

      const streamId = await audioStreaming.startStream(mockProvider, config, options);
      
      // Send chunks to trigger backpressure
      for (let i = 0; i < 7; i++) {
        const chunk = new Uint8Array([i, i + 1, i + 2, i + 3]);
        await audioStreaming.sendAudioChunk(streamId, chunk);
      }

      expect(backpressureTriggered).toBe(true);
      
      const metrics = audioStreaming.getStreamingMetrics(streamId);
      expect(metrics.backpressureCount).toBeGreaterThan(0);
    });

    test("should reject chunks when buffer overflow", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const options: AudioStreamingOptions = {
        maxBufferSize: 5,
        backpressureThreshold: 3,
        enableBackpressure: true
      };

      let bufferOverflow = false;
      audioStreaming.subscribeToEvents((event) => {
        if (event === "BufferOverflow") {
          bufferOverflow = true;
        }
      });

      const streamId = await audioStreaming.startStream(mockProvider, config, options);
      
      // Send chunks to trigger overflow
      for (let i = 0; i < 6; i++) {
        const chunk = new Uint8Array([i, i + 1, i + 2, i + 3]);
        try {
          await audioStreaming.sendAudioChunk(streamId, chunk);
        } catch (error) {
          // Expected to fail on overflow
        }
      }

      expect(bufferOverflow).toBe(true);
    });

    test("should allow buffer to drain after backpressure", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const options: AudioStreamingOptions = {
        maxBufferSize: 10,
        backpressureThreshold: 5,
        enableBackpressure: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config, options);
      
      // Send chunks to trigger backpressure
      for (let i = 0; i < 7; i++) {
        const chunk = new Uint8Array([i, i + 1, i + 2, i + 3]);
        await audioStreaming.sendAudioChunk(streamId, chunk);
      }

      // Wait for buffer to drain
      await new Promise(resolve => setTimeout(resolve, 100));

      const metrics = audioStreaming.getStreamingMetrics(streamId);
      expect(metrics.bufferDepth).toBeLessThan(7);
    });
  });

  describe("Interruption", () => {
    test("should interrupt stream and clear buffers", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      // Send chunks
      for (let i = 0; i < 5; i++) {
        const chunk = new Uint8Array([i, i + 1, i + 2, i + 3]);
        await audioStreaming.sendAudioChunk(streamId, chunk);
      }

      await audioStreaming.interruptStream(streamId);

      const state = audioStreaming.getStreamingState(streamId);
      expect(state).toBe("Interrupted");

      const metrics = audioStreaming.getStreamingMetrics(streamId);
      expect(metrics.interruptionCount).toBe(1);
      expect(metrics.bufferDepth).toBe(0);
    });

    test("should reject chunks after interruption", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      await audioStreaming.interruptStream(streamId);

      const chunk = new Uint8Array([1, 2, 3, 4]);
      await expect(audioStreaming.sendAudioChunk(streamId, chunk)).rejects.toThrow("Stream not in streaming state");
    });

    test("should resume after interruption", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      await audioStreaming.interruptStream(streamId);
      await audioStreaming.resumeStream(streamId);

      const state = audioStreaming.getStreamingState(streamId);
      expect(state).toBe("Streaming");

      // Should be able to send chunks again
      const chunk = new Uint8Array([1, 2, 3, 4]);
      await audioStreaming.sendAudioChunk(streamId, chunk);
      
      const metrics = audioStreaming.getStreamingMetrics(streamId);
      expect(metrics.chunksSent).toBeGreaterThan(0);
    });
  });

  describe("Memory Management", () => {
    test("should track memory usage", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      const chunk = new Uint8Array(new Array(1024).fill(0));
      await audioStreaming.sendAudioChunk(streamId, chunk);

      const metrics = audioStreaming.getStreamingMetrics(streamId);
      expect(metrics.bytesSent).toBe(1024);
    });

    test("should enforce memory limit", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const options: AudioStreamingOptions = {
        memoryLimit: 1000 // Very low limit
      };

      let bufferOverflow = false;
      audioStreaming.subscribeToEvents((event) => {
        if (event === "BufferOverflow") {
          bufferOverflow = true;
        }
      });

      const streamId = await audioStreaming.startStream(mockProvider, config, options);
      
      const chunk = new Uint8Array(new Array(2000).fill(0));
      await expect(audioStreaming.sendAudioChunk(streamId, chunk)).rejects.toThrow("Memory limit exceeded");
      expect(bufferOverflow).toBe(true);
    });

    test("should clean up memory on stream stop", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      // Send chunks
      for (let i = 0; i < 5; i++) {
        const chunk = new Uint8Array(new Array(1024).fill(0));
        await audioStreaming.sendAudioChunk(streamId, chunk);
      }

      await audioStreaming.stopStream(streamId);

      // Stream should be cleaned up
      const state = audioStreaming.getStreamingState(streamId);
      expect(state).toBe("Idle");
    });

    test("should maintain memory stability over time", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      const initialMetrics = audioStreaming.getStreamingMetrics(streamId);
      
      // Send and receive many chunks
      for (let i = 0; i < 100; i++) {
        const chunk = new Uint8Array(new Array(512).fill(0));
        await audioStreaming.sendAudioChunk(streamId, chunk);
        await audioStreaming.receiveAudioChunk(streamId);
      }

      const finalMetrics = audioStreaming.getStreamingMetrics(streamId);
      
      // Buffer depth should remain stable
      expect(finalMetrics.bufferDepth).toBeLessThan(10);
      expect(finalMetrics.bufferMaxDepth).toBeLessThan(20);
    });
  });

  describe("State Management", () => {
    test("should handle pause and resume correctly", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      await audioStreaming.pauseStream(streamId);
      expect(audioStreaming.getStreamingState(streamId)).toBe("Paused");
      
      await audioStreaming.resumeStream(streamId);
      expect(audioStreaming.getStreamingState(streamId)).toBe("Streaming");
    });

    test("should handle stop correctly", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      await audioStreaming.stopStream(streamId);
      
      expect(audioStreaming.getStreamingState(streamId)).toBe("Idle");
    });

    test("should handle error state", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      // Trigger error by sending to invalid stream
      const chunk = new Uint8Array([1, 2, 3, 4]);
      await expect(audioStreaming.sendAudioChunk("invalid", chunk)).rejects.toThrow();
    });
  });

  describe("Metrics", () => {
    test("should track accurate metrics", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const streamId = await audioStreaming.startStream(mockProvider, config);
      
      // Send chunks
      for (let i = 0; i < 5; i++) {
        const chunk = new Uint8Array([i, i + 1, i + 2, i + 3]);
        await audioStreaming.sendAudioChunk(streamId, chunk);
      }

      // Receive chunks
      for (let i = 0; i < 3; i++) {
        await audioStreaming.receiveAudioChunk(streamId);
      }

      const metrics = audioStreaming.getStreamingMetrics(streamId);
      expect(metrics.chunksSent).toBe(5);
      expect(metrics.chunksReceived).toBe(3);
      expect(metrics.bytesSent).toBe(20);
      expect(metrics.bytesReceived).toBe(12);
    });

    test("should return empty metrics for invalid stream", () => {
      const metrics = audioStreaming.getStreamingMetrics("invalid");
      expect(metrics.chunksSent).toBe(0);
      expect(metrics.chunksReceived).toBe(0);
      expect(metrics.bytesSent).toBe(0);
      expect(metrics.bytesReceived).toBe(0);
    });
  });

  describe("Events", () => {
    test("should emit events correctly", async () => {
      const config: AudioStreamConfig = {
        sampleRate: 48000,
        channels: 1,
        format: "pcm16",
        realtime: true
      };

      const events: string[] = [];
      audioStreaming.subscribeToEvents((event) => {
        events.push(event);
      });

      const streamId = await audioStreaming.startStream(mockProvider, config);
      await audioStreaming.pauseStream(streamId);
      await audioStreaming.resumeStream(streamId);
      await audioStreaming.interruptStream(streamId);
      await audioStreaming.stopStream(streamId);

      expect(events).toContain("AudioStreamStarting");
      expect(events).toContain("AudioStreamPaused");
      expect(events).toContain("AudioStreamResumed");
      expect(events).toContain("AudioStreamInterrupted");
      expect(events).toContain("AudioStreamStopped");
    });
  });
});
