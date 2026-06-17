// runtime/core/types/StableHash.ts
/**
 * Branded primitive representing a stable, deterministic hash string.
 * The branding ensures compile‑time safety against mixing with plain strings.
 */
declare const stableHashBrand: unique symbol;
export type StableHash = string & { readonly [stableHashBrand]: true };

/** Helper to brand a raw hash string as a StableHash. */
export function asStableHash(hash: string): StableHash {
  return hash as StableHash;
}
