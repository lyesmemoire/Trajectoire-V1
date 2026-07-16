# SPRINT 23 — Raisonnement Conversationnel

## Objectif

Le Career Copilot ne doit plus seulement répondre aux questions du candidat. Il doit raisonner comme un véritable coach carrière expérimenté. Chaque réponse doit donner l'impression que l'IA comprend l'évolution du candidat, se souvient de son historique et explique ses conclusions.

---

## Contraintes Respectées

✅ **Aucun nouvel Engine créé** - Réutilisation de CareerCopilotConversationEngine
✅ **Aucun nouveau Service créé**
✅ **Aucun nouveau Repository créé**
✅ **Aucun nouveau Builder créé**
✅ **Aucun nouveau Provider créé**
✅ **Aucun nouveau Brain créé** - Réutilisation de CandidateAIBrain
✅ **Aucun nouveau Graph créé**
✅ **Aucun nouveau Manager créé**
✅ **Aucune nouvelle couche d'architecture créée**

---

## Fichiers Modifiés

### 1. `core/ai/Prompts/career-copilot-conversation-v1.ts`

**Version:** v1 → v2

**Modifications:**

#### Ajout du raisonnement interne
- **Étapes de raisonnement obligatoires avant toute réponse:**
  1. Comprendre précisément la question du candidat
  2. Identifier les parties du CandidateGraph concernées
  3. Identifier les observations pertinentes du CandidateAIBrain
  4. Identifier les analyses historiques liées au sujet
  5. Comparer la situation actuelle avec les analyses précédentes
  6. Déterminer ce qui a changé
  7. Déterminer ce qui est resté stable
  8. Identifier les causes probables des évolutions observées
  9. Évaluer les conséquences sur l'employabilité, les performances ou les objectifs
  10. Construire une réponse cohérente en tenant compte de tout l'historique

#### Structure de réponse enrichie
- **Réponse directe** - Répondre clairement, pas de détour
- **Explication** - Pourquoi cette réponse est donnée
- **Comparaison** - Comparer avec analyses précédentes (progression, régression, stabilité)
- **Causes** - Identifier causes probables (uniquement données disponibles)
- **Conséquences** - Expliquer impacts possibles (score, recrutement, ATS, communication, leadership, carrière)
- **Recommandation** - Action concrète cohérente avec objectifs et recommandations existantes

#### Comportement attendu
- Expliquer
- Justifier
- Comparer
- Contextualiser
- Nuancer
- Anticiper

#### Adaptation du ton
- **Progression:** Reconnaître progrès, encourager, proposer objectif ambitieux
- **Régression:** Expliquer causes, éviter ton culpabilisant, proposer plan de correction
- **Stagnation:** Identifier blocages, proposer nouvelle approche

#### Mémoire et continuité
- Toujours exploiter CandidateAIBrain pour se souvenir
- Continuité des recommandations (conserver, retirer, remplacer, expliquer)
- Jamais répondre comme si conversation était la première

#### Format JSON enrichi
```json
{
  "response": string,
  "reasoning": string,  // NOUVEAU
  "evidence": string[],
  "recommendations": string[],
  "context": {
    "score": number,
    "trend": "improving" | "stable" | "declining",
    "keyObservations": string[]
  }
}
```

#### Nouvelle variable
- `previousAnalyses` - Analyses historiques pour comparaison

---

### 2. `core/intelligence/engines/careerCopilotConversationEngine.ts`

**Modifications:**

#### Interface enrichie
```typescript
export interface ConversationOutput {
  response: string;
  reasoning: string;  // NOUVEAU
  evidence: string[];
  recommendations: string[];
  context: {
    score: number;
    trend: "improving" | "stable" | "declining";
    keyObservations: string[];
  };
}
```

#### Extraction des analyses précédentes
- `findHistory("career-analysis", 3)` - 3 dernières analyses carrière
- `findHistory("recommendations", 3)` - 3 dernières recommandations
- `findHistory("action-plan", 3)` - 3 derniers plans d'action

#### Formatage des analyses précédentes
```typescript
const previousAnalyses = `
Career Analyses:
${previousCareerAnalyses.length > 0 ? previousCareerAnalyses.join("\n") : "None"}

Recommendations:
${previousRecommendations.length > 0 ? previousRecommendations.join("\n") : "None"}

Action Plans:
${previousActionPlans.length > 0 ? previousActionPlans.join("\n") : "None"}
`;
```

#### Détermination de la tendance
- Extraction de `candidateGraph.progress.trend`
- Extraction de `candidateGraph.progress.change`

#### Configuration mise à jour
- `promptVersion: "v2"` (au lieu de v1)
- `maxTokens: 1500` (au lieu de 1000) pour permettre raisonnement plus détaillé

#### Passage de la nouvelle variable
- Ajout de `previousAnalyses` dans les variables du prompt

---

### 3. `components/dashboard/career-copilot-chat.tsx`

**Modifications:**

Aucune modification nécessaire pour l'interface. Le champ `reasoning` est généré par l'IA mais n'est pas affiché à l'utilisateur (conformément aux spécifications: le candidat ne voit jamais ce raisonnement).

---

## Composants Réutilisés

### 1. AIOrchestrator
- **Rôle:** Exécution des prompts IA avec raisonnement
- **Utilisation:** Exécute le prompt `career-copilot-conversation-v1` (v2)
- **Configuration:** provider: openai, model: gpt-4-turbo, temperature: 0.7, maxTokens: 1500

### 2. CandidateAIBrain
- **Rôle:** Mémoire des analyses historiques pour comparaison
- **Méthodes utilisées:**
  - `findHistory("career-analysis", 3)` - Analyses carrière précédentes
  - `findHistory("recommendations", 3)` - Recommandations précédentes
  - `findHistory("action-plan", 3)` - Plans d'action précédents
  - `getObservations()` - Observations historiques
  - `getInsights()` - Insights récents
  - `getGoals()` - Objectifs en cours
  - `addObservation()` - Sauvegarde de la conversation

### 3. EventBus
- **Rôle:** Publication des événements de conversation
- **Événement publié:** `ObservationCreatedEvent`
- **Payload:** question, answer, evidence, recommendations

### 4. CandidateGraph
- **Rôle:** État courant du candidat pour le contexte
- **Données utilisées:**
  - `progress.trend` - Tendance actuelle
  - `progress.change` - Changement de score
  - Scores, forces, faiblesses, recommandations

---

## Logique de Raisonnement Ajoutée

### Étape 1: Compréhension de la question
- L'IA analyse la question du candidat
- Identifie le sujet (score, compétences, recommandations, progression, risques)

### Étape 2: Identification des données pertinentes
- Sélectionne les parties de CandidateGraph concernées
- Filtre les observations de CandidateAIBrain pertinentes

### Étape 3: Comparaison historique
- Compare situation actuelle avec analyses précédentes
- Identifie ce qui a changé
- Identifie ce qui est resté stable

### Étape 4: Analyse des causes
- Déduit les causes probables des évolutions observées
- N'invente jamais, utilise uniquement les données disponibles

### Étape 5: Évaluation des conséquences
- Évalue impacts sur employabilité
- Évalue impacts sur performances
- Évalue impacts sur objectifs

### Étape 6: Construction de la réponse
- Réponse directe
- Explication du pourquoi
- Comparaison avec historique
- Causes identifiées
- Conséquences possibles
- Recommandation cohérente

---

## Exemples Avant / Après

### Avant (Sprint 22)
**Question:** "Pourquoi mon score a diminué ?"

**Réponse:**
"Ton score actuel est de 71. Il est inférieur de 4 points à ton précédent entretien. Je te recommande de travailler la communication."

### Après (Sprint 23)
**Question:** "Pourquoi mon score a diminué ?"

**Réponse:**
"Ton score actuel est de 71.

Il est inférieur de 4 points à ton précédent entretien.

Cette baisse n'est pas liée à ton leadership qui reste stable.

En revanche, nous observons depuis trois simulations une diminution progressive de la qualité de tes réponses structurées.

C'est cette évolution qui explique principalement la baisse du score.

La bonne nouvelle est que tes compétences techniques restent solides.

Je te recommande maintenant une simulation orientée communication afin de corriger cette tendance avant qu'elle n'affecte davantage ton employabilité."

---

## Flux Complet de Traitement

### Étape 1: Utilisateur pose question
- Utilisateur tape question dans interface de chat

### Étape 2: Appel à l'Engine
- Chat UI appelle `CareerCopilotConversationEngine.generateResponse()`
- Passage de: userQuestion, candidateGraph, conversationHistory

### Étape 3: Extraction des données
- Engine extrait données de CandidateGraph (scores, trend, change)
- Engine extrait analyses précédentes de CandidateAIBrain (career-analysis, recommendations, action-plan)
- Engine extrait observations, insights, goals de CandidateAIBrain
- Engine formate historique de conversation

### Étape 4: Appel à AIOrchestrator
- Engine appelle `aiOrchestrator.execute()` avec prompt v2
- Passage de toutes les données formatées + previousAnalyses

### Étape 5: Raisonnement interne (IA)
- IA effectue les 10 étapes de raisonnement
- IA compare avec analyses précédentes
- IA identifie causes et conséquences
- IA construit réponse structurée

### Étape 6: Génération de la réponse
- AIOrchestrator exécute prompt via OpenAI GPT-4-turbo
- L'IA génère réponse avec reasoning, evidence, recommendations

### Étape 7: Sauvegarde et publication
- Engine sauvegarde conversation dans CandidateAIBrain
- Engine publie événement sur EventBus

### Étape 8: Affichage de la réponse
- Chat UI affiche réponse (sans reasoning)
- Affichage des preuves et recommandations

---

## Résultats TypeScript

### Typecheck
- **Erreurs totales:** 52 erreurs
- **Erreurs nouvelles:** 0
- **Erreurs préexistantes:** 52 (interviewAnalyzer, memoryEngine, progressEngine, etc.)
- **Statut:** Aucune nouvelle erreur introduite

---

## Résultats ESLint

### ESLint
- **Problèmes totaux:** 1597 problèmes (232 erreurs, 1365 warnings)
- **Erreurs nouvelles:** 0
- **Warnings nouveaux:** 0
- **Statut:** Aucun nouveau problème introduit

---

## Confirmation

✅ **Aucun nouveau fichier architectural créé**
✅ **Aucune nouvelle fonctionnalité utilisateur ajoutée** (uniquement amélioration du raisonnement)
✅ **Aucune modification UI** (seulement prompt et engine)
✅ **Réutilisation maximale des composants existants**
✅ **Aucun appel IA direct depuis React**
✅ **Aucune duplication de logique**
✅ **Architecture respectée**

---

## Conclusion

Le Sprint 23 a réussi à ajouter un raisonnement conversationnel profond au Career Copilot en modifiant uniquement le prompt et l'engine existant:

- **Prompt v2** - Ajout des 10 étapes de raisonnement interne, structure de réponse enrichie, adaptation du ton selon situation
- **Engine enrichi** - Extraction des analyses précédentes pour comparaison, détermination de la tendance, passage du contexte historique

Le Copilot raisonne maintenant comme un véritable coach carrière:
- Il compare avec les analyses précédentes
- Il identifie les causes probables
- Il évalue les conséquences
- Il adapte son ton selon la situation
- Il assure la continuité des recommandations

L'utilisateur perçoit une véritable compréhension de son évolution et des réponses cohérentes avec son historique, sans aucune nouvelle architecture ni duplication de logique.
