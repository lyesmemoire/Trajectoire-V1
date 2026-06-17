// src/interview/runtime/events.ts

import type { StableHash } from "./types/StableHash";

/**
 * Kernel event definitions – pure, immutable signals emitted by the deterministic core.
 * These events never mutate kernel state; they are merely projections for observers.
 */
export type KernelEvent =
  | BranchCreatedEvent
  | MergePerformedEvent
  | DiffGeneratedEvent;

/** Emitted when a new branch is created (forked) */
export interface BranchCreatedEvent {
  type: "BranchCreated";
  /** Unique identifier of the newly created branch */
  branchId: StableHash;
  /** Identifier of the parent branch (null for root) */
  parentId: StableHash | null;
}

/** Emitted when a deterministic merge completes */
export interface MergePerformedEvent {
  type: "MergePerformed";
  /** Identifier of the merged branch that resulted from the operation */
  mergedBranchId: StableHash;
  /** First parent branch identifier */
  parentA: StableHash;
  /** Second parent branch identifier */
  parentB: StableHash;
}

/** Emitted after a snapshot diff operation */
export interface DiffGeneratedEvent {
  type: "DiffGenerated";
  /** Hash of the first snapshot compared */
  stepHashA: StableHash;
  /** Hash of the second snapshot compared */
  stepHashB: StableHash;
  /** True when the snapshots are identical */
  isEqual: boolean;
}

/**
 * Functional, deterministic event bus.
 *
 * - `emit` synchronously notifies all registered listeners.
 * - `subscribe` returns an unsubscribe function.
 * - No global mutable state beyond the listener list, which is confined to the instance.
 * - Pure in the sense that emitting does not alter any kernel data; it only propagates immutable events.
 */
export function createKernelEventBus() {
  const listeners: Array<(e: KernelEvent) => void> = [];

  return {
    /** Notify all listeners of a new kernel event */
    emit(event: KernelEvent) {
      // Defensive copy in case a listener removes itself during iteration
      const current = [...listeners];
      for (const listener of current) {
        listener(event);
      }
    },
    /** Register a listener; returns an unsubscribe function */
    subscribe(listener: (e: KernelEvent) => void) {
      listeners.push(listener);
      return () => {
        const idx = listeners.indexOf(listener);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },
  };
}
