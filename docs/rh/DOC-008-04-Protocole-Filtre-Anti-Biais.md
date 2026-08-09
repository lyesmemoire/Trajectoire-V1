# DOC-008-04 : Protocole Filtre Anti-Biais (Garde-Fou 1)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de filtre anti-biais qui analyse chaque lot de feedbacks avant injection dans le moteur d'apprentissage. Ce protocole détecte et bloque les biais potentiels pour éviter l'amplification des biais inconscients des recruteurs.

---

## 2. Principe Fondateur

Chaque lot de feedbacks est analysé avant injection dans le moteur. Vérifications obligatoires :
- Pas de corrélation entre décisions et critères prohibés (réf. RH-000 / RH-860)
- Distribution équilibrée des feedbacks
- Absence de pattern discriminatoire systémique

Si un biais est détecté :
- Le lot est suspendu
- Alerte au DPO et au DRH référent
- Analyse humaine avant toute injection

---

## 3. Critères Prohibés

### 3.1 Critères RH-000

Les critères suivants sont strictement prohibés par RH-000 :

- **Âge** : Tout critère basé sur l'âge du candidat
- **Genre** : Tout critère basé sur le genre
- **Origine ethnique** : Tout critère basé sur l'origine ethnique ou nationale
- **Religion** : Tout critère basé sur la religion
- **Orientation sexuelle** : Tout critère basé sur l'orientation sexuelle
- **Handicap** : Tout critère basé sur le handicap
- **Grossesse** : Tout critère basé sur la grossesse
- **Situation familiale** : Tout critère basé sur la situation familiale
- **Apparence physique** : Tout critère basé sur l'apparence physique

### 3.2 Critères RH-860

Les critères suivants sont prohibés par RH-860 :

- **Nationalité** : Tout critère basé sur la nationalité
- **Langue maternelle** : Tout critère basé sur la langue maternelle
- **Lieu de résidence** : Tout critère basé sur le lieu de résidence (sauf si justifié par le poste)
- **Établissement scolaire** : Tout critère basé sur l'établissement scolaire (sauf si justifié)

---

## 4. Architecture du Filtre Anti-Biais

### 4.1 Flux de Filtrage

```
LOT DE FEEDBACKS
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 1 : Extraction des Données│ → Données candidates + décisions
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 2 : Détection de Corrélation│ → Corrélation avec critères prohibés
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 3 : Analyse de Distribution│ → Distribution équilibrée ?
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 4 : Détection de Patterns │ → Patterns discriminatoires ?
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 5 : Décision             │ → Approuvé / Suspendu
└─────────────────────────────────┘
    ↓
Si suspendu :
┌─────────────────────────────────┐
│ ÉTAPE 6 : Alerte et Analyse    │ → DPO + DRH référent
└─────────────────────────────────┘
```

---

## 5. Étape 1 : Extraction des Données

### 5.1 Données Extraites

Pour chaque feedback, le filtre extrait :

```typescript
interface BiasFilterData {
  feedbackId: string;
  candidateId: string;
  jobId: string;
  recruiterId: string;
  
  // Données candidat (anonymisées)
  candidateData: {
    ageGroup?: string; // 20-25, 25-30, 30-35, 35-40, 40-45, 45-50, 50+
    gender?: string; // Masculin, Féminin, Non-binaire, Préfère ne pas dire
    nationality?: string;
    educationInstitution?: string;
    location?: string;
  };
  
  // Données décision
  decision: {
    finalDecision: 'retained' | 'rejected' | 'pending';
    engineAgreement: 'yes' | 'no' | 'partial';
    determiningFactor: string;
  };
  
  // Contexte
  context: {
    sector?: string;
    companySize?: string;
    jobType?: string;
    seniority?: string;
  };
}
```

### 5.2 Anonymisation

Les données sont anonymisées avant analyse :

```typescript
function anonymizeForBiasFilter(data: BiasFilterData): BiasFilterData {
  return {
    ...data,
    candidateId: hash(data.candidateId),
    recruiterId: hash(data.recruiterId),
    // Les données sensibles sont conservées pour l'analyse de biais
    // mais ne sont pas stockées de manière identifiable
  };
}
```

---

## 6. Étape 2 : Détection de Corrélation

### 6.1 Algorithme de Détection

```typescript
function detectProhibitedCorrelations(feedbacks: BiasFilterData[]): CorrelationAnalysis {
  const correlations: Correlation[] = [];
  
  // Pour chaque critère prohibé
  const prohibitedCriteria = [
    'ageGroup', 'gender', 'nationality', 'educationInstitution', 'location'
  ];
  
  for (const criterion of prohibitedCriteria) {
    const correlation = calculateCorrelation(feedbacks, criterion);
    if (correlation.significant) {
      correlations.push(correlation);
    }
  }
  
  return {
    hasCorrelation: correlations.length > 0,
    correlations,
    severity: calculateSeverity(correlations)
  };
}

function calculateCorrelation(feedbacks: BiasFilterData[], criterion: string): Correlation {
  // Créer un tableau croisé
  const crossTab = createCrossTab(feedbacks, criterion);
  
  // Calculer le chi-square
  const chiSquare = calculateChiSquare(crossTab);
  
  // Calculer la p-value
  const pValue = calculatePValue(chiSquare, crossTab.degreesOfFreedom);
  
  // Déterminer si significatif (p < 0.05)
  const significant = pValue < 0.05;
  
  // Calculer la force de la corrélation (Cramer's V)
  const cramersV = calculateCramersV(chiSquare, crossTab.total);
  
  return {
    criterion,
    chiSquare,
    pValue,
    significant,
    strength: cramersV,
    crossTab
  };
}
```

### 6.2 Seuils de Signification

| Métrique | Seuil | Action |
|----------|-------|--------|
| p-value | < 0.05 | Corrélation significative détectée |
| Cramer's V | > 0.3 | Corrélation forte |
| Cramer's V | 0.1-0.3 | Corrélation modérée |
| Cramer's V | < 0.1 | Corrélation faible |

### 6.3 Exemple de Détection

**Scénario :** Corrélation entre âge et décision

```
Tableau croisé Âge × Décision :
                Retenu  Refusé  Total
20-25 ans        5       15      20
25-30 ans       10       10      20
30-35 ans       15        5      20
35-40 ans       20        5      25
40+ ans         10       10      20
Total           60       45     105

Chi-square = 12.5
p-value = 0.014 (< 0.05) → Significatif
Cramer's V = 0.34 (> 0.3) → Forte

Conclusion : Corrélation significative détectée entre âge et décision.
Les candidats plus jeunes sont plus souvent refusés.
```

---

## 7. Étape 3 : Analyse de Distribution

### 7.1 Distribution des Feedbacks

Le système vérifie que les feedbacks sont équilibrés :

```typescript
function analyzeDistribution(feedbacks: BiasFilterData[]): DistributionAnalysis {
  const analysis: DistributionAnalysis = {
    isBalanced: true,
    imbalances: []
  };
  
  // Distribution par décision
  const decisionDistribution = analyzeDecisionDistribution(feedbacks);
  if (!isDecisionBalanced(decisionDistribution)) {
    analysis.isBalanced = false;
    analysis.imbalances.push({
      type: 'decision',
      description: 'Distribution déséquilibrée des décisions',
      data: decisionDistribution
    });
  }
  
  // Distribution par critère prohibé
  const prohibitedCriteria = ['ageGroup', 'gender', 'nationality'];
  for (const criterion of prohibitedCriteria) {
    const criterionDistribution = analyzeCriterionDistribution(feedbacks, criterion);
    if (!isCriterionBalanced(criterionDistribution)) {
      analysis.isBalanced = false;
      analysis.imbalances.push({
        type: criterion,
        description: `Distribution déséquilibrée pour ${criterion}`,
        data: criterionDistribution
      });
    }
  }
  
  return analysis;
}
```

### 7.2 Seuils d'Équilibre

| Métrique | Seuil Minimum | Seuil Maximum |
|----------|---------------|---------------|
| Taux de retenus | 30% | 70% |
| Représentation par groupe | 10% | 90% |

### 7.3 Exemple de Déséquilibre

**Scénario :** Déséquilibre de genre

```
Distribution par genre :
Masculin    : 80 feedbacks (76%)
Féminin     : 20 feedbacks (19%)
Non-binaire : 5 feedbacks (5%)

Conclusion : Déséquilibre détecté.
Les candidats masculins sont sur-représentés.
```

---

## 8. Étape 4 : Détection de Patterns

### 8.1 Patterns Discriminatoires

Le système détecte les patterns discriminatoires systémiques :

```typescript
function detectDiscriminatoryPatterns(feedbacks: BiasFilterData[]): PatternAnalysis {
  const patterns: DiscriminatoryPattern[] = [];
  
  // Pattern 1 : Sur-rejet d'un groupe
  const rejectionPatterns = detectRejectionPatterns(feedbacks);
  patterns.push(...rejectionPatterns);
  
  // Pattern 2 : Sous-rejet d'un groupe
  const retentionPatterns = detectRetentionPatterns(feedbacks);
  patterns.push(...retentionPatterns);
  
  // Pattern 3 : Facteur déterminant discriminatoire
  const factorPatterns = detectFactorPatterns(feedbacks);
  patterns.push(...factorPatterns);
  
  return {
    hasPatterns: patterns.length > 0,
    patterns,
    severity: calculatePatternSeverity(patterns)
  };
}

function detectRejectionPatterns(feedbacks: BiasFilterData[]): DiscriminatoryPattern[] {
  const patterns: DiscriminatoryPattern[] = [];
  
  // Pour chaque critère prohibé
  const prohibitedCriteria = ['ageGroup', 'gender', 'nationality'];
  
  for (const criterion of prohibitedCriteria) {
    const groups = getGroups(feedbacks, criterion);
    
    for (const group of groups) {
      const groupFeedbacks = feedbacks.filter(f => f.candidateData[criterion] === group);
      const rejectionRate = groupFeedbacks.filter(f => f.decision.finalDecision === 'rejected').length / groupFeedbacks.length;
      
      if (rejectionRate > 0.7) {
        patterns.push({
          type: 'high_rejection',
          criterion,
          group,
          rejectionRate,
          description: `Taux de rejet élevé (${(rejectionRate * 100).toFixed(0)}%) pour ${group}`
        });
      }
    }
  }
  
  return patterns;
}
```

### 8.2 Exemple de Pattern

**Scénario :** Pattern de rejet par nationalité

```
Taux de rejet par nationalité :
Française      : 40%
Allemande      : 35%
Espagnole      : 45%
Autre (non-UE) : 85%

Conclusion : Pattern discriminatoire détecté.
Les candidats non-UE ont un taux de rejet significativement plus élevé (85% vs ~40%).
```

---

## 9. Étape 5 : Décision

### 9.1 Critères de Décision

Le lot est approuvé si :

- Aucune corrélation significative avec critères prohibés
- Distribution équilibrée des feedbacks
- Aucun pattern discriminatoire systémique

Le lot est suspendu si :

- Corrélation significative détectée (p < 0.05)
- Distribution déséquilibrée (hors seuils)
- Pattern discriminatoire détecté

### 9.2 Algorithme de Décision

```typescript
function makeFilterDecision(
  correlationAnalysis: CorrelationAnalysis,
  distributionAnalysis: DistributionAnalysis,
  patternAnalysis: PatternAnalysis
): FilterDecision {
  const issues: string[] = [];
  
  if (correlationAnalysis.hasCorrelation) {
    issues.push(...correlationAnalysis.correlations.map(c => 
      `Corrélation significative détectée pour ${criterion} (p=${c.pValue.toFixed(3)})`
    ));
  }
  
  if (!distributionAnalysis.isBalanced) {
    issues.push(...distributionAnalysis.imbalances.map(i => i.description));
  }
  
  if (patternAnalysis.hasPatterns) {
    issues.push(...patternAnalysis.patterns.map(p => p.description));
  }
  
  if (issues.length === 0) {
    return {
      decision: 'approved',
      reason: 'Aucun biais détecté',
      issues: []
    };
  }
  
  const severity = calculateOverallSeverity(
    correlationAnalysis.severity,
    distributionAnalysis.isBalanced,
    patternAnalysis.severity
  );
  
  return {
    decision: 'suspended',
    reason: `Biais détecté : ${issues.join(', ')}`,
    issues,
    severity
  };
}
```

---

## 10. Étape 6 : Alerte et Analyse

### 10.1 Alerte Automatique

Si le lot est suspendu, une alerte automatique est envoyée :

**Destinataires :**
- DPO (Data Protection Officer)
- DRH Référent
- Lead Technique MVP-008
- Expert Conformité

**Canal :** Email + Notification in-app + SMS (critique)

**Contenu :**
```
ALERTE CRITIQUE - BIAIS DÉTECTÉ

Lot de feedbacks suspendu pour apprentissage.

Détails :
- Lot ID : [lot-id]
- Date : [timestamp]
- Volume : [nombre] feedbacks
- Sévérité : [sévérité]

Problèmes détectés :
[liste des problèmes]

Action requise :
Analyse humaine obligatoire avant toute injection.

[Button: Accéder au lot]
[Button: Voir le rapport détaillé]
```

### 10.2 Rapport Détaillé

Un rapport détaillé est généré pour l'analyse humaine :

```typescript
interface BiasFilterReport {
  lotId: string;
  timestamp: Date;
  feedbackCount: number;
  
  correlationAnalysis: CorrelationAnalysis;
  distributionAnalysis: DistributionAnalysis;
  patternAnalysis: PatternAnalysis;
  
  decision: FilterDecision;
  
  recommendations: string[];
  
  // Données pour analyse
  anonymizedData: BiasFilterData[];
}
```

### 10.3 Processus d'Analyse Humaine

**Étape 1 : Revue par le DPO**
- Vérification de la conformité RGPD
- Validation de la légitimité des traitements
- Recommandation d'action

**Étape 2 : Revue par le DRH Référent**
- Validation de la pertinence métier
- Analyse du contexte des décisions
- Recommandation d'action

**Étape 3 : Revue par l'Expert Conformité**
- Validation de la conformité RH-000 et RH-860
- Analyse des risques juridiques
- Recommandation d'action

**Étape 4 : Décision Collégiale**
- Réunion des trois parties
- Décision finale : approuver / rejeter / nettoyer
- Traçabilité de la décision

---

## 11. Actions Possibles

### 11.1 Approuver le Lot

Si l'analyse humaine conclut qu'il n'y a pas de biais réel :

- Le lot est approuvé
- Injection dans le moteur d'apprentissage
- Traçabilité de la décision

### 11.2 Rejeter le Lot

Si l'analyse humaine conclut qu'il y a un biais réel :

- Le lot est rejeté
- Les feedbacks ne sont pas injectés
- Les recruteurs concernés sont notifiés
- Action corrective si nécessaire

### 11.3 Nettoyer le Lot

Si l'analyse humaine conclut qu'une partie du lot est biaisée :

- Les feedbacks biaisés sont supprimés du lot
- Le lot nettoyé est réanalysé
- Si nettoyé, injection dans le moteur
- Traçabilité des suppressions

---

## 12. Métriques de Suivi

### 12.1 Métriques de Filtrage

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de suspension | Lots suspendus / total lots | ≤ 5% |
| Taux de faux positifs | Lots suspendus à tort / total suspensions | ≤ 20% |
| Temps d'analyse humaine | Temps entre suspension et décision | < 48h |
| Taux d'approbation après analyse | Lots approuvés après analyse / lots suspendus | ≤ 30% |

### 12.2 Métriques de Biais

| Métrique | Description | Cible |
|----------|-------------|-------|
| Corrélation moyenne avec critères prohibés | Moyenne des corrélations détectées | < 0.1 |
| Équilibre de distribution | Écart par rapport à l'équilibre parfait | < 0.2 |
| Taux de patterns discriminatoires | Patterns détectés / total analyses | ≤ 2% |

---

## 13. Intégration avec le Pipeline d'Apprentissage

### 13.1 Positionnement

```
COLLECTE DE FEEDBACKS
    ↓
VALIDATION DE FORMAT
    ↓
FILTRE ANTI-BIAIS (Garde-Fou 1)
    ↓
Si approuvé :
    ↓
AGRÉGATION
    ↓
ANALYSE D'APPRENTISSAGE

Si suspendu :
    ↓
ALERTE + ANALYSE HUMAINE
    ↓
DÉCISION : Approuver / Rejeter / Nettoyer
    ↓
Si approuvé/nettoyé :
    ↓
AGRÉGATION
    ↓
ANALYSE D'APPRENTISSAGE
```

### 13.2 API d'Intégration

**Endpoint :**
```
POST /api/learning/bias-filter
```

**Body :**
```json
{
  "lotId": "...",
  "feedbacks": [...]
}
```

**Response :**
```json
{
  "decision": "approved" | "suspended",
  "reason": "...",
  "correlationAnalysis": {...},
  "distributionAnalysis": {...},
  "patternAnalysis": {...},
  "reportUrl": "https://..."
}
```

---

## 14. Exemples de Cas

### 14.1 Cas 1 : Lot Approuvé

**Situation :** Lot de 50 feedbacks, aucune corrélation significative, distribution équilibrée.

**Analyse :**
- Corrélation : Aucune significative (p > 0.05 pour tous les critères)
- Distribution : Équilibrée (retenus : 45%, refusés : 55%)
- Patterns : Aucun pattern discriminatoire

**Décision :** Approuvé

**Action :** Injection dans le moteur d'apprentissage

### 14.2 Cas 2 : Lot Suspendu - Corrélation Âge

**Situation :** Lot de 30 feedbacks, corrélation significative entre âge et décision.

**Analyse :**
- Corrélation : Significative pour âge (p = 0.014, Cramer's V = 0.34)
- Distribution : Candidats 20-25 ans : 80% des refusés
- Patterns : Taux de rejet élevé pour 20-25 ans (85%)

**Décision :** Suspendu

**Action :** Alerte DPO + DRH, analyse humaine requise

### 14.3 Cas 3 : Lot Suspendu - Déséquilibre Genre

**Situation :** Lot de 40 feedbacks, déséquilibre majeur de genre.

**Analyse :**
- Corrélation : Non significative
- Distribution : Masculin 85%, Féminin 15%
- Patterns : Sur-représentation masculine

**Décision :** Suspendu

**Action :** Alerte DPO + DRH, analyse humaine requise

### 14.4 Cas 4 : Lot Nettoyé

**Situation :** Lot de 60 feedbacks, 10 feedbacks biaisés détectés.

**Analyse :**
- Corrélation : Significative pour nationalité (p = 0.03)
- Patterns : Taux de rejet élevé pour non-UE (90%)
- Feedbacks concernés : 10 sur 60

**Décision humaine :** Nettoyer

**Action :** Suppression des 10 feedbacks biaisés, réanalyse du lot nettoyé (50 feedbacks), approbation

---

## 15. Maintenance

### 15.1 Maintenance du Filtre

Le filtre anti-biais doit être maintenu :

- **Mise à jour des critères prohibés** : Lors de l'évolution de RH-000 et RH-860
- **Amélioration des algorithmes** : Adoption de nouvelles techniques de détection
- **Surveillance des faux positifs** : Monitoring et ajustement des seuils

### 15.2 Maintenance de la Base de Données

La base de données d'analyse doit être maintenue :

- **Archivage** : Archivage des analyses anciennes (> 1 an)
- **Anonymisation** : Anonymisation des données stockées
- **Optimisation** : Optimisation des requêtes

---

## 16. Conclusion

Le protocole filtre anti-biais garantit :

- **Détection systématique** des biais potentiels
- **Blocage automatique** des lots biaisés
- **Analyse humaine** obligatoire avant injection
- **Traçabilité complète** des décisions
- **Conformité** RH-000 et RH-860
- **Prévention** de l'amplification des biais
