// @ts-nocheck
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import {
  Button,
  Input,
  Card,
} from "@/components/design-system";
import Image from "next/image";

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

function MicrosoftIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
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
  const [rememberMe, setRememberMe] = useState(true);
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

  const handleOAuth = async (provider: "google" | "microsoft") => {
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
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F6F3" }}>
      {/* Left Panel - Image with Quote */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-end">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="absolute inset-0"
        >
          <Image
            src="/images/login-executive.jpg"
            alt="Manager travaillant dans un bureau premium"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/55 to-transparent z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-20 p-12 text-white"
        >
          <p className="font-serif text-2xl leading-relaxed mb-5 max-w-md opacity-95">
            « Reprenez votre préparation là où vous l'avez laissée. Chaque session vous rapproche de votre objectif. »
          </p>
          <p className="text-sm font-medium opacity-75 tracking-wide">— Trajectoire</p>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[440px]">
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
                Bon retour.
              </h1>
              <p className="text-gray-600 mb-10 leading-relaxed text-[15px]">
                Connectez-vous pour continuer votre préparation.
              </p>

              {/* Resend Success */}
              {resendSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6 p-4 bg-green-50/80 border border-green-200/60 rounded-lg flex items-start gap-3"
                >
                  <span className="text-green-600 text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <p className="text-gray-900 text-sm font-medium flex-1 leading-relaxed">
                    Email envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception.
                  </p>
                  <button
                    onClick={() => setResendSuccess(false)}
                    className="text-green-400 hover:text-green-600 text-sm font-bold leading-none shrink-0 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6 p-4 bg-red-50/80 border border-red-200/60 rounded-lg flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
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
                      className="text-red-400 hover:text-red-600 text-sm font-bold leading-none shrink-0 transition-colors duration-200"
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
                      className="w-full text-red-700 border-red-200 hover:bg-red-50 transition-all duration-200"
                    >
                      {resendLoading ? "Envoi..." : "Renvoyer l'email"}
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleEmailLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                  >
                    E-mail
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="marie@entreprise.fr"
                    className="bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 transition-all duration-200 text-[15px]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
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

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-600 group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="hidden peer"
                    />
                    <div className="w-4.5 h-4.5 border-2 border-gray-300 rounded flex items-center justify-center bg-white transition-all duration-200 peer-checked:bg-gray-900 peer-checked:border-gray-900 group-hover:border-gray-400">
                      {rememberMe && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-2.5 h-2.5 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Se souvenir</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg py-3.5 text-base font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500 font-medium">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuth("google")}
                  disabled={loading}
                  className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg py-3"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuth("microsoft")}
                  disabled={loading}
                  className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg py-3"
                >
                  <MicrosoftIcon />
                  <span>Microsoft</span>
                </Button>
              </div>

              {/* Signup Link */}
              <p className="text-center mt-5 text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link
                  href={`/auth/signup${redirectTo ? `?redirect=${redirectTo}` : ""}`}
                  className="text-blue-900 hover:text-blue-700 font-semibold transition-colors"
                >
                  Créer mon espace
                </Link>
              </p>
            </Card>
          </motion.div>

          {/* Footer */}
          <div className="flex justify-center gap-6 mt-8">
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
        </div>
      </div>
    </div>
  );
}

/* ─── Page Export ────────────────────────────────────────── */

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex" style={{ backgroundColor: "#F8F6F3" }}>
          <div className="hidden lg:flex lg:w-[45%]" />
          <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
