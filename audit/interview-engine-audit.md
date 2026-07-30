# Audit du Moteur d'Entretien (Interview Engine)

Cet audit évalue le niveau d'intelligence actuel du moteur d'entretien. L'investigation s'est concentrée sur les dossiers `apps/web/src/lib/ai` et `apps/web/src/domain`. 

**Le constat principal est clair :** Il existe un gouffre entre le domaine (qui contient des concepts avancés comme des phases, des personas, et des mémoires glissantes) et l'implémentation d'exécution réelle (qui est un simple passe-plat vers l'API OpenAI avec un prompt basique). Le code intelligent est actuellement du "dead code" (code mort).

---

### Synthèse Exécutive

| Domaine | État actuel | Forces | Faiblesses | Criticité |
|---------|-------------|--------|------------|-----------|
| **Orchestration** | Basique (Passe-plat LLM) | Code simple et direct | Composants avancés (`AdvancedPromptBuilder`, `ConversationStateEntity`) développés mais jamais appelés | **Critique** |
| **Mémoire** | Fenêtre glissante naïve | Ne sature pas le contexte | L'historique est tronqué brutalement aux 10 derniers messages (`slice(-10)`) ; la mémoire intelligente (`MemoryManager`) est ignorée | **Critique** |
| **Évaluation** | Post-mortem uniquement | Structure JSON standardisée via Zod | Pas d'évaluation en temps réel ; score calculé à la volée à la fin par un seul prompt (`ReportService.ts`) | **Haute** |
| **Déroulement** | Chatbot linéaire | Aucune | Aucune maîtrise du flux : le LLM décide de tout, aucune machine à état n'est utilisée | **Critique** |
| **Expertise RH** | Très faible | Présence de personas dans le code | Les personas ne sont pas injectés dans le prompt réel. L'évaluation RH se limite à 4 lignes dans `interview.ts` | **Moyenne** |
| **Technique** | Faible | Utilisation de gpt-4o | Pas de référentiel de compétences ; pas d'adaptation à la stack de l'utilisateur (seul le `jobTitle` est passé) | **Haute** |
| **Raisonnement** | Inexistant | Latence réduite (1 seul appel) | L'IA ne réfléchit pas (pas de Chain of Thought), elle ne fait que converser. Aucune explication des choix | **Critique** |
| **Observabilité** | Faible | `MetricsCollector` existant | Le LLM retourne des *strings* pures, on ignore totalement *pourquoi* une question est posée | **Haute** |
| **Prompts** | Statiques et monolithiques | Centralisés dans `prompts/` | Les prompts ne sont pas versionnés, non dynamiques et très courts | **Moyenne** |

---

### Analyse Détaillée par Domaine

#### 1. Architecture et Orchestration
- **État :** L'orchestration est gérée par `InterviewService.ts`. Les questions et réponses sont produites par un seul appel `chatCompletion`.
- **Découplage :** Sur le papier, les dossiers `prompting/`, `memory/`, et `schemas/` existent. En pratique, le fichier `AdvancedPromptBuilder.ts` (qui gère 11 couches de prompts, les personas, les règles) n'est importé par **absolument aucun fichier** du service. 
- **Preuve :** `InterviewService.generateNextResponse` n'utilise pas `AdvancedPromptBuilder` ni `ConversationStateEntity`.

#### 2. Déroulement de l'entretien
- **État :** Totalement délégué au modèle LLM sans garde-fou. 
- **Dynamique :** La stratégie se résume au prompt système statique (ex: `Ask relevant, thoughtful questions...`). Il n'y a pas de progression par phase (Introduction, Projet, Technique, RH, Conclusion), bien que l'enum `ConversationPhase` existe dans `domain/entities/ConversationState.ts`. L'ordre n'est régi que par l'humeur du LLM.

#### 3. Mémoire
- **État :** Court terme uniquement.
- **Preuve :** Dans `interview.service.ts` ligne 93 : `input.lastMessages?.slice(-10)`. Le système oublie littéralement tout ce qui a été dit il y a plus de 10 messages. 
- **Gâchis :** Toute la logique de summarisation et de mémoire persistante codée dans `MemoryManager.ts` et `ConversationMemory.ts` n'est connectée nulle part.

#### 4. Évaluation
- **État :** Calculée de façon asynchrone à la fin de l'entretien via `ReportService.generateReport()`.
- **Mécanique :** Envoie tout le transcript à GPT-4o avec le prompt `REPORT_SYSTEM_PROMPT` pour demander un score de 0 à 100 sur divers critères. Les scores ne sont ni expliqués, ni sourcés, ni argumentés. Ils sont sortis de manière probabiliste par le modèle.

#### 5. Expertise RH & Technique
- **État :** L'adaptation au profil ou à la technique est superficielle.
- **Preuve :** Le prompt se contente d'injecter : `Position: {jobTitle}, Level: {level}, Type: {interviewType}`. Le système ne lit pas le CV pendant l'entretien (le CV est analysé séparément par `CVService` mais n'est pas injecté dans le contexte de l'entretien dynamique).
- **Personas :** L'objet `RecruiterPersona` (ex: *Manager Exigeant*, *RH Bienveillant*) existe dans le code métier, mais n'est jamais poussé au LLM lors de l'exécution.

#### 6. Raisonnement
- **État :** Zéro raisonnement.
- Le moteur ne produit qu'une chaîne de texte (la question suivante). Il ne génère aucune pensée interne (type `<thought>`) ni aucune structure JSON lui permettant de statuer "je pose cette question parce que la réponse précédente était évasive".

#### 7. Observabilité
- **État :** Limitée aux métriques d'exécution.
- Il y a un `MetricsCollector` qui capture les latences, coûts et tokens, mais l'observabilité fonctionnelle est nulle. Si l'IA pose une mauvaise question, il est impossible de tracer quel composant (prompt, manque de contexte, mémoire effacée) en est la cause.

### Conclusion de l'Audit

Aujourd'hui, l'intelligence de Trajectoire se situe au niveau d'un **wrapper basique autour de l'API OpenAI**. 
Le travail d'architecture de pointe (State Machine, Personas, Advanced Prompts, Sliding Memory Window) a été brillamment modélisé dans les couches du `domain` et `lib/ai/`, mais **l'intégration n'a jamais été finalisée**. Le moteur d'exécution actuel contourne toutes ces couches pour faire le strict minimum.
