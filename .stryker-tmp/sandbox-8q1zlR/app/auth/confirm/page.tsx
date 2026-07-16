// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Suspense } from "react";
import { Button, Card } from "@/components/design-system";
import { motion } from "framer-motion";
import { AuthArenaLayout } from "@/components/auth/AuthArenaLayout";

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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </motion.div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              Vérification
            </h2>
            <p className="text-gray-600 text-[15px]">
              Confirmation de votre adresse email en cours...
            </p>
          </div>
        </div>
      )}

      {state === "success" && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-sm"
          >
            ✨
          </motion.div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              Email confirmé !
            </h2>
            <p className="text-gray-600 text-[15px] mb-8">
              Votre compte est activé. Vos 2 crédits gratuits vous attendent.
            </p>
            <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 rounded-lg py-3.5 text-base font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0">
              <Link href="/dashboard">
                Accéder à mon espace →
              </Link>
            </Button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl shadow-sm"
          >
            ❌
          </motion.div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              Erreur
            </h2>
            <p className="text-gray-600 text-[15px] mb-4">{errorMessage}</p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 rounded-lg py-3.5 text-base font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0">
                <Link href="/auth/login">
                  Se connecter →
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border border-gray-200 hover:bg-gray-50 rounded-lg py-3.5 text-base font-medium transition-all duration-200">
                <Link href="/auth/signup">
                  Créer un compte
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
    <AuthArenaLayout
      quote="Votre compte est activé et prêt à vous accompagner."
      author="Trajectoire"
      image="/images/login-executive.jpg"
    >
      <div className="w-full max-w-[480px]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-10 lg:p-12 shadow-sm border border-gray-200/60 bg-white/80 backdrop-blur-sm text-center">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  </div>
                </div>
              }
            >
              <ConfirmEmailContent />
            </Suspense>
          </Card>
        </motion.div>
      </div>
    </AuthArenaLayout>
  );
}
