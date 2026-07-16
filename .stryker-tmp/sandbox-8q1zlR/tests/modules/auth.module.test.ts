// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthModule } from "../../lib/auth/AuthModule";
import { Container } from "../../lib/core/runtime/container/Container";
import { SystemClock } from "../../lib/core/clock/Clock";
import { UuidGenerator } from "../../lib/core/id/IdGenerator";

// Mock Supabase dependencies
vi.mock("../../lib/supabase/admin", () => ({
  createAdminClientSupabase: vi.fn(),
}));

vi.mock("../../lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

describe("AuthModule", () => {
  let container: Container;
  let module: AuthModule;

  beforeEach(() => {
    container = new Container();
    module = new AuthModule();
    // Register core dependencies
    container.registerSingleton("Clock", new SystemClock());
    container.registerSingleton("IdGenerator", new UuidGenerator());
  });

  it("should register repositories", () => {
    module.register(container);
    
    const userRepository = container.resolve("UserRepository");
    expect(userRepository).toBeDefined();
  });

  it("should register gateways", () => {
    module.register(container);
    
    const authProvider = container.resolve("AuthenticationProvider");
    const sessionProvider = container.resolve("SessionProvider");
    const permissionProvider = container.resolve("PermissionProvider");
    
    expect(authProvider).toBeDefined();
    expect(sessionProvider).toBeDefined();
    expect(permissionProvider).toBeDefined();
  });

  it("should register use cases", () => {
    module.register(container);
    
    const registerUserUseCase = container.resolve("RegisterUserUseCase");
    const getCurrentUserUseCase = container.resolve("GetCurrentUserUseCase");
    
    expect(registerUserUseCase).toBeDefined();
    expect(getCurrentUserUseCase).toBeDefined();
  });

  it("should register queries", () => {
    module.register(container);
    
    const getCurrentUserQuery = container.resolve("GetCurrentUserQuery");
    const getUserByIdQuery = container.resolve("GetUserByIdQuery");
    
    expect(getCurrentUserQuery).toBeDefined();
    expect(getUserByIdQuery).toBeDefined();
  });

  it("should register presenters", () => {
    module.register(container);
    
    const authPresenter = container.resolve("AuthPresenter");
    
    expect(authPresenter).toBeDefined();
  });
});
