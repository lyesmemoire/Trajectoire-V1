/**
 * Knowledge Graph RH Runtime v2
 * Skill Builder
 * Builds SKILL nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface SkillData {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience?: number;
  verified?: boolean;
  category?: string;
}

export class SkillBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.SKILL);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const skillData = this.parseSkillData(data);
    const metadata = {
      level: skillData.level,
      yearsExperience: skillData.yearsExperience,
      verified: skillData.verified,
      category: skillData.category,
      ...options.metadata,
    };

    return this.createBaseNode(skillData.name, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(skillData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const skillData = this.parseSkillData(data);
    let confidence = 0.5;

    // Base confidence from source
    const sourceWeights: Record<string, number> = {
      CV_PARSER: 0.7,
      JOB_EXTRACTOR: 0.75,
      MANUAL: 1.0,
      IMPORT: 0.6,
      UNKNOWN: 0.5,
    };
    confidence = sourceWeights[source || 'UNKNOWN'] || 0.5;

    // Boost confidence if skill is verified
    if (skillData.verified) {
      confidence += 0.2;
    }

    // Boost confidence based on experience level
    if (skillData.level === 'expert') {
      confidence += 0.1;
    } else if (skillData.level === 'advanced') {
      confidence += 0.05;
    }

    // Boost confidence if years of experience is provided
    if (skillData.yearsExperience && skillData.yearsExperience > 0) {
      confidence += Math.min(0.1, skillData.yearsExperience * 0.01);
    }

    return Math.min(1.0, confidence);
  }

  private parseSkillData(data: unknown): SkillData {
    if (typeof data === 'string') {
      return { name: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const level = this.extractLevel(obj);
      const verified = this.extractBoolean(obj, 'verified');
      const yearsExperience =
        this.extractNumber(obj, 'yearsExperience') ||
        this.extractNumber(obj, 'years');
      const category = this.extractString(obj, 'category');

      const result: SkillData = {
        name:
          this.extractString(obj, 'name') ||
          this.extractString(obj, 'skill') ||
          this.extractString(obj, 'label') ||
          '',
      };

      if (level !== undefined) {
        result.level = level;
      }
      if (verified !== undefined) {
        result.verified = verified;
      }
      if (yearsExperience !== undefined && yearsExperience > 0) {
        result.yearsExperience = yearsExperience;
      }
      if (category !== undefined && category !== '') {
        result.category = category;
      }

      return result;
    }

    return { name: '' };
  }

  private extractLevel(obj: Record<string, unknown>): SkillData['level'] {
    const level = this.extractString(obj, 'level');
    const validLevels: SkillData['level'][] = [
      'beginner',
      'intermediate',
      'advanced',
      'expert',
    ];
    if (level && validLevels.includes(level as SkillData['level'])) {
      return level as SkillData['level'];
    }
    return undefined;
  }

  private extractBoolean(
    obj: Record<string, unknown>,
    field: string,
  ): boolean | undefined {
    const value = obj[field];
    return typeof value === 'boolean' ? value : undefined;
  }
}
