// lib/security/authorization-middleware.ts
//
// CENTRALIZED AUTHORIZATION MIDDLEWARE
// Provides unified authorization checks for all API routes
//
// USAGE:
// Wrap your API route handlers with authorization middleware
// to enforce role-based access control

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * Access Levels
 */
export enum AccessLevel {
  PUBLIC = 'PUBLIC',
  AUTHENTICATED = 'AUTHENTICATED',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN',
}

/**
 * User Roles
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/**
 * Subscription Plans
 */
export enum SubscriptionPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  EXPERT = 'EXPERT',
}

/**
 * Authorization Context
 */
export interface AuthContext {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  role: UserRole | null;
  plan: SubscriptionPlan | null;
  accessLevel: AccessLevel;
  capabilities: {
    hasPremium: boolean;
    hasAdmin: boolean;
    canExport: boolean;
    canUseCopilot: boolean;
    canRunUnlimitedSimulation: boolean;
    hasUnlimitedHistory: boolean;
    hasAdvancedReports: boolean;
    hasAdvancedAPI: boolean;
  };
}

/**
 * Authorization Options
 */
export interface AuthorizationOptions {
  requiredAccessLevel?: AccessLevel;
  requiredRole?: UserRole;
  requiredPlan?: SubscriptionPlan;
  allowAnonymous?: boolean;
  checkPremium?: boolean;
}

/**
 * Get user from request
 */
async function getUserFromRequest(request: NextRequest): Promise<{ user: any; error: any }> {
  const supabase = await createClient();
  const result = await supabase.auth.getUser();
  return { user: result.data.user, error: result.error };
}

/**
 * Get user profile from database
 */
async function getUserProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      onboardingCompleted: true,
    },
  });
}

/**
 * Determine access level based on user profile
 */
function determineAccessLevel(
  authenticated: boolean,
  role: UserRole | null,
  plan: SubscriptionPlan | null
): AccessLevel {
  if (!authenticated) return AccessLevel.PUBLIC;
  if (role === UserRole.ADMIN) return AccessLevel.ADMIN;
  if (plan && plan !== SubscriptionPlan.FREE) return AccessLevel.PREMIUM;
  return AccessLevel.AUTHENTICATED;
}

/**
 * Get user capabilities based on plan
 */
function getCapabilities(plan: SubscriptionPlan | null, role: UserRole | null) {
  const hasPremium = plan && plan !== SubscriptionPlan.FREE;
  const hasAdmin = role === UserRole.ADMIN;

  return {
    hasPremium: hasPremium || hasAdmin,
    hasAdmin: hasAdmin,
    canExport: hasPremium || hasAdmin,
    canUseCopilot: hasPremium || hasAdmin,
    canRunUnlimitedSimulation: hasPremium || hasAdmin,
    hasUnlimitedHistory: hasPremium || hasAdmin,
    hasAdvancedReports: hasPremium || hasAdmin,
    hasAdvancedAPI: hasAdmin,
  };
}

/**
 * Create authorization context
 */
async function createAuthContext(request: NextRequest): Promise<AuthContext> {
  const { user, error } = await getUserFromRequest(request);

  if (error || !user) {
    return {
      authenticated: false,
      userId: null,
      email: null,
      role: null,
      plan: null,
      accessLevel: AccessLevel.PUBLIC,
      capabilities: {
        hasPremium: false,
        hasAdmin: false,
        canExport: false,
        canUseCopilot: false,
        canRunUnlimitedSimulation: false,
        hasUnlimitedHistory: false,
        hasAdvancedReports: false,
        hasAdvancedAPI: false,
      },
    };
  }

  const profile = await getUserProfile(user.id);
  const role = profile?.role as UserRole || UserRole.USER;
  const plan = profile?.plan as SubscriptionPlan || SubscriptionPlan.FREE;
  const accessLevel = determineAccessLevel(true, role, plan);
  const capabilities = getCapabilities(plan, role);

  return {
    authenticated: true,
    userId: user.id,
    email: user.email,
    role,
    plan,
    accessLevel,
    capabilities,
  };
}

/**
 * Check if user has required access level
 */
function hasRequiredAccess(
  context: AuthContext,
  options: AuthorizationOptions
): boolean {
  const { requiredAccessLevel, requiredRole, requiredPlan, checkPremium } = options;

  // Check access level
  if (requiredAccessLevel) {
    const levelOrder = [AccessLevel.PUBLIC, AccessLevel.AUTHENTICATED, AccessLevel.PREMIUM, AccessLevel.ADMIN];
    const contextLevel = levelOrder.indexOf(context.accessLevel);
    const requiredLevel = levelOrder.indexOf(requiredAccessLevel);

    if (contextLevel < requiredLevel) {
      return false;
    }
  }

  // Check role
  if (requiredRole && context.role !== requiredRole) {
    return false;
  }

  // Check plan
  if (requiredPlan && context.plan !== requiredPlan) {
    return false;
  }

  // Check premium
  if (checkPremium && !context.capabilities.hasPremium) {
    return false;
  }

  return true;
}

/**
 * Authorization middleware
 */
export function withAuthorization<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options: AuthorizationOptions = {}
): T {
  return (async (request: NextRequest, ...args: any[]) => {
    try {
      // Create authorization context
      const context = await createAuthContext(request);

      // Check if anonymous access is allowed
      if (!context.authenticated && !options.allowAnonymous && !options.requiredAccessLevel) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Check if user has required access
      if (!hasRequiredAccess(context, options)) {
        if (context.accessLevel === AccessLevel.PUBLIC) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }

        if (options.requiredAccessLevel === AccessLevel.PREMIUM) {
          return NextResponse.json(
            { error: 'Premium subscription required' },
            { status: 403 }
          );
        }

        if (options.requiredAccessLevel === AccessLevel.ADMIN) {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }

        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      // Attach auth context to request headers for downstream use
      const requestWithAuth = new NextRequest(request.url, {
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          'x-user-id': context.userId || '',
          'x-user-email': context.email || '',
          'x-user-role': context.role || '',
          'x-user-plan': context.plan || '',
          'x-access-level': context.accessLevel,
        },
      });

      // Call the original handler
      const response = await handler(requestWithAuth, ...args);

      return response;
    } catch (error) {
      logger.error({ err: error }, 'Authorization middleware error');
      return NextResponse.json(
        { error: 'Internal authorization error' },
        { status: 500 }
      );
    }
  }) as T;
}

/**
 * Helper: Public access (no authentication required)
 */
export function withPublicAccess<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return withAuthorization(handler, { allowAnonymous: true });
}

/**
 * Helper: Authenticated access (login required)
 */
export function withAuthAccess<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return withAuthorization(handler, { requiredAccessLevel: AccessLevel.AUTHENTICATED });
}

/**
 * Helper: Premium access (subscription required)
 */
export function withPremiumAccess<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return withAuthorization(handler, { requiredAccessLevel: AccessLevel.PREMIUM });
}

/**
 * Helper: Admin access (admin role required)
 */
export function withAdminAccess<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return withAuthorization(handler, { requiredAccessLevel: AccessLevel.ADMIN });
}

/**
 * Get auth context from request (for use in handlers)
 */
export async function getAuthContext(request: NextRequest): Promise<AuthContext> {
  return await createAuthContext(request);
}
