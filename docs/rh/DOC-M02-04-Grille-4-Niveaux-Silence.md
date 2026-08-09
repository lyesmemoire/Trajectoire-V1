# DOC-M02-04 : Grille des 4 Niveaux de Silence

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la grille des 4 niveaux de silence pour le MVP-META-02 Silence Intelligence Engine. Ce document structure les niveaux de silence et leurs implications pour l'évaluation du candidat.

---

## 2. Principe Fondateur

Le moteur identifie les sujets attendus non mentionnés par le candidat et les classe selon 4 niveaux de gravité. Chaque niveau a des implications spécifiques pour l'évaluation et le scoring.

---

## 3. Grille des 4 Niveaux de Silence

### 3.1 SILENCE NIVEAU 1 — Absence Isolée

**Définition :**
1 sujet attendu non mentionné.

**Caractéristiques :**
- Peut être normal selon le contexte
- Sujet non critique pour le poste
- Absence isolée sans pattern

**Implications :**
- Note discrète dans le debrief
- Pas d'alerte
- Pas d'impact sur le scoring

**Action recommandée :**
- À explorer si second entretien
- Surveillance dans les entretiens suivants

**Exemple :**
Candidat DRH qui ne mentionne pas la "diversité et inclusion" (sujet Catégorie B). Ce n'est pas critique pour le poste, mais peut être exploré dans un second entretien.

---

### 3.2 SILENCE NIVEAU 2 — Absence Notable

**Définition :**
2 à 3 sujets attendus non mentionnés.

**Caractéristiques :**
- Commence à être significatif
- Sujets potentiellement importants
- Pattern émergent

**Implications :**
- Signal dans le debrief
- Question à poser si second entretien
- Impact mineur sur le scoring (−1 à −2 points)

**Action recommandée :**
- Poser la question révélatrice associée
- Évaluer la réponse
- Ajuster le scoring si nécessaire

**Exemple :**
Candidat DRH qui ne mentionne ni "la diversité et inclusion" ni "l'employer branding" (2 sujets Catégorie B). Signal dans le debrief, question à poser en second entretien.

---

### 3.3 SILENCE NIVEAU 3 — Absence Significative

**Définition :**
4 à 5 sujets attendus non mentionnés.

**Caractéristiques :**
- Très inhabituels pour ce profil
- Sujets importants pour le poste
- Pattern clair d'évitement

**Implications :**
- Alerte dans le debrief
- Interprétations proposées
- Impact sur le scoring (−3 à −5 points)

**Action recommandée :**
- Poser les questions révélatrices associées
- Analyser les réponses
- Ajuster significativement le scoring
- Envisager un second entretien

**Exemple :**
Candidat DRH qui ne mentionne ni "le CSE", ni "les relations sociales", ni "la politique salariale", ni "le recrutement" (4 sujets Catégorie A). Alerte dans le debrief, impact significatif sur le scoring.

---

### 3.4 SILENCE NIVEAU 4 — Absence Critique

**Définition :**
Sujet fondamental pour le poste jamais mentionné.

**Caractéristiques :**
- Sujet critique pour le poste
- Absence inexplicable pour un candidat légitime
- Lacune ou évitement majeur

**Implications :**
- Alerte rouge dans le debrief
- Lacune ou évitement majeur identifié
- Impact majeur sur le scoring (−5 à −10 points)

**Action recommandée :**
- Poser immédiatement la question révélatrice
- Si réponse insuffisante : éliminer le candidat
- Si réponse satisfaisante : réévaluer mais maintenir l'alerte

**Exemple :**
Candidat DRH qui ne parle jamais du CSE (sujet fondamental pour un DRH). Alerte rouge, impact majeur sur le scoring, élimination probable si réponse insuffisante.

---

## 4. Processus de Classification

### 4.1 Détection des Silences

**Processus :**
1. Le moteur identifie les sujets attendus pour le poste
2. Le moteur compare avec les sujets effectivement mentionnés
3. Le moteur identifie les sujets non mentionnés

### 4.2 Classification par Niveau

**Processus :**
1. Compter le nombre de sujets non mentionnés
2. Vérifier si un sujet fondamental est absent
3. Classer selon la grille des 4 niveaux

### 4.3 Évaluation de l'Impact

**Processus :**
1. Pour chaque niveau, déterminer l'impact sur le scoring
2. Pour chaque niveau, déterminer l'action recommandée
3. Générer l'alerte appropriée dans le debrief

---

## 5. Matrice de Décision

### 5.1 Matrice par Type de Sujet

| Type de sujet | Niveau 1 | Niveau 2 | Niveau 3 | Niveau 4 |
|---------------|----------|----------|----------|----------|
| Catégorie A (90%+) | −1 point | −2 points | −4 points | −10 points |
| Catégorie B (60-90%) | 0 point | −1 point | −3 points | −8 points |
| Catégorie C (30-60%) | 0 point | 0 point | −2 points | −5 points |
| Fondamental | −2 points | −4 points | −6 points | −10 points |

### 5.2 Matrice par Action

| Niveau | Action | Impact scoring | Second entretien |
|--------|--------|----------------|------------------|
| Niveau 1 | Note discrète | 0 à −1 point | Optionnel |
| Niveau 2 | Signal + question | −1 à −2 points | Recommandé |
| Niveau 3 | Alerte + questions | −3 à −5 points | Fortement recommandé |
| Niveau 4 | Alerte rouge + question immédiate | −5 à −10 points | Obligatoire si réponse satisfaisante |

---

## 6. Structure de Données (TypeScript)

```typescript
interface SilenceLevel {
  levelId: string;
  level: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  
  characteristics: string[];
  implications: string[];
  recommendedAction: string;
  
  scoringImpact: {
    categoryA: number;
    categoryB: number;
    categoryC: number;
    fundamental: number;
  };
  
  secondInterview: 'optional' | 'recommended' | 'stronglyRecommended' | 'mandatory';
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface SilenceLevelGrid {
  gridId: string;
  
  levels: {
    level1: SilenceLevel;
    level2: SilenceLevel;
    level3: SilenceLevel;
    level4: SilenceLevel;
  };
  
  decisionMatrix: {
    bySubjectType: {
      categoryA: { level1: number; level2: number; level3: number; level4: number };
      categoryB: { level1: number; level2: number; level3: number; level4: number };
      categoryC: { level1: number; level2: number; level3: number; level4: number };
      fundamental: { level1: number; level2: number; level3: number; level4: number };
    };
    byAction: {
      level1: { action: string; impact: string; secondInterview: string };
      level2: { action: string; impact: string; secondInterview: string };
      level3: { action: string; impact: string; secondInterview: string };
      level4: { action: string; impact: string; secondInterview: string };
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface SilenceDetection {
  detectionId: string;
  interviewId: string;
  candidateId: string;
  positionId: string;
  
  detectedAt: Date;
  
  expectedTopics: string[];
  mentionedTopics: string[];
  unmentionedTopics: string[];
  
  classification: {
    level: 1 | 2 | 3 | 4;
    reason: string;
  };
  
  scoringImpact: number;
  recommendedAction: string;
  secondInterviewRequired: boolean;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE silence_level (
  id VARCHAR(36) PRIMARY KEY,
  level INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  
  characteristics JSON NOT NULL,
  implications JSON NOT NULL,
  recommended_action TEXT NOT NULL,
  scoring_impact JSON NOT NULL,
  second_interview VARCHAR(30) NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_silence_level_level ON silence_level(level);

CREATE TABLE silence_level_grid (
  id VARCHAR(36) PRIMARY KEY,
  
  levels JSON NOT NULL,
  decision_matrix JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE silence_detection (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  position_id VARCHAR(36) NOT NULL,
  
  detected_at TIMESTAMP NOT NULL,
  
  expected_topics JSON NOT NULL,
  mentioned_topics JSON NOT NULL,
  unmentioned_topics JSON NOT NULL,
  classification JSON NOT NULL,
  scoring_impact INT NOT NULL,
  recommended_action TEXT NOT NULL,
  second_interview_required BOOLEAN NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_silence_detection_interview ON silence_detection(interview_id);
CREATE INDEX idx_silence_detection_candidate ON silence_detection(candidate_id);
CREATE INDEX idx_silence_detection_position ON silence_detection(position_id);
```

---

## 8. API Endpoints

```typescript
// GET /api/silence-level-grid
async function getSilenceLevelGrid(): Promise<SilenceLevelGrid> {
  return await getSilenceLevelGrid();
}

// PUT /api/silence-level-grid
async function updateSilenceLevelGrid(grid: SilenceLevelGrid): Promise<SilenceLevelGrid> {
  return await updateSilenceLevelGrid(grid);
}

// GET /api/silence-level/:level
async function getSilenceLevel(level: number): Promise<SilenceLevel> {
  return await getSilenceLevelByLevel(level);
}

// POST /api/silence-detection/detect
async function detectSilences(interviewId: string): Promise<SilenceDetection> {
  return await detectSilences(interviewId);
}

// GET /api/silence-detection/:detectionId
async function getSilenceDetection(detectionId: string): Promise<SilenceDetection> {
  return await getSilenceDetectionById(detectionId);
}

// GET /api/silence-detection/interview/:interviewId
async function getSilenceDetectionByInterview(interviewId: string): Promise<SilenceDetection> {
  return await getSilenceDetectionByInterview(interviewId);
}

// POST /api/silence-detection/classify
async function classifySilence(unmentionedTopics: string[], positionType: string): Promise<{ level: number; reason: string }> {
  return await classifySilence(unmentionedTopics, positionType);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Entretiens avec silences détectés / total | ≥ 50% |
- Distribution des niveaux | Niveau 1 / Niveau 2 / Niveau 3 / Niveau 4 | Équilibrée |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Impact moyen sur scoring | Moyenne des impacts | ≤ −3 points |
- Taux de seconds entretiens | Seconds entretiens requis / total | ≤ 20% |

---

## 10. Conclusion

La grille des 4 niveaux de silence structure les niveaux de gravité des silences détectés. Niveau 1 : Absence isolée (1 sujet attendu non mentionné, note discrète, pas d'alerte, pas d'impact sur scoring). Niveau 2 : Absence notable (2-3 sujets attendus non mentionnés, signal dans debrief, question à poser si second entretien, impact mineur −1 à −2 points). Niveau 3 : Absence significative (4-5 sujets attendus non mentionnés, alerte dans debrief, interprétations proposées, impact sur scoring −3 à −5 points). Niveau 4 : Absence critique (sujet fondamental jamais mentionné, alert rouge, lacune ou évitement majeur, impact majeur −5 à −10 points). Processus de classification : Détection des silences, Classification par niveau, Évaluation de l'impact. Matrice de décision par type de sujet et par action. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 niveaux de silence
- Niveau 1 : Absence isolée
- Niveau 2 : Absence notable
- Niveau 3 : Absence significative
- Niveau 4 : Absence critique
- Implications par niveau
- Impact sur scoring par niveau
- Action recommandée par niveau
- Matrice de décision
- Processus de classification
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de détection et d'impact
