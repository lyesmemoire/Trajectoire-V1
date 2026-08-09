/**
 * Knowledge Graph RH Runtime v2
 * Experience Builder
 * Builds EXPERIENCE nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface ExperienceData {
  title: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  location?: string;
  responsibilities?: string[];
}

export class ExperienceBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.EXPERIENCE);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const experienceData = this.parseExperienceData(data);
    const metadata = {
      company: experienceData.company,
      startDate: experienceData.startDate,
      endDate: experienceData.endDate,
      current: experienceData.current,
      description: experienceData.description,
      location: experienceData.location,
      responsibilities: experienceData.responsibilities,
      ...options.metadata,
    };

    const label = this.buildLabel(experienceData);
    return this.createBaseNode(label, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(experienceData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const experienceData = this.parseExperienceData(data);
    let confidence = 0.5;

    // Base confidence from source
    const sourceWeights: Record<string, number> = {
      CV_PARSER: 0.75,
      JOB_EXTRACTOR: 0.8,
      MANUAL: 1.0,
      IMPORT: 0.65,
      UNKNOWN: 0.5,
    };
    confidence = sourceWeights[source || 'UNKNOWN'] || 0.5;

    // Boost confidence if company is provided
    if (experienceData.company && experienceData.company !== '') {
      confidence += 0.1;
    }

    // Boost confidence if dates are provided
    if (experienceData.startDate && experienceData.startDate !== '') {
      confidence += 0.05;
    }
    if (experienceData.endDate && experienceData.endDate !== '') {
      confidence += 0.05;
    }

    // Boost confidence if description is detailed
    if (experienceData.description && experienceData.description.length > 50) {
      confidence += 0.05;
    }

    // Boost confidence if responsibilities are listed
    if (
      experienceData.responsibilities &&
      experienceData.responsibilities.length > 0
    ) {
      confidence += 0.05;
    }

    return Math.min(1.0, confidence);
  }

  private parseExperienceData(data: unknown): ExperienceData {
    if (typeof data === 'string') {
      return { title: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const company = this.extractString(obj, 'company');
      const startDate = this.extractString(obj, 'startDate');
      const endDate = this.extractString(obj, 'endDate');
      const current = this.extractBoolean(obj, 'current');
      const description = this.extractString(obj, 'description');
      const location = this.extractString(obj, 'location');
      const responsibilities = this.extractArray<string>(
        obj,
        'responsibilities',
      );

      const result: ExperienceData = {
        title:
          this.extractString(obj, 'title') ||
          this.extractString(obj, 'position') ||
          this.extractString(obj, 'role') ||
          '',
      };

      if (company !== undefined && company !== '') {
        result.company = company;
      }
      if (startDate !== undefined && startDate !== '') {
        result.startDate = startDate;
      }
      if (endDate !== undefined && endDate !== '') {
        result.endDate = endDate;
      }
      if (current !== undefined) {
        result.current = current;
      }
      if (description !== undefined && description !== '') {
        result.description = description;
      }
      if (location !== undefined && location !== '') {
        result.location = location;
      }
      if (responsibilities !== undefined && responsibilities.length > 0) {
        result.responsibilities = responsibilities;
      }

      return result;
    }

    return { title: '' };
  }

  private buildLabel(data: ExperienceData): string {
    if (data.company) {
      return `${data.title} at ${data.company}`;
    }
    return data.title;
  }

  private extractBoolean(
    obj: Record<string, unknown>,
    field: string,
  ): boolean | undefined {
    const value = obj[field];
    return typeof value === 'boolean' ? value : undefined;
  }
}
