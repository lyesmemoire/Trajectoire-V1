import { UseCase } from "../../../../lib/core/application/UseCase";
import { Result, ok, fail } from "../../../../lib/core/result";
import { InfrastructureError } from "../../../../lib/core/result/errors";
import { JourneyAggregate } from "../../domain/aggregates/journey.aggregate";
import { JourneyData } from "../../domain/entities/journey.entity";
import { CandidateJourneyWorkflow } from "../workflows/candidate-journey.workflow";
import { UploadCvInput } from "../../../../lib/cv/application/use-cases/upload/upload-cv.use-case";
import { UploadJobOfferInput } from "../../../../lib/jobs/application/use-cases/upload/upload-job-offer.use-case";
import { RewriteCvInput } from "../../../../lib/cv/application/use-cases/rewrite/rewrite-cv.use-case";
import { StartInterviewCommand } from "../../../../lib/interview/application/use-cases/start-interview/start-interview.use-case";
import { DomainEventPublisher } from "../../../../lib/core/runtime/event-publisher/DomainEventPublisher";
import { IdGenerator } from "../../../../lib/core/id/IdGenerator";
import { Clock } from "../../../../lib/core/clock/Clock";
import { JourneyRepositoryPort } from "../../ports/repositories/journey-repository.port";
import { CvRepositoryPort } from "../../../../lib/cv/ports/repositories/cv-repository.port";
import { CareerUpdateDTO } from "../../../../lib/career/application/dto/career-update.dto";
import { InterviewRepositoryPort } from "../../../../lib/interview/ports/interview-repository.port";

export interface StartJourneyInput {
  userId: string;
}

export interface UploadCvStepInput {
  file: Buffer;
  filename: string;
  mimeType: string;
}

export interface UploadJobOfferStepInput {
  description: string;
  source?: string;
  sourceType?: "URL_LINKEDIN" | "URL_INDEED" | "URL_WTTJ" | "RAW_TEXT";
}

export interface InterviewStepInput {
  jobTitle: string;
  jobDescription?: string;
  candidateSummary?: string;
}

export class JourneyUseCase extends UseCase<StartJourneyInput, { journeyId: string }> {
  constructor(
    private readonly journeyRepository: JourneyRepositoryPort,
    private readonly workflow: CandidateJourneyWorkflow,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
    private readonly cvRepository: CvRepositoryPort,
    private readonly interviewRepository: InterviewRepositoryPort
  ) {
    super();
  }

  protected async run(input: StartJourneyInput): Promise<Result<{ journeyId: string }>> {
    const journeyId = this.idGenerator.generate();
    const journey = JourneyAggregate.create(journeyId, input.userId, this.clock);

    const saveResult = await this.journeyRepository.save(journey);
    if (saveResult.isFailure()) return fail(saveResult.unwrapError());

    await this.eventPublisher.publishEventsFrom(journey);

    return ok({ journeyId });
  }

  async uploadCv(journeyId: string, input: UploadCvStepInput): Promise<Result<void>> {
    const journeyResult = await this.journeyRepository.findById(journeyId);
    if (journeyResult.isFailure()) return fail(journeyResult.unwrapError());
    const journey = journeyResult.unwrap();

    const uploadResult = await this.workflow.uploadCv(input);
    if (uploadResult.isFailure()) {
      journey.fail(uploadResult.unwrapError().message);
      await this.journeyRepository.save(journey);
      return fail(uploadResult.unwrapError());
    }

    journey.advanceToStep("CAREER_PROFILE", {
      cvId: uploadResult.unwrap().cvId,
      cvUrl: uploadResult.unwrap().url,
    });

    await this.journeyRepository.save(journey);
    await this.eventPublisher.publishEventsFrom(journey);

    return ok(undefined);
  }

  async updateCareerProfile(journeyId: string): Promise<Result<void>> {
    const journeyResult = await this.journeyRepository.findById(journeyId);
    if (journeyResult.isFailure()) return fail(journeyResult.unwrapError());
    const journey = journeyResult.unwrap();

    if (!journey.data.cvId) return fail(new InfrastructureError("CV not found"));

    const cvResult = await this.cvRepository.findById(journey.data.cvId);
    if (cvResult.isFailure()) return fail(cvResult.unwrapError());
    const cv = cvResult.unwrap();

    const profileExtraction = cv.props.metadata?.profileExtraction;
    if (!profileExtraction) {
      journey.advanceToStep("JOB_OFFER_IMPORT", {});
      await this.journeyRepository.save(journey);
      await this.eventPublisher.publishEventsFrom(journey);
      return ok(undefined);
    }

    journey.advanceToStep("JOB_OFFER_IMPORT", {
      profileExtraction: profileExtraction,
    });
    await this.journeyRepository.save(journey);
    await this.eventPublisher.publishEventsFrom(journey);

    return ok(undefined);
  }

  async uploadJobOffer(journeyId: string, input: UploadJobOfferStepInput): Promise<Result<void>> {
    const journeyResult = await this.journeyRepository.findById(journeyId);
    if (journeyResult.isFailure()) return fail(journeyResult.unwrapError());
    const journey = journeyResult.unwrap();

    const uploadResult = await this.workflow.uploadJobOffer(input);
    if (uploadResult.isFailure()) {
      journey.fail(uploadResult.unwrapError().message);
      await this.journeyRepository.save(journey);
      return fail(uploadResult.unwrapError());
    }

    journey.advanceToStep("ATS_ANALYSIS", {
      jobOfferId: uploadResult.unwrap().jobOfferId,
      jobOfferDescription: input.description,
    });

    await this.journeyRepository.save(journey);
    await this.eventPublisher.publishEventsFrom(journey);

    return ok(undefined);
  }

  async analyzeAts(journeyId: string, cvText: string): Promise<Result<void>> {
    const journeyResult = await this.journeyRepository.findById(journeyId);
    if (journeyResult.isFailure()) return fail(journeyResult.unwrapError());
    const journey = journeyResult.unwrap();

    const atsResult = await this.workflow.analyzeAts(cvText, journey.data.jobOfferDescription);

    if (atsResult.isFailure()) {
      journey.fail(atsResult.unwrapError().message);
      await this.journeyRepository.save(journey);
      return fail(atsResult.unwrapError());
    }

    journey.advanceToStep("CV_OPTIMIZATION", {
      atsAnalysisResult: atsResult.unwrap(),
    });

    await this.journeyRepository.save(journey);
    await this.eventPublisher.publishEventsFrom(journey);

    return ok(undefined);
  }

  async optimizeCv(journeyId: string): Promise<Result<void>> {
    const journeyResult = await this.journeyRepository.findById(journeyId);
    if (journeyResult.isFailure()) return fail(journeyResult.unwrapError());
    const journey = journeyResult.unwrap();

    if (!journey.data.cvId) return fail(new InfrastructureError("CV not found"));

    const atsResult = journey.data.atsAnalysisResult;
    if (!atsResult) return fail(new InfrastructureError("ATS analysis not found"));

    const context = `
ATS Score: ${atsResult.score}
Matched Keywords: ${atsResult.matchedKeywords.join(", ")}
Missing Keywords: ${atsResult.missingKeywords.join(", ")}
Strengths: ${atsResult.strengths.join(", ")}
Weaknesses: ${atsResult.weaknesses.join(", ")}
Recommendations: ${atsResult.recommendations.join(", ")}
Job Description: ${journey.data.jobOfferDescription || "N/A"}
    `.trim();

    const input: RewriteCvInput = {
      cvId: journey.data.cvId,
      action: "improve_experience",
      content: journey.data.jobOfferDescription || "",
      context,
    };

    const rewriteResult = await this.workflow.optimizeCv(input);

    if (rewriteResult.isFailure()) {
      journey.fail(rewriteResult.unwrapError().message);
      await this.journeyRepository.save(journey);
      return fail(rewriteResult.unwrapError());
    }

    journey.advanceToStep("INTERVIEW_SIMULATION", {
      optimizedCvId: journey.data.cvId,
      optimizedCvText: rewriteResult.unwrap(),
    });

    await this.journeyRepository.save(journey);
    await this.eventPublisher.publishEventsFrom(journey);

    return ok(undefined);
  }

  async startInterview(journeyId: string, input: InterviewStepInput): Promise<Result<void>> {
    const journeyResult = await this.journeyRepository.findById(journeyId);
    if (journeyResult.isFailure()) return fail(journeyResult.unwrapError());
    const journey = journeyResult.unwrap();

    const command: StartInterviewCommand = {
      userId: journey.userId,
      jobTitle: input.jobTitle,
      jobDescription: input.jobDescription,
      cvId: journey.data.cvId,
      candidateSummary: input.candidateSummary,
    };

    const startResult = await this.workflow.startInterview(command);

    if (startResult.isFailure()) {
      journey.fail(startResult.unwrapError().message);
      await this.journeyRepository.save(journey);
      return fail(startResult.unwrapError());
    }

    journey.advanceToStep("FINAL_REPORT", {
      interviewSessionId: startResult.unwrap().sessionId,
    });

    await this.journeyRepository.save(journey);
    await this.eventPublisher.publishEventsFrom(journey);

    return ok(undefined);
  }

  async generateFinalReport(journeyId: string): Promise<Result<void>> {
    const journeyResult = await this.journeyRepository.findById(journeyId);
    if (journeyResult.isFailure()) return fail(journeyResult.unwrapError());
    const journey = journeyResult.unwrap();

    if (!journey.data.interviewSessionId) return fail(new InfrastructureError("Interview session not found"));

    const interviewResult = await this.interviewRepository.findByCorrelationId(journey.data.interviewSessionId);
    if (interviewResult.isFailure()) return fail(interviewResult.unwrapError());
    const interview = interviewResult.unwrap();

    if (!interview) return fail(new InfrastructureError("Interview session not found"));

    const answers = interview.props.answers;
    const atsScore = journey.data.atsAnalysisResult?.score || 0;
    const matchedKeywords = journey.data.atsAnalysisResult?.matchedKeywords || [];
    const missingKeywords = journey.data.atsAnalysisResult?.missingKeywords || [];
    const jobDescription = journey.data.jobOfferDescription || "";

    const dimensionScores = {
      structure: this.calculateStructureScore(answers),
      specificity: this.calculateSpecificityScore(answers),
      impact: this.calculateImpactScore(answers),
      adaptability: this.calculateAdaptabilityScore(answers),
    };

    const overallScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 4;
    const readinessLevel = this.determineReadinessLevel(overallScore, atsScore);

    const strengths = this.identifyStrengths(answers, matchedKeywords);
    const developmentAreas = this.identifyDevelopmentAreas(answers, missingKeywords);
    const cvCoherence = this.analyzeCvCoherence(journey.data.profileExtraction, jobDescription);

    journey.complete({
      finalReport: {
        overall_assessment: this.generateOverallAssessment(overallScore, readinessLevel),
        dimension_scores: dimensionScores,
        strengths,
        development_areas: developmentAreas,
        cv_coherence: cvCoherence,
        readiness_level: readinessLevel,
      },
    });

    await this.journeyRepository.save(journey);
    await this.eventPublisher.publishEventsFrom(journey);

    return ok(undefined);
  }

  private calculateStructureScore(answers: Array<{ answer: any; analysis?: any }>): number {
    if (answers.length === 0) return 50;
    let score = 0;
    for (const { analysis } of answers) {
      if (analysis?.structureScore) score += analysis.structureScore;
    }
    return Math.min(100, Math.round(score / answers.length));
  }

  private calculateSpecificityScore(answers: Array<{ answer: any; analysis?: any }>): number {
    if (answers.length === 0) return 50;
    let score = 0;
    for (const { analysis } of answers) {
      if (analysis?.specificityScore) score += analysis.specificityScore;
    }
    return Math.min(100, Math.round(score / answers.length));
  }

  private calculateImpactScore(answers: Array<{ answer: any; analysis?: any }>): number {
    if (answers.length === 0) return 50;
    let score = 0;
    for (const { analysis } of answers) {
      if (analysis?.impactScore) score += analysis.impactScore;
    }
    return Math.min(100, Math.round(score / answers.length));
  }

  private calculateAdaptabilityScore(answers: Array<{ answer: any; analysis?: any }>): number {
    if (answers.length === 0) return 50;
    let score = 0;
    for (const { analysis } of answers) {
      if (analysis?.adaptabilityScore) score += analysis.adaptabilityScore;
    }
    return Math.min(100, Math.round(score / answers.length));
  }

  private determineReadinessLevel(interviewScore: number, atsScore: number): "NOT_READY" | "DEVELOPING" | "READY" | "EXCELLENT" {
    const combinedScore = (interviewScore + atsScore) / 2;
    if (combinedScore >= 85) return "EXCELLENT";
    if (combinedScore >= 70) return "READY";
    if (combinedScore >= 50) return "DEVELOPING";
    return "NOT_READY";
  }

  private identifyStrengths(answers: Array<{ answer: any; analysis?: any }>, matchedKeywords: string[]): string[] {
    const strengths: string[] = [];
    
    if (matchedKeywords.length > 5) {
      strengths.push(`Strong alignment with job requirements (${matchedKeywords.length} matched keywords)`);
    }

    for (const { analysis } of answers) {
      if (analysis?.strengths) {
        strengths.push(...analysis.strengths);
      }
    }

    return strengths.length > 0 ? strengths : ["Good communication skills", "Relevant experience"];
  }

  private identifyDevelopmentAreas(answers: Array<{ answer: any; analysis?: any }>, missingKeywords: string[]): Array<{ area: string; observation: string; recommendation: string }> {
    const areas: Array<{ area: string; observation: string; recommendation: string }> = [];

    if (missingKeywords.length > 0) {
      areas.push({
        area: "Keywords",
        observation: `Missing key terms: ${missingKeywords.slice(0, 3).join(", ")}`,
        recommendation: "Incorporate these keywords in your responses and CV",
      });
    }

    for (const { analysis } of answers) {
      if (analysis?.weaknesses) {
        areas.push(...analysis.weaknesses);
      }
    }

    return areas.length > 0 ? areas : [{
      area: "Structure",
      observation: "Could improve answer structure",
      recommendation: "Use STAR method (Situation, Task, Action, Result)",
    }];
  }

  private analyzeCvCoherence(profileExtraction: any, jobDescription: string): { is_coherent: boolean; discrepancies: string[] } {
    const discrepancies: string[] = [];

    if (!profileExtraction) {
      return { is_coherent: false, discrepancies: ["No profile extraction available"] };
    }

    const experiences = profileExtraction.experiences || [];
    const skills = profileExtraction.skills || [];

    if (experiences.length === 0) {
      discrepancies.push("No work experience found");
    }

    if (skills.length < 5) {
      discrepancies.push("Limited skills listed");
    }

    if (jobDescription && skills.length > 0) {
      const jobKeywords = jobDescription.toLowerCase().split(/\s+/);
      const matchedSkills = skills.filter((s: any) => jobKeywords.includes(s.name.toLowerCase()));
      if (matchedSkills.length < skills.length / 2) {
        discrepancies.push("Skills may not align with job description");
      }
    }

    return {
      is_coherent: discrepancies.length === 0,
      discrepancies,
    };
  }

  private generateOverallAssessment(score: number, readinessLevel: string): string {
    switch (readinessLevel) {
      case "EXCELLENT":
        return "Excellent preparation. Strong alignment with job requirements and demonstrated interview skills.";
      case "READY":
        return "Good preparation. Ready for interviews with minor improvements recommended.";
      case "DEVELOPING":
        return "Developing readiness. Focus on improving structure and specificity in responses.";
      case "NOT_READY":
        return "Additional preparation needed. Focus on key skills and interview techniques.";
      default:
        return "Interview completed successfully";
    }
  }

  async getJourney(journeyId: string): Promise<Result<JourneyAggregate>> {
    const journeyResult = await this.journeyRepository.findById(journeyId);
    if (journeyResult.isFailure()) return fail(journeyResult.unwrapError());
    return ok(journeyResult.unwrap());
  }
}
