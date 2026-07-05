import { describe, it, expect } from "vitest";
import { Pipeline } from "../../lib/core/runtime/pipeline/Pipeline";
import { ok, fail } from "../../lib/core/result";
import { InfrastructureError } from "../../lib/core/result/errors";

describe("Pipeline", () => {
  it("should execute handler without middleware", async () => {
    const pipeline = new Pipeline<string, string>();
    const handler = async (input: string) => ok(input.toUpperCase());

    const result = await pipeline.execute("hello", handler);
    expect(result.isSuccess()).toBe(true);
    expect(result.unwrap()).toBe("HELLO");
  });

  it("should execute middleware in order", async () => {
    const pipeline = new Pipeline<string, string>();
    const calls: string[] = [];

    const middleware1 = async (input: string, next: (i: string) => Promise<any>) => {
      calls.push("middleware1-before");
      const result = await next(input);
      calls.push("middleware1-after");
      return result;
    };

    const middleware2 = async (input: string, next: (i: string) => Promise<any>) => {
      calls.push("middleware2-before");
      const result = await next(input);
      calls.push("middleware2-after");
      return result;
    };

    const handler = async (input: string) => {
      calls.push("handler");
      return ok(input);
    };

    pipeline.use(middleware1).use(middleware2);
    await pipeline.execute("test", handler);

    expect(calls).toEqual([
      "middleware1-before",
      "middleware2-before",
      "handler",
      "middleware2-after",
      "middleware1-after",
    ]);
  });

  it("should allow middleware to transform input", async () => {
    const pipeline = new Pipeline<string, string>();

    const transformMiddleware = async (input: string, next: (i: string) => Promise<any>) => {
      return next(input.toUpperCase());
    };

    const handler = async (input: string) => ok(input);

    pipeline.use(transformMiddleware);
    const result = await pipeline.execute("hello", handler);

    expect(result.unwrap()).toBe("HELLO");
  });

  it("should allow middleware to short-circuit", async () => {
    const pipeline = new Pipeline<string, string>();
    const calls: string[] = [];

    const shortCircuitMiddleware = async (input: string, next: (i: string) => Promise<any>) => {
      calls.push("short-circuit");
      return fail(new InfrastructureError("Short-circuited")) as any;
    };

    const neverCalledMiddleware = async (input: string, next: (i: string) => Promise<any>) => {
      calls.push("never-called");
      return next(input);
    };

    const handler = async (input: string) => {
      calls.push("handler");
      return ok(input);
    };

    pipeline.use(shortCircuitMiddleware).use(neverCalledMiddleware);
    const result = await pipeline.execute("test", handler);

    expect(result.isFailure()).toBe(true);
    expect(calls).toEqual(["short-circuit"]);
  });

  it("should catch errors and return InfrastructureError", async () => {
    const pipeline = new Pipeline<string, string>();

    const errorMiddleware = async (input: string, next: (i: string) => Promise<any>) => {
      throw new Error("Middleware error");
    };

    const handler = async (input: string) => ok(input);

    pipeline.use(errorMiddleware);
    const result = await pipeline.execute("test", handler);

    expect(result.isFailure()).toBe(true);
    expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    expect(result.unwrapError().message).toContain("Pipeline execution failed");
  });

  it("should allow middleware to transform output", async () => {
    const pipeline = new Pipeline<string, string>();

    const outputTransformMiddleware = async (input: string, next: (i: string) => Promise<any>) => {
      const result = await next(input);
      if (result.isSuccess()) {
        return ok(result.unwrap() + "!");
      }
      return result;
    };

    const handler = async (input: string) => ok(input);

    pipeline.use(outputTransformMiddleware);
    const result = await pipeline.execute("hello", handler);

    expect(result.unwrap()).toBe("hello!");
  });

  it("should support multiple middleware chaining", async () => {
    const pipeline = new Pipeline<number, number>();

    const doubleMiddleware = async (input: number, next: (i: number) => Promise<any>) => {
      return next(input * 2);
    };

    const addTenMiddleware = async (input: number, next: (i: number) => Promise<any>) => {
      return next(input + 10);
    };

    const handler = async (input: number) => ok(input);

    pipeline.use(doubleMiddleware).use(addTenMiddleware);
    const result = await pipeline.execute(5, handler);

    // 5 * 2 = 10, then 10 + 10 = 20
    expect(result.unwrap()).toBe(20);
  });

  it("should return pipeline instance for chaining", () => {
    const pipeline = new Pipeline<string, string>();
    const middleware = async (input: string, next: (i: string) => Promise<any>) => next(input);

    const result = pipeline.use(middleware);
    expect(result).toBe(pipeline);
  });
});
