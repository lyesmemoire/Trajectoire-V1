/**
 * Base marker for domain services.
 * 
 * Domain services contain business logic that does not belong to a
 * single Entity or Aggregate, but operates across domain boundaries.
 * 
 * Examples:
 *   - CreditCalculator (pricing rules across plans)
 *   - InterviewScoring (scoring algorithms)
 *   - CVScoreCalculator (ATS score computation)
 * 
 * A Domain Service:
 *   - MUST NOT depend on infrastructure (Prisma, Stripe, Supabase, etc.)
 *   - MUST NOT perform I/O
 *   - CAN depend on Value Objects, Entities, and other Domain Services
 *   - CAN be injected into Use Cases
 * 
 * This file serves as the documentation and entry point for the
 * domain services convention.
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DomainService {}
