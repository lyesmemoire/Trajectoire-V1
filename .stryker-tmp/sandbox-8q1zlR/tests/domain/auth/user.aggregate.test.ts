// @ts-nocheck
import { describe, it, expect, beforeEach } from "vitest";
import { UserAggregate } from "../../../lib/auth/domain/aggregates/user.aggregate";
import { UserId } from "../../../lib/auth/domain/value-objects/user-id.vo";
import { Email } from "../../../lib/auth/domain/value-objects/email.vo";
import { UserRole } from "../../../lib/auth/domain/value-objects/user-role.vo";
import { AccountStatus } from "../../../lib/auth/domain/value-objects/account-status.vo";
import { DisplayName } from "../../../lib/auth/domain/value-objects/display-name.vo";
import {
  UserCreated,
  UserUpdated,
  UserActivated,
  UserDeactivated,
  RoleAssigned,
  SubscriptionChanged,
  EmailVerified
} from "../../../lib/auth/domain/events";
import { FakeClock, FakeIdGenerator } from "../../shared/fakes";

describe("UserAggregate", () => {
  let fakeClock: FakeClock;
  let fakeIdGenerator: FakeIdGenerator;

  beforeEach(() => {
    fakeClock = new FakeClock(new Date("2024-01-01T00:00:00Z"));
    fakeIdGenerator = new FakeIdGenerator("user-");
  });

  describe("creation", () => {
    it("should create a new user with default values", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      
      expect(user.id.value).toBe("user-0");
      expect(user.email.value).toBe("test@example.com");
      expect(user.displayName.value).toBe("Test User");
      expect(user.roles).toHaveLength(1);
      expect(user.roles[0].value).toBe("user");
      expect(user.subscription).toBe("free");
      expect(user.status.value).toBe("pending_verification");
      expect(user.emailVerified).toBe(false);
      expect(user.isActive()).toBe(false);
    });

    it("should emit UserCreated event on creation", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserCreated);
      
      const eventPayload = (events[0] as UserCreated).payload;
      expect(eventPayload.userId).toBe("user-0");
      expect(eventPayload.email).toBe("test@example.com");
      expect(eventPayload.displayName).toBe("Test User");
    });

    it("should load from persistence", () => {
      const userId = UserId.create("user-123");
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const props = {
        id: userId,
        email,
        displayName,
        avatar: "avatar.jpg",
        roles: [UserRole.admin()],
        subscription: "premium",
        status: AccountStatus.active(),
        emailVerified: true,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-02T00:00:00Z"),
      };
      
      const user = UserAggregate.fromPersistence(props, fakeClock);
      
      expect(user.id.value).toBe("user-123");
      expect(user.subscription).toBe("premium");
      expect(user.status.value).toBe("active");
      expect(user.emailVerified).toBe(true);
    });
  });

  describe("changeDisplayName", () => {
    it("should change display name and emit UserUpdated event", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      (user as any).clearEvents();
      
      const newDisplayName = DisplayName.create("New Name");
      user.changeDisplayName(newDisplayName);
      
      expect(user.displayName.value).toBe("New Name");
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserUpdated);
      
      const eventPayload = (events[0] as UserUpdated).payload;
      expect(eventPayload.field).toBe("displayName");
      expect(eventPayload.oldValue).toBe("Test User");
      expect(eventPayload.newValue).toBe("New Name");
    });

    it("should not emit event if display name is unchanged", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      (user as any).clearEvents();
      
      user.changeDisplayName(displayName);
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe("changeAvatar", () => {
    it("should change avatar and emit UserUpdated event", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      (user as any).clearEvents();
      
      user.changeAvatar("new-avatar.jpg");
      
      expect(user.avatar).toBe("new-avatar.jpg");
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserUpdated);
      
      const eventPayload = (events[0] as UserUpdated).payload;
      expect(eventPayload.field).toBe("avatar");
      expect(eventPayload.oldValue).toBeUndefined();
      expect(eventPayload.newValue).toBe("new-avatar.jpg");
    });

    it("should not emit event if avatar is unchanged", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      user.changeAvatar("avatar.jpg");
      (user as any).clearEvents();
      
      user.changeAvatar("avatar.jpg");
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe("activate", () => {
    it("should activate user and emit events", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      (user as any).clearEvents();
      
      user.activate();
      
      expect(user.isActive()).toBe(true);
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(UserActivated);
      expect(events[1]).toBeInstanceOf(UserUpdated);
    });

    it("should not emit events if already active", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const props = {
        id: userId,
        email,
        displayName,
        roles: [UserRole.user()],
        subscription: "free",
        status: AccountStatus.active(),
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const user = UserAggregate.fromPersistence(props, fakeClock);
      (user as any).clearEvents();
      
      user.activate();
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe("deactivate", () => {
    it("should deactivate user and emit events", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const props = {
        id: userId,
        email,
        displayName,
        roles: [UserRole.user()],
        subscription: "free",
        status: AccountStatus.active(),
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const user = UserAggregate.fromPersistence(props, fakeClock);
      (user as any).clearEvents();
      
      user.deactivate("User request");
      
      expect(user.isActive()).toBe(false);
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(UserDeactivated);
      expect(events[1]).toBeInstanceOf(UserUpdated);
      
      const eventPayload = (events[0] as UserDeactivated).payload;
      expect(eventPayload.reason).toBe("User request");
    });

    it("should not emit events if already inactive", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const props = {
        id: userId,
        email,
        displayName,
        roles: [UserRole.user()],
        subscription: "free",
        status: AccountStatus.inactive(),
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const user = UserAggregate.fromPersistence(props, fakeClock);
      (user as any).clearEvents();
      
      user.deactivate();
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe("assignRole", () => {
    it("should assign role and emit RoleAssigned event", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      (user as any).clearEvents();
      
      user.assignRole(UserRole.admin());
      
      expect(user.roles).toHaveLength(2);
      expect(user.hasRole(UserRole.admin())).toBe(true);
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(RoleAssigned);
      
      const eventPayload = (events[0] as RoleAssigned).payload;
      expect(eventPayload.role).toBe("admin");
    });

    it("should not emit event if role already assigned", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      user.assignRole(UserRole.admin());
      (user as any).clearEvents();
      
      user.assignRole(UserRole.admin());
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe("removeRole", () => {
    it("should remove role and emit UserUpdated event", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      user.assignRole(UserRole.admin());
      (user as any).clearEvents();
      
      user.removeRole(UserRole.admin());
      
      expect(user.roles).toHaveLength(1);
      expect(user.hasRole(UserRole.admin())).toBe(false);
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserUpdated);
    });

    it("should not emit event if role not found", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      (user as any).clearEvents();
      
      user.removeRole(UserRole.admin());
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe("changeSubscription", () => {
    it("should change subscription and emit events", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      (user as any).clearEvents();
      
      user.changeSubscription("premium");
      
      expect(user.subscription).toBe("premium");
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(SubscriptionChanged);
      expect(events[1]).toBeInstanceOf(UserUpdated);
    });

    it("should not emit events if subscription unchanged", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      user.changeSubscription("premium");
      (user as any).clearEvents();
      
      user.changeSubscription("premium");
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe("verifyEmail", () => {
    it("should verify email and emit events", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      (user as any).clearEvents();
      
      user.verifyEmail();
      
      expect(user.emailVerified).toBe(true);
      expect(user.isActive()).toBe(true);
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(EmailVerified);
      expect(events[1]).toBeInstanceOf(UserUpdated);
    });

    it("should not emit events if already verified", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const props = {
        id: userId,
        email,
        displayName,
        roles: [UserRole.user()],
        subscription: "free",
        status: AccountStatus.active(),
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const user = UserAggregate.fromPersistence(props, fakeClock);
      (user as any).clearEvents();
      
      user.verifyEmail();
      
      const events = (user as any).pullEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe("hasRole", () => {
    it("should return true if user has role", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      user.assignRole(UserRole.admin());
      
      expect(user.hasRole(UserRole.admin())).toBe(true);
      expect(user.hasRole(UserRole.user())).toBe(true);
    });

    it("should return false if user does not have role", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      
      expect(user.hasRole(UserRole.admin())).toBe(false);
    });
  });

  describe("isActive", () => {
    it("should return true if status is active", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const props = {
        id: userId,
        email,
        displayName,
        roles: [UserRole.user()],
        subscription: "free",
        status: AccountStatus.active(),
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const user = UserAggregate.fromPersistence(props, fakeClock);
      
      expect(user.isActive()).toBe(true);
    });

    it("should return false if status is not active", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      
      expect(user.isActive()).toBe(false);
    });
  });

  describe("toPersistence", () => {
    it("should return persistence props", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      
      const props = user.toPersistence();
      
      expect(props.id).toEqual(userId);
      expect(props.email).toEqual(email);
      expect(props.displayName).toEqual(displayName);
      expect(props.subscription).toBe("free");
      expect(props.status.value).toBe("pending_verification");
    });
  });

  describe("immutability", () => {
    it("should return copy of roles array", () => {
      const userId = UserId.create(fakeIdGenerator.generate());
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      
      const user = UserAggregate.create(userId, email, displayName, fakeClock);
      
      const roles1 = user.roles;
      const roles2 = user.roles;
      
      expect(roles1).not.toBe(roles2);
    });
  });
});
