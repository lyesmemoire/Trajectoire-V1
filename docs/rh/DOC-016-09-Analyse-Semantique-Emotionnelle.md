# DOC-016-09 : Analyse Sémantique Émotionnelle

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'analyse sémantique émotionnelle pour MVP-016 Interview Simulator. Ce module analyse le texte des réponses du candidat pour détecter les patterns de langage, la structure émotionnelle du discours, et produire un profil émotionnel synthétique.

---

## 2. Principe Fondateur

Un grand DRH de cabinet mondial ne lit pas seulement les mots d'un candidat. Il lit le choix des mots, la structure émotionnelle du discours, les patterns de langage révélateurs, les métaphores utilisées inconsciemment, ce qui est dit vs ce qui est esquivé, et l'énergie derrière les réponses. Ce module construit cette intelligence.

---

## 3. Capacité 1 — Analyse Sémantique Émotionnelle

### 3.1 Processus d'Analyse

Le moteur analyse le texte des réponses (transcrit ou saisi par le recruteur) sur 5 dimensions émotionnelles :

```
┌─────────────────────────────────────────────────────────────┐
│ PROCESSUS D'ANALYSE SÉMANTIQUE ÉMOTIONNELLE                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Collecte des réponses                                   │
│    → Transcription automatique (audio)                     │
│    → Saisie manuelle (recruteur)                           │
│                                                             │
│ 2. Analyse sur 5 dimensions                               │
│    → Registre émotionnel dominant                          │
│    → Locus de contrôle                                     │
│    → Pattern de motivation                                 │
│    → Niveau d'authenticité                                 │
│    → Alignement valeurs/discours                           │
│                                                             │
│ 3. Détection des patterns de langage                       │
│    → Patterns positifs à valoriser                         │
│    → Patterns de vigilance à détecter                     │
│                                                             │
│ 4. Production du profil émotionnel                         │
│    → Synthèse des 5 dimensions                            │
│    → Liste des patterns détectés                           │
│    → Identification des risques émotionnels               │
│                                                             │
│ 5. Avertissement obligatoire                               │
│    → Aide à la réflexion                                   │
│    → Ne remplace pas le jugement humain                    │
│    → Soumis aux règles anti-biais (RH-860)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Dimension 1 — Registre Émotionnel Dominant

**Échelle :** Positif / Négatif / Neutre / Ambivalent

**Détection des champs lexicaux :**

**Enthousiasme réel vs enthousiasme forcé :**
- Réel : mots spontanés, énergie naturelle, exemples concrets
- Forcé : répétition excessive, absence de nuance, discours stéréotypé

**Anxiété masquée vs confiance authentique :**
- Anxiété masquée : hésitations, réponses courtes, manque de détails
- Confiance authentique : réponses structurées, exemples précis, ton stable

**Amertume résiduelle envers anciens employeurs :**
- Signaux : mots négatifs, critique systématique, posture victimaire
- Vigilance : pattern récurrent sur tous les anciens postes

**Excitation sincère pour le poste :**
- Signaux : questions pertinentes, connaissance du poste, énergie positive

**Algorithme de détection :**
```typescript
async function analyzeEmotionalRegister(response: string): Promise<EmotionalRegister> {
  const register: EmotionalRegister = {
    dominant: 'neutral',
    confidence: 0,
    detectedFields: []
  };
  
  const positiveWords = ['enthousiasme', 'passion', 'excité', 'ravi', 'motivé', 'enthousiaste'];
  const negativeWords = ['frustré', 'déçu', 'agacé', 'énervé', 'fatigué', 'épuisé'];
  const anxietyWords = ['euh', 'ben', 'enfin', 'je ne sais pas', 'c\'est compliqué'];
  
  const positiveCount = countMatches(response, positiveWords);
  const negativeCount = countMatches(response, negativeWords);
  const anxietyCount = countMatches(response, anxietyWords);
  
  if (positiveCount > negativeCount * 2) {
    register.dominant = 'positive';
    register.confidence = Math.min(1, positiveCount / 5);
  } else if (negativeCount > positiveCount * 2) {
    register.dominant = 'negative';
    register.confidence = Math.min(1, negativeCount / 5);
  } else if (Math.abs(positiveCount - negativeCount) <= 1) {
    register.dominant = 'neutral';
    register.confidence = 0.5;
  } else {
    register.dominant = 'ambivalent';
    register.confidence = 0.5;
  }
  
  // Détection des champs lexicaux
  if (anxietyCount >= 2) {
    register.detectedFields.push('anxiété_masquée');
  }
  
  return register;
}
```

---

### 3.3 Dimension 2 — Locus de Contrôle

**Échelle :** Interne / Mixte / Externe

**Locus interne :**
- "J'ai décidé / J'ai fait / J'ai obtenu"
- Assume ses résultats
- Assume ses échecs
- Prend des initiatives
- Signal positif pour postes de leadership

**Locus externe :**
- "On m'a dit / Les circonstances / C'est à cause de..."
- Risque de posture victimaire
- Difficulté à assumer la responsabilité
- Signal de vigilance pour postes de leadership

**Algorithme de détection :**
```typescript
async function analyzeLocusOfControl(response: string): Promise<LocusOfControl> {
  const locus: LocusOfControl = {
    type: 'mixed',
    internalScore: 0,
    externalScore: 0,
    confidence: 0
  };
  
  const internalIndicators = [
    'j\'ai décidé', 'j\'ai fait', 'j\'ai obtenu', 'j\'ai choisi',
    'j\'ai pris l\'initiative', 'j\'ai géré', 'j\'ai créé'
  ];
  
  const externalIndicators = [
    'on m\'a dit', 'les circonstances', 'c\'est à cause de',
    'on m\'a demandé', 'il fallait', 'on a décidé'
  ];
  
  const internalCount = countMatches(response, internalIndicators);
  const externalCount = countMatches(response, externalIndicators);
  
  locus.internalScore = internalCount;
  locus.externalScore = externalCount;
  
  const total = internalCount + externalCount;
  if (total === 0) {
    locus.type = 'mixed';
    locus.confidence = 0;
  } else if (internalCount > externalCount * 2) {
    locus.type = 'internal';
    locus.confidence = Math.min(1, internalCount / total);
  } else if (externalCount > internalCount * 2) {
    locus.type = 'external';
    locus.confidence = Math.min(1, externalCount / total);
  } else {
    locus.type = 'mixed';
    locus.confidence = 0.5;
  }
  
  return locus;
}
```

---

### 3.4 Dimension 3 — Pattern de Motivation

**Échelle :** Approche / Évitement / Mixte

**Motivation par l'approche :**
- "Je veux atteindre / construire / créer"
- Profil orienté vision et résultats
- Signal positif

**Motivation par l'évitement :**
- "Je veux quitter / fuir / éviter"
- Signal à explorer : que fuit-il vraiment ?
- Vigilance

**Motivation intrinsèque :**
- Passion pour le métier détectable dans le choix des exemples et l'énergie
- Signal positif fort

**Motivation extrinsèque dominante :**
- Salaire et statut comme seuls moteurs cités
- Risque de départ rapide si mieux ailleurs
- Vigilance

**Algorithme de détection :**
```typescript
async function analyzeMotivationPattern(responses: string[]): Promise<MotivationPattern> {
  const pattern: MotivationPattern = {
    type: 'mixed',
    approachScore: 0,
    avoidanceScore: 0,
    intrinsicScore: 0,
    extrinsicScore: 0,
    confidence: 0
  };
  
  const approachIndicators = [
    'atteindre', 'construire', 'créer', 'développer', 'réaliser',
    'accomplir', 'innover', 'progresser'
  ];
  
  const avoidanceIndicators = [
    'quitter', 'fuir', 'éviter', 'échapper', 'sortir de',
    'ne plus', 'en avoir assez'
  ];
  
  const intrinsicIndicators = [
    'passion', 'amour', 'intérêt', 'curiosité', 'plaisir',
    'enthousiasme', 'motivation', 'engagement'
  ];
  
  const extrinsicIndicators = [
    'salaire', 'rémunération', 'revenu', 'statut', 'titre',
    'avantages', 'prime', 'bonus'
  ];
  
  for (const response of responses) {
    pattern.approachScore += countMatches(response, approachIndicators);
    pattern.avoidanceScore += countMatches(response, avoidanceIndicators);
    pattern.intrinsicScore += countMatches(response, intrinsicIndicators);
    pattern.extrinsicScore += countMatches(response, extrinsicIndicators);
  }
  
  const total = pattern.approachScore + pattern.avoidanceScore;
  if (total === 0) {
    pattern.type = 'mixed';
  } else if (pattern.approachScore > pattern.avoidanceScore * 2) {
    pattern.type = 'approach';
    pattern.confidence = Math.min(1, pattern.approachScore / total);
  } else if (pattern.avoidanceScore > pattern.approachScore * 2) {
    pattern.type = 'avoidance';
    pattern.confidence = Math.min(1, pattern.avoidanceScore / total);
  } else {
    pattern.type = 'mixed';
    pattern.confidence = 0.5;
  }
  
  return pattern;
}
```

---

### 3.5 Dimension 4 — Niveau d'Authenticité

**Échelle :** Faible / Normale / Élevée

**Discours authentique :**
- Nuances présentes
- Imperfections assumées
- Hésitations naturelles sur les vraies questions
- Signal positif

**Discours sur-préparé :**
- Fluidité excessive sur toutes les questions
- Absence totale de nuance ou d'autocritique
- Réponses qui sonnent comme des scripts
- Formules de coaching détectables
- Vigilance

**Algorithme de détection :**
```typescript
async function analyzeAuthenticity(responses: string[]): Promise<Authenticity> {
  const authenticity: Authenticity = {
    level: 'normal',
    confidence: 0,
    detectedSignals: []
  };
  
  let totalLength = 0;
  let hesitationCount = 0;
  let nuanceCount = 0;
  let coachingFormulaCount = 0;
  
  const hesitationIndicators = ['euh', 'ben', 'enfin', 'en gros', 'en fait'];
  const nuanceIndicators = ['plutôt', 'un peu', 'relativement', 'dans une certaine mesure'];
  const coachingFormulas = [
    'je suis très orienté', 'j\'aime relever des défis',
    'je m\'adapte à toutes les situations', 'je trouve toujours des solutions'
  ];
  
  for (const response of responses) {
    totalLength += response.length;
    hesitationCount += countMatches(response, hesitationIndicators);
    nuanceCount += countMatches(response, nuanceIndicators);
    coachingFormulaCount += countMatches(response, coachingFormulas);
  }
  
  const averageLength = totalLength / responses.length;
  
  // Trop de fluidité = suspect
  if (hesitationCount === 0 && averageLength > 100) {
    authenticity.level = 'low';
    authenticity.detectedSignals.push('fluidité_excessive');
  }
  
  // Formules de coaching détectées
  if (coachingFormulaCount >= 2) {
    authenticity.level = 'low';
    authenticity.detectedSignals.push('formules_coaching');
  }
  
  // Nuances présentes = authentique
  if (nuanceCount >= 2) {
    authenticity.level = 'high';
    authenticity.detectedSignals.push('nuances_présentes');
  }
  
  // Hésitations naturelles = authentique
  if (hesitationCount >= 1 && hesitationCount <= 3) {
    authenticity.level = 'high';
    authenticity.detectedSignals.push('hésitations_naturelles');
  }
  
  return authenticity;
}
```

---

### 3.6 Dimension 5 — Alignement Valeurs / Discours

**Échelle :** Faible / Partiel / Fort

**Méthode :**
- Le candidat dit valoriser X
- Ses exemples concrets démontrent-ils X ?
- Incohérence détectée → signal de vigilance
- Cohérence confirmée → signal positif fort

**Algorithme de détection :**
```typescript
async function analyzeValueAlignment(responses: string[], declaredValues: string[]): Promise<ValueAlignment> {
  const alignment: ValueAlignment = {
    level: 'partial',
    confidence: 0,
    inconsistencies: [],
    consistencies: []
  };
  
  for (const value of declaredValues) {
    const valueResponses = responses.filter(r => 
      r.toLowerCase().includes(value.toLowerCase())
    );
    
    if (valueResponses.length === 0) {
      // Candidat déclare la valeur mais ne la démontre pas
      alignment.inconsistencies.push({
        value,
        reason: 'Valeur déclarée mais non démontrée par des exemples'
      });
    } else {
      // Vérification de la cohérence des exemples
      const isConsistent = await verifyValueConsistency(value, valueResponses);
      
      if (isConsistent) {
        alignment.consistencies.push({
          value,
          evidence: valueResponses.length
        });
      } else {
        alignment.inconsistencies.push({
          value,
          reason: 'Exemples incohérents avec la valeur déclarée'
        });
      }
    }
  }
  
  const total = alignment.inconsistencies.length + alignment.consistencies.length;
  if (total === 0) {
    alignment.level = 'partial';
  } else if (alignment.consistencies.length > alignment.inconsistencies.length * 2) {
    alignment.level = 'strong';
    alignment.confidence = alignment.consistencies.length / total;
  } else if (alignment.inconsistencies.length > alignment.consistencies.length * 2) {
    alignment.level = 'weak';
    alignment.confidence = alignment.inconsistencies.length / total;
  } else {
    alignment.level = 'partial';
    alignment.confidence = 0.5;
  }
  
  return alignment;
}
```

---

## 4. Capacité 2 — Détection des Patterns de Langage

### 4.1 Patterns Positifs à Valoriser

**Le "Je" de responsabilité :**
- "J'ai décidé de..."
- "J'ai choisi de..."
- "J'ai pris l'initiative de..."
- → Autonomie et responsabilité confirmées

**Le chiffre spontané :**
- Candidat qui quantifie sans qu'on lui demande
- "J'ai réduit les délais de 30%"
- "J'ai managé une équipe de 12 personnes"
- → Orientation résultats authentique

**L'apprentissage extrait de l'échec :**
- "Ce qui ne m'a pas réussi m'a appris que..."
- "Si c'était à refaire je ferais..."
- → Maturité et capacité d'évolution

**La reconnaissance des autres :**
- "Mon équipe a..."
- "Grâce à [collègue], nous avons..."
- → Intelligence relationnelle et humilité

**Algorithme de détection :**
```typescript
async function detectPositivePatterns(response: string): Promise<PositivePattern[]> {
  const patterns: PositivePattern[] = [];
  
  const responsibilityPatterns = [
    { pattern: /j'ai (décidé|choisi|pris l'initiative)/i, type: 'responsability' },
    { pattern: /j'ai (géré|dirigé|mené)/i, type: 'responsability' }
  ];
  
  const numberPatterns = [
    { pattern: /\d+%/, type: 'spontaneous_number' },
    { pattern: /\d+ (personnes|équipes|membres)/i, type: 'spontaneous_number' }
  ];
  
  const learningPatterns = [
    { pattern: /(m'a appris|j'ai appris|leçon)/i, type: 'learning_from_failure' },
    { pattern: /(si c'était à refaire|avec le recul)/i, type: 'learning_from_failure' }
  ];
  
  const recognitionPatterns = [
    { pattern: /(mon équipe|grâce à|avec l'aide de)/i, type: 'recognition_of_others' }
  ];
  
  for (const { pattern, type } of responsibilityPatterns) {
    if (pattern.test(response)) {
      patterns.push({ type, confidence: 0.9 });
    }
  }
  
  for (const { pattern, type } of numberPatterns) {
    if (pattern.test(response)) {
      patterns.push({ type, confidence: 0.8 });
    }
  }
  
  for (const { pattern, type } of learningPatterns) {
    if (pattern.test(response)) {
      patterns.push({ type, confidence: 0.85 });
    }
  }
  
  for (const { pattern, type } of recognitionPatterns) {
    if (pattern.test(response)) {
      patterns.push({ type, confidence: 0.75 });
    }
  }
  
  return patterns;
}
```

---

### 4.2 Patterns de Vigilance à Détecter

**Le "On" de dilution :**
- "On a fait / On a décidé / On a obtenu"
- → Impossible de mesurer la contribution réelle
- → Relance obligatoire : "Quel était VOTRE rôle ?"

**La critique déguisée :**
- "Mon ancien manager n'était pas très..."
- "L'entreprise ne valorisait pas..."
- → Évaluer : critique légitime ou pattern toxique ?
- → Récurrent sur tous les anciens postes = signal fort

**L'hyperbole systématique :**
- "Toujours / Jamais / Tout le monde / Personne"
- → Pensée manichéenne
- → Difficulté à gérer la nuance et la complexité

**L'esquive élégante :**
- Question directe → réponse sur un autre sujet
- → Détection et relance obligatoire
- → Pattern récurrent = signal fort

**Algorithme de détection :**
```typescript
async function detectVigilancePatterns(response: string, question: string): Promise<VigilancePattern[]> {
  const patterns: VigilancePattern[] = [];
  
  const dilutionPatterns = [
    { pattern: /on a (fait|décidé|obtenu)/i, type: 'dilution', severity: 'high' }
  ];
  
  const criticismPatterns = [
    { pattern: /(mon ancien|ancien manager|ancien employeur) n'était pas/i, type: 'criticism', severity: 'medium' },
    { pattern: /(l'entreprise|mon ancienne entreprise) ne (valorisait|respectait|comprenait)/i, type: 'criticism', severity: 'medium' }
  ];
  
  const hyperbolePatterns = [
    { pattern: /(toujours|jamais|tout le monde|personne)/i, type: 'hyperbole', severity: 'low' }
  ];
  
  const evasionPatterns = [
    { pattern: /.*/, type: 'evasion', severity: 'high' }
  ];
  
  for (const { pattern, type, severity } of dilutionPatterns) {
    if (pattern.test(response)) {
      patterns.push({ type, severity, recommendedFollowUp: 'Quel était VOTRE rôle exactement ?' });
    }
  }
  
  for (const { pattern, type, severity } of criticismPatterns) {
    if (pattern.test(response)) {
      patterns.push({ type, severity, recommendedFollowUp: 'Pouvez-vous me donner un exemple concret ?' });
    }
  }
  
  for (const { pattern, type, severity } of hyperbolePatterns) {
    if (pattern.test(response)) {
      patterns.push({ type, severity, recommendedFollowUp: 'Pouvez-vous nuancer votre propos ?' });
    }
  }
  
  // Détection de l'esquive (réponse non pertinente à la question)
  const relevance = await evaluateRelevance(response, question);
  if (relevance < 0.5) {
    patterns.push({ type: 'evasion', severity: 'high', recommendedFollowUp: 'Je vous posais une question sur X. Pouvez-vous y répondre ?' });
  }
  
  return patterns;
}
```

---

## 5. Capacité 3 — Profil Émotionnel du Candidat

### 5.1 Structure du Profil

En fin d'entretien, le moteur produit un profil émotionnel synthétique :

```typescript
interface EmotionalProfile {
  profileId: string;
  candidateId: string;
  interviewId: string;
  generatedAt: Date;
  
  emotionalRegister: {
    dominant: 'positive' | 'negative' | 'neutral' | 'ambivalent';
    confidence: number;
    detectedFields: string[];
  };
  
  locusOfControl: {
    type: 'internal' | 'mixed' | 'external';
    internalScore: number;
    externalScore: number;
    confidence: number;
  };
  
  motivationPattern: {
    type: 'approach' | 'avoidance' | 'mixed';
    approachScore: number;
    avoidanceScore: number;
    intrinsicScore: number;
    extrinsicScore: number;
    confidence: number;
  };
  
  authenticity: {
    level: 'low' | 'normal' | 'high';
    confidence: number;
    detectedSignals: string[];
  };
  
  valueAlignment: {
    level: 'weak' | 'partial' | 'strong';
    confidence: number;
    inconsistencies: { value: string; reason: string }[];
    consistencies: { value: string; evidence: number }[];
  };
  
  detectedPatterns: {
    positive: PositivePattern[];
    vigilance: VigilancePattern[];
  };
  
  summary: {
    energyLevel: 'low' | 'normal' | 'high';
    authenticityLevel: 'low' | 'normal' | 'high';
    locusOfControl: 'internal' | 'mixed' | 'external';
    motivationPattern: 'approach' | 'avoidance' | 'mixed';
    valueAlignment: 'weak' | 'partial' | 'strong';
    identifiedEmotionalRisks: string[];
  };
  
  disclaimer: string;
}
```

### 5.2 Algorithme de Génération du Profil

```typescript
async function generateEmotionalProfile(interviewId: string): Promise<EmotionalProfile> {
  const interview = await getInterview(interviewId);
  const responses = interview.responses.map(r => r.text);
  
  // Analyse des 5 dimensions
  const emotionalRegister = await analyzeEmotionalRegister(responses.join(' '));
  const locusOfControl = await analyzeLocusOfControl(responses.join(' '));
  const motivationPattern = await analyzeMotivationPattern(responses);
  const authenticity = await analyzeAuthenticity(responses);
  const valueAlignment = await analyzeValueAlignment(responses, interview.declaredValues);
  
  // Détection des patterns
  const positivePatterns: PositivePattern[] = [];
  const vigilancePatterns: VigilancePattern[] = [];
  
  for (const response of responses) {
    const question = interview.responses.find(r => r.text === response)?.question;
    const detectedPositive = await detectPositivePatterns(response);
    const detectedVigilance = await detectVigilancePatterns(response, question);
    
    positivePatterns.push(...detectedPositive);
    vigilancePatterns.push(...detectedVigilance);
  }
  
  // Synthèse
  const summary = {
    energyLevel: emotionalRegister.dominant === 'positive' ? 'high' : 
                  emotionalRegister.dominant === 'negative' ? 'low' : 'normal',
    authenticityLevel: authenticity.level,
    locusOfControl: locusOfControl.type,
    motivationPattern: motivationPattern.type,
    valueAlignment: valueAlignment.level,
    identifiedEmotionalRisks: [
      ...vigilancePatterns.filter(p => p.severity === 'high').map(p => p.type),
      ...valueAlignment.inconsistencies.map(i => i.value)
    ]
  };
  
  // Avertissement obligatoire
  const disclaimer = "Ce profil est une aide à la réflexion. Il ne remplace jamais le jugement humain. Il ne peut jamais être le seul critère d'une décision de recrutement. Il est soumis aux règles anti-biais (RH-860).";
  
  const profile: EmotionalProfile = {
    profileId: generateProfileId(),
    candidateId: interview.candidateId,
    interviewId,
    generatedAt: new Date(),
    
    emotionalRegister,
    locusOfControl,
    motivationPattern,
    authenticity,
    valueAlignment,
    
    detectedPatterns: {
      positive: positivePatterns,
      vigilance: vigilancePatterns
    },
    
    summary,
    
    disclaimer
  };
  
  // Sauvegarde du profil
  await saveEmotionalProfile(profile);
  
  return profile;
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface EmotionalRegister {
  dominant: 'positive' | 'negative' | 'neutral' | 'ambivalent';
  confidence: number;
  detectedFields: string[];
}

interface LocusOfControl {
  type: 'internal' | 'mixed' | 'external';
  internalScore: number;
  externalScore: number;
  confidence: number;
}

interface MotivationPattern {
  type: 'approach' | 'avoidance' | 'mixed';
  approachScore: number;
  avoidanceScore: number;
  intrinsicScore: number;
  extrinsicScore: number;
  confidence: number;
}

interface Authenticity {
  level: 'low' | 'normal' | 'high';
  confidence: number;
  detectedSignals: string[];
}

interface ValueAlignment {
  level: 'weak' | 'partial' | 'strong';
  confidence: number;
  inconsistencies: { value: string; reason: string }[];
  consistencies: { value: string; evidence: number }[];
}

interface PositivePattern {
  type: 'responsability' | 'spontaneous_number' | 'learning_from_failure' | 'recognition_of_others';
  confidence: number;
}

interface VigilancePattern {
  type: 'dilution' | 'criticism' | 'hyperbole' | 'evasion';
  severity: 'low' | 'medium' | 'high';
  recommendedFollowUp: string;
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE emotional_profile (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  emotional_register JSON NOT NULL,
  locus_of_control JSON NOT NULL,
  motivation_pattern JSON NOT NULL,
  authenticity JSON NOT NULL,
  value_alignment JSON NOT NULL,
  
  detected_patterns JSON NOT NULL,
  summary JSON NOT NULL,
  
  disclaimer TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id)
);

CREATE INDEX idx_emotional_profile_candidate ON emotional_profile(candidate_id);
CREATE INDEX idx_emotional_profile_interview ON emotional_profile(interview_id);
```

---

## 8. API Endpoints

```typescript
// POST /api/emotional-analysis/analyze
async function analyzeEmotionalSemantics(interviewId: string): Promise<EmotionalProfile> {
  return await generateEmotionalProfile(interviewId);
}

// GET /api/emotional-analysis/:profileId
async function getEmotionalProfile(profileId: string): Promise<EmotionalProfile> {
  return await getEmotionalProfileById(profileId);
}

// GET /api/emotional-analysis/interview/:interviewId
async function getEmotionalProfileByInterview(interviewId: string): Promise<EmotionalProfile> {
  return await getEmotionalProfileByInterviewId(interviewId);
}

// GET /api/emotional-analysis/candidate/:candidateId
async function getEmotionalProfiles(candidateId: string): Promise<EmotionalProfile[]> {
  return await getEmotionalProfileHistory(candidateId);
}

// POST /api/emotional-analysis/analyze-response
async function analyzeSingleResponse(response: string, question: string): Promise<{
  emotionalRegister: EmotionalRegister;
  locusOfControl: LocusOfControl;
  positivePatterns: PositivePattern[];
  vigilancePatterns: VigilancePattern[];
}> {
  return await analyzeResponseSemantics(response, question);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Profils générés / entretiens complétés | 100% |
| Satisfaction recruteur | Satisfaction avec le profil émotionnel | ≥ 4/5 |
| Utilité perçue | Utilité perçue du profil émotionnel | ≥ 4/5 |
| Conformité anti-biais | Respect des règles anti-biais (RH-860) | 100% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection patterns | Patterns détectés / total analysés | ≥ 85% |
| Précision détection | Précision de la détection des patterns | ≥ 80% |
| Impact sur décision | Utilisation du profil dans la décision | ≥ 60% |

---

## 10. Avertissement Obligatoire

**Ce profil est une aide à la réflexion.**
**Il ne remplace jamais le jugement humain.**
**Il ne peut jamais être le seul critère d'une décision de recrutement.**
**Il est soumis aux règles anti-biais (RH-860).**

---

## 11. Conclusion

L'analyse sémantique émotionnelle analyse le texte des réponses du candidat sur 5 dimensions (registre émotionnel, locus de contrôle, pattern de motivation, authenticité, alignement valeurs/discours), détecte les patterns de langage (positifs et de vigilance), et produit un profil émotionnel synthétique. Ce profil est une aide à la réflexion et ne remplace jamais le jugement humain.

**Points clés :**
- 5 dimensions émotionnelles analysées
- Détection des patterns positifs (responsabilité, chiffres spontanés, apprentissage, reconnaissance)
- Détection des patterns de vigilance (dilution, critique, hyperbole, esquive)
- Profil émotionnel synthétique avec résumé
- Avertissement obligatoire sur l'utilisation
- Conformité aux règles anti-biais (RH-860)
- Ne remplace jamais le jugement humain
