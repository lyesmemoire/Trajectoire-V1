/**
 * Knowledge Graph RH Runtime v2
 * Edge Builder Service
 * Builds edges between nodes with automatic relation deduction
 */

import { Edge, EdgeType, EdgeMetadata, Node, NodeType } from './graph-types';
import {
  IEdgeBuilder,
  EdgeData,
  EdgeBuildOptions as BuilderEdgeBuildOptions,
} from './edge-builders/base.edge-builder';
import {
  HasSkillEdgeBuilder,
  HasSkillData,
} from './edge-builders/has-skill.edge-builder';
import {
  WorkedAtEdgeBuilder,
  WorkedAtData,
} from './edge-builders/worked-at.edge-builder';
import {
  UsesTechEdgeBuilder,
  UsesTechData,
} from './edge-builders/uses-tech.edge-builder';
import {
  RequiresSkillEdgeBuilder,
  RequiresSkillData,
} from './edge-builders/requires-skill.edge-builder';

export interface EdgeBuildOptions {
  weight?: number;
  confidence?: number;
  reason?: string;
  metadata?: EdgeMetadata;
  source?: string;
}

export interface RelationDeductionOptions {
  autoDeduce?: boolean;
  confidenceThreshold?: number;
  weightThreshold?: number;
}

export class EdgeBuilderService {
  private readonly builders: Map<EdgeType, IEdgeBuilder>;

  constructor() {
    this.builders = new Map();
    this.registerBuilders();
  }

  private registerBuilders(): void {
    this.builders.set(EdgeType.HAS_SKILL, new HasSkillEdgeBuilder());
    this.builders.set(EdgeType.WORKED_AT, new WorkedAtEdgeBuilder());
    this.builders.set(EdgeType.USES_TECH, new UsesTechEdgeBuilder());
    this.builders.set(EdgeType.REQUIRES_SKILL, new RequiresSkillEdgeBuilder());
  }

  /**
   * Automatically deduce and create edges from a collection of nodes
   */
  deduceEdges(nodes: Node[], options: RelationDeductionOptions = {}): Edge[] {
    const edges: Edge[] = [];
    const confidenceThreshold = options.confidenceThreshold ?? 0.5;
    const weightThreshold = options.weightThreshold ?? 0.3;

    // Group nodes by type for efficient processing
    const nodesByType = this.groupNodesByType(nodes);

    // Deduce Candidate -> Skill edges (HAS_SKILL)
    edges.push(
      ...this.deduceCandidateSkillEdges(
        nodesByType,
        confidenceThreshold,
        weightThreshold,
      ),
    );

    // Deduce Experience -> Company edges (WORKED_AT)
    edges.push(
      ...this.deduceExperienceCompanyEdges(
        nodesByType,
        confidenceThreshold,
        weightThreshold,
      ),
    );

    // Deduce Project -> Technology edges (USES_TECH)
    edges.push(
      ...this.deduceProjectTechnologyEdges(
        nodesByType,
        confidenceThreshold,
        weightThreshold,
      ),
    );

    // Unduce Job -> Skill edges (REQUIRES_SKILL)
    edges.push(
      ...this.deduceJobSkillEdges(
        nodesByType,
        confidenceThreshold,
        weightThreshold,
      ),
    );

    return edges;
  }

  /**
   * Deduce HAS_SKILL edges from Candidate to Skill nodes
   */
  private deduceCandidateSkillEdges(
    nodesByType: Map<NodeType, Node[]>,
    confidenceThreshold: number,
    weightThreshold: number,
  ): Edge[] {
    const edges: Edge[] = [];
    const candidates = nodesByType.get(NodeType.CANDIDATE) || [];
    const skills = nodesByType.get(NodeType.SKILL) || [];

    const builder = this.builders.get(EdgeType.HAS_SKILL);
    if (!builder) return edges;

    for (const candidate of candidates) {
      for (const skill of skills) {
        // Check if skill is mentioned in candidate metadata
        const hasSkill = this.checkCandidateHasSkill(candidate, skill);
        if (hasSkill) {
          const skillLevel = this.extractSkillLevel(candidate, skill);
          const yearsExperience = this.extractYearsExperience(candidate, skill);
          const verified = this.extractVerified(candidate, skill);

          const data: HasSkillData = {
            sourceNodeId: candidate.id,
            targetNodeId: skill.id,
          };

          if (skillLevel !== undefined) {
            data.skillLevel = skillLevel;
          }
          if (yearsExperience !== undefined) {
            data.yearsExperience = yearsExperience;
          }
          if (verified !== undefined) {
            data.verified = verified;
          }

          const edge = builder.build(data);
          if (
            edge.confidence >= confidenceThreshold &&
            edge.weight >= weightThreshold
          ) {
            edges.push(edge);
          }
        }
      }
    }

    return edges;
  }

  /**
   * Deduce WORKED_AT edges from Experience to Company nodes
   */
  private deduceExperienceCompanyEdges(
    nodesByType: Map<NodeType, Node[]>,
    confidenceThreshold: number,
    weightThreshold: number,
  ): Edge[] {
    const edges: Edge[] = [];
    const experiences = nodesByType.get(NodeType.EXPERIENCE) || [];
    const companies = nodesByType.get(NodeType.COMPANY) || [];

    const builder = this.builders.get(EdgeType.WORKED_AT);
    if (!builder) return edges;

    for (const experience of experiences) {
      for (const company of companies) {
        // Check if experience is at this company
        const workedAt = this.checkExperienceAtCompany(experience, company);
        if (workedAt) {
          const startDate = this.extractString(
            experience.metadata,
            'startDate',
          );
          const endDate = this.extractString(experience.metadata, 'endDate');
          const current = this.extractBoolean(experience.metadata, 'current');
          const durationMonths = this.extractNumber(
            experience.metadata,
            'durationMonths',
          );

          const data: WorkedAtData = {
            sourceNodeId: experience.id,
            targetNodeId: company.id,
            position: experience.label,
          };

          if (startDate !== undefined) {
            data.startDate = startDate;
          }
          if (endDate !== undefined) {
            data.endDate = endDate;
          }
          if (current !== undefined) {
            data.current = current;
          }
          if (durationMonths !== undefined) {
            data.durationMonths = durationMonths;
          }

          const edge = builder.build(data);
          if (
            edge.confidence >= confidenceThreshold &&
            edge.weight >= weightThreshold
          ) {
            edges.push(edge);
          }
        }
      }
    }

    return edges;
  }

  /**
   * Deduce USES_TECH edges from Project to Technology nodes
   */
  private deduceProjectTechnologyEdges(
    nodesByType: Map<NodeType, Node[]>,
    confidenceThreshold: number,
    weightThreshold: number,
  ): Edge[] {
    const edges: Edge[] = [];
    const projects = nodesByType.get(NodeType.PROJECT) || [];
    const technologies = nodesByType.get(NodeType.TECHNOLOGY) || [];

    const builder = this.builders.get(EdgeType.USES_TECH);
    if (!builder) return edges;

    for (const project of projects) {
      for (const technology of technologies) {
        // Check if project uses this technology
        const usesTech = this.checkProjectUsesTechnology(project, technology);
        if (usesTech) {
          const proficiency = this.extractProficiency(project, technology);
          const usageContext = this.extractString(
            project.metadata,
            'usageContext',
          );
          const yearsUsed = this.extractNumber(project.metadata, 'yearsUsed');
          const primary = this.extractBoolean(project.metadata, 'primary');

          const data: UsesTechData = {
            sourceNodeId: project.id,
            targetNodeId: technology.id,
          };

          if (proficiency !== undefined) {
            data.proficiency = proficiency;
          }
          if (usageContext !== undefined) {
            data.usageContext = usageContext;
          }
          if (yearsUsed !== undefined) {
            data.yearsUsed = yearsUsed;
          }
          if (primary !== undefined) {
            data.primary = primary;
          }

          const edge = builder.build(data);
          if (
            edge.confidence >= confidenceThreshold &&
            edge.weight >= weightThreshold
          ) {
            edges.push(edge);
          }
        }
      }
    }

    return edges;
  }

  /**
   * Deduce REQUIRES_SKILL edges from Job to Skill nodes
   */
  private deduceJobSkillEdges(
    nodesByType: Map<NodeType, Node[]>,
    confidenceThreshold: number,
    weightThreshold: number,
  ): Edge[] {
    const edges: Edge[] = [];
    const jobs = nodesByType.get(NodeType.JOB) || [];
    const skills = nodesByType.get(NodeType.SKILL) || [];

    const builder = this.builders.get(EdgeType.REQUIRES_SKILL);
    if (!builder) return edges;

    for (const job of jobs) {
      for (const skill of skills) {
        // Check if job requires this skill
        const requiresSkill = this.checkJobRequiresSkill(job, skill);
        if (requiresSkill) {
          const proficiency = this.extractProficiency(job, skill);
          const yearsRequired = this.extractNumber(
            job.metadata,
            'yearsRequired',
          );
          const importance = this.extractImportance(job, skill);
          const required =
            this.extractBoolean(job.metadata, 'required') ?? true;

          const data: RequiresSkillData = {
            sourceNodeId: job.id,
            targetNodeId: skill.id,
            required,
          };

          if (proficiency !== undefined) {
            data.proficiency = proficiency;
          }
          if (yearsRequired !== undefined) {
            data.yearsRequired = yearsRequired;
          }
          if (importance !== undefined) {
            data.importance = importance;
          }

          const edge = builder.build(data);
          if (
            edge.confidence >= confidenceThreshold &&
            edge.weight >= weightThreshold
          ) {
            edges.push(edge);
          }
        }
      }
    }

    return edges;
  }

  /**
   * Create an edge using the appropriate specialized builder
   */
  createEdgeWithBuilder(
    type: EdgeType,
    sourceNode: string,
    targetNode: string,
    data: Record<string, unknown> = {},
    options: EdgeBuildOptions = {},
  ): Edge | null {
    const builder = this.builders.get(type);
    if (!builder) {
      return null;
    }

    const edgeData: EdgeData = {
      sourceNodeId: sourceNode,
      targetNodeId: targetNode,
    };
    const mergedData = { ...edgeData, ...data };
    return builder.build(mergedData, options);
  }

  /**
   * Create an edge with automatic ID generation
   */
  createEdge(
    type: EdgeType,
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    const now = new Date();

    const edge: Edge = {
      id: `${type.toLowerCase()}-${sourceNode}-${targetNode}`,
      type,
      sourceNode,
      targetNode,
      weight: options.weight ?? 1.0,
      confidence: options.confidence ?? 1.0,
      reason: options.reason,
      metadata: options.metadata ?? {},
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: {
        createdBy: 'EdgeBuilderService',
        algorithmVersion: '1.0.0',
      },
    };

    return edge;
  }

  /**
   * Create an edge with a specific ID
   */
  createEdgeWithId(
    id: string,
    type: EdgeType,
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    const now = new Date();

    const edge: Edge = {
      id,
      type,
      sourceNode,
      targetNode,
      weight: options.weight ?? 1.0,
      confidence: options.confidence ?? 1.0,
      reason: options.reason,
      metadata: options.metadata ?? {},
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: {
        createdBy: 'EdgeBuilderService',
        algorithmVersion: '1.0.0',
      },
    };

    return edge;
  }

  /**
   * Create HAS_SKILL edge using specialized builder
   */
  createHasSkill(
    sourceNode: string,
    targetNode: string,
    data: Partial<HasSkillData> = {},
    options: EdgeBuildOptions = {},
  ): Edge {
    const builder = this.builders.get(EdgeType.HAS_SKILL);
    if (builder) {
      return builder.build(
        {
          sourceNodeId: sourceNode,
          targetNodeId: targetNode,
          ...data,
        },
        options,
      );
    }
    return this.createEdge(EdgeType.HAS_SKILL, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Candidate has this skill',
    });
  }

  /**
   * Create WORKED_AT edge using specialized builder
   */
  createWorkedAt(
    sourceNode: string,
    targetNode: string,
    data: Partial<WorkedAtData> = {},
    options: EdgeBuildOptions = {},
  ): Edge {
    const builder = this.builders.get(EdgeType.WORKED_AT);
    if (builder) {
      return builder.build(
        {
          sourceNodeId: sourceNode,
          targetNodeId: targetNode,
          ...data,
        },
        options,
      );
    }
    return this.createEdge(EdgeType.WORKED_AT, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Candidate worked at this company',
    });
  }

  /**
   * Create USES_TECH edge using specialized builder
   */
  createUsesTech(
    sourceNode: string,
    targetNode: string,
    data: Partial<UsesTechData> = {},
    options: EdgeBuildOptions = {},
  ): Edge {
    const builder = this.builders.get(EdgeType.USES_TECH);
    if (builder) {
      return builder.build(
        {
          sourceNodeId: sourceNode,
          targetNodeId: targetNode,
          ...data,
        },
        options,
      );
    }
    return this.createEdge(EdgeType.USES_TECH, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Uses this technology',
    });
  }

  /**
   * Create REQUIRES_SKILL edge using specialized builder
   */
  createRequiresSkill(
    sourceNode: string,
    targetNode: string,
    data: Partial<RequiresSkillData> = {},
    options: EdgeBuildOptions = {},
  ): Edge {
    const builder = this.builders.get(EdgeType.REQUIRES_SKILL);
    if (builder) {
      return builder.build(
        {
          sourceNodeId: sourceNode,
          targetNodeId: targetNode,
          ...data,
        },
        options,
      );
    }
    return this.createEdge(EdgeType.REQUIRES_SKILL, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Job requires this skill',
    });
  }

  // Methods for other edge types
  createHasSoftSkill(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.HAS_SOFT_SKILL, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Candidate has this soft skill',
    });
  }

  createHasLanguage(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.HAS_LANGUAGE, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Candidate speaks this language',
    });
  }

  createHasCertification(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.HAS_CERTIFICATION, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Candidate has this certification',
    });
  }

  createStudiedAt(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.STUDIED_AT, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Candidate studied at this school',
    });
  }

  createUsesTool(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.USES_TOOL, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Uses this tool',
    });
  }

  createUsesFramework(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.USES_FRAMEWORK, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Uses this framework',
    });
  }

  createHasProject(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.HAS_PROJECT, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Has this project',
    });
  }

  createRequiresLanguage(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.REQUIRES_LANGUAGE, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Job requires this language',
    });
  }

  createRequiresCertification(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(
      EdgeType.REQUIRES_CERTIFICATION,
      sourceNode,
      targetNode,
      {
        ...options,
        reason: options.reason ?? 'Job requires this certification',
      },
    );
  }

  createMatches(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.MATCHES, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Candidate matches job',
    });
  }

  createSimilarTo(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.SIMILAR_TO, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Similar to',
    });
  }

  createTransferableTo(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.TRANSFERABLE_TO, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Skill is transferable to',
    });
  }

  createRelatedTo(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.RELATED_TO, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Related to',
    });
  }

  createPartOf(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.PART_OF, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Part of',
    });
  }

  createNextStep(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.NEXT_STEP, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Next step in career path',
    });
  }

  createPreviousStep(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.PREVIOUS_STEP, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Previous step in career path',
    });
  }

  createRecommendedFor(
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): Edge {
    return this.createEdge(EdgeType.RECOMMENDED_FOR, sourceNode, targetNode, {
      ...options,
      reason: options.reason ?? 'Recommended for',
    });
  }

  /**
   * Update an edge's metadata
   */
  updateEdgeMetadata(edge: Edge, metadata: Partial<EdgeMetadata>): Edge {
    return {
      ...edge,
      metadata: {
        ...edge.metadata,
        ...metadata,
      },
      timestamps: {
        ...edge.timestamps,
        updatedAt: new Date(),
      },
    };
  }

  /**
   * Update an edge's weight
   */
  updateEdgeWeight(edge: Edge, weight: number): Edge {
    return {
      ...edge,
      weight,
      timestamps: {
        ...edge.timestamps,
        updatedAt: new Date(),
      },
    };
  }

  /**
   * Update an edge's confidence
   */
  updateEdgeConfidence(edge: Edge, confidence: number): Edge {
    return {
      ...edge,
      confidence,
      timestamps: {
        ...edge.timestamps,
        updatedAt: new Date(),
      },
    };
  }

  /**
   * Batch create edges
   */
  batchCreateEdges(
    type: EdgeType,
    sourceNode: string,
    targetNodes: string[],
    options: EdgeBuildOptions = {},
  ): Edge[] {
    return targetNodes.map((targetNode) =>
      this.createEdge(type, sourceNode, targetNode, options),
    );
  }

  /**
   * Create edges from array with custom options per edge
   */
  batchCreateEdgesWithCustomOptions(
    edges: Array<{
      type: EdgeType;
      sourceNode: string;
      targetNode: string;
      options?: EdgeBuildOptions;
    }>,
  ): Edge[] {
    return edges.map(({ type, sourceNode, targetNode, options }) =>
      this.createEdge(type, sourceNode, targetNode, options),
    );
  }

  /**
   * Create bidirectional edge (both directions)
   */
  createBidirectionalEdge(
    type: EdgeType,
    sourceNode: string,
    targetNode: string,
    options: EdgeBuildOptions = {},
  ): [Edge, Edge] {
    return [
      this.createEdge(type, sourceNode, targetNode, options),
      this.createEdge(type, targetNode, sourceNode, options),
    ];
  }

  // Helper methods for relation deduction
  private groupNodesByType(nodes: Node[]): Map<NodeType, Node[]> {
    const grouped = new Map<NodeType, Node[]>();
    for (const node of nodes) {
      const typeNodes = grouped.get(node.type) || [];
      typeNodes.push(node);
      grouped.set(node.type, typeNodes);
    }
    return grouped;
  }

  private checkCandidateHasSkill(candidate: Node, skill: Node): boolean {
    const skills = (candidate.metadata.skills as string[]) || [];
    return (
      skills.includes(skill.normalizedLabel) || skills.includes(skill.label)
    );
  }

  private checkExperienceAtCompany(experience: Node, company: Node): boolean {
    const experienceCompany = (experience.metadata.company as string) || '';
    return (
      experienceCompany === company.normalizedLabel ||
      experienceCompany === company.label
    );
  }

  private checkProjectUsesTechnology(project: Node, technology: Node): boolean {
    const technologies = (project.metadata.technologies as string[]) || [];
    return (
      technologies.includes(technology.normalizedLabel) ||
      technologies.includes(technology.label)
    );
  }

  private checkJobRequiresSkill(job: Node, skill: Node): boolean {
    const requiredSkills = (job.metadata.requiredSkills as string[]) || [];
    const preferredSkills = (job.metadata.preferredSkills as string[]) || [];
    return (
      requiredSkills.includes(skill.normalizedLabel) ||
      requiredSkills.includes(skill.label) ||
      preferredSkills.includes(skill.normalizedLabel) ||
      preferredSkills.includes(skill.label)
    );
  }

  private extractSkillLevel(
    candidate: Node,
    skill: Node,
  ): HasSkillData['skillLevel'] {
    const skillLevels =
      (candidate.metadata.skillLevels as Record<string, string>) || {};
    const level =
      skillLevels[skill.normalizedLabel] || skillLevels[skill.label];
    const validLevels: HasSkillData['skillLevel'][] = [
      'beginner',
      'intermediate',
      'advanced',
      'expert',
    ];
    if (level && validLevels.includes(level as HasSkillData['skillLevel'])) {
      return level as HasSkillData['skillLevel'];
    }
    return undefined;
  }

  private extractYearsExperience(
    candidate: Node,
    skill: Node,
  ): number | undefined {
    const skillYears =
      (candidate.metadata.skillYears as Record<string, number>) || {};
    const years = skillYears[skill.normalizedLabel] || skillYears[skill.label];
    return years !== undefined && years > 0 ? years : undefined;
  }

  private extractVerified(candidate: Node, skill: Node): boolean | undefined {
    const skillVerified =
      (candidate.metadata.skillVerified as Record<string, boolean>) || {};
    return skillVerified[skill.normalizedLabel] || skillVerified[skill.label];
  }

  private extractProficiency(
    node: Node,
    target: Node,
  ): UsesTechData['proficiency'] {
    const proficiencies =
      (node.metadata.proficiencies as Record<string, string>) || {};
    const proficiency =
      proficiencies[target.normalizedLabel] || proficiencies[target.label];
    const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (proficiency && validLevels.includes(proficiency)) {
      return proficiency as UsesTechData['proficiency'];
    }
    return undefined;
  }

  private extractImportance(
    job: Node,
    skill: Node,
  ): RequiresSkillData['importance'] {
    const importances =
      (job.metadata.skillImportances as Record<string, string>) || [];
    const importance =
      importances[skill.normalizedLabel] || importances[skill.label];
    const validLevels: RequiresSkillData['importance'][] = [
      'low',
      'medium',
      'high',
      'critical',
    ];
    if (
      importance &&
      validLevels.includes(importance as RequiresSkillData['importance'])
    ) {
      return importance as RequiresSkillData['importance'];
    }
    return undefined;
  }

  private extractString(
    metadata: EdgeMetadata,
    field: string,
  ): string | undefined {
    const value = metadata[field];
    return typeof value === 'string' ? value : undefined;
  }

  private extractNumber(
    metadata: EdgeMetadata,
    field: string,
  ): number | undefined {
    const value = metadata[field];
    return typeof value === 'number' ? value : undefined;
  }

  private extractBoolean(
    metadata: EdgeMetadata,
    field: string,
  ): boolean | undefined {
    const value = metadata[field];
    return typeof value === 'boolean' ? value : undefined;
  }
}
