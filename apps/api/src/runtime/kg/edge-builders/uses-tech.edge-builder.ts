/**
 * Knowledge Graph RH Runtime v2
 * UsesTech Edge Builder
 * Builds USES_TECH edges from Project to Technology
 */

import { Edge, EdgeType } from '../graph-types';
import {
  BaseEdgeBuilder,
  EdgeData,
  EdgeBuildOptions,
} from './base.edge-builder';

export interface UsesTechData extends EdgeData {
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  usageContext?: string;
  yearsUsed?: number;
  primary?: boolean;
}

export class UsesTechEdgeBuilder extends BaseEdgeBuilder {
  constructor() {
    super(EdgeType.USES_TECH);
  }

  override build(data: UsesTechData, options: EdgeBuildOptions = {}): Edge {
    const weight = options.weight ?? this.calculateWeight(data);
    const confidence = options.confidence ?? this.calculateConfidence(data);
    const reason = options.reason ?? this.generateReason(data);

    const now = new Date();
    return {
      id: this.generateId(data.sourceNodeId, data.targetNodeId),
      type: this.edgeType,
      sourceNode: data.sourceNodeId,
      targetNode: data.targetNodeId,
      weight,
      confidence,
      reason,
      metadata: options.metadata ?? {},
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: {
        createdBy: 'UsesTechEdgeBuilder',
        algorithmVersion: '1.0.0',
      },
    };
  }

  calculateWeight(
    data: UsesTechData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number {
    let weight = 0.5;

    // Boost weight based on proficiency
    if (data.proficiency === 'expert') {
      weight += 0.25;
    } else if (data.proficiency === 'advanced') {
      weight += 0.15;
    } else if (data.proficiency === 'intermediate') {
      weight += 0.1;
    }

    // Boost weight based on years used
    if (data.yearsUsed && data.yearsUsed > 0) {
      weight += Math.min(0.15, data.yearsUsed * 0.02);
    }

    // Boost weight if primary technology
    if (data.primary) {
      weight += 0.1;
    }

    return Math.min(1.0, weight);
  }

  calculateConfidence(
    data: UsesTechData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number {
    let confidence = 0.5;

    // Base confidence from data completeness
    if (data.proficiency) {
      confidence += 0.15;
    }
    if (data.usageContext && data.usageContext !== '') {
      confidence += 0.15;
    }
    if (data.yearsUsed && data.yearsUsed > 0) {
      confidence += 0.1;
    }
    if (data.primary !== undefined) {
      confidence += 0.1;
    }

    return Math.min(1.0, confidence);
  }

  generateReason(
    data: UsesTechData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): string {
    const parts: string[] = ['Project uses this technology'];

    if (data.proficiency) {
      parts.push(`at ${data.proficiency} proficiency level`);
    }

    if (data.primary) {
      parts.push('(primary technology)');
    }

    if (data.usageContext) {
      parts.push(`for ${data.usageContext}`);
    }

    if (data.yearsUsed && data.yearsUsed > 0) {
      parts.push(`(${data.yearsUsed} years of usage)`);
    }

    return parts.join(' ') + '.';
  }

  parseUsesTechData(data: unknown): UsesTechData {
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const proficiency = this.extractProficiency(obj);
      const usageContext = this.extractString(obj, 'usageContext');
      const yearsUsed = this.extractNumber(obj, 'yearsUsed');
      const primary = this.extractBoolean(obj, 'primary');

      const result: UsesTechData = {
        sourceNodeId: this.extractString(obj, 'sourceNodeId'),
        targetNodeId: this.extractString(obj, 'targetNodeId'),
      };

      if (proficiency !== undefined) {
        result.proficiency = proficiency;
      }
      if (usageContext !== undefined && usageContext !== '') {
        result.usageContext = usageContext;
      }
      if (yearsUsed !== undefined && yearsUsed > 0) {
        result.yearsUsed = yearsUsed;
      }
      if (primary !== undefined) {
        result.primary = primary;
      }

      return result;
    }

    return {
      sourceNodeId: '',
      targetNodeId: '',
    };
  }

  private extractProficiency(
    obj: Record<string, unknown>,
  ): UsesTechData['proficiency'] {
    const proficiency = this.extractString(obj, 'proficiency');
    const validLevels: UsesTechData['proficiency'][] = [
      'beginner',
      'intermediate',
      'advanced',
      'expert',
    ];
    if (
      proficiency &&
      validLevels.includes(proficiency as UsesTechData['proficiency'])
    ) {
      return proficiency as UsesTechData['proficiency'];
    }
    return undefined;
  }
}
