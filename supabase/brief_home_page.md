# Brief Créatif & Technique : Refonte de la Page d'Accueil — AI Career Copilot

Ce document présente une vue d'ensemble détaillée de la plateforme **AI Career Copilot**, ses fonctionnalités clés, sa structure de conversion actuelle et les recommandations de design pour développer une page d'accueil (Landing Page) professionnelle à fort impact visuel et de conversion.

---

## 1. Identité du Produit & Proposition de Valeur

- **Nom du Produit** : AI Career Copilot
- **Slogan Principal** : _Passe les ATS. Réussis tes entretiens._
- **Positionnement** : Un copilote IA tout-en-un pour les candidats en recherche active d'emploi. L'outil résout les deux plus grands obstacles du recrutement moderne :
  1. **Le filtrage automatisé** : Optimisation du CV pour franchir les filtres ATS (Applicant Tracking Systems).
  2. **La performance en entretien** : Simulation interactive avec des recruteurs virtuels et débriefing détaillé par IA.

---

## 2. Fonctionnalités Clés du Site (Le Back-Office)

Lorsqu'un utilisateur s'inscrit sur la plateforme, il accède à un tableau de bord (Dashboard) contenant les modules suivants :

### A. Analyseur & Score ATS

- **Upload de CV** : Traitement des CV au format PDF ou par copier-coller de texte brut.
- **Alignement avec l'offre** : Comparaison sémantique directe entre le CV de l'utilisateur et une offre d'emploi cible (Job Description).
- **Audit de mots-clés** : Identification des mots-clés manquants, des termes surreprésentés et des problèmes de structure/format.
- **Aide à la reformulation** : Suggestions automatiques basées sur la méthode reconnue **Google XYZ** (_"Accomplished [X] as measured by [Y], by doing [Z]"_).

### B. Simulateur d'Entretiens IA (Mock Interview Lab)

- **Personnalités de recruteurs** : Entraînement face à différents profils (ex: _Senior Tech de Big Tech_, _Fondateur de Startup stressant_, _RH Corporatif_, _Lead Technique direct_, etc.).
- **Niveaux de difficulté** : Normal, Difficile, Élite.
- **Scénario dynamique** : Session interactive structurée en plusieurs phases adaptatives (Introduction, Revue de CV, Cas Technique, Questions comportementales, Test de pression psychologique, Clôture).
- **Rapport de performance** : Analyse détaillée à l'issue de la simulation avec des scores sur 5 axes (Technique, Cohérence, Communication, Confiance, Stress) et des pistes concrètes d'amélioration.

### C. Modèles de CV Professionnels

- Modèles prêts à l'emploi et optimisés pour la lecture machine (ATS-friendly) : _Modern Red_, _Executive Navy_, _Minimal Black_, _Creative Slate_.

### D. Système de Crédits et Monétisation

- **Bonus d'inscription** : 2 crédits gratuits à la création du compte (sans carte bancaire).
- **Packs de crédits payants** (via Stripe) :
  - **Pack Starter (7€)** : 5 crédits, score ATS détaillé, 5 questions d'entretien.
  - **Pack Pro (15€)** : 15 crédits, tout le plan Starter + 10 questions d'entretien ciblées, analyse multi-postes et support prioritaire.

---

## 3. Structure Recommandée pour la Nouvelle Landing Page

Pour maximiser le taux de conversion (l'inscription gratuite) et rassurer sur la valeur de l'outil, la page d'accueil doit respecter l'enchaînement de sections suivant :

### Section 1 : En-tête / Barre de Navigation (Navbar)

- **Éléments** : Logo, Liens rapides (_Fonctionnalités_, _Tarifs_, _Témoignages_), bouton discret "Connexion" et un bouton CTA contrasté "Essai gratuit".
- **Effet recherché** : Fixe (sticky), avec un fond flouté en verre trempé (glassmorphism) au défilement.

### Section 2 : Zone Héro (Hero Section)

- **Accroche** : Une formule forte montrant le double avantage (ATS + Entretien).
  - _Exemple : "Arrête de postuler dans le vide. Décroche enfin les entretiens que tu mérites."_
- **Sous-accroche** : Expliquer brièvement le fonctionnement en moins de 3 lignes.
- **Élément de réassurance / Badge** : Mentionner l'absence de carte bancaire requise et l'offre d'inscription (_"2 crédits gratuits offerts à l'inscription"_).
- **Bouton d'Action Principal (CTA)** : Large, vibrant, avec un verbe d'action clair (_"Optimiser mon CV gratuitement →"_).
- **Preuve Sociale Directe** : Nombre de candidats aidés (+1200), note d'évaluation globale (4.9/5) et indicateur de sécurité des données.

### Section 3 : Bandeau de Statistiques (Social Proof / Stats)

- 4 métriques clés pour valider la crédibilité :
  - **94%** de taux de passage des filtres ATS.
  - **3x plus** d'entretiens décrochés.
  - **< 30 secondes** pour une analyse complète.
  - **1 200+** candidats accompagnés.

### Section 4 : Les 3 Piliers Technologiques (Features)

Présentation des 3 étapes clés sous forme de cartes interactives :

1. **Le diagnostic** : Score ATS en temps réel avec détection des faiblesses.
2. **L'optimisation** : Amélioration des phrases d'expérience grâce à l'IA.
3. **L'entraînement** : Simulation orale et écrite avec analyse comportementale.

### Section 5 : Le Guide étape-par-étape (How it Works)

Une section visuelle simple illustrant le parcours utilisateur :

- **Étape 1** : Importation du CV en PDF.
- **Étape 2** : Copier-coller de l'offre d'emploi cible.
- **Étape 3** : Réception du plan d'action et des simulations.

### Section 6 : Témoignages Candidats (Social Proof)

- Retours concrets de candidats ayant réussi à se faire recruter (idéalement avec le poste obtenu et la scale-up/entreprise ciblée).

### Section 7 : Tarifs Simples & Transparents

- Tableau comparatif des deux offres (Starter 7€ vs Pro 15€).
- Mentions de confiance : "Paiement sécurisé via Stripe", "Garantie satisfait ou remboursé sous 7 jours".

### Section 8 : Appel à l'action final (Final CTA Banner)

- Une bannière de grande taille avec un contraste élevé pour inciter le visiteur à s'inscrire juste avant de quitter le site.

---

## 4. Directives Visuelles & Design (Pour le Graphiste / Intégrateur)

Pour donner un aspect haut de gamme et moderne à cette refonte, voici les spécifications de style à appliquer :

| Aspect                  | Recommandation Professionnelle                                                                                                                                                                                               |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Typographie**         | Utiliser une police moderne et lisible issue de Google Fonts (ex: `Outfit` pour les titres marquants, et `Inter` pour les textes de paragraphe). Éviter les polices par défaut du navigateur.                                |
| **Palette de couleurs** | Privilégier un bleu profond et technologique pour les éléments clés (`#2563EB` ou HSL adapté) combiné avec des touches de violet/indigo pour l'aspect IA, le tout sur un fond blanc pur ou gris ultra-clair (`#F9FAFB`).     |
| **Gradients**           | Intégrer des dégradés subtils sur les arrières-plans des sections clés (ex: de bleu-violet transparent vers blanc) pour donner du relief.                                                                                    |
| **Micro-animations**    | Ajouter des transitions douces sur les survols de boutons (`hover:scale-105 transition-all`), des effets de surbrillance sur les bordures des cartes au survol, et un indicateur lumineux pulsé pour le badge d'inscription. |
| **Mockups Visuels**     | Ne pas utiliser de simples images d'illustration génériques. Afficher de faux écrans d'interface web (mockups) montrant l'analyseur ATS avec un score sur un anneau graphique, ou le chat avec le recruteur IA.              |
| **Responsive**          | Le design doit être pensé en _mobile-first_, les sections de cartes devant passer de 3 colonnes sur PC à une seule colonne verticale sur smartphone sans perte de lisibilité.                                                |
