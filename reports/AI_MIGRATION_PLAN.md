# AI Migration Plan (Sprint 6.6)

## Objectif
Décrire la stratégie de migration incrémentale permettant de déplacer tous les moteurs d'intelligence artificielle vers le serveur sans introduire de régression fonctionnelle.

---

## Stratégie Globale (Déploiement Progressif)

1. **Sprint 6.5.1 (Garde-fous bloquants)** : Mise en place immédiate d'ESLint et `dependency-cruiser` pour empêcher tout *nouvel* import corrompu. Les fuites actuelles sont tolérées temporairement via exceptions pour garder le build vert.
2. **Sprint 6.6 (Migration Incrémentale)** : On migre un domaine à la fois.
   - Pour chaque domaine : Refactor UI -> Build -> Tests -> Validation Bundle -> Ajout définitif de `server-only` sur les modules migrés -> Merge.
3. **Sprint 6.7+** : Une fois tous les domaines migrés, les contrôles CI de bundle et les restrictions deviennent universelles et définitives.

---

## Domaine 1 : Career Copilot (Pilote Sprint 6.6)

**Impact** : C'est le plus gros consommateur de logique IA côté client. Une migration réussie ici servira de modèle.
**Composants impactés** : `career-copilot-chat.tsx`.
**Engines à déplacer** :
- `CareerCopilotConversationEngine` (et tous ses sous-moteurs via import dynamiques).

**Plan d'action** :
- Évaluer le mécanisme le plus adapté : Server Action pour les opérations ponctuelles, ou Route Handler (`app/api/career-copilot/chat/route.ts`) pour gérer correctement le streaming continu de l'AI SDK.
- Déplacer l'orchestration de `submitMessage` vers le backend.
- Gérer l'état du chat côté client via `useChat` de `@ai-sdk/react`.
- **Risque** : Moyen (Perte de streaming si mal implémenté).
- **Estimation** : 1 jour.

---

## Domaine 2 : Interview Simulation

**Impact** : Majeur.
**Composants impactés** : `useInterviewReport.ts` (Hook) consommé par `app/dashboard/interview-simulation/page.tsx`.
**Engines à déplacer** :
- `InterviewAnalyzerAIEngine`
- `ExecutiveSummaryAIEngine`
- `DecisionEstimationAIEngine`
- `RecruiterNotesAIEngine`

**Plan d'action** :
- Créer un Use Case : `lib/interview/application/use-cases/generate-interview-report.use-case.ts`.
- Créer une Route API ou Server Action : `app/api/interview/report/route.ts`.
- Modifier `useInterviewReport.ts` pour qu'il fasse un simple appel `fetch` à cette nouvelle API.
- **Risque** : Faible (logique 100% backend par nature, facile à isoler).
- **Estimation** : 0.5 jour.

---

## Domaine 3 : Forecast

**Composants impactés** : À vérifier, potentiellement `career-forecast.tsx`.
**Engines à déplacer** : `CareerCopilotForecastEngine`.
**Plan d'action** : Déplacer l'exécution vers une Server Action (si elle n'est pas déjà exécutée dans un Use Case backend).

---

## Domaine 4 : Learning & Digital Twin

**Engines à déplacer** : `CareerCopilotKnowledgeEvolutionEngine`, `CareerCopilotDigitalTwinEngine`.
**Plan d'action** : S'assurer que leur exécution est invoquée via des Use Cases et que les résultats (le "graphe") sont simplement passés à l'UI.

---

## Domaine 5 : ATS (Déjà conforme)

**Engines** : `ATSAIEngine`.
**Statut** : Conforme. Déjà appelé via `dashboard/ats/actions.ts` avec `"use server"`.
**Plan d'action** : Ne rien faire, l'utiliser comme référence d'architecture.

---

## Actions Transverses de Protection (Sprint 6.6)

Pour s'assurer qu'aucun autre développeur ne reproduira le problème :

### 1. Tagging `server-only` (Incrémental)
Le tag `server-only` ne sera ajouté qu'à la fin de la migration de chaque domaine spécifique, afin de ne jamais casser la CI principale en cours de processus.

### 2. Règles ESLint & Architecture (`dependency-cruiser`)
Ajout de règles ESLint custom et d'un script `pnpm architecture:check` pour vérifier les graphes transverses :
- `components/**` ne peut pas importer `core/intelligence/**`.
- `hooks/**` ne peut pas importer `core/prompts/**`.
- `app/**` en "use client" ne peut pas importer `core/ai/**`.
```json
"no-restricted-imports": ["error", {
  "paths": [
    {
      "name": "@/core/intelligence",
      "message": "L'Intelligence Artificielle est strictement réservée au serveur. Utilisez une Server Action."
    }
  ]
}]
```

### 3. CI Controls
Ajouter une étape dans la CI GitHub Actions (par exemple) qui exécute l'analyse Webpack et vérifie qu'aucun module IA n'est bundlé côté client.

---
**Estimation Globale de la Migration** : 3 jours pleins pour l'ensemble du refactoring, des tests unitaires et de l'implémentation des verrous de sécurité.
