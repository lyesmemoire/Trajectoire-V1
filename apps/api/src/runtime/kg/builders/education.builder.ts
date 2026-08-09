/**
 * Knowledge Graph RH Runtime v2
 * Education Builder
 * Builds EDUCATION nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface EducationData {
  degree: string;
  school?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  gpa?: number;
  description?: string;
}

export class EducationBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.EDUCATION);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const educationData = this.parseEducationData(data);
    const metadata = {
      school: educationData.school,
      field: educationData.field,
      startDate: educationData.startDate,
      endDate: educationData.endDate,
      current: educationData.current,
      gpa: educationData.gpa,
      description: educationData.description,
      ...options.metadata,
    };

    const label = this.buildLabel(educationData);
    return this.createBaseNode(label, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(educationData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const educationData = this.parseEducationData(data);
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

    // Boost confidence if school is provided
    if (educationData.school && educationData.school !== '') {
      confidence += 0.1;
    }

    // Boost confidence if field is provided
    if (educationData.field && educationData.field !== '') {
      confidence += 0.05;
    }

    // Boost confidence if dates are provided
    if (educationData.startDate && educationData.startDate !== '') {
      confidence += 0.05;
    }
    if (educationData.endDate && educationData.endDate !== '') {
      confidence += 0.05;
    }

    // Boost confidence if GPA is provided
    if (educationData.gpa !== undefined && educationData.gpa > 0) {
      confidence += 0.05;
    }

    return Math.min(1.0, confidence);
  }

  private parseEducationData(data: unknown): EducationData {
    if (typeof data === 'string') {
      return { degree: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const school = this.extractString(obj, 'school');
      const field = this.extractString(obj, 'field');
      const startDate = this.extractString(obj, 'startDate');
      const endDate = this.extractString(obj, 'endDate');
      const current = this.extractBoolean(obj, 'current');
      const gpa = this.extractNumber(obj, 'gpa');
      const description = this.extractString(obj, 'description');

      const result: EducationData = {
        degree:
          this.extractString(obj, 'degree') ||
          this.extractString(obj, 'diploma') ||
          this.extractString(obj, 'qualification') ||
          '',
      };

      if (school !== undefined && school !== '') {
        result.school = school;
      }
      if (field !== undefined && field !== '') {
        result.field = field;
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
      if (gpa !== undefined && gpa > 0) {
        result.gpa = gpa;
      }
      if (description !== undefined && description !== '') {
        result.description = description;
      }

      return result;
    }

    return { degree: '' };
  }

  private buildLabel(data: EducationData): string {
    if (data.school && data.field) {
      return `${data.degree} in ${data.field} from ${data.school}`;
    }
    if (data.school) {
      return `${data.degree} from ${data.school}`;
    }
    if (data.field) {
      return `${data.degree} in ${data.field}`;
    }
    return data.degree;
  }

  private extractBoolean(
    obj: Record<string, unknown>,
    field: string,
  ): boolean | undefined {
    const value = obj[field];
    return typeof value === 'boolean' ? value : undefined;
  }
}
