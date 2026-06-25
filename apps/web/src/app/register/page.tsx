"use client";

import { AuthLayout } from "@/components/ui/AuthLayout";
import { AuthCard } from "@/components/ui";
import RegisterWizard from "@/components/auth/RegisterWizard";

export default function RegisterPage() {
  return (
    <AuthLayout
      headerText="Déjà un compte ?"
      headerLinkText="Se connecter"
      headerLinkHref="/login"
    >
      <AuthCard title="Créez votre compte" subtitle="Rejoignez des milliers de professionnels comme vous.">
        <RegisterWizard />
      </AuthCard>
    </AuthLayout>
  );
}
