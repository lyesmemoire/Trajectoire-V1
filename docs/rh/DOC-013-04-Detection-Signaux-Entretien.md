# DOC-013-04 : Détection Signaux Entretien

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de détection de signaux pour MVP-013 Interview Intelligence. Ce système analyse les réponses du candidat en temps réel pour détecter les signaux positifs et les signaux de vigilance qui distinguent un entretien amateur d'un entretien de grand cabinet.

---

## 2. Principe Fondateur

La détection de signaux est ce qui distingue un entretien amateur d'un entretien de grand cabinet mondial. Le moteur analyse le contenu et la structure des réponses pour détecter les signaux positifs (exemples concrets, responsabilité personnelle, apprentissage) et les signaux de vigilance (flou, incohérence, surjeu, risque, inadéquation culturelle).

---

## 3. Signaux Positifs à Détecter

### 3.1 Dans le Contenu des Réponses

| Signal | Description | Indicateurs |
|--------|-------------|-------------|
| Exemples concrets et chiffrés | Réponse avec exemples précis et chiffres | "J'ai augmenté les ventes de 20%", "Géré une équipe de 5 personnes" |
| Responsabilité personnelle assumée | Usage du "je" plutôt que "on/nous" | "J'ai fait", "J'ai décidé", "J'ai mené" |
| Apprentissage extrait des échecs | Capacité à tirer des leçons des échecs | "J'ai appris que...", "La leçon que j'en tire est..." |
| Vision systémique | Compréhension du contexte global | "Cela s'inscrit dans la stratégie de..." |
| Capacité à se remettre en question | Autocritique constructive | "J'aurais pu faire mieux en...", "Avec le recul..." |
| Cohérence dire-faire | Alignement entre paroles et actions | Actions cohérentes avec les valeurs déclarées |
| Précision description actions | Détail des actions personnelles | "J'ai négocié avec...", "J'ai implémenté..." |

### 3.2 Dans la Structure des Réponses

| Signal | Description | Indicateurs |
|--------|-------------|-------------|
| Réponses structurées spontanément | Organisation logique sans aide | STAR naturel, points clés identifiés |
| Capacité à synthétiser | Résumé concis et pertinent | "En résumé...", "Pour faire court..." |
| Adaptation au niveau | Langage adapté à l'interlocuteur | Explications techniques adaptées |

---

## 4. Signaux de Vigilance à Détecter

### 4.1 Signaux de Flou

| Signal | Description | Indicateurs |
|--------|-------------|-------------|
| Réponses vagues sans exemple | Réponse générale sans précision | "J'ai travaillé sur beaucoup de projets" |
| Usage excessif "on/nous" | Dilution de la responsabilité | "On a fait", "Nous avons décidé" |
| Changement de sujet | Évitement de la question précise | Déraillement quand question précise |
| Incapacité à quantifier | Absence de chiffres ou métriques | "C'était un bon projet", "Ça s'est bien passé" |

### 4.2 Signaux d'Incohérence

| Signal | Description | Indicateurs |
|--------|-------------|-------------|
| Contradiction avec CV | Réponse incompatible avec CV | Dates incohérentes, responsabilités différentes |
| Chronologie incohérente | Séquence temporelle illogique | Événements dans mauvais ordre |
| Description responsabilités | Responsabilités ne correspondent pas au niveau | Responsabilités de senior pour poste junior |

### 4.3 Signaux de Surjeu

| Signal | Description | Indicateurs |
|--------|-------------|-------------|
| Réponses trop parfaites | Réponses répétées et parfaites | Fluidité excessive, absence d'hésitation |
| Absence de nuance | Réponse binaire sans nuance | "Toujours", "Jamais", "Parfaitement" |
| Absence d'autocritique | Refus de reconnaître les faiblesses | "Je n'ai pas de faiblesses", "Je ne fais jamais d'erreurs" |
| Réponses préparées mot pour mot | Répétition exacte d'une réponse apprise | Phrases identiques à chaque fois |

### 4.4 Signaux de Risque

| Signal | Description | Indicateurs |
|--------|-------------|-------------|
| Critique systématique employeurs | Blame game sur anciens employeurs | "Mon boss était...", "L'entreprise était..." |
| Discours victimaire | Position de victime permanente | "On ne m'a pas donné ma chance", "C'était la faute de..." |
| Mobilité excessive sans explication | Changements fréquents sans justification | Plus de 3 postes en 2 ans sans raison claire |
| Ambition déconnectée | Ambition incohérente avec trajectoire | "Je veux être CEO" pour poste junior |
| Attentes salariales incohérentes | Attentes irréalistes vs marché | Demande 50% au-dessus du marché |

### 4.5 Signaux d'Inadéquation Culturelle

| Signal | Description | Indicateurs |
|--------|-------------|-------------|
| Valeurs incompatibles | Valeurs déclarées incompatibles avec culture | Privilégie la compétition vs culture collaborative |
| Style de travail incompatible | Style incompatible avec équipe | Préfère travail solo vs équipe collaborative |
| Attentes autonomie/structure | Attentes incompatibles avec organisation | Demande autonomie totale vs structure hiérarchique |

---

## 5. Structure de Données (TypeScript)

```typescript
interface SignalDetection {
  detectionId: string;
  interviewId: string;
  questionId: string;
  responseId: string;
  detectedAt: Date;
  
  positiveSignals: {
    content: {
      concreteExamples: boolean;
      personalResponsibility: boolean;
      learningFromFailure: boolean;
      systemicVision: boolean;
      selfReflection: boolean;
    };
    structure: {
      structuredResponse: boolean;
    };
    detected: string[];
  };
  
  vigilanceSignals: {
    fuzziness: {
      vagueResponse: boolean;
      excessiveOnNous: boolean;
      topicChange: boolean;
      inabilityToQuantify: boolean;
    };
    inconsistency: {
      cvContradiction: boolean;
      chronologicalInconsistency: boolean;
      responsibilityMismatch: boolean;
    };
    overplay: {
      tooPerfectResponse: boolean;
      lackOfNuance: boolean;
      lackOfSelfCriticism: boolean;
      preparedResponse: boolean;
    };
    risk: {
      systematicEmployerCriticism: boolean;
      victimDiscourse: boolean;
      excessiveMobility: boolean;
      disconnectedAmbition: boolean;
      incoherentSalaryExpectations: boolean;
    };
    culturalMismatch: {
      incompatibleValues: boolean;
      incompatibleWorkStyle: boolean;
      incompatibleExpectations: boolean;
    };
    detected: string[];
  };
  
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  acknowledged: boolean;
}
```

---

## 6. Algorithme de Détection

### 6.1 Détection des Signaux Positifs

```typescript
async function detectPositiveSignals(response: CandidateResponse, cvAnalysis: CVAnalysis): Promise<SignalDetection['positiveSignals']> {
  const positiveSignals: SignalDetection['positiveSignals'] = {
    content: {
      concreteExamples: false,
      personalResponsibility: false,
      learningFromFailure: boolean,
      systemicVision: false,
      selfReflection: false
    },
    structure: {
      structuredResponse: false
    },
    detected: []
  };
  
  const text = response.transcription.toLowerCase();
  
  // Détection exemples concrets et chiffrés
  if (hasNumbers(text) && hasSpecificExamples(text)) {
    positiveSignals.content.concreteExamples = true;
    positiveSignals.detected.push('Exemples concrets et chiffrés');
  }
  
  // Détection responsabilité personnelle
  const jeCount = (text.match(/\bje\b/g) || []).length;
  const onNousCount = (text.match(/\bon\b/g) || []).length + (text.match(/\bnous\b/g) || []).length;
  
  if (jeCount > onNousCount) {
    positiveSignals.content.personalResponsibility = true;
    positiveSignals.detected.push('Responsabilité personnelle assumée');
  }
  
  // Détection apprentissage des échecs
  if (text.includes('appris') || text.includes('leçon') || text.includes('tiré')) {
    positiveSignals.content.learningFromFailure = true;
    positiveSignals.detected.push('Apprentissage extrait des échecs');
  }
  
  // Détection vision systémique
  if (text.includes('stratégie') || text.includes('contexte') || text.includes('global')) {
    positiveSignals.content.systemicVision = true;
    positiveSignals.detected.push('Vision systémique');
  }
  
  // Détection capacité à se remettre en question
  if (text.includes('aurais pu') || text.includes('avec le recul') || text.includes('mieux')) {
    positiveSignals.content.selfReflection = true;
    positiveSignals.detected.push('Capacité à se remettre en question');
  }
  
  // Détection réponse structurée
  if (isStructuredResponse(text)) {
    positiveSignals.structure.structuredResponse = true;
    positiveSignals.detected.push('Réponse structurée spontanément');
  }
  
  return positiveSignals;
}

function hasNumbers(text: string): boolean {
  return /\d+/.test(text);
}

function hasSpecificExamples(text: string): boolean {
  const exampleIndicators = ['par exemple', 'notamment', 'spécifiquement', 'concrètement'];
  return exampleIndicators.some(indicator => text.includes(indicator));
}

function isStructuredResponse(text: string): boolean {
  // Détection STAR implicite
  const hasSituation = text.includes('situation') || text.includes('contexte');
  const hasAction = text.includes('fait') || text.includes('action');
  const hasResult = text.includes('résultat') || text.includes('résultat');
  
  return hasSituation && hasAction && hasResult;
}
```

### 6.2 Détection des Signaux de Vigilance

```typescript
async function detectVigilanceSignals(response: CandidateResponse, cvAnalysis: CVAnalysis): Promise<SignalDetection['vigilanceSignals']> {
  const vigilanceSignals: SignalDetection['vigilanceSignals'] = {
    fuzziness: {
      vagueResponse: false,
      excessiveOnNous: false,
      topicChange: false,
      inabilityToQuantify: false
    },
    inconsistency: {
      cvContradiction: false,
      chronologicalInconsistency: false,
      responsibilityMismatch: false
    },
    overplay: {
      tooPerfectResponse: false,
      lackOfNuance: false,
      lackOfSelfCriticism: false,
      preparedResponse: false
    },
    risk: {
      systematicEmployerCriticism: false,
      victimDiscourse: false,
      excessiveMobility: false,
      disconnectedAmbition: false,
      incoherentSalaryExpectations: false
    },
    culturalMismatch: {
      incompatibleValues: false,
      incompatibleWorkStyle: false,
      incompatibleExpectations: false
    },
    detected: []
  };
  
  const text = response.transcription.toLowerCase();
  
  // Détection flou
  if (isVagueResponse(text)) {
    vigilanceSignals.fuzziness.vagueResponse = true;
    vigilanceSignals.detected.push('Réponse vague sans exemple concret');
  }
  
  const onNousCount = (text.match(/\bon\b/g) || []).length + (text.match(/\bnous\b/g) || []).length;
  const jeCount = (text.match(/\bje\b/g) || []).length;
  
  if (onNousCount > jeCount * 2) {
    vigilanceSignals.fuzziness.excessiveOnNous = true;
    vigilanceSignals.detected.push('Usage excessif du "on/nous" (dilution responsabilité)');
  }
  
  if (!hasNumbers(text) && shouldHaveNumbers(response.questionId)) {
    vigilanceSignals.fuzziness.inabilityToQuantify = true;
    vigilanceSignals.detected.push('Incapacité à quantifier des résultats');
  }
  
  // Détection incohérence
  if (hasCVContradiction(text, cvAnalysis)) {
    vigilanceSignals.inconsistency.cvContradiction = true;
    vigilanceSignals.detected.push('Incohérence avec le CV détectée');
  }
  
  // Détection surjeu
  if (isTooPerfectResponse(text)) {
    vigilanceSignals.overplay.tooPerfectResponse = true;
    vigilanceSignals.detected.push('Réponse trop parfaite et répétée');
  }
  
  if (hasNoNuance(text)) {
    vigilanceSignals.overplay.lackOfNuance = true;
    vigilanceSignals.detected.push('Absence de nuance ou d\'autocritique');
  }
  
  // Détection risque
  if (hasEmployerCriticism(text)) {
    vigilanceSignals.risk.systematicEmployerCriticism = true;
    vigilanceSignals.detected.push('Critique systématique des anciens employeurs');
  }
  
  if (hasVictimDiscourse(text)) {
    vigilanceSignals.risk.victimDiscourse = true;
    vigilanceSignals.detected.push('Discours victimaire sur les situations passées');
  }
  
  return vigilanceSignals;
}

function isVagueResponse(text: string): boolean {
  const vagueIndicators = ['beaucoup', 'plusieurs', 'divers', 'nombreux', 'différents'];
  const specificIndicators = ['par exemple', 'notamment', 'spécifiquement', 'concrètement'];
  
  return vagueIndicators.some(indicator => text.includes(indicator)) && 
         !specificIndicators.some(indicator => text.includes(indicator));
}

function hasCVContradiction(text: string, cvAnalysis: CVAnalysis): boolean {
  // Vérification des dates
  const datesInResponse = extractDates(text);
  for (const date of datesInResponse) {
    if (!cvAnalysis.timeline.includes(date)) {
      return true;
    }
  }
  
  // Vérification des responsabilités
  const responsibilitiesInResponse = extractResponsibilities(text);
  for (const resp of responsibilitiesInResponse) {
    if (!cvAnalysis.responsibilities.includes(resp)) {
      return true;
    }
  }
  
  return false;
}

function isTooPerfectResponse(text: string): boolean {
  // Détection de fluidité excessive (pas d'hésitations)
  const hesitationMarkers = ['euh', 'hum', 'ben', 'alors'];
  const hesitationCount = hesitationMarkers.reduce((count, marker) => 
    count + (text.match(new RegExp(marker, 'g')) || []).length, 0);
  
  // Si réponse longue (> 100 mots) et peu d'hésitations (< 2)
  const wordCount = text.split(/\s+/).length;
  
  return wordCount > 100 && hesitationCount < 2;
}

function hasNoNuance(text: string): boolean {
  const absoluteIndicators = ['toujours', 'jamais', 'parfaitement', 'absolument', 'totalement'];
  return absoluteIndicators.some(indicator => text.includes(indicator));
}

function hasEmployerCriticism(text: string): boolean {
  const criticismIndicators = ['mon boss était', 'mon manager était', 'l\'entreprise était', 'mes collègues étaient'];
  return criticismIndicators.some(indicator => text.includes(indicator));
}

function hasVictimDiscourse(text: string): boolean {
  const victimIndicators = ['on ne m\'a pas donné ma chance', 'c\'était la faute de', 'on m\'a bloqué', 'je n\'ai pas eu les moyens'];
  return victimIndicators.some(indicator => text.includes(indicator));
}
```

---

## 7. Calcul de la Confiance et Sévérité

### 7.1 Calcul de la Confiance

```typescript
function calculateConfidence(positiveSignals: SignalDetection['positiveSignals'], vigilanceSignals: SignalDetection['vigilanceSignals']): number {
  let confidence = 0.5; // Base
  
  // Augmentation pour signaux positifs
  const positiveCount = Object.values(positiveSignals.content).filter(Boolean).length +
                       Object.values(positiveSignals.structure).filter(Boolean).length;
  
  confidence += positiveCount * 0.1;
  
  // Réduction pour signaux de vigilance
  const vigilanceCount = Object.values(vigilanceSignals.fuzziness).filter(Boolean).length +
                        Object.values(vigilanceSignals.inconsistency).filter(Boolean).length +
                        Object.values(vigilanceSignals.overplay).filter(Boolean).length +
                        Object.values(vigilanceSignals.risk).filter(Boolean).length;
  
  confidence -= vigilanceCount * 0.15;
  
  // Limitation entre 0 et 1
  return Math.max(0, Math.min(1, confidence));
}
```

### 7.2 Calcul de la Sévérité

```typescript
function calculateSeverity(vigilanceSignals: SignalDetection['vigilanceSignals']): 'low' | 'medium' | 'high' {
  const riskCount = Object.values(vigilanceSignals.risk).filter(Boolean).length;
  const inconsistencyCount = Object.values(vigilanceSignals.inconsistency).filter(Boolean).length;
  
  if (riskCount >= 2 || inconsistencyCount >= 2) {
    return 'high';
  }
  
  if (riskCount >= 1 || inconsistencyCount >= 1) {
    return 'medium';
  }
  
  return 'low';
}
```

---

## 8. Notification en Temps Réel

### 8.1 Processus de Notification

```typescript
async function notifySignalDetection(detection: SignalDetection): Promise<void> {
  // Notification des signaux positifs
  for (const positiveSignal of detection.positiveSignals.detected) {
    await notifyRecruiter(detection.interviewId, {
      type: 'positive_signal',
      signal: positiveSignal,
      confidence: detection.confidence
    });
  }
  
  // Notification des signaux de vigilance
  for (const vigilanceSignal of detection.vigilanceSignals.detected) {
    await notifyRecruiter(detection.interviewId, {
      type: 'vigilance_signal',
      signal: vigilanceSignal,
      severity: detection.severity,
      confidence: detection.confidence
    });
  }
  
  // Si sévérité haute, alerte prioritaire
  if (detection.severity === 'high') {
    await sendPriorityAlert(detection.interviewId, {
      type: 'high_severity_alert',
      signals: detection.vigilanceSignals.detected,
      questionId: detection.questionId
    });
  }
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE signal_detection (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  response_id VARCHAR(36) NOT NULL,
  detected_at TIMESTAMP NOT NULL,
  
  positive_signals JSON NOT NULL,
  vigilance_signals JSON NOT NULL,
  
  confidence DECIMAL(3,2) NOT NULL,
  severity VARCHAR(10) NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (question_id) REFERENCES expert_questions(id),
  FOREIGN KEY (response_id) REFERENCES candidate_responses(id)
);

CREATE INDEX idx_signal_interview ON signal_detection(interview_id);
CREATE INDEX idx_signal_severity ON signal_detection(severity);
CREATE INDEX idx_signal_detected_at ON signal_detection(detected_at);
```

---

## 10. API Endpoints

```typescript
// POST /api/signal-detection
async function detectSignals(interviewId: string, questionId: string, response: string): Promise<SignalDetection> {
  return await analyzeResponseForSignals(interviewId, questionId, response);
}

// GET /api/signal-detection/:interviewId
async function getSignalDetections(interviewId: string): Promise<SignalDetection[]> {
  return await getDetectionsByInterview(interviewId);
}

// GET /api/signal-detection/:interviewId/summary
async function getSignalSummary(interviewId: string): Promise<SignalSummary> {
  return await summarizeSignals(interviewId);
}

// POST /api/signal-detection/:id/acknowledge
async function acknowledgeSignal(id: string): Promise<void> {
  return await markAsAcknowledged(id);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection positifs | Signaux positifs détectés / réels | ≥ 75% |
| Taux de détection vigilance | Signaux vigilance détectés / réels | ≥ 80% |
| Faux positifs | Faux positifs / total détections | ≤ 10% |
| Faux négatifs | Faux négatifs / total détections | ≤ 15% |

### 11.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'adoption | Alertes utilisées / total | ≥ 70% |
| Impact sur décision | Décisions influencées par alertes / total | ≥ 60% |
| Satisfaction recruteur | Satisfaction avec le système | ≥ 4/5 |

---

## 12. Conclusion

Le système de détection de signaux analyse les réponses du candidat en temps réel pour détecter les signaux positifs et les signaux de vigilance. C'est ce qui distingue un entretien amateur d'un entretien de grand cabinet mondial.

**Points clés :**
- Signaux positifs : contenu (exemples concrets, responsabilité personnelle, apprentissage, vision systémique, autocritique) et structure (réponse structurée)
- Signaux de vigilance : flou (réponse vague, "on/nous", changement sujet, incapacité à quantifier)
- Signaux de vigilance : incohérence (contradiction CV, chronologie, responsabilités)
- Signaux de vigilance : surjeu (réponse trop parfaite, absence nuance, absence autocritique, réponse préparée)
- Signaux de vigilance : risque (critique employeurs, discours victimaire, mobilité excessive, ambition déconnectée, attentes salariales)
- Signaux de vigilance : inadéquation culturelle (valeurs, style travail, attentes)
- Calcul de confiance et sévérité
- Notification en temps réel au recruteur
