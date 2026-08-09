# DOC-037-05 : Tableau de Bord NPS Candidat

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le tableau de bord NPS candidat pour MVP-037 Candidate Experience Engine. Ce document structure les indicateurs, les visualisations, les filtres, et les alertes pour suivre en temps réel la satisfaction des candidats et identifier les axes d'amélioration.

---

## 2. Principe Fondateur

Le tableau de bord NPS candidat permet de suivre en temps réel la satisfaction des candidats à travers le Net Promoter Score (NPS). Il fournit une vue d'ensemble et des vues détaillées par persona, par stade du processus, et par période. Les alertes automatiques identifient les dégradations de la satisfaction pour permettre une réaction rapide.

---

## 3. Indicateurs Principaux

### 3.1 NPS Global

**Définition :**
```
NPS = % Promoteurs - % Détracteurs

Promoteurs : Notes 9-10
Passifs : Notes 7-8
Détracteurs : Notes 0-6
```

**Affichage :**
- Valeur NPS actuelle
- Variation vs période précédente
- Variation vs même période l'année précédente
- Tendance (graphique sur 12 mois)

**Cibles :**
- NPS ≥ 50 : Excellent (vert)
- NPS 30-49 : Bon (jaune)
- NPS 10-29 : Moyen (orange)
- NPS < 10 : Faible (rouge)
- NPS < 0 : Critique (rouge foncé)

### 3.2 Perception de l'Évaluation

**Définition :**
```
Moyenne des réponses à la question :
"Avez-vous senti que votre profil a été vraiment évalué ?"

Échelle : 1 à 5
```

**Affichage :**
- Moyenne actuelle
- Variation vs période précédente
- Distribution des notes (1-5)
- Tendance (graphique sur 12 mois)

**Cible :**
- ≥ 4.5/5 : Excellent
- 4.0-4.4/5 : Bon
- 3.5-3.9/5 : Moyen
- < 3.5/5 : Faible

### 3.3 Qualité de l'Expérience

**Définition :**
```
Moyenne des réponses à la question :
"L'entretien vous a-t-il semblé professionnel et bienveillant ?"

Échelle : 1 à 5
```

**Affichage :**
- Moyenne actuelle
- Variation vs période précédente
- Distribution des notes (1-5)
- Tendance (graphique sur 12 mois)

**Cible :**
- ≥ 4.5/5 : Excellent
- 4.0-4.4/5 : Bon
- 3.5-3.9/5 : Moyen
- < 3.5/5 : Faible

### 3.4 Taux de Réponse

**Définition :**
```
Taux de réponse = Réponses / Enquêtes envoyées
```

**Affichage :**
- Taux actuel
- Variation vs période précédente
- Tendance (graphique sur 12 mois)

**Cible :**
- ≥ 50% : Excellent
- 40-49% : Bon
- 30-39% : Moyen
- < 30% : Faible

---

## 4. Visualisations

### 4.1 Vue d'Ensemble

**KPI Cards :**
- NPS global avec indicateur de tendance
- Perception de l'évaluation avec indicateur de tendance
- Qualité de l'expérience avec indicateur de tendance
- Taux de réponse avec indicateur de tendance

**Graphiques :**
- Évolution du NPS sur 12 mois
- Distribution NPS (Promoteurs / Passifs / Détracteurs)
- Évolution de la perception de l'évaluation sur 12 mois
- Évolution de la qualité de l'expérience sur 12 mois

### 4.2 Vue par Persona

**Filtres :**
- DRH Senior Bienveillant
- DRH Executive
- DRH Startup
- DRH Technique

**Indicateurs par persona :**
- NPS par persona
- Perception de l'évaluation par persona
- Qualité de l'expérience par persona
- Taux de réponse par persona

**Graphiques :**
- Comparaison NPS par persona (bar chart)
- Comparaison perception par persona (bar chart)
- Comparaison qualité par persona (bar chart)

### 4.3 Vue par Stade du Processus

**Filtres :**
- Refusé après CV
- Refusé après entretien téléphonique
- Refusé après entretien complet
- Finaliste non retenu
- Retenu

**Indicateurs par stade :**
- NPS par stade
- Perception de l'évaluation par stade
- Qualité de l'expérience par stade
- Taux de réponse par stade

**Graphiques :**
- Comparaison NPS par stade (bar chart)
- Comparaison perception par stade (bar chart)
- Comparaison qualité par stade (bar chart)

### 4.4 Vue par Période

**Filtres :**
- Derniers 7 jours
- Derniers 30 jours
- Derniers 90 jours
- Derniers 12 mois
- Personnalisé

**Indicateurs par période :**
- NPS par période
- Perception de l'évaluation par période
- Qualité de l'expérience par période
- Taux de réponse par période

**Graphiques :**
- Évolution NPS sur la période sélectionnée
- Évolution perception sur la période sélectionnée
- Évolution qualité sur la période sélectionnée

---

## 5. Filtres et Segmentation

### 5.1 Filtres Temporels

**Période :**
- Derniers 7 jours
- Derniers 30 jours
- Derniers 90 jours
- Derniers 12 mois
- Personnalisé (date début / date fin)

### 5.2 Filtres Démographiques

**Profil candidat :**
- Niveau d'expérience (Junior, Confirmé, Senior)
- Secteur d'activité
- Type de poste
- Lieu géographique

### 5.3 Filtres Processus

**Processus :**
- Persona DRH
- Stade du processus
- Type d'entretien (présentiel, visio, téléphone)
- Durée de l'entretien

### 5.4 Filtres Décision

**Décision :**
- Retenu
- Refusé
- En attente

---

## 6. Alertes Automatiques

### 6.1 Alertes NPS

**Alerte NPS en baisse :**
- Condition : NPS baisse de ≥ 10 points vs période précédente
- Gravité : Haute
- Action : Investigation immédiate requise

**Alerte NPS critique :**
- Condition : NPS < 0
- Gravité : Critique
- Action : Action corrective immédiate requise

**Alerte NPS faible :**
- Condition : NPS < 10
- Gravité : Moyenne
- Action : Analyse et plan d'action requis

### 6.2 Alertes Perception

**Alerte perception en baisse :**
- Condition : Perception baisse de ≥ 0.5 points vs période précédente
- Gravité : Moyenne
- Action : Analyse des causes requise

**Alerte perception critique :**
- Condition : Perception < 3.0/5
- Gravité : Haute
- Action : Investigation immédiate requise

### 6.3 Alertes Qualité

**Alerte qualité en baisse :**
- Condition : Qualité baisse de ≥ 0.5 points vs période précédente
- Gravité : Moyenne
- Action : Analyse des causes requise

**Alerte qualité critique :**
- Condition : Qualité < 3.0/5
- Gravité : Haute
- Action : Investigation immédiate requise

### 6.4 Alertes Taux de Réponse

**Alerte taux de réponse faible :**
- Condition : Taux de réponse < 30%
- Gravité : Basse
- Action : Optimisation de l'enquête requise

---

## 7. Rapports et Export

### 7.1 Rapports Automatiques

**Rapport hebdomadaire :**
- Envoyé automatiquement chaque lundi
- Contenu : KPIs de la semaine, tendance, alertes
- Destinataires : DRH, équipe RH

**Rapport mensuel :**
- Envoyé automatiquement le 1er de chaque mois
- Contenu : KPIs du mois, tendance, analyse détaillée, recommandations
- Destinataires : DRH, équipe RH, direction

**Rapport trimestriel :**
- Envoyé automatiquement le 1er de chaque trimestre
- Contenu : KPIs du trimestre, tendance, analyse détaillée, benchmark, recommandations
- Destinataires : DRH, équipe RH, direction

### 7.2 Export

**Formats d'export :**
- CSV
- Excel
- PDF

**Données exportables :**
- Données brutes des enquêtes
- KPIs agrégés
- Graphiques
- Rapports

---

## 8. Structure de Données (TypeScript)

```typescript
interface NPSDashboard {
  dashboardId: string;
  
  kpis: {
    globalNPS: {
      value: number;
      variationPreviousPeriod: number;
      variationSamePeriodLastYear: number;
      trend: number[];
      target: number;
      category: 'excellent' | 'good' | 'average' | 'low' | 'critical';
    };
    evaluationPerception: {
      value: number;
      variationPreviousPeriod: number;
      distribution: Record<number, number>;
      trend: number[];
      target: number;
      category: 'excellent' | 'good' | 'average' | 'low';
    };
    experienceQuality: {
      value: number;
      variationPreviousPeriod: number;
      distribution: Record<number, number>;
      trend: number[];
      target: number;
      category: 'excellent' | 'good' | 'average' | 'low';
    };
    responseRate: {
      value: number;
      variationPreviousPeriod: number;
      trend: number[];
      target: number;
      category: 'excellent' | 'good' | 'average' | 'low';
    };
  };
  
  views: {
    overview: {
      kpiCards: any[];
      charts: any[];
    };
    byPersona: {
      filters: string[];
      indicators: Record<string, any>;
      charts: any[];
    };
    byProcessStage: {
      filters: string[];
      indicators: Record<string, any>;
      charts: any[];
    };
    byPeriod: {
      filters: string[];
      indicators: Record<string, any>;
      charts: any[];
    };
  };
  
  filters: {
    temporal: {
      period: string;
      customStart?: Date;
      customEnd?: Date;
    };
    demographic: {
      experienceLevel?: string;
      sector?: string;
      jobType?: string;
      location?: string;
    };
    process: {
      persona?: string;
      stage?: string;
      interviewType?: string;
      interviewDuration?: string;
    };
    decision: {
      decision?: string;
    };
  };
  
  alerts: {
    nps: {
      decline: {
        condition: string;
        severity: string;
        action: string;
      };
      critical: {
        condition: string;
        severity: string;
        action: string;
      };
      low: {
        condition: string;
        severity: string;
        action: string;
      };
    };
    perception: {
      decline: {
        condition: string;
        severity: string;
        action: string;
      };
      critical: {
        condition: string;
        severity: string;
        action: string;
      };
    };
    quality: {
      decline: {
        condition: string;
        severity: string;
        action: string;
      };
      critical: {
        condition: string;
        severity: string;
        action: string;
      };
    };
    responseRate: {
      low: {
        condition: string;
        severity: string;
        action: string;
      };
    };
  };
  
  reports: {
    weekly: {
      enabled: boolean;
      schedule: string;
      recipients: string[];
      content: string[];
    };
    monthly: {
      enabled: boolean;
      schedule: string;
      recipients: string[];
      content: string[];
    };
    quarterly: {
      enabled: boolean;
      schedule: string;
      recipients: string[];
      content: string[];
    };
  };
  
  exports: {
    formats: string[];
    dataTypes: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE nps_dashboard (
  id VARCHAR(36) PRIMARY KEY,
  
  kpis JSON NOT NULL,
  views JSON NOT NULL,
  filters JSON NOT NULL,
  alerts JSON NOT NULL,
  reports JSON NOT NULL,
  exports JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE nps_alert_log (
  id VARCHAR(36) PRIMARY KEY,
  dashboard_id VARCHAR(36) NOT NULL,
  
  alert_type VARCHAR(50) NOT NULL,
  alert_severity VARCHAR(20) NOT NULL,
  alert_value JSON NOT NULL,
  alert_condition VARCHAR(255) NOT NULL,
  triggered_at TIMESTAMP NOT NULL,
  acknowledged_at TIMESTAMP,
  action_taken TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (dashboard_id) REFERENCES nps_dashboard(id)
);

CREATE INDEX idx_nps_alert_log_dashboard ON nps_alert_log(dashboard_id);
CREATE INDEX idx_nps_alert_log_triggered_at ON nps_alert_log(triggered_at);
```

---

## 10. API Endpoints

```typescript
// GET /api/candidate-experience/nps-dashboard
async function getNPSDashboard(filters?: any): Promise<NPSDashboard> {
  return await getNPSDashboard(filters);
}

// GET /api/candidate-experience/nps-dashboard/kpis
async function getNPSKPIs(filters?: any): Promise<any> {
  return await getNPSKPIs(filters);
}

// GET /api/candidate-experience/nps-dashboard/alerts
async function getNPSAlerts(filters?: any): Promise<any[]> {
  return await getNPSAlerts(filters);
}

// POST /api/candidate-experience/nps-dashboard/alert/:alertId/acknowledge
async function acknowledgeAlert(alertId: string, actionTaken?: string): Promise<void> {
  return await acknowledgeAlert(alertId, actionTaken);
}

// GET /api/candidate-experience/nps-dashboard/export
async function exportNPSData(format: string, filters?: any): Promise<any> {
  return await exportNPSData(format, filters);
}

// POST /api/candidate-experience/nps-dashboard/report
async function generateReport(type: string, period: string): Promise<any> {
  return await generateReport(type, period);
}

// PUT /api/candidate-experience/nps-dashboard
async function updateNPSDashboard(dashboard: NPSDashboard): Promise<NPSDashboard> {
  return await updateNPSDashboard(dashboard);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de consultation du tableau de bord | Consultations / utilisateurs actifs | ≥ 80% |
- Fréquence de consultation | Consultations / utilisateur / mois | ≥ 4 |
- Taux d'utilisation des filtres | Utilisations de filtres / consultations | ≥ 50% |

### 11.2 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
- Temps de chargement du tableau de bord | Secondes | ≤ 3 |
- Temps de génération des rapports | Secondes | ≤ 10 |
- Taux de réponse aux alertes | Alertes traitées / alertes | ≥ 90% |

---

## 12. Conclusion

Le tableau de bord NPS candidat permet de suivre en temps réel la satisfaction des candidats à travers le Net Promoter Score (NPS). Il fournit une vue d'ensemble et des vues détaillées par persona, par stade du processus, et par période. Les alertes automatiques identifient les dégradations de la satisfaction pour permettre une réaction rapide. Les rapports automatiques (hebdomadaire, mensuel, trimestriel) assurent une communication régulière avec les parties prenantes.

**Points clés :**
- 4 indicateurs principaux (NPS global, perception de l'évaluation, qualité de l'expérience, taux de réponse)
- 4 vues (d'ensemble, par persona, par stade du processus, par période)
- Filtres temporels, démographiques, processus, et décision
- Alertes automatiques (NPS, perception, qualité, taux de réponse)
- Rapports automatiques (hebdomadaire, mensuel, trimestriel)
- Export des données (CSV, Excel, PDF)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'utilisation et de performance
