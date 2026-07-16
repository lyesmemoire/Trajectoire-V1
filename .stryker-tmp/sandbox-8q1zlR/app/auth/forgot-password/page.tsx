// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button, Input, Card } from "@/components/design-system";
import { motion } from "framer-motion";
import { AuthArenaLayout } from "@/components/auth/AuthArenaLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    );

    if (resetError) {
      setError("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
      setIsLoading(false);
      return;
    }

    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <AuthArenaLayout
      quote="Un mot de passe oublié n'est qu'une pause dans votre parcours."
      author="Trajectoire"
      image="/images/login-executive.jpg"
    >
      <div className="w-full max-w-[480px]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-10 lg:p-12 shadow-sm border border-gray-200/60 bg-white/80 backdrop-blur-sm">
            {/* Logo */}
            <Link href="/" className="inline-block mb-8 group">
              <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight group-hover:opacity-80 transition-opacity duration-200">
                Trajectoire
                <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full ml-0.5 align-super" />
              </span>
            </Link>

            {/* Headline */}
            <h1 className="font-serif text-3xl font-semibold mb-3 tracking-tight text-gray-900">
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-600 mb-10 leading-relaxed text-[15px]">
              Entrez votre e-mail pour recevoir un lien de réinitialisation.
            </p>

            {!isSubmitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-6 p-4 bg-red-50/80 border border-red-200/60 rounded-xl flex items-start gap-3"
                  >
                    <span className="text-red-600 text-sm leading-none mt-0.5">
                      ⚠
                    </span>
                    <p className="text-gray-900 text-sm flex-1 leading-relaxed">
                      {error}
                    </p>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600 text-sm font-bold leading-none shrink-0 transition-colors duration-200"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                  >
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@entreprise.fr"
                    className="bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 transition-all duration-200 text-[15px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg py-3.5 text-base font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi...</span>
                    </div>
                  ) : (
                    "Envoyer le lien"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
                >
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                    Email envoyé
                  </h3>
                  <p className="text-gray-600 text-[15px]">
                    Si un compte existe pour{" "}
                    <span className="font-semibold text-gray-900">{email}</span>, vous
                    recevrez un lien de réinitialisation.
                  </p>
                </div>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            )}

            {/* Login Link */}
            <p className="text-center mt-6 text-sm text-gray-600">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link
                href="/auth/login"
                className="text-gray-900 hover:text-gray-700 font-semibold transition-colors duration-200"
              >
                Se connecter
              </Link>
            </p>

            {/* Footer */}
            <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-gray-200">
              <Link href="/legal" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Mentions légales
              </Link>
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                CGU
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </AuthArenaLayout>
  );
}
