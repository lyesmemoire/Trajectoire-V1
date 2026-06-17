// runtime/utils/hash.ts
/**
 * Deterministic hashing utilities for the interview runtime.
 * Provides a branded stable hash, prompt hash alias, and a stable object serializer.
 */
// Removed Brand import; using core StableHash
import { RuntimeInvariantError } from "../errors/RuntimeInvariantError";
import type { StableHash } from "../types/StableHash";
import { asStableHash } from "../types/StableHash";

export type { StableHash };
export { asStableHash };

/** Prompt hash alias for semantic clarity */
export type PromptHash = StableHash;

/**
 * djb2 32‑bit hash with explicit unsigned normalization, zero‑padded 8‑char lower‑case hex.
 */
export function hashString(str: string): StableHash {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // ((hash * 33) ^ code) >>> 0 ensures unsigned 32‑bit result each iteration
    hash = (((hash << 5) + hash) ^ code) >>> 0;
  }
  const hex = hash.toString(16).padStart(8, "0").toLowerCase();
  return asStableHash(hex);
}

/**
 * Recursively serialize a value into a deterministic string.
 * - Objects: keys sorted lexicographically
 * - Arrays: order preserved
 * - Handles Date, RegExp, NaN, Infinity, -Infinity, undefined (placeholder)
 * - Throws on functions, symbols, bigint, or recursion depth > 100
 */
export function stableSerialize(value: unknown, depth: number = 0): string {
  if (depth > 100) {
    throw new RuntimeInvariantError("stableSerialize recursion depth exceeded");
  }
  if (value === undefined) {
    return '"__undefined__"'; // deterministic placeholder
  }
  if (value === null) {
    return "null";
  }
  if (typeof value === "bigint") {
    throw new RuntimeInvariantError(
      "Unsupported type: bigint in stableSerialize",
    );
  }
  if (typeof value === "function") {
    throw new RuntimeInvariantError(
      "Unsupported type: function in stableSerialize",
    );
  }
  if (typeof value === "symbol") {
    throw new RuntimeInvariantError(
      "Unsupported type: symbol in stableSerialize",
    );
  }
  if (typeof value === "number") {
    if (Number.isNaN(value)) return '"__NaN__"';
    if (value === Infinity) return '"__Infinity__"';
    if (value === -Infinity) return '"__-Infinity__"';
  }
  if (value instanceof Date) {
    return `\"${value.toISOString()}\"`;
  }
  if (value instanceof RegExp) {
    return `\"__regexp__:${value.toString()}\"`;
  }
  if (Array.isArray(value)) {
    const elems = value.map((v) => stableSerialize(v, depth + 1)).join(",");
    return `[${elems}]`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>).sort();
    const parts = keys.map((k) => {
      const val = (value as Record<string, unknown>)[k];
      return `\"${k}\":${stableSerialize(val, depth + 1)}`;
    });
    return `{${parts.join(",")}}`;
  }
  // Primitive types (string, boolean, number already handled) fall back to JSON.stringify
  return JSON.stringify(value);
}

/** Hash an object deterministically; only objects are accepted */
export function hashObjectStable<T extends object>(obj: T): StableHash {
  const serialized = stableSerialize(obj);
  return hashString(serialized);
}
