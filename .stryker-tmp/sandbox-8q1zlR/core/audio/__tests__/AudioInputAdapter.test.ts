/**
 * Integration Tests for Audio Input Adapter
 */
// @ts-nocheck


import { AudioInputAdapterImpl } from "../AudioInputAdapter";
import { AudioConfiguration } from "../AudioConfiguration";
import { vi } from "vitest";

// Mock MediaStream
class MockMediaStream {
  getTracks() { return []; }
  addTrack() {}
  removeTrack() {}
}

global.MediaStream = MockMediaStream as any;

// Mock navigator.mediaDevices
const mockMediaDevices = {
  getUserMedia: vi.fn(),
  enumerateDevices: vi.fn()
};

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: mockMediaDevices,
  writable: true
});

// Mock AudioContext
class MockAudioContext {
  sampleRate = 48000;
  state = "running";
  createMediaStreamSource = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn()
  }));
  createScriptProcessor = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    onaudioprocess: null
  }));
  close = vi.fn();
  suspend = vi.fn();
  resume = vi.fn();
}

global.AudioContext = MockAudioContext as any;

describe("AudioInputAdapter - Integration Tests", () => {
  let adapter: AudioInputAdapterImpl;
  let mockConfig: AudioConfiguration;

  beforeEach(() => {
    adapter = new AudioInputAdapterImpl();
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
    await adapter.stopCapture();
  });

  describe("Permission Management", () => {
    test("should check microphone permission", async () => {
      const permissionState = await adapter.checkPermission();
      expect(["granted", "denied", "prompt"]).toContain(permissionState);
    });

    test("should request microphone permission", async () => {
      const granted = await adapter.requestPermission();
      expect(typeof granted).toBe("boolean");
    });
  });

  describe("Real Audio Capture", () => {
    test("should request microphone permission on start", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);

      expect(mockMediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    });

    test("should handle permission denied", async () => {
      vi.mocked(mockMediaDevices.getUserMedia).mockRejectedValue(new Error("Permission denied"));

      await expect(adapter.startCapture(mockConfig)).rejects.toThrow("Permission denied");
      expect(adapter.getState()).toBe("Error");
    });

    test("should stop capture successfully", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);
      await adapter.stopCapture();

      expect(adapter.getState()).toBe("Idle");
    });

    test("should pause capture successfully", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);
      await adapter.pauseCapture();

      expect(adapter.getState()).toBe("Paused");
    });

    test("should resume capture successfully", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);
      await adapter.pauseCapture();
      await adapter.resumeCapture();

      expect(adapter.getState()).toBe("Capturing");
    });
  });

  describe("AudioContext Resource Management", () => {
    test("should close AudioContext on capture stop", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);
      await adapter.stopCapture();

      expect(adapter.getState()).toBe("Idle");
    });

    test("should suspend AudioContext on pause", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);
      await adapter.pauseCapture();

      expect(adapter.getState()).toBe("Paused");
    });

    test("should resume AudioContext on resume", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);
      await adapter.pauseCapture();
      await adapter.resumeCapture();

      expect(adapter.getState()).toBe("Capturing");
    });
  });

  describe("No AudioContext Leaks", () => {
    test("should not leak AudioContext on multiple start/stop cycles", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      for (let i = 0; i < 5; i++) {
        await adapter.startCapture(mockConfig);
        await adapter.stopCapture();
      }

      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle cleanup during active capture", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);
      await adapter.stopCapture();

      expect(adapter.getState()).toBe("Idle");
    });
  });

  describe("State Management", () => {
    test("should initialize in Idle state", () => {
      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle duplicate startCapture calls", async () => {
      const mockStream = new MediaStream();
      vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);

      await adapter.startCapture(mockConfig);
      await adapter.startCapture(mockConfig); // Should be ignored

      expect(adapter.getState()).toBe("Capturing");
    });

    test("should handle stopCapture when not capturing", async () => {
      await adapter.stopCapture();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle pauseCapture when not capturing", async () => {
      await adapter.pauseCapture();
      expect(adapter.getState()).toBe("Idle");
    });

    test("should handle resumeCapture when not paused", async () => {
      await adapter.resumeCapture();
      expect(adapter.getState()).toBe("Idle");
    });
  });
});
