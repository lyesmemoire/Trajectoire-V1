// @ts-nocheck
// tests/runtime/serialization/canonicalSerialization.test.ts

import { stableSerialize } from "../../../src/interview/runtime/utils/hash"; // adjust import as needed

test("canonical serialization produces deterministic output", () => {
  const obj1 = { a: 1, b: 2, c: { x: "y", z: [3, 1, 2] } };
  const obj2 = { c: { z: [3, 1, 2], x: "y" }, b: 2, a: 1 };
  expect(stableSerialize(obj1)).toBe(stableSerialize(obj2));
});
