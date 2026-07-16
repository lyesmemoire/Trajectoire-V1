/**
 * Session Orchestrator
 *
 * Responsibilities:
 * - Orchestrate complete interview session using existing Application Orchestrator
 * - Connect Voice Interview Engine with Runtime
 * - Connect Runtime events with Application Orchestrator
 * - Ensure complete pipeline execution from CV to Final Report
 *
 * NO new business logic, NO new intelligence, NO new orchestration
 * ONLY connection of existing components
 */
// @ts-nocheck


import { ApplicationOrchestrator, PipelineEvent } from "./ApplicationOrchestrator";
import { RuntimeVoiceInterviewConnector, VoiceInterviewEvent } from "../integration/RuntimeVoiceInterviewConnector";
import { RuntimeEngine } from "../providers/runtime/RuntimeEngine";
import { AudioStreamingOrchestrator } from "../providers/runtime/AudioStreamingOrchestrator";
import { AudioPipelineOrchestrator } from "../audio/AudioPipelineOrchestrator";
import { BargeInOrchestrator } from "../audio/BargeInOrchestrator";
import { DEFAULT_AUDIO_CONFIGURATION } from "../audio/AudioConfiguration";
import { CareerCopilotDigitalTwinEngine, DigitalTwinInput } from "../intelligence/engines/careerCopilotDigitalTwinEngine";
import { candidateAIBrain } from "../ai/brain/CandidateAIBrain";

// ============================================================================
// SESSION STATE
// ============================================================================

export type SessionState =
  | "Idle"
  | "Initializing"
  | "Bootstrap"
  | "VoiceInterview"
  | "LiveAnalysis"
  | "LiveCoaching"
  | "Completion"
  | "Error";

// ============================================================================
// SESSION ORCHESTRATOR INTERFACE
// ============================================================================

export interface SessionOrchestrator {
  startSession(pipelineId: string, userId?: string): Promise<void>;
  stopSession(): Promise<void>;
  getSessionState(): SessionState;
  subscribeToSessionEvents(callback: (event: SessionEvent, metadata?: Record<string, unknown>) => void): void;
}

// ============================================================================
// SESSION EVENTS
// ============================================================================

export type SessionEvent =
  | "SessionInitializing"
  | "SessionInitialized"
  | "SessionBootstrap"
  | "SessionVoiceInterview"
  | "SessionLiveAnalysis"
  | "SessionLiveCoaching"
  | "SessionCompletion"
  | "SessionError"
  | "SessionStopped";

// ============================================================================
// SESSION orchestrator IMPLEMENTATION
// ============================================================================

export class SessionOrchestratorImpl implements SessionOrchestrator {
  private state: SessionState = "Idle";
  private pipelineId: string = "";
  private userId: string | undefined;
  private runtimeVoiceInterviewConnector: RuntimeVoiceInterviewConnector | null = null;
  private sessionEventCallbacks: Array<(event: SessionEvent, metadata?: Record<string, unknown>) => void> = [];

  constructor(
    private runtimeEngine: RuntimeEngine,
    private audioStreamingOrchestrator: AudioStreamingOrchestrator,
    private audioPipelineOrchestrator: AudioPipelineOrchestrator,
    private bargeInOrchestrator: BargeInOrchestrator,
    private runtimeVoiceInterviewConnectorFactory: () => RuntimeVoiceInterviewConnector
  ) {}

  async startSession(pipelineId: string, userId?: string): Promise<void> {
    this.state = "Initializing";
    this.pipelineId = pipelineId;
    this.userId = userId;
    this.emitEvent("SessionInitializing");

    try {
      // Start Application Orchestrator pipeline
      ApplicationOrchestrator.startPipeline(pipelineId, userId);

      // Subscribe to Application Orchestrator events
      this.subscribeToApplicationOrchestratorEvents();

      // Initialize Runtime Voice Interview Connector
      this.runtimeVoiceInterviewConnector = this.runtimeVoiceInterviewConnectorFactory();
      await this.runtimeVoiceInterviewConnector.connect(
        this.runtimeEngine,
        this.audioStreamingOrchestrator,
        this.audioPipelineOrchestrator,
        this.bargeInOrchestrator
      );

      // Subscribe to Voice Interview events
      if (this.runtimeVoiceInterviewConnector) {
        this.runtimeVoiceInterviewConnector.subscribeToVoiceInterviewEvents((event, metadata) => {
          this.handleVoiceInterviewEvent(event, metadata);
        });
      }

      this.state = "Idle";
      this.emitEvent("SessionInitialized");

    } catch (error) {
      this.state = "Error";
      this.emitEvent("SessionError", { error: error instanceof Error ? error.message : "Unknown error" });
      throw error;
    }
  }

  async stopSession(): Promise<void> {
    this.state = "Idle";
    this.emitEvent("SessionStopped");

    // Disconnect Runtime Voice Interview Connector
    if (this.runtimeVoiceInterviewConnector) {
      await this.runtimeVoiceInterviewConnector.disconnect();
      this.runtimeVoiceInterviewConnector = null;
    }

    // Reset Application Orchestrator
    ApplicationOrchestrator.resetPipeline();
  }

  getSessionState(): SessionState {
    return this.state;
  }

  subscribeToSessionEvents(callback: (event: SessionEvent, metadata?: Record<string, unknown>) => void): void {
    this.sessionEventCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private subscribeToApplicationOrchestratorEvents(): void {
    // Subscribe to key Application Orchestrator events
    ApplicationOrchestrator.subscribe("InterviewPreparationCompleted", (event) => {
      this.handleApplicationOrchestratorEvent(event);
    });

    ApplicationOrchestrator.subscribe("VoiceInterviewStarted", (event) => {
      this.handleApplicationOrchestratorEvent(event);
    });

    ApplicationOrchestrator.subscribe("VoiceInterviewCompleted", (event) => {
      this.handleApplicationOrchestratorEvent(event);
    });

    ApplicationOrchestrator.subscribe("FinalReportGenerated", (event) => {
      this.handleApplicationOrchestratorEvent(event);
    });

    ApplicationOrchestrator.subscribe("PipelineCompleted", (event) => {
      this.handleApplicationOrchestratorEvent(event);
    });

    ApplicationOrchestrator.subscribe("PipelineError", (event) => {
      this.handleApplicationOrchestratorEvent(event);
    });
  }

  private handleApplicationOrchestratorEvent(event: PipelineEvent): void {
    // Map Application Orchestrator events to Session events
    switch (event.type) {
      case "InterviewPreparationCompleted":
        this.state = "Bootstrap";
        this.emitEvent("SessionBootstrap", { stage: event.stage });
        break;
      case "VoiceInterviewStarted":
        this.state = "VoiceInterview";
        this.emitEvent("SessionVoiceInterview", { stage: event.stage });
        // Start audio pipeline
        this.startAudioPipeline();
        break;
      case "VoiceInterviewCompleted":
        this.state = "Completion";
        this.emitEvent("SessionCompletion", { stage: event.stage });
        break;
      case "FinalReportGenerated":
      case "PipelineCompleted":
        this.state = "Idle";
        this.emitEvent("SessionStopped", { stage: event.stage });
        break;
      case "PipelineError":
        this.state = "Error";
        this.emitEvent("SessionError", { stage: event.stage, data: event.data });
        break;
    }
  }

  private handleVoiceInterviewEvent(event: VoiceInterviewEvent, metadata?: Record<string, unknown>): void {
    // Map Voice Interview events to Session events
    switch (event) {
      case "SessionStarted":
        // Voice interview session started
        break;
      case "SessionEnded":
        // Voice interview session ended
        ApplicationOrchestrator.completeVoiceInterview();
        break;
      case "UserSpeechStarted":
        // User started speaking
        break;
      case "UserSpeechEnded":
        // User finished speaking
        // Trigger Live Analysis via Application Orchestrator
        this.state = "LiveAnalysis";
        this.emitEvent("SessionLiveAnalysis", metadata);
        break;
      case "AssistantSpeechStarted":
        // Assistant started speaking
        break;
      case "AssistantSpeechEnded":
        // Assistant finished speaking
        break;
      case "AudioInterrupted":
        // Audio interrupted (barge-in)
        break;
      case "ProviderConnected":
        // Provider connected
        break;
      case "ProviderDisconnected":
        // Provider disconnected
        break;
      case "ProviderError":
        // Provider error
        this.state = "Error";
        this.emitEvent("SessionError", metadata);
        break;
      case "InterviewError":
        // Interview error
        this.state = "Error";
        this.emitEvent("SessionError", metadata);
        break;
    }
  }

  private async startAudioPipeline(): Promise<void> {
    if (!this.runtimeVoiceInterviewConnector) {
      throw new Error("Runtime Voice Interview Connector not initialized");
    }

    // Start audio capture and playback
    await this.runtimeVoiceInterviewConnector.executeAction("StartCapture", DEFAULT_AUDIO_CONFIGURATION as unknown as Record<string, unknown>);
  }

  private async synchronizeDigitalTwin(): Promise<void> {
    // Get current pipeline context from Application Orchestrator
    const pipelineContext = ApplicationOrchestrator.getPipelineContext();

    // Synchronize Digital Twin with current context
    if (pipelineContext.candidateGraph) {
      const digitalTwinInput: DigitalTwinInput = {
        candidateGraph: pipelineContext.candidateGraph
      };

      try {
        const digitalTwinOutput = await CareerCopilotDigitalTwinEngine.generateDigitalTwin(digitalTwinInput);
        
        // Store digital twin output in Brain for future reference
        candidateAIBrain.addObservation({
          type: "career",
          source: "session-orchestrator",
          data: digitalTwinOutput,
          timestamp: new Date(),
          confidence: 1.0
        });
      } catch (error) {
        console.error("Failed to synchronize Digital Twin:", error);
      }
    }
  }

  private emitEvent(event: SessionEvent, metadata?: Record<string, unknown>): void {
    this.sessionEventCallbacks.forEach(callback => callback(event, metadata));
  }
}
