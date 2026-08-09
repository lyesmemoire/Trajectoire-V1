# KP-001 — Référentiel des métiers

## Identité

KP-001 EST LE RÉFÉRENTIEL DES MÉTIERS DU KNOWLEDGE PACK RH V1.

KP-001 EST CONFORME À RFC-RH-001 HUMAN RESOURCES KNOWLEDGE MODEL.

KP-001 EST CONFORME À RFC-RH-003 JOB ONTOLOGY.

KP-001 EST VERSIONNÉ.

KP-001 EST TRAÇABLE.

KP-001 EST EXTENSIBLE.

## Objectif

DÉFINIR UN RÉFÉRENTIEL DE MÉTIERS UTILISABLE PAR LE MOTEUR COGNITIF POUR COMPRENDRE LES PROFILS PROFESSIONNELS.

## Structure des données

CHAQUE MÉTIER EST DÉFINI PAR LES ATTRIBUTS SUIVANTS :

- id : IDENTIFIANT STABLE
- nom : INTITULÉ DU MÉTIER
- définition : DÉFINITION NORMATIVE
- famille : FAMILLE DE MÉTIERS
- domaine : DOMAINE D'ACTIVITÉ
- synonymes : LISTE DES SYNONYMES
- intitulés_usuels : LISTE DES INTITULÉS USUELS
- intitulés_internationaux : LISTE DES INTITULÉS INTERNATIONAUX
- spécialisations : LISTE DES SPÉCIALISATIONS
- variantes : LISTE DES VARIANTES
- compétences_requises : LISTE DES COMPÉTENCES REQUISES
- niveau_entré : NIVEAU D'ENTRÉE
- maturité : NIVEAU DE MATURITÉ
- provenance : SOURCE DE LA DONNÉE
- date_création : DATE DE CRÉATION
- date_mise_à_jour : DATE DE MISE À JOUR
- statut_validation : STATUT DE VALIDATION
- relations : RELATIONS EXPLICITES AVEC D'AUTRES ÉLÉMENTS

## Familles de métiers

### Famille : Informatique

MÉTIERS LIÉS À L'INFORMATIQUE ET AUX TECHNOLOGIES DE L'INFORMATION.

### Famille : Ingénierie

MÉTIERS LIÉS À L'INGÉNIERIE ET AUX SCIENCES DE L'INGÉNIEUR.

### Famille : Finance

MÉTIERS LIÉS À LA FINANCE ET À LA COMPTABILITÉ.

### Famille : Marketing

MÉTIERS LIÉS AU MARKETING ET À LA COMMUNICATION.

### Famille : Ressources Humaines

MÉTIERS LIÉS AUX RESSOURCES HUMAINES.

### Famille : Ventes

MÉTIERS LIÉS AUX VENTES ET AU COMMERCE.

### Famille : Juridique

MÉTIERS LIÉS AU DROIT ET À LA CONFORMITÉ.

### Famille : Opérations

MÉTIERS LIÉS AUX OPÉRATIONS ET À LA LOGISTIQUE.

## Échantillon de métiers

### Métier : Développeur Backend

```yaml
id: MET-001
nom: Développeur Backend
définition: Professionnel qui conçoit et développe la partie serveur des applications web et logicielles.
famille: Informatique
domaine: Développement logiciel
synonymes:
  - Backend Engineer
  - Software Engineer Backend
  - Ingénieur Backend
  - Développeur Serveur
intitulés_usuels:
  - Développeur Backend
  - Backend Developer
intitulés_internationaux:
  - Backend Engineer
  - Backend Developer
spécialisations:
  - Java Backend
  - Python Backend
  - Node.js Backend
  - .NET Backend
variantes:
  - Développeur Full Stack
  - Développeur API
compétences_requises:
  - Programmation orientée objet
  - Conception d'API REST
  - Gestion de base de données
  - Tests unitaires
  - Git
niveau_entré: Junior
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Programmation orientée objet
  - type: appartient_à
    cible: Informatique
```

### Métier : Développeur Frontend

```yaml
id: MET-002
nom: Développeur Frontend
définition: Professionnel qui conçoit et développe l'interface utilisateur des applications web et mobiles.
famille: Informatique
domaine: Développement logiciel
synonymes:
  - Frontend Engineer
  - Software Engineer Frontend
  - Ingénieur Frontend
  - Développeur Interface
intitulés_usuels:
  - Développeur Frontend
  - Frontend Developer
intitulés_internationaux:
  - Frontend Engineer
  - Frontend Developer
spécialisations:
  - React Developer
  - Angular Developer
  - Vue.js Developer
  - Mobile Developer
variantes:
  - Développeur Full Stack
  - Développeur UI/UX
compétences_requises:
  - HTML/CSS
  - JavaScript
  - Frameworks frontend (React, Angular, Vue.js)
  - Responsive design
  - Tests E2E
niveau_entré: Junior
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: HTML/CSS
  - type: appartient_à
    cible: Informatique
```

### Métier : Data Scientist

```yaml
id: MET-003
nom: Data Scientist
définition: Professionnel qui analyse et interprète des données complexes pour aider à la prise de décision.
famille: Informatique
domaine: Data Science
synonymes:
  - Scientifique des données
  - Analyste de données avancé
intitulés_usuels:
  - Data Scientist
  - Data Science Engineer
intitulés_internationaux:
  - Data Scientist
spécialisations:
  - Machine Learning Engineer
  - Deep Learning Engineer
  - NLP Specialist
  - Computer Vision Engineer
variantes:
  - Data Analyst
  - Data Engineer
compétences_requises:
  - Python
  - Machine Learning
  - Statistiques
  - SQL
  - Visualisation de données
niveau_entré: Confirmé
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Machine Learning
  - type: appartient_à
    cible: Informatique
```

### Métier : Ingénieur DevOps

```yaml
id: MET-004
nom: Ingénieur DevOps
définition: Professionnel qui optimise les processus de développement et de déploiement des applications.
famille: Informatique
domaine: Opérations informatiques
synonymes:
  - DevOps Engineer
  - Ingénieur des opérations de développement
intitulés_usuels:
  - Ingénieur DevOps
  - DevOps Engineer
intitulés_internationaux:
  - DevOps Engineer
spécialisations:
  - Cloud Engineer
  - SRE (Site Reliability Engineer)
  - Platform Engineer
variantes:
  - SysAdmin
  - Cloud Architect
compétences_requises:
  - CI/CD
  - Docker
  - Kubernetes
  - Scripting (Bash, Python)
  - Monitoring
niveau_entré: Confirmé
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Docker
  - type: appartient_à
    cible: Informatique
```

### Métier : Chef de Projet

```yaml
id: MET-005
nom: Chef de Projet
définition: Professionnel qui planifie, organise et pilote des projets pour atteindre les objectifs définis.
famille: Management
domaine: Gestion de projet
synonymes:
  - Project Manager
  - Chef de projet
  - Gestionnaire de projet
intitulés_usuels:
  - Chef de Projet
  - Project Manager
intitulés_internationaux:
  - Project Manager
spécialisations:
  - IT Project Manager
  - Marketing Project Manager
  - Construction Project Manager
variantes:
  - Scrum Master
  - Product Owner
compétences_requises:
  - Gestion de projet
  - Planification
  - Communication
  - Gestion des risques
  - Leadership
niveau_entré: Confirmé
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Gestion de projet
  - type: appartient_à
    cible: Management
```

### Métier : Responsable RH

```yaml
id: MET-006
nom: Responsable RH
définition: Professionnel qui gère les ressources humaines d'une organisation ou d'un département.
famille: Ressources Humaines
domaine: Gestion des ressources humaines
synonymes:
  - HR Manager
  - Responsable des ressources humaines
  - Chef RH
intitulés_usuels:
  - Responsable RH
  - HR Manager
intitulés_internationaux:
  - HR Manager
spécialisations:
  - HR Business Partner
  - Talent Acquisition Manager
  - HR Generalist
variantes:
  - Directeur RH
  - Chargé de recrutement
compétences_requises:
  - Gestion des ressources humaines
  - Recrutement
  - Gestion administrative
  - Relation employeur
  - Connaissance du droit du travail
niveau_entré: Confirmé
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Gestion des ressources humaines
  - type: appartient_à
    cible: Ressources Humaines
```

### Métier : Commercial

```yaml
id: MET-007
nom: Commercial
définition: Professionnel qui vend des produits ou services aux clients.
famille: Ventes
domaine: Vente
synonymes:
  - Sales Representative
  - Représentant commercial
  - Vendeur
intitulés_usuels:
  - Commercial
  - Sales Representative
intitulés_internationaux:
  - Sales Representative
spécialisations:
  - Technical Sales
  - Field Sales
  - Inside Sales
variantes:
  - Account Manager
  - Business Developer
compétences_requises:
  - Vente
  - Communication
  - Négociation
  - Relation client
  - Connaissance des produits
niveau_entré: Junior
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Vente
  - type: appartient_à
    cible: Ventes
```

### Métier : Comptable

```yaml
id: MET-008
nom: Comptable
définition: Professionnel qui tient les comptes d'une organisation et établit les états financiers.
famille: Finance
domaine: Comptabilité
synonymes:
  - Accountant
  - Comptable général
intitulés_usuels:
  - Comptable
  - Accountant
intitulés_internationaux:
  - Accountant
spécialisations:
  - Comptable général
  - Comptable fournisseur
  - Comptable client
variantes:
  - Expert-comptable
  - Auditeur
compétences_requises:
  - Comptabilité
  - Logiciels comptables
  - Réglementation comptable
  - Analyse financière
  - Excel
niveau_entré: Junior
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Comptabilité
  - type: appartient_à
    cible: Finance
```

### Métier : Juriste

```yaml
id: MET-009
nom: Juriste
définition: Professionnel qui conseille sur les questions juridiques et assure la conformité réglementaire.
famille: Juridique
domaine: Droit
synonymes:
  - Legal Counsel
  - Conseiller juridique
intitulés_usuels:
  - Juriste
  - Legal Counsel
intitulés_internationaux:
  - Legal Counsel
spécialisations:
  - Juriste d'entreprise
  - Juriste en droit du travail
  - Juriste en droit des affaires
variantes:
  - Avocat
  - Notaire
compétences_requises:
  - Droit
  - Rédaction de contrats
  - Connaissance réglementaire
  - Analyse juridique
  - Communication
niveau_entré: Confirmé
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Droit
  - type: appartient_à
    cible: Juridique
```

### Métier : Responsable Marketing

```yaml
id: MET-010
nom: Responsable Marketing
définition: Professionnel qui conçoit et met en œuvre les stratégies marketing d'une organisation.
famille: Marketing
domaine: Marketing
synonymes:
  - Marketing Manager
  - Responsable du marketing
intitulés_usuels:
  - Responsable Marketing
  - Marketing Manager
intitulés_internationaux:
  - Marketing Manager
spécialisations:
  - Digital Marketing Manager
  - Product Marketing Manager
  - Brand Manager
variantes:
  - Directeur Marketing
  - Chef de produit
compétences_requises:
  - Marketing
  - Stratégie marketing
  - Communication
  - Analyse de marché
  - Gestion de budget
niveau_entré: Confirmé
maturité: Établi
provenance: Interne
date_création: 2026-08-03
date_mise_à_jour: 2026-08-03
statut_validation: Validé
relations:
  - type: requiert_compétence
    cible: Marketing
  - type: appartient_à
    cible: Marketing
```

## Statut

VERSION : v1.0

DATE DE CRÉATION : 2026-08-03

NOMBRE DE MÉTIERS : 10

OBJECTIF CIBLE : ≈ 2 000 MÉTIERS

STATUT : EN COURS (ÉCHANTILLON INITIAL)
