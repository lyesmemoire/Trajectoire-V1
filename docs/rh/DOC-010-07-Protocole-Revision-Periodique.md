# DOC-010-07 : Protocole de Révision Périodique

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de révision périodique de la mémoire personnalisée de MVP-010. Ce protocole garantit que les données et apprentissages restent pertinents, conformes et ne deviennent pas obsolètes avec le temps.

---

## 2. Principe Fondateur

Revue périodique :
- Le moteur signale les apprentissages dont la pertinence diminue avec le temps
- Révision semestrielle des règles contextuelles
- Purge des données au-delà de la durée de conservation définie

---

## 3. Calendrier de Révision

### 3.1 Fréquence des Révisions

| Type de révision | Fréquence | Déclenchement |
|------------------|-----------|---------------|
| Révision des préférences implicites | Mensuelle | Automatique |
| Révision des règles contextuelles | Semestrielle | Automatique |
| Révision des apprentissages accumulés | Trimestrielle | Automatique |
| Révision de la pertinence des données | Mensuelle | Automatique |
| Purge des données expirées | Quotidienne | Automatique |
| Audit de conformité | Annuel | Automatique |
| Révision manuelle | À la demande | Recruteur |

### 3.2 Planning Annuel

```
Janvier : Révision des préférences implicites
Février : Révision de la pertinence des données
Mars : Révision des apprentissages accumulés (Q1)
Avril : Révision des préférences implicites
Mai : Révision de la pertinence des données
Juin : Révision des règles contextuelles (semestrielle)
Juillet : Révision des préférences implicites
Août : Révision de la pertinence des données
Septembre : Révision des apprentissages accumulés (Q3)
Octobre : Révision des préférences implicites
Novembre : Révision de la pertinence des données
Décembre : Audit de conformité annuel
```

---

## 4. Révision des Préférences Implicites

### 4.1 Objectif

Vérifier que les préférences implicites apprises restent pertinentes et ne sont pas devenues obsolètes.

### 4.2 Critères de Révision

```typescript
interface ImplicitPreferenceReview {
  preferenceId: string;
  description: string;
  
  metrics: {
    age: number; // en mois depuis création
    frequency: number; // fréquence d'utilisation
    accuracy: number; // précision des prédictions
    relevance: number; // score de pertinence 0-1
  };
  
  reviewResult: {
    status: 'valid' | 'degrading' | 'obsolete' | 'biased';
    recommendation: string;
    actionRequired: boolean;
  };
}
```

### 4.3 Algorithme de Révision

```typescript
async function reviewImplicitPreferences(recruiterId: string): Promise<ImplicitPreferenceReview[]> {
  const preferences = await getImplicitPreferences(recruiterId);
  const reviews: ImplicitPreferenceReview[] = [];
  
  for (const preference of preferences) {
    const age = calculateAgeInMonths(preference.createdAt);
    const frequency = calculateUsageFrequency(preference);
    const accuracy = calculatePredictionAccuracy(preference);
    const relevance = calculateRelevanceScore(preference);
    
    let status: 'valid' | 'degrading' | 'obsolete' | 'biased';
    let recommendation: string;
    let actionRequired: boolean;
    
    // Évaluation du statut
    if (age > 12 && relevance < 0.5) {
      status = 'obsolete';
      recommendation = 'Supprimer cette préférence';
      actionRequired = true;
    } else if (age > 6 && relevance < 0.7) {
      status = 'degrading';
      recommendation = 'Surveiller cette préférence';
      actionRequired = false;
    } else if (await checkBias(preference)) {
      status = 'biased';
      recommendation = 'Corriger ou supprimer cette préférence';
      actionRequired = true;
    } else {
      status = 'valid';
      recommendation = 'Conserver cette préférence';
      actionRequired = false;
    }
    
    reviews.push({
      preferenceId: preference.id,
      description: preference.description,
      metrics: { age, frequency, accuracy, relevance },
      reviewResult: { status, recommendation, actionRequired }
    });
  }
  
  return reviews;
}
```

### 4.4 Notification au Recruteur

```
┌─────────────────────────────────────────┐
│ RÉVISION DES PRÉFÉRENCES IMPLICITES    │
├─────────────────────────────────────────┤
│                                         │
| Révision mensuelle terminée.            │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RÉSULTATS                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Total de préférences : 8                │
| ✅ Valides : 6                         │
| ⚠️ Dégradantes : 1                      │
| ❌ Obsolètes : 1                        │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
| ACTIONS REQUISES                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Préférence obsolète :                   │
| "Préférence pour les profils avec       │
|  expérience startup"                   │
|                                         │
| Recommandation : Supprimer              │
|                                         │
| [Supprimer] [Conserver] [Ignorer]       │
│                                         │
| [Voir le détail]                        │
└─────────────────────────────────────────┘
```

---

## 5. Révision des Règles Contextuelles

### 5.1 Objectif

Vérifier que les règles contextuelles validées restent pertinentes dans le contexte actuel.

### 5.2 Critères de Révision

```typescript
interface ContextualRuleReview {
  ruleId: string;
  description: string;
  context: string;
  
  metrics: {
    age: number; // en mois depuis création
    validationCount: number;
    successRate: number;
    recentSuccessRate: number; // succès récent (3 derniers mois)
    contextStability: number; // stabilité du contexte 0-1
  };
  
  reviewResult: {
    status: 'valid' | 'needs_revalidation' | 'obsolete' | 'context_changed';
    recommendation: string;
    actionRequired: boolean;
  };
}
```

### 5.3 Algorithme de Révision

```typescript
async function reviewContextualRules(recruiterId: string): Promise<ContextualRuleReview[]> {
  const rules = await getContextualRules(recruiterId);
  const reviews: ContextualRuleReview[] = [];
  
  for (const rule of rules) {
    const age = calculateAgeInMonths(rule.createdAt);
    const recentSuccessRate = calculateRecentSuccessRate(rule, 3); // 3 derniers mois
    const contextStability = await checkContextStability(rule.context);
    
    let status: 'valid' | 'needs_revalidation' | 'obsolete' | 'context_changed';
    let recommendation: string;
    let actionRequired: boolean;
    
    // Évaluation du statut
    if (contextStability < 0.5) {
      status = 'context_changed';
      recommendation = 'Le contexte a changé, révalider la règle';
      actionRequired = true;
    } else if (recentSuccessRate < 0.6 && rule.validationCount > 10) {
      status = 'needs_revalidation';
      recommendation = 'La règle est moins efficace, révalider';
      actionRequired = true;
    } else if (age > 12 && recentSuccessRate < 0.5) {
      status = 'obsolete';
      recommendation = 'La règle est obsolète, supprimer';
      actionRequired = true;
    } else {
      status = 'valid';
      recommendation = 'La règle reste pertinente';
      actionRequired = false;
    }
    
    reviews.push({
      ruleId: rule.id,
      description: rule.description,
      context: rule.context,
      metrics: {
        age,
        validationCount: rule.validationCount,
        successRate: rule.successRate,
        recentSuccessRate,
        contextStability
      },
      reviewResult: { status, recommendation, actionRequired }
    });
  }
  
  return reviews;
}
```

### 5.4 Détection de Changement de Contexte

```typescript
async function checkContextStability(context: string): Promise<number> {
  const currentContext = await getCurrentContext();
  const storedContext = await getStoredContext(context);
  
  // Comparaison des contextes
  const similarity = calculateContextSimilarity(currentContext, storedContext);
  
  return similarity; // 0-1, 1 = identique, 0 = complètement différent
}
```

---

## 6. Révision des Apprentissages Accumulés

### 6.1 Objectif

Vérifier que les apprentissages accumulés (patterns prédicteurs, anti-patterns) restent pertinents.

### 6.2 Critères de Révision

```typescript
interface AccumulatedLearningReview {
  learningId: string;
  type: 'predictor_pattern' | 'anti_pattern';
  description: string;
  
  metrics: {
    age: number; // en mois depuis création
    sampleSize: number;
    confidence: number;
    recentAccuracy: number;
    trend: 'improving' | 'stable' | 'degrading';
  };
  
  reviewResult: {
    status: 'valid' | 'needs_update' | 'obsolete';
    recommendation: string;
    actionRequired: boolean;
  };
}
```

### 6.3 Algorithme de Révision

```typescript
async function reviewAccumulatedLearnings(recruiterId: string): Promise<AccumulatedLearningReview[]> {
  const learnings = await getAccumulatedLearnings(recruiterId);
  const reviews: AccumulatedLearningReview[] = [];
  
  for (const learning of learnings) {
    const age = calculateAgeInMonths(learning.createdAt);
    const recentAccuracy = calculateRecentAccuracy(learning, 3); // 3 derniers mois
    const trend = calculateTrend(learning);
    
    let status: 'valid' | 'needs_update' | 'obsolete';
    let recommendation: string;
    let actionRequired: boolean;
    
    // Évaluation du statut
    if (trend === 'degrading' && recentAccuracy < 0.6) {
      status = 'needs_update';
      recommendation = 'Le pattern se dégrade, mettre à jour';
      actionRequired = true;
    } else if (age > 12 && recentAccuracy < 0.5) {
      status = 'obsolete';
      recommendation = 'Le pattern est obsolète, supprimer';
      actionRequired = true;
    } else if (learning.sampleSize < 10) {
      status = 'needs_update';
      recommendation = 'Échantillon insuffisant, attendre plus de données';
      actionRequired = false;
    } else {
      status = 'valid';
      recommendation = 'Le pattern reste pertinent';
      actionRequired = false;
    }
    
    reviews.push({
      learningId: learning.id,
      type: learning.type,
      description: learning.description,
      metrics: {
        age,
        sampleSize: learning.sampleSize,
        confidence: learning.confidence,
        recentAccuracy,
        trend
      },
      reviewResult: { status, recommendation, actionRequired }
    });
  }
  
  return reviews;
}
```

---

## 7. Révision de la Pertinence des Données

### 7.1 Objectif

Vérifier que les données stockées restent pertinentes et ne sont pas devenues obsolètes.

### 7.2 Critères de Révision

```typescript
interface DataRelevanceReview {
  dataType: 'preferences' | 'history' | 'context' | 'learnings';
  
  metrics: {
    totalRecords: number;
    staleRecords: number; // données obsolètes
    staleRate: number; // taux d'obsolescence
    lastUpdate: Date;
    dataFreshness: number; // fraîcheur des données 0-1
  };
  
  reviewResult: {
    status: 'fresh' | 'aging' | 'stale';
    recommendation: string;
    actionRequired: boolean;
  };
}
```

### 7.3 Algorithme de Révision

```typescript
async function reviewDataRelevance(recruiterId: string): Promise<DataRelevanceReview[]> {
  const dataTypes = ['preferences', 'history', 'context', 'learnings'] as const;
  const reviews: DataRelevanceReview[] = [];
  
  for (const dataType of dataTypes) {
    const data = await getDataByType(recruiterId, dataType);
    const staleRecords = data.filter(d => isStale(d));
    const staleRate = staleRecords.length / data.length;
    const dataFreshness = 1 - staleRate;
    
    let status: 'fresh' | 'aging' | 'stale';
    let recommendation: string;
    let actionRequired: boolean;
    
    // Évaluation du statut
    if (staleRate > 0.5) {
      status = 'stale';
      recommendation = 'Purger les données obsolètes';
      actionRequired = true;
    } else if (staleRate > 0.2) {
      status = 'aging';
      recommendation = 'Surveiller les données';
      actionRequired = false;
    } else {
      status = 'fresh';
      recommendation = 'Les données sont fraîches';
      actionRequired = false;
    }
    
    reviews.push({
      dataType,
      metrics: {
        totalRecords: data.length,
        staleRecords: staleRecords.length,
        staleRate,
        lastUpdate: data.length > 0 ? data[data.length - 1].updatedAt : new Date(),
        dataFreshness
      },
      reviewResult: { status, recommendation, actionRequired }
    });
  }
  
  return reviews;
}
```

### 7.4 Détection de Données Obsolètes

```typescript
function isStale(data: any): boolean {
  const ageInMonths = calculateAgeInMonths(data.updatedAt || data.createdAt);
  
  // Critères d'obsolescence par type
  const staleThresholds = {
    preferences: 12, // 12 mois
    history: 36, // 36 mois (durée de conservation)
    context: 6, // 6 mois
    learnings: 24 // 24 mois
  };
  
  const threshold = staleThresholds[data.type] || 12;
  
  return ageInMonths > threshold;
}
```

---

## 8. Purge des Données Expirées

### 8.1 Objectif

Purger automatiquement les données qui ont dépassé leur durée de conservation.

### 8.2 Processus de Purge

```typescript
async function purgeExpiredData(): Promise<PurgeResult> {
  const purgeDate = new Date();
  
  // Récupération des données expirées
  const expiredPreferences = await getExpiredData('preferences', purgeDate);
  const expiredHistory = await getExpiredData('history', purgeDate);
  const expiredContext = await getExpiredData('context', purgeDate);
  const expiredLearnings = await getExpiredData('learnings', purgeDate);
  
  // Purge des données
  const purgedPreferences = await purgeData(expiredPreferences);
  const purgedHistory = await purgeData(expiredHistory);
  const purgedContext = await purgeData(expiredContext);
  const purgedLearnings = await purgeData(expiredLearnings);
  
  // Notification au DPO
  await notifyDPPOfPurge({
    date: purgeDate,
    counts: {
      preferences: purgedPreferences.length,
      history: purgedHistory.length,
      context: purgedContext.length,
      learnings: purgedLearnings.length
    }
  });
  
  return {
    date: purgeDate,
    totalPurged: purgedPreferences.length + purgedHistory.length + purgedContext.length + purgedLearnings.length,
    byType: {
      preferences: purgedPreferences.length,
      history: purgedHistory.length,
      context: purgedContext.length,
      learnings: purgedLearnings.length
    }
  };
}
```

### 8.3 Durées de Conservation

| Type de données | Durée de conservation | Base légale |
|-----------------|----------------------|-------------|
| Préférences explicites | Tant que le recruteur consent | Consentement |
| Préférences implicites | 2 ans après dernière activité | Pertinence |
| Historique de décisions | 3 ans | Code du travail |
| Profils candidats anonymisés | 3 ans | Code du travail |
| Contexte organisationnel | Tant que le recruteur consent | Consentement |
| Apprentissages accumulés | 2 ans après dernière validation | Pertinence |
| Logs d'accès | 1 an | Sécurité |
| Logs de consentement | 5 ans | Preuve légale |

---

## 9. Audit de Conformité Annuel

### 9.1 Objectif

Audit annuel complet de la conformité de la mémoire au RGPD et aux exigences internes.

### 9.2 Structure de l'Audit

```typescript
interface AnnualComplianceAudit {
  auditId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  sections: {
    dataProtection: DataProtectionAudit;
    biasDetection: BiasDetectionAudit;
    dataRetention: DataRetentionAudit;
    accessControl: AccessControlAudit;
    consentCompliance: ConsentComplianceAudit;
  };
  
  overallResult: {
    compliant: boolean;
    findings: AuditFinding[];
    recommendations: string[];
    nextAuditDate: Date;
  };
}
```

### 9.3 Sections de l'Audit

#### 9.3.1 Protection des Données

```typescript
interface DataProtectionAudit {
  encryptionStatus: 'compliant' | 'non_compliant';
  accessControlStatus: 'compliant' | 'non_compliant';
  anonymizationStatus: 'compliant' | 'non_compliant';
  backupStatus: 'compliant' | 'non_compliant';
  
  findings: string[];
}
```

#### 9.3.2 Détection de Biais

```typescript
interface BiasDetectionAudit {
  totalAlerts: number;
  alertsBySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  alertsResolved: number;
  alertsPending: number;
  
  findings: string[];
}
```

#### 9.3.3 Conservation des Données

```typescript
interface DataRetentionAudit {
  expiredDataPurged: number;
  expiredDataRemaining: number;
  retentionPolicyCompliant: boolean;
  
  findings: string[];
}
```

#### 9.3.4 Contrôle d'Accès

```typescript
interface AccessControlAudit {
  unauthorizedAccessAttempts: number;
  accessViolations: number;
  accessLogsComplete: boolean;
  
  findings: string[];
}
```

#### 9.3.5 Conformité du Consentement

```typescript
interface ConsentComplianceAudit {
  recruitersWithMemory: number;
  recruitersWithValidConsent: number;
  consentComplianceRate: number;
  consentWithdrawals: number;
  
  findings: string[];
}
```

### 9.4 Processus d'Audit

```typescript
async function performAnnualComplianceAudit(): Promise<AnnualComplianceAudit> {
  const auditId = generateUUID();
  const period = {
    startDate: new Date(new Date().getFullYear() - 1, 0, 1),
    endDate: new Date(new Date().getFullYear() - 1, 11, 31)
  };
  
  // Audit de la protection des données
  const dataProtection = await auditDataProtection();
  
  // Audit de la détection de biais
  const biasDetection = await auditBiasDetection(period);
  
  // Audit de la conservation des données
  const dataRetention = await auditDataRetention();
  
  // Audit du contrôle d'accès
  const accessControl = await auditAccessControl(period);
  
  // Audit de la conformité du consentement
  const consentCompliance = await auditConsentCompliance();
  
  // Agrégation des résultats
  const findings = [
    ...dataProtection.findings,
    ...biasDetection.findings,
    ...dataRetention.findings,
    ...accessControl.findings,
    ...consentCompliance.findings
  ];
  
  const compliant = findings.filter(f => f.severity === 'high').length === 0;
  
  const recommendations = generateRecommendations(findings);
  
  const audit: AnnualComplianceAudit = {
    auditId,
    period,
    sections: {
      dataProtection,
      biasDetection,
      dataRetention,
      accessControl,
      consentCompliance
    },
    overallResult: {
      compliant,
      findings,
      recommendations,
      nextAuditDate: new Date(new Date().getFullYear() + 1, 0, 1)
    }
  };
  
  // Notification au DPO
  await notifyDPOOfAudit(audit);
  
  // Enregistrement de l'audit
  await recordAudit(audit);
  
  return audit;
}
```

---

## 10. Interface de Révision

### 10.1 Tableau de Bord de Révision

```
┌─────────────────────────────────────────┐
│ TABLEAU DE BORD DE RÉVISION            │
├─────────────────────────────────────────┤
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ PROCHAINE RÉVISION AUTOMATIQUE         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Révision des préférences implicites :   │
| Dans 15 jours                          │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ÉTAT DE LA MÉMOIRE                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Préférences : ✅ À jour                 │
| Historique : ⚠️ 3 données obsolètes      │
| Contexte : ✅ À jour                     │
| Apprentissages : ⚠️ 1 pattern dégradé   │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ALERTES EN ATTENTION                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| • 1 règle contextuelle à révalider       │
| • 1 pattern prédicteur dégradé          │
│ • 3 données historiques expirées         │
│                                         │
| [Voir les détails] [Traiter les alertes] │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ACTIONS RAPIDES                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ [Lancer une révision manuelle]           │
│ [Purger les données expirées]            │
│ [Exporter le rapport de révision]       │
│                                         │
└─────────────────────────────────────────┘
```

### 10.2 Rapport de Révision

```
┌─────────────────────────────────────────┐
│ RAPPORT DE RÉVISION                    │
├─────────────────────────────────────────┤
│                                         │
| Période : 01/01/2026 - 30/06/2026     │
| Date : 03/08/2026                       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RÉSUMÉ                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Statut global : ✅ Conforme              │
|                                         │
| Préférences implicites : 6/8 valides    │
| Règles contextuelles : 12/15 valides     │
| Apprentissages : 10/12 valides          │
| Données : 95% fraîches                 │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ DÉTAILS                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| [Préférences implicites]                │
| ✅ PP-001 : Expérience startup - Valide │
| ✅ PP-002 : Autonomie - Valide          │
| ⚠️ PP-003 : Certifications - Dégradant│
| ❌ PP-004 : École spécifique - Obsolète │
|                                         │
| [Règles contextuelles]                 │
| ✅ CR-001 : Docker > Certifications - Valide│
| ✅ CR-002 : Expérience startup > Diplôme - Valide│
| ⚠️ CR-003 : Remote-first - Contexte changé│
|                                         │
| [Apprentissages]                        │
| ✅ PP-001 : Profil startup réussi - Valide│
| ⚠️ AP-001 : Profil grande entreprise - Dégradant│
|                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RECOMMANDATIONS                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| 1. Supprimer PP-004 (obsolète)          │
| 2. Révalider CR-003 (contexte changé)   │
| 3. Surveiller AP-001 (dégradant)        │
│ 4. Purger les 3 données historiques expirées│
│                                         │
| [Exporter le rapport] [Fermer]          │
└─────────────────────────────────────────┘
```

---

## 11. Notification et Communication

### 11.1 Notification Automatique

Le recruteur est notifié automatiquement :

- **Avant** chaque révision automatique (7 jours avant)
- **Après** chaque révision automatique
- **En cas** d'action requise

### 11.2 Notification DPO

Le DPO est notifié :

- **Après** chaque révision semestrielle
- **En cas** d'alerte de biais
- **Après** l'audit annuel

---

## 12. Documentation et Traçabilité

### 12.1 Journalisation des Révisions

```sql
CREATE TABLE periodic_review_log (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  review_id VARCHAR(36) UNIQUE NOT NULL,
  review_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  results JSON NOT NULL,
  actions_taken JSON,
  
  performed_by VARCHAR(36),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_review_recruiter ON periodic_review_log(recruiter_id);
CREATE INDEX idx_review_type ON periodic_review_log(review_type);
CREATE INDEX idx_review_timestamp ON periodic_review_log(timestamp);
```

---

## 13. Indicateurs de Suivi

### 13.1 Métriques de Révision

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de conformité | Données conformes / total | ≥ 95% |
| Taux d'obsolescence | Données obsolètes / total | ≤ 5% |
| Taux de résolution | Alertes résolues / total | 100% |
| Délai de résolution | Temps moyen de résolution | < 7 jours |

### 13.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Fraîcheur des données | Données fraîches / total | ≥ 90% |
| Pertinence des apprentissages | Apprentissages pertinents / total | ≥ 85% |
| Stabilité du contexte | Contexte stable / total | ≥ 80% |

---

## 14. Conclusion

Le protocole de révision périodique garantit :

- **Pertinence** continue des données et apprentissages
- **Conformité** RGPD et légale
- **Purge automatique** des données expirées
- **Détection** des changements de contexte
- **Audit annuel** de conformité
- **Transparence** pour le recruteur
- **Notification** au DPO
