/**
 * Knowledge Graph RH Runtime v2
 * Project Builder
 * Builds PROJECT nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface ProjectData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  technologies?: string[];
  role?: string;
  url?: string;
}

export class ProjectBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.PROJECT);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const projectData = this.parseProjectData(data);
    const metadata = {
      description: projectData.description,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      current: projectData.current,
      technologies: projectData.technologies,
      role: projectData.role,
      url: projectData.url,
      ...options.metadata,
    };

    return this.createBaseNode(projectData.name, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(projectData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const projectData = this.parseProjectData(data);
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

    // Boost confidence if description is provided
    if (projectData.description && projectData.description.length > 20) {
      confidence += 0.1;
    }

    // Boost confidence if dates are provided
    if (projectData.startDate && projectData.startDate !== '') {
      confidence += 0.05;
    }
    if (projectData.endDate && projectData.endDate !== '') {
      confidence += 0.05;
    }

    // Boost confidence if technologies are listed
    if (projectData.technologies && projectData.technologies.length > 0) {
      confidence += 0.1;
    }

    // Boost confidence if URL is provided
    if (projectData.url && projectData.url !== '') {
      confidence += 0.1;
    }

    return Math.min(1.0, confidence);
  }

  private parseProjectData(data: unknown): ProjectData {
    if (typeof data === 'string') {
      return { name: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const description = this.extractString(obj, 'description');
      const startDate = this.extractString(obj, 'startDate');
      const endDate = this.extractString(obj, 'endDate');
      const current = this.extractBoolean(obj, 'current');
      const technologies = this.extractArray<string>(obj, 'technologies');
      const role = this.extractString(obj, 'role');
      const url = this.extractString(obj, 'url');

      const result: ProjectData = {
        name:
          this.extractString(obj, 'name') ||
          this.extractString(obj, 'project') ||
          '',
      };

      if (description !== undefined && description !== '') {
        result.description = description;
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
      if (technologies !== undefined && technologies.length > 0) {
        result.technologies = technologies;
      }
      if (role !== undefined && role !== '') {
        result.role = role;
      }
      if (url !== undefined && url !== '') {
        result.url = url;
      }

      return result;
    }

    return { name: '' };
  }

  private extractBoolean(
    obj: Record<string, unknown>,
    field: string,
  ): boolean | undefined {
    const value = obj[field];
    return typeof value === 'boolean' ? value : undefined;
  }
}
