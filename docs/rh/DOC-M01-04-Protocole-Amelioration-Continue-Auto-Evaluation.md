# DOC-M01-04 : Protocole d'Amélioration Continue par l'Auto-Évaluation

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'amélioration continue par l'auto-évaluation pour le MVP-META-01 Méta-Cognition Engine. Ce document structure le processus par lequel le moteur analyse ses auto-évaluations accumulées pour identifier les patterns d'erreurs récurrents et s'améliorer continuellement.

---

## 2. Principe Fondateur

Les auto-évaluations s'accumulent. Le moteur les analyse globalement pour identifier les patterns d'erreurs récurrents et s'améliorer continuellement. C'est l'apprentissage par l'auto-évaluation : le moteur apprend de ses propres erreurs pour devenir plus fiable.

---

## 3. Processus d'Amélioration Continue

### 3.1 Accumulation des Auto-Évaluations

**Processus :**
- Chaque entretien génère une auto-évaluation
- Les auto-évaluations sont stockées dans la base de données
- Le moteur analyse périodiquement les auto-évaluations accumulées

**Fréquence d'analyse :**
- Analyse hebdomadaire des auto-évaluations de la semaine
- Analyse mensuelle des auto-évaluations du mois
- Analyse trimestrielle des auto-évaluations du trimestre

### 3.2 Identification des Patterns d'Erreurs Récurrents

**Types de patterns :**
- Zones manquantes systématiques
- Creusage insuffisant récurrent
- Biais récurrents
- Questions non posées récurrentes
- Incohérences de scoring récurrentes

### 3.3 Actions Correctives Automatiques

**Types d'actions :**
- Mise à jour du plan d'entretien type
- Ajout de questions spécifiques
- Recalibration du scoring
- Renforcement du creusage
- Alerte au DRH responsable

---

## 4. Patterns d'Erreurs Récurrents

### 4.1 Pattern 1 — Zones Manquantes Systématiques

**Détection :**
Le moteur détecte qu'il manque systématiquement la même zone sur certains postes.

**Exemple :**
Sur les postes DRH, le moteur manque systématiquement la zone "Budget RH".

**Action corrective :**
- Mise à jour du plan d'entretien type pour les postes DRH
- Ajout de questions spécifiques sur le Budget RH
- Priorisation de la zone "Budget RH" dans l'algorithme de gestion du temps

**Validation :**
- Vérification sur les 10 prochains entretiens DRH
- Si la zone est couverture ≥ 90% : Pattern résolu
- Si la zone est couverture < 90% : Action corrective renforcée

### 4.2 Pattern 2 — Creusage Insuffisant Récurrent

**Détection :**
Le moteur détecte qu'il cote systématiquement trop haut sur une dimension en raison d'un creusage insuffisant.

**Exemple :**
Sur la dimension "Soft skills", le moteur obtient un score de creusage < 70% de manière récurrente.

**Action corrective :**
- Recalibration du scoring sur la dimension "Soft skills"
- Renforcement du creusage sur les réponses vagues liées aux soft skills
- Ajout de questions de creusage spécifiques pour les soft skills

**Validation :**
- Vérification sur les 10 prochains entretiens
- Si le score de creusage ≥ 80% : Pattern résolu
- Si le score de creusage < 80% : Action corrective renforcée

### 4.3 Pattern 3 — Biais Récurrent

**Détection :**
Le moteur détecte un biais récurrent sur certains types de candidats.

**Exemple :**
Le moteur détecte un biais d'affinité récurrent sur les candidats diplômés de certaines écoles.

**Action corrective :**
- Alerte au DRH responsable
- Révision de la grille d'évaluation
- Ajout de contre-mesures algorithmiques pour neutraliser le biais

**Validation :**
- Vérification sur les 10 prochains entretiens
- Si le biais n'est plus détecté : Pattern résolu
- Si le biais persiste : Action corrective renforcée

### 4.4 Pattern 4 — Questions Non Posées Récurrentes

**Détection :**
Le moteur détecte que certaines questions ne sont jamais posées en raison d'un oubli algorithmique.

**Exemple :**
La question sur la "Stratégie de l'entreprise" n'est jamais posée sur les postes DRH.

**Action corrective :**
- Correction de l'algorithme de gestion du temps
- Ajout de la question dans la liste des questions obligatoires
- Priorisation de la question dans l'algorithme

**Validation :**
- Vérification sur les 10 prochains entretiens
- Si la question est posée ≥ 90% : Pattern résolu
- Si la question est posée < 90% : Action corrective renforcée

### 4.5 Pattern 5 — Incohérences de Scoring Récurrentes

**Détection :**
Le moteur détecte des incohérences de scoring récurrentes entre dimensions.

**Exemple :**
Le score en "Soft skills" est systématiquement élevé alors que les preuves comportementales sont insuffisantes.

**Action corrective :**
- Recalibration du scoring en "Soft skills"
- Renforcement de l'exigence de preuves comportementales
- Ajout de vérifications de cohérence dans l'algorithme de scoring

**Validation :**
- Vérification sur les 10 prochains entretiens
- Si les incohérences sont résolues : Pattern résolu
- Si les incohérences persistent : Action corrective renforcée

---

## 5. Rapport Mensuel d'Auto-Amélioration

### 5.1 Structure du Rapport

**Contenu :**
- Nombre d'entretiens conduits ce mois
- Qualité moyenne des auto-évaluations
- Erreurs récurrentes identifiées
- Corrections apportées
- Progression vs mois précédent

### 5.2 Format du Rapport

```
RAPPORT MENSUEL D'AUTO-AMÉLIORATION
Période : [Mois Année]

SUR [X] ENTRETIENS CONDUITS CE MOIS :
Qualité moyenne : [Y]/10

ERREURS RÉCURRENTES IDENTIFIÉES :
→ [Erreur 1] : [Description]
  Fréquence : [X%]
  Action : [Description]
→ [Erreur 2] : [Description]
  Fréquence : [X%]
  Action : [Description]

CORRECTIONS APPORTÉES :
→ [Correction 1] : [Description]
  Résultat : [Succès / En cours / Échec]
→ [Correction 2] : [Description]
  Résultat : [Succès / En cours / Échec]

PROGRESSION VS MOIS PRÉCÉDENT :
Qualité moyenne : [+/- X points]
Erreurs récurrentes : [+/- X]
Corrections réussies : [X%]
```

### 5.3 Indicateurs de Suivi

**Métriques de progression :**
- Qualité moyenne des auto-évaluations
- Nombre d'erreurs récurrentes identifiées
- Taux de corrections réussies
- Progression vs mois précédent

---

## 6. Structure de Données (TypeScript)

```typescript
interface RecurringErrorPattern {
  patternId: string;
  type: 'missingZone' | 'insufficientDrilling' | 'recurrentBias' | 'unaskedQuestions' | 'scoringInconsistency';
  
  description: string;
  frequency: number;
  positionType?: string;
  dimension?: string;
  
  correctiveAction: string;
  status: 'detected' | 'correcting' | 'resolved';
  
  validation: {
    checkCount: number;
    successCount: number;
    lastCheckedAt: Date;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ContinuousImprovement {
  improvementId: string;
  
  period: string;
  interviewsConducted: number;
  averageQuality: number;
  
  recurringErrors: RecurringErrorPattern[];
  
  corrections: {
    action: string;
    result: 'success' | 'inProgress' | 'failure';
  }[];
  
  progression: {
    previousMonth: {
      averageQuality: number;
      recurringErrorsCount: number;
    };
    currentMonth: {
      averageQuality: number;
      recurringErrorsCount: number;
    };
    delta: {
      averageQuality: number;
      recurringErrorsCount: number;
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ImprovementProtocol {
  protocolId: string;
  
  accumulation: {
    storage: string;
    analysisFrequency: 'weekly' | 'monthly' | 'quarterly';
  };
  
  patternDetection: {
    types: string[];
    detectionThreshold: number;
  };
  
  correctiveActions: {
    automatic: string[];
    manual: string[];
  };
  
  validation: {
    checkCount: number;
    successThreshold: number;
  };
  
  monthlyReport: {
    structure: string;
    indicators: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE recurring_error_pattern (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  
  description TEXT NOT NULL,
  frequency INT NOT NULL,
  position_type VARCHAR(50),
  dimension VARCHAR(50),
  
  corrective_action TEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  
  validation JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_recurring_error_pattern_type ON recurring_error_pattern(type);
CREATE INDEX idx_recurring_error_pattern_status ON recurring_error_pattern(status);

CREATE TABLE continuous_improvement (
  id VARCHAR(36) PRIMARY KEY,
  
  period VARCHAR(7) NOT NULL,
  interviews_conducted INT NOT NULL,
  average_quality DECIMAL(3,1) NOT NULL,
  
  recurring_errors JSON NOT NULL,
  corrections JSON NOT NULL,
  progression JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_continuous_improvement_period ON continuous_improvement(period);

CREATE TABLE improvement_protocol (
  id VARCHAR(36) PRIMARY KEY,
  
  accumulation JSON NOT NULL,
  pattern_detection JSON NOT NULL,
  corrective_actions JSON NOT NULL,
  validation JSON NOT NULL,
  monthly_report JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 8. API Endpoints

```typescript
// POST /api/continuous-improvement/analyze
async function analyzeContinuousImprovement(period: string): Promise<ContinuousImprovement> {
  return await analyzeContinuousImprovement(period);
}

// GET /api/continuous-improvement/:period
async function getContinuousImprovement(period: string): Promise<ContinuousImprovement> {
  return await getContinuousImprovementByPeriod(period);
}

// GET /api/continuous-improvement/recurring-patterns
async function getRecurringPatterns(): Promise<RecurringErrorPattern[]> {
  return await getRecurringPatterns();
}

// POST /api/continuous-improvement/detect-pattern
async function detectPattern(type: string, threshold: number): Promise<RecurringErrorPattern> {
  return await detectPattern(type, threshold);
}

// POST /api/continuous-improvement/apply-correction
async function applyCorrection(patternId: string): Promise<any> {
  return await applyCorrection(patternId);
}

// POST /api/continuous-improvement/validate-correction
async function validateCorrection(patternId: string): Promise<any> {
  return await validateCorrection(patternId);
}

// GET /api/continuous-improvement/monthly-report/:period
async function getMonthlyReport(period: string): Promise<any> {
  return await getMonthlyReport(period);
}

// GET /api/improvement-protocol
async function getImprovementProtocol(): Promise<ImprovementProtocol> {
  return await getImprovementProtocol();
}

// PUT /api/improvement-protocol
async function updateImprovementProtocol(protocol: ImprovementProtocol): Promise<ImprovementProtocol> {
  return await updateImprovementProtocol(protocol);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques d'Amélioration

| Métrique | Description | Cible |
|----------|-------------|-------|
| Qualité moyenne auto-évaluation | Moyenne des scores globaux | ≥ 8/10 |
- Taux de patterns résolus | Patterns résolus / total | ≥ 80% |
- Progression mensuelle | Delta qualité moyenne | ≥ +0.5 points |

### 9.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de corrections réussies | Corrections réussies / total | ≥ 85% |
- Taux de patterns récurrents | Patterns récurrents / total | ≤ 15% |

---

## 10. Conclusion

Le protocole d'amélioration continue par l'auto-évaluation structure le processus par lequel le moteur analyse ses auto-évaluations accumulées pour s'améliorer continuellement. Processus : Accumulation des auto-évaluations (stockage, analyse hebdomadaire/mensuelle/trimestrielle), Identification des patterns d'erreurs récurrents (zones manquantes systématiques, creusage insuffisant récurrent, biais récurrents, questions non posées récurrentes, incohérences de scoring récurrentes), Actions correctives automatiques (mise à jour du plan d'entretien, ajout de questions spécifiques, recalibration du scoring, renforcement du creusage, alerte au DRH). Rapport mensuel d'auto-amélioration (nombre d'entretiens, qualité moyenne, erreurs récurrentes, corrections apportées, progression vs mois précédent). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Accumulation des auto-évaluations
- Analyse périodique (hebdomadaire, mensuelle, trimestrielle)
- 5 types de patterns d'erreurs récurrents
- Actions correctives automatiques
- Validation des corrections
- Rapport mensuel d'auto-amélioration
- Indicateurs de progression
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'amélioration et de qualité
