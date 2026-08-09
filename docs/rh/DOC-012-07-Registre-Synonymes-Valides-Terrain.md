# DOC-012-07 : Registre des Synonymes Validés Terrain

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le registre des synonymes validés terrain pour MVP-012. Ce registre documente les synonymes issus des feedbacks beta recruteurs, validés croisés, et intégrés dans le Knowledge Pack.

---

## 2. Principe Fondateur

Les synonymes terrain ont un ROI immédiat. Ils capturent les termes réels utilisés dans les CV et les offres, permettant une meilleure reconnaissance et un meilleur matching. La validation croisée est obligatoire pour garantir la qualité.

---

## 3. Sources des Synonymes Terrain

### 3.1 Sources Principales

| Source | Description | Fréquence |
|--------|-------------|-----------|
| Feedbacks beta recruteurs | Termes mentionnés lors des sessions hebdomadaires | Hebdomadaire |
| CV analysés | Termes extraits des CV analysés pendant le beta | Continue |
| Offres analysées | Termes extraits des offres d'emploi analysées | Continue |
| Entretiens recruteurs | Termes mentionnés lors des entretiens | Mensuelle |

### 3.2 Processus d'Extraction

```typescript
async function extractTerrainSynonyms(): Promise<TerrainSynonym[]> {
  const synonyms: TerrainSynonym[] = [];
  
  // Extraction des feedbacks beta
  const betaFeedbacks = await extractFromBetaFeedbacks();
  synonyms.push(...betaFeedbacks);
  
  // Extraction des CV analysés
  const cvTerms = await extractFromAnalyzedCVs();
  synonyms.push(...cvTerms);
  
  // Extraction des offres analysées
  const offerTerms = await extractFromAnalyzedOffers();
  synonyms.push(...offerTerms);
  
  // Extraction des entretiens
  const interviewTerms = await extractFromInterviews();
  synonyms.push(...interviewTerms);
  
  // Déduplication
  const deduplicated = deduplicateSynonyms(synonyms);
  
  return deduplicated;
}
```

---

## 4. Processus de Validation Croisée

### 4.1 Flux de Validation

```
Synonyme extrait
    ↓
Vérification de la pertinence
    ↓
Recherche dans les sources officielles
    ↓
Validation par DRH référent
    ↓
Test sur golden dataset
    ↓
Validation croisée (2+ validateurs)
    ↓
Intégration dans KP
    ↓
Documentation dans registre
```

### 4.2 Algorithme de Validation

```typescript
async function validateTerrainSynonym(synonym: TerrainSynonym): Promise<ValidationResult> {
  // Étape 1 : Vérification de la pertinence
  const relevanceCheck = await checkRelevance(synonym);
  if (!relevanceCheck.isRelevant) {
    return { valid: false, reason: 'not_relevant' };
  }
  
  // Étape 2 : Recherche dans les sources officielles
  const officialSourceCheck = await checkOfficialSources(synonym);
  if (officialSourceCheck.found) {
    // Le synonyme existe déjà dans une source officielle
    return { valid: true, source: 'official', officialSource: officialSourceCheck.source };
  }
  
  // Étape 3 : Validation par DRH référent
  const drhValidation = await validateWithDRH(synonym);
  if (!drhValidation.valid) {
    return { valid: false, reason: drhValidation.reason };
  }
  
  // Étape 4 : Test sur golden dataset
  const testResult = await testOnGoldenDataset(synonym);
  if (!testResult.passed) {
    return { valid: false, reason: 'test_failed' };
  }
  
  // Étape 5 : Validation croisée
  const crossValidation = await crossValidate(synonym);
  if (!crossValidation.valid) {
    return { valid: false, reason: 'cross_validation_failed' };
  }
  
  // Étape 6 : Intégration dans KP
  await integrateIntoKP(synonym);
  
  // Étape 7 : Documentation dans registre
  await documentInRegistry(synonym);
  
  return { valid: true, source: 'terrain' };
}
```

---

## 5. Structure du Registre

### 5.1 Template d'Entrée

```
┌─────────────────────────────────────────┐
│ REGISTRE DES SYNONYMES TERRAIN        │
├─────────────────────────────────────────┤
│                                         │
| Synonyme ID : [SYN-ID]                │
| Terme : [Terme]                        │
| Canonique : [Terme canonique]          │
| Catégorie : [Compétence / Métier / Certification / Autre]│
|                                         │
| Source :                              │
| ○ Feedback beta                       │
| ○ CV analysé                         │
| ○ Offre analysée                      │
| ○ Entretien recruteur                 │
|                                         │
| Contexte : [____]                     │
|                                         │
| Validation :                          │
| ○ Validé                             │
| ○ En attente                          │
| ○ Rejeté                             │
│                                         │
| Validation croisée :                  │
| • Validateur 1 : [Nom] - [Date]       │
| • Validateur 2 : [Nom] - [Date]       │
| • Validateur 3 : [Nom] - [Date]       │
│                                         │
| Test golden dataset :                  │
| ○ Passé                              │
| ○ Échoué                             │
|                                         │
| Intégration KP :                       │
| ○ Intégré                            │
| ○ Non intégré                         │
| Date d'intégration : [DD/MM/YYYY]     │
│                                         │
| Métriques d'utilisation :             │
| • Utilisations : [XXX]                │
| • Résolutions réussies : [XXX]       │
| • Taux de résolution : [XX%]          │
│                                         │
| Dernière mise à jour : [DD/MM/YYYY]    │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 Structure de Données (TypeScript)

```typescript
interface TerrainSynonymRegistry {
  synonymId: string;
  term: string;
  canonical: string;
  category: 'skill' | 'job' | 'certification' | 'other';
  
  source: {
    type: 'beta_feedback' | 'cv_analyzed' | 'offer_analyzed' | 'interview';
    sourceId: string;
    date: Date;
    context: string;
  };
  
  validation: {
    status: 'pending' | 'validated' | 'rejected';
    validatedBy: string[];
    validationDate: Date[];
    rejectionReason?: string;
  };
  
  crossValidation: {
    validators: {
      name: string;
      decision: 'approve' | 'reject' | 'abstain';
      date: Date;
      comments?: string;
    }[];
    consensus: boolean;
  };
  
  goldenDatasetTest: {
    passed: boolean;
    testDate: Date;
    resultDetails: string;
  };
  
  kpIntegration: {
    integrated: boolean;
    integrationDate?: Date;
    kpId?: string;
  };
  
  usageMetrics: {
    usageCount: number;
    successfulResolutions: number;
    resolutionRate: number;
    lastUsed?: Date;
  };
  
  metadata: {
    createdBy: string;
    createdDate: Date;
    lastUpdated: Date;
    lastUpdatedBy: string;
  };
}
```

---

## 6. Processus de Validation Croisée

### 6.1 Critères de Validation Croisée

| Critère | Description | Condition |
|---------|-------------|-----------|
| Pertinence RH | Le synonyme est-il pertinent pour le domaine RH ? | Oui |
| Exactitude | Le synonyme est-il exact (pas de faute d'orthographe) ? | Oui |
| Cohérence | Le synonyme est-il cohérent avec le terme canonique ? | Oui |
| Usage réel | Le synonyme est-il réellement utilisé dans les CV/offres ? | Oui |
| Pas de duplication | Le synonyme n'existe-t-il pas déjà dans KP ? | Oui |

### 6.2 Grille de Validation Croisée

```
┌─────────────────────────────────────────┐
│ GRILLE DE VALIDATION CROISÉE         │
├─────────────────────────────────────────┤
│                                         │
| Synonyme : [Terme]                     │
| Canonique : [Terme canonique]          │
| Catégorie : [____]                     │
| Source : [____]                        │
| Contexte : [____]                     │
│                                         │
| Critères :                             │
│                                         │
| Pertinence RH :                        │
| ○ Valide                              │
| ○ Non valide → Rejet                  │
| Commentaires : [____]                 │
│                                         │
| Exactitude :                           │
| ○ Valide                              │
| ○ Non valide → Corriger / Rejet       │
| Commentaires : [____]                 │
│                                         │
| Cohérence :                            │
| ○ Valide                              │
| ○ Non valide → Rejet                  │
| Commentaires : [____]                 │
│                                         │
| Usage réel :                           │
| ○ Valide                              │
| ○ Non valide → Rejet                  │
| Commentaires : [____]                 │
│                                         │
| Pas de duplication :                    │
| ○ Valide                              │
| ○ Non valide → Rejet                  │
| Commentaires : [____]                 │
│                                         │
| Décision :                             │
| ○ Valider                             │
| ○ Rejeter                             │
│ ○ Demander clarification               │
│                                         │
| Commentaires généraux :                │
│ [____]                                  │
│ [____]                                  │
│                                         │
| Validé par : [Nom]                     │
| Date : [DD/MM/YYYY]                    │
│ Signature : [________________]           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. Intégration dans le Knowledge Pack

### 7.1 Processus d'Intégration

```typescript
async function integrateIntoKP(synonym: TerrainSynonym): Promise<void> {
  // Recherche du terme canonique dans KP
  const canonicalEntry = await findInKP(synonym.canonical);
  
  if (!canonicalEntry) {
    // Création d'une nouvelle entrée
    await createKPEntry({
      id: `KP002-${synonym.canonical}`,
      term: synonym.canonical,
      synonyms: [synonym.term],
      category: synonym.category,
      source: 'terrain',
      lastUpdated: new Date()
    });
  } else {
    // Ajout du synonyme à l'entrée existante
    await addSynonymToKPEntry(canonicalEntry.id, synonym.term);
  }
  
  // Mise à jour des métriques
  await updateKPMetrics();
}
```

### 7.2 Mapping avec KP-002

```typescript
interface KP002SynonymEntry {
  id: string;
  canonicalTerm: string;
  synonyms: string[];
  category: 'skill' | 'job' | 'certification' | 'other';
  source: 'official' | 'terrain';
  validation: {
    validatedBy: string[];
    validationDate: Date;
  };
  usageMetrics: {
    usageCount: number;
    resolutionRate: number;
  };
  lastUpdated: Date;
}
```

---

## 8. Stockage et Gestion

### 8.1 Stockage

Le registre est stocké dans :

- **Base de données** : Données structurées
- **Notion** : Base de données collaborative
- **Git** : Version control (format markdown)

### 8.2 Schéma SQL

```sql
CREATE TABLE terrain_synonym_registry (
  id VARCHAR(36) PRIMARY KEY,
  term VARCHAR(255) NOT NULL,
  canonical VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  
  source_type VARCHAR(50) NOT NULL,
  source_id VARCHAR(255),
  source_date TIMESTAMP NOT NULL,
  context TEXT,
  
  validation_status VARCHAR(20) NOT NULL,
  validated_by JSON,
  validation_date TIMESTAMP,
  rejection_reason TEXT,
  
  cross_validation JSON,
  golden_dataset_test_passed BOOLEAN,
  golden_dataset_test_date TIMESTAMP,
  golden_dataset_test_details TEXT,
  
  kp_integrated BOOLEAN NOT NULL,
  kp_integration_date TIMESTAMP,
  kp_id VARCHAR(36),
  
  usage_count INT DEFAULT 0,
  successful_resolutions INT DEFAULT 0,
  resolution_rate DECIMAL(5,2),
  last_used TIMESTAMP,
  
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated_by VARCHAR(36),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE (term, canonical)
);

CREATE INDEX idx_synonym_term ON terrain_synonym_registry(term);
CREATE INDEX idx_synonym_canonical ON terrain_synonym_registry(canonical);
CREATE INDEX idx_synonym_status ON terrain_synonym_registry(validation_status);
CREATE INDEX idx_synonym_category ON terrain_synonym_registry(category);
```

### 8.3 Nom de Fichier

Format : `REGISTRE-SYNONYMES-[YYYY-MM].md`

Exemple : `REGISTRE-SYNONYMES-2026-10.md`

---

## 9. Métriques d'Utilisation

### 9.1 Métriques de Suivi

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Synonymes validés / total | ≥ 80% |
| Taux de résolution | Résolutions réussies / total | ≥ 90% |
| Taux d'utilisation | Synonymes utilisés / total | ≥ 50% |
| Temps de validation | Temps moyen de validation | < 3 jours |

### 9.2 Rapport Mensuel

```
┌─────────────────────────────────────────┐
│ RAPPORT MENSUEL - SYNONYMES TERRAIN   │
├─────────────────────────────────────────┤
│                                         │
| Mois : [Mois] [Année]                  │
│                                         │
| Synonymes extraits : [XXX]              │
| Synonymes validés : [XXX]               │
| Synonymes rejetés : [XXX]               │
| Taux de validation : [XX%]              │
│                                         │
| Synonymes intégrés : [XXX]              │
| Synonymes utilisés : [XXX]              │
| Taux d'utilisation : [XX%]              │
│                                         │
| Taux de résolution : [XX%]              │
|                                         │
| Top 5 synonymes les plus utilisés :     │
| 1. [Synonyme] - [XXX] utilisations      │
| 2. [Synonyme] - [XXX] utilisations      │
| 3. [Synonyme] - [XXX] utilisations      │
| 4. [Synonyme] - [XXX] utilisations      │
| 5. [Synonyme] - [XXX] utilisations      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 10. Exemples de Synonymes Terrain

### 10.1 Synonymes Validés

| Terme | Canonique | Catégorie | Source | Contexte |
|------|-----------|----------|--------|----------|
| Dev React | Développeur React | Compétence | CV analysé | CV d'un développeur |
| Fullstack JS | Développeur Full Stack JavaScript | Compétence | Offre analysée | Offre d'emploi |
| Lead Dev | Lead Developer | Métier | Feedback beta | Feedback recruteur |
| Data Scientist IA | Data Scientist Intelligence Artificielle | Compétence | CV analysé | CV spécialisé |
| Scrum Master Agile | Scrum Master | Certification | Entretien | Certif mentionnée |

### 10.2 Synonymes Rejetés

| Terme | Canonique | Catégorie | Raison de rejet |
|------|-----------|----------|-----------------|
| Dev web | Développeur Web | Compétence | Trop générique |
| Boss | Manager | Métier | Non professionnel |
| Codeur | Développeur | Compétence | Langage familier |

---

## 11. Maintenance du Registre

### 11.1 Fréquence de Maintenance

| Activité | Fréquence |
|----------|-----------|
| Extraction de nouveaux synonymes | Mensuelle |
| Validation croisée | Mensuelle |
| Intégration dans KP | Mensuelle |
| Mise à jour des métriques | Mensuelle |
| Nettoyage (synonymes non utilisés) | Trimestrielle |
| Audit de qualité | Semestrielle |

### 11.2 Processus de Nettoyage

```typescript
async function cleanupUnusedSynonyms(): Promise<void> {
  // Récupérer les synonymes non utilisés depuis 6 mois
  const unusedSynonyms = await getUnusedSynonyms(6);
  
  for (const synonym of unusedSynonyms) {
    // Vérifier si le synonyme est toujours pertinent
    const relevanceCheck = await checkRelevance(synonym);
    
    if (!relevanceCheck.isRelevant) {
      // Supprimer du registre
      await removeFromRegistry(synonym.id);
      
      // Supprimer de KP si intégré
      if (synonym.kpIntegration.integrated) {
        await removeFromKP(synonym.kpIntegration.kpId);
      }
    }
  }
}
```

---

## 12. Accès et Permissions

### 12.1 Rôles et Permissions

| Rôle | Lecture | Écriture | Validation | Administration |
|------|---------|----------|------------|----------------|
| Équipe beta | ✅ | ✅ | ❌ | ❌ |
| DRH référent | ✅ | ❌ | ✅ | ❌ |
| Équipe technique | ✅ | ✅ | ❌ | ❌ |
| Équipe produit | ✅ | ✅ | ✅ | ❌ |
| Administrateur | ✅ | ✅ | ✅ | ✅ |

### 12.2 API Endpoints

```typescript
// POST /api/terrain-synonyms
async function addTerrainSynonym(synonym: TerrainSynonym): Promise<TerrainSynonym> {
  return await addSynonym(synonym);
}

// GET /api/terrain-synonyms
async function getTerrainSynonyms(filters?: SynonymFilters): Promise<TerrainSynonym[]> {
  return await getSynonyms(filters);
}

// POST /api/terrain-synonyms/:id/validate
async function validateSynonym(id: string, validation: Validation): Promise<ValidationResult> {
  return await validate(id, validation);
}

// POST /api/terrain-synonyms/:id/integrate
async function integrateSynonym(id: string): Promise<IntegrationResult> {
  return await integrate(id);
}

// GET /api/terrain-synonyms/metrics
async function getSynonymMetrics(): Promise<SynonymMetrics> {
  return await getMetrics();
}
```

---

## 13. Conclusion

Le registre des synonymes validés terrain capture les termes réels utilisés dans les CV et les offres, permettant une meilleure reconnaissance et un meilleur matching. La validation croisée obligatoire garantit la qualité des synonymes intégrés dans le Knowledge Pack.

**Points clés :**
- 4 sources de synonymes terrain (feedbacks beta, CV, offres, entretiens)
- Processus de validation croisée obligatoire
- Grille de validation structurée
- Intégration automatique dans KP-002
- Métriques d'utilisation suivies
- Maintenance régulière (nettoyage, audit)
