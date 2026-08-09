# DOC-008-03 : Protocole de Feedback Différé (6 Mois)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de feedback différé collecté 6 mois après le recrutement. Ce feedback est le plus précieux car il permet au moteur d'apprendre ce qui prédit le succès RÉEL, pas seulement l'appréciation immédiate.

---

## 2. Principe Fondateur

Le feedback immédiat capture l'appréciation du recruteur au moment de la décision. Le feedback différé capture la réalité du succès du recrutement 6 mois plus tard. C'est ce feedback différé qui permet au moteur d'apprendre à prédire le succès réel, pas seulement la conformité aux critères.

---

## 3. Structure du Feedback Différé

### 3.1 Interface de Feedback Différé

```typescript
interface DeferredFeedback {
  // Identifiants
  id: string;
  candidateId: string;
  jobId: string;
  recruiterId: string;
  originalFeedbackId: string;
  timestamp: Date;

  // Candidat retenu
  retainedCandidateFeedback?: {
    integrationSuccess: 'yes' | 'no' | 'partial';
    actualPerformance: 'below_expectations' | 'as_expected' | 'above_expectations';
    departedBefore6Months: boolean;
    departureReason?: string;
    performanceComments?: string;
  };

  // Candidat refusé
  rejectedCandidateFeedback?: {
    decisionRegretted: 'yes' | 'no' | 'unknown';
    regretReason?: string;
    alternativeCandidateSuccess?: 'yes' | 'no' | 'unknown';
  };

  // Métadonnées
  context: {
    sector?: string;
    companySize?: string;
    jobType?: string;
    seniority?: string;
  };
}
```

---

## 4. Champs du Feedback Différé

### 4.1 Pour Candidats Retenus

#### 4.1.1 Intégration Réussie

**Champ :** `retainedCandidateFeedback.integrationSuccess`

**Valeurs possibles :**
- `yes` : L'intégration s'est bien passée
- `no` : L'intégration a rencontré des problèmes significatifs
- `partial` : L'intégration a rencontré quelques problèmes mais a réussi globalement

**Règles :**
- Obligatoire pour les candidats retenus
- Basé sur l'évaluation du manager et de l'équipe
- Doit refléter la réalité de l'intégration, pas seulement la perception

#### 4.1.2 Performance Réelle

**Champ :** `retainedCandidateFeedback.actualPerformance`

**Valeurs possibles :**
- `below_expectations` : Performance en dessous des attentes
- `as_expected` : Performance conforme aux attentes
- `above_expectations` : Performance au-dessus des attentes

**Règles :**
- Obligatoire pour les candidats retenus
- Basé sur l'évaluation formelle ou informelle à 6 mois
- Doit être objective et basée sur des critères clairs

#### 4.1.3 Départ Avant 6 Mois

**Champ :** `retainedCandidateFeedback.departedBefore6Months`

**Valeurs possibles :**
- `true` : Le candidat est parti avant 6 mois
- `false` : Le candidat est toujours présent après 6 mois

**Règles :**
- Obligatoire pour les candidats retenus
- Si `true`, le champ `departureReason` doit être rempli

#### 4.1.4 Raison du Départ

**Champ :** `retainedCandidateFeedback.departureReason`

**Description :** Raison du départ si avant 6 mois

**Exemples :**
- "Démission pour opportunité meilleure"
- "Licenciement pour performance insuffisante"
- "Licenciement pour inadéquation culturelle"
- "Raison personnelle"

**Règles :**
- Obligatoire si `departedBefore6Months = true`
- Doit être factuel et professionnel

#### 4.1.5 Commentaires de Performance

**Champ :** `retainedCandidateFeedback.performanceComments`

**Description :** Commentaires sur la performance à 6 mois

**Exemples :**
- "Performance excellente, dépasse les attentes techniques"
- "Performance conforme mais soft skills à améliorer"
- "Performance en dessous des attentes sur les compétences critiques"

**Règles :**
- Optionnel
- Maximum 500 caractères
- Permet d'ajouter du contexte

### 4.2 Pour Candidats Refusés

#### 4.2.1 Décision Regrettée

**Champ :** `rejectedCandidateFeedback.decisionRegretted`

**Valeurs possibles :**
- `yes` : La décision de refus est regrettée
- `no` : La décision de refus n'est pas regrettée
- `unknown` : Impossible à déterminer (ex: candidat non retrouvé)

**Règles :**
- Obligatoire pour les candidats refusés
- Basé sur la rétrospective du recruteur
- Doit être honnête

#### 4.2.2 Raison du Regret

**Champ :** `rejectedCandidateFeedback.regretReason`

**Description :** Raison du regret si décision regrettée

**Exemples :**
- "Le candidat aurait pu performer au-dessus des attentes"
- "Le candidat refusé a réussi ailleurs"
- "Le candidat retenu n'a pas performé"

**Règles :**
- Obligatoire si `decisionRegretted = 'yes'`
- Permet d'identifier les erreurs de décision

#### 4.2.3 Succès du Candidat Alternatif

**Champ :** `rejectedCandidateFeedback.alternativeCandidateSuccess`

**Valeurs possibles :**
- `yes` : Le candidat retenu a réussi
- `no` : Le candidat retenu n'a pas réussi
- `unknown` : Impossible à déterminer

**Règles :**
- Optionnel
- Permet de comparer les résultats

---

## 5. Processus de Collecte

### 5.1 Moment de Collecte

Le feedback différé doit être collecté :

- **6 mois après la date d'embauche** : Pour les candidats retenus
- **6 mois après la décision** : Pour les candidats refusés
- **Avec une tolérance de ±2 semaines** : Pour tenir compte des contraintes opérationnelles

### 5.2 Déclenchement Automatique

Le système déclenche automatiquement la demande de feedback différé :

```typescript
function triggerDeferredFeedbackCollection() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Candidats retenus il y a 6 mois
  const retainedCandidates = getCandidatesHiredOn(sixMonthsAgo);
  retainedCandidates.forEach(candidate => {
    sendDeferredFeedbackRequest(candidate, 'retained');
  });

  // Candidats refusés il y a 6 mois
  const rejectedCandidates = getCandidatesRejectedOn(sixMonthsAgo);
  rejectedCandidates.forEach(candidate => {
    sendDeferredFeedbackRequest(candidate, 'rejected');
  });
}
```

### 5.3 Notification

**Canal :** Email + Notification in-app

**Contenu pour candidat retenu :**
```
Feedback différé requis - [Candidat] - [Poste]

Il y a 6 mois, vous avez recruté [Candidat] pour le poste [Poste].

Pour améliorer notre moteur de raisonnement, nous avons besoin de votre
feedback sur l'intégration et la performance de ce candidat.

Ce feedback nous permet d'apprendre ce qui prédit le succès réel,
pas seulement l'appréciation immédiate.

[Button: Fournir le feedback différé]
```

**Contenu pour candidat refusé :**
```
Feedback différé requis - [Candidat] - [Poste]

Il y a 6 mois, vous avez refusé [Candidat] pour le poste [Poste].

Avec le recul, regrettez-vous cette décision ? Ce feedback nous
permet d'apprendre de nos erreurs et d'améliorer nos recommandations.

[Button: Fournir le feedback différé]
```

### 5.4 Rappels

Si le feedback n'est pas fourni dans les 7 jours :

**Rappel 1 (J+7) :**
```
Rappel : Feedback différé requis - [Candidat] - [Poste]

Votre feedback différé est toujours attendu. Il ne prend que 2 minutes.

[Button: Fournir le feedback différé]
```

**Rappel 2 (J+14) :**
```
Dernier rappel : Feedback différé requis - [Candidat] - [Poste]

C'est votre dernier rappel. Si vous ne pouvez pas fournir ce feedback,
veuillez nous en informer.

[Button: Fournir le feedback différé]
[Button: Je ne peux pas fournir ce feedback]
```

---

## 6. Interface Utilisateur

### 6.1 Formulaire pour Candidat Retenu

**Layout :**

```
┌─────────────────────────────────────────┐
│ FEEDBACK DIFFÉRÉ - 6 MOIS               │
│ Candidat : [Nom] - Poste : [Titre]      │
├─────────────────────────────────────────┤
│                                         │
│ Intégration réussie :                   │
│ ○ Oui  ○ Non  ○ Partielle              │
│                                         │
│ Performance réelle :                    │
│ ○ En dessous des attentes               │
│ ○ Conforme aux attentes                 │
│ ○ Au-dessus des attentes                │
│                                         │
│ Départ avant 6 mois :                   │
│ ○ Oui  ○ Non                           │
│                                         │
│ Si oui, raison du départ :              │
│ [_____________________________]           │
│                                         │
│ Commentaires de performance (optionnel):│
│ [_____________________________]           │
│ [_____________________________]           │
│                                         │
│ [Annuler]              [Enregistrer]    │
└─────────────────────────────────────────┘
```

### 6.2 Formulaire pour Candidat Refusé

**Layout :**

```
┌─────────────────────────────────────────┐
│ FEEDBACK DIFFÉRÉ - 6 MOIS               │
│ Candidat : [Nom] - Poste : [Titre]      │
├─────────────────────────────────────────┤
│                                         │
│ Avec le recul, regrettez-vous la        │
│ décision de refus ?                      │
│ ○ Oui  ○ Non  ○ Ne sait pas            │
│                                         │
│ Si oui, raison du regret :              │
│ [_____________________________]           │
│                                         │
│ Le candidat retenu a-t-il réussi ?      │
│ ○ Oui  ○ Non  ○ Ne sait pas            │
│                                         │
│ Commentaires (optionnel) :              │
│ [_____________________________]           │
│ [_____________________________]           │
│                                         │
│ [Annuler]              [Enregistrer]    │
└─────────────────────────────────────────┘
```

---

## 7. Stockage du Feedback Différé

### 7.1 Structure de Base de Données

```sql
CREATE TABLE deferred_feedback (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  original_feedback_id VARCHAR(36) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  -- Candidat retenu
  integration_success VARCHAR(20),
  actual_performance VARCHAR(30),
  departed_before_6_months BOOLEAN,
  departure_reason TEXT,
  performance_comments TEXT,
  
  -- Candidat refusé
  decision_regretted VARCHAR(20),
  regret_reason TEXT,
  alternative_candidate_success VARCHAR(20),
  
  -- Contexte
  context_sector VARCHAR(50),
  context_company_size VARCHAR(50),
  context_job_type VARCHAR(50),
  context_seniority VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 7.2 Indexation

```sql
CREATE INDEX idx_deferred_timestamp ON deferred_feedback(timestamp);
CREATE INDEX idx_deferred_candidate ON deferred_feedback(candidate_id);
CREATE INDEX idx_deferred_job ON deferred_feedback(job_id);
CREATE INDEX idx_deferred_recruiter ON deferred_feedback(recruiter_id);
CREATE INDEX idx_deferred_original ON deferred_feedback(original_feedback_id);
CREATE INDEX idx_deferred_integration ON deferred_feedback(integration_success);
CREATE INDEX idx_deferred_performance ON deferred_feedback(actual_performance);
```

---

## 8. Exemples de Feedback Différé

### 8.1 Exemple : Candidat Retenu - Succès

```json
{
  "retainedCandidateFeedback": {
    "integrationSuccess": "yes",
    "actualPerformance": "above_expectations",
    "departedBefore6Months": false,
    "performanceComments": "Performance excellente, dépasse les attentes techniques. Intégration fluide."
  }
}
```

### 8.2 Exemple : Candidat Retenu - Échec

```json
{
  "retainedCandidateFeedback": {
    "integrationSuccess": "no",
    "actualPerformance": "below_expectations",
    "departedBefore6Months": true,
    "departureReason": "Licenciement pour performance insuffisante et inadéquation culturelle",
    "performanceComments": "Compétences techniques conformes mais soft skills insuffisantes pour le poste"
  }
}
```

### 8.3 Exemple : Candidat Refusé - Regret

```json
{
  "rejectedCandidateFeedback": {
    "decisionRegretted": "yes",
    "regretReason": "Le candidat refusé a réussi dans une entreprise concurrente avec une performance excellente",
    "alternativeCandidateSuccess": "no"
  }
}
```

### 8.4 Exemple : Candidat Refusé - Pas de Regret

```json
{
  "rejectedCandidateFeedback": {
    "decisionRegretted": "no",
    "alternativeCandidateSuccess": "yes"
  }
}
```

---

## 9. Analyse et Apprentissage

### 9.1 Calcul du Taux de Succès

Le système calcule le taux de succès des recommandations :

```typescript
function calculateSuccessRate(): SuccessRate {
  const retainedCandidates = getDeferredFeedback('retained');
  
  const successful = retainedCandidates.filter(f => 
    f.retainedCandidateFeedback?.integrationSuccess === 'yes' &&
    f.retainedCandidateFeedback?.actualPerformance === 'as_expected' ||
    f.retainedCandidateFeedback?.actualPerformance === 'above_expectations'
  ).length;
  
  const total = retainedCandidates.length;
  
  return {
    successRate: successful / total,
    successfulCount: successful,
    totalCount: total
  };
}
```

### 9.2 Analyse des Facteurs de Succès

Le système analyse les facteurs qui prédisent le succès :

```typescript
function analyzeSuccessFactors(): SuccessFactorAnalysis {
  const feedbacks = getDeferredFeedback('retained');
  
  const factors = {
    technicalSkill: analyzeFactor(feedbacks, 'technical_skill'),
    sectorExperience: analyzeFactor(feedbacks, 'sector_experience'),
    softSkills: analyzeFactor(feedbacks, 'soft_skills'),
    cultureFit: analyzeFactor(feedbacks, 'culture_fit')
  };
  
  return factors;
}

function analyzeFactor(feedbacks: DeferredFeedback[], factor: string): FactorAnalysis {
  const withFactor = feedbacks.filter(f => hasFactor(f, factor));
  const successWithFactor = withFactor.filter(f => isSuccess(f)).length;
  
  const withoutFactor = feedbacks.filter(f => !hasFactor(f, factor));
  const successWithoutFactor = withoutFactor.filter(f => isSuccess(f)).length;
  
  return {
    withFactor: {
      count: withFactor.length,
      successRate: successWithFactor / withFactor.length
    },
    withoutFactor: {
      count: withoutFactor.length,
      successRate: successWithoutFactor / withoutFactor.length
    },
    correlation: calculateCorrelation(successWithFactor / withFactor.length, successWithoutFactor / withoutFactor.length)
  };
}
```

### 9.3 Analyse des Décisions Regrettées

Le système analyse les décisions regrettées pour identifier les erreurs :

```typescript
function analyzeRegrettedDecisions(): RegretAnalysis {
  const rejectedFeedbacks = getDeferredFeedback('rejected');
  
  const regretted = rejectedFeedbacks.filter(f => 
    f.rejectedCandidateFeedback?.decisionRegretted === 'yes'
  );
  
  const regretRate = regretted.length / rejectedFeedbacks.length;
  
  const commonRegretReasons = aggregateRegretReasons(regretted);
  
  return {
    regretRate,
    regrettedCount: regretted.length,
    totalCount: rejectedFeedbacks.length,
    commonRegretReasons
  };
}
```

---

## 10. Intégration avec l'Apprentissage

### 10.1 Pondération du Feedback Différé

Le feedback différé a un poids plus élevé que le feedback immédiat :

```typescript
const FEEDBACK_WEIGHTS = {
  immediate: 1.0,
  deferred: 2.5  // Le feedback différé est 2.5x plus précieux
};
```

### 10.2 Apprentissage des Facteurs de Succès

Le moteur apprend quels facteurs prédisent réellement le succès :

```typescript
function learnSuccessFactors(): WeightAdjustment[] {
  const analysis = analyzeSuccessFactors();
  const adjustments: WeightAdjustment[] = [];
  
  for (const [factor, data] of Object.entries(analysis)) {
    if (data.correlation > 0.2) {
      // Le facteur est positivement corrélé au succès
      adjustments.push({
        criterion: factor,
        currentWeight: getCurrentWeight(factor),
        proposedWeight: getCurrentWeight(factor) * 1.1,
        confidence: data.correlation,
        feedbackCount: data.withFactor.count + data.withoutFactor.count
      });
    } else if (data.correlation < -0.2) {
      // Le facteur est négativement corrélé au succès
      adjustments.push({
        criterion: factor,
        currentWeight: getCurrentWeight(factor),
        proposedWeight: getCurrentWeight(factor) * 0.9,
        confidence: Math.abs(data.correlation),
        feedbackCount: data.withFactor.count + data.withoutFactor.count
      });
    }
  }
  
  return adjustments;
}
```

### 10.3 Apprentissage des Erreurs de Décision

Le moteur apprend des décisions regrettées :

```typescript
function learnFromRegrettedDecisions(): PatternAdjustment[] {
  const analysis = analyzeRegrettedDecisions();
  const adjustments: PatternAdjustment[] = [];
  
  // Si le taux de regret est élevé pour un certain type de profil
  if (analysis.regretRate > 0.2) {
    adjustments.push({
      pattern: 'rejection_pattern',
      currentBehavior: 'Rejet basé sur [facteur]',
      proposedBehavior: 'Réduire le poids de [facteur] dans les décisions de rejet',
      confidence: analysis.regretRate,
      feedbackCount: analysis.regrettedCount
    });
  }
  
  return adjustments;
}
```

---

## 11. Métriques de Suivi

### 11.1 Métriques de Collecte

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de réponse différée | Feedbacks différés fournis / total demandés | ≥ 70% |
| Délai moyen de réponse | Temps entre demande et réponse | < 14 jours |
| Taux de réponse après rappel | Réponses après rappel / total réponses | ≤ 30% |

### 11.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de succès des recommandations | Candidats réussis / total retenus | ≥ 80% |
| Taux de regret des refus | Décisions regrettées / total refusés | ≤ 10% |
| Taux de départ avant 6 mois | Départs avant 6 mois / total retenus | ≤ 15% |

### 11.3 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration du taux de succès | Évolution après chaque cycle d'apprentissage | ≥ +5% |
| Réduction du taux de regret | Évolution après chaque cycle d'apprentissage | ≥ -3% |
| Corrélation moteur/succès | Corrélation entre recommandation moteur et succès réel | ≥ 0.7 |

---

## 12. Intégration avec le Feedback Immédiat

### 12.1 Comparaison Feedback Immédiat vs Différé

Le système compare les feedbacks immédiats et différés pour identifier les divergences :

```typescript
function compareFeedbacks(originalFeedback: RecruiterFeedback, deferredFeedback: DeferredFeedback): FeedbackComparison {
  const comparison = {
    agreement: true,
    discrepancies: [] as string[]
  };

  if (originalFeedback.finalDecision === 'retained') {
    if (deferredFeedback.retainedCandidateFeedback?.actualPerformance === 'below_expectations') {
      comparison.agreement = false;
      comparison.discrepancies.push('Performance en dessous des attentes malgré recommandation positive');
    }
  }

  if (originalFeedback.finalDecision === 'rejected') {
    if (deferredFeedback.rejectedCandidateFeedback?.decisionRegretted === 'yes') {
      comparison.agreement = false;
      comparison.discrepancies.push('Décision regrettée');
    }
  }

  return comparison;
}
```

### 12.2 Analyse des Divergences

Le système analyse les divergences pour identifier les patterns :

```typescript
function analyzeDivergences(): DivergenceAnalysis {
  const comparisons = getAllFeedbackComparisons();
  
  const divergent = comparisons.filter(c => !c.agreement);
  const divergenceRate = divergent.length / comparisons.length;
  
  const commonDivergences = aggregateDivergenceReasons(divergent);
  
  return {
    divergenceRate,
    divergentCount: divergent.length,
    totalCount: comparisons.length,
    commonDivergences
  };
}
```

---

## 13. Confidentialité et Éthique

### 13.1 Protection des Données

Les feedbacks différés contiennent des informations sensibles sur la performance des employés :

- **Anonymisation** : Pour l'apprentissage, les données sont anonymisées
- **Accès restreint** : Seuls les recruteurs et managers concernés peuvent accéder
- **Conservation limitée** : Conservation limitée à 2 ans pour l'apprentissage

### 13.2 Consentement

Le consentement du candidat est requis pour la collecte du feedback différé :

- **Information claire** : Le candidat est informé lors de l'embauche
- **Option d'opt-out** : Le candidat peut refuser que ses données soient utilisées
- **Transparence** : Le candidat peut accéder à ses données

---

## 14. Maintenance

### 14.1 Maintenance du Processus

Le processus de collecte doit être maintenu :

- **Mise à jour des formulaires** : Lors de l'évolution des besoins
- **Optimisation des notifications** : Amélioration des taux de réponse
- **Surveillance des métriques** : Monitoring des taux de collecte

### 14.2 Maintenance de la Base de Données

La base de données de feedback différé doit être maintenue :

- **Nettoyage périodique** : Suppression des données de test
- **Archivage** : Archivage des feedbacks anciens (> 5 ans)
- **Anonymisation** : Anonymisation pour l'apprentissage

---

## 15. Conclusion

Le protocole de feedback différé garantit :

- **Apprentissage du succès réel** plutôt que de l'appréciation immédiate
- **Identification des erreurs** de décision
- **Amélioration continue** de la précision des recommandations
- **Traçabilité** du succès des recrutements
- **Éthique** dans l'utilisation des données de performance
- **Confidentialité** des informations sensibles
