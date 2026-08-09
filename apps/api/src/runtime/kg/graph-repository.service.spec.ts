import { Test, TestingModule } from '@nestjs/testing';
import { GraphRepository } from './graph-repository.service';
import { PrismaService } from './prisma.service';
import { CacheService } from '../../cache/cache.decorator';
import { RollbackService } from '../../resilience/rollback.service';

describe('GraphRepository', () => {
  let repository: GraphRepository;
  let prisma: PrismaService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphRepository,
        {
          provide: PrismaService,
          useValue: {
            graph: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
            graphNode: {
              createMany: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              deleteMany: jest.fn(),
              findUnique: jest.fn(),
            },
            graphEdge: {
              createMany: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              deleteMany: jest.fn(),
              findUnique: jest.fn(),
            },
            graphVersion: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            graphSnapshot: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            $transaction: jest.fn(),
          } as any,
        },
        {
          provide: CacheService,
          useValue: {
            generateKey: jest.fn().mockReturnValue('test-key'),
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: RollbackService,
          useValue: {
            executeWithRollback: jest.fn().mockImplementation(async (fn) => fn()),
            executeRollback: jest.fn(),
            getOperationState: jest.fn(),
            getAllOperations: jest.fn(),
            clearOperation: jest.fn(),
            clearCompletedOperations: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<GraphRepository>(GraphRepository);
    prisma = module.get<PrismaService>(PrismaService);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createGraph', () => {
    it('should create a new graph', async () => {
      const mockGraph = {
        id: 'test-id',
        name: 'Test Graph',
        description: 'Test Description',
        source: 'test',
        metadata: {},
        version: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      ((prisma as any).graph.create as jest.Mock).mockResolvedValue(mockGraph);

      const result = await repository.createGraph({
        name: 'Test Graph',
        description: 'Test Description',
        source: 'test',
      }, 'test-user-id');

      expect(result).toBeDefined();
      expect(result.id).toBe('test-id');
      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe('getGraphById', () => {
    it('should return a graph by ID', async () => {
      const mockGraph = {
        id: 'test-id',
        name: 'Test Graph',
        description: 'Test Description',
        source: 'test',
        metadata: {},
        version: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        nodes: [],
        edges: [],
      };

      (cacheService.get as jest.Mock).mockResolvedValue(null);
      ((prisma as any).graph.findFirst as jest.Mock).mockResolvedValue(
        mockGraph,
      );

      const result = await repository.getGraphById('test-id', {}, 'test-user-id');

      if (result) {
        expect(result.id).toBe('test-id');
      }
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should return null if graph not found', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);
      ((prisma as any).graph.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.getGraphById('non-existent-id', {}, 'test-user-id');

      expect(result).toBeNull();
    });

    it('should return cached graph if available', async () => {
      const mockGraph = {
        id: 'test-id',
        nodes: new Map(),
        edges: new Map(),
        metadata: {},
      };

      (cacheService.get as jest.Mock).mockResolvedValue(mockGraph);

      const result = await repository.getGraphById('test-id', {}, 'test-user-id');

      expect(result).toBe(mockGraph);
      expect((prisma as any).graph.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('createNodes', () => {
    it('should create nodes for a graph', async () => {
      const mockNodes = [
        {
          id: 'node-1',
          type: 'SKILL',
          label: 'JavaScript',
          normalizedLabel: 'javascript',
          confidence: 0.9,
          source: 'test',
          metadata: {},
          timestamps: {
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          provenance: {
            createdBy: 'system',
            algorithmVersion: '1.0.0',
          },
        },
      ];

      ((prisma as any).graph.findFirst as jest.Mock).mockResolvedValue({
        id: 'graph-id',
        userId: 'test-user-id',
      });
      ((prisma as any).graphNode.createMany as jest.Mock).mockResolvedValue({
        count: 1,
      });
      ((prisma as any).graphNode.findMany as jest.Mock).mockResolvedValue(
        mockNodes,
      );

      const result = await repository.createNodes('graph-id', mockNodes as any, 'test-user-id');

      expect(result).toBeDefined();
      expect((prisma as any).graphNode.createMany).toHaveBeenCalled();
    });
  });

  describe('createEdges', () => {
    it('should create edges for a graph', async () => {
      const mockEdges = [
        {
          id: 'edge-1',
          type: 'HAS_SKILL',
          sourceNode: 'node-1',
          targetNode: 'node-2',
          weight: 1.0,
          confidence: 0.9,
          reason: 'test',
          metadata: {},
          timestamps: {
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          provenance: {
            createdBy: 'system',
            algorithmVersion: '1.0.0',
          },
        },
      ];

      ((prisma as any).graph.findFirst as jest.Mock).mockResolvedValue({
        id: 'graph-id',
        userId: 'test-user-id',
      });
      ((prisma as any).graphEdge.createMany as jest.Mock).mockResolvedValue({
        count: 1,
      });
      ((prisma as any).graphEdge.findMany as jest.Mock).mockResolvedValue(
        mockEdges,
      );

      const result = await repository.createEdges('graph-id', mockEdges as any, 'test-user-id');

      expect(result).toBeDefined();
      expect((prisma as any).graphEdge.createMany).toHaveBeenCalled();
    });
  });

  describe('createVersion', () => {
    it('should create a new version of a graph', async () => {
      const mockGraph = {
        id: 'graph-id',
        version: 1,
        nodes: [],
        edges: [],
      };

      const mockVersion = {
        id: 'version-id',
        graphId: 'graph-id',
        version: 2,
        description: 'Test version',
        changeLog: {},
        nodeCount: 0,
        edgeCount: 0,
        createdBy: 'test-user',
        createdAt: new Date(),
      };

      ((prisma as any).graph.findFirst as jest.Mock).mockResolvedValue(
        mockGraph,
      );
      ((prisma as any).$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          return callback({
            graph: {
              update: jest.fn().mockResolvedValue(mockGraph),
            },
            graphVersion: {
              create: jest.fn().mockResolvedValue(mockVersion),
            },
          });
        },
      );

      const result = await repository.createVersion(
        'graph-id',
        { description: 'Test version' },
        'test-user-id',
      );

      expect(result).toBeDefined();
      expect(result.version).toBe(2);
    });
  });

  describe('createSnapshot', () => {
    it('should create a snapshot of a graph', async () => {
      const mockGraph = {
        id: 'graph-id',
        version: 1,
        nodes: [],
        edges: [],
      };

      const mockSnapshot = {
        id: 'snapshot-id',
        graphId: 'graph-id',
        version: 1,
        name: 'Test snapshot',
        description: 'Test description',
        nodeData: [],
        edgeData: [],
        metadata: {},
        createdAt: new Date(),
      };

      ((prisma as any).graph.findFirst as jest.Mock).mockResolvedValue(
        mockGraph,
      );
      ((prisma as any).graphSnapshot.create as jest.Mock).mockResolvedValue(
        mockSnapshot,
      );

      const result = await repository.createSnapshot('graph-id', {
        name: 'Test snapshot',
        description: 'Test description',
      }, 'test-user-id');

      expect(result).toBeDefined();
      expect(result.name).toBe('Test snapshot');
    });
  });

  describe('transaction', () => {
    it('should execute operations in a transaction', async () => {
      const mockResult = { success: true };

      ((prisma as any).$transaction as jest.Mock).mockResolvedValue(mockResult);

      const result = await repository.transaction(async (tx) => {
        return mockResult;
      });

      expect(result).toBe(mockResult);
      expect((prisma as any).$transaction).toHaveBeenCalled();
    });
  });
});
