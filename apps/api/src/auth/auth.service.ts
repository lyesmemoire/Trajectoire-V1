import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  /**
   * Validate JWT token from Supabase
   * This is a placeholder - actual validation happens in JwtStrategy
   */
  async validateToken(token: string): Promise<any> {
    // Token validation is handled by JwtStrategy
    // This service can be used for additional validation if needed
    return { valid: true };
  }

  /**
   * Get user from JWT payload
   */
  async getUserFromPayload(payload: any): Promise<any> {
    return {
      id: payload.sub,
      email: payload.email,
      aud: payload.aud,
      role: payload.role || 'authenticated',
    };
  }
}
