import { UsersRepository } from "@/lib/db/users.repo";

export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async getProfile(userId: string) {
    return this.repo.findById(userId);
  }

  async getByEmail(email: string) {
    return this.repo.findByEmail(email);
  }

  async getUserDashboard(userId: string) {
    const profile = await this.getProfile(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    return {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      referralCode: (profile  as any).referral_code,
      stats: {
        cvCount: 0, // placeholder futur join
      },
    };
  }

  async updateUserProfile(userId: string, name: string) {
    return this.repo.update(userId, {
      full_name: name,
    }  as any); // Cast temporaire en attendant le STEP 0 (types Supabase)
  }
}
