/**
 * CompetencyEvaluation - Value Object
 * 
 * Continuous evaluation of candidate competencies.
 * Evaluates in real-time, not just at the end.
 */

import { z } from 'zod';

export enum CompetencyName {
  LEADERSHIP = 'leadership',
  OWNERSHIP = 'ownership',
  COMMUNICATION = 'communication',
  ARCHITECTURE = 'architecture',
  ALGORITHMS = 'algorithms',
  PROBLEM_SOLVING = 'problem_solving',
  DEBUGGING = 'debugging',
  PRODUCT_SENSE = 'product_sense',
  MENTORING = 'mentoring',
  LEARNING = 'learning',
  CONFLICT = 'conflict',
  INFLUENCE = 'influence',
  DECISION_MAKING = 'decision_making',
  TECHNICAL_DEPTH = 'technical_depth',
  BUSINESS_IMPACT = 'business_impact',
}

export interface CompetencyScore {
  competency: CompetencyName;
  score: number; // 0-100
  confidence: number; // 0-100 (how confident we are in this score)
  evidence: Evidence[];
  lastUpdated: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
  weight: number; // Importance weight for this role
}

// Canonical Reference: BCM-OBJ-003 (blueprint.cognitive.evidence)
// Owner: Chief Cognitive Architect
export interface Evidence {
  id: string;
  type: 'statement' | 'behavior' | 'achievement' | 'failure';
  description: string;
  strength: 'positive' | 'negative' | 'neutral';
  impact: number; // -10 to +10
  timestamp: Date;
  context: string;
  verified: boolean;
}

export interface EvaluationSnapshot {
  sessionId: string;
  timestamp: Date;
  competencies: Record<CompetencyName, CompetencyScore>;
  overallScore: number;
  topStrengths: CompetencyName[];
  topWeaknesses: CompetencyName[];
  recommendations: string[];
}

export interface EvaluationCriteria {
  competency: CompetencyName;
  requiredLevel: number; // 0-100 minimum required
  weight: number; // 0-1 importance weight
  indicators: string[]; // What to look for
  redFlags: string[]; // Negative indicators
}

export const CompetencyScoreSchema = z.object({
  competency: z.enum([
    'leadership',
    'ownership',
    'communication',
    'architecture',
    'algorithms',
    'problem_solving',
    'debugging',
    'product_sense',
    'mentoring',
    'learning',
    'conflict',
    'influence',
    'decision_making',
    'technical_depth',
    'business_impact',
  ]),
  score: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  evidence: z.array(z.any()),
  lastUpdated: z.date(),
  trend: z.enum(['increasing', 'decreasing', 'stable']),
  weight: z.number().min(0).max(1),
});

export const EvaluationSnapshotSchema = z.object({
  sessionId: z.string().uuid(),
  timestamp: z.date(),
  competencies: z.record(z.string(), CompetencyScoreSchema),
  overallScore: z.number().min(0).max(100),
  topStrengths: z.array(z.string()),
  topWeaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
});

// Predefined evaluation criteria for different roles
export const ROLE_EVALUATION_CRITERIA: Record<string, EvaluationCriteria[]> = {
  senior_engineer: [
    {
      competency: CompetencyName.TECHNICAL_DEPTH,
      requiredLevel: 75,
      weight: 0.25,
      indicators: ['Deep technical knowledge', 'System design expertise', 'Code quality'],
      redFlags: ['Shallow understanding', 'Cannot explain trade-offs'],
    },
    {
      competency: CompetencyName.ARCHITECTURE,
      requiredLevel: 70,
      weight: 0.2,
      indicators: ['Scalable design', 'System thinking', 'Technology choices'],
      redFlags: ['No architectural thinking', 'Over-engineering'],
    },
    {
      competency: CompetencyName.PROBLEM_SOLVING,
      requiredLevel: 80,
      weight: 0.2,
      indicators: ['Structured approach', 'Creative solutions', 'Debugging skills'],
      redFlags: ['No systematic approach', 'Gives up easily'],
    },
    {
      competency: CompetencyName.COMMUNICATION,
      requiredLevel: 65,
      weight: 0.15,
      indicators: ['Clear explanations', 'Active listening', 'Technical communication'],
      redFlags: ['Cannot explain concepts', 'Poor articulation'],
    },
    {
      competency: CompetencyName.LEADERSHIP,
      requiredLevel: 60,
      weight: 0.1,
      indicators: ['Mentoring', 'Code reviews', 'Team collaboration'],
      redFlags: ['No leadership examples', 'Solo mindset'],
    },
    {
      competency: CompetencyName.OWNERSHIP,
      requiredLevel: 70,
      weight: 0.1,
      indicators: ['Takes responsibility', 'Delivers results', 'Proactive'],
      redFlags: ['Blames others', 'Passive attitude'],
    },
  ],
  engineering_manager: [
    {
      competency: CompetencyName.LEADERSHIP,
      requiredLevel: 85,
      weight: 0.25,
      indicators: ['Team building', 'Conflict resolution', 'Strategic thinking'],
      redFlags: ['No leadership experience', 'Poor conflict handling'],
    },
    {
      competency: CompetencyName.COMMUNICATION,
      requiredLevel: 80,
      weight: 0.2,
      indicators: ['Stakeholder management', 'Clear communication', 'Presentation skills'],
      redFlags: ['Poor communication', 'Cannot influence'],
    },
    {
      competency: CompetencyName.BUSINESS_IMPACT,
      requiredLevel: 75,
      weight: 0.2,
      indicators: ['Business understanding', 'ROI focus', 'Product thinking'],
      redFlags: ['No business context', 'Purely technical'],
    },
    {
      competency: CompetencyName.DECISION_MAKING,
      requiredLevel: 75,
      weight: 0.15,
      indicators: ['Data-driven decisions', 'Risk assessment', 'Decisiveness'],
      redFlags: ['Indecisive', 'Poor risk assessment'],
    },
    {
      competency: CompetencyName.TECHNICAL_DEPTH,
      requiredLevel: 60,
      weight: 0.1,
      indicators: ['Technical credibility', 'Architecture understanding'],
      redFlags: ['No technical background'],
    },
    {
      competency: CompetencyName.MENTORING,
      requiredLevel: 70,
      weight: 0.1,
      indicators: ['Coaching', 'Team development', 'Knowledge sharing'],
      redFlags: ['No mentoring experience'],
    },
  ],
  tech_lead: [
    {
      competency: CompetencyName.TECHNICAL_DEPTH,
      requiredLevel: 85,
      weight: 0.25,
      indicators: ['Expert knowledge', 'Code quality', 'Technical standards'],
      redFlags: ['Lacks expertise', 'Poor code quality'],
    },
    {
      competency: CompetencyName.ARCHITECTURE,
      requiredLevel: 80,
      weight: 0.2,
      indicators: ['System design', 'Scalability', 'Technical strategy'],
      redFlags: ['No architectural thinking'],
    },
    {
      competency: CompetencyName.LEADERSHIP,
      requiredLevel: 75,
      weight: 0.2,
      indicators: ['Technical leadership', 'Code reviews', 'Team guidance'],
      redFlags: ['No leadership experience'],
    },
    {
      competency: CompetencyName.MENTORING,
      requiredLevel: 70,
      weight: 0.15,
      indicators: ['Teaching', 'Knowledge sharing', 'Team growth'],
      redFlags: ['No mentoring examples'],
    },
    {
      competency: CompetencyName.PROBLEM_SOLVING,
      requiredLevel: 75,
      weight: 0.1,
      indicators: ['Debugging expertise', 'Systematic approach'],
      redFlags: ['Poor problem solving'],
    },
    {
      competency: CompetencyName.COMMUNICATION,
      requiredLevel: 65,
      weight: 0.1,
      indicators: ['Technical communication', 'Documentation'],
      redFlags: ['Poor communication'],
    },
  ],
};
