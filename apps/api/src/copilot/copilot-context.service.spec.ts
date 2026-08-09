import { Test, TestingModule } from '@nestjs/testing';
import { CopilotContextService } from './copilot-context.service';
import { PrismaService } from '../runtime/kg/prisma.service';
import { GraphRepository } from '../runtime/kg/graph-repository.service';
import { GraphPersistenceService } from '../cv/graph-persistence.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CopilotContextService', () => {
  let service: CopilotContextService;
  let prismaService: PrismaService;
  let graphRepository: GraphRepository;
  let graphPersistence: GraphPersistenceService;

  const mockPrismaService = {
    cVAnalysis: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockGraphRepository = {
    listGraphs: jest.fn(),
  };

  const mockGraphPersistence = {
    persistGraph: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CopilotContextService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: GraphRepository,
          useValue: mockGraphRepository,
        },
        {
          provide: GraphPersistenceService,
          useValue: mockGraphPersistence,
        },
      ],
    }).compile();

    service = module.get<CopilotContextService>(CopilotContextService);
    prismaService = module.get<PrismaService>(PrismaService);
    graphRepository = module.get<GraphRepository>(GraphRepository);
    graphPersistence = module.get<GraphPersistenceService>(GraphPersistenceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadCopilotContext', () => {
    it('should load context with CV and build graph', async () => {
      const userId = 'user123';
      const cvId = 'cv123';
      const cvData = {
        skills: ['TypeScript', 'NestJS', 'PostgreSQL'],
        experience: '5 years',
        education: 'Computer Science',
      };

      mockPrismaService.cVAnalysis.findUnique.mockResolvedValue({
        id: cvId,
        userId,
        cvData,
      });

      mockGraphRepository.listGraphs.mockResolvedValue([]);

      const context = await service.loadCopilotContext(userId, { cvId });

      expect(context.userId).toBe(userId);
      expect(context.cvId).toBe(cvId);
      expect(context.cvData).toEqual(cvData);
      expect(context.graph).toBeDefined();
      expect(context.graph?.nodes.size).toBeGreaterThan(0);
    });

    it('should throw NotFoundException when CV not found', async () => {
      const userId = 'user123';
      const cvId = 'cv123';

      mockPrismaService.cVAnalysis.findUnique.mockResolvedValue(null);

      await expect(service.loadCopilotContext(userId, { cvId })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when CV belongs to another user', async () => {
      const userId = 'user123';
      const cvId = 'cv123';
      const otherUserId = 'user456';

      mockPrismaService.cVAnalysis.findUnique.mockResolvedValue({
        id: cvId,
        userId: otherUserId,
        cvData: {},
      });

      await expect(service.loadCopilotContext(userId, { cvId })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should load latest CV when no CV ID specified', async () => {
      const userId = 'user123';
      const cvData = {
        skills: ['TypeScript', 'React'],
      };

      mockPrismaService.cVAnalysis.findFirst.mockResolvedValue({
        id: 'cv123',
        userId,
        cvData,
      });

      mockGraphRepository.listGraphs.mockResolvedValue([]);

      const context = await service.loadCopilotContext(userId, {});

      expect(context.userId).toBe(userId);
      expect(context.cvId).toBe('cv123');
      expect(context.cvData).toEqual(cvData);
    });

    it('should merge job into graph when job is specified', async () => {
      const userId = 'user123';
      const cvId = 'cv123';
      const jobId = 'job123';
      const cvData = { skills: ['TypeScript'] };
      const jobData = {
        id: jobId,
        title: 'Senior Developer',
        requirements: ['TypeScript', 'NestJS'],
      };

      mockPrismaService.cVAnalysis.findUnique
        .mockResolvedValueOnce({ id: cvId, userId, cvData })
        .mockResolvedValueOnce({ id: jobId, userId, cvData: jobData });

      mockGraphRepository.listGraphs.mockResolvedValue([]);

      const context = await service.loadCopilotContext(userId, { cvId, jobId });

      expect(context.userId).toBe(userId);
      expect(context.cvId).toBe(cvId);
      expect(context.jobId).toBe(jobId);
      expect(context.graph).toBeDefined();
      expect(context.graph?.nodes.size).toBeGreaterThan(0);
    });
  });

  describe('buildGraphFromCVData', () => {
    it('should build graph with skills', async () => {
      const cvId = 'cv123';
      const cvData = {
        skills: ['TypeScript', 'NestJS', 'PostgreSQL'],
      };

      mockPrismaService.cVAnalysis.findUnique.mockResolvedValue({
        id: cvId,
        userId: 'user123',
        cvData,
      });

      mockGraphRepository.listGraphs.mockResolvedValue([]);

      const context = await service.loadCopilotContext('user123', { cvId });

      expect(context.graph).toBeDefined();
      expect(context.graph?.nodes.size).toBeGreaterThan(0);

      // Check for skill nodes
      const skillNodes = Array.from(context.graph!.nodes.values()).filter(
        (node) => node.type === 'SKILL',
      );
      expect(skillNodes.length).toBe(3);
    });

    it('should build graph with experience', async () => {
      const cvId = 'cv123';
      const cvData = {
        skills: ['TypeScript'],
        experience: '5 years in software development',
      };

      mockPrismaService.cVAnalysis.findUnique.mockResolvedValue({
        id: cvId,
        userId: 'user123',
        cvData,
      });

      mockGraphRepository.listGraphs.mockResolvedValue([]);

      const context = await service.loadCopilotContext('user123', { cvId });

      expect(context.graph).toBeDefined();

      // Check for experience node
      const expNodes = Array.from(context.graph!.nodes.values()).filter(
        (node) => node.type === 'EXPERIENCE',
      );
      expect(expNodes.length).toBe(1);
    });

    it('should build graph with education', async () => {
      const cvId = 'cv123';
      const cvData = {
        skills: ['TypeScript'],
        education: 'Computer Science',
      };

      mockPrismaService.cVAnalysis.findUnique.mockResolvedValue({
        id: cvId,
        userId: 'user123',
        cvData,
      });

      mockGraphRepository.listGraphs.mockResolvedValue([]);

      const context = await service.loadCopilotContext('user123', { cvId });

      expect(context.graph).toBeDefined();

      // Check for education node
      const eduNodes = Array.from(context.graph!.nodes.values()).filter(
        (node) => node.type === 'EDUCATION',
      );
      expect(eduNodes.length).toBe(1);
    });
  });
});
