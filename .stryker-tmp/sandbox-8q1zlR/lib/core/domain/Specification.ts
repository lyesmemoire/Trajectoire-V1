/**
 * Specification pattern for composable business rules.
 * 
 * Unlike Policy (which returns a simple boolean), Specification
 * supports composition via and/or/not and can be reused across
 * multiple aggregates, use cases, or queries.
 * 
 * Example:
 * ```ts
 * class HasActiveSubscription implements Specification<User> {
 *   isSatisfiedBy(user: User): boolean {
 *     return user.subscription?.isActive() ?? false;
 *   }
 * }
 * 
 * class HasSufficientCredits implements Specification<User> {
 *   constructor(private readonly required: number) {}
 *   isSatisfiedBy(user: User): boolean {
 *     return user.credits >= this.required;
 *   }
 * }
 * 
 * const canUseAI = new AndSpecification(
 *   new HasActiveSubscription(),
 *   new HasSufficientCredits(1)
 * );
 * ```
 */
// @ts-nocheck

export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class AndSpecification<T> implements Specification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }
}

export class OrSpecification<T> implements Specification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }
}

export class NotSpecification<T> implements Specification<T> {
  constructor(private readonly spec: Specification<T>) {}

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}
