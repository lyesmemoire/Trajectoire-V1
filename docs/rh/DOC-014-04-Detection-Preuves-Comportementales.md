# DOC-014-04 : Détection Preuves Comportementales

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de détection de preuves comportementales pour MVP-014 Soft Skills Intelligence. Ce système analyse les réponses du candidat pour extraire des preuves concrètes qui étayent la cotation des soft skills.

---

## 2. Principe Fondateur

La détection de preuves comportementales analyse le contenu et la structure des réponses pour identifier des exemples concrets, des résultats chiffrés, des patterns récurrents, et d'autres types de preuves qui peuvent étayer la cotation des soft skills.

---

## 3. Types de Preuves Détectées

### 3.1 Exemple Concret

**Description :** Description d'une situation spécifique avec contexte, action, et résultat.

**Indicateurs :**
- Utilisation de "J'ai" plutôt que "On/nous"
- Présence de contexte temporel ("En 2023", "Lors de mon projet X")
- Description d'action spécifique
- Mention d'un résultat

**Exemple :**
- "En 2023, j'ai géré une équipe de 5 personnes sur un projet de refonte du site web"

**Pattern de détection :**
```typescript
function detectConcreteExample(text: string): boolean {
  const hasPersonalPronoun = /\b(j'|je)\b/i.test(text);
  const hasTemporalContext = /\b(en |lors de |pendant |en \d{4})\b/i.test(text);
  const hasAction = /\b(géré|dirigé|mené|créé|développé|implémenté)\b/i.test(text);
  
  return hasPersonalPronoun && hasTemporalContext && hasAction;
}
```

---

### 3.2 Résultat Chiffré

**Description :** Mesure quantitative du résultat ou de l'impact.

**Indicateurs :**
- Présence de chiffres ou pourcentages
- Mots indicateurs de quantification ("augmenté de", "réduit de", "+20%")
- Unités de mesure (€, $, %, jours, personnes)

**Exemple :**
- "J'ai augmenté les ventes de 20%"
- "J'ai réduit les coûts de 50 000€"
- "J'ai géré une équipe de 10 personnes"

**Pattern de détection :**
```typescript
function detectQuantifiedResult(text: string): boolean {
  const hasNumber = /\d+/.test(text);
  const hasPercentage = /\d+%/.test(text);
  const hasCurrency = /[\$€£]\s*\d+/.test(text);
  const hasQuantifier = /\b(augmenté|réduit|amélioré|diminué)\s+(de|à)\s+\d+/i.test(text);
  
  return hasNumber || hasPercentage || hasCurrency || hasQuantifier;
}
```

---

### 3.3 Pattern Récurrent

**Description :** Répétition d'un comportement positif dans plusieurs situations.

**Indicateurs :**
- Utilisation de "Dans mes différents postes", "À plusieurs reprises"
- Mention de multiples exemples similaires
- Expression de régularité ("systématiquement", "chaque fois")

**Exemple :**
- "Dans mes 3 derniers postes, j'ai systématiquement..."
- "À plusieurs reprises, j'ai dû gérer des situations de crise"

**Pattern de détection :**
```typescript
function detectRecurringPattern(text: string): boolean {
  const hasMultipleMentions = /\b(dans mes|à plusieurs|chaque fois|systématiquement)\b/i.test(text);
  const hasEnumeration = /\b(premièrement|deuxièmement|troisièmement)\b/i.test(text);
  
  return hasMultipleMentions || hasEnumeration;
}
```

---

### 3.4 Reconnaissance

**Description :** Prix, certification, promotion, ou reconnaissance formelle.

**Indicateurs :**
- Mots indicateurs de reconnaissance ("promu", "prix", "récompense", "certifié")
- Mention de tiers ("mon manager", "l'entreprise", "les clients")
- Expression de reconnaissance ("a été reconnu", "a reçu")

**Exemple :**
- "J'ai été promu pour mon leadership"
- "J'ai reçu le prix de l'employé de l'année"
- "Mes clients m'ont donné un feedback positif"

**Pattern de détection :**
```typescript
function detectRecognition(text: string): boolean {
  const hasPromotion = /\b(promu|promotion)\b/i.test(text);
  const hasAward = /\b(prix|récompense|award|certifié)\b/i.test(text);
  const hasThirdParty = /\b(mon manager|l'entreprise|les clients|mes collègues)\b/i.test(text);
  
  return hasPromotion || hasAward || hasThirdParty;
}
```

---

### 3.5 Témoignage

**Description :** Citation d'un tiers (collègue, manager, client).

**Indicateurs :**
- Citation directe avec guillemets
- Attribution à un tiers ("Mon manager a dit que...")
- Mention de feedback reçu

**Exemple :**
- "Mon manager a dit : 'Tu es un excellent leader'"
- "Mes collègues m'ont dit que j'étais très collaboratif"

**Pattern de détection :**
```typescript
function detectTestimony(text: string): boolean {
  const hasQuote = /["'].*["']/.test(text);
  const hasAttribution = /\b(mon manager|mes collègues|mes clients|mon équipe)\s+(a dit|a déclaré|m'a dit)\b/i.test(text);
  const hasFeedback = /\b(feedback|retour|avis)\b/i.test(text);
  
  return hasQuote || hasAttribution || hasFeedback;
}
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface BehavioralEvidence {
  evidenceId: string;
  interviewId: string;
  questionId: string;
  skillId: string;
  detectedAt: Date;
  
  type: 'concrete_example' | 'quantified_result' | 'recurring_pattern' | 'recognition' | 'testimony';
  
  text: string;
  context: string;
  
  confidence: number;
  
  validation: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Date;
    comments?: string;
  };
}

interface EvidenceDetectionEngine {
  engineId: string;
  version: string;
  
  detect(response: CandidateResponse, skillId: string): Promise<BehavioralEvidence[]>;
  
  validate(evidenceId: string, validation: BehavioralEvidence['validation']): Promise<void>;
  
  extractEvidence(text: string, skillId: string): BehavioralEvidence[];
}
```

---

## 5. Algorithme de Détection

### 5.1 Processus de Détection

```typescript
async function detectBehavioralEvidence(
  response: CandidateResponse,
  skillId: string
): Promise<BehavioralEvidence[]> {
  const evidence: BehavioralEvidence[] = [];
  const text = response.transcription;
  
  // Détection d'exemple concret
  if (detectConcreteExample(text)) {
    evidence.push({
      evidenceId: generateEvidenceId(),
      interviewId: response.interviewId,
      questionId: response.questionId,
      skillId,
      detectedAt: new Date(),
      type: 'concrete_example',
      text: extractConcreteExample(text),
      context: response.question.question,
      confidence: calculateConfidence(text, 'concrete_example'),
      validation: { validated: false }
    });
  }
  
  // Détection de résultat chiffré
  if (detectQuantifiedResult(text)) {
    evidence.push({
      evidenceId: generateEvidenceId(),
      interviewId: response.interviewId,
      questionId: response.questionId,
      skillId,
      detectedAt: new Date(),
      type: 'quantified_result',
      text: extractQuantifiedResult(text),
      context: response.question.question,
      confidence: calculateConfidence(text, 'quantified_result'),
      validation: { validated: false }
    });
  }
  
  // Détection de pattern récurrent
  if (detectRecurringPattern(text)) {
    evidence.push({
      evidenceId: generateEvidenceId(),
      interviewId: response.interviewId,
      questionId: response.questionId,
      skillId,
      detectedAt: new Date(),
      type: 'recurring_pattern',
      text: extractRecurringPattern(text),
      context: response.question.question,
      confidence: calculateConfidence(text, 'recurring_pattern'),
      validation: { validated: false }
    });
  }
  
  // Détection de reconnaissance
  if (detectRecognition(text)) {
    evidence.push({
      evidenceId: generateEvidenceId(),
      interviewId: response.interviewId,
      questionId: response.questionId,
      skillId,
      detectedAt: new Date(),
      type: 'recognition',
      text: extractRecognition(text),
      context: response.question.question,
      confidence: calculateConfidence(text, 'recognition'),
      validation: { validated: false }
    });
  }
  
  // Détection de témoignage
  if (detectTestimony(text)) {
    evidence.push({
      evidenceId: generateEvidenceId(),
      interviewId: response.interviewId,
      questionId: response.questionId,
      skillId,
      detectedAt: new Date(),
      type: 'testimony',
      text: extractTestimony(text),
      context: response.question.question,
      confidence: calculateConfidence(text, 'testimony'),
      validation: { validated: false }
    });
  }
  
  return evidence;
}
```

### 5.2 Extraction de Preuves

```typescript
function extractConcreteExample(text: string): string {
  // Extraction de la phrase contenant l'exemple concret
  const sentences = text.split('. ');
  for (const sentence of sentences) {
    if (detectConcreteExample(sentence)) {
      return sentence.trim();
    }
  }
  return text.substring(0, 200);
}

function extractQuantifiedResult(text: string): string {
  // Extraction de la phrase contenant le résultat chiffré
  const sentences = text.split('. ');
  for (const sentence of sentences) {
    if (detectQuantifiedResult(sentence)) {
      return sentence.trim();
    }
  }
  return text.substring(0, 200);
}

function extractRecurringPattern(text: string): string {
  // Extraction de la phrase contenant le pattern récurrent
  const sentences = text.split('. ');
  for (const sentence of sentences) {
    if (detectRecurringPattern(sentence)) {
      return sentence.trim();
    }
  }
  return text.substring(0, 200);
}

function extractRecognition(text: string): string {
  // Extraction de la phrase contenant la reconnaissance
  const sentences = text.split('. ');
  for (const sentence of sentences) {
    if (detectRecognition(sentence)) {
      return sentence.trim();
    }
  }
  return text.substring(0, 200);
}

function extractTestimony(text: string): string {
  // Extraction de la phrase contenant le témoignage
  const sentences = text.split('. ');
  for (const sentence of sentences) {
    if (detectTestimony(sentence)) {
      return sentence.trim();
    }
  }
  return text.substring(0, 200);
}
```

### 5.3 Calcul de la Confiance

```typescript
function calculateConfidence(text: string, evidenceType: string): number {
  let confidence = 0.5;
  
  // Confiance basée sur la spécificité
  if (isSpecific(text)) {
    confidence += 0.2;
  }
  
  // Confiance basée sur la longueur
  if (text.length > 100) {
    confidence += 0.1;
  }
  
  // Confiance basée sur le type de preuve
  if (evidenceType === 'quantified_result') {
    confidence += 0.2;
  }
  
  if (evidenceType === 'recurring_pattern') {
    confidence += 0.15;
  }
  
  // Normalisation
  return Math.min(1, confidence);
}

function isSpecific(text: string): boolean {
  const specificIndicators = [
    'spécifiquement',
    'concrètement',
    'précisément',
    'notamment',
    'en particulier'
  ];
  
  return specificIndicators.some(indicator => text.toLowerCase().includes(indicator));
}
```

---

## 6. Détection par Soft Skill

### 6.1 Leadership & Influence

**Preuves spécifiques :**
- Exemple de gestion de résistance
- Résultat chiffré d'adhésion d'équipe
- Pattern récurrent de leadership
- Reconnaissance par l'équipe

**Indicateurs spécifiques :**
- "Mon équipe a suivi", "J'ai convaincu"
- "Adhésion de 100%", "10 personnes ont rejoint"
- "Dans mes différents postes de management"
- "Mon équipe m'a dit que..."

---

### 6.2 Intelligence Émotionnelle

**Preuves spécifiques :**
- Exemple de gestion d'émotion
- Description précise d'émotion
- Pattern récurrent de gestion émotionnelle
- Témoignage sur l'empathie

**Indicateurs spécifiques :**
- "J'étais frustré", "J'ai ressenti"
- "J'ai géré ma colère", "Je suis resté calme"
- "Systématiquement, je prends du recul"
- "Mes collègues disent que je suis empathique"

---

### 6.3 Adaptabilité & Résilience

**Preuves spécifiques :**
- Exemple de rebond après échec
- Résultat chiffré de redressement
- Pattern récurrent d'adaptation
- Reconnaissance de résilience

**Indicateurs spécifiques :**
- "J'ai rebondi", "J'ai appris de mon échec"
- "J'ai récupéré 80% du chiffre d'affaires"
- "À chaque changement, je m'adapte"
- "J'ai été reconnu pour ma résilience"

---

### 6.4 Pensée Critique & Résolution de Problèmes

**Preuves spécifiques :**
- Exemple de résolution créative
- Résultat chiffré d'amélioration
- Pattern récurrent de résolution
- Reconnaissance de l'innovation

**Indicateurs spécifiques :**
- "J'ai résolu", "J'ai innové"
- "Réduction de 50% du temps", "Économie de 30%"
- "Systématiquement, j'analyse les causes"
- "J'ai reçu un prix pour mon innovation"

---

### 6.5 Communication & Impact

**Preuves spécifiques :**
- Exemple de conviction
- Résultat chiffré d'impact
- Pattern récurrent de communication efficace
- Témoignage sur la communication

**Indicateurs spécifiques :**
- "J'ai convaincu", "J'ai persuadé"
- "10 personnes ont adopté mon idée"
- "Mes présentations sont toujours claires"
- "Mon manager dit que je communique bien"

---

### 6.6 Orientation Résultats

**Preuves spécifiques :**
- Exemple de dépassement d'objectifs
- Résultat chiffré de performance exceptionnelle
- Pattern récurrent de dépassement
- Reconnaissance de performance

**Indicateurs spécifiques :**
- "J'ai dépassé mes objectifs", "J'ai atteint 120%"
- "Augmentation de 25% des ventes"
- "Systématiquement, je dépasse mes objectifs"
- "J'ai été promu pour ma performance"

---

### 6.7 Travail en Équipe & Collaboration

**Preuves spécifiques :**
- Exemple de collaboration réussie
- Résultat chiffré de travail d'équipe
- Pattern récurrent de collaboration
- Témoignage sur la collaboration

**Indicateurs spécifiques :**
- "L'équipe a réussi", "Nous avons collaboré"
- "L'équipe a atteint 150% de l'objectif"
- "Dans tous mes projets d'équipe"
- "Mes collègues apprécient ma collaboration"

---

### 6.8 Apprentissage Continu

**Preuves spécifiques :**
- Exemple d'autoformation
- Résultat chiffré d'application
- Pattern récurrent d'apprentissage
- Reconnaissance de curiosité

**Indicateurs spécifiques :**
- "J'ai appris", "J'ai étudié"
- "J'ai appliqué et amélioré de 20%"
- "Chaque année, j'apprends de nouvelles compétences"
- "J'ai été certifié pour mes compétences"

---

### 6.9 Intégrité & Éthique

**Preuves spécifiques :**
- Exemple de choix éthique
- Résultat chiffré d'intégrité
- Pattern récurrent d'intégrité
- Témoignage sur l'éthique

**Indicateurs spécifiques :**
- "J'ai fait le bon choix", "J'ai refusé"
- "J'ai maintenu la confiance des clients"
- "Systématiquement, je suis intègre"
- "Mon manager dit que je suis digne de confiance"

---

### 6.10 Gestion du Stress & Pression

**Preuves spécifiques :**
- Exemple de gestion sous pression
- Résultat chiffré de performance sous pression
- Pattern récurrent de gestion du stress
- Reconnaissance de calme sous pression

**Indicateurs spécifiques :**
- "J'ai géré la pression", "Je suis resté calme"
- "Performance maintenue à 100% sous pression"
- "Dans chaque crise, je reste calme"
- "Mon équipe dit que je suis calme sous pression"

---

### 6.11 Vision Stratégique

**Preuves spécifiques :**
- Exemple de vision réalisée
- Résultat chiffré de stratégie
- Pattern récurrent de vision
- Reconnaissance de vision

**Indicateurs spécifiques :**
- "J'ai anticipé", "J'ai planifié"
- "Croissance de 50% sur 3 ans"
- "Dans chaque poste, j'ai une vision claire"
- "Mon entreprise reconnaît ma vision stratégique"

---

### 6.12 Culture Fit

**Preuves spécifiques :**
- Exemple d'alignement culturel
- Résultat chiffré d'intégration
- Pattern récurrent d'adaptation culturelle
- Témoignage sur l'alignement

**Indicateurs spécifiques :**
- "Je m'intègre bien", "Je partage les valeurs"
- "Satisfaction de 90% dans l'équipe"
- "Dans chaque entreprise, je m'adapte"
- "Mes managers disent que je m'intègre bien"

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE behavioral_evidence (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  skill_id VARCHAR(36) NOT NULL,
  detected_at TIMESTAMP NOT NULL,
  
  type VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  context TEXT NOT NULL,
  
  confidence DECIMAL(3,2) NOT NULL,
  
  validated BOOLEAN DEFAULT FALSE,
  validated_by VARCHAR(36),
  validated_at TIMESTAMP,
  validation_comments TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (question_id) REFERENCES expert_questions(id),
  FOREIGN KEY (skill_id) REFERENCES soft_skills(id)
);

CREATE INDEX idx_evidence_interview ON behavioral_evidence(interview_id);
CREATE INDEX idx_evidence_skill ON behavioral_evidence(skill_id);
CREATE INDEX idx_evidence_type ON behavioral_evidence(type);
CREATE INDEX idx_evidence_confidence ON behavioral_evidence(confidence);
```

---

## 8. API Endpoints

```typescript
// POST /api/behavioral-evidence/detect
async function detectEvidence(interviewId: string, questionId: string, response: string, skillId: string): Promise<BehavioralEvidence[]> {
  return await detectBehavioralEvidence({ interviewId, questionId, transcription: response, question: { questionId, question: '' } }, skillId);
}

// GET /api/behavioral-evidence/:id
async function getEvidence(id: string): Promise<BehavioralEvidence> {
  return await getEvidenceById(id);
}

// GET /api/behavioral-evidence/interview/:interviewId
async function getEvidenceByInterview(interviewId: string): Promise<BehavioralEvidence[]> {
  return await getInterviewEvidence(interviewId);
}

// GET /api/behavioral-evidence/skill/:skillId
async function getEvidenceBySkill(skillId: string): Promise<BehavioralEvidence[]> {
  return await getSkillEvidence(skillId);
}

// POST /api/behavioral-evidence/:id/validate
async function validateEvidence(id: string, validation: BehavioralEvidence['validation']): Promise<void> {
  return await validateBehavioralEvidence(id, validation);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Preuves détectées / réponses | ≥ 80% |
| Précision de détection | Preuves validées / détectées | ≥ 85% |
| Confiance moyenne | Confiance moyenne des détections | ≥ 0.75 |
| Taux de faux positifs | Faux positifs / total détections | ≤ 15% |

### 9.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Preuves validées / détectées | ≥ 90% |
| Taux d'utilisation | Preuves utilisées pour cotation / total | ≥ 80% |
| Satisfaction recruteur | Satisfaction avec les preuves détectées | ≥ 4/5 |

---

## 10. Conclusion

Le système de détection de preuves comportementales analyse les réponses du candidat pour extraire des preuves concrètes qui étayent la cotation des soft skills. Il détecte 5 types de preuves : exemple concret, résultat chiffré, pattern récurrent, reconnaissance, et témoignage.

**Points clés :**
- 5 types de preuves détectées (exemple concret, résultat chiffré, pattern récurrent, reconnaissance, témoignage)
- Algorithmes de détection spécifiques pour chaque type
- Calcul de confiance pour chaque preuve
- Détection spécifique par soft skill avec indicateurs personnalisés
- Validation des preuves par le recruteur
- Stockage pour traçabilité
