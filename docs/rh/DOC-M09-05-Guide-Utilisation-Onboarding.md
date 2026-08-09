# DOC-M09-05 : Guide d'Utilisation pour l'Onboarding

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le guide d'utilisation pour l'onboarding basé sur l'analyse des décalages pour le MVP-META-09 Gap Detection Engine. Ce document structure les actions adaptées à qui le candidat est vraiment, plutôt qu'à ce qu'il prétend être.

---

## 2. Principe Fondateur

L'onboarding doit être adapté à la réalité du candidat, pas à son auto-présentation. Le guide fournit des actions concrètes pour chaque type de décalage détecté, permettant au manager de gérer les attentes et d'optimiser l'intégration.

---

## 3. Recommandations par Type de Décalage

### 3.1 Décalage Leadership

**Si le candidat se présente comme un leader mais est en réalité un bon exécutant :**

**Actions d'onboarding :**
- Clarifier explicitement le rôle d'exécution
- Ne pas promettre de rôle de leadership rapide
- Fournir un cadre structuré avec des objectifs clairs
- Mettre en place un management de proximité
- Définir un chemin de progression réaliste

**Communication avec le candidat :**
- "Votre rôle sera d'exécuter les décisions stratégiques prises par l'équipe de direction."
- "Nous valorisons votre capacité à exécuter efficacement dans un cadre structuré."
- "La progression vers des responsabilités de leadership se fera progressivement."

**À éviter :**
- Promettre des responsabilités de leadership immédiates
- Laisser croire que le poste inclut la prise de décision stratégique
- Minimiser l'importance du rôle d'exécution

---

### 3.2 Décalage Autonomie

**Si le candidat déclare aimer l'autonomie mais a besoin de structure :**

**Actions d'onboarding :**
- Fournir un cadre structuré avec des processus clairs
- Définir des objectifs précis et mesurables
- Mettre en place des points de réguliers avec le manager
- Clarifier les attentes de management
- Documenter les processus et les procédures

**Communication avec le candidat :**
- "Nous avons des processus établis pour garantir la qualité et l'efficacité."
- "Vous aurez des objectifs clairs et des points de réguliers avec votre manager."
- "L'autonomie s'acquiert progressivement avec la maîtrise des processus."

**À éviter :**
- Laisser le candidat sans cadre ni objectifs
- Promettre une autonomie totale dès le début
- Minimiser l'importance des processus

---

### 3.3 Décalage Ambition

**Si le candidat déclare une forte ambition mais préfère le confort du statu quo :**

**Actions d'onboarding :**
- Définir des objectifs progressifs et réalistes
- Mettre en place un plan de développement personnel
- Encourager les initiatives proactives
- Créer des opportunités de progression claires
- Suivre régulièrement les progrès

**Communication avec le candidat :**
- "Nous avons un plan de développement personnalisé pour vous aider à progresser."
- "Les opportunités de progression sont claires et accessibles."
- "Nous valorisons les initiatives proactives."

**À éviter :**
- Promettre une progression rapide sans plan concret
- Laisser le candidat sans objectifs de progression
- Minimiser l'importance de l'ambition

---

### 3.4 Décalage Motivation

**Si le candidat déclare une motivation intrinsèque mais est motivé par des facteurs extrinsèques :**

**Actions d'onboarding :**
- Clarifier la rémunération et les avantages dès le début
- Définir un plan de rémunération transparent
- Mettre en place des objectifs de performance liés à la rémunération
- Communiquer régulièrement sur les opportunités d'augmentation
- Équilibrer les facteurs intrinsèques et extrinsèques

**Communication avec le candidat :**
- "La rémunération est alignée sur la performance et les objectifs."
- "Nous avons un plan de rémunération transparent et équitable."
- "Les opportunités d'augmentation sont claires et accessibles."

**À éviter :**
- Promettre une rémunération supérieure sans lien avec la performance
- Minimiser l'importance de la rémunération
- Laisser le candidat sans visibilité sur la rémunération

---

### 3.5 Décalage Conflit

**Si le candidat déclare tolérer le conflit mais l'évite :**

**Actions d'onboarding :**
- Former le candidat à la gestion des conflits
- Mettre en place un processus de résolution de conflits
- Encourager la communication directe et transparente
- Fournir des outils et des ressources pour gérer les conflits
- Suivre régulièrement les situations de conflit

**Communication avec le candidat :**
- "Nous valorisons la communication directe et transparente."
- "Nous avons un processus de résolution de conflits clair et efficace."
- "Nous vous formerons à la gestion des conflits."

**À éviter :**
- Laisser le candidat sans formation ni outils
- Minimiser l'importance de la gestion des conflits
- Encourager l'évitement des conflits

---

## 4. Structure de Données (TypeScript)

```typescript
interface OnboardingGuide {
  guideId: string;
  recruitmentId: string;
  candidateId: string;
  
  recommendations: {
    leadership: {
      detected: boolean;
      level: 'light' | 'moderate' | 'strong';
      actions: string[];
      communication: string[];
      avoid: string[];
    };
    autonomy: {
      detected: boolean;
      level: 'light' | 'moderate' | 'strong';
      actions: string[];
      communication: string[];
      avoid: string[];
    };
    ambition: {
      detected: boolean;
      level: 'light' | 'moderate' | 'strong';
      actions: string[];
      communication: string[];
      avoid: string[];
    };
    motivation: {
      detected: boolean;
      level: 'light' | 'moderate' | 'strong';
      actions: string[];
      communication: string[];
      avoid: string[];
    };
    conflict: {
      detected: boolean;
      level: 'light' | 'moderate' | 'strong';
      actions: string[];
      communication: string[];
      avoid: string[];
    };
  };
  
  overallStrategy: {
    selfPresentation: string;
    actualObservation: string;
    nuance: 'critical' | 'important' | 'minor';
    keyActions: string[];
    timeline: string[];
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

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE onboarding_guide (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  recommendations JSON NOT NULL,
  overall_strategy JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_onboarding_guide_recruitment ON onboarding_guide(recruitment_id);
CREATE INDEX idx_onboarding_guide_candidate ON onboarding_guide(candidate_id);
```

---

## 6. API Endpoints

```typescript
// POST /api/onboarding-guide/generate
async function generateOnboardingGuide(recruitmentId: string, candidateId: string): Promise<OnboardingGuide> {
  return await generateOnboardingGuide(recruitmentId, candidateId);
}

// GET /api/onboarding-guide/:guideId
async function getOnboardingGuide(guideId: string): Promise<OnboardingGuide> {
  return await getOnboardingGuide(guideId);
}

// GET /api/onboarding-guide/recruitment/:recruitmentId
async function getOnboardingGuideByRecruitment(recruitmentId: string): Promise<OnboardingGuide> {
  return await getOnboardingGuideByRecruitment(recruitmentId);
}

// PUT /api/onboarding-guide/:guideId
async function updateOnboardingGuide(guideId: string, updates: any): Promise<OnboardingGuide> {
  return await updateOnboardingGuide(guideId, updates);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation du guide | Guides utilisés / recrutements | ≥ 90% |
- Taux de suivi des recommandations | Recommandations suivies / totales | ≥ 80% |

### 7.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de rétention à 6 mois | Rétention / totaux | ≥ 85% |
- Satisfaction des managers | Score moyen / 5 | ≥ 4/5 |

---

## 8. Exemple Complet

```markdown
GUIDE D'ONBOARDING

Candidat : [Anonymisé]
Recrutement : REC-2026-001
Date : 2026-08-04

RECOMMANDATIONS PAR DÉCALAGE

DÉCALAGE LEADERSHIP (Modéré)
Actions :
→ Clarifier explicitement le rôle d'exécution
→ Ne pas promettre de rôle de leadership rapide
→ Fournir un cadre structuré avec des objectifs clairs
→ Mettre en place un management de proximité
→ Définir un chemin de progression réaliste

Communication :
→ "Votre rôle sera d'exécuter les décisions stratégiques prises par l'équipe de direction."
→ "Nous valorisons votre capacité à exécuter efficacement dans un cadre structuré."

À éviter :
→ Promettre des responsabilités de leadership immédiates
→ Laisser croire que le poste inclut la prise de décision stratégique

DÉCALAGE AUTONOMIE (Léger)
Actions :
→ Fournir un cadre structuré avec des processus clairs
→ Définir des objectifs précis et mesurables
→ Mettre en place des points de réguliers avec le manager

Communication :
→ "Nous avons des processus établis pour garantir la qualité et l'efficacité."
→ "Vous aurez des objectifs clairs et des points de réguliers avec votre manager."

À éviter :
→ Laisser le candidat sans cadre ni objectifs
→ Promettre une autonomie totale dès le début

STRATÉGIE GLOBALE
Auto-présentation : Leader autonome et ambitieux
Observation réelle : Bon exécutant dans un cadre structuré
Nuance : Importante

Actions clés :
→ Clarifier le rôle d'exécution dès le début
→ Fournir un cadre structuré avec des objectifs clairs
→ Mettre en place un management de proximité
→ Définir un chemin de progression réaliste

Timeline :
→ Semaine 1 : Clarification du rôle et des attentes
→ Semaine 2 : Mise en place du management de proximité
→ Mois 1 : Évaluation des premiers résultats
→ Mois 3 : Révision du plan de progression
```

---

## 9. Conclusion

Le guide d'utilisation pour l'onboarding structure les actions adaptées à la réalité du candidat. Recommandations par type de décalage : Leadership (clarifier rôle d'exécution, management de proximité), Autonomie (cadre structuré, objectifs clairs), Ambition (plan de développement, progression progressive), Motivation (rémunération transparente, objectifs performance), Conflit (formation gestion conflits, processus résolution). Chaque section inclut actions, communication, et à éviter. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Recommandations par type de décalage
- Actions concrètes pour chaque décalage
- Communication adaptée à la réalité
- À éviter pour chaque décalage
- Stratégie globale avec timeline
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'utilisation et d'impact
