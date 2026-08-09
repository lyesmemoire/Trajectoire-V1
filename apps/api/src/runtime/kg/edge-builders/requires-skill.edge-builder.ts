/**
 * Knowledge Graph RH Runtime v2
 * RequiresSkill Edge Builder
 * Builds REQUIRES_SKILL edges from Job to Skill
 */

import { Edge, EdgeType } from '../graph-types';
import {
  BaseEdgeBuilder,
  EdgeData,
  EdgeBuildOptions,
} from './base.edge-builder';

export interface RequiresSkillData extends EdgeData {
  required?: boolean;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsRequired?: number;
  importance?: 'low' | 'medium' | 'high' | 'critical';
}

export class RequiresSkillEdgeBuilder extends BaseEdgeBuilder {
  constructor() {
    super(EdgeType.REQUIRES_SKILL);
  }

  override build(
    data: RequiresSkillData,
    options: EdgeBuildOptions = {},
  ): Edge {
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
        createdBy: 'RequiresSkillEdgeBuilder',
        algorithmVersion: '1.0.0',
      },
    };
  }

  calculateWeight(
    data: RequiresSkillData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number {
    let weight = 0.5;

    // Boost weight based on importance
    if (data.importance === 'critical') {
      weight += 0.35;
    } else if (data.importance === 'high') {
      weight += 0.25;
    } else if (data.importance === 'medium') {
      weight += 0.15;
    }

    // Boost weight based on proficiency required
    if (data.proficiency === 'expert') {
      weight += 0.15;
    } else if (data.proficiency === 'advanced') {
      weight += 0.1;
    }

    // Boost weight if required
    if (data.required) {
      weight += 0.1;
    }

    return Math.min(1.0, weight);
  }

  calculateConfidence(
    data: RequiresSkillData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number {
    let confidence = 0.5;

    // Base confidence from data completeness
    if (data.required !== undefined) {
      confidence += 0.15;
    }
    if (data.proficiency) {
      confidence += 0.15;
    }
    if (data.importance) {
      confidence += 0.1;
    }
    if (data.yearsRequired && data.yearsRequired > 0) {
      confidence += 0.1;
    }

    return Math.min(1.0, confidence);
  }

  generateReason(
    data: RequiresSkillData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): string {
    const parts: string[] = ['Job requires this skill'];

    if (data.required) {
      parts.push('(required)');
    } else {
      parts.push('(preferred)');
    }

    if (data.proficiency) {
      parts.push(`at ${data.proficiency} proficiency level`);
    }

    if (data.importance) {
      parts.push(`- ${data.importance} importance`);
    }

    if (data.yearsRequired && data.yearsRequired > 0) {
      parts.push(`(${data.yearsRequired} years required)`);
    }

    return parts.join(' ') + '.';
  }

  parseRequiresSkillData(data: unknown): RequiresSkillData {
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const required = this.extractBoolean(obj, 'required');
      const proficiency = this.extractProficiency(obj);
      const yearsRequired = this.extractNumber(obj, 'yearsRequired');
      const importance = this.extractImportance(obj);

      const result: RequiresSkillData = {
        sourceNodeId: this.extractString(obj, 'sourceNodeId'),
        targetNodeId: this.extractString(obj, 'targetNodeId'),
      };

      if (required !== undefined) {
        result.required = required;
      }
      if (proficiency !== undefined) {
        result.proficiency = proficiency;
      }
      if (yearsRequired !== undefined && yearsRequired > 0) {
        result.yearsRequired = yearsRequired;
      }
      if (importance !== undefined) {
        result.importance = importance;
      }

      return result;
    }

    return {
      sourceNodeId: '',
      targetNodeId: '',
    };
  }

  private extractProficiency(
    obj: Record<string, unknown>,
  ): RequiresSkillData['proficiency'] {
    const proficiency = this.extractString(obj, 'proficiency');
    const validLevels: RequiresSkillData['proficiency'][] = [
      'beginner',
      'intermediate',
      'advanced',
      'expert',
    ];
    if (
      proficiency &&
      validLevels.includes(proficiency as RequiresSkillData['proficiency'])
    ) {
      return proficiency as RequiresSkillData['proficiency'];
    }
    return undefined;
  }

  private extractImportance(
    obj: Record<string, unknown>,
  ): RequiresSkillData['importance'] {
    const importance = this.extractString(obj, 'importance');
    const validLevels: RequiresSkillData['importance'][] = [
      'low',
      'medium',
      'high',
      'critical',
    ];
    if (
      importance &&
      validLevels.includes(importance as RequiresSkillData['importance'])
    ) {
      return importance as RequiresSkillData['importance'];
    }
    return undefined;
  }
}
