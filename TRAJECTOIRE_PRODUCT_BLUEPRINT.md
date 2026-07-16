# TRAJECTOIRE PRODUCT BLUEPRINT

**Document de référence officiel pour le développement produit**
**Version:** 1.0
**Date:** 5 juillet 2026
**Statut:** Validé pour implémentation

---

## INTRODUCTION

Ce document est la référence opérationnelle pour toutes les équipes Product, UX, UI et Développement. Il synthétise les documents stratégiques existants (`TRAJECTOIRE_STRATEGIC_FOUNDATIONS.md`, `PRODUCT_BLUEPRINT_STRUCTURE.md`, `TRAJECTOIRE_USER_EXPERIENCE_MASTERPLAN.md`, `AUTH_PREMIUM_REVIEW.md`, `PAGE_MIGRATION_REPORT_DASHBOARD.md`, `DESIGN_SYSTEM_FINAL_REPORT.md`, `INFRASTRUCTURE_ROADMAP.md`) en transformant la vision en décisions concrètes de développement.

**Règle fondamentale:** Chaque section répond à la question : "Quelles décisions concrètes devront être prises pendant le développement ?"

---

## PARTIE 1 — VISION PRODUIT

### Décisions de développement

#### 1.1 Positionnement Premium
**Décision:** Trajectoire est une plateforme premium pour cadres et managers, pas un outil générique de coaching.
**Implication développement:**
- Langage et ton : professionnel, élégant, jamais familier
- Design system : palette Arena (fond `#F8F6F3`, primary `gray-900`)
- Animations : cubique-bezier `[0.16, 1, 0.3, 1]`, durée 200-400ms
- Ombres : `shadow-sm` uniquement (style Stripe/Notion)
- Typographie : headings serif, body sans-serif (Inter 15px)

#### 1.2 Promesse de valeur
**Décision:** L'utilisateur achète de la confiance et de la sérénité, pas une technologie.
**Implication développement:**
- Premier écran : réassurance immédiate ("Bonjour, {Prénom}")
- Messages : toujours positifs, jamais techniques
- Feedback : explicite et rassurant à chaque action
- États d'erreur : toujours accompagnés d'une solution

#### 1.3 North Star Metric
**Décision:** Le métrique principal est le "Taux de réussite en entretien" (pas l'engagement temps).
**Implication développement:**
- Tracking : événement `interview_success` après entretien réel
- Dashboard : afficher ce métrique en premier
- Analytics : prioriser les corrélations avec ce métrique

---

## PARTIE 2 — POSITIONNEMENT UTILISATEUR

### Décisions de développement

#### 2.1 Personas principaux
**Décision:** 3 personas principaux (Jeune Manager, Manager Opérationnel, Cadre Dirigeant).
**Implication développement:**
- Onboarding : question de ciblage au premier login
- Dashboard : personnalisation selon persona (contenu adapté)
- Copywriting : adaptation selon niveau de carrière

#### 2.2 État émotionnel initial
**Décision:** L'utilisateur arrive stressé, sous pression, avec manque de confiance.
**Implication développement:**
- Premier écran : fond calme, typographie apaisante
- Animations : fluides, jamais agressives
- Messages : empathiques ("Nous comprenons votre situation")
- Progression : visible dès la première action

#### 2.3 Parcours de confiance
**Décision:** Progression psychologique : Curiosité → Espoir → Confiance → Maîtrise → Fierté → Fidélité.
**Implication développement:**
- Étape 1 (Curiosité) : Landing page avec démo rapide
- Étape 2 (Espoir) : Premier ATS avec score immédiat
- Étape 3 (Confiance) : Première simulation réussie
- Étape 4 (Maîtrise) : Plan de progression personnalisé
- Étape 5 (Fierté) : Badges et achievements subtils
- Étape 6 (Fidélité) : Historique et statistiques de réussite

---

## PARTIE 3 — TRANSFORMATION UTILISATEUR

### Décisions de développement

#### 3.1 Avant Trajectoire
**État:** Stress, doute, improvisation.
**Implication développement:**
- Évaluation initiale : questionnaire d'état émotionnel (optionnel)
- Baseline : mesurer le niveau de confiance initial

#### 3.2 Pendant Trajectoire
**Transformation:** Réduction progressive du stress, augmentation de la confiance.
**Implication développement:**
- Feedback après chaque action : "Vous progressez"
- Visualisation de la progression : graphique Recharts
- Micro-victoires : animations de succès à chaque étape

#### 3.3 Après Trajectoire
**État:** Confiance, préparation, maîtrise, calme.
**Implication développement:**
- Mesure post-entretien : questionnaire de réussite
- Comparaison avant/après : afficher l'évolution
- Témoignages : demander après réussite (optionnel)

---

## PARTIE 4 — PARCOURS PRODUIT

### Décisions de développement

#### 4.1 Découverte → Inscription
**Décision:** Inscription en 2 étapes maximum, avec 2 crédits gratuits offerts.
**Implication développement:**
- Form : email + password uniquement (pas de champs superflus)
- Validation : email en temps réel
- Bonus : crédits automatiques après confirmation email
- Auth : utiliser composants AuthArenaLayout premium

#### 4.2 Premier succès (Import CV)
**Décision:** Premier succès = CV analysé avec score ATS visible.
**Implication développement:**
- Upload : drag & drop avec animation premium
- Analyse : animation ATS avec timeline (steps visibles)
- Score : cercle animé avec score 0-100
- Quick Wins : 5 améliorations immédiates affichées

#### 4.3 Analyse ATS
**Décision:** Analyse ATS avec feedback immédiat et actionnable.
**Implication développement:**
- Composant : `ats-analysis-animation.tsx` avec steps
- Résultats : compétences matchées/manquantes
- Recommandations : liste priorisée (Impact/Effort)
- CTA : "Continuer vers simulation"

#### 4.4 Simulation vocale
**Décision:** Simulation immersive avec IA, feedback en temps réel.
**Implication développement:**
- Interface : microphone premium avec visualisation audio
- Questions : générées selon le poste cible
- Feedback : transcription + analyse en temps réel
- Rapport : généré automatiquement après simulation

#### 4.5 Rapport de simulation
**Décision:** Rapport détaillé avec points forts/faiblesses et plan d'action.
**Implication développement:**
- Score : cercle animé avec sous-scores
- Analyse : transcription annotée
- Recommandations : spécifiques à la simulation
- Plan : intégrer au plan de progression global

#### 4.6 Plan de progression
**Décision:** Plan personnalisé basé sur les analyses et simulations.
**Implication développement:**
- Timeline : steps visibles avec deadlines
- Progression : barres de progression par objectif
- Priorités : badges (Haute, Moyenne, Basse)
- Adaptation : recalcul dynamique après chaque simulation

#### 4.7 Historique intelligent
**Décision:** Historique avec filtres, recherche et insights.
**Implication développement:**
- Liste : toutes les simulations et analyses
- Filtres : par date, type, score, poste
- Recherche : full-text sur transcriptions
- Insights : tendances et progrès visibles

#### 4.8 Réussite
**Décision:** Célébration de la réussite avec demande de feedback.
**Implication développement:**
- Modal : félicitations avec animation
- Feedback : questionnaire de réussite
- Témoignage : optionnel (avec consentement)
- Statistiques : mise à jour du taux de réussite

---

## PARTIE 5 — MOMENTS CLÉS

### Décisions de développement

#### 5.1 Moments de soulagement
**Décision:** Créer 5+ moments où l'utilisateur respire.
**Implication développement:**
- Après upload CV : "Votre CV est analysé"
- Après analyse ATS : "Voici vos points forts"
- Après simulation : "Vous avez progressé"
- Après plan : "Voici votre parcours"
- Après réussite : "Félicitations"

#### 5.2 Moments de confiance
**Décision:** Créer 5+ moments où l'utilisateur se sent capable.
**Implication développement:**
- Premier score ATS : "Vous êtes à 75% du poste"
- Première simulation : "Vous avez bien répondu"
- Progression visible : "Vous avez amélioré de 15%"
- Plan personnalisé : "Voici comment atteindre votre objectif"
- Historique : "Vous avez réalisé 10 simulations"

#### 5.3 Moments de fierté
**Décision:** Créer 5+ moments de célébration subtile.
**Implication développement:**
- Badges : élégants, non enfantins (design premium)
- Achievements : "Première simulation", "5 simulations", "Score > 80%"
- Milestones : "CV optimisé", "Plan complété"
- Streaks : "7 jours consécutifs"
- Niveaux : "Débutant" → "Intermédiaire" → "Avancé" → "Expert"

#### 5.4 Moments de motivation
**Décision:** Créer 5+ moments de relance.
**Implication développement:**
- Dashboard : citation inspirante quotidienne
- Email : rappel personnalisé après 3 jours d'inactivité
- Notification : "Votre plan a une étape en attente"
- Gamification : défis hebdomadaires (optionnels)
- Social : "70% des utilisateurs comme vous ont réussi"

---

## PARTIE 6 — GAMIFICATION INTELLIGENTE

### Décisions de développement

#### 6.1 Progression visible
**Décision:** Toujours montrer où l'utilisateur est dans son parcours.
**Implication développement:**
- Dashboard : widget progression avec steps
- Chaque page : breadcrumb contextuel
- Sidebar : indicateurs de progression
- Profil : niveau et badges visibles

#### 6.2 Badges élégants
**Décision:** Badges premium, jamais "jeu vidéo".
**Implication développement:**
- Design : icônes Lucide, couleurs subtiles (gray-900, green-100)
- Animation : scale subtil à l'obtention
- Affichage : profil et dashboard uniquement
- Types : 10 badges maximum (pas de surcharge)

#### 6.3 Objectifs personnalisés
**Décision:** Objectifs basés sur le poste cible, pas génériques.
**Implication développement:**
- Définition : lors de l'onboarding (target role)
- Adaptation : recalcul après ATS et simulations
- Priorité : badges (Haute/Moyenne/Basse)
- Deadline : suggéré, pas imposé

#### 6.4 Défis optionnels
**Décision:** Défis hebdomadaires pour engagement, jamais obligatoires.
**Implication développement:**
- Fréquence : 1 défi par semaine maximum
- Contenu : lié au poste cible
- Récompense : badge + crédits bonus
- Opt-out : toujours possible

#### 6.5 Streaks discrets
**Décision:** Streaks pour habitude, sans pression.
**Implication développement:**
- Calcul : jours consécutifs d'activité
- Affichage : dashboard et profil uniquement
- Reset : après 7 jours d'inactivité (pas de punition)
- Récompense : badge à 7, 30, 90 jours

#### 6.6 Récompenses utiles
**Décision:** Récompenses = crédits de simulation, pas virtuels.
**Implication développement:**
- Système : crédits pour simulations
- Bonus : crédits pour achievements
- Économie : 1 crédit = 1 simulation
- Achat : packs de crédits (monétisation)

---

## PARTIE 7 — FIDÉLISATION

### Décisions de développement

#### 7.1 Pourquoi revenir demain ?
**Décision:** Plan de progression avec prochaine action claire.
**Implication développement:**
- Dashboard : "Prochaine étape : {action}"
- Email : rappel avec CTA direct
- Notification : push (optionnel) pour deadline
- Friction : minimum (1 clic pour continuer)

#### 7.2 Pourquoi revenir chaque semaine ?
**Décision:** Nouveaux contenus et défis hebdomadaires.
**Implication développement:**
- Défis : nouveaux chaque semaine
- Contenus : questions de simulation variées
- Insights : nouvelles statistiques chaque semaine
- Email : digest hebdomadaire des progrès

#### 7.3 Pourquoi conserver l'abonnement ?
**Décision:** Valeur continue = nouvelles simulations et analyses.
**Implication développement:**
- Fréquence : nouvelles questions de simulation mensuelles
- Mises à jour : ATS algorithms améliorés
- Support : prioritaire pour Premium
- Exclusivité : features Premium (simulations illimitées)

---

## PARTIE 8 — MONÉTISATION

### Décisions de développement

#### 8.1 Modèle freemium
**Décision:** 2 crédits gratuits, puis abonnement mensuel.
**Implication développement:**
- Gratuit : 2 crédits à l'inscription
- Premium : simulations illimitées
- Upsell : après épuisement des crédits gratuits
- Pricing : affiché clairement dans dashboard

#### 8.2 Moment d'upsell
**Décision:** Proposer Premium après première simulation réussie.
**Implication développement:**
- Trigger : après 1ère simulation avec score > 60%
- Modal : "Continuez votre préparation avec Premium"
- CTA : "Essayer 7 jours gratuits"
- Friction : 1 clic pour commencer

#### 8.3 Valeur Premium
**Décision:** Premium = simulations illimitées + analyses avancées.
**Implication développement:**
- Simulations : illimitées (vs 2 gratuites)
- Analyses ATS : détaillées avec priorité matrix
- Rapports : comparaison historique
- Support : prioritaire

#### 8.4 Rétention abonnement
**Décision:** Renouvellement = valeur continue perçue.
**Implication développement:**
- Email : 7 jours avant renouvellement avec statistiques
- Dashboard : afficher la valeur créée (simulations réalisées)
- Offre : réduction pour engagement annuel
- Cancel : survey de raison (optionnel)

---

## PARTIE 9 — EXPÉRIENCE PREMIUM

### Décisions de développement

#### 9.1 Typographie
**Décision:** Serif pour headings, Inter 15px pour body.
**Implication développement:**
- Headings : `font-serif text-3xl font-semibold tracking-tight text-gray-900`
- Body : `text-[15px] leading-relaxed text-gray-600`
- Labels : `text-sm font-semibold mb-2.5 tracking-wide text-gray-700`
- Consistance : appliquer sur tous les écrans

#### 9.2 Couleurs
**Décision:** Palette Arena (gray-900, white, #F8F6F3).
**Implication développement:**
- Primary : `gray-900` (boutons, liens actifs)
- Secondary : `gray-600` (texte secondaire)
- Background : `#F8F6F3` (fond global)
- Cards : `white` avec `border-gray-200/60`
- Accents : `yellow-600` (or discret pour badges)

#### 9.3 Ombres
**Décision:** shadow-sm uniquement, style Stripe/Notion.
**Implication développement:**
- Cards : `shadow-sm`
- Hover : `hover:shadow-md hover:shadow-gray-900/10`
- Jamais : shadow-lg ou shadow-xl (trop agressifs)

#### 9.4 Animations
**Décision:** Cubic-bezier premium, durée 200-400ms.
**Implication développement:**
- Easing : `[0.16, 1, 0.3, 1]`
- Durée : 200-400ms (jamais > 500ms)
- Types : fade, slide, scale (subtils)
- Stagger : 0.05s entre éléments

#### 9.5 Micro-interactions
**Décision:** Hover lift, scale subtil, transitions fluides.
**Implication développement:**
- Buttons : `hover:-translate-y-0.5 active:translate-y-0`
- Cards : `hover:shadow-md hover:-translate-y-0.5`
- Icons : `hover:scale-105`
- Links : `transition-colors duration-200`

#### 9.6 Espacements
**Décision:** Grille 8px stricte.
**Implication développement:**
- Form : `space-y-6` (24px)
- Headline : `mb-10` (40px)
- Label : `mb-2.5` (10px)
- Card : `p-6` ou `p-8`
- Gap : `gap-6` (24px)

#### 9.7 Coins arrondis
**Décision:** rounded-lg (8px) pour tout.
**Implication développement:**
- Cards : `rounded-lg`
- Buttons : `rounded-lg`
- Inputs : `rounded-lg`
- Avatars : `rounded-full`

#### 9.8 Focus rings
**Décision:** ring-4 avec 5% opacity.
**Implication développement:**
- Inputs : `focus:ring-4 focus:ring-gray-900/5`
- Buttons : `focus:ring-4 focus:ring-gray-900/5`
- Consistance : tous les éléments interactifs

#### 9.9 Messages (copywriting)
**Décision:** Ton humain, rassurant, jamais technique.
**Implication développement:**
- Login : "Bon retour. Connectez-vous pour continuer votre préparation."
- Signup : "Créez votre compte. Commencez votre préparation avec 2 crédits gratuits."
- Erreurs : "Une erreur est survenue. Réessayez ou contactez le support."
- Succès : "Votre CV est analysé. Voici vos résultats."

#### 9.10 Temps de réponse
**Décision:** Feedback immédiat (< 200ms) pour toutes les actions.
**Implication développement:**
- Optimisation : server components par défaut
- Loading : skeleton premium (pas de spinners nus)
- States : loading, empty, error élégants
- Performance : target < 2s pour toutes les pages

---

## PARTIE 10 — TRAJECTOIRE PRINCIPLES (100 RÈGLES)

### Décisions de développement

#### Règles UX (1-20)
1. Trajectoire réduit toujours le stress.
2. Trajectoire ne laisse jamais l'utilisateur sans prochaine action.
3. Trajectoire explique toujours ce qu'il se passe.
4. Trajectoire valorise toujours les progrès.
5. Trajectoire accompagne, ne juge jamais.
6. Trajectoire ne montre jamais un écran vide.
7. Trajectoire ne montre jamais une erreur sans solution.
8. Trajectoire termine toujours une interaction sur une note positive.
9. Trajectoire utilise des messages humains, jamais techniques.
10. Trajectoire respecte le temps de l'utilisateur.
11. Trajectoire demande le minimum d'informations nécessaires.
12. Trajectoire confirme toujours les actions destructrices.
13. Trajectoire permet toujours d'annuler une action.
14. Trajectoire sauvegarde automatiquement le progrès.
15. Trajectoire notifie l'utilisateur des changements importants.
16. Trajectoire adapte le contenu au niveau de l'utilisateur.
17. Trajectoire utilise des exemples concrets, jamais abstraits.
18. Trajectoire donne du contexte avant de demander une action.
19. Trajectoire utilise des labels clairs et concis.
20. Trajectoire hiérarchise l'information par importance.

#### Règles UI (21-40)
21. Trajectoire utilise shadow-sm uniquement.
22. Trajectoire utilise rounded-lg pour tout sauf les avatars.
23. Trajectoire utilise gray-900 comme couleur primaire.
24. Trajectoire utilise la grille 8px stricte.
25. Trajectoire utilise des animations de 200-400ms maximum.
26. Trajectoire utilise le cubic-bezier [0.16, 1, 0.3, 1].
27. Trajectoire utilise Inter 15px pour le body text.
28. Trajectoire utilise serif pour les headings.
29. Trajectoire utilise des contrastes WCAG AA.
30. Trajectoire utilise des focus rings subtils (ring-4 5%).
31. Trajectoire utilise des transitions de 200ms.
32. Trajectoire utilise des micro-interactions lift sur hover.
33. Trajectoire utilise des badges élégants, jamais criards.
34. Trajectoire utilise des icônes Lucide cohérentes.
35. Trajectoire utilise des placeholders réalistes.
36. Trajectoire utilise des espacements généreux.
37. Trajectoire utilise des bordures subtils (gray-200).
38. Trajectoire utilise des backgrounds blancs ou #F8F6F3.
39. Trajectoire utilise des boutons avec hover shadow.
40. Trajectoire utilise des inputs avec focus ring premium.

#### Règles Technique (41-60)
41. Trajectoire utilise des server components par défaut.
42. Trajectoire utilise des skeleton loaders, pas de spinners nus.
43. Trajectoire utilise React.memo pour les composants lourds.
44. Trajectoire utilise des dynamic imports pour réduire le bundle.
45. Trajectoire utilise des error boundaries pour isoler les erreurs.
46. Trajectoire utilise des types TypeScript stricts.
47. Trajectoire utilise des Zod schemas pour la validation.
48. Trajectoire utilise des environment variables validées au démarrage.
49. Trajectoire utilise des logs structurés (Pino).
50. Trajectoire utilise des timeouts explicites pour les appels externes.
51. Trajectoire utilise des circuit breakers pour les services externes.
52. Trajectoire utilise des retries avec exponential backoff.
53. Trajectoire utilise des caches pour les données statiques.
54. Trajectoire utilise des indexes de base de données optimisés.
55. Trajectoire utilise des transactions pour les écritures critiques.
56. Trajectoire utilise des webhooks pour les événements asynchrones.
57. Trajectoire utilise des queues pour les tâches lourdes.
58. Trajectoire utilise des rate limits pour protéger l'API.
59. Trajectoire utilise des CORS restreints.
60. Trajectoire utilise des HTTPS partout.

#### Règles Business (61-80)
61. Trajectoire offre 2 crédits gratuits à l'inscription.
62. Trajectoire propose Premium après la première valeur.
63. Trajectoire utilise un pricing simple et transparent.
64. Trajectoire permet d'annuler facilement.
65. Trajectoire envoie des emails pertinents, pas de spam.
66. Trajectoire respecte le GDPR et la confidentialité.
67. Trajectoire demande le consentement pour les emails marketing.
68. Trajectoire utilise des cookies minimaux.
69. Trajectoire permet l'export des données utilisateur.
70. Trajectoire supprime les données sur demande.
71. Trajectoire utilise des analytics anonymisés.
72. Trajectoire ne vend pas les données utilisateur.
73. Trajectoire utilise des paiements sécurisés (Stripe).
74. Trajectoire émet des factures automatiques.
75. Trajectoire envoie des rappels avant renouvellement.
76. Trajectoire offre un support prioritaire pour Premium.
77. Trajectoire utilise des SLA clairs pour le support.
78. Trajectoire documente toutes les API publiques.
79. Trajectoire utilise des termes de service clairs.
80. Trajectoire utilise une politique de confidentialité accessible.

#### Règles Contenu (81-100)
81. Trajectoire utilise un ton professionnel et empathique.
82. Trajectoire évite le jargon technique.
83. Trajectoire utilise des exemples concrets.
84. Trajectoire adapte le contenu au persona.
85. Trajectoire utilise des citations inspirantes.
86. Trajectoire utilise des conseils actionnables.
87. Trajectoire utilise des statistiques pertinentes.
88. Trajectoire utilise des témoignages authentiques.
89. Trajectoire évite les promesses irréalistes.
90. Trajectoire utilise des scénarios réalistes.
91. Trajectoire utilise des questions variées.
92. Trajectoire utilise des feedbacks constructifs.
93. Trajectoire utilise des recommandations priorisées.
94. Trajectoire utilise des plans personnalisés.
95. Trajectoire utilise des historiques intelligents.
96. Trajectoire utilise des insights pertinents.
97. Trajectoire utilise des défis motivants.
98. Trajectoire utilise des badges élégants.
99. Trajectoire utilise des célébrations subtiles.
100. Trajectoire utilise toujours la vérité, jamais l'exagération.

---

## PARTIE 11 — ANTI-PATTERNS (100 ERREURS À ÉVITER)

### Décisions de développement

#### Anti-patterns UX (1-25)
1. ❌ Interfaces froides et robotiques
2. ❌ Messages techniques sans explication
3. ❌ Animations inutiles et lentes
4. ❌ Spinners sans contexte
5. ❌ Popups agressifs et intrusifs
6. ❌ Couleurs criardes et saturées
7. ❌ Trop d'informations sur un écran
8. ❌ CTA concurrents sur une page
9. ❌ Écrans vides sans guide
10. ❌ Erreurs sans solution
11. ❌ Formulaires trop longs
12. ❌ Champs obligatoires non marqués
13. ❌ Validation tardive (après submit)
14. ❌ Feedback absent ou lent
15. ❌ Navigation confuse
16. ❌ Breadcrumbs manquants
17. ❌ Boutons sans hover state
18. ❌ Links sans indication de clic
19. ❌ Inputs sans focus ring
20. ❌ Checkboxes sans animation
21. ❌ Modals sans backdrop
22. ❌ Dropdowns sans fermeture automatique
23. ❌ Scroll horizontal inattendu
24. ❌ Texte illisible (contraste insuffisant)
25. ❌ Typographie incohérente

#### Anti-patterns UI (26-50)
26. ❌ Ombres agressives (shadow-lg, shadow-xl)
27. ❌ Coins trop arrondis (rounded-xl, rounded-2xl)
28. ❌ Couleurs bleues saturées (blue-900, blue-700)
29. ❌ Gradients inutiles
30. ❌ Animations > 500ms
31. ❌ Easing linéaire ou agressif
32. ❌ Espacements incohérents
33. ❌ Grille non respectée
34. ❌ Typography trop petite (< 14px)
35. ❌ Typography trop grande (> 18px pour body)
36. ❌ Serif pour body text
37. ❌ Sans-serif pour headings
38. ❌ Focus rings agressifs
39. ❌ Borders épais (border-2)
40. ❌ Backgrounds gris sombres
41. ❌ Cards sans ombre
42. ❌ Buttons sans micro-interaction
43. ❌ Icons sans hover
44. ❌ Images sans lazy loading
45. ❌ SVG sans optimisation
46. ❌ Fonts non optimisés
47. ❌ Icons incohérents
48. ❌ Badges enfantins
49. ❌ Gamification "jeu vidéo"
50. ❌ Design générique

#### Anti-patterns Technique (51-75)
51. ❌ Client components par défaut
52. ❌ Spinners nus sans skeleton
53. ❌ Pas de React.memo sur composants lourds
54. ❌ Pas de dynamic imports
55. ❌ Pas d'error boundaries
56. ❌ Types TypeScript laxistes (any)
57. ❌ Pas de validation Zod
58. ❌ Environment variables non validées
59. ❌ console.log au lieu de logger structuré
60. ❌ Pas de timeouts explicites
61. ❌ Pas de circuit breakers
62. ❌ Pas de retries
63. ❌ Pas de cache
64. ❌ Indexes manquants
65. ❌ Pas de transactions
66. ❌ Pas de webhooks
67. ❌ Pas de queues
68. ❌ Pas de rate limits
69. ❌ CORS ouverts (*)
70. ❌ HTTP sur certaines routes
71. ❌ Secrets hardcodés
72. ❌ Passwords en clair
73. ❌ SQL injection possible
74. ❌ XSS vulnérabilités
75. ❌ CSRF non protégé

#### Anti-patterns Business (76-90)
76. ❌ Pas de crédits gratuits
77. ❌ Upsell avant la première valeur
78. ❌ Pricing complexe et confus
79. ❌ Annulation difficile
80. ❌ Emails spam
81. ❌ Violation GDPR
82. ❌ Consentement forcé
83. ❌ Cookies excessifs
84. ❌ Export impossible
85. ❌ Suppression refusée
86. ❌ Analytics intrusifs
87. ❌ Vente de données
88. ❌ Paiements non sécurisés
89. ❌ Pas de factures
90. ❌ Rappel tardif avant renouvellement

#### Anti-patterns Contenu (91-100)
91. ❌ Ton familier ou informel
92. ❌ Jargon technique
93. ❌ Exemples abstraits
94. ❌ Contenu générique
95. ❌ Citations banales
96. ❌ Conseils vagues
97. ❌ Statistiques sans contexte
98. ❌ Témoignages faux
99. ❌ Promesses irréalistes
100. ❌ Exagération

---

## PARTIE 12 — ROADMAP PRODUIT

### Décisions de développement

#### Phase 1 : Fondations (Sprints 1-4)
**Sprint 1 : Candidate Journey complet**
- Décision : Construire le parcours complet de découverte à première simulation
- Livrables : Landing, Auth, Dashboard, Upload CV, Analyse ATS
- Priorité : Critique

**Sprint 2 : Upload CV Premium**
- Décision : Upload avec drag & drop, validation, animation
- Livrables : Composant CV Upload Premium
- Priorité : Critique

**Sprint 3 : Analyse ATS Premium**
- Décision : Analyse avec animation timeline, score, quick wins
- Livrables : Composant ATS Analysis Animation, Rapport ATS
- Priorité : Critique

**Sprint 4 : Rapport ATS Premium**
- Décision : Rapport détaillé avec compétences, recommandations
- Livrables : Composant ATS Report Premium
- Priorité : Critique

#### Phase 2 : Simulation (Sprints 5-7)
**Sprint 5 : Simulation vocale immersive**
- Décision : Simulation avec IA, transcription, feedback temps réel
- Livrables : Interface simulation, WebSocket V3, Scoring
- Priorité : Critique

**Sprint 6 : Rapport de simulation**
- Décision : Rapport avec score, analyse, recommandations
- Livrables : Composant Simulation Report
- Priorité : Critique

**Sprint 7 : Plan de progression**
- Décision : Plan personnalisé avec timeline, objectifs, deadlines
- Livrables : Composant Progression Plan
- Priorité : Haute

#### Phase 3 : Gestion (Sprints 8-11)
**Sprint 8 : Historique intelligent**
- Décision : Historique avec filtres, recherche, insights
- Livrables : Composant History
- Priorité : Haute

**Sprint 9 : Profil**
- Décision : Profil utilisateur avec badges, statistiques
- Livrables : Page Profil
- Priorité : Haute

**Sprint 10 : Paramètres**
- Décision : Paramètres utilisateur (préférences, notifications)
- Livrables : Page Paramètres
- Priorité : Moyenne

**Sprint 11 : Notifications**
- Décision : Système de notifications (email, push, in-app)
- Livrables : Système de notifications
- Priorité : Moyenne

#### Phase 4 : Monétisation (Sprints 12-13)
**Sprint 12 : Abonnement**
- Décision : Page abonnement avec pricing, checkout Stripe
- Livrables : Page Abonnement, Intégration Stripe
- Priorité : Critique

**Sprint 13 : Facturation**
- Décision : Factures automatiques, historique, téléchargement
- Livrables : Page Facturation
- Priorité : Haute

#### Phase 5 : Support (Sprint 14)
**Sprint 14 : Centre d'aide**
- Décision : Centre d'aide avec FAQ, recherche, contact
- Livrables : Page Centre d'aide
- Priorité : Moyenne

#### Phase 6 : Qualité (Sprints 15-20)
**Sprint 15 : Optimisation Mobile**
- Décision : Responsive complet pour mobile
- Livrables : Tests mobile, ajustements UI
- Priorité : Haute

**Sprint 16 : Performance**
- Décision : Optimisation performance (bundle, loading, rendering)
- Livrables : Audit performance, optimisations
- Priorité : Haute

**Sprint 17 : Accessibilité**
- Décision : WCAG AA compliance, navigation clavier, screen reader
- Livrables : Audit accessibilité, corrections
- Priorité : Haute

**Sprint 18 : SEO**
- Décision : SEO on-page, meta tags, sitemap, robots.txt
- Livrables : Audit SEO, optimisations
- Priorité : Moyenne

**Sprint 19 : Monitoring**
- Décision : Monitoring production (Sentry, analytics, uptime)
- Livrables : Intégration monitoring, alertes
- Priorité : Critique

**Sprint 20 : Préparation Production**
- Décision : Tests E2E, load testing, security audit
- Livrables : Tests complets, audit sécurité
- Priorité : Critique

---

## PARTIE 13 — BENCHMARK

### Décisions de développement

#### 13.1 Stripe
**Ce qui fait leur excellence :**
- Design minimaliste et cohérent
- Animations fluides et subtiles
- Documentation exceptionnelle
- Onboarding guidé
**Comment s'en inspirer :**
- Appliquer shadow-sm et gray-900
- Utiliser cubic-bezier [0.16, 1, 0.3, 1]
- Créer une documentation produit similaire

#### 13.2 Notion
**Ce qui fait leur excellence :**
- Typographie impeccable
- Espacements parfaits
- Flexibilité du produit
- Onboarding progressif
**Comment s'en inspirer :**
- Utiliser Inter 15px et serif headings
- Appliquer grille 8px stricte
- Créer un onboarding étape par étape

#### 13.3 Vercel
**Ce qui fait leur excellence :**
- Performance exceptionnelle
- Design noir et blanc élégant
- Developer experience
- Marketing produit
**Comment s'en inspirer :**
- Optimiser la performance (< 2s par page)
- Utiliser palette gray-900/black
- Créer une DX similaire

#### 13.4 Linear
**Ce qui fait leur excellence :**
- Dark mode parfait
- Micro-interactions soignées
- Keyboard navigation
- Performance
**Comment s'en inspirer :**
- Implémenter dark mode (futur)
- Ajouter micro-interactions sur hover
- Optimiser navigation clavier

#### 13.5 Duolingo
**Ce qui fait leur excellence :**
- Gamification intelligente
- Streaks motivants
- Progression visible
- Notifications engageantes
**Comment s'en inspirer :**
- Créer une gamification subtile (pas enfantin)
- Implémenter streaks discrets
- Montrer la progression constamment

#### 13.6 Airbnb
**Ce qui fait leur excellence :**
- Photos inspirantes
- Stories utilisateur
- Trust et sécurité
- Design émotionnel
**Comment s'en inspirer :**
- Utiliser des photos professionnelles
- Ajouter des témoignages authentiques
- Créer un design émotionnel

#### 13.7 LinkedIn
**Ce qui fait leur excellence :**
- Réseau professionnel
- Contenu carrière
- Recrutement
- Analytics
**Comment s'en inspirer :**
- Créer un focus carrière
- Ajouter des analytics de progression
- Optimiser pour le recrutement

#### 13.8 ChatGPT
**Ce qui fait leur excellence :**
- Interface conversationnelle
- IA naturelle
- Feedback immédiat
- Contexte préservé
**Comment s'en inspirer :**
- Créer une interface conversationnelle pour la simulation
- Utiliser l'IA de manière naturelle
- Préserver le contexte entre simulations

---

## PARTIE 14 — CRITIQUE DU PRODUIT ACTUEL

### Décisions de développement

#### 14.1 Éléments exceptionnels
**Auth (9.8/10)**
- Score : Exceptionnel après migration premium
- Points forts : Animations fluides, design cohérent, micro-interactions
- Décision : Auth est la référence pour toutes les futures pages

**Dashboard (9.8/10)**
- Score : Exceptionnel après migration premium
- Points forts : Layout premium, widgets complets, design cohérent
- Décision : Dashboard est la référence graphique du projet

**Design System (9.9/10)**
- Score : Exceptionnel après migration
- Points forts : Tokens unifiés, composants premium, API cohérente
- Décision : Utiliser exclusivement components/design-system

#### 14.2 Éléments moyens
**CV Upload (7.0/10)**
- Score : Moyen
- Problèmes : Pas d'animation premium, feedback limité
- Décision : Refaire complètement en Sprint 2 avec composant premium

**ATS Analysis (7.5/10)**
- Score : Moyen
- Problèmes : Pas d'animation timeline, score non animé
- Décision : Refaire complètement en Sprint 3 avec animation premium

**Simulation (6.5/10)**
- Score : Moyen
- Problèmes : Interface basique, feedback limité
- Décision : Refaire complètement en Sprint 5 avec interface immersive

#### 14.3 Éléments amateurs
**Rapport ATS (6.0/10)**
- Score : Amateur
- Problèmes : Design générique, pas de micro-interactions
- Décision : Refaire complètement en Sprint 4 avec design premium

**Rapport Simulation (5.5/10)**
- Score : Amateur
- Problèmes : Pas de rapport structuré, feedback limité
- Décision : Créer de zéro en Sprint 6

**Plan de progression (5.0/10)**
- Score : Amateur
- Problèmes : Pas de plan, pas de timeline
- Décision : Créer de zéro en Sprint 7

#### 14.4 Éléments génériques
**Historique (4.5/10)**
- Score : Générique
- Problèmes : Liste basique, pas de filtres, pas de recherche
- Décision : Refaire complètement en Sprint 8 avec filtres et recherche

**Profil (4.0/10)**
- Score : Générique
- Problèmes : Pas de badges, pas de statistiques
- Décision : Refaire complètement en Sprint 9 avec gamification

**Paramètres (3.5/10)**
- Score : Générique
- Problèmes : Formulaire basique, pas de préférences avancées
- Décision : Refaire complètement en Sprint 10

#### 14.5 Éléments inutiles
**Anciens composants UI**
- Problèmes : Composants dépréciés dans deprecated/components-ui/
- Décision : Supprimer après migration complète (Input restant)

#### 14.6 Fonctionnalités manquantes
**Notifications**
- Problème : Pas de système de notifications
- Décision : Créer en Sprint 11

**Abonnement**
- Problème : Pas de page abonnement
- Décision : Créer en Sprint 12

**Facturation**
- Problème : Pas de factures
- Décision : Créer en Sprint 13

**Centre d'aide**
- Problème : Pas de centre d'aide
- Décision : Créer en Sprint 14

#### 14.7 Risques
**Performance**
- Risque : Bundle size trop grand avec Recharts et Framer Motion
- Décision : Optimiser en Sprint 16 (dynamic imports, code splitting)

**Accessibilité**
- Risque : Non compliance WCAG
- Décision : Audit et corrections en Sprint 17

**Sécurité**
- Risque : Vulnérabilités possibles
- Décision : Audit sécurité en Sprint 20

#### 14.8 Opportunités
**Mobile**
- Opportunité : Optimisation mobile pour atteindre plus d'utilisateurs
- Décision : Optimiser en Sprint 15

**SEO**
- Opportunité : Améliorer le SEO pour augmenter le trafic organique
- Décision : Optimiser en Sprint 18

**Monitoring**
- Opportunité : Monitoring proactif pour éviter les incidents
- Décision : Implémenter en Sprint 19

---

## CONCLUSION

Ce TRAJECTOIRE_PRODUCT_BLUEPRINT.md est la référence officielle pour le développement. Chaque décision de développement doit être prise en référence à ce document. Les 20 sprints suivants implémenteront ces décisions de manière séquentielle, avec pour objectif de créer un produit premium, digne de Stripe, Notion, Vercel et Linear.

**Prochaine étape :** Sprint 1 - Candidate Journey complet

---

---

## DEFINITION OF DONE (DoD)

Cette section définit les critères obligatoires permettant de considérer une fonctionnalité comme réellement terminée. Chaque future fonctionnalité devra respecter l'intégralité de cette checklist.

---

## PRODUIT

□ Le problème utilisateur est réellement résolu.
□ La fonctionnalité apporte une valeur mesurable.
□ Le parcours est cohérent.
□ L'utilisateur comprend immédiatement quoi faire.
□ Une prochaine action est toujours visible.
□ La fonctionnalité répond à un besoin réel identifié.
□ Le parcours utilisateur est complet de bout en bout.
□ Les edge cases sont gérés.
□ Les états de succès sont clairs.
□ Les états d'échec sont gérés avec solutions.

---

## UX

□ Aucun écran vide.
□ Aucun bloc inutile.
□ Aucun scroll interminable.
□ Le parcours est fluide.
□ Les émotions recherchées sont présentes.
□ Aucun stress inutile.
□ Les messages sont rassurants.
□ Le feedback est immédiat (< 200ms).
□ La navigation est intuitive.
□ Les breadcrumbs sont présents.
□ Les états de chargement sont visibles.
□ Les états vides sont guidés.
□ Les états d'erreur sont accompagnés de solutions.
□ La hiérarchie visuelle est claire.
□ L'information est priorisée correctement.

---

## UI

□ Conforme au Design System officiel.
□ Palette Arena respectée (gray-900, white, #F8F6F3).
□ Typographie respectée (Inter 15px, serif headings).
□ Espacements cohérents (grille 8px stricte).
□ Responsive complet.
□ Mobile optimisé.
□ Desktop optimisé.
□ Animations cohérentes (200-400ms, cubic-bezier [0.16, 1, 0.3, 1]).
□ Micro-interactions présentes (hover lift, scale subtil).
□ Ombres subtils (shadow-sm uniquement).
□ Coins arrondis cohérents (rounded-lg).
□ Focus rings présents (ring-4 5%).
□ Contrastes WCAG AA respectés.
□ Icônes Lucide cohérentes.
□ Badges élégants, jamais enfantins.
□ Aucun élément générique.
□ Aucun élément amateur.

---

## DÉVELOPPEMENT

□ TypeScript strict.
□ Aucun any.
□ Aucun TODO.
□ Aucun FIXME.
□ Aucun mock.
□ Aucun placeholder.
□ Aucun code mort.
□ Aucun composant dupliqué.
□ Réutilisation maximale.
□ Architecture DDD respectée.
□ Clean Architecture respectée.
□ Server components par défaut.
□ Client components justifiés.
□ React.memo sur composants lourds.
□ Dynamic imports pour réduire le bundle.
□ Error boundaries pour isoler les erreurs.
□ Zod schemas pour la validation.
□ Environment variables validées au démarrage.
□ Logs structurés (Pino).
□ Timeouts explicites pour appels externes.
□ Circuit breakers pour services externes.
□ Retries avec exponential backoff.
□ Caches pour données statiques.
□ Indexes de base de données optimisés.
□ Transactions pour écritures critiques.
□ Webhooks pour événements asynchrones.
□ Queues pour tâches lourdes.
□ Rate limits pour protéger l'API.
□ CORS restreints.
□ HTTPS partout.

---

## QUALITÉ

□ Typecheck OK.
□ Build OK.
□ Lint OK.
□ Accessibilité validée (WCAG AA).
□ SEO validé (meta tags, sitemap, robots.txt).
□ Performance validée (< 2s par page).
□ Aucun warning.
□ Tests unitaires présents.
□ Tests d'intégration présents.
□ Tests E2E pour chemins critiques.
□ Code review effectuée.
□ Documentation à jour.

---

## BACKEND

□ Connecté au vrai backend.
□ Gestion des erreurs.
□ États de chargement.
□ États vides.
□ États d'erreur.
□ Validation des données.
□ Sécurité (SQL injection, XSS, CSRF).
□ Authentification fonctionnelle.
□ Autorisations fonctionnelles.
□ Rate limiting implémenté.
□ Pagination pour listes.
□ Filtres fonctionnels.
□ Recherche fonctionnelle.
□ Tri fonctionnel.
□ API documentée.

---

## PREMIUM

□ Effet "Waouh" présent.
□ Impression haut de gamme.
□ Fluidité comparable aux meilleurs SaaS.
□ Aucun élément amateur.
□ Aucun élément générique.
□ Animations fluides et subtiles.
□ Micro-interactions soignées.
□ Design cohérent avec Auth/Dashboard.
□ Messages humains et rassurants.
□ Feedback immédiat.
□ Progression visible.
□ Moments de soulagement.
□ Moments de confiance.
□ Moments de fierté.
□ Moments de motivation.

---

## VALIDATION FINALE

Chaque fonctionnalité devra recevoir une note sur :

**UX /10**
**UI /10**
**Business /10**
**Technique /10**
**Performance /10**
**Premium Feel /10**

Une fonctionnalité ne pourra être considérée comme terminée que si la note globale est supérieure ou égale à 9,5/10.

---

**Document créé par :** Cascade AI
**Date :** 5 juillet 2026
**Version :** 1.1
**Statut :** Validé pour implémentation
