import { Test, TestingModule } from '@nestjs/testing';
import { SecurityAuditService } from './security-audit.service';
import { StructuredLoggingService } from '../observability/structured-logging.service';

describe('SecurityAuditService', () => {
  let service: SecurityAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<SecurityAuditService>(SecurityAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runAudit', () => {
    it('should return security audit result', async () => {
      const result = await service.runAudit();

      expect(result).toBeDefined();
      expect(result.owasp).toBeDefined();
      expect(result.jwt).toBeDefined();
      expect(result.supabase).toBeDefined();
      expect(result.headers).toBeDefined();
      expect(result.cors).toBeDefined();
      expect(result.permissions).toBeDefined();
      expect(result.rateLimiting).toBeDefined();
      expect(result.secrets).toBeDefined();
      expect(result.securityScore).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.criticalIssues).toBeDefined();
      expect(result.highIssues).toBeDefined();
      expect(result.mediumIssues).toBeDefined();
      expect(result.lowIssues).toBeDefined();
    });

    it('should calculate security score', async () => {
      const result = await service.runAudit();

      expect(result.securityScore.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.securityScore.overallScore).toBeLessThanOrEqual(100);
      expect(result.securityScore.grade).toBeDefined();
    });

    it('should categorize issues correctly', async () => {
      const result = await service.runAudit();

      expect(result.criticalIssues).toBeInstanceOf(Array);
      expect(result.highIssues).toBeInstanceOf(Array);
      expect(result.mediumIssues).toBeInstanceOf(Array);
      expect(result.lowIssues).toBeInstanceOf(Array);
    });
  });

  describe('auditOWASP', () => {
    it('should audit OWASP Top 10', async () => {
      const result = await service.runAudit();
      const owasp = result.owasp;

      expect(owasp.a01_injection).toBeDefined();
      expect(owasp.a02_broken_auth).toBeDefined();
      expect(owasp.a03_sensitive_data).toBeDefined();
      expect(owasp.a04_xml_entities).toBeDefined();
      expect(owasp.a05_access_control).toBeDefined();
      expect(owasp.a06_misconfig).toBeDefined();
      expect(owasp.a07_xss).toBeDefined();
      expect(owasp.a08_insecure_deserialization).toBeDefined();
      expect(owasp.a09_components).toBeDefined();
      expect(owasp.a10_logging).toBeDefined();
      expect(owasp.score).toBeGreaterThanOrEqual(0);
      expect(owasp.score).toBeLessThanOrEqual(100);
    });
  });

  describe('auditJWT', () => {
    it('should audit JWT configuration', async () => {
      const result = await service.runAudit();
      const jwt = result.jwt;

      expect(jwt.algorithm).toBeDefined();
      expect(jwt.secretStrength).toBeDefined();
      expect(jwt.expiration).toBeGreaterThan(0);
      expect(jwt.issuer).toBeDefined();
      expect(jwt.audience).toBeDefined();
      expect(jwt.compliant).toBeDefined();
      expect(jwt.issues).toBeInstanceOf(Array);
      expect(jwt.score).toBeGreaterThanOrEqual(0);
      expect(jwt.score).toBeLessThanOrEqual(100);
    });
  });

  describe('auditSupabase', () => {
    it('should audit Supabase configuration', async () => {
      const result = await service.runAudit();
      const supabase = result.supabase;

      expect(supabase.rlsEnabled).toBeDefined();
      expect(supabase.rowLevelSecurity).toBeDefined();
      expect(supabase.apiKeysRotated).toBeDefined();
      expect(supabase.storagePolicies).toBeDefined();
      expect(supabase.compliant).toBeDefined();
      expect(supabase.issues).toBeInstanceOf(Array);
      expect(supabase.score).toBeGreaterThanOrEqual(0);
      expect(supabase.score).toBeLessThanOrEqual(100);
    });
  });

  describe('auditHeaders', () => {
    it('should audit security headers', async () => {
      const result = await service.runAudit();
      const headers = result.headers;

      expect(headers.securityHeaders).toBeDefined();
      expect(headers.securityHeaders['Strict-Transport-Security']).toBeDefined();
      expect(headers.securityHeaders['X-Content-Type-Options']).toBeDefined();
      expect(headers.securityHeaders['X-Frame-Options']).toBeDefined();
      expect(headers.securityHeaders['X-XSS-Protection']).toBeDefined();
      expect(headers.securityHeaders['Content-Security-Policy']).toBeDefined();
      expect(headers.securityHeaders['Referrer-Policy']).toBeDefined();
      expect(headers.securityHeaders['Permissions-Policy']).toBeDefined();
      expect(headers.compliant).toBeDefined();
      expect(headers.issues).toBeInstanceOf(Array);
      expect(headers.score).toBeGreaterThanOrEqual(0);
      expect(headers.score).toBeLessThanOrEqual(100);
    });
  });

  describe('auditCORS', () => {
    it('should audit CORS configuration', async () => {
      const result = await service.runAudit();
      const cors = result.cors;

      expect(cors.originPolicy).toBeDefined();
      expect(cors.credentials).toBeDefined();
      expect(cors.methods).toBeInstanceOf(Array);
      expect(cors.headers).toBeInstanceOf(Array);
      expect(cors.maxAge).toBeGreaterThanOrEqual(0);
      expect(cors.compliant).toBeDefined();
      expect(cors.issues).toBeInstanceOf(Array);
      expect(cors.score).toBeGreaterThanOrEqual(0);
      expect(cors.score).toBeLessThanOrEqual(100);
    });
  });

  describe('auditPermissions', () => {
    it('should audit permissions and RBAC', async () => {
      const result = await service.runAudit();
      const permissions = result.permissions;

      expect(permissions.rbacImplemented).toBeDefined();
      expect(permissions.roleBasedAccess).toBeDefined();
      expect(permissions.principleOfLeastPrivilege).toBeDefined();
      expect(permissions.auditLogging).toBeDefined();
      expect(permissions.compliant).toBeDefined();
      expect(permissions.issues).toBeInstanceOf(Array);
      expect(permissions.score).toBeGreaterThanOrEqual(0);
      expect(permissions.score).toBeLessThanOrEqual(100);
    });
  });

  describe('auditRateLimiting', () => {
    it('should audit rate limiting configuration', async () => {
      const result = await service.runAudit();
      const rateLimiting = result.rateLimiting;

      expect(rateLimiting.implemented).toBeDefined();
      expect(rateLimiting.limitsConfigured).toBeDefined();
      expect(rateLimiting.distributed).toBeDefined();
      expect(rateLimiting.ipBased).toBeDefined();
      expect(rateLimiting.userBased).toBeDefined();
      expect(rateLimiting.compliant).toBeDefined();
      expect(rateLimiting.issues).toBeInstanceOf(Array);
      expect(rateLimiting.score).toBeGreaterThanOrEqual(0);
      expect(rateLimiting.score).toBeLessThanOrEqual(100);
    });
  });

  describe('auditSecrets', () => {
    it('should audit secrets management', async () => {
      const result = await service.runAudit();
      const secrets = result.secrets;

      expect(secrets.environmentVariables).toBeDefined();
      expect(secrets.secretsManager).toBeDefined();
      expect(secrets.encryptionAtRest).toBeDefined();
      expect(secrets.encryptionInTransit).toBeDefined();
      expect(secrets.rotationPolicy).toBeDefined();
      expect(secrets.compliant).toBeDefined();
      expect(secrets.issues).toBeInstanceOf(Array);
      expect(secrets.score).toBeGreaterThanOrEqual(0);
      expect(secrets.score).toBeLessThanOrEqual(100);
    });
  });
});
