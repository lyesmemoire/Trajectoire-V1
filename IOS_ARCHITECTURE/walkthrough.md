# Interview Operating System — Phase 0 (Cognitive Core)

> **Scope** : Implémentation du Modèle Cognitif du Recruteur (Partie 2 de l'Audit / Refonte de l'Architecture IOS)
> **Status** : ✅ Achevée avec succès

---

## 🧠 Modèle Cognitif (Source de Vérité Absolue)

L'intégralité du modèle cognitif du recruteur a été implémentée dans un espace totalement isolé (`src/domain/cognitive/`). Ce modèle est :
1. **Totalement indépendant du LLM** : Aucune logique métier ou de confiance n'est déléguée à OpenAI/Anthropic.
2. **Fortement typé et validé** : Tous les contrats passent par `Zod` pour garantir l'immutabilité et l'absence d'erreurs (aucun `any`, aucun pseudo-code).
3. **Fonctionnel (Mathématique pure)** : L'évolution de l'état (ex: Confiance) repose sur des fonctions pures et déterministes.

### Entités Créées (Validées par Zod)

| Entité | Fichier | Description |
|---|---|---|
| **Node** / **Edge** | `Node.ts`, `Edge.ts` | Composants du graphe, agnostiques au métier (Nodes et Relations). |
| **Evidence** | `Evidence.ts` | Preuves structurées avec métriques (spécificité, profondeur, crédibilité). |
| **Confidence** | `Confidence.ts` | Moteur mathématique calculant la confiance (via moyenne géométrique pénalisée). |
| **Competency** | `Competency.ts` | Statut déduit dynamiquement (`UNKNOWN` → `PARTIAL` → `LIKELY` → `VERIFIED`). |
| **Hypothesis** | `Hypothesis.ts` | Croyances nécessitant d'être validées ou rejetées par des preuves (`PENDING` → `VALIDATED`). |
| **Unknown** | `Unknown.ts` | Zones d'incertitudes prioritaires avec score mathématique d'impact. |
| **WeakSignal** | `WeakSignal.ts` | Signaux faibles (buzzwords, évitement) déclenchant des pénalités de confiance. |
| **InterviewBudget** | `InterviewBudget.ts` | Suivi immuable des ressources temporelles, cognitives et des tokens. |
| **Strategy** / **Goal** | `Strategy.ts`, `InterviewGoal.ts` | Orientation de l'investigation (tempo, challenge, cibles). |
| **Decision** | `Decision.ts` | La prochaine action structurée du directeur (ex: `VERIFY`, `GO_DEEPER`). |
| **Risk** | `Risk.ts` | Évaluation mathématique du risque global de l'entretien (sur-évaluation, etc.). |
| **KnowledgeGraph** | `KnowledgeGraph.ts` | Agrégat graphe de connaissances immuable avec accesseurs purs (Node/Edge count). |
| **CognitiveState** | `CognitiveState.ts` | **L'état global de l'IOS.** Sérialisable et répondant aux 7 questions clés de l'entretien. |
| **Index (Barrel)** | `index.ts` | Point d'entrée central exportant proprement toutes les entités, types et schémas. |

---

## 🧪 Validation & Tests (Vitest & Zod)

> **Exécution : 86 tests exécutés, 100% PASS**

Une suite de tests exhaustifs a été mise en place dans `tests/cognitive/` pour garantir que la logique métier de ce cerveau réponde aux spécifications sans jamais faillir :

1. **`ZodValidation.test.ts`** : Garantit que les schémas rejettent les inputs invalides (confiance > 1, typologies erronées, chaînes vides).
2. **`CognitiveState.test.ts`** : Teste les "7 Questions" (ex: `canConclude()`, `getRemainingUnknowns()`) et la sérialisation/désérialisation parfaite.
3. **`KnowledgeGraph.test.ts`** : Valide l'immutabilité du graphe (les méthodes de mutation retournent toujours de nouvelles instances pures).
4. **`Confidence.test.ts`** : S'assure que la confiance est une mathématique stricte, avec application rigoureuse des pénalités pour contradictions et signaux faibles.
5. **`Competency.test.ts` & `Hypothesis.test.ts`** : Vérifie la machine à états de statut (déduction automatique).
6. **`InterviewBudget.test.ts`** : Teste l'épuisement du budget de l'entretien sans effets de bord.
7. **`UnknownWeakSignalRisk.test.ts`** : Vérifie le calcul de la gravité des signaux faibles et des niveaux de risque globaux.

*(Toutes les erreurs de chemins d'import liées à la modularisation ont été corrigées et les types TypeScript compilent parfaitement)*.

---

## 🚀 Prochaines Étapes

Le **Cerveau du Recruteur** (modèle cognitif) est opérationnel, structuré, et validé. Il est prêt à être nourri par le `Reducer` de l'IOS (Phase 1) pour maintenir l'état sans jamais dépendre du "chat history" traditionnel.

Le feature flag `INTERVIEW_ENGINE=ios` (soit via variable d'environnement, soit via `FeatureFlagService.ts`) garantit que le moteur actuel `Trajectoire` reste intouché en production pendant que l'IOS s'appuie sur cette nouvelle fondation forte.

---

## 👁️ Phase 1 — Perception Engine

Le **Perception Engine** a été implémenté en tant que premier maillon de la chaîne cognitive (`src/lib/ai/engines/perception/`). Son rôle est exclusif : extraire des faits observables (Observations) sans jamais juger, inférer ou noter.

### Architecture & Contrats

1. **`PerceptionSchema.ts` & `PerceptionTypes.ts`** : Définissent rigoureusement le contrat de l'output (zod `Structured Outputs`) et mappent le tout vers l'Event `OBSERVATION_EXTRACTED` qui hérite du socle de la Phase 0.
2. **`PerceptionPrompt.ts`** : Un *system prompt* chirurgical. Il interdit l'inférence et définit les cas limites (ex: "I think I'm good" -> `CLAIM`, "I migrated 180 services" -> `FACT`, `METRIC`, etc.).
3. **`PerceptionEngine.ts`** : Implémente l'interface `Engine` de la Phase 0. Pour garantir le découplage avec OpenAI, il s'appuie sur l'interface `StructuredLLMProvider`. Le moteur inclut des post-traitements natifs (ex: forcer `UNKNOWN` si le LLM hallucine sur un "Je ne sais pas").

### Validation & Cas Limites

Une suite de tests (`PerceptionEngine.test.ts`) simule le fournisseur LLM via un *Mock Provider* et s'assure que le moteur gère parfaitement l'extraction dans 7 scénarios imposés :
- Extraction stricte de type `CLAIM` pour les phrases vagues.
- Multi-extraction pour les phrases denses (ex: `FACT` + `METRIC` + `TECHNOLOGY` + `RESPONSIBILITY`).
- Reconnaissance absolue des cas de `FAILURE` (incidents), `UNKNOWN` (oublis), et conformité avec `EngineResult`.

---

## 🔎 Phase 2 — Evidence Engine

Le **Evidence Engine** a été implémenté (`src/lib/ai/engines/evidence/`). C'est le composant le plus critique de l'architecture : il qualifie la valeur d'une observation, sans jamais générer de décision globale ou de score magique. 

### Spécificités Techniques

1. **Extraction de Dimensions Pures** : Le moteur évalue la preuve selon des dimensions mathématiques normalisées de 0 à 1 (ex: *Specificity*, *Quantification*, *ProductionReality*).
2. **Missing Evidence & Graph Linking** : La structure `AnalyzedEvidenceSchema` oblige le modèle LLM à formuler explicitement **ce qui manque** à une preuve (ex: "métriques", "taille de l'équipe") et prépare le terrain pour le graphe (`supports`, `contradicts`).
3. **Mise en commun des Providers** : L'interface `StructuredLLMProvider` a été basculée dans `src/lib/ai/contracts/LLMProvider.ts` pour être partagée entre le *Perception Engine* et l'*Evidence Engine*.

### Validation & Stress-Test

- Une suite de tests massive a été conçue (`EvidenceEngine.test.ts`), exécutant **101 tests unitaires**.
- Ces tests couvrent 10 grands cas d'usage déclinés : 
  - Les affirmations subjectives (rejetées comme `isEvidence: false`).
  - Les preuves techniques fortes.
  - Les contradictions (qui lient correctement `contradicts`).
  - L'absence de métriques.
  - L'incertitude et la sécurité.
- **Résultat** : Déterminisme absolu, Zod strict, et 0% d'accès LLM direct.
