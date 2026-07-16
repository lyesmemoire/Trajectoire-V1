# AI Architecture Audit

## Objectif
Cartographier l'ensemble des modules d'intelligence artificielle présents dans `core/intelligence/engines` et déterminer leur rôle, leurs dépendances et leurs consommateurs, afin de préparer la migration vers une architecture 100% Server-Only.

---

## 1. Inventaire des Moteurs IA (Sélection Principale)

Le dossier `core/intelligence/engines` contient 64 moteurs. Voici la cartographie des moteurs les plus critiques :

### Domaine : Career Copilot
1. **CareerCopilotConversationEngine**
   - **Responsabilité** : Gère la conversation principale, orchestre les réponses du copilot.
   - **Dépendances** : `AIOrchestrator`, `CandidateAIBrain`, 10+ autres sous-moteurs.
   - **Prompt** : `careerCopilotConversationV1`
   - **Consommateur** : `career-copilot-chat.tsx` (Client Component ❌ Fuite)
   - **Fournisseur** : Anthropic / OpenAI

2. **CareerCopilotCareerNarrativeIntelligenceEngine**
   - **Responsabilité** : Construit et maintient la narration professionnelle du candidat.
   - **Prompt** : `career-copilot-career-narrative-intelligence-v1`
   - **Consommateur** : `career-copilot-chat.tsx` via `import()` dynamique (Client Component ❌ Fuite)

3. **CareerCopilotMissionIntelligenceEngine**
   - **Responsabilité** : Gère la mission de carrière principale (objectifs, timeline).
   - **Prompt** : `career-copilot-mission-intelligence-v1`
   - **Consommateur** : `career-copilot-chat.tsx` (Client Component ❌ Fuite)

### Domaine : Interview Simulation
4. **InterviewAnalyzerAIEngine**
   - **Responsabilité** : Évalue la performance globale de l'entretien.
   - **Prompt** : `interviewAnalysisV1`
   - **Consommateur** : `useInterviewReport.ts` (Client Hook ❌ Fuite)

5. **ExecutiveSummaryAIEngine**
   - **Responsabilité** : Rédige la synthèse de l'entretien.
   - **Prompt** : `executiveSummaryV1`
   - **Consommateur** : `useInterviewReport.ts` (Client Hook ❌ Fuite)

6. **DecisionEstimationAIEngine**
   - **Responsabilité** : Estime la probabilité de réussite (Go/No-Go).
   - **Consommateur** : `useInterviewReport.ts` (Client Hook ❌ Fuite)

### Domaine : Job & CV (ATS)
7. **JobOfferExtractorEngine**
   - **Responsabilité** : Extrait les données structurées d'une offre d'emploi.
   - **Consommateur** : `upload-job-offer.use-case.ts` (Server Use Case ✅ Correct)

8. **CVProfileExtractorEngine**
   - **Responsabilité** : Parse et structure le contenu d'un CV.
   - **Consommateur** : `upload-cv.use-case.ts` (Server Use Case ✅ Correct)

9. **ATSAIEngine**
   - **Responsabilité** : Analyse le matching CV / Offre.
   - **Consommateur** : `dashboard/ats/actions.ts` (Server Action ✅ Correct)

---

## 2. Typologie des problèmes rencontrés

L'audit révèle 3 types de consommateurs pour nos moteurs IA :

1. **Les Use Cases Serveur (Ex: CV, Job Offer)** : L'architecture est correcte. Les moteurs sont appelés depuis des scripts backend. Le client n'y a pas accès.
2. **Les Server Actions (Ex: ATS)** : L'architecture est correcte. L'import est protégé par la directive `"use server"`.
3. **Les Composants & Hooks Clients (Ex: Copilot, Interview)** : L'architecture est corrompue. Les moteurs sont importés directement dans des fichiers `"use client"` ou des hooks utilisés par ces derniers, forçant Webpack à les bundler pour le navigateur.

---

## 3. Conclusion de l'Audit

Les modules d'intelligence artificielle de Trajectoire ont été initialement pensés de manière modulaire (64 moteurs spécialisés). Cependant, l'absence de frontière stricte (barrière API / Server Action) a permis aux développeurs UI d'importer ces moteurs directement dans les composants React pour plus de facilité (ex: génération de rapports en temps réel ou chat dynamique).

Cela entraîne des vulnérabilités (prompts exposés) et une dégradation critique des performances (bundle size). La migration vers un modèle `UI -> Server Action/API -> Engine` est indispensable.
