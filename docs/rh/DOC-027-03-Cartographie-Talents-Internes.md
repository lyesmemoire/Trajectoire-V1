# DOC-027-03 : Cartographie des Talents Internes

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de cartographie des talents internes pour MVP-027 Internal Mobility & Succession Planning. Ce système produit une vue globale des talents de l'entreprise via une matrice performance/potentiel (hauts potentiels, piliers de l'organisation, talents à développer, profils à risque), génère des actions recommandées pour chaque quadrant (plan de rétention ou développement, opportunités de mobilité identifiées, risques de départ estimés).

---

## 2. Principe Fondateur

Le moteur produit une vue globale des talents de l'entreprise via une matrice performance/potentiel. Le système classe les salariés dans 4 quadrants (hauts potentiels, piliers de l'organisation, talents à développer, profils à risque) et génère des actions recommandées pour chaque quadrant (plan de rétention ou développement, opportunités de mobilité identifiées, risques de départ estimés). Le système permet à l'entreprise d'avoir une vision claire de ses talents et de prendre des décisions éclairées en matière de développement, de rétention et de mobilité.

---

## 3. Matrice Performance / Potentiel

### 3.1 Hauts Potentiels (High Potentials)

**Description :**
Salariés avec performance élevée et potentiel élevé.

**Critères :**
- Performance ≥ 7/10
- Potentiel ≥ 7/10

**Caractéristiques :**
- Performance actuelle élevée
- Potentiel futur élevé
- Candidats pour les postes de leadership
- Risque élevé de départ si non valorisés

---

### 3.2 Piliers de l'Organisation (Solid Performers)

**Description :**
Salariés avec performance élevée et potentiel moyen.

**Critères :**
- Performance ≥ 7/10
- Potentiel 4-6/10

**Caractéristiques :**
- Performance actuelle élevée
- Potentiel futur moyen
- Piliers de l'organisation
- Stabilité et fiabilité

---

### 3.3 Talents à Développer (Developing Talents)

**Description :**
Salariés avec performance moyenne et potentiel élevé.

**Critères :**
- Performance 4-6/10
- Potentiel ≥ 7/10

**Caractéristiques :**
- Performance actuelle moyenne
- Potentiel futur élevé
- Talents en développement
- Opportunité de développement

---

### 3.4 Profils à Risque (Under Performers)

**Description :**
Salariés avec performance faible et potentiel faible.

**Critères :**
- Performance ≤ 3/10
- Potentiel ≤ 3/10

**Caractéristiques :**
- Performance actuelle faible
- Potentiel futur faible
- Risque élevé de départ
- Nécessité d'action corrective

---

## 4. Actions Recommandées par Quadrant

### 4.1 Actions pour les Hauts Potentiels

**Actions recommandées :**
- Plan de développement accéléré
- Opportunités de mobilité rapide
- Mentoring par des leaders
- Exposition aux projets stratégiques
- Plan de rétention personnalisé

**Plan de rétention :**
- Augmentation salariale ciblée
- Promotion accélérée
- Nouveau périmètre de responsabilités
- Projet spécial motivant
- Formation ou certification valorisante

**Opportunités de mobilité :**
- Mobilité horizontale pour élargir l'expérience
- Mobilité verticale pour accélérer la carrière
- Mobilité géographique pour diversifier l'expérience
- Projet spécial pour développer de nouvelles compétences

**Risques de départ estimés :**
- Risque élevé si non valorisés
- Risque moyen si plan de rétention en place
- Risque faible si plan de rétention appliqué

---

### 4.2 Actions pour les Piliers de l'Organisation

**Actions recommandées :**
- Maintien de la performance
- Opportunités de mobilité limitée
- Reconnaissance et valorisation
- Stabilité dans le poste actuel
- Plan de rétention standard

**Plan de rétention :**
- Augmentation salariale standard
- Reconnaissance de la performance
- Stabilité dans le poste actuel
- Opportunités de développement limitées
- Maintien de l'engagement

**Opportunités de mobilité :**
- Mobilité horizontale limitée
- Mobilité verticale limitée
- Stabilité dans le poste actuel
- Projets spéciaux limités

**Risques de départ estimés :**
- Risque faible si valorisés
- Risque moyen si non valorisés
- Risque élevé si changement significatif

---

### 4.3 Actions pour les Talents à Développer

**Actions recommandées :**
- Plan de développement ciblé
- Formation pour améliorer la performance
- Mentoring pour développer le potentiel
- Opportunités de mobilité progressive
- Suivi régulier de la progression

**Plan de développement :**
- Formation pour améliorer les compétences
- Mentoring par des managers expérimentés
- Projets spéciaux pour développer l'expérience
- Objectifs de performance clairs
- Suivi régulier de la progression

**Opportunités de mobilité :**
- Mobilité horizontale pour élargir l'expérience
- Mobilité verticale progressive
- Projets spéciaux pour développer les compétences
- Formation pour améliorer la performance

**Risques de départ estimés :**
- Risque moyen si développement insuffisant
- Risque faible si plan de développement en place
- Risque élevé si absence de développement

---

### 4.4 Actions pour les Profils à Risque

**Actions recommandées :**
- Plan d'amélioration de la performance
- Formation ciblée
- Coaching pour identifier les blocages
- Plan de réorientation si nécessaire
- Suivi régulier de la progression

**Plan de réorientation :**
- Réorientation vers un poste plus adapté
- Formation pour développer de nouvelles compétences
- Coaching pour identifier les blocages
- Plan de transition si nécessaire
- Suivi régulier de la progression

**Opportunités de mobilité :**
- Mobilité horizontale pour trouver un poste plus adapté
- Réorientation vers un poste plus adapté
- Formation pour développer de nouvelles compétences
- Plan de transition si nécessaire

**Risques de départ estimés :**
- Risque élevé si absence d'action
- Risque moyen si plan d'amélioration en place
- Risque faible si réorientation réussie

---

## 5. Algorithme de Cartographie des Talents

### 5.1 Processus Global

```typescript
async function generateTalentMapping(): Promise<TalentMapping> {
  // 1. Récupération des salariés
  const employees = await getEmployees();
  
  // 2. Analyse de la performance et du potentiel de chaque salarié
  const analyzedEmployees = await Promise.all(
    employees.map(employee => analyzeEmployeePerformanceAndPotential(employee))
  );
  
  // 3. Classification dans la matrice performance/potentiel
  const performancePotentialMatrix = await classifyInMatrix(analyzedEmployees);
  
  // 4. Génération des actions recommandées pour chaque quadrant
  const quadrantActions = await generateQuadrantActions(performancePotentialMatrix);
  
  // 5. Construction de la cartographie des talents
  const mapping: TalentMapping = {
    mappingId: generateMappingId(),
    analyzedAt: new Date(),
    
    performancePotentialMatrix,
    quadrantActions
  };
  
  // 6. Sauvegarde de la cartographie
  await saveTalentMapping(mapping);
  
  return mapping;
}
```

---

### 5.2 Analyse de la Performance et du Potentiel

```typescript
async function analyzeEmployeePerformanceAndPotential(employee: Employee): Promise<Employee> {
  // Récupération de la performance
  const performance = await getPerformance(employee.employeeId);
  
  // Récupération du potentiel
  const potential = await getPotential(employee.employeeId);
  
  // Récupération des compétences
  const skills = await getSkills(employee.employeeId);
  
  // Récupération des aspirations de carrière
  const careerAspirations = await getCareerAspirations(employee.employeeId);
  
  // Récupération de la disponibilité et appétence pour la mobilité
  const mobilityAvailability = await getMobilityAvailability(employee.employeeId);
  const mobilityAppetite = await getMobilityAppetite(employee.employeeId);
  
  // Récupération du risque de départ
  const departureRisk = await getDepartureRisk(employee.employeeId);
  
  return {
    employeeId: employee.employeeId,
    employeeName: employee.name,
    currentRole: employee.currentRole,
    department: employee.department,
    
    performance,
    potential,
    
    skills,
    careerAspirations,
    
    mobilityAvailability,
    mobilityAppetite,
    
    departureRisk
  };
}
```

---

### 5.3 Classification dans la Matrice

```typescript
async function classifyInMatrix(employees: Employee[]): Promise<{
  highPotentials: Employee[];
  solidPerformers: Employee[];
  developingTalents: Employee[];
  underPerformers: Employee[];
}> {
  const highPotentials: Employee[] = [];
  const solidPerformers: Employee[] = [];
  const developingTalents: Employee[] = [];
  const underPerformers: Employee[] = [];
  
  // Pour chaque salarié
  for (const employee of employees) {
    // Classification selon la performance et le potentiel
    if (employee.performance >= 7 && employee.potential >= 7) {
      highPotentials.push(employee);
    } else if (employee.performance >= 7 && employee.potential >= 4 && employee.potential <= 6) {
      solidPerformers.push(employee);
    } else if (employee.performance >= 4 && employee.performance <= 6 && employee.potential >= 7) {
      developingTalents.push(employee);
    } else if (employee.performance <= 3 && employee.potential <= 3) {
      underPerformers.push(employee);
    }
  }
  
  return {
    highPotentials,
    solidPerformers,
    developingTalents,
    underPerformers
  };
}
```

---

### 5.4 Génération des Actions par Quadrant

```typescript
async function generateQuadrantActions(matrix: any): Promise<{
  quadrant: string;
  recommendedActions: string[];
  retentionPlan?: string;
  developmentPlan?: string;
  mobilityOpportunities: string[];
  departureRisk: number;
}[]> {
  const quadrantActions: {
    quadrant: string;
    recommendedActions: string[];
    retentionPlan?: string;
    developmentPlan?: string;
    mobilityOpportunities: string[];
    departureRisk: number;
  }[] = [];
  
  // Actions pour les hauts potentiels
  const highPotentialsActions = await generateHighPotentialsActions(matrix.highPotentials);
  quadrantActions.push(highPotentialsActions);
  
  // Actions pour les piliers de l'organisation
  const solidPerformersActions = await generateSolidPerformersActions(matrix.solidPerformers);
  quadrantActions.push(solidPerformersActions);
  
  // Actions pour les talents à développer
  const developingTalentsActions = await generateDevelopingTalentsActions(matrix.developingTalents);
  quadrantActions.push(developingTalentsActions);
  
  // Actions pour les profils à risque
  const underPerformersActions = await generateUnderPerformersActions(matrix.underPerformers);
  quadrantActions.push(underPerformersActions);
  
  return quadrantActions;
}
```

---

### 5.5 Génération des Actions pour les Hauts Potentiels

```typescript
async function generateHighPotentialsActions(employees: Employee[]): Promise<{
  quadrant: string;
  recommendedActions: string[];
  retentionPlan: string;
  developmentPlan: string;
  mobilityOpportunities: string[];
  departureRisk: number;
}> {
  const recommendedActions = [
    'Plan de développement accéléré',
    'Opportunités de mobilité rapide',
    'Mentoring par des leaders',
    'Exposition aux projets stratégiques',
    'Plan de rétention personnalisé'
  ];
  
  const retentionPlan = 'Augmentation salariale ciblée, promotion accélérée, nouveau périmètre de responsabilités, projet spécial motivant, formation ou certification valorisante';
  
  const developmentPlan = 'Mentoring par des leaders, exposition aux projets stratégiques, formation pour développer de nouvelles compétences, plan de carrière accéléré';
  
  const mobilityOpportunities = [
    'Mobilité horizontale pour élargir l\'expérience',
    'Mobilité verticale pour accélérer la carrière',
    'Mobilité géographique pour diversifier l\'expérience',
    'Projet spécial pour développer de nouvelles compétences'
  ];
  
  // Calcul du risque de départ moyen
  const averageDepartureRisk = employees.reduce((sum, e) => sum + e.departureRisk, 0) / employees.length;
  
  return {
    quadrant: 'Hauts Potentiels',
    recommendedActions,
    retentionPlan,
    developmentPlan,
    mobilityOpportunities,
    departureRisk: averageDepartureRisk
  };
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface TalentMapping {
  mappingId: string;
  analyzedAt: Date;
  
  performancePotentialMatrix: {
    highPotentials: Employee[];
    solidPerformers: Employee[];
    developingTalents: Employee[];
    underPerformers: Employee[];
  };
  
  quadrantActions: {
    quadrant: string;
    recommendedActions: string[];
    retentionPlan?: string;
    developmentPlan?: string;
    mobilityOpportunities: string[];
    departureRisk: number;
  }[];
}

interface Employee {
  employeeId: string;
  employeeName: string;
  currentRole: string;
  department: string;
  
  performance: number;
  potential: number;
  
  skills: string[];
  careerAspirations: string[];
  
  mobilityAvailability: boolean;
  mobilityAppetite: number;
  
  departureRisk: number;
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE talent_mapping (
  id VARCHAR(36) PRIMARY KEY,
  analyzed_at TIMESTAMP NOT NULL,
  
  performance_potential_matrix JSON NOT NULL,
  quadrant_actions JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_talent_mapping_date ON talent_mapping(analyzed_at);
```

---

## 8. API Endpoints

```typescript
// POST /api/internal-mobility/talent-mapping
async function generateTalentMapping(): Promise<TalentMapping> {
  return await generateTalentMapping();
}

// GET /api/internal-mobility/talent-mapping/:mappingId
async function getTalentMapping(mappingId: string): Promise<TalentMapping> {
  return await getTalentMappingById(mappingId);
}

// GET /api/internal-mobility/talent-mapping/latest
async function getLatestTalentMapping(): Promise<TalentMapping> {
  return await getLatestTalentMapping();
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de classification | Salariés classés / total | ≥ 95% |
| Taux d'actions appliquées | Actions appliquées / recommandées | ≥ 70% |
| Précision de la classification | Précision de la matrice | ≥ 80% |
| Satisfaction DRH | Satisfaction avec la cartographie | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration de la rétention | Amélioration de la rétention des hauts potentiels | ≥ 30% |
- Amélioration du développement | Amélioration de la performance des talents à développer | ≥ 20% |
- Réduction des risques | Réduction des risques de départ des profils à risque | ≥ 25% |

---

## 10. Conclusion

Le système de cartographie des talents internes produit une vue globale des talents de l'entreprise via une matrice performance/potentiel (hauts potentiels, piliers de l'organisation, talents à développer, profils à risque), génère des actions recommandées pour chaque quadrant (plan de rétention ou développement, opportunités de mobilité identifiées, risques de départ estimés). Le système permet à l'entreprise d'avoir une vision claire de ses talents et de prendre des décisions éclairées en matière de développement, de rétention et de mobilité. Le système s'intègre avec les modules existants (MVP-021, MVP-024).

**Points clés :**
- 4 quadrants de la matrice performance/potentiel
- Actions recommandées par quadrant
- Plan de rétention pour les hauts potentiels
- Plan de développement pour les talents à développer
- Plan de réorientation pour les profils à risque
- Opportunités de mobilité identifiées
- Risques de départ estimés
- Intégration avec les modules existants
