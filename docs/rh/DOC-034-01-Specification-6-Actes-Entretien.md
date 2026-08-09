# DOC-034-01 : Spécification Complète des 6 Actes de l'Entretien

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la spécification complète des 6 actes de l'entretien pour MVP-034 Interview Orchestrator. Ce document structure l'orchestration complète d'un entretien de recrutement, du pré-entretien au post-entretien, avec des objectifs précis, des séquences orchestrées, et des transitions automatiques.

---

## 2. Principe Fondateur

Un entretien n'est pas une liste de questions. C'est un voyage en 6 actes avec un début, un développement, des rebondissements, un climax et une conclusion. Chaque acte a un objectif précis. Chaque transition est une décision. Chaque adaptation est une intelligence. Le moteur orchestre ce voyage.

---

## 3. Architecture des 6 Actes

### 3.1 Acte 0 — Pré-Entretien

**Durée :** 15 à 30 minutes avant l'entretien

**Objectifs :**
- Ingestion et analyse des documents
- Génération du plan d'entretien personnalisé
- Briefing du recruteur

**Phase 0.1 — Ingestion et Analyse des Documents**

**Documents ingérés :**
- CV du candidat
- Fiche de poste
- Annonce publiée
- Dossier de candidature complet
- Notes du premier filtre téléphonique (si existant)
- Résultats de tests si passés
- Informations sur l'équipe cible
- Profil du manager si fourni
- Culture et valeurs de l'entreprise
- Contexte du recrutement (remplacement / création / urgence)

**Analyse produite :**
- Scoring initial du profil (réf. MVP-007)
- Zones de force identifiées
- Zones de vigilance identifiées
- Zones d'ombre à explorer
- Hypothèses à vérifier

**Phase 0.2 — Génération du Plan d'Entretien**

**Le plan contient :**
- Type d'entretien identifié (voir section Types d'Entretien)
- Durée totale recommandée (30 / 45 / 60 / 90 minutes)
- Répartition du temps par acte
- Objectifs par acte
- 5 questions incontournables spécifiques
- 3 questions de déstabilisation calibrées
- Signaux à surveiller
- Critères de décision

**Phase 0.3 — Briefing du Recruteur**

**Format :** 1 page

**Contenu :**
- Candidat : [Prénom]
- Poste : [Intitulé]
- Durée : [X] minutes
- En 3 mots : [profil en 3 mots]
- Force principale : [1 ligne]
- Vigilance principale : [1 ligne]
- Zone d'ombre critique : [1 ligne]
- Question N°1 à ne pas manquer : [Question]
- Ce qui ferait dire oui : [3 critères]
- Ce qui ferait dire non : [3 signaux éliminatoires]

---

### 3.2 Acte 1 — Ouverture

**Durée :** 5 à 10% du temps total

**Objectifs :**
- Créer un cadre de confiance
- Présenter le déroulé de l'entretien
- Observer le candidat en mode naturel
- Calibrer le niveau d'aise initial
- Poser les bases de la relation

**Séquence 1.1 — Accueil et Installation**

**Ce que le recruteur fait :**
- Accueillir chaleureusement
- Proposer eau / café
- S'installer

**Ce que le moteur observe :**
- Niveau d'aise du candidat
- Comportement spontané
- Premier contact non verbal décrit par le recruteur

**Séquence 1.2 — Présentation du Cadre**

**Script suggéré par le moteur :**
```
Merci d'être là.
Voici comment je propose de conduire cet entretien.
Nous allons passer [X] minutes ensemble.
Je vais vous poser des questions sur votre parcours et vos expériences.
Vous aurez également du temps pour me poser vos questions.
Il n'y a pas de bonnes ou mauvaises réponses.
Je cherche à vous connaître vraiment.
Des questions avant de commencer ?
```

**Séquence 1.3 — Question Brise-Glace**

**Le moteur sélectionne une question d'ouverture adaptée au profil :**

**Pour un profil junior :**
```
Parlez-moi de vous.
Qu'est-ce qui vous a amené à postuler pour ce poste ?
```

**Pour un profil senior :**
```
Vous avez un parcours intéressant.
Quelle est la décision de carrière dont vous êtes le plus fier ?
```

**Pour un profil atypique :**
```
Votre parcours est original.
Racontez-moi comment vous avez construit votre trajectoire.
```

**Analyse dans l'Acte 1 :**
- Niveau d'aise : Très à l'aise / Standard / Stressé / Très stressé
- Style de communication : Direct / Réservé / Expansif / Précis
- Premier signal émotionnel dominant
- Adaptation recommandée pour l'Acte 2

**Transition vers Acte 2 :**
- Automatique quand le candidat a eu l'opportunité de se présenter
- Le recruteur a calibré le niveau d'aise
- Le cadre de confiance est établi
- Signal de transition pour le recruteur : "Acte 1 complet. Passer à l'exploration."

---

### 3.3 Acte 2 — Exploration du Parcours

**Durée :** 25 à 30% du temps total

**Objectifs :**
- Comprendre la trajectoire réelle
- Valider les compétences clés
- Identifier les patterns de comportement
- Détecter les signaux positifs et vigilances
- Construire une image cohérente du parcours

**Séquence 2.1 — Exploration Chronologique Ciblée**

**Le moteur identifie les 3 expériences les plus pertinentes pour ce poste et orchestre leur exploration.**

**Pour chaque expérience ciblée :**
- Question d'ouverture de l'expérience
- Questions de creusage si nécessaire
- Questions de validation des compétences
- Cotation en temps réel (réf. MVP-014)
- Signaux détectés et alertes

**Séquence 2.2 — Exploration des Transitions**

**Les transitions entre postes révèlent souvent plus que les postes eux-mêmes.**

**Pour chaque transition :**
```
Qu'est-ce qui vous a fait quitter X ?
Qu'est-ce qui vous a attiré vers Y ?
Si c'était à refaire ?
```

**Le moteur analyse :**
- Cohérence de la trajectoire
- Motivations réelles vs déclarées
- Pattern de décision de carrière

**Séquence 2.3 — Validation des Compétences Clés**

**Pour chaque compétence critique du poste :**
- Question STAR ciblée
- Validation de la preuve
- Cotation de la compétence
- Décision : suffisamment éclairci ou besoin de creuser

**Gestion Dynamique de l'Acte 2 :**
- Si une expérience révèle quelque chose d'important non prévu → Le moteur adapte le plan
- Il propose d'approfondir ou de passer à autre chose
- Le recruteur décide

**Tableau de Bord Acte 2 :**
- Compétences validées : [liste avec score]
- Compétences à valider : [liste restante]
- Signaux détectés : [liste]
- Temps écoulé / restant : [X/Y minutes]
- Recommandation : Continuer / Accélérer / Approfondir tel point

**Transition vers Acte 3 :**
- Automatique quand les compétences clés sont suffisamment éclairées
- Le parcours est compris dans ses grandes lignes
- Signal de transition : "Parcours exploré. Passer à l'approfondissement."

---

### 3.4 Acte 3 — Approfondissement

**Durée :** 30 à 35% du temps total  
**C'est le cœur de l'entretien.**

**Objectifs :**
- Explorer les soft skills en profondeur
- Évaluer la personnalité professionnelle
- Tester les valeurs et motivations réelles
- Évaluer le culture fit
- Explorer le potentiel long terme

**Séquence 3.1 — Exploration des Soft Skills**

**Le moteur sélectionne les 4 soft skills les plus critiques pour CE poste (parmi les 12 de MVP-014) et orchestre leur exploration.**

**Pour chaque soft skill :**
- Question comportementale STAR ciblée
- Analyse de la réponse en temps réel
- Rebond intelligent si nécessaire (réf. MVP-032)
- Cotation avec justification

**Séquence 3.2 — Exploration des Motivations Profondes**

**Questions projectionnelles :**
```
Dans 5 ans, qu'est-ce que vous voulez avoir accompli ?
Qu'est-ce qui vous ferait quitter ce poste si vous l'obtenez ?
Quel est l'environnement dans lequel vous donnez le meilleur de vous-même ?
Qu'est-ce que vos meilleurs amis diraient de vous professionnellement ?
```

**Analyse :**
- Cohérence motivation / poste
- Cohérence motivation / culture
- Risque de désengagement identifié

**Séquence 3.3 — Exploration du Culture Fit**

**Questions sur les environnements passés :**
```
Décrivez le manager idéal pour vous.
Dans quel type d'équipe avez-vous le mieux travaillé ? Le moins bien ?
Comment décririez-vous la culture idéale pour vous ?
```

**Analyse :**
- Compatibilité avec la culture réelle
- Compatibilité avec le manager
- Signaux d'incompatibilité potentielle

**Séquence 3.4 — Exploration du Potentiel**

**Pour les postes à fort enjeu :**

**Questions sur l'apprentissage :**
```
Qu'avez-vous appris tout seul récemment ? Comment ?
```

**Questions sur l'initiative :**
```
Donnez-moi un exemple où vous avez agi sans qu'on vous le demande.
```

**Questions sur la vision :**
```
Si vous obteniez ce poste, quelles seraient vos priorités dans les 90 premiers jours ?
```

**Gestion Dynamique de l'Acte 3 :**

**Le moteur surveille en temps réel :**
- Si un soft skill révèle quelque chose d'inhabituel → Alerte au recruteur, suggestion : creuser davantage
- Si une incohérence apparaît → Alerte immédiate, question de clarification suggérée
- Si le temps manque → Priorisation des points restants, suggestion : quoi couvrir, quoi couper

**Tableau de Bord Acte 3 :**
- Soft skills évalués : [liste avec scores]
- Motivations clarifiées : [oui / partiellement / non]
- Culture fit évalué : [oui / partiellement / non]
- Tensions détectées : [liste si existantes]
- Temps restant pour Acte 4 : [X minutes]

**Transition vers Acte 4 :**
- Signal de transition : "Approfondissement complet. Passer au challenge."

---

### 3.5 Acte 4 — Challenge & Stress Test

**Durée :** 20 à 25% du temps total

**Objectifs :**
- Tester la réaction sous pression
- Explorer les zones d'ombre identifiées
- Vérifier la cohérence sous stress
- Évaluer la résilience réelle
- Clarifier les points ambigus restants

**Séquence 4.1 — Questions Difficiles Ciblées**

**Le moteur génère les questions difficiles basées sur les zones d'ombre identifiées pendant l'Acte 2 et 3.**

**Questions sur les échecs :**
```
Parlez-moi de votre plus grand échec professionnel. Qu'avez-vous fait ?
Quelle décision professionnelle regrettez-vous le plus ?
```

**Questions sur les faiblesses :**
```
Quelle est votre plus grande faiblesse ? Comment la compensez-vous ?
Qu'est-ce qu'un manager qui ne vous aime pas dirait de vous ?
```

**Questions sur les conflits :**
```
Racontez-moi un conflit professionnel difficile. Comment l'avez-vous géré ? Quel en a été le résultat ?
```

**Séquence 4.2 — Exploration des Zones d'Ombre**

**Le moteur identifie les points non clarifiés ou ambigus pendant les Actes 2 et 3.**

**Pour chaque zone d'ombre :**
- Question de clarification directe
- Niveau de challenge adapté au profil
- Reformulation si la réponse est évasive

**Séquence 4.3 — Questions de Déstabilisation**

**Calibrées et bienveillantes. Jamais agressives. Toujours professionnelles.**

**Exemples selon le niveau :**

**Junior :**
```
Si je vous donnais ce poste demain, quelle serait votre première peur ?
```

**Confirmé :**
```
Qu'est-ce que vos anciens collègues vous reprochent le plus souvent ?
```

**Senior :**
```
Pourquoi devrais-je vous choisir vous plutôt qu'un candidat avec 5 ans d'expérience de plus ?
```

**Expert :**
```
Quelle est la décision professionnelle la plus difficile que vous ayez prise ? Referiez-vous la même chose aujourd'hui ?
```

**Séquence 4.4 — Cas Pratique si Pertinent**

**Pour certains postes :**
- Mise en situation courte
- Cas business à analyser
- Problème à résoudre en direct

**Ce que le moteur orchestre :**
- Présentation du cas
- Temps de réflexion alloué
- Grille d'évaluation de la réponse
- Questions de creusage sur le raisonnement

**Gestion Dynamique de l'Acte 4 :**

**Calibration du niveau de challenge :**
- Si le candidat répond facilement → Augmenter le niveau de challenge
- Si le candidat est déstabilisé → Réduire et recentrer
- Si le candidat se ferme → Pause et désescalade

**Ce que le moteur analyse :**
- Maintien de la cohérence sous pression
- Qualité de la réaction au stress
- Capacité à assumer ses failles
- Authenticité sous pression

**Tableau de Bord Acte 4 :**
- Zones d'ombre clarifiées : [liste]
- Zones d'ombre résiduelles : [liste]
- Réaction sous pression : [analyse]
- Incohérences détectées : [liste si existantes]
- Score de résilience : [1 à 5]

**Transition vers Acte 5 :**
- Signal de transition : "Challenge complet. Passer à la clôture."

---

### 3.6 Acte 5 — Clôture

**Durée :** 5 à 10% du temps total

**Objectifs :**
- Donner la parole au candidat
- Observer ses vraies questions
- Conclure la relation positivement
- Informer sur les suites
- Collecter les dernières observations

**Séquence 5.1 — Questions du Candidat**

```
Avez-vous des questions pour moi ?
```

**Ce que le moteur analyse :**
- Qualité des questions posées
- Ce que les questions révèlent sur les vraies motivations
- Absence de questions → Signaux potentiels

**Analyse des Questions du Candidat :**

**Questions sur le poste et les missions :**
- Motivation pour le contenu
- Sérieux de la préparation
- Signal : positif

**Questions sur l'équipe et le manager :**
- Intelligence relationnelle
- Importance du contexte humain
- Signal : très positif

**Questions sur les opportunités d'évolution :**
- Ambition et projection long terme
- Signal : positif si cohérent

**Questions uniquement sur le salaire et les avantages :**
- Motivation extrinsèque dominante
- Signal : vigilance

**Aucune question :**
- Désintérêt potentiel
- Ou préparation insuffisante
- Ou timidité excessive
- Signal : à interpréter avec nuance

**Séquence 5.2 — Information sur les Suites**

**Script suggéré :**
```
Voici comment le processus se déroule.
[Étapes suivantes]
Vous aurez une réponse de notre part d'ici [délai].
Avez-vous d'autres processus en cours que nous devrions prendre en compte ?
```

**Ce que le moteur analyse dans la réponse sur les autres processus :**
- Attractivité du candidat sur le marché
- Urgence de décision de notre côté
- Risque de contre-offre

**Séquence 5.3 — Clôture Relationnelle**

**Script suggéré :**
```
Merci pour cet échange.
J'ai vraiment apprécié [élément sincère et spécifique].
La suite très bientôt.
```

**Séquence 5.4 — Notation Finale Immédiate**

**Dans les 2 minutes après le départ du candidat :**
- Le recruteur note son impression globale immédiate (avant que la mémoire s'efface)
- Impression globale : [1 à 10]
- Un mot qui résume : [mot]
- Ce que j'ai aimé : [1 ligne]
- Ce qui m'interroge : [1 ligne]

**Cette note immédiate est précieuse car elle capture l'émotion brute avant la rationalisation.**

---

### 3.7 Acte 6 — Post-Entretien Immédiat

**Durée :** 10 à 15 minutes après l'entretien

**Objectifs :**
- Produire le debrief complet
- Comparer impression / analyse
- Formuler la recommandation
- Préparer la communication candidat
- Alimenter la mémoire institutionnelle

**Séquence 6.1 — Génération du Debrief**

**Le moteur produit automatiquement le debrief complet (réf. MVP-015) basé sur :**
- Toutes les cotations en temps réel
- Tous les signaux détectés
- La cartographie conversationnelle
- La note immédiate du recruteur
- Les patterns de la mémoire institutionnelle

**Séquence 6.2 — Comparaison Impression / Analyse**

**Confrontation entre :**
- L'impression immédiate du recruteur
- L'analyse structurée du moteur

**Si concordance :**
- Signal de cohérence

**Si divergence significative :**
- Le moteur explique la divergence
- Lequel des deux prendre en compte ?
- Réflexion guidée pour le recruteur

**Séquence 6.3 — Recommandation Finale**

**Le moteur produit sa recommandation avec :**
- Le niveau de confiance
- La cartographie d'incertitude (réf. MVP-030)

**Séquence 6.4 — Préparation de la Communication**

**Si recommandé :**
- Email de confirmation de suite
- Points à valoriser pour maintenir l'intérêt du candidat

**Si refusé :**
- Feedback personnalisé et respectueux
- Formulé par le moteur
- Validé par le recruteur avant envoi

**Si dossier à approfondir :**
- Plan du prochain round
- Points spécifiques à explorer
- Intervenant recommandé pour le round 2

---

## 4. Structure de Données (TypeScript)

```typescript
interface InterviewAct {
  actNumber: number;
  actName: string;
  durationPercentage: number;
  
  objectives: string[];
  
  sequences: {
    sequenceNumber: number;
    sequenceName: string;
    description: string;
    recruiterActions: string[];
    engineActions: string[];
    suggestedScripts?: string[];
  }[];
  
  analysis: {
    whatEngineAnalyzes: string[];
    metrics: string[];
  };
  
  transition: {
    automaticTrigger: string[];
    manualSignal: string;
  };
  
  dashboard: {
    metrics: string[];
    recommendations: string[];
  };
}

interface InterviewOrchestration {
  orchestrationId: string;
  interviewId: string;
  
  acts: {
    act0: InterviewAct;
    act1: InterviewAct;
    act2: InterviewAct;
    act3: InterviewAct;
    act4: InterviewAct;
    act5: InterviewAct;
    act6: InterviewAct;
  };
  
  currentAct: number;
  
  timeline: {
    totalDuration: number;
    actDurations: {
      act0: number;
      act1: number;
      act2: number;
      act3: number;
      act4: number;
      act5: number;
      act6: number;
    };
  };
  
  metadata: {
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    status: 'not_started' | 'in_progress' | 'completed';
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE interview_act_specification (
  id VARCHAR(36) PRIMARY KEY,
  act_number INT NOT NULL,
  act_name VARCHAR(50) NOT NULL,
  duration_percentage DECIMAL(5,2) NOT NULL,
  
  objectives JSON NOT NULL,
  sequences JSON NOT NULL,
  analysis JSON NOT NULL,
  transition JSON NOT NULL,
  dashboard JSON NOT NULL,
  
  UNIQUE KEY idx_interview_act (act_number)
);

CREATE TABLE interview_orchestration (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  
  acts JSON NOT NULL,
  current_act INT NOT NULL,
  timeline JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview(id)
);

CREATE INDEX idx_interview_orchestration_interview ON interview_orchestration(interview_id);
CREATE INDEX idx_interview_orchestration_status ON interview_orchestration((metadata->>'$.status'));
```

---

## 6. API Endpoints

```typescript
// GET /api/interview/acts/specification
async function getInterviewActsSpecification(): Promise<InterviewAct[]> {
  return await getInterviewActsSpecification();
}

// POST /api/interview/orchestration/start
async function startInterviewOrchestration(interviewId: string): Promise<InterviewOrchestration> {
  return await startInterviewOrchestration(interviewId);
}

// PUT /api/interview/orchestration/:orchestrationId/act/:actNumber
async function transitionToAct(orchestrationId: string, actNumber: number): Promise<InterviewOrchestration> {
  return await transitionToAct(orchestrationId, actNumber);
}

// GET /api/interview/orchestration/:orchestrationId/dashboard/:actNumber
async function getActDashboard(orchestrationId: string, actNumber: number): Promise<any> {
  return await getActDashboard(orchestrationId, actNumber);
}

// POST /api/interview/orchestration/:orchestrationId/complete
async function completeInterviewOrchestration(orchestrationId: string): Promise<InterviewOrchestration> {
  return await completeInterviewOrchestration(orchestrationId);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques d'Orchestration

| Métrique | Description | Cible |
|----------|-------------|-------|
| Respect du tempo | Temps réel / temps planifié | ± 10% |
- Transitions automatiques | Transitions auto / total | ≥ 80% |
- Couverture des objectifs | Objectifs atteints / total | ≥ 90% |

### 7.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Satisfaction recruteur | Note moyenne | ≥ 4.5/5 |
- Satisfaction candidat | Note moyenne | ≥ 4.0/5 |
- Cohérence impression / analyse | Concordance / total | ≥ 75% |

---

## 8. Conclusion

La spécification complète des 6 actes de l'entretien structure l'orchestration complète d'un entretien de recrutement, du pré-entretien au post-entretien. Chaque acte a des objectifs précis, des séquences orchestrées, et des transitions automatiques. Le moteur adapte dynamiquement l'entretien en fonction des réponses du candidat et du temps restant.

**Points clés :**
- 6 actes structurés (Pré-entretien, Ouverture, Exploration, Approfondissement, Challenge, Clôture, Post-entretien)
- Objectifs précis par acte
- Séquences orchestrées avec scripts suggérés
- Analyse en temps réel des réponses
- Transitions automatiques et manuelles
- Tableaux de bord par acte
- Gestion dynamique du temps
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'orchestration et de qualité
