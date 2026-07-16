/**
 * Diagnostic Replay
 *
 * Replays diagnostic snapshots for technical debugging.
 * Pure replay functionality, no business logic.
 */
// @ts-nocheck


import { DiagnosticSnapshot, DiagnosticEvent } from "./types";
import { DiagnosticExporter } from "./DiagnosticExporter";
import { DiagnosticTimelineBuilder, TimelineNode } from "./DiagnosticTimelineBuilder";

export interface ReplayState {
  snapshot: DiagnosticSnapshot;
  currentIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  currentTime: Date;
}

export interface ReplayEvent {
  timestamp: Date;
  event: DiagnosticEvent;
  timelineNode: TimelineNode;
}

export class DiagnosticReplay {
  private state: ReplayState | null = null;
  private playbackInterval: NodeJS.Timeout | null = null;
  private eventCallbacks: Array<(event: ReplayEvent) => void> = [];
  private stateCallbacks: Array<(state: ReplayState) => void> = [];
  private wasPlaying: boolean = false;

  /**
   * Load snapshot for replay
   */
  loadSnapshot(snapshot: DiagnosticSnapshot): void {
    this.stopPlayback();

    this.state = {
      snapshot,
      currentIndex: 0,
      isPlaying: false,
      playbackSpeed: 1.0,
      currentTime: snapshot.timestamp,
    };

    this.notifyStateChange();
  }

  /**
   * Load snapshot from JSON
   */
  loadSnapshotFromJSON(json: string): void {
    const snapshot = DiagnosticExporter.parseFromJSON(json);
    this.loadSnapshot(snapshot);
  }

  /**
   * Start playback
   */
  startPlayback(): void {
    if (!this.state) {
      throw new Error("No snapshot loaded");
    }

    if (this.state.isPlaying) {
      return;
    }

    this.state.isPlaying = true;
    this.notifyStateChange();

    this.playNextEvent();
  }

  /**
   * Stop playback
   */
  stopPlayback(): void {
    if (this.playbackInterval) {
      clearTimeout(this.playbackInterval);
      this.playbackInterval = null;
    }

    if (this.state) {
      this.state.isPlaying = false;
      this.notifyStateChange();
    }
  }

  /**
   * Pause playback
   */
  pausePlayback(): void {
    this.stopPlayback();
  }

  /**
   * Resume playback
   */
  resumePlayback(): void {
    this.startPlayback();
  }

  /**
   * Play next event
   */
  private playNextEvent(): void {
    if (!this.state || !this.state.isPlaying) {
      return;
    }

    const events = this.state.snapshot.events;
    if (this.state.currentIndex >= events.length) {
      this.stopPlayback();
      return;
    }

    const event = events[this.state.currentIndex];
    const timelineNode = this.buildTimelineNode(event);

    this.state.currentTime = event.timestamp;
    this.notifyEvent({ timestamp: event.timestamp, event, timelineNode });

    this.state.currentIndex++;
    this.notifyStateChange();

    // Schedule next event
    if (this.state.currentIndex < events.length) {
      const nextEvent = events[this.state.currentIndex];
      const delay = (nextEvent.timestamp.getTime() - event.timestamp.getTime()) / this.state.playbackSpeed;

      this.playbackInterval = setTimeout(() => {
        this.playNextEvent();
      }, Math.max(delay, 10)); // Minimum 10ms delay
    } else {
      this.stopPlayback();
    }
  }

  /**
   * Jump to specific time
   */
  jumpToTime(targetTime: Date): void {
    if (!this.wasPlaying) {
      this.wasPlaying = this.state?.isPlaying ?? false;
    }
    this.stopPlayback();

    if (!this.state) {
      return;
    }

    const events = this.state.snapshot.events;
    const targetIndex = events.findIndex(e => e.timestamp >= targetTime);

    if (targetIndex >= 0) {
      this.state.currentIndex = targetIndex;
      this.state.currentTime = targetTime;
      this.notifyStateChange();
    }

    if (this.wasPlaying) {
      this.startPlayback();
    }
  }

  /**
   * Jump to specific event index
   */
  jumpToEvent(index: number): void {
    if (!this.state) {
      return;
    }

    const events = this.state.snapshot.events;
    if (index < 0 || index >= events.length) {
      return;
    }

    const wasPlaying = this.state.isPlaying;
    this.stopPlayback();

    this.state.currentIndex = index;
    this.state.currentTime = events[index].timestamp;
    this.notifyStateChange();

    if (wasPlaying) {
      this.startPlayback();
    }
  }

  /**
   * Set playback speed
   */
  setPlaybackSpeed(speed: number): void {
    if (!this.state) {
      return;
    }

    this.state.playbackSpeed = Math.max(0.1, Math.min(speed, 10.0));
    this.notifyStateChange();
  }

  /**
   * Get current replay state
   */
  getState(): ReplayState | null {
    return this.state ? { ...this.state } : null;
  }

  /**
   * Get current event
   */
  getCurrentEvent(): DiagnosticEvent | null {
    if (!this.state || this.state.currentIndex === 0) {
      return null;
    }

    return this.state.snapshot.events[this.state.currentIndex - 1];
  }

  /**
   * Get next event
   */
  getNextEvent(): DiagnosticEvent | null {
    if (!this.state || this.state.currentIndex >= this.state.snapshot.events.length) {
      return null;
    }

    return this.state.snapshot.events[this.state.currentIndex];
  }

  /**
   * Get progress (0-1)
   */
  getProgress(): number {
    if (!this.state) {
      return 0;
    }

    return this.state.currentIndex / this.state.snapshot.events.length;
  }

  /**
   * Get timeline for current snapshot
   */
  getTimeline(): TimelineNode[] {
    if (!this.state) {
      return [];
    }

    return DiagnosticTimelineBuilder.buildTimelineFromEvents(this.state.snapshot.events);
  }

  /**
   * Get formatted timeline for current snapshot
   */
  getFormattedTimeline(): string {
    if (!this.state) {
      return "";
    }

    return DiagnosticTimelineBuilder.formatTimeline(this.getTimeline());
  }

  /**
   * Get health at current point in replay
   */
  getCurrentHealth(): null {
    // Health reconstruction from snapshot would require additional implementation
    return null;
  }

  /**
   * Subscribe to replay events
   */
  onEvent(callback: (event: ReplayEvent) => void): void {
    this.eventCallbacks.push(callback);
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: (state: ReplayState) => void): void {
    this.stateCallbacks.push(callback);
  }

  /**
   * Unsubscribe from events
   */
  unsubscribeEvent(callback: (event: ReplayEvent) => void): void {
    const index = this.eventCallbacks.indexOf(callback);
    if (index >= 0) {
      this.eventCallbacks.splice(index, 1);
    }
  }

  /**
   * Unsubscribe from state changes
   */
  unsubscribeStateChange(callback: (state: ReplayState) => void): void {
    const index = this.stateCallbacks.indexOf(callback);
    if (index >= 0) {
      this.stateCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify event subscribers
   */
  private notifyEvent(event: ReplayEvent): void {
    for (const callback of this.eventCallbacks) {
      callback(event);
    }
  }

  /**
   * Notify state change subscribers
   */
  private notifyStateChange(): void {
    if (!this.state) {
      return;
    }

    for (const callback of this.stateCallbacks) {
      callback({ ...this.state });
    }
  }

  /**
   * Build timeline node from event
   */
  private buildTimelineNode(event: DiagnosticEvent): TimelineNode {
    return {
      timestamp: event.timestamp,
      component: event.source,
      eventType: event.eventType,
      description: this.describeEvent(event),
      metadata: event.data,
    };
  }

  /**
   * Describe event for replay
   */
  private describeEvent(event: DiagnosticEvent): string {
    const { source, eventType, data } = event;

    switch (source) {
      case "runtime":
        return this.describeRuntimeEvent(eventType, data);
      case "provider":
        return this.describeProviderEvent(eventType, data);
      case "audio":
        return this.describeAudioEvent(eventType, data);
      case "streaming":
        return this.describeStreamingEvent(eventType, data);
      default:
        return `${source}: ${eventType}`;
    }
  }

  private describeRuntimeEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "state_change":
        return `Runtime: ${data.from} → ${data.to}`;
      case "microphone_input":
        return "Microphone input received";
      case "latency_sample":
        return `Latency: ${data.latency}ms`;
      default:
        return `Runtime: ${eventType}`;
    }
  }

  private describeProviderEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "connection_state_change":
        return `Provider: ${data.from} → ${data.to}`;
      case "first_token":
        return `First token (${data.providerToFirstToken}ms)`;
      default:
        return `Provider: ${eventType}`;
    }
  }

  private describeAudioEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "vad_state_change":
        return `VAD: ${data.from} → ${data.to}`;
      case "barge_in_state_change":
        return `Barge-In: ${data.from} → ${data.to}`;
      case "first_audio":
        return `First audio (${data.totalResponseTime}ms)`;
      default:
        return `Audio: ${eventType}`;
    }
  }

  private describeStreamingEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "chunk_sent":
        return `Chunk sent (${data.size} bytes)`;
      case "chunk_received":
        return `Chunk received (${data.size} bytes)`;
      case "streaming_interrupted":
        return "Streaming interrupted";
      case "streaming_resumed":
        return "Streaming resumed";
      default:
        return `Streaming: ${eventType}`;
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stopPlayback();
    this.eventCallbacks = [];
    this.stateCallbacks = [];
    this.state = null;
  }
}
