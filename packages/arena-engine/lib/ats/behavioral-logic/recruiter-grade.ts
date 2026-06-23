import { mistralModel } from "@/lib/mistral";
import { generateObject } from "ai";
import { z } from "zod";
import { PressureMunition, PressureMunitionSchema } from "../contracts/munitions";

/**
 * 👔 Layer 1: Hiring Manager Mode
 * Analyzes architectural decision-making and ownership.
 */
export async function analyzeTechnicalLeadership(
  cvText: string,
): Promise<PressureMunition[]> {
  const PROMPT = `Tu es un CTO / Engineering Manager. 
  Analyse si le CV montre de l'autonomie et des décisions d'architecture, ou si ce sont des "vague claims" sans preuves.
  
  RÈGLES:
  1. Identifie 1 à 3 éléments liés au leadership technique.
  2. La catégorie doit être "vague_claim" si le candidat n'a pas de preuve chiffrée ou technique, sinon "doubt".
  3. Fournis une citation exacte du CV ("snippet").
  
  CV: ${cvText}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { object } = await generateObject({
        model: mistralModel,
        temperature: 0.2,
        schema: z.object({
          leadershipSignals: z.array(PressureMunitionSchema),
        }),
        system: "Tu es un évaluateur de leadership technique strict. Respecte le format JSON.",
        prompt: PROMPT,
      });
      return object.leadershipSignals;
    } catch (error) {
      if (attempt === 2) {
        console.error("[Recruiter Grade] Leadership analysis failed after retry", error);
        return [];
      }
    }
  }
  return [];
}

/**
 * ⚖️ Layer 2: Consistency Engine
 * Detects mismatches between claims and seniority.
 */
export function detectInconsistencies(cv: any, job: any): PressureMunition[] {
  const issues: PressureMunition[] = [];
  
  if (cv.years_experience < job.min_years) {
    issues.push({
      id: `inc_seniority_${Date.now()}`,
      category: "inconsistency",
      hook: "J'ai remarqué un décalage entre les années d'expérience demandées et votre parcours...",
      evidence: {
        field: "Années d'expérience globales",
        snippet: `L'offre demande ${job.min_years} ans, le profil en affiche ${cv.years_experience}.`
      },
      severity: 0.8,
      pressureReady: true,
      confidence: 1.0,
      suggestedQuestion: `L'offre demande ${job.min_years} ans d'expérience, et vous semblez en avoir ${cv.years_experience}. Comment compensez-vous ce manque d'expérience face à des profils plus seniors ?`
    });
  }
  
  return issues;
}

/**
 * ⚠️ Layer 3: Interview Risk Prediction
 */
export function predictInterviewRisks(weaknesses: PressureMunition[]): PressureMunition[] {
  // Translate the provided doubts/weaknesses into actionable interview risks
  return weaknesses.map((w, index) => ({
    id: `risk_${Date.now()}_${index}`,
    category: "risk",
    hook: "Il y a un point spécifique sur lequel les recruteurs techniques vont sûrement vous challenger...",
    evidence: w.evidence,
    severity: w.severity,
    pressureReady: true,
    confidence: w.confidence,
    suggestedQuestion: w.suggestedQuestion || `Préparez-vous à être challengé sur ce point : ${w.evidence.snippet}. Quelle sera votre ligne de défense ?`
  }));
}
