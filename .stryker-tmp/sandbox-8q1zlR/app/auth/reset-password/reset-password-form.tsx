// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input, Card } from "@/components/design-system";
import { motion } from "framer-motion";
import { AuthArenaLayout } from "@/components/auth/AuthArenaLayout";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError("Erreur lors de la mise à jour du mot de passe. Le lien a peut-être expiré.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  if (success) {
    return (
      <AuthArenaLayout
        quote="Un nouveau mot de passe, un nouveau départ."
        author="Trajectoire"
        image="/images/login-executive.jpg"
      >
        <div className="w-full max-w-[480px]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-10 lg:p-12 shadow-sm border border-gray-200/60 bg-white/80 backdrop-blur-sm text-center space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl"
              >
                ✓
              </motion.div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                  Mot de passe modifié
                </h2>
                <p className="text-gray-600 text-[15px]">
                  Votre mot de passe a été réinitialisé. Redirection vers la connexion...
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </AuthArenaLayout>
    );
  }

  return (
    <AuthArenaLayout
      quote="Un nouveau mot de passe pour sécuriser votre parcours."
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
              Nouveau mot de passe
            </h1>
            <p className="text-gray-600 mb-10 leading-relaxed text-[15px]">
              Définissez votre nouveau mot de passe sécurisé.
            </p>

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                >
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 transition-all duration-200 text-[15px] pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                >
                  Confirmer
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 transition-all duration-200 text-[15px]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg py-3.5 text-base font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mise à jour...</span>
                  </div>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200"
              >
                ← Retour à la connexion
              </Link>
            </div>

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
