import { describe, it, expect } from "vitest";
import { UserCreated } from "../../../lib/auth/domain/events/user-created.event";

describe("UserCreated Event", () => {
  it("should create event with correct type", () => {
    const event = new UserCreated("user123", {
      userId: "user123",
      email: "test@example.com",
      displayName: "Test User",
    });

    expect(event.type).toBe("auth.user.created");
  });

  it("should store aggregateId", () => {
    const event = new UserCreated("user123", {
      userId: "user123",
      email: "test@example.com",
      displayName: "Test User",
    });

    expect(event.aggregateId).toBe("user123");
  });

  it("should store payload correctly", () => {
    const payload = {
      userId: "user123",
      email: "test@example.com",
      displayName: "Test User",
    };

    const event = new UserCreated("user123", payload);

    expect(event.payload).toEqual(payload);
  });

  it("should have eventId", () => {
    const event = new UserCreated("user123", {
      userId: "user123",
      email: "test@example.com",
      displayName: "Test User",
    });

    expect(event.eventId).toBeDefined();
    expect(typeof event.eventId).toBe("string");
  });

  it("should have version", () => {
    const event = new UserCreated("user123", {
      userId: "user123",
      email: "test@example.com",
      displayName: "Test User",
    });

    expect(event.version).toBe(1);
  });
});
