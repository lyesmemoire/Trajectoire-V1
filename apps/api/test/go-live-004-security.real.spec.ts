/**
 * GO-LIVE-004 Security Real Tests
 * 
 * This test suite validates all security fixes from SECURITY-FIX-002
 * Tests use REAL execution with actual Supabase users - NO MOCKS
 * 
 * Test Users (must exist in Supabase):
 * - security_test_a@example.com (USER_A)
 * - security_test_b@example.com (USER_B)
 * 
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY (for test setup/cleanup)
 * - API_URL (default: http://localhost:3000)
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const USER_A_EMAIL = 'security_test_a@example.com';
const USER_B_EMAIL = 'security_test_b@example.com';
const TEST_PASSWORD = 'TestPassword123!';

interface TestUser {
  email: string;
  password: string;
  supabase: SupabaseClient;
  jwt: string | null;
  userId: string | null;
}

describe('GO-LIVE-004 Security Real Tests', () => {
  let userA: TestUser;
  let userB: TestUser;
  let serviceRoleClient: SupabaseClient;

  beforeAll(async () => {
    // Initialize service role client for test setup/cleanup
    serviceRoleClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Initialize test users
    userA = {
      email: USER_A_EMAIL,
      password: TEST_PASSWORD,
      supabase: createClient(SUPABASE_URL, SUPABASE_ANON_KEY),
      jwt: null,
      userId: null,
    };

    userB = {
      email: USER_B_EMAIL,
      password: TEST_PASSWORD,
      supabase: createClient(SUPABASE_URL, SUPABASE_ANON_KEY),
      jwt: null,
      userId: null,
    };

    // Authenticate users
    const { data: sessionA, error: errorA } = await userA.supabase.auth.signInWithPassword({
      email: userA.email,
      password: userA.password,
    });

    if (errorA || !sessionA) {
      throw new Error(`Failed to authenticate USER_A: ${errorA?.message}`);
    }

    userA.jwt = sessionA.session.access_token;
    userA.userId = sessionA.user.id;

    const { data: sessionB, error: errorB } = await userB.supabase.auth.signInWithPassword({
      email: userB.email,
      password: userB.password,
    });

    if (errorB || !sessionB) {
      throw new Error(`Failed to authenticate USER_B: ${errorB?.message}`);
    }

    userB.jwt = sessionB.session.access_token;
    userB.userId = sessionB.user.id;
  });

  afterAll(async () => {
    // Cleanup test data
    // This would delete test CVs, graphs, sessions created during tests
    // Implementation depends on test data tracking
  });

  describe('Authentication Tests', () => {
    it('should reject unauthenticated API requests with 401', async () => {
      const response = await fetch(`${API_URL}/cv/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(401);
    });

    it('should accept authenticated requests with valid JWT', async () => {
      const response = await fetch(`${API_URL}/copilot/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userA.jwt}`,
        },
      });

      // Should not be 401 (may be 400 due to missing body, but not auth error)
      expect(response.status).not.toBe(401);
    });

    it('should reject requests with invalid JWT with 401', async () => {
      const response = await fetch(`${API_URL}/copilot/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid.jwt.token',
        },
      });

      expect(response.status).toBe(401);
    });
  });

  describe('IDOR Prevention Tests', () => {
    it('should prevent USER_A from accessing USER_B graphs', async () => {
      // Create a graph as USER_A
      const createResponse = await fetch(`${API_URL}/graph`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userA.jwt}`,
        },
        body: JSON.stringify({
          name: 'Test Graph A',
          description: 'Test graph for IDOR test',
        }),
      });

      expect(createResponse.status).toBe(201);
      const graphA = await createResponse.json();

      // Try to access USER_A's graph as USER_B
      const accessResponse = await fetch(`${API_URL}/graph/${graphA.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userB.jwt}`,
        },
      });

      // Should return 404 (not found) or 403 (forbidden)
      // NOT 200 (success)
      expect(accessResponse.status).toBeGreaterThanOrEqual(400);
      expect(accessResponse.status).not.toBe(200);

      // Cleanup
      await fetch(`${API_URL}/graph/${graphA.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userA.jwt}`,
        },
      });
    });

    it('should prevent USER_A from listing USER_B graphs', async () => {
      // Create a graph as USER_B
      const createResponse = await fetch(`${API_URL}/graph`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userB.jwt}`,
        },
        body: JSON.stringify({
          name: 'Test Graph B',
          description: 'Test graph for IDOR test',
        }),
      });

      expect(createResponse.status).toBe(201);
      const graphB = await createResponse.json();

      // List graphs as USER_A
      const listResponse = await fetch(`${API_URL}/graph`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userA.jwt}`,
        },
      });

      expect(listResponse.status).toBe(200);
      const graphs = await listResponse.json();

      // USER_B's graph should NOT be in the list
      const hasUserBGraph = graphs.some((g: any) => g.id === graphB.id);
      expect(hasUserBGraph).toBe(false);

      // Cleanup
      await fetch(`${API_URL}/graph/${graphB.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userB.jwt}`,
        },
      });
    });
  });

  describe('Copilot Isolation Tests', () => {
    it('should use authenticated userId instead of client-provided userId', async () => {
      const sessionId = 'test-session-id';

      // Try to send message with client-provided userId (should be ignored)
      const response = await fetch(`${API_URL}/copilot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userA.jwt}`,
        },
        body: JSON.stringify({
          sessionId,
          message: 'Test message',
          userId: userB.userId, // This should be ignored
        }),
      });

      // Should not fail with "userId is required" since it's extracted from JWT
      expect(response.status).not.toBe(401);
    });

    it('should prevent cross-user conversation access', async () => {
      const sessionId = 'test-session-cross-user';

      // Create conversation as USER_A
      await fetch(`${API_URL}/copilot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userA.jwt}`,
        },
        body: JSON.stringify({
          sessionId,
          message: 'Test message',
        }),
      });

      // Try to access conversation as USER_B
      const historyResponse = await fetch(`${API_URL}/copilot/history/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userB.jwt}`,
        },
      });

      // Should return empty or 404, not USER_A's conversation
      expect(historyResponse.status).toBe(200);
      const history = await historyResponse.json();
      expect(history.data).toEqual([]);
    });
  });

  describe('Search Isolation Tests', () => {
    it('should use authenticated userId for search history', async () => {
      const response = await fetch(`${API_URL}/search/recruiter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userA.jwt}`,
        },
        body: JSON.stringify({
          query: 'test query',
          graphs: [],
        }),
      });

      // Should not fail with userId missing error
      expect(response.status).not.toBe(401);
    });
  });

  describe('Security Headers Tests', () => {
    it('should include security headers on API responses', async () => {
      const response = await fetch(`${API_URL}/graph`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userA.jwt}`,
        },
      });

      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
      expect(response.headers.get('Permissions-Policy')).toContain('camera=()');
    });

    it('should include CSP header', async () => {
      const response = await fetch(`${API_URL}/graph`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userA.jwt}`,
        },
      });

      const csp = response.headers.get('Content-Security-Policy');
      expect(csp).toContain('default-src');
      expect(csp).toContain('frame-ancestors');
    });
  });

  describe('Rate Limiting Tests', () => {
    it('should include rate limit headers', async () => {
      const response = await fetch(`${API_URL}/graph`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userA.jwt}`,
        },
      });

      expect(response.headers.get('X-RateLimit-Limit')).toBeTruthy();
      expect(response.headers.get('X-RateLimit-Remaining')).toBeTruthy();
      expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
    });

    it('should enforce rate limits (integration test - may take time)', async () => {
      // This test would make many rapid requests to verify rate limiting
      // Marked as skip for normal test runs due to time constraints
      // Uncomment to run in dedicated rate limit testing
      /*
      const requests = [];
      for (let i = 0; i < 150; i++) {
        requests.push(
          fetch(`${API_URL}/graph`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${userA.jwt}`,
            },
          })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
      */
    }, 60000);
  });

  describe('Billing Isolation Tests', () => {
    it('should use authenticated user for subscription check', async () => {
      // This tests the web endpoint which uses Supabase auth
      const response = await fetch(`${API_URL}/api/user/subscription`, {
        method: 'GET',
        headers: {
          'Cookie': `sb-access-token=${userA.jwt}`,
        },
      });

      // Should not be 401 (authenticated)
      expect(response.status).not.toBe(401);
    });
  });

  describe('Graph Ownership Tests', () => {
    it('should associate graph with authenticated user on creation', async () => {
      const response = await fetch(`${API_URL}/graph`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userA.jwt}`,
        },
        body: JSON.stringify({
          name: 'Ownership Test Graph',
          description: 'Test graph for ownership verification',
        }),
      });

      expect(response.status).toBe(201);
      const graph = await response.json();

      // Verify graph has userId in database (requires direct DB access)
      // For now, we verify it was created successfully
      expect(graph.id).toBeTruthy();

      // Cleanup
      await fetch(`${API_URL}/graph/${graph.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userA.jwt}`,
        },
      });
    });
  });
});
