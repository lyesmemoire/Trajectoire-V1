import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // Toujours requises
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  
  // Conditionnelles selon NODE_ENV
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  MURF_API_KEY: z.string().min(20).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  
  // Redis (optionnel car fallback gracieux déjà en place)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  
  // OpenAI / LLM (requis même en dev pour les tests)
  OPENAI_API_KEY: z.string().min(20).optional(), // Optional if mistral is used
  OPENAI_MODEL: z.string().optional(),
  MISTRAL_API_KEY: z.string().optional(),
  MISTRAL_MODEL: z.string().optional(),
  
  // Logger
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // Autres variables de dev optionnelles / diverses (à étoffer)
  DEEPGRAM_API_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  SLACK_ALERT_WEBHOOK_URL: z.string().url().optional(),
  ALERT_EMAIL_TO: z.string().email().optional(),
  RENDER_INSTANCE_ID: z.string().optional(),
  PORT: z.string().optional(),
  HOST: z.string().optional()
}).refine(
  (data) => data.NODE_ENV === "development" || data.NODE_ENV === "test" || data.SENTRY_DSN !== undefined,
  {
    message: "SENTRY_DSN is required in production",
    path: ["SENTRY_DSN"],
  }
);

// Cette variable lancera une erreur Zod au démarrage si des variables sont manquantes
export const envServer = serverSchema.parse(process.env);
