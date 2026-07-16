/**
 * Composition Root Validation Test
 * 
 * Validates that:
 * - All components are registered in the Composition Root
 * - All components can be instantiated without errors
 * - No circular dependencies exist
 * - No duplicate instances are created
 * - Singleton pattern works correctly
 */

import { coreContainer, CoreContainer } from "../container";

describe("Composition Root Validation", () => {
  beforeEach(() => {
    // Ensure container is initialized before each test
    CoreContainer.getInstance();
  });

  test("should instantiate all components without errors", () => {
    // Get all components from container
    const runtimeEngine = coreContainer.getRuntimeEngine();
    const eventSynchronizer = coreContainer.getEventSynchronizer();
    const runtimeEventEmitter = coreContainer.getRuntimeEventEmitter();
    const webSocketTransport = coreContainer.getWebSocketTransport();
    const authManager = coreContainer.getAuthManager();
    const sessionManager = coreContainer.getSessionManager();
    const eventMapper = coreContainer.getEventMapper();
    const errorHandler = coreContainer.getErrorHandler();
    const audioInputAdapter = coreContainer.getAudioInputAdapter();
    const audioOutputAdapter = coreContainer.getAudioOutputAdapter();
    const audioDeviceManager = coreContainer.getAudioDeviceManager();
    const audioPipelineOrchestrator = coreContainer.getAudioPipelineOrchestrator();
    const voiceActivityDetector = coreContainer.getVoiceActivityDetector();
    const bargeInManager = coreContainer.getBargeInManager();
    const audioInterruptionController = coreContainer.getAudioInterruptionController();
    const bargeInOrchestrator = coreContainer.getBargeInOrchestrator();
    const runtimeVoiceInterviewConnector = coreContainer.getRuntimeVoiceInterviewConnector();
    const sessionOrchestrator = coreContainer.getSessionOrchestrator();

    // Verify all components are instantiated
    expect(runtimeEngine).toBeDefined();
    expect(eventSynchronizer).toBeDefined();
    expect(runtimeEventEmitter).toBeDefined();
    expect(webSocketTransport).toBeDefined();
    expect(authManager).toBeDefined();
    expect(sessionManager).toBeDefined();
    expect(eventMapper).toBeDefined();
    expect(errorHandler).toBeDefined();
    expect(audioInputAdapter).toBeDefined();
    expect(audioOutputAdapter).toBeDefined();
    expect(audioDeviceManager).toBeDefined();
    expect(audioPipelineOrchestrator).toBeDefined();
    expect(voiceActivityDetector).toBeDefined();
    expect(bargeInManager).toBeDefined();
    expect(audioInterruptionController).toBeDefined();
    expect(bargeInOrchestrator).toBeDefined();
    expect(runtimeVoiceInterviewConnector).toBeDefined();
    expect(sessionOrchestrator).toBeDefined();
  });

  test("should return same instance for singleton components", () => {
    // Get components twice
    const instance1 = coreContainer.getRuntimeEngine();
    const instance2 = coreContainer.getRuntimeEngine();

    // Verify they are the same instance
    expect(instance1).toBe(instance2);
  });

  test("should cleanup all components on destroy", () => {
    // Destroy container
    coreContainer.destroy();

    // Verify container is reset
    expect(() => coreContainer.getRuntimeEngine()).toThrow("RuntimeEngine not initialized");
    expect(() => coreContainer.getSessionOrchestrator()).toThrow("SessionOrchestrator not initialized");

    // Reinitialize for other tests
    CoreContainer.getInstance();
  });

  test("should have no circular dependencies", () => {
    // This test validates that the container can be instantiated without circular dependency errors
    // If there were circular dependencies, the constructor would throw an error
    expect(() => CoreContainer.getInstance()).not.toThrow();
  });
});
