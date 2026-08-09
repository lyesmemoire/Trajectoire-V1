# DOC-020-03 : Scoring de Cohérence Référence / Entretien

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de scoring de cohérence référence / entretien pour MVP-020 Reference Intelligence. Ce système compare ce que le candidat a dit en entretien avec ce que les référents ont confirmé ou infirmé, produit un score de cohérence (Élevé / Moyen / Faible), et recommande des actions complémentaires si nécessaire.

---

## 2. Principe Fondateur

Le moteur compare ce que le candidat a dit en entretien avec ce que les référents ont confirmé ou infirmé, et produit un score de cohérence (Élevé / Moyen / Faible). Si cohérence faible, liste des points divergents, recommandation d'entretien complémentaire sur ces points spécifiques, et niveau de risque de la divergence (Mineur / Significatif / Bloquant).

---

## 3. Score de Cohérence

### 3.1 Niveaux de Cohérence

**Élevé — Cohérence forte :**
- Points forts confirmés par les références
- Expériences cohérentes avec le discours du candidat
- Pas de contradiction majeure
- Recommandations positives sans réserve
- Score : 80-100

**Moyen — Cohérence partielle :**
- Points forts partiellement confirmés
- Quelques divergences mineures
- Recommandations positives mais avec réserves
- Score : 50-79

**Faible — Cohérence faible :**
- Points forts non confirmés ou infirmés
- Divergences significatives
- Recommandations mitigées ou négatives
- Contradictions majeures
- Score : 0-49

---

### 3.2 Facteurs de Cohérence

**Facteurs positifs :**
- Confirmation des points forts déclarés
- Cohérence des expériences décrites
- Alignement des soft skills observés
- Recommandations positives sans réserve
- Absence de contradiction majeure

**Facteurs négatifs :**
- Infirmation des points forts déclarés
- Divergences sur les expériences
- Contradictions sur les soft skills
- Recommandations mitigées ou négatives
- Signaux d'alerte dans les références

---

## 4. Algorithme de Scoring de Cohérence

### 4.1 Processus Global

```typescript
async function calculateCoherenceScoring(candidateId: string, interviewId: string, referenceAnalysis: ReferenceAnalysis): Promise<CoherenceScoring> {
  // 1. Récupération des données d'entretien
  const interview = await getInterview(interviewId);
  
  // 2. Extraction des déclarations du candidat
  const candidateStatements = await extractCandidateStatements(interview);
  
  // 3. Extraction des confirmations des référents
  const refereeConfirmations = await extractRefereeConfirmations(referenceAnalysis);
  
  // 4. Comparaison et détection des divergences
  const divergences = await detectDivergences(candidateStatements, refereeConfirmations);
  
  // 5. Calcul du score de cohérence
  const coherenceScore = await calculateCoherenceScore(divergences, candidateStatements.length);
  
  // 6. Détermination du niveau de cohérence
  const coherenceLevel = await determineCoherenceLevel(coherenceScore);
  
  // 7. Génération des recommandations
  const recommendation = await generateRecommendation(divergences, coherenceLevel);
  
  // 8. Construction du scoring
  const scoring: CoherenceScoring = {
    scoringId: generateScoringId(),
    candidateId,
    interviewId,
    scoredAt: new Date(),
    
    coherenceScore: coherenceLevel,
    confidence: await calculateConfidence(divergences.length, candidateStatements.length),
    
    divergences,
    
    recommendation
  };
  
  // 9. Sauvegarde du scoring
  await saveCoherenceScoring(scoring);
  
  return scoring;
}
```

---

### 4.2 Extraction des Déclarations du Candidat

```typescript
async function extractCandidateStatements(interview: Interview): Promise<CandidateStatement[]> {
  const statements: CandidateStatement[] = [];
  
  for (const response of interview.responses) {
    // Extraction des points forts déclarés
    const strengths = await extractStrengths(response.text);
    for (const strength of strengths) {
      statements.push({
        type: 'strength',
        area: strength.area,
        statement: strength.statement,
        confidence: strength.confidence
      });
    }
    
    // Extraction des expériences décrites
    const experiences = await extractExperiences(response.text);
    for (const experience of experiences) {
      statements.push({
        type: 'experience',
        area: experience.area,
        statement: experience.statement,
        confidence: experience.confidence
      });
    }
    
    // Extraction des soft skills déclarés
    const softSkills = await extractSoftSkills(response.text);
    for (const softSkill of softSkills) {
      statements.push({
        type: 'soft_skill',
        area: softSkill.area,
        statement: softSkill.statement,
        confidence: softSkill.confidence
      });
    }
  }
  
  return statements;
}

async function extractStrengths(text: string): Promise<{ area: string; statement: string; confidence: number }[]> {
  const strengths: { area: string; statement: string; confidence: number }[] = [];
  
  const strengthIndicators = [
    { pattern: /je suis (très )?bon en/i, area: 'compétence' },
    { pattern: /mes points forts sont/i, area: 'points_forts' },
    { pattern: /j'ai réussi à/i, area: 'réussite' },
    { pattern: /j'ai obtenu/i, area: 'réussite' }
  ];
  
  for (const indicator of strengthIndicators) {
    const matches = text.match(indicator.pattern);
    if (matches) {
      strengths.push({
        area: indicator.area,
        statement: matches[0],
        confidence: 0.8
      });
    }
  }
  
  return strengths;
}
```

---

### 4.3 Extraction des Confirmations des Référents

```typescript
async function extractRefereeConfirmations(referenceAnalysis: ReferenceAnalysis): Promise<RefereeConfirmation[]> {
  const confirmations: RefereeConfirmation[] = [];
  
  for (const refereeResponse of referenceAnalysis.refereeResponses) {
    for (const response of refereeResponse.responses) {
      // Extraction des confirmations
      const confirmationsExtracted = await extractConfirmationsFromResponse(response.answer);
      
      for (const confirmation of confirmationsExtracted) {
        confirmations.push({
          refereeId: refereeResponse.refereeId,
          refereeName: refereeResponse.refereeName,
          area: confirmation.area,
          statement: confirmation.statement,
          type: confirmation.type, // 'confirmed' | 'infirmed' | 'neutral'
          confidence: confirmation.confidence
        });
      }
    }
  }
  
  return confirmations;
}

async function extractConfirmationsFromResponse(text: string): Promise<{ area: string; statement: string; type: string; confidence: number }[]> {
  const confirmations: { area: string; statement: string; type: string; confidence: number }[] = [];
  
  // Détection des confirmations positives
  const positiveIndicators = [
    { pattern: /excellent/i, area: 'général', type: 'confirmed' },
    { pattern: /très bon/i, area: 'général', type: 'confirmed' },
    { pattern: /je le recruterai/i, area: 'recommandation', type: 'confirmed' },
    { pattern: /sans hésitation/i, area: 'recommandation', type: 'confirmed' }
  ];
  
  for (const indicator of positiveIndicators) {
    const matches = text.match(indicator.pattern);
    if (matches) {
      confirmations.push({
        area: indicator.area,
        statement: matches[0],
        type: indicator.type,
        confidence: 0.9
      });
    }
  }
  
  // Détection des infirmations
  const negativeIndicators = [
    { pattern: /je ne recommande pas/i, area: 'recommandation', type: 'infirmed' },
    { pattern: /problème/i, area: 'général', type: 'infirmed' },
    { pattern: /difficile/i, area: 'général', type: 'infirmed' }
  ];
  
  for (const indicator of negativeIndicators) {
    const matches = text.match(indicator.pattern);
    if (matches) {
      confirmations.push({
        area: indicator.area,
        statement: matches[0],
        type: indicator.type,
        confidence: 0.9
      });
    }
  }
  
  return confirmations;
}
```

---

### 4.4 Détection des Divergences

```typescript
async function detectDivergences(candidateStatements: CandidateStatement[], refereeConfirmations: RefereeConfirmation[]): Promise<Divergence[]> {
  const divergences: Divergence[] = [];
  
  // Comparaison par domaine
  const areas = [...new Set([...candidateStatements.map(s => s.area), ...refereeConfirmations.map(c => c.area)])];
  
  for (const area of areas) {
    const candidateAreaStatements = candidateStatements.filter(s => s.area === area);
    const refereeAreaConfirmations = refereeConfirmations.filter(c => c.area === area);
    
    // Si le candidat a déclaré quelque chose mais les référents ne confirment pas
    if (candidateAreaStatements.length > 0 && refereeAreaConfirmations.length === 0) {
      divergences.push({
        area,
        candidateStatement: candidateAreaStatements[0].statement,
        refereeStatement: 'Non mentionné par les référents',
        severity: 'minor'
      });
    }
    
    // Si les référents infirment ce que le candidat a déclaré
    const infirmedConfirmations = refereeAreaConfirmations.filter(c => c.type === 'infirmed');
    if (infirmedConfirmations.length > 0) {
      divergences.push({
        area,
        candidateStatement: candidateAreaStatements[0].statement,
        refereeStatement: infirmedConfirmations[0].statement,
        severity: 'significant'
      });
    }
    
    // Si contradiction directe
    for (const candidateStatement of candidateAreaStatements) {
      for (const refereeConfirmation of refereeAreaConfirmations) {
        if (await isDirectContradiction(candidateStatement.statement, refereeConfirmation.statement)) {
          divergences.push({
            area,
            candidateStatement: candidateStatement.statement,
            refereeStatement: refereeConfirmation.statement,
            severity: 'blocking'
          });
        }
      }
    }
  }
  
  return divergences;
}

async function isDirectContradiction(candidateStatement: string, refereeStatement: string): Promise<boolean> {
  const contradictions = [
    { positive: /excellent/, negative: /problème/ },
    { positive: /très bon/, negative: /difficile/ },
    { positive: /leader/, negative: /pas leader/ },
    { positive: /autonome/, negative: /pas autonome/ }
  ];
  
  for (const contradiction of contradictions) {
    if (contradiction.positive.test(candidateStatement) && contradiction.negative.test(refereeStatement)) {
      return true;
    }
    if (contradiction.positive.test(refereeStatement) && contradiction.negative.test(candidateStatement)) {
      return true;
    }
  }
  
  return false;
}
```

---

### 4.5 Calcul du Score de Cohérence

```typescript
async function calculateCoherenceScore(divergences: Divergence[], totalStatements: number): Promise<number> {
  if (totalStatements === 0) {
    return 50; // Score neutre si pas de données
  }
  
  let score = 100;
  
  // Pénalité par divergence
  for (const divergence of divergences) {
    switch (divergence.severity) {
      case 'minor':
        score -= 10;
        break;
      case 'significant':
        score -= 25;
        break;
      case 'blocking':
        score -= 50;
        break;
    }
  }
  
  // Normalisation
  score = Math.max(0, Math.min(100, score));
  
  return score;
}

async function determineCoherenceLevel(score: number): Promise<'high' | 'medium' | 'low'> {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

async function calculateConfidence(divergenceCount: number, statementCount: number): Promise<number> {
  if (statementCount === 0) return 0;
  
  const ratio = divergenceCount / statementCount;
  const confidence = 1 - ratio;
  
  return Math.max(0, Math.min(1, confidence)) * 100;
}
```

---

### 4.6 Génération des Recommandations

```typescript
async function generateRecommendation(divergences: Divergence[], coherenceLevel: 'high' | 'medium' | 'low'): Promise<Recommendation> {
  const recommendation: Recommendation = {
    complementaryInterview: false,
    focusAreas: [],
    riskLevel: 'minor'
  };
  
  // Si cohérence faible ou divergences significatives
  if (coherenceLevel === 'low' || divergences.some(d => d.severity === 'significant' || d.severity === 'blocking')) {
    recommendation.complementaryInterview = true;
    
    // Zones de focus
    recommendation.focusAreas = divergences
      .filter(d => d.severity === 'significant' || d.severity === 'blocking')
      .map(d => d.area);
    
    // Niveau de risque
    if (divergences.some(d => d.severity === 'blocking')) {
      recommendation.riskLevel = 'blocking';
    } else if (divergences.some(d => d.severity === 'significant')) {
      recommendation.riskLevel = 'significant';
    } else {
      recommendation.riskLevel = 'minor';
    }
  }
  
  return recommendation;
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface CoherenceScoring {
  scoringId: string;
  candidateId: string;
  interviewId: string;
  scoredAt: Date;
  
  coherenceScore: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  
  divergences: Divergence[];
  
  recommendation: Recommendation;
}

interface Divergence {
  area: string;
  candidateStatement: string;
  refereeStatement: string;
  severity: 'minor' | 'significant' | 'blocking';
}

interface Recommendation {
  complementaryInterview: boolean;
  focusAreas: string[];
  riskLevel: 'minor' | 'significant' | 'blocking';
}

interface CandidateStatement {
  type: 'strength' | 'experience' | 'soft_skill';
  area: string;
  statement: string;
  confidence: number;
}

interface RefereeConfirmation {
  refereeId: string;
  refereeName: string;
  area: string;
  statement: string;
  type: 'confirmed' | 'infirmed' | 'neutral';
  confidence: number;
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE coherence_scoring (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  scored_at TIMESTAMP NOT NULL,
  
  coherence_score VARCHAR(20) NOT NULL,
  confidence INT NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  
  divergences JSON NOT NULL,
  
  recommendation JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id)
);

CREATE INDEX idx_coherence_scoring_candidate ON coherence_scoring(candidate_id);
CREATE INDEX idx_coherence_scoring_interview ON coherence_scoring(interview_id);
CREATE INDEX idx_coherence_scoring_score ON coherence_scoring(coherence_score);
```

---

## 7. API Endpoints

```typescript
// POST /api/reference-intelligence/coherence-scoring
async function calculateCoherenceScoring(candidateId: string, interviewId: string, referenceAnalysisId: string): Promise<CoherenceScoring> {
  const referenceAnalysis = await getReferenceAnalysisById(referenceAnalysisId);
  return await calculateCoherenceScoring(candidateId, interviewId, referenceAnalysis);
}

// GET /api/reference-intelligence/coherence-scoring/:scoringId
async function getCoherenceScoring(scoringId: string): Promise<CoherenceScoring> {
  return await getCoherenceScoringById(scoringId);
}

// GET /api/reference-intelligence/coherence-scoring/candidate/:candidateId
async function getCoherenceScoringByCandidate(candidateId: string): Promise<CoherenceScoring[]> {
  return await getCoherenceScoringHistory(candidateId);
}

// GET /api/reference-intelligence/coherence-scoring/interview/:interviewId
async function getCoherenceScoringByInterview(interviewId: string): Promise<CoherenceScoring> {
  return await getCoherenceScoringByInterviewId(interviewId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de calcul | Scoring calculés / références analysées | ≥ 90% |
| Taux de cohérence élevée | Cohérence élevée / total | ≥ 70% |
| Taux de détection de divergences | Divergences détectées / total | ≥ 30% |
| Satisfaction recruteur | Satisfaction avec le scoring | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des mauvais recrutements | Réduction après utilisation | ≥ 25% |
| Amélioration de la qualité des embauches | Performance à 1 an | ≥ 20% |
| Taux d'entretiens complémentaires | Entretiens complémentaires / divergences significatives | ≥ 80% |

---

## 9. Conclusion

Le scoring de cohérence référence / entretien compare ce que le candidat a dit en entretien avec ce que les référents ont confirmé ou infirmé, et produit un score de cohérence (Élevé / Moyen / Faible). Si cohérence faible, le système liste les points divergents, recommande un entretien complémentaire sur ces points spécifiques, et évalue le niveau de risque de la divergence (Mineur / Significatif / Bloquant).

**Points clés :**
- 3 niveaux de cohérence : Élevé, Moyen, Faible
- Extraction des déclarations du candidat (points forts, expériences, soft skills)
- Extraction des confirmations des référents (confirmées, infirmées, neutres)
- Détection des divergences par domaine
- Calcul du score de cohérence avec pénalités par divergence
- Recommandations d'action (entretien complémentaire, zones de focus, niveau de risque)
- Intégration avec les modules existants
