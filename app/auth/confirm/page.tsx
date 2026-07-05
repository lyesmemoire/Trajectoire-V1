"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Suspense } from "react";
import { Button, Card, CardContent } from "@/components/design-system";
import { AuthLayout } from "@/components/layouts/foundation";

type ConfirmState = "verifying" | "success" | "error";

function ConfirmEmailContent() {
  const [state, setState] = useState<ConfirmState>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error === "pkce_failed") {
      setErrorMessage(
        "La vérification automatique a échoué. Veuillez vous reconnecter avec vos identifiants.",
      );
      setState("error");
      return;
    }

    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          .then(({ error: sessionError }: { error: any }) => {
            if (sessionError) {
              console.error("[Confirm] Session set failed:", sessionError.message);
              setErrorMessage("Erreur lors de la validation de votre session.");
              setState("error");
            } else {
              setState("success");
            }
          });
        return;
      }
    }

    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (tokenHash && type) {
      supabase.auth
        .verifyOtp({
          token_hash: tokenHash,
          type: type as "signup" | "email" | "recovery" | "invite",
        })
        .then(({ error: verifyError }: { error: any }) => {
          if (verifyError) {
            console.error("[Confirm] OTP verification failed:", verifyError.message);
            setErrorMessage("Le lien de confirmation est expiré ou invalide.");
            setState("error");
          } else {
            setState("success");
          }
        });
      return;
    }

    if (!error) {
      const timer = setTimeout(() => {
        setState("success");
      }, 2000);
      return () => clearTimeout(timer);
    }

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
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Vérification en cours
            </h2>
            <p className="text-gray-600 text-sm">
              Veuillez patienter pendant que nous confirmons votre adresse email...
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email confirmé !
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Votre compte est maintenant activé. Vos 2 crédits gratuits vous attendent sur votre tableau de bord.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Accéder à mon espace →
              </Link>
            </Button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl shadow-sm">
            ❌
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Erreur de confirmation
            </h2>
            <p className="text-gray-600 text-sm mb-4">{errorMessage}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Se connecter →
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signup">
                  Créer un nouveau compte
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ConfirmEmailPage() {
  return (
    <AuthLayout title="Confirmation" subtitle="Vérification de votre email">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8 text-center">
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
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
