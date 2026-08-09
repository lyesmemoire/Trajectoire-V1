# DOC-017-04 : Intelligence des Attentes Candidats

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'intelligence des attentes candidats pour MVP-017 Market Intelligence. Ce système identifie ce que les candidats d'un profil valorisent réellement en ce moment et alerte sur les gaps entre ce que l'entreprise offre et ce que le marché attend.

---

## 2. Principe Fondateur

Ce que les candidats de ce profil valorisent réellement en ce moment : télétravail et flexibilité, progression de carrière rapide, impact et sens du travail, rémunération et avantages, qualité du management, taille et culture d'entreprise, technologies utilisées (profils tech), réputation de l'entreprise. Pour chaque poste, le moteur alerte sur les gaps entre ce que l'entreprise offre et ce que le marché attend.

---

## 3. Attentes Candidats par Dimension

### 3.1 Télétravail et Flexibilité

**Score marché (0-100) :** Importance moyenne pour ce profil

**Facteurs :**
- Télétravail partiel (2-3 jours/semaine)
- Télétravail complet
- Horaires flexibles
- Flexibilité géographique

**Évolution temporelle :**
- 2020 : 45/100
- 2022 : 65/100
- 2024 : 75/100
- 2026 : 80/100

**Variation par profil :**
- Tech : 90/100
- Marketing : 80/100
- RH : 75/100
- Finance : 65/100
- Commercial : 60/100

---

### 3.2 Progression de Carrière Rapide

**Score marché (0-100) :** Importance moyenne pour ce profil

**Facteurs :**
- Opportunités de promotion
- Plan de carrière clair
- Formation continue
- Mentorat
- Rotation interne

**Variation par profil :**
- Junior : 85/100
- Confirmé : 75/100
- Senior : 60/100
- Expert : 40/100

---

### 3.3 Impact et Sens du Travail

**Score marché (0-100) :** Importance moyenne pour ce profil

**Facteurs :**
- Contribution à la mission
- Impact mesurable
- Sens du travail
- Alignement valeurs personnelles
- Utilité sociale

**Variation par profil :**
- Tech : 70/100
- Marketing : 75/100
- RH : 80/100
- Finance : 55/100
- Commercial : 65/100

---

### 3.4 Rémunération et Avantages

**Score marché (0-100) :** Importance moyenne pour ce profil

**Facteurs :**
- Salaire compétitif
- Bonus/Prime
- Équity/Stock options
- Avantages sociaux (mutuelle, retraite)
- Perks (restaurant, transport, sport)

**Variation par profil :**
- Tech : 80/100
- Finance : 85/100
- Commercial : 75/100
- Marketing : 70/100
- RH : 65/100

---

### 3.5 Qualité du Management

**Score marché (0-100) :** Importance moyenne pour ce profil

**Facteurs :**
- Management bienveillant
- Feedback régulier
- Autonomie
- Culture de confiance
- Leadership inspirant

**Variation par profil :**
- Junior : 90/100
- Confirmé : 80/100
- Senior : 70/100
- Expert : 60/100

---

### 3.6 Taille et Culture d'Entreprise

**Score marché (0-100) :** Importance moyenne pour ce profil

**Facteurs :**
- Taille de l'entreprise (startup vs grande entreprise)
- Culture d'entreprise
- Ambiance de travail
- Diversité et inclusion
- Innovation

**Variation par profil :**
- Tech : 75/100
- Marketing : 70/100
- RH : 80/100
- Finance : 60/100
- Commercial : 65/100

---

### 3.7 Technologies Utilisées (Profils Tech)

**Score marché (0-100) :** Importance moyenne pour ce profil

**Facteurs :**
- Stack technologique moderne
- Outils innovants
- Veille technologique
- Budget innovation
- Freedom to choose tools

**Variation par profil :**
- Développeur : 85/100
- Data Scientist : 80/100
- DevOps : 75/100
- Product Manager : 70/100

---

### 3.8 Réputation de l'Entreprise

**Score marché (0-100) :** Importance moyenne pour ce profil

**Facteurs :**
- Notoriété de la marque
- Réputation employeur
- Avis employés
- Classements (Great Place to Work, etc.)
- Stabilité financière

**Variation par profil :**
- Junior : 70/100
- Confirmé : 75/100
- Senior : 80/100
- Expert : 85/100

---

## 4. Algorithme d'Analyse des Attentes

### 4.1 Processus Global

```typescript
async function analyzeCandidateExpectations(job: Job, companyOffer: CompanyOffer): Promise<CandidateExpectations> {
  // 1. Collecte des données marché
  const marketData = await collectExpectationsData(job);
  
  // 2. Calcul des scores marché par dimension
  const marketScores = await calculateMarketScores(marketData, job);
  
  // 3. Calcul des scores entreprise par dimension
  const companyScores = await calculateCompanyScores(companyOffer);
  
  // 4. Détection des gaps
  const gaps = await detectGaps(marketScores, companyScores);
  
  // 5. Classification des gaps par sévérité
  const classifiedGaps = await classifyGaps(gaps);
  
  // 6. Construction de l'analyse
  const expectations: CandidateExpectations = {
    jobId: job.id,
    generatedAt: new Date(),
    
    marketScores,
    companyScores,
    gaps: classifiedGaps,
    
    summary: await generateSummary(classifiedGaps),
    recommendations: await generateRecommendations(classifiedGaps)
  };
  
  return expectations;
}
```

---

### 4.2 Collecte des Données Marché

```typescript
async function collectExpectationsData(job: Job): Promise<ExpectationsData> {
  const data: ExpectationsData = {
    jobTitle: job.title,
    sector: job.sector,
    experienceLevel: job.experienceLevel,
    techStack: job.techStack || [],
    
    remoteWork: 0,
    careerProgression: 0,
    impact: 0,
    compensation: 0,
    management: 0,
    companyCulture: 0,
    technologies: 0,
    companyReputation: 0
  };
  
  // Sources de données
  const sources = [
    await queryLinkedInSurvey,
    await queryGlassdoorSurvey,
    await queryIndeedSurvey,
    await queryAPECStudy,
    await queryHRReports
  ];
  
  // Agrégation des données
  for (const source of sources) {
    const sourceData = await source(job);
    
    data.remoteWork += sourceData.remoteWork;
    data.careerProgression += sourceData.careerProgression;
    data.impact += sourceData.impact;
    data.compensation += sourceData.compensation;
    data.management += sourceData.management;
    data.companyCulture += sourceData.companyCulture;
    data.technologies += sourceData.technologies;
    data.companyReputation += sourceData.companyReputation;
  }
  
  // Normalisation
  const sourceCount = sources.length;
  data.remoteWork = data.remoteWork / sourceCount;
  data.careerProgression = data.careerProgression / sourceCount;
  data.impact = data.impact / sourceCount;
  data.compensation = data.compensation / sourceCount;
  data.management = data.management / sourceCount;
  data.companyCulture = data.companyCulture / sourceCount;
  data.technologies = data.technologies / sourceCount;
  data.companyReputation = data.companyReputation / sourceCount;
  
  // Ajustement par profil
  data = await adjustByProfile(data, job);
  
  return data;
}

async function adjustByProfile(data: ExpectationsData, job: Job): Promise<ExpectationsData> {
  const adjustments = await getProfileAdjustments(job.experienceLevel, job.sector);
  
  data.remoteWork *= adjustments.remoteWork;
  data.careerProgression *= adjustments.careerProgression;
  data.impact *= adjustments.impact;
  data.compensation *= adjustments.compensation;
  data.management *= adjustments.management;
  data.companyCulture *= adjustments.companyCulture;
  data.technologies *= adjustments.technologies;
  data.companyReputation *= adjustments.companyReputation;
  
  return data;
}
```

---

### 4.3 Calcul des Scores Entreprise

```typescript
async function calculateCompanyScores(companyOffer: CompanyOffer): Promise<CompanyScores> {
  const scores: CompanyScores = {
    remoteWork: await scoreRemoteWork(companyOffer.remoteWorkPolicy),
    careerProgression: await scoreCareerProgression(companyOffer.careerPath),
    impact: await scoreImpact(companyOffer.mission),
    compensation: await scoreCompensation(companyOffer.compensation),
    management: await scoreManagement(companyOffer.managementStyle),
    companyCulture: await scoreCompanyCulture(companyOffer.culture),
    technologies: await scoreTechnologies(companyOffer.techStack),
    companyReputation: await scoreCompanyReputation(companyOffer.reputation)
  };
  
  return scores;
}

async function scoreRemoteWork(policy: RemoteWorkPolicy): Promise<number> {
  if (policy.fullRemote) return 100;
  if (policy.hybrid && policy.daysPerWeek >= 3) return 90;
  if (policy.hybrid && policy.daysPerWeek >= 2) return 75;
  if (policy.hybrid && policy.daysPerWeek >= 1) return 50;
  return 20;
}

async function scoreCompensation(compensation: Compensation): Promise<number> {
  let score = 0;
  
  // Salaire
  if (compensation.salaryPercentile >= 90) score += 40;
  else if (compensation.salaryPercentile >= 75) score += 30;
  else if (compensation.salaryPercentile >= 50) score += 20;
  else score += 10;
  
  // Bonus
  if (compensation.bonus) score += 20;
  
  // Equity
  if (compensation.equity) score += 20;
  
  // Avantages
  if (compensation.benefits.length >= 5) score += 20;
  else if (compensation.benefits.length >= 3) score += 10;
  
  return score;
}
```

---

### 4.4 Détection des Gaps

```typescript
async function detectGaps(marketScores: MarketScores, companyScores: CompanyScores): Promise<Gap[]> {
  const gaps: Gap[] = [];
  
  const dimensions = [
    'remoteWork',
    'careerProgression',
    'impact',
    'compensation',
    'management',
    'companyCulture',
    'technologies',
    'companyReputation'
  ];
  
  for (const dimension of dimensions) {
    const marketScore = marketScores[dimension];
    const companyScore = companyScores[dimension];
    
    const gap = marketScore - companyScore;
    
    if (gap > 10) {
      gaps.push({
        dimension,
        expectation: getDimensionLabel(dimension),
        marketScore,
        companyOffer: companyScore,
        gap,
        severity: gap > 30 ? 'high' : gap > 20 ? 'medium' : 'low'
      });
    }
  }
  
  return gaps;
}

function getDimensionLabel(dimension: string): string {
  const labels: Record<string, string> = {
    remoteWork: 'Télétravail et flexibilité',
    careerProgression: 'Progression de carrière',
    impact: 'Impact et sens du travail',
    compensation: 'Rémunération et avantages',
    management: 'Qualité du management',
    companyCulture: 'Taille et culture d\'entreprise',
    technologies: 'Technologies utilisées',
    companyReputation: 'Réputation de l\'entreprise'
  };
  
  return labels[dimension] || dimension;
}
```

---

### 4.5 Classification des Gaps

```typescript
async function classifyGaps(gaps: Gap[]): Promise<ClassifiedGaps> {
  const classified: ClassifiedGaps = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };
  
  for (const gap of gaps) {
    if (gap.severity === 'high' && gap.gap > 30) {
      classified.critical.push(gap);
    } else if (gap.severity === 'high') {
      classified.high.push(gap);
    } else if (gap.severity === 'medium') {
      classified.medium.push(gap);
    } else {
      classified.low.push(gap);
    }
  }
  
  return classified;
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface CandidateExpectations {
  jobId: string;
  generatedAt: Date;
  
  marketScores: MarketScores;
  companyScores: CompanyScores;
  gaps: ClassifiedGaps;
  
  summary: {
    totalGaps: number;
    criticalGaps: number;
    highGaps: number;
    mediumGaps: number;
    lowGaps: number;
    overallFit: 'excellent' | 'good' | 'fair' | 'poor';
  };
  
  recommendations: string[];
}

interface MarketScores {
  remoteWork: number; // 0-100
  careerProgression: number; // 0-100
  impact: number; // 0-100
  compensation: number; // 0-100
  management: number; // 0-100
  companyCulture: number; // 0-100
  technologies: number; // 0-100
  companyReputation: number; // 0-100
}

interface CompanyScores {
  remoteWork: number; // 0-100
  careerProgression: number; // 0-100
  impact: number; // 0-100
  compensation: number; // 0-100
  management: number; // 0-100
  companyCulture: number; // 0-100
  technologies: number; // 0-100
  companyReputation: number; // 0-100
}

interface Gap {
  dimension: string;
  expectation: string;
  marketScore: number;
  companyOffer: number;
  gap: number;
  severity: 'low' | 'medium' | 'high';
}

interface ClassifiedGaps {
  critical: Gap[];
  high: Gap[];
  medium: Gap[];
  low: Gap[];
}

interface ExpectationsData {
  jobTitle: string;
  sector: string;
  experienceLevel: string;
  techStack: string[];
  
  remoteWork: number;
  careerProgression: number;
  impact: number;
  compensation: number;
  management: number;
  companyCulture: number;
  technologies: number;
  companyReputation: number;
}

interface CompanyOffer {
  remoteWorkPolicy: RemoteWorkPolicy;
  careerPath: CareerPath;
  mission: string;
  compensation: Compensation;
  managementStyle: string;
  culture: string;
  techStack: string[];
  reputation: string;
}

interface RemoteWorkPolicy {
  fullRemote: boolean;
  hybrid: boolean;
  daysPerWeek: number;
}

interface Compensation {
  salaryPercentile: number;
  bonus: boolean;
  equity: boolean;
  benefits: string[];
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE candidate_expectations (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  market_scores JSON NOT NULL,
  company_scores JSON NOT NULL,
  gaps JSON NOT NULL,
  
  summary JSON NOT NULL,
  recommendations JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_expectations_job ON candidate_expectations(job_id);
CREATE INDEX idx_expectations_date ON candidate_expectations(generated_at);

CREATE TABLE expectations_data (
  id VARCHAR(36) PRIMARY KEY,
  expectations_id VARCHAR(36) NOT NULL,
  source VARCHAR(100) NOT NULL,
  
  job_title VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  tech_stack JSON,
  
  remote_work INT NOT NULL,
  career_progression INT NOT NULL,
  impact INT NOT NULL,
  compensation INT NOT NULL,
  management INT NOT NULL,
  company_culture INT NOT NULL,
  technologies INT NOT NULL,
  company_reputation INT NOT NULL,
  
  collected_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (expectations_id) REFERENCES candidate_expectations(id)
);

CREATE INDEX idx_expectations_data_expectations ON expectations_data(expectations_id);
CREATE INDEX idx_expectations_data_source ON expectations_data(source);
```

---

## 7. API Endpoints

```typescript
// POST /api/market-intelligence/expectations
async function analyzeExpectations(jobId: string, companyOffer: CompanyOffer): Promise<CandidateExpectations> {
  return await analyzeCandidateExpectations(jobId, companyOffer);
}

// GET /api/market-intelligence/expectations/:jobId
async function getExpectations(jobId: string): Promise<CandidateExpectations> {
  return await getExpectationsByJobId(jobId);
}

// POST /api/market-intelligence/expectations/:jobId/refresh
async function refreshExpectations(jobId: string, companyOffer: CompanyOffer): Promise<CandidateExpectations> {
  return await analyzeCandidateExpectations(jobId, companyOffer);
}

// GET /api/market-intelligence/expectations/:jobId/history
async function getExpectationsHistory(jobId: string): Promise<CandidateExpectations[]> {
  return await getHistoricalExpectations(jobId);
}

// GET /api/market-intelligence/expectations/sector/:sector
async function getSectorExpectations(sector: string): Promise<CandidateExpectations[]> {
  return await getExpectationsBySector(sector);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de fraîcheur des données | Données < 30 jours / total | ≥ 90% |
| Nombre de sources par analyse | Sources utilisées / total | ≥ 5 |
| Précision de la prédiction | Précision des gaps détectés vs réel | ≥ 80% |
| Satisfaction recruteur | Satisfaction avec l'analyse | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des gaps | Réduction des gaps après ajustements | ≥ 30% |
| Amélioration taux d'acceptation | Amélioration des offres acceptées | ≥ 20% |
| Réduction du turnover | Réduction du turnover à 1 an | ≥ 15% |

---

## 9. Conclusion

L'intelligence des attentes candidats identifie ce que les candidats d'un profil valorisent réellement en ce moment (télétravail, progression de carrière, impact, rémunération, management, culture, technologies, réputation) et alerte sur les gaps entre ce que l'entreprise offre et ce que le marché attend. Le système collecte les données de multiples sources, calcule les scores marché et entreprise, détecte les gaps, et recommande des actions pour réduire les écarts.

**Points clés :**
- 8 dimensions d'attentes : télétravail, progression de carrière, impact, rémunération, management, culture, technologies, réputation
- Scores marché par profil (junior, confirmé, senior, expert)
- Scores entreprise basés sur l'offre réelle
- Détection automatique des gaps
- Classification par sévérité (critical, high, medium, low)
- Recommandations pour réduire les écarts
- Données marché en temps réel
