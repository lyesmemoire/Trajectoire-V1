import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';
import { CopilotService } from './copilot.service';
import { CopilotContextService } from './copilot-context.service';
import { CopilotPersistenceService } from './copilot-persistence.service';
import { PromptInterpreterService } from './prompt-interpreter.service';
import { ResponseBuilderService } from './response-builder.service';
import { ConversationMemoryService } from './conversation-memory.service';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { CacheService } from '../cache/cache.decorator';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

describe.skip('Copilot Real E2E Test', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let copilotService: CopilotService;
  let copilotContextService: CopilotContextService;
  let copilotPersistenceService: CopilotPersistenceService;
  let supabase: any;

  const TEST_USER_EMAIL = `test-copilot-${uuidv4()}@example.com`;
  const TEST_USER_PASSWORD = 'TestPassword123!';
  let testUserId: string;
  let testCVId: string;
  let testJobId: string;
  let testSessionId: string;

  beforeAll(async () => {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    supabase = createClient(supabaseUrl, supabaseKey);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PrismaService,
        CopilotService,
        CopilotContextService,
        CopilotPersistenceService,
        PromptInterpreterService,
        ResponseBuilderService,
        ConversationMemoryService,
        GraphReasoningEngine,
        GraphSearchService,
        GraphMatchingService,
        CacheService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    copilotService = moduleFixture.get<CopilotService>(CopilotService);
    copilotContextService = moduleFixture.get<CopilotContextService>(CopilotContextService);
    copilotPersistenceService = moduleFixture.get<CopilotPersistenceService>(CopilotPersistenceService);
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData();
    await app.close();
  });

  describe('Real Business Workflow', () => {
    it('should create test user via Supabase', async () => {
      const { data, error } = await supabase.auth.admin.createUser({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        email_confirm: true,
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      testUserId = data.user.id;

      // Also create user in Prisma
      const user = await prismaService.user.create({
        data: {
          id: testUserId,
          email: TEST_USER_EMAIL,
          referralCode: uuidv4(),
        },
      });

      expect(user.id).toBe(testUserId);
    });

    it('should create real CV with specific skills', async () => {
      const cvData = {
        skills: ['TypeScript', 'NestJS', 'PostgreSQL', 'React'],
        experience: '5 years of full-stack development',
        education: 'Computer Science Degree',
      };

      const cv = await prismaService.cVAnalysis.create({
        data: {
          userId: testUserId,
          fileName: 'test_cv.pdf',
          originalText: 'Test CV content',
          optimizedText: 'Optimized CV content',
          cvData,
          atsScoreBefore: 65,
          atsScoreAfter: 85,
        },
      });

      expect(cv).toBeDefined();
      expect(cv.userId).toBe(testUserId);
      expect((cv.cvData as any).skills).toEqual(['TypeScript', 'NestJS', 'PostgreSQL', 'React']);
      testCVId = cv.id;
    });

    it('should create real Job with specific requirements', async () => {
      const jobData = {
        title: 'Senior Full-Stack Developer',
        requirements: ['TypeScript', 'NestJS', 'PostgreSQL'],
        company: 'Tech Company',
      };

      const job = await prismaService.cVAnalysis.create({
        data: {
          userId: testUserId,
          fileName: 'test_job.pdf',
          originalText: 'Test Job content',
          optimizedText: 'Optimized Job content',
          cvData: jobData,
        },
      });

      expect(job).toBeDefined();
      expect(job.userId).toBe(testUserId);
      expect((job.cvData as any).requirements).toEqual(['TypeScript', 'NestJS', 'PostgreSQL']);
      testJobId = job.id;
    });

    it('should load Copilot context with real CV and Job', async () => {
      const context = await copilotContextService.loadCopilotContext(testUserId, {
        cvId: testCVId,
        jobId: testJobId,
      });

      expect(context.userId).toBe(testUserId);
      expect(context.cvId).toBe(testCVId);
      expect(context.jobId).toBe(testJobId);
      expect(context.cvData).toBeDefined();
      expect(context.jobData).toBeDefined();
      expect(context.graph).toBeDefined();
      expect(context.graph?.nodes.size).toBeGreaterThan(0);
    });

    it('should verify graph contains real skills from CV', async () => {
      const context = await copilotContextService.loadCopilotContext(testUserId, {
        cvId: testCVId,
      });

      const skillNodes = Array.from(context.graph!.nodes.values()).filter(
        (node) => node.type === 'SKILL',
      );

      expect(skillNodes.length).toBeGreaterThanOrEqual(4);

      const skillLabels = skillNodes.map((node) => node.label);
      expect(skillLabels).toContain('TypeScript');
      expect(skillLabels).toContain('NestJS');
      expect(skillLabels).toContain('PostgreSQL');
      expect(skillLabels).toContain('React');
    });

    it('should process Copilot message with real context', async () => {
      testSessionId = `session_${uuidv4()}`;
      const message = 'Which skills from my CV best match this job?';

      const response = await copilotService.processMessage(
        testSessionId,
        message,
        testUserId,
        { cvId: testCVId, jobId: testJobId },
      );

      expect(response).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.message.length).toBeGreaterThan(0);
      expect(response.sources).toBeDefined();
      expect(response.confidence).toBeGreaterThanOrEqual(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
    });

    it('should verify response contains relevant business data', async () => {
      const message = 'Which skills from my CV best match this job?';

      const response = await copilotService.processMessage(
        testSessionId,
        message,
        testUserId,
        { cvId: testCVId, jobId: testJobId },
      );

      // Response should mention relevant skills
      const responseText = response.message.toLowerCase();
      expect(
        responseText.includes('typescript') ||
        responseText.includes('nestjs') ||
        responseText.includes('postgresql') ||
        responseText.includes('skill'),
      ).toBe(true);
    });

    it('should verify conversation persisted in database', async () => {
      const messages = await copilotPersistenceService.getConversationHistory(
        testUserId,
        testSessionId,
      );

      expect(messages).toBeDefined();
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0].role).toBe('user');
      expect(messages[1].role).toBe('assistant');
    });

    it('should verify user ownership of conversation', async () => {
      const messages = await copilotPersistenceService.getConversationHistory(
        testUserId,
        testSessionId,
      );

      expect(messages.length).toBeGreaterThan(0);
    });

    it('should not use empty graph when real data exists', async () => {
      const context = await copilotContextService.loadCopilotContext(testUserId, {
        cvId: testCVId,
      });

      expect(context.graph).toBeDefined();
      expect(context.graph?.nodes.size).toBeGreaterThan(0);
      expect(context.graph?.edges.size).toBeGreaterThan(0);
    });
  });

  describe('Cross-User Security', () => {
    let otherUserId: string;
    let otherCVId: string;

    beforeAll(async () => {
      // Create another user
      const { data } = await supabase.auth.admin.createUser({
        email: `test-copilot-other-${uuidv4()}@example.com`,
        password: TEST_USER_PASSWORD,
        email_confirm: true,
      });
      otherUserId = data.user.id;

      await prismaService.user.create({
        data: {
          id: otherUserId,
          email: `test-copilot-other-${uuidv4()}@example.com`,
          referralCode: uuidv4(),
        },
      });

      // Create CV for other user
      const otherCV = await prismaService.cVAnalysis.create({
        data: {
          userId: otherUserId,
          fileName: 'other_cv.pdf',
          originalText: 'Other CV',
          optimizedText: 'Other CV',
          cvData: { skills: ['Python', 'Django'] },
        },
      });
      otherCVId = otherCV.id;
    });

    it('should prevent accessing CV of another user', async () => {
      await expect(
        copilotContextService.loadCopilotContext(testUserId, { cvId: otherCVId }),
      ).rejects.toThrow();
    });

    it('should prevent accessing conversation of another user', async () => {
      const messages = await copilotPersistenceService.getConversationHistory(
        otherUserId,
        testSessionId,
      );

      expect(messages).toEqual([]);
    });

    afterAll(async () => {
      // Cleanup other user
      await prismaService.cVAnalysis.deleteMany({ where: { userId: otherUserId } });
      await prismaService.user.delete({ where: { id: otherUserId } });
      await supabase.auth.admin.deleteUser(otherUserId);
    });
  });

  async function cleanupTestData() {
    if (testUserId) {
      await prismaService.cVAnalysis.deleteMany({ where: { userId: testUserId } });
      await prismaService.user.delete({ where: { id: testUserId } });
      await supabase.auth.admin.deleteUser(testUserId);
    }
  }
});
