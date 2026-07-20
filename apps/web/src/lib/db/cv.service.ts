import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerDb } from "@/lib/db/client";

/**
 * Service Layer: CV Domain
 * Proxy Transparent pattern to centralize all CV data access.
 */
export const CvService = {
  /**
   * =======================
   * PRISMA ACCESS (CVAnalysis)
   * =======================
   */
  async findFirstCVAnalysis(args: Prisma.CVAnalysisFindFirstArgs) {
    return prisma.cVAnalysis.findFirst(args);
  },

  async findManyCVAnalysis(args: Prisma.CVAnalysisFindManyArgs) {
    return prisma.cVAnalysis.findMany(args);
  },

  /**
   * =======================
   * SUPABASE ACCESS (cvs)
   * =======================
   */
  async getCvsByUserId(userId: string, select = "*", supabaseClient?: any) {
    const supabase = supabaseClient || await getServerDb();
    return supabase
      .from("cvs")
      .select(select)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  async getCvById(cvId: string, select = "*", supabaseClient?: any) {
    const supabase = supabaseClient || await getServerDb();
    return supabase.from("cvs").select(select).eq("id", cvId).single();
  },

  async insertCv(data: any, supabaseClient?: any) {
    const supabase = supabaseClient || await getServerDb();
    return supabase.from("cvs").insert(data).select();
  },

  async updateCv(cvId: string, data: any, supabaseClient?: any) {
    const supabase = supabaseClient || await getServerDb();
    return supabase.from("cvs").update(data).eq("id", cvId).select();
  },
};
