import { NextRequest, NextResponse } from 'next/server';
import { getStrictUser } from '@/lib/auth/get-user';
import { ApplicationError } from '@/lib/core/errors';
import { logger } from '@/lib/core/logger';
import { z } from 'zod';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiHandlerOptions<TInput, TOutput> {
  /** Zod schema for input validation (POST/PUT/PATCH) */
  schema?: z.Schema<TInput>;
  /** Whether authentication is required (default: true) */
  requireAuth?: boolean;
  /** The handler function */
  handler: (ctx: ApiContext<TInput>) => Promise<TOutput>;
}

interface ApiContext<TInput> {
  input: TInput;
  user: { id: string; email?: string } | null;
  req: NextRequest;
}

/**
 * Factory pour créer des route handlers standardisés.
 * 
 * Pipeline unifié :
 *   1. Validation Zod
 *   2. Authentification
 *   3. Exécution du handler métier
 *   4. Gestion d'erreurs homogène
 *   5. Logging
 * 
 * Usage :
 * ```ts
 * export const POST = createApiHandler({
 *   schema: MyZodSchema,
 *   handler: async ({ input, user }) => {
 *     return myService.doSomething(user.id, input);
 *   }
 * });
 * ```
 */
export function createApiHandler<TInput = unknown, TOutput = unknown>(
  options: ApiHandlerOptions<TInput, TOutput>
) {
  const { schema, requireAuth = true, handler } = options;

  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();

    try {
      // 1. Auth
      let user: { id: string; email?: string } | null = null;
      if (requireAuth) {
        user = await getStrictUser(req);
        if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      }

      // 2. Validation
      let input: TInput = undefined as TInput;
      if (schema) {
        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          const messages = parsed.error.errors
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', ');
          
          logger.warn(`Validation error on ${req.method} ${req.nextUrl.pathname}`, {
            type: 'validation_error',
            duration: Date.now() - startTime,
            details: messages
          });

          return NextResponse.json(
            { error: 'Validation failed', details: messages },
            { status: 400 }
          );
        }
        input = parsed.data;
      }

      // 3. Execute handler
      const result = await handler({ input, user, req });

      // 4. Success response
      const duration = Date.now() - startTime;
      logger.info(`API ${req.method} ${req.nextUrl.pathname} completed`, {
        type: 'success',
        userId: user?.id,
        duration,
      });

      return NextResponse.json({ success: true, data: result });

    } catch (error: unknown) {
      const duration = Date.now() - startTime;

      if (error instanceof ApplicationError) {
        logger.warn(`API business error: ${error.message}`, {
          type: 'business_error',
          code: error.code,
          statusCode: error.statusCode,
          duration,
        });
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        );
      }

      logger.error(
        `Unhandled API error on ${req.method} ${req.nextUrl.pathname}`,
        error,
        { type: 'unexpected_error', duration, failure: true }
      );

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
