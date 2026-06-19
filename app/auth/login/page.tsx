"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

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
      const supabase = createClient();
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

    const supabase = createClient();

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

    const supabase = createClient();

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

    const supabase = createClient();
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
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[460px]"
      >
        {/* ── Logo ── */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-[var(--primary)] text-[26px]">✦</span>
            <span className="text-[23px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
              <span className="text-[23px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">Trajectoire</span>
            </span>
          </Link>
        </div>

        {/* ── Card ── */}
        <div className="card px-9 py-9">
          {/* ── Tab Switcher ── */}
          <div className="bg-gray-100 rounded-full p-1 flex mb-7">
            <div className="flex-1 text-center py-2.5 rounded-full text-sm font-semibold text-[var(--primary)] bg-white shadow-sm cursor-default">
              Se connecter
            </div>
            <Link
              href="/auth/signup"
              className="flex-1 text-center py-2.5 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-gray-700 transition-colors"
            >
              S&apos;inscrire
            </Link>
          </div>

          {/* ── Social Buttons ── */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[var(--border)] text-gray-700 font-medium py-[13px] px-5 rounded-xl hover:bg-gray-50 active:scale-[0.99] transition-all disabled:opacity-50 text-sm"
            >
              <AppleIcon />
              Continuer avec Apple
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("facebook")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[var(--border)] text-gray-700 font-medium py-[13px] px-5 rounded-xl hover:bg-gray-50 active:scale-[0.99] transition-all disabled:opacity-50 text-sm"
            >
              <FacebookIcon />
              Continuer avec Facebook
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[var(--border)] text-gray-700 font-medium py-[13px] px-5 rounded-xl hover:bg-gray-50 active:scale-[0.99] transition-all disabled:opacity-50 text-sm"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>
          </div>

          {/* ── Divider ── */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-[var(--text-secondary)] font-medium">
                Ou
              </span>
            </div>
          </div>

          {/* ── Resend Success ── */}
          {resendSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl flex items-start gap-2.5"
            >
              <span className="text-[var(--primary)] text-sm leading-none mt-0.5">
                ✓
              </span>
              <p className="text-[var(--text-primary)] text-xs font-medium flex-1 leading-relaxed">
                Un nouvel email de confirmation a été envoyé à{" "}
                <strong>{email}</strong>. Vérifiez votre boîte de réception et
                vos spams.
              </p>
            </motion.div>
          )}

          {/* ── Error ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl flex flex-col gap-2.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-[var(--text-secondary)] text-sm leading-none mt-0.5">
                  ⚠
                </span>
                <p className="text-[var(--text-primary)] text-sm flex-1 leading-relaxed">
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
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  className="w-full text-center py-2 px-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  {resendLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full transition-all" />
                      Envoi en cours...
                    </span>
                  ) : (
                    "📧 Renvoyer l'email de confirmation"
                  )}
                </button>
              )}
            </motion.div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="block text-[13px] font-semibold text-[var(--text-primary)]"
              >
                Adresse email <span className="text-[var(--text-secondary)]">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Adresse email"
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-[13px] font-semibold text-[var(--text-primary)]"
                >
                  Mot de passe <span className="text-[var(--text-secondary)]">*</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[var(--primary)] hover:text-blue-700 font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Mot de passe"
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 pr-11 text-sm text-gray-900 placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors"
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

            {/* ── CTA Button ── */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-2 bg-[var(--primary)] hover:bg-[#5C6BE8] disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-full transition-all active:scale-[0.98] text-sm shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-[var(--primary)] rounded-full transition-all" />
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Page Export ────────────────────────────────────────── */

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full transition-all" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
