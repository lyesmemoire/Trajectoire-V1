import { test, expect } from '@playwright/test';

test.describe('Security Audit E2E', () => {
  test('should access security audit endpoint', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('owasp');
    expect(data).toHaveProperty('jwt');
    expect(data).toHaveProperty('supabase');
    expect(data).toHaveProperty('headers');
    expect(data).toHaveProperty('cors');
    expect(data).toHaveProperty('permissions');
    expect(data).toHaveProperty('rateLimiting');
    expect(data).toHaveProperty('secrets');
    expect(data).toHaveProperty('securityScore');
    expect(data).toHaveProperty('recommendations');
    expect(data).toHaveProperty('criticalIssues');
    expect(data).toHaveProperty('highIssues');
    expect(data).toHaveProperty('mediumIssues');
    expect(data).toHaveProperty('lowIssues');
  });

  test('should return security score between 0 and 100', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    const data = await response.json();
    
    expect(data.securityScore.overallScore).toBeGreaterThanOrEqual(0);
    expect(data.securityScore.overallScore).toBeLessThanOrEqual(100);
  });

  test('should return security grade', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    const data = await response.json();
    
    const validGrades = ['A+', 'A', 'B', 'C', 'D', 'F'];
    expect(validGrades).toContain(data.securityScore.grade);
  });

  test('should return OWASP audit results', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    const data = await response.json();
    
    expect(data.owasp).toHaveProperty('a01_injection');
    expect(data.owasp).toHaveProperty('a02_broken_auth');
    expect(data.owasp).toHaveProperty('a03_sensitive_data');
    expect(data.owasp).toHaveProperty('a04_xml_entities');
    expect(data.owasp).toHaveProperty('a05_access_control');
    expect(data.owasp).toHaveProperty('a06_misconfig');
    expect(data.owasp).toHaveProperty('a07_xss');
    expect(data.owasp).toHaveProperty('a08_insecure_deserialization');
    expect(data.owasp).toHaveProperty('a09_components');
    expect(data.owasp).toHaveProperty('a10_logging');
    expect(data.owasp).toHaveProperty('score');
  });

  test('should return JWT audit results', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    const data = await response.json();
    
    expect(data.jwt).toHaveProperty('algorithm');
    expect(data.jwt).toHaveProperty('secretStrength');
    expect(data.jwt).toHaveProperty('expiration');
    expect(data.jwt).toHaveProperty('issuer');
    expect(data.jwt).toHaveProperty('audience');
    expect(data.jwt).toHaveProperty('compliant');
    expect(data.jwt).toHaveProperty('issues');
    expect(data.jwt).toHaveProperty('score');
  });

  test('should return security headers audit results', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    const data = await response.json();
    
    expect(data.headers).toHaveProperty('securityHeaders');
    expect(data.headers.securityHeaders).toHaveProperty('Strict-Transport-Security');
    expect(data.headers.securityHeaders).toHaveProperty('X-Content-Type-Options');
    expect(data.headers.securityHeaders).toHaveProperty('X-Frame-Options');
    expect(data.headers.securityHeaders).toHaveProperty('X-XSS-Protection');
    expect(data.headers.securityHeaders).toHaveProperty('Content-Security-Policy');
    expect(data.headers.securityHeaders).toHaveProperty('Referrer-Policy');
    expect(data.headers.securityHeaders).toHaveProperty('Permissions-Policy');
    expect(data.headers).toHaveProperty('compliant');
    expect(data.headers).toHaveProperty('issues');
    expect(data.headers).toHaveProperty('score');
  });

  test('should return CORS audit results', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    const data = await response.json();
    
    expect(data.cors).toHaveProperty('originPolicy');
    expect(data.cors).toHaveProperty('credentials');
    expect(data.cors).toHaveProperty('methods');
    expect(data.cors).toHaveProperty('headers');
    expect(data.cors).toHaveProperty('maxAge');
    expect(data.cors).toHaveProperty('compliant');
    expect(data.cors).toHaveProperty('issues');
    expect(data.cors).toHaveProperty('score');
  });

  test('should return recommendations', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    const data = await response.json();
    
    expect(data.recommendations).toBeInstanceOf(Array);
    expect(data.recommendations.length).toBeGreaterThan(0);
  });

  test('should categorize issues by severity', async ({ request }) => {
    const response = await request.get('http://localhost:3000/security/audit');
    const data = await response.json();
    
    expect(data.criticalIssues).toBeInstanceOf(Array);
    expect(data.highIssues).toBeInstanceOf(Array);
    expect(data.mediumIssues).toBeInstanceOf(Array);
    expect(data.lowIssues).toBeInstanceOf(Array);
  });
});
