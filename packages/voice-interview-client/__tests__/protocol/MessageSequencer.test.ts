import { describe, it, expect } from "vitest";
import { MessageSequencer } from "../../src/protocol/MessageSequencer.js";
import { MessageFactory } from "../../src/protocol/MessageFactory.js";

describe("MessageSequencer", () => {
  it("should assign monotonic sequence numbers", () => {
    const seq = new MessageSequencer();
    expect(seq.nextSequence()).toBe(1);
    expect(seq.nextSequence()).toBe(2);
    expect(seq.nextSequence()).toBe(3);
  });

  it("should enqueue and drain messages in order", () => {
    const seq = new MessageSequencer();
    const msg1 = MessageFactory.createPingMessage();
    const msg2 = MessageFactory.createPingMessage();

    seq.enqueue(msg1);
    seq.enqueue(msg2);
    expect(seq.pendingCount).toBe(2);

    const drained = seq.drain();
    expect(drained).toHaveLength(2);
    expect(seq.pendingCount).toBe(0);
  });

  it("should respect maxQueueSize by dropping oldest", () => {
    const seq = new MessageSequencer(2);
    const msg1 = MessageFactory.createPingMessage();
    const msg2 = MessageFactory.createPingMessage();
    const msg3 = MessageFactory.createPingMessage();

    seq.enqueue(msg1);
    seq.enqueue(msg2);
    seq.enqueue(msg3);
    expect(seq.pendingCount).toBe(2);
  });

  it("should reset state", () => {
    const seq = new MessageSequencer();
    seq.nextSequence();
    seq.enqueue(MessageFactory.createPingMessage());
    seq.reset();
    expect(seq.currentSequence).toBe(0);
    expect(seq.pendingCount).toBe(0);
  });
});
