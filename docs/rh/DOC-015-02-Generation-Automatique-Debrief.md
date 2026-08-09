# DOC-015-02 : Génération Automatique du Debrief

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le processus de génération automatique du Debrief Expert pour MVP-015. Ce processus compile toutes les données de l'entretien (cotations, preuves, signaux, réponses) pour générer les 8 sections du debrief en moins de 10 minutes.

---

## 2. Principe Fondateur

La génération automatique du debrief compile toutes les données disponibles (MVP-013 Interview Intelligence, MVP-014 Soft Skills Intelligence, et autres sources) pour produire une synthèse structurée, argumentée et actionnelle sans intervention manuelle du recruteur.

---

## 3. Sources de Données

### 3.1 Données de l'Entretien (MVP-013)

- **Brief Entretien Expert** : Profil, hypothèses, questions, grille de cotation
- **Copilot Entretien Temps Réel** : Notes du recruteur, suggestions, temps
- **Synthèse Entretien** : Points forts/faibles, signaux, recommandation

### 3.2 Données Soft Skills (MVP-014)

- **Cotations Soft Skills** : Scores 1-5 pour chaque soft skill
- **Preuves Comportementales** : Exemples concrets, résultats chiffrés
- **Synthèse Soft Skills** : Points forts, axes d'amélioration

### 3.3 Données CV (MVP-001)

- **Analyse CV** : Compétences, expérience, formation
- **Matching Score** : Adéquation avec le poste

### 3.4 Données Poste (MVP-003)

- **Analyse Poste** : Compétences requises, soft skills critiques
- **Grille de Cotation** : Critères et seuils

---

## 4. Processus de Génération

### 4.1 Processus Global

```typescript
async function generateExpertDebrief(interviewId: string, recruiterId: string): Promise<ExpertDebrief> {
  const startTime = Date.now();
  
  // Étape 1 : Récupération de toutes les données
  const data = await collectAllData(interviewId);
  
  // Étape 2 : Génération Section 1 - Fiche de Synthèse
  const section1 = await generateSection1(data);
  
  // Étape 3 : Génération Section 2 - Évaluation Structurée
  const section2 = await generateSection2(data);
  
  // Étape 4 : Génération Section 3 - Points Forts
  const section3 = await generateSection3(data);
  
  // Étape 5 : Génération Section 4 - Points de Vigilance
  const section4 = await generateSection4(data);
  
  // Étape 6 : Génération Section 5 - Zones d'Ombre
  const section5 = await generateSection5(data);
  
  // Étape 7 : Génération Section 6 - Décision Argumentée
  const section6 = await generateSection6(data, section2);
  
  // Étape 8 : Génération Section 7 - Plan Onboarding
  const section7 = await generateSection7(data, section6);
  
  // Étape 9 : Génération Section 8 - Feedback Candidat
  const section8 = await generateSection8(data, section6);
  
  // Construction du debrief
  const debrief: ExpertDebrief = {
    debriefId: generateDebriefId(),
    interviewId,
    candidateId: data.candidate.id,
    jobId: data.job.id,
    recruiterId,
    interviewDate: data.interview.startedAt,
    duration: data.interview.duration,
    generatedAt: new Date(),
    
    section1,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8
  };
  
  // Sauvegarde du debrief
  await saveDebrief(debrief);
  
  const generationTime = Date.now() - startTime;
  if (generationTime > 10 * 60 * 1000) {
    console.warn(`Debrief generation took ${generationTime}ms, exceeding 10 minutes`);
  }
  
  return debrief;
}
```

### 4.2 Collecte des Données

```typescript
async function collectAllData(interviewId: string): Promise<DebriefData> {
  const data: DebriefData = {
    interview: await getInterview(interviewId),
    candidate: await getCandidate(interviewId),
    job: await getJob(interviewId),
    recruiter: await getRecruiter(interviewId),
    
    interviewBrief: await getInterviewBrief(interviewId),
    interviewSummary: await getInterviewSummary(interviewId),
    softSkillsRatings: await getSoftSkillRatings(interviewId),
    softSkillsSummary: await getSoftSkillsSummary(interviewId),
    behavioralEvidence: await getBehavioralEvidence(interviewId),
    signalDetections: await getSignalDetections(interviewId),
    
    cvAnalysis: await getCVAnalysis(interviewId),
    jobAnalysis: await getJobAnalysis(interviewId),
    
    responses: await getResponses(interviewId),
    recruiterNotes: await getRecruiterNotes(interviewId)
  };
  
  return data;
}
```

---

## 5. Génération des Sections

### 5.1 Section 1 - Fiche de Synthèse

```typescript
async function generateSection1(data: DebriefData): Promise<ExpertDebrief['section1']> {
  const candidate = data.candidate;
  const job = data.job;
  const interview = data.interview;
  const summary = data.interviewSummary;
  
  // Détermination de la recommandation finale
  const finalRecommendation = await determineFinalRecommendation(summary, data.softSkillsSummary);
  
  // Calcul du niveau de confiance
  const confidenceLevel = await calculateConfidenceLevel(data);
  
  // Génération de la synthèse en 5 lignes
  const fiveLineSummary = await generateFiveLineSummary(data, finalRecommendation);
  
  return {
    candidateName: `${candidate.firstName} ${candidate.lastName}`,
    jobTitle: job.title,
    interviewDate: interview.startedAt,
    duration: formatDuration(interview.duration),
    recruiter: data.recruiter.name,
    
    finalRecommendation,
    confidenceLevel,
    
    fiveLineSummary
  };
}

async function generateFiveLineSummary(data: DebriefData, recommendation: string): Promise<ExpertDebrief['section1']['fiveLineSummary']> {
  const candidate = data.candidate;
  const job = data.job;
  const summary = data.interviewSummary;
  const softSkillsSummary = data.softSkillsSummary;
  
  // 1. Ce que ce candidat est
  const whatCandidateIs = await generateCandidateProfile(data);
  
  // 2. Ce qu'il apporte
  const whatTheyBring = await generateValueProposition(data);
  
  // 3. Ce qui le distingue
  const whatDistinguishesThem = await generateDifferentiators(data);
  
  // 4. Ce qui interroge
  const whatRaisesQuestions = await generateQuestions(data);
  
  // 5. La décision et pourquoi
  const decisionAndWhy = await generateDecisionRationale(data, recommendation);
  
  return {
    whatCandidateIs,
    whatTheyBring,
    whatDistinguishesThem,
    whatRaisesQuestions,
    decisionAndWhy
  };
}
```

### 5.2 Section 2 - Évaluation Structurée

```typescript
async function generateSection2(data: DebriefData): Promise<ExpertDebrief['section2']> {
  // Compétences techniques
  const technicalSkills = await evaluateTechnicalSkills(data);
  
  // Expérience pertinente
  const relevantExperience = await evaluateExperience(data);
  
  // Soft skills globaux
  const softSkills = await evaluateSoftSkills(data);
  
  // Adéquation culturelle
  const culturalFit = await evaluateCulturalFit(data);
  
  // Potentiel d'évolution
  const evolutionPotential = await evaluateEvolutionPotential(data);
  
  // Score global
  const globalScore = technicalSkills.score + 
                     relevantExperience.score + 
                     softSkills.globalScore + 
                     culturalFit.score + 
                     evolutionPotential.score;
  
  return {
    technicalSkills,
    relevantExperience,
    softSkills,
    culturalFit,
    evolutionPotential,
    globalScore
  };
}
```

### 5.3 Section 3 - Points Forts

```typescript
async function generateSection3(data: DebriefData): Promise<ExpertDebrief['section3']> {
  const strengths: ExpertDebrief['section3']['strengths'] = [];
  
  // Points forts de l'entretien
  for (const strength of data.interviewSummary.strengths.technical) {
    const evidence = await findEvidenceForStrength(strength, data);
    strengths.push({
      point: strength,
      example: evidence.example,
      citation: evidence.citation
    });
  }
  
  // Points forts soft skills
  for (const strength of data.softSkillsSummary.strengths) {
    const evidence = await findEvidenceForSoftSkill(strength, data);
    strengths.push({
      point: `${strength.skillName} : ${strength.rating}/5`,
      example: evidence.example,
      citation: evidence.citation
    });
  }
  
  // Limitation à 5 points forts
  return {
    strengths: strengths.slice(0, 5)
  };
}
```

### 5.4 Section 4 - Points de Vigilance

```typescript
async function generateSection4(data: DebriefData): Promise<ExpertDebrief['section4']> {
  const vigilancePoints: ExpertDebrief['section4']['vigilancePoints'] = [];
  
  // Signaux de vigilance de l'entretien
  for (const signal of data.signalDetections) {
    if (signal.vigilanceSignals.detected.length > 0) {
      for (const signalText of signal.vigilanceSignals.detected) {
        const criticality = await determineCriticality(signal, signalText);
        const impact = await determineImpact(signal, signalText);
        
        vigilancePoints.push({
          point: signalText,
          signal: signal.vigilanceSignals.detected.join(', '),
          criticality,
          impact
        });
      }
    }
  }
  
  // Points faibles soft skills
  for (const weakness of data.softSkillsSummary.improvementAreas) {
    if (weakness.rating <= 2) {
      const criticality = weakness.rating === 1 ? 'blocking' : 'significant';
      const impact = `Soft skill ${weakness.skillName} insuffisant pour le poste`;
      
      vigilancePoints.push({
        point: `${weakness.skillName} : ${weakness.rating}/5`,
        signal: weakness.gaps.join(', '),
        criticality,
        impact
      });
    }
  }
  
  return {
    vigilancePoints
  };
}
```

### 5.5 Section 5 - Zones d'Ombre

```typescript
async function generateSection5(data: DebriefData): Promise<ExpertDebrief['section5']> {
  const shadowZones: ExpertDebrief['section5']['shadowZones'] = [];
  
  // Identification des zones non évaluées
  const evaluatedSkills = new Set(data.softSkillsRatings.map(r => r.skillId));
  const requiredSkills = data.jobAnalysis.requiredSoftSkills;
  
  for (const requiredSkill of requiredSkills) {
    if (!evaluatedSkills.has(requiredSkill.id)) {
      shadowZones.push({
        zone: requiredSkill.name,
        whyNotEvaluated: 'Non évalué lors de l\'entretien',
        importance: requiredSkill.importance,
        round2Question: await generateRound2Question(requiredSkill)
      });
    }
  }
  
  // Zones d'ombre de l'entretien
  for (const question of data.interviewBrief.questions) {
    if (question.type === 'must_ask' && !wasAsked(question.id, data.responses)) {
      shadowZones.push({
        zone: question.question,
        whyNotEvaluated: 'Question incontournable non posée',
        importance: 'critical',
        round2Question: question.question
      });
    }
  }
  
  return {
    shadowZones
  };
}
```

### 5.6 Section 6 - Décision Argumentée

```typescript
async function generateSection6(
  data: DebriefData,
  section2: ExpertDebrief['section2']
): Promise<ExpertDebrief['section6']> {
  const recommendation = section2.globalScore >= 70 ? 'Recommandé' : 
                        section2.globalScore >= 50 ? 'Recommandé avec réserves' :
                        section2.globalScore >= 30 ? 'Dossier à approfondir' : 'Non recommandé';
  
  // Arguments principaux
  const mainArguments = await generateMainArguments(data, section2);
  
  // Conditions
  const conditions = await generateConditions(data, section2);
  
  // Risques résiduels
  const acceptedRisks = await generateAcceptedRisks(data, section4);
  
  // Vérifications avant offre
  const verificationBeforeOffer = await generateVerificationChecklist(data, section2);
  
  return {
    mainRecommendation: recommendation,
    mainArguments,
    conditions,
    acceptedRisks,
    verificationBeforeOffer
  };
}
```

### 5.7 Section 7 - Plan Onboarding

```typescript
async function generateSection7(
  data: DebriefData,
  section6: ExpertDebrief['section6']
): Promise<ExpertDebrief['section7']> {
  // Si non recommandé, section vide
  if (section6.mainRecommendation.includes('Non recommandé')) {
    return {
      integrationVigilancePoints: [],
      skillsToDevelop: [],
      compatibleManagerProfile: '',
      autonomyTimeline: '',
      developmentPlan: {
        days1to30: '',
        days31to60: '',
        days61to90: ''
      }
    };
  }
  
  // Points de vigilance pour l'intégration
  const integrationVigilancePoints = await generateIntegrationVigilance(data);
  
  // Compétences à développer
  const skillsToDevelop = await generateSkillsToDevelop(data);
  
  // Profil de manager compatible
  const compatibleManagerProfile = await generateManagerProfile(data);
  
  // Délai avant autonomie
  const autonomyTimeline = await estimateAutonomyTimeline(data);
  
  // Plan de développement 90 jours
  const developmentPlan = await generateDevelopmentPlan(data);
  
  return {
    integrationVigilancePoints,
    skillsToDevelop,
    compatibleManagerProfile,
    autonomyTimeline,
    developmentPlan
  };
}
```

### 5.8 Section 8 - Feedback Candidat

```typescript
async function generateSection8(
  data: DebriefData,
  section6: ExpertDebrief['section6']
): Promise<ExpertDebrief['section8']> {
  const candidate = data.candidate;
  const job = data.job;
  const interview = data.interview;
  
  // Points forts
  const strengthsText = data.section3.strengths
    .map(s => `• ${s.point}`)
    .join('\n');
  
  // Axes d'amélioration
  const improvementsText = data.softSkillsSummary.improvementAreas
    .slice(0, 2)
    .map(i => `• ${i.skillName} : ${i.recommendation}`)
    .join('\n');
  
  // Décision
  const decisionText = await generateDecisionText(section6, candidate);
  
  // Génération du feedback
  const feedback = `Bonjour ${candidate.firstName},

Nous avons apprécié notre échange du ${formatDate(interview.startedAt)} pour le poste de ${job.title}.

Points forts :
${strengthsText}

Axes d'amélioration :
${improvementsText}

Décision :
${decisionText}

Nous vous souhaitons beaucoup de succès dans votre recherche et espérons avoir l'occasion de vous recontacter à l'avenir.

Cordialement,

${data.recruiter.name}
${data.recruiter.title}
${data.recruiter.company}`;
  
  // Vérification de conformité légale
  const isCompliant = await checkLegalCompliance(feedback);
  if (!isCompliant) {
    throw new Error('Feedback candidat non conforme aux obligations légales');
  }
  
  return {
    candidateFeedback: feedback
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE expert_debrief (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  interview_date TIMESTAMP NOT NULL,
  duration INT NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  section1 JSON NOT NULL,
  section2 JSON NOT NULL,
  section3 JSON NOT NULL,
  section4 JSON NOT NULL,
  section5 JSON NOT NULL,
  section6 JSON NOT NULL,
  section7 JSON NOT NULL,
  section8 JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiters(id)
);

CREATE INDEX idx_debrief_interview ON expert_debrief(interview_id);
CREATE INDEX idx_debrief_candidate ON expert_debrief(candidate_id);
CREATE INDEX idx_debrief_job ON expert_debrief(job_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/expert-debrief/generate
async function generateDebrief(interviewId: string, recruiterId: string): Promise<ExpertDebrief> {
  return await generateExpertDebrief(interviewId, recruiterId);
}

// GET /api/expert-debrief/:id
async function getDebrief(id: string): Promise<ExpertDebrief> {
  return await getDebriefById(id);
}

// GET /api/expert-debrief/interview/:interviewId
async function getDebriefByInterview(interviewId: string): Promise<ExpertDebrief> {
  return await getDebriefByInterviewId(interviewId);
}

// PUT /api/expert-debrief/:id
async function updateDebrief(id: string, debrief: Partial<ExpertDebrief>): Promise<ExpertDebrief> {
  return await modifyDebrief(id, debrief);
}

// POST /api/expert-debrief/:id/approve
async function approveDebrief(id: string, recruiterNotes?: string): Promise<void> {
  return await markAsApproved(id, recruiterNotes);
}

// POST /api/expert-debrief/:id/export
async function exportDebrief(id: string, format: 'pdf' | 'docx'): Promise<Buffer> {
  return await exportToFormat(id, format);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Génération

| Métrique | Description | Cible |
|----------|-------------|-------|
| Temps de génération | Temps moyen de génération | < 10 minutes |
| Taux de succès | Debriefs générés / tentatives | 100% |
| Taux de preuves | Affirmations avec preuves / total | 100% |
| Conformité légale | Feedbacks conformes / total | 100% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Debriefs consultés / générés | ≥ 90% |
| Taux d'approbation | Debriefs approuvés / total | ≥ 95% |
| Satisfaction recruteur | Satisfaction avec le debrief | ≥ 4.5/5 |

---

## 9. Conclusion

La génération automatique du debrief compile toutes les données de l'entretien pour produire une synthèse structurée, argumentée et actionnelle en moins de 10 minutes. Chaque section est générée automatiquement à partir des données disponibles.

**Points clés :**
- Collecte de données multiples (MVP-013, MVP-014, MVP-001, MVP-003)
- Génération automatique des 8 sections
- Temps de génération < 10 minutes
- Preuve obligatoire pour chaque affirmation
- Citation exacte quand disponible
- Vérification de conformité légale pour le feedback candidat
- Plan d'onboarding suggéré si recommandé
