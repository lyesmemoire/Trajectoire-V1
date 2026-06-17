// src/__tests__/VersionedHashDeterminism.test.ts
import { versionedHash } from "../interview/runtime/fsm/utils/versionedHash";

// Simple deterministic pseudo‑random generator (xorshift) for reproducible payloads
let seed = 0xdeadbeef;
function rand(): number {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 0xffffffff;
}

function makePayload(): unknown {
  const kind = Math.floor(rand() * 3);
  switch (kind) {
    case 0:
      return Math.floor(rand() * 1000);
    case 1:
      const len = Math.floor(rand() * 4) + 1;
      return Array.from({ length: len }, () => makePayload());
    default:
      const obj: Record<string, unknown> = {};
      const keys = ["a", "b", "c", "d"].slice(0, Math.floor(rand() * 4) + 1);
      for (const k of keys) {
        obj[k] = makePayload();
      }
      return obj;
  }
}

function shuffleKeys<T extends Record<string, unknown>>(original: T): T {
  const entries = Object.entries(original);
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  return Object.fromEntries(entries) as T;
}

describe("VersionedHashDeterminism", () => {
  const ITERATIONS = 10000;
  test("structurally equivalent payloads produce identical hashes", () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const payloadA = makePayload();
      // If payloadA is not an object we wrap it to be able to shuffle keys safely
      const payloadObj = typeof payloadA === "object" && payloadA !== null ? payloadA as Record<string, unknown> : { value: payloadA };
      const payloadB = shuffleKeys(payloadObj);
      const hashA = versionedHash(payloadObj);
      const hashB = versionedHash(payloadB);
      expect(hashA).toBe(hashB);
    }
  });

  test("different payloads produce different hashes", () => {
    const h1 = versionedHash({ a: 1, b: 2 });
    const h2 = versionedHash({ a: 1, b: 3 });
    expect(h1).not.toBe(h2);
  });
});
