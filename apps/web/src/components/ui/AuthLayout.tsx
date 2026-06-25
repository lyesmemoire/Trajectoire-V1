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
    <div className="min-h-screen flex flex-col bg-surface-muted relative overflow-hidden">
      {/* Background décoratif */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(26,60,52,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 40% 30% at 100% 100%, rgba(232,80,26,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="relative px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label={`${SITE_NAME} — Retour à l'accueil`}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white bg-brand-primary text-[17px] transition-transform duration-300 group-hover:scale-105">
            T
          </div>
          <span className="font-bold text-lg tracking-tight text-ink">
            {SITE_NAME}
          </span>
        </Link>
        <p className="text-sm text-ink-muted">
          {headerText}{" "}
          <Link
            href={headerLinkHref}
            className="font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
          >
            {headerLinkText}
          </Link>
        </p>
      </header>

      {/* Main */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-8 lg:py-12">
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
            className="text-center text-xs mt-6 leading-relaxed text-ink-muted"
          >
            Vos données sont protégées et conformes RGPD.{" "}
            <Link href="/privacy" className="text-ink-muted hover:text-ink underline underline-offset-4">
              Politique de confidentialité
            </Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
