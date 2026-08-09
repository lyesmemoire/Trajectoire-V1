# DOC-007-01 : Spécification du Moteur de Raisonnement

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Transformer le moteur cognitif RH d'un système qui score en un système qui raisonne.

**Constat actuel :**
- INPUT : CV + Fiche de poste
- OUTPUT : Score = 82%

**Cible MVP-007 :**
- INPUT : CV + Fiche de poste + Contexte équipe + Historique + Contraintes métier
- OUTPUT : Raisonnement argumenté + Décision motivée + Niveau de confiance + Risques identifiés + Conditions de la recommandation + Points à clarifier en entretien

---

## 2. Principe Fondateur

- Un score seul est inerte.
- Un score argumenté est actionnable.
- Un raisonnement tracé est auditable.
- Un raisonnement auditable est vendable à un DRH.

---

## 3. Architecture du Raisonnement

Le moteur raisonne en 4 couches successives et obligatoires.

### 3.1 Couche 1 — Collecte des Faits

**Objectif :** Établir les faits bruts sans interprétation.

**Faits candidat :**
- Compétences explicitement déclarées
- Compétences implicitement déductibles
- Expériences et durées
- Certifications et diplômes vérifiables
- Secteurs d'activité traversés
- Indicateurs de progression de carrière
- Signaux d'apprentissage rapide (si détectables)

**Faits poste :**
- Compétences requises : critiques / souhaitées / optionnelles
- Expérience minimale requise
- Contexte de l'équipe (si fourni)
- Contraintes organisationnelles (si fournies)
- Compétences déjà couvertes dans l'équipe

**Règle absolue :** Aucune interprétation, aucune pondération. Uniquement des faits traçables et sourcés.

**Service implémenté :** `FactCollectorService`

---

### 3.2 Couche 2 — Analyse des Écarts

**Objectif :** Identifier et qualifier chaque écart.

**4 cas d'analyse :**

**CAS 1 — Correspondance directe**
- Candidat possède exactement la compétence
- Niveau de maîtrise évalué
- Durée de pratique évaluée

**CAS 2 — Correspondance partielle**
- Candidat possède une compétence proche
- Degré de proximité mesuré (base commune / logique partagée / transfert estimé)
- Délai d'acquisition estimé

**CAS 3 — Compétence transférable**
- Candidat ne possède pas la compétence mais possède des compétences qui permettent de l'acquérir rapidement
- Chaîne de transfert identifiée
- Solidité du transfert évaluée
- Délai d'acquisition estimé
- Capacité de l'équipe à accompagner identifiée

**CAS 4 — Écart réel non compensable**
- Candidat ne possède pas la compétence
- Aucun transfert crédible identifié
- Niveau de criticité qualifié (bloquant / significatif / mineur)
- Impact opérationnel réel évalué
- Compensation possible proposée (formation / accompagnement / ajustement poste)

**Service implémenté :** `GapAnalyzerService`

---

### 3.3 Couche 3 — Contextualisation

**Objectif :** Replacer l'analyse dans le contexte réel.

**Questions que le moteur doit se poser et répondre explicitement :**

1. Quelle est la criticité réelle de chaque compétence manquante dans CE contexte ? (pas en général : dans CE poste, CETTE équipe)
2. L'équipe peut-elle absorber les manques pendant la montée en compétence ?
3. Le délai d'acquisition est-il compatible avec les besoins opérationnels ?
4. Le profil de progression du candidat suggère-t-il une capacité d'adaptation ?
5. Y a-t-il des signaux positifs non quantifiés qui compensent des manques quantifiés ? (leadership, initiative, résolution de problèmes)
6. Y a-t-il des signaux de vigilance non bloquants mais à vérifier en entretien ?

**Service implémenté :** `ContextAnalyzerService`

---

### 3.4 Couche 4 — Décision Argumentée

**Objectif :** Produire une recommandation claire, motivée, nuancée et actionnelle.

**Structure obligatoire de la sortie :**

**RECOMMANDATION PRINCIPALE**
- Formulation claire et sans ambiguïté : "Je recommande / Je ne recommande pas / Je recommande sous conditions"

**JUSTIFICATION**
- Liste ordonnée des arguments principaux
- Chaque argument est sourcé (quelle donnée du CV ou du poste justifie cet argument)

**POINTS FORTS DU CANDIDAT**
- Ce qui le rend pertinent pour ce poste spécifiquement (pas de manière générale)

**POINTS DE VIGILANCE**
- Ce qui n'est pas bloquant mais mérite attention ou vérification

**ÉCARTS RÉSIDUELS**
- Ce qui manque vraiment
- Niveau de criticité de chaque écart
- Plan de compensation proposé

**NIVEAU DE CONFIANCE**
- Élevé : données suffisantes, raisonnement solide
- Moyen : données partielles, hypothèses posées
- Faible : données insuffisantes, clarifications requises

**HYPOTHÈSES POSÉES**
- Liste explicite de ce que le moteur a supposé faute d'information
- Transparence totale sur les zones d'incertitude

**QUESTIONS POUR L'ENTRETIEN**
- Liste des points que l'entretien doit clarifier
- Pour chaque question : pourquoi elle est importante

**CAPACITÉ À DOUTER — RÈGLE ABSOLUE**
- Si les données sont insuffisantes, le moteur NE PRODUIT PAS de recommandation forcée
- Il produit : "Je ne peux pas recommander sur ce profil avec les données disponibles. Ce qui me manque pour décider : [liste précise]. Ce que je recommande avant de décider : [actions concrètes]"
- Le doute structuré est une marque d'expertise

**Service implémenté :** `DecisionBuilderService`

---

## 4. Services Implémentés

### 4.1 FactCollectorService
- Collecte les faits bruts du candidat et du poste
- Déduit les compétences implicites
- Analyse la progression de carrière
- Détecte les signaux d'apprentissage rapide

### 4.2 GapAnalyzerService
- Analyse chaque compétence requise
- Identifie le type d'écart (direct, partiel, transférable, non compensable)
- Qualifie la criticité de chaque écart
- Propose des compensations

### 4.3 TransferPatternsService
- Bibliothèque de 100+ patterns de transfert de compétences
- Analyse la solidité du transfert
- Estime les délais d'acquisition
- Identifie les chaînes de transfert

### 4.4 ContextAnalyzerService
- Évalue la criticité réelle dans le contexte
- Évalue la capacité d'absorption de l'équipe
- Vérifie la compatibilité des délais
- Identifie les signaux positifs et de vigilance

### 4.5 DoubtDetectorService
- Détecte les données manquantes
- Identifie les problèmes critiques
- Génère des actions recommandées
- Calcule le niveau de confiance

### 4.6 DecisionBuilderService
- Formule la recommandation principale
- Construit la justification
- Identifie les points forts et de vigilance
- Génère les questions pour l'entretien

### 4.7 ReasoningService
- Orchestre les 4 couches de raisonnement
- Mesure le temps de traitement
- Formate la sortie pour affichage

---

## 5. Contraintes de Production

- **Temps de raisonnement cible :** < 15 secondes
- **Format de sortie :** Structuré et lisible par un DRH non technique
- **Traçabilité :** Chaque argument doit citer sa source
- **Auditabilité :** L'arbre de décision doit être reconstituable
- **Conformité :** Vérification anti-biais avant toute sortie (réf. RH-860)

---

## 6. Périmètre d'Exclusion

Le moteur ne doit jamais :
- Décider à la place du recruteur
- Produire une recommandation sur des critères prohibés (réf. RH-000 et RH-860)
- Présenter une hypothèse comme un fait
- Omettre ses zones d'incertitude
- Forcer une décision quand les données sont insuffisantes

---

## 7. API Endpoints

### POST /reasoning/analyze
Analyse un candidat pour un poste avec raisonnement complet.

**Body :**
```json
{
  "candidateData": { ... },
  "jobData": { ... },
  "context": {
    "team": {
      "existingSkills": ["kubernetes", "docker"],
      "teamSize": 5,
      "seniorityDistribution": "2 senior, 3 junior"
    },
    "constraints": ["disponibilité immédiate"],
    "coveredSkills": ["kubernetes"]
  }
}
```

**Response :**
```json
{
  "layer1": { "facts": { ... }, "sources": [...] },
  "layer2": { "gapAnalysis": { ... } },
  "layer3": { "contextAnalysis": { ... } },
  "layer4": { "decision": { ... } },
  "metadata": { "processingTime": 1234, "timestamp": "2026-08-03T..." }
}
```

### POST /reasoning/format
Formate une décision pour affichage lisible.

---

## 8. Intégration

Le module `ReasoningModule` est intégré dans `AppModule` et dépend de :
- `MatchingModule`
- `SearchModule`

---

## 9. Tests et Validation

Voir DOC-007-06 : Protocole de test du raisonnement (golden dataset 100 cas).
