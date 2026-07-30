/**
 * Blueprint DSL CPR Replay Manager
 * 
 * Manages execution replay for debugging and analysis.
 */

import { ClusterManager } from './cluster-manager';
import { RuntimeManager } from './runtime-manager';

export interface ReplayEvent {
  id: string;
  timestamp: number;
  type: ReplayEventType;
  nodeId: string;
  instanceId?: string;
  data: Record<string, unknown>;
}

export enum ReplayEventType {
  INSTANCE_START = 'INSTANCE_START',
  INSTANCE_END = 'INSTANCE_END',
  INSTRUCTION_EXECUTE = 'INSTRUCTION_EXECUTE',
  MEMORY_READ = 'MEMORY_READ',
  MEMORY_WRITE = 'MEMORY_WRITE',
  EXCEPTION = 'EXCEPTION',
  STATE_CHANGE = 'STATE_CHANGE',
}

export interface ReplaySession {
  id: string;
  startTime: number;
  endTime?: number;
  events: ReplayEvent[];
  metadata: Record<string, unknown>;
}

export class ReplayManager {
  private clusterManager: ClusterManager;
  private runtimeManager: RuntimeManager;
  private sessions: Map<string, ReplaySession> = new Map();
  private sessionCounter: number = 0;
  private currentSession: string | null = null;
  private recording: boolean = false;

  constructor(clusterManager: ClusterManager, runtimeManager: RuntimeManager) {
    this.clusterManager = clusterManager;
    this.runtimeManager = runtimeManager;
  }

  /**
   * Start recording replay session
   */
  public startRecording(metadata: Record<string, unknown> = {}): ReplaySession {
    const session: ReplaySession = {
      id: `session_${this.sessionCounter++}`,
      startTime: Date.now(),
      events: [],
      metadata,
    };

    this.sessions.set(session.id, session);
    this.currentSession = session.id;
    this.recording = true;

    return session;
  }

  /**
   * Stop recording replay session
   */
  public stopRecording(): ReplaySession | null {
    if (!this.currentSession) {
      return null;
    }

    const session = this.sessions.get(this.currentSession);

    if (session) {
      session.endTime = Date.now();
    }

    this.recording = false;
    const sessionId = this.currentSession;
    this.currentSession = null;

    return session ? { ...session, events: [...session.events] } : null;
  }

  /**
   * Record event
   */
  public recordEvent(type: ReplayEventType, nodeId: string, data: Record<string, unknown>, instanceId?: string): void {
    if (!this.recording || !this.currentSession) {
      return;
    }

    const session = this.sessions.get(this.currentSession);

    if (session) {
      const event: ReplayEvent = {
        id: `event_${session.events.length}`,
        timestamp: Date.now(),
        type,
        nodeId,
        instanceId,
        data,
      };

      session.events.push(event);
    }
  }

  /**
   * Get session by id
   */
  public getSession(id: string): ReplaySession | null {
    const session = this.sessions.get(id);
    return session ? { ...session, events: [...session.events] } : null;
  }

  /**
   * Get all sessions
   */
  public getAllSessions(): ReplaySession[] {
    return Array.from(this.sessions.values()).map(s => ({ ...s, events: [...s.events] }));
  }

  /**
   * Get sessions in time range
   */
  public getSessionsInRange(start: number, end: number): ReplaySession[] {
    return Array.from(this.sessions.values())
      .filter(s => s.startTime >= start && s.startTime <= end)
      .map(s => ({ ...s, events: [...s.events] }));
  }

  /**
   * Replay session
   */
  public replay(sessionId: string, speed: number = 1.0): void {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    for (const event of session.events) {
      this.processEvent(event);

      if (speed < 1.0) {
        const delay = (1 / speed) * 10;
        // In a real implementation, this would use async/await
      }
    }
  }

  /**
   * Process replay event
   */
  private processEvent(event: ReplayEvent): void {
    switch (event.type) {
      case ReplayEventType.INSTANCE_START:
        console.log(`Replay: Instance ${event.instanceId} started on node ${event.nodeId}`);
        break;

      case ReplayEventType.INSTANCE_END:
        console.log(`Replay: Instance ${event.instanceId} ended on node ${event.nodeId}`);
        break;

      case ReplayEventType.INSTRUCTION_EXECUTE:
        console.log(`Replay: Instruction executed on node ${event.nodeId}`);
        break;

      case ReplayEventType.MEMORY_READ:
        console.log(`Replay: Memory read on node ${event.nodeId}`);
        break;

      case ReplayEventType.MEMORY_WRITE:
        console.log(`Replay: Memory write on node ${event.nodeId}`);
        break;

      case ReplayEventType.EXCEPTION:
        console.log(`Replay: Exception on node ${event.nodeId}: ${event.data.message}`);
        break;

      case ReplayEventType.STATE_CHANGE:
        console.log(`Replay: State change on node ${event.nodeId}`);
        break;
    }
  }

  /**
   * Get events by type
   */
  public getEventsByType(sessionId: string, type: ReplayEventType): ReplayEvent[] {
    const session = this.sessions.get(sessionId);
    return session ? session.events.filter(e => e.type === type) : [];
  }

  /**
   * Get events by node
   */
  public getEventsByNode(sessionId: string, nodeId: string): ReplayEvent[] {
    const session = this.sessions.get(sessionId);
    return session ? session.events.filter(e => e.nodeId === nodeId) : [];
  }

  /**
   * Get events by instance
   */
  public getEventsByInstance(sessionId: string, instanceId: string): ReplayEvent[] {
    const session = this.sessions.get(sessionId);
    return session ? session.events.filter(e => e.instanceId === instanceId) : [];
  }

  /**
   * Delete session
   */
  public deleteSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  /**
   * Clear all sessions
   */
  public clear(): void {
    this.sessions.clear();
    this.sessionCounter = 0;
    this.currentSession = null;
    this.recording = false;
  }

  /**
   * Check if recording
   */
  public isRecording(): boolean {
    return this.recording;
  }

  /**
   * Get current session
   */
  public getCurrentSession(): ReplaySession | null {
    if (!this.currentSession) {
      return null;
    }

    return this.getSession(this.currentSession);
  }

  /**
   * Validate replay manager state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, session] of this.sessions) {
      if (session.id !== id) {
        errors.push(`Session ID mismatch at ${id}`);
      }

      if (session.startTime < 0) {
        errors.push(`Invalid start time in session ${id}`);
      }

      if (session.endTime !== undefined && session.endTime < session.startTime) {
        errors.push(`Invalid end time in session ${id}`);
      }

      for (const event of session.events) {
        if (event.timestamp < 0) {
          errors.push(`Invalid timestamp in event ${event.id}`);
        }

        if (!this.clusterManager.getNode(event.nodeId)) {
          errors.push(`Event ${event.id} references non-existent node ${event.nodeId}`);
        }

        if (event.instanceId && !this.runtimeManager.getInstance(event.instanceId)) {
          errors.push(`Event ${event.id} references non-existent instance ${event.instanceId}`);
        }
      }
    }

    if (this.currentSession && !this.sessions.has(this.currentSession)) {
      errors.push('Current session does not exist');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    sessionCount: number;
    totalEvents: number;
    averageEventsPerSession: number;
    recording: boolean;
    currentSession: string | null;
  } {
    const totalEvents = Array.from(this.sessions.values()).reduce((sum, s) => sum + s.events.length, 0);
    const averageEventsPerSession = this.sessions.size > 0 ? totalEvents / this.sessions.size : 0;

    return {
      sessionCount: this.sessions.size,
      totalEvents,
      averageEventsPerSession,
      recording: this.recording,
      currentSession: this.currentSession,
    };
  }

  /**
   * Export sessions to JSON
   */
  public export(): string {
    const data = Array.from(this.sessions.values());
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import sessions from JSON
   */
  public import(json: string): void {
    const data = JSON.parse(json) as ReplaySession[];

    for (const session of data) {
      this.sessions.set(session.id, {
        ...session,
        events: [...session.events],
      });
      this.sessionCounter = Math.max(this.sessionCounter, parseInt(session.id.split('_')[1]) + 1);
    }
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }

  /**
   * Set runtime manager
   */
  public setRuntimeManager(runtimeManager: RuntimeManager): void {
    this.runtimeManager = runtimeManager;
  }
}
