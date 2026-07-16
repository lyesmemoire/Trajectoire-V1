// @ts-nocheck
export interface UserEntity {
  id: string;
  email: string;
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileEntity {
  userId: string;
  fullName: string | null;
  credits: number;
  cvEditorCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanType = "FREE" | "PREMIUM" | "ENTERPRISE";
