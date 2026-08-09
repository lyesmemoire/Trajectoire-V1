# DOC-029-06 : Protocole de Péremption et Révision

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de péremption et révision des patterns pour MVP-029 Institutional Memory Engine. Ce protocole définit comment détecter les patterns périmentés, les mettre en doute, et les réévaluer pour assurer la pertinence continue de la mémoire institutionnelle.

---

## 2. Principe Fondateur

Le marché RH évolue. Ce qui était vrai il y a 3 ans ne l'est plus nécessairement. Chaque pattern a une date de validité. Au-delà : réévaluation obligatoire. Un pattern non réévalué depuis 2 ans est automatiquement mis en doute. Le protocole assure que la mémoire institutionnelle reste pertinente et à jour.

---

## 3. Péremption des Patterns

### 3.1 Date de Validité

**Calcul de la validité :**
- Validité estimée : 18 mois par défaut
- Ajustement selon le contexte :
  - Secteurs stables : +6 mois (24 mois)
  - Secteurs dynamiques : -6 mois (12 mois)
  - Contextes stables : +6 mois
  - Contextes dynamiques : -6 mois

**Enregistrement :**
- Date de création du pattern
- Date de validité estimée
- Date de dernière réévaluation

---

### 3.2 Détection de Péremption

**Critères de péremption :**
- Pattern non réévalué depuis 2 ans
- Validité estimée dépassée
- Résultats récents infirmant le pattern
- Évolution du marché détectée (via MVP-019)
- Changement de contexte significatif

**Processus de détection :**
1. Scan automatique mensuel
2. Identification des patterns périmentés
3. Génération d'alertes
4. Notification aux responsables

---

### 3.3 Algorithme de Détection

```typescript
async function detectDeprecatedPatterns(): Promise<{
  deprecatedPatterns: string[];
  alertsGenerated: number;
}> {
  // 1. Récupération de tous les patterns
  const patterns = await getAllSuccessPatterns();
  
  const deprecatedPatterns: string[] = [];
  
  // 2. Pour chaque pattern
  for (const pattern of patterns) {
    // 3. Vérification des critères de péremption
    const isDeprecated = await checkDeprecationCriteria(pattern);
    
    if (isDeprecated) {
      deprecatedPatterns.push(pattern.patternId);
      
      // 4. Génération d'alerte
      await generateAlert(pattern.patternId, 'deprecated');
    }
  }
  
  return {
    deprecatedPatterns,
    alertsGenerated: deprecatedPatterns.length
  };
}

async function checkDeprecationCriteria(pattern: SuccessPattern): Promise<boolean> {
  const now = new Date();
  
  // Critère 1 : Non réévalué depuis 2 ans
  const lastUpdated = new Date(pattern.confidence.lastUpdated);
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  if (lastUpdated < twoYearsAgo) {
    return true;
  }
  
  // Critère 2 : Validité estimée dépassée
  const validityDate = new Date(pattern.confidence.lastUpdated);
  validityDate.setMonth(validityDate.getMonth() + pattern.confidence.estimatedValidity);
  if (validityDate < now) {
    return true;
  }
  
  // Critère 3 : Résultats récents infirmant le pattern
  const recentResults = await getRecentResults(pattern.patternId);
  if (recentResults.invalidatePattern) {
    return true;
  }
  
  // Critère 4 : Évolution du marché détectée
  const marketEvolution = await getMarketEvolution(pattern.context);
  if (marketEvolution.significantChange) {
    return true;
  }
  
  return false;
}
```

---

## 4. Révision des Patterns

### 4.1 Processus de Révision

**Déclenchement :**
- Péremption détectée
- Résultats infirmants
- Évolution du marché
- Demande manuelle

**Étapes :**
1. Identification du pattern à réviser
2. Collecte des données récentes
3. Analyse des changements de contexte
4. Réévaluation du pattern
5. Validation ou invalidation
6. Mise à jour ou suppression

---

### 4.2 Types de Révision

**Révision mineure :**
- Mise à jour des résultats
- Ajustement de la confiance
- Mise à jour de la validité

**Révision majeure :**
- Modification des caractéristiques
- Modification des signaux
- Modification des résultats

**Révision complète :**
- Reconstruction du pattern
- Nouvelle analyse des données
- Nouvelle validation

---

### 4.3 Algorithme de Révision

```typescript
async function revisePattern(patternId: string, revisionType: 'minor' | 'major' | 'complete'): Promise<SuccessPattern> {
  // 1. Récupération du pattern
  const pattern = await getSuccessPattern(patternId);
  
  // 2. Collecte des données récentes
  const recentData = await collectRecentData(pattern);
  
  // 3. Analyse des changements de contexte
  const contextChanges = await analyzeContextChanges(pattern, recentData);
  
  // 4. Réévaluation selon le type de révision
  let revisedPattern: SuccessPattern;
  
  switch (revisionType) {
    case 'minor':
      revisedPattern = await minorRevision(pattern, recentData);
      break;
    case 'major':
      revisedPattern = await majorRevision(pattern, recentData, contextChanges);
      break;
    case 'complete':
      revisedPattern = await completeRevision(pattern, recentData, contextChanges);
      break;
  }
  
  // 5. Validation ou invalidation
  const validation = await validatePattern(revisedPattern);
  
  if (!validation.isValid) {
    // 6. Suppression si invalide
    await deleteSuccessPattern(patternId);
    throw new Error('Pattern invalidé et supprimé');
  }
  
  // 7. Mise à jour du pattern
  revisedPattern.confidence.lastUpdated = new Date();
  revisedPattern.metadata.version = incrementVersion(revisedPattern.metadata.version);
  
  // 8. Sauvegarde du pattern révisé
  await saveSuccessPattern(revisedPattern);
  
  return revisedPattern;
}
```

---

## 5. Mise en Doute des Patterns

### 5.1 Critères de Mise en Doute

**Mise en doute automatique :**
- Pattern non réévalué depuis 2 ans
- Validité estimée dépassée
- Résultats contradictoires

**Mise en doute manuelle :**
- Demande d'un expert
- Feedback négatif des recruteurs
- Changement de contexte significatif

---

### 5.2 Présentation des Patterns en Doute

**Indicateur visuel :**
- ⚠️ (attention)

**Message :**
- "Pattern en attente de révision. À utiliser avec prudence."

**Restrictions :**
- Utilisation possible mais avec réserves
- Documentation obligatoire des décisions
- Alerte de révision automatique

---

### 5.3 Algorithme de Mise en Doute

```typescript
async function markPatternAsDoubtful(patternId: string, reason: string): Promise<SuccessPattern> {
  // 1. Récupération du pattern
  const pattern = await getSuccessPattern(patternId);
  
  // 2. Mise en doute
  pattern.metadata.status = 'doubtful';
  pattern.metadata.doubtReason = reason;
  pattern.metadata.doubtDate = new Date();
  
  // 3. Sauvegarde du pattern
  await saveSuccessPattern(pattern);
  
  // 4. Notification aux responsables
  await notifyPatternDoubt(patternId, reason);
  
  return pattern;
}
```

---

## 6. Audit Annuel de la Mémoire

### 6.1 Objectif

Revue annuelle de la mémoire institutionnelle pour valider, infirmer, ou mettre en doute les patterns.

### 6.2 Processus

**Étape 1 : Identification**
- Patterns validés par les résultats : maintenus
- Patterns infirmés par les résultats : supprimés
- Patterns non réévalués : mis en doute
- Nouvelles leçons à intégrer : identifiées

**Étape 2 : Analyse**
- Analyse des tendances
- Analyse des changements de contexte
- Analyse des résultats

**Étape 3 : Décision**
- Maintien des patterns validés
- Suppression des patterns infirmés
- Révision des patterns en doute
- Création des nouveaux patterns

**Étape 4 : Rapport**
- Rapport d'audit annuel
- Recommandations
- Plan d'action

---

### 6.3 Algorithme d'Audit

```typescript
async function annualMemoryAudit(): Promise<AuditReport> {
  // 1. Récupération de tous les patterns
  const patterns = await getAllSuccessPatterns();
  
  const auditReport: AuditReport = {
    auditId: generateAuditId(),
    auditedAt: new Date(),
    
    patternsValidated: [],
    patternsInvalidated: [],
    patternsDoubted: [],
    newLessons: []
  };
  
  // 2. Pour chaque pattern
  for (const pattern of patterns) {
    // 3. Analyse des résultats récents
    const recentResults = await getRecentResults(pattern.patternId);
    
    // 4. Décision
    if (recentResults.validatePattern) {
      auditReport.patternsValidated.push(pattern.patternId);
    } else if (recentResults.invalidatePattern) {
      auditReport.patternsInvalidated.push(pattern.patternId);
      await deleteSuccessPattern(pattern.patternId);
    } else {
      auditReport.patternsDoubted.push(pattern.patternId);
      await markPatternAsDoubtful(pattern.patternId, 'Non réévalué depuis 1 an');
    }
  }
  
  // 5. Identification des nouvelles leçons
  auditReport.newLessons = await identifyNewLessons();
  
  // 6. Sauvegarde du rapport
  await saveAuditReport(auditReport);
  
  return auditReport;
}
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface PatternDeprecation {
  patternId: string;
  
  deprecationDate: Date;
  deprecationReason: string;
  deprecationType: 'expired' | 'invalidated' | 'market_change' | 'manual';
  
  revisionRequired: boolean;
  revisionDeadline: Date;
  
  metadata: {
    deprecatedBy: string;
    notifiedAt: Date;
  };
}

interface PatternRevision {
  revisionId: string;
  patternId: string;
  
  revisionType: 'minor' | 'major' | 'complete';
  revisionDate: Date;
  
  changes: {
    characteristics: string[];
    signals: string[];
    results: string[];
  };
  
  validation: {
    isValid: boolean;
    validatedBy: string;
    validatedAt: Date;
  };
  
  metadata: {
    revisedBy: string;
    version: string;
  };
}

interface AuditReport {
  auditId: string;
  auditedAt: Date;
  
  patternsValidated: string[];
  patternsInvalidated: string[];
  patternsDoubted: string[];
  newLessons: string[];
  
  recommendations: string[];
  actionPlan: string[];
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE pattern_deprecation (
  id VARCHAR(36) PRIMARY KEY,
  pattern_id VARCHAR(36) NOT NULL,
  
  deprecation_date TIMESTAMP NOT NULL,
  deprecation_reason TEXT NOT NULL,
  deprecation_type VARCHAR(50) NOT NULL CHECK (deprecation_type IN ('expired', 'invalidated', 'market_change', 'manual')),
  
  revision_required BOOLEAN NOT NULL,
  revision_deadline TIMESTAMP,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (pattern_id) REFERENCES success_pattern(id)
);

CREATE INDEX idx_pattern_deprecation_date ON pattern_deprecation(deprecation_date);
CREATE INDEX idx_pattern_deprecation_type ON pattern_deprecation(deprecation_type);

CREATE TABLE pattern_revision (
  id VARCHAR(36) PRIMARY KEY,
  pattern_id VARCHAR(36) NOT NULL,
  
  revision_type VARCHAR(50) NOT NULL CHECK (revision_type IN ('minor', 'major', 'complete')),
  revision_date TIMESTAMP NOT NULL,
  
  changes JSON NOT NULL,
  validation JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (pattern_id) REFERENCES success_pattern(id)
);

CREATE INDEX idx_pattern_revision_date ON pattern_revision(revision_date);
CREATE INDEX idx_pattern_revision_type ON pattern_revision(revision_type);

CREATE TABLE audit_report (
  id VARCHAR(36) PRIMARY KEY,
  audited_at TIMESTAMP NOT NULL,
  
  patterns_validated JSON NOT NULL,
  patterns_invalidated JSON NOT NULL,
  patterns_doubted JSON NOT NULL,
  new_lessons JSON NOT NULL,
  
  recommendations JSON NOT NULL,
  action_plan JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_report_date ON audit_report(audited_at);
```

---

## 9. API Endpoints

```typescript
// POST /api/institutional-memory/patterns/deprecate
async function detectDeprecatedPatterns(): Promise<{ deprecatedPatterns: string[]; alertsGenerated: number }> {
  return await detectDeprecatedPatterns();
}

// POST /api/institutional-memory/patterns/:patternId/revise
async function revisePattern(patternId: string, revisionType: 'minor' | 'major' | 'complete'): Promise<SuccessPattern> {
  return await revisePattern(patternId, revisionType);
}

// POST /api/institutional-memory/patterns/:patternId/doubt
async function markPatternAsDoubtful(patternId: string, reason: string): Promise<SuccessPattern> {
  return await markPatternAsDoubtful(patternId, reason);
}

// POST /api/institutional-memory/audit
async function annualMemoryAudit(): Promise<AuditReport> {
  return await annualMemoryAudit();
}

// GET /api/institutional-memory/patterns/deprecated
async function getDeprecatedPatterns(): Promise<PatternDeprecation[]> {
  return await getDeprecatedPatterns();
}

// GET /api/institutional-memory/patterns/doubted
async function getDoubtedPatterns(): Promise<SuccessPattern[]> {
  return await getDoubtedPatterns();
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de révision | Patterns révisés / périmentés | ≥ 90% |
- Délai moyen de révision | Délai moyen de révision | ≤ 30 jours |
- Taux de validation | Patterns validés / révisés | ≥ 80% |
- Taux de suppression | Patterns supprimés / audités | ≤ 20% |

### 10.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Réduction des patterns périmentés | Réduction des patterns périmentés | ≥ 50% |
- Amélioration de la pertinence | Amélioration de la pertinence des patterns | ≥ 30% |
- Satisfaction recruteurs | Satisfaction avec la mémoire à jour | ≥ 4.5/5 |

---

## 11. Conclusion

Le protocole de péremption et révision définit comment détecter les patterns périmentés, les mettre en doute, et les réévaluer pour assurer la pertinence continue de la mémoire institutionnelle. Le protocole assure que la mémoire reste à jour avec l'évolution du marché et des contextes organisationnels.

**Points clés :**
- Date de validité estimée (18 mois par défaut)
- Détection automatique de péremption
- 3 types de révision (mineure, majeure, complète)
- Mise en doute des patterns non réévalués
- Audit annuel de la mémoire
- Validation ou invalidation des patterns
- Intégration avec MVP-019 (veille marché)
- Métriques de qualité et d'impact
