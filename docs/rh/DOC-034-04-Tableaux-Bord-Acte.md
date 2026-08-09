# DOC-034-04 : Tableaux de Bord par Acte

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les tableaux de bord par acte pour MVP-034 Interview Orchestrator. Ces tableaux de bord fournissent en temps réel au recruteur les métriques, les recommandations, et les signaux à surveiller pour chaque acte de l'entretien, permettant une orchestration dynamique et adaptative.

---

## 2. Principe Fondateur

Le recruteur doit avoir une visibilité en temps réel sur l'état de l'entretien. Chaque acte a son propre tableau de bord avec des métriques spécifiques, des recommandations contextuelles, et des alertes automatiques. Le tableau de bord guide le recruteur dans les décisions à prendre.

---

## 3. Tableau de Bord Acte 1 — Ouverture

### 3.1 Métriques en Temps Réel

```
┌─────────────────────────────────────────────────────────────┐
│ ACTE 1 — OUVERTURE                                         │
├─────────────────────────────────────────────────────────────┤
│ TEMPS ÉCOULÉ : 5 min / 8 min                               │
│ PROGRESSION : 62%                                          │
├─────────────────────────────────────────────────────────────┤
│ NIVEAU D'AISE : Standard                                   │
│ STYLE DE COMMUNICATION : Expansif                          │
│ SIGNAL ÉMOTIONNEL DOMINANT : Positif                        │
├─────────────────────────────────────────────────────────────┤
│ CADRE DE CONFIANCE : Établi ✓                              │
│ PRÉSENTATION DÉROULÉE : Oui ✓                              │
│ CANDIDAT PRÉSENTÉ : Oui ✓                                  │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATION : Passer à l'Acte 2                          │
│                                                             │
│ ADAPTATION SUGGÉRÉE :                                       │
│ • Maintenir le niveau d'engagement                          │
│ • Structurer légèrement les échanges                        │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Indicateurs

**Niveau d'aise :**
- Très à l'aise : Candidat détendu, communication fluide
- Standard : Candidat à l'aise, communication normale
- Stressé : Candidat tendu, communication hésitante
- Très stressé : Candidat très tendu, communication difficile

**Style de communication :**
- Direct : Réponses courtes et précises
- Réservé : Réponses brèves, peu d'élaboration
- Expansif : Réponses détaillées, beaucoup d'élaboration
- Précis : Réponses structurées, bien articulées

**Signal émotionnel dominant :**
- Positif : Enthousiasme, optimisme
- Neutre : Calme, professionnel
- Négatif : Anxiété, défensivité
- Mixte : Alternance de signaux

### 3.3 Alertes

**Alerte si :**
- Niveau d'aise = Très stressé → Suggérer de réduire le challenge
- Cadre de confiance non établi après 5 min → Suggérer de reformuler
- Signal émotionnel négatif dominant → Suggérer de créer plus de confiance

---

## 4. Tableau de Bord Acte 2 — Exploration

### 4.1 Métriques en Temps Réel

```
┌─────────────────────────────────────────────────────────────┐
│ ACTE 2 — EXPLORATION DU PARCOURS                           │
├─────────────────────────────────────────────────────────────┤
│ TEMPS ÉCOULÉ : 12 min / 18 min                             │
│ PROGRESSION : 67%                                          │
├─────────────────────────────────────────────────────────────┤
│ COMPÉTENCES VALIDÉES : 4 / 6                               │
│   • Python : 4/5 ✓                                         │
│   • JavaScript : 3/5 ⚠                                     │
│   • Architecture : 4/5 ✓                                     │
│   • Leadership : 2/5 ⚠                                     │
│ COMPÉTENCES À VALIDER : 2                                  │
│   • Communication                                          │
│   • Résolution de problèmes                                │
├─────────────────────────────────────────────────────────────┤
│ EXPÉRIENCES EXPLORÉES : 2 / 3                              │
│   • Expérience 1 : Complète ✓                              │
│   • Expérience 2 : Partielle ⚠                             │
│   • Expérience 3 : Non explorée                             │
├─────────────────────────────────────────────────────────────┤
│ SIGNAUX DÉTECTÉS :                                          │
│   ✓ Force : Expertise technique solide                      │
│   ⚠ Vigilance : Tendance à surcharger                      │
│   ⚠ Vigilance : Manque de leadership                       │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATION : Continuer l'exploration                    │
│                                                             │
│ PRIORITÉ : Valider Leadership et Communication              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Indicateurs

**Compétences validées :**
- Liste des compétences avec score (1-5)
- Statut : Validé (≥ 4), Partiel (2-3), Non validé (< 2)

**Expériences explorées :**
- Liste des expériences avec statut
- Statut : Complète, Partielle, Non explorée

**Signaux détectés :**
- ✓ Signaux positifs
- ⚠ Signaux de vigilance
- ✗ Signaux éliminatoires

### 4.3 Alertes

**Alerte si :**
- Temps restant < 5 min et compétences restantes > 2 → Suggérer d'accélérer
- Signal éliminatoire détecté → Alerte immédiate
- Incohérence détectée → Suggérer question de clarification

---

## 5. Tableau de Bord Acte 3 — Approfondissement

### 5.1 Métriques en Temps Réel

```
┌─────────────────────────────────────────────────────────────┐
│ ACTE 3 — APPROFONDISSEMENT                                  │
├─────────────────────────────────────────────────────────────┤
│ TEMPS ÉCOULÉ : 18 min / 21 min                             │
│ PROGRESSION : 86%                                          │
├─────────────────────────────────────────────────────────────┤
│ SOFT SKILLS ÉVALUÉS : 3 / 4                                │
│   • Collaboration : 4/5 ✓                                  │
│   • Communication : 3/5 ⚠                                   │
│   • Adaptabilité : 4/5 ✓                                    │
│   • Leadership : 2/5 ⚠                                     │
├─────────────────────────────────────────────────────────────┤
│ MOTIVATIONS CLARIFIÉES : Partiellement ⚠                    │
│   • Motivation intrinsèque : Oui ✓                          │
│   • Motivation extrinsèque : Non ⚠                           │
│   • Projection long terme : Non ⚠                           │
├─────────────────────────────────────────────────────────────┤
│ CULTURE FIT ÉVALUÉ : Partiellement ⚠                       │
│   • Compatibilité manager : Oui ✓                           │
│   • Compatibilité équipe : Oui ✓                            │
│   • Compatibilité culture : Non ⚠                           │
├─────────────────────────────────────────────────────────────┤
│ TENSIONS DÉTECTÉES :                                        │
│   ⚠ Incohérence motivation / culture                        │
│   ⚠ Risque de désengagement                                │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATION : Prioriser motivations et culture fit       │
│                                                             │
│ TEMPS RESTANT POUR ACTE 4 : 8 min                          │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Indicateurs

**Soft skills évalués :**
- Liste des soft skills avec score (1-5)
- Statut : Évalué, Partiellement, Non évalué

**Motivations clarifiées :**
- Statut global : Oui, Partiellement, Non
- Détail par dimension

**Culture fit évalué :**
- Statut global : Oui, Partiellement, Non
- Détail par dimension

**Tensions détectées :**
- Liste des incohérences ou risques identifiés

### 5.3 Alertes

**Alerte si :**
- Tension détectée → Suggérer question de clarification
- Temps restant < 5 min et soft skills restants > 2 → Suggérer priorisation
- Incohérence majeure → Alerte immédiate

---

## 6. Tableau de Bord Acte 4 — Challenge

### 6.1 Métriques en Temps Réel

```
┌─────────────────────────────────────────────────────────────┐
│ ACTE 4 — CHALLENGE & STRESS TEST                           │
├─────────────────────────────────────────────────────────────┤
│ TEMPS ÉCOULÉ : 6 min / 12 min                              │
│ PROGRESSION : 50%                                          │
├─────────────────────────────────────────────────────────────┤
│ ZONES D'OMBRE CLARIFIÉES : 2 / 3                           │
│   • Motivation réelle : Clarifiée ✓                         │
│   • Leadership : Clarifiée ✓                                │
│   • Culture fit : Non clarifiée ⚠                           │
├─────────────────────────────────────────────────────────────┤
│ ZONES D'OMBRE RÉSIDUELLES : 1                               │
│   • Culture fit                                            │
├─────────────────────────────────────────────────────────────┤
│ RÉACTION SOUS PRESSION : Stable ✓                           │
│   • Maintien cohérence : Oui ✓                              │
│   • Qualité réaction : Bonne ✓                              │
│   • Capacité assumer failles : Oui ✓                        │
│   • Authenticité : Oui ✓                                   │
├─────────────────────────────────────────────────────────────┤
│ SCORE DE RÉSILIENCE : 4/5 ✓                                 │
├─────────────────────────────────────────────────────────────┤
│ INCOHÉRENCES DÉTECTÉES : Aucune ✓                           │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATION : Continuer le challenge                     │
│                                                             │
│ NIVEAU DE CHALLENGE : Maintenir                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Indicateurs

**Zones d'ombre clarifiées :**
- Liste des zones avec statut
- Statut : Clarifiée, Partiellement, Non clarifiée

**Réaction sous pression :**
- Statut global : Stable, Instable, Très instable
- Détail par dimension

**Score de résilience :**
- Score global (1-5)
- Interprétation : Faible (1-2), Moyen (3), Fort (4-5)

**Incohérences détectées :**
- Liste des incohérences identifiées

### 6.3 Alertes

**Alerte si :**
- Réaction sous pression = Très instable → Suggérer de réduire le challenge
- Incohérence détectée → Suggérer question de clarification
- Candidat se ferme → Suggérer pause et désescalade

---

## 7. Tableau de Bord Acte 5 — Clôture

### 7.1 Métriques en Temps Réel

```
┌─────────────────────────────────────────────────────────────┐
│ ACTE 5 — CLÔTURE                                           │
├─────────────────────────────────────────────────────────────┤
│ TEMPS ÉCOULÉ : 4 min / 5 min                               │
│ PROGRESSION : 80%                                          │
├─────────────────────────────────────────────────────────────┤
│ QUESTIONS CANDIDAT : 3 posées                               │
│   • Poste et missions : 1 ✓                                 │
│   • Équipe et manager : 1 ✓                                 │
│   • Évolution : 1 ✓                                         │
│   • Salaire : 0                                             │
├─────────────────────────────────────────────────────────────┤
│ ANALYSE DES QUESTIONS :                                     │
│   ✓ Qualité : Pertinentes                                   │
│   ✓ Motivation : Contenu                                    │
│   ✓ Intelligence relationnelle : Oui                        │
├─────────────────────────────────────────────────────────────┤
│ AUTRES PROCESSUS EN COURS : 1                              │
│   • Entreprise B : Round 2                                   │
│   • Urgence décision : Moyenne                              │
├─────────────────────────────────────────────────────────────┤
│ CLÔTURE RELATIONNELLE : Positive ✓                          │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATION : Conclure positivement                      │
│                                                             │
│ POINTS À VALORISER :                                        │
│ • Expertise technique                                      │
│ • Potentiel d'évolution                                    │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Indicateurs

**Questions candidat :**
- Liste des questions par catégorie
- Analyse de la qualité et de ce qu'elles révèlent

**Autres processus en cours :**
- Nombre et détails des autres processus
- Urgence de décision

**Clôture relationnelle :**
- Statut : Positive, Neutre, Négative

### 7.3 Alertes

**Alerte si :**
- Aucune question posée → Signal potentiel de désintérêt
- Questions uniquement sur salaire → Signal de vigilance
- Candidat très attractif sur le marché → Suggérer accélération

---

## 8. Tableau de Bord Acte 6 — Post-Entretien

### 8.1 Métriques en Temps Réel

```
┌─────────────────────────────────────────────────────────────┐
│ ACTE 6 — POST-ENTRETIEN IMMÉDIAT                           │
├─────────────────────────────────────────────────────────────┤
│ DEBRIEF GÉNÉRÉ : En cours                                  │
├─────────────────────────────────────────────────────────────┤
│ IMPRESSION IMMÉDIATE RECRUTEUR : 7/10                       │
│ MOT QUI RÉSUME : "Compétent mais réservé"                   │
├─────────────────────────────────────────────────────────────┤
│ COMPARAISON IMPRESSION / ANALYSE :                          │
│   • Concordance : 75% ✓                                    │
│   • Divergence : Motivation (impression + / analyse -)      │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATION MOTEUR : Recommandé                          │
│ NIVEAU DE CONFIANCE : Moyen (65%)                          │
│ CARTOGRAPHIE INCERTITUDE :                                   │
│   • Compétences techniques : Faible                         │
│   • Motivations : Moyenne                                   │
│   • Culture fit : Élevée                                    │
├─────────────────────────────────────────────────────────────┤
│ COMMUNICATION PRÉPARÉE :                                    │
│   • Type : Confirmation de suite                            │
│   • Points à valoriser : Expertise, Potentiel               │
├─────────────────────────────────────────────────────────────┤
│ MÉMOIRE INSTITUTIONNELLE : Alimenté ✓                      │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Indicateurs

**Impression immédiate recruteur :**
- Score global (1-10)
- Mot qui résume
- Ce qui a été aimé
- Ce qui interroge

**Comparaison impression / analyse :**
- Taux de concordance
- Divergences identifiées

**Recommandation moteur :**
- Décision : Recommandé, Refusé, À approfondir
- Niveau de confiance
- Cartographie d'incertitude

### 8.3 Alertes

**Alerte si :**
- Divergence significative (> 30%) → Suggérer réflexion guidée
- Niveau de confiance faible (< 50%) → Suggérer second round
- Candidat très attractif sur le marché → Suggérer accélération

---

## 9. Structure de Données (TypeScript)

```typescript
interface ActDashboard {
  dashboardId: string;
  interviewId: string;
  actNumber: number;
  actName: string;
  
  metrics: {
    timeElapsed: number;
    timeTotal: number;
    progression: number;
  };
  
  actSpecificMetrics: {
    act1?: {
      comfortLevel: 'very_comfortable' | 'standard' | 'stressed' | 'very_stressed';
      communicationStyle: 'direct' | 'reserved' | 'expansive' | 'precise';
      dominantEmotionalSignal: 'positive' | 'neutral' | 'negative' | 'mixed';
      trustFramework: boolean;
      frameworkPresented: boolean;
      candidatePresented: boolean;
    };
    act2?: {
      competenciesValidated: number;
      competenciesTotal: number;
      competenciesList: {
        name: string;
        score: number;
        status: 'validated' | 'partial' | 'not_validated';
      }[];
      experiencesExplored: number;
      experiencesTotal: number;
      experiencesList: {
        name: string;
        status: 'complete' | 'partial' | 'not_explored';
      }[];
      signalsDetected: {
        type: 'positive' | 'vigilance' | 'eliminatory';
        description: string;
      }[];
    };
    act3?: {
      softSkillsEvaluated: number;
      softSkillsTotal: number;
      softSkillsList: {
        name: string;
        score: number;
        status: 'evaluated' | 'partial' | 'not_evaluated';
      }[];
      motivationsClarified: 'yes' | 'partially' | 'no';
      motivationsDetail: {
        intrinsic: 'yes' | 'no';
        extrinsic: 'yes' | 'no';
        longTerm: 'yes' | 'no';
      };
      cultureFitEvaluated: 'yes' | 'partially' | 'no';
      cultureFitDetail: {
        manager: 'yes' | 'no';
        team: 'yes' | 'no';
        culture: 'yes' | 'no';
      };
      tensionsDetected: string[];
    };
    act4?: {
      shadowZonesClarified: number;
      shadowZonesTotal: number;
      shadowZonesList: {
        name: string;
        status: 'clarified' | 'partial' | 'not_clarified';
      }[];
      shadowZonesResidual: string[];
      reactionUnderPressure: 'stable' | 'unstable' | 'very_unstable';
      reactionDetail: {
        coherence: boolean;
        quality: 'good' | 'fair' | 'poor';
        assumeFailures: boolean;
        authenticity: boolean;
      };
      resilienceScore: number;
      inconsistenciesDetected: string[];
    };
    act5?: {
      questionsAsked: number;
      questionsByCategory: {
        postAndMissions: number;
        teamAndManager: number;
        evolution: number;
        salary: number;
      };
      questionsAnalysis: {
        quality: 'relevant' | 'irrelevant';
        motivation: 'content' | 'extrinsic' | 'none';
        relationalIntelligence: boolean;
      };
      otherProcesses: number;
      otherProcessesDetail: {
        company: string;
        round: string;
        urgency: 'low' | 'medium' | 'high';
      }[];
      closureRelational: 'positive' | 'neutral' | 'negative';
    };
    act6?: {
      debriefGenerated: boolean;
      immediateImpression: number;
      summaryWord: string;
      comparison: {
        concordance: number;
        divergences: string[];
      };
      engineRecommendation: 'recommended' | 'rejected' | 'to_deepen';
      confidenceLevel: number;
      uncertaintyMapping: {
        technicalSkills: 'low' | 'medium' | 'high';
        motivations: 'low' | 'medium' | 'high';
        cultureFit: 'low' | 'medium' | 'high';
      };
      communicationPrepared: {
        type: string;
        pointsToHighlight: string[];
      };
      memoryInstitutionalFed: boolean;
    };
  };
  
  recommendation: string;
  adaptationSuggested?: string[];
  priority?: string;
  
  alerts: {
    type: 'info' | 'warning' | 'critical';
    message: string;
    suggestedAction: string;
  }[];
  
  metadata: {
    generatedAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 10. Stockage et Gestion

### 10.1 Schéma SQL

```sql
CREATE TABLE act_dashboard (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  act_number INT NOT NULL,
  act_name VARCHAR(50) NOT NULL,
  
  metrics JSON NOT NULL,
  act_specific_metrics JSON NOT NULL,
  recommendation TEXT NOT NULL,
  adaptation_suggested JSON,
  priority VARCHAR(255),
  alerts JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview(id),
  UNIQUE KEY idx_act_dashboard_interview_act (interview_id, act_number)
);

CREATE INDEX idx_act_dashboard_interview ON act_dashboard(interview_id);
CREATE INDEX idx_act_dashboard_act ON act_dashboard(act_number);
```

---

## 11. API Endpoints

```typescript
// GET /api/interview/dashboard/:interviewId/act/:actNumber
async function getActDashboard(interviewId: string, actNumber: number): Promise<ActDashboard> {
  return await getActDashboard(interviewId, actNumber);
}

// PUT /api/interview/dashboard/:dashboardId
async function updateActDashboard(dashboardId: string, dashboard: ActDashboard): Promise<ActDashboard> {
  return await updateActDashboard(dashboardId, dashboard);
}

// GET /api/interview/dashboard/:interviewId/all
async function getAllActDashboards(interviewId: string): Promise<ActDashboard[]> {
  return await getAllActDashboards(interviewId);
}

// POST /api/interview/dashboard/:interviewId/act/:actNumber/alert
async function addAlert(interviewId: string, actNumber: number, alert: any): Promise<ActDashboard> {
  return await addAlert(interviewId, actNumber, alert);
}

// PUT /api/interview/dashboard/:dashboardId/recommendation
async function updateRecommendation(dashboardId: string, recommendation: string): Promise<ActDashboard> {
  return await updateRecommendation(dashboardId, recommendation);
}
```

---

## 12. Indicateurs de Suivi

### 12.1 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de consultation | Dashboards consultés / générés | ≥ 90% |
- Fréquence de mise à jour | Mises à jour par minute | ≥ 1/min |
- Satisfaction recruteur | Note moyenne | ≥ 4.5/5 |

### 12.2 Métriques d'Efficacité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Respect du tempo | Entretiens dans le temps / total | ≥ 80% |
- Transitions automatiques | Transitions auto / total | ≥ 70% |
- Alertes pertinentes | Alertes actionnées / total | ≥ 75% |

---

## 13. Conclusion

Les tableaux de bord par acte fournissent en temps réel au recruteur les métriques, les recommandations, et les signaux à surveiller pour chaque acte de l'entretien. Chaque tableau de bord est spécifique à son acte avec des métriques adaptées, des alertes contextuelles, et des recommandations d'adaptation.

**Points clés :**
- 6 tableaux de bord spécifiques par acte
- Métriques en temps réel
- Indicateurs personnalisés par acte
- Alertes automatiques contextuelles
- Recommandations d'adaptation
- Priorisation des points à traiter
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'utilisation et d'efficacité
