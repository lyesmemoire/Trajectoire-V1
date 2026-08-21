import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Service Layer: CV Domain
 *
 * Prisma CVAnalysis is the canonical persistence model.
 *
 * The former Supabase `cvs` table is not present in the current
 * production schema and its legacy accessors had no active callers.
 */
export const CvService = {
  async findFirstCVAnalysis(args: Prisma.CVAnalysisFindFirstArgs) {
    return prisma.cVAnalysis.findFirst(args);
  },

  async findManyCVAnalysis(args: Prisma.CVAnalysisFindManyArgs) {
    return prisma.cVAnalysis.findMany(args);
  },

  async findUniqueCVAnalysis(args: Prisma.CVAnalysisFindUniqueArgs) {
    return prisma.cVAnalysis.findUnique(args);
  },

  async createCVAnalysis(args: Prisma.CVAnalysisCreateArgs) {
    return prisma.cVAnalysis.create(args);
  },

  async updateCVAnalysis(args: Prisma.CVAnalysisUpdateArgs) {
    return prisma.cVAnalysis.update(args);
  },

  async deleteCVAnalysis(args: Prisma.CVAnalysisDeleteArgs) {
    return prisma.cVAnalysis.delete(args);
  },

  async countCVAnalysis(args?: Prisma.CVAnalysisCountArgs) {
    return prisma.cVAnalysis.count(args);
  },
};