# Code Mort - Moteur d'Entretien

Ce document liste exhaustivement les composants d'intelligence artificielle de Trajectoire qui sont codés, présents dans le repository, mais **jamais appelés** par le flux d'exécution réel de l'entretien. 

## 1. lib/ai/prompting/AdvancedPromptBuilder.ts

**État :** CODE MORT TOTAL.
- **Description :** Cette classe complexe est censée construire un prompt multi-couches (Rules, Persona, Context, Memory, Format).
- **Preuve :** Une recherche globale de son nom indique qu'il n'est importé nulle part en dehors de son propre fichier.
- **Impact :** La richesse contextuelle prévue pour le LLM est perdue au profit d'un prompt statique basique présent dans `lib/ai/prompts/interview.ts`.

## 2. lib/ai/memory/ConversationMemory.ts

**État :** CODE MORT TOTAL.
- **Description :** Prévu pour gérer une fenêtre glissante intelligente des messages, avec seuils dynamiques.
- **Preuve :** Jamais importé ni instancié dans `interview.service.ts` ni `ConversationService.ts`.
- **Impact :** Remplacé en production par un brutal `array.slice(-10)`.

## 3. lib/ai/memory/SummaryMemory.ts

**État :** CODE MORT TOTAL.
- **Description :** Prévu pour archiver l'historique complet d'une conversation sous forme résumée.
- **Preuve :** Jamais importé.
- **Impact :** La mémoire au-delà de 10 messages est irréversiblement perdue pendant l'entretien.

## 4. lib/ai/memory/MemoryManager.ts

**État :** CODE MORT TOTAL.
- **Description :** Orchestrateur qui était censé coordonner `ConversationMemory` et `SummaryMemory`.
- **Preuve :** Jamais importé.
- **Impact :** Aucun transfert d'information entre le court-terme et le long-terme.

## 5. domain/entities/ConversationState.ts

**État :** CODE MORT TOTAL.
- **Description :** Contient la classe `ConversationStateEntity`, ainsi que les types `ConversationPhase` (Introduction, Competencies, Conclusion) et `EmotionalState` (stress, confiance, hésitation).
- **Preuve :** Jamais importé ni instancié. 
- **Impact :** L'entretien ne possède aucune structure logique ou sémantique. Le flux n'avance pas par phases contrôlées.

## 6. domain/valueObjects/RecruiterPersona.ts

**État :** CODE MORT TOTAL.
- **Description :** Définit 8 personas précis (ex: CEO, RH, Tech) avec tons, ratios de temps de parole, et comportement de relance.
- **Preuve :** Jamais importé.
- **Impact :** L'IA a un comportement uniforme, très "LLM standard", quel que soit le contexte métier voulu.

## 7. domain/valueObjects/DifficultyLevel.ts

**État :** CODE MORT TOTAL.
- **Description :** Définit la difficulté de l'entretien (Beginner à Expert) avec impact sur la profondeur attendue.
- **Preuve :** Jamais importé.
- **Impact :** L'évaluation de la difficulté est déléguée au petit bonheur la chance par le LLM.

---

### Conclusion sur le Code Mort

La quasi-totalité de l'intelligence artificielle "complexe" prévue par l'architecte du projet n'a pas été branchée. L'implémentation s'est arrêtée en plein vol, laissant des modèles de domaine très riches complètement déconnectés de l'API de simulation.
