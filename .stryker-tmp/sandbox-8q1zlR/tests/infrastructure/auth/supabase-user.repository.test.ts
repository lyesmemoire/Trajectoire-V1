// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";
import { InfrastructureError } from "../../../lib/core/result/errors";
import { UserId } from "../../../lib/auth/domain/value-objects/user-id.vo";
import { Email } from "../../../lib/auth/domain/value-objects/email.vo";
import { DisplayName } from "../../../lib/auth/domain/value-objects/display-name.vo";
import { FakeClock } from "../../shared/fakes";

// Mock getServerDb before importing the repository
const mockSupabase = {
  from: vi.fn(),
};

vi.mock("../../../lib/supabase/admin", () => ({
  createAdminClientSupabase: () => mockSupabase,
}));

import { SupabaseUserRepository } from "../../../lib/auth/infrastructure/repositories/supabase-user.repository";
import { UserAggregate } from "../../../lib/auth/domain/aggregates/user.aggregate";
import { UserPersistence } from "../../../lib/auth/infrastructure/mappers/user.mapper";

describe("SupabaseUserRepository", () => {
  let repository: SupabaseUserRepository;
  let fakeClock: FakeClock;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeClock = new FakeClock();
    repository = new SupabaseUserRepository(fakeClock);
  });

  describe("save", () => {
    it("should save user successfully", async () => {
      const user = UserAggregate.create(
        UserId.create("user123"),
        Email.create("test@example.com"),
        DisplayName.create("Test User"),
        fakeClock
      );

      mockSupabase.from = vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await repository.save(user);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith("users");
    });

    it("should return error when upsert fails", async () => {
      const user = UserAggregate.create(
        UserId.create("user123"),
        Email.create("test@example.com"),
        DisplayName.create("Test User"),
        fakeClock
      );

      mockSupabase.from = vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: { message: "Database error" } }),
      });

      const result = await repository.save(user);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error on exception", async () => {
      const user = UserAggregate.create(
        UserId.create("user123"),
        Email.create("test@example.com"),
        DisplayName.create("Test User"),
        fakeClock
      );

      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.save(user);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("findById", () => {
    it("should find user by ID successfully", async () => {
      const mockData: UserPersistence = {
        id: "user123",
        email: "test@example.com",
        display_name: "Test User",
        avatar: null,
        roles: ["user"],
        subscription: "free",
        status: "active",
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await repository.findById(UserId.create("user123"));

      expect(result.isSuccess()).toBe(true);
      const user = result.unwrap();
      expect(user.id.value).toBe("user123");
      expect(user.email.value).toBe("test@example.com");
    });

    it("should return null when user not found", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
          }),
        }),
      });

      const result = await repository.findById(UserId.create("user123"));

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBeNull();
    });

    it("should return error on exception", async () => {
      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.findById(UserId.create("user123"));

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("findByEmail", () => {
    it("should find user by email successfully", async () => {
      const mockData: UserPersistence = {
        id: "user123",
        email: "test@example.com",
        display_name: "Test User",
        avatar: null,
        roles: ["user"],
        subscription: "free",
        status: "active",
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await repository.findByEmail(Email.create("test@example.com"));

      expect(result.isSuccess()).toBe(true);
      const user = result.unwrap();
      expect(user.id.value).toBe("user123");
      expect(user.email.value).toBe("test@example.com");
    });

    it("should return null when user not found", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
          }),
        }),
      });

      const result = await repository.findByEmail(Email.create("test@example.com"));

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBeNull();
    });

    it("should return error on exception", async () => {
      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.findByEmail(Email.create("test@example.com"));

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      const result = await repository.delete(UserId.create("user123"));

      expect(result.isSuccess()).toBe(true);
    });

    it("should return error when delete fails", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: "Database error" } }),
        }),
      });

      const result = await repository.delete(UserId.create("user123"));

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error on exception", async () => {
      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.delete(UserId.create("user123"));

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("existsByEmail", () => {
    it("should return true when email exists", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [{ id: "user123" }], error: null }),
          }),
        }),
      });

      const result = await repository.existsByEmail(Email.create("test@example.com"));

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBe(true);
    });

    it("should return false when email does not exist", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await repository.existsByEmail(Email.create("test@example.com"));

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBe(false);
    });

    it("should return error on exception", async () => {
      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.existsByEmail(Email.create("test@example.com"));

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });
});
