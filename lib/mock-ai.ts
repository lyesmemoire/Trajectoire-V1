// lib/mock-ai.ts
// Moteur IA simulé 100% local — zéro API externe
// Utilisé quand APP_MODE=mock dans .env.local

// ── Latence simulée pour UX réaliste ─────────────────────

export function simulateDelay(ms = _1200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Score par mots-clés ──────────────────────────────────

function computeScore(cv: string, job: string): number {
  const jobWords = job
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 4);
  const cvLower = cv.toLowerCase();

  const unique = [...new Set(jobWords)];
  if (unique.length === 0) return 55;

  let matches = 0;
  unique.forEach((word) => {
    if (cvLower.includes(word)) matches++;
  });

  const rawScore = Math.round((matches / unique.length) * 100);
  // Clamp entre 35 et 92 pour éviter des scores irréalistes
  return Math.min(Math.max(rawScore, 35), 92);
}

// ── Mock ATS ─────────────────────────────────────────────

export async function mockATS(cv: string, job: string) {
  await simulateDelay(1500);

  const score = computeScore(cv, job);

  if (score >= 80) {
    return {
      score,
      matched_keywords: ["gestion de projet", "leadership", "agilité"],
      missing_keywords: ["résultats chiffrés", "spécifications techniques"],
      strengths: [
        "Bonne correspondance avec les compétences clés",
        "Profil aligné avec les exigences du poste",
        "Expérience pertinente détectée",
      ],
      weaknesses: ["Peut détailler davantage certains projets"],
      recommendations: [
        "Ajouter des résultats chiffrés",
        "Optimiser la formulation des compétences techniques",
      ],
    };
  }

  if (score >= 60) {
    return {
      score,
      matched_keywords: ["compétences de base", "collaboration"],
      missing_keywords: ["expertise technique avancée", "outils spécifiques"],
      strengths: [
        "Compétences partiellement alignées",
        "Base de profil pertinente",
      ],
      weaknesses: [
        "Certaines compétences clés absentes",
        "Expérience pas totalement adaptée au poste",
      ],
      recommendations: [
        "Ajouter les mots-clés stratégiques de l'offre",
        "Mettre en avant les compétences techniques pertinentes",
        "Reformuler l'expérience selon le poste visé",
      ],
    };
  }

  return {
    score,
    matched_keywords: [],
    missing_keywords: ["compétences principales du poste", "outils requis"],
    strengths: ["Base intéressante à développer"],
    weaknesses: [
      "Manque plusieurs compétences importantes",
      "Correspondance faible avec l'offre ciblée",
      "Structure du CV à retravailler",
    ],
    recommendations: [
      "Adapter le CV spécifiquement à l'offre",
      "Ajouter les compétences demandées",
      "Reformuler l'expérience professionnelle",
      "Utiliser le vocabulaire du secteur",
    ],
  };
}

// ── Mock Optimize ────────────────────────────────────────

export async function mockOptimize(cv: string, job: string) {
  await simulateDelay(1800);

  const score = computeScore(cv, job);

  return {
    improvedSummary:
      score >= 70
        ? "Professionnel expérimenté avec une expertise solide dans les domaines clés du poste. Résultats prouvés en gestion de projet et leadership d'équipe."
        : "Professionnel motivé avec des compétences transférables et une forte capacité d'adaptation. Cherche à apporter sa valeur ajoutée dans un environnement dynamique.",
    improvedBullets: [
      "Gestion de projets complexes avec des résultats mesurables (+25% de productivité)",
      "Maîtrise des outils et technologies clés du secteur",
      "Collaboration efficace avec les équipes pluridisciplinaires",
      "Capacité démontrée d'adaptation et d'apprentissage rapide",
    ],
    keywordsAdded: [
      "gestion de projet",
      "leadership",
      "résultats mesurables",
      "collaboration",
      "innovation",
    ],
    generalAdvice:
      "Concentrez-vous sur les résultats chiffrés et les compétences directement liées à l'offre. Utilisez le vocabulaire exact de l'annonce pour maximiser votre score ATS.",
  };
}

// ── Mock Interview Analyze ───────────────────────────────

export async function mockInterviewAnalyze(questions: string[], answers: string[], _jobTitle?: string, ) {
  await simulateDelay(2000);

  const avgLength =
    answers.reduce((sum, a) => sum + (a?.length || 0), 0) /
    Math.max(answers.length, 1);

  // Score basé sur la longueur et la complétude des réponses
  const baseScore = Math.min(Math.max(Math.round(avgLength / 3), 40), 90);

  const detailedFeedback = questions.map((q, i) => {
    const answer = answers[i] || "";
    const qScore = Math.min(Math.max(Math.round(answer.length / 2.5), 35), 95);
    return {
      question: q,
      score: qScore,
      comment:
        qScore >= 70
          ? "Réponse structurée et pertinente. Pensez à ajouter un exemple concret supplémentaire."
          : "Réponse à développer davantage. Utilisez la méthode STAR pour structurer votre argumentation.",
    };
  });

  const finalScore = Math.round(
    detailedFeedback.reduce((sum, f) => sum + f.score, 0) /
      Math.max(detailedFeedback.length, 1),
  );

  let level: string;
  if (finalScore >= 85) level = "Expert";
  else if (finalScore >= 70) level = "Confirmé";
  else if (finalScore >= 50) level = "Intermédiaire";
  else level = "Débutant";

  return {
    scores: {
      clarity: Math.min(finalScore + 5, 100),
      relevance: finalScore,
      confidence: Math.max(finalScore - 3, 30),
      structure: Math.min(finalScore + 2, 100),
      depth: Math.max(finalScore - 5, 30),
      finalScore,
    },
    strengths: [
      "Bonne articulation des idées",
      "Vocabulaire professionnel adapté",
      "Capacité à structurer ses réponses",
    ],
    improvements: [
      "Ajouter des exemples concrets chiffrés",
      "Approfondir les réponses techniques",
      "Utiliser la méthode STAR systématiquement",
    ],
    detailedFeedback,
    level,
    tips: [
      "Préparez 2-3 anecdotes professionnelles réutilisables",
      "Quantifiez vos résultats (%, €, délais)",
      "Entraînez-vous à voix haute avant l'entretien",
    ],
  };
}
