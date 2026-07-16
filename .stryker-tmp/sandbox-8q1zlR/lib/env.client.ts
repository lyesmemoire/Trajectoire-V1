// @ts-nocheck
import { z } from "zod";

const EnvClientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL doit être une URL valide"),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY manquante"),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL doit être une URL valide"),

  NEXT_PUBLIC_POSTHOG_KEY: z
    .string()
    .startsWith("phc_")
    .or(z.literal(""))
    .optional(),

  NEXT_PUBLIC_POSTHOG_HOST: z
    .string()
    .url()
    .optional()
    .default("https://eu.posthog.com"),

  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith("pk_")
    .optional(),

  NEXT_PUBLIC_GATEWAY_URL: z
    .string()
    .url()
    .optional(),

  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .optional(),

  NEXT_PUBLIC_VOICE_WS_URL: z
    .string()
    .url()
    .optional(),

  NEXT_PUBLIC_VOICE_DEBUG: z
    .string()
    .optional()
    .transform((v) => v === "true"),

  NEXT_PUBLIC_SENTRY_DSN: z
    .string()
    .url()
    .optional(),

  NEXT_PUBLIC_SENTRY_ENV: z
    .string()
    .optional(),
});

function validateClientEnv() {
  const result = EnvClientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL:           process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL:                process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY:            process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST:           process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GATEWAY_URL:            process.env.NEXT_PUBLIC_GATEWAY_URL,
    NEXT_PUBLIC_API_URL:                process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_VOICE_WS_URL:           process.env.NEXT_PUBLIC_VOICE_WS_URL,
    NEXT_PUBLIC_VOICE_DEBUG:            process.env.NEXT_PUBLIC_VOICE_DEBUG,
    NEXT_PUBLIC_SENTRY_DSN:             process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_ENV:             process.env.NEXT_PUBLIC_SENTRY_ENV,
  });

  if (!result.success && process.env.NODE_ENV === "development") {
    console.error(
      "❌ Variables client invalides :",
      result.error.errors.map((e) => `${e.path.join(".")} : ${e.message}`)
    );
  }

  return result.data ?? ({} as z.infer<typeof EnvClientSchema>);
}

export const envClient = validateClientEnv();
export type EnvClient = z.infer<typeof EnvClientSchema>;
