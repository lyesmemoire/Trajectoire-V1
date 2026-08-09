/**
 * Knowledge Graph RH Runtime v2
 * Node Builder Service
 * Builds nodes from various data sources
 */

import { v4 as uuidv4 } from 'uuid';
import { Node, NodeType, NodeTimestamps, NodeMetadata } from './graph-types';
import { EntityNormalizerService } from './entity-normalizer.service';

export interface NodeBuildOptions {
  confidence?: number;
  source?: string;
  metadata?: NodeMetadata;
}

export class NodeBuilderService {
  constructor(private readonly entityNormalizer: EntityNormalizerService) {}

  /**
   * Create a node with automatic ID generation
   */
  createNode(
    type: NodeType,
    label: string,
    options: NodeBuildOptions = {},
  ): Node {
    const now = new Date();
    const normalizedLabel = this.entityNormalizer.normalizeLabel(label, type);

    const node: Node = {
      id: uuidv4(),
      type,
      label,
      normalizedLabel,
      confidence: options.confidence ?? 1.0,
      source: options.source ?? 'UNKNOWN',
      metadata: options.metadata ?? {},
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: {
        createdBy: options.source ?? 'UNKNOWN',
        algorithmVersion: '1.0.0',
      },
    };

    return node;
  }

  /**
   * Create a node with a specific ID
   */
  createNodeWithId(
    id: string,
    type: NodeType,
    label: string,
    options: NodeBuildOptions = {},
  ): Node {
    const now = new Date();
    const normalizedLabel = this.entityNormalizer.normalizeLabel(label, type);

    const node: Node = {
      id,
      type,
      label,
      normalizedLabel,
      confidence: options.confidence ?? 1.0,
      source: options.source ?? 'UNKNOWN',
      metadata: options.metadata ?? {},
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: {
        createdBy: options.source ?? 'UNKNOWN',
        algorithmVersion: '1.0.0',
      },
    };

    return node;
  }

  /**
   * Create a Person node
   */
  createPerson(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.PERSON, name, options);
  }

  /**
   * Create a Candidate node
   */
  createCandidate(
    candidateId: string,
    name: string,
    options: NodeBuildOptions = {},
  ): Node {
    return this.createNodeWithId(candidateId, NodeType.CANDIDATE, name, {
      ...options,
      source: options.source ?? 'CANDIDATE_SERVICE',
    });
  }

  /**
   * Create a Recruiter node
   */
  createRecruiter(
    recruiterId: string,
    name: string,
    options: NodeBuildOptions = {},
  ): Node {
    return this.createNodeWithId(recruiterId, NodeType.RECRUITER, name, {
      ...options,
      source: options.source ?? 'RECRUITER_SERVICE',
    });
  }

  /**
   * Create a Job node
   */
  createJob(
    jobId: string,
    title: string,
    options: NodeBuildOptions = {},
  ): Node {
    return this.createNodeWithId(jobId, NodeType.JOB, title, {
      ...options,
      source: options.source ?? 'JOB_SERVICE',
    });
  }

  /**
   * Create a Company node
   */
  createCompany(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.COMPANY, name, options);
  }

  /**
   * Create a Skill node
   */
  createSkill(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.SKILL, name, options);
  }

  /**
   * Create a Soft Skill node
   */
  createSoftSkill(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.SOFT_SKILL, name, options);
  }

  /**
   * Create a Language node
   */
  createLanguage(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.LANGUAGE, name, options);
  }

  /**
   * Create a Certification node
   */
  createCertification(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.CERTIFICATION, name, options);
  }

  /**
   * Create an Education node
   */
  createEducation(degree: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.EDUCATION, degree, options);
  }

  /**
   * Create a Degree node
   */
  createDegree(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.DEGREE, name, options);
  }

  /**
   * Create a School node
   */
  createSchool(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.SCHOOL, name, options);
  }

  /**
   * Create an Experience node
   */
  createExperience(title: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.EXPERIENCE, title, options);
  }

  /**
   * Create a Project node
   */
  createProject(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.PROJECT, name, options);
  }

  /**
   * Create a Technology node
   */
  createTechnology(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.TECHNOLOGY, name, options);
  }

  /**
   * Create a Tool node
   */
  createTool(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.TOOL, name, options);
  }

  /**
   * Create a Framework node
   */
  createFramework(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.FRAMEWORK, name, options);
  }

  /**
   * Create a Methodology node
   */
  createMethodology(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.METHODOLOGY, name, options);
  }

  /**
   * Create a Responsibility node
   */
  createResponsibility(
    description: string,
    options: NodeBuildOptions = {},
  ): Node {
    return this.createNode(NodeType.RESPONSIBILITY, description, options);
  }

  /**
   * Create a Mission node
   */
  createMission(description: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.MISSION, description, options);
  }

  /**
   * Create an Achievement node
   */
  createAchievement(description: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.ACHIEVEMENT, description, options);
  }

  /**
   * Create a Location node
   */
  createLocation(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.LOCATION, name, options);
  }

  /**
   * Create an Industry node
   */
  createIndustry(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.INDUSTRY, name, options);
  }

  /**
   * Create a Salary Range node
   */
  createSalaryRange(range: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.SALARY_RANGE, range, options);
  }

  /**
   * Create a Contract Type node
   */
  createContractType(type: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.CONTRACT_TYPE, type, options);
  }

  /**
   * Create a Remote Policy node
   */
  createRemotePolicy(policy: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.REMOTE_POLICY, policy, options);
  }

  /**
   * Create a Sector node
   */
  createSector(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.SECTOR, name, options);
  }

  /**
   * Create a Role node
   */
  createRole(title: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.ROLE, title, options);
  }

  /**
   * Create a Career Path node
   */
  createCareerPath(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.CAREER_PATH, name, options);
  }

  /**
   * Create a Training node
   */
  createTraining(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.TRAINING, name, options);
  }

  /**
   * Create an Interview node
   */
  createInterview(interviewId: string, options: NodeBuildOptions = {}): Node {
    return this.createNodeWithId(
      interviewId,
      NodeType.INTERVIEW,
      `Interview ${interviewId}`,
      {
        ...options,
        source: options.source ?? 'INTERVIEW_SERVICE',
      },
    );
  }

  /**
   * Create a Question node
   */
  createQuestion(question: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.QUESTION, question, options);
  }

  /**
   * Create an Answer node
   */
  createAnswer(answer: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.ANSWER, answer, options);
  }

  /**
   * Create a Document node
   */
  createDocument(name: string, options: NodeBuildOptions = {}): Node {
    return this.createNode(NodeType.DOCUMENT, name, options);
  }

  /**
   * Update a node's metadata
   */
  updateNodeMetadata(node: Node, metadata: Partial<NodeMetadata>): Node {
    return {
      ...node,
      metadata: {
        ...node.metadata,
        ...metadata,
      },
      timestamps: {
        ...node.timestamps,
        updatedAt: new Date(),
      },
    };
  }

  /**
   * Update a node's confidence
   */
  updateNodeConfidence(node: Node, confidence: number): Node {
    return {
      ...node,
      confidence,
      timestamps: {
        ...node.timestamps,
        updatedAt: new Date(),
      },
    };
  }

  /**
   * Mark a node as deleted
   */
  markNodeDeleted(node: Node): Node {
    return {
      ...node,
      timestamps: {
        ...node.timestamps,
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  /**
   * Batch create nodes
   */
  batchCreateNodes(
    type: NodeType,
    labels: string[],
    options: NodeBuildOptions = {},
  ): Node[] {
    return labels.map((label) => this.createNode(type, label, options));
  }

  /**
   * Create nodes from array with custom options per node
   */
  batchCreateNodesWithCustomOptions(
    nodes: Array<{ type: NodeType; label: string; options?: NodeBuildOptions }>,
  ): Node[] {
    return nodes.map(({ type, label, options }) =>
      this.createNode(type, label, options),
    );
  }
}
