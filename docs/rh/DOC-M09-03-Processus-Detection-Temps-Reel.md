# DOC-M09-03 : Processus de Détection en Temps Réel

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le processus de détection en temps réel des décalages pour le MVP-META-09 Gap Detection Engine. Ce document structure le mécanisme de comparaison entre le discours du candidat et les comportements observés pendant l'entretien.

---

## 2. Principe Fondateur

Le moteur maintient deux colonnes en temps réel : Colonne A (ce que le candidat dit de lui) et Colonne B (ce que ses exemples montrent). Après chaque réponse, le moteur met à jour les deux colonnes, compare automatiquement, et détecte les divergences.

---

## 3. Processus de Détection

### 3.1 Étape 1 — Initialisation des Colonnes

**Colonne A : Ce que le candidat dit de lui**
- Initialisée vide au début de l'entretien
- Remplie progressivement avec les déclarations du candidat
- Contient les affirmations sur ses compétences, motivations, style de travail

**Colonne B : Ce que ses exemples montrent**
- Initialisée vide au début de l'entretien
- Remplie progressivement avec les preuves observées
- Contient les comportements réels, exemples concrets, actions passées

---

### 3.2 Étape 2 — Mise à Jour après Chaque Réponse

**Processus de mise à jour :**
1. Analyser la réponse du candidat
2. Extraire les déclarations (Colonne A)
3. Extraire les preuves comportementales (Colonne B)
4. Mettre à jour les deux colonnes

**Exemple de mise à jour :**
- Réponse : "Je suis très autonome, j'ai géré un projet de migration de données."
- Colonne A : "Très autonome"
- Colonne B : "Projet de migration de données en grand groupe structuré"

---

### 3.3 Étape 3 — Comparaison Automatique

**Processus de comparaison :**
1. Pour chaque décalage fondamental, comparer Colonne A et Colonne B
2. Identifier les divergences
3. Calculer le niveau de décalage (Léger/Modéré/Fort)
4. Détecter les signaux de décalage

**Critères de comparaison :**
- Leadership : Déclaration de leader vs absence de décisions solitaires
- Autonomie : Déclaration d'autonomie vs expériences structurées
- Ambition : Déclaration d'ambition vs absence d'initiatives proactives
- Motivation : Déclaration de sens vs comportement de calcul matériel
- Conflit : Déclaration de tolérance vs évitement observé

---

### 3.4 Étape 4 — Détection des Divergences

**Processus de détection :**
1. Analyser les signaux de décalage pour chaque type
2. Confirmer le décalage si le signal est présent
3. Enregistrer le niveau de décalage
4. Générer une alerte si le décalage est critique

**Niveaux de décalage :**
- **Léger** : Divergence mineure, impact limité
- **Modéré** : Divergence significative, impact notable
- **Fort** : Divergence majeure, impact critique

---

## 4. Structure de Données (TypeScript)

```typescript
interface RealTimeDetection {
  detectionId: string;
  recruitmentId: string;
  candidateId: string;
  
  columnA: {
    leadership: string[];
    autonomy: string[];
    ambition: string[];
    motivation: string[];
    conflict: string[];
  };
  
  columnB: {
    leadership: string[];
    autonomy: string[];
    ambition: string[];
    motivation: string[];
    conflict: string[];
  };
  
  comparison: {
    leadership: {
      divergence: boolean;
      level: 'none' | 'light' | 'moderate' | 'strong';
      signals: string[];
    };
    autonomy: {
      divergence: boolean;
      level: 'none' | 'light' | 'moderate' | 'strong';
      signals: string[];
    };
    ambition: {
      divergence: boolean;
      level: 'none' | 'light' | 'moderate' | 'strong';
      signals: string[];
    };
    motivation: {
      divergence: boolean;
      level: 'none' | 'light' | 'moderate' | 'strong';
      signals: string[];
    };
    conflict: {
      divergence: boolean;
      level: 'none' | 'light' | 'moderate' | 'strong';
      signals: string[];
    };
  };
  
  alerts: {
    critical: boolean;
    gaps: string[];
  };
  
  updatedAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE real_time_detection (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  column_a JSON NOT NULL,
  column_b JSON NOT NULL,
  comparison JSON NOT NULL,
  alerts JSON NOT NULL,
  
  updated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_real_time_detection_recruitment ON real_time_detection(recruitment_id);
CREATE INDEX idx_real_time_detection_candidate ON real_time_detection(candidate_id);
CREATE INDEX idx_real_time_detection_alerts ON real_time_detection(alerts->>'critical');
```

---

## 6. API Endpoints

```typescript
// POST /api/real-time-detection/initialize
async function initializeDetection(recruitmentId: string, candidateId: string): Promise<RealTimeDetection> {
  return await initializeDetection(recruitmentId, candidateId);
}

// PUT /api/real-time-detection/:detectionId/update
async function updateDetection(detectionId: string, response: string): Promise<RealTimeDetection> {
  return await updateDetection(detectionId, response);
}

// GET /api/real-time-detection/:detectionId
async function getRealTimeDetection(detectionId: string): Promise<RealTimeDetection> {
  return await getRealTimeDetection(detectionId);
}

// GET /api/real-time-detection/recruitment/:recruitmentId
async function getRealTimeDetectionByRecruitment(recruitmentId: string): Promise<RealTimeDetection> {
  return await getRealTimeDetectionByRecruitment(recruitmentId);
}

// GET /api/real-time-detection/alerts
async function getCriticalAlerts(): Promise<RealTimeDetection[]> {
  return await getCriticalAlerts();
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Processus

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de mise à jour en temps réel | Mises à jour / réponses | ≥ 95% |
- Latence de détection | Temps entre réponse et détection | ≤ 2 secondes |

### 7.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de détection correcte | Détections confirmées / totales | ≥ 85% |
- Taux de fausses alertes | Fausses alertes / totales | ≤ 10% |

---

## 8. Exemple Complet

```markdown
DÉTECTION EN TEMPS RÉEL

Colonne A (Ce qu'il dit) :
→ Leadership : "Je suis un leader naturel, je sais fédérer les équipes."
→ Autonomie : "J'aime l'autonomie, je n'ai pas besoin d'être managé."
→ Ambition : "Je cherche plus de responsabilités, je veux progresser rapidement."
→ Motivation : "Ce qui me motive c'est l'impact, le sens est plus important que le salaire."
→ Conflit : "Je gère bien les conflits, je suis direct."

Colonne B (Ce que ses exemples montrent) :
→ Leadership : Aucun exemple de décision solitaire, tous les exemples en équipe.
→ Autonomie : Toutes les expériences en grand groupe structuré avec processus.
→ Ambition : 6 ans dans le même poste sans initiative proactive de changement.
→ Motivation : Toutes les questions sur salaire, titre, avantages. Aucune sur projet.
→ Conflit : Tous les exemples se terminent par "terrain d'entente" ou "laisser tomber".

Comparaison :
→ Leadership : Divergence détectée (Modéré)
→ Autonomie : Divergence détectée (Léger)
→ Ambition : Divergence détectée (Modéré)
→ Motivation : Divergence détectée (Fort)
→ Conflit : Divergence détectée (Modéré)

Alertes :
→ Critique : Oui (Motivation forte divergence)
→ Décalages : Leadership, Autonomie, Ambition, Motivation, Conflit
```

---

## 9. Conclusion

Le processus de détection en temps réel structure le mécanisme de comparaison entre le discours du candidat et les comportements observés. Processus en 4 étapes : Initialisation des colonnes (Colonne A : discours, Colonne B : preuves), Mise à jour après chaque réponse (extraction déclarations et preuves), Comparaison automatique (analyse divergences, calcul niveau), Détection des divergences (confirmation décalage, génération alertes). 5 types de décalages comparés. 3 niveaux de décalage (Léger, Modéré, Fort). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Deux colonnes en temps réel
- Mise à jour après chaque réponse
- Comparaison automatique
- Détection des divergences
- 3 niveaux de décalage
- Alertes pour décalages critiques
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de processus et de qualité
