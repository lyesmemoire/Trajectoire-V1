import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type Profile = {
  id: string;
  user_id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  consent_given: boolean;
  consent_date: string | null;
  created_at: string;
  updated_at: string;
};

function splitName(name: string | null): {
  firstname: string | null;
  lastname: string | null;
} {
  if (!name) {
    return {
      firstname: null,
      lastname: null,
    };
  }

  const normalized = name.trim();

  if (!normalized) {
    return {
      firstname: null,
      lastname: null,
    };
  }

  const [firstname, ...rest] = normalized.split(/\s+/);

  return {
    firstname: firstname || null,
    lastname: rest.length > 0 ? rest.join(" ") : null,
  };
}

function toProfile(user: {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Profile {
  const { firstname, lastname } = splitName(user.name);

  return {
    id: user.id,
    user_id: user.id,
    email: user.email,
    firstname,
    lastname,

    // The legacy profiles table no longer exists in the canonical
    // Prisma schema. Consent data must not be fabricated from another
    // unrelated model.
    consent_given: false,
    consent_date: null,

    created_at: user.createdAt.toISOString(),
    updated_at: user.updatedAt.toISOString(),
  };
}

/**
 * Compatibility repository for the legacy Profile contract.
 *
 * Canonical identity data now lives in Prisma User.
 * CareerProfile contains career-analysis data and is NOT a replacement
 * for the old profiles table.
 */
export class ProfileRepository {
  async findById(id: string): Promise<Profile | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user ? toProfile(user) : null;
  }

  async find(
    criteria: Partial<Profile>,
  ): Promise<Profile[]> {
    const where: Prisma.UserWhereInput = {};

    if (criteria.id !== undefined) {
      where.id = criteria.id;
    }

    if (criteria.user_id !== undefined) {
      where.id = criteria.user_id;
    }

    if (criteria.email !== undefined) {
      where.email = criteria.email;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map(toProfile);
  }

  async findOne(
    criteria: Partial<Profile>,
  ): Promise<Profile | null> {
    const profiles = await this.find(criteria);

    return profiles[0] ?? null;
  }

  async getByUserId(userId: string): Promise<Profile | null> {
    return this.findById(userId);
  }

  async create(
    entity: Omit<Profile, "id">,
  ): Promise<Profile> {
    const name = [entity.firstname, entity.lastname]
      .filter((value): value is string => Boolean(value?.trim()))
      .join(" ")
      .trim();

    const user = await prisma.user.create({
      data: {
        id: entity.user_id,
        email: entity.email,
        name: name || null,
        referralCode: crypto.randomUUID(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return toProfile(user);
  }

  async update(
    id: string,
    updates: Partial<Profile>,
  ): Promise<Profile> {
    const current = await prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
      },
    });

    if (!current) {
      throw new Error(`User not found: ${id}`);
    }

    const currentName = splitName(current.name);

    const firstname =
      updates.firstname !== undefined
        ? updates.firstname
        : currentName.firstname;

    const lastname =
      updates.lastname !== undefined
        ? updates.lastname
        : currentName.lastname;

    const name = [firstname, lastname]
      .filter((value): value is string => Boolean(value?.trim()))
      .join(" ")
      .trim();

    const data: Prisma.UserUpdateInput = {};

    if (
      updates.firstname !== undefined ||
      updates.lastname !== undefined
    ) {
      data.name = name || null;
    }

    if (updates.email !== undefined) {
      data.email = updates.email;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return toProfile(user);
  }

  /**
   * Deletes profile-specific application data only.
   *
   * IMPORTANT:
   * The User record is deliberately NOT deleted here because the
   * AccountService still needs the user identity until Supabase Auth
   * deletion has completed.
   */
  async delete(id: string): Promise<boolean> {
    await prisma.careerProfile.deleteMany({
      where: {
        userId: id,
      },
    });

    return true;
  }

  async count(
    criteria: Partial<Profile> = {},
  ): Promise<number> {
    const where: Prisma.UserWhereInput = {};

    if (criteria.id !== undefined) {
      where.id = criteria.id;
    }

    if (criteria.user_id !== undefined) {
      where.id = criteria.user_id;
    }

    if (criteria.email !== undefined) {
      where.email = criteria.email;
    }

    return prisma.user.count({
      where,
    });
  }
}
