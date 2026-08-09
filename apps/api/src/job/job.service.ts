import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { JobNormalizationService } from './job-normalization.service';
import { JobExtractorService, ExtractedJob } from './job-extractor.service';
import { GraphPersistenceService } from '../cv/graph-persistence.service';
import { NodeBuilderService } from '../runtime/kg/node-builder.service';
import { EdgeBuilderService } from '../runtime/kg/edge-builder.service';
import { NodeType, EdgeType } from '../runtime/kg/graph-types';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { Graph } from '../runtime/kg/graph-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JobService {
  constructor(
    private readonly jobNormalizationService: JobNormalizationService,
    private readonly jobExtractor: JobExtractorService,
    private readonly graphPersistence: GraphPersistenceService,
    private readonly nodeBuilder: NodeBuilderService,
    private readonly edgeBuilder: EdgeBuilderService,
    private readonly graphSearchService: GraphSearchService,
    private readonly graphMatchingService: GraphMatchingService,
  ) {}

  async processJob(file: any, userId?: string) {
    const jobId = uuidv4();

    const text = await this.extractText(file);
    const extractedJob = this.jobExtractor.extractFromText(text);
    const normalizedJob = this.normalizeJob(extractedJob);

    const { nodes, edges } = this.buildGraphFromExtractedData(
      jobId,
      normalizedJob,
    );

    const persistenceResult = await this.graphPersistence.persistGraph(
      nodes,
      edges,
      {
        sourceDocument: file.filename,
      },
    );

    const profile = await this.generateProfile({
      id: jobId,
      nodes: new Map(persistenceResult.nodes.map((n) => [n.id, n])),
      edges: new Map(persistenceResult.edges.map((e) => [e.id, e])),
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'job-service',
        userId: userId, // Store userId for ownership tracking
      },
    });

    return {
      jobId,
      originalFile: file.filename,
      text,
      extractedJob,
      normalizedJob,
      graph: {
        nodes: persistenceResult.nodes,
        edges: persistenceResult.edges,
      },
      profile,
      stats: persistenceResult.stats,
    };
  }

  private async extractText(file: any): Promise<string> {
    const filePath = file.path;

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = file.mimetype;

    try {
      if (mimeType === 'application/pdf') {
        const data = await pdf(fileBuffer);
        return data.text;
      } else if (
        mimeType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value;
      } else if (mimeType === 'text/plain') {
        return fileBuffer.toString('utf-8');
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      throw new Error(`Failed to extract text: ${(error as Error).message}`);
    }
  }

  private normalizeJob(extractedJob: ExtractedJob): ExtractedJob {
    const normalizedSkills = [
      ...extractedJob.requiredSkills,
      ...extractedJob.preferredSkills,
    ].map((skill) => {
      const normalizedSkill = this.jobNormalizationService.normalizeSkill(
        skill.name,
      );
      return {
        ...skill,
        name: normalizedSkill.normalizedValue,
        skillId: normalizedSkill.knowledgePackId,
        confidence: normalizedSkill.confidence,
      };
    });

    return {
      ...extractedJob,
      requiredSkills: normalizedSkills.filter((s) => s.type === 'required'),
      preferredSkills: normalizedSkills.filter((s) => s.type === 'preferred'),
      softSkills: extractedJob.softSkills,
    };
  }

  private buildGraphFromExtractedData(jobId: string, job: ExtractedJob) {
    const nodes: any[] = [];
    const edges: any[] = [];

    const jobNode = this.nodeBuilder.createJob(jobId, job.jobInfo.title, {
      metadata: {
        ...job.jobInfo,
        jobId,
      },
      source: 'JOB_EXTRACTOR',
    });
    nodes.push(jobNode);

    job.requiredSkills.forEach((skill) => {
      const skillNode = this.nodeBuilder.createSkill(skill.name, {
        metadata: {
          ...skill,
          type: 'required',
          jobId,
        },
        source: 'JOB_EXTRACTOR',
      });
      nodes.push(skillNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.REQUIRES_SKILL,
          jobNode.id,
          skillNode.id,
          {
            metadata: { level: skill.level, required: true },
          },
        ),
      );
    });

    job.preferredSkills.forEach((skill) => {
      const skillNode = this.nodeBuilder.createSkill(skill.name, {
        metadata: {
          ...skill,
          type: 'preferred',
          jobId,
        },
        source: 'JOB_EXTRACTOR',
      });
      nodes.push(skillNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.REQUIRES_SKILL,
          jobNode.id,
          skillNode.id,
          {
            metadata: { level: skill.level, required: false },
          },
        ),
      );
    });

    job.softSkills.forEach((skill) => {
      const skillNode = this.nodeBuilder.createSoftSkill(skill.name, {
        metadata: {
          ...skill,
          jobId,
        },
        source: 'JOB_EXTRACTOR',
      });
      nodes.push(skillNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.REQUIRES_SKILL,
          jobNode.id,
          skillNode.id,
          {
            metadata: { level: skill.level, type: 'soft' },
          },
        ),
      );
    });

    job.languages.forEach((lang) => {
      const langNode = this.nodeBuilder.createLanguage(lang.name, {
        metadata: {
          ...lang,
          jobId,
        },
        source: 'JOB_EXTRACTOR',
      });
      nodes.push(langNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.REQUIRES_LANGUAGE,
          jobNode.id,
          langNode.id,
          {
            metadata: { level: lang.level, required: lang.required },
          },
        ),
      );
    });

    job.technologies.forEach((tech) => {
      const techNode = this.nodeBuilder.createTechnology(tech.name, {
        metadata: {
          ...tech,
          jobId,
        },
        source: 'JOB_EXTRACTOR',
      });
      nodes.push(techNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.REQUIRES_SKILL,
          jobNode.id,
          techNode.id,
          {
            metadata: { required: tech.required },
          },
        ),
      );
    });

    job.tools.forEach((tool) => {
      const toolNode = this.nodeBuilder.createTool(tool.name, {
        metadata: {
          ...tool,
          jobId,
        },
        source: 'JOB_EXTRACTOR',
      });
      nodes.push(toolNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.REQUIRES_SKILL,
          jobNode.id,
          toolNode.id,
          {
            metadata: { required: tool.required },
          },
        ),
      );
    });

    job.methodologies.forEach((method) => {
      const methodNode = this.nodeBuilder.createMethodology(method.name, {
        metadata: {
          ...method,
          jobId,
        },
        source: 'JOB_EXTRACTOR',
      });
      nodes.push(methodNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.REQUIRES_SKILL,
          jobNode.id,
          methodNode.id,
          {
            metadata: { required: method.required },
          },
        ),
      );
    });

    job.companies.forEach((company) => {
      const companyNode = this.nodeBuilder.createCompany(company.name, {
        metadata: {
          ...company,
          jobId,
        },
        source: 'JOB_EXTRACTOR',
      });
      nodes.push(companyNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.OFFERED_BY,
          jobNode.id,
          companyNode.id,
        ),
      );
    });

    if (job.salary) {
      const salaryNode = this.nodeBuilder.createSalaryRange(
        `${job.salary.min}-${job.salary.max}`,
        {
          metadata: {
            ...job.salary,
            jobId,
          },
          source: 'JOB_EXTRACTOR',
        },
      );
      nodes.push(salaryNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.HAS_SALARY,
          jobNode.id,
          salaryNode.id,
        ),
      );
    }

    if (job.contract) {
      const contractNode = this.nodeBuilder.createContractType(
        job.contract.type,
        {
          metadata: {
            ...job.contract,
            jobId,
          },
          source: 'JOB_EXTRACTOR',
        },
      );
      nodes.push(contractNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.HAS_CONTRACT,
          jobNode.id,
          contractNode.id,
        ),
      );
    }

    if (job.remote) {
      const remoteNode = this.nodeBuilder.createRemotePolicy(
        job.remote.policy,
        {
          metadata: {
            ...job.remote,
            jobId,
          },
          source: 'JOB_EXTRACTOR',
        },
      );
      nodes.push(remoteNode);

      edges.push(
        this.edgeBuilder.createEdge(
          EdgeType.ALLOWS_REMOTE,
          jobNode.id,
          remoteNode.id,
        ),
      );
    }

    return { nodes, edges };
  }

  async extractKnowledge(text: string) {
    return this.jobExtractor.extractFromText(text);
  }

  async normalizeKnowledge(knowledge: any) {
    return this.jobNormalizationService.normalizeJobKnowledge(knowledge);
  }

  async buildGraph(normalizedKnowledge: any) {
    const jobId = uuidv4();
    const { nodes, edges } = this.buildGraphFromExtractedData(
      jobId,
      normalizedKnowledge,
    );

    const persistenceResult = await this.graphPersistence.persistGraph(
      nodes,
      edges,
    );

    return {
      id: jobId,
      nodes: new Map(persistenceResult.nodes.map((n) => [n.id, n])),
      edges: new Map(persistenceResult.edges.map((e) => [e.id, e])),
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'job-service',
      },
    };
  }

  async generateProfile(graph: any) {
    const nodesArray = Array.from(graph.nodes?.values() || []);
    const jobNode = nodesArray.find((n: any) => n.type === 'JOB');
    const skillNodes = nodesArray.filter((n: any) => n.type === 'SKILL');
    const languageNodes = nodesArray.filter((n: any) => n.type === 'LANGUAGE');
    const certificationNodes = nodesArray.filter(
      (n: any) => n.type === 'CERTIFICATION',
    );

    const profileId = `job_profile_${Date.now()}`;

    return {
      profileId,
      job: (jobNode as any)?.metadata || {},
      requiredSkills: skillNodes
        .filter((e: any) => e.metadata?.type === 'required')
        .map((e: any) => e.metadata),
      preferredSkills: skillNodes
        .filter((e: any) => e.metadata?.type === 'preferred')
        .map((e: any) => e.metadata),
      softSkills: skillNodes
        .filter((e: any) => e.metadata?.type === 'soft')
        .map((e: any) => e.metadata),
      languages: languageNodes.map((e: any) => e.metadata),
      certifications: certificationNodes.map((e: any) => e.metadata),
      metadata: graph.metadata,
    };
  }

  async searchJobs(
    jobGraph: Graph,
    candidateGraphs: Graph[],
    options: { limit?: number } = {},
  ) {
    return this.graphSearchService.searchJobsByNeighborhood(
      jobGraph,
      candidateGraphs,
      options,
    );
  }

  async searchCandidates(
    candidateGraph: Graph,
    jobGraphs: Graph[],
    options: { limit?: number } = {},
  ) {
    return this.graphSearchService.searchCandidatesByNeighborhood(
      candidateGraph,
      jobGraphs,
      options,
    );
  }

  async match(candidateGraph: Graph, jobGraph: Graph) {
    return this.graphMatchingService.match(candidateGraph, jobGraph);
  }

  async findSimilarJobs(
    jobGraph: Graph,
    jobGraphs: Graph[],
    options: { limit?: number } = {},
  ) {
    return this.graphSearchService.findSimilarJobs(
      jobGraph,
      jobGraphs,
      options,
    );
  }
}
