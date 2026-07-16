import { describe, it, expect, beforeEach } from "vitest";
import { Container } from "../../lib/core/runtime/container/Container";

describe("Container", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("should register and resolve singleton", () => {
    const instance = { value: 42 };
    container.registerSingleton("TestService", instance);

    const resolved = container.resolve("TestService");
    expect(resolved).toBe(instance);
  });

  it("should return same instance for singleton", () => {
    const instance = { value: 42 };
    container.registerSingleton("TestService", instance);

    const resolved1 = container.resolve("TestService");
    const resolved2 = container.resolve("TestService");
    expect(resolved1).toBe(resolved2);
  });

  it("should register and resolve transient", () => {
    let counter = 0;
    container.registerTransient("TestService", () => ({ value: ++counter }));

    const resolved1 = container.resolve("TestService") as { value: number };
    const resolved2 = container.resolve("TestService") as { value: number };
    expect(resolved1.value).toBe(1);
    expect(resolved2.value).toBe(2);
    expect(resolved1).not.toBe(resolved2);
  });

  it("should throw when resolving unregistered service", () => {
    expect(() => container.resolve("NonExistent")).toThrow();
  });

  it("should support dependency resolution by manual registration", () => {
    const dependencyA = { name: "A" };
    const dependencyB = { name: "B" };
    container.registerSingleton("DependencyA", dependencyA);
    container.registerSingleton("DependencyB", dependencyB);
    container.registerSingleton(
      "Service",
      {
        a: container.resolve("DependencyA"),
        b: container.resolve("DependencyB"),
      }
    );

    const service = container.resolve("Service") as { a: { name: string }, b: { name: string } };
    expect(service.a.name).toBe("A");
    expect(service.b.name).toBe("B");
  });
});
