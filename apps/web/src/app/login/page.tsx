"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { AuthLayout, AuthCard, FormField, Input, PasswordInput, Button } from "@/components/ui";

export default function LoginPage() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const { loading, error, signIn } = useAuth();

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.LOGIN_STARTED);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent(ANALYTICS_EVENTS.LOGIN_COMPLETED);
    await signIn(email, password);
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Bon retour."
        subtitle="Connectez-vous pour accéder à votre tableau de bord."
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        }
      >
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <FormField label="Adresse email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
            />
          </FormField>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Mot de passe
              </label>
              <Link
                href="/forgot-password"
                className="text-xs transition-colors hover:underline underline-offset-4 text-brand-primary"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/20"
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
              <p className="text-sm text-accent">{error}</p>
            </motion.div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={!email || !password}
            className="py-4"
          >
            Se connecter
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6" aria-hidden="true">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-medium text-ink-muted">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* SSO placeholder */}
        <button
          type="button"
          className="w-full py-3 rounded-xl text-sm font-medium border border-border text-ink bg-transparent transition-all duration-200 flex items-center justify-center gap-3 hover:border-brand-primary hover:bg-brand-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
      </AuthCard>
    </AuthLayout>
  );
}
