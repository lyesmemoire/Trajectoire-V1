# DOC-M06-05 : Format de Documentation de la Décision Collective

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format de documentation de la décision collective pour le MVP-META-06 Collaborative Decision Engine. Ce document structure le format standardisé pour documenter la décision collective prise lors de la réunion.

---

## 2. Principe Fondateur

La décision collective doit être documentée de manière traçable, auditable et signée. Le format standardisé garantit que toutes les décisions sont documentées de manière cohérente et peuvent être réutilisées pour l'apprentissage du moteur.

---

## 3. Format de Documentation

### 3.1 En-tête

```markdown
# DÉCISION COLLECTIVE DOCUMENTÉE

Candidat : [Nom]
Poste : [Intitulé]
Date : [Date]
Référence : [DEC-XXX]
```

---

### 3.2 Votes

```markdown
## VOTES

[Intervenant 1] ([Rôle]) : Pour / Contre / Abstention
[Intervenant 2] ([Rôle]) : Pour / Contre / Abstention
[Intervenant 3] ([Rôle]) : Pour / Contre / Abstention
[Intervenant 4] ([Rôle]) : Pour / Contre / Abstention

**Résultat du vote :** Pour / Contre / En attente
**Majorité requise :** [X/X]
```

---

### 3.3 Arguments Principaux Pour

```markdown
## ARGUMENTS PRINCIPAUX POUR

- [Argument 1] : [description]
- [Argument 2] : [description]
- [Argument 3] : [description]
```

---

### 3.4 Arguments Principaux Contre

```markdown
## ARGUMENTS PRINCIPAUX CONTRE

- [Argument 1] : [description]
- [Argument 2] : [description]
- [Argument 3] : [description]
```

---

### 3.5 Facteur Décisif

```markdown
## FACTEUR DÉCISIF

[Ce qui a fait basculer la décision]
```

---

### 3.6 Risques Acceptés Consciemment

```markdown
## RISQUES ACCEPTÉS CONSCIEMMENT

- [Risque 1] : [description]
- [Risque 2] : [description]
- [Risque 3] : [description]
```

---

### 3.7 Conditions de la Décision

```markdown
## CONDITIONS DE LA DÉCISION (si applicable)

- [Condition 1] : [description]
- [Condition 2] : [description]
- [Condition 3] : [description]
```

---

### 3.8 Traçabilité

```markdown
## TRACABILITÉ

- Archivé : Oui/Non
- Auditable : Oui/Non
- Signé : Oui/Non
- Date d'archivage : [Date]
- Lieu d'archivage : [Emplacement]
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface CollectiveDecision {
  decisionId: string;
  recruitmentId: string;
  candidateId: string;
  
  candidateName: string;
  positionTitle: string;
  decisionDate: Date;
  reference: string;
  
  votes: {
    intervenantId: string;
    intervenantName: string;
    intervenantRole: string;
    vote: 'for' | 'against' | 'abstain';
  }[];
  
  voteResult: 'for' | 'against' | 'pending';
  requiredMajority: {
    required: number;
    obtained: number;
  };
  
  argumentsFor: string[];
  argumentsAgainst: string[];
  
  decisiveFactor: string;
  
  acceptedRisks: string[];
  
  conditions: string[];
  
  traceability: {
    archived: boolean;
    auditable: boolean;
    signed: boolean;
    archivedAt?: Date;
    archiveLocation?: string;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE collective_decision (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  candidate_name VARCHAR(100) NOT NULL,
  position_title VARCHAR(100) NOT NULL,
  decision_date TIMESTAMP NOT NULL,
  reference VARCHAR(20) NOT NULL UNIQUE,
  
  votes JSON NOT NULL,
  vote_result VARCHAR(20) NOT NULL,
  required_majority JSON NOT NULL,
  
  arguments_for JSON NOT NULL,
  arguments_against JSON NOT NULL,
  
  decisive_factor TEXT NOT NULL,
  
  accepted_risks JSON NOT NULL,
  conditions JSON NOT NULL,
  
  traceability JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_collective_decision_recruitment ON collective_decision(recruitment_id);
CREATE INDEX idx_collective_decision_candidate ON collective_decision(candidate_id);
CREATE INDEX idx_collective_decision_date ON collective_decision(decision_date);
CREATE INDEX idx_collective_decision_reference ON collective_decision(reference);
```

---

## 6. API Endpoints

```typescript
// POST /api/decision/create
async function createDecision(decision: CollectiveDecision): Promise<CollectiveDecision> {
  return await createDecision(decision);
}

// GET /api/decision/:decisionId
async function getDecision(decisionId: string): Promise<CollectiveDecision> {
  return await getDecision(decisionId);
}

// GET /api/decision/reference/:reference
async function getDecisionByReference(reference: string): Promise<CollectiveDecision> {
  return await getDecisionByReference(reference);
}

// GET /api/decision/recruitment/:recruitmentId
async function getDecisionByRecruitment(recruitmentId: string): Promise<CollectiveDecision> {
  return await getDecisionByRecruitment(recruitmentId);
}

// PUT /api/decision/:decisionId/sign
async function signDecision(decisionId: string, intervenantId: string): Promise<CollectiveDecision> {
  return await signDecision(decisionId, decisionId, intervenantId);
}

// PUT /api/decision/:decisionId/archive
async function archiveDecision(decisionId: string, location: string): Promise<CollectiveDecision> {
  return await archiveDecision(decisionId, location);
}

// POST /api/decision/:decisionId/export
async function exportDecision(decisionId: string, format: 'markdown' | 'pdf' | 'json'): Promise<any> {
  return await exportDecision(decisionId, format);
}

// GET /api/decision/candidate/:candidateId
async function getDecisionsByCandidate(candidateId: string): Promise<CollectiveDecision[]> {
  return await getDecisionsByCandidate(candidateId);
}
```

---

## 7. Exemple Complet

```markdown
# DÉCISION COLLECTIVE DOCUMENTÉE

Candidat : Jean Dupont
Poste : Lead Developer
Date : 2026-08-15
Référence : DEC-2026-08-15-001

---

## VOTES

Marie Martin (RH) : Pour
Pierre Durand (Manager direct) : Contre
Sophie Bernard (Expert technique) : Abstention
Luc Petit (Direction) : Pour

**Résultat du vote :** Pour
**Majorité requise :** 2/4

---

## ARGUMENTS PRINCIPAUX POUR

- Culture fit élevé : Le candidat s'aligne parfaitement avec les valeurs de l'entreprise
- Potentiel de leadership : Vision claire et charisme naturel
- Soft skills solides : Communication claire et écoute active

---

## ARGUMENTS PRINCIPAUX CONTRE

- Lacunes techniques : Manque de maîtrise des technologies récentes
- Manque d'expérience d'équipe : N'a jamais géré d'équipe
- Risque d'intégration : Potentiel de conflit avec l'équipe existante

---

## FACTEUR DÉCISIF

Le potentiel de leadership et la culture fit priment sur les lacunes techniques, qui sont comblables par la formation. Le candidat a démontré une capacité d'apprentissage rapide et une forte motivation.

---

## RISQUES ACCEPTÉS CONSCIEMMENT

- Lacunes techniques sur les technologies récentes (comblables par formation)
- Manque d'expérience d'équipe (accompagnement par le manager)
- Risque d'intégration (plan d'onboarding renforcé)

---

## CONDITIONS DE LA DÉCISION

- Références contactées et positives
- Test technique réussi (score ≥ 3/5)
- Plan de formation sur les technologies récentes défini
- Accompagnement par le manager pendant les 3 premiers mois

---

## TRACABILITÉ

- Archivé : Oui
- Auditable : Oui
- Signé : Oui
- Date d'archivage : 2026-08-15
- Lieu d'archivage : Système de gestion documentaire RH
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de documentation complète | Décisions documentées / totales | 100% |
- Taux de signature | Décisions signées / totales | 100% |
- Taux d'archivage | Décisions archivées / totales | 100% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de réutilisation | Décisions réutilisées pour apprentissage / totales | ≥ 80% |
- Taux d'audit | Décisions auditées / totales | ≥ 10% |

---

## 9. Conclusion

Le format de documentation de la décision collective structure la documentation standardisée de la décision collective. En-tête avec candidat, poste, date, référence. Votes de chaque intervenant avec rôle et vote (Pour/Contre/Abstention). Arguments principaux pour et contre. Facteur décisif (ce qui a basculé la décision). Risques acceptés consciemment. Conditions de la décision (si applicable). Traçabilité (archivé, auditable, signé, date, lieu). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Format standardisé de documentation
- Votes de chaque intervenant
- Arguments pour et contre
- Facteur décisif
- Risques acceptés
- Conditions de la décision
- Traçabilité complète
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
