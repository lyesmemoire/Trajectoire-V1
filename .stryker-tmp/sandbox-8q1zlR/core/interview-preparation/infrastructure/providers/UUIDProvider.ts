/**
 * UUIDProvider
 *
 * Infrastructure UUID provider.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY UUID generation abstraction.
 */
// @ts-nocheck


export interface IUUIDProvider {
  generate(): string;
}

export class UUIDProvider implements IUUIDProvider {
  generate(): string {
    return crypto.randomUUID();
  }
}

export class DeterministicUUIDProvider implements IUUIDProvider {
  private counter = 0;

  generate(): string {
    this.counter++;
    return `00000000-0000-0000-0000-${String(this.counter).padStart(12, "0")}`;
  }
}
