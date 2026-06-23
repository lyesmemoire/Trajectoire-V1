"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SITE_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div
      className="min-h-screen grain-overlay flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="text-xl font-bold transition-opacity hover:opacity-75"
          style={{ color: "var(--text)" }}
          aria-label={`${SITE_NAME} — Retour à l'accueil`}
        >
          {SITE_NAME}
        </Link>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold underline underline-offset-4 transition-colors"
            style={{ color: "var(--primary)" }}
          >
            S&apos;inscrire
          </Link>
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl border p-8 lg:p-10"
            style={{
              borderColor: "var(--border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            }}
          >
            {/* Heading */}
            <div className="mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="4" stroke="var(--primary)" strokeWidth="1.5" />
                  <path
                    d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
                    stroke="var(--primary)" strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                Bon retour.
              </h1>
              <p className="text-base" style={{ color: "var(--muted)" }}>
                Connectez-vous pour accéder à votre tableau de bord.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text)" }}
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,60,52,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-required="true"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Mot de passe
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs transition-colors hover:underline underline-offset-4"
                    style={{ color: "var(--primary)" }}
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-base outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,60,52,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                    style={{ color: "var(--muted)" }}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 3l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: "rgba(232,80,26,0.08)",
                    border: "1px solid rgba(232,80,26,0.2)",
                  }}
                  role="alert"
                  aria-live="polite"
                >
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="flex-shrink-0 mt-0.5" aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6" stroke="var(--accent)" strokeWidth="1.5" />
                    <path d="M8 5v3M8 10.5v.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm" style={{ color: "var(--accent)" }}>{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor:
                    loading || !email || !password
                      ? "rgba(26,60,52,0.4)"
                      : "var(--primary)",
                  color: "white",
                  cursor: loading || !email || !password ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading && email && password) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--primary-hover)";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(26,60,52,0.25)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    loading || !email || !password ? "rgba(26,60,52,0.4)" : "var(--primary)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className="animate-spin" aria-hidden="true"
                    >
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Connexion en cours…
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6" aria-hidden="true">
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>ou</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
            </div>

            {/* SSO placeholder */}
            <button
              type="button"
              className="w-full py-3 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center justify-center gap-3"
              style={{
                borderColor: "var(--border)",
                color: "var(--text)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(26,60,52,0.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
              aria-label="Continuer avec Google"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M17.1 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.6c-.2 1-.8 1.9-1.7 2.4v2h2.7c1.6-1.5 2.5-3.7 2.5-6z" fill="#4285F4" />
                <path d="M9 18c2.4 0 4.4-.8 5.9-2.1l-2.7-2.1c-.8.5-1.9.9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H.9v2.1C2.4 16.2 5.5 18 9 18z" fill="#34A853" />
                <path d="M3.7 10.8A5.4 5.4 0 0 1 3.7 7.2V5.1H.9A9 9 0 0 0 .9 12.9l2.8-2.1z" fill="#FBBC05" />
                <path d="M9 3.6c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9 9 0 0 0 .9 5.1l2.8 2.1C4.4 5.3 6.5 3.6 9 3.6z" fill="#EA4335" />
              </svg>
              Continuer avec Google
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.p
            variants={fadeInUp}
            className="text-center text-xs mt-6 leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Vos données sont protégées et conformes RGPD.{" "}
            <Link href="/privacy" className="underline underline-offset-4" style={{ color: "var(--muted)" }}>
              Politique de confidentialité
            </Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
