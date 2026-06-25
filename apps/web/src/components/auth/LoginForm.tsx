"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { FormField, Input, PasswordInput, Button } from "@/components/ui";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent(ANALYTICS_EVENTS.LOGIN_COMPLETED);
    await signIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormField label="Adresse email" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="py-3.5"
        />
      </FormField>

      <FormField label="Mot de passe" htmlFor="password">
        <PasswordInput
          id="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="py-3.5"
        />
      </FormField>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary" />
          <span className="text-sm text-ink-muted">Se souvenir de moi</span>
        </label>
        <Link href="/forgot-password" className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors">
          Mot de passe oublié ?
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/20" role="alert">
          <p className="text-sm text-warning">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={!email || !password}
        size="lg"
      >
        Se connecter
      </Button>
    </form>
  );
}
