import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check for public route decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    this.logger.log(`Applying JWT authentication to ${context.getClass().name}.${context.getHandler().name}`);
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    // If authentication fails, throw UnauthorizedException
    if (err || !user) {
      this.logger.warn(`Authentication failed: ${info?.message || 'No user found'}`);
      throw new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
