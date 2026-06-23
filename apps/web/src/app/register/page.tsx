"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SITE_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import type { ObjectiveType, PlanType } from "@/types/database";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

/* ── Types ── */
type Step = 1 | 2 | 3;

interface FormData {
  firstName:   string;
  lastName:    string;
  email:       string;
  password:    string;
  role:        string;
  objective:   string;
  plan:        PlanType;
  acceptTerms: boolean;
}

const ROLES = [
  "Cadre supérieur",
  "Directeur / Directrice",
  "Manager",
  "Chef de projet",
  "Consultant(e)",
  "Professionnel(le) en transition",
  "Autre",
];

const OBJECTIVES: { id: ObjectiveType; label: string; icon: string }[] = [
  { id: "promotion",  label: "Préparer une promotion",          icon: "🎯" },
  { id: "interview",  label: "Réussir un entretien interne",    icon: "💼" },
  { id: "transition", label: "Accompagner une transition",      icon: "🔄" },
  { id: "direction",  label: "Prendre un poste de direction",   icon: "🚀" },
  { id: "clarity",    label: "Gagner en clarté sur ma carrière",icon: "🔍" },
  { id: "other",      label: "Autre objectif",                  icon: "✨" },
];

const STEP_LABELS = ["Votre profil", "Votre objectif", "Votre plan"];

/* ── Password strength ── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score  = checks.filter(Boolean).length;
  const labels = ["", "Faible", "Moyen", "Fort", "Excellent"];
  const colors = ["", "var(--accent)", "var(--warning)", "var(--success)", "var(--primary)"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= score ? colors[score] : "var(--border)" }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: score >= 3 ? "var(--success)" : "var(--muted)" }}>
        {score > 0 ? `Sécurité : ${labels[score]}` : ""}
      </p>
    </div>
  );
}

/* ── Step indicator ── */
function StepIndicator({ current, total }: { current: Step; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Étape ${current} sur ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const step = (i + 1) as Step;
        const done   = step < current;
        const active = step === current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
              style={{
                backgroundColor: done ? "var(--success)" : active ? "var(--primary)" : "var(--border)",
                color: done || active ? "white" : "var(--muted)",
              }}
              aria-current={active ? "step" : undefined}
            >
              {done ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : step}
            </div>
            {i < total - 1 && (
              <div
                className="w-8 h-px transition-all duration-300"
                style={{ backgroundColor: done ? "var(--success)" : "var(--border)" }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Input helpers ── */
const inputBase: React.CSSProperties = {
  backgroundColor: "var(--background)",
  border:          "1px solid var(--border)",
  color:           "var(--text)",
};

function onFocusStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--primary)";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(26,60,52,0.1)";
}
function onBlurStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--border)";
  e.currentTarget.style.boxShadow   = "none";
}

/* ── Step 1 ── */
function StepOne({
  data, onChange, onNext,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string | boolean) => void;
  onNext: () => void;
}) {
  const valid = !!(data.firstName && data.lastName && data.email && data.password.length >= 8);

  return (
    <motion.div
      key="step1"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
          Créez votre compte
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Quelques informations pour commencer.
        </p>
      </motion.div>

      {/* Prénom + Nom */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
            Prénom
          </label>
          <input
            id="firstName" type="text" autoComplete="given-name" required
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Sophie"
            className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
            style={inputBase} onFocus={onFocusStyle} onBlur={onBlurStyle}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
            Nom
          </label>
          <input
            id="lastName" type="text" autoComplete="family-name" required
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Martin"
            className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
            style={inputBase} onFocus={onFocusStyle} onBlur={onBlurStyle}
          />
        </div>
      </motion.div>

      {/* Email */}
      <motion.div variants={fadeInUp}>
        <label htmlFor="reg-email" className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
          Adresse email professionnelle
        </label>
        <input
          id="reg-email" type="email" autoComplete="email" required
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="vous@entreprise.com"
          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
          style={inputBase} onFocus={onFocusStyle} onBlur={onBlurStyle}
        />
      </motion.div>

      {/* Role */}
      <motion.div variants={fadeInUp}>
        <label htmlFor="role" className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
          Votre fonction
        </label>
        <div className="relative">
          <select
            id="role"
            value={data.role}
            onChange={(e) => onChange("role", e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200 appearance-none"
            style={{ ...inputBase, color: data.role ? "var(--text)" : "var(--muted)" }}
            onFocus={onFocusStyle as React.FocusEventHandler<HTMLSelectElement>}
            onBlur={onBlurStyle   as React.FocusEventHandler<HTMLSelectElement>}
          >
            <option value="" disabled>Sélectionnez votre fonction</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Password */}
      <motion.div variants={fadeInUp}>
        <label htmlFor="reg-password" className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
          Mot de passe
        </label>
        <input
          id="reg-password" type="password" autoComplete="new-password" required
          value={data.password}
          onChange={(e) => onChange("password", e.target.value)}
          placeholder="Minimum 8 caractères"
          className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
          style={inputBase} onFocus={onFocusStyle} onBlur={onBlurStyle}
        />
        <PasswordStrength password={data.password} />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <button
          type="button" onClick={onNext} disabled={!valid}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200"
          style={{
            backgroundColor: valid ? "var(--primary)" : "rgba(26,60,52,0.35)",
            color: "white",
            cursor: valid ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => { if (valid) { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = "var(--primary-hover)"; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 8px 24px rgba(26,60,52,0.25)"; } }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = valid ? "var(--primary)" : "rgba(26,60,52,0.35)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
        >
          Continuer
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Step 2 ── */
function StepTwo({
  data, onChange, onNext, onBack,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="step2"
      variants={staggerContainer}
      initial={{ opacity: 0, x: 20 }}
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
          Quel est votre objectif ?
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Nous personnaliserons votre expérience en fonction.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-3">
        {OBJECTIVES.map((obj) => {
          const selected = data.objective === obj.id;
          return (
            <button
              key={obj.id} type="button"
              onClick={() => onChange("objective", obj.id)}
              className="flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200"
              style={{
                borderColor:     selected ? "var(--primary)" : "var(--border)",
                backgroundColor: selected ? "rgba(26,60,52,0.06)" : "var(--background)",
                boxShadow:       selected ? "0 0 0 2px rgba(26,60,52,0.15)" : "none",
              }}
              aria-pressed={selected}
            >
              <span className="text-xl flex-shrink-0" aria-hidden="true">{obj.icon}</span>
              <span className="text-sm font-medium" style={{ color: selected ? "var(--primary)" : "var(--text)" }}>
                {obj.label}
              </span>
              {selected && (
                <div className="ml-auto flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" fill="var(--primary)" />
                    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </motion.div>

      <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
        <button
          type="button" onClick={onBack}
          className="flex-1 py-4 rounded-xl font-semibold text-base border transition-all duration-200"
          style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "transparent" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
        >
          Retour
        </button>
        <button
          type="button" onClick={onNext} disabled={!data.objective}
          className="flex-[2] py-4 rounded-xl font-semibold text-base transition-all duration-200"
          style={{
            backgroundColor: data.objective ? "var(--primary)" : "rgba(26,60,52,0.35)",
            color: "white",
            cursor: data.objective ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => { if (data.objective) { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = "var(--primary-hover)"; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 8px 24px rgba(26,60,52,0.25)"; } }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = data.objective ? "var(--primary)" : "rgba(26,60,52,0.35)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
        >
          Continuer
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Step 3 ── */
function StepThree({
  data, onChange, onSubmit, onBack, loading, error,
}: {
  data:     FormData;
  onChange: (k: keyof FormData, v: string | boolean) => void;
  onSubmit: () => void;
  onBack:   () => void;
  loading:  boolean;
  error:    string | null;
}) {
  const valid = data.acceptTerms;

  return (
    <motion.div
      key="step3"
      variants={staggerContainer}
      initial={{ opacity: 0, x: 20 }}
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
          Choisissez votre plan
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Commencez gratuitement, passez en Pro à tout moment.
        </p>
      </motion.div>

      {/* Plan selector */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3">
        {(["free", "pro"] as PlanType[]).map((plan) => {
          const selected = data.plan === plan;
          const isPro    = plan === "pro";
          return (
            <button
              key={plan} type="button"
              onClick={() => onChange("plan", plan)}
              className="relative flex flex-col items-start p-5 rounded-xl border text-left transition-all duration-200"
              style={{
                borderColor:     selected && isPro ? "var(--primary)" : selected ? "rgba(26,60,52,0.4)" : "var(--border)",
                backgroundColor: selected && isPro ? "rgba(26,60,52,0.06)" : selected ? "rgba(26,60,52,0.03)" : "var(--background)",
                boxShadow:       selected ? "0 0 0 2px rgba(26,60,52,0.15)" : "none",
              }}
              aria-pressed={selected}
              aria-label={`Plan ${isPro ? "Pro" : "Gratuit"}`}
            >
              {isPro && (
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-0.5 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: "var(--accent)", color: "white" }}
                >
                  Recommandé
                </span>
              )}
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                {isPro ? "Pro" : "Gratuit"}
              </p>
              <p className="text-2xl font-bold mb-1" style={{ color: selected ? "var(--primary)" : "var(--text)" }}>
                {isPro ? "19€" : "0€"}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {isPro ? "/mois · annulable" : "pour toujours"}
              </p>
            </button>
          );
        })}
      </motion.div>

      {/* Summary */}
      <motion.div
        variants={fadeInUp}
        className="p-4 rounded-xl"
        style={{ backgroundColor: "rgba(26,60,52,0.05)", border: "1px solid rgba(26,60,52,0.1)" }}
      >
        <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--primary)" }}>
          Résumé de votre compte
        </p>
        <div className="space-y-1">
          {[
            { label: "Nom",       value: `${data.firstName} ${data.lastName}`.trim() || "—" },
            { label: "Email",     value: data.email   || "—" },
            { label: "Fonction",  value: data.role    || "—" },
            { label: "Objectif",  value: OBJECTIVES.find((o) => o.id === data.objective)?.label || "—" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span style={{ color: "var(--muted)" }}>{item.label}</span>
              <span className="font-medium truncate max-w-[180px]" style={{ color: "var(--text)" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Supabase error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "rgba(232,80,26,0.08)", border: "1px solid rgba(232,80,26,0.2)" }}
          role="alert"
          aria-live="polite"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="var(--accent)" strokeWidth="1.5" />
            <path d="M8 5v3M8 10.5v.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-sm" style={{ color: "var(--accent)" }}>{error}</p>
        </motion.div>
      )}

      {/* Terms */}
      <motion.div variants={fadeInUp}>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={data.acceptTerms}
              onChange={(e) => onChange("acceptTerms", e.target.checked)}
              className="sr-only"
              aria-label="Accepter les conditions d'utilisation et la politique de confidentialité"
            />
            <div
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
              style={{
                borderColor:     data.acceptTerms ? "var(--primary)" : "var(--border)",
                backgroundColor: data.acceptTerms ? "var(--primary)" : "transparent",
              }}
              aria-hidden="true"
            >
              {data.acceptTerms && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            J&apos;accepte les{" "}
            <Link href="/terms" className="underline underline-offset-4" style={{ color: "var(--primary)" }}>
              conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/privacy" className="underline underline-offset-4" style={{ color: "var(--primary)" }}>
              politique de confidentialité
            </Link>
            .
          </p>
        </label>
      </motion.div>

      {/* Buttons */}
      <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
        <button
          type="button" onClick={onBack} disabled={loading}
          className="flex-1 py-4 rounded-xl font-semibold text-base border transition-all duration-200"
          style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "transparent" }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
        >
          Retour
        </button>
        <button
          type="button" onClick={onSubmit} disabled={!valid || loading}
          className="flex-[2] py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            backgroundColor: valid && !loading ? "var(--primary)" : "rgba(26,60,52,0.35)",
            color: "white",
            cursor: valid && !loading ? "pointer" : "not-allowed",
          }}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Création du compte…
            </>
          ) : (
            `Créer mon compte${data.plan === "free" ? " gratuitement" : " Pro"}`
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Main ── */
export default function RegisterPage() {
  const { loading, error, signUp } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    firstName:   "",
    lastName:    "",
    email:       "",
    password:    "",
    role:        "",
    objective:   "",
    plan:        "free",
    acceptTerms: false,
  });

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.REGISTER_STARTED);
  }, []);

  const update = (key: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNextStep = (nextStep: Step) => {
    trackEvent(ANALYTICS_EVENTS.REGISTER_STEP_COMPLETED, { step });
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    if (!form.objective) return;
    trackEvent(ANALYTICS_EVENTS.REGISTER_COMPLETED, { plan: form.plan, objective: form.objective });
    await signUp({
      email:     form.email,
      password:  form.password,
      firstName: form.firstName,
      lastName:  form.lastName,
      role:      form.role,
      objective: form.objective as ObjectiveType,
      plan:      form.plan,
    });
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
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold underline underline-offset-4"
            style={{ color: "var(--primary)" }}
          >
            Se connecter
          </Link>
        </p>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-8 lg:py-12">
        <div className="w-full max-w-lg">
          {/* Progress header */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <StepIndicator current={step} total={3} />
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Étape {step} sur 3 — {STEP_LABELS[step - 1]}
            </p>
            <div
              className="w-full h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--border)" }}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={3}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "var(--primary)" }}
                animate={{ width: `${((step - 1) / 2) * 100 + 33}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Card */}
          <div
            className="bg-white rounded-2xl border p-8 lg:p-10"
            style={{ borderColor: "var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepOne
                  key="s1"
                  data={form}
                  onChange={update}
                  onNext={() => handleNextStep(2)}
                />
              )}
              {step === 2 && (
                <StepTwo
                  key="s2"
                  data={form}
                  onChange={update}
                  onNext={() => handleNextStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <StepThree
                  key="s3"
                  data={form}
                  onChange={update}
                  onSubmit={handleSubmit}
                  onBack={() => setStep(2)}
                  loading={loading}
                  error={error}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Trust */}
          <p className="text-center text-xs mt-6" style={{ color: "var(--muted)" }}>
            Données protégées · Conformité RGPD · Aucune carte requise pour le plan gratuit
          </p>
        </div>
      </main>
    </div>
  );
}