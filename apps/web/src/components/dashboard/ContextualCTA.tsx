"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ContextualCTAProps {
  scoreCV:    number | null;
  scoreATS:   number | null;
  scoreVocal: number | null;
  readiness:  number;
}

interface CTAConfig {
  title:    string;
  subtitle: string;
  href:     string;
  cta:      string;
  glow:     string; // tailwind shadow class
}

function resolveCTA(
  scoreCV:    number | null,
  scoreVocal: number | null,
  readiness:  number,
): CTAConfig {
  // Aucune donnée
  if (scoreCV === null && scoreVocal === null) {
    return {
      title:    "Commence par mesurer ton niveau réel.",
      subtitle: "Un audit CV prend 60 secondes. Le résultat peut tout changer.",
      href:     "/dashboard/cv",
      cta:      "Lancer mon audit CV",
      glow:     "shadow-indigo-900/40",
    };
  }

  // CV manquant
  if (scoreCV === null) {
    return {
      title:    "Ton CV n'a pas encore été audité.",
      subtitle: "Les recruteurs éliminent 80% des candidats avant l'entretien. Sais-tu où tu en es ?",
      href:     "/dashboard/cv",
      cta:      "Analyser mon CV maintenant",
      glow:     "shadow-indigo-900/40",
    };
  }

  // Vocal manquant
  if (scoreVocal === null) {
    return {
      title:    "Ton CV est analysé. Et ta voix ?",
      subtitle: "Un CV parfait ne compense pas une réponse hésitante. Teste ton entretien vocal.",
      href:     "/dashboard/interview/session",
      cta:      "Démarrer mon entretien vocal",
      glow:     "shadow-violet-900/40",
    };
  }

  // Score faible
  if (readiness < 50) {
    const weakest = (scoreCV ?? 100) <= (scoreVocal ?? 100) ? "cv" : "vocal";
    return weakest === "cv"
      ? {
          title:    "Ton CV freine ta candidature.",
          subtitle: `Score actuel : ${scoreCV}/100. Les recruteurs éliminent sous 70.`,
          href:     "/dashboard/cv",
          cta:      "Optimiser mon CV",
          glow:     "shadow-red-900/30",
        }
      : {
          title:    "Ton entretien vocal a besoin de travail.",
          subtitle: `Score actuel : ${scoreVocal}/100. Entraîne-toi avant le vrai entretien.`,
          href:     "/dashboard/interview/session",
          cta:      "Reprendre l'entraînement vocal",
          glow:     "shadow-orange-900/30",
        };
  }

  // Score moyen
  if (readiness < 80) {
    return {
      title:    "Tu progresses. Ne t'arrête pas là.",
      subtitle: "Les candidats qui s'entraînent jusqu'à 80+ ont 2x plus de retours positifs.",
      href:     "/dashboard/interview/session",
      cta:      "Continuer mon programme",
      glow:     "shadow-blue-900/40",
    };
  }

  // Score élevé
  return {
    title:    "Niveau solide. Place au Grand Jury.",
    subtitle: "Tu es prêt pour la simulation finale. C'est là que tout se joue.",
    href:     "/dashboard/interview/session",
    cta:      "Lancer ma simulation Grand Jury",
    glow:     "shadow-emerald-900/40",
  };
}

export function ContextualCTA({
  scoreCV, scoreATS, scoreVocal, readiness,
}: ContextualCTAProps) {
  const config = resolveCTA(scoreCV, scoreVocal, readiness);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.55 }}
      className={`rounded-2xl bg-slate-900 border border-white/8 p-8
                   shadow-2xl ${config.glow} flex flex-col md:flex-row
                   items-start md:items-center justify-between gap-6`}
    >
      <div className="flex-1">
        <p className="text-xl font-bold text-white mb-2">{config.title}</p>
        <p className="text-white/50 text-sm leading-relaxed">{config.subtitle}</p>
      </div>

      <Link
        href={config.href}
        className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5
                    bg-white text-slate-900 rounded-xl font-bold text-sm
                    hover:bg-white/90 transition-colors shadow-lg"
      >
        {config.cta}
        <ArrowRight size={15} />
      </Link>
    </motion.div>
  );
}
