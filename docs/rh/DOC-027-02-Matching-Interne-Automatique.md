# DOC-027-02 : Matching Interne Automatique

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de matching interne automatique pour MVP-027 Internal Mobility & Succession Planning. Ce système analyse la base des talents internes avant de lancer un recrutement externe, évalue chaque salarié (compétences actuelles, compétences en développement, aspirations de carrière, performance et potentiel, disponibilité et appétence pour la mobilité), génère un score de matching interne (candidats internes potentiels classés, écarts de compétences évalués, plan de développement pour combler les écarts, délai avant opérationnalité estimé).

---

## 2. Principe Fondateur

Quand un poste s'ouvre, avant de lancer le recrutement externe, le moteur analyse la base des talents internes. Pour chaque salarié, le système évalue les compétences actuelles, les compétences en développement, les aspirations de carrière déclarées, la performance et le potentiel évalués, et la disponibilité et appétence pour la mobilité. Le système génère un score de matching interne, classe les candidats internes potentiels, évalue les écarts de compétences, génère un plan de développement pour combler les écarts, et estime le délai avant opérationnalité.

---

## 3. Analyse des Salariés

### 3.1 Compétences Actuelles

**Description :**
Compétences actuellement maîtrisées par le salarié.

**Sources :**
- CV interne
- Évaluations de performance
- Certifications obtenues
- Projets réalisés

**Types de compétences :**
- Compétences techniques
- Compétences comportementales
- Compétences métier
- Compétences transverses

---

### 3.2 Compétences en Développement

**Description :**
Compétences en cours de développement par le salarié.

**Sources :**
- Plan de formation
- Objectifs de développement
- Formations en cours
- Mentoring

**Types de compétences :**
- Compétences techniques en développement
- Compétences comportementales en développement
- Compétences métier en développement

---

### 3.3 Aspirations de Carrière Déclarées

**Description :**
Aspirations de carrière déclarées par le salarié.

**Sources :**
- Entretiens annuels
- Entretiens de carrière
- Questionnaires d'aspiration
- Feedbacks informels

**Types d'aspirations :**
- Évolution de poste
- Évolution de responsabilité
- Évolution de domaine
- Évolution géographique

---

### 3.4 Performance et Potentiel Évalués

**Description :**
Performance et potentiel évalués du salarié.

**Sources :**
- Évaluations de performance
- Évaluations de potentiel
- Feedbacks 360°
- Observations du manager

**Indicateurs :**
- Performance actuelle (0-10)
- Potentiel futur (0-10)
- Tendance de performance
- Tendance de potentiel

---

### 3.5 Disponibilité et Appétence pour la Mobilité

**Description :**
Disponibilité et appétence du salarié pour la mobilité.

**Sources :**
- Déclarations du salarié
- Historique de mobilité
- Situation personnelle
- Contraintes géographiques

**Indicateurs :**
- Disponibilité (oui/non)
- Appétence pour la mobilité (0-10)
- Type de mobilité souhaitée
- Contraintes de mobilité

---

## 4. Score de Matching Interne

### 4.1 Calcul du Score de Matching

**Description :**
Calcul du score de matching interne pour chaque salarié.

**Formule :**
- Score de matching = (Score compétences × 0.3) + (Score aspirations × 0.2) + (Score performance × 0.2) + (Score potentiel × 0.2) + (Score disponibilité × 0.1)

**Composants :**
- Score compétences : correspondance des compétences avec le poste
- Score aspirations : correspondance des aspirations avec le poste
- Score performance : performance actuelle du salarié
- Score potentiel : potentiel futur du salarié
- Score disponibilité : disponibilité et appétence pour la mobilité

---

### 4.2 Classement des Candidats Internes Potentiels

**Description :**
Classement des candidats internes potentiels par score de matching.

**Critères de classement :**
- Score de matching (principal)
- Performance actuelle
- Potentiel futur
- Disponibilité

**Catégories :**
- Candidats idéaux (score > 80)
- Candidats potentiels (score 60-80)
- Candidats à développer (score 40-60)
- Candidats non adaptés (score < 40)

---

### 4.3 Évaluation des Écarts de Compétences

**Description :**
Évaluation des écarts de compétences entre le salarié et le poste.

**Types d'écarts :**
- Écarts de compétences techniques
- Écarts de compétences comportementales
- Écarts de compétences métier
- Écarts de compétences transverses

**Gravité des écarts :**
- Critique (compétence essentielle manquante)
- Élevée (compétence importante manquante)
- Moyenne (compétence utile manquante)
- Faible (compétence optionnelle manquante)

---

### 4.4 Plan de Développement pour Combler les Écarts

**Description :**
Plan de développement pour combler les écarts de compétences.

**Types d'actions :**
- Formations
- Mentoring
- Projets spéciaux
- Coaching

**Délai :**
- Court terme (< 3 mois)
- Moyen terme (3-6 mois)
- Long terme (> 6 mois)

---

### 4.5 Délai avant Opérationnalité Estimé

**Description :**
Estimation du délai avant opérationnalité dans le nouveau poste.

**Calcul :**
- Délai = (Délai de formation) + (Délai d'onboarding) + (Délai de montée en compétence)

**Facteurs influençant le délai :**
- Écarts de compétences
- Complexité du poste
- Expérience similaire
- Disponibilité du salarié

---

## 5. Algorithme de Matching Interne

### 5.1 Processus Global

```typescript
async function performInternalMatching(jobId: string): Promise<InternalMatching> {
  // 1. Récupération du poste
  const job = await getJob(jobId);
  
  // 2. Récupération des salariés internes
  const employees = await getInternalEmployees();
  
  // 3. Analyse de chaque salarié
  const internalCandidates = await Promise.all(
    employees.map(employee => analyzeEmployeeForJob(employee, job))
  );
  
  // 4. Calcul du score de matching pour chaque salarié
  const scoredCandidates = await Promise.all(
    internalCandidates.map(candidate => calculateMatchingScore(candidate, job))
  );
  
  // 5. Classement des candidats
  const rankedCandidates = scoredCandidates.sort((a, b) => b.matchingScore - a.matchingScore);
  
  // 6. Construction du matching interne
  const matching: InternalMatching = {
    matchingId: generateMatchingId(),
    jobId,
    analyzedAt: new Date(),
    
    internalCandidates: rankedCandidates
  };
  
  // 7. Sauvegarde du matching
  await saveInternalMatching(matching);
  
  return matching;
}
```

---

### 5.2 Analyse d'un Salarié pour un Poste

```typescript
async function analyzeEmployeeForJob(employee: Employee, job: Job): Promise<{
  employeeId: string;
  employeeName: string;
  currentRole: string;
  
  currentSkills: string[];
  developingSkills: string[];
  careerAspirations: string[];
  performance: number;
  potential: number;
  mobilityAvailability: boolean;
  mobilityAppetite: number;
}> {
  // Récupération des compétences actuelles
  const currentSkills = await getCurrentSkills(employee.employeeId);
  
  // Récupération des compétences en développement
  const developingSkills = await getDevelopingSkills(employee.employeeId);
  
  // Récupération des aspirations de carrière
  const careerAspirations = await getCareerAspirations(employee.employeeId);
  
  // Récupération de la performance
  const performance = await getPerformance(employee.employeeId);
  
  // Récupération du potentiel
  const potential = await getPotential(employee.employeeId);
  
  // Récupération de la disponibilité et appétence pour la mobilité
  const mobilityAvailability = await getMobilityAvailability(employee.employeeId);
  const mobilityAppetite = await getMobilityAppetite(employee.employeeId);
  
  return {
    employeeId: employee.employeeId,
    employeeName: employee.name,
    currentRole: employee.currentRole,
    
    currentSkills,
    developingSkills,
    careerAspirations,
    performance,
    potential,
    mobilityAvailability,
    mobilityAppetite
  };
}
```

---

### 5.3 Calcul du Score de Matching

```typescript
async function calculateMatchingScore(
  candidate: any,
  job: Job
): Promise<{
  employeeId: string;
  employeeName: string;
  currentRole: string;
  
  currentSkills: string[];
  developingSkills: string[];
  careerAspirations: string[];
  performance: number;
  potential: number;
  mobilityAvailability: boolean;
  mobilityAppetite: number;
  
  matchingScore: number;
  skillGaps: string[];
  developmentPlan: string[];
  estimatedTimeToOperational: string;
}> {
  // Calcul du score de compétences
  const skillScore = await calculateSkillScore(candidate.currentSkills, job.requiredSkills);
  
  // Calcul du score d'aspirations
  const aspirationScore = await calculateAspirationScore(candidate.careerAspirations, job);
  
  // Calcul du score de performance
  const performanceScore = candidate.performance / 10;
  
  // Calcul du score de potentiel
  const potentialScore = candidate.potential / 10;
  
  // Calcul du score de disponibilité
  const availabilityScore = candidate.mobilityAvailability ? candidate.mobilityAppetite / 10 : 0;
  
  // Calcul du score de matching
  const matchingScore = 
    (skillScore * 0.3) + 
    (aspirationScore * 0.2) + 
    (performanceScore * 0.2) + 
    (potentialScore * 0.2) + 
    (availabilityScore * 0.1);
  
  // Évaluation des écarts de compétences
  const skillGaps = await evaluateSkillGaps(candidate.currentSkills, job.requiredSkills);
  
  // Génération du plan de développement
  const developmentPlan = await generateDevelopmentPlan(skillGaps);
  
  // Estimation du délai avant opérationnalité
  const estimatedTimeToOperational = await estimateTimeToOperational(skillGaps, candidate);
  
  return {
    employeeId: candidate.employeeId,
    employeeName: candidate.employeeName,
    currentRole: candidate.currentRole,
    
    currentSkills: candidate.currentSkills,
    developingSkills: candidate.developingSkills,
    careerAspirations: candidate.careerAspirations,
    performance: candidate.performance,
    potential: candidate.potential,
    mobilityAvailability: candidate.mobilityAvailability,
    mobilityAppetite: candidate.mobilityAppetite,
    
    matchingScore: matchingScore * 100,
    skillGaps,
    developmentPlan,
    estimatedTimeToOperational
  };
}
```

---

### 5.4 Évaluation des Écarts de Compétences

```typescript
async function evaluateSkillGaps(currentSkills: string[], requiredSkills: string[]): Promise<string[]> {
  const skillGaps: string[] = [];
  
  // Pour chaque compétence requise
  for (const requiredSkill of requiredSkills) {
    // Si la compétence n'est pas dans les compétences actuelles
    if (!currentSkills.includes(requiredSkill)) {
      skillGaps.push(requiredSkill);
    }
  }
  
  return skillGaps;
}
```

---

### 5.5 Génération du Plan de Développement

```typescript
async function generateDevelopmentPlan(skillGaps: string[]): Promise<string[]> {
  const developmentPlan: string[] = [];
  
  // Pour chaque écart de compétence
  for (const skillGap of skillGaps) {
    // Génération d'une action de développement
    const action = await generateDevelopmentAction(skillGap);
    developmentPlan.push(action);
  }
  
  return developmentPlan;
}
```

---

### 5.6 Estimation du Délai avant Opérationnalité

```typescript
async function estimateTimeToOperational(skillGaps: string[], candidate: any): Promise<string> {
  // Nombre d'écarts de compétences
  const gapCount = skillGaps.length;
  
  // Délai de base (1 mois)
  let delay = 1;
  
  // Ajout de délai pour chaque écart
  delay += gapCount * 0.5;
  
  // Réduction de délai si performance élevée
  if (candidate.performance >= 8) {
    delay *= 0.8;
  }
  
  // Réduction de délai si potentiel élevé
  if (candidate.potential >= 8) {
    delay *= 0.8;
  }
  
  // Arrondi au mois le plus proche
  const roundedDelay = Math.round(delay);
  
  return `${roundedDelay} mois`;
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface InternalMatching {
  matchingId: string;
  jobId: string;
  analyzedAt: Date;
  
  internalCandidates: {
    employeeId: string;
    employeeName: string;
    currentRole: string;
    
    currentSkills: string[];
    developingSkills: string[];
    careerAspirations: string[];
    performance: number;
    potential: number;
    mobilityAvailability: boolean;
    mobilityAppetite: number;
    
    matchingScore: number;
    skillGaps: string[];
    developmentPlan: string[];
    estimatedTimeToOperational: string;
  }[];
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE internal_matching (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  analyzed_at TIMESTAMP NOT NULL,
  
  internal_candidates JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_internal_matching_job ON internal_matching(job_id);
CREATE INDEX idx_internal_matching_date ON internal_matching(analyzed_at);
```

---

## 8. API Endpoints

```typescript
// POST /api/internal-mobility/matching
async function performInternalMatching(jobId: string): Promise<InternalMatching> {
  return await performInternalMatching(jobId);
}

// GET /api/internal-mobility/matching/:matchingId
async function getInternalMatching(matchingId: string): Promise<InternalMatching> {
  return await getInternalMatchingById(matchingId);
}

// GET /api/internal-mobility/matching/job/:jobId
async function getInternalMatchingByJob(jobId: string): Promise<InternalMatching> {
  return await getInternalMatchingByJobId(jobId);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de matching interne | Postes avec matching interne / total | ≥ 80% |
| Taux de mobilité interne | Mobilités internes réalisées / identifiées | ≥ 50% |
| Précision du matching | Précision du score de matching | ≥ 70% |
| Satisfaction DRH | Satisfaction avec le matching interne | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des coûts de recrutement | Économie sur les coûts de recrutement externe | ≥ 30% |
- Réduction du délai d'opérationnalité | Réduction du délai d'opérationnalité | ≥ 50% |
- Amélioration de la rétention | Amélioration de la rétention globale | ≥ 20% |

---

## 10. Conclusion

Le système de matching interne automatique analyse la base des talents internes avant de lancer un recrutement externe, évalue chaque salarié (compétences actuelles, compétences en développement, aspirations de carrière, performance et potentiel, disponibilité et appétence pour la mobilité), génère un score de matching interne, classe les candidats internes potentiels, évalue les écarts de compétences, génère un plan de développement pour combler les écarts, et estime le délai avant opérationnalité. Le système permet à l'entreprise de valoriser les talents existants et de réduire les coûts de recrutement. Le système s'intègre avec les modules existants (MVP-001, MVP-002, MVP-021).

**Points clés :**
- 5 critères d'analyse pour chaque salarié
- Score de matching interne (0-100)
- Classement des candidats internes potentiels
- Écarts de compétences évalués
- Plan de développement pour combler les écarts
- Délai avant opérationnalité estimé
- 4 catégories de candidats (idéaux, potentiels, à développer, non adaptés)
- Intégration avec les modules existants
