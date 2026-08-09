# DOC-M03-04 : Protocole de Mise à Jour en Temps Réel

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de mise à jour en temps réel pour le MVP-META-03 Comparative Intelligence Engine. Ce document structure le processus de mise à jour automatique du tableau comparatif après chaque entretien.

---

## 2. Principe Fondateur

Le tableau comparatif est mis à jour automatiquement après chaque entretien conduit. Le recruteur n'a pas besoin de mettre à jour manuellement : le moteur détecte la fin de l'entretien, extrait les scores, et met à jour le tableau en temps réel.

---

## 3. Processus de Mise à Jour

### 3.1 Déclenchement

**Déclencheurs :**
- Fin d'un entretien (statut "terminé")
- Validation du score par le recruteur
- Ajout manuel d'un candidat (optionnel)

### 3.2 Processus Automatique

**Étape 1 : Détection de la fin d'entretien**
- Le moteur surveille le statut des entretiens
- Lorsqu'un entretien passe en statut "terminé", le processus est déclenché

**Étape 2 : Extraction des scores**
- Le moteur extrait les scores du debrief
- Les scores sont normalisés sur l'échelle 0-5 pour chaque dimension
- Le score global est calculé (somme des 6 dimensions)

**Étape 3 : Mise à jour du tableau comparatif**
- Le candidat est ajouté au tableau comparatif
- Les meilleurs candidats sur chaque critère sont recalculés
- Le tableau est sauvegardé en base de données

**Étape 4 : Régénération des analyses comparatives**
- Les 4 analyses comparatives sont régénérées
- La recommandation comparative finale est mise à jour

**Étape 5 : Notification du recruteur**
- Le recruteur est notifié de la mise à jour
- Le tableau comparatif est affiché en temps réel

---

## 4. Structure de Données (TypeScript)

```typescript
interface UpdateTrigger {
  triggerId: string;
  triggerType: 'interviewCompleted' | 'scoreValidated' | 'manualAdd';
  
  interviewId?: string;
  candidateId?: string;
  recruitmentId: string;
  
  triggeredAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
  };
}

interface UpdateProcess {
  processId: string;
  triggerId: string;
  
  steps: {
    detection: {
      status: 'pending' | 'completed' | 'failed';
      completedAt?: Date;
      error?: string;
    };
    extraction: {
      status: 'pending' | 'completed' | 'failed';
      completedAt?: Date;
      error?: string;
      scores?: {
        tech: number;
        experience: number;
        soft: number;
        fit: number;
        maturity: number;
        potential: number;
      };
    };
    tableUpdate: {
      status: 'pending' | 'completed' | 'failed';
      completedAt?: Date;
      error?: string;
    };
    analysisRegeneration: {
      status: 'pending' | 'completed' | 'failed';
      completedAt?: Date;
      error?: string;
    };
    notification: {
      status: 'pending' | 'completed' | 'failed';
      completedAt?: Date;
      error?: string;
    };
  };
  
  overallStatus: 'pending' | 'inProgress' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  
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
CREATE TABLE update_trigger (
  id VARCHAR(36) PRIMARY KEY,
  trigger_type VARCHAR(30) NOT NULL,
  
  interview_id VARCHAR(36),
  candidate_id VARCHAR(36),
  recruitment_id VARCHAR(36) NOT NULL,
  
  triggered_at TIMESTAMP NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_update_trigger_recruitment ON update_trigger(recruitment_id);
CREATE INDEX idx_update_trigger_interview ON update_trigger(interview_id);

CREATE TABLE update_process (
  id VARCHAR(36) PRIMARY KEY,
  trigger_id VARCHAR(36) NOT NULL,
  
  steps JSON NOT NULL,
  overall_status VARCHAR(20) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  error TEXT,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_update_process_trigger ON update_process(trigger_id);
CREATE INDEX idx_update_process_status ON update_process(overall_status);
```

---

## 6. API Endpoints

```typescript
// POST /api/update-trigger/create
async function createUpdateTrigger(trigger: UpdateTrigger): Promise<UpdateTrigger> {
  return await createUpdateTrigger(trigger);
}

// POST /api/update-process/start
async function startUpdateProcess(triggerId: string): Promise<UpdateProcess> {
  return await startUpdateProcess(triggerId);
}

// GET /api/update-process/:processId
async function getUpdateProcess(processId: string): Promise<UpdateProcess> {
  return await getUpdateProcessById(processId);
}

// GET /api/update-process/recruitment/:recruitmentId
async function getUpdateProcessesByRecruitment(recruitmentId: string): Promise<UpdateProcess[]> {
  return await getUpdateProcessesByRecruitment(recruitmentId);
}

// POST /api/comparative-table/trigger-update
async function triggerTableUpdate(interviewId: string): Promise<UpdateProcess> {
  return await triggerTableUpdate(interviewId);
}

// POST /api/comparative-table/manual-add
async function manualAddCandidate(recruitmentId: string, candidateScore: CandidateScore): Promise<UpdateProcess> {
  return await manualAddCandidate(recruitmentId, candidateScore);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de succès des mises à jour | Mises à jour réussies / totales | ≥ 95% |
- Temps moyen de mise à jour | Moyenne du temps de mise à jour | ≤ 30 secondes |

### 7.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de complétude | Mises à jour complètes / totales | 100% |
- Taux de régénération | Analyses régénérées / mises à jour | 100% |

---

## 8. Gestion des Erreurs

### 8.1 Types d'Erreurs

**Erreur 1 : Extraction des scores échouée**
- Cause : Debrief non disponible ou incomplet
- Action : Retenter l'extraction après 5 minutes
- Notification : Alerte au recruteur

**Erreur 2 : Mise à jour du tableau échouée**
- Cause : Erreur de base de données
- Action : Retenter la mise à jour après 1 minute
- Notification : Alerte au recruteur si 3 échecs consécutifs

**Erreur 3 : Régénération des analyses échouée**
- Cause : Erreur de calcul
- Action : Retenter la régénération après 1 minute
- Notification : Alerte au recruteur si 3 échecs consécutifs

**Erreur 4 : Notification échouée**
- Cause : Erreur de notification
- Action : Retenter la notification après 1 minute
- Notification : Aucune (erreur silencieuse)

### 8.2 Protocole de Retry

**Retry automatique :**
- Maximum 3 tentatives pour chaque étape
- Délai entre tentatives : 1 minute
- Après 3 échecs : notification au recruteur

**Retry manuel :**
- Le recruteur peut déclencher manuellement une mise à jour
- Bouton "Mettre à jour le tableau" dans l'interface

---

## 9. Sécurité et Validation

### 9.1 Validation des Scores

**Règles de validation :**
- Scores doivent être entre 0 et 5
- Score global doit être entre 0 et 30
- Scores doivent être cohérents avec le debrief

### 9.2 Validation des Candidats

**Règles de validation :**
- Candidat doit être unique dans le tableau (pas de doublons)
- Candidat doit être associé au recrutement
- Candidat doit avoir un entretien terminé

---

## 10. Conclusion

Le protocole de mise à jour en temps réel structure le processus de mise à jour automatique du tableau comparatif après chaque entretien. Déclencheurs : fin d'entretien, validation du score, ajout manuel. Processus automatique en 5 étapes : Détection de la fin d'entretien, Extraction des scores, Mise à jour du tableau comparatif, Régénération des analyses comparatives, Notification du recruteur. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion. Gestion des erreurs avec retry automatique et manuel. Sécurité et validation des scores et candidats.

**Points clés :**
- Mise à jour automatique après chaque entretien
- 5 étapes du processus
- Déclencheurs multiples
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Gestion des erreurs
- Retry automatique et manuel
- Sécurité et validation
- Métriques de performance et de qualité
