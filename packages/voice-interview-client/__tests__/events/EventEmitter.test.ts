import { describe, it, expect } from "vitest";
import { TypedEventEmitter } from "../../src/events/EventEmitter.js";

describe("TypedEventEmitter", () => {
  it("should emit events to registered listeners", () => {
    const emitter = new TypedEventEmitter();
    let received = false;

    emitter.on("stateChanged", (event) => {
      received = true;
      expect(event.currentState).toBe("Listening");
    });

    emitter.emit("stateChanged", {
      previousState: "WaitingInterview",
      currentState: "Listening",
      timestamp: Date.now(),
    });

    expect(received).toBe(true);
  });

  it("should return unsubscribe function from on()", () => {
    const emitter = new TypedEventEmitter();
    let callCount = 0;

    const unsub = emitter.on("stateChanged", () => { callCount += 1; });

    emitter.emit("stateChanged", { previousState: "a", currentState: "b", timestamp: 0 });
    expect(callCount).toBe(1);

    unsub();
    emitter.emit("stateChanged", { previousState: "b", currentState: "c", timestamp: 0 });
    expect(callCount).toBe(1); // Not called again
  });

  it("should support multiple listeners on same event", () => {
    const emitter = new TypedEventEmitter();
    let count = 0;

    emitter.on("error", () => { count += 1; });
    emitter.on("error", () => { count += 1; });

    emitter.emit("error", { code: 0, message: "test", correlationId: null, recoverable: false });
    expect(count).toBe(2);
  });

  it("should not crash if listener throws", () => {
    const emitter = new TypedEventEmitter();
    let secondCalled = false;

    emitter.on("completed", () => { throw new Error("boom"); });
    emitter.on("completed", () => { secondCalled = true; });

    emitter.emit("completed", { sessionId: "s-1", timestamp: 0 });
    expect(secondCalled).toBe(true);
  });

  it("should track listener count", () => {
    const emitter = new TypedEventEmitter();
    expect(emitter.listenerCount("stateChanged")).toBe(0);

    const unsub = emitter.on("stateChanged", () => {});
    expect(emitter.listenerCount("stateChanged")).toBe(1);

    unsub();
    expect(emitter.listenerCount("stateChanged")).toBe(0);
  });

  it("should remove all listeners", () => {
    const emitter = new TypedEventEmitter();
    emitter.on("stateChanged", () => {});
    emitter.on("error", () => {});

    emitter.removeAllListeners();
    expect(emitter.listenerCount("stateChanged")).toBe(0);
    expect(emitter.listenerCount("error")).toBe(0);
  });
});
