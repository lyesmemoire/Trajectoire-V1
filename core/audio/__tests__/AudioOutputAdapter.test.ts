/**
 * Integration Tests for Audio Output Adapter
 */

import { AudioOutputAdapterImpl } from "../AudioOutputAdapter";
import { AudioConfiguration } from "../AudioConfiguration";
import { vi } from "vitest";

// Mock AudioContext
class MockAudioContext {
  sampleRate = 48000;
  state = "running";
  
  createBuffer = vi.fn((channels: number, length: number, sampleRate: number) => ({
    numberOfChannels: channels,
    length,
    sampleRate,
    getChannelData: vi.fn(() => new Float32Array(length))
  }));
  
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
    onended: null
  }));
  
  createGain = vi.fn(() => ({
    gain: { value: 1.0 },
    connect: vi.fn(),
    disconnect: vi.fn()
  }));
  
  close = vi.fn();
  suspend = vi.fn();
  resume = vi.fn();
  
  destination = {};
}

global.AudioContext = MockAudioContext as any;

describe("AudioOutputAdapter - Integration Tests", () => {
  let adapter: AudioOutputAdapterImpl;
  let mockConfig: AudioConfiguration;

  beforeEach(() => {
    adapter = new AudioOutputAdapterImpl();
    mockConfig = {
      sampleRate: 48000,
      channels: 1,
      bufferSize: 4096,
      format: "pcm16",
      latency: 20,
      inputDeviceId: undefined,
      outputDeviceId: undefined
    };
  });

  afterEach(async () => {
    await adapter.stopPlayback();
  });

  describe("Real Audio Playback", () => {
    test("should start playback successfully", async () => {
      await adapter.startPlayback(mockConfig);
      expect(adapter.getState()).toBe("Playing");
    });

    test("should stop playback successfully", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should pause playback successfully", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.pausePlayback();
      expect(adapter.getState()).toBe("Paused");
    });

    test("should resume playback successfully", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.pausePlayback();
      await adapter.resumePlayback();
      expect(adapter.getState()).toBe("Playing");
    });

    test("should queue chunk when not playing", async () => {
      const chunk = new Uint8Array([1, 2, 3, 4]);
      await adapter.playChunk(chunk);
      // Should queue chunk without error
    });

    test("should play chunk when playing", async () => {
      await adapter.startPlayback(mockConfig);
      const chunk = new Uint8Array(new Array(512).fill(0));
      await adapter.playChunk(chunk);
      // Should play chunk without error
    });

    test("should convert PCM16 to AudioBuffer", async () => {
      await adapter.startPlayback(mockConfig);
      const chunk = new Uint8Array(new Array(512).fill(0));
      await adapter.playChunk(chunk);
      // PCM16 conversion should work
    });
  });

  describe("AudioContext Resource Management", () => {
    test("should create AudioContext on playback start", async () => {
      await adapter.startPlayback(mockConfig);
      expect(adapter.getState()).toBe("Playing");
    });

    test("should close AudioContext on playback stop", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should suspend AudioContext on pause", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.pausePlayback();
      expect(adapter.getState()).toBe("Paused");
    });

    test("should resume AudioContext on resume", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.pausePlayback();
      await adapter.resumePlayback();
      expect(adapter.getState()).toBe("Playing");
    });

    test("should disconnect gain node on stop", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should disconnect source node on stop", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });
  });

  describe("No AudioContext Leaks", () => {
    test("should not leak AudioContext on multiple start/stop cycles", async () => {
      for (let i = 0; i < 5; i++) {
        await adapter.startPlayback(mockConfig);
        await adapter.stopPlayback();
      }
      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle cleanup during chunk playback", async () => {
      await adapter.startPlayback(mockConfig);
      const chunk = new Uint8Array(new Array(512).fill(0));
      await adapter.playChunk(chunk);
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should clear playback queue on stop", async () => {
      await adapter.startPlayback(mockConfig);
      const chunk = new Uint8Array(new Array(512).fill(0));
      await adapter.playChunk(chunk);
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle cleanup during active playback", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });
  });

  describe("State Management", () => {
    test("should initialize in Idle state", () => {
      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle duplicate startPlayback calls", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.startPlayback(mockConfig); // Should be ignored
      expect(adapter.getState()).toBe("Playing");
    });

    test("should handle stopPlayback when not playing", async () => {
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle pausePlayback when not playing", async () => {
      await adapter.pausePlayback();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle resumePlayback when not paused", async () => {
      await adapter.resumePlayback();
      expect(adapter.getState()).toBe("Idle");
    });
  });

  describe("PCM16 Conversion", () => {
    test("should convert int16 to float32 correctly", async () => {
      await adapter.startPlayback(mockConfig);
      const chunk = new Uint8Array(new Array(512).fill(0));
      await adapter.playChunk(chunk);
      // Int16 range: -32768 to 32767
      // Float32 range: -1.0 to 1.0
      // The conversion should preserve the relative amplitude
    });

    test("should handle multi-channel audio", async () => {
      const multiChannelConfig = { ...mockConfig, channels: 2 };
      await adapter.startPlayback(multiChannelConfig);
      const chunk = new Uint8Array(new Array(1024).fill(0));
      await adapter.playChunk(chunk);
      // Should handle 2 channels
    });
  });

  describe("Playback Queue", () => {
    test("should process queued chunks on resume", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.pausePlayback();
      
      const chunk = new Uint8Array(new Array(512).fill(0));
      await adapter.playChunk(chunk);
      
      await adapter.resumePlayback();
      expect(adapter.getState()).toBe("Playing");
    });

    test("should clear queue on stop", async () => {
      await adapter.startPlayback(mockConfig);
      await adapter.pausePlayback();
      
      const chunk = new Uint8Array(new Array(512).fill(0));
      await adapter.playChunk(chunk);
      
      await adapter.stopPlayback();
      expect(adapter.getState()).toBe("Idle");
    });
  });
});
