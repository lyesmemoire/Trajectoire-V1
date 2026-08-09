# DOC-M05-01 : Protocole de Suivi à J+15, 30, 90, 180, 365, 730

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de suivi structuré dans le temps pour le MVP-META-05 Feedback Intelligence Engine. Ce document structure le suivi des candidats à 6 étapes clés (J+15, 30, 90, 180, 365, 730) pour valider les prédictions du moteur et alimenter l'apprentissage.

---

## 2. Principe Fondateur

Un recrutement ne se juge pas le jour de la décision. Le moteur doit suivre les candidats dans le temps pour valider ses prédictions et apprendre des écarts entre prédiction et réalité.

---

## 3. Les 6 Étapes de Suivi

### 3.1 SUIVI J+15 (15 jours après décision)

**Objectif :**
Suivre la signature de l'offre et enrichir la compréhension des facteurs d'acceptation/refus.

**Candidat retenu :**
- A-t-il signé ?
- Si non : raison ?
  - Offre refusée → pourquoi ?
  - Meilleure offre → où ?
  - Retenu par employeur actuel → comment ?

**Apprentissage :**
- Qu'est-ce qui fait accepter une offre ?
- Qu'est-ce qui fait la refuser ?
- Enrichissement de MVP-019 (Market Intelligence)

**Candidat refusé :**
- A-t-il été recruté ailleurs ?
- Si oui : par qui ? à quel niveau ?
- Suivi pour détection des faux négatifs

---

### 3.2 SUIVI J+30 (30 jours après décision)

**Objectif :**
Capturer les premières impressions du manager et comparer avec les prédictions du moteur.

**Le candidat a démarré.**

**Premières impressions du manager :**
- Conforme aux attentes : Oui/Non
- Premiers signaux positifs : [liste]
- Premiers signaux d'alerte : [liste]

**Comparaison avec les prédictions du moteur :**
- Prédiction du moteur sur l'intégration : [rappel]
- Réalité observée : [données]
- Écart : [analyse]

---

### 3.3 SUIVI J+90 (90 jours après décision)

**Objectif :**
Bilan structuré à 90 jours pour évaluer l'intégration et comparer avec les prédictions.

**Bilan à 90 jours structuré :**
- Performance vs objectifs fixés :
  - Au-dessus / Conforme / En dessous
- Intégration culturelle :
  - Réussie / En cours / Difficile
- Relation manager :
  - Positive / Standard / Tendue
- Signaux d'alerte détectés :
  - [liste si existants]

**Comparaison avec prédictions moteur :**
- Score de maturité prédit : X/5
- Maturité observée réelle : [évaluation]
- Score culture fit prédit : X/5
- Culture fit observé réel : [évaluation]

---

### 3.4 SUIVI J+180 (180 jours après décision)

**Objectif :**
Bilan à 6 mois pour évaluer la performance globale et identifier les surprises positives/négatives.

**Bilan à 6 mois :**
- Performance globale :
  - Très bonne / Bonne / Standard / Insuffisante / Echec
- Compétences révélées non prédites :
  - [liste des surprises positives]
- Lacunes révélées non détectées :
  - [liste des surprises négatives]
- Satisfaction du manager : [score]
- Satisfaction du candidat : [score]
- Risque de départ dans les 6 mois : [%]

---

### 3.5 SUIVI J+365 (365 jours après décision)

**Objectif :**
Bilan à 12 mois pour évaluer le succès du recrutement et la précision du moteur.

**Bilan à 12 mois :**
- Le recrutement est-il un succès ?
- Critères de succès :
  - Encore en poste : Oui/Non
  - Performance conforme : Oui/Non
  - Intégration réussie : Oui/Non
  - Manager satisfait : Oui/Non
  - Candidat satisfait : Oui/Non

- Score de succès global : X/5

**Comparaison avec la prédiction moteur :**
- Moteur avait prédit : [rappel]
- Réalité à 12 mois : [données]
- Précision du moteur : [%]

- Erreurs identifiées :
  - Ce que le moteur a bien vu
  - Ce que le moteur a mal vu
  - Ce que le moteur a manqué

---

### 3.6 SUIVI J+730 (730 jours après décision)

**Objectif :**
Bilan à 24 mois pour valider le potentiel à long terme.

**Bilan à 24 mois :**
- Évolution du candidat :
  - Promotion obtenue : Oui/Non
  - Potentiel confirmé : Oui/Non
  - Départ : Oui/Non → Raison

- Validation du score de potentiel :
  - Potentiel prédit : X/5
  - Potentiel confirmé : [évaluation]
  - Écart : [analyse]

---

## 4. Structure de Données (TypeScript)

```typescript
interface FollowUpJ15 {
  followUpId: string;
  candidateId: string;
  recruitmentId: string;
  
  decisionDate: Date;
  followUpDate: Date;
  
  candidateStatus: 'hired' | 'rejected';
  
  hiredData?: {
    signed: boolean;
    reasonIfNotSigned?: 'offerRefused' | 'betterOffer' | 'retainedByCurrentEmployer' | 'other';
    refusalReason?: string;
    betterOfferCompany?: string;
    betterOfferLevel?: string;
    retentionMethod?: string;
  };
  
  rejectedData?: {
    hiredElsewhere: boolean;
    company?: string;
    level?: string;
    falseNegativeDetection: boolean;
  };
  
  learningInsights: {
    whatMakesOfferAccepted: string[];
    whatMakesOfferRefused: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface FollowUpJ30 {
  followUpId: string;
  candidateId: string;
  recruitmentId: string;
  
  followUpDate: Date;
  
  started: boolean;
  
  managerImpressions: {
    meetsExpectations: boolean;
    positiveSignals: string[];
    alertSignals: string[];
  };
  
  engineComparison: {
    integrationPrediction: string;
    observedReality: string;
    gap: string;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface FollowUpJ90 {
  followUpId: string;
  candidateId: string;
  recruitmentId: string;
  
  followUpDate: Date;
  
  performanceVsObjectives: 'above' | 'conform' | 'below';
  culturalIntegration: 'successful' | 'inProgress' | 'difficult';
  managerRelationship: 'positive' | 'standard' | 'tense';
  alertSignals: string[];
  
  engineComparison: {
    maturityPredicted: number; // 0-5
    maturityObserved: number; // 0-5
    cultureFitPredicted: number; // 0-5
    cultureFitObserved: number; // 0-5
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface FollowUpJ180 {
  followUpId: string;
  candidateId: string;
  recruitmentId: string;
  
  followUpDate: Date;
  
  overallPerformance: 'excellent' | 'good' | 'standard' | 'insufficient' | 'failure';
  unexpectedCompetencies: string[];
  unexpectedGaps: string[];
  managerSatisfaction: number; // 0-5
  candidateSatisfaction: number; // 0-5
  departureRisk: number; // en pourcentage
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface FollowUpJ365 {
  followUpId: string;
  candidateId: string;
  recruitmentId: string;
  
  followUpDate: Date;
  
  successCriteria: {
    stillInPosition: boolean;
    performanceConform: boolean;
    integrationSuccessful: boolean;
    managerSatisfied: boolean;
    candidateSatisfied: boolean;
  };
  
  globalSuccessScore: number; // 0-5
  
  engineComparison: {
    prediction: string;
    reality: string;
    accuracy: number; // en pourcentage
  };
  
  errorsIdentified: {
    wellSeen: string[];
    poorlySeen: string[];
    missed: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface FollowUpJ730 {
  followUpId: string;
  candidateId: string;
  recruitmentId: string;
  
  followUpDate: Date;
  
  evolution: {
    promotionObtained: boolean;
    potentialConfirmed: boolean;
    departure: boolean;
    departureReason?: string;
  };
  
  potentialValidation: {
    potentialPredicted: number; // 0-5
    potentialConfirmed: number; // 0-5
    gap: string;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE follow_up_j15 (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  decision_date TIMESTAMP NOT NULL,
  follow_up_date TIMESTAMP NOT NULL,
  
  candidate_status VARCHAR(20) NOT NULL,
  hired_data JSON,
  rejected_data JSON,
  learning_insights JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_follow_up_j15_candidate ON follow_up_j15(candidate_id);
CREATE INDEX idx_follow_up_j15_recruitment ON follow_up_j15(recruitment_id);

CREATE TABLE follow_up_j30 (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  follow_up_date TIMESTAMP NOT NULL,
  
  started BOOLEAN NOT NULL,
  manager_impressions JSON NOT NULL,
  engine_comparison JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_follow_up_j30_candidate ON follow_up_j30(candidate_id);
CREATE INDEX idx_follow_up_j30_recruitment ON follow_up_j30(recruitment_id);

CREATE TABLE follow_up_j90 (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  follow_up_date TIMESTAMP NOT NULL,
  
  performance_vs_objectives VARCHAR(20) NOT NULL,
  cultural_integration VARCHAR(20) NOT NULL,
  manager_relationship VARCHAR(20) NOT NULL,
  alert_signals JSON NOT NULL,
  engine_comparison JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_follow_up_j90_candidate ON follow_up_j90(candidate_id);
CREATE INDEX idx_follow_up_j90_recruitment ON follow_up_j90(recruitment_id);

CREATE TABLE follow_up_j180 (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  follow_up_date TIMESTAMP NOT NULL,
  
  overall_performance VARCHAR(20) NOT NULL,
  unexpected_competencies JSON NOT NULL,
  unexpected_gaps JSON NOT NULL,
  manager_satisfaction INT NOT NULL,
  candidate_satisfaction INT NOT NULL,
  departure_risk INT NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_follow_up_j180_candidate ON follow_up_j180(candidate_id);
CREATE INDEX idx_follow_up_j180_recruitment ON follow_up_j180(recruitment_id);

CREATE TABLE follow_up_j365 (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  follow_up_date TIMESTAMP NOT NULL,
  
  success_criteria JSON NOT NULL,
  global_success_score INT NOT NULL,
  engine_comparison JSON NOT NULL,
  errors_identified JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_follow_up_j365_candidate ON follow_up_j365(candidate_id);
CREATE INDEX idx_follow_up_j365_recruitment ON follow_up_j365(recruitment_id);

CREATE TABLE follow_up_j730 (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  follow_up_date TIMESTAMP NOT NULL,
  
  evolution JSON NOT NULL,
  potential_validation JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_follow_up_j730_candidate ON follow_up_j730(candidate_id);
CREATE INDEX idx_follow_up_j730_recruitment ON follow_up_j730(recruitment_id);
```

---

## 6. API Endpoints

```typescript
// POST /api/follow-up/j15/create
async function createFollowUpJ15(candidateId: string, recruitmentId: string, data: FollowUpJ15): Promise<FollowUpJ15> {
  return await createFollowUpJ15(candidateId, recruitmentId, data);
}

// GET /api/follow-up/j15/:candidateId/:recruitmentId
async function getFollowUpJ15(candidateId: string, recruitmentId: string): Promise<FollowUpJ15> {
  return await getFollowUpJ15(candidateId, recruitmentId);
}

// POST /api/follow-up/j30/create
async function createFollowUpJ30(candidateId: string, recruitmentId: string, data: FollowUpJ30): Promise<FollowUpJ30> {
  return await createFollowUpJ30(candidateId, recruitmentId, data);
}

// GET /api/follow-up/j30/:candidateId/:recruitmentId
async function getFollowUpJ30(candidateId: string, recruitmentId: string): Promise<FollowUpJ30> {
  return await getFollowUpJ30(candidateId, recruitmentId);
}

// POST /api/follow-up/j90/create
async function createFollowUpJ90(candidateId: string, recruitmentId: string, data: FollowUpJ90): Promise<FollowUpJ90> {
  return await createFollowUpJ90(candidateId, recruitmentId, data);
}

// GET /api/follow-up/j90/:candidateId/:recruitmentId
async function getFollowUpJ90(candidateId: string, recruitmentId: string): Promise<FollowUpJ90> {
  return await getFollowUpJ90(candidateId, recruitmentId);
}

// POST /api/follow-up/j180/create
async function createFollowUpJ180(candidateId: string, recruitmentId: string, data: FollowUpJ180): Promise<FollowUpJ180> {
  return await createFollowUpJ180(candidateId, recruitmentId, data);
}

// GET /api/follow-up/j180/:candidateId/:recruitmentId
async function getFollowUpJ180(candidateId: string, recruitmentId: string): Promise<FollowUpJ180> {
  return await getFollowUpJ180(candidateId, recruitmentId);
}

// POST /api/follow-up/j365/create
async function createFollowUpJ365(candidateId: string, recruitmentId: string, data: FollowUpJ365): Promise<FollowUpJ365> {
  return await createFollowUpJ365(candidateId, recruitmentId, data);
}

// GET /api/follow-up/j365/:candidateId/:recruitmentId
async function getFollowUpJ365(candidateId: string, recruitmentId: string): Promise<FollowUpJ365> {
  return await getFollowUpJ365(candidateId, recruitmentId);
}

// POST /api/follow-up/j730/create
async function createFollowUpJ730(candidateId: string, recruitmentId: string, data: FollowUpJ730): Promise<FollowUpJ730> {
  return await createFollowUpJ730(candidateId, recruitmentId, data);
}

// GET /api/follow-up/j730/:candidateId/:recruitmentId
async function getFollowUpJ730(candidateId: string, recruitmentId: string): Promise<FollowUpJ730> {
  return await getFollowUpJ730(candidateId, recruitmentId);
}

// GET /api/follow-up/candidate/:candidateId
async function getAllFollowUpsByCandidate(candidateId: string): Promise<any> {
  return await getAllFollowUpsByCandidate(candidateId);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétude J+15 | Suivis J+15 complets / décisions | 100% |
- Taux de complétude J+30 | Suivis J+30 complets / recrutements | 100% |
- Taux de complétude J+90 | Suivis J+90 complets / recrutements | ≥ 95% |
- Taux de complétude J+180 | Suivis J+180 complets / recrutements | ≥ 90% |
- Taux de complétude J+365 | Suivis J+365 complets / recrutements | ≥ 85% |
- Taux de complétude J+730 | Suivis J+730 complets / recrutements | ≥ 80% |

### 7.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de consultation | Suivis consultés / créés | ≥ 80% |
- Taux d'impact sur apprentissage | Modifications basées sur suivi / totales | ≥ 50% |

---

## 8. Conclusion

Le protocole de suivi structuré dans le temps structure le suivi des candidats à 6 étapes clés. SUIVI J+15 : signature de l'offre et apprentissage des facteurs d'acceptation/refus. SUIVI J+30 : premières impressions du manager et comparaison avec prédictions. SUIVI J+90 : bilan structuré à 90 jours (performance, intégration culturelle, relation manager). SUIVI J+180 : bilan à 6 mois (performance globale, surprises positives/négatives, satisfaction). SUIVI J+365 : bilan à 12 mois (succès du recrutement, précision du moteur, erreurs identifiées). SUIVI J+730 : bilan à 24 mois (évolution, validation du potentiel). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 6 étapes de suivi
- J+15 : signature et apprentissage
- J+30 : premières impressions
- J+90 : bilan 90 jours
- J+180 : bilan 6 mois
- J+365 : bilan 12 mois
- J+730 : bilan 24 mois
- Comparaison avec prédictions moteur
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
