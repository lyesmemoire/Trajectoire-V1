# DOC-034-09 : Protocole de Test (10 Entretiens Simulés Complets)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour MVP-034 Interview Orchestrator. Ce protocole structure 10 entretiens simulés complets de A à Z pour valider l'orchestration complète, incluant la génération de plans, les briefings, les tableaux de bord, les transitions, et les synthèses.

---

## 2. Principe Fondateur

Le protocole de test doit couvrir tous les types d'entretiens, tous les niveaux de candidats, et tous les scénarios possibles. Chaque entretien simulé est complet de A à Z : ingestion des documents, génération du plan, briefing, orchestration des 6 actes, tableaux de bord, et synthèse finale.

---

## 3. Scénarios de Test

### 3.1 Scénario 1 — Entretien RH Standard (Junior)

**Candidat :** Sophie Martin, 24 ans, Junior Developer

**Poste :** Junior Software Engineer

**Type d'entretien :** RH Standard (45 minutes)

**Intervenant :** RH

**Documents fournis :**
- CV : Formation en informatique, 1 stage, 1 projet personnel
- Fiche de poste : Junior Software Engineer, stack Python/JavaScript
- Annonce : Poste junior, formation possible

**Objectifs du test :**
- Valider la génération du plan d'entretien
- Valider le briefing recruteur
- Valider l'orchestration des 6 actes
- Valider les tableaux de bord par acte
- Valider la synthèse finale

**Résultats attendus :**
- Plan d'entretien généré en ≤ 30 secondes
- Briefing recruteur généré en ≤ 10 secondes
- Transitions automatiques fonctionnelles
- Tableaux de bord mis à jour en temps réel
- Synthèse finale générée en ≤ 60 secondes

---

### 3.2 Scénario 2 — Entretien Technique (Senior)

**Candidat :** Pierre Durand, 35 ans, Senior Developer

**Poste :** Senior Software Engineer

**Type d'entretien :** Technique (90 minutes)

**Intervenant :** Expert Technique

**Documents fournis :**
- CV : 10 ans d'expérience, 5 entreprises, stack complète
- Fiche de poste : Senior Software Engineer, leadership technique
- Annonce : Poste senior, expertise requise

**Objectifs du test :**
- Valider l'orchestration d'un entretien technique
- Valider l'Acte 2 centré sur les compétences techniques
- Valider l'Acte 4 avec cas pratique
- Valider la grille technique spécifique

**Résultats attendus :**
- Questions techniques ciblées générées
- Cas pratique approprié généré
- Grille d'évaluation technique fonctionnelle
- Synthèse technique précise

---

### 3.3 Scénario 3 — Entretien Direction (C-Level)

**Candidat :** Marie Bernard, 45 ans, CTO

**Poste :** CTO

**Type d'entretien :** Direction (120 minutes)

**Intervenant :** DG

**Documents fournis :**
- CV : 20 ans d'expérience, 3 startups, 1 exit
- Fiche de poste : CTO, vision stratégique
- Annonce : Poste C-Level, transformation digitale

**Objectifs du test :**
- Valider l'orchestration d'un entretien C-Level
- Valider le focus sur la vision stratégique
- Valider les questions sur la gestion des crises
- Valider l'évaluation du leadership transformationnel

**Résultats attendus :**
- Questions stratégiques générées
- Questions sur la gestion des crises appropriées
- Évaluation du leadership fonctionnelle
- Synthèse stratégique précise

---

### 3.4 Scénario 4 — Entretien Panel (Multi-Intervenants)

**Candidat :** Jean Dupont, 30 ans, Product Manager

**Poste :** Senior Product Manager

**Type d'entretien :** Panel (90 minutes)

**Intervenants :** RH + Manager + Expert

**Documents fournis :**
- CV : 8 ans d'expérience, mix produit/tech
- Fiche de poste : Senior Product Manager, leadership produit
- Annonce : Poste senior, vision produit

**Objectifs du test :**
- Valider la coordination des intervenants
- Valider la répartition des questions
- Valider l'évitement des redondances
- Valider la synthèse multi-intervenants

**Résultats attendus :**
- Briefings individualisés générés
- Répartition des questions fonctionnelle
- Aucune redondance détectée
- Synthèse multi-intervenants cohérente

---

### 3.5 Scénario 5 — Entretien de Cas / Assessment

**Candidat :** Claire Martin, 32 ans, Data Scientist

**Poste :** Senior Data Scientist

**Type d'entretien :** Cas (180 minutes)

**Intervenants :** Manager + Expert

**Documents fournis :**
- CV : 7 ans d'expérience, PhD en data science
- Fiche de poste : Senior Data Scientist, cas business
- Annonce : Poste senior, cas pratique

**Objectifs du test :**
- Valider l'orchestration d'un entretien de cas
- Valider la génération du cas business
- Valider l'évaluation du raisonnement
- Valider la structure de pensée

**Résultats attendus :**
- Cas business réaliste généré
- Questions sur le raisonnement appropriées
- Évaluation de la structure de pensée fonctionnelle
- Synthèse du cas précise

---

### 3.6 Scénario 6 — Entretien Multi-Rounds (Round 1 → Round 2)

**Candidat :** Thomas Durand, 28 ans, DevOps Engineer

**Poste :** Senior DevOps Engineer

**Type d'entretien :** Multi-Rounds (Round 1 RH, Round 2 Technique)

**Intervenants :** Round 1 RH, Round 2 Expert

**Documents fournis :**
- CV : 6 ans d'expérience, spécialisation DevOps
- Fiche de poste : Senior DevOps Engineer, cloud
- Annonce : Poste senior, expertise cloud

**Objectifs du test :**
- Valider la préparation automatique du Round 2
- Valider l'analyse inter-rounds
- Valider la cohérence des réponses
- Valider l'évolution du candidat

**Résultats attendus :**
- Préparation Round 2 basée sur Round 1
- Analyse inter-rounds cohérente
- Cohérence des réponses détectée
- Évolution du candidat identifiée

---

### 3.7 Scénario 7 — Entretien avec Candidat Stressé

**Candidat :** Julie Bernard, 26 ans, Junior Developer

**Poste :** Junior Software Engineer

**Type d'entretien :** RH Standard (45 minutes)

**Intervenant :** RH

**Documents fournis :**
- CV : Formation en informatique, peu d'expérience
- Fiche de poste : Junior Software Engineer
- Annonce : Poste junior

**Profil simulé :** Candidat très stressé, communication hésitante

**Objectifs du test :**
- Valider l'adaptation du moteur au niveau d'aise
- Valider les alertes automatiques
- Valider les recommandations d'adaptation
- Valider la gestion du stress

**Résultats attendus :**
- Alerte sur niveau de stress générée
- Recommandation de réduction du challenge
- Adaptation des questions fonctionnelle
- Gestion du stress appropriée

---

### 3.8 Scénario 8 — Entretien avec Candidat Très à l'Aise

**Candidat :** Alexandre Martin, 40 ans, Architecte Logiciel

**Poste :** Software Architect

**Type d'entretien :** Technique (90 minutes)

**Intervenant :** Expert

**Documents fournis :**
- CV : 15 ans d'expérience, expertise architecture
- Fiche de poste : Software Architect, vision système
- Annonce : Poste senior, expertise architecture

**Profil simulé :** Candidat très à l'aise, communication fluide

**Objectifs du test :**
- Valider l'augmentation du niveau de challenge
- Valider l'adaptation des questions
- Valider l'exploration des zones d'ombre
- Valider le test de résilience

**Résultats attendus :**
- Augmentation du challenge fonctionnelle
- Questions plus difficiles générées
- Zones d'ombre explorées
- Résilience testée

---

### 3.9 Scénario 9 — Entretien avec Incohérences

**Candidat :** Nicolas Dupont, 33 ans, Full Stack Developer

**Poste :** Senior Full Stack Developer

**Type d'entretien :** RH Standard (60 minutes)

**Intervenant :** RH

**Documents fournis :**
- CV : Parcours atypique, transitions fréquentes
- Fiche de poste : Senior Full Stack Developer
- Annonce : Poste senior

**Profil simulé :** Candidat avec incohérences dans les réponses

**Objectifs du test :**
- Valider la détection des incohérences
- Valider les alertes automatiques
- Valider les questions de clarification
- Valider l'analyse des incohérences

**Résultats attendus :**
- Incohérences détectées
- Alertes automatiques générées
- Questions de clarification appropriées
- Analyse des incohérences précise

---

### 3.10 Scénario 10 — Entretien de Référencement

**Candidat :** Laure Durand, 29 ans, UX Designer

**Poste :** Senior UX Designer

**Type d'entretien :** Référencement (30 minutes)

**Intervenant :** RH

**Documents fournis :**
- CV : 7 ans d'expérience, portfolio solide
- Fiche de poste : Senior UX Designer
- Références : 2 anciens managers

**Objectifs du test :**
- Valider le protocole de prise de références
- Valider les questions ciblées
- Valider l'analyse de cohérence
- Valider la validation par les pairs

**Résultats attendus :**
- Questions de référencement appropriées
- Analyse de cohérence fonctionnelle
- Validation par les pairs précise
- Synthèse de référencement complète

---

## 4. Protocole d'Exécution

### 4.1 Préparation

**Pour chaque scénario :**

1. **Préparer les documents :**
   - CV du candidat
   - Fiche de poste
   - Annonce
   - Autres documents pertinents

2. **Configurer le moteur :**
   - Type d'entretien
   - Intervenant(s)
   - Durée
   - Paramètres spécifiques

3. **Lancer l'orchestration :**
   - Ingestion des documents
   - Génération du plan
   - Génération du briefing

### 4.2 Exécution

**Pour chaque scénario :**

1. **Acte 0 — Pré-entretien :**
   - Vérifier l'ingestion des documents
   - Vérifier l'analyse du candidat
   - Vérifier la génération du plan
   - Vérifier la génération du briefing

2. **Acte 1 — Ouverture :**
   - Vérifier le tableau de bord Acte 1
   - Vérifier les métriques en temps réel
   - Vérifier les alertes automatiques
   - Vérifier la transition vers Acte 2

3. **Acte 2 — Exploration :**
   - Vérifier le tableau de bord Acte 2
   - Vérifier les questions générées
   - Vérifier les cotations en temps réel
   - Vérifier la transition vers Acte 3

4. **Acte 3 — Approfondissement :**
   - Vérifier le tableau de bord Acte 3
   - Vérifier les questions de soft skills
   - Vérifier les questions de motivations
   - Vérifier la transition vers Acte 4

5. **Acte 4 — Challenge :**
   - Vérifier le tableau de bord Acte 4
   - Vérifier les questions difficiles
   - Vérifier la calibration du challenge
   - Vérifier la transition vers Acte 5

6. **Acte 5 — Clôture :**
   - Vérifier le tableau de bord Acte 5
   - Vérifier l'analyse des questions du candidat
   - Vérifier la note immédiate
   - Vérifier la transition vers Acte 6

7. **Acte 6 — Post-entretien :**
   - Vérifier le tableau de bord Acte 6
   - Vérifier la génération du debrief
   - Vérifier la comparaison impression / analyse
   - Vérifier la recommandation finale

### 4.3 Validation

**Pour chaque scénario :**

1. **Valider les livrables :**
   - Plan d'entretien
   - Briefing recruteur
   - Tableaux de bord par acte
   - Synthèse finale

2. **Valider les métriques :**
   - Temps de génération
   - Qualité des questions
   - Pertinence des recommandations
   - Cohérence de la synthèse

3. **Valider l'expérience utilisateur :**
   - Fluidité de l'orchestration
   - Clarté des tableaux de bord
   - Pertinence des alertes
   - Utilité des recommandations

---

## 5. Critères de Succès

### 5.1 Critères Techniques

| Critère | Description | Cible |
|----------|-------------|-------|
| Temps de génération plan | Secondes pour générer le plan | ≤ 30 secondes |
- Temps de génération briefing | Secondes pour générer le briefing | ≤ 10 secondes |
- Temps de génération synthèse | Secondes pour générer la synthèse | ≤ 60 secondes |
- Transitions automatiques | Transitions auto / total | ≥ 80% |
- Mises à jour temps réel | Mises à jour par minute | ≥ 1/min |

### 5.2 Critères de Qualité

| Critère | Description | Cible |
|----------|-------------|-------|
- Pertinence des questions | Questions pertinentes / total | ≥ 90% |
- Pertinence des recommandations | Recommandations pertinentes / total | ≥ 85% |
- Cohérence de la synthèse | Synthèses cohérentes / total | ≥ 90% |
- Satisfaction testeurs | Note moyenne | ≥ 4.5/5 |

### 5.3 Critères Fonctionnels

| Critère | Description | Cible |
|----------|-------------|-------|
- Couverture des types d'entretien | Types testés / total | 100% (8/8) |
- Couverture des niveaux | Niveaux testés / total | 100% (3/3) |
- Couverture des scénarios | Scénarios testés / total | 100% (10/10) |
- Bugs critiques | Bugs critiques détectés | 0 |

---

## 6. Rapport de Test

### 6.1 Structure du Rapport

```
┌─────────────────────────────────────────────────────────────┐
│ RAPPORT DE TEST - MVP-034 INTERVIEW ORCHESTRATOR          │
│ Date du test : [Date]                                     │
│ Testeurs : [Liste]                                        │
│ Scénarios testés : 10/10                                  │
├─────────────────────────────────────────────────────────────┤
│ RÉSUMÉ EXÉCUTIF                                           │
│ Statut global : [Succès / Échec partiel / Échec]          │
│ Critères techniques : [X/Y]                               │
│ Critères de qualité : [X/Y]                               │
│ Critères fonctionnels : [X/Y]                             │
├─────────────────────────────────────────────────────────────┤
│ RÉSULTATS PAR SCÉNARIO                                    │
│ Scénario 1 : [Succès / Échec] — [Commentaire]             │
│ Scénario 2 : [Succès / Échec] — [Commentaire]             │
│ ...                                                        │
│ Scénario 10 : [Succès / Échec] — [Commentaire]            │
├─────────────────────────────────────────────────────────────┤
│ BUGS DÉTECTÉS                                              │
│ Critiques : [Liste]                                       │
│ Majeurs : [Liste]                                         │
│ Mineurs : [Liste]                                         │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATIONS                                            │
• [Recommandation 1]                                       │
• [Recommandation 2]                                       │
• [Recommandation 3]                                       │
├─────────────────────────────────────────────────────────────┤
│ DÉCISION FINALE                                            │
│ [Prêt pour déploiement / Corrections nécessaires /          │
│  Refus de déploiement]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface TestScenario {
  scenarioId: string;
  scenarioNumber: number;
  scenarioName: string;
  
  candidate: {
    name: string;
    age: number;
    profile: string;
  };
  
  job: {
    title: string;
    description: string;
  };
  
  interviewType: string;
  interviewer: string;
  duration: number;
  
  documents: {
    cv: string;
    jobDescription: string;
    jobPosting: string;
    otherDocuments?: string[];
  };
  
  objectives: string[];
  expectedResults: string[];
  
  simulatedProfile?: {
    comfortLevel?: 'very_comfortable' | 'standard' | 'stressed' | 'very_stressed';
    communicationStyle?: 'direct' | 'reserved' | 'expansive' | 'precise';
    inconsistencies?: boolean;
  };
  
  execution: {
    act0: {
      status: 'passed' | 'failed' | 'partial';
      notes: string;
    };
    act1: {
      status: 'passed' | 'failed' | 'partial';
      notes: string;
    };
    act2: {
      status: 'passed' | 'failed' | 'partial';
      notes: string;
    };
    act3: {
      status: 'passed' | 'failed' | 'partial';
      notes: string;
    };
    act4: {
      status: 'passed' | 'failed' | 'partial';
      notes: string;
    };
    act5: {
      status: 'passed' | 'failed' | 'partial';
      notes: string;
    };
    act6: {
      status: 'passed' | 'failed' | 'partial';
      notes: string;
    };
  };
  
  validation: {
    deliverables: {
      interviewPlan: 'passed' | 'failed';
      recruiterBriefing: 'passed' | 'failed';
      actDashboards: 'passed' | 'failed';
      finalSynthesis: 'passed' | 'failed';
    };
    metrics: {
      planGenerationTime: number;
      briefingGenerationTime: number;
      synthesisGenerationTime: number;
      automaticTransitions: number;
      realTimeUpdates: number;
    };
    userExperience: {
      orchestrationFluidity: number;
      dashboardClarity: number;
      alertRelevance: number;
      recommendationUsefulness: number;
    };
  };
  
  overallStatus: 'passed' | 'failed' | 'partial';
  notes: string;
  
  metadata: {
    executedAt: Date;
    executedBy: string;
    version: string;
  };
}

interface TestReport {
  reportId: string;
  
  header: {
    testDate: Date;
    testers: string[];
    scenariosTested: number;
    scenariosTotal: number;
  };
  
  executiveSummary: {
    globalStatus: 'success' | 'partial_failure' | 'failure';
    technicalCriteria: string;
    qualityCriteria: string;
    functionalCriteria: string;
  };
  
  scenarioResults: {
    scenarioNumber: number;
    scenarioName: string;
    status: 'passed' | 'failed';
    comment: string;
  }[];
  
  bugsDetected: {
    critical: string[];
    major: string[];
    minor: string[];
  };
  
  recommendations: string[];
  
  finalDecision: 'ready_for_deployment' | 'corrections_needed' | 'deployment_refused';
  
  metadata: {
    generatedAt: Date;
    generatedBy: string;
    version: string;
  };
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE test_scenario (
  id VARCHAR(36) PRIMARY KEY,
  scenario_number INT NOT NULL,
  scenario_name VARCHAR(255) NOT NULL,
  
  candidate JSON NOT NULL,
  job JSON NOT NULL,
  interview_type VARCHAR(50) NOT NULL,
  interviewer VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  
  documents JSON NOT NULL,
  objectives JSON NOT NULL,
  expected_results JSON NOT NULL,
  simulated_profile JSON,
  
  execution JSON NOT NULL,
  validation JSON NOT NULL,
  
  overall_status VARCHAR(20) NOT NULL,
  notes TEXT NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_scenario_number ON test_scenario(scenario_number);
CREATE INDEX idx_test_scenario_status ON test_scenario(overall_status);

CREATE TABLE test_report (
  id VARCHAR(36) PRIMARY KEY,
  
  header JSON NOT NULL,
  executive_summary JSON NOT NULL,
  scenario_results JSON NOT NULL,
  bugs_detected JSON NOT NULL,
  recommendations JSON NOT NULL,
  final_decision VARCHAR(50) NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. API Endpoints

```typescript
// POST /api/test/scenario/create
async function createTestScenario(scenario: TestScenario): Promise<TestScenario> {
  return await createTestScenario(scenario);
}

// GET /api/test/scenario/:scenarioId
async function getTestScenario(scenarioId: string): Promise<TestScenario> {
  return await getTestScenarioById(scenarioId);
}

// POST /api/test/scenario/:scenarioId/execute
async function executeTestScenario(scenarioId: string): Promise<TestScenario> {
  return await executeTestScenario(scenarioId);
}

// POST /api/test/scenario/:scenarioId/validate
async function validateTestScenario(scenarioId: string, validation: any): Promise<TestScenario> {
  return await validateTestScenario(scenarioId, validation);
}

// POST /api/test/report/generate
async function generateTestReport(scenarioIds: string[]): Promise<TestReport> {
  return await generateTestReport(scenarioIds);
}

// GET /api/test/report/:reportId
async function getTestReport(reportId: string): Promise<TestReport> {
  return await getTestReportById(reportId);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Test

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de succès des scénarios | Scénarios réussis / total | ≥ 90% |
- Taux de bugs critiques | Bugs critiques / total | 0 |
- Temps moyen d'exécution | Minutes par scénario | ≤ 30 minutes |

### 10.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Satisfaction testeurs | Note moyenne | ≥ 4.5/5 |
- Couverture fonctionnelle | Fonctionnalités testées / total | 100% |
- Stabilité du système | Crashes / total | 0 |

---

## 11. Conclusion

Le protocole de test structure 10 entretiens simulés complets de A à Z pour valider l'orchestration complète de MVP-034 Interview Orchestrator. Chaque scénario couvre un type d'entretien, un niveau de candidat, et un scénario spécifique. Le protocole inclut la préparation, l'exécution, la validation, et le rapport de test.

**Points clés :**
- 10 scénarios de test complets
- Couverture de tous les types d'entretiens
- Couverture de tous les niveaux de candidats
- Protocole d'exécution détaillé
- Critères de succès définis
- Structure de rapport de test
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de test et de qualité
