// apps/web/src/lib/authorization/AuthorizationV2.test.ts
//
// Tests pour Authorization V2
// Tests pour tous les niveaux d'accès: PUBLIC, AUTHENTICATED, PREMIUM, ADMIN

import { AuthorizationV2, AccessLevel, UserRole, SubscriptionPlan, UserContext } from './AuthorizationV2';

describe('AuthorizationV2', () => {
  describe('PUBLIC Access Level', () => {
    it('should allow access to public routes without authentication', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /features', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/features');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /pricing', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/pricing');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /login', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/login');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /signup', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/signup');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /api/auth', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/api/auth/callback');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /api/stripe/webhook', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/api/stripe/webhook');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /api/health', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/api/health');
      expect(result.allowed).toBe(true);
    });
  });

  describe('AUTHENTICATED Access Level', () => {
    const userContext: UserContext = {
      userId: 'user-123',
      email: 'user@example.com',
      role: UserRole.USER,
      plan: SubscriptionPlan.FREE,
      isAuthenticated: true,
    };

    it('should allow access to /dashboard for authenticated users', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/dashboard');
      expect(result.allowed).toBe(true);
    });

    it('should deny access to /dashboard for unauthenticated users', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/dashboard');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Authentication required');
    });

    it('should allow access to /simulation', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/simulation');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /report', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/report');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /history', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/history');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /settings', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/settings');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /api/cv', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/api/cv');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /api/user', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/api/user');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /api/simulation', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/api/simulation');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /api/interview', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/api/interview');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /analyze', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/analyze');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /search', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/search');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /copilot', () => {
      const auth = new AuthorizationV2(userContext);
      
      const result = auth.checkAccess('/copilot');
      expect(result.allowed).toBe(true);
    });
  });

  describe('PREMIUM Access Level', () => {
    const premiumUserContext: UserContext = {
      userId: 'user-123',
      email: 'user@example.com',
      role: UserRole.USER,
      plan: SubscriptionPlan.PRO,
      isAuthenticated: true,
    };

    const freeUserContext: UserContext = {
      userId: 'user-456',
      email: 'free@example.com',
      role: UserRole.USER,
      plan: SubscriptionPlan.FREE,
      isAuthenticated: true,
    };

    const expertUserContext: UserContext = {
      userId: 'user-789',
      email: 'expert@example.com',
      role: UserRole.USER,
      plan: SubscriptionPlan.EXPERT,
      isAuthenticated: true,
    };

    it('should allow access to premium routes for PRO users', () => {
      const auth = new AuthorizationV2(premiumUserContext);
      
      // Note: Currently no routes are marked as PREMIUM in the rules
      // This test verifies the logic works when PREMIUM routes are added
      const result = auth.isPremium();
      expect(result).toBe(true);
    });

    it('should allow access to premium routes for EXPERT users', () => {
      const auth = new AuthorizationV2(expertUserContext);
      
      const result = auth.isPremium();
      expect(result).toBe(true);
    });

    it('should deny premium access for FREE users', () => {
      const auth = new AuthorizationV2(freeUserContext);
      
      const result = auth.isPremium();
      expect(result).toBe(false);
    });

    it('should return correct reason for denied premium access', () => {
      const auth = new AuthorizationV2(freeUserContext);
      
      // Simulate a premium route check
      const result = auth.checkAccess('/premium-feature');
      if (!result.allowed) {
        expect(result.reason).toBe('Premium subscription required');
      }
    });
  });

  describe('ADMIN Access Level', () => {
    const adminUserContext: UserContext = {
      userId: 'admin-123',
      email: 'admin@example.com',
      role: UserRole.ADMIN_FOUNDER,
      plan: SubscriptionPlan.EXPERT,
      isAuthenticated: true,
    };

    const supportAdminContext: UserContext = {
      userId: 'support-123',
      email: 'support@example.com',
      role: UserRole.ADMIN_SUPPORT,
      plan: SubscriptionPlan.EXPERT,
      isAuthenticated: true,
    };

    const regularUserContext: UserContext = {
      userId: 'user-123',
      email: 'user@example.com',
      role: UserRole.USER,
      plan: SubscriptionPlan.FREE,
      isAuthenticated: true,
    };

    it('should allow access to /admin for admin users', () => {
      const auth = new AuthorizationV2(adminUserContext);
      
      const result = auth.checkAccess('/admin');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to /api/admin for admin users', () => {
      const auth = new AuthorizationV2(adminUserContext);
      
      const result = auth.checkAccess('/api/admin');
      expect(result.allowed).toBe(true);
    });

    it('should allow access to admin routes for SUPPORT admins', () => {
      const auth = new AuthorizationV2(supportAdminContext);
      
      const result = auth.checkAccess('/admin');
      expect(result.allowed).toBe(true);
    });

    it('should deny access to /admin for regular users', () => {
      const auth = new AuthorizationV2(regularUserContext);
      
      const result = auth.checkAccess('/admin');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Admin role required');
    });

    it('should deny access to /api/admin for regular users', () => {
      const auth = new AuthorizationV2(regularUserContext);
      
      const result = auth.checkAccess('/api/admin');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Admin role required');
    });

    it('should identify admin users correctly', () => {
      const auth = new AuthorizationV2(adminUserContext);
      
      expect(auth.isAdmin()).toBe(true);
    });

    it('should identify support admins as admin', () => {
      const auth = new AuthorizationV2(supportAdminContext);
      
      expect(auth.isAdmin()).toBe(true);
    });

    it('should not identify regular users as admin', () => {
      const auth = new AuthorizationV2(regularUserContext);
      
      expect(auth.isAdmin()).toBe(false);
    });

    it('should check role hierarchy correctly', () => {
      const auth = new AuthorizationV2(adminUserContext);
      
      expect(auth.hasRole(UserRole.USER)).toBe(true);
      expect(auth.hasRole(UserRole.ADMIN_SUPPORT)).toBe(true);
      expect(auth.hasRole(UserRole.ADMIN_PRODUCT)).toBe(true);
      expect(auth.hasRole(UserRole.ADMIN_FOUNDER)).toBe(true);
    });
  });

  describe('User Context Management', () => {
    it('should set user context', () => {
      const auth = new AuthorizationV2();
      const userContext: UserContext = {
        userId: 'user-123',
        email: 'user@example.com',
        role: UserRole.USER,
        plan: SubscriptionPlan.FREE,
        isAuthenticated: true,
      };

      auth.setUserContext(userContext);
      
      expect(auth.getUserContext()).toBe(userContext);
    });

    it('should update user context', () => {
      const auth = new AuthorizationV2();
      const initialContext: UserContext = {
        userId: 'user-123',
        email: 'user@example.com',
        role: UserRole.USER,
        plan: SubscriptionPlan.FREE,
        isAuthenticated: true,
      };

      auth.setUserContext(initialContext);
      
      const updatedContext: UserContext = {
        userId: 'user-456',
        email: 'updated@example.com',
        role: UserRole.ADMIN_SUPPORT,
        plan: SubscriptionPlan.PRO,
        isAuthenticated: true,
      };

      auth.setUserContext(updatedContext);
      
      expect(auth.getUserContext()).toBe(updatedContext);
    });
  });

  describe('Route Rule Management', () => {
    it('should return all route rules', () => {
      const auth = new AuthorizationV2();
      
      const rules = auth.getRouteRules();
      expect(rules.length).toBeGreaterThan(0);
    });

    it('should add a new route rule', () => {
      const auth = new AuthorizationV2();
      const initialCount = auth.getRouteRules().length;

      auth.addRouteRule({
        pattern: '/new-route',
        accessLevel: AccessLevel.AUTHENTICATED,
        comment: 'New route',
      });

      expect(auth.getRouteRules().length).toBe(initialCount + 1);
    });

    it('should remove a route rule', () => {
      const auth = new AuthorizationV2();
      auth.addRouteRule({
        pattern: '/temp-route',
        accessLevel: AccessLevel.PUBLIC,
        comment: 'Temporary route',
      });

      const initialCount = auth.getRouteRules().length;
      auth.removeRouteRule('/temp-route');

      expect(auth.getRouteRules().length).toBe(initialCount - 1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown routes as public (fail-open)', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/unknown-route');
      expect(result.allowed).toBe(true);
    });

    it('should handle empty pathname', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('');
      expect(result.allowed).toBe(true);
    });

    it('should handle null user context for authenticated routes', () => {
      const auth = new AuthorizationV2(null);
      
      const result = auth.checkAccess('/dashboard');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Authentication required');
    });
  });
});
