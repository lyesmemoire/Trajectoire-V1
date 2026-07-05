"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Input, Card, CardContent } from "@/components/design-system";
import { AuthLayout } from "@/components/layouts/foundation";

/* ─── Icons ─────────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path
        d="M16.67 15.13l.55-3.58h-3.44v-2.32c0-.98.48-1.94 2.02-1.94h1.57V4.17s-1.42-.24-2.79-.24c-2.84 0-4.7 1.72-4.7 4.84v2.73H7v3.58h2.89v8.64c.58.09 1.17.14 1.78.14s1.2-.05 1.78-.14v-8.64h2.22z"
        fill="#fff"
      />
    </svg>
  );
}

/* ─── Main Login Form ───────────────────────────────────── */

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("redirect");
  const allowedRedirects = [
    "/dashboard",
    "/interview-lab",
    "/truth-tunnel",
    "/premium",
    "/settings",
    "/onboarding",
  ];
  const redirectTo = allowedRedirects.includes(searchParam || "")
    ? searchParam!
    : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.replace(redirectTo);
    };
    checkSession();
  }, [router, redirectTo]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("Email ou mot de passe incorrect.");
        setShowResend(false);
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Veuillez confirmer votre email avant de vous connecter.");
        setShowResend(true);
      } else {
        setError("Erreur de connexion. Veuillez réessayer.");
        setShowResend(false);
      }
      setLoading(false);
      return;
    }

    // Attendre l'hydratation de la session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (!session || sessionError) {
      setError("Erreur d'initialisation de session. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  };

  const handleOAuth = async (provider: "google" | "apple" | "facebook") => {
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
      },
    });

    if (authError) {
      setError(`Erreur d'authentification ${provider}. Réessayez.`);
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Veuillez entrer votre adresse email ci-dessus.");
      return;
    }
    setResendLoading(true);
    setResendSuccess(false);

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (resendError) {
      setError(`Impossible de renvoyer l'email : ${resendError.message}`);
    } else {
      setResendSuccess(true);
      setError(null);
    }
    setResendLoading(false);
  };

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Connectez-vous à votre compte Trajectoire"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardContent className="p-8">
            {/* Tab Switcher */}
            <div className="bg-gray-100 rounded-full p-1 flex mb-7">
              <div className="flex-1 text-center py-2.5 rounded-full text-sm font-semibold text-blue-700 bg-white shadow-sm cursor-default">
                Se connecter
              </div>
              <Link
                href={`/auth/signup${redirectTo ? `?redirect=${redirectTo}` : ""}`}
                className="flex-1 text-center py-2.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                S&apos;inscrire
              </Link>
            </div>

            {/* Social Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuth("apple")}
                disabled={loading}
                className="w-full"
              >
                <AppleIcon />
                Continuer avec Apple
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuth("facebook")}
                disabled={loading}
                className="w-full"
              >
                <FacebookIcon />
                Continuer avec Facebook
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuth("google")}
                disabled={loading}
                className="w-full"
              >
                <GoogleIcon />
                Continuer avec Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-600 font-medium">
                  Ou
                </span>
              </div>
            </div>

            {/* Resend Success */}
            {resendSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-5 p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2.5"
              >
                <span className="text-green-600 text-sm leading-none mt-0.5">
                  ✓
                </span>
                <p className="text-gray-900 text-xs font-medium flex-1 leading-relaxed">
                  Un nouvel email de confirmation a été envoyé à{" "}
                  <strong>{email}</strong>. Vérifiez votre boîte de réception et
                  vos spams.
                </p>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-2.5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-red-600 text-sm leading-none mt-0.5">
                    ⚠
                  </span>
                  <p className="text-gray-900 text-sm flex-1 leading-relaxed">
                    {error}
                  </p>
                  <button
                    onClick={() => {
                      setError(null);
                      setShowResend(false);
                    }}
                    className="text-red-400 hover:text-red-600 text-sm font-bold leading-none shrink-0"
                  >
                    ✕
                  </button>
                </div>
                {showResend && (
                  <Button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendLoading}
                    variant="outline"
                    className="w-full text-red-700 border-red-200 hover:bg-red-100"
                  >
                    {resendLoading ? "Envoi en cours..." : "📧 Renvoyer l'email de confirmation"}
                  </Button>
                )}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Adresse email <span className="text-gray-500">*</span>
                </label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Adresse email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-gray-900"
                  >
                    Mot de passe <span className="text-gray-500">*</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-blue-700 hover:text-blue-600 font-medium"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Mot de passe"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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

              {/* CTA Button */}
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}

/* ─── Page Export ────────────────────────────────────────── */

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Connexion" subtitle="Chargement...">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </AuthLayout>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
