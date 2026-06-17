"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

import { Suspense } from "react";

type ConfirmState = "verifying" | "success" | "error";

function ConfirmEmailContent() {
  const [state, setState] = useState<ConfirmState>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");

    // Si on arrive ici avec une erreur PKCE, tenter la vérification côté client
    if (error === "pkce_failed") {
      setErrorMessage(
        "La vérification automatique a échoué. Veuillez vous reconnecter avec vos identifiants.",
      );
      setState("error");
      return;
    }

    // Vérifier si l'URL contient un hash avec des tokens (flux implicite Supabase)
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const supabase = createClient();
        supabase.auth
          .setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          .then(({ error: sessionError }) => {
            if (sessionError) {
              console.error(
                "[Confirm] Session set failed:",
                sessionError.message,
              );
              setErrorMessage("Erreur lors de la validation de votre session.");
              setState("error");
            } else {
              setState("success");
            }
          });
        return;
      }
    }

    // Vérification par token_hash dans les query params
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (tokenHash && type) {
      const supabase = createClient();
      supabase.auth
        .verifyOtp({
          token_hash: tokenHash,
          type: type as "signup" | "email" | "recovery" | "invite",
        })
        .then(({ error: verifyError }) => {
          if (verifyError) {
            console.error(
              "[Confirm] OTP verification failed:",
              verifyError.message,
            );
            setErrorMessage("Le lien de confirmation est expiré ou invalide.");
            setState("error");
          } else {
            setState("success");
          }
        });
      return;
    }

    // Pas de token ni d'erreur = on vient juste d'arriver sur la page après inscription
    if (!error) {
      const timer = setTimeout(() => {
        setState("success");
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Erreur générique
    setErrorMessage("Une erreur est survenue lors de la confirmation.");
    setState("error");
  }, [searchParams]);

  return (
    <>
      {state === "verifying" && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Vérification en cours
            </h2>
            <p className="text-slate-500 text-sm">
              Veuillez patienter pendant que nous confirmons votre adresse
              email...
            </p>
          </div>
        </div>
      )}

      {state === "success" && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-sm">
            ✨
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Email confirmé !
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              Votre compte est maintenant activé. Vos 2 crédits gratuits vous
              attendent sur votre tableau de bord.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex w-full justify-center items-center rounded-xl bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all"
            >
              Accéder à mon espace →
            </Link>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl shadow-sm">
            ❌
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Erreur de confirmation
            </h2>
            <p className="text-slate-500 text-sm mb-4">{errorMessage}</p>
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="inline-flex w-full justify-center items-center rounded-xl bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all"
              >
                Se connecter →
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex w-full justify-center items-center rounded-xl bg-white py-3 px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all"
              >
                Créer un nouveau compte
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_50%)]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100 text-center">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              </div>
            }
          >
            <ConfirmEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
