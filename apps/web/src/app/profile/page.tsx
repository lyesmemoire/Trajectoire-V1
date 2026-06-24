"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { useProfile }  from "@/hooks/useProfile";
import { useAuth }     from "@/hooks/useAuth";
import { useUser }     from "@/hooks/useUser";
import { useSupabase } from "@/hooks/useSupabase";
import type { ObjectiveType } from "@/types/database";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
type ProfileTab = "informations" | "securite" | "abonnement" | "donnees";

/* ─────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────── */
const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: "informations", label: "Informations" },
  { id: "securite",     label: "Sécurité"     },
  { id: "abonnement",   label: "Abonnement"   },
  { id: "donnees",      label: "Mes données"  },
];

const ROLES = [
  "Cadre supérieur",
  "Directeur / Directrice",
  "Manager",
  "Chef de projet",
  "Consultant(e)",
  "Professionnel(le) en transition",
  "Autre",
];

const OBJECTIVES: { id: ObjectiveType; label: string }[] = [
  { id: "promotion",  label: "Préparer une promotion"           },
  { id: "interview",  label: "Réussir un entretien interne"     },
  { id: "transition", label: "Accompagner une transition"       },
  { id: "direction",  label: "Prendre un poste de direction"    },
  { id: "clarity",    label: "Gagner en clarté sur ma carrière" },
  { id: "other",      label: "Autre objectif"                   },
];

/* ─────────────────────────────────────────────────────────
   Input helpers
───────────────────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  backgroundColor: "var(--background)",
  border:          "1px solid var(--border)",
  color:           "var(--text)",
};

function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--primary)";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(26,60,52,0.1)";
}
function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--border)";
  e.currentTarget.style.boxShadow   = "none";
}

/* ─────────────────────────────────────────────────────────
   Toast
───────────────────────────────────────────────────────── */
interface ToastItem {
  id:      number;
  message: string;
  type:    "success" | "error";
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = (message: string, type: ToastItem["type"] = "success") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500
    );
  };

  return { toasts, push };
}

function ToastList({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 space-y-3"
      role="status"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{   opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: t.type === "success" ? "var(--success)" : "var(--accent)",
              color:           "white",
              minWidth:        "240px",
              boxShadow:       "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            {t.type === "success" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8l3 3 7-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" />
                <path d="M8 5v3M8 10.5v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ backgroundColor: "rgba(229,221,210,0.5)" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Form section wrapper
───────────────────────────────────────────────────────── */
function FormSection({
  title, description, children,
}: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border p-8" style={{ borderColor: "var(--border)" }}>
      <div className="mb-6">
        <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{title}</h2>
        {description && (
          <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Tab — Informations
───────────────────────────────────────────────────────── */
function InformationsTab({ onSave }: { onSave: (msg: string) => void }) {
  const { profile, loading, saving, update } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [role,      setRole]      = useState("");
  const [objective, setObjective] = useState<ObjectiveType | "">("");

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name  ?? "");
    setLastName( profile.last_name   ?? "");
    setRole(     profile.role        ?? "");
    setObjective(profile.objective   ?? "");
  }, [profile]);

  const handleSave = async () => {
    await update({
      first_name: firstName,
      last_name:  lastName,
      role:       role || null,
      objective:  (objective as ObjectiveType) || null,
    });
    onSave("Profil mis à jour avec succès.");
  };

  const dirty =
    firstName !== (profile?.first_name ?? "") ||
    lastName  !== (profile?.last_name  ?? "") ||
    role      !== (profile?.role        ?? "") ||
    objective !== (profile?.objective   ?? "");

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <FormSection
          title="Identité"
          description="Ces informations apparaissent dans votre rapport et votre tableau de bord."
        >
          {/* Avatar strip */}
          <div
            className="flex items-center gap-5 mb-6 pb-6"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{ backgroundColor: "var(--primary)", color: "white" }}
              aria-hidden="true"
            >
              {(firstName?.[0] ?? "").toUpperCase()}
              {(lastName?.[0]  ?? "").toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {firstName} {lastName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                {role || "Fonction non renseignée"}
              </p>
              <button
                type="button"
                className="text-xs mt-2 underline underline-offset-4"
                style={{ color: "var(--primary)" }}
                aria-label="Changer la photo de profil (bientôt disponible)"
                onClick={() => {}}
              >
                Changer la photo
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                htmlFor="profile-firstName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text)" }}
              >
                Prénom
              </label>
              <input
                id="profile-firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label
                htmlFor="profile-lastName"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text)" }}
              >
                Nom
              </label>
              <input
                id="profile-lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-5">
            <label
              htmlFor="profile-role"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text)" }}
            >
              Fonction
            </label>
            <div className="relative">
              <select
                id="profile-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-base outline-none appearance-none transition-all duration-200"
                style={{ ...inputBase, color: role ? "var(--text)" : "var(--muted)" }}
                onFocus={handleFocus as React.FocusEventHandler<HTMLSelectElement>}
                onBlur={handleBlur   as React.FocusEventHandler<HTMLSelectElement>}
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
          </div>

          {/* Objective */}
          <div>
            <label
              htmlFor="profile-objective"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text)" }}
            >
              Objectif principal
            </label>
            <div className="relative">
              <select
                id="profile-objective"
                value={objective}
                onChange={(e) => setObjective(e.target.value as ObjectiveType)}
                className="w-full px-4 py-3 rounded-xl text-base outline-none appearance-none transition-all duration-200"
                style={{ ...inputBase, color: objective ? "var(--text)" : "var(--muted)" }}
                onFocus={handleFocus as React.FocusEventHandler<HTMLSelectElement>}
                onBlur={handleBlur   as React.FocusEventHandler<HTMLSelectElement>}
              >
                <option value="" disabled>Sélectionnez votre objectif</option>
                {OBJECTIVES.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </FormSection>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            backgroundColor: dirty && !saving ? "var(--primary)" : "rgba(26,60,52,0.3)",
            color:           "white",
            cursor:          dirty && !saving ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (dirty && !saving) {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = "var(--primary-hover)";
              el.style.transform       = "translateY(-1px)";
              el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = dirty && !saving ? "var(--primary)" : "rgba(26,60,52,0.3)";
            el.style.transform       = "translateY(0)";
            el.style.boxShadow       = "none";
          }}
          aria-busy={saving}
        >
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Tab — Sécurité
───────────────────────────────────────────────────────── */
function SecuriteTab({
  onSave,
}: {
  onSave: (msg: string, type?: "success" | "error") => void;
}) {
  const supabase = useSupabase();

  const [currentPwd,  setCurrentPwd]  = useState("");
  const [newPwd,      setNewPwd]      = useState("");
  const [confirmPwd,  setConfirmPwd]  = useState("");
  const [saving,      setSaving]      = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const passwordsMatch = newPwd === confirmPwd;
  const newPwdValid    = newPwd.length >= 8;
  const canSubmit      = !!(currentPwd && newPwdValid && passwordsMatch && !saving);

  const handleChange = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setSaving(false);
    if (error) {
      onSave(error.message, "error");
    } else {
      onSave("Mot de passe mis à jour avec succès.");
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    }
  };

  function EyeToggle({ show, onToggle, label }: { show: boolean; onToggle: () => void; label: string }) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
        style={{ color: "var(--muted)" }}
        aria-label={label}
      >
        {show ? (
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
    );
  }

  function PwdInput({
    id, label, value, onChange, show, onToggle, autoComplete,
  }: {
    id: string; label: string; value: string;
    onChange: (v: string) => void;
    show: boolean; onToggle: () => void; autoComplete: string;
  }) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            type={show ? "text" : "password"}
            autoComplete={autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 pr-12 rounded-xl text-base outline-none transition-all duration-200"
            style={inputBase}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <EyeToggle
            show={show}
            onToggle={onToggle}
            label={show ? "Masquer" : "Afficher"}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <FormSection
          title="Changer le mot de passe"
          description="Votre nouveau mot de passe doit contenir au moins 8 caractères."
        >
          <div className="space-y-5">
            <PwdInput
              id="sec-current"
              label="Mot de passe actuel"
              value={currentPwd}
              onChange={setCurrentPwd}
              show={showCurrent}
              onToggle={() => setShowCurrent((p) => !p)}
              autoComplete="current-password"
            />
            <PwdInput
              id="sec-new"
              label="Nouveau mot de passe"
              value={newPwd}
              onChange={setNewPwd}
              show={showNew}
              onToggle={() => setShowNew((p) => !p)}
              autoComplete="new-password"
            />
            <div>
              <label htmlFor="sec-confirm" className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="sec-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
                style={{
                  ...inputBase,
                  borderColor: confirmPwd && !passwordsMatch ? "var(--accent)" : "var(--border)",
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-describedby={confirmPwd && !passwordsMatch ? "pwd-mismatch" : undefined}
              />
              {confirmPwd && !passwordsMatch && (
                <p id="pwd-mismatch" className="text-xs mt-1.5" style={{ color: "var(--accent)" }} role="alert">
                  Les mots de passe ne correspondent pas.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleChange}
              disabled={!canSubmit}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                backgroundColor: canSubmit ? "var(--primary)" : "rgba(26,60,52,0.3)",
                color:           "white",
                cursor:          canSubmit ? "pointer" : "not-allowed",
              }}
              aria-busy={saving}
            >
              {saving ? "Mise à jour…" : "Mettre à jour le mot de passe"}
            </button>
          </div>
        </FormSection>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <FormSection
          title="Sessions actives"
          description="Appareils connectés à votre compte."
        >
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ backgroundColor: "rgba(26,60,52,0.04)", border: "1px solid rgba(26,60,52,0.1)" }}
          >
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="16" height="11" rx="2" stroke="var(--primary)" strokeWidth="1.5" />
                <path d="M7 18h6M10 15v3" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Session actuelle</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Navigateur web · Maintenant</p>
              </div>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: "rgba(26,127,75,0.1)", color: "var(--success)" }}
            >
              Active
            </span>
          </div>
        </FormSection>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Tab — Abonnement
───────────────────────────────────────────────────────── */
function AbonnementTab() {
  const { profile } = useProfile();
  const isPro = profile?.plan === "pro";

  const proFeatures = [
    "Évaluations illimitées",
    "Rapport complet (8 dimensions)",
    "Simulations personnalisées",
    "Plan d'action 30 jours",
    "Suivi de progression",
    "Feedback prioritaire",
  ];

  const freeFeatures = [
    "1 évaluation complète",
    "Rapport de base",
    "3 dimensions analysées",
    "Recommandations générales",
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <FormSection title="Votre plan actuel" description="Gérez votre abonnement Trajectoire.">
          {/* Plan display */}
          <div
            className="p-6 rounded-xl mb-6"
            style={{
              backgroundColor: isPro ? "rgba(26,60,52,0.06)" : "rgba(248,245,240,0.8)",
              border: `1px solid ${isPro ? "rgba(26,60,52,0.2)" : "var(--border)"}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-widest mb-1"
                  style={{ color: "var(--muted)" }}
                >
                  Plan actuel
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {isPro ? "Pro" : "Gratuit"}
                </p>
              </div>
              {isPro && (
                <span
                  className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{ backgroundColor: "var(--primary)", color: "white" }}
                >
                  Actif
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(isPro ? proFeatures : freeFeatures).map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7l3 3 7-7" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade or manage */}
          {!isPro ? (
            <div className="space-y-3">
              <Link
                href="/register?plan=pro"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200"
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
                Passer en Pro — 19€/mois
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
                Annulable à tout moment · Sans engagement
              </p>
            </div>
          ) : (
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ backgroundColor: "rgba(248,245,240,0.8)", border: "1px solid var(--border)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Prochaine facturation</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>19€ le 1er du mois prochain</p>
              </div>
              <button
                type="button"
                className="text-xs underline underline-offset-4 transition-colors"
                style={{ color: "var(--accent)" }}
                aria-label="Résilier l'abonnement Pro"
              >
                Résilier
              </button>
            </div>
          )}
        </FormSection>
      </motion.div>

      {/* Billing history */}
      <motion.div variants={fadeInUp}>
        <FormSection title="Historique de facturation">
          {!isPro ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Aucune facturation sur le plan gratuit.
            </p>
          ) : (
            <div>
              {[
                { date: "1er décembre 2024", amount: "19,00€" },
                { date: "1er novembre 2024", amount: "19,00€" },
                { date: "1er octobre 2024",  amount: "19,00€" },
              ].map((invoice, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3.5"
                  style={{
                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{invoice.date}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Plan Pro · Mensuel</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      {invoice.amount}
                    </span>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "rgba(26,127,75,0.1)", color: "var(--success)" }}
                    >
                      Payée
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FormSection>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Tab — Données
───────────────────────────────────────────────────────── */
function DonneesTab({
  onSave,
}: {
  onSave: (msg: string, type?: "success" | "error") => void;
}) {
  const { user }        = useUser();
  const supabase        = useSupabase();
  const { signOut }     = useAuth();

  const [confirmText,      setConfirmText]      = useState("");
  const [deleting,         setDeleting]         = useState(false);
  const [showDeleteModal,  setShowDeleteModal]  = useState(false);

  const handleExport = () => {
    onSave("L'export de données sera disponible prochainement.", "error");
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "SUPPRIMER" || !user) return;
    setDeleting(true);
    /*
      Production: use a server action with service_role key to call
      supabase.auth.admin.deleteUser(user.id)
      For now we sign out and redirect.
    */
    await signOut();
    setDeleting(false);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* RGPD export */}
      <motion.div variants={fadeInUp}>
        <FormSection
          title="Export de vos données"
          description="Téléchargez l'intégralité de vos données (RGPD — Article 20, droit à la portabilité)."
        >
          <div className="space-y-4">
            {[
              { label: "Profil complet",          desc: "Nom, fonction, objectif, plan"    },
              { label: "Évaluations",             desc: "Scores et réponses complètes"     },
              { label: "Résultats de simulation", desc: "Scénarios et feedbacks"           },
              { label: "Plan d'action",           desc: "Actions, jalons, recommandations" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium" style={{ color: "var(--text)" }}>{item.label}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{item.desc}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7l3 3 7-7" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}

            <button
              type="button"
              onClick={handleExport}
              className="w-full py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200"
              style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "white" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
            >
              Télécharger mes données (JSON)
            </button>
          </div>
        </FormSection>
      </motion.div>

      {/* Retention policy */}
      <motion.div variants={fadeInUp}>
        <FormSection title="Conservation des données">
          <ul className="space-y-3" role="list">
            {[
              "Vos données d'évaluation sont conservées tant que votre compte est actif.",
              "En cas de résiliation Pro, vos données restent accessibles 30 jours en lecture.",
              "La suppression du compte entraîne l'effacement définitif de toutes vos données sous 30 jours.",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--muted)" }} role="listitem">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: "var(--primary)" }}
                  aria-hidden="true"
                />
                <p className="leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </FormSection>
      </motion.div>

      {/* Danger zone */}
      <motion.div variants={fadeInUp}>
        <div
          className="bg-white rounded-2xl border p-8"
          style={{ borderColor: "rgba(232,80,26,0.3)" }}
        >
          <h2 className="text-base font-bold mb-1" style={{ color: "var(--accent)" }}>
            Zone de danger
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            La suppression de votre compte est irréversible. Toutes vos données seront effacées définitivement.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all duration-200"
            style={{
              borderColor:     "rgba(232,80,26,0.4)",
              color:           "var(--accent)",
              backgroundColor: "rgba(232,80,26,0.04)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(232,80,26,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor     = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(232,80,26,0.04)";
              (e.currentTarget as HTMLButtonElement).style.borderColor     = "rgba(232,80,26,0.4)";
            }}
          >
            Supprimer mon compte
          </button>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowDeleteModal(false); setConfirmText(""); }}
              aria-hidden="true"
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="bg-white rounded-2xl border p-8 w-full max-w-md"
                style={{ borderColor: "rgba(232,80,26,0.3)" }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
              >
                <h3
                  id="delete-dialog-title"
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--accent)" }}
                >
                  Supprimer le compte définitivement ?
                </h3>
                <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
                  Cette action est irréversible. Tapez{" "}
                  <span className="font-bold" style={{ color: "var(--text)" }}>SUPPRIMER</span>{" "}
                  pour confirmer.
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="w-full px-4 py-3 rounded-xl text-base outline-none mb-4 transition-all duration-200"
                  style={inputBase}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  aria-label="Tapez SUPPRIMER pour confirmer"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowDeleteModal(false); setConfirmText(""); }}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm border transition-all duration-200"
                    style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "transparent" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={confirmText !== "SUPPRIMER" || deleting}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      backgroundColor:
                        confirmText === "SUPPRIMER" && !deleting
                          ? "var(--accent)"
                          : "rgba(232,80,26,0.3)",
                      color:  "white",
                      cursor: confirmText === "SUPPRIMER" && !deleting ? "pointer" : "not-allowed",
                    }}
                    aria-busy={deleting}
                  >
                    {deleting ? "Suppression…" : "Supprimer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("informations");
  const { toasts, push }          = useToast();
  const { profile, loading }      = useProfile();
  const { signOut }               = useAuth();

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.PROFILE_VIEWED);
  }, []);

  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase()
    : "…";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b"
        style={{
          backgroundColor:      "rgba(255,255,255,0.9)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor:          "var(--border)",
        }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
          aria-label="Retour au tableau de bord"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tableau de bord
        </Link>

        <span className="text-base font-bold" style={{ color: "var(--text)" }}>
          Mon profil
        </span>

        <button
          type="button"
          onClick={() => signOut()}
          className="text-sm font-medium transition-colors"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
          aria-label="Se déconnecter"
        >
          Déconnexion
        </button>
      </header>

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile hero */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border p-6 mb-6 flex items-center gap-5"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
              style={{ backgroundColor: "var(--primary)", color: "white" }}
              aria-hidden="true"
            >
              {loading ? "…" : initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
                {loading ? "Chargement…" : `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "Mon profil"}
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {profile?.role ?? "Fonction non renseignée"}
              </p>
            </div>
            <span
              className="text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0"
              style={{
                backgroundColor: profile?.plan === "pro" ? "rgba(26,60,52,0.1)" : "rgba(229,221,210,0.5)",
                color:           profile?.plan === "pro" ? "var(--primary)"       : "var(--muted)",
              }}
            >
              Plan {profile?.plan === "pro" ? "Pro" : "Gratuit"}
            </span>
          </motion.div>

          {/* Tab bar */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
            style={{ backgroundColor: "white", border: "1px solid var(--border)" }}
            role="tablist"
            aria-label="Sections du profil"
          >
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={{
                  backgroundColor: activeTab === tab.id ? "var(--primary)" : "transparent",
                  color:           activeTab === tab.id ? "white"           : "var(--muted)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panels */}
          <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
            <AnimatePresence mode="wait">
              {activeTab === "informations" && (
                <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <InformationsTab onSave={(msg) => push(msg, "success")} />
                </motion.div>
              )}
              {activeTab === "securite" && (
                <motion.div key="sec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <SecuriteTab onSave={(msg, type) => push(msg, type)} />
                </motion.div>
              )}
              {activeTab === "abonnement" && (
                <motion.div key="abo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <AbonnementTab />
                </motion.div>
              )}
              {activeTab === "donnees" && (
                <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <DonneesTab onSave={(msg, type) => push(msg, type)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <ToastList toasts={toasts} />
    </div>
  );
}
