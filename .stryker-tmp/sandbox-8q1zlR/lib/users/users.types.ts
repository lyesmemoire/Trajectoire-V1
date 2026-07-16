// @ts-nocheck
export type UserRole = 'USER' | 'ADMIN'; // Should match Prisma Plan/Role types
export type UserPlan = 'FREE' | 'PRO' | 'PREMIUM';

export interface UpdateUserProfileInput {
  name?: string;
  image?: string;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  referralCode?: string;
  referredBy?: string;
}
