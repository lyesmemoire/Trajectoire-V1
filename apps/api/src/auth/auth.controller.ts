/**
 * Auth Controller
 *
 * Exposes authentication-related endpoints.
 */

import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';

import {
  JwtAuthGuard,
} from './jwt-auth.guard';
import { RateLimitAuth } from '../resilience/rate-limiting.decorator';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  /**
   * Get current authenticated user
   * Returns the user information from the JWT payload
   */
  @Get('me')
  @RateLimitAuth()
  async getCurrentUser(@Req() req: any) {
    return req.user;
  }
}
