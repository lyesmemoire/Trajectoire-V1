# DOC-015-07 : Feedback Candidat Automatique

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de génération automatique du feedback candidat pour MVP-015 Debrief Expert. Ce système génère un feedback professionnel, respectueux et conforme aux obligations légales, utilisable directement en cas de refus.

---

## 2. Principe Fondateur

Le feedback candidat doit être formulé de manière professionnelle, respectueux et constructif. Il doit être conforme aux obligations légales (pas de mention de critères prohibés) et utilisable directement sans modification.

---

## 3. Obligations Légales

### 3.1 Critères Prohibés

**En France (Loi du 2 août 2021 pour renforcer la lutte contre les discriminations) :**

Critères interdits dans le feedback :
- Âge
- Origine, ethnie, nationalité
- Sexe, orientation sexuelle, identité de genre
- Situation familiale, grossesse
- Apparence physique
- Patronyme
- État de santé, handicap
- Caractéristiques génétiques
- Mœurs
- Appartenance à un peuple supposé
- Opinions politiques
- Activités syndicales
- Lieu de résidence

**Sanctions :**
- Amende jusqu'à 45 000€ pour une personne
- Amende jusqu'à 225 000€ pour une entreprise
- Responsabilité civile et pénale

### 3.2 Règles de Conformité

**Règle 1 : Feedback basé sur les compétences uniquement**
- Seuls les critères professionnels peuvent être mentionnés
- Compétences techniques, expérience, soft skills
- Adéquation avec le poste

**Règle 2 : Feedback factuel et objectif**
- Basé sur des preuves concrètes de l'entretien
- Pas de jugement de valeur subjectif
- Pas de comparaison avec d'autres candidats

**Règle 3 : Feedback respectueux**
- Ton professionnel et courtois
- Pas de langage discriminatoire ou stigmatisant
- Reconnaissance des points forts

**Règle 4 : Feedback constructif**
- Même en cas de refus, mentionner les points forts
- Axes d'amélioration formulés de manière constructive
- Pas de critique personnelle

---

## 4. Structure du Feedback Candidat

### 4.1 Template de Feedback

```
Bonjour [Prénom],

Nous avons apprécié notre échange du [Date] pour le poste de [Poste].

Points forts :
• [Point fort 1]
• [Point fort 2]
• [Point fort 3]

Axes d'amélioration :
• [Axe d'amélioration 1]
• [Axe d'amélioration 2]

Décision :
[Recommandation ou refus avec justification professionnelle]

Nous vous souhaitons beaucoup de succès dans votre recherche et espérons avoir l'occasion de vous recontacter à l'avenir.

Cordialement,

[Nom du recruteur]
[Titre]
[Entreprise]
```

---

### 4.2 Exemples de Feedback

**Exemple 1 : Recommandation forte**

```
Bonjour Marie,

Nous avons apprécié notre échange du 3 août 2026 pour le poste de Chef de Projet Digital.

Points forts :
• Expertise solide en gestion de projet avec 5 ans d'expérience sur des projets digitaux complexes
• Leadership démontré avec capacité à fédérer des équipes pluridisciplinaires
• Communication claire et structurée, particulièrement appréciée dans les présentations aux parties prenantes

Axes d'amélioration :
• Continuer à développer la vision stratégique à moyen terme pour évoluer vers des responsabilités plus larges

Décision :
Nous sommes ravis de vous informer que nous souhaitons vous proposer le poste de Chef de Projet Digital. Votre profil correspond parfaitement à nos attentes et nous sommes convaincus que vous apporterez une valeur significative à notre équipe.

Nous vous souhaitons beaucoup de succès et espérons avoir l'occasion de vous recontacter à l'avenir.

Cordialement,

Jean Dupont
Directeur Recrutement
TechCorp
```

---

**Exemple 2 : Recommandation avec réserves**

```
Bonjour Thomas,

Nous avons apprécié notre échange du 3 août 2026 pour le poste de Développeur Senior.

Points forts :
• Compétences techniques solides en développement backend avec une maîtrise avancée de Node.js et Python
• Capacité d'apprentissage rapide et curiosité technologique démontrée
• Esprit d'équipe et collaboration appréciée

Axes d'amélioration :
• Développer les compétences en leadership pour accompagner des juniors
• Renforcer la communication technique avec les équipes non techniques

Décision :
Après mûre réflexion, nous souhaitons vous proposer le poste de Développeur Senior sous réserve de la mise en place d'un plan de développement ciblé sur le leadership et la communication technique. Nous pensons que votre profil est solide et que ces compétences peuvent être développées avec un accompagnement adapté.

Nous vous souhaitons beaucoup de succès et espérons avoir l'occasion de vous recontacter à l'avenir.

Cordialement,

Jean Dupont
Directeur Recrutement
TechCorp
```

---

**Exemple 3 : Non recommandé**

```
Bonjour Sophie,

Nous avons apprécié notre échange du 3 août 2026 pour le poste de Product Manager.

Points forts :
• Bonne compréhension des enjeux business et capacité à analyser les besoins utilisateurs
• Communication fluide et aisance relationnelle

Axes d'amélioration :
• Approfondir la méthodologie de gestion de produit et les frameworks agiles
• Développer l'expérience sur des produits B2B similaires à notre contexte

Décision :
Après avoir examiné votre profil avec attention, nous avons décidé de ne pas poursuivre votre candidature pour ce poste. Nous recherchons un profil avec une expérience plus approfondie en gestion de produit B2B et une maîtrise plus avancée des frameworks agiles.

Nous vous souhaitons beaucoup de succès dans votre recherche et espérons avoir l'occasion de vous recontacter à l'avenir.

Cordialement,

Jean Dupont
Directeur Recrutement
TechCorp
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface CandidateFeedback {
  feedbackId: string;
  interviewId: string;
  candidateId: string;
  jobId: string;
  generatedAt: Date;
  
  greeting: string;
  
  strengths: {
    point: string;
    evidence?: string;
  }[];
  
  improvements: {
    point: string;
    suggestion?: string;
  }[];
  
  decision: {
    type: 'offer' | 'offer_with_conditions' | 'not_proceeding';
    justification: string;
    nextSteps?: string;
  };
  
  closing: string;
  
  recruiter: {
    name: string;
    title: string;
    company: string;
  };
  
  legalCompliance: {
    compliant: boolean;
    checkedAt: Date;
    prohibitedCriteria: string[];
  };
  
  validation: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Date;
    comments?: string;
  };
}
```

---

## 6. Algorithme de Génération

### 6.1 Processus de Génération

```typescript
async function generateCandidateFeedback(
  data: DebriefData,
  decision: DecisionArgumentation
): Promise<CandidateFeedback> {
  // Étape 1 : Génération de la salutation
  const greeting = await generateGreeting(data.candidate, data.interview);
  
  // Étape 2 : Génération des points forts
  const strengths = await generateStrengths(data);
  
  // Étape 3 : Génération des axes d'amélioration
  const improvements = await generateImprovements(data);
  
  // Étape 4 : Génération de la décision
  const decisionText = await generateDecision(data, decision);
  
  // Étape 5 : Génération de la formule de politesse
  const closing = await generateClosing();
  
  // Étape 6 : Informations du recruteur
  const recruiter = {
    name: data.recruiter.name,
    title: data.recruiter.title,
    company: data.recruiter.company
  };
  
  // Construction du feedback
  const feedback: CandidateFeedback = {
    feedbackId: generateFeedbackId(),
    interviewId: data.interview.id,
    candidateId: data.candidate.id,
    jobId: data.job.id,
    generatedAt: new Date(),
    
    greeting,
    strengths,
    improvements,
    decision: decisionText,
    closing,
    recruiter,
    
    legalCompliance: {
      compliant: false,
      checkedAt: new Date(),
      prohibitedCriteria: []
    },
    
    validation: { validated: false }
  };
  
  // Vérification de conformité légale
  const complianceCheck = await checkLegalCompliance(feedback);
  feedback.legalCompliance = complianceCheck;
  
  if (!complianceCheck.compliant) {
    throw new Error('Feedback non conforme aux obligations légales');
  }
  
  // Sauvegarde du feedback
  await saveFeedback(feedback);
  
  return feedback;
}
```

### 6.2 Génération des Points Forts

```typescript
async function generateStrengths(data: DebriefData): Promise<CandidateFeedback['strengths']> {
  const strengths: CandidateFeedback['strengths'][] = [];
  
  // Points forts de l'évaluation
  const topStrengths = data.section3.strengths.slice(0, 3);
  
  for (const strength of topStrengths) {
    strengths.push({
      point: strength.point,
      evidence: strength.example
    });
  }
  
  // Si moins de 3 points forts, compléter avec soft skills
  if (strengths.length < 3) {
    const softSkillsStrengths = data.softSkillsSummary.strengths.slice(0, 3 - strengths.length);
    
    for (const skill of softSkillsStrengths) {
      strengths.push({
        point: `${skill.skillName} : ${skill.rating}/5`,
        evidence: skill.evidence[0]
      });
    }
  }
  
  return strengths;
}
```

### 6.3 Génération des Axes d'Amélioration

```typescript
async function generateImprovements(data: DebriefData): Promise<CandidateFeedback['improvements']> {
  const improvements: CandidateFeedback['improvements'][] = [];
  
  // Axes d'amélioration basés sur les soft skills faibles
  const weakSoftSkills = data.softSkillsSummary.improvementAreas.slice(0, 2);
  
  for (const weakness of weakSoftSkills) {
    improvements.push({
      point: `${weakness.skillName} à développer`,
      suggestion: weakness.recommendation
    });
  }
  
  // Si pas d'axes d'amélioration, mentionner la poursuite du développement
  if (improvements.length === 0) {
    improvements.push({
      point: 'Continuer à développer les compétences pour évoluer vers des responsabilités plus larges',
      suggestion: 'Formation continue et mentorat'
    });
  }
  
  return improvements;
}
```

### 6.4 Génération de la Décision

```typescript
async function generateDecision(
  data: DebriefData,
  decision: DecisionArgumentation
): Promise<CandidateFeedback['decision']> {
  const recommendation = decision.mainRecommendation;
  
  let type: 'offer' | 'offer_with_conditions' | 'not_proceeding';
  let justification: string;
  let nextSteps?: string;
  
  if (recommendation === 'strong_recommend') {
    type = 'offer';
    justification = `Votre profil correspond parfaitement à nos attentes et nous sommes convaincus que vous apporterez une valeur significative à notre équipe.`;
    nextSteps = 'Nous vous contacterons prochainement pour vous proposer une offre.';
  } else if (recommendation === 'recommend_with_reservations') {
    type = 'offer_with_conditions';
    justification = `Nous pensons que votre profil est solide et que les compétences identifiées peuvent être développées avec un accompagnement adapté.`;
    nextSteps = 'Nous vous contacterons prochainement pour discuter des conditions de l\'offre et du plan de développement.';
  } else {
    type = 'not_proceeding';
    justification = await generateRejectionJustification(data, decision);
  }
  
  return {
    type,
    justification,
    nextSteps
  };
}

async function generateRejectionJustification(
  data: DebriefData,
  decision: DecisionArgumentation
): Promise<string> {
  const mainArguments = decision.mainArguments;
  
  // Génération d'une justification professionnelle basée sur les arguments
  const justifications: string[] = [];
  
  for (const arg of mainArguments) {
    if (arg.argument.includes('compétences techniques')) {
      justifications.push('Nous recherchons un profil avec des compétences techniques plus avancées.');
    } else if (arg.argument.includes('expérience')) {
      justifications.push('Nous recherchons un profil avec une expérience plus approfondie dans ce domaine.');
    } else if (arg.argument.includes('soft skills')) {
      justifications.push('Nous recherchons un profil avec des soft skills plus développés.');
    }
  }
  
  // Si pas de justification spécifique, justification générique
  if (justifications.length === 0) {
    justifications.push('Après avoir examiné votre profil avec attention, nous avons décidé de poursuivre d\'autres candidatures qui correspondent davantage à nos besoins actuels.');
  }
  
  return justifications.join(' ');
}
```

---

## 7. Vérification de Conformité Légale

### 7.1 Algorithme de Vérification

```typescript
async function checkLegalCompliance(feedback: CandidateFeedback): Promise<CandidateFeedback['legalCompliance']> {
  const prohibitedCriteria = [
    'âge',
    'origine',
    'ethnie',
    'nationalité',
    'sexe',
    'orientation sexuelle',
    'identité de genre',
    'situation familiale',
    'grossesse',
    'apparence physique',
    'patronyme',
    'état de santé',
    'handicap',
    'caractéristiques génétiques',
    'mœurs',
    'appartenance ethnique',
    'opinions politiques',
    'activités syndicales',
    'lieu de résidence'
  ];
  
  const detectedProhibited: string[] = [];
  
  // Vérification du texte complet
  const fullText = `
    ${feedback.greeting}
    ${feedback.strengths.map(s => s.point).join(' ')}
    ${feedback.improvements.map(i => i.point).join(' ')}
    ${feedback.decision.justification}
  `.toLowerCase();
  
  // Recherche de critères prohibés
  for (const criterion of prohibitedCriteria) {
    if (fullText.includes(criterion)) {
      detectedProhibited.push(criterion);
    }
  }
  
  // Vérification des critères indirects
  const indirectPatterns = [
    /trop (jeune|âgé|vieux)/i,
    /famille/i,
    /marié|célibataire/i,
    /enfants/i,
    /origine/i,
    /nationalité/i,
    /handicap/i,
    /maladie/i
  ];
  
  for (const pattern of indirectPatterns) {
    if (pattern.test(fullText)) {
      detectedProhibited.push(pattern.source);
    }
  }
  
  return {
    compliant: detectedProhibited.length === 0,
    checkedAt: new Date(),
    prohibitedCriteria: detectedProhibited
  };
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE candidate_feedback (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  greeting TEXT NOT NULL,
  strengths JSON NOT NULL,
  improvements JSON NOT NULL,
  decision JSON NOT NULL,
  closing TEXT NOT NULL,
  recruiter JSON NOT NULL,
  
  legal_compliance JSON NOT NULL,
  
  validated BOOLEAN DEFAULT FALSE,
  validated_by VARCHAR(36),
  validated_at TIMESTAMP,
  validation_comments TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_feedback_interview ON candidate_feedback(interview_id);
CREATE INDEX idx_feedback_candidate ON candidate_feedback(candidate_id);
CREATE INDEX idx_feedback_compliance ON candidate_feedback(legal_compliance);
```

---

## 9. API Endpoints

```typescript
// POST /api/candidate-feedback
async function generateFeedback(interviewId: string): Promise<CandidateFeedback> {
  return await generateCandidateFeedback(interviewId);
}

// GET /api/candidate-feedback/:id
async function getFeedback(id: string): Promise<CandidateFeedback> {
  return await getFeedbackById(id);
}

// GET /api/candidate-feedback/interview/:interviewId
async function getFeedbackByInterview(interviewId: string): Promise<CandidateFeedback> {
  return await getFeedbackByInterviewId(interviewId);
}

// PUT /api/candidate-feedback/:id
async function updateFeedback(id: string, feedback: Partial<CandidateFeedback>): Promise<CandidateFeedback> {
  return await modifyFeedback(id, feedback);
}

// POST /api/candidate-feedback/:id/send
async function sendFeedback(id: string, method: 'email' | 'sms'): Promise<void> {
  return await sendCandidateFeedback(id, method);
}

// POST /api/candidate-feedback/:id/validate
async function validateFeedback(id: string, validation: CandidateFeedback['validation']): Promise<void> {
  return await markAsValidated(id, validation);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de conformité légale | Feedbacks conformes / total | 100% |
| Taux de validation | Feedbacks validés / total | 100% |
| Taux d'envoi | Feedbacks envoyés / générés | ≥ 90% |
| Satisfaction candidat | Satisfaction avec le feedback | ≥ 4/5 |

### 10.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Feedbacks utilisés / générés | ≥ 95% |
| Temps d'envoi | Délai moyen entre génération et envoi | < 24 heures |
| Taux de réponse | Réponses des candidats / envoyés | ≥ 50% |

---

## 11. Conclusion

Le feedback candidat automatique génère un feedback professionnel, respectueux et conforme aux obligations légales, utilisable directement en cas de refus. Chaque feedback est vérifié pour s'assurer qu'il ne contient aucun critère prohibé.

**Points clés :**
- Template professionnel et respectueux
- Points forts basés sur l'évaluation
- Axes d'amélioration formulés de manière constructive
- Décision avec justification professionnelle
- Vérification obligatoire de conformité légale
- Détection automatique des critères prohibés
- Validation obligatoire avant envoi
- Envoi automatique par email ou SMS
