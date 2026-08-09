# DOC-032-02 : Algorithme du Rebond Intelligent (6 Options + Critères de Choix)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'algorithme du rebond intelligent pour MVP-032 Conversational Intelligence Engine. Cet algorithme analyse ce qui vient d'être dit et propose le rebond optimal parmi 6 options, avec des critères de choix pour sélectionner la meilleure option.

---

## 2. Principe Fondateur

Le moteur ne propose pas la question suivante de la grille. Il analyse CE QUI VIENT D'ÊTRE DIT et propose le rebond optimal. C'est la capacité la plus sophistiquée du module : l'intelligence du rebond qui transforme un interrogatoire structuré en un dialogue authentique.

---

## 3. Les 6 Options de Rebond

### 3.1 Option A — Creuser la Réponse

**Description :**
Approfondir la réponse actuelle pour obtenir plus de détails.

**Critères de choix :**
- Signal important détecté dans la réponse
- Réponse intéressante mais superficielle
- Potentiel d'exploration élevé
- Dimension critique pour la décision

**Exemple :**
```
Candidat : "J'ai géré des situations difficiles dans mon équipe."
Rebond : "Vous dites 'situations difficiles'.
          Quelle a été la plus difficile ?
          Décrivez-moi ce qui s'est passé exactement
          et ce que vous avez fait."
```

---

### 3.2 Option B — Demander un Exemple Concret

**Description :**
Demander un exemple concret pour illustrer une réponse trop générale.

**Critères de choix :**
- Réponse trop générale ou abstraite
- Aucun exemple fourni
- Besoin de contextualisation
- Dimension nécessitant des faits

**Exemple :**
```
Candidat : "Je suis quelqu'un de rigoureux et orienté résultats."
Rebond : "Donnez-moi un exemple précis
          qui illustre ce que vous dites.
          Une situation réelle, récente,
          où vous avez fait preuve de cette rigueur."
```

---

### 3.3 Option C — Clarifier une Ambiguïté

**Description :**
Clarifier une réponse ambiguë ou confuse.

**Critères de choix :**
- Réponse ambiguë ou contradictoire
- Manque de clarté
- Interprétation multiple possible
- Besoin de précision

**Exemple :**
```
Candidat : "Je pense que ça s'est bien passé globalement."
Rebond : "Quand vous dites 'globalement',
          y a-t-il des aspects qui se sont moins bien passés ?
          Qu'est-ce qui aurait pu être amélioré ?"
```

---

### 3.4 Option D — Explorer la Connexion

**Description :**
Explorer la connexion avec un échange précédent (cohérence ou incohérence).

**Critères de choix :**
- Cohérence détectée avec un échange précédent
- Incohérence détectée avec un échange précédent
- Évolution détectée
- Possibilité de créer une connexion significative

**Exemple :**
```
Candidat (début) : "J'aime les environnements structurés."
Candidat (30 min plus tard) : "Mon projet idéal serait très autonome,
                              sans trop de processus."
Rebond : "J'ai une question qui relie deux choses que vous avez dites.
          En début d'entretien vous parliez d'apprécier les environnements structurés.
          Et maintenant vous décrivez un projet idéal sans trop de processus.
          Comment vous expliquez cette tension ?
          Qu'est-ce que cela vous dit sur ce que vous cherchez vraiment ?"
```

---

### 3.5 Option E — Passer à un Autre Territoire

**Description :**
Passer à un autre territoire non encore exploré.

**Critères de choix :**
- Dimension actuelle suffisamment éclairée
- Temps limité
- Autres dimensions critiques non abordées
- Besoin de diversifier l'exploration

**Exemple :**
```
Candidat : [Réponse détaillée sur l'bérience technique]
Rebond : "Merci pour ces détails sur votre expérience technique.
          J'aimerais maintenant explorer votre style de leadership.
          Comment décririez-vous votre approche de management ?"
```

---

### 3.6 Option F — Laisser un Silence

**Description :**
Ne pas poser la question suivante et laisser un silence.

**Critères de choix :**
- Réponse trop rapide et trop lisse
- Candidat semble ne pas avoir donné sa vraie réponse
- La vraie réponse pourrait venir dans le silence
- Moment de réflexion nécessaire

**Exemple :**
```
Candidat : [Réponse rapide et lisse à une question difficile]
Rebond (pour le recruteur) : "Ne posez pas la question suivante.
                          Attendez 5 secondes.
                          Regardez-le.
                          La vraie réponse arrive souvent dans ce silence."
```

---

## 4. Algorithme du Rebond

### 4.1 Processus Global

```typescript
async function generateIntelligentRebound(
  lastExchange: ConversationExchange,
  memory: ConversationalMemory,
  context: InterviewContext
): Promise<IntelligentRebound> {
  
  // Étape 1 — Analyse de la dernière réponse
  const responseAnalysis = await analyzeLastResponse(lastExchange, memory);
  
  // Étape 2 — Identification du prochain mouvement
  const nextMovement = await identifyNextMovement(responseAnalysis, memory, context);
  
  // Étape 3 — Formulation du rebond
  const rebound = await formulateRebound(nextMovement, lastExchange, memory);
  
  return rebound;
}
```

---

### 4.2 Étape 1 — Analyse de la Dernière Réponse

```typescript
async function analyzeLastResponse(
  exchange: ConversationExchange,
  memory: ConversationalMemory
): Promise<ResponseAnalysis> {
  
  const analysis: ResponseAnalysis = {
    whatWasSaid: exchange.content.candidateResponse,
    dimensionIlluminated: exchange.dimensionEvaluated,
    certaintyLevelCreated: exchange.certaintyLevel.afterExchange,
    whatRemainsUnclear: await identifyUnclearAspects(exchange),
    whatWorthDiggingDeeper: await identifyDiggingOpportunities(exchange),
    connectionWithPrevious: await identifyConnections(exchange, memory),
    responseQuality: await evaluateResponseQuality(exchange),
    emotionalTone: await detectEmotionalTone(exchange),
    timing: await evaluateTiming(exchange, memory)
  };
  
  return analysis;
}
```

---

### 4.3 Étape 2 — Identification du Prochain Mouvement

```typescript
async function identifyNextMovement(
  analysis: ResponseAnalysis,
  memory: ConversationalMemory,
  context: InterviewContext
): Promise<NextMovement> {
  
  const scores: { [key: string]: number } = {};
  
  // Score pour Option A — Creuser la réponse
  scores['digDeeper'] = await scoreDigDeeper(analysis, memory, context);
  
  // Score pour Option B — Demander un exemple concret
  scores['askExample'] = await scoreAskExample(analysis, memory, context);
  
  // Score pour Option C — Clarifier une ambiguïté
  scores['clarifyAmbiguity'] = await scoreClarifyAmbiguity(analysis, memory, context);
  
  // Score pour Option D — Explorer la connexion
  scores['exploreConnection'] = await scoreExploreConnection(analysis, memory, context);
  
  // Score pour Option E — Passer à un autre territoire
  scores['switchTerritory'] = await scoreSwitchTerritory(analysis, memory, context);
  
  // Score pour Option F — Laisser un silence
  scores['silence'] = await scoreSilence(analysis, memory, context);
  
  // Sélectionner l'option avec le score le plus élevé
  const selectedOption = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  
  return {
    selectedOption,
    scores,
    justification: await justifySelection(selectedOption, scores, analysis)
  };
}
```

---

### 4.4 Critères de Choix par Option

#### Option A — Creuser la Réponse

**Critères de scoring :**
- Signal important détecté : +30
- Réponse superficielle : +25
- Potentiel d'exploration élevé : +20
- Dimension critique : +15
- Temps disponible suffisant : +10

**Seuil de sélection :** Score ≥ 70

---

#### Option B — Demander un Exemple Concret

**Critères de scoring :**
- Réponse trop générale : +35
- Aucun exemple fourni : +30
- Besoin de contextualisation : +25
- Dimension nécessitant des faits : +20
- Temps disponible suffisant : +10

**Seuil de sélection :** Score ≥ 75

---

#### Option C — Clarifier une Ambiguïté

**Critères de scoring :**
- Réponse ambiguë : +35
- Manque de clarté : +30
- Interprétation multiple : +25
- Besoin de précision : +20

**Seuil de sélection :** Score ≥ 70

---

#### Option D — Explorer la Connexion

**Critères de scoring :**
- Cohérence détectée : +30
- Incohérence détectée : +40
- Évolution détectée : +25
- Connexion significative : +35

**Seuil de sélection :** Score ≥ 65

---

#### Option E — Passer à un Autre Territoire

**Critères de scoring :**
- Dimension suffisamment éclairée : +30
- Temps limité : +35
- Autres dimensions non abordées : +25
- Besoin de diversification : +20

**Seuil de sélection :** Score ≥ 70

---

#### Option F — Laisser un Silence

**Critères de scoring :**
- Réponse trop rapide : +40
- Réponse trop lisse : +35
- Candidat semble insincère : +30
- Moment de réflexion nécessaire : +25

**Seuil de sélection :** Score ≥ 80

---

### 4.5 Étape 3 — Formulation du Rebond

```typescript
async function formulateRebound(
  movement: NextMovement,
  lastExchange: ConversationExchange,
  memory: ConversationalMemory
): Promise<IntelligentRebound> {
  
  let formulation: string;
  let recommendedTone: string;
  let whyNow: string;
  
  switch (movement.selectedOption) {
    case 'digDeeper':
      formulation = await formulateDigDeeperRebound(lastExchange, memory);
      recommendedTone = 'curieux';
      whyNow = 'Signal important détecté qui mérite d'être creusé';
      break;
      
    case 'askExample':
      formulation = await formulateExampleRebound(lastExchange, memory);
      recommendedTone = 'bienveillant';
      whyNow = 'Réponse trop générale nécessitant un exemple concret';
      break;
      
    case 'clarifyAmbiguity':
      formulation = await formulateClarificationRebound(lastExchange, memory);
      recommendedTone = 'neutre';
      whyNow = 'Ambiguïté détectée nécessitant clarification';
      break;
      
    case 'exploreConnection':
      formulation = await formulateConnectionRebound(lastExchange, memory);
      recommendedTone = 'analytique';
      whyNow = 'Connexion significative avec un échange précédent';
      break;
      
    case 'switchTerritory':
      formulation = await formulateSwitchRebound(lastExchange, memory);
      recommendedTone = 'transitionnel';
      whyNow = 'Dimension suffisamment éclairée, temps de passer à autre territoire';
      break;
      
    case 'silence':
      formulation = 'Ne posez pas la question suivante. Attendez 5 secondes.';
      recommendedTone = 'patient';
      whyNow = 'La vraie réponse pourrait venir dans le silence';
      break;
  }
  
  return {
    formulation,
    recommendedTone,
    whyNow,
    selectedOption: movement.selectedOption,
    scores: movement.scores
  };
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface ResponseAnalysis {
  whatWasSaid: string;
  dimensionIlluminated: string;
  certaintyLevelCreated: number;
  whatRemainsUnclear: string[];
  whatWorthDiggingDeeper: string[];
  connectionWithPrevious: {
    consistencies: string[];
    inconsistencies: string[];
    evolutions: string[];
  };
  responseQuality: 'excellent' | 'good' | 'fair' | 'poor';
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'stressed';
  timing: 'fast' | 'normal' | 'slow';
}

interface NextMovement {
  selectedOption: 'digDeeper' | 'askExample' | 'clarifyAmbiguity' | 'exploreConnection' | 'switchTerritory' | 'silence';
  scores: {
    digDeeper: number;
    askExample: number;
    clarifyAmbiguity: number;
    exploreConnection: number;
    switchTerritory: number;
    silence: number;
  };
  justification: string;
}

interface IntelligentRebound {
  reboundId: string;
  exchangeId: string;
  
  formulation: string;
  recommendedTone: string;
  whyNow: string;
  
  selectedOption: string;
  scores: any;
  
  metadata: {
    generatedAt: Date;
    version: string;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE intelligent_rebound (
  id VARCHAR(36) PRIMARY KEY,
  exchange_id VARCHAR(36) NOT NULL,
  
  formulation TEXT NOT NULL,
  recommended_tone VARCHAR(50) NOT NULL,
  why_now TEXT NOT NULL,
  
  selected_option VARCHAR(50) NOT NULL CHECK (selected_option IN ('digDeeper', 'askExample', 'clarifyAmbiguity', 'exploreConnection', 'switchTerritory', 'silence')),
  scores JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (exchange_id) REFERENCES conversation_exchange(id)
);

CREATE INDEX idx_intelligent_rebound_exchange ON intelligent_rebound(exchange_id);
CREATE INDEX idx_intelligent_rebound_option ON intelligent_rebound(selected_option);
```

---

## 7. API Endpoints

```typescript
// POST /api/conversational/rebound/generate
async function generateIntelligentRebound(
  lastExchange: ConversationExchange,
  memory: ConversationalMemory,
  context: InterviewContext
): Promise<IntelligentRebound> {
  return await generateIntelligentRebound(lastExchange, memory, context);
}

// GET /api/conversational/rebound/:reboundId
async function getIntelligentRebound(reboundId: string): Promise<IntelligentRebound> {
  return await getIntelligentReboundById(reboundId);
}

// GET /api/conversational/rebound/exchange/:exchangeId
async function getReboundByExchange(exchangeId: string): Promise<IntelligentRebound> {
  return await getReboundByExchange(exchangeId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'adoption | Rebonds suivis / proposés | ≥ 70% |
- Taux de pertinence | Rebonds pertinents / proposés | ≥ 85% |
- Satisfaction recruteurs | Satisfaction avec les rebonds | ≥ 4.5/5 |
- Diversité des options | Distribution équilibrée des options | Équilibrée |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de la qualité des entretiens | Amélioration de la qualité des entretiens | ≥ 35% |
- Réduction des questions ratées | Réduction des questions non pertinentes | ≥ 40% |
- Profondeur des informations | Profondeur moyenne des réponses | ≥ 30% |

---

## 9. Conclusion

L'algorithme du rebond intelligent analyse ce qui vient d'être dit et propose le rebond optimal parmi 6 options (Creuser, Exemple concret, Clarifier, Connexion, Switch territoire, Silence). Les critères de choix basés sur le scoring permettent de sélectionner la meilleure option pour transformer un interrogatoire structuré en un dialogue authentique.

**Points clés :**
- 6 options de rebond
- Critères de scoring pour chaque option
- Algorithme en 3 étapes
- Analyse de la réponse
- Identification du mouvement optimal
- Formulation du rebond
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la génération
- Métriques de qualité et d'impact
