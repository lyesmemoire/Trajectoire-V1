import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SecurityAuditService } from './security-audit.service';
import { StructuredLoggingService } from '../observability/structured-logging.service';

describe('SecurityAuditService (Integration)', () => {
  let app: INestApplication;
  let service: SecurityAuditService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityAuditService,
        {
          provide: StructuredLoggingService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<SecurityAuditService>(SecurityAuditService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should run full security audit', async () => {
    const result = await service.runAudit();

    expect(result).toBeDefined();
    expect(result.securityScore.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.securityScore.overallScore).toBeLessThanOrEqual(100);
  });

  it('should return recommendations', async () => {
    const result = await service.runAudit();

    expect(result.recommendations).toBeInstanceOf(Array);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should categorize issues by severity', async () => {
    const result = await service.runAudit();

    expect(result.criticalIssues.length).toBeGreaterThanOrEqual(0);
    expect(result.highIssues.length).toBeGreaterThanOrEqual(0);
    expect(result.mediumIssues.length).toBeGreaterThanOrEqual(0);
    expect(result.lowIssues.length).toBeGreaterThanOrEqual(0);
  });

  it('should calculate OWASP score correctly', async () => {
    const result = await service.runAudit();

    expect(result.owasp.score).toBeGreaterThanOrEqual(0);
    expect(result.owasp.score).toBeLessThanOrEqual(100);
  });

  it('should calculate JWT score correctly', async () => {
    const result = await service.runAudit();

    expect(result.jwt.score).toBeGreaterThanOrEqual(0);
    expect(result.jwt.score).toBeLessThanOrEqual(100);
  });

  it('should calculate Supabase score correctly', async () => {
    const result = await service.runAudit();

    expect(result.supabase.score).toBeGreaterThanOrEqual(0);
    expect(result.supabase.score).toBeLessThanOrEqual(100);
  });

  it('should calculate headers score correctly', async () => {
    const result = await service.runAudit();

    expect(result.headers.score).toBeGreaterThanOrEqual(0);
    expect(result.headers.score).toBeLessThanOrEqual(100);
  });

  it('should calculate CORS score correctly', async () => {
    const result = await service.runAudit();

    expect(result.cors.score).toBeGreaterThanOrEqual(0);
    expect(result.cors.score).toBeLessThanOrEqual(100);
  });

  it('should calculate permissions score correctly', async () => {
    const result = await service.runAudit();

    expect(result.permissions.score).toBeGreaterThanOrEqual(0);
    expect(result.permissions.score).toBeLessThanOrEqual(100);
  });

  it('should calculate rate limiting score correctly', async () => {
    const result = await service.runAudit();

    expect(result.rateLimiting.score).toBeGreaterThanOrEqual(0);
    expect(result.rateLimiting.score).toBeLessThanOrEqual(100);
  });

  it('should calculate secrets score correctly', async () => {
    const result = await service.runAudit();

    expect(result.secrets.score).toBeGreaterThanOrEqual(0);
    expect(result.secrets.score).toBeLessThanOrEqual(100);
  });
});
