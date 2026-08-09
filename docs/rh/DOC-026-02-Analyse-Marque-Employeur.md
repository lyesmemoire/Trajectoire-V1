# DOC-026-02 : Analyse de la Marque Employeur

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'analyse de la marque employeur pour MVP-026 Employer Branding & Candidate Experience. Ce système analyse et synthétise ce que les candidats disent (avis Glassdoor/Indeed, feedbacks candidats, points de friction dans l'expérience candidat), ce que l'entreprise promet (offres d'emploi, messages RH, cohérence entre la promesse et la réalité perçue), détecte les gaps entre ce que l'entreprise dit et ce que les candidats et salariés disent, et génère un plan d'action pour réduire ces gaps.

---

## 2. Principe Fondateur

Le moteur analyse et synthétise la marque employeur en comparant ce que les candidats disent (via Glassdoor/Indeed et feedbacks candidats) avec ce que l'entreprise promet (via offres d'emploi et messages RH). Le système détecte les gaps entre la promesse et la réalité perçue, identifie les points de friction dans l'expérience candidat, et génère un plan d'action pour réduire ces gaps et améliorer la cohérence entre la promesse et la réalité.

---

## 3. Ce que les Candidats Disent

### 3.1 Analyse des Avis Glassdoor / Indeed

**Description :**
Analyse des avis des candidats et salariés sur Glassdoor et Indeed.

**Indicateurs :**
- Note moyenne (1-5)
- Nombre total d'avis
- Sentiment (positif / neutre / négatif)
- Thèmes clés (culture, management, rémunération, équilibre vie pro/vie perso, opportunités de carrière)

**Sources :**
- Glassdoor
- Indeed
- Autres plateformes (LinkedIn, Viadeo, etc.)

---

### 3.2 Analyse des Feedbacks Candidats

**Description :**
Analyse des feedbacks des candidats après les processus de recrutement.

**Indicateurs :**
- Note moyenne (1-5)
- Nombre total de feedbacks
- Sentiment (positif / neutre / négatif)
- Thèmes clés (qualité des entretiens, communication, respect, transparence)

**Sources :**
- Questionnaires post-recrutement
- Feedbacks informels
- Entretiens de sortie

---

### 3.3 Détection des Points de Friction dans l'Expérience Candidat

**Description :**
Détection des points de friction dans l'expérience candidat.

**Types de points de friction :**
- Annonce peu claire ou peu attractive
- Formulaire de candidature complexe
- Délai de réponse trop long
- Manque de communication
- Entretiens mal préparés
- Feedback de décision de mauvaise qualité

---

## 4. Ce que l'Entreprise Promet

### 4.1 Analyse des Offres d'Emploi

**Description :**
Analyse des offres d'emploi publiées par l'entreprise.

**Indicateurs :**
- Clarté de l'annonce
- Attractivité de l'annonce
- Messages clés (culture, valeurs, opportunités, rémunération)
- Cohérence avec la réalité perçue

**Critères d'évaluation :**
- Description claire du poste
- Présentation de l'entreprise
- Informations sur la culture et les valeurs
- Informations sur les opportunités de carrière
- Informations sur la rémunération et les avantages

---

### 4.2 Analyse des Messages RH

**Description :**
Analyse des messages RH diffusés par l'entreprise.

**Indicateurs :**
- Clarté du message
- Attractivité du message
- Messages clés (culture, valeurs, opportunités, rémunération)
- Cohérence avec la réalité perçue

**Sources :**
- Site carrière
- Réseaux sociaux
- Salons et événements
- Communications internes

---

### 4.3 Cohérence entre la Promesse et la Réalité Perçue

**Description :**
Évaluation de la cohérence entre ce que l'entreprise promet et ce que les candidats et salariés perçoivent.

**Critères d'évaluation :**
- Cohérence des messages
- Cohérence des valeurs
- Cohérence de la culture
- Cohérence des opportunités
- Cohérence de la rémunération

---

## 5. Les Gaps Détectés

### 5.1 Ce que l'Entreprise Dit qu'Elle Est

**Description :**
Image que l'entreprise projette de elle-même.

**Composants :**
- Culture et valeurs
- Opportunités de carrière
- Rémunération et avantages
- Équilibre vie pro/vie perso
- Management et leadership

---

### 5.2 Ce que les Candidats et Salariés Disent qu'Elle Est Vraiment

**Description :**
Image perçue par les candidats et salariés.

**Composants :**
- Culture et valeurs réelles
- Opportunités de carrière réelles
- Rémunération et avantages réels
- Équilibre vie pro/vie perso réel
- Management et leadership réel

---

### 5.3 Plan d'Action pour Réduire ces Gaps

**Description :**
Plan d'action pour réduire les gaps entre la promesse et la réalité.

**Types d'actions :**
- Ajustement des messages RH pour refléter la réalité
- Amélioration de la culture et des valeurs
- Amélioration des opportunités de carrière
- Amélioration de la rémunération et des avantages
- Amélioration du management et du leadership
- Amélioration de la communication

---

## 6. Algorithme d'Analyse de la Marque Employeur

### 6.1 Processus Global

```typescript
async function analyzeEmployerBranding(companyId: string): Promise<EmployerBranding> {
  // 1. Analyse de la perception des candidats
  const candidatePerception = await analyzeCandidatePerception(companyId);
  
  // 2. Analyse de la promesse de l'entreprise
  const companyPromise = await analyzeCompanyPromise(companyId);
  
  // 3. Détection des gaps
  const detectedGaps = await detectGaps(candidatePerception, companyPromise);
  
  // 4. Génération du plan d'action
  const actionPlan = await generateActionPlan(detectedGaps);
  
  // 5. Construction de l'analyse de marque employeur
  const branding: EmployerBranding = {
    brandingId: generateBrandingId(),
    analyzedAt: new Date(),
    
    candidatePerception,
    companyPromise,
    detectedGaps,
    actionPlan
  };
  
  // 6. Sauvegarde de l'analyse
  await saveEmployerBranding(branding);
  
  return branding;
}
```

---

### 6.2 Analyse de la Perception des Candidats

```typescript
async function analyzeCandidatePerception(companyId: string): Promise<CandidatePerception> {
  // Analyse des avis Glassdoor
  const glassdoorReviews = await analyzeGlassdoorReviews(companyId);
  
  // Analyse des avis Indeed
  const indeedReviews = await analyzeIndeedReviews(companyId);
  
  // Analyse des feedbacks candidats
  const candidateFeedbacks = await analyzeCandidateFeedbacks(companyId);
  
  // Détection des points de friction
  const frictionPoints = await detectFrictionPoints(candidateFeedbacks);
  
  return {
    glassdoorReviews,
    indeedReviews,
    candidateFeedbacks,
    frictionPoints
  };
}

async function analyzeGlassdoorReviews(companyId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  keyThemes: string[];
}> {
  const reviews = await fetchGlassdoorReviews(companyId);
  
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  
  // Analyse du sentiment
  const sentiment = averageRating >= 4 ? 'positive' : averageRating >= 3 ? 'neutral' : 'negative';
  
  // Extraction des thèmes clés
  const keyThemes = await extractKeyThemes(reviews);
  
  return {
    averageRating,
    totalReviews,
    sentiment,
    keyThemes
  };
}
```

---

### 6.3 Analyse de la Promesse de l'Entreprise

```typescript
async function analyzeCompanyPromise(companyId: string): Promise<CompanyPromise> {
  // Analyse des offres d'emploi
  const jobOffers = await analyzeJobOffers(companyId);
  
  // Analyse des messages RH
  const hrMessages = await analyzeHrMessages(companyId);
  
  // Synthèse de la promesse globale
  const overallPromise = await synthesizeOverallPromise(jobOffers, hrMessages);
  
  return {
    jobOffers,
    hrMessages,
    overallPromise
  };
}

async function analyzeJobOffers(companyId: string): Promise<{
  clarity: number;
  attractiveness: number;
  keyMessages: string[];
}> {
  const jobOffers = await fetchJobOffers(companyId);
  
  // Évaluation de la clarté
  const clarity = await evaluateClarity(jobOffers);
  
  // Évaluation de l'attractivité
  const attractiveness = await evaluateAttractiveness(jobOffers);
  
  // Extraction des messages clés
  const keyMessages = await extractKeyMessages(jobOffers);
  
  return {
    clarity,
    attractiveness,
    keyMessages
  };
}
```

---

### 6.4 Détection des Gaps

```typescript
async function detectGaps(
  candidatePerception: CandidatePerception,
  companyPromise: CompanyPromise
): Promise<DetectedGap[]> {
  const gaps: DetectedGap[] = [];
  
  // Gap 1 : Culture et valeurs
  const cultureGap = await detectCultureGap(candidatePerception, companyPromise);
  if (cultureGap) {
    gaps.push(cultureGap);
  }
  
  // Gap 2 : Opportunités de carrière
  const careerGap = await detectCareerGap(candidatePerception, companyPromise);
  if (careerGap) {
    gaps.push(careerGap);
  }
  
  // Gap 3 : Rémunération et avantages
  const compensationGap = await detectCompensationGap(candidatePerception, companyPromise);
  if (compensationGap) {
    gaps.push(compensationGap);
  }
  
  // Gap 4 : Équilibre vie pro/vie perso
  const workLifeBalanceGap = await detectWorkLifeBalanceGap(candidatePerception, companyPromise);
  if (workLifeBalanceGap) {
    gaps.push(workLifeBalanceGap);
  }
  
  // Gap 5 : Management et leadership
  const managementGap = await detectManagementGap(candidatePerception, companyPromise);
  if (managementGap) {
    gaps.push(managementGap);
  }
  
  return gaps;
}
```

---

### 6.5 Génération du Plan d'Action

```typescript
async function generateActionPlan(detectedGaps: DetectedGap[]): Promise<ActionPlan> {
  const actions: {
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
  }[] = [];
  
  // Pour chaque gap détecté
  for (const gap of detectedGaps) {
    // Génération d'actions pour réduire le gap
    const gapActions = await generateGapActions(gap);
    actions.push(...gapActions);
  }
  
  // Priorisation des actions
  const prioritizedActions = await prioritizeActions(actions);
  
  return {
    actions: prioritizedActions
  };
}
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface EmployerBranding {
  brandingId: string;
  analyzedAt: Date;
  
  candidatePerception: CandidatePerception;
  companyPromise: CompanyPromise;
  detectedGaps: DetectedGap[];
  actionPlan: ActionPlan;
}

interface CandidatePerception {
  glassdoorReviews: {
    averageRating: number;
    totalReviews: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyThemes: string[];
  };
  
  indeedReviews: {
    averageRating: number;
    totalReviews: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyThemes: string[];
  };
  
  candidateFeedbacks: {
    averageRating: number;
    totalFeedbacks: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyThemes: string[];
  };
  
  frictionPoints: string[];
}

interface CompanyPromise {
  jobOffers: {
    clarity: number;
    attractiveness: number;
    keyMessages: string[];
  };
  
  hrMessages: {
    clarity: number;
    attractiveness: number;
    keyMessages: string[];
  };
  
  overallPromise: string[];
}

interface DetectedGap {
  gap: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact: string;
}

interface ActionPlan {
  actions: {
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
  }[];
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE employer_branding (
  id VARCHAR(36) PRIMARY KEY,
  company_id VARCHAR(36) NOT NULL,
  analyzed_at TIMESTAMP NOT NULL,
  
  candidate_perception JSON NOT NULL,
  company_promise JSON NOT NULL,
  detected_gaps JSON NOT NULL,
  action_plan JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employer_branding_company ON employer_branding(company_id);
CREATE INDEX idx_employer_branding_date ON employer_branding(analyzed_at);
```

---

## 9. API Endpoints

```typescript
// POST /api/employer-branding/analyze
async function analyzeEmployerBranding(companyId: string): Promise<EmployerBranding> {
  return await analyzeEmployerBranding(companyId);
}

// GET /api/employer-branding/:brandingId
async function getEmployerBranding(brandingId: string): Promise<EmployerBranding> {
  return await getEmployerBrandingById(brandingId);
}

// GET /api/employer-branding/company/:companyId
async function getEmployerBrandingByCompany(companyId: string): Promise<EmployerBranding[]> {
  return await getEmployerBrandingByCompanyId(companyId);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de collecte d'avis | Avis collectés / total | ≥ 70% |
| Taux de détection de gaps | Gaps détectés / gaps réels | ≥ 80% |
| Taux d'adoption des actions | Actions appliquées / recommandées | ≥ 70% |
| Satisfaction DRH | Satisfaction avec l'analyse | ≥ 4.5/5 |

### 10.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration de la note moyenne | Amélioration de la note Glassdoor/Indeed | ≥ 0.5 |
- Réduction des gaps | Réduction des gaps promesse/réalité | ≥ 30% |
- Amélioration du sentiment | Amélioration du sentiment des avis | ≥ 20% |

---

## 11. Conclusion

Le système d'analyse de la marque employeur analyse et synthétise ce que les candidats disent (avis Glassdoor/Indeed, feedbacks candidats, points de friction dans l'expérience candidat), ce que l'entreprise promet (offres d'emploi, messages RH, cohérence entre la promesse et la réalité perçue), détecte les gaps entre ce que l'entreprise dit et ce que les candidats et salariés disent, et génère un plan d'action pour réduire ces gaps. Le système permet à l'entreprise d'améliorer sa marque employeur et d'aligner sa promesse avec la réalité perçue. Le système s'intègre avec les modules existants (MVP-003, MVP-013, MVP-017).

**Points clés :**
- Analyse des avis Glassdoor/Indeed
- Analyse des feedbacks candidats
- Détection des points de friction
- Analyse des offres d'emploi et messages RH
- Évaluation de la cohérence promesse/réalité
- 5 types de gaps détectés (culture, carrière, rémunération, équilibre, management)
- Plan d'action pour réduire les gaps
- Intégration avec les modules existants
