# DOC-M04-01 : Modèle des 4 Dimensions du Timing

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle des 4 dimensions du timing pour le MVP-META-04 Timing Intelligence Engine. Ce document structure les 4 dimensions qui analysent si le timing est optimal pour recruter un candidat.

---

## 2. Principe Fondateur

Le bon candidat au mauvais moment = échec. Le moteur analyse 4 dimensions du timing (disponibilité du candidat, stade de carrière, maturité organisationnelle, marché du travail) pour déterminer si le timing est optimal.

---

## 3. Les 4 Dimensions du Timing

### 3.1 TIMING 1 — Disponibilité Réelle du Candidat

**Objectif :**
Analyser la disponibilité réelle du candidat et sa compatibilité avec l'urgence opérationnelle.

**Données collectées :**
- Préavis contractuel (en jours ou mois)
- Préavis négociable ? (Oui/Non)
- Engagements en cours (projets critiques à terminer)
- Situation personnelle (déménagement, congé prévu)
- Autres processus en cours (risque de contre-offre)

**Facteurs de risque :**
- Préavis long (> 3 mois)
- Projets critiques non terminés
- Autres processus en cours (risque de contre-offre)
- Situation personnelle complexe

---

### 3.2 TIMING 2 — Stade de Carrière du Candidat

**Objectif :**
Analyser si le poste arrive au bon moment dans la trajectoire de carrière du candidat.

**Analyse du stade de carrière :**

**Trop tôt dans la carrière :**
- Candidat pas encore prêt
- Risque d'échec et de départ rapide
- Signal : Score de maturité < 3/5

**Stade optimal :**
- Le poste représente la prochaine marche logique
- Ni trop petit ni trop grand
- Signal : Score de maturité 4-5/5 + Potentiel 3-4/5

**Trop tard dans la carrière :**
- Le poste est en dessous du niveau atteint
- Risque d'ennui et de départ rapide
- Signal : Poste = régression par rapport aux expériences passées

**Format de sortie :**
- Stade de carrière détecté : [analyse]
- Adéquation avec ce poste : [évaluation]
- Risque temporel : [faible/modéré/élevé]
- Recommandation : [action]

---

### 3.3 TIMING 3 — Maturité de l'Entreprise pour Accueillir ce Profil

**Objectif :**
Analyser si l'organisation est prête à accueillir ce niveau de profil.

**Questions analysées :**
- L'organisation est-elle prête pour ce niveau de profil ?
- L'équipe est-elle stable ?
- Le manager est-il disponible pour l'onboarding ?
- Des changements majeurs sont-ils prévus dans les 6 prochains mois ? (réorganisation, fusion, déménagement)

**Signaux de mauvais timing organisationnel :**
- Réorganisation en cours
- Manager en train de partir
- Équipe en restructuration
- Budget RH en revue
- Direction en transition

---

### 3.4 TIMING 4 — Marché du Travail

**Objectif :**
Analyser si c'est le bon moment pour recruter selon l'état du marché.

**Marché tendu (profil rare) :**
- Prendre le meilleur disponible maintenant
- Le marché ne s'améliorera pas
- Attendre = perdre le candidat

**Marché standard :**
- Décision dans les délais normaux

**Marché détendu (profil abondant) :**
- Être sélectif
- D'autres candidats viendront
- Ne pas se précipiter

---

## 4. Structure de Données (TypeScript)

```typescript
interface CandidateAvailability {
  noticePeriod: number; // en jours
  noticeNegotiable: boolean;
  
  ongoingCommitments: {
    criticalProjects: boolean;
    projectCount: number;
    projectCompletionDate?: Date;
  };
  
  personalSituation: {
    relocationPlanned: boolean;
    plannedLeave?: Date;
    otherConstraints: string[];
  };
  
  otherProcesses: {
    inProgress: boolean;
    counterOfferRisk: 'low' | 'medium' | 'high';
    processCount: number;
  };
  
  estimatedAvailabilityDate: Date;
  availabilityDelay: number; // en jours
}

interface CareerStage {
  stage: 'tooEarly' | 'optimal' | 'tooLate';
  
  maturityScore: number; // 0-5
  potentialScore: number; // 0-5
  
  careerTrajectory: {
    currentLevel: string;
    targetLevel: string;
    progressionLogical: boolean;
    regression: boolean;
  };
  
  adequacy: 'excellent' | 'good' | 'acceptable' | 'poor';
  temporalRisk: 'low' | 'moderate' | 'high';
  recommendation: string;
}

interface OrganizationalMaturity {
  organizationReady: boolean;
  teamStable: boolean;
  managerAvailable: boolean;
  
  upcomingChanges: {
    reorganization: boolean;
    managerLeaving: boolean;
  teamRestructuring: boolean;
    budgetReview: boolean;
    leadershipTransition: boolean;
  };
  
  readinessLevel: 'ready' | 'partiallyReady' | 'notReady';
  vigilancePoints: string[];
}

interface LaborMarket {
  marketState: 'tight' | 'standard' | 'relaxed';
  
  profileRarity: 'rare' | 'standard' | 'abundant';
  
  recommendation: 'decideNow' | 'normalTimeline' | 'beSelective' | 'expandSearch';
  rationale: string;
}

interface TimingDimensions {
  timingId: string;
  candidateId: string;
  recruitmentId: string;
  
  availability: CandidateAvailability;
  careerStage: CareerStage;
  organizationalMaturity: OrganizationalMaturity;
  laborMarket: LaborMarket;
  
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
CREATE TABLE timing_dimensions (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  availability JSON NOT NULL,
  career_stage JSON NOT NULL,
  organizational_maturity JSON NOT NULL,
  labor_market JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_timing_dimensions_candidate ON timing_dimensions(candidate_id);
CREATE INDEX idx_timing_dimensions_recruitment ON timing_dimensions(recruitment_id);
```

---

## 6. API Endpoints

```typescript
// POST /api/timing-dimensions/analyze
async function analyzeTimingDimensions(candidateId: string, recruitmentId: string): Promise<TimingDimensions> {
  return await analyzeTimingDimensions(candidateId, recruitmentId);
}

// GET /api/timing-dimensions/:candidateId/:recruitmentId
async function getTimingDimensions(candidateId: string, recruitmentId: string): Promise<TimingDimensions> {
  return await getTimingDimensions(candidateId, recruitmentId);
}

// PUT /api/timing-dimensions/:candidateId/:recruitmentId
async function updateTimingDimensions(candidateId: string, recruitmentId: string, dimensions: TimingDimensions): Promise<TimingDimensions> {
  return await updateTimingDimensions(candidateId, recruitmentId, dimensions);
}

// POST /api/timing-dimensions/:candidateId/:recruitmentId/availability
async function analyzeAvailability(candidateId: string, recruitmentId: string): Promise<CandidateAvailability> {
  return await analyzeAvailability(candidateId, recruitmentId);
}

// POST /api/timing-dimensions/:candidateId/:recruitmentId/career-stage
async function analyzeCareerStage(candidateId: string, recruitmentId: string): Promise<CareerStage> {
  return await analyzeCareerStage(candidateId, recruitmentId);
}

// POST /api/timing-dimensions/:candidateId/:recruitmentId/organizational-maturity
async function analyzeOrganizationalMaturity(candidateId: string, recruitmentId: string): Promise<OrganizationalMaturity> {
  return await analyzeOrganizationalMaturity(candidateId, recruitmentId);
}

// POST /api/timing-dimensions/:candidateId/:recruitmentId/labor-market
async function analyzeLaborMarket(candidateId: string, recruitmentId: string): Promise<LaborMarket> {
  return await analyzeLaborMarket(candidateId, recruitmentId);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'analyse | Dimensions analysées / candidats évalués | 100% |
- Taux de complétude | Dimensions complètes / analysées | 100% |

### 7.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de consultation | Dimensions consultées / analysées | ≥ 80% |
- Taux d'impact sur décision | Décisions influencées par timing / décisions totales | ≥ 60% |

---

## 8. Conclusion

Le modèle des 4 dimensions du timing structure les 4 dimensions qui analysent si le timing est optimal pour recruter un candidat. TIMING 1 : Disponibilité réelle du candidat (préavis, engagements, situation personnelle, autres processus). TIMING 2 : Stade de carrière du candidat (trop tôt, optimal, trop tard). TIMING 3 : Maturité de l'entreprise pour accueillir ce profil (organisation prête, équipe stable, manager disponible, changements majeurs). TIMING 4 : Marché du travail (tendu, standard, détendu). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 dimensions du timing
- Disponibilité réelle du candidat
- Stade de carrière du candidat
- Maturité organisationnelle
- Marché du travail
- Analyse détaillée de chaque dimension
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
