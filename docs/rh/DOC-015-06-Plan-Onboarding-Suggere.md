# DOC-015-06 : Plan Onboarding Suggéré

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de génération du plan d'onboarding suggéré pour MVP-015 Debrief Expert. Ce système génère automatiquement un plan d'intégration personnalisé pour les candidats recommandés, avec des points de vigilance, des compétences à développer, et un plan de développement sur 90 jours.

---

## 2. Principe Fondateur

Le plan d'onboarding suggéré n'est généré que pour les candidats recommandés. Il est personnalisé en fonction des points de vigilance identifiés, des soft skills à développer, et du profil du candidat pour assurer une intégration réussie.

---

## 3. Structure du Plan d'Onboarding

### 3.1 Points de Vigilance pour l'Intégration

**Description :** Points spécifiques à surveiller pendant l'intégration du candidat.

**Sources :**
- Points de vigilance significatifs (non bloquants)
- Soft skills faibles à surveiller
- Zones d'ombre identifiées

**Exemples :**
- Leadership à développer : Surveiller la prise de décision et la gestion d'équipe
- Communication à améliorer : Surveiller la clarté des communications et la synthèse
- Adaptabilité culturelle : Surveiller l'intégration dans l'équipe et l'alignement avec les valeurs

---

### 3.2 Compétences à Développer en Priorité

**Description :** Compétences techniques ou soft skills à développer pendant les 90 premiers jours.

**Sources :**
- Soft skills avec score ≤ 3
- Compétences techniques avec score < 15/20
- Zones d'ombre critiques

**Exemples :**
- Leadership (3/5) : Programme de formation sur le leadership, mentorat avec un senior
- Communication (3/5) : Formation sur la communication efficace, entraînement aux présentations
- Gestion de projet (12/20) : Formation sur les outils de gestion de projet, accompagnement par un chef de projet

---

### 3.3 Profil de Manager Compatible

**Description :** Profil de manager idéal pour accompagner l'intégration du candidat.

**Sources :**
- Style de management préféré du candidat
- Soft skills faibles nécessitant un soutien
- Style de travail du candidat

**Exemples :**
- Pour un candidat avec leadership faible : Manager expérimenté, pédagogue, patient
- Pour un candidat avec besoin de structure : Manager structuré, clair, processus-oriented
- Pour un candidat autonome : Manager lâche-prise, orienté résultats, empowerment

---

### 3.4 Délai avant Autonomie Estimé

**Description :** Estimation du temps nécessaire pour que le candidat atteigne l'autonomie dans le poste.

**Critères d'Estimation :**
| Score global | Expérience | Soft skills | Délai estimé |
|-------------|------------|-------------|---------------|
| ≥ 70 | ≥ 5 ans | ≥ 15/20 | 2-4 semaines |
| ≥ 70 | < 5 ans | ≥ 15/20 | 4-6 semaines |
| 50-69 | ≥ 5 ans | ≥ 12/20 | 6-8 semaines |
| 50-69 | < 5 ans | ≥ 12/20 | 8-12 semaines |
| 30-49 | ≥ 5 ans | ≥ 10/20 | 12-16 semaines |

---

### 3.5 Plan de Développement 90 Jours

**Jours 1-30 : Intégration et Formation**
- Objectifs : Comprendre l'entreprise, le poste, l'équipe
- Activités : Onboarding formel, formation aux outils, rencontres avec l'équipe
- KPIs : Compréhension des processus, intégration sociale, premiers livrables

**Jours 31-60 : Montée en Compétence**
- Objectifs : Prendre en charge les responsabilités principales
- Activités : Projets supervisés, formation ciblée, accompagnement manager
- KPIs : Qualité du travail, autonomie partielle, feedback positif

**Jours 61-90 : Autonomie et Performance**
- Objectifs : Atteindre l'autonomie complète, performer au niveau attendu
- Activités : Projets autonomes, leadership de sous-projets, mentorat junior
- KPIs : Performance au niveau attendu, autonomie complète, contribution à l'équipe

---

## 4. Structure de Données (TypeScript)

```typescript
interface OnboardingPlan {
  planId: string;
  interviewId: string;
  candidateId: string;
  jobId: string;
  generatedAt: Date;
  
  integrationVigilancePoints: {
    point: string;
    monitoring: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    responsible: string;
  }[];
  
  skillsToDevelop: {
    skill: string;
    category: 'technical' | 'soft_skill';
    priority: 'high' | 'medium' | 'low';
    developmentActions: string[];
    resources: string[];
    timeline: string;
  }[];
  
  compatibleManagerProfile: {
    style: string;
    characteristics: string[];
    experience: string;
    softSkills: string[];
  };
  
  autonomyTimeline: {
    estimatedWeeks: number;
    confidence: 'high' | 'medium' | 'low';
    factors: string[];
  };
  
  developmentPlan: {
    days1to30: {
      objectives: string[];
      activities: string[];
      kpis: string[];
      support: string[];
    };
    days31to60: {
      objectives: string[];
      activities: string[];
      kpis: string[];
      support: string[];
    };
    days61to90: {
      objectives: string[];
      activities: string[];
      kpis: string[];
      support: string[];
    };
  };
  
  validation: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Date;
    comments?: string;
  };
}
```

---

## 5. Algorithmes de Génération

### 5.1 Processus de Génération

```typescript
async function generateOnboardingPlan(
  data: DebriefData,
  evaluation: StructuredEvaluation,
  decision: DecisionArgumentation
): Promise<OnboardingPlan> {
  // Si non recommandé, plan vide
  if (decision.mainRecommendation === 'not_recommend') {
    return generateEmptyPlan(data);
  }
  
  // Étape 1 : Points de vigilance pour l'intégration
  const integrationVigilancePoints = await generateIntegrationVigilance(data, evaluation);
  
  // Étape 2 : Compétences à développer
  const skillsToDevelop = await generateSkillsToDevelop(data, evaluation);
  
  // Étape 3 : Profil de manager compatible
  const compatibleManagerProfile = await generateManagerProfile(data, evaluation);
  
  // Étape 4 : Délai avant autonomie
  const autonomyTimeline = await estimateAutonomyTimeline(evaluation);
  
  // Étape 5 : Plan de développement 90 jours
  const developmentPlan = await generateDevelopmentPlan(data, evaluation, skillsToDevelop);
  
  // Construction du plan
  const plan: OnboardingPlan = {
    planId: generatePlanId(),
    interviewId: data.interview.id,
    candidateId: data.candidate.id,
    jobId: data.job.id,
    generatedAt: new Date(),
    
    integrationVigilancePoints,
    skillsToDevelop,
    compatibleManagerProfile,
    autonomyTimeline,
    developmentPlan,
    
    validation: { validated: false }
  };
  
  // Sauvegarde du plan
  await saveOnboardingPlan(plan);
  
  return plan;
}
```

### 5.2 Points de Vigilance pour l'Intégration

```typescript
async function generateIntegrationVigilance(
  data: DebriefData,
  evaluation: StructuredEvaluation
): Promise<OnboardingPlan['integrationVigilancePoints']> {
  const vigilancePoints: OnboardingPlan['integrationVigilancePoints'][] = [];
  
  // Soft skills significatifs à surveiller
  const weakSoftSkills = evaluation.dimensions.softSkills.detail.filter(s => s.score <= 3);
  
  for (const skill of weakSoftSkills) {
    vigilancePoints.push({
      point: `${skill.skillName} (${skill.score}/5)`,
      monitoring: await generateMonitoringForSkill(skill),
      frequency: skill.score <= 2 ? 'weekly' : 'monthly',
      responsible: 'Manager'
    });
  }
  
  // Points de vigilance comportementaux
  const behavioralVigilance = data.signalDetections.filter(d => 
    d.vigilanceSignals.detected.some(s => s.includes('communication') || s.includes('équipe'))
  );
  
  for (const vigilance of behavioralVigilance) {
    vigilancePoints.push({
      point: vigilance.vigilanceSignals.detected.join(', '),
      monitoring: 'Observer les interactions avec l\'équipe et la communication',
      frequency: 'daily',
      responsible: 'Manager'
    });
  }
  
  return vigilancePoints;
}

async function generateMonitoringForSkill(skill: { skillId: string; skillName: string; score: number }): Promise<string> {
  const monitoringMap: Record<string, string> = {
    'SS-001': 'Surveiller la prise de décision et la gestion d\'équipe',
    'SS-002': 'Surveiller la gestion des émotions et les relations interpersonnelles',
    'SS-003': 'Surveiller la réaction au changement et la résilience',
    'SS-004': 'Surveiller la qualité de l\'analyse et la résolution de problèmes',
    'SS-005': 'Surveiller la clarté des communications et la synthèse',
    'SS-006': 'Surveiller l\'atteinte des objectifs et la persévérance',
    'SS-007': 'Surveiller la collaboration et la contribution à l\'équipe',
    'SS-008': 'Surveiller l\'autoformation et la mise à jour des compétences',
    'SS-009': 'Surveiller la cohérence entre valeurs et actions',
    'SS-010': 'Surveiller la performance sous pression et la gestion du stress',
    'SS-011': 'Surveiller la vision à moyen terme et la planification',
    'SS-012': 'Surveiller l\'intégration culturelle et l\'alignement avec l\'équipe'
  };
  
  return monitoringMap[skill.skillId] || 'Surveiller le développement de cette compétence';
}
```

### 5.3 Compétences à Développer

```typescript
async function generateSkillsToDevelop(
  data: DebriefData,
  evaluation: StructuredEvaluation
): Promise<OnboardingPlan['skillsToDevelop']> {
  const skills: OnboardingPlan['skillsToDevelop'][] = [];
  
  // Soft skills avec score ≤ 3
  const weakSoftSkills = evaluation.dimensions.softSkills.detail.filter(s => s.score <= 3);
  
  for (const skill of weakSoftSkills) {
    skills.push({
      skill: skill.skillName,
      category: 'soft_skill',
      priority: skill.score <= 2 ? 'high' : 'medium',
      developmentActions: await generateDevelopmentActions(skill),
      resources: await generateResources(skill),
      timeline: skill.score <= 2 ? '3 mois' : '6 mois'
    });
  }
  
  // Compétences techniques avec score < 15/20
  if (evaluation.dimensions.technicalSkills.score < 15) {
    const weakTechnicalSkills = await identifyWeakTechnicalSkills(evaluation);
    
    for (const skill of weakTechnicalSkills) {
      skills.push({
        skill: skill.name,
        category: 'technical',
        priority: 'high',
        developmentActions: await generateTechnicalDevelopmentActions(skill),
        resources: await generateTechnicalResources(skill),
        timeline: '2 mois'
      });
    }
  }
  
  return skills;
}

async function generateDevelopmentActions(skill: { skillId: string; skillName: string; score: number }): Promise<string[]> {
  const actionsMap: Record<string, string[]> = {
    'SS-001': ['Programme de formation leadership', 'Mentorat avec un senior', 'Projets de leadership supervisés'],
    'SS-002': ['Formation intelligence émotionnelle', 'Coaching comportemental', 'Exercices de feedback'],
    'SS-003': ['Formation gestion du changement', 'Projets de transformation', 'Exercices de résilience'],
    'SS-004': ['Formation pensée critique', 'Ateliers de résolution de problèmes', 'Projets d\'analyse'],
    'SS-005': ['Formation communication', 'Entraînement présentations', 'Coaching communication'],
    'SS-006': ['Formation orientation résultats', 'Objectifs SMART', 'Suivi des KPIs'],
    'SS-007': ['Formation travail d\'équipe', 'Projets collaboratifs', 'Team building'],
    'SS-008': ['Plan d\'autoformation', 'Communautés de pratique', 'Veille technologique'],
    'SS-009': ['Formation éthique', 'Ateliers dilemmes éthiques', 'Study groups'],
    'SS-010': ['Formation gestion du stress', 'Techniques de mindfulness', 'Équilibre vie pro/perso'],
    'SS-011': ['Formation vision stratégique', 'Ateliers de planification', 'Mentorat stratégique'],
    'SS-012': ['Session intégration culturelle', 'Mentorat culturel', 'Team building']
  };
  
  return actionsMap[skill.skillId] || ['Formation ciblée', 'Accompagnement manager', 'Pratique guidée'];
}
```

### 5.4 Profil de Manager Compatible

```typescript
async function generateManagerProfile(
  data: DebriefData,
  evaluation: StructuredEvaluation
): Promise<OnboardingPlan['compatibleManagerProfile']> {
  const candidate = data.candidate;
  const job = data.job;
  
  // Style de management préféré du candidat
  const preferredStyle = candidate.managementPreference;
  
  // Soft skills faibles nécessitant un soutien
  const weakSoftSkills = evaluation.dimensions.softSkills.detail.filter(s => s.score <= 3);
  
  let managerStyle: string;
  let characteristics: string[] = [];
  let experience: string;
  let softSkills: string[];
  
  // Détermination du profil de manager idéal
  if (weakSoftSkills.some(s => s.skillId === 'SS-001')) {
    // Leadership faible : manager pédagogue et patient
    managerStyle = 'Pédagogue et patient';
    characteristics = ['Expérimenté', 'Capacité de mentorat', 'Patience', 'Clarté dans les instructions', 'Feedback constructif'];
    experience = '5+ ans d\'expérience en management';
    softSkills = ['Leadership', 'Intelligence émotionnelle', 'Communication', 'Patience'];
  } else if (weakSoftSkills.some(s => s.skillId === 'SS-005')) {
    // Communication faible : manager clair et structuré
    managerStyle = 'Clair et structuré';
    characteristics = ['Communication claire', 'Processus-oriented', 'Organisé', 'Feedback régulier', 'Suivi structuré'];
    experience = '3+ ans d\'expérience en management';
    softSkills = ['Communication', 'Organisation', 'Clarté', 'Feedback'];
  } else if (preferredStyle === 'autonomous') {
    // Candidat autonome : manager lâche-prise
    managerStyle = 'Lâche-prise et orienté résultats';
    characteristics = ['Orienté résultats', 'Empowerment', 'Confiance', 'Vision stratégique', 'Délegation'];
    experience = '5+ ans d\'expérience en management';
    softSkills = ['Leadership', 'Vision stratégique', 'Confiance', 'Délegation'];
  } else {
    // Profil standard
    managerStyle = 'Équilibré et adaptable';
    characteristics = ['Adaptable', 'Supportif', 'Clair', 'Orienté croissance', 'Feedback constructif'];
    experience = '3+ ans d\'expérience en management';
    softSkills = ['Leadership', 'Communication', 'Adaptabilité', 'Feedback'];
  }
  
  return {
    style: managerStyle,
    characteristics,
    experience,
    softSkills
  };
}
```

### 5.5 Estimation du Délai d'Autonomie

```typescript
async function estimateAutonomyTimeline(evaluation: StructuredEvaluation): Promise<OnboardingPlan['autonomyTimeline']> {
  const globalScore = evaluation.globalScore;
  const experience = evaluation.dimensions.relevantExperience.score;
  const softSkills = evaluation.dimensions.softSkills.score;
  
  let estimatedWeeks: number;
  let confidence: 'high' | 'medium' | 'low';
  const factors: string[] = [];
  
  // Estimation basée sur le score global
  if (globalScore >= 70) {
    if (experience >= 15 && softSkills >= 15) {
      estimatedWeeks = 3;
      confidence = 'high';
    } else if (experience >= 10 && softSkills >= 12) {
      estimatedWeeks = 4;
      confidence = 'high';
    } else {
      estimatedWeeks = 5;
      confidence = 'medium';
    }
    factors.push('Score global élevé');
  } else if (globalScore >= 50) {
    if (experience >= 15 && softSkills >= 12) {
      estimatedWeeks = 6;
      confidence = 'medium';
    } else {
      estimatedWeeks = 8;
      confidence = 'medium';
    }
    factors.push('Score global moyen');
  } else {
    estimatedWeeks = 12;
    confidence = 'low';
    factors.push('Score global mitigé');
  }
  
  // Ajustement basé sur les soft skills critiques
  const criticalSoftSkills = evaluation.dimensions.softSkills.detail.filter(s => {
    const grid = evaluation.dimensions.softSkills.detail.find(d => d.skillId === s.skillId);
    return grid && grid.weight >= 0.15 && s.score < 3;
  });
  
  if (criticalSoftSkills.length > 0) {
    estimatedWeeks += 4;
    confidence = 'low';
    factors.push(`Soft skills critiques faibles : ${criticalSoftSkills.map(s => s.skillName).join(', ')}`);
  }
  
  return {
    estimatedWeeks,
    confidence,
    factors
  };
}
```

### 5.6 Plan de Développement 90 Jours

```typescript
async function generateDevelopmentPlan(
  data: DebriefData,
  evaluation: StructuredEvaluation,
  skillsToDevelop: OnboardingPlan['skillsToDevelop']
): Promise<OnboardingPlan['developmentPlan']> {
  const highPrioritySkills = skillsToDevelop.filter(s => s.priority === 'high');
  
  return {
    days1to30: {
      objectives: [
        'Comprendre l\'entreprise, le poste et l\'équipe',
        'Maîtriser les outils et processus',
        'Intégrer l\'équipe et la culture',
        ...highPrioritySkills.map(s => `Commencer le développement de ${s.skill}`)
      ],
      activities: [
        'Onboarding formel (entreprise, poste, équipe)',
        'Formation aux outils et processus',
        'Rencontres avec l\'équipe et les parties prenantes',
        'Projets d\'observation et de participation',
        ...highPrioritySkills.map(s => `Premières activités de développement de ${s.skill}`)
      ],
      kpis: [
        'Compréhension des processus (quiz)',
        'Intégration sociale (feedback équipe)',
        'Premiers livrables (qualité)',
        ...highPrioritySkills.map(s => `Progression sur ${s.skill}`)
      ],
      support: [
        'Manager dédié',
        'Buddy/mentor',
        'Formation formelle',
        'Ressources d\'onboarding'
      ]
    },
    days31to60: {
      objectives: [
        'Prendre en charge les responsabilités principales',
        'Atteindre l\'autonomie partielle',
        'Contribuer activement aux projets',
        ...skillsToDevelop.map(s => `Progresser sur le développement de ${s.skill}`)
      ],
      activities: [
        'Projets supervisés',
        'Formation ciblée',
        'Accompagnement manager régulier',
        'Participation aux réunions d\'équipe',
        ...skillsToDevelop.map(s => `Activités de développement de ${s.skill}`)
      ],
      kpis: [
        'Qualité du travail (feedback manager)',
        'Autonomie partielle (supervision réduite)',
        'Feedback positif de l\'équipe',
        ...skillsToDevelop.map(s => `Amélioration sur ${s.skill}`)
      ],
      support: [
        'Manager (réunions hebdomadaires)',
        'Mentorat si applicable',
        'Formation continue',
        'Pair programming si applicable'
      ]
    },
    days61to90: {
      objectives: [
        'Atteindre l\'autonomie complète',
        'Performer au niveau attendu',
        'Contribuer à l\'équipe',
        'Leadership de sous-projets'
      ],
      activities: [
        'Projets autonomes',
        'Leadership de sous-projets',
        'Mentorat junior si applicable',
        'Contribution aux initiatives d\'équipe'
      ],
      kpis: [
        'Performance au niveau attendu (KPIs)',
        'Autonomie complète (sans supervision)',
        'Contribution positive à l\'équipe',
        'Feedback positif des parties prenantes'
      ],
      support: [
        'Manager (réunions mensuelles)',
        'Accès aux ressources',
        'Opportunités de développement',
        'Réseau interne'
      ]
    }
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE onboarding_plan (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  integration_vigilance_points JSON NOT NULL,
  skills_to_develop JSON NOT NULL,
  compatible_manager_profile JSON NOT NULL,
  autonomy_timeline JSON NOT NULL,
  development_plan JSON NOT NULL,
  
  validated BOOLEAN DEFAULT FALSE,
  validated_by VARCHAR(36),
  validated_at TIMESTAMP,
  validation_comments TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_onboarding_interview ON onboarding_plan(interview_id);
CREATE INDEX idx_onboarding_candidate ON onboarding_plan(candidate_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/onboarding-plan
async function createOnboardingPlan(interviewId: string): Promise<OnboardingPlan> {
  return await generateOnboardingPlan(interviewId);
}

// GET /api/onboarding-plan/:id
async function getOnboardingPlan(id: string): Promise<OnboardingPlan> {
  return await getPlanById(id);
}

// GET /api/onboarding-plan/interview/:interviewId
async function getOnboardingPlanByInterview(interviewId: string): Promise<OnboardingPlan> {
  return await getPlanByInterviewId(interviewId);
}

// PUT /api/onboarding-plan/:id
async function updateOnboardingPlan(id: string, plan: Partial<OnboardingPlan>): Promise<OnboardingPlan> {
  return await modifyPlan(id, plan);
}

// POST /api/onboarding-plan/:id/validate
async function validateOnboardingPlan(id: string, validation: OnboardingPlan['validation']): Promise<void> {
  return await markAsValidated(id, validation);
}

// POST /api/onboarding-plan/:id/export
async function exportOnboardingPlan(id: string, format: 'pdf' | 'docx'): Promise<Buffer> {
  return await exportToFormat(id, format);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Plans validés / générés | 100% |
| Précision du délai | Délai réel / délai estimé | ± 20% |
| Adéquation manager | Satisfaction manager / candidat | ≥ 4/5 |
| Succès onboarding | Candidats atteignant autonomie / total | ≥ 80% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Plans utilisés / générés | ≥ 90% |
| Satisfaction HR | Satisfaction avec le plan | ≥ 4.5/5 |
| Satisfaction candidat | Satisfaction avec l'onboarding | ≥ 4/5 |

---

## 9. Conclusion

Le plan d'onboarding suggéré génère automatiquement un plan d'intégration personnalisé pour les candidats recommandés, avec des points de vigilance, des compétences à développer, un profil de manager compatible, et un plan de développement sur 90 jours.

**Points clés :**
- Généré uniquement pour les candidats recommandés
- Points de vigilance pour l'intégration avec monitoring
- Compétences à développer avec actions et ressources
- Profil de manager compatible basé sur le candidat
- Délai d'autonomie estimé basé sur le score global
- Plan de développement 90 jours avec objectifs, activités, KPIs
- Validation obligatoire avant utilisation
