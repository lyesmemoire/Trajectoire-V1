# DOC-012-05 : Tableau de Bord de Couverture KP

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le tableau de bord de couverture du Knowledge Pack pour MVP-012. Ce tableau de bord permet de suivre en temps réel la couverture des métiers, compétences, certifications et synonymes dans le Knowledge Pack.

---

## 2. Principe Fondateur

Le tableau de bord de couverture KP permet de mesurer l'efficacité de l'enrichissement continu. Les métriques de couverture sont mesurées mensuellement sur le golden dataset avec pour objectif une amélioration positive à chaque cycle.

---

## 3. Métriques de Couverture

### 3.1 Métriques Principales

| Métrique | Description | Formule | Cible |
|----------|-------------|---------|-------|
| Couverture métiers | % de postes traités reconnus sans erreur | Postes reconnus / Total postes | ≥ 90% |
| Couverture compétences | % de compétences des CV reconnues | Compétences reconnues / Total compétences | ≥ 85% |
| Taux de synonymes résolus | % de formulations alternatives correctement interprétées | Synonymes résolus / Total synonymes | ≥ 80% |
| Taux de faux négatifs | % de candidats pertinents mal scorés à cause d'un manque KP | Faux négatifs / Total candidats | ≤ 5% |

### 3.2 Métriques Secondaires

| Métrique | Description | Formule | Cible |
|----------|-------------|---------|-------|
| Volume métiers | Nombre total de métiers couverts | Comptage KP-001 | 500+ |
| Volume compétences | Nombre total de compétences couvertes | Comptage KP-002 | 5000+ |
| Volume certifications | Nombre total de certifications couvertes | Comptage KP-002 | 200+ |
| Volume synonymes | Nombre total de synonymes couverts | Comptage KP-002 | 3000+ |
| Relations concepts | Nombre total de relations entre concepts | Comptage KP-001 + KP-002 | 10000+ |

---

## 4. Structure du Tableau de Bord

### 4.1 Vue d'Ensemble

```
┌─────────────────────────────────────────┐
│ TABLEAU DE BORD DE COUVERTURE KP       │
├─────────────────────────────────────────┤
│                                         │
| Dernière mise à jour : [DD/MM/YYYY HH:MM]│
| Version KP : [X.X.X]                    │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ MÉTRIQUES PRINCIPALES                  │
├─────────────────────────────────────────┤
│                                         │
│ Couverture métiers                      │
│ ████████████████████░░ 85%            │
| Cible : 90%                            │
│ Évolution : +2% vs mois dernier         │
│                                         │
│ Couverture compétences                  │
│ ██████████████████░░░░ 78%            │
| Cible : 85%                            │
| Évolution : +3% vs mois dernier         │
│                                         │
│ Taux de synonymes résolus              │
│ ████████████████████░░ 82%            │
| Cible : 80%                            │
| Évolution : +5% vs mois dernier         │
│                                         │
│ Taux de faux négatifs                  │
│ ███░░░░░░░░░░░░░░░░░░░░ 6%           │
| Cible : ≤ 5%                           │
| Évolution : -1% vs mois dernier         │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ MÉTRIQUES SECONDAIRES                  │
├─────────────────────────────────────────┤
│                                         │
│ Volume métiers : 487 / 500 (97%)       │
│ Volume compétences : 4235 / 5000 (85%) │
│ Volume certifications : 187 / 200 (94%)  │
│ Volume synonymes : 2876 / 3000 (96%)    │
│ Relations concepts : 8942 / 10000 (89%) │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 Vue par Source

```
┌─────────────────────────────────────────┐
│ COUVERTURE PAR SOURCE                  │
├─────────────────────────────────────────┤
│                                         │
│ ROME 4.0                               │
│ • Métiers : 531 / 531 (100%)          │
│ • Compétences : 1247 / 1247 (100%)     │
│ • Synonymes : 892 / 892 (100%)        │
│ • Relations : 2341 / 2341 (100%)       │
│                                         │
│ ESCO v1.1                              │
│ • Compétences : 13890 / 13890 (100%)   │
│ • Synonymes : 4521 / 4521 (100%)      │
│ • Relations : 8765 / 8765 (100%)       │
│                                         │
│ RNCP/RS                                │
│ • Certifications : 187 / 200 (94%)     │
│ • Diplômes : 98 / 100 (98%)            │
│ • Équivalences : 234 / 250 (94%)       │
│                                         │
│ OPCO                                   │
│ • Certifications : 45 / 50 (90%)       │
│ • Diplômes : 23 / 25 (92%)             │
│ • Normes : 12 / 15 (80%)               │
│                                         │
│ Synonymes terrain                       │
│ • Synonymes : 2876 / 3000 (96%)       │
│ • Jargon métier : 543 / 600 (91%)      │
│                                         │
└─────────────────────────────────────────┘
```

### 4.3 Vue Temporelle

```
┌─────────────────────────────────────────┐
│ ÉVOLUTION TEMPORELLE                  │
├─────────────────────────────────────────┤
│                                         │
│ Couverture métiers (6 derniers mois)   │
│                                         │
│ 100% ┤                                 │
│  90% ┤     ●───●                      │
│  80% ┤   ●       ●───●                │
│  70% ┤ ●             ●───●             │
│  60% ┤                                 │
│      └────────────────────────         │
│        J  F  M  A  M  J                │
│                                         │
│ Couverture compétences (6 derniers mois)│
│                                         │
│ 100% ┤                                 │
|  90% ┤                                 │
│  80% ┤     ●───●                      │
│  70% ┤   ●       ●───●                │
│  60% ┤ ●             ●───●             │
│  50% ┤                                 │
│      └────────────────────────         │
│        J  F  M  A  M  J                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface KPCoverageDashboard {
  metadata: {
    lastUpdated: Date;
    kpVersion: string;
    dashboardVersion: string;
  };
  
  primaryMetrics: {
    jobsCoverage: {
      value: number;
      target: number;
      evolution: number;
      trend: 'up' | 'down' | 'stable';
    };
    skillsCoverage: {
      value: number;
      target: number;
      evolution: number;
      trend: 'up' | 'down' | 'stable';
    };
    synonymsResolutionRate: {
      value: number;
      target: number;
      evolution: number;
      trend: 'up' | 'down' | 'stable';
    };
    falseNegativeRate: {
      value: number;
      target: number;
      evolution: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  
  secondaryMetrics: {
    jobsVolume: {
      current: number;
      target: number;
      percentage: number;
    };
    skillsVolume: {
      current: number;
      target: number;
      percentage: number;
    };
    certificationsVolume: {
      current: number;
      target: number;
      percentage: number;
    };
    synonymsVolume: {
      current: number;
      target: number;
      percentage: number;
    };
    relationsVolume: {
      current: number;
      target: number;
      percentage: number;
    };
  };
  
  sourceCoverage: {
    rome: {
      jobs: { current: number; total: number; percentage: number };
      skills: { current: number; total: number; percentage: number };
      synonyms: { current: number; total: number; percentage: number };
      relations: { current: number; total: number; percentage: number };
    };
    esco: {
      skills: { current: number; total: number; percentage: number };
      synonyms: { current: number; total: number; percentage: number };
      relations: { current: number; total: number; percentage: number };
    };
    rncp: {
      certifications: { current: number; total: number; percentage: number };
      diplomas: { current: number; total: number; percentage: number };
      equivalences: { current: number; total: number; percentage: number };
    };
    opco: {
      certifications: { current: number; total: number; percentage: number };
      diplomas: { current: number; total: number; percentage: number };
      norms: { current: number; total: number; percentage: number };
    };
    terrain: {
      synonyms: { current: number; total: number; percentage: number };
      jargon: { current: number; total: number; percentage: number };
    };
  };
  
  temporalEvolution: {
    jobsCoverage: {
      month: string;
      value: number;
    }[];
    skillsCoverage: {
      month: string;
      value: number;
    }[];
    synonymsResolutionRate: {
      month: string;
      value: number;
    }[];
    falseNegativeRate: {
      month: string;
      value: number;
    }[];
  };
}
```

---

## 6. Calcul des Métriques

### 6.1 Couverture Métiers

```typescript
async function calculateJobsCoverage(): Promise<number> {
  // Récupérer les postes traités du golden dataset
  const jobs = await getGoldenDatasetJobs();
  
  let recognizedCount = 0;
  
  for (const job of jobs) {
    const recognized = await recognizeJob(job.title, KP001);
    if (recognized) {
      recognizedCount++;
    }
  }
  
  return (recognizedCount / jobs.length) * 100;
}
```

### 6.2 Couverture Compétences

```typescript
async function calculateSkillsCoverage(): Promise<number> {
  // Récupérer les compétences des CV du golden dataset
  const cvs = await getGoldenDatasetCVs();
  
  let totalSkills = 0;
  let recognizedSkills = 0;
  
  for (const cv of cvs) {
    const extractedSkills = await extractSkillsFromCV(cv.content);
    totalSkills += extractedSkills.length;
    
    for (const skill of extractedSkills) {
      const recognized = await recognizeSkill(skill, KP002);
      if (recognized) {
        recognizedSkills++;
      }
    }
  }
  
  return totalSkills > 0 ? (recognizedSkills / totalSkills) * 100 : 0;
}
```

### 6.3 Taux de Synonymes Résolus

```typescript
async function calculateSynonymsResolutionRate(): Promise<number> {
  // Récupérer les synonymes du golden dataset
  const synonyms = await getGoldenDatasetSynonyms();
  
  let resolvedCount = 0;
  
  for (const synonym of synonyms) {
    const resolved = await resolveSynonym(synonym.term, KP002);
    if (resolved) {
      resolvedCount++;
    }
  }
  
  return (resolvedCount / synonyms.length) * 100;
}
```

### 6.4 Taux de Faux Négatifs

```typescript
async function calculateFalseNegativeRate(): Promise<number> {
  // Récupérer les paires CV/Offre du golden dataset
  const pairs = await getGoldenDatasetPairs();
  
  let falseNegatives = 0;
  
  for (const pair of pairs) {
    const matchingResult = await matchCVWithJob(pair.cvId, pair.jobPostingId);
    
    // Si le candidat est pertinent mais mal scoré
    if (pair.expectedDecision === 'accept' && matchingResult.decision === 'reject') {
      // Vérifier si c'est dû à un manque de KP
      const isKPLimitation = await checkIfKPLimitation(matchingResult);
      if (isKPLimitation) {
        falseNegatives++;
      }
    }
  }
  
  return (falseNegatives / pairs.length) * 100;
}
```

---

## 7. Mise à Jour du Tableau de Bord

### 7.1 Fréquence de Mise à Jour

| Métrique | Fréquence |
|----------|-----------|
| Métriques principales | Mensuelle (après enrichissement) |
| Métriques secondaires | Mensuelle (après enrichissement) |
| Vue par source | Mensuelle (après enrichissement) |
| Vue temporelle | Mensuelle (après enrichissement) |

### 7.2 Processus de Mise à Jour

```typescript
async function updateDashboard(): Promise<void> {
  // Calcul des métriques principales
  const jobsCoverage = await calculateJobsCoverage();
  const skillsCoverage = await calculateSkillsCoverage();
  const synonymsResolutionRate = await calculateSynonymsResolutionRate();
  const falseNegativeRate = await calculateFalseNegativeRate();
  
  // Calcul des métriques secondaires
  const jobsVolume = await calculateJobsVolume();
  const skillsVolume = await calculateSkillsVolume();
  const certificationsVolume = await calculateCertificationsVolume();
  const synonymsVolume = await calculateSynonymsVolume();
  const relationsVolume = await calculateRelationsVolume();
  
  // Calcul de la couverture par source
  const sourceCoverage = await calculateSourceCoverage();
  
  // Calcul de l'évolution temporelle
  const temporalEvolution = await calculateTemporalEvolution();
  
  // Construction du tableau de bord
  const dashboard: KPCoverageDashboard = {
    metadata: {
      lastUpdated: new Date(),
      kpVersion: await getKPVersion(),
      dashboardVersion: '1.0'
    },
    primaryMetrics: {
      jobsCoverage: {
        value: jobsCoverage,
        target: 90,
        evolution: await calculateEvolution('jobsCoverage'),
        trend: await calculateTrend('jobsCoverage')
      },
      skillsCoverage: {
        value: skillsCoverage,
        target: 85,
        evolution: await calculateEvolution('skillsCoverage'),
        trend: await calculateTrend('skillsCoverage')
      },
      synonymsResolutionRate: {
        value: synonymsResolutionRate,
        target: 80,
        evolution: await calculateEvolution('synonymsResolutionRate'),
        trend: await calculateTrend('synonymsResolutionRate')
      },
      falseNegativeRate: {
        value: falseNegativeRate,
        target: 5,
        evolution: await calculateEvolution('falseNegativeRate'),
        trend: await calculateTrend('falseNegativeRate')
      }
    },
    secondaryMetrics: {
      jobsVolume,
      skillsVolume,
      certificationsVolume,
      synonymsVolume,
      relationsVolume
    },
    sourceCoverage,
    temporalEvolution
  };
  
  // Sauvegarde du tableau de bord
  await saveDashboard(dashboard);
  
  // Notification si les cibles ne sont pas atteintes
  await notifyIfTargetsNotMet(dashboard);
}
```

---

## 8. Alertes et Notifications

### 8.1 Critères d'Alerte

| Condition | Niveau d'alerte | Action |
|-----------|-----------------|--------|
| Couverture métiers < 80% | Critique | Notification immédiate |
| Couverture compétences < 75% | Critique | Notification immédiate |
| Taux de synonymes résolus < 70% | Élevée | Notification quotidienne |
| Taux de faux négatifs > 10% | Critique | Notification immédiate |
| Évolution négative > 5% | Élevée | Notification hebdomadaire |

### 8.2 Algorithme d'Alerte

```typescript
async function checkAlerts(dashboard: KPCoverageDashboard): Promise<void> {
  const alerts: Alert[] = [];
  
  // Vérification de la couverture métiers
  if (dashboard.primaryMetrics.jobsCoverage.value < 80) {
    alerts.push({
      metric: 'jobsCoverage',
      level: 'critical',
      value: dashboard.primaryMetrics.jobsCoverage.value,
      target: dashboard.primaryMetrics.jobsCoverage.target,
      message: 'Couverture métiers critique'
    });
  }
  
  // Vérification de la couverture compétences
  if (dashboard.primaryMetrics.skillsCoverage.value < 75) {
    alerts.push({
      metric: 'skillsCoverage',
      level: 'critical',
      value: dashboard.primaryMetrics.skillsCoverage.value,
      target: dashboard.primaryMetrics.skillsCoverage.target,
      message: 'Couverture compétences critique'
    });
  }
  
  // Vérification du taux de synonymes résolus
  if (dashboard.primaryMetrics.synonymsResolutionRate.value < 70) {
    alerts.push({
      metric: 'synonymsResolutionRate',
      level: 'high',
      value: dashboard.primaryMetrics.synonymsResolutionRate.value,
      target: dashboard.primaryMetrics.synonymsResolutionRate.target,
      message: 'Taux de synonymes résolus faible'
    });
  }
  
  // Vérification du taux de faux négatifs
  if (dashboard.primaryMetrics.falseNegativeRate.value > 10) {
    alerts.push({
      metric: 'falseNegativeRate',
      level: 'critical',
      value: dashboard.primaryMetrics.falseNegativeRate.value,
      target: dashboard.primaryMetrics.falseNegativeRate.target,
      message: 'Taux de faux négatifs critique'
    });
  }
  
  // Vérification de l'évolution
  if (dashboard.primaryMetrics.jobsCoverage.evolution < -5) {
    alerts.push({
      metric: 'jobsCoverage',
      level: 'high',
      value: dashboard.primaryMetrics.jobsCoverage.evolution,
      message: 'Évolution négative significative'
    });
  }
  
  // Notification des alertes
  for (const alert of alerts) {
    await notifyAlert(alert);
  }
  
  // Sauvegarde des alertes
  await saveAlerts(alerts);
}
```

---

## 9. Interface Utilisateur

### 9.1 Mockup de l'Interface

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ TRAJECTOIRE - Tableau de Bord de Couverture KP                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Métriques Principales                                                      │ │
│ ├─────────────────────────────────────────────────────────────────────────────┤ │
│ │                                                                             │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │ │
│ │ │ Métiers     │ │ Compétences │ │ Synonymes   │ │ Faux négatifs│            │ │
│ │ │ 85%         │ │ 78%         │ │ 82%         │ │ 6%          │            │ │
│ │ │ ▲ 2%        │ │ ▲ 3%        │ │ ▲ 5%        │ │ ▼ 1%        │            │ │
│ │ │ Cible: 90%  │ │ Cible: 85%  │ │ Cible: 80%  │ │ Cible: ≤5%  │            │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │ │
│ │                                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Volume par Catégorie                                                       │ │
│ ├─────────────────────────────────────────────────────────────────────────────┤ │
│ │                                                                             │ │
│ │ Métiers        : 487 / 500 (97%)  ████████████████████████░░              │ │
│ │ Compétences    : 4235 / 5000 (85%) ██████████████████░░░░░░░░              │ │
│ │ Certifications : 187 / 200 (94%)  ████████████████████████░░              │ │
│ │ Synonymes      : 2876 / 3000 (96%) ████████████████████████░░              │ │
│ │ Relations      : 8942 / 10000 (89%) ████████████████████░░░░░              │ │
│ │                                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Évolution (6 derniers mois)                                                 │ │
│ ├─────────────────────────────────────────────────────────────────────────────┤ │
│ │                                                                             │ │
│ │ 100% ┤                                                                      │ │
│ │  90% ┤     ●───●                                                           │ │
│ │  80% ┤   ●       ●───●                                                      │ │
│ │  70% ┤ ●             ●───●                                                   │ │
│ │  60% ┤                                                                      │ │
│ │      └────────────────────────                                             │ │
│ │        J  F  M  A  M  J                                                    │ │
│ │                                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ Dernière mise à jour : 03/08/2026 17:30                                      │
│ Version KP : 1.2.3                                                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Stockage des Données

### 10.1 Schéma SQL

```sql
CREATE TABLE kp_coverage_dashboard (
  id VARCHAR(36) PRIMARY KEY,
  dashboard_date TIMESTAMP NOT NULL,
  kp_version VARCHAR(20) NOT NULL,
  
  jobs_coverage DECIMAL(5,2) NOT NULL,
  jobs_coverage_target DECIMAL(5,2) NOT NULL,
  jobs_coverage_evolution DECIMAL(5,2) NOT NULL,
  
  skills_coverage DECIMAL(5,2) NOT NULL,
  skills_coverage_target DECIMAL(5,2) NOT NULL,
  skills_coverage_evolution DECIMAL(5,2) NOT NULL,
  
  synonyms_resolution_rate DECIMAL(5,2) NOT NULL,
  synonyms_resolution_rate_target DECIMAL(5,2) NOT NULL,
  synonyms_resolution_rate_evolution DECIMAL(5,2) NOT NULL,
  
  false_negative_rate DECIMAL(5,2) NOT NULL,
  false_negative_rate_target DECIMAL(5,2) NOT NULL,
  false_negative_rate_evolution DECIMAL(5,2) NOT NULL,
  
  jobs_volume_current INT NOT NULL,
  jobs_volume_target INT NOT NULL,
  jobs_volume_percentage DECIMAL(5,2) NOT NULL,
  
  skills_volume_current INT NOT NULL,
  skills_volume_target INT NOT NULL,
  skills_volume_percentage DECIMAL(5,2) NOT NULL,
  
  certifications_volume_current INT NOT NULL,
  certifications_volume_target INT NOT NULL,
  certifications_volume_percentage DECIMAL(5,2) NOT NULL,
  
  synonyms_volume_current INT NOT NULL,
  synonyms_volume_target INT NOT NULL,
  synonyms_volume_percentage DECIMAL(5,2) NOT NULL,
  
  relations_volume_current INT NOT NULL,
  relations_volume_target INT NOT NULL,
  relations_volume_percentage DECIMAL(5,2) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dashboard_date ON kp_coverage_dashboard(dashboard_date);
CREATE INDEX idx_dashboard_version ON kp_coverage_dashboard(kp_version);
```

---

## 11. Accès et Permissions

### 11.1 Rôles et Permissions

| Rôle | Lecture | Écriture | Administration |
|------|---------|----------|----------------|
| DRH référent | ✅ | ❌ | ❌ |
| Référent Formation | ✅ | ❌ | ❌ |
| Équipe technique | ✅ | ❌ | ❌ |
| Équipe produit | ✅ | ✅ | ❌ |
| Administrateur | ✅ | ✅ | ✅ |

### 11.2 API Endpoints

```typescript
// GET /api/kp-coverage/dashboard
async function getDashboard(): Promise<KPCoverageDashboard> {
  return await getLatestDashboard();
}

// GET /api/kp-coverage/dashboard/history
async function getDashboardHistory(months: number): Promise<KPCoverageDashboard[]> {
  return await getDashboardHistory(months);
}

// POST /api/kp-coverage/dashboard/refresh
async function refreshDashboard(): Promise<KPCoverageDashboard> {
  await updateDashboard();
  return await getLatestDashboard();
}

// GET /api/kp-coverage/alerts
async function getAlerts(): Promise<Alert[]> {
  return await getLatestAlerts();
}
```

---

## 12. Indicateurs de Suivi

### 12.1 Métriques du Tableau de Bord

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de mise à jour | Mises à jour réussies / total | 100% |
| Latence de mise à jour | Temps de mise à jour | < 5 minutes |
| Disponibilité | Disponibilité du tableau de bord | ≥ 99.5% |
| Précision des données | Précision des métriques calculées | 100% |

---

## 13. Conclusion

Le tableau de bord de couverture KP permet de suivre en temps réel la couverture du Knowledge Pack et de mesurer l'efficacité de l'enrichissement continu. Les métriques sont mesurées mensuellement sur le golden dataset avec pour objectif une amélioration positive à chaque cycle.

**Points clés :**
- 4 métriques principales (couverture métiers, compétences, synonymes, faux négatifs)
- 5 métriques secondaires (volume par catégorie)
- Vue par source (ROME, ESCO, RNCP, OPCO, terrain)
- Vue temporelle (évolution sur 6 mois)
- Alertes automatiques si les cibles ne sont pas atteintes
- Interface utilisateur intuitive
- API endpoints pour l'accès programmatique
