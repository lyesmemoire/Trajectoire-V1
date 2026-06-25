"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SITE_NAME } from "@/lib/constants";
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@/hooks/useUser";
import { createLogger } from "@/lib/logger";
import type { SimulationType } from "@/types/database";

const logger = createLogger({ component: "dashboard-simulation" });

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
type SimStep =
  | "selection"
  | "briefing"
  | "simulation"
  | "processing"
  | "results";

interface SimScenario {
  id:          SimulationType;
  label:       string;
  description: string;
  icon:        string;
  duration:    string;
  difficulty:  "Accessible" | "Intermédiaire" | "Avancé";
  tags:        string[];
  context:     string;
  questions:   SimQuestion[];
}

interface SimQuestion {
  id:     string;
  text:   string;
  hint:   string;
  timeS:  number;   /* thinking time in seconds */
}

interface SimAnswer {
  questionId: string;
  text:       string;
  timeSpentS: number;
}

interface DimScore {
  dimension: string;
  score:     number;
  feedback:  string;
}

/* ─────────────────────────────────────────────────────────
   Scenarios bank
───────────────────────────────────────────────────────── */
const SCENARIOS: SimScenario[] = [
  {
    id:          "interview",
    label:       "Entretien de promotion",
    description: "Simulez un entretien devant un jury RH pour une promotion interne.",
    icon:        "💼",
    duration:    "20 min",
    difficulty:  "Intermédiaire",
    tags:        ["Promotion", "RH", "Leadership"],
    context:
      "Vous postulez à un poste de Directeur(rice) au sein de votre organisation. Le jury est composé de votre DRH et du directeur de votre département. L'entretien dure environ 20 minutes.",
    questions: [
      {
        id: "I1",
        text: "Présentez-vous en 2 minutes en vous concentrant sur ce qui vous distingue pour ce poste.",
        hint: "Structurez votre présentation : parcours → réalisations → valeur ajoutée pour ce rôle.",
        timeS: 120,
      },
      {
        id: "I2",
        text: "Quelle est votre plus grande réussite managériale des 18 derniers mois et pourquoi ?",
        hint: "Méthode STAR : Situation, Tâche, Action, Résultat. Quantifiez si possible.",
        timeS: 90,
      },
      {
        id: "I3",
        text: "Comment gérez-vous un collaborateur dont les résultats se dégradent malgré vos interventions ?",
        hint: "Montrez votre capacité à diagnostiquer, à accompagner, et à prendre des décisions difficiles.",
        timeS: 90,
      },
      {
        id: "I4",
        text: "Quels sont vos trois axes de développement prioritaires pour ce nouveau rôle ?",
        hint: "Soyez honnête sur vos lacunes tout en montrant votre plan d'action concret.",
        timeS: 75,
      },
      {
        id: "I5",
        text: "Où vous voyez-vous dans 3 ans si vous obtenez ce poste ?",
        hint: "Alignez votre vision personnelle avec les enjeux stratégiques de l'organisation.",
        timeS: 60,
      },
    ],
  },
  {
    id:          "presentation",
    label:       "Présentation stratégique",
    description: "Défendez un projet ou une décision devant un comité de direction.",
    icon:        "📊",
    duration:    "15 min",
    difficulty:  "Avancé",
    tags:        ["CODIR", "Stratégie", "Conviction"],
    context:
      "Vous présentez un projet de transformation organisationnelle devant le Comité de Direction. Vous disposez de 10 minutes de présentation suivies de questions critiques. L'enjeu est élevé : le budget est de 2M€.",
    questions: [
      {
        id: "P1",
        text: "En une phrase, quel est le problème que votre projet résout et pourquoi il est urgent ?",
        hint: "Commencez par le problème, pas par la solution. La clarté est votre meilleure alliée.",
        timeS: 60,
      },
      {
        id: "P2",
        text: "Un membre du CODIR conteste votre ROI : 'Ces chiffres sont trop optimistes.' Comment répondez-vous ?",
        hint: "Ne défendez pas les chiffres — défendez la méthode. Proposez des hypothèses alternatives.",
        timeS: 90,
      },
      {
        id: "P3",
        text: "Votre projet implique des suppressions de poste. Comment le présentez-vous humainement ?",
        hint: "Nommez la réalité directement. Présentez le plan d'accompagnement avant les chiffres.",
        timeS: 90,
      },
      {
        id: "P4",
        text: "Quel est votre plan B si le budget est réduit de 40% ?",
        hint: "Montrez que vous avez anticipé. Priorisez les quick-wins et les phases critiques.",
        timeS: 75,
      },
    ],
  },
  {
    id:          "negotiation",
    label:       "Négociation salariale",
    description: "Préparez et menez une négociation de rémunération avec votre employeur.",
    icon:        "🤝",
    duration:    "15 min",
    difficulty:  "Intermédiaire",
    tags:        ["Salaire", "Assertivité", "Tactique"],
    context:
      "Vous demandez une augmentation après 18 mois sans revalorisation. Votre marché est en tension et vous avez reçu une offre externe à +25%. Votre manager apprécie votre travail mais les budgets sont contraints.",
    questions: [
      {
        id: "N1",
        text: "Comment ouvrez-vous la négociation ? Quel chiffre annoncez-vous en premier ?",
        hint: "Ancrez haut. Celui qui annonce un chiffre en premier cadre la négociation.",
        timeS: 60,
      },
      {
        id: "N2",
        text: "Votre manager répond : 'Je comprends, mais le budget est bloqué jusqu'en janvier.' Comment réagissez-vous ?",
        hint: "Reformulez : est-ce un refus ou un report ? Explorez les contreparties non-financières.",
        timeS: 75,
      },
      {
        id: "N3",
        text: "Votre manager vous demande de lui montrer votre offre externe. Que faites-vous ?",
        hint: "Vous n'êtes jamais obligé de montrer le document. La preuve peut être verbale.",
        timeS: 60,
      },
      {
        id: "N4",
        text: "La négociation aboutit à +8% au lieu des +20% demandés. Comment clôturez-vous ?",
        hint: "Obtenez quelque chose de supplémentaire (formation, titre, clause de revue). Ne partez jamais les mains vides.",
        timeS: 60,
      },
    ],
  },
  {
    id:          "feedback",
    label:       "Feedback difficile",
    description: "Donnez un feedback négatif constructif à un collaborateur en difficulté.",
    icon:        "💬",
    duration:    "10 min",
    difficulty:  "Accessible",
    tags:        ["Management", "Feedback", "Empathie"],
    context:
      "Thomas, 34 ans, senior dans votre équipe, a raté 3 livrables consécutifs et ses collègues se plaignent de son attitude défensive. Vous avez un entretien individuel de 30 minutes pour aborder la situation.",
    questions: [
      {
        id: "F1",
        text: "Comment ouvrez-vous cet entretien ? Quelle est votre première phrase ?",
        hint: "Commencez par créer un espace de sécurité. Pas d'accusation en ouverture.",
        timeS: 60,
      },
      {
        id: "F2",
        text: "Thomas répond : 'Je n'ai pas raté les livrables — c'est l'équipe qui ne m'a pas fourni les infos à temps.' Comment gérez-vous ce déni ?",
        hint: "Ne vous défendez pas, ne défendez pas l'équipe. Recentrez sur les faits observables.",
        timeS: 75,
      },
      {
        id: "F3",
        text: "Thomas se met à pleurer. Il dit se sentir incompris depuis 6 mois. Que faites-vous ?",
        hint: "Pause. Accueillez l'émotion sans la gérer à sa place. L'écoute active d'abord.",
        timeS: 60,
      },
      {
        id: "F4",
        text: "Comment clôturez-vous cet entretien avec un plan concret et accepté par Thomas ?",
        hint: "Co-construisez le plan avec Thomas — pas pour Thomas. L'engagement vient de l'appropriation.",
        timeS: 60,
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function difficultyColor(d: SimScenario["difficulty"]): string {
  return d === "Accessible"
    ? "var(--success)"
    : d === "Intermédiaire"
    ? "var(--warning)"
    : "var(--accent)";
}

function scoreFromAnswers(answers: SimAnswer[]): number {
  if (answers.length === 0) return 0;
  const avgLen   = answers.reduce((s, a) => s + a.text.length, 0) / answers.length;
  const avgTime  = answers.reduce((s, a) => s + a.timeSpentS, 0) / answers.length;
  const lenScore = Math.min(100, (avgLen / 300) * 100);
  const timeScore = Math.min(100, (avgTime / 45) * 100);
  return Math.round((lenScore * 0.6 + timeScore * 0.4));
}

function buildDimScores(
  scenario: SimScenario,
  answers: SimAnswer[]
): DimScore[] {
  const score = scoreFromAnswers(answers);

  const maps: Record<SimulationType, DimScore[]> = {
    interview: [
      { dimension: "Structure du discours", score: Math.min(100, score + 5),  feedback: "Votre capacité à structurer vos réponses est un indicateur fort de clarté mentale." },
      { dimension: "Assertivité",           score: Math.min(100, score - 5),  feedback: "Travaillez à affirmer vos positions sans les atténuer systématiquement." },
      { dimension: "Vision stratégique",    score: Math.min(100, score + 10), feedback: "Votre projection à moyen terme est cohérente avec les enjeux du poste." },
      { dimension: "Gestion du silence",   score: Math.max(30, score - 15),  feedback: "Les silences sont des outils de négociation — apprenez à les habiter." },
    ],
    presentation: [
      { dimension: "Clarté du message",    score: Math.min(100, score + 8),  feedback: "Votre capacité à synthétiser est un atout majeur en CODIR." },
      { dimension: "Gestion des objections", score: Math.min(100, score - 3), feedback: "Face aux contre-arguments, maintenez le cap sur les données." },
      { dimension: "Impact émotionnel",    score: Math.max(40, score - 10), feedback: "Les données seules ne suffisent pas — renforcez le storytelling." },
      { dimension: "Préparation du terrain", score: Math.min(100, score + 5), feedback: "Anticipez les objections en amont plutôt qu'en séance." },
    ],
    negotiation: [
      { dimension: "Ancrage initial",      score: Math.min(100, score + 12), feedback: "Vous avez bien compris que celui qui parle en premier cadre la négociation." },
      { dimension: "Résilience tactique",  score: Math.min(100, score - 8),  feedback: "Face à la pression, vous avez tendance à concéder trop tôt." },
      { dimension: "Écoute active",        score: Math.min(100, score + 3),  feedback: "Votre capacité d'écoute est un atout dans les moments de tension." },
      { dimension: "Clôture",              score: Math.max(50, score - 5),  feedback: "Entraînez-vous à toujours obtenir quelque chose avant de clore." },
    ],
    feedback: [
      { dimension: "Ouverture sécurisante", score: Math.min(100, score + 10), feedback: "Créer un espace de sécurité est la compétence la plus rare en feedback." },
      { dimension: "Gestion des émotions", score: Math.min(100, score + 5),  feedback: "Vous accueillez l'émotion sans vous en protéger — c'est mature." },
      { dimension: "Factualité",           score: Math.max(45, score - 12), feedback: "Restez ancrés dans les faits observables, pas dans les jugements." },
      { dimension: "Co-construction",      score: Math.min(100, score - 3),  feedback: "Impliquez davantage le collaborateur dans l'élaboration du plan." },
    ],
  };

  return maps[scenario.id] ?? [];
}

/* ─────────────────────────────────────────────────────────
   Selection screen
───────────────────────────────────────────────────────── */
function SelectionScreen({
  onSelect,
}: {
  onSelect: (s: SimScenario) => void;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      <motion.div variants={fadeInUp} className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
          aria-hidden="true"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 14l9 5 11-9" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="14" r="12" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
        </div>
        <h1 className="heading-2 mb-3" style={{ color: "var(--text)" }}>
          Choisissez votre simulation
        </h1>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          Chaque scénario est calibré pour un moment professionnel à fort enjeu.
          Répondez librement — il n&apos;y a pas de bonne ou mauvaise réponse.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SCENARIOS.map((scenario) => (
          <motion.button
            key={scenario.id}
            variants={fadeInUp}
            type="button"
            onClick={() => onSelect(scenario)}
            className="flex flex-col items-start gap-4 p-6 rounded-2xl border text-left transition-all duration-200"
            style={{ borderColor: "var(--border)", backgroundColor: "white" }}
            whileHover={{
              y: -4,
              boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
              borderColor: "rgba(26,60,52,0.3)",
              transition: { duration: 0.25 },
            }}
            aria-label={`Choisir la simulation : ${scenario.label}`}
          >
            {/* Icon + difficulty */}
            <div className="flex items-center justify-between w-full">
              <span className="text-3xl" aria-hidden="true">{scenario.icon}</span>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${difficultyColor(scenario.difficulty)}15`,
                  color: difficultyColor(scenario.difficulty),
                }}
              >
                {scenario.difficulty}
              </span>
            </div>

            {/* Title + description */}
            <div>
              <h2 className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>
                {scenario.label}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {scenario.description}
              </p>
            </div>

            {/* Tags + duration */}
            <div className="flex flex-wrap gap-1.5 w-full">
              {scenario.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(26,60,52,0.08)",
                    color: "var(--primary)",
                  }}
                >
                  {tag}
                </span>
              ))}
              <span className="ml-auto text-xs font-medium" style={{ color: "var(--muted)" }}>
                ⏱ {scenario.duration}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Briefing screen
───────────────────────────────────────────────────────── */
function BriefingScreen({
  scenario,
  onStart,
  onBack,
}: {
  scenario: SimScenario;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Changer de scénario
        </button>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl" aria-hidden="true">{scenario.icon}</span>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              {scenario.label}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${difficultyColor(scenario.difficulty)}15`,
                  color: difficultyColor(scenario.difficulty),
                }}
              >
                {scenario.difficulty}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {scenario.questions.length} questions · {scenario.duration}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Context */}
      <motion.div
        variants={fadeInUp}
        className="p-6 rounded-2xl border-l-4"
        style={{
          backgroundColor: "rgba(26,60,52,0.04)",
          borderLeftColor: "var(--primary)",
          border: "1px solid rgba(26,60,52,0.12)",
          borderLeft: "4px solid var(--primary)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--primary)" }}>
          Contexte de la simulation
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>
          {scenario.context}
        </p>
      </motion.div>

      {/* Questions preview */}
      <motion.div variants={fadeInUp} className="space-y-3">
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Questions au programme :
        </p>
        {scenario.questions.map((q, i) => (
          <div
            key={q.id}
            className="flex items-start gap-3 p-4 rounded-xl border"
            style={{ borderColor: "var(--border)", backgroundColor: "white" }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ backgroundColor: "rgba(26,60,52,0.1)", color: "var(--primary)" }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <p className="text-sm leading-snug" style={{ color: "var(--text)" }}>
              {q.text}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Tips */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          { icon: "✍️", tip: "Rédigez comme si vous parliez réellement." },
          { icon: "⏱",  tip: "Prenez le temps de réfléchir avant d'écrire." },
          { icon: "🎯", tip: "Soyez précis et concret dans vos réponses." },
        ].map((item) => (
          <div
            key={item.tip}
            className="flex items-start gap-2.5 p-3.5 rounded-xl"
            style={{ backgroundColor: "rgba(248,245,240,0.8)", border: "1px solid var(--border)" }}
          >
            <span className="text-lg flex-shrink-0" aria-hidden="true">{item.icon}</span>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{item.tip}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div variants={fadeInUp}>
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200"
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
          Lancer la simulation
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Timer hook
───────────────────────────────────────────────────────── */
function useTimer(initialS: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(initialS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const start = useCallback(() => {
    setRemaining(initialS);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialS]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback((s: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(s);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return { remaining, start, stop, reset };
}

/* ─────────────────────────────────────────────────────────
   Simulation screen
───────────────────────────────────────────────────────── */
function SimulationScreen({
  scenario,
  onComplete,
}: {
  scenario:   SimScenario;
  onComplete: (answers: SimAnswer[]) => void;
}) {
  const [qIndex,    setQIndex]    = useState(0);
  const [answers,   setAnswers]   = useState<SimAnswer[]>([]);
  const [text,      setText]      = useState("");
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showHint,  setShowHint]  = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQ  = scenario.questions[qIndex];
  const totalQ    = scenario.questions.length;
  const isLast    = qIndex === totalQ - 1;

  const handleExpire = useCallback(() => {
    /* Auto-submit on timer expiry */
    const spent = Math.round((Date.now() - startTime) / 1000);
    const ans: SimAnswer = {
      questionId: currentQ.id,
      text:       text.trim() || "[Temps écoulé]",
      timeSpentS: spent,
    };
    const updated = [...answers, ans];
    if (isLast) {
      onComplete(updated);
    } else {
      setAnswers(updated);
      setQIndex((i) => i + 1);
      setText("");
      setShowHint(false);
      setStartTime(Date.now());
    }
  }, [text, startTime, currentQ, answers, isLast, onComplete]);

  const { remaining, start, stop, reset } = useTimer(currentQ.timeS, handleExpire);

  /* Start timer on mount and on question change */
  useEffect(() => {
    reset(currentQ.timeS);
    start();
    setStartTime(Date.now());
    textareaRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex]);

  const handleSubmit = useCallback(() => {
    stop();
    const spent = Math.round((Date.now() - startTime) / 1000);
    const ans: SimAnswer = {
      questionId: currentQ.id,
      text:       text.trim(),
      timeSpentS: spent,
    };
    const updated = [...answers, ans];
    if (isLast) {
      onComplete(updated);
    } else {
      setAnswers(updated);
      setQIndex((i) => i + 1);
      setText("");
      setShowHint(false);
      setStartTime(Date.now());
    }
  }, [stop, startTime, currentQ, text, answers, isLast, onComplete]);

  const urgentSeconds = Math.floor(currentQ.timeS * 0.25);
  const isUrgent      = remaining <= urgentSeconds;
  const pctTime       = remaining / currentQ.timeS;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header — question progress + timer */}
      <div className="flex items-center justify-between gap-4">
        {/* Question progress */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
            <span>Question {qIndex + 1} sur {totalQ}</span>
            <span>{Math.round(((qIndex) / totalQ) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
              animate={{ width: `${(qIndex / totalQ) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Countdown timer */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold tabular-nums transition-all duration-500"
          style={{
            borderColor:     isUrgent ? "rgba(232,80,26,0.4)" : "var(--border)",
            backgroundColor: isUrgent ? "rgba(232,80,26,0.06)" : "white",
            color:           isUrgent ? "var(--accent)" : "var(--text)",
          }}
          aria-live="polite"
          aria-label={`Temps restant : ${formatTime(remaining)}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {formatTime(remaining)}
          {isUrgent && <span className="animate-pulse">⚡</span>}
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
        <motion.div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            backgroundColor: isUrgent ? "var(--accent)" : "var(--primary)",
            width: `${pctTime * 100}%`,
          }}
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl border p-8"
          style={{ borderColor: "var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
        >
          {/* Scenario badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl" aria-hidden="true">{scenario.icon}</span>
            <span
              className="text-xs font-medium px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(26,60,52,0.08)", color: "var(--primary)" }}
            >
              {scenario.label}
            </span>
          </div>

          {/* Question text */}
          <h2
            className="text-lg font-semibold leading-snug mb-6"
            style={{ color: "var(--text)" }}
            id={`sim-q-${currentQ.id}`}
          >
            {currentQ.text}
          </h2>

          {/* Hint toggle */}
          <button
            type="button"
            onClick={() => setShowHint((p) => !p)}
            className="flex items-center gap-2 text-xs font-medium mb-4 transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
            aria-expanded={showHint}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 5v.01M7 7.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {showHint ? "Masquer" : "Voir"} le conseil
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="p-4 rounded-xl mb-4 border-l-2 text-sm"
                  style={{
                    backgroundColor: "rgba(26,60,52,0.04)",
                    borderLeftColor: "var(--primary)",
                    color: "var(--muted)",
                  }}
                >
                  💡 {currentQ.hint}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Rédigez votre réponse ici…"
              rows={6}
              className="w-full px-4 py-4 rounded-xl text-base outline-none resize-none transition-all duration-200"
              style={{
                backgroundColor: "var(--background)",
                border:          "1px solid var(--border)",
                color:           "var(--text)",
                lineHeight:      "1.7",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(26,60,52,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow   = "none";
              }}
              aria-labelledby={`sim-q-${currentQ.id}`}
              aria-required="true"
            />
            {/* Char count */}
            <span
              className="absolute bottom-3 right-4 text-xs tabular-nums"
              style={{ color: "var(--muted)" }}
              aria-live="polite"
              aria-label={`${text.length} caractères`}
            >
              {text.length}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          backgroundColor: text.trim() ? "var(--primary)" : "rgba(26,60,52,0.3)",
          color:           "white",
          cursor:          text.trim() ? "pointer" : "not-allowed",
        }}
        onMouseEnter={(e) => {
          if (text.trim()) {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "var(--primary-hover)";
            el.style.transform       = "translateY(-1px)";
            el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.backgroundColor = text.trim() ? "var(--primary)" : "rgba(26,60,52,0.3)";
          el.style.transform       = "translateY(0)";
          el.style.boxShadow       = "none";
        }}
        aria-label={isLast ? "Terminer la simulation" : "Passer à la question suivante"}
      >
        {isLast ? (
          <>
            Terminer la simulation
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 8h8M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        ) : (
          <>
            Question suivante
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Processing screen
───────────────────────────────────────────────────────── */
function ProcessingScreen({ scenario }: { scenario: SimScenario }) {
  const steps = [
    "Analyse de vos réponses…",
    "Évaluation de la structure du discours…",
    "Mesure de l'assertivité et de la précision…",
    "Comparaison avec les profils de référence…",
    "Génération de votre feedback personnalisé…",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto text-center space-y-8"
    >
      <div className="flex justify-center" aria-hidden="true">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray="50 150" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">{scenario.icon}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Analyse de votre simulation…
        </h2>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          Votre feedback personnalisé est en cours de génération.
        </p>
      </div>

      <div className="space-y-2 text-left">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 text-sm"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5, duration: 0.4 }}
            style={{ color: "var(--muted)" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.5 + 0.2 }}
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
  scenario,
  answers,
  dimScores,
  globalScore,
  onRestart,
  onDashboard,
}: {
  scenario:    SimScenario;
  answers:     SimAnswer[];
  dimScores:   DimScore[];
  globalScore: number;
  onRestart:   () => void;
  onDashboard: () => void;
}) {
  const avgTime = Math.round(answers.reduce((s, a) => s + a.timeSpentS, 0) / answers.length);
  const level   = globalScore >= 75 ? "Excellent" : globalScore >= 55 ? "Bon" : "En progression";
  const levelColor =
    globalScore >= 75 ? "var(--success)" :
    globalScore >= 55 ? "var(--warning)" :
    "var(--accent)";

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
          Simulation terminée.
        </h2>
        <p className="text-base" style={{ color: "var(--muted)" }}>
          {scenario.label} · {answers.length} questions · {Math.round(answers.reduce((s, a) => s + a.timeSpentS, 0) / 60)} min
        </p>
      </motion.div>

      {/* Global score */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl border p-8 flex flex-col sm:flex-row items-center gap-8"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Ring */}
        <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
          <svg width="120" height="120" className="-rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10" />
            <motion.circle
              cx="60" cy="60" r="50"
              fill="none" stroke={levelColor} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={Math.PI * 100}
              initial={{ strokeDashoffset: Math.PI * 100 }}
              animate={{ strokeDashoffset: Math.PI * 100 * (1 - globalScore / 100) }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold"
              style={{ color: "var(--text)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {globalScore}
            </motion.span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>/100</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3 w-full">
          <div>
            <span
              className="text-sm font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: `${levelColor}15`, color: levelColor }}
            >
              {level}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Questions répondues", value: `${answers.length}/${scenario.questions.length}` },
              { label: "Temps moyen / réponse", value: `${avgTime}s` },
              { label: "Réponses complètes", value: `${answers.filter((a) => a.text.length > 80).length}/${answers.length}` },
              { label: "Scénario", value: scenario.label },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{stat.label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dimension feedback */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl border p-8"
        style={{ borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-6 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Feedback par compétence
        </h3>
        <div className="space-y-6">
          {dimScores.map((ds) => {
            const color =
              ds.score >= 75 ? "var(--success)" :
              ds.score >= 55 ? "var(--warning)" :
              "var(--accent)";
            return (
              <div key={ds.dimension}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{ds.dimension}</p>
                  <span className="text-sm font-bold" style={{ color }}>{ds.score}/100</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "var(--border)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${ds.score}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {ds.feedback}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Answer review */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl border p-8"
        style={{ borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-6 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Revue de vos réponses
        </h3>
        <div className="space-y-6">
          {scenario.questions.map((q, i) => {
            const ans = answers.find((a) => a.questionId === q.id);
            return (
              <div key={q.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(26,60,52,0.1)", color: "var(--primary)" }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{q.text}</p>
                </div>
                {ans ? (
                  <div
                    className="ml-9 p-4 rounded-xl text-sm leading-relaxed"
                    style={{ backgroundColor: "rgba(248,245,240,0.6)", color: "var(--text)", border: "1px solid var(--border)" }}
                  >
                    {ans.text}
                    <span className="block mt-2 text-xs" style={{ color: "var(--muted)" }}>
                      ⏱ {ans.timeSpentS}s · {ans.text.length} caractères
                    </span>
                  </div>
                ) : (
                  <p className="ml-9 text-xs italic" style={{ color: "var(--muted)" }}>
                    [Pas de réponse enregistrée]
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onDashboard}
          className="flex-1 py-4 rounded-xl font-semibold text-base transition-all duration-200"
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
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 py-4 rounded-xl font-semibold text-base border transition-all duration-200"
          style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "white" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
        >
          Nouvelle simulation
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function SimulationPage() {
  const router   = useRouter();
  const supabase = useSupabase();
  const { user } = useUser();

  const [step,        setStep]        = useState<SimStep>("selection");
  const [scenario,    setScenario]    = useState<SimScenario | null>(null);
  const [answers,     setAnswers]     = useState<SimAnswer[]>([]);
  const [dimScores,   setDimScores]   = useState<DimScore[]>([]);
  const [globalScore, setGlobalScore] = useState(0);
  const [saveError,   setSaveError]   = useState<string | null>(null);

  const handleSelectScenario = useCallback((s: SimScenario) => {
    setScenario(s);
    setStep("briefing");
  }, []);

  const handleComplete = useCallback(async (finalAnswers: SimAnswer[]) => {
    if (!scenario) return;
    setAnswers(finalAnswers);
    setStep("processing");

    const gScore = scoreFromAnswers(finalAnswers);
    const dScores = buildDimScores(scenario, finalAnswers);

    setGlobalScore(gScore);
    setDimScores(dScores);

    if (user) {
      try {
        const totalDurationS = finalAnswers.reduce((sum, a) => sum + a.timeSpentS, 0);

        const { error } = await (supabase as any).from("simulations").insert({
          user_id:      user.id,
          type:         scenario.id as any,
          score:        gScore,
          feedback:     JSON.stringify(dScores),
          duration_sec: totalDurationS,
          completed_at: new Date().toISOString(),
        });

        if (error) {
          throw error;
        }
      } catch (err) {
        logger.error({ error: err }, "Erreur sauvegarde simulation");
        setSaveError("Vos résultats ont été calculés mais n'ont pas pu être sauvegardés.");
      }
    }

    await new Promise((r) => setTimeout(r, 3000));
    setStep("results");
  }, [scenario, user, supabase]);

  const handleRestart = useCallback(() => {
    setScenario(null);
    setAnswers([]);
    setGlobalScore(0);
    setDimScores([]);
    setSaveError(null);
    setStep("selection");
  }, []);

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

        <span className="text-base font-bold" style={{ color: "var(--text)" }}>
          {SITE_NAME}
        </span>

        <div className="w-16" aria-hidden="true" />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
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
            {step === "selection" && (
              <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SelectionScreen onSelect={handleSelectScenario} />
              </motion.div>
            )}

            {step === "briefing" && scenario && (
              <motion.div key="briefing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BriefingScreen
                  scenario={scenario}
                  onStart={() => setStep("simulation")}
                  onBack={handleRestart}
                />
              </motion.div>
            )}

            {step === "simulation" && scenario && (
              <motion.div key="simulation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SimulationScreen scenario={scenario} onComplete={handleComplete} />
              </motion.div>
            )}

            {step === "processing" && scenario && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProcessingScreen scenario={scenario} />
              </motion.div>
            )}

            {step === "results" && scenario && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResultsScreen
                  scenario={scenario}
                  answers={answers}
                  dimScores={dimScores}
                  globalScore={globalScore}
                  onRestart={handleRestart}
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
