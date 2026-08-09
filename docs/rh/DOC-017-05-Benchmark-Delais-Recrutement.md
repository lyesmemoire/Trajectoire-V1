# DOC-017-05 : Benchmark Délais de Recrutement

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de benchmark des délais de recrutement pour MVP-017 Market Intelligence. Ce système fournit le délai moyen du marché pour chaque type de poste et niveau, compare avec les délais internes historiques de l'entreprise, identifie les écarts, et recommande des actions pour accélérer le processus.

---

## 2. Principe Fondateur

Par type de poste et niveau : délai moyen du marché pour ce profil, délai interne historique de l'entreprise, écart et recommandations pour l'accélérer, étapes qui allongent inutilement le processus. Le système permet à l'entreprise d'optimiser son processus de recrutement et de réduire ses délais.

---

## 3. Délais de Recrutement par Profil

### 3.1 Délais Moyens du Marché

**Par niveau d'expérience :**
- Junior : 21 jours (3 semaines)
- Confirmé : 35 jours (5 semaines)
- Senior : 49 jours (7 semaines)
- Expert : 63 jours (9 semaines)

**Par secteur :**
- Tech : 42 jours (6 semaines)
- Finance : 28 jours (4 semaines)
- Marketing : 35 jours (5 semaines)
- RH : 21 jours (3 semaines)
- Commercial : 28 jours (4 semaines)

**Par type de poste :**
- Administratif : 14 jours (2 semaines)
- Commercial : 28 jours (4 semaines)
- Marketing : 35 jours (5 semaines)
- Tech (développeur) : 42 jours (6 semaines)
- Tech (data scientist) : 56 jours (8 semaines)
- Management : 49 jours (7 semaines)
- Direction : 63 jours (9 semaines)

---

### 3.2 Facteurs d'Allongement

**Facteurs internes :**
- Nombre d'étapes du processus
- Délai entre chaque étape
- Nombre d'intervenants
- Processus de validation
- Disponibilité des décideurs

**Facteurs externes :**
- Tension du marché
- Saison (période de recrutement active vs inactive)
- Concurrence
- Réputation de l'entreprise

---

## 4. Algorithme de Benchmark des Délais

### 4.1 Processus Global

```typescript
async function benchmarkRecruitmentDelay(job: Job, companyHistory: CompanyHistory): Promise<RecruitmentDelayBenchmark> {
  // 1. Collecte des données marché
  const marketData = await collectDelayData(job);
  
  // 2. Calcul du délai moyen du marché
  const marketAverage = await calculateMarketAverage(marketData, job);
  
  // 3. Calcul du délai interne historique
  const internalHistorical = await calculateInternalHistorical(companyHistory, job);
  
  // 4. Calcul de l'écart
  const gap = internalHistorical - marketAverage;
  
  // 5. Identification des étapes qui allongent
  const bottlenecks = await identifyBottlenecks(companyHistory, job);
  
  // 6. Recommandations pour accélérer
  const recommendations = await generateRecommendations(bottlenecks, gap);
  
  // 7. Construction du benchmark
  const benchmark: RecruitmentDelayBenchmark = {
    jobId: job.id,
    generatedAt: new Date(),
    
    marketAverage,
    internalHistorical,
    gap,
    
    gapPercentage: (gap / marketAverage) * 100,
    
    bottlenecks,
    recommendations,
    
    estimatedImprovement: await estimateImprovement(recommendations)
  };
  
  return benchmark;
}
```

---

### 4.2 Collecte des Données de Délai

```typescript
async function collectDelayData(job: Job): Promise<DelayData> {
  const data: DelayData = {
    jobTitle: job.title,
    sector: job.sector,
    location: job.location,
    experienceLevel: job.experienceLevel,
    
    delays: []
  };
  
  // Sources de données
  const sources = [
    await queryLinkedInData,
    await queryGlassdoorData,
    await queryIndeedData,
    await queryAPECData,
    await queryHRReports
  ];
  
  // Agrégation des données
  for (const source of sources) {
    const sourceData = await source(job);
    data.delays.push(...sourceData.delays);
  }
  
  // Filtrage et normalisation
  data.delays = data.delays
    .filter(d => d.days > 0 && d.days < 365)
    .map(d => ({
      days: d.days,
      source: d.source,
      sector: d.sector,
      experienceLevel: d.experienceLevel
    }));
  
  return data;
}
```

---

### 4.3 Calcul du Délai Moyen du Marché

```typescript
async function calculateMarketAverage(data: DelayData, job: Job): Promise<number> {
  // Filtrage par profil similaire
  const similarDelays = data.delays.filter(d => 
    d.sector === job.sector && 
    d.experienceLevel === job.experienceLevel
  );
  
  if (similarDelays.length === 0) {
    // Fallback : toutes les données
    const allDelays = data.delays.map(d => d.days);
    return allDelays.reduce((sum, d) => sum + d, 0) / Math.max(1, allDelays.length);
  }
  
  // Calcul de la moyenne
  const days = similarDelays.map(d => d.days);
  const average = days.reduce((sum, d) => sum + d, 0) / days.length;
  
  // Ajustement par zone géographique
  const locationAdjustment = await getLocationAdjustment(job.location);
  
  return average * (1 + locationAdjustment);
}

async function getLocationAdjustment(location: string): Promise<number> {
  const parisIDF = ['Paris', 'Île-de-France', 'Hauts-de-Seine', 'Seine-Saint-Denis'];
  const majorCities = ['Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg'];
  
  if (parisIDF.some(city => location.includes(city))) {
    return 0.1; // +10% (concurrence plus forte)
  } else if (majorCities.some(city => location.includes(city))) {
    return 0.05; // +5%
  } else {
    return -0.05; // -5% (concurrence moins forte)
  }
}
```

---

### 4.4 Calcul du Délai Interne Historique

```typescript
async function calculateInternalHistorical(history: CompanyHistory, job: Job): Promise<number> {
  // Filtrage par poste similaire
  const similarJobs = history.jobs.filter(j => 
    j.title === job.title && 
    j.sector === job.sector && 
    j.experienceLevel === job.experienceLevel
  );
  
  if (similarJobs.length === 0) {
    // Fallback : tous les postes
    const allJobs = history.jobs.map(j => j.timeToHire);
    return allJobs.reduce((sum, d) => sum + d, 0) / Math.max(1, allJobs.length);
  }
  
  // Calcul de la moyenne
  const delays = similarJobs.map(j => j.timeToHire);
  const average = delays.reduce((sum, d) => sum + d, 0) / delays.length;
  
  return average;
}
```

---

### 4.5 Identification des Goulots d'Étranglement

```typescript
async function identifyBottlenecks(history: CompanyHistory, job: Job): Promise<Bottleneck[]> {
  const bottlenecks: Bottleneck[] = [];
  
  // Analyse des étapes du processus
  const steps = await analyzeProcessSteps(history, job);
  
  for (const step of steps) {
    const averageDuration = step.averageDuration;
    const marketBenchmark = await getStepBenchmark(step.type);
    
    const ratio = averageDuration / marketBenchmark;
    
    if (ratio > 1.5) {
      bottlenecks.push({
        step: step.type,
        averageDuration,
        marketBenchmark,
        ratio,
        severity: ratio > 2.5 ? 'critical' : ratio > 2 ? 'high' : 'medium',
        impact: await calculateStepImpact(step)
      });
    }
  }
  
  // Tri par impact décroissant
  bottlenecks.sort((a, b) => b.impact - a.impact);
  
  return bottlenecks;
}

async function analyzeProcessSteps(history: CompanyHistory, job: Job): Promise<ProcessStep[]> {
  const steps: ProcessStep[] = [
    {
      type: 'screening',
      averageDuration: await calculateStepDuration(history, 'screening', job)
    },
    {
      type: 'first_interview',
      averageDuration: await calculateStepDuration(history, 'first_interview', job)
    },
    {
      type: 'technical_interview',
      averageDuration: await calculateStepDuration(history, 'technical_interview', job)
    },
    {
      type: 'final_interview',
      averageDuration: await calculateStepDuration(history, 'final_interview', job)
    },
    {
      type: 'offer',
      averageDuration: await calculateStepDuration(history, 'offer', job)
    }
  ];
  
  return steps;
}

async function calculateStepDuration(history: CompanyHistory, stepType: string, job: Job): Promise<number> {
  const stepData = history.steps.filter(s => 
    s.type === stepType && 
    s.jobTitle === job.title
  );
  
  if (stepData.length === 0) {
    return 0;
  }
  
  const durations = stepData.map(s => s.duration);
  return durations.reduce((sum, d) => sum + d, 0) / durations.length;
}

async function getStepBenchmark(stepType: string): Promise<number> {
  const benchmarks: Record<string, number> = {
    screening: 3, // 3 jours
    first_interview: 7, // 7 jours
    technical_interview: 10, // 10 jours
    final_interview: 7, // 7 jours
    offer: 5 // 5 jours
  };
  
  return benchmarks[stepType] || 7;
}
```

---

### 4.6 Génération des Recommandations

```typescript
async function generateRecommendations(bottlenecks: Bottleneck[], gap: number): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];
  
  // Recommandations par goulot d'étranglement
  for (const bottleneck of bottlenecks) {
    const stepRecommendations = await getStepRecommendations(bottleneck);
    recommendations.push(...stepRecommendations);
  }
  
  // Recommandations générales
  if (gap > 14) {
    recommendations.push({
      type: 'general',
      priority: 'high',
      action: 'Réduire le nombre d\'étapes du processus',
      expectedImprovement: 7
    });
  }
  
  if (gap > 21) {
    recommendations.push({
      type: 'general',
      priority: 'high',
      action: 'Implémenter un processus de recrutement accéléré pour les profils en tension',
      expectedImprovement: 14
    });
  }
  
  // Tri par priorité et amélioration attendue
  recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.expectedImprovement - a.expectedImprovement;
  });
  
  return recommendations;
}

async function getStepRecommendations(bottleneck: Bottleneck): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];
  
  switch (bottleneck.step) {
    case 'screening':
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Automatiser le screening avec l\'IA',
        expectedImprovement: 2
      });
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Réduire le délai de réponse aux candidats',
        expectedImprovement: 1
      });
      break;
      
    case 'first_interview':
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Programmer les entretiens plus rapidement',
        expectedImprovement: 3
      });
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Réduire le nombre d\'intervenants',
        expectedImprovement: 2
      });
      break;
      
    case 'technical_interview':
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Standardiser les tests techniques',
        expectedImprovement: 2
      });
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Utiliser des entretiens vidéo asynchrones',
        expectedImprovement: 3
      });
      break;
      
    case 'final_interview':
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Impliquer les décideurs plus tôt',
        expectedImprovement: 4
      });
      break;
      
    case 'offer':
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Préparer l\'offre à l\'avance',
        expectedImprovement: 2
      });
      recommendations.push({
        type: 'step',
        priority: bottleneck.severity,
        action: 'Réduire le délai de validation de l\'offre',
        expectedImprovement: 2
      });
      break;
  }
  
  return recommendations;
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface RecruitmentDelayBenchmark {
  jobId: string;
  generatedAt: Date;
  
  marketAverage: number; // jours
  internalHistorical: number; // jours
  gap: number; // jours
  
  gapPercentage: number; // %
  
  bottlenecks: Bottleneck[];
  recommendations: Recommendation[];
  
  estimatedImprovement: number; // jours
}

interface Bottleneck {
  step: string;
  averageDuration: number; // jours
  marketBenchmark: number; // jours
  ratio: number;
  severity: 'medium' | 'high' | 'critical';
  impact: number; // jours
}

interface Recommendation {
  type: 'step' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  expectedImprovement: number; // jours
}

interface DelayData {
  jobTitle: string;
  sector: string;
  location: string;
  experienceLevel: string;
  
  delays: {
    days: number;
    source: string;
    sector: string;
    experienceLevel: string;
  }[];
}

interface CompanyHistory {
  jobs: {
    title: string;
    sector: string;
    experienceLevel: string;
    timeToHire: number;
  }[];
  
  steps: {
    type: string;
    jobTitle: string;
    duration: number;
  }[];
}

interface ProcessStep {
  type: string;
  averageDuration: number;
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE recruitment_delay_benchmark (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  market_average INT NOT NULL,
  internal_historical INT NOT NULL,
  gap INT NOT NULL,
  gap_percentage DECIMAL(5,2) NOT NULL,
  
  bottlenecks JSON NOT NULL,
  recommendations JSON NOT NULL,
  estimated_improvement INT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_delay_benchmark_job ON recruitment_delay_benchmark(job_id);
CREATE INDEX idx_delay_benchmark_date ON recruitment_delay_benchmark(generated_at);

CREATE TABLE delay_data (
  id VARCHAR(36) PRIMARY KEY,
  benchmark_id VARCHAR(36) NOT NULL,
  source VARCHAR(100) NOT NULL,
  
  job_title VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  
  days INT NOT NULL,
  
  collected_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (benchmark_id) REFERENCES recruitment_delay_benchmark(id)
);

CREATE INDEX idx_delay_data_benchmark ON delay_data(benchmark_id);
CREATE INDEX idx_delay_data_source ON delay_data(source);
```

---

## 7. API Endpoints

```typescript
// POST /api/market-intelligence/recruitment-delay
async function benchmarkRecruitmentDelay(jobId: string): Promise<RecruitmentDelayBenchmark> {
  return await benchmarkRecruitmentDelay(jobId);
}

// GET /api/market-intelligence/recruitment-delay/:jobId
async function getRecruitmentDelayBenchmark(jobId: string): Promise<RecruitmentDelayBenchmark> {
  return await getRecruitmentDelayBenchmarkByJobId(jobId);
}

// POST /api/market-intelligence/recruitment-delay/:jobId/refresh
async function refreshRecruitmentDelayBenchmark(jobId: string): Promise<RecruitmentDelayBenchmark> {
  return await benchmarkRecruitmentDelay(jobId);
}

// GET /api/market-intelligence/recruitment-delay/:jobId/history
async function getDelayHistory(jobId: string): Promise<RecruitmentDelayBenchmark[]> {
  return await getHistoricalDelayBenchmarks(jobId);
}

// GET /api/market-intelligence/recruitment-delay/sector/:sector
async function getSectorDelayBenchmark(sector: string): Promise<RecruitmentDelayBenchmark[]> {
  return await getDelayBenchmarkBySector(sector);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de fraîcheur des données | Données < 30 jours / total | ≥ 90% |
| Nombre de sources par benchmark | Sources utilisées / total | ≥ 5 |
| Précision de la prédiction | Précision du délai estimé vs réel | ≥ 85% |
| Satisfaction recruteur | Satisfaction avec le benchmark | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction du délai de recrutement | Réduction après optimisation | ≥ 20% |
| Amélioration de l'expérience candidat | Satisfaction candidat | ≥ 15% |
| Réduction du coût par recrutement | Réduction des coûts | ≥ 10% |

---

## 9. Conclusion

Le benchmark des délais de recrutement fournit le délai moyen du marché pour chaque type de poste et niveau, compare avec les délais internes historiques de l'entreprise, identifie les écarts, et recommande des actions pour accélérer le processus. Le système collecte les données de multiples sources, calcule les délais moyens, identifie les goulots d'étranglement, et recommande des optimisations.

**Points clés :**
- Délais moyens du marché par niveau (junior, confirmé, senior, expert)
- Délais moyens du marché par secteur (tech, finance, marketing, RH, commercial)
- Comparaison avec les délais internes historiques
- Identification des goulots d'étranglement par étape
- Recommandations pour accélérer le processus
- Estimation de l'amélioration attendue
- Données marché en temps réel
