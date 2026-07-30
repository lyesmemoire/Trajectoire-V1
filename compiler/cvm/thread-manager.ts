/**
 * Blueprint DSL CVM Thread Manager
 * 
 * Manages multiple execution threads.
 */

import { ExecutionContext } from './execution-context';

export interface Thread {
  id: number;
  context: ExecutionContext;
  state: ThreadState;
  priority: number;
  quantum: number;
  created: number;
}

export enum ThreadState {
  READY = 'READY',
  RUNNING = 'RUNNING',
  BLOCKED = 'BLOCKED',
  TERMINATED = 'TERMINATED',
}

export interface ThreadManagerOptions {
  maxThreads?: number;
  defaultQuantum?: number;
  schedulingPolicy?: SchedulingPolicy;
}

export enum SchedulingPolicy {
  ROUND_ROBIN = 'ROUND_ROBIN',
  PRIORITY = 'PRIORITY',
  FIFO = 'FIFO',
}

export class ThreadManager {
  private threads: Map<number, Thread> = new Map();
  private currentThread: Thread | null = null;
  private threadCounter: number = 0;
  private options: ThreadManagerOptions;

  constructor(options: ThreadManagerOptions = {}) {
    this.options = {
      maxThreads: options.maxThreads || 64,
      defaultQuantum: options.defaultQuantum || 1000,
      schedulingPolicy: options.schedulingPolicy || SchedulingPolicy.ROUND_ROBIN,
    };
  }

  /**
   * Create new thread
   */
  public createThread(context: ExecutionContext, priority: number = 0): Thread {
    if (this.threads.size >= this.options.maxThreads!) {
      throw new Error('Maximum thread count exceeded');
    }

    const thread: Thread = {
      id: this.threadCounter++,
      context,
      state: ThreadState.READY,
      priority,
      quantum: this.options.defaultQuantum!,
      created: Date.now(),
    };

    this.threads.set(thread.id, thread);
    return thread;
  }

  /**
   * Get thread by id
   */
  public getThread(id: number): Thread | null {
    const thread = this.threads.get(id);
    return thread ? { ...thread } : null;
  }

  /**
   * Get current thread
   */
  public getCurrentThread(): Thread | null {
    return this.currentThread ? { ...this.currentThread } : null;
  }

  /**
   * Set thread state
   */
  public setThreadState(id: number, state: ThreadState): void {
    const thread = this.threads.get(id);

    if (thread) {
      thread.state = state;
    }
  }

  /**
   * Schedule next thread
   */
  public schedule(): Thread | null {
    const readyThreads = Array.from(this.threads.values())
      .filter(t => t.state === ThreadState.READY);

    if (readyThreads.length === 0) {
      return null;
    }

    let nextThread: Thread;

    switch (this.options.schedulingPolicy) {
      case SchedulingPolicy.PRIORITY:
        nextThread = readyThreads.sort((a, b) => b.priority - a.priority)[0];
        break;

      case SchedulingPolicy.FIFO:
        nextThread = readyThreads.sort((a, b) => a.created - b.created)[0];
        break;

      case SchedulingPolicy.ROUND_ROBIN:
      default:
        nextThread = readyThreads[0];
        break;
    }

    // Save current thread state
    if (this.currentThread) {
      this.currentThread.state = ThreadState.READY;
      this.currentThread.quantum = this.options.defaultQuantum!;
    }

    // Switch to next thread
    this.currentThread = nextThread;
    this.currentThread.state = ThreadState.RUNNING;

    return nextThread;
  }

  /**
   * Yield current thread
   */
  public yield(): void {
    if (this.currentThread) {
      this.currentThread.state = ThreadState.READY;
      this.schedule();
    }
  }

  /**
   * Block current thread
   */
  public block(): void {
    if (this.currentThread) {
      this.currentThread.state = ThreadState.BLOCKED;
      this.schedule();
    }
  }

  /**
   * Unblock thread
   */
  public unblock(id: number): void {
    const thread = this.threads.get(id);

    if (thread && thread.state === ThreadState.BLOCKED) {
      thread.state = ThreadState.READY;
    }
  }

  /**
   * Terminate thread
   */
  public terminate(id: number): void {
    const thread = this.threads.get(id);

    if (thread) {
      thread.state = ThreadState.TERMINATED;

      if (this.currentThread?.id === id) {
        this.currentThread = null;
        this.schedule();
      }
    }
  }

  /**
   * Delete thread
   */
  public deleteThread(id: number): boolean {
    if (this.currentThread?.id === id) {
      this.currentThread = null;
    }

    return this.threads.delete(id);
  }

  /**
   * Get all threads
   */
  public getAllThreads(): Thread[] {
    return Array.from(this.threads.values()).map(t => ({ ...t }));
  }

  /**
   * Get threads by state
   */
  public getThreadsByState(state: ThreadState): Thread[] {
    return Array.from(this.threads.values())
      .filter(t => t.state === state)
      .map(t => ({ ...t }));
  }

  /**
   * Get thread count
   */
  public getThreadCount(): number {
    return this.threads.size;
  }

  /**
   * Clear all threads
   */
  public clear(): void {
    this.threads.clear();
    this.currentThread = null;
    this.threadCounter = 0;
  }

  /**
   * Set scheduling policy
   */
  public setSchedulingPolicy(policy: SchedulingPolicy): void {
    this.options.schedulingPolicy = policy;
  }

  /**
   * Get scheduling policy
   */
  public getSchedulingPolicy(): SchedulingPolicy {
    return this.options.schedulingPolicy!;
  }

  /**
   * Set default quantum
   */
  public setDefaultQuantum(quantum: number): void {
    this.options.defaultQuantum = quantum;
  }

  /**
   * Get default quantum
   */
  public getDefaultQuantum(): number {
    return this.options.defaultQuantum!;
  }

  /**
   * Validate thread manager state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.currentThread && !this.threads.has(this.currentThread.id)) {
      errors.push('Current thread does not exist');
    }

    for (const [id, thread] of this.threads) {
      if (thread.id !== id) {
        errors.push(`Thread ID mismatch at ${id}`);
      }

      if (thread.priority < 0) {
        errors.push(`Invalid priority in thread ${id}`);
      }

      if (thread.quantum < 0) {
        errors.push(`Invalid quantum in thread ${id}`);
      }
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
    threadCount: number;
    readyCount: number;
    runningCount: number;
    blockedCount: number;
    terminatedCount: number;
    currentThread: number | null;
  } {
    const ready = this.getThreadsByState(ThreadState.READY).length;
    const running = this.getThreadsByState(ThreadState.RUNNING).length;
    const blocked = this.getThreadsByState(ThreadState.BLOCKED).length;
    const terminated = this.getThreadsByState(ThreadState.TERMINATED).length;

    return {
      threadCount: this.threads.size,
      readyCount: ready,
      runningCount: running,
      blockedCount: blocked,
      terminatedCount: terminated,
      currentThread: this.currentThread?.id || null,
    };
  }
}
