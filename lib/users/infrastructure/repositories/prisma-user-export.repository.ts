import { prisma } from "@/lib/prisma";
import { Result, ok, fail, DomainError } from "@/lib/core/result";
import { InfrastructureError, NotFoundError } from "@/lib/core/result/errors";
import { UserExportPort } from "../../ports/user-export.port";

export class PrismaUserExportRepository implements UserExportPort {
  protected handleError(error: unknown): DomainError {
    if (error instanceof Error) {
      return new InfrastructureError(error.message);
    }
    return new InfrastructureError("Unknown database error");
  }

  protected async safeExecute<T>(operation: () => Promise<T>): Promise<Result<T, DomainError>> {
    try {
      return ok(await operation());
    } catch (error) {
      return fail(this.handleError(error));
    }
  }

  async exportData(userId: string): Promise<Result<any>> {
    return this.safeExecute(async () => {
      const data = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          careerProfile: true,
          BehavioralPattern: true,
          interviewSessions: {
            select: {
              jobTitle: true,
              score: true,
              createdAt: true,
              analysis: true,
            },
          },
        },
      });

      if (!data) {
        throw new NotFoundError("Data not found for user");
      }

      return data;
    });
  }
}
