# DOC-032-06 : Modèle de Gestion du Tempo (4 Phases + Alertes)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle de gestion du tempo pour MVP-032 Conversational Intelligence Engine. Ce modèle structure le rythme de l'entretien en 4 phases (Ouverture, Exploration, Approfondissement, Clôture) avec des alertes de tempo pour guider le recruteur comme un chef d'orchestre.

---

## 2. Principe Fondateur

Un maître RH gère le temps comme un chef d'orchestre. Le moteur guide ce rythme en structurant l'entretien en 4 phases claires, chacune avec son objectif, son ton, et ses alertes de tempo pour s'assurer que toutes les dimensions sont explorées dans le temps imparti.

---

## 3. Les 4 Phases de l'Entretien

### 3.1 Phase 1 — Ouverture (10%)

**Objectif :**
Établir la relation, mettre le candidat à l'aise, observer le niveau d'aise naturel.

**Durée :**
10% du temps total (ex: 4-5 minutes sur 45 minutes)

**Ton :**
Chaleureux, accueillant, léger

**Activités :**
- Accueil et présentation
- Questions légères pour briser la glace
- Observation du niveau d'aise naturel
- Établissement du cadre de l'entretien

**Exemples de questions :**
- "Comment s'est passé votre trajet ?"
- "Parlez-moi brièvement de votre parcours jusqu'à aujourd'hui."
- "Qu'est-ce qui vous a intéressé dans notre entreprise ?"

**Alertes de tempo :**
```
⏱️ 2 minutes écoulées.
   Si le candidat est encore très tendu :
   Ralentir, créer plus d'espace de sécurité.
```

---

### 3.2 Phase 2 — Exploration (60%)

**Objectif :**
Cœur de l'entretien. Questions substantielles. Rebonds intelligents. Alternance de territoires.

**Durée :**
60% du temps total (ex: 25-30 minutes sur 45 minutes)

**Ton :**
Professionnel, curieux, engagé

**Activités :**
- Questions substantielles sur les compétences
- Exploration des soft skills
- Investigation des motivations
- Alternance des territoires
- Rebonds intelligents

**Exemples de questions :**
- "Parlez-moi d'un projet complexe que vous avez mené."
- "Comment gérez-vous les conflits dans votre équipe ?"
- "Qu'est-ce qui vous motive dans votre travail ?"

**Alertes de tempo :**
```
⏱️ 50% du temps écoulé.
   Dimensions non encore explorées : [liste]
   Ajuster le rythme pour couvrir les dimensions manquantes.
```

```
⏱️ 15 minutes dans la phase d'exploration.
   Soft skills leadership : 40% éclairci.
   L'exemple donné était bon mais insuffisant.
   Creuser avec une deuxième situation.
```

---

### 3.3 Phase 3 — Approfondissement (20%)

**Objectif :**
Creuser les 2-3 points les plus importants. Clarifier les zones d'ombre. Poser les questions difficiles.

**Durée :**
20% du temps total (ex: 8-10 minutes sur 45 minutes)

**Ton :**
Sérieux, approfondi, évaluatif

**Activités :**
- Identification des 2-3 points clés à creuser
- Questions difficiles sur les zones d'ombre
- Clarification des incohérences
- Vérification des hypothèses

**Exemples de questions :**
- "Je reviens sur ce que vous avez dit sur [X]. Pouvez-vous me donner un autre exemple ?"
- "Vous avez mentionné une tension entre [A] et [B]. Comment résolvez-vous cela ?"
- "Quelle est la chose la plus difficile que vous ayez dû faire dans votre carrière ?"

**Alertes de tempo :**
```
⏱️ Phase d'approfondissement devrait commencer.
   Points à creuser prioritairement : [liste]
   Passer à cette phase maintenant.
```

```
⏱️ 5 minutes dans la phase d'approfondissement.
   Zone d'ombre identifiée : [dimension]
   Clarifier cette zone avant la clôture.
```

---

### 3.4 Phase 4 — Clôture (10%)

**Objectif :**
Questions du candidat. Information sur la suite. Observation de la clôture.

**Durée :**
10% du temps total (ex: 4-5 minutes sur 45 minutes)

**Ton :**
Ouvert, informatif, respectueux

**Activités :**
- Invitation aux questions du candidat
- Information sur la suite du processus
- Observation de la clôture
- Remerciements

**Exemples de questions :**
- "Avez-vous des questions pour moi sur le poste, l'équipe, ou l'entreprise ?"
- "Quelles sont vos attentes pour la suite du processus ?"
- "Y a-t-il autre chose que vous aimeriez partager ?"

**Alertes de tempo :**
```
⏱️ 5 minutes restantes.
   Passer à la clôture.
   Inviter les questions du candidat.
```

```
⏱️ 2 minutes restantes.
   Finaliser la clôture.
   Informer sur la suite.
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface TempoModel {
  modelId: string;
  interviewId: string;
  candidateId: string;
  recruiterId: string;
  
  totalDuration: number; // en minutes
  startedAt: Date;
  
  phases: {
    opening: Phase;
    exploration: Phase;
    deepening: Phase;
    closing: Phase;
  };
  
  currentPhase: 'opening' | 'exploration' | 'deepening' | 'closing';
  
  tempoAlerts: TempoAlert[];
  
  metadata: {
    version: string;
    status: 'active' | 'completed';
  };
}

interface Phase {
  phaseName: 'opening' | 'exploration' | 'deepening' | 'closing';
  
  percentage: number;
  duration: number; // en minutes
  
  startTime?: Date;
  endTime?: Date;
  
  status: 'not_started' | 'in_progress' | 'completed';
  
  objectives: string[];
  tone: string;
  activities: string[];
  
  dimensionsCovered: string[];
  
  alerts: TempoAlert[];
}

interface TempoAlert {
  alertId: string;
  timestamp: Date;
  
  phase: string;
  type: 'phase_start' | 'phase_end' | 'tempo_warning' | 'dimension_warning' | 'time_remaining';
  
  message: string;
  suggestedAction: string;
  
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  acknowledged: boolean;
  acknowledgedAt?: Date;
}
```

---

## 5. Algorithme de Gestion du Tempo

### 5.1 Processus Global

```typescript
async function manageTempo(
  interviewContext: InterviewContext,
  map: ConversationalMap
): Promise<TempoModel> {
  
  // 1. Initialiser le modèle de tempo
  const tempoModel = await initializeTempoModel(interviewContext);
  
  // 2. Démarrer la phase d'ouverture
  await startPhase(tempoModel, 'opening');
  
  // 3. Surveiller le tempo en continu
  const interval = setInterval(async () => {
    await monitorTempo(tempoModel, map);
  }, 30000); // toutes les 30 secondes
  
  // 4. Transitionner entre les phases
  await transitionPhases(tempoModel, map);
  
  // 5. Générer les alertes de tempo
  await generateTempoAlerts(tempoModel, map);
  
  return tempoModel;
}
```

---

### 5.2 Transition entre Phases

```typescript
async function transitionPhases(
  tempoModel: TempoModel,
  map: ConversationalMap
): Promise<void> {
  
  const currentTime = Date.now();
  const elapsedMinutes = (currentTime - tempoModel.startedAt.getTime()) / 60000;
  
  // Transition Ouverture → Exploration
  if (tempoModel.currentPhase === 'opening' && elapsedMinutes >= tempoModel.phases.opening.duration) {
    await endPhase(tempoModel, 'opening');
    await startPhase(tempoModel, 'exploration');
  }
  
  // Transition Exploration → Approfondissement
  if (tempoModel.currentPhase === 'exploration' && elapsedMinutes >= (tempoModel.phases.opening.duration + tempoModel.phases.exploration.duration)) {
    await endPhase(tempoModel, 'exploration');
    await startPhase(tempoModel, 'deepening');
  }
  
  // Transition Approfondissement → Clôture
  if (tempoModel.currentPhase === 'deepening' && elapsedMinutes >= (tempoModel.phases.opening.duration + tempoModel.phases.exploration.duration + tempoModel.phases.deepening.duration)) {
    await endPhase(tempoModel, 'deepening');
    await startPhase(tempoModel, 'closing');
  }
}
```

---

### 5.3 Surveillance du Tempo

```typescript
async function monitorTempo(
  tempoModel: TempoModel,
  map: ConversationalMap
): Promise<void> {
  
  const currentTime = Date.now();
  const elapsedMinutes = (currentTime - tempoModel.startedAt.getTime()) / 60000;
  const percentage = (elapsedMinutes / tempoModel.totalDuration) * 100;
  
  // Alertes de tempo
  if (percentage >= 50 && percentage < 55) {
    const notAddressed = Object.values(map.dimensions).filter(d => d.status === 'not_addressed');
    
    if (notAddressed.length > 0) {
      await generateAlert(tempoModel, {
        type: 'tempo_warning',
        message: `${percentage.toFixed(0)}% du temps écoulé. Dimensions non encore explorées : ${notAddressed.map(d => d.dimension).join(', ')}.`,
        suggestedAction: 'Ajuster le rythme pour couvrir les dimensions manquantes.',
        priority: 'high'
      });
    }
  }
  
  // Alertes de dimensions
  const currentPhase = tempoModel.currentPhase;
  const phase = tempoModel.phases[currentPhase];
  
  if (currentPhase === 'exploration') {
    const partiallyIlluminated = Object.values(map.dimensions).filter(d => d.status === 'partially_illuminated');
    
    for (const dimension of partiallyIlluminated) {
      if (dimension.illuminationLevel < 40 && dimension.lastExchange > 5) {
        await generateAlert(tempoModel, {
          type: 'dimension_warning',
          message: `${dimension.dimension} : ${dimension.illuminationLevel}% éclairci. L'exemple donné était bon mais insuffisant.`,
          suggestedAction: 'Creuser avec une deuxième situation.',
          priority: 'medium',
          relatedDimension: dimension.dimension
        });
      }
    }
  }
  
  // Alertes de temps restant
  const remainingMinutes = tempoModel.totalDuration - elapsedMinutes;
  
  if (remainingMinutes <= 5 && remainingMinutes > 3 && tempoModel.currentPhase !== 'closing') {
    await generateAlert(tempoModel, {
      type: 'time_remaining',
      message: `${remainingMinutes.toFixed(0)} minutes restantes. Passer à la clôture.`,
      suggestedAction: 'Inviter les questions du candidat.',
      priority: 'urgent'
    });
  }
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE tempo_model (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  
  total_duration INT NOT NULL,
  started_at TIMESTAMP NOT NULL,
  
  phases JSON NOT NULL,
  current_phase VARCHAR(50) NOT NULL CHECK (current_phase IN ('opening', 'exploration', 'deepening', 'closing')),
  tempo_alerts JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview(id),
  FOREIGN KEY (candidate_id) REFERENCES candidate(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiter(id)
);

CREATE INDEX idx_tempo_model_interview ON tempo_model(interview_id);
CREATE INDEX idx_tempo_model_phase ON tempo_model(current_phase);
```

---

## 7. API Endpoints

```typescript
// POST /api/conversational/tempo/initialize
async function initializeTempoModel(interviewContext: InterviewContext): Promise<TempoModel> {
  return await initializeTempoModel(interviewContext);
}

// GET /api/conversational/tempo/:modelId
async function getTempoModel(modelId: string): Promise<TempoModel> {
  return await getTempoModelById(modelId);
}

// GET /api/conversational/tempo/interview/:interviewId
async function getTempoModelByInterview(interviewId: string): Promise<TempoModel> {
  return await getTempoModelByInterview(interviewId);
}

// PUT /api/conversational/tempo/:modelId/phase/:phase
async function transitionPhase(modelId: string, phase: string): Promise<TempoModel> {
  return await transitionPhase(modelId, phase);
}

// PUT /api/conversational/tempo/:modelId/alert/:alertId/acknowledge
async function acknowledgeTempoAlert(modelId: string, alertId: string): Promise<TempoModel> {
  return await acknowledgeTempoAlert(modelId, alertId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de respect du tempo | Entretiens dans le temps / total | ≥ 90% |
- Taux de couverture des phases | Phases complétées / total | 100% |
- Taux d'alertes pertinentes | Alertes pertinentes / totales | ≥ 85% |
- Satisfaction recruteurs | Satisfaction avec la gestion du tempo | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de l'efficacité temporelle | Amélioration de l'efficacité temporelle | ≥ 30% |
- Réduction des oublis de dimensions | Réduction des dimensions oubliées | ≥ 40% |
- Qualité des entretiens | Amélioration de la qualité des entretiens | ≥ 35% |

---

## 9. Conclusion

Le modèle de gestion du tempo structure le rythme de l'entretien en 4 phases (Ouverture 10%, Exploration 60%, Approfondissement 20%, Clôture 10%) avec des alertes de tempo pour guider le recruteur. Chaque phase a son objectif, son ton, et ses activités, permettant au recruteur de gérer le temps comme un chef d'orchestre.

**Points clés :**
- 4 phases structurées
- Durées proportionnelles (10-60-20-10)
- Tons spécifiques par phase
- Alertes de tempo en temps réel
- Transition automatique des phases
- Surveillance continue du tempo
- Structure de données TypeScript
- Algorithme de gestion structuré
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
