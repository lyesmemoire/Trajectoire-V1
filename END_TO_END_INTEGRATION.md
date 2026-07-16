# End-to-End Integration Report

Mode lecture seule - Analyse du câblage entre modules existants pour le parcours candidat complet.

## Étape 1: Upload du CV

**Composant utilisé:** `components/candidate/cv-upload-premium.tsx`, `app/(app)/dashboard/cvs/upload-section.tsx`

**API utilisée:** `app/api/upload/`, `app/api/product/upload/`

**UseCase utilisé:** `UploadCvUseCase` (`lib/cv/application/use-cases/upload/upload-cv.use-case.ts`)

**Intelligence Engine utilisé:** `CVProfileExtractorEngine` (`core/intelligence/engines/cvProfileExtractor`)

**Données d'entrée:**
- file: Buffer
- filename: string
- mimeType: string

**Données de sortie:**
- cvId: string
- url: string
- profileExtraction (extrait du CV)

**Étape suivante:** Parsing (intégré dans le même UseCase)

---

## Étape 2: Parsing

**Composant utilisé:** Intégré dans UploadCvUseCase

**API utilisée:** Aucune (interne)

**UseCase utilisé:** `UploadCvUseCase` (étape 3 du flux)

**Intelligence Engine utilisé:** `DocumentParserGateway` via `PdfParserAdapter`

**Données d'entrée:**
- file: Buffer
- mimeType: string

**Données de sortie:**
- cvText: string

**Étape suivante:** Création du profil candidat (CVProfileExtractorEngine)

---

## Étape 3: Création du profil candidat

**Composant utilisé:** Intégré dans UploadCvUseCase

**API utilisée:** Aucune (interne)

**UseCase utilisé:** `UploadCvUseCase` (étape 4 du flux)

**Intelligence Engine utilisé:** `CVProfileExtractorEngine`

**Données d'entrée:**
- cvText: string
- cvId: string
- userId: string

**Données de sortie:**
- profileExtraction (attaché au CV aggregate)

**Étape suivante:** Analyse de l'offre (séparée, pas de connexion automatique)

---

## Étape 4: Analyse de l'offre

**Composant utilisé:** Aucun identifié (pas d'UI spécifique)

**API utilisée:** Probablement `app/api/product/upload/` (non vérifié)

**UseCase utilisé:** `UploadJobOfferUseCase` (`lib/jobs/application/use-cases/upload/upload-job-offer.use-case.ts`)

**Intelligence Engine utilisé:** `JobOfferExtractorEngine`

**Données d'entrée:**
- description: string
- source?: string
- sourceType?: "URL_LINKEDIN" | "URL_INDEED" | "URL_WTTJ" | "RAW_TEXT"

**Données de sortie:**
- jobOfferId: string
- offerExtraction (attaché au JobOffer aggregate)

**Étape suivante:** Analyse ATS (pas de connexion automatique avec CV)

---

## Étape 5: Analyse ATS

**Composant utilisé:** `app/(app)/dashboard/ats/client.tsx`

**API utilisée:** Aucune API dédiée identifiée (probablement intégré dans CV workflow)

**UseCase utilisé:** Aucun UseCase dédié identifié

**Intelligence Engine utilisé:** `MistralAtsAnalysisAdapter` via `AtsAnalysisGateway`

**Données d'entrée:**
- text: string (CV text)
- jobDescription?: string

**Données de sortie:**
- score: number
- matchedKeywords: string[]
- missingKeywords: string[]
- strengths: string[]
- weaknesses: string[]
- recommendations: string[]

**Étape suivante:** Adaptation du CV (pas de connexion automatique)

---

## Étape 6: Adaptation du CV

**Composant utilisé:** `app/(app)/dashboard/optimize/`

**API utilisée:** `app/api/cv/rewrite`

**UseCase utilisé:** `RewriteCvUseCase` (`lib/cv/application/use-cases/rewrite/rewrite-cv.use-case.ts`)

**Intelligence Engine utilisé:** `LLMRewriterGateway`

**Données d'entrée:**
- cvId?: string
- action: "improve_experience" | "rewrite_summary" | "generate_metrics"
- content: string
- context?: string

**Données de sortie:**
- newText: string

**Étape suivante:** Simulation d'entretien (pas de connexion automatique)

---

## Étape 7: Simulation d'entretien

**Composant utilisé:** `app/(app)/dashboard/interview-simulation/`

**API utilisée:** `app/api/interview/start`, `app/api/interview/chat`

**UseCase utilisé:** 
- `StartInterviewUseCase` (`lib/interview/application/use-cases/start-interview/start-interview.use-case.ts`)
- `InterviewConversationUseCase` (`lib/interview/application/use-cases/interview-conversation.use-case.ts`)

**Intelligence Engine utilisé:** `InterviewEnginePort` via `MistralInterviewProvider`

**Données d'entrée:**
- userId: string
- jobTitle: string
- jobDescription?: string
- cvId?: string
- candidateSummary?: string

**Données de sortie:**
- sessionId: string
- Stream de questions/réponses

**Étape suivante:** Rapport final (pas de connexion automatique)

---

## Étape 8: Rapport final

**Composant utilisé:** `app/(app)/dashboard/interview-result/`

**API utilisée:** `app/api/interview/premium/report`

**UseCase utilisé:** Aucun UseCase identifié (probablement direct schema)

**Intelligence Engine utilisé:** Aucun identifié (probablement calcul à partir des données de session)

**Données d'entrée:**
- Session d'entretien complétée

**Données de sortie:**
- overall_assessment: string
- dimension_scores: { structure, specificity, impact, adaptability }
- strengths: string[]
- development_areas: { area, observation, recommendation }[]
- cv_coherence: { is_coherent, discrepancies }
- readiness_level: "NOT_READY" | "DEVELOPING" | "READY" | "EXCELLENT"

**Étape suivante:** Fin du parcours

---

## Connexions manquantes entre modules existants

1. **CV → Job Offer:** Pas de connexion automatique entre le CV uploadé et l'analyse d'offre. L'utilisateur doit manuellement fournir l'offre.

2. **CV + Job Offer → ATS:** Pas de UseCase dédié pour combiner CV text + job description dans l'analyse ATS. L'ATS analysis gateway peut recevoir jobDescription mais pas de flux orchestré.

3. **ATS → CV Adaptation:** Pas de connexion automatique entre les résultats ATS (missingKeywords, recommendations) et le RewriteCvUseCase. Les recommandations ne sont pas passées automatiquement au rewriter.

4. **CV Adaptation → Interview:** Pas de connexion automatique entre le CV réécrit et la simulation d'entretien. Le cvId peut être passé mais pas de flux orchestré.

5. **Interview → Report:** Pas de UseCase identifié pour générer le rapport final à partir de la session d'entretien. Le schema existe mais pas d'orchestration.

6. **Profile Extraction → Career Profile:** Le CVProfileExtractorEngine extrait des données mais pas de connexion automatique vers UpdateCareerProfileUseCase pour créer/mettre à jour le CareerProfileAggregate.

## Conclusion

END_TO_END_MISSING

Les modules individuels existent et fonctionnent, mais il n'y a pas d'orchestration de bout en bout. Chaque étape nécessite une action manuelle de l'utilisateur pour passer à l'étape suivante.
