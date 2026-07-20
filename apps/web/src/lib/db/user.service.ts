import { prisma } from "@/lib/prisma";
import { getServerDb } from "@/lib/db/client";


import { Prisma } from "@prisma/client";

export const UserService = {
  /**
   * =======================
   * PRISMA ACCESS (user)
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
   * SUPABASE ACCESS (profiles)
   * =======================
   */
  
  // Generic profile fetch
  async getProfile(userId: string, select = "*", supabaseClient?: any) {
    const supabase = supabaseClient || await getServerDb();
    return supabase.from("profiles").select(select).eq("id", userId).single();
  },

  // Generic profile update
  async updateProfile(userId: string, data: any, supabaseClient?: any) {
    const supabase = supabaseClient || await getServerDb();
    return supabase.from("profiles").update(data).eq("id", userId);
  },

  // Insert profile (for register)
  async insertProfile(data: any, supabaseClient?: any) {
    const supabase = supabaseClient || await getServerDb();
    return supabase.from("profiles").insert(data);
  },

  // Get profile by email
  async getProfileByEmail(email: string, select = "*", supabaseClient?: any) {
    const supabase = supabaseClient || await getServerDb();
    return supabase.from("profiles").select(select).eq("email", email).single();
  }
};
