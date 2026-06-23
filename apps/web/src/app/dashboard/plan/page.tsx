"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { SITE_NAME } from "@/lib/constants";
import { useDashboard } from "@/hooks/useDashboard";
import type { ActionItem, PlanMilestone } from "@/types/database";

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ backgroundColor: "rgba(229,221,210,0.5)" }}
    />
  );
}

function PlanSkeleton() {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <Skeleton className="h-32" />
      <Skeleton className="h-64" />
      <Skeleton className="h-48" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Priority badge
───────────────────────────────────────────────────────── */
function PriorityBadge({ priority }: { priority: ActionItem["priority"] }) {
  const config = {
    high:   { label: "Priorité",      bg: "rgba(232,80,26,0.1)", color: "var(--accent)"  },
    medium: { label: "Cette semaine", bg: "rgba(217,119,6,0.1)",  color: "var(--warning)" },
    low:    { label: "Optionnel",     bg: "rgba(229,221,210,0.5)", color: "var(--muted)"   },
  }[priority];

  return (
    <span
      className="text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Action item row
───────────────────────────────────────────────────────── */
function ActionRow({
  item,
  onToggle,
}: {
  item:     ActionItem;
  onToggle: (id: string, done: boolean) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-200"
      style={{
        borderColor:     "var(--border)",
        backgroundColor: item.done ? "rgba(248,245,240,0.5)" : "white",
        opacity:         item.done ? 0.65 : 1,
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(item.id, !item.done)}
        className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
        style={{
          borderColor:     item.done ? "var(--success)" : "var(--border)",
          backgroundColor: item.done ? "var(--success)" : "transparent",
        }}
        aria-label={item.done ? "Marquer comme à faire" : "Marquer comme terminé"}
        aria-checked={item.done}
        role="checkbox"
      >
        {item.done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M2 5l2 2 4-4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium leading-snug"
          style={{
            color:          item.done ? "var(--muted)" : "var(--text)",
            textDecoration: item.done ? "line-through" : "none",
          }}
        >
          {item.label}
        </p>
        {item.due_date && (
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Échéance :{" "}
            {new Date(item.due_date).toLocaleDateString("fr-FR", {
              day: "numeric", month: "long",
            })}
          </p>
        )}
      </div>

      <PriorityBadge priority={item.priority} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Milestone row
───────────────────────────────────────────────────────── */
function MilestoneRow({ milestone }: { milestone: PlanMilestone }) {
  const done    = milestone.status === "done";
  const current = milestone.status === "current";

  return (
    <motion.div
      variants={fadeInUp}
      className="flex items-start gap-5 pl-14 relative"
    >
      <div
        className="absolute left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center"
        style={{
          borderColor:     done ? "var(--success)" : current ? "var(--primary)" : "var(--border)",
          backgroundColor: done ? "var(--success)" : current ? "var(--primary)" : "white",
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        {done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {current && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: current ? "rgba(26,60,52,0.1)" : "rgba(229,221,210,0.5)",
              color:           current ? "var(--primary)"       : "var(--muted)",
            }}
          >
            {milestone.week_label}
          </span>
          {current && (
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(232,80,26,0.1)", color: "var(--accent)" }}
            >
              En cours
            </span>
          )}
          {done && (
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(26,127,75,0.1)", color: "var(--success)" }}
            >
              Terminé
            </span>
          )}
        </div>
        <p
          className="text-sm font-medium"
          style={{
            color:          done ? "var(--muted)" : "var(--text)",
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {milestone.title}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Progress overview
───────────────────────────────────────────────────────── */
function ProgressOverview({
  actions,
  milestones,
}: {
  actions:    ActionItem[];
  milestones: PlanMilestone[];
}) {
  const doneActions     = actions.filter((a) => a.done).length;
  const doneMilestones  = milestones.filter((m) => m.status === "done").length;
  const pctActions      = actions.length > 0
    ? Math.round((doneActions / actions.length) * 100)
    : 0;
  const pctMilestones   = milestones.length > 0
    ? Math.round((doneMilestones / milestones.length) * 100)
    : 0;

  return (
    <motion.div
      variants={scaleIn}
      className="bg-white rounded-2xl border p-6"
      style={{ borderColor: "var(--border)" }}
    >
      <h2 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--muted)" }}>
        Progression globale
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Actions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Actions complétées
            </p>
            <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
              {doneActions} / {actions.length}
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--border)" }}
            role="progressbar"
            aria-valuenow={pctActions}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pctActions}% des actions complétées`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
              initial={{ width: 0 }}
              animate={{ width: `${pctActions}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
            {pctActions}% accompli
          </p>
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Jalons atteints
            </p>
            <span className="text-sm font-bold" style={{ color: "var(--success)" }}>
              {doneMilestones} / {milestones.length}
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--border)" }}
            role="progressbar"
            aria-valuenow={pctMilestones}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pctMilestones}% des jalons atteints`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--success)" }}
              initial={{ width: 0 }}
              animate={{ width: `${pctMilestones}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
            {pctMilestones}% accompli
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Empty state
───────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-2xl border p-16 text-center max-w-lg mx-auto"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M4 8h20M4 14h14M4 20h10"
            stroke="var(--primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
        Plan d&apos;action vide
      </h2>
      <p className="text-base leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
        Votre plan d&apos;action sera généré automatiquement après votre
        première évaluation comportementale.
      </p>
      <Link
        href="/dashboard/evaluation"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
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
        Démarrer l&apos;évaluation
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3 7h8M8 4l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function PlanPage() {
  const {
    actions,
    milestones,
    loading,
    toggleAction,
  } = useDashboard();

  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");

  const filteredActions = actions.filter((a) => {
    if (filter === "todo") return !a.done;
    if (filter === "done") return  a.done;
    return true;
  });

  const hasData = actions.length > 0 || milestones.length > 0;

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
            <path
              d="M10 4l-4 4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Tableau de bord
        </Link>

        <span className="text-base font-bold" style={{ color: "var(--text)" }}>
          Plan d&apos;action
        </span>

        <Link
          href="/dashboard/evaluation"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
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
          aria-label="Faire une nouvelle évaluation"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Nouvelle évaluation
        </Link>
      </header>

      <main className="flex-1 p-6 lg:p-8">
        {loading ? (
          <PlanSkeleton />
        ) : !hasData ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* Overview */}
            <ProgressOverview actions={actions} milestones={milestones} />

            {/* Actions */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border p-6"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  Actions
                </h2>

                {/* Filter tabs */}
                <div
                  className="flex gap-1 p-1 rounded-lg"
                  style={{ backgroundColor: "var(--background)" }}
                  role="tablist"
                  aria-label="Filtrer les actions"
                >
                  {(["all", "todo", "done"] as const).map((f) => (
                    <button
                      key={f}
                      role="tab"
                      aria-selected={filter === f}
                      onClick={() => setFilter(f)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: filter === f ? "white" : "transparent",
                        color:           filter === f ? "var(--text)" : "var(--muted)",
                        boxShadow:       filter === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      {f === "all" ? "Tout" : f === "todo" ? "À faire" : "Terminé"}
                    </button>
                  ))}
                </div>
              </div>

              {filteredActions.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
                  {filter === "done"
                    ? "Aucune action terminée pour l'instant."
                    : "Toutes les actions sont complétées. 🎉"}
                </p>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-3">
                    {filteredActions.map((item) => (
                      <ActionRow
                        key={item.id}
                        item={item}
                        onToggle={toggleAction}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </motion.div>

            {/* Milestones */}
            {milestones.length > 0 && (
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-2xl border p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <h2
                  className="text-sm font-semibold uppercase tracking-widest mb-6"
                  style={{ color: "var(--muted)" }}
                >
                  Jalons — 30 jours
                </h2>

                <div className="relative">
                  {/* Vertical connector */}
                  <div
                    className="absolute left-5 top-0 bottom-0 w-px"
                    style={{ backgroundColor: "var(--border)" }}
                    aria-hidden="true"
                  />
                  <motion.ol
                    variants={staggerContainer}
                    className="space-y-6 relative"
                    role="list"
                  >
                    {milestones.map((m) => (
                      <MilestoneRow key={m.id} milestone={m} />
                    ))}
                  </motion.ol>
                </div>
              </motion.div>
            )}

            {/* Next evaluation CTA */}
            <motion.div
              variants={fadeInUp}
              className="p-6 rounded-2xl border text-center"
              style={{
                backgroundColor: "rgba(26,60,52,0.04)",
                borderColor:     "rgba(26,60,52,0.15)",
              }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
                Votre plan se met à jour après chaque évaluation.
              </p>
              <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
                Complétez une nouvelle évaluation pour suivre votre progression.
              </p>
              <Link
                href="/dashboard/evaluation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: "var(--primary)", color: "white" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "var(--primary-hover)";
                  el.style.transform       = "translateY(-1px)";
                  el.style.boxShadow       = "0 4px 16px rgba(26,60,52,0.25)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "var(--primary)";
                  el.style.transform       = "translateY(0)";
                  el.style.boxShadow       = "none";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Nouvelle évaluation
              </Link>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
