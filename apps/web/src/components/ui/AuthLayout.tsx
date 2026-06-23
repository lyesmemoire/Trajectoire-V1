import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SITE_NAME } from "@/lib/constants";

export interface AuthLayoutProps {
  children: ReactNode;
  headerText?: ReactNode;
  headerLinkText?: string;
  headerLinkHref?: string;
}

export function AuthLayout({
  children,
  headerText = "Pas encore de compte ?",
  headerLinkText = "S'inscrire",
  headerLinkHref = "/register",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grain-overlay flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="text-xl font-bold text-ink transition-opacity hover:opacity-75"
          aria-label={`${SITE_NAME} — Retour à l'accueil`}
        >
          {SITE_NAME}
        </Link>
        <p className="text-sm text-ink-muted">
          {headerText}{" "}
          <Link
            href={headerLinkHref}
            className="font-semibold text-brand-primary underline underline-offset-4 transition-colors"
          >
            {headerLinkText}
          </Link>
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-6 py-8 lg:py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg flex flex-col gap-2"
        >
          {children}

          {/* Trust strip */}
          <motion.p
            variants={fadeInUp}
            className="text-center text-xs mt-4 leading-relaxed text-ink-muted"
          >
            Vos données sont protégées et conformes RGPD.{" "}
            <Link href="/privacy" className="underline underline-offset-4 text-ink-muted hover:text-ink">
              Politique de confidentialité
            </Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
