# DOC-029-02 : Modèle de Pattern de Succès (Structure Normée)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle normé de pattern de succès pour MVP-029 Institutional Memory Engine. Ce modèle structure les patterns de succès avec des champs normalisés pour assurer la cohérence, la comparabilité, et l'exploitation des patterns à travers le temps et les contextes.

---

## 2. Principe Fondateur

Un pattern de succès est une structure normée qui capture ce que le moteur a appris sur ce qui prédit le succès dans un contexte spécifique. La structure normée assure que tous les patterns sont comparables, exploitables, et évolutifs. Chaque pattern est anonymisé et agrégé pour respecter le RGPD.

---

## 3. Structure du Pattern de Succès

### 3.1 Identifiant du Pattern

**Champ :** patternId

**Format :** UUID

**Description :** Identifiant unique du pattern

**Exemple :** "550e8400-e29b-41d4-a716-446655440000"

---

### 3.2 Contexte du Pattern

**Champ :** context

**Format :** Objet JSON

**Description :** Contexte dans lequel le pattern a été identifié

**Sous-champs :**
- sector : Secteur d'activité (ex: "Fintech", "SaaS", "E-commerce")
- companySize : Taille de l'entreprise (ex: "Startup <50", "Scale-up 200-500", "Grand groupe >1000")
- jobType : Type de poste (ex: "Head of Product", "CTO", "VP Sales")
- hierarchyLevel : Niveau hiérarchique (ex: "C-Level", "VP", "Manager", "Individual Contributor")
- developmentStage : Stade de développement (ex: "Seed", "Série A", "Série B", "IPO", "Mature")

**Exemple :**
```json
{
  "sector": "Fintech",
  "companySize": "Scale-up 200-500",
  "jobType": "Head of Product",
  "hierarchyLevel": "VP",
  "developmentStage": "Série B"
}
```

---

### 3.3 Profil des Candidats qui ont Réussi

**Champ :** successfulProfile

**Format :** Objet JSON

**Description :** Caractéristiques des candidats qui ont réussi dans ce contexte

**Sous-champs :**
- commonCharacteristics : Caractéristiques communes aux candidats qui ont réussi
- nonPredictiveCharacteristics : Caractéristiques non prédictives dans ce contexte

**Exemple :**
```json
{
  "commonCharacteristics": [
    "Expérience startup obligatoire",
    "Expérience en produit B2B",
    "Capacité à travailler sans équipe (solo au début)",
    "Appétence pour la relation client directe",
    "Profil 'builder' plus que 'optimizer'"
  ],
  "nonPredictiveCharacteristics": [
    "Diplôme (non corrélé au succès)",
    "Expérience grand groupe (corrélée négativement)",
    "Nombre d'années total (non corrélé)"
  ]
}
```

---

### 3.4 Signaux Détectés en Entretien

**Champ :** interviewSignals

**Format :** Objet JSON

**Description :** Signaux détectés en entretien qui prédisent le succès ou l'échec

**Sous-champs :**
- successSignals : Signaux qui prédisaient le succès
- failureSignals : Signaux qui prédisaient l'échec

**Exemple :**
```json
{
  "successSignals": [
    "\"J'ai construit X de zéro\"",
    "Exemples chiffrés spontanés",
    "Curiosité client démontrée",
    "Tolérance à l'ambiguïté haute"
  ],
  "failureSignals": [
    "Besoin fort de processus établis",
    "Références uniquement en grand groupe",
    "Discours centré sur l'équipe future avant de parler des résultats"
  ]
}
```

---

### 3.5 Résultats Observés

**Champ :** results

**Format :** Objet JSON

**Description :** Résultats observés pour les candidats avec et sans les caractéristiques du pattern

**Sous-champs :**
- withCharacteristics : Résultats pour les candidats avec les caractéristiques
- withoutCharacteristics : Résultats pour les candidats sans les caractéristiques

**Exemple :**
```json
{
  "withCharacteristics": {
    "successRate12Months": 0.84,
    "successRate24Months": 0.71,
    "averagePerformance": 8.2,
    "averageRetention": 0.89
  },
  "withoutCharacteristics": {
    "successRate12Months": 0.38,
    "successRate24Months": 0.24,
    "averagePerformance": 5.8,
    "averageRetention": 0.62
  }
}
```

---

### 3.6 Niveau de Confiance du Pattern

**Champ :** confidence

**Format :** Objet JSON

**Description :** Niveau de confiance du pattern basé sur le nombre de cas observés

**Sous-champs :**
- basedOnCases : Nombre de cas sur lesquels le pattern est basé
- level : Niveau de confiance (low / moderate / high)
- lastUpdated : Date de la dernière mise à jour
- estimatedValidity : Validité estimée en mois

**Exemple :**
```json
{
  "basedOnCases": 47,
  "level": "high",
  "lastUpdated": "2026-08-03T00:00:00Z",
  "estimatedValidity": 18
}
```

---

### 3.7 Métadonnées du Pattern

**Champ :** metadata

**Format :** Objet JSON

**Description :** Métadonnées du pattern

**Sous-champs :**
- createdAt : Date de création du pattern
- createdBy : Source du pattern (ex: "MVP-008 Learning Engine", "Manual Entry")
- version : Version du pattern
- status : Statut du pattern (draft / active / deprecated)
- tags : Tags pour la classification

**Exemple :**
```json
{
  "createdAt": "2026-08-03T00:00:00Z",
  "createdBy": "MVP-008 Learning Engine",
  "version": "1.0",
  "status": "active",
  "tags": ["fintech", "product", "b2b", "startup"]
}
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface SuccessPattern {
  patternId: string;
  
  context: {
    sector: string;
    companySize: string;
    jobType: string;
    hierarchyLevel: string;
    developmentStage: string;
  };
  
  successfulProfile: {
    commonCharacteristics: string[];
    nonPredictiveCharacteristics: string[];
  };
  
  interviewSignals: {
    successSignals: string[];
    failureSignals: string[];
  };
  
  results: {
    withCharacteristics: {
      successRate12Months: number;
      successRate24Months: number;
      averagePerformance: number;
      averageRetention: number;
    };
    withoutCharacteristics: {
      successRate12Months: number;
      successRate24Months: number;
      averagePerformance: number;
      averageRetention: number;
    };
  };
  
  confidence: {
    basedOnCases: number;
    level: 'low' | 'moderate' | 'high';
    lastUpdated: Date;
    estimatedValidity: number; // months
  };
  
  metadata: {
    createdAt: Date;
    createdBy: string;
    version: string;
    status: 'draft' | 'active' | 'deprecated';
    tags: string[];
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE success_pattern (
  id VARCHAR(36) PRIMARY KEY,
  
  context JSON NOT NULL,
  successful_profile JSON NOT NULL,
  interview_signals JSON NOT NULL,
  results JSON NOT NULL,
  confidence JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_success_pattern_sector ON success_pattern((context->>'sector'));
CREATE INDEX idx_success_pattern_company_size ON success_pattern((context->>'companySize'));
CREATE INDEX idx_success_pattern_job_type ON success_pattern((context->>'jobType'));
CREATE INDEX idx_success_pattern_confidence_level ON success_pattern((confidence->>'level'));
CREATE INDEX idx_success_pattern_status ON success_pattern((metadata->>'status'));
CREATE INDEX idx_success_pattern_created_at ON success_pattern(created_at);
```

---

## 6. API Endpoints

```typescript
// POST /api/institutional-memory/patterns
async function createSuccessPattern(pattern: Omit<SuccessPattern, 'patternId' | 'metadata'>): Promise<SuccessPattern> {
  return await createSuccessPattern(pattern);
}

// GET /api/institutional-memory/patterns/:patternId
async function getSuccessPattern(patternId: string): Promise<SuccessPattern> {
  return await getSuccessPatternById(patternId);
}

// GET /api/institutional-memory/patterns
async function listSuccessPatterns(filters: PatternFilters): Promise<SuccessPattern[]> {
  return await listSuccessPatterns(filters);
}

// GET /api/institutional-memory/patterns/context/:sector/:companySize/:jobType
async function getPatternsByContext(sector: string, companySize: string, jobType: string): Promise<SuccessPattern[]> {
  return await getPatternsByContext(sector, companySize, jobType);
}

// PUT /api/institutional-memory/patterns/:patternId
async function updateSuccessPattern(patternId: string, pattern: Partial<SuccessPattern>): Promise<SuccessPattern> {
  return await updateSuccessPattern(patternId, pattern);
}

// DELETE /api/institutional-memory/patterns/:patternId
async function deleteSuccessPattern(patternId: string): Promise<void> {
  return await deleteSuccessPattern(patternId);
}

// POST /api/institutional-memory/patterns/:patternId/deprecate
async function deprecateSuccessPattern(patternId: string, reason: string): Promise<SuccessPattern> {
  return await deprecateSuccessPattern(patternId, reason);
}
```

---

## 7. Algorithme de Création de Pattern

### 7.1 Processus Global

```typescript
async function createSuccessPatternFromData(cases: RecruitmentCase[]): Promise<SuccessPattern> {
  // 1. Analyse du contexte
  const context = await analyzeContext(cases);
  
  // 2. Identification des caractéristiques communes
  const successfulProfile = await identifySuccessfulProfile(cases);
  
  // 3. Extraction des signaux d'entretien
  const interviewSignals = await extractInterviewSignals(cases);
  
  // 4. Calcul des résultats
  const results = await calculateResults(cases);
  
  // 5. Évaluation de la confiance
  const confidence = await evaluateConfidence(cases);
  
  // 6. Construction du pattern
  const pattern: SuccessPattern = {
    patternId: generatePatternId(),
    context,
    successfulProfile,
    interviewSignals,
    results,
    confidence,
    metadata: {
      createdAt: new Date(),
      createdBy: 'MVP-008 Learning Engine',
      version: '1.0',
      status: 'active',
      tags: [context.sector, context.jobType, context.companySize]
    }
  };
  
  // 7. Sauvegarde du pattern
  await saveSuccessPattern(pattern);
  
  return pattern;
}
```

---

### 7.2 Identification du Profil de Succès

```typescript
async function identifySuccessfulProfile(cases: RecruitmentCase[]): Promise<{
  commonCharacteristics: string[];
  nonPredictiveCharacteristics: string[];
}> {
  // Séparation des cas réussis et échoués
  const successfulCases = cases.filter(c => c.success);
  const failedCases = cases.filter(c => !c.success);
  
  // Identification des caractéristiques communes aux cas réussis
  const commonCharacteristics = await identifyCommonCharacteristics(successfulCases);
  
  // Identification des caractéristiques non prédictives
  const nonPredictiveCharacteristics = await identifyNonPredictiveCharacteristics(successfulCases, failedCases);
  
  return {
    commonCharacteristics,
    nonPredictiveCharacteristics
  };
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétude | Patterns complets / total | ≥ 95% |
- Confiance moyenne | Confiance moyenne des patterns | ≥ 0.7 |
- Validité moyenne | Validité moyenne des patterns | ≥ 12 mois |
- Satisfaction recruteurs | Satisfaction avec les patterns | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Précision des patterns | Précision des prédictions | ≥ 75% |
- Utilisation des patterns | Patterns utilisés / total | ≥ 80% |
- Amélioration des décisions | Amélioration de la qualité des décisions | ≥ 20% |

---

## 9. Conclusion

Le modèle normé de pattern de succès structure les patterns avec des champs normalisés pour assurer la cohérence, la comparabilité, et l'exploitation des patterns à travers le temps et les contextes. Le modèle respecte strictement le RGPD (anonymisation complète) et s'intègre avec les modules existants (MVP-008).

**Points clés :**
- Structure normée avec 7 sections
- Contexte détaillé (5 dimensions)
- Profil de succès avec caractéristiques
- Signaux d'entretien (succès / échec)
- Résultats observés (avec / sans caractéristiques)
- Niveau de confiance basé sur les cas
- Métadonnées complètes
- RGPD absolu (anonymisation)
- Intégration avec MVP-008
