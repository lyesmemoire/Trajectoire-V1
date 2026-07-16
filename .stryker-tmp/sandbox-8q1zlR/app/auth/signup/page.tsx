// @ts-nocheck
"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import fpPromise from "@fingerprintjs/fingerprintjs";
import {
  Button,
  Input,
  Card,
} from "@/components/design-system";
import Image from "next/image";

/* ─── Icons ─────────────────────────────────────────────── */

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

/* ─── Password Strength Helper ──────────────────────────── */

function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          fullName: `${firstName.trim()} ${lastName.trim()}`,
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

  const handleOAuth = async (provider: "google" | "microsoft") => {
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
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
      <div className="min-h-screen flex" style={{ backgroundColor: "#F8F6F3" }}>
        <div className="hidden lg:flex lg:w-[45%]" />
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[480px]"
          >
            <Card className="p-10 lg:p-12 shadow-lg border border-gray-200/50">
              <div className="text-center space-y-5">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-3xl">
                  📧
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900">
                  Vérifiez votre email
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Un email de confirmation a été envoyé{" "}
                  <strong className="text-gray-900">{email}</strong>.
                  <br />
                  Nous sommes avec vous. Cliquez sur le lien lorsque vous êtes prêt.
                </p>
                <Link
                  href={`/auth/login${redirectTo ? `?redirect=${redirectTo}` : ""}`}
                  className="inline-block text-blue-900 font-semibold text-sm hover:text-blue-700 transition-colors"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
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
            src="/images/signup-executive.jpg"
            alt="Cadre dirigeant préparant sa stratégie d'entretien"
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
            « La préparation est la clé de toute réussite. Chaque entretien est une opportunité de démontrer votre valeur. »
          </p>
          <p className="text-sm font-medium opacity-75 tracking-wide">— Philosophie Trajectoire</p>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative">
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
                Créez votre compte
              </h1>
              <p className="text-gray-600 mb-10 leading-relaxed text-[15px]">
                Commencez votre préparation avec 2 crédits gratuits.
              </p>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuth("google")}
                  disabled={loading}
                  className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg py-3 transition-all duration-200 hover:shadow-sm"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuth("microsoft")}
                  disabled={loading}
                  className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg py-3 transition-all duration-200 hover:shadow-sm"
                >
                  <MicrosoftIcon />
                  <span>Microsoft</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500 font-medium">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Error */}
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

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-6">
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

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                    >
                      Prénom
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                      placeholder="Marie"
                      className="bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 transition-all duration-200 text-[15px]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                    >
                      Nom
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                      placeholder="Laurent"
                      className="bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 transition-all duration-200 text-[15px]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                  >
                    E-mail
                  </label>
                  <Input
                    id="email"
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
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
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
                  {/* Password Strength Indicator */}
                  <div className="flex gap-1 mt-2.5">
                    {[1, 2, 3, 4].map((i) => {
                      const strength = calculatePasswordStrength(password);
                      const isActive = i <= strength;
                      const colorClass = strength <= 1 ? "bg-red-500" : strength <= 2 ? "bg-yellow-500" : "bg-green-500";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: isActive ? 1 : 0.3 }}
                          transition={{ duration: 0.2 }}
                          className={`flex-1 h-0.75 rounded-full transition-colors ${
                            isActive ? colorClass : "bg-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold mb-2.5 tracking-wide text-gray-700"
                  >
                    Confirmer
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="bg-white border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 transition-all duration-200 text-[15px] pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      aria-label={
                        showConfirmPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-600 group">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="hidden peer"
                  />
                  <div className="w-4.5 h-4.5 border-2 border-gray-300 rounded flex items-center justify-center bg-white transition-all duration-200 peer-checked:bg-gray-900 peer-checked:border-gray-900 group-hover:border-gray-400 shrink-0 mt-0.5">
                    {acceptTerms && (
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
                  <span>
                    J'accepte les{" "}
                    <Link href="/terms" className="text-gray-900 hover:underline transition-colors duration-200">
                      Conditions Générales
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-gray-900 hover:underline transition-colors duration-200">
                      Politique de confidentialité
                    </Link>.
                  </span>
                </label>

                {/* Marketing Checkbox (Optional - preserved from current) */}
                <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-600 group">
                  <input
                    type="checkbox"
                    checked={acceptMarketing}
                    onChange={(e) => setAcceptMarketing(e.target.checked)}
                    className="hidden peer"
                  />
                  <div className="w-4.5 h-4.5 border-2 border-gray-300 rounded flex items-center justify-center bg-white transition-all duration-200 peer-checked:bg-gray-900 peer-checked:border-gray-900 group-hover:border-gray-400 shrink-0 mt-0.5">
                    {acceptMarketing && (
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
                  <span className="group-hover:text-gray-900 transition-colors duration-200">Recevoir des conseils par email</span>
                </label>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !firstName ||
                    !lastName ||
                    !email ||
                    !password ||
                    !confirmPassword
                  }
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg py-3.5 text-base font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Création...</span>
                    </div>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <p className="text-center mt-6 text-sm text-gray-600">
                Déjà inscrit ?{" "}
                <Link
                  href={`/auth/login${redirectTo ? `?redirect=${redirectTo}` : ""}`}
                  className="text-gray-900 hover:text-gray-700 font-semibold transition-colors duration-200"
                >
                  Se connecter
                </Link>
              </p>

              {/* Reassurance */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield size={16} className="text-green-600" />
                    <span>Vos données restent confidentielles.</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Lock size={16} className="text-green-600" />
                    <span>Aucun engagement.</span>
                  </div>
                </div>
              </div>
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

export default function SignupPage() {
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
      <SignupForm />
    </Suspense>
  );
}
