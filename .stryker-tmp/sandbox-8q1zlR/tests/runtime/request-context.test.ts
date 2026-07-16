// @ts-nocheck
import { describe, it, expect } from "vitest";
import { RequestContext } from "../../lib/core/runtime/context/RequestContext";

describe("RequestContext", () => {
  it("should return null when no context is active", () => {
    const context = RequestContext.current();
    expect(context).toBeNull();
  });

  it("should return unknown correlationId when no context is active", () => {
    const correlationId = RequestContext.correlationId();
    expect(correlationId).toBe("unknown");
  });

  it("should return unknown requestId when no context is active", () => {
    const requestId = RequestContext.requestId();
    expect(requestId).toBe("unknown");
  });

  it("should return undefined userId when no context is active", () => {
    const userId = RequestContext.userId();
    expect(userId).toBeUndefined();
  });

  it("should run with context and return current context", () => {
    const contextData = {
      requestId: "req123",
      correlationId: "corr123",
      userId: "user123",
    };

    RequestContext.run(contextData, () => {
      const current = RequestContext.current();
      expect(current).toEqual(contextData);
    });
  });

  it("should return correlationId from active context", () => {
    const contextData = {
      requestId: "req123",
      correlationId: "corr123",
      userId: "user123",
    };

    RequestContext.run(contextData, () => {
      const correlationId = RequestContext.correlationId();
      expect(correlationId).toBe("corr123");
    });
  });

  it("should return requestId from active context", () => {
    const contextData = {
      requestId: "req123",
      correlationId: "corr123",
      userId: "user123",
    };

    RequestContext.run(contextData, () => {
      const requestId = RequestContext.requestId();
      expect(requestId).toBe("req123");
    });
  });

  it("should return userId from active context", () => {
    const contextData = {
      requestId: "req123",
      correlationId: "corr123",
      userId: "user123",
    };

    RequestContext.run(contextData, () => {
      const userId = RequestContext.userId();
      expect(userId).toBe("user123");
    });
  });

  it("should return value from run callback", () => {
    const contextData = {
      requestId: "req123",
      correlationId: "corr123",
      userId: "user123",
    };

    const result = RequestContext.run(contextData, () => {
      return "test-result";
    });

    expect(result).toBe("test-result");
  });

  it("should support nested contexts", () => {
    const outerContext = {
      requestId: "req1",
      correlationId: "corr1",
      userId: "user1",
    };

    const innerContext = {
      requestId: "req2",
      correlationId: "corr2",
      userId: "user2",
    };

    RequestContext.run(outerContext, () => {
      expect(RequestContext.correlationId()).toBe("corr1");

      RequestContext.run(innerContext, () => {
        expect(RequestContext.correlationId()).toBe("corr2");
      });

      expect(RequestContext.correlationId()).toBe("corr1");
    });
  });

  it("should work with async operations", async () => {
    const contextData = {
      requestId: "req123",
      correlationId: "corr123",
      userId: "user123",
    };

    await RequestContext.run(contextData, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(RequestContext.correlationId()).toBe("corr123");
    });
  });
});
