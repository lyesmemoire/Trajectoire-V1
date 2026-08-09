# DOC-C1-01 : Grille des 8 Critères de Vague

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la grille des 8 critères de vague pour le Correctif 1 Deep Drilling Engine. Ce document structure le système de détection automatique des réponses vagues, les seuils précis pour chaque critère, et le scoring de vague pour déclencher le niveau de creusage approprié.

---

## 2. Principe Fondateur

Le moteur accepte les réponses vagues et passe à la suite. C'est sa faiblesse la plus visible et la plus dangereuse. Un DRH Senior ne passe JAMAIS à la suite quand une réponse est vague. Il creuse. Il creuse encore. Il creuse jusqu'à trouver la vérité ou l'absence de vérité. Ce correctif encode cette discipline.

Une réponse vague est soit :
- Une expérience non maîtrisée (le candidat n'a pas vraiment fait ça)
- Une réponse préparée et apprise (il cache derrière des mots)
- Une mauvaise communication (il sait mais ne sait pas expliquer)
- Un manque de confiance (il sait mais n'ose pas affirmer)

Le moteur doit distinguer ces 4 cas, pas seulement signaler la vague.

---

## 3. Système de Détection Automatique

Le moteur analyse chaque réponse sur 8 critères de vague simultanément.

---

## 4. Critère 1 — Absence de Chiffres

### 4.1 Description

Toute réponse sur un résultat sans chiffre associé = vague.

### 4.2 Exemples de Réponses Vagues

- "J'ai recruté beaucoup de personnes."
- "Nous avons réduit les coûts."
- "L'équipe était grande."
- "Le projet a généré des revenus importants."
- "Nous avons amélioré la productivité."

### 4.3 Exemples de Réponses Précises

- "J'ai recruté 15 personnes en 6 mois."
- "Nous avons réduit les coûts de 23%."
- "L'équipe comptait 12 personnes."
- "Le projet a généré 1.2M€ de revenus."
- "Nous avons amélioré la productivité de 18%."

### 4.4 Règle de Détection

- Déclenchement automatique sur tout résultat sans quantification
- Types de résultats concernés : recrutement, coûts, revenus, productivité, performance, délais, budget, équipe, clients, projets

### 4.5 Seuil de Déclenchement

- Automatique : si la réponse contient un mot de résultat sans chiffre associé

### 4.6 Mots Déclencheurs de Résultat

- "recruté", "embauché", "formé", "géré", "réduit", "augmenté", "amélioré", "optimisé", "généré", "créé", "développé", "transformé", "restructuré", "réorganisé", "modernisé", "digitalisé"
- "coûts", "revenus", "budget", "productivité", "performance", "délais", "équipe", "clients", "projets", "ventes", "marge", "profit", "croissance", "chiffre d'affaires"

---

## 5. Critère 2 — Vocabulaire Générique

### 5.1 Description

Plus de 3 mots déclencheurs dans une réponse de moins de 150 mots = réponse vague détectée.

### 5.2 Liste des Mots Déclencheurs

**Quantité :**
- "beaucoup", "souvent", "toujours", "rarement", "parfois", "plusieurs", "nombreux", "divers", "variés"

**Qualité :**
- "très", "bien", "complet", "large", "important", "significatif", "solide", "robuste", "riche", "excellent", "exceptionnel", "remarquable"

**Impact :**
- "impactant", "dynamique", "stratégique", "global", "intégral", "fondamental", "essentiel", "crucial", "majeur", "substantiel"

**Action :**
- "mis en place", "développé", "créé", "construit", "bâti", "établi", "implémenté", "déployé"

### 5.3 Exemples de Réponses Vagues

- "J'ai beaucoup développé l'équipe. C'était très important. Nous avons mis en place une stratégie globale solide."

### 5.4 Règle de Détection

- Compter le nombre de mots déclencheurs dans la réponse
- Si > 3 mots déclencheurs ET réponse < 150 mots = vague

### 5.5 Seuil de Déclenchement

- > 3 mots déclencheurs
- Réponse < 150 mots

---

## 6. Critère 3 — Absence d'Exemple Concret

### 6.1 Description

Toute affirmation sur une qualité ou compétence sans exemple concret = vague.

### 6.2 Exemples de Réponses Vagues

- "Je suis quelqu'un de rigoureux."
- "J'ai toujours su gérer les conflits."
- "Je m'adapte facilement."
- "Je suis un bon leader."
- "J'ai une forte capacité d'analyse."

### 6.3 Exemples de Réponses Précises

- "Je suis rigoureux. Par exemple, sur le projet X, j'ai créé un système de suivi qui a réduit les erreurs de 40%."
- "Je gère bien les conflits. L'an dernier, j'ai résolu un conflit entre deux équipes en organisant une médiation structurée."

### 6.4 Règle de Détection

- Si la réponse contient une affirmation sur une qualité/compétence sans exemple concret = vague

### 6.5 Mots Déclencheurs d'Affirmation

- "je suis", "j'ai", "je possède", "j'ai développé", "j'ai acquis", "je maîtrise", "je suis capable de", "j'ai une forte", "j'ai une excellente"

### 6.6 Seuil de Déclenchement

- Automatique : si affirmation détectée sans exemple concret

---

## 7. Critère 4 — Dilution de Responsabilité

### 7.1 Description

Plus de 2 utilisations du "on" sans préciser sa contribution personnelle = vague sur les responsabilités réelles.

### 7.2 Mots Déclencheurs

- "on a fait", "nous avons décidé", "l'équipe a réussi", "on a mis en place", "on a développé", "on a créé", "on a géré", "on a résolu"

### 7.3 Exemples de Réponses Vagues

- "On a décidé de restructurer l'équipe. On a mis en place un nouveau processus. On a réussi à améliorer la performance."

### 7.4 Exemples de Réponses Précises

- "J'ai proposé la restructuration de l'équipe. J'ai conçu le nouveau processus. J'ai piloté la mise en œuvre qui a amélioré la performance de 25%."

### 7.5 Règle de Détection

- Compter les utilisations de "on" ou "nous" sans précision de contribution personnelle
- Si > 2 = vague

### 7.6 Seuil de Déclenchement

- > 2 utilisations de "on"/"nous" sans contribution personnelle

---

## 8. Critère 5 — Réponse Trop Courte

### 8.1 Description

Réponse insuffisamment développée pour le type de question posée.

### 8.2 Seuils par Type de Question

**Question ouverte simple :**
- Seuil : < 80 mots = vague

**Question sur expérience :**
- Seuil : < 150 mots = vague

**Question sur résultats :**
- Seuil : < 100 mots = vague

**Question sur vision :**
- Seuil : < 120 mots = vague

**Question sur conflit/difficulté :**
- Seuil : < 130 mots = vague

### 8.3 Exemples de Réponses Vagues

- Question : "Décrivez votre expérience en gestion de projet."
- Réponse : "J'ai géré plusieurs projets. C'était intéressant." (12 mots)

### 8.4 Exemples de Réponses Précises

- Réponse : "J'ai géré 8 projets sur 3 ans, allant de 50k€ à 2M€ de budget. Chaque projet impliquait des équipes de 5 à 20 personnes. J'ai utilisé une méthodologie agile avec des sprints de 2 semaines..." (150+ mots)

### 8.5 Règle de Détection

- Compter le nombre de mots dans la réponse
- Comparer au seuil du type de question

### 8.6 Seuil de Déclenchement

- Selon type de question (voir tableau ci-dessus)

---

## 9. Critère 6 — Absence de Temporalité

### 9.1 Description

Toute description d'action sans ancrage temporel = vague.

### 9.2 Exemples de Réponses Vagues

- "J'ai géré ce projet."
- "J'ai restructuré le département."
- "J'ai recruté une équipe."

### 9.3 Exemples de Réponses Précises

- "Sur 8 mois, entre mars et novembre 2022, j'ai géré ce projet."
- "En 2021, sur une période de 6 mois, j'ai restructuré le département."
- "De janvier à juin 2023, j'ai recruté une équipe de 12 personnes."

### 9.4 Règle de Détection

- Si la réponse décrit une action sans date/période = vague

### 9.5 Mots Déclencheurs d'Action

- "j'ai géré", "j'ai restructuré", "j'ai recruté", "j'ai développé", "j'ai créé", "j'ai mis en place", "j'ai piloté", "j'ai dirigé", "j'ai coordonné"

### 9.6 Seuil de Déclenchement

- Automatique : si action détectée sans temporalité

---

## 10. Critère 7 — Absence de Contexte

### 10.1 Description

Action sans contexte = vague.

### 10.2 Exemples de Réponses Vagues

- "J'ai restructuré le département."
- "J'ai géré ce projet."
- "J'ai résolu ce problème."

### 10.3 Exemples de Réponses Précises

- "Dans une entreprise de 200 personnes, avec un budget de 500k€, j'ai restructuré le département."
- "Dans une multinationale du secteur tech, avec une équipe de 15 personnes réparties sur 3 pays, j'ai géré ce projet."

### 10.4 Règle de Détection

- Si la réponse décrit une action sans contexte (taille entreprise, budget, secteur, équipe) = vague

### 10.5 Éléments de Contexte Requis

- Taille de l'entreprise
- Budget
- Secteur
- Taille de l'équipe
- Localisation géographique
- Portée du projet

### 10.6 Seuil de Déclenchement

- Automatique : si action détectée sans contexte

---

## 11. Critère 8 — Conclusion sans Cause

### 11.1 Description

Résultat positif sans explication causale = vague.

### 11.2 Exemples de Réponses Vagues

- "Le projet a été un succès."
- "L'initiative a fonctionné."
- "Nous avons atteint nos objectifs."

### 11.3 Exemples de Réponses Précises

- "Le projet a été un succès parce que nous avons réduit les coûts de 20% et livré 2 semaines en avance."
- "L'initiative a fonctionné grâce à l'adoption d'une nouvelle méthodologie et à la formation de l'équipe."

### 11.4 Règle de Détection

- Si la réponse affirme un résultat positif sans expliquer pourquoi = vague

### 11.5 Mots Déclencheurs de Conclusion

- "succès", "réussi", "fonctionné", "atteint", "réalisé", "accompli", "excellent", "remarquable", "positif"

### 11.6 Seuil de Déclenchement

- Automatique : si conclusion positive détectée sans explication causale

---

## 12. Score de Vague

### 12.1 Calcul du Score

Le moteur compte le nombre de critères de vague détectés dans la réponse.

### 12.2 Classification du Score

**0-2 critères détectés :**
- Classification : Réponse acceptable
- Action : Aucun creusage nécessaire

**3-4 critères détectés :**
- Classification : Réponse vague légère
- Action : Creusage Niveau 1

**5-6 critères détectés :**
- Classification : Réponse vague modérée
- Action : Creusage Niveau 2

**7-8 critères détectés :**
- Classification : Réponse vague critique
- Action : Creusage Niveau 3

### 12.3 Algorithme de Détection

```typescript
interface VaguenessDetection {
  responseId: string;
  candidateId: string;
  interviewId: string;
  
  detectedAt: Date;
  
  criteria: {
    criterion1_noNumbers: boolean;
    criterion2_genericVocabulary: boolean;
    criterion3_noConcreteExample: boolean;
    criterion4_responsabilityDilution: boolean;
    criterion5_tooShort: boolean;
    criterion6_noTemporality: boolean;
    criterion7_noContext: boolean;
    criterion8_conclusionWithoutCause: boolean;
  };
  
  score: number;
  classification: 'acceptable' | 'light' | 'moderate' | 'critical';
  
  drillingLevel: number;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 13. Adaptation par Persona

### 13.1 DRH Senior Bienveillant

**Adaptation :**
- Seuils standards
- Creusage bienveillant mais ferme
- Ton respectueux

### 13.2 DRH Executive

**Adaptation :**
- Seuils standards
- Creusage direct et factuel
- Ton professionnel

### 13.3 DRH Startup

**Adaptation :**
- Seuils légèrement plus bas (tolérance pour le style startup)
- Creusage décontracté mais précis
- Ton informel mais exigeant

### 13.4 DRH Technique

**Adaptation :**
- Seuils plus élevés sur le critère 1 (chiffres)
- Creusage très précis sur les aspects techniques
- Ton analytique

---

## 14. Structure de Données (TypeScript)

```typescript
interface VaguenessCriteria {
  criteriaId: string;
  
  criterion1: {
    name: string;
    description: string;
    triggerWords: string[];
    threshold: string;
    examples: {
      vague: string[];
      precise: string[];
    };
  };
  
  criterion2: {
    name: string;
    description: string;
    triggerWords: string[];
    threshold: {
      wordCount: number;
      responseLength: number;
    };
    examples: {
      vague: string[];
      precise: string[];
    };
  };
  
  criterion3: {
    name: string;
    description: string;
    triggerWords: string[];
    threshold: string;
    examples: {
      vague: string[];
      precise: string[];
    };
  };
  
  criterion4: {
    name: string;
    description: string;
    triggerWords: string[];
    threshold: {
      usageCount: number;
    };
    examples: {
      vague: string[];
      precise: string[];
    };
  };
  
  criterion5: {
    name: string;
    description: string;
    thresholds: {
      openQuestion: number;
      experienceQuestion: number;
      resultsQuestion: number;
      visionQuestion: number;
      conflictQuestion: number;
    };
    examples: {
      vague: string[];
      precise: string[];
    };
  };
  
  criterion6: {
    name: string;
    description: string;
    triggerWords: string[];
    threshold: string;
    examples: {
      vague: string[];
      precise: string[];
    };
  };
  
  criterion7: {
    name: string;
    description: string;
    requiredContext: string[];
    threshold: string;
    examples: {
      vague: string[];
      precise: string[];
    };
  };
  
  criterion8: {
    name: string;
    description: string;
    triggerWords: string[];
    threshold: string;
    examples: {
      vague: string[];
      precise: string[];
    };
  };
  
  scoring: {
    acceptable: {
      min: number;
      max: number;
      action: string;
    };
    light: {
      min: number;
      max: number;
      action: string;
      drillingLevel: number;
    };
    moderate: {
      min: number;
      max: number;
      action: string;
      drillingLevel: number;
    };
    critical: {
      min: number;
      max: number;
      action: string;
      drillingLevel: number;
    };
  };
  
  personaAdaptations: {
    senior: {
      thresholds: any;
      drillingStyle: string;
      tone: string;
    };
    executive: {
      thresholds: any;
      drillingStyle: string;
      tone: string;
    };
    startup: {
      thresholds: any;
      drillingStyle: string;
      tone: string;
    };
    technical: {
      thresholds: any;
      drillingStyle: string;
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

## 15. Stockage et Gestion

### 15.1 Schéma SQL

```sql
CREATE TABLE vagueness_detection (
  id VARCHAR(36) PRIMARY KEY,
  response_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  detected_at TIMESTAMP NOT NULL,
  
  criterion1_no_numbers BOOLEAN NOT NULL,
  criterion2_generic_vocabulary BOOLEAN NOT NULL,
  criterion3_no_concrete_example BOOLEAN NOT NULL,
  criterion4_responsability_dilution BOOLEAN NOT NULL,
  criterion5_too_short BOOLEAN NOT NULL,
  criterion6_no_temporality BOOLEAN NOT NULL,
  criterion7_no_context BOOLEAN NOT NULL,
  criterion8_conclusion_without_cause BOOLEAN NOT NULL,
  
  score INT NOT NULL,
  classification VARCHAR(20) NOT NULL,
  drilling_level INT NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_vagueness_detection_response ON vagueness_detection(response_id);
CREATE INDEX idx_vagueness_detection_candidate ON vagueness_detection(candidate_id);
CREATE INDEX idx_vagueness_detection_interview ON vagueness_detection(interview_id);
CREATE INDEX idx_vagueness_detection_classification ON vagueness_detection(classification);

CREATE TABLE vagueness_criteria (
  id VARCHAR(36) PRIMARY KEY,
  
  criterion1 JSON NOT NULL,
  criterion2 JSON NOT NULL,
  criterion3 JSON NOT NULL,
  criterion4 JSON NOT NULL,
  criterion5 JSON NOT NULL,
  criterion6 JSON NOT NULL,
  criterion7 JSON NOT NULL,
  criterion8 JSON NOT NULL,
  
  scoring JSON NOT NULL,
  persona_adaptations JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 16. API Endpoints

```typescript
// POST /api/deep-drilling/detect
async function detectVagueness(responseId: string, responseText: string, questionType: string): Promise<VaguenessDetection> {
  return await detectVagueness(responseId, responseText, questionType);
}

// GET /api/deep-drilling/detection/:detectionId
async function getVaguenessDetection(detectionId: string): Promise<VaguenessDetection> {
  return await getVaguenessDetectionById(detectionId);
}

// GET /api/deep-drilling/detection/response/:responseId
async function getDetectionByResponse(responseId: string): Promise<VaguenessDetection> {
  return await getDetectionByResponse(responseId);
}

// GET /api/deep-drilling/criteria
async function getVaguenessCriteria(): Promise<VaguenessCriteria> {
  return await getVaguenessCriteria();
}

// PUT /api/deep-drilling/criteria
async function updateVaguenessCriteria(criteria: VaguenessCriteria): Promise<VaguenessCriteria> {
  return await updateVaguenessCriteria(criteria);
}

// POST /api/deep-drilling/criteria/test
async function testCriteria(responseText: string, questionType: string): Promise<VaguenessDetection> {
  return await testCriteria(responseText, questionType);
}
```

---

## 17. Indicateurs de Suivi

### 17.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Réponses vagues détectées / total réponses | Variable selon contexte |
- Précision de détection | Vraies réponses vagues / réponses détectées comme vagues | ≥ 90% |
- Rappel de détection | Réponses vagues détectées / total réponses vagues | ≥ 85% |

### 17.2 Métriques par Critère

| Métrique | Description | Cible |
|----------|-------------|-------|
- Fréquence critère 1 | % de réponses avec critère 1 | Variable |
- Fréquence critère 2 | % de réponses avec critère 2 | Variable |
- Fréquence critère 3 | % de réponses avec critère 3 | Variable |
- Fréquence critère 4 | % de réponses avec critère 4 | Variable |
- Fréquence critère 5 | % de réponses avec critère 5 | Variable |
- Fréquence critère 6 | % de réponses avec critère 6 | Variable |
- Fréquence critère 7 | % de réponses avec critère 7 | Variable |
- Fréquence critère 8 | % de réponses avec critère 8 | Variable |

---

## 18. Conclusion

La grille des 8 critères de vague structure le système de détection automatique des réponses vagues. Les 8 critères sont : absence de chiffres, vocabulaire générique, absence d'exemple concret, dilution de responsabilité, réponse trop courte, absence de temporalité, absence de contexte, et conclusion sans cause. Chaque critère a des règles de détection précises et des seuils de déclenchement. Le score de vague (0-8) détermine le niveau de creusage (0-2 : acceptable, 3-4 : niveau 1, 5-6 : niveau 2, 7-8 : niveau 3). Les seuils peuvent être adaptés selon le persona du recruteur.

**Points clés :**
- 8 critères de vague avec règles précises
- Critère 1 : absence de chiffres sur les résultats
- Critère 2 : > 3 mots génériques dans < 150 mots
- Critère 3 : affirmation sans exemple concret
- Critère 4 : > 2 utilisations de "on" sans contribution personnelle
- Critère 5 : réponse trop courte selon type de question
- Critère 6 : action sans temporalité
- Critère 7 : action sans contexte
- Critère 8 : conclusion positive sans cause
- Score de vague : 0-8 critères détectés
- Classification : acceptable (0-2), légère (3-4), modérée (5-6), critique (7-8)
- Niveau de creusage : 0 (acceptable), 1 (léger), 2 (modéré), 3 (profond)
- Adaptation par persona (Senior, Executive, Startup, Technique)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la détection
- Métriques de détection et par critère
