// lib/security/jwt.ts
//
// JWT VALIDATION AND MANAGEMENT SERVICE
// Provides comprehensive JWT security features including rotation, expiration,
// refresh, audience validation, issuer validation, replay protection, and blacklist
//
// USAGE:
// Use this service to validate and manage JWT tokens with advanced security features

import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * JWT Configuration
 */
const JWT_CONFIG = {
  // Access token settings
  ACCESS_TOKEN_EXPIRY: '15m', // 15 minutes
  ACCESS_TOKEN_ISSUER: 'trajectoire.app',
  ACCESS_TOKEN_AUDIENCE: 'trajectoire-api',
  
  // Refresh token settings
  REFRESH_TOKEN_EXPIRY: '7d', // 7 days
  REFRESH_TOKEN_ISSUER: 'trajectoire.app',
  REFRESH_TOKEN_AUDIENCE: 'trajectoire-refresh',
  
  // Secret keys (should be in environment variables)
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
  
  // Replay protection
  REPLAY_WINDOW_SECONDS: 300, // 5 minutes
};

/**
 * JWT Token Types
 */
export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

/**
 * JWT Payload Interface
 */
export interface JWTPayloadExtended extends JWTPayload {
  userId: string;
  email: string;
  type: TokenType;
  jti?: string; // JWT ID for replay protection
  version?: number; // Token version for rotation
}

/**
 * Generate JWT token
 */
export async function generateToken(
  payload: Omit<JWTPayloadExtended, 'iat' | 'exp'>,
  secret: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = payload.type === TokenType.ACCESS 
    ? now + (15 * 60) // 15 minutes
    : now + (7 * 24 * 60 * 60); // 7 days

  const jwt = await new SignJWT({ ...payload, iat: now, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setIssuer(JWT_CONFIG.ACCESS_TOKEN_ISSUER)
    .setAudience(payload.type === TokenType.ACCESS ? JWT_CONFIG.ACCESS_TOKEN_AUDIENCE : JWT_CONFIG.REFRESH_TOKEN_AUDIENCE)
    .setJti((payload.jti ?? generateJTI()) as string)
    .sign(new TextEncoder().encode(secret));

  return jwt;
}

/**
 * Generate JWT ID (JTI) for replay protection
 */
function generateJTI(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
}

/**
 * Generate access token
 */
export async function generateAccessToken(userId: string, email: string): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  
  const token = await generateToken(
    {
      userId,
      email,
      type: TokenType.ACCESS,
      version: 1,
    },
    JWT_CONFIG.ACCESS_SECRET
  );

  return { token, expiresAt };
}

/**
 * Generate refresh token
 */
export async function generateRefreshToken(userId: string, email: string): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const token = await generateToken(
    {
      userId,
      email,
      type: TokenType.REFRESH,
      version: 1,
    },
    JWT_CONFIG.REFRESH_SECRET
  );

  // Store refresh token in database
  await (prisma as any).refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

/**
 * Validate JWT token
 */
export async function validateToken(
  token: string,
  type: TokenType
): Promise<{ valid: boolean; payload?: JWTPayloadExtended; error?: string }> {
  try {
    const secret = type === TokenType.ACCESS ? JWT_CONFIG.ACCESS_SECRET : JWT_CONFIG.REFRESH_SECRET;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    // Check if token is blacklisted
    const jti = payload.jti as string;
    if (jti && await isTokenBlacklisted(jti)) {
      return { valid: false, error: 'Token is blacklisted' };
    }

    // Check replay protection
    if (jti && await isTokenReplayed(jti, payload.iat as number)) {
      return { valid: false, error: 'Token replay detected' };
    }

    // Validate audience
    const expectedAudience = type === TokenType.ACCESS ? JWT_CONFIG.ACCESS_TOKEN_AUDIENCE : JWT_CONFIG.REFRESH_TOKEN_AUDIENCE;
    if (payload.aud !== expectedAudience) {
      return { valid: false, error: 'Invalid audience' };
    }

    // Validate issuer
    if (payload.iss !== JWT_CONFIG.ACCESS_TOKEN_ISSUER) {
      return { valid: false, error: 'Invalid issuer' };
    }

    // Validate token type
    if (payload.type !== type) {
      return { valid: false, error: 'Invalid token type' };
    }

    // Record token for replay protection
    if (jti) {
      await recordTokenUsage(jti, payload.iat as number);
    }

    return { valid: true, payload: payload as JWTPayloadExtended };
  } catch (error: any) {
    logger.error({ error }, 'JWT validation failed');
    return { valid: false, error: error.message || 'Invalid token' };
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken?: string; error?: string }> {
  // Validate refresh token
  const validation = await validateToken(refreshToken, TokenType.REFRESH);
  
  if (!validation.valid || !validation.payload) {
    return { error: validation.error || 'Invalid refresh token' };
  }

  const payload = validation.payload;
  
  // Check if refresh token exists in database
  const storedToken = await (prisma as any).refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    return { error: 'Refresh token not found' };
  }

  if (storedToken.revokedAt) {
    return { error: 'Refresh token has been revoked' };
  }

  if (storedToken.expiresAt < new Date()) {
    return { error: 'Refresh token has expired' };
  }

  // Generate new access token
  const { token: accessToken } = await generateAccessToken(payload.userId, payload.email);

  // Token rotation: revoke old refresh token and generate new one
  await (prisma as any).refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  const { token: newRefreshToken } = await generateRefreshToken(payload.userId, payload.email);

  return { accessToken, refreshToken: newRefreshToken } as any;
}

/**
 * Revoke refresh token
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  await (prisma as any).refreshToken.updateMany({
    where: { token },
    data: { revokedAt: new Date() },
  });

  // Also blacklist the JTI
  const validation = await validateToken(token, TokenType.REFRESH);
  if (validation.valid && validation.payload?.jti) {
    await blacklistToken(validation.payload.jti);
  }
}

/**
 * Revoke all refresh tokens for a user
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  const tokens = await (prisma as any).refreshToken.findMany({
    where: { userId, revokedAt: null },
  });

  for (const token of tokens) {
    await (prisma as any).refreshToken.update({
      where: { id: token.id },
      data: { revokedAt: new Date() },
    });

    // Blacklist the JTI
    const validation = await validateToken(token.token, TokenType.REFRESH);
    if (validation.valid && validation.payload?.jti) {
      await blacklistToken(validation.payload.jti);
    }
  }
}

/**
 * Blacklist a token by JTI
 */
export async function blacklistToken(jti: string): Promise<void> {
  await (prisma as any).blacklistedToken.create({
    data: {
      jti,
      expiresAt: new Date(Date.now() + JWT_CONFIG.REPLAY_WINDOW_SECONDS * 1000),
    },
  });
}

/**
 * Check if token is blacklisted
 */
export async function isTokenBlacklisted(jti: string): Promise<boolean> {
  const blacklisted = await (prisma as any).blacklistedToken.findUnique({
    where: { jti },
  });

  if (!blacklisted) {
    return false;
  }

  // Clean up expired blacklisted tokens
  if (blacklisted.expiresAt < new Date()) {
    await (prisma as any).blacklistedToken.delete({
      where: { id: blacklisted.id },
    });
    return false;
  }

  return true;
}

/**
 * Record token usage for replay protection
 */
export async function recordTokenUsage(jti: string, iat: number): Promise<void> {
  const expiresAt = new Date((iat + JWT_CONFIG.REPLAY_WINDOW_SECONDS) * 1000);
  
  await (prisma as any).usedToken.upsert({
    where: { jti },
    create: {
      jti,
      iat,
      expiresAt,
    },
    update: {
      expiresAt,
    },
  });
}

/**
 * Check if token has been replayed
 */
export async function isTokenReplayed(jti: string, iat: number): Promise<boolean> {
  const used = await (prisma as any).usedToken.findUnique({
    where: { jti },
  });

  if (!used) {
    return false;
  }

  // Clean up expired used tokens
  if (used.expiresAt < new Date()) {
    await (prisma as any).usedToken.delete({
      where: { id: used.id },
    });
    return false;
  }

  return true;
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const exp = payload.exp;

    if (!exp) return null;

    return new Date(exp * 1000);
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  return expiration < new Date();
}

/**
 * Extract user ID from token without full validation
 */
export function extractUserId(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.userId || null;
  } catch (error) {
    return null;
  }
}
