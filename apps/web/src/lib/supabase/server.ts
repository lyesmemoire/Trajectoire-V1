import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      throw new Error(
        `[Trajectoire] Variable d'environnement manquante : ${name}\n` +
        `Cette variable est requise en production.`
      );
    }
    
    // En développement : log un warning et retourne un placeholder
    console.warn(
      `[Trajectoire] Variable d'environnement manquante : ${name}\n` +
      `Fonctionnalité limitée. Ajoutez cette variable dans .env.local pour activer toutes les features.`
    );
    
    // Placeholder pour permettre l'initialisation du client en dev
    if (name === "NEXT_PUBLIC_SUPABASE_URL") return "https://placeholder.supabase.co";
    if (name === "NEXT_PUBLIC_SUPABASE_ANON_KEY") return "placeholder-key-for-development";
    return "";
  }
  return value;
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll appelé depuis un Server Component — ignoré
          }
        },
      },
    }
  );
}