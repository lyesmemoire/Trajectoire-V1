/**
 * Blueprint DSL CPR Distributed Debugger
 * 
 * Provides distributed debugging capabilities across the cluster.
 */

import { ClusterManager } from './cluster-manager';
import { RuntimeManager } from './runtime-manager';

export interface DebugSession {
  id: string;
  nodeId: string;
  instanceId: string;
  status: DebugSessionStatus;
  breakpoints: Map<number, DebugBreakpoint>;
  currentLocation: number;
  startTime: number;
  endTime?: number;
}

export enum DebugSessionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface DebugBreakpoint {
  address: number;
  enabled: boolean;
  hitCount: number;
  condition?: string;
}

export interface DebugCommand {
  type: DebugCommandType;
  address?: number;
  data?: any;
}

export enum DebugCommandType {
  CONTINUE = 'CONTINUE',
  STEP = 'STEP',
  STEP_OVER = 'STEP_OVER',
  STEP_OUT = 'STEP_OUT',
  PAUSE = 'PAUSE',
  SET_BREAKPOINT = 'SET_BREAKPOINT',
  CLEAR_BREAKPOINT = 'CLEAR_BREAKPOINT',
  INSPECT = 'INSPECT',
  MODIFY = 'MODIFY',
}

export class DistributedDebugger {
  private clusterManager: ClusterManager;
  private runtimeManager: RuntimeManager;
  private sessions: Map<string, DebugSession> = new Map();
  private sessionCounter: number = 0;

  constructor(clusterManager: ClusterManager, runtimeManager: RuntimeManager) {
    this.clusterManager = clusterManager;
    this.runtimeManager = runtimeManager;
  }

  /**
   * Start debug session
   */
  public startSession(nodeId: string, instanceId: string): DebugSession {
    const session: DebugSession = {
      id: `session_${this.sessionCounter++}`,
      nodeId,
      instanceId,
      status: DebugSessionStatus.ACTIVE,
      breakpoints: new Map(),
      currentLocation: 0,
      startTime: Date.now(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get session by id
   */
  public getSession(sessionId: string): DebugSession | null {
    const session = this.sessions.get(sessionId);
    return session ? { ...session, breakpoints: new Map(session.breakpoints) } : null;
  }

  /**
   * Get all sessions
   */
  public getAllSessions(): DebugSession[] {
    return Array.from(this.sessions.values()).map(s => ({ ...s, breakpoints: new Map(s.breakpoints) }));
  }

  /**
   * Get sessions by node
   */
  public getSessionsByNode(nodeId: string): DebugSession[] {
    return Array.from(this.sessions.values())
      .filter(s => s.nodeId === nodeId)
      .map(s => ({ ...s, breakpoints: new Map(s.breakpoints) }));
  }

  /**
   * Get sessions by instance
   */
  public getSessionsByInstance(instanceId: string): DebugSession[] {
    return Array.from(this.sessions.values())
      .filter(s => s.instanceId === instanceId)
      .map(s => ({ ...s, breakpoints: new Map(s.breakpoints) }));
  }

  /**
   * Execute debug command
   */
  public executeCommand(sessionId: string, command: DebugCommand): void {
    const session = this.sessions.get(sessionId);

    if (!session || session.status !== DebugSessionStatus.ACTIVE) {
      return;
    }

    switch (command.type) {
      case DebugCommandType.CONTINUE:
        session.status = DebugSessionStatus.ACTIVE;
        break;

      case DebugCommandType.PAUSE:
        session.status = DebugSessionStatus.PAUSED;
        break;

      case DebugCommandType.STEP:
        session.status = DebugSessionStatus.ACTIVE;
        // In a real implementation, this would step one instruction
        break;

      case DebugCommandType.STEP_OVER:
        session.status = DebugSessionStatus.ACTIVE;
        // In a real implementation, this would step over function calls
        break;

      case DebugCommandType.STEP_OUT:
        session.status = DebugSessionStatus.ACTIVE;
        // In a real implementation, this would step out of current function
        break;

      case DebugCommandType.SET_BREAKPOINT:
        if (command.address !== undefined) {
          session.breakpoints.set(command.address, {
            address: command.address,
            enabled: true,
            hitCount: 0,
          });
        }
        break;

      case DebugCommandType.CLEAR_BREAKPOINT:
        if (command.address !== undefined) {
          session.breakpoints.delete(command.address);
        }
        break;

      case DebugCommandType.INSPECT:
        // In a real implementation, this would return variable state
        break;

      case DebugCommandType.MODIFY:
        // In a real implementation, this would modify variable state
        break;
    }
  }

  /**
   * Update session location
   */
  public updateLocation(sessionId: string, location: number): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      session.currentLocation = location;

      // Check for breakpoints
      const breakpoint = session.breakpoints.get(location);
      if (breakpoint && breakpoint.enabled) {
        breakpoint.hitCount++;
        session.status = DebugSessionStatus.PAUSED;
      }
    }
  }

  /**
   * Set breakpoint
   */
  public setBreakpoint(sessionId: string, address: number, condition?: string): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      session.breakpoints.set(address, {
        address,
        enabled: true,
        hitCount: 0,
        condition,
      });
    }
  }

  /**
   * Clear breakpoint
   */
  public clearBreakpoint(sessionId: string, address: number): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      session.breakpoints.delete(address);
    }
  }

  /**
   * Enable breakpoint
   */
  public enableBreakpoint(sessionId: string, address: number): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      const breakpoint = session.breakpoints.get(address);
      if (breakpoint) {
        breakpoint.enabled = true;
      }
    }
  }

  /**
   * Disable breakpoint
   */
  public disableBreakpoint(sessionId: string, address: number): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      const breakpoint = session.breakpoints.get(address);
      if (breakpoint) {
        breakpoint.enabled = false;
      }
    }
  }

  /**
   * End session
   */
  public endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);

    if (session) {
      session.status = DebugSessionStatus.COMPLETED;
      session.endTime = Date.now();
    }
  }

  /**
   * Delete session
   */
  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Clear all sessions
   */
  public clear(): void {
    this.sessions.clear();
    this.sessionCounter = 0;
  }

  /**
   * Get debugger statistics
   */
  public getStatistics(): {
    totalSessions: number;
    activeSessions: number;
    pausedSessions: number;
    completedSessions: number;
    totalBreakpoints: number;
  } {
    const active = Array.from(this.sessions.values()).filter(s => s.status === DebugSessionStatus.ACTIVE).length;
    const paused = Array.from(this.sessions.values()).filter(s => s.status === DebugSessionStatus.PAUSED).length;
    const completed = Array.from(this.sessions.values()).filter(s => s.status === DebugSessionStatus.COMPLETED).length;
    const totalBreakpoints = Array.from(this.sessions.values()).reduce((sum, s) => sum + s.breakpoints.size, 0);

    return {
      totalSessions: this.sessions.size,
      activeSessions: active,
      pausedSessions: paused,
      completedSessions: completed,
      totalBreakpoints,
    };
  }

  /**
   * Validate debugger state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, session] of this.sessions) {
      if (session.id !== id) {
        errors.push(`Session ID mismatch at ${id}`);
      }

      if (!this.clusterManager.getNode(session.nodeId)) {
        errors.push(`Session ${id} references non-existent node ${session.nodeId}`);
      }

      if (!this.runtimeManager.getInstance(session.instanceId)) {
        errors.push(`Session ${id} references non-existent instance ${session.instanceId}`);
      }

      if (session.startTime < 0) {
        errors.push(`Invalid start time in session ${id}`);
      }

      if (session.endTime !== undefined && session.endTime < session.startTime) {
        errors.push(`Invalid end time in session ${id}`);
      }

      for (const [address, breakpoint] of session.breakpoints) {
        if (breakpoint.address !== address) {
          errors.push(`Breakpoint address mismatch in session ${id}`);
        }

        if (breakpoint.hitCount < 0) {
          errors.push(`Invalid hit count in breakpoint ${address}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
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
