# DOC-031-07 : Protocole de Test (20 Scénarios Éthiques Complexes)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour MVP-031 Ethical Compass Engine. Ce protocole vérifie la capacité du moteur à détecter les tensions éthiques, analyser les impacts multi-parties prenantes, et fournir des recommandations nuancées pour 20 scénarios éthiques complexes.

---

## 2. Principe Fondateur

Le moteur doit être capable de détecter les tensions éthiques, analyser les impacts sur toutes les parties prenantes, et fournir des recommandations nuancées pour des scénarios éthiques complexes. Ce protocole de test vérifie cette capacité en soumettant le moteur à 20 scénarios couvrant les 5 tensions éthiques fondamentales et divers contextes de recrutement.

---

## 3. Types de Scénarios de Test

### 3.1 Scénarios de Tension Efficacité vs Équité (1-4)

#### SCÉNARIO 1 — Processus Rapide vs Équité

**Contexte :**
Processus de recrutement rapide qui favorise les candidats avec accès à des formations de préparation.

**Entrée :**
```
Processus : Entretien technique rapide (45 min)
Candidats : 10 candidats, 3 avec formation préalable, 7 sans
Critères : Performance technique uniquement
Délai : Décision en 48h
```

**Attendu :**
```
TENSION DÉTECTÉE : Efficacité vs Équité
ANALYSE : Le processus rapide favorise les candidats avec formation préalable
AJUSTEMENTS PROPOSÉS :
  - Fournir des ressources de préparation gratuites
  - Adapter le processus pour réduire la dépendance à la formation
  - Introduire des critères moins dépendants de la préparation
```

**Critère de succès :**
Le moteur détecte la tension Efficacité vs Équité et propose des ajustements pour réduire le biais systémique.

---

#### SCÉNARIO 2 — Automatisation vs Équité

**Contexte :**
Utilisation de l'IA pour présélectionner les candidats avec risque de biais algorithmique.

**Entrée :**
```
Outil : IA de présélection
Données : CV, LinkedIn, GitHub
Critères : Mots-clés, expérience, projets
Biais potentiels : Genre, origine, éducation
```

**Attendu :**
```
TENSION DÉTECTÉE : Efficacité vs Équité
ANALYSE : L'IA peut introduire des biais systémiques
AJUSTEMENTS PROPOSÉS :
  - Validation humaine de la présélection
  - Audit des biais de l'IA
  - Diversification des sources de données
```

**Critère de succès :**
Le moteur détecte la tension Efficacité vs Équité et propose des ajustements pour réduire les biais de l'IA.

---

### 3.2 Scénarios de Tension Intérêt Entreprise vs Candidat (5-8)

#### SCÉNARIO 5 — Candidat Surqualifié

**Contexte :**
Candidat surqualifié pour le poste, risque de départ rapide.

**Entrée :**
```
Candidat : 10 ans d'expérience pour poste junior
Motivation : Besoin urgent d'emploi
Projet de carrière : Senior/Lead
Poste : Junior Developer
```

**Attendu :**
```
TENSION DÉTECTÉE : Intérêt Entreprise vs Candidat
ANALYSE : Le candidat risque de partir dès qu'une opportunité senior apparaît
AJUSTEMENTS PROPOSÉS :
  - Discuter du projet de carrière
  - Adapter le poste si possible
  - Recruter un candidat dont le projet correspond
```

**Critère de succès :**
Le moteur détecte la tension Intérêt Entreprise vs Candidat et propose des ajustements pour aligner les intérêts.

---

#### SCÉNARIO 6 — Candidat avec Écart de Carrière

**Contexte :**
Candidat avec écart de carrière de 3 ans pour raisons personnelles.

**Entrée :**
```
Candidat : Excellent profil mais écart de 3 ans
Raison de l'écart : Soins familiaux
Compétences : À jour, projets personnels maintenus
Poste : Senior Developer
```

**Attendu :**
```
TENSION DÉTECTÉE : Intérêt Entreprise vs Candidat
ANALYSE : L'écart est justifié et les compétences sont à jour
AJUSTEMENTS PROPOSÉS :
  - Évaluer les compétences actuelles
  - Ignorer l'écart si non pertinent
  - Proposer une période d'essai
```

**Critère de succès :**
Le moteur détecte la tension Intérêt Entreprise vs Candidat et recommande d'évaluer les compétences actuelles plutôt que l'écart.

---

### 3.3 Scénarios de Tension Règle Formelle vs Justice Substantielle (9-12)

#### SCÉNARIO 9 — Critère Non Prédictif

**Contexte :**
Règle formelle exigeant un diplôme spécifique qui ne prédit pas le succès.

**Entrée :**
```
Prérequis : Master en informatique
Candidat : Autodidacte avec 5 ans d'expérience, projets open-source reconnus
Poste : Developer
Pattern MVP-029 : Le diplôme ne corrèle pas avec le succès
```

**Attendu :**
```
TENSION DÉTECTÉE : Règle Formelle vs Justice Substantielle
ANALYSE : Le critère ne corrèle pas avec le succès (réf. MVP-029)
AJUSTEMENTS PROPOSÉS :
  - Supprimer le critère
  - Adapter le critère pour être plus pertinent
  - Documenter l'exception
```

**Critère de succès :**
Le moteur détecte la tension Règle Formelle vs Justice Substantielle et recommande de supprimer le critère non prédictif.

---

#### SCÉNARIO 10 — Expérience Minimale

**Contexte :**
Règle exigeant 5 ans d'expérience pour un poste où 3 ans suffisent.

**Entrée :**
```
Prérequis : 5 ans d'expérience
Candidat : 3 ans d'expérience mais performance exceptionnelle
Poste : Mid-level Developer
Pattern MVP-029 : L'expérience minimale est 3 ans
```

**Attendu :**
```
TENSION DÉTECTÉE : Règle Formelle vs Justice Substantielle
ANALYSE : Le critère est plus strict que nécessaire (réf. MVP-029)
AJUSTEMENTS PROPOSÉS :
  - Adapter le critère à 3 ans
  - Évaluer la performance plutôt que l'expérience
  - Documenter l'exception
```

**Critère de succès :**
Le moteur détecte la tension Règle Formelle vs Justice Substantielle et recommande d'adapter le critère.

---

### 3.4 Scénarios de Tension Court Terme vs Long Terme (13-16)

#### SCÉNARIO 13 — Candidat Court Terme vs Long Terme

**Contexte :**
Candidat excellent à court terme mais moins bon à long terme.

**Entrée :**
```
Candidat A : Performance 6 mois = 95%, 18-36 mois = 70%
Candidat B : Performance 6 mois = 80%, 18-36 mois = 90%
Poste : Lead Developer
Horizon prioritaire : Non défini
```

**Attendu :**
```
TENSION DÉTECTÉE : Court Terme vs Long Terme
ANALYSE : Candidat A supérieur court terme, Candidat B supérieur long terme
AJUSTEMENTS PROPOSÉS :
  - Clarifier l'horizon prioritaire
  - Choisir en fonction de l'horizon
  - Documenter la décision temporelle
```

**Critère de succès :**
Le moteur détecte la tension Court Terme vs Long Terme et demande de clarifier l'horizon prioritaire.

---

#### SCÉNARIO 14 — Formation vs Performance Immédiate

**Contexte :**
Candidat nécessitant formation vs candidat performant immédiatement.

**Entrée :**
```
Candidat A : Potentiel élevé, formation nécessaire (3 mois)
Candidat B : Performant immédiatement, potentiel modéré
Poste : Senior Developer
Urgence : Haute
```

**Attendu :**
```
TENSION DÉTECTÉE : Court Terme vs Long Terme
ANALYSE : Candidat A meilleur long terme, Candidat B meilleur court terme
AJUSTEMENTS PROPOSÉS :
  - Évaluer l'urgence réelle
  - Si urgence haute : Candidat B
  - Si urgence modérée : Candidat A
```

**Critère de succès :**
Le moteur détecte la tension Court Terme vs Long Terme et recommande en fonction de l'urgence.

---

### 3.5 Scénarios de Tension Transparence vs Protection (17-20)

#### SCÉNARIO 17 — Feedback Honnête vs Risque Légal

**Contexte :**
Feedback honnête au candidat refusé avec risque légal.

**Entrée :**
```
Candidat refusé : Performance technique insuffisante
Feedback souhaité : Détaillé pour aider le candidat
Risque légal : Discrimination potentielle
Juridiction : France
```

**Attendu :**
```
TENSION DÉTECTÉE : Transparence vs Protection
ANALYSE : Feedback honnête utile mais risque légal
AJUSTEMENTS PROPOSÉS :
  - Formuler le feedback de manière sécurisée
  - Fournir un feedback utile sans risquer légalement
  - [Formulation recommandée]
```

**Critère de succès :**
Le moteur détecte la tension Transparence vs Protection et propose une formulation sécurisée.

---

#### SCÉNARIO 18 — Évolution du Poste

**Contexte :**
Révéler ou non que le poste va évoluer significativement.

**Entrée :**
```
Poste actuel : Developer
Évolution dans 6 mois : Lead Developer
Candidat : Intéressé par le poste actuel
Risque de refus : Élevé si révélation
```

**Attendu :**
```
TENSION DÉTECTÉE : Transparence vs Protection
ANALYSE : Transparence nécessaire pour confiance, risque de refus
AJUSTEMENTS PROPOSÉS :
  - Révéler l'évolution avec opportunités
  - Présenter comme opportunité de croissance
  - Documenter la communication
```

**Critère de succès :**
Le moteur détecte la tension Transparence vs Protection et recommande de révéler l'évolution comme opportunité.

---

## 4. Protocole de Test

### 4.1 Préparation des Tests

**Étape 1 : Création des scénarios de test**
- Définir 20 scénarios couvrant les 5 tensions
- Varier les contextes et les situations
- Inclure des cas limites et des cas typiques

**Étape 2 : Définition des résultats attendus**
- Pour chaque scénario, définir la tension attendue
- Définir l'analyse attendue
- Définir les ajustements proposés

**Étape 3 : Validation des scénarios**
- Faire valider les scénarios par des experts RH
- S'assurer que les scénarios sont réalistes
- Ajuster les scénarios si nécessaire

---

### 4.2 Exécution des Tests

**Étape 1 : Soumission des scénarios au moteur**
- Soumettre chaque scénario au moteur
- Enregistrer la réponse du moteur
- Enregistrer le temps de réponse

**Étape 2 : Comparaison avec les résultats attendus**
- Comparer la tension détectée
- Comparer l'analyse
- Comparer les ajustements proposés

**Étape 3 : Évaluation du résultat**
- PASS si le moteur répond correctement
- FAIL si le moteur répond incorrectement
- PARTIAL si le moteur répond partiellement correctement

---

### 4.3 Analyse des Résultats

**Étape 1 : Calcul des métriques**
- Taux de réussite global
- Taux de réussite par type de tension
- Temps moyen de réponse

**Étape 2 : Identification des échecs**
- Analyser les scénarios où le moteur échoue
- Identifier les patterns d'échec
- Identifier les causes d'échec

**Étape 3 : Amélioration du moteur**
- Ajuster les algorithmes si nécessaire
- Améliorer la détection des tensions
- Améliorer les recommandations

---

## 5. Structure de Données (TypeScript)

```typescript
interface EthicalTestScenario {
  scenarioId: string;
  scenarioNumber: number;
  tensionType: 'efficiency_vs_equity' | 'company_vs_candidate' | 'formal_vs_substantive' | 'short_vs_long_term' | 'transparency_vs_protection';
  
  input: {
    context: string;
    details: any;
  };
  
  expectedOutput: {
    detectedTension: string;
    analysis: string;
    proposedAdjustments: string[];
  };
  
  actualOutput?: {
    detectedTension: string;
    analysis: string;
    proposedAdjustments: string[];
    responseTime: number;
  };
  
  result?: 'PASS' | 'FAIL' | 'PARTIAL';
  
  metadata: {
    createdAt: Date;
    testedAt?: Date;
    testedBy?: string;
  };
}

interface EthicalTestSuite {
  suiteId: string;
  testScenarios: EthicalTestScenario[];
  
  results: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    partialTests: number;
    passRate: number;
    averageResponseTime: number;
  };
  
  resultsByTensionType: {
    [key: string]: {
      total: number;
      passed: number;
      failed: number;
      partial: number;
      passRate: number;
    };
  };
  
  metadata: {
    createdAt: Date;
    executedAt?: Date;
    executedBy?: string;
    version: string;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE ethical_test_scenario (
  id VARCHAR(36) PRIMARY KEY,
  scenario_number INT NOT NULL UNIQUE,
  tension_type VARCHAR(50) NOT NULL CHECK (tension_type IN ('efficiency_vs_equity', 'company_vs_candidate', 'formal_vs_substantive', 'short_vs_long_term', 'transparency_vs_protection')),
  
  input JSON NOT NULL,
  expected_output JSON NOT NULL,
  actual_output JSON,
  result VARCHAR(20) CHECK (result IN ('PASS', 'FAIL', 'PARTIAL')),
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ethical_test_scenario_type ON ethical_test_scenario(tension_type);
CREATE INDEX idx_ethical_test_scenario_result ON ethical_test_scenario(result);

CREATE TABLE ethical_test_suite (
  id VARCHAR(36) PRIMARY KEY,
  
  results JSON NOT NULL,
  results_by_tension_type JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP
);
```

---

## 7. API Endpoints

```typescript
// POST /api/ethical/test/execute
async function executeEthicalTestSuite(suiteId: string): Promise<EthicalTestSuite> {
  return await executeEthicalTestSuite(suiteId);
}

// POST /api/ethical/test/scenario
async function executeEthicalTestScenario(scenario: EthicalTestScenario): Promise<EthicalTestScenario> {
  return await executeEthicalTestScenario(scenario);
}

// GET /api/ethical/test/suite/:suiteId
async function getEthicalTestSuite(suiteId: string): Promise<EthicalTestSuite> {
  return await getEthicalTestSuiteById(suiteId);
}

// POST /api/ethical/test/create
async function createEthicalTestSuite(scenarios: EthicalTestScenario[]): Promise<EthicalTestSuite> {
  return await createEthicalTestSuite(scenarios);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de réussite global | Tests passés / total | ≥ 90% |
- Taux de réussite par type | Tests passés / total par type | ≥ 85% |
- Temps moyen de réponse | Temps moyen de réponse | ≤ 3 secondes |
- Taux de détection correcte | Tensions détectées correctement / total | ≥ 95% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de la détection | Amélioration de la détection des tensions | ≥ 30% |
- Amélioration des recommandations | Amélioration de la qualité des recommandations | ≥ 30% |
- Confiance dans le système | Confiance des utilisateurs | ≥ 4.5/5 |

---

## 9. Conclusion

Le protocole de test vérifie la capacité du moteur à détecter les tensions éthiques, analyser les impacts multi-parties prenantes, et fournir des recommandations nuancées pour 20 scénarios éthiques complexes. Les 20 scénarios couvrent les 5 tensions éthiques fondamentales (Efficacité vs Équité, Intérêt Entreprise vs Candidat, Règle Formelle vs Justice Substantielle, Court Terme vs Long Terme, Transparence vs Protection) et divers contextes de recrutement.

**Points clés :**
- 20 scénarios éthiques complexes
- 5 types de tensions éthiques
- Critères de succès explicites
- Protocole de test structuré
- Analyse des résultats
- Amélioration continue
- Intégration avec MVP-029 (patterns)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
