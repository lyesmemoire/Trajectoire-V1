# DOC-040-03 : Tableau de Bord NPS Candidat

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le tableau de bord NPS candidat pour MVP-040 Candidate Feedback Loop. Ce document structure le calcul mensuel du Net Promoter Score candidat, les benchmarks, les visualisations, les filtres, les alertes automatiques, et les rapports pour suivre l'expérience candidat en temps réel.

---

## 2. Principe Fondateur

Le Net Promoter Score (NPS) candidat est un indicateur clé de l'expérience candidat. Calculé mensuellement, il mesure la probabilité que les candidats recommandent le processus de recrutement à d'autres. L'objectif est un NPS > 50, ce qui est remarquable pour un processus de recrutement. Le tableau de bord permet de suivre le NPS en temps réel, d'identifier les tendances, et de prendre des actions correctives si nécessaire.

---

## 3. Calcul du NPS Candidat

### 3.1 Question NPS

**Question :**
"Sur une échelle de 0 à 10, quelle est la probabilité que vous recommandiez notre processus de recrutement à un ami ou collègue ?"

**Échelle :**
0 = Pas du tout probable
10 = Très probable

### 3.2 Classification des Réponses

**Promoteurs (9-10) :**
- Candidats très satisfaits
- Probabilité élevée de recommandation
- Ambassadeurs de la marque employeur

**Passifs (7-8) :**
- Candidats satisfaits mais pas enthousiastes
- Probabilité faible de recommandation
- Vulnérables aux offres concurrentes

**Détracteurs (0-6) :**
- Candidats insatisfaits
- Probabilité élevée de dénigrement
- Risque pour la réputation

### 3.3 Formule du NPS

**Calcul :**
NPS = % Promoteurs - % Détracteurs

**Exemple :**
- 50 candidats répondent
- 30 sont promoteurs (60%)
- 10 sont passifs (20%)
- 10 sont détracteurs (20%)
- NPS = 60% - 20% = 40

### 3.4 Fréquence de Calcul

**Calcul :**
- Mensuel
- Basé sur tous les feedbacks du mois
- Mis à jour en temps réel

**Historique :**
- Conservation de l'historique mensuel
- Comparaison mois sur mois
- Tendance sur 12 mois

---

## 4. Benchmarks et Cibles

### 4.1 Benchmarks

**NPS < 0 :**
- Expérience très négative
- Action corrective immédiate nécessaire
- Risque élevé pour la réputation

**NPS 0-30 :**
- Expérience standard
- Amélioration nécessaire
- Compétitivité moyenne

**NPS 30-50 :**
- Bonne expérience
- Maintenir les pratiques actuelles
- Amélioration continue

**NPS > 50 :**
- Expérience remarquable
- Objectif à atteindre
- Avantage concurrentiel

**NPS > 70 :**
- Expérience exceptionnelle
- Niveau grand cabinet mondial
- Excellence en expérience candidat

### 4.2 Cibles

**Cible court terme (3 mois) :**
- NPS ≥ 30

**Cible moyen terme (6 mois) :**
- NPS ≥ 50

**Cible long terme (12 mois) :**
- NPS ≥ 70

---

## 5. Structure du Tableau de Bord

### 5.1 Vue Principale

**Indicateurs clés :**
- NPS actuel
- Évolution mois sur mois
- Tendance sur 12 mois
- Comparaison avec la cible

**Visualisations :**
- Graphique NPS sur 12 mois
- Distribution des réponses (Promoteurs/Passifs/Détracteurs)
- Évolution des 3 questions du feedback
- NPS par persona

### 5.2 Vue par Persona

**Personas :**
- DRH Senior Bienveillant
- DRH Executive
- DRH Startup
- DRH Technique

**Indicateurs :**
- NPS par persona
- Évolution par persona
- Comparaison entre personas
- Identification des personas à améliorer

### 5.3 Vue par Étape du Processus

**Étapes :**
- Candidature
- Entretien 1
- Entretien 2
- Offre
- Onboarding

**Indicateurs :**
- NPS par étape
- Évolution par étape
- Identification des étapes problématiques
- Actions recommandées par étape

### 5.4 Vue par Période

**Périodes :**
- Jour
- Semaine
- Mois
- Trimestre
- Année

**Indicateurs :**
- NPS par période
- Évolution par période
- Tendance à long terme
- Saisonnalité

---

## 6. Filtres et Segmentation

### 6.1 Filtres Temporels

**Filtres disponibles :**
- Date de début
- Date de fin
- Période prédéfinie (7 jours, 30 jours, 90 jours, 12 mois)

### 6.2 Filtres par Candidat

**Filtres disponibles :**
- Type de poste
- Niveau d'expérience
- Secteur
- Localisation
- Source de candidature

### 6.3 Filtres par Recruteur

**Filtres disponibles :**
- Recruteur spécifique
- Persona du recruteur
- Équipe
- Département

---

## 7. Alertes Automatiques

### 7.1 Alertes de NPS

**Alerte NPS < 0 :**
- Niveau : Critique
- Action : Analyse immédiate et plan d'action
- Notification : DRH, Direction

**Alerte NPS < 30 :**
- Niveau : Avertissement
- Action : Analyse et plan d'amélioration
- Notification : DRH, Équipe produit

**Alerte NPS baisse de 10 points :**
- Niveau : Avertissement
- Action : Analyse de la cause
- Notification : DRH, Équipe produit

### 7.2 Alertes de Tendance

**Alerte tendance négative :**
- Baisse continue sur 3 mois
- Niveau : Avertissement
- Action : Analyse approfondie
- Notification : DRH, Équipe produit

**Alerte tendance positive :**
- Hausse continue sur 3 mois
- Niveau : Information
- Action : Documenter les bonnes pratiques
- Notification : DRH, Équipe produit

---

## 8. Rapports

### 8.1 Rapport Quotidien

**Contenu :**
- NPS du jour
- Évolution par rapport à la veille
- Nombre de réponses
- Distribution des réponses
- Alertes si NPS < 0

**Destinataires :**
- DRH
- Équipe produit

### 8.2 Rapport Hebdomadaire

**Contenu :**
- NPS de la semaine
- Évolution par rapport à la semaine précédente
- NPS par persona
- NPS par étape du processus
- Tendances identifiées
- Actions recommandées

**Destinataires :**
- DRH
- Équipe produit
- Équipe technique

### 8.3 Rapport Mensuel

**Contenu :**
- NPS du mois
- Évolution par rapport au mois précédent
- NPS sur 12 mois
- Comparaison avec les benchmarks
- Analyse des tendances
- Actions mises en œuvre
- Efficacité des actions
- Recommandations pour le mois suivant

**Destinataires :**
- DRH
- Équipe produit
- Équipe technique
- Direction
- Comité exécutif

---

## 9. Structure de Données (TypeScript)

```typescript
interface CandidateNPS {
  npsId: string;
  candidateId: string;
  interviewId: string;
  
  respondedAt: Date;
  
  npsRating: number;
  classification: 'promoter' | 'passive' | 'detractor';
  
  feedback: {
    question1: number;
    question2: number;
    question3: number;
  };
  
  segmentation: {
    jobType: string;
    experienceLevel: string;
    sector: string;
    location: string;
    source: string;
  };
  
  recruiter: {
    recruiterId: string;
    persona: string;
    team: string;
    department: string;
  };
  
  processStage: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface NPSDashboard {
  dashboardId: string;
  
  currentNPS: {
    value: number;
    classification: string;
    target: number;
    evolution: number;
  };
  
  distribution: {
    promoters: {
      count: number;
      percentage: number;
    };
    passives: {
      count: number;
      percentage: number;
    };
    detractors: {
      count: number;
      percentage: number;
    };
  };
  
  trend: {
    monthly: {
      month: string;
      nps: number;
    }[];
  };
  
  byPersona: {
    persona: string;
    nps: number;
    evolution: number;
  }[];
  
  byProcessStage: {
    stage: string;
    nps: number;
    evolution: number;
  }[];
  
  benchmarks: {
    current: number;
    target: number;
    excellent: number;
    remarkable: number;
    good: number;
    standard: number;
    negative: number;
  };
  
  alerts: {
    critical: string[];
    warning: string[];
    info: string[];
  };
  
  metadata: {
    version: string;
    calculatedAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 10. Stockage et Gestion

### 10.1 Schéma SQL

```sql
CREATE TABLE candidate_nps (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  responded_at TIMESTAMP NOT NULL,
  
  nps_rating INT NOT NULL,
  classification VARCHAR(20) NOT NULL,
  
  feedback JSON NOT NULL,
  segmentation JSON NOT NULL,
  recruiter JSON NOT NULL,
  process_stage VARCHAR(50) NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_nps_candidate ON candidate_nps(candidate_id);
CREATE INDEX idx_candidate_nps_interview ON candidate_nps(interview_id);
CREATE INDEX idx_candidate_nps_responded_at ON candidate_nps(responded_at);
CREATE INDEX idx_candidate_nps_classification ON candidate_nps(classification);

CREATE TABLE nps_dashboard (
  id VARCHAR(36) PRIMARY KEY,
  
  current_nps JSON NOT NULL,
  distribution JSON NOT NULL,
  trend JSON NOT NULL,
  by_persona JSON NOT NULL,
  by_process_stage JSON NOT NULL,
  benchmarks JSON NOT NULL,
  alerts JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 11. API Endpoints

```typescript
// POST /api/candidate-nps/submit
async function submitCandidateNPS(candidateId: string, interviewId: string, npsRating: number, feedback: any): Promise<CandidateNPS> {
  return await submitCandidateNPS(candidateId, interviewId, npsRating, feedback);
}

// GET /api/candidate-nps/:npsId
async function getCandidateNPS(npsId: string): Promise<CandidateNPS> {
  return await getCandidateNPSById(npsId);
}

// GET /api/candidate-nps/calculate
async function calculateNPS(startDate?: Date, endDate?: Date): Promise<number> {
  return await calculateNPS(startDate, endDate);
}

// GET /api/candidate-nps/dashboard
async function getNPSDashboard(filters?: any): Promise<NPSDashboard> {
  return await getNPSDashboard(filters);
}

// GET /api/candidate-nps/trend
async function getNPSTrend(period: string): Promise<any> {
  return await getNPSTrend(period);
}

// GET /api/candidate-nps/by-persona
async function getNPSByPersona(persona?: string): Promise<any> {
  return await getNPSByPersona(persona);
}

// GET /api/candidate-nps/by-process-stage
async function getNPSByProcessStage(stage?: string): Promise<any> {
  return await getNPSByProcessStage(stage);
}

// POST /api/candidate-nps/alerts/check
async function checkNPSAlerts(): Promise<any> {
  return await checkNPSAlerts();
}
```

---

## 12. Indicateurs de Suivi

### 12.1 Métriques de NPS

| Métrique | Description | Cible |
|----------|-------------|-------|
| NPS actuel | NPS du mois | ≥ 50 |
- Évolution mois sur mois | Variation NPS | ≥ +5 |
- Tendance sur 12 mois | Tendance NPS | Positive |

### 12.2 Métriques de Participation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de réponse NPS | Réponses NPS / entretiens | ≥ 80% |
- Taux de promoteurs | Promoteurs / total | ≥ 50% |
- Taux de détracteurs | Détracteurs / total | ≤ 20% |

---

## 13. Conclusion

Le tableau de bord NPS candidat structure le calcul mensuel du Net Promoter Score candidat, les benchmarks, les visualisations, les filtres, les alertes automatiques, et les rapports. Le NPS est calculé comme % Promoteurs - % Détracteurs, avec une cible de NPS > 50 (remarquable). Le tableau de bord permet de suivre le NPS en temps réel, d'identifier les tendances, et de prendre des actions correctives si nécessaire. Les alertes automatiques notifient le DRH et l'équipe produit si le NPS baisse significativement.

**Points clés :**
- Question NPS (0-10) : probabilité de recommandation
- Classification : Promoteurs (9-10), Passifs (7-8), Détracteurs (0-6)
- Formule NPS = % Promoteurs - % Détracteurs
- Calcul mensuel, historique sur 12 mois
- Benchmarks : < 0 (très négative), 0-30 (standard), 30-50 (bonne), > 50 (remarquable), > 70 (exceptionnelle)
- Cibles : court terme ≥ 30, moyen terme ≥ 50, long terme ≥ 70
- Vue principale, par persona, par étape du processus, par période
- Filtres temporels, par candidat, par recruteur
- Alertes automatiques (NPS < 0, NPS < 30, baisse de 10 points, tendance)
- Rapports quotidiens, hebdomadaires, mensuels
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de NPS et de participation
