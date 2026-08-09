# DOC-007-06 : Protocole de Test du Raisonnement (Golden Dataset)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test du moteur de raisonnement à l'aide d'un golden dataset de 100 cas pour valider la précision, la cohérence et l'auditabilité des décisions.

---

## 2. Golden Dataset

### 2.1 Composition du Dataset

Le golden dataset comprend 100 cas de test couvrant :

- **25 cas de recommandation** : Profil fortement aligné
- **25 cas de non-recommandation** : Écarts trop importants
- **25 cas de recommandation sous conditions** : Profil pertinent avec conditions
- **25 cas de données insuffisantes** : Données manquantes critiques

### 2.2 Structure d'un Cas de Test

```typescript
interface TestCase {
  id: string;
  description: string;
  expectedRecommendation: 'recommend' | 'not_recommend' | 'recommend_with_conditions' | 'insufficient_data';
  input: {
    candidateData: any;
    jobData: any;
    context?: {
      team?: {
        existingSkills: string[];
        teamSize: number;
        seniorityDistribution: string;
      };
      constraints?: string[];
      coveredSkills?: string[];
    };
  };
  expectedOutput: {
    layer1: {
      keyFacts: string[];
    };
    layer2: {
      directMatches: number;
      transferableGaps: number;
      nonCompensableGaps: number;
    };
    layer3: {
      teamAbsorptionCapacity: boolean;
      adaptationCapacity: boolean;
    };
    layer4: {
      recommendation: string;
      confidence: string;
      keyStrengths: string[];
      keyVigilancePoints: string[];
    };
  };
}
```

---

## 3. Cas de Test Types

### 3.1 Cas de Recommandation (25 cas)

#### Cas R-001 : Correspondance Parfaite

**Description :** Candidat possède toutes les compétences critiques avec expérience pertinente.

**Input :**
- Candidat : Kubernetes, Docker, Terraform, AWS, Linux (5 ans d'expérience)
- Poste : Kubernetes, Docker, Terraform, AWS, Linux (Senior DevOps)
- Contexte : Équipe de 5 personnes

**Expected Output :**
- Recommandation : recommend
- Confiance : high
- Direct matches : 5
- Transferable gaps : 0
- Non-compensable gaps : 0

#### Cas R-002 : Correspondance avec Transfert

**Description :** Candidat possède Docker et Terraform, pas Kubernetes mais transfert crédible.

**Input :**
- Candidat : Docker, Terraform, AWS, Linux (3 ans d'expérience)
- Poste : Kubernetes, Docker, Terraform, AWS, Linux (Senior DevOps)
- Contexte : Équipe avec expert Kubernetes

**Expected Output :**
- Recommandation : recommend
- Confiance : high
- Direct matches : 4
- Transferable gaps : 1 (Kubernetes)
- Non-compensable gaps : 0

#### Cas R-003 : Profil Junior avec Potentiel

**Description :** Candidat junior avec compétences de base et signaux d'apprentissage rapide.

**Input :**
- Candidat : Docker, Linux, Python (1 an d'expérience), certifications multiples
- Poste : Kubernetes, Docker, Linux (Junior DevOps)
- Contexte : Équipe de 8 personnes avec mentors

**Expected Output :**
- Recommandation : recommend
- Confiance : medium
- Direct matches : 2
- Transferable gaps : 0
- Non-compensable gaps : 0

[... 22 autres cas de recommandation ...]

### 3.2 Cas de Non-Recommandation (25 cas)

#### Cas NR-001 : Écart Bloquant

**Description :** Candidat manque une compétence bloquante (Python pour Data Scientist).

**Input :**
- Candidat : SQL, Statistics, Data Analysis (pas Python)
- Poste : Python, SQL, Statistics, Machine Learning (Senior Data Scientist)
- Contexte : Équipe sans expert Python

**Expected Output :**
- Recommandation : not_recommend
- Confiance : high
- Direct matches : 2
- Transferable gaps : 0
- Non-compensable gaps : 1 (Python)

#### Cas NR-002 : Écarts Multiples

**Description :** Candidat manque 3 compétences significatives.

**Input :**
- Candidat : Docker, Linux (seulement)
- Poste : Kubernetes, Docker, Terraform, AWS, Linux (Senior DevOps)
- Contexte : Équipe petite (3 personnes)

**Expected Output :**
- Recommandation : not_recommend
- Confiance : high
- Direct matches : 2
- Transferable gaps : 0
- Non-compensable gaps : 3

#### Cas NR-003 : Incompatibilité de Stack

**Description :** Candidat possède React mais poste requiert Angular.

**Input :**
- Candidat : React, JavaScript, TypeScript (3 ans)
- Poste : Angular, TypeScript, JavaScript (Senior Frontend)
- Contexte : Stack Angular imposée

**Expected Output :**
- Recommandation : not_recommend
- Confiance : medium
- Direct matches : 2
- Transferable gaps : 0
- Non-compensable gaps : 1 (Angular)

[... 22 autres cas de non-recommandation ...]

### 3.3 Cas de Recommandation Sous Conditions (25 cas)

#### Cas RC-001 : Transfert avec Support Équipe

**Description :** Candidat peut acquérir Kubernetes via Docker/Terraform, équipe peut accompagner.

**Input :**
- Candidat : Docker, Terraform, AWS, Linux (3 ans)
- Poste : Kubernetes, Docker, Terraform, AWS, Linux (Senior DevOps)
- Contexte : Équipe avec expert Kubernetes, taille 8 personnes

**Expected Output :**
- Recommandation : recommend_with_conditions
- Confiance : medium
- Direct matches : 4
- Transferable gaps : 1 (Kubernetes)
- Non-compensable gaps : 0
- Conditions : Onboarding structuré avec mentorat

#### Cas RC-002 : Délai d'Acquisition Acceptable

**Description :** Candidat manque une compétence mais délai d'acquisition compatible (2-3 mois).

**Input :**
- Candidat : Python, SQL, Statistics (2 ans)
- Poste : Python, SQL, Statistics, Machine Learning (Data Scientist)
- Contexte : Contrainte : disponibilité dans 3 mois

**Expected Output :**
- Recommandation : recommend_with_conditions
- Confiance : medium
- Direct matches : 3
- Transferable gaps : 1 (Machine Learning)
- Non-compensable gaps : 0
- Conditions : Formation ML de 2 mois

#### Cas RC-003 : Capacité d'Adaptation

**Description :** Candidat manque compétences mais montre forte capacité d'adaptation.

**Input :**
- Candidat : Docker, Linux, certifications multiples, progression rapide (2 ans)
- Poste : Kubernetes, Docker, Terraform, AWS, Linux (Mid-level DevOps)
- Contexte : Équipe de 6 personnes

**Expected Output :**
- Recommandation : recommend_with_conditions
- Confiance : medium
- Direct matches : 2
- Transferable gaps : 2 (Kubernetes, Terraform)
- Non-compensable gaps : 0
- Conditions : Plan de formation structuré

[... 22 autres cas de recommandation sous conditions ...]

### 3.4 Cas de Données Insuffisantes (25 cas)

#### Cas DI-001 : CV Incomplet

**Description :** CV sans expériences professionnelles.

**Input :**
- Candidat : Compétences déclarées seulement, pas d'expériences
- Poste : Poste complet avec exigences
- Contexte : Aucun

**Expected Output :**
- Recommandation : insufficient_data
- Confiance : low
- Missing data : Expériences professionnelles

#### Cas DI-002 : Fiche de Poste Incomplète

**Description :** Fiche de poste sans compétences critiques définies.

**Input :**
- Candidat : CV complet
- Poste : Titre seulement, pas de compétences
- Contexte : Aucun

**Expected Output :**
- Recommandation : insufficient_data
- Confiance : low
- Missing data : Compétences critiques requises

#### Cas DI-003 : Absence de Contexte Équipe

**Description :** Équipe petite mais contexte non fourni.

**Input :**
- Candidat : Profil partiel avec écarts
- Poste : Poste avec compétences critiques
- Contexte : Aucun contexte équipe

**Expected Output :**
- Recommandation : insufficient_data
- Confiance : low
- Missing data : Contexte de l'équipe

[... 22 autres cas de données insuffisantes ...]

---

## 4. Protocole de Test

### 4.1 Exécution des Tests

Pour chaque cas de test :

1. **Préparer l'input** selon la spécification du cas
2. **Appeler l'API** `POST /reasoning/analyze`
3. **Capturer la sortie** complète (4 couches)
4. **Comparer avec l'expected output**

### 4.2 Critères de Validation

#### 4.2.1 Validation de la Recommandation

- **Success :** La recommandation du moteur correspond exactement à l'expected recommendation
- **Failure :** La recommandation diffère

#### 4.2.2 Validation de la Confiance

- **Success :** Le niveau de confiance correspond à l'expected confidence (±1 niveau acceptable)
- **Failure :** Le niveau de confiance diffère significativement

#### 4.2.3 Validation des Faits (Couche 1)

- **Success :** Les faits clés identifiés correspondent aux expected key facts
- **Failure :** Faits manquants ou incorrects

#### 4.2.4 Validation des Écarts (Couche 2)

- **Success :** Le nombre de direct matches, transferable gaps et non-compensable gaps correspond
- **Failure :** Compteurs incorrects

#### 4.2.5 Validation du Contexte (Couche 3)

- **Success :** Team absorption capacity et adaptation capacity correspondent
- **Failure :** Valeurs incorrectes

#### 4.2.6 Validation de la Décision (Couche 4)

- **Success :** Points forts et points de vigilance correspondent aux expected
- **Failure :** Éléments manquants ou incorrects

### 4.3 Métriques de Performance

#### 4.3.1 Précision de la Recommandation

```
Précision = (Cas corrects / Total cas) × 100
```

**Cible :** ≥ 90%

#### 4.3.2 Précision par Type de Recommandation

```
Précision_Recommandation = (Cas R corrects / Total cas R) × 100
Précision_Non_Recommandation = (Cas NR corrects / Total cas NR) × 100
Précision_Sous_Conditions = (Cas RC corrects / Total cas RC) × 100
Précision_Données_Insuffisantes = (Cas DI corrects / Total cas DI) × 100
```

**Cible :** ≥ 85% pour chaque type

#### 4.3.3 Précision de la Confiance

```
Précision_Confiance = (Cas confiance correcte / Total cas) × 100
```

**Cible :** ≥ 80%

#### 4.3.4 Temps de Traitement

```
Temps moyen = Σ(Processing time) / Total cas
```

**Cible :** < 15 secondes

### 4.4 Rapport de Test

Le rapport de test inclut :

1. **Résumé exécutif**
   - Nombre total de cas testés
   - Nombre de cas réussis
   - Précision globale
   - Temps moyen de traitement

2. **Résultats par type de recommandation**
   - Tableau de précision par type
   - Cas échoués par type

3. **Analyse des échecs**
   - Liste des cas échoués
   - Raison de l'échec
   - Recommandation de correction

4. **Détails par cas**
   - Pour chaque cas : input, expected output, actual output, statut

---

## 5. Automatisation des Tests

### 5.1 Framework de Test

Utiliser un framework de test (Jest, Mocha, etc.) pour automatiser l'exécution.

### 5.2 Structure du Test Suite

```typescript
describe('Reasoning Engine Golden Dataset', () => {
  describe('Recommendation Cases', () => {
    testCases.filter(c => c.expectedRecommendation === 'recommend').forEach(testCase => {
      it(`should recommend for ${testCase.id}`, async () => {
        const result = await reasoningService.reason(testCase.input);
        expect(result.layer4.decision.recommendation).toBe('recommend');
        expect(result.layer4.decision.confidence).toBe(testCase.expectedOutput.layer4.confidence);
        // ... autres validations
      });
    });
  });

  describe('Not Recommend Cases', () => {
    // ... tests pour non-recommandation
  });

  describe('Recommend with Conditions Cases', () => {
    // ... tests pour recommandation sous conditions
  });

  describe('Insufficient Data Cases', () => {
    // ... tests pour données insuffisantes
  });
});
```

### 5.3 CI/CD Integration

Intégrer les tests dans le pipeline CI/CD :

- Exécution automatique à chaque PR
- Échec du build si précision < 85%
- Génération automatique du rapport de test

---

## 6. Maintenance du Golden Dataset

### 6.1 Mise à Jour

Le golden dataset doit être mis à jour :

- Trimestriellement pour ajouter de nouveaux cas
- Lors de l'ajout de nouvelles fonctionnalités du moteur
- Basé sur les retours d'expérience des utilisateurs
- Basé sur les cas d'usage réels

### 6.2 Versioning

Chaque version du golden dataset est versionnée :

- Format : `golden-dataset-vX.Y.Z.json`
- Historique des changements documenté
- Rétrocompatibilité maintenue autant que possible

### 6.3 Validation par les Experts

Les nouveaux cas doivent être validés par :

- Experts RH
- Recruteurs seniors
- Architectes du système

---

## 7. Critères d'Auditabilité

### 7.1 Traçabilité

Chaque cas de test doit permettre de retracer :

- Les faits collectés
- Les écarts identifiés
- Le raisonnement contextuel
- La décision finale

### 7.2 Reproductibilité

Chaque cas de test doit être reproductible :

- Même input → même output
- Indépendamment de l'exécution
- Indépendamment de l'environnement

### 7.3 Documentation

Chaque cas de test doit être documenté :

- Description claire du scénario
- Rationale de l'expected output
- Sources des données

---

## 8. Intégration avec le Système

### 8.1 Test en Production

Le golden dataset peut être utilisé pour :

- Validation avant déploiement
- Monitoring en production (canary testing)
- A/B testing de nouvelles versions du moteur

### 8.2 Feedback Loop

Les résultats des tests en production alimentent :

- L'amélioration du golden dataset
- L'amélioration du moteur de raisonnement
- L'ajustement des patterns de transfert
- L'ajustement de la grille de criticité

---

## 9. Exemple de Cas de Test Complet

### Cas R-001 : Correspondance Parfaite

```json
{
  "id": "R-001",
  "description": "Candidat possède toutes les compétences critiques avec expérience pertinente",
  "expectedRecommendation": "recommend",
  "input": {
    "candidateData": {
      "skills": ["Kubernetes", "Docker", "Terraform", "AWS", "Linux"],
      "experience": [
        {
          "title": "DevOps Engineer",
          "duration": 5,
          "company": "Tech Corp"
        }
      ],
      "certifications": ["AWS Certified DevOps Engineer"]
    },
    "jobData": {
      "title": "Senior DevOps Engineer",
      "criticalSkills": ["Kubernetes", "Docker", "Terraform", "AWS", "Linux"],
      "minExperience": 5
    },
    "context": {
      "team": {
        "existingSkills": ["Kubernetes", "Docker"],
        "teamSize": 5,
        "seniorityDistribution": "2 senior, 3 junior"
      }
    }
  },
  "expectedOutput": {
    "layer1": {
      "keyFacts": [
        "5 compétences explicitement déclarées",
        "5 ans d'expérience DevOps",
        "1 certification AWS"
      ]
    },
    "layer2": {
      "directMatches": 5,
      "transferableGaps": 0,
      "nonCompensableGaps": 0
    },
    "layer3": {
      "teamAbsorptionCapacity": true,
      "adaptationCapacity": true
    },
    "layer4": {
      "recommendation": "recommend",
      "confidence": "high",
      "keyStrengths": [
        "Forte couverture des compétences requises",
        "Expérience pertinente",
        "Certification reconnue"
      ],
      "keyVigilancePoints": []
    }
  }
}
```

---

## 10. Conclusion

Le protocole de test avec golden dataset garantit :

- **Validation continue** de la qualité du raisonnement
- **Régression testing** pour éviter les régressions
- **Auditabilité** du système de décision
- **Confiance** des utilisateurs dans les recommandations

Le golden dataset est un actif vivant qui évolue avec le système et les besoins des utilisateurs.
