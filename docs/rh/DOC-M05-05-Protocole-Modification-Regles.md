# DOC-M05-05 : Protocole de Modification des Règles

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de modification des règles pour le MVP-META-05 Feedback Intelligence Engine. Ce document structure le processus de modification des règles du moteur suite à l'identification d'écarts entre prédiction et réalité.

---

## 2. Principe Fondateur

Les modifications de règles doivent être validées par un DRH humain, traçables, et testées avant déploiement. Le protocole garantit que chaque modification est justifiée, documentée, et mesurable.

---

## 3. Processus de Modification

### 3.1 Étape 1 — Proposition de Modification

**Déclencheur :**
- Identification d'un écart significatif (≥ 20% d'erreur)
- Répétition du même type d'erreur sur ≥ 3 cas
- Recommandation du processus d'apprentissage

**Contenu de la proposition :**
- Règle actuelle : [description]
- Problème identifié : [description]
- Données à l'appui : [cas identifiés]
- Proposition de modification : [description]
- Impact attendu : [description]

**Exemple :**
```
Règle actuelle : Score de maturité = (expérience × 0.5) + (responsabilités × 0.3) + (formation × 0.2)
Problème identifié : Surévaluation systématique de la maturité pour les profils juniors
Données à l'appui : 5 cas où le score prédit était ≥ 4/5 mais la réalité était ≤ 2/5
Proposition de modification : Ajouter un facteur de pondération basé sur le niveau de responsabilité réelle
Impact attendu : Réduction de 0.5 points pour les profils juniors
```

---

### 3.2 Étape 2 — Validation par DRH Humain

**Processus de validation :**
1. Le DRH reçoit la proposition de modification
2. Le DRH analyse la proposition et les données à l'appui
3. Le DRH prend une décision :
   - Approuvé
   - Rejeté avec raison
   - Modification demandée

**Critères de validation :**
- La modification est-elle justifiée par les données ?
- La modification est-elle cohérente avec la stratégie RH ?
- La modification a-t-elle un impact positif attendu ?
- La modification ne crée-t-elle pas de nouveaux biais ?

**Délai de validation :**
- Maximum 5 jours ouvrés

---

### 3.3 Étape 3 — Mise à jour du Knowledge Pack

**Si approuvé :**
1. Mise à jour de la règle dans le Knowledge Pack
2. Versioning de la modification (ex: v1.0 → v1.1)
3. Sauvegarde de la version précédente
4. Documentation de la modification

**Si rejeté :**
1. Documentation de la raison du rejet
2. Archivage de la proposition
3. Analyse des alternatives

**Si modification demandée :**
1. Révision de la proposition
2. Nouvelle soumission pour validation

---

### 3.4 Étape 4 — Traçabilité de la Modification

**Informations tracées :**
- Date de la modification
- Auteur de la modification (moteur + DRH)
- Raison de la modification
- Version précédente de la règle
- Version nouvelle de la règle
- Cas identifiés à l'origine de la modification
- Impact attendu
- Validateur (DRH)
- Date de validation

**Format de traçabilité :**
```
MODIFICATION #MOD-001
Date : 2026-08-15
Auteur : Moteur (proposition) + DRH Jean Dupont (validation)
Raison : Surévaluation systématique de la maturité pour les profils juniors
Version précédente : v1.0
Version nouvelle : v1.1
Cas identifiés : CAND-XXX, CAND-YYY, CAND-ZZZ, CAND-AAA, CAND-BBB
Impact attendu : Réduction de 0.5 points pour les profils juniors
Validateur : DRH Jean Dupont
Date de validation : 2026-08-15
```

---

## 4. Types de Modifications

### 4.1 Modification de Pondération

**Description :**
Modification des poids des facteurs dans une règle de calcul.

**Exemple :**
- Avant : Score = (A × 0.5) + (B × 0.3) + (C × 0.2)
- Après : Score = (A × 0.4) + (B × 0.4) + (C × 0.2)

**Impact :**
- Modification du score final
- Modification du classement relatif

---

### 4.2 Modification de Seuil

**Description :**
Modification des seuils de décision dans une règle.

**Exemple :**
- Avant : Si score ≥ 4/5 → Recommandé
- Après : Si score ≥ 3.5/5 → Recommandé

**Impact :**
- Modification du nombre de recommandations
- Modification du taux de faux positifs/négatifs

---

### 4.3 Ajout de Facteur

**Description :**
Ajout d'un nouveau facteur dans une règle de calcul.

**Exemple :**
- Avant : Score = (A × 0.5) + (B × 0.5)
- Après : Score = (A × 0.4) + (B × 0.4) + (C × 0.2)

**Impact :**
- Enrichissement de la règle
- Capture de signaux précédemment manqués

---

### 4.4 Suppression de Facteur

**Description :**
Suppression d'un facteur dans une règle de calcul.

**Exemple :**
- Avant : Score = (A × 0.4) + (B × 0.4) + (C × 0.2)
- Après : Score = (A × 0.5) + (B × 0.5)

**Impact :**
- Simplification de la règle
- Réduction du bruit

---

## 5. Structure de Données (TypeScript)

```typescript
interface RuleModificationProposal {
  proposalId: string;
  ruleId: string;
  
  currentRule: {
    description: string;
    formula?: string;
    thresholds?: Record<string, number>;
    weights?: Record<string, number>;
  };
  
  identifiedProblem: {
    description: string;
    supportingData: {
      caseId: string;
      predictedValue: number;
      actualValue: number;
      gap: number;
    }[];
  };
  
  proposedModification: {
    type: 'weightAdjustment' | 'thresholdAdjustment' | 'factorAddition' | 'factorRemoval';
    description: string;
    newFormula?: string;
    newThresholds?: Record<string, number>;
    newWeights?: Record<string, number>;
    addedFactors?: string[];
    removedFactors?: string[];
  };
  
  expectedImpact: {
    description: string;
    expectedImprovement: number; // en pourcentage
    affectedDimensions: string[];
  };
  
  proposedAt: Date;
  proposedBy: 'engine';
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface RuleModificationValidation {
  validationId: string;
  proposalId: string;
  
  validationStatus: 'approved' | 'rejected' | 'revisionRequested';
  validatedBy: string;
  validatedAt: Date;
  
  rejectionReason?: string;
  revisionRequest?: string;
  
  validationCriteria: {
    justifiedByData: boolean;
    consistentWithStrategy: boolean;
    positiveImpactExpected: boolean;
    noNewBias: boolean;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface KnowledgePackUpdate {
  updateId: string;
  validationId: string;
  ruleId: string;
  
  previousVersion: string;
  newVersion: string;
  
  updateDate: Date;
  updatedBy: string;
  
  updateContent: {
    previousRule: string;
    newRule: string;
    diff: string;
  };
  
  rollbackAvailable: boolean;
  rollbackDeadline: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ModificationTraceability {
  traceabilityId: string;
  updateId: string;
  
  modificationDate: Date;
  modificationAuthor: {
    proposer: 'engine';
    validator: string;
  };
  
  modificationReason: string;
  
  previousVersion: string;
  newVersion: string;
  
  identifiedCases: string[];
  expectedImpact: string;
  
  validator: string;
  validationDate: Date;
  
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
CREATE TABLE rule_modification_proposal (
  id VARCHAR(36) PRIMARY KEY,
  rule_id VARCHAR(36) NOT NULL,
  
  current_rule JSON NOT NULL,
  identified_problem JSON NOT NULL,
  proposed_modification JSON NOT NULL,
  expected_impact JSON NOT NULL,
  
  proposed_at TIMESTAMP NOT NULL,
  proposed_by VARCHAR(20) NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_rule_modification_proposal_rule ON rule_modification_proposal(rule_id);

CREATE TABLE rule_modification_validation (
  id VARCHAR(36) PRIMARY KEY,
  proposal_id VARCHAR(36) NOT NULL,
  
  validation_status VARCHAR(30) NOT NULL,
  validated_by VARCHAR(100) NOT NULL,
  validated_at TIMESTAMP NOT NULL,
  
  rejection_reason TEXT,
  revision_request TEXT,
  
  validation_criteria JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_rule_modification_validation_proposal ON rule_modification_validation(proposal_id);

CREATE TABLE knowledge_pack_update (
  id VARCHAR(36) PRIMARY KEY,
  validation_id VARCHAR(36) NOT NULL,
  rule_id VARCHAR(36) NOT NULL,
  
  previous_version VARCHAR(20) NOT NULL,
  new_version VARCHAR(20) NOT NULL,
  
  update_date TIMESTAMP NOT NULL,
  updated_by VARCHAR(100) NOT NULL,
  
  update_content JSON NOT NULL,
  
  rollback_available BOOLEAN NOT NULL,
  rollback_deadline TIMESTAMP,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_knowledge_pack_update_rule ON knowledge_pack_update(rule_id);

CREATE TABLE modification_traceability (
  id VARCHAR(36) PRIMARY KEY,
  update_id VARCHAR(36) NOT NULL,
  
  modification_date TIMESTAMP NOT NULL,
  modification_author JSON NOT NULL,
  modification_reason TEXT NOT NULL,
  
  previous_version VARCHAR(20) NOT NULL,
  new_version VARCHAR(20) NOT NULL,
  
  identified_cases JSON NOT NULL,
  expected_impact TEXT NOT NULL,
  
  validator VARCHAR(100) NOT NULL,
  validation_date TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_modification_traceability_update ON modification_traceability(update_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/rule-modification/propose
async function proposeRuleModification(ruleId: string, proposal: RuleModificationProposal): Promise<RuleModificationProposal> {
  return await proposeRuleModification(ruleId, proposal);
}

// PUT /api/rule-modification/validate/:proposalId
async function validateRuleModification(proposalId: string, status: 'approved' | 'rejected' | 'revisionRequested', reason?: string): Promise<RuleModificationValidation> {
  return await validateRuleModification(proposalId, status, reason);
}

// POST /api/knowledge-pack/update
async function updateKnowledgePack(validationId: string): Promise<KnowledgePackUpdate> {
  return await updateKnowledgePack(validationId);
}

// POST /api/knowledge-pack/rollback/:updateId
async function rollbackKnowledgePack(updateId: string): Promise<KnowledgePackUpdate> {
  return await rollbackKnowledgePack(updateId);
}

// GET /api/modification-traceability/:updateId
async function getModificationTraceability(updateId: string): Promise<ModificationTraceability> {
  return await getModificationTraceability(updateId);
}

// GET /api/modification-traceability/rule/:ruleId
async function getModificationTraceabilityByRule(ruleId: string): Promise<ModificationTraceability[]> {
  return await getModificationTraceabilityByRule(ruleId);
}

// GET /api/rule-modification/proposals
async function getAllProposals(): Promise<RuleModificationProposal[]> {
  return await getAllProposals();
}

// GET /api/rule-modification/proposals/pending
async function getPendingProposals(): Promise<RuleModificationProposal[]> {
  return await getPendingProposals();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Modifications validées / proposées | ≥ 80% |
- Taux de rejet | Modifications rejetées / proposées | ≤ 20% |
- Délai moyen de validation | Temps moyen de validation | < 5 jours |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration moyenne | Amélioration moyenne après modification | ≥ 5% |
- Taux de succès | Modifications réussies / déployées | ≥ 70% |
- Taux de rollback | Rollbacks / déploiements | ≤ 10% |

---

## 9. Conclusion

Le protocole de modification des règles structure le processus de modification des règles du moteur. Étape 1 : Proposition de modification (règle actuelle, problème identifié, données à l'appui, proposition, impact attendu). Étape 2 : Validation par DRH humain (analyse, décision, critères de validation). Étape 3 : Mise à jour du Knowledge Pack (versioning, sauvegarde, documentation). Étape 4 : Traçabilité (date, auteur, raison, versions, cas identifiés, impact, validateur). 4 types de modifications (pondération, seuil, ajout de facteur, suppression de facteur). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 étapes du processus de modification
- Proposition de modification
- Validation par DRH humain
- Mise à jour du Knowledge Pack
- Traçabilité complète
- 4 types de modifications
- Critères de validation
- Versioning et rollback
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
