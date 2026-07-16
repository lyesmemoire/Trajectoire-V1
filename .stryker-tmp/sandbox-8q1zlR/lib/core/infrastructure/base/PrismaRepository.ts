// @ts-nocheck
import { Result, ok, fail } from "../../result";
import { InfrastructureError } from "../../result/errors";
import { prisma } from "@/lib/prisma";

/**
 * Base class for Prisma Repositories.
 * Centralizes error translation and transaction execution.
 */
export abstract class PrismaRepository {
  protected get db() {
    return prisma;
  }

  /**
   * Encapsulates Prisma calls with standard InfrastructureError translation.
   */
  protected async safeExecute<T>(operation: () => Promise<T>): Promise<Result<T>> {
    try {
      const result = await operation();
      return ok(result);
    } catch (error: any) {
      return fail(this.translateError(error));
    }
  }

  /**
   * Executes a transaction securely and returns a standard Result.
   */
  protected async executeTransaction<T>(
    operations: (tx: any) => Promise<T>
  ): Promise<Result<T>> {
    try {
      const result = await this.db.$transaction(operations);
      return ok(result);
    } catch (error: any) {
      return fail(this.translateError(error));
    }
  }

  /**
   * Translates Prisma errors to standard InfrastructureError.
   */
  protected translateError(error: any): InfrastructureError {
    let message = "Prisma Error";
    
    if (error?.code) {
      // Prisma Client Known Request Errors
      switch (error.code) {
        case "P2002":
          message = "Unique constraint failed";
          break;
        case "P2025":
          message = "Record to update or delete not found";
          break;
        default:
          message = `Prisma error ${error.code}: ${error.message}`;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    return new InfrastructureError(message);
  }
}
