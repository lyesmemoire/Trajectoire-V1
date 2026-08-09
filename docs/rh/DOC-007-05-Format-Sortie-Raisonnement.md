# DOC-007-05 : Format Officiel de Sortie du Raisonnement

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format officiel de sortie du moteur de raisonnement pour garantir une présentation cohérente, lisible et actionnable pour les décideurs RH.

---

## 2. Structure de la Sortie

La sortie du moteur de raisonnement est structurée en 4 couches correspondant aux 4 couches de raisonnement.

### 2.1 Format JSON (API)

```json
{
  "layer1": {
    "facts": {
      "candidate": {
        "explicitSkills": [...],
        "implicitSkills": [...],
        "experiences": [...],
        "certifications": [...],
        "education": [...],
        "sectors": [...],
        "careerProgression": {...},
        "learningSignals": {...}
      },
      "job": {
        "criticalSkills": [...],
        "preferredSkills": [...],
        "optionalSkills": [...],
        "minExperience": 0,
        "teamContext": {...},
        "organizationalConstraints": [...],
        "coveredSkills": [...]
      }
    },
    "sources": ["CV", "KP-001", "KP-002"]
  },
  "layer2": {
    "gapAnalysis": {
      "gaps": [
        {
          "requiredSkill": "Kubernetes",
          "gapType": "transferable",
          "candidateSkill": "Docker",
          "proximity": 0.7,
          "transferChain": ["Docker", "Terraform", "AWS"],
          "transferSolidity": 0.85,
          "acquisitionDelay": "2-3 mois",
          "teamSupport": true,
          "criticality": "minor",
          "operationalImpact": "Faible",
          "compensation": "Onboarding structuré avec mentorat équipe",
          "source": "Transfer Patterns + Team Context"
        }
      ],
      "summary": {
        "directMatches": 5,
        "partialMatches": 3,
        "transferableGaps": 2,
        "nonCompensableGaps": 0
      }
    }
  },
  "layer3": {
    "contextAnalysis": {
      "criticalityAssessment": {
        "Kubernetes": "minor",
        "Python": "blocking"
      },
      "teamAbsorptionCapacity": true,
      "acquisitionDelayCompatibility": true,
      "adaptationCapacity": true,
      "positiveSignals": [
        "Capacité d'apprentissage rapide détectée",
        "Progression de carrière favorable"
      ],
      "vigilanceSignals": [
        "1 compétence bloquante manquante"
      ],
      "reasoning": [
        "1 compétence bloquante identifiée",
        "L'équipe peut absorber les manques pendant la montée en compétence",
        "Les délais d'acquisition sont compatibles avec les besoins opérationnels"
      ]
    }
  },
  "layer4": {
    "decision": {
      "recommendation": "recommend_with_conditions",
      "justification": [
        "5 compétences correspondantes directement",
        "2 compétences transférables identifiées",
        "L'équipe peut accompagner la montée en compétence",
        "Le candidat montre une capacité d'adaptation favorable"
      ],
      "strengths": [
        "Forte couverture des compétences requises",
        "Capacité de transfert de compétences",
        "Capacité d'apprentissage rapide",
        "Progression de carrière favorable"
      ],
      "vigilancePoints": [
        "1 compétence bloquante manquante",
        "Support équipe limité pour la montée en compétence"
      ],
      "residualGaps": [
        {
          "skill": "Python",
          "criticality": "blocking",
          "compensation": "Formation externe requise"
        }
      ],
      "confidence": "medium",
      "hypotheses": [
        "Absence de contexte équipe - capacité d'absorption non évaluée",
        "Les délais d'acquisition estimés sont basés sur des patterns généraux"
      ],
      "interviewQuestions": [
        {
          "question": "Comment avez-vous acquis Docker → Terraform → AWS ?",
          "importance": "Évaluer la capacité de transfert"
        },
        {
          "question": "Comment comptez-vous combler les compétences manquantes ?",
          "importance": "Évaluer le plan de développement"
        }
      ],
      "doubtDetection": {
        "hasDoubt": false,
        "confidence": "medium",
        "missingData": [],
        "recommendedActions": [],
        "reasoning": []
      }
    }
  },
  "metadata": {
    "processingTime": 1234,
    "timestamp": "2026-08-03T14:30:00.000Z"
  }
}
```

---

## 3. Format Lisible (Markdown)

Pour l'affichage dans l'interface utilisateur, le moteur fournit une version formatée en Markdown.

### 3.1 Méthode

Le service `ReasoningService` fournit la méthode `formatDecisionForDisplay(decision: ReasoningDecision): string`.

### 3.2 Format de Sortie Markdown

```markdown
# Je recommande ce candidat sous conditions

## Justification
- 5 compétences correspondantes directement
- 2 compétences transférables identifiées
- L'équipe peut accompagner la montée en compétence
- Le candidat montre une capacité d'adaptation favorable

## Points Forts
- Forte couverture des compétences requises
- Capacité de transfert de compétences
- Capacité d'apprentissage rapide
- Progression de carrière favorable

## Points de Vigilance
- 1 compétence bloquante manquante
- Support équipe limité pour la montée en compétence

## Écarts Résiduels
- Python (blocking): Formation externe requise

## Niveau de Confiance: MOYEN

## Hypothèses Posées
- Absence de contexte équipe - capacité d'absorption non évaluée
- Les délais d'acquisition estimés sont basés sur des patterns généraux

## Questions pour l'Entretien
- Comment avez-vous acquis Docker → Terraform → AWS ? (Évaluer la capacité de transfert)
- Comment comptez-vous combler les compétences manquantes ? (Évaluer le plan de développement)
```

### 3.3 Format en Cas de Données Insuffisantes

```markdown
# Je ne peux pas recommander sur ce profil avec les données disponibles

## Données Insuffisantes
- Compétences explicitement déclarées par le candidat
- Expériences professionnelles du candidat
- Formation académique du candidat
- Compétences critiques requises pour le poste

## Actions Recommandées
- Compléter les informations manquantes dans le CV ou la fiche de poste
- Réévaluer les exigences du poste ou rechercher un profil avec ces compétences
- Approfondir l'évaluation de la capacité d'adaptation en entretien

## Niveau de Confiance: FAIBLE

## Raisonnement
- Données insuffisantes : 4 information(s) manquante(s)
- Problèmes critiques identifiés : 2
```

---

## 4. Types de Recommandation

### 4.1 RECOMMANDER

**Condition :** Aucun écart bloquant, écart(s) significatif(s) ≤ 2, correspondances directes ≥ 5

**Texte :** `Je recommande ce candidat`

**Justification typique :** Profil fortement aligné avec les exigences du poste

### 4.2 NE PAS RECOMMANDER

**Condition :** Écart(s) bloquant(s) > 0 OU écart(s) significatif(s) ≥ 3

**Texte :** `Je ne recommande pas ce candidat`

**Justification typique :** Écarts trop importants pour garantir le succès

### 4.3 RECOMMANDER SOUS CONDITIONS

**Condition :** Écart(s) significatif(s) > 0 mais < 3, équipe peut absorber, délais compatibles

**Texte :** `Je recommande ce candidat sous conditions`

**Justification typique :** Profil pertinent sous conditions de formation/accompagnement

### 4.4 DONNÉES INSUFFISANTES

**Condition :** Données manquantes critiques OU confiance = low

**Texte :** `Je ne peux pas recommander sur ce profil avec les données disponibles`

**Justification typique :** Ce qui me manque pour décider : [liste précise]

---

## 5. Métadonnées

### 5.1 Temps de Traitement

Le moteur mesure et retourne le temps de traitement en millisecondes.

**Cible :** < 15 secondes

### 5.2 Timestamp

Le moteur retourne le timestamp de génération du raisonnement pour traçabilité.

### 5.3 Version

Le moteur peut inclure une version du modèle de raisonnement pour auditabilité.

---

## 6. Format d'Export

Pour l'auditabilité et la conformité, le moteur peut exporter le raisonnement dans différents formats :

### 6.1 JSON

Format natif de l'API. Utilisé pour l'intégration système.

### 6.2 Markdown

Format lisible pour les humains. Utilisé pour l'affichage UI.

### 6.3 PDF

Format pour l'archivage et la documentation. Généré à partir du format Markdown.

### 6.4 CSV

Format pour l'analyse de données. Export des décisions avec métadonnées.

---

## 7. Validation du Format

### 7.1 Validation JSON

Le schéma JSON est défini dans les interfaces TypeScript :

- `ReasoningOutput`
- `CollectedFacts`
- `GapAnalysisResult`
- `ContextAnalysis`
- `ReasoningDecision`
- `DoubtDetection`

### 7.2 Validation Markdown

Le format Markdown est validé pour :
- Cohérence des sections
- Présence obligatoire des sections clés
- Formatage correct des listes

### 7.3 Validation de Contenu

Le contenu est validé pour :
- Absence de critères prohibés (réf. RH-000 et RH-860)
- Présence de sources pour chaque argument
- Présence d'hypothèses quand applicable
- Présence de questions d'entretien quand applicable

---

## 8. Intégration UI

### 8.1 Affichage des 4 Couches

L'interface utilisateur peut afficher les 4 couches de manière progressive :

1. **Couche 1** : Accordéon "Faits collectés"
2. **Couche 2** : Accordéon "Analyse des écarts"
3. **Couche 3** : Accordéon "Contextualisation"
4. **Couche 4** : Section principale "Décision"

### 8.2 Affichage de la Décision

La décision est affichée en premier avec :
- Badge de couleur selon le type (vert = recommander, rouge = ne pas recommander, orange = sous conditions, gris = insuffisant)
- Niveau de confiance avec indicateur visuel
- Points forts en liste à puces
- Points de vigilance en liste à puces
- Questions d'entretien en accordéon

### 8.3 Export

L'utilisateur peut exporter :
- Le raisonnement complet en PDF
- La décision seule en Markdown
- Les données brutes en JSON

---

## 9. Conformité

Le format de sortie respecte :

- **RH-000** : Principes éthiques RH
- **RH-860** : Conformité et auditabilité
- **RGPD** : Protection des données personnelles
- **Accessibilité** : Format lisible et structuré

---

## 10. Exemple Complet

### 10.1 Cas : Recommandation avec Conditions

**Input :**
- Candidat : Docker, Terraform, AWS, Linux
- Poste : Kubernetes, Docker, Terraform, AWS
- Contexte : Équipe avec expert Kubernetes

**Output JSON :** (voir section 2.1)

**Output Markdown :** (voir section 3.2)

### 10.2 Cas : Données Insuffisantes

**Input :**
- Candidat : CV incomplet (pas d'expériences)
- Poste : Poste complet
- Contexte : Aucun

**Output Markdown :** (voir section 3.3)

---

## 11. Maintenance

Le format de sortie doit être révisé :
- Lors de l'ajout de nouvelles couches de raisonnement
- Lors de l'évolution des exigences de conformité
- Basé sur les retours d'expérience des utilisateurs
- Basé sur les besoins d'intégration UI
