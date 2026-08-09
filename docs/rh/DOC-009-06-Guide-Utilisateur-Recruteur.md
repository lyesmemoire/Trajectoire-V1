# DOC-009-06 : Guide Utilisateur Recruteur

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Guider les recruteurs dans l'utilisation de l'arbre de décision de MVP-009 Explainability. Ce guide explique comment lire et utiliser l'arbre de décision pour prendre des décisions éclairées et justifier ses choix.

---

## 2. Principe Fondateur

L'arbre de décision n'est pas une boîte noire. C'est un outil de transparence qui vous permet de comprendre le raisonnement du moteur et de justifier vos décisions. L'explication = confiance = adoption.

---

## 3. Introduction à l'Arbre de Décision

### 3.1 Qu'est-ce que l'Arbre de Décision ?

L'arbre de décision est une représentation visuelle du raisonnement du moteur. Il expose en 5 niveaux comment le moteur est arrivé à sa recommandation.

### 3.2 Pourquoi l'Utiliser ?

- **Comprendre** la recommandation du moteur
- **Justifier** votre décision auprès de votre équipe
- **Expliquer** au candidat pourquoi il a été retenu ou refusé
- **Apprendre** des critères qui comptent vraiment
- **Détecter** les erreurs potentielles du moteur

### 3.3 Quand l'Utiliser ?

- **Avant l'entretien** : Pour préparer vos questions
- **Après l'entretien** : Pour confirmer ou infirmer la recommandation
- **En comité de recrutement** : Pour justifier votre avis
- **En cas de doute** : Pour comprendre les points de vigilance
- **Pour le feedback** : Pour fournir un feedback structuré

---

## 4. Accès à l'Arbre de Décision

### 4.1 Depuis l'Interface Recruteur

```
┌─────────────────────────────────────────┐
│ WORKSPACE RECRUTEUR                    │
├─────────────────────────────────────────┤
│                                         │
│ Candidat : Jean Dupont                 │
│ Poste    : Développeur DevOps          │
│                                         │
│ Recommandation du moteur :              │
│ ✅ Candidat recommandé                │
│ Score : 82/100                          │
│                                         │
│ [Pourquoi cette recommandation ?]        │
│                                         │
│ [Voir le CV] [Voir la fiche de poste]  │
└─────────────────────────────────────────┘
```

Cliquez sur "Pourquoi cette recommandation ?" pour afficher l'arbre de décision.

### 4.2 Depuis le Copilot

```
┌─────────────────────────────────────────┐
│ COPILOT                                │
├─────────────────────────────────────────┤
│                                         │
│ Vous : "Pourquoi Jean Dupont est-il     │
│          recommandé ?"                  │
│                                         │
│ Copilot : "Voici l'explication :"       │
│                                         │
│ [Arbre de décision généré]              │
└─────────────────────────────────────────┘
```

Le Copilot peut générer l'arbre de décision sur demande.

---

## 5. Lecture de l'Arbre de Décision

### 5.1 NIVEAU 1 — Synthèse

**Ce que vous y trouverez :**
- Score global (0-100)
- Recommandation principale
- Niveau de confiance
- Nombre d'arguments traités

**Comment l'interpréter :**

| Score | Recommandation | Action |
|-------|----------------|--------|
| ≥ 80 | Recommandé | Confiance élevée, entretien recommandé |
| 60-79 | Recommandé avec conditions | Points de vigilance, vérifier en entretien |
| 40-59 | Non recommandé | Faible adéquation, entretien optionnel |
| < 40 | Non recommandé | Inadéquation forte, ne pas entretenir |

**Exemple :**
```
Score global : 82/100
Recommandation : ✅ Candidat recommandé
Confiance : Élevée
```
→ Le candidat est fortement recommandé. Vous pouvez procéder à l'entretien avec confiance.

---

### 5.2 NIVEAU 2 — Dimensions Analysées

**Ce que vous y trouverez :**
- Score par dimension (0- 100)
- Pondération de chaque dimension
- Points clés par dimension

**Les 5 dimensions :**

1. **Compétences techniques** (40%)
   - Correspondance avec les compétences requises
   - Niveau de maîtrise
   
2. **Expérience** (30%)
   - Pertinence de l'expérience
   - Durée et progression
   
3. **Formation & certifications** (10%)
   - Adéquation de la formation
   - Validité des certifications
   
4. **Soft skills** (10%)
   - Compétences comportementales détectées
   - Capacité de collaboration
   
5. **Adéquation contextuelle** (10%)
   - Fit avec l'équipe
   - Fit avec la culture

**Comment l'interpréter :**

| Dimension | Score | Interprétation |
|-----------|-------|----------------|
| ≥ 80 | Excellent | Dimension forte, point positif |
| 60-79 | Bon | Dimension satisfaisante |
| 40-59 | Acceptable | Dimension moyenne, point de vigilance |
| < 40 | Faible | Dimension faible, point négatif |

**Exemple :**
```
Compétences techniques : 78/100
Expérience : 85/100
Certifications : 90/100
Soft skills : 80/100
Contexte équipe : 85/100
```
→ Toutes les dimensions sont fortes (≥ 75). Le candidat est équilibré.

---

### 5.3 NIVEAU 3 — Détail par Compétence

**Ce que vous y trouverez :**
- Statut de chaque compétence (✅ ⚠️ 🔄 ❌)
- Score par compétence
- Source dans le CV
- Analyse du moteur

**Les statuts :**

| Statut | Signification | Action |
|--------|---------------|--------|
| ✅ Présente | Compétence explicitement présente | Confirmer en entretien |
| ⚠️ Partielle | Compétence partiellement présente | Vérifier le niveau en entretien |
| 🔄 Transférable | Compétence transférable via pattern | Vérifier la capacité d'apprentissage |
| ❌ Absente | Compétence absente du CV | Évaluer la criticité |

**Comment l'interpréter :**

**Exemple 1 : Compétence présente**
```
Python ✅ Score: 95 Source: "5 ans Python dans environnement production"
```
→ Le candidat maîtrise Python. Confirmez le niveau en entretien.

**Exemple 2 : Compétence transférable**
```
Kubernetes ⚠️ Score: 0 Transfert
```
→ Le candidat n'a pas Kubernetes mais a des compétences transférables. Vérifiez le niveau 4 pour comprendre le transfert.

**Exemple 3 : Compétence absente**
```
Terraform ❌ Score: 0 Absent
```
→ Le candidat n'a pas Terraform. Si c'est critique, c'est un point de vigilance.

---

### 5.4 NIVEAU 4 — Raisonnement de Transfert

**Ce que vous y trouverez :**
- Compétence manquante
- Compensateurs identifiés
- Chaîne de transfert expliquée
- Délai d'acquisition estimé
- Risque opérationnel
- Pattern appliqué

**Comment l'interpréter :**

**Exemple :**
```
Compétence manquante : Kubernetes
Compensateurs :
  → Docker (base commune 70%)
  → Terraform (logique infrastructure)
  → AWS Certified (écosystème compatible)
  → Progression carrière rapide
Délai estimé : 2 à 3 mois
Risque opérationnel : Faible
Pattern appliqué : KP-05 v2.1
```
→ Le candidat peut acquérir Kubernetes en 2-3 mois grâce à ses compétences compensatrices. Le risque est faible. Vous pouvez accepter ce transfert.

**Points de vigilance :**

| Délai estimé | Risque | Action |
|---------------|--------|--------|
| 1-2 mois | Faible | Acceptable sans condition |
| 2-4 mois | Moyen | Acceptable avec mentorat |
| 3-6 mois | Moyen | Acceptable avec plan de formation |
| > 6 mois | Élevé | À évaluer avec prudence |

---

### 5.5 NIVEAU 5 — Sources & Traçabilité

**Ce que vous y trouverez :**
- Règles appliquées avec références
- Pondérations actives
- Version du moteur
- Hypothèses posées
- Éléments non évalués

**Comment l'interpréter :**

**Règles appliquées :**
```
KP-05 Compétences v2.1
KP-01 Recrutement v1.8
Règle R-140-07 : Transfert container
```
→ Le raisonnement est basé sur des règles validées et documentées.

**Pondérations :**
```
Technique 40% / Expérience 30% / Context 20% / Soft 10%
```
→ Les compétences techniques ont le plus de poids dans cette décision.

**Hypothèses :**
```
Soft skills inférés (non confirmés)
```
→ Les soft skills n'ont pas été confirmés en entretien. C'est un point de vigilance.

**Éléments non évalués :**
```
Motivation non évaluée (absence de lettre de motivation)
```
→ La motivation n'a pas pu être évaluée. À vérifier en entretien.

---

## 6. Cas d'Usage

### 6.1 Cas 1 : Préparation de l'Entretien

**Situation :** Vous avez une recommandation positive et voulez préparer l'entretien.

**Action :**
1. Consultez le NIVEAU 2 pour identifier les dimensions fortes
2. Consultez le NIVEAU 3 pour identifier les compétences à approfondir
3. Consultez le NIVEAU 4 pour identifier les transferts à vérifier
4. Préparez vos questions en fonction des points de vigilance

**Exemple de questions :**
- NIVEAU 3 : "Vous avez 5 ans d'expérience Python. Pouvez-vous me décrire un projet complexe sur lequel vous avez travaillé ?"
- NIVEAU 4 : "Vous n'avez pas d'expérience Kubernetes mais avez Docker. Comment comptez-vous acquérir Kubernetes ?"

### 6.2 Cas 2 : Validation Après Entretien

**Situation :** Vous avez réalisé l'entretien et voulez valider la recommandation.

**Action :**
1. Comparez votre perception avec le NIVEAU 2
2. Vérifiez si les compétences que vous avez observées correspondent au NIVEAU 3
3. Ajustez votre décision en conséquence
4. Fournissez un feedback structuré

**Exemple :**
- Moteur : Score 82/100, recommandé
- Votre perception : Candidat excellent sur Python, moyen sur soft skills
- Décision : Retenu, mais avec vigilance sur les soft skills

### 6.3 Cas 3 : Justification en Comité

**Situation :** Vous devez justifier votre décision en comité de recrutement.

**Action :**
1. Exportez l'arbre de décision en PDF
2. Présentez le NIVEAU 1 (synthèse)
3. Appuyez-vous sur le NIVEAU 2 (dimensions)
4. Utilisez le NIVEAU 5 (sources) pour prouver la non-discrimination

**Exemple d'argumentation :**
- "Le candidat a un score de 82/100, avec des compétences techniques solides (78/100) et une expérience pertinente (85/100)."
- "La recommandation est basée sur des règles documentées (KP-05 v2.1)."
- "Aucun critère prohibé n'a été utilisé dans la décision."

### 6.4 Cas 4 : Feedback au Candidat

**Situation :** Vous devez expliquer au candidat pourquoi il a été refusé.

**Action :**
1. Utilisez le FORMAT 3 (Rapport candidat)
2. Expliquez les points forts (NIVEAU 2 et 3)
3. Expliquez les points d'amélioration (NIVEAU 3)
4. Mentionnez les droits du candidat (RGPD Article 22)

**Exemple :**
- "Votre profil est solide sur Python et Docker (score 78/100)."
- "Pour améliorer votre candidature, vous pourriez acquérir une expérience Kubernetes (estimé à 2-3 mois)."
- "Vous avez le droit de demander une explication détaillée de cette décision."

---

## 7. Bonnes Pratiques

### 7.1 Ne Pas Faire

- ❌ Ne prenez pas la recommandation du moteur comme vérité absolue
- ❌ N'ignorez pas les points de vigilance
- ❌ Ne sautez pas l'entretien sur la base du seul score
- ❌ N'utilisez pas l'arbre de décision pour discriminer
- ❌ Ne partagez pas l'arbre de décision sans anonymisation

### 7.2 À Faire

- ✅ Utilisez l'arbre comme outil d'aide à la décision
- ✅ Vérifiez les points de vigilance en entretien
- ✅ Complétez l'arbre avec votre jugement humain
- ✅ Utilisez l'arbre pour justifier vos décisions
- ✅ Respectez la confidentialité des données

### 7.3 Points de Vigilance

**Quand vous voyez un point de vigilance :**

1. **Identifiez** le type de point de vigilance
2. **Évaluez** la criticité pour le poste
3. **Préparez** des questions spécifiques pour l'entretien
4. **Notez** votre observation après l'entretien
5. **Ajustez** votre décision en conséquence

**Exemple :**
```
Point de vigilance : Soft skills non confirmés
Criticité : Moyenne pour poste DevOps
Action : Préparer des questions sur collaboration et communication
```

---

## 8. Glossaire

| Terme | Définition |
|--------|------------|
| Score global | Score global du candidat sur 100 |
| Recommandation | Décision du moteur (recommandé / non recommandé) |
| Confiance | Niveau de confiance du moteur (élevée / moyenne / faible) |
| Dimension | Catégorie d'évaluation (technique, expérience, etc.) |
| Pondération | Poids de chaque dimension dans la décision globale |
| Compétence transférable | Compétence qui peut être acquise via d'autres compétences |
| Pattern de transfert | Règle documentée de transfert de compétences |
| Délai d'acquisition | Temps estimé pour acquérir une compétence transférable |
| Risque opérationnel | Risque que le transfert ne fonctionne pas |
| Hypothèse | Élément inféré par le moteur car non explicitement présent |
| Point de vigilance | Élément qui nécessite une attention particulière |

---

## 9. Foire aux Questions

### 9.1 Le moteur peut-il se tromper ?

**Oui.** Le moteur est un outil d'aide à la décision, pas un substitut à votre jugement. Les points de vigilance indiquent les zones d'incertitude.

### 9.2 Puis-je contester la recommandation ?

**Oui.** Vous avez toujours le dernier mot. Le moteur propose, vous décidez.

### 9.3 L'arbre de décision est-il conforme au RGPD ?

**Oui.** L'arbre de décision est conçu pour être conforme au RGPD Article 22 (droit à l'explication).

### 9.4 Puis-je partager l'arbre de décision ?

**Oui, avec précautions.** Pour un usage interne, oui. Pour un usage externe (candidat), utilisez le FORMAT 3 (rapport candidat) qui anonymise les données sensibles.

### 9.5 Comment puis-je améliorer la qualité de l'arbre ?

En fournissant un feedback structuré après chaque décision. Le moteur apprend de vos feedbacks (voir MVP-008 Learning Engine).

---

## 10. Support et Assistance

### 10.1 Aide en Ligne

- **Documentation** : Disponible dans le portail d'aide
- **Tutoriels vidéo** : Disponibles sur la plateforme d'apprentissage
- **FAQ** : Disponible dans le centre d'aide

### 10.2 Contact Support

**Pour toute question :**
- Email : support@trajectoire.com
- Téléphone : +33 1 23 45 67 89
- Chat en direct : Disponible dans l'interface (9h-18h, lun-ven)

### 10.3 Formation

Des sessions de formation sont disponibles :
- **Formation de base** (2 heures) : Introduction à l'arbre de décision
- **Formation avancée** (4 heures) : Analyse approfondie et utilisation avancée
- **Atelier pratique** (2 heures) : Cas d'usage réels

---

## 11. Conclusion

L'arbre de décision est votre allié pour :

- **Comprendre** les recommandations du moteur
- **Justifier** vos décisions
- **Améliorer** la qualité du recrutement
- **Respecter** les obligations légales

Utilisez-le judicieusement, et n'hésitez pas à faire appel au support si vous avez des questions.
