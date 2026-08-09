# DOC-034-10 : Guide Utilisateur Complet du Chef d'Orchestre

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Fournir un guide utilisateur complet pour MVP-034 Interview Orchestrator. Ce guide explique comment utiliser le chef d'orchestre pour orchestrer des entretiens de recrutement complets, de la préparation à la synthèse, en passant par les 6 actes de l'entretien.

---

## 2. Principe Fondateur

Le chef d'orchestre est votre assistant intelligent pour les entretiens de recrutement. Il orchestre l'entretien en temps réel, vous guide à chaque étape, et vous aide à prendre des décisions éclairées basées sur l'analyse des données et les patterns de la mémoire institutionnelle.

---

## 3. Prise en Main

### 3.1 Premier Contact

**Accéder au chef d'orchestre :**
- Connectez-vous à votre espace Trajectoire
- Naviguez vers la section "Entretiens"
- Cliquez sur "Nouvel entretien"

**Premier écran :**
```
┌─────────────────────────────────────────────────────────────┐
│ NOUVEL ENTRETIEN                                          │
├─────────────────────────────────────────────────────────────┤
│ ÉTAPE 1/3 : Sélectionner le candidat                      │
│                                                             │
│ [Chercher un candidat]                                     │
│                                                             │
│ Candidats récents :                                        │
│ • Sophie Martin — Junior Developer                         │
│ • Pierre Durand — Senior Developer                         │
│ • Marie Bernard — CTO                                     │
├─────────────────────────────────────────────────────────────┤
│ [Précédent] [Suivant]                                     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Configuration de l'Entretien

**Sélectionner le type d'entretien :**
- Présélection téléphonique
- Entretien RH standard
- Entretien technique
- Entretien direction
- Entretien panel
- Entretien de cas
- Second round
- Référencement

**Sélectionner l'intervenant :**
- RH
- Manager
- Expert technique
- Direction
- Pair

**Configurer la durée :**
- 15 minutes (présélection)
- 30 minutes (standard)
- 45 minutes (standard)
- 60 minutes (standard)
- 90 minutes (technique)
- 120 minutes (direction/cas)

---

## 4. Acte 0 — Pré-Entretien

### 4.1 Ingestion des Documents

**Documents à fournir :**
- CV du candidat (obligatoire)
- Fiche de poste (obligatoire)
- Annonce publiée (recommandé)
- Dossier de candidature complet (recommandé)
- Notes du premier filtre (si applicable)
- Résultats de tests (si passés)

**Comment fournir les documents :**
- Glisser-déposer
- Parcourir les fichiers
- Importer depuis le dossier candidat

**Le moteur analyse les documents :**
- Scoring initial du profil
- Zones de force identifiées
- Zones de vigilance identifiées
- Zones d'ombre à explorer
- Hypothèses à vérifier

### 4.2 Génération du Plan d'Entretien

**Le moteur génère automatiquement le plan :**
- Type d'entretien identifié
- Durée totale recommandée
- Répartition du temps par acte
- Objectifs par acte
- 5 questions incontournables
- 3 questions de déstabilisation
- Signaux à surveiller
- Critères de décision

**Personnaliser le plan (optionnel) :**
- Ajuster la durée
- Modifier la répartition du temps
- Ajouter des questions spécifiques
- Modifier les critères de décision

### 4.3 Briefing du Recruteur

**Le moteur génère le briefing en 1 page :**
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

**Lire le briefing avant d'entrer en salle :**
- Prenez 5 minutes pour lire le briefing
- Mémorisez les 3 mots-clés
- Notez la question N°1 à ne pas manquer
- Gardez les critères de décision en tête

---

## 5. Acte 1 — Ouverture

### 5.1 Accueil et Installation

**Ce que vous faites :**
- Accueillez chaleureusement le candidat
- Proposez eau / café
- Installez-vous confortablement

**Ce que le moteur observe :**
- Niveau d'aise du candidat
- Comportement spontané
- Premier contact non verbal (que vous décrivez)

**Comment décrire le premier contact :**
- Dans le tableau de bord Acte 1
- Champ "Observations non verbales"
- Exemple : "Candidat détendu, souriant, posture ouverte"

### 5.2 Présentation du Cadre

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

**Utiliser le script tel quel ou l'adapter :**
- Le script est une suggestion
- Adaptez-le à votre style
- Gardez les éléments clés

### 5.3 Question Brise-Glace

**Le moteur sélectionne une question d'ouverture adaptée :**
- Pour un profil junior
- Pour un profil senior
- Pour un profil atypique

**Poser la question :**
- Laissez le candidat répondre
- Observez le niveau d'aise
- Notez le style de communication

**Tableau de bord Acte 1 :**
- Niveau d'aise : Très à l'aise / Standard / Stressé / Très stressé
- Style de communication : Direct / Réservé / Expansif / Précis
- Signal émotionnel dominant : Positif / Neutre / Négatif / Mixte
- Adaptation recommandée pour l'Acte 2

### 5.4 Transition vers Acte 2

**Automatique quand :**
- Le candidat a eu l'opportunité de se présenter
- Vous avez calibré le niveau d'aise
- Le cadre de confiance est établi

**Signal de transition :**
- "Acte 1 complet. Passer à l'exploration."

---

## 6. Acte 2 — Exploration du Parcours

### 6.1 Exploration Chronologique Ciblée

**Le moteur identifie les 3 expériences les plus pertinentes :**
- Basées sur le poste
- Basées sur les compétences requises
- Basées sur les patterns de la mémoire institutionnelle

**Pour chaque expérience ciblée :**
- Le moteur suggère une question d'ouverture
- Vous posez la question
- Le candidat répond
- Vous notez les observations

**Questions de creusage (si nécessaire) :**
- Le moteur suggère des questions de creusage
- Basées sur les réponses du candidat
- Basées sur les zones d'ombre identifiées

### 6.2 Exploration des Transitions

**Les transitions révèlent souvent plus que les postes :**
- "Qu'est-ce qui vous a fait quitter X ?"
- "Qu'est-ce qui vous a attiré vers Y ?"
- "Si c'était à refaire ?"

**Le moteur analyse :**
- Cohérence de la trajectoire
- Motivations réelles vs déclarées
- Pattern de décision de carrière

### 6.3 Validation des Compétences Clés

**Pour chaque compétence critique du poste :**
- Le moteur suggère une question STAR ciblée
- Vous posez la question
- Le candidat répond
- Vous cotez la compétence (1-5)

**Cotation en temps réel :**
- Dans le tableau de bord Acte 2
- Compétences validées : [liste avec score]
- Compétences à valider : [liste restante]

### 6.4 Gestion Dynamique

**Si une expérience révèle quelque chose d'important :**
- Le moteur adapte le plan
- Il propose d'approfondir ou de passer à autre chose
- Vous décidez

**Tableau de bord Acte 2 :**
- Compétences validées : [liste avec score]
- Compétences à valider : [liste restante]
- Signaux détectés : [liste]
- Temps écoulé / restant : [X/Y minutes]
- Recommandation : Continuer / Accélérer / Approfondir tel point

### 6.5 Transition vers Acte 3

**Automatique quand :**
- Les compétences clés sont suffisamment éclairées
- Le parcours est compris dans ses grandes lignes

**Signal de transition :**
- "Parcours exploré. Passer à l'approfondissement."

---

## 7. Acte 3 — Approfondissement

### 7.1 Exploration des Soft Skills

**Le moteur sélectionne les 4 soft skills les plus critiques :**
- Parmi les 12 soft skills de MVP-014
- Basées sur le poste
- Basées sur les patterns de la mémoire institutionnelle

**Pour chaque soft skill :**
- Le moteur suggère une question comportementale STAR
- Vous posez la question
- Le candidat répond
- Le moteur analyse la réponse en temps réel
- Vous cotez le soft skill (1-5)

**Rebond intelligent (si nécessaire) :**
- Le moteur suggère un rebond
- Basé sur MVP-032 Conversational Intelligence
- Pour creuser davantage

### 7.2 Exploration des Motivations Profondes

**Questions projectionnelles :**
- "Dans 5 ans, qu'est-ce que vous voulez avoir accompli ?"
- "Qu'est-ce qui vous ferait quitter ce poste si vous l'obtenez ?"
- "Quel est l'environnement dans lequel vous donnez le meilleur de vous-même ?"
- "Qu'est-ce que vos meilleurs amis diraient de vous professionnellement ?"

**Le moteur analyse :**
- Cohérence motivation / poste
- Cohérence motivation / culture
- Risque de désengagement identifié

### 7.3 Exploration du Culture Fit

**Questions sur les environnements passés :**
- "Décrivez le manager idéal pour vous."
- "Dans quel type d'équipe avez-vous le mieux travaillé ? Le moins bien ?"
- "Comment décririez-vous la culture idéale pour vous ?"

**Le moteur analyse :**
- Compatibilité avec la culture réelle
- Compatibilité avec le manager
- Signaux d'incompatibilité potentielle

### 7.4 Exploration du Potentiel

**Pour les postes à fort enjeu :**
- Questions sur l'apprentissage
- Questions sur l'initiative
- Questions sur la vision

### 7.5 Gestion Dynamique

**Le moteur surveille en temps réel :**
- Si un soft skill révèle quelque chose d'inhabituel → Alerte
- Si une incohérence apparaît → Alerte + question de clarification
- Si le temps manque → Priorisation des points restants

**Tableau de bord Acte 3 :**
- Soft skills évalués : [liste avec scores]
- Motivations clarifiées : [oui / partiellement / non]
- Culture fit évalué : [oui / partiellement / non]
- Tensions détectées : [liste si existantes]
- Temps restant pour Acte 4 : [X minutes]

### 7.6 Transition vers Acte 4

**Signal de transition :**
- "Approfondissement complet. Passer au challenge."

---

## 8. Acte 4 — Challenge & Stress Test

### 8.1 Questions Difficiles Ciblées

**Le moteur génère les questions difficiles :**
- Basées sur les zones d'ombre identifiées
- Basées sur les signaux de vigilance
- Calibrées au niveau du candidat

**Questions sur les échecs :**
- "Parlez-moi de votre plus grand échec professionnel."
- "Quelle décision professionnelle regrettez-vous le plus ?"

**Questions sur les faiblesses :**
- "Quelle est votre plus grande faiblesse ?"
- "Qu'est-ce qu'un manager qui ne vous aime pas dirait de vous ?"

**Questions sur les conflits :**
- "Racontez-moi un conflit professionnel difficile."

### 8.2 Exploration des Zones d'Ombre

**Le moteur identifie les points non clarifiés :**
- Pendant les Actes 2 et 3
- Il génère des questions de clarification
- Niveau de challenge adapté au profil

### 8.3 Questions de Déstabilisation

**Calibrées et bienveillantes :**
- Jamais agressives
- Toujours professionnelles

**Exemples selon le niveau :**
- Junior : "Si je vous donnais ce poste demain, quelle serait votre première peur ?"
- Confirmé : "Qu'est-ce que vos anciens collègues vous reprochent le plus souvent ?"
- Senior : "Pourquoi devrais-je vous choisir vous plutôt qu'un candidat avec 5 ans d'expérience de plus ?"
- Expert : "Quelle est la décision professionnelle la plus difficile que vous ayez prise ?"

### 8.4 Cas Pratique (si pertinent)

**Pour certains postes :**
- Mise en situation courte
- Cas business à analyser
- Problème à résoudre en direct

**Ce que le moteur orchestre :**
- Présentation du cas
- Temps de réflexion alloué
- Grille d'évaluation de la réponse
- Questions de creusage sur le raisonnement

### 8.5 Calibration du Niveau de Challenge

**Si le candidat répond facilement :**
- Augmenter le niveau de challenge

**Si le candidat est déstabilisé :**
- Réduire et recentrer

**Si le candidat se ferme :**
- Pause et désescalade

**Tableau de bord Acte 4 :**
- Zones d'ombre clarifiées : [liste]
- Zones d'ombre résiduelles : [liste]
- Réaction sous pression : [analyse]
- Incohérences détectées : [liste si existantes]
- Score de résilience : [1 à 5]

### 8.6 Transition vers Acte 5

**Signal de transition :**
- "Challenge complet. Passer à la clôture."

---

## 9. Acte 5 — Clôture

### 9.1 Questions du Candidat

**"Avez-vous des questions pour moi ?"**

**Ce que le moteur analyse :**
- Qualité des questions posées
- Ce que les questions révèlent
- Absence de questions → Signal potentiel

**Analyse des questions :**
- Questions sur le poste et les missions → Positif
- Questions sur l'équipe et le manager → Très positif
- Questions sur les opportunités d'évolution → Positif si cohérent
- Questions uniquement sur le salaire → Vigilance
- Aucune question → À interpréter avec nuance

### 9.2 Information sur les Suites

**Script suggéré :**
```
Voici comment le processus se déroule.
[Étapes suivantes]
Vous aurez une réponse de notre part d'ici [délai].
Avez-vous d'autres processus en cours que nous devrions prendre en compte ?
```

**Ce que le moteur analyse :**
- Attractivité du candidat sur le marché
- Urgence de décision de notre côté
- Risque de contre-offre

### 9.3 Clôture Relationnelle

**Script suggéré :**
```
Merci pour cet échange.
J'ai vraiment apprécié [élément sincère et spécifique].
La suite très bientôt.
```

### 9.4 Notation Finale Immédiate

**Dans les 2 minutes après le départ du candidat :**
- Impression globale : [1 à 10]
- Un mot qui résume : [mot]
- Ce que j'ai aimé : [1 ligne]
- Ce qui m'interroge : [1 ligne]

**Tableau de bord Acte 5 :**
- Questions candidat : [analyse]
- Autres processus en cours : [analyse]
- Clôture relationnelle : [statut]
- Points à valoriser : [liste]

### 9.5 Transition vers Acte 6

**Automatique après le départ du candidat :**
- "Acte 5 complet. Passer au post-entretien."

---

## 10. Acte 6 — Post-Entretien Immédiat

### 10.1 Génération du Debrief

**Le moteur produit automatiquement le debrief complet :**
- Basé sur toutes les cotations en temps réel
- Basé sur tous les signaux détectés
- Basé sur la cartographie conversationnelle
- Basé sur la note immédiate
- Basé sur les patterns de la mémoire institutionnelle

### 10.2 Comparaison Impression / Analyse

**Confrontation entre :**
- L'impression immédiate du recruteur
- L'analyse structurée du moteur

**Si concordance :**
- Signal de cohérence

**Si divergence significative :**
- Le moteur explique la divergence
- Lequel des deux prendre en compte ?
- Réflexion guidée pour le recruteur

### 10.3 Recommandation Finale

**Le moteur produit sa recommandation :**
- Recommandé / Refusé / À approfondir
- Niveau de confiance
- Cartographie d'incertitude

### 10.4 Préparation de la Communication

**Si recommandé :**
- Email de confirmation de suite
- Points à valoriser pour maintenir l'intérêt

**Si refusé :**
- Feedback personnalisé et respectueux
- Formulé par le moteur
- Validé par le recruteur avant envoi

**Si dossier à approfondir :**
- Plan du prochain round
- Points spécifiques à explorer
- Intervenant recommandé pour le round 2

**Tableau de bord Acte 6 :**
- Debrief généré : [statut]
- Comparaison impression / analyse : [analyse]
- Recommandation : [décision]
- Communication préparée : [type]

---

## 11. Fonctionnalités Avancées

### 11.1 Multi-Intervenants

**Pour les entretiens panel :**
- Le moteur coordonne les intervenants
- Il génère des briefings individualisés
- Il répartit les questions
- Il synthétise les évaluations

### 11.2 Multi-Rounds

**Pour les processus en plusieurs rounds :**
- Le moteur maintient une vue d'ensemble
- Il prépare automatiquement chaque round
- Il analyse la cohérence inter-rounds
- Il alerte en cas de fatigue du processus

### 11.3 Personnalisation

**Personnaliser l'orchestration :**
- Ajuster les paramètres par défaut
- Créer des templates de questions
- Définir des critères de décision personnalisés
- Configurer les alertes automatiques

---

## 12. Bonnes Pratiques

### 12.1 Avant l'Entretien

**Lire le briefing :**
- Prenez 5 minutes pour lire le briefing
- Mémorisez les 3 mots-clés
- Notez la question N°1 à ne pas manquer

**Préparer l'environnement :**
- Assurez-vous d'avoir un environnement calme
- Préparez eau / café
- Vérifiez la connexion internet

### 12.2 Pendant l'Entretien

**Suivre les recommandations du moteur :**
- Le tableau de bord guide chaque acte
- Les alertes signalent les points d'attention
- Les recommandations aident à adapter

**Rester flexible :**
- Le moteur suggère, vous décidez
- Adaptez-vous au candidat
- Faites confiance à votre intuition

### 12.3 Après l'Entretien

**Noter immédiatement :**
- Dans les 2 minutes après le départ
- Capturez l'émotion brute
- Avant la rationalisation

**Revoir le debrief :**
- Comparez impression et analyse
- Validez la recommandation
- Préparez la communication

---

## 13. Dépannage

### 13.1 Problèmes Courants

**Le plan d'entretien ne se génère pas :**
- Vérifiez que tous les documents sont fournis
- Vérifiez la connexion internet
- Contactez le support si le problème persiste

**Le tableau de bord ne se met pas à jour :**
- Vérifiez la connexion internet
- Rafraîchissez la page
- Contactez le support si le problème persiste

**Les alertes ne s'affichent pas :**
- Vérifiez les paramètres de notification
- Vérifiez que les alertes sont activées
- Contactez le support si le problème persiste

### 13.2 Support

**Contacter le support :**
- Email : support@trajectoire.ai
- Téléphone : +33 1 23 45 67 89
- Chat : Disponible dans l'interface

---

## 14. Conclusion

Le chef d'orchestre est votre assistant intelligent pour les entretiens de recrutement. Il orchestre l'entretien en temps réel, vous guide à chaque étape, et vous aide à prendre des décisions éclairées. Avec ce guide, vous avez toutes les clés pour utiliser le chef d'orchestre efficacement.

**Points clés :**
- Prise en main simple en 3 étapes
- Acte 0 : Pré-entretien (ingestion, plan, briefing)
- Acte 1 : Ouverture (accueil, cadre, brise-glace)
- Acte 2 : Exploration (parcours, compétences, transitions)
- Acte 3 : Approfondissement (soft skills, motivations, culture fit)
- Acte 4 : Challenge (questions difficiles, zones d'ombre, déstabilisation)
- Acte 5 : Clôture (questions candidat, suites, notation immédiate)
- Acte 6 : Post-entretien (debrief, comparaison, recommandation)
- Fonctionnalités avancées (multi-intervenants, multi-rounds)
- Bonnes pratiques (avant, pendant, après)
- Dépannage et support
