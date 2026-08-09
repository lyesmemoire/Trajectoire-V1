# DOC-C3-03 : Protocole de Détection des Lacunes en Temps Réel

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de détection des lacunes en temps réel pour le Correctif 3 Legal Knowledge Validation. Ce document structure le système de validation en temps réel des connaissances légales, avec l'identification du domaine, l'activation de la checklist, le suivi en temps réel, la détection des lacunes, et le creusage ciblé.

---

## 2. Principe Fondateur

Quand un cas pratique est posé dans un domaine légal, le moteur identifie le domaine concerné, active la checklist des éléments légaux obligatoires, coche mentalement les éléments cités pendant que le candidat répond, détecte les lacunes après la réponse, et applique un creusage ciblé sur les éléments critiques manquants.

---

## 3. Fonctionnement du Système

### 3.1 Étape 1 — Identification du Domaine

**Description :**
Le moteur identifie quel domaine légal est concerné et quel niveau de connaissance est attendu pour ce poste.

**Processus :**
1. Analyser la question posée
2. Identifier le domaine légal (contrats, collectif, temps, formation, santé)
3. Identifier le cas type spécifique
4. Récupérer le niveau de connaissance attendu (junior, senior, executive)
5. Récupérer la checklist correspondante

**Exemple :**
- Question : "Un délégué du personnel a commis une faute grave. Comment procédez-vous à son licenciement ?"
- Domaine identifié : Contrats et relations individuelles
- Cas type : Licenciement salarié protégé
- Niveau attendu : DRH senior
- Checklist : 6 éléments obligatoires

### 3.2 Étape 2 — Activation de la Checklist

**Description :**
Le moteur active la checklist des éléments légaux obligatoires pour cette situation.

**Processus :**
1. Récupérer la checklist du cas type
2. Initialiser tous les éléments à "non mentionné"
3. Préparer le suivi en temps réel
4. Charger les questions de creusage pour chaque élément critique

**Exemple :**
- Checklist activée pour licenciement salarié protégé
- Éléments : [convocation, réunion CSE, autorisation Inspection du Travail, délai réponse, recours, conséquences]
- État initial : tous à false

### 3.3 Étape 3 — Suivi en Temps Réel

**Description :**
Pendant que le candidat répond, le moteur coche mentalement les éléments cités.

**Processus :**
1. Analyser la réponse du candidat en temps réel
2. Identifier les mots-clés correspondant aux éléments de la checklist
3. Cocher les éléments mentionnés
4. Maintenir la trace des éléments manquants
5. Identifier les éléments critiques manquants

**Exemple :**
- Candidat : "Je dois d'abord le convoquer à un entretien préalable..."
- Moteur : coche "convocation entretien préalable"
- Candidat : "...puis informer le CSE..."
- Moteur : coche "réunion d'information du CSE"
- Candidat : "...et le licencier."
- Moteur : "autorisation Inspection du Travail" reste non coché → lacune critique détectée

### 3.4 Étape 4 — Détection des Lacunes

**Description :**
Après la réponse, le moteur détermine les éléments cités et manquants, et évalue la criticité des manquants.

**Processus :**
1. Compiler la liste des éléments cités
2. Compiler la liste des éléments manquants
3. Évaluer la criticité des manquants (critique, significatif, mineur)
4. Compter le nombre d'éléments critiques manquants
5. Déterminer le score légal provisoire

**Exemple :**
- Éléments cités : [convocation, réunion CSE]
- Éléments manquants : [autorisation Inspection du Travail (critique), délai réponse (significatif), recours (significatif), conséquences (significatif)]
- Criticité : 1 critique, 3 significatifs
- Score légal provisoire : 2/5

### 3.5 Étape 5 — Creusage Ciblé sur les Lacunes

**Description :**
Si un élément critique est absent, le moteur pose une question directe et immédiate.

**Processus :**
1. Identifier le premier élément critique manquant
2. Récupérer la question de creusage correspondante
3. Poser la question immédiatement
4. Analyser la réponse au creusage
5. Mettre à jour la checklist
6. Réévaluer le score légal

**Exemple :**
- Élément critique manquant : autorisation Inspection du Travail
- Question de creusage : "Quelle est la procédure spécifique pour licencier un salarié protégé par rapport à un salarié ordinaire ?"
- Candidat : "Il faut demander l'autorisation à l'Inspecteur du Travail."
- Moteur : coche "autorisation Inspection du Travail"
- Score légal réévalué : 3/5

---

## 4. Algorithme de Détection

### 4.1 Identification des Mots-Clés

**Méthode :**
- Chaque élément de la checklist a des mots-clés associés
- Le moteur analyse la réponse pour détecter ces mots-clés
- Si mots-clés détectés → élément mentionné

**Exemple :**
- Élément : autorisation Inspection du Travail
- Mots-clés : ["autorisation", "inspection du travail", "inspecteur", "salarié protégé"]
- Réponse : "Je dois demander l'autorisation à l'Inspecteur du Travail."
- Détection : mots-clés détectés → élément mentionné

### 4.2 Analyse Sémantique

**Méthode :**
- Si mots-clés non détectés, analyse sémantique
- Le moteur évalue si le candidat décrit l'élément sans utiliser les mots-clés exacts
- Si description sémantique détectée → élément mentionné

**Exemple :**
- Élément : autorisation Inspection du Travail
- Réponse : "Je dois obtenir une validation administrative spécifique."
- Analyse sémantique : "validation administrative spécifique" ≈ autorisation Inspection du Travail
- Détection : élément mentionné

### 4.3 Seuil de Détection

**Seuil :**
- 70% de confiance pour marquer un élément comme mentionné
- En cas de doute, l'élément reste non mentionné
- Le creusage clarifiera

---

## 5. Protocole de Creusage

### 5.1 Sélection de la Question de Creusage

**Règle :**
- Priorité aux éléments critiques manquants
- Un seul creusage par élément critique
- Maximum 3 creusages par cas

**Ordre de priorité :**
1. Éléments critiques manquants
2. Éléments significatifs manquants
3. Éléments mineurs manquants

### 5.2 Formulation de la Question

**Principe :**
- Question directe et spécifique
- Ne pas révéler la réponse attendue
- Focaliser sur l'élément manquant

**Exemples :**
- "Vous n'avez pas mentionné [X]. Comment le gérez-vous dans cette situation ?"
- "Quelle est la procédure spécifique pour [X] ?"
- "Quelles sont vos obligations légales concernant [X] ?"

### 5.3 Analyse de la Réponse au Creusage

**Critères :**
- Réponse correcte : élément mentionné → coche
- Réponse partielle : élément partiellement mentionné → coche partiel
- Réponse incorrecte : élément non mentionné → reste non coché
- Réponse "je ne sais pas" : élément non mentionné → lacune confirmée

### 5.4 Impact sur le Score

**Si creusage réussi :**
- Élément coché
- Score légal augmenté
- Note améliorée

**Si creusage échoué :**
- Élément reste non coché
- Score légal maintenu
- Note critique dans le debrief

---

## 6. Scoring Légal

### 6.1 Calcul du Score

**Tous éléments critiques présents :**
- Score légal : 5/5
- Note : "Maîtrise juridique confirmée"

**1 élément critique absent :**
- Score légal : 3/5
- Note : "Lacune sur [point X]. À approfondir."

**2 éléments critiques absents :**
- Score légal : 2/5
- Note : "Lacunes significatives. Formation juridique nécessaire."

**3 éléments critiques ou plus absents :**
- Score légal : 1/5
- Alerte rouge : "Connaissances juridiques insuffisantes pour ce poste. Risque opérationnel élevé."

### 6.2 Ajustement selon le Niveau

**Niveau Junior :**
- Tolérance : 1 élément critique manquant acceptable
- Score attendu minimum : 3/5

**Niveau Senior :**
- Tolérance : 0 élément critique manquant acceptable
- Score attendu minimum : 4/5

**Niveau Executive :**
- Tolérance : 0 élément critique manquant acceptable
- Score attendu minimum : 5/5

### 6.3 Intégration au Score Global

**Pondération :**
- Score légal : 20% du score global pour postes DRH/Juridique
- Score légal : 10% du score global pour postes RH Junior

**Calcul :**
Score Global = (Score Compétences × 0.8) + (Score Légal × 0.2)

---

## 7. Consignation dans le Debrief

### 7.1 Informations Consignées

Pour chaque cas légal, le debrief contient :

**Informations de base :**
- Cas type posé
- Domaine légal
- Niveau attendu

**Informations de checklist :**
- Éléments obligatoires
- Éléments cités
- Éléments manquants
- Criticité des manquants

**Informations de creusage :**
- Questions de creusage posées
- Réponses au creusage
- Résultats du creusage

**Informations de scoring :**
- Score légal
- Note explicative
- Alerte le cas échéant

### 7.2 Format de Consignation

```typescript
interface LegalDebriefEntry {
  entryId: string;
  candidateId: string;
  interviewId: string;
  
  caseType: string;
  domain: string;
  expectedLevel: string;
  
  checklist: {
    requiredElements: {
      elementId: string;
      name: string;
      criticality: 'critical' | 'significant' | 'minor';
    }[];
    citedElements: string[];
    missingElements: string[];
    missingCriticality: {
      critical: number;
      significant: number;
      minor: number;
    };
  };
  
  drilling: {
    drillingQuestions: {
      elementId: string;
      question: string;
      response: string;
      result: 'success' | 'partial' | 'failure';
    }[];
  };
  
  scoring: {
    legalScore: number;
    note: string;
    alertLevel: 'none' | 'orange' | 'red';
    adjustedScore: number;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
  };
}
```

---

## 8. Structure de Données (TypeScript)

```typescript
interface RealTimeLegalValidation {
  validationId: string;
  responseId: string;
  candidateId: string;
  interviewId: string;
  
  validatedAt: Date;
  
  step1_domainIdentification: {
    question: string;
    domain: string;
    caseType: string;
    expectedLevel: string;
    checklistId: string;
  };
  
  step2_checklistActivation: {
    checklist: {
      elementId: string;
      name: string;
      criticality: 'critical' | 'significant' | 'minor';
      mentioned: boolean;
      keywords: string[];
    }[];
  };
  
  step3_realTimeTracking: {
    response: string;
    mentionedElements: string[];
    trackingTimeline: {
      timestamp: Date;
      elementId: string;
      detected: boolean;
      confidence: number;
    }[];
  };
  
  step4_gapDetection: {
    citedElements: string[];
    missingElements: string[];
    missingCriticality: {
      critical: number;
      significant: number;
      minor: number;
    };
    provisionalScore: number;
  };
  
  step5_targetedDrilling: {
    drillingQuestions: {
      elementId: string;
      question: string;
      response: string;
      result: 'success' | 'partial' | 'failure';
      updatedChecklist: boolean;
    }[];
    finalScore: number;
  };
  
  finalScoring: {
    legalScore: number;
    note: string;
    alertLevel: 'none' | 'orange' | 'red';
    levelAdjustment: {
      junior: boolean;
      senior: boolean;
      executive: boolean;
    };
    globalImpact: {
      weight: number;
      contribution: number;
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface RealTimeValidationProtocol {
  protocolId: string;
  
  steps: {
    step1: {
      name: string;
      description: string;
      process: string[];
    };
    step2: {
      name: string;
      description: string;
      process: string[];
    };
    step3: {
      name: string;
      description: string;
      process: string[];
    };
    step4: {
      name: string;
      description: string;
      process: string[];
    };
    step5: {
      name: string;
      description: string;
      process: string[];
    };
  };
  
  detectionAlgorithm: {
    keywordIdentification: string;
    semanticAnalysis: string;
    detectionThreshold: number;
  };
  
  drillingProtocol: {
    selectionRule: string;
    priorityOrder: string[];
    maxDrillings: number;
    formulation: string;
    responseAnalysis: string;
    scoringImpact: string;
  };
  
  legalScoring: {
    allCriticalPresent: {
      score: number;
      note: string;
    };
    oneCriticalMissing: {
      score: number;
      note: string;
    };
    twoCriticalsMissing: {
      score: number;
      note: string;
    };
    threeCriticalsOrMoreMissing: {
      score: number;
      note: string;
      alertLevel: string;
    };
    levelAdjustment: {
      junior: {
        tolerance: number;
        minScore: number;
      };
      senior: {
        tolerance: number;
        minScore: number;
      };
      executive: {
        tolerance: number;
        minScore: number;
      };
    };
    globalIntegration: {
      weight: number;
      calculation: string;
    };
  };
  
  debriefConsignation: {
    format: string;
    information: string[];
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
CREATE TABLE real_time_legal_validation (
  id VARCHAR(36) PRIMARY KEY,
  response_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  validated_at TIMESTAMP NOT NULL,
  
  step1_domain_identification JSON NOT NULL,
  step2_checklist_activation JSON NOT NULL,
  step3_real_time_tracking JSON NOT NULL,
  step4_gap_detection JSON NOT NULL,
  step5_targeted_drilling JSON NOT NULL,
  final_scoring JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_real_time_validation_response ON real_time_legal_validation(response_id);
CREATE INDEX idx_real_time_validation_candidate ON real_time_legal_validation(candidate_id);
CREATE INDEX idx_real_time_validation_interview ON real_time_legal_validation(interview_id);

CREATE TABLE real_time_validation_protocol (
  id VARCHAR(36) PRIMARY KEY,
  
  steps JSON NOT NULL,
  detection_algorithm JSON NOT NULL,
  drilling_protocol JSON NOT NULL,
  legal_scoring JSON NOT NULL,
  debrief_consignation JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 10. API Endpoints

```typescript
// POST /api/legal-knowledge/validate/real-time
async function validateRealTime(responseId: string, question: string, response: string, position: string, level: string): Promise<RealTimeLegalValidation> {
  return await validateRealTime(responseId, question, response, position, level);
}

// GET /api/legal-knowledge/validation/:validationId
async function getRealTimeValidation(validationId: string): Promise<RealTimeLegalValidation> {
  return await getRealTimeValidationById(validationId);
}

// GET /api/legal-knowledge/validation/response/:responseId
async function getValidationByResponse(responseId: string): Promise<RealTimeLegalValidation> {
  return await getValidationByResponse(responseId);
}

// GET /api/legal-knowledge/validation/candidate/:candidateId
async function getValidationsByCandidate(candidateId: string): Promise<RealTimeLegalValidation[]> {
  return await getValidationsByCandidate(candidateId);
}

// GET /api/legal-knowledge/validation-protocol
async function getRealTimeValidationProtocol(): Promise<RealTimeValidationProtocol> {
  return await getRealTimeValidationProtocol();
}

// PUT /api/legal-knowledge/validation-protocol
async function updateRealTimeValidationProtocol(protocol: RealTimeValidationProtocol): Promise<RealTimeValidationProtocol> {
  return await updateRealTimeValidationProtocol(protocol);
}

// POST /api/legal-knowledge/identify-domain
async function identifyDomain(question: string): Promise<any> {
  return await identifyDomain(question);
}

// POST /api/legal-knowledge/activate-checklist
async function activateChecklist(domain: string, caseType: string): Promise<any> {
  return await activateChecklist(domain, caseType);
}

// POST /api/legal-knowledge/track-real-time
async function trackRealTime(response: string, checklist: any): Promise<any> {
  return await trackRealTime(response, checklist);
}

// POST /api/legal-knowledge/detect-gaps
async function detectGaps(checklist: any): Promise<any> {
  return await detectGaps(checklist);
}

// POST /api/legal-knowledge/drill-gaps
async function drillGaps(gaps: any, position: string, level: string): Promise<any> {
  return await drillGaps(gaps, position, level);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Précision de détection | Éléments correctement détectés / total | ≥ 90% |
- Rappel de détection | Éléments détectés / éléments présents | ≥ 85% |
- Taux de faux positifs | Faux positifs / total détections | ≤ 10% |

### 11.2 Métriques de Creusage

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de succès du creusage | Creusages réussis / total | ≥ 70% |
- Taux de correction | Lacunes corrigées après creusage / total | ≥ 60% |

### 11.3 Métriques de Scoring

| Métrique | Description | Cible |
|----------|-------------|-------|
- Distribution des scores légaux | % par score (1-5) | Variable |
- Taux d'alertes rouges | Alertes rouges / total | ≤ 15% |

---

## 12. Conclusion

Le protocole de détection des lacunes en temps réel structure le système de validation en 5 étapes. Étape 1 : identification du domaine légal et du niveau attendu. Étape 2 : activation de la checklist des éléments obligatoires. Étape 3 : suivi en temps réel pendant que le candidat répond, avec coche mental des éléments cités. Étape 4 : détection des lacunes après la réponse, avec évaluation de la criticité. Étape 5 : creusage ciblé sur les éléments critiques manquants, avec question directe et immédiate. L'algorithme de détection utilise l'identification de mots-clés et l'analyse sémantique, avec un seuil de 70% de confiance. Le scoring légal varie de 5/5 (tous éléments critiques présents) à 1/5 (3 éléments critiques ou plus absents). Le score est ajusté selon le niveau (junior, senior, executive) et intégré au score global avec pondération. Les résultats sont consignés dans le debrief.

**Points clés :**
- 5 étapes de validation en temps réel
- Étape 1 : identification du domaine et niveau
- Étape 2 : activation de la checklist
- Étape 3 : suivi en temps réel avec coche mental
- Étape 4 : détection des lacunes et criticité
- Étape 5 : creusage ciblé sur éléments critiques
- Algorithme : mots-clés + analyse sémantique, seuil 70%
- Scoring légal : 5/5 à 1/5
- Ajustement par niveau (junior, senior, executive)
- Intégration au score global avec pondération
- Consignation détaillée dans le debrief
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la validation
- Métriques de détection, creusage et scoring
