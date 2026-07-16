/**
 * EventPublisher Unit Tests
 */

import { describe, it, expect, vi } from "vitest";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";

describe("EventPublisher", () => {
  describe("publish and subscribe", () => {
    it("should publish event and call handler", async () => {
      const publisher = new EventPublisher();
      const handler = vi.fn();

      publisher.subscribe("test-event", handler);
      await publisher.publish("test-event", { data: "test" });

      expect(handler).toHaveBeenCalledWith({ data: "test" });
    });

    it("should call multiple handlers for same event", async () => {
      const publisher = new EventPublisher();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      publisher.subscribe("test-event", handler1);
      publisher.subscribe("test-event", handler2);
      await publisher.publish("test-event", { data: "test" });

      expect(handler1).toHaveBeenCalledWith({ data: "test" });
      expect(handler2).toHaveBeenCalledWith({ data: "test" });
    });

    it("should not call handlers for different events", async () => {
      const publisher = new EventPublisher();
      const handler = vi.fn();

      publisher.subscribe("event1", handler);
      await publisher.publish("event2", { data: "test" });

      expect(handler).not.toHaveBeenCalled();
    });

    it("should handle async handlers", async () => {
      const publisher = new EventPublisher();
      const handler = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      publisher.subscribe("test-event", handler);
      await publisher.publish("test-event", { data: "test" });

      expect(handler).toHaveBeenCalled();
    });
  });

  describe("once option", () => {
    it("should remove handler after first call when once is true", async () => {
      const publisher = new EventPublisher();
      const handler = vi.fn();

      publisher.subscribe("test-event", handler, { once: true });
      await publisher.publish("test-event", { data: "test1" });
      await publisher.publish("test-event", { data: "test2" });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ data: "test1" });
    });

    it("should keep handler when once is false", async () => {
      const publisher = new EventPublisher();
      const handler = vi.fn();

      publisher.subscribe("test-event", handler, { once: false });
      await publisher.publish("test-event", { data: "test1" });
      await publisher.publish("test-event", { data: "test2" });

      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe using returned function", async () => {
      const publisher = new EventPublisher();
      const handler = vi.fn();

      const unsubscribe = publisher.subscribe("test-event", handler);
      unsubscribe();
      await publisher.publish("test-event", { data: "test" });

      expect(handler).not.toHaveBeenCalled();
    });

    it("should unsubscribe specific handler", async () => {
      const publisher = new EventPublisher();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      publisher.subscribe("test-event", handler1);
      const unsubscribe = publisher.subscribe("test-event", handler2);
      unsubscribe();

      await publisher.publish("test-event", { data: "test" });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe("event history", () => {
    it("should store events in history", async () => {
      const publisher = new EventPublisher();
      await publisher.publish("event1", { data: "test1" });
      await publisher.publish("event2", { data: "test2" });

      const history = publisher.getHistory();
      expect(history).toHaveLength(2);
    });

    it("should limit history size", async () => {
      const publisher = new EventPublisher({ maxHistory: 2 });

      await publisher.publish("event1", { data: "test1" });
      await publisher.publish("event2", { data: "test2" });
      await publisher.publish("event3", { data: "test3" });

      const history = publisher.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual({ type: "event2", payload: { data: "test2" } });
      expect(history[1]).toEqual({ type: "event3", payload: { data: "test3" } });
    });

    it("should get history by type", async () => {
      const publisher = new EventPublisher();
      await publisher.publish("event1", { data: "test1" });
      await publisher.publish("event2", { data: "test2" });
      await publisher.publish("event1", { data: "test3" });

      const history = publisher.getHistoryByType("event1");
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual({ data: "test1" });
      expect(history[1]).toEqual({ data: "test3" });
    });

    it("should clear history", async () => {
      const publisher = new EventPublisher();
      await publisher.publish("event1", { data: "test1" });

      publisher.clearHistory();

      const history = publisher.getHistory();
      expect(history).toHaveLength(0);
    });
  });

  describe("error handling", () => {
    it("should handle handler errors gracefully", async () => {
      const publisher = new EventPublisher();
      const handler1 = vi.fn(() => {
        throw new Error("Handler error");
      });
      const handler2 = vi.fn();

      publisher.subscribe("test-event", handler1);
      publisher.subscribe("test-event", handler2);

      await publisher.publish("test-event", { data: "test" });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe("subscription management", () => {
    it("should get subscription count", () => {
      const publisher = new EventPublisher();
      publisher.subscribe("event1", vi.fn());
      publisher.subscribe("event1", vi.fn());
      publisher.subscribe("event2", vi.fn());

      expect(publisher.getSubscriptionCount()).toBe(3);
    });

    it("should get subscriptions by type", () => {
      const publisher = new EventPublisher();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      publisher.subscribe("event1", handler1);
      publisher.subscribe("event1", handler2);
      publisher.subscribe("event2", vi.fn());

      const subscriptions = publisher.getSubscriptionsByType("event1");
      expect(subscriptions).toHaveLength(2);
    });

    it("should clear all subscriptions", () => {
      const publisher = new EventPublisher();
      publisher.subscribe("event1", vi.fn());
      publisher.subscribe("event2", vi.fn());

      publisher.clearSubscriptions();

      expect(publisher.getSubscriptionCount()).toBe(0);
    });
  });
});
