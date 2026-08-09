/**
 * Knowledge Graph RH Runtime v2
 * HasSkill Edge Builder
 * Builds HAS_SKILL edges from Candidate to Skill
 */

import { Edge, EdgeType } from '../graph-types';
import {
  BaseEdgeBuilder,
  EdgeData,
  EdgeBuildOptions,
} from './base.edge-builder';

export interface HasSkillData extends EdgeData {
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience?: number;
  verified?: boolean;
}

export class HasSkillEdgeBuilder extends BaseEdgeBuilder {
  constructor() {
    super(EdgeType.HAS_SKILL);
  }

  override build(data: HasSkillData, options: EdgeBuildOptions = {}): Edge {
    const weight = options.weight ?? this.calculateWeight(data);
    const confidence = options.confidence ?? this.calculateConfidence(data);
    const reason = options.reason ?? this.generateReason(data);

    const now = new Date();
    return {
      id: this.generateId(data.sourceNodeId, data.targetNodeId),
      type: this.edgeType,
      sourceNode: data.sourceNodeId,
      targetNode: data.targetNodeId,
      weight,
      confidence,
      reason,
      metadata: options.metadata ?? {},
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: {
        createdBy: 'HasSkillEdgeBuilder',
        algorithmVersion: '1.0.0',
      },
    };
  }

  calculateWeight(
    data: HasSkillData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number {
    let weight = 0.5;

    // Boost weight based on skill level
    if (data.skillLevel === 'expert') {
      weight += 0.3;
    } else if (data.skillLevel === 'advanced') {
      weight += 0.2;
    } else if (data.skillLevel === 'intermediate') {
      weight += 0.1;
    }

    // Boost weight based on years of experience
    if (data.yearsExperience && data.yearsExperience > 0) {
      weight += Math.min(0.2, data.yearsExperience * 0.02);
    }

    // Boost weight if verified
    if (data.verified) {
      weight += 0.1;
    }

    return Math.min(1.0, weight);
  }

  calculateConfidence(
    data: HasSkillData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number {
    let confidence = 0.5;

    // Base confidence from data completeness
    if (data.skillLevel) {
      confidence += 0.15;
    }
    if (data.yearsExperience && data.yearsExperience > 0) {
      confidence += 0.15;
    }
    if (data.verified) {
      confidence += 0.2;
    }

    return Math.min(1.0, confidence);
  }

  generateReason(
    data: HasSkillData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): string {
    const parts: string[] = ['Candidate possesses this skill'];

    if (data.skillLevel) {
      parts.push(`at ${data.skillLevel} level`);
    }

    if (data.yearsExperience && data.yearsExperience > 0) {
      parts.push(`with ${data.yearsExperience} years of experience`);
    }

    if (data.verified) {
      parts.push('(verified)');
    }

    return parts.join(' ') + '.';
  }

  parseHasSkillData(data: unknown): HasSkillData {
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const skillLevel = this.extractSkillLevel(obj);
      const yearsExperience = this.extractNumber(obj, 'yearsExperience');
      const verified = this.extractBoolean(obj, 'verified');

      const result: HasSkillData = {
        sourceNodeId: this.extractString(obj, 'sourceNodeId'),
        targetNodeId: this.extractString(obj, 'targetNodeId'),
      };

      if (skillLevel !== undefined) {
        result.skillLevel = skillLevel;
      }
      if (yearsExperience !== undefined && yearsExperience > 0) {
        result.yearsExperience = yearsExperience;
      }
      if (verified !== undefined) {
        result.verified = verified;
      }

      return result;
    }

    return {
      sourceNodeId: '',
      targetNodeId: '',
    };
  }

  private extractSkillLevel(
    obj: Record<string, unknown>,
  ): HasSkillData['skillLevel'] {
    const level = this.extractString(obj, 'skillLevel');
    const validLevels: HasSkillData['skillLevel'][] = [
      'beginner',
      'intermediate',
      'advanced',
      'expert',
    ];
    if (level && validLevels.includes(level as HasSkillData['skillLevel'])) {
      return level as HasSkillData['skillLevel'];
    }
    return undefined;
  }
}
