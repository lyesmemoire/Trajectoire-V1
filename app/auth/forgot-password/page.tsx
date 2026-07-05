"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button, Input, Card, CardContent } from "@/components/design-system";
import { AuthLayout } from "@/components/layouts/foundation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    );

    if (resetError) {
      setError("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
      setIsLoading(false);
      return;
    }

    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Réinitialisez votre mot de passe"
    >
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-8">
            {!isSubmitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Adresse email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full"
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Vérifiez vos emails
                  </h3>
                  <p className="text-gray-600">
                    Si un compte existe pour{" "}
                    <span className="font-bold text-gray-900">{email}</span>, nous
                    vous avons envoyé un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>
                <Link
                  href="/auth/login"
                  className="text-sm font-bold text-blue-700 hover:text-blue-600"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
