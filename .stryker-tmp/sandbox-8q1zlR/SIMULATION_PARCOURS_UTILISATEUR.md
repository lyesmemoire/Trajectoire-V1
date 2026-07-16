# Simulation du Parcours Utilisateur - Trajectoire

**Date** : 25 juin 2026  
**Objectif** : Simuler le parcours complet d'un utilisateur de la homepage jusqu'au rapport final

---

## 🏠 Étape 1 : Homepage (http://localhost:3000)

### Ce que l'utilisateur voit
- **Hero Section** : Titre "Décidez avec plus de clarté. Même lorsque la pression est forte."
- **CTA Principal** : "Démarrer gratuitement" (variant accent, size xl)
- **Mini-évaluation** : Section ValuePreview avec 3 questions interactives
- **Sections** : TrustBar, ProblemGrid, WhyTrajectoire, Dashboard preview (tabs déverrouillés), Results, Testimonials, Method (grille 2x2), TimelineMethod, ScienceLegitimacy, Security, Pricing (Trial + Cadre), FAQ, CTA final

### Actions de l'utilisateur
1. Scrolle la homepage pour découvrir le contenu
2. Remplit la mini-évaluation (3 questions)
3. Voit son score (ex: 75% - Bon)
4. Clique sur "Obtenir mon profil complet" ou "Démarrer gratuitement"

---

## 📝 Étape 2 : Inscription (/register)

### Ce que l'utilisateur voit
- **AuthLayout** : Fond avec dégradés radiaux, logo Trajectoire
- **AuthCard** : Titre "Créez votre compte", sous-titre "Rejoignez des milliers de professionnels comme vous."
- **Formulaire simplifié** :
  - Adresse email
  - Mot de passe (minimum 8 caractères)
  - Checkbox conditions d'utilisation + politique de confidentialité
- **Lien** : "Déjà un compte ? Se connecter"

### Actions de l'utilisateur
1. Saisit email : `test@example.com`
2. Saisit mot de passe : `Test123456`
3. Coche la checkbox conditions
4. Clique sur "Créer mon compte gratuitement"

### Résultat attendu
- Redirection vers `/dashboard`
- Création du compte dans Supabase
- Profil créé avec valeurs par défaut (firstName: "Utilisateur", role: "cadre")

---

## 🔐 Étape 3 : Connexion (/login)

### Ce que l'utilisateur voit
- **AuthLayout** : Même design que l'inscription
- **AuthCard** : Titre "Connectez-vous à votre compte"
- **Formulaire** :
  - Adresse email
  - Mot de passe
  - Checkbox "Se souvenir de moi"
  - Lien "Mot de passe oublié ?"
- **Lien** : "Pas encore de compte ? S'inscrire"

### Actions de l'utilisateur
1. Saisit email : `test@example.com`
2. Saisit mot de passe : `Test123456`
3. Coche "Se souvenir de moi" (optionnel)
4. Clique sur "Se connecter"

### Résultat attendu
- Redirection vers `/dashboard`
- Session créée dans Supabase
- User identifié dans analytics

---

## 📊 Étape 4 : Dashboard (/dashboard)

### Ce que l'utilisateur voit
- **WelcomeTour Modal** (première visite) :
  - Étape 1 : Vos KPIs
  - Étape 2 : Graphique de progression
  - Étape 3 : Recommandations
  - Étape 4 : Commencez maintenant
  - Navigation Précédent/Suivant
  - Progress bar
- **Dashboard Overview** :
  - Message de bienvenue : "Bienvenue, Jean 👋"
  - KPIs (4 cartes) : Préparation (87), Leadership (84), Stress (71), Confiance (91)
  - Progression Chart (AreaChart sur 8 semaines)
  - Insights comportementaux (3 items)
  - Recommandations (3 items, avec première action mise en avant)

### Progressive Disclosure
- KPIs : Visible par défaut
- Progression Chart : Caché, bouton "Débloquer"
- Insights & Recommandations : Caché, bouton "Débloquer"

### Actions de l'utilisateur
1. Ferme le WelcomeTour (ou complète les 4 étapes)
2. Voit les KPIs
3. Clique sur "Débloquer" pour voir le graphique de progression
4. Clique sur "Débloquer" pour voir les insights et recommandations
5. Voit la recommandation prioritaire : "🎯 Lancez votre première simulation"

---

## 📋 Étape 5 : Analyse CV (/dashboard/evaluation)

### Ce que l'utilisateur voit
- **Intro Screen** :
  - Titre "Évaluation comportementale"
  - 16 questions, 8 dimensions, 15 minutes
  - Dimensions évaluées : Leadership, Communication, Décision, Stress, Assertivité, Adaptabilité, Émotion, Vision
  - Instructions : 15 minutes, Confidential, Résultats immédiats
  - Bouton "Démarrer l'évaluation"

### Actions de l'utilisateur
1. Clique sur "Démarrer l'évaluation"
2. Répond aux 16 questions (2 par dimension)
3. Chaque question a 4 options de réponse (1-4)
4. Progress bar indique l'avancement

### Question Screen
- Dimension tag (ex: Leadership)
- Question text
- 4 options radio
- Boutons Précédent/Suivant

### Processing Screen
- Spinner animé
- Étapes successives :
  - Analyse de vos réponses comportementales…
  - Calcul des scores sur 8 dimensions…
  - Comparaison avec les profils de référence…
  - Génération de vos recommandations…
  - Finalisation de votre rapport…

### Results Screen
- Scores principaux (4 rings) :
  - Confiance
  - Préparation
  - Stress
  - Décision
- Analyse par dimension (8 dimensions avec scores)
- Bouton "Voir mon tableau de bord"

### Résultat attendu
- Scores calculés et sauvegardés dans Supabase
- Redirection vers `/dashboard` avec scores mis à jour

---

## 🎤 Étape 6 : Entretien Vocal (/dashboard/simulation)

### Ce que l'utilisateur voit
- **Page Simulation** :
  - Liste des simulations disponibles
  - Bouton "Nouvelle simulation"
  - Types d'entretiens : Promotion, Négociation, Comité de direction, Prise de poste

### Actions de l'utilisateur
1. Sélectionne le type d'entretien (ex: Promotion)
2. Clique sur "Commencer la simulation"
3. Redirection vers `/interview/[sessionId]`

### Interview Room (/interview/[sessionId])
- **Interface vidéo** :
  - Caméra activée
  - Micro activé
  - Questions affichées à l'écran
  - Timer
  - Boutons : Pause, Terminer

### Actions de l'utilisateur
1. Répond aux questions à l'oral
2. IA analyse en temps réel (posture, verbal, stress)
3. Complète toutes les questions
4. Clique sur "Terminer"

### Résultat attendu
- Analyse comportementale sauvegardée
- Replay annoté généré
- Redirection vers `/dashboard/report/[interviewId]`

---

## 📄 Étape 7 : Rapport Final (/dashboard/report/[interviewId])

### Ce que l'utilisateur voit
- **Header** : Titre "Rapport d'entretien - Promotion"
- **Score Global** : Note sur 100
- **Analyse détaillée** :
  - Posture exécutive
  - Communication verbale
  - Gestion du stress
  - Réponses aux questions
- **Replay annoté** : Vidéo avec timestamps et commentaires
- **Recommandations** : Actions prioritaires pour améliorer
- **Comparaison** : Avant/Après avec scores précédents

### Actions de l'utilisateur
1. Consulte le score global
2. Regarde le replay annoté
3. Lit les recommandations
4. Télécharge le rapport PDF (optionnel)
5. Planifie une nouvelle simulation (optionnel)

---

## 🔄 Résumé du Parcours

| Étape | Route | Durée estimée | Actions clés |
|-------|-------|--------------|--------------|
| Homepage | `/` | 2-3 min | Découverte, mini-évaluation, CTA |
| Inscription | `/register` | 1 min | Email + mot de passe |
| Connexion | `/login` | 30 sec | Email + mot de passe |
| Dashboard | `/dashboard` | 2 min | Onboarding, découverte KPIs |
| Évaluation | `/dashboard/evaluation` | 15 min | 16 questions comportementales |
| Simulation | `/dashboard/simulation` → `/interview/[id]` | 10 min | Entretien vidéo avec IA |
| Rapport | `/dashboard/report/[id]` | 5 min | Consultation résultats |

**Durée totale** : ~35-40 minutes pour le parcours complet

---

## 🎯 Points d'amélioration UX identifiés pendant la simulation

1. **Homepage** : Mini-évaluation bien placée, mais pourrait être plus visible
2. **Inscription** : Formulaire simplifié efficace, mais pourrait ajouter un champ prénom optionnel
3. **Dashboard** : Onboarding progressif bien conçu, mais pourrait être plus interactif
4. **Évaluation** : 16 questions peuvent sembler longues, pourrait proposer une version courte
5. **Simulation** : Interface vidéo complexe, pourrait avoir un mode tutoriel
6. **Rapport** : Replay annoté très utile, mais pourrait avoir des recommandations plus actionnables

---

## 📊 Métriques à suivre

- Homepage → Register : CTR des CTAs
- Register → Dashboard : Taux de complétion
- Dashboard → Évaluation : Taux d'engagement
- Évaluation → Simulation : Taux de conversion
- Simulation → Rapport : Taux de consultation
- Temps passé sur chaque étape
- Taux d'abandon par étape
