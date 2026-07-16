# PR 6.4.0 — AI Bundle Leak Verification

## Objectif

Vérifier de manière formelle que les moteurs IA (conçus pour le backend) sont accidentellement inclus dans les bundles Javascript client, causant la lourdeur anormale du First Load JS.

---

## Phase 1 — Constat & Preuve par l'Arbre d'Importation

L'analyse de la structure d'importation dans les fichiers compilés de `.next/static/chunks` révèle formellement que le code des AI Engines est bien envoyé au navigateur.

Par exemple, le texte exact du prompt de l'intelligence `CareerCopilotConstraintIntelligenceEngine` (ainsi que la logique de `CareerCopilotCareerNarrativeIntelligenceEngine`) a été retrouvé en clair dans le chunk client minifié :
> **Preuve matérielle :** Le chunk `1089.dc34906941a76cec.js` (48.5 kB) contient les instructions *"You are the Career Mission Intelligence engine for Career Copilot"* et *"You are the Career Narrative Intelligence engine..."*.

Ces chaînes de caractères proviennent de `core/intelligence/engines/` et confirment la compromission du bundle.

---

## Phase 2 — Analyse des moteurs incriminés

### 1. `CareerCopilotConversationEngine`
- **Présence client** : ✅ Confirmé (via import direct dans `career-copilot-chat.tsx`)
- **Raison de l'inclusion** : Le composant de chat, qui gère l'UI (input, messages) est marqué `"use client"`. Il instancie l'Engine directement plutôt que de faire un fetch sur une route API.
- **Taille source estimée** : ~41 kB (plus ses dépendances AI)

### 2. Moteurs d'Évaluation d'Entretien (`InterviewAnalyzerAIEngine`, etc.)
- **Présence client** : ✅ Confirmé (via `useInterviewReport.ts`)
- **Moteurs inclus** : 
  - `InterviewAnalyzerAIEngine`
  - `ExecutiveSummaryAIEngine`
  - `DecisionEstimationAIEngine`
  - `RecruiterNotesAIEngine`
- **Raison de l'inclusion** : Le Hook React `useInterviewReport` exécute la logique de génération de rapport dans un `useEffect` côté client, provoquant l'inclusion de Webpack.
- **Taille source estimée** : ~20 kB combinés (sans compter `AIOrchestrator` et les prompts).

---

## Phase 3 — Chaîne de compromission complète

### Chaîne 1 : Route `career-copilot`
```
Route (Serveur) : app/(app)/dashboard/career-copilot/page.tsx
  ↓ (import dynamique)
Client Component : components/dashboard/career-copilot-chat.tsx ("use client")
  ↓ (import direct)
Engine : core/intelligence/engines/careerCopilotConversationEngine.ts
  ↓ (dépendances internes de l'Engine)
Prompts : careerCopilotConversationV1 (et 10+ autres engines)
  ↓
LLM : AIOrchestrator
```
*(Résultat : la sécurité du backend et les prompts sont exposés au client, et le poids explose).*

### Chaîne 2 : Route `interview-simulation`
```
Route (Client) : app/(app)/dashboard/interview-simulation/page.tsx ("use client")
  ↓ (utilisation de Hook)
Hook : hooks/useInterviewReport.ts
  ↓ (import direct)
Engine : core/intelligence/engines/interviewAnalyzerAIEngine.ts (et consorts)
  ↓ (dépendances internes)
Prompts : interviewAnalysisV1, communicationAnalysisV1, etc.
  ↓
LLM : AIOrchestrator
```

---

## Phase 4 — Poids réel de la fuite

| Engine / Module | Chunk | Taille (Source) | Gain estimé (Gzipped) |
|-----------------|-------|-----------------|-----------------------|
| Bundle `1089.dc34906941a76cec.js` (Moteurs IA divers) | `1089.*.js` | 48.5 kB (Minifié) | ~40 kB |
| `CareerCopilotConversationEngine` + dépendances AI | Inclus dans le chunk Chat | ~41 kB | ~35 kB |
| Moteurs de rapport d'entretien + `AIOrchestrator` | Inclus dans le chunk Page | ~30 kB | ~25 kB |
| **Total fuite IA estimée** | | **~120 kB** | **~100 kB (LCP impact fort)** |

---

## Phase 5 — Corrections Optimales

### Fuite 1 : `useInterviewReport` (Simulation)
- **Correction** : Remplacer l'instanciation locale par un **Route Handler** (`fetch('/api/product/interview/report')`).
- **Difficulté** : Faible (Simple migration de code du hook vers le backend).
- **Risque** : Très faible (Logique identique, juste déportée).
- **Gain** : Immédiat sur le First Load JS de la page simulation. Protège les prompts d'évaluation.

### Fuite 2 : `CareerCopilotChat` (Dashboard)
- **Correction** : Remplacer l'appel local `CareerCopilotConversationEngine.execute()` par une **Server Action** (ex: `chatWithCopilot(messages, context)`).
- **Difficulté** : Moyenne (Le streaming de la réponse IA (Vercel AI SDK) doit être ajusté pour fonctionner via la Server Action `useActions` ou route API).
- **Risque** : Moyen (Il faut vérifier que l'UI de chat gère bien le stream asynchrone depuis le backend).
- **Gain** : Élimine le plus gros chunk responsable du First Load à 410 kB. Protège l'IP des agents.

---
**Conclusion** : L'audit formel est validé. La fuite des moteurs IA est le problème racine (Root Cause). L'étape suivante légitime est l'exécution de la correction sur `interview-simulation`.
