# RH-PROMPTS — Séquence Complète Améliorée

**Version:** 2.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## Table des Matières

- [PROMPT 0 — Charte Fondatrice](#prompt-0)
- [PROMPT 1 — Fondation Documentaire RH](#prompt-1)
- [PROMPT 2 — Corpus de Connaissance Métier](#prompt-2)
- [PROMPT 3 — Définition du MVP](#prompt-3)
- [PROMPT 4 — Catalogue des Cas d'Usage](#prompt-4)
- [PROMPT 5 — Knowledge Packs](#prompt-5)
- [PROMPT 6 — Stratégie des Sources](#prompt-6)
- [PROMPT 7 — Hiérarchie des Normes](#prompt-7)
- [PROMPT 8 — Validation Humaine](#prompt-8)
- [PROMPT 9 — Protocole Anti-Biais](#prompt-9)
- [PROMPT 10 — Mise à Jour Continue](#prompt-10)

---

## PROMPT 0 — Charte Fondatrice RH

**Nouveau document fondamental**

Créer le document :

**RH-000 — Charte Fondatrice du Moteur Cognitif RH**

Ce document définit les principes éthiques, la conformité RGPD, et la responsabilité du moteur cognitif RH. Il doit précéder toute autre construction.

**Contenu obligatoire :**

1. **Éthique et Responsabilité**
   - Le moteur est un outil d'aide à la décision, jamais un décideur
   - La décision finale appartient toujours à l'humain habilité
   - Principe de transparence : le moteur doit toujours expliquer son raisonnement
   - Principe de responsabilité : le moteur ne peut engager la responsabilité juridique du cabinet

2. **Conformité RGPD**
   - Classification des données RH par niveau de sensibilité (1 à 4)
   - Base légale de chaque type de traitement
   - Durées de conservation par catégorie de données
   - Droits des personnes (accès, rectification, suppression)
   - Processus de consentement explicite

3. **Périmètre d'Exclusion**
   - Données individuelles nominatives réelles
   - Décisions disciplinaires
   - Données de santé
   - Conseils juridiques engageant la responsabilité
   - Toute situation nécessitant un expert humain qualifié

4. **Gouvernance**
   - Responsable du système (DRH Senior)
   - Comité de validation (DRH + Juriste + DPO)
   - Fréquence de révision obligatoire
   - Processus d'escalade

---

## PROMPT 1 — Fondation Documentaire RH

**Amélioré : Gouvernance déplacée en premier**

Créer un nouveau domaine documentaire :

`docs/rh/`

**Objectif :**

Créer la fondation complète de la connaissance RH.

Ne plus créer de Runtime générique.

À partir de maintenant les documents décrivent exclusivement le domaine RH.

**Créer notamment (dans cet ordre) :**

1. **RH-006 Gouvernance RH** (déplacé en premier)
   - Règles de vie du système
   - Responsabilités
   - Processus de validation
   - Fréquences de révision

2. **RH-001 Vision RH**
   - Boussole stratégique
   - Objectifs du moteur cognitif RH
   - Positionnement par rapport aux outils existants

3. **RH-002 Vocabulaire RH**
   - Langage commun
   - Définitions des termes RH
   - Glossaire normé

4. **RH-003 Ontologie RH**
   - Carte des concepts et leurs relations
   - Entités fondamentales
   - Relations entre entités
   - Distinction claire avec RH-004 Taxonomie

5. **RH-004 Taxonomie RH**
   - Système de classification
   - Catégories et sous-catégories
   - Hiérarchies de classification
   - Distinction claire avec RH-003 Ontologie

6. **RH-005 Référentiel RH**
   - Source de vérité
   - Référentiels externes (Code du Travail, CCN, etc.)
   - Référentiels internes

**Contraintes :**
- Uniquement du métier RH
- Aucune technologie
- Aucune implémentation
- Uniquement les concepts métier
- Langage normatif

**Note importante :**
RH-003 Ontologie et RH-004 Taxonomie doivent avoir une frontière claire :
- **Ontologie** : concepts et relations (ex : "Poste" a pour responsable "Manager")
- **Taxonomie** : classifications (ex : "Poste" appartient à la catégorie "Tech")

---

## PROMPT 2 — Corpus de Connaissance Métier

**Amélioré : Ajout des domaines manquants**

Construire progressivement la base de connaissance RH.

Créer une RFC métier par grand domaine RH.

**Commencer par :**

RH-100 Recrutement
RH-110 Contrat
RH-120 Salarié
RH-130 Poste
RH-140 Compétence
RH-150 Formation
RH-160 Evaluation
RH-170 Performance
RH-180 Mobilité
RH-190 Rémunération
RH-200 Relations Sociales & IRP (NOUVEAU)
RH-210 Santé & QVCT (NOUVEAU)
RH-220 Discipline & Rupture (NOUVEAU)

**Pour chaque document :**
- Définitions
- Concepts
- Relations (avec dépendances explicites vers d'autres domaines)
- Contraintes métier
- Vocabulaire
- Règles
- Cycle de vie (temporalité des concepts)
- Traçabilité

**Exemples de dépendances à documenter :**
- Compétence → alimente → Recrutement, Formation, Évaluation, Mobilité
- Poste → a pour → Compétences requises
- Salarié → possède → Compétences
- Contrat → définit → Rémunération

**Temporalité des concepts :**
- Un poste a un cycle de vie (création, évolution, suppression)
- Une compétence évolue dans le temps (obsolescence, émergence)
- Un salarié a une trajectoire de carrière

**Ne jamais parler de code.**
**Ne jamais parler d'API.**
**Uniquement de la connaissance métier RH.**

---

## PROMPT 3 — Définition du MVP

**Amélioré : Ajout des capacités de qualification et d'escalade**

À partir de l'architecture existante et de la connaissance RH, définir le MVP du moteur RH.

**Objectif :**
Être capable de répondre correctement à un DRH.

**Identifier les fonctionnalités minimales :**

1. **Comprendre** une question RH
   - Détecter l'intention
   - Détecter le contexte RH

2. **Retrouver** les connaissances
   - Sélectionner les bonnes connaissances
   - Appliquer le RAG (Retrieval Augmented Generation)

3. **Raisonner**
   - Appliquer les règles métier
   - Appliquer la hiérarchie des normes (réf. RH-007)

4. **Qualifier** sa propre confiance
   - Évaluer le niveau de confiance de la réponse
   - Détecter l'incertitude
   - Savoir dire "je ne sais pas"

5. **Expliquer**
   - Argumenter avec les sources
   - Citer les règles utilisées

6. **Escalader**
   - Savoir quand renvoyer à un expert humain
   - Identifier les cas nécessitant escalade
   - Orienter vers l'expert compétent

7. **Produire** une réponse argumentée
   - Structured Output
   - Traçabilité des sources

**Décrire les capacités minimales.**
**Ne pas ajouter de nouveaux runtimes.**
**Réutiliser exclusivement l'architecture existante.**

---

## PROMPT 4 — Catalogue des Cas d'Usage

**Amélioré : Ajout du niveau de risk et de l'escalade**

Construire le catalogue officiel des cas d'usage.

Créer :

**RH-900 — Catalogue des Cas d'Usage**

Décrire les 120 premiers cas métier.

**Structure normée d'un cas d'usage :**

```
CU-XXX — [Intitulé]

Domaine RH         : référence à RH-100 à RH-220
Acteur principal   : DRH / Manager / Candidat / Salarié / Direction
Niveau de risque   : Faible / Modéré / Élevé / Critique
Escalade requise   : Oui / Non / Conditionnel

Contexte           :
(Qui est l'acteur, dans quelle situation se trouve-t-il,
 quel est son environnement organisationnel)

Objectif           :
(Ce que l'acteur veut obtenir concrètement)

Connaissances mobilisées :
(Liste des RFC et Knowledge Packs nécessaires)

Hiérarchie de normes :
(Quelles normes s'appliquent, réf. RH-007)

Raisonnement attendu :
(Étapes de raisonnement que le moteur doit suivre)

Résultat attendu   :
(Format et contenu de la réponse idéale)

Points de vigilance :
(Risques, biais possibles, zones grises)

Limites du moteur  :
(Ce que le moteur ne peut pas faire sur ce cas)
(Ce qui doit être escaladé à un expert humain)
```

**Distribuer les 120 cas d'usage ainsi :**

- **RECRUTEMENT (CU-001 à CU-020)**
- **CONTRAT & DROIT (CU-021 à CU-035)** — Note : Escalade fréquente requise
- **COMPÉTENCES & FORMATION (CU-036 à CU-055)**
- **ÉVALUATION & PERFORMANCE (CU-056 à CU-075)** — Note : Cas disciplinaires → escalade systématique
- **RÉMUNÉRATION & GPEC (CU-076 à CU-090)** — Note : Données individuelles réelles → hors périmètre
- **MOBILITÉ & CARRIÈRE (CU-091 à CU-100)**
- **SANTÉ, QVCT & RELATIONS SOCIALES (CU-101 à CU-120)** — Note : Escalade prioritaire

**Contraintes :**
- Aucune implémentation
- Chaque cas cite ses sources normatives
- Le niveau de risque est obligatoire pour chaque cas
- L'escalade est traitée comme une capacité à part entière

---

## PROMPT 5 — Knowledge Packs

**Amélioré : Ajout des packs transversaux et méta-pack**

Créer les Knowledge Packs RH.

Chaque pack représente un domaine métier autonome.

**Créer :**

KP-01 — Recrutement
KP-02 — Contrat de Travail
KP-03 — Salarié
KP-04 — Formation
KP-05 — Compétence
KP-06 — Évaluation
KP-07 — Rémunération
KP-08 — Mobilité
KP-09 — GPEC & Succession (méta-pack)
KP-10 — Droit Social
KP-11 — Relations Sociales & IRP (NOUVEAU)
KP-12 — Santé & QVCT (NOUVEAU)
KP-13 — Non-Discrimination (NOUVEAU — transversal)
KP-14 — RGPD RH (NOUVEAU — transversal)

**Pour chacun :**
- Périmètre
- Concepts
- Ontologies utilisées (réf. RH-003)
- Taxonomies utilisées (réf. RH-004)
- Contraintes
- Dépendances (critiques)
- Gouvernance
- Qualité

**Dépendances critiques à documenter :**
- KP-Recrutement → KP-Compétence, KP-Poste, KP-DroitSocial
- KP-Rémunération → KP-Poste, KP-Compétence, KP-DroitSocial
- KP-GPEC → Tous les autres packs (méta-pack)

**Note spécifique :**
KP-13 Non-Discrimination et KP-14 RGPD RH sont des packs TRANSVERSAUX.
Ils s'appliquent à TOUS les autres packs.
Aucun pack ne peut être utilisé sans KP-13 et KP-14 actifs.

**Note architecturale :**
KP-09 GPEC & Succession est un méta-pack.
Il n'est pas au même niveau que les autres.
Il agrège et orchestre KP-03, KP-05, KP-06, KP-07, KP-08.
Le créer en dernier, après validation de tous les packs qu'il agrège.

---

## PROMPT 6 — Stratégie des Sources

**Amélioré : Ajout de la hiérarchie des contradictions et de l'obsolescence**

Créer la stratégie d'acquisition de connaissances RH.

Créer le document :

**RH-800 — Stratégie des Sources de Connaissance**

**PARTIE 1 — CARTOGRAPHIE DES SOURCES**

Classer toutes les sources en 4 niveaux de confiance :

**NIVEAU A — Confiance Maximale (sources normatives officielles)**
- Code du Travail (Légifrance — version consolidée)
- Code de la Sécurité Sociale
- Jurisprudence Cour de Cassation (Chambre Sociale)
- Directives européennes en droit social
- Décisions du Conseil d'État

*Fréquence de vérification : mensuelle minimum*
*Responsable : Juriste en droit social*

**NIVEAU B — Confiance Élevée (sources conventionnelles)**
- Conventions Collectives Nationales (CCN)
- Accords de branche étendus
- Référentiel ROME (France Travail)
- Référentiel ESCO (Commission Européenne)

*Fréquence de vérification : trimestrielle*
*Responsable : DRH référent par secteur*

**NIVEAU C — Confiance Moyenne (sources organisationnelles)**
- Politiques RH internes
- Accords d'entreprise
- Procédures internes RH
- Fiches de poste existantes

*Niveau de confidentialité : élevé à critique*
*Fréquence de vérification : semestrielle*
*Responsable : DRH de l'organisation*

**NIVEAU D — Confiance Conditionnelle (sources secondaires)**
- FAQ RH
- Articles et publications RH
- Études et rapports (Dares, OCDE, BIT)

*Usage uniquement pour enrichir, jamais comme source unique*
*Fréquence de vérification : annuelle*

**SOURCES EXCLUES :**
- Évaluations individuelles nominatives
- Dossiers médicaux
- Données salariales individuelles nominatives

**PARTIE 2 — HIÉRARCHIE EN CAS DE CONTRADICTION**

Quand deux sources se contredisent :
1. La source de niveau supérieur prime (A > B > C > D)
2. En cas de même niveau, la source la plus récente prime
3. En cas de même niveau et même date, appliquer la règle la plus favorable au salarié
4. Si contradiction non résolue → signaler et escalader

**PARTIE 3 — GESTION DE L'OBSOLESCENCE**

Seuils d'obsolescence :
- Code du Travail / Lois → mensuelle
- Conventions Collectives → trimestrielle
- Accords d'entreprise → semestrielle
- Politiques internes → semestrielle

---

## PROMPT 7 — Hiérarchie des Normes RH

**NOUVEAU**

Créer le document :

**RH-007 — Hiérarchie des Normes RH**

Ce document définit la hiérarchie des normes qui s'appliquent en droit du travail français.

**Hiérarchie des normes (du plus fort au plus faible) :**

1. **Normes Constitutionnelles et Supranationales**
   - Constitution française
   - Traités internationaux
   - Directives européennes
   - Conventions internationales

2. **Lois et Règlements**
   - Code du Travail
   - Lois spécifiques
   - Décrets
   - Arrêtés

3. **Conventions Collectives et Accords de Branche**
   - Conventions Collectives Nationales (CCN)
   - Accords de branche étendus
   - Avenants

4. **Accords d'Entreprise et d'Établissement**
   - Accords d'entreprise
   - Accords d'établissement
   - Usages

5. **Contrat de Travail**
   - Contrat individuel
   - Engagement unilatéral

6. **Règlement Intérieur et Politiques Internes**
   - Règlement intérieur
   - Notes de service
   - Politiques RH

**Principe de faveur :**
En cas de conflit entre deux normes de même niveau, la norme la plus favorable au salarié s'applique.

**Application dans le moteur :**
Le raisonnement doit toujours vérifier la hiérarchie des normes avant de produire une réponse.

---

## PROMPT 8 — Validation Humaine

**NOUVEAU**

Créer le document :

**RH-850 — Protocole de Validation Humaine (Human-in-the-Loop)**

**Principe fondateur :**
Le moteur cognitif RH est un outil d'aide à la décision.
La décision finale appartient toujours à l'humain habilité.

**PARTIE 1 — CARTOGRAPHIE DES DÉCISIONS**

Classer toutes les décisions RH en 4 niveaux :

**NIVEAU 1 — Décision autonome du moteur autorisée**
- Exemples : Définir les mentions obligatoires d'une fiche de poste, expliquer une règle légale claire

**NIVEAU 2 — Décision assistée (moteur + validation DRH)**
- Exemples : Rédiger une offre d'emploi, construire une grille d'évaluation

**NIVEAU 3 — Décision réservée à l'expert humain**
- Exemples : Interpréter une convention collective sur un cas litigieux, gérer un conflit individuel

**NIVEAU 4 — Hors périmètre du moteur**
- Exemples : Décision de licenciement, diagnostic médical

**PARTIE 2 — PROTOCOLE D'ESCALADE**

Pour chaque situation nécessitant escalade :
1. Signaler clairement la limite atteinte
2. Expliquer pourquoi le moteur ne peut pas répondre seul
3. Indiquer le niveau de risque
4. Orienter vers l'expert compétent
5. Proposer ce que le moteur peut faire dans ses limites
6. Tracer l'escalade dans le journal

---

## PROMPT 9 — Protocole Anti-Biais

**NOUVEAU**

Créer le document :

**RH-860 — Protocole Anti-Biais**

Ce document est subordonné à RH-000. Il s'applique à toutes les réponses du moteur.

**PARTIE 1 — INVENTAIRE DES BIAIS EN CONTEXTE RH**

Biais de recrutement :
- Biais d'affinité
- Biais de halo
- Biais de confirmation
- Biais de stéréotype (genre, âge, origine)

Critères de discrimination prohibés (réf. Article L.1132-1 Code du Travail) :
Origine, Sexe, Mœurs, Orientation sexuelle, Identité de genre, Âge, Situation de famille, Grossesse, Caractéristiques génétiques, Particulière vulnérabilité économique, Appartenance ethnique, Nation, Race, Opinions politiques, Activités syndicales, Exercice d'un mandat électif, Religion, Apparence physique, Nom de famille, Lieu de résidence, Domiciliation bancaire, État de santé, Perte d'autonomie, Handicap, Capacité à s'exprimer en français.

**PARTIE 2 — PROTOCOLE DE DÉTECTION**

Le moteur analyse systématiquement :
- Les questions posées
- Les documents soumis
- Ses propres réponses

**PARTIE 3 — PROTOCOLE DE CORRECTION**

Si un biais est détecté :
1. Nommer le biais détecté
2. Expliquer pourquoi c'est problématique
3. Proposer une formulation alternative neutre et légale
4. Tracer la détection dans le journal
5. Ne jamais produire le contenu biaisé

---

## PROMPT 10 — Mise à Jour Continue

**NOUVEAU**

Créer le document :

**RH-870 — Stratégie de Mise à Jour Continue**

Un moteur cognitif RH qui n'est pas maintenu devient dangereux.

**PARTIE 1 — CALENDRIER DE RÉVISION**

- **Révision mensuelle :** Code du Travail, jurisprudence
- **Révision trimestrielle :** Conventions Collectives
- **Révision semestrielle :** Sources de niveau C
- **Révision annuelle :** Audit global

**PARTIE 2 — PROCESSUS DE MISE À JOUR**

Pour chaque modification :
1. Détection
2. Évaluation d'impact
3. Validation (métier + juridique + DPO)
4. Mise à jour
5. Traçabilité

**PARTIE 3 — GESTION DES RÉFORMES MAJEURES**

Délai maximal de mise à jour après réforme :
- Domaines à risque Critique : 15 jours
- Domaines à risque Élevé : 30 jours
- Domaines à risque Modéré : 60 jours
- Domaines à risque Faible : 90 jours

**PARTIE 4 — INDICATEURS DE SANTÉ DU CORPUS**

- Taux de fraîcheur
- Taux de couverture
- Taux d'escalade
- Taux de biais détectés
- Taux de contradictions

---

## Résumé de la Séquence

```
┌─────────────────────────────────────────────────────┐
│         SÉQUENCE COMPLÈTE — 10 PROMPTS              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PROMPT 0  RH-000   Charte Fondatrice    NOUVEAU    │
│            Éthique + RGPD + Responsabilité          │
│                                                     │
│  PROMPT 1  RH-001 à RH-006         AMÉLIORÉ       │
│            Fondation + Gouvernance en premier         │
│                                                     │
│  PROMPT 2  RH-100 à RH-220         AMÉLIORÉ       │
│            + Relations Sociales + Santé + Discipline  │
│            + Dépendances + Temporalité               │
│                                                     │
│  PROMPT 3  MVP                         AMÉLIORÉ       │
│            + Qualification + Escalade               │
│                                                     │
│  PROMPT 4  RH-900   120 Cas d'usage      AMÉLIORÉ   │
│            + Niveau de risque + Escalade            │
│                                                     │
│  PROMPT 5  KP-01 à KP-14             AMÉLIORÉ       │
│            + 4 packs transversaux + méta-pack        │
│                                                     │
│  PROMPT 6  RH-800   Stratégie Sources    AMÉLIORÉ   │
│            + Hiérarchie contradictions + Obsolescence │
│                                                     │
│  PROMPT 7  RH-007   Hiérarchie Normes   NOUVEAU    │
│                                                     │
│  PROMPT 8  RH-850   Validation Humaine   NOUVEAU    │
│            4 niveaux de décision                    │
│                                                     │
│  PROMPT 9  RH-860   Anti-Biais           NOUVEAU    │
│            Détection + Correction                    │
│                                                     │
│  PROMPT 10 RH-870   Mise à Jour Continue NOUVEAU    │
│            Calendrier + Indicateurs                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  DOCUMENTS CRÉÉS        : 35+                       │
│  KNOWLEDGE PACKS        : 14                        │
│  CAS D'USAGE            : 120                       │
│  ANGLES MORTS COUVERTS  : 5/5                       │
└─────────────────────────────────────────────────────┘
```

---

## Note sur MVP-018 et MVP-019

Conformément à l'analyse de résolution des conflits de contenu :

**MVP-018 (REFONDÉ) — Relational Dynamics Engine**
- Nouveau focus : Dynamique relation recruteur/candidat en entretien réel
- Différent de DOC-016-09 (candidat seul / simulation)
- Capacités : Analyse de la dynamique de pouvoir, Cartographie des moments clés, Adaptation de posture en temps réel

**MVP-019 (REFONDÉ) — Market Intelligence Engine**
- Nouveau focus : Intelligence marché externe
- Différent de MVP-017 (légalité / entretien seul)
- Capacités : Benchmark salarial temps réel, Indice de tension, Intelligence concurrentielle, Évolution des attentes candidats

**DOC-GOUVERNANCE-001 — Registre des Périmètres MVP**
- À créer pour éviter les futurs doublons
- Pour chaque MVP : périmètre, frontières, vérification anti-doublon
