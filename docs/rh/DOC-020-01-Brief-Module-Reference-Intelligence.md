# DOC-020-01 : Brief du Module Reference Intelligence

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-020 Reference Intelligence. Ce module transforme la prise de références d'une formalité administrative en un outil d'investigation structuré, avec un guide expert personnalisé, des questions calibrées, une analyse des réponses, et un scoring de cohérence entre références et entretien.

---

## 2. Principe Fondateur

Les références sont l'une des sources d'information les plus sous-exploitées du recrutement. Un grand cabinet les utilise comme un outil d'investigation structuré, pas comme une formalité administrative. Ce module génère pour chaque candidat un protocole de prise de références personnalisé, avec choix des référents, questions calibrées, analyse des réponses, et scoring de cohérence.

---

## 3. Capacités du Module

### CAPACITÉ 1 — Guide de Prise de Références Expert

Pour chaque candidat, le moteur génère un protocole de prise de références personnalisé avec choix des référents, questions calibrées pour confirmer ou infirmer les hypothèses de l'entretien, et analyse des réponses (signaux positifs, de vigilance, d'alerte).

**Choix des référents :**
- Ancien manager direct (obligatoire)
- Pair qui a travaillé étroitement
- Subordonné si poste de management
- Client si poste orienté relation client

**Questions pour la prise de références :**
- Questions fondamentales calibrées
- Questions ciblées sur les zones d'ombre détectées en entretien

**Analyse des références :**
- Signaux positifs (enthousiasme, exemples concrets, recommandation sans réserve)
- Signaux de vigilance (hésitations, formulations génériques, divergence)
- Signaux d'alerte (refus de commenter, malaise, contradiction)

---

### CAPACITÉ 2 — Scoring de Cohérence Référence / Entretien

Le moteur compare ce que le candidat a dit en entretien avec ce que les référents ont confirmé ou infirmé, et produit un score de cohérence (Élevé / Moyen / Faible). Si cohérence faible, liste des points divergents, recommandation d'entretien complémentaire, et niveau de risque (Mineur / Significatif / Bloquant).

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Génération du Protocole de Références

**Scénario :** Un recruteur prépare la prise de références pour un candidat.

**Action :**
1. Le moteur génère le protocole de prise de références personnalisé
2. Le moteur identifie les référents à contacter en priorité
3. Le moteur génère les questions fondamentales
4. Le moteur génère les questions ciblées sur les zones d'ombre
5. Le moteur fournit le guide d'analyse des réponses

**Résultat :** Le recruteur dispose d'un protocole structuré et personnalisé pour la prise de références.

---

### CAS D'USAGE 2 — Analyse des Réponses de Références

**Scénario :** Le recruteur a obtenu les réponses des référents.

**Action :**
1. Le moteur analyse les réponses obtenues
2. Le moteur identifie les signaux positifs, de vigilance, d'alerte
3. Le moteur produit une analyse structurée
4. Le moteur recommande des actions complémentaires si nécessaire

**Résultat :** Le recruteur dispose d'une analyse structurée des références avec signaux et recommandations.

---

### CAS D'USAGE 3 — Scoring de Cohérence

**Scénario :** Le recruteur a terminé les entretiens et les références.

**Action :**
1. Le moteur compare le discours du candidat avec les références
2. Le moteur calcule le score de cohérence
3. Le moteur identifie les points divergents
4. Le moteur recommande un entretien complémentaire si nécessaire
5. Le moteur évalue le niveau de risque des divergences

**Résultat :** Le recruteur dispose d'un scoring de cohérence avec recommandations d'action.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE REFERENCE INTELLIGENCE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ DONNÉES CANDIDAT                                     │   │
│ │ - Profil du candidat                                │   │
│ │ - Entretiens réalisés                               │   │
│ │ - Zones d'ombre détectées                          │   │
│ │ - Hypothèses formulées                              │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MOTEUR DE GÉNÉRATION DE PROTOCOLE                   │   │
│ │ - Choix des référents                                │   │
│ │ - Génération des questions fondamentales             │   │
│ │ - Génération des questions ciblées                  │   │
│ │ - Personnalisation par profil                        │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ CAPACITÉS REFERENCE INTELLIGENCE                     │   │
│ │ - Guide de Prise de Références Expert               │   │
│ │ - Scoring de Cohérence Référence / Entretien        │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ ANALYSE DES RÉPONSES                                │   │
│ │ - Détection des signaux positifs                    │   │
│ │ - Détection des signaux de vigilance                │   │
│ │ - Détection des signaux d'alerte                    │   │
│ │ - Scoring de cohérence                             │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ INTERFACE UTILISATEUR                              │   │
│ │ - Protocole de prise de références                 │   │
│ │ - Guide d'analyse                                  │   │
│ │ - Scoring de cohérence                             │   │
│ │ - Recommandations d'action                         │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-013 Interview Intelligence :**
- Utilisation des données d'entretien pour générer les questions ciblées
- Utilisation des zones d'ombre détectées pour personnaliser le protocole

**MVP-014 Soft Skills Intelligence :**
- Intégration de l'analyse des soft skills dans les questions de références
- Comparaison des soft skills déclarées vs observées vs références

**MVP-015 Debrief Expert :**
- Intégration du scoring de cohérence dans le debriefing
- Enrichissement du debriefing avec les données de références

**MVP-016 Interview Simulator :**
- Utilisation du protocole de références dans le mode 2 (formation recruteur)
- Entraînement des recruteurs à la prise de références expert

---

## 7. Structure de Données (TypeScript)

```typescript
interface ReferenceIntelligence {
  candidateId: string;
  interviewId: string;
  generatedAt: Date;
  
  protocol: ReferenceProtocol;
  analysis?: ReferenceAnalysis;
  coherenceScoring?: CoherenceScoring;
}

interface ReferenceProtocol {
  protocolId: string;
  candidateId: string;
  generatedAt: Date;
  
  recommendedReferees: RecommendedReferee[];
  avoidedReferees: string[];
  
  fundamentalQuestions: ReferenceQuestion[];
  targetedQuestions: ReferenceQuestion[];
  
  analysisGuide: AnalysisGuide;
}

interface RecommendedReferee {
  type: 'manager' | 'peer' | 'subordinate' | 'client';
  priority: 'mandatory' | 'recommended' | 'optional';
  relationship: string;
  contactPeriod: string;
}

interface ReferenceQuestion {
  questionId: string;
  question: string;
  category: 'fundamental' | 'targeted';
  targetArea?: string;
  expectedSignals: string[];
}

interface AnalysisGuide {
  positiveSignals: Signal[];
  vigilanceSignals: Signal[];
  alertSignals: Signal[];
}

interface Signal {
  type: string;
  description: string;
  examples: string[];
}

interface ReferenceAnalysis {
  analysisId: string;
  protocolId: string;
  candidateId: string;
  analyzedAt: Date;
  
  refereeResponses: RefereeResponse[];
  
  overallAnalysis: {
    positiveSignals: string[];
    vigilanceSignals: string[];
    alertSignals: string[];
    overallAssessment: 'positive' | 'cautious' | 'negative';
  };
}

interface RefereeResponse {
  refereeId: string;
  refereeName: string;
  refereeRelationship: string;
  
  responses: {
    questionId: string;
    answer: string;
    signals: string[];
  }[];
  
  overallSignals: string[];
}

interface CoherenceScoring {
  scoringId: string;
  candidateId: string;
  interviewId: string;
  scoredAt: Date;
  
  coherenceScore: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  
  divergences: Divergence[];
  
  recommendation: {
    complementaryInterview: boolean;
    focusAreas: string[];
    riskLevel: 'minor' | 'significant' | 'blocking';
  };
}

interface Divergence {
  area: string;
  candidateStatement: string;
  refereeStatement: string;
  severity: 'minor' | 'significant' | 'blocking';
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Protocoles générés / candidats en finale | ≥ 90% |
| Taux de complétion | Références complétées / protocoles générés | ≥ 80% |
| Taux de détection d'alertes | Alertes détectées / références analysées | ≥ 15% |
| Satisfaction recruteur | Satisfaction avec le protocole | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de cohérence élevée | Cohérence élevée / total | ≥ 70% |
| Réduction des mauvais recrutements | Réduction après utilisation | ≥ 25% |
| Amélioration de la qualité des embauches | Performance à 1 an | ≥ 20% |

---

## 9. Documents du Module

- **DOC-020-01** : Brief du Module (ce document)
- **DOC-020-02** : Guide de Prise de Références Expert
- **DOC-020-03** : Scoring de Cohérence Référence / Entretien

---

## 10. Conclusion

MVP-020 Reference Intelligence transforme la prise de références d'une formalité administrative en un outil d'investigation structuré. Le module génère un protocole de prise de références personnalisé avec choix des référents, questions calibrées, analyse des réponses, et scoring de cohérence entre références et entretien. Ce module s'intègre avec les modules existants (Interview Intelligence, Soft Skills Intelligence, Debrief Expert, Interview Simulator) pour enrichir le processus de recrutement.

**Points clés :**
- 2 capacités principales : Guide de Prise de Références Expert, Scoring de Cohérence
- Choix intelligent des référents (manager, pair, subordonné, client)
- Questions fondamentales et ciblées sur les zones d'ombre
- Analyse des signaux (positifs, vigilance, alerte)
- Scoring de cohérence entre références et entretien
- Recommandations d'action (entretien complémentaire, niveau de risque)
- Intégration avec les modules existants
