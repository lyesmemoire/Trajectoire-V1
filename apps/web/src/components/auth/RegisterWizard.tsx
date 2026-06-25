"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { FormField, Input, PasswordInput, Button } from "@/components/ui";

export default function RegisterWizard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent(ANALYTICS_EVENTS.REGISTER_COMPLETED);
    await signUp({
      email,
      password,
      firstName: "Utilisateur",
      lastName: "",
      role: "cadre",
      objective: "promotion",
      plan: "free",
    });
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 caractères"
          className="py-3.5"
        />
      </FormField>

      <div className="flex items-start gap-2">
        <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-border text-brand-primary focus:ring-brand-primary" required />
        <span className="text-sm text-ink-muted leading-relaxed">
          J'accepte les{" "}
          <a href="/terms" className="text-brand-primary hover:text-brand-primary-hover underline">
            conditions d'utilisation
          </a>{" "}
          et la{" "}
          <a href="/privacy" className="text-brand-primary hover:text-brand-primary-hover underline">
            politique de confidentialité
          </a>
        </span>
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
        Créer mon compte gratuitement
      </Button>
    </form>
  );
}
