"use client";

import { AuthLayout } from "@/components/ui/AuthLayout";
import { AuthCard } from "@/components/ui";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      headerText="Pas encore de compte ?"
      headerLinkText="Créer un compte"
      headerLinkHref="/register"
    >
      <AuthCard title="Bon retour parmi nous 👋" subtitle="Connectez-vous pour retrouver votre clarté.">
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
