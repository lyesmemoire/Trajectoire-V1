# DOC-039-05 : Protocole de Test — Validation des Techniques de Démasquage

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour MVP-039 Benevolent Unmasking Engine. Ce document structure la méthodologie pour valider que les techniques de démasquage fonctionnent en simulation, incluant le panel de candidats testeurs, les scénarios de test, les critères d'évaluation, et le protocole d'analyse.

---

## 2. Principe Fondateur

Les techniques de démasquage doivent être validées avant déploiement en production. Le protocole de test utilise un panel de candidats testeurs qui simulent des entretiens avec et sans masque. Les techniques sont appliquées et leur efficacité est évaluée selon des critères précis. Le protocole garantit que les techniques sont bienveillantes, efficaces, et ne créent pas de malaise excessif.

---

## 3. Panel de Candidats Testeurs

### 3.1 Composition du Panel

**Taille du panel :**
- 20-30 candidats testeurs
- Diversité de profils
- Représentativité des candidats réels

**Profils :**
- 40% juniors (0-3 ans d'expérience)
- 40% seniors (10+ ans d'expérience)
- 20% intermédiaires (3-10 ans d'expérience)

**Secteurs :**
- 30% tech
- 30% business
- 20% créatif
- 20% autre

### 3.2 Recrutement des Testeurs

**Critères de sélection :**
- Expérience d'entretien
- Disponibilité pour les tests
- Consentement explicite
- Capacité à donner du feedback

**Processus de recrutement :**
- Invitation par email
- Explication du protocole
- Consentement RGPD
- Compensation possible

### 3.3 Instructions aux Testeurs

**Instructions :**
- Simuler un entretien réel
- Être authentique ou préparé selon le scénario
- Donner du feedback honnête
- Respecter le temps imparti

**Scénarios :**
- Scénario A : Candidat authentique (pas de masque)
- Scénario B : Candidat avec préparation standard (masque léger)
- Scénario C : Candidat avec sur-préparation (masque modéré)
- Scénario D : Candidat avec masque épais (réponses entièrement préparées)

---

## 4. Scénarios de Test

### 4.1 Scénario A — Candidat Authentique

**Description :**
Candidat authentique, naturel, et spontané. Pas de masque ou masque très minime.

**Instructions au testeur :**
- Être vous-même
- Répondre spontanément
- Ne pas préparer les réponses
- Être honnête

**Questions standard :**
- "Parlez-moi de votre parcours."
- "Quelles sont vos motivations ?"
- "Décrivez un projet complexe."

**Techniques testées :**
- Aucune technique nécessaire
- Vérifier que le moteur détecte le niveau Transparent

**Résultat attendu :**
- Niveau de masque : Transparent
- Aucune technique nécessaire
- Évaluation authentique

### 4.2 Scénario B — Candidat avec Préparation Standard

**Description :**
Candidat avec une préparation standard d'entretien. Masque léger mais visible.

**Instructions au testeur :**
- Préparer les réponses standard
- Utiliser un vocabulaire de coaching
- Être légèrement structuré
- Ne pas être trop parfait

**Questions standard :**
- "Parlez-moi de vos points forts."
- "Quelles sont vos faiblesses ?"
- "Pourquoi ce poste ?"

**Techniques testées :**
- 1 question inattendue
- 1 détail concret

**Résultat attendu :**
- Niveau de masque : Léger
- Réduction du masque après techniques
- Révélation partielle de l'authenticité

### 4.3 Scénario C — Candidat avec Sur-préparation

**Description :**
Candidat avec une sur-préparation notable. Masque modéré qui affecte la qualité de l'évaluation.

**Instructions au testeur :**
- Préparer des réponses très structurées
- Utiliser beaucoup de vocabulaire de coaching
- Être très fluide et parfait
- Donner des exemples qui sonnent préparés

**Questions standard :**
- "Décrivez votre style de leadership."
- "Comment gérez-vous les conflits ?"
- "Parlez-moi d'un succès."

**Techniques testées :**
- 2 questions inattendues
- 2 détails concrets
- 1 recadrage temporel

**Résultat attendu :**
- Niveau de masque : Modéré
- Réduction significative du masque après techniques
- Révélation notable de l'authenticité

### 4.4 Scénario D — Candidat avec Masque Épais

**Description :**
Candidat avec un masque quasi-total. Réponses entièrement préparées.

**Instructions au testeur :**
- Préparer toutes les réponses
- Utiliser exclusivement du vocabulaire de coaching
- Être parfaitement fluide
- Donner des exemples qui sonnent comme des scripts

**Questions standard :**
- "Présentez-vous."
- "Pourquoi vous ?"
- "Où vous voyez-vous dans 5 ans ?"

**Techniques testées :**
- 3 questions inattendues
- 3 détails concrets
- 2 recadrages temporels
- 1 humour bienveillant
- 1 concession personnelle
- 1 silence prolongé

**Résultat attendu :**
- Niveau de masque : Épais
- Réduction forte du masque après techniques
- Révélation significative de l'authenticité

---

## 5. Critères d'Évaluation

### 5.1 Critères de Détection du Masque

**Précision de la détection :**
- Niveau détecté = niveau réel
- Score de masque cohérent avec le scénario
- Signaux identifiés correctement

**Cible :**
- Précision ≥ 90%
- Score de masque dans la plage attendue
- Signaux identifiés avec précision ≥ 85%

### 5.2 Critères d'Efficacité des Techniques

**Taux de réduction du masque :**
- Réduction du niveau de masque après techniques
- Passage d'un niveau supérieur à un niveau inférieur

**Cible :**
- Scénario B : Réduction ≥ 50%
- Scénario C : Réduction ≥ 70%
- Scénario D : Réduction ≥ 80%

### 5.3 Critères de Bienveillance

**Confort du candidat :**
- Note de confort (1-5)
- Absence de malaise excessif
- Expérience positive

**Cible :**
- Note de confort ≥ 4.0/5
- Malaise excessif ≤ 10%
- Expérience positive ≥ 80%

### 5.4 Critères d'Authenticité

**Authenticité perçue :**
- Note d'authenticité (1-5)
- Révélation de la vraie personnalité
- Réponses spontanées

**Cible :**
- Note d'authenticité ≥ 4.0/5
- Révélation ≥ 70%
- Réponses spontanées ≥ 80%

---

## 6. Protocole d'Exécution

### 6.1 Préparation

**Avant le test :**
- Configurer le moteur avec les techniques
- Préparer les scénarios
- Former les recruteurs testeurs
- Préparer les questionnaires de feedback

**Configuration du moteur :**
- Activer la détection du masque
- Activer les techniques de démasquage
- Configurer les personas
- Activer le logging détaillé

### 6.2 Exécution du Test

**Pour chaque testeur :**
1. Accueil et explication du protocole
2. Assignation du scénario (A, B, C, ou D)
3. Exécution de l'entretien simulé
4. Application des techniques selon le scénario
5. Collecte des données du moteur
6. Questionnaire de feedback du testeur

**Durée :**
- 30-45 minutes par testeur
- 5 minutes d'accueil
- 20-30 minutes d'entretien
- 10 minutes de feedback

### 6.3 Collecte des Données

**Données du moteur :**
- Niveau de masque détecté
- Score de masque
- Signaux identifiés
- Techniques appliquées
- Réduction du masque

**Données du testeur :**
- Feedback sur le confort
- Feedback sur l'authenticité
- Feedback sur les techniques
- Suggestions d'amélioration

**Données du recruteur :**
- Perception du masque
- Efficacité des techniques
- Difficultés rencontrées
- Suggestions d'amélioration

---

## 7. Questionnaire de Feedback

### 7.1 Feedback du Testeur

**Questions :**
1. Comment avez-vous trouvé l'entretien ? (1-5)
2. Avez-vous ressenti du malaise ? (Oui/Non)
3. Les techniques vous ont-elles semblé bienveillantes ? (1-5)
4. Avez-vous ressenti une pression excessive ? (Oui/Non)
5. Les questions inattendues étaient-elles appropriées ? (1-5)
6. Le silence prolongé était-il confortable ? (1-5)
7. Avez-vous ressenti que vous pouviez être authentique ? (1-5)
8. Suggestions d'amélioration ?

### 7.2 Feedback du Recruteur

**Questions :**
1. Le niveau de masque détecté était-il correct ? (Oui/Non)
2. Les techniques étaient-elles faciles à appliquer ? (1-5)
3. Les techniques étaient-elles efficaces ? (1-5)
4. Le candidat a-t-il révélé son authenticité ? (1-5)
5. Y a-t-il eu des moments malaisants ? (Oui/Non)
6. Les techniques étaient-elles bienveillantes ? (1-5)
7. Suggestions d'amélioration ?

---

## 8. Protocole d'Analyse

### 8.1 Analyse des Données

**Analyse quantitative :**
- Calculer la précision de la détection
- Calculer le taux de réduction du masque
- Calculer les notes moyennes de confort et d'authenticité
- Comparer les scénarios

**Analyse qualitative :**
- Analyser les feedbacks des testeurs
- Analyser les feedbacks des recruteurs
- Identifier les patterns
- Identifier les points d'amélioration

### 8.2 Critères de Succès

**Critères globaux :**
- Précision de la détection ≥ 90%
- Taux de réduction du masque ≥ 70%
- Confort du candidat ≥ 4.0/5
- Authenticité perçue ≥ 4.0/5

**Critères par scénario :**
- Scénario A : Détection Transparent ≥ 95%
- Scénario B : Réduction ≥ 50%
- Scénario C : Réduction ≥ 70%
- Scénario D : Réduction ≥ 80%

### 8.3 Rapport de Test

**Contenu du rapport :**
- Résumé exécutif
- Méthodologie
- Résultats quantitatifs
- Résultats qualitatifs
- Analyse par scénario
- Recommandations
- Plan d'action

---

## 9. Itérations et Améliorations

### 9.1 Itérations

**Si critères non atteints :**
- Identifier les causes
- Ajuster les techniques
- Ajuster les paramètres du moteur
- Relancer les tests

**Nombre d'itérations :**
- Maximum 3 itérations
- Chaque itération : 10-15 testeurs
- Focus sur les scénarios problématiques

### 9.2 Améliorations

**Améliorations possibles :**
- Ajuster les seuils de détection
- Ajuster la durée du silence
- Ajuster le ton des techniques
- Ajuster la fréquence des techniques
- Ajouter de nouvelles techniques

**Validation des améliorations :**
- Nouveau cycle de test
- Comparaison avec les résultats précédents
- Validation des critères de succès

---

## 10. Structure de Données (TypeScript)

```typescript
interface UnmaskingTest {
  testId: string;
  testerId: string;
  recruiterId: string;
  
  scenario: 'A' | 'B' | 'C' | 'D';
  
  execution: {
    startTime: Date;
    endTime: Date;
    duration: number;
  };
  
  engineData: {
    initialMaskLevel: string;
    initialMaskScore: number;
    finalMaskLevel: string;
    finalMaskScore: number;
    signalsDetected: string[];
    techniquesApplied: string[];
    maskReduction: number;
  };
  
  testerFeedback: {
    comfortRating: number;
    discomfort: boolean;
    benevolenceRating: number;
    excessivePressure: boolean;
    unexpectedQuestionsRating: number;
    prolongedSilenceRating: number;
    authenticityRating: number;
    suggestions: string;
  };
  
  recruiterFeedback: {
    detectionCorrect: boolean;
    techniquesEasyToApply: number;
    techniquesEffective: number;
    authenticityRevealed: number;
    awkwardMoments: boolean;
    techniquesBenevolent: number;
    suggestions: string;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface UnmaskingTestProtocol {
  protocolId: string;
  
  testerPanel: {
    size: number;
    profiles: {
      junior: number;
      senior: number;
      intermediate: number;
    };
    sectors: {
      tech: number;
      business: number;
      creative: number;
      other: number;
    };
  };
  
  scenarios: {
    scenarioA: {
      description: string;
      instructions: string[];
      questions: string[];
      techniques: string[];
      expectedResult: string;
    };
    scenarioB: {
      description: string;
      instructions: string[];
      questions: string[];
      techniques: string[];
      expectedResult: string;
    };
    scenarioC: {
      description: string;
      instructions: string[];
      questions: string[];
      techniques: string[];
      expectedResult: string;
    };
    scenarioD: {
      description: string;
      instructions: string[];
      questions: string[];
      techniques: string[];
      expectedResult: string;
    };
  };
  
  evaluationCriteria: {
    detection: {
      precision: number;
      scoreRange: boolean;
      signalsPrecision: number;
    };
    effectiveness: {
      scenarioB: number;
      scenarioC: number;
      scenarioD: number;
    };
    benevolence: {
      comfortRating: number;
      excessiveDiscomfort: number;
      positiveExperience: number;
    };
    authenticity: {
      authenticityRating: number;
      revelation: number;
      spontaneousResponses: number;
    };
  };
  
  executionProtocol: {
    preparation: string[];
    execution: string[];
    dataCollection: string[];
  };
  
  feedbackQuestionnaire: {
    tester: string[];
    recruiter: string[];
  };
  
  analysisProtocol: {
    quantitative: string[];
    qualitative: string[];
  };
  
  successCriteria: {
    global: {
      detectionPrecision: number;
      maskReduction: number;
      candidateComfort: number;
      perceivedAuthenticity: number;
    };
    scenario: {
      scenarioA: number;
      scenarioB: number;
      scenarioC: number;
      scenarioD: number;
    };
  };
  
  iterations: {
    maxIterations: number;
    testersPerIteration: number;
    focusOnProblematicScenarios: boolean;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 11. Stockage et Gestion

### 11.1 Schéma SQL

```sql
CREATE TABLE unmasking_test (
  id VARCHAR(36) PRIMARY KEY,
  tester_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  
  scenario VARCHAR(1) NOT NULL,
  
  execution JSON NOT NULL,
  engine_data JSON NOT NULL,
  tester_feedback JSON NOT NULL,
  recruiter_feedback JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_unmasking_test_tester ON unmasking_test(tester_id);
CREATE INDEX idx_unmasking_test_recruiter ON unmasking_test(recruiter_id);
CREATE INDEX idx_unmasking_test_scenario ON unmasking_test(scenario);

CREATE TABLE unmasking_test_protocol (
  id VARCHAR(36) PRIMARY KEY,
  
  tester_panel JSON NOT NULL,
  scenarios JSON NOT NULL,
  evaluation_criteria JSON NOT NULL,
  execution_protocol JSON NOT NULL,
  feedback_questionnaire JSON NOT NULL,
  analysis_protocol JSON NOT NULL,
  success_criteria JSON NOT NULL,
  iterations JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 12. API Endpoints

```typescript
// POST /api/benevolent-unmasking/test/start
async function startUnmaskingTest(testerId: string, recruiterId: string, scenario: string): Promise<UnmaskingTest> {
  return await startUnmaskingTest(testerId, recruiterId, scenario);
}

// GET /api/benevolent-unmasking/test/:testId
async function getUnmaskingTest(testId: string): Promise<UnmaskingTest> {
  return await getUnmaskingTestById(testId);
}

// POST /api/benevolent-unmasking/test/:testId/complete
async function completeUnmaskingTest(testId: string, testerFeedback: any, recruiterFeedback: any): Promise<UnmaskingTest> {
  return await completeUnmaskingTest(testId, testerFeedback, recruiterFeedback);
}

// GET /api/benevolent-unmasking/test/scenario/:scenario
async function getTestsByScenario(scenario: string): Promise<UnmaskingTest[]> {
  return await getTestsByScenario(scenario);
}

// POST /api/benevolent-unmasking/test/analyze
async function analyzeUnmaskingTests(): Promise<any> {
  return await analyzeUnmaskingTests();
}

// GET /api/benevolent-unmasking/test-protocol
async function getUnmaskingTestProtocol(): Promise<UnmaskingTestProtocol> {
  return await getUnmaskingTestProtocol();
}

// PUT /api/benevolent-unmasking/test-protocol
async function updateUnmaskingTestProtocol(protocol: UnmaskingTestProtocol): Promise<UnmaskingTestProtocol> {
  return await updateUnmaskingTestProtocol(protocol);
}
```

---

## 13. Indicateurs de Suivi

### 13.1 Métriques de Test

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Tests complétés / tests démarrés | 100% |
- Distribution des scénarios | Scénario A / B / C / D | Équilibrée |
- Durée moyenne des tests | Durée moyenne | 30-45 minutes |

### 13.2 Métriques de Succès

| Métrique | Description | Cible |
|----------|-------------|-------|
- Précision de la détection | Détections correctes / total | ≥ 90% |
- Taux de réduction du masque | Réductions /技术应用 | ≥ 70% |
- Confort du candidat | Note moyenne de confort | ≥ 4.0/5 |
- Authenticité perçue | Note moyenne d'authenticité | ≥ 4.0/5 |

---

## 14. Conclusion

Le protocole de test valide que les techniques de démasquage fonctionnent en simulation. Le panel de 20-30 candidats testeurs simule 4 scénarios (authentique, préparation standard, sur-préparation, masque épais). Les techniques sont appliquées selon le scénario et leur efficacité est évaluée selon des critères précis (précision de détection, taux de réduction, confort, authenticité). Le protocole garantit que les techniques sont bienveillantes, efficaces, et ne créent pas de malaise excessif.

**Points clés :**
- Panel de 20-30 candidats testeurs diversifiés
- 4 scénarios (A : authentique, B : préparation standard, C : sur-préparation, D : masque épais)
- Techniques testées selon le scénario (question inattendue, détail concret, recadrage, humour, concession, silence)
- Critères d'évaluation (précision, efficacité, bienveillance, authenticité)
- Protocole d'exécution (préparation, exécution, collecte de données)
- Questionnaire de feedback (testeur et recruteur)
- Protocole d'analyse (quantitative et qualitative)
- Critères de succès (précision ≥ 90%, réduction ≥ 70%, confort ≥ 4.0/5, authenticité ≥ 4.0/5)
- Itérations et améliorations (maximum 3 itérations)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de test et de succès
