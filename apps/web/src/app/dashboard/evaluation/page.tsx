"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SITE_NAME } from "@/lib/constants";
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@/hooks/useUser";
import { createLogger } from "@/lib/logger";
import {
  createEvaluation,
  completeEvaluation,
  upsertCompetencyScores,
} from "@/lib/supabase/queries";

const logger = createLogger({ component: "dashboard-evaluation" });

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
interface Question {
  id:          string;
  dimension:   string;
  text:        string;
  options:     { value: number; label: string }[];
}

interface Answer {
  questionId: string;
  dimension:  string;
  value:      number;
}

type EvalStep = "intro" | "questions" | "processing" | "results";

/* ─────────────────────────────────────────────────────────
   Questions bank
───────────────────────────────────────────────────────── */
const QUESTIONS: Question[] = [
  /* Leadership */
  {
    id: "L1", dimension: "Leadership",
    text: "Lors d'une réunion difficile, vous prenez naturellement la parole pour recadrer les échanges.",
    options: [
      { value: 1, label: "Rarement — je préfère observer"         },
      { value: 2, label: "Parfois — selon le contexte"            },
      { value: 3, label: "Souvent — quand c'est nécessaire"       },
      { value: 4, label: "Systématiquement — c'est mon rôle"      },
    ],
  },
  {
    id: "L2", dimension: "Leadership",
    text: "Vous inspirez confiance à vos équipes même dans les situations d'incertitude.",
    options: [
      { value: 1, label: "Difficilement — l'incertitude m'affecte aussi"   },
      { value: 2, label: "Partiellement — je m'efforce de le faire"        },
      { value: 3, label: "Généralement — je reste un point d'ancrage"      },
      { value: 4, label: "Toujours — c'est une force reconnue"             },
    ],
  },

  /* Communication */
  {
    id: "C1", dimension: "Communication",
    text: "Vous structurez votre message avant de prendre la parole en entretien.",
    options: [
      { value: 1, label: "Non — je m'exprime spontanément"                },
      { value: 2, label: "Parfois — selon l'importance du sujet"          },
      { value: 3, label: "Souvent — j'ai une trame mentale"               },
      { value: 4, label: "Toujours — je prépare systématiquement"         },
    ],
  },
  {
    id: "C2", dimension: "Communication",
    text: "Face à un interlocuteur critique, vous maintenez un discours clair et assertif.",
    options: [
      { value: 1, label: "Non — je perds mes moyens"                      },
      { value: 2, label: "Parfois — avec difficulté"                      },
      { value: 3, label: "Souvent — je reste cadré"                       },
      { value: 4, label: "Toujours — la critique renforce mon discours"   },
    ],
  },

  /* Décision */
  {
    id: "D1", dimension: "Décision",
    text: "Vous prenez des décisions importantes sans attendre d'avoir toutes les informations.",
    options: [
      { value: 1, label: "Jamais — je dois avoir toutes les données"      },
      { value: 2, label: "Rarement — je préfère attendre"                 },
      { value: 3, label: "Parfois — avec un niveau d'information suffisant" },
      { value: 4, label: "Souvent — je suis à l'aise avec l'ambiguïté"   },
    ],
  },
  {
    id: "D2", dimension: "Décision",
    text: "Lorsque vous prenez une mauvaise décision, vous l'assumez et vous l'expliquez.",
    options: [
      { value: 1, label: "Difficilement — c'est un moment douloureux"     },
      { value: 2, label: "Avec effort — je m'y oblige"                    },
      { value: 3, label: "Naturellement — l'erreur fait partie du process" },
      { value: 4, label: "Facilement — c'est une marque de maturité"     },
    ],
  },

  /* Stress */
  {
    id: "S1", dimension: "Stress",
    text: "Avant un entretien à fort enjeu, votre niveau de stress est :",
    options: [
      { value: 4, label: "Très faible — je reste serein(e)"               },
      { value: 3, label: "Modéré — gérable et stimulant"                  },
      { value: 2, label: "Élevé — il affecte ma préparation"              },
      { value: 1, label: "Très élevé — il me paralyse"                    },
    ],
  },
  {
    id: "S2", dimension: "Stress",
    text: "Face à une question déstabilisante, votre première réaction est :",
    options: [
      { value: 4, label: "Prendre le temps de réfléchir sans anxiété"    },
      { value: 3, label: "Marquer une pause et reformuler"                },
      { value: 2, label: "Répondre trop vite pour sortir du malaise"      },
      { value: 1, label: "Perdre le fil et improviser"                    },
    ],
  },

  /* Assertivité */
  {
    id: "A1", dimension: "Assertivité",
    text: "Vous exprimez un désaccord professionnel directement, même à un supérieur.",
    options: [
      { value: 1, label: "Rarement — je préfère éviter le conflit"        },
      { value: 2, label: "Parfois — avec beaucoup de précautions"         },
      { value: 3, label: "Souvent — avec diplomatie mais clarté"          },
      { value: 4, label: "Toujours — l'assertivité est une valeur"        },
    ],
  },
  {
    id: "A2", dimension: "Assertivité",
    text: "Dans une négociation, vous maintenez votre position face à la pression.",
    options: [
      { value: 1, label: "Non — je cède facilement"                       },
      { value: 2, label: "Parfois — selon les enjeux"                     },
      { value: 3, label: "Souvent — je tiens mes positions clés"          },
      { value: 4, label: "Toujours — je négocie sans lâcher l'essentiel" },
    ],
  },

  /* Adaptabilité */
  {
    id: "AD1", dimension: "Adaptabilité",
    text: "Face à un changement de contexte inattendu, vous ajustez votre approche rapidement.",
    options: [
      { value: 1, label: "Non — le changement me déstabilise"             },
      { value: 2, label: "Avec effort — j'ai besoin de temps"             },
      { value: 3, label: "Assez bien — je m'adapte en quelques heures"    },
      { value: 4, label: "Facilement — l'adaptabilité est ma force"       },
    ],
  },
  {
    id: "AD2", dimension: "Adaptabilité",
    text: "Vous tirez parti des situations imprévues pour créer de nouvelles opportunités.",
    options: [
      { value: 1, label: "Rarement — j'essaie de revenir à mon plan"      },
      { value: 2, label: "Parfois — si l'opportunité est évidente"        },
      { value: 3, label: "Souvent — je cherche à en faire un atout"       },
      { value: 4, label: "Toujours — c'est ma façon de penser"            },
    ],
  },

  /* Intelligence émotionnelle */
  {
    id: "E1", dimension: "Émotion",
    text: "Vous identifiez vos émotions dans le feu d'un entretien et les réglez.",
    options: [
      { value: 1, label: "Non — elles prennent le dessus"                  },
      { value: 2, label: "Parfois — après coup"                            },
      { value: 3, label: "Souvent — je les perçois en temps réel"          },
      { value: 4, label: "Toujours — j'ai développé cette capacité"       },
    ],
  },
  {
    id: "E2", dimension: "Émotion",
    text: "Vous lisez l'état émotionnel de votre interlocuteur et adaptez votre ton.",
    options: [
      { value: 1, label: "Rarement — je suis centré sur mon message"      },
      { value: 2, label: "Parfois — quand les signaux sont forts"         },
      { value: 3, label: "Souvent — je suis attentif aux micro-signaux"   },
      { value: 4, label: "Toujours — c'est instinctif"                    },
    ],
  },

  /* Vision stratégique */
  {
    id: "V1", dimension: "Vision",
    text: "Vous pouvez expliquer votre trajectoire professionnelle à 5 ans de façon convaincante.",
    options: [
      { value: 1, label: "Non — je n'ai pas de vision claire"             },
      { value: 2, label: "Partiellement — c'est flou"                     },
      { value: 3, label: "Oui — j'ai une direction, pas forcément précise" },
      { value: 4, label: "Parfaitement — je peux la défendre en entretien" },
    ],
  },
  {
    id: "V2", dimension: "Vision",
    text: "Vous reliez vos décisions quotidiennes à des objectifs de long terme.",
    options: [
      { value: 1, label: "Rarement — je suis dans l'opérationnel"         },
      { value: 2, label: "Parfois — pour les décisions importantes"       },
      { value: 3, label: "Souvent — j'ai ce réflexe stratégique"          },
      { value: 4, label: "Toujours — c'est ma boussole"                   },
    ],
  },
];

const DIMENSIONS = [
  "Leadership", "Communication", "Décision",
  "Stress", "Assertivité", "Adaptabilité", "Émotion", "Vision",
];

const TOTAL = QUESTIONS.length;

/* ─────────────────────────────────────────────────────────
   Score computation
───────────────────────────────────────────────────────── */
function computeScores(answers: Answer[]): {
  byDimension: Record<string, number>;
  confidence:  number;
  stress:      number;
  preparedness: number;
  decision:    number;
} {
  const grouped: Record<string, number[]> = {};

  for (const a of answers) {
    if (!grouped[a.dimension]) grouped[a.dimension] = [];
    grouped[a.dimension].push(a.value);
  }

  const byDimension: Record<string, number> = {};
  for (const [dim, vals] of Object.entries(grouped)) {
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
    byDimension[dim] = Math.round((avg / 4) * 100);
  }

  const avg = (...keys: string[]) =>
    Math.round(
      keys.reduce((s, k) => s + (byDimension[k] ?? 50), 0) / keys.length
    );

  return {
    byDimension,
    confidence:   avg("Leadership", "Communication", "Assertivité"),
    stress:       100 - (byDimension["Stress"] ?? 50),
    preparedness: avg("Décision", "Vision", "Adaptabilité"),
    decision:     byDimension["Décision"] ?? 50,
  };
}

/* ─────────────────────────────────────────────────────────
   Progress bar
───────────────────────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
        <span>Question {current} sur {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: "var(--primary)" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Dimension tag
───────────────────────────────────────────────────────── */
function DimensionTag({ name }: { name: string }) {
  const idx   = DIMENSIONS.indexOf(name);
  const hue   = (idx / DIMENSIONS.length) * 360;
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `hsl(${hue}, 30%, 92%)`,
        color:           `hsl(${hue}, 40%, 35%)`,
      }}
    >
      {name}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Score ring (result screen)
───────────────────────────────────────────────────────── */
function ResultRing({
  value, label, color, size = 96, strokeWidth = 8,
}: {
  value: number; label: string; color: string; size?: number; strokeWidth?: number;
}) {
  const r    = (size - strokeWidth) / 2;
  const circ = r * 2 * Math.PI;
  const off  = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: off }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xl font-bold"
            style={{ color: "var(--text)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {value}
          </motion.span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Intro screen
───────────────────────────────────────────────────────── */
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto text-center space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
          aria-hidden="true"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="var(--primary)" strokeWidth="2" />
            <path d="M16 10v6l4 4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="heading-2 mb-3" style={{ color: "var(--text)" }}>
          Évaluation comportementale
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          {TOTAL} questions. 8 dimensions. Environ 15 minutes.
          <br />
          Vos réponses sont confidentielles et ne servent qu'à générer votre profil.
        </p>
      </motion.div>

      {/* Dimensions grid */}
      <motion.div variants={fadeInUp}>
        <p className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Dimensions évaluées
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {DIMENSIONS.map((d) => <DimensionTag key={d} name={d} />)}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
      >
        {[
          {
            icon: "⏱",
            title: "15 minutes",
            body:  "Durée estimée pour compléter les 16 questions.",
          },
          {
            icon: "🔒",
            title: "Confidentiel",
            body:  "Vos réponses ne sont accessibles qu'à vous.",
          },
          {
            icon: "📊",
            title: "Résultats immédiats",
            body:  "Votre rapport est généré instantanément.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-xl border"
            style={{ borderColor: "var(--border)", backgroundColor: "white" }}
          >
            <span className="text-2xl mb-2 block" aria-hidden="true">{item.icon}</span>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>{item.title}</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{item.body}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeInUp}>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-base transition-all duration-200"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "var(--primary-hover)";
            el.style.transform       = "translateY(-1px)";
            el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "var(--primary)";
            el.style.transform       = "translateY(0)";
            el.style.boxShadow       = "none";
          }}
        >
          Démarrer l&apos;évaluation
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
          Prenez le temps de répondre honnêtement. Il n&apos;y a pas de bonne ou mauvaise réponse.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Question screen
───────────────────────────────────────────────────────── */
function QuestionScreen({
  question,
  index,
  total,
  selectedValue,
  onSelect,
  onPrev,
  onNext,
  isFirst,
  isLast,
}: {
  question:      Question;
  index:         number;
  total:         number;
  selectedValue: number | null;
  onSelect:      (v: number) => void;
  onPrev:        () => void;
  onNext:        () => void;
  isFirst:       boolean;
  isLast:        boolean;
}) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Progress */}
      <ProgressBar current={index + 1} total={total} />

      {/* Card */}
      <div
        className="bg-white rounded-2xl border p-8 lg:p-10"
        style={{ borderColor: "var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
      >
        {/* Dimension tag */}
        <div className="mb-5">
          <DimensionTag name={question.dimension} />
        </div>

        {/* Question */}
        <h2
          className="text-xl font-semibold leading-snug mb-8"
          style={{ color: "var(--text)" }}
          id={`question-${question.id}`}
        >
          {question.text}
        </h2>

        {/* Options */}
        <fieldset
          className="space-y-3"
          aria-labelledby={`question-${question.id}`}
        >
          <legend className="sr-only">Choisissez une réponse</legend>
          {question.options.map((opt) => {
            const selected = selectedValue === opt.value;
            return (
              <label
                key={opt.value}
                className="flex items-start gap-4 px-5 py-4 rounded-xl border cursor-pointer transition-all duration-200"
                style={{
                  borderColor:     selected ? "var(--primary)" : "var(--border)",
                  backgroundColor: selected ? "rgba(26,60,52,0.06)" : "var(--background)",
                  boxShadow:       selected ? "0 0 0 2px rgba(26,60,52,0.15)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(26,60,52,0.3)";
                    (e.currentTarget as HTMLLabelElement).style.backgroundColor = "rgba(26,60,52,0.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLLabelElement).style.backgroundColor = "var(--background)";
                  }
                }}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={opt.value}
                  checked={selected}
                  onChange={() => onSelect(opt.value)}
                  className="sr-only"
                  aria-label={opt.label}
                />
                {/* Custom radio */}
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
                  style={{
                    borderColor:     selected ? "var(--primary)" : "var(--border)",
                    backgroundColor: selected ? "var(--primary)" : "transparent",
                  }}
                  aria-hidden="true"
                >
                  {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <span
                  className="text-sm font-medium leading-snug"
                  style={{ color: selected ? "var(--primary)" : "var(--text)" }}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}
        </fieldset>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-200"
          style={{
            borderColor:     "var(--border)",
            color:           isFirst ? "var(--border)" : "var(--text)",
            backgroundColor: "white",
            cursor:          isFirst ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isFirst) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          }}
          aria-label="Question précédente"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Précédent
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={selectedValue === null}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: selectedValue !== null ? "var(--primary)" : "rgba(26,60,52,0.3)",
            color:           "white",
            cursor:          selectedValue !== null ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (selectedValue !== null) {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = "var(--primary-hover)";
              el.style.transform       = "translateY(-1px)";
              el.style.boxShadow       = "0 4px 16px rgba(26,60,52,0.25)";
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = selectedValue !== null ? "var(--primary)" : "rgba(26,60,52,0.3)";
            el.style.transform       = "translateY(0)";
            el.style.boxShadow       = "none";
          }}
          aria-label={isLast ? "Terminer l'évaluation" : "Question suivante"}
        >
          {isLast ? "Terminer" : "Suivant"}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Processing screen
───────────────────────────────────────────────────────── */
function ProcessingScreen() {
  const STEPS = [
    "Analyse de vos réponses comportementales…",
    "Calcul des scores sur 8 dimensions…",
    "Comparaison avec les profils de référence…",
    "Génération de vos recommandations…",
    "Finalisation de votre rapport…",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto text-center space-y-8"
    >
      {/* Spinner */}
      <div className="flex justify-center" aria-hidden="true">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="50 150"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 14l6 6 14-14" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Analyse en cours…
        </h2>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          Votre profil comportemental est en cours de génération.
        </p>
      </div>

      <div className="space-y-2 text-left">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 text-sm"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.6, duration: 0.4 }}
            style={{ color: "var(--muted)" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.6 + 0.2 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7l3 3 7-7" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            {step}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Results screen
───────────────────────────────────────────────────────── */
function ResultsScreen({
  scores,
  onDashboard,
}: {
  scores: ReturnType<typeof computeScores>;
  onDashboard: () => void;
}) {
  const { byDimension, confidence, stress, preparedness, decision } = scores;

  const level = (v: number) =>
    v >= 80 ? "Excellent" : v >= 65 ? "Bon" : v >= 50 ? "En progression" : "À travailler";
  const levelColor = (v: number) =>
    v >= 80 ? "var(--success)" : v >= 65 ? "var(--primary)" : v >= 50 ? "var(--warning)" : "var(--accent)";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "rgba(26,127,75,0.12)" }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12l4 4 12-12" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="heading-2 mb-2" style={{ color: "var(--text)" }}>
          Votre évaluation est terminée.
        </h2>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          Voici votre profil comportemental. Il est maintenant disponible dans votre tableau de bord.
        </p>
      </motion.div>

      {/* Main scores */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl border p-8"
        style={{ borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-6 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Scores principaux
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <ResultRing value={confidence}   label="Confiance"   color="var(--primary)" />
          <ResultRing value={preparedness} label="Préparation" color="var(--success)" />
          <ResultRing value={100 - stress} label="Stress"      color="var(--accent)"  />
          <ResultRing value={decision}     label="Décision"    color="var(--warning)" />
        </div>
      </motion.div>

      {/* Dimension breakdown */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl border p-8"
        style={{ borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-6 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Analyse par dimension
        </h3>
        <div className="space-y-4">
          {DIMENSIONS.map((dim) => {
            const val = byDimension[dim] ?? 0;
            return (
              <div key={dim} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DimensionTag name={dim} />
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${levelColor(val)}15`, color: levelColor(val) }}
                    >
                      {level(val)}
                    </span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: levelColor(val) }}>{val}/100</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: levelColor(val) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Top strengths + improvement areas */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Strengths */}
        <div
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "var(--border)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
            ✅ Points forts
          </h3>
          <ul className="space-y-2" role="list">
            {DIMENSIONS
              .map((d) => ({ d, v: byDimension[d] ?? 0 }))
              .sort((a, b) => b.v - a.v)
              .slice(0, 3)
              .map(({ d, v }) => (
                <li key={d} className="flex items-center justify-between text-sm" role="listitem">
                  <span style={{ color: "var(--text)" }}>{d}</span>
                  <span className="font-semibold" style={{ color: "var(--success)" }}>{v}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Improvements */}
        <div
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "var(--border)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
            🎯 Axes de progression
          </h3>
          <ul className="space-y-2" role="list">
            {DIMENSIONS
              .map((d) => ({ d, v: byDimension[d] ?? 0 }))
              .sort((a, b) => a.v - b.v)
              .slice(0, 3)
              .map(({ d, v }) => (
                <li key={d} className="flex items-center justify-between text-sm" role="listitem">
                  <span style={{ color: "var(--text)" }}>{d}</span>
                  <span className="font-semibold" style={{ color: "var(--accent)" }}>{v}</span>
                </li>
              ))}
          </ul>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={onDashboard}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "var(--primary-hover)";
            el.style.transform       = "translateY(-1px)";
            el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "var(--primary)";
            el.style.transform       = "translateY(0)";
            el.style.boxShadow       = "none";
          }}
        >
          Voir mon tableau de bord
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <Link
          href="/dashboard/simulation"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border transition-all duration-200"
          style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "white" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; }}
        >
          Démarrer une simulation
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function EvaluationPage() {
  const router   = useRouter();
  const supabase = useSupabase();
  const { user } = useUser();

  const [evalStep,  setEvalStep]  = useState<EvalStep>("intro");
  const [qIndex,    setQIndex]    = useState(0);
  const [answers,   setAnswers]   = useState<Answer[]>([]);
  const [computed,  setComputed]  = useState<ReturnType<typeof computeScores> | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const currentQ   = QUESTIONS[qIndex];
  const currentAns = answers.find((a) => a.questionId === currentQ?.id)?.value ?? null;

  /* Select answer for current question */
  const handleSelect = useCallback((value: number) => {
    setAnswers((prev) => {
      const next = prev.filter((a) => a.questionId !== currentQ.id);
      return [...next, { questionId: currentQ.id, dimension: currentQ.dimension, value }];
    });
  }, [currentQ]);

  /* Navigate to next question or finish */
  const handleNext = useCallback(async () => {
    if (currentAns === null) return;

    if (qIndex < TOTAL - 1) {
      setQIndex((i) => i + 1);
      return;
    }

    /* Last question — start processing */
    setEvalStep("processing");
    const scores = computeScores(answers);
    setComputed(scores);

    /* Save to Supabase */
    if (user) {
      try {
        const evaluation = await createEvaluation(supabase, user.id);

        if (evaluation) {
          await completeEvaluation(supabase, evaluation.id, {
            confidence_score: scores.confidence,
            stress_score:     scores.stress,
            preparedness:     scores.preparedness,
            decision_score:   scores.decision,
            raw_answers:      Object.fromEntries(
              answers.map((a) => [a.questionId, a.value])
            ) as Record<string, unknown>,
          });

          await upsertCompetencyScores(
            supabase,
            user.id,
            evaluation.id,
            Object.entries(scores.byDimension).map(([name, score]) => ({
              name,
              score,
            }))
          );
        }
      } catch (err) {
        logger.error({ error: err }, "Erreur sauvegarde évaluation");
        setSaveError("Vos résultats ont été calculés mais n'ont pas pu être sauvegardés.");
      }
    }

    /* Show results after a brief processing delay */
    await new Promise((r) => setTimeout(r, QUESTIONS.length * 600 + 800));
    setEvalStep("results");
  }, [currentAns, qIndex, answers, user, supabase]);

  const handlePrev = useCallback(() => {
    if (qIndex > 0) setQIndex((i) => i - 1);
  }, [qIndex]);

  return (
    <div
      className="min-h-screen grain-overlay flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b"
        style={{
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter:  "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor:     "var(--border)",
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

        <span
          className="text-base font-bold"
          style={{ color: "var(--text)" }}
        >
          {SITE_NAME}
        </span>

        {/* Progress indicator (questions only) */}
        {evalStep === "questions" && (
          <span className="text-sm font-medium tabular-nums" style={{ color: "var(--muted)" }}>
            {qIndex + 1} / {TOTAL}
          </span>
        )}

        {evalStep !== "questions" && <div className="w-16" aria-hidden="true" />}
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Save error banner */}
          {saveError && (
            <div
              className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl"
              style={{
                backgroundColor: "rgba(232,80,26,0.08)",
                border:          "1px solid rgba(232,80,26,0.2)",
              }}
              role="alert"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="var(--accent)" strokeWidth="1.5" />
                <path d="M8 5v3M8 10.5v.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-sm" style={{ color: "var(--accent)" }}>{saveError}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {evalStep === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <IntroScreen onStart={() => setEvalStep("questions")} />
              </motion.div>
            )}

            {evalStep === "questions" && currentQ && (
              <QuestionScreen
                key={currentQ.id}
                question={currentQ}
                index={qIndex}
                total={TOTAL}
                selectedValue={currentAns}
                onSelect={handleSelect}
                onPrev={handlePrev}
                onNext={handleNext}
                isFirst={qIndex === 0}
                isLast={qIndex === TOTAL - 1}
              />
            )}

            {evalStep === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProcessingScreen />
              </motion.div>
            )}

            {evalStep === "results" && computed && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ResultsScreen
                  scores={computed}
                  onDashboard={() => router.push("/dashboard")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
