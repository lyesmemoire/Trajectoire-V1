# DOC-023-03 : Alertes Onboarding et Protocole

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'alertes onboarding et protocole pour MVP-023 Onboarding Intelligence Engine. Ce système surveille les signaux d'alerte pendant la période d'onboarding (absentéisme, feedbacks négatifs, isolement, non-atteinte des objectifs, questionnements) et déclenche un protocole d'alerte (alerte au DRH et au manager, analyse des causes possibles, plan d'action correctif suggéré, suivi renforcé planifié).

---

## 2. Principe Fondateur

Le moteur surveille les signaux d'alerte pendant la période d'onboarding pour détecter précocement les problèmes d'intégration. Si un signal est détecté, le protocole d'alerte est déclenché : alerte au DRH et au manager, analyse des causes possibles, plan d'action correctif suggéré, suivi renforcé planifié. L'objectif est de réduire les échecs de recrutement dus à un mauvais onboarding (50% des échecs) en intervenant précocement.

---

## 3. Signaux d'Alerte Précoce

### 3.1 Absentéisme les Premières Semaines

**Description :**
Taux d'absentéisme anormalement élevé pendant les premières semaines.

**Indicateurs :**
- Taux d'absentéisme > 10% sur les 4 premières semaines
- Absences répétées sans justification claire
- Retards fréquents

**Causes possibles :**
- Problèmes personnels
- Manque de motivation
- Problèmes de santé
- Difficultés d'intégration

**Gravité :**
- Élevée si absentéisme > 20%
- Moyenne si absentéisme entre 10% et 20%
- Faible si absentéisme < 10%

---

### 3.2 Feedbacks Négatifs du Manager

**Description :**
Feedbacks négatifs répétés du manager sur la performance ou l'intégration.

**Indicateurs :**
- Feedbacks négatifs sur la performance
- Feedbacks négatifs sur l'intégration sociale
- Feedbacks négatifs sur l'attitude

**Causes possibles :**
- Inadéquation avec le poste
- Problèmes de soft skills
- Manque de motivation
- Problèmes de communication avec le manager

**Gravité :**
- Critique si feedbacks négatifs sur 3+ dimensions
- Élevée si feedbacks négatifs sur 2 dimensions
- Moyenne si feedbacks négatifs sur 1 dimension

---

### 3.3 Isolement dans l'Équipe

**Description :**
Signaux d'isolement social dans l'équipe.

**Indicateurs :**
- Peu d'interactions avec l'équipe
- Absence de participation aux activités d'équipe
- Feedbacks de l'équipe sur le manque d'intégration

**Causes possibles :**
- Difficultés relationnelles
- Timidité ou introversion
- Inadéquation culturelle
- Manque d'opportunités d'intégration

**Gravité :**
- Élevée si isolement signalé par plusieurs membres de l'équipe
- Moyenne si isolement signalé par un membre de l'équipe
- Faible si isolement non signalé mais détecté par le système

---

### 3.4 Non-atteinte des Premiers Objectifs

**Description :**
Non-atteinte des premiers objectifs fixés lors du premier mois.

**Indicateurs :**
- Objectifs du premier mois non atteints
- Livrables non livrés
- Performance en dessous des attentes

**Causes possibles :**
- Manque de compétences
- Manque de ressources
- Objectifs irréalistes
- Problèmes de motivation

**Gravité :**
- Critique si aucun objectif atteint
- Élevée si moins de 50% des objectifs atteints
- Moyenne si 50-75% des objectifs atteints

---

### 3.5 Questionnements sur le Poste ou l'Entreprise

**Description :**
Questionnements répétés sur le poste ou l'entreprise.

**Indicateurs :**
- Questions répétées sur les responsabilités
- Questions répétées sur la culture de l'entreprise
- Expressions de doute ou de regret

**Causes possibles :**
- Attentes non satisfaites
- Mauvaise compréhension du poste
- Inadéquation culturelle
- Problèmes de motivation

**Gravité :**
- Élevée si questionnements exprimés à plusieurs reprises
- Moyenne si questionnements exprimés une fois
- Faible si questionnements implicites

---

## 4. Protocole d'Alerte

### 4.1 Déclenchement de l'Alerte

**Condition :**
Un signal d'alerte est détecté par le système.

**Seuils de déclenchement :**
- Absentéisme > 10% sur les 4 premières semaines
- Feedbacks négatifs sur 2+ dimensions
- Isolement signalé par plusieurs membres de l'équipe
- Moins de 75% des objectifs atteints
- Questionnements exprimés à plusieurs reprises

---

### 4.2 Alerte au DRH et au Manager

**Action :**
Envoi d'une alerte au DRH et au manager.

**Contenu de l'alerte :**
- Signal d'alerte détecté
- Gravité du signal
- Détails du signal
- Candidat concerné
- Date de détection

**Canal :**
- Email
- Notification dans l'interface
- SMS (optionnel pour alertes critiques)

---

### 4.3 Analyse des Causes Possibles

**Action :**
Analyse des causes possibles du signal d'alerte.

**Processus d'analyse :**
1. Collecte des données disponibles (feedbacks, performance, absentéisme, etc.)
2. Identification des causes possibles basées sur le type de signal
3. Évaluation de la probabilité de chaque cause
4. Hiérarchisation des causes par probabilité

**Causes possibles par type de signal :**
- Absentéisme : problèmes personnels, manque de motivation, problèmes de santé, difficultés d'intégration
- Feedbacks négatifs : inadéquation avec le poste, problèmes de soft skills, manque de motivation, problèmes de communication
- Isolement : difficultés relationnelles, timidité, inadéquation culturelle, manque d'opportunités
- Non-atteinte des objectifs : manque de compétences, manque de ressources, objectifs irréalistes, manque de motivation
- Questionnements : attentes non satisfaites, mauvaise compréhension, inadéquation culturelle, manque de motivation

---

### 4.4 Plan d'Action Correctif Suggéré

**Action :**
Génération d'un plan d'action correctif suggéré basé sur la cause la plus probable.

**Types d'actions :**
- Actions de formation (si manque de compétences)
- Actions de coaching (si problèmes de soft skills)
- Actions de réassignation (si inadéquation avec le poste)
- Actions de soutien (si problèmes personnels)
- Actions de clarification (si mauvaise compréhension)

**Exemples d'actions :**
- Formation technique renforcée
- Coaching en soft skills
- Réassignation de certaines responsabilités
- Soutien par un mentor
- Clarification des attentes et objectifs

---

### 4.5 Suivi Renforcé Planifié

**Action :**
Planification d'un suivi renforcé pour le collaborateur.

**Fréquence du suivi :**
- Hebdomadaire pour les alertes critiques
- Bimensuelle pour les alertes élevées
- Mensuelle pour les alertes moyennes

**Contenu du suivi :**
- Revue des progrès
- Évaluation de l'efficacité des actions correctives
- Ajustement du plan si nécessaire
- Feedback du collaborateur

---

## 5. Algorithme de Détection et d'Alerte

### 5.1 Processus Global

```typescript
async function monitorOnboardingAlerts(onboardingId: string): Promise<OnboardingAlert[]> {
  // 1. Récupération des données d'onboarding
  const onboarding = await getOnboarding(onboardingId);
  
  // 2. Surveillance des signaux d'alerte
  const signals = await monitorAlertSignals(onboarding);
  
  // 3. Pour chaque signal détecté
  const alerts: OnboardingAlert[] = [];
  for (const signal of signals) {
    // 4. Analyse des causes possibles
    const causeAnalysis = await analyzePossibleCauses(signal);
    
    // 5. Génération du plan d'action correctif
    const correctiveAction = await generateCorrectiveAction(signal, causeAnalysis);
    
    // 6. Planification du suivi renforcé
    const enhancedFollowUp = await planEnhancedFollowUp(signal);
    
    // 7. Construction de l'alerte
    const alert: OnboardingAlert = {
      alertId: generateAlertId(),
      onboardingId,
      candidateId: onboarding.candidateId,
      detectedAt: new Date(),
      
      signal: signal.type,
      severity: signal.severity,
      
      details: signal.details,
      
      causeAnalysis,
      correctiveAction,
      enhancedFollowUp,
      
      notifiedTo: [onboarding.managerId, onboarding.drhId]
    };
    
    // 8. Sauvegarde de l'alerte
    await saveOnboardingAlert(alert);
    
    // 9. Envoi de l'alerte
    await sendAlert(alert);
    
    alerts.push(alert);
  }
  
  return alerts;
}
```

---

### 5.2 Surveillance des Signaux d'Alerte

```typescript
async function monitorAlertSignals(onboarding: Onboarding): Promise<AlertSignal[]> {
  const signals: AlertSignal[] = [];
  
  // Signal 1 : Absentéisme
  const absenteeismSignal = await detectAbsenteeism(onboarding);
  if (absenteeismSignal) {
    signals.push(absenteeismSignal);
  }
  
  // Signal 2 : Feedbacks négatifs
  const negativeFeedbackSignal = await detectNegativeFeedback(onboarding);
  if (negativeFeedbackSignal) {
    signals.push(negativeFeedbackSignal);
  }
  
  // Signal 3 : Isolement
  const isolationSignal = await detectIsolation(onboarding);
  if (isolationSignal) {
    signals.push(isolationSignal);
  }
  
  // Signal 4 : Non-atteinte des objectifs
  const objectiveMissSignal = await detectObjectiveMiss(onboarding);
  if (objectiveMissSignal) {
    signals.push(objectiveMissSignal);
  }
  
  // Signal 5 : Questionnements
  const questioningSignal = await detectQuestioning(onboarding);
  if (questioningSignal) {
    signals.push(questioningSignal);
  }
  
  return signals;
}

async function detectAbsenteeism(onboarding: Onboarding): Promise<AlertSignal | null> {
  const attendanceData = await getAttendanceData(onboarding.candidateId, onboarding.startDate);
  
  const totalDays = attendanceData.length;
  const absentDays = attendanceData.filter(d => d.status === 'absent').length;
  const absenteeismRate = absentDays / totalDays;
  
  if (absenteeismRate > 0.10) {
    let severity: 'low' | 'medium' | 'high' | 'critical';
    if (absenteeismRate > 0.20) {
      severity = 'critical';
    } else if (absenteeismRate > 0.15) {
      severity = 'high';
    } else {
      severity = 'medium';
    }
    
    return {
      type: 'absenteeism',
      severity,
      details: `Taux d'absentéisme : ${(absenteeismRate * 100).toFixed(1)}% sur les 4 premières semaines`
    };
  }
  
  return null;
}
```

---

### 5.3 Analyse des Causes Possibles

```typescript
async function analyzePossibleCauses(signal: AlertSignal): Promise<{
  possibleCauses: string[];
  likelyCause: string;
  confidence: number;
}> {
  const possibleCauses: string[] = [];
  
  switch (signal.type) {
    case 'absenteeism':
      possibleCauses.push('Problèmes personnels', 'Manque de motivation', 'Problèmes de santé', 'Difficultés d\'intégration');
      break;
    case 'negative_feedback':
      possibleCauses.push('Inadéquation avec le poste', 'Problèmes de soft skills', 'Manque de motivation', 'Problèmes de communication');
      break;
    case 'isolation':
      possibleCauses.push('Difficultés relationnelles', 'Timidité', 'Inadéquation culturelle', 'Manque d\'opportunités');
      break;
    case 'objective_miss':
      possibleCauses.push('Manque de compétences', 'Manque de ressources', 'Objectifs irréalistes', 'Manque de motivation');
      break;
    case 'questioning':
      possibleCauses.push('Attentes non satisfaites', 'Mauvaise compréhension', 'Inadéquation culturelle', 'Manque de motivation');
      break;
  }
  
  // Évaluation de la probabilité de chaque cause
  const causeProbabilities = await evaluateCauseProbabilities(signal, possibleCauses);
  
  // Identification de la cause la plus probable
  const likelyCause = causeProbabilities[0].cause;
  const confidence = causeProbabilities[0].probability;
  
  return {
    possibleCauses,
    likelyCause,
    confidence
  };
}
```

---

### 5.4 Génération du Plan d'Action Correctif

```typescript
async function generateCorrectiveAction(signal: AlertSignal, causeAnalysis: any): Promise<{
  action: string;
  timeline: string;
  responsible: string;
}> {
  const correctiveActions: Record<string, { action: string; timeline: string; responsible: string }> = {
    'Problèmes personnels': {
      action: 'Proposer un soutien par le service social et un aménagement temporaire du temps de travail',
      timeline: 'Immédiat',
      responsible: 'DRH'
    },
    'Manque de motivation': {
      action: 'Organiser un entretien de motivation avec le manager et proposer des ajustements du poste si nécessaire',
      timeline: '1 semaine',
      responsible: 'Manager'
    },
    'Problèmes de santé': {
      action: 'Proposer un aménagement du poste et un suivi médical si nécessaire',
      timeline: 'Immédiat',
      responsible: 'DRH'
    },
    'Difficultés d\'intégration': {
      action: 'Renforcer l\'accompagnement par un mentor et augmenter les interactions avec l\'équipe',
      timeline: '2 semaines',
      responsible: 'Manager'
    },
    'Inadéquation avec le poste': {
      action: 'Évaluer la possibilité de réassignation de certaines responsabilités ou de changement de poste',
      timeline: '1 mois',
      responsible: 'Manager et DRH'
    },
    'Problèmes de soft skills': {
      action: 'Proposer un coaching en soft skills ciblé sur les axes de développement',
      timeline: '3 mois',
      responsible: 'DRH'
    },
    'Problèmes de communication': {
      action: 'Organiser des sessions de feedback structuré avec le manager pour améliorer la communication',
      timeline: '1 mois',
      responsible: 'Manager'
    },
    'Difficultés relationnelles': {
      action: 'Proposer un coaching relationnel et organiser des activités d\'équipe',
      timeline: '2 mois',
      responsible: 'DRH'
    },
    'Timidité': {
      action: 'Proposer un mentor pour faciliter l'intégration sociale',
      timeline: '1 mois',
      responsible: 'Manager'
    },
    'Inadéquation culturelle': {
      action: 'Clarifier les valeurs et la culture de l\'entreprise et évaluer l\'adéquation',
      timeline: '2 semaines',
      responsible: 'Manager et DRH'
    },
    'Manque d\'opportunités': {
      action: 'Créer des opportunités d'interaction et de collaboration avec l'équipe',
      timeline: '1 mois',
      responsible: 'Manager'
    },
    'Manque de compétences': {
      action: 'Proposer une formation technique renforcée',
      timeline: '2 mois',
      responsible: 'Manager et DRH'
    },
    'Manque de ressources': {
      action: 'Évaluer et fournir les ressources nécessaires',
      timeline: '2 semaines',
      responsible: 'Manager'
    },
    'Objectifs irréalistes': {
      action: 'Réviser les objectifs pour les rendre plus réalistes',
      timeline: '1 semaine',
      responsible: 'Manager'
    },
    'Attentes non satisfaites': {
      action: 'Clarifier les attentes et évaluer la possibilité de les satisfaire',
      timeline: '1 semaine',
      responsible: 'Manager'
    },
    'Mauvaise compréhension': {
      action: 'Clarifier les responsabilités et les attentes du poste',
      timeline: '1 semaine',
      responsible: 'Manager'
    }
  };
  
  return correctiveActions[causeAnalysis.likelyCause] || {
    action: 'Organiser un entretien avec le collaborateur pour identifier les causes et proposer des solutions',
    timeline: '1 semaine',
    responsible: 'Manager'
  };
}
```

---

### 5.5 Planification du Suivi Renforcé

```typescript
async function planEnhancedFollowUp(signal: AlertSignal): Promise<{
  frequency: string;
  focus: string[];
  responsible: string;
}> {
  let frequency: string;
  let focus: string[];
  
  switch (signal.severity) {
    case 'critical':
      frequency = 'Hebdomadaire';
      focus = ['Performance', 'Intégration', 'Motivation', 'Bien-être'];
      break;
    case 'high':
      frequency = 'Bimensuelle';
      focus = ['Performance', 'Intégration', 'Motivation'];
      break;
    case 'medium':
      frequency = 'Mensuelle';
      focus = ['Performance', 'Intégration'];
      break;
    default:
      frequency = 'Mensuelle';
      focus = ['Performance'];
  }
  
  return {
    frequency,
    focus,
    responsible: 'Manager'
  };
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface OnboardingAlert {
  alertId: string;
  onboardingId: string;
  candidateId: string;
  detectedAt: Date;
  
  signal: 'absenteeism' | 'negative_feedback' | 'isolation' | 'objective_miss' | 'questioning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  details: string;
  
  causeAnalysis: {
    possibleCauses: string[];
    likelyCause: string;
    confidence: number;
  };
  
  correctiveAction: {
    action: string;
    timeline: string;
    responsible: string;
  };
  
  enhancedFollowUp: {
    frequency: string;
    focus: string[];
    responsible: string;
  };
  
  notifiedTo: string[];
}

interface AlertSignal {
  type: 'absenteeism' | 'negative_feedback' | 'isolation' | 'objective_miss' | 'questioning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

interface AttendanceData {
  date: Date;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

interface FeedbackData {
  date: Date;
  source: 'manager' | 'team' | 'self';
  dimension: string;
  rating: number;
  comments: string;
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE onboarding_alert (
  id VARCHAR(36) PRIMARY KEY,
  onboarding_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  detected_at TIMESTAMP NOT NULL,
  
  signal VARCHAR(50) NOT NULL CHECK (signal IN ('absenteeism', 'negative_feedback', 'isolation', 'objective_miss', 'questioning')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  details TEXT NOT NULL,
  
  cause_analysis JSON NOT NULL,
  corrective_action JSON NOT NULL,
  enhanced_follow_up JSON NOT NULL,
  
  notified_to JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (onboarding_id) REFERENCES onboarding(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE INDEX idx_onboarding_alert_onboarding ON onboarding_alert(onboarding_id);
CREATE INDEX idx_onboarding_alert_candidate ON onboarding_alert(candidate_id);
CREATE INDEX idx_onboarding_alert_date ON onboarding_alert(detected_at);
CREATE INDEX idx_onboarding_alert_severity ON onboarding_alert(severity);
```

---

## 8. API Endpoints

```typescript
// POST /api/onboarding/alerts/monitor
async function monitorOnboardingAlerts(onboardingId: string): Promise<OnboardingAlert[]> {
  return await monitorOnboardingAlerts(onboardingId);
}

// GET /api/onboarding/alerts/:alertId
async function getOnboardingAlert(alertId: string): Promise<OnboardingAlert> {
  return await getOnboardingAlertById(alertId);
}

// GET /api/onboarding/alerts/onboarding/:onboardingId
async function getOnboardingAlertsByOnboarding(onboardingId: string): Promise<OnboardingAlert[]> {
  return await getOnboardingAlertsByOnboardingId(onboardingId);
}

// GET /api/onboarding/alerts/candidate/:candidateId
async function getOnboardingAlertsByCandidate(candidateId: string): Promise<OnboardingAlert[]> {
  return await getOnboardingAlertsByCandidateId(candidateId);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection d'alertes | Alertes détectes / onboardings | ≥ 70% |
- Taux de faux positifs | Faux positifs / alertes | ≤ 20% |
- Taux de correction | Actions correctives appliquées / alertes | ≥ 80% |
- Satisfaction DRH | Satisfaction avec les alertes | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Réduction des départs précoces | Réduction des départs < 6 mois | ≥ 40% |
- Amélioration de l'intégration | Satisfaction des nouveaux collaborateurs | ≥ 4.5/5 |
- Amélioration de la performance à 6 mois | Performance vs prédictions (MVP-021) | ≥ 80% |

---

## 10. Conclusion

Le système d'alertes onboarding et protocole surveille les signaux d'alerte pendant la période d'onboarding (absentéisme, feedbacks négatifs, isolement, non-atteinte des objectifs, questionnements) et déclenche un protocole d'alerte (alerte au DRH et au manager, analyse des causes possibles, plan d'action correctif suggéré, suivi renforcé planifié). L'objectif est de réduire les échecs de recrutement dus à un mauvais onboarding (50% des échecs) en intervenant précocement. Le système est conforme au protocole anti-biais (RH-860) et s'intègre avec les modules existants.

**Points clés :**
- 5 signaux d'alerte surveillés (absentéisme, feedbacks négatifs, isolement, non-atteinte des objectifs, questionnements)
- Seuils de déclenchement définis pour chaque signal
- Gravité évaluée (faible, moyenne, élevée, critique)
- Alerte au DRH et au manager avec détails
- Analyse des causes possibles avec probabilité
- Plan d'action correctif suggéré personnalisé
- Suivi renforcé planifié selon la gravité
- Conformité au protocole anti-biais (RH-860)
- Intégration avec les modules existants
