# DOC-015-05 : Décision Argumentée

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de décision argumentée pour MVP-015 Debrief Expert. Ce système formule une recommandation structurée avec 3 arguments principaux, des conditions, des risques résiduels acceptés, et une checklist de vérifications avant offre.

---

## 2. Principe Fondateur

La décision argumentée n'est pas une impression subjective. Elle est basée sur l'évaluation structurée, les points forts, les points de vigilance, et les zones d'ombre. Chaque argument doit être étayé par une preuve concrète.

---

## 3. Types de Recommandations

### 3.1 Recommandation Forte

**Description :** Candidat exceptionnel, recommandé sans réserve.

**Critères :**
- Score global ≥ 70/100
- Aucun point de vigilance bloquant
- Soft skills critiques ≥ seuil
- Adéquation culturelle ≥ seuil

**Exemple :**
```
Recommandation : Recommandé fortement

Arguments principaux :
1. Score global exceptionnel de 78/100, avec des compétences techniques
   remarquables (18/20) et une expérience parfaitement alignée (17/20)
2. Soft skills globaux solides (16/20), en particulier leadership (5/5) et
   intelligence émotionnelle (4/5)
3. Adéquation culturelle parfaite (18/20) avec alignement des valeurs et
   style de management compatible

Conditions : Aucune

Risques résiduels acceptés : Aucun

Vérifications avant offre : Références
```

---

### 3.2 Recommandation avec Réserves

**Description :** Candidat solide mais avec des conditions à remplir.

**Critères :**
- Score global ≥ 50/100 et < 70/100
- Points de vigilance significatifs mais non bloquants
- Soft skills critiques au seuil ou légèrement en dessous
- Adéquation culturelle acceptable

**Exemple :**
```
Recommandation : Recommandé avec réserves

Arguments principaux :
1. Score global solide de 62/100, avec des compétences techniques
   adéquates (14/20) et une expérience pertinente (15/20)
2. Soft skills globaux acceptables (13/20), avec leadership (3/5) à
   développer
3. Adéquation culturelle satisfaisante (14/20) avec quelques différences
   mineures sur le style de travail

Conditions :
- Plan de développement ciblé sur le leadership (3 mois)
- Suivi régulier avec le futur manager (mensuel)
- Formation complémentaire sur la gestion d'équipe

Risques résiduels acceptés :
- Leadership à développer : risque limité avec accompagnement
- Adaptation culturelle : risque mineur, période d'intégration de 3 mois

Vérifications avant offre : Références, Second entretien avec futur manager
```

---

### 3.3 Dossier à Approfondir

**Description :** Candidat potentiel mais nécessite un second entretien.

**Critères :**
- Score global ≥ 30/100 et < 50/100
- Zones d'ombre critiques non évaluées
- Points de vigilance significatifs
- Incertitude sur certains aspects

**Exemple :**
```
Recommandation : Dossier à approfondir

Arguments principaux :
1. Score global mitigé de 42/100, avec des compétences techniques
   correctes (12/20) mais une expérience partiellement pertinente (10/20)
2. Soft skills globaux mitigés (10/20), avec intelligence émotionnelle
   (2/5) à évaluer plus précisément
3. Zones d'ombre critiques sur la capacité à gérer les conflits et la
   vision stratégique

Conditions :
- Second entretien avec focus sur la gestion de conflits
- Test de mise en situation sur le leadership
- Vérification des références avec focus sur le travail d'équipe

Risques résiduels acceptés :
- Incertitude sur les soft skills : nécessite évaluation supplémentaire
- Expérience partiellement pertinente : à confirmer par références

Vérifications avant offre : Références, Second entretien, Test de mise en situation
```

---

### 3.4 Non Recommandé

**Description :** Candidat non adapté au poste.

**Critères :**
- Score global < 30/100
- Points de vigilance bloquants
- Soft skills critiques en dessous du seuil
- Inadéquation culturelle majeure

**Exemple :**
```
Recommandation : Non recommandé

Arguments principaux :
1. Score global insuffisant de 25/100, avec des compétences techniques
   faibles (8/20) et une expérience non pertinente (7/20)
2. Soft skills globaux insuffisants (6/20), avec leadership (1/5) et
   intelligence émotionnelle (1/5) en dessous du seuil critique
3. Inadéquation culturelle majeure (5/20) avec valeurs incompatibles et
   style de travail non adapté

Conditions : Aucune

Risques résiduels acceptés : Aucun

Vérifications avant offre : Aucune
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface DecisionArgumentation {
  decisionId: string;
  interviewId: string;
  candidateId: string;
  jobId: string;
  decidedAt: Date;
  decidedBy: string;
  
  mainRecommendation: 'strong_recommend' | 'recommend_with_reservations' | 'needs_deepening' | 'not_recommend';
  
  mainArguments: {
    argument: string;
    evidence: string[];
    weight: number; // 0-1
  }[];
  
  conditions: {
    condition: string;
    deadline?: string;
    responsible?: string;
  }[];
  
  acceptedRisks: {
    risk: string;
    mitigation: string;
    probability: 'low' | 'medium' | 'high';
  }[];
  
  verificationBeforeOffer: {
    references: boolean;
    technicalTest: boolean;
    secondInterview: boolean;
    other: string;
  };
  
  confidence: number; // 0-1
  
  validation: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Date;
    comments?: string;
  };
}
```

---

## 5. Algorithme de Décision

### 5.1 Processus de Décision

```typescript
async function generateDecisionArgumentation(
  data: DebriefData,
  evaluation: StructuredEvaluation,
  strengths: StrengthPoint[],
  vigilance: VigilancePoint[]
): Promise<DecisionArgumentation> {
  // Étape 1 : Détermination de la recommandation principale
  const mainRecommendation = await determineMainRecommendation(evaluation, vigilance);
  
  // Étape 2 : Génération des arguments principaux
  const mainArguments = await generateMainArguments(evaluation, strengths, vigilance);
  
  // Étape 3 : Génération des conditions
  const conditions = await generateConditions(mainRecommendation, vigilance);
  
  // Étape 4 : Génération des risques résiduels acceptés
  const acceptedRisks = await generateAcceptedRisks(mainRecommendation, vigilance);
  
  // Étape 5 : Génération de la checklist de vérifications
  const verificationBeforeOffer = await generateVerificationChecklist(mainRecommendation, evaluation);
  
  // Étape 6 : Calcul de la confiance
  const confidence = await calculateConfidence(evaluation, vigilance);
  
  // Construction de la décision argumentée
  const decision: DecisionArgumentation = {
    decisionId: generateDecisionId(),
    interviewId: data.interview.id,
    candidateId: data.candidate.id,
    jobId: data.job.id,
    decidedAt: new Date(),
    decidedBy: data.recruiter.id,
    
    mainRecommendation,
    mainArguments,
    conditions,
    acceptedRisks,
    verificationBeforeOffer,
    confidence,
    
    validation: { validated: false }
  };
  
  // Sauvegarde de la décision
  await saveDecision(decision);
  
  return decision;
}
```

### 5.2 Détermination de la Recommandation Principale

```typescript
async function determineMainRecommendation(
  evaluation: StructuredEvaluation,
  vigilance: VigilancePoint[]
): Promise<'strong_recommend' | 'recommend_with_reservations' | 'needs_deepening' | 'not_recommend'> {
  const globalScore = evaluation.globalScore;
  
  // Vérification des points de vigilance bloquants
  const blockingPoints = vigilance.filter(v => v.criticality === 'blocking');
  
  if (blockingPoints.length > 0) {
    return 'not_recommend';
  }
  
  // Vérification des soft skills critiques
  const criticalSoftSkills = evaluation.dimensions.softSkills.detail.filter(s => {
    const grid = evaluation.dimensions.softSkills.detail.find(d => d.skillId === s.skillId);
    return grid && grid.weight >= 0.15 && s.score < 3;
  });
  
  if (criticalSoftSkills.length > 0) {
    return 'not_recommend';
  }
  
  // Vérification de l'adéquation culturelle
  if (evaluation.dimensions.culturalFit.score < 10) {
    return 'not_recommend';
  }
  
  // Détermination basée sur le score global
  if (globalScore >= 70) {
    return 'strong_recommend';
  }
  
  if (globalScore >= 50) {
    return 'recommend_with_reservations';
  }
  
  if (globalScore >= 30) {
    return 'needs_deepening';
  }
  
  return 'not_recommend';
}
```

### 5.3 Génération des Arguments Principaux

```typescript
async function generateMainArguments(
  evaluation: StructuredEvaluation,
  strengths: StrengthPoint[],
  vigilance: VigilancePoint[]
): Promise<DecisionArgumentation['mainArguments']> {
  const arguments: DecisionArgumentation['mainArguments'][] = [];
  
  // Argument 1 : Score global et dimensions clés
  const topDimensions = await getTopDimensions(evaluation);
  arguments.push({
    argument: `Score global de ${evaluation.globalScore}/100, avec ${topDimensions.description}`,
    evidence: topDimensions.evidence,
    weight: 0.4
  });
  
  // Argument 2 : Points forts clés
  const topStrengths = strengths.slice(0, 2);
  arguments.push({
    argument: `Points forts : ${topStrengths.map(s => s.point).join(', ')}`,
    evidence: topStrengths.map(s => s.example),
    weight: 0.3
  });
  
  // Argument 3 : Soft skills ou adéquation culturelle
  const softSkillsScore = evaluation.dimensions.softSkills.score;
  const culturalFitScore = evaluation.dimensions.culturalFit.score;
  
  if (softSkillsScore >= culturalFitScore) {
    arguments.push({
      argument: `Soft skills globaux solides (${softSkillsScore}/20)`,
      evidence: evaluation.dimensions.softSkills.evidence,
      weight: 0.3
    });
  } else {
    arguments.push({
      argument: `Adéquation culturelle satisfaisante (${culturalFitScore}/20)`,
      evidence: evaluation.dimensions.culturalFit.evidence,
      weight: 0.3
    });
  }
  
  return arguments;
}
```

### 5.4 Génération des Conditions

```typescript
async function generateConditions(
  recommendation: string,
  vigilance: VigilancePoint[]
): Promise<DecisionArgumentation['conditions']> {
  const conditions: DecisionArgumentation['conditions'][] = [];
  
  if (recommendation === 'recommend_with_reservations') {
    // Conditions basées sur les points de vigilance significatifs
    const significantPoints = vigilance.filter(v => v.criticality === 'significant');
    
    for (const point of significantPoints) {
      conditions.push({
        condition: `Plan de développement ciblé sur ${point.category}`,
        deadline: '3 mois',
        responsible: 'Manager'
      });
    }
    
    conditions.push({
      condition: 'Suivi régulier avec le futur manager',
      deadline: 'Mensuel',
      responsible: 'HR'
    });
  }
  
  if (recommendation === 'needs_deepening') {
    conditions.push({
      condition: 'Second entretien avec focus sur les zones d\'ombre',
      deadline: '2 semaines',
      responsible: 'Recruteur'
    });
    
    conditions.push({
      condition: 'Test de mise en situation',
      deadline: '2 semaines',
      responsible: 'Recruteur'
    });
  }
  
  return conditions;
}
```

### 5.5 Génération des Risques Résiduels

```typescript
async function generateAcceptedRisks(
  recommendation: string,
  vigilance: VigilancePoint[]
): Promise<DecisionArgumentation['acceptedRisks']> {
  const risks: DecisionArgumentation['acceptedRisks'][] = [];
  
  if (recommendation === 'strong_recommend') {
    // Aucun risque accepté
    return risks;
  }
  
  if (recommendation === 'recommend_with_reservations') {
    const significantPoints = vigilance.filter(v => v.criticality === 'significant');
    
    for (const point of significantPoints) {
      risks.push({
        risk: point.point,
        mitigation: `Accompagnement ciblé sur ${point.category}`,
        probability: 'medium'
      });
    }
  }
  
  if (recommendation === 'needs_deepening') {
    risks.push({
      risk: 'Incertitude sur les soft skills',
      mitigation: 'Évaluation supplémentaire lors du second entretien',
      probability: 'high'
    });
  }
  
  return risks;
}
```

### 5.6 Génération de la Checklist de Vérifications

```typescript
async function generateVerificationChecklist(
  recommendation: string,
  evaluation: StructuredEvaluation
): Promise<DecisionArgumentation['verificationBeforeOffer']> {
  const checklist: DecisionArgumentation['verificationBeforeOffer'] = {
    references: false,
    technicalTest: false,
    secondInterview: false,
    other: ''
  };
  
  // Références toujours recommandées
  checklist.references = true;
  
  if (recommendation === 'strong_recommend') {
    // Références suffisantes
  } else if (recommendation === 'recommend_with_reservations') {
    // Références + Second entretien
    checklist.secondInterview = true;
  } else if (recommendation === 'needs_deepening') {
    // Références + Second entretien + Test technique
    checklist.secondInterview = true;
    checklist.technicalTest = evaluation.dimensions.technicalSkills.score < 12;
  } else {
    // Non recommandé : aucune vérification
    checklist.references = false;
  }
  
  return checklist;
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE decision_argumentation (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  decided_at TIMESTAMP NOT NULL,
  decided_by VARCHAR(36) NOT NULL,
  
  main_recommendation VARCHAR(50) NOT NULL,
  main_arguments JSON NOT NULL,
  conditions JSON NOT NULL,
  accepted_risks JSON NOT NULL,
  verification_before_offer JSON NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  
  validated BOOLEAN DEFAULT FALSE,
  validated_by VARCHAR(36),
  validated_at TIMESTAMP,
  validation_comments TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (decided_by) REFERENCES recruiters(id)
);

CREATE INDEX idx_decision_interview ON decision_argumentation(interview_id);
CREATE INDEX idx_decision_recommendation ON decision_argumentation(main_recommendation);
```

---

## 7. API Endpoints

```typescript
// POST /api/decision-argumentation
async function createDecision(interviewId: string): Promise<DecisionArgumentation> {
  return await generateDecisionArgumentation(interviewId);
}

// GET /api/decision-argumentation/:id
async function getDecision(id: string): Promise<DecisionArgumentation> {
  return await getDecisionById(id);
}

// GET /api/decision-argumentation/interview/:interviewId
async function getDecisionByInterview(interviewId: string): Promise<DecisionArgumentation> {
  return await getDecisionByInterviewId(interviewId);
}

// PUT /api/decision-argumentation/:id
async function updateDecision(id: string, decision: Partial<DecisionArgumentation>): Promise<DecisionArgumentation> {
  return await modifyDecision(id, decision);
}

// POST /api/decision-argumentation/:id/validate
async function validateDecision(id: string, validation: DecisionArgumentation['validation']): Promise<void> {
  return await markAsValidated(id, validation);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Décisions validées / total | 100% |
| Taux d'arguments avec preuves | Arguments avec preuves / total | 100% |
| Consistance | Variance des décisions pour même profil | ≤ 0.5 |
| Précision | Décisions correctes / total | ≥ 85% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Décisions utilisées / générées | ≥ 90% |
| Satisfaction recruteur | Satisfaction avec la décision | ≥ 4.5/5 |
| Impact sur décision | Décisions finales basées sur recommandation / total | ≥ 80% |

---

## 9. Conclusion

La décision argumentée formule une recommandation structurée avec 3 arguments principaux, des conditions, des risques résiduels acceptés, et une checklist de vérifications avant offre. Chaque argument est étayé par une preuve concrète.

**Points clés :**
- 4 types de recommandation (forte, avec réserves, à approfondir, non recommandé)
- 3 arguments principaux avec preuves
- Conditions avec délais et responsables
- Risques résiduels acceptés avec mitigations
- Checklist de vérifications avant offre
- Calcul de la confiance de la décision
- Validation obligatoire avant utilisation
