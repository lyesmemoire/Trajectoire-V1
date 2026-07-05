import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  image: z.string().url().optional(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  referralCode: z.string().optional(),
  referredBy: z.string().optional(),
});
