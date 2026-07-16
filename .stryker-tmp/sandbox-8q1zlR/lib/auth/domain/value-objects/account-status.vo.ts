// @ts-nocheck
export class AccountStatus {
  private constructor(public readonly value: string) {}

  static create(value: string): AccountStatus {
    const validStatuses = ["active", "inactive", "suspended", "pending_verification"];
    const normalized = value.toLowerCase();
    if (!validStatuses.includes(normalized)) {
      throw new Error(`Invalid account status: ${value}. Valid statuses are: ${validStatuses.join(", ")}`);
    }
    return new AccountStatus(normalized);
  }

  static active(): AccountStatus {
    return new AccountStatus("active");
  }

  static inactive(): AccountStatus {
    return new AccountStatus("inactive");
  }

  static suspended(): AccountStatus {
    return new AccountStatus("suspended");
  }

  static pendingVerification(): AccountStatus {
    return new AccountStatus("pending_verification");
  }

  isActive(): boolean {
    return this.value === "active";
  }

  isSuspended(): boolean {
    return this.value === "suspended";
  }

  isPendingVerification(): boolean {
    return this.value === "pending_verification";
  }

  equals(other: AccountStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
