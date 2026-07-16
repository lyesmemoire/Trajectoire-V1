/**
 * Framework-agnostic typed event emitter.
 * Works in any JS runtime — no dependency on Node.js EventEmitter.
 */

import type { VoiceClientEventMap, VoiceClientEventName } from "../types/events.js";

type Listener<T> = (event: T) => void;

export class TypedEventEmitter {
  private readonly listeners: Map<string, Set<Listener<unknown>>> = new Map();

  on<K extends VoiceClientEventName>(
    event: K,
    listener: Listener<VoiceClientEventMap[K]>
  ): () => void {
    const key = event as string;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    const set = this.listeners.get(key)!;
    const typedListener = listener as Listener<unknown>;
    set.add(typedListener);

    // Return unsubscribe function
    return () => {
      set.delete(typedListener);
      if (set.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  off<K extends VoiceClientEventName>(
    event: K,
    listener: Listener<VoiceClientEventMap[K]>
  ): void {
    const key = event as string;
    const set = this.listeners.get(key);
    if (set) {
      set.delete(listener as Listener<unknown>);
      if (set.size === 0) {
        this.listeners.delete(key);
      }
    }
  }

  emit<K extends VoiceClientEventName>(
    event: K,
    payload: VoiceClientEventMap[K]
  ): void {
    const key = event as string;
    const set = this.listeners.get(key);
    if (set) {
      for (const listener of set) {
        try {
          listener(payload);
        } catch {
          // Swallow listener errors to prevent cascade failures
        }
      }
    }
  }

  removeAllListeners(event?: VoiceClientEventName): void {
    if (event) {
      this.listeners.delete(event as string);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: VoiceClientEventName): number {
    const set = this.listeners.get(event as string);
    return set ? set.size : 0;
  }
}
