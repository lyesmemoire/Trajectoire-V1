# DOC-014-03 : Questions d'Observation Comportementale

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les questions d'observation comportementale pour MVP-014 Soft Skills Intelligence. Ces questions sont conçues pour révéler les soft skills à travers des comportements concrets plutôt que par des déclarations directes.

---

## 2. Principe Fondateur

Les questions directes ("Êtes-vous un bon leader ?") sont inutiles car tout le monde répond oui. Les questions d'observation comportementale demandent des exemples concrets de situations passées qui révèlent le vrai niveau de soft skill ("Décrivez une situation où votre équipe vous a résisté").

---

## 3. Structure des Questions d'Observation

### 3.1 Template de Question

```typescript
interface BehavioralQuestion {
  questionId: string;
  skillId: string;
  question: string;
  
  objective: string;
  whatItReveals: string;
  
  positiveIndicators: string[];
  vigilanceIndicators: string[];
  
  followUpQuestions: string[];
  
  difficulty: 'easy' | 'medium' | 'hard';
  recommendedFor: string[];
}
```

---

## 4. Questions par Soft Skill

### SOFT SKILL 1 — Leadership & Influence

**Question 1 :**
```
"Décrivez-moi une situation où votre équipe vous a résisté sur une décision
ou une direction que vous aviez prise. Comment avez-vous géré cette résistance
et quel a été le résultat ?"
```

**Objectif :** Évaluer la capacité à gérer les résistances et à influencer sans autorité formelle.

**Ce qu'elle révèle :**
- Capacité à écouter et comprendre les objections
- Approche collaborative vs autoritaire
- Capacité à convaincre par la raison
- Gestion des conflits

**Indicateurs positifs :**
- Écoute active des objections de l'équipe
- Explication claire de la rationale de la décision
- Adaptation de la décision si nécessaire
- Résolution constructive du conflit
- Résultat positif pour l'équipe et le projet

**Indicateurs de vigilance :**
- Rejet des objections sans écoute
- Approche autoritaire ("c'est comme ça")
- Blame game sur l'équipe
- Incapacité à gérer le conflit
- Résultat négatif ou abandon

**Questions de relance :**
- "Quelles étaient les objections principales de l'équipe ?"
- "Comment avez-vous communiqué avec l'équipe pendant cette période ?"
- "Auriez-vous fait différemment avec le recul ?"

---

**Question 2 :**
```
"Parlez-moi d'un projet où vous avez dû motiver une équipe démoralisée
après un échec ou un revers. Quelles actions avez-vous prises et
quels résultats avez-vous obtenus ?"
```

**Objectif :** Évaluer la capacité à inspirer et motiver en situation difficile.

**Ce qu'elle révèle :**
- Intelligence émotionnelle
- Capacité à reconnaître et valider les émotions
- Vision et capacité à la transmettre
- Leadership par l'exemple

**Indicateurs positifs :**
- Reconnaissance des émotions de l'équipe
- Communication transparente sur la situation
- Plan d'action clair et réaliste
- Célébration des petites victoires
- Résultat positif et restauration de la motivation

**Indicateurs de vigilance :**
- Minimisation ou ignorance des émotions
- Communication opaque ou mensongère
- Absence de plan d'action
- Attente passive que "ça passe"
- Motivation non restaurée

**Questions de relance :**
- "Comment avez-vous pris le pouls de l'équipe ?"
- "Quelles actions spécifiques avez-vous prises pour remonter la motivation ?"
- "Qu'avez-vous appris de cette expérience ?"

---

### SOFT SKILL 2 — Intelligence Émotionnelle

**Question 1 :**
```
"Parlez-moi d'une situation où vous avez dû gérer vos propres émotions
sous forte pression. Qu'avez-vous ressenti et comment avez-vous géré
ces émotions pour maintenir votre performance ?"
```

**Objectif :** Évaluer la conscience de soi et la gestion des émotions sous pression.

**Ce qu'elle révèle :**
- Capacité à nommer ses émotions
- Stratégies de gestion émotionnelle
- Résilience émotionnelle
- Performance maintenue sous pression

**Indicateurs positifs :**
- Description précise des émotions ressenties
- Stratégies concrètes de gestion
- Recul sur ses propres réactions
- Performance maintenue ou améliorée
- Apprentissage de l'expérience

**Indicateurs de vigilance :**
- Incapacité à nommer les émotions
- Réactions disproportionnées ou explosives
- Absence de stratégie de gestion
- Performance dégradée
- Refus de reconnaître les émotions

**Questions de relance :**
- "Quels signaux physiques ou mentaux avez-vous ressentis ?"
- "Quelles stratégies avez-vous mises en place ?"
- "Comment gérez-vous généralement ce type de situation ?"

---

**Question 2 :**
```
"Décrivez un conflit interpersonnel difficile que vous avez eu avec un
collègue ou un manager. Comment avez-vous géré ce conflit et
quelle a été l'issue ?"
```

**Objectif :** Évaluer l'empathie et la capacité à comprendre les autres.

**Ce qu'elle révèle :**
- Empathie et compréhension de l'autre
- Capacité à communiquer sur les émotions
- Gestion constructive des conflits
- Intelligence relationnelle

**Indicateurs positifs :**
- Compréhension du point de vue de l'autre
- Communication honnête et respectueuse
- Recherche de solution gagnant-gagnant
- Issue positive ou apprentissage
- Relation préservée ou améliorée

**Indicateurs de vigilance :**
- Incapacité à comprendre le point de vue de l'autre
- Communication agressive ou passive-agressive
- Recherche de victoire à tout prix
- Issue négative ou relation dégradée
- Blame game sur l'autre

**Questions de relance :**
- "Qu'avez-vous compris des motivations de l'autre personne ?"
- "Comment avez-vous communiqué pendant le conflit ?"
- "Qu'auriez-vous pu faire différemment ?"

---

### SOFT SKILL 3 — Adaptabilité & Résilience

**Question 1 :**
```
"Parlez-moi de votre plus grand échec professionnel. Qu'avez-vous appris
de cet échec et comment avez-vous rebondi ?"
```

**Objectif :** Évaluer la résilience et la capacité à apprendre des échecs.

**Ce qu'elle révèle :**
- Capacité à reconnaître et assumer l'échec
- Résilience et capacité à rebondir
- Capacité d'apprentissage
- Absence de posture victimaire

**Indicateurs positifs :**
- Reconnaissance assumée de l'échec
- Analyse des causes sans blâmer
- Leçons apprises clairement identifiées
- Actions concrètes pour rebondir
- Succès ultérieur lié à l'apprentissage

**Indicateurs de vigilance :**
- Refus de reconnaître l'échec
- Blame game sur les autres ou les circonstances
- Posture victimaire permanente
- Incapacité à identifier des leçons
- Absence de rebond ou répétition de l'erreur

**Questions de relance :**
- "Quelles étaient les causes principales de cet échec ?"
- "Qu'auriez-vous pu faire différemment ?"
- "Comment cet échec a-t-il influencé votre approche depuis ?"

---

**Question 2 :**
```
"Comment avez-vous géré un changement majeur dans votre organisation
(restructuration, nouveau manager, changement de stratégie) ?
Quelles ont été vos réactions initiales et comment vous êtes-vous adapté ?"
```

**Objectif :** Évaluer la capacité à s'adapter au changement.

**Ce qu'elle révèle :**
- Réaction face au changement
- Capacité d'adaptation
- Attitude proactive vs réactive
- Confort dans l'ambiguïté

**Indicateurs positifs :**
- Réaction initiale mesurée et constructive
- Recherche d'information et de compréhension
- Actions proactives pour s'adapter
- Capacité à aider les autres à s'adapter
- Succès dans le nouveau contexte

**Indicateurs de vigilance :**
- Réaction initiale négative ou hostile
- Résistance au changement
- Attitude passive ou attentiste
- Incapacité à s'adapter
- Échec dans le nouveau contexte

**Questions de relance :**
- "Quelles étaient vos premières réactions ?"
- "Quelles actions avez-vous prises pour vous adapter ?"
- "Qu'avez-vous trouvé le plus difficile dans ce changement ?"

---

### SOFT SKILL 4 — Pensée Critique & Résolution de Problèmes

**Question 1 :**
```
"Voici un problème complexe : [décrire un problème spécifique au poste].
Comment l'analyseriez-vous et quelles solutions proposeriez-vous ?"
```

**Objectif :** Évaluer la pensée critique et la résolution de problèmes.

**Ce qu'elle révèle :**
- Capacité à structurer la pensée
- Capacité d'analyse
- Créativité dans les solutions
- Méthodologie de résolution de problèmes

**Indicateurs positifs :**
- Décomposition du problème en sous-problèmes
- Identification des causes profondes
- Formulation d'hypothèses explicites
- Solutions multiples et alternatives
- Plan d'action structuré

**Indicateurs de vigilance :**
- Pensée désorganisée ou confuse
- Solutions superficielles ou évidentes
- Incapacité à formuler des hypothèses
- Solution unique sans alternatives
- Absence de plan d'action

**Questions de relance :**
- "Quelles sont les causes profondes de ce problème ?"
- "Quelles hypothèses avez-vous formulées ?"
- "Quelles alternatives avez-vous considérées ?"

---

**Question 2 :**
```
"Parlez-moi d'un problème complexe que vous avez résolu de manière créative.
Quelle était votre approche et pourquoi avez-vous choisi cette solution ?"
```

**Objectif :** Évaluer la créativité dans la résolution de problèmes.

**Ce qu'elle révèle :**
- Créativité et innovation
- Capacité à penser hors des sentiers battus
- Justification des choix
- Impact de la solution

**Indicateurs positifs :**
- Approche originale ou non conventionnelle
- Justification claire du choix
- Résultat positif et mesurable
- Capacité à expliquer le processus créatif
- Application potentielle à d'autres problèmes

**Indicateurs de vigilance :**
- Solution conventionnelle ou évidente
- Incapacité à justifier le choix
- Résultat mitigé ou négatif
- Incapacité à expliquer le processus
- Solution non applicable ailleurs

**Questions de relance :**
- "Pourquoi avez-vous choisi cette approche plutôt qu'une solution classique ?"
- "Quels risques avez-vous identifiés et comment les avez-vous gérés ?"
- "Pourriez-vous appliquer cette approche à d'autres problèmes ?"

---

### SOFT SKILL 5 — Communication & Impact

**Question 1 :**
```
"Parlez-moi d'une situation où vous avez dû convaincre quelqu'un
d'une idée ou d'une décision à laquelle il était initialement opposé.
Comment avez-vous procédé et quel a été le résultat ?"
```

**Objectif :** Évaluer la capacité de conviction et l'adaptation à l'interlocuteur.

**Ce qu'elle révèle :**
- Capacité d'adaptation à l'interlocuteur
- Techniques de persuasion
- Écoute active
- Communication structurée

**Indicateurs positifs :**
- Compréhension du point de vue de l'autre
- Adaptation du message à l'interlocuteur
- Arguments structurés et pertinents
- Écoute active et réponse aux objections
- Conviction réussie

**Indicateurs de vigilance :**
- Incapacité à comprendre le point de vue de l'autre
- Message générique non adapté
- Arguments désorganisés
- Écoute passive ou ignorante
- Échec de la conviction

**Questions de relance :**
- "Comment avez-vous adapté votre message à cette personne ?"
- "Quelles objections avez-vous rencontrées et comment y avez-vous répondu ?"
- "Qu'auriez-vous fait différemment si ça n'avait pas marché ?"

---

### SOFT SKILL 6 — Orientation Résultats

**Question 1 :**
```
"Parlez-moi de votre réalisation la plus significative. Quels objectifs
aviez-vous, comment les avez-vous atteints et quels résultats avez-vous obtenus ?"
```

**Objectif :** Évaluer le drive, l'ambition et la capacité à atteindre des objectifs.

**Ce qu'elle révèle :**
- Capacité à fixer des objectifs ambitieux
- Persévérance
- Orientation résultats
- Capacité à dépasser les attentes

**Indicateurs positifs :**
- Objectifs clairs et ambitieux
- Plan d'action structuré
- Persévérance face aux obstacles
- Résultats chiffrés et mesurables
- Dépassement des objectifs initiaux

**Indicateurs de vigilance :**
- Objectifs flous ou absents
- Absence de plan d'action
- Abandon facile face aux obstacles
- Résultats non mesurables
- Objectifs non atteints sans justification

**Questions de relance :**
- "Comment avez-vous fixé ces objectifs ?"
- "Quels obstacles avez-vous rencontrés et comment les avez-vous surmontés ?"
- "Qu'avez-vous fait pour dépasser vos objectifs initiaux ?"

---

### SOFT SKILL 7 — Travail en Équipe & Collaboration

**Question 1 :**
```
"Parlez-moi d'un projet d'équipe où des tensions sont apparues entre
membres de l'équipe. Quel a été votre rôle dans la gestion de ces tensions
et comment le projet a-t-il progressé ?"
```

**Objectif :** Évaluer la posture collaborative réelle et la gestion des conflits d'équipe.

**Ce qu'elle révèle :**
- Posture collaborative vs individuelle
- Gestion des conflits d'équipe
- Contribution vs consommation
- Leadership informel

**Indicateurs positifs :**
- Rôle actif dans la résolution des tensions
- Approche collaborative et non partisane
- Recherche de solution pour l'équipe
- Partage du crédit avec l'équipe
- Projet réussi malgré les tensions

**Indicateurs de vigilance :**
- Rôle passif ou aggravant dans les tensions
- Approche partisane ou exclusive
- Recherche de victoire personnelle
- Appropriation exclusive du crédit
- Échec du projet dû aux tensions

**Questions de relance :**
- "Quelles actions spécifiques avez-vous prises pour résoudre les tensions ?"
- "Comment avez-vous maintenu la collaboration malgré les tensions ?"
- "Qu'auriez-vous pu faire différemment ?"

---

### SOFT SKILL 8 — Apprentissage Continu

**Question 1 :**
```
"Qu'avez-vous appris récemment en dehors de votre travail ou de vos
formations formelles ? Pourquoi avez-vous choisi d'apprendre cela et
comment l'avez-vous appliqué ?"
```

**Objectif :** Évaluer la curiosité intellectuelle et la capacité d'autoformation.

**Ce qu'elle révèle :**
- Curiosité intellectuelle
- Capacité d'autoformation
- Veille et mise à jour des connaissances
- Application des apprentissages

**Indicateurs positifs :**
- Apprentissage spontané et non imposé
- Sources diversifiées (livres, podcasts, communautés)
- Application concrète au travail
- Curiosité manifeste
- Partage des apprentissages avec d'autres

**Indicateurs de vigilance :**
- Absence d'apprentissage hors formation formelle
- Sources limitées ou uniques
- Absence d'application
- Curiosité limitée
- Connaissance statique

**Questions de relance :**
- "Pourquoi avez-vous choisi ce sujet d'apprentissage ?"
- "Comment avez-vous procédé pour apprendre ?"
- "Comment avez-vous appliqué cet apprentissage à votre travail ?"

---

### SOFT SKILL 9 — Intégrité & Éthique

**Question 1 :**
```
"Parlez-moi d'une situation où vous avez dû faire un choix éthique difficile,
peut-être aller à l'encontre de ce que votre manager ou votre entreprise
souhaitait. Comment avez-vous procédé et quelles ont été les conséquences ?"
```

**Objectif :** Évaluer l'intégrité et la gestion des dilemmes éthiques.

**Ce qu'elle révèle :**
- Cohérence entre valeurs et actions
- Gestion des dilemmes éthiques
- Courage moral
- Transparence

**Indicateurs positifs :**
- Reconnaissance du dilemme éthique
- Décision alignée avec les valeurs
- Communication honnête avec les parties prenantes
- Acceptation des conséquences
- Cohérence entre discours et actes

**Indicateurs de vigilance :**
- Refus de reconnaître le dilemme
- Décision contraire aux valeurs
- Communication opaque ou mensongère
- Évitement des conséquences
- Incohérence entre discours et actes

**Questions de relance :**
- "Quelles étaient les options possibles ?"
- "Pourquoi avez-vous choisi cette option ?"
- "Quelles ont été les conséquences de votre décision ?"

---

### SOFT SKILL 10 — Gestion du Stress & Pression

**Question 1 :**
```
"Comment gérez-vous les périodes de forte pression ou d'urgence ?
Décrivez une situation spécifique et les stratégies que vous avez utilisées."
```

**Objectif :** Évaluer la capacité à maintenir la performance sous pression.

**Ce qu'elle révèle :**
- Stratégies de gestion du stress
- Performance maintenue sous pression
- Signaux de burn-out potentiels
- Capacité à prioriser

**Indicateurs positifs :**
- Stratégies concrètes et efficaces
- Performance maintenue ou améliorée
- Recul maintenu sous pression
- Capacité à prioriser et déléguer
- Absence de signaux de burn-out

**Indicateurs de vigilance :**
- Absence de stratégie
- Performance dégradée
- Réaction disproportionnée
- Incapacité à prioriser
- Signaux de burn-out (épuisement, cynisme)

**Questions de relance :**
- "Quels signaux de stress ressentez-vous ?"
- "Quelles stratégies spécifiques utilisez-vous ?"
- "Comment équilibrez-vous votre vie pro et perso ?"

---

### SOFT SKILL 11 — Vision Stratégique

**Question 1 :**
```
"Où vous voyez-vous dans 3 à 5 ans ? Comment cette vision s'aligne-t-elle
avec votre parcours actuel et quelles étapes comptez-vous suivre pour l'atteindre ?"
```

**Objectif :** Évaluer la capacité à penser au-delà du court terme et l'alignement ambition/réalité.

**Ce qu'elle révèle :**
- Vision à moyen terme
- Cohérence avec le parcours
- Compréhension des enjeux
- Planification réaliste

**Indicateurs positifs :**
- Vision claire et cohérente
- Alignement avec le parcours et les compétences
- Compréhension des enjeux du secteur
- Plan d'action réaliste
- Ambition réaliste et argumentée

**Indicateurs de vigilance :**
- Vision floue ou absente
- Incohérence avec le parcours
- Incompréhension des enjeux
- Plan irréaliste
- Ambition déconnectée de la réalité

**Questions de relance :**
- "Pourquoi cette vision spécifique ?"
- "Comment votre parcours vous prépare-t-il à cette vision ?"
- "Quelles sont les étapes clés pour atteindre cette vision ?"

---

### SOFT SKILL 12 — Culture Fit

**Question 1 :**
```
"Dans quel type d'environnement de travail vous épanouissez-vous le plus ?
Décrivez un environnement dans lequel vous avez excellé et un environnement
dans lequel vous avez souffert. Pourquoi ?"
```

**Objectif :** Évaluer l'adéquation avec la culture de l'entreprise.

**Ce qu'elle révèle :**
- Préférences de travail
- Compatibilité avec différents styles
- Valeurs professionnelles
- Conscience de soi

**Indicateurs positifs :**
- Description précise des préférences
- Cohérence avec la culture de l'entreprise cible
- Capacité à s'adapter à différents styles
- Valeurs alignées avec l'entreprise
- Conscience de ses propres besoins

**Indicateurs de vigilance :**
- Préférences incompatibles avec la culture cible
- Inflexibilité face aux différents styles
- Valeurs en conflit avec l'entreprise
- Incapacité à s'adapter
- Manque de conscience de soi

**Questions de relance :**
- "Quels aspects de l'environnement vous ont permis de vous épanouir ?"
- "Comment vous adaptez-vous à des environnements différents ?"
- "Quelles sont vos valeurs professionnelles les plus importantes ?"

---

## 5. Structure de Données (TypeScript)

```typescript
interface BehavioralQuestionLibrary {
  version: string;
  lastUpdated: Date;
  questions: BehavioralQuestion[];
}

interface BehavioralQuestion {
  questionId: string;
  skillId: string;
  question: string;
  
  objective: string;
  whatItReveals: string;
  
  positiveIndicators: string[];
  vigilanceIndicators: string[];
  
  followUpQuestions: string[];
  
  difficulty: 'easy' | 'medium' | 'hard';
  recommendedFor: string[];
  variants: {
    profileType: string;
    variant: string;
  }[];
}
```

---

## 6. Sélection de Questions

### 6.1 Processus de Sélection

```typescript
async function selectBehavioralQuestions(
  candidateProfile: CandidateProfile,
  jobProfile: JobProfile
): Promise<BehavioralQuestion[]> {
  const selectedQuestions: BehavioralQuestion[] = [];
  
  // Sélection basée sur les soft skills critiques pour le poste
  const criticalSkills = getCriticalSkills(jobProfile.role);
  
  for (const skillId of criticalSkills) {
    const skillQuestions = await getQuestionsForSkill(skillId);
    
    // Sélection de la question la plus appropriée au profil
    const bestQuestion = selectBestQuestionForProfile(skillQuestions, candidateProfile);
    
    selectedQuestions.push(bestQuestion);
  }
  
  // Sélection de questions supplémentaires pour les soft skills importantes
  const importantSkills = getImportantSkills(jobProfile.role);
  
  for (const skillId of importantSkills) {
    if (!criticalSkills.includes(skillId)) {
      const skillQuestions = await getQuestionsForSkill(skillId);
      const bestQuestion = selectBestQuestionForProfile(skillQuestions, candidateProfile);
      selectedQuestions.push(bestQuestion);
    }
  }
  
  return selectedQuestions;
}
```

---

## 7. Conclusion

Les questions d'observation comportementale sont conçues pour révéler les soft skills à travers des comportements concrets plutôt que par des déclarations directes. Chaque question est accompagnée d'indicateurs positifs et de vigilance, ainsi que de questions de relance pour approfondir l'observation.

**Points clés :**
- 12 soft skills avec 2 questions d'observation chacune
- Questions conçues pour révéler des comportements, pas des déclarations
- Indicateurs positifs et de vigilance pour chaque question
- Questions de relance pour approfondir
- Sélection automatique basée sur le rôle et le profil candidat
- Variants selon le profil du candidat
