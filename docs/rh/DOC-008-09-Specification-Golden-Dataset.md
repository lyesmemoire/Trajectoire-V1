# DOC-008-09 : Spécification du Golden Dataset

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la spécification du golden dataset de référence pour le moteur d'apprentissage. Avant de déployer MVP-008, constituer un golden dataset de référence. Composition : 100 paires CV / Poste avec décision humaine connue. Diversité obligatoire : 10 secteurs, 5 niveaux d'expérience, profils atypiques inclus.

---

## 2. Principe Fondateur

Avant de déployer MVP-008, constituer un golden dataset de référence. Composition : 100 paires CV / Poste avec décision humaine connue. Diversité obligatoire : 10 secteurs, 5 niveaux d'expérience, profils atypiques inclus, profils refusés à tort inclus, profils acceptés avec réserves inclus.

---

## 3. Structure du Golden Dataset

### 3.1 Structure de Donnée

```typescript
interface GoldenDatasetCase {
  id: string;
  
  // CV
  cv: {
    id: string;
    candidateId: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    certifications: Certification[];
    languages: Language[];
    softSkills: string[];
    metadata: {
      ageGroup?: string;
      gender?: string;
      nationality?: string;
      location?: string;
    };
  };
  
  // Poste
  job: {
    id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    preferredSkills: string[];
    experienceRequired: number;
    educationRequired: string;
    sector: string;
    companySize: string;
    jobType: string;
    seniority: string;
  };
  
  // Décision humaine
  humanDecision: {
    decision: 'retained' | 'rejected' | 'pending';
    confidence: 'high' | 'medium' | 'low';
    determiningFactor: string;
    justification: string[];
    recruiterId: string;
    decisionDate: Date;
  };
  
  // Classification du cas
  caseClassification: {
    difficulty: 'easy' | 'medium' | 'hard' | 'ambiguous';
    profileType: 'standard' | 'atypical' | 'edge_case';
    sector: string;
    seniority: string;
    experienceLevel: 'junior' | 'mid' | 'senior' | 'executive';
  };
  
  // Métadonnées
  metadata: {
    source: 'production' | 'synthetic' | 'curated';
    createdAt: Date;
    validatedBy: string[];
    version: string;
  };
}
```

---

## 4. Composition du Dataset

### 4.1 Volume Total

**Total :** 100 cas

### 4.2 Répartition par Secteur (10 secteurs)

| Secteur | Nombre de Cas | Pourcentage |
|---------|--------------|-------------|
| Tech / IT | 15 | 15% |
| Finance / Fintech | 10 | 10% |
| Santé | 10 | 10% |
| Industrie | 10 | 10% |
| Retail | 8 | 8% |
| Logistique | 8 | 8% |
| Consulting | 8 | 8% |
| Éducation | 8 | 8% |
| Administration publique | 12 | 12% |
| Autres | 11 | 11% |

### 4.3 Répartition par Niveau d'Expérience (5 niveaux)

| Niveau | Nombre de Cas | Pourcentage |
|--------|--------------|-------------|
| Junior (0-2 ans) | 20 | 20% |
| Mid (2-5 ans) | 25 | 25% |
| Senior (5-10 ans) | 25 | 25% |
| Expert (10-15 ans) | 20 | 20% |
| Executive (15+ ans) | 10 | 10% |

### 4.4 Répartition par Type de Profil

| Type de Profil | Nombre de Cas | Pourcentage |
|----------------|--------------|-------------|
| Standard | 60 | 60% |
| Atypique | 25 | 25% |
| Edge case | 15 | 15% |

### 4.5 Répartition par Décision

| Décision | Nombre de Cas | Pourcentage |
|----------|--------------|-------------|
| Retenu | 50 | 50% |
| Refusé | 40 | 40% |
| En attente / Réserve | 10 | 10% |

### 4.6 Cas Spéciaux Inclus

**Profils refusés à tort :** 10 cas
- Cas où la décision humaine a été regrettée par la suite
- Cas où le candidat a réussi ailleurs

**Profils acceptés avec réserves :** 10 cas
- Cas où la décision était "recommend_with_conditions"
- Cas où l'intégration a été difficile

**Profils atypiques :** 25 cas
- Changements de carrière
- Expériences non linéaires
- Compétences émergentes

---

## 5. Critères de Sélection

### 5.1 Critères de Qualité

Chaque cas doit respecter les critères suivants :

- **Décision humaine fiable** : Décision prise par un recruteur expérimenté
- **CV complet** : CV avec suffisamment d'informations
- **Fiche de poste complète** : Fiche de poste avec exigences claires
- **Justification documentée** : Raison de la décision documentée
- **Délai suffisant** : Cas datant d'au moins 6 mois (pour validation)

### 5.2 Critères de Diversité

Le dataset doit inclure :

- **Diversité de secteurs** : Au moins 10 secteurs différents
- **Diversité de niveaux** : Tous les niveaux d'expérience représentés
- **Diversité de profils** : Profils standards, atypiques et edge cases
- **Diversité de décisions** : Retenus, refusés, en attente
- **Diversité de contextes** : Différentes tailles d'entreprise, types de poste

### 5.3 Critères de Représentativité

Le dataset doit être représentatif :

- **Des cas réels** : Cas issus de la production
- **Des différents recruteurs** : Au moins 5 recruteurs différents
- **Des différentes entreprises** : Au moins 3 entreprises différentes
- **Des différentes périodes** : Cas sur une période d'au moins 6 mois

---

## 6. Processus de Constitution

### 6.1 Étape 1 : Collecte

**Responsable :** Lead Technique MVP-008

**Actions :**
- Extraction des cas de la base de données de production
- Filtrage des cas selon les critères de qualité
- Sélection des cas selon les critères de diversité

**Volume cible :** 150 cas (pour permettre la sélection)

### 6.2 Étape 2 : Validation

**Responsable :** DRH Référent

**Actions :**
- Revue de chaque cas
- Validation de la décision humaine
- Validation de la classification
- Ajout de cas manquants si nécessaire

**Volume cible :** 100 cas validés

### 6.3 Étape 3 : Annotation

**Responsable :** Expert Conformité

**Actions :**
- Annotation des cas avec les métadonnées requises
- Classification des cas (difficulté, type de profil)
- Identification des cas spéciaux (refusés à tort, etc.)

### 6.4 Étape 4 : Vérification

**Responsable :** Comité de Gouvernance

**Actions :**
- Vérification de la diversité du dataset
- Vérification de la qualité des données
- Validation finale du dataset

---

## 7. Validation du Dataset

### 7.1 Vérification de la Diversité

```typescript
function validateDiversity(dataset: GoldenDatasetCase[]): DiversityValidation {
  const validation: DiversityValidation = {
    isValid: true,
    issues: []
  };
  
  // Vérification des secteurs
  const sectors = new Set(dataset.map(c => c.job.sector));
  if (sectors.size < 10) {
    validation.isValid = false;
    validation.issues.push(`Secteurs insuffisants : ${sectors.size} (requis : 10)`);
  }
  
  // Vérification des niveaux d'expérience
  const experienceLevels = new Set(dataset.map(c => c.caseClassification.experienceLevel));
  if (experienceLevels.size < 5) {
    validation.isValid = false;
    validation.issues.push(`Niveaux d'expérience insuffisants : ${experienceLevels.size} (requis : 5)`);
  }
  
  // Vérification des types de profil
  const profileTypes = new Set(dataset.map(c => c.caseClassification.profileType));
  if (profileTypes.size < 3) {
    validation.isValid = false;
    validation.issues.push(`Types de profil insuffisants : ${profileTypes.size} (requis : 3)`);
  }
  
  // Vérification des décisions
  const decisions = new Set(dataset.map(c => c.humanDecision.decision));
  if (decisions.size < 2) {
    validation.isValid = false;
    validation.issues.push(`Types de décision insuffisants : ${decisions.size} (requis : 2)`);
  }
  
  return validation;
}
```

### 7.2 Vérification de la Qualité

```typescript
function validateQuality(dataset: GoldenDatasetCase[]): QualityValidation {
  const validation: QualityValidation = {
    isValid: true,
    issues: []
  };
  
  for (const case_ of dataset) {
    // Vérification du CV
    if (case_.cv.skills.length < 3) {
      validation.isValid = false;
      validation.issues.push(`CV ${case_.cv.id} : Compétences insuffisantes`);
    }
    
    // Vérification de la fiche de poste
    if (case_.job.requiredSkills.length < 2) {
      validation.isValid = false;
      validation.issues.push(`Poste ${case_.job.id} : Compétences requises insuffisantes`);
    }
    
    // Vérification de la décision
    if (!case_.humanDecision.justification || case_.humanDecision.justification.length === 0) {
      validation.isValid = false;
      validation.issues.push(`Cas ${case_.id} : Justification manquante`);
    }
  }
  
  return validation;
}
```

---

## 8. Stockage du Dataset

### 8.1 Structure de Base de Données

```sql
CREATE TABLE golden_dataset (
  id VARCHAR(36) PRIMARY KEY,
  
  -- CV
  cv_id VARCHAR(36) NOT NULL,
  cv_candidate_id VARCHAR(36),
  cv_skills JSON NOT NULL,
  cv_experience JSON,
  cv_education JSON,
  cv_certifications JSON,
  cv_languages JSON,
  cv_soft_skills JSON,
  cv_metadata JSON,
  
  -- Poste
  job_id VARCHAR(36) NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  job_description TEXT,
  job_required_skills JSON NOT NULL,
  job_preferred_skills JSON,
  job_experience_required INT,
  job_education_required VARCHAR(100),
  job_sector VARCHAR(50) NOT NULL,
  job_company_size VARCHAR(50),
  job_type VARCHAR(50),
  job_seniority VARCHAR(50),
  
  -- Décision humaine
  human_decision VARCHAR(20) NOT NULL,
  human_confidence VARCHAR(20),
  human_determining_factor VARCHAR(100),
  human_justification JSON,
  human_recruiter_id VARCHAR(36),
  human_decision_date TIMESTAMP,
  
  -- Classification
  case_difficulty VARCHAR(20),
  case_profile_type VARCHAR(20),
  case_sector VARCHAR(50),
  case_seniority VARCHAR(50),
  case_experience_level VARCHAR(20),
  
  -- Métadonnées
  source VARCHAR(20),
  created_at TIMESTAMP,
  validated_by JSON,
  version VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 8.2 Indexation

```sql
CREATE INDEX idx_golden_sector ON golden_dataset(job_sector);
CREATE INDEX idx_golden_seniority ON golden_dataset(job_seniority);
CREATE INDEX idx_golden_decision ON golden_dataset(human_decision);
CREATE INDEX idx_golden_difficulty ON golden_dataset(case_difficulty);
CREATE INDEX idx_golden_profile_type ON golden_dataset(case_profile_type);
```

---

## 9. Utilisation du Dataset

### 9.1 Mesure de l'Accord Moteur/Humain

Le golden dataset est utilisé pour mesurer l'accord entre le moteur et les décisions humaines (voir DOC-008-10).

### 9.2 Validation des Apprentissages

Après chaque cycle d'apprentissage, le golden dataset est utilisé pour valider les modifications :

```typescript
function validateLearningOnGoldenDataset(modification: LearningModification): ValidationResult {
  const beforeScore = calculateGoldenDatasetScore();
  
  // Appliquer la modification
  applyModification(modification);
  
  // Recalculer le score
  const afterScore = calculateGoldenDatasetScore();
  
  // Vérifier si le score a baissé
  if (afterScore < beforeScore - 0.05) {
    return {
      isValid: false,
      reason: `Score golden dataset en baisse : ${beforeScore} → ${afterScore}`,
      rollbackRequired: true
    };
  }
  
  return {
    isValid: true,
    reason: `Score golden dataset stable ou en hausse : ${beforeScore} → ${afterScore}`,
    rollbackRequired: false
  };
}
```

### 9.3 Objectifs de Performance

| Métrique | Objectif MVP | Objectif V2 |
|----------|--------------|-------------|
| Accord moteur/humain | ≥ 75% | ≥ 85% |
| Score golden dataset | ≥ 75% | ≥ 85% |
| Accord par difficulté (easy) | ≥ 90% | ≥ 95% |
| Accord par difficulté (hard) | ≥ 60% | ≥ 75% |
| Accord par profil (standard) | ≥ 85% | ≥ 90% |
| Accord par profil (atypique) | ≥ 65% | ≥ 80% |

---

## 10. Maintenance du Dataset

### 10.1 Révision Trimestrielle

Le golden dataset est révisé trimestriellement :

- **Ajout de nouveaux cas** : Pour maintenir la pertinence
- **Suppression de cas obsolètes** : Cas datant de plus de 2 ans
- **Rééquilibrage** : Pour maintenir la diversité

### 10.2 Versioning

Chaque version du dataset est versionnée :

- **Format :** v1.0, v1.1, v2.0
- **Archivage** : Les versions précédentes sont archivées
- **Traçabilité** : Chaque modification est documentée

### 10.3 Expansion

Le dataset peut être étendu :

- **Volume cible V2** : 200 cas
- **Volume cible V3** : 500 cas
- **Volume cible long terme** : 1000 cas

---

## 11. Exemples de Cas

### 11.1 Cas Standard

```json
{
  "id": "case-001",
  "cv": {
    "id": "cv-001",
    "skills": ["Python", "Docker", "Kubernetes", "AWS"],
    "experience": [
      {
        "title": "Développeur Backend",
        "company": "TechCorp",
        "duration": "3 ans",
        "skills": ["Python", "Docker"]
      }
    ],
    "education": [
      {
        "degree": "Master Informatique",
        "school": "Université Paris",
        "year": 2020
      }
    ]
  },
  "job": {
    "id": "job-001",
    "title": "Développeur DevOps",
    "requiredSkills": ["Python", "Docker", "Kubernetes"],
    "experienceRequired": 3,
    "sector": "Tech / IT",
    "seniority": "Mid"
  },
  "humanDecision": {
    "decision": "retained",
    "confidence": "high",
    "determiningFactor": "technical_skill",
    "justification": [
      "Compétences techniques parfaitement alignées",
      "Expérience pertinente",
      "Formation adaptée"
    ]
  },
  "caseClassification": {
    "difficulty": "easy",
    "profileType": "standard",
    "sector": "Tech / IT",
    "seniority": "Mid",
    "experienceLevel": "mid"
  }
}
```

### 11.2 Cas Atypique

```json
{
  "id": "case-002",
  "cv": {
    "id": "cv-002",
    "skills": ["Python", "Finance", "Analyse de données"],
    "experience": [
      {
        "title": "Analyste Financier",
        "company": "BankCorp",
        "duration": "5 ans",
        "skills": ["Finance", "Analyse de données"]
      },
      {
        "title": "Développeur Python",
        "company": "Startup",
        "duration": "1 an",
        "skills": ["Python"]
      }
    ],
    "education": [
      {
        "degree": "Master Finance",
        "school": "HEC",
        "year": 2018
      }
    ]
  },
  "job": {
    "id": "job-002",
    "title": "Développeur Fintech",
    "requiredSkills": ["Python", "Finance"],
    "experienceRequired": 3,
    "sector": "Finance / Fintech",
    "seniority": "Mid"
  },
  "humanDecision": {
    "decision": "retained",
    "confidence": "medium",
    "determiningFactor": "sector_experience",
    "justification": [
      "Profil atypique mais pertinent pour Fintech",
      "Combinaison rare finance + technique",
      "Capacité d'adaptation démontrée"
    ]
  },
  "caseClassification": {
    "difficulty": "medium",
    "profileType": "atypical",
    "sector": "Finance / Fintech",
    "seniority": "Mid",
    "experienceLevel": "mid"
  }
}
```

### 11.3 Cas Refusé à Tort

```json
{
  "id": "case-003",
  "cv": {
    "id": "cv-003",
    "skills": ["React", "TypeScript", "Node.js"],
    "experience": [
      {
        "title": "Développeur Frontend",
        "company": "WebCorp",
        "duration": "2 ans",
        "skills": ["React", "TypeScript"]
      }
    ],
    "education": [
      {
        "degree": "Licence Informatique",
        "school": "Université Lyon",
        "year": 2022
      }
    ]
  },
  "job": {
    "id": "job-003",
    "title": "Développeur Fullstack",
    "requiredSkills": ["React", "Node.js"],
    "experienceRequired": 2,
    "sector": "Tech / IT",
    "seniority": "Junior"
  },
  "humanDecision": {
    "decision": "rejected",
    "confidence": "medium",
    "determiningFactor": "experience",
    "justification": [
      "Expérience insuffisante pour niveau requis"
    ],
    "regretted": true,
    "regretReason": "Candidat a réussi ailleurs avec performance excellente"
  },
  "caseClassification": {
    "difficulty": "medium",
    "profileType": "standard",
    "sector": "Tech / IT",
    "seniority": "Junior",
    "experienceLevel": "junior"
  }
}
```

---

## 12. Métriques du Dataset

### 12.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétude CV | CVs complets / total | 100% |
| Taux de complétude Poste | Postes complets / total | 100% |
| Taux de justification | Décisions justifiées / total | 100% |
| Diversité secteur | Nombre de secteurs | ≥ 10 |
| Diversité niveau | Nombre de niveaux | 5 |

### 12.2 Métriques de Représentativité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Nombre de recruteurs | Recruteurs différents | ≥ 5 |
| Nombre d'entreprises | Entreprises différentes | ≥ 3 |
| Période couverte | Durée en mois | ≥ 6 |
| Cas réels | Cas issus de production | ≥ 80% |

---

## 13. Intégration avec MVP-008

### 13.1 Utilisation Pré-Déploiement

Avant le déploiement de MVP-008 :

- Mesurer l'accord moteur/humain sur le golden dataset
- Objectif : ≥ 75%
- Si objectif non atteint : ajustement requis

### 13.2 Utilisation Post-Déploiement

Après chaque cycle d'apprentissage :

- Recalculer l'accord moteur/humain sur le golden dataset
- Si l'accord baisse de > 5% : rollback immédiat
- Si l'accord augmente : validation de l'apprentissage

---

## 14. Conclusion

La spécification du golden dataset garantit :

- **Volume suffisant** de cas pour la validation
- **Diversité obligatoire** pour la représentativité
- **Qualité des données** pour la fiabilité
- **Cas spéciaux inclus** pour la robustesse
- **Validation continue** pour l'amélioration
- **Traçabilité** de toutes les modifications
