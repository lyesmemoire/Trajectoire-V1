# DOC-010-06 : Protocole de Détection de Biais dans les Préférences Apprises

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de détection de biais dans les préférences apprises de MVP-010. Ce protocole garantit que la mémoire ne peut pas apprendre de biais discriminatoires, conformément aux obligations légales anti-discrimination et au PIA.

---

## 2. Principe Fondateur

**Vigilance obligatoire :** Si les préférences implicites apprises révèlent un pattern potentiellement discriminatoire → Alerte immédiate au recruteur et au DPO. La mémoire ne peut pas apprendre des biais.

---

## 3. Types de Biais Détectés

### 3.1 Classification des Biais

```typescript
enum BiasType {
  AGE_BIAS = 'age_bias',
  GENDER_BIAS = 'gender_bias',
  ETHNICITY_BIAS = 'ethnicity_bias',
  DISABILITY_BIAS = 'disability_bias',
  RELIGION_BIAS = 'religion_bias',
  SEXUAL_ORIENTATION_BIAS = 'sexual_orientation_bias',
  SOCIOECONOMIC_BIAS = 'socioeconomic_bias',
  EDUCATION_BIAS = 'education_bias',
  GEOGRAPHIC_BIAS = 'geographic_bias',
  UNKNOWN_BIAS = 'unknown_bias'
}
```

### 3.2 Critères Prohibés

| Critère | Catégorie | Détection |
|---------|-----------|-----------|
| Âge | Âge | Analyse de l'âge des candidats acceptés/refusés |
| Genre | Genre | Analyse du genre des candidats acceptés/refusés |
| Origine ethnique | Origine | Analyse de l'origine ethnique (si disponible) |
| Handicap | Handicap | Analyse du statut de handicap (si disponible) |
| Religion | Religion | Analyse de la religion (si disponible) |
| Orientation sexuelle | Orientation | Analyse de l'orientation sexuelle (si disponible) |
| Situation familiale | Situation familiale | Analyse de la situation familiale |
| Adresse / Code postal | Géographie | Analyse de la localisation géographique |
| Nom de famille | Origine potentielle | Analyse des noms de famille |
| École / Université | Origine socio-économique | Analyse des établissements |

---

## 4. Méthodes de Détection

### 4.1 Détection Statistique

Analyse statistique de la distribution des décisions par critère prohibé.

```typescript
interface StatisticalBiasDetection {
  criterion: string;
  protectedGroup: string;
  referenceGroup: string;
  
  acceptanceRates: {
    protected: number; // 0-1
    reference: number; // 0-1
  };
  
  statisticalTest: {
    test: 'chi_square' | 'fisher_exact' | 't_test';
    statistic: number;
    pValue: number;
    significant: boolean;
    threshold: number; // typically 0.05
  };
  
  effectSize: {
    measure: 'cohens_d' | 'odds_ratio' | 'risk_ratio';
    value: number;
    interpretation: 'small' | 'medium' | 'large';
  };
}
```

### 4.2 Algorithme de Détection Statistique

```typescript
async function detectStatisticalBias(
 decisions: DecisionHistory[],
 criterion: string
): Promise<StatisticalBiasDetection[]> {
  const groups = groupByCriterion(decisions, criterion);
  const results: StatisticalBiasDetection[] = [];
  
  for (const [group1, group2] of allPairs(groups)) {
    const acceptanceRate1 = calculateAcceptanceRate(group1);
    const acceptanceRate2 = calculateAcceptanceRate(group2);
    
    const statisticalTest = performChiSquareTest(group1, group2);
    const effectSize = calculateOddsRatio(group1, group2);
    
    if (statisticalTest.significant) {
      results.push({
        criterion,
        protectedGroup: group1,
        referenceGroup: group2,
        acceptanceRates: {
          protected: acceptanceRate1,
          reference: acceptanceRate2
        },
        statisticalTest,
        effectSize
      });
    }
  }
  
  return results;
}
```

### 4.3 Détection par Corrélation

Analyse de la corrélation entre les décisions et les critères prohibés.

```typescript
interface CorrelationBiasDetection {
  criterion: string;
  correlation: number; // -1 to 1
  pValue: number;
  significant: boolean;
  threshold: number; // typically 0.05
}
```

### 4.4 Algorithme de Détection par Corrélation

```typescript
async function detectCorrelationBias(
 decisions: DecisionHistory[],
 criterion: string
): Promise<CorrelationBiasDetection> {
  const decisionsBinary = decisions.map(d => d.decision === 'accepted' ? 1 : 0);
  const criterionValues = decisions.map(d => extractCriterionValue(d, criterion));
  
  const correlation = calculatePearsonCorrelation(decisionsBinary, criterionValues);
  const pValue = calculatePValue(correlation, decisions.length);
  
  return {
    criterion,
    correlation,
    pValue,
    significant: pValue < 0.05,
    threshold: 0.05
  };
}
```

### 4.5 Détection par Pattern

Analyse des patterns de décision qui pourraient indiquer un biais.

```typescript
interface PatternBiasDetection {
  patternId: string;
  description: string;
  frequency: number;
  confidence: number;
  
  potentialBias: {
    type: BiasType;
    evidence: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}
```

### 4.6 Algorithme de Détection par Pattern

```typescript
async function detectPatternBias(
 decisions: DecisionHistory[]
): Promise<PatternBiasDetection[]> {
  const patterns = extractDecisionPatterns(decisions);
  const results: PatternBiasDetection[] = [];
  
  for (const pattern of patterns) {
    const potentialBias = analyzePatternForBias(pattern);
    
    if (potentialBias) {
      results.push({
        patternId: pattern.id,
        description: pattern.description,
        frequency: pattern.frequency,
        confidence: pattern.confidence,
        potentialBias
      });
    }
  }
  
  return results;
}
```

---

## 5. Seuils de Détection

### 5.1 Seuils Statistiques

| Métrique | Seuil d'alerte | Seuil critique |
|----------|----------------|----------------|
| Différence de taux d'acceptation | > 15% | > 30% |
| Valeur p (statistique) | < 0.05 | < 0.01 |
| Odds ratio | < 0.67 ou > 1.5 | < 0.5 ou > 2.0 |
| Corrélation | |r| > 0.3 | |r| > 0.5 |

### 5.2 Seuils de Fréquence

| Métrique | Seuil d'alerte | Seuil critique |
|----------|----------------|----------------|
| Fréquence du pattern biaisé | > 20% | > 40% |
| Échantillon minimum | 30 décisions | 50 décisions |

---

## 6. Processus de Détection

### 6.1 Flux de Détection

```
Décision du recruteur
    ↓
Extraction des données
    ↓
Détection statistique (critères prohibés)
    ↓
Détection par corrélation
    ↓
Détection par pattern
    ↓
Agrégation des résultats
    ↓
Évaluation de la sévérité
    ↓
Alerte si biais détecté
```

### 6.2 Algorithme Complet

```typescript
async function detectBias(decision: DecisionHistory): Promise<BiasDetectionResult> {
  const recruiterId = decision.recruiterId;
  
  // Récupération de l'historique des décisions
  const history = await getDecisionHistory(recruiterId);
  
  // Détection statistique
  const statisticalBiases = await Promise.all(
    PROHIBITED_CRITERIA.map(criterion => 
      detectStatisticalBias(history, criterion)
    )
  ).then(results => results.flat());
  
  // Détection par corrélation
  const correlationBiases = await Promise.all(
    PROHIBITED_CRITERIA.map(criterion => 
      detectCorrelationBias(history, criterion)
    )
  );
  
  // Détection par pattern
  const patternBiases = await detectPatternBias(history);
  
  // Agrégation des résultats
  const allBiases = [
    ...statisticalBiases.map(b => ({ type: 'statistical', data: b })),
    ...correlationBiases.map(b => ({ type: 'correlation', data: b })),
    ...patternBiases.map(b => ({ type: 'pattern', data: b }))
  ];
  
  // Évaluation de la sévérité
  const severity = evaluateSeverity(allBiases);
  
  // Génération de l'alerte si nécessaire
  if (severity !== 'none') {
    await generateBiasAlert(recruiterId, allBiases, severity);
  }
  
  return {
    recruiterId,
    timestamp: new Date(),
    biases: allBiases,
    severity,
    alertGenerated: severity !== 'none'
  };
}
```

---

## 7. Gestion des Alertes

### 7.1 Structure de l'Alerte

```typescript
interface BiasAlert {
  alertId: string;
  recruiterId: string;
  timestamp: Date;
  
  type: 'potential_discrimination' | 'pattern_concern' | 'statistical_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  description: string;
  
  detectedBiases: {
    type: BiasType;
    evidence: string;
    metric: string;
    value: number;
    threshold: number;
  }[];
  
  recommendations: string[];
  
  acknowledged: boolean;
  actionTaken?: string;
  
  notifiedRecruiter: boolean;
  notifiedDPO: boolean;
}
```

### 7.2 Algorithme de Génération d'Alerte

```typescript
async function generateBiasAlert(
 recruiterId: string,
 biases: DetectedBias[],
 severity: string
): Promise<BiasAlert> {
  const alert: BiasAlert = {
    alertId: generateUUID(),
    recruiterId,
    timestamp: new Date(),
    type: severity === 'critical' ? 'potential_discrimination' : 'pattern_concern',
    severity: severity as any,
    description: generateAlertDescription(biases, severity),
    detectedBiases: biases.map(b => ({
      type: b.data.type || BiasType.UNKNOWN_BIAS,
      evidence: b.data.description || '',
      metric: b.data.statisticalTest?.test || b.data.correlation?.toString() || '',
      value: b.data.statisticalTest?.statistic || b.data.correlation || 0,
      threshold: b.data.statisticalTest?.threshold || 0.05
    })),
    recommendations: generateRecommendations(biases, severity),
    acknowledged: false,
    notifiedRecruiter: false,
    notifiedDPO: false
  };
  
  // Notification au recruteur
  await notifyRecruiter(recruiterId, alert);
  alert.notifiedRecruiter = true;
  
  // Notification au DPO si sévérité élevée
  if (severity === 'high' || severity === 'critical') {
    await notifyDPO(alert);
    alert.notifiedDPO = true;
  }
  
  // Enregistrement de l'alerte
  await recordBiasAlert(alert);
  
  return alert;
}
```

### 7.3 Recommandations par Sévérité

**Faible (Low) :**
- Surveiller les prochaines décisions
- Vérifier si le pattern se confirme

**Moyenne (Medium) :**
- Réviser les préférences implicites
- Considérer la désactivation de l'apprentissage implicite

**Élevée (High) :**
- Désactiver immédiatement l'apprentissage implicite
- Réviser manuellement les décisions récentes
- Consulter le DPO

**Critique (Critical) :**
- Désactiver immédiatement toute la mémoire
- Bloquer les recommandations personnalisées
- Intervention obligatoire du DPO
- Audit complet du système

---

## 8. Interface d'Alerte

### 8.1 Notification au Recruteur

```
┌─────────────────────────────────────────┐
│ ⚠️ ALERTE DE BIAIS DÉTECTÉE           │
├─────────────────────────────────────────┤
│                                         │
| Un pattern potentiellement discriminatoire│
| a été détecté dans vos préférences      │
| apprises.                               │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ DÉTAILS DE L'ALERTE                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Type : Pattern concern                  │
| Sévérité : Moyenne                     │
| Date : 03/08/2026 14:30                │
│                                         │
| Pattern détecté :                      │
| "Tendance à refuser les candidats       │
|  de plus de 45 ans"                    │
│                                         │
| Évidence :                             │
| • Taux d'acceptation < 45 ans : 72%    │
| • Taux d'acceptation > 45 ans : 38%    │
| • Différence : 34% (seuil d'alerte : 15%)│
| • Valeur p : 0.02 (significatif)        │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RECOMMANDATIONS                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| 1. Réviser vos préférences implicites   │
│ 2. Considérer la désactivation de       │
|    l'apprentissage implicite            │
│ 3. Vérifier vos décisions récentes      │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ACTIONS                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| [Voir les détails du pattern]           │
| [Corriger les préférences]              │
| [Désactiver l'apprentissage implicite]  │
| [Contacter le support]                  │
│                                         │
| [J'ai compris]                          │
└─────────────────────────────────────────┘
```

### 8.2 Notification au DPO

```
┌─────────────────────────────────────────┐
│ ⚠️ ALERTE DPO - BIAIS DÉTECTÉ          │
├─────────────────────────────────────────┤
│                                         │
| Une alerte de biais a été générée.      │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ INFORMATIONS                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Recruteur : [ID]                       │
| Date : 03/08/2026 14:30                │
| Sévérité : Moyenne                     │
|                                         │
| Type de biais : Potentiel âge          │
| Pattern : Tendance à refuser les        │
| candidats de plus de 45 ans            │
│                                         │
| Métriques :                            │
| • Différence de taux : 34%             │
| • Valeur p : 0.02                       │
| • Odds ratio : 0.42                    │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ACTIONS REQUISES                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| 1. Surveiller le recruteur              │
| 2. Vérifier si le pattern se confirme   │
| 3. Intervenir si sévérité augmente      │
│                                         │
| [Voir le détail] [Marquer comme traité] │
└─────────────────────────────────────────┘
```

---

## 9. Actions Correctives

### 9.1 Désactivation de l'Apprentissage Implicite

```typescript
async function disableImplicitLearning(recruiterId: string): Promise<void> {
  // Désactivation de l'apprentissage implicite
  await updateRecruiterPreferences(recruiterId, {
    enableImplicitLearning: false
  });
  
  // Notification au recruteur
  await notifyRecruiter(recruiterId, {
    type: 'implicit_learning_disabled',
    reason: 'bias_detected'
  });
  
  // Notification au DPO
  await notifyDPO({
    recruiterId,
    action: 'implicit_learning_disabled',
    reason: 'bias_detected'
  });
  
  // Journalisation
  await logAction({
    recruiterId,
    action: 'disable_implicit_learning',
    reason: 'bias_detected',
    timestamp: new Date()
  });
}
```

### 9.2 Révision des Décisions

```typescript
async function reviewRecentDecisions(recruiterId: string): Promise<ReviewResult> {
  const recentDecisions = await getRecentDecisions(recruiterId, 30); // 30 derniers jours
  
  const flaggedDecisions = recentDecisions.filter(decision => 
    isPotentiallyBiased(decision)
  );
  
  return {
    totalDecisions: recentDecisions.length,
    flaggedDecisions: flaggedDecisions.length,
    decisions: flaggedDecisions,
    recommendation: flaggedDecisions.length > 0 ? 'manual_review_required' : 'no_action'
  };
}
```

### 9.3 Réinitialisation des Préférences

```typescript
async function resetImplicitPreferences(recruiterId: string): Promise<void> {
  // Réinitialisation des préférences implicites
  await resetImplicitPreferences(recruiterId);
  
  // Notification au recruteur
  await notifyRecruiter(recruiterId, {
    type: 'implicit_preferences_reset',
    reason: 'bias_detected'
  });
  
  // Notification au DPO
  await notifyDPO({
    recruiterId,
    action: 'implicit_preferences_reset',
    reason: 'bias_detected'
  });
}
```

---

## 10. Prévention des Biais

### 10.1 Prévention à la Source

Le système prévient l'apprentissage de biais en :

- **Excluant** les critères prohibés de l'apprentissage
- **Appliquant** des pondérations équilibrées par défaut
- **Surveillant** continuellement les patterns émergents
- **Alertant** immédiatement en cas de détection

### 10.2 Pondération Équilibrée

```typescript
interface BalancedWeights {
  age: number;
  gender: number;
  ethnicity: number;
  disability: number;
  religion: number;
  sexualOrientation: number;
  socioeconomic: number;
  education: number;
  geographic: number;
}

const BALANCED_WEIGHTS: BalancedWeights = {
  age: 0,
  gender: 0,
  ethnicity: 0,
  disability: 0,
  religion: 0,
  sexualOrientation: 0,
  socioeconomic: 0,
  education: 0.1, // Seulement si pertinent pour le poste
  geographic: 0
};
```

### 10.3 Exclusion des Critères Prohibés

```typescript
function filterProhibitedCriteria(data: any): any {
  const prohibited = [
    'age', 'gender', 'ethnicity', 'disability',
    'religion', 'sexualOrientation', 'familyStatus',
    'address', 'lastName', 'school'
  ];
  
  const filtered = { ...data };
  
  for (const criterion of prohibited) {
    delete filtered[criterion];
  }
  
  return filtered;
}
```

---

## 11. Audit et Suivi

### 11.1 Audit Périodique

Un audit de détection de biais est réalisé mensuellement :

- **Analyse statistique** de toutes les décisions
- **Vérification des alertes** générées
- **Validation des actions correctives**
- **Rapport au DPO**

### 11.2 Rapport d'Audit

```typescript
interface BiasAuditReport {
  reportId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  summary: {
    totalRecruiters: number;
    recruitersWithAlerts: number;
    totalAlerts: number;
    alertsBySeverity: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  };
  
  details: {
    alerts: BiasAlert[];
    actionsTaken: Action[];
  };
  
  recommendations: string[];
}
```

---

## 12. Indicateurs de Suivi

### 12.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Alertes générées / total décisions | < 5% |
| Taux de faux positifs | Faux confirmés / total alertes | < 10% |
| Temps de détection | Temps entre décision et alerte | < 1 heure |
| Taux de résolution | Alertes résolues / total alertes | 100% |

### 12.2 Métriques de Prévention

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de biais effectif | Décisions biaisées / total décisions | 0% |
| Diversité des recrutements | Indice de diversité | > 0.8 |
| Équité des taux d'acceptation | Différence max entre groupes | < 5% |

---

## 13. Documentation et Traçabilité

### 13.1 Journalisation des Détections

```sql
CREATE TABLE bias_detection_log (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  detection_id VARCHAR(36) UNIQUE NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  bias_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  
  metrics JSON NOT NULL,
  evidence JSON,
  
  alert_generated BOOLEAN,
  action_taken VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bias_recruiter ON bias_detection_log(recruiter_id);
CREATE INDEX idx_bias_timestamp ON bias_detection_log(timestamp);
CREATE INDEX idx_bias_severity ON bias_detection_log(severity);
```

---

## 14. Formation et Sensibilisation

### 14.1 Formation du Recruteur

Le recruteur est formé sur :

- **Biais inconscients** dans le recrutement
- **Implications légales** de la discrimination
- **Utilisation éthique** de la mémoire
- **Réponse aux alertes** de biais

### 14.2 Documentation Interne

Un guide interne est disponible :

- **Types de biais** et comment les éviter
- **Procédure de réponse** aux alertes
- **Meilleures pratiques** de recrutement équitable

---

## 15. Conclusion

Le protocole de détection de biais garantit :

- **Détection automatique** des biais discriminatoires
- **Alertes immédiates** au recruteur et DPO
- **Actions correctives** automatiques
- **Prévention** de l'apprentissage de biais
- **Conformité légale** anti-discrimination
- **Audit périodique** de l'équité du système
- **Transparence** totale des processus de détection
