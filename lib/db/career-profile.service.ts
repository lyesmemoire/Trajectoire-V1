import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Service Layer: CareerProfile Domain
 * 
 * Proxy Transparent pattern to centralize all CareerProfile data access.
 */
export const CareerProfileService = {
  /**
   * =======================
   * PRISMA ACCESS
   * =======================
   */
  async findUnique(args: Prisma.CareerProfileFindUniqueArgs) {
    return prisma.careerProfile.findUnique(args);
  },

  async findMany(args: Prisma.CareerProfileFindManyArgs) {
    return prisma.careerProfile.findMany(args);
  },

  async create(args: Prisma.CareerProfileCreateArgs) {
    return prisma.careerProfile.create(args);
  },

  async update(args: Prisma.CareerProfileUpdateArgs) {
    return prisma.careerProfile.update(args);
  },

  async count(args?: Prisma.CareerProfileCountArgs) {
    return prisma.careerProfile.count(args);
  },
};
