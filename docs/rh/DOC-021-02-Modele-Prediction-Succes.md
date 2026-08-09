# DOC-021-02 : Modèle de Prédiction du Succès

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle de prédiction du succès pour MVP-021 Predictive Success Engine. Ce modèle identifie les facteurs prédicteurs primaires (corrélés fortement au succès), les facteurs de risque de départ précoce, et produit un score de prédiction de succès (6, 12, 24 mois) avec recommandations d'action pour maximiser le succès.

---

## 2. Principe Fondateur

Le recrutement parfait n'est pas celui où le candidat réussit l'entretien. C'est celui où le candidat réussit dans le poste à 12 et 24 mois. Le modèle de prédiction du succès identifie les facteurs qui prédisent le succès réel dans un poste donné, évalue les facteurs de risque de départ précoce, et produit un score de prédiction de succès (6, 12, 24 mois) avec facteurs contributeurs, facteurs de risque, et recommandations d'action.

---

## 3. Facteurs Prédicteurs Primaires

### 3.1 Adéquation Compétences / Poste

**Principe :**
Pas la perfection. L'adéquation réelle. Un candidat à 80% est souvent plus performant qu'un candidat à 100% car il reste challengé.

**Évaluation :**
- Analyse des compétences du candidat (réf. MVP-001 CV Intelligence)
- Analyse des compétences requises pour le poste (réf. MVP-003 Job Intelligence)
- Calcul du taux d'adéquation (compétences possédées / compétences requises)
- Ajustement selon la capacité d'apprentissage du candidat

**Score :**
- 90-100% : Adéquation parfaite (risque de sous-challenge)
- 70-89% : Adéquation optimale (zone idéale)
- 50-69% : Adéquation acceptable (avec plan de formation)
- < 50% : Adéquation insuffisante (risque élevé)

---

### 3.2 Motivation Intrinsèque pour le Contenu

**Principe :**
Le candidat aime-t-il vraiment ce qu'il va faire ? Pas la marque. Pas le salaire. Le travail quotidien lui-même.

**Évaluation :**
- Analyse des réponses en entretien (réf. MVP-013 Interview Intelligence)
- Détection de la motivation intrinsèque vs extrinsèque
- Analyse des exemples donnés (choix des projets, tâches valorisées)
- Détection de l'énergie et de l'authenticité

**Indicateurs de motivation intrinsèque :**
- Le candidat parle avec passion du contenu du travail
- Les exemples donnés sont centrés sur le travail lui-même
- Le candidat pose des questions sur les projets, les défis
- Le candidat exprime un intérêt pour l'évolution dans ce domaine

**Indicateurs de motivation extrinsèque dominante :**
- Le candidat parle surtout du salaire et des avantages
- Les exemples donnés sont centrés sur le statut
- Le candidat pose des questions principalement sur la rémunération
- Le candidat exprime un intérêt pour la marque plutôt que le métier

**Score :**
- Élevé : Motivation intrinsèque forte
- Moyen : Mixte motivation intrinsèque / extrinsèque
- Faible : Motivation extrinsèque dominante

---

### 3.3 Compatibilité avec le Manager Direct

**Principe :**
La relation manager/collaborateur est le premier facteur de rétention ou de départ. Le moteur évalue la compatibilité de style entre les deux.

**Évaluation :**
- Analyse du style de management du manager (réf. données RH internes)
- Analyse des préférences du candidat en matière de management (réf. entretiens)
- Détection des incompatibilités potentielles
- Évaluation de la distance culturelle entre les deux

**Dimensions de compatibilité :**
- Style de communication (direct vs indirect)
- Niveau d'autonomie attendu (autonome vs guidé)
- Fréquence de feedback souhaitée (fréquent vs espacé)
- Style de décision (collaboratif vs directif)
- Gestion des conflits (ouverte vs évitement)

**Score :**
- Élevé : Compatibilité forte
- Moyen : Compatibilité acceptable avec ajustements
- Faible : Incompatibilité significative (risque élevé)

---

### 3.4 Adéquation Culturelle Profonde

**Principe :**
Pas les valeurs affichées. La culture réelle vécue au quotidien.

**Évaluation :**
- Analyse de la culture réelle de l'entreprise (réf. données RH internes)
- Analyse des valeurs et préférences du candidat (réf. entretiens)
- Détection des incohérences entre culture affichée et culture réelle
- Évaluation de l'alignement sur les pratiques quotidiennes

**Dimensions culturelles :**
- Rythme de travail (intense vs équilibré)
- Style de collaboration (individuel vs collectif)
- Prise de décision (centralisée vs décentralisée)
- Innovation vs stabilité
- Hiérarchie vs horizontalité
- Formalité vs informalité

**Score :**
- Élevé : Adéquation culturelle forte
- Moyen : Adéquation culturelle acceptable
- Faible : Inadéquation culturelle significative (risque élevé)

---

### 3.5 Trajectoire de Carrière Cohérente

**Principe :**
Ce poste s'inscrit-il dans une progression logique pour ce candidat ? Ou est-ce une régression déguisée ou une fuite ?

**Évaluation :**
- Analyse du parcours du candidat (réf. CV)
- Analyse du poste proposé (réf. Job Intelligence)
- Détection de la cohérence de la trajectoire
- Identification des signaux de régression ou de fuite

**Signaux de progression logique :**
- Le poste représente une évolution naturelle du parcours
- Les compétences développées précédemment sont valorisées
- Le niveau de responsabilité est en cohérence avec l'expérience
- Le secteur d'activité est en continuité ou en évolution maîtrisée

**Signaux de régression déguisée :**
- Le poste représente une baisse de niveau de responsabilité
- Le salaire est inférieur à la moyenne du marché pour le niveau
- Le candidat justifie par "changement de vie" sans détails
- Le poste est dans un secteur moins valorisé

**Signaux de fuite :**
- Le candidat quitte un poste après moins de 12 mois sans raison claire
- Le candidat critique systématiquement ses anciens employeurs
- Le candidat cherche activement depuis longtemps sans succès
- Le candidat accepte un poste en dessous de ses attentes

**Score :**
- Élevé : Trajectoire cohérente et progressive
- Moyen : Trajectoire acceptable avec quelques questions
- Faible : Trajectoire incohérente ou signaux de fuite (risque élevé)

---

## 4. Facteurs de Risque de Départ Précoce

### 4.1 Offre Acceptée par Défaut

**Signal :**
Candidat qui n'a pas cherché ce poste activement ou qui a accepté faute d'autre chose.

**Indicateurs :**
- Candidat qui postule spontanément sans recherche active
- Candidat qui accepte rapidement sans négociation
- Candidat qui ne pose pas de questions sur le poste
- Candidat qui ne connaît pas bien l'entreprise

**Niveau de risque :**
- Élevé si plusieurs indicateurs présents
- Moyen si un indicateur présent
- Faible si aucun indicateur

---

### 4.2 Attentes Salariales Non Satisfaites

**Signal :**
Candidat qui a accepté en dessous de ses attentes réelles en espérant renégocier.

**Indicateurs :**
- Candidat qui exprime des attentes salariales élevées en entretien
- Candidat qui accepte une offre en dessous de ses attentes
- Candidat qui mentionne "on verra plus tard" pour la rémunération
- Candidat qui compare avec d'autres offres en cours

**Niveau de risque :**
- Critique si écart > 20% entre attentes et offre
- Élevé si écart entre 10% et 20%
- Moyen si écart < 10%

---

### 4.3 Poste Perçu comme Transitoire

**Signal :**
Candidat qui voit ce poste comme une étape courte.

**Indicateurs :**
- Candidat qui mentionne "je veux rester 1-2 ans"
- Candidat qui parle de ce poste comme d'un "tremplin"
- Candidat qui exprime une ambition pour un poste très différent
- Candidat qui ne s'investit pas dans les questions sur le poste

**Niveau de risque :**
- Élevé si plusieurs indicateurs présents
- Moyen si un indicateur présent
- Faible si aucun indicateur

---

### 4.4 Manager Incompatible

**Signal :**
Style de management attendu incompatible avec le manager réel.

**Indicateurs :**
- Candidat qui exprime des préférences de management opposées au style du manager
- Candidat qui pose des questions sur le management qui révèlent une incompatibilité
- Candidat qui exprime des expériences négatives avec des managers similaires

**Niveau de risque :**
- Critique si incompatibilité totale
- Élevé si incompatibilité partielle
- Moyen si incompatibilité mineure

---

### 4.5 Culture Incompatible Non Détectée

**Signal :**
Candidat qui valorise ce que l'entreprise ne peut pas offrir.

**Indicateurs :**
- Candidat qui valorise des aspects culturels absents de l'entreprise
- Candidat qui exprime des préférences opposées à la culture réelle
- Candidat qui ne semble pas connaître la culture de l'entreprise

**Niveau de risque :**
- Élevé si plusieurs indicateurs présents
- Moyen si un indicateur présent
- Faible si aucun indicateur

---

## 5. Algorithme de Calcul du Score de Prédiction

### 5.1 Processus Global

```typescript
async function calculateSuccessPrediction(candidateId: string, jobId: string): Promise<SuccessPrediction> {
  // 1. Récupération des données du candidat
  const candidate = await getCandidate(candidateId);
  const job = await getJob(jobId);
  
  // 2. Évaluation des facteurs prédicteurs primaires
  const primaryFactors = await evaluatePrimaryFactors(candidate, job);
  
  // 3. Identification des facteurs de risque
  const riskFactors = await identifyRiskFactors(candidate, job);
  
  // 4. Calcul des scores à 6, 12 et 24 mois
  const scores = await calculateScores(primaryFactors, riskFactors);
  
  // 5. Génération des recommandations
  const recommendations = await generateRecommendations(primaryFactors, riskFactors, scores);
  
  // 6. Construction de la prédiction
  const prediction: SuccessPrediction = {
    predictionId: generatePredictionId(),
    candidateId,
    jobId,
    generatedAt: new Date(),
    
    primaryFactors,
    riskFactors,
    
    scores,
    
    recommendations
  };
  
  // 7. Sauvegarde de la prédiction
  await saveSuccessPrediction(prediction);
  
  return prediction;
}
```

---

### 5.2 Évaluation des Facteurs Prédicteurs

```typescript
async function evaluatePrimaryFactors(candidate: Candidate, job: Job): Promise<PrimaryFactor[]> {
  const factors: PrimaryFactor[] = [];
  
  // Facteur 1 : Adéquation compétences / poste
  const skillsMatch = await evaluateSkillsMatch(candidate, job);
  factors.push({
    factor: 'skills_match',
    score: skillsMatch.score,
    weight: 0.25,
    description: 'Adéquation compétences / poste',
    evidence: skillsMatch.evidence
  });
  
  // Facteur 2 : Motivation intrinsèque
  const intrinsicMotivation = await evaluateIntrinsicMotivation(candidate);
  factors.push({
    factor: 'intrinsic_motivation',
    score: intrinsicMotivation.score,
    weight: 0.20,
    description: 'Motivation intrinsèque pour le contenu',
    evidence: intrinsicMotivation.evidence
  });
  
  // Facteur 3 : Compatibilité manager
  const managerCompatibility = await evaluateManagerCompatibility(candidate, job);
  factors.push({
    factor: 'manager_compatibility',
    score: managerCompatibility.score,
    weight: 0.20,
    description: 'Compatibilité avec le manager direct',
    evidence: managerCompatibility.evidence
  });
  
  // Facteur 4 : Adéquation culturelle
  const culturalFit = await evaluateCulturalFit(candidate, job);
  factors.push({
    factor: 'cultural_fit',
    score: culturalFit.score,
    weight: 0.20,
    description: 'Adéquation culturelle profonde',
    evidence: culturalFit.evidence
  });
  
  // Facteur 5 : Trajectoire de carrière
  const careerTrajectory = await evaluateCareerTrajectory(candidate, job);
  factors.push({
    factor: 'career_trajectory',
    score: careerTrajectory.score,
    weight: 0.15,
    description: 'Trajectoire de carrière cohérente',
    evidence: careerTrajectory.evidence
  });
  
  return factors;
}

async function evaluateSkillsMatch(candidate: Candidate, job: Job): Promise<{ score: number; evidence: string[] }> {
  const candidateSkills = candidate.skills;
  const requiredSkills = job.requiredSkills;
  
  let matchedCount = 0;
  const evidence: string[] = [];
  
  for (const requiredSkill of requiredSkills) {
    const hasSkill = candidateSkills.some(s => s.id === requiredSkill.id);
    if (hasSkill) {
      matchedCount++;
      evidence.push(`Compétence possédée : ${requiredSkill.name}`);
    } else {
      evidence.push(`Compétence manquante : ${requiredSkill.name}`);
    }
  }
  
  const score = (matchedCount / requiredSkills.length) * 100;
  
  return { score, evidence };
}
```

---

### 5.3 Calcul des Scores

```typescript
async function calculateScores(primaryFactors: PrimaryFactor[], riskFactors: RiskFactor[]): Promise<{
  sixMonths: SuccessScore;
  twelveMonths: SuccessScore;
  twentyFourMonths: SuccessScore;
}> {
  // Score pondéré des facteurs prédicteurs
  const weightedScore = primaryFactors.reduce((sum, factor) => {
    return sum + (factor.score * factor.weight);
  }, 0);
  
  // Pénalité pour les facteurs de risque
  let riskPenalty = 0;
  for (const risk of riskFactors) {
    switch (risk.severity) {
      case 'critical':
        riskPenalty += 30;
        break;
      case 'high':
        riskPenalty += 20;
        break;
      case 'medium':
        riskPenalty += 10;
        break;
      case 'low':
        riskPenalty += 5;
        break;
    }
  }
  
  // Calcul des scores à 6, 12 et 24 mois
  const sixMonthsScore = Math.max(0, Math.min(100, weightedScore - riskPenalty * 0.5));
  const twelveMonthsScore = Math.max(0, Math.min(100, weightedScore - riskPenalty));
  const twentyFourMonthsScore = Math.max(0, Math.min(100, weightedScore - riskPenalty * 1.2));
  
  return {
    sixMonths: await buildSuccessScore(sixMonthsScore, primaryFactors, riskFactors),
    twelveMonths: await buildSuccessScore(twelveMonthsScore, primaryFactors, riskFactors),
    twentyFourMonths: await buildSuccessScore(twentyFourMonthsScore, primaryFactors, riskFactors)
  };
}

async function buildSuccessScore(score: number, primaryFactors: PrimaryFactor[], riskFactors: RiskFactor[]): Promise<SuccessScore> {
  const positiveContributors = primaryFactors
    .filter(f => f.score >= 70)
    .map(f => f.factor);
  
  const riskFactorsIdentified = riskFactors
    .filter(r => r.severity === 'high' || r.severity === 'critical')
    .map(r => r.factor);
  
  const recommendedActions = await generateRecommendedActions(primaryFactors, riskFactors, score);
  
  return {
    score,
    probability: score / 100,
    confidence: await calculateConfidence(primaryFactors, riskFactors),
    
    positiveContributors,
    riskFactorsIdentified,
    
    recommendedActions
  };
}
```

---

### 5.4 Génération des Recommandations

```typescript
async function generateRecommendedActions(primaryFactors: PrimaryFactor[], riskFactors: RiskFactor[], score: number): Promise<string[]> {
  const actions: string[] = [];
  
  // Recommandations basées sur les facteurs prédicteurs
  for (const factor of primaryFactors) {
    if (factor.score < 70) {
      const action = await generateActionForFactor(factor);
      actions.push(action);
    }
  }
  
  // Recommandations basées sur les facteurs de risque
  for (const risk of riskFactors) {
    if (risk.severity === 'high' || risk.severity === 'critical') {
      actions.push(risk.mitigation);
    }
  }
  
  // Recommandations basées sur le score global
  if (score < 50) {
    actions.push('Considérer un autre candidat - risque élevé');
  } else if (score < 70) {
    actions.push('Mettre en place un plan d'intégration renforcé');
  }
  
  return actions;
}

async function generateActionForFactor(factor: PrimaryFactor): Promise<string> {
  const actions: Record<string, string> = {
    skills_match: 'Mettre en place un plan de formation ciblé sur les compétences manquantes',
    intrinsic_motivation: 'Explorer davantage les motivations du candidat lors de l'entretien final',
    manager_compatibility: 'Organiser un entretien avec le manager avant la décision finale',
    cultural_fit: 'Présenter la culture réelle de l'entreprise de manière transparente',
    career_trajectory: 'Clarifier les perspectives d'évolution dans le poste'
  };
  
  return actions[factor.factor] || 'Revoir ce facteur avec le candidat';
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface SuccessPrediction {
  predictionId: string;
  candidateId: string;
  jobId: string;
  generatedAt: Date;
  
  primaryFactors: PrimaryFactor[];
  riskFactors: RiskFactor[];
  
  scores: {
    sixMonths: SuccessScore;
    twelveMonths: SuccessScore;
    twentyFourMonths: SuccessScore;
  };
  
  recommendations: Recommendation[];
}

interface PrimaryFactor {
  factor: string;
  score: number; // 0-100
  weight: number; // importance dans le score global
  description: string;
  evidence: string[];
}

interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
}

interface SuccessScore {
  score: number; // 0-100
  probability: number; // 0-1
  confidence: number; // 0-100
  
  positiveContributors: string[];
  riskFactorsIdentified: string[];
  
  recommendedActions: string[];
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
  timeline: string;
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE success_prediction (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  primary_factors JSON NOT NULL,
  risk_factors JSON NOT NULL,
  
  scores JSON NOT NULL,
  
  recommendations JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_success_prediction_candidate ON success_prediction(candidate_id);
CREATE INDEX idx_success_prediction_job ON success_prediction(job_id);
CREATE INDEX idx_success_prediction_date ON success_prediction(generated_at);
```

---

## 8. API Endpoints

```typescript
// POST /api/predictive-success/prediction
async function calculateSuccessPrediction(candidateId: string, jobId: string): Promise<SuccessPrediction> {
  return await calculateSuccessPrediction(candidateId, jobId);
}

// GET /api/predictive-success/prediction/:predictionId
async function getSuccessPrediction(predictionId: string): Promise<SuccessPrediction> {
  return await getSuccessPredictionById(predictionId);
}

// GET /api/predictive-success/prediction/candidate/:candidateId
async function getSuccessPredictionByCandidate(candidateId: string): Promise<SuccessPrediction[]> {
  return await getSuccessPredictionHistory(candidateId);
}

// GET /api/predictive-success/prediction/job/:jobId
async function getSuccessPredictionByJob(jobId: string): Promise<SuccessPrediction[]> {
  return await getSuccessPredictionByJobId(jobId);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Prédictions générées / candidats en finale | ≥ 90% |
| Taux de validation | Prédictions validées humainement | ≥ 95% |
| Taux de protection anti-biais | Prédictions protégées contre les biais | 100% |
| Satisfaction recruteur | Satisfaction avec les prédictions | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des départs précoces | Réduction des départs < 12 mois | ≥ 25% |
| Amélioration de la performance | Amélioration de la performance à 12 mois | ≥ 20% |
| Amélioration de la rétention | Amélioration de la rétention à 24 mois | ≥ 30% |

---

## 10. Conclusion

Le modèle de prédiction du succès identifie les facteurs prédicteurs primaires (adéquation compétences, motivation intrinsèque, compatibilité manager, adéquation culturelle, trajectoire de carrière), les facteurs de risque de départ précoce (offre par défaut, attentes salariales, poste transitoire, manager incompatible, culture incompatible), et produit un score de prédiction de succès (6, 12, 24 mois) avec facteurs contributeurs, facteurs de risque, et recommandations d'action. Le modèle est protégé contre les biais (RH-860) et s'intègre avec les modules existants.

**Points clés :**
- 5 facteurs prédicteurs primaires avec pondérations
- 5 facteurs de risque de départ précoce
- 3 scores de prédiction (6, 12, 24 mois)
- Recommandations d'action personnalisées
- Protection contre les biais
- Intégration avec les modules existants
