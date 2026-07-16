// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";
import { RegisterUserUseCase, RegisterUserCommand } from "../../../lib/auth/application/use-cases/register-user.use-case";
import { ok, fail } from "../../../lib/core/result";
import { ConflictError } from "../../../lib/core/result/errors";
import { UnauthorizedError } from "../../../lib/core/result/errors";
import { InfrastructureError } from "../../../lib/core/result/errors";
import {
  FakeClock,
  FakeIdGenerator,
  FakeLogger,
  FakeDomainEventPublisher,
  FakeRequestContextProvider
} from "../../../tests/shared/fakes";

describe("RegisterUserUseCase", () => {
  let useCase: RegisterUserUseCase;
  let fakeClock: FakeClock;
  let fakeIdGenerator: FakeIdGenerator;
  let fakeLogger: FakeLogger;
  let fakePublisher: FakeDomainEventPublisher;
  let fakeContext: FakeRequestContextProvider;
  let mockAuthProvider: any;
  let mockUserRepo: any;

  beforeEach(() => {
    fakeClock = new FakeClock();
    fakeIdGenerator = new FakeIdGenerator();
    fakeLogger = new FakeLogger();
    fakePublisher = new FakeDomainEventPublisher();
    fakeContext = new FakeRequestContextProvider();

    // Create mock auth provider
    mockAuthProvider = {
      register: vi.fn().mockResolvedValue(ok({ userId: "auth-user-123" })),
    };

    // Create mock repository
    mockUserRepo = {
      existsByEmail: vi.fn().mockResolvedValue(ok(false)),
      save: vi.fn().mockResolvedValue(ok(undefined)),
    };

    useCase = new RegisterUserUseCase(
      mockAuthProvider,
      mockUserRepo,
      fakeIdGenerator,
      fakeClock
    );
  });

  describe("Success", () => {
    it("should register a new user successfully", async () => {
      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
        displayName: "Test User",
      };

      const result = await useCase.execute(command);

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toEqual({ userId: "auth-user-123" });
      expect(mockUserRepo.existsByEmail).toHaveBeenCalled();
      expect(mockAuthProvider.register).toHaveBeenCalled();
      expect(mockUserRepo.save).toHaveBeenCalled();
    });

    it("should register with optional metadata", async () => {
      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
        displayName: "Test User",
        ip: "192.168.1.1",
        fingerprint: "fp-123",
        userAgent: "Mozilla/5.0",
      };

      const result = await useCase.execute(command);

      expect(result.isSuccess()).toBe(true);
    });
  });

  describe("Validation failure", () => {
    it("should return ConflictError when user already exists", async () => {
      mockUserRepo.existsByEmail.mockResolvedValue(ok(true));

      const command: RegisterUserCommand = {
        email: "existing@example.com",
        password: "SecurePassword123!",
        displayName: "Existing User",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(ConflictError);
      expect(result.unwrapError().message).toBe("User already exists");
    });

    it("should return error when email is invalid", async () => {
      const command: RegisterUserCommand = {
        email: "invalid-email",
        password: "SecurePassword123!",
        displayName: "Test User",
      };

      // Email VO throws error, UseCase.execute() should catch it
      await expect(useCase.execute(command)).rejects.toThrow("Invalid email format");
    });
  });

  describe("Repository failure", () => {
    it("should return error when existsByEmail fails", async () => {
      mockUserRepo.existsByEmail.mockResolvedValue(fail(new InfrastructureError("Database connection failed")));

      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
        displayName: "Test User",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error when save fails", async () => {
      mockUserRepo.save.mockResolvedValue(fail(new InfrastructureError("Database save failed")));

      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
        displayName: "Test User",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("Domain error", () => {
    it("should return error when auth provider registration fails", async () => {
      mockAuthProvider.register.mockResolvedValue(fail(new UnauthorizedError("Auth provider error")));

      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
        displayName: "Test User",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe("Unexpected error", () => {
    it("should handle unexpected errors in existsByEmail", async () => {
      mockUserRepo.existsByEmail.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
        displayName: "Test User",
      };

      // UseCase.execute() catches DomainErrors but not generic Errors
      // This test verifies that unexpected errors are propagated
      await expect(useCase.execute(command)).rejects.toThrow("Unexpected error");
    });

    it("should handle unexpected errors in save", async () => {
      mockUserRepo.save.mockImplementation(() => {
        throw new Error("Unexpected save error");
      });

      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
        displayName: "Test User",
      };

      // UseCase.execute() catches DomainErrors but not generic Errors
      await expect(useCase.execute(command)).rejects.toThrow("Unexpected save error");
    });
  });
});
