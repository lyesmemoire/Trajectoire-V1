# DOC-020-02 : Guide de Prise de Références Expert

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de guide de prise de références expert pour MVP-020 Reference Intelligence. Ce système génère pour chaque candidat un protocole de prise de références personnalisé avec choix des référents, questions calibrées pour confirmer ou infirmer les hypothèses de l'entretien, et analyse des réponses.

---

## 2. Principe Fondateur

Pour chaque candidat, le moteur génère un protocole de prise de références personnalisé. Le moteur identifie les référents à contacter en priorité, génère des questions fondamentales calibrées, génère des questions ciblées sur les zones d'ombre détectées en entretien, et fournit un guide d'analyse des réponses avec signaux positifs, de vigilance, et d'alerte.

---

## 3. Choix des Référents

### 3.1 Référents à Contacter en Priorité

**Ancien manager direct (obligatoire) :**
- Priorité : Mandatory
- Relation : Manager direct
- Période de contact : 2-5 ans maximum
- Raison : Meilleure connaissance du travail quotidien et des résultats

**Pair qui a travaillé étroitement :**
- Priorité : Recommended
- Relation : Collègue de même niveau
- Période de contact : 2-5 ans maximum
- Raison : Connaissance de la collaboration et des soft skills

**Subordonné si poste de management :**
- Priorité : Recommended
- Relation : Collaborateur direct
- Période de contact : 2-5 ans maximum
- Raison : Connaissance du style de management

**Client si poste orienté relation client :**
- Priorité : Recommended
- Relation : Client ou partenaire
- Période de contact : 2-5 ans maximum
- Raison : Connaissance de la relation client et des résultats

---

### 3.2 Référents à Éviter

**Références choisies uniquement par le candidat :**
- Sans possibilité d'en choisir d'autres
- Risque de biais de sélection
- Action : Demander au candidat d'autres référents

**Amis ou relations personnelles :**
- Risque de manque d'objectivité
- Action : Éviter ou confirmer la relation professionnelle

**Référents trop anciens (> 5 ans) :**
- Risque de données obsolètes
- Action : Préférer des référents plus récents

---

## 4. Questions pour la Prise de Références

### 4.1 Questions Fondamentales

Les questions fondamentales sont calibrées pour confirmer ou infirmer les hypothèses de l'entretien.

**Question 1 — Contexte de travail :**
"Dans quel contexte avez-vous travaillé ensemble et pendant combien de temps ?"

**Question 2 — Responsabilités principales :**
"Quelles étaient ses principales responsabilités ?"

**Question 3 — Points forts remarquables :**
"Quels étaient ses points forts les plus remarquables ?"

**Question 4 — Axes de progression :**
"Dans quels domaines avait-il/elle des axes de progression ?"

**Question 5 — Recommandation :**
"Le/la recruteriez-vous à nouveau ? Pourquoi ?"

**Question 6 — Information importante :**
"Y a-t-il quelque chose que je devrais savoir avant de prendre ma décision ?"

---

### 4.2 Questions Ciblées sur les Zones d'Ombre

Les questions ciblées sont générées automatiquement par le moteur en fonction du profil du candidat et des zones d'ombre détectées en entretien.

**Exemples de questions ciblées :**

**Si zone d'ombre : Leadership :**
"Comment a-t-il/elle géré les situations de crise ou de pression ?"
"Pouvez-vous me donner un exemple où il/elle a dû prendre une décision difficile ?"

**Si zone d'ombre : Travail en équipe :**
"Comment a-t-il/elle collaboré avec les autres membres de l'équipe ?"
"A-t-il/elle eu des conflits avec des collègues ? Comment a-t-il/elle géré cela ?"

**Si zone d'ombre : Résistance au changement :**
"Comment a-t-il/elle réagi aux changements organisationnels ?"
"A-t-il/elle montré de l'adaptabilité face aux nouvelles méthodes de travail ?"

**Si zone d'ombre : Communication :**
"Comment a-t-il/elle communiqué avec son équipe et ses managers ?"
"A-t-il/elle su adapter son style de communication selon son interlocuteur ?"

---

## 5. Algorithme de Génération du Protocole

### 5.1 Processus Global

```typescript
async function generateReferenceProtocol(candidateId: string, interviewId: string): Promise<ReferenceProtocol> {
  // 1. Récupération des données du candidat
  const candidate = await getCandidate(candidateId);
  const interview = await getInterview(interviewId);
  
  // 2. Identification des référents recommandés
  const recommendedReferees = await identifyRecommendedReferees(candidate);
  
  // 3. Identification des référents à éviter
  const avoidedReferees = await identifyAvoidedReferees(candidate);
  
  // 4. Génération des questions fondamentales
  const fundamentalQuestions = await generateFundamentalQuestions();
  
  // 5. Génération des questions ciblées
  const targetedQuestions = await generateTargetedQuestions(interview);
  
  // 6. Génération du guide d'analyse
  const analysisGuide = await generateAnalysisGuide();
  
  // 7. Construction du protocole
  const protocol: ReferenceProtocol = {
    protocolId: generateProtocolId(),
    candidateId,
    generatedAt: new Date(),
    
    recommendedReferees,
    avoidedReferees,
    
    fundamentalQuestions,
    targetedQuestions,
    
    analysisGuide
  };
  
  // 8. Sauvegarde du protocole
  await saveReferenceProtocol(protocol);
  
  return protocol;
}
```

---

### 5.2 Identification des Référents Recommandés

```typescript
async function identifyRecommendedReferees(candidate: Candidate): Promise<RecommendedReferee[]> {
  const referees: RecommendedReferee[] = [];
  
  // Ancien manager direct (obligatoire)
  const recentManagers = candidate.workHistory
    .filter(job => job.isManager && job.duration <= 5)
    .slice(0, 2);
  
  for (const manager of recentManagers) {
    referees.push({
      type: 'manager',
      priority: 'mandatory',
      relationship: 'Manager direct',
      contactPeriod: `${manager.duration} ans`
    });
  }
  
  // Pair qui a travaillé étroitement
  const recentPeers = candidate.workHistory
    .filter(job => !job.isManager && job.duration <= 5)
    .slice(0, 2);
  
  for (const peer of recentPeers) {
    referees.push({
      type: 'peer',
      priority: 'recommended',
      relationship: 'Collègue de même niveau',
      contactPeriod: `${peer.duration} ans`
    });
  }
  
  // Subordonné si poste de management
  if (candidate.targetRole.includes('manager') || candidate.targetRole.includes('lead')) {
    const recentSubordinates = candidate.workHistory
      .filter(job => job.hasSubordinates && job.duration <= 5)
      .slice(0, 2);
    
    for (const subordinate of recentSubordinates) {
      referees.push({
        type: 'subordinate',
        priority: 'recommended',
        relationship: 'Collaborateur direct',
        contactPeriod: `${subordinate.duration} ans`
      });
    }
  }
  
  // Client si poste orienté relation client
  if (candidate.targetRole.includes('sales') || candidate.targetRole.includes('account')) {
    referees.push({
      type: 'client',
      priority: 'recommended',
      relationship: 'Client ou partenaire',
      contactPeriod: '2-5 ans'
    });
  }
  
  return referees;
}
```

---

### 5.3 Génération des Questions Ciblées

```typescript
async function generateTargetedQuestions(interview: Interview): Promise<ReferenceQuestion[]> {
  const questions: ReferenceQuestion[] = [];
  
  // Récupération des zones d'ombre détectées
  const shadowAreas = await detectShadowAreas(interview);
  
  for (const area of shadowAreas) {
    const targetedQuestion = await generateQuestionForArea(area);
    questions.push(targetedQuestion);
  }
  
  return questions;
}

async function generateQuestionForArea(area: ShadowArea): Promise<ReferenceQuestion> {
  const questionTemplates: Record<string, string[]> = {
    leadership: [
      "Comment a-t-il/elle géré les situations de crise ou de pression ?",
      "Pouvez-vous me donner un exemple où il/elle a dû prendre une décision difficile ?",
      "Comment a-t-il/elle motivé son équipe ?"
    ],
    teamwork: [
      "Comment a-t-il/elle collaboré avec les autres membres de l'équipe ?",
      "A-t-il/elle eu des conflits avec des collègues ? Comment a-t-il/elle géré cela ?",
      "Comment a-t-il/elle contribué aux projets d'équipe ?"
    ],
    adaptability: [
      "Comment a-t-il/elle réagi aux changements organisationnels ?",
      "A-t-il/elle montré de l'adaptabilité face aux nouvelles méthodes de travail ?",
      "Comment a-t-il/elle géré les situations imprévues ?"
    ],
    communication: [
      "Comment a-t-il/elle communiqué avec son équipe et ses managers ?",
      "A-t-il/elle su adapter son style de communication selon son interlocuteur ?",
      "Comment a-t-il/elle présenté des informations complexes ?"
    ]
  };
  
  const templates = questionTemplates[area.type] || questionTemplates['leadership'];
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    questionId: generateQuestionId(),
    question: selectedTemplate,
    category: 'targeted',
    targetArea: area.type,
    expectedSignals: area.expectedSignals
  };
}
```

---

## 6. Analyse des Références

### 6.1 Signaux Positifs

**Enthousiasme spontané du référent :**
- Ton chaleureux et engagé
- Volonté de donner des détails
- Énergie positive dans les réponses

**Exemples concrets et précis donnés :**
- Réponses avec des exemples spécifiques
- Détails sur les réalisations
- Contextualisation des situations

**Recommandation sans réserve :**
- "Je le recruterai sans hésitation"
- "C'était un excellent collaborateur"
- Recommandation claire et positive

**Cohérence avec le discours du candidat :**
- Points forts confirmés par les références
- Expériences cohérentes
- Pas de contradiction majeure

---

### 6.2 Signaux de Vigilance

**Hésitations ou silences significatifs :**
- Pauses longues avant de répondre
- Réponses évasives
- Évitement de certains sujets

**Formulations très génériques et creuses :**
- "Il était bien"
- "C'était un bon employé"
- Absence de détails spécifiques

**Refus de répondre sur certains points :**
- "Je préfère ne pas commenter"
- "Ce n'est pas ma place"
- Évitement de questions spécifiques

**Divergence avec le discours du candidat :**
- Points forts non confirmés
- Expériences différentes de celles décrites
- Contradictions mineures

**Référent qui parle peu et rapidement :**
- Réponses courtes
- Volonté de terminer l'appel rapidement
- Manque d'engagement

---

### 6.3 Signaux d'Alerte

**"Je ne peux pas commenter" :**
- Refus catégorique de répondre
- Malaise évident
- Signal fort de problème

**Référent manifestement mal à l'aise :**
- Tension dans la voix
- Hésitations fréquentes
- Inconfort perceptible

**Contradiction directe avec le candidat :**
- Négation de points forts déclarés
- Réfutation d'expériences décrites
- Incohérence majeure

**Recommandation conditionnelle ou tiède :**
- "Je le recruterai peut-être"
- "Ça dépend du poste"
- Recommandation mitigée

---

## 7. Algorithme d'Analyse des Réponses

### 7.1 Processus Global

```typescript
async function analyzeReferenceResponses(protocolId: string, responses: RefereeResponse[]): Promise<ReferenceAnalysis> {
  // 1. Analyse individuelle de chaque réponse
  const individualAnalyses = await analyzeIndividualResponses(responses);
  
  // 2. Agrégation des signaux
  const aggregatedSignals = await aggregateSignals(individualAnalyses);
  
  // 3. Évaluation globale
  const overallAssessment = await evaluateOverallAssessment(aggregatedSignals);
  
  // 4. Construction de l'analyse
  const analysis: ReferenceAnalysis = {
    analysisId: generateAnalysisId(),
    protocolId,
    candidateId: responses[0].candidateId,
    analyzedAt: new Date(),
    
    refereeResponses: responses,
    
    overallAnalysis: {
      positiveSignals: aggregatedSignals.positive,
      vigilanceSignals: aggregatedSignals.vigilance,
      alertSignals: aggregatedSignals.alert,
      overallAssessment
    }
  };
  
  // 5. Sauvegarde de l'analyse
  await saveReferenceAnalysis(analysis);
  
  return analysis;
}
```

---

### 7.2 Détection des Signaux

```typescript
async function detectSignals(response: string): Promise<string[]> {
  const signals: string[] = [];
  
  // Détection des signaux positifs
  const positiveIndicators = [
    /excellent/i,
    /sans hésitation/i,
    /je le recruterai/i,
    /très bon/i,
    /remarquable/i
  ];
  
  for (const indicator of positiveIndicators) {
    if (indicator.test(response)) {
      signals.push('positive');
      break;
    }
  }
  
  // Détection des signaux de vigilance
  const vigilanceIndicators = [
    /plutôt bien/i,
    /c'était correct/i,
    /je ne sais pas/i,
    /je préfère ne pas/i,
    /ce n'est pas ma place/i
  ];
  
  for (const indicator of vigilanceIndicators) {
    if (indicator.test(response)) {
      signals.push('vigilance');
      break;
    }
  }
  
  // Détection des signaux d'alerte
  const alertIndicators = [
    /je ne peux pas commenter/i,
    /je ne recommande pas/i,
    /problème/i,
    /difficile/i,
    /conflit/i
  ];
  
  for (const indicator of alertIndicators) {
    if (indicator.test(response)) {
      signals.push('alert');
      break;
    }
  }
  
  // Détection de la longueur de la réponse
  if (response.length < 50) {
    signals.push('vigilance'); // Réponse trop courte
  }
  
  return signals;
}
```

---

## 8. Structure de Données (TypeScript)

```typescript
interface ReferenceProtocol {
  protocolId: string;
  candidateId: string;
  generatedAt: Date;
  
  recommendedReferees: RecommendedReferee[];
  avoidedReferees: string[];
  
  fundamentalQuestions: ReferenceQuestion[];
  targetedQuestions: ReferenceQuestion[];
  
  analysisGuide: AnalysisGuide;
}

interface RecommendedReferee {
  type: 'manager' | 'peer' | 'subordinate' | 'client';
  priority: 'mandatory' | 'recommended' | 'optional';
  relationship: string;
  contactPeriod: string;
}

interface ReferenceQuestion {
  questionId: string;
  question: string;
  category: 'fundamental' | 'targeted';
  targetArea?: string;
  expectedSignals: string[];
}

interface AnalysisGuide {
  positiveSignals: Signal[];
  vigilanceSignals: Signal[];
  alertSignals: Signal[];
}

interface Signal {
  type: string;
  description: string;
  examples: string[];
}

interface ReferenceAnalysis {
  analysisId: string;
  protocolId: string;
  candidateId: string;
  analyzedAt: Date;
  
  refereeResponses: RefereeResponse[];
  
  overallAnalysis: {
    positiveSignals: string[];
    vigilanceSignals: string[];
    alertSignals: string[];
    overallAssessment: 'positive' | 'cautious' | 'negative';
  };
}

interface RefereeResponse {
  refereeId: string;
  refereeName: string;
  refereeRelationship: string;
  
  responses: {
    questionId: string;
    answer: string;
    signals: string[];
  }[];
  
  overallSignals: string[];
}

interface ShadowArea {
  type: string;
  description: string;
  expectedSignals: string[];
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE reference_protocol (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  recommended_referees JSON NOT NULL,
  avoided_referees JSON NOT NULL,
  
  fundamental_questions JSON NOT NULL,
  targeted_questions JSON NOT NULL,
  
  analysis_guide JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE INDEX idx_reference_protocol_candidate ON reference_protocol(candidate_id);
CREATE INDEX idx_reference_protocol_date ON reference_protocol(generated_at);

CREATE TABLE reference_analysis (
  id VARCHAR(36) PRIMARY KEY,
  protocol_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  analyzed_at TIMESTAMP NOT NULL,
  
  referee_responses JSON NOT NULL,
  
  overall_analysis JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (protocol_id) REFERENCES reference_protocol(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE INDEX idx_reference_analysis_protocol ON reference_analysis(protocol_id);
CREATE INDEX idx_reference_analysis_candidate ON reference_analysis(candidate_id);
```

---

## 10. API Endpoints

```typescript
// POST /api/reference-intelligence/protocol
async function generateReferenceProtocol(candidateId: string, interviewId: string): Promise<ReferenceProtocol> {
  return await generateReferenceProtocol(candidateId, interviewId);
}

// GET /api/reference-intelligence/protocol/:protocolId
async function getReferenceProtocol(protocolId: string): Promise<ReferenceProtocol> {
  return await getReferenceProtocolById(protocolId);
}

// GET /api/reference-intelligence/protocol/candidate/:candidateId
async function getReferenceProtocolByCandidate(candidateId: string): Promise<ReferenceProtocol> {
  return await getReferenceProtocolByCandidateId(candidateId);
}

// POST /api/reference-intelligence/analyze
async function analyzeReferenceResponses(protocolId: string, responses: RefereeResponse[]): Promise<ReferenceAnalysis> {
  return await analyzeReferenceResponses(protocolId, responses);
}

// GET /api/reference-intelligence/analysis/:analysisId
async function getReferenceAnalysis(analysisId: string): Promise<ReferenceAnalysis> {
  return await getReferenceAnalysisById(analysisId);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Protocoles générés / candidats en finale | ≥ 90% |
| Taux de complétion | Références complétées / protocoles générés | ≥ 80% |
| Taux de détection d'alertes | Alertes détectées / références analysées | ≥ 15% |
| Satisfaction recruteur | Satisfaction avec le protocole | ≥ 4.5/5 |

### 11.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de cohérence élevée | Cohérence élevée / total | ≥ 70% |
| Réduction des mauvais recrutements | Réduction après utilisation | ≥ 25% |
| Amélioration de la qualité des embauches | Performance à 1 an | ≥ 20% |

---

## 12. Conclusion

Le guide de prise de références expert génère pour chaque candidat un protocole de prise de références personnalisé avec choix des référents, questions fondamentales calibrées, questions ciblées sur les zones d'ombre, et guide d'analyse des réponses. Le système identifie les signaux positifs, de vigilance, et d'alerte pour aider le recruteur à prendre une décision éclairée.

**Points clés :**
- 4 types de référents recommandés (manager, pair, subordonné, client)
- Référents à éviter (choisis uniquement par candidat, amis, trop anciens)
- 6 questions fondamentales calibrées
- Questions ciblées générées automatiquement sur les zones d'ombre
- 3 types de signaux (positifs, vigilance, alerte)
- Analyse structurée des réponses
- Intégration avec les modules existants
