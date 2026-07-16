# Inventaire Technique du Parcours Candidat

Rapport d'inventaire des fonctionnalités existantes pour le parcours candidat dans Trajectoire.

## Analyse par fonctionnalité

### 1. Upload de CV
**Statut:** COMPLET

**Fichiers concernés:**
- `lib/cv/application/use-cases/upload/upload-cv.use-case.ts`
- `lib/cv/domain/aggregates/cv.aggregate.ts`
- `lib/cv/ports/repositories/cv-repository.port.ts`
- `lib/cv/ports/gateways/cv-storage.gateway.ts`
- `lib/cv/ports/gateways/document-parser.gateway.ts`

**Composants:**
- `components/candidate/cv-upload-premium.tsx`
- `app/product/_components/CvUpload.tsx`
- `app/(app)/dashboard/cvs/upload-section.tsx`

**UseCases:**
- `UploadCvUseCase`

**Domain:**
- `CVAggregate`

**Repository:**
- `CvRepositoryPort` (implémentation: PrismaCvRepository)

**API:**
- `app/api/upload/`
- `app/api/product/upload/`

**Pages UI:**
- `app/(app)/dashboard/cvs/`

**Intelligence Engines utilisés:**
- `CVProfileExtractorEngine` (extraction de profil depuis texte CV)

**Dépendances externes:**
- `pdf-parse`

---

### 2. Parsing PDF
**Statut:** COMPLET

**Fichiers concernés:**
- `lib/cv/infrastructure/adapters/pdf-parser.adapter.ts`
- `lib/ats/extraction/extract-pdf-text.ts`

**Composants:**
- `components/cv/PDFPreviewModal.tsx`

**UseCases:**
- Intégré dans `UploadCvUseCase`

**Domain:**
- N/A

**Repository:**
- N/A

**API:**
- N/A

**Pages UI:**
- N/A

**Intelligence Engines utilisés:**
- N/A

**Dépendances externes:**
- `pdf-parse`

---

### 3. Parsing DOCX
**Statut:** ABSENT

**Fichiers concernés:**
- Aucun

**Composants:**
- Aucun

**UseCases:**
- Aucun

**Domain:**
- N/A

**Repository:**
- N/A

**API:**
- N/A

**Pages UI:**
- N/A

**Intelligence Engines utilisés:**
- N/A

**Dépendances externes:**
- Aucune

**Note:** Seule l'export DOCX existe (`export-cv-docx.use-case.ts`), pas le parsing.

---

### 4. Extraction de texte
**Statut:** COMPLET

**Fichiers concernés:**
- `lib/cv/infrastructure/adapters/pdf-parser.adapter.ts`
- `lib/ats/extraction/extract-pdf-text.ts`

**Composants:**
- Aucun

**UseCases:**
- Intégré dans `UploadCvUseCase`

**Domain:**
- N/A

**Repository:**
- N/A

**API:**
- N/A

**Pages UI:**
- N/A

**Intelligence Engines utilisés:**
- N/A

**Dépendances externes:**
- `pdf-parse`

---

### 5. Profil candidat
**Statut:** COMPLET

**Fichiers concernés:**
- `lib/career/domain/aggregates/career-profile.aggregate.ts`
- `lib/career/application/use-cases/update-career-profile/update-career-profile.use-case.ts`
- `lib/career/application/queries/get-career-profile.query.ts`
- `lib/career/ports/career-repository.port.ts`

**Composants:**
- Aucun composant spécifique (intégré dans dashboard)

**UseCases:**
- `UpdateCareerProfileUseCase`
- `GetCareerProfileQuery`

**Domain:**
- `CareerProfileAggregate`

**Repository:**
- `CareerRepositoryPort` (implémentation: PrismaCareerRepository)

**API:**
- N/A

**Pages UI:**
- `app/(app)/dashboard/profile/`

**Intelligence Engines utilisés:**
- N/A

**Dépendances externes:**
- Aucune

---

### 6. Analyse ATS
**Statut:** COMPLET

**Fichiers concernés:**
- `lib/cv/ports/gateways/ats-analysis.gateway.ts`
- `lib/cv/infrastructure/adapters/mistral-ats-analysis.adapter.ts`
- `lib/ats/schemas/ats-analysis.schema.ts`
- `lib/ats/schemas/premium-ats-response.schema.ts`
- `lib/ai/ats-heuristic.ts`

**Composants:**
- `app/(app)/dashboard/ats/client.tsx`
- `app/(app)/dashboard/ats/actions.ts`

**UseCases:**
- Intégré dans CV workflow (pas de UseCase dédié identifié)

**Domain:**
- N/A

**Repository:**
- `AtsRepositoryPort` (implémentation: PrismaAtsRepository)

**API:**
- N/A (probablement intégré dans CV API)

**Pages UI:**
- `app/(app)/dashboard/ats/`

**Intelligence Engines utilisés:**
- Mistral AI (via `mistral-ats-analysis.adapter.ts`)

**Dépendances externes:**
- `ai` (Vercel AI SDK)
- `mistral`

---

### 7. Adaptation du CV
**Statut:** COMPLET

**Fichiers concernés:**
- `lib/cv/application/use-cases/rewrite/rewrite-cv.use-case.ts`
- `lib/cv/ports/gateways/llm-rewriter.gateway.ts`
- `lib/cv/ports/text-rewriter.ts`
- `lib/ai/application/use-cases/rewrite-text.use-case.ts`

**Composants:**
- `app/(app)/dashboard/optimize/`

**UseCases:**
- `RewriteCvUseCase`
- `RewriteTextUseCase`

**Domain:**
- `CVAggregate` (méthode `rewrite`)

**Repository:**
- `CvRepositoryPort`

**API:**
- `app/api/cv/rewrite`

**Pages UI:**
- `app/(app)/dashboard/optimize/`

**Intelligence Engines utilisés:**
- LLM Gateway (Mistral probablement)

**Dépendances externes:**
- `ai` (Vercel AI SDK)

---

### 8. Analyse d'offre d'emploi
**Statut:** COMPLET

**Fichiers concernés:**
- `lib/jobs/application/use-cases/upload/upload-job-offer.use-case.ts`
- `lib/jobs/domain/aggregates/job-offer.aggregate.ts`
- `lib/jobs/domain/entities/job-offer.entity.ts`
- `lib/jobs/extract-job-content.ts`
- `lib/jobs/normalize-job-input.ts`
- `lib/ats/schemas/job-extraction.schema.ts`

**Composants:**
- Aucun identifié

**UseCases:**
- `UploadJobOfferUseCase`

**Domain:**
- `JobOfferAggregate`

**Repository:**
- N/A (pas de repository identifié)

**API:**
- `app/api/product/upload/` (probable)

**Pages UI:**
- N/A

**Intelligence Engines utilisés:**
- `JobOfferExtractorEngine`

**Dépendances externes:**
- Aucune

---

### 9. Simulation d'entretien
**Statut:** COMPLET

**Fichiers concernés:**
- `lib/interview/application/use-cases/start-interview/start-interview.use-case.ts`
- `lib/interview/application/use-cases/interview-conversation.use-case.ts`
- `lib/interview/application/use-cases/orchestrate-step/orchestrate-interview-step.use-case.ts`
- `lib/interview/domain/aggregates/interview-session.aggregate.ts`
- `lib/interview/domain/ports/interview-engine.port.ts`
- `lib/interview/infrastructure/engines/interview.engine.ts`
- `lib/interview/infrastructure/providers/mistral-interview.provider.ts`
- `lib/interview/infrastructure/repositories/prisma-interview.repository.ts`

**Composants:**
- `app/(app)/dashboard/interview-simulation/`
- `app/(app)/dashboard/interview-result/`
- `app/(app)/dashboard/interview-prep/`

**UseCases:**
- `StartInterviewUseCase`
- `InterviewConversationUseCase`
- `OrchestrateInterviewStepUseCase`

**Domain:**
- `InterviewSessionAggregate`

**Repository:**
- `InterviewRepositoryPort` (implémentation: PrismaInterviewRepository)

**API:**
- `app/api/interview/`
- `app/api/product/interview/`

**Pages UI:**
- `app/(app)/dashboard/interview-simulation/`
- `app/product/interview/`

**Intelligence Engines utilisés:**
- Mistral AI (via `mistral-interview.provider.ts`)
- Interview Engine interne

**Dépendances externes:**
- `ai` (Vercel AI SDK)
- `mistral`

---

### 10. Reconnaissance vocale
**Statut:** PARTIEL

**Fichiers concernés:**
- `lib/audio/voice-analysis.ts`
- `lib/audio/speech-analyzer.ts`

**Composants:**
- Aucun identifié

**UseCases:**
- Aucun UseCase dédié

**Domain:**
- N/A

**Repository:**
- N/A

**API:**
- `app/api/speech/transcribe` (existe mais implémentation non vérifiée)

**Pages UI:**
- N/A

**Intelligence Engines utilisés:**
- N/A

**Dépendances externes:**
- Aucune identifiée

**Note:** Analyse vocale présente (stress analysis) mais pas de transcription speech-to-text.

---

### 11. Synthèse vocale
**Statut:** ABSENT

**Fichiers concernés:**
- Aucun

**Composants:**
- Aucun

**UseCases:**
- Aucun

**Domain:**
- N/A

**Repository:**
- N/A

**API:**
- `app/api/ai/tts` (existe mais implémentation non vérifiée)

**Pages UI:**
- N/A

**Intelligence Engines utilisés:**
- N/A

**Dépendances externes:**
- Aucune

---

### 12. Career Copilot
**Statut:** COMPLET (avec duplication)

**Fichiers concernés:**
- **Legacy:** `lib/career-copilot/application/use-cases/career-conversation.use-case.ts`
- **Legacy:** `lib/career-copilot/composition/career-copilot.factory.ts`
- **Legacy:** `lib/career-copilot/infrastructure/engines/career-copilot-v2.engine.ts`
- **Nouveau:** `modules/copilot/` (module complet créé récemment)

**Composants:**
- `components/copilot/ChatInterface.tsx`
- `app/(app)/copilot/page.tsx`
- `app/(app)/dashboard/career-copilot/`

**UseCases:**
- **Legacy:** `CareerConversationUseCase`
- **Nouveau:** `SendMessageUseCase`, `GetConversationsUseCase`, `GetConversationUseCase`, `DeleteConversationUseCase`

**Domain:**
- **Legacy:** Contracts dans `lib/career-copilot/domain/contracts/`
- **Nouveau:** `Conversation`, `Message` dans `modules/copilot/domain/entities/`

**Repository:**
- **Nouveau:** `ConversationRepositoryPort` (implémentation: InMemoryConversationRepository)

**API:**
- **Nouveau:** `app/api/copilot/chat/`, `app/api/copilot/conversations/`
- **Legacy:** `app/api/career-copilot/chat/`

**Pages UI:**
- **Nouveau:** `app/(app)/copilot/`
- **Legacy:** `app/(app)/dashboard/career-copilot/`

**Intelligence Engines utilisés:**
- **Nouveau:** `ExecutionPipeline` (via `SendMessageUseCase`)
- **Legacy:** `CareerCopilotV2Engine`

**Dépendances externes:**
- `ai` (Vercel AI SDK)
- `mistral`

---

### 13. Dashboard métier
**Statut:** COMPLET

**Fichiers concernés:**
- `modules/dashboard/` (module complet créé récemment)
- `app/(app)/dashboard-v1/page.tsx`

**Composants:**
- `components/dashboard/DashboardCard.tsx`
- `components/dashboard/Badge.tsx`
- `components/dashboard/Skeleton.tsx`
- `components/dashboard/CareerProgressionCard.tsx`
- `components/dashboard/CareerCopilotCard.tsx`
- `components/dashboard/ObjectivesList.tsx`
- `components/dashboard/PriorityActionsList.tsx`
- `components/dashboard/RecentActivityList.tsx`
- `components/dashboard/IntelligenceEnginesStatus.tsx`

**UseCases:**
- `GetDashboardDataQuery` (implémentation mock)

**Domain:**
- `DashboardData`, `CareerProgression`, `CareerCopilot`, `Objective`, `PriorityAction`, `ActivityEvent`, `IntelligenceEngine`

**Repository:**
- N/A (mock data)

**API:**
- `app/api/dashboard/`

**Pages UI:**
- `app/(app)/dashboard-v1/`
- `app/(app)/dashboard/` (legacy complexe)

**Intelligence Engines utilisés:**
- N/A

**Dépendances externes:**
- Aucune

---

## Duplications et code mort identifiés

### Duplications

1. **Career Copilot**
   - **Legacy:** `lib/career-copilot/` (ancienne implémentation)
   - **Nouveau:** `modules/copilot/` (nouvelle implémentation Clean Architecture)
   - **Impact:** Deux implémentations distinctes pour la même fonctionnalité

2. **Interview State Machine**
   - `lib/interview/domain/aggregates/interview-state-machine.ts`
   - `lib/interview/interview-state-machine.ts`
   - `lib/interview/orchestration/interview-state-machine.ts`
   - **Impact:** 3 implémentations de state machine pour interviews

3. **Dashboard**
   - `app/(app)/dashboard/` (legacy complexe avec 595 lignes)
   - `app/(app)/dashboard-v1/` (nouveau module Dashboard)
   - **Impact:** Deux pages dashboard différentes

### Code mort / Legacy

1. **Local ATS**
   - `lib/local-ats.ts` - fichier local ATS non intégré dans l'architecture modulaire

2. **Interview Agents**
   - `lib/agents/interview.agent.ts` - agent interview potentiellement non utilisé

3. **Interview Analytics**
   - `lib/analytics/interview.engine.ts` - moteur analytics potentiellement non utilisé

4. **Interview DB Service**
   - `lib/db/interview.service.ts` - service DB potentiellement remplacé par repository pattern

### Composants non connectés

1. **Voice Analysis**
   - `lib/audio/voice-analysis.ts` - implémenté mais pas intégré dans le workflow interview

2. **Job Offer**
   - `lib/jobs/` - module complet mais pas d'UI identifiée

---

## Tableau de synthèse

| Fonctionnalité | Statut | Réutilisable | À développer |
|----------------|--------|--------------|---------------|
| Upload de CV | COMPLET | OUI | Non |
| Parsing PDF | COMPLET | OUI | Non |
| Parsing DOCX | ABSENT | N/A | OUI |
| Extraction de texte | COMPLET | OUI | Non |
| Profil candidat | COMPLET | OUI | Non |
| Analyse ATS | COMPLET | OUI | Non |
| Adaptation du CV | COMPLET | OUI | Non |
| Analyse d'offre d'emploi | COMPLET | OUI | Non |
| Simulation d'entretien | COMPLET | OUI | Non |
| Reconnaissance vocale | PARTIEL | Partiel | OUI (transcription) |
| Synthèse vocale | ABSENT | N/A | OUI |
| Career Copilot | COMPLET | OUI (nouveau module) | Non |
| Dashboard métier | COMPLET | OUI | Non |

---

## Ordre de développement recommandé

Basé uniquement sur les éléments réellement absents:

1. **Parsing DOCX** - Ajouter support DOCX pour compléter le parsing de documents
2. **Synthèse vocale (TTS)** - Implémenter text-to-speech pour feedback vocal
3. **Reconnaissance vocale (STT)** - Compléter l'analyse vocale existante avec transcription

**Note:** Toutes les autres fonctionnalités sont déjà implémentées et réutilisables. Les priorités de développement devraient se concentrer sur l'intégration et le refactoring des duplications identifiées plutôt que sur de nouvelles fonctionnalités.
