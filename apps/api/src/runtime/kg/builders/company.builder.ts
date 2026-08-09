/**
 * Knowledge Graph RH Runtime v2
 * Company Builder
 * Builds COMPANY nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface CompanyData {
  name: string;
  industry?: string;
  location?: string;
  size?: string;
  website?: string;
  founded?: string;
}

export class CompanyBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.COMPANY);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const companyData = this.parseCompanyData(data);
    const metadata = {
      industry: companyData.industry,
      location: companyData.location,
      size: companyData.size,
      website: companyData.website,
      founded: companyData.founded,
      ...options.metadata,
    };

    return this.createBaseNode(companyData.name, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(companyData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const companyData = this.parseCompanyData(data);
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

    // Boost confidence if industry is provided
    if (companyData.industry && companyData.industry !== '') {
      confidence += 0.1;
    }

    // Boost confidence if location is provided
    if (companyData.location && companyData.location !== '') {
      confidence += 0.05;
    }

    // Boost confidence if website is provided
    if (companyData.website && companyData.website !== '') {
      confidence += 0.15;
    }

    // Boost confidence if founded year is provided
    if (companyData.founded && companyData.founded !== '') {
      confidence += 0.05;
    }

    return Math.min(1.0, confidence);
  }

  private parseCompanyData(data: unknown): CompanyData {
    if (typeof data === 'string') {
      return { name: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const industry = this.extractString(obj, 'industry');
      const location = this.extractString(obj, 'location');
      const size = this.extractString(obj, 'size');
      const website = this.extractString(obj, 'website');
      const founded = this.extractString(obj, 'founded');

      const result: CompanyData = {
        name:
          this.extractString(obj, 'name') ||
          this.extractString(obj, 'company') ||
          '',
      };

      if (industry !== undefined && industry !== '') {
        result.industry = industry;
      }
      if (location !== undefined && location !== '') {
        result.location = location;
      }
      if (size !== undefined && size !== '') {
        result.size = size;
      }
      if (website !== undefined && website !== '') {
        result.website = website;
      }
      if (founded !== undefined && founded !== '') {
        result.founded = founded;
      }

      return result;
    }

    return { name: '' };
  }
}
