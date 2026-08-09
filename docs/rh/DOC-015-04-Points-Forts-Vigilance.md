# DOC-015-04 : Points Forts et Vigilance

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'extraction des points forts et points de vigilance pour MVP-015 Debrief Expert. Ce système compile les points forts et les signaux de vigilance de toutes les sources de données pour produire une liste argumentée avec preuves concrètes.

---

## 2. Principe Fondateur

Les points forts et points de vigilance ne sont pas des impressions subjectives. Chaque point doit être étayé par une preuve concrète : citation exacte de l'entretien, exemple concret cité par le candidat, ou signal comportemental observé.

---

## 3. Extraction des Points Forts

### 3.1 Sources de Points Forts

| Source | Type de points forts | Extraction |
|--------|---------------------|------------|
| MVP-013 Interview Intelligence | Points forts techniques, expérience, comportement | Synthèse entretien |
| MVP-014 Soft Skills Intelligence | Points forts soft skills | Synthèse soft skills |
| MVP-001 CV Intelligence | Compétences, expérience, formation | Analyse CV |
| MVP-002 Matching Engine | Adéquation compétences/poste | Matching score |

### 3.2 Catégories de Points Forts

**Compétences Techniques :**
- Maîtrise exceptionnelle d'une compétence clé
- Capacité à innover ou résoudre des problèmes complexes
- Résultats techniques remarquables

**Expérience :**
- Expérience parfaitement alignée avec le poste
- Progression de carrière rapide et cohérente
- Réalisations notables dans des contextes similaires

**Soft Skills :**
- Soft skills exceptionnels (score ≥ 4)
- Leadership ou influence démontrée
- Capacité d'adaptation ou résilience remarquable

**Culture :**
- Alignement parfait avec les valeurs de l'entreprise
- Style de travail idéal pour l'équipe
- Capacité d'intégration rapide

**Potentiel :**
- Signaux de potentiel élevé
- Vision stratégique claire et réaliste
- Capacité d'apprentissage rapide

### 3.3 Algorithme d'Extraction

```typescript
async function extractStrengths(data: DebriefData): Promise<StrengthPoint[]> {
  const strengths: StrengthPoint[] = [];
  
  // Points forts de l'entretien (MVP-013)
  const interviewStrengths = await extractInterviewStrengths(data);
  strengths.push(...interviewStrengths);
  
  // Points forts soft skills (MVP-014)
  const softSkillsStrengths = await extractSoftSkillsStrengths(data);
  strengths.push(...softSkillsStrengths);
  
  // Points forts CV (MVP-001)
  const cvStrengths = await extractCVStrengths(data);
  strengths.push(...cvStrengths);
  
  // Points forts matching (MVP-002)
  const matchingStrengths = await extractMatchingStrengths(data);
  strengths.push(...matchingStrengths);
  
  // Déduplication
  const uniqueStrengths = await deduplicateStrengths(strengths);
  
  // Classement par pertinence
  const rankedStrengths = await rankStrengths(uniqueStrengths, data);
  
  // Limitation à 5 points forts
  return rankedStrengths.slice(0, 5);
}

async function extractInterviewStrengths(data: DebriefData): Promise<StrengthPoint[]> {
  const strengths: StrengthPoint[] = [];
  const summary = data.interviewSummary;
  
  // Points forts techniques
  for (const strength of summary.strengths.technical) {
    const evidence = await findEvidenceForStrength(strength, data.responses);
    strengths.push({
      category: 'technical',
      point: strength,
      example: evidence.example,
      citation: evidence.citation,
      source: 'interview'
    });
  }
  
  // Points forts expérience
  for (const strength of summary.strengths.experience) {
    const evidence = await findEvidenceForStrength(strength, data.responses);
    strengths.push({
      category: 'experience',
      point: strength,
      example: evidence.example,
      citation: evidence.citation,
      source: 'interview'
    });
  }
  
  // Points forts comportement
  for (const strength of summary.strengths.behavioral) {
    const evidence = await findEvidenceForStrength(strength, data.responses);
    strengths.push({
      category: 'behavioral',
      point: strength,
      example: evidence.example,
      citation: evidence.citation,
      source: 'interview'
    });
  }
  
  return strengths;
}

async function extractSoftSkillsStrengths(data: DebriefData): Promise<StrengthPoint[]> {
  const strengths: StrengthPoint[] = [];
  const summary = data.softSkillsSummary;
  
  // Soft skills avec score ≥ 4
  for (const strength of summary.strengths) {
    if (strength.rating >= 4) {
      const evidence = await findEvidenceForSoftSkill(strength, data.behavioralEvidence);
      strengths.push({
        category: 'soft_skill',
        point: `${strength.skillName} : ${strength.rating}/5`,
        example: evidence.example,
        citation: evidence.citation,
        source: 'soft_skills'
      });
    }
  }
  
  return strengths;
}

async function extractCVStrengths(data: DebriefData): Promise<StrengthPoint[]> {
  const strengths: StrengthPoint[] = [];
  const cvAnalysis = data.cvAnalysis;
  
  // Compétences exceptionnelles
  for (const skill of cvAnalysis.skills) {
    if (skill.level >= 4) {
      strengths.push({
        category: 'technical',
        point: `Maîtrise exceptionnelle en ${skill.name}`,
        example: `Niveau ${skill.level}/5, ${skill.yearsOfExperience} ans d'expérience`,
        citation: '',
        source: 'cv'
      });
    }
  }
  
  // Expérience remarquable
  for (const exp of cvAnalysis.experience) {
    if (exp.duration >= 3 && exp.level === 'senior') {
      strengths.push({
        category: 'experience',
        point: `Expérience senior de ${exp.duration} ans en ${exp.role}`,
        example: exp.company,
        citation: '',
        source: 'cv'
      });
    }
  }
  
  return strengths;
}

async function extractMatchingStrengths(data: DebriefData): Promise<StrengthPoint[]> {
  const strengths: StrengthPoint[] = [];
  const matchingScore = data.cvAnalysis.matchingScore;
  
  if (matchingScore >= 80) {
    strengths.push({
      category: 'alignment',
      point: `Adéquation exceptionnelle avec le poste (${matchingScore}%)`,
      example: 'Matching score élevé',
      citation: '',
      source: 'matching'
    });
  }
  
  return strengths;
}
```

---

## 4. Extraction des Points de Vigilance

### 4.1 Sources de Points de Vigilance

| Source | Type de points de vigilance | Extraction |
|--------|---------------------------|------------|
| MVP-013 Interview Intelligence | Signaux de vigilance, incohérences | Détection signaux |
| MVP-014 Soft Skills Animation | Soft skills faibles (score ≤ 2) | Cotations soft skills |
| MVP-001 CV Intelligence | Incohérences CV, mobilité excessive | Analyse CV |
| MVP-002 Matching Engine | Lacunes compétences | Matching score |

### 4.2 Catégories de Points de Vigilance

**Compétences Techniques :**
- Lacunes sur des compétences clés
- Incohérence entre CV et entretien
- Incapacité à expliquer des réalisations

**Expérience :**
- Expérience non pertinente
- Mobilité excessive sans justification
- Progression incohérente

**Soft Skills :**
- Soft skills critiques faibles (score ≤ 2)
- Signaux de risque (critique employeurs, discours victimaire)
- Inadéquation culturelle

**Comportement :**
- Signaux de surjeu (réponses trop parfaites)
- Signaux de flou (réponses vagues sans exemple)
- Signaux d'incohérence

**Risque :**
- Critique systématique des employeurs
- Ambition déconnectée de la réalité
- Attentes salariales irréalistes

### 4.3 Algorithme d'Extraction

```typescript
async function extractVigilancePoints(data: DebriefData): Promise<VigilancePoint[]> {
  const vigilancePoints: VigilancePoint[] = [];
  
  // Signaux de vigilance de l'entretien (MVP-013)
  const interviewVigilance = await extractInterviewVigilance(data);
  vigilancePoints.push(...interviewVigilance);
  
  // Soft skills faibles (MVP-014)
  const softSkillsVigilance = await extractSoftSkillsVigilance(data);
  vigilancePoints.push(...softSkillsVigilance);
  
  // Incohérences CV (MVP-001)
  const cvVigilance = await extractCVVigilance(data);
  vigilancePoints.push(...cvVigilance);
  
  // Lacunes matching (MVP-002)
  const matchingVigilance = await extractMatchingVigilance(data);
  vigilancePoints.push(...matchingVigilance);
  
  // Détermination de la criticité
  for (const point of vigilancePoints) {
    point.criticality = await determineCriticality(point, data);
    point.impact = await determineImpact(point, data);
  }
  
  // Classement par criticité
  const rankedVigilance = await rankVigilancePoints(vigilancePoints);
  
  // Limitation à 5 points de vigilance
  return rankedVigilance.slice(0, 5);
}

async function extractInterviewVigilance(data: DebriefData): Promise<VigilancePoint[]> {
  const vigilancePoints: VigilancePoint[] = [];
  const signalDetections = data.signalDetections;
  
  for (const detection of signalDetections) {
    for (const signal of detection.vigilanceSignals.detected) {
      vigilancePoints.push({
        category: 'behavioral',
        point: signal,
        signal: signal,
        criticality: 'minor', // Sera redéterminé plus tard
        impact: '',
        source: 'interview'
      });
    }
  }
  
  return vigilancePoints;
}

async function extractSoftSkillsVigilance(data: DebriefData): Promise<VigilancePoint[]> {
  const vigilancePoints: VigilancePoint[] = [];
  const summary = data.softSkillsSummary;
  
  // Soft skills avec score ≤ 2
  for (const weakness of summary.improvementAreas) {
    if (weakness.rating <= 2) {
      const grid = await getSoftSkillsGrid(data.interviewId);
      const skillInGrid = grid.skills.find(s => s.skillId === weakness.skillId);
      
      vigilancePoints.push({
        category: 'soft_skill',
        point: `${weakness.skillName} : ${weakness.rating}/5`,
        signal: weakness.gaps.join(', '),
        criticality: skillInGrid && skillInGrid.importance === 'critical' ? 'blocking' : 'significant',
        impact: `Soft skill ${weakness.skillName} insuffisant pour le poste`,
        source: 'soft_skills'
      });
    }
  }
  
  return vigilancePoints;
}

async function extractCVVigilance(data: DebriefData): Promise<VigilancePoint[]> {
  const vigilancePoints: VigilancePoint[] = [];
  const cvAnalysis = data.cvAnalysis;
  
  // Incohérences CV
  for (const inconsistency of cvAnalysis.inconsistencies) {
    vigilancePoints.push({
      category: 'cv',
      point: `Incohérence CV : ${inconsistency.description}`,
      signal: inconsistency.details,
      criticality: 'significant',
      impact: 'Incohérence entre CV et entretien',
      source: 'cv'
    });
  }
  
  // Mobilité excessive
  if (cvAnalysis.averageTenure < 1.5) {
    vigilancePoints.push({
      category: 'experience',
      point: 'Mobilité excessive',
      signal: `Durée moyenne dans les postes : ${cvAnalysis.averageTenure} ans`,
      criticality: 'significant',
      impact: 'Risque de départ rapide',
      source: 'cv'
    });
  }
  
  return vigilancePoints;
}

async function extractMatchingVigilance(data: DebriefData): Promise<VigilancePoint[]> {
  const vigilancePoints: VigilancePoint[] = [];
  const matchingScore = data.cvAnalysis.matchingScore;
  
  if (matchingScore < 50) {
    vigilancePoints.push({
      category: 'alignment',
      point: `Adéquation faible avec le poste (${matchingScore}%)`,
      signal: 'Matching score faible',
      criticality: 'blocking',
      impact: 'Lacunes significatives sur les compétences requises',
      source: 'matching'
    });
  }
  
  return vigilancePoints;
}
```

---

## 5. Détermination de la Criticité

### 5.1 Niveaux de Criticité

| Niveau | Description | Impact sur décision |
|--------|-------------|---------------------|
| Bloquant | Empêche la recommandation | Recommandation impossible |
| Significatif | Nécessite une condition ou un suivi | Recommandation avec réserves |
| Mineur | Note pour information | Pas d'impact sur décision |

### 5.2 Algorithme de Détermination

```typescript
async function determineCriticality(point: VigilancePoint, data: DebriefData): Promise<'blocking' | 'significant' | 'minor'> {
  // Critères bloquants
  if (point.category === 'soft_skill' && point.criticality === 'blocking') {
    return 'blocking';
  }
  
  if (point.category === 'alignment' && point.criticality === 'blocking') {
    return 'blocking';
  }
  
  if (point.category === 'cv' && point.criticality === 'blocking') {
    return 'blocking';
  }
  
  // Critères significatifs
  if (point.category === 'soft_skill' && point.criticality === 'significant') {
    return 'significant';
  }
  
  if (point.category === 'experience' && point.criticality === 'significant') {
    return 'significant';
  }
  
  if (point.category === 'behavioral' && point.signal.includes('risque')) {
    return 'significant';
  }
  
  // Critères mineurs par défaut
  return 'minor';
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface StrengthPoint {
  category: 'technical' | 'experience' | 'behavioral' | 'soft_skill' | 'alignment';
  point: string;
  example: string;
  citation?: string;
  source: 'interview' | 'soft_skills' | 'cv' | 'matching';
  relevance: number; // 0-1
}

interface VigilancePoint {
  category: 'technical' | 'experience' | 'behavioral' | 'soft_skill' | 'cv' | 'alignment';
  point: string;
  signal: string;
  criticality: 'blocking' | 'significant' | 'minor';
  impact: string;
  source: 'interview' | 'soft_skills' | 'cv' | 'matching';
}

interface StrengthsAndVigilance {
  extractionId: string;
  interviewId: string;
  extractedAt: Date;
  
  strengths: StrengthPoint[];
  vigilancePoints: VigilancePoint[];
  
  validation: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Date;
    comments?: string;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE strengths_and_vigilance (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  extracted_at TIMESTAMP NOT NULL,
  
  strengths JSON NOT NULL,
  vigilance_points JSON NOT NULL,
  
  validated BOOLEAN DEFAULT FALSE,
  validated_by VARCHAR(36),
  validated_at TIMESTAMP,
  validation_comments TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id)
);

CREATE INDEX idx_sav_interview ON strengths_and_vigilance(interview_id);
```

---

## 8. API Endpoints

```typescript
// POST /api/strengths-vigilance/extract
async function extractStrengthsAndVigilance(interviewId: string): Promise<StrengthsAndVigilance> {
  return await extractStrengthsAndVigilance(interviewId);
}

// GET /api/strengths-vigilance/:id
async function getStrengthsAndVigilance(id: string): Promise<StrengthsAndVigilance> {
  return await getExtractionById(id);
}

// GET /api/strengths-vigilance/interview/:interviewId
async function getStrengthsAndVigilanceByInterview(interviewId: string): Promise<StrengthsAndVigilance> {
  return await getExtractionByInterviewId(interviewId);
}

// PUT /api/strengths-vigilance/:id
async function updateStrengthsAndVigilance(id: string, data: Partial<StrengthsAndVigilance>): Promise<StrengthsAndVigilance> {
  return await modifyExtraction(id, data);
}

// POST /api/strengths-vigilance/:id/validate
async function validateStrengthsAndVigilance(id: string, validation: StrengthsAndVigilance['validation']): Promise<void> {
  return await markAsValidated(id, validation);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques d'Extraction

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'extraction | Extractions réussies / tentatives | 100% |
| Taux de preuves | Points avec preuves / total | 100% |
| Taux de citations exactes | Citations exactes / total citations | 100% |
| Précision de la criticité | Criticité correcte / total | ≥ 90% |

### 9.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Points utilisés dans debrief / extraits | ≥ 95% |
| Satisfaction recruteur | Satisfaction avec les points extraits | ≥ 4.5/5 |
| Impact sur décision | Décisions influencées par points / total | ≥ 80% |

---

## 10. Conclusion

L'extraction des points forts et points de vigilance compile les données de toutes les sources pour produire une liste argumentée avec preuves concrètes. Chaque point est classé par criticité pour guider la décision finale.

**Points clés :**
- 5 catégories de points forts (technique, expérience, comportemental, soft skill, alignement)
- 5 catégories de points de vigilance (technique, expérience, comportemental, soft skill, CV, alignement)
- Preuve obligatoire pour chaque point (exemple concret, citation exacte)
- 3 niveaux de criticité (bloquant, significatif, mineur)
- Extraction automatique de multiples sources (MVP-013, MVP-014, MVP-001, MVP-002)
- Déduplication et classement par pertinence
- Limitation à 5 points forts et 5 points de vigilance
