/**
 * RepositoryError
 * Thrown when repository operations fail
 */

import { AppError, ErrorCode } from "./AppError";

export class RepositoryError extends AppError {
  constructor(
    message: string = "Repository error",
    public readonly repository: string,
    public readonly operation: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCode.DATABASE_ERROR, 500, true, { ...context, repository, operation });
    this.name = "RepositoryError";
  }
}
