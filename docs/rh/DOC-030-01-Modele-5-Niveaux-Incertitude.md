# DOC-030-01 : Modèle des 5 Niveaux d'Incertitude

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle des 5 niveaux d'incertitude pour MVP-030 Uncertainty Management Engine. Ce modèle structure la mesure de l'incertitude sur 5 niveaux pour chaque évaluation produite par le moteur, assurant une communication transparente de la confiance et des limites de connaissance.

---

## 2. Principe Fondateur

Un maître RH fait l'inverse des systèmes IA classiques. Il mesure son incertitude, la communique, et ne prend jamais une décision importante sans avoir identifié ce qu'il ne sait pas. "Je sais ce que je sais. Je sais ce que je ne sais pas. Je sais ce que personne ne peut savoir sans informations supplémentaires." Cette discipline est rare, essentielle, et construit la confiance sur le long terme.

---

## 3. Sources d'Incertitude

### 3.1 Source 1 — Données Insuffisantes

**Description :**
On n'a pas assez d'informations pour décider avec confiance.

**Exemples :**
- CV incomplet
- Manque d'informations sur l'expérience
- Absence de références
- Manque de données sur les soft skills

---

### 3.2 Source 2 — Données Ambiguës

**Description :**
Les informations disponibles peuvent être interprétées de plusieurs façons.

**Exemples :**
- Formulations vagues dans le CV
- Expériences mal définies
- Compétences ambiguës
- Réponses non spécifiques en entretien

---

### 3.3 Source 3 — Complexité Humaine

**Description :**
Les humains sont imprévisibles. Même avec toutes les données, l'incertitude reste fondamentale.

**Exemples :**
- Motivations profondes
- Évolution personnelle
- Chimie d'équipe
- Réactions au changement

---

### 3.4 Source 4 — Contexte Inconnu

**Description :**
On ne connaît pas suffisamment le contexte pour appliquer les bonnes règles.

**Exemples :**
- Culture d'entreprise non documentée
- Dynamique d'équipe inconnue
- Contexte de recrutement spécifique
- Enjeux stratégiques implicites

---

## 4. Les 5 Niveaux d'Incertitude

### 4.1 Niveau 0 — Certitude Maximale

**Définition :**
Règle explicite, données complètes, précédents nombreux et concordants.

**Formulation :**
"Je suis certain que..."

**Critères :**
- Règle légale ou réglementaire explicite
- Données complètes et non ambiguës
- Précédents nombreux (≥ 50 cas)
- Précédents concordants (≥ 95% de cohérence)

**Exemples :**
- "La période d'essai maximale pour un cadre est 4 mois renouvelable une fois."
- "Le salaire minimum pour ce poste est X selon la convention collective."
- "Ce candidat a les qualifications obligatoires pour ce poste."

**Indicateur visuel :**
✅ (vert)

---

### 4.2 Niveau 1 — Confiance Élevée

**Définition :**
Règle générale applicable, données suffisantes, précédents concordants.

**Formulation :**
"Je recommande avec confiance que..."

**Critères :**
- Règle générale applicable au contexte
- Données suffisantes et cohérentes
- Précédents nombreux (≥ 30 cas)
- Précédents concordants (≥ 85% de cohérence)

**Exemples :**
- "Ce candidat présente les caractéristiques des profils qui réussissent dans ce contexte dans 80% des cas observés."
- "Ce soft skill est fortement présent d'après les réponses obtenues et les exemples fournis."
- "L'expérience de ce candidat correspond aux exigences du poste."

**Indicateur visuel :**
🟢 (vert clair)

---

### 4.3 Niveau 2 — Confiance Modérée

**Définition :**
Données partielles, analogies utilisées, précédents partiellement concordants.

**Formulation :**
"Je pense que... mais cela suppose que..." + liste des hypothèses posées

**Critères :**
- Données partielles mais cohérentes
- Analogies utilisées avec précaution
- Précédents modérés (10-30 cas)
- Précédents partiellement concordants (70-85% de cohérence)

**Exemples :**
- "Ce soft skill semble fort d'après les réponses obtenues, mais je n'ai pas pu le vérifier avec un exemple concret."
- "Ce candidat pourrait réussir dans ce contexte, mais cela suppose que l'environnement de travail soit stable."
- "L'expérience de ce candidat est pertinente, mais cela suppose que les compétences techniques demandées restent inchangées."

**Indicateur visuel :**
🟡 (jaune)

---

### 4.4 Niveau 3 — Confiance Faible

**Définition :**
Données insuffisantes, analogies fragiles, peu ou pas de précédents.

**Formulation :**
"Je formule une hypothèse de travail qui doit être vérifiée avant décision. Ce que je ne sais pas : [liste]. Ce qui permettrait de lever cette incertitude : [actions]"

**Critères :**
- Données insuffisantes ou fragmentées
- Analogies fragiles ou limitées
- Précédents limités (< 10 cas)
- Précédents peu concordants (< 70% de cohérence)

**Exemples :**
- "Ce candidat pourrait avoir un bon fit culturel, mais je n'ai pas assez d'informations sur sa personnalité. Ce que je ne sais pas : son style de communication, sa réaction au stress. Ce qui permettrait de lever cette incertitude : entretien comportemental, test de personnalité."
- "Ce profil pourrait correspondre aux attentes, mais cela suppose que le poste évolue comme prévu. Ce que je ne sais pas : la roadmap du poste, les priorités de l'équipe. Ce qui permettrait de lever cette incertitude : entretien avec le manager, description détaillée du poste."

**Indicateur visuel :**
🟠 (orange)

---

### 4.5 Niveau 4 — Incapacité à Évaluer

**Définition :**
Données absentes, cas hors périmètre, incertitude fondamentale irréductible.

**Formulation :**
"Je ne peux pas évaluer ce point avec les données disponibles. Ce n'est pas une limite temporaire. Voici pourquoi : [explication]. Voici ce qu'il faut faire : [actions]"

**Critères :**
- Données absentes ou inaccessibles
- Cas hors périmètre du système
- Incertitude fondamentale irréductible
- Aucun précédent applicable

**Exemples :**
- "Je ne peux pas évaluer la motivation profonde de ce candidat avec les données disponibles. Ce n'est pas une limite temporaire. Voici pourquoi : les motivations profondes nécessitent des informations que je ne peux obtenir (psychologie personnelle, contexte de vie). Voici ce qu'il faut faire : entretien approfondi avec un psychologue, période d'essai prolongée."
- "Je ne peux pas prédire la performance future de ce candidat avec certitude. Ce n'est pas une limite temporaire. Voici pourquoi : la performance dépend de facteurs externes imprévisibles (changement de contexte, événements personnels). Voici ce qu'il faut faire : décision sous incertitude assumée, suivi rapproché."

**Indicateur visuel :**
🔴 (rouge)

---

## 5. Structure de Données (TypeScript)

```typescript
interface UncertaintyLevel {
  level: 0 | 1 | 2 | 3 | 4;
  name: string;
  definition: string;
  formulation: string;
  
  criteria: {
    dataQuality: 'complete' | 'sufficient' | 'partial' | 'insufficient' | 'absent';
    precedentCount: number;
    precedentConsistency: number;
    ruleApplicability: 'explicit' | 'general' | 'analogous' | 'fragile' | 'none';
  };
  
  sources: {
    insufficientData?: boolean;
    ambiguousData?: boolean;
    humanComplexity?: boolean;
    unknownContext?: boolean;
  };
  
  examples: string[];
  
  visualIndicator: string;
}

interface UncertaintyAssessment {
  assessmentId: string;
  evaluatedAt: Date;
  
  uncertaintyLevel: UncertaintyLevel;
  
  evaluation: {
    statement: string;
    confidence: number;
    assumptions: string[];
    unknowns: string[];
    actionsToReduceUncertainty: string[];
  };
  
  metadata: {
    evaluatedBy: string;
    context: string;
    version: string;
  };
}
```

---

## 6. Algorithme de Mesure de l'Incertitude

### 6.1 Processus Global

```typescript
async function measureUncertainty(evaluation: Evaluation): Promise<UncertaintyAssessment> {
  // 1. Analyse de la qualité des données
  const dataQuality = await analyzeDataQuality(evaluation);
  
  // 2. Analyse des précédents
  const precedentAnalysis = await analyzePrecedents(evaluation);
  
  // 3. Identification des sources d'incertitude
  const uncertaintySources = await identifyUncertaintySources(evaluation);
  
  // 4. Calcul du niveau d'incertitude
  const uncertaintyLevel = await calculateUncertaintyLevel(dataQuality, precedentAnalysis, uncertaintySources);
  
  // 5. Construction de l'évaluation
  const assessment: UncertaintyAssessment = {
    assessmentId: generateAssessmentId(),
    evaluatedAt: new Date(),
    uncertaintyLevel,
    evaluation: {
      statement: await formulateStatement(uncertaintyLevel, evaluation),
      confidence: await calculateConfidence(uncertaintyLevel),
      assumptions: await extractAssumptions(evaluation),
      unknowns: await extractUnknowns(evaluation),
      actionsToReduceUncertainty: await proposeActions(uncertaintyLevel, evaluation)
    },
    metadata: {
      evaluatedBy: 'MVP-030 Uncertainty Management Engine',
      context: evaluation.context,
      version: '1.0'
    }
  };
  
  return assessment;
}
```

---

### 6.2 Calcul du Niveau d'Incertitude

```typescript
async function calculateUncertaintyLevel(
  dataQuality: DataQuality,
  precedentAnalysis: PrecedentAnalysis,
  uncertaintySources: UncertaintySource[]
): Promise<UncertaintyLevel> {
  let score = 0;
  
  // Évaluation de la qualité des données
  if (dataQuality.quality === 'complete') score += 0;
  else if (dataQuality.quality === 'sufficient') score += 1;
  else if (dataQuality.quality === 'partial') score += 2;
  else if (dataQuality.quality === 'insufficient') score += 3;
  else if (dataQuality.quality === 'absent') score += 4;
  
  // Évaluation des précédents
  if (precedentAnalysis.count >= 50 && precedentAnalysis.consistency >= 0.95) score += 0;
  else if (precedentAnalysis.count >= 30 && precedentAnalysis.consistency >= 0.85) score += 1;
  else if (precedentAnalysis.count >= 10 && precedentAnalysis.consistency >= 0.70) score += 2;
  else if (precedentAnalysis.count < 10 || precedentAnalysis.consistency < 0.70) score += 3;
  else score += 4;
  
  // Évaluation des sources d'incertitude
  if (uncertaintySources.length === 0) score += 0;
  else if (uncertaintySources.length === 1) score += 1;
  else if (uncertaintySources.length === 2) score += 2;
  else if (uncertaintySources.length === 3) score += 3;
  else score += 4;
  
  // Détermination du niveau
  const level = Math.min(4, Math.floor(score / 3));
  
  return getUncertaintyLevel(level);
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE uncertainty_assessment (
  id VARCHAR(36) PRIMARY KEY,
  evaluated_at TIMESTAMP NOT NULL,
  
  uncertainty_level INT NOT NULL CHECK (uncertainty_level BETWEEN 0 AND 4),
  uncertainty_level_name VARCHAR(50) NOT NULL,
  
  evaluation JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_uncertainty_assessment_level ON uncertainty_assessment(uncertainty_level);
CREATE INDEX idx_uncertainty_assessment_date ON uncertainty_assessment(evaluated_at);
```

---

## 8. API Endpoints

```typescript
// POST /api/uncertainty/measure
async function measureUncertainty(evaluation: Evaluation): Promise<UncertaintyAssessment> {
  return await measureUncertainty(evaluation);
}

// GET /api/uncertainty/assessment/:assessmentId
async function getUncertaintyAssessment(assessmentId: string): Promise<UncertaintyAssessment> {
  return await getUncertaintyAssessmentById(assessmentId);
}

// GET /api/uncertainty/levels
async function getUncertaintyLevels(): Promise<UncertaintyLevel[]> {
  return await getUncertaintyLevels();
}

// GET /api/uncertainty/levels/:level
async function getUncertaintyLevelByLevel(level: number): Promise<UncertaintyLevel> {
  return await getUncertaintyLevelByLevel(level);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de certitude maximale | Évaluations niveau 0 / total | ≥ 20% |
- Taux de confiance élevée | Évaluations niveau 1 / total | ≥ 40% |
- Taux de confiance modérée | Évaluations niveau 2 / total | ≤ 25% |
- Taux de confiance faible | Évaluations niveau 3 / total | ≤ 10% |
- Taux d'incapacité à évaluer | Évaluations niveau 4 / total | ≤ 5% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Précision des évaluations | Précision des évaluations par niveau | ≥ 85% |
- Satisfaction recruteurs | Satisfaction avec la communication de l'incertitude | ≥ 4.5/5 |
- Confiance dans le système | Confiance des utilisateurs dans le système | ≥ 4.5/5 |

---

## 10. Conclusion

Le modèle des 5 niveaux d'incertitude structure la mesure de l'incertitude pour chaque évaluation produite par le moteur. Les 5 niveaux (certitude maximale, confiance élevée, confiance modérée, confiance faible, incapacité à évaluer) permettent une communication transparente de la confiance et des limites de connaissance, assurant une discipline épistémique qui construit la confiance sur le long terme.

**Points clés :**
- 5 niveaux d'incertitude
- 4 sources d'incertitude identifiées
- Formulations explicites par niveau
- Critères objectifs pour chaque niveau
- Indicateurs visuels pour chaque niveau
- Communication transparente des limites
- Algorithme de mesure de l'incertitude
- Intégration avec les modules existants
