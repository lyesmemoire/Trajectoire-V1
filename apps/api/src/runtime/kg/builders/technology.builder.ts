/**
 * Knowledge Graph RH Runtime v2
 * Technology Builder
 * Builds TECHNOLOGY nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface TechnologyData {
  name: string;
  category?: string;
  version?: string;
  yearsExperience?: number;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export class TechnologyBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.TECHNOLOGY);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const technologyData = this.parseTechnologyData(data);
    const metadata = {
      category: technologyData.category,
      version: technologyData.version,
      yearsExperience: technologyData.yearsExperience,
      proficiency: technologyData.proficiency,
      ...options.metadata,
    };

    return this.createBaseNode(technologyData.name, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(technologyData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const technologyData = this.parseTechnologyData(data);
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

    // Boost confidence if category is provided
    if (technologyData.category && technologyData.category !== '') {
      confidence += 0.05;
    }

    // Boost confidence if version is provided
    if (technologyData.version && technologyData.version !== '') {
      confidence += 0.1;
    }

    // Boost confidence based on proficiency
    if (technologyData.proficiency === 'expert') {
      confidence += 0.1;
    } else if (technologyData.proficiency === 'advanced') {
      confidence += 0.05;
    }

    // Boost confidence if years of experience is provided
    if (technologyData.yearsExperience && technologyData.yearsExperience > 0) {
      confidence += Math.min(0.1, technologyData.yearsExperience * 0.01);
    }

    return Math.min(1.0, confidence);
  }

  private parseTechnologyData(data: unknown): TechnologyData {
    if (typeof data === 'string') {
      return { name: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const category = this.extractString(obj, 'category');
      const version = this.extractString(obj, 'version');
      const yearsExperience = this.extractNumber(obj, 'yearsExperience');
      const proficiency = this.extractProficiency(obj);

      const result: TechnologyData = {
        name:
          this.extractString(obj, 'name') ||
          this.extractString(obj, 'technology') ||
          this.extractString(obj, 'tech') ||
          '',
      };

      if (category !== undefined && category !== '') {
        result.category = category;
      }
      if (version !== undefined && version !== '') {
        result.version = version;
      }
      if (yearsExperience !== undefined && yearsExperience > 0) {
        result.yearsExperience = yearsExperience;
      }
      if (proficiency !== undefined) {
        result.proficiency = proficiency;
      }

      return result;
    }

    return { name: '' };
  }

  private extractProficiency(
    obj: Record<string, unknown>,
  ): TechnologyData['proficiency'] {
    const proficiency = this.extractString(obj, 'proficiency');
    const validLevels: TechnologyData['proficiency'][] = [
      'beginner',
      'intermediate',
      'advanced',
      'expert',
    ];
    if (
      proficiency &&
      validLevels.includes(proficiency as TechnologyData['proficiency'])
    ) {
      return proficiency as TechnologyData['proficiency'];
    }
    return undefined;
  }
}
