/**
 * Knowledge Graph RH Runtime v2
 * Responsibility Builder
 * Builds RESPONSIBILITY nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface ResponsibilityData {
  description: string;
  context?: string;
  level?: string;
}

export class ResponsibilityBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.RESPONSIBILITY);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const responsibilityData = this.parseResponsibilityData(data);
    const metadata = {
      context: responsibilityData.context,
      level: responsibilityData.level,
      ...options.metadata,
    };

    return this.createBaseNode(responsibilityData.description, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(responsibilityData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const responsibilityData = this.parseResponsibilityData(data);
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

    // Boost confidence if description is detailed
    if (
      responsibilityData.description &&
      responsibilityData.description.length > 20
    ) {
      confidence += 0.15;
    }

    // Boost confidence if context is provided
    if (responsibilityData.context && responsibilityData.context !== '') {
      confidence += 0.1;
    }

    // Boost confidence if level is provided
    if (responsibilityData.level && responsibilityData.level !== '') {
      confidence += 0.05;
    }

    return Math.min(1.0, confidence);
  }

  private parseResponsibilityData(data: unknown): ResponsibilityData {
    if (typeof data === 'string') {
      return { description: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const context = this.extractString(obj, 'context');
      const level = this.extractString(obj, 'level');

      const result: ResponsibilityData = {
        description:
          this.extractString(obj, 'description') ||
          this.extractString(obj, 'responsibility') ||
          '',
      };

      if (context !== undefined && context !== '') {
        result.context = context;
      }
      if (level !== undefined && level !== '') {
        result.level = level;
      }

      return result;
    }

    return { description: '' };
  }
}
