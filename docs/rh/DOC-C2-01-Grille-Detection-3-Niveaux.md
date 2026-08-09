# DOC-C2-01 : Grille de Détection en 3 Niveaux

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la grille de détection en 3 niveaux pour le Correctif 2 Detection of Prepared Responses. Ce document structure le système de détection des réponses préparées selon 3 niveaux (A : signaux linguistiques, B : signaux de contenu, C : signaux comportementaux), avec les indicateurs précis pour chaque signal.

---

## 2. Principe Fondateur

Les candidats préparés donnent des réponses parfaites. Trop parfaites. Le moteur les cote positivement alors qu'elles sont souvent creuses. Un DRH senior détecte ça en 30 secondes. Il sait distinguer ce que le candidat A VÉCU de ce que le candidat A APPRIS À DIRE. Ce correctif encode cette détection en 3 niveaux de signaux.

---

## 3. Niveau A — Signaux Linguistiques

### 3.1 Signal A1 — Fluidité Excessive

**Description :**
Une vraie expérience vécue contient des hésitations naturelles. Le candidat cherche ses mots, corrige, reformule. Une réponse préparée est fluide. Parfaitement fluide. Trop fluide.

**Indicateurs de fluidité excessive :**
- Débit constant sans variation
- Absence de pauses de réflexion
- Absence de reformulations spontanées
- Absence de corrections en cours de route

**Exemples de réponses authentiques :**
- "Attendez... c'était en... 2021 je crois, non 2022... enfin, l'important c'est que..."
- "Alors, j'ai... comment dire... géré ce projet... enfin, coordonné plutôt..."

**Exemples de réponses préparées :**
- "J'ai géré ce projet avec succès en appliquant une méthodologie agile sur une période de 6 mois."
- "Ma valeur ajoutée réside dans ma capacité à piloter des équipes multidisciplinaires vers l'excellence opérationnelle."

**Règle de détection :**
- Si débit constant + absence de pauses + absence de reformulations = signal détecté

**Seuil de déclenchement :**
- Automatique si 3 indicateurs sur 3 présents

### 3.2 Signal A2 — Structure STAR Trop Propre

**Description :**
Un candidat qui n'a pas préparé raconte une histoire. Un candidat préparé récite Situation / Tâche / Action / Résultat dans l'ordre parfait.

**Signe distinctif :**
- Structure trop propre = préparé
- Histoire qui part dans tous les sens mais avec des détails vrais = authentique

**Indicateurs de structure STAR trop propre :**
- Transition parfaite entre S, T, A, R
- Chaque section équilibrée en durée
- Absence de digressions naturelles
- Conclusion parfaitement alignée avec l'introduction

**Exemples de réponses préparées :**
- "Situation : dans mon entreprise précédente... Tâche : j'ai été chargé de... Action : j'ai mis en place... Résultat : nous avons atteint..."
- "D'abord, j'ai identifié le problème. Ensuite, j'ai analysé les options. Puis, j'ai choisi la solution. Enfin, j'ai mesuré l'impact."

**Règle de détection :**
- Si structure STAR détectée + transitions parfaites = signal détecté

**Seuil de déclenchement :**
- Automatique si structure STAR + transitions parfaites

### 3.3 Signal A3 — Vocabulaire de Coaching

**Description :**
Liste des formules de coaching qui ne viennent jamais spontanément.

**Liste des formules de coaching :**
- "Ma valeur ajoutée est..."
- "Je suis quelqu'un de resilient..."
- "J'ai un leadership collaboratif..."
- "Mon style managérial est..."
- "Je me définis comme quelqu'un qui..."
- "Mon point de différenciation est..."
- "J'ai une approche data-driven..."
- "Je suis force de proposition..."
- "Mes soft skills sont..."
- "J'ai une mindset growth..."
- "Je suis proactif dans..."
- "J'ai une vision stratégique de..."

**Règle de détection :**
- Si 2 formules de coaching ou plus dans les premières 5 minutes = préparation intensive détectée

**Seuil de déclenchement :**
- ≥ 2 formules de coaching dans 5 minutes

### 3.4 Signal A4 — Exemple Trop Parfait

**Description :**
Toute vraie expérience a des aspérités. Des moments de doute. Des erreurs partielles. Des résultats mitigés. Si l'exemple cité est parfait de A à Z sans aucun moment difficile = réponse préparée probable.

**Indicateurs d'exemple trop parfait :**
- Aucun moment de difficulté mentionné
- Aucune erreur ou échec partiel
- Résultat 100% positif
- Aucune nuance ou ambigüité
- Histoire linéaire sans obstacle

**Exemples de réponses préparées :**
- "Tout s'est parfaitement déroulé. L'équipe était motivée, le budget suffisant, le client satisfait."
- "Le projet a été un succès complet. Nous avons atteint tous les objectifs sans aucun problème."

**Règle de détection :**
- Si exemple sans aspérité + résultat 100% positif = signal détecté

**Seuil de déclenchement :**
- Automatique si 0 aspérité + 100% positif

### 3.5 Signal A5 — Absence d'Émotion

**Description :**
Les vraies expériences portent une charge émotionnelle. Le candidat ressent encore quelque chose. Sa voix change. Son débit varie. Une réponse préparée est plate. Elle décrit sans ressentir. Elle performe sans vivre.

**Indicateurs d'absence d'émotion :**
- Débit monotone
- Variations vocales minimales
- Absence d'engagement émotionnel
- Description factuelle sans ressenti

**Exemples de réponses authentiques :**
- "C'était... difficile. J'ai vraiment dû me battre pour convaincre l'équipe." (émotion présente)
- "Je suis fier de ce projet. On a travaillé dur." (émotion présente)

**Exemples de réponses préparées :**
- "Le projet a été mené à terme avec succès dans les délais impartis." (absence d'émotion)
- "J'ai coordonné les équipes selon les meilleures pratiques." (absence d'émotion)

**Règle de détection :**
- Si débit monotone + absence de variation vocale = signal détecté

**Seuil de déclenchement :**
- Automatique si débit monotone + absence de variation

---

## 4. Niveau B — Signaux de Contenu

### 4.1 Signal B1 — L'Exemple Universel

**Description :**
Certains candidats utilisent toujours le même exemple pour toutes les questions sur un même thème.

**Détection :**
- Si le même contexte ou projet est cité plus de 2 fois = répertoire d'exemples limité = préparation insuffisante ou expérience réelle limitée

**Exemples :**
- "Leadership" → même exemple
- "Gestion de conflit" → même exemple
- "Travail en équipe" → même exemple

**Règle de détection :**
- Si même contexte cité > 2 fois = signal détecté

**Seuil de déclenchement :**
- > 2 citations du même contexte

### 4.2 Signal B2 — La Réponse qui Ignore la Question Précise

**Description :**
Un candidat préparé répond à la question qu'il a préparée. Pas nécessairement à celle posée.

**Détection :**
- Analyser la pertinence de la réponse par rapport à la question exacte
- Si décalage > 30% = réponse préparée déviante

**Exemples :**
- Question : "Comment gérez-vous les conflits ?"
- Réponse préparée : "Je suis un leader collaboratif qui valorise la communication..." (réponse sur leadership, pas sur conflit)

**Règle de détection :**
- Si pertinence < 70% = signal détecté

**Seuil de déclenchement :**
- Pertinence < 70%

### 4.3 Signal B3 — L'Absence de Surprise

**Description :**
Dans un vrai entretien, certaines questions surprennent même les meilleurs candidats. Ils ont besoin de réfléchir. Si TOUTES les questions reçoivent une réponse immédiate et fluide = préparation extensive.

**Détection :**
- Si temps de réflexion moyen < 2 secondes sur toutes les questions = préparation extensive

**Règle de détection :**
- Si temps de réflexion moyen < 2 secondes = signal détecté

**Seuil de déclenchement :**
- Temps de réflexion moyen < 2 secondes

---

## 5. Niveau C — Signaux Comportementaux

**Note :** Ces signaux ne s'appliquent que si entretien vidéo ou en présentiel.

### 5.1 Signal C1 — Regard vers le Haut à Gauche

**Description :**
Signe de récitation mémorielle (accès à la mémoire verbale).

**Indicateurs :**
- Mouvements oculaires répétés vers le haut à gauche
- Fixation sur un point pendant la récitation
- Yeux qui "cherchent" dans la mémoire

**Règle de détection :**
- Si regard vers le haut à gauche > 50% du temps de réponse = signal détecté

**Seuil de déclenchement :**
- > 50% du temps de réponse

### 5.2 Signal C2 — Débit qui S'accélère au Début des Réponses

**Description :**
Le candidat "lance" sa réponse préparée.

**Indicateurs :**
- Accélération du débit dans les 3 premières secondes
- Débit initial > débit moyen de +30%
- Transition immédiate sans pause

**Règle de détection :**
- Si débit initial > débit moyen de +30% = signal détecté

**Seuil de déclenchement :**
- Débit initial > débit moyen de +30%

### 5.3 Signal C3 — Pause avant les "Vraies" Questions

**Description :**
Sur les questions impossibles à préparer, le débit ralentit naturellement. Ce contraste révèle ce qui était préparé.

**Indicateurs :**
- Contraste de débit entre questions préparées et non préparées
- Temps de réflexion > 5 secondes sur questions non préparées
- Variation de débit > 40% entre types de questions

**Règle de détection :**
- Si contraste de débit > 40% = signal détecté

**Seuil de déclenchement :**
- Contraste de débit > 40%

---

## 6. Score de Préparation

### 6.1 Calcul du Score

Le moteur compte le nombre de signaux détectés dans chaque niveau.

**Niveau A (Signaux Linguistiques) :**
- 0-1 signaux : Préparation faible
- 2-3 signaux : Préparation modérée
- 4-5 signaux : Préparation intensive

**Niveau B (Signaux de Contenu) :**
- 0 signaux : Préparation faible
- 1 signal : Préparation modérée
- 2-3 signaux : Préparation intensive

**Niveau C (Signaux Comportementaux) :**
- 0 signaux : Préparation faible
- 1 signal : Préparation modérée
- 2-3 signaux : Préparation intensive

### 6.2 Classification Globale

**Score 0-2 signaux :**
- Classification : Réponse probablement authentique
- Action : Aucun démasquage nécessaire

**Score 3-5 signaux :**
- Classification : Réponse possiblement préparée
- Action : Démasquage Niveau 1

**Score 6-8 signaux :**
- Classification : Réponse probablement préparée
- Action : Démasquage Niveau 2

**Score 9-11 signaux :**
- Classification : Réponse intensément préparée
- Action : Démasquage Niveau 3

---

## 7. Adaptation par Persona

### 7.1 DRH Senior Bienveillant

**Adaptation :**
- Seuils standards
- Démasquage bienveillant mais ferme
- Ton respectueux

### 7.2 DRH Executive

**Adaptation :**
- Seuils standards
- Démasquage direct et factuel
- Ton professionnel

### 7.3 DRH Startup

**Adaptation :**
- Seuils légèrement plus bas (tolérance pour le style startup)
- Démasquage décontracté mais précis
- Ton informel mais exigeant

### 7.4 DRH Technique

**Adaptation :**
- Seuils plus élevés sur Signal A3 (vocabulaire de coaching)
- Démasquage très précis sur les aspects techniques
- Ton analytique

---

## 8. Structure de Données (TypeScript)

```typescript
interface PreparedResponseDetection {
  detectionId: string;
  responseId: string;
  candidateId: string;
  interviewId: string;
  
  detectedAt: Date;
  
  levelA: {
    signalA1_excessiveFluency: {
      detected: boolean;
      indicators: {
        constantFlow: boolean;
        noReflectionPauses: boolean;
        noSpontaneousReformulations: boolean;
        noMidCourseCorrections: boolean;
      };
    };
    signalA2_perfectStarStructure: {
      detected: boolean;
      indicators: {
        perfectTransitions: boolean;
        balancedSections: boolean;
        noNaturalDigressions: boolean;
        alignedConclusion: boolean;
      };
    };
    signalA3_coachingVocabulary: {
      detected: boolean;
      count: number;
      phrases: string[];
    };
    signalA4_perfectExample: {
      detected: boolean;
      indicators: {
        noDifficulty: boolean;
        noPartialFailure: boolean;
        hundredPercentPositive: boolean;
        noNuance: boolean;
      };
    };
    signalA5_noEmotion: {
      detected: boolean;
      indicators: {
        monotoneFlow: boolean;
        minimalVocalVariation: boolean;
        noEmotionalEngagement: boolean;
        factualDescription: boolean;
      };
    };
    score: number;
    classification: 'low' | 'moderate' | 'intensive';
  };
  
  levelB: {
    signalB1_universalExample: {
      detected: boolean;
      contextRepetitionCount: number;
    };
    signalB2_ignoresPreciseQuestion: {
      detected: boolean;
      relevancePercentage: number;
    };
    signalB3_noSurprise: {
      detected: boolean;
      averageReflectionTime: number;
    };
    score: number;
    classification: 'low' | 'moderate' | 'intensive';
  };
  
  levelC: {
    signalC1_lookUpLeft: {
      detected: boolean;
      percentage: number;
    };
    signalC2_acceleratedStart: {
      detected: boolean;
      initialFlowIncrease: number;
    };
    signalC3_pauseBeforeRealQuestions: {
      detected: boolean;
      flowContrast: number;
    };
    score: number;
    classification: 'low' | 'moderate' | 'intensive';
  };
  
  globalScore: number;
  globalClassification: 'authentic' | 'possibly_prepared' | 'probably_prepared' | 'intensively_prepared';
  unmaskingLevel: number;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface DetectionGrid {
  gridId: string;
  
  levelA: {
    signals: {
      signalA1: {
        name: string;
        description: string;
        indicators: string[];
        examples: {
          authentic: string[];
          prepared: string[];
        };
        detectionRule: string;
        threshold: string;
      };
      signalA2: {
        name: string;
        description: string;
        indicators: string[];
        examples: {
          prepared: string[];
        };
        detectionRule: string;
        threshold: string;
      };
      signalA3: {
        name: string;
        description: string;
        phrases: string[];
        detectionRule: string;
        threshold: string;
      };
      signalA4: {
        name: string;
        description: string;
        indicators: string[];
        examples: {
          prepared: string[];
        };
        detectionRule: string;
        threshold: string;
      };
      signalA5: {
        name: string;
        description: string;
        indicators: string[];
        examples: {
          authentic: string[];
          prepared: string[];
        };
        detectionRule: string;
        threshold: string;
      };
    };
    scoring: {
      low: {
        min: number;
        max: number;
        classification: string;
      };
      moderate: {
        min: number;
        max: number;
        classification: string;
      };
      intensive: {
        min: number;
        max: number;
        classification: string;
      };
    };
  };
  
  levelB: {
    signals: {
      signalB1: {
        name: string;
        description: string;
        detectionRule: string;
        threshold: string;
      };
      signalB2: {
        name: string;
        description: string;
        detectionRule: string;
        threshold: string;
      };
      signalB3: {
        name: string;
        description: string;
        detectionRule: string;
        threshold: string;
      };
    };
    scoring: {
      low: {
        min: number;
        max: number;
        classification: string;
      };
      moderate: {
        min: number;
        max: number;
        classification: string;
      };
      intensive: {
        min: number;
        max: number;
        classification: string;
      };
    };
  };
  
  levelC: {
    signals: {
      signalC1: {
        name: string;
        description: string;
        detectionRule: string;
        threshold: string;
        note: string;
      };
      signalC2: {
        name: string;
        description: string;
        detectionRule: string;
        threshold: string;
      };
      signalC3: {
        name: string;
        description: string;
        detectionRule: string;
        threshold: string;
      };
    };
    scoring: {
      low: {
        min: number;
        max: number;
        classification: string;
      };
      moderate: {
        min: number;
        max: number;
        classification: string;
      };
      intensive: {
        min: number;
        max: number;
        classification: string;
      };
    };
  };
  
  globalScoring: {
    authentic: {
      min: number;
      max: number;
      action: string;
    };
    possiblyPrepared: {
      min: number;
      max: number;
      action: string;
      unmaskingLevel: number;
    };
    probablyPrepared: {
      min: number;
      max: number;
      action: string;
      unmaskingLevel: number;
    };
    intensivelyPrepared: {
      min: number;
      max: number;
      action: string;
      unmaskingLevel: number;
    };
  };
  
  personaAdaptations: {
    senior: {
      thresholds: any;
      unmaskingStyle: string;
      tone: string;
    };
    executive: {
      thresholds: any;
      unmaskingStyle: string;
      tone: string;
    };
    startup: {
      thresholds: any;
      unmaskingStyle: string;
      tone: string;
    };
    technical: {
      thresholds: any;
      unmaskingStyle: string;
      tone: string;
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE prepared_response_detection (
  id VARCHAR(36) PRIMARY KEY,
  response_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  detected_at TIMESTAMP NOT NULL,
  
  level_a_signal_a1 BOOLEAN NOT NULL,
  level_a_signal_a2 BOOLEAN NOT NULL,
  level_a_signal_a3 BOOLEAN NOT NULL,
  level_a_signal_a4 BOOLEAN NOT NULL,
  level_a_signal_a5 BOOLEAN NOT NULL,
  level_a_score INT NOT NULL,
  level_a_classification VARCHAR(20) NOT NULL,
  
  level_b_signal_b1 BOOLEAN NOT NULL,
  level_b_signal_b2 BOOLEAN NOT NULL,
  level_b_signal_b3 BOOLEAN NOT NULL,
  level_b_score INT NOT NULL,
  level_b_classification VARCHAR(20) NOT NULL,
  
  level_c_signal_c1 BOOLEAN NOT NULL,
  level_c_signal_c2 BOOLEAN NOT NULL,
  level_c_signal_c3 BOOLEAN NOT NULL,
  level_c_score INT NOT NULL,
  level_c_classification VARCHAR(20) NOT NULL,
  
  global_score INT NOT NULL,
  global_classification VARCHAR(30) NOT NULL,
  unmasking_level INT NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_prepared_detection_response ON prepared_response_detection(response_id);
CREATE INDEX idx_prepared_detection_candidate ON prepared_response_detection(candidate_id);
CREATE INDEX idx_prepared_detection_interview ON prepared_response_detection(interview_id);
CREATE INDEX idx_prepared_detection_classification ON prepared_response_detection(global_classification);

CREATE TABLE detection_grid (
  id VARCHAR(36) PRIMARY KEY,
  
  level_a JSON NOT NULL,
  level_b JSON NOT NULL,
  level_c JSON NOT NULL,
  
  global_scoring JSON NOT NULL,
  persona_adaptations JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 10. API Endpoints

```typescript
// POST /api/prepared-response/detect
async function detectPreparedResponse(responseId: string, responseText: string, audioData?: any, videoData?: any): Promise<PreparedResponseDetection> {
  return await detectPreparedResponse(responseId, responseText, audioData, videoData);
}

// GET /api/prepared-response/detection/:detectionId
async function getPreparedResponseDetection(detectionId: string): Promise<PreparedResponseDetection> {
  return await getPreparedResponseDetectionById(detectionId);
}

// GET /api/prepared-response/detection/response/:responseId
async function getDetectionByResponse(responseId: string): Promise<PreparedResponseDetection> {
  return await getDetectionByResponse(responseId);
}

// GET /api/prepared-response/detection-grid
async function getDetectionGrid(): Promise<DetectionGrid> {
  return await getDetectionGrid();
}

// PUT /api/prepared-response/detection-grid
async function updateDetectionGrid(grid: DetectionGrid): Promise<DetectionGrid> {
  return await updateDetectionGrid(grid);
}

// POST /api/prepared-response/detect/level-a
async function detectLevelA(responseText: string): Promise<any> {
  return await detectLevelA(responseText);
}

// POST /api/prepared-response/detect/level-b
async function detectLevelB(responseText: string, questionText: string): Promise<any> {
  return await detectLevelB(responseText, questionText);
}

// POST /api/prepared-response/detect/level-c
async function detectLevelC(audioData: any, videoData: any): Promise<any> {
  return await detectLevelC(audioData, videoData);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Réponses préparées détectées / total réponses | Variable |
- Précision de détection | Vraies réponses préparées / réponses détectées comme préparées | ≥ 85% |
- Rappel de détection | Réponses préparées détectées / total réponses préparées | ≥ 80% |

### 11.2 Métriques par Niveau

| Métrique | Description | Cible |
|----------|-------------|-------|
- Fréquence Niveau A | % de détections avec signaux Niveau A | Variable |
- Fréquence Niveau B | % de détections avec signaux Niveau B | Variable |
- Fréquence Niveau C | % de détections avec signaux Niveau C | Variable |

### 11.3 Métriques par Signal

| Métrique | Description | Cible |
|----------|-------------|-------|
- Fréquence Signal A1 | % de détections avec Signal A1 | Variable |
- Fréquence Signal A2 | % de détections avec Signal A2 | Variable |
- Fréquence Signal A3 | % de détections avec Signal A3 | Variable |
- Fréquence Signal A4 | % de détections avec Signal A4 | Variable |
- Fréquence Signal A5 | % de détections avec Signal A5 | Variable |
- Fréquence Signal B1 | % de détections avec Signal B1 | Variable |
- Fréquence Signal B2 | % de détections avec Signal B2 | Variable |
- Fréquence Signal B3 | % de détections avec Signal B3 | Variable |
- Fréquence Signal C1 | % de détections avec Signal C1 | Variable |
- Fréquence Signal C2 | % de détections avec Signal C2 | Variable |
- Fréquence Signal C3 | % de détections avec Signal C3 | Variable |

---

## 12. Conclusion

La grille de détection en 3 niveaux structure le système de détection des réponses préparées. Niveau A (signaux linguistiques) comprend 5 signaux : fluidité excessive, structure STAR trop propre, vocabulaire de coaching, exemple trop parfait, et absence d'émotion. Niveau B (signaux de contenu) comprend 3 signaux : exemple universel, réponse qui ignore la question précise, et absence de surprise. Niveau C (signaux comportementaux) comprend 3 signaux : regard vers le haut à gauche, débit qui s'accélère au début, et pause avant les vraies questions. Le score global (0-11) détermine le niveau de démasquage (0-2 : aucun, 3-5 : niveau 1, 6-8 : niveau 2, 9-11 : niveau 3). Les seuils peuvent être adaptés selon le persona du recruteur.

**Points clés :**
- 3 niveaux de détection (A, B, C)
- Niveau A : 5 signaux linguistiques
- Niveau B : 3 signaux de contenu
- Niveau C : 3 signaux comportementaux (vidéo/présentiel uniquement)
- 11 signaux au total
- Score global 0-11
- Classification : authentique (0-2), possiblement préparée (3-5), probablement préparée (6-8), intensément préparée (9-11)
- Niveau de démasquage : 0 (aucun), 1, 2, 3
- Adaptation par persona (Senior, Executive, Startup, Technique)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la détection
- Métriques de détection, par niveau et par signal
