# Audit Architecture Moteur d'Entretien

Cet audit cartographie le moteur d'entretien de façon stricte. Aucune hypothèse n'est faite. Tout élément listé est adossé à une preuve d'utilisation ou de non-utilisation dans le code.

## 1. Architecture Générale

Le système est censé être un moteur conversationnel intelligent, mais l'exécution réelle est un pipeline linéaire très basique.

- **Point d'entrée réel** : `c:\Trajectoire\apps\web\src\app\api\simulation\message\route.ts` (API route appelée par le client).
- **Service exécuté** : `c:\Trajectoire\apps\web\src\application\services\ConversationService.ts` (qui orchestre la base de données, les quotas et l'idempotence).
- **Service IA exécuté** : `c:\Trajectoire\apps\web\src\lib\ai\services\interview.service.ts` (qui gère l'appel à `AIClient`).
- **Services jamais utilisés** : 
  - `MemoryManager`, `ConversationMemory`, `SummaryMemory` dans `lib/ai/memory/`
  - `AdvancedPromptBuilder` dans `lib/ai/prompting/`
  - `ConversationStateEntity`, `RecruiterPersona`, `DifficultyLevelVO` dans `domain/`
- **Dépendances circulaires** : Aucune identifiée dans ce flux.
- **Responsabilités des couches** :
  - **API Route** : Validation des inputs, facturation, idempotence.
  - **Application Service** : Sécurité, persistance DB des messages, appel de l'IA.
  - **AI Service** : Concaténation de strings, appel direct à OpenAI.

## 2. Orchestration

- **Qui décide de la prochaine question ?** Le LLM (OpenAI `gpt-4o`) via son prompt natif (`Ask relevant, thoughtful questions`).
- **Qui décide du changement de sujet ?** Le LLM.
- **Qui décide de la difficulté ?** Le LLM, indirectement via le `level` passé dans le prompt (aucun moteur interne de difficulté).
- **Qui décide du rythme ?** Le LLM.
- **Qui décide de la fin de l'entretien ?** Le LLM (le backend limite la taille à 50 messages, mais ne gère pas sémantiquement la fin).

*Le LLM décide seul de l'intégralité du comportement conversationnel, le code applicatif n'ayant aucune logique de contrôle (State Machine).*

## 3. State Machine

- `ConversationState` : Existe dans `domain/entities/ConversationState.ts`. **CODE MORT**. Jamais instancié au runtime.
- `ConversationPhase` : Existe (enum). **CODE MORT**. Jamais évalué.
- `StateMachine` / `Workflow` / `Transition` / `Strategy` : **ABSENT**.

## 4. Prompt Builder

- `AdvancedPromptBuilder` (situé dans `lib/ai/prompting/AdvancedPromptBuilder.ts`).
  - **Existe ?** Oui.
  - **Utilisé ?** Non. **CODE MORT**.
  - **Tests ?** **ABSENT** (aucun fichier `.test.ts` trouvé).
  - **Fonctionnalités couvertes (en théorie)** : 11 couches de prompts, gestion dynamique du système, formatage, règles.

## 5. Personas

- **Liste disponible** : `HR_BENEVOLENT`, `MANAGER_DEMANDING`, `TECHNICAL_RECRUITER`, `CEO`, `STARTUP`, `LARGE_CORPORATION`, `RECRUITMENT_FIRM`, `CONSULTANT`.
- **Où défini ?** `domain/valueObjects/RecruiterPersona.ts`.
- **Où injecté ?** Nulle part.
- **Réellement utilisé ?** Non. **CODE MORT**.

## 6. Mémoire

- **Mémoire court terme** : `slice(-20)` messages dans `ConversationService.ts`, puis `slice(-10)` dans `interview.service.ts`. **PARTIEL**.
- **Mémoire intelligente (MemoryManager)** : **CODE MORT**.
- **Résumé (SummaryMemory)** : **CODE MORT**.
- **Mémoire de session persistante** : Les messages sont stockés dans la base PostgreSQL via `MessageRepository`. **OK**.
- **Mémoire utilisateur (projets, etc.)** : **ABSENT**.

## 7. Raisonnement

Le moteur actuel est un *chatbot réactif*.
- Hypothèses : **ABSENT**.
- Niveau de confiance : **ABSENT**.
- Arbre de décision : **ABSENT**.
- Stratégie d'entretien : **ABSENT**.
- Changement dynamique de stratégie : **ABSENT**.
- Planification des questions : **ABSENT**.

## 8. Évaluation

- **Quand ?** Post-mortem (à la demande de l'utilisateur après l'entretien via l'API `/api/report/generate`).
- **Comment ?** Envoi complet du transcript de l'entretien au LLM. Le LLM sort un JSON direct avec les scores 0-100.
- **Où ?** `lib/ai/services/report.service.ts` -> `AIReportService.generateReport`.
- **Preuves ?** Aucune trace ou citation de texte n'est renvoyée pour justifier le score généré. **PARTIEL**.

## 9. Contexte Candidat

Le moteur utilise-t-il réellement les informations du candidat pendant l'entretien ?
- **CV** : **ABSENT** (le CV est analysé dans `cv.service.ts` mais n'est pas injecté dans le prompt de `interview.service.ts`).
- **Compétences / Expériences / Projets** : **ABSENT** (non injectés au runtime).
- **JobTitle / Level** : **OK** (Injectés au début : `Position: ${jobTitle}, Level: ${level}`).
- **Certifications / ATS / Career DNA** : **ABSENT**.

---

## Matrice Finale

| Domaine | Existe | Utilisé | Couverture | État |
|---------|--------|---------|------------|------|
| Point d'Entrée API | Oui | Oui | 100% | **OK** |
| Persistance DB | Oui | Oui | 100% | **OK** |
| LLM Wrapper | Oui | Oui | 10% de l'intelligence requise | **PARTIEL** |
| AdvancedPromptBuilder | Oui | Non | 0% | **CODE MORT** |
| Mémoire Glissante (Intelligente) | Oui | Non | 0% | **CODE MORT** |
| Troncature Naïve (slice) | Oui | Oui | 100% | **OK** |
| State Machine / Workflow | Non | Non | 0% | **ABSENT** |
| RecruiterPersonas | Oui | Non | 0% | **CODE MORT** |
| DifficultyLevel | Oui | Non | 0% | **CODE MORT** |
| Raisonnement / Planification | Non | Non | 0% | **ABSENT** |
| Évaluation Temps Réel | Non | Non | 0% | **ABSENT** |
| Évaluation Post-Mortem | Oui | Oui | 100% (mais sans explication) | **PARTIEL** |
| Intégration CV | Partielle | Non | 0% (dans l'entretien) | **PARTIEL** |
