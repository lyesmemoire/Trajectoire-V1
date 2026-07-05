import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { Email } from "../../domain/value-objects/email.vo";
import { UserRole } from "../../domain/value-objects/user-role.vo";
import { AccountStatus } from "../../domain/value-objects/account-status.vo";
import { DisplayName } from "../../domain/value-objects/display-name.vo";
import { Clock } from "@/lib/core/clock/Clock";

export interface UserPersistence {
  id: string;
  email: string;
  display_name: string;
  avatar: string | null;
  roles: string[];
  subscription: string;
  status: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export class UserMapper {
  static toDomain(persistence: UserPersistence, clock: Clock): UserAggregate {
    return UserAggregate.fromPersistence(
      {
        id: UserId.create(persistence.id),
        email: Email.create(persistence.email),
        displayName: DisplayName.create(persistence.display_name),
        avatar: persistence.avatar ?? undefined,
        roles: persistence.roles.map(r => UserRole.create(r)),
        subscription: persistence.subscription,
        status: AccountStatus.create(persistence.status),
        emailVerified: persistence.email_verified,
        createdAt: new Date(persistence.created_at),
        updatedAt: new Date(persistence.updated_at),
      },
      clock
    );
  }

  static toPersistence(aggregate: UserAggregate): UserPersistence {
    const props = aggregate.toPersistence();
    return {
      id: props.id.value,
      email: props.email.value,
      display_name: props.displayName.value,
      avatar: props.avatar ?? null,
      roles: props.roles.map(r => r.value),
      subscription: props.subscription,
      status: props.status.value,
      email_verified: props.emailVerified,
      created_at: props.createdAt.toISOString(),
      updated_at: props.updatedAt.toISOString(),
    };
  }
}
