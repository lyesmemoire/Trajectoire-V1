# DOC-028-05 : Registre Officiel des Exceptions

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le registre officiel des exceptions pour MVP-028 Exception Intelligence Engine. Ce registre enregistre chaque exception avec traçabilité complète (date, règle, niveau, décision, résultat) et permet de suivre l'historique des exceptions pour la gouvernance et l'apprentissage du moteur.

---

## 2. Principe Fondateur

Chaque exception est enregistrée dans le registre officiel avec traçabilité complète. Le registre permet de suivre l'historique des exceptions, d'analyser les tendances, d'identifier les règles candidates à révision, et de fournir une base pour les rapports trimestriels et les décisions de gouvernance.

---

## 3. Structure du Registre

### 3.1 Champs du Registre

**Champ :** Date / Règle / Niveau / Décision / Résultat

**Format :**
- Date : Date de l'exception (YYYY-MM-DD)
- Règle : Référence de la règle (RFC-RH-XXX ou RH-XXX)
- Niveau : Niveau de l'exception (mineure / significative / majeure)
- Décision : Décision sur l'exception (accordée / refusée / conditionnelle)
- Résultat : Résultat à 12 mois (performance / intégration / satisfaction)

---

### 3.2 Enregistrement de l'Exception

**Processus :**
1. Détection du contexte exceptionnel
2. Classification de l'exception
3. Génération du dossier d'exception
4. Décision humaine
5. Enregistrement dans le registre
6. Suivi des résultats

---

## 4. Contenu du Registre

### 4.1 Informations de Base

**Champs :**
- ID de l'exception
- Date de l'exception
- Référence de la règle
- Texte de la règle
- Niveau de l'exception
- Classification

---

### 4.2 Informations sur le Candidat

**Champs :**
- ID du candidat
- Nom du candidat
- Poste concerné
- Département
- Profil atypique (si applicable)

---

### 4.3 Informations sur la Décision

**Champs :**
- Décision (accordée / refusée / conditionnelle)
- Décideur
- Date de la décision
- Justification de la décision
- Conditions de l'exception (si applicable)

---

### 4.4 Informations sur les Résultats

**Champs :**
- Résultat à 6 mois
- Résultat à 12 mois
- Résultat à 24 mois
- Performance moyenne
- Intégration
- Satisfaction manager

---

### 4.5 Informations sur l'Apprentissage

**Champs :**
- Exception justifiée (oui / non / partiellement)
- Révision de la règle nécessaire (oui / non / à étudier)
- Type de révision (renforcer / réviser / préciser)
- Proposition de révision (si applicable)

---

## 5. Algorithme d'Enregistrement dans le Registre

### 5.1 Processus Global

```typescript
async function registerException(dossierId: string, decision: ExceptionDecision): Promise<ExceptionRegistry> {
  // 1. Récupération du dossier d'exception
  const dossier = await getExceptionDossier(dossierId);
  
  // 2. Récupération de la classification
  const classification = await getExceptionClassification(dossier.classificationId);
  
  // 3. Construction de l'entrée du registre
  const registryEntry: ExceptionRegistry = {
    registryId: generateRegistryId(),
    dossierId,
    registeredAt: new Date(),
    
    basicInfo: {
      exceptionId: generateExceptionId(),
      date: new Date(),
      ruleReference: dossier.section1.ruleReference,
      ruleText: dossier.section1.ruleText,
      level: classification.level,
      classification
    },
    
    candidateInfo: {
      candidateId: dossier.candidateId,
      candidateName: dossier.candidateName,
      jobTitle: dossier.jobTitle,
      department: dossier.department,
      atypicalProfile: dossier.section2.exceptionalDimensions
    },
    
    decisionInfo: {
      decision: decision.decision,
      decisionMaker: decision.decisionMaker,
      decisionDate: decision.decisionDate,
      justification: decision.justification,
      conditions: decision.conditions
    },
    
    resultsInfo: {
      sixMonths: null,
      twelveMonths: null,
      twentyFourMonths: null,
      averagePerformance: null,
      integration: null,
      managerSatisfaction: null
    },
    
    learningInfo: {
      justified: null,
      ruleRevisionNeeded: null,
      revisionType: null,
      revisionProposal: null
    }
  };
  
  // 4. Sauvegarde dans le registre
  await saveExceptionRegistry(registryEntry);
  
  return registryEntry;
}
```

---

### 5.2 Mise à Jour des Résultats

```typescript
async function updateExceptionResults(registryId: string, results: ExceptionResults): Promise<ExceptionRegistry> {
  // 1. Récupération de l'entrée du registre
  const registryEntry = await getExceptionRegistry(registryId);
  
  // 2. Mise à jour des résultats
  registryEntry.resultsInfo = {
    sixMonths: results.sixMonths,
    twelveMonths: results.twelveMonths,
    twentyFourMonths: results.twentyFourMonths,
    averagePerformance: results.averagePerformance,
    integration: results.integration,
    managerSatisfaction: results.managerSatisfaction
  };
  
  // 3. Sauvegarde de la mise à jour
  await saveExceptionRegistry(registryEntry);
  
  return registryEntry;
}
```

---

### 5.3 Mise à Jour de l'Apprentissage

```typescript
async function updateExceptionLearning(registryId: string, learning: ExceptionLearning): Promise<ExceptionRegistry> {
  // 1. Récupération de l'entrée du registre
  const registryEntry = await getExceptionRegistry(registryId);
  
  // 2. Mise à jour de l'apprentissage
  registryEntry.learningInfo = {
    justified: learning.justification.justified,
    ruleRevisionNeeded: learning.ruleRevision.revisionNeeded,
    revisionType: learning.ruleRevision.revisionType,
    revisionProposal: learning.ruleRevision.justification
  };
  
  // 3. Sauvegarde de la mise à jour
  await saveExceptionRegistry(registryEntry);
  
  return registryEntry;
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface ExceptionRegistry {
  registryId: string;
  dossierId: string;
  registeredAt: Date;
  
  basicInfo: {
    exceptionId: string;
    date: Date;
    ruleReference: string;
    ruleText: string;
    level: 'minor' | 'significant' | 'major';
    classification: {
      severity: 'low' | 'medium' | 'high';
      justifiability: 'low' | 'medium' | 'high';
      risks: any;
    };
  };
  
  candidateInfo: {
    candidateId: string;
    candidateName: string;
    jobTitle: string;
    department: string;
    atypicalProfile: string[];
  };
  
  decisionInfo: {
    decision: 'granted' | 'denied' | 'conditional';
    decisionMaker: string;
    decisionDate: Date;
    justification: string;
    conditions: string[];
  };
  
  resultsInfo: {
    sixMonths: {
      performance: number;
      integration: string;
      managerSatisfaction: number;
    } | null;
    twelveMonths: {
      performance: number;
      integration: string;
      managerSatisfaction: number;
    } | null;
    twentyFourMonths: {
      performance: number;
      integration: string;
      managerSatisfaction: number;
    } | null;
    averagePerformance: number | null;
    integration: string | null;
    managerSatisfaction: number | null;
  };
  
  learningInfo: {
    justified: boolean | null;
    ruleRevisionNeeded: boolean | null;
    revisionType: 'strengthen' | 'revise' | 'precise' | null;
    revisionProposal: string | null;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE exception_registry (
  id VARCHAR(36) PRIMARY KEY,
  dossier_id VARCHAR(36) NOT NULL,
  registered_at TIMESTAMP NOT NULL,
  
  basic_info JSON NOT NULL,
  candidate_info JSON NOT NULL,
  decision_info JSON NOT NULL,
  results_info JSON NOT NULL,
  learning_info JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (dossier_id) REFERENCES exception_dossier(id)
);

CREATE INDEX idx_exception_registry_dossier ON exception_registry(dossier_id);
CREATE INDEX idx_exception_registry_date ON exception_registry(registered_at);
CREATE INDEX idx_exception_registry_rule ON exception_registry((basic_info->>'ruleReference'));
CREATE INDEX idx_exception_registry_level ON exception_registry((basic_info->>'level'));
CREATE INDEX idx_exception_registry_decision ON exception_registry((decision_info->>'decision'));
```

---

## 8. API Endpoints

```typescript
// POST /api/exception-intelligence/registry
async function registerException(dossierId: string, decision: ExceptionDecision): Promise<ExceptionRegistry> {
  return await registerException(dossierId, decision);
}

// GET /api/exception-intelligence/registry/:registryId
async function getExceptionRegistry(registryId: string): Promise<ExceptionRegistry> {
  return await getExceptionRegistryById(registryId);
}

// GET /api/exception-intelligence/registry/rule/:ruleId
async function getExceptionsByRule(ruleId: string): Promise<ExceptionRegistry[]> {
  return await getExceptionsByRuleId(ruleId);
}

// GET /api/exception-intelligence/registry/level/:level
async function getExceptionsByLevel(level: string): Promise<ExceptionRegistry[]> {
  return await getExceptionsByLevel(level);
}

// PUT /api/exception-intelligence/registry/:registryId/results
async function updateExceptionResults(registryId: string, results: ExceptionResults): Promise<ExceptionRegistry> {
  return await updateExceptionResults(registryId, results);
}

// PUT /api/exception-intelligence/registry/:registryId/learning
async function updateExceptionLearning(registryId: string, learning: ExceptionLearning): Promise<ExceptionRegistry> {
  return await updateExceptionLearning(registryId, learning);
}

// GET /api/exception-intelligence/registry/export
async function exportExceptionRegistry(filters: ExceptionRegistryFilters): Promise<ExceptionRegistry[]> {
  return await exportExceptionRegistry(filters);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'enregistrement | Exceptions enregistrées / total | ≥ 95% |
| Complétude du registre | Entrées complètes / total | ≥ 90% |
- Taux de mise à jour des résultats | Résultats mis à jour / total | ≥ 80% |
- Satisfaction DRH | Satisfaction avec le registre | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Volume d'exceptions par règle | Exceptions par règle | Suivi mensuel |
- Taux d'accord des exceptions | Exceptions accordées / total | ≥ 70% |
- Résultats observés | Exceptions avec résultats positifs / total | ≥ 80% |

---

## 10. Conclusion

Le registre officiel des exceptions enregistre chaque exception avec traçabilité complète (date, règle, niveau, décision, résultat). Le registre permet de suivre l'historique des exceptions, d'analyser les tendances, d'identifier les règles candidates à révision, et de fournir une base pour les rapports trimestriels et les décisions de gouvernance. Le registre s'intègre avec les modules existants.

**Points clés :**
- 5 sections d'informations (base, candidat, décision, résultats, apprentissage)
- Traçabilité complète de chaque exception
- Suivi des résultats à 6, 12, 24 mois
- Mise à jour de l'apprentissage
- Export et filtrage du registre
- Base pour les rapports trimestriels
- Intégration avec les modules existants
