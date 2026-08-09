# DOC-017-03 : Tension du Marché par Profil

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'évaluation de la tension du marché par profil pour MVP-017 Market Intelligence. Ce système évalue l'indice de tension pour chaque type de profil et fournit des conséquences sur la stratégie de recrutement.

---

## 2. Principe Fondateur

Pour chaque type de profil, le moteur évalue l'indice de tension (Faible/Modéré/Élevé/Critique) et fournit des conséquences sur la stratégie : délai de recrutement estimé, nombre de candidatures espérées, niveau de sélectivité recommandé, stratégie de sourcing adaptée, arguments de séduction prioritaires, et risque de contre-offre employeur actuel.

---

## 3. Indice de Tension

### 3.1 Niveaux de Tension

**Faible — Profil abondant, délai court :**
- Offres d'emploi : Abondantes
- Candidatures : Élevées
- Délai de recrutement : Court (2-4 semaines)
- Concurrence : Faible
- Exemples : Administratif, Commercial junior, Support

**Modéré — Profil disponible, concurrence normale :**
- Offres d'emploi : Modérées
- Candidatures : Modérées
- Délai de recrutement : Normal (4-8 semaines)
- Concurrence : Normale
- Exemples : Marketing, Comptabilité, RH

**Élevé — Profil rare, concurrence forte :**
- Offres d'emploi : Peu nombreuses
- Candidatures : Faibles
- Délai de recrutement : Long (8-12 semaines)
- Concurrence : Forte
- Exemples : Data Scientist, DevOps Senior, Product Manager

**Critique — Profil très rare, guerre des talents :**
- Offres d'emploi : Très peu nombreuses
- Candidatures : Très faibles
- Délai de recrutement : Très long (12-20+ semaines)
- Concurrence : Très forte
- Exemples : AI Engineer, Blockchain Developer, CTO

---

### 3.2 Facteurs de Tension

**Facteurs techniques :**
- Stack technologique (courant vs rare vs très rare)
- Niveau d'expérience (junior vs senior vs expert)
- Spécialisation (généraliste vs spécialiste)

**Facteurs géographiques :**
- Zone géographique (Paris vs province)
- Mobilité requise (locale vs nationale vs internationale)
- Télétravail possible (oui vs non)

**Facteurs sectoriels :**
- Secteur en croissance vs en déclin
- Taille de l'entreprise (startup vs grande entreprise)
- Réputation de l'entreprise

**Facteurs temporels :**
- Saison (période de recrutement active vs inactive)
- Tendance du marché (croissance vs récession)

---

## 4. Algorithme d'Évaluation de la Tension

### 4.1 Processus Global

```typescript
async function evaluateMarketTension(job: Job): Promise<MarketTension> {
  // 1. Collecte des données marché
  const marketData = await collectTensionData(job);
  
  // 2. Calcul du score de tension
  const tensionScore = await calculateTensionScore(marketData);
  
  // 3. Détermination du niveau de tension
  const tensionLevel = await determineTensionLevel(tensionScore);
  
  // 4. Calcul des conséquences sur la stratégie
  const consequences = await calculateConsequences(tensionLevel, job);
  
  // 5. Construction de l'évaluation
  const tension: MarketTension = {
    jobId: job.id,
    generatedAt: new Date(),
    
    index: tensionLevel,
    score: tensionScore,
    
    factors: await identifyTensionFactors(job, marketData),
    
    consequences
  };
  
  return tension;
}
```

---

### 4.2 Collecte des Données de Tension

```typescript
async function collectTensionData(job: Job): Promise<TensionData> {
  const data: TensionData = {
    jobTitle: job.title,
    sector: job.sector,
    location: job.location,
    experienceLevel: job.experienceLevel,
    techStack: job.techStack || [],
    
    jobOffersCount: 0,
    applicationsCount: 0,
    timeToHireAverage: 0,
    competitionLevel: 0
  };
  
  // Collecte des données de sources multiples
  const sources = [
    await queryJobSites(job),
    await queryLinkedInData(job),
    await queryGlassdoorData(job),
    await queryIndeedData(job),
    await queryAPECData(job)
  ];
  
  // Agrégation des données
  for (const source of sources) {
    data.jobOffersCount += source.jobOffersCount;
    data.applicationsCount += source.applicationsCount;
    data.timeToHireAverage += source.timeToHireAverage;
    data.competitionLevel += source.competitionLevel;
  }
  
  // Normalisation
  data.timeToHireAverage = data.timeToHireAverage / sources.length;
  data.competitionLevel = data.competitionLevel / sources.length;
  
  return data;
}
```

---

### 4.3 Calcul du Score de Tension

```typescript
async function calculateTensionScore(data: TensionData): Promise<number> {
  let score = 0; // 0-100
  
  // Ratio offres/candidatures (inversé)
  const ratio = data.applicationsCount / Math.max(1, data.jobOffersCount);
  if (ratio < 2) score += 30; // Peu de candidatures par offre
  else if (ratio < 5) score += 20;
  else if (ratio < 10) score += 10;
  else score += 0; // Beaucoup de candidatures par offre
  
  // Délai de recrutement
  if (data.timeToHireAverage > 90) score += 30; // Plus de 3 mois
  else if (data.timeToHireAverage > 60) score += 20; // Plus de 2 mois
  else if (data.timeToHireAverage > 30) score += 10; // Plus de 1 mois
  else score += 0; // Moins de 1 mois
  
  // Niveau de concurrence
  if (data.competitionLevel > 0.8) score += 25; // Très forte concurrence
  else if (data.competitionLevel > 0.6) score += 15; // Forte concurrence
  else if (data.competitionLevel > 0.4) score += 5; // Concurrence modérée
  else score += 0; // Faible concurrence
  
  // Ajustement par facteurs additionnels
  const additionalFactors = await calculateAdditionalFactors(data);
  score += additionalFactors;
  
  // Normalisation
  score = Math.min(100, Math.max(0, score));
  
  return score;
}
```

---

### 4.4 Détermination du Niveau de Tension

```typescript
async function determineTensionLevel(score: number): Promise<TensionLevel> {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
}
```

---

### 4.5 Calcul des Conséquences sur la Stratégie

```typescript
async function calculateConsequences(tensionLevel: TensionLevel, job: Job): Promise<TensionConsequences> {
  const consequences: TensionConsequences = {
    estimatedRecruitmentDelay: 0,
    expectedApplications: 0,
    recommendedSelectivity: 'medium',
    sourcingStrategy: [],
    prioritySeductionArguments: [],
    counterOfferRisk: 'medium'
  };
  
  switch (tensionLevel) {
    case 'low':
      consequences.estimatedRecruitmentDelay = 21; // 3 semaines
      consequences.expectedApplications = 50;
      consequences.recommendedSelectivity = 'high';
      consequences.sourcingStrategy = [
        'Job boards classiques',
        'Réseaux sociaux professionnels',
        'Candidatures spontanées'
      ];
      consequences.prioritySeductionArguments = [
        'Stabilité de l\'entreprise',
        'Équilibre vie pro/perso',
        'Avantages sociaux'
      ];
      consequences.counterOfferRisk = 'low';
      break;
      
    case 'moderate':
      consequences.estimatedRecruitmentDelay = 42; // 6 semaines
      consequences.expectedApplications = 30;
      consequences.recommendedSelectivity = 'medium';
      consequences.sourcingStrategy = [
        'Job boards spécialisés',
        'LinkedIn Recruiter',
        'Réseaux professionnels',
        'Candidatures spontanées'
      ];
      consequences.prioritySeductionArguments = [
        'Opportunités de croissance',
        'Culture d\'entreprise',
        'Technologies innovantes'
      ];
      consequences.counterOfferRisk = 'medium';
      break;
      
    case 'high':
      consequences.estimatedRecruitmentDelay = 70; // 10 semaines
      consequences.expectedApplications = 15;
      consequences.recommendedSelectivity = 'low';
      consequences.sourcingStrategy = [
        'Chasse de tête',
        'LinkedIn Recruiter (InMail)',
        'Réseaux de développeurs',
        'Communautés tech',
        'Hackathons et événements'
      ];
      consequences.prioritySeductionArguments = [
        'Rémunération compétitive',
        'Projets ambitieux',
        'Autonomie et responsabilité',
        'Télétravail'
      ];
      consequences.counterOfferRisk = 'high';
      break;
      
    case 'critical':
      consequences.estimatedRecruitmentDelay = 105; // 15 semaines
      consequences.expectedApplications = 5;
      consequences.recommendedSelectivity = 'very_low';
      consequences.sourcingStrategy = [
        'Chasse de tête agressive',
        'LinkedIn Recruiter (InMail premium)',
        'Réseaux exclusifs',
        'Partenariats avec écoles/universités',
        'Conférences et événements internationaux',
        'Offres de réferral bonus élevées'
      ];
      consequences.prioritySeductionArguments = [
        'Rémunération premium',
        'Equity/Stock options',
        'Impact stratégique',
        'Flexibilité totale',
        'Visibilité et reconnaissance'
      ];
      consequences.counterOfferRisk = 'critical';
      break;
  }
  
  return consequences;
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface MarketTension {
  jobId: string;
  generatedAt: Date;
  
  index: TensionLevel;
  score: number; // 0-100
  
  factors: TensionFactors;
  
  consequences: TensionConsequences;
}

type TensionLevel = 'low' | 'moderate' | 'high' | 'critical';

interface TensionFactors {
  techStack: {
    level: 'common' | 'rare' | 'very_rare';
    impact: number; // 0-100
  };
  
  experienceLevel: {
    level: 'junior' | 'confirmed' | 'senior' | 'expert';
    impact: number; // 0-100
  };
  
  specialization: {
    level: 'generalist' | 'specialist' | 'expert';
    impact: number; // 0-100
  };
  
  geography: {
    level: 'local' | 'national' | 'international';
    impact: number; // 0-100
  };
  
  sector: {
    level: 'declining' | 'stable' | 'growing';
    impact: number; // 0-100
  };
  
  seasonality: {
    level: 'low' | 'medium' | 'high';
    impact: number; // 0-100
  };
}

interface TensionConsequences {
  estimatedRecruitmentDelay: number; // jours
  expectedApplications: number;
  recommendedSelectivity: 'very_low' | 'low' | 'medium' | 'high';
  sourcingStrategy: string[];
  prioritySeductionArguments: string[];
  counterOfferRisk: 'low' | 'medium' | 'high' | 'critical';
}

interface TensionData {
  jobTitle: string;
  sector: string;
  location: string;
  experienceLevel: string;
  techStack: string[];
  
  jobOffersCount: number;
  applicationsCount: number;
  timeToHireAverage: number; // jours
  competitionLevel: number; // 0-1
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE market_tension (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  tension_index VARCHAR(20) NOT NULL,
  tension_score INT NOT NULL CHECK (tension_score >= 0 AND tension_score <= 100),
  
  factors JSON NOT NULL,
  consequences JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_market_tension_job ON market_tension(job_id);
CREATE INDEX idx_market_tension_index ON market_tension(tension_index);
CREATE INDEX idx_market_tension_date ON market_tension(generated_at);

CREATE TABLE tension_data (
  id VARCHAR(36) PRIMARY KEY,
  tension_id VARCHAR(36) NOT NULL,
  source VARCHAR(100) NOT NULL,
  
  job_title VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  tech_stack JSON,
  
  job_offers_count INT NOT NULL,
  applications_count INT NOT NULL,
  time_to_hire_average INT NOT NULL,
  competition_level DECIMAL(3,2) NOT NULL,
  
  collected_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (tension_id) REFERENCES market_tension(id)
);

CREATE INDEX idx_tension_data_tension ON tension_data(tension_id);
CREATE INDEX idx_tension_data_source ON tension_data(source);
```

---

## 7. API Endpoints

```typescript
// POST /api/market-intelligence/tension
async function evaluateMarketTension(jobId: string): Promise<MarketTension> {
  return await evaluateMarketTension(jobId);
}

// GET /api/market-intelligence/tension/:jobId
async function getMarketTension(jobId: string): Promise<MarketTension> {
  return await getMarketTensionByJobId(jobId);
}

// POST /api/market-intelligence/tension/:jobId/refresh
async function refreshMarketTension(jobId: string): Promise<MarketTension> {
  return await evaluateMarketTension(jobId);
}

// GET /api/market-intelligence/tension/:jobId/history
async function getTensionHistory(jobId: string): Promise<MarketTension[]> {
  return await getHistoricalTension(jobId);
}

// GET /api/market-intelligence/tension/sector/:sector
async function getSectorTension(sector: string): Promise<MarketTension[]> {
  return await getTensionBySector(sector);
}

// GET /api/market-intelligence/tension/location/:location
async function getLocationTension(location: string): Promise<MarketTension[]> {
  return await getTensionByLocation(location);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de fraîcheur des données | Données < 7 jours / total | ≥ 90% |
| Nombre de sources par évaluation | Sources utilisées / total | ≥ 5 |
| Précision de la prédiction | Précision du délai estimé vs réel | ≥ 80% |
| Satisfaction recruteur | Satisfaction avec l'évaluation de tension | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction du délai de recrutement | Réduction après utilisation | ≥ 15% |
| Amélioration du taux de sourcing | Amélioration des candidatures | ≥ 20% |
| Réduction des contre-offres | Réduction des départs après acceptation | ≥ 25% |

---

## 9. Conclusion

L'évaluation de la tension du marché par profil fournit un indice de tension (Faible/Modéré/Élevé/Critique) et des conséquences sur la stratégie de recrutement. Le système collecte les données de multiples sources, calcule le score de tension, identifie les facteurs de tension, et recommande une stratégie adaptée (délai, sélectivité, sourcing, arguments de séduction, risque de contre-offre).

**Points clés :**
- 4 niveaux de tension : Faible, Modéré, Élevé, Critique
- 6 facteurs de tension : stack technologique, expérience, spécialisation, géographie, secteur, saisonnalité
- Conséquences sur la stratégie : délai, candidatures, sélectivité, sourcing, arguments, risque de contre-offre
- Données marché en temps réel
- Recommandations personnalisées par niveau de tension
