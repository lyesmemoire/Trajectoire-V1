/**
 * COPILOT CONTEXT SERVICE
 * Loads real business context (CV, Job, Graph) from database for Copilot
 */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';
import { Graph, Node, Edge, NodeType, EdgeType } from '../runtime/kg/graph-types';
import { GraphRepository } from '../runtime/kg/graph-repository.service';
import { GraphPersistenceService } from '../cv/graph-persistence.service';
import { v4 as uuidv4 } from 'uuid';

export interface CopilotContext {
  userId: string;
  cvId?: string;
  jobId?: string;
  graph?: Graph;
  cvData?: any;
  jobData?: any;
}

export interface CopilotRequestContext {
  cvId?: string;
  jobId?: string;
}

@Injectable()
export class CopilotContextService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly graphRepository: GraphRepository,
    private readonly graphPersistence: GraphPersistenceService,
  ) {}

  /**
   * Load copilot context with real business data
   */
  async loadCopilotContext(
    userId: string,
    context: CopilotRequestContext = {},
  ): Promise<CopilotContext> {
    const copilotContext: CopilotContext = {
      userId,
    };

    // Load CV if specified
    if (context.cvId) {
      const cv = await this.loadCVWithOwnership(userId, context.cvId);
      copilotContext.cvId = cv.id;
      copilotContext.cvData = cv.cvData;

      // Build or load graph from CV
      const graph = await this.buildOrLoadGraphFromCV(cv.id, cv.cvData);
      copilotContext.graph = graph;
    }

    // Load Job if specified
    if (context.jobId) {
      const job = await this.loadJobWithOwnership(userId, context.jobId);
      copilotContext.jobId = job.id;
      copilotContext.jobData = job.cvData;

      // Merge job into graph if CV graph exists
      if (copilotContext.graph) {
        copilotContext.graph = await this.mergeJobIntoGraph(
          copilotContext.graph,
          job.cvData,
        );
      }
    }

    // If no CV or Job specified, try to load user's latest CV
    if (!context.cvId && !context.jobId) {
      const latestCV = await this.prisma.cVAnalysis.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (latestCV) {
        copilotContext.cvId = latestCV.id;
        copilotContext.cvData = latestCV.cvData;
        const graph = await this.buildOrLoadGraphFromCV(
          latestCV.id,
          latestCV.cvData,
        );
        copilotContext.graph = graph;
      }
    }

    return copilotContext;
  }

  /**
   * Load CV with ownership verification
   */
  private async loadCVWithOwnership(userId: string, cvId: string) {
    const cv = await this.prisma.cVAnalysis.findUnique({
      where: { id: cvId },
    });

    if (!cv) {
      throw new NotFoundException(`CV not found: ${cvId}`);
    }

    if (cv.userId !== userId) {
      throw new ForbiddenException(`Access denied to CV: ${cvId}`);
    }

    return cv;
  }

  /**
   * Load Job with ownership verification
   */
  private async loadJobWithOwnership(userId: string, jobId: string) {
    // Jobs are stored as CVAnalysis with type JOB
    const job = await this.prisma.cVAnalysis.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job not found: ${jobId}`);
    }

    if (job.userId !== userId) {
      throw new ForbiddenException(`Access denied to Job: ${jobId}`);
    }

    return job;
  }

  /**
   * Build or load graph from CV data with ownership verification
   */
  private async buildOrLoadGraphFromCV(cvId: string, cvData: any, userId?: string): Promise<Graph> {
    // Try to load existing graph for this CV
    try {
      const graphs = await this.graphRepository.listGraphs({ source: 'CV_PARSER' }, userId || 'system');
      const existingGraph = graphs.find(g => g.metadata.cvId === cvId);

      if (existingGraph && existingGraph.nodes.size > 0) {
        return existingGraph;
      }
    } catch (error) {
      // If loading fails, build new graph
    }

    // Build new graph from CV data
    return this.buildGraphFromCVData(cvId, cvData, userId);
  }

  /**
   * Build graph from CV data with ownership tracking
   */
  private buildGraphFromCVData(cvId: string, cvData: any, userId?: string): Graph {
    const graph: Graph = {
      id: uuidv4(),
      nodes: new Map(),
      edges: new Map(),
      metadata: {
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'CV_PARSER',
        cvId,
        userId, // Track userId for ownership
      },
    };

    const now = new Date();
    const timestamp = now.getTime();

    // Create candidate node
    const candidateId = `candidate_${cvId}`;
    const candidateNode: Node = {
      id: candidateId,
      type: NodeType.CANDIDATE,
      label: 'Candidate',
      normalizedLabel: 'candidate',
      confidence: 1.0,
      source: 'CV_PARSER',
      metadata: { cvId, userId },
      timestamps: { createdAt: now, updatedAt: now },
      provenance: {
        createdBy: 'SYSTEM',
        algorithmVersion: '1.0.0',
        sourceDocument: cvId,
      },
    };
    graph.nodes.set(candidateId, candidateNode);

    // Extract skills from CV data
    const skills = cvData.skills || [];
    for (const skill of skills) {
      const skillId = `skill_${cvId}_${skill.toLowerCase().replace(/\s+/g, '_')}`;
      const skillNode: Node = {
        id: skillId,
        type: NodeType.SKILL,
        label: skill,
        normalizedLabel: skill.toLowerCase(),
        confidence: 0.9,
        source: 'CV_PARSER',
        metadata: { cvId },
        timestamps: { createdAt: now, updatedAt: now },
        provenance: {
          createdBy: 'SYSTEM',
          algorithmVersion: '1.0.0',
          sourceDocument: cvId,
        },
      };
      graph.nodes.set(skillId, skillNode);

      // Create HAS_SKILL edge
      const edgeId = `edge_${candidateId}_${skillId}`;
      const edge: Edge = {
        id: edgeId,
        type: EdgeType.HAS_SKILL,
        sourceNode: candidateId,
        targetNode: skillId,
        weight: 1.0,
        confidence: 0.9,
        reason: 'CV contains this skill',
        metadata: { cvId },
        timestamps: { createdAt: now, updatedAt: now },
        provenance: {
          createdBy: 'SYSTEM',
          algorithmVersion: '1.0.0',
          sourceDocument: cvId,
        },
      };
      graph.edges.set(edgeId, edge);
    }

    // Extract experience from CV data
    const experience = cvData.experience;
    if (experience) {
      const expId = `experience_${cvId}`;
      const expNode: Node = {
        id: expId,
        type: NodeType.EXPERIENCE,
        label: experience,
        normalizedLabel: experience.toLowerCase(),
        confidence: 0.85,
        source: 'CV_PARSER',
        metadata: { cvId },
        timestamps: { createdAt: now, updatedAt: now },
        provenance: {
          createdBy: 'SYSTEM',
          algorithmVersion: '1.0.0',
          sourceDocument: cvId,
        },
      };
      graph.nodes.set(expId, expNode);

      // Create HAS_EXPERIENCE edge
      const expEdgeId = `edge_${candidateId}_${expId}`;
      const expEdge: Edge = {
        id: expEdgeId,
        type: EdgeType.WORKED_AT,
        sourceNode: candidateId,
        targetNode: expId,
        weight: 1.0,
        confidence: 0.85,
        reason: 'CV contains this experience',
        metadata: { cvId },
        timestamps: { createdAt: now, updatedAt: now },
        provenance: {
          createdBy: 'SYSTEM',
          algorithmVersion: '1.0.0',
          sourceDocument: cvId,
        },
      };
      graph.edges.set(expEdgeId, expEdge);
    }

    // Extract education from CV data
    const education = cvData.education;
    if (education) {
      const eduId = `education_${cvId}`;
      const eduNode: Node = {
        id: eduId,
        type: NodeType.EDUCATION,
        label: education,
        normalizedLabel: education.toLowerCase(),
        confidence: 0.9,
        source: 'CV_PARSER',
        metadata: { cvId },
        timestamps: { createdAt: now, updatedAt: now },
        provenance: {
          createdBy: 'SYSTEM',
          algorithmVersion: '1.0.0',
          sourceDocument: cvId,
        },
      };
      graph.nodes.set(eduId, eduNode);

      // Create STUDIED_AT edge
      const eduEdgeId = `edge_${candidateId}_${eduId}`;
      const eduEdge: Edge = {
        id: eduEdgeId,
        type: EdgeType.STUDIED_AT,
        sourceNode: candidateId,
        targetNode: eduId,
        weight: 1.0,
        confidence: 0.9,
        reason: 'CV contains this education',
        metadata: { cvId },
        timestamps: { createdAt: now, updatedAt: now },
        provenance: {
          createdBy: 'SYSTEM',
          algorithmVersion: '1.0.0',
          sourceDocument: cvId,
        },
      };
      graph.edges.set(eduEdgeId, eduEdge);
    }

    return graph;
  }

  /**
   * Merge job requirements into graph
   */
  private async mergeJobIntoGraph(graph: Graph, jobData: any): Promise<Graph> {
    const now = new Date();
    const jobId = jobData.id || 'unknown_job';

    // Create job node
    const jobNodeId = `job_${jobId}`;
    const jobNode: Node = {
      id: jobNodeId,
      type: NodeType.JOB,
      label: jobData.title || 'Job',
      normalizedLabel: (jobData.title || 'job').toLowerCase(),
      confidence: 1.0,
      source: 'JOB_EXTRACTOR',
      metadata: { jobId },
      timestamps: { createdAt: now, updatedAt: now },
      provenance: {
        createdBy: 'SYSTEM',
        algorithmVersion: '1.0.0',
        sourceDocument: jobId,
      },
    };
    graph.nodes.set(jobNodeId, jobNode);

    // Extract job requirements
    const requirements = jobData.requirements || jobData.skills || [];
    for (const req of requirements) {
      const reqId = `req_${jobId}_${req.toLowerCase().replace(/\s+/g, '_')}`;
      const reqNode: Node = {
        id: reqId,
        type: NodeType.SKILL,
        label: req,
        normalizedLabel: req.toLowerCase(),
        confidence: 1.0,
        source: 'JOB_EXTRACTOR',
        metadata: { jobId },
        timestamps: { createdAt: now, updatedAt: now },
        provenance: {
          createdBy: 'SYSTEM',
          algorithmVersion: '1.0.0',
          sourceDocument: jobId,
        },
      };
      graph.nodes.set(reqId, reqNode);

      // Create REQUIRES_SKILL edge
      const edgeId = `edge_${jobNodeId}_${reqId}`;
      const edge: Edge = {
        id: edgeId,
        type: EdgeType.REQUIRES_SKILL,
        sourceNode: jobNodeId,
        targetNode: reqId,
        weight: 1.0,
        confidence: 1.0,
        reason: 'Job requires this skill',
        metadata: { jobId },
        timestamps: { createdAt: now, updatedAt: now },
        provenance: {
          createdBy: 'SYSTEM',
          algorithmVersion: '1.0.0',
          sourceDocument: jobId,
        },
      };
      graph.edges.set(edgeId, edge);
    }

    return graph;
  }
}
