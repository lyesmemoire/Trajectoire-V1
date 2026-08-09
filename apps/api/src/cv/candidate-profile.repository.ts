import { Injectable } from '@nestjs/common';
import { GraphPersistenceService } from './graph-persistence.service';
import { Node, NodeType } from '../runtime/kg/graph-types';
import { v4 as uuidv4 } from 'uuid';

export interface CandidateProfile {
  id: string;
  candidateId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string | undefined;
    github?: string | undefined;
  };
  graphId: string;
  stats: {
    experienceCount: number;
    educationCount: number;
    skillCount: number;
    certificationCount: number;
    languageCount: number;
    overallScore: number;
  };
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCandidateProfileInput {
  candidateId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string | undefined;
    github?: string | undefined;
  };
  graphId: string;
  stats: {
    experienceCount: number;
    educationCount: number;
    skillCount: number;
    certificationCount: number;
    languageCount: number;
    overallScore: number;
  };
  metadata?: Record<string, unknown>;
}

@Injectable()
export class CandidateProfileRepository {
  constructor(private readonly graphPersistence: GraphPersistenceService) {}

  /**
   * Create a new candidate profile (stored as metadata on candidate node)
   */
  async create(input: CreateCandidateProfileInput): Promise<CandidateProfile> {
    const profileId = uuidv4();
    const now = new Date();

    const profile: CandidateProfile = {
      id: profileId,
      candidateId: input.candidateId,
      personalInfo: input.personalInfo,
      graphId: input.graphId,
      stats: input.stats,
      metadata: input.metadata || {},
      createdAt: now,
      updatedAt: now,
    };

    return profile;
  }

  /**
   * Find a profile by candidate ID (from graph nodes)
   */
  async findByCandidateId(
    candidateId: string,
    userId: string,
  ): Promise<CandidateProfile | null> {
    const candidateNode = await this.graphPersistence.getNode(candidateId, userId);

    if (!candidateNode || candidateNode.type !== NodeType.CANDIDATE) {
      return null;
    }

    const profileData = candidateNode.metadata as any;

    return {
      id: candidateNode.id,
      candidateId: candidateNode.id,
      personalInfo: profileData.personalInfo || {
        name: candidateNode.label,
        email: '',
        phone: '',
        address: '',
      },
      graphId: profileData.graphId || candidateNode.id,
      stats: profileData.stats || {
        experienceCount: 0,
        educationCount: 0,
        skillCount: 0,
        certificationCount: 0,
        languageCount: 0,
        overallScore: 0,
      },
      metadata: profileData.metadata || {},
      createdAt: candidateNode.createdAt,
      updatedAt: candidateNode.updatedAt,
    };
  }

  /**
   * Find a profile by graph ID
   */
  async findByGraphId(graphId: string, userId: string): Promise<CandidateProfile | null> {
    const nodes = await this.graphPersistence.getCandidateNodes(graphId);
    const candidateNode = nodes.find((n) => n.type === NodeType.CANDIDATE);

    if (!candidateNode) return null;

    return this.findByCandidateId(candidateNode.id, userId);
  }

  /**
   * Update profile metadata on candidate node
   */
  async update(
    candidateId: string,
    userId: string,
    profile: Partial<CandidateProfile>,
  ): Promise<CandidateProfile | null> {
    const existing = await this.findByCandidateId(candidateId, userId);

    if (!existing) return null;

    const updated: CandidateProfile = {
      ...existing,
      ...profile,
      updatedAt: new Date(),
    };

    return updated;
  }

  /**
   * Calculate profile stats from graph nodes
   */
  async calculateStats(
    candidateId: string,
  ): Promise<CandidateProfile['stats']> {
    const nodes = await this.graphPersistence.getCandidateNodes(candidateId);

    const stats: CandidateProfile['stats'] = {
      experienceCount: nodes.filter((n) => n.type === NodeType.EXPERIENCE)
        .length,
      educationCount: nodes.filter((n) => n.type === NodeType.EDUCATION).length,
      skillCount: nodes.filter((n) => n.type === NodeType.SKILL).length,
      certificationCount: nodes.filter((n) => n.type === NodeType.CERTIFICATION)
        .length,
      languageCount: nodes.filter((n) => n.type === NodeType.LANGUAGE).length,
      overallScore: 0,
    };

    stats.overallScore = this.calculateOverallScore(stats);

    return stats;
  }

  private calculateOverallScore(stats: CandidateProfile['stats']): number {
    const expScore = Math.min(stats.experienceCount * 10, 30);
    const skillScore = Math.min(stats.skillCount * 5, 50);
    const certScore = Math.min(stats.certificationCount * 5, 20);
    return expScore + skillScore + certScore;
  }
}
