# DOC-022-02 : Audit D&I du Processus

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'audit D&I du processus pour MVP-022 Diversity & Inclusion Engine. Ce système audite chaque étape du processus de recrutement (offre d'emploi, sélection des CV, entretien, décision finale) pour détecter les biais, génère des alertes et recommandations, et produit un score global d'inclusion.

---

## 2. Principe Fondateur

Pour chaque processus de recrutement, le moteur audite les 4 étapes clés : offre d'emploi (langage genré, critères non pertinents, biais d'expérience, accessibilité), sélection des CV (taux de sélection par groupe, biais de sélection, recommandation de CV anonymisé), entretien (questions inadaptées, grille d'évaluation, cotation biaisée), décision finale (critères objectifs, éléments non pertinents). Le moteur génère des alertes et recommandations pour chaque étape et produit un score global d'inclusion.

---

## 3. Étape 1 — Audit de l'Offre d'Emploi

### 3.1 Détection du Langage Genré

**Principe :**
Détection des mots masculins dominants qui peuvent décourager les candidates.

**Mots masculins dominants typiques :**
- "dynamique", "compétitif", "assertif", "dominant", "agressif"
- "leader", "chef", "patron", "gouverner"
- "force", "puissance", "performance"

**Processus de détection :**
1. Analyse du texte de l'offre
2. Identification des mots genrés
3. Calcul du ratio masculin / féminin / neutre
4. Génération de suggestions de neutralisation

**Suggestions de neutralisation :**
- "dynamique" → "proactif/ve"
- "compétitif" → "orienté résultats"
- "assertif" → "confiant/e"
- "leader" → "responsable"
- "force" → "énergie"

---

### 3.2 Détection des Critères Non Pertinents

**Principe :**
Détection des critères qui ne sont pas nécessaires pour le poste et qui peuvent exclure injustement certains candidats.

**Exemples de critères non pertinents :**
- "Bac+5 obligatoire" pour un poste qui ne le nécessite pas
- "10 ans d'expérience" pour un poste junior
- "Anglais courant" pour un poste sans contact international
- "Permis de conduire" pour un poste sans déplacement

**Processus de détection :**
1. Analyse des critères de l'offre
2. Comparaison avec les exigences réelles du poste (réf. MVP-003 Job Intelligence)
3. Identification des critères non pertinents
4. Génération de justifications pour la suppression

---

### 3.3 Détection des Biais d'Expérience

**Principe :**
Détection des exigences d'expérience qui peuvent exclure injustement certains groupes, notamment les femmes ayant eu des interruptions de carrière.

**Exemples de biais d'expérience :**
- "10 ans minimum" qui exclut les femmes ayant eu des interruptions
- "Expérience continue sans interruption" qui pénalise les reconversions
- "Parcours linéaire" qui exclut les parcours atypiques

**Processus de détection :**
1. Analyse des exigences d'expérience
2. Identification des exigences potentiellement discriminatoires
3. Évaluation de l'impact sur différents groupes
4. Génération d'alternatives inclusives

---

### 3.4 Accessibilité de l'Annonce

**Principe :**
Vérification que l'annonce est lisible par tous les profils cibles.

**Critères d'accessibilité :**
- Langage clair et compréhensible
- Absence de jargon technique inutile
- Format adapté (lecture facile)
- Accessibilité pour les personnes en situation de handicap

**Processus d'évaluation :**
1. Analyse du langage utilisé
2. Évaluation de la complexité du texte
3. Vérification du format
4. Génération de recommandations d'amélioration

---

## 4. Étape 2 — Audit de la Sélection des CV

### 4.1 Analyse du Taux de Sélection par Groupe

**Principe :**
Alerte si le taux de sélection diffère significativement selon les groupes de candidats à compétences équivalentes.

**Groupes analysés :**
- Genre (homme, femme, non-binaire)
- Âge (tranches d'âge)
- Origine ethnique (si données disponibles et consenties)
- Handicap (si données disponibles et consenties)
- Niveau d'éducation
- Type d'établissement (grandes écoles vs autres)

**Processus d'analyse :**
1. Collecte des données de sélection
2. Calcul du taux de sélection par groupe
3. Comparaison statistique entre groupes
4. Détection des écarts significatifs (test du chi-carré)
5. Génération d'alertes si écart significatif

---

### 4.2 Détection du Biais de Sélection

**Principe :**
Identification des critères de sélection potentiellement biaisés.

**Critères de sélection biaisés :**
- Nom et prénom (biais ethnique)
- Adresse (biais géographique)
- Photo (biais d'apparence)
- Âge (biais d'âge)
- Établissement (biais élitiste)

**Processus de détection :**
1. Analyse des critères de sélection utilisés
2. Identification des critères potentiellement biaisés
3. Évaluation de l'impact sur la diversité
4. Recommandation de suppression ou modification

---

### 4.3 Recommandation de CV Anonymisé

**Principe :**
Recommandation de CV anonymisé si le biais de sélection est détecté.

**Processus de recommandation :**
1. Évaluation du niveau de biais détecté
2. Si biais significatif → recommandation de CV anonymisé
3. Génération de la justification
4. Fourniture du processus de mise en œuvre

**Processus de CV anonymisé :**
- Suppression du nom et prénom
- Suppression de l'adresse
- Suppression de la photo
- Suppression de l'âge et de la date de naissance
- Suppression du genre
- Conservation des compétences et de l'expérience

---

## 5. Étape 3 — Audit de l'Entretien

### 5.1 Détection des Questions Inadaptées

**Principe :**
Détection des questions qui sont potentiellement discriminatoires ou illégales.

**Questions inadaptées typiques :**
- "Avez-vous des enfants ?" (discrimination familiale)
- "Quel est votre âge ?" (discrimination par l'âge)
- "Êtes-vous enceinte ?" (discrimination liée à la grossesse)
- "Quelle est votre origine ?" (discrimination ethnique)
- "Avez-vous un handicap ?" (discrimination liée au handicap)

**Processus de détection :**
1. Analyse des questions posées
2. Comparaison avec la liste des questions interdites (réf. RH-007 Hiérarchie des Normes)
3. Identification des questions inadaptées
4. Génération d'alternatives conformes

---

### 5.2 Vérification de la Grille d'Évaluation

**Principe :**
Vérification que la grille d'évaluation contient des critères objectifs et mesurables.

**Critères objectifs :**
- Compétences techniques mesurables
- Expérience vérifiable
- Réalisations quantifiables
- Comportements observables

**Critères subjectifs à éviter :**
- "Charisme"
- "Personnalité sympathique"
- "Coup de cœur"
- "Intuition"

**Processus de vérification :**
1. Analyse de la grille d'évaluation
2. Identification des critères objectifs
3. Identification des critères subjectifs
4. Recommandation de suppression ou reformulation des critères subjectifs

---

### 5.3 Détection de la Cotation Biaisée

**Principe :**
Alerte si la cotation diverge selon des variables non pertinentes.

**Variables non pertinentes :**
- Genre du candidat
- Âge du candidat
- Origine ethnique
- Apparence physique
- Accent ou manière de parler

**Processus de détection :**
1. Collecte des cotations par candidat
2. Analyse statistique des cotations par groupe
3. Détection des écarts significatifs
4. Génération d'alertes si écart significatif

---

## 6. Étape 4 — Audit de la Décision Finale

### 6.1 Analyse sur Critères Objectifs

**Principe :**
Vérification que la décision finale est basée sur des critères objectifs uniquement.

**Critères objectifs acceptables :**
- Compétences
- Expérience
- Adéquation avec le poste
- Motivation
- Soft skills évalués objectivement

**Critères subjectifs inacceptables :**
- "Intuition"
- "Coup de cœur"
- "Ressemblance avec l'équipe actuelle"
- "Origine sociale"
- "Appartenance à un réseau"

**Processus d'analyse :**
1. Analyse du raisonnement de la décision
2. Classification des critères utilisés (objectifs / subjectifs / non pertinents)
3. Identification des éléments non pertinents
4. Recommandation de révision si éléments non pertinents détectés

---

### 6.2 Détection d'Éléments Non Pertinents

**Principe :**
Alerte si le raisonnement contient des éléments non pertinents.

**Éléments non pertinents typiques :**
- Critères liés à l'apparence physique
- Critères liés à l'origine sociale
- Critères liés à la situation familiale
- Critères liés à l'âge
- Critères liés au genre

**Processus de détection :**
1. Analyse du texte de la décision
2. Identification des éléments non pertinents
3. Génération d'alertes
4. Recommandation de reformulation

---

## 7. Algorithme d'Audit

### 7.1 Processus Global

```typescript
async function auditDIProcess(recruitmentId: string): Promise<DIProcessAudit> {
  // 1. Récupération des données du recrutement
  const recruitment = await getRecruitment(recruitmentId);
  
  // 2. Audit de l'offre d'emploi
  const jobOfferAudit = await auditJobOffer(recruitment.jobId);
  
  // 3. Audit de la sélection des CV
  const cvSelectionAudit = await auditCVSelection(recruitment.selectionData);
  
  // 4. Audit de l'entretien
  const interviewAudit = await auditInterview(recruitment.interviewData);
  
  // 5. Audit de la décision finale
  const finalDecisionAudit = await auditFinalDecision(recruitment.decisionData);
  
  // 6. Calcul du score global
  const overallScore = await calculateOverallScore(
    jobOfferAudit,
    cvSelectionAudit,
    interviewAudit,
    finalDecisionAudit
  );
  
  // 7. Génération des alertes
  const alerts = await generateAlerts(
    jobOfferAudit,
    cvSelectionAudit,
    interviewAudit,
    finalDecisionAudit
  );
  
  // 8. Génération des recommandations
  const recommendations = await generateRecommendations(alerts);
  
  // 9. Construction de l'audit
  const audit: DIProcessAudit = {
    auditId: generateAuditId(),
    recruitmentId,
    auditedAt: new Date(),
    
    jobOfferAudit,
    cvSelectionAudit,
    interviewAudit,
    finalDecisionAudit,
    
    overallScore,
    alerts,
    recommendations
  };
  
  // 10. Sauvegarde de l'audit
  await saveDIProcessAudit(audit);
  
  return audit;
}
```

---

### 7.2 Audit de l'Offre d'Emploi

```typescript
async function auditJobOffer(jobId: string): Promise<JobOfferAudit> {
  const job = await getJob(jobId);
  
  // Détection du langage genré
  const genderedLanguage = await detectGenderedLanguage(job.description);
  
  // Détection des critères non pertinents
  const irrelevantCriteria = await detectIrrelevantCriteria(job.requirements, job);
  
  // Détection des biais d'expérience
  const experienceBias = await detectExperienceBias(job.requirements);
  
  // Évaluation de l'accessibilité
  const accessibility = await evaluateAccessibility(job.description);
  
  return {
    jobId,
    jobOfferText: job.description,
    
    genderedLanguage,
    irrelevantCriteria,
    experienceBias,
    accessibility
  };
}

async function detectGenderedLanguage(text: string): Promise<{
  detected: boolean;
  masculineWords: string[];
  neutralizationSuggestions: string[];
}> {
  const masculineWords: string[] = [];
  const neutralizationSuggestions: string[] = [];
  
  const genderedDictionary: Record<string, string> = {
    'dynamique': 'proactif/ve',
    'compétitif': 'orienté résultats',
    'assertif': 'confiant/e',
    'leader': 'responsable',
    'force': 'énergie',
    'dominant': 'influent/e',
    'agressif': 'déterminé/e'
  };
  
  for (const [word, neutral] of Object.entries(genderedDictionary)) {
    if (text.toLowerCase().includes(word)) {
      masculineWords.push(word);
      neutralizationSuggestions.push(`"${word}" → "${neutral}"`);
    }
  }
  
  return {
    detected: masculineWords.length > 0,
    masculineWords,
    neutralizationSuggestions
  };
}
```

---

### 7.3 Audit de la Sélection des CV

```typescript
async function auditCVSelection(selectionData: SelectionData): Promise<CVSelectionAudit> {
  // Calcul du taux de sélection par groupe
  const selectionRateByGroup = await calculateSelectionRateByGroup(selectionData);
  
  // Détection du biais de sélection
  const biasDetected = await detectSelectionBias(selectionRateByGroup);
  
  // Recommandation de CV anonymisé
  const anonymousCVRecommended = biasDetected ? true : false;
  const justification = biasDetected 
    ? 'Biais de sélection détecté - CV anonymisé recommandé pour réduire les biais'
    : 'Aucun biais significatif détecté';
  
  return {
    selectionData,
    
    selectionRateByGroup,
    
    biasDetected,
    biasDetails: biasDetected ? await generateBiasDetails(selectionRateByGroup) : [],
    
    anonymousCVRecommended,
    justification
  };
}

async function calculateSelectionRateByGroup(selectionData: SelectionData): Promise<{
  group: string;
  selectionRate: number;
  candidateCount: number;
  selectedCount: number;
}[]> {
  const selectionRates: {
    group: string;
    selectionRate: number;
    candidateCount: number;
    selectedCount: number;
  }[] = [];
  
  // Calcul par genre
  const genderGroups = ['male', 'female', 'nonBinary', 'preferNotToSay'];
  for (const group of genderGroups) {
    const groupCandidates = selectionData.candidates.filter(c => c.gender === group);
    const groupSelected = groupCandidates.filter(c => c.selected);
    
    selectionRates.push({
      group: `gender_${group}`,
      selectionRate: groupCandidates.length > 0 ? groupSelected.length / groupCandidates.length : 0,
      candidateCount: groupCandidates.length,
      selectedCount: groupSelected.length
    });
  }
  
  // Calcul par âge
  const ageGroups = ['under25', 'age25to34', 'age35to44', 'age45to54', 'age55plus'];
  for (const group of ageGroups) {
    const groupCandidates = selectionData.candidates.filter(c => c.ageGroup === group);
    const groupSelected = groupCandidates.filter(c => c.selected);
    
    selectionRates.push({
      group: `age_${group}`,
      selectionRate: groupCandidates.length > 0 ? groupSelected.length / groupCandidates.length : 0,
      candidateCount: groupCandidates.length,
      selectedCount: groupSelected.length
    });
  }
  
  return selectionRates;
}
```

---

### 7.4 Calcul du Score Global

```typescript
async function calculateOverallScore(
  jobOfferAudit: JobOfferAudit,
  cvSelectionAudit: CVSelectionAudit,
  interviewAudit: InterviewAudit,
  finalDecisionAudit: FinalDecisionAudit
): Promise<number> {
  let score = 100;
  
  // Pénalités pour l'offre d'emploi
  if (jobOfferAudit.genderedLanguage.detected) score -= 10;
  if (jobOfferAudit.irrelevantCriteria.detected) score -= 15;
  if (jobOfferAudit.experienceBias.detected) score -= 15;
  score -= (100 - jobOfferAudit.accessibility.score) * 0.1;
  
  // Pénalités pour la sélection des CV
  if (cvSelectionAudit.biasDetected) score -= 20;
  
  // Pénalités pour l'entretien
  if (interviewAudit.inappropriateQuestions.detected) score -= 15;
  if (!interviewAudit.evaluationGrid.verified) score -= 10;
  if (interviewAudit.scoringBias.detected) score -= 15;
  
  // Pénalités pour la décision finale
  if (!finalDecisionAudit.objectiveCriteriaOnly) score -= 20;
  
  return Math.max(0, Math.min(100, score));
}
```

---

## 8. Structure de Données (TypeScript)

```typescript
interface DIProcessAudit {
  auditId: string;
  recruitmentId: string;
  auditedAt: Date;
  
  jobOfferAudit: JobOfferAudit;
  cvSelectionAudit: CVSelectionAudit;
  interviewAudit: InterviewAudit;
  finalDecisionAudit: FinalDecisionAudit;
  
  overallScore: number; // 0-100
  alerts: DIAlert[];
  recommendations: DIRecommendation[];
}

interface JobOfferAudit {
  jobId: string;
  jobOfferText: string;
  
  genderedLanguage: {
    detected: boolean;
    masculineWords: string[];
    neutralizationSuggestions: string[];
  };
  
  irrelevantCriteria: {
    detected: boolean;
    criteria: string[];
    justification: string[];
  };
  
  experienceBias: {
    detected: boolean;
    requirements: string[];
    impact: string[];
  };
  
  accessibility: {
    score: number;
    issues: string[];
  };
}

interface CVSelectionAudit {
  selectionData: SelectionData;
  
  selectionRateByGroup: {
    group: string;
    selectionRate: number;
    candidateCount: number;
    selectedCount: number;
  }[];
  
  biasDetected: boolean;
  biasDetails: string[];
  
  anonymousCVRecommended: boolean;
  justification: string;
}

interface InterviewAudit {
  interviewData: InterviewData;
  
  inappropriateQuestions: {
    detected: boolean;
    questions: string[];
    alternatives: string[];
  };
  
  evaluationGrid: {
    verified: boolean;
    objectiveCriteria: string[];
    measurableCriteria: string[];
    issues: string[];
  };
  
  scoringBias: {
    detected: boolean;
    irrelevantVariables: string[];
    divergenceDetails: string[];
  };
}

interface FinalDecisionAudit {
  decisionData: DecisionData;
  
  objectiveCriteriaOnly: boolean;
  irrelevantElements: string[];
  
  reasoningAnalysis: {
    objective: string[];
    subjective: string[];
    irrelevant: string[];
  };
}

interface DIAlert {
  type: 'gendered_language' | 'irrelevant_criteria' | 'experience_bias' | 'selection_bias' | 'interview_bias' | 'decision_bias';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

interface DIRecommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
  timeline: string;
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE di_process_audit (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  audited_at TIMESTAMP NOT NULL,
  
  job_offer_audit JSON NOT NULL,
  cv_selection_audit JSON NOT NULL,
  interview_audit JSON NOT NULL,
  final_decision_audit JSON NOT NULL,
  
  overall_score INT NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  alerts JSON NOT NULL,
  recommendations JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (recruitment_id) REFERENCES recruitments(id)
);

CREATE INDEX idx_di_process_audit_recruitment ON di_process_audit(recruitment_id);
CREATE INDEX idx_di_process_audit_date ON di_process_audit(audited_at);
CREATE INDEX idx_di_process_audit_score ON di_process_audit(overall_score);
```

---

## 10. API Endpoints

```typescript
// POST /api/diversity-inclusion/audit
async function auditDIProcess(recruitmentId: string): Promise<DIProcessAudit> {
  return await auditDIProcess(recruitmentId);
}

// GET /api/diversity-inclusion/audit/:auditId
async function getDIProcessAudit(auditId: string): Promise<DIProcessAudit> {
  return await getDIProcessAuditById(auditId);
}

// GET /api/diversity-inclusion/audit/recruitment/:recruitmentId
async function getDIProcessAuditByRecruitment(recruitmentId: string): Promise<DIProcessAudit> {
  return await getDIProcessAuditByRecruitmentId(recruitmentId);
}

// POST /api/diversity-inclusion/audit/job-offer
async function auditJobOffer(jobId: string): Promise<JobOfferAudit> {
  return await auditJobOffer(jobId);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'audit | Processus audités / total | ≥ 90% |
| Taux de détection de biais | Biais détectés / audits | ≥ 70% |
| Score moyen d'inclusion | Score moyen global | ≥ 75 |
| Satisfaction recruteur | Satisfaction avec les recommandations | ≥ 4.5/5 |

### 11.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des biais de langage | Réduction des mots genrés | ≥ 50% |
| Réduction des biais de sélection | Réduction des écarts de sélection | ≥ 30% |
| Amélioration de l'accessibilité | Amélioration du score d'accessibilité | ≥ 20% |

---

## 12. Conclusion

L'audit D&I du processus audite les 4 étapes clés du recrutement (offre d'emploi, sélection des CV, entretien, décision finale) pour détecter les biais, génère des alertes et recommandations, et produit un score global d'inclusion. Le système détecte le langage genré, les critères non pertinents, les biais d'expérience, les biais de sélection, les questions inadaptées, et les éléments non pertinents dans la décision finale. Le système est conforme au protocole anti-biais (RH-860) et s'intègre avec les modules existants.

**Points clés :**
- 4 étapes d'audit (offre d'emploi, sélection CV, entretien, décision finale)
- Détection du langage genré avec suggestions de neutralisation
- Détection des critères non pertinents et biais d'expérience
- Analyse du taux de sélection par groupe
- Recommandation de CV anonymisé si biais détecté
- Détection des questions inadaptées
- Vérification de la grille d'évaluation
- Détection de la cotation biaisée
- Analyse de la décision finale sur critères objectifs
- Score global d'inclusion (0-100)
- Alertes et recommandations par étape
- Conformité au protocole anti-biais (RH-860)
- Intégration avec les modules existants
