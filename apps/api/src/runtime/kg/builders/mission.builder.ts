/**
 * Knowledge Graph RH Runtime v2
 * Mission Builder
 * Builds MISSION nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface MissionData {
  description: string;
  context?: string;
  startDate?: string;
  endDate?: string;
  achieved?: boolean;
}

export class MissionBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.MISSION);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const missionData = this.parseMissionData(data);
    const metadata = {
      context: missionData.context,
      startDate: missionData.startDate,
      endDate: missionData.endDate,
      achieved: missionData.achieved,
      ...options.metadata,
    };

    return this.createBaseNode(missionData.description, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(missionData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const missionData = this.parseMissionData(data);
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
    if (missionData.description && missionData.description.length > 20) {
      confidence += 0.1;
    }

    // Boost confidence if context is provided
    if (missionData.context && missionData.context !== '') {
      confidence += 0.1;
    }

    // Boost confidence if dates are provided
    if (missionData.startDate && missionData.startDate !== '') {
      confidence += 0.05;
    }
    if (missionData.endDate && missionData.endDate !== '') {
      confidence += 0.05;
    }

    // Boost confidence if achieved is marked
    if (missionData.achieved) {
      confidence += 0.05;
    }

    return Math.min(1.0, confidence);
  }

  private parseMissionData(data: unknown): MissionData {
    if (typeof data === 'string') {
      return { description: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const context = this.extractString(obj, 'context');
      const startDate = this.extractString(obj, 'startDate');
      const endDate = this.extractString(obj, 'endDate');
      const achieved = this.extractBoolean(obj, 'achieved');

      const result: MissionData = {
        description:
          this.extractString(obj, 'description') ||
          this.extractString(obj, 'mission') ||
          '',
      };

      if (context !== undefined && context !== '') {
        result.context = context;
      }
      if (startDate !== undefined && startDate !== '') {
        result.startDate = startDate;
      }
      if (endDate !== undefined && endDate !== '') {
        result.endDate = endDate;
      }
      if (achieved !== undefined) {
        result.achieved = achieved;
      }

      return result;
    }

    return { description: '' };
  }

  private extractBoolean(
    obj: Record<string, unknown>,
    field: string,
  ): boolean | undefined {
    const value = obj[field];
    return typeof value === 'boolean' ? value : undefined;
  }
}
