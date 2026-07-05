export class Email {
  private constructor(public readonly value: string) {}

  public static create(email: string): Email {
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new Error("Invalid email format");
    }
    return new Email(trimmed);
  }
}

export class UserId {
  private constructor(public readonly value: string) {}

  public static create(id: string): UserId {
    if (!id || id.trim().length === 0) {
      throw new Error("UserId cannot be empty");
    }
    return new UserId(id);
  }
}

export class DisplayName {
  private constructor(public readonly value: string) {}

  public static create(name: string): DisplayName {
    if (name.length > 100) {
      throw new Error("DisplayName too long");
    }
    return new DisplayName(name);
  }
}
