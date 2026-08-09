# DOC-029-03 : Catalogue des Erreurs Types (20 Erreurs Fondamentales Documentées)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le catalogue des 20 erreurs types fondamentales pour MVP-029 Institutional Memory Engine. Ce catalogue documente les erreurs institutionnelles récurrentes avec leur structure normée pour permettre l'apprentissage systématique et la prévention des erreurs futures.

---

## 2. Principe Fondateur

Les erreurs sont la source d'apprentissage la plus précieuse. Un grand cabinet documente ses erreurs, les analyse, les partage en interne, et s'assure de ne pas les répéter. Chaque erreur est documentée avec une structure normée (type, contexte, ce qui s'est passé, signal qui aurait dû alerter, leçon extraite, impact sur le moteur).

---

## 3. Structure d'une Erreur Documentée

**Type d'erreur :**
- Faux positif : Candidat recommandé qui a échoué
- Faux négatif : Candidat refusé qui aurait réussi
- Erreur de processus : Bonne décision, mauvais processus
- Erreur de signal : Signal mal interprété

**Contexte de l'erreur :**
- Secteur / Taille / Poste / Niveau

**Ce qui s'est passé :**
- Description factuelle et anonymisée
- Décision prise et pourquoi
- Ce qui a été manqué ou mal évalué

**Signal qui aurait dû alerter :**
- Ce qui était présent mais ignoré
- Ce qui était absent mais non détecté
- Ce que le moteur aurait dû dire

**Leçon extraite :**
- Règle créée ou modifiée
- Signal ajouté à la bibliothèque
- Processus ajusté

**Impact sur le moteur :**
- Quelle règle a été modifiée ?
- Quel signal a été ajouté ?
- Quel pattern a été créé ?

---

## 4. Catalogue des 20 Erreurs Types

### Erreur Type 1 — Le Candidat Brillant en Entretien

**Type :** Faux positif

**Contexte :**
- Tous secteurs / Toutes tailles / Tous postes

**Ce qui s'est passé :**
- Candidat très performant en entretien
- Résultats réels décevants
- Performance en entretien ≠ performance en poste

**Signal qui aurait dû alerter :**
- Sur-préparation détectable (réponses trop parfaites)
- Manque d'exemples concrets
- Discours trop théorique

**Leçon extraite :**
- La performance en entretien ne prédit pas la performance en poste
- Renforcer les questions comportementales
- Demander des exemples concrets

**Impact sur le moteur :**
- Signal ajouté : Sur-préparation détectable
- Règle modifiée : Poids de l'entretien réduit dans le score global

---

### Erreur Type 2 — Le CV Parfait, le Fit Inexistant

**Type :** Faux positif

**Contexte :**
- Grands groupes / Postes senior / Niveau VP+

**Ce qui s'est passé :**
- CV qui coche toutes les cases
- Culture fit raté
- Les critères formels ne prédisent pas l'intégration culturelle

**Signal qui aurait dû alerter :**
- Manque de questions sur la culture
- Réponses génériques sur les valeurs
- Incohérence entre valeurs exprimées et comportement

**Leçon extraite :**
- Les critères formels ne prédisent pas l'intégration culturelle
- Renforcer l'évaluation culturelle
- Inclure des tests de fit culturel

**Impact sur le moteur :**
- Signal ajouté : Questions culture fit renforcées
- Règle créée : Évaluation culturelle obligatoire pour les postes senior

---

### Erreur Type 3 — Le Profil Atypique Rejeté

**Type :** Faux négatif

**Contexte :**
- Startups / Scale-ups / Postes innovation

**Ce qui s'est passé :**
- Profil hors standards refusé
- Recruté par un concurrent
- Succès remarquable chez le concurrent
- Les standards excluent parfois les meilleurs profils

**Signal qui aurait dû alerter :**
- Profil atypique avec réalisations exceptionnelles
- Signal candidat exceptionnel détecté
- Potentiel élevé selon Predictive Success

**Leçon extraite :**
- Les standards excluent parfois les meilleurs profils
- Détection des profils atypiques à fort potentiel
- Exception à considérer pour les profils atypiques

**Impact sur le moteur :**
- Signal ajouté : Détection des profils atypiques à fort potentiel
- Règle modifiée : Exception automatique pour les profils atypiques avec signal exceptionnel

---

### Erreur Type 4 — L'Urgence qui Fait Baisser les Standards

**Type :** Erreur de processus

**Contexte :**
- Tous secteurs / Postes critiques / Urgence opérationnelle

**Ce qui s'est passé :**
- Poste à pourvoir d'urgence
- Standards abaissés
- Recrutement raté
- L'urgence ne justifie pas d'abaisser les standards fondamentaux

**Signal qui aurait dû alerter :**
- Urgence opérationnelle détectée
- Standards abaissés par rapport à la norme
- Risque business identifié

**Leçon extraite :**
- L'urgence ne justifie pas d'abaisser les standards fondamentaux
- Maintien des critères essentiels même en urgence
- Plan de contingence pour les recrutements urgents

**Impact sur le moteur :**
- Signal ajouté : Alerte si urgence détectée + recommandation de maintien des critères essentiels
- Règle créée : Validation obligatoire si standards abaissés

---

### Erreur Type 5 — Le Sur-qualifié qui Part Rapidement

**Type :** Faux positif

**Contexte :**
- Startups / Scale-ups / Postes junior/mid

**Ce qui s'est passé :**
- Candidat sur-qualifié recruté
- Part rapidement (moins de 6 mois)
- Boredom / manque de challenge
- Sur-qualification peut prédire un turnover rapide

**Signal qui aurait dû alerter :**
- Sur-qualification détectée
- Écart significatif entre profil et poste
- Historique de turnover rapide

**Leçon extraite :**
- La sur-qualification peut prédire un turnover rapide
- Évaluer la motivation au-delà du fit technique
- Considérer le risque de turnover

**Impact sur le moteur :**
- Signal ajouté : Sur-qualification détectée
- Règle créée : Alerte turnover si sur-qualification détectée

---

### Erreur Type 6 — Le Profil "Safe" sans Innovation

**Type :** Faux positif

**Contexte :**
- Startups / Postes innovation / R&D

**Ce qui s'est passé :**
- Candidat "safe" recruté
- Manque d'innovation
- Performance moyenne
- Les profils "safe" ne sont pas adaptés aux postes d'innovation

**Signal qui aurait dû alerter :**
- Profil conservateur détecté
- Manque de preuves d'innovation
- Réponses trop prudentes

**Leçon extraite :**
- Les profils "safe" ne sont pas adaptés aux postes d'innovation
- Évaluer la capacité d'innovation
- Chercher des preuves de prise de risque calculé

**Impact sur le moteur :**
- Signal ajouté : Profil conservateur détecté
- Règle créée : Évaluation innovation obligatoire pour les postes R&D

---

### Erreur Type 7 — Le Candidat avec Références Impressionnantes mais Performance Faible

**Type :** Faux positif

**Contexte :**
- Grands groupes / Postes senior / Niveau VP+

**Ce qui s'est passé :**
- Références impressionnantes
- Performance réelle faible
- Les références ne prédisent pas toujours la performance
- Références biaisées (amis, réseau)

**Signal qui aurait dû alerter :**
- Références uniquement du réseau proche
- Manque de diversité des références
- Incohérence entre références et réalisations

**Leçon extraite :**
- Les références ne prédisent pas toujours la performance
- Vérifier la diversité des références
- Corréler les références avec les réalisations

**Impact sur le moteur :**
- Signal ajouté : Références biaisées détectées
- Règle modifiée : Poids des références réduit si biais détecté

---

### Erreur Type 8 — Le Candidat avec Compétences Techniques Fortes mais Soft Skills Faibles

**Type :** Faux positif

**Contexte :**
- Tous secteurs / Postes avec interaction client / Management

**Ce qui s'est passé :**
- Compétences techniques excellentes
- Soft skills faibles
- Échec relationnel
- Les compétences techniques ne suffisent pas pour les postes relationnels

**Signal qui aurait dû alerter :**
- Score soft skills faible
- Manque d'exemples de collaboration
- Réponses centrées uniquement sur l'aspect technique

**Leçon extraite :**
- Les compétences techniques ne suffisent pas pour les postes relationnels
- Évaluer les soft skills systématiquement
- Poids équilibré entre hard et soft skills

**Impact sur le moteur :**
- Signal ajouté : Soft skills faibles détectées
- Règle créée : Évaluation soft skills obligatoire pour les postes relationnels

---

### Erreur Type 9 — Le Candidat qui S'adapte Mal au Changement

**Type :** Faux positif

**Contexte :**
- Startups / Scale-ups / Environnement en évolution rapide

**Ce qui s'est passé :**
- Candidat performant dans environnement stable
- Échec dans environnement en évolution
- Manque d'adaptabilité
- L'adaptabilité est critique dans les environnements dynamiques

**Signal qui aurait dû alerter :**
- Manque de preuves d'adaptabilité
- Expérience uniquement en environnement stable
- Réticence au changement exprimée

**Leçon extraite :**
- L'adaptabilité est critique dans les environnements dynamiques
- Évaluer l'adaptabilité systématiquement
- Chercher des preuves de gestion du changement

**Impact sur le moteur :**
- Signal ajouté : Manque d'adaptabilité détecté
- Règle créée : Évaluation adaptabilité obligatoire pour les environnements dynamiques

---

### Erreur Type 10 — Le Candidat avec Potentiel Élevé mais Manque d'Expérience Rejeté

**Type :** Faux négatif

**Contexte :**
- Startups / Postes junior / Innovation

**Ce qui s'est passé :**
- Candidat avec potentiel élevé
- Manque d'expérience
- Rejeté
- Succès ailleurs
- Le potentiel peut compenser le manque d'expérience

**Signal qui aurait dû alerter :**
- Potentiel élevé selon Predictive Success
- Réalisations exceptionnelles pour le niveau d'expérience
- Signal candidat exceptionnel

**Leçon extraite :**
- Le potentiel peut compenser le manque d'expérience
- Évaluer le potentiel systématiquement
- Considérer des exceptions pour les profils à fort potentiel

**Impact sur le moteur :**
- Signal ajouté : Potentiel élevé détecté
- Règle modifiée : Exception possible pour les profils à fort potentiel

---

### Erreur Type 11 — Le Candidat qui Sur-estime ses Compétences

**Type :** Faux positif

**Contexte :**
- Tous secteurs / Tous postes

**Ce qui s'est passé :**
- Candidat confiant
- Compétences réelles inférieures aux déclarations
- Échec
- La confiance ne prédit pas la compétence

**Signal qui aurait dû alerter :**
- Déclarations non étayées par des exemples
- Incohérence entre déclarations et CV
- Sur-confiance détectée

**Leçon extraite :**
- La confiance ne prédit pas la compétence
- Demander des preuves pour chaque déclaration
- Évaluer la calibration du candidat

**Impact sur le moteur :**
- Signal ajouté : Sur-confiance détectée
- Règle créée : Demande de preuves obligatoire pour les déclarations

---

### Erreur Type 12 — Le Candidat qui Sous-estime ses Compétences

**Type :** Faux négatif

**Contexte :**
- Tous secteurs / Tous postes

**Ce qui s'est passé :**
- Candidat modeste
- Compétences réelles supérieures aux déclarations
- Rejeté
- Succès ailleurs
- La modestie peut masquer des compétences

**Signal qui aurait dû alerter :**
- Réalisations supérieures aux déclarations
- Recommandations exceptionnelles
- Incohérence entre modestie et réalisations

**Leçon extraite :**
- La modestie peut masquer des compétences
- Évaluer les réalisations plutôt que les déclarations
- Considérer les recommandations

**Impact sur le moteur :**
- Signal ajouté : Modestie excessive détectée
- Règle modifiée : Poids des réalisations augmenté par rapport aux déclarations

---

### Erreur Type 13 — Le Candidat qui Change d'Opinion Pendant le Processus

**Type :** Erreur de signal

**Contexte :**
- Tous secteurs / Tous postes

**Ce qui s'est passé :**
- Candidat change d'opinion pendant le processus
- Incohérence détectée
- Signal mal interprété comme "flexibilité"
- Échec
- L'incohérence peut prédire un manque de fiabilité

**Signal qui aurait dû alerter :**
- Changements d'opinion détectés
- Incohérences dans les réponses
- Manque de constance

**Leçon extraite :**
- L'incohérence peut prédire un manque de fiabilité
- Évaluer la constance de l'opinion
- Alerte si incohérence détectée

**Impact sur le moteur :**
- Signal ajouté : Incohérence détectée
- Règle créée : Alerte si changement d'opinion détecté

---

### Erreur Type 14 — Le Candidat qui Pose Trop de Questions sur les Avantages

**Type :** Faux positif

**Contexte :**
- Grands groupes / Postes senior

**Ce qui s'est passé :**
- Candidat pose trop de questions sur les avantages
- Motivation centrée sur les avantages
- Performance faible
- La motivation centrée sur les avantages prédit une performance faible

**Signal qui aurait dû alerter :**
- Questions disproportionnées sur les avantages
- Manque de questions sur le rôle
- Priorité aux avantages sur la mission

**Leçon extraite :**
- La motivation centrée sur les avantages prédit une performance faible
- Évaluer la motivation
- Alerte si questions avantages disproportionnées

**Impact sur le moteur :**
- Signal ajouté : Motivation avantages détectée
- Règle créée : Évaluation motivation obligatoire

---

### Erreur Type 15 — Le Candidat qui Ne Pose Aucune Question

**Type :** Faux positif

**Contexte :**
- Tous secteurs / Tous postes

**Ce qui s'est passé :**
- Candidat ne pose aucune question
- Manque d'intérêt ou de curiosité
- Performance faible
- Le manque de questions peut prédire un manque d'intérêt

**Signal qui aurait dû alerter :**
- Aucune question posée
- Passivité détectée
- Manque de curiosité

**Leçon extraite :**
- Le manque de questions peut prédire un manque d'intérêt
- Évaluer la curiosité
- Alerte si aucune question posée

**Impact sur le moteur :**
- Signal ajouté : Passivité détectée
- Règle créée : Évaluation curiosité obligatoire

---

### Erreur Type 16 — Le Candidat qui Critique ses Anciens Employeurs

**Type :** Faux positif

**Contexte :**
- Tous secteurs / Tous postes

**Ce qui s'est passé :**
- Candidat critique ses anciens employeurs
- Attitude négative
- Échec d'intégration
- La critique des anciens employeurs prédit des problèmes d'intégration

**Signal qui aurait dû alerter :**
- Critiques des anciens employeurs
- Attitude négative
- Manque de responsabilité personnelle

**Leçon extraite :**
- La critique des anciens employeurs prédit des problèmes d'intégration
- Évaluer l'attitude
- Alerte si critiques détectées

**Impact sur le moteur :**
- Signal ajouté : Critiques anciens employeurs détectées
- Règle créée : Évaluation attitude obligatoire

---

### Erreur Type 17 — Le Candidat qui Ne Connaît pas l'Entreprise

**Type :** Faux positif

**Contexte :**
- Tous secteurs / Tous postes

**Ce qui s'est passé :**
- Candidat ne connaît pas l'entreprise
- Manque de préparation
- Performance faible
- Le manque de préparation prédit un manque d'engagement

**Signal qui aurait dû alerter :**
- Manque de connaissances sur l'entreprise
- Questions basiques sur l'entreprise
- Manque de préparation

**Leçon extraite :**
- Le manque de préparation prédit un manque d'engagement
- Évaluer la préparation
- Alerte si manque de connaissances détecté

**Impact sur le moteur :**
- Signal ajouté : Manque de préparation détecté
- Règle créée : Évaluation préparation obligatoire

---

### Erreur Type 18 — Le Candidat qui Demande un Salaire Hors Marché

**Type :** Faux positif

**Contexte :**
- Startups / Scale-ups

**Ce qui s'est passé :**
- Candidat demande un salaire hors marché
- Attentes irréalistes
- Échec de négociation
- Les attentes salariales irréalistes prédent un échec de négociation

**Signal qui aurait dû alerter :**
- Demande salaire hors marché
- Attentes irréalistes
- Incohérence avec le marché

**Leçon extraite :**
- Les attentes salariales irréalistes prédent un échec de négociation
- Évaluer les attentes salariales
- Alerte si demande hors marché détectée

**Impact sur le moteur :**
- Signal ajouté : Attentes salariales irréalistes détectées
- Règle créée : Évaluation attentes salariales obligatoire

---

### Erreur Type 19 — Le Candidat qui Ne Peut pas Travailler en Équipe

**Type :** Faux positif

**Contexte :**
- Tous secteurs / Postes collaboratifs

**Ce qui s'est passé :**
- Candidat ne peut pas travailler en équipe
- Conflits d'équipe
- Échec
- La capacité à travailler en équipe est essentielle pour les postes collaboratifs

**Signal qui aurait dû alerter :**
- Manque d'exemples de collaboration
- Réponses centrées sur le travail individuel
- Signaux d'individualisme

**Leçon extraite :**
- La capacité à travailler en équipe est essentielle pour les postes collaboratifs
- Évaluer la capacité de collaboration
- Alerte si signaux individualisme détectés

**Impact sur le moteur :**
- Signal ajouté : Individualisme détecté
- Règle créée : Évaluation collaboration obligatoire pour les postes collaboratifs

---

### Erreur Type 20 — Le Candidat qui Ne Peut pas Gérer la Pression

**Type :** Faux positif

**Contexte :**
- Startups / Scale-ups / Postes à haute pression

**Ce qui s'est passé :**
- Candidat ne peut pas gérer la pression
- Burnout
- Échec
- La capacité à gérer la pression est essentielle pour les postes à haute pression

**Signal qui aurait dû alerter :**
- Manque d'exemples de gestion de pression
- Réactions de stress détectées
- Signaux d'intolérance à la pression

**Leçon extraite :**
- La capacité à gérer la pression est essentielle pour les postes à haute pression
- Évaluer la capacité à gérer la pression
- Alerte si signaux d'intolérance détectés

**Impact sur le moteur :**
- Signal ajouté : Intolérance à la pression détectée
- Règle créée : Évaluation gestion pression obligatoire pour les postes à haute pression

---

## 5. Structure de Données (TypeScript)

```typescript
interface InstitutionalError {
  errorId: string;
  
  errorType: 'false_positive' | 'false_negative' | 'process_error' | 'signal_error';
  
  context: {
    sector: string;
    companySize: string;
    jobType: string;
    hierarchyLevel: string;
  };
  
  whatHappened: {
    description: string;
    decision: string;
    missedOrMisEvaluated: string;
  };
  
  alertingSignal: {
    presentButIgnored: string;
    absentButUndetected: string;
    engineShouldHaveSaid: string;
  };
  
  lessonExtracted: {
    ruleCreatedOrModified: string;
    signalAdded: string;
    processAdjusted: string;
  };
  
  engineImpact: {
    ruleModified: string;
    signalAdded: string;
    patternCreated: string;
  };
  
  metadata: {
    createdAt: Date;
    createdBy: string;
    version: string;
    status: 'draft' | 'active' | 'deprecated';
    tags: string[];
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE institutional_error (
  id VARCHAR(36) PRIMARY KEY,
  
  error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('false_positive', 'false_negative', 'process_error', 'signal_error')),
  context JSON NOT NULL,
  what_happened JSON NOT NULL,
  alerting_signal JSON NOT NULL,
  lesson_extracted JSON NOT NULL,
  engine_impact JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_institutional_error_type ON institutional_error(error_type);
CREATE INDEX idx_institutional_error_context ON institutional_error((context->>'sector'));
CREATE INDEX idx_institutional_error_status ON institutional_error((metadata->>'status'));
```

---

## 7. API Endpoints

```typescript
// POST /api/institutional-memory/errors
async function createInstitutionalError(error: Omit<InstitutionalError, 'errorId' | 'metadata'>): Promise<InstitutionalError> {
  return await createInstitutionalError(error);
}

// GET /api/institutional-memory/errors/:errorId
async function getInstitutionalError(errorId: string): Promise<InstitutionalError> {
  return await getInstitutionalErrorById(errorId);
}

// GET /api/institutional-memory/errors
async function listInstitutionalErrors(filters: ErrorFilters): Promise<InstitutionalError[]> {
  return await listInstitutionalErrors(filters);
}

// GET /api/institutional-memory/errors/type/:errorType
async function getErrorsByType(errorType: string): Promise<InstitutionalError[]> {
  return await getErrorsByType(errorType);
}

// PUT /api/institutional-memory/errors/:errorId
async function updateInstitutionalError(errorId: string, error: Partial<InstitutionalError>): Promise<InstitutionalError> {
  return await updateInstitutionalError(errorId, error);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de documentation | Erreurs documentées / total | ≥ 90% |
- Taux de résolution | Erreurs résolues / documentées | ≥ 80% |
- Réduction des récidives | Réduction des erreurs récurrentes | ≥ 30% |
- Satisfaction recruteurs | Satisfaction avec le catalogue | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Réduction des faux positifs | Réduction des faux positifs | ≥ 25% |
- Réduction des faux négatifs | Réduction des faux négatifs | ≥ 25% |
- Amélioration des décisions | Amélioration de la qualité des décisions | ≥ 20% |

---

## 9. Conclusion

Le catalogue des 20 erreurs types fondamentales documente les erreurs institutionnelles récurrentes avec une structure normée pour permettre l'apprentissage systématique et la prévention des erreurs futures. Chaque erreur est documentée avec son type, contexte, ce qui s'est passé, signal qui aurait dû alerter, leçon extraite, et impact sur le moteur. Le catalogue permet de construire une mémoire institutionnelle des erreurs et d'éviter de les répéter.

**Points clés :**
- 20 erreurs types documentées
- Structure normée pour chaque erreur
- 4 types d'erreurs (faux positif, faux négatif, processus, signal)
- Signaux d'alerte identifiés
- Leçons extraites pour chaque erreur
- Impact sur le moteur documenté
- Intégration avec les modules existants
- Réduction des récidives
