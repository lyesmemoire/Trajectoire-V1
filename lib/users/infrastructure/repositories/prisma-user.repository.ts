import { prisma } from "@/lib/prisma";
import { getServerDb } from "@/lib/db/client";
import { Result, ok, fail, DomainError } from "@/lib/core/result";
import { InfrastructureError, NotFoundError } from "@/lib/core/result/errors";
import { UserRepositoryPort } from "../../ports/user-repository.port";
import { UserEntity, UserProfileEntity } from "../../domain/entities/user.entity";

export class PrismaUserRepository implements UserRepositoryPort {
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

  async findById(id: string): Promise<Result<{ user: UserEntity; profile: UserProfileEntity }>> {
    return this.safeExecute(async () => {
      const dbUser = await prisma.user.findUnique({
        where: { id },
      });
      
      if (!dbUser) {
        throw new NotFoundError("User not found");
      }
      
      const supabase = await getServerDb();
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", id).single();

      const user: UserEntity = {
        id: dbUser.id,
        email: dbUser.email || "",
        banned: profileData?.banned || false,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      };

      const profile: UserProfileEntity = {
        userId: dbUser.id,
        fullName: profileData?.full_name || dbUser.name || "",
        credits: profileData?.credits || 0,
        cvEditorCompleted: profileData?.cv_editor_completed || false,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      };

      return { user, profile };
    });
  }

  async findByEmail(email: string): Promise<Result<{ user: UserEntity; profile: UserProfileEntity }>> {
    return this.safeExecute(async () => {
      const dbUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!dbUser) {
        throw new NotFoundError("User not found");
      }
      const result = await this.findById(dbUser.id);
      if (result.isFailure()) throw result.unwrapError();
      return result.unwrap();
    });
  }

  async save(user: UserEntity, profile: UserProfileEntity): Promise<Result<void>> {
    return this.safeExecute(async () => {
      await prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email,
          name: profile.fullName,
          referralCode: user.id, // Random or unique value
        },
        update: {
          email: user.email,
          name: profile.fullName,
        },
      });
    });
  }

  async updateProfile(userId: string, data: Partial<UserProfileEntity>): Promise<Result<UserProfileEntity>> {
    return this.safeExecute(async () => {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          name: data.fullName,
        },
      });
      
      const supabase = await getServerDb();
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single();
      
      const profile: UserProfileEntity = {
        userId: updated.id,
        fullName: updated.name,
        credits: profileData?.credits || 0,
        cvEditorCompleted: profileData?.cv_editor_completed || false,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
      
      return profile;
    });
  }

  async delete(userId: string): Promise<Result<void>> {
    return this.safeExecute(async () => {
      await prisma.user.delete({ where: { id: userId } });
    });
  }
}
