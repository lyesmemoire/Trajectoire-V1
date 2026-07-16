# FEATURE_04_INTERVIEW_PREPARATION_DESIGN_REVIEW

> Revue d'architecture pour Interview Preparation Intelligence
> Version: 1.0
> Date: 10 juillet 2026
> Type: Documentation uniquement - Aucune implémentation

---

## Résumé Exécutif

**Objectif**: Concevoir l'intelligence qui transforme les résultats des intelligences précédentes (CandidateGraph, JobOfferGraph, Matching Intelligence, Transferable Skills Intelligence, Gap Intelligence) en un plan complet d'entretien d'embauche.

**Position dans le pipeline**: Interview Preparation Intelligence est la dernière étape avant le Voice Interview Engine. Elle prépare l'entretien mais ne le conduit pas.

**Responsabilité unique**: Comprendre ce qu'un recruteur va probablement chercher, déterminer quelles questions doivent être posées, dans quel ordre, avec quel objectif, avec quel niveau de difficulté, quelles relances prévoir, quels pièges tester, quelles compétences doivent être validées.

**Statut**: 📝 DESIGN REVIEW - Aucune implémentation

---

## Position dans le Pipeline

```
CandidateGraph
↓
JobOfferGraph
↓
Matching Core
↓
Transferable Skills Intelligence
↓
Gap Intelligence
↓
Risk Intelligence (future)
↓
Opportunity Intelligence (future)
↓
Scoring Intelligence (future)
↓
Interview Preparation Intelligence
↓
Voice Interview Engine (future)
↓
Final Report (future)
```

**Relation avec les intelligences précédentes**:
- **Matching Core**: Fournit les compétences matchées et manquantes
- **Transferable Skills Intelligence**: Fournit les compétences transférables
- **Gap Intelligence**: Fournit les écarts et leur gravité
- **Risk Intelligence (future)**: Fournira les risques identifiés
- **Opportunity Intelligence (future)**: Fournira les opportunités identifiées
- **Scoring Intelligence (future)**: Fournira les scores globaux

**Relation avec les intelligences suivantes**:
- **Voice Interview Engine**: Consomme le plan d'entretien préparé
- **Final Report (future)**: Utilise les résultats de l'entretien

---

## Responsabilité Unique

### Ce que Interview Preparation Intelligence fait

✅ **Comprendre ce qu'un recruteur va probablement chercher**
- Analyse le JobOfferGraph pour identifier les priorités du recruteur
- Analyse le Matching Core pour identifier les points de validation
- Analyse le Gap Intelligence pour identifier les points à tester
- Analyse le Transferable Skills Intelligence pour identifier les compétences transférables à vérifier

✅ **Déterminer quelles questions doivent être posées**
- Sélectionne les questions pertinentes basées sur les intelligences précédentes
- Priorise les questions selon la gravité des écarts
- Adapte les questions selon le niveau du candidat
- Équilibre les questions techniques et comportementales

✅ **Déterminer dans quel ordre**
- Commence par les questions de présentation
- Passe aux questions techniques
- Passe aux questions comportementales
- Termine par les questions du candidat
- Adapte l'ordre selon la priorité des écarts

✅ **Déterminer avec quel objectif**
- Chaque question a un objectif clair (valider une compétence, tester un écart, confirmer un point fort)
- L'objectif est documenté et explicable
- L'objectif est aligné avec les objectifs du recruteur

✅ **Déterminer avec quel niveau de difficulté**
- Adapte la difficulté selon le niveau du candidat
- Augmente progressivement la difficulté
- Maintient un équilibre entre questions faciles et difficiles

✅ **Déterminer quelles relances prévoir**
- Prévoit des relances pour chaque question
- Les relances sont basées sur les intelligences précédentes
- Les relances sont adaptées au niveau du candidat

✅ **Déterminer quels pièges tester**
- Identifie les pièges potentiels basés sur les écarts
- Prévoit des questions pour tester les incohérences
- Prévoit des questions pour tester les compétences transférables

✅ **Déterminer quelles compétences doivent être validées**
- Identifie les compétences à valider basées sur le Matching Core
- Identifie les compétences à valider basées sur le Gap Intelligence
- Identifie les compétences à valider basées sur le Transferable Skills Intelligence

### Ce que Interview Preparation Intelligence ne fait PAS

❌ **Ne conduit pas l'entretien**
- Le Voice Interview Engine conduit l'entretien
- Interview Preparation Intelligence prépare seulement le plan

❌ **N'analyse pas les réponses**
- Le Voice Interview Engine analyse les réponses
- Interview Preparation Intelligence ne fait pas d'analyse de réponse

❌ **Ne fait pas de coaching**
- Coaching Intelligence fait le coaching
- Interview Preparation Intelligence ne fait pas de coaching

❌ **Ne note pas le candidat**
- Scoring Intelligence note le candidat
- Interview Preparation Intelligence ne fait pas de notation

❌ **Ne modifie pas le Matching**
- Matching Core fait le matching
- Interview Preparation Intelligence ne modifie pas les résultats du matching

❌ **Ne produit pas le rapport final**
- Final Report produit le rapport final
- Interview Preparation Intelligence ne produit pas le rapport final

---

## Sources Autorisées

### Sources Consommées

Interview Preparation Intelligence consomme exclusivement:

1. **CandidateGraph**
   - Profil du candidat
   - Compétences du candidat
   - Expérience du candidat
   - Formation du candidat
   - Langues du candidat
   - Préférences du candidat

2. **JobOfferGraph**
   - Description du poste
   - Compétences requises
   - Expérience requise
   - Formation requise
   - Langues requises
   - Culture de l'entreprise
   - Priorités du recruteur

3. **Matching Core**
   - Compétences matchées
   - Compétences manquantes
   - Compétences additionnelles
   - Expérience comparée
   - Formation comparée
   - Langues comparées

4. **Transferable Skills Intelligence**
   - Compétences directement transférables
   - Compétences partiellement transférables
   - Compétences non transférables
   - Chemins de transfert
   - Confiance de transfert

5. **Gap Intelligence**
   - Écarts de compétences techniques
   - Écarts de compétences comportementales
   - Écarts d'expérience
   - Écarts de formation
   - Écarts de langues
   - Écarts de culture
   - Écarts de mobilité
   - Gravité des écarts
   - Écarts bloquants
   - Écarts compensables

6. **Planning Intelligence (future)**
   - Plan d'action recommandé
   - Priorités du plan
   - Étapes du plan

7. **Reflection Intelligence (future)**
   - Réflexions critiques sur le matching
   - Points d'attention
   - Limites de l'analyse

8. **Execution Intelligence (future)**
   - État d'exécution du plan
   - Progrès réalisés
   - Obstacles rencontrés

9. **Coaching Intelligence (future)**
   - Recommandations de coaching
   - Points à améliorer
   - Forces à mettre en avant

### Interdictions

❌ **Ne consomme aucune autre source**
- Pas de données externes
- Pas de données de marché
- Pas de données de benchmark
- Pas de données historiques

❌ **Ne reparcourt pas le CV**
- Le CV est déjà parsé dans CandidateGraph
- Aucun re-parsing nécessaire

❌ **Ne reparcourt pas l'annonce**
- L'annonce est déjà parsée dans JobOfferGraph
- Aucun re-parsing nécessaire

❌ **Ne refait pas le matching**
- Le matching est déjà fait par Matching Core
- Aucun recalcul nécessaire

❌ **Ne recalcule pas les compétences transférables**
- Les compétences transférables sont déjà calculées par Transferable Skills Intelligence
- Aucun recalcul nécessaire

❌ **Ne recalcule pas les écarts**
- Les écarts sont déjà calculés par Gap Intelligence
- Aucun recalcul nécessaire

---

## Types de Questions

### 1. Présentation

**Objectif**: Permettre au candidat de se présenter et établir un premier contact

**Pourquoi cette question existe**:
- Établir un premier contact
- Permettre au candidat de se mettre à l'aise
- Obtenir une vue d'ensemble du parcours
- Identifier les points clés à explorer

**Ce qu'elle cherche à mesurer**:
- Capacité de synthèse
- Clarté de communication
- Connaissance de soi
- Structure de pensée

**Intelligences qui la justifient**:
- CandidateGraph (parcours du candidat)
- JobOfferGraph (profil recherché)

**Preuves qui la déclenchent**:
- Toujours posée en premier
- Déclenchée par le début de l'entretien

**Niveau de difficulté**: Faible
**Temps conseillé**: 2-3 minutes

**Relances possibles**:
- "Pouvez-vous me parler d'un moment clé de votre parcours ?"
- "Qu'est-ce qui vous a amené à choisir cette orientation ?"

**Réponses attendues**:
- Présentation structurée du parcours
- Mention des expériences pertinentes
- Mention des compétences clés
- Mention des objectifs

**Réponses faibles**:
- Présentation désorganisée
- Omission d'expériences pertinentes
- Manque de clarté
- Manque de structure

**Réponses excellentes**:
- Présentation structurée et concise
- Mise en avant des expériences pertinentes
- Lien clair avec le poste
- Communication fluide

**Critères d'évaluation**:
- Clarté de la présentation
- Pertinence des informations
- Structure de la présentation
- Communication

---

### 2. Parcours

**Objectif**: Explorer en détail le parcours du candidat

**Pourquoi cette question existe**:
- Valider les expériences mentionnées
- Comprendre la progression du candidat
- Identifier les moments clés
- Valider la cohérence du parcours

**Ce qu'elle cherche à mesurer**:
- Cohérence du parcours
- Progression professionnelle
- Expérience pertinente
- Capacité d'évolution

**Intelligences qui la justifient**:
- CandidateGraph (expériences du candidat)
- JobOfferGraph (expérience requise)
- Matching Core (expérience comparée)
- Gap Intelligence (écarts d'expérience)

**Preuves qui la déclenchent**:
- Écarts d'expérience identifiés par Gap Intelligence
- Expériences pertinentes dans CandidateGraph
- Expérience requise dans JobOfferGraph

**Niveau de difficulté**: Moyen
**Temps conseillé**: 3-5 minutes

**Relances possibles**:
- "Pourquoi avoir quitté cette entreprise ?"
- "Qu'avez-vous appris dans ce poste ?"
- "Comment avez-vous évolué dans ce rôle ?"

**Réponses attendues**:
- Description détaillée des expériences
- Explication des transitions
- Mise en avant des apprentissages
- Lien avec le poste visé

**Réponses faibles**:
- Description superficielle
- Manque de détails
- Incohérences dans le parcours
- Absence de lien avec le poste

**Réponses excellentes**:
- Description détaillée et structurée
- Explications claires des transitions
- Mise en avant des apprentissages pertinents
- Lien évident avec le poste

**Critères d'évaluation**:
- Détail de la description
- Cohérence du parcours
- Pertinence des expériences
- Communication

---

### 3. Expérience

**Objectif**: Valider l'expérience pertinente pour le poste

**Pourquoi cette question existe**:
- Valider l'expérience requise
- Tester la profondeur de l'expérience
- Identifier les projets pertinents
- Valider les compétences acquises

**Ce qu'elle cherche à mesurer**:
- Profondeur de l'expérience
- Pertinence des projets
- Compétences acquises
- Capacité d'application

**Intelligences qui la justifient**:
- CandidateGraph (expériences du candidat)
- JobOfferGraph (expérience requise)
- Matching Core (expérience comparée)
- Gap Intelligence (écarts d'expérience)

**Preuves qui la déclenchent**:
- Écarts d'expérience identifiés par Gap Intelligence
- Expériences pertinentes dans CandidateGraph
- Expérience requise dans JobOfferGraph

**Niveau de difficulté**: Moyen
**Temps conseillé**: 5-7 minutes

**Relances possibles**:
- "Pouvez-vous me décrire un projet spécifique ?"
- "Quel était votre rôle dans ce projet ?"
- "Quels résultats avez-vous obtenus ?"

**Réponses attendues**:
- Description détaillée des projets
- Explication du rôle et des responsabilités
- Mise en avant des résultats
- Lien avec les compétences requises

**Réponses faibles**:
- Description superficielle des projets
- Manque de détails sur le rôle
- Absence de résultats chiffrés
- Manque de lien avec les compétences requises

**Réponses excellentes**:
- Description détaillée et structurée des projets
- Explication claire du rôle et des responsabilités
- Résultats chiffrés et mesurables
- Lien évident avec les compétences requises

**Critères d'évaluation**:
- Détail de la description
- Pertinence des projets
- Qualité des résultats
- Communication

---

### 4. Compétences Techniques

**Objectif**: Valider les compétences techniques requises

**Pourquoi cette question existe**:
- Valider les compétences techniques requises
- Tester la profondeur des connaissances
- Identifier les compétences transférables
- Tester les compétences manquantes

**Ce qu'elle cherche à mesurer**:
- Profondeur des connaissances techniques
- Capacité d'application
- Compétences transférables
- Capacité d'apprentissage

**Intelligences qui la justifient**:
- CandidateGraph (compétences du candidat)
- JobOfferGraph (compétences requises)
- Matching Core (compétences comparées)
- Transferable Skills Intelligence (compétences transférables)
- Gap Intelligence (écarts de compétences)

**Preuves qui la déclenchent**:
- Compétences manquantes identifiées par Matching Core
- Compétences transférables identifiées par Transferable Skills Intelligence
- Écarts de compétences identifiés par Gap Intelligence

**Niveau de difficulté**: Variable selon la compétence
**Temps conseillé**: 5-10 minutes par compétence

**Relances possibles**:
- "Pouvez-vous me donner un exemple d'utilisation de cette compétence ?"
- "Comment avez-vous résolu ce problème technique ?"
- "Quelles sont les limites de cette technologie ?"

**Réponses attendues**:
- Description détaillée de la compétence
- Exemples d'application
- Explication des concepts clés
- Mise en avant de l'expérience

**Réponses faibles**:
- Description superficielle de la compétence
- Absence d'exemples concrets
- Manque de compréhension des concepts
- Absence d'expérience

**Réponses excellentes**:
- Description détaillée et précise de la compétence
- Exemples concrets d'application
- Compréhension approfondie des concepts
- Expérience pertinente

**Critères d'évaluation**:
- Profondeur des connaissances
- Pertinence des exemples
- Capacité d'application
- Communication

---

### 5. Compétences Comportementales

**Objectif**: Valider les compétences comportementales requises

**Pourquoi cette question existe**:
- Valider les soft skills requises
- Tester la capacité de collaboration
- Identifier le style de travail
- Valider l'adéquation culturelle

**Ce qu'elle cherche à mesurer**:
- Capacité de collaboration
- Style de travail
- Capacité d'adaptation
- Adéquation culturelle

**Intelligences qui la justifient**:
- CandidateGraph (soft skills du candidat)
- JobOfferGraph (soft skills requises)
- Matching Core (soft skills comparées)
- Gap Intelligence (écarts de soft skills)

**Preuves qui la déclenchent**:
- Soft skills manquantes identifiées par Matching Core
- Écarts de soft skills identifiés par Gap Intelligence

**Niveau de difficulté**: Moyen
**Temps conseillé**: 5-7 minutes par compétence

**Relances possibles**:
- "Pouvez-vous me donner un exemple de collaboration ?"
- "Comment gérez-vous les conflits ?"
- "Comment vous adaptez-vous au changement ?"

**Réponses attendues**:
- Exemples concrets de situations
- Description du comportement
- Explication des résultats
- Lien avec les compétences requises

**Réponses faibles**:
- Absence d'exemples concrets
- Description vague du comportement
- Absence de résultats
- Manque de lien avec les compétences requises

**Réponses excellentes**:
- Exemples concrets et détaillés
- Description précise du comportement
- Résultats clairs et mesurables
- Lien évident avec les compétences requises

**Critères d'évaluation**:
- Pertinence des exemples
- Clarté du comportement
- Qualité des résultats
- Communication

---

### 6. Leadership

**Objectif**: Valider les compétences de leadership

**Pourquoi cette question existe**:
- Valider les compétences de leadership requises
- Tester le style de leadership
- Identifier la capacité à diriger
- Valider l'expérience de management

**Ce qu'elle cherche à mesurer**:
- Style de leadership
- Capacité à diriger
- Expérience de management
- Capacité à inspirer

**Intelligences qui la justifient**:
- CandidateGraph (expérience de leadership)
- JobOfferGraph (leadership requis)
- Matching Core (leadership comparé)
- Gap Intelligence (écarts de leadership)

**Preuves qui la déclenchent**:
- Leadership requis dans JobOfferGraph
- Écarts de leadership identifiés par Gap Intelligence
- Expérience de leadership dans CandidateGraph

**Niveau de difficulté**: Élevé
**Temps conseillé**: 7-10 minutes

**Relances possibles**:
- "Comment motivez-vous votre équipe ?"
- "Comment gérez-vous les performances ?"
- "Quelle est votre philosophie de leadership ?"

**Réponses attendues**:
- Description du style de leadership
- Exemples de situations de leadership
- Explication des résultats obtenus
- Philosophie de leadership

**Réponses faibles**:
- Description vague du style de leadership
- Absence d'exemples concrets
- Absence de résultats
- Absence de philosophie

**Réponses excellentes**:
- Description précise et cohérente du style de leadership
- Exemples concrets et détaillés
- Résultats clairs et mesurables
- Philosophie de leadership claire

**Critères d'évaluation**:
- Clarté du style de leadership
- Pertinence des exemples
- Qualité des résultats
- Communication

---

### 7. Résolution de Problème

**Objectif**: Valider la capacité de résolution de problème

**Pourquoi cette question existe**:
- Valider la capacité analytique
- Tester la méthodologie de résolution
- Identifier la créativité
- Valider la capacité à gérer l'incertitude

**Ce qu'elle cherche à mesurer**:
- Capacité analytique
- Méthodologie de résolution
- Créativité
- Capacité à gérer l'incertitude

**Intelligences qui la justifient**:
- CandidateGraph (expériences de résolution de problème)
- JobOfferGraph (résolution de problème requise)
- Matching Core (résolution de problème comparée)
- Gap Intelligence (écarts de résolution de problème)

**Preuves qui la déclenchent**:
- Résolution de problème requise dans JobOfferGraph
- Écarts de résolution de problème identifiés par Gap Intelligence

**Niveau de difficulté**: Élevé
**Temps conseillé**: 7-10 minutes

**Relances possibles**:
- "Comment avez-vous identifié le problème ?"
- "Quelles solutions avez-vous envisagées ?"
- "Comment avez-vous choisi la solution finale ?"

**Réponses attendues**:
- Description du problème
- Explication de la méthodologie
- Description des solutions envisagées
- Explication du choix final

**Réponses faibles**:
- Description superficielle du problème
- Absence de méthodologie
- Solutions limitées
- Choix non justifié

**Réponses excellentes**:
- Description précise du problème
- Méthodologie claire et structurée
- Solutions variées et créatives
- Choix justifié et réfléchi

**Critères d'évaluation**:
- Clarté de la description
- Qualité de la méthodologie
- Créativité des solutions
- Justification du choix

---

### 8. Communication

**Objectif**: Valider les compétences de communication

**Pourquoi cette question existe**:
- Valider la capacité de communication
- Tester la clarté d'expression
- Identifier la capacité d'écoute
- Valider la capacité à synthétiser

**Ce qu'elle cherche à mesurer**:
- Clarté d'expression
- Capacité d'écoute
- Capacité à synthétiser
- Adaptation au public

**Intelligences qui la justifient**:
- CandidateGraph (compétences de communication)
- JobOfferGraph (communication requise)
- Matching Core (communication comparée)
- Gap Intelligence (écarts de communication)

**Preuves qui la déclenchent**:
- Communication requise dans JobOfferGraph
- Écarts de communication identifiés par Gap Intelligence

**Niveau de difficulté**: Moyen
**Temps conseillé**: 5-7 minutes

**Relances possibles**:
- "Comment adaptez-vous votre communication ?"
- "Comment gérez-vous les malentendus ?"
- "Comment synthétisez-vous l'information ?"

**Réponses attendues**:
- Description du style de communication
- Exemples d'adaptation
- Explication de la méthode de synthèse
- Lien avec les compétences requises

**Réponses faibles**:
- Description vague du style de communication
- Absence d'exemples d'adaptation
- Absence de méthode de synthèse
- Manque de lien avec les compétences requises

**Réponses excellentes**:
- Description précise du style de communication
- Exemples concrets d'adaptation
- Méthode de synthèse claire
- Lien évident avec les compétences requises

**Critères d'évaluation**:
- Clarté de l'expression
- Pertinence des exemples
- Qualité de la synthèse
- Communication

---

### 9. Gestion du Stress

**Objectif**: Valider la capacité à gérer le stress

**Pourquoi cette question existe**:
- Valider la résilience
- Tester la capacité à gérer la pression
- Identifier les mécanismes de coping
- Valider la stabilité émotionnelle

**Ce qu'elle cherche à mesurer**:
- Résilience
- Capacité à gérer la pression
- Mécanismes de coping
- Stabilité émotionnelle

**Intelligences qui la justifient**:
- CandidateGraph (expériences de gestion du stress)
- JobOfferGraph (gestion du stress requise)
- Matching Core (gestion du stress comparée)
- Gap Intelligence (écarts de gestion du stress)

**Preuves qui la déclenchent**:
- Gestion du stress requise dans JobOfferGraph
- Écarts de gestion du stress identifiés par Gap Intelligence

**Niveau de difficulté**: Moyen
**Temps conseillé**: 5-7 minutes

**Relances possibles**:
- "Comment gérez-vous les deadlines serrées ?"
- "Quels sont vos mécanismes de coping ?"
- "Comment restez-vous calme sous pression ?"

**Réponses attendues**:
- Description des situations stressantes
- Explication des mécanismes de coping
- Exemples de gestion réussie
- Lien avec les compétences requises

**Réponses faibles**:
- Description vague des situations stressantes
- Absence de mécanismes de coping
- Absence d'exemples concrets
- Manque de lien avec les compétences requises

**Réponses excellentes**:
- Description précise des situations stressantes
- Mécanismes de coping clairs et variés
- Exemples concrets de gestion réussie
- Lien évident avec les compétences requises

**Critères d'évaluation**:
- Pertinence des exemples
- Qualité des mécanismes de coping
- Capacité de résilience
- Communication

---

### 10. Gestion de Conflit

**Objectif**: Valider la capacité à gérer les conflits

**Pourquoi cette question existe**:
- Valider la capacité à gérer les conflits
- Tester la diplomatie
- Identifier la capacité à négocier
- Valider la capacité à résoudre les problèmes interpersonnels

**Ce qu'elle cherche à mesurer**:
- Capacité à gérer les conflits
- Diplomatie
- Capacité à négocier
- Capacité à résoudre les problèmes interpersonnels

**Intelligences qui la justifient**:
- CandidateGraph (expériences de gestion de conflit)
- JobOfferGraph (gestion de conflit requise)
- Matching Core (gestion de conflit comparée)
- Gap Intelligence (écarts de gestion de conflit)

**Preuves qui la déclenchent**:
- Gestion de conflit requise dans JobOfferGraph
- Écarts de gestion de conflit identifiés par Gap Intelligence

**Niveau de difficulté**: Élevé
**Temps conseillé**: 7-10 minutes

**Relances possibles**:
- "Comment avez-vous géré ce conflit ?"
- "Quelle a été l'issue ?"
- "Qu'avez-vous appris de cette expérience ?"

**Réponses attendues**:
- Description du conflit
- Explication de la méthode de gestion
- Description de l'issue
- Leçons apprises

**Réponses faibles**:
- Description superficielle du conflit
- Absence de méthode de gestion
- Issue non claire
- Absence de leçons apprises

**Réponses excellentes**:
- Description précise du conflit
- Méthode de gestion claire et diplomate
- Issue positive et constructive
- Leçons apprises pertinentes

**Critères d'évaluation**:
- Pertinence de l'exemple
- Qualité de la méthode de gestion
- Qualité de l'issue
- Communication

---

### 11. Culture d'Entreprise

**Objectif**: Valider l'adéquation culturelle

**Pourquoi cette question existe**:
- Valider l'adéquation culturelle
- Tester la compréhension de la culture
- Identifier les valeurs partagées
- Valider la capacité d'intégration

**Ce qu'elle cherche à mesurer**:
- Adéquation culturelle
- Compréhension de la culture
- Valeurs partagées
- Capacité d'intégration

**Intelligences qui la justifient**:
- CandidateGraph (valeurs du candidat)
- JobOfferGraph (culture de l'entreprise)
- Matching Core (culture comparée)
- Gap Intelligence (écarts de culture)

**Preuves qui la déclenchent**:
- Culture spécifique dans JobOfferGraph
- Écarts de culture identifiés par Gap Intelligence

**Niveau de difficulté**: Moyen
**Temps conseillé**: 5-7 minutes

**Relances possibles**:
- "Qu'est-ce qui vous attire dans notre culture ?"
- "Comment vous intégrez-vous dans une équipe ?"
- "Quelles sont vos valeurs professionnelles ?"

**Réponses attendues**:
- Compréhension de la culture
- Valeurs partagées
- Exemples d'intégration
- Lien avec les valeurs de l'entreprise

**Réponses faibles**:
- Compréhension superficielle de la culture
- Absence de valeurs partagées
- Absence d'exemples d'intégration
- Manque de lien avec les valeurs de l'entreprise

**Réponses excellentes**:
- Compréhension approfondie de la culture
- Valeurs clairement partagées
- Exemples concrets d'intégration
- Lien évident avec les valeurs de l'entreprise

**Critères d'évaluation**:
- Compréhension de la culture
- Pertinence des valeurs
- Qualité des exemples
- Communication

---

### 12. Motivation

**Objectif**: Valider la motivation pour le poste

**Pourquoi cette question existe**:
- Valider la motivation
- Tester la compréhension du poste
- Identifier les objectifs
- Valider l'engagement

**Ce qu'elle cherche à mesurer**:
- Motivation
- Compréhension du poste
- Objectifs
- Engagement

**Intelligences qui la justifient**:
- CandidateGraph (objectifs du candidat)
- JobOfferGraph (description du poste)
- Matching Core (adéquation poste/candidat)

**Preuves qui la déclenchent**:
- Toujours posée
- Déclenchée par la motivation du candidat

**Niveau de difficulté**: Moyen
**Temps conseillé**: 5-7 minutes

**Relances possibles**:
- "Pourquoi ce poste en particulier ?"
- "Qu'est-ce qui vous motive dans ce rôle ?"
- "Quels sont vos objectifs à long terme ?"

**Réponses attendues**:
- Compréhension du poste
- Motivation claire
- Objectifs pertinents
- Engagement

**Réponses faibles**:
- Compréhension superficielle du poste
- Motivation vague
- Objectifs non pertinents
- Manque d'engagement

**Réponses excellentes**:
- Compréhension approfondie du poste
- Motivation claire et pertinente
- Objectifs pertinents et réalistes
- Engagement évident

**Critères d'évaluation**:
- Compréhension du poste
- Pertinence de la motivation
- Qualité des objectifs
- Communication

---

### 13. Projet Réalisé

**Objectif**: Explorer en détail un projet réalisé

**Pourquoi cette question existe**:
- Valider l'expérience pratique
- Tester la capacité à décrire un projet
- Identifier les compétences appliquées
- Valider les résultats

**Ce qu'elle cherche à mesurer**:
- Expérience pratique
- Capacité à décrire un projet
- Compétences appliquées
- Résultats

**Intelligences qui la justifient**:
- CandidateGraph (projets du candidat)
- JobOfferGraph (projets requis)
- Matching Core (projets comparés)
- Gap Intelligence (écarts de projets)

**Preuves qui la déclenchent**:
- Projets pertinents dans CandidateGraph
- Projets requis dans JobOfferGraph
- Écarts de projets identifiés par Gap Intelligence

**Niveau de difficulté**: Moyen
**Temps conseillé**: 7-10 minutes

**Relances possibles**:
- "Quel était votre rôle dans ce projet ?"
- "Quels défis avez-vous rencontrés ?"
- "Quels résultats avez-vous obtenus ?"

**Réponses attendues**:
- Description détaillée du projet
- Explication du rôle
- Description des défis
- Résultats clairs

**Réponses faibles**:
- Description superficielle du projet
- Rôle non clair
- Absence de défis
- Résultats non clairs

**Réponses excellentes**:
- Description détaillée et structurée du projet
- Rôle clair et précis
- Défis pertinents et bien décrits
- Résultats clairs et mesurables

**Critères d'évaluation**:
- Détail de la description
- Clarté du rôle
- Pertinence des défis
- Qualité des résultats

---

### 14. Situation STAR

**Objectif**: Valider une compétence spécifique via la méthode STAR

**Pourquoi cette question existe**:
- Valider une compétence spécifique
- Tester la capacité à structurer une réponse
- Identifier les comportements passés
- Valider les résultats

**Ce qu'elle cherche à mesurer**:
- Compétence spécifique
- Capacité à structurer une réponse
- Comportements passés
- Résultats

**Intelligences qui la justifient**:
- CandidateGraph (compétences du candidat)
- JobOfferGraph (compétences requises)
- Matching Core (compétences comparées)
- Gap Intelligence (écarts de compétences)

**Preuves qui la déclenchent**:
- Compétences spécifiques à valider
- Écarts de compétences identifiés par Gap Intelligence

**Niveau de difficulté**: Variable selon la compétence
**Temps conseillé**: 5-7 minutes

**Relances possibles**:
- "Quelle était la situation exacte ?"
- "Quelle action avez-vous prise ?"
- "Quel a été le résultat ?"

**Réponses attendues**:
- Situation clairement décrite
- Tâche bien définie
- Action détaillée
- Résultat mesurable

**Réponses faibles**:
- Situation vague
- Tâche non définie
- Action superficielle
- Résultat non mesurable

**Réponses excellentes**:
- Situation précise et contextuelle
- Tâche clairement définie
- Action détaillée et pertinente
- Résultat mesurable et significatif

**Critères d'évaluation**:
- Clarté de la situation
- Pertinence de la tâche
- Qualité de l'action
- Mesurabilité du résultat

---

### 15. Questions Pièges

**Objectif**: Tester les incohérences et les compétences réelles

**Pourquoi cette question existe**:
- Identifier les incohérences
- Tester les compétences réelles
- Valider l'honnêteté
- Tester la réactivité

**Ce qu'elle cherche à mesurer**:
- Cohérence
- Compétences réelles
- Honnêteté
- Réactivité

**Intelligences qui la justifient**:
- CandidateGraph (incohérences potentielles)
- JobOfferGraph (points sensibles)
- Matching Core (incohérences identifiées)
- Gap Intelligence (écarts critiques)

**Preuves qui la déclenchent**:
- Incohérences identifiées par Matching Core
- Écarts critiques identifiés par Gap Intelligence
- Points sensibles dans JobOfferGraph

**Niveau de difficulté**: Élevé
**Temps conseillé**: 3-5 minutes

**Relances possibles**:
- "Pouvez-vous préciser ce point ?"
- "Comment conciliez-vous ces deux affirmations ?"
- "Quelle est votre expérience réelle avec cette technologie ?"

**Réponses attendues**:
- Réponse cohérente
- Honnêteté sur les limites
- Capacité à clarifier
- Réactivité

**Réponses faibles**:
- Réponse incohérente
- Exagération des compétences
- Incapacité à clarifier
- Manque de réactivité

**Réponses excellentes**:
- Réponse cohérente et honnête
- Reconnaissance des limites
- Capacité à clarifier rapidement
- Réactivité et adaptabilité

**Critères d'évaluation**:
- Cohérence de la réponse
- Honnêteté
- Capacité à clarifier
- Réactivité

---

### 16. Questions Ouvertes

**Objectif**: Permettre au candidat de s'exprimer librement

**Pourquoi cette question existe**:
- Permettre au candidat de s'exprimer
- Identifier les points forts
- Tester la capacité de synthèse
- Valider la motivation

**Ce qu'elle cherche à mesurer**:
- Capacité d'expression
- Points forts
- Capacité de synthèse
- Motivation

**Intelligences qui la justifient**:
- CandidateGraph (points forts du candidat)
- JobOfferGraph (points à valoriser)
- Matching Core (points forts identifiés)

**Preuves qui la déclenchent**:
- Points forts identifiés par Matching Core
- Moments stratégiques de l'entretien

**Niveau de difficulté**: Variable
**Temps conseillé**: 3-5 minutes

**Relances possibles**:
- "Pouvez-vous développer ce point ?"
- "Qu'est-ce qui vous rend unique ?"
- "Quelle est votre plus grande force ?"

**Réponses attendues**:
- Expression claire
- Mise en avant des points forts
- Capacité de synthèse
- Motivation

**Réponses faibles**:
- Expression confuse
- Absence de mise en avant des points forts
- Manque de synthèse
- Manque de motivation

**Réponses excellentes**:
- Expression claire et fluide
- Mise en avant pertinente des points forts
- Synthèse efficace
- Motivation évidente

**Critères d'évaluation**:
- Clarté de l'expression
- Pertinence des points forts
- Qualité de la synthèse
- Communication

---

### 17. Questions Fermées

**Objectif**: Obtenir des informations précises

**Pourquoi cette question existe**:
- Obtenir des informations précises
- Valider des faits
- Tester la connaissance
- Clarifier des points

**Ce qu'elle cherche à mesurer**:
- Précision
- Connaissance
- Honnêteté
- Clarté

**Intelligences qui la justifient**:
- CandidateGraph (informations à valider)
- JobOfferGraph (informations requises)
- Matching Core (informations à vérifier)

**Preuves qui la déclenchent**:
- Informations à valider
- Points à clarifier

**Niveau de difficulté**: Faible
**Temps conseillé**: 1-2 minutes

**Relances possibles**:
- "Pouvez-vous préciser ?"
- "Êtes-vous sûr de cette information ?"
- "Comment savez-vous cela ?"

**Réponses attendues**:
- Réponse précise
- Connaissance
- Honnêteté
- Clarté

**Réponses faibles**:
- Réponse imprécise
- Manque de connaissance
- Exagération
- Manque de clarté

**Réponses excellentes**:
- Réponse précise et exacte
- Connaissance approfondie
- Honnêteté totale
- Clarté totale

**Critères d'évaluation**:
- Précision de la réponse
- Connaissance
- Honnêteté
- Clarté

---

### 18. Questions de Relance

**Objectif**: Approfondir une réponse précédente

**Pourquoi cette question existe**:
- Approfondir une réponse
- Clarifier un point
- Tester la profondeur
- Valider la cohérence

**Ce qu'elle cherche à mesurer**:
- Profondeur de la connaissance
- Capacité à clarifier
- Cohérence
- Capacité d'analyse

**Intelligences qui la justifient**:
- CandidateGraph (points à approfondir)
- JobOfferGraph (points à clarifier)
- Matching Core (incohérences potentielles)

**Preuves qui la déclenchent**:
- Réponse superficielle
- Point à clarifier
- Incohérence potentielle

**Niveau de difficulté**: Variable
**Temps conseillé**: 2-3 minutes

**Relances possibles**:
- "Pouvez-vous développer ?"
- "Comment êtes-vous arrivé à cette conclusion ?"
- "Quels sont les détails ?"

**Réponses attendues**:
- Approfondissement pertinent
- Clarification efficace
- Cohérence
- Capacité d'analyse

**Réponses faibles**:
- Absence d'approfondissement
- Clarification inefficace
- Incohérence
- Manque d'analyse

**Réponses excellentes**:
- Approfondissement pertinent et détaillé
- Clarification efficace
- Cohérence totale
- Capacité d'analyse évidente

**Critères d'évaluation**:
- Pertinence de l'approfondissement
- Qualité de la clarification
- Cohérence
- Capacité d'analyse

---

### 19. Questions de Clarification

**Objectif**: Clarifier un point ambigu

**Pourquoi cette question existe**:
- Clarifier un point ambigu
- Éviter les malentendus
- Valider la compréhension
- Tester la précision

**Ce qu'elle cherche à mesurer**:
- Précision
- Capacité à clarifier
- Compréhension
- Communication

**Intelligences qui la justifient**:
- CandidateGraph (points ambigus)
- JobOfferGraph (points à clarifier)
- Matching Core (incohérences potentielles)

**Preuves qui la déclenchent**:
- Point ambigu
- Incohérence potentielle
- Information à valider

**Niveau de difficulté**: Faible
**Temps conseillé**: 1-2 minutes

**Relances possibles**:
- "Pouvez-vous préciser ce point ?"
- "Que voulez-vous dire par là ?"
- "Comment interprétez-vous cela ?"

**Réponses attendues**:
- Clarification précise
- Compréhension claire
- Communication efficace
- Précision

**Réponses faibles**:
- Clarification vague
- Manque de compréhension
- Communication inefficace
- Manque de précision

**Réponses excellentes**:
- Clarification précise et efficace
- Compréhension claire
- Communication fluide
- Précision totale

**Critères d'évaluation**:
- Qualité de la clarification
- Compréhension
- Communication
- Précision

---

### 20. Questions Finales

**Objectif**: Permettre au candidat de poser des questions

**Pourquoi cette question existe**:
- Permettre au candidat de poser des questions
- Tester l'intérêt du candidat
- Identifier les préoccupations
- Valider la compréhension du poste

**Ce qu'elle cherche à mesurer**:
- Intérêt
- Compréhension du poste
- Préoccupations
- Engagement

**Intelligences qui la justifient**:
- CandidateGraph (intérêts du candidat)
- JobOfferGraph (points à clarifier pour le candidat)
- Matching Core (adéquation poste/candidat)

**Preuves qui la déclenchent**:
- Toujours posée à la fin
- Déclenchée par la fin de l'entretien

**Niveau de difficulté**: Variable
**Temps conseillé**: 5-7 minutes

**Relances possibles**:
- "Avez-vous d'autres questions ?"
- "Y a-t-il quelque chose que vous aimeriez savoir ?"
- "Quelles sont vos préoccupations ?"

**Réponses attendues**:
- Questions pertinentes
- Intérêt évident
- Compréhension du poste
- Engagement

**Réponses faibles**:
- Absence de questions
- Questions non pertinentes
- Manque d'intérêt
- Manque de compréhension

**Réponses excellentes**:
- Questions pertinentes et réfléchies
- Intérêt évident
- Compréhension approfondie du poste
- Engagement évident

**Critères d'évaluation**:
- Pertinence des questions
- Intérêt
- Compréhension du poste
- Engagement

---

### 21. Questions du Candidat

**Objectif**: Répondre aux questions du candidat

**Pourquoi cette question existe**:
- Répondre aux questions du candidat
- Clarifier les points du poste
- Valider l'intérêt
- Renforcer l'engagement

**Ce qu'elle cherche à mesurer**:
- Intérêt
- Compréhension du poste
- Engagement
- Pertinence des questions

**Intelligences qui la justifient**:
- CandidateGraph (intérêts du candidat)
- JobOfferGraph (points à clarifier)
- Matching Core (adéquation poste/candidat)

**Preuves qui la déclenchent**:
- Questions posées par le candidat
- Points à clarifier identifiés

**Niveau de difficulté**: Variable
**Temps conseillé**: 5-7 minutes

**Relances possibles**:
- "Est-ce que cela répond à votre question ?"
- "Y a-t-il autre chose que vous aimeriez savoir ?"
- "Comment cela influence-t-il votre décision ?"

**Réponses attendues**:
- Questions pertinentes
- Intérêt évident
- Compréhension du poste
- Engagement

**Réponses faibles**:
- Questions non pertinentes
- Manque d'intérêt
- Manque de compréhension
- Manque d'engagement

**Réponses excellentes**:
- Questions pertinentes et réfléchies
- Intérêt évident
- Compréhension approfondie du poste
- Engagement évident

**Critères d'évaluation**:
- Pertinence des questions
- Intérêt
- Compréhension du poste
- Engagement

---

## Stratégie Complète d'Entretien

### Construction de l'Ordre des Questions

**Ordre recommandé**:

1. **Présentation** (2-3 minutes)
   - Pourquoi: Établir un premier contact, permettre au candidat de se mettre à l'aise
   - Objectif: Obtenir une vue d'ensemble du parcours

2. **Parcours** (3-5 minutes)
   - Pourquoi: Valider les expériences mentionnées, comprendre la progression
   - Objectif: Identifier les points clés à explorer

3. **Expérience** (5-7 minutes)
   - Pourquoi: Valider l'expérience pertinente pour le poste
   - Objectif: Tester la profondeur de l'expérience

4. **Compétences Techniques** (5-10 minutes par compétence)
   - Pourquoi: Valider les compétences techniques requises
   - Objectif: Tester la profondeur des connaissances techniques

5. **Compétences Comportementales** (5-7 minutes par compétence)
   - Pourquoi: Valider les soft skills requises
   - Objectif: Tester la capacité de collaboration

6. **Leadership** (7-10 minutes) - si requis
   - Pourquoi: Valider les compétences de leadership
   - Objectif: Tester le style de leadership

7. **Résolution de Problème** (7-10 minutes)
   - Pourquoi: Valider la capacité de résolution de problème
   - Objectif: Tester la capacité analytique

8. **Communication** (5-7 minutes)
   - Pourquoi: Valider les compétences de communication
   - Objectif: Tester la clarté d'expression

9. **Gestion du Stress** (5-7 minutes) - si requis
   - Pourquoi: Valider la capacité à gérer le stress
   - Objectif: Tester la résilience

10. **Gestion de Conflit** (7-10 minutes) - si requis
    - Pourquoi: Valider la capacité à gérer les conflits
    - Objectif: Tester la diplomatie

11. **Culture d'Entreprise** (5-7 minutes)
    - Pourquoi: Valider l'adéquation culturelle
    - Objectif: Tester la compréhension de la culture

12. **Motivation** (5-7 minutes)
    - Pourquoi: Valider la motivation pour le poste
    - Objectif: Tester la compréhension du poste

13. **Projet Réalisé** (7-10 minutes)
    - Pourquoi: Explorer en détail un projet réalisé
    - Objectif: Valider l'expérience pratique

14. **Situation STAR** (5-7 minutes par compétence)
    - Pourquoi: Valider une compétence spécifique via la méthode STAR
    - Objectif: Tester les comportements passés

15. **Questions Pièges** (3-5 minutes) - si nécessaire
    - Pourquoi: Tester les incohérences et les compétences réelles
    - Objectif: Valider l'honnêteté

16. **Questions Ouvertes** (3-5 minutes)
    - Pourquoi: Permettre au candidat de s'exprimer librement
    - Objectif: Identifier les points forts

17. **Questions Finales** (5-7 minutes)
    - Pourquoi: Permettre au candidat de poser des questions
    - Objectif: Tester l'intérêt du candidat

18. **Questions du Candidat** (5-7 minutes)
    - Pourquoi: Répondre aux questions du candidat
    - Objectif: Clarifier les points du poste

### Pourquoi Commencer par Certaines Questions

**Présentation en premier**:
- Établit un premier contact
- Permet au candidat de se mettre à l'aise
- Donne une vue d'ensemble du parcours
- Identifie les points clés à explorer

**Parcours et Expérience ensuite**:
- Valide les expériences mentionnées
- Comprend la progression du candidat
- Identifie les moments clés
- Valide la cohérence du parcours

**Compétences Techniques ensuite**:
- Valide les compétences techniques requises
- Teste la profondeur des connaissances
- Identifie les compétences transférables
- Teste les compétences manquantes

**Compétences Comportementales ensuite**:
- Valide les soft skills requises
- Teste la capacité de collaboration
- Identifie le style de travail
- Valide l'adéquation culturelle

### Pourquoi Garder Certaines Questions pour la Fin

**Questions Pièges à la fin**:
- Le candidat est plus détendu
- Les réponses sont plus spontanées
- Moins de temps pour préparer une réponse
- Meilleure détection des incohérences

**Questions Finales à la fin**:
- Permet au candidat de poser des questions
- Teste l'intérêt du candidat
- Identifie les préoccupations
- Valide la compréhension du poste

**Questions du Candidat à la fin**:
- Répond aux questions du candidat
- Clarifie les points du poste
- Valide l'intérêt
- Renforce l'engagement

### Comment Adapter la Difficulté

**Progression de la difficulté**:
- Commencer par des questions faciles (présentation, parcours)
- Passer à des questions moyennes (expérience, compétences)
- Terminer par des questions difficiles (leadership, résolution de problème)

**Adaptation selon le niveau du candidat**:
- Si le candidat est junior: questions plus faciles, plus de guidance
- Si le candidat est senior: questions plus difficiles, moins de guidance
- Si le candidat est expert: questions très difficiles, aucune guidance

**Adaptation selon les réponses**:
- Si le candidat répond bien: augmenter la difficulté
- Si le candidat répond mal: diminuer la difficulté
- Si le candidat hésite: donner des indices

### Comment Tester un Point Faible

**Identification du point faible**:
- Basé sur Gap Intelligence
- Basé sur Matching Core
- Basé sur Transferable Skills Intelligence

**Stratégie de test**:
- Poser une question spécifique sur le point faible
- Utiliser des questions pièges pour tester la profondeur
- Poser des relances pour tester la cohérence
- Utiliser des questions STAR pour valider les comportements

**Exemple**:
- Point faible: Compétence X manquante
- Question: "Pouvez-vous me décrire une situation où vous avez utilisé la compétence X ?"
- Relance: "Comment avez-vous appris cette compétence ?"
- Question piège: "Quelle est votre expérience réelle avec cette compétence ?"

### Comment Confirmer un Point Fort

**Identification du point fort**:
- Basé sur Matching Core
- Basé sur CandidateGraph
- Basé sur Gap Intelligence (absence d'écart)

**Stratégie de confirmation**:
- Poser une question spécifique sur le point fort
- Utiliser des questions ouvertes pour explorer en détail
- Poser des relances pour tester la profondeur
- Utiliser des questions STAR pour valider les comportements

**Exemple**:
- Point fort: Compétence X excellente
- Question: "Pouvez-vous me décrire un projet où vous avez excellé avec la compétence X ?"
- Relance: "Quels résultats avez-vous obtenus ?"
- Question ouverte: "Comment avez-vous développé cette compétence ?"

### Comment Vérifier une Compétence Transférable

**Identification de la compétence transférable**:
- Basé sur Transferable Skills Intelligence
- Basé sur Matching Core
- Basé sur Gap Intelligence

**Stratégie de vérification**:
- Poser une question sur la compétence source
- Poser une question sur la compétence cible
- Poser une question sur le transfert
- Utiliser des questions pièges pour tester la compréhension

**Exemple**:
- Compétence transférable: Docker → Kubernetes
- Question: "Pouvez-vous me décrire votre expérience avec Docker ?"
- Question: "Avez-vous utilisé Kubernetes ?"
- Question: "Comment Docker vous aide-t-il à comprendre Kubernetes ?"
- Question piège: "Quelle est votre expérience réelle avec Kubernetes ?"

### Comment Vérifier une Incohérence

**Identification de l'incohérence**:
- Basé sur Matching Core
- Basé sur Gap Intelligence
- Basé sur CandidateGraph

**Stratégie de vérification**:
- Poser une question sur le point incohérent
- Poser une relance pour clarifier
- Poser une question piège pour tester l'honnêteté
- Comparer les réponses avec les informations disponibles

**Exemple**:
- Incohérence: Candidat dit avoir 5 ans d'expérience mais CV montre 2 ans
- Question: "Pouvez-vous me décrire votre expérience avec cette technologie ?"
- Relance: "Depuis quand utilisez-vous cette technologie ?"
- Question piège: "Quelle est votre expérience réelle avec cette technologie ?"

### Comment Éviter les Doublons

**Stratégie d'évitement**:
- Utiliser un registre des questions posées
- Vérifier avant de poser une question si elle a déjà été posée
- Adapter les questions pour éviter les répétitions
- Utiliser des relances au lieu de poser des questions similaires

**Exemple**:
- Question déjà posée: "Pouvez-vous me décrire votre expérience avec React ?"
- Au lieu de poser: "Quelle est votre expérience avec React ?"
- Poser: "Comment avez-vous utilisé React dans votre dernier projet ?"

### Comment Limiter la Durée

**Stratégie de limitation**:
- Définir une durée maximale pour l'entretien (ex: 60 minutes)
- Allouer un temps spécifique à chaque catégorie de questions
- Prioriser les questions les plus importantes
- Éliminer les questions moins pertinentes si le temps est limité

**Exemple**:
- Durée totale: 60 minutes
- Présentation: 3 minutes
- Parcours: 5 minutes
- Expérience: 7 minutes
- Compétences Techniques: 20 minutes
- Compétences Comportementales: 15 minutes
- Questions Finales: 10 minutes

### Comment Équilibrer Technique et Comportemental

**Stratégie d'équilibre**:
- Définir un ratio technique/comportemental (ex: 60/40)
- Allouer un temps spécifique à chaque type
- Adapter le ratio selon le poste (plus technique pour les postes techniques)
- Adapter le ratio selon le niveau (plus comportemental pour les postes senior)

**Exemple**:
- Poste technique senior: 50% technique, 50% comportemental
- Poste technique junior: 70% technique, 30% comportemental
- Poste non-technique: 30% technique, 70% comportemental

---

## Préparation du Futur Voice Interview Engine

### Structure de Sortie pour Voice Interview Engine

Interview Preparation Intelligence fournira au Voice Interview Engine:

#### 1. Interview Plan

```typescript
interface InterviewPlan {
  id: string;
  candidateId: string;
  jobOfferId: string;
  duration: number; // en minutes
  strategy: InterviewStrategy;
  questionQueue: Question[];
  priorityQueue: Question[];
  expectedSkills: ExpectedSkill[];
  expectedEvidence: ExpectedEvidence[];
  recruiterObjectives: RecruiterObjective[];
  conversationStrategy: ConversationStrategy;
  difficultyLevel: DifficultyLevel;
  adaptiveRules: AdaptiveRule[];
  fallbackQuestions: Question[];
  followUpQuestions: FollowUpQuestion[];
  stopConditions: StopCondition[];
  metadata: InterviewPlanMetadata;
}
```

#### 2. Question Queue

```typescript
interface Question {
  id: string;
  type: QuestionType;
  category: QuestionCategory;
  text: string;
  objective: string;
  difficulty: DifficultyLevel;
  suggestedDuration: number; // en minutes
  priority: Priority;
  followUps: FollowUpQuestion[];
  expectedAnswers: ExpectedAnswer[];
  evaluationCriteria: EvaluationCriteria[];
  explainability: QuestionExplainability;
}
```

#### 3. Priority Queue

```typescript
interface PriorityQueue {
  critical: Question[];
  high: Question[];
  medium: Question[];
  low: Question[];
}
```

#### 4. Expected Skills

```typescript
interface ExpectedSkill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  source: "matching_core" | "transferable_skills" | "gap_intelligence";
  importance: Importance;
  validationMethod: ValidationMethod;
  explainability: SkillExplainability;
}
```

#### 5. Expected Evidence

```typescript
interface ExpectedEvidence {
  id: string;
  skillId: string;
  type: EvidenceType;
  description: string;
  source: EvidenceSource;
  confidence: number;
  explainability: EvidenceExplainability;
}
```

#### 6. Recruiter Objectives

```typescript
interface RecruiterObjective {
  id: string;
  description: string;
  priority: Priority;
  category: ObjectiveCategory;
  source: ObjectiveSource;
  explainability: ObjectiveExplainability;
}
```

#### 7. Conversation Strategy

```typescript
interface ConversationStrategy {
  openingStrategy: OpeningStrategy;
  progressionStrategy: ProgressionStrategy;
  difficultyStrategy: DifficultyStrategy;
  balanceStrategy: BalanceStrategy;
  closingStrategy: ClosingStrategy;
  explainability: StrategyExplainability;
}
```

#### 8. Difficulty Level

```typescript
type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";

interface DifficultyLevel {
  level: DifficultyLevel;
  rationale: string;
  source: DifficultySource;
  explainability: DifficultyExplainability;
}
```

#### 9. Adaptive Rules

```typescript
interface AdaptiveRule {
  id: string;
  condition: AdaptiveCondition;
  action: AdaptiveAction;
  priority: Priority;
  explainability: AdaptiveRuleExplainability;
}
```

#### 10. Fallback Questions

```typescript
interface FallbackQuestion {
  id: string;
  triggerCondition: TriggerCondition;
  question: Question;
  priority: Priority;
  explainability: FallbackQuestionExplainability;
}
```

#### 11. Follow-up Questions

```typescript
interface FollowUpQuestion {
  id: string;
  parentQuestionId: string;
  triggerCondition: TriggerCondition;
  question: Question;
  priority: Priority;
  explainability: FollowUpQuestionExplainability;
}
```

#### 12. Stop Conditions

```typescript
interface StopCondition {
  id: string;
  type: StopConditionType;
  condition: StopConditionTrigger;
  action: StopAction;
  priority: Priority;
  explainability: StopConditionExplainability;
}
```

#### 13. Maximum Duration

```typescript
interface MaximumDuration {
  total: number; // en minutes
  perQuestion: number; // en minutes
  perCategory: Record<QuestionCategory, number>; // en minutes
  explainability: DurationExplainability;
}
```

### Explainability pour Voice Interview Engine

Chaque élément fourni au Voice Interview Engine doit être explicable:

#### QuestionExplainability

```typescript
interface QuestionExplainability {
  source: string; // ex: "Gap Intelligence", "Matching Core"
  proof: string; // ex: "Gap identified: React missing (severity: high)"
  confidence: number; // 0-100
  explanation: string; // ex: "Question asked to validate React skill"
  reasoning: string; // ex: "React is a critical skill for this position"
  consultedIntelligences: string[]; // ex: ["Matching Core", "Gap Intelligence"]
  limitations: string[]; // ex: ["Question may not capture all aspects of React skill"]
  priority: string; // ex: "high"
}
```

#### SkillExplainability

```typescript
interface SkillExplainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
  reasoning: string;
  consultedIntelligences: string[];
  limitations: string[];
}
```

#### EvidenceExplainability

```typescript
interface EvidenceExplainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
  reasoning: string;
  consultedIntelligences: string[];
  limitations: string[];
}
```

#### ObjectiveExplainability

```typescript
interface ObjectiveExplainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
  reasoning: string;
  consultedIntelligences: string[];
  limitations: string[];
}
```

#### StrategyExplainability

```typescript
interface StrategyExplainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
  reasoning: string;
  consultedIntelligences: string[];
  limitations: string[];
}
```

---

## Boundary Validation

### Comparaison avec les Intelligences Existantes

#### Planning Intelligence

**Planning Intelligence fait**:
- Transforme les recommandations en plan d'action
- Définit les étapes pour combler les écarts
- Priorise les actions
- Suit l'exécution du plan

**Planning Intelligence ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- Ne transforme pas les recommandations en plan d'action
- Ne définit pas les étapes pour combler les écarts
- Ne suit pas l'exécution du plan

**Relation**: Planning Intelligence et Interview Preparation Intelligence sont indépendants. Planning Intelligence se concentre sur le développement du candidat, Interview Preparation Intelligence se concentre sur l'entretien.

---

#### Execution Intelligence

**Execution Intelligence fait**:
- Exécute les plans d'action
- Suit les progrès
- Identifie les obstacles
- Adapte le plan

**Execution Intelligence ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- N'exécute pas les plans d'action
- Ne suit pas les progrès
- N'identifie pas les obstacles

**Relation**: Execution Intelligence et Interview Preparation Intelligence sont indépendants. Execution Intelligence se concentre sur l'exécution du plan de développement, Interview Preparation Intelligence se concentre sur l'entretien.

---

#### Coaching Intelligence

**Coaching Intelligence fait**:
- Fournit du coaching personnalisé
- Identifie les points à améliorer
- Suggère des améliorations
- Suit les progrès du coaching

**Coaching Intelligence ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- Ne fournit pas de coaching personnalisé
- N'identifie pas les points à améliorer
- Ne suggère pas d'améliorations

**Relation**: Coaching Intelligence et Interview Preparation Intelligence sont indépendants. Coaching Intelligence se concentre sur le coaching du candidat, Interview Preparation Intelligence se concentre sur l'entretien.

---

#### Reflection Intelligence

**Reflection Intelligence fait**:
- Réfléchit de manière critique sur les recommandations
- Identifie les points d'attention
- Évalue la qualité de l'analyse
- Suggère des améliorations

**Reflection Intelligence ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- Ne réfléchit pas de manière critique sur les recommandations
- N'identifie pas les points d'attention
- N'évalue pas la qualité de l'analyse

**Relation**: Reflection Intelligence et Interview Preparation Intelligence sont indépendants. Reflection Intelligence se concentre sur la réflexion critique, Interview Preparation Intelligence se concentre sur l'entretien.

---

#### Gap Intelligence

**Gap Intelligence fait**:
- Identifie les écarts entre le candidat et l'offre
- Qualifie les écarts (gravité, bloquant, compensable)
- Explique pourquoi les écarts existent
- Estime le temps d'apprentissage

**Gap Intelligence ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- N'identifie pas les écarts
- Ne qualifie pas les écarts
- N'explique pas pourquoi les écarts existent

**Relation**: Interview Preparation Intelligence consomme les résultats de Gap Intelligence pour préparer l'entretien. Gap Intelligence identifie les écarts, Interview Preparation Intelligence utilise ces écarts pour déterminer les questions à poser.

---

#### Matching Intelligence

**Matching Intelligence fait**:
- Compare les compétences du candidat avec l'offre
- Identifie les compétences matchées et manquantes
- Compare l'expérience et la formation
- Fournit un contexte de matching

**Matching Intelligence ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- Ne compare pas les compétences
- N'identifie pas les compétences matchées et manquantes
- Ne compare pas l'expérience et la formation

**Relation**: Interview Preparation Intelligence consomme les résultats de Matching Intelligence pour préparer l'entretien. Matching Intelligence compare les compétences, Interview Preparation Intelligence utilise ces comparaisons pour déterminer les questions à poser.

---

#### Voice Interview Engine (future)

**Voice Interview Engine fait**:
- Conduit l'entretien
- Pose les questions
- Analyse les réponses
- Adapte l'entretien en temps réel
- Suit la progression de l'entretien

**Voice Interview Engine ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- Ne conduit pas l'entretien
- Ne pose pas les questions
- N'analyse pas les réponses
- N'adapte pas l'entretien en temps réel

**Relation**: Interview Preparation Intelligence prépare l'entretien, Voice Interview Engine le conduit. Interview Preparation Intelligence fournit le plan d'entretien, Voice Interview Engine exécute ce plan.

---

#### Final Report (future)

**Final Report fait**:
- Compile les résultats de l'entretien
- Analyse les réponses du candidat
- Fournit une évaluation finale
- Génère le rapport d'entretien

**Final Report ne fait PAS**:
- Ne prépare pas l'entretien
- Ne détermine pas les questions à poser
- Ne définit pas la stratégie d'entretien

**Interview Preparation Intelligence fait**:
- Prépare l'entretien
- Détermine les questions à poser
- Définit la stratégie d'entretien

**Interview Preparation Intelligence ne fait PAS**:
- Ne compile pas les résultats de l'entretien
- N'analyse pas les réponses du candidat
- Ne fournit pas d'évaluation finale
- Ne génère pas le rapport d'entretien

**Relation**: Interview Preparation Intelligence prépare l'entretien, Final Report compile les résultats. Interview Preparation Intelligence fournit le plan d'entretien, Final Report utilise les résultats de l'entretien pour générer le rapport.

---

### Conclusion Boundary Validation

✅ **VALIDATED**: Interview Preparation Intelligence ne partage aucune responsabilité avec les intelligences existantes et futures. Son rôle est strictement limité à la préparation de l'entretien.

**Responsabilités uniques**:
- Préparation de l'entretien
- Détermination des questions à poser
- Définition de la stratégie d'entretien
- Fourniture du plan d'entretien au Voice Interview Engine

**Responsabilités non partagées**:
- Conduite de l'entretien (Voice Interview Engine)
- Analyse des réponses (Voice Interview Engine)
- Coaching (Coaching Intelligence)
- Planification (Planning Intelligence)
- Exécution (Execution Intelligence)
- Réflexion (Reflection Intelligence)
- Identification des écarts (Gap Intelligence)
- Matching (Matching Intelligence)
- Rapport final (Final Report)

---

## Performance

### Ordre d'Exécution

**Pipeline d'exécution**:

1. **Matching Core** (doit être exécuté en premier)
   - Compare les compétences et l'expérience
   - Fournit le contexte de matching

2. **Transferable Skills Intelligence** (dépend de Matching Core)
   - Analyse la transférabilité des compétences
   - Fournit le contexte de transférabilité

3. **Gap Intelligence** (dépend de Matching Core et Transferable Skills Intelligence)
   - Identifie et qualifie les écarts
   - Fournit le contexte d'écarts

4. **Risk Intelligence** (future, dépend de Gap Intelligence)
   - Identifie les risques
   - Fournit le contexte de risques

5. **Opportunity Intelligence** (future, dépend de Gap Intelligence)
   - Identifie les opportunités
   - Fournit le contexte d'opportunités

6. **Scoring Intelligence** (future, dépend de toutes les intelligences précédentes)
   - Calcule les scores globaux
   - Fournit le contexte de scoring

7. **Interview Preparation Intelligence** (dépend de toutes les intelligences précédentes)
   - Prépare l'entretien
   - Fournit le plan d'entretien

8. **Voice Interview Engine** (future, dépend de Interview Preparation Intelligence)
   - Conduit l'entretien
   - Analyse les réponses

9. **Final Report** (future, dépend de Voice Interview Engine)
   - Compile les résultats
   - Génère le rapport

### Dépendances

**Dépendances directes**:
- CandidateGraph (toujours requis)
- JobOfferGraph (toujours requis)
- Matching Core (toujours requis)
- Transferable Skills Intelligence (toujours requis)
- Gap Intelligence (toujours requis)

**Dépendances futures**:
- Risk Intelligence (optionnel si disponible)
- Opportunity Intelligence (optionnel si disponible)
- Scoring Intelligence (optionnel si disponible)
- Planning Intelligence (optionnel si disponible)
- Reflection Intelligence (optionnel si disponible)
- Execution Intelligence (optionnel si disponible)
- Coaching Intelligence (optionnel si disponible)

**Dépendances conditionnelles**:
- Si Risk Intelligence est disponible: utiliser pour identifier les risques à tester
- Si Opportunity Intelligence est disponible: utiliser pour identifier les opportunités à mettre en avant
- Si Scoring Intelligence est disponible: utiliser pour adapter la difficulté
- Si Planning Intelligence est disponible: utiliser pour identifier les objectifs de développement
- Si Reflection Intelligence est disponible: utiliser pour identifier les points d'attention
- Si Execution Intelligence est disponible: utiliser pour identifier les progrès
- Si Coaching Intelligence est disponible: utiliser pour identifier les points à améliorer

### Réutilisation des Résultats

**Réutilisation de Matching Core**:
- Utilise les compétences matchées pour confirmer les points forts
- Utilise les compétences manquantes pour identifier les écarts à tester
- Utilise la comparaison d'expérience pour adapter les questions
- Utilise la comparaison de formation pour adapter les questions

**Réutilisation de Transferable Skills Intelligence**:
- Utilise les compétences transférables pour vérifier la transférabilité
- Utilise les chemins de transfert pour adapter les questions
- Utilise la confiance de transfert pour adapter la difficulté

**Réutilisation de Gap Intelligence**:
- Utilise les écarts pour déterminer les questions à poser
- Utilise la gravité des écarts pour prioriser les questions
- Utilise les écarts bloquants pour identifier les questions critiques
- Utilise les écarts compensables pour adapter les questions

**Réutilisation de Risk Intelligence (future)**:
- Utilise les risques pour identifier les questions pièges
- Utilise la gravité des risques pour prioriser les questions

**Réutilisation de Opportunity Intelligence (future)**:
- Utilise les opportunités pour identifier les points forts à mettre en avant
- Utilise la gravité des opportunités pour adapter les questions

**Réutilisation de Scoring Intelligence (future)**:
- Utilise les scores pour adapter la difficulté
- Utilise les scores pour prioriser les questions

### Absence de Recalcul

**Pas de re-parsing**:
- Le CV est déjà parsé dans CandidateGraph
- L'annonce est déjà parsée dans JobOfferGraph
- Aucun re-parsing nécessaire

**Pas de recalcul de matching**:
- Le matching est déjà fait par Matching Core
- Aucun recalcul nécessaire

**Pas de recalcul de transférabilité**:
- La transférabilité est déjà calculée par Transferable Skills Intelligence
- Aucun recalcul nécessaire

**Pas de recalcul d'écarts**:
- Les écarts sont déjà calculés par Gap Intelligence
- Aucun recalcul nécessaire

**Pas de recalcul de risques (future)**:
- Les risques seront calculés par Risk Intelligence
- Aucun recalcul nécessaire

**Pas de recalcul d'opportunités (future)**:
- Les opportunités seront calculées par Opportunity Intelligence
- Aucun recalcul nécessaire

**Pas de recalcul de scores (future)**:
- Les scores seront calculés par Scoring Intelligence
- Aucun recalcul nécessaire

### Pipeline Cognitif

**Pipeline cognitif d'Interview Preparation Intelligence**:

1. **Analyse des intelligences précédentes**
   - Lire Matching Core
   - Lire Transferable Skills Intelligence
   - Lire Gap Intelligence
   - Lire les intelligences futures si disponibles

2. **Identification des priorités**
   - Identifier les écarts critiques
   - Identifier les écarts bloquants
   - Identifier les compétences transférables
   - Identifier les points forts

3. **Sélection des questions**
   - Sélectionner les questions pertinentes
   - Prioriser les questions selon la gravité
   - Adapter les questions selon le niveau
   - Équilibrer les questions techniques et comportementales

4. **Définition de la stratégie**
   - Définir l'ordre des questions
   - Définir la stratégie d'ouverture
   - Définir la stratégie de progression
   - Définir la stratégie de clôture

5. **Préparation des relances**
   - Préparer les relances pour chaque question
   - Adapter les relances selon le niveau
   - Préparer les questions pièges

6. **Génération du plan**
   - Générer le plan d'entretien
   - Générer la file de questions
   - Générer les règles adaptatives
   - Générer les conditions d'arrêt

7. **Explainability**
   - Ajouter l'explicabilité pour chaque question
   - Ajouter l'explicabilité pour chaque stratégie
   - Ajouter l'explicabilité pour chaque règle

8. **Validation**
   - Valider la cohérence du plan
   - Valider la pertinence des questions
   - Valider l'équilibre technique/comportemental
   - Valider la durée totale

---

## Livrable Attendu

### Document Unique

**FEATURE_04_INTERVIEW_PREPARATION_DESIGN_REVIEW.md**

Ce document est la référence unique pour toute l'implémentation de la préparation d'entretien.

**Contenu du document**:
- Résumé exécutif
- Position dans le pipeline
- Responsabilité unique
- Sources autorisées
- Types de questions (21 catégories)
- Pour chaque question: pourquoi, ce qu'elle mesure, intelligences justificatives, preuves, difficulté, temps, relances, réponses attendues, réponses faibles, réponses excellentes, critères d'évaluation
- Stratégie complète d'entretien
- Préparation du futur Voice Interview Engine
- Explainability
- Boundary Validation
- Performance
- Livrable attendu

**Utilisation du document**:
- Référence pour l'implémentation de Interview Preparation Intelligence
- Référence pour l'implémentation de Voice Interview Engine
- Référence pour l'intégration dans le pipeline
- Référence pour les tests et validations

---

## Contraintes Absolues Respectées

✅ **Aucun fichier source modifié**
- Aucun fichier TypeScript modifié
- Aucun fichier React modifié
- Aucun fichier de configuration modifié

✅ **Aucun moteur créé**
- Aucun moteur d'intelligence créé
- Aucun moteur de traitement créé
- Aucun moteur d'analyse créé

✅ **Aucun composant React créé**
- Aucun composant React créé
- Aucun widget créé
- Aucun hook créé

✅ **Aucun Prompt IA créé**
- Aucun prompt IA créé
- Aucun template créé
- Aucune configuration IA créée

✅ **Aucune logique métier ajoutée**
- Aucune logique métier implémentée
- Aucune règle métier implémentée
- Aucun algorithme implémenté

✅ **Aucune architecture modifiée**
- Aucun nouveau composant architectural
- Aucune modification de composant existant
- Aucune nouvelle dépendance

---

## Conclusion

**Statut**: 📝 DESIGN REVIEW COMPLETED

**Document créé**: FEATURE_04_INTERVIEW_PREPARATION_DESIGN_REVIEW.md

**Validations**:
- ✅ Aucun fichier source modifié
- ✅ Aucun moteur créé
- ✅ Aucun composant React créé
- ✅ Aucun Prompt IA créé
- ✅ Aucune logique métier ajoutée
- ✅ Aucune architecture modifiée
- ✅ Documentation complète
- ✅ Boundary Validation effectuée
- ✅ Performance décrite
- ✅ Explainability définie

**Prochaines étapes**:
- Implémentation de Interview Preparation Intelligence (future)
- Implémentation de Voice Interview Engine (future)
- Intégration dans le pipeline (future)

---

**Document maintenu par**: Devin.ai
**Date de création**: 10 juillet 2026
**Version**: 1.0
**Statut**: DESIGN REVIEW COMPLETED
**Type**: Documentation uniquement - Aucune implémentation
