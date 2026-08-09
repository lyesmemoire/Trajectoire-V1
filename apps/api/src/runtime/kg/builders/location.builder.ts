/**
 * Knowledge Graph RH Runtime v2
 * Location Builder
 * Builds LOCATION nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface LocationData {
  name: string;
  country?: string;
  region?: string;
  city?: string;
  remote?: boolean;
}

export class LocationBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.LOCATION);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const locationData = this.parseLocationData(data);
    const metadata = {
      country: locationData.country,
      region: locationData.region,
      city: locationData.city,
      remote: locationData.remote,
      ...options.metadata,
    };

    return this.createBaseNode(locationData.name, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(locationData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const locationData = this.parseLocationData(data);
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

    // Boost confidence if country is provided
    if (locationData.country && locationData.country !== '') {
      confidence += 0.1;
    }

    // Boost confidence if city is provided
    if (locationData.city && locationData.city !== '') {
      confidence += 0.1;
    }

    // Boost confidence if region is provided
    if (locationData.region && locationData.region !== '') {
      confidence += 0.05;
    }

    return Math.min(1.0, confidence);
  }

  private parseLocationData(data: unknown): LocationData {
    if (typeof data === 'string') {
      return { name: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const country = this.extractString(obj, 'country');
      const region = this.extractString(obj, 'region');
      const city = this.extractString(obj, 'city');
      const remote = this.extractBoolean(obj, 'remote');

      const result: LocationData = {
        name:
          this.extractString(obj, 'name') ||
          this.extractString(obj, 'location') ||
          '',
      };

      if (country !== undefined && country !== '') {
        result.country = country;
      }
      if (region !== undefined && region !== '') {
        result.region = region;
      }
      if (city !== undefined && city !== '') {
        result.city = city;
      }
      if (remote !== undefined) {
        result.remote = remote;
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
