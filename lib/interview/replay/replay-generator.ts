import {
  ReplayEvent,
  SessionReplay,
  ReplayEventType,
} from "../types/replay.types";

export function generateReplayFromSession(session: any): SessionReplay {
  const events: ReplayEvent[] = [];
  const pressureCurve: { time: number; level: number }[] = [];

  const answers = Array.isArray(session.answers) ? session.answers : [];
  const dbEvents = Array.isArray(session.events) ? session.events : [];

  // 1. Reconstruire la courbe de pression
  let currentTime = 0;
  answers.forEach((ans: any, idx: number) => {
    const duration = ans.duration || 60;
    pressureCurve.push({ time: currentTime, level: ans.pressureBefore || 50 });
    currentTime += duration;
    pressureCurve.push({ time: currentTime, level: ans.pressureAfter || 60 });

    // 2. Détecter les victoires (Strong Answers)
    if (ans.score >= 85) {
      events.push({
        id: `strong-${idx}`,
        timestamp: currentTime - duration / 2,
        type: "strong_answer",
        title: "Réponse d'Excellence",
        description: `Vous avez brillamment géré la question sur ${ans.category}.`,
        pressureLevel: ans.pressureAfter,
        coachingAdvice: "Continuez à utiliser cette structure précise (STAR).",
        originalText: ans.answer,
      });
    }

    // 3. Détecter les Recovery (si score remonte après une baisse)
    if (idx > 0 && ans.score > answers[idx - 1].score + 20) {
      events.push({
        id: `recovery-${idx}`,
        timestamp: currentTime - duration / 2,
        type: "recovery",
        title: "Excellente Reprise",
        description:
          "Vous avez repris le contrôle après une question difficile.",
        pressureLevel: ans.pressureAfter,
        coachingAdvice:
          "Votre capacité à rebondir est un signal fort de leadership.",
      });
    }
  });

  // 4. Intégrer les événements d'interruption de la DB
  dbEvents.forEach((evt: any, i: number) => {
    const type = evt.type.startsWith("interruption")
      ? "interruption"
      : "pressure_peak";
    events.push({
      id: evt.id,
      timestamp: 30 + i * 120, // Approximation si pas de timestamp précis
      type: type as ReplayEventType,
      title: evt.type.includes("skeptical")
        ? "Scepticisme du Recruteur"
        : "Interruption Stratégique",
      description: "L'IA vous a coupé pour tester votre précision.",
      pressureLevel: evt.impactScore || 70,
      coachingAdvice: "Soyez plus factuel pour éviter ces interruptions.",
    });
  });

  return {
    sessionId: session.id,
    events: events.sort((a, b) => a.timestamp - b.timestamp),
    pressureCurve,
    archetype: computeArchetype(answers),
    overallCoaching:
      "Votre performance montre une bonne maîtrise technique mais une fragilité sous pression intense.",
  };
}

function computeArchetype(answers: any[]): string {
  const avgConfidence =
    answers.reduce((s, a) => s + (a.confidence || 50), 0) / answers.length;
  if (avgConfidence > 80) return "Confident Performer";
  if (avgConfidence < 40) return "Stress Reactive";
  return "Analytical Thinker";
}
