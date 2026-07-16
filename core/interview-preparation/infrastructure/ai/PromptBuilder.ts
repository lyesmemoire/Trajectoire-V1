/**
 * PromptBuilder
 *
 * Infrastructure prompt builder for AI generation.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY prompt construction from domain objects.
 */

export interface PromptContext {
  candidateProfile: string;
  jobOfferProfile: string;
  matchingProfile: string;
  objective: string;
  constraints: string;
  customRequirements?: string[];
}

export class PromptBuilder {
  buildQuestionGenerationPrompt(context: PromptContext): string {
    const sections = [
      this.buildSystemPrompt(),
      this.buildCandidateSection(context.candidateProfile),
      this.buildJobOfferSection(context.jobOfferProfile),
      this.buildMatchingSection(context.matchingProfile),
      this.buildObjectiveSection(context.objective),
      this.buildConstraintsSection(context.constraints),
      this.buildCustomRequirementsSection(context.customRequirements),
      this.buildOutputFormat(),
    ];

    return sections.filter((s) => s.length > 0).join("\n\n");
  }

  buildEvaluationCriteriaPrompt(questionText: string): string {
    return [
      this.buildSystemPrompt(),
      "## Task",
      "Generate evaluation criteria for the following interview question.",
      "",
      "## Question",
      questionText,
      "",
      "## Output Format",
      "Return a JSON array of evaluation criteria strings.",
      "",
      "Example:",
      '["Clarity of explanation", "Technical accuracy", "Problem-solving approach"]',
    ].join("\n");
  }

  buildExpectedAnswerPrompt(questionText: string): string {
    return [
      this.buildSystemPrompt(),
      "## Task",
      "Generate expected answer structure for the following interview question.",
      "",
      "## Question",
      questionText,
      "",
      "## Output Format",
      "Return a JSON array of expected answer components.",
      "",
      "Example:",
      '["Introduction", "Main explanation", "Examples", "Conclusion"]',
    ].join("\n");
  }

  private buildSystemPrompt(): string {
    return [
      "You are an expert interview question generator for technical interviews.",
      "Your role is to generate high-quality, relevant interview questions based on candidate profiles, job requirements, and matching analysis.",
      "Ensure questions are appropriate for the candidate's skill level and cover the required competencies.",
    ].join("\n");
  }

  private buildCandidateSection(profile: string): string {
    return [
      "## Candidate Profile",
      profile,
    ].join("\n");
  }

  private buildJobOfferSection(profile: string): string {
    return [
      "## Job Offer Profile",
      profile,
    ].join("\n");
  }

  private buildMatchingSection(profile: string): string {
    return [
      "## Matching Analysis",
      profile,
    ].join("\n");
  }

  private buildObjectiveSection(objective: string): string {
    return [
      "## Interview Objective",
      objective,
    ].join("\n");
  }

  private buildConstraintsSection(constraints: string): string {
    return [
      "## Interview Constraints",
      constraints,
    ].join("\n");
  }

  private buildCustomRequirementsSection(requirements?: string[]): string {
    if (!requirements || requirements.length === 0) {
      return "";
    }

    return [
      "## Custom Requirements",
      ...requirements.map((r) => `- ${r}`),
    ].join("\n");
  }

  private buildOutputFormat(): string {
    return [
      "## Output Format",
      "Return a JSON object with the following structure:",
      "{",
      '  "questions": [',
      '    {',
      '      "id": "unique_id",',
      '      "text": "question text",',
      '      "type": "BEHAVIORAL|TECHNICAL|SITUATIONAL",',
      '      "difficulty": "EASY|MEDIUM|HARD",',
      '      "competency": "competency_name",',
      '      "skillLevel": "JUNIOR|MID_LEVEL|SENIOR|PRINCIPAL",',
      '      "expectedDuration": 5',
      '      "evaluationCriteria": ["criterion1", "criterion2"],',
      '      "expectedAnswerStructure": ["component1", "component2"]',
      '    }',
      "  ]",
      "}",
    ].join("\n");
  }
}
