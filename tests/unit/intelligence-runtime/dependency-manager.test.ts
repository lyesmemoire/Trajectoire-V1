/**
 * DependencyManager Unit Tests
 */

import { describe, it, expect, vi } from "vitest";
import { DependencyManager } from "../../../lib/intelligence-runtime/application/DependencyManager";

describe("DependencyManager", () => {
  describe("register and resolve", () => {
    it("should register and resolve dependency", () => {
      const manager = new DependencyManager();
      const factory = vi.fn(() => "test-value");

      manager.register({ name: "test", factory });

      const resolved = manager.resolve("test");
      expect(resolved).toBe("test-value");
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should throw error when resolving non-existent dependency", () => {
      const manager = new DependencyManager();
      expect(() => manager.resolve("nonexistent")).toThrow("Dependency 'nonexistent' not found");
    });

    it("should resolve different types", () => {
      const manager = new DependencyManager();

      manager.register({ name: "string", factory: () => "test" });
      manager.register({ name: "number", factory: () => 42 });
      manager.register({ name: "boolean", factory: () => true });
      manager.register({ name: "object", factory: () => ({ foo: "bar" }) });
      manager.register({ name: "array", factory: () => [1, 2, 3] });

      expect(manager.resolve<string>("string")).toBe("test");
      expect(manager.resolve<number>("number")).toBe(42);
      expect(manager.resolve<boolean>("boolean")).toBe(true);
      expect(manager.resolve<{ foo: string }>("object")).toEqual({ foo: "bar" });
      expect(manager.resolve<number[]>("array")).toEqual([1, 2, 3]);
    });
  });

  describe("singleton", () => {
    it("should return same instance for singleton dependencies", () => {
      const manager = new DependencyManager();
      const factory = vi.fn(() => ({ value: "test" }));

      manager.register({ name: "test", factory, singleton: true });

      const instance1 = manager.resolve("test");
      const instance2 = manager.resolve("test");

      expect(instance1).toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should return new instance for non-singleton dependencies", () => {
      const manager = new DependencyManager();
      const factory = vi.fn(() => ({ value: "test" }));

      manager.register({ name: "test", factory, singleton: false });

      const instance1 = manager.resolve("test");
      const instance2 = manager.resolve("test");

      expect(instance1).not.toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(2);
    });

    it("should default to non-singleton", () => {
      const manager = new DependencyManager();
      const factory = vi.fn(() => ({ value: "test" }));

      manager.register({ name: "test", factory });

      const instance1 = manager.resolve("test");
      const instance2 = manager.resolve("test");

      expect(instance1).not.toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(2);
    });
  });

  describe("has", () => {
    it("should return true for registered dependencies", () => {
      const manager = new DependencyManager();
      manager.register({ name: "test", factory: () => "test" });

      expect(manager.has("test")).toBe(true);
    });

    it("should return false for non-registered dependencies", () => {
      const manager = new DependencyManager();
      expect(manager.has("nonexistent")).toBe(false);
    });
  });

  describe("names", () => {
    it("should return all registered dependency names", () => {
      const manager = new DependencyManager();
      manager.register({ name: "dep1", factory: () => "test1" });
      manager.register({ name: "dep2", factory: () => "test2" });
      manager.register({ name: "dep3", factory: () => "test3" });

      const names = manager.names();
      expect(names).toHaveLength(3);
      expect(names).toContain("dep1");
      expect(names).toContain("dep2");
      expect(names).toContain("dep3");
    });

    it("should return empty array when no dependencies", () => {
      const manager = new DependencyManager();
      expect(manager.names()).toEqual([]);
    });
  });

  describe("clearInstances", () => {
    it("should clear all singleton instances", () => {
      const manager = new DependencyManager();
      const factory = vi.fn(() => ({ value: "test" }));

      manager.register({ name: "test", factory, singleton: true });

      const instance1 = manager.resolve("test");
      manager.clearInstances();
      const instance2 = manager.resolve("test");

      expect(instance1).not.toBe(instance2);
      expect(factory).toHaveBeenCalledTimes(2);
    });

    it("should not affect non-singleton dependencies", () => {
      const manager = new DependencyManager();
      const factory = vi.fn(() => ({ value: "test" }));

      manager.register({ name: "test", factory, singleton: false });

      manager.resolve("test");
      manager.clearInstances();
      manager.resolve("test");

      expect(factory).toHaveBeenCalledTimes(2);
    });
  });

  describe("constructor with options", () => {
    it("should register dependencies from options", () => {
      const manager = new DependencyManager({
        dependencies: [
          { name: "dep1", factory: () => "test1" },
          { name: "dep2", factory: () => "test2" },
        ],
      });

      expect(manager.has("dep1")).toBe(true);
      expect(manager.has("dep2")).toBe(true);
      expect(manager.resolve("dep1")).toBe("test1");
      expect(manager.resolve("dep2")).toBe("test2");
    });
  });
});
