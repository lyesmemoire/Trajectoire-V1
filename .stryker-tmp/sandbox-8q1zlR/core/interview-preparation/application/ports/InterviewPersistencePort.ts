/**
 * InterviewPersistencePort
 *
 * Port interface for interview plan persistence.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY interface definition for persistence adapter.
 */
// @ts-nocheck


import { InterviewPlan } from "../../domain/entities/InterviewPlan";

export interface InterviewPersistencePort {
  /**
   * Save interview plan
   * @param plan - Interview plan to save
   * @returns Saved interview plan
   * @throws PersistenceError if save fails
   */
  save(plan: InterviewPlan): Promise<InterviewPlan>;

  /**
   * Load interview plan by ID
   * @param planId - Plan ID to load
   * @returns Loaded interview plan
   * @throws NotFoundError if plan not found
   */
  load(planId: string): Promise<InterviewPlan>;

  /**
   * Delete interview plan
   * @param planId - Plan ID to delete
   * @throws NotFoundError if plan not found
   */
  delete(planId: string): Promise<void>;

  /**
   * Find plans by candidate ID
   * @param candidateId - Candidate ID
   * @returns Array of interview plans
   */
  findByCandidate(candidateId: string): Promise<InterviewPlan[]>;

  /**
   * Find plans by job offer ID
   * @param jobOfferId - Job offer ID
   * @returns Array of interview plans
   */
  findByJobOffer(jobOfferId: string): Promise<InterviewPlan[]>;
}
