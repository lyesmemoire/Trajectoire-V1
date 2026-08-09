# DOC-M02-05 : Format d'Intégration dans le Debrief

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format d'intégration des silences dans le debrief pour le MVP-META-02 Silence Intelligence Engine. Ce document structure la section "Silences" du debrief et son format.

---

## 2. Principe Fondateur

La section "Silences" du debrief présente les sujets attendus non mentionnés par le candidat, classés par niveau de gravité, avec des interprétations possibles et des questions révélatrices recommandées.

---

## 3. Structure de la Section Silences

### 3.1 En-tête de la Section

**Format :**
```
## SUJETS ATTENDUS NON MENTIONNÉS
```

### 3.2 Résumé Global

**Format :**
```
**Niveau global de silence :** [Niveau 1/2/3/4]
**Nombre de sujets non mentionnés :** [X]
**Impact sur le scoring :** [−X points]
```

### 3.3 Détail par Niveau

**Format par niveau :**

#### Silence Niveau 1 (mineur) :
```
**[Sujet]** — Non mentionné spontanément.
À explorer si second entretien.
```

#### Silence Niveau 2 (notable) :
```
**[Sujet]** — Non mentionné spontanément.
Signal dans le debrief.
Question à poser si second entretien : "[Question révélatrice]"
Impact sur le scoring : −[X] points
```

#### Silence Niveau 3-4 (significatif/critique) :
```
**[Sujet]** — Absent de tout l'entretien.
**Niveau :** [Niveau 3/4]
**Interprétations possibles :**
- Option 1 : [interprétation bénigne]
- Option 2 : [interprétation vigilance]
- Option 3 : [interprétation critique]
**Question recommandée :**
"[Question révélatrice]"
**Impact sur le scoring :**
[dimension affectée] : −[X] points
Raison : donnée manquante
```

---

## 4. Template Complet

### 4.1 Format Markdown

```markdown
## SUJETS ATTENDUS NON MENTIONNÉS

**Niveau global de silence :** Niveau 2
**Nombre de sujets non mentionnés :** 3
**Impact sur le scoring :** −3 points

---

### Silence Niveau 1 (mineur) :

**Diversité et inclusion** — Non mentionné spontanément.
À explorer si second entretien.

---

### Silence Niveau 2 (notable) :

**Employer branding** — Non mentionné spontanément.
Signal dans le debrief.
Question à poser si second entretien : "Quelles sont les actions que vous avez menées pour renforcer la marque employeur ?"
Impact sur le scoring : −1 point

---

### Silence Niveau 3 (significatif) :

**CSE et relations sociales** — Absent de tout l'entretien.
**Niveau :** Niveau 3
**Interprétations possibles :**
- Option 1 : Poste sans CSE (entreprise de petite taille)
- Option 2 : Évitement du sujet relations sociales
- Option 3 : Manque d'expérience en relations sociales
**Question recommandée :**
"Vous ne m'avez pas parlé du CSE et des relations sociales. Quelle est votre expérience dans ce domaine ?"
**Impact sur le scoring :**
Relations sociales : −3 points
Raison : donnée manquante critique
```

### 4.2 Format JSON

```json
{
  "sectionTitle": "SUJETS ATTENDUS NON MENTIONNÉS",
  
  "summary": {
    "globalLevel": 2,
    "unmentionedTopicsCount": 3,
    "scoringImpact": -3
  },
  
  "silences": [
    {
      "topic": "Diversité et inclusion",
      "level": 1,
      "description": "Non mentionné spontanément.",
      "recommendedAction": "À explorer si second entretien.",
      "scoringImpact": 0,
      "revealingQuestion": null
    },
    {
      "topic": "Employer branding",
      "level": 2,
      "description": "Non mentionné spontanément.",
      "recommendedAction": "Signal dans le debrief. Question à poser si second entretien.",
      "scoringImpact": -1,
      "revealingQuestion": "Quelles sont les actions que vous avez menées pour renforcer la marque employeur ?"
    },
    {
      "topic": "CSE et relations sociales",
      "level": 3,
      "description": "Absent de tout l'entretien.",
      "interpretations": [
        "Poste sans CSE (entreprise de petite taille)",
        "Évitement du sujet relations sociales",
        "Manque d'expérience en relations sociales"
      ],
      "recommendedAction": "Alerte dans le debrief. Question recommandée.",
      "scoringImpact": -3,
      "revealingQuestion": "Vous ne m'avez pas parlé du CSE et des relations sociales. Quelle est votre expérience dans ce domaine ?",
      "affectedDimension": "Relations sociales",
      "reason": "Donnée manquante critique"
    }
  ]
}
```

---

## 5. Exemple Complet

### 5.1 Cas : Candidat DRH avec Silences Niveau 3

```markdown
## SUJETS ATTENDUS NON MENTIONNÉS

**Niveau global de silence :** Niveau 3
**Nombre de sujets non mentionnés :** 4
**Impact sur le scoring :** −8 points

---

### Silence Niveau 1 (mineur) :

**Diversité et inclusion** — Non mentionné spontanément.
À explorer si second entretien.

---

### Silence Niveau 3 (significatif) :

**CSE et relations sociales** — Absent de tout l'entretien.
**Niveau :** Niveau 3
**Interprétations possibles :**
- Option 1 : Poste sans CSE (entreprise de petite taille)
- Option 2 : Évitement du sujet relations sociales
- Option 3 : Manque d'expérience en relations sociales
**Question recommandée :**
"Vous ne m'avez pas parlé du CSE et des relations sociales. Quelle est votre expérience dans ce domaine ?"
**Impact sur le scoring :**
Relations sociales : −3 points
Raison : donnée manquante critique

---

### Silence Niveau 3 (significatif) :

**Politique salariale** — Absent de tout l'entretien.
**Niveau :** Niveau 3
**Interprétations possibles :**
- Option 1 : Poste sans responsabilité salariale
- Option 2 : Évitement du sujet financier
- Option 3 : Manque d'expérience en politique salariale
**Question recommandée :**
"Vous ne m'avez pas parlé de la politique salariale. Quelle est votre expérience dans ce domaine ?"
**Impact sur le scoring :**
Politique salariale : −3 points
Raison : donnée manquante critique

---

### Silence Niveau 3 (significatif) :

**Recrutement** — Absent de tout l'entretien.
**Niveau :** Niveau 3
**Interprétations possibles :**
- Option 1 : Poste sans responsabilité recrutement
- Option 2 : Évitement du sujet recrutement
- Option 3 : Manque d'expérience en recrutement
**Question recommandée :**
"Vous ne m'avez pas parlé du recrutement. Quelle est votre expérience dans ce domaine ?"
**Impact sur le scoring :**
Recrutement : −2 points
Raison : donnée manquante critique

---

**Conclusion :**
Les silences détectés (CSE, politique salariale, recrutement) sont des sujets fondamentaux pour un DRH. Ces absences suggèrent soit un poste sans ces responsabilités, soit un évitement délibéré. Un second entretien est fortement recommandé pour clarifier ces points.
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface SilenceDebriefEntry {
  topic: string;
  level: 1 | 2 | 3 | 4;
  description: string;
  
  interpretations?: string[];
  recommendedAction: string;
  revealingQuestion?: string;
  
  scoringImpact: number;
  affectedDimension?: string;
  reason?: string;
}

interface SilenceDebriefSection {
  sectionTitle: string;
  
  summary: {
    globalLevel: 1 | 2 | 3 | 4;
    unmentionedTopicsCount: number;
    scoringImpact: number;
  };
  
  silences: SilenceDebriefEntry[];
  
  conclusion?: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE silence_debrief_section (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  position_id VARCHAR(36) NOT NULL,
  
  section_title VARCHAR(100) NOT NULL,
  summary JSON NOT NULL,
  silences JSON NOT NULL,
  conclusion TEXT,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_silence_debrief_interview ON silence_debrief_section(interview_id);
CREATE INDEX idx_silence_debrief_candidate ON silence_debrief_section(candidate_id);
CREATE INDEX idx_silence_debrief_position ON silence_debrief_section(position_id);
```

---

## 8. API Endpoints

```typescript
// POST /api/silence-debrief-section/generate
async function generateSilenceDebriefSection(interviewId: string): Promise<SilenceDebriefSection> {
  return await generateSilenceDebriefSection(interviewId);
}

// GET /api/silence-drief-section/:interviewId
async function getSilenceDebriefSection(interviewId: string): Promise<SilenceDebriefSection> {
  return await getSilenceDebriefSectionByInterview(interviewId);
}

// PUT /api/silence-debrief-section/:interviewId
async function updateSilenceDebriefSection(interviewId: string, section: SilenceDebriefSection): Promise<SilenceDebriefSection> {
  return await updateSilenceDebriefSection(interviewId, section);
}

// POST /api/silence-debrief-section/export
async function exportSilenceDebriefSection(interviewId: string, format: 'markdown' | 'json'): Promise<any> {
  return await exportSilenceDebriefSection(interviewId, format);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Sections générées / entretiens | 100% |
- Taux de complétude | Sections complètes / générées | 100% |

### 9.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de consultation | Sections consultées / générées | ≥ 80% |
- Taux d'action | Actions recommandées suivies / total | ≥ 70% |

---

## 10. Conclusion

Le format d'intégration dans le debrief structure la section "Silences" du debrief. Structure : En-tête (SUJETS ATTENDUS NON MENTIONNÉS), Résumé global (Niveau global de silence, Nombre de sujets non mentionnés, Impact sur le scoring), Détail par niveau (Silence Niveau 1 mineur, Silence Niveau 2 notable, Silence Niveau 3-4 significatif/critique). Pour chaque silence : Sujet, Description, Niveau, Interprétations possibles, Question recommandée, Impact sur le scoring, Dimension affectée, Raison. Format Markdown et JSON. Exemple complet pour un candidat DRH avec silences Niveau 3. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Section "Silences" dans le debrief
- Résumé global
- Détail par niveau
- Format Markdown et JSON
- Exemple complet
- Interprétations possibles
- Questions recommandées
- Impact sur le scoring
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
