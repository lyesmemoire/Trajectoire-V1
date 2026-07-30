/**
 * Advanced Prompt Builder
 * Builds multi-layered prompts for AI interview generation
 * Layers: System, Persona, Rules, Context, Memory, Current State, Evaluation Rules
 */

import { z } from "zod";
import { RecruiterPersona, RecruiterPersonaType } from "@/domain/valueObjects/RecruiterPersona";
import { DifficultyLevelVO, DifficultyLevel } from "@/domain/valueObjects/DifficultyLevel";
import { ConversationPhase } from '@/domain/entities/ConversationState';
import { PersonalInfo, EmotionalState } from "@/domain/entities/ConversationState";

// Prompt Layer Types
export enum PromptLayer {
  SYSTEM = "system",
  PERSONA = "persona",
  RULES = "rules",
  COMPANY_CONTEXT = "company_context",
  JOB_DESCRIPTION = "job_description",
  CV_ANALYSIS = "cv_analysis",
  CONVERSATION_MEMORY = "conversation_memory",
  CURRENT_STATE = "current_state",
  CURRENT_QUESTION = "current_question",
  EVALUATION_RULES = "evaluation_rules",
  RESPONSE_FORMATTING = "response_formatting",
}

// Prompt Layer Content
export const PromptLayerContentSchema = z.object({
  layer: z.nativeEnum(PromptLayer),
  content: z.string(),
  priority: z.number().min(0).max(10).default(5),
  enabled: z.boolean().default(true),
});

export type PromptLayerContent = z.infer<typeof PromptLayerContentSchema>;

// Prompt Build Context
export interface PromptBuildContext {
  persona?: RecruiterPersonaType;
  difficulty?: DifficultyLevel;
  phase?: any;
  personalInfo?: PersonalInfo;
  emotionalState?: EmotionalState;
  jobTitle?: string;
  companyName?: string;
  jobDescription?: string;
  cvData?: any;
  conversationHistory?: Array<{ role: string; content: string }>;
  currentTopic?: string;
  evaluatedCompetencies?: string[];
  targetCompetencies?: string[];
  timeRemaining?: number;
  lastResponse?: string;
  lastResponseQuality?: number;
}

// Built Prompt Result
export interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
  layers: PromptLayerContent[];
  metadata: {
    tokenEstimate: number;
    buildTime: number;
    version: string;
  };
}

export class AdvancedPromptBuilder {
  private static instance: AdvancedPromptBuilder;
  private version = "1.0.0";

  private constructor() {}

  static getInstance(): AdvancedPromptBuilder {
    if (!AdvancedPromptBuilder.instance) {
      AdvancedPromptBuilder.instance = new AdvancedPromptBuilder();
    }
    return AdvancedPromptBuilder.instance;
  }

  /**
   * Build complete multi-layered prompt
   */
  buildPrompt(context: PromptBuildContext): BuiltPrompt {
    const startTime = Date.now();

    const layers: PromptLayerContent[] = [];

    // Layer 1: System Prompt (Base instructions)
    layers.push(this.buildSystemLayer(context));

    // Layer 2: Persona (Recruiter personality)
    if (context.persona) {
      layers.push(this.buildPersonaLayer(context.persona));
    }

    // Layer 3: Rules (Interview rules)
    layers.push(this.buildRulesLayer(context));

    // Layer 4: Company Context
    if (context.companyName) {
      layers.push(this.buildCompanyContextLayer(context));
    }

    // Layer 5: any Description
    if (context.jobDescription) {
      layers.push(this.buildJobDescriptionLayer(context));
    }

    // Layer 6: CV Analysis
    if (context.cvData) {
      layers.push(this.buildCVAnalysisLayer(context));
    }

    // Layer 7: Conversation Memory
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      layers.push(this.buildConversationMemoryLayer(context));
    }

    // Layer 8: Current State
    layers.push(this.buildCurrentStateLayer(context));

    // Layer 9: Current Question/Context
    if (context.lastResponse) {
      layers.push(this.buildCurrentQuestionLayer(context));
    }

    // Layer 10: Evaluation Rules
    layers.push(this.buildEvaluationRulesLayer(context));

    // Layer 11: Response Formatting
    layers.push(this.buildResponseFormattingLayer(context));

    // Combine layers into system prompt
    const systemPrompt = this.combineLayers(layers);

    // Build user prompt (if needed)
    const userPrompt = this.buildUserPrompt(context);

    const buildTime = Date.now() - startTime;
    const tokenEstimate = this.estimateTokens(systemPrompt + userPrompt);

    return {
      systemPrompt,
      userPrompt,
      layers,
      metadata: {
        tokenEstimate,
        buildTime,
        version: this.version,
      },
    };
  }

  /**
   * Build System Layer
   */
  private buildSystemLayer(context: PromptBuildContext): PromptLayerContent {
    return {
      layer: PromptLayer.SYSTEM,
      content: `You are an AI-powered professional interviewer conducting a job interview.
Your role is to assess the candidate's skills, experience, and fit for the position.
Maintain a professional, conversational tone throughout the interview.
Ask relevant, probing questions to evaluate the candidate thoroughly.
Listen carefully to responses and follow up appropriately.
Adapt your questioning based on the candidate's answers.
Keep the interview focused and within the allocated time.`,
      priority: 10,
      enabled: true,
    };
  }

  /**
   * Build Persona Layer
   */
  private buildPersonaLayer(personaType: RecruiterPersonaType): PromptLayerContent {
    const persona = RecruiterPersona.fromType(personaType);
    return {
      layer: PromptLayer.PERSONA,
      content: persona.getFullSystemPrompt(),
      priority: 9,
      enabled: true,
    };
  }

  /**
   * Build Rules Layer
   */
  private buildRulesLayer(context: PromptBuildContext): PromptLayerContent {
    const rules = [
      "Ask one question at a time",
      "Wait for the candidate's response before asking the next question",
      "Avoid leading questions that suggest the desired answer",
      "Probe for specific examples and details",
      "Maintain a balanced conversation (not too aggressive, not too passive)",
      "Adapt your questioning depth based on the candidate's responses",
      "Keep responses concise and focused",
      "Show genuine interest in the candidate's answers",
      "Avoid repeating questions already asked",
      "Manage time effectively to cover all necessary topics",
    ];

    if (context.phase) {
      rules.push(`Current interview phase: ${context.phase}`);
    }

    return {
      layer: PromptLayer.RULES,
      content: rules.join("\n"),
      priority: 8,
      enabled: true,
    };
  }

  /**
   * Build Company Context Layer
   */
  private buildCompanyContextLayer(context: PromptBuildContext): PromptLayerContent {
    return {
      layer: PromptLayer.COMPANY_CONTEXT,
      content: `Company: ${context.companyName}
Culture: Professional and innovative
Values: Excellence, collaboration, innovation, integrity
Team size: Medium-sized team with collaborative environment`,
      priority: 6,
      enabled: true,
    };
  }

  /**
   * Build any Description Layer
   */
  private buildJobDescriptionLayer(context: PromptBuildContext): PromptLayerContent {
    return {
      layer: PromptLayer.JOB_DESCRIPTION,
      content: `Position: ${context.jobTitle}
Requirements: Strong technical skills, problem-solving abilities, teamwork
Responsibilities: Develop and maintain software solutions, collaborate with cross-functional teams
Career path: Growth opportunities within the organization`,
      priority: 7,
      enabled: true,
    };
  }

  /**
   * Build CV Analysis Layer
   */
  private buildCVAnalysisLayer(context: PromptBuildContext): PromptLayerContent {
    // Simplified - would analyze actual CV data
    return {
      layer: PromptLayer.CV_ANALYSIS,
      content: `Candidate CV Analysis:
- Experience: ${context.cvData?.experience || "Not provided"}
- Education: ${context.cvData?.education || "Not provided"}
- Skills: ${context.cvData?.skills || "Not provided"}
- Projects: ${context.cvData?.projects || "Not provided"}`,
      priority: 5,
      enabled: true,
    };
  }

  /**
   * Build Conversation Memory Layer
   */
  private buildConversationMemoryLayer(context: PromptBuildContext): PromptLayerContent {
    const history = context.conversationHistory || [];
    const recentHistory = history.slice(-10); // Last 10 messages

    const memoryContent = recentHistory
      .map((msg, index) => {
        const role = msg.role === "assistant" ? "Interviewer" : "Candidate";
        return `${index + 1}. ${role}: ${msg.content}`;
      })
      .join("\n");

    return {
      layer: PromptLayer.CONVERSATION_MEMORY,
      content: `Recent conversation history:\n${memoryContent}`,
      priority: 7,
      enabled: true,
    };
  }

  /**
   * Build Current State Layer
   */
  private buildCurrentStateLayer(context: PromptBuildContext): PromptLayerContent {
    const stateInfo = [
      `Current phase: ${context.phase || ConversationPhase.INTRODUCTION}`,
      `Current topic: ${context.currentTopic || "Introduction"}`,
      `Evaluated competencies: ${context.evaluatedCompetencies?.join(", ") || "None"}`,
      `Target competencies: ${context.targetCompetencies?.join(", ") || "All"}`,
      `Time remaining: ${context.timeRemaining || "Unknown"} minutes`,
    ];

    if (context.emotionalState) {
      stateInfo.push(`Candidate emotional state: Stress ${context.emotionalState.stress}, Confidence ${context.emotionalState.confidence}`);
    }

    return {
      layer: PromptLayer.CURRENT_STATE,
      content: stateInfo.join("\n"),
      priority: 8,
      enabled: true,
    };
  }

  /**
   * Build Current Question Layer
   */
  private buildCurrentQuestionLayer(context: PromptBuildContext): PromptLayerContent {
    let content = "Generate the next interview question.";

    if (context.lastResponse) {
      content += `\n\nCandidate's last response:\n"${context.lastResponse}"`;
      
      if (context.lastResponseQuality !== undefined) {
        content += `\n\nResponse quality score: ${context.lastResponseQuality}/1.0`;
        if (context.lastResponseQuality < 0.6) {
          content += "\nConsider asking a follow-up question to get more details.";
        }
      }
    }

    if (context.currentTopic) {
      content += `\n\nCurrent topic: ${context.currentTopic}`;
    }

    return {
      layer: PromptLayer.CURRENT_QUESTION,
      content,
      priority: 9,
      enabled: true,
    };
  }

  /**
   * Build Evaluation Rules Layer
   */
  private buildEvaluationRulesLayer(context: PromptBuildContext): PromptLayerContent {
    const rules = [
      "Evaluate responses for: clarity, relevance, depth, examples, professionalism",
      "Look for STAR method (Situation, Task, Action, Result) in behavioral questions",
      "Assess technical depth in technical questions",
      "Evaluate communication skills and articulation",
      "Consider the candidate's enthusiasm and motivation",
      "Note any red flags or concerning areas",
    ];

    if (context.difficulty) {
      const difficulty = DifficultyLevelVO.fromType(context.difficulty);
      rules.push(`Expected depth: ${difficulty.expectedDepth}`);
      rules.push(`Question complexity: ${difficulty.questionComplexity}`);
    }

    return {
      layer: PromptLayer.EVALUATION_RULES,
      content: rules.join("\n"),
      priority: 6,
      enabled: true,
    };
  }

  /**
   * Build Response Formatting Layer
   */
  private buildResponseFormattingLayer(context: PromptBuildContext): PromptLayerContent {
    return {
      layer: PromptLayer.RESPONSE_FORMATTING,
      content: `Response format:
- Keep responses concise (2-3 sentences for questions, 1-2 sentences for acknowledgments)
- Use professional language
- Be direct and clear
- Avoid filler words and excessive politeness
- Match the tone to the persona
- End with a clear question or transition`,
      priority: 5,
      enabled: true,
    };
  }

  /**
   * Combine layers into system prompt
   */
  private combineLayers(layers: PromptLayerContent[]): string {
    // Sort by priority (highest first)
    const sortedLayers = layers
      .filter(layer => layer.enabled)
      .sort((a, b) => b.priority - a.priority);

    return sortedLayers
      .map(layer => {
        const header = `=== ${layer.layer.toUpperCase()} ===`;
        return `${header}\n${layer.content}`;
      })
      .join("\n\n");
  }

  /**
   * Build user prompt
   */
  private buildUserPrompt(context: PromptBuildContext): string {
    if (context.lastResponse) {
      return `Candidate's response: "${context.lastResponse}"\n\nGenerate your next response as the interviewer.`;
    }
    return "Generate the first interview question.";
  }

  /**
   * Estimate token count
   */
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Build prompt for specific action
   */
  buildPromptForAction(
    action: "first_question" | "next_question" | "follow_up" | "conclusion",
    context: PromptBuildContext
  ): BuiltPrompt {
    const basePrompt = this.buildPrompt(context);

    // Customize based on action
    switch (action) {
      case "first_question":
        basePrompt.systemPrompt += "\n\nThis is the FIRST question of the interview. Start with a warm greeting and an opening question.";
        break;
      case "follow_up":
        basePrompt.systemPrompt += "\n\nThis is a FOLLOW-UP question. Probe deeper into the candidate's last response to get more details.";
        break;
      case "conclusion":
        basePrompt.systemPrompt += "\n\nThis is the CONCLUSION of the interview. Thank the candidate and provide closing remarks.";
        break;
      case "next_question":
      default:
        // Use default behavior
        break;
    }

    return basePrompt;
  }

  /**
   * Enable/disable specific layer
   */
  setLayerEnabled(layer: PromptLayer, enabled: boolean): void {
    // This would modify the build logic to enable/disable layers
    // For now, this is a placeholder
  }

  /**
   * Get layer content
   */
  getLayerContent(layer: PromptLayer, context: PromptBuildContext): string {
    switch (layer) {
      case PromptLayer.SYSTEM:
        return this.buildSystemLayer(context).content;
      case PromptLayer.PERSONA:
        return context.persona ? this.buildPersonaLayer(context.persona).content : "";
      case PromptLayer.RULES:
        return this.buildRulesLayer(context).content;
      case PromptLayer.COMPANY_CONTEXT:
        return context.companyName ? this.buildCompanyContextLayer(context).content : "";
      case PromptLayer.JOB_DESCRIPTION:
        return context.jobDescription ? this.buildJobDescriptionLayer(context).content : "";
      case PromptLayer.CV_ANALYSIS:
        return context.cvData ? this.buildCVAnalysisLayer(context).content : "";
      case PromptLayer.CONVERSATION_MEMORY:
        return context.conversationHistory ? this.buildConversationMemoryLayer(context).content : "";
      case PromptLayer.CURRENT_STATE:
        return this.buildCurrentStateLayer(context).content;
      case PromptLayer.CURRENT_QUESTION:
        return this.buildCurrentQuestionLayer(context).content;
      case PromptLayer.EVALUATION_RULES:
        return this.buildEvaluationRulesLayer(context).content;
      case PromptLayer.RESPONSE_FORMATTING:
        return this.buildResponseFormattingLayer(context).content;
      default:
        return "";
    }
  }
}

export const advancedPromptBuilder = AdvancedPromptBuilder.getInstance();
