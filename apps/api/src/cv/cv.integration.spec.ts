import { Test, TestingModule } from '@nestjs/testing';
import { CvService } from './cv.service';
import { NormalizationService } from './normalization.service';
import { CvExtractorService } from './cv-extractor.service';
import { GraphPersistenceService } from './graph-persistence.service';
import { CandidateProfileRepository } from './candidate-profile.repository';
import { NodeBuilderService } from '../runtime/kg/node-builder.service';
import { EdgeBuilderService } from '../runtime/kg/edge-builder.service';
import { Graph } from '../runtime/kg/graph-types';
import { ExtractedCV } from './cv-extractor.service';

jest.mock('pdf-parse', () =>
  jest.fn().mockResolvedValue({ text: 'John Doe - Developer - JavaScript' }),
);
jest.mock('mammoth', () => ({
  extractRawText: jest.fn().mockResolvedValue({ value: 'Word content' }),
}));

describe('CV → Graph Integration', () => {
  let cvService: CvService;
  let normalizationService: NormalizationService;
  let cvExtractor: CvExtractorService;
  let graphPersistence: GraphPersistenceService;
  let candidateProfileRepo: CandidateProfileRepository;
  let nodeBuilder: NodeBuilderService;
  let edgeBuilder: EdgeBuilderService;

  const mockFile = {
    filename: 'test-cv.pdf',
    path: '/tmp/test-cv.pdf',
    mimetype: 'application/pdf',
    buffer: Buffer.from('test content'),
  };

  const mockGraph: Graph = {
    id: 'graph-1',
    nodes: new Map(),
    edges: new Map(),
    metadata: {
      version: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'cv',
    },
  };

  const mockExtractedCV: ExtractedCV = {
    id: 'cv-1',
    personalInfo: {
      id: 'p1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St',
    },
    experiences: [
      {
        id: 'e1',
        title: 'Software Developer',
        company: 'Tech Corp',
        location: 'San Francisco',
        startDate: '2020',
        endDate: '2023',
        current: false,
        description: 'Developed software',
        technologies: ['JavaScript', 'React'],
        methodologies: ['Agile'],
      },
    ],
    education: [],
    skills: [
      {
        id: 's1',
        name: 'JavaScript',
        type: 'technical',
        level: 'advanced',
        verified: false,
      },
    ],
    certifications: [],
    languages: [],
    companies: [],
    technologies: [],
    projects: [],
    extractionMetadata: {
      extractedAt: new Date(),
      sourceText: 'John Doe - Developer - JavaScript',
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

  const mockStats = {
    experienceCount: 1,
    educationCount: 1,
    skillCount: 1,
    certificationCount: 0,
    languageCount: 0,
    overallScore: 15,
  };

  const mockProfile = {
    id: 'profile-1',
    candidateId: 'candidate-1',
    personalInfo: mockExtractedCV.personalInfo,
    graphId: 'graph-1',
    stats: mockStats,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CvService,
        {
          provide: NormalizationService,
          useValue: {
            normalizeJob: jest.fn().mockReturnValue({
              normalized: 'Software Developer',
              id: 'job-1',
              confidence: 0.9,
            }),
            normalizeSkill: jest.fn().mockReturnValue({
              normalized: 'JavaScript',
              id: 'skill-1',
              confidence: 0.95,
            }),
            normalizeKnowledge: jest.fn().mockResolvedValue(mockExtractedCV),
          },
        },
        {
          provide: CvExtractorService,
          useValue: {
            extractFromText: jest.fn().mockReturnValue(mockExtractedCV),
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
          provide: CandidateProfileRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockProfile),
            calculateStats: jest.fn().mockResolvedValue(mockStats),
            findByCandidateId: jest.fn().mockResolvedValue(mockProfile),
          },
        },
        {
          provide: NodeBuilderService,
          useValue: {
            createCandidate: jest
              .fn()
              .mockReturnValue({ id: 'c1', type: 'CANDIDATE' }),
            createExperience: jest
              .fn()
              .mockReturnValue({ id: 'e1', type: 'EXPERIENCE' }),
            createEducation: jest
              .fn()
              .mockReturnValue({ id: 'edu1', type: 'EDUCATION' }),
            createSkill: jest.fn().mockReturnValue({ id: 's1', type: 'SKILL' }),
            createCertification: jest
              .fn()
              .mockReturnValue({ id: 'cert1', type: 'CERTIFICATION' }),
            createLanguage: jest
              .fn()
              .mockReturnValue({ id: 'l1', type: 'LANGUAGE' }),
            createCompany: jest
              .fn()
              .mockReturnValue({ id: 'comp1', type: 'COMPANY' }),
            createTechnology: jest
              .fn()
              .mockReturnValue({ id: 'tech1', type: 'TECHNOLOGY' }),
            createSchool: jest
              .fn()
              .mockReturnValue({ id: 'school1', type: 'SCHOOL' }),
            createProject: jest
              .fn()
              .mockReturnValue({ id: 'proj1', type: 'PROJECT' }),
          },
        },
        {
          provide: EdgeBuilderService,
          useValue: {
            createEdge: jest
              .fn()
              .mockReturnValue({ id: 'edge1', type: 'HAS_SKILL' }),
            createWorkedAt: jest
              .fn()
              .mockReturnValue({ id: 'edge2', type: 'WORKED_AT' }),
            createStudiedAt: jest
              .fn()
              .mockReturnValue({ id: 'edge3', type: 'STUDIED_AT' }),
            createHasSkill: jest
              .fn()
              .mockReturnValue({ id: 'edge4', type: 'HAS_SKILL' }),
            createHasCertification: jest
              .fn()
              .mockReturnValue({ id: 'edge5', type: 'HAS_CERTIFICATION' }),
            createHasLanguage: jest
              .fn()
              .mockReturnValue({ id: 'edge6', type: 'HAS_LANGUAGE' }),
            createUsesTech: jest
              .fn()
              .mockReturnValue({ id: 'edge7', type: 'USES_TECH' }),
            createHasProject: jest
              .fn()
              .mockReturnValue({ id: 'edge8', type: 'HAS_PROJECT' }),
          },
        },
      ],
    }).compile();

    cvService = module.get<CvService>(CvService);
    normalizationService =
      module.get<NormalizationService>(NormalizationService);
    cvExtractor = module.get<CvExtractorService>(CvExtractorService);
    graphPersistence = module.get<GraphPersistenceService>(
      GraphPersistenceService,
    );
    candidateProfileRepo = module.get<CandidateProfileRepository>(
      CandidateProfileRepository,
    );
    nodeBuilder = module.get<NodeBuilderService>(NodeBuilderService);
    edgeBuilder = module.get<EdgeBuilderService>(EdgeBuilderService);
  });

  it('should be defined', () => {
    expect(cvService).toBeDefined();
  });

  describe('CV → Graph Flow', () => {
    it('should process CV and create knowledge graph', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const result = await cvService.processCv(mockFile);

      expect(result).toBeDefined();
      expect(result.originalFile).toBe('test-cv.pdf');
      expect(result.text).toBeDefined();
      expect(result.extractedCV).toBeDefined();
      expect(result.normalizedCV).toBeDefined();
      expect(result.graph).toBeDefined();
      expect(result.profile).toBeDefined();
      expect(result.stats).toBeDefined();
    });

    it('should extract knowledge from CV text', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const result = await cvService.processCv(mockFile);

      expect(result.extractedCV).toBeDefined();
      expect(result.extractedCV.personalInfo).toBeDefined();
      expect(result.extractedCV.experiences).toBeDefined();
      expect(result.extractedCV.education).toBeDefined();
      expect(result.extractedCV.skills).toBeDefined();
    });

    it('should normalize knowledge using NormalizationService', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      await cvService.processCv(mockFile);

      expect(normalizationService.normalizeJob).toHaveBeenCalled();
      expect(normalizationService.normalizeSkill).toHaveBeenCalled();
    });

    it('should persist graph using GraphPersistenceService', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      await cvService.processCv(mockFile);

      expect(graphPersistence.persistGraph).toHaveBeenCalled();
    });

    it('should generate candidate profile from graph', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const result = await cvService.processCv(mockFile);

      expect(result.profile).toBeDefined();
      expect(result.profile.stats).toBeDefined();
      expect(result.profile.stats.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle PDF files', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const pdfFile = { ...mockFile, mimetype: 'application/pdf' };
      const result = await cvService.processCv(pdfFile);

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
      const result = await cvService.processCv(wordFile);

      expect(result.text).toBeDefined();
    });

    it('should throw error for unsupported file types', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest
        .spyOn(require('fs'), 'readFileSync')
        .mockReturnValue(Buffer.from('test content'));

      const unsupportedFile = { ...mockFile, mimetype: 'image/png' };

      await expect(cvService.processCv(unsupportedFile)).rejects.toThrow(
        'Unsupported file type',
      );
    });

    it('should throw error when file not found', async () => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);

      await expect(cvService.processCv(mockFile)).rejects.toThrow(
        'File not found',
      );
    });
  });
});
