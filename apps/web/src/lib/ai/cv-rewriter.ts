import AIClient from "./client"
import { AI_MODELS } from "./models"
import { RetryManager } from "./retry/RetryManager"
import { ExternalServiceError } from "@/core/errors"

export async function improveExperience(
  content: string,
  signal?: AbortSignal,
): Promise<string> {
  const client = AIClient.getInstance()

  const systemPrompt = `
Tu es un expert RH de haut niveau.

Améliore la description de l'expérience professionnelle fournie afin de
la rendre plus claire, plus percutante et davantage orientée résultats.

RÈGLES ABSOLUES :
- Ne jamais ajouter une information absente du texte source.
- Ne jamais inventer une responsabilité.
- Ne jamais inventer une technologie.
- Ne jamais inventer un résultat ou une métrique.
- Ne jamais modifier le niveau réel de responsabilité.
`.trim()

  const result = await RetryManager.execute(
    async () => {
      const response = await client.chatCompletion({
        model: AI_MODELS.INTERVIEW,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content,
          },
        ],
        temperature: 0.4,
        signal,
      })

      return response.content
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
    },
  )

  if (!result.success || !result.data) {
    throw new ExternalServiceError(
      result.error || "Failed to improve experience",
      "CVRewriter",
    )
  }

  return result.data
}

export async function rewriteSummary(
  content: string,
  signal?: AbortSignal,
): Promise<string> {
  const client = AIClient.getInstance()

  const systemPrompt = `
Tu es un expert RH.

Réécris ce résumé de CV pour le rendre concis, professionnel et
accrocheur en 3 ou 4 phrases maximum.

RÈGLES ABSOLUES :
- Utiliser uniquement les informations présentes dans le résumé fourni.
- Ne jamais inventer une compétence.
- Ne jamais inventer une expérience.
- Ne jamais inventer une responsabilité.
- Ne jamais inventer un résultat chiffré.
`.trim()

  const result = await RetryManager.execute(
    async () => {
      const response = await client.chatCompletion({
        model: AI_MODELS.INTERVIEW,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content,
          },
        ],
        temperature: 0.4,
        signal,
      })

      return response.content
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
    },
  )

  if (!result.success || !result.data) {
    throw new ExternalServiceError(
      result.error || "Failed to rewrite summary",
      "CVRewriter",
    )
  }

  return result.data
}

export async function generateImpactMetrics(
  role: string,
  context: string,
  signal?: AbortSignal,
): Promise<string> {
  const client = AIClient.getInstance()

  const systemPrompt = `
Tu es un expert métier.

Identifie jusqu'à 3 types de métriques qui pourraient être pertinentes
pour mieux documenter l'impact d'un candidat dans ce rôle.

IMPORTANT :
- Ce sont uniquement des QUESTIONS DE PREUVE ou des pistes à vérifier.
- Ne jamais présenter une métrique comme un résultat réellement obtenu.
- Ne jamais inventer un chiffre.
- Ne jamais attribuer au candidat une performance non fournie.
- Formule chaque suggestion comme une information que le candidat doit
  confirmer avant de l'ajouter au CV.
`.trim()

  const result = await RetryManager.execute(
    async () => {
      const response = await client.chatCompletion({
        model: AI_MODELS.INTERVIEW,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Rôle : ${role}\nContexte : ${context}`,
          },
        ],
        temperature: 0.3,
        signal,
      })

      return response.content
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
    },
  )

  if (!result.success || !result.data) {
    throw new ExternalServiceError(
      result.error || "Failed to generate metrics",
      "CVRewriter",
    )
  }

  return result.data
}

export async function tailorCVForOpportunity(
  cvContent: string,
  role: string,
  opportunityContext: string,
  signal?: AbortSignal,
): Promise<string> {
  const client = AIClient.getInstance()

  const systemPrompt = `
Tu es Trajectoire CV Intelligence, un expert senior en recrutement,
ATS et rédaction de CV.

Ta mission est d'aider le candidat à mieux positionner SON EXPÉRIENCE
RÉELLE pour une opportunité donnée.

RÈGLE FONDAMENTALE :
TU N'AS JAMAIS LE DROIT D'INVENTER.

INTERDICTIONS ABSOLUES :
- Ne jamais inventer une expérience professionnelle.
- Ne jamais inventer une compétence.
- Ne jamais inventer une technologie.
- Ne jamais inventer une responsabilité.
- Ne jamais inventer une entreprise.
- Ne jamais inventer un diplôme.
- Ne jamais inventer une certification.
- Ne jamais inventer un résultat.
- Ne jamais inventer une métrique ou un chiffre.
- Ne jamais transformer une exigence de l'offre en compétence du candidat.
- Ne jamais présenter une hypothèse comme un fait.

Si une compétence demandée dans l'offre n'apparaît pas dans le CV,
indique explicitement qu'elle constitue un écart et NE L'AJOUTE PAS au CV.

Tu peux :
- reformuler les preuves existantes ;
- réordonner les informations existantes ;
- rendre une formulation plus précise ;
- rapprocher le vocabulaire du CV de celui de l'offre lorsque les deux
  désignent réellement la même chose ;
- indiquer quelles preuves existantes doivent être davantage visibles.

Réponds en français.

FORMAT DE SORTIE :

## Positionnement recommandé
2 à 4 phrases expliquant comment positionner le candidat pour ce poste.

## Résumé professionnel proposé
Un résumé de 3 à 5 phrases basé EXCLUSIVEMENT sur les faits du CV.

## Expériences à mettre en avant
Pour chaque élément réellement pertinent :
- Preuve existante :
- Pourquoi elle est pertinente :
- Reformulation proposée :

## Compétences réellement démontrées
Liste uniquement les compétences présentes ou clairement démontrées
dans le CV et pertinentes pour l'offre.

## Écarts à ne pas masquer
Liste les exigences importantes de l'offre qui ne sont pas démontrées
dans le CV.

## Questions de preuve
Liste les informations que le candidat pourrait vérifier dans son
parcours afin d'améliorer le CV. Ne suppose jamais que ces preuves existent.

## Checklist avant candidature
5 actions maximum, concrètes et factuelles.
`.trim()

  const prompt = `
POSTE CIBLÉ
${role.slice(0, 300)}

CONTEXTE DE L'OPPORTUNITÉ
${opportunityContext.slice(0, 12000)}

CV SOURCE DU CANDIDAT
${cvContent.slice(0, 16000)}

Analyse uniquement les preuves présentes dans le CV source.
`.trim()

  const result = await RetryManager.execute(
    async () => {
      const response = await client.chatCompletion({
        model: AI_MODELS.INTERVIEW,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        signal,
      })

      return response.content
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
    },
  )

  if (!result.success || !result.data) {
    throw new ExternalServiceError(
      result.error || "Failed to tailor CV for opportunity",
      "CVRewriter",
    )
  }

  return result.data.trim()
}