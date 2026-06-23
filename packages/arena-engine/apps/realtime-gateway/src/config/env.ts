import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string().default("3000"),
  DEEPGRAM_API_KEY: z.string(),
  TURN_URL: z.string().optional(),
  TURN_USERNAME: z.string().optional(),
  TURN_PASSWORD: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
