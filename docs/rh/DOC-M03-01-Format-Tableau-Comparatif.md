# DOC-M03-01 : Format du Tableau Comparatif

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format du tableau comparatif en temps réel pour le MVP-META-03 Comparative Intelligence Engine. Ce document structure le tableau qui compare tous les candidats évalués pour un recrutement ouvert.

---

## 2. Principe Fondateur

Un score de 72/100 ne veut rien dire seul. 72/100 dans un lot de candidats tous à 80/100 = le moins bon. 72/100 dans un lot à 55/100 = le meilleur. Le moteur doit comparer, pas seulement évaluer en absolu.

---

## 3. Structure du Tableau Comparatif

### 3.1 Format Visuel

```
┌──────────┬──────┬───────┬──────┬──────┬────────┬───────┐
│Candidat  │Tech  │Expér. │Soft  │Fit   │Maturité│Potent.│
├──────────┼──────┼───────┼──────┼──────┼────────┼───────┤
│[Nom 1]   │ X/5  │  X/5  │ X/5  │ X/5  │  X/5   │  X/5  │
│[Nom 2]   │ X/5  │  X/5  │ X/5  │ X/5  │  X/5   │  X/5  │
│[Nom 3]   │ X/5  │  X/5  │ X/5  │ X/5  │  X/5   │  X/5  │
├──────────┼──────┼───────┼──────┼──────┼────────┼───────┤
│MEILLEUR  │[Nom] │[Nom]  │[Nom] │[Nom] │[Nom]   │[Nom]  │
│SUR CE    │      │       │      │      │        │       │
│CRITÈRE   │      │       │      │      │        │       │
└──────────┴──────┴───────┴──────┴──────┴────────┴───────┘
```

### 3.2 Dimensions Évaluées

| Dimension | Description | Échelle |
|-----------|-------------|---------|
| Tech | Compétences techniques | 0-5 |
| Expér. | Expérience professionnelle | 0-5 |
| Soft | Soft skills | 0-5 |
| Fit | Fit culturel | 0-5 |
| Maturité | Maturité professionnelle | 0-5 |
| Potent. | Potentiel d'évolution | 0-5 |

---

## 4. Format Markdown

```markdown
## TABLEAU COMPARATIF
Recrutement : [Poste]
Candidats évalués : N
Dernière mise à jour : [Date]

| Candidat | Tech | Expér. | Soft | Fit | Maturité | Potent. |
|----------|------|--------|------|-----|----------|---------|
| [Nom 1]  | X/5  |  X/5   | X/5  | X/5 |   X/5    |   X/5   |
| [Nom 2]  | X/5  |  X/5   | X/5  | X/5 |   X/5    |   X/5   |
| [Nom 3]  | X/5  |  X/5   | X/5  | X/5 |   X/5    |   X/5   |

**Meilleur sur chaque critère :**
- Tech : [Nom]
- Expér. : [Nom]
- Soft : [Nom]
- Fit : [Nom]
- Maturité : [Nom]
- Potent. : [Nom]
```

---

## 5. Format JSON

```json
{
  "comparativeTableId": "CT-001",
  "recruitmentId": "REC-001",
  "position": "DRH",
  
  "candidates": [
    {
      "candidateId": "CAND-001",
      "name": "Jean Dupont",
      "scores": {
        "tech": 4,
        "experience": 5,
        "soft": 3,
        "fit": 4,
        "maturity": 5,
        "potential": 4
      },
      "globalScore": 25,
      "interviewDate": "2026-08-01"
    },
    {
      "candidateId": "CAND-002",
      "name": "Marie Martin",
      "scores": {
        "tech": 5,
        "experience": 4,
        "soft": 4,
        "fit": 3,
        "maturity": 4,
        "potential": 5
      },
      "globalScore": 25,
      "interviewDate": "2026-08-02"
    },
    {
      "candidateId": "CAND-003",
      "name": "Pierre Bernard",
      "scores": {
        "tech": 3,
        "experience": 3,
        "soft": 5,
        "fit": 5,
        "maturity": 3,
        "potential": 3
      },
      "globalScore": 22,
      "interviewDate": "2026-08-03"
    }
  ],
  
  "bestByCriteria": {
    "tech": "CAND-002",
    "experience": "CAND-001",
    "soft": "CAND-003",
    "fit": "CAND-003",
    "maturity": "CAND-001",
    "potential": "CAND-002"
  },
  
  "metadata": {
    "lastUpdated": "2026-08-04T10:00:00Z",
    "candidatesCount": 3,
    "version": "1.0"
  }
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface CandidateScore {
  candidateId: string;
  name: string;
  scores: {
    tech: number;
    experience: number;
    soft: number;
    fit: number;
    maturity: number;
    potential: number;
  };
  globalScore: number;
  interviewDate: Date;
}

interface ComparativeTable {
  comparativeTableId: string;
  recruitmentId: string;
  position: string;
  
  candidates: CandidateScore[];
  
  bestByCriteria: {
    tech: string;
    experience: string;
    soft: string;
    fit: string;
    maturity: string;
    potential: string;
  };
  
  metadata: {
    lastUpdated: Date;
    candidatesCount: number;
    version: string;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE comparative_table (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  position VARCHAR(100) NOT NULL,
  
  candidates JSON NOT NULL,
  best_by_criteria JSON NOT NULL,

  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_comparative_table_recruitment ON comparative_table(recruitment_id);
```

---

## 8. API Endpoints

```typescript
// POST /api/comparative-table/create
async function createComparativeTable(recruitmentId: string, position: string): Promise<ComparativeTable> {
  return await createComparativeTable(recruitmentId, position);
}

// GET /api/comparative-table/:recruitmentId
async function getComparativeTable(recruitmentId: string): Promise<ComparativeTable> {
  return await getComparativeTableByRecruitment(recruitmentId);
}

// PUT /api/comparative-table/:recruitmentId/add-candidate
async function addCandidateToTable(recruitmentId: string, candidateScore: CandidateScore): Promise<ComparativeTable> {
  return await addCandidateToTable(recruitmentId, candidateScore);
}

// PUT /api/comparative-table/:recruitmentId/update-candidate
async function updateCandidateInTable(recruitmentId: string, candidateId: string, candidateScore: CandidateScore): Promise<ComparativeTable> {
  return await updateCandidateInTable(recruitmentId, candidateId, candidateScore);
}

// DELETE /api/comparative-table/:recruitmentId/remove-candidate/:candidateId
async function removeCandidateFromTable(recruitmentId: string, candidateId: string): Promise<ComparativeTable> {
  return await removeCandidateFromTable(recruitmentId, candidateId);
}

// POST /api/comparative-table/:recruitmentId/export
async function exportComparativeTable(recruitmentId: string, format: 'markdown' | 'json' | 'csv'): Promise<any> {
  return await exportComparativeTable(recruitmentId, format);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de mise à jour | Tableaux mis à jour / entretiens terminés | 100% |
- Taux de complétude | Tableaux complets / créés | 100% |

### 9.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de consultation | Tableaux consultés / créés | ≥ 80% |
- Taux d'utilisation pour décision | Décisions basées sur tableau / décisions totales | ≥ 70% |

---

## 10. Conclusion

Le format du tableau comparatif structure le tableau qui compare tous les candidats évalués pour un recrutement ouvert. Format visuel avec 6 dimensions (Tech, Expér., Soft, Fit, Maturité, Potent.) sur une échelle de 0-5. Identification du meilleur candidat sur chaque critère. Format Markdown et JSON. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion. Mise à jour automatique après chaque entretien conduit.

**Points clés :**
- Tableau comparatif en temps réel
- 6 dimensions évaluées
- Échelle 0-5 pour chaque dimension
- Meilleur sur chaque critère identifié
- Format Markdown et JSON
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
