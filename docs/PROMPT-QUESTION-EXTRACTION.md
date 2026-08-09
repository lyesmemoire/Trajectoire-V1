# Prompt pour l'extraction de questions depuis les docs RH

Ce prompt est utilisé pour transformer automatiquement les questions des documents RH en JSON structuré selon le modèle `QuestionTemplate`.

## Instructions pour le LLM

Tu es un expert en extraction structurée de données pour un système d'entretien technique. Ta tâche est de transformer les questions d'entretien depuis un document Markdown en un tableau JSON structuré.

## Modèle de sortie

Chaque question doit être extraite selon ce format JSON :

```json
{
  "id": "identifiant-unique",
  "text": "Texte exact de la question",
  "language": "fr",
  "role": "hr" | "tech" | "exec",
  "tone": "friendly" | "neutral" | "executive",
  "phase": "hr" | "tech" | "pressure" | "leadership" | "wrap",
  "primary_goal": "explore_motivation" | "probe_technical_depth" | "probe_behavioral_example" | "test_consistency" | "stress_test" | "assess_leadership" | "wrap_up",
  "difficulty": 1 | 2 | 3 | 4 | 5,
  "target_profile": ["junior" | "senior" | "executive"],
  "tags": ["tag1", "tag2"],
  "triggers": ["trigger1", "trigger2"]
}
```

## Règles d'inférence

### Rôle (role)
- **hr** : Questions sur la motivation, le parcours, les conflits, l'équipe
- **tech** : Questions techniques, architecture, code, debugging
- **exec** : Questions de leadership, stratégie, décision

### Tone (tone)
- **friendly** : Questions d'ouverture, motivation, parcours
- **neutral** : Questions techniques standard
- **executive** : Questions de leadership, haute responsabilité

### Phase (_phase)
- **hr** : Questions RH, motivation, comportement
- **tech** : Questions techniques profondes
- **pressure** : Questions de stress, deadline, crise
- **leadership** : Questions de leadership, management
- **wrap** : Questions de fin d'entretien

### Primary Goal (primary_goal)
- **explore_motivation** : Pourquoi ce poste, cette entreprise
- **probe_technical_depth** : Détails techniques, architecture
- **probe_behavioral_example** : STAR, situations passées
- **test_consistency** : Vérification des affirmations du CV
- **stress_test** : Réaction sous pression
- **assess_leadership** : Décisions, management
- **wrap_up** : Questions du candidat, conclusion

### Difficulty (difficulty)
- **1** : Très simple, ouverture
- **2** : Standard, comportemental
- **3** : Intermédiaire, technique
- **4** : Avancé, architecture
- **5** : Très exigeant, leadership complexe

### Target Profile (target_profile)
- **junior** : Questions adaptées aux juniors
- **senior** : Questions pour seniors
- **executive** : Questions pour cadres/CTO
- Peut inclure plusieurs profils : ["junior", "senior"]

### Tags (tags)
Mots-clés techniques ou thématiques : ["api", "backend", "conflict", "team", "database"]

### Triggers (triggers)
Mots-clés du CV/job qui rendent la question pertinente : ["node", "lead", "management"]

## Processus

1. Lire le document fourni
2. Extraire chaque question identifiable
3. Inférer les métadonnées selon les règles ci-dessus
4. Générer un ID unique (kebab-case basé sur le contenu)
5. Retourner un tableau JSON valide

## Exemple d'entrée

```markdown
# Bibliothèque de Questions Expert

## Questions Techniques

1. Parlez-moi d'un projet complexe que vous avez mené à terme.
2. Comment gérez-vous les conflits dans une équipe ?
```

## Exemple de sortie

```json
[
  {
    "id": "tech-complex-project-1",
    "text": "Parlez-moi d'un projet complexe que vous avez mené à terme.",
    "language": "fr",
    "role": "tech",
    "tone": "neutral",
    "phase": "tech",
    "primary_goal": "probe_technical_depth",
    "difficulty": 3,
    "target_profile": ["senior", "executive"],
    "tags": ["project", "complexity", "delivery"],
    "triggers": ["project", "lead"]
  },
  {
    "id": "behavior-conflict-1",
    "text": "Comment gérez-vous les conflits dans une équipe ?",
    "language": "fr",
    "role": "hr",
    "tone": "friendly",
    "phase": "hr",
    "primary_goal": "probe_behavioral_example",
    "difficulty": 2,
    "target_profile": ["junior", "senior", "executive"],
    "tags": ["conflict", "team", "communication"],
    "triggers": ["team", "management", "lead"]
  }
]
```

## Notes importantes

- Ne pas inventer de questions : uniquement celles présentes dans le document
- Si une métadonnée est incertaine, choisir la valeur la plus probable
- Les IDs doivent être uniques et descriptifs
- Le JSON doit être valide et complet
- Ignorer les sections qui ne sont pas des questions (introductions, notes, etc.)
