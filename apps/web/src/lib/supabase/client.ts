import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[Trajectoire] Variable d'environnement manquante : ${name}\n` +
      `Créez le fichier .env.local à la racine du projet avec :\n` +
      `${name}=votre_valeur`
    );
  }
  return value;
}

export function createClient() {
  return createBrowserClient<Database>(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}