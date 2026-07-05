import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";
import { UserId } from "../value-objects/user-id.vo";
import { Email } from "../value-objects/email.vo";
import { UserRole } from "../value-objects/user-role.vo";
import { AccountStatus } from "../value-objects/account-status.vo";
import { DisplayName } from "../value-objects/display-name.vo";
import { Clock } from "@/lib/core/clock/Clock";
import { IdGenerator } from "@/lib/core/id/IdGenerator";

// Domain Events
import { UserCreated } from "../events/user-created.event";
import { UserUpdated } from "../events/user-updated.event";
import { UserActivated } from "../events/user-activated.event";
import { UserDeactivated } from "../events/user-deactivated.event";
import { RoleAssigned } from "../events/role-assigned.event";
import { SubscriptionChanged } from "../events/subscription-changed.event";
import { EmailVerified } from "../events/email-verified.event";

interface UserProps {
  id: UserId;
  email: Email;
  displayName: DisplayName;
  avatar?: string;
  roles: UserRole[];
  subscription: string;
  status: AccountStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserAggregate extends AggregateRoot {
  private constructor(
    public readonly id: UserId,
    private _props: UserProps,
    private readonly clock: Clock
  ) {
    super();
  }

  static create(
    id: UserId,
    email: Email,
    displayName: DisplayName,
    clock: Clock
  ): UserAggregate {
    const now = clock.now();
    
    const aggregate = new UserAggregate(id, {
      id,
      email,
      displayName,
      roles: [UserRole.user()],
      subscription: "free",
      status: AccountStatus.pendingVerification(),
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    }, clock);

    aggregate.recordEvent(new UserCreated(id.value, {
      userId: id.value,
      email: email.value,
      displayName: displayName.value,
    }));

    return aggregate;
  }

  static fromPersistence(props: UserProps, clock: Clock): UserAggregate {
    return new UserAggregate(props.id, props, clock);
  }

  // Getters
  public get email(): Email {
    return this._props.email;
  }

  public get displayName(): DisplayName {
    return this._props.displayName;
  }

  public get avatar(): string | undefined {
    return this._props.avatar;
  }

  public get roles(): UserRole[] {
    return [...this._props.roles];
  }

  public get subscription(): string {
    return this._props.subscription;
  }

  public get status(): AccountStatus {
    return this._props.status;
  }

  public get emailVerified(): boolean {
    return this._props.emailVerified;
  }

  public get createdAt(): Date {
    return this._props.createdAt;
  }

  public get updatedAt(): Date {
    return this._props.updatedAt;
  }

  // Business Methods

  public changeDisplayName(newDisplayName: DisplayName): void {
    if (this._props.displayName.equals(newDisplayName)) {
      return;
    }

    const oldDisplayName = this._props.displayName.value;
    this._props.displayName = newDisplayName;
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new UserUpdated(this.id.value, {
      userId: this.id.value,
      field: "displayName",
      oldValue: oldDisplayName,
      newValue: newDisplayName.value,
    }));
  }

  public changeAvatar(newAvatar: string): void {
    if (this._props.avatar === newAvatar) {
      return;
    }

    const oldAvatar = this._props.avatar;
    this._props.avatar = newAvatar;
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new UserUpdated(this.id.value, {
      userId: this.id.value,
      field: "avatar",
      oldValue: oldAvatar,
      newValue: newAvatar,
    }));
  }

  public activate(): void {
    if (this._props.status.isActive()) {
      return;
    }

    const oldStatus = this._props.status.value;
    this._props.status = AccountStatus.active();
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new UserActivated(this.id.value, {
      userId: this.id.value,
    }));

    this.recordEvent(new UserUpdated(this.id.value, {
      userId: this.id.value,
      field: "status",
      oldValue: oldStatus,
      newValue: this._props.status.value,
    }));
  }

  public deactivate(reason?: string): void {
    if (this._props.status.value === "inactive") {
      return;
    }

    const oldStatus = this._props.status.value;
    this._props.status = AccountStatus.inactive();
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new UserDeactivated(this.id.value, {
      userId: this.id.value,
      reason,
    }));

    this.recordEvent(new UserUpdated(this.id.value, {
      userId: this.id.value,
      field: "status",
      oldValue: oldStatus,
      newValue: this._props.status.value,
    }));
  }

  public assignRole(role: UserRole): void {
    if (this._props.roles.some(r => r.equals(role))) {
      return;
    }

    this._props.roles.push(role);
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new RoleAssigned(this.id.value, {
      userId: this.id.value,
      role: role.value,
    }));
  }

  public removeRole(role: UserRole): void {
    const index = this._props.roles.findIndex(r => r.equals(role));
    if (index === -1) {
      return;
    }

    this._props.roles.splice(index, 1);
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new UserUpdated(this.id.value, {
      userId: this.id.value,
      field: "roles",
      oldValue: [role.value],
      newValue: this._props.roles.map(r => r.value),
    }));
  }

  public changeSubscription(newSubscription: string): void {
    if (this._props.subscription === newSubscription) {
      return;
    }

    const oldSubscription = this._props.subscription;
    this._props.subscription = newSubscription;
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new SubscriptionChanged(this.id.value, {
      userId: this.id.value,
      oldSubscription,
      newSubscription,
    }));

    this.recordEvent(new UserUpdated(this.id.value, {
      userId: this.id.value,
      field: "subscription",
      oldValue: oldSubscription,
      newValue: newSubscription,
    }));
  }

  public verifyEmail(): void {
    if (this._props.emailVerified) {
      return;
    }

    this._props.emailVerified = true;
    this._props.status = AccountStatus.active();
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new EmailVerified(this.id.value, {
      userId: this.id.value,
      email: this._props.email.value,
    }));

    this.recordEvent(new UserUpdated(this.id.value, {
      userId: this.id.value,
      field: "emailVerified",
      oldValue: false,
      newValue: true,
    }));
  }

  public hasRole(role: UserRole): boolean {
    return this._props.roles.some(r => r.equals(role));
  }

  public isActive(): boolean {
    return this._props.status.isActive();
  }

  public toPersistence(): UserProps {
    return {
      id: this._props.id,
      email: this._props.email,
      displayName: this._props.displayName,
      avatar: this._props.avatar,
      roles: this._props.roles,
      subscription: this._props.subscription,
      status: this._props.status,
      emailVerified: this._props.emailVerified,
      createdAt: this._props.createdAt,
      updatedAt: this._props.updatedAt,
    };
  }
}
