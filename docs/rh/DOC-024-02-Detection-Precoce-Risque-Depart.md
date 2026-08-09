# DOC-024-02 : Détection Précoce du Risque de Départ

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de détection précoce du risque de départ pour MVP-024 Talent Retention Engine. Ce système analyse les signaux faibles de désengagement et les facteurs de risque structurels pour détecter précocement le risque de départ, génère un score de risque de départ (Faible / Modéré / Élevé / Critique), estime le délai avant départ potentiel, et identifie les facteurs déclencheurs.

---

## 2. Principe Fondateur

Le moteur analyse les signaux faibles de désengagement (baisse de performance, absence aux réunions, diminution des initiatives, feedbacks négatifs, demandes d'aménagements, mise à jour LinkedIn) et les facteurs de risque structurels (stagnation salariale, absence de promotion, changement de manager, réorganisation, concurrent qui recrute, poste sous-dimensionné). Le système génère un score de risque de départ (Faible / Modéré / Élevé / Critique), estime le délai avant départ potentiel, et identifie les facteurs déclencheurs pour permettre une intervention précoce.

---

## 3. Signaux Observables de Désengagement

### 3.1 Baisse de Performance Soudaine

**Description :**
Diminution significative et soudaine de la performance du talent.

**Indicateurs :**
- Baisse de plus de 20% de la performance sur 3 mois consécutifs
- Non-atteinte des objectifs sur plusieurs périodes
- Diminution de la qualité du travail

**Gravité :**
- Élevée si baisse > 30%
- Moyenne si baisse entre 20% et 30%
- Faible si baisse < 20%

---

### 3.2 Absence à des Réunions Habituelles

**Description :**
Augmentation significative des absences aux réunions habituelles.

**Indicateurs :**
- Taux d'absence aux réunions > 20% sur le dernier mois
- Absences répétées aux réunions importantes
- Retards fréquents aux réunions

**Gravité :**
- Élevée si taux d'absence > 30%
- Moyenne si taux d'absence entre 20% et 30%
- Faible si taux d'absence < 20%

---

### 3.3 Diminution des Initiatives

**Description :**
Diminution significative des initiatives et contributions du talent.

**Indicateurs :**
- Réduction du nombre de projets proposés
- Diminution de la participation aux initiatives d'équipe
- Absence de propositions d'amélioration

**Gravité :**
- Élevée si réduction > 50%
- Moyenne si réduction entre 30% et 50%
- Faible si réduction < 30%

---

### 3.4 Feedbacks Négatifs en Entretien Annuel

**Description :**
Feedbacks négatifs exprimés lors de l'entretien annuel.

**Indicateurs :**
- Feedbacks négatifs sur la rémunération
- Feedbacks négatifs sur les opportunités de carrière
- Feedbacks négatifs sur le management
- Expression d'insatisfaction générale

**Gravité :**
- Critique si feedbacks négatifs sur 3+ dimensions
- Élevée si feedbacks négatifs sur 2 dimensions
- Moyenne si feedbacks négatifs sur 1 dimension

---

### 3.5 Demandes d'Aménagements Inhabituels

**Description :**
Demandes d'aménagements inhabituels par rapport aux habitudes du talent.

**Indicateurs :**
- Demande de télétravail accru sans raison claire
- Demande de changement d'horaire
- Demande de réaffectation
- Demande de congés soudains

**Gravité :**
- Élevée si plusieurs demandes inhabituelles
- Moyenne si une demande inhabituelle
- Faible si demande justifiée

---

### 3.6 Mise à jour du Profil LinkedIn Détectée

**Description :**
Mise à jour récente du profil LinkedIn (si autorisation).

**Indicateurs :**
- Mise à jour du profil LinkedIn dans les 30 derniers jours
- Ajout de nouvelles compétences
- Changement de titre ou de description
- Augmentation de l'activité sur LinkedIn

**Gravité :**
- Élevée si mise à jour avec changement de titre
- Moyenne si mise à jour avec ajout de compétences
- Faible si mise à jour mineure

---

## 4. Facteurs de Risque Structurels

### 4.1 Stagnation Salariale > 2 Ans

**Description :**
Absence d'augmentation salariale significative depuis plus de 2 ans.

**Indicateurs :**
- Aucune augmentation salariale > 5% depuis 2 ans
- Salaire en dessous du marché pour le niveau (réf. MVP-017)
- Talent performant sans reconnaissance salariale

**Gravité :**
- Critique si stagnation > 3 ans et performance élevée
- Élevée si stagnation > 2 ans et performance élevée
- Moyenne si stagnation > 2 ans et performance moyenne

---

### 4.2 Absence de Promotion Promise

**Description :**
Absence de promotion alors qu'une promotion avait été promise ou suggérée.

**Indicateurs :**
- Promotion promise non réalisée
- Talent performant sans évolution de carrière
- Talent au même poste depuis > 3 ans

**Gravité :**
- Critique si promotion promise non réalisée > 6 mois
- Élevée si talent performant sans évolution > 2 ans
- Moyenne si talent performant sans évolution > 1 an

---

### 4.3 Changement de Manager

**Description :**
Changement récent de manager direct.

**Indicateurs :**
- Nouveau manager depuis moins de 6 mois
- Incompatibilité de style avec le nouveau manager
- Feedbacks négatifs sur le nouveau manager

**Gravité :**
- Élevée si incompatibilité de style détectée
- Moyenne si changement récent sans incompatibilité
- Faible si changement avec transition réussie

---

### 4.4 Réorganisation de l'Équipe

**Description :**
Réorganisation récente de l'équipe ou de l'organisation.

**Indicateurs :**
- Réorganisation de l'équipe depuis moins de 6 mois
- Changement des responsabilités
- Réduction du périmètre

**Gravité :**
- Élevée si réduction significative du périmètre
- Moyenne si changement de responsabilités
- Faible si réorganisation mineure

---

### 4.5 Concurrent qui Recrute Activement

**Description :**
Un concurrent recrute activement pour des postes similaires.

**Indicateurs :**
- Offres d'emploi du concurrent pour des postes similaires
- Recrutement agressif du concurrent
- Salaires proposés supérieurs au marché

**Gravité :**
- Critique si concurrent propose des salaires > 30% supérieurs
- Élevée si concurrent recrute activement
- Moyenne si concurrent recrute modérément

---

### 4.6 Poste Sous-Dimensionné vs Potentiel

**Description :**
Le poste est sous-dimensionné par rapport au potentiel du talent.

**Indicateurs :**
- Talent performant avec responsabilités limitées
- Talent exprime un besoin de défis supplémentaires
- Talent sous-utilisé

**Gravité :**
- Élevée si talent fortement sous-utilisé
- Moyenne si talent modérément sous-utilisé
- Faible si talent bien utilisé

---

## 5. Calcul du Score de Risque de Départ

### 5.1 Processus de Calcul

```typescript
async function calculateDepartureRisk(talentId: string): Promise<DepartureRiskAssessment> {
  // 1. Récupération des données du talent
  const talent = await getTalent(talentId);
  
  // 2. Analyse des signaux observables
  const observableSignals = await analyzeObservableSignals(talent);
  
  // 3. Analyse des facteurs de risque structurels
  const structuralRiskFactors = await analyzeStructuralRiskFactors(talent);
  
  // 4. Calcul du score de risque
  const riskScore = await calculateRiskScore(observableSignals, structuralRiskFactors);
  
  // 5. Estimation du délai avant départ
  const estimatedDepartureTimeframe = await estimateDepartureTimeframe(riskScore);
  
  // 6. Identification des facteurs déclencheurs
  const triggeringFactors = await identifyTriggeringFactors(observableSignals, structuralRiskFactors);
  
  // 7. Construction de l'évaluation
  const assessment: DepartureRiskAssessment = {
    assessmentId: generateAssessmentId(),
    talentId,
    analyzedAt: new Date(),
    
    observableSignals,
    structuralRiskFactors,
    
    riskScore,
    triggeringFactors
  };
  
  // 8. Sauvegarde de l'évaluation
  await saveDepartureRiskAssessment(assessment);
  
  return assessment;
}
```

---

### 5.2 Calcul du Score de Risque

```typescript
async function calculateRiskScore(
  observableSignals: ObservableSignal[],
  structuralRiskFactors: StructuralRiskFactor[]
): Promise<{
  level: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  estimatedDepartureTimeframe: string;
}> {
  let score = 0;
  
  // Pondération des signaux observables
  for (const signal of observableSignals) {
    if (signal.detected) {
      switch (signal.severity) {
        case 'critical':
          score += 30;
          break;
        case 'high':
          score += 20;
          break;
        case 'medium':
          score += 10;
          break;
        case 'low':
          score += 5;
          break;
      }
    }
  }
  
  // Pondération des facteurs de risque structurels
  for (const factor of structuralRiskFactors) {
    if (factor.present) {
      switch (factor.severity) {
        case 'critical':
          score += 25;
          break;
        case 'high':
          score += 15;
          break;
        case 'medium':
          score += 10;
          break;
        case 'low':
          score += 5;
          break;
      }
    }
  }
  
  // Normalisation du score
  const normalizedScore = Math.min(100, score);
  
  // Détermination du niveau de risque
  let level: 'low' | 'moderate' | 'high' | 'critical';
  let estimatedDepartureTimeframe: string;
  
  if (normalizedScore >= 75) {
    level = 'critical';
    estimatedDepartureTimeframe = '1-3 mois';
  } else if (normalizedScore >= 50) {
    level = 'high';
    estimatedDepartureTimeframe = '3-6 mois';
  } else if (normalizedScore >= 25) {
    level = 'moderate';
    estimatedDepartureTimeframe = '6-12 mois';
  } else {
    level = 'low';
    estimatedDepartureTimeframe = '> 12 mois';
  }
  
  return {
    level,
    score: normalizedScore,
    estimatedDepartureTimeframe
  };
}
```

---

### 5.3 Identification des Facteurs Déclencheurs

```typescript
async function identifyTriggeringFactors(
  observableSignals: ObservableSignal[],
  structuralRiskFactors: StructuralRiskFactor[]
): Promise<string[]> {
  const triggeringFactors: string[] = [];
  
  // Signaux observables déclencheurs
  for (const signal of observableSignals) {
    if (signal.detected && (signal.severity === 'high' || signal.severity === 'critical')) {
      triggeringFactors.push(signal.signal);
    }
  }
  
  // Facteurs de risque structurels déclencheurs
  for (const factor of structuralRiskFactors) {
    if (factor.present && (factor.severity === 'high' || factor.severity === 'critical')) {
      triggeringFactors.push(factor.factor);
    }
  }
  
  return triggeringFactors;
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface DepartureRiskAssessment {
  assessmentId: string;
  talentId: string;
  analyzedAt: Date;
  
  observableSignals: ObservableSignal[];
  structuralRiskFactors: StructuralRiskFactor[];
  
  riskScore: {
    level: 'low' | 'moderate' | 'high' | 'critical';
    score: number; // 0-100
    estimatedDepartureTimeframe: string;
  };
  
  triggeringFactors: string[];
}

interface ObservableSignal {
  signal: string;
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  detectedAt: Date;
}

interface StructuralRiskFactor {
  factor: string;
  present: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE departure_risk_assessment (
  id VARCHAR(36) PRIMARY KEY,
  talent_id VARCHAR(36) NOT NULL,
  analyzed_at TIMESTAMP NOT NULL,
  
  observable_signals JSON NOT NULL,
  structural_risk_factors JSON NOT NULL,
  
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  risk_score INT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  estimated_departure_timeframe VARCHAR(50) NOT NULL,
  
  triggering_factors JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (talent_id) REFERENCES talents(id)
);

CREATE INDEX idx_departure_risk_assessment_talent ON departure_risk_assessment(talent_id);
CREATE INDEX idx_departure_risk_assessment_date ON departure_risk_assessment(analyzed_at);
CREATE INDEX idx_departure_risk_assessment_level ON departure_risk_assessment(risk_level);
CREATE INDEX idx_departure_risk_assessment_score ON departure_risk_assessment(risk_score);
```

---

## 8. API Endpoints

```typescript
// POST /api/talent-retention/risk-assessment
async function calculateDepartureRisk(talentId: string): Promise<DepartureRiskAssessment> {
  return await calculateDepartureRisk(talentId);
}

// GET /api/talent-retention/risk-assessment/:assessmentId
async function getDepartureRiskAssessment(assessmentId: string): Promise<DepartureRiskAssessment> {
  return await getDepartureRiskAssessmentById(assessmentId);
}

// GET /api/talent-retention/risk-assessment/talent/:talentId
async function getDepartureRiskAssessmentByTalent(talentId: string): Promise<DepartureRiskAssessment[]> {
  return await getDepartureRiskAssessmentByTalentId(talentId);
}

// GET /api/talent-retention/risk-assessment/high-risk
async function getHighRiskTalents(): Promise<DepartureRiskAssessment[]> {
  return await getHighRiskTalentAssessments();
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection de risque | Talents à risque détectés / total | ≥ 80% |
| Taux de faux positifs | Faux positifs / alertes | ≤ 20% |
| Précision du délai estimé | Précision du délai estimé vs réel | ≥ 70% |
| Satisfaction DRH | Satisfaction avec les alertes | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction du taux de départ | Réduction des départs de talents clés | ≥ 30% |
| Amélioration de la rétention | Talents retenus / talents à risque | ≥ 70% |
- Économie sur les coûts | Économie réalisée / coût de remplacement évité | ≥ 50% |

---

## 10. Conclusion

Le système de détection précoce du risque de départ analyse les signaux faibles de désengagement (baisse de performance, absence aux réunions, diminution des initiatives, feedbacks négatifs, demandes d'aménagements, mise à jour LinkedIn) et les facteurs de risque structurels (stagnation salariale, absence de promotion, changement de manager, réorganisation, concurrent qui recrute, poste sous-dimensionné). Le système génère un score de risque de départ (Faible / Modéré / Élevé / Critique), estime le délai avant départ potentiel, et identifie les facteurs déclencheurs pour permettre une intervention précoce. Le système s'intègre avec les modules existants (MVP-021, MVP-023, MVP-017).

**Points clés :**
- 6 signaux observables de désengagement
- 6 facteurs de risque structurels
- Score de risque de départ (0-100)
- 4 niveaux de risque (Faible / Modéré / Élevé / Critique)
- Délai estimé avant départ potentiel
- Facteurs déclencheurs identifiés
- Surveillance continue des talents
- Alerte précoce pour intervention
- Intégration avec les modules existants
