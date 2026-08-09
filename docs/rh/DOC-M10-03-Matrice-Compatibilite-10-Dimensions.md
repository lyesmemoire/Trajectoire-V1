# DOC-M10-03 : Matrice de Compatibilité 10 Dimensions

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la matrice de compatibilité en 10 dimensions pour le MVP-META-10 Manager Compatibility Engine. Ce document structure les dimensions analysées pour évaluer la compatibilité entre un candidat et un manager.

---

## 2. Principe Fondateur

Pour chaque paire candidat / manager, le moteur analyse la compatibilité sur 10 dimensions. Chaque dimension compare la caractéristique du candidat avec celle du manager et évalue le niveau de compatibilité (Aligné, Risque, Conflit).

---

## 3. Les 10 Dimensions de Compatibilité

### 3.1 DIMENSION 1 — Style de Travail

**Candidat :** Autonome / Structuré / Hybride  
**Manager :** Directif / Participatif / Délégateur / Coach / Laissez-faire

**Critères de compatibilité :**
- ✅ Aligné : Candidat autonome + Manager délégateur/laissez-faire
- ✅ Aligné : Candidat structuré + Manager directif/participatif
- ⚠️ Risque : Candidat autonome + Manager directif
- ❌ Conflit : Candidat structuré + Manager laissez-faire

---

### 3.2 DIMENSION 2 — Communication

**Candidat :** Direct / Indirect / Hybride  
**Manager :** Direct/Explicite / Indirect/Implicite / Écrit / Oral

**Critères de compatibilité :**
- ✅ Aligné : Candidat direct + Manager direct/explicite
- ✅ Aligné : Candidat indirect + Manager indirect/implicite
- ⚠️ Risque : Candidat direct + Manager indirect
- ❌ Conflit : Candidat indirect + Manager direct

---

### 3.3 DIMENSION 3 — Besoin de Structure

**Candidat :** Faible / Moyen / Fort  
**Manager :** Fort / Moyen / Faible

**Critères de compatibilité :**
- ✅ Aligné : Candidat faible + Manager faible
- ✅ Aligné : Candidat fort + Manager fort
- ⚠️ Risque : Candidat moyen + Manager fort/faible
- ❌ Conflit : Candidat fort + Manager faible

---

### 3.4 DIMENSION 4 — Tolérance à l'Erreur

**Candidat :** Haute / Moyenne / Faible  
**Manager :** Punitive / Apprenante / Indifférente

**Critères de compatibilité :**
- ✅ Aligné : Candidat haute + Manager apprenante/indifférente
- ✅ Aligné : Candidat faible + Manager punitive
- ⚠️ Risque : Candidat haute + Manager punitive
- ❌ Conflit : Candidat faible + Manager apprenante

---

### 3.5 DIMENSION 5 — Disponibilité

**Candidat :** Standard / Intensive / Flexible  
**Manager :** Sur-disponibilité / Respect horaires / Résultat seul

**Critères de compatibilité :**
- ✅ Aligné : Candidat intensive + Manager sur-disponibilité
- ✅ Aligné : Candidat standard + Manager respect horaires
- ⚠️ Risque : Candidat standard + Manager sur-disponibilité
- ❌ Conflit : Candidat standard + Manager sur-disponibilité

---

### 3.6 DIMENSION 6 — Ambition

**Candidat :** Haute / Moyenne / Faible  
**Manager :** Stagnante / Progressive / Dynamique

**Critères de compatibilité :**
- ✅ Aligné : Candidat haute + Manager dynamique
- ✅ Aligné : Candidat faible + Manager stagnante
- ⚠️ Risque : Candidat haute + Manager stagnante
- ❌ Conflit : Candidat haute + Manager stagnante

---

### 3.7 DIMENSION 7 — Valeurs

**Candidat :** Impact / Performance / Innovation / Stabilité  
**Manager :** Impact / Performance / Innovation / Stabilité

**Critères de compatibilité :**
- ✅ Aligné : Valeurs identiques
- ⚠️ Risque : Valeurs proches mais différentes
- ❌ Conflit : Valeurs opposées (ex: Impact vs Performance)

---

### 3.8 DIMENSION 8 — Feedback

**Candidat :** Fréquent / Modéré / Rare  
**Manager :** Fréquent / Modéré / Rare

**Critères de compatibilité :**
- ✅ Aligné : Fréquence identique
- ⚠️ Risque : Fréquence proche (fréquent/modéré)
- ❌ Conflit : Fréquence opposée (fréquent/rare)

---

### 3.9 DIMENSION 9 — Décision

**Candidat :** Consultatif / Autonome / Collaboratif  
**Manager :** Seul / Participatif / Délégateur

**Critères de compatibilité :**
- ✅ Aligné : Candidat consultatif + Manager participatif
- ✅ Aligné : Candidat autonome + Manager délégateur
- ⚠️ Risque : Candidat consultatif + Manager seul
- ❌ Conflit : Candidat autonome + Manager seul

---

### 3.10 DIMENSION 10 — Culture

**Candidat :** Agile / Process / Hybride  
**Manager :** Agile / Process / Hybride

**Critères de compatibilité :**
- ✅ Aligné : Culture identique
- ⚠️ Risque : Culture proche (agile/hybride)
- ❌ Conflit : Culture opposée (agile vs process)

---

## 4. Matrice de Compatibilité

```
┌───────────────────┬──────────┬──────────┬──────────┐
│ Dimension         │ Cultivé  │ Manager  │ Compat.  │
├───────────────────┼──────────┼──────────┼──────────┤
│ Style travail     │Autonome  │Directif  │⚠️ Risque │
│ Communication     │Direct    │Direct    │✅ Aligné │
│ Besoin structure  │Faible    │Fort      │❌ Conflit│
│ Tolérance erreur  │Haute     │Faible    │⚠️ Risque │
│ Disponibilité     │Standard  │Intensive │⚠️ Risque │
│ Ambition          │Haute     │Stagnante │⚠️ Risque │
│ Valeurs           │Impact    │Performance│✅ Aligné│
│ Feedback          │Fréquent  │Rare      │❌ Conflit│
│ Décision          │Consultatif│Seul    │⚠️ Risque │
│ Culture           │Agile     │Process   │⚠️ Risque │
└───────────────────┴──────────┴──────────┴──────────┘
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface CompatibilityMatrix {
  matrixId: string;
  recruitmentId: string;
  candidateId: string;
  managerId: string;
  
  dimensions: {
    workStyle: {
      candidate: 'autonomous' | 'structured' | 'hybrid';
      manager: 'directive' | 'participative' | 'delegator' | 'coach' | 'laissez_faire';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    communication: {
      candidate: 'direct' | 'indirect' | 'hybrid';
      manager: 'direct_explicit' | 'indirect_implicit' | 'written' | 'oral';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    structureNeed: {
      candidate: 'weak' | 'medium' | 'strong';
      manager: 'strong' | 'medium' | 'weak';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    errorTolerance: {
      candidate: 'high' | 'medium' | 'low';
      manager: 'punitive' | 'learning' | 'indifferent';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    availability: {
      candidate: 'standard' | 'intensive' | 'flexible';
      manager: 'over_availability' | 'respect_hours' | 'result_only';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    ambition: {
      candidate: 'high' | 'medium' | 'low';
      manager: 'stagnant' | 'progressive' | 'dynamic';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    values: {
      candidate: 'impact' | 'performance' | 'innovation' | 'stability';
      manager: 'impact' | 'performance' | 'innovation' | 'stability';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    feedback: {
      candidate: 'frequent' | 'moderate' | 'rare';
      manager: 'frequent' | 'moderate' | 'rare';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    decision: {
      candidate: 'consultative' | 'autonomous' | 'collaborative';
      manager: 'alone' | 'participative' | 'delegator';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
    culture: {
      candidate: 'agile' | 'process' | 'hybrid';
      manager: 'agile' | 'process' | 'hybrid';
      compatibility: 'aligned' | 'risk' | 'conflict';
    };
  };
  
  generatedAt: Date;
  
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
CREATE TABLE compatibility_matrix (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  manager_id VARCHAR(36) NOT NULL,
  
  dimensions JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_compatibility_matrix_recruitment ON compatibility_matrix(recruitment_id);
CREATE INDEX idx_compatibility_matrix_candidate ON compatibility_matrix(candidate_id);
CREATE INDEX idx_compatibility_matrix_manager ON compatibility_matrix(manager_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/compatibility-matrix/generate
async function generateCompatibilityMatrix(recruitmentId: string, candidateId: string, managerId: string): Promise<CompatibilityMatrix> {
  return await generateCompatibilityMatrix(recruitmentId, candidateId, managerId);
}

// GET /api/compatibility-matrix/:matrixId
async function getCompatibilityMatrix(matrixId: string): Promise<CompatibilityMatrix> {
  return await getCompatibilityMatrix(matrixId);
}

// GET /api/compatibility-matrix/recruitment/:recruitmentId
async function getCompatibilityMatrixByRecruitment(recruitmentId: string): Promise<CompatibilityMatrix> {
  return await getCompatibilityMatrixByRecruitment(recruitmentId);
}

// GET /api/compatibility-matrix/manager/:managerId
async function getCompatibilityMatrixByManager(managerId: string): Promise<CompatibilityMatrix[]> {
  return await getCompatibilityMatrixByManager(managerId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Génération

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Matrices générées / recrutements | ≥ 95% |
- Latence de génération | Temps entre données et matrice | ≤ 3 secondes |

### 8.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de dimensions complètes | Dimensions complètes / totales | ≥ 98% |
- Taux de cohérence | Matrices cohérentes / totales | ≥ 90% |

---

## 9. Exemple Complet

```markdown
MATRICE DE COMPATIBILITÉ

Candidat : [Anonymisé]
Manager : [Anonymisé]
Recrutement : REC-2026-001
Date : 2026-08-04

DIMENSIONS :

1. Style travail
   Candidat : Autonome
   Manager : Directif
   Compatibilité : ⚠️ Risque

2. Communication
   Candidat : Direct
   Manager : Direct/Explicite
   Compatibilité : ✅ Aligné

3. Besoin structure
   Candidat : Faible
   Manager : Fort
   Compatibilité : ❌ Conflit

4. Tolérance erreur
   Candidat : Haute
   Manager : Faible (Punitive)
   Compatibilité : ⚠️ Risque

5. Disponibilité
   Candidat : Standard
   Manager : Intensive
   Compatibilité : ⚠️ Risque

6. Ambition
   Candidat : Haute
   Manager : Stagnante
   Compatibilité : ⚠️ Risque

7. Valeurs
   Candidat : Impact
   Manager : Performance
   Compatibilité : ✅ Aligné

8. Feedback
   Candidat : Fréquent
   Manager : Rare
   Compatibilité : ❌ Conflit

9. Décision
   Candidat : Consultatif
   Manager : Seul
   Compatibilité : ⚠️ Risque

10. Culture
    Candidat : Agile
    Manager : Process
    Compatibilité : ⚠️ Risque

RÉSUMÉ :
→ Aligné : 2/10
→ Risque : 6/10
→ Conflit : 2/10
```

---

## 10. Conclusion

La matrice de compatibilité en 10 dimensions structure l'analyse de compatibilité entre candidat et manager. 10 dimensions : Style travail, Communication, Besoin structure, Tolérance erreur, Disponibilité, Ambition, Valeurs, Feedback, Décision, Culture. Chaque dimension compare la caractéristique du candidat avec celle du manager et évalue le niveau de compatibilité (Aligné ✅, Risque ⚠️, Conflit ❌). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 10 dimensions de compatibilité
- 3 niveaux de compatibilité par dimension
- Critères de compatibilité par dimension
- Matrice visuelle des dimensions
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de génération et de qualité
