import { describe, it, expect, beforeEach } from "vitest";
import { Container } from "../../lib/core/runtime/container/Container";

describe("Container Performance", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("should resolve singleton quickly", () => {
    container.registerSingleton("TestService", { value: 42 });

    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      container.resolve("TestService");
    }
    const end = performance.now();

    const duration = end - start;
    expect(duration).toBeLessThan(100); // Should resolve 10k times in < 100ms
  });

  it("should resolve transient quickly", () => {
    container.registerTransient("TestService", () => ({ value: 42 }));

    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      container.resolve("TestService");
    }
    const end = performance.now();

    const duration = end - start;
    expect(duration).toBeLessThan(200); // Should resolve 10k times in < 200ms
  });

  it("should handle multiple registrations efficiently", () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      container.registerSingleton(`Service${i}`, { id: i });
    }
    const end = performance.now();

    const duration = end - start;
    expect(duration).toBeLessThan(50); // Should register 1k services in < 50ms
  });
});
