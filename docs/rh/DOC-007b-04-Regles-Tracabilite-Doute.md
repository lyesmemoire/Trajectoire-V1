# DOC-007b-04 : Règles de Traçabilité du Doute

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les règles de traçabilité du doute pour le moteur de raisonnement. Chaque expression de doute est tracée pour garantir l'auditabilité, l'amélioration continue et l'alimentation de MVP-008 Learning Engine.

---

## 2. Principe de Traçabilité

Chaque expression de doute est tracée avec :
- Horodatage
- Type de doute (Niveau 1 à 4)
- Données manquantes identifiées
- Action recommandée
- Suite donnée par le recruteur

Ces traces alimentent MVP-008 Learning Engine pour améliorer la détection d'incertitude dans le temps.

---

## 3. Structure de la Trace

### 3.1 Interface de Trace

```typescript
interface DoubtTrace {
  id: string;
  timestamp: Date;
  level: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Données du doute
  missingData: string[];
  contradictions: string[];
  indicators: string[];
  risks: string[];
  
  // Formulation
  certainFacts: string[];
  reservedEstimates: Array<{
    estimate: string;
    justification: string;
  }>;
  unknowns: string[];
  recommendations: string[];
  
  // Contexte
  candidateId?: string;
  jobId?: string;
  recruiterId?: string;
  
  // Résolution
  recruiterAction?: string;
  resolution?: string;
  resolutionTimestamp?: Date;
  resolutionOutcome?: 'resolved' | 'partially_resolved' | 'unresolved' | 'escalated';
  
  // Feedback
  recruiterFeedback?: string;
  accuracyRating?: number; // 1-5
  
  // Métadonnées
  processingTime: number;
  engineVersion: string;
}
```

---

## 4. Règles d'Enregistrement

### 4.1 Règle 1 : Enregistrement Obligatoire

Tout doute détecté par le moteur doit être enregistré, sans exception.

**Implémentation :**
```typescript
function recordDoubt(doubt: DoubtClassification, formulation: DoubtFormulation, context: any): void {
  const trace: DoubtTrace = {
    id: generateUUID(),
    timestamp: new Date(),
    level: doubt.level,
    type: doubt.type,
    severity: doubt.severity,
    missingData: doubt.details?.missingData || [],
    contradictions: doubt.details?.contradictions || [],
    indicators: doubt.details?.indicators || [],
    risks: doubt.details?.risks || [],
    certainFacts: formulation.certainFacts,
    reservedEstimates: formulation.reservedEstimates,
    unknowns: formulation.unknowns,
    recommendations: formulation.recommendations,
    candidateId: context.candidateId,
    jobId: context.jobId,
    recruiterId: context.recruiterId,
    processingTime: context.processingTime,
    engineVersion: getEngineVersion(),
  };
  
  DoubtTraceRepository.save(trace);
}
```

### 4.2 Règle 2 : Horodatage Précis

Chaque trace doit inclure un horodatage précis à la milliseconde près.

**Format :** ISO 8601 avec timezone UTC

**Exemple :** `2026-08-03T14:30:45.123Z`

### 4.3 Règle 3 : Identification du Contexte

Chaque trace doit inclure les identifiants de contexte :
- `candidateId` : Identifiant du candidat
- `jobId` : Identifiant du poste
- `recruiterId` : Identifiant du recruteur

### 4.4 Règle 4 : Complétude des Données

Tous les champs de la trace doivent être remplis. Les champs optionnels ne doivent être laissés vides que s'ils ne s'appliquent pas.

### 4.5 Règle 5 : Immutabilité

Une trace enregistrée ne peut pas être modifiée. Seuls les champs de résolution peuvent être ajoutés ultérieurement.

---

## 5. Règles de Résolution

### 5.1 Règle 6 : Enregistrement de la Résolution

Lorsque le recruteur résout un doute, la résolution doit être enregistrée.

**Champs de résolution :**
- `recruiterAction` : Action entreprise par le recruteur
- `resolution` : Description de la résolution
- `resolutionTimestamp` : Horodatage de la résolution
- `resolutionOutcome` : Résultat de la résolution

### 5.2 Règle 7 : Types de Résolution

| Outcome | Description |
|---------|-------------|
| `resolved` | Le doute a été complètement résolu |
| `partially_resolved` | Le doute a été partiellement résolu |
| `unresolved` | Le doute n'a pas pu être résolu |
| `escalated` | Le doute a été escaladé à un expert |

### 5.3 Règle 8 : Feedback du Recruteur

Le recruteur peut fournir un feedback sur la pertinence du doute détecté.

**Champs de feedback :**
- `recruiterFeedback` : Commentaire textuel du recruteur
- `accuracyRating` : Note de 1 à 5 sur la précision de la détection

---

## 6. Règles de Stockage

### 6.1 Règle 9 : Stockage Persistant

Les traces doivent être stockées de manière persistante dans une base de données.

**Table de stockage :**
```sql
CREATE TABLE doubt_traces (
  id VARCHAR(36) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  level INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  missing_data JSON,
  contradictions JSON,
  indicators JSON,
  risks JSON,
  certain_facts JSON,
  reserved_estimates JSON,
  unknowns JSON,
  recommendations JSON,
  candidate_id VARCHAR(36),
  job_id VARCHAR(36),
  recruiter_id VARCHAR(36),
  recruiter_action TEXT,
  resolution TEXT,
  resolution_timestamp TIMESTAMP,
  resolution_outcome VARCHAR(30),
  recruiter_feedback TEXT,
  accuracy_rating INT,
  processing_time INT,
  engine_version VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 6.2 Règle 10 : Indexation

La table doit être indexée pour permettre des requêtes efficaces :

```sql
CREATE INDEX idx_doubt_traces_timestamp ON doubt_traces(timestamp);
CREATE INDEX idx_doubt_traces_level ON doubt_traces(level);
CREATE INDEX idx_doubt_traces_type ON doubt_traces(type);
CREATE INDEX idx_doubt_traces_candidate ON doubt_traces(candidate_id);
CREATE INDEX idx_doubt_traces_job ON doubt_traces(job_id);
CREATE INDEX idx_doubt_traces_recruiter ON doubt_traces(recruiter_id);
CREATE INDEX idx_doubt_traces_resolution_outcome ON doubt_traces(resolution_outcome);
```

### 6.3 Règle 11 : Rétention des Données

Les traces doivent être conservées pendant une période minimale de 2 ans pour l'auditabilité et l'amélioration continue.

### 6.4 Règle 12 : Anonymisation pour l'Apprentissage

Pour l'alimentation de MVP-008 Learning Engine, les traces doivent être anonymisées :

- Suppression de `candidateId`, `jobId`, `recruiterId`
- Conservation des données de doute et de résolution
- Ajout d'un flag `anonymized: true`

---

## 7. Règles d'Accès et de Confidentialité

### 7.1 Règle 13 : Contrôle d'Accès

L'accès aux traces doit être contrôlé :

- **Lecture :** Recruteurs, Experts RH, Administrateurs système
- **Écriture :** Système uniquement (automatique)
- **Suppression :** Administrateurs système uniquement (avec justification)

### 7.2 Règle 14 : Audit Trail

Tout accès aux traces doit être enregistré dans un audit trail :

```typescript
interface AuditLog {
  timestamp: Date;
  userId: string;
  action: 'read' | 'write' | 'delete';
  resourceType: 'doubt_trace';
  resourceId: string;
  justification?: string;
}
```

### 7.3 Règle 15 : Conformité RGPD

Les traces contiennent des données personnelles et doivent respecter le RGPD :

- Consentement explicite pour le traitement
- Droit d'accès pour les candidats
- Droit de suppression pour les candidats
- Minimisation des données (seulement les données nécessaires)

---

## 8. Règles d'Analyse et de Reporting

### 8.1 Règle 16 : Rapports Périodiques

Des rapports périodiques doivent être générés :

- **Quotidien :** Nombre de doutes par niveau
- **Hebdomadaire :** Taux de résolution par type
- **Mensuel :** Tendances et patterns de doute
- **Trimestriel :** Analyse approfondie et recommandations d'amélioration

### 8.2 Règle 17 : Métriques Clés

Les métriques suivantes doivent être suivies :

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection de doute | (Doutes détectés / Total analyses) × 100 | Variable |
| Taux de résolution | (Doutes résolus / Total doutes) × 100 | ≥ 80% |
| Temps moyen de résolution | Moyenne du temps entre détection et résolution | < 7 jours |
| Précision de la détection | (Doutes validés par recruteur / Total doutes) × 100 | ≥ 90% |
| Satisfaction du recruteur | Moyenne des accuracy ratings | ≥ 4/5 |

### 8.3 Règle 18 : Alertes Automatiques

Des alertes automatiques doivent être déclenchées si :

- Taux de NIVEAU 4 (risque éthique/juridique) > 1% des analyses
- Taux de résolution < 70% pendant 3 mois consécutifs
- Satisfaction du recruteur < 3/5 pendant 1 mois consécutif

---

## 9. Règles d'Intégration avec MVP-008

### 9.1 Règle 19 : Export pour l'Apprentissage

Les traces anonymisées doivent être exportées régulièrement pour MVP-008 Learning Engine :

- **Fréquence :** Quotidienne
- **Format :** JSON ou Parquet
- **Contenu :** Données de doute, formulation, résolution, feedback

### 9.2 Règle 20 : Boucle de Rétroaction

MVP-008 Learning Engine doit fournir des améliorations basées sur les traces :

- Ajustement des seuils de détection
- Amélioration des formulations
- Ajout de nouveaux types de doute
- Optimisation des recommandations

### 9.3 Règle 21 : Validation des Améliorations

Toute amélioration proposée par MVP-008 doit être validée avant déploiement :

- Tests sur golden dataset
- Validation par experts RH
- A/B testing en production
- Approbation par le comité d'éthique

---

## 10. Règles d'API

### 10.1 Endpoint d'Enregistrement

```
POST /api/doubt-traces
```

**Body :**
```json
{
  "doubt": { ... },
  "formulation": { ... },
  "context": {
    "candidateId": "...",
    "jobId": "...",
    "recruiterId": "..."
  }
}
```

**Response :**
```json
{
  "id": "...",
  "timestamp": "2026-08-03T14:30:45.123Z",
  "status": "recorded"
}
```

### 10.2 Endpoint de Résolution

```
PUT /api/doubt-traces/:id/resolution
```

**Body :**
```json
{
  "recruiterAction": "...",
  "resolution": "...",
  "resolutionOutcome": "resolved",
  "recruiterFeedback": "...",
  "accuracyRating": 5
}
```

### 10.3 Endpoint de Consultation

```
GET /api/doubt-traces?candidateId=:candidateId&jobId=:jobId&level=:level&from=:from&to=:to
```

**Response :**
```json
{
  "traces": [ ... ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### 10.4 Endpoint de Reporting

```
GET /api/doubt-traces/reports?period=daily|weekly|monthly|quarterly
```

**Response :**
```json
{
  "period": "weekly",
  "startDate": "2026-07-28",
  "endDate": "2026-08-03",
  "metrics": {
    "totalDoubts": 150,
    "byLevel": { "1": 80, "2": 40, "3": 25, "4": 5 },
    "resolutionRate": 0.85,
    "averageResolutionTime": 5.2,
    "detectionAccuracy": 0.92,
    "recruiterSatisfaction": 4.3
  },
  "alerts": [ ... ]
}
```

---

## 11. Règles de Qualité des Données

### 11.1 Règle 22 : Validation des Données

Toutes les traces doivent être validées avant enregistrement :

```typescript
function validateDoubtTrace(trace: DoubtTrace): ValidationResult {
  const errors: string[] = [];
  
  if (!trace.id) errors.push("ID manquant");
  if (!trace.timestamp) errors.push("Timestamp manquant");
  if (trace.level < 0 || trace.level > 4) errors.push("Niveau invalide");
  if (!trace.type) errors.push("Type manquant");
  if (!trace.severity) errors.push("Sévérité manquante");
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### 11.2 Règle 23 : Déduplication

Les traces en double doivent être détectées et fusionnées :

- Critère de duplication : Même `candidateId`, `jobId`, `level`, `type` dans un intervalle de 5 minutes
- Action : Fusionner les traces et conserver la plus récente

### 11.3 Règle 24 : Nettoyage des Données

Un nettoyage périodique doit être effectué :

- Suppression des traces de test
- Archivage des traces anciennes (> 2 ans)
- Anonymisation des traces pour l'apprentissage

---

## 12. Règles de Sécurité

### 12.1 Règle 25 : Chiffrement

Les traces doivent être chiffrées au repos :

- Chiffrement AES-256 pour le stockage
- Chiffrement TLS 1.3 pour le transit

### 12.2 Règle 26 : Authentification

Tous les endpoints doivent être authentifiés :

- JWT tokens pour les utilisateurs
- API keys pour les services système

### 12.3 Règle 27 : Autorisation

Les droits d'accès doivent être basés sur les rôles :

- `recruiter` : Lecture de ses propres traces
- `hr_expert` : Lecture de toutes les traces
- `admin` : Lecture, suppression

---

## 13. Exemple de Trace Complète

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-08-03T14:30:45.123Z",
  "level": 1,
  "type": "insufficient_data",
  "severity": "medium",
  "missingData": [
    "Compétences explicitement déclarées par le candidat",
    "Expériences professionnelles du candidat"
  ],
  "contradictions": [],
  "indicators": [],
  "risks": [],
  "certainFacts": [
    "Le candidat a fourni un CV incomplet",
    "Les compétences et expériences sont absentes"
  ],
  "reservedEstimates": [],
  "unknowns": [
    "Les compétences techniques du candidat",
    "L'expérience professionnelle en années"
  ],
  "recommendations": [
    "Demander au candidat de compléter son CV",
    "Préciser les compétences techniques maîtrisées"
  ],
  "candidateId": "candidate-123",
  "jobId": "job-456",
  "recruiterId": "recruiter-789",
  "recruiterAction": "Contacté le candidat pour compléter le CV",
  "resolution": "Candidat a fourni un CV complet",
  "resolutionTimestamp": "2026-08-04T10:15:30.000Z",
  "resolutionOutcome": "resolved",
  "recruiterFeedback": "Détection pertinente, CV était effectivement incomplet",
  "accuracyRating": 5,
  "processingTime": 45,
  "engineVersion": "1.0.0"
}
```

---

## 14. Maintenance

Les règles de traçabilité doivent être révisées :

- Annuellement pour s'assurer de la conformité réglementaire
- Lors de l'évolution des besoins métier
- Basé sur les retours d'expérience des utilisateurs
- Basé sur les recommandations de MVP-008

---

## 15. Conclusion

Les règles de traçabilité du doute garantissent :

- **Auditabilité** complète du système
- **Amélioration continue** via MVP-008
- **Conformité** réglementaire (RGPD)
- **Sécurité** des données personnelles
- **Qualité** des données d'apprentissage
- **Transparence** pour les utilisateurs
