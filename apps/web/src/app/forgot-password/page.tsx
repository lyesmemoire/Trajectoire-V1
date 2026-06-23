"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SITE_NAME } from "@/lib/constants";
import { useSupabase } from "@/hooks/useSupabase";

type ForgotStep = "email" | "sent" | "reset" | "done";

/* ─────────────────────────────────────────────────────────
   Input helpers
───────────────────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  backgroundColor: "var(--background)",
  border:          "1px solid var(--border)",
  color:           "var(--text)",
};

function onFocusInput(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "var(--primary)";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(26,60,52,0.1)";
}
function onBlurInput(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "var(--border)";
  e.currentTarget.style.boxShadow   = "none";
}

/* ─────────────────────────────────────────────────────────
   Step: Email
───────────────────────────────────────────────────────── */
function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const supabase = useSupabase();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    const { error: sbError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password?step=reset`,
    });

    setLoading(false);

    if (sbError) {
      setError("Une erreur est survenue. Vérifiez l'adresse email et réessayez.");
      return;
    }

    onSent(email);
  };

  return (
    <motion.div
      key="email-step"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="5" width="16" height="11" rx="2" stroke="var(--primary)" strokeWidth="1.5" />
            <path d="M2 8l8 5 8-5" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
          Mot de passe oublié ?
        </h1>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </motion.div>

      <motion.form
        variants={fadeInUp}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text)" }}
          >
            Adresse email
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
            style={inputBase}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            aria-required="true"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{
              backgroundColor: "rgba(232,80,26,0.08)",
              border:          "1px solid rgba(232,80,26,0.2)",
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

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            backgroundColor:
              loading || !email ? "rgba(26,60,52,0.35)" : "var(--primary)",
            color:  "white",
            cursor: loading || !email ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!loading && email) {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = "var(--primary-hover)";
              el.style.transform       = "translateY(-1px)";
              el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor =
              !loading && email ? "var(--primary)" : "rgba(26,60,52,0.35)";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "none";
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
              Envoi en cours…
            </>
          ) : (
            "Envoyer le lien de réinitialisation"
          )}
        </button>
      </motion.form>

      <motion.div variants={fadeInUp} className="text-center">
        <Link
          href="/login"
          className="text-sm underline underline-offset-4 transition-colors"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
        >
          ← Retour à la connexion
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Step: Sent
───────────────────────────────────────────────────────── */
function SentStep({
  email,
  onResend,
}: {
  email:    string;
  onResend: () => void;
}) {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    onResend();
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <motion.div
      key="sent-step"
      variants={staggerContainer}
      initial={{ opacity: 0, x: 20 }}
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 text-center"
    >
      <motion.div variants={fadeInUp}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(26,127,75,0.12)" }}
          aria-hidden="true"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M4 12l4 4 12-12"
              stroke="var(--success)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Email envoyé.
        </h2>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          Un lien de réinitialisation a été envoyé à{" "}
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            {email}
          </span>
          . Vérifiez vos spams si vous ne le recevez pas.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="space-y-3 text-left">
        <div
          className="p-5 rounded-xl space-y-3"
          style={{
            backgroundColor: "rgba(26,60,52,0.04)",
            border:          "1px solid rgba(26,60,52,0.1)",
          }}
        >
          {[
            "Ouvrez l'email de Trajectoire dans votre boîte mail.",
            "Cliquez sur le lien « Réinitialiser mon mot de passe ».",
            "Le lien est valide pendant 60 minutes.",
            "Choisissez un nouveau mot de passe d'au moins 8 caractères.",
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: "rgba(26,60,52,0.1)",
                  color:           "var(--primary)",
                }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={resent}
          className="w-full py-3 rounded-xl text-sm font-medium border transition-all duration-200"
          style={{
            borderColor:     "var(--border)",
            color:           resent ? "var(--success)" : "var(--text)",
            backgroundColor: "white",
          }}
          onMouseEnter={(e) => {
            if (!resent)
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border)";
          }}
        >
          {resent ? "✓ Email renvoyé" : "Renvoyer l'email"}
        </button>

        <Link
          href="/login"
          className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "var(--primary-hover)";
            el.style.transform       = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "var(--primary)";
            el.style.transform       = "translateY(0)";
          }}
        >
          Retour à la connexion
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Step: Reset
───────────────────────────────────────────────────────── */
function ResetStep({ onDone }: { onDone: () => void }) {
  const supabase = useSupabase();

  const [newPwd,     setNewPwd]     = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const passwordsMatch = newPwd === confirmPwd;
  const valid          = newPwd.length >= 8 && passwordsMatch;

  const checks = [
    newPwd.length >= 8,
    /[A-Z]/.test(newPwd),
    /[0-9]/.test(newPwd),
    /[^A-Za-z0-9]/.test(newPwd),
  ];
  const strength      = checks.filter(Boolean).length;
  const strengthLabel = ["", "Faible", "Moyen", "Fort", "Excellent"];
  const strengthColor = [
    "",
    "var(--accent)",
    "var(--warning)",
    "var(--success)",
    "var(--primary)",
  ];

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError(null);

    const { error: sbError } = await supabase.auth.updateUser({
      password: newPwd,
    });

    setLoading(false);

    if (sbError) {
      setError(
        "Le lien a peut-être expiré. Recommencez la procédure depuis la page de connexion."
      );
      return;
    }

    onDone();
  };

  return (
    <motion.div
      key="reset-step"
      variants={staggerContainer}
      initial={{ opacity: 0, x: 20 }}
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect
              x="4" y="9" width="12" height="9" rx="2"
              stroke="var(--primary)" strokeWidth="1.5"
            />
            <path
              d="M7 9V6a3 3 0 0 1 6 0v3"
              stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round"
            />
            <circle cx="10" cy="13.5" r="1" fill="var(--primary)" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
          Nouveau mot de passe
        </h1>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          Choisissez un mot de passe sécurisé d&apos;au moins 8 caractères.
        </p>
      </motion.div>

      <motion.form
        variants={fadeInUp}
        onSubmit={handleReset}
        noValidate
        className="space-y-4"
      >
        {/* New password */}
        <div>
          <label
            htmlFor="reset-new-pwd"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text)" }}
          >
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              id="reset-new-pwd"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              required
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="Minimum 8 caractères"
              className="w-full px-4 py-3 pr-12 rounded-xl text-base outline-none transition-all duration-200"
              style={inputBase}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
              style={{ color: "var(--muted)" }}
              aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPwd ? (
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

          {newPwd && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        i <= strength ? strengthColor[strength] : "var(--border)",
                    }}
                  />
                ))}
              </div>
              {strength > 0 && (
                <p
                  className="text-xs"
                  style={{
                    color: strength >= 3 ? "var(--success)" : "var(--muted)",
                  }}
                >
                  Sécurité : {strengthLabel[strength]}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="reset-confirm-pwd"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text)" }}
          >
            Confirmer le mot de passe
          </label>
          <input
            id="reset-confirm-pwd"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="Répétez votre mot de passe"
            className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
            style={{
              ...inputBase,
              borderColor:
                confirmPwd && !passwordsMatch
                  ? "var(--accent)"
                  : "var(--border)",
            }}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            aria-describedby={
              confirmPwd && !passwordsMatch
                ? "reset-pwd-mismatch"
                : undefined
            }
          />
          {confirmPwd && !passwordsMatch && (
            <p
              id="reset-pwd-mismatch"
              className="text-xs mt-1.5"
              style={{ color: "var(--accent)" }}
              role="alert"
            >
              Les mots de passe ne correspondent pas.
            </p>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{
              backgroundColor: "rgba(232,80,26,0.08)",
              border:          "1px solid rgba(232,80,26,0.2)",
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

        <button
          type="submit"
          disabled={!valid || loading}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            backgroundColor:
              valid && !loading ? "var(--primary)" : "rgba(26,60,52,0.35)",
            color:  "white",
            cursor: valid && !loading ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (valid && !loading) {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = "var(--primary-hover)";
              el.style.transform       = "translateY(-1px)";
              el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor =
              valid && !loading ? "var(--primary)" : "rgba(26,60,52,0.35)";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "none";
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
              Mise à jour…
            </>
          ) : (
            "Mettre à jour le mot de passe"
          )}
        </button>
      </motion.form>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Step: Done
───────────────────────────────────────────────────────── */
function DoneStep() {
  return (
    <motion.div
      key="done-step"
      variants={staggerContainer}
      initial={{ opacity: 0, x: 20 }}
      animate="visible"
      className="space-y-6 text-center"
    >
      <motion.div variants={fadeInUp}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(26,127,75,0.12)" }}
          aria-hidden="true"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M4 14l6 6 14-14"
              stroke="var(--success)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Mot de passe mis à jour.
        </h2>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          Votre mot de passe a été modifié avec succès. Vous pouvez maintenant
          vous connecter.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "var(--primary-hover)";
            el.style.transform       = "translateY(-1px)";
            el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "var(--primary)";
            el.style.transform       = "translateY(0)";
            el.style.boxShadow       = "none";
          }}
        >
          Se connecter
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function ForgotPasswordPage() {
  const [step,  setStep]  = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");

  /* Detect ?step=reset in URL after clicking the email link */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("step") === "reset") {
      setStep("reset");
    }
  }, []);

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
        <Link
          href="/login"
          className="text-sm font-medium underline underline-offset-4 transition-colors"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
        >
          Se connecter
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div
            className="bg-white rounded-2xl border p-8 lg:p-10"
            style={{
              borderColor: "var(--border)",
              boxShadow:   "0 8px 32px rgba(0,0,0,0.06)",
            }}
          >
            <AnimatePresence mode="wait">
              {step === "email" && (
                <EmailStep
                  key="email"
                  onSent={(sentEmail) => {
                    setEmail(sentEmail);
                    setStep("sent");
                  }}
                />
              )}
              {step === "sent" && (
                <SentStep
                  key="sent"
                  email={email}
                  onResend={() => setStep("email")}
                />
              )}
              {step === "reset" && (
                <ResetStep
                  key="reset"
                  onDone={() => setStep("done")}
                />
              )}
              {step === "done" && <DoneStep key="done" />}
            </AnimatePresence>
          </div>

          <p
            className="text-center text-xs mt-6"
            style={{ color: "var(--muted)" }}
          >
            Lien valide 60 minutes · Données sécurisées · Conformité RGPD
          </p>
        </div>
      </main>
    </div>
  );
}
