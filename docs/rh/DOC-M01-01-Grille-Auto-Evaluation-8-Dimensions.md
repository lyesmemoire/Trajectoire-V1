# DOC-M01-01 : Grille d'Auto-Évaluation en 8 Dimensions

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la grille d'auto-évaluation en 8 dimensions pour le MVP-META-01 Méta-Cognition Engine. Ce document structure les 8 dimensions que le moteur utilise pour évaluer la qualité de son propre travail après chaque entretien.

---

## 2. Principe Fondateur

Un moteur qui sait qu'il a mal évalué et le dit est infiniment plus fiable qu'un moteur qui affirme toujours avec la même confiance. La reconnaissance de ses propres limites est le signe le plus avancé d'intelligence. C'est la méta-cognition appliquée au RH : penser sur sa propre pensée, évaluer sa propre évaluation.

---

## 3. Architecture de l'Auto-Évaluation

### 3.1 Moment de l'Auto-Évaluation

**Déclenchement :**
- Après chaque entretien
- Avant de produire le debrief final
- Analyse systématique de la qualité du travail effectué

### 3.2 Objectif de l'Auto-Évaluation

**But principal :**
- Identifier les zones insuffisamment évaluées
- Détecter les biais potentiels
- Évaluer la fiabilité du scoring
- Proposer des actions correctives

---

## 4. Dimension 1 — Couverture des Zones Critiques

### 4.1 Ce qui est Évalué

Le moteur vérifie la couverture des zones critiques définies pour le poste par rapport aux zones effectivement explorées.

### 4.2 Processus d'Évaluation

**Étape 1 : Identification des zones critiques**
- Liste des zones critiques définies pour le poste
- Exemple pour un poste DRH : droit du travail, relations sociales, budget RH, stratégie

**Étape 2 : Vérification de l'exploration**
Pour chaque zone critique :
- Explorée en profondeur : ✅
- Explorée superficiellement : ⚠️
- Non explorée : ❌

**Étape 3 : Calcul du score de couverture**
Score de couverture = (Zones explorées / Zones critiques totales) × 100

### 4.3 Échelle de Scoring

**Score de couverture :**
- 100% : Toutes les zones critiques explorées en profondeur
- 80-99% : Majorité des zones explorées, quelques lacunes mineures
- 60-79% : Zones partiellement explorées, lacunes significatives
- < 60% : Zones insuffisamment explorées, lacunes critiques

### 4.4 Seuils d'Alerte

**Si score < 80% :**
- Alerte : Entretien incomplet
- Recommandation : Second entretien sur les zones manquantes
- Impact sur la fiabilité du score : Réduit

### 4.5 Exemple

**Poste DRH :**
Zones critiques : 5 (droit du travail, relations sociales, budget RH, stratégie, management)

Exploration :
- Droit du travail : ✅ (explorée en profondeur)
- Relations sociales : ⚠️ (explorée superficiellement)
- Budget RH : ❌ (non explorée)
- Stratégie : ✅ (explorée en profondeur)
- Management : ✅ (explorée en profondeur)

Score de couverture = (4 / 5) × 100 = 80%
Alerte : Aucune (score ≥ 80%)

---

## 5. Dimension 2 — Qualité du Creusage Effectué

### 5.1 Ce qui est Évalué

Le moteur évalue la qualité du creusage effectué pour chaque réponse vague détectée.

### 5.2 Processus d'Évaluation

**Étape 1 : Détection des réponses vagues**
- Identification des réponses vagues pendant l'entretien
- Exemple : "Je suis bon en gestion de conflits" (sans preuve)

**Étape 2 : Vérification du creusage**
Pour chaque réponse vague :
- Le moteur a-t-il creusé ?
- Le creusage a-t-il été suffisant ?
- A-t-il obtenu une preuve concrète ?

**Étape 3 : Calcul du score de creusage**
Score de creusage = (Réponses vagues creusées / Réponses vagues détectées) × 100

### 5.3 Échelle de Scoring

**Score de creusage :**
- 100% : Toutes les réponses vagues creusées avec succès
- 80-99% : Majorité des réponses creusées, quelques lacunes mineures
- 70-79% : Réponses partiellement creusées, lacunes significatives
- < 70% : Creusage insuffisant

### 5.4 Seuils d'Alerte

**Si score < 70% :**
- Alerte : Creusage insuffisant
- Liste des points non creusés
- Impact sur la fiabilité du score : Réduit

### 5.5 Exemple

**Réponses vagues détectées :** 5
**Réponses vagues creusées :** 4

Score de creusage = (4 / 5) × 100 = 80%
Alerte : Aucune (score ≥ 70%)

---

## 6. Dimension 3 — Preuves Obtenues

### 6.1 Ce qui est Évalué

Le moteur évalue la qualité et la quantité des preuves obtenues pour chaque compétence évaluée.

### 6.2 Processus d'Évaluation

**Étape 1 : Identification des compétences évaluées**
- Liste des compétences évaluées pendant l'entretien
- Exemple : gestion de paie, management, communication

**Étape 2 : Comptage des preuves**
Pour chaque compétence :
- Nombre de preuves concrètes obtenues
- Qualité des preuves (chiffrées / factuelles)
- Suffisance pour scorer avec confiance

**Étape 3 : Évaluation du niveau de preuve global**
Niveau de preuve global :
- Élevé : > 2 preuves concrètes par compétence critique
- Modéré : 1 preuve par compétence
- Faible : 0 preuve sur certaines compétences critiques

### 6.3 Échelle de Scoring

**Niveau de preuve :**
- Élevé : Preuves suffisantes pour scorer avec confiance
- Modéré : Preuves limitées, scoring avec réserves
- Faible : Preuves insuffisantes, scoring non fiable

### 6.4 Seuils d'Alerte

**Si niveau = Faible :**
- Alerte : Preuves insuffisantes
- Liste des compétences sans preuve
- Impact sur la fiabilité du score : Fortement réduit

### 6.5 Exemple

**Compétences évaluées :** 3
- Gestion de paie : 2 preuves (chiffrées)
- Management : 1 preuve (factuelle)
- Communication : 0 preuve

Niveau de preuve global : Modéré
Alerte : Aucune (niveau ≠ Faible)

---

## 7. Dimension 4 — Détection des Réponses Préparées

### 7.1 Ce qui est Évalué

Le moteur vérifie l'application des techniques de démasquage des réponses préparées.

### 7.2 Processus d'Évaluation

**Étape 1 : Détection des signaux de préparation**
- Identification des signaux de préparation pendant l'entretien
- Exemple : réponses trop parfaites, absence d'hésitation

**Étape 2 : Vérification des techniques de démasquage**
Le moteur vérifie :
- A-t-il appliqué les techniques de démasquage systématiquement ?
- A-t-il posé des questions impossibles à préparer ?
- A-t-il utilisé le silence calculé ?

**Étape 3 : Calcul du score de démasquage**
Score de démasquage = (Techniques appliquées / Signaux de préparation détectés) × 100

### 7.3 Échelle de Scoring

**Score de démasquage :**
- 100% : Toutes les techniques appliquées systématiquement
- 80-99% : Majorité des techniques appliquées
- < 80% : Techniques insuffisamment appliquées

### 7.4 Seuils d'Alerte

**Si score < 80% :**
- Alerte : Démasquage insuffisant
- Liste des techniques non appliquées
- Impact sur la fiabilité du score : Réduit

### 7.5 Exemple

**Signaux de préparation détectés :** 3
**Techniques appliquées :** 3

Score de démasquage = (3 / 3) × 100 = 100%
Alerte : Aucune (score ≥ 80%)

---

## 8. Dimension 5 — Gestion de la Dynamique

### 8.1 Ce qui est Évalué

Le moteur évalue sa propre gestion de la dynamique relationnelle pendant l'entretien.

### 8.2 Processus d'Évaluation

**Étape 1 : Évaluation de la gestion de la pression**
Le moteur vérifie :
- A-t-il maintenu la pression sur les points critiques ?
- A-t-il réduit la pression sur les points non critiques ?

**Étape 2 : Évaluation de l'adaptation de la posture**
Le moteur vérifie :
- A-t-il adapté sa posture selon le profil du candidat ?
- A-t-il maintenu un équilibre entre pression et empathie ?

**Étape 3 : Évaluation globale**
Score de gestion de la dynamique :
- Élevé : Gestion optimale de la dynamique
- Modéré : Gestion acceptable avec quelques ajustements
- Faible : Gestion insuffisante de la dynamique

### 8.3 Échelle de Scoring

**Score de gestion de la dynamique :**
- Élevé : Dynamique parfaitement adaptée
- Modéré : Dynamique globalement adaptée
- Faible : Dynamique mal adaptée

### 8.4 Seuils d'Alerte

**Si score = Faible :**
- Alerte : Gestion de la dynamique insuffisante
- Liste des points d'amélioration
- Impact sur la qualité de l'entretien : Réduit

### 8.5 Exemple

**Gestion de la pression :** Maintenue sur les points critiques
**Adaptation de la posture :** Adaptée selon le profil du candidat

Score de gestion de la dynamique : Élevé
Alerte : Aucune (score ≠ Faible)

---

## 9. Dimension 6 — Biais Potentiels Détectés

### 9.1 Ce qui est Évalué

Le moteur recherche activement les biais qui ont pu affecter son évaluation.

### 9.2 Types de Biais

**Biais d'affinité :**
- Le candidat ressemble-t-il aux profils habituellement favorisés ?
- Si oui : Alerte biais possible

**Biais de halo :**
- Une force initiale forte a-t-elle pu masquer des faiblesses ?
- Si oui : Revoir le scoring

**Biais de confirmation :**
- Le moteur a-t-il cherché à confirmer une impression initiale ?
- Si oui : Revoir les questions posées

**Biais de récence :**
- La fin de l'entretien a-t-elle surpondéré par rapport au début ?
- Si oui : Repondérer les observations

**Biais culturel :**
- Le style de communication du candidat (introversion, culture différente) a-t-il pu être mal interprété ?
- Si oui : Revoir l'interprétation

### 9.3 Processus d'Évaluation

**Étape 1 : Détection des biais potentiels**
- Analyse systématique des 5 types de biais
- Identification des biais potentiels

**Étape 2 : Évaluation du risque**
Pour chaque biais détecté :
- Risque : Élevé / Modéré / Faible
- Impact sur le scoring : Description

**Étape 3 : Recommandations**
- Actions pour corriger les biais détectés
- Revoir le scoring si nécessaire

### 9.4 Échelle de Scoring

**Score de détection des biais :**
- Aucun biais détecté : Excellent
- 1 biais détecté (risque faible) : Bon
- 1 biais détecté (risque modéré/élevé) : À corriger
- 2+ biais détectés : À corriger urgemment

### 9.5 Exemple

**Biais détectés :**
- Biais de halo : Risque modéré (force initiale en communication a pu masquer lacunes en management)

Score de détection des biais : À corriger
Recommandation : Revoir le scoring en management

---

## 10. Dimension 7 — Questions Non Posées

### 10.1 Ce qui est Évalué

Le moteur liste les questions prévues dans le plan initial qui n'ont pas été posées.

### 10.2 Processus d'Évaluation

**Étape 1 : Identification des questions non posées**
- Comparaison du plan initial avec les questions effectivement posées
- Liste des questions non posées

**Étape 2 : Analyse des raisons**
Pour chaque question non posée :
- Raison : Temps manquant
- Raison : Fil conversationnel dévié
- Raison : Oubli algorithmique

**Étape 3 : Évaluation de l'impact**
Pour chaque question non posée :
- Impact sur la fiabilité de l'évaluation : Élevé / Modéré / Faible

### 10.3 Échelle de Scoring

**Score de complétude des questions :**
- 100% : Toutes les questions posées
- 80-99% : Majorité des questions posées
- < 80% : Questions significatives non posées

### 10.4 Seuils d'Alerte

**Si score < 80% :**
- Alerte : Questions importantes non posées
- Liste des questions manquantes
- Impact sur la fiabilité de l'évaluation : Réduit

### 10.5 Exemple

**Questions prévues :** 10
**Questions posées :** 8

Questions non posées :
- Question sur le budget RH : Temps manquant (Impact modéré)
- Question sur la stratégie : Fil conversationnel dévié (Impact élevé)

Score de complétude : 80%
Alerte : Aucune (score ≥ 80%)

---

## 11. Dimension 8 — Cohérence du Scoring

### 11.1 Ce qui est Évalué

Le moteur vérifie la cohérence interne de ses propres scores.

### 11.2 Processus d'Évaluation

**Étape 1 : Détection des incohérences**
Le moteur vérifie :
- Des scores contradictoires ? (Score soft skills élevé mais aucune preuve comportementale obtenue)
- Des scores sans preuve associée ?
- Des scores influencés par des dimensions non pertinentes ?

**Étape 2 : Analyse des incohérences**
Pour chaque incohérence détectée :
- Description de l'incohérence
- Impact sur la fiabilité du scoring

**Étape 3 : Recommandations**
- Actions pour corriger les incohérences
- Revoir le scoring si nécessaire

### 11.3 Échelle de Scoring

**Score de cohérence du scoring :**
- 100% : Aucune incohérence détectée
- 80-99% : Incohérences mineures
- < 80% : Incohérences significatives

### 11.4 Seuils d'Alerte

**Si score < 80% :**
- Alerte : Incohérences significatives détectées
- Liste des incohérences
- Impact sur la fiabilité du scoring : Réduit

### 11.5 Exemple

**Incohérences détectées :**
- Score soft skills : 4/5
- Preuves comportementales : 0

Score de cohérence du scoring : < 80%
Alerte : Incohérence significative
Recommandation : Revoir le scoring en soft skills

---

## 12. Structure de Données (TypeScript)

```typescript
interface SelfEvaluationDimension {
  dimensionId: string;
  name: string;
  description: string;
  
  score: number;
  scale: {
    excellent: string;
    good: string;
    acceptable: string;
    poor: string;
  };
  
  alertThreshold: number;
  alertTriggered: boolean;
  alertMessage?: string;
  
  details: any;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface SelfEvaluationGrid {
  gridId: string;
  interviewId: string;
  candidateId: string;
  positionId: string;
  
  evaluatedAt: Date;
  
  dimensions: {
    coverage: {
      dimensionId: string;
      name: string;
      description: string;
      
      criticalZones: string[];
      exploredZones: {
        zone: string;
        status: 'deep' | 'superficial' | 'not_explored';
      }[];
      
      score: number;
      alertThreshold: number;
      alertTriggered: boolean;
      alertMessage?: string;
      
      metadata: any;
    };
    
    drillingQuality: {
      dimensionId: string;
      name: string;
      description: string;
      
      vagueResponsesDetected: number;
      vagueResponsesDrilled: number;
      
      score: number;
      alertThreshold: number;
      alertTriggered: boolean;
      alertMessage?: string;
      
      metadata: any;
    };
    
    proofsObtained: {
      dimensionId: string;
      name: string;
      description: string;
      
      competencesEvaluated: {
        competence: string;
        proofsCount: number;
        proofsQuality: 'quantified' | 'factual' | 'none';
      }[];
      
      globalLevel: 'high' | 'moderate' | 'low';
      alertTriggered: boolean;
      alertMessage?: string;
      
      metadata: any;
    };
    
    preparedResponsesDetection: {
      dimensionId: string;
      name: string;
      description: string;
      
      preparationSignalsDetected: number;
      techniquesApplied: number;
      
      score: number;
      alertThreshold: number;
      alertTriggered: boolean;
      alertMessage?: string;
      
      metadata: any;
    };
    
    dynamicsManagement: {
      dimensionId: string;
      name: string;
      description: string;
      
      pressureOnCriticalPoints: boolean;
      pressureReductionOnNonCriticalPoints: boolean;
      postureAdaptation: boolean;
      
      score: 'high' | 'moderate' | 'low';
      alertTriggered: boolean;
      alertMessage?: string;
      
      metadata: any;
    };
    
    biasesDetected: {
      dimensionId: string;
      name: string;
      description: string;
      
      biases: {
        type: 'affinity' | 'halo' | 'confirmation' | 'recency' | 'cultural';
        detected: boolean;
        risk: 'high' | 'moderate' | 'low';
        impact: string;
      }[];
      
      score: 'excellent' | 'good' | 'toCorrect' | 'urgent';
      recommendations: string[];
      
      metadata: any;
    };
    
    unaskedQuestions: {
      dimensionId: string;
      name: string;
      description: string;
      
      plannedQuestions: number;
      askedQuestions: number;
      
      unaskedQuestions: {
        question: string;
        reason: 'time' | 'conversation_drift' | 'algorithmic_forget';
        impact: 'high' | 'moderate' | 'low';
      }[];
      
      score: number;
      alertThreshold: number;
      alertTriggered: boolean;
      alertMessage?: string;
      
      metadata: any;
    };
    
    scoringCoherence: {
      dimensionId: string;
      name: string;
      description: string;
      
      inconsistencies: {
        description: string;
        impact: string;
      }[];
      
      score: number;
      alertThreshold: number;
      alertTriggered: boolean;
      alertMessage?: string;
      
      metadata: any;
    };
  };
  
  globalScore: number;
  globalReliability: 'high' | 'moderate' | 'low';
  
  recommendations: string[];
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 13. Stockage et Gestion

### 13.1 Schéma SQL

```sql
CREATE TABLE self_evaluation_grid (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  position_id VARCHAR(36) NOT NULL,
  
  evaluated_at TIMESTAMP NOT NULL,
  
  dimensions JSON NOT NULL,
  global_score DECIMAL(3,1) NOT NULL,
  global_reliability VARCHAR(20) NOT NULL,
  recommendations JSON,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_self_evaluation_grid_interview ON self_evaluation_grid(interview_id);
CREATE INDEX idx_self_evaluation_grid_candidate ON self_evaluation_grid(candidate_id);
CREATE INDEX idx_self_evaluation_grid_position ON self_evaluation_grid(position_id);
```

---

## 14. API Endpoints

```typescript
// POST /api/self-evaluation/evaluate
async function evaluateSelfEvaluation(interviewId: string): Promise<SelfEvaluationGrid> {
  return await evaluateSelfEvaluation(interviewId);
}

// GET /api/self-evaluation/:evaluationId
async function getSelfEvaluation(evaluationId: string): Promise<SelfEvaluationGrid> {
  return await getSelfEvaluationById(evaluationId);
}

// GET /api/self-evaluation/interview/:interviewId
async function getSelfEvaluationByInterview(interviewId: string): Promise<SelfEvaluationGrid> {
  return await getSelfEvaluationByInterview(interviewId);
}

// POST /api/self-evaluation/analyze-biases
async function analyzeBiases(interviewId: string): Promise<any> {
  return await analyzeBiases(interviewId);
}

// POST /api/self-evaluation/check-coherence
async function checkScoringCoherence(interviewId: string): Promise<any> {
  return await checkScoringCoherence(interviewId);
}
```

---

## 15. Indicateurs de Suivi

### 15.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Score moyen global | Moyenne des scores globaux | ≥ 8/10 |
- Taux d'alertes déclenchées | Évaluations avec alertes / total | ≤ 20% |

### 15.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'auto-évaluation | Entretiens avec auto-évaluation / total | 100% |
- Taux de recommandations suivies | Recommandations appliquées / total | ≥ 80% |

---

## 16. Conclusion

La grille d'auto-évaluation en 8 dimensions structure l'évaluation que le moteur effectue de son propre travail après chaque entretien. Dimension 1 : Couverture des zones critiques (vérification des zones explorées vs zones critiques, score de couverture, alerte si < 80%). Dimension 2 : Qualité du creusage effectué (vérification du creusage des réponses vagues, score de creusage, alerte si < 70%). Dimension 3 : Preuves obtenues (comptage des preuves par compétence, niveau de preuve global). Dimension 4 : Détection des réponses préparées (vérification des techniques de démasquage, score de démasquage, alerte si < 80%). Dimension 5 : Gestion de la dynamique (évaluation de la gestion de la pression et de l'adaptation de la posture). Dimension 6 : Biais potentiels détectés (recherche active de 5 types de biais : affinité, halo, confirmation, récence, culturel). Dimension 7 : Questions non posées (liste des questions non posées, raisons, impact). Dimension 8 : Cohérence du scoring (vérification de la cohérence interne des scores, alerte si incohérences significatives). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 8 dimensions d'auto-évaluation
- Couverture des zones critiques
- Qualité du creusage effectué
- Preuves obtenues
- Détection des réponses préparées
- Gestion de la dynamique
- Biais potentiels détectés
- Questions non posées
- Cohérence du scoring
- Seuils d'alerte pour chaque dimension
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
