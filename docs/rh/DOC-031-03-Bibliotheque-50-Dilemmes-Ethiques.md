# DOC-031-03 : Bibliothèque des 50 Dilemmes Éthiques RH

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la bibliothèque des 50 dilemmes éthiques les plus fréquents en recrutement pour MVP-031 Ethical Compass Engine. Cette bibliothèque fournit une analyse détaillée de chaque dilemme avec guidance éthique pour aider les recruteurs à prendre des décisions justes et responsables.

---

## 2. Principe Fondateur

Les dilemmes éthiques sont des situations où aucune option n'est parfaitement satisfaisante d'un point de vue éthique. La bibliothèque fournit une analyse structurée de chaque dilemme, identifiant les parties prenantes, les options disponibles, l'analyse éthique de chaque option, et une recommandation nuancée. Le moteur ne peut pas décider à la place de l'humain mais fournit une guidance éclairée.

---

## 3. Structure des Dilemmes

Chaque dilemme est structuré comme suit :

```
DILEMME [N] : [Titre]

DESCRIPTION :
  [Description complète du dilemme]

PARTIES PRENANTES ET LEURS INTÉRÊTS :
  - [Partie prenante 1] : [Intérêt]
  - [Partie prenante 2] : [Intérêt]
  - [Partie prenante 3] : [Intérêt]

OPTIONS DISPONIBLES :
  Option A : [Description]
  Option B : [Description]
  Option C : [Description]

ANALYSE ÉTHIQUE DE CHAQUE OPTION :
  Option A :
    Avantages : [liste]
    Inconvénients : [liste]
    Impact sur les parties prenantes : [analyse]
  
  Option B :
    Avantages : [liste]
    Inconvénients : [liste]
    Impact sur les parties prenantes : [analyse]
  
  Option C :
    Avantages : [liste]
    Inconvénients : [liste]
    Impact sur les parties prenantes : [analyse]

RECOMMANDATION AVEC NUANCE :
  [Recommandation]
  Justification : [explication]
  Conditions : [conditions]

CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :
  [Limites de la décision automatisée]
```

---

## 4. Les 50 Dilemmes Éthiques RH

### 4.1 Dilemmes de Sélection (1-10)

#### DILEMME 1 : Recruter le Meilleur Technique vs Engagement Long Terme

**DESCRIPTION :**
Recruter le meilleur candidat technique dont on sait qu'il partira dans 18 mois vs recruter un profil moins fort mais plus engagé long terme.

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat A (meilleur technique) : Opportunité de carrière, salaire élevé
- Candidat B (moins fort, plus engagé) : Opportunité de carrière, stabilité
- Entreprise : Performance à court terme vs stabilité à long terme
- Équipe : Performance immédiate vs cohésion à long terme

**OPTIONS DISPONIBLES :**
- Option A : Recruter le candidat A (meilleur technique)
- Option B : Recruter le candidat B (moins fort, plus engagé)
- Option C : Recruter le candidat A avec plan de rétention

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Performance immédiate, expertise technique
  - Inconvénients : Turnover à 18 mois, coût de remplacement
  - Impact : Candidat A satisfait, entreprise performante à court terme, équipe impactée par le départ

- Option B :
  - Avantages : Stabilité, engagement, rétention
  - Inconvénients : Performance moindre à court terme
  - Impact : Candidat B satisfait, entreprise stable à long terme, équipe cohérente

- Option C :
  - Avantages : Performance immédiate + tentative de rétention
  - Inconvénients : Coût de rétention, risque d'échec
  - Impact : Candidat A satisfait, entreprise performante, équipe stable si rétention réussit

**RECOMMANDATION AVEC NUANCE :**
Si l'entreprise peut absorber le turnover et priorise la performance à court terme : Option A.
Si l'entreprise priorise la stabilité et la rétention : Option B.
Si l'entreprise veut tenter les deux : Option C avec un plan de rétention structuré.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider quel horizon temporel prioriser (court terme vs long terme). Cette décision dépend de la stratégie de l'entreprise et du contexte spécifique.

---

#### DILEMME 2 : Transparence sur l'Évolution du Poste

**DESCRIPTION :**
Révéler au candidat que le poste va probablement évoluer significativement dans 6 mois vs ne pas le révéler pour sécuriser son acceptation.

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Information complète pour décision éclairée
- Entreprise : Sécurisation du recrutement
- Équipe : Clarté sur l'évolution du poste

**OPTIONS DISPONIBLES :**
- Option A : Révéler l'évolution du poste
- Option B : Ne pas révéler l'évolution
- Option C : Révéler partiellement l'évolution

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Transparence, confiance, décision éclairée
  - Inconvénients : Risque de refus du candidat
  - Impact : Candidat informé, entreprise transparente, équipe informée

- Option B :
  - Avantages : Sécurisation du recrutement
  - Inconvénients : Manque de transparence, risque de départ ultérieur
  - Impact : Candidat mal informé, entreprise opaque, équipe non informée

- Option C :
  - Avantages : Transparence partielle, réduction du risque
  - Inconvénients : Transparence incomplète
  - Impact : Candidat partiellement informé, entreprise partiellement transparente

**RECOMMANDATION AVEC NUANCE :**
Option A est recommandée pour maintenir la confiance et éviter les départs précoces. Si le risque de refus est élevé, Option C peut être considérée avec une communication claire sur les incertitudes.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le niveau de transparence approprié. Cette décision dépend de la culture de l'entreprise et du contexte spécifique.

---

#### DILEMME 3 : Référence Problématique vs Potentiel Actuel

**DESCRIPTION :**
Candidat excellent mais référence qui révèle un comportement passé problématique qui ne s'est peut-être pas reproduit. Disqualifier sur cette base ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Opportunité de carrière, réputation
- Entreprise : Performance, risque comportemental
- Équipe : Sécurité, performance
- Référence : Honnêteté, protection

**OPTIONS DISPONIBLES :**
- Option A : Disqualifier sur la base de la référence
- Option B : Ignorer la référence et recruter
- Option C : Investiguer davantage avec le candidat

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Protection de l'équipe, prudence
  - Inconvénients : Perte de talent, jugement sur passé
  - Impact : Candidat exclu, entreprise protégée, équipe sécurisée

- Option B :
  - Avantages : Acquisition de talent
  - Inconvénients : Risque comportemental
  - Impact : Candidat recruté, entreprise à risque, équipe à risque

- Option C :
  - Avantages : Investigation approfondie, décision éclairée
  - Inconvénients : Temps supplémentaire, incertitude
  - Impact : Candidat évalué, entreprise informée, équipe protégée

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour permettre une décision éclairée. Si l'investigation confirme un risque persistant, Option A peut être justifiée. Option B est déconseillée en raison du risque pour l'équipe.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider si le comportement passé est un indicateur fiable du comportement futur. Cette décision nécessite un jugement humain basé sur le contexte et les circonstances.

---

#### DILEMME 4 : Objectivité vs Équité (Diversité)

**DESCRIPTION :**
Favoriser la diversité sur ce recrutement vs choisir le candidat objectivement le mieux noté. La tension entre objectivité et équité.

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat diversifié : Opportunité équitable
- Candidat mieux noté : Reconnaissance du mérite
- Entreprise : Diversité vs performance
- Société : Équité vs méritocratie

**OPTIONS DISPONIBLES :**
- Option A : Choisir le candidat objectivement le mieux noté
- Option B : Favoriser la diversité
- Option C : Pondérer objectivité et diversité

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Méritocratie, objectivité
  - Inconvénients : Moins de diversité
  - Impact : Candidat méritocratique, entreprise performante, société moins diverse

- Option B :
  - Avantages : Diversité, équité
  - Inconvénients : Moins d'objectivité
  - Impact : Candidat diversifié, entreprise diverse, société plus équitable

- Option C :
  - Avantages : Équilibre entre méritocratie et diversité
  - Inconvénients : Complexité de décision
  - Impact : Candidat équilibré, entreprise équilibrée, société équilibrée

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour équilibrer méritocratie et diversité. Si l'écart de performance est faible, Option B peut être justifiée. Si l'écart est élevé, Option A peut être justifiée.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le poids relatif de l'objectivité vs la diversité. Cette décision dépend des valeurs de l'entreprise et du contexte spécifique.

---

#### DILEMME 5 : Discrétion vs Partenariat

**DESCRIPTION :**
Candidat en poste qui nous demande la discrétion absolue. Son employeur actuel est un partenaire de l'entreprise.

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Confidentialité, protection
- Entreprise : Recrutement, partenariat
- Employeur actuel : Loyauté, information
- Partenariat : Confiance, respect

**OPTIONS DISPONIBLES :**
- Option A : Respecter la discrétité absolue
- Option B : Informer le partenaire
- Option C : Négocier une approche partagée

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Respect du candidat, confidentialité
  - Inconvénients : Risque pour le partenariat
  - Impact : Candidat protégé, entreprise à risque, partenaire non informé

- Option B :
  - Avantages : Respect du partenariat
  - Inconvénients : Violation de la confidentialité
  - Impact : Candidat exposé, entreprise respectueuse, partenaire informé

- Option C :
  - Avantages : Équilibre entre confidentialité et partenariat
  - Inconvénients : Complexité de négociation
  - Impact : Candidat protégé, entreprise équilibrée, partenaire respecté

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour équilibrer les intérêts. Si le partenariat est critique, Option B peut être justifiée. Si la confidentialité est critique, Option A peut être justifiée.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le poids relatif de la confidentialité vs le partenariat. Cette décision dépend de la stratégie de l'entreprise et du contexte spécifique.

---

#### DILEMME 6 : Salaire au-dessus de la Grille

**DESCRIPTION :**
Candidat exceptionnel qui demande un salaire au-dessus de la grille de l'entreprise. Accepter ou refuser ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Rémunération juste, reconnaissance
- Entreprise : Budget, équité interne
- Équipe : Équité salariale, motivation
- Candidats existants : Équité, comparaison

**OPTIONS DISPONIBLES :**
- Option A : Accepter le salaire au-dessus de la grille
- Option B : Refuser et proposer le salaire de la grille
- Option C : Négocier un compromis

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Acquisition de talent
  - Inconvénients : Inéquité interne, inflation salariale
  - Impact : Candidat satisfait, entreprise talentueuse, équipe potentiellement frustrée

- Option B :
  - Avantages : Équité interne, budget respecté
  - Inconvénients : Perte de talent
  - Impact : Candidat refusé, entreprise équitable, équipe satisfaite

- Option C :
  - Compromis : Équilibre entre talent et équité
  - Inconvénients : Complexité de négociation
  - Impact : Candidat partiellement satisfait, entreprise équilibrée, équipe respectée

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour équilibrer talent et équité. Si le candidat est exceptionnel et l'écart justifié, Option A peut être considérée avec communication à l'équipe. Option B est recommandée si l'écart n'est pas justifié.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider si le candidat justifie une exception salariale. Cette décision nécessite un jugement humain basé sur la valeur du candidat et le contexte de l'entreprise.

---

#### DILEMME 7 : Candidat Surqualifié

**DESCRIPTION :**
Candidat surqualifié pour le poste. Recruter ou risquer qu'il parte rapidement ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Opportunité, croissance
- Entreprise : Talent, rétention
- Équipe : Performance, stabilité
- Candidats moins qualifiés : Équité

**OPTIONS DISPONIBLES :**
- Option A : Recruter le candidat surqualifié
- Option B : Refuser pour éviter le turnover
- Option C : Recruter avec plan d'évolution

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Talent immédiat
  - Inconvénients : Risque de turnover, sous-utilisation
  - Impact : Candidat satisfait, entreprise talentueuse, équipe performante

- Option B :
  - Avantages : Réduction du risque de turnover
  - Inconvénients : Perte de talent
  - Impact : Candidat refusé, entreprise stable, équipe stable

- Option C :
  - Avantages : Talent + plan d'évolution
  - Inconvénients : Complexité de mise en œuvre
  - Impact : Candidat satisfait, entreprise talentueuse, équipe stable

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée si un plan d'évolution réaliste peut être mis en place. Option A est recommandée si le candidat accepte le poste tel quel. Option B est recommandée si aucun plan d'évolution n'est possible.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider si le candidat acceptera le poste tel quel ou si un plan d'évolution est réaliste. Cette décision nécessite un jugement humain basé sur le candidat et le contexte de l'entreprise.

---

#### DILEMME 8 : Candidat avec Écart de Carrière

**DESCRIPTION :**
Candidat avec un écart de carrière (gap) de plusieurs années. Comment évaluer cet écart ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Opportunité, réinsertion
- Entreprise : Talent, risque
- Équipe : Performance, intégration
- Société : Inclusion, équité

**OPTIONS DISPONIBLES :**
- Option A : Ignorer l'écart et évaluer le talent
- Option B : Pénaliser l'écart
- Option C : Évaluer la raison de l'écart

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Inclusion, évaluation du talent
  - Inconvénients : Risque de sous-estimation
  - Impact : Candidat inclus, entreprise inclusive, société équitable

- Option B :
  - Avantages : Prudence
  - Inconvénients : Discrimination potentielle
  - Impact : Candidat pénalisé, entreprise prudente, société potentiellement discriminatoire

- Option C :
  - Avantages : Évaluation nuancée
  - Inconvénients : Complexité d'évaluation
  - Impact : Candidat évalué, entreprise informée, société équitable

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour une évaluation nuancée. Si l'écart est justifié et le candidat talentueux, Option A est recommandée. Option B est déconseillée sauf si l'écart indique un risque avéré.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider si un écart de carrière est justifié ou pertinent. Cette décision nécessite un jugement humain basé sur le contexte et les circonstances.

---

#### DILEMME 9 : Candidat Référé par un Cadre

**DESCRIPTION :**
Candidat référé par un cadre de l'entreprise. Comment éviter le favoritisme ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Opportunité, réseau
- Cadre référent : Influence, réseau
- Entreprise : Talent, équité
- Candidats externes : Équité, transparence

**OPTIONS DISPONIBLES :**
- Option A : Traiter le candidat comme tout autre candidat
- Option B : Donner un avantage au candidat référé
- Option C : Processus aveugle pour tous

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Équité, transparence
  - Inconvénients : Potentiellement frustrant pour le cadre
  - Impact : Candidat évalué équitablement, cadre respecté, entreprise équitable

- Option B :
  - Avantages : Satisfaction du cadre
  - Inconvénients : Favoritisme, inéquité
  - Impact : Candidat avantagé, cadre satisfait, entreprise inéquitable

- Option C :
  - Avantages : Équité maximale
  - Inconvénients : Complexité de mise en œuvre
  - Impact : Candidat évalué aveuglément, cadre respecté, entreprise équitable

**RECOMMANDATION AVEC NUANCE :**
Option A est recommandée pour maintenir l'équité. Option C peut être considérée si le processus le permet. Option B est déconseillée en raison du risque de favoritisme.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider comment gérer les relations internes et les attentes des cadres. Cette décision dépend de la culture de l'entreprise et du contexte spécifique.

---

#### DILEMME 10 : Candidat avec Casier Judiciaire

**DESCRIPTION :**
Candidat avec un casier judiciaire non lié au poste. Comment évaluer ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Opportunité, réinsertion
- Entreprise : Talent, risque
- Équipe : Sécurité, performance
- Société : Réinsertion, sécurité

**OPTIONS DISPONIBLES :**
- Option A : Ignorer le casier si non lié au poste
- Option B : Disqualifier systématiquement
- Option C : Évaluer au cas par cas

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Réinsertion, évaluation du talent
  - Inconvénients : Risque potentiel
  - Impact : Candidat inclus, entreprise inclusive, société équitable

- Option B :
  - Avantages : Prudence
  - Inconvénients : Discrimination potentielle
  - Impact : Candidat exclu, entreprise prudente, société potentiellement discriminatoire

- Option C :
  - Avantages : Évaluation nuancée
  - Inconvénients : Complexité d'évaluation
  - Impact : Candidat évalué, entreprise informée, société équitable

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour une évaluation nuancée. Si le casier n'est pas lié au poste et ancien, Option A est recommandée. Option B est déconseillée sauf si le casier est lié au poste ou récent.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider si un casier judiciaire est pertinent pour le poste. Cette décision nécessite un jugement humain basé sur le contexte et les circonstances.

---

### 4.2 Dilemmes de Processus (11-20)

#### DILEMME 11 : Délai de Réponse aux Candidats

**DESCRIPTION :**
Délai de réponse aux candidats refusés. Répondre rapidement vs prendre le temps de formuler un feedback détaillé.

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidats refusés : Feedback rapide, dignité
- Entreprise : Efficacité, réputation
- Recruteurs : Temps, charge de travail

**OPTIONS DISPONIBLES :**
- Option A : Répondre rapidement avec feedback minimal
- Option B : Prendre le temps pour un feedback détaillé
- Option C : Répondre rapidement avec promesse de feedback détaillé

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Rapidité, efficacité
  - Inconvénients : Feedback minimal
  - Impact : Candidats informés, entreprise efficace, recruteurs efficaces

- Option B :
  - Avantages : Feedback détaillé, dignité
  - Inconvénients : Temps, délai
  - Impact : Candidats respectés, entreprise respectueuse, recruteurs chargés

- Option C :
  - Avantages : Rapidité + feedback détaillé
  - Inconvénients : Complexité de gestion
  - Impact : Candidats respectés, entreprise respectueuse, recruteurs chargés

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour équilibrer rapidité et qualité du feedback. Option B est recommandée si le temps le permet. Option A est acceptable si la charge de travail est élevée.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le temps à allouer au feedback. Cette décision dépend des ressources disponibles et des priorités de l'entreprise.

---

#### DILEMME 12 : Utilisation de l'IA dans le Processus

**DESCRIPTION :**
Utilisation de l'IA pour présélectionner les candidats. Comment assurer l'équité ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidats : Équité, transparence
- Entreprise : Efficacité, réduction des biais
- Recruteurs : Efficacité, support

**OPTIONS DISPONIBLES :**
- Option A : Utiliser l'IA sans intervention humaine
- Option B : Utiliser l'IA avec validation humaine
- Option C : Ne pas utiliser l'IA

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Efficacité maximale
  - Inconvénients : Risque de biais, manque de transparence
  - Impact : Candidats potentiellement biaisés, entreprise efficace, recruteurs efficaces

- Option B :
  - Avantages : Efficacité + contrôle humain
  - Inconvénients : Temps supplémentaire
  - Impact : Candidats protégés, entreprise équilibrée, recruteurs soutenus

- Option C :
  - Avantages : Contrôle humain total
  - Inconvénients : Moins d'efficacité
  - Impact : Candidats évalués humainement, entreprise moins efficace, recruteurs chargés

**RECOMMANDATION AVEC NUANCE :**
Option B est recommandée pour équilibrer efficacité et équité. Option A est déconseillée en raison du risque de biais. Option C est acceptable si les ressources le permettent.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le niveau d'automatisation approprié. Cette décision dépend des ressources disponibles et des valeurs de l'entreprise.

---

#### DILEMME 13 : Tests de Personnalité

**DESCRIPTION :**
Utilisation de tests de personnalité dans le processus. Comment assurer la confidentialité et l'équité ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidats : Confidentialité, équité
- Entreprise : Information, réduction des risques
- Fournisseurs de tests : Business, données

**OPTIONS DISPONIBLES :**
- Option A : Utiliser les tests sans restriction
- Option B : Utiliser les tests avec consentement explicite
- Option C : Ne pas utiliser les tests

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Information maximale
  - Inconvénients : Risque de violation de confidentialité
  - Impact : Candidats potentiellement exposés, entreprise informée, fournisseurs business

- Option B :
  - Avantages : Information + consentement
  - Inconvénients : Complexité de gestion
  - Impact : Candidats protégés, entreprise informée, fournisseurs business

- Option C :
  - Avantages : Confidentialité totale
  - Inconvénients : Moins d'information
  - Impact : Candidats protégés, entreprise moins informée, fournisseurs sans business

**RECOMMANDATION AVEC NUANCE :**
Option B est recommandée pour équilibrer information et confidentialité. Option A est déconseillée en raison du risque de violation de confidentialité. Option C est acceptable si les tests ne sont pas nécessaires.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider si les tests de personnalité sont nécessaires ou appropriés. Cette décision dépend des besoins de l'entreprise et du contexte spécifique.

---

#### DILEMME 14 : Vérification des Réseaux Sociaux

**DESCRIPTION :**
Vérification des réseaux sociaux des candidats. Comment respecter la vie privée ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidats : Vie privée, dignité
- Entreprise : Information, réputation
- Recruteurs : Information, temps

**OPTIONS DISPONIBLES :**
- Option A : Vérifier systématiquement les réseaux sociaux
- Option B : Vérifier uniquement si pertinent pour le poste
- Option C : Ne pas vérifier les réseaux sociaux

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Information maximale
  - Inconvénients : Violation de la vie privée
  - Impact : Candidats exposés, entreprise informée, recruteurs informés

- Option B :
  - Avantages : Information ciblée
  - Inconvénients : Subjectivité de la pertinence
  - Impact : Candidats partiellement protégés, entreprise informée, recruteurs informés

- Option C :
  - Avantages : Respect total de la vie privée
  - Inconvénients : Moins d'information
  - Impact : Candidats protégés, entreprise moins informée, recruteurs moins informés

**RECOMMANDATION AVEC NUANCE :**
Option B est recommandée pour équilibrer information et vie privée. Option A est déconseillée en raison du risque de violation de la vie privée. Option C est recommandée si l'information n'est pas nécessaire.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider ce qui est pertinent pour le poste. Cette décision nécessite un jugement humain basé sur le contexte et les exigences du poste.

---

#### DILEMME 15 : Offres Concurrentes

**DESCRIPTION :**
Candidat avec plusieurs offres concurrentes. Comment réagir sans créer une guerre des enchères ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Meilleure offre, décision éclairée
- Entreprise : Compétitivité, budget
- Autres entreprises : Compétition équitable

**OPTIONS DISPONIBLES :**
- Option A : Faire une contre-offre agressive
- Option B : Maintenir l'offre initiale
- Option C : Faire une contre-offre modérée

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Compétitivité maximale
  - Inconvénients : Guerre des enchères, inflation salariale
  - Impact : Candidat satisfait, entreprise compétitive, autres entreprises sous pression

- Option B :
  - Avantages : Budget respecté, stabilité
  - Inconvénients : Risque de perdre le candidat
  - Impact : Candidat potentiellement perdu, entreprise stable, autres entreprises non impactées

- Option C :
  - Avantages : Compromis
  - Inconvénients : Complexité de négociation
  - Impact : Candidat satisfait, entreprise compétitive, autres entreprises modérément impactées

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour équilibrer compétitivité et budget. Option A est déconseillée en raison du risque de guerre des enchères. Option B est recommandée si le candidat n'est pas critique.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider la valeur du candidat pour l'entreprise. Cette décision dépend de la stratégie de l'entreprise et du contexte spécifique.

---

### 4.3 Dilemmes de Communication (21-30)

#### DILEMME 21 : Feedback Négatif

**DESCRIPTION :**
Comment formuler un feedback négatif constructif sans décourager le candidat ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Feedback utile, dignité
- Entreprise : Réputation, aide au développement
- Recruteurs : Communication, temps

**OPTIONS DISPONIBLES :**
- Option A : Feedback direct et brutal
- Option B : Feedback constructif et détaillé
- Option C : Feedback minimal

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Honnêteté totale
  - Inconvénients : Découragement potentiel
  - Impact : Candidat potentiellement découragé, entreprise honnête, recruteurs directs

- Option B :
  - Avantages : Constructivité, aide au développement
  - Inconvénients : Temps, complexité
  - Impact : Candidat aidé, entreprise constructive, recruteurs investis

- Option C :
  - Avantages : Simplicité
  - Inconvénients : Feedback peu utile
  - Impact : Candidat peu aidé, entreprise simple, recruteurs efficaces

**RECOMMANDATION AVEC NUANCE :**
Option B est recommandée pour aider le candidat tout en préservant sa dignité. Option A est déconseillée en raison du risque de découragement. Option C est acceptable si le temps est limité.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le ton et le niveau de détail du feedback. Cette décision dépend du style de communication de l'entreprise et du contexte spécifique.

---

#### DILEMME 22 : Transparence sur les Raisons du Refus

**DESCRIPTION :**
Quel niveau de transparence sur les raisons du refus ? Tout révéler ou être vague ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Compréhension, amélioration
- Entreprise : Risque légal, réputation
- Recruteurs : Communication, protection

**OPTIONS DISPONIBLES :**
- Option A : Révéler toutes les raisons
- Option B : Révéler les raisons générales
- Option C : Être vague

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Transparence totale
  - Inconvénients : Risque légal
  - Impact : Candidat informé, entreprise transparente, recruteurs exposés

- Option B :
  - Avantages : Transparence partielle
  - Inconvénients : Moins d'information
  - Impact : Candidat partiellement informé, entreprise équilibrée, recruteurs protégés

- Option C :
  - Avantages : Protection légale
  - Inconvénients : Peu utile
  - Impact : Candidat peu informé, entreprise protégée, recruteurs protégés

**RECOMMANDATION AVEC NUANCE :**
Option B est recommandée pour équilibrer transparence et protection légale. Option A est déconseillée en raison du risque légal. Option C est acceptable si le risque légal est élevé.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le niveau de transparence approprié. Cette décision dépend du contexte juridique et des politiques de l'entreprise.

---

#### DILEMME 23 : Communication de l'Offre

**DESCRIPTION :**
Comment communiquer l'offre verbale vs écrite ? Risque de rétractation.

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Clarté, sécurité
- Entreprise : Flexibilité, engagement
- Recruteurs : Communication, engagement

**OPTIONS DISPONIBLES :**
- Option A : Offre verbale sans engagement écrit
- Option B : Offre verbale avec engagement écrit immédiat
- Option C : Offre écrite uniquement

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Flexibilité
  - Inconvénients : Risque de rétractation
  - Impact : Candidat potentiellement déçu, entreprise flexible, recruteurs flexibles

- Option B :
  - Avantages : Clarté, engagement
  - Inconvénients : Moins de flexibilité
  - Impact : Candidat sécurisé, entreprise engagée, recruteurs engagés

- Option C :
  - Avantages : Sécurité maximale
  - Inconvénients : Moins de flexibilité
  - Impact : Candidat sécurisé, entreprise sécurisée, recruteurs sécurisés

**RECOMMANDATION AVEC NUANCE :**
Option B est recommandée pour équilibrer flexibilité et engagement. Option A est déconseillée en raison du risque de rétractation. Option C est acceptable si la flexibilité n'est pas nécessaire.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le niveau d'engagement approprié. Cette décision dépend de la culture de l'entreprise et du contexte spécifique.

---

### 4.4 Dilemmes de Rétention et Onboarding (31-40)

#### DILEMME 31 : Période d'Essai

**DESCRIPTION :**
Comment gérer la période d'essai ? Être strict ou flexible ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Sécurité, intégration
- Entreprise : Flexibilité, performance
- Équipe : Performance, intégration

**OPTIONS DISPONIBLES :**
- Option A : Période d'essai stricte
- Option B : Période d'essai flexible
- Option C : Période d'essai adaptative

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Clarté, performance
  - Inconvénients : Stress, risque de départ
  - Impact : Candidat stressé, entreprise performante, équipe performante

- Option B :
  - Avantages : Flexibilité, intégration
  - Inconvénients : Moins de clarté
  - Impact : Candidat intégré, entreprise flexible, équipe intégrée

- Option C :
  - Avantages : Adaptation
  - Inconvénients : Complexité
  - Impact : Candidat adapté, entreprise adaptative, équipe adaptée

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour adapter la période d'essai au candidat et au poste. Option A est acceptable si le poste exige une performance immédiate. Option B est acceptable si l'intégration est prioritaire.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le niveau de flexibilité approprié. Cette décision dépend du poste et de la culture de l'entreprise.

---

#### DILEMME 32 : Formation à l'Arrivée

**DESCRIPTION :**
Niveau de formation à l'arrivée. Investir massivement ou minimal ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidat : Formation, intégration
- Entreprise : Coût, performance
- Équipe : Support, performance

**OPTIONS DISPONIBLES :**
- Option A : Formation minimale
- Option B : Formation standard
- Option C : Formation intensive

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Coût minimal
  - Inconvénients : Risque d'échec
  - Impact : Candidat peu formé, entreprise économique, équipe peu soutenue

- Option B :
  - Avantages : Équilibre
  - Inconvénients : Coût modéré
  - Impact : Candidat formé, entreprise équilibrée, équipe soutenue

- Option C :
  - Avantages : Intégration maximale
  - Inconvénients : Coût élevé
  - Impact : Candidat bien formé, entreprise investie, équipe bien soutenue

**RECOMMANDATION AVEC NUANCE :**
Option B est recommandée pour équilibrer coût et intégration. Option C est recommandée pour les postes critiques. Option A est acceptable pour les postes simples.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider le niveau d'investissement en formation. Cette décision dépend du budget et de la criticité du poste.

---

### 4.5 Dilemmes de Diversité et Inclusion (41-50)

#### DILEMME 41 : Quotas de Diversité

**DESCRIPTION :**
Implémenter des quotas de diversité ou non ?

**PARTIES PRENANTES ET LEURS INTÉRÊTS :**
- Candidats diversifiés : Opportunité équitable
- Candidats non diversifiés : Équité
- Entreprise : Diversité, performance
- Société : Équité, représentation

**OPTIONS DISPONIBLES :**
- Option A : Quotas stricts
- Option B : Objectifs de diversité
- Option C : Pas de quotas

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Diversité garantie
  - Inconvénients : Discrimination potentielle
  - Impact : Candidats diversifiés favorisés, entreprise diverse, société équitable

- Option B :
  - Avantages : Diversité encouragée
  - Inconvénients : Moins de garantie
  - Impact : Candidats diversifiés encouragés, entreprise diverse, société équitable

- Option C :
  - Avantages : Méritocratie pure
  - Inconvénients : Moins de diversité
  - Impact : Candidats évalués sur mérite, entreprise moins diverse, société moins équitable

**RECOMMANDATION AVEC NUANCE :**
Option B est recommandée pour encourager la diversité sans discrimination. Option A est déconseillée en raison du risque de discrimination. Option C est acceptable si la diversité n'est pas une priorité.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider si les quotas sont appropriés. Cette décision dépend des valeurs de l'entreprise et du contexte juridique.

---

#### DILEMME 42 : Langue des Entretiens

**DESCRIPTION :**
Langue des entretiens pour les candidats internationaux. Langue maternelle ou langue de travail ?

**PARTIES PRENANTES ET LEURS INTÉRÊS :**
- Candidat international : Expression, équité
- Candidat local : Avantage
- Entreprise : Évaluation, intégration
- Équipe : Communication

**OPTIONS DISPONIBLES :**
- Option A : Entretien en langue maternelle
- Option B : Entretien en langue de travail
- Option C : Entretien bilingue

**ANALYSE ÉTHIQUE DE CHAQUE OPTION :**
- Option A :
  - Avantages : Expression maximale
  - Inconvénients : Évaluation de la langue de travail
  - Impact : Candidat international exprimé, entreprise informée, équipe potentiellement désavantagée

- Option B :
  - Avantages : Évaluation de la langue de travail
  - Inconvénients : Expression limitée
  - Impact : Candidat international limité, entreprise informée, équipe avantagée

- Option C :
  - Avantages : Équilibre
  - Inconvénients : Complexité
  - Impact : Candidat international évalué, entreprise informée, équipe équilibrée

**RECOMMANDATION AVEC NUANCE :**
Option C est recommandée pour équilibrer expression et évaluation de la langue de travail. Option B est acceptable si la langue de travail est critique. Option A est acceptable si la langue de travail n'est pas critique.

**CE QUE LE MOTEUR NE PEUT PAS DÉCIDER À LA PLACE DE L'HUMAIN :**
Le moteur ne peut pas décider la langue appropriée pour l'entretien. Cette décision dépend des exigences du poste et du contexte spécifique.

---

## 5. Structure de Données (TypeScript)

```typescript
interface EthicalDilemma {
  dilemmaId: string;
  dilemmaNumber: number;
  title: string;
  category: 'selection' | 'process' | 'communication' | 'retention' | 'diversity';
  
  description: string;
  
  stakeholders: {
    stakeholder: string;
    interest: string;
  }[];
  
  options: {
    option: string;
    description: string;
  }[];
  
  ethicalAnalysis: {
    option: string;
    advantages: string[];
    disadvantages: string[];
    stakeholderImpact: string;
  }[];
  
  recommendation: {
    recommendation: string;
    justification: string;
    conditions: string[];
  };
  
  engineLimitations: {
    whatEngineCannotDecide: string;
  };
  
  metadata: {
    createdAt: Date;
    version: string;
    status: 'active' | 'archived';
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE ethical_dilemma (
  id VARCHAR(36) PRIMARY KEY,
  dilemma_number INT NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('selection', 'process', 'communication', 'retention', 'diversity')),
  
  description TEXT NOT NULL,
  stakeholders JSON NOT NULL,
  options JSON NOT NULL,
  ethical_analysis JSON NOT NULL,
  recommendation JSON NOT NULL,
  engine_limitations JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ethical_dilemma_category ON ethical_dilemma(category);
CREATE INDEX idx_ethical_dilemma_number ON ethical_dilemma(dilemma_number);
```

---

## 7. API Endpoints

```typescript
// GET /api/ethical/dilemmas
async function getEthicalDilemmas(): Promise<EthicalDilemma[]> {
  return await getEthicalDilemmas();
}

// GET /api/ethical/dilemmas/:dilemmaId
async function getEthicalDilemma(dilemmaId: string): Promise<EthicalDilemma> {
  return await getEthicalDilemmaById(dilemmaId);
}

// GET /api/ethical/dilemmas/category/:category
async function getDilemmasByCategory(category: string): Promise<EthicalDilemma[]> {
  return await getDilemmasByCategory(category);
}

// POST /api/ethical/dilemmas/search
async function searchDilemmas(query: string): Promise<EthicalDilemma[]> {
  return await searchDilemmas(query);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de couverture | Dilemmes documentés / total | 50/50 |
- Taux d'utilisation | Dilemmes consultés / créés | ≥ 80% |
- Satisfaction recruteurs | Satisfaction avec la guidance | ≥ 4.5/5 |
- Pertinence des recommandations | Recommandations suivies / totales | ≥ 70% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de la prise de décision | Amélioration de la qualité des décisions | ≥ 30% |
- Réduction des dilemmes non résolus | Réduction des dilemmes non résolus | ≥ 40% |
- Confiance dans le processus | Confiance des recruteurs | ≥ 4.5/5 |

---

## 9. Conclusion

La bibliothèque des 50 dilemmes éthiques RH fournit une analyse détaillée des dilemmes les plus fréquents en recrutement. Chaque dilemme est structuré avec une description, les parties prenantes, les options disponibles, l'analyse éthique de chaque option, une recommandation nuancée, et les limites du moteur. Cette bibliothèque sert de ressource pour les recruteurs face à des situations éthiques complexes.

**Points clés :**
- 50 dilemmes éthiques structurés
- 5 catégories de dilemmes
- Analyse multi-parties prenantes
- Options éthiques détaillées
- Recommandations nuancées
- Limites du moteur explicitées
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour l'accès
- Métriques de qualité et d'impact
