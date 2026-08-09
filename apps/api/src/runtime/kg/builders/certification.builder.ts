/**
 * Knowledge Graph RH Runtime v2
 * Certification Builder
 * Builds CERTIFICATION nodes from CV and Job data
 */

import { NodeType, Node } from '../graph-types';
import { EntityNormalizerService } from '../entity-normalizer.service';
import { BaseNodeBuilder, BuildOptions } from './base.builder';

export interface CertificationData {
  name: string;
  issuer?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  verified?: boolean;
  url?: string;
}

export class CertificationBuilder extends BaseNodeBuilder {
  constructor(entityNormalizer: EntityNormalizerService) {
    super(entityNormalizer, NodeType.CERTIFICATION);
  }

  build(data: unknown, options: BuildOptions = {}): Node {
    const certificationData = this.parseCertificationData(data);
    const metadata = {
      issuer: certificationData.issuer,
      issueDate: certificationData.issueDate,
      expirationDate: certificationData.expirationDate,
      credentialId: certificationData.credentialId,
      verified: certificationData.verified,
      url: certificationData.url,
      ...options.metadata,
    };

    const label = this.buildLabel(certificationData);
    return this.createBaseNode(label, {
      ...options,
      metadata,
      confidence:
        options.confidence ??
        this.calculateConfidence(certificationData, options.source),
    });
  }

  buildBatch(data: unknown[], options: BuildOptions = {}): Node[] {
    return data.map((item) => this.build(item, options));
  }

  calculateConfidence(data: unknown, source?: string): number {
    const certificationData = this.parseCertificationData(data);
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

    // Boost confidence if issuer is provided
    if (certificationData.issuer && certificationData.issuer !== '') {
      confidence += 0.1;
    }

    // Boost confidence if dates are provided
    if (certificationData.issueDate && certificationData.issueDate !== '') {
      confidence += 0.05;
    }
    if (
      certificationData.expirationDate &&
      certificationData.expirationDate !== ''
    ) {
      confidence += 0.05;
    }

    // Boost confidence if credential ID is provided
    if (
      certificationData.credentialId &&
      certificationData.credentialId !== ''
    ) {
      confidence += 0.1;
    }

    // Boost confidence if verified
    if (certificationData.verified) {
      confidence += 0.15;
    }

    // Boost confidence if URL is provided
    if (certificationData.url && certificationData.url !== '') {
      confidence += 0.05;
    }

    return Math.min(1.0, confidence);
  }

  private parseCertificationData(data: unknown): CertificationData {
    if (typeof data === 'string') {
      return { name: data };
    }

    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const issuer = this.extractString(obj, 'issuer');
      const issueDate = this.extractString(obj, 'issueDate');
      const expirationDate = this.extractString(obj, 'expirationDate');
      const credentialId = this.extractString(obj, 'credentialId');
      const verified = this.extractBoolean(obj, 'verified');
      const url = this.extractString(obj, 'url');

      const result: CertificationData = {
        name:
          this.extractString(obj, 'name') ||
          this.extractString(obj, 'certification') ||
          this.extractString(obj, 'title') ||
          '',
      };

      if (issuer !== undefined && issuer !== '') {
        result.issuer = issuer;
      }
      if (issueDate !== undefined && issueDate !== '') {
        result.issueDate = issueDate;
      }
      if (expirationDate !== undefined && expirationDate !== '') {
        result.expirationDate = expirationDate;
      }
      if (credentialId !== undefined && credentialId !== '') {
        result.credentialId = credentialId;
      }
      if (verified !== undefined) {
        result.verified = verified;
      }
      if (url !== undefined && url !== '') {
        result.url = url;
      }

      return result;
    }

    return { name: '' };
  }

  private buildLabel(data: CertificationData): string {
    if (data.issuer) {
      return `${data.name} - ${data.issuer}`;
    }
    return data.name;
  }

  private extractBoolean(
    obj: Record<string, unknown>,
    field: string,
  ): boolean | undefined {
    const value = obj[field];
    return typeof value === 'boolean' ? value : undefined;
  }
}
