/**
 * Blueprint DSL CPR Distributed Locks
 * 
 * Manages distributed locks for coordination.
 */

import { ClusterManager } from './cluster-manager';

export interface Lock {
  id: string;
  name: string;
  holder: string | null;
  waiters: string[];
  acquired: boolean;
  timestamp: number;
  ttl: number;
}

export interface LockRequest {
  id: string;
  nodeId: string;
  lockName: string;
  timestamp: number;
}

export class DistributedLocks {
  private clusterManager: ClusterManager;
  private locks: Map<string, Lock> = new Map();
  private requests: Map<string, LockRequest> = new Map();
  private lockCounter: number = 0;
  private requestCounter: number = 0;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }

  /**
   * Acquire lock
   */
  public acquire(lockName: string, nodeId: string, ttl: number = 30000): Lock {
    const existingLock = this.locks.get(lockName);

    if (existingLock && existingLock.acquired && existingLock.holder !== nodeId) {
      // Lock is held by another node, add to waiters
      existingLock.waiters.push(nodeId);
      return existingLock;
    }

    // Create or acquire lock
    const lock: Lock = {
      id: `lock_${this.lockCounter++}`,
      name: lockName,
      holder: nodeId,
      waiters: [],
      acquired: true,
      timestamp: Date.now(),
      ttl,
    };

    this.locks.set(lockName, lock);
    return lock;
  }

  /**
   * Release lock
   */
  public release(lockName: string, nodeId: string): boolean {
    const lock = this.locks.get(lockName);

    if (!lock || lock.holder !== nodeId) {
      return false;
    }

    // Give lock to next waiter
    if (lock.waiters.length > 0) {
      const nextHolder = lock.waiters.shift()!;
      lock.holder = nextHolder;
      lock.timestamp = Date.now();
    } else {
      lock.holder = null;
      lock.acquired = false;
    }

    return true;
  }

  /**
   * Try acquire lock (non-blocking)
   */
  public tryAcquire(lockName: string, nodeId: string, ttl: number = 30000): Lock | null {
    const existingLock = this.locks.get(lockName);

    if (existingLock && existingLock.acquired && existingLock.holder !== nodeId) {
      return null;
    }

    return this.acquire(lockName, nodeId, ttl);
  }

  /**
   * Renew lock
   */
  public renew(lockName: string, nodeId: string, ttl: number): boolean {
    const lock = this.locks.get(lockName);

    if (!lock || lock.holder !== nodeId) {
      return false;
    }

    lock.timestamp = Date.now();
    lock.ttl = ttl;
    return true;
  }

  /**
   * Get lock by name
   */
  public getLock(lockName: string): Lock | null {
    const lock = this.locks.get(lockName);
    return lock ? { ...lock, waiters: [...lock.waiters] } : null;
  }

  /**
   * Get all locks
   */
  public getAllLocks(): Lock[] {
    return Array.from(this.locks.values()).map(l => ({ ...l, waiters: [...l.waiters] }));
  }

  /**
   * Get locks by holder
   */
  public getLocksByHolder(nodeId: string): Lock[] {
    return Array.from(this.locks.values())
      .filter(l => l.holder === nodeId)
      .map(l => ({ ...l, waiters: [...l.waiters] }));
  }

  /**
   * Check for expired locks
   */
  public checkExpiredLocks(): string[] {
    const now = Date.now();
    const expired: string[] = [];

    for (const [name, lock] of this.locks) {
      if (lock.acquired && lock.holder && now - lock.timestamp > lock.ttl) {
        expired.push(name);
        this.release(name, lock.holder);
      }
    }

    return expired;
  }

  /**
   * Delete lock
   */
  public deleteLock(lockName: string): boolean {
    return this.locks.delete(lockName);
  }

  /**
   * Clear all locks
   */
  public clear(): void {
    this.locks.clear();
    this.requests.clear();
    this.lockCounter = 0;
    this.requestCounter = 0;
  }

  /**
   * Get lock statistics
   */
  public getStatistics(): {
    totalLocks: number;
    acquiredLocks: number;
    waitingLocks: number;
    totalWaiters: number;
    averageWaiters: number;
  } {
    const acquired = Array.from(this.locks.values()).filter(l => l.acquired).length;
    const totalWaiters = Array.from(this.locks.values()).reduce((sum, l) => sum + l.waiters.length, 0);
    const averageWaiters = this.locks.size > 0 ? totalWaiters / this.locks.size : 0;

    return {
      totalLocks: this.locks.size,
      acquiredLocks: acquired,
      waitingLocks: this.locks.size - acquired,
      totalWaiters,
      averageWaiters,
    };
  }

  /**
   * Validate distributed locks state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [name, lock] of this.locks) {
      if (lock.name !== name) {
        errors.push(`Lock name mismatch at ${name}`);
      }

      if (lock.holder && !this.clusterManager.getNode(lock.holder)) {
        errors.push(`Lock ${name} references non-existent holder ${lock.holder}`);
      }

      for (const waiter of lock.waiters) {
        if (!this.clusterManager.getNode(waiter)) {
          errors.push(`Lock ${name} references non-existent waiter ${waiter}`);
        }
      }

      if (lock.ttl < 0) {
        errors.push(`Invalid TTL in lock ${name}`);
      }

      if (lock.timestamp < 0) {
        errors.push(`Invalid timestamp in lock ${name}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get cluster manager
   */
  public getClusterManager(): ClusterManager {
    return this.clusterManager;
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }
}
