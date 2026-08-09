# DOC-M06-06 : Protocole de Détection des Biais Collectifs

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de détection des biais collectifs pour le MVP-META-06 Collaborative Decision Engine. Ce document structure le processus de détection des biais dans les décisions collectives de recrutement.

---

## 2. Principe Fondateur

Les biais collectifs peuvent émerger même avec des intervenants multiples. Le protocole détecte les patterns statistiques suggérant des biais (genre, âge, origine, etc.) et alerte discrètement les décideurs pour inviter à la réflexion.

---

## 3. Types de Biais Détectés

### 3.1 Biais de Genre

**Définition :**
Les décisions suivent un pattern discriminatoire basé sur le genre.

**Critère de détection :**
- Taux de rejet pour un genre significativement supérieur à l'autre
- Écart de score moyen entre genres ≥ 1.0 sur une dimension
- Pattern statistiquement significatif (p < 0.05)

**Exemple :**
```
Candidats masculins : Taux de rejet 20%
Candidats féminins : Taux de rejet 45%
Écart : +25% (statistiquement significatif)
Alerte : Possible biais de genre détecté
```

---

### 3.2 Biais d'Âge

**Définition :**
Les décisions suivent un pattern discriminatoire basé sur l'âge.

**Critère de détection :**
- Taux de rejet pour une tranche d'âge significativement supérieur
- Écart de score moyen sur "potentiel" entre tranches d'âge ≥ 1.0
- Pattern statistiquement significatif (p < 0.05)

**Exemple :**
```
Candidats < 35 ans : Score potentiel moyen 4.2/5
Candidats ≥ 50 ans : Score potentiel moyen 3.0/5
Écart : -1.2 (statistiquement significatif)
Alerte : Possible biais d'âge détecté
```

---

### 3.3 Biais d'Origine

**Définition :**
Les décisions suivent un pattern discriminatoire basé sur l'origine ethnique ou nationale.

**Critère de détection :**
- Taux de rejet pour une origine significativement supérieur
- Écart de score moyen entre origines ≥ 1.0 sur une dimension
- Pattern statistiquement significatif (p < 0.05)

**Exemple :**
```
Candidats origine A : Taux de rejet 25%
Candidats origine B : Taux de rejet 50%
Écart : +25% (statistiquement significatif)
Alerte : Possible biais d'origine détecté
```

---

### 3.4 Biais de Formation

**Définition :**
Les décisions favorisent systématiquement un type de formation ou d'établissement.

**Critère de détection :**
- Taux de rejet pour un type de formation significativement supérieur
- Écart de score moyen entre types de formation ≥ 1.0
- Pattern statistiquement significatif (p < 0.05)

**Exemple :**
```
Grandes écoles : Taux d'acceptation 60%
Universités standard : Taux d'acceptation 30%
Écart : -30% (statistiquement significatif)
Alerte : Possible biais de formation détecté
```

---

## 4. Processus de Détection

### 4.1 Étape 1 — Collecte des Données

**Données collectées :**
- Décisions collectives (votes, résultats)
- Caractéristiques des candidats (genre, âge, origine, formation)
- Scores par dimension
- Arguments pour et contre

**Période d'analyse :**
- Derniers 30 jours
- Minimum 20 décisions pour l'analyse

---

### 4.2 Étape 2 — Analyse Statistique

**Tests effectués :**
- Test du chi-carré pour les taux de rejet
- Test t de Student pour les écarts de score moyen
- Analyse de variance (ANOVA) pour les comparaisons multiples

**Seuil de signification :**
- p < 0.05 pour alerte modérée
- p < 0.01 pour alerte forte

---

### 4.3 Étape 3 — Classification du Biais

**Niveaux de gravité :**
- **Faible :** Pattern détecté mais non significatif (p ≥ 0.05)
- **Modéré :** Pattern significatif (p < 0.05)
- **Fort :** Pattern très significatif (p < 0.01)

**Types d'action :**
- **Faible :** Monitoring continu
- **Modéré :** Alert discrète aux décideurs
- **Fort :** Alert forte + recommandation de révision

---

### 4.4 Étape 4 — Alert et Recommandation

**Format de l'alerte :**
```markdown
## ALERTE DE BIAIS COLLECTIF

**Type de biais :** [Genre / Âge / Origine / Formation]
**Niveau de gravité :** [Faible / Modéré / Fort]
**Date de détection :** [Date]

---

### Données analysées

Période : [Période d'analyse]
Nombre de décisions : [N]

---

### Pattern détecté

[Description du pattern]

Statistiques :
- Groupe A : [statistiques]
- Groupe B : [statistiques]
- Écart : [écart]
- Significativité : p = [valeur]

---

### Recommandation

[Action recommandée]

---

### Questions pour réflexion

- [Question 1]
- [Question 2]
- [Question 3]
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface BiasDetection {
  detectionId: string;
  
  biasType: 'gender' | 'age' | 'origin' | 'education';
  severity: 'low' | 'moderate' | 'high';
  detectionDate: Date;
  
  analysisPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  decisionsAnalyzed: number;
  
  detectedPattern: {
    description: string;
    statistics: {
      groupA: string;
      groupB: string;
      gap: number;
      significance: number;
    };
  };
  
  recommendation: string;
  
  reflectionQuestions: string[];
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface BiasMonitoring {
  monitoringId: string;
  
  startDate: Date;
  endDate?: Date;
  
  biasDetections: BiasDetection[];
  
  summary: {
    totalDetections: number;
    byType: {
      gender: number;
      age: number;
      origin: number;
      education: number;
    };
    bySeverity: {
      low: number;
      moderate: number;
      high: number;
    };
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
CREATE TABLE bias_detection (
  id VARCHAR(36) PRIMARY KEY,
  
  bias_type VARCHAR(20) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  detection_date TIMESTAMP NOT NULL,
  
  analysis_period JSON NOT NULL,
  decisions_analyzed INT NOT NULL,
  
  detected_pattern JSON NOT NULL,
  recommendation TEXT NOT NULL,
  reflection_questions JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_bias_detection_type ON bias_detection(bias_type);
CREATE INDEX idx_bias_detection_severity ON bias_detection(severity);
CREATE INDEX idx_bias_detection_date ON bias_detection(detection_date);

CREATE TABLE bias_monitoring (
  id VARCHAR(36) PRIMARY KEY,
  
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  
  bias_detections JSON NOT NULL,
  summary JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 7. API Endpoints

```typescript
// POST /api/bias-detection/analyze
async function analyzeBias(startDate: Date, endDate: Date): Promise<BiasDetection[]> {
  return await analyzeBias(startDate, endDate);
}

// GET /api/bias-detection/:detectionId
async function getBiasDetection(detectionId: string): Promise<BiasDetection> {
  return await getBiasDetection(detectionId);
}

// GET /api/bias-detection/recent
async function getRecentBiasDetections(days: number): Promise<BiasDetection[]> {
  return await getRecentBiasDetections(days);
}

// GET /api/bias-detection/type/:type
async function getBiasDetectionsByType(type: 'gender' | 'age' | 'origin' | 'education'): Promise<BiasDetection[]> {
  return await getBiasDetectionsByType(type);
}

// GET /api/bias-detection/severity/:severity
async function getBiasDetectionsBySeverity(severity: 'low' | 'moderate' | 'high'): Promise<BiasDetection[]> {
  return await getBiasDetectionsBySeverity(severity);
}

// POST /api/bias-monitoring/start
async function startBiasMonitoring(): Promise<BiasMonitoring> {
  return await startBiasMonitoring();
}

// PUT /api/bias-monitoring/:monitoringId/stop
async function stopBiasMonitoring(monitoringId: string): Promise<BiasMonitoring> {
  return await stopBiasMonitoring(monitoringId);
}

// GET /api/bias-monitoring/:monitoringId
async function getBiasMonitoring(monitoringId: string): Promise<BiasMonitoring> {
  return await getBiasMonitoring(monitoringId);
}

// POST /api/bias-detection/:detectionId/alert
async function sendBiasAlert(detectionId: string, recipients: string[]): Promise<void> {
  return await sendBiasAlert(detectionId, recipients);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection de biais | Biais détectés / analyses totales | ≥ 5% |
- Taux de faux positifs | Faux positifs / alertes totales | ≤ 10% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de correction | Biais corrigés / alertes fortes | ≥ 50% |
- Taux d'amélioration | Réduction du biais après alerte | ≥ 20% |

---

## 9. Exemple Complet

```markdown
## ALERTE DE BIAIS COLLECTIF

**Type de biais :** Âge
**Niveau de gravité :** Modéré
**Date de détection :** 2026-08-15

---

### Données analysées

Période : 2026-07-15 à 2026-08-15
Nombre de décisions : 45

---

### Pattern détecté

Les candidats de plus de 50 ans ont systématiquement des scores plus bas sur la dimension "potentiel long terme" que les candidats plus jeunes, malgré des compétences techniques équivalentes.

Statistiques :
- Candidats < 35 ans : Score potentiel moyen 4.2/5, Taux d'acceptation 65%
- Candidats ≥ 50 ans : Score potentiel moyen 3.0/5, Taux d'acceptation 35%
- Écart : -1.2 points, -30% d'acceptation
- Significativité : p = 0.023 (statistiquement significatif)

---

### Recommandation

Revoir les critères d'évaluation du "potentiel long terme" pour s'assurer qu'ils ne pénalisent pas systématiquement les candidats plus âgés. Envisager une calibration des scores par tranche d'âge.

---

### Questions pour réflexion

- Les critères de "potentiel long terme" sont-ils basés sur des stéréotypes d'âge ?
- Les candidats plus âgés ont-ils eu l'opportunité de démontrer leur potentiel ?
- Les expériences passées des candidats plus âgés sont-elles valorisées correctement ?
```

---

## 10. Conclusion

Le protocole de détection des biais collectifs structure la détection des biais dans les décisions collectives. 4 types de biais détectés : Genre (pattern discriminatoire basé sur le genre), Âge (pattern discriminatoire basé sur l'âge), Origine (pattern discriminatoire basé sur l'origine ethnique/nationale), Formation (pattern discriminatoire basé sur le type de formation). Processus en 4 étapes : Collecte des données, Analyse statistique, Classification du biais, Alert et recommandation. 3 niveaux de gravité (Faible, Modéré, Fort). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 types de biais détectés
- Processus en 4 étapes
- Analyse statistique
- Classification par gravité
- Alert discrète aux décideurs
- Recommandations d'action
- Questions pour réflexion
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
