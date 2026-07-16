/**
 * SupabaseInterviewPersistenceAdapter
 *
 * Infrastructure adapter for interview plan persistence using Supabase.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY persistence implementation.
 */
// @ts-nocheck


import { InterviewPersistencePort } from "../../application/ports/InterviewPersistencePort";
import { InterviewPlan } from "../../domain/entities/InterviewPlan";
import { SupabaseClient } from "../clients/SupabaseClient";
import { RepositoryError } from "../errors/InfrastructureErrors";
import { InterviewPlanReconstructionFactory } from "../factories/InterviewPlanReconstructionFactory";
import { InterviewPlanDTO } from "../mappers/InterviewPlanMapper";

export class SupabaseInterviewPersistenceAdapter implements InterviewPersistencePort {
  private readonly reconstructionFactory: InterviewPlanReconstructionFactory;

  constructor(private readonly supabaseClient: SupabaseClient) {
    this.reconstructionFactory = new InterviewPlanReconstructionFactory();
  }

  async save(plan: InterviewPlan): Promise<InterviewPlan> {
    try {
      const planData = this.planToData(plan);

      const result = await this.supabaseClient.insert("interview_plans", planData);

      if (result.error) {
        throw new RepositoryError(`Failed to save interview plan: ${result.error.message}`);
      }

      return plan;
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError(`Failed to save interview plan: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async load(planId: string): Promise<InterviewPlan> {
    try {
      const result = await this.supabaseClient.select("interview_plans", { id: `eq.${planId}` });

      if (result.error) {
        throw new RepositoryError(`Failed to load interview plan: ${result.error.message}`);
      }

      if (!result.data || result.data.length === 0) {
        throw new RepositoryError(`Interview plan not found: ${planId}`);
      }

      const planData = result.data[0] as Record<string, unknown>;
      const dto = this.dataToDTO(planData);
      return this.reconstructionFactory.reconstructFromDTO(dto);
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError(`Failed to load interview plan: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async delete(planId: string): Promise<void> {
    try {
      const result = await this.supabaseClient.delete("interview_plans", planId);

      if (result.error) {
        throw new RepositoryError(`Failed to delete interview plan: ${result.error.message}`);
      }
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError(`Failed to delete interview plan: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async findByCandidate(candidateId: string): Promise<InterviewPlan[]> {
    try {
      const result = await this.supabaseClient.select("interview_plans", { candidate_id: `eq.${candidateId}` });

      if (result.error) {
        throw new RepositoryError(`Failed to find interview plans: ${result.error.message}`);
      }

      if (!result.data) {
        return [];
      }

      return result.data.map((data) => {
        const dto = this.dataToDTO(data as Record<string, unknown>);
        return this.reconstructionFactory.reconstructFromDTO(dto);
      });
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError(`Failed to find interview plans: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async findByJobOffer(jobOfferId: string): Promise<InterviewPlan[]> {
    try {
      const result = await this.supabaseClient.select("interview_plans", { job_offer_id: `eq.${jobOfferId}` });

      if (result.error) {
        throw new RepositoryError(`Failed to find interview plans: ${result.error.message}`);
      }

      if (!result.data) {
        return [];
      }

      return result.data.map((data) => {
        const dto = this.dataToDTO(data as Record<string, unknown>);
        return this.reconstructionFactory.reconstructFromDTO(dto);
      });
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError(`Failed to find interview plans: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private planToData(plan: InterviewPlan): Record<string, unknown> {
    return {
      id: plan.getPlanId(),
      candidate_id: plan.getCandidateId(),
      job_offer_id: plan.getJobOfferId(),
      matching_id: plan.getMatchingId(),
      objective: JSON.stringify({
        primaryGoal: plan.getObjective().getPrimaryGoal(),
        secondaryGoals: plan.getObjective().getSecondaryGoals(),
      }),
      constraints: JSON.stringify({
        maxTotalDuration: plan.getConstraints().getMaxTotalDuration(),
        maxQuestionsPerSection: plan.getConstraints().getMaxQuestionsPerSection(),
        maxTotalQuestions: plan.getConstraints().getMaxTotalQuestions(),
        minSoftSkillQuestions: plan.getConstraints().getMinSoftSkillQuestions(),
        minHardSkillQuestions: plan.getConstraints().getMinHardSkillQuestions(),
        maxDifficulty: plan.getConstraints().getMaxDifficulty(),
        minDifficulty: plan.getConstraints().getMinDifficulty(),
        mandatoryCompetencies: plan.getConstraints().getMandatoryCompetencies(),
        forbiddenTopics: plan.getConstraints().getForbiddenTopics(),
      }),
      status: plan.getStatus(),
      created_at: plan.getCreatedAt().toISOString(),
      updated_at: plan.getUpdatedAt().toISOString(),
      sections: JSON.stringify(plan.getSections().map((s) => ({
        id: s.getSectionId(),
        planId: s.getPlanId(),
        name: s.getName(),
        description: s.getDescription(),
        objective: s.getObjective(),
        order: s.getOrder(),
        isMandatory: s.isSectionMandatory(),
        minQuestions: s.getMinQuestions(),
        maxQuestions: s.getMaxQuestions(),
      }))),
      summary: JSON.stringify({
        totalQuestions: plan.getSummary().getTotalQuestions(),
        softSkillQuestions: plan.getSummary().getSoftSkillQuestions(),
        hardSkillQuestions: plan.getSummary().getHardSkillQuestions(),
        averageDifficulty: plan.getSummary().getAverageDifficulty(),
        estimatedDifficulty: plan.getSummary().getEstimatedDifficulty(),
      }),
    };
  }

  private dataToDTO(data: Record<string, unknown>): InterviewPlanDTO {
    return {
      id: data.id as string,
      candidateId: data.candidate_id as string,
      jobOfferId: data.job_offer_id as string,
      matchingId: data.matching_id as string,
      objective: JSON.parse(data.objective as string),
      constraints: JSON.parse(data.constraints as string),
      adaptiveRules: JSON.parse(data.adaptive_rules as string),
      status: data.status as string,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
      sections: JSON.parse(data.sections as string),
      summary: JSON.parse(data.summary as string),
      metadata: JSON.parse(data.metadata as string),
    };
  }

  private dataToPlan(_data: Record<string, unknown>): InterviewPlan {
    throw new RepositoryError("dataToPlan deprecated - use dataToDTO + reconstructionFactory");
  }
}
