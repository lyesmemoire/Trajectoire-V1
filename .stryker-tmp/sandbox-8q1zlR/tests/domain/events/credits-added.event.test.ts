// @ts-nocheck
import { describe, it, expect } from "vitest";
import { CreditsAdded } from "../../../lib/billing/domain/events/credits-added.event";

describe("CreditsAdded Event", () => {
  it("should create event with correct type", () => {
    const event = new CreditsAdded("user123", {
      userId: "user123",
      amount: 100,
      transactionId: "txn123",
    });

    expect(event.type).toBe("billing.credits.added");
  });

  it("should store aggregateId", () => {
    const event = new CreditsAdded("user123", {
      userId: "user123",
      amount: 100,
      transactionId: "txn123",
    });

    expect(event.aggregateId).toBe("user123");
  });

  it("should store payload correctly", () => {
    const payload = {
      userId: "user123",
      amount: 100,
      transactionId: "txn123",
    };

    const event = new CreditsAdded("user123", payload);

    expect(event.payload).toEqual(payload);
  });

  it("should have eventId", () => {
    const event = new CreditsAdded("user123", {
      userId: "user123",
      amount: 100,
      transactionId: "txn123",
    });

    expect(event.eventId).toBeDefined();
    expect(typeof event.eventId).toBe("string");
  });

  it("should have version", () => {
    const event = new CreditsAdded("user123", {
      userId: "user123",
      amount: 100,
      transactionId: "txn123",
    });

    expect(event.version).toBe(1);
  });
});
