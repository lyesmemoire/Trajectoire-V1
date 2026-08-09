# DOC-M10-06 : Protocole d'Alerte Compatibilité Critique

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'alerte compatibilité critique pour le MVP-META-10 Manager Compatibility Engine. Ce document structure le processus de détection et de gestion des incompatibilités significatives entre un candidat et un manager.

---

## 2. Principe Fondateur

Si le score de compatibilité est inférieur à 6/20, une alerte critique est générée. Cette alerte informe le DRH de l'incompatibilité significative et propose des options recommandées pour gérer le risque.

---

## 3. Critères d'Alerte Critique

### 3.1 Seuil d'Alerte

**Score de compatibilité < 6/20**

Ce seuil correspond à une incompatibilité forte avec un risque élevé de conflit ou de départ prématuré.

---

### 3.2 Déclenchement de l'Alerte

L'alerte est déclenchée automatiquement lorsque :
- Le score global de compatibilité est calculé
- Le score est inférieur à 6/20
- Le nombre de dimensions en conflit est ≥ 4

---

## 4. Structure de l'Alerte Critique

### 4.1 Template d'Alerte

```markdown
⚠️ ALERTE COMPATIBILITÉ CRITIQUE

L'analyse suggère une incompatibilité
significative entre ce candidat
et ce manager sur [N] dimensions.

Risques identifiés :
→ [Risque 1 avec probabilité]
→ [Risque 2 avec probabilité]

Options recommandées :
Option 1 : Ne pas poursuivre
           ce recrutement dans
           cette configuration.

Option 2 : Changer de manager
           référent pour ce candidat.

Option 3 : Recruter en ayant
           un protocole de gestion
           de la relation
           dès le premier jour.

La décision appartient au DRH.
Ce risque doit être pris
en pleine conscience.
```

---

### 4.2 Détail des Risques Identifiés

**Rappeur de départ prématuré :**
- Probabilité : Élevée si score < 4/20
- Impact : Coût de recrutement, délai de remplacement

**Conflit relationnel :**
- Probabilité : Élevée si dimensions en conflit ≥ 4
- Impact : Climat d'équipe, productivité

**Performance réduite :**
- Probabilité : Modérée si score 4-6/20
- Impact : Objectifs non atteints, retard de projet

---

## 5. Options Recommandées

### 5.1 Option 1 — Ne Pas Poursuivre

**Description :**
Ne pas poursuivre ce recrutement dans cette configuration.

**Conditions :**
- Score de compatibilité < 4/20
- Dimensions en conflit ≥ 5
- Aucun autre manager disponible

**Actions :**
- Informer le candidat que le recrutement est suspendu
- Expliquer la raison de manière professionnelle
- Archiver le candidat pour d'autres opportunités

---

### 5.2 Option 2 — Changer de Manager Référent

**Description :**
Changer de manager référent pour ce candidat.

**Conditions :**
- Score de compatibilité < 6/20
- Un autre manager est disponible
- Le poste peut être rattaché à un autre manager

**Actions :**
- Identifier un manager compatible avec le candidat
- Calculer la compatibilité avec le nouveau manager
- Si score ≥ 12/20, procéder au recrutement

---

### 5.3 Option 3 — Protocole de Gestion de la Relation

**Description :**
Recruter en ayant un protocole de gestion de la relation dès le premier jour.

**Conditions :**
- Score de compatibilité 4-6/20
- Le candidat est exceptionnel sur d'autres critères
- Le manager est prêt à adapter son style

**Actions :**
- Mettre en place un protocole de suivi hebdomadaire
- Former le manager aux adaptations nécessaires
- Documenter les attentes et les limites
- Prévoir un point de contrôle à 3 mois

---

## 6. Structure de Données (TypeScript)

```typescript
interface CriticalAlert {
  alertId: string;
  recruitmentId: string;
  candidateId: string;
  managerId: string;
  
  score: {
    global: number;
    interpretation: string;
    conflictDimensions: number;
  };
  
  risks: {
    prematureDeparture: {
      probability: 'high' | 'medium' | 'low';
      impact: string;
    };
    relationalConflict: {
      probability: 'high' | 'medium' | 'low';
      impact: string;
    };
    reducedPerformance: {
      probability: 'high' | 'medium' | 'low';
      impact: string;
    };
  };
  
  recommendedOptions: {
    option1: {
      description: string;
      conditions: string[];
      actions: string[];
    };
    option2: {
      description: string;
      conditions: string[];
      actions: string[];
    };
    option3: {
      description: string;
      conditions: string[];
      actions: string[];
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

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE critical_alert (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  manager_id VARCHAR(36) NOT NULL,
  
  score JSON NOT NULL,
  risks JSON NOT NULL,
  recommended_options JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_critical_alert_recruitment ON critical_alert(recruitment_id);
CREATE INDEX idx_critical_alert_candidate ON critical_alert(candidate_id);
CREATE INDEX idx_critical_alert_manager ON critical_alert(manager_id);
CREATE INDEX idx_critical_alert_score ON critical_alert(score->>'global');
```

---

## 8. API Endpoints

```typescript
// POST /api/critical-alert/generate
async function generateCriticalAlert(recruitmentId: string, candidateId: string, managerId: string): Promise<CriticalAlert> {
  return await generateCriticalAlert(recruitmentId, candidateId, managerId);
}

// GET /api/critical-alert/:alertId
async function getCriticalAlert(alertId: string): Promise<CriticalAlert> {
  return await getCriticalAlert(alertId);
}

// GET /api/critical-alert/recruitment/:recruitmentId
async function getCriticalAlertByRecruitment(recruitmentId: string): Promise<CriticalAlert> {
  return await getCriticalAlertByRecruitment(recruitmentId);
}

// GET /api/critical-alert/list
async function listCriticalAlerts(limit?: number, offset?: number): Promise<CriticalAlert[]> {
  return await listCriticalAlerts(limit, offset);
}

// PUT /api/critical-alert/:alertId/decision
async function recordDecision(alertId: string, decision: string, reason: string): Promise<CriticalAlert> {
  return await recordDecision(alertId, decision, reason);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques d'Alerte

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'alertes générées | Alertes générées / recrutements | ≤ 15% |
- Taux de décisions prises | Décisions prises / alertes | ≥ 90% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de rejets suite alerte | Rejets / alertes | ≥ 70% |
- Taux de succès malgré alerte | Succès / poursuites | ≥ 60% |

---

## 10. Exemple Complet

```markdown
ALERTE COMPATIBILITÉ CRITIQUE

Candidat : [Anonymisé]
Manager : [Anonymisé]
Recrutement : REC-2026-001
Date : 2026-08-04

⚠️ ALERTE COMPATIBILITÉ CRITIQUE

L'analyse suggère une incompatibilité
significative entre ce candidat
et ce manager sur 5 dimensions.

Score de compatibilité : 4 / 20
Interprétation : Incompatibilité forte

Risques identifiés :
→ Départ prématuré : Probabilité élevée (80%)
→ Conflit relationnel : Probabilité élevée (75%)
→ Performance réduite : Probabilité modérée (50%)

Options recommandées :
Option 1 : Ne pas poursuivre
           ce recrutement dans
           cette configuration.
           Conditions : Score < 4/20, 5 dimensions en conflit
           Actions : Informer le candidat, expliquer la raison

Option 2 : Changer de manager
           référent pour ce candidat.
           Conditions : Autre manager disponible
           Actions : Identifier manager compatible, recalculer score

Option 3 : Recruter en ayant
           un protocole de gestion
           de la relation
           dès le premier jour.
           Conditions : Candidat exceptionnel, manager adaptable
           Actions : Protocole suivi hebdomadaire, formation manager

La décision appartient au DRH.
Ce risque doit être pris
en pleine conscience.
```

---

## 11. Conclusion

Le protocole d'alerte compatibilité critique structure le processus de détection et de gestion des incompatibilités significatives. Seuil d'alerte : score < 6/20. Template d'alerte avec risques identifiés et options recommandées. 3 options : Ne pas poursuivre, Changer de manager, Protocole de gestion. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Seuil d'alerte critique (< 6/20)
- Template d'alerte structuré
- Risques identifiés avec probabilités
- 3 options recommandées
- Conditions et actions pour chaque option
- Décision appartient au DRH
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'alerte et d'impact
