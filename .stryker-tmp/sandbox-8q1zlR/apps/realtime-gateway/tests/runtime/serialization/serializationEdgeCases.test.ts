// @ts-nocheck
import { stableSerialize } from "../../../src/interview/runtime/utils/hash";

describe("sparse array drift", () => {
  test("sparse array drift should be rejected or normalized", () => {
    const arr: any[] = [];
    arr[5] = 1; // sparse array
    const serialized = stableSerialize(arr);
    // Expect deterministic handling (e.g., missing indices become null)
    expect(serialized).toContain("null");
  });
});

describe("bigint rejection", () => {
  test("bigint should cause RuntimeInvariantError", () => {
    const obj = { value: BigInt(10) };
    expect(() => stableSerialize(obj)).toThrow();
  });
});

describe("unsupported type rejection", () => {
  test("unsupported types (Date, Map, Set, Function, Symbol, RegExp, TypedArray) should throw", () => {
    const cases = [
      new Date(),
      new Map(),
      new Set(),
      () => {},
      Symbol("sym"),
      /abc/g,
      new Uint8Array([1, 2, 3]),
    ];
    for (const v of cases) {
      expect(() => stableSerialize(v as any)).toThrow();
    }
  });
});
