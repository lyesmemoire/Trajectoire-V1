/**
 * Integration Test for Complete Audio Pipeline
 * 
 * Tests the full pipeline:
 * Microphone → Audio Input Adapter → Audio Streaming → Runtime → Provider → Runtime → Audio Output Adapter → Speakers
 * 
 * Also verifies that user interruption stops playback immediately
 */
// @ts-nocheck


import { AudioInputAdapterImpl } from "../AudioInputAdapter";
import { AudioOutputAdapterImpl } from "../AudioOutputAdapter";
import { AudioPipelineOrchestratorImpl } from "../AudioPipelineOrchestrator";
import { AudioConfiguration } from "../AudioConfiguration";
import { BargeInOrchestratorImpl } from "../BargeInOrchestrator";
import { VADAndBargeInConfiguration, DEFAULT_VAD_AND_BARGE_IN_CONFIGURATION } from "../VADConfiguration";
import { vi } from "vitest";

// Mock MediaStream
class MockMediaStream {
  getTracks() { return []; }
  addTrack() {}
  removeTrack() {}
}

global.MediaStream = MockMediaStream as any;

// Mock AudioStreamingOrchestrator
class MockAudioStreamingOrchestrator {
  async startAudioStreaming() { return "mock_stream_id"; }
  async stopAudioStreaming() {}
  async sendAudio() {}
  async receiveAudio() { return new Uint8Array([1, 2, 3, 4]); }
  async pauseAudioStreaming() {}
  async resumeAudioStreaming() {}
  getStreamingState() { return "Streaming"; }
  getStreamingMetrics() { return { chunksSent: 0, chunksReceived: 0 }; }
  getLifecycleState() { return "Active"; }
}

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
  createMediaStreamSource = vi.fn(() => ({
    connect: vi.fn()
  }));
  createScriptProcessor = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    onaudioprocess: null
  }));
  createBuffer = vi.fn(() => ({
    getChannelData: vi.fn(() => new Float32Array(512))
  }));
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn()
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

describe("Audio Pipeline Integration", () => {
  let audioInputAdapter: AudioInputAdapterImpl;
  let audioOutputAdapter: AudioOutputAdapterImpl;
  let audioPipelineOrchestrator: AudioPipelineOrchestratorImpl;
  let bargeInOrchestrator: BargeInOrchestratorImpl;
  let mockAudioStreamingOrchestrator: MockAudioStreamingOrchestrator;
  let mockConfig: AudioConfiguration;
  let mockVADConfig: VADAndBargeInConfiguration;

  beforeEach(() => {
    audioInputAdapter = new AudioInputAdapterImpl();
    audioOutputAdapter = new AudioOutputAdapterImpl();
    audioPipelineOrchestrator = new AudioPipelineOrchestratorImpl(audioInputAdapter, audioOutputAdapter);
    bargeInOrchestrator = new BargeInOrchestratorImpl(DEFAULT_VAD_AND_BARGE_IN_CONFIGURATION);
    mockAudioStreamingOrchestrator = new MockAudioStreamingOrchestrator();
    
    mockConfig = {
      sampleRate: 48000,
      channels: 1,
      bufferSize: 4096,
      format: "pcm16",
      latency: 20
    };
    
    mockVADConfig = DEFAULT_VAD_AND_BARGE_IN_CONFIGURATION;

    // Setup mock media stream
    const mockStream = new MediaStream();
    vi.mocked(mockMediaDevices.getUserMedia).mockResolvedValue(mockStream);
  });

  test("should start complete audio pipeline successfully", async () => {
    await audioPipelineOrchestrator.startPipeline(mockConfig, mockAudioStreamingOrchestrator as any);
    expect(audioPipelineOrchestrator.getPipelineState()).toBe("Running");
  });

  test("should stop complete audio pipeline successfully", async () => {
    await audioPipelineOrchestrator.startPipeline(mockConfig, mockAudioStreamingOrchestrator as any);
    await audioPipelineOrchestrator.stopPipeline();
    expect(audioPipelineOrchestrator.getPipelineState()).toBe("Idle");
  });

  test("should pause and resume audio pipeline successfully", async () => {
    await audioPipelineOrchestrator.startPipeline(mockConfig, mockAudioStreamingOrchestrator as any);
    await audioPipelineOrchestrator.pausePipeline();
    expect(audioPipelineOrchestrator.getPipelineState()).toBe("Paused");
    
    await audioPipelineOrchestrator.resumePipeline();
    expect(audioPipelineOrchestrator.getPipelineState()).toBe("Running");
  });

  test("should integrate barge-in orchestrator with audio pipeline", async () => {
    await audioPipelineOrchestrator.startPipeline(mockConfig, mockAudioStreamingOrchestrator as any);
    await bargeInOrchestrator.startOrchestration(
      audioInputAdapter,
      audioOutputAdapter,
      mockAudioStreamingOrchestrator as any
    );
    expect(bargeInOrchestrator.getOrchestratorState()).toBe("Monitoring");
  });

  test("should handle user interruption during playback", async () => {
    await audioPipelineOrchestrator.startPipeline(mockConfig, mockAudioStreamingOrchestrator as any);
    await bargeInOrchestrator.startOrchestration(
      audioInputAdapter,
      audioOutputAdapter,
      mockAudioStreamingOrchestrator as any
    );

    // Simulate speech detection by providing audio chunk
    const speechChunk = new Uint8Array(new Float32Array(512).fill(0.03).buffer);
    vi.spyOn(audioInputAdapter, 'getCapturedChunk').mockReturnValue(speechChunk);

    // Wait for VAD processing
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify interruption was triggered
    expect(bargeInOrchestrator.getOrchestratorState()).toBe("Interrupting");
  });

  test("should cleanup all resources on pipeline stop", async () => {
    await audioPipelineOrchestrator.startPipeline(mockConfig, mockAudioStreamingOrchestrator as any);
    await bargeInOrchestrator.startOrchestration(
      audioInputAdapter,
      audioOutputAdapter,
      mockAudioStreamingOrchestrator as any
    );

    await audioPipelineOrchestrator.stopPipeline();
    await bargeInOrchestrator.stopOrchestration();

    expect(audioPipelineOrchestrator.getPipelineState()).toBe("Idle");
    expect(bargeInOrchestrator.getOrchestratorState()).toBe("Idle");
  });

  test("should handle multiple successive interruptions", async () => {
    await audioPipelineOrchestrator.startPipeline(mockConfig, mockAudioStreamingOrchestrator as any);
    await bargeInOrchestrator.startOrchestration(
      audioInputAdapter,
      audioOutputAdapter,
      mockAudioStreamingOrchestrator as any
    );

    // Simulate multiple speech detections
    const speechChunk = new Uint8Array(new Float32Array(512).fill(0.03).buffer);
    vi.spyOn(audioInputAdapter, 'getCapturedChunk').mockReturnValue(speechChunk);

    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      // Resume after interruption
      await bargeInOrchestrator.stopOrchestration();
      await bargeInOrchestrator.startOrchestration(
        audioInputAdapter,
        audioOutputAdapter,
        mockAudioStreamingOrchestrator as any
      );
    }

    // Verify pipeline still functional
    expect(audioPipelineOrchestrator.getPipelineState()).toBe("Running");
  });
});
