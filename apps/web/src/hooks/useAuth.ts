"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "./useSupabase";
import type { ObjectiveType, PlanType } from "@/types/database";
import { identifyUser } from "@/lib/analytics/identifyUser";

interface SignUpPayload {
  email:     string;
  password:  string;
  firstName: string;
  lastName:  string;
  role:      string;
  objective: ObjectiveType;
  plan:      PlanType;
}

interface UseAuthReturn {
  loading: boolean;
  error:   string | null;
  signIn:  (email: string, password: string) => Promise<void>;
  signUp:  (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const supabase = useSupabase();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      identifyUser({
        id: user.id,
        email: user.email,
      });
    }

    router.push("/dashboard");
    router.refresh();
  };

  const signUp = async (payload: SignUpPayload) => {
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email:    payload.email,
      password: payload.password,
      options: {
        data: {
          first_name: payload.firstName,
          last_name:  payload.lastName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      /* Mise à jour du profil avec les données étape 1 & 2 */
      await (supabase as any)
        .from("profiles")
        .update({
          role:      payload.role,
          objective: payload.objective,
          plan:      payload.plan,
        })
        .eq("id", data.user.id);

      identifyUser({
        id: data.user.id,
        email: payload.email,
        role: payload.role,
        objective: payload.objective,
        plan: payload.plan,
      });
    }

    router.push("/dashboard");
    router.refresh();
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return { loading, error, signIn, signUp, signOut };
}
