# DOC-008-06 : Seuils de Déclenchement des Modifications (Garde-Fou 3)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les seuils minimaux de feedback requis pour déclencher chaque type de modification du moteur d'apprentissage. Une règle ne peut être modifiée qu'à partir d'un volume minimal de feedbacks concordants.

---

## 2. Principe Fondateur

Une règle ne peut être modifiée qu'à partir d'un volume minimal de feedbacks concordants :
- Modification mineure : 20 feedbacks
- Modification majeure : 50 feedbacks
- Modification de règle : 100 feedbacks
- + validation humaine obligatoire

---

## 3. Classification des Modifications

### 3.1 Types de Modifications

```typescript
enum ModificationType {
  MINOR = 'minor',           // Ajustement de pondération mineur
  MAJOR = 'major',           // Ajustement de pondération majeur
  RULE = 'rule',             // Modification de règle fondamentale
  PATTERN = 'pattern',       // Ajout/modification de pattern de transfert
  ONTOLOGY = 'ontology'      // Modification de l'ontologie RH
}
```

### 3.2 Définition des Types

| Type | Description | Exemple |
|------|-------------|---------|
| MINOR | Ajustement de pondération < 10% | Poids Python : 0.8 → 0.85 |
| MAJOR | Ajustement de pondération ≥ 10% | Poids Python : 0.8 → 0.95 |
| RULE | Modification de règle fondamentale | Nouvelle règle contextuelle |
| PATTERN | Ajout/modification de pattern de transfert | Nouveau pattern Docker → Kubernetes |
| ONTOLOGY | Modification de l'ontologie RH | Ajout de synonyme React ≡ React.js |

---

## 4. Seuils de Feedback

### 4.1 Seuils par Type de Modification

| Type de Modification | Seuil Minimal de Feedbacks | Seuil de Concordance | Validation Humaine |
|---------------------|---------------------------|---------------------|---------------------|
| MINOR | 20 | ≥ 80% | Optionnelle (si confiance < 0.8) |
| MAJOR | 50 | ≥ 75% | Obligatoire |
| RULE | 100 | ≥ 70% | Obligatoire + Comité |
| PATTERN | 50 | ≥ 75% | Obligatoire |
| ONTOLOGY | 100 | ≥ 70% | Obligatoire + Comité |

### 4.2 Seuils par Contexte

Les seuils peuvent varier selon le contexte :

| Contexte | Multiplicateur de Seuil |
|----------|------------------------|
| Global (tous secteurs) | 1.0x |
| Secteur spécifique | 0.8x |
| Entreprise spécifique | 0.5x |
| Recruteur spécifique | 0.3x |

**Exemple :**
- Modification globale : 50 feedbacks requis
- Modification secteur Fintech : 40 feedbacks requis (50 × 0.8)
- Modification entreprise TechCorp : 25 feedbacks requis (50 × 0.5)

---

## 5. Calcul de la Concordance

### 5.1 Définition de la Concordance

La concordance mesure le pourcentage de feedbacks qui sont cohérents avec la proposition d'apprentissage.

```typescript
function calculateConcordance(feedbacks: RecruiterFeedback[], proposal: LearningProposal): number {
  const concordant = feedbacks.filter(f => isConcordant(f, proposal)).length;
  return concordant / feedbacks.length;
}

function isConcordant(feedback: RecruiterFeedback, proposal: LearningProposal): boolean {
  // Pour un ajustement de pondération
  if (proposal.type === 'weight_adjustment') {
    // Vérifier si le feedback suggère la même direction d'ajustement
    return feedback.determiningFactor === proposal.criterion &&
           feedback.engineAgreement === 'yes';
  }
  
  // Pour un pattern de transfert
  if (proposal.type === 'pattern_learning') {
    return feedback.mostUsefulElement.includes(proposal.sourceSkills[0]) ||
           feedback.missingElement.includes(proposal.targetSkill);
  }
  
  return false;
}
```

### 5.2 Seuils de Concordance

| Type de Modification | Seuil de Concordance Minimal |
|---------------------|------------------------------|
| MINOR | 80% |
| MAJOR | 75% |
| RULE | 70% |
| PATTERN | 75% |
| ONTOLOGY | 70% |

---

## 6. Algorithme de Déclenchement

### 6.1 Vérification des Seuils

```typescript
function checkThresholds(proposal: LearningProposal, feedbacks: RecruiterFeedback[]): ThresholdCheck {
  const type = classifyModification(proposal).type;
  const threshold = getThreshold(type);
  const concordanceThreshold = getConcordanceThreshold(type);
  
  const feedbackCount = feedbacks.length;
  const concordance = calculateConcordance(feedbacks, proposal);
  
  const checks = {
    feedbackCount: feedbackCount >= threshold,
    concordance: concordance >= concordanceThreshold,
    statisticalSignificance: calculatePValue(feedbacks, proposal) < 0.05
  };
  
  const canTrigger = Object.values(checks).every(c => c);
  
  return {
    canTrigger,
    checks,
    feedbackCount,
    threshold,
    concordance,
    concordanceThreshold,
    pValue: calculatePValue(feedbacks, proposal)
  };
}

function getThreshold(type: ModificationType): number {
  const thresholds = {
    [ModificationType.MINOR]: 20,
    [ModificationType.MAJOR]: 50,
    [ModificationType.RULE]: 100,
    [ModificationType.PATTERN]: 50,
    [ModificationType.ONTOLOGY]: 100
  };
  
  return thresholds[type];
}

function getConcordanceThreshold(type: ModificationType): number {
  const thresholds = {
    [ModificationType.MINOR]: 0.80,
    [ModificationType.MAJOR]: 0.75,
    [ModificationType.RULE]: 0.70,
    [ModificationType.PATTERN]: 0.75,
    [ModificationType.ONTOLOGY]: 0.70
  };
  
  return thresholds[type];
}
```

### 6.2 Ajustement Contextuel

```typescript
function getAdjustedThreshold(type: ModificationType, context: Context): number {
  const baseThreshold = getThreshold(type);
  const multiplier = getContextMultiplier(context);
  
  return Math.ceil(baseThreshold * multiplier);
}

function getContextMultiplier(context: Context): number {
  if (context.scope === 'global') return 1.0;
  if (context.scope === 'sector') return 0.8;
  if (context.scope === 'company') return 0.5;
  if (context.scope === 'recruiter') return 0.3;
  
  return 1.0;
}
```

---

## 7. Exemples de Déclenchement

### 7.1 Exemple 1 : Modification Mineure - Déclenchement

**Situation :**
- Type : MINOR (ajustement pondération Python 0.8 → 0.85)
- Feedbacks : 25
- Concordance : 85%
- Significativité : p = 0.03

**Vérification :**
- Feedback count : 25 ≥ 20 ✓
- Concordance : 85% ≥ 80% ✓
- Significativité : p = 0.03 < 0.05 ✓

**Décision :** Déclenchement autorisé

### 7.2 Exemple 2 : Modification Mineure - Non Déclenchement

**Situation :**
- Type : MINOR (ajustement pondération Python 0.8 → 0.85)
- Feedbacks : 15
- Concordance : 85%
- Significativité : p = 0.03

**Vérification :**
- Feedback count : 15 < 20 ✗
- Concordance : 85% ≥ 80% ✓
- Significativité : p = 0.03 < 0.05 ✓

**Décision :** Non déclenchement (volume insuffisant)

### 7.3 Exemple 3 : Modification Majeure - Déclenchement

**Situation :**
- Type : MAJOR (ajustement pondération Python 0.8 → 0.95)
- Feedbacks : 55
- Concordance : 78%
- Significativité : p = 0.02

**Vérification :**
- Feedback count : 55 ≥ 50 ✓
- Concordance : 78% ≥ 75% ✓
- Significativité : p = 0.02 < 0.05 ✓

**Décision :** Déclenchement autorisé (validation humaine requise)

### 7.4 Exemple 4 : Modification Majeure - Non Déclenchement (Concordance)

**Situation :**
- Type : MAJOR (ajustement pondération Python 0.8 → 0.95)
- Feedbacks : 60
- Concordance : 65%
- Significativité : p = 0.04

**Vérification :**
- Feedback count : 60 ≥ 50 ✓
- Concordance : 65% < 75% ✗
- Significativité : p = 0.04 < 0.05 ✓

**Décision :** Non déclenchement (concordance insuffisante)

### 7.5 Exemple 5 : Modification de Règle - Déclenchement

**Situation :**
- Type : RULE (nouvelle règle contextuelle)
- Feedbacks : 110
- Concordance : 72%
- Significativité : p = 0.01

**Vérification :**
- Feedback count : 110 ≥ 100 ✓
- Concordance : 72% ≥ 70% ✓
- Significativité : p = 0.01 < 0.05 ✓

**Décision :** Déclenchement autorisé (validation humaine + comité requises)

---

## 8. Période d'Accumulation

### 8.1 Fenêtre Temporelle

Les feedbacks doivent être collectés dans une fenêtre temporelle définie :

| Type de Modification | Fenêtre Temporelle Maximale |
|---------------------|------------------------------|
| MINOR | 90 jours |
| MAJOR | 180 jours |
| RULE | 365 jours |
| PATTERN | 180 jours |
| ONTOLOGY | 365 jours |

### 8.2 Vérification de la Fenêtre

```typescript
function checkTimeWindow(feedbacks: RecruiterFeedback[], type: ModificationType): boolean {
  const maxWindow = getTimeWindow(type);
  const oldestFeedback = feedbacks.reduce((oldest, f) => 
    f.timestamp < oldest.timestamp ? f : oldest
  );
  const newestFeedback = feedbacks.reduce((newest, f) => 
    f.timestamp > newest.timestamp ? f : newest
  );
  
  const windowDays = (newestFeedback.timestamp.getTime() - oldestFeedback.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  
  return windowDays <= maxWindow;
}

function getTimeWindow(type: ModificationType): number {
  const windows = {
    [ModificationType.MINOR]: 90,
    [ModificationType.MAJOR]: 180,
    [ModificationType.RULE]: 365,
    [ModificationType.PATTERN]: 180,
    [ModificationType.ONTOLOGY]: 365
  };
  
  return windows[type];
}
```

---

## 9. Diversité des Feedbacks

### 9.1 Exigence de Diversité

Pour les modifications de type RULE et ONTOLOGY, les feedbacks doivent provenir de sources diverses :

```typescript
interface DiversityRequirement {
  minRecruiters: number;
  minSectors: number;
  minCompanies: number;
  minTimeSpan: number; // en jours
}
```

### 9.2 Seuils de Diversité

| Type de Modification | Min Recruteurs | Min Secteurs | Min Entreprises |
|---------------------|----------------|--------------|-----------------|
| MINOR | 1 | 1 | 1 |
| MAJOR | 3 | 2 | 2 |
| RULE | 5 | 3 | 3 |
| PATTERN | 3 | 2 | 2 |
| ONTOLOGY | 5 | 3 | 3 |

### 9.3 Vérification de la Diversité

```typescript
function checkDiversity(feedbacks: RecruiterFeedback[], type: ModificationType): DiversityCheck {
  const requirement = getDiversityRequirement(type);
  
  const uniqueRecruiters = new Set(feedbacks.map(f => f.recruiterId)).size;
  const uniqueSectors = new Set(feedbacks.map(f => f.context.sector).filter(Boolean)).size;
  const uniqueCompanies = new Set(feedbacks.map(f => f.context.companySize).filter(Boolean)).size;
  
  const checks = {
    recruiters: uniqueRecruiters >= requirement.minRecruiters,
    sectors: uniqueSectors >= requirement.minSectors,
    companies: uniqueCompanies >= requirement.minCompanies
  };
  
  return {
    meetsDiversity: Object.values(checks).every(c => c),
    checks,
    uniqueRecruiters,
    uniqueSectors,
    uniqueCompanies
  };
}

function getDiversityRequirement(type: ModificationType): DiversityRequirement {
  const requirements = {
    [ModificationType.MINOR]: { minRecruiters: 1, minSectors: 1, minCompanies: 1, minTimeSpan: 30 },
    [ModificationType.MAJOR]: { minRecruiters: 3, minSectors: 2, minCompanies: 2, minTimeSpan: 60 },
    [ModificationType.RULE]: { minRecruiters: 5, minSectors: 3, minCompanies: 3, minTimeSpan: 180 },
    [ModificationType.PATTERN]: { minRecruiters: 3, minSectors: 2, minCompanies: 2, minTimeSpan: 60 },
    [ModificationType.ONTOLOGY]: { minRecruiters: 5, minSectors: 3, minCompanies: 3, minTimeSpan: 180 }
  };
  
  return requirements[type];
}
```

---

## 10. Algorithme Complet de Déclenchement

### 10.1 Vérification Complète

```typescript
function canTriggerModification(proposal: LearningProposal, feedbacks: RecruiterFeedback[], context: Context): TriggerDecision {
  const classification = classifyModification(proposal);
  
  // Vérification 1 : Volume de feedbacks
  const thresholdCheck = checkThresholds(proposal, feedbacks);
  
  // Vérification 2 : Fenêtre temporelle
  const timeWindowCheck = checkTimeWindow(feedbacks, classification.type);
  
  // Vérification 3 : Diversité (pour RULE et ONTOLOGY)
  const diversityCheck = classification.type === ModificationType.RULE || classification.type === ModificationType.ONTOLOGY
    ? checkDiversity(feedbacks, classification.type)
    : { meetsDiversity: true };
  
  // Vérification 4 : Filtre anti-biais (DOC-008-04)
  const biasCheck = checkBiasFilter(feedbacks);
  
  const allChecks = {
    threshold: thresholdCheck.canTrigger,
    timeWindow: timeWindowCheck,
    diversity: diversityCheck.meetsDiversity,
    bias: biasCheck.decision === 'approved'
  };
  
  const canTrigger = Object.values(allChecks).every(c => c);
  
  return {
    canTrigger,
    classification,
    checks: allChecks,
    details: {
      threshold: thresholdCheck,
      timeWindow: timeWindowCheck,
      diversity: diversityCheck,
      bias: biasCheck
    },
    requiresHumanValidation: classification.requiresHumanValidation,
    requiresCommitteeApproval: classification.requiresCommitteeApproval
  };
}
```

### 10.2 Rapport de Décision

```typescript
interface TriggerDecision {
  canTrigger: boolean;
  classification: Classification;
  checks: {
    threshold: boolean;
    timeWindow: boolean;
    diversity: boolean;
    bias: boolean;
  };
  details: {
    threshold: ThresholdCheck;
    timeWindow: boolean;
    diversity: DiversityCheck;
    bias: BiasFilterDecision;
  };
  requiresHumanValidation: boolean;
  requiresCommitteeApproval: boolean;
  rejectionReasons?: string[];
}
```

---

## 11. Ajustement Dynamique des Seuils

### 11.1 Ajustement Basé sur la Performance

Les seuils peuvent être ajustés dynamiquement basé sur la performance du système :

```typescript
function adjustThresholdsBasedOnPerformance(performance: SystemPerformance): ThresholdAdjustment {
  const adjustments: ThresholdAdjustment = {
    minor: 20,
    major: 50,
    rule: 100,
    pattern: 50,
    ontology: 100
  };
  
  // Si performance excellente, réduire les seuils de 10%
  if (performance.agreementRate > 0.90) {
    Object.keys(adjustments).forEach(key => {
      adjustments[key] = Math.ceil(adjustments[key] * 0.9);
    });
  }
  
  // Si performance faible, augmenter les seuils de 20%
  if (performance.agreementRate < 0.75) {
    Object.keys(adjustments).forEach(key => {
      adjustments[key] = Math.ceil(adjustments[key] * 1.2);
    });
  }
  
  return adjustments;
}
```

### 11.2 Ajustement Basé sur le Volume

Les seuils peuvent être ajustés basé sur le volume total de feedbacks :

```typescript
function adjustThresholdsBasedOnVolume(totalFeedbacks: number): ThresholdAdjustment {
  const adjustments: ThresholdAdjustment = {
    minor: 20,
    major: 50,
    rule: 100,
    pattern: 50,
    ontology: 100
  };
  
  // Si volume très élevé (> 10 000), réduire les seuils de 20%
  if (totalFeedbacks > 10000) {
    Object.keys(adjustments).forEach(key => {
      adjustments[key] = Math.ceil(adjustments[key] * 0.8);
    });
  }
  
  // Si volume faible (< 500), augmenter les seuils de 50%
  if (totalFeedbacks < 500) {
    Object.keys(adjustments).forEach(key => {
      adjustments[key] = Math.ceil(adjustments[key] * 1.5);
    });
  }
  
  return adjustments;
}
```

---

## 12. Surveillance des Seuils

### 12.1 Métriques de Suivi

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de déclenchement | Propositions déclenchées / total propositions | 60-80% |
| Taux de rejet seuil | Propositions rejetées pour seuil / total rejetées | ≤ 30% |
| Temps moyen d'accumulation | Temps pour atteindre le seuil | < 90 jours pour MINOR |
| Diversité moyenne | Diversité moyenne des feedbacks | ≥ 2 recruteurs |

### 12.2 Alertes

Alertes automatiques si :

- Taux de déclenchement < 50% (seuils trop élevés)
- Taux de déclenchement > 90% (seuils trop bas)
- Temps d'accumulation > 180 jours pour MAJOR
- Diversité moyenne < 1.5 recruteurs

---

## 13. Interface de Configuration

### 13.1 Configuration des Seuils

Les seuils peuvent être configurés via l'interface d'administration :

```
┌─────────────────────────────────────────┐
│ CONFIGURATION DES SEUILS               │
├─────────────────────────────────────────┤
│                                         │
│ Seuils de feedbacks :                   │
│ MINOR    : [20]                        │
│ MAJOR    : [50]                        │
│ RULE     : [100]                       │
│ PATTERN  : [50]                        │
│ ONTOLOGY : [100]                       │
│                                         │
│ Seuils de concordance :                │
│ MINOR    : [80]%                       │
│ MAJOR    : [75]%                       │
│ RULE     : [70]%                       │
│ PATTERN  : [75]%                       │
│ ONTOLOGY : [70]%                       │
│                                         │
│ Multiplicateurs de contexte :           │
│ Global    : [1.0]x                      │
│ Secteur   : [0.8]x                      │
│ Entreprise: [0.5]x                      │
│ Recruteur : [0.3]x                      │
│                                         │
│ Ajustement automatique :               │
│ ☑ Basé sur la performance              │
│ ☑ Basé sur le volume                   │
│                                         │
│ [Annuler]              [Sauvegarder]    │
└─────────────────────────────────────────┘
```

### 13.2 Historique des Modifications

L'interface affiche l'historique des modifications de seuils :

```
┌─────────────────────────────────────────┐
│ HISTORIQUE DES MODIFICATIONS DE SEUILS   │
├─────────────────────────────────────────┤
│                                         │
│ 2026-07-15 - Ajustement automatique     │
│ Performance excellente (92% accord)       │
│ MINOR : 20 → 18 (-10%)                 │
│ MAJOR : 50 → 45 (-10%)                 │
│                                         │
│ 2026-06-01 - Modification manuelle        │
│ DRH Référent                            │
│ RULE : 100 → 80 (réduction pour accélérer)│
│                                         │
│ [Voir détails]                          │
└─────────────────────────────────────────┘
```

---

## 14. Intégration avec les Autres Garde-Fous

### 14.1 Intégration avec Garde-Fou 1 (Filtre Anti-Biais)

Le filtre anti-biais est exécuté avant la vérification des seuils :

- Si le lot est suspendu pour biais → Aucune vérification de seuils
- Si le lot est approuvé → Vérification des seuils

### 14.2 Intégration avec Garde-Fou 2 (Validation Humaine)

La validation humaine est requise après vérification des seuils :

- Si seuils atteints → Proposition générée pour validation
- Si seuils non atteints → Aucune proposition générée

### 14.3 Intégration avec Garde-Fou 4 (Rollback)

Le rollback est disponible si le déploiement échoue :

- Indépendamment des seuils de déclenchement
- Basé sur les résultats post-déploiement

---

## 15. Maintenance

### 15.1 Maintenance des Seuils

Les seuils doivent être révisés :

- **Trimestriellement** : Basé sur les métriques de performance
- **Lors de l'évolution du volume** : Ajustement basé sur le volume total
- **Basé sur les retours d'expérience** : Ajustement si problèmes détectés

### 15.2 Documentation

Toute modification de seuils doit être documentée :

- Raison de la modification
- Impact attendu
- Métriques avant/après
- Approbateur

---

## 16. Conclusion

Les seuils de déclenchement garantissent :

- **Volume suffisant** de feedbacks pour chaque modification
- **Concordance élevée** des feedbacks
- **Diversité** des sources pour éviter le surapprentissage local
- **Significativité statistique** des apprentissages
- **Ajustement dynamique** basé sur la performance et le volume
- **Traçabilité** de toutes les modifications de seuils
