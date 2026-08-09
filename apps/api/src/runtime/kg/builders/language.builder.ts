/**
 * Knowledge Graph RH Runtime v2
 * Language Builder
 * Builds LANGUAGE nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface LanguageData {
  name: string;
  level?: 'basic' | 'conversational' | 'fluent' | 'native';
  certified?: boolean;
}

export class LanguageBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.LANGUAGE);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const languageData = this.parseLanguageData(data);
    const metadata = {
      level: languageData.level,
      certified: languageData.certified,
      ...options.metadata,
    };

    const label = this.buildLabel(languageData);
    return this.createBaseNode(label, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(languageData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const languageData = this.parseLanguageData(data);
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

    // Boost confidence if level is provided
    if (languageData.level) {
      confidence += 0.1;
    }

    // Boost confidence if certified
    if (languageData.certified) {
      confidence += 0.15;
    }

    return Math.min(1.0, confidence);
  }

  private parseLanguageData(data: unknown): LanguageData {
    if (typeof data === 'string') {
      return { name: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const level = this.extractLevel(obj);
      const certified = this.extractBoolean(obj, 'certified');

      const result: LanguageData = {
        name:
          this.extractString(obj, 'name') ||
          this.extractString(obj, 'language') ||
          '',
      };

      if (level !== undefined) {
        result.level = level;
      }
      if (certified !== undefined) {
        result.certified = certified;
      }

      return result;
    }

    return { name: '' };
  }

  private buildLabel(data: LanguageData): string {
    if (data.level) {
      return `${data.name} (${data.level})`;
    }
    return data.name;
  }

  private extractLevel(obj: Record<string, unknown>): LanguageData['level'] {
    const level = this.extractString(obj, 'level');
    const validLevels: LanguageData['level'][] = [
      'basic',
      'conversational',
      'fluent',
      'native',
    ];
    if (level && validLevels.includes(level as LanguageData['level'])) {
      return level as LanguageData['level'];
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
