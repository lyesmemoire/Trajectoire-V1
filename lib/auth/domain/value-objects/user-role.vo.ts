export class UserRole {
  private constructor(public readonly value: string) {}

  static create(value: string): UserRole {
    const validRoles = ["user", "admin", "moderator", "premium"];
    const normalized = value.toLowerCase();
    if (!validRoles.includes(normalized)) {
      throw new Error(`Invalid role: ${value}. Valid roles are: ${validRoles.join(", ")}`);
    }
    return new UserRole(normalized);
  }

  static user(): UserRole {
    return new UserRole("user");
  }

  static admin(): UserRole {
    return new UserRole("admin");
  }

  static moderator(): UserRole {
    return new UserRole("moderator");
  }

  static premium(): UserRole {
    return new UserRole("premium");
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
