# DOC-022-04 : Rapport D&I et Indicateurs

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de rapport D&I et indicateurs pour MVP-022 Diversity & Inclusion Engine. Ce système produit des rapports D&I par recrutement (profil de diversité du pipeline, taux de sélection par étape, décision finale et profil retenu, écarts détectés et actions correctives) et des rapports périodiques pour l'entreprise (évolution de la diversité des recrutements, comparaison avec les objectifs D&I, recommandations d'amélioration).

---

## 2. Principe Fondateur

Pour chaque recrutement finalisé, le moteur produit un rapport D&I complet incluant le profil de diversité du pipeline, le taux de sélection par étape, la décision finale et le profil retenu, les écarts détectés et les actions correctives. Pour l'entreprise sur une période, le moteur produit un rapport périodique incluant l'évolution de la diversité des recrutements, la comparaison avec les objectifs D&I, et les recommandations d'amélioration.

---

## 3. Rapport D&I par Recrutement

### 3.1 Profil de Diversité du Pipeline

**Description :**
Analyse de la diversité du pipeline de candidats pour un recrutement spécifique.

**Dimensions analysées :**
- Genre (homme, femme, non-binaire, préfère ne pas dire)
- Âge (tranches d'âge)
- Éducation (grandes écoles, universités, IUT, alternance, autodidactes)
- Handicap (avec handicap, sans handicap, préfère ne pas dire)
- Origine socio-économique (quartier prioritaire, non prioritaire, préfère ne pas dire)

**Visualisation :**
- Graphiques de distribution par dimension
- Comparaison avec la population active
- Comparaison avec les recrutements précédents

---

### 3.2 Taux de Sélection par Étape

**Description :**
Analyse du taux de sélection par étape du processus de recrutement.

**Étapes analysées :**
- Candidatures reçues
- Sélection CV
- Entretien
- Décision finale

**Calcul :**
- Taux de sélection = (nombre de candidats passés à l'étape suivante) / (nombre total de candidats à l'étape actuelle)
- Taux de sélection par groupe = (nombre de candidats du groupe passés à l'étape suivante) / (nombre total de candidats du groupe à l'étape actuelle)

**Alertes :**
- Écart significatif entre groupes (test du chi-carré)
- Taux de sélection anormalement bas pour un groupe
- Taux de sélection anormalement élevé pour un groupe

---

### 3.3 Décision Finale et Profil Retenu

**Description :**
Analyse de la décision finale et du profil du candidat retenu.

**Informations incluses :**
- Profil de diversité du candidat retenu
- Justification de la décision
- Critères objectifs utilisés
- Comparaison avec les autres candidats en finale

**Analyse :**
- Vérification que la décision est basée sur des critères objectifs
- Identification des éléments non pertinents dans la décision
- Comparaison du profil retenu avec la diversité du pipeline

---

### 3.4 Écarts Détectés et Actions Correctives

**Description :**
Identification des écarts détectés lors du processus et recommandation d'actions correctives.

**Types d'écarts :**
- Écart de sélection par groupe
- Écart de langage genré dans l'offre
- Écart de critères non pertinents
- Écart de questions inadaptées
- Écart de cotation biaisée

**Actions correctives :**
- Reformulation de l'offre d'emploi
- Suppression de critères non pertinents
- Mise en place de CV anonymisé
- Révision de la grille d'évaluation
- Formation des recruteurs sur les biais

---

## 4. Rapport D&I Périodique

### 4.1 Évolution de la Diversité des Recrutements

**Description :**
Analyse de l'évolution de la diversité des recrutements sur une période (mensuel, trimestriel, annuel).

**Dimensions analysées :**
- Genre
- Âge
- Éducation
- Handicap
- Origine socio-économique

**Visualisation :**
- Graphiques d'évolution temporelle
- Tendances sur la période
- Comparaison avec la période précédente

---

### 4.2 Comparaison avec les Objectifs D&I

**Description :**
Comparaison des résultats D&I avec les objectifs définis par l'entreprise.

**Objectifs typiques :**
- % de femmes dans les recrutements
- % de personnes en situation de handicap
- % de candidats issus des quartiers prioritaires
- % de candidats issus de filières diverses

**Calcul :**
- Écart = (résultat actuel) - (objectif)
- % de réalisation = (résultat actuel) / (objectif) * 100

**Visualisation :**
- Graphiques de comparaison
- Indicateurs de progression
- Alertes si écart significatif

---

### 4.3 Recommandations d'Amélioration

**Description :**
Recommandations d'amélioration basées sur l'analyse des écarts et des tendances.

**Types de recommandations :**
- Recommandations de sourcing (viviers à explorer)
- Recommandations de processus (ajustements du processus)
- Recommandations de formation (formation des recruteurs)
- Recommandations de communication (communication sur la diversité)

**Priorisation :**
- Haute priorité : écarts significatifs par rapport aux objectifs
- Moyenne priorité : tendances négatives
- Basse priorité : améliorations continues

---

## 5. Algorithme de Génération de Rapport

### 5.1 Processus Global

```typescript
async function generateDIReport(recruitmentId: string): Promise<DIReport> {
  // 1. Récupération des données du recrutement
  const recruitment = await getRecruitment(recruitmentId);
  
  // 2. Analyse du profil de diversité du pipeline
  const pipelineDiversityProfile = await analyzePipelineDiversityProfile(recruitment);
  
  // 3. Calcul des taux de sélection par étape
  const selectionRatesByStage = await calculateSelectionRatesByStage(recruitment);
  
  // 4. Analyse de la décision finale
  const finalDecision = await analyzeFinalDecision(recruitment);
  
  // 5. Détection des écarts
  const detectedGaps = await detectGaps(recruitment);
  
  // 6. Génération des actions correctives
  const correctiveActions = await generateCorrectiveActions(detectedGaps);
  
  // 7. Construction du rapport
  const report: DIReport = {
    reportId: generateReportId(),
    recruitmentId,
    generatedAt: new Date(),
    
    pipelineDiversityProfile,
    selectionRatesByStage,
    
    finalDecision,
    
    detectedGaps,
    correctiveActions
  };
  
  // 8. Sauvegarde du rapport
  await saveDIReport(report);
  
  return report;
}
```

---

### 5.2 Analyse du Profil de Diversité du Pipeline

```typescript
async function analyzePipelineDiversityProfile(recruitment: Recruitment): Promise<DiversityProfile> {
  const candidates = recruitment.candidates;
  
  const diversityProfile: DiversityProfile = {
    gender: {
      male: 0,
      female: 0,
      nonBinary: 0,
      preferNotToSay: 0
    },
    
    age: {
      under25: 0,
      age25to34: 0,
      age35to44: 0,
      age45to54: 0,
      age55plus: 0
    },
    
    education: {
      grandesEcoles: 0,
      universities: 0,
      iut: 0,
      alternance: 0,
      autodidactes: 0
    },
    
    disability: {
      withDisability: 0,
      withoutDisability: 0,
      preferNotToSay: 0
    },
    
    socioeconomic: {
      priorityArea: 0,
      nonPriorityArea: 0,
      preferNotToSay: 0
    }
  };
  
  // Calcul par genre
  for (const candidate of candidates) {
    switch (candidate.gender) {
      case 'male':
        diversityProfile.gender.male++;
        break;
      case 'female':
        diversityProfile.gender.female++;
        break;
      case 'nonBinary':
        diversityProfile.gender.nonBinary++;
        break;
      case 'preferNotToSay':
        diversityProfile.gender.preferNotToSay++;
        break;
    }
  }
  
  // Calcul par âge
  for (const candidate of candidates) {
    switch (candidate.ageGroup) {
      case 'under25':
        diversityProfile.age.under25++;
        break;
      case 'age25to34':
        diversityProfile.age.age25to34++;
        break;
      case 'age35to44':
        diversityProfile.age.age35to44++;
        break;
      case 'age45to54':
        diversityProfile.age.age45to54++;
        break;
      case 'age55plus':
        diversityProfile.age.age55plus++;
        break;
    }
  }
  
  // Calcul par éducation
  for (const candidate of candidates) {
    switch (candidate.educationType) {
      case 'grandesEcoles':
        diversityProfile.education.grandesEcoles++;
        break;
      case 'universities':
        diversityProfile.education.universities++;
        break;
      case 'iut':
        diversityProfile.education.iut++;
        break;
      case 'alternance':
        diversityProfile.education.alternance++;
        break;
      case 'autodidactes':
        diversityProfile.education.autodidactes++;
        break;
    }
  }
  
  // Calcul par handicap
  for (const candidate of candidates) {
    switch (candidate.disabilityStatus) {
      case 'withDisability':
        diversityProfile.disability.withDisability++;
        break;
      case 'withoutDisability':
        diversityProfile.disability.withoutDisability++;
        break;
      case 'preferNotToSay':
        diversityProfile.disability.preferNotToSay++;
        break;
    }
  }
  
  // Calcul par origine socio-économique
  for (const candidate of candidates) {
    switch (candidate.socioeconomicOrigin) {
      case 'priorityArea':
        diversityProfile.socioeconomic.priorityArea++;
        break;
      case 'nonPriorityArea':
        diversityProfile.socioeconomic.nonPriorityArea++;
        break;
      case 'preferNotToSay':
        diversityProfile.socioeconomic.preferNotToSay++;
        break;
    }
  }
  
  return diversityProfile;
}
```

---

### 5.3 Calcul des Taux de Sélection par Étape

```typescript
async function calculateSelectionRatesByStage(recruitment: Recruitment): Promise<SelectionRatesByStage[]> {
  const selectionRates: SelectionRatesByStage[] = [];
  
  const stages = ['received', 'cvSelection', 'interview', 'finalDecision'];
  
  for (let i = 0; i < stages.length - 1; i++) {
    const currentStage = stages[i];
    const nextStage = stages[i + 1];
    
    const currentStageCandidates = recruitment.candidates.filter(c => c.stage === currentStage);
    const nextStageCandidates = recruitment.candidates.filter(c => c.stage === nextStage);
    
    const stageDiversityProfile = await analyzeDiversityProfile(currentStageCandidates);
    
    selectionRates.push({
      stage: currentStage,
      totalCandidates: currentStageCandidates.length,
      diversityProfile: stageDiversityProfile,
      selectionRate: currentStageCandidates.length > 0 
        ? nextStageCandidates.length / currentStageCandidates.length 
        : 0
    });
  }
  
  return selectionRates;
}
```

---

### 5.4 Génération de Rapport Périodique

```typescript
async function generatePeriodicDIReport(periodStart: Date, periodEnd: Date): Promise<PeriodicDIReport> {
  // 1. Récupération des recrutements sur la période
  const recruitments = await getRecruitmentsByPeriod(periodStart, periodEnd);
  
  // 2. Calcul de l'évolution de la diversité
  const diversityEvolution = await calculateDiversityEvolution(recruitments, periodStart, periodEnd);
  
  // 3. Récupération des objectifs D&I
  const diObjectives = await getDIObjectives();
  
  // 4. Comparaison avec les objectifs
  const comparisonWithObjectives = await compareWithObjectives(diversityEvolution, diObjectives);
  
  // 5. Génération des recommandations d'amélioration
  const improvementRecommendations = await generateImprovementRecommendations(comparisonWithObjectives);
  
  // 6. Construction du rapport
  const report: PeriodicDIReport = {
    reportId: generateReportId(),
    periodStart,
    periodEnd,
    generatedAt: new Date(),
    
    recruitmentCount: recruitments.length,
    
    diversityEvolution,
    
    comparisonWithObjectives,
    
    improvementRecommendations
  };
  
  // 7. Sauvegarde du rapport
  await savePeriodicDIReport(report);
  
  return report;
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface DIReport {
  reportId: string;
  recruitmentId: string;
  generatedAt: Date;
  
  pipelineDiversityProfile: DiversityProfile;
  selectionRatesByStage: SelectionRatesByStage[];
  
  finalDecision: {
    selectedProfile: DiversityProfile;
    justification: string;
  };
  
  detectedGaps: string[];
  correctiveActions: string[];
}

interface DiversityProfile {
  gender: {
    male: number;
    female: number;
    nonBinary: number;
    preferNotToSay: number;
  };
  
  age: {
    under25: number;
    age25to34: number;
    age35to44: number;
    age45to54: number;
    age55plus: number;
  };
  
  education: {
    grandesEcoles: number;
    universities: number;
    iut: number;
    alternance: number;
    autodidactes: number;
  };
  
  disability: {
    withDisability: number;
    withoutDisability: number;
    preferNotToSay: number;
  };
  
  socioeconomic: {
    priorityArea: number;
    nonPriorityArea: number;
    preferNotToSay: number;
  };
}

interface SelectionRatesByStage {
  stage: string;
  totalCandidates: number;
  diversityProfile: DiversityProfile;
  selectionRate: number;
}

interface PeriodicDIReport {
  reportId: string;
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
  
  recruitmentCount: number;
  
  diversityEvolution: {
    period: string;
    diversityProfile: DiversityProfile;
  }[];
  
  comparisonWithObjectives: {
    objective: string;
    target: number;
    actual: number;
    gap: number;
  }[];
  
  improvementRecommendations: string[];
}

interface DIObjectives {
  objectiveId: string;
  name: string;
  target: number; // %
  category: 'gender' | 'disability' | 'socioeconomic' | 'education';
  period: 'monthly' | 'quarterly' | 'annual';
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE di_report (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  pipeline_diversity_profile JSON NOT NULL,
  selection_rates_by_stage JSON NOT NULL,
  
  final_decision JSON NOT NULL,
  
  detected_gaps JSON NOT NULL,
  corrective_actions JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (recruitment_id) REFERENCES recruitments(id)
);

CREATE INDEX idx_di_report_recruitment ON di_report(recruitment_id);
CREATE INDEX idx_di_report_date ON di_report(generated_at);

CREATE TABLE periodic_di_report (
  id VARCHAR(36) PRIMARY KEY,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  recruitment_count INT NOT NULL,
  
  diversity_evolution JSON NOT NULL,
  
  comparison_with_objectives JSON NOT NULL,
  
  improvement_recommendations JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_periodic_di_report_period ON periodic_di_report(period_start, period_end);
CREATE INDEX idx_periodic_di_report_date ON periodic_di_report(generated_at);

CREATE TABLE di_objectives (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  target DECIMAL(5,2) NOT NULL CHECK (target >= 0 AND target <= 100),
  category VARCHAR(50) NOT NULL CHECK (category IN ('gender', 'disability', 'socioeconomic', 'education')),
  period VARCHAR(50) NOT NULL CHECK (period IN ('monthly', 'quarterly', 'annual')),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_di_objectives_category ON di_objectives(category);
CREATE INDEX idx_di_objectives_period ON di_objectives(period);
```

---

## 8. API Endpoints

```typescript
// POST /api/diversity-inclusion/report
async function generateDIReport(recruitmentId: string): Promise<DIReport> {
  return await generateDIReport(recruitmentId);
}

// GET /api/diversity-inclusion/report/:reportId
async function getDIReport(reportId: string): Promise<DIReport> {
  return await getDIReportById(reportId);
}

// GET /api/diversity-inclusion/report/recruitment/:recruitmentId
async function getDIReportByRecruitment(recruitmentId: string): Promise<DIReport> {
  return await getDIReportByRecruitmentId(recruitmentId);
}

// POST /api/diversity-inclusion/report/periodic
async function generatePeriodicDIReport(periodStart: Date, periodEnd: Date): Promise<PeriodicDIReport> {
  return await generatePeriodicDIReport(periodStart, periodEnd);
}

// GET /api/diversity-inclusion/report/periodic/:reportId
async function getPeriodicDIReport(reportId: string): Promise<PeriodicDIReport> {
  return await getPeriodicDIReportById(reportId);
}

// GET /api/diversity-inclusion/objectives
async function getDIObjectives(): Promise<DIObjectives[]> {
  return await getAllDIObjectives();
}

// POST /api/diversity-inclusion/objectives
async function createDIObjective(objective: DIObjectives): Promise<DIObjectives> {
  return await createDIObjective(objective);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération de rapports | Recrutements avec rapport / total | ≥ 90% |
| Taux de détection d'écarts | Écarts détectés / audits | ≥ 70% |
| Taux de correction | Actions correctives appliquées / total | ≥ 60% |
| Satisfaction DRH | Satisfaction avec les rapports | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration de la diversité | Augmentation de la diversité des recrutements | ≥ 20% |
| Réduction des écarts | Réduction des écarts de sélection | ≥ 30% |
- Atteinte des objectifs D&I | Objectifs atteints / total | ≥ 80% |

---

## 10. Conclusion

Le système de rapport D&I et indicateurs produit des rapports D&I par recrutement (profil de diversité du pipeline, taux de sélection par étape, décision finale et profil retenu, écarts détectés et actions correctives) et des rapports périodiques pour l'entreprise (évolution de la diversité des recrutements, comparaison avec les objectifs D&I, recommandations d'amélioration). Les rapports permettent de suivre l'évolution de la diversité, d'identifier les écarts, et de prendre des actions correctives pour améliorer la diversité et l'inclusion. Le système est conforme au protocole anti-biais (RH-860) et s'intègre avec les modules existants.

**Points clés :**
- Rapport D&I par recrutement (profil de diversité du pipeline, taux de sélection par étape, décision finale, écarts détectés, actions correctives)
- Rapport D&I périodique (évolution de la diversité, comparaison avec objectifs D&I, recommandations d'amélioration)
- 5 dimensions de diversité analysées (genre, âge, éducation, handicap, origine socio-économique)
- Calcul des taux de sélection par étape et par groupe
- Détection des écarts significatifs
- Génération d'actions correctives personnalisées
- Comparaison avec les objectifs D&I de l'entreprise
- Recommandations d'amélioration priorisées
- Conformité au protocole anti-biais (RH-860)
- Intégration avec les modules existants
