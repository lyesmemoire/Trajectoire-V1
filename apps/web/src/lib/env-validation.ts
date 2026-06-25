import { z } from "zod";
import { createLogger } from "./logger";

const logger = createLogger({ component: "env-validation" });

/**
 * Schema de validation des variables d'environnement
 * 
 * Variables requises :
 * - DATABASE_URL : URL de connexion à la base de données
 * - REDIS_URL : URL de connexion Redis
 * - OPENAI_API_KEY : Clé API OpenAI
 * - MURF_API_KEY : Clé API Murf (optionnelle)
 * 
 * Variables Supabase :
 * - NEXT_PUBLIC_SUPABASE_URL : URL publique Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY : Clé anonyme Supabase
 * - SUPABASE_SERVICE_ROLE_KEY : Clé service role Supabase
 * 
 * Variables Sentry :
 * - NEXT_PUBLIC_SENTRY_DSN : DSN Sentry (optionnelle)
 */

const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  
  // Redis
  REDIS_URL: z.string().url("REDIS_URL must be a valid URL"),
  
  // OpenAI
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  
  // Murf (optionnel)
  MURF_API_KEY: z.string().optional(),
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  
  // Sentry (optionnel)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof EnvSchema>;

let validatedEnv: Env | null = null;

/**
 * Valide toutes les variables d'environnement au démarrage
 * Lance une erreur si une variable requise est manquante ou invalide
 */
export function validateEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    const env = EnvSchema.parse(process.env);
    validatedEnv = env;
    
    logger.info("Environment variables validated successfully");
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      
      logger.error({ missingVars }, "Environment variables validation failed");
      
      throw new Error(
        `Environment variables validation failed:\n${missingVars
          .map((v) => `  - ${v.path}: ${v.message}`)
          .join("\n")}\n\nPlease check your .env file.`
      );
    }
    
    throw error;
  }
}

/**
 * Retourne les variables d'environnement validées
 * Doit être appelé après validateEnv()
 */
export function getEnv(): Env {
  if (!validatedEnv) {
    throw new Error("Environment not validated. Call validateEnv() first.");
  }
  
  return validatedEnv;
}

/**
 * Vérifie si une variable d'environnement est définie
 * Utile pour les vérifications conditionnelles
 */
export function hasEnvVar(name: keyof Env): boolean {
  return typeof process.env[name] !== "undefined" && process.env[name] !== "";
}

/**
 * Retourne une variable d'environnement avec une valeur par défaut
 * Ne lance pas d'erreur si la variable est manquante
 */
export function getEnvVarWithDefault<T extends keyof Env>(
  name: T,
  defaultValue: string
): string {
  const value = process.env[name];
  return value || defaultValue;
}
