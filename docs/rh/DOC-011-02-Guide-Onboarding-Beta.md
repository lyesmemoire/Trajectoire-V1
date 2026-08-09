# DOC-011-02 : Guide d'Onboarding Beta

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le guide d'onboarding pour les 5 beta recruteurs de MVP-011. L'onboarding se déroule sur les semaines 1-2 du programme et vise à préparer les recruteurs à utiliser le moteur en conditions réelles.

---

## 2. Calendrier de l'Onboarding

### 2.1 Semaine 1-2 : Onboarding

**Durée :** 2 semaines  
**Format :** Session individuelle de 2h avec chaque beta  
**Fréquence :** 1 session par beta (5 sessions au total)

**Objectifs :**
- Comprendre le contexte exact du recruteur
- Documenter ses pain points actuels
- Définir ses critères de succès personnels
- Former à l'utilisation du moteur
- Installer le protocole de feedback

---

## 3. Structure de la Session d'Onboarding

### 3.1 Durée et Format

- **Durée :** 2 heures
- **Format :** Visio (Teams, Zoom, Google Meet)
- **Participants :** Beta recruteur + Product Manager + 1 membre de l'équipe technique
- **Support :** Partage d'écran pour démonstration

### 3.2 Agenda de la Session

| Temps | Activité | Responsable |
|-------|----------|-------------|
| 0:00-0:10 | Introduction et objectifs | Product Manager |
| 0:10-0:30 | Compréhension du contexte du recruteur | Product Manager |
| 0:30-0:50 | Documentation des pain points | Product Manager |
| 0:50-1:10 | Définition des critères de succès | Product Manager |
| 1:10-1:30 | Formation à l'utilisation du moteur | Équipe technique |
| 1:30-1:50 | Démonstration du moteur | Équipe technique |
| 1:50-2:00 | Installation du protocole de feedback | Product Manager |

---

## 4. Déroulement Détaillé

### 4.1 Introduction et Objectifs (10 min)

**Objectif :** Présenter le programme beta et ses objectifs.

**Contenu :**
- Présentation de Trajectoire
- Présentation du MVP-011 Beta Program
- Objectifs du programme
- Engagement du recruteur
- Engagement de Trajectoire
- Questions/réponses

**Support visuel :** Slides de présentation

---

### 4.2 Compréhension du Contexte du Recruteur (20 min)

**Objectif :** Comprendre le contexte exact du recruteur.

**Questions clés :**

**Organisation :**
- Quelle est la taille de votre organisation ?
- Quel est votre secteur d'activité ?
- Quelle est votre structure RH (équipe, outils) ?
- Combien de recrutements traitez-vous par an ?
- Quels types de postes recrutez-vous ?

**Processus actuel :**
- Comment décririez-vous votre processus de recrutement actuel ?
- Quels outils utilisez-vous (ATS, LinkedIn, etc.) ?
- Quelles sont les étapes de votre processus ?
- Combien de temps passez-vous par candidat ?
- Quels sont vos principaux défis actuels ?

**Stakeholders :**
- Qui sont vos parties prenantes internes ?
- Comment impliquez-vous les managers ?
- Comment validez-vous vos décisions ?
- Quelles sont vos contraintes organisationnelles ?

---

### 4.3 Documentation des Pain Points (20 min)

**Objectif :** Documenter les pain points actuels du recruteur.

**Méthode :** Brainstorming structuré

**Catégories de pain points :**

**Efficacité :**
- "Je passe trop de temps à trier les CV"
- "Je manque de temps pour chaque candidat"
- "Le processus est trop lent"

**Qualité :**
- "Je rate des bons candidats"
- "Je ne suis pas sûr de mes décisions"
- "J'ai du mal à évaluer les compétences techniques"

**Conformité :**
- "Je crains de manquer des critères de conformité"
- "Je dois justifier mes décisions"
- "J'ai besoin de traçabilité"

**Expérience :**
- "L'expérience candidat est importante pour moi"
- "Je veux donner du feedback aux candidats"
- "Je veux être transparent"

**Documentation :**

```typescript
interface PainPoint {
  id: string;
  category: 'efficiency' | 'quality' | 'compliance' | 'experience';
  description: string;
  impact: 'low' | 'medium' | 'high';
  frequency: 'rare' | 'occasional' | 'frequent';
  currentSolution: string;
  desiredOutcome: string;
}
```

---

### 4.4 Définition des Critères de Succès (20 min)

**Objectif :** Définir les critères de succès personnels du recruteur.

**Questions clés :**

**Efficacité :**
- "Quel gain de temps espérez-vous ?"
- "Combien de temps gagné par candidat serait un succès ?"

**Qualité :**
- "Quelle amélioration de la qualité des décisions espérez-vous ?"
- "Quel indicateur mesurerait cette amélioration ?"

**Conformité :**
- "Quelle amélioration de la conformité espérez-vous ?"
- "Quels aspects de la conformité sont critiques pour vous ?"

**Expérience :**
- "Quelle amélioration de l'expérience candidat espérez-vous ?"
- "Quels aspects de l'expérience sont prioritaires ?"

**Documentation :**

```typescript
interface SuccessCriteria {
  id: string;
  category: 'efficiency' | 'quality' | 'compliance' | 'experience';
  description: string;
  metric: string;
  target: string;
  currentBaseline: string;
  priority: 'high' | 'medium' | 'low';
}
```

---

### 4.5 Formation à l'Utilisation du Moteur (20 min)

**Objectif :** Former le recruteur à l'utilisation du moteur.

**Contenu de la formation :**

**Vue d'ensemble du système :**
- Présentation de l'architecture (MVP-001 à MVP-010)
- Explication du flux de travail
- Présentation de l'interface

**Fonctionnalités clés :**
- Import de CV (MVP-001)
- Création de fiche de poste (MVP-003)
- Matching (MVP-002)
- Recherche sémantique (MVP-005)
- Copilot (MVP-006)
- Raisonnement (MVP-007)
- Explainability (MVP-009)
- Mémoire (MVP-010)

**Bonnes pratiques :**
- Comment interpréter les recommandations
- Comment utiliser l'arbre de décision
- Comment donner du feedback au moteur
- Quand faire confiance au moteur
- Quand remettre en question le moteur

---

### 4.6 Démonstration du Moteur (20 min)

**Objectif :** Démontrer le moteur avec un cas réel.

**Scénario de démonstration :**

1. **Import d'un CV réel** du recruteur
2. **Création d'une fiche de poste** correspondante
3. **Matching** entre le CV et la fiche de poste
4. **Analyse du raisonnement** du moteur
5. **Exploration de l'arbre de décision**
6. **Utilisation du Copilot** pour poser des questions
7. **Activation de la mémoire** (si pertinent)

**Interaction :**
- Le recruteur suit la démonstration
- Le recruteur pose des questions
- Le recruteur suggère des améliorations
- Le recruteur note ce qui lui semble utile ou non

---

### 4.7 Installation du Protocole de Feedback (10 min)

**Objectif :** Installer le protocole de feedback hebdomadaire.

**Protocole de feedback :**

**Fréquence :** 1 session hebdomadaire de 1h

**Format de la session :**
- Ce qui a fonctionné
- Ce qui n'a pas fonctionné
- Ce qui manque
- Ce qui devrait changer

**Outils de feedback :**
- Template de compte-rendu de session (DOC-011-04)
- Grille d'observation terrain (DOC-011-05)
- Canal de communication (Slack, email, etc.)

**Engagement :**
- Le recruteur s'engage à assister aux sessions
- Le recruteur s'engage à donner un feedback honnête
- Trajectoire s'engage à prendre en compte le feedback

---

## 5. Documentation de l'Onboarding

### 5.1 Fiche de Profil Beta

```typescript
interface BetaProfile {
  betaId: string;
  profileType: 'grand_groupe' | 'pme' | 'cabinet' | 'chasseur' | 'manager';
  
  // Contexte
  organization: {
    size: string;
    sector: string;
    hrStructure: string;
    annualRecruitments: number;
    jobTypes: string[];
  };
  
  currentProcess: {
    description: string;
    tools: string[];
    steps: string[];
    timePerCandidate: string;
    challenges: string[];
  };
  
  stakeholders: {
    internal: string[];
    managers: string[];
    validation: string;
    constraints: string[];
  };
  
  // Pain points
  painPoints: PainPoint[];
  
  // Critères de succès
  successCriteria: SuccessCriteria[];
  
  // Onboarding
  onboardingDate: Date;
  onboardingNotes: string;
  onboardingFeedback: string;
}
```

### 5.2 Checklist d'Onboarding

| Élément | Statut | Notes |
|--------|--------|-------|
| Introduction et objectifs présentés | ☐ | |
| Contexte du recruteur compris | ☐ | |
| Pain points documentés | ☐ | |
| Critères de succès définis | ☐ | |
| Formation au moteur effectuée | ☐ | |
| Démonstration du moteur réalisée | ☐ | |
| Protocole de feedback installé | ☐ | |
| Questions du recruteur répondues | ☐ | |
| Prochaines étapes confirmées | ☐ | |

---

## 6. Support et Ressources

### 6.1 Support Technique

**Contact :** support@trajectoire.com  
**Disponibilité :** 9h-18h, lun-ven  
**Délai de réponse :** < 4 heures

**Types de support :**
- Problèmes techniques
- Questions sur l'utilisation
- Bugs et erreurs
- Demandes de fonctionnalités

### 6.2 Documentation

**Documentation disponible :**
- Guide utilisateur (en ligne)
- FAQ (en ligne)
- Vidéos tutoriel (en ligne)
- Documentation technique (en ligne)

### 6.3 Canal de Communication

**Canal principal :** Slack #beta-support  
**Canal secondaire :** Email  
**Urgences :** Téléphone

---

## 7. Préparation pour les Semaines 3-6

### 7.1 Objectifs des Semaines 3-6

- Utiliser le moteur sur des recrutements réels
- Identifier les vrais pain points
- Tester les fonctionnalités en conditions réelles
- Fournir un feedback hebdomadaire

### 7.2 Préparation du Recruteur

**Avant la semaine 3 :**
- Sélectionner 3-5 recrutements en cours
- Préparer les CV correspondants
- Préparer les fiches de poste
- Bloquer du temps pour l'utilisation du moteur
- Préparer les questions pour la première session hebdomadaire

### 7.3 Attentes

**Utilisation :**
- Utiliser le moteur sur au moins 3 recrutements
- Utiliser le moteur régulièrement (idéalement quotidiennement)
- Documenter les cas d'utilisation

**Feedback :**
- Assister aux sessions hebdomadaires
- Donner un feedback honnête et constructif
- Documenter les bugs et problèmes

---

## 8. Suivi de l'Onboarding

### 8.1 Indicateurs de Suivi

| Indicateur | Description | Cible |
|------------|-------------|-------|
| Satisfaction de l'onboarding | Satisfaction du recruteur après l'onboarding | ≥ 4/5 |
| Compréhension du moteur | Compréhension du moteur par le recruteur | ≥ 4/5 |
| Préparation pour les semaines 3-6 | Préparation du recruteur | 100% |
| Questions résolues | Questions du recruteur résolues pendant l'onboarding | 100% |

### 8.2 Feedback sur l'Onboarding

À la fin de la session d'onboarding, demander au recruteur :

- "Comment évaluez-vous cette session d'onboarding ?" (1-5)
- "Qu'avez-vous trouvé le plus utile ?"
- "Qu'auriez-vous aimé voir de plus ?"
- "Avez-vous des questions restantes ?"
- "Vous sentez-vous prêt à utiliser le moteur ?"

---

## 9. Prochaines Étapes

### 9.1 Immédiatement après l'Onboarding

- Envoyer un résumé de la session par email
- Envoyer les liens vers la documentation
- Envoyer les coordonnées de support
- Planifier la première session hebdomadaire

### 9.2 Semaine 3

- Première session hebdomadaire
- Début de l'utilisation en conditions réelles
- Premier feedback sur l'utilisation

---

## 10. Conclusion

L'onboarding est critique pour le succès du programme beta. Une bonne préparation garantit que les recruteurs sont prêts à utiliser le moteur en conditions réelles et à fournir un feedback de qualité.

**Points clés :**
- Comprendre le contexte exact du recruteur
- Documenter les pain points actuels
- Définir les critères de succès personnels
- Former à l'utilisation du moteur
- Installer le protocole de feedback
