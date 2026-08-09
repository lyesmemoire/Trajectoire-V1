# DOC-014-02 : Moteur de Cotation Soft Skills

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le moteur de cotation soft skills pour MVP-014 Soft Skills Intelligence. Ce moteur attribue des scores de 1 à 5 pour chaque soft skill, basés exclusivement sur des preuves concrètes et comportementales observées.

---

## 2. Principe Fondateur

Un score ne peut être attribué QUE si une preuve concrète l'étaye. Pas d'impression, pas de ressenti. Des faits, des exemples, des preuves. C'est la règle fondamentale du moteur de cotation soft skills, inspirée des pratiques des grands cabinets.

---

## 3. Échelle de Cotation

### 3.1 Score 1 — Absent ou Négatif

**Description :** Aucune preuve. Signaux inverses détectés.

**Critères :**
- Aucun exemple concret fourni
- Discours générique ou théorique
- Signaux inverses détectés (comportements opposés au soft skill)
- Refus ou incapacité à répondre aux questions d'observation

**Exemples :**
- "Je suis un bon leader" sans exemple
- "Je travaille bien en équipe" sans preuve
- Usage excessif du "on/nous" diluant la responsabilité
- Critique systématique des autres (signe inverse de collaboration)

### 3.2 Score 2 — Faible

**Description :** Preuve partielle. Exemples flous. Discours générique sans cas concret.

**Critères :**
- Exemple fourni mais vague ou imprécis
- Discours générique sans détails concrets
- Preuve partielle ou incomplète
- Exemple sans contexte ou sans résultat

**Exemples :**
- "J'ai géré une équipe" sans détails sur comment
- "J'ai résolu un problème" sans description du problème ou de la solution
- Exemple sans chiffres ni résultats mesurables

### 3.3 Score 3 — Standard

**Description :** Preuve présente. Exemples corrects. Niveau attendu pour le poste.

**Critères :**
- Exemple concret fourni avec contexte
- Description claire de l'action et du résultat
- Niveau de performance attendu pour le poste
- Preuve cohérente avec le soft skill

**Exemples :**
- "J'ai géré une équipe de 5 personnes sur un projet de 6 mois"
- "J'ai résolu un problème de performance en mettant en place un nouveau processus"
- Résultat mesurable mais pas exceptionnel

### 3.4 Score 4 — Fort

**Description :** Preuve solide. Exemples précis et chiffrés. Au-dessus du niveau attendu.

**Critères :**
- Exemple concret avec détails précis
- Résultats chiffrés et mesurables
- Niveau de performance au-dessus du niveau attendu
- Preuve de plusieurs aspects du soft skill

**Exemples :**
- "J'ai géré une équipe de 10 personnes et augmenté la productivité de 20%"
- "J'ai résolu un problème complexe en réduisant les coûts de 30% et le délai de 50%"
- Preuve de leadership, communication, et résolution de problèmes

### 3.5 Score 5 — Exceptionnel

**Description :** Preuve remarquable. Pattern récurrent. Marqueur de potentiel élevé.

**Critères :**
- Exemple exceptionnel avec résultats remarquables
- Pattern récurrent de comportements positifs
- Preuve de potentiel élevé
- Impact significatif et mesurable

**Exemples :**
- "J'ai transformé une équipe sous-performante en équipe top-performer en 6 mois"
- "J'ai initié et mené un changement d'organisation qui a impacté 500 personnes"
- Preuve de vision stratégique, leadership, et résultats exceptionnels

---

## 4. Règle Fondamentale

### 4.1 Principe de Preuve Obligatoire

**Règle :** Un score ne peut être attribué QUE si une preuve concrète l'étaye.

**Implications :**
- Pas d'impression ou ressenti
- Pas de score basé sur le "feeling"
- Pas de score par défaut
- Si pas de preuve → Score 1 (Absent)

**Validation :**
- Chaque score doit être accompagné d'au moins une preuve concrète
- La preuve doit être observable et vérifiable
- La preuve doit être liée explicitement au soft skill

### 4.2 Types de Preuves Acceptées

| Type de Preuve | Description | Exemple |
|----------------|-------------|---------|
| Exemple concret | Description d'une situation spécifique | "Lors de mon projet X, j'ai..." |
| Résultat chiffré | Mesure quantitative du résultat | "J'ai augmenté les ventes de 20%" |
| Témoignage | Citation d'un tiers (collègue, manager) | "Mon manager a dit que..." |
| Pattern récurrent | Répétition d'un comportement positif | "Dans mes 3 derniers postes, j'ai..." |
| Reconnaissance | Prix, certification, promotion | "J'ai été promu pour..." |

---

## 5. Structure de Données (TypeScript)

```typescript
interface SoftSkillRating {
  ratingId: string;
  interviewId: string;
  candidateId: string;
  skillId: string;
  ratedAt: Date;
  ratedBy: string;
  
  score: number; // 1-5
  evidence: {
    type: 'concrete_example' | 'quantified_result' | 'testimony' | 'recurring_pattern' | 'recognition';
    description: string;
    context: string;
    source: 'candidate' | 'recruiter' | 'third_party';
  }[];
  
  justification: string;
  confidence: number; // 0-1
  
  validation: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Date;
    comments?: string;
  };
}

interface SoftSkillsScoringEngine {
  engineId: string;
  version: string;
  
  rating(rating: Omit<SoftSkillRating, 'ratingId' | 'ratedAt'>): Promise<SoftSkillRating>;
  
  validateScore(ratingId: string, validation: SoftSkillRating['validation']): Promise<void>;
  
  calculateGlobalScore(ratings: SoftSkillRating[], weights: Record<string, number>): number;
}
```

---

## 6. Algorithme de Cotation

### 6.1 Processus de Cotation

```typescript
async function rateSoftSkill(
  interviewId: string,
  skillId: string,
  responses: CandidateResponse[],
  observations: BehavioralObservation[]
): Promise<number> {
  // Étape 1 : Collecte des preuves
  const evidence = await collectEvidence(skillId, responses, observations);
  
  // Étape 2 : Si pas de preuve → Score 1
  if (evidence.length === 0) {
    return 1;
  }
  
  // Étape 3 : Évaluation de la qualité des preuves
  const evidenceQuality = await evaluateEvidenceQuality(evidence);
  
  // Étape 4 : Détermination du score
  const score = await determineScore(evidenceQuality);
  
  return score;
}

async function collectEvidence(
  skillId: string,
  responses: CandidateResponse[],
  observations: BehavioralObservation[]
): Promise<SoftSkillRating['evidence']> {
  const evidence: SoftSkillRating['evidence'] = [];
  
  // Recherche dans les réponses
  for (const response of responses) {
    const skillEvidence = await extractSkillEvidence(response, skillId);
    evidence.push(...skillEvidence);
  }
  
  // Recherche dans les observations comportementales
  for (const observation of observations) {
    if (observation.skillId === skillId) {
      evidence.push({
        type: 'concrete_example',
        description: observation.description,
        context: observation.context,
        source: 'recruiter'
      });
    }
  }
  
  return evidence;
}

async function evaluateEvidenceQuality(evidence: SoftSkillRating['evidence']): Promise<EvidenceQuality> {
  let quality: EvidenceQuality = {
    hasConcreteExample: false,
    hasQuantifiedResult: false,
    hasRecurringPattern: false,
    specificity: 0,
    completeness: 0,
    impact: 0
  };
  
  for (const ev of evidence) {
    // Vérification de l'exemple concret
    if (ev.type === 'concrete_example' && isSpecific(ev.description)) {
      quality.hasConcreteExample = true;
      quality.specificity += 0.3;
    }
    
    // Vérification du résultat chiffré
    if (ev.type === 'quantified_result') {
      quality.hasQuantifiedResult = true;
      quality.specificity += 0.4;
    }
    
    // Vérification du pattern récurrent
    if (ev.type === 'recurring_pattern') {
      quality.hasRecurringPattern = true;
      quality.completeness += 0.3;
    }
    
    // Évaluation de l'impact
    quality.impact += evaluateImpact(ev);
  }
  
  // Normalisation
  quality.specificity = Math.min(1, quality.specificity);
  quality.completeness = Math.min(1, quality.completeness);
  quality.impact = Math.min(1, quality.impact);
  
  return quality;
}

async function determineScore(evidenceQuality: EvidenceQuality): Promise<number> {
  // Score 1 : Pas de preuve
  if (!evidenceQuality.hasConcreteExample) {
    return 1;
  }
  
  // Score 2 : Preuve partielle
  if (evidenceQuality.specificity < 0.4 || evidenceQuality.completeness < 0.4) {
    return 2;
  }
  
  // Score 3 : Preuve standard
  if (evidenceQuality.specificity >= 0.4 && evidenceQuality.specificity < 0.7 &&
      evidenceQuality.completeness >= 0.4 && evidenceQuality.completeness < 0.7) {
    return 3;
  }
  
  // Score 4 : Preuve forte
  if (evidenceQuality.specificity >= 0.7 && evidenceQuality.specificity < 0.9 &&
      evidenceQuality.hasQuantifiedResult &&
      evidenceQuality.impact >= 0.6) {
    return 4;
  }
  
  // Score 5 : Preuve exceptionnelle
  if (evidenceQuality.specificity >= 0.9 &&
      evidenceQuality.hasRecurringPattern &&
      evidenceQuality.impact >= 0.8) {
    return 5;
  }
  
  return 3; // Par défaut
}

interface EvidenceQuality {
  hasConcreteExample: boolean;
  hasQuantifiedResult: boolean;
  hasRecurringPattern: boolean;
  specificity: number;
  completeness: number;
  impact: number;
}
```

---

## 7. Validation du Score

### 7.1 Processus de Validation

```typescript
async function validateScore(
  ratingId: string,
  validation: SoftSkillRating['validation']
): Promise<void> {
  // Récupération de la cotation
  const rating = await getRating(ratingId);
  
  // Vérification de la règle fondamentale
  if (rating.score > 1 && rating.evidence.length === 0) {
    throw new Error('Score > 1 requires at least one evidence');
  }
  
  // Vérification de la cohérence
  const coherenceCheck = await checkScoreCoherence(rating);
  if (!coherenceCheck.coherent) {
    throw new Error(`Score incoherent: ${coherenceCheck.reason}`);
  }
  
  // Validation
  rating.validation = {
    validated: validation.validated,
    validatedBy: validation.validatedBy,
    validatedAt: new Date(),
    comments: validation.comments
  };
  
  // Sauvegarde
  await saveRating(rating);
}
```

### 7.2 Vérification de Cohérence

```typescript
async function checkScoreCoherence(rating: SoftSkillRating): Promise<{ coherent: boolean; reason?: string }> {
  // Score 1 : Pas de preuve
  if (rating.score === 1 && rating.evidence.length > 0) {
    return { coherent: false, reason: 'Score 1 should have no evidence' };
  }
  
  // Score 2 : Preuve partielle
  if (rating.score === 2 && rating.evidence.length === 0) {
    return { coherent: false, reason: 'Score 2 requires at least partial evidence' };
  }
  
  // Score 3 : Preuve standard
  if (rating.score === 3 && !hasStandardEvidence(rating.evidence)) {
    return { coherent: false, reason: 'Score 3 requires standard evidence' };
  }
  
  // Score 4 : Preuve forte
  if (rating.score === 4 && !hasStrongEvidence(rating.evidence)) {
    return { coherent: false, reason: 'Score 4 requires strong evidence' };
  }
  
  // Score 5 : Preuve exceptionnelle
  if (rating.score === 5 && !hasExceptionalEvidence(rating.evidence)) {
    return { coherent: false, reason: 'Score 5 requires exceptional evidence' };
  }
  
  return { coherent: true };
}

function hasStandardEvidence(evidence: SoftSkillRating['evidence']): boolean {
  return evidence.some(ev => ev.type === 'concrete_example' && isSpecific(ev.description));
}

function hasStrongEvidence(evidence: SoftSkillRating['evidence']): boolean {
  return evidence.some(ev => ev.type === 'quantified_result') || 
         evidence.some(ev => ev.type === 'concrete_example' && isSpecific(ev.description) && hasImpact(ev));
}

function hasExceptionalEvidence(evidence: SoftSkillRating['evidence']): boolean {
  return evidence.some(ev => ev.type === 'recurring_pattern') && hasHighImpact(ev);
}
```

---

## 8. Calcul du Score Global Soft Skills

### 8.1 Pondération par Soft Skill

```typescript
async function calculateGlobalSoftSkillsScore(
  ratings: SoftSkillRating[],
  weights: Record<string, number>
): Promise<number> {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const rating of ratings) {
    const weight = weights[rating.skillId] || 1.0;
    weightedSum += rating.score * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
```

### 8.2 Pondérations par Rôle

| Soft Skill | Junior | Confirmé | Senior | Manager | Expert |
|------------|--------|----------|--------|---------|--------|
| Leadership & Influence | 0.5 | 1.0 | 1.5 | 2.0 | 1.5 |
| Intelligence Émotionnelle | 1.0 | 1.5 | 1.5 | 2.0 | 1.5 |
| Adaptabilité & Résilience | 1.5 | 1.5 | 1.5 | 1.5 | 1.5 |
| Pensée Critique | 1.5 | 1.5 | 1.5 | 1.5 | 2.0 |
| Communication & Impact | 1.5 | 1.5 | 1.5 | 2.0 | 1.5 |
| Orientation Résultats | 1.0 | 1.5 | 1.5 | 1.5 | 1.5 |
| Travail en Équipe | 1.5 | 1.5 | 1.5 | 2.0 | 1.0 |
| Apprentissage Continu | 2.0 | 1.5 | 1.5 | 1.5 | 1.5 |
| Intégrité & Éthique | 1.5 | 1.5 | 1.5 | 2.0 | 1.5 |
| Gestion du Stress | 1.0 | 1.5 | 1.5 | 2.0 | 1.5 |
| Vision Stratégique | 0.5 | 1.0 | 1.5 | 2.0 | 2.0 |
| Culture Fit | 1.5 | 1.5 | 1.5 | 1.5 | 1.5 |

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE soft_skill_rating (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  skill_id VARCHAR(36) NOT NULL,
  rated_at TIMESTAMP NOT NULL,
  rated_by VARCHAR(36) NOT NULL,
  
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  evidence JSON NOT NULL,
  justification TEXT,
  confidence DECIMAL(3,2) NOT NULL,
  
  validated BOOLEAN DEFAULT FALSE,
  validated_by VARCHAR(36),
  validated_at TIMESTAMP,
  validation_comments TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (skill_id) REFERENCES soft_skills(id),
  FOREIGN KEY (rated_by) REFERENCES recruiters(id)
);

CREATE INDEX idx_soft_rating_interview ON soft_skill_rating(interview_id);
CREATE INDEX idx_soft_rating_candidate ON soft_skill_rating(candidate_id);
CREATE INDEX idx_soft_rating_skill ON soft_skill_rating(skill_id);
CREATE INDEX idx_soft_rating_score ON soft_skill_rating(score);
```

---

## 10. API Endpoints

```typescript
// POST /api/soft-skills-rating
async function rateSoftSkill(
  interviewId: string,
  skillId: string,
  evidence: SoftSkillRating['evidence'],
  justification: string
): Promise<SoftSkillRating> {
  return await createSoftSkillRating(interviewId, skillId, evidence, justification);
}

// GET /api/soft-skills-rating/:id
async function getRating(id: string): Promise<SoftSkillRating> {
  return await getRatingById(id);
}

// GET /api/soft-skills-rating/interview/:interviewId
async function getRatingsByInterview(interviewId: string): Promise<SoftSkillRating[]> {
  return await getInterviewRatings(interviewId);
}

// PUT /api/soft-skills-rating/:id
async function updateRating(id: string, rating: Partial<SoftSkillRating>): Promise<SoftSkillRating> {
  return await modifyRating(id, rating);
}

// POST /api/soft-skills-rating/:id/validate
async function validateRating(id: string, validation: SoftSkillRating['validation']): Promise<void> {
  return await validateScore(id, validation);
}

// GET /api/soft-skills-rating/interview/:interviewId/global-score
async function getGlobalSoftSkillsScore(interviewId: string, role: string): Promise<number> {
  const ratings = await getRatingsByInterview(interviewId);
  const weights = getWeightsByRole(role);
  return await calculateGlobalSoftSkillsScore(ratings, weights);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Cotations validées / total | 100% |
| Taux de preuve | Cotations avec preuve / total | ≥ 95% |
| Taux de cohérence | Cotations cohérentes / total | 100% |
| Confiance moyenne | Confiance moyenne des cotations | ≥ 0.8 |

### 11.2 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
| Temps de cotation | Temps moyen de cotation par soft skill | < 2 minutes |
| Taux d'accord | Accord entre recruteurs sur les scores | ≥ 80% |
| Prédiction performance | Corrélation scores / performance réelle | ≥ 0.7 |

---

## 12. Conclusion

Le moteur de cotation soft skills attribue des scores de 1 à 5 basés exclusivement sur des preuves concrètes. La règle fondamentale est qu'un score ne peut être attribué QUE si une preuve concrète l'étaye. Pas d'impression, pas de ressenti. Des faits, des exemples, des preuves.

**Points clés :**
- Échelle 1-5 (Absent, Faible, Standard, Fort, Exceptionnel)
- Règle fondamentale : preuve concrète obligatoire
- Types de preuves acceptées (exemple concret, résultat chiffré, témoignage, pattern récurrent, reconnaissance)
- Algorithme de cotation basé sur la qualité des preuves
- Validation du score avec vérification de cohérence
- Calcul du score global avec pondérations par rôle
- Stockage des preuves pour traçabilité
