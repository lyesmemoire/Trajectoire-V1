/**
 * Cache Keys
 * Centralized cache key definitions for consistent key naming
 */

export const CacheKeys = {
  // User Profile
  USER_PROFILE: (userId: string) => `user:${userId}:profile`,
  USER_CREDITS: (userId: string) => `user:${userId}:credits`,
  USER_SUBSCRIPTION: (userId: string) => `user:${userId}:subscription`,
  USER_STATISTICS: (userId: string) => `user:${userId}:statistics`,

  // System Prompts
  SYSTEM_PROMPT: (promptId: string) => `system_prompt:${promptId}`,
  SYSTEM_PROMPTS_LIST: "system_prompts:list",

  // CV Data
  CV_DATA: (cvId: string) => `cv:${cvId}:data`,
  CV_SECTIONS: (cvId: string) => `cv:${cvId}:sections`,

  // Interview
  INTERVIEW_DATA: (interviewId: string) => `interview:${interviewId}:data`,
  INTERVIEW_FEEDBACK: (interviewId: string) => `interview:${interviewId}:feedback`,

  // Career Paths
  CAREER_PATHS: "career:paths",
  CAREER_PATH: (pathId: string) => `career:path:${pathId}`,

  // Pricing
  PRICING_PLANS: "pricing:plans",
  PRICING_PLAN: (planId: string) => `pricing:plan:${planId}`,

  // AI Models
  AI_MODELS: "ai:models",
  AI_MODEL: (modelId: string) => `ai:model:${modelId}`,
} as const;
