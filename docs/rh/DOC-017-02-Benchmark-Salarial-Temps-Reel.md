# DOC-017-02 : Benchmark Salarial Temps Réel

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de benchmark salarial temps réel pour MVP-017 Market Intelligence. Ce système produit une fourchette salariale marché ajustée pour chaque poste ouvert, avec alertes de cohérence budgétaire.

---

## 2. Principe Fondateur

Pour chaque poste ouvert, le moteur produit une fourchette salariale marché (percentile 25, médiane, percentile 75, percentile 90) ajustée par secteur, taille d'entreprise, zone géographique, niveau d'expérience, stack technologique, et rareté du profil. Si l'enveloppe budgétaire du client est inférieure au percentile 25 du marché, alerte immédiate avec recommandations.

---

## 3. Fourchette Marché

### 3.1 Percentiles

**Percentile 25 — Offre basse du marché :**
- Offre minimale pour attirer des candidats
- Risque élevé de qualité insuffisante
- À utiliser uniquement pour profils juniors ou en tension faible

**Médiane — Offre standard du marché :**
- Offre compétitive pour attirer des candidats de qualité
- Point d'équilibre entre coût et qualité
- Recommandé pour la plupart des postes

**Percentile 75 — Offre compétitive :**
- Offre supérieure au marché
- Permet d'attirer des candidats de qualité supérieure
- Recommandé pour postes critiques ou en tension élevée

**Percentile 90 — Offre premium :**
- Offre très supérieure au marché
- Permet d'attirer les meilleurs profils
- Recommandé pour postes stratégiques ou en tension critique

---

### 3.2 Variables d'Ajustement

**Par secteur d'activité :**
- Secteurs à forte croissance : +10-20%
- Secteurs en déclin : -5-15%
- Secteurs stables : 0%

**Par taille d'entreprise :**
- Startup : +5-15%
- PME : 0%
- Grande entreprise : -5-10%
- Multinationale : -10-20%

**Par zone géographique :**
- Paris IDF : +20-30%
- Grandes villes (Lyon, Marseille, Bordeaux) : +10-20%
- Villes moyennes : 0%
- Zones rurales : -10-20%

**Par niveau d'expérience :**
- Junior (0-3 ans) : -20-30%
- Confirmé (3-7 ans) : 0%
- Senior (7-12 ans) : +20-40%
- Expert (12+ ans) : +40-80%

**Par stack technologique (profils tech) :**
- Stack courant : 0%
- Stack en tension : +15-30%
- Stack rare : +30-50%

**Par rareté du profil sur le marché :**
- Profil abondant : -10-20%
- Profil standard : 0%
- Profil rare : +20-40%
- Profil très rare : +40-80%

---

## 4. Algorithme de Calcul du Benchmark

### 4.1 Processus Global

```typescript
async function calculateSalaryBenchmark(job: Job, budget?: number): Promise<SalaryBenchmark> {
  // 1. Collecte des données marché
  const marketData = await collectMarketData(job);
  
  // 2. Calcul des percentiles bruts
  const rawPercentiles = await calculateRawPercentiles(marketData);
  
  // 3. Application des ajustements
  const adjustments = await calculateAdjustments(job);
  
  // 4. Calcul des percentiles ajustés
  const adjustedPercentiles = await applyAdjustments(rawPercentiles, adjustments);
  
  // 5. Vérification de cohérence budgétaire
  const budgetAlert = await checkBudgetCoherence(adjustedPercentiles, budget);
  
  // 6. Construction du benchmark
  const benchmark: SalaryBenchmark = {
    jobId: job.id,
    generatedAt: new Date(),
    
    rawPercentiles,
    adjustedPercentiles,
    adjustments,
    
    budgetAlert
  };
  
  return benchmark;
}
```

---

### 4.2 Collecte des Données Marché

```typescript
async function collectMarketData(job: Job): Promise<MarketSalaryData> {
  const data: MarketSalaryData = {
    jobTitle: job.title,
    sector: job.sector,
    location: job.location,
    experienceLevel: job.experienceLevel,
    
    salaries: []
  };
  
  // Sources de données
  const sources = [
    await scrapeJobSites(job),
    await querySalaryPlatforms(job),
    await queryHRSurveys(job),
    await querySectorReports(job),
    await queryGovernmentData(job)
  ];
  
  // Agrégation des données
  for (const source of sources) {
    data.salaries.push(...source.salaries);
  }
  
  // Filtrage et normalisation
  data.salaries = data.salaries
    .filter(s => s.minSalary > 0 && s.maxSalary > 0)
    .map(s => ({
      min: normalizeSalary(s.minSalary, job.location),
      max: normalizeSalary(s.maxSalary, job.location),
      median: normalizeSalary(s.median, job.location)
    }));
  
  return data;
}

async function scrapeJobSites(job: Job): Promise<SalarySource> {
  const sites = ['LinkedIn', 'Indeed', 'Glassdoor', 'APEC', 'Monster'];
  const salaries: SalaryEntry[] = [];
  
  for (const site of sites) {
    const siteData = await scrapeSite(site, job);
    salaries.push(...siteData);
  }
  
  return { source: 'job_sites', salaries };
}
```

---

### 4.3 Calcul des Percentiles

```typescript
async function calculateRawPercentiles(marketData: MarketSalaryData): Promise<Percentiles> {
  const salaries = marketData.salaries.map(s => s.median);
  salaries.sort((a, b) => a - b);
  
  const percentiles: Percentiles = {
    percentile25: calculatePercentile(salaries, 25),
    median: calculatePercentile(salaries, 50),
    percentile75: calculatePercentile(salaries, 75),
    percentile90: calculatePercentile(salaries, 90)
  };
  
  return percentiles;
}

function calculatePercentile(sortedSalaries: number[], percentile: number): number {
  const index = Math.ceil((percentile / 100) * sortedSalaries.length) - 1;
  return sortedSalaries[index];
}
```

---

### 4.4 Calcul des Ajustements

```typescript
async function calculateAdjustments(job: Job): Promise<Adjustments> {
  const adjustments: Adjustments = {
    sector: 0,
    companySize: 0,
    location: 0,
    experienceLevel: 0,
    techStack: 0,
    rarity: 0,
    totalAdjustment: 0
  };
  
  // Ajustement secteur
  adjustments.sector = await calculateSectorAdjustment(job.sector);
  
  // Ajustement taille entreprise
  adjustments.companySize = await calculateCompanySizeAdjustment(job.companySize);
  
  // Ajustement zone géographique
  adjustments.location = await calculateLocationAdjustment(job.location);
  
  // Ajustement niveau d'expérience
  adjustments.experienceLevel = await calculateExperienceAdjustment(job.experienceLevel);
  
  // Ajustement stack technologique (si applicable)
  if (job.techStack && job.techStack.length > 0) {
    adjustments.techStack = await calculateTechStackAdjustment(job.techStack);
  }
  
  // Ajustement rareté du profil
  adjustments.rarity = await calculateRarityAdjustment(job);
  
  // Calcul de l'ajustement total
  adjustments.totalAdjustment = adjustments.sector + 
                              adjustments.companySize + 
                              adjustments.location + 
                              adjustments.experienceLevel + 
                              adjustments.techStack + 
                              adjustments.rarity;
  
  return adjustments;
}

async function calculateSectorAdjustment(sector: string): Promise<number> {
  const growthSectors = ['Tech', 'SaaS', 'Fintech', 'HealthTech'];
  const decliningSectors = ['Retail', 'Manufacturing', 'Traditional Media'];
  
  if (growthSectors.includes(sector)) {
    return 0.15; // +15%
  } else if (decliningSectors.includes(sector)) {
    return -0.10; // -10%
  } else {
    return 0; // 0%
  }
}

async function calculateLocationAdjustment(location: string): Promise<number> {
  const parisIDF = ['Paris', 'Île-de-France', 'Hauts-de-Seine', 'Seine-Saint-Denis'];
  const majorCities = ['Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg'];
  
  if (parisIDF.some(city => location.includes(city))) {
    return 0.25; // +25%
  } else if (majorCities.some(city => location.includes(city))) {
    return 0.15; // +15%
  } else {
    return 0; // 0%
  }
}
```

---

### 4.5 Application des Ajustements

```typescript
async function applyAdjustments(rawPercentiles: Percentiles, adjustments: Adjustments): Promise<Percentiles> {
  const adjustedPercentiles: Percentiles = {
    percentile25: rawPercentiles.percentile25 * (1 + adjustments.totalAdjustment),
    median: rawPercentiles.median * (1 + adjustments.totalAdjustment),
    percentile75: rawPercentiles.percentile75 * (1 + adjustments.totalAdjustment),
    percentile90: rawPercentiles.percentile90 * (1 + adjustments.totalAdjustment)
  };
  
  return adjustedPercentiles;
}
```

---

### 4.6 Vérification de Cohérence Budgétaire

```typescript
async function checkBudgetCoherence(adjustedPercentiles: Percentiles, budget?: number): Promise<BudgetAlert | null> {
  if (!budget) {
    return null;
  }
  
  const percentile25 = adjustedPercentiles.percentile25;
  
  if (budget < percentile25) {
    const gap = percentile25 - budget;
    const gapPercentage = (gap / percentile25) * 100;
    
    const alert: BudgetAlert = {
      alert: true,
      budget,
      gap,
      gapPercentage,
      recommendations: [
        'Réviser le budget à au moins ' + formatCurrency(percentile25),
        'Réviser le profil recherché (niveau d\'expérience, compétences)',
        'Réviser les critères non négociables pour élargir le vivier'
      ]
    };
    
    return alert;
  }
  
  return null;
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface SalaryBenchmark {
  jobId: string;
  generatedAt: Date;
  
  rawPercentiles: Percentiles;
  adjustedPercentiles: Percentiles;
  adjustments: Adjustments;
  
  budgetAlert?: BudgetAlert;
}

interface Percentiles {
  percentile25: number;
  median: number;
  percentile75: number;
  percentile90: number;
}

interface Adjustments {
  sector: number; // -1 à 1 (ex: 0.15 = +15%)
  companySize: number;
  location: number;
  experienceLevel: number;
  techStack: number;
  rarity: number;
  totalAdjustment: number;
}

interface BudgetAlert {
  alert: boolean;
  budget: number;
  gap: number;
  gapPercentage: number;
  recommendations: string[];
}

interface MarketSalaryData {
  jobTitle: string;
  sector: string;
  location: string;
  experienceLevel: string;
  salaries: SalaryEntry[];
}

interface SalaryEntry {
  min: number;
  max: number;
  median: number;
}

interface SalarySource {
  source: string;
  salaries: SalaryEntry[];
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE salary_benchmark (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  raw_percentiles JSON NOT NULL,
  adjusted_percentiles JSON NOT NULL,
  adjustments JSON NOT NULL,
  
  budget_alert JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_salary_benchmark_job ON salary_benchmark(job_id);
CREATE INDEX idx_salary_benchmark_date ON salary_benchmark(generated_at);

CREATE TABLE market_salary_data (
  id VARCHAR(36) PRIMARY KEY,
  benchmark_id VARCHAR(36) NOT NULL,
  source VARCHAR(100) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  
  salaries JSON NOT NULL,
  
  collected_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (benchmark_id) REFERENCES salary_benchmark(id)
);

CREATE INDEX idx_market_data_benchmark ON market_salary_data(benchmark_id);
CREATE INDEX idx_market_data_source ON market_salary_data(source);
```

---

## 7. API Endpoints

```typescript
// POST /api/market-intelligence/salary-benchmark
async function generateSalaryBenchmark(jobId: string, budget?: number): Promise<SalaryBenchmark> {
  return await calculateSalaryBenchmark(jobId, budget);
}

// GET /api/market-intelligence/salary-benchmark/:jobId
async function getSalaryBenchmark(jobId: string): Promise<SalaryBenchmark> {
  return await getSalaryBenchmarkByJobId(jobId);
}

// POST /api/market-intelligence/salary-benchmark/:jobId/refresh
async function refreshSalaryBenchmark(jobId: string): Promise<SalaryBenchmark> {
  return await calculateSalaryBenchmark(jobId);
}

// GET /api/market-intelligence/salary-benchmark/:jobId/history
async function getSalaryBenchmarkHistory(jobId: string): Promise<SalaryBenchmark[]> {
  return await getHistoricalSalaryBenchmarks(jobId);
}

// POST /api/market-intelligence/salary-benchmark/check-budget
async function checkBudget(jobId: string, budget: number): Promise<BudgetAlert | null> {
  const benchmark = await getSalaryBenchmarkByJobId(jobId);
  return await checkBudgetCoherence(benchmark.adjustedPercentiles, budget);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de fraîcheur des données | Données < 30 jours / total | ≥ 90% |
| Nombre de sources par benchmark | Sources utilisées / total | ≥ 5 |
| Taux d'alerte budgétaire | Alertes déclenchées / postes ouverts | ≥ 80% |
| Satisfaction recruteur | Satisfaction avec le benchmark | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de conformité budgétaire | Postes avec budget conforme / total | ≥ 70% |
| Réduction du temps de négociation | Réduction après utilisation du benchmark | ≥ 20% |
| Amélioration taux d'acceptation | Amélioration des offres acceptées | ≥ 15% |

---

## 9. Conclusion

Le benchmark salarial temps réel produit une fourchette salariale marché ajustée pour chaque poste ouvert, avec alertes de cohérence budgétaire. Le système collecte les données de multiples sources, calcule les percentiles, applique les ajustements (secteur, taille entreprise, zone géographique, expérience, stack technologique, rareté), et alerte si le budget est inférieur au percentile 25 du marché.

**Points clés :**
- 4 percentiles : 25 (bas), médiane (standard), 75 (compétitif), 90 (premium)
- 6 variables d'ajustement : secteur, taille entreprise, zone géographique, expérience, stack technologique, rareté
- Alertes budgétiques automatiques
- Données marché en temps réel
- Recommandations pour ajuster budget ou profil
