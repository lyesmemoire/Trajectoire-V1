# KP-002 — Référentiel des compétences

## Identité

KP-002 EST LE RÉFÉRENTIEL DES COMPÉTENCES DU KNOWLEDGE PACK RH V1.

KP-002 EST CONFORME À RFC-RH-001 HUMAN RESOURCES KNOWLEDGE MODEL.

KP-002 EST CONFORME À RFC-RH-002 SKILLS ONTOLOGY.

KP-002 EST VERSIONNÉ.

KP-002 EST TRAÇABLE.

KP-002 EST EXTENSIBLE.

## Objectif

DÉFINIR UN RÉFÉRENTIEL DE COMPÉTENCES UTILISABLE PAR LE MOTEUR COGNITIF POUR COMPRENDRE LES CAPACITÉS PROFESSIONNELLES.

## Structure des données

CHAQUE COMPÉTENCE EST DÉFINIE PAR LES ATTRIBUTS SUIVANTS :

- id : IDENTIFIANT STABLE
- nom : INTITULÉ DE LA COMPÉTENCE
- définition : DÉFINITION NORMATIVE
- famille : FAMILLE DE COMPÉTENCES
- type : TYPE DE COMPÉTENCE (HARD SKILL, SOFT SKILL, TECHNIQUE, FONCTIONNELLE, COMPORTEMENTALE, LINGUISTIQUE, RÉGLEMENTAIRE)
- niveau : NIVEAU DE LA COMPÉTENCE (DÉBUTANT, INTERMÉDIAIRE, AVANCÉ, EXPERT)
- synonymes : LISTE DES SYNONYMES
- compétences_liées : LISTE DES COMPÉTENCES LIÉES
- dépendances : LISTE DES COMPÉTENCES DONT ELLE DÉPEND
- proximités : LISTE DES COMPÉTENCES PROCHES
- transférable : INDICATEUR DE TRANSFÉRABILITÉ
- émergente : INDICATEUR DE COMPÉTENCE ÉMERGENTE
- obsolescence : NIVEAU D'OBSOLESCENCE
- maturité : NIVEAU DE MATURITÉ
- provenance : SOURCE DE LA DONNÉE
- date_création : DATE DE CRÉATION
- date_mise_à_jour : DATE DE MISE À JOUR
- statut_validation : STATUT DE VALIDATION
- relations : RELATIONS EXPLICITES AVEC D'AUTRES ÉLÉMENTS

## Familles de compétences

### Famille : Compétences techniques

COMPÉTENCES LIÉES AUX ASPECTS TECHNIQUES DU TRAVAIL.

### Famille : Compétences comportementales

COMPÉTENCES LIÉES AUX ATTITUDES ET COMPORTEMENTS.

### Famille : Compétences linguistiques

COMPÉTENCES LIÉES AUX LANGUES.

### Famille : Compétences méthodologiques

COMPÉTENCES LIÉES AUX MÉTHODES DE TRAVAIL.

### Famille : Compétences organisationnelles

COMPÉTENCES LIÉES À L'ORGANISATION DU TRAVAIL.

## Échantillon de compétences

### Compétence : Programmation orientée objet

```yaml
id: COMP-001
nom: Programmation orientée objet
définition: Capacité à concevoir et développer des logiciels en utilisant les principes de la programmation orientée objet.
famille: Compétences techniques
type: Technique
niveau: Avancé
synonymes:
  - OOP
  - Object-Oriented Programming
  - POO
compétences_liées:
  - Programmation
  - Conception logicielle
dépendances:
  - Programmation de base
proximités:
  - Programmation fonctionnelle
  - Programmation procédurale
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Développeur Backend
  - type: requise_par
    cible: Développeur Frontend
```

### Compétence : HTML/CSS

```yaml
id: COMP-002
nom: HTML/CSS
définition: Capacité à créer et structurer des pages web en utilisant HTML et CSS.
famille: Compétences techniques
type: Technique
niveau: Intermédiaire
synonymes:
  - Web markup
  - Styling web
compétences_liées:
  - Développement web
  - Responsive design
dépendances: []
proximités:
  - JavaScript
  - Frameworks frontend
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Développeur Frontend
```

### Compétence : JavaScript

```yaml
id: COMP-003
nom: JavaScript
définition: Capacité à développer des applications web interactives en utilisant JavaScript.
famille: Compétences techniques
type: Technique
niveau: Avancé
synonymes:
  - JS
  - ECMAScript
compétences_liées:
  - Développement web
  - Programmation
dépendances:
  - HTML/CSS
proximités:
  - TypeScript
  - Frameworks frontend
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Développeur Frontend
  - type: proche_de
    cible: TypeScript
```

### Compétence : Python

```yaml
id: COMP-004
nom: Python
définition: Capacité à développer des applications et scripts en utilisant le langage Python.
famille: Compétences techniques
type: Technique
niveau: Avancé
synonymes:
  - Python programming
compétences_liées:
  - Programmation
  - Data Science
dépendances: []
proximités:
  - Java
  - C++
  - JavaScript
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Data Scientist
  - type: proche_de
    cible: Java
```

### Compétence : Machine Learning

```yaml
id: COMP-005
nom: Machine Learning
définition: Capacité à concevoir et mettre en œuvre des modèles d'apprentissage automatique.
famille: Compétences techniques
type: Technique
niveau: Expert
synonymes:
  - ML
  - Apprentissage automatique
compétences_liées:
  - Data Science
  - Statistiques
dépendances:
  - Python
  - Statistiques
proximités:
  - Deep Learning
  - Intelligence artificielle
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Data Scientist
  - type: proche_de
    cible: Deep Learning
```

### Compétence : Docker

```yaml
id: COMP-006
nom: Docker
définition: Capacité à utiliser Docker pour la conteneurisation d'applications.
famille: Compétences techniques
type: Technique
niveau: Intermédiaire
synonymes:
  - Containerization
  - Docker containers
compétences_liées:
  - DevOps
  - Cloud computing
dépendances: []
proximités:
  - Kubernetes
  - Virtualisation
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Ingénieur DevOps
  - type: proche_de
    cible: Kubernetes
```

### Compétence : Kubernetes

```yaml
id: COMP-007
nom: Kubernetes
définition: Capacité à utiliser Kubernetes pour l'orchestration de conteneurs.
famille: Compétences techniques
type: Technique
niveau: Avancé
synonymes:
  - K8s
  - Container orchestration
compétences_liées:
  - DevOps
  - Cloud computing
dépendances:
  - Docker
proximités:
  - Docker
  - Cloud platforms
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Ingénieur DevOps
  - type: proche_de
    cible: Docker
```

### Compétence : Gestion de projet

```yaml
id: COMP-008
nom: Gestion de projet
définition: Capacité à planifier, organiser et piloter des projets pour atteindre les objectifs définis.
famille: Compétences méthodologiques
type: Méthodologique
niveau: Avancé
synonymes:
  - Project Management
  - PM
compétences_liées:
  - Planification
  - Leadership
dépendances: []
proximités:
  - Agile
  - Scrum
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Chef de Projet
  - type: proche_de
    cible: Agile
```

### Compétence : Communication

```yaml
id: COMP-009
nom: Communication
définition: Capacité à transmettre efficacement des informations oralement et par écrit.
famille: Compétences comportementales
type: Comportementale
niveau: Intermédiaire
synonymes:
  - Communication skills
  - Communication efficace
compétences_liées:
  - Collaboration
  - Leadership
dépendances: []
proximités:
  - Présentation
  - Négociation
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Chef de Projet
  - type: requise_par
    cible: Commercial
```

### Compétence : Leadership

```yaml
id: COMP-010
nom: Leadership
définition: Capacité à guider, motiver et inspirer une équipe vers l'atteinte des objectifs.
famille: Compétences comportementales
type: Comportementale
niveau: Avancé
synonymes:
  - Leadership skills
  - Management
compétences_liées:
  - Communication
  - Gestion d'équipe
dépendances:
  - Communication
proximités:
  - Management
  - Gestion d'équipe
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Chef de Projet
  - type: proche_de
    cible: Management
```

### Compétence : Vente

```yaml
id: COMP-011
nom: Vente
définition: Capacité à vendre des produits ou services aux clients.
famille: Compétences fonctionnelles
type: Fonctionnelle
niveau: Intermédiaire
synonymes:
  - Sales
  - Vente commerciale
compétences_liées:
  - Communication
  - Négociation
dépendances:
  - Communication
proximités:
  - Négociation
  - Relation client
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Commercial
  - type: proche_de
    cible: Négociation
```

### Compétence : Négociation

```yaml
id: COMP-012
nom: Négociation
définition: Capacité à négocier des accords et des contrats avec les parties prenantes.
famille: Compétences comportementales
type: Comportementale
niveau: Avancé
synonymes:
  - Negotiation skills
  - Négociation commerciale
compétences_liées:
  - Communication
  - Vente
dépendances:
  - Communication
proximités:
  - Vente
  - Relation client
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Commercial
  - type: proche_de
    cible: Vente
```

### Compétence : Comptabilité

```yaml
id: COMP-013
nom: Comptabilité
définition: Capacité à tenir les comptes d'une organisation et à établir les états financiers.
famille: Compétences fonctionnelles
type: Fonctionnelle
niveau: Avancé
synonymes:
  - Accounting
  - Comptabilité générale
compétences_liées:
  - Finance
  - Analyse financière
dépendances: []
proximités:
  - Finance
  - Audit
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Comptable
  - type: proche_de
    cible: Finance
```

### Compétence : Droit

```yaml
id: COMP-014
nom: Droit
définition: Capacité à comprendre et appliquer les principes juridiques et réglementaires.
famille: Compétences fonctionnelles
type: Fonctionnelle
niveau: Expert
synonymes:
  - Legal
  - Juridique
compétences_liées:
  - Connaissance réglementaire
  - Rédaction de contrats
dépendances: []
proximités:
  - Conformité
  - Réglementation
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Juriste
  - type: proche_de
    cible: Conformité
```

### Compétence : Marketing

```yaml
id: COMP-015
nom: Marketing
définition: Capacité à concevoir et mettre en œuvre des stratégies marketing.
famille: Compétences fonctionnelles
type: Fonctionnelle
niveau: Avancé
synonymes:
  - Marketing strategy
  - Marketing digital
compétences_liées:
  - Communication
  - Analyse de marché
dépendances:
  - Communication
proximités:
  - Communication
  - Vente
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Responsable Marketing
  - type: proche_de
    cible: Communication
```

### Compétence : Gestion des ressources humaines

```yaml
id: COMP-016
nom: Gestion des ressources humaines
définition: Capacité à gérer les aspects administratifs, relationnels et stratégiques des ressources humaines.
famille: Compétences fonctionnelles
type: Fonctionnelle
niveau: Avancé
synonymes:
  - HR Management
  - Gestion RH
compétences_liées:
  - Recrutement
  - Relation employeur
dépendances: []
proximités:
  - Recrutement
  - Administration
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Responsable RH
  - type: proche_de
    cible: Recrutement
```

### Compétence : Recrutement

```yaml
id: COMP-017
nom: Recrutement
définition: Capacité à identifier, attirer et sélectionner les candidats pour les postes vacants.
famille: Compétences fonctionnelles
type: Fonctionnelle
niveau: Intermédiaire
synonymes:
  - Recruitment
  - Talent acquisition
compétences_liées:
  - Gestion des ressources humaines
  - Communication
dépendances:
  - Communication
proximités:
  - Gestion des ressources humaines
  - Entretien
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Responsable RH
  - type: proche_de
    cible: Gestion des ressources humaines
```

### Compétence : Anglais

```yaml
id: COMP-018
nom: Anglais
définition: Capacité à comprendre et s'exprimer en anglais à l'oral et à l'écrit.
famille: Compétences linguistiques
type: Linguistique
niveau: Variable
synonymes:
  - English
  - English language
compétences_liées: []
dépendances: []
proximités:
  - Communication internationale
  - Langues étrangères
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: proche_de
    cible: Communication
```

### Compétence : CI/CD

```yaml
id: COMP-019
nom: CI/CD
définition: Capacité à mettre en œuvre des processus d'intégration continue et de déploiement continu.
famille: Compétences techniques
type: Technique
niveau: Avancé
synonymes:
  - Continuous Integration/Continuous Deployment
  - CI/CD pipeline
compétences_liées:
  - DevOps
  - Automatisation
dépendances:
  - Git
  - Scripting
proximités:
  - DevOps
  - Automation
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Ingénieur DevOps
  - type: proche_de
    cible: DevOps
```

### Compétence : Git

```yaml
id: COMP-020
nom: Git
définition: Capacité à utiliser Git pour le contrôle de version du code source.
famille: Compétences techniques
type: Technique
niveau: Intermédiaire
synonymes:
  - Version control
  - Git version control
compétences_liées:
  - Développement logiciel
dépendances: []
proximités:
  - GitHub
  - GitLab
transférable: true
émergente: false
obsolescence: Faible
maturité: Établie
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requise_par
    cible: Développeur Backend
  - type: requise_par
    cible: Développeur Frontend
```

## Statut

VERSION : v1.0

DATE DE CRÉATION : 2026-08-03

NOMBRE DE COMPÉTENCES : 20

OBJECTIF CIBLE : ≈ 5 000 COMPÉTENCES

STATUT : EN COURS (ÉCHANTILLON INITIAL)
