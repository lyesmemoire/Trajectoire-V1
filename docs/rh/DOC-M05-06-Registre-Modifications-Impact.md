# DOC-M05-06 : Registre des Modifications et leur Impact

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le registre des modifications et leur impact pour le MVP-META-05 Feedback Intelligence Engine. Ce document structure le registre qui trace toutes les modifications apportées au moteur et mesure leur impact sur la précision.

---

## 2. Principe Fondateur

Le registre des modifications garantit la traçabilité complète de toutes les modifications apportées au moteur, permet de mesurer leur impact, et facilite l'analyse des tendances d'amélioration ou de dégradation.

---

## 3. Structure du Registre

### 3.1 Format d'Entrée

Chaque modification est enregistrée avec les informations suivantes :

```markdown
## MODIFICATION #MOD-XXX

**Date :** [Date]
**Règle modifiée :** [Nom de la règle]
**Type de modification :** [Pondération / Seuil / Ajout de facteur / Suppression de facteur]

---

### Description de la modification

**Règle actuelle :** [description]
**Règle modifiée :** [description]
**Diff :** [diff]

---

### Raison de la modification

**Problème identifié :** [description]
**Cas identifiés :** [liste des cas]
**Impact attendu :** [description]

---

### Validation

**Validateur :** [DRH]
**Date de validation :** [Date]
**Statut :** [Approuvé / Rejeté / Révision demandée]

---

### Déploiement

**Date de déploiement :** [Date]
**Version précédente :** [vX.X]
**Version nouvelle :** [vY.Y]

---

### Impact mesuré

**Précision avant :** X%
**Précision après :** Y%
**Delta :** Z%

**Dimensions affectées :**
- [Dimension 1] : [impact]
- [Dimension 2] : [impact]

---

### Conclusion

**Statut final :** [Succès / Échec / En attente]
**Rollback effectué :** [Oui/Non]
**Date de rollback :** [Date si applicable]
```

---

## 4. Types de Modifications Tracées

### 4.1 Modification de Pondération

**Exemple :**
```
## MODIFICATION #MOD-001

**Date :** 2026-08-15
**Règle modifiée :** Calcul de la maturité
**Type de modification :** Pondération

---

### Description de la modification

**Règle actuelle :** Score = (expérience × 0.5) + (responsabilités × 0.3) + (formation × 0.2)
**Règle modifiée :** Score = (expérience × 0.4) + (responsabilités × 0.4) + (formation × 0.2)
**Diff :** -0.1 sur expérience, +0.1 sur responsabilités

---

### Raison de la modification

**Problème identifié :** Surévaluation systématique de la maturité pour les profils juniors
**Cas identifiés :** CAND-XXX, CAND-YYY, CAND-ZZZ
**Impact attendu :** Réduction de 0.5 points pour les profils juniors

---

### Validation

**Validateur :** DRH Jean Dupont
**Date de validation :** 2026-08-15
**Statut :** Approuvé

---

### Déploiement

**Date de déploiement :** 2026-08-15
**Version précédente :** v1.0
**Version nouvelle :** v1.1

---

### Impact mesuré

**Précision avant :** 80%
**Précision après :** 82%
**Delta :** +2%

**Dimensions affectées :**
- Maturité : +3% de précision
- Potentiel : 0% d'impact

---

### Conclusion

**Statut final :** Succès
**Rollback effectué :** Non
```

---

### 4.2 Modification de Seuil

**Exemple :**
```
## MODIFICATION #MOD-002

**Date :** 2026-08-20
**Règle modifiée :** Seuil de recommandation
**Type de modification :** Seuil

---

### Description de la modification

**Règle actuelle :** Si score ≥ 4/5 → Recommandé
**Règle modifiée :** Si score ≥ 3.5/5 → Recommandé
**Diff : -0.5 points sur le seuil

---

### Raison de la modification

**Problème identifié :** Trop de faux négatifs (candidats qualifiés non recommandés)
**Cas identifiés :** CAND-AAA, CAND-BBB, CAND-CCC
**Impact attendu :** Réduction de 15% des faux négatifs

---

### Validation

**Validateur :** DRH Marie Martin
**Date de validation :** 2026-08-20
**Statut :** Approuvé

---

### Déploiement

**Date de déploiement :** 2026-08-20
**Version précédente :** v1.1
**Version nouvelle :** v1.2

---

### Impact mesuré

**Précision avant :** 82%
**Précision après :** 84%
**Delta :** +2%

**Dimensions affectées :**
- Faux négatifs : -15%
- Faux positifs : +5%

---

### Conclusion

**Statut final :** Succès
**Rollback effectué :** Non
```

---

### 4.3 Ajout de Facteur

**Exemple :**
```
## MODIFICATION #MOD-003

**Date :** 2026-08-25
**Règle modifiée :** Calcul du culture fit
**Type de modification :** Ajout de facteur

---

### Description de la modification

**Règle actuelle :** Score = (valeurs × 0.6) + (style × 0.4)
**Règle modifiée :** Score = (valeurs × 0.5) + (style × 0.3) + (équipe × 0.2)
**Diff :** Ajout du facteur équipe avec pondération 0.2

---

### Raison de la modification

**Problème identifié :** Sous-évaluation systématique du culture fit
**Cas identifiés :** CAND-DDD, CAND-EEE, CAND-FFF
**Impact attendu :** Amélioration de 4% de la précision sur culture fit

---

### Validation

**Validateur :** DRH Pierre Durand
**Date de validation :** 2026-08-25
**Statut :** Approuvé

---

### Déploiement

**Date de déploiement :** 2026-08-25
**Version précédente :** v1.2
**Version nouvelle :** v1.3

---

### Impact mesuré

**Précision avant :** 84%
**Précision après :** 85%
**Delta :** +1%

**Dimensions affectées :**
- Culture fit : +4% de précision
- Performance globale : +1% de précision

---

### Conclusion

**Statut final :** Succès
**Rollback effectué :** Non
```

---

### 4.4 Suppression de Facteur

**Exemple :**
```
## MODIFICATION #MOD-004

**Date :** 2026-08-30
**Règle modifiée :** Calcul du potentiel
**Type de modification :** Suppression de facteur

---

### Description de la modification

**Règle actuelle :** Score = (ambition × 0.4) + (curiosité × 0.3) + (âge × 0.2) + (diplôme × 0.1)
**Règle modifiée :** Score = (ambition × 0.5) + (curiosité × 0.4) + (diplôme × 0.1)
**Diff :** Suppression du facteur âge

---

### Raison de la modification

**Problème identifié :** Biais d'âge détecté
**Cas identifiés :** Analyse globale sur 100 cas
**Impact attendu :** Réduction du biais d'âge sans impact sur la précision

---

### Validation

**Validateur :** DRH Sophie Bernard
**Date de validation :** 2026-08-30
**Statut :** Approuvé

---

### Déploiement

**Date de déploiement :** 2026-08-30
**Version précédente :** v1.3
**Version nouvelle :** v1.4

---

### Impact mesuré

**Précision avant :** 85%
**Précision après :** 85%
**Delta :** 0%

**Dimensions affectées :**
- Biais d'âge : -80%
- Précision globale : 0% d'impact

---

### Conclusion

**Statut final :** Succès
**Rollback effectué :** Non
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface ModificationRegistryEntry {
  entryId: string;
  modificationNumber: string;
  
  modificationDate: Date;
  ruleModified: string;
  modificationType: 'weightAdjustment' | 'thresholdAdjustment' | 'factorAddition' | 'factorRemoval';
  
  description: {
    currentRule: string;
    modifiedRule: string;
    diff: string;
  };
  
  reason: {
    identifiedProblem: string;
    identifiedCases: string[];
    expectedImpact: string;
  };
  
  validation: {
    validator: string;
    validationDate: Date;
    status: 'approved' | 'rejected' | 'revisionRequested';
  };
  
  deployment: {
    deploymentDate: Date;
    previousVersion: string;
    newVersion: string;
  };
  
  measuredImpact: {
    precisionBefore: number;
    precisionAfter: number;
    delta: number;
    
    affectedDimensions: {
      dimension: string;
      impact: string;
    }[];
  };
  
  conclusion: {
    finalStatus: 'success' | 'failure' | 'pending';
    rollbackPerformed: boolean;
    rollbackDate?: Date;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ModificationRegistry {
  registryId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  entries: ModificationRegistryEntry[];
  
  summary: {
    totalModifications: number;
    successfulModifications: number;
    failedModifications: number;
    pendingModifications: number;
    
    averageImprovement: number;
    totalRollbacks: number;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE modification_registry_entry (
  id VARCHAR(36) PRIMARY KEY,
  modification_number VARCHAR(20) NOT NULL UNIQUE,
  
  modification_date TIMESTAMP NOT NULL,
  rule_modified VARCHAR(100) NOT NULL,
  modification_type VARCHAR(30) NOT NULL,
  
  description JSON NOT NULL,
  reason JSON NOT NULL,
  validation JSON NOT NULL,
  deployment JSON NOT NULL,
  measured_impact JSON NOT NULL,
  conclusion JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_modification_registry_entry_date ON modification_registry_entry(modification_date);
CREATE INDEX idx_modification_registry_entry_rule ON modification_registry_entry(rule_modified);
CREATE INDEX idx_modification_registry_entry_type ON modification_registry_entry(modification_type);

CREATE TABLE modification_registry (
  id VARCHAR(36) PRIMARY KEY,
  
  period_start_date TIMESTAMP NOT NULL,
  period_end_date TIMESTAMP NOT NULL,
  
  summary JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 7. API Endpoints

```typescript
// POST /api/modification-registry/entry/create
async function createRegistryEntry(entry: ModificationRegistryEntry): Promise<ModificationRegistryEntry> {
  return await createRegistryEntry(entry);
}

// GET /api/modification-registry/entry/:entryId
async function getRegistryEntry(entryId: string): Promise<ModificationRegistryEntry> {
  return await getRegistryEntry(entryId);
}

// GET /api/modification-registry/entry/number/:number
async function getRegistryEntryByNumber(number: string): Promise<ModificationRegistryEntry> {
  return await getRegistryEntryByNumber(number);
}

// PUT /api/modification-registry/entry/:entryId/impact
async function updateMeasuredImpact(entryId: string, impact: any): Promise<ModificationRegistryEntry> {
  return await updateMeasuredImpact(entryId, impact);
}

// PUT /api/modification-registry/entry/:entryId/conclusion
async function updateConclusion(entryId: string, conclusion: any): Promise<ModificationRegistryEntry> {
  return await updateConclusion(entryId, conclusion);
}

// GET /api/modification-registry/entries
async function getAllRegistryEntries(): Promise<ModificationRegistryEntry[]> {
  return await getAllRegistryEntries();
}

// GET /api/modification-registry/entries/rule/:ruleId
async function getRegistryEntriesByRule(ruleId: string): Promise<ModificationRegistryEntry[]> {
  return await getRegistryEntriesByRule(ruleId);
}

// GET /api/modification-registry/entries/type/:type
async function getRegistryEntriesByType(type: string): Promise<ModificationRegistryEntry[]> {
  return await getRegistryEntriesByType(type);
}

// GET /api/modification-registry/summary
async function getRegistrySummary(): Promise<any> {
  return await getRegistrySummary();
}

// POST /api/modification-registry/export
async function exportRegistry(format: 'markdown' | 'pdf' | 'json'): Promise<any> {
  return await exportRegistry(format);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétude | Entrées complètes / totales | 100% |
- Taux de traçabilité | Modifications tracées / totales | 100% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration moyenne | Amélioration moyenne par modification | ≥ 3% |
- Taux de succès | Modifications réussies / totales | ≥ 70% |
- Taux de rollback | Rollbacks / déploiements | ≤ 10% |

---

## 9. Conclusion

Le registre des modifications et leur impact structure la traçabilité complète de toutes les modifications apportées au moteur. Format d'entrée avec date, règle modifiée, type de modification, description, raison, validation, déploiement, impact mesuré, conclusion. 4 types de modifications tracées (pondération, seuil, ajout de facteur, suppression de facteur). Exemples complets pour chaque type. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion. Le registre permet de mesurer l'impact des modifications, d'identifier les tendances d'amélioration ou de dégradation, et de faciliter les rollbacks si nécessaire.

**Points clés :**
- Registre des modifications
- Format d'entrée standardisé
- 4 types de modifications tracées
- Exemples complets
- Traçabilité complète
- Mesure de l'impact
- Conclusion par modification
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
