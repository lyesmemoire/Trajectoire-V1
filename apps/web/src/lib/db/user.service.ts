import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type LegacyResult<T> = {
  data: T | null;
  error: Error | null;
};

type LegacyUserProjection =
  | {
      credits: number;
    }
  | Awaited<ReturnType<typeof prisma.user.findUnique>>;

/**
 * User domain data access.
 *
 * Prisma is the canonical persistence layer for application users.
 *
 * The legacy getProfile/getProfileByEmail methods intentionally keep
 * Supabase's historical `{ data, error }` response shape because a small
 * number of callers still depend on that contract.
 */
export const UserService = {
  /**
   * =======================
   * PRISMA ACCESS
   * =======================
   */

  async findUnique(args: Prisma.UserFindUniqueArgs) {
    return prisma.user.findUnique(args);
  },

  async update(args: Prisma.UserUpdateArgs) {
    return prisma.user.update(args);
  },

  async count(args?: Prisma.UserCountArgs) {
    return prisma.user.count(args);
  },

  /**
   * =======================
   * LEGACY COMPATIBILITY
   * =======================
   *
   * The old Supabase `profiles` table no longer exists in the current
   * database schema. These methods now resolve against Prisma `User`
   * while preserving the old `{ data, error }` response shape.
   */

  async getProfile(
    userId: string,
    select = "*",
    _supabaseClient?: unknown,
  ): Promise<LegacyResult<LegacyUserProjection>> {
    try {
      if (select === "credits") {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            credits: true,
          },
        });

        return {
          data: user,
          error: null,
        };
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      return {
        data: user,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: normalizeError(error),
      };
    }
  },

  /**
   * No active caller currently uses this method.
   *
   * Kept temporarily because other code may import UserService dynamically.
   * New code should use UserService.update().
   */
  async updateProfile(
    userId: string,
    data: Prisma.UserUpdateInput,
    _supabaseClient?: unknown,
  ): Promise<LegacyResult<Awaited<ReturnType<typeof prisma.user.update>>>> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data,
      });

      return {
        data: user,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: normalizeError(error),
      };
    }
  },

  /**
   * No active caller currently uses this method.
   *
   * Kept as a compatibility bridge only.
   */
  async insertProfile(
    data: Prisma.UserCreateInput,
    _supabaseClient?: unknown,
  ): Promise<LegacyResult<Awaited<ReturnType<typeof prisma.user.create>>>> {
    try {
      const user = await prisma.user.create({
        data,
      });

      return {
        data: user,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: normalizeError(error),
      };
    }
  },

  async getProfileByEmail(
    email: string,
    _select = "*",
    _supabaseClient?: unknown,
  ): Promise<
    LegacyResult<Awaited<ReturnType<typeof prisma.user.findUnique>>>
  > {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      return {
        data: user,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: normalizeError(error),
      };
    }
  },
};

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}