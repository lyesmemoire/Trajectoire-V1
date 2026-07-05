"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import fpPromise from "@fingerprintjs/fingerprintjs";
import { Button, Input, Card, CardContent } from "@/components/design-system";
import { AuthLayout } from "@/components/layouts/foundation";

/* ─── Icons ─────────────────────────────────────────────── */

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

/* ─── Password Input Component ──────────────────────────── */

function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[13px] font-semibold text-[var(--text-primary)]"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 pr-11 text-sm text-gray-900 placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors"
          aria-label={
            visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

/* ─── Main Form ─────────────────────────────────────────── */

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pack = searchParams.get("pack");
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [company, setCompany] = useState(""); // HONEYPOT

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError("Veuillez accepter les termes et conditions.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      // ✅ 1. Get Device Fingerprint
      const fp = await fpPromise.load();
      const result = await fp.get();
      const fingerprint = result.visitorId;

      // ✅ 2. Send to backend
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          fullName: fullName.trim(),
          acceptMarketing,
          fingerprint,
          company,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = { error: "Réponse serveur invalide" };
      }

      if (!res.ok) {
        setError(
          data.error || "Erreur lors de la création du compte. Réessayez.",
        );
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("FRONTEND REGISTER ERROR:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur réseau est survenue. Réessayez.",
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handleOAuth = async (provider: "google" | "apple" | "facebook") => {
    setLoading(true);
    setError(null);
    // Note: Apple and Facebook require additional Supabase config
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider:
        provider === "facebook"
          ? "facebook"
          : provider === "apple"
            ? "apple"
            : "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${pack ? `?pack=${pack}` : ""}${redirectTo ? (pack ? `&redirect=${redirectTo}` : `?redirect=${redirectTo}`) : ""}`,
      },
    });

    if (authError) {
      setError(`Erreur d'authentification ${provider}. Réessayez.`);
      setLoading(false);
    }
  };

  /* ── Success state ── */
  if (success) {
    return (
      <AuthLayout title="Inscription" subtitle="Vérifiez votre email">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="p-8 text-center space-y-5">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-3xl">
                📧
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Vérifiez votre email
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Un email de confirmation a été envoyé à{" "}
                <strong className="text-gray-900">{email}</strong>.
                <br />
                Nous sommes avec vous. Cliquez sur le lien lorsque vous êtes prêt.
              </p>
              <Link
                href={`/auth/login${redirectTo ? `?redirect=${redirectTo}` : ""}`}
                className="inline-block text-blue-700 font-semibold text-sm hover:underline"
              >
                ← Retour à la connexion
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </AuthLayout>
    );
  }

  /* ── Main form ── */
  return (
    <AuthLayout title="Inscription" subtitle="Créez votre compte Trajectoire">
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
              <Link
                href={`/auth/login${redirectTo ? `?redirect=${redirectTo}` : ""}`}
                className="flex-1 text-center py-2.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Se connecter
              </Link>
              <div className="flex-1 text-center py-2.5 rounded-full text-sm font-semibold text-blue-700 bg-white shadow-sm cursor-default">
                S&apos;inscrire
              </div>
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

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5"
              >
                <span className="text-red-600 text-sm leading-none mt-0.5">
                  ⚠
                </span>
                <p className="text-gray-900 text-sm flex-1 leading-relaxed">
                  {error}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 text-sm font-bold leading-none shrink-0"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              {/* HONEYPOT (Anti-Bot) */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ display: "none" }}
                autoComplete="off"
                tabIndex={-1}
              />

              {/* Nom complet */}
              <div className="space-y-2">
                <label
                  htmlFor="signup-fullname"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <Input
                  id="signup-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Nom complet"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Adresse email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Adresse email"
                />
              </div>

              {/* Password */}
              <PasswordInput
                id="signup-password"
                label="Mot de passe"
                value={password}
                onChange={setPassword}
                placeholder="Mot de passe"
                autoComplete="new-password"
              />

              {/* Confirm Password */}
              <PasswordInput
                id="signup-confirm-password"
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirmer le mot de passe"
                autoComplete="new-password"
              />

              {/* Checkboxes */}
              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    J&apos;accepte les{" "}
                    <Link
                      href="/terms"
                      className="text-blue-700 underline hover:text-blue-600"
                    >
                      termes et conditions
                    </Link>{" "}
                    ainsi que la{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-700 underline hover:text-blue-600"
                    >
                      politique de confidentialité
                    </Link>{" "}
                    du site.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptMarketing}
                    onChange={(e) => setAcceptMarketing(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    J&apos;accepte de recevoir des e-mails marketing.
                  </span>
                </label>
              </div>

              {/* CTA Button */}
              <Button
                type="submit"
                disabled={
                  loading || !fullName || !email || !password || !confirmPassword
                }
                className="w-full"
              >
                {loading ? "Création en cours..." : "Créer un compte"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}

/* ─── Page Export ────────────────────────────────────────── */

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Inscription" subtitle="Chargement...">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </AuthLayout>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
