/**
 * RuntimeContext Unit Tests
 */

import { describe, it, expect } from "vitest";
import { RuntimeContext } from "../../../lib/intelligence-runtime/domain/context/RuntimeContext";

describe("RuntimeContext", () => {
  describe("get and set", () => {
    it("should set and get values", () => {
      const context = new RuntimeContext();
      context.set("key1", "value1");
      expect(context.get("key1")).toBe("value1");
    });

    it("should return undefined for non-existent keys", () => {
      const context = new RuntimeContext();
      expect(context.get("nonexistent")).toBeUndefined();
    });

    it("should handle different types", () => {
      const context = new RuntimeContext();
      context.set("string", "value");
      context.set("number", 42);
      context.set("boolean", true);
      context.set("object", { foo: "bar" });
      context.set("array", [1, 2, 3]);

      expect(context.get<string>("string")).toBe("value");
      expect(context.get<number>("number")).toBe(42);
      expect(context.get<boolean>("boolean")).toBe(true);
      expect(context.get<{ foo: string }>("object")).toEqual({ foo: "bar" });
      expect(context.get<number[]>("array")).toEqual([1, 2, 3]);
    });
  });

  describe("has", () => {
    it("should return true for existing keys", () => {
      const context = new RuntimeContext();
      context.set("key1", "value1");
      expect(context.has("key1")).toBe(true);
    });

    it("should return false for non-existent keys", () => {
      const context = new RuntimeContext();
      expect(context.has("nonexistent")).toBe(false);
    });
  });

  describe("keys", () => {
    it("should return all keys", () => {
      const context = new RuntimeContext();
      context.set("key1", "value1");
      context.set("key2", "value2");
      context.set("key3", "value3");

      const keys = context.keys();
      expect(keys).toHaveLength(3);
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
      expect(keys).toContain("key3");
    });

    it("should return empty array for empty context", () => {
      const context = new RuntimeContext();
      expect(context.keys()).toEqual([]);
    });
  });

  describe("clear", () => {
    it("should clear all values", () => {
      const context = new RuntimeContext();
      context.set("key1", "value1");
      context.set("key2", "value2");
      context.clear();

      expect(context.keys()).toEqual([]);
      expect(context.get("key1")).toBeUndefined();
      expect(context.get("key2")).toBeUndefined();
    });

    it("should throw error when clearing immutable context", () => {
      const context = new RuntimeContext({ immutable: true });
      expect(() => context.clear()).toThrow("Cannot clear immutable context");
    });
  });

  describe("child context", () => {
    it("should inherit parent values", () => {
      const parent = new RuntimeContext();
      parent.set("key1", "value1");

      const child = parent.child();
      expect(child.get("key1")).toBe("value1");
    });

    it("should override parent values", () => {
      const parent = new RuntimeContext();
      parent.set("key1", "value1");

      const child = parent.child();
      child.set("key1", "value2");

      expect(child.get("key1")).toBe("value2");
      expect(parent.get("key1")).toBe("value1");
    });

    it("should not affect parent when setting child values", () => {
      const parent = new RuntimeContext();
      parent.set("key1", "value1");

      const child = parent.child();
      child.set("key2", "value2");

      expect(parent.has("key2")).toBe(false);
      expect(child.has("key2")).toBe(true);
    });

    it("should inherit immutability from parent", () => {
      const parent = new RuntimeContext({ immutable: true });
      const child = parent.child();

      expect(() => child.set("key1", "value1")).toThrow("Cannot set value on immutable context");
    });

    it("should merge keys from parent and child", () => {
      const parent = new RuntimeContext();
      parent.set("key1", "value1");

      const child = parent.child();
      child.set("key2", "value2");

      const keys = child.keys();
      expect(keys).toHaveLength(2);
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
    });
  });

  describe("immutable context", () => {
    it("should throw error when setting value on immutable context", () => {
      const context = new RuntimeContext({ immutable: true });
      expect(() => context.set("key1", "value1")).toThrow("Cannot set value on immutable context");
    });

    it("should allow reading from immutable context", () => {
      const context = new RuntimeContext({ immutable: true });
      expect(context.get("key1")).toBeUndefined();
    });
  });

  describe("size", () => {
    it("should return correct size", () => {
      const context = new RuntimeContext();
      expect(context.size()).toBe(0);

      context.set("key1", "value1");
      expect(context.size()).toBe(1);

      context.set("key2", "value2");
      expect(context.size()).toBe(2);
    });

    it("should include parent keys in size", () => {
      const parent = new RuntimeContext();
      parent.set("key1", "value1");

      const child = parent.child();
      child.set("key2", "value2");

      expect(child.size()).toBe(2);
    });
  });

  describe("isEmpty", () => {
    it("should return true for empty context", () => {
      const context = new RuntimeContext();
      expect(context.isEmpty()).toBe(true);
    });

    it("should return false for non-empty context", () => {
      const context = new RuntimeContext();
      context.set("key1", "value1");
      expect(context.isEmpty()).toBe(false);
    });

    it("should return false when parent has values", () => {
      const parent = new RuntimeContext();
      parent.set("key1", "value1");

      const child = parent.child();
      expect(child.isEmpty()).toBe(false);
    });
  });
});
