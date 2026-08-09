# DOC-031-04 : Protocole de Documentation des Dilemmes Réels

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de documentation des dilemmes réels pour MVP-031 Ethical Compass Engine. Ce protocole structure la documentation des dilemmes éthiques rencontrés en pratique pour enrichir la bibliothèque et former les recruteurs de manière continue.

---

## 2. Principe Fondateur

Le moteur utilise les dilemmes réels rencontrés pour enrichir la bibliothèque et former les recruteurs. Après chaque situation éthique complexe, le dilemme est documenté (anonymisée), la décision prise et son argumentaire sont enregistrés, le résultat observé est noté, et la leçon extraite est intégrée à la bibliothèque.

---

## 3. Processus de Documentation

### 3.1 Étape 1 — Identification du Dilemme

**Déclencheur :**
Une situation éthique complexe est rencontrée lors d'un recrutement.

**Critères d'identification :**
- Tension entre deux ou plusieurs valeurs éthiques
- Incertitude sur la meilleure option
- Impact significatif sur une ou plusieurs parties prenantes
- Situation non couverte explicitement par la bibliothèque existante

**Action :**
Le recruteur identifie le dilemme et lance le processus de documentation.

---

### 3.2 Étape 2 — Documentation du Dilemme (Anonymisée)

**Contenu à documenter :**

```
DILEMME RÉEL [ID]

DATE : [Date]
CONTEXTE : [Contexte du recrutement]
TYPE : [Type de dilemme]

DESCRIPTION DU DILEMME :
  [Description détaillée de la situation]
  [Circonstances spécifiques]
  [Contraintes]

PARTIES PRENANTES IMPLIQUÉES :
  - [Partie prenante 1] : [Rôle, intérêt]
  - [Partie prenante 2] : [Rôle, intérêt]
  - [Partie prenante 3] : [Rôle, intérêt]

OPTIONS CONSIDÉRÉES :
  Option A : [Description]
  Option B : [Description]
  Option C : [Description]

INFORMATIONS SENSIBLES (ANONYMISÉES) :
  [Informations sensibles anonymisées]
```

**Anonymisation :**
- Noms des candidats remplacés par "Candidat A", "Candidat B"
- Noms de l'entreprise remplacés par "Entreprise X"
- Détails spécifiques généralisés
- Aucune information personnellement identifiable

---

### 3.3 Étape 3 — Décision Prise et Argumentaire

**Contenu à documenter :**

```
DÉCISION PRISE :
  Option choisie : [Option]
  Date de décision : [Date]
  Décideur : [Rôle]

ARGUMENTAIRE DE LA DÉCISION :
  Justification principale : [Justification]
  Facteurs considérés :
    - [Facteur 1]
    - [Facteur 2]
    - [Facteur 3]
  Valeurs priorisées :
    - [Valeur 1]
    - [Valeur 2]
  Risques acceptés :
    - [Risque 1]
    - [Risque 2]
  Mesures d'atténuation :
    - [Mesure 1]
    - [Mesure 2]

CONSULTATIONS :
  Personnes consultées : [Liste]
  Conseils reçus : [Résumé]
```

---

### 3.4 Étape 4 — Résultat Observé

**Contenu à documenter :**

```
RÉSULTAT OBSERVÉ :

IMPACT SUR LE CANDIDAT RETENU :
  Court terme : [Observation]
  Long terme : [Observation]
  Satisfaction : [Échelle 1-5]

IMPACT SUR LES CANDIDATS REFUSÉS :
  Feedback reçu : [Observation]
  Satisfaction : [Échelle 1-5]

IMPACT SUR L'ÉQUIPE :
  Intégration : [Observation]
  Performance : [Observation]
  Satisfaction : [Échelle 1-5]

IMPACT SUR L'ENTREPRISE :
  Performance : [Observation]
  Réputation : [Observation]
  Coûts : [Observation]

SURPRISES OU ÉCARTS :
  [Surprises ou écarts par rapport aux attentes]

DATE D'OBSERVATION : [Date]
PÉRIODE D'OBSERVATION : [Durée]
```

---

### 3.5 Étape 5 — Leçon Extraite

**Contenu à documenter :**

```
LEÇON EXTRITE :

CE QUI A FONCTIONNÉ :
  - [Élément 1]
  - [Élément 2]

CE QUI N'A PAS FONCTIONNÉ :
  - [Élément 1]
  - [Élément 2]

CE QUI SERAIT FAIT DIFFÉREMMENT :
  [Description de ce qui serait fait différemment]

RECOMMANDATION POUR LE FUTUR :
  [Recommandation spécifique]

CATÉGORISATION :
  Type de dilemme : [Catégorie]
  Fréquence estimée : [Fréquence]
  Complexité : [Complexité]

INTÉGRATION À LA BIBLIOTHÈQUE :
  Ajouter comme nouveau dilemme : [Oui/Non]
  Mettre à jour un dilemme existant : [Oui/Non]
  Dilemme concerné : [ID]
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface RealDilemma {
  dilemmaId: string;
  documentedAt: Date;
  
  context: {
    date: Date;
    recruitmentContext: string;
    dilemmaType: string;
  };
  
  description: {
    detailedDescription: string;
    specificCircumstances: string;
    constraints: string[];
  };
  
  stakeholders: {
    stakeholder: string;
    role: string;
    interest: string;
  }[];
  
  options: {
    option: string;
    description: string;
  }[];
  
  sensitiveInfo: {
    originalInfo: string;
    anonymizedInfo: string;
  }[];
  
  decision: {
    chosenOption: string;
    decisionDate: Date;
    decisionMaker: string;
    justification: string;
    factorsConsidered: string[];
    prioritizedValues: string[];
    acceptedRisks: string[];
    mitigationMeasures: string[];
  };
  
  consultations: {
    consultedPersons: string[];
    adviceReceived: string;
  };
  
  observedResult: {
    impactOnHiredCandidate: {
      shortTerm: string;
      longTerm: string;
      satisfaction: number;
    };
    impactOnRejectedCandidates: {
      feedbackReceived: string;
      satisfaction: number;
    };
    impactOnTeam: {
      integration: string;
      performance: string;
      satisfaction: number;
    };
    impactOnCompany: {
      performance: string;
      reputation: string;
      costs: string;
    };
    surprisesOrDeviations: string[];
    observationDate: Date;
    observationPeriod: string;
  };
  
  lessonLearned: {
    whatWorked: string[];
    whatDidNotWork: string[];
    whatWouldBeDoneDifferently: string;
    recommendationForFuture: string;
    categorization: {
      dilemmaType: string;
      estimatedFrequency: string;
      complexity: string;
    };
    libraryIntegration: {
      addAsNewDilemma: boolean;
      updateExistingDilemma: boolean;
      relatedDilemmaId?: string;
    };
  };
  
  metadata: {
    documentedBy: string;
    version: string;
    status: 'documented' | 'analyzed' | 'integrated' | 'archived';
  };
}
```

---

## 5. Algorithme de Documentation

### 5.1 Processus Global

```typescript
async function documentRealDilemma(dilemmaContext: DilemmaContext): Promise<RealDilemma> {
  // 1. Identification du dilemme
  const identifiedDilemma = await identifyDilemma(dilemmaContext);
  
  // 2. Documentation du dilemme (anonymisée)
  const documentedDilemma = await documentDilemma(identifiedDilemma);
  
  // 3. Documentation de la décision
  const decisionDocumentation = await documentDecision(documentedDilemma);
  
  // 4. Observation du résultat (après une période définie)
  const observedResult = await observeResult(decisionDocumentation);
  
  // 5. Extraction de la leçon
  const lessonLearned = await extractLesson(observedResult);
  
  // 6. Construction du dilemme réel
  const realDilemma: RealDilemma = {
    dilemmaId: generateDilemmaId(),
    documentedAt: new Date(),
    context: documentedDilemma.context,
    description: documentedDilemma.description,
    stakeholders: documentedDilemma.stakeholders,
    options: documentedDilemma.options,
    sensitiveInfo: documentedDilemma.sensitiveInfo,
    decision: decisionDocumentation,
    consultations: decisionDocumentation.consultations,
    observedResult,
    lessonLearned,
    metadata: {
      documentedBy: 'MVP-031 Ethical Compass Engine',
      version: '1.0',
      status: 'documented'
    }
  };
  
  // 7. Intégration à la bibliothèque
  if (lessonLearned.libraryIntegration.addAsNewDilemma) {
    await addToLibrary(realDilemma);
  } else if (lessonLearned.libraryIntegration.updateExistingDilemma) {
    await updateLibrary(realDilemma);
  }
  
  return realDilemma;
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE real_dilemma (
  id VARCHAR(36) PRIMARY KEY,
  documented_at TIMESTAMP NOT NULL,
  
  context JSON NOT NULL,
  description JSON NOT NULL,
  stakeholders JSON NOT NULL,
  options JSON NOT NULL,
  sensitive_info JSON NOT NULL,
  decision JSON NOT NULL,
  consultations JSON NOT NULL,
  observed_result JSON NOT NULL,
  lesson_learned JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_real_dilemma_date ON real_dilemma(documented_at);
CREATE INDEX idx_real_dilemma_type ON real_dilemma((context->>'$.dilemmaType'));
```

---

## 7. API Endpoints

```typescript
// POST /api/ethical/dilemmas/document
async function documentRealDilemma(dilemmaContext: DilemmaContext): Promise<RealDilemma> {
  return await documentRealDilemma(dilemmaContext);
}

// GET /api/ethical/dilemmas/real/:dilemmaId
async function getRealDilemma(dilemmaId: string): Promise<RealDilemma> {
  return await getRealDilemmaById(dilemmaId);
}

// GET /api/ethical/dilemmas/real
async function getRealDilemmas(): Promise<RealDilemma[]> {
  return await getRealDilemmas();
}

// PUT /api/ethical/dilemmas/real/:dilemmaId/observe
async function observeDilemmaResult(dilemmaId: string, result: any): Promise<RealDilemma> {
  return await observeDilemmaResult(dilemmaId, result);
}

// PUT /api/ethical/dilemmas/real/:dilemmaId/lesson
async function extractLesson(dilemmaId: string, lesson: any): Promise<RealDilemma> {
  return await extractLesson(dilemmaId, lesson);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de documentation | Dilemmes documentés / rencontrés | ≥ 80% |
- Taux d'anonymisation | Dilemmes anonymisés / documentés | 100% |
- Taux d'observation | Dilemmes avec résultat observé / documentés | ≥ 70% |
- Taux d'intégration | Dilemmes intégrés / documentés | ≥ 60% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Enrichissement de la bibliothèque | Nouveaux dilemmes ajoutés / mois | ≥ 2 |
- Amélioration des décisions | Amélioration de la qualité des décisions | ≥ 20% |
- Satisfaction recruteurs | Satisfaction avec le processus | ≥ 4.5/5 |

---

## 9. Conclusion

Le protocole de documentation des dilemmes réels structure la documentation des dilemmes éthiques rencontrés en pratique pour enrichir la bibliothèque et former les recruteurs. Les 5 étapes (identification, documentation anonymisée, décision et argumentaire, résultat observé, leçon extraite) permettent un apprentissage continu et l'amélioration de la bibliothèque des dilemmes éthiques.

**Points clés :**
- 5 étapes de documentation
- Anonymisation systématique
- Documentation complète de la décision
- Observation des résultats
- Extraction de leçons
- Intégration à la bibliothèque
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
