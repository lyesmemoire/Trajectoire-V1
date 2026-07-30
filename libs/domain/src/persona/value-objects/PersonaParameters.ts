/**
 * PersonaParameters - Value Object
 * 
 * Defines the behavioral parameters for an interviewer persona.
 * The persona engine produces ONLY parameters, never text responses.
 */

import { z } from 'zod';

export enum PersonaTone {
  WARM = 'warm',
  NEUTRAL = 'neutral',
  DIRECT = 'direct',
  INCISIVE = 'incisive',
}

export enum PersonaEnergy {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
}

export enum FollowupStrategy {
  NONE = 'none',
  CLARIFYING = 'clarifying',
  PROBING = 'probing',
  CHALLENGING = 'challenging',
  VALIDATING = 'validating',
}

export interface PersonaParameters {
  // Core personality
  warmth: number; // 0-10: How warm and supportive the interviewer is
  pressure: number; // 0-10: Intensity of pressure applied
  aggressiveness: number; // 0-10: How confrontational the interviewer is
  
  // Communication style
  verbosity: number; // 0-10: Length of responses
  interruptions: number; // 0-10: Frequency of interruptions
  thinkingTime: number; // 0-10: Simulated thinking time before responding
  tone: PersonaTone;
  energy: PersonaEnergy;
  
  // Question strategy
  followupStrategy: FollowupStrategy;
  followupDepth: number; // 0-5: Depth of follow-up questions
  technicalFocus: number; // 0-10: Weight of technical questions
  
  // Behavioral traits
  humor: number; // 0-10: Use of humor
  curiosity: number; // 0-10: Interest in candidate's background
  empathy: number; // 0-10: Emotional intelligence
  
  // Constraints
  maxResponseLength: number; // Maximum words per response
  minResponseLength: number; // Minimum words per response
  allowedInterruptions: boolean;
  interruptionThreshold: number; // Seconds before interruption allowed
}

export interface PersonaConfig {
  id: string;
  name: string;
  description: string;
  defaultParameters: PersonaParameters;
  allowedVariations: Partial<PersonaParameters>[];
}

export const PersonaParametersSchema = z.object({
  warmth: z.number().min(0).max(10),
  pressure: z.number().min(0).max(10),
  aggressiveness: z.number().min(0).max(10),
  verbosity: z.number().min(0).max(10),
  interruptions: z.number().min(0).max(10),
  thinkingTime: z.number().min(0).max(10),
  tone: z.enum(['warm', 'neutral', 'direct', 'incisive']),
  energy: z.enum(['low', 'moderate', 'high']),
  followupStrategy: z.enum(['none', 'clarifying', 'probing', 'challenging', 'validating']),
  followupDepth: z.number().min(0).max(5),
  technicalFocus: z.number().min(0).max(10),
  humor: z.number().min(0).max(10),
  curiosity: z.number().min(0).max(10),
  empathy: z.number().min(0).max(10),
  maxResponseLength: z.number().min(10),
  minResponseLength: z.number().min(5),
  allowedInterruptions: z.boolean(),
  interruptionThreshold: z.number().min(0),
});

export const PersonaConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  defaultParameters: PersonaParametersSchema,
  allowedVariations: z.array(PersonaParametersSchema.partial()),
});

// Predefined personas
export const PREDEFINED_PERSONAS: Record<string, PersonaConfig> = {
  supportive: {
    id: 'persona-supportive',
    name: 'Supportive',
    description: 'Warm and encouraging interviewer, good for junior candidates',
    defaultParameters: {
      warmth: 8,
      pressure: 2,
      aggressiveness: 1,
      verbosity: 7,
      interruptions: 2,
      thinkingTime: 3,
      tone: PersonaTone.WARM,
      energy: PersonaEnergy.MODERATE,
      followupStrategy: FollowupStrategy.CLARIFYING,
      followupDepth: 1,
      technicalFocus: 3,
      humor: 4,
      curiosity: 7,
      empathy: 9,
      maxResponseLength: 50,
      minResponseLength: 15,
      allowedInterruptions: true,
      interruptionThreshold: 5,
    },
    allowedVariations: [
      { warmth: 9, pressure: 1 },
      { warmth: 7, pressure: 3 },
    ],
  },
  neutral: {
    id: 'persona-neutral',
    name: 'Neutral',
    description: 'Balanced interviewer, standard corporate style',
    defaultParameters: {
      warmth: 5,
      pressure: 5,
      aggressiveness: 3,
      verbosity: 6,
      interruptions: 4,
      thinkingTime: 4,
      tone: PersonaTone.NEUTRAL,
      energy: PersonaEnergy.MODERATE,
      followupStrategy: FollowupStrategy.PROBING,
      followupDepth: 2,
      technicalFocus: 5,
      humor: 3,
      curiosity: 5,
      empathy: 5,
      maxResponseLength: 60,
      minResponseLength: 20,
      allowedInterruptions: true,
      interruptionThreshold: 3,
    },
    allowedVariations: [
      { warmth: 6, pressure: 4 },
      { warmth: 4, pressure: 6 },
    ],
  },
  challenging: {
    id: 'persona-challenging',
    name: 'Challenging',
    description: 'Direct and demanding interviewer, tests senior candidates',
    defaultParameters: {
      warmth: 3,
      pressure: 8,
      aggressiveness: 6,
      verbosity: 5,
      interruptions: 7,
      thinkingTime: 2,
      tone: PersonaTone.DIRECT,
      energy: PersonaEnergy.HIGH,
      followupStrategy: FollowupStrategy.CHALLENGING,
      followupDepth: 3,
      technicalFocus: 7,
      humor: 2,
      curiosity: 6,
      empathy: 3,
      maxResponseLength: 70,
      minResponseLength: 25,
      allowedInterruptions: true,
      interruptionThreshold: 2,
    },
    allowedVariations: [
      { pressure: 9, aggressiveness: 7 },
      { pressure: 7, aggressiveness: 5 },
    ],
  },
  technical_lead: {
    id: 'persona-technical-lead',
    name: 'Technical Lead',
    description: 'Highly technical interviewer, focuses on depth',
    defaultParameters: {
      warmth: 4,
      pressure: 6,
      aggressiveness: 5,
      verbosity: 6,
      interruptions: 5,
      thinkingTime: 3,
      tone: PersonaTone.DIRECT,
      energy: PersonaEnergy.HIGH,
      followupStrategy: FollowupStrategy.PROBING,
      followupDepth: 4,
      technicalFocus: 10,
      humor: 2,
      curiosity: 8,
      empathy: 4,
      maxResponseLength: 80,
      minResponseLength: 30,
      allowedInterruptions: true,
      interruptionThreshold: 2,
    },
    allowedVariations: [
      { technicalFocus: 9, followupDepth: 3 },
      { technicalFocus: 10, followupDepth: 5 },
    ],
  },
  engineering_manager: {
    id: 'persona-engineering-manager',
    name: 'Engineering Manager',
    description: 'Balanced technical and behavioral focus',
    defaultParameters: {
      warmth: 5,
      pressure: 5,
      aggressiveness: 4,
      verbosity: 6,
      interruptions: 4,
      thinkingTime: 4,
      tone: PersonaTone.NEUTRAL,
      energy: PersonaEnergy.MODERATE,
      followupStrategy: FollowupStrategy.VALIDATING,
      followupDepth: 3,
      technicalFocus: 6,
      humor: 3,
      curiosity: 7,
      empathy: 6,
      maxResponseLength: 65,
      minResponseLength: 25,
      allowedInterruptions: true,
      interruptionThreshold: 3,
    },
    allowedVariations: [
      { technicalFocus: 5, warmth: 6 },
      { technicalFocus: 7, warmth: 4 },
    ],
  },
  hr: {
    id: 'persona-hr',
    name: 'HR',
    description: 'Culture and behavioral focus',
    defaultParameters: {
      warmth: 7,
      pressure: 3,
      aggressiveness: 2,
      verbosity: 7,
      interruptions: 2,
      thinkingTime: 4,
      tone: PersonaTone.WARM,
      energy: PersonaEnergy.MODERATE,
      followupStrategy: FollowupStrategy.CLARIFYING,
      followupDepth: 2,
      technicalFocus: 2,
      humor: 5,
      curiosity: 8,
      empathy: 9,
      maxResponseLength: 55,
      minResponseLength: 20,
      allowedInterruptions: false,
      interruptionThreshold: 10,
    },
    allowedVariations: [
      { warmth: 8, pressure: 2 },
      { warmth: 6, pressure: 4 },
    ],
  },
  startup_founder: {
    id: 'persona-startup-founder',
    name: 'Startup Founder',
    description: 'Fast-paced, direct, results-oriented',
    defaultParameters: {
      warmth: 4,
      pressure: 9,
      aggressiveness: 7,
      verbosity: 5,
      interruptions: 8,
      thinkingTime: 1,
      tone: PersonaTone.INCISIVE,
      energy: PersonaEnergy.HIGH,
      followupStrategy: FollowupStrategy.CHALLENGING,
      followupDepth: 3,
      technicalFocus: 6,
      humor: 4,
      curiosity: 9,
      empathy: 4,
      maxResponseLength: 60,
      minResponseLength: 20,
      allowedInterruptions: true,
      interruptionThreshold: 1,
    },
    allowedVariations: [
      { pressure: 10, aggressiveness: 8 },
      { pressure: 8, aggressiveness: 6 },
    ],
  },
};
