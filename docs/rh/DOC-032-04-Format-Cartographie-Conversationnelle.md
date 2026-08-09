# DOC-032-04 : Format de Cartographie Conversationnelle en Temps Réel

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format de cartographie conversationnelle en temps réel pour MVP-032 Conversational Intelligence Engine. Cette cartographie maintient une carte visuelle de la conversation pendant l'entretien, montrant les dimensions évaluées, leur niveau d'éclaircissement, et les alertes en temps réel pour guider le recruteur.

---

## 2. Principe Fondateur

Pendant l'entretien, le moteur maintient une carte de la conversation qui permet au recruteur de voir en temps réel quelles dimensions ont été explorées, à quel niveau, et quelles dimensions nécessitent une attention urgente. Cette cartographie transforme l'entretien en un processus conscient et structuré.

---

## 3. Structure de la Cartographie

### 3.1 Dimensions Évaluées

La cartographie affiche les dimensions évaluées avec leur niveau d'éclaircissement :

```
DIMENSIONS ÉVALUÉES

Compétences techniques
  ████████░░  80% éclairci
  Dernier échange : Échange 12
  Certitude : 85%

Expérience
  ██████░░░░  60% éclairci
  Dernier échange : Échange 8
  Certitude : 70%

Soft skills leadership
  ████░░░░░░  40% éclairci
  Dernier échange : Échange 15
  Certitude : 55%

Soft skills communication
  ████░░░░░░  40% éclairci
  Dernier échange : Échange 14
  Certitude : 60%

Motivations profondes
  ██░░░░░░░░  20% éclairci
  Dernier échange : Échange 5
  Certitude : 40%

Culture fit
  ░░░░░░░░░░  0%  non abordé
  Dernier échange : N/A
  Certitude : 0%
```

---

### 3.2 Alertes en Temps Réel

La cartographie génère des alertes en temps réel pour guider le recruteur :

```
ALERTES EN TEMPS RÉEL

⚠️ 15 minutes écoulées.
   Les motivations profondes n'ont pas encore été explorées.
   Orienter vers ce territoire dans les 5 prochaines minutes.

⚠️ Soft skills leadership : 40% éclairci.
   L'exemple donné était bon mais insuffisant pour une décision.
   Creuser avec une deuxième situation.

⚠️ Culture fit non abordé.
   10 minutes restantes estimées.
   Suggéré : aborder maintenant.

✅ Compétences techniques : 80% éclairci.
   Dimension suffisamment couverte.
   Peut passer à d'autres territoires.
```

---

### 3.3 Indicateurs de Progression

La cartographie affiche des indicateurs de progression :

```
INDICATEURS DE PROGRESSION

Temps écoulé : 25 minutes / 45 minutes (56%)
Échanges : 18 échanges
Dimensions abordées : 5/6 (83%)
Dimensions suffisamment éclairées : 2/6 (33%)
Dimensions non abordées : 1/6 (17%)
```

---

### 4. Format de Données (TypeScript)

```typescript
interface ConversationalMap {
  mapId: string;
  interviewId: string;
  candidateId: string;
  recruiterId: string;
  
  startedAt: Date;
  lastUpdated: Date;
  
  dimensions: {
    [dimension: string]: DimensionProgress;
  };
  
  alerts: RealTimeAlert[];
  
  progressIndicators: {
    timeElapsed: number;
    timeTotal: number;
    timePercentage: number;
    exchangeCount: number;
    dimensionsAddressed: number;
    dimensionsTotal: number;
    dimensionsAddressedPercentage: number;
    dimensionsSufficientlyIlluminated: number;
    dimensionsSufficientlyIlluminatedPercentage: number;
    dimensionsNotAddressed: number;
    dimensionsNotAddressedPercentage: number;
  };
  
  metadata: {
    version: string;
    status: 'active' | 'completed';
  };
}

interface DimensionProgress {
  dimension: string;
  subDimensions: {
    [subDimension: string]: number;
  };
  
  illuminationLevel: number; // 0-100
  lastExchange: number;
  certaintyLevel: number; // 0-100
  
  status: 'not_addressed' | 'partially_illuminated' | 'sufficiently_illuminated' | 'fully_illuminated';
  
  examples: {
    exchangeNumber: number;
    description: string;
  }[];
}

interface RealTimeAlert {
  alertId: string;
  timestamp: Date;
  
  type: 'warning' | 'info' | 'success';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  message: string;
  suggestedAction: string;
  
  relatedDimension?: string;
  
  acknowledged: boolean;
  acknowledgedAt?: Date;
}
```

---

## 5. Algorithme de Mise à Jour de la Cartographie

### 5.1 Processus Global

```typescript
async function updateConversationalMap(
  exchange: ConversationExchange,
  map: ConversationalMap
): Promise<ConversationalMap> {
  
  // 1. Mettre à jour la dimension évaluée
  const updatedDimensions = await updateDimensionProgress(exchange, map.dimensions);
  
  // 2. Générer les alertes en temps réel
  const alerts = await generateRealTimeAlerts(updatedDimensions, map.progressIndicators);
  
  // 3. Mettre à jour les indicateurs de progression
  const updatedProgress = await updateProgressIndicators(exchange, map.progressIndicators);
  
  // 4. Construire la carte mise à jour
  const updatedMap: ConversationalMap = {
    ...map,
    dimensions: updatedDimensions,
    alerts: alerts,
    progressIndicators: updatedProgress,
    lastUpdated: new Date()
  };
  
  return updatedMap;
}
```

---

### 5.2 Mise à Jour de la Progression d'une Dimension

```typescript
async function updateDimensionProgress(
  exchange: ConversationExchange,
  dimensions: { [dimension: string]: DimensionProgress }
): Promise<{ [dimension: string]: DimensionProgress }> {
  
  const dimension = exchange.dimensionEvaluated.dimension;
  const subDimension = exchange.dimensionEvaluated.subDimension;
  
  // Récupérer ou créer la dimension
  let dimensionProgress = dimensions[dimension];
  
  if (!dimensionProgress) {
    dimensionProgress = {
      dimension,
      subDimensions: {},
      illuminationLevel: 0,
      lastExchange: exchange.exchangeNumber,
      certaintyLevel: exchange.certaintyLevel.afterExchange,
      status: 'partially_illuminated',
      examples: []
    };
  } else {
    // Mettre à jour la progression
    dimensionProgress.subDimensions[subDimension] = exchange.certaintyLevel.afterExchange;
    dimensionProgress.illuminationLevel = await calculateIlluminationLevel(dimensionProgress.subDimensions);
    dimensionProgress.lastExchange = exchange.exchangeNumber;
    dimensionProgress.certaintyLevel = exchange.certaintyLevel.afterExchange;
    dimensionProgress.status = await determineDimensionStatus(dimensionProgress.illuminationLevel);
    dimensionProgress.examples.push({
      exchangeNumber: exchange.exchangeNumber,
      description: exchange.content.candidateResponse.substring(0, 100) + '...'
    });
  }
  
  dimensions[dimension] = dimensionProgress;
  
  return dimensions;
}
```

---

### 5.3 Calcul du Niveau d'Éclaircissement

```typescript
async function calculateIlluminationLevel(subDimensions: { [subDimension: string]: number }): Promise<number> {
  const values = Object.values(subDimensions);
  
  if (values.length === 0) return 0;
  
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  
  return Math.round(average);
}
```

---

### 5.4 Détermination du Statut de la Dimension

```typescript
async function determineDimensionStatus(illuminationLevel: number): Promise<string> {
  if (illuminationLevel === 0) return 'not_addressed';
  if (illuminationLevel < 40) return 'partially_illuminated';
  if (illuminationLevel < 80) return 'sufficiently_illuminated';
  return 'fully_illuminated';
}
```

---

### 5.5 Génération des Alertes en Temps Réel

```typescript
async function generateRealTimeAlerts(
  dimensions: { [dimension: string]: DimensionProgress },
  progress: any
): Promise<RealTimeAlert[]> {
  
  const alerts: RealTimeAlert[] = [];
  
  // Alerte 1 : Dimensions non abordées avec temps limité
  const notAddressed = Object.values(dimensions).filter(d => d.status === 'not_addressed');
  const timePercentage = progress.timePercentage;
  
  if (notAddressed.length > 0 && timePercentage > 50) {
    alerts.push({
      alertId: generateAlertId(),
      timestamp: new Date(),
      type: 'warning',
      priority: 'high',
      message: `${timePercentage}% du temps écoulé. ${notAddressed.length} dimension(s) non abordée(s) : ${notAddressed.map(d => d.dimension).join(', ')}.`,
      suggestedAction: 'Orienter vers ces territoires dans les prochaines minutes.',
      acknowledged: false
    });
  }
  
  // Alerte 2 : Dimensions partiellement éclaircies nécessitant plus d'attention
  const partiallyIlluminated = Object.values(dimensions).filter(d => d.status === 'partially_illuminated');
  
  for (const dimension of partiallyIlluminated) {
    if (dimension.illuminationLevel < 30 && dimension.lastExchange > 5) {
      alerts.push({
        alertId: generateAlertId(),
        timestamp: new Date(),
        type: 'warning',
        priority: 'medium',
        message: `${dimension.dimension} : ${dimension.illuminationLevel}% éclairci. Nécessite plus d'attention.`,
        suggestedAction: 'Creuser cette dimension avec des exemples supplémentaires.',
        relatedDimension: dimension.dimension,
        acknowledged: false
      });
    }
  }
  
  // Alerte 3 : Dimensions suffisamment éclaircies
  const sufficientlyIlluminated = Object.values(dimensions).filter(d => d.status === 'sufficiently_illuminated' || d.status === 'fully_illuminated');
  
  for (const dimension of sufficientlyIlluminated) {
    alerts.push({
      alertId: generateAlertId(),
      timestamp: new Date(),
      type: 'success',
      priority: 'low',
      message: `${dimension.dimension} : ${dimension.illuminationLevel}% éclairci. Dimension suffisamment couverte.`,
      suggestedAction: 'Peut passer à d'autres territoires.',
      relatedDimension: dimension.dimension,
      acknowledged: false
    });
  }
  
  return alerts;
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE conversational_map (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  
  started_at TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  
  dimensions JSON NOT NULL,
  alerts JSON NOT NULL,
  progress_indicators JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview(id),
  FOREIGN KEY (candidate_id) REFERENCES candidate(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiter(id)
);

CREATE INDEX idx_conversational_map_interview ON conversational_map(interview_id);
CREATE INDEX idx_conversational_map_candidate ON conversational_map(candidate_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/conversational/map/update
async function updateConversationalMap(
  exchange: ConversationExchange,
  map: ConversationalMap
): Promise<ConversationalMap> {
  return await updateConversationalMap(exchange, map);
}

// GET /api/conversational/map/:mapId
async function getConversationalMap(mapId: string): Promise<ConversationalMap> {
  return await getConversationalMapById(mapId);
}

// GET /api/conversational/map/interview/:interviewId
async function getConversationalMapByInterview(interviewId: string): Promise<ConversationalMap> {
  return await getConversationalMapByInterview(interviewId);
}

// PUT /api/conversational/map/:mapId/alert/:alertId/acknowledge
async function acknowledgeAlert(mapId: string, alertId: string): Promise<ConversationalMap> {
  return await acknowledgeAlert(mapId, alertId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de mise à jour | Cartes mises à jour / échanges | 100% |
- Taux d'alertes pertinentes | Alertes pertinentes / totales | ≥ 85% |
- Taux d'adoption des alertes | Alertes suivies / alertes suggérées | ≥ 70% |
- Satisfaction recruteurs | Satisfaction avec la cartographie | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de la couverture | Amélioration de la couverture des dimensions | ≥ 30% |
- Réduction des oublis | Réduction des dimensions oubliées | ≥ 40% |
- Efficacité temporelle | Amélioration de l'efficacité temporelle | ≥ 25% |

---

## 9. Conclusion

Le format de cartographie conversationnelle en temps réel maintient une carte visuelle de la conversation pendant l'entretien, montrant les dimensions évaluées, leur niveau d'éclaircissement, et les alertes en temps réel. Cette cartographie permet au recruteur de voir en temps réel quelles dimensions ont été explorées et quelles dimensions nécessitent une attention urgente.

**Points clés :**
- 6 dimensions évaluées avec niveau d'éclaircissement
- Alertes en temps réel (warning, info, success)
- Indicateurs de progression
- Structure de données TypeScript
- Algorithme de mise à jour structuré
- Calcul automatique du niveau d'éclaircissement
- Génération automatique des alertes
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
