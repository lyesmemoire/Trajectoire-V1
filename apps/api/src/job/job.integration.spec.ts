import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { JobNormalizationService } from './job-normalization.service';
import { JobExtractorService, ExtractedJob } from './job-extractor.service';
import { GraphPersistenceService } from '../cv/graph-persistence.service';
import { NodeBuilderService } from '../runtime/kg/node-builder.service';
import { EdgeBuilderService } from '../runtime/kg/edge-builder.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { Graph } from '../runtime/kg/graph-types';

jest.mock('pdf-parse', () =>
  jest
    .fn()
    .mockResolvedValue({ text: 'Software Developer - JavaScript - React' }),
);
jest.mock('mammoth', () => ({
  extractRawText: jest
    .fn()
    .mockResolvedValue({ value: 'Software Developer - JavaScript - React' }),
}));

describe('Job → Graph Integration', () => {
  let jobService: JobService;
  let jobNormalizationService: JobNormalizationService;
  let jobExtractor: JobExtractorService;
  let graphPersistence: GraphPersistenceService;
  let nodeBuilder: NodeBuilderService;
  let edgeBuilder: EdgeBuilderService;
  let graphSearchService: GraphSearchService;
  let graphMatchingService: GraphMatchingService;

  const mockFile = {
    filename: 'test-job.pdf',
    path: '/tmp/test-job.pdf',
    mimetype: 'application/pdf',
    buffer: Buffer.from('test content'),
  };

  const mockExtractedJob: ExtractedJob = {
    id: 'job-1',
    jobInfo: {
      id: 'j1',
      title: 'Software Developer',
      jobFamily: 'Engineering',
      seniority: 'Senior',
      description: 'Develop software applications',
      location: 'Paris',
      remoteWork: true,
      contractType: 'CDI',
      availability: 'Immediate',
      salary: '50k-70k',
      benefits: ['Health insurance', 'Remote work'],
      sector: 'Technology',
      team: 'Engineering',
    },
    requiredSkills: [
      {
        id: 's1',
        name: 'JavaScript',
        type: 'required',
        level: 'advanced',
        yearsExperience: 3,
      },
    ],
    preferredSkills: [
      {
        id: 's2',
        name: 'TypeScript',
        type: 'preferred',
        level: 'intermediate',
      },
    ],
    softSkills: [
      {
        id: 's3',
        name: 'Communication',
        type: 'soft',
        level: 'advanced',
      },
    ],
    languages: [],
    education: [],
    experience: [],
    companies: [],
    technologies: [],
    tools: [],
    methodologies: [],
    responsibilities: [],
    missions: [],
    salary: {
      id: 'sal1',
      min: 50000,
      max: 70000,
      currency: 'EUR',
      period: 'yearly',
    },
    contract: {
      id: 'c1',
      type: 'CDI',
    },
    remote: {
      id: 'r1',
      allowed: true,
      policy: 'hybrid',
      daysPerWeek: 2,
    },
    extractionMetadata: {
      extractedAt: new Date(),
      sourceText: 'Software Developer - JavaScript - React',
      confidence: 0.8,
    },
  };

  const mockPersistedNodes: any[] = [];
  const mockPersistedEdges: any[] = [];

  const mockPersistenceResult = {
    nodes: mockPersistedNodes,
    edges: mockPersistedEdges,
    stats: {
      nodesCreated: 5,
      nodesUpdated: 0,
      edgesCreated: 3,
      edgesUpdated: 0,
    },
  };

  const mockGraph: Graph = {
    id: 'graph-1',
    nodes: new Map(),
    edges: new Map(),
    metadata: {
      version: '2.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'job-service',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: JobNormalizationService,
          useValue: {
            normalizeJobKnowledge: jest.fn().mockReturnValue(mockExtractedJob),
            normalizeSkill: jest.fn().mockReturnValue({
              rawValue: 'JavaScript',
              normalizedValue: 'javascript',
              confidence: 0.95,
              synonyms: [],
              variants: [],
              knowledgePackId: 'skill-1',
            }),
          },
        },
        {
          provide: JobExtractorService,
          useValue: {
            extractFromText: jest.fn().mockReturnValue(mockExtractedJob),
          },
        },
        {
          provide: GraphPersistenceService,
          useValue: {
            persistGraph: jest.fn().mockResolvedValue(mockPersistenceResult),
            getNode: jest.fn(),
            getCandidateNodes: jest.fn().mockResolvedValue([]),
            getCandidateEdges: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: NodeBuilderService,
          useValue: {
            createJob: jest.fn().mockReturnValue({ id: 'j1', type: 'JOB' }),
            createSkill: jest.fn().mockReturnValue({ id: 's1', type: 'SKILL' }),
            createSoftSkill: jest
              .fn()
              .mockReturnValue({ id: 's2', type: 'SOFT_SKILL' }),
            createLanguage: jest
              .fn()
              .mockReturnValue({ id: 'l1', type: 'LANGUAGE' }),
            createTechnology: jest
              .fn()
              .mockReturnValue({ id: 't1', type: 'TECHNOLOGY' }),
            createTool: jest.fn().mockReturnValue({ id: 'to1', type: 'TOOL' }),
            createMethodology: jest
              .fn()
              .mockReturnValue({ id: 'm1', type: 'METHODOLOGY' }),
            createCompany: jest
              .fn()
              .mockReturnValue({ id: 'c1', type: 'COMPANY' }),
            createSalaryRange: jest
              .fn()
              .mockReturnValue({ id: 'sal1', type: 'SALARY_RANGE' }),
            createContractType: jest
              .fn()
              .mockReturnValue({ id: 'ct1', type: 'CONTRACT_TYPE' }),
            createRemotePolicy: jest
              .fn()
              .mockReturnValue({ id: 'rp1', type: 'REMOTE_POLICY' }),
          },
        },
        {
          provide: EdgeBuilderService,
          useValue: {
            createEdge: jest
              .fn()
              .mockReturnValue({ id: 'edge1', type: 'REQUIRES_SKILL' }),
            createRequiresSkill: jest
              .fn()
              .mockReturnValue({ id: 'edge2', type: 'REQUIRES_SKILL' }),
            createRequiresLanguage: jest
              .fn()
              .mockReturnValue({ id: 'edge3', type: 'REQUIRES_LANGUAGE' }),
            createUsesTech: jest
              .fn()
              .mockReturnValue({ id: 'edge4', type: 'USES_TECH' }),
            createUsesTool: jest
              .fn()
              .mockReturnValue({ id: 'edge5', type: 'USES_TOOL' }),
            createOfferedBy: jest
              .fn()
              .mockReturnValue({ id: 'edge6', type: 'OFFERED_BY' }),
            createHasSalary: jest
              .fn()
              .mockReturnValue({ id: 'edge7', type: 'HAS_SALARY' }),
            createHasContract: jest
              .fn()
              .mockReturnValue({ id: 'edge8', type: 'HAS_CONTRACT' }),
            createAllowsRemote: jest
              .fn()
              .mockReturnValue({ id: 'edge9', type: 'ALLOWS_REMOTE' }),
          },
        },
        {
          provide: GraphSearchService,
          useValue: {
            searchJobsByNeighborhood: jest.fn().mockResolvedValue([]),
            searchCandidatesByNeighborhood: jest.fn().mockResolvedValue([]),
            findSimilarJobs: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: GraphMatchingService,
          useValue: {
            match: jest.fn().mockResolvedValue({
              candidateId: 'c1',
              jobId: 'j1',
              score: {
                overall: 85,
                skills: 90,
                experience: 80,
                education: 75,
                location: 100,
                transferability: 70,
              },
              transferableSkills: [],
              neighborhood: {
                candidateNeighbors: [],
                jobNeighbors: [],
                commonNeighbors: [],
                overlap: 0,
              },
              distance: {
                skillDistance: 10,
                experienceDistance: 20,
                overallDistance: 15,
              },
              centrality: {
                candidateCentrality: 50,
                jobCentrality: 60,
                alignment: 90,
              },
              matchedSkills: [],
              missingSkills: [],
              strengths: [],
              weaknesses: [],
              recommendations: [],
            }),
          },
        },
      ],
    }).compile();

    jobService = module.get<JobService>(JobService);
    jobNormalizationService = module.get<JobNormalizationService>(
      JobNormalizationService,
    );
    jobExtractor = module.get<JobExtractorService>(JobExtractorService);
    graphPersistence = module.get<GraphPersistenceService>(
      GraphPersistenceService,
    );
    nodeBuilder = module.get<NodeBuilderService>(NodeBuilderService);
    edgeBuilder = module.get<EdgeBuilderService>(EdgeBuilderService);
    graphSearchService = module.get<GraphSearchService>(GraphSearchService);
    graphMatchingService =
      module.get<GraphMatchingService>(GraphMatchingService);
  });

  it('should be defined', () => {
    expect(jobService).toBeDefined();
  });

  describe('Job → Graph Flow', () => {
    it('should process job and create knowledge graph', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const result = await jobService.processJob(mockFile);

      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.originalFile).toBe('test-job.pdf');
      expect(result.text).toBeDefined();
      expect(result.extractedJob).toBeDefined();
      expect(result.normalizedJob).toBeDefined();
      expect(result.graph).toBeDefined();
      expect(result.profile).toBeDefined();
      expect(result.stats).toBeDefined();
    });

    it('should extract knowledge from job text', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const result = await jobService.processJob(mockFile);

      expect(result.extractedJob).toBeDefined();
      expect(result.extractedJob.jobInfo).toBeDefined();
      expect(result.extractedJob.requiredSkills).toBeDefined();
      expect(result.extractedJob.preferredSkills).toBeDefined();
      expect(result.extractedJob.softSkills).toBeDefined();
    });

    it('should normalize knowledge using JobNormalizationService', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      await jobService.processJob(mockFile);

      expect(jobNormalizationService.normalizeSkill).toHaveBeenCalled();
    });

    it('should persist graph using GraphPersistenceService', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      await jobService.processJob(mockFile);

      expect(graphPersistence.persistGraph).toHaveBeenCalled();
    });

    it('should generate job profile from graph', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const result = await jobService.processJob(mockFile);

      expect(result.profile).toBeDefined();
      expect(result.profile.profileId).toBeDefined();
    });

    it('should handle PDF files', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const pdfFile = { ...mockFile, mimetype: 'application/pdf' };
      const result = await jobService.processJob(pdfFile);

      expect(result.text).toBeDefined();
    });

    it('should handle Word documents', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const wordFile = {
        ...mockFile,
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
      const result = await jobService.processJob(wordFile);

      expect(result.text).toBeDefined();
    });

    it('should throw error for unsupported file types', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const unsupportedFile = { ...mockFile, mimetype: 'image/png' };

      await expect(jobService.processJob(unsupportedFile)).rejects.toThrow(
        'Unsupported file type',
      );
    });

    it('should throw error when file not found', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);

      await expect(jobService.processJob(mockFile)).rejects.toThrow(
        'File not found',
      );
    });
  });

  describe('Search and Matching', () => {
    it('should search jobs by neighborhood', async () => {
      const result = await jobService.searchJobs(mockGraph, []);

      expect(graphSearchService.searchJobsByNeighborhood).toHaveBeenCalledWith(
        mockGraph,
        [],
        {},
      );
      expect(result).toBeDefined();
    });

    it('should search candidates by neighborhood', async () => {
      const result = await jobService.searchCandidates(mockGraph, []);

      expect(
        graphSearchService.searchCandidatesByNeighborhood,
      ).toHaveBeenCalledWith(mockGraph, [], {});
      expect(result).toBeDefined();
    });

    it('should match candidate to job', async () => {
      const result = await jobService.match(mockGraph, mockGraph);

      expect(graphMatchingService.match).toHaveBeenCalledWith(
        mockGraph,
        mockGraph,
      );
      expect(result).toBeDefined();
    });

    it('should find similar jobs', async () => {
      const result = await jobService.findSimilarJobs(mockGraph, []);

      expect(graphSearchService.findSimilarJobs).toHaveBeenCalledWith(
        mockGraph,
        [],
        {},
      );
      expect(result).toBeDefined();
    });
  });
});
