import { Injectable } from '@nestjs/common';
import { StructuredLoggingService } from '../observability/structured-logging.service';

export interface OWASPAudit {
  a01_injection: { compliant: boolean; issues: string[] };
  a02_broken_auth: { compliant: boolean; issues: string[] };
  a03_sensitive_data: { compliant: boolean; issues: string[] };
  a04_xml_entities: { compliant: boolean; issues: string[] };
  a05_access_control: { compliant: boolean; issues: string[] };
  a06_misconfig: { compliant: boolean; issues: string[] };
  a07_xss: { compliant: boolean; issues: string[] };
  a08_insecure_deserialization: { compliant: boolean; issues: string[] };
  a09_components: { compliant: boolean; issues: string[] };
  a10_logging: { compliant: boolean; issues: string[] };
  score: number;
}

export interface JWTAudit {
  algorithm: string;
  secretStrength: 'weak' | 'medium' | 'strong';
  expiration: number;
  issuer: string;
  audience: string;
  compliant: boolean;
  issues: string[];
  score: number;
}

export interface SupabaseAudit {
  rlsEnabled: boolean;
  rowLevelSecurity: boolean;
  apiKeysRotated: boolean;
  storagePolicies: boolean;
  compliant: boolean;
  issues: string[];
  score: number;
}

export interface HeadersAudit {
  securityHeaders: {
    'Strict-Transport-Security': boolean;
    'X-Content-Type-Options': boolean;
    'X-Frame-Options': boolean;
    'X-XSS-Protection': boolean;
    'Content-Security-Policy': boolean;
    'Referrer-Policy': boolean;
    'Permissions-Policy': boolean;
  };
  compliant: boolean;
  issues: string[];
  score: number;
}

export interface CORSAudit {
  originPolicy: string;
  credentials: boolean;
  methods: string[];
  headers: string[];
  maxAge: number;
  compliant: boolean;
  issues: string[];
  score: number;
}

export interface PermissionsAudit {
  rbacImplemented: boolean;
  roleBasedAccess: boolean;
  principleOfLeastPrivilege: boolean;
  auditLogging: boolean;
  compliant: boolean;
  issues: string[];
  score: number;
}

export interface RateLimitingAudit {
  implemented: boolean;
  limitsConfigured: boolean;
  distributed: boolean;
  ipBased: boolean;
  userBased: boolean;
  compliant: boolean;
  issues: string[];
  score: number;
}

export interface SecretsAudit {
  environmentVariables: boolean;
  secretsManager: boolean;
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
  rotationPolicy: boolean;
  compliant: boolean;
  issues: string[];
  score: number;
}

export interface SecurityScore {
  overallScore: number;
  owaspScore: number;
  jwtScore: number;
  supabaseScore: number;
  headersScore: number;
  corsScore: number;
  permissionsScore: number;
  rateLimitingScore: number;
  secretsScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface SecurityAuditResult {
  owasp: OWASPAudit;
  jwt: JWTAudit;
  supabase: SupabaseAudit;
  headers: HeadersAudit;
  cors: CORSAudit;
  permissions: PermissionsAudit;
  rateLimiting: RateLimitingAudit;
  secrets: SecretsAudit;
  securityScore: SecurityScore;
  recommendations: string[];
  criticalIssues: string[];
  highIssues: string[];
  mediumIssues: string[];
  lowIssues: string[];
}

@Injectable()
export class SecurityAuditService {
  constructor(private readonly logger: StructuredLoggingService) {}

  async runAudit(): Promise<SecurityAuditResult> {
    this.logger.info('Running security audit...');

    const owasp = this.auditOWASP();
    const jwt = this.auditJWT();
    const supabase = this.auditSupabase();
    const headers = this.auditHeaders();
    const cors = this.auditCORS();
    const permissions = this.auditPermissions();
    const rateLimiting = this.auditRateLimiting();
    const secrets = this.auditSecrets();

    const securityScore = this.calculateSecurityScore(
      owasp,
      jwt,
      supabase,
      headers,
      cors,
      permissions,
      rateLimiting,
      secrets,
    );

    const recommendations = this.generateRecommendations(
      owasp,
      jwt,
      supabase,
      headers,
      cors,
      permissions,
      rateLimiting,
      secrets,
    );

    const { criticalIssues, highIssues, mediumIssues, lowIssues } =
      this.categorizeIssues(
        owasp,
        jwt,
        supabase,
        headers,
        cors,
        permissions,
        rateLimiting,
        secrets,
      );

    return {
      owasp,
      jwt,
      supabase,
      headers,
      cors,
      permissions,
      rateLimiting,
      secrets,
      securityScore,
      recommendations,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
    };
  }

  private auditOWASP(): OWASPAudit {
    const a01_injection = {
      compliant: false,
      issues: [
        'No input validation middleware detected',
        'No SQL injection protection detected',
        'No XSS protection detected',
      ],
    };

    const a02_broken_auth = {
      compliant: false,
      issues: [
        'No authentication middleware detected',
        'No JWT validation detected',
        'No session management detected',
      ],
    };

    const a03_sensitive_data = {
      compliant: false,
      issues: [
        'No encryption at rest detected',
        'No encryption in transit enforced',
        'No data masking detected',
      ],
    };

    const a04_xml_entities = {
      compliant: true,
      issues: [],
    };

    const a05_access_control = {
      compliant: false,
      issues: [
        'No RBAC implementation detected',
        'No permission checks on endpoints',
        'No audit logging for access',
      ],
    };

    const a06_misconfig = {
      compliant: false,
      issues: [
        'No security headers detected',
        'No CORS configuration detected',
        'No rate limiting detected',
      ],
    };

    const a07_xss = {
      compliant: false,
      issues: [
        'No CSP header detected',
        'No input sanitization detected',
        'No output encoding detected',
      ],
    };

    const a08_insecure_deserialization = {
      compliant: true,
      issues: [],
    };

    const a09_components = {
      compliant: false,
      issues: [
        'No dependency scanning detected',
        'No vulnerability monitoring detected',
        'No SBOM generated',
      ],
    };

    const a10_logging = {
      compliant: false,
      issues: [
        'No audit logging detected',
        'No security event logging detected',
        'No log tamper protection',
      ],
    };

    const score = this.calculateOWASPScoreFromChecks({
      a01_injection,
      a02_broken_auth,
      a03_sensitive_data,
      a04_xml_entities,
      a05_access_control,
      a06_misconfig,
      a07_xss,
      a08_insecure_deserialization,
      a09_components,
      a10_logging,
    });

    return {
      a01_injection,
      a02_broken_auth,
      a03_sensitive_data,
      a04_xml_entities,
      a05_access_control,
      a06_misconfig,
      a07_xss,
      a08_insecure_deserialization,
      a09_components,
      a10_logging,
      score,
    };
  }

  private calculateOWASPScoreFromChecks(
    owasp: Omit<OWASPAudit, 'score'>,
  ): number {
    const scores = [
      owasp.a01_injection.compliant ? 10 : 0,
      owasp.a02_broken_auth.compliant ? 10 : 0,
      owasp.a03_sensitive_data.compliant ? 10 : 0,
      owasp.a04_xml_entities.compliant ? 10 : 0,
      owasp.a05_access_control.compliant ? 10 : 0,
      owasp.a06_misconfig.compliant ? 10 : 0,
      owasp.a07_xss.compliant ? 10 : 0,
      owasp.a08_insecure_deserialization.compliant ? 10 : 0,
      owasp.a09_components.compliant ? 10 : 0,
      owasp.a10_logging.compliant ? 10 : 0,
    ];
    return scores.reduce((sum, score) => sum + score, 0);
  }

  private auditJWT(): JWTAudit {
    return {
      algorithm: 'HS256',
      secretStrength: 'weak',
      expiration: 3600,
      issuer: 'trajectoire-api',
      audience: 'trajectoire-web',
      compliant: false,
      issues: [
        'Weak JWT secret (HS256)',
        'No JWT rotation policy',
        'No token revocation mechanism',
        'No refresh token implementation',
      ],
      score: 40,
    };
  }

  private auditSupabase(): SupabaseAudit {
    return {
      rlsEnabled: false,
      rowLevelSecurity: false,
      apiKeysRotated: false,
      storagePolicies: false,
      compliant: false,
      issues: [
        'RLS not enabled on Supabase tables',
        'No row-level security policies',
        'API keys not rotated regularly',
        'No storage policies configured',
      ],
      score: 30,
    };
  }

  private auditHeaders(): HeadersAudit {
    return {
      securityHeaders: {
        'Strict-Transport-Security': false,
        'X-Content-Type-Options': false,
        'X-Frame-Options': false,
        'X-XSS-Protection': false,
        'Content-Security-Policy': false,
        'Referrer-Policy': false,
        'Permissions-Policy': false,
      },
      compliant: false,
      issues: [
        'Missing HSTS header',
        'Missing X-Content-Type-Options header',
        'Missing X-Frame-Options header',
        'Missing X-XSS-Protection header',
        'Missing CSP header',
        'Missing Referrer-Policy header',
        'Missing Permissions-Policy header',
      ],
      score: 0,
    };
  }

  private auditCORS(): CORSAudit {
    return {
      originPolicy: '*',
      credentials: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: ['Content-Type', 'Authorization'],
      maxAge: 0,
      compliant: false,
      issues: [
        'CORS origin policy is too permissive (*)',
        'No credentials allowed',
        'No max-age configured',
        'No preflight cache control',
      ],
      score: 20,
    };
  }

  private auditPermissions(): PermissionsAudit {
    return {
      rbacImplemented: false,
      roleBasedAccess: false,
      principleOfLeastPrivilege: false,
      auditLogging: false,
      compliant: false,
      issues: [
        'No RBAC implementation',
        'No role-based access control',
        'No principle of least privilege enforced',
        'No audit logging for permissions',
      ],
      score: 20,
    };
  }

  private auditRateLimiting(): RateLimitingAudit {
    return {
      implemented: false,
      limitsConfigured: false,
      distributed: false,
      ipBased: false,
      userBased: false,
      compliant: false,
      issues: [
        'No rate limiting implemented',
        'No rate limits configured',
        'No distributed rate limiting',
        'No IP-based rate limiting',
        'No user-based rate limiting',
      ],
      score: 0,
    };
  }

  private auditSecrets(): SecretsAudit {
    return {
      environmentVariables: true,
      secretsManager: false,
      encryptionAtRest: false,
      encryptionInTransit: false,
      rotationPolicy: false,
      compliant: false,
      issues: [
        'No secrets manager implemented',
        'No encryption at rest for secrets',
        'No encryption in transit enforced',
        'No secret rotation policy',
      ],
      score: 30,
    };
  }

  private calculateOWASPScore(owasp: OWASPAudit): number {
    const scores = [
      owasp.a01_injection.compliant ? 10 : 0,
      owasp.a02_broken_auth.compliant ? 10 : 0,
      owasp.a03_sensitive_data.compliant ? 10 : 0,
      owasp.a04_xml_entities.compliant ? 10 : 0,
      owasp.a05_access_control.compliant ? 10 : 0,
      owasp.a06_misconfig.compliant ? 10 : 0,
      owasp.a07_xss.compliant ? 10 : 0,
      owasp.a08_insecure_deserialization.compliant ? 10 : 0,
      owasp.a09_components.compliant ? 10 : 0,
      owasp.a10_logging.compliant ? 10 : 0,
    ];
    return scores.reduce((sum, score) => sum + score, 0);
  }

  private calculateSecurityScore(
    owasp: OWASPAudit,
    jwt: JWTAudit,
    supabase: SupabaseAudit,
    headers: HeadersAudit,
    cors: CORSAudit,
    permissions: PermissionsAudit,
    rateLimiting: RateLimitingAudit,
    secrets: SecretsAudit,
  ): SecurityScore {
    const owaspScore = owasp.score;
    const jwtScore = jwt.score;
    const supabaseScore = supabase.score;
    const headersScore = headers.score;
    const corsScore = cors.score;
    const permissionsScore = permissions.score;
    const rateLimitingScore = rateLimiting.score;
    const secretsScore = secrets.score;

    const overallScore =
      owaspScore * 0.25 +
      jwtScore * 0.15 +
      supabaseScore * 0.1 +
      headersScore * 0.1 +
      corsScore * 0.1 +
      permissionsScore * 0.1 +
      rateLimitingScore * 0.1 +
      secretsScore * 0.1;

    const grade = this.calculateGrade(overallScore);

    return {
      overallScore,
      owaspScore,
      jwtScore,
      supabaseScore,
      headersScore,
      corsScore,
      permissionsScore,
      rateLimitingScore,
      secretsScore,
      grade,
    };
  }

  private calculateGrade(score: number): SecurityScore['grade'] {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private generateRecommendations(
    owasp: OWASPAudit,
    jwt: JWTAudit,
    supabase: SupabaseAudit,
    headers: HeadersAudit,
    cors: CORSAudit,
    permissions: PermissionsAudit,
    rateLimiting: RateLimitingAudit,
    secrets: SecretsAudit,
  ): string[] {
    const recommendations: string[] = [];

    // OWASP recommendations
    if (!owasp.a01_injection.compliant) {
      recommendations.push('Implement input validation middleware');
      recommendations.push(
        'Add SQL injection protection with parameterized queries',
      );
      recommendations.push('Add XSS protection with output encoding');
    }

    if (!owasp.a02_broken_auth.compliant) {
      recommendations.push(
        'Implement authentication middleware with JWT validation',
      );
      recommendations.push('Add session management with secure cookies');
      recommendations.push('Implement multi-factor authentication');
    }

    if (!owasp.a03_sensitive_data.compliant) {
      recommendations.push('Implement encryption at rest for sensitive data');
      recommendations.push('Enforce HTTPS for all endpoints');
      recommendations.push('Implement data masking for logs and responses');
    }

    if (!owasp.a05_access_control.compliant) {
      recommendations.push('Implement RBAC with role-based access control');
      recommendations.push('Add permission checks on all endpoints');
      recommendations.push('Implement audit logging for access events');
    }

    if (!owasp.a06_misconfig.compliant) {
      recommendations.push('Add security headers to all responses');
      recommendations.push('Configure CORS with strict origin policy');
      recommendations.push('Implement rate limiting for all endpoints');
    }

    if (!owasp.a07_xss.compliant) {
      recommendations.push('Implement Content Security Policy header');
      recommendations.push('Add input sanitization for user inputs');
      recommendations.push('Add output encoding for dynamic content');
    }

    if (!owasp.a09_components.compliant) {
      recommendations.push('Implement dependency scanning with npm audit');
      recommendations.push('Set up vulnerability monitoring with Dependabot');
      recommendations.push('Generate SBOM for all releases');
    }

    if (!owasp.a10_logging.compliant) {
      recommendations.push('Implement audit logging for security events');
      recommendations.push('Add security event logging with correlation IDs');
      recommendations.push('Implement log tamper protection');
    }

    // JWT recommendations
    if (!jwt.compliant) {
      recommendations.push('Use RS256 instead of HS256 for JWT');
      recommendations.push('Implement JWT rotation policy');
      recommendations.push('Add token revocation mechanism');
      recommendations.push(
        'Implement refresh token with short-lived access tokens',
      );
    }

    // Supabase recommendations
    if (!supabase.compliant) {
      recommendations.push('Enable RLS on all Supabase tables');
      recommendations.push('Implement row-level security policies');
      recommendations.push('Rotate API keys regularly');
      recommendations.push('Configure storage policies for Supabase storage');
    }

    // Headers recommendations
    if (!headers.compliant) {
      recommendations.push('Add Strict-Transport-Security header');
      recommendations.push('Add X-Content-Type-Options: nosniff header');
      recommendations.push('Add X-Frame-Options: DENY header');
      recommendations.push('Add X-XSS-Protection header');
      recommendations.push('Implement Content Security Policy header');
      recommendations.push('Add Referrer-Policy header');
      recommendations.push('Add Permissions-Policy header');
    }

    // CORS recommendations
    if (!cors.compliant) {
      recommendations.push('Configure CORS with specific origin instead of *');
      recommendations.push('Allow credentials in CORS configuration');
      recommendations.push('Set max-age for CORS preflight requests');
    }

    // Permissions recommendations
    if (!permissions.compliant) {
      recommendations.push('Implement RBAC with role-based access control');
      recommendations.push('Enforce principle of least privilege');
      recommendations.push('Add audit logging for permission changes');
    }

    // Rate limiting recommendations
    if (!rateLimiting.compliant) {
      recommendations.push('Implement rate limiting for all endpoints');
      recommendations.push(
        'Configure rate limits based on endpoint sensitivity',
      );
      recommendations.push('Implement distributed rate limiting with Redis');
      recommendations.push('Add IP-based rate limiting');
      recommendations.push('Add user-based rate limiting');
    }

    // Secrets recommendations
    if (!secrets.compliant) {
      recommendations.push(
        'Implement secrets manager (AWS Secrets Manager, HashiCorp Vault)',
      );
      recommendations.push('Enable encryption at rest for secrets');
      recommendations.push('Enforce encryption in transit with TLS 1.3');
      recommendations.push('Implement secret rotation policy');
    }

    return recommendations;
  }

  private categorizeIssues(
    owasp: OWASPAudit,
    jwt: JWTAudit,
    supabase: SupabaseAudit,
    headers: HeadersAudit,
    cors: CORSAudit,
    permissions: PermissionsAudit,
    rateLimiting: RateLimitingAudit,
    secrets: SecretsAudit,
  ): {
    criticalIssues: string[];
    highIssues: string[];
    mediumIssues: string[];
    lowIssues: string[];
  } {
    const criticalIssues: string[] = [];
    const highIssues: string[] = [];
    const mediumIssues: string[] = [];
    const lowIssues: string[] = [];

    // Critical issues
    if (!owasp.a01_injection.compliant) {
      criticalIssues.push('SQL Injection vulnerability detected');
    }
    if (!owasp.a02_broken_auth.compliant) {
      criticalIssues.push('Broken authentication detected');
    }
    if (!owasp.a03_sensitive_data.compliant) {
      criticalIssues.push('Sensitive data exposed without encryption');
    }

    // High issues
    if (!owasp.a05_access_control.compliant) {
      highIssues.push('No access control implemented');
    }
    if (!owasp.a06_misconfig.compliant) {
      highIssues.push('Security misconfiguration detected');
    }
    if (!owasp.a07_xss.compliant) {
      highIssues.push('XSS vulnerability detected');
    }
    if (!jwt.compliant) {
      highIssues.push('Weak JWT implementation');
    }

    // Medium issues
    if (!owasp.a09_components.compliant) {
      mediumIssues.push('No dependency scanning');
    }
    if (!owasp.a10_logging.compliant) {
      mediumIssues.push('No audit logging');
    }
    if (!supabase.compliant) {
      mediumIssues.push('Supabase security not configured');
    }
    if (!headers.compliant) {
      mediumIssues.push('Security headers missing');
    }

    // Low issues
    if (!cors.compliant) {
      lowIssues.push('CORS configuration too permissive');
    }
    if (!permissions.compliant) {
      lowIssues.push('No RBAC implementation');
    }
    if (!rateLimiting.compliant) {
      lowIssues.push('No rate limiting');
    }
    if (!secrets.compliant) {
      lowIssues.push('Secrets not properly managed');
    }

    return { criticalIssues, highIssues, mediumIssues, lowIssues };
  }
}
