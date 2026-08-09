/**
 * Knowledge Graph RH Runtime v2
 * WorkedAt Edge Builder
 * Builds WORKED_AT edges from Experience to Company
 */

import { Edge, EdgeType } from '../graph-types';
import {
  BaseEdgeBuilder,
  EdgeData,
  EdgeBuildOptions,
} from './base.edge-builder';

export interface WorkedAtData extends EdgeData {
  startDate?: string;
  endDate?: string;
  current?: boolean;
  position?: string;
  durationMonths?: number;
}

export class WorkedAtEdgeBuilder extends BaseEdgeBuilder {
  constructor() {
    super(EdgeType.WORKED_AT);
  }

  override build(data: WorkedAtData, options: EdgeBuildOptions = {}): Edge {
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
        createdBy: 'WorkedAtEdgeBuilder',
        algorithmVersion: '1.0.0',
      },
    };
  }

  calculateWeight(
    data: WorkedAtData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number {
    let weight = 0.5;

    // Boost weight based on duration
    if (data.durationMonths && data.durationMonths > 0) {
      weight += Math.min(0.3, data.durationMonths * 0.01);
    }

    // Boost weight if current position
    if (data.current) {
      weight += 0.1;
    }

    // Boost weight if position is specified
    if (data.position && data.position !== '') {
      weight += 0.1;
    }

    return Math.min(1.0, weight);
  }

  calculateConfidence(
    data: WorkedAtData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): number {
    let confidence = 0.5;

    // Base confidence from data completeness
    if (data.startDate && data.startDate !== '') {
      confidence += 0.15;
    }
    if (data.endDate && data.endDate !== '') {
      confidence += 0.15;
    }
    if (data.current !== undefined) {
      confidence += 0.1;
    }
    if (data.position && data.position !== '') {
      confidence += 0.1;
    }

    return Math.min(1.0, confidence);
  }

  generateReason(
    data: WorkedAtData,
    sourceNode?: unknown,
    targetNode?: unknown,
  ): string {
    const parts: string[] = ['Candidate worked at this company'];

    if (data.position) {
      parts.push(`as ${data.position}`);
    }

    if (data.startDate && data.endDate) {
      parts.push(`from ${data.startDate} to ${data.endDate}`);
    } else if (data.startDate && data.current) {
      parts.push(`from ${data.startDate} to present`);
    } else if (data.startDate) {
      parts.push(`starting ${data.startDate}`);
    }

    if (data.durationMonths && data.durationMonths > 0) {
      parts.push(`(${data.durationMonths} months)`);
    }

    return parts.join(' ') + '.';
  }

  parseWorkedAtData(data: unknown): WorkedAtData {
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const startDate = this.extractString(obj, 'startDate');
      const endDate = this.extractString(obj, 'endDate');
      const current = this.extractBoolean(obj, 'current');
      const position = this.extractString(obj, 'position');
      const durationMonths = this.extractNumber(obj, 'durationMonths');

      const result: WorkedAtData = {
        sourceNodeId: this.extractString(obj, 'sourceNodeId'),
        targetNodeId: this.extractString(obj, 'targetNodeId'),
      };

      if (startDate !== undefined && startDate !== '') {
        result.startDate = startDate;
      }
      if (endDate !== undefined && endDate !== '') {
        result.endDate = endDate;
      }
      if (current !== undefined) {
        result.current = current;
      }
      if (position !== undefined && position !== '') {
        result.position = position;
      }
      if (durationMonths !== undefined && durationMonths > 0) {
        result.durationMonths = durationMonths;
      }

      return result;
    }

    return {
      sourceNodeId: '',
      targetNodeId: '',
    };
  }
}
