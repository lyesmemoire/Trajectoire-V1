/**
 * ExecutionPipeline Unit Tests
 */

import { describe, it, expect, vi } from "vitest";
import { ExecutionPipeline } from "../../../lib/intelligence-runtime/application/ExecutionPipeline";
import { RuntimeContext } from "../../../lib/intelligence-runtime/domain/context/RuntimeContext";

describe("ExecutionPipeline", () => {
  describe("execute", () => {
    it("should execute stages sequentially", async () => {
      const pipeline = new ExecutionPipeline();
      const context = new RuntimeContext();

      const stage1Execute = vi.fn(async (input) => ({ ...input, step1: true }));
      const stage2Execute = vi.fn(async (input) => ({ ...input, step2: true }));

      const stage1: any = { name: "stage1", execute: stage1Execute };
      const stage2: any = { name: "stage2", execute: stage2Execute };

      const result = await pipeline.execute(
        { initial: true },
        [stage1, stage2],
        context
      );

      expect(result).toEqual({ initial: true, step1: true, step2: true });
      expect(stage1Execute).toHaveBeenCalledTimes(1);
      expect(stage2Execute).toHaveBeenCalledTimes(1);
    });

    it("should pass context to each stage", async () => {
      const pipeline = new ExecutionPipeline();
      const context = new RuntimeContext();
      context.set("testKey", "testValue");

      const stageExecute = vi.fn(async (input, ctx) => {
        expect(ctx.get("testKey")).toBe("testValue");
        return input;
      });
      const stage: any = { name: "stage", execute: stageExecute };

      await pipeline.execute({ data: "test" }, [stage], context);

      expect(stageExecute).toHaveBeenCalled();
    });

    it("should handle empty stages", async () => {
      const pipeline = new ExecutionPipeline();
      const context = new RuntimeContext();

      const result = await pipeline.execute({ data: "test" }, [], context);

      expect(result).toEqual({ data: "test" });
    });

    it("should propagate errors", async () => {
      const pipeline = new ExecutionPipeline();
      const context = new RuntimeContext();

      const stage1Execute = vi.fn(async (input) => ({ ...input, step1: true }));
      const stage2Execute = vi.fn(async () => {
        throw new Error("Stage error");
      });
      const stage1: any = { name: "stage1", execute: stage1Execute };
      const stage2: any = { name: "stage2", execute: stage2Execute };

      await expect(
        pipeline.execute({ data: "test" }, [stage1, stage2], context)
      ).rejects.toThrow("Stage error");
    });
  });

  describe("middleware", () => {
    it("should apply before middleware", async () => {
      const beforeMiddleware = vi.fn(async (input) => ({ ...input, before: true }));
      const pipeline = new ExecutionPipeline({ middleware: [{ name: "test", before: beforeMiddleware }] });
      const context = new RuntimeContext();

      const stageExecute = vi.fn(async (input) => input);
      const stage: any = { name: "stage", execute: stageExecute };

      await pipeline.execute({ data: "test" }, [stage], context);

      expect(beforeMiddleware).toHaveBeenCalledWith({ data: "test" }, context);
    });

    it("should apply after middleware", async () => {
      const afterMiddleware = vi.fn(async (output) => ({ ...output, after: true }));
      const pipeline = new ExecutionPipeline({ middleware: [{ name: "test", after: afterMiddleware }] });
      const context = new RuntimeContext();

      const stageExecute = vi.fn(async (input) => input);
      const stage: any = { name: "stage", execute: stageExecute };

      await pipeline.execute({ data: "test" }, [stage], context);

      expect(afterMiddleware).toHaveBeenCalled();
    });

    it("should apply error middleware on error", async () => {
      const errorMiddleware = vi.fn(async (error) => {
        expect(error.message).toBe("Stage error");
      });
      const pipeline = new ExecutionPipeline({ middleware: [{ name: "test", onError: errorMiddleware }] });
      const context = new RuntimeContext();

      const stageExecute = vi.fn(async () => {
        throw new Error("Stage error");
      });
      const stage: any = { name: "stage", execute: stageExecute };

      await expect(
        pipeline.execute({ data: "test" }, [stage], context)
      ).rejects.toThrow("Stage error");

      expect(errorMiddleware).toHaveBeenCalled();
    });

    it("should apply middleware in order", async () => {
      const order: string[] = [];
      const pipeline = new ExecutionPipeline({
        middleware: [
          {
            name: "before1",
            before: async () => {
              order.push("before1");
            },
          },
          {
            name: "before2",
            before: async () => {
              order.push("before2");
            },
          },
          {
            name: "after1",
            after: async () => {
              order.push("after1");
            },
          },
          {
            name: "after2",
            after: async () => {
              order.push("after2");
            },
          },
        ],
      });
      const context = new RuntimeContext();

      const stageExecute = vi.fn(async (input) => input);
      const stage: any = { name: "stage", execute: stageExecute };

      await pipeline.execute({ data: "test" }, [stage], context);

      expect(order).toEqual(["before1", "before2", "after1", "after2"]);
    });
  });

  describe("use", () => {
    it("should add middleware to pipeline", async () => {
      const pipeline = new ExecutionPipeline();
      const middleware = vi.fn(async (input) => input);

      pipeline.use({ name: "test", before: middleware });

      expect(pipeline.getMiddlewareCount()).toBe(1);
    });

    it("should return updated pipeline", () => {
      const pipeline = new ExecutionPipeline();
      const updated = pipeline.use({ name: "test", before: async () => {} });

      expect(updated).toBe(pipeline);
    });

    it("should chain multiple use calls", () => {
      const pipeline = new ExecutionPipeline();
      pipeline.use({ name: "test1", before: async () => {} });
      pipeline.use({ name: "test2", before: async () => {} });

      expect(pipeline.getMiddlewareCount()).toBe(2);
    });
  });

  describe("fromConfig", () => {
    it("should create pipeline from config", () => {
      const middleware = { name: "test", before: async () => {} };
      const pipeline = ExecutionPipeline.fromConfig({ middleware: [middleware] });

      expect(pipeline.getMiddlewareCount()).toBe(1);
    });
  });

  describe("clearMiddleware", () => {
    it("should clear all middleware", () => {
      const pipeline = new ExecutionPipeline();
      pipeline.use({ name: "test1", before: async () => {} });
      pipeline.use({ name: "test2", before: async () => {} });

      pipeline.clearMiddleware();

      expect(pipeline.getMiddlewareCount()).toBe(0);
    });
  });

  describe("getMiddlewareCount", () => {
    it("should return middleware count", () => {
      const pipeline = new ExecutionPipeline();
      expect(pipeline.getMiddlewareCount()).toBe(0);

      pipeline.use({ name: "test", before: async () => {} });
      expect(pipeline.getMiddlewareCount()).toBe(1);
    });
  });
});
