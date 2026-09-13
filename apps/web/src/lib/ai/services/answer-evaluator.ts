import AIClient from "../client";
import { AI_MODELS } from "../models";
import { RetryManager } from "../retry/RetryManager";
import { ExternalServiceError } from "@/core/errors";
import type { UnifiedInterviewContext } from "@/application/interview-context/UnifiedInterviewContextService";
import { AnswerEvaluationSchema, type AnswerEvaluation } from "../schemas/answer-evaluation.schema";
import type { CandidateClaim, ClaimConflict } from "../schemas/interview-state.schema";

export interface EvaluateAnswerInput {
  currentQuestion: string;
  candidateAnswer: string;
  targetCompetency: string | null;
  unifiedContext?: UnifiedInterviewContext | null;
  existingClaims?: CandidateClaim[];
  openConflicts?: ClaimConflict[];
  signal?: AbortSignal;
}

const EVALUATION_SYSTEM_PROMPT = `Tu es un recruteur expert chargé d'évaluer la réponse d'un candidat de manière rigoureuse.
Ton objectif est de chercher des PREUVES concrètes (exemples, rôle personnel, métriques, résultats) et d'identifier ce qui manque pour évaluer pleinement la compétence ciblée.

RÈGLES D'ÉVALUATION :
1. Recherche des situations réelles ("J'ai fait X" et non "Je fais en général X").
2. Différencie le "Je" du "Nous" (Rôle personnel vs équipe).
3. Valorise les chiffres, métriques et ordres de grandeur.
4. Identifie si le candidat élude la question (isEvasive) ou répond de manière trop abstraite (isVague).
5. Une réponse courte (< 80 caractères) manque souvent de substance (isTooShort).

DÉCISION DE RELANCE (recommendedAction) :
- "NEXT_QUESTION" : La réponse fournit suffisamment de preuves pour évaluer la compétence. Le recruteur peut passer à un autre sujet.
- "FOLLOW_UP" : Il manque des éléments essentiels (exemple concret, rôle, résultat). Le recruteur DOIT creuser.

TYPE DE RELANCE (followUpType) - Si FOLLOW_UP :
- "CLARIFY" : Réponse incompréhensible, hors sujet ou trop vague.
- "ASK_EXAMPLE" : Affirmation sans preuve concrète ni situation réelle.
- "ASK_PERSONAL_ROLE" : Exemple donné, mais on ne sait pas ce que le candidat a personnellement fait.
- "ASK_METRIC" : Résultat donné mais non quantifié (pas d'ordre de grandeur).
- "ASK_RESULT" : Action détaillée, mais la fin/le résultat est manquant.
- "DEEPEN" : Réponse solide, mais on veut tester la profondeur technique ou stratégique.

EXTRACTION DES AFFIRMATIONS FACTUELLES (extractedClaims) :
Extrais les affirmations factuelles importantes énoncées par le candidat (ex: entreprise, poste, taille d'équipe, durée, métriques, réalisations techniques).
Règles strictes d'extraction :
- N'extrais QUE ce qui est explicitement affirmé. N'invente pas.
- "statement" doit être une courte phrase descriptive (ex: "A dirigé une équipe de 8 développeurs").
- "value" est la valeur brute (ex: "8").
- "key" est un identifiant court (ex: "team_size").
- Si aucun fait pertinent n'est présent, renvoie une liste vide [].

DÉTECTION DE CONTRADICTIONS (claimConflicts) :
Compare les NOUVELLES affirmations extraites avec les faits précédents fournis.
S'il y a une incohérence manifeste et sérieuse (ex: équipe de 8 vs équipe de 3 pour le MÊME contexte), signale-la.
ATTENTION : Protège contre les faux positifs. "J'ai managé 8 personnes chez Orange" puis "3 chez SFR" ne sont pas contradictoires.
En cas de doute ou changement de contexte apparent, severity="LOW" ou pas de conflit du tout.
Si aucun conflit n'est détecté, renvoie une liste vide [].

RÉSOLUTION DE CONFLITS (resolvedConflicts) :
Si des CONFLITS EN COURS sont fournis, évalue si la nouvelle réponse du candidat apporte une explication valable à ces incohérences (ex: il s'agit d'une entreprise différente, d'un contexte différent, ou il s'est corrigé).
Si oui, retourne la liste des clés ("key") des conflits résolus dans "resolvedConflicts". Sinon, renvoie [].

Tu dois répondre UNIQUEMENT avec un objet JSON valide respectant la structure demandée.`;

function cleanText(text?: string | null, maxLength = 2000): string {
  return (text ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

// Fallback regex evaluation in case of AI failure
function fallbackEvaluation(answer: string, competency: string | null): AnswerEvaluation {
  const normalizedAnswer = answer.trim().toLowerCase();

  const hasMetrics = /\b(\d+(?:[.,]\d+)?\s?(?:%|€|k€|m€|jours?|heures?|mois|ans?|utilisateurs?|clients?|projets?|personnes?))\b/i.test(normalizedAnswer);
  const hasExample = /\b(exemple|situation|projet|mission|contexte|équipe|client|résultat|objectif|problème|incident|livraison|migration|déploiement)\b/i.test(normalizedAnswer);
  const hasImpact = /\b(résultat|impact|amélior|réduit|augment|gagn|économ|optimis|accélér|performance|conversion|revenu|coût|délai)\b/i.test(normalizedAnswer);

  const isShort = normalizedAnswer.length < 80;

  let recommendedAction: "FOLLOW_UP" | "NEXT_QUESTION" = "FOLLOW_UP";
  let followUpType: AnswerEvaluation["followUpType"] = null;
  let missingEvidence: AnswerEvaluation["missingEvidence"] = [];

  if (isShort) {
    followUpType = "CLARIFY";
    missingEvidence = ["clarification"];
  } else if (!hasExample) {
    followUpType = "ASK_EXAMPLE";
    missingEvidence = ["example"];
  } else if (!hasImpact) {
    followUpType = "ASK_RESULT";
    missingEvidence = ["result"];
  } else if (!hasMetrics) {
    followUpType = "ASK_METRIC";
    missingEvidence = ["metrics"];
  } else {
    recommendedAction = "NEXT_QUESTION";
  }

  return {
    relevanceScore: isShort ? 30 : 70,
    specificityScore: hasExample ? 80 : 30,
    evidenceScore: hasImpact ? 80 : 30,
    competencyScore: 50, // Default neutral for regex
    hasConcreteExample: hasExample,
    hasPersonalOwnership: hasExample, // Simplification for regex
    hasMetrics: hasMetrics,
    hasOutcome: hasImpact,
    isVague: isShort,
    isEvasive: false,
    isTooShort: isShort,
    demonstratedCompetency: hasExample ? "partial" : "insufficient",
    missingEvidence,
    recommendedAction,
    followUpType,
    shortReason: "Évaluation via Regex (Fallback technique)",
    extractedClaims: [],
    claimConflicts: [],
    resolvedConflicts: [],
  };
}

export class AnswerEvaluator {
  public static async evaluate(input: EvaluateAnswerInput): Promise<AnswerEvaluation> {
    // If the answer is extremely short, bypass AI and use fast rules
    if (input.candidateAnswer.trim().length < 20) {
       return fallbackEvaluation(input.candidateAnswer, input.targetCompetency);
    }

    try {
      const client = AIClient.getInstance();

      const contextParts: string[] = [];
      if (input.targetCompetency) {
        contextParts.push(`COMPÉTENCE CIBLÉE : ${input.targetCompetency}`);
      }
      if (input.unifiedContext?.job) {
        contextParts.push(`POSTE : ${cleanText(input.unifiedContext.job.title, 200)}`);
        contextParts.push(`DESCRIPTION : ${cleanText(input.unifiedContext.job.description, 2000)}`);
      }
      if (input.unifiedContext?.candidate) {
        contextParts.push(`CV DU CANDIDAT : ${cleanText(input.unifiedContext.candidate.cvText, 3000)}`);
      }
      if (input.existingClaims && input.existingClaims.length > 0) {
        const claimsText = input.existingClaims
          .map(c => `- [${c.key}] ${c.statement} (Valeur: ${c.value})`)
          .join("\n");
        contextParts.push(`AFFIRMATIONS PRÉCÉDENTES DU CANDIDAT (POUR DÉTECTION DE CONTRADICTION) :\n${claimsText}`);
      }
      if (input.openConflicts && input.openConflicts.length > 0) {
        const conflictsText = input.openConflicts
          .map(c => `- Clé "${c.key}": "${c.previousStatement}" vs "${c.newStatement}"`)
          .join("\n");
        contextParts.push(`CONFLITS EN COURS À CLARIFIER :\n${conflictsText}`);
      }

      const promptUser = `
${contextParts.join("\n\n")}

QUESTION POSÉE :
${input.currentQuestion}

RÉPONSE DU CANDIDAT :
${input.candidateAnswer}

Fournis ton évaluation structurée au format JSON.`;

      const result = await RetryManager.execute(
        async () => {
          const response = await client.chatCompletion({
            model: AI_MODELS.INTERVIEW, // Use the same robust model for interview analysis
            messages: [
              { role: "system", content: EVALUATION_SYSTEM_PROMPT },
              { role: "user", content: promptUser }
            ],
            temperature: 0.1, // Low temperature for consistent evaluation
            responseFormat: { type: "json_object" },
            signal: input.signal,
          });

          return response.content;
        },
        { maxRetries: 2, initialDelay: 1000 }
      );

      if (!result.success || !result.data) {
        console.warn("[AnswerEvaluator] AI call failed, falling back to regex", result.error);
        return fallbackEvaluation(input.candidateAnswer, input.targetCompetency);
      }

      const parsed = JSON.parse(result.data);
      const validationResult = AnswerEvaluationSchema.safeParse(parsed);

      if (!validationResult.success) {
        console.warn("[AnswerEvaluator] Invalid JSON schema returned by AI, falling back to regex", validationResult.error);
        return fallbackEvaluation(input.candidateAnswer, input.targetCompetency);
      }

      return validationResult.data;

    } catch (error) {
      console.warn("[AnswerEvaluator] Error during evaluation, falling back to regex", error);
      return fallbackEvaluation(input.candidateAnswer, input.targetCompetency);
    }
  }
}
